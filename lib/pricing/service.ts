import 'server-only'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { peptidePricing, pricingRefreshLog, pricingReports, pricingSettings } from '@/lib/db/schema'
import type { PricingChange, PricingMode, PricingReport, PricingRow } from '@/lib/db/schema'
import {
  PRODUCTS,
  supplierBoxPrice,
  vialDose,
  vialsPerBox,
  wholesalePerVial,
} from '@/lib/products-data'
import { marginFloorPrice, recalcPricingRow } from './derive'
import { roundToAttractive } from './rounding'
import type { RetailSnapshot } from './format'
import { researchPeptidePricing } from './market-research'

const DEFAULT_MARKUP = 6

// A believable market-average estimate used before the first AI research runs,
// so the storefront always shows live prices. Chosen so retail (avg × 0.8)
// lands near a 6x-wholesale markup. Marked confidence 0 / 0 sources.
function estimateMarket(wholesale: number) {
  const average = roundToAttractive((wholesale * DEFAULT_MARKUP) / 0.8)
  return {
    average,
    low: Math.round(average * 0.82),
    high: Math.round(average * 1.25),
    median: average,
  }
}

export async function getSettings() {
  const rows = await db.select().from(pricingSettings).where(eq(pricingSettings.id, 1)).limit(1)
  if (rows[0]) return rows[0]
  await db.insert(pricingSettings).values({ id: 1 }).onConflictDoNothing()
  return { id: 1, activeMode: 'market' as PricingMode, markupMultiplier: DEFAULT_MARKUP, updatedAt: new Date() }
}

export async function getAllPricing(): Promise<PricingRow[]> {
  return db.select().from(peptidePricing)
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
  differenceFromMarket: number | null
  differenceFromMarketPct: number | null
  grossMargin: number
  marginPct: number
  belowTargetMargin: boolean // true when NOT at least 20% below market (needs attention)
  marginFloor: number // wholesale × 2.5 — the protected minimum retail price
  needsReview: boolean // flagged by pricing protection (margin < 60%)
  reviewReason: string | null
  proposedPrice: number | null // market price that was withheld
  proposedMarginPct: number | null
  flaggedAt: string | null
  lastUpdated: string
}

/**
 * Merge catalog metadata with stored pricing rows into fully-derived,
 * serializable rows for the admin Pricing Dashboard and Market Intelligence
 * views. Seeds first so every product has a row.
 */
export async function getDashboardRows(): Promise<DashboardRow[]> {
  await seedPricing()
  const rows = await getAllPricing()
  const byKey = new Map(rows.map((r) => [`${r.productSlug}::${r.variantKey}`, r]))

  const out: DashboardRow[] = []
  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      const row = byKey.get(`${product.slug}::${variant.catNo}`)
      if (!row) continue
      const retail = row.retailPrice
      const market = row.marketAveragePrice
      const wholesale = row.wholesalePerVial
      const diff = market != null ? round2(retail - market) : null
      const diffPct = market != null && market > 0 ? round2(((retail - market) / market) * 100) : null
      const grossMargin = round2(retail - wholesale)
      const marginPct = retail > 0 ? round2((grossMargin / retail) * 100) : 0
      // "On target" = priced at least 20% below market (retail <= market * 0.8).
      const belowTargetMargin = market != null && market > 0 ? retail > market * 0.8 : false

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
        differenceFromMarket: diff,
        differenceFromMarketPct: diffPct,
        grossMargin,
        marginPct,
        belowTargetMargin,
        marginFloor: marginFloorPrice(wholesale),
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
        // Fallback: derive from internal wholesale at the default markup.
        snapshot[variant.catNo] = roundToAttractive(wholesalePerVial(variant) * DEFAULT_MARKUP)
      }
    }
  }
  return snapshot
}

/** Ensure every product/variant has a pricing row. Idempotent. */
export async function seedPricing(): Promise<number> {
  const settings = await getSettings()
  const mode = settings.activeMode as PricingMode
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

      const derived = recalcPricingRow({
        supplierBoxPrice: boxPrice,
        vialsPerBox: perBox,
        marketAveragePrice: est.average,
        manualPrice: null,
        mode,
        markupMultiplier: settings.markupMultiplier,
      })

      await db.insert(peptidePricing).values({
        productSlug: product.slug,
        variantKey: variant.catNo,
        supplierBoxPrice: boxPrice,
        vialsPerBox: perBox,
        wholesalePerVial: derived.wholesalePerVial,
        marketLow: est.low,
        marketHigh: est.high,
        marketAveragePrice: est.average,
        marketMedian: est.median,
        numberOfSources: 0,
        confidenceScore: 0,
        retailPrice: derived.retailPrice,
      }).onConflictDoNothing()
      inserted++
    }
  }
  return inserted
}

