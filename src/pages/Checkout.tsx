import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronDown, Lock, Truck, CreditCard, ClipboardCheck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useStoreData } from '@/hooks/useStoreData';
import { formatCurrency } from '@/utils/formatCurrency';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import OrderSummary from '@/components/ecommerce/OrderSummary';
import type { CheckoutStep, FormErrors, PaymentInfo, ShippingInfo } from '@/types/checkout';

const steps: { key: CheckoutStep; label: string; icon: typeof Truck }[] = [
  { key: 'shipping', label: 'Shipping', icon: Truck },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'review', label: 'Review', icon: ClipboardCheck },
];

const initialShipping: ShippingInfo = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
};

const initialPayment: PaymentInfo = {
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

function validateShipping(data: ShippingInfo): FormErrors<ShippingInfo> {
  const errors: FormErrors<ShippingInfo> = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Enter a valid email';
  if (!data.phone.trim()) errors.phone = 'Phone number is required';
  if (!data.address.trim()) errors.address = 'Address is required';
  if (!data.city.trim()) errors.city = 'City is required';
  if (!data.postalCode.trim()) errors.postalCode = 'Postal code is required';
  if (!data.country.trim()) errors.country = 'Country is required';
  return errors;
}

function validatePayment(data: PaymentInfo): FormErrors<PaymentInfo> {
  const errors: FormErrors<PaymentInfo> = {};
  if (!data.cardName.trim()) errors.cardName = 'Name on card is required';
  const digits = data.cardNumber.replace(/\s/g, '');
  if (!digits) errors.cardNumber = 'Card number is required';
  else if (!/^\d{16}$/.test(digits)) errors.cardNumber = 'Enter a valid 16-digit card number';
  if (!data.expiry.trim()) errors.expiry = 'Expiry is required';
  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry)) errors.expiry = 'Use MM/YY format';
  if (!data.cvv.trim()) errors.cvv = 'CVV is required';
  else if (!/^\d{3,4}$/.test(data.cvv)) errors.cvv = 'Enter a valid CVV';
  return errors;
}

export default function Checkout() {
  const { items, totals, clearCart } = useCart();
  const { addOrder } = useStoreData();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shipping, setShipping] = useState<ShippingInfo>(initialShipping);
  const [payment, setPayment] = useState<PaymentInfo>(initialPayment);
  const [shippingErrors, setShippingErrors] = useState<FormErrors<ShippingInfo>>({});
  const [paymentErrors, setPaymentErrors] = useState<FormErrors<PaymentInfo>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  if (items.length === 0 && !showConfirmation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nothing to checkout</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Your cart is empty. Add some products first.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl
            font-medium shadow-sm hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const handleShippingSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors = validateShipping(shipping);
    setShippingErrors(errors);
    if (Object.keys(errors).length === 0) setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors = validatePayment(payment);
    setPaymentErrors(errors);
    if (Object.keys(errors).length === 0) setCurrentStep('review');
  };

  const handlePlaceOrder = () => {
    const generated = `TG-${Math.floor(100000 + Math.random() * 900000)}`;
    addOrder({
      orderNumber: generated,
      shipping,
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity,
      })),
      totals,
    });
    setOrderNumber(generated);
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    clearCart();
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center mb-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentIndex;
          const isDone = idx < currentIndex;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${
                      isDone
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : isActive
                        ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-900'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900'
                    }`}
                >
                  {isDone ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                </div>
                <span
                  className={`text-xs font-medium ${isActive || isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${isDone ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile-only collapsible summary so the running total stays visible while filling the form */}
      <div className="lg:hidden mb-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setMobileSummaryOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3"
          aria-expanded={mobileSummaryOpen}
        >
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {mobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">{formatCurrency(totals.total)}</span>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${mobileSummaryOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
        {mobileSummaryOpen && (
          <div className="px-4 pb-4 -mt-1 border-t border-slate-100 dark:border-slate-800 pt-3">
            <OrderSummary totals={totals} showFreeShippingHint={false} />
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 'shipping' && (
            <form
              onSubmit={handleShippingSubmit}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Jane Doe"
                  value={shipping.fullName}
                  error={shippingErrors.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="jane@example.com"
                  value={shipping.email}
                  error={shippingErrors.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                />
              </div>
              <Input
                label="Phone Number"
                placeholder="+254 700 000000"
                value={shipping.phone}
                error={shippingErrors.phone}
                onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
              />
              <Input
                label="Street Address"
                placeholder="123 Main Street"
                value={shipping.address}
                error={shippingErrors.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              />
              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  placeholder="Nairobi"
                  value={shipping.city}
                  error={shippingErrors.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                />
                <Input
                  label="Postal Code"
                  placeholder="00100"
                  value={shipping.postalCode}
                  error={shippingErrors.postalCode}
                  onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                />
                <Input
                  label="Country"
                  placeholder="Kenya"
                  value={shipping.country}
                  error={shippingErrors.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                />
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth className="mt-2">
                Continue to Payment
              </Button>
            </form>
          )}

          {currentStep === 'payment' && (
            <form
              onSubmit={handlePaymentSubmit}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Lock size={16} className="text-indigo-600" /> Payment Details
              </h2>
              <Input
                label="Name on Card"
                placeholder="Jane Doe"
                value={payment.cardName}
                error={paymentErrors.cardName}
                onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
              />
              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={payment.cardNumber}
                error={paymentErrors.cardNumber}
                onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                maxLength={19}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Expiry (MM/YY)"
                  placeholder="08/28"
                  value={payment.expiry}
                  error={paymentErrors.expiry}
                  onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                  maxLength={5}
                />
                <Input
                  label="CVV"
                  placeholder="123"
                  value={payment.cvv}
                  error={paymentErrors.cvv}
                  onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                  maxLength={4}
                  type="password"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentStep('shipping')}
                >
                  Back
                </Button>
                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Review Order
                </Button>
              </div>
            </form>
          )}

          {currentStep === 'review' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Review Your Order</h2>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Shipping to</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {shipping.fullName}
                  <br />
                  {shipping.address}, {shipping.city} {shipping.postalCode}
                  <br />
                  {shipping.country}
                  <br />
                  {shipping.email} · {shipping.phone}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Payment</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Card ending in {payment.cardNumber.replace(/\s/g, '').slice(-4)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Items ({items.length})</h3>
                <div className="space-y-2">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        {product.name} × {quantity}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {formatCurrency(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setCurrentStep('payment')}>
                  Back
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={handlePlaceOrder}>
                  Place Order · {formatCurrency(totals.total)}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <OrderSummary totals={totals} showFreeShippingHint={false} />
        </div>
      </div>

      <Modal isOpen={showConfirmation} onClose={handleConfirmationClose} size="sm">
        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Order Confirmed!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Thank you, {shipping.fullName.split(' ')[0] || 'there'}. Your order has been placed.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">Order Number</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{orderNumber}</p>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            A confirmation email has been sent to {shipping.email}.
          </p>
          <Button variant="primary" fullWidth size="lg" className="mt-6" onClick={handleConfirmationClose}>
            Continue Shopping
          </Button>
        </div>
      </Modal>
    </div>
  );
}
