import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  countItems,
  type Order,
  type OrderClientSnapshot,
  type OrderItem,
  type OrderStatus,
  type OrderStatusEvent,
} from '@/types/order';
import type { Client } from '@/types/client';
import { notifyAdmins, notifyClient } from './mail';
import { orderStatusLabel } from '@/types/order';
import { renderOrderReceiptEmail } from './emails/orderReceipt';
import { renderStatusChangeEmail } from './emails/statusChange';

const COLLECTION = 'orders';

export interface CreateOrderInput {
  client: Client;
  items: OrderItem[];
  deliveryDate: Date;
  notes?: string;
  status: OrderStatus;
  placedBy: 'cliente' | 'admin';
  placedByUid: string;
  placedByRole: 'cliente' | 'admin';
}

export function toClientSnapshot(c: Client): OrderClientSnapshot {
  return {
    email: c.email,
    name: c.name,
    company: c.company,
    comuna: c.comuna,
    phone: c.phone,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const now = Timestamp.now();
  const year = new Date().getFullYear();
  const counterRef = doc(db, 'counters', `orders-${year}`);

  const order = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? ((snap.data().next as number) ?? 1) : 1;
    const id = `ORD-${year}-${String(current).padStart(4, '0')}`;
    const event: OrderStatusEvent = {
      status: input.status,
      at: now,
      by: input.placedByUid,
      byRole: input.placedByRole,
    };
    const draft: Order = {
      id,
      clientId: input.client.uid,
      clientSnapshot: toClientSnapshot(input.client),
      items: input.items,
      deliveryDate: Timestamp.fromDate(input.deliveryDate),
      notes: input.notes?.trim() || undefined,
      status: input.status,
      statusHistory: [event],
      placedBy: input.placedBy,
      placedByUid: input.placedByUid,
      hasDifference: false,
      createdAt: now,
      updatedAt: now,
    };
    // Strip undefined so Firestore accepts the doc.
    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(draft)) {
      if (v !== undefined) payload[k] = v;
    }
    tx.set(counterRef, { next: current + 1 }, { merge: true });
    const orderRef = doc(db, COLLECTION, id);
    tx.set(orderRef, payload);
    return draft;
  });

  if (input.status === 'confirmado') {
    // Direct-confirm path: order created straight to 'confirmado' from the
    // builder. This is the only place we send the receipt on this path — the
    // draft→confirmado path is handled in changeOrderStatus(). Together they
    // produce exactly one client receipt per confirmation.
    void notifyAdmins({
      subject: `Nuevo pedido ${order.id} — ${input.client.company || input.client.name}`,
      html: renderNewOrderEmail(order),
    });
    const receipt = renderOrderReceiptEmail(order);
    void notifyClient(input.client.email, receipt.subject, receipt.html);
  }

  return order;
}

export async function updateDraftOrder(
  id: string,
  patch: {
    items?: OrderItem[];
    deliveryDate?: Date;
    notes?: string;
  },
): Promise<void> {
  const update: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.items) update.items = patch.items;
  if (patch.deliveryDate) update.deliveryDate = Timestamp.fromDate(patch.deliveryDate);
  if (patch.notes !== undefined) update.notes = patch.notes.trim() || null;
  await updateDoc(doc(db, COLLECTION, id), update);
}

/**
 * Confirm an existing borrador: atomically applies edits (items/date/notes) and
 * flips status to 'confirmado' in a single update, then sends exactly one client
 * receipt via changeOrderStatus semantics (mirrored here so we can bundle the
 * edits into the same write). This is the counterpart to createOrder(...,'confirmado');
 * together they guarantee one receipt per confirmation.
 */
export async function confirmDraftOrder(
  id: string,
  patch: { items: OrderItem[]; deliveryDate: Date; notes: string },
  actor: { uid: string; role: 'cliente' | 'admin' },
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Pedido no existe.');
  const current = snap.data() as Order;
  if (current.status !== 'borrador') {
    throw new Error('Solo un borrador se puede confirmar.');
  }

  const event: OrderStatusEvent = {
    status: 'confirmado',
    at: Timestamp.now(),
    by: actor.uid,
    byRole: actor.role,
  };

  await updateDoc(ref, {
    items: patch.items,
    deliveryDate: Timestamp.fromDate(patch.deliveryDate),
    notes: patch.notes.trim() || null,
    status: 'confirmado',
    statusHistory: [...(current.statusHistory ?? []), event],
    updatedAt: serverTimestamp(),
  });

  const updated: Order = {
    ...current,
    items: patch.items,
    deliveryDate: Timestamp.fromDate(patch.deliveryDate),
    notes: patch.notes.trim() || undefined,
    status: 'confirmado',
    statusHistory: [...(current.statusHistory ?? []), event],
  };

  void notifyAdmins({
    subject: `Nuevo pedido ${id} — ${current.clientSnapshot.company || current.clientSnapshot.name}`,
    html: renderNewOrderEmail(updated),
  });
  const receipt = renderOrderReceiptEmail(updated);
  void notifyClient(current.clientSnapshot.email, receipt.subject, receipt.html);
}

