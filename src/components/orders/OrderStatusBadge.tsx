import { orderStatusLabel, type OrderStatus } from '@/types/order';

const CLASSES: Record<OrderStatus, string> = {
  borrador: 'bg-surface-2 text-cream-muted border-gold/20',
  confirmado: 'bg-gold/15 text-gold border-gold/40',
  'en-preparacion': 'bg-wine/25 text-cream border-wine/50',
  entregado: 'bg-green-900/30 text-green-300 border-green-500/40',
};

interface Props {
  status: OrderStatus;
  hasDifference?: boolean;
  className?: string;
}

export default function OrderStatusBadge({ status, hasDifference, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[0.7rem] uppercase tracking-eyebrow rounded border ${CLASSES[status]} ${className}`}
    >
      {orderStatusLabel(status)}
      {hasDifference && status === 'entregado' && (
        <span className="text-wine">· con diferencia</span>
      )}
    </span>
  );
}
