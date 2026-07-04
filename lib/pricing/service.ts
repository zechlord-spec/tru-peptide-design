import 'server-only'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { peptidePricing, pricingRefreshLog, pricingReports, pricingSettings } from '@/lib/db/schema'
import type { PricingChange, PricingMode, PricingReport, PricingRow } from '@/lib/db/schema'
import { PRODUCTS, supplierBoxPrice, vialDose, vialsPerBox, wholesalePerVial } from '@/lib/products-data'
import {
  competitorFloorPrice,
  decidePricing,
  marginFloorPrice,
  MIN_GROSS_MARGIN,
  recalcPricingRow,
  type DeriveInputs,
} from './derive'
import { roundToAttractive } from './rounding'
import type { RetailSnapshot } from './format'
import { researchPeptidePricing } from './market-research'

const DEFAULT_MARKUP = 6

type Settings = {
  id: number
  activeMode: PricingMode
  markupMultiplier: number
  salePercentOff: number
  updatedAt: Date
}

// A believable market-average estimate used before the first AI research runs,
// so the storefront always shows live prices. Chosen so the Smart Dynamic price
// lands near a 6x-wholesale markup. Marked confidence 0 / 0 sources.
function estimateMarket(wholesale: number) {
  const average = roundToAttractive((wholesale * DEFAULT_MARKUP) / 0.82)
  return {
    average,
    low: Math.round(average * 0.85),
    high: Math.round(average * 1.25),
    median: average,
  }
}

export async function getSettings(): Promise<Settings> {
  const rows = await db.select().from(pricingSettings).where(eq(pricingSettings.id, 1)).limit(1)
  if (rows[0]) {
    return {
      id: rows[0].id,
      activeMode: rows[0].activeMode as PricingMode,
      markupMultiplier: rows[0].markupMultiplier,
      salePercentOff: rows[0].salePercentOff ?? 0,
      updatedAt: rows[0].updatedAt,
    }
  }
  await db.insert(pricingSettings).values({ id: 1 }).onConflictDoNothing()
  return {
    id: 1,
    activeMode: 'market',
    markupMultiplier: DEFAULT_MARKUP,
    salePercentOff: 0,
    updatedAt: new Date(),
  }
}

export async function getAllPricing(): Promise<PricingRow[]> {
  return db.select().from(peptidePricing)
}

/** Build the pure-math engine inputs for a stored row under the active settings. */
function deriveInputs(row: PricingRow, settings: Settings): DeriveInputs {
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

/**
 * Merge catalog metadata with stored pricing rows into fully-derived,
 * serializable rows for the admin Pricing Management view. Recomputes the
 * engine math per row (pure/cheap) so recommended price, floors, and strategy
 * label are always current; the retail price shown is the persisted one.
 */
export async function getDashboardRows(): Promise<DashboardRow[]> {
  await seedPricing()
  const settings = await getSettings()
  const rows = await getAllPricing()
  const byKey = new Map(rows.map((r) => [`${r.productSlug}::${r.variantKey}`, r]))

  const out: DashboardRow[] = []
  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      const row = byKey.get(`${product.slug}::${variant.catNo}`)
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
        flaggedAt: row.flaggedAt ? row.flaggedAt.toISOString() : null,
        lastUpdated: row.lastUpdated.toISOString(),
      })
    }
  }
  return out
}

/** Client-safe { catNo -> retail price } snapshot, with a fallback when the DB is empty. */
export async function getRetailSnapshot(): Promise<RetailSnapshot> {
  const snapshot: RetailSnapshot = {}
  let rows: PricingRow[] = []
  try {
    rows = await getAllPricing()
  } catch (err) {
    console.log('[v0] getRetailSnapshot db read failed, using fallback', String(err))
  }

  const byKey = new Map(rows.map((r) => [`${r.productSlug}::${r.variantKey}`, r]))

  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      const key = `${product.slug}::${variant.catNo}`
      const row = byKey.get(key)
      if (row && row.retailPrice > 0) {
        snapshot[variant.catNo] = row.retailPrice
      } else {
        snapshot[variant.catNo] = roundToAttractive(wholesalePerVial(variant) * DEFAULT_MARKUP)
      }
    }
  }
  return snapshot
}

