import { useCart } from '@/hooks/useCart';

interface Props {
  onClick: () => void;
}

export default function CartButton({ onClick }: Props) {
  const { itemCount } = useCart();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver cotización (${itemCount} ${itemCount === 1 ? 'producto' : 'productos'})`}
      className="relative inline-flex items-center justify-center p-2 text-cream hover:text-gold-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-hover focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h2l2.5 11.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.5L22 8H6" />
        <circle cx="10" cy="21" r="1.2" />
        <circle cx="18" cy="21" r="1.2" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-ink text-[0.65rem] font-bold flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
