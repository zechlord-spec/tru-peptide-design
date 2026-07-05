// ---------------------------------------------------------------------------
// Reference pricing engine — PURE and framework-free.
//
// This is the in-memory equivalent of the former DB-backed pricing service. It
// operates on a serializable `PricingState` object instead of a database, so it
// runs anywhere: on the server (to produce the storefront retail snapshot) and
// in the browser (to power the admin Pricing Management demo on reference data).
//
// It has NO side effects — every mutation returns a new state. Persistence
// (localStorage in the reference client) and transport (HTTP to a real backend)
// live in the adapter layer, not here.
//
// The heavy lifting (strategies + safety-rule evaluation) is delegated to the
// pure engine in `derive.ts` / `strategies/*`.
// ---------------------------------------------------------------------------

import {
  PRODUCTS,
  supplierBoxPrice,
  vialDose,
  vialsPerBox,
  wholesalePerVial,
} from '@/lib/products-data'
import {
  DEFAULT_MARKUP,
  MIN_GROSS_MARGIN,
  competitorFloorPrice,
  decidePricing,
  marginFloorPrice,
  recalcPricingRow,
  type DeriveInputs,
} from './derive'
import { roundToAttractive } from './rounding'
import type { RetailSnapshot } from './format'
import type {
  DashboardRow,
  PricingChange,
  PricingMode,
  PricingReport,
  PricingRefreshLogEntry,
  PricingSettings,
} from './types'

export { marginFloorPrice, competitorFloorPrice }

/** A stored pricing row — the serializable subset the engine needs to persist. */
export type StoredRow = {
  productSlug: string
  variantKey: string
  supplierBoxPrice: number
  vialsPerBox: number
  marketLow: number | null
  marketHigh: number | null
  marketAveragePrice: number | null
  marketMedian: number | null
  numberOfSources: number
  confidenceScore: number
  manualPrice: number | null
  retailPrice: number
  salePercentOff: number | null
  strategyUsed: string
  targetPrice: number | null
  dynamicDiscountPct: number | null
  needsReview: boolean
  reviewReason: string | null
  proposedPrice: number | null
  proposedMarginPct: number | null
  flaggedAt: string | null
  lastUpdated: string
}

/** The full serializable pricing state (the reference "database"). */
export type PricingState = {
  settings: PricingSettings
  rows: StoredRow[]
  reports: PricingReport[]
  log: PricingRefreshLogEntry[]
  reportSeq: number
}

