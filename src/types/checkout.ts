export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface CheckoutFormState {
  shipping: ShippingInfo;
  payment: PaymentInfo;
}

export type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

export type FormErrors<T> = Partial<Record<keyof T, string>>;
