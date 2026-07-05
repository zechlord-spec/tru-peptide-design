// ---------------------------------------------------------------------------
// Reference catalog engine — PURE and framework-free.
//
// This is the in-memory equivalent of the former DB-backed recommendation
// engine (`recommendations.ts` + `admin-service.ts`). It operates on a
// serializable `CatalogState` overlay instead of a database, so it runs
// anywhere: on the server (to produce system recommendations for the
// storefront) and in the browser (to power the admin TRU Systems curation demo
// on reference data).
//
// It has NO side effects — every mutation returns a new state. Persistence
// (localStorage in the reference client) and transport (HTTP to a real backend)
// live in the adapter layer, not here.
//
// The overlay is layered on top of the code-level defaults in `lib/products-
// data`, `lib/systems-data`, and the tag taxonomy. An empty overlay is fully
// valid — the engine falls back to defaults so the storefront always renders.
// ---------------------------------------------------------------------------

import { PRODUCTS, getProduct, type Product } from '@/lib/products-data'
import { SYSTEMS } from '@/lib/systems-data'
import { getProductMetrics } from './product-metrics'
import {
  DEFAULT_PRODUCT_TAGS,
  DEFAULT_SYSTEM_TAGS,
  PRODUCT_BENEFIT,
  isTag,
  type Tag,
} from './tags'
import type {
  AdminCatalog,
  AdminProduct,
  AdminSystem,
  RankedProduct,
  RecommendedStack,
  SystemRecommendations,
} from './types'

// ---------------------------------------------------------------------------
// Serializable overlay rows (plain JSON — the reference "database")
// ---------------------------------------------------------------------------

/** Per-product metadata override. `tags` (when non-null) fully replaces the
 * code default tag set for that product. `featured` boosts ranking everywhere. */
export type ProductMetaOverlay = {
  productSlug: string
  tags: string[] | null
  featured: boolean
  benefit: string | null
}

/** Per-(system, product) overlay: force-include/exclude, pin, and order. */
export type SystemProductOverlay = {
  systemSlug: string
  productSlug: string
  included: boolean
  pinned: boolean
  position: number
}

/** Admin-curated "Recommended Stack". */
export type StackOverlay = {
  id: number
  systemSlug: string
  title: string
  description: string
  productSlugs: string[]
  position: number
  active: boolean
}

/** Optional educational note per system. */
export type SystemNoteOverlay = {
  systemSlug: string
  note: string
}

/** The full serializable catalog overlay state (the reference "database"). */
export type CatalogState = {
  productMeta: ProductMetaOverlay[]
  systemProducts: SystemProductOverlay[]
  stacks: StackOverlay[]
  notes: SystemNoteOverlay[]
  stackSeq: number
}

/** An empty overlay — the engine falls back entirely to code-level defaults. */
export function initialState(): CatalogState {
  return { productMeta: [], systemProducts: [], stacks: [], notes: [], stackSeq: 0 }
}

// ---------------------------------------------------------------------------
// Sensible out-of-the-box stacks so systems are useful before any curation.
// Admin-created stacks (in the overlay) fully replace these for a system.
// ---------------------------------------------------------------------------

const DEFAULT_STACKS: Record<string, { title: string; description: string; slugs: string[] }[]> = {
  'tru-klow': [
    {
      title: 'Weight Management Stack',
      description: 'A metabolic trio studied for appetite control, energy, and fat metabolism.',
      slugs: ['tirzepatide', 'mots-c', '5-amino-1mq'],
    },
  ],
  'tru-recover': [
    {
      title: 'Recovery Stack',
      description: 'Foundational repair peptides studied for soft-tissue and gut recovery.',
      slugs: ['bpc-157', 'tb-500', 'kpv'],
    },
  ],
  'tru-longevity': [
    {
      title: 'Longevity Stack',
      description: 'Cellular-aging support studied for telomeres, mitochondria, and energy.',
      slugs: ['epithalon', 'nad-plus', 'mots-c'],
    },
  ],
  'tru-perform': [
    {
      title: 'Performance Stack',
      description: 'GH-axis and growth-factor support studied for strength and recovery.',
      slugs: ['cjc-1295-no-dac', 'ipamorelin', 'igf-1-lr3'],
    },
  ],
  'tru-glow': [
    {
      title: 'Radiance Stack',
      description: 'Skin and antioxidant support studied for collagen and cellular renewal.',
      slugs: ['ghk-cu', 'glutathione', 'nad-plus'],
    },
  ],
  'tru-focus': [
    {
      title: 'Clarity Stack',
      description: 'Nootropic and calming peptides studied for focus and mental resilience.',
      slugs: ['semax', 'selank', 'nad-plus'],
    },
  ],
  'tru-vital': [
    {
      title: 'Vitality Stack',
      description: 'Central and hormonal signalers studied for libido and endocrine balance.',
      slugs: ['pt-141', 'kisspeptin-10'],
    },
  ],
  'tru-rest': [
    {
      title: 'Deep Rest Stack',
      description: 'Sleep and stress peptides studied for restorative rest.',
      slugs: ['dsip', 'selank', 'epithalon'],
    },
  ],
  'tru-defense': [
    {
      title: 'Immune Stack',
      description: 'Thymic and antioxidant support studied for balanced immunity.',
      slugs: ['thymosin-alpha-1', 'glutathione', 'kpv'],
    },
  ],
}