const DEFAULT_SETTINGS: PricingSettings = {
  activeMode: 'market',
  markupMultiplier: DEFAULT_MARKUP,
  salePercentOff: 0,
  updatedAt: new Date(0).toISOString(),
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function keyOf(slug: string, variantKey: string): string {
  return `${slug}::${variantKey}`
}

// A believable market-average estimate used before any live research, so the
// storefront always shows sensible prices. Chosen so the Smart Dynamic price
// lands near a 6x-wholesale markup. Confidence 0 / 0 sources.
function estimateMarket(wholesale: number) {
  const average = roundToAttractive((wholesale * DEFAULT_MARKUP) / 0.82)
  return {
    average,
    low: Math.round(average * 0.85),
    high: Math.round(average * 1.25),
    median: average,
  }
}

function deriveInputs(row: StoredRow, settings: PricingSettings): DeriveInputs {
  return {
    supplierBoxPrice: row.supplierBoxPrice,
    vialsPerBox: row.vialsPerBox,
    marketAveragePrice: row.marketAveragePrice,
    marketLow: row.marketLow,
    numberOfSources: row.numberOfSources,
    confidence: row.confidenceScore,
    manualPrice: row.manualPrice,
    mode: settings.activeMode,
    markupMultiplier: settings.markupMultiplier,
    minGrossMargin: MIN_GROSS_MARGIN,
    promoGlobalPercentOff: settings.salePercentOff,
    promoProductPercentOff: row.salePercentOff ?? null,
  }
}

/** Apply an engine decision to a stored row (mirrors the former decisionFields). */
function applyDecision(
  row: StoredRow,
  d: ReturnType<typeof recalcPricingRow>,
  decision: ReturnType<typeof decidePricing>,
  now: string,
): StoredRow {
  return {
    ...row,
    retailPrice: decision.retailPrice,
    strategyUsed: decision.strategyUsed,
    targetPrice: d.targetPrice,
    dynamicDiscountPct: decision.dynamicDiscountPct,
    needsReview: decision.needsReview,
    reviewReason: decision.reviewReason,
    proposedPrice: decision.proposedPrice,
    proposedMarginPct: decision.proposedMarginPct,
    flaggedAt: decision.needsReview ? (row.needsReview && row.flaggedAt ? row.flaggedAt : now) : null,
    lastUpdated: now,
  }
}

/** Recompute a single row from its current inputs (non-guarded admin action). */
function recomputeRow(row: StoredRow, settings: PricingSettings, now: string): StoredRow {
  const d = recalcPricingRow(deriveInputs(row, settings))
  const decision = decidePricing(d, settings.activeMode, {
    guarded: false,
    currentPrice: row.retailPrice,
  })
  return applyDecision(row, d, decision, now)
}

// ---------------------------------------------------------------------------
// State construction
// ---------------------------------------------------------------------------

/** Build a fully-seeded reference pricing state for every product/variant. */
export function initialState(settings: PricingSettings = DEFAULT_SETTINGS): PricingState {
  const now = new Date().toISOString()
  const rows: StoredRow[] = []

  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      const boxPrice = supplierBoxPrice(variant)
      const perBox = vialsPerBox(variant.spec)
      const wholesale = wholesalePerVial(variant)
      const est = estimateMarket(wholesale)

      const base: StoredRow = {
        productSlug: product.slug,
        variantKey: variant.catNo,
        supplierBoxPrice: boxPrice,
        vialsPerBox: perBox,
        marketLow: est.low,
        marketHigh: est.high,
        marketAveragePrice: est.average,
        marketMedian: est.median,
        numberOfSources: 0,
        confidenceScore: 0,
        manualPrice: null,
        retailPrice: 0,
        salePercentOff: null,
        strategyUsed: 'Smart Dynamic',
        targetPrice: null,
        dynamicDiscountPct: null,
        needsReview: false,
        reviewReason: null,
        proposedPrice: null,
        proposedMarginPct: null,
        flaggedAt: null,
        lastUpdated: now,
      }

      const inputs: DeriveInputs = {
        supplierBoxPrice: boxPrice,
        vialsPerBox: perBox,
        marketAveragePrice: est.average,
        marketLow: est.low,
        numberOfSources: 0,
        confidence: 0,
        manualPrice: null,
        mode: settings.activeMode,
        markupMultiplier: settings.markupMultiplier,
        minGrossMargin: MIN_GROSS_MARGIN,
        promoGlobalPercentOff: settings.salePercentOff,
        promoProductPercentOff: null,
      }
      const d = recalcPricingRow(inputs)
      const decision = decidePricing(d, settings.activeMode, { guarded: false, currentPrice: 0 })
      rows.push(applyDecision(base, d, decision, now))
    }
  }

  return { settings, rows, reports: [], log: [], reportSeq: 0 }
}

// ---------------------------------------------------------------------------
// Read projections
// ---------------------------------------------------------------------------

/**
 * Client-safe `{ catNo -> retail price }` snapshot. Falls back to a default
 * markup when a variant has no priced row (mirrors the former DB fallback).
 */
export function snapshotFrom(state: PricingState): RetailSnapshot {
  const snapshot: RetailSnapshot = {}
  const byKey = new Map(state.rows.map((r) => [keyOf(r.productSlug, r.variantKey), r]))

  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      const row = byKey.get(keyOf(product.slug, variant.catNo))
      if (row && row.retailPrice > 0) {
        snapshot[variant.catNo] = row.retailPrice
      } else {
        snapshot[variant.catNo] = roundToAttractive(wholesalePerVial(variant) * DEFAULT_MARKUP)
      }
    }
  }
  return snapshot
}

