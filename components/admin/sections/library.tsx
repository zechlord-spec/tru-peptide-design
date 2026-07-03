'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, ExternalLink, Pencil } from 'lucide-react'
import { PRODUCTS, COMPOUND_TYPES } from '@/lib/products-data'
import {
  SectionHeader,
  Toolbar,
  Chip,
  TableCard,
  Th,
  Td,
  StatCard,
  EmptyState,
} from '@/components/admin/ui'

export function LibrarySection() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return PRODUCTS.filter((p) => {
      const matchesQ =
        p.name.toLowerCase().includes(q) || p.compoundType.toLowerCase().includes(q)
      const matchesT = type === 'All' || p.compoundType === type
      return matchesQ && matchesT
    })
  }, [search, type])

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Compound Library"
        description="Maintain the educational encyclopedia entries for every compound."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Add entry
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Library entries" value={PRODUCTS.length} icon={BookOpen} />
        <StatCard label="Compound types" value={COMPOUND_TYPES.length} icon={BookOpen} />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search compound or type">
        <Chip active={type === 'All'} onClick={() => setType('All')}>
          All
        </Chip>
        {COMPOUND_TYPES.map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(t)}>
            {t}
          </Chip>
        ))}
      </Toolbar>

      <TableCard>
        <thead>
          <tr>
            <Th>Compound</Th>
            <Th>Type</Th>
            <Th>Systems</Th>
            <Th>Goals</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.slug} className="border-b border-border last:border-0">
              <Td className="font-medium">{p.name}</Td>
              <Td className="text-muted-foreground">{p.compoundType}</Td>
              <Td className="text-muted-foreground">{p.systems.join(', ') || '—'}</Td>
              <Td className="text-muted-foreground">{p.goals.join(', ') || '—'}</Td>
              <Td>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${p.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <Link
                    href={`/library/${p.slug}`}
                    aria-label={`View ${p.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      {filtered.length === 0 && <EmptyState message="No compounds match your filters." />}
    </div>
  )
}
