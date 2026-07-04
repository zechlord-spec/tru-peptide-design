// Target retail sits 15–20% below the average market price. The exact figure is
// chosen automatically from data quality (Rule 1).
export const TARGET_DISCOUNT_MIN = 0.15
export const TARGET_DISCOUNT_MAX = 0.2

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

/**
 * Pick the discount within [15%, 20%] by data confidence: strong, well-sourced
 * market data earns a deeper (toward 20%) discount; thin or low-confidence data
 * stays conservative (toward 15%). Returns a fraction (0.15..0.20).
 */
export function dynamicDiscount(confidence: number, numberOfSources: number): number {
  const conf = clamp01(confidence)
  const sources = clamp01(numberOfSources / 5) // 5+ sources = full credit
  const quality = clamp01(0.6 * conf + 0.4 * sources)
  return TARGET_DISCOUNT_MIN + (TARGET_DISCOUNT_MAX - TARGET_DISCOUNT_MIN) * quality
}
