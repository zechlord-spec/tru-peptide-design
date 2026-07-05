'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Product } from '@/lib/data/types'
import { useRetailSnapshot } from '@/lib/pricing/pricing-context'
import { retailUnitFrom, type RetailSnapshot } from '@/lib/pricing/format'
import { ProductCard } from './product-card'
import { QuickViewModal } from './quick-view-modal'

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort()
}

type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'name', label: 'Name A–Z' },
]

// Lowest retail price for a product from the active snapshot. Returns
// Infinity when no variant is priced so unpriced products sort last and the
// catalog stays stable when the backend has not supplied prices yet.
function minPrice(p: Product, snapshot: RetailSnapshot) {
  const prices = p.variants.map((v) => retailUnitFrom(snapshot, v.catNo)).filter((n) => n > 0)
  return prices.length > 0 ? Math.min(...prices) : Number.POSITIVE_INFINITY
}

export function ProductCatalog({ products }: { products: Product[] }) {
  const snapshot = useRetailSnapshot()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [goal, setGoal] = useState<string | null>(null)
  const [system, setSystem] = useState<string | null>(null)
  const [compoundType, setCompoundType] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('featured')
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Filter options are derived from the products themselves so the catalog stays
  // in sync with whatever data source is active (local reference or backend).
  const categories = useMemo(() => uniqueSorted(products.map((p) => p.category)), [products])
  const compoundTypes = useMemo(
    () => uniqueSorted(products.map((p) => p.compoundType)),
    [products],
  )
  const goalOptions = useMemo(
    () => uniqueSorted(products.flatMap((p) => p.goals)),
    [products],
  )
  const systemOptions = useMemo(
    () => uniqueSorted(products.flatMap((p) => p.systems)),
    [products],
  )

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category && p.category !== category) return false
      if (goal && !p.goals.includes(goal)) return false
      if (system && !p.systems.includes(system)) return false
      if (compoundType && p.compoundType !== compoundType) return false
      if (search) {
        const q = search.toLowerCase()
        const haystack = [
          p.name,
          p.category,
          p.compoundType,
          ...p.goals,
          ...p.systems,
          ...p.variants.map((v) => v.catNo),
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return Number(!!b.isNew) - Number(!!a.isNew) || a.name.localeCompare(b.name)
        case 'price-asc':
          return minPrice(a, snapshot) - minPrice(b, snapshot)
        case 'price-desc':
          return minPrice(b, snapshot) - minPrice(a, snapshot)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return Number(!!b.isNew) - Number(!!a.isNew)
      }
    })
    return list
  }, [products, search, category, goal, system, compoundType, sort, snapshot])

  const activeCount = [category, goal, system, compoundType].filter(Boolean).length

  function clearAll() {
    setCategory(null)
    setGoal(null)
    setSystem(null)
    setCompoundType(null)
    setSearch('')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Search + sort bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search compounds, catalog numbers, goals…"
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            aria-label="Search products"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </button>

          <label className="sr-only" htmlFor="sort">
            Sort products
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm outline-none transition-colors focus:border-primary"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Filter sidebar */}
        <aside
          className={`${
            filtersOpen ? 'block' : 'hidden'
          } shrink-0 lg:block lg:w-64`}
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-foreground">Filters</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                  Clear
                </button>
              )}
            </div>

            <FilterGroup title="Category" options={categories} selected={category} onSelect={setCategory} />
            <FilterGroup title="Goal" options={goalOptions} selected={goal} onSelect={setGoal} />
            <FilterGroup title="TRU System" options={systemOptions} selected={system} onSelect={setSystem} />
            <FilterGroup
              title="Compound Type"
              options={compoundTypes}
              selected={compoundType}
              onSelect={setCompoundType}
            />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <p className="mb-5 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'compound' : 'compounds'}
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
              <p className="font-heading text-lg text-foreground">No compounds match your filters</p>
              <button
                type="button"
                onClick={clearAll}
                className="btn-premium mt-3 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} onQuickView={setQuickView} />
              ))}
            </div>
          )}
        </div>
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  )
}

function FilterGroup({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: string[]
  selected: string | null
  onSelect: (value: string | null) => void
}) {
  return (
    <div className="mt-6 border-t border-border pt-5 first:mt-4 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(active ? null : option)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
