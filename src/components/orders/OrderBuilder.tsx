import { useMemo, useState } from 'react';
import ProductImage from '../catalog/ProductImage';
import QuantityStepper from '../cart/QuantityStepper';
import OrderItemList from './OrderItemList';
import DeliveryDatePicker, { addDaysIso, todayIso } from './DeliveryDatePicker';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import Drawer from '../ui/Drawer';
import { CATEGORIES, type Category, type Product } from '@/types/product';
import type { OrderItem } from '@/types/order';

interface Props {
  products: Product[];
  clientLabel: string; // header text (e.g. "Su pedido" or "Pedido para <cliente>")
  initialItems?: OrderItem[];
  initialDate?: string;
  initialNotes?: string;
  submitLabel: string; // e.g. "Confirmar pedido"
  submitDraftLabel?: string; // optional secondary — "Guardar borrador"
  onSubmit: (data: { items: OrderItem[]; deliveryDate: Date; notes: string }) => Promise<void>;
  onSubmitDraft?: (data: { items: OrderItem[]; deliveryDate: Date; notes: string }) => Promise<void>;
}

const productToItem = (p: Product, quantity: number): OrderItem => ({
  productId: p.id,
  slug: p.slug,
  name: p.name,
  presentation: p.presentation,
  unitType: p.unitType,
  quantity,
});

interface SummaryPanelProps {
  clientLabel: string;
  items: OrderItem[];
  itemCount: number;
  deliveryDate: string;
  setDeliveryDate: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  error: string | null;
  submitting: 'draft' | 'confirm' | null;
  submitLabel: string;
  submitDraftLabel?: string;
  onConfirm: () => void;
  onDraft?: () => void;
}

function SummaryPanel({
  clientLabel,
  items,
  itemCount,
  deliveryDate,
  setDeliveryDate,
  notes,
  setNotes,
  error,
  submitting,
  submitLabel,
  submitDraftLabel,
  onConfirm,
  onDraft,
}: SummaryPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow text-gold/80">Pedido</p>
        <h3 className="font-serif text-xl text-cream mt-1">{clientLabel}</h3>
      </div>

      <OrderItemList items={items} />

      <DeliveryDatePicker value={deliveryDate} onChange={setDeliveryDate} />

      <label className="block">
        <span className="block text-xs uppercase tracking-eyebrow text-cream-muted mb-1">
          Notas (opcional)
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold/60"
          placeholder="Comentarios para el equipo FRAN GC…"
        />
      </label>

      {error && <p className="text-sm text-wine">{error}</p>}

      <div className="space-y-2">
        <Button
          type="button"
          onClick={onConfirm}
          disabled={submitting !== null || !items.length}
          className="w-full"
        >
          {submitting === 'confirm' ? 'Enviando…' : submitLabel}
        </Button>
        {onDraft && (
          <Button
            type="button"
            variant="ghost"
            onClick={onDraft}
            disabled={submitting !== null || !items.length}
            className="w-full"
          >
            {submitting === 'draft' ? 'Guardando…' : submitDraftLabel ?? 'Guardar borrador'}
          </Button>
        )}
      </div>

      <p className="text-[0.7rem] text-cream-muted">
        {itemCount > 0 ? `${items.length} producto${items.length === 1 ? '' : 's'} · ${itemCount} unidad${itemCount === 1 ? '' : 'es'}` : 'Aún sin productos.'}
      </p>
    </div>
  );
}