/** Recompute retail/wholesale for a single row from its current stored inputs. */
async function recomputeRow(row: PricingRow, mode: PricingMode, markup: number) {
  const derived = recalcPricingRow({
    supplierBoxPrice: row.supplierBoxPrice,
    vialsPerBox: row.vialsPerBox,
    marketAveragePrice: row.marketAveragePrice,
    manualPrice: row.manualPrice,
    mode,
    markupMultiplier: markup,
  })
  // An explicit admin recompute always lands on a floor-safe price, so any
  // pending margin-review flag is resolved.
  await db
    .update(peptidePricing)
    .set({
      wholesalePerVial: derived.wholesalePerVial,
      retailPrice: derived.retailPrice,
      needsReview: false,
      reviewReason: null,
      proposedPrice: null,
      proposedMarginPct: null,
      flaggedAt: null,
      lastUpdated: new Date(),
    })
    .where(eq(peptidePricing.id, row.id))
}

/** Recompute EVERY row (used after a global mode change). */
export async function recomputeAll(): Promise<number> {
  const settings = await getSettings()
  const rows = await getAllPricing()
  for (const row of rows) {
    await recomputeRow(row, settings.activeMode as PricingMode, settings.markupMultiplier)
  }
  return rows.length
}

export async function setPricingMode(mode: PricingMode): Promise<number> {
  await db
    .insert(pricingSettings)
    .values({ id: 1, activeMode: mode, updatedAt: new Date() })
    .onConflictDoUpdate({ target: pricingSettings.id, set: { activeMode: mode, updatedAt: new Date() } })
  return recomputeAll()
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
  await db
    .update(peptidePricing)
    .set({ manualPrice: price })
    .where(eq(peptidePricing.id, row.id))
  await recomputeRow({ ...row, manualPrice: price }, settings.activeMode as PricingMode, settings.markupMultiplier)
}

/** Products currently flagged by pricing protection (margin below the 60% floor). */
export async function getReviewQueue(): Promise<DashboardRow[]> {
  const rows = await getDashboardRows()
  return rows.filter((r) => r.needsReview)
}

/**
 * Approve a flagged product's withheld market price: apply it as the new retail
 * price (the admin is explicitly accepting a sub-60% margin) and clear the flag.
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

/**
 * Dismiss a review flag WITHOUT applying the withheld price. The current retail
 * price (protected at the ≥60% floor) is kept.
 */
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
  await recomputeRow(updated, settings.activeMode as PricingMode, settings.markupMultiplier)
}

/**
 * The full weekly pipeline: refresh competitor pricing, recalculate averages,
 * update retail + margins for every product, and generate a pricing report
 * (increases / decreases / items needing manual review).
 *
 * `trigger` distinguishes the Sunday cron run ('scheduled') from a manual
 * admin refresh ('manual').
 */
