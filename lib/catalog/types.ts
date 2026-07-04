// Client-safe shared types for the recommendation engine. Kept separate from
// the server-only engine so client components can import the types without
// pulling in database code.
import type { Product } from '@/lib/products-data'
import type { Tag } from './tags'

export type RankedProduct = {
  product: Product
  rating: number
  reviewCount: number
  bestSeller: boolean
  featured: boolean
  pinned: boolean
  benefit: string
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
  note: string
  tags: Tag[]
}

// Admin payloads
export type AdminProduct = {
  slug: string
  name: string
  category: string
  tags: Tag[]
  usingDefaultTags: boolean
  featured: boolean
  benefit: string
  systems: string[] // system slugs this product currently appears in
}

export type AdminSystem = {
  slug: string
  name: string
  trademark: string
  tags: Tag[]
  note: string
  memberSlugs: string[]
  pinnedSlugs: string[]
  stacks: {
    id: number
    title: string
    description: string
    productSlugs: string[]
    position: number
    active: boolean
  }[]
}

export type AdminCatalog = {
  products: AdminProduct[]
  systems: AdminSystem[]
}
