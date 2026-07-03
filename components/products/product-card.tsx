'use client'

import Image from 'next/image'
import { FlaskConical, FileText, Eye, ArrowUpRight } from 'lucide-react'
import { type Product, priceRange } from '@/lib/products-data'

type ProductCardProps = {
  product: Product
  onQuickView: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Research Only badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
          <FlaskConical className="h-3 w-3" aria-hidden="true" />
          Research Only
        </span>

        {product.isNew && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            New
          </span>
        )}

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
          <span className="whitespace-nowrap font-heading text-base font-semibold text-primary">
            {priceRange(product)}
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
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Product
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            href="#coa"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label={`Download certificate of analysis for ${product.name}`}
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            COA
          </a>
        </div>
      </div>
    </article>
  )
}
