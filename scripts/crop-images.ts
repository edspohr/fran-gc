import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { BANNED_SOURCES, cropsBySlug } from './image-crops';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const outDir = resolve(__dirname, 'generated-crops');

mkdirSync(outDir, { recursive: true });

const OUT_SIZE = 800;

async function main(): Promise<void> {
  const entries = Object.entries(cropsBySlug);
  console.log(`[crop] Processing ${entries.length} products…`);

  for (const [slug, crop] of entries) {
    if (BANNED_SOURCES.includes(crop.src)) {
      throw new Error(`[crop] Refusing to slice banned source "${crop.src}" for "${slug}" — this file is the price list or a non-product page.`);
    }

    const srcPath = resolve(repoRoot, crop.src);
    const destPath = resolve(outDir, `${slug}.jpg`);

    try {
      // Extracted crop is already square (w=h=210); sharp scales 1:1 to
      // 800×800 without further cropping. Coordinate calibration includes
      // a small vertical margin above/below the photo to keep it centered.
      await sharp(srcPath)
        .extract({ left: crop.x, top: crop.y, width: crop.w, height: crop.h })
        .resize(OUT_SIZE, OUT_SIZE)
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toFile(destPath);
      console.log(`  ✓ ${slug}.jpg`);
    } catch (err) {
      console.error(`  ✗ ${slug}: ${(err as Error).message}`);
    }
  }

  console.log(`[crop] Done. Output → ${outDir}`);
}

main().catch((err) => {
  console.error('[crop] Failed:', err);
  process.exit(1);
});
