// ---------------------------------------------------------------------------
// Reference catalog recommendations — PURE and framework-free.
//
// Given a system slug, this returns the products that belong to it (matched by
// the shared tag taxonomy) plus a few curated "Recommended Stacks". It reads
// only the bundled static catalog (`lib/products-data`) and the tag rules in
// `./tags` — there is no database, no admin overlay, and no fabricated metrics.
//
// A real backend can return richer, curated recommendations through the HTTP
// adapter (`lib/data/http`); this pure helper is what the local reference data
// source uses so the storefront always renders.
// ---------------------------------------------------------------------------

import { PRODUCTS, getProduct, type Product } from '@/lib/products-data'
import {
  DEFAULT_PRODUCT_TAGS,
  DEFAULT_SYSTEM_TAGS,
  PRODUCT_BENEFIT,
  isTag,
  type Tag,
} from './tags'
import type { RankedProduct, RecommendedStack, SystemRecommendations } from './types'

// ---------------------------------------------------------------------------
// Curated out-of-the-box stacks so systems are useful for browsing. These are
// authored static content — a real backend can override them per system.
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
// Resolution helpers
// ---------------------------------------------------------------------------

function resolveProductTags(slug: string): Tag[] {
  return (DEFAULT_PRODUCT_TAGS[slug] ?? []).filter(isTag)
}

function resolveBenefit(product: Product): string {
  return PRODUCT_BENEFIT[product.slug] ?? product.blurb
}

export function systemTagsFor(systemSlug: string): Tag[] {
  return DEFAULT_SYSTEM_TAGS[systemSlug] ?? []
}

// Deterministic ordering: more tag matches first, then new arrivals, then A–Z.
function compareRanked(a: RankedProduct, b: RankedProduct): number {
  if (a.matchedTags.length !== b.matchedTags.length) {
    return b.matchedTags.length - a.matchedTags.length
  }
  const aNew = a.product.isNew ? 1 : 0
  const bNew = b.product.isNew ? 1 : 0
  if (aNew !== bNew) return bNew - aNew
  return a.product.name.localeCompare(b.product.name)
}

// Which products belong to a system, ranked. A product is a member when it
// shares at least one tag with the system.
function rankSystemProducts(systemSlug: string): RankedProduct[] {
  const systemTags = systemTagsFor(systemSlug)
  const ranked: RankedProduct[] = []
  for (const product of PRODUCTS) {
    const matched = resolveProductTags(product.slug).filter((t) => systemTags.includes(t))
    if (matched.length === 0) continue
    ranked.push({
      product,
      benefit: resolveBenefit(product),
      matchedTags: matched,
    })
  }
  ranked.sort(compareRanked)
  return ranked
}

function resolveStacks(systemSlug: string): RecommendedStack[] {
  return (DEFAULT_STACKS[systemSlug] ?? [])
    .map((s, i) => ({
      id: `default-${systemSlug}-${i}`,
      title: s.title,
      description: s.description,
      products: s.slugs.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p)),
    }))
    .filter((s) => s.products.length > 0)
}

// ---------------------------------------------------------------------------
// Read projection
// ---------------------------------------------------------------------------

/** Everything a system detail page needs: matched products, stacks, and tags. */
export function getSystemRecommendations(systemSlug: string): SystemRecommendations {
  return {
    products: rankSystemProducts(systemSlug),
    stacks: resolveStacks(systemSlug),
    note: '',
    tags: systemTagsFor(systemSlug),
  }
}
