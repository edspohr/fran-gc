interface Props {
  value: string; // yyyy-mm-dd
  onChange: (v: string) => void;
  min?: string;
  className?: string;
}

export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function DeliveryDatePicker({ value, onChange, min, className = '' }: Props) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs uppercase tracking-eyebrow text-cream-muted mb-1">
        Fecha de entrega
      </span>
      <input
        type="date"
        value={value}
        min={min ?? todayIso()}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60"
        required
      />
    </label>
  );
}
