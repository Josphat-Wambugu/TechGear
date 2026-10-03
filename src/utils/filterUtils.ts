import type { Product, ProductCategory, SortOption } from '@/types/product';

export interface FilterCriteria {
  category: ProductCategory | 'All';
  priceRange: [number, number];
  searchQuery: string;
  minRating: number;
}

export function filterProducts(products: Product[], criteria: FilterCriteria): Product[] {
  const { category, priceRange, searchQuery, minRating } = criteria;
  const query = searchQuery.trim().toLowerCase();

  return products.filter((p) => {
    if (category !== 'All' && p.category !== category) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (p.rating < minRating) return false;
    if (query) {
      const haystack = `${p.name} ${p.brand} ${p.category} ${p.tags.join(' ')}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case 'featured':
    default:
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

export function getPriceBounds(products: Product[]): [number, number] {
  if (products.length === 0) return [0, 1000];
  const prices = products.map((p) => p.price);
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
}
