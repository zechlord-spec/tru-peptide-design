import type { PricingMode } from '@/lib/db/schema'
import { roundToAttractive, ceilToAttractive } from './rounding'

export const MARKET_DISCOUNT = 0.8 // retail = market average × 0.80 (20% below)
export const TARGET_BELOW_MARKET = 0.2 // must be at least 20% below market avg

// --- Pricing protection ---
// Retail must never fall below wholesale × 2.5. Because margin% = (retail −
// wholesale) / retail, a 2.5× multiple is exactly a 60% gross margin, so this
// single constant enforces both the hard floor and the 60%-margin policy.
export const MIN_MARGIN_MULTIPLE = 2.5
export const MIN_GROSS_MARGIN = 0.6

/** The absolute minimum retail price allowed for a given wholesale cost. */
export function marginFloorPrice(wholesalePerVial: number): number {
  return wholesalePerVial > 0 ? ceilToAttractive(wholesalePerVial * MIN_MARGIN_MULTIPLE) : 0
}

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
  retailPrice: number // FINAL price, with the margin floor enforced
  rawRetailPrice: number // computed price BEFORE the floor was applied
  floorPrice: number // wholesale × 2.5 (rounded up) — the protected minimum
  meetsMarginFloor: boolean // true if rawRetailPrice already had ≥ 60% margin
  floorApplied: boolean // true if the floor had to raise the price
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

  // 1. Compute the raw price from the active mode (no protection yet).
  let rawRetailPrice = 0
  switch (mode) {
    case 'market':
      rawRetailPrice = marketAveragePrice
        ? roundToAttractive(marketAveragePrice * MARKET_DISCOUNT)
        : roundToAttractive(wholesalePerVial * markupMultiplier)
      break
    case 'markup6x':
      rawRetailPrice = roundToAttractive(wholesalePerVial * markupMultiplier)
      break
    case 'manual':
      rawRetailPrice =
        manualPrice && manualPrice > 0
          ? manualPrice
          : marketAveragePrice
            ? roundToAttractive(marketAveragePrice * MARKET_DISCOUNT)
            : roundToAttractive(wholesalePerVial * markupMultiplier)
      break
  }

  // 2. Apply the hard margin floor: retail may never be below wholesale × 2.5.
  const floorPrice = marginFloorPrice(wholesalePerVial)
  const meetsMarginFloor = rawRetailPrice > 0 ? rawRetailPrice >= wholesalePerVial * MIN_MARGIN_MULTIPLE : false
  const floorApplied = floorPrice > 0 && rawRetailPrice < floorPrice
  const retailPrice = floorApplied ? floorPrice : rawRetailPrice

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
    rawRetailPrice,
    floorPrice,
    meetsMarginFloor,
    floorApplied,
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
