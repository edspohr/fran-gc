/**
 * Idempotent seeder for the `products` collection.
 *
 * Usage:
 *   npm run seed              → writes to real Firestore (needs GOOGLE_APPLICATION_CREDENTIALS)
 *   npm run seed:emu          → writes to local emulator (FIRESTORE_EMULATOR_HOST=127.0.0.1:8080)
 *   npm run seed -- --purge   → also deletes docs whose slug is not in seed-data
 */
import { cert, initializeApp, applicationDefault } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'node:fs';
import { seedProducts } from './seed-data';

const args = new Set(process.argv.slice(2));
const purge = args.has('--purge');

const projectId = process.env.VITE_FIREBASE_PROJECT_ID ?? 'fran-gc';
const usingEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

if (usingEmulator) {
  initializeApp({ projectId });
  console.log(`[seed] Using Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
} else {
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credsPath && existsSync(credsPath)) {
    const raw = JSON.parse(readFileSync(credsPath, 'utf8')) as {
      project_id?: string;
    };
    initializeApp({
      credential: cert(credsPath),
      projectId: raw.project_id ?? projectId,
    });
    console.log(`[seed] Using service account: ${credsPath}`);
  } else {
    initializeApp({ credential: applicationDefault(), projectId });
    console.log('[seed] Using application default credentials');
  }
}

const db = getFirestore();
const COLLECTION = 'products';

async function main(): Promise<void> {
  console.log(`[seed] Upserting ${seedProducts.length} products…`);

  const seedSlugs = new Set(seedProducts.map((p) => p.slug));
  const existing = await db.collection(COLLECTION).get();
  const existingIds = new Set(existing.docs.map((d) => d.id));

  let created = 0;
  let updated = 0;

  for (const item of seedProducts) {
    const ref = db.collection(COLLECTION).doc(item.slug);
    const wasNew = !existingIds.has(item.slug);

    await ref.set(
      {
        ...item,
        id: item.slug,
        ...(wasNew ? { createdAt: FieldValue.serverTimestamp() } : {}),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    if (wasNew) created += 1;
    else updated += 1;
  }

  console.log(`[seed] ${created} created, ${updated} updated.`);

  if (purge) {
    const toDelete = existing.docs.filter((d) => !seedSlugs.has(d.id));
    if (toDelete.length === 0) {
      console.log('[seed] --purge: nothing to delete.');
    } else {
      const batch = db.batch();
      toDelete.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      console.log(`[seed] --purge: deleted ${toDelete.length} unknown docs.`);
    }
  }

  console.log('[seed] Done.');
}

main().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
