import { perVial } from './format'

export type MarketComparisonProps = {
  /** TRU per-vial price. */
  truPrice: number
  /**
   * Observed market per-vial price. When omitted the component renders the
   * suppressed state (TRU price only) — never an empty comparison placeholder.
   */
  marketPrice?: number
  /** Sourcing / methodology note shown under the comparison. */
  sourceNote?: string
  /**
   * Apply strikethrough styling to the market price. Off by default — enable
   * only where a struck comparison is explicitly appropriate.
   */
  strikethrough?: boolean
  className?: string
}

const DEFAULT_SOURCE =
  'Based on observed advertised prices from comparable online sellers. Updated July 2026.'

/**
 * Market-comparison display. Shows the TRU price alongside an observed market
 * price when one is provided; otherwise it cleanly collapses to the TRU price
 * with no empty placeholder.
 */
export function MarketComparison({
  truPrice,
  marketPrice,
  sourceNote = DEFAULT_SOURCE,
  strikethrough = false,
  className = '',
}: MarketComparisonProps) {
  const showComparison = marketPrice != null && marketPrice > 0

  // Suppressed state — TRU price only.
  if (!showComparison) {
    return (
      <div className={className}>
        <span className="font-heading text-2xl font-bold text-primary">{perVial(truPrice)}</span>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            TRU Price
          </span>
          <span className="font-heading text-2xl font-bold text-primary">{perVial(truPrice)}</span>
        </div>
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Market comparison
          </span>
          <span
            className={`font-heading text-lg font-semibold text-muted-foreground ${
              strikethrough ? 'line-through' : ''
            }`}
          >
            {perVial(marketPrice)}
          </span>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{sourceNote}</p>
    </div>
  )
}
