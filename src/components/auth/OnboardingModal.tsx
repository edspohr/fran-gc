import { useState, type FormEvent } from 'react';
import { useClientProfile } from '@/contexts/ClientProfileContext';
import { updateClientProfile } from '@/lib/clients';
import { notifyAdmins } from '@/lib/mail';
import { useAuth } from '@/hooks/useAuth';
import Button from '../ui/Button';

export default function OnboardingModal() {
  const { needsOnboarding, profile, refresh } = useClientProfile();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [comuna, setComuna] = useState('');
  const [phone, setPhone] = useState('');
  const [rut, setRut] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!needsOnboarding || !user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !comuna.trim() || !phone.trim()) {
      setError('Complete los campos obligatorios.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await updateClientProfile(user.uid, {
        name: name.trim(),
        company: company.trim(),
        comuna: comuna.trim(),
        phone: phone.trim(),
        rut: rut.trim() || undefined,
        address: address.trim() || undefined,
      });
      await notifyAdmins({
        subject: `Nuevo cliente por verificar: ${company.trim()}`,
        html: `
          <h2>Nuevo cliente registrado</h2>
          <p><strong>${name.trim()}</strong> · ${company.trim()}</p>
          <p>Email: ${profile?.email ?? user.email}</p>
          <p>Teléfono: ${phone.trim()}</p>
          <p>Comuna: ${comuna.trim()}</p>
          ${rut.trim() ? `<p>RUT: ${rut.trim()}</p>` : ''}
          ${address.trim() ? `<p>Dirección: ${address.trim()}</p>` : ''}
          <p><em>Revisar y aprobar en /admin/clientes.</em></p>
        `,
      });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60';
  const labelCls = 'block text-xs uppercase tracking-eyebrow text-cream-muted mb-1';

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-lg bg-surface-1 border border-gold/25 rounded-lg p-6 md:p-8 space-y-5 my-auto">
        <div>
          <p className="eyebrow text-gold">Bienvenido a FRAN GC</p>
          <h2 className="font-serif text-2xl text-cream mt-1">
            Complete su registro para hacer pedidos
          </h2>
          <p className="text-sm text-cream-muted mt-2">
            Estos datos nos permiten atenderle. Su cuenta quedará en revisión hasta que el
            equipo la active.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelCls}>Nombre y apellido *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} required autoFocus />
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
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+56 9 ..." required />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelCls}>RUT empresa (opcional)</span>
              <input value={rut} onChange={(e) => setRut(e.target.value)} className={inputCls} placeholder="76.123.456-7" />
            </label>
            <label className="block">
              <span className={labelCls}>Dirección de despacho (opcional)</span>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
            </label>
          </div>

          {error && <p className="text-sm text-wine">{error}</p>}

          <div className="pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando…' : 'Enviar registro'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
