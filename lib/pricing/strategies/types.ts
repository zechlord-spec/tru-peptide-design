import type { PricingMode } from '@/lib/pricing/types'

/** Competitor market intelligence for a single variant (per vial, USD). */
export type MarketData = {
  average: number | null
  low: number | null
  high: number | null
  median: number | null
  numberOfSources: number
  confidence: number // 0..1
}

/**
 * Everything a strategy needs to propose a price. Strategies are PURE — they
 * never touch the database and never enforce floors; the engine does that.
 */
export type PricingContext = {
  wholesalePerVial: number
  market: MarketData
  manualPrice: number | null
  markupMultiplier: number
  minGrossMargin: number // e.g. 0.70
  /** Site-wide promotional discount as a fraction (0..1). */
  promoGlobalPercentOff: number
  /** Optional per-product promotional override as a fraction (0..1). */
  promoProductPercentOff: number | null
}

/** A strategy's proposed price, before the engine enforces safety floors. */
export type StrategyOutput = {
  /** Desired price (already psychologically rounded, except Manual). */
  targetPrice: number
  /** The pre-promo "regular" price, when relevant (Promotional mode). */
  basePrice?: number
  /** Chosen discount below market average, in %, when relevant (Smart mode). */
  dynamicDiscountPct: number | null
  /** Human-readable label shown in the admin "Strategy Used" column. */
  strategyUsed: string
}

/**
 * A pricing strategy. New strategies (region, membership, volume, demand, …)
 * can be added by implementing this interface and registering it — no changes
 * to the engine, service, or callers are required.
 */
export type PricingStrategy = {
  mode: PricingMode
  label: string
  compute: (ctx: PricingContext) => StrategyOutput
}
