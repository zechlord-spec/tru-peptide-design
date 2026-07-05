'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { DollarSign, Percent, ShieldAlert, AlertTriangle, RefreshCw, Tag } from 'lucide-react'
import type { PricingMode } from '@/lib/pricing/types'
import {
  getPricingDashboardAction,
  refreshPricingAction,
  setGlobalSalePercentAction,
  setPricingModeAction,
} from '@/lib/client/pricing-admin'
import { SectionHeader, StatCard, TableCard, Th, Td, Chip, Toolbar, EmptyState } from '@/components/admin/ui'

function money(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

const MODES: { id: PricingMode; label: string }[] = [
  { id: 'market', label: 'Smart Dynamic' },
  { id: 'markup6x', label: 'Fixed Markup' },
  { id: 'manual', label: 'Manual Price' },
  { id: 'promo', label: 'Promotional Sale' },
]

type FilterId =
  | 'marginBelowTarget'
  | 'priceHigherThanMarket'
  | 'belowRecommended'
  | 'manualOverride'
  | 'recentlyUpdated'

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'marginBelowTarget', label: 'Margin below target' },
  { id: 'priceHigherThanMarket', label: 'Price higher than market' },
  { id: 'belowRecommended', label: 'Price lower than recommended' },
  { id: 'manualOverride', label: 'Manual override' },
  { id: 'recentlyUpdated', label: 'Recently updated' },
]

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function PricingDashboardSection() {
  const { data, isLoading, mutate } = useSWR('pricing-dashboard', getPricingDashboardAction)
  const [busy, setBusy] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Set<FilterId>>(new Set())
  const [saleDraft, setSaleDraft] = useState<string>('')

  const rows = data?.rows ?? []
  const activeMode = data?.activeMode ?? 'market'
  const salePercent = Math.round((data?.salePercentOff ?? 0) * 100)

  const avgMargin = rows.length > 0 ? Math.round(rows.reduce((s, r) => s + r.marginPct, 0) / rows.length) : 0
  const belowMargin = rows.filter((r) => r.belowTargetMargin).length
  const needsReview = rows.filter((r) => r.needsReview).length

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const now = Date.now()
    return rows.filter((r) => {
      if (q && !r.productName.toLowerCase().includes(q) && !r.dose.toLowerCase().includes(q)) return false
      for (const f of filters) {
        if (f === 'marginBelowTarget' && !r.belowTargetMargin) return false
        if (f === 'priceHigherThanMarket' && !r.priceHigherThanMarket) return false
        if (f === 'belowRecommended' && !r.belowRecommended) return false
        if (f === 'manualOverride' && !r.isManualOverride) return false
        if (f === 'recentlyUpdated' && now - new Date(r.lastUpdated).getTime() > WEEK_MS) return false
      }
      return true
    })
  }, [rows, search, filters])

  function toggleFilter(id: FilterId) {
    setFilters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function changeMode(mode: PricingMode) {
    setBusy(true)
    try {
      await setPricingModeAction(mode)
      await mutate()
    } finally {
      setBusy(false)
    }
  }

  async function applySale() {
    const pct = Number.parseFloat(saleDraft)
    if (Number.isNaN(pct)) return
    setBusy(true)
    try {
      await setGlobalSalePercentAction(Math.max(0, Math.min(90, pct)))
      setSaleDraft('')
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
        title="Pricing Management"
        description="Smart Dynamic Pricing engine — targets 15–20% below market while protecting a 70% minimum margin and staying within 10% of the lowest competitor. Wholesale figures are internal only."
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
        <StatCard label="Below 70% margin" value={belowMargin} icon={AlertTriangle} hint="Minimum gross margin" />
        <StatCard label="Needs review" value={needsReview} icon={ShieldAlert} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Pricing mode:</span>
        {MODES.map((m) => (
          <Chip key={m.id} active={activeMode === m.id} onClick={() => !busy && changeMode(m.id)}>
            {m.label}
          </Chip>
        ))}
      </div>

      {activeMode === 'promo' && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
          <Tag className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <div className="text-sm">
            <span className="font-medium text-foreground">Site-wide sale:</span>{' '}
            <span className="text-muted-foreground">{salePercent}% off the Smart Dynamic price</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={90}
              value={saleDraft}
              onChange={(e) => setSaleDraft(e.target.value)}
              placeholder={`${salePercent}`}
              className="w-24 rounded-full border border-border bg-background py-2 pl-4 pr-2 text-sm text-foreground outline-none focus:border-ring"
            />
            <span className="text-sm text-muted-foreground">%</span>
            <button
              type="button"
              onClick={applySale}
              disabled={busy || saleDraft === ''}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Apply sale
            </button>
          </div>
          <p className="w-full text-xs text-muted-foreground">
            Sale prices are still clamped to the 70% margin and competitor floors, so a promotion can never make a product unprofitable.
          </p>
        </div>
      )}

      <Toolbar search={search} onSearch={setSearch} placeholder="Search products…">
        {FILTERS.map((f) => (
          <Chip key={f.id} active={filters.has(f.id)} onClick={() => toggleFilter(f.id)}>
            {f.label}
          </Chip>
        ))}
      </Toolbar>

      {isLoading && <EmptyState message="Loading pricing management…" />}

      {!isLoading && visible.length === 0 && (
        <EmptyState message={rows.length === 0 ? 'No priced variants yet.' : 'No products match these filters.'} />
      )}

      {!isLoading && visible.length > 0 && (
        <TableCard>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Vial</Th>
              <Th className="text-right">Wholesale</Th>
              <Th className="text-right">Low</Th>
              <Th className="text-right">High</Th>
              <Th className="text-right">Avg</Th>
              <Th className="text-right">Retail</Th>
              <Th className="text-right">vs Market</Th>
              <Th className="text-right">Gross Profit</Th>
              <Th className="text-right">Margin</Th>
              <Th>Strategy</Th>
              <Th className="text-right">Updated</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={`${r.slug}-${r.variantKey}`} className="border-b border-border last:border-0">
                <Td className="font-medium">
                  {r.productName}
                  {r.needsReview && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700">
                      review
                    </span>
                  )}
                </Td>
                <Td className="text-muted-foreground">{r.dose}</Td>
                <Td className="text-right text-muted-foreground">{money(r.wholesalePerVial)}</Td>
                <Td className="text-right text-muted-foreground">{money(r.marketLow)}</Td>
                <Td className="text-right text-muted-foreground">{money(r.marketHigh)}</Td>
                <Td className="text-right text-muted-foreground">{money(r.marketAverage)}</Td>
                <Td className="text-right font-semibold">{money(r.retailPrice)}</Td>
                <Td className="text-right">
                  {r.differenceFromMarketPct == null ? (
                    '—'
                  ) : (
                    <span className={r.priceHigherThanMarket ? 'text-destructive' : 'text-emerald-600'}>
                      {r.differenceFromMarketPct > 0 ? '+' : ''}
                      {r.differenceFromMarketPct}%
                    </span>
                  )}
                </Td>
                <Td className="text-right text-muted-foreground">{money(r.grossMargin)}</Td>
                <Td className="text-right">
                  <span
                    className={
                      r.marginPct >= 70
                        ? 'font-medium text-emerald-600'
                        : r.marginPct >= 60
                          ? 'font-medium text-amber-600'
                          : 'font-medium text-destructive'
                    }
                  >
                    {r.marginPct}%
                  </span>
                </Td>
                <Td className="max-w-[200px] whitespace-normal text-xs text-muted-foreground">{r.strategyUsed}</Td>
                <Td className="text-right text-muted-foreground">{formatDate(r.lastUpdated)}</Td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      )}
    </div>
  )
}
