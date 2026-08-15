import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FiltersBar from '@/components/catalog/FiltersBar';
import ProductGrid from '@/components/catalog/ProductGrid';
import ProductDetailModal from '@/components/catalog/ProductDetailModal';
import EmptyState from '@/components/catalog/EmptyState';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import { usePublicProducts } from '@/hooks/useProducts';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSeo } from '@/lib/seo';
import { CATEGORIES, type Category, type Tag } from '@/types/product';

const isCategory = (v: string): v is Category => CATEGORIES.some((c) => c.id === v);
const isTag = (v: string): v is Tag => v === 'gondola' || v === 'horeca';

function useFilters() {
  const [params, setParams] = useSearchParams();
  const category = (() => {
    const c = params.get('category');
    return c && isCategory(c) ? c : 'all';
  })();
  const useCase = (() => {
    const t = params.get('use');
    return t && isTag(t) ? t : 'all';
  })();
  const query = params.get('q') ?? '';
  const productSlug = params.get('product');

  const set = (next: Partial<{ category: string; use: string; q: string; product: string | null }>) => {
    const p = new URLSearchParams(params);
    if ('category' in next) {
      if (next.category && next.category !== 'all') p.set('category', next.category);
      else p.delete('category');
    }
    if ('use' in next) {
      if (next.use && next.use !== 'all') p.set('use', next.use);
      else p.delete('use');
    }
    if ('q' in next) {
      if (next.q) p.set('q', next.q);
      else p.delete('q');
    }
    if ('product' in next) {
      if (next.product) p.set('product', next.product);
      else p.delete('product');
    }
    setParams(p, { replace: false });
  };

  return { category, useCase, query, productSlug, set };
}

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function Catalog() {
  const { products, loading, isPreview } = usePublicProducts();
  const { category, useCase, query, productSlug, set } = useFilters();
  const debouncedQuery = useDebouncedValue(query, 200);

  useSeo({
    title: 'Catálogo mayorista · FRAN GC',
    description:
      'Catálogo completo de charcutería artesanal: madurados, ahumados, longanizas, cocidos, charqui, untables y tablas. Pedidos mayoristas por WhatsApp.',
    path: '/catalogo',
  });

  const filtered = useMemo(() => {
    const q = normalize(debouncedQuery.trim());
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (useCase !== 'all' && !p.tags.includes(useCase as Tag)) return false;
      if (q && !normalize(`${p.name} ${p.description}`).includes(q)) return false;
      return true;
    });
  }, [products, category, useCase, debouncedQuery]);

  const selectedProduct = productSlug
    ? products.find((p) => p.slug === productSlug) ?? null
    : null;

  useEffect(() => {
    if (productSlug && !loading && !selectedProduct) {
      set({ product: null });
    }
  }, [productSlug, loading, selectedProduct, set]);

  return (
    <>
      <section className="pt-14 pb-8 border-b border-gold/10">
        <div className="mx-auto max-w-7xl px-6 space-y-3">
          <Eyebrow>Catálogo mayorista</Eyebrow>
          <h1 className="font-serif text-4xl md:text-5xl">Nuestros productos</h1>
          <HairlineRule />
          <p className="text-cream-muted max-w-2xl text-sm">
            Explore el catálogo completo. Agregue lo que le interese a su cotización y envíela
            por WhatsApp — recibirá la lista de precios mayorista y confirmaremos disponibilidad.
          </p>
          {isPreview && (
            <p className="text-xs text-wine">
              [Modo preview] Firebase no está configurado. Se muestran datos del seed.
            </p>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6 space-y-8">
          <FiltersBar
            category={category as Category | 'all'}
            useCase={useCase as Tag | 'all'}
            query={query}
            onCategory={(c) => set({ category: c })}
            onUseCase={(t) => set({ use: t })}
            onQuery={(q) => set({ q })}
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-surface-1 aspect-[3/4] animate-pulse rounded" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No encontramos productos con esos filtros."
              body="Pruebe con otra categoría o limpie la búsqueda."
            />
          ) : (
            <ProductGrid products={filtered} onSelect={(slug) => set({ product: slug })} />
          )}
        </div>
      </section>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => set({ product: null })}
      />
    </>
  );
}
