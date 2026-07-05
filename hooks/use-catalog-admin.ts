'use client'

// Catalog admin hooks — SWR-backed facade over `lib/client/catalog-admin.ts`.
//
// Gives admin components a clean data-fetching surface with a stable cache key,
// while product/system/stack/note mutations stay behind the client boundary
// (reference overlay vs. http backend, chosen by NEXT_PUBLIC_API_URL).

import useSWR from 'swr'
import { getAdminCatalogAction } from '@/lib/client/catalog-admin'

export const CATALOG_KEYS = {
  adminCatalog: 'catalog/admin',
} as const

export function useAdminCatalog() {
  return useSWR(CATALOG_KEYS.adminCatalog, getAdminCatalogAction)
}

// Re-export the mutation actions so components can trigger changes and then
// revalidate `CATALOG_KEYS.adminCatalog`.
export {
  setProductTagsAction,
  setProductFeaturedAction,
  setProductBenefitAction,
  setSystemPinAction,
  reorderPinsAction,
  setSystemNoteAction,
  createStackAction,
  updateStackAction,
  deleteStackAction,
  reorderStacksAction,
} from '@/lib/client/catalog-admin'