// ---------------------------------------------------------------------------
// Overlay indexing
// ---------------------------------------------------------------------------

function metaMapOf(state: CatalogState): Map<string, ProductMetaOverlay> {
  return new Map(state.productMeta.map((r) => [r.productSlug, r]))
}

function noteMapOf(state: CatalogState): Map<string, SystemNoteOverlay> {
  return new Map(state.notes.map((r) => [r.systemSlug, r]))
}

// ---------------------------------------------------------------------------
// Resolution helpers
// ---------------------------------------------------------------------------

export function resolveProductTags(
  slug: string,
  metaMap: Map<string, ProductMetaOverlay>,
): Tag[] {
  const override = metaMap.get(slug)?.tags
  const source = override ?? DEFAULT_PRODUCT_TAGS[slug] ?? []
  return source.filter(isTag)
}

function resolveBenefit(product: Product, metaMap: Map<string, ProductMetaOverlay>): string {
  const override = metaMap.get(product.slug)?.benefit
  if (override && override.trim()) return override.trim()
  return PRODUCT_BENEFIT[product.slug] ?? product.blurb
}

export function systemTagsFor(systemSlug: string): Tag[] {
  return DEFAULT_SYSTEM_TAGS[systemSlug] ?? []
}

// Weighted ranking. Priority (high -> low):
// pinned -> featured -> best seller -> rating -> reviews -> new arrival -> alphabetical
function compareRanked(a: RankedProduct, b: RankedProduct, pinPos: Map<string, number>): number {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
  if (a.pinned && b.pinned) {
    const pa = pinPos.get(a.product.slug) ?? 0
    const pb = pinPos.get(b.product.slug) ?? 0
    if (pa !== pb) return pa - pb
  }
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  if (a.bestSeller !== b.bestSeller) return a.bestSeller ? -1 : 1
  if (a.rating !== b.rating) return b.rating - a.rating
  if (a.reviewCount !== b.reviewCount) return b.reviewCount - a.reviewCount
  const aNew = a.product.isNew ? 1 : 0
  const bNew = b.product.isNew ? 1 : 0
  if (aNew !== bNew) return bNew - aNew
  return a.product.name.localeCompare(b.product.name)
}

function buildRanked(
  product: Product,
  matchedTags: Tag[],
  metaMap: Map<string, ProductMetaOverlay>,
  pinnedSet: Set<string>,
): RankedProduct {
  const metrics = getProductMetrics(product.slug)
  return {
    product,
    rating: metrics.rating,
    reviewCount: metrics.reviewCount,
    bestSeller: metrics.bestSeller,
    featured: metaMap.get(product.slug)?.featured ?? false,
    pinned: pinnedSet.has(product.slug),
    benefit: resolveBenefit(product, metaMap),
    matchedTags,
  }
}

// Core: which products belong to a system, ranked.
function rankSystemProducts(
  systemSlug: string,
  metaMap: Map<string, ProductMetaOverlay>,
  sysProducts: SystemProductOverlay[],
): RankedProduct[] {
  const systemTags = systemTagsFor(systemSlug)
  const overrides = sysProducts.filter((r) => r.systemSlug === systemSlug)
  const excluded = new Set(overrides.filter((r) => !r.included).map((r) => r.productSlug))
  const forcedIn = new Set(overrides.filter((r) => r.included).map((r) => r.productSlug))
  const pinnedSet = new Set(overrides.filter((r) => r.pinned && r.included).map((r) => r.productSlug))
  const pinPos = new Map(overrides.filter((r) => r.pinned).map((r) => [r.productSlug, r.position]))

  const ranked: RankedProduct[] = []
  for (const product of PRODUCTS) {
    if (excluded.has(product.slug)) continue
    const tags = resolveProductTags(product.slug, metaMap)
    const matched = tags.filter((t) => systemTags.includes(t))
    const isMember = matched.length > 0 || forcedIn.has(product.slug)
    if (!isMember) continue
    ranked.push(buildRanked(product, matched, metaMap, pinnedSet))
  }
  ranked.sort((a, b) => compareRanked(a, b, pinPos))
  return ranked
}

