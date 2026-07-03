'use client'

import { useMemo, useState } from 'react'
import { ShoppingBag, DollarSign, Clock } from 'lucide-react'
import { ORDERS, type AdminOrder, type AdminOrderStatus, money } from '@/lib/admin-data'
import {
  SectionHeader,
  Toolbar,
  Chip,
  TableCard,
  Th,
  Td,
  StatusBadge,
  StatCard,
  EmptyState,
} from '@/components/admin/ui'

const FILTERS = ['All', 'Processing', 'Shipped', 'Delivered', 'Refunded'] as const
const STATUS_OPTIONS: AdminOrderStatus[] = ['Processing', 'Shipped', 'Delivered', 'Refunded']

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function OrdersSection() {
  const [orders, setOrders] = useState<AdminOrder[]>(ORDERS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  function setStatus(id: string, status: AdminOrderStatus) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status, payment: status === 'Refunded' ? 'Refunded' : 'Paid' }
          : o,
      ),
    )
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return orders.filter((o) => {
      const matchesQ =
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q)
      const matchesF = filter === 'All' || o.status === filter
      return matchesQ && matchesF
    })
  }, [orders, search, filter])

  const revenue = orders.filter((o) => o.payment === 'Paid').reduce((s, o) => s + o.total, 0)
  const processing = orders.filter((o) => o.status === 'Processing').length

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Orders"
        description="Review incoming orders, update fulfillment status, and track revenue."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total orders" value={orders.length} icon={ShoppingBag} />
        <StatCard label="Awaiting fulfillment" value={processing} icon={Clock} />
        <StatCard label="Revenue" value={money(revenue)} icon={DollarSign} />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search order, name, or email">
        {FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </Toolbar>

      <TableCard>
        <thead>
          <tr>
            <Th>Order</Th>
            <Th>Customer</Th>
            <Th>Date</Th>
            <Th className="text-center">Items</Th>
            <Th className="text-right">Total</Th>
            <Th>Payment</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o.id} className="border-b border-border last:border-0">
              <Td className="font-medium">{o.id}</Td>
              <Td>
                <div className="font-medium">{o.customer}</div>
                <div className="text-xs text-muted-foreground">{o.email}</div>
              </Td>
              <Td className="text-muted-foreground">{fmtDate(o.date)}</Td>
              <Td className="text-center">{o.items}</Td>
              <Td className="text-right font-medium">{money(o.total)}</Td>
              <Td>
                <StatusBadge status={o.payment} />
              </Td>
              <Td>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value as AdminOrderStatus)}
                  aria-label={`Status for ${o.id}`}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-ring"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      {filtered.length === 0 && <EmptyState message="No orders match your filters." />}
    </div>
  )
}
