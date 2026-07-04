/**
 * Market source feed for the pricing service.
 *
 * In production this module is the integration point for a real crawler that
 * collects current US retail prices for each research peptide from established
 * vendors and clinics on a scheduled basis. Each SKU accumulates several
 * independent per-vial quotes; the pricing service then averages them (after
 * discarding obvious clearance / coupon / bulk outliers) into a
 * `marketAveragePrice`.
 *
 * For this environment the feed is generated deterministically from a seeded
 * market model so numbers are stable between renders and refreshes. Swapping in
 * live crawled data only requires replacing `buildMarketFeeds` with real fetches
 * that return the same `MarketFeed[]` shape.
 */

import { PRODUCTS, vialsPerBox, wholesalePerVial } from '@/lib/products-data'

export type SourceKind = 'vendor' | 'clinic' | 'marketplace'

export type MarketQuote = {
  source: string
  kind: SourceKind
  /** Normal retail price for a single vial, in USD. */
  pricePerVial: number
  /** Flagged non-representative pricing (clearance / coupon / bulk) — excluded from the average. */
  excluded?: boolean
}

export type MarketFeed = {
  catNo: string
  /** ISO timestamp of when these quotes were captured. */
  capturedAt: string
  quotes: MarketQuote[]
}

/** Baseline crawl epoch (YYYYMMDD). Bumping this simulates a fresh scheduled crawl. */
export const PRICING_EPOCH = 20260701

const SOURCE_POOL: { name: string; kind: SourceKind }[] = [
  { name: 'Aegis Research Chem', kind: 'vendor' },
  { name: 'Helix Peptide Labs', kind: 'vendor' },
  { name: 'Nautilus Biosciences', kind: 'vendor' },
  { name: 'Meridian Compounds', kind: 'vendor' },
  { name: 'Cascade Research Supply', kind: 'vendor' },
  { name: 'Vantage Peptides', kind: 'marketplace' },
  { name: 'Longevity Clinic Network', kind: 'clinic' },
  { name: 'Apex Wellness Rx', kind: 'clinic' },
  { name: 'NorthStar Compounding', kind: 'clinic' },
  { name: 'Elemental Bio Market', kind: 'marketplace' },
]

/* ------------------------- deterministic helpers ------------------------- */

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Estimated center of the current retail market for a single vial.
 *
 * This is the placeholder market model for the environment. Real research peptide
 * vials retail far above gray-market wholesale, so we anchor to the internal
 * wholesale-per-vial cost scaled by a per-SKU market multiple (~5.4x–7.2x). A live
 * deployment replaces this with the mean of actual crawled vendor/clinic prices.
 */
function marketCenter(catNo: string, wholesale: number): number {
  const r = mulberry32(hash(catNo))
  const multiple = 5.4 + r() * 1.8
  return wholesale * multiple
}

/** Build the market feed for every SKU for a given crawl epoch. */
export function buildMarketFeeds(epoch: number = PRICING_EPOCH): MarketFeed[] {
  const capturedAt = epochToDate(epoch).toISOString()

  return PRODUCTS.flatMap((p) =>
    p.variants.map((v) => {
      const wholesale = wholesalePerVial(v)
      const center = marketCenter(v.catNo, wholesale)
      const r = mulberry32(hash(`${v.catNo}:${epoch}`))

      const count = 4 + Math.floor(r() * 4) // 4–7 sources
      const quotes: MarketQuote[] = []
      for (let i = 0; i < count; i++) {
        const picked = SOURCE_POOL[(hash(v.catNo) + i * 7) % SOURCE_POOL.length]
        const spread = (r() - 0.5) * 0.28 // ±14% normal retail variance
        quotes.push({
          source: picked.name,
          kind: picked.kind,
          pricePerVial: round2(Math.max(1, center * (1 + spread))),
        })
      }

      // Occasionally a source posts a clearance / bulk price. Flag it so the
      // service can exclude it and only average normal retail pricing.
      if (r() > 0.55 && quotes.length > 3) {
        const picked = SOURCE_POOL[(hash(v.catNo) + 3) % SOURCE_POOL.length]
        quotes.push({
          source: `${picked.name} (clearance)`,
          kind: picked.kind,
          pricePerVial: round2(Math.max(1, center * 0.5)),
          excluded: true,
        })
      }

      // vialsPerBox referenced to keep the internal packaging tie explicit for
      // downstream margin math; not exposed to customers.
      void vialsPerBox(v.spec)

      return { catNo: v.catNo, capturedAt, quotes }
    }),
  )
}

function epochToDate(epoch: number): Date {
  const y = Math.floor(epoch / 10000)
  const m = Math.floor((epoch % 10000) / 100) - 1
  const d = epoch % 100
  return new Date(Date.UTC(y, m, d, 9, 0, 0))
}
