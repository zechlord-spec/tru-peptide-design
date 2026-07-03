'use client'

import { useMemo, useState } from 'react'
import { Users, Crown, Repeat } from 'lucide-react'
import { CUSTOMERS, money } from '@/lib/admin-data'
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

const FILTERS = ['All', 'Top', 'Returning', 'New'] as const

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
}

export function CustomersSection() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return CUSTOMERS.filter((c) => {
      const matchesQ =
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      const matchesF = filter === 'All' || c.tier === filter
      return matchesQ && matchesF
    })
  }, [search, filter])

  const topTier = CUSTOMERS.filter((c) => c.tier === 'Top').length
  const returning = CUSTOMERS.filter((c) => c.tier === 'Returning').length

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Customers"
        description="Understand your buyer base, lifetime value, and spending tiers."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total customers" value={CUSTOMERS.length} icon={Users} />
        <StatCard label="Top tier" value={topTier} icon={Crown} />
        <StatCard label="Returning" value={returning} icon={Repeat} />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search name or email">
        {FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </Toolbar>

      <TableCard>
        <thead>
          <tr>
            <Th>Customer</Th>
            <Th>Joined</Th>
            <Th className="text-center">Orders</Th>
            <Th className="text-right">Lifetime value</Th>
            <Th>Tier</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0">
              <Td>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {initials(c.name)}
                  </span>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </div>
                </div>
              </Td>
              <Td className="text-muted-foreground">{fmtDate(c.joined)}</Td>
              <Td className="text-center">{c.orders}</Td>
              <Td className="text-right font-medium">{money(c.spent)}</Td>
              <Td>
                <StatusBadge status={c.tier} />
              </Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      {filtered.length === 0 && <EmptyState message="No customers match your filters." />}
    </div>
  )
}
