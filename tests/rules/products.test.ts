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
import { admin, anonymous, makeEnv, seed } from './setup';

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
    await setDoc(doc(db, 'products', 'chorizo-parrillero'), {
      name: 'Chorizo parrillero',
      slug: 'chorizo-parrillero',
      visible: true,
      order: 1,
    });
    await setDoc(doc(db, 'products', 'jamon-serrano'), {
      name: 'Jamón serrano',
      slug: 'jamon-serrano',
      visible: true,
      order: 2,
    });
    await setDoc(doc(db, 'products', 'oculto'), {
      name: 'Oculto',
      slug: 'oculto',
      visible: false,
      order: 3,
    });
  });
});

describe('products — public read gate', () => {
  it('anonymous can list only visible==true products', async () => {
    const ctx = anonymous(env);
    const q = query(
      collection(ctx.firestore(), 'products'),
      where('visible', '==', true),
    );
    await assertSucceeds(getDocs(q));
  });

  it('anonymous cannot get a hidden product', async () => {
    const ctx = anonymous(env);
    await assertFails(getDoc(doc(ctx.firestore(), 'products', 'oculto')));
  });

  it('anonymous cannot list without visible filter', async () => {
    const ctx = anonymous(env);
    await assertFails(getDocs(collection(ctx.firestore(), 'products')));
  });

  it('admin can get a hidden product', async () => {
    const ctx = admin(env);
    await assertSucceeds(getDoc(doc(ctx.firestore(), 'products', 'oculto')));
  });
});
