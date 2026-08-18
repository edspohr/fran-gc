import type { OrderItem } from '@/types/order';

interface Props {
  items: OrderItem[];
  compact?: boolean;
}

export default function OrderItemList({ items, compact }: Props) {
  if (!items.length) {
    return <p className="text-sm text-cream-muted">Sin productos aún.</p>;
  }
  return (
    <ul className={`divide-y divide-gold/10 border-y border-gold/10 ${compact ? '' : ''}`}>
      {items.map((it) => (
        <li key={it.slug} className="py-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-cream font-medium truncate">{it.name}</p>
            <p className="text-xs text-cream-muted">{it.presentation}</p>
          </div>
          <span className="text-sm text-cream whitespace-nowrap">
            {it.quantity} {it.unitType === 'kg' ? 'kg' : 'un'}
          </span>
        </li>
      ))}
    </ul>
  );
}
