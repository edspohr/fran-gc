import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';
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
});

describe('counters — monotonic +1 invariant', () => {
  it('first create with next=2 succeeds', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertSucceeds(
      setDoc(doc(ctx.firestore(), 'counters', 'orders-2026'), { next: 2 }),
    );
  });

  it('first create with next!=2 fails', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertFails(
      setDoc(doc(ctx.firestore(), 'counters', 'orders-2026'), { next: 5 }),
    );
  });

  it('cannot decrease the counter', async () => {
    await seed(env, async (sctx) => {
      await setDoc(doc(sctx.firestore(), 'counters', 'orders-2026'), { next: 10 });
    });
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertFails(
      setDoc(doc(ctx.firestore(), 'counters', 'orders-2026'), { next: 5 }),
    );
  });

  it('cannot jump by 2', async () => {
    await seed(env, async (sctx) => {
      await setDoc(doc(sctx.firestore(), 'counters', 'orders-2026'), { next: 10 });
    });
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertFails(
      setDoc(doc(ctx.firestore(), 'counters', 'orders-2026'), { next: 12 }),
    );
  });

  it('+1 increment succeeds', async () => {
    await seed(env, async (sctx) => {
      await setDoc(doc(sctx.firestore(), 'counters', 'orders-2026'), { next: 10 });
    });
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertSucceeds(
      setDoc(doc(ctx.firestore(), 'counters', 'orders-2026'), { next: 11 }),
    );
  });
});
