import type { UnitType } from './product';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  presentation: string;
  unitType: UnitType;
  quantity: number;
}

export interface CartMeta {
  businessName: string;
  comuna: string;
  note: string;
}

export interface CartState {
  items: CartItem[];
  meta: CartMeta;
}

export const emptyCart: CartState = {
  items: [],
  meta: { businessName: '', comuna: '', note: '' },
};
