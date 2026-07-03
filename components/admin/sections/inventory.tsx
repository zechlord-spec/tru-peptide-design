'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus, Boxes, AlertTriangle } from 'lucide-react'
import { INVENTORY, type InventoryRow, money } from '@/lib/admin-data'
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

const FILTERS = ['All', 'In stock', 'Low stock', 'Out of stock'] as const

function statusFor(stock: number, reorder: number): InventoryRow['status'] {
  return stock === 0 ? 'Out of stock' : stock <= reorder ? 'Low stock' : 'In stock'
}

export function InventorySection() {
  const [rows, setRows] = useState<InventoryRow[]>(INVENTORY)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  function adjust(catNo: string, delta: number) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.catNo !== catNo) return r
        const stock = Math.max(0, r.stock + delta)
        return { ...r, stock, status: statusFor(stock, r.reorderPoint) }
      }),
    )
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter((r) => {
      const matchesQ =
        r.product.toLowerCase().includes(q) || r.catNo.toLowerCase().includes(q)
      const matchesF = filter === 'All' || r.status === filter
      return matchesQ && matchesF
    })
  }, [rows, search, filter])

  const totalUnits = rows.reduce((s, r) => s + r.stock, 0)
  const lowCount = rows.filter((r) => r.status !== 'In stock').length
  const stockValue = rows.reduce((s, r) => s + r.stock * r.price, 0)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Inventory"
        description="Track stock levels per SKU, adjust counts, and monitor reorder thresholds."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Units in stock" value={totalUnits.toLocaleString()} icon={Boxes} />
        <StatCard label="SKUs to reorder" value={lowCount} icon={AlertTriangle} />
        <StatCard label="Stock value" value={money(stockValue)} icon={Boxes} />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search product or Cat. No.">
        {FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </Toolbar>

      <TableCard>
        <thead>
          <tr>
            <Th>Cat. No.</Th>
            <Th>Product</Th>
            <Th>Spec</Th>
            <Th className="text-right">Stock</Th>
            <Th className="text-center">Adjust</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.catNo} className="border-b border-border last:border-0">
              <Td className="font-mono text-xs">{r.catNo}</Td>
              <Td className="font-medium">{r.product}</Td>
              <Td className="text-muted-foreground">{r.spec}</Td>
              <Td className="text-right font-semibold">{r.stock}</Td>
              <Td>
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    aria-label={`Decrease ${r.catNo}`}
                    onClick={() => adjust(r.catNo, -10)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Increase ${r.catNo}`}
                    onClick={() => adjust(r.catNo, 10)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Td>
              <Td>
                <StatusBadge status={r.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      {filtered.length === 0 && <EmptyState message="No SKUs match your filters." />}
    </div>
  )
}
