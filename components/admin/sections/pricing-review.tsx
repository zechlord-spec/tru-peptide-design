'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { ShieldAlert, Check, X, RefreshCw } from 'lucide-react'
import {
  getReviewQueueAction,
  approveReviewAction,
  dismissReviewAction,
} from '@/app/actions/pricing'
import { SectionHeader, StatCard, TableCard, Th, Td, EmptyState } from '@/components/admin/ui'

function money(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function formatDateTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

export function PricingReviewSection() {
  const { data, isLoading, mutate } = useSWR('pricing-review-queue', getReviewQueueAction)
  const [busyKey, setBusyKey] = useState<string | null>(null)

  const rows = data?.rows ?? []

  async function act(kind: 'approve' | 'dismiss', slug: string, variantKey: string) {
    const key = `${slug}::${variantKey}`
    setBusyKey(key)
    try {
      if (kind === 'approve') await approveReviewAction(slug, variantKey)
      else await dismissReviewAction(slug, variantKey)
      await mutate()
    } finally {
      setBusyKey(null)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pricing Review Queue"
        description="Products the engine could not safely reprice — the target price would break the 70% minimum gross margin or fall more than 10% below the lowest competitor. These are held for manual review instead of being auto-updated."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Awaiting review" value={rows.length} icon={ShieldAlert} />
        <StatCard label="Margin floor" value="70%" icon={ShieldAlert} hint="Minimum gross margin" />
        <StatCard
          label="Below target margin"
          value={rows.filter((r) => (r.proposedMarginPct ?? 100) < 70).length}
          icon={ShieldAlert}
        />
      </div>

      {isLoading && <EmptyState message="Loading review queue…" />}

      {!isLoading && rows.length === 0 && (
        <EmptyState message="Nothing to review. Every product currently meets the 70% margin floor and the competitor price floor." />
      )}

      {rows.length > 0 && (
        <TableCard>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Vial</Th>
              <Th className="text-right">Wholesale</Th>
              <Th className="text-right">Margin floor</Th>
              <Th className="text-right">Current price</Th>
              <Th className="text-right">Proposed</Th>
              <Th className="text-right">Proposed margin</Th>
              <Th>Flagged</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const key = `${r.slug}::${r.variantKey}`
              const busy = busyKey === key
              return (
                <tr key={key} className="border-b border-border last:border-0 align-top">
                  <Td className="font-medium">
                    {r.productName}
                    {r.reviewReason && (
                      <span className="mt-1 block max-w-xs whitespace-normal text-xs font-normal text-amber-700">
                        {r.reviewReason}
                      </span>
                    )}
                  </Td>
                  <Td className="text-muted-foreground">{r.dose} vial</Td>
                  <Td className="text-right text-muted-foreground">{money(r.wholesalePerVial)}</Td>
                  <Td className="text-right font-medium">{money(r.marginFloor)}</Td>
                  <Td className="text-right font-semibold">{money(r.retailPrice)}</Td>
                  <Td className="text-right text-muted-foreground">{money(r.proposedPrice)}</Td>
                  <Td className="text-right">
                    <span className="font-medium text-destructive">
                      {r.proposedMarginPct == null ? '—' : `${r.proposedMarginPct}%`}
                    </span>
                  </Td>
                  <Td className="text-muted-foreground">{formatDateTime(r.flaggedAt)}</Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => act('approve', r.slug, r.variantKey)}
                        disabled={busy || r.proposedPrice == null}
                        title="Apply the proposed price (accept the lower margin)"
                        className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {busy ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Apply proposed
                      </button>
                      <button
                        type="button"
                        onClick={() => act('dismiss', r.slug, r.variantKey)}
                        disabled={busy}
                        title="Keep the current (protected) price and clear the flag"
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" />
                        Keep price
                      </button>
                    </div>
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </TableCard>
      )}
    </div>
  )
}
