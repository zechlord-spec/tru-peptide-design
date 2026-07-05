import 'server-only'

// Local reference data source. This is the isolated adapter that satisfies the
// repository interfaces using the catalog bundled in the repo
// (lib/products-data, lib/systems-data, lib/goals-data) plus the tag-driven
// recommendation engine. It is used automatically whenever no backend is
// configured, so the storefront always renders for review. The instant a real
// backend is connected (see lib/data/http), this adapter is bypassed and no
// component changes are needed.

import { PRODUCTS, getProduct, getRelatedProducts } from '@/lib/products-data'
import { SYSTEMS, getSystem } from '@/lib/systems-data'
import { GOALS } from '@/lib/goals-data'
import { initialState, systemRecommendationsFrom } from '@/lib/catalog/engine'
import { defaultSnapshot } from '@/lib/pricing/engine'
import type { DataSource } from '../repositories'

export const localDataSource: DataSource = {
  products: {
    async list() {
      return PRODUCTS
    },
    async getBySlug(slug) {
      return getProduct(slug) ?? null
    },
    async getRelated(slug, limit) {
      const product = getProduct(slug)
      return product ? getRelatedProducts(product, limit) : []
    },
  },
  systems: {
    async list() {
      return SYSTEMS
    },
    async getBySlug(slug) {
      return getSystem(slug) ?? null
    },
    async getRecommendations(slug) {
      // Reference recommendations computed from the bundled catalog via the pure
      // engine with an empty overlay (code-level defaults). A real backend
      // returns admin-curated recommendations through the HTTP adapter.
      return systemRecommendationsFrom(initialState(), slug)
    },
  },
  goals: {
    async list() {
      return GOALS
    },
    async getBySlug(slug) {
      return GOALS.find((goal) => goal.slug === slug) ?? null
    },
  },
  pricing: {
    async getRetailSnapshot() {
      // Reference retail prices derived from the bundled catalog via the pure
      // pricing engine (default Smart Dynamic markup). A real backend replaces
      // this with its live prices through the HTTP adapter.
      return defaultSnapshot()
    },
  },
}
