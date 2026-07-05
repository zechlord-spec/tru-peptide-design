// Repository interfaces — the contract between the storefront and its data.
//
// Pages and server components depend ONLY on these interfaces (via
// `getDataSource()` in `lib/data`), never on a concrete data source. Today the
// interfaces are satisfied by the bundled local reference data
// (`lib/data/local`); wiring a real backend is a matter of pointing
// NEXT_PUBLIC_API_URL at an API that implements the HTTP contract, or dropping
// in a custom `DataSource` implementation. No component changes required.

import type { Goal, Product, System, SystemRecommendations } from './types'

export interface ProductRepository {
  /** All catalog products. */
  list(): Promise<Product[]>
  /** A single product by slug, or null if it does not exist. */
  getBySlug(slug: string): Promise<Product | null>
  /** Products related to the given product (same category / shared goals). */
  getRelated(slug: string, limit?: number): Promise<Product[]>
}

export interface SystemRepository {
  /** All TRU Systems. */
  list(): Promise<System[]>
  /** A single system by slug, or null if it does not exist. */
  getBySlug(slug: string): Promise<System | null>
  /**
   * Ranked products, curated stacks, note and tags for a system's detail page.
   * This includes any admin curation applied on top of the base catalog.
   */
  getRecommendations(slug: string): Promise<SystemRecommendations>
}

export interface GoalRepository {
  /** All discovery goals. */
  list(): Promise<Goal[]>
  /** A single goal by slug, or null if it does not exist. */
  getBySlug(slug: string): Promise<Goal | null>
}

/** The full storefront data surface. */
export interface DataSource {
  products: ProductRepository
  systems: SystemRepository
  goals: GoalRepository
}
