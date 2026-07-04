import type { PricingMode } from '@/lib/db/schema'
import { ceilToAttractive } from './rounding'
import { getStrategy } from './strategies'
import type { PricingContext } from './strategies/types'

export { TARGET_DISCOUNT_MIN, TARGET_DISCOUNT_MAX, dynamicDiscount } from './strategies/discount'

// ---------------------------------------------------------------------------
// Smart Dynamic Pricing Engine — the SINGLE source of truth for every price.
// Storefront, cart, checkout, and admin all read prices that originate here.
// ---------------------------------------------------------------------------

/** Rule 3: minimum gross margin on every product. */
export const MIN_GROSS_MARGIN = 0.7
/** Rule 2: never price more than this fraction below the lowest competitor. */
export const MAX_BELOW_LOWEST_COMPETITOR = 0.1
export const DEFAULT_MARKUP = 6

/** Lowest retail price that still yields at least `minMargin` gross margin. */
export function marginFloorPrice(wholesalePerVial: number, minMargin: number = MIN_GROSS_MARGIN): number {
  if (wholesalePerVial <= 0) return 0
  return ceilToAttractive(wholesalePerVial / (1 - minMargin))
}

/** Lowest retail price allowed by the competitor rule (10% below the lowest). */
export function competitorFloorPrice(marketLow: number | null | undefined): number {
  if (!marketLow || marketLow <= 0) return 0
  return ceilToAttractive(marketLow * (1 - MAX_BELOW_LOWEST_COMPETITOR))
}

export type DeriveInputs = {
  supplierBoxPrice: number
  vialsPerBox: number
  marketAveragePrice: number | null
  marketLow: number | null
  numberOfSources: number
  confidence: number
  manualPrice: number | null
  mode: PricingMode
  markupMultiplier: number
  minGrossMargin?: number
  promoGlobalPercentOff?: number
  promoProductPercentOff?: number | null
}

export type DerivedPricing = {
  wholesalePerVial: number
  marketAveragePrice: number | null
  marketLow: number | null
  strategyUsed: string
  dynamicDiscountPct: number | null
  targetPrice: number // what the active strategy wants (pre-floor)
  basePrice: number | null // pre-promo regular price (Promotional mode)
  marginFloor: number // charm-rounded 70%-margin floor
  competitorFloor: number // charm-rounded Rule 2 floor
  hardFloor: number // max(marginFloor, competitorFloor)
  recommendedPrice: number // floor-respecting price = max(target, hardFloor)
  // Whether the strategy's target price already satisfies every hard rule:
  meetsMargin: boolean
  meetsCompetitorFloor: boolean
  negativeProfit: boolean
  targetAchievable: boolean
  // Margin/market figures computed at the recommendedPrice (the safe price):
  grossMargin: number
  marginPct: number
  differenceFromMarket: number | null
  differencePct: number | null
  withinTargetBand: boolean // recommended sits 15–20% below market avg
}

