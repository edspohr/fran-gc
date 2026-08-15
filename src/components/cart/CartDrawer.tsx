import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import HairlineRule from '../ui/HairlineRule';
import Eyebrow from '../ui/Eyebrow';
import QuantityStepper from './QuantityStepper';
import { useCart } from '@/hooks/useCart';
import { buildQuoteMessage, openWhatsApp } from '@/lib/whatsapp';
import { COMUNAS } from '@/config/site';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { state, itemCount, updateQuantity, removeItem, setMeta, clear } = useCart();

  const hasItems = state.items.length > 0;
  const canSubmit =
    hasItems && state.meta.businessName.trim().length > 0 && state.meta.comuna.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const msg = buildQuoteMessage(state);
    openWhatsApp(msg, 'cart-submit');
  };

  return (
    <Drawer open={open} onClose={onClose} labelledBy="cart-title">
      <div className="flex flex-col h-full">
        <header className="p-6 border-b border-gold/15 flex items-center justify-between">
          <div>
            <Eyebrow>Cotización</Eyebrow>
            <h2 id="cart-title" className="font-serif text-2xl mt-1">
              Su pedido
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-cream-muted hover:text-cream">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!hasItems ? (
            <div className="text-center py-12 space-y-3">
              <p className="font-serif text-xl">Su cotización está vacía.</p>
              <p className="text-sm text-cream-muted">
                Agregue productos desde el catálogo para armar su pedido mayorista.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {state.items.map((item) => (
                <li key={item.productId} className="pb-4 border-b border-gold/10 last:border-0">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-serif text-base leading-snug">{item.name}</p>
                      <p className="text-xs text-cream-muted mt-0.5">{item.presentation}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Quitar ${item.name}`}
                      onClick={() => removeItem(item.productId)}
                      className="text-cream-muted hover:text-wine text-sm"
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <QuantityStepper
                      quantity={item.quantity}
                      unitType={item.unitType}
                      onChange={(q) => updateQuantity(item.productId, q)}
                    />
                    <span className="text-xs uppercase tracking-eyebrow text-cream-muted">
                      {item.unitType === 'kg' ? 'kg' : item.unitType}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {hasItems && (
            <>
              <HairlineRule />
              <div className="space-y-4">
                <label className="block">
                  <span className="eyebrow block mb-1">Nombre del negocio *</span>
                  <input
                    type="text"
                    value={state.meta.businessName}
                    onChange={(e) => setMeta({ businessName: e.target.value })}
                    className="w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60"
                    required
                  />
                </label>
                <label className="block">
                  <span className="eyebrow block mb-1">Comuna *</span>
                  <select
                    value={state.meta.comuna}
                    onChange={(e) => setMeta({ comuna: e.target.value })}
                    className="w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60"
                    required
                  >
                    <option value="">Seleccione…</option>
                    {COMUNAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="eyebrow block mb-1">Notas (opcional)</span>
                  <textarea
                    value={state.meta.note}
                    onChange={(e) => setMeta({ note: e.target.value })}
                    rows={3}
                    className="w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60 resize-none"
                    placeholder="Fecha deseada, forma de pago, etc."
                  />
                </label>
              </div>
            </>
          )}
        </div>

        {hasItems && (
          <footer className="p-6 border-t border-gold/15 bg-ink space-y-3">
            <p className="text-xs text-cream-muted text-center">
              {itemCount} producto{itemCount === 1 ? '' : 's'} en su cotización. La lista de precios
              se enviará por WhatsApp.
            </p>
            <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full" size="lg">
              Enviar cotización por WhatsApp
            </Button>
            <button
              type="button"
              onClick={clear}
              className="w-full text-xs text-cream-muted hover:text-wine"
            >
              Vaciar cotización
            </button>
          </footer>
        )}
      </div>
    </Drawer>
  );
}