function resolveStacks(systemSlug: string, stackRows: StackOverlay[]): RecommendedStack[] {
  const dbStacks = stackRows
    .filter((r) => r.systemSlug === systemSlug && r.active)
    .sort((a, b) => a.position - b.position)

  const source =
    dbStacks.length > 0
      ? dbStacks.map((r) => ({
          id: `db-${r.id}`,
          title: r.title,
          description: r.description ?? '',
          slugs: r.productSlugs,
        }))
      : (DEFAULT_STACKS[systemSlug] ?? []).map((s, i) => ({
          id: `default-${systemSlug}-${i}`,
          title: s.title,
          description: s.description,
          slugs: s.slugs,
        }))

  return source
    .map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      products: s.slugs.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p)),
    }))
    .filter((s) => s.products.length > 0)
}

// ---------------------------------------------------------------------------
// Read projections
// ---------------------------------------------------------------------------

/** Everything a system detail page needs (ranked products, stacks, note, tags). */
export function systemRecommendationsFrom(
  state: CatalogState,
  systemSlug: string,
): SystemRecommendations {
  const metaMap = metaMapOf(state)
  const noteMap = noteMapOf(state)
  return {
    products: rankSystemProducts(systemSlug, metaMap, state.systemProducts),
    stacks: resolveStacks(systemSlug, state.stacks),
    note: noteMap.get(systemSlug)?.note ?? '',
    tags: systemTagsFor(systemSlug),
  }
}

/** Admin catalog snapshot (products + systems with their overrides). */
export function adminCatalogFrom(state: CatalogState): AdminCatalog {
  const metaMap = metaMapOf(state)
  const noteMap = noteMapOf(state)

  // Precompute system membership so each product can report its systems.
  const membershipBySystem = new Map<string, Set<string>>()
  for (const system of SYSTEMS) {
    const ranked = rankSystemProducts(system.slug, metaMap, state.systemProducts)
    membershipBySystem.set(system.slug, new Set(ranked.map((r) => r.product.slug)))
  }

  const products: AdminProduct[] = PRODUCTS.map((p) => {
    const meta = metaMap.get(p.slug)
    const usingDefaultTags = !meta?.tags
    const systems = SYSTEMS.filter((s) => membershipBySystem.get(s.slug)?.has(p.slug)).map(
      (s) => s.slug,
    )
    return {
      slug: p.slug,
      name: p.name,
      category: p.category,
      tags: resolveProductTags(p.slug, metaMap),
      usingDefaultTags,
      featured: meta?.featured ?? false,
      benefit: resolveBenefit(p, metaMap),
      systems,
    }
  })

  const systems: AdminSystem[] = SYSTEMS.map((s) => {
    const overrides = state.systemProducts.filter((r) => r.systemSlug === s.slug)
    const pinned = overrides
      .filter((r) => r.pinned && r.included)
      .sort((a, b) => a.position - b.position)
      .map((r) => r.productSlug)
    const dbStacks = state.stacks
      .filter((r) => r.systemSlug === s.slug)
      .sort((a, b) => a.position - b.position)
      .map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description ?? '',
        productSlugs: r.productSlugs,
        position: r.position,
        active: r.active,
      }))
    return {
      slug: s.slug,
      name: s.name,
      trademark: s.trademark,
      tags: systemTagsFor(s.slug),
      note: noteMap.get(s.slug)?.note ?? '',
      memberSlugs: Array.from(membershipBySystem.get(s.slug) ?? []),
      pinnedSlugs: pinned,
      stacks: dbStacks,
    }
  })

  return { products, systems }
}

// ---------------------------------------------------------------------------
// Mutations (each returns a new state)
// ---------------------------------------------------------------------------

