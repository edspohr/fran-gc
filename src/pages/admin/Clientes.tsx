import { useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import Chip from '@/components/ui/Chip';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { adminUpdateClient, approveClient, subscribeClients, suspendClient } from '@/lib/clients';
import { clientStatusLabel, type Client, type ClientStatus } from '@/types/client';
import { useSeo } from '@/lib/seo';

const STATUS_TABS: (ClientStatus | 'todos')[] = ['por-verificar', 'activo', 'suspendido', 'todos'];

export default function AdminClientes() {
  useSeo({ title: 'Clientes · Admin FRAN GC', noindex: true });
  const [tab, setTab] = useState<ClientStatus | 'todos'>('por-verificar');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Client | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeClients(
      (list) => {
        setClients(list);
        setLoading(false);
      },
      tab === 'todos' ? undefined : tab,
    );
    return () => unsub();
  }, [tab]);

  const items = useMemo(() => clients, [clients]);

  const doApprove = async (c: Client) => {
    setBusy(c.uid);
    try {
      await approveClient(c);
    } finally {
      setBusy(null);
    }
  };
  const doSuspend = async (c: Client) => {
    if (!window.confirm(`¿Suspender cuenta de ${c.company || c.email}?`)) return;
    setBusy(c.uid);
    try {
      await suspendClient(c.uid);
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl">Clientes</h1>
          <p className="text-cream-muted text-sm mt-1">
            {items.length} en {tab === 'todos' ? 'total' : clientStatusLabel(tab as ClientStatus).toLowerCase()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((s) => (
            <Chip key={s} active={tab === s} onClick={() => setTab(s)}>
              {s === 'todos' ? 'Todos' : clientStatusLabel(s)}
            </Chip>
          ))}
        </div>

        {loading ? (
          <p className="text-cream-muted">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="text-cream-muted">Sin clientes en este estado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-eyebrow text-cream-muted border-b border-gold/15">
                  <th className="py-2 pr-3">Empresa / Nombre</th>
                  <th className="py-2 pr-3 hidden md:table-cell">Email</th>
                  <th className="py-2 pr-3 hidden lg:table-cell">Comuna</th>
                  <th className="py-2 pr-3 hidden md:table-cell">Teléfono</th>
                  <th className="py-2 pr-3">Estado</th>
                  <th className="py-2 pr-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.uid} className="border-b border-gold/10">
                    <td className="py-3 pr-3">
                      <p className="text-cream font-medium">{c.company || '—'}</p>
                      <p className="text-xs text-cream-muted">{c.name}</p>
                    </td>
                    <td className="py-3 pr-3 hidden md:table-cell text-cream-muted">{c.email}</td>
                    <td className="py-3 pr-3 hidden lg:table-cell text-cream-muted">{c.comuna}</td>
                    <td className="py-3 pr-3 hidden md:table-cell text-cream-muted">{c.phone}</td>
                    <td className="py-3 pr-3">
                      <span className="text-xs uppercase tracking-eyebrow text-cream-muted">
                        {clientStatusLabel(c.status)}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-right">
                      <div className="inline-flex gap-1.5">
                        {c.status !== 'activo' && (
                          <button
                            type="button"
                            onClick={() => void doApprove(c)}
                            disabled={busy === c.uid}
                            className="px-2.5 py-1 text-xs border border-gold/40 rounded text-cream hover:border-gold/70"
                          >
                            Aprobar
                          </button>
                        )}
                        {c.status !== 'suspendido' && (
                          <button
                            type="button"
                            onClick={() => void doSuspend(c)}
                            disabled={busy === c.uid}
                            className="px-2.5 py-1 text-xs border border-wine/40 rounded text-wine hover:bg-wine/10"
                          >
                            Suspender
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditing(c)}
                          className="px-2.5 py-1 text-xs border border-gold/20 rounded text-cream-muted hover:text-cream hover:border-gold/50"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} labelledBy="edit-client">
        {editing && (
          <EditClientForm
            client={editing}
            onDone={() => setEditing(null)}
          />
        )}
      </Modal>
    </AdminShell>
  );
}

function EditClientForm({ client, onDone }: { client: Client; onDone: () => void }) {
  const [name, setName] = useState(client.name);
  const [company, setCompany] = useState(client.company);
  const [comuna, setComuna] = useState(client.comuna);
  const [phone, setPhone] = useState(client.phone);
  const [rut, setRut] = useState(client.rut ?? '');
  const [address, setAddress] = useState(client.address ?? '');
  const [adminNotes, setAdminNotes] = useState(client.adminNotes ?? '');
  const [saving, setSaving] = useState(false);

  const inputCls =
    'w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60';
  const labelCls = 'block text-xs uppercase tracking-eyebrow text-cream-muted mb-1';

  const save = async () => {
    setSaving(true);
    try {
      await adminUpdateClient(client.uid, {
        name,
        company,
        comuna,
        phone,
        rut: rut || undefined,
        address: address || undefined,
        adminNotes: adminNotes || undefined,
      });
      onDone();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-4">
      <h2 id="edit-client" className="font-serif text-2xl">Editar cliente</h2>
      <p className="text-xs text-cream-muted">{client.email}</p>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block"><span className={labelCls}>Nombre</span><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="block"><span className={labelCls}>Empresa</span><input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} /></label>
        <label className="block"><span className={labelCls}>Comuna</span><input className={inputCls} value={comuna} onChange={(e) => setComuna(e.target.value)} /></label>
        <label className="block"><span className={labelCls}>Teléfono</span><input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        <label className="block"><span className={labelCls}>RUT</span><input className={inputCls} value={rut} onChange={(e) => setRut(e.target.value)} /></label>
        <label className="block"><span className={labelCls}>Dirección</span><input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} /></label>
      </div>
      <label className="block">
        <span className={labelCls}>Notas internas (sólo admin)</span>
        <textarea rows={3} className={inputCls} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
      </label>
      <div className="flex gap-2 pt-2">
        <Button type="button" onClick={() => void save()} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button>
        <Button type="button" variant="ghost" onClick={onDone}>Cancelar</Button>
      </div>
    </div>
  );
}
