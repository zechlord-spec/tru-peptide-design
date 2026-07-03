'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Package, Layers, Tag } from 'lucide-react'
import { PRODUCTS, CATEGORIES, priceRange } from '@/lib/products-data'
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

export function ProductsSection() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return PRODUCTS.filter((p) => {
      const matchesQ =
        p.name.toLowerCase().includes(q) || p.compoundType.toLowerCase().includes(q)
      const matchesC = category === 'All' || p.category === category
      return matchesQ && matchesC
    })
  }, [search, category])

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Products"
        description="Manage the catalog, pricing tiers, and product classifications."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total products" value={PRODUCTS.length} icon={Package} />
        <StatCard label="Categories" value={CATEGORIES.length} icon={Layers} />
        <StatCard
          label="Price tiers"
          value={PRODUCTS.reduce((s, p) => s + p.variants.length, 0)}
          icon={Tag}
        />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search product or type">
        <Chip active={category === 'All'} onClick={() => setCategory('All')}>
          All
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </Toolbar>

      <TableCard>
        <thead>
          <tr>
            <Th>Product</Th>
            <Th>Category</Th>
            <Th>Compound type</Th>
            <Th className="text-center">Variants</Th>
            <Th className="text-right">Price range</Th>
            <Th>Flags</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.slug} className="border-b border-border last:border-0">
              <Td>
                <div className="flex items-center gap-3">
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                    <Image src={p.image || '/placeholder.svg'} alt="" fill className="object-cover" sizes="40px" />
                  </span>
                  <span className="font-medium">{p.name}</span>
                </div>
              </Td>
              <Td className="text-muted-foreground">{p.category}</Td>
              <Td className="text-muted-foreground">{p.compoundType}</Td>
              <Td className="text-center">{p.variants.length}</Td>
              <Td className="text-right font-medium">{priceRange(p)}</Td>
              <Td>{p.isNew ? <StatusBadge status="New" /> : <span className="text-muted-foreground">—</span>}</Td>
            </tr>
          ))}
        </tbody>
      </TableCard>
      {filtered.length === 0 && <EmptyState message="No products match your filters." />}
    </div>
  )
}
