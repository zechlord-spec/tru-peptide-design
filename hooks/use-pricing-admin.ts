'use client'

// Pricing admin hooks — SWR-backed facade over `lib/client/pricing-admin.ts`.
//
// These give admin components a clean data-fetching surface with cache keys and
// a `refresh()` mutator, while all business logic stays behind the client
// boundary (reference engine vs. http backend, chosen by NEXT_PUBLIC_API_URL).

import useSWR from 'swr'
import {
  getPricingDashboardAction,
  getPricingReportsAction,
  getReviewQueueAction,
} from '@/lib/client/pricing-admin'

export const PRICING_KEYS = {
  dashboard: 'pricing/dashboard',
  reports: 'pricing/reports',
  reviewQueue: 'pricing/review-queue',
} as const

export function usePricingDashboard() {
  return useSWR(PRICING_KEYS.dashboard, getPricingDashboardAction)
}

export function usePricingReports() {
  return useSWR(PRICING_KEYS.reports, getPricingReportsAction)
}

export function usePricingReviewQueue() {
  return useSWR(PRICING_KEYS.reviewQueue, getReviewQueueAction)
}

// Re-export the mutation actions so components can trigger changes and then
// revalidate the keys above (e.g. `mutate(PRICING_KEYS.dashboard)`).
export {
  refreshPricingAction,
  setPricingModeAction,
  setGlobalSalePercentAction,
  setManualPriceAction,
  setProductSalePercentAction,
  updateSupplierCostAction,
  approveReviewAction,
  dismissReviewAction,
} from '@/lib/client/pricing-admin'
