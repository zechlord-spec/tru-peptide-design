import { computeSmartDynamic } from './smart-dynamic'
import type { PricingStrategy, StrategyOutput, PricingContext } from './types'

/**
 * Manual Price: use the admin-entered price exactly (no charm rounding — the
 * admin's number is authoritative). If no manual price is set, fall back to the
 * Smart Dynamic price so the product still has a sensible value.
 */
export function computeManual(ctx: PricingContext): StrategyOutput {
  if (ctx.manualPrice && ctx.manualPrice > 0) {
    return {
      targetPrice: ctx.manualPrice,
      dynamicDiscountPct: null,
      strategyUsed: 'Manual Override',
    }
  }
  const fallback = computeSmartDynamic(ctx)
  return { ...fallback, strategyUsed: 'Manual (unset → Smart Dynamic)' }
}

export const manualStrategy: PricingStrategy = {
  mode: 'manual',
  label: 'Manual Price',
  compute: computeManual,
}
