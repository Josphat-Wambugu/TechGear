import { Link } from 'react-router-dom';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatCurrency';
import { useOverlay } from '@/hooks/useOverlay';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totals, updateQuantity, removeItem } = useCart();
  const panelRef = useOverlay(isOpen, onClose);

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-overlay-backdrop transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={panelRef as React.RefObject<HTMLElement>}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-slate-900 z-overlay-panel shadow-xl
          border-l border-slate-200/80 dark:border-slate-700 flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-600" />
            Your Cart
            {totals.itemCount > 0 && (
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({totals.itemCount})</span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:text-slate-400 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ShoppingBag size={28} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Your cart is empty</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Add some products to get started.</p>
            <Link
              to="/catalog"
              onClick={onClose}
              className="inline-flex items-center justify-center font-medium bg-brand-600 text-white hover:bg-brand-700 shadow-sm text-sm px-4 py-2.5 rounded-xl mt-2 transition-all duration-200 hover:-translate-y-0.5"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 shadow-sm"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{formatCurrency(product.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                        <button
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm w-6 text-center">{quantity}</span>
                        <button
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors disabled:opacity-30"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stockCount}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 transition-colors"
                        onClick={() => removeItem(product.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-700 px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
              <Link
                to="/cart"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center font-medium bg-brand-600 text-white hover:bg-brand-700 shadow-sm text-base px-6 py-3 rounded-xl mt-2 transition-all duration-200 hover:-translate-y-0.5"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
