import type { ElementType, ReactNode } from 'react';

const MAX_WIDTH_CLASS = {
  '3xl': 'max-w-3xl',
  '5xl': 'max-w-5xl',
  '7xl': 'max-w-7xl',
} as const;

type MaxWidth = keyof typeof MAX_WIDTH_CLASS;

/**
 * Shared horizontal-centering/padding wrapper. The literal utility string
 * `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` used to be copy-pasted into every
 * page (Home, Catalog, ProductDetail, Cart, Checkout) and the Footer — a
 * single layout tweak (say, a new max-width) meant editing each file by hand.
 * `as` lets a caller render it as the `<section>` itself when there's no
 * separate background wrapper to keep, rather than always nesting a `<div>`.
 */
export default function PageContainer({
  children,
  as: Tag = 'div',
  maxWidth = '7xl',
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  maxWidth?: MaxWidth;
  className?: string;
}) {
  return <Tag className={`${MAX_WIDTH_CLASS[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</Tag>;
}
