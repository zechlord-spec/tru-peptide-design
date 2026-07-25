// Presentation helpers shared across the storefront kit.
//
// These components never fabricate prices: callers pass numbers in as props
// (sourced from the app's pricing seam / backend). When a price is unavailable
// we render a neutral placeholder instead of a fake value.

import { formatUSD } from '@/lib/pricing/format'

export { formatUSD }

/**
 * Format a per-vial price as "$XX / vial". Returns the neutral placeholder when
 * no price is available so unpriced items degrade gracefully.
 */
export function perVial(price: number | null | undefined): string {
  if (price == null || price <= 0) return 'Pricing soon'
  return `${formatUSD(price)} / vial`
}

/** True when a numeric price prop represents a real, displayable price. */
export function hasPrice(price: number | null | undefined): price is number {
  return price != null && price > 0
}
