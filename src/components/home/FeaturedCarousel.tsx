import { Link } from 'react-router-dom';
import Eyebrow from '../ui/Eyebrow';
import HairlineRule from '../ui/HairlineRule';
import ProductImage from '../catalog/ProductImage';
import type { Product } from '@/types/product';
import { categoryLabel } from '@/types/product';

interface FeaturedCarouselProps {
  products: Product[];
  loading: boolean;
}

export default function FeaturedCarousel({ products, loading }: FeaturedCarouselProps) {
  const items = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="py-20 md:py-28 bg-ink-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div className="space-y-3">
            <Eyebrow>Destacados</Eyebrow>
            <h2 className="font-serif text-3xl md:text-4xl">Nuestras piezas insignia</h2>
            <HairlineRule />
          </div>
          <Link
            to="/catalogo"
            className="text-sm text-gold hover:text-gold-hover underline underline-offset-4"
          >
            Ver todo el catálogo →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface-1 aspect-square animate-pulse rounded" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-cream-muted">
            El catálogo está siendo actualizado. Por favor vuelva pronto o{' '}
            <Link to="/contacto" className="text-gold underline">
              contáctenos
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <Link
                key={product.id}
                to={`/catalogo?product=${product.slug}`}
                className="group block"
              >
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  name={product.name}
                  className="rounded shadow-hairline"
                />
                <div className="mt-3">
                  <p className="eyebrow text-gold/80">{categoryLabel(product.category)}</p>
                  <h3 className="font-serif text-xl mt-1 group-hover:text-gold-hover transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-cream-muted mt-1">{product.presentation}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