/** Persist an engine decision (price + strategy + review flags) for one row. */
function decisionFields(
  d: ReturnType<typeof recalcPricingRow>,
  decision: ReturnType<typeof decidePricing>,
  prev: PricingRow | undefined,
) {
  return {
    retailPrice: decision.retailPrice,
    wholesalePerVial: d.wholesalePerVial,
    strategyUsed: decision.strategyUsed,
    targetPrice: d.targetPrice,
    dynamicDiscountPct: decision.dynamicDiscountPct,
    needsReview: decision.needsReview,
    reviewReason: decision.reviewReason,
    proposedPrice: decision.proposedPrice,
    proposedMarginPct: decision.proposedMarginPct,
    flaggedAt: decision.needsReview ? (prev?.needsReview && prev.flaggedAt ? prev.flaggedAt : new Date()) : null,
    lastUpdated: new Date(),
  }
}

/** Ensure every product/variant has a pricing row. Idempotent. */
export async function seedPricing(): Promise<number> {
  const settings = await getSettings()
  const existing = await getAllPricing()
  const have = new Set(existing.map((r) => `${r.productSlug}::${r.variantKey}`))

  let inserted = 0
  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      const key = `${product.slug}::${variant.catNo}`
      if (have.has(key)) continue

      const boxPrice = supplierBoxPrice(variant)
      const perBox = vialsPerBox(variant.spec)
      const wholesale = wholesalePerVial(variant)
      const est = estimateMarket(wholesale)

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

      await db
        .insert(peptidePricing)
        .values({
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
          ...decisionFields(d, decision, undefined),
        })
        .onConflictDoNothing()
      inserted++
    }
  }
  return inserted
}

/**
 * Recompute a single row from its current stored inputs after an EXPLICIT admin
 * action (mode switch, supplier-cost edit, manual/sale price). Non-guarded: the
 * price lands on the floor-respecting value immediately; if the target discount
 * could not be met the row is flagged for review (informational).
 */
async function recomputeRow(row: PricingRow, settings: Settings) {
  const d = recalcPricingRow(deriveInputs(row, settings))
  const decision = decidePricing(d, settings.activeMode, { guarded: false, currentPrice: row.retailPrice })
  await db
    .update(peptidePricing)
    .set(decisionFields(d, decision, row))
    .where(eq(peptidePricing.id, row.id))
}

/** Recompute EVERY row (used after a global mode / promo / cost change). */
export async function recomputeAll(): Promise<number> {
  const settings = await getSettings()
  const rows = await getAllPricing()
  for (const row of rows) await recomputeRow(row, settings)
  return rows.length
}

export async function setPricingMode(mode: PricingMode): Promise<number> {
  await db
    .insert(pricingSettings)
    .values({ id: 1, activeMode: mode, updatedAt: new Date() })
    .onConflictDoUpdate({ target: pricingSettings.id, set: { activeMode: mode, updatedAt: new Date() } })
  return recomputeAll()
}

/** Update the site-wide promotional sale percentage (fraction 0..1). */
export async function setGlobalSalePercent(fraction: number): Promise<number> {
  const pct = Math.max(0, Math.min(0.9, fraction))
  await db
    .insert(pricingSettings)
    .values({ id: 1, salePercentOff: pct, updatedAt: new Date() })
    .onConflictDoUpdate({ target: pricingSettings.id, set: { salePercentOff: pct, updatedAt: new Date() } })
  return recomputeAll()
}

/** Set (or clear) a per-product promotional override (fraction 0..1, or null). */
export async function setProductSalePercent(slug: string, variantKey: string, fraction: number | null) {
  const settings = await getSettings()
  const rows = await db
    .select()
    .from(peptidePricing)
    .where(and(eq(peptidePricing.productSlug, slug), eq(peptidePricing.variantKey, variantKey)))
    .limit(1)
  const row = rows[0]
  if (!row) return
  const pct = fraction == null ? null : Math.max(0, Math.min(0.9, fraction))
  await db.update(peptidePricing).set({ salePercentOff: pct }).where(eq(peptidePricing.id, row.id))
  await recomputeRow({ ...row, salePercentOff: pct }, settings)
}

export async function setManualPrice(slug: string, variantKey: string, price: number) {
  const settings = await getSettings()
  const rows = await db
    .select()
    .from(peptidePricing)
    .where(and(eq(peptidePricing.productSlug, slug), eq(peptidePricing.variantKey, variantKey)))
    .limit(1)
  const row = rows[0]
  if (!row) return
  await db.update(peptidePricing).set({ manualPrice: price }).where(eq(peptidePricing.id, row.id))
  await recomputeRow({ ...row, manualPrice: price }, settings)
}

