'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { X, Minus, Plus, ShoppingBag, Trash2, Repeat } from 'lucide-react'
import { useStore, money } from '@/lib/store'
import { VialImage } from '@/components/products/vial-image'
import { RecommendedAddOnsSection } from '@/components/shop/recommended-add-ons'

function nextShipment(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, items, updateQty, removeItem, subtotal, count } = useStore()

  // Lock body scroll when open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setCartOpen])

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!cartOpen}
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[60] bg-primary/30 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300 ease-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Your Bag {count > 0 && <span className="text-muted-foreground">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            aria-label="Close bag"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-foreground">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore our research compounds to get started.
              </p>
            </div>
            <Link
              href="/products"
              onClick={() => setCartOpen(false)}
              className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Compounds
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <VialImage
                      name={item.name}
                      catNo={item.catNo}
                      spec={item.spec}
                      photo={item.photo}
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.productSlug}`}
                          onClick={() => setCartOpen(false)}
                          className="font-heading text-sm font-semibold leading-tight text-foreground hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.spec}</p>
                        {item.purchaseType === 'autoship' ? (
                          <span className="mt-1.5 inline-flex flex-col gap-0.5">
                            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                              <Repeat className="h-3 w-3" />
                              TRU AutoShip
                            </span>
                            {item.frequency ? (
                              <span className="text-[11px] text-muted-foreground">
                                Every {item.frequency} days · next ~ {nextShipment(item.frequency)}
                              </span>
                            ) : null}
                          </span>
                        ) : (
                          <span className="mt-1.5 inline-flex w-fit items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            One-Time
                          </span>
                        )}
                      </div>
                      <span className="whitespace-nowrap font-heading text-sm font-semibold text-primary">
                        {money(item.price * item.qty)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-foreground">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-6 pt-5">
              <RecommendedAddOnsSection context="cart" />
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-heading text-lg font-bold text-primary">{money(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shipping &amp; tax calculated at checkout.
              </p>
              <p className="mt-2 rounded-lg bg-secondary/60 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                For laboratory and research use only. Not for human consumption.
              </p>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="btn-premium mt-4 flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Check Out
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="mt-2 w-full rounded-full px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
