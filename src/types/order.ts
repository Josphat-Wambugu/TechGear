import type { CartTotals } from './cart';
import type { ShippingInfo } from './checkout';

export interface OrderLineItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  shipping: ShippingInfo;
  items: OrderLineItem[];
  totals: CartTotals;
}

export interface Customer {
  email: string;
  fullName: string;
  phone: string;
  city: string;
  country: string;
  orderCount: number;
  totalSpent: number;
  firstOrderAt: string;
  lastOrderAt: string;
}
