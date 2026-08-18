import { doc, runTransaction } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Generate a human-friendly sequential order ID like "ORD-2026-0001".
 * Uses a per-year counter document in `counters/orders-{year}` bumped
 * transactionally so parallel writers never collide.
 */
export async function nextOrderId(now: Date = new Date()): Promise<string> {
  const year = now.getFullYear();
  const counterRef = doc(db, 'counters', `orders-${year}`);

  const next = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? ((snap.data().next as number) ?? 1) : 1;
    tx.set(counterRef, { next: current + 1 }, { merge: true });
    return current;
  });

  return `ORD-${year}-${String(next).padStart(4, '0')}`;
}
