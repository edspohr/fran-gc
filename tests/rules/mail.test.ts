import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { anonymous, makeEnv, signedIn } from './setup';
import { ADMIN_EMAILS } from '../../src/lib/admin';

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

describe('mail — locked to admins and self-receipts', () => {
  it('signed-in user cannot read mail', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertFails(getDocs(collection(ctx.firestore(), 'mail')));
  });

  it('anonymous cannot create mail', async () => {
    const ctx = anonymous(env);
    await assertFails(
      addDoc(collection(ctx.firestore(), 'mail'), {
        to: ['foo@bar.com'],
        message: { subject: 'x', html: 'x' },
      }),
    );
  });

  it('signed-in user cannot create a mail doc addressed to arbitrary recipients', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertFails(
      addDoc(collection(ctx.firestore(), 'mail'), {
        to: ['someone-else@example.com'],
        message: { subject: 'x', html: 'x' },
      }),
    );
  });

  it('signed-in user can create a mail doc addressed to the admin list', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertSucceeds(
      addDoc(collection(ctx.firestore(), 'mail'), {
        to: [...ADMIN_EMAILS],
        message: { subject: 'Nuevo pedido', html: '<p>Hola</p>' },
      }),
    );
  });

  it('signed-in user can create a mail doc addressed to their own email', async () => {
    const ctx = signedIn(env, 'user-a', 'a@example.com');
    await assertSucceeds(
      addDoc(collection(ctx.firestore(), 'mail'), {
        to: ['a@example.com'],
        message: { subject: 'Recibo', html: '<p>Su pedido</p>' },
      }),
    );
  });

  it('client receipt: address sourced from a lowercased profile email passes the rule', async () => {
    // Simulates the runtime path: profile.email is stored .toLowerCase() by
    // ensureClient(); the auth token email is also lowercase. notifyClient()
    // additionally lowercases. Prove the resulting doc satisfies the rule
    // when the caller passes the profile email verbatim (not a hardcoded
    // literal), i.e. even if the original OAuth email had mixed case.
    const authEmail = 'mixed.case@example.com';
    const ctx = signedIn(env, 'user-b', authEmail);
    const profileEmail = 'Mixed.Case@Example.com'.toLowerCase(); // as stored
    await assertSucceeds(
      addDoc(collection(ctx.firestore(), 'mail'), {
        to: [profileEmail.toLowerCase()],
        message: { subject: 'Su pedido ORD-2026-0001 quedó confirmado', html: '<p>Gracias.</p>' },
      }),
    );
  });

  it('client receipt with wrong-case address is rejected (guard for regression)', async () => {
    const ctx = signedIn(env, 'user-c', 'lower@example.com');
    await assertFails(
      addDoc(collection(ctx.firestore(), 'mail'), {
        to: ['LOWER@example.com'],
        message: { subject: 'x', html: 'x' },
      }),
    );
  });
});
