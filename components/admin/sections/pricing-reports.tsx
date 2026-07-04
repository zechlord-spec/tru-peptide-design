'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  CalendarClock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  RefreshCw,
  Clock,
} from 'lucide-react'
import type { PricingChange } from '@/lib/db/schema'
import { getPricingReportsAction, refreshPricingAction } from '@/app/actions/pricing'
import { SectionHeader, StatCard, TableCard, Th, Td, EmptyState } from '@/components/admin/ui'

function money(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function formatDateTime(iso: string | Date) {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

function ChangeTable({
  rows,
  emptyLabel,
  direction,
}: {
  rows: PricingChange[]
  emptyLabel: string
  direction: 'up' | 'down'
}) {
  if (rows.length === 0) return <EmptyState message={emptyLabel} />
  return (
    <TableCard>
      <thead>
        <tr>
          <Th>Product</Th>
          <Th>Vial</Th>
          <Th className="text-right">Was</Th>
          <Th className="text-right">Now</Th>
          <Th className="text-right">Change</Th>
          <Th className="text-right">vs Market</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={`${r.productSlug}-${r.variantKey}`} className="border-b border-border last:border-0">
            <Td className="font-medium">{r.productName}</Td>
            <Td className="text-muted-foreground">{r.dose} vial</Td>
            <Td className="text-right text-muted-foreground">{money(r.oldPrice)}</Td>
            <Td className="text-right font-semibold">{money(r.newPrice)}</Td>
            <Td
              className={
                direction === 'up'
                  ? 'text-right font-medium text-destructive'
                  : 'text-right font-medium text-emerald-600'
              }
            >
              {direction === 'up' ? '+' : ''}
              {money(r.changeAmount)} ({r.changePct > 0 ? '+' : ''}
              {r.changePct}%)
            </Td>
            <Td className="text-right text-muted-foreground">
              {r.diffFromMarketPct == null ? '—' : `${r.diffFromMarketPct > 0 ? '+' : ''}${r.diffFromMarketPct}%`}
            </Td>
          </tr>
        ))}
      </tbody>
    </TableCard>
  )
}

function ReviewTable({ rows, emptyLabel }: { rows: PricingChange[]; emptyLabel?: string }) {
  if (rows.length === 0)
    return <EmptyState message={emptyLabel ?? 'Nothing needs manual review. All prices are within targets.'} />
  return (
    <TableCard>
      <thead>
        <tr>
          <Th>Product</Th>
          <Th>Vial</Th>
          <Th className="text-right">Our Price</Th>
          <Th className="text-right">Market Avg</Th>
          <Th>Reasons</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={`${r.productSlug}-${r.variantKey}`} className="border-b border-border last:border-0">
            <Td className="font-medium">{r.productName}</Td>
            <Td className="text-muted-foreground">{r.dose} vial</Td>
            <Td className="text-right font-semibold">{money(r.newPrice)}</Td>
            <Td className="text-right text-muted-foreground">
              {r.marketAverage == null ? '—' : money(r.marketAverage)}
            </Td>
            <Td className="whitespace-normal">
              <div className="flex flex-wrap gap-1.5">
                {(r.reasons ?? []).map((reason) => (
                  <span
                    key={reason}
                    className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-700"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </Td>
          </tr>
        ))}
      </tbody>
    </TableCard>
  )
}

export function PricingReportsSection() {
  const { data, isLoading, mutate } = useSWR('pricing-reports', getPricingReportsAction)
  const [refreshing, setRefreshing] = useState(false)

  const latest = data?.latest ?? null

  async function runNow() {
    setRefreshing(true)
    try {
      await refreshPricingAction()
      await mutate()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pricing Scheduler & Reports"
        description="Automated competitor refresh runs every Sunday at 2:00 AM UTC, then recalculates averages, retail, and margins."
        action={
          <button
            type="button"
            onClick={runNow}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <RefreshCw className={refreshing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            {refreshing ? 'Running…' : 'Run refresh now'}
          </button>
        }
      />

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-4">
        <CalendarClock className="h-5 w-5 text-primary" strokeWidth={1.75} />
        <div className="text-sm">
          <span className="font-medium text-foreground">Next scheduled run:</span>{' '}
          <span className="text-muted-foreground">Every Sunday, 2:00 AM UTC (weekly)</span>
        </div>
      </div>

      {isLoading && <EmptyState message="Loading latest pricing report…" />}

      {!isLoading && !latest && (
        <EmptyState message="No pricing report yet. Run a refresh to generate the first report." />
      )}

      {latest && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Products updated" value={latest.productsUpdated} icon={RefreshCw} />
            <StatCard label="Price increases" value={latest.increasesCount} icon={TrendingUp} />
            <StatCard label="Price decreases" value={latest.decreasesCount} icon={TrendingDown} />
            <StatCard label="Margin warnings" value={latest.marginWarningsCount} icon={ShieldAlert} />
            <StatCard label="Need manual review" value={latest.reviewCount} icon={AlertTriangle} />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Generated {formatDateTime(latest.generatedAt)} · {latest.trigger === 'scheduled' ? 'Scheduled run' : 'Manual run'} · {latest.notes}
          </div>

          <div className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Requires manual review
            </h2>
            <ReviewTable rows={latest.needsReview} />
          </div>

          <div className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              Margin warnings
            </h2>
            <ReviewTable rows={latest.marginWarnings} emptyLabel="No margin warnings. Every product is at or above the 70% minimum margin." />
          </div>

          <div className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <TrendingUp className="h-5 w-5 text-destructive" />
              Price increases
            </h2>
            <ChangeTable rows={latest.increases} emptyLabel="No price increases this run." direction="up" />
          </div>

          <div className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <TrendingDown className="h-5 w-5 text-emerald-600" />
              Price decreases
            </h2>
            <ChangeTable rows={latest.decreases} emptyLabel="No price decreases this run." direction="down" />
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">Refresh history</h2>
            <TableCard>
              <thead>
                <tr>
                  <Th>Ran at</Th>
                  <Th className="text-right">Variants updated</Th>
                  <Th>Status</Th>
                  <Th>Notes</Th>
                </tr>
              </thead>
              <tbody>
                {(data?.log ?? []).map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <Td>{formatDateTime(l.ranAt)}</Td>
                    <Td className="text-right">{l.productsUpdated}</Td>
                    <Td className="capitalize">{l.status}</Td>
                    <Td className="whitespace-normal text-muted-foreground">{l.notes}</Td>
                  </tr>
                ))}
              </tbody>
            </TableCard>
          </div>
        </>
      )}
    </div>
  )
}