export async function updateSupplierCost(
  slug: string,
  variantKey: string,
  supplierBoxPriceValue: number,
  vialsPerBoxValue: number,
) {
  const settings = await getSettings()
  const rows = await db
    .select()
    .from(peptidePricing)
    .where(and(eq(peptidePricing.productSlug, slug), eq(peptidePricing.variantKey, variantKey)))
    .limit(1)
  const row = rows[0]
  if (!row) return
  const updated = { ...row, supplierBoxPrice: supplierBoxPriceValue, vialsPerBox: vialsPerBoxValue }
  await db
    .update(peptidePricing)
    .set({ supplierBoxPrice: supplierBoxPriceValue, vialsPerBox: vialsPerBoxValue })
    .where(eq(peptidePricing.id, row.id))
  // Rule 4: a supplier-cost change recalculates pricing, protecting margin first.
  await recomputeRow(updated, settings)
}

// -------------------------- Review queue ----------------------------------

/** Products currently flagged for manual review by the safety rules. */
export async function getReviewQueue(): Promise<DashboardRow[]> {
  const rows = await getDashboardRows()
  return rows.filter((r) => r.needsReview)
}

/**
 * Approve a flagged product's withheld price: apply the engine's recommended
 * (floor-respecting) price — or the proposed target — and clear the flag.
 */
export async function approveReviewPrice(slug: string, variantKey: string) {
  const rows = await db
    .select()
    .from(peptidePricing)
    .where(and(eq(peptidePricing.productSlug, slug), eq(peptidePricing.variantKey, variantKey)))
    .limit(1)
  const row = rows[0]
  if (!row || !row.needsReview) return
  const price = row.proposedPrice && row.proposedPrice > 0 ? row.proposedPrice : row.retailPrice
  await db
    .update(peptidePricing)
    .set({
      retailPrice: price,
      needsReview: false,
      reviewReason: null,
      proposedPrice: null,
      proposedMarginPct: null,
      flaggedAt: null,
      lastUpdated: new Date(),
    })
    .where(eq(peptidePricing.id, row.id))
}

/** Dismiss a review flag WITHOUT applying the withheld price (keep current). */
export async function dismissReview(slug: string, variantKey: string) {
  const rows = await db
    .select()
    .from(peptidePricing)
    .where(and(eq(peptidePricing.productSlug, slug), eq(peptidePricing.variantKey, variantKey)))
    .limit(1)
  const row = rows[0]
  if (!row) return
  await db
    .update(peptidePricing)
    .set({
      needsReview: false,
      reviewReason: null,
      proposedPrice: null,
      proposedMarginPct: null,
      flaggedAt: null,
      lastUpdated: new Date(),
    })
    .where(eq(peptidePricing.id, row.id))
}

// -------------------------- Weekly refresh --------------------------------

/**
 * The full weekly pipeline: refresh competitor pricing, recalculate averages,
 * update retail + margins for every product (honoring the safety rules), and
 * generate a report (increases / decreases / margin warnings / manual review).
 *
 * Guarded: a scheduled/manual refresh never auto-moves a price into a floor
 * breach — such products keep their price and are flagged for review.
 */