/** Pure math: run the active strategy and evaluate every safety rule. */
export function recalcPricingRow(inputs: DeriveInputs): DerivedPricing {
  const {
    supplierBoxPrice,
    vialsPerBox,
    marketAveragePrice,
    marketLow,
    numberOfSources,
    confidence,
    manualPrice,
    mode,
    markupMultiplier,
    minGrossMargin = MIN_GROSS_MARGIN,
    promoGlobalPercentOff = 0,
    promoProductPercentOff = null,
  } = inputs

  const wholesalePerVial = vialsPerBox > 0 ? supplierBoxPrice / vialsPerBox : 0

  const ctx: PricingContext = {
    wholesalePerVial,
    market: {
      average: marketAveragePrice,
      low: marketLow,
      high: null,
      median: null,
      numberOfSources,
      confidence,
    },
    manualPrice,
    markupMultiplier,
    minGrossMargin,
    promoGlobalPercentOff,
    promoProductPercentOff,
  }

  const out = getStrategy(mode).compute(ctx)
  const target = out.targetPrice

  // Safety floors (Rules 2 & 3).
  const marginFloor = marginFloorPrice(wholesalePerVial, minGrossMargin)
  const competitorFloor = competitorFloorPrice(marketLow)
  const hardFloor = Math.max(marginFloor, competitorFloor)
  const recommendedPrice = Math.max(target, hardFloor)

  // Evaluate the strategy's TARGET against each hard rule (raw thresholds).
  const marginFloorRaw = wholesalePerVial > 0 ? wholesalePerVial / (1 - minGrossMargin) : 0
  const competitorFloorRaw = marketLow && marketLow > 0 ? marketLow * (1 - MAX_BELOW_LOWEST_COMPETITOR) : 0
  const meetsMargin = target >= marginFloorRaw - 0.01
  const meetsCompetitorFloor = !marketLow || marketLow <= 0 ? true : target >= competitorFloorRaw - 0.01
  const negativeProfit = target - wholesalePerVial <= 0
  const targetAchievable = meetsMargin && meetsCompetitorFloor && !negativeProfit

  // Margin/market figures reported at the safe (recommended) price.
  const grossMargin = round2(recommendedPrice - wholesalePerVial)
  const marginPct = recommendedPrice > 0 ? round2((grossMargin / recommendedPrice) * 100) : 0
  const differenceFromMarket =
    marketAveragePrice != null ? round2(recommendedPrice - marketAveragePrice) : null
  const differencePct =
    marketAveragePrice && marketAveragePrice > 0
      ? round2(((recommendedPrice - marketAveragePrice) / marketAveragePrice) * 100)
      : null
  const withinTargetBand =
    marketAveragePrice != null && marketAveragePrice > 0
      ? recommendedPrice <= marketAveragePrice * (1 - TARGET_DISCOUNT_MIN_LOCAL) &&
        recommendedPrice >= marketAveragePrice * (1 - TARGET_DISCOUNT_MAX_LOCAL)
      : false

  return {
    wholesalePerVial: round2(wholesalePerVial),
    marketAveragePrice,
    marketLow: marketLow ?? null,
    strategyUsed: out.strategyUsed,
    dynamicDiscountPct: out.dynamicDiscountPct,
    targetPrice: target,
    basePrice: out.basePrice ?? null,
    marginFloor,
    competitorFloor,
    hardFloor,
    recommendedPrice,
    meetsMargin,
    meetsCompetitorFloor,
    negativeProfit,
    targetAchievable,
    grossMargin,
    marginPct,
    differenceFromMarket,
    differencePct,
    withinTargetBand,
  }
}

// Local copies to avoid a runtime import cycle in the band check above.
const TARGET_DISCOUNT_MIN_LOCAL = 0.15
const TARGET_DISCOUNT_MAX_LOCAL = 0.2

export type PricingDecision = {
  retailPrice: number // price to persist
  priceChanged: boolean // whether retailPrice differs from the strategy intent
  needsReview: boolean
  reviewReason: string | null
  proposedPrice: number | null // the safe price a human could apply
  proposedMarginPct: number | null
  strategyUsed: string
  dynamicDiscountPct: number | null
}

/**
 * Turn pure pricing math into a persistence decision, honoring the safety
 * rules and the chosen precedence (highest floor wins, else flag).
 *
 * - `guarded` (scheduled refresh / post-migration recompute): never auto-move a
 *   price into a floor breach. If the strategy target violates a hard rule, the
 *   current price is KEPT and the product is flagged for manual review.
 * - non-guarded (explicit admin action — mode switch, supplier-cost change):
 *   land on the floor-respecting price immediately and flag when the target
 *   discount could not be achieved.
 */
