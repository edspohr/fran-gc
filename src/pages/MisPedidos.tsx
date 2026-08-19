import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import Button from '@/components/ui/Button';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { useClientProfile } from '@/contexts/ClientProfileContext';
import { subscribeMyOrders } from '@/lib/orders';
import { countItems, type Order } from '@/types/order';

export default function MisPedidos() {
  const { profile, isVerified } = useClientProfile();
  const nav = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const unsub = subscribeMyOrders(profile.uid, (list) => {
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, [profile]);

  if (!profile) return null;

  const repeat = (o: Order) => {
    nav('/pedido', { state: { items: o.items, sourceOrderId: o.id } });
  };

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>Mis pedidos</Eyebrow>
            <h1 className="font-serif text-3xl md:text-4xl mt-1">Historial</h1>
            <HairlineRule />
          </div>
          {isVerified && (
            <Button as="a" href="/pedido">
              Nuevo pedido
            </Button>
          )}
        </div>

        {loading ? (
          <div className="h-6 w-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
        ) : !orders.length ? (
          <p className="text-sm text-cream-muted">Aún no tiene pedidos registrados.</p>
        ) : (
          <ul className="divide-y divide-gold/10 border-y border-gold/10">
            {orders.map((o) => (
              <li key={o.id} className="py-4 flex items-center justify-between gap-3 -mx-4 px-4 hover:bg-surface-1">
                <Link to={`/mis-pedidos/${o.id}`} className="flex-1 min-w-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-cream font-medium">{o.id}</p>
                    <p className="text-xs text-cream-muted">
                      {o.items.length} producto{o.items.length === 1 ? '' : 's'} · {countItems(o.items)} unidad{countItems(o.items) === 1 ? '' : 'es'} · entrega {o.deliveryDate.toDate().toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <OrderStatusBadge status={o.status} hasDifference={o.hasDifference} />
                </Link>
                {isVerified && (
                  <button
                    type="button"
                    onClick={() => repeat(o)}
                    className="px-2.5 py-1 text-xs uppercase tracking-eyebrow border border-gold/40 rounded text-cream hover:border-gold/70 shrink-0"
                  >
                    Repetir
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
