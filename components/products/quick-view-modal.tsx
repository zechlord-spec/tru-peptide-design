'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, FlaskConical, FileText, Target, Layers } from 'lucide-react'
import { type Product, vialLabel } from '@/lib/products-data'
import { useRetailSnapshot, formatUSD } from '@/lib/pricing/pricing-context'
import { retailUnitFrom } from '@/lib/pricing/format'

type QuickViewModalProps = {
  product: Product | null
  onClose: () => void
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const snapshot = useRetailSnapshot()
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (product) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in"
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl duration-300 animate-in fade-in zoom-in-95 md:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary"
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Image side */}
        <div className="relative aspect-square w-full shrink-0 bg-secondary md:aspect-auto md:w-2/5">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
            <FlaskConical className="h-3 w-3" aria-hidden="true" />
            Research Only
          </span>
        </div>

        {/* Content side */}
        <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {product.category} • {product.compoundType}
          </p>
          <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground text-balance">{product.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.blurb}</p>

          {/* Associations */}
          <div className="mt-5 space-y-3">
            {product.goals.length > 0 && (
              <div className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground/70" aria-hidden="true" />
                <div className="flex flex-wrap gap-1.5">
                  {product.goals.map((goal) => (
                    <span
                      key={goal}
                      className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.systems.length > 0 && (
              <div className="flex items-start gap-2">
                <Layers className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground/70" aria-hidden="true" />
                <div className="flex flex-wrap gap-1.5">
                  {product.systems.map((system) => (
                    <span
                      key={system}
                      className="rounded-full border border-accent/40 px-2.5 py-1 text-[11px] font-medium text-accent-foreground/80"
                    >
                      {system}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Variants table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2 border-b border-border bg-secondary px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Cat. No.</span>
              <span>Vial</span>
              <span className="text-right">Per Vial</span>
            </div>
            <ul className="divide-y divide-border">
              {product.variants.map((v) => (
                <li
                  key={v.catNo}
                  className="grid grid-cols-[1fr_2fr_auto] items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-secondary/50"
                >
                  <span className="font-mono text-xs text-muted-foreground">{v.catNo}</span>
                  <span className="text-foreground">{vialLabel(v.spec)}</span>
                  <span className="text-right font-heading font-semibold text-primary">
                    {formatUSD(retailUnitFrom(snapshot, v.catNo))}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add to Inquiry
            </button>
            <a
              href="#coa"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Download COA
            </a>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            For laboratory and research use only. Not for human consumption or therapeutic use.
          </p>
        </div>
      </div>
    </div>
  )
}
