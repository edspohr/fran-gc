import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export default function Chip({ active = false, className = '', children, ...rest }: ChipProps) {
  const base =
    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-hover focus-visible:ring-offset-2 focus-visible:ring-offset-ink';
  const stateCls = active
    ? 'bg-gold text-ink border border-gold'
    : 'text-cream-muted border border-gold/30 hover:border-gold/70 hover:text-cream';
  return (
    <button type="button" className={`${base} ${stateCls} ${className}`} {...rest}>
      {children}
    </button>
  );
}
