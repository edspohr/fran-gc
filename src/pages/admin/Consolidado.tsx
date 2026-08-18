import { useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import Button from '@/components/ui/Button';
import DeliveryDatePicker, { addDaysIso, todayIso } from '@/components/orders/DeliveryDatePicker';
import { batchChangeStatus, consolidateByProduct, subscribeOrdersByStatus } from '@/lib/orders';
import { useAuth } from '@/hooks/useAuth';
import { countItems, type Order } from '@/types/order';
import { useSeo } from '@/lib/seo';

export default function AdminConsolidado() {
  useSeo({ title: 'Consolidado · Admin FRAN GC', noindex: true });
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(addDaysIso(todayIso(), 7));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeOrdersByStatus('confirmado', (list) => {
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const inRange = useMemo(() => {
    const start = new Date(from + 'T00:00:00').getTime();
    const end = new Date(to + 'T23:59:59').getTime();
    return orders.filter((o) => {
      const t = o.deliveryDate.toDate().getTime();
      return t >= start && t <= end;
    });
  }, [orders, from, to]);

  const selectedOrders = useMemo(() => inRange.filter((o) => selected.has(o.id)), [inRange, selected]);
  const consolidated = useMemo(() => consolidateByProduct(selectedOrders), [selectedOrders]);

  const toggleAll = () => {
    if (selected.size === inRange.length) setSelected(new Set());
    else setSelected(new Set(inRange.map((o) => o.id)));
  };
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const markInPrep = async () => {
    if (!user || !selectedOrders.length) return;
    setBusy(true);
    setMessage(null);
    try {
      await batchChangeStatus(
        selectedOrders.map((o) => o.id),
        'en-preparacion',
        { uid: user.uid, role: 'admin' },
      );
      setMessage(`${selectedOrders.length} pedido${selectedOrders.length === 1 ? '' : 's'} marcado${selectedOrders.length === 1 ? '' : 's'} como en preparación.`);
      setSelected(new Set());
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl">Consolidado a fábrica</h1>
          <p className="text-cream-muted text-sm mt-1">
            Sume cantidades entre pedidos confirmados y márquelos como enviados a fábrica.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <DeliveryDatePicker value={from} onChange={setFrom} min="2020-01-01" />
          <DeliveryDatePicker value={to} onChange={setTo} min={from} />
        </div>

        {loading ? (
          <p className="text-cream-muted">Cargando…</p>
        ) : !inRange.length ? (
          <p className="text-cream-muted">Sin pedidos confirmados en este rango de fechas.</p>
        ) : (
          <>
            <div className="bg-surface-1 border border-gold/15 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gold/15">
                <label className="flex items-center gap-2 text-xs uppercase tracking-eyebrow text-cream-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.size === inRange.length && inRange.length > 0}
                    onChange={toggleAll}
                    className="accent-gold"
                  />
                  {selected.size} de {inRange.length} seleccionado{inRange.length === 1 ? '' : 's'}
                </label>
                <Button
                  type="button"
                  onClick={() => void markInPrep()}
                  disabled={busy || !selected.size}
                >
                  {busy ? 'Actualizando…' : 'Marcar como en preparación'}
                </Button>
              </div>
              <ul className="divide-y divide-gold/10">
                {inRange.map((o) => (
                  <li key={o.id}>
                    <label className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.has(o.id)}
                        onChange={() => toggle(o.id)}
                        className="accent-gold"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-cream font-medium">
                          {o.id} — {o.clientSnapshot.company || o.clientSnapshot.name}
                        </p>
                        <p className="text-xs text-cream-muted">
                          {o.deliveryDate.toDate().toLocaleDateString('es-CL')} · {o.items.length} producto{o.items.length === 1 ? '' : 's'} · {countItems(o.items)} un.
                        </p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {message && <p className="text-sm text-gold">{message}</p>}

            {selectedOrders.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl text-cream">Total por producto</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-eyebrow text-cream-muted border-b border-gold/15">
                        <th className="py-2 pr-3">Producto</th>
                        <th className="py-2 pr-3">Presentación</th>
                        <th className="py-2 pr-3 text-right">Total</th>
                        <th className="py-2 pr-3 hidden md:table-cell">Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consolidated.map((row) => (
                        <tr key={row.slug} className="border-b border-gold/10">
                          <td className="py-3 pr-3 text-cream font-medium">{row.name}</td>
                          <td className="py-3 pr-3 text-cream-muted">{row.presentation}</td>
                          <td className="py-3 pr-3 text-right text-cream font-medium">
                            {row.totalQuantity}
                          </td>
                          <td className="py-3 pr-3 hidden md:table-cell text-xs text-cream-muted">
                            {row.perOrder.map((po) => `${po.clientName} (${po.quantity})`).join(' · ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
