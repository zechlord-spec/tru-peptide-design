'use client'

import { Truck, Check, X, Flag, TrendingDown, TrendingUp } from 'lucide-react'
import {
  AdminCard,
  Field,
  FieldGrid,
  StatusBadge,
  ActionButton,
  type StatusTone,
} from './primitives'
import { formatUSD, formatPct, orDash, grossMargin, marginBand } from './format'

export type PreferredSupplierStatus = 'preferred' | 'alternate' | 'under-review' | 'rejected'

const SUPPLIER_STATUS_META: Record<PreferredSupplierStatus, { label: string; tone: StatusTone }> = {
  preferred: { label: 'Preferred', tone: 'positive' },
  alternate: { label: 'Alternate', tone: 'info' },
  'under-review': { label: 'Under review', tone: 'caution' },
  rejected: { label: 'Rejected', tone: 'negative' },
}

export type SupplierComparisonCardProps = {
  product: string
  strength: string
  existingSupplier: string
  existingCostPerVial: number
  neogenKitCost: number
  neogenCostPerVial: number
  /** Cash outlay required to buy one NeoGen X kit. */
  kitCashRequirement: number
  currentRetail: number
  preferredStatus: PreferredSupplierStatus
  onApprove?: () => void
  onReject?: () => void
  onMarkForReview?: () => void
  className?: string
}

/**
 * Side-by-side supplier economics for a single product/strength. All figures
 * are passed in; cost difference and gross margin are derived purely for
 * display. No sourcing or persistence logic lives here.
 */
export function SupplierComparisonCard({
  product,
  strength,
  existingSupplier,
  existingCostPerVial,
  neogenKitCost,
  neogenCostPerVial,
  kitCashRequirement,
  currentRetail,
  preferredStatus,
  onApprove,
  onReject,
  onMarkForReview,
  className = '',
}: SupplierComparisonCardProps) {
  const costDiff = neogenCostPerVial - existingCostPerVial
  const cheaper = costDiff < 0
  const margin = grossMargin(currentRetail, neogenCostPerVial)
  const statusMeta = SUPPLIER_STATUS_META[preferredStatus]

  return (
    <AdminCard
      className={className}
      icon={<Truck className="h-4 w-4" aria-hidden="true" />}
      title={product}
      subtitle={strength}
      actions={<StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>}
    >
      <FieldGrid columns={3}>
        <Field label="Preferred supplier" value={existingSupplier} />
        <Field label="Existing cost / vial" value={formatUSD(existingCostPerVial)} />
        <Field label="Current retail" value={formatUSD(currentRetail)} />

        <Field label="NeoGen X kit cost" value={formatUSD(neogenKitCost)} />
        <Field label="NeoGen X cost / vial" value={formatUSD(neogenCostPerVial)} />
        <Field label="Kit cash requirement" value={formatUSD(kitCashRequirement)} />
      </FieldGrid>

      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-lg bg-secondary/70 px-3 py-2.5">
          {cheaper ? (
            <TrendingDown className="h-4 w-4 flex-none text-primary" aria-hidden="true" />
          ) : (
            <TrendingUp className="h-4 w-4 flex-none text-destructive" aria-hidden="true" />
          )}
          <div className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Cost difference / vial
            </span>
            <span
              className={`font-heading text-base font-semibold ${cheaper ? 'text-primary' : 'text-destructive'}`}
            >
              {cheaper ? '−' : '+'}
              {formatUSD(Math.abs(costDiff))}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-secondary/70 px-3 py-2.5">
          <div className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Gross margin @ NeoGen X cost
            </span>
            <span
              className={`font-heading text-base font-semibold ${
                marginBand(margin) === 'negative'
                  ? 'text-destructive'
                  : marginBand(margin) === 'caution'
                    ? 'text-accent-foreground'
                    : 'text-primary'
              }`}
            >
              {orDash(margin, (m) => formatPct(m))}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ActionButton variant="primary" icon={<Check className="h-3.5 w-3.5" />} onClick={onApprove}>
          Approve offer
        </ActionButton>
        <ActionButton variant="danger" icon={<X className="h-3.5 w-3.5" />} onClick={onReject}>
          Reject offer
        </ActionButton>
        <ActionButton
          variant="outline"
          icon={<Flag className="h-3.5 w-3.5" />}
          onClick={onMarkForReview}
        >
          Mark for review
        </ActionButton>
      </div>
    </AdminCard>
  )
}
