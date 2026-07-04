import {
  integer,
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

export type PricingRow = typeof peptidePricing.$inferSelect
export type PricingMode = 'market' | 'markup6x' | 'manual'
