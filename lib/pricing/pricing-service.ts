/**
 * Server-side pricing service.
 *
 * Responsibilities:
 *  1. Compute a `marketAveragePrice` per vial from the market source feed,
 *     excluding clearance / coupon / bulk outliers so only normal retail
 *     pricing is averaged.
 *  2. Derive our retail price: retail = psychRound(marketAveragePrice * 0.80),
 *     pricing every vial ~20% below the current market average and rounding to
 *     psychologically attractive values.
 *  3. Track provenance: numberOfSources, confidenceScore, lastUpdated.
 *
 * The snapshot is computed deterministically at import so it can be shared by
 * server and client code. A scheduled job (see app/api/pricing/refresh) can
 * recompute it for a new crawl epoch.
 */

import type { Product } from '@/lib/products-data'
import { buildMarketFeeds, PRICING_EPOCH, type MarketFeed } from './market-sources'

export type VialPricing = {
  catNo: string
  /** Average normal retail price per vial across sources, in USD. */
  marketAveragePrice: number
  /** Our customer-facing retail price per vial (~20% below market, rounded). */
  retailPrice: number
  /** Count of sources used after excluding non-representative pricing. */
  numberOfSources: number
  /** 0–100 confidence based on source count and price agreement. */
  confidenceScore: number
  /** ISO timestamp of the underlying market capture. */
  lastUpdated: string
}

export const RETAIL_MARKET_FACTOR = 0.8 // 20% below market average

export function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

/**
 * Round a raw price to a psychologically attractive value while staying close
 * to the target. Always rounds down to the nearest attractive value:
 *  - Under $100: nearest value ending in 5 or 9 (47→45, 53→49, 84→79).
 *  - $100+: nearest value ending in 9 (112→109, 136→129, 198→189).
 */
export function psychRound(raw: number): number {
  const x = Math.round(raw)
  if (x < 5) return x
  if (x >= 100) {
    const base = x - (x % 10) + 9
    return base > x ? base - 10 : base
  }
  for (let n = x; n >= 5; n--) {
    if (n % 10 === 5 || n % 10 === 9) return n
  }
  return x
}

/* ------------------------------ statistics ------------------------------ */

function mean(nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0) / nums.length
}

function stdDev(nums: number[], avg: number): number {
  if (nums.length < 2) return 0
  const variance = nums.reduce((s, n) => s + (n - avg) ** 2, 0) / (nums.length - 1)
  return Math.sqrt(variance)
}

/**
 * Drop obvious clearance / coupon / bulk outliers. Sources explicitly flagged
 * are removed first; remaining values beyond 1.5 * IQR are also discarded so we
 * only average normal retail pricing.
 */
function keepNormalRetail(prices: number[]): number[] {
  if (prices.length < 4) return prices
  const sorted = [...prices].sort((a, b) => a - b)
  const q = (p: number) => {
    const idx = (sorted.length - 1) * p
    const lo = Math.floor(idx)
    const hi = Math.ceil(idx)
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
  }
  const q1 = q(0.25)
  const q3 = q(0.75)
  const iqr = q3 - q1
  const lower = q1 - 1.5 * iqr
  const upper = q3 + 1.5 * iqr
  const kept = sorted.filter((n) => n >= lower && n <= upper)
  return kept.length >= 3 ? kept : sorted
}

/** Compute pricing for a single SKU from its market feed. */
export function priceFromFeed(feed: MarketFeed): VialPricing {
  const representative = feed.quotes.filter((q) => !q.excluded).map((q) => q.pricePerVial)
  const kept = keepNormalRetail(representative)

  const avg = mean(kept)
  const marketAveragePrice = Math.round(avg * 100) / 100
  const retailPrice = psychRound(marketAveragePrice * RETAIL_MARKET_FACTOR)

  const cv = avg > 0 ? stdDev(kept, avg) / avg : 1
  const sampleWeight = Math.min(kept.length, 6) / 6
  const agreement = 1 - Math.min(cv, 0.5) / 0.5
  const confidenceScore = Math.round((0.35 + 0.65 * sampleWeight) * (0.4 + 0.6 * agreement) * 100)

  return {
    catNo: feed.catNo,
    marketAveragePrice,
    retailPrice,
    numberOfSources: kept.length,
    confidenceScore: Math.max(0, Math.min(100, confidenceScore)),
    lastUpdated: feed.capturedAt,
  }
}

/** Build the full pricing snapshot keyed by catalog number. */
export function buildPricingSnapshot(epoch: number = PRICING_EPOCH): Record<string, VialPricing> {
  const snapshot: Record<string, VialPricing> = {}
  for (const feed of buildMarketFeeds(epoch)) {
    snapshot[feed.catNo] = priceFromFeed(feed)
  }
  return snapshot
}

/** Current committed pricing snapshot (read path for the app). */
export const PRICING: Record<string, VialPricing> = buildPricingSnapshot()

export function getVialPricing(catNo: string): VialPricing | undefined {
  return PRICING[catNo]
}

/** Customer-facing retail price per vial. */
export function retailUnit(catNo: string): number {
  return PRICING[catNo]?.retailPrice ?? 0
}

/** Cheapest per-vial retail price across a product's variants. */
export function cheapestRetail(p: Product): number {
  return Math.min(...p.variants.map((v) => retailUnit(v.catNo)))
}

/** Customer-facing retail price range across a product's variants. */
export function retailRange(p: Product): string {
  const prices = p.variants.map((v) => retailUnit(v.catNo))
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? formatUSD(min) : `${formatUSD(min)} \u2013 ${formatUSD(max)}`
}
