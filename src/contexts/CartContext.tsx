import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { CART_STORAGE_KEY, cartReducer, loadCart, saveCart } from '@/lib/cart';
import type { CartItem, CartMeta, CartState } from '@/types/cart';

export interface CartContextValue {
  state: CartState;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setMeta: (meta: Partial<CartMeta>) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export function CartProvider({ children }: Props) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const persistTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(() => saveCart(state), 200);
    return () => window.clearTimeout(persistTimer.current);
  }, [state]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CART_STORAGE_KEY) return;
      dispatch({ type: 'HYDRATE', state: loadCart() });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      itemCount: state.items.reduce((n, it) => n + (it.quantity > 0 ? 1 : 0), 0),
      addItem: (item) => dispatch({ type: 'ADD', item }),
      removeItem: (productId) => dispatch({ type: 'REMOVE', productId }),
      updateQuantity: (productId, quantity) =>
        dispatch({ type: 'UPDATE_QTY', productId, quantity }),
      setMeta: (meta) => dispatch({ type: 'SET_META', meta }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
