import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export default function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p className={`font-sans text-xs uppercase tracking-eyebrow text-cream-muted ${className}`}>
      {children}
    </p>
  );
}
