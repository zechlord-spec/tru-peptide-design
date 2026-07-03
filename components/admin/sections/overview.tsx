'use client'

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  FileWarning,
} from 'lucide-react'
import { KPIS, ORDERS, money } from '@/lib/admin-data'
import { StatCard, SectionHeader, TableCard, Th, Td, StatusBadge } from '@/components/admin/ui'

function relativeDate(iso: string) {
  const days = Math.round((Date.now() - +new Date(iso)) / 864e5)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

export function OverviewSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  const recent = ORDERS.slice(0, 6)
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Overview"
        description="A live snapshot of store performance, operations, and catalog health."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue (paid)" value={money(KPIS.revenue)} icon={DollarSign} delta={12.4} hint="vs last period" />
        <StatCard label="Orders" value={KPIS.orders} icon={ShoppingBag} delta={8.1} hint="vs last period" />
        <StatCard label="Customers" value={KPIS.customers} icon={Users} delta={5.6} hint="vs last period" />
        <StatCard label="Avg. order value" value={money(KPIS.aov)} icon={Package} delta={-2.3} hint="vs last period" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate('inventory')}
          className="flex items-center gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-left transition-colors hover:bg-amber-500/10"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/15 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <div className="font-heading text-lg font-semibold text-foreground">{KPIS.lowStock} SKUs</div>
            <div className="text-sm text-muted-foreground">need restocking</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('coas')}
          className="flex items-center gap-4 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 text-left transition-colors hover:bg-sky-500/10"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500/15 text-sky-700">
            <FileWarning className="h-5 w-5" />
          </span>
          <div>
            <div className="font-heading text-lg font-semibold text-foreground">{KPIS.pendingCoas} COAs</div>
            <div className="text-sm text-muted-foreground">pending review</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('products')}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
            <Package className="h-5 w-5" />
          </span>
          <div>
            <div className="font-heading text-lg font-semibold text-foreground">{KPIS.products} products</div>
            <div className="text-sm text-muted-foreground">across {KPIS.systems} systems</div>
          </div>
        </button>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent orders</h2>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="text-sm font-medium text-accent-foreground underline-offset-4 hover:underline"
          >
            View all
          </button>
        </div>
        <TableCard>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th className="text-right">Total</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <Td className="font-medium">{o.id}</Td>
                <Td>{o.customer}</Td>
                <Td className="text-muted-foreground">{relativeDate(o.date)}</Td>
                <Td className="text-right font-medium">{money(o.total)}</Td>
                <Td>
                  <StatusBadge status={o.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      </div>
    </div>
  )
}
