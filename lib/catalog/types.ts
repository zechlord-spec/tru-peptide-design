// Client-safe shared types for the recommendation layer. Kept separate from the
// engine so client components can import the shapes without pulling in the
// server-only data source.
import type { Product } from '@/lib/products-data'
import type { Tag } from './tags'

export type RankedProduct = {
  product: Product
  /** Short, benefit-first summary shown on the recommendation card. */
  benefit: string
  /** The system tags this product matched on (drives membership + ordering). */
  matchedTags: Tag[]
}

export type RecommendedStack = {
  id: string
  title: string
  description: string
  products: Product[]
}

export type SystemRecommendations = {
  products: RankedProduct[]
  stacks: RecommendedStack[]
  /** Optional educational note (empty in reference mode; a backend may supply). */
  note: string
  tags: Tag[]
}
