'use client'

import { useId } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { AdminCard, Field, FieldGrid, Toggle } from './primitives'
import { formatUSD, formatPct, marginAtDiscount, marginBand } from './format'

export type DiscountEligibility = {
  id: string
  label: string
  enabled: boolean
}

export type DiscountMarginSimulatorProps = {
  retail: number
  costPerVial: number
  /** Discount ratios to model. Defaults to [0, .05, .08, .12, .15]. */
  tiers?: number[]
  /** Maximum allowable product discount as a 0–1 ratio. */
  maxDiscount: number
  onMaxDiscountChange?: (ratio: number) => void
  eligibility?: DiscountEligibility[]
  onToggleEligibility?: (id: string, next: boolean) => void
  className?: string
}

/**
 * Discount margin simulator — models gross margin across discount tiers given
 * a retail price and per-vial cost, with eligibility controls and a maximum
 * product discount guard. Tiers above the max are flagged. Pure display logic.
 */
export function DiscountMarginSimulator({
  retail,
  costPerVial,
  tiers = [0, 0.05, 0.08, 0.12, 0.15],
  maxDiscount,
  onMaxDiscountChange,
  eligibility = [],
  onToggleEligibility,
  className = '',
}: DiscountMarginSimulatorProps) {
  const maxId = useId()

  return (
    <AdminCard
      className={className}
      icon={<SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
      title="Discount margin simulator"
      subtitle="Gross margin retained at each discount tier"
    >
      <FieldGrid columns={2}>
        <Field label="Retail price" value={formatUSD(retail)} />
        <Field label="Cost / vial" value={formatUSD(costPerVial)} />
      </FieldGrid>

      {/* Tier grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {tiers.map((tier) => {
          const m = marginAtDiscount(retail, costPerVial, tier)
          const band = marginBand(m)
          const exceedsMax = tier > maxDiscount
          const toneClass =
            band === 'negative'
              ? 'text-destructive'
              : band === 'caution'
                ? 'text-accent-foreground'
                : 'text-primary'
          return (
            <div
              key={tier}
              className={`rounded-lg border px-2.5 py-2 text-center ${
                exceedsMax ? 'border-dashed border-border opacity-50' : 'border-border bg-secondary/50'
              }`}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {formatPct(tier)} off
              </span>
              <span className={`font-heading text-base font-semibold ${toneClass}`}>
                {formatPct(m)}
              </span>
              {exceedsMax ? (
                <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                  Above max
                </span>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Max discount control */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2.5">
        <label htmlFor={maxId} className="text-sm font-medium text-foreground">
          Maximum product discount
        </label>
        <div className="flex items-center gap-2">
          <input
            id={maxId}
            type="number"
            min={0}
            max={100}
            inputMode="numeric"
            value={Math.round(maxDiscount * 100)}
            onChange={(e) => onMaxDiscountChange?.(Math.max(0, Math.min(100, Number(e.target.value))) / 100)}
            className="w-20 rounded-lg border border-input bg-background px-2.5 py-1.5 text-right text-sm tabular-nums text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>

      {/* Eligibility controls */}
      {eligibility.length > 0 ? (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Eligibility controls
          </span>
          {eligibility.map((e) => (
            <Toggle
              key={e.id}
              checked={e.enabled}
              onChange={(next) => onToggleEligibility?.(e.id, next)}
              label={e.label}
            />
          ))}
        </div>
      ) : null}
    </AdminCard>
  )
}
