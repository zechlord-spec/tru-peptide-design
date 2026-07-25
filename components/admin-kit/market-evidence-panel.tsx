'use client'

import { ClipboardCheck, Check, X, ExternalLink } from 'lucide-react'
import {
  AdminCard,
  DataTable,
  Th,
  Td,
  StatusBadge,
  ActionButton,
  type StatusTone,
} from './primitives'
import { formatUSD } from './format'

export type EvidenceReviewStatus = 'pending' | 'verified' | 'rejected'

const REVIEW_META: Record<EvidenceReviewStatus, { label: string; tone: StatusTone }> = {
  pending: { label: 'Pending', tone: 'caution' },
  verified: { label: 'Verified', tone: 'positive' },
  rejected: { label: 'Rejected', tone: 'negative' },
}

export type MarketEvidenceRow = {
  id: string
  competitor: string
  sourceUrl: string
  observedProduct: string
  strength: string
  unitCount: number
  advertisedPrice: number
  shippingIncluded: boolean
  subscriptionRequired: boolean
  couponRequired: boolean
  inStock: boolean
  observationDate: string
  evidenceReference: string
  reviewStatus: EvidenceReviewStatus
}

export type MarketEvidencePanelProps = {
  rows: MarketEvidenceRow[]
  onVerify?: (id: string) => void
  onReject?: (id: string) => void
  className?: string
}

/** Compact yes/no cell with a comparability-aware tone. */
function BoolCell({ value, goodWhen }: { value: boolean; goodWhen: boolean }) {
  const isGood = value === goodWhen
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isGood ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {value ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <X className="h-3.5 w-3.5" aria-hidden="true" />}
      {value ? 'Yes' : 'No'}
    </span>
  )
}

/**
 * Market-comparison evidence panel. Lists observed competitor listings with
 * the comparability signals (shipping, subscription, coupon, stock) needed to
 * decide whether each is a valid comparable. Data supplied via props.
 */
export function MarketEvidencePanel({
  rows,
  onVerify,
  onReject,
  className = '',
}: MarketEvidencePanelProps) {
  return (
    <AdminCard
      className={className}
      icon={<ClipboardCheck className="h-4 w-4" aria-hidden="true" />}
      title="Market-comparison evidence"
      subtitle={`${rows.length} observation${rows.length === 1 ? '' : 's'}`}
    >
      <DataTable
        caption="Observed competitor listings used as market-comparison evidence"
        head={
          <>
            <Th>Competitor</Th>
            <Th>Observed product</Th>
            <Th>Strength</Th>
            <Th numeric>Units</Th>
            <Th numeric>Advertised</Th>
            <Th>Shipping incl.</Th>
            <Th>Subscription</Th>
            <Th>Coupon</Th>
            <Th>In stock</Th>
            <Th>Observed</Th>
            <Th>Evidence</Th>
            <Th>Review</Th>
            <Th numeric>Actions</Th>
          </>
        }
      >
        {rows.map((row) => {
          const meta = REVIEW_META[row.reviewStatus]
          return (
            <tr key={row.id} className="align-top transition-colors hover:bg-secondary/40">
              <Td className="font-medium">
                <a
                  href={row.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                >
                  {row.competitor}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </Td>
              <Td>{row.observedProduct}</Td>
              <Td className="whitespace-nowrap">{row.strength}</Td>
              <Td numeric>{row.unitCount}</Td>
              <Td numeric>{formatUSD(row.advertisedPrice)}</Td>
              <Td>
                <BoolCell value={row.shippingIncluded} goodWhen={true} />
              </Td>
              <Td>
                <BoolCell value={row.subscriptionRequired} goodWhen={false} />
              </Td>
              <Td>
                <BoolCell value={row.couponRequired} goodWhen={false} />
              </Td>
              <Td>
                <BoolCell value={row.inStock} goodWhen={true} />
              </Td>
              <Td className="whitespace-nowrap text-muted-foreground">{row.observationDate}</Td>
              <Td className="whitespace-nowrap text-xs text-muted-foreground">
                {row.evidenceReference}
              </Td>
              <Td>
                <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
              </Td>
              <Td numeric>
                <div className="flex items-center justify-end gap-1.5">
                  <ActionButton
                    variant="primary"
                    icon={<Check className="h-3.5 w-3.5" />}
                    disabled={row.reviewStatus === 'verified'}
                    aria-label={`Verify evidence from ${row.competitor}`}
                    onClick={() => onVerify?.(row.id)}
                  >
                    Verify
                  </ActionButton>
                  <ActionButton
                    variant="danger"
                    icon={<X className="h-3.5 w-3.5" />}
                    disabled={row.reviewStatus === 'rejected'}
                    aria-label={`Reject evidence from ${row.competitor}`}
                    onClick={() => onReject?.(row.id)}
                  >
                    Reject
                  </ActionButton>
                </div>
              </Td>
            </tr>
          )
        })}
      </DataTable>
    </AdminCard>
  )
}
