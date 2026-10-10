import { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { FilterContext } from '@/context/FilterContext';
import { useProducts } from '@/hooks/useProducts';
import ProductFilterSidebar from '@/components/ecommerce/ProductFilterSidebar';
import ProductGrid from '@/components/ecommerce/ProductGrid';
import PageContainer from '@/components/layout/PageContainer';
import type { ProductCategory, SortOption } from '@/types/product';
import { useState } from 'react';

const sortLabels: Record<SortOption, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'rating-desc': 'Highest Rated',
  newest: 'Newest',
};

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const ctx = useContext(FilterContext);
  const { products, sortBy, setSortBy } = useProducts();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (!ctx) return;
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (categoryParam) ctx.setCategory(categoryParam as ProductCategory | 'All');
    if (searchParam !== null) ctx.setSearchQuery(searchParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <PageContainer className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {ctx?.category && ctx.category !== 'All' ? ctx.category : 'All Products'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{products.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block">
          <ProductFilterSidebar />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-5 gap-3">
            <button
              onClick={() => setShowMobileFilters((v) => !v)}
              className="lg:hidden flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-slate-100/70 dark:bg-slate-800 border border-transparent rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 focus:bg-white dark:focus:bg-slate-800
                  transition-all duration-200"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showMobileFilters && (
            <div className="lg:hidden mb-5">
              <ProductFilterSidebar />
            </div>
          )}

          <ProductGrid products={products} />
        </div>
      </div>
    </PageContainer>
  );
}
