import 'server-only'
import { db } from '@/lib/db'
import { productMeta, systemProducts, truStacks, systemNotes } from '@/lib/db/schema'
import type { ProductMetaRow, SystemProductRow, TruStackRow, SystemNoteRow } from '@/lib/db/schema'
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

// Sensible out-of-the-box stacks so systems are useful before any admin curation.
// Admin-created stacks (in the DB) fully replace these defaults for a system.
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

// ---- DB readers (all fail-safe: an empty/unavailable DB yields no overrides) ----

async function readProductMeta(): Promise<Map<string, ProductMetaRow>> {
  try {
    const rows = await db.select().from(productMeta)
    return new Map(rows.map((r) => [r.productSlug, r]))
  } catch {
    return new Map()
  }
}

async function readSystemProducts(): Promise<SystemProductRow[]> {
  try {
    return await db.select().from(systemProducts)
  } catch {
    return []
  }
}

async function readStacks(): Promise<TruStackRow[]> {
  try {
    return await db.select().from(truStacks)
  } catch {
    return []
  }
}

async function readNotes(): Promise<Map<string, SystemNoteRow>> {
  try {
    const rows = await db.select().from(systemNotes)
    return new Map(rows.map((r) => [r.systemSlug, r]))
  } catch {
    return new Map()
  }
}

// ---- Resolution helpers ----

export function resolveProductTags(slug: string, metaMap: Map<string, ProductMetaRow>): Tag[] {
  const override = metaMap.get(slug)?.tags
  const source = override ?? DEFAULT_PRODUCT_TAGS[slug] ?? []
  return source.filter(isTag)
}

function resolveBenefit(product: Product, metaMap: Map<string, ProductMetaRow>): string {
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
  metaMap: Map<string, ProductMetaRow>,
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
  metaMap: Map<string, ProductMetaRow>,
  sysProducts: SystemProductRow[],
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

function resolveStacks(systemSlug: string, stackRows: TruStackRow[]): RecommendedStack[] {
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

// Public: everything the system detail page needs.
export async function getSystemRecommendations(systemSlug: string): Promise<SystemRecommendations> {
  const [metaMap, sysProducts, stackRows, noteMap] = await Promise.all([
    readProductMeta(),
    readSystemProducts(),
    readStacks(),
    readNotes(),
  ])

  return {
    products: rankSystemProducts(systemSlug, metaMap, sysProducts),
    stacks: resolveStacks(systemSlug, stackRows),
    note: noteMap.get(systemSlug)?.note ?? '',
    tags: systemTagsFor(systemSlug),
  }
}

// Public: admin catalog snapshot (products + systems with their overrides).
export async function getAdminCatalog(): Promise<AdminCatalog> {
  const [metaMap, sysProducts, stackRows, noteMap] = await Promise.all([
    readProductMeta(),
    readSystemProducts(),
    readStacks(),
    readNotes(),
  ])

  // Precompute system membership so each product can report its systems.
  const membershipBySystem = new Map<string, Set<string>>()
  for (const system of SYSTEMS) {
    const ranked = rankSystemProducts(system.slug, metaMap, sysProducts)
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
    const overrides = sysProducts.filter((r) => r.systemSlug === s.slug)
    const pinned = overrides
      .filter((r) => r.pinned && r.included)
      .sort((a, b) => a.position - b.position)
      .map((r) => r.productSlug)
    const dbStacks = stackRows
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
