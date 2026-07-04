'use server'

import { revalidatePath } from 'next/cache'
import type { PricingMode } from '@/lib/db/schema'
import {
  getDashboardRows,
  getLatestReport,
  getReports,
  getRefreshLog,
  getSettings,
  refreshAllPricing,
  setManualPrice,
  setPricingMode,
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

export async function updateSupplierCostAction(
  slug: string,
  variantKey: string,
  supplierBoxPrice: number,
  vialsPerBox: number,
) {
  await updateSupplierCost(slug, variantKey, supplierBoxPrice, vialsPerBox)
  revalidateStorefront()
}

// ---- Read actions (used by admin SWR fetchers) ----

export async function getPricingDashboardAction() {
  const [rows, settings] = await Promise.all([getDashboardRows(), getSettings()])
  return {
    rows,
    activeMode: settings.activeMode as PricingMode,
    markupMultiplier: settings.markupMultiplier,
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
