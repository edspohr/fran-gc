import { Timestamp } from 'firebase/firestore';
import { seedProducts } from '../../scripts/seed-data';
import { cropsBySlug } from '../../scripts/image-crops';
import type { Product } from '@/types/product';

const now = Timestamp.fromDate(new Date());

/**
 * Dev-only fallback used when Firebase env vars are not configured.
 * Returns the seed catalog with synthetic timestamps and generated crop URLs.
 */
export function previewProducts(): Product[] {
  return seedProducts.map((p): Product => ({
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
    imageUrl: cropsBySlug[p.slug] ? `/preview-crops/${p.slug}.jpg` : undefined,
    createdAt: now,
    updatedAt: now,
  }));
}
