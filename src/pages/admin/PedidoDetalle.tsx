import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminShell from '@/components/admin/AdminShell';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import OrderItemList from '@/components/orders/OrderItemList';
import StatusStepper from '@/components/orders/StatusStepper';
import { changeOrderStatus, subscribeOrder } from '@/lib/orders';
import { useAuth } from '@/hooks/useAuth';
import { countItems, orderStatusLabel, type Order, type OrderStatus } from '@/types/order';
import { useSeo } from '@/lib/seo';

export default function AdminPedidoDetalle() {
  useSeo({ title: 'Pedido · Admin FRAN GC', noindex: true });
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const unsub = subscribeOrder(orderId, (o) => {
      setOrder(o);
      setLoading(false);
    });
    return () => unsub();
  }, [orderId]);

  if (loading) {
    return (
      <AdminShell>
        <p className="text-cream-muted">Cargando…</p>
      </AdminShell>
    );
  }
  if (!order || !user) {
    return (
      <AdminShell>
        <p className="text-cream">Pedido no encontrado.</p>
        <Link to="/admin/pedidos" className="text-gold text-sm mt-3 inline-block">← Volver</Link>
      </AdminShell>
    );
  }

  const doChange = async (to: OrderStatus, extras?: { hasDifference?: boolean; differenceNotes?: string }) => {
    await changeOrderStatus(order.id, to, { uid: user.uid, role: 'admin' }, extras);
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="eyebrow text-gold">Pedido</p>
            <h1 className="font-serif text-3xl">{order.id}</h1>
          </div>
          <OrderStatusBadge status={order.status} hasDifference={order.hasDifference} />
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <div className="bg-surface-1 border border-gold/15 rounded-lg p-5 space-y-3">
              <h2 className="font-serif text-lg text-cream">Cliente</h2>
              <div className="text-sm grid grid-cols-2 gap-y-1">
                <span className="text-cream-muted">Empresa:</span>
                <span className="text-cream">{order.clientSnapshot.company || '—'}</span>
                <span className="text-cream-muted">Nombre:</span>
                <span className="text-cream">{order.clientSnapshot.name}</span>
                <span className="text-cream-muted">Email:</span>
                <span className="text-cream">{order.clientSnapshot.email}</span>
                <span className="text-cream-muted">Teléfono:</span>
                <span className="text-cream">{order.clientSnapshot.phone}</span>
                <span className="text-cream-muted">Comuna:</span>
                <span className="text-cream">{order.clientSnapshot.comuna}</span>
              </div>
            </div>

            <div className="bg-surface-1 border border-gold/15 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg text-cream">Productos</h2>
                <p className="text-xs text-cream-muted">
                  {order.items.length} · {countItems(order.items)} unid.
                </p>
              </div>
              <OrderItemList items={order.items} />
              <p className="text-sm text-cream-muted">
                Fecha de entrega:{' '}
                <span className="text-cream">{order.deliveryDate.toDate().toLocaleDateString('es-CL')}</span>
              </p>
              {order.notes && (
                <div>
                  <h3 className="text-xs uppercase tracking-eyebrow text-cream-muted mb-1">Notas del cliente</h3>
                  <p className="text-sm text-cream">{order.notes}</p>
                </div>
              )}
              {order.hasDifference && order.differenceNotes && (
                <div className="border-t border-wine/30 pt-3">
                  <h3 className="text-xs uppercase tracking-eyebrow text-wine mb-1">Diferencia</h3>
                  <p className="text-sm text-cream">{order.differenceNotes}</p>
                </div>
              )}
            </div>

            <div className="bg-surface-1 border border-gold/15 rounded-lg p-5 space-y-2">
              <h2 className="font-serif text-lg text-cream">Historial</h2>
              <ul className="text-xs text-cream-muted space-y-1">
                {order.statusHistory.map((ev, i) => (
                  <li key={i}>
                    <span className="text-cream">{orderStatusLabel(ev.status)}</span>{' '}
                    · {ev.at.toDate().toLocaleString('es-CL')} · {ev.byRole}
                    {ev.note && ` — ${ev.note}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4 md:sticky md:top-24 h-fit">
            <div className="bg-surface-1 border border-gold/15 rounded-lg p-5 space-y-3">
              <h2 className="font-serif text-lg text-cream">Acciones</h2>
              <StatusStepper
                current={order.status}
                hasDifference={order.hasDifference}
                onChange={doChange}
              />
            </div>
          </aside>
        </div>

        <Link to="/admin/pedidos" className="text-sm text-gold hover:text-gold-hover">← Volver a pedidos</Link>
      </div>
    </AdminShell>
  );
}
