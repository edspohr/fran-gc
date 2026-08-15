import type { Timestamp } from 'firebase/firestore';

export const CATEGORIES = [
  { id: 'longanizas-vienesas-ahumadas', label: 'Longanizas y Vienesas Ahumadas' },
  { id: 'productos-madurados', label: 'Productos Madurados' },
  { id: 'charqui', label: 'Charqui' },
  { id: 'productos-cocidos', label: 'Productos Cocidos' },
  { id: 'untables', label: 'Untables' },
  { id: 'tablas', label: 'Tablas' },
] as const;

export type Category = (typeof CATEGORIES)[number]['id'];

export const UNIT_TYPES = ['kg', 'unidad', 'sachet'] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

export const TAGS = [
  { id: 'gondola', label: 'Góndola / Reventa' },
  { id: 'horeca', label: 'Cocina / HORECA' },
] as const;

export type Tag = (typeof TAGS)[number]['id'];

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  presentation: string;
  unitType: UnitType;
  tags: Tag[];
  featured: boolean;
  visible: boolean;
  order: number;
  imageUrl?: string;
  imagePath?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export const categoryLabel = (id: Category): string =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const tagLabel = (id: Tag): string => TAGS.find((t) => t.id === id)?.label ?? id;
