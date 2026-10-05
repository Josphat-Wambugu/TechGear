/** Stock count at or below this shows an urgency badge instead of a plain "In Stock" one. */
export const LOW_STOCK_THRESHOLD = 5;

export function isLowStock(inStock: boolean, stockCount: number): boolean {
  return inStock && stockCount > 0 && stockCount <= LOW_STOCK_THRESHOLD;
}