export function decidePricing(
  d: DerivedPricing,
  mode: PricingMode,
  opts: { guarded: boolean; currentPrice: number },
): PricingDecision {
  const reasons = buildReviewReasons(d)
  const proposedMarginPct =
    d.targetPrice > 0 ? round2(((d.targetPrice - d.wholesalePerVial) / d.targetPrice) * 100) : 0

  // Manual: apply the admin's exact price; flag (informational) if it breaks a rule.
  if (mode === 'manual') {
    return {
      retailPrice: d.targetPrice,
      priceChanged: true,
      needsReview: !d.targetAchievable,
      reviewReason: d.targetAchievable ? null : reasons.join(' '),
      proposedPrice: d.targetAchievable ? null : d.recommendedPrice,
      proposedMarginPct: d.targetAchievable ? null : proposedMarginPct,
      strategyUsed: d.strategyUsed,
      dynamicDiscountPct: d.dynamicDiscountPct,
    }
  }

  // Promotional: clamp the sale price up to the floor; flag if the clamp bit.
  if (mode === 'promo') {
    const clamped = d.targetPrice < d.hardFloor
    return {
      retailPrice: d.recommendedPrice,
      priceChanged: true,
      needsReview: clamped,
      reviewReason: clamped
        ? `Sale price ($${d.targetPrice}) was raised to $${d.recommendedPrice} to protect the ${Math.round(
            MIN_GROSS_MARGIN * 100,
          )}% margin / competitor floor.`
        : null,
      proposedPrice: clamped ? d.targetPrice : null,
      proposedMarginPct: clamped ? proposedMarginPct : null,
      strategyUsed: d.strategyUsed,
      dynamicDiscountPct: d.dynamicDiscountPct,
    }
  }

  // Auto modes (Smart Dynamic, Fixed Markup).
  if (d.targetAchievable) {
    return {
      retailPrice: d.targetPrice,
      priceChanged: true,
      needsReview: false,
      reviewReason: null,
      proposedPrice: null,
      proposedMarginPct: null,
      strategyUsed: d.strategyUsed,
      dynamicDiscountPct: d.dynamicDiscountPct,
    }
  }

  // Target breaches a hard rule.
  if (opts.guarded) {
    // Keep the current price untouched; hand it to a human.
    return {
      retailPrice: opts.currentPrice,
      priceChanged: false,
      needsReview: true,
      reviewReason: reasons.join(' '),
      proposedPrice: d.recommendedPrice,
      proposedMarginPct,
      strategyUsed: d.strategyUsed,
      dynamicDiscountPct: d.dynamicDiscountPct,
    }
  }

  // Explicit admin action: apply the safe floor price, flag the unmet target.
  return {
    retailPrice: d.recommendedPrice,
    priceChanged: d.recommendedPrice !== opts.currentPrice,
    needsReview: true,
    reviewReason: reasons.join(' '),
    proposedPrice: d.recommendedPrice,
    proposedMarginPct,
    strategyUsed: d.strategyUsed,
    dynamicDiscountPct: d.dynamicDiscountPct,
  }
}

function buildReviewReasons(d: DerivedPricing): string[] {
  const reasons: string[] = []
  if (d.negativeProfit) {
    reasons.push(`Target price ($${d.targetPrice}) is at or below wholesale ($${d.wholesalePerVial}).`)
  }
  if (!d.meetsMargin) {
    const pct =
      d.targetPrice > 0 ? Math.round(((d.targetPrice - d.wholesalePerVial) / d.targetPrice) * 100) : 0
    reasons.push(
      `Market target ($${d.targetPrice}) yields only ${pct}% gross margin (minimum ${Math.round(
        MIN_GROSS_MARGIN * 100,
      )}%).`,
    )
  }
  if (!d.meetsCompetitorFloor && d.marketLow) {
    reasons.push(
      `Target ($${d.targetPrice}) is more than ${Math.round(
        MAX_BELOW_LOWEST_COMPETITOR * 100,
      )}% below the lowest competitor ($${d.marketLow}).`,
    )
  }
  if (reasons.length === 0) reasons.push('Flagged for manual review.')
  return reasons
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
