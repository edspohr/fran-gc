/**
 * Uploads generated crops in `scripts/generated-crops/` to Firebase Storage
 * under `products/<slug>.jpg`, then patches the corresponding Firestore doc
 * with `imageUrl` and `imagePath`.
 *
 * Usage:
 *   npm run images:upload             → real Storage (needs credentials)
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
 *   FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199 \
 *     npm run images:upload           → local emulator
 */
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const cropsDir = resolve(__dirname, 'generated-crops');
const projectId = process.env.VITE_FIREBASE_PROJECT_ID ?? 'fran-gc';
const bucketName = process.env.VITE_FIREBASE_STORAGE_BUCKET ?? `${projectId}.appspot.com`;
const usingEmulator = Boolean(process.env.FIREBASE_STORAGE_EMULATOR_HOST);

if (usingEmulator) {
  initializeApp({ projectId, storageBucket: bucketName });
  console.log(
    `[upload] Using emulators (Firestore: ${process.env.FIRESTORE_EMULATOR_HOST}, Storage: ${process.env.FIREBASE_STORAGE_EMULATOR_HOST})`,
  );
} else {
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credsPath && existsSync(credsPath)) {
    const raw = JSON.parse(readFileSync(credsPath, 'utf8')) as { project_id?: string };
    initializeApp({
      credential: cert(credsPath),
      projectId: raw.project_id ?? projectId,
      storageBucket: bucketName,
    });
  } else {
    initializeApp({ credential: applicationDefault(), projectId, storageBucket: bucketName });
  }
}

const db = getFirestore();
const bucket = getStorage().bucket();

async function main(): Promise<void> {
  if (!existsSync(cropsDir)) {
    console.error(`[upload] Missing ${cropsDir}. Run \`npm run images:crop\` first.`);
    process.exit(1);
  }
  const files = readdirSync(cropsDir).filter((f) => f.endsWith('.jpg'));
  if (files.length === 0) {
    console.log('[upload] No generated crops to upload.');
    return;
  }

  console.log(`[upload] Uploading ${files.length} images to gs://${bucketName}/products/`);

  for (const file of files) {
    const slug = basename(file, extname(file));
    const src = resolve(cropsDir, file);
    const dest = `products/${file}`;

    await bucket.upload(src, {
      destination: dest,
      contentType: 'image/jpeg',
      metadata: {
        cacheControl: 'public, max-age=31536000, immutable',
        metadata: { source: 'seed' },
      },
    });

    // The Firebase Storage URL is publicly readable when storage.rules
    // allows read on the path (which ours does for products/*). Skipping
    // makePublic() because uniform bucket-level access disables per-object ACLs.
    let imageUrl: string;
    if (usingEmulator) {
      const host = process.env.FIREBASE_STORAGE_EMULATOR_HOST;
      imageUrl = `http://${host}/v0/b/${bucketName}/o/${encodeURIComponent(dest)}?alt=media`;
    } else {
      imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(dest)}?alt=media`;
    }

    await db.collection('products').doc(slug).set(
      { imageUrl, imagePath: dest, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    console.log(`  ✓ ${slug} → ${dest}`);
  }

  console.log('[upload] Done.');
}

main().catch((err) => {
  console.error('[upload] Failed:', err);
  process.exit(1);
});
