import { emptyCart, type CartItem, type CartMeta, type CartState } from '@/types/cart';

export type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'SET_META'; meta: Partial<CartMeta> }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: CartState };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((it) => it.productId === action.item.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((it) =>
            it.productId === action.item.productId
              ? { ...it, quantity: it.quantity + action.item.quantity }
              : it,
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((it) => it.productId !== action.productId) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((it) =>
          it.productId === action.productId ? { ...it, quantity: action.quantity } : it,
        ),
      };
    case 'SET_META':
      return { ...state, meta: { ...state.meta, ...action.meta } };
    case 'CLEAR':
      return emptyCart;
    case 'HYDRATE':
      return action.state;
  }
}

const STORAGE_KEY = 'frangc.cart.v1';

export function loadCart(): CartState {
  if (typeof window === 'undefined') return emptyCart;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCart;
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) return emptyCart;
    return {
      items: parsed.items,
      meta: { ...emptyCart.meta, ...(parsed.meta ?? {}) },
    };
  } catch {
    return emptyCart;
  }
}

export function saveCart(state: CartState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded / private mode — silently ignore
  }
}

export const CART_STORAGE_KEY = STORAGE_KEY;
