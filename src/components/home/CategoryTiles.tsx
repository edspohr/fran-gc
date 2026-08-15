import { Link } from 'react-router-dom';
import Eyebrow from '../ui/Eyebrow';
import HairlineRule from '../ui/HairlineRule';
import { CATEGORIES } from '@/types/product';

export default function CategoryTiles() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center md:text-left space-y-3 mb-10">
          <Eyebrow>Categorías</Eyebrow>
          <h2 className="font-serif text-3xl md:text-4xl">Un catálogo, seis familias</h2>
          <HairlineRule className="mx-auto md:mx-0" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/catalogo?category=${c.id}`}
              className="group relative flex items-end min-h-[140px] md:min-h-[180px] p-5 bg-surface-1 border border-gold/10 rounded overflow-hidden hover:border-gold/40 transition-colors"
            >
              <span className="display-caps text-sm md:text-base text-cream group-hover:text-gold-hover">
                {c.label}
              </span>
              <span
                aria-hidden="true"
                className="absolute right-4 bottom-4 h-px w-8 bg-gold/40 group-hover:w-16 transition-all"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
