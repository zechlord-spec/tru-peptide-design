// Deterministic, seeded product metrics (rating, review count, best-seller).
// Same approach used elsewhere in the app for stock/orders: values are stable
// across renders and deploys because they are derived purely from the slug.

export type ProductMetrics = {
  rating: number // 4.3 - 5.0, one decimal
  reviewCount: number // ~24 - 640
  bestSeller: boolean
}

// Small, fast string hash (FNV-1a style) -> unsigned 32-bit int.
function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Independent pseudo-random values per slug by salting the hash.
function seeded(slug: string, salt: string): number {
  return hashString(`${slug}:${salt}`) / 0xffffffff // 0..1
}

export function getProductMetrics(slug: string): ProductMetrics {
  const r = seeded(slug, 'rating')
  const rating = Math.round((4.3 + r * 0.7) * 10) / 10 // 4.3 - 5.0

  const c = seeded(slug, 'reviews')
  // Skew toward mid-range counts, allow some high-review flagship products.
  const reviewCount = Math.round(24 + Math.pow(c, 1.6) * 616)

  // Best sellers: strong rating AND healthy review volume, deterministic.
  const popularity = rating / 5 + Math.min(reviewCount, 500) / 500
  const bestSeller = popularity + seeded(slug, 'seller') * 0.4 > 1.62

  return { rating, reviewCount, bestSeller }
}

// Numeric popularity score used as a ranking signal (higher = more popular).
export function popularityScore(slug: string): number {
  const m = getProductMetrics(slug)
  return m.rating * 100 + Math.min(m.reviewCount, 800)
}
