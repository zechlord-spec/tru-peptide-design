import type { Product } from '@/lib/products-data'

// Map of catalog number -> per-vial retail price (USD). Safe to pass to the client.
export type RetailSnapshot = Record<string, number>

export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function retailUnitFrom(snapshot: RetailSnapshot, catNo: string): number {
  return snapshot[catNo] ?? 0
}

export function retailRangeFrom(snapshot: RetailSnapshot, product: Product): string {
  const prices = product.variants.map((v) => snapshot[v.catNo] ?? 0).filter((p) => p > 0)
  if (prices.length === 0) return '—'
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? formatUSD(min) : `${formatUSD(min)} – ${formatUSD(max)}`
}

// Cheapest priced variant for a product ("Starting at" price + Add to Cart target).
export function retailStartingFrom(
  snapshot: RetailSnapshot,
  product: Product,
): { catNo: string; spec: string; price: number } | null {
  let best: { catNo: string; spec: string; price: number } | null = null
  for (const v of product.variants) {
    const price = snapshot[v.catNo] ?? 0
    if (price > 0 && (best === null || price < best.price)) {
      best = { catNo: v.catNo, spec: v.spec, price }
    }
  }
  return best
}
