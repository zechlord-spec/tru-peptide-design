'use client'

// ---------------------------------------------------------------------------
// Catalog admin client — the browser-side boundary for the admin TRU Systems
// curation views (System Curation + Product Tagging).
//
// This REPLACES the former server actions in `app/actions/catalog.ts`. The
// admin UI imports these functions (identical names/signatures to the old
// actions) so no component logic changed — only where the calls go:
//
//   • NEXT_PUBLIC_API_URL set  → HTTP calls to a real catalog backend
//   • otherwise                → reference mode: the pure catalog engine runs
//                                in the browser against the bundled catalog,
//                                with the overlay persisted to localStorage so
//                                the demo is fully interactive without a server.
//
// To connect a real backend, implement the endpoints documented in the HTTP
// section below; nothing in the UI needs to change.
// ---------------------------------------------------------------------------

import {
  adminCatalogFrom,
  createStack,
  deleteStack,
  initialState,
  reorderPins,
  reorderStacks,
  setProductBenefit,
  setProductFeatured,
  setProductTags,
  setSystemNote,
  setSystemPin,
  updateStack,
  type CatalogState,
} from '@/lib/catalog/engine'
import type { AdminCatalog } from '@/lib/catalog/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? ''
const useHttp = Boolean(API_URL)

// ---------------------------------------------------------------------------
// Reference store (localStorage-backed, single source in the browser session)
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'tru.catalog.state.v1'
let memoryState: CatalogState | null = null

function loadState(): CatalogState {
  if (memoryState) return memoryState
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        memoryState = JSON.parse(raw) as CatalogState
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

function persist(state: CatalogState): CatalogState {
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

// ---------------------------------------------------------------------------
// HTTP client — endpoint contract for a real backend at `${API_URL}`.
//
//   GET  /admin/catalog                         → AdminCatalog
//   POST /admin/catalog/product/tags     { slug, tags }                → 204
//   POST /admin/catalog/product/featured { slug, featured }            → 204
//   POST /admin/catalog/product/benefit  { slug, benefit }             → 204
//   POST /admin/catalog/system/pin       { systemSlug, slug, pinned }  → 204
//   POST /admin/catalog/system/pins      { systemSlug, orderedSlugs }  → 204
//   POST /admin/catalog/system/note      { systemSlug, note }          → 204
//   POST /admin/catalog/stack            { systemSlug, title, description, productSlugs } → { id }
//   PATCH /admin/catalog/stack/:id       { title?, description?, productSlugs?, active? }  → 204
//   DELETE /admin/catalog/stack/:id                                    → 204
//   POST /admin/catalog/stacks/reorder   { systemSlug, ids }           → 204
// ---------------------------------------------------------------------------

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return (await res.json()) as T
}

async function apiSend<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body == null ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

// ---------------------------------------------------------------------------
// Public API — mirrors the former server action signatures 1:1
// ---------------------------------------------------------------------------

export async function getAdminCatalogAction(): Promise<AdminCatalog> {
  if (useHttp) return apiGet<AdminCatalog>('/admin/catalog')
  return adminCatalogFrom(loadState())
}

// ---- Product mutations ----

export async function setProductTagsAction(slug: string, tags: string[] | null): Promise<void> {
  if (useHttp) {
    await apiSend('POST', '/admin/catalog/product/tags', { slug, tags })
    return
  }
  persist(setProductTags(loadState(), slug, tags))
}

export async function setProductFeaturedAction(slug: string, featured: boolean): Promise<void> {
  if (useHttp) {
    await apiSend('POST', '/admin/catalog/product/featured', { slug, featured })
    return
  }
  persist(setProductFeatured(loadState(), slug, featured))
}

export async function setProductBenefitAction(slug: string, benefit: string | null): Promise<void> {
  if (useHttp) {
    await apiSend('POST', '/admin/catalog/product/benefit', { slug, benefit })
    return
  }
  persist(setProductBenefit(loadState(), slug, benefit))
}

// ---- System pin mutations ----

export async function setSystemPinAction(
  systemSlug: string,
  slug: string,
  pinned: boolean,
): Promise<void> {
  if (useHttp) {
    await apiSend('POST', '/admin/catalog/system/pin', { systemSlug, slug, pinned })
    return
  }
  persist(setSystemPin(loadState(), systemSlug, slug, pinned))
}

export async function reorderPinsAction(systemSlug: string, orderedSlugs: string[]): Promise<void> {
  if (useHttp) {
    await apiSend('POST', '/admin/catalog/system/pins', { systemSlug, orderedSlugs })
    return
  }
  persist(reorderPins(loadState(), systemSlug, orderedSlugs))
}

// ---- Educational note ----

export async function setSystemNoteAction(systemSlug: string, note: string): Promise<void> {
  if (useHttp) {
    await apiSend('POST', '/admin/catalog/system/note', { systemSlug, note })
    return
  }
  persist(setSystemNote(loadState(), systemSlug, note))
}

// ---- Stack mutations ----

export async function createStackAction(
  systemSlug: string,
  data: { title: string; description?: string; productSlugs: string[] },
): Promise<{ id: number }> {
  if (useHttp) return apiSend<{ id: number }>('POST', '/admin/catalog/stack', { systemSlug, ...data })
  const { state, id } = createStack(loadState(), systemSlug, data)
  persist(state)
  return { id }
}

export async function updateStackAction(
  id: number,
  patch: { title?: string; description?: string; productSlugs?: string[]; active?: boolean },
): Promise<void> {
  if (useHttp) {
    await apiSend('PATCH', `/admin/catalog/stack/${id}`, patch)
    return
  }
  persist(updateStack(loadState(), id, patch))
}

export async function deleteStackAction(id: number): Promise<void> {
  if (useHttp) {
    await apiSend('DELETE', `/admin/catalog/stack/${id}`)
    return
  }
  persist(deleteStack(loadState(), id))
}

export async function reorderStacksAction(systemSlug: string, ids: number[]): Promise<void> {
  if (useHttp) {
    await apiSend('POST', '/admin/catalog/stacks/reorder', { systemSlug, ids })
    return
  }
  persist(reorderStacks(loadState(), systemSlug, ids))
}
