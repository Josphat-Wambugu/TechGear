import { useContext, useMemo } from 'react';
import { FilterContext } from '@/context/FilterContext';
import { mockProducts } from '@/data/mockProducts';
import { filterProducts, sortProducts } from '@/utils/filterUtils';
import type { Product } from '@/types/product';

export function useProducts() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useProducts must be used within a FilterProvider');

  const { category, priceRange, searchQuery, sortBy, minRating } = ctx;

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(mockProducts, {
      category,
      priceRange,
      searchQuery,
      minRating,
    });
    return sortProducts(filtered, sortBy);
  }, [category, priceRange, searchQuery, sortBy, minRating]);

  return { products: filteredProducts, allProducts: mockProducts, ...ctx };
}

export function useProductById(id: string | undefined): Product | undefined {
  return useMemo(() => mockProducts.find((p) => p.id === id), [id]);
}

export function useFeaturedProducts(limit: number = 4): Product[] {
  return useMemo(() => mockProducts.filter((p) => p.isFeatured).slice(0, limit), [limit]);
}

export function useRelatedProducts(product: Product | undefined, limit: number = 4): Product[] {
  return useMemo(() => {
    if (!product) return [];
    return mockProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  }, [product, limit]);
}
