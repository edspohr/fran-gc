import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';

export default function Ingresar() {
  const { user, loading, signInWithGoogle } = useAuth();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? '/mi-cuenta';

  if (loading) return null;
  if (user) return <Navigate to={from} replace />;

  const handle = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center py-14">
      <div className="mx-auto max-w-md w-full px-6 space-y-6">
        <Eyebrow>Acceso clientes</Eyebrow>
        <h1 className="font-serif text-3xl md:text-4xl">Ingrese a su cuenta</h1>
        <HairlineRule />
        <p className="text-sm text-cream-muted">
          Ingrese con su cuenta de Google para gestionar sus pedidos. Si es la primera vez,
          completará un breve formulario y su cuenta quedará en revisión hasta que activemos
          el acceso a pedidos.
        </p>
        <Button type="button" onClick={() => void handle()} disabled={busy}>
          {busy ? 'Ingresando…' : 'Continuar con Google'}
        </Button>
        {error && <p className="text-sm text-wine">{error}</p>}
        <p className="text-xs text-cream-muted pt-4 border-t border-gold/10">
          Si busca acceso administrativo interno, use el acceso <a href="/admin/login" className="text-gold hover:text-gold-hover">admin</a>.
        </p>
      </div>
    </section>
  );
}
