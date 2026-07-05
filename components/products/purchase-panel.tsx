'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Repeat,
  ShieldCheck,
  FlaskConical,
  Truck,
  Lock,
  BadgeCheck,
  CalendarClock,
  X,
} from 'lucide-react'
import type { Product } from '@/lib/data/types'
import { vialLabel } from '@/lib/data/format'
import { useRetailSnapshot } from '@/lib/pricing/pricing-context'
import { retailUnitFrom } from '@/lib/pricing/format'
import { useStore, money, AUTOSHIP_DISCOUNT, type PurchaseType } from '@/lib/store'

const FREQUENCIES = [
  { days: 30, label: 'Every 30 days' },
  { days: 60, label: 'Every 60 days' },
  { days: 90, label: 'Every 90 days' },
] as const

const TRUST = [
  { icon: FlaskConical, label: 'Third-Party Tested' },
  { icon: BadgeCheck, label: 'Research Grade' },
  { icon: ShieldCheck, label: 'COA Available' },
  { icon: Lock, label: 'Secure Checkout' },
  { icon: Truck, label: 'Fast, Cold-Chain Shipping' },
  { icon: Check, label: 'Quality Guaranteed' },
]

function nextDelivery(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type PanelState = {
  product: Product
  purchaseType: PurchaseType
  setPurchaseType: (t: PurchaseType) => void
  selected: string
  setSelected: (catNo: string) => void
  qty: number
  setQty: (fn: (q: number) => number) => void
  frequency: number
  setFrequency: (d: number) => void
  custom: boolean
  setCustom: (b: boolean) => void
  idPrefix: string
}

/* ------------------ Shared options body ------------------ */

function PurchaseOptions(s: PanelState) {
  const { product } = s
  const snapshot = useRetailSnapshot()
  const variant = product.variants.find((v) => v.catNo === s.selected) ?? product.variants[0]
  const base = retailUnitFrom(snapshot, variant.catNo)
  const hasPrice = base > 0
  const autoshipUnit = Math.round(base * (1 - AUTOSHIP_DISCOUNT))
  const savingsPct = Math.round(AUTOSHIP_DISCOUNT * 100)
  // Show a neutral placeholder until a backend supplies live prices.
  const priceOrDash = (catNo: string) => {
    const p = retailUnitFrom(snapshot, catNo)
    return p > 0 ? money(p) : '—'
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Specification selector */}
      {product.variants.length > 1 && (
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Vial size
          </span>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {product.variants.map((v) => {
              const active = v.catNo === s.selected
              return (
                <button
                  key={v.catNo}
                  type="button"
                  onClick={() => s.setSelected(v.catNo)}
                  aria-pressed={active}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all duration-300 ${
                    active
                      ? 'border-primary bg-primary/5 text-primary shadow-[0_1px_2px_rgba(8,27,53,0.06)]'
                      : 'border-border bg-background text-foreground hover:border-primary/40'
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="font-medium">{vialLabel(v.spec)}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{v.catNo}</span>
                  </span>
                  <span className="font-heading text-sm font-semibold">{priceOrDash(v.catNo)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Purchase options */}
      <div role="radiogroup" aria-label="Purchase type" className="flex flex-col gap-3">
        {/* One-time */}
        <button
          type="button"
          role="radio"
          aria-checked={s.purchaseType === 'onetime'}
          onClick={() => s.setPurchaseType('onetime')}
          className={`group relative rounded-2xl border p-4 text-left transition-all duration-300 ${
            s.purchaseType === 'onetime'
              ? 'border-primary bg-primary/[0.04] shadow-[0_8px_24px_-16px_rgba(8,27,53,0.35)]'
              : 'border-border bg-background hover:border-primary/40'
          }`}
        >
          <div className="flex items-start gap-3">
            <RadioDot active={s.purchaseType === 'onetime'} />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-sm font-semibold text-primary">One-Time Purchase</span>
                <span className="font-heading text-base font-bold text-primary">
                  {hasPrice ? money(base) : '—'}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                A single delivery. No recurring shipments.
              </p>
            </div>
          </div>
        </button>

        {/* AutoShip */}
        <button
          type="button"
          role="radio"
          aria-checked={s.purchaseType === 'autoship'}
          onClick={() => s.setPurchaseType('autoship')}
          className={`group relative rounded-2xl border p-4 text-left transition-all duration-300 ${
            s.purchaseType === 'autoship'
              ? 'border-accent bg-accent/[0.06] shadow-[0_8px_24px_-16px_rgba(8,27,53,0.35)]'
              : 'border-border bg-background hover:border-accent/50'
          }`}
        >
          <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            Best Value
          </span>
          <div className="flex items-start gap-3">
            <RadioDot active={s.purchaseType === 'autoship'} accent />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-primary">
                  <Repeat className="h-3.5 w-3.5 text-accent" />
                  TRU AutoShip
                </span>
                <span className="flex items-baseline gap-1.5">
                  {hasPrice ? (
                    <>
                      <span className="text-xs text-muted-foreground line-through">{money(base)}</span>
                      <span className="font-heading text-base font-bold text-primary">
                        {money(autoshipUnit)}
                      </span>
                    </>
                  ) : (
                    <span className="font-heading text-base font-bold text-primary">—</span>
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Save {savingsPct}% on every delivery. Pause, skip or cancel anytime.
              </p>

              {/* Frequency selector (only when active) */}
              <div
                className={`grid transition-all duration-300 ${
                  s.purchaseType === 'autoship' ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Delivery frequency
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {FREQUENCIES.map((f) => {
                      const active = !s.custom && s.frequency === f.days
                      return (
                        <span
                          key={f.days}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation()
                            s.setCustom(false)
                            s.setFrequency(f.days)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              e.stopPropagation()
                              s.setCustom(false)
                              s.setFrequency(f.days)
                            }
                          }}
                          className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            active
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-card text-foreground hover:border-primary/40'
                          }`}
                        >
                          {f.days} days
                        </span>
                      )
                    })}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        s.setCustom(true)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          s.setCustom(true)
                        }
                      }}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        s.custom
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-foreground hover:border-primary/40'
                      }`}
                    >
                      Custom
                    </span>
                  </div>

                  {s.custom && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <label htmlFor={`${s.idPrefix}-custom-freq`} className="text-xs text-muted-foreground">
                        Every
                      </label>
                      <input
                        id={`${s.idPrefix}-custom-freq`}
                        type="number"
                        min={7}
                        max={180}
                        value={s.frequency}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => s.setFrequency(Math.max(7, Math.min(180, Number(e.target.value) || 7)))}
                        className="w-20 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                      />
                      <span className="text-xs text-muted-foreground">days</span>
                    </div>
                  )}

                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-secondary/70 px-3 py-2 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5 text-accent" />
                    Next delivery ~ {nextDelivery(s.frequency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Quantity
        </span>
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            onClick={() => s.setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-9 text-center text-sm font-semibold text-foreground" aria-live="polite">
            {s.qty}
          </span>
          <button
            type="button"
            onClick={() => s.setQty((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function RadioDot({ active, accent }: { active: boolean; accent?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
        active ? (accent ? 'border-accent' : 'border-primary') : 'border-border'
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
          active ? (accent ? 'scale-100 bg-accent' : 'scale-100 bg-primary') : 'scale-0 bg-transparent'
        }`}
      />
    </span>
  )
}

