import { roundToAttractive } from '../rounding'
import { computeSmartDynamic } from './smart-dynamic'
import type { PricingStrategy, StrategyOutput, PricingContext } from './types'

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

/**
 * Promotional Sale Pricing: takes the regular Smart Dynamic price as its base
 * and applies a sale discount — a per-product override if present, otherwise
 * the site-wide sale percentage. The engine still clamps the result to the
 * margin / competitor floors so a sale can never make a product unprofitable.
 */
export function computePromotional(ctx: PricingContext): StrategyOutput {
  const base = computeSmartDynamic(ctx)
  const off = ctx.promoProductPercentOff != null ? ctx.promoProductPercentOff : ctx.promoGlobalPercentOff
  const pct = Math.max(0, Math.min(0.9, off)) // guardrail: never claim > 90% off
  const salePrice = roundToAttractive(base.targetPrice * (1 - pct))
  const label =
    ctx.promoProductPercentOff != null
      ? `Promotional · ${round1(pct * 100)}% off (product)`
      : `Promotional · ${round1(pct * 100)}% off (site-wide)`
  return {
    targetPrice: salePrice,
    basePrice: base.targetPrice,
    dynamicDiscountPct: base.dynamicDiscountPct,
    strategyUsed: label,
  }
}

export const promotionalStrategy: PricingStrategy = {
  mode: 'promo',
  label: 'Promotional Sale',
  compute: computePromotional,
}
