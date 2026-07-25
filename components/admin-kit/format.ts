// Presentation + derivation helpers shared across the internal admin kit.
//
// These helpers never fabricate data. All monetary and quantity values arrive
// from props (sourced from the app's admin/pricing seams). Derived figures
// (cost-per-vial, gross margin) are pure functions of the props passed in so
// the components stay display-only with no hidden database logic.

import { formatUSD } from '@/lib/pricing/format'

export { formatUSD }

/** Format a ratio (0.32) as a percentage string ("32%"). */
export function formatPct(ratio: number | null | undefined, digits = 0): string {
  if (ratio == null || Number.isNaN(ratio)) return '—'
  return `${(ratio * 100).toFixed(digits)}%`
}

/** Neutral placeholder for any missing numeric value. */
export function orDash(value: number | null | undefined, fmt: (n: number) => string): string {
  return value == null || Number.isNaN(value) ? '—' : fmt(value)
}

/** Cost per vial from a kit cost and the number of vials in a kit. */
export function costPerVial(kitCost: number, vialsPerKit: number): number | null {
  if (!vialsPerKit || vialsPerKit <= 0) return null
  return kitCost / vialsPerKit
}

/** Gross margin ratio: (retail - unitCost) / retail. */
export function grossMargin(retail: number, unitCost: number): number | null {
  if (!retail || retail <= 0) return null
  return (retail - unitCost) / retail
}

/** Gross margin after applying a discount ratio to the retail price. */
export function marginAtDiscount(
  retail: number,
  unitCost: number,
  discount: number,
): number | null {
  const discounted = retail * (1 - discount)
  return grossMargin(discounted, unitCost)
}

/**
 * Qualitative band for a margin ratio, used to pick a status color.
 * Thresholds are display heuristics only.
 */
export function marginBand(margin: number | null): 'positive' | 'caution' | 'negative' | 'neutral' {
  if (margin == null) return 'neutral'
  if (margin >= 0.5) return 'positive'
  if (margin >= 0.3) return 'caution'
  return 'negative'
}
