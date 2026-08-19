import { useEffect, type ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  side?: 'right' | 'bottom';
  children: ReactNode;
}

export default function Drawer({ open, onClose, labelledBy, side = 'right', children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const panelCls =
    side === 'bottom'
      ? `absolute bottom-0 left-0 right-0 max-h-[85vh] bg-surface-1 border-t border-gold/20 rounded-t-2xl shadow-2xl pb-[env(safe-area-inset-bottom)] overflow-y-auto transform transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`
      : `absolute right-0 top-0 h-full w-full sm:w-[440px] bg-surface-1 border-l border-gold/20 shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`;

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={panelCls}
      >
        {children}
      </aside>
    </div>
  );
}