export async function changeOrderStatus(
  id: string,
  to: OrderStatus,
  actor: { uid: string; role: 'cliente' | 'admin' },
  opts: { hasDifference?: boolean; differenceNotes?: string; note?: string } = {},
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Pedido no existe.');
  const current = snap.data() as Order;

  const event: OrderStatusEvent = {
    status: to,
    at: Timestamp.now(),
    by: actor.uid,
    byRole: actor.role,
    ...(opts.note ? { note: opts.note } : {}),
  };

  const update: Record<string, unknown> = {
    status: to,
    statusHistory: [...(current.statusHistory ?? []), event],
    updatedAt: serverTimestamp(),
  };
  if (opts.hasDifference !== undefined) update.hasDifference = opts.hasDifference;
  if (opts.differenceNotes !== undefined) update.differenceNotes = opts.differenceNotes.trim() || null;

  await updateDoc(ref, update);

  const updated: Order = {
    ...current,
    status: to,
    hasDifference: opts.hasDifference ?? current.hasDifference,
  };

  if (to === 'confirmado') {
    // Draft→confirmado path: user (or admin) confirms an existing borrador.
    // The receipt sent here is the counterpart of the one in createOrder();
    // only one of the two runs per order, so the client sees exactly one
    // receipt per confirmation. Do NOT also send the status-change email
    // below — 'confirmado' is intentionally excluded from that branch.
    void notifyAdmins({
      subject: `Nuevo pedido ${id} — ${current.clientSnapshot.company || current.clientSnapshot.name}`,
      html: renderNewOrderEmail(updated),
    });
    const receipt = renderOrderReceiptEmail(updated);
    void notifyClient(current.clientSnapshot.email, receipt.subject, receipt.html);
  } else if (to === 'en-preparacion' || to === 'entregado') {
    const msg = renderStatusChangeEmail(updated, to);
    void notifyClient(current.clientSnapshot.email, msg.subject, msg.html);
  }
}

export async function batchChangeStatus(
  ids: string[],
  to: OrderStatus,
  actor: { uid: string; role: 'admin' },
): Promise<void> {
  if (!ids.length) return;
  const batch = writeBatch(db);
  const event: OrderStatusEvent = {
    status: to,
    at: Timestamp.now(),
    by: actor.uid,
    byRole: 'admin',
  };
  for (const id of ids) {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) continue;
    const cur = snap.data() as Order;
    batch.update(ref, {
      status: to,
      statusHistory: [...(cur.statusHistory ?? []), event],
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}

export function subscribeMyOrders(
  clientId: string,
  cb: (orders: Order[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as Order)));
}

export function subscribeOrdersByStatus(
  status: OrderStatus,
  cb: (orders: Order[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', status),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as Order)));
}

export function subscribeAllOrders(cb: (orders: Order[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as Order)));
}

export function subscribeOrder(id: string, cb: (o: Order | null) => void): Unsubscribe {
  return onSnapshot(doc(db, COLLECTION, id), (snap) => {
    cb(snap.exists() ? (snap.data() as Order) : null);
  });
}

export async function getOrder(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? (snap.data() as Order) : null;
}

export async function fetchOrdersInDateRange(
  status: OrderStatus,
  fromDate: Date,
  toDate: Date,
): Promise<Order[]> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', status),
    where('deliveryDate', '>=', Timestamp.fromDate(fromDate)),
    where('deliveryDate', '<=', Timestamp.fromDate(toDate)),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Order);
}

export interface ConsolidatedRow {
  productId: string;
  slug: string;
  name: string;
  presentation: string;
  totalQuantity: number;
  perOrder: { orderId: string; clientName: string; quantity: number }[];
}

export function consolidateByProduct(orders: Order[]): ConsolidatedRow[] {
  const map = new Map<string, ConsolidatedRow>();
  for (const o of orders) {
    for (const it of o.items) {
      const key = it.productId || it.slug;
      const existing = map.get(key);
      if (existing) {
        existing.totalQuantity += it.quantity;
        existing.perOrder.push({
          orderId: o.id,
          clientName: o.clientSnapshot.company || o.clientSnapshot.name,
          quantity: it.quantity,
        });
      } else {
        map.set(key, {
          productId: it.productId,
          slug: it.slug,
          name: it.name,
          presentation: it.presentation,
          totalQuantity: it.quantity,
          perOrder: [
            {
              orderId: o.id,
              clientName: o.clientSnapshot.company || o.clientSnapshot.name,
              quantity: it.quantity,
            },
          ],
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

function renderNewOrderEmail(o: Order): string {
  const lines: string[] = [];
  lines.push(`<h2>Pedido ${o.id}</h2>`);
  lines.push(`<p><strong>${o.clientSnapshot.company || o.clientSnapshot.name}</strong> — ${o.clientSnapshot.email} · ${o.clientSnapshot.phone}</p>`);
  lines.push(`<p>Comuna: ${o.clientSnapshot.comuna} · Estado: ${orderStatusLabel(o.status)}</p>`);
  lines.push(`<p>Fecha de entrega: ${o.deliveryDate.toDate().toLocaleDateString('es-CL')}</p>`);
  lines.push('<h3>Productos</h3><ul>');
  for (const it of o.items) {
    lines.push(`<li>${it.name} — ${it.quantity} × ${it.presentation}</li>`);
  }
  lines.push('</ul>');
  if (o.notes) lines.push(`<p><em>Notas:</em> ${o.notes}</p>`);
  lines.push(`<p>Total ítems: ${countItems(o.items)}</p>`);
  return lines.join('\n');
}
