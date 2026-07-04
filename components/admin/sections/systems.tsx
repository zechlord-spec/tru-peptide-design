'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Layers, Boxes, Tags, Star, Search } from 'lucide-react'
import { getAdminCatalogAction } from '@/app/actions/catalog'
import { SectionHeader, StatCard, EmptyState } from '@/components/admin/ui'
import { SystemEditor } from '@/components/admin/systems/system-editor'
import { ProductTagsEditor } from '@/components/admin/systems/product-tags-editor'

type Tab = 'systems' | 'tagging'

export function SystemsSection() {
  const { data, isLoading, mutate } = useSWR('admin-catalog', getAdminCatalogAction)
  const [tab, setTab] = useState<Tab>('systems')
  const [activeSystem, setActiveSystem] = useState<string | null>(null)
  const [productSearch, setProductSearch] = useState('')

  const systems = data?.systems ?? []
  const products = data?.products ?? []

  const selectedSystem = useMemo(
    () => systems.find((s) => s.slug === (activeSystem ?? systems[0]?.slug)),
    [systems, activeSystem],
  )

  const taggedCount = products.filter((p) => p.tags.length > 0).length
  const featuredCount = products.filter((p) => p.featured).length

  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [products, productSearch])

  const refresh = () => mutate()

  return (
    <div className="space-y-6">
      <SectionHeader
        title="TRU Systems"
        description="Curate branded protocol systems with tag-driven products, pinned picks, and recommended stacks."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total systems" value={systems.length} icon={Layers} />
        <StatCard label="Products tagged" value={taggedCount} icon={Tags} />
        <StatCard label="Featured products" value={featuredCount} icon={Star} />
        <StatCard label="Total products" value={products.length} icon={Boxes} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <TabButton active={tab === 'systems'} onClick={() => setTab('systems')}>
          System Curation
        </TabButton>
        <TabButton active={tab === 'tagging'} onClick={() => setTab('tagging')}>
          Product Tagging
        </TabButton>
      </div>

      {isLoading && <EmptyState message="Loading catalog…" />}

      {!isLoading && tab === 'systems' && (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* System list */}
          <div className="flex flex-col gap-1.5">
            {systems.map((s) => {
              const isActive = selectedSystem?.slug === s.slug
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setActiveSystem(s.slug)}
                  className={
                    isActive
                      ? 'flex items-center justify-between rounded-xl bg-primary px-3.5 py-2.5 text-left text-sm font-medium text-primary-foreground'
                      : 'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary'
                  }
                >
                  <span className="truncate">{s.trademark}</span>
                  <span
                    className={
                      isActive
                        ? 'ml-2 text-xs text-primary-foreground/70'
                        : 'ml-2 text-xs text-muted-foreground'
                    }
                  >
                    {s.memberSlugs.length}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Editor */}
          <div className="rounded-2xl border border-border bg-card p-5">
            {selectedSystem ? (
              <>
                <div className="mb-5 border-b border-border pb-4">
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    {selectedSystem.trademark}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {selectedSystem.memberSlugs.length} products ·{' '}
                    {selectedSystem.tags.join(', ') || 'no system tags'}
                  </p>
                </div>
                <SystemEditor
                  key={selectedSystem.slug}
                  system={selectedSystem}
                  products={products}
                  onChanged={refresh}
                />
              </>
            ) : (
              <EmptyState message="Select a system to curate." />
            )}
          </div>
        </div>
      )}

      {!isLoading && tab === 'tagging' && (
        <div className="space-y-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search product, category, or tag"
              className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-ring"
            />
          </div>
          <ProductTagsEditor products={filteredProducts} onChanged={refresh} />
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? '-mb-px border-b-2 border-primary px-4 py-2.5 text-sm font-semibold text-foreground'
          : '-mb-px border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground'
      }
    >
      {children}
    </button>
  )
}
