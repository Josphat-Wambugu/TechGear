import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showValue?: boolean;
}

export default function RatingStars({
  rating,
  reviewCount,
  size = 14,
  showValue = false,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <Star
              key={star}
              size={size}
              className={filled ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
            />
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="text-sm text-slate-500 dark:text-slate-400">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
