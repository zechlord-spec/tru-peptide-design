'use server'

import { revalidatePath } from 'next/cache'
import type { PricingMode } from '@/lib/db/schema'
import {
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
  const result = await refreshAllPricing()
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
