import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Check, ChevronLeft, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { useProductById, useRelatedProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatCurrency';
import RatingStars from '@/components/common/RatingStars';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import ProductGrid from '@/components/ecommerce/ProductGrid';
import ProductReviews from '@/components/ecommerce/ProductReviews';
import ProductFaq from '@/components/ecommerce/ProductFaq';
import { isLowStock } from '@/utils/stock';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = useProductById(id);
  const related = useRelatedProducts(product, 4);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The product you're looking for doesn't exist.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1 mt-6 text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400"
        >
          <ChevronLeft size={16} /> Back to catalog
        </Link>
      </div>
    );
  }

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700 mb-3">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === idx ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.isNew && <Badge variant="indigo">New</Badge>}
            {discountPct > 0 && <Badge variant="rose">-{discountPct}% off</Badge>}
            {!product.inStock ? (
              <Badge variant="slate">Out of Stock</Badge>
            ) : isLowStock(product.inStock, product.stockCount) ? (
              <Badge variant="amber">Only {product.stockCount} left</Badge>
            ) : (
              <Badge variant="emerald">In Stock ({product.stockCount})</Badge>
            )}
          </div>

          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{product.brand}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">{product.name}</h1>

          <div className="mt-3">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} showValue size={16} />
          </div>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 dark:text-slate-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-5">{product.description}</p>

          {/* Quantity + actions */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl">
              <button
                className="p-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                className="p-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-30"
                onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                disabled={quantity >= product.stockCount}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <Button
              variant={justAdded ? 'secondary' : 'primary'}
              size="lg"
              fullWidth
              disabled={!product.inStock}
              onClick={handleAddToCart}
              icon={justAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
            >
              {justAdded ? 'Added to Cart' : 'Add to Cart'}
            </Button>
          </div>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            disabled={!product.inStock}
            onClick={handleBuyNow}
            className="mt-3"
          >
            Buy Now
          </Button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-700">
            <div className="flex flex-col items-center text-center gap-1.5">
              <Truck size={18} className="text-indigo-600" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Free shipping over $75</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <RotateCcw size={18} className="text-indigo-600" />
              <span className="text-xs text-slate-500 dark:text-slate-400">30-day returns</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <ShieldCheck size={18} className="text-indigo-600" />
              <span className="text-xs text-slate-500 dark:text-slate-400">2-year warranty</span>
            </div>
          </div>

          {/* Specs */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Specifications</h3>
            <dl className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl divide-y divide-slate-100 shadow-sm">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between px-4 py-3 text-sm">
                  <dt className="text-slate-500 dark:text-slate-400">{key}</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ProductFaq product={product} />
        </div>
      </div>

      <ProductReviews product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">You might also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
