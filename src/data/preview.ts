import { Timestamp } from 'firebase/firestore';
import { seedProducts } from '../../scripts/seed-data';
import type { Product } from '@/types/product';

const now = Timestamp.fromDate(new Date());

/**
 * Dev-only fallback used when Firebase env vars are not configured.
 * Returns the seed catalog with synthetic timestamps and generated crop URLs.
 */
export function previewProducts(): Product[] {
  return seedProducts.map((p): Product => {
    const hasCrop = generatedCropSlugs.has(p.slug);
    return {
      id: p.slug,
      name: p.name,
      slug: p.slug,
      category: p.category,
      description: p.description,
      presentation: p.presentation,
      unitType: p.unitType,
      tags: p.tags,
      featured: p.featured,
      visible: p.visible,
      order: p.order,
      imageUrl: hasCrop ? `/preview-crops/${p.slug}.jpg` : undefined,
      createdAt: now,
      updatedAt: now,
    };
  });
}

const generatedCropSlugs = new Set([
  'guanciale-madurado','coppa','chorizo-espanol','fuet-espanol',
  'bresaola','fuet-cranberry',
  'prieta-morcilla-boudin-frances','longaniza-butifarra','longaniza-tipo-chillan','mix-de-longanizas',
  'pastrami-cerdo','pastrami-vacuno','pate-de-campo','panceta-ahumada','vienesa-frankfurt',
  'pastirma-de-cerdo','pastirma-de-vacuno','panceta-madurada',
  'lomo-embuchado','sobrasada-untable','salame-italiano','salame-milano','pepperoni-madurado',
  'salchicha-angus','chuleta-ahumada','costillar-cerdo-ahumado','jamon-pierna-ahumado-artesanal','queso-gouda-ahumado',
  'charqui-cerdo','charqui-vacuno','chicharron',
]);
