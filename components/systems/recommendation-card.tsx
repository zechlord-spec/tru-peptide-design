'use client'

import Link from 'next/link'
import { Star, Plus, ArrowUpRight, Check, Flame, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { vialDose } from '@/lib/data/format'
import { useRetailSnapshot } from '@/lib/pricing/pricing-context'
import { retailStartingFrom, formatUSD } from '@/lib/pricing/format'
import { VialImage } from '@/components/products/vial-image'
import { useStore } from '@/lib/store'
import type { RankedProduct } from '@/lib/catalog/types'

export function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)))
          return (
            <span key={i} className="relative inline-block h-3.5 w-3.5">
              <Star className="absolute inset-0 h-3.5 w-3.5 text-border" aria-hidden="true" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
              </span>
            </span>
          )
        })}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  )
}

export function RecommendationCard({ item }: { item: RankedProduct }) {
  const { product, rating, reviewCount, bestSeller, featured, benefit } = item
  const snapshot = useRetailSnapshot()
  const { addItem } = useStore()
  const [added, setAdded] = useState(false)

  const starting = retailStartingFrom(snapshot, product)
  const doses = product.variants.map((v) => vialDose(v.spec))
  const startingDose = starting ? vialDose(product.variants.find((v) => v.catNo === starting.catNo)?.spec ?? '') : doses[0]

  function handleAdd() {
    if (!starting) return
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
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.28)]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <VialImage
            name={product.name}
            catNo={product.variants[0]?.catNo ?? ''}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {bestSeller && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
              <Flame className="h-3 w-3" aria-hidden="true" />
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
              New
            </span>
          )}
          {featured && !bestSeller && (
            <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1 truncate font-heading text-lg font-semibold leading-tight text-primary">
              {product.name}
            </h3>
          </div>
          {startingDose && (
            <span className="flex-none rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
              {startingDose}
              {product.variants.length > 1 ? ` +${product.variants.length - 1}` : ''}
            </span>
          )}
        </div>

        <StarRating rating={rating} reviewCount={reviewCount} />

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{benefit}</p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Starting at
            </p>
            <p className="font-heading text-lg font-bold text-primary">
              {starting ? formatUSD(starting.price) : '—'}
              <span className="ml-1 text-[11px] font-medium text-muted-foreground">per vial</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!starting}
            className="btn-premium inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add to Cart
              </>
            )}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-3.5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary"
            aria-label={`View details for ${product.name}`}
          >
            Details
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
