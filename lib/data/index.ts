import 'server-only'

// Data source entry point. Server components and server actions call
// `getDataSource()` and talk to the repository interfaces — never to a concrete
// implementation. This is the single seam where the storefront switches between
// bundled local data and a real backend.
//
// Selection rule:
//   • NEXT_PUBLIC_API_URL (or API_URL) is set  → HTTP adapter (real backend)
//   • otherwise                                → local reference adapter
//
// Because both adapters implement the same `DataSource`, connecting a backend
// requires zero changes to pages or components.

import type { DataSource } from './repositories'
import { localDataSource } from './local'
import { createHttpDataSource } from './http'

let cached: DataSource | null = null

export function getDataSource(): DataSource {
  if (cached) return cached

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL
  cached = apiUrl ? createHttpDataSource(apiUrl) : localDataSource
  return cached
}

export type { DataSource } from './repositories'
export type {
  Goal,
  Product,
  ProductVariant,
  System,
  SystemRecommendations,
} from './types'