/** Upsert a product-meta overlay row, patching only the provided fields. */
function upsertMeta(
  state: CatalogState,
  slug: string,
  patch: Partial<Omit<ProductMetaOverlay, 'productSlug'>>,
): CatalogState {
  const existing = state.productMeta.find((r) => r.productSlug === slug)
  const base: ProductMetaOverlay = existing ?? {
    productSlug: slug,
    tags: null,
    featured: false,
    benefit: null,
  }
  const next = { ...base, ...patch }
  const productMeta = existing
    ? state.productMeta.map((r) => (r.productSlug === slug ? next : r))
    : [...state.productMeta, next]
  return { ...state, productMeta }
}

export function setProductTags(state: CatalogState, slug: string, tags: string[] | null): CatalogState {
  const clean = tags ? Array.from(new Set(tags.filter(isTag))) : null
  return upsertMeta(state, slug, { tags: clean })
}

export function setProductFeatured(state: CatalogState, slug: string, featured: boolean): CatalogState {
  return upsertMeta(state, slug, { featured })
}

export function setProductBenefit(state: CatalogState, slug: string, benefit: string | null): CatalogState {
  const value = benefit && benefit.trim() ? benefit.trim() : null
  return upsertMeta(state, slug, { benefit: value })
}

/** Upsert a (system, product) overlay row, patching only the provided fields. */
function upsertSystemProduct(
  state: CatalogState,
  systemSlug: string,
  productSlug: string,
  patch: Partial<Omit<SystemProductOverlay, 'systemSlug' | 'productSlug'>>,
): CatalogState {
  const existing = state.systemProducts.find(
    (r) => r.systemSlug === systemSlug && r.productSlug === productSlug,
  )
  const base: SystemProductOverlay = existing ?? {
    systemSlug,
    productSlug,
    included: true,
    pinned: false,
    position: 0,
  }
  const next = { ...base, ...patch }
  const systemProducts = existing
    ? state.systemProducts.map((r) =>
        r.systemSlug === systemSlug && r.productSlug === productSlug ? next : r,
      )
    : [...state.systemProducts, next]
  return { ...state, systemProducts }
}

export function setSystemPin(
  state: CatalogState,
  systemSlug: string,
  slug: string,
  pinned: boolean,
): CatalogState {
  // When pinning, place it after the current max position.
  let position = 0
  if (pinned) {
    const max = state.systemProducts
      .filter((r) => r.systemSlug === systemSlug)
      .reduce((m, r) => Math.max(m, r.position), 0)
    position = max + 1
  }
  return upsertSystemProduct(state, systemSlug, slug, { pinned, included: true, position })
}

export function reorderPins(
  state: CatalogState,
  systemSlug: string,
  orderedSlugs: string[],
): CatalogState {
  let next = state
  orderedSlugs.forEach((slug, index) => {
    next = upsertSystemProduct(next, systemSlug, slug, {
      pinned: true,
      included: true,
      position: index + 1,
    })
  })
  return next
}

export function setSystemNote(state: CatalogState, systemSlug: string, note: string): CatalogState {
  const existing = state.notes.find((r) => r.systemSlug === systemSlug)
  const notes = existing
    ? state.notes.map((r) => (r.systemSlug === systemSlug ? { systemSlug, note } : r))
    : [...state.notes, { systemSlug, note }]
  return { ...state, notes }
}

export function createStack(
  state: CatalogState,
  systemSlug: string,
  data: { title: string; description?: string; productSlugs: string[] },
): { state: CatalogState; id: number } {
  const max = state.stacks
    .filter((r) => r.systemSlug === systemSlug)
    .reduce((m, r) => Math.max(m, r.position), 0)
  const id = state.stackSeq + 1
  const row: StackOverlay = {
    id,
    systemSlug,
    title: data.title,
    description: data.description ?? '',
    productSlugs: data.productSlugs,
    position: max + 1,
    active: true,
  }
  return { state: { ...state, stacks: [...state.stacks, row], stackSeq: id }, id }
}

export function updateStack(
  state: CatalogState,
  id: number,
  patch: { title?: string; description?: string; productSlugs?: string[]; active?: boolean },
): CatalogState {
  return {
    ...state,
    stacks: state.stacks.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  }
}

export function deleteStack(state: CatalogState, id: number): CatalogState {
  return { ...state, stacks: state.stacks.filter((r) => r.id !== id) }
}

export function reorderStacks(state: CatalogState, systemSlug: string, ids: number[]): CatalogState {
  const posById = new Map(ids.map((id, index) => [id, index + 1]))
  return {
    ...state,
    stacks: state.stacks.map((r) =>
      r.systemSlug === systemSlug && posById.has(r.id)
        ? { ...r, position: posById.get(r.id)! }
        : r,
    ),
  }
}