export async function refreshAllPricing(
  trigger: 'scheduled' | 'manual' = 'manual',
): Promise<{ updated: number; status: string; notes: string; reportId: number }> {
  await seedPricing()
  const settings = await getSettings()
  const mode = settings.activeMode as PricingMode

  // Snapshot current prices BEFORE the refresh so we can diff afterwards.
  const before = new Map<string, PricingRow>()
  for (const row of await getAllPricing()) {
    before.set(`${row.productSlug}::${row.variantKey}`, row)
  }

  const increases: PricingChange[] = []
  const decreases: PricingChange[] = []
  const needsReview: PricingChange[] = []
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

      const derived = recalcPricingRow({
        supplierBoxPrice: supplierBoxPrice(variant),
        vialsPerBox: vialsPerBox(variant.spec),
        marketAveragePrice: match.marketAverage,
        manualPrice: null,
        mode,
        markupMultiplier: settings.markupMultiplier,
      })
      const confidence = clamp01(match.confidence)
      const prev = before.get(`${product.slug}::${variant.catNo}`)

      // PRICING PROTECTION: if the freshly computed market price would give less
      // than a 60% gross margin (retail < wholesale × 2.5), DO NOT auto-apply it.
      // Flag the product for manual review and keep its existing retail price.
      const passesMarginFloor = derived.meetsMarginFloor
      const proposedMarginPct =
        derived.rawRetailPrice > 0
          ? round2(((derived.rawRetailPrice - derived.wholesalePerVial) / derived.rawRetailPrice) * 100)
          : 0

      // Market-intelligence fields are always refreshed.
      const marketFields = {
        marketLow: match.marketLow,
        marketHigh: match.marketHigh,
        marketAveragePrice: match.marketAverage,
        marketMedian: match.marketMedian,
        numberOfSources: match.numberOfSources,
        confidenceScore: confidence,
        wholesalePerVial: derived.wholesalePerVial,
        lastUpdated: new Date(),
      }

      const reviewFields = passesMarginFloor
        ? {
            retailPrice: derived.retailPrice,
            needsReview: false,
            reviewReason: null,
            proposedPrice: null,
            proposedMarginPct: null,
            flaggedAt: null,
          }
        : {
            // Retail price intentionally left unchanged (protection).
            needsReview: true,
            reviewReason: `Market price of $${derived.rawRetailPrice} would yield only ${proposedMarginPct}% gross margin (minimum 60%). Not auto-applied.`,
            proposedPrice: derived.rawRetailPrice,
            proposedMarginPct,
            flaggedAt: prev?.needsReview && prev.flaggedAt ? prev.flaggedAt : new Date(),
          }

      await db
        .insert(peptidePricing)
        .values({
          productSlug: product.slug,
          variantKey: variant.catNo,
          supplierBoxPrice: supplierBoxPrice(variant),
          vialsPerBox: vialsPerBox(variant.spec),
          // New rows have no prior price, so seed at the protected floor.
          retailPrice: derived.retailPrice,
          ...marketFields,
          ...reviewFields,
        })
        .onConflictDoUpdate({
          target: [peptidePricing.productSlug, peptidePricing.variantKey],
          set: {
            ...marketFields,
            ...reviewFields,
          },
        })
      updated++

      // Classify the change vs the pre-refresh price. When flagged, the stored
      // price is unchanged, so oldPrice === newPrice (no increase/decrease).
      const oldPrice = prev?.retailPrice ?? derived.retailPrice
      const newPrice = passesMarginFloor ? derived.retailPrice : oldPrice
      const changeAmount = round2(newPrice - oldPrice)
      const changePct = oldPrice > 0 ? round2(((newPrice - oldPrice) / oldPrice) * 100) : 0
      const diffFromMarketPct =
        match.marketAverage > 0
          ? round2(((newPrice - match.marketAverage) / match.marketAverage) * 100)
          : null

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

      // Manual-review triggers: below the 60% margin floor (protection),
      // thin/low-confidence sourcing, price no longer at least 20% below
      // market, or a large week-over-week swing.
      const reasons: string[] = []
      if (!passesMarginFloor)
        reasons.push(`Below 60% margin floor — market price ($${derived.rawRetailPrice}) not auto-applied`)
      if (confidence < 0.5) reasons.push('Low confidence in market data')
      if (match.numberOfSources < 3) reasons.push('Fewer than 3 competitor sources')
      if (match.marketAverage > 0 && newPrice > match.marketAverage * 0.8)
        reasons.push('No longer at least 20% below market average')
      if (Math.abs(changePct) >= 25) reasons.push(`Large price swing (${changePct}%)`)
      if (reasons.length > 0) needsReview.push({ ...change, reasons })
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
      increases,
      decreases,
      needsReview,
      status,
      notes,
    })
    .returning({ id: pricingReports.id })

  return { updated, status, notes, reportId: report?.id ?? 0 }
}

export async function getRefreshLog(limit = 5) {
  return db
    .select()
    .from(pricingRefreshLog)
    .orderBy(desc(pricingRefreshLog.ranAt))
    .limit(limit)
}

export async function getLatestReport(): Promise<PricingReport | null> {
  const rows = await db
    .select()
    .from(pricingReports)
    .orderBy(desc(pricingReports.generatedAt))
    .limit(1)
  return rows[0] ?? null
}

export async function getReports(limit = 12): Promise<PricingReport[]> {
  return db
    .select()
    .from(pricingReports)
    .orderBy(desc(pricingReports.generatedAt))
    .limit(limit)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function normalizeDose(d: string): string {
  return d.toLowerCase().replace(/\s+/g, '')
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}
