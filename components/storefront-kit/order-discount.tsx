import { Check, TrendingUp } from 'lucide-react'
import { formatUSD } from './format'

export type OrderDiscountMessageProps = {
  /** Discount percentage for the tier being described, e.g. 8. */
  percent: number
  /**
   * Eligible spend still needed to reach the tier. When <= 0 the tier is
   * treated as reached.
   */
  remaining: number
  /** Optional 0–1 progress value to render a restrained progress track. */
  progress?: number
  className?: string
}

/**
 * Restrained order-discount progress message. Avoids urgency, gamification, or
 * stockpiling language — states the threshold factually.
 */
export function OrderDiscountMessage({
  percent,
  remaining,
  progress,
  className = '',
}: OrderDiscountMessageProps) {
  const reached = remaining <= 0
  const clamped = progress == null ? null : Math.max(0, Math.min(1, progress))

  return (
    <div
      className={`rounded-xl border border-border bg-secondary/50 px-4 py-3 ${className}`}
      role="status"
    >
      <p className="flex items-start gap-2 text-xs leading-relaxed text-foreground">
        {reached ? (
          <Check className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden="true" />
        ) : (
          <TrendingUp className="mt-0.5 h-4 w-4 flex-none text-muted-foreground" aria-hidden="true" />
        )}
        <span>
          {reached ? (
            <>
              {percent}% order pricing applied to eligible products.
            </>
          ) : (
            <>
              Add {formatUSD(remaining)} in eligible products to receive {percent}% order pricing.
            </>
          )}
        </span>
      </p>
      {clamped != null && (
        <div
          className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(clamped * 100)}
        >
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${clamped * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

export type BestDiscountSummaryProps = {
  /** Optional applied percentage to display alongside the label. */
  percent?: number
  label?: string
  className?: string
}

/**
 * Compact "best eligible discount applied" summary for the cart totals area.
 */
export function BestDiscountSummary({
  percent,
  label = 'Best eligible discount applied',
  className = '',
}: BestDiscountSummaryProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
        <Check className="h-4 w-4 flex-none text-accent" aria-hidden="true" />
        {label}
      </span>
      {percent != null && (
        <span className="font-heading text-sm font-semibold text-primary">-{percent}%</span>
      )}
    </div>
  )
}
