'use client'

import { Boxes, FileText } from 'lucide-react'
import { AdminCard, Field, FieldGrid, StatusBadge, type StatusTone } from './primitives'
import { formatPct } from './format'

export type TestingStatus = 'pending' | 'in-progress' | 'passed' | 'failed'

const TESTING_META: Record<TestingStatus, { label: string; tone: StatusTone }> = {
  pending: { label: 'Testing pending', tone: 'caution' },
  'in-progress': { label: 'Testing in progress', tone: 'info' },
  passed: { label: 'COA passed', tone: 'positive' },
  failed: { label: 'COA failed', tone: 'negative' },
}

export type InventoryLotCardProps = {
  supplier: string
  supplierLotNumber: string
  internalLotNumber: string
  kitsPurchased: number
  physicalVialsReceived: number
  damagedVials: number
  quarantinedVials: number
  sellableVials: number
  vialsSold: number
  vialsRemaining: number
  receivedDate: string
  expirationDate: string
  coaReference: string
  testingStatus: TestingStatus
  className?: string
}

/**
 * Inventory lot card — full lifecycle of a received supplier lot, from kits
 * purchased through sellable/sold/remaining vials, with testing status and
 * COA reference. Display-only; all figures come from props.
 */
export function InventoryLotCard({
  supplier,
  supplierLotNumber,
  internalLotNumber,
  kitsPurchased,
  physicalVialsReceived,
  damagedVials,
  quarantinedVials,
  sellableVials,
  vialsSold,
  vialsRemaining,
  receivedDate,
  expirationDate,
  coaReference,
  testingStatus,
  className = '',
}: InventoryLotCardProps) {
  const testMeta = TESTING_META[testingStatus]
  const sellThrough = sellableVials > 0 ? vialsSold / sellableVials : 0

  return (
    <AdminCard
      className={className}
      icon={<Boxes className="h-4 w-4" aria-hidden="true" />}
      title={`Lot ${internalLotNumber}`}
      subtitle={`${supplier} · Supplier lot ${supplierLotNumber}`}
      actions={<StatusBadge tone={testMeta.tone}>{testMeta.label}</StatusBadge>}
    >
      <FieldGrid columns={4}>
        <Field label="Kits purchased" value={kitsPurchased.toLocaleString()} />
        <Field label="Vials received" value={physicalVialsReceived.toLocaleString()} />
        <Field label="Damaged" value={damagedVials.toLocaleString()} tone={damagedVials > 0 ? 'negative' : undefined} />
        <Field
          label="Quarantined"
          value={quarantinedVials.toLocaleString()}
          tone={quarantinedVials > 0 ? 'caution' : undefined}
        />
      </FieldGrid>

      {/* Stock breakdown */}
      <div className="mt-4 rounded-lg bg-secondary/60 p-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Sellable vials
            </span>
            <span className="font-heading text-lg font-semibold text-foreground">
              {sellableVials.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Sold / Remaining
            </span>
            <span className="font-heading text-lg font-semibold text-foreground tabular-nums">
              {vialsSold.toLocaleString()}{' '}
              <span className="text-muted-foreground">/ {vialsRemaining.toLocaleString()}</span>
            </span>
          </div>
        </div>
        <div className="mt-2.5">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={Math.round(sellThrough * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Sell-through"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(sellThrough * 100, 100)}%` }} />
          </div>
          <span className="mt-1 block text-[11px] text-muted-foreground">
            {formatPct(sellThrough)} sold through
          </span>
        </div>
      </div>

      <FieldGrid columns={2} className="mt-4">
        <Field label="Received" value={receivedDate} />
        <Field label="Expiration" value={expirationDate} />
      </FieldGrid>

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2">
        <FileText className="h-3.5 w-3.5 flex-none text-accent" aria-hidden="true" />
        <span className="text-xs text-muted-foreground">
          COA reference: <span className="font-medium text-foreground">{coaReference}</span>
        </span>
      </div>
    </AdminCard>
  )
}
