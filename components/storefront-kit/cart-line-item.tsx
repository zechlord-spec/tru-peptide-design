'use client'

import type { ReactNode } from 'react'
import { Minus, Plus, Trash2, Repeat } from 'lucide-react'
import { formatUSD } from './format'

export type CartLineItemProps = {
  name: string
  /** Composition detail, e.g. "10mg total, 5mg + 5mg". */
  detail?: string
  /** Per-unit label. Defaults to "1 vial" — always expressed in vials. */
  perUnitLabel?: string
  qty: number
  /** Extended line total (already computed by the caller). */
  lineTotal: number
  purchaseType?: 'onetime' | 'autoship'
  /** AutoShip cadence in days. */
  frequency?: number | null
  media?: ReactNode
  onIncrement?: () => void
  onDecrement?: () => void
  onRemove?: () => void
  className?: string
}

/**
 * Cart line item expressed strictly in individual vials (e.g. "1 vial × 2").
 * Never renders kits, packs, multiplied vial counts, or supplier packaging.
 */
export function CartLineItem({
  name,
  detail,
  perUnitLabel = '1 vial',
  qty,
  lineTotal,
  purchaseType = 'onetime',
  frequency,
  media,
  onIncrement,
  onDecrement,
  onRemove,
  className = '',
}: CartLineItemProps) {
  const isAuto = purchaseType === 'autoship'

  return (
    <div className={`flex gap-4 py-5 ${className}`}>
      {media && (
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
          {media}
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-heading text-sm font-semibold leading-tight text-foreground">
              {name}
            </p>
            {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {perUnitLabel} &times; {qty}
            </p>
            {isAuto ? (
              <span className="mt-1.5 inline-flex flex-col gap-0.5">
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <Repeat className="h-3 w-3" aria-hidden="true" />
                  TRU AutoShip
                </span>
                {frequency ? (
                  <span className="text-[11px] text-muted-foreground">Every {frequency} days</span>
                ) : null}
              </span>
            ) : (
              <span className="mt-1.5 inline-flex w-fit items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                One-Time
              </span>
            )}
          </div>
          <span className="whitespace-nowrap font-heading text-sm font-semibold text-primary">
            {formatUSD(lineTotal)}
          </span>
        </div>

        {(onIncrement || onDecrement || onRemove) && (
          <div className="mt-auto flex items-center justify-between pt-3">
            {(onIncrement || onDecrement) && (
              <div className="flex items-center rounded-full border border-border">
                <button
                  type="button"
                  onClick={onDecrement}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                  aria-label={`Decrease ${name} quantity`}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-7 text-center text-sm font-semibold text-foreground">{qty}</span>
                <button
                  type="button"
                  onClick={onIncrement}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                  aria-label={`Increase ${name} quantity`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Remove ${name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
