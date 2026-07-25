'use client'

import type { ReactNode } from 'react'
import { FlaskConical, Eye, Repeat, ShoppingBag } from 'lucide-react'
import { perVial, hasPrice } from './format'

export type StandardProductCardProps = {
  /** Product display name, e.g. "BPC-157". */
  name: string
  /** Strength label, e.g. "5 mg". */
  strength: string
  /** Per-vial retail price. Omit / 0 to show the neutral "Pricing soon" state. */
  pricePerVial?: number
  /** Show the TRU AutoShip indicator (only when the product is eligible). */
  autoShipEligible?: boolean
  /** Product imagery — pass the existing <VialImage /> to preserve brand visuals. */
  media?: ReactNode
  onQuickView?: () => void
  onAddToCart?: () => void
  className?: string
}

/**
 * Standard single-vial product card. Retail-facing only — never renders
 * supplier, kit, wholesale, or margin information.
 */
export function StandardProductCard({
  name,
  strength,
  pricePerVial,
  autoShipEligible = false,
  media,
  onQuickView,
  onAddToCart,
  className = '',
}: StandardProductCardProps) {
  const priced = hasPrice(pricePerVial)

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {media ? (
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
            {media}
          </div>
        ) : null}

        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
          <FlaskConical className="h-3 w-3" aria-hidden="true" />
          Research Only
        </span>

        {autoShipEligible && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            <Repeat className="h-3 w-3" aria-hidden="true" />
            AutoShip
          </span>
        )}

        {onQuickView && (
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-gradient-to-t from-primary/80 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={onQuickView}
              className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-md transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Quick View
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-lg font-semibold leading-tight text-foreground text-balance">
              {name}
            </h3>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {strength}
            </p>
          </div>
          <span className="flex flex-col items-end whitespace-nowrap text-right">
            <span className="font-heading text-base font-semibold text-primary">
              {priced ? perVial(pricePerVial) : '—'}
            </span>
            {!priced && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Pricing soon
              </span>
            )}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">Sold as one individual vial</p>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <button
            type="button"
            onClick={onAddToCart}
            disabled={!priced}
            aria-disabled={!priced}
            className={`btn-premium inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              priced
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'cursor-not-allowed bg-secondary text-muted-foreground'
            }`}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {priced ? 'Add to Cart' : 'Pricing unavailable'}
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={onQuickView}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label={`Quick view ${name}`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
