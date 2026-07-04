'use client'

import { useState } from 'react'
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/products-data'
import { vialLabel } from '@/lib/products-data'
import { useRetailSnapshot } from '@/lib/pricing/pricing-context'
import { retailUnitFrom } from '@/lib/pricing/format'
import { useStore } from '@/lib/store'

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useStore()
  const snapshot = useRetailSnapshot()
  const [selected, setSelected] = useState(product.variants[0].catNo)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const variant = product.variants.find((v) => v.catNo === selected) ?? product.variants[0]
  const unit = retailUnitFrom(snapshot, variant.catNo)
  const total = unit * qty

  function handleAdd() {
    addItem({
      productSlug: product.slug,
      name: product.name,
      catNo: variant.catNo,
      spec: vialLabel(variant.spec),
      price: unit,
      image: product.image,
      qty,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-[0_1px_2px_rgba(8,27,53,0.04)]">
      {/* Variant selector */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Vial size
        </span>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {product.variants.map((v) => {
            const active = v.catNo === selected
            return (
              <button
                key={v.catNo}
                type="button"
                onClick={() => setSelected(v.catNo)}
                aria-pressed={active}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  active
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                }`}
              >
                <span className="flex flex-col">
                  <span className="font-medium">{vialLabel(v.spec)}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{v.catNo}</span>
                </span>
                <span className="font-heading font-semibold">${retailUnitFrom(snapshot, v.catNo)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Quantity + total */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Qty
          </span>
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-foreground" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-xs text-muted-foreground">Total</span>
          <span className="font-heading text-2xl font-bold text-primary">${total}</span>
        </div>
      </div>

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAdd}
        className={`btn-premium mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold ${
          added
            ? 'bg-accent text-accent-foreground'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added to cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            Add to cart
          </>
        )}
      </button>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
        For laboratory and research use only. Not for human consumption or therapeutic use.
      </p>
    </div>
  )
}
