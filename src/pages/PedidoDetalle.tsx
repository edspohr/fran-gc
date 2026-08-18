import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import OrderItemList from '@/components/orders/OrderItemList';
import Button from '@/components/ui/Button';
import { subscribeOrder, changeOrderStatus } from '@/lib/orders';
import { useClientProfile } from '@/contexts/ClientProfileContext';
import { countItems, type Order } from '@/types/order';

export default function PedidoDetalle() {
  const { orderId } = useParams();
  const { profile } = useClientProfile();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

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
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-6">
          <div className="h-6 w-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
        </div>
      </section>
    );
  }
  if (!order || !profile) {
    return (
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-6 space-y-3">
          <p className="text-cream">Pedido no encontrado.</p>
          <Link to="/mis-pedidos" className="text-gold hover:text-gold-hover text-sm">
            ← Volver a mis pedidos
          </Link>
        </div>
      </section>
    );
  }

  const confirm = async () => {
    setConfirming(true);
    try {
      await changeOrderStatus(order.id, 'confirmado', { uid: profile.uid, role: 'cliente' });
    } finally {
      setConfirming(false);
    }
  };

  return (
    <section className="py-14">
      <div className="mx-auto max-w-3xl px-6 space-y-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <Eyebrow>Pedido {order.id}</Eyebrow>
            <h1 className="font-serif text-3xl mt-1">Detalle</h1>
            <HairlineRule />
          </div>
          <OrderStatusBadge status={order.status} hasDifference={order.hasDifference} />
        </div>

        <div className="bg-surface-1 border border-gold/15 rounded-lg p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <p>
              <span className="text-cream-muted">Fecha de entrega:</span>{' '}
              <span className="text-cream">{order.deliveryDate.toDate().toLocaleDateString('es-CL')}</span>
            </p>
            <p>
              <span className="text-cream-muted">Ítems:</span>{' '}
              <span className="text-cream">{order.items.length} · {countItems(order.items)} unid.</span>
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg text-cream mb-2">Productos</h2>
            <OrderItemList items={order.items} />
          </div>

          {order.notes && (
            <div>
              <h3 className="text-xs uppercase tracking-eyebrow text-cream-muted mb-1">Notas</h3>
              <p className="text-sm text-cream">{order.notes}</p>
            </div>
          )}

          {order.status === 'entregado' && order.hasDifference && order.differenceNotes && (
            <div className="border-t border-wine/30 pt-3">
              <h3 className="text-xs uppercase tracking-eyebrow text-wine mb-1">Diferencia registrada</h3>
              <p className="text-sm text-cream">{order.differenceNotes}</p>
            </div>
          )}
        </div>

        {order.status === 'borrador' && (
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => void confirm()} disabled={confirming}>
              {confirming ? 'Confirmando…' : 'Confirmar este pedido'}
            </Button>
            <Button as="a" href={`/pedido?draft=${order.id}`} variant="ghost">
              Editar borrador
            </Button>
          </div>
        )}

        <Link to="/mis-pedidos" className="text-sm text-gold hover:text-gold-hover">
          ← Volver a mis pedidos
        </Link>
      </div>
    </section>
  );
}