/**
 * The default reference retail snapshot with no admin state applied. Used by the
 * server-side storefront read so previews always show live prices.
 */
export function defaultSnapshot(): RetailSnapshot {
  const snapshot: RetailSnapshot = {}
  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      snapshot[variant.catNo] = roundToAttractive(wholesalePerVial(variant) * DEFAULT_MARKUP)
    }
  }
  return snapshot
}

/** Fully-derived, serializable rows for the admin Pricing Management view. */
export function dashboardRowsFrom(state: PricingState): DashboardRow[] {
  const { settings } = state
  const byKey = new Map(state.rows.map((r) => [keyOf(r.productSlug, r.variantKey), r]))

  const out: DashboardRow[] = []
  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      const row = byKey.get(keyOf(product.slug, variant.catNo))
      if (!row) continue

      const d = recalcPricingRow(deriveInputs(row, settings))
      const retail = row.retailPrice
      const market = row.marketAveragePrice
      const wholesale = d.wholesalePerVial
      const diff = market != null ? round2(retail - market) : null
      const diffPct = market != null && market > 0 ? round2(((retail - market) / market) * 100) : null
      const grossMargin = round2(retail - wholesale)
      const marginPct = retail > 0 ? round2((grossMargin / retail) * 100) : 0

      out.push({
        slug: product.slug,
        productName: product.name,
        variantKey: variant.catNo,
        dose: vialDose(variant.spec),
        supplierBoxPrice: row.supplierBoxPrice,
        vialsPerBox: row.vialsPerBox,
        wholesalePerVial: round2(wholesale),
        marketLow: row.marketLow,
        marketHigh: row.marketHigh,
        marketAverage: market,
        marketMedian: row.marketMedian,
        numberOfSources: row.numberOfSources,
        confidenceScore: row.confidenceScore,
        retailPrice: retail,
        manualPrice: row.manualPrice,
        salePercentOff: row.salePercentOff ?? null,
        differenceFromMarket: diff,
        differenceFromMarketPct: diffPct,
        grossMargin,
        marginPct,
        strategyUsed: row.strategyUsed ?? d.strategyUsed,
        dynamicDiscountPct: row.dynamicDiscountPct ?? d.dynamicDiscountPct,
        targetPrice: d.targetPrice,
        recommendedPrice: d.recommendedPrice,
        marginFloor: d.marginFloor,
        competitorFloor: d.competitorFloor,
        belowTargetMargin: marginPct < MIN_GROSS_MARGIN * 100 - 0.5,
        priceHigherThanMarket: market != null && market > 0 ? retail > market : false,
        belowRecommended: retail < d.recommendedPrice - 0.01,
        isManualOverride: row.manualPrice != null && row.manualPrice > 0,
        withinTargetBand:
          market != null && market > 0
            ? retail <= market * 0.85 + 0.01 && retail >= market * 0.8 - 0.01
            : false,
        needsReview: row.needsReview,
        reviewReason: row.reviewReason,
        proposedPrice: row.proposedPrice,
        proposedMarginPct: row.proposedMarginPct,
        flaggedAt: row.flaggedAt,
        lastUpdated: row.lastUpdated,
      })
    }
  }
  return out
}

/** Rows currently flagged for manual review by the safety rules. */
export function reviewQueueFrom(state: PricingState): DashboardRow[] {
  return dashboardRowsFrom(state).filter((r) => r.needsReview)
}

// ---------------------------------------------------------------------------
// Mutations (each returns a new state)
// ---------------------------------------------------------------------------

function mapRows(
  state: PricingState,
  fn: (row: StoredRow) => StoredRow,
): PricingState {
  return { ...state, rows: state.rows.map(fn) }
}

function touchSettings(settings: PricingSettings, patch: Partial<PricingSettings>): PricingSettings {
  return { ...settings, ...patch, updatedAt: new Date().toISOString() }
}

/** Recompute EVERY row under the current settings (after a global change). */
function recomputeAll(state: PricingState): PricingState {
  const now = new Date().toISOString()
  return mapRows(state, (row) => recomputeRow(row, state.settings, now))
}

