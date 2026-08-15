import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  children: ReactNode;
}

export default function AdminShell({ children }: Props) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="border-b border-gold/15 bg-surface-1">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="font-serif text-lg text-cream">
              FRAN GC · Admin
            </Link>
            <Link to="/" className="text-xs text-cream-muted hover:text-cream">
              ← Ver sitio público
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs text-cream-muted">
            {user?.email && <span>{user.email}</span>}
            <button
              type="button"
              onClick={() => void signOut()}
              className="px-3 py-1.5 border border-gold/30 rounded hover:border-gold/70 text-cream"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
