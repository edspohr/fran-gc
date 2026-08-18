import { useNavigate } from 'react-router-dom';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import OrderBuilder from '@/components/orders/OrderBuilder';
import { usePublicProducts } from '@/hooks/useProducts';
import { useClientProfile } from '@/contexts/ClientProfileContext';
import { createOrder } from '@/lib/orders';
import type { OrderItem } from '@/types/order';

interface OrderPayload {
  items: OrderItem[];
  deliveryDate: Date;
  notes: string;
}

export default function Pedido() {
  const { profile } = useClientProfile();
  const { products, loading } = usePublicProducts();
  const nav = useNavigate();

  if (!profile) return null;

  const submitDraft = async (data: OrderPayload) => {
    const o = await createOrder({
      client: profile,
      items: data.items,
      deliveryDate: data.deliveryDate,
      notes: data.notes,
      status: 'borrador',
      placedBy: 'cliente',
      placedByUid: profile.uid,
      placedByRole: 'cliente',
    });
    nav(`/mis-pedidos/${o.id}`);
  };

  const submitConfirm = async (data: OrderPayload) => {
    const o = await createOrder({
      client: profile,
      items: data.items,
      deliveryDate: data.deliveryDate,
      notes: data.notes,
      status: 'confirmado',
      placedBy: 'cliente',
      placedByUid: profile.uid,
      placedByRole: 'cliente',
    });
    nav(`/mis-pedidos/${o.id}`);
  };

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-6 space-y-6">
        <div>
          <Eyebrow>Nuevo pedido</Eyebrow>
          <h1 className="font-serif text-3xl md:text-4xl mt-1">Arme su pedido mayorista</h1>
          <HairlineRule />
          <p className="text-sm text-cream-muted mt-3 max-w-2xl">
            Seleccione productos y cantidades, elija fecha de entrega y confirme.
            Coordinaremos disponibilidad y precios por WhatsApp si hay alguna variación.
          </p>
        </div>

        {loading ? (
          <div className="h-6 w-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
        ) : (
          <OrderBuilder
            products={products}
            clientLabel="Su pedido"
            submitLabel="Confirmar pedido"
            submitDraftLabel="Guardar como borrador"
            onSubmit={submitConfirm}
            onSubmitDraft={submitDraft}
          />
        )}
      </div>
    </section>
  );
}
