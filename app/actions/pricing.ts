'use server'

import { revalidatePath } from 'next/cache'
import type { PricingMode } from '@/lib/db/schema'
import {
  approveReviewPrice,
  dismissReview,
  getDashboardRows,
  getLatestReport,
  getReports,
  getRefreshLog,
  getReviewQueue,
  getSettings,
  refreshAllPricing,
  setGlobalSalePercent,
  setManualPrice,
  setPricingMode,
  setProductSalePercent,
  updateSupplierCost,
} from '@/lib/pricing/service'

function revalidateStorefront() {
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/products/[slug]', 'page')
  revalidatePath('/admin')
}

export async function refreshPricingAction() {
  const result = await refreshAllPricing('manual')
  revalidateStorefront()
  return result
}

export async function setPricingModeAction(mode: PricingMode) {
  const updated = await setPricingMode(mode)
  revalidateStorefront()
  return { updated }
}

export async function setManualPriceAction(slug: string, variantKey: string, price: number) {
  await setManualPrice(slug, variantKey, price)
  revalidateStorefront()
}

/** Site-wide promotional sale percentage. `percent` is 0..100. */
export async function setGlobalSalePercentAction(percent: number) {
  const updated = await setGlobalSalePercent((percent || 0) / 100)
  revalidateStorefront()
  return { updated }
}

/** Per-product promotional override. `percent` is 0..100, or null to clear. */
export async function setProductSalePercentAction(slug: string, variantKey: string, percent: number | null) {
  await setProductSalePercent(slug, variantKey, percent == null ? null : percent / 100)
  revalidateStorefront()
}

export async function updateSupplierCostAction(
  slug: string,
  variantKey: string,
  supplierBoxPrice: number,
  vialsPerBox: number,
) {
  await updateSupplierCost(slug, variantKey, supplierBoxPrice, vialsPerBox)
  revalidateStorefront()
}

export async function approveReviewAction(slug: string, variantKey: string) {
  await approveReviewPrice(slug, variantKey)
  revalidateStorefront()
}

export async function dismissReviewAction(slug: string, variantKey: string) {
  await dismissReview(slug, variantKey)
  revalidateStorefront()
}

// ---- Read actions (used by admin SWR fetchers) ----

export async function getReviewQueueAction() {
  const rows = await getReviewQueue()
  return { rows }
}

export async function getPricingDashboardAction() {
  const [rows, settings] = await Promise.all([getDashboardRows(), getSettings()])
  return {
    rows,
    activeMode: settings.activeMode as PricingMode,
    markupMultiplier: settings.markupMultiplier,
    salePercentOff: settings.salePercentOff,
    updatedAt: settings.updatedAt.toISOString(),
  }
}

export async function getPricingReportsAction() {
  const [latest, history, log] = await Promise.all([
    getLatestReport(),
    getReports(12),
    getRefreshLog(8),
  ])
  return {
    latest,
    history,
    log: log.map((l) => ({ ...l, ranAt: l.ranAt.toISOString() })),
  }
}
