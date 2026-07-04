import { roundToAttractive } from '../rounding'
import { dynamicDiscount } from './discount'
import type { PricingStrategy, StrategyOutput, PricingContext } from './types'

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

/**
 * Smart Dynamic Pricing (the platform default). Targets 15–20% below the
 * average market price, choosing the exact discount from data confidence. When
 * there is no market data yet, falls back to a wholesale markup so the
 * storefront always has a sensible price. Safety floors are applied by the
 * engine after this runs.
 */
export function computeSmartDynamic(ctx: PricingContext): StrategyOutput {
  const { market, wholesalePerVial, markupMultiplier } = ctx

  if (market.average && market.average > 0) {
    const discount = dynamicDiscount(market.confidence, market.numberOfSources)
    const pct = round1(discount * 100)
    return {
      targetPrice: roundToAttractive(market.average * (1 - discount)),
      dynamicDiscountPct: pct,
      strategyUsed: `Smart Dynamic · ${pct}% below avg`,
    }
  }

  return {
    targetPrice: roundToAttractive(wholesalePerVial * markupMultiplier),
    dynamicDiscountPct: null,
    strategyUsed: 'Smart Dynamic · markup fallback (no market data)',
  }
}

export const smartDynamicStrategy: PricingStrategy = {
  mode: 'market',
  label: 'Smart Dynamic Pricing',
  compute: computeSmartDynamic,
}
