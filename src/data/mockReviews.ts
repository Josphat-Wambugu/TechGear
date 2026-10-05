import type { Product } from '@/types/product';
import type { ProductReview } from '@/types/review';

// Small deterministic PRNG so each product's reviews are stable across
// reloads (seeded from the product id) instead of re-randomizing on every
// render.
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
}

const FIRST_NAMES = [
  'James', 'Mary', 'Brian', 'Grace', 'Kevin', 'Faith', 'Daniel', 'Alice',
  'Peter', 'Lucy', 'Samuel', 'Joy', 'David', 'Esther', 'Michael', 'Ann',
  'John', 'Beatrice', 'Eric', 'Sarah', 'Victor', 'Diana', 'Mark', 'Winnie',
];
const LAST_INITIALS = 'ABCDEFGHJKLMNPRSTW'.split('');

const POSITIVE_TITLES = ['Exactly what I needed', 'Great value', 'Very happy with this', 'Would buy again', 'Solid pick'];
const MIXED_TITLES = ['Good, with a caveat', 'Does the job', 'Pretty good overall', 'Mostly satisfied'];
const CRITICAL_TITLES = ['It’s okay', 'Average, not great', 'Works, but expected more'];

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function buildBody(rand: () => number, product: Product, tier: 'high' | 'mid' | 'low'): string {
  const specKeys = Object.keys(product.specs);
  const feature = specKeys.length > 0 ? pick(rand, specKeys) : 'build quality';
  const category = product.category.toLowerCase();

  const highTemplates = [
    `Been using this ${category} item for a few weeks and it's held up really well. The ${feature.toLowerCase()} is better than I expected for the price. Would recommend to anyone on the fence.`,
    `${product.brand} nailed this one. Fit and finish feel premium, and it does exactly what the listing says. No complaints so far.`,
    `This replaced an older ${category} product I had and honestly it's a clear upgrade. Setup was painless and it's performed consistently every day.`,
    `Exactly what I needed. Shipping was fast and the product matched the photos and description closely. Already recommended it to a friend.`,
  ];
  const midTemplates = [
    `Does what it's supposed to do. The ${feature.toLowerCase()} could be a bit better but for the price I can't really complain. Packaging was a little basic though.`,
    `Solid product overall. Took a few days to get used to it, but now it's part of my daily routine. Not perfect, but good value.`,
    `Works as expected most of the time. Had a minor hiccup out of the box but it sorted itself out after a reset. Would still recommend.`,
  ];
  const lowTemplates = [
    `It's okay. Does the basic job but nothing about it really stands out compared to other ${category} products I've used.`,
    `Average experience. The ${feature.toLowerCase()} wasn't quite what I expected from the description, but it's usable.`,
  ];

  if (tier === 'high') return pick(rand, highTemplates);
  if (tier === 'mid') return pick(rand, midTemplates);
  return pick(rand, lowTemplates);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/** Deterministic, product-specific review set — stable per product id, no backend required. */
export function getProductReviews(product: Product): ProductReview[] {
  const rand = seededRandom(product.id);
  const count = 3 + Math.floor(rand() * 4); // 3-6 reviews

  const reviews: ProductReview[] = [];
  for (let i = 0; i < count; i++) {
    // Bias ratings toward the product's overall rating so review scores feel
    // consistent with the summary stars shown elsewhere on the page.
    const roll = rand();
    let rating: number;
    let tier: 'high' | 'mid' | 'low';
    if (product.rating >= 4.3) {
      rating = roll < 0.75 ? 5 : roll < 0.93 ? 4 : 3;
    } else if (product.rating >= 3.8) {
      rating = roll < 0.45 ? 5 : roll < 0.85 ? 4 : 3;
    } else {
      rating = roll < 0.25 ? 5 : roll < 0.6 ? 4 : roll < 0.88 ? 3 : 2;
    }
    tier = rating >= 5 ? 'high' : rating >= 4 ? 'high' : rating === 3 ? 'mid' : 'low';

    const title =
      rating >= 5 ? pick(rand, POSITIVE_TITLES) : rating === 4 ? pick(rand, [...POSITIVE_TITLES, ...MIXED_TITLES]) : rating === 3 ? pick(rand, MIXED_TITLES) : pick(rand, CRITICAL_TITLES);

    reviews.push({
      id: `${product.id}-rev-${i}`,
      author: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_INITIALS)}.`,
      rating,
      date: daysAgo(5 + Math.floor(rand() * 240)),
      verified: rand() < 0.82,
      title,
      body: buildBody(rand, product, tier),
      helpfulCount: Math.floor(rand() * 34),
    });
  }

  // Most-helpful first, like most real storefronts default to.
  return reviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
}
