// Canonical, serializable domain types for the storefront data layer.
//
// This module is the single import point for the shapes that flow through the
// data source (see `lib/data/repositories.ts`). Every type here is plain JSON —
// no functions, no React components — so the exact same objects can come from
// bundled local data today or from a real backend over HTTP tomorrow with no
// changes to the pages or components that consume them.
//
// Product / ProductVariant and the recommendation types are re-exported from
// their existing homes so there is one place to import the whole domain from.

import type { IconKey } from '@/lib/icons'

export type { Product, ProductVariant } from '@/lib/products-data'
export type {
  RankedProduct,
  RecommendedStack,
  SystemRecommendations,
} from '@/lib/catalog/types'
export type { Tag } from '@/lib/catalog/tags'

// ---- Systems -------------------------------------------------------------

export type SystemCompound = {
  name: string
  type: string
  price: string
}

export type SystemArticle = {
  title: string
  readTime: string
  category: string
}

export type SystemFaq = {
  question: string
  answer: string
}

export type SystemResearch = {
  title: string
  detail: string
}

export type SystemOverviewPoint = {
  title: string
  detail: string
}

export type System = {
  slug: string
  name: string
  trademark: string
  category: string
  tagline: string
  focusAreas: string[]
  image: string
  /** Serializable icon key resolved via `iconFor` in the UI. */
  iconKey: IconKey
  overview: string
  overviewPoints: SystemOverviewPoint[]
  research: SystemResearch[]
  compounds: SystemCompound[]
  library: SystemArticle[]
  faqs: SystemFaq[]
  related: string[]
}

// ---- Goals ---------------------------------------------------------------

export type GoalSystemRef = {
  name: string
  focus: string
  compounds: string
  price: string
}

export type GoalProductRef = {
  name: string
  type: string
  price: string
}

export type GoalArticle = {
  title: string
  readTime: string
  category: string
}

export type Goal = {
  slug: string
  name: string
  /** Serializable icon key resolved via `iconFor` in the UI. */
  iconKey: IconKey
  tagline: string
  summary: string
  systems: GoalSystemRef[]
  products: GoalProductRef[]
  articles: GoalArticle[]
}
