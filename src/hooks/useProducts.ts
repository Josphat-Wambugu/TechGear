import { useContext, useMemo } from 'react';
import { FilterContext } from '@/context/FilterContext';
import { filterProducts, sortProducts } from '@/utils/filterUtils';
import type { Product } from '@/types/product';
import { useStoreData } from './useStoreData';

export function useProducts() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useProducts must be used within a FilterProvider');
  const { products: allProducts } = useStoreData();

  const { category, priceRange, searchQuery, sortBy, minRating } = ctx;

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(allProducts, {
      category,
      priceRange,
      searchQuery,
      minRating,
    });
    return sortProducts(filtered, sortBy);
  }, [allProducts, category, priceRange, searchQuery, sortBy, minRating]);

  return { products: filteredProducts, allProducts, ...ctx };
}

export function useProductById(id: string | undefined): Product | undefined {
  const { products } = useStoreData();
  return useMemo(() => products.find((p) => p.id === id), [products, id]);
}

export function useFeaturedProducts(limit: number = 4): Product[] {
  const { products } = useStoreData();
  return useMemo(() => products.filter((p) => p.isFeatured).slice(0, limit), [products, limit]);
}

export function useRelatedProducts(product: Product | undefined, limit: number = 4): Product[] {
  const { products } = useStoreData();
  return useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  }, [products, product, limit]);
}
