'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Boxes, ExternalLink, Pencil } from 'lucide-react'
import { SYSTEMS } from '@/lib/systems-data'
import { SectionHeader, StatCard, Toolbar } from '@/components/admin/ui'
import { Layers } from 'lucide-react'

export function SystemsSection() {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase()
  const filtered = SYSTEMS.filter(
    (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
  )

  return (
    <div className="space-y-6">
      <SectionHeader
        title="TRU Systems"
        description="Curate the branded protocol systems and their compound line-ups."
        action={
          <button
            type="button"
            className="btn-premium inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add system
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total systems" value={SYSTEMS.length} icon={Layers} />
        <StatCard
          label="Compounds mapped"
          value={SYSTEMS.reduce((s, x) => s + x.compounds.length, 0)}
          icon={Boxes}
        />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search system or category" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.slug} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative h-32 w-full overflow-hidden bg-secondary">
                <Image src={s.image || '/placeholder.svg'} alt="" fill className="object-cover" sizes="360px" />
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 text-primary backdrop-blur">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading font-semibold text-foreground">{s.trademark}</h3>
                  <span className="text-xs text-muted-foreground">{s.compounds.length} compounds</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.category}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.tagline}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <Link
                    href={`/systems/${s.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
