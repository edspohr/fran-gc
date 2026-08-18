import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '@/components/admin/AdminShell';
import Chip from '@/components/ui/Chip';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { subscribeAllOrders } from '@/lib/orders';
import { countItems, orderStatusLabel, type Order, type OrderStatus } from '@/types/order';
import { useSeo } from '@/lib/seo';

const TABS: (OrderStatus | 'todos')[] = ['confirmado', 'en-preparacion', 'entregado', 'borrador', 'todos'];

export default function AdminPedidos() {
  useSeo({ title: 'Pedidos · Admin FRAN GC', noindex: true });
  const [tab, setTab] = useState<OrderStatus | 'todos'>('confirmado');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAllOrders((list) => {
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (tab !== 'todos' && o.status !== tab) return false;
      if (q) {
        const hay = `${o.id} ${o.clientSnapshot.company} ${o.clientSnapshot.name} ${o.clientSnapshot.email} ${o.clientSnapshot.comuna}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, tab, search]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl">Pedidos</h1>
            <p className="text-cream-muted text-sm mt-1">{filtered.length} pedido{filtered.length === 1 ? '' : 's'}</p>
          </div>
          <Link to="/admin/pedidos/nuevo" className="px-4 py-2 text-sm bg-gold text-ink font-medium rounded hover:bg-gold-hover">
            + Nuevo pedido
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, cliente, empresa…"
            className="w-full md:max-w-sm bg-surface-1 border border-gold/20 rounded px-4 py-2 text-sm text-cream placeholder:text-cream-muted/60 focus:outline-none focus:border-gold/60"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((s) => (
            <Chip key={s} active={tab === s} onClick={() => setTab(s)}>
              {s === 'todos' ? 'Todos' : orderStatusLabel(s as OrderStatus)}
            </Chip>
          ))}
        </div>

        {loading ? (
          <p className="text-cream-muted">Cargando…</p>
        ) : filtered.length === 0 ? (
          <p className="text-cream-muted">Sin pedidos que coincidan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-eyebrow text-cream-muted border-b border-gold/15">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Cliente</th>
                  <th className="py-2 pr-3 hidden md:table-cell">Fecha entrega</th>
                  <th className="py-2 pr-3 hidden lg:table-cell">Ítems</th>
                  <th className="py-2 pr-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-gold/10 hover:bg-surface-1">
                    <td className="py-3 pr-3">
                      <Link to={`/admin/pedidos/${o.id}`} className="text-cream font-medium hover:text-gold">
                        {o.id}
                      </Link>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="text-cream">{o.clientSnapshot.company || o.clientSnapshot.name}</p>
                      <p className="text-xs text-cream-muted">{o.clientSnapshot.comuna}</p>
                    </td>
                    <td className="py-3 pr-3 hidden md:table-cell text-cream-muted">
                      {o.deliveryDate.toDate().toLocaleDateString('es-CL')}
                    </td>
                    <td className="py-3 pr-3 hidden lg:table-cell text-cream-muted">
                      {o.items.length} · {countItems(o.items)} un.
                    </td>
                    <td className="py-3 pr-3">
                      <OrderStatusBadge status={o.status} hasDifference={o.hasDifference} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