export default function OrderBuilder({
  products,
  clientLabel,
  initialItems = [],
  initialDate,
  initialNotes = '',
  submitLabel,
  submitDraftLabel,
  onSubmit,
  onSubmitDraft,
}: Props) {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [byId, setById] = useState<Map<string, number>>(() => {
    const m = new Map<string, number>();
    for (const it of initialItems) m.set(it.productId, it.quantity);
    return m;
  });
  const [deliveryDate, setDeliveryDate] = useState<string>(
    initialDate ?? addDaysIso(todayIso(), 2),
  );
  const [notes, setNotes] = useState(initialNotes);
  const [submitting, setSubmitting] = useState<'draft' | 'confirm' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (q && !`${p.name} ${p.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, category, search]);

  const items: OrderItem[] = useMemo(() => {
    const out: OrderItem[] = [];
    for (const [productId, qty] of byId.entries()) {
      const p = products.find((x) => x.id === productId);
      if (p && qty > 0) out.push(productToItem(p, qty));
    }
    return out;
  }, [byId, products]);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const setQty = (p: Product, qty: number) => {
    const next = new Map(byId);
    if (qty <= 0) next.delete(p.id);
    else next.set(p.id, qty);
    setById(next);
  };
  const inc = (p: Product) => setQty(p, (byId.get(p.id) ?? 0) + (p.unitType === 'kg' ? 0.5 : 1));
  const dec = (p: Product) => setQty(p, Math.max(0, (byId.get(p.id) ?? 0) - (p.unitType === 'kg' ? 0.5 : 1)));

  const validate = (): boolean => {
    if (!items.length) {
      setError('Agregue al menos un producto.');
      return false;
    }
    if (!deliveryDate) {
      setError('Indique fecha de entrega.');
      return false;
    }
    setError(null);
    return true;
  };

  const doSubmit = async (which: 'draft' | 'confirm') => {
    if (!validate()) return;
    setSubmitting(which);
    try {
      const payload = { items, deliveryDate: new Date(deliveryDate + 'T00:00:00'), notes };
      if (which === 'draft' && onSubmitDraft) await onSubmitDraft(payload);
      else await onSubmit(payload);
      setSheetOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(null);
    }
  };

  const summary = (
    <SummaryPanel
      clientLabel={clientLabel}
      items={items}
      itemCount={itemCount}
      deliveryDate={deliveryDate}
      setDeliveryDate={setDeliveryDate}
      notes={notes}
      setNotes={setNotes}
      error={error}
      submitting={submitting}
      submitLabel={submitLabel}
      submitDraftLabel={submitDraftLabel}
      onConfirm={() => void doSubmit('confirm')}
      onDraft={onSubmitDraft ? () => void doSubmit('draft') : undefined}
    />
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 xl:gap-8 pb-32 lg:pb-0">
        {/* Catalog side */}
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto…"
              className="flex-1 bg-surface-1 border border-gold/20 rounded px-4 py-2.5 text-sm text-cream placeholder:text-cream-muted/60 focus:outline-none focus:border-gold/60"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={category === 'all'} onClick={() => setCategory('all')}>
              Todas
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                {c.label}
              </Chip>
            ))}
          </div>

          <ul className="divide-y divide-gold/10 border-y border-gold/10">
            {filtered.map((p) => {
              const qty = byId.get(p.id) ?? 0;
              const selected = qty > 0;
              return (
                <li key={p.id} className="py-3 flex items-center gap-3">
                  <div className="w-14 h-14 shrink-0 rounded overflow-hidden">
                    <ProductImage src={p.imageUrl} alt={p.name} name={p.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-cream font-medium truncate">{p.name}</p>
                    <p className="text-xs text-cream-muted truncate">{p.presentation}</p>
                  </div>
                  {selected ? (
                    <div className="flex items-center gap-2">
                      <QuantityStepper
                        quantity={qty}
                        unitType={p.unitType}
                        onChange={(q) => setQty(p, q)}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => inc(p)}
                      className="px-4 py-2.5 min-h-[44px] text-xs uppercase tracking-eyebrow border border-gold/40 rounded text-cream hover:border-gold/70"
                    >
                      Agregar
                    </button>
                  )}
                  {selected && (
                    <button
                      type="button"
                      onClick={() => dec(p)}
                      aria-label="Quitar"
                      className="w-11 h-11 flex items-center justify-center border border-wine/40 rounded text-wine hover:bg-wine/10"
                    >
                      ×
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {!filtered.length && (
            <p className="text-sm text-cream-muted">No hay productos con esos filtros.</p>
          )}
        </div>

        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:block lg:sticky lg:top-24 h-fit bg-surface-1 border border-gold/15 rounded-lg p-5">
          {summary}
        </aside>
      </div>

      {/* Mobile sticky bottom bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-surface-2 border-t border-gold/25 pb-[env(safe-area-inset-bottom)] z-40">
          <div className="p-3">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-gold text-ink font-medium rounded px-5 py-3 min-h-[44px] hover:bg-gold-hover"
              aria-label="Ver resumen del pedido"
            >
              <span>
                {items.length} ítem{items.length === 1 ? '' : 's'} · {itemCount} unidad{itemCount === 1 ? '' : 'es'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Continuar</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom-sheet summary */}
      <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} side="bottom" labelledBy="order-summary-title">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 id="order-summary-title" className="sr-only">Resumen del pedido</h3>
            <span className="mx-auto block h-1 w-10 rounded-full bg-gold/30" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 text-cream-muted hover:text-cream w-11 h-11 flex items-center justify-center"
            >
              ×
            </button>
          </div>
          {summary}
        </div>
      </Drawer>
    </>
  );
}
