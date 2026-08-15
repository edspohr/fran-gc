import Modal from '../ui/Modal';
import ProductImage from './ProductImage';
import Button from '../ui/Button';
import HairlineRule from '../ui/HairlineRule';
import type { Product } from '@/types/product';
import { categoryLabel, tagLabel } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: Props) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState<string>('1');

  if (!product) {
    return <Modal open={false} onClose={onClose}>{null}</Modal>;
  }

  const parsed = Number(qty.replace(',', '.'));
  const isKg = product.unitType === 'kg';
  const validQty =
    Number.isFinite(parsed) && parsed > 0 && (isKg || Number.isInteger(parsed));

  const handleAdd = () => {
    if (!validQty) return;
    cart.addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      presentation: product.presentation,
      unitType: product.unitType,
      quantity: parsed,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Modal open onClose={onClose} labelledBy="product-title">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="bg-surface-2">
          <ProductImage src={product.imageUrl} alt={product.name} name={product.name} />
        </div>
        <div className="p-6 md:p-8 space-y-4">
          <p className="eyebrow text-gold/80">{categoryLabel(product.category)}</p>
          <h2 id="product-title" className="font-serif text-3xl">
            {product.name}
          </h2>
          <HairlineRule />
          <p className="text-sm text-cream-muted leading-relaxed">{product.description}</p>

          <dl className="grid grid-cols-2 gap-4 pt-2 text-sm">
            <div>
              <dt className="eyebrow text-cream-muted/70">Presentación</dt>
              <dd className="mt-1 text-cream">{product.presentation}</dd>
            </div>
            <div>
              <dt className="eyebrow text-cream-muted/70">Formato</dt>
              <dd className="mt-1 text-cream capitalize">{product.unitType}</dd>
            </div>
          </dl>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 text-[0.65rem] uppercase tracking-eyebrow border border-gold/30 text-cream-muted rounded"
                >
                  {tagLabel(t)}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-gold/15 space-y-3">
            <label className="block text-xs uppercase tracking-eyebrow text-cream-muted">
              Cantidad ({isKg ? 'kg' : product.unitType})
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={isKg ? 0.1 : 1}
                step={isKg ? 0.1 : 1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-28 bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60"
                aria-label="Cantidad deseada"
              />
              <Button onClick={handleAdd} disabled={!validQty}>
                {added ? '✓ Agregado' : 'Agregar a cotización'}
              </Button>
            </div>
            {!validQty && (
              <p className="text-xs text-wine">
                {isKg
                  ? 'Ingrese una cantidad válida en kg (mínimo 0.1).'
                  : 'Ingrese una cantidad entera positiva.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
