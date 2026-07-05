import type { PricingMode } from '@/lib/pricing/types'
import type { PricingStrategy } from './types'
import { smartDynamicStrategy } from './smart-dynamic'
import { fixedMarkupStrategy } from './fixed-markup'
import { manualStrategy } from './manual'
import { promotionalStrategy } from './promotional'

/**
 * The strategy registry — the single place the engine looks up a pricing
 * strategy by mode. To add a future strategy (region-specific, membership,
 * volume, time-based, inventory-based, demand-forecasting, competitor-specific)
 * implement the PricingStrategy interface and register it here. Nothing else in
 * the engine, service, or storefront needs to change.
 */
const REGISTRY: Record<PricingMode, PricingStrategy> = {
  market: smartDynamicStrategy,
  markup6x: fixedMarkupStrategy,
  manual: manualStrategy,
  promo: promotionalStrategy,
}

export function getStrategy(mode: PricingMode): PricingStrategy {
  return REGISTRY[mode] ?? smartDynamicStrategy
}

export function listStrategies(): PricingStrategy[] {
  return Object.values(REGISTRY)
}

export type { PricingStrategy, PricingContext, StrategyOutput, MarketData } from './types'
