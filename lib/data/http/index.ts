import 'server-only'

// HTTP data source. A fetch-based adapter that satisfies the repository
// interfaces by calling a real backend. It is selected automatically when
// NEXT_PUBLIC_API_URL is set (see lib/data). Because the domain types are plain
// JSON (icons are string keys, prices are numbers), responses map directly onto
// the storefront types with no transformation.
//
// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT CONTRACT — implement these on the backend at `${baseUrl}`.
// All responses are JSON and must match the shapes in `lib/data/types.ts`.
//
//   GET  /products
//        → Product[]
//   GET  /products/:slug
//        → Product            (404 if not found)
//   GET  /products/:slug/related?limit=3
//        → Product[]
//   GET  /systems
//        → System[]           (each `iconKey` must be a key from lib/icons)
//   GET  /systems/:slug
//        → System             (404 if not found)
//   GET  /systems/:slug/recommendations
//        → SystemRecommendations
//   GET  /goals
//        → Goal[]             (each `iconKey` must be a key from lib/icons)
//   GET  /goals/:slug
//        → Goal               (404 if not found)
//   GET  /pricing/snapshot
//        → RetailSnapshot     ({ [catNo: string]: number } — per-vial USD)
//
// If your backend differs, adapt the paths below — this file is the only place
// that knows about the wire format.
// ─────────────────────────────────────────────────────────────────────────────

import type { DataSource } from '../repositories'
import type { Goal, Product, System, SystemRecommendations } from '../types'
import type { RetailSnapshot } from '@/lib/pricing/format'

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export function createHttpDataSource(baseUrl: string): DataSource {
  const base = baseUrl.replace(/\/$/, '')

  async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${base}${path}`, {
      headers: { accept: 'application/json' },
      // Revalidate periodically; adjust per your backend's freshness needs.
      next: { revalidate: 60 },
    })
    if (!res.ok) {
      throw new HttpError(res.status, `GET ${path} failed with ${res.status}`)
    }
    return (await res.json()) as T
  }

  // Returns null on 404 so `getBySlug` can signal "not found" cleanly.
  async function getOrNull<T>(path: string): Promise<T | null> {
    try {
      return await get<T>(path)
    } catch (err) {
      if (err instanceof HttpError && err.status === 404) return null
      throw err
    }
  }

  return {
    products: {
      list() {
        return get<Product[]>('/products')
      },
      getBySlug(slug) {
        return getOrNull<Product>(`/products/${encodeURIComponent(slug)}`)
      },
      getRelated(slug, limit = 3) {
        return get<Product[]>(
          `/products/${encodeURIComponent(slug)}/related?limit=${limit}`,
        )
      },
    },
    systems: {
      list() {
        return get<System[]>('/systems')
      },
      getBySlug(slug) {
        return getOrNull<System>(`/systems/${encodeURIComponent(slug)}`)
      },
      getRecommendations(slug) {
        return get<SystemRecommendations>(
          `/systems/${encodeURIComponent(slug)}/recommendations`,
        )
      },
    },
    goals: {
      list() {
        return get<Goal[]>('/goals')
      },
      getBySlug(slug) {
        return getOrNull<Goal>(`/goals/${encodeURIComponent(slug)}`)
      },
    },
    pricing: {
      getRetailSnapshot() {
        return get<RetailSnapshot>('/pricing/snapshot')
      },
    },
  }
}
