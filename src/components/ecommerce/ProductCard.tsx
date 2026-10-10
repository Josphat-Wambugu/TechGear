import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/formatCurrency';
import RatingStars from '@/components/common/RatingStars';
import Badge from '@/components/common/Badge';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { isLowStock } from '@/utils/stock';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const alreadyInCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl shadow-sm
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="indigo">New</Badge>}
          {discountPct > 0 && <Badge variant="rose">-{discountPct}%</Badge>}
          {!product.inStock && <Badge variant="slate">Out of Stock</Badge>}
          {isLowStock(product.inStock, product.stockCount) && (
            <Badge variant="amber">Only {product.stockCount} left</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{product.brand}</span>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mt-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={12} />
        </div>

        <div className="flex items-end justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900 dark:text-white">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`p-2.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none
              ${
                justAdded || alreadyInCart
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-brand-50 dark:bg-brand-950 text-brand-600 hover:bg-brand-600 hover:text-white'
              }`}
            aria-label="Add to cart"
          >
            {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </Link>
  );
}
