import { useState } from 'react';
import { canTransition, orderStatusLabel, type OrderStatus } from '@/types/order';
import Button from '../ui/Button';

interface Props {
  current: OrderStatus;
  hasDifference: boolean;
  onChange: (to: OrderStatus, extras?: { hasDifference?: boolean; differenceNotes?: string }) => Promise<void>;
}

const TARGETS: OrderStatus[] = ['confirmado', 'en-preparacion', 'entregado'];

export default function StatusStepper({ current, hasDifference, onChange }: Props) {
  const [busy, setBusy] = useState<OrderStatus | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [diffNotes, setDiffNotes] = useState('');

  const doChange = async (to: OrderStatus) => {
    setBusy(to);
    try {
      await onChange(to);
    } finally {
      setBusy(null);
    }
  };

  const markDiff = async () => {
    setBusy('entregado');
    try {
      await onChange('entregado', { hasDifference: true, differenceNotes: diffNotes });
      setShowDiff(false);
      setDiffNotes('');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TARGETS.filter((t) => canTransition(current, t)).map((t) => (
          <Button
            key={t}
            type="button"
            variant={t === 'entregado' ? 'primary' : 'ghost'}
            onClick={() => void doChange(t)}
            disabled={busy !== null}
          >
            {busy === t ? 'Actualizando…' : `Marcar ${orderStatusLabel(t).toLowerCase()}`}
          </Button>
        ))}
      </div>

      {current === 'en-preparacion' && (
        <>
          {!showDiff ? (
            <button
              type="button"
              onClick={() => setShowDiff(true)}
              className="text-xs uppercase tracking-eyebrow text-wine hover:text-wine/80"
            >
              Entregar con diferencia
            </button>
          ) : (
            <div className="space-y-2 border border-wine/40 rounded p-3">
              <label className="block text-xs uppercase tracking-eyebrow text-cream-muted">
                Nota de diferencia
              </label>
              <textarea
                value={diffNotes}
                onChange={(e) => setDiffNotes(e.target.value)}
                rows={2}
                className="w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold/60"
                placeholder="Ej.: se entregó 3 kg en vez de 4 kg de coppa por disponibilidad."
              />
              <div className="flex gap-2">
                <Button type="button" variant="danger" onClick={() => void markDiff()} disabled={busy !== null}>
                  Entregar con diferencia
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowDiff(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {current === 'entregado' && !hasDifference && (
        <p className="text-xs text-cream-muted">Pedido cerrado.</p>
      )}
    </div>
  );
}
