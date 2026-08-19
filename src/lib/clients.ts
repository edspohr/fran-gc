import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Client, ClientProfileFields, ClientStatus } from '@/types/client';
import { notifyClient } from './mail';
import { renderActivatedEmail } from './emails/activated';

const COLLECTION = 'clients';

export async function getClient(uid: string): Promise<Client | null> {
  const snap = await getDoc(doc(db, COLLECTION, uid));
  if (!snap.exists()) return null;
  return snap.data() as Client;
}

/**
 * Ensure a client profile exists for the given uid/email. Called on every
 * sign-in — creates a stub with status 'por-verificar' if none present.
 */
export async function ensureClient(uid: string, email: string): Promise<Client> {
  const existing = await getClient(uid);
  if (existing) return existing;

  const now = serverTimestamp();
  const stub = {
    uid,
    email: email.toLowerCase(),
    name: '',
    company: '',
    comuna: '',
    phone: '',
    status: 'por-verificar' as ClientStatus,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, COLLECTION, uid), stub);
  const fresh = await getClient(uid);
  if (!fresh) throw new Error('No se pudo crear el perfil de cliente.');
  return fresh;
}

export async function updateClientProfile(
  uid: string,
  fields: Partial<ClientProfileFields>,
): Promise<void> {
  const patch: Record<string, unknown> = { updatedAt: serverTimestamp() };
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) patch[k] = v;
  }
  await updateDoc(doc(db, COLLECTION, uid), patch);
}

export async function adminUpdateClient(
  uid: string,
  fields: Partial<Client>,
): Promise<void> {
  const patch: Record<string, unknown> = { updatedAt: serverTimestamp() };
  for (const [k, v] of Object.entries(fields)) {
    if (k === 'uid' || k === 'email' || k === 'createdAt' || k === 'updatedAt') continue;
    if (v !== undefined) patch[k] = v;
  }
  await updateDoc(doc(db, COLLECTION, uid), patch);
}

export async function approveClient(client: Client): Promise<void> {
  await adminUpdateClient(client.uid, { status: 'activo' });
  if (client.email) {
    const { subject, html } = renderActivatedEmail({
      name: client.name,
      company: client.company,
    });
    void notifyClient(client.email, subject, html);
  }
}

export function suspendClient(uid: string): Promise<void> {
  return adminUpdateClient(uid, { status: 'suspendido' });
}

export function subscribeClient(uid: string, cb: (c: Client | null) => void): Unsubscribe {
  return onSnapshot(doc(db, COLLECTION, uid), (snap) => {
    cb(snap.exists() ? (snap.data() as Client) : null);
  });
}

export function subscribeClients(
  cb: (clients: Client[]) => void,
  status?: ClientStatus,
): Unsubscribe {
  const q = status
    ? query(collection(db, COLLECTION), where('status', '==', status), orderBy('createdAt', 'desc'))
    : query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as Client)));
}
