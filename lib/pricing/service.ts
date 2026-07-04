import 'server-only'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { peptidePricing, pricingRefreshLog, pricingSettings } from '@/lib/db/schema'
import type { PricingMode, PricingRow } from '@/lib/db/schema'
import {
  PRODUCTS,
  supplierBoxPrice,
  vialDose,
  vialsPerBox,
  wholesalePerVial,
} from '@/lib/products-data'
import { recalcPricingRow } from './derive'
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
  await db
    .update(peptidePricing)
    .set({ wholesalePerVial: derived.wholesalePerVial, retailPrice: derived.retailPrice, lastUpdated: new Date() })
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
 * Research current market pricing for every product via the AI Gateway and
 * recompute retail. Falls back to existing data per-product on failure.
 */
export async function refreshAllPricing(): Promise<{ updated: number; status: string; notes: string }> {
  await seedPricing()
  const settings = await getSettings()
  const mode = settings.activeMode as PricingMode
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

      await db
        .insert(peptidePricing)
        .values({
          productSlug: product.slug,
          variantKey: variant.catNo,
          supplierBoxPrice: supplierBoxPrice(variant),
          vialsPerBox: vialsPerBox(variant.spec),
          wholesalePerVial: derived.wholesalePerVial,
          marketLow: match.marketLow,
          marketHigh: match.marketHigh,
          marketAveragePrice: match.marketAverage,
          marketMedian: match.marketMedian,
          numberOfSources: match.numberOfSources,
          confidenceScore: clamp01(match.confidence),
          retailPrice: derived.retailPrice,
          lastUpdated: new Date(),
        })
        .onConflictDoUpdate({
          target: [peptidePricing.productSlug, peptidePricing.variantKey],
          set: {
            marketLow: match.marketLow,
            marketHigh: match.marketHigh,
            marketAveragePrice: match.marketAverage,
            marketMedian: match.marketMedian,
            numberOfSources: match.numberOfSources,
            confidenceScore: clamp01(match.confidence),
            wholesalePerVial: derived.wholesalePerVial,
            retailPrice: derived.retailPrice,
            lastUpdated: new Date(),
          },
        })
      updated++
    }
  }

  const status = failures === 0 ? 'success' : updated > 0 ? 'partial' : 'failed'
  const notes = `${updated} variants updated${failures ? `, ${failures} products failed research` : ''}`
  await db.insert(pricingRefreshLog).values({ productsUpdated: updated, status, notes })
  return { updated, status, notes }
}

export async function getRefreshLog(limit = 5) {
  return db
    .select()
    .from(pricingRefreshLog)
    .orderBy(desc(pricingRefreshLog.ranAt))
    .limit(limit)
}

function normalizeDose(d: string): string {
  return d.toLowerCase().replace(/\s+/g, '')
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}
