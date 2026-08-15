import Chip from '../ui/Chip';
import { CATEGORIES, TAGS, type Category, type Tag } from '@/types/product';

interface FiltersBarProps {
  category: Category | 'all';
  useCase: Tag | 'all';
  query: string;
  onCategory: (c: Category | 'all') => void;
  onUseCase: (t: Tag | 'all') => void;
  onQuery: (q: string) => void;
}

export default function FiltersBar({
  category,
  useCase,
  query,
  onCategory,
  onUseCase,
  onQuery,
}: FiltersBarProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:max-w-sm">
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar producto…"
            aria-label="Buscar producto"
            className="w-full bg-surface-1 border border-gold/20 rounded px-4 py-2.5 text-sm text-cream placeholder:text-cream-muted/60 focus:outline-none focus:border-gold/60"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Uso">
          <Chip active={useCase === 'all'} onClick={() => onUseCase('all')}>
            Todos los usos
          </Chip>
          {TAGS.map((t) => (
            <Chip key={t.id} active={useCase === t.id} onClick={() => onUseCase(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Categoría">
        <Chip active={category === 'all'} onClick={() => onCategory('all')}>
          Todas las categorías
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} active={category === c.id} onClick={() => onCategory(c.id)}>
            {c.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
