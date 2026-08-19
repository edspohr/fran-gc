import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { makeEnv, seed, signedIn } from './setup';

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
      status: 'borrador',
      items: [],
      clientSnapshot: { email: 'a@example.com', name: 'A', company: 'ACo', comuna: 'X', phone: '1' },
      statusHistory: [],
      updatedAt: new Date(),
    });
  });
});

describe('orders — owner update bounds', () => {
  it('client cannot jump own order to entregado', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertFails(
      updateDoc(doc(ctx.firestore(), 'orders', 'ORD-2026-0001'), {
        status: 'entregado',
        updatedAt: new Date(),
      }),
    );
  });

  it('client cannot mutate clientSnapshot', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertFails(
      updateDoc(doc(ctx.firestore(), 'orders', 'ORD-2026-0001'), {
        clientSnapshot: {
          email: 'a@example.com',
          name: 'HACKED',
          company: 'ACo',
          comuna: 'X',
          phone: '1',
        },
        updatedAt: new Date(),
      }),
    );
  });

  it('client can move borrador -> confirmado editing only allowed keys', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertSucceeds(
      updateDoc(doc(ctx.firestore(), 'orders', 'ORD-2026-0001'), {
        status: 'confirmado',
        statusHistory: [
          { status: 'confirmado', at: new Date(), by: 'user-a', byRole: 'cliente' },
        ],
        updatedAt: new Date(),
      }),
    );
  });
});
