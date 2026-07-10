'use client'

import { useMemo, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useStore, money } from '@/lib/store'
import { useRetailSnapshot } from '@/lib/pricing/pricing-context'
import { retailUnitFrom } from '@/lib/pricing/format'
import { VialImage } from '@/components/products/vial-image'
import { getAddOns, type AddOnContext, type AddOnProduct } from '@/lib/add-ons-data'

const DEFAULT_TITLE = 'Recommended Add-Ons'
const DEFAULT_SUBTITLE = 'Commonly paired research support items for your order.'

/**
 * Recommended add-on upsell section, reusable across the cart drawer, checkout,
 * and product detail page. Add-ons are resolved dynamically from add-on product
 * data — nothing is hardcoded in the UI. The section:
 *   - hides itself entirely when no add-on qualifies (no empty box),
 *   - excludes items already in the cart (no duplicate recommendations),
 *   - adapts its copy for AutoShip orders ("Add Once" + helper text), and
 *   - prices each item through the backend-owned pricing snapshot seam.
 */
export function RecommendedAddOnsSection({
  context,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  layout = 'list',
  limit,
  className = '',
}: {
  context: AddOnContext
  title?: string
  subtitle?: string
  layout?: 'list' | 'grid'
  /** Max number of add-ons to show. Defaults to the data helper's cap. */
  limit?: number
  className?: string
}) {
  const { items } = useStore()

  // Duplicate rule: never recommend something already in the cart.
  const cartCatNos = useMemo(() => items.map((i) => i.catNo), [items])
  const addOns = useMemo(
    () => getAddOns({ context, excludeCatNos: cartCatNos, limit }),
    [context, cartCatNos, limit],
  )

  // AutoShip flow: recurring add-ons are not supported, so we offer a one-time
  // "Add Once" with a clarifying note rather than implying a subscription.
  const recurring = useMemo(() => items.some((i) => i.purchaseType === 'autoship'), [items])

  // Empty state: hide the section completely.
  if (addOns.length === 0) return null

  return (
    <section
      aria-label={title}
      className={`rounded-2xl border border-border bg-secondary/40 p-4 sm:p-5 ${className}`}
    >
      <div className="flex flex-col gap-0.5">
        <h3 className="font-heading text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>

      <div
        className={
          layout === 'grid'
            ? 'mt-4 grid gap-3 sm:grid-cols-2'
            : 'mt-4 flex flex-col gap-3'
        }
      >
        {addOns.map((addOn) => (
          <AddOnProductCard key={addOn.id} addOn={addOn} recurring={recurring} />
        ))}
      </div>
    </section>
  )
}

export function AddOnBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
      {label}
    </span>
  )
}

export function AddOnProductCard({
  addOn,
  recurring = false,
}: {
  addOn: AddOnProduct
  recurring?: boolean
}) {
  const { addItem } = useStore()
  const snapshot = useRetailSnapshot()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const price = retailUnitFrom(snapshot, addOn.catNo)
  const hasPrice = price > 0
  const lowStock = addOn.inventoryStatus === 'low_stock'

  function handleAdd() {
    if (!hasPrice) return
    addItem({
      productSlug: addOn.slug,
      name: addOn.name,
      catNo: addOn.catNo,
      spec: addOn.spec,
      price,
      image: addOn.image ?? '',
      photo: addOn.image,
      qty,
      purchaseType: 'onetime',
      frequency: null,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  const addLabel = recurring ? 'Add Once' : 'Add to Order'

  return (
    <div className="flex gap-3 rounded-xl border border-border bg-card p-3">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
        <VialImage
          name={addOn.name}
          catNo={addOn.catNo}
          spec={addOn.spec}
          photo={addOn.image}
          showText={false}
          sizes="64px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="font-heading text-sm font-semibold leading-tight text-foreground">
            {addOn.name}
          </p>
          {addOn.badge ? <AddOnBadge label={addOn.badge} /> : null}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {addOn.shortDescription}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
          <span className="flex items-baseline gap-1.5">
            <span className="font-heading text-sm font-semibold text-primary">
              {hasPrice ? money(price) : '—'}
            </span>
            <span className="text-[11px] text-muted-foreground">{addOn.spec}</span>
          </span>

          <div className="flex items-center gap-2">
            {/* Quantity selector, matching the cart stepper style */}
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                aria-label={`Decrease ${addOn.name} quantity`}
              >
                <span aria-hidden="true" className="text-sm leading-none">
                  −
                </span>
              </button>
              <span className="w-5 text-center text-xs font-semibold text-foreground">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                aria-label={`Increase ${addOn.name} quantity`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!hasPrice}
              aria-disabled={!hasPrice}
              className={`flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                !hasPrice
                  ? 'cursor-not-allowed bg-secondary text-muted-foreground'
                  : added
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Added
                </>
              ) : (
                addLabel
              )}
            </button>
          </div>
        </div>

        {recurring && hasPrice ? (
          <p className="mt-1.5 text-[11px] text-muted-foreground">Adds to today&apos;s order only.</p>
        ) : null}
        {lowStock ? (
          <p className="mt-1.5 text-[11px] font-medium text-accent">Low stock</p>
        ) : null}
      </div>
    </div>
  )
}
