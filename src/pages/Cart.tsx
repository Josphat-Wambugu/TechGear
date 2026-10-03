import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import CartItemRow from '@/components/ecommerce/CartItemRow';
import OrderSummary from '@/components/ecommerce/OrderSummary';
import Button from '@/components/common/Button';

export default function Cart() {
  const { items, totals, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
          <ShoppingBag size={32} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your cart is empty</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Looks like you haven't added anything yet.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl
            font-medium shadow-sm hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
        >
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/catalog')}
        className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
      >
        <ChevronLeft size={16} /> Continue Shopping
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Your Cart <span className="text-slate-400 dark:text-slate-500 font-normal">({totals.itemCount} items)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-rose-600 transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>

        <div>
          <OrderSummary totals={totals}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/checkout')}
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              Proceed to Checkout
            </Button>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
