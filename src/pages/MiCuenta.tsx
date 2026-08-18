import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Eyebrow from '@/components/ui/Eyebrow';
import HairlineRule from '@/components/ui/HairlineRule';
import Button from '@/components/ui/Button';
import { useClientProfile } from '@/contexts/ClientProfileContext';
import { clientStatusLabel } from '@/types/client';
import { updateClientProfile } from '@/lib/clients';
import { useAuth } from '@/hooks/useAuth';

export default function MiCuenta() {
  const { profile, isAdmin, isPending, isVerified, loading } = useClientProfile();
  const { user, signOut } = useAuth();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [comuna, setComuna] = useState('');
  const [phone, setPhone] = useState('');
  const [rut, setRut] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setCompany(profile.company);
    setComuna(profile.comuna);
    setPhone(profile.phone);
    setRut(profile.rut ?? '');
    setAddress(profile.address ?? '');
  }, [profile]);

  if (loading) {
    return (
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-6">
          <div className="h-6 w-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (isAdmin) {
    return (
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-6 space-y-4">
          <Eyebrow>Cuenta admin</Eyebrow>
          <h1 className="font-serif text-3xl">{user?.email}</h1>
          <HairlineRule />
          <p className="text-cream-muted">
            Está usando la cuenta como administrador. Vaya al{' '}
            <Link className="text-gold hover:text-gold-hover" to="/admin">
              panel admin
            </Link>{' '}
            para gestionar pedidos, clientes y catálogo.
          </p>
          <Button type="button" variant="ghost" onClick={() => void signOut()}>
            Salir
          </Button>
        </div>
      </section>
    );
  }

  if (!profile) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !comuna.trim() || !phone.trim()) {
      setError('Complete los campos obligatorios.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateClientProfile(profile.uid, {
        name: name.trim(),
        company: company.trim(),
        comuna: comuna.trim(),
        phone: phone.trim(),
        rut: rut.trim() || undefined,
        address: address.trim() || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60';
  const labelCls = 'block text-xs uppercase tracking-eyebrow text-cream-muted mb-1';

  return (
    <section className="py-14">
      <div className="mx-auto max-w-3xl px-6 space-y-6">
        <div>
          <Eyebrow>Mi cuenta</Eyebrow>
          <h1 className="font-serif text-3xl md:text-4xl mt-1">{profile.company || profile.name}</h1>
          <HairlineRule />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-cream-muted">
            {profile.email} — estado:{' '}
            <span
              className={`inline-block px-2 py-0.5 text-xs uppercase tracking-eyebrow rounded border ${
                isVerified
                  ? 'text-gold border-gold/40'
                  : isPending
                  ? 'text-cream-muted border-gold/20'
                  : 'text-wine border-wine/40'
              }`}
            >
              {clientStatusLabel(profile.status)}
            </span>
          </p>
          <div className="flex gap-2">
            {isVerified && (
              <Button as="a" href="/pedido">
                Hacer pedido
              </Button>
            )}
            <Button as="a" href="/mis-pedidos" variant="ghost">
              Mis pedidos
            </Button>
          </div>
        </div>

        {isPending && (
          <div className="border border-gold/25 bg-surface-1 rounded p-4 text-sm text-cream-muted">
            Su cuenta está en revisión. Podrá hacer pedidos apenas nuestro equipo la active.
            Mientras tanto puede actualizar sus datos o navegar el catálogo.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-surface-1 border border-gold/15 rounded-lg p-5 md:p-6">
          <h2 className="font-serif text-xl text-cream">Datos de contacto</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelCls}>Nombre y apellido *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} required />
            </label>
            <label className="block">
              <span className={labelCls}>Empresa *</span>
              <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} required />
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelCls}>Comuna *</span>
              <input value={comuna} onChange={(e) => setComuna(e.target.value)} className={inputCls} required />
            </label>
            <label className="block">
              <span className={labelCls}>Teléfono *</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} required />
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelCls}>RUT empresa</span>
              <input value={rut} onChange={(e) => setRut(e.target.value)} className={inputCls} placeholder="76.123.456-7" />
            </label>
            <label className="block">
              <span className={labelCls}>Dirección de despacho</span>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
            </label>
          </div>

          {error && <p className="text-sm text-wine">{error}</p>}
          {saved && <p className="text-sm text-gold">Datos actualizados.</p>}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => void signOut()}>
              Cerrar sesión
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
