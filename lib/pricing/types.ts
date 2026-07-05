// Pricing domain types — the DB-free contract shared by the pure engine, the
// reference data source, the HTTP adapter, and the admin UI.
//
// These types used to live in `lib/db/schema` (Drizzle table inference). They
// have been lifted out so nothing in the frontend depends on a database: the
// pure pricing engine (`derive.ts`, `strategies/*`) and every consumer import
// these plain shapes instead.

export type { RetailSnapshot } from './format'

// market = Smart Dynamic (default), markup6x = Fixed Markup, manual = Manual
// Price, promo = Promotional Sale Pricing.
export type PricingMode = 'market' | 'markup6x' | 'manual' | 'promo'

/** Global pricing configuration (single record). */
export type PricingSettings = {
  activeMode: PricingMode
  markupMultiplier: number
  /** Site-wide promotional discount as a fraction (0..1). */
  salePercentOff: number
  /** ISO timestamp of the last settings change. */
  updatedAt: string
}

/**
 * A fully-derived, serializable pricing row for the admin Pricing Management,
 * Market Intelligence, and Review views. Wholesale figures are INTERNAL (admin
 * only) and never shown to customers.
 */
export type DashboardRow = {
  slug: string
  productName: string
  variantKey: string
  dose: string
  supplierBoxPrice: number
  vialsPerBox: number
  wholesalePerVial: number
  marketLow: number | null
  marketHigh: number | null
  marketAverage: number | null
  marketMedian: number | null
  numberOfSources: number
  confidenceScore: number
  retailPrice: number
  manualPrice: number | null
  salePercentOff: number | null
  differenceFromMarket: number | null
  differenceFromMarketPct: number | null
  grossMargin: number
  marginPct: number
  strategyUsed: string
  dynamicDiscountPct: number | null
  targetPrice: number
  recommendedPrice: number
  marginFloor: number // 70%-margin floor (Rule 3)
  competitorFloor: number // 10%-below-lowest floor (Rule 2)
  // Filter flags:
  belowTargetMargin: boolean // gross margin under the 70% minimum
  priceHigherThanMarket: boolean // retail above market average
  belowRecommended: boolean // retail under the floor-respecting recommended price
  isManualOverride: boolean // has an explicit manual price
  withinTargetBand: boolean // sits 15–20% below market average
  needsReview: boolean
  reviewReason: string | null
  proposedPrice: number | null
  proposedMarginPct: number | null
  flaggedAt: string | null
  lastUpdated: string
}

/** A single change line inside a pricing report. */
export type PricingChange = {
  productSlug: string
  productName: string
  variantKey: string
  dose: string
  oldPrice: number
  newPrice: number
  changeAmount: number
  changePct: number
  marketAverage: number | null
  diffFromMarketPct: number | null
  reasons?: string[]
}

/**
 * Weekly (or manual) pricing report: what went up, what went down, and what a
 * human should look at (low confidence / thin sourcing / margin breach).
 */
export type PricingReport = {
  id: number
  generatedAt: string
  trigger: 'scheduled' | 'manual'
  productsUpdated: number
  increasesCount: number
  decreasesCount: number
  reviewCount: number
  marginWarningsCount: number
  increases: PricingChange[]
  decreases: PricingChange[]
  needsReview: PricingChange[]
  marginWarnings: PricingChange[]
  status: string
  notes: string | null
}

/** A single scheduled/manual refresh audit-log entry. */
export type PricingRefreshLogEntry = {
  id: number
  ranAt: string
  productsUpdated: number
  status: string
  notes: string | null
}

/** The payload the admin Pricing Management view renders. */
export type PricingDashboard = {
  rows: DashboardRow[]
  activeMode: PricingMode
  markupMultiplier: number
  salePercentOff: number
  updatedAt: string
}

/** The payload the admin Scheduler & Reports view renders. */
export type PricingReportsView = {
  latest: PricingReport | null
  history: PricingReport[]
  log: PricingRefreshLogEntry[]
}
