import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { admin, anonymous, makeEnv, seed, signedIn } from './setup';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await makeEnv();
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await seed(env, async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'orders', 'ORD-2026-0001'), {
      id: 'ORD-2026-0001',
      clientId: 'user-a',
      status: 'confirmado',
      items: [],
    });
    await setDoc(doc(db, 'orders', 'ORD-2026-0002'), {
      id: 'ORD-2026-0002',
      clientId: 'user-b',
      status: 'confirmado',
      items: [],
    });
  });
});

describe('orders — get/list authorization', () => {
  it('signed-in non-owner cannot get another user order', async () => {
    const ctx = signedIn(env, 'user-b', 'b@example.com');
    await assertFails(getDoc(doc(ctx.firestore(), 'orders', 'ORD-2026-0001')));
  });

  it('signed-in non-owner cannot list all orders', async () => {
    const ctx = signedIn(env, 'user-b', 'b@example.com');
    // A bare collection list (no where clause) must be denied.
    await assertFails(getDocs(collection(ctx.firestore(), 'orders')));
  });

  it('owner can get their own order', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertSucceeds(getDoc(doc(ctx.firestore(), 'orders', 'ORD-2026-0001')));
  });

  it('owner can list their own orders via a clientId filter', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    const q = query(
      collection(ctx.firestore(), 'orders'),
      where('clientId', '==', 'user-a'),
    );
    await assertSucceeds(getDocs(q));
  });

  it('admin can list all orders', async () => {
    const ctx = admin(env);
    await assertSucceeds(getDocs(collection(ctx.firestore(), 'orders')));
  });

  it('anonymous cannot read orders', async () => {
    const ctx = anonymous(env);
    await assertFails(getDoc(doc(ctx.firestore(), 'orders', 'ORD-2026-0001')));
  });
});
