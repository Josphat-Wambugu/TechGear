export type ProductCategory =
  | 'Audio'
  | 'Laptops'
  | 'Wearables'
  | 'Accessories'
  | 'Monitors'
  | 'Cameras';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  tags: string[];
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';
