import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import OrderBuilder from '@/components/orders/OrderBuilder';
import { usePublicProducts } from '@/hooks/useProducts';
import { useClientProfile } from '@/contexts/ClientProfileContext';
import { createOrder, getOrder } from '@/lib/orders';
import type { OrderItem } from '@/types/order';
import type { Product } from '@/types/product';

interface OrderPayload {
  items: OrderItem[];
  deliveryDate: Date;
  notes: string;
}

interface Reconciled {
  items: OrderItem[];
  missingCount: number;
}

function reconcileItems(sourceItems: OrderItem[], products: Product[]): Reconciled {
  const bySlug = new Map<string, Product>();
  for (const p of products) {
    if (p.visible) bySlug.set(p.slug, p);
  }
  const kept: OrderItem[] = [];
  for (const it of sourceItems) {
    const p = bySlug.get(it.slug);
    if (!p) continue;
    kept.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      presentation: p.presentation,
      unitType: p.unitType,
      quantity: it.quantity,
    });
  }
  return { items: kept, missingCount: sourceItems.length - kept.length };
}

export default function Pedido() {
  const { profile } = useClientProfile();
  const { products, loading } = usePublicProducts();
  const nav = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const stateItems = (location.state as { items?: OrderItem[] } | null)?.items ?? null;
  const fromId = params.get('from');

  const [fetchedItems, setFetchedItems] = useState<OrderItem[] | null>(null);
  const [fetching, setFetching] = useState<boolean>(Boolean(fromId && !stateItems));
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Only fetch by ?from when state.items isn't already provided.
    if (!fromId || stateItems || !profile) {
      setFetching(false);
      return;
    }
    setFetching(true);
    getOrder(fromId)
      .then((o) => {
        if (cancelled) return;
        if (!o) {
          setFetchedItems([]);
          return;
        }
        // Silently ignore if this order isn't the current user's.
        if (o.clientId !== profile.uid) {
          setFetchedItems([]);
          return;
        }
        setFetchedItems(o.items);
      })
      .catch(() => {
        if (!cancelled) setFetchedItems([]);
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fromId, stateItems, profile]);

  const sourceItems: OrderItem[] | null = stateItems ?? fetchedItems;

  const reconciled = useMemo<Reconciled | null>(() => {
    if (!sourceItems || loading) return null;
    return reconcileItems(sourceItems, products);
  }, [sourceItems, products, loading]);

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

  const showLoading = loading || fetching;
  const initialItems = reconciled?.items ?? [];
  const missingCount = reconciled?.missingCount ?? 0;

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

        {missingCount > 0 && !noticeDismissed && (
          <div className="bg-surface-1 border border-gold/25 rounded p-3 text-sm text-cream-muted flex items-start justify-between gap-3">
            <p>
              {missingCount} producto{missingCount === 1 ? '' : 's'} de su pedido anterior
              {missingCount === 1 ? ' ya no está disponible y no se agregó.' : ' ya no están disponibles y no se agregaron.'}
            </p>
            <button
              type="button"
              onClick={() => setNoticeDismissed(true)}
              aria-label="Cerrar aviso"
              className="text-cream-muted hover:text-cream shrink-0"
            >
              ×
            </button>
          </div>
        )}

        {showLoading ? (
          <div className="h-6 w-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
        ) : (
          <OrderBuilder
            products={products}
            clientLabel="Su pedido"
            submitLabel="Confirmar pedido"
            submitDraftLabel="Guardar como borrador"
            onSubmit={submitConfirm}
            onSubmitDraft={submitDraft}
            initialItems={initialItems}
          />
        )}
      </div>
    </section>
  );
}
