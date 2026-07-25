'use client'

import { useEffect, useId } from 'react'
import { X, Check, PackagePlus, Sparkles, AlertTriangle, Link2 } from 'lucide-react'
import { ActionButton, Field, FieldGrid, NotesField, SectionLabel } from './primitives'
import { formatUSD, formatPct } from './format'
import { MatchStatusBadge, type MatchStatus } from './match-status'

export type MatchCandidate = {
  id: string
  name: string
  strength: string
  /** Match confidence as a 0–1 ratio. */
  confidence: number
}

export type ProductMatchDrawerProps = {
  open: boolean
  onClose?: () => void
  supplierProduct: string
  normalizedProduct: string
  strength: string
  costPerKit: number
  costPerVial: number
  matchStatus: MatchStatus
  candidates?: MatchCandidate[]
  selectedCandidateId?: string
  onSelectCandidate?: (id: string) => void
  notes?: string
  onNotesChange?: (next: string) => void
  onConfirmMatch?: () => void
  onCreateNewProduct?: () => void
  onCreateNewStrength?: () => void
  onFlagConflict?: () => void
}

/**
 * Slide-over drawer for resolving how an imported supplier line maps to the
 * internal catalog: confirm a candidate, create a new product/strength, or
 * flag a naming conflict. Fully controlled via props.
 */
export function ProductMatchDrawer({
  open,
  onClose,
  supplierProduct,
  normalizedProduct,
  strength,
  costPerKit,
  costPerVial,
  matchStatus,
  candidates = [],
  selectedCandidateId,
  onSelectCandidate,
  notes,
  onNotesChange,
  onConfirmMatch,
  onCreateNewProduct,
  onCreateNewStrength,
  onFlagConflict,
}: ProductMatchDrawerProps) {
  const titleId = useId()
  const radioName = useId()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-primary/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-lg flex-col bg-card shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
          <div>
            <h2 id={titleId} className="font-heading text-lg font-semibold text-foreground">
              Product match review
            </h2>
            <div className="mt-1.5">
              <MatchStatusBadge status={matchStatus} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            aria-label="Close match review"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Imported line */}
          <div className="rounded-xl border border-border bg-secondary/50 p-4">
            <SectionLabel>Imported supplier line</SectionLabel>
            <div className="mt-3">
              <FieldGrid columns={2}>
                <Field label="Supplier product" value={supplierProduct} />
                <Field label="Normalized product" value={normalizedProduct} />
                <Field label="Strength" value={strength} />
                <Field label="Cost / kit" value={formatUSD(costPerKit)} />
                <Field label="Cost / vial" value={formatUSD(costPerVial)} />
              </FieldGrid>
            </div>
          </div>

          {/* Candidate matches */}
          <div>
            <SectionLabel>Candidate matches</SectionLabel>
            {candidates.length === 0 ? (
              <p className="mt-2 rounded-lg bg-secondary/50 px-3 py-3 text-sm text-muted-foreground">
                No catalog candidates found. Create a new product or strength below.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {candidates.map((c) => {
                  const selected = c.id === selectedCandidateId
                  return (
                    <li key={c.id}>
                      <label
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                          selected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-secondary/50'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name={radioName}
                            checked={selected}
                            onChange={() => onSelectCandidate?.(c.id)}
                            className="h-4 w-4 accent-[var(--primary)]"
                          />
                          <span>
                            <span className="block text-sm font-medium text-foreground">
                              {c.name}
                            </span>
                            <span className="block text-xs text-muted-foreground">{c.strength}</span>
                          </span>
                        </span>
                        <span className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
                          {formatPct(c.confidence)} match
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Notes */}
          <NotesField
            id={`${titleId}-notes`}
            label="Review notes"
            value={notes}
            onChange={onNotesChange}
            placeholder="Add context for this mapping decision…"
            rows={3}
          />
        </div>

        {/* Resolution actions */}
        <div className="space-y-3 border-t border-border px-6 py-4">
          <ActionButton
            variant="primary"
            size="md"
            icon={<Check className="h-4 w-4" />}
            className="w-full"
            disabled={!selectedCandidateId}
            onClick={onConfirmMatch}
          >
            <Link2 className="h-4 w-4" />
            Confirm match to selected product
          </ActionButton>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <ActionButton
              variant="outline"
              icon={<PackagePlus className="h-3.5 w-3.5" />}
              onClick={onCreateNewProduct}
            >
              New product
            </ActionButton>
            <ActionButton
              variant="outline"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={onCreateNewStrength}
            >
              New strength
            </ActionButton>
            <ActionButton
              variant="danger"
              icon={<AlertTriangle className="h-3.5 w-3.5" />}
              onClick={onFlagConflict}
            >
              Flag conflict
            </ActionButton>
          </div>
        </div>
      </aside>
    </>
  )
}
