'use client'

import { useState } from 'react'
import { Star, RotateCcw, Check, Loader2 } from 'lucide-react'
import { TAGS } from '@/lib/catalog/tags'
import type { AdminProduct } from '@/lib/catalog/types'
import {
  setProductFeaturedAction,
  setProductTagsAction,
} from '@/lib/client/catalog-admin'
import { Chip, EmptyState } from '@/components/admin/ui'

export function ProductTagsEditor({
  products,
  onChanged,
}: {
  products: AdminProduct[]
  onChanged: () => Promise<unknown>
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  async function toggleTag(product: AdminProduct, tag: string) {
    setBusy(product.slug)
    const current = new Set(product.tags as string[])
    if (current.has(tag)) current.delete(tag)
    else current.add(tag)
    try {
      await setProductTagsAction(product.slug, Array.from(current))
      await onChanged()
    } finally {
      setBusy(null)
    }
  }

  async function resetTags(product: AdminProduct) {
    setBusy(product.slug)
    try {
      await setProductTagsAction(product.slug, null)
      await onChanged()
    } finally {
      setBusy(null)
    }
  }

  async function toggleFeatured(product: AdminProduct) {
    setBusy(product.slug)
    try {
      await setProductFeaturedAction(product.slug, !product.featured)
      await onChanged()
    } finally {
      setBusy(null)
    }
  }

  if (products.length === 0) return <EmptyState message="No products found." />

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const isOpen = openSlug === product.slug
        const isBusy = busy === product.slug
        return (
          <div key={product.slug} className="rounded-2xl border border-border bg-card">
            <div className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate font-heading text-sm font-semibold text-foreground">
                    {product.name}
                  </h4>
                  {product.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                  )}
                  {product.usingDefaultTags && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Default tags
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.category} ·{' '}
                  {product.tags.length > 0 ? (
                    <span className="text-foreground">{product.tags.join(', ')}</span>
                  ) : (
                    <span className="italic">untagged — hidden from all systems</span>
                  )}
                </p>
                {product.systems.length > 0 && (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Appears in {product.systems.length}{' '}
                    {product.systems.length === 1 ? 'system' : 'systems'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isBusy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                <button
                  type="button"
                  onClick={() => toggleFeatured(product)}
                  disabled={isBusy}
                  className={
                    product.featured
                      ? 'inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground'
                      : 'inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary'
                  }
                >
                  <Star className="h-3.5 w-3.5" />
                  {product.featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenSlug(isOpen ? null : product.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
                >
                  {isOpen ? 'Done' : 'Edit tags'}
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="border-t border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Assign tags
                  </span>
                  {!product.usingDefaultTags && (
                    <button
                      type="button"
                      onClick={() => resetTags(product)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset to defaults
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => {
                    const active = (product.tags as string[]).includes(tag)
                    return (
                      <Chip key={tag} active={active} onClick={() => toggleTag(product, tag)}>
                        {active && <Check className="mr-1 inline h-3 w-3" />}
                        {tag}
                      </Chip>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
