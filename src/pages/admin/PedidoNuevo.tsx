import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminShell from '@/components/admin/AdminShell';
import OrderBuilder from '@/components/orders/OrderBuilder';
import Button from '@/components/ui/Button';
import { subscribeClients } from '@/lib/clients';
import { usePublicProducts } from '@/hooks/useProducts';
import { createOrder } from '@/lib/orders';
import { useAuth } from '@/hooks/useAuth';
import type { Client } from '@/types/client';
import type { OrderItem } from '@/types/order';
import { useSeo } from '@/lib/seo';

export default function AdminPedidoNuevo() {
  useSeo({ title: 'Nuevo pedido · Admin FRAN GC', noindex: true });
  const nav = useNavigate();
  const { user } = useAuth();
  const { products, loading: productsLoading } = usePublicProducts();
  const [clients, setClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState<Client | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = subscribeClients((list) => {
      setClients(list.filter((c) => c.status === 'activo'));
    });
    return () => unsub();
  }, []);

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      `${c.company} ${c.name} ${c.email} ${c.comuna}`.toLowerCase().includes(q),
    );
  }, [clients, search]);

  const submit = async (data: { items: OrderItem[]; deliveryDate: Date; notes: string }) => {
    if (!selected || !user) return;
    const o = await createOrder({
      client: selected,
      items: data.items,
      deliveryDate: data.deliveryDate,
      notes: data.notes,
      status: 'confirmado',
      placedBy: 'admin',
      placedByUid: user.uid,
      placedByRole: 'admin',
    });
    nav(`/admin/pedidos/${o.id}`);
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl">Nuevo pedido</h1>
          <p className="text-cream-muted text-sm mt-1">
            {selected
              ? `Armando pedido para ${selected.company || selected.name}`
              : 'Seleccione el cliente para comenzar.'}
          </p>
        </div>

        {!selected ? (
          <div className="space-y-4 max-w-2xl">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente por empresa, nombre o email…"
              className="w-full bg-surface-1 border border-gold/20 rounded px-4 py-3 text-base text-cream placeholder:text-cream-muted/60 focus:outline-none focus:border-gold/60"
              autoFocus
            />
            {!clients.length ? (
              <p className="text-cream-muted">No hay clientes activos.</p>
            ) : !filteredClients.length ? (
              <p className="text-cream-muted">Sin resultados.</p>
            ) : (
              <ul className="divide-y divide-gold/10 border-y border-gold/10">
                {filteredClients.map((c) => (
                  <li key={c.uid}>
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="w-full py-3 text-left flex items-center justify-between hover:bg-surface-1 -mx-4 px-4"
                    >
                      <div className="min-w-0">
                        <p className="text-cream font-medium">{c.company || c.name}</p>
                        <p className="text-xs text-cream-muted truncate">
                          {c.name} · {c.comuna} · {c.phone}
                        </p>
                      </div>
                      <span className="text-xs text-gold uppercase tracking-eyebrow">Elegir →</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-surface-1 border border-gold/15 rounded p-3">
              <div>
                <p className="text-cream font-medium">{selected.company || selected.name}</p>
                <p className="text-xs text-cream-muted">{selected.name} · {selected.email}</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => setSelected(null)}>
                Cambiar
              </Button>
            </div>

            {productsLoading ? (
              <p className="text-cream-muted">Cargando productos…</p>
            ) : (
              <OrderBuilder
                products={products}
                clientLabel={`Pedido para ${selected.company || selected.name}`}
                submitLabel="Registrar pedido confirmado"
                onSubmit={submit}
              />
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
