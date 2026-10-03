import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@/types/product';
import type { Order, Customer } from '@/types/order';
import { mockProducts } from '@/data/mockProducts';

const PRODUCTS_KEY = 'techgear_admin_products_v1';
const ORDERS_KEY = 'techgear_admin_orders_v1';

export type NewProductInput = Omit<Product, 'id' | 'rating' | 'reviewCount'> & {
  rating?: number;
  reviewCount?: number;
};

interface StoreDataContextValue {
  products: Product[];
  addProduct: (input: NewProductInput) => Product;
  removeProduct: (id: string) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  customers: Customer[];
}

export const StoreDataContext = createContext<StoreDataContextValue | undefined>(undefined);

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted cache
  }
  return mockProducts;
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted cache
  }
  return [];
}

export function StoreDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const addProduct = (input: NewProductInput): Product => {
    const id = `p-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
    const product: Product = {
      ...input,
      id,
      rating: input.rating ?? 0,
      reviewCount: input.reviewCount ?? 0,
    };
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const newOrder: Order = {
      ...order,
      id: `o-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const customers: Customer[] = useMemo(() => {
    const byEmail = new Map<string, Customer>();
    // Oldest first so firstOrderAt/lastOrderAt accumulate correctly
    const chronological = [...orders].reverse();
    for (const order of chronological) {
      const email = order.shipping.email.trim().toLowerCase();
      if (!email) continue;
      const existing = byEmail.get(email);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.totals.total;
        existing.lastOrderAt = order.createdAt;
        existing.fullName = order.shipping.fullName || existing.fullName;
        existing.phone = order.shipping.phone || existing.phone;
        existing.city = order.shipping.city || existing.city;
        existing.country = order.shipping.country || existing.country;
      } else {
        byEmail.set(email, {
          email,
          fullName: order.shipping.fullName,
          phone: order.shipping.phone,
          city: order.shipping.city,
          country: order.shipping.country,
          orderCount: 1,
          totalSpent: order.totals.total,
          firstOrderAt: order.createdAt,
          lastOrderAt: order.createdAt,
        });
      }
    }
    return Array.from(byEmail.values()).sort(
      (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
    );
  }, [orders]);

  const value: StoreDataContextValue = {
    products,
    addProduct,
    removeProduct,
    orders,
    addOrder,
    updateOrderStatus,
    customers,
  };

  return <StoreDataContext.Provider value={value}>{children}</StoreDataContext.Provider>;
}
