'use client'

import { useMemo, useState } from 'react'
import { FileCheck2, FileClock, FlaskConical, Check, Download } from 'lucide-react'
import { COAS, type CoaRecord } from '@/lib/admin-data'
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

const FILTERS = ['All', 'Published', 'Pending', 'Expired'] as const

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CoasSection() {
  const [rows, setRows] = useState<CoaRecord[]>(COAS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  function publish(batch: string) {
    setRows((prev) => prev.map((r) => (r.batch === batch ? { ...r, status: 'Published' } : r)))
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter((r) => {
      const matchesQ =
        r.product.toLowerCase().includes(q) ||
        r.batch.toLowerCase().includes(q) ||
        r.lab.toLowerCase().includes(q)
      const matchesF = filter === 'All' || r.status === filter
      return matchesQ && matchesF
    })
  }, [rows, search, filter])

  const published = rows.filter((r) => r.status === 'Published').length
  const pending = rows.filter((r) => r.status === 'Pending').length

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Certificates of Analysis"
        description="Manage third-party lab reports, purity results, and publication status."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total COAs" value={rows.length} icon={FlaskConical} />
        <StatCard label="Published" value={published} icon={FileCheck2} />
        <StatCard label="Pending review" value={pending} icon={FileClock} />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search product, batch, or lab">
        {FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </Toolbar>

      <TableCard>
        <thead>
          <tr>
            <Th>Batch</Th>
            <Th>Product</Th>
            <Th>Lab</Th>
            <Th className="text-right">Purity</Th>
            <Th>Tested</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.batch} className="border-b border-border last:border-0">
              <Td className="font-mono text-xs">{r.batch}</Td>
              <Td className="font-medium">{r.product}</Td>
              <Td className="text-muted-foreground">{r.lab}</Td>
              <Td className="text-right font-semibold">{r.purity}</Td>
              <Td className="text-muted-foreground">{fmtDate(r.testedOn)}</Td>
              <Td>
                <StatusBadge status={r.status} />
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-2">
                  {r.status === 'Pending' && (
                    <button
                      type="button"
                      onClick={() => publish(r.batch)}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Publish
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={`Download ${r.batch}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      {filtered.length === 0 && <EmptyState message="No certificates match your filters." />}
    </div>
  )
}