/* ------------------ Main panel ------------------ */

export function PurchasePanel({ product }: { product: Product }) {
  const { addItem } = useStore()
  const snapshot = useRetailSnapshot()
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('autoship')
  const [selected, setSelected] = useState(product.variants[0].catNo)
  const [qty, setQty] = useState(1)
  const [frequency, setFrequency] = useState(30)
  const [custom, setCustom] = useState(false)
  const [added, setAdded] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const variant = product.variants.find((v) => v.catNo === selected) ?? product.variants[0]
  const base = retailUnitFrom(snapshot, variant.catNo)
  const hasPrice = base > 0
  const isAuto = purchaseType === 'autoship'
  const unit = isAuto ? Math.round(base * (1 - AUTOSHIP_DISCOUNT)) : base
  const total = unit * qty
  const savings = (base - unit) * qty
  const savingsPct = Math.round(AUTOSHIP_DISCOUNT * 100)

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  function handleAdd() {
    if (!hasPrice) return
    addItem({
      productSlug: product.slug,
      name: product.name,
      catNo: variant.catNo,
      spec: vialLabel(variant.spec),
      price: unit,
      image: product.image,
      qty,
      purchaseType,
      frequency: isAuto ? frequency : null,
    })
    setAdded(true)
    setDrawerOpen(false)
    window.setTimeout(() => setAdded(false), 2200)
  }

  const state: PanelState = {
    product,
    purchaseType,
    setPurchaseType,
    selected,
    setSelected,
    qty,
    setQty,
    frequency,
    setFrequency,
    custom,
    setCustom,
    idPrefix: 'panel',
  }

  const cta = (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!hasPrice}
      aria-disabled={!hasPrice}
      className={`btn-premium flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition-colors ${
        !hasPrice
          ? 'cursor-not-allowed bg-secondary text-muted-foreground'
          : added
            ? 'bg-accent text-accent-foreground'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
      }`}
    >
      {!hasPrice ? (
        'Pricing unavailable'
      ) : added ? (
        <>
          <Check className="h-5 w-5" />
          Added to cart
        </>
      ) : isAuto ? (
        <>
          <Repeat className="h-5 w-5" />
          Start AutoShip
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" />
          Add to Cart
        </>
      )}
    </button>
  )

  const totalBlock = (
    <div className="flex items-end justify-between gap-4">
      <div>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {isAuto ? 'Per delivery' : 'Total'}
        </span>
        <span
          key={`${purchaseType}-${total}`}
          className="animate-soft-fade inline-block font-heading text-3xl font-bold text-primary"
        >
          {hasPrice ? money(total) : '—'}
        </span>
      </div>
      <div
        className={`transition-all duration-500 ${
          isAuto && hasPrice
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-1 opacity-0'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-primary">
          You save {money(savings)} ({savingsPct}%)
        </span>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sticky card */}
      <div className="hidden lg:block lg:sticky lg:top-28">
        <div className="rounded-[1.75rem] border border-border/60 bg-card p-6 shadow-[0_30px_70px_-45px_rgba(8,27,53,0.5)]">
          <PurchaseOptions {...state} />
          <div className="mt-5 border-t border-border/60 pt-5">
            {totalBlock}
            <div className="mt-4">{cta}</div>
            {isAuto && (
              <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
                Pause, skip or cancel anytime. TRU AutoShip is a delivery program, not a membership.
              </p>
            )}
          </div>

          {/* Trust indicators */}
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border/60 pt-5">
            {TRUST.map((t) => (
              <span key={t.label} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <t.icon className="h-3.5 w-3.5 flex-none text-accent" />
                {t.label}
              </span>
            ))}
          </div>

          <p className="mt-5 rounded-xl bg-secondary/60 px-4 py-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            For laboratory and research use only. Not for human consumption.
          </p>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {!hasPrice ? 'Research use only' : isAuto ? `AutoShip · save ${savingsPct}%` : 'One-time'}
            </span>
            <span className="font-heading text-xl font-bold text-primary">
              {hasPrice ? money(total) : '—'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="btn-premium flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            {isAuto ? <Repeat className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            Choose options
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        aria-hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-primary/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Purchase options"
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-[1.75rem] border-t border-border bg-card px-5 pb-8 pt-4 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" aria-hidden="true" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-primary">{product.name}</h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            aria-label="Close options"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <PurchaseOptions {...state} idPrefix="drawer" />

        <div className="mt-5 border-t border-border/60 pt-5">
          {totalBlock}
          <div className="mt-4">{cta}</div>
          {isAuto && (
            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
              Pause, skip or cancel anytime. TRU AutoShip is a delivery program, not a membership.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
