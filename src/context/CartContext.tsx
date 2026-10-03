import { createContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { CartItem, CartTotals } from '@/types/cart';
import type { Product } from '@/types/product';

const STORAGE_KEY = 'techgear_cart_v1';
const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 8.99;
const TAX_RATE = 0.08;

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; items: CartItem[] };

interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.items;
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.product.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.product.id === action.product.id
            ? { ...i, quantity: Math.min(i.quantity + action.quantity, action.product.stockCount) }
            : i
        );
      }
      return [...state, { product: action.product, quantity: action.quantity }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.product.id !== action.productId);
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return state.filter((i) => i.product.id !== action.productId);
      }
      return state.map((i) =>
        i.product.id === action.productId
          ? { ...i, quantity: Math.min(action.quantity, i.product.stockCount) }
          : i
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        dispatch({ type: 'HYDRATE', items: parsed });
      }
    } catch {
      // ignore corrupted cache
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totals: CartTotals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total, itemCount };
  }, [items]);

  const addItem = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity });
  };
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const isInCart = (productId: string) => items.some((i) => i.product.id === productId);

  const value: CartContextValue = {
    items,
    totals,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