export async function refreshAllPricing(
  trigger: 'scheduled' | 'manual' = 'manual',
): Promise<{ updated: number; status: string; notes: string; reportId: number }> {
  await seedPricing()
  const settings = await getSettings()

  const before = new Map<string, PricingRow>()
  for (const row of await getAllPricing()) before.set(`${row.productSlug}::${row.variantKey}`, row)

  const increases: PricingChange[] = []
  const decreases: PricingChange[] = []
  const needsReview: PricingChange[] = []
  const marginWarnings: PricingChange[] = []
  let updated = 0
  let failures = 0

  for (const product of PRODUCTS) {
    const doses = product.variants.map((v) => vialDose(v.spec))
    const research = await researchPeptidePricing({ peptideName: product.name, doses })
    if (!research) {
      failures++
      continue
    }

    for (const variant of product.variants) {
      const dose = vialDose(variant.spec)
      const match = research.find((r) => normalizeDose(r.dose) === normalizeDose(dose))
      if (!match) continue

      const prev = before.get(`${product.slug}::${variant.catNo}`)
      const confidence = clamp01(match.confidence)

      const inputs: DeriveInputs = {
        supplierBoxPrice: supplierBoxPrice(variant),
        vialsPerBox: vialsPerBox(variant.spec),
        marketAveragePrice: match.marketAverage,
        marketLow: match.marketLow,
        numberOfSources: match.numberOfSources,
        confidence,
        manualPrice: prev?.manualPrice ?? null,
        mode: settings.activeMode,
        markupMultiplier: settings.markupMultiplier,
        minGrossMargin: MIN_GROSS_MARGIN,
        promoGlobalPercentOff: settings.salePercentOff,
        promoProductPercentOff: prev?.salePercentOff ?? null,
      }
      const d = recalcPricingRow(inputs)
      const decision = decidePricing(d, settings.activeMode, {
        guarded: true,
        currentPrice: prev?.retailPrice ?? d.recommendedPrice,
      })

      const marketFields = {
        marketLow: match.marketLow,
        marketHigh: match.marketHigh,
        marketAveragePrice: match.marketAverage,
        marketMedian: match.marketMedian,
        numberOfSources: match.numberOfSources,
        confidenceScore: confidence,
      }

      await db
        .insert(peptidePricing)
        .values({
          productSlug: product.slug,
          variantKey: variant.catNo,
          supplierBoxPrice: supplierBoxPrice(variant),
          vialsPerBox: vialsPerBox(variant.spec),
          ...marketFields,
          ...decisionFields(d, decision, prev),
        })
        .onConflictDoUpdate({
          target: [peptidePricing.productSlug, peptidePricing.variantKey],
          set: { ...marketFields, ...decisionFields(d, decision, prev) },
        })
      updated++

      const oldPrice = prev?.retailPrice ?? decision.retailPrice
      const newPrice = decision.retailPrice
      const changeAmount = round2(newPrice - oldPrice)
      const changePct = oldPrice > 0 ? round2(((newPrice - oldPrice) / oldPrice) * 100) : 0
      const diffFromMarketPct =
        match.marketAverage > 0 ? round2(((newPrice - match.marketAverage) / match.marketAverage) * 100) : null

      const change: PricingChange = {
        productSlug: product.slug,
        productName: product.name,
        variantKey: variant.catNo,
        dose,
        oldPrice: round2(oldPrice),
        newPrice: round2(newPrice),
        changeAmount,
        changePct,
        marketAverage: match.marketAverage,
        diffFromMarketPct,
      }

      if (changeAmount > 0.005) increases.push(change)
      else if (changeAmount < -0.005) decreases.push(change)

      // Manual-review queue: the engine withheld an auto-update (Safety Rules).
      if (decision.needsReview) {
        const reasons: string[] = []
        if (decision.reviewReason) reasons.push(decision.reviewReason)
        if (confidence < 0.5) reasons.push('Low confidence in market data')
        if (match.numberOfSources < 3) reasons.push('Fewer than 3 competitor sources')
        needsReview.push({ ...change, reasons })
      }

      // Margin warnings: informational — resulting margin is under the 70%
      // minimum (e.g. a manual price the admin set below floor).
      const newMarginPct = newPrice > 0 ? ((newPrice - d.wholesalePerVial) / newPrice) * 100 : 0
      if (newMarginPct < MIN_GROSS_MARGIN * 100 - 0.5) {
        marginWarnings.push({
          ...change,
          reasons: [`Gross margin ${Math.round(newMarginPct)}% is below the ${Math.round(MIN_GROSS_MARGIN * 100)}% minimum`],
        })
      }
    }
  }

  const status = failures === 0 ? 'success' : updated > 0 ? 'partial' : 'failed'
  const notes = `${updated} variants updated${failures ? `, ${failures} products failed research` : ''}`
  await db.insert(pricingRefreshLog).values({ productsUpdated: updated, status, notes })

  const [report] = await db
    .insert(pricingReports)
    .values({
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
    })
    .returning({ id: pricingReports.id })

  return { updated, status, notes, reportId: report?.id ?? 0 }
}

export async function getRefreshLog(limit = 5) {
  return db.select().from(pricingRefreshLog).orderBy(desc(pricingRefreshLog.ranAt)).limit(limit)
}

export async function getLatestReport(): Promise<PricingReport | null> {
  const rows = await db.select().from(pricingReports).orderBy(desc(pricingReports.generatedAt)).limit(1)
  return rows[0] ?? null
}

export async function getReports(limit = 12): Promise<PricingReport[]> {
  return db.select().from(pricingReports).orderBy(desc(pricingReports.generatedAt)).limit(limit)
}

// Re-export the margin floor helper for admin displays.
export { marginFloorPrice, competitorFloorPrice }

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function normalizeDose(d: string): string {
  return d.toLowerCase().replace(/\s+/g, '')
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}
