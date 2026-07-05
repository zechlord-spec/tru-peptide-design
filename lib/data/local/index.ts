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
import { getSystemRecommendations } from '@/lib/catalog/engine'
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
      // Reference recommendations computed from the bundled catalog and tag
      // taxonomy. A real backend can return curated recommendations through the
      // HTTP adapter.
      return getSystemRecommendations(slug)
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
      // Retail prices are owned by the backend, not the frontend. In reference
      // mode there is no price source, so the snapshot is empty: the storefront
      // renders neutral price placeholders and disables add-to-cart until a
      // backend supplies live prices through the HTTP adapter
      // (GET /pricing/snapshot → { [catNo]: number }).
      return {}
    },
  },
}
