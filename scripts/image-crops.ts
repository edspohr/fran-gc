/**
 * Map product slugs → crop rectangles inside supplier catalog pages.
 *
 * All coordinates were calibrated manually against 720×1600 catalog pages
 * from La Charcutería Artesanal. Squares (w=h=210) at x=135 land on the
 * product photos in the left column across all pages.
 *
 * NEVER reference "14.39.27.jpeg" (no suffix) or "14.39.29.jpeg" (no suffix)
 * or "14.39.28 (4).jpeg", "14.39.28 (5).jpeg", "14.39.29 (3).jpeg" — these
 * are the price list or unrelated pages. crop-images.ts refuses them.
 *
 * If a slug is not listed here, the product uses the branded placeholder
 * rendered by <ProductImage/> until an admin uploads a real photo via the
 * ImageCropTool in the admin panel.
 */
const CATALOG = 'info-lacharcuteria';

export interface Crop {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// Explicit list of banned filenames — the price sheet and other non-product
// pages must never be sliced up as product photos.
export const BANNED_SOURCES = [
  `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.27.jpeg`,
  `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28 (4).jpeg`,
  `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28 (5).jpeg`,
  `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.29.jpeg`,
  `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.29 (3).jpeg`,
];

const p27_1 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.27 (1).jpeg`; // Pastirma×2, Panceta Madurada, Tabla Charcutera, Guanciale
const p28   = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28.jpeg`;     // Prieta, Lomo Kassler, Butifarra, Chillán, Mix Longanizas
const p28_1 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28 (1).jpeg`; // Pastrami Cerdo, Pastrami Vacuno, Paté, Panceta Ahumada, Frankfurt
const p28_2 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28 (2).jpeg`; // Chorizo, Coppa, Bresaola, Fuet, Fuet Cranberry
const p28_3 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.28 (3).jpeg`; // Charqui Cerdo, Charqui Vacuno, Chicharrón (3 rows only — DO NOT scan below y≈900, hotel logos live there)
const p29_1 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.29 (1).jpeg`; // Lomo Embuchado, Sobrasada, Salame Italiano, Salame Milano, Pepperoni
const p29_2 = `${CATALOG}/WhatsApp Image 2026-08-15 at 14.39.29 (2).jpeg`; // Salchicha Angus, Chuleta Ahumada, Costillar, Jamón, Queso Gouda

// The catalog product photos are ~210 px wide × 180 px tall. We extract
// a 210×210 square (adding a bit of the dark surface above and below to
// center the plated photo). Sharp then resizes 1:1 to 800×800 without
// further cropping.
const CROP_W = 210;
const CROP_H = 210;
const sq = (src: string, y: number): Crop => ({ src, x: 135, y, w: CROP_W, h: CROP_H });

export const cropsBySlug: Record<string, Crop> = {
  // ── p27 (1) — Pastirma, Panceta Madurada, Tabla, Guanciale ─────────────
  'pastirma-de-cerdo':  sq(p27_1, 245),
  'pastirma-de-vacuno': sq(p27_1, 480),
  'panceta-madurada':   sq(p27_1, 725),
  'guanciale-madurado': sq(p27_1, 1100),

  // ── p28 — Prieta, Lomo Kassler, Butifarra, Chillán, Mix ────────────────
  'prieta-morcilla-boudin-frances': sq(p28, 285),
  'lomo-kassler':                    sq(p28, 525),
  'longaniza-butifarra':             sq(p28, 770),
  'longaniza-tipo-chillan':          sq(p28, 1005),
  'mix-de-longanizas':               sq(p28, 1220),

  // ── p28 (1) — Pastrami Cerdo, Pastrami Vacuno, Paté, Panceta Ahumada, Frankfurt
  'pastrami-cerdo':    sq(p28_1, 300),
  'pastrami-vacuno':   sq(p28_1, 555),
  'pate-de-campo':     sq(p28_1, 795),
  'panceta-ahumada':   sq(p28_1, 1035),
  'vienesa-frankfurt': sq(p28_1, 1200),

  // ── p28 (2) — Chorizo, Coppa, Bresaola, Fuet, Fuet Cranberry ───────────
  'chorizo-espanol': sq(p28_2, 380),
  coppa:             sq(p28_2, 590),
  bresaola:          sq(p28_2, 850),
  'fuet-espanol':    sq(p28_2, 1080),
  'fuet-cranberry':  sq(p28_2, 1240),

  // ── p28 (3) — Charqui Cerdo, Charqui Vacuno, Chicharrón ────────────────
  //   ⚠ Only 3 photos on this page; below y≈900 are hotel client logos.
  'charqui-cerdo':   sq(p28_3, 305),
  'charqui-vacuno':  sq(p28_3, 495),
  chicharron:        sq(p28_3, 720),

  // ── p29 (1) — Lomo Embuchado, Sobrasada, Salame Italiano, Milano, Pepperoni
  'lomo-embuchado':     sq(p29_1, 260),
  'sobrasada-untable':  sq(p29_1, 500),
  'salame-italiano':    sq(p29_1, 735),
  'salame-milano':      sq(p29_1, 970),
  'pepperoni-madurado': sq(p29_1, 1170),

  // ── p29 (2) — Salchicha Angus, Chuleta, Costillar, Jamón, Queso ───────
  'salchicha-angus':                 sq(p29_2, 215),
  'chuleta-ahumada':                 sq(p29_2, 610),
  'costillar-cerdo-ahumado':         sq(p29_2, 870),
  'jamon-pierna-ahumado-artesanal':  sq(p29_2, 1080),
  'queso-gouda-ahumado':             sq(p29_2, 1250),
};
