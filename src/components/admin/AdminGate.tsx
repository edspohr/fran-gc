import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { isAdminEmail } from '@/lib/admin';

export default function AdminGate() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="h-6 w-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdminEmail(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink px-6 py-10">
        <div className="max-w-md text-center space-y-4">
          <p className="eyebrow text-wine">Acceso denegado</p>
          <h1 className="font-serif text-2xl">Su cuenta no tiene permisos de administración.</h1>
          <p className="text-sm text-cream-muted">
            Ingresó con <span className="text-cream">{user.email}</span>. Si cree que esto es un
            error, contacte al equipo de FRAN GC.
          </p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="px-4 py-2 border border-gold/40 rounded text-sm text-cream hover:border-gold/70"
          >
            Cambiar de cuenta
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
