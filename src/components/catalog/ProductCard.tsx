import ProductImage from './ProductImage';
import type { Product } from '@/types/product';
import { categoryLabel } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onSelect: (slug: string) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product.slug)}
      className="group text-left flex flex-col bg-surface-1 border border-gold/10 rounded overflow-hidden hover:border-gold/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-hover focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
    >
      <ProductImage
        src={product.imageUrl}
        alt={product.name}
        name={product.name}
      />
      <div className="p-4 space-y-1.5 flex-1">
        <p className="eyebrow text-gold/80 text-[0.65rem]">
          {categoryLabel(product.category)}
        </p>
        <h3 className="font-serif text-lg leading-tight group-hover:text-gold-hover transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-cream-muted">{product.presentation}</p>
        {product.featured && (
          <span className="inline-block mt-1 px-2 py-0.5 text-[0.6rem] uppercase tracking-eyebrow bg-wine/80 text-cream rounded">
            Best seller
          </span>
        )}
      </div>
    </button>
  );
}
