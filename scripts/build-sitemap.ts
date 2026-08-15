import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_ROUTES, SITE_URL } from '../src/config/site';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '..', 'public', 'sitemap.xml');

const today = new Date().toISOString().slice(0, 10);
const priorities: Record<string, string> = {
  '/': '1.0',
  '/catalogo': '0.9',
  '/como-trabajamos': '0.7',
  '/nosotros': '0.6',
  '/contacto': '0.7',
  '/politica-de-privacidad': '0.3',
  '/terminos': '0.3',
};

const urls = PUBLIC_ROUTES.map((path) => {
  const loc = new URL(path, SITE_URL).toString();
  const priority = priorities[path] ?? '0.5';
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, 'utf8');
console.log(`sitemap.xml written to ${outPath} (${PUBLIC_ROUTES.length} routes)`);
