import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

// Per-vial pricing + market intelligence. supplier_box_price / vials_per_box /
// wholesale_per_vial are INTERNAL (admin only) and never shown to customers.
export const peptidePricing = pgTable(
  'peptide_pricing',
  {
    id: serial('id').primaryKey(),
    productSlug: text('product_slug').notNull(),
    variantKey: text('variant_key').notNull(),
    supplierBoxPrice: numeric('supplier_box_price', { mode: 'number' }).notNull().default(0),
    vialsPerBox: integer('vials_per_box').notNull().default(10),
    wholesalePerVial: numeric('wholesale_per_vial', { mode: 'number' }).notNull().default(0),
    marketLow: numeric('market_low', { mode: 'number' }),
    marketHigh: numeric('market_high', { mode: 'number' }),
    marketAveragePrice: numeric('market_average_price', { mode: 'number' }),
    marketMedian: numeric('market_median', { mode: 'number' }),
    numberOfSources: integer('number_of_sources').notNull().default(0),
    confidenceScore: numeric('confidence_score', { mode: 'number' }).notNull().default(0),
    manualPrice: numeric('manual_price', { mode: 'number' }),
    retailPrice: numeric('retail_price', { mode: 'number' }).notNull().default(0),
    // --- Pricing protection / manual-review queue ---
    // When the market-derived price would fall below the margin floor
    // (retail < wholesale × 2.5, i.e. < 60% gross margin) the refresh does NOT
    // auto-apply it. Instead the row is flagged here for an admin to review.
    needsReview: boolean('needs_review').notNull().default(false),
    reviewReason: text('review_reason'),
    proposedPrice: numeric('proposed_price', { mode: 'number' }),
    proposedMarginPct: numeric('proposed_margin_pct', { mode: 'number' }),
    flaggedAt: timestamp('flagged_at', { withTimezone: true }),
    lastUpdated: timestamp('last_updated', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniqSlugVariant: unique().on(t.productSlug, t.variantKey),
  }),
)

// Single-row global config for the active pricing mode.
export const pricingSettings = pgTable('pricing_settings', {
  id: integer('id').primaryKey().default(1),
  activeMode: text('active_mode').notNull().default('market'),
  markupMultiplier: numeric('markup_multiplier', { mode: 'number' }).notNull().default(6),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const pricingRefreshLog = pgTable('pricing_refresh_log', {
  id: serial('id').primaryKey(),
  ranAt: timestamp('ran_at', { withTimezone: true }).notNull().defaultNow(),
  productsUpdated: integer('products_updated').notNull().default(0),
  status: text('status').notNull().default('success'),
  notes: text('notes'),
})

// A single change line inside a pricing report.
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

// Weekly (or manual) pricing report: what went up, what went down, and what a
// human should look at (low confidence / thin sourcing / no longer 20% below).
export const pricingReports = pgTable('pricing_reports', {
  id: serial('id').primaryKey(),
  generatedAt: timestamp('generated_at', { withTimezone: true }).notNull().defaultNow(),
  trigger: text('trigger').notNull().default('scheduled'),
  productsUpdated: integer('products_updated').notNull().default(0),
  increasesCount: integer('increases_count').notNull().default(0),
  decreasesCount: integer('decreases_count').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  increases: jsonb('increases').$type<PricingChange[]>().notNull().default([]),
  decreases: jsonb('decreases').$type<PricingChange[]>().notNull().default([]),
  needsReview: jsonb('needs_review').$type<PricingChange[]>().notNull().default([]),
  status: text('status').notNull().default('success'),
  notes: text('notes'),
})

export type PricingRow = typeof peptidePricing.$inferSelect
export type PricingReport = typeof pricingReports.$inferSelect
export type PricingMode = 'market' | 'markup6x' | 'manual'
