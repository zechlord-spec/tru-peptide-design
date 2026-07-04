import { roundToAttractive } from '../rounding'
import type { PricingStrategy, StrategyOutput, PricingContext } from './types'

/** Fixed Markup: retail = wholesale × a configured multiplier (charm-rounded). */
export function computeFixedMarkup(ctx: PricingContext): StrategyOutput {
  const multiplier = ctx.markupMultiplier > 0 ? ctx.markupMultiplier : 6
  return {
    targetPrice: roundToAttractive(ctx.wholesalePerVial * multiplier),
    dynamicDiscountPct: null,
    strategyUsed: `Fixed Markup · ${multiplier}× wholesale`,
  }
}

export const fixedMarkupStrategy: PricingStrategy = {
  mode: 'markup6x',
  label: 'Fixed Markup',
  compute: computeFixedMarkup,
}
