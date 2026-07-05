'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Target, ExternalLink, Pencil } from 'lucide-react'
import { GOALS } from '@/lib/goals-data'
import { iconFor } from '@/lib/icons'
import { SectionHeader, StatCard, Toolbar } from '@/components/admin/ui'

export function GoalsSection() {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase()
  const filtered = GOALS.filter(
    (g) => g.name.toLowerCase().includes(q) || g.tagline.toLowerCase().includes(q),
  )

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Goals"
        description="Manage goal-based landing hubs that group systems, products, and articles."
        action={
          <button
            type="button"
            className="btn-premium inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add goal
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total goals" value={GOALS.length} icon={Target} />
        <StatCard
          label="Systems linked"
          value={GOALS.reduce((s, g) => s + g.systems.length, 0)}
          icon={Target}
        />
        <StatCard
          label="Articles linked"
          value={GOALS.reduce((s, g) => s + g.articles.length, 0)}
          icon={Target}
        />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search goal" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => {
          const Icon = iconFor(g.iconKey)
          return (
            <div key={g.slug} className="flex flex-col rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{g.name}</h3>
                  <p className="text-xs text-muted-foreground">{g.tagline}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-secondary py-2">
                  <div className="font-heading text-lg font-semibold text-foreground">{g.systems.length}</div>
                  <div className="text-[11px] text-muted-foreground">Systems</div>
                </div>
                <div className="rounded-xl bg-secondary py-2">
                  <div className="font-heading text-lg font-semibold text-foreground">{g.products.length}</div>
                  <div className="text-[11px] text-muted-foreground">Products</div>
                </div>
                <div className="rounded-xl bg-secondary py-2">
                  <div className="font-heading text-lg font-semibold text-foreground">{g.articles.length}</div>
                  <div className="text-[11px] text-muted-foreground">Articles</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <Link
                  href="/goals"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
