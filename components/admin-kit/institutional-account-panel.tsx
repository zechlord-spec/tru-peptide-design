'use client'

import { useId } from 'react'
import { Building2, Check, X, PauseCircle } from 'lucide-react'
import {
  AdminCard,
  Field,
  FieldGrid,
  StatusBadge,
  ActionButton,
  NotesField,
  type StatusTone,
} from './primitives'
import { formatPct } from './format'

export type InstitutionStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

const STATUS_META: Record<InstitutionStatus, { label: string; tone: StatusTone }> = {
  pending: { label: 'Pending review', tone: 'caution' },
  approved: { label: 'Approved', tone: 'positive' },
  rejected: { label: 'Rejected', tone: 'negative' },
  suspended: { label: 'Suspended', tone: 'negative' },
}

export type InstitutionalAccountPanelProps = {
  institutionName: string
  institutionType: string
  businessEmail: string
  businessIdentifier: string
  authorizedPurchaser: string
  requestedDiscount: number
  approvedDiscount: number
  onApprovedDiscountChange?: (ratio: number) => void
  status: InstitutionStatus
  expirationDate: string
  notes?: string
  onNotesChange?: (next: string) => void
  onApprove?: () => void
  onReject?: () => void
  onSuspend?: () => void
  className?: string
}

/**
 * Institutional account review panel. Presents an applicant's verification
 * details and requested pricing, allows setting an approved discount, and
 * exposes approve / reject / suspend decisions. Fully controlled via props.
 */
export function InstitutionalAccountPanel({
  institutionName,
  institutionType,
  businessEmail,
  businessIdentifier,
  authorizedPurchaser,
  requestedDiscount,
  approvedDiscount,
  onApprovedDiscountChange,
  status,
  expirationDate,
  notes,
  onNotesChange,
  onApprove,
  onReject,
  onSuspend,
  className = '',
}: InstitutionalAccountPanelProps) {
  const approvedId = useId()
  const statusMeta = STATUS_META[status]

  return (
    <AdminCard
      className={className}
      icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
      title={institutionName}
      subtitle={institutionType}
      actions={<StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>}
    >
      <FieldGrid columns={2}>
        <Field label="Business email" value={businessEmail} />
        <Field label="Business identifier" value={businessIdentifier} />
        <Field label="Authorized purchaser" value={authorizedPurchaser} />
        <Field label="Expiration date" value={expirationDate} />
      </FieldGrid>

      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
        <div className="rounded-lg bg-secondary/60 px-3 py-2.5">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Requested discount
          </span>
          <span className="font-heading text-lg font-semibold text-foreground">
            {formatPct(requestedDiscount)}
          </span>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <label
            htmlFor={approvedId}
            className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Approved discount
          </label>
          <div className="mt-0.5 flex items-center gap-1.5">
            <input
              id={approvedId}
              type="number"
              min={0}
              max={100}
              inputMode="numeric"
              value={Math.round(approvedDiscount * 100)}
              onChange={(e) =>
                onApprovedDiscountChange?.(Math.max(0, Math.min(100, Number(e.target.value))) / 100)
              }
              className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-right text-sm tabular-nums text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <span className="font-heading text-base font-semibold text-primary">%</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <NotesField
          id="institution-notes"
          label="Review notes"
          value={notes}
          onChange={onNotesChange}
          placeholder="Document verification checks and decision rationale…"
          rows={2}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ActionButton variant="primary" icon={<Check className="h-3.5 w-3.5" />} onClick={onApprove}>
          Approve
        </ActionButton>
        <ActionButton variant="danger" icon={<X className="h-3.5 w-3.5" />} onClick={onReject}>
          Reject
        </ActionButton>
        <ActionButton
          variant="outline"
          icon={<PauseCircle className="h-3.5 w-3.5" />}
          onClick={onSuspend}
        >
          Suspend
        </ActionButton>
      </div>
    </AdminCard>
  )
}
