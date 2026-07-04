import type { PricingMode } from '@/lib/db/schema'
import { roundToAttractive } from './rounding'

export const MARKET_DISCOUNT = 0.8 // retail = market average × 0.80 (20% below)
export const TARGET_BELOW_MARKET = 0.2 // must be at least 20% below market avg

export type DeriveInputs = {
  supplierBoxPrice: number
  vialsPerBox: number
  marketAveragePrice: number | null
  manualPrice: number | null
  mode: PricingMode
  markupMultiplier: number
}

export type DerivedPricing = {
  wholesalePerVial: number
  marketAveragePrice: number | null
  retailPrice: number
  differenceFromMarket: number | null // retail - market (negative = below market)
  differencePct: number | null // (retail - market) / market
  grossMargin: number // retail - wholesale
  marginPct: number // grossMargin / retail
  belowTarget: boolean // true when NOT at least 20% below market
}

/**
 * THE single source of truth for every derived pricing figure. Every write path
 * (AI refresh, cron, supplier-cost edit, mode switch, manual-price edit, seed)
 * calls this so all fields always stay mutually consistent.
 */
export function recalcPricingRow(inputs: DeriveInputs): DerivedPricing {
  const { supplierBoxPrice, vialsPerBox, marketAveragePrice, manualPrice, mode, markupMultiplier } =
    inputs

  const wholesalePerVial = vialsPerBox > 0 ? supplierBoxPrice / vialsPerBox : 0

  let retailPrice = 0
  switch (mode) {
    case 'market':
      retailPrice = marketAveragePrice
        ? roundToAttractive(marketAveragePrice * MARKET_DISCOUNT)
        : roundToAttractive(wholesalePerVial * markupMultiplier)
      break
    case 'markup6x':
      retailPrice = roundToAttractive(wholesalePerVial * markupMultiplier)
      break
    case 'manual':
      retailPrice =
        manualPrice && manualPrice > 0
          ? manualPrice
          : marketAveragePrice
            ? roundToAttractive(marketAveragePrice * MARKET_DISCOUNT)
            : roundToAttractive(wholesalePerVial * markupMultiplier)
      break
  }

  const differenceFromMarket =
    marketAveragePrice != null ? round2(retailPrice - marketAveragePrice) : null
  const differencePct =
    marketAveragePrice && marketAveragePrice > 0
      ? (retailPrice - marketAveragePrice) / marketAveragePrice
      : null
  const grossMargin = round2(retailPrice - wholesalePerVial)
  const marginPct = retailPrice > 0 ? grossMargin / retailPrice : 0

  // At least 20% below market means retail <= market × 0.80.
  const belowTarget =
    marketAveragePrice != null && marketAveragePrice > 0
      ? retailPrice > marketAveragePrice * (1 - TARGET_BELOW_MARKET)
      : false

  return {
    wholesalePerVial: round2(wholesalePerVial),
    marketAveragePrice,
    retailPrice,
    differenceFromMarket,
    differencePct,
    grossMargin,
    marginPct,
    belowTarget,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
