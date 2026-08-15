import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoPath = resolve(__dirname, '..', 'assets', 'brand', 'logo-frangc-full-transparent.png');
const outPath = resolve(__dirname, '..', 'public', 'og-default.png');

const WIDTH = 1200;
const HEIGHT = 630;

async function main(): Promise<void> {
  mkdirSync(dirname(outPath), { recursive: true });

  const logo = await sharp(logoPath)
    .resize({ height: 460, fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer();
  const meta = await sharp(logo).metadata();
  const logoW = meta.width ?? 0;
  const logoH = meta.height ?? 0;

  const bg = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#181818"/>
          <stop offset="1" stop-color="#0E0E0E"/>
        </linearGradient>
        <pattern id="hair" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="url(#g)"/>
        </pattern>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/>
      <line x1="60" y1="${HEIGHT - 90}" x2="200" y2="${HEIGHT - 90}" stroke="#AE9A79" stroke-width="1.5"/>
      <text x="60" y="${HEIGHT - 60}" fill="#EDE5D6" font-family="Georgia, serif" font-size="26">FRAN GC SpA · Charcutería fina mayorista</text>
      <text x="60" y="${HEIGHT - 32}" fill="#AE9A79" font-family="Georgia, serif" font-size="18" font-style="italic">Representante V Región · Valparaíso, Chile</text>
    </svg>`,
  );

  await sharp(bg)
    .composite([
      {
        input: logo,
        left: Math.round((WIDTH - logoW) / 2),
        top: Math.round((HEIGHT - logoH) / 2 - 30),
      },
    ])
    .png()
    .toFile(outPath);

  console.log(`[og] Wrote ${outPath} (${WIDTH}×${HEIGHT})`);
}

main().catch((err) => {
  console.error('[og] Failed:', err);
  process.exit(1);
});
