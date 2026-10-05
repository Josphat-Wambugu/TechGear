import { useMemo, useState } from 'react';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';
import type { Product } from '@/types/product';
import { getProductReviews } from '@/data/mockReviews';

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ProductReviews({ product }: { product: Product }) {
  const reviews = useMemo(() => getProductReviews(product), [product]);
  const [helpfulClicks, setHelpfulClicks] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(3);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const r of reviews) counts[r.rating - 1]++;
    return counts;
  }, [reviews]);

  const markHelpful = (id: string) => {
    setHelpfulClicks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="mt-16" id="reviews">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Customer Reviews</h2>

      <div className="grid sm:grid-cols-[auto_1fr] gap-8 mb-8">
        <div className="flex flex-col items-center justify-center sm:items-start text-center sm:text-left">
          <span className="text-4xl font-bold text-slate-900 dark:text-white">{product.rating.toFixed(1)}</span>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
              />
            ))}
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Based on {product.reviewCount.toLocaleString()} ratings
          </span>
        </div>

        <div className="space-y-1.5 w-full max-w-sm">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star - 1];
            const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-8 flex-shrink-0">{star} star</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 flex-shrink-0 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-5">
        {reviews.slice(0, visibleCount).map((review) => (
          <div key={review.id} className="border-b border-slate-100 dark:border-slate-800 pb-5 last:border-0">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials(review.author)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck size={12} /> Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(review.date)}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-2">{review.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-1">{review.body}</p>
                <button
                  onClick={() => markHelpful(review.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium mt-2.5 transition-colors ${
                    helpfulClicks[review.id]
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <ThumbsUp size={13} className={helpfulClicks[review.id] ? 'fill-indigo-600 dark:fill-indigo-400' : ''} />
                  Helpful ({review.helpfulCount + (helpfulClicks[review.id] ? 1 : 0)})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < reviews.length && (
        <button
          onClick={() => setVisibleCount((v) => v + 3)}
          className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
        >
          Show more reviews
        </button>
      )}
    </section>
  );
}
