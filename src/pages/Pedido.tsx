import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import OrderBuilder from '@/components/orders/OrderBuilder';
import { usePublicProducts } from '@/hooks/useProducts';
import { useClientProfile } from '@/contexts/ClientProfileContext';
import {
  confirmDraftOrder,
  createOrder,
  getOrder,
  updateDraftOrder,
} from '@/lib/orders';
import type { Order, OrderItem } from '@/types/order';
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

function isoFromTimestampLike(ts: Order['deliveryDate']): string {
  const d = ts.toDate();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function Pedido() {
  const { profile } = useClientProfile();
  const { products, loading } = usePublicProducts();
  const nav = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const stateItems = (location.state as { items?: OrderItem[] } | null)?.items ?? null;
  const fromId = params.get('from');
  const draftId = params.get('draft');

  const [fetchedItems, setFetchedItems] = useState<OrderItem[] | null>(null);
  const [draftOrder, setDraftOrder] = useState<Order | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(
    Boolean((fromId && !stateItems) || draftId),
  );
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  // Load ?from=... (repetir pedido) source items.
  useEffect(() => {
    let cancelled = false;
    if (!fromId || stateItems || !profile || draftId) {
      return;
    }
    setFetching(true);
    getOrder(fromId)
      .then((o) => {
        if (cancelled) return;
        if (!o || o.clientId !== profile.uid) {
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
  }, [fromId, stateItems, profile, draftId]);

  // Load ?draft=... source order for editing.
  useEffect(() => {
    let cancelled = false;
    if (!draftId || !profile) return;
    setFetching(true);
    setDraftError(null);
    getOrder(draftId)
      .then((o) => {
        if (cancelled) return;
        if (!o || o.clientId !== profile.uid || o.status !== 'borrador') {
          setDraftError('No encontramos ese borrador.');
          setDraftOrder(null);
          return;
        }
        setDraftOrder(o);
      })
      .catch(() => {
        if (!cancelled) {
          setDraftError('No encontramos ese borrador.');
          setDraftOrder(null);
        }
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [draftId, profile]);

  const isEditing = Boolean(draftOrder);
  const sourceItems: OrderItem[] | null =
    (isEditing ? draftOrder?.items ?? null : null) ?? stateItems ?? fetchedItems;

  const reconciled = useMemo<Reconciled | null>(() => {
    if (!sourceItems || loading) return null;
    return reconcileItems(sourceItems, products);
  }, [sourceItems, products, loading]);

  if (!profile) return null;

  const submitDraftNew = async (data: OrderPayload) => {
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

  const submitConfirmNew = async (data: OrderPayload) => {
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

  const submitDraftEdit = async (data: OrderPayload) => {
    if (!draftOrder) return;
    await updateDraftOrder(draftOrder.id, {
      items: data.items,
      deliveryDate: data.deliveryDate,
      notes: data.notes,
    });
    nav(`/mis-pedidos/${draftOrder.id}`);
  };

  const submitConfirmEdit = async (data: OrderPayload) => {
    if (!draftOrder) return;
    await confirmDraftOrder(
      draftOrder.id,
      { items: data.items, deliveryDate: data.deliveryDate, notes: data.notes },
      { uid: profile.uid, role: 'cliente' },
    );
    nav(`/mis-pedidos/${draftOrder.id}`);
  };

  const showLoading = loading || fetching;
  const initialItems = reconciled?.items ?? [];
  const missingCount = reconciled?.missingCount ?? 0;

  const initialDate = draftOrder ? isoFromTimestampLike(draftOrder.deliveryDate) : undefined;
  const initialNotes = draftOrder?.notes ?? '';

  const clientLabel = isEditing && draftOrder
    ? `Editando borrador ${draftOrder.id}`
    : 'Su pedido';

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-6 space-y-6">
        <div>
          <Eyebrow>{isEditing ? 'Editar borrador' : 'Nuevo pedido'}</Eyebrow>
          <h1 className="font-serif text-3xl md:text-4xl mt-1">
            {isEditing ? 'Edite su borrador' : 'Arme su pedido mayorista'}
          </h1>
          <HairlineRule />
          <p className="text-sm text-cream-muted mt-3 max-w-2xl">
            Seleccione productos y cantidades, elija fecha de entrega y confirme.
            Coordinaremos disponibilidad y precios por WhatsApp si hay alguna variación.
          </p>
        </div>

        {draftError && (
          <div className="bg-surface-1 border border-wine/40 rounded p-3 text-sm text-cream">
            {draftError}
          </div>
        )}

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
            key={draftOrder?.id ?? 'new'}
            products={products}
            clientLabel={clientLabel}
            submitLabel="Confirmar pedido"
            submitDraftLabel={isEditing ? 'Guardar borrador' : 'Guardar como borrador'}
            onSubmit={isEditing ? submitConfirmEdit : submitConfirmNew}
            onSubmitDraft={isEditing ? submitDraftEdit : submitDraftNew}
            initialItems={initialItems}
            initialDate={initialDate}
            initialNotes={initialNotes}
          />
        )}
      </div>
    </section>
  );
}
