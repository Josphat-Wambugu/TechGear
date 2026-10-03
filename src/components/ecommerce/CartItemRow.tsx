import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/types/cart';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCart } from '@/hooks/useCart';

export default function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  return (
    <div className="flex gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 shadow-sm">
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <Link
            to={`/product/${product.id}`}
            className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{product.brand}</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{formatCurrency(product.price)} each</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
            <button
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm w-8 text-center font-medium">{quantity}</span>
            <button
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-30"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stockCount}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <span className="text-sm font-bold text-slate-900 dark:text-white w-20 text-right">
            {formatCurrency(lineTotal)}
          </span>

          <button
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 transition-colors"
            onClick={() => removeItem(product.id)}
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
