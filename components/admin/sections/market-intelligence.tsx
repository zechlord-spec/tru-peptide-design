'use client'

import useSWR from 'swr'
import { Radar, Database, ShieldCheck, Target } from 'lucide-react'
import { getPricingDashboardAction } from '@/lib/client/pricing-admin'
import { SectionHeader, StatCard, TableCard, Th, Td, EmptyState } from '@/components/admin/ui'

function money(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const cls =
    score >= 0.7
      ? 'bg-emerald-500/12 text-emerald-700'
      : score >= 0.5
        ? 'bg-amber-500/15 text-amber-700'
        : 'bg-destructive/12 text-destructive'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {pct}%
    </span>
  )
}

export function MarketIntelligenceSection() {
  const { data, isLoading } = useSWR('pricing-dashboard', getPricingDashboardAction)
  const rows = data?.rows ?? []

  const withData = rows.filter((r) => r.marketAverage != null && r.numberOfSources > 0)
  const avgSources =
    withData.length > 0
      ? Math.round(withData.reduce((s, r) => s + r.numberOfSources, 0) / withData.length)
      : 0
  const avgConfidence =
    withData.length > 0
      ? Math.round((withData.reduce((s, r) => s + r.confidenceScore, 0) / withData.length) * 100)
      : 0
  const onTarget = rows.filter((r) => r.marketAverage != null && !r.belowTargetMargin).length

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Market Intelligence"
        description="Competitor pricing gathered during the weekly refresh: low, average, median, and high across sources."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tracked variants" value={rows.length} icon={Radar} />
        <StatCard label="Avg. sources / variant" value={avgSources} icon={Database} />
        <StatCard label="Avg. data confidence" value={`${avgConfidence}%`} icon={ShieldCheck} />
        <StatCard label="At/under target price" value={onTarget} icon={Target} />
      </div>

      {isLoading && <EmptyState message="Loading market intelligence…" />}

      {!isLoading && rows.length > 0 && (
        <TableCard>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Vial</Th>
              <Th className="text-right">Low</Th>
              <Th className="text-right">Avg</Th>
              <Th className="text-right">Median</Th>
              <Th className="text-right">High</Th>
              <Th className="text-right">Sources</Th>
              <Th className="text-right">Confidence</Th>
              <Th className="text-right">Our Price</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.slug}-${r.variantKey}`} className="border-b border-border last:border-0">
                <Td className="font-medium">{r.productName}</Td>
                <Td className="text-muted-foreground">{r.dose}</Td>
                <Td className="text-right text-muted-foreground">{money(r.marketLow)}</Td>
                <Td className="text-right">{money(r.marketAverage)}</Td>
                <Td className="text-right text-muted-foreground">{money(r.marketMedian)}</Td>
                <Td className="text-right text-muted-foreground">{money(r.marketHigh)}</Td>
                <Td className="text-right">{r.numberOfSources || '—'}</Td>
                <Td className="text-right">
                  {r.numberOfSources > 0 ? <ConfidenceBadge score={r.confidenceScore} /> : '—'}
                </Td>
                <Td className="text-right font-semibold text-primary">{money(r.retailPrice)}</Td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      )}
    </div>
  )
}
