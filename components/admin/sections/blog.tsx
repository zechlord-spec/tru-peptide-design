'use client'

import { useMemo, useState } from 'react'
import { Plus, FileText, Eye, PenLine } from 'lucide-react'
import { BLOG_POSTS, type BlogPost } from '@/lib/admin-data'
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

const FILTERS = ['All', 'Published', 'Draft', 'Scheduled'] as const

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function BlogSection() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return BLOG_POSTS.filter((p) => {
      const matchesQ =
        p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      const matchesF = filter === 'All' || p.status === filter
      return matchesQ && matchesF
    })
  }, [search, filter])

  const published = BLOG_POSTS.filter((p) => p.status === 'Published').length
  const totalViews = BLOG_POSTS.reduce((s, p) => s + p.views, 0)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Blog"
        description="Author, schedule, and publish editorial and educational content."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            New post
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total posts" value={BLOG_POSTS.length} icon={FileText} />
        <StatCard label="Published" value={published} icon={PenLine} />
        <StatCard label="Total views" value={totalViews.toLocaleString()} icon={Eye} />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search title or category">
        {FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </Toolbar>

      <TableCard>
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Category</Th>
            <Th>Author</Th>
            <Th>Date</Th>
            <Th className="text-right">Views</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0">
              <Td className="max-w-xs whitespace-normal font-medium">{p.title}</Td>
              <Td className="text-muted-foreground">{p.category}</Td>
              <Td className="text-muted-foreground">{p.author}</Td>
              <Td className="text-muted-foreground">{fmtDate(p.date)}</Td>
              <Td className="text-right">{p.views.toLocaleString()}</Td>
              <Td>
                <StatusBadge status={p.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      {filtered.length === 0 && <EmptyState message="No posts match your filters." />}
    </div>
  )
}
