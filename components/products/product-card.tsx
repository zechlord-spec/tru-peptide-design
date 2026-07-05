'use client'

import Link from 'next/link'
import { FlaskConical, FileText, Eye, ArrowUpRight } from 'lucide-react'
import type { Product } from '@/lib/data/types'
import { useRetailRange } from '@/lib/pricing/pricing-context'
import { FavoriteButton } from '@/components/shop/favorite-button'
import { VialImage } from '@/components/products/vial-image'

type ProductCardProps = {
  product: Product
  onQuickView: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const retailRange = useRetailRange(product)
  const hasPrice = retailRange !== '—'
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
          <VialImage
            name={product.name}
            catNo={product.variants[0]?.catNo ?? ''}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Research Only badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
          <FlaskConical className="h-3 w-3" aria-hidden="true" />
          Research Only
        </span>

        <div className="absolute right-3 top-3 flex items-center gap-2">
          {product.isNew && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
              New
            </span>
          )}
          <FavoriteButton slug={product.slug} size="sm" />
        </div>

        {/* Quick View overlay button */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-gradient-to-t from-primary/80 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-md transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Quick View
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1 font-heading text-lg font-semibold leading-tight text-foreground text-balance">
              {product.name}
            </h3>
          </div>
          <span className="flex flex-col items-end whitespace-nowrap text-right">
            <span className="font-heading text-base font-semibold text-primary">
              {retailRange}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {hasPrice ? 'per vial' : 'pricing soon'}
            </span>
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.blurb}</p>

        {/* Associations */}
        <div className="mt-1 flex flex-wrap gap-1.5">
          {product.goals.slice(0, 1).map((goal) => (
            <span
              key={goal}
              className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
            >
              {goal}
            </span>
          ))}
          {product.systems.slice(0, 1).map((system) => (
            <span
              key={system}
              className="rounded-full border border-accent/40 px-2.5 py-1 text-[11px] font-medium text-accent-foreground/80"
            >
              {system}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-3">
          <Link
            href={`/products/${product.slug}`}
            className="btn-premium inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View Product
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href={`/products/${product.slug}#coa`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label={`View certificate of analysis for ${product.name}`}
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            COA
          </Link>
        </div>
      </div>
    </article>
  )
}
