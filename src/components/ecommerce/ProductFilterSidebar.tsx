import { useContext } from 'react';
import { FilterContext } from '@/context/FilterContext';
import { formatCurrency } from '@/utils/formatCurrency';
import { RotateCcw } from 'lucide-react';
import type { ProductCategory } from '@/types/product';

const categories: (ProductCategory | 'All')[] = [
  'All',
  'Laptops',
  'Audio',
  'Wearables',
  'Monitors',
  'Cameras',
  'Accessories',
];

const ratingOptions = [0, 4, 4.5];

export default function ProductFilterSidebar() {
  const ctx = useContext(FilterContext);
  if (!ctx) return null;

  const { category, setCategory, priceRange, setPriceRange, minRating, setMinRating, resetFilters } = ctx;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Filters</h3>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 shadow-sm">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Category</h4>
        <div className="space-y-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  category === c
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {c === 'All' ? 'All Products' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 shadow-sm">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Price Range</h4>
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span>{formatCurrency(priceRange[0])}</span>
          <span>{formatCurrency(priceRange[1])}</span>
        </div>
        <input
          type="range"
          min={0}
          max={2000}
          step={10}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-600"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 shadow-sm">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Minimum Rating</h4>
        <div className="space-y-1">
          {ratingOptions.map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  minRating === r
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {r === 0 ? 'Any rating' : `${r}+ stars`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