export function setMode(state: PricingState, mode: PricingMode): PricingState {
  const next = { ...state, settings: touchSettings(state.settings, { activeMode: mode }) }
  return recomputeAll(next)
}

/** Site-wide promotional sale percentage (fraction 0..1). */
export function setGlobalSalePercent(state: PricingState, fraction: number): PricingState {
  const pct = Math.max(0, Math.min(0.9, fraction))
  const next = { ...state, settings: touchSettings(state.settings, { salePercentOff: pct }) }
  return recomputeAll(next)
}

export function setManualPrice(
  state: PricingState,
  slug: string,
  variantKey: string,
  price: number,
): PricingState {
  const now = new Date().toISOString()
  return mapRows(state, (row) =>
    row.productSlug === slug && row.variantKey === variantKey
      ? recomputeRow({ ...row, manualPrice: price }, state.settings, now)
      : row,
  )
}

/** Per-product promotional override (fraction 0..1, or null to clear). */
export function setProductSalePercent(
  state: PricingState,
  slug: string,
  variantKey: string,
  fraction: number | null,
): PricingState {
  const now = new Date().toISOString()
  const pct = fraction == null ? null : Math.max(0, Math.min(0.9, fraction))
  return mapRows(state, (row) =>
    row.productSlug === slug && row.variantKey === variantKey
      ? recomputeRow({ ...row, salePercentOff: pct }, state.settings, now)
      : row,
  )
}

export function updateSupplierCost(
  state: PricingState,
  slug: string,
  variantKey: string,
  supplierBoxPriceValue: number,
  vialsPerBoxValue: number,
): PricingState {
  const now = new Date().toISOString()
  return mapRows(state, (row) =>
    row.productSlug === slug && row.variantKey === variantKey
      ? recomputeRow(
          { ...row, supplierBoxPrice: supplierBoxPriceValue, vialsPerBox: vialsPerBoxValue },
          state.settings,
          now,
        )
      : row,
  )
}

export function approveReview(state: PricingState, slug: string, variantKey: string): PricingState {
  const now = new Date().toISOString()
  return mapRows(state, (row) => {
    if (row.productSlug !== slug || row.variantKey !== variantKey || !row.needsReview) return row
    const price = row.proposedPrice && row.proposedPrice > 0 ? row.proposedPrice : row.retailPrice
    return {
      ...row,
      retailPrice: price,
      needsReview: false,
      reviewReason: null,
      proposedPrice: null,
      proposedMarginPct: null,
      flaggedAt: null,
      lastUpdated: now,
    }
  })
}

export function dismissReview(state: PricingState, slug: string, variantKey: string): PricingState {
  const now = new Date().toISOString()
  return mapRows(state, (row) => {
    if (row.productSlug !== slug || row.variantKey !== variantKey) return row
    return {
      ...row,
      needsReview: false,
      reviewReason: null,
      proposedPrice: null,
      proposedMarginPct: null,
      flaggedAt: null,
      lastUpdated: now,
    }
  })
}

/**
 * The reference "weekly refresh": re-run every variant's LAST-KNOWN market data
 * through the current engine (guarded so a scheduled run never moves a price
 * into a floor breach) and generate a report. There is no live market research
 * in the presentation frontend — a real backend performs that behind the HTTP
 * boundary — so prices converge on the active rules using stored market data.
 */
