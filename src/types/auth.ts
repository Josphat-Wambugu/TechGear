export type UserRole = 'admin' | 'customer';

export interface PaymentMethod {
  id: string;
  cardholderName: string;
  brand: 'Visa' | 'Mastercard' | 'Card';
  last4: string;
  expiry: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  paymentMethods: PaymentMethod[];
}

export type PublicUser = Omit<AuthUser, 'password'>;
