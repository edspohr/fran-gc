import { isValidQuantity } from '@/lib/format';
import type { UnitType } from '@/types/product';

interface Props {
  quantity: number;
  unitType: UnitType;
  onChange: (next: number) => void;
}

export default function QuantityStepper({ quantity, unitType, onChange }: Props) {
  const isKg = unitType === 'kg';
  const step = isKg ? 0.5 : 1;

  const dec = () => {
    const next = Number((quantity - step).toFixed(2));
    if (next > 0) onChange(next);
  };
  const inc = () => onChange(Number((quantity + step).toFixed(2)));
  const setRaw = (v: string) => {
    const n = Number(v.replace(',', '.'));
    if (isValidQuantity(n, unitType)) onChange(n);
  };

  const btn = 'w-8 h-8 flex items-center justify-center border border-gold/30 rounded text-cream-muted hover:text-cream hover:border-gold/70';

  return (
    <div className="inline-flex items-center gap-1">
      <button type="button" aria-label="Disminuir" className={btn} onClick={dec}>
        −
      </button>
      <input
        type="number"
        min={isKg ? 0.1 : 1}
        step={step}
        value={quantity}
        onChange={(e) => setRaw(e.target.value)}
        className="w-16 text-center bg-ink border border-gold/25 rounded px-2 py-1 text-cream text-sm focus:outline-none focus:border-gold/60"
        aria-label="Cantidad"
      />
      <button type="button" aria-label="Aumentar" className={btn} onClick={inc}>
        +
      </button>
    </div>
  );
}