export function refresh(
  state: PricingState,
  trigger: 'scheduled' | 'manual' = 'manual',
): { state: PricingState; report: PricingReport } {
  const now = new Date().toISOString()
  const { settings } = state

  const increases: PricingChange[] = []
  const decreases: PricingChange[] = []
  const needsReview: PricingChange[] = []
  const marginWarnings: PricingChange[] = []
  let updated = 0

  const productBySlug = new Map(PRODUCTS.map((p) => [p.slug, p]))

  const newRows = state.rows.map((prev) => {
    const product = productBySlug.get(prev.productSlug)
    if (!product) return prev
    const dose = vialDose(
      product.variants.find((v) => v.catNo === prev.variantKey)?.spec ?? prev.variantKey,
    )

    const market =
      prev.marketAveragePrice != null && prev.marketLow != null
        ? {
            marketLow: prev.marketLow,
            marketHigh: prev.marketHigh ?? prev.marketAveragePrice,
            marketAverage: prev.marketAveragePrice,
            marketMedian: prev.marketMedian ?? prev.marketAveragePrice,
            numberOfSources: prev.numberOfSources ?? 0,
            confidence: prev.confidenceScore ?? 0,
          }
        : null
    if (!market) return prev

    const inputs: DeriveInputs = {
      supplierBoxPrice: prev.supplierBoxPrice,
      vialsPerBox: prev.vialsPerBox,
      marketAveragePrice: market.marketAverage,
      marketLow: market.marketLow,
      numberOfSources: market.numberOfSources,
      confidence: market.confidence,
      manualPrice: prev.manualPrice,
      mode: settings.activeMode,
      markupMultiplier: settings.markupMultiplier,
      minGrossMargin: MIN_GROSS_MARGIN,
      promoGlobalPercentOff: settings.salePercentOff,
      promoProductPercentOff: prev.salePercentOff ?? null,
    }
    const d = recalcPricingRow(inputs)
    const decision = decidePricing(d, settings.activeMode, {
      guarded: true,
      currentPrice: prev.retailPrice || d.recommendedPrice,
    })
    const next = applyDecision(prev, d, decision, now)
    updated++

    const oldPrice = prev.retailPrice || decision.retailPrice
    const newPrice = decision.retailPrice
    const changeAmount = round2(newPrice - oldPrice)
    const changePct = oldPrice > 0 ? round2(((newPrice - oldPrice) / oldPrice) * 100) : 0
    const diffFromMarketPct =
      market.marketAverage > 0
        ? round2(((newPrice - market.marketAverage) / market.marketAverage) * 100)
        : null

    const change: PricingChange = {
      productSlug: product.slug,
      productName: product.name,
      variantKey: prev.variantKey,
      dose,
      oldPrice: round2(oldPrice),
      newPrice: round2(newPrice),
      changeAmount,
      changePct,
      marketAverage: market.marketAverage,
      diffFromMarketPct,
    }

    if (changeAmount > 0.005) increases.push(change)
    else if (changeAmount < -0.005) decreases.push(change)

    if (decision.needsReview) {
      const reasons: string[] = []
      if (decision.reviewReason) reasons.push(decision.reviewReason)
      if (market.confidence < 0.5) reasons.push('Low confidence in market data')
      if (market.numberOfSources < 3) reasons.push('Fewer than 3 competitor sources')
      needsReview.push({ ...change, reasons })
    }

    const newMarginPct = newPrice > 0 ? ((newPrice - d.wholesalePerVial) / newPrice) * 100 : 0
    if (newMarginPct < MIN_GROSS_MARGIN * 100 - 0.5) {
      marginWarnings.push({
        ...change,
        reasons: [
          `Gross margin ${Math.round(newMarginPct)}% is below the ${Math.round(
            MIN_GROSS_MARGIN * 100,
          )}% minimum`,
        ],
      })
    }

    return next
  })

  const status = 'success'
  const notes = `${updated} variants updated`
  const reportSeq = state.reportSeq + 1

  const report: PricingReport = {
    id: reportSeq,
    generatedAt: now,
    trigger,
    productsUpdated: updated,
    increasesCount: increases.length,
    decreasesCount: decreases.length,
    reviewCount: needsReview.length,
    marginWarningsCount: marginWarnings.length,
    increases,
    decreases,
    needsReview,
    marginWarnings,
    status,
    notes,
  }

  const logEntry: PricingRefreshLogEntry = {
    id: reportSeq,
    ranAt: now,
    productsUpdated: updated,
    status,
    notes,
  }

  const nextState: PricingState = {
    ...state,
    rows: newRows,
    reports: [report, ...state.reports].slice(0, 24),
    log: [logEntry, ...state.log].slice(0, 24),
    reportSeq,
  }

  return { state: nextState, report }
}
