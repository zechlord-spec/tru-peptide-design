'use client'

import { Check, X, FileDown } from 'lucide-react'
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
import { MatchStatusBadge, type MatchStatus } from './match-status'

export type ImportStatus = 'pending' | 'approved' | 'rejected' | 'imported'

const IMPORT_STATUS_META: Record<ImportStatus, { label: string; tone: StatusTone }> = {
  pending: { label: 'Pending', tone: 'caution' },
  approved: { label: 'Approved', tone: 'positive' },
  rejected: { label: 'Rejected', tone: 'negative' },
  imported: { label: 'Imported', tone: 'info' },
}

export type ImportReviewRow = {
  id: string
  supplierProduct: string
  normalizedProduct: string
  strength: string
  costPerKit: number
  costPerVial: number
  matchStatus: MatchStatus
  existingProduct?: string
  specialOrder: boolean
  importStatus: ImportStatus
  reviewNotes?: string
}

export type ImportReviewTableProps = {
  rows: ImportReviewRow[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  className?: string
}

/**
 * NeoGen X import review table. Presents normalized supplier lines for
 * approval. Row data and handlers are supplied by the caller — the table
 * performs no fetching or mutation itself.
 */
export function ImportReviewTable({
  rows,
  onApprove,
  onReject,
  className = '',
}: ImportReviewTableProps) {
  return (
    <AdminCard
      className={className}
      icon={<FileDown className="h-4 w-4" aria-hidden="true" />}
      title="NeoGen X import review"
      subtitle={`${rows.length} line${rows.length === 1 ? '' : 's'} awaiting review`}
    >
      <DataTable
        caption="NeoGen X supplier import lines pending normalization review"
        head={
          <>
            <Th>Supplier product</Th>
            <Th>Normalized</Th>
            <Th>Strength</Th>
            <Th numeric>Cost / kit</Th>
            <Th numeric>Cost / vial</Th>
            <Th>Match</Th>
            <Th>Existing product</Th>
            <Th>Special order</Th>
            <Th>Import status</Th>
            <Th>Notes</Th>
            <Th numeric>Actions</Th>
          </>
        }
      >
        {rows.map((row) => {
          const importMeta = IMPORT_STATUS_META[row.importStatus]
          const decided = row.importStatus === 'approved' || row.importStatus === 'imported'
          return (
            <tr key={row.id} className="align-top transition-colors hover:bg-secondary/40">
              <Td className="font-medium">{row.supplierProduct}</Td>
              <Td>{row.normalizedProduct}</Td>
              <Td className="whitespace-nowrap">{row.strength}</Td>
              <Td numeric>{formatUSD(row.costPerKit)}</Td>
              <Td numeric>{formatUSD(row.costPerVial)}</Td>
              <Td>
                <MatchStatusBadge status={row.matchStatus} />
              </Td>
              <Td className="text-muted-foreground">{row.existingProduct ?? '—'}</Td>
              <Td>
                {row.specialOrder ? (
                  <StatusBadge tone="caution">Special order</StatusBadge>
                ) : (
                  <span className="text-muted-foreground">Standard</span>
                )}
              </Td>
              <Td>
                <StatusBadge tone={importMeta.tone}>{importMeta.label}</StatusBadge>
              </Td>
              <Td className="max-w-[14rem] whitespace-normal text-xs text-muted-foreground">
                {row.reviewNotes ?? '—'}
              </Td>
              <Td numeric>
                <div className="flex items-center justify-end gap-1.5">
                  <ActionButton
                    variant="primary"
                    icon={<Check className="h-3.5 w-3.5" />}
                    disabled={decided}
                    aria-label={`Approve ${row.supplierProduct}`}
                    onClick={() => onApprove?.(row.id)}
                  >
                    Approve
                  </ActionButton>
                  <ActionButton
                    variant="danger"
                    icon={<X className="h-3.5 w-3.5" />}
                    disabled={row.importStatus === 'rejected'}
                    aria-label={`Reject ${row.supplierProduct}`}
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
