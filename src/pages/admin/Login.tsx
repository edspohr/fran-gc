import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import HairlineRule from '@/components/ui/HairlineRule';
import Eyebrow from '@/components/ui/Eyebrow';
import { useAuth } from '@/hooks/useAuth';
import { useSeo } from '@/lib/seo';

function humanizeAuthError(err: unknown): string {
  const code = (err as { code?: string }).code ?? '';
  if (code.includes('invalid-credential') || code.includes('wrong-password')) {
    return 'Credenciales incorrectas.';
  }
  if (code.includes('user-not-found')) return 'Este usuario no existe.';
  if (code.includes('too-many-requests')) return 'Demasiados intentos. Espere unos minutos.';
  return 'No se pudo iniciar sesión. Intente nuevamente.';
}

export default function Login() {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeo({ title: 'Ingresar · Admin FRAN GC', noindex: true });

  if (!loading && user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(humanizeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-6 py-10">
      <div className="w-full max-w-sm bg-surface-1 border border-gold/15 rounded-lg p-8 space-y-5">
        <div className="text-center space-y-2">
          <Eyebrow>Administración</Eyebrow>
          <h1 className="font-serif text-2xl">FRAN GC · Ingreso</h1>
          <HairlineRule className="mx-auto" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-eyebrow text-cream-muted">Correo</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60"
              required
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-eyebrow text-cream-muted">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60"
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="text-sm text-wine">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full" size="lg">
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>
        <p className="text-[0.7rem] text-center text-cream-muted">
          El acceso está restringido al equipo de FRAN GC.
        </p>
      </div>
    </div>
  );
}
