'use client'

import type { ReactNode } from 'react'
import { FlaskConical, Clock, ArrowUpRight, Repeat } from 'lucide-react'
import { perVial, hasPrice } from './format'

export type SpecialOrderProductCardProps = {
  name: string
  strength: string
  pricePerVial?: number
  /** AutoShip is hidden by default for special orders; only show when eligible. */
  autoShipEligible?: boolean
  media?: ReactNode
  onViewDetails?: () => void
  className?: string
}

/**
 * Special-order product card. Never advertises stock, same-day shipment, or
 * AutoShip (unless explicitly eligible) — sets a longer fulfillment expectation.
 */
export function SpecialOrderProductCard({
  name,
  strength,
  pricePerVial,
  autoShipEligible = false,
  media,
  onViewDetails,
  className = '',
}: SpecialOrderProductCardProps) {
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

        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-accent/50 bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
          <Clock className="h-3 w-3 text-accent" aria-hidden="true" />
          Special Order
        </span>
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

        {autoShipEligible && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Repeat className="h-3 w-3" aria-hidden="true" />
            AutoShip eligible
          </span>
        )}

        <p className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/70 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          <Clock className="h-3.5 w-3.5 flex-none text-accent" aria-hidden="true" />
          Extended fulfillment time may apply
        </p>

        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={onViewDetails}
            className="btn-premium inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/30 bg-transparent px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View Details
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
