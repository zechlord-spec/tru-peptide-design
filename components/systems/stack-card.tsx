'use client'

import Link from 'next/link'
import { Layers, Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { vialDose } from '@/lib/data/format'
import { useRetailSnapshot } from '@/lib/pricing/pricing-context'
import { retailStartingFrom, formatUSD } from '@/lib/pricing/format'
import { VialImage } from '@/components/products/vial-image'
import { useStore } from '@/lib/store'
import type { RecommendedStack } from '@/lib/catalog/types'

export function StackCard({ stack }: { stack: RecommendedStack }) {
  const snapshot = useRetailSnapshot()
  const { addItem } = useStore()
  const [added, setAdded] = useState(false)

  const lines = stack.products.map((product) => ({
    product,
    starting: retailStartingFrom(snapshot, product),
  }))
  const total = lines.reduce((sum, l) => sum + (l.starting?.price ?? 0), 0)

  function handleAddStack() {
    for (const { product, starting } of lines) {
      if (!starting) continue
      addItem({
        productSlug: product.slug,
        name: product.name,
        catNo: starting.catNo,
        spec: starting.spec,
        price: starting.price,
        image: product.image,
        qty: 1,
        purchaseType: 'onetime',
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="flex flex-col rounded-3xl border border-accent/30 bg-card p-6 shadow-[0_1px_2px_rgba(8,27,53,0.04)]">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent/15 text-accent">
          <Layers className="h-4 w-4" aria-hidden="true" />
        </span>
        <h3 className="font-heading text-lg font-bold text-primary">{stack.title}</h3>
      </div>
      {stack.description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stack.description}</p>
      )}

      <ul className="mt-5 flex flex-col gap-3">
        {lines.map(({ product, starting }) => (
          <li key={product.slug} className="flex items-center gap-3">
            <span className="relative h-11 w-11 flex-none overflow-hidden rounded-xl bg-secondary">
              <VialImage
                name={product.name}
                catNo={product.variants[0]?.catNo ?? ''}
                showText={false}
                sizes="44px"
              />
            </span>
            <span className="min-w-0 flex-1">
              <Link
                href={`/products/${product.slug}`}
                className="block truncate text-sm font-semibold text-primary hover:text-accent"
              >
                {product.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {starting ? `${vialDose(starting.spec)} · ${formatUSD(starting.price)}` : '—'}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Stack from
          </p>
          <p className="font-heading text-xl font-bold text-primary">{formatUSD(total)}</p>
        </div>
        <button
          type="button"
          onClick={handleAddStack}
          className="btn-premium inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Stack
            </>
          )}
        </button>
      </div>
    </article>
  )
}
