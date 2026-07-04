'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { DollarSign, Percent, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react'
import type { PricingMode } from '@/lib/db/schema'
import {
  getPricingDashboardAction,
  refreshPricingAction,
  setPricingModeAction,
} from '@/app/actions/pricing'
import { SectionHeader, StatCard, TableCard, Th, Td, Chip, EmptyState } from '@/components/admin/ui'

function money(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

const MODES: { id: PricingMode; label: string }[] = [
  { id: 'market', label: 'Market (20% below avg)' },
  { id: 'markup6x', label: 'Wholesale × 6' },
  { id: 'manual', label: 'Manual overrides' },
]

export function PricingDashboardSection() {
  const { data, isLoading, mutate } = useSWR('pricing-dashboard', getPricingDashboardAction)
  const [busy, setBusy] = useState(false)

  const rows = data?.rows ?? []
  const activeMode = data?.activeMode ?? 'market'

  const avgMargin =
    rows.length > 0 ? Math.round(rows.reduce((s, r) => s + r.marginPct, 0) / rows.length) : 0
  const flagged = rows.filter((r) => r.belowTargetMargin).length
  const totalRetail = rows.reduce((s, r) => s + r.retailPrice, 0)

  async function changeMode(mode: PricingMode) {
    setBusy(true)
    try {
      await setPricingModeAction(mode)
      await mutate()
    } finally {
      setBusy(false)
    }
  }

  async function refresh() {
    setBusy(true)
    try {
      await refreshPricingAction()
      await mutate()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pricing Dashboard"
        description="Per-vial retail pricing, wholesale cost, and live margins across the catalog. Wholesale figures are internal only."
        action={
          <button
            type="button"
            onClick={refresh}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <RefreshCw className={busy ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            Refresh pricing
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Priced variants" value={rows.length} icon={DollarSign} />
        <StatCard label="Avg. gross margin" value={`${avgMargin}%`} icon={Percent} />
        <StatCard label="Catalog retail value" value={money(totalRetail)} icon={TrendingDown} />
        <StatCard label="Above target price" value={flagged} icon={AlertTriangle} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Pricing mode:</span>
        {MODES.map((m) => (
          <Chip key={m.id} active={activeMode === m.id} onClick={() => !busy && changeMode(m.id)}>
            {m.label}
          </Chip>
        ))}
      </div>

      {isLoading && <EmptyState message="Loading pricing dashboard…" />}

      {!isLoading && rows.length > 0 && (
        <TableCard>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Vial</Th>
              <Th className="text-right">Wholesale</Th>
              <Th className="text-right">Market Avg</Th>
              <Th className="text-right">Retail</Th>
              <Th className="text-right">Margin</Th>
              <Th className="text-right">vs Market</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.slug}-${r.variantKey}`} className="border-b border-border last:border-0">
                <Td className="font-medium">{r.productName}</Td>
                <Td className="text-muted-foreground">{r.dose}</Td>
                <Td className="text-right text-muted-foreground">{money(r.wholesalePerVial)}</Td>
                <Td className="text-right text-muted-foreground">
                  {r.marketAverage == null ? '—' : money(r.marketAverage)}
                </Td>
                <Td className="text-right font-semibold">{money(r.retailPrice)}</Td>
                <Td className="text-right">
                  <span
                    className={
                      r.marginPct >= 70
                        ? 'font-medium text-emerald-600'
                        : r.marginPct >= 50
                          ? 'font-medium text-amber-600'
                          : 'font-medium text-destructive'
                    }
                  >
                    {r.marginPct}%
                  </span>
                </Td>
                <Td className="text-right">
                  {r.differenceFromMarketPct == null ? (
                    '—'
                  ) : (
                    <span className={r.belowTargetMargin ? 'text-destructive' : 'text-emerald-600'}>
                      {r.differenceFromMarketPct > 0 ? '+' : ''}
                      {r.differenceFromMarketPct}%
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      )}
    </div>
  )
}
