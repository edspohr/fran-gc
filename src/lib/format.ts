import type { UnitType } from '@/types/product';

const UNIT_LABEL: Record<UnitType, { singular: string; plural: string }> = {
  kg: { singular: 'kg', plural: 'kg' },
  unidad: { singular: 'unidad', plural: 'unidades' },
  sachet: { singular: 'sachet', plural: 'sachets' },
};

export function formatUnit(quantity: number, unitType: UnitType): string {
  const label = UNIT_LABEL[unitType];
  const rounded =
    unitType === 'kg' ? Number(quantity.toFixed(2)).toString() : Math.round(quantity).toString();
  const noun = quantity === 1 ? label.singular : label.plural;
  return `${rounded} ${noun}`;
}

export function isValidQuantity(quantity: number, unitType: UnitType): boolean {
  if (!Number.isFinite(quantity) || quantity <= 0) return false;
  if (unitType !== 'kg' && !Number.isInteger(quantity)) return false;
  return true;
}
