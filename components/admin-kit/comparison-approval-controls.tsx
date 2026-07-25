'use client'

import { BadgeCheck, EyeOff } from 'lucide-react'
import { AdminCard, Field, FieldGrid, Toggle, StatusBadge, type StatusTone } from './primitives'
import { formatUSD } from './format'

export type FreshnessStatus = 'fresh' | 'aging' | 'stale'

const FRESHNESS_META: Record<FreshnessStatus, { label: string; tone: StatusTone }> = {
  fresh: { label: 'Fresh', tone: 'positive' },
  aging: { label: 'Aging', tone: 'caution' },
  stale: { label: 'Stale', tone: 'negative' },
}

export type ComparisonApprovalControlsProps = {
  validComparableCount: number
  averagePrice: number
  medianPrice: number
  lowestPrice: number
  lastUpdated: string
  freshnessStatus: FreshnessStatus
  /** Whether the public-facing comparison is enabled (approved) or suppressed. */
  publicComparisonEnabled: boolean
  onTogglePublicComparison?: (next: boolean) => void
  /**
   * Strikethrough styling on the market price. Defaults to off and should
   * remain off unless explicitly enabled here.
   */
  strikethroughEnabled?: boolean
  onToggleStrikethrough?: (next: boolean) => void
  className?: string
}

/**
 * Comparison-price approval controls. Summarizes the comparable set and lets an
 * admin approve (publish) or suppress the public market comparison, plus opt
 * into strikethrough styling. Strikethrough defaults to off.
 */
export function ComparisonApprovalControls({
  validComparableCount,
  averagePrice,
  medianPrice,
  lowestPrice,
  lastUpdated,
  freshnessStatus,
  publicComparisonEnabled,
  onTogglePublicComparison,
  strikethroughEnabled = false,
  onToggleStrikethrough,
  className = '',
}: ComparisonApprovalControlsProps) {
  const fresh = FRESHNESS_META[freshnessStatus]
  const approved = publicComparisonEnabled

  return (
    <AdminCard
      className={className}
      icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />}
      title="Comparison-price approval"
      subtitle="Governs the public market comparison"
      actions={
        <StatusBadge
          tone={approved ? 'positive' : 'neutral'}
          icon={approved ? undefined : <EyeOff className="h-3 w-3" aria-hidden="true" />}
        >
          {approved ? 'Approved' : 'Suppressed'}
        </StatusBadge>
      }
    >
      <FieldGrid columns={4}>
        <Field label="Valid comparables" value={validComparableCount.toLocaleString()} emphasis />
        <Field label="Average price" value={formatUSD(averagePrice)} />
        <Field label="Median price" value={formatUSD(medianPrice)} />
        <Field label="Lowest price" value={formatUSD(lowestPrice)} />
      </FieldGrid>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Last updated
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">{lastUpdated}</span>
          <StatusBadge tone={fresh.tone}>{fresh.label}</StatusBadge>
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-border pt-4">
        <Toggle
          checked={publicComparisonEnabled}
          onChange={(next) => onTogglePublicComparison?.(next)}
          label="Enable public comparison"
          description="Show the market comparison on the storefront."
        />
        <Toggle
          checked={strikethroughEnabled}
          disabled={!publicComparisonEnabled}
          onChange={(next) => onToggleStrikethrough?.(next)}
          label="Enable strikethrough style"
          description={
            publicComparisonEnabled
              ? 'Render the market price with a strikethrough. Off by default.'
              : 'Available only when the public comparison is enabled.'
          }
        />
      </div>
    </AdminCard>
  )
}
