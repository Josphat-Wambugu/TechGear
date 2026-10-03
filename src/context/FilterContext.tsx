import { createContext, useMemo, useState, type ReactNode } from 'react';
import type { ProductCategory, SortOption } from '@/types/product';

interface FilterContextValue {
  category: ProductCategory | 'All';
  setCategory: (c: ProductCategory | 'All') => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  resetFilters: () => void;
}

export const FilterContext = createContext<FilterContextValue | undefined>(undefined);

const DEFAULT_PRICE_RANGE: [number, number] = [0, 2000];

export function FilterProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<ProductCategory | 'All'>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [minRating, setMinRating] = useState(0);

  const resetFilters = () => {
    setCategory('All');
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSearchQuery('');
    setSortBy('featured');
    setMinRating(0);
  };

  const value = useMemo(
    () => ({
      category,
      setCategory,
      priceRange,
      setPriceRange,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      minRating,
      setMinRating,
      resetFilters,
    }),
    [category, priceRange, searchQuery, sortBy, minRating]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
