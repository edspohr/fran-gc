/**
 * Map product slugs → crop rectangles inside supplier catalog pages.
 *
 * Coordinates are approximate; images ship at 800×800 (JPEG). If a slug is
 * not listed here, the product uses the branded placeholder rendered by
 * <ProductImage/> until an admin uploads a real photo.
 *
 * Add or refine entries and re-run `npm run images:crop`.
 */
const CATALOG = 'info-lacharcuteria';

export interface Crop {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// The stock 720×1600 catalog pages place 5 product photos vertically on the
// left column. This helper returns approximate coordinates for row `n` of `N`
// (1-indexed). It's intentionally rough — supplier pages have varying header
// heights.
const IMAGE_HEIGHT = 1600;
const row = (src: string, n: number, N = 5, offset = 0): Crop => {
  const top = 280 + offset;
  const bottomMargin = 40;
  const usable = IMAGE_HEIGHT - top - bottomMargin;
  const rowHeight = usable / N;
  return {
    src,
    x: 100,
    y: Math.round(top + (n - 1) * rowHeight),
    w: 260,
    h: Math.round(rowHeight - 10),
  };
};

const p27_1 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.27 (1).jpeg`; // Pastirma×2, Panceta, Tabla, Guanciale
const p28 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28.jpeg`; // Pastrami×2, Paté, Pancetta, Frankfurt
const p28_1 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28 (1).jpeg`; // Prieta, Lomo Kassler, Butifarra, Chillán, Mix
const p28_2 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28 (2).jpeg`; // Chorizo, Coppa, Bresaola, Fuet, Fuet Cranberry
const p28_3 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28 (3).jpeg`; // Charqui Cerdo, Vacuno, Chicharrón
const p29_1 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.29 (1).jpeg`; // Lomo Emb., Sobrasada, S. Italiano, S. Milano, Pepperoni
const p29_2 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.29 (2).jpeg`; // Salchicha Angus, Chuleta Ahumada, Costillar, Jamón, Queso

export const cropsBySlug: Record<string, Crop> = {
  // Featured (shown on Home carousel)
  'guanciale-madurado': row(p27_1, 5),
  coppa: row(p28_2, 2, 5, 40),
  'chorizo-espanol': row(p28_2, 1, 5, 40),
  'fuet-espanol': row(p28_2, 4, 5, 40),

  // Productos Madurados (page 14.39.28 (2))
  bresaola: row(p28_2, 3, 5, 40),
  'fuet-cranberry': row(p28_2, 5, 5, 40),

  // Longanizas (page 14.39.28 (1))
  'prieta-morcilla-boudin-frances': row(p28_1, 1),
  'longaniza-butifarra': row(p28_1, 3),
  'longaniza-tipo-chillan': row(p28_1, 4),
  'mix-de-longanizas': row(p28_1, 5),

  // Productos Cocidos (page 14.39.28)
  'pastrami-cerdo': row(p28, 1),
  'pastrami-vacuno': row(p28, 2),
  'pate-de-campo': row(p28, 3),
  'panceta-ahumada': row(p28, 4),
  'vienesa-frankfurt': row(p28, 5),

  // Productos Madurados / Cocidos (page 14.39.27 (1))
  'pastirma-de-cerdo': row(p27_1, 1),
  'pastirma-de-vacuno': row(p27_1, 2),
  'panceta-madurada': row(p27_1, 3),

  // Salames + Untables (page 14.39.29 (1))
  'lomo-embuchado': row(p29_1, 1),
  'sobrasada-untable': row(p29_1, 2),
  'salame-italiano': row(p29_1, 3),
  'salame-milano': row(p29_1, 4),
  'pepperoni-madurado': row(p29_1, 5),

  // Ahumados (page 14.39.29 (2))
  'salchicha-angus': row(p29_2, 1),
  'chuleta-ahumada': row(p29_2, 2, 5, 460),
  'costillar-cerdo-ahumado': row(p29_2, 3, 5, 460),
  'jamon-pierna-ahumado-artesanal': row(p29_2, 4, 5, 460),
  'queso-gouda-ahumado': row(p29_2, 5, 5, 460),

  // Charqui (page 14.39.28 (3)) — only 3 rows on this page
  'charqui-cerdo': row(p28_3, 1, 3, 100),
  'charqui-vacuno': row(p28_3, 2, 3, 100),
  chicharron: row(p28_3, 3, 3, 100),
};
