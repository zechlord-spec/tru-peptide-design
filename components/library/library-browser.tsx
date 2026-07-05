'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, BookOpen, ArrowUpRight } from 'lucide-react'
import type { Product } from '@/lib/data/types'

export function LibraryBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchesType = type === 'All' || p.compoundType === type
      const matchesQuery =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.compoundType.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      return matchesType && matchesQuery
    })
  }, [products, query, type])

  const compoundTypes = useMemo(
    () => Array.from(new Set(products.map((p) => p.compoundType))).sort(),
    [products],
  )
  const filters = ['All', ...compoundTypes]

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search compounds, classes, or research areas…"
            aria-label="Search the compound library"
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground shadow-[0_1px_2px_rgba(8,27,53,0.04)] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setType(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                type === f
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="mt-8 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'compound' : 'compounds'}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.slug}
              href={`/library/${p.slug}`}
              className="group flex flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.32)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  {p.compoundType}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-heading text-xl font-bold text-primary text-balance">
                {p.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.category}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.goals.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                Read the science
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center">
          <p className="font-heading text-lg text-foreground">No compounds match your search</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different term or clear the filters.
          </p>
        </div>
      )}
    </div>
  )
}
