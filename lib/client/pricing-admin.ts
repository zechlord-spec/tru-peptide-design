'use client'

// ---------------------------------------------------------------------------
// Pricing admin client — the browser-side boundary for the admin Pricing
// Management, Market Intelligence, Review, and Reports views.
//
// This REPLACES the former server actions in `app/actions/pricing.ts`. The
// admin UI imports these functions (identical names/signatures to the old
// actions) so no component logic changed — only where the calls go:
//
//   • NEXT_PUBLIC_API_URL set  → HTTP calls to a real pricing backend
//   • otherwise                → reference mode: the pure pricing engine runs
//                                in the browser against the bundled catalog,
//                                with state persisted to localStorage so the
//                                demo is fully interactive without a server.
//
// To connect a real backend, implement the endpoints documented in
// `httpClient` below; nothing in the UI needs to change.
// ---------------------------------------------------------------------------

import {
  approveReview,
  dashboardRowsFrom,
  dismissReview,
  initialState,
  refresh,
  reviewQueueFrom,
  setGlobalSalePercent,
  setManualPrice,
  setMode,
  setProductSalePercent,
  updateSupplierCost,
  type PricingState,
} from '@/lib/pricing/engine'
import type {
  DashboardRow,
  PricingDashboard,
  PricingMode,
  PricingReport,
  PricingReportsView,
} from '@/lib/pricing/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? ''

// ---------------------------------------------------------------------------
// Reference store (localStorage-backed, single source in the browser session)
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'tru.pricing.state.v1'
let memoryState: PricingState | null = null

function loadState(): PricingState {
  if (memoryState) return memoryState
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        memoryState = JSON.parse(raw) as PricingState
        return memoryState
      }
    } catch {
      /* fall through to a fresh seed */
    }
  }
  memoryState = initialState()
  persist(memoryState)
  return memoryState
}

function persist(state: PricingState): PricingState {
  memoryState = state
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }
  return state
}

function toDashboard(state: PricingState): PricingDashboard {
  return {
    rows: dashboardRowsFrom(state),
    activeMode: state.settings.activeMode,
    markupMultiplier: state.settings.markupMultiplier,
    salePercentOff: state.settings.salePercentOff,
    updatedAt: state.settings.updatedAt,
  }
}

function toReportsView(state: PricingState): PricingReportsView {
  return {
    latest: state.reports[0] ?? null,
    history: state.reports.slice(0, 12),
    log: state.log.slice(0, 8),
  }
}

// ---------------------------------------------------------------------------
// HTTP client — endpoint contract for a real backend at `${API_URL}`.
//
//   GET  /admin/pricing/dashboard      → PricingDashboard
//   GET  /admin/pricing/reports        → PricingReportsView
//   GET  /admin/pricing/review-queue   → { rows: DashboardRow[] }
//   POST /admin/pricing/refresh        → PricingReport
//   POST /admin/pricing/mode           { mode }                       → { updated }
//   POST /admin/pricing/global-sale    { percent }  (0..100)          → { updated }
//   POST /admin/pricing/manual-price   { slug, variantKey, price }    → 204
//   POST /admin/pricing/product-sale   { slug, variantKey, percent }  → 204
//   POST /admin/pricing/supplier-cost  { slug, variantKey, supplierBoxPrice, vialsPerBox } → 204
//   POST /admin/pricing/review/approve { slug, variantKey }           → 204
//   POST /admin/pricing/review/dismiss { slug, variantKey }           → 204
// ---------------------------------------------------------------------------

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return (await res.json()) as T
}

async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body == null ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

const useHttp = Boolean(API_URL)

// ---------------------------------------------------------------------------
// Public API — mirrors the former server action signatures 1:1
// ---------------------------------------------------------------------------

export async function getPricingDashboardAction(): Promise<PricingDashboard> {
  if (useHttp) return apiGet<PricingDashboard>('/admin/pricing/dashboard')
  return toDashboard(loadState())
}

export async function getPricingReportsAction(): Promise<PricingReportsView> {
  if (useHttp) return apiGet<PricingReportsView>('/admin/pricing/reports')
  return toReportsView(loadState())
}

export async function getReviewQueueAction(): Promise<{ rows: DashboardRow[] }> {
  if (useHttp) return apiGet<{ rows: DashboardRow[] }>('/admin/pricing/review-queue')
  return { rows: reviewQueueFrom(loadState()) }
}

export async function refreshPricingAction(): Promise<PricingReport> {
  if (useHttp) return apiPost<PricingReport>('/admin/pricing/refresh')
  const { state, report } = refresh(loadState(), 'manual')
  persist(state)
  return report
}

export async function setPricingModeAction(mode: PricingMode): Promise<{ updated: boolean }> {
  if (useHttp) return apiPost<{ updated: boolean }>('/admin/pricing/mode', { mode })
  persist(setMode(loadState(), mode))
  return { updated: true }
}

/** Site-wide promotional sale percentage. `percent` is 0..100. */
export async function setGlobalSalePercentAction(percent: number): Promise<{ updated: boolean }> {
  if (useHttp) return apiPost<{ updated: boolean }>('/admin/pricing/global-sale', { percent })
  persist(setGlobalSalePercent(loadState(), (percent || 0) / 100))
  return { updated: true }
}

export async function setManualPriceAction(
  slug: string,
  variantKey: string,
  price: number,
): Promise<void> {
  if (useHttp) {
    await apiPost('/admin/pricing/manual-price', { slug, variantKey, price })
    return
  }
  persist(setManualPrice(loadState(), slug, variantKey, price))
}

/** Per-product promotional override. `percent` is 0..100, or null to clear. */
export async function setProductSalePercentAction(
  slug: string,
  variantKey: string,
  percent: number | null,
): Promise<void> {
  if (useHttp) {
    await apiPost('/admin/pricing/product-sale', { slug, variantKey, percent })
    return
  }
  persist(setProductSalePercent(loadState(), slug, variantKey, percent == null ? null : percent / 100))
}

export async function updateSupplierCostAction(
  slug: string,
  variantKey: string,
  supplierBoxPrice: number,
  vialsPerBox: number,
): Promise<void> {
  if (useHttp) {
    await apiPost('/admin/pricing/supplier-cost', { slug, variantKey, supplierBoxPrice, vialsPerBox })
    return
  }
  persist(updateSupplierCost(loadState(), slug, variantKey, supplierBoxPrice, vialsPerBox))
}

export async function approveReviewAction(slug: string, variantKey: string): Promise<void> {
  if (useHttp) {
    await apiPost('/admin/pricing/review/approve', { slug, variantKey })
    return
  }
  persist(approveReview(loadState(), slug, variantKey))
}

export async function dismissReviewAction(slug: string, variantKey: string): Promise<void> {
  if (useHttp) {
    await apiPost('/admin/pricing/review/dismiss', { slug, variantKey })
    return
  }
  persist(dismissReview(loadState(), slug, variantKey))
}
