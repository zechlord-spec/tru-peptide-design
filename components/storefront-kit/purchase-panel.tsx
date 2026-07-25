'use client'

import { type ReactNode } from 'react'
import { Repeat, ShoppingBag, FlaskConical } from 'lucide-react'
import { StrengthSelector, type StrengthOption } from './strength-selector'
import { QuantitySelector } from './quantity-selector'
import { MarketComparison } from './market-comparison'
import { InstitutionalPricingNote } from './institutional-pricing-note'
import { perVial, hasPrice, formatUSD } from './format'

export type PurchaseKind = 'onetime' | 'autoship'

export type ProductPurchasePanelProps = {
  name: string
  strengths: StrengthOption[]
  selectedStrength: string
  onSelectStrength: (id: string) => void
  /** Per-vial base price for the selected strength (one-time). */
  pricePerVial?: number
  purchaseType: PurchaseKind
  onPurchaseTypeChange: (kind: PurchaseKind) => void
  /** AutoShip is only offered when the product is eligible. */
  autoShipEligible?: boolean
  /** AutoShip discount as a fraction (e.g. 0.15 for 15%). */
  autoShipDiscount?: number
  qty: number
  onQtyChange: (n: number) => void
  /** Observed market price per vial (enables the comparison display). */
  marketPrice?: number
  /** Show the approved institutional-account indicator. */
  institutional?: boolean
  /** Slot for existing batch / COA areas rendered below the CTA. */
  footerSlot?: ReactNode
  onAddToCart?: (payload: { strengthId: string; purchaseType: PurchaseKind; qty: number }) => void
  className?: string
}

/**
 * Isolated product-detail purchase panel. Composes the strength and quantity
 * selectors, per-vial pricing, optional market comparison, and AutoShip (only
 * when eligible). Renders a Research Only notice and never fabricates prices.
 */
export function ProductPurchasePanel({
  name,
  strengths,
  selectedStrength,
  onSelectStrength,
  pricePerVial,
  purchaseType,
  onPurchaseTypeChange,
  autoShipEligible = false,
  autoShipDiscount = 0.15,
  qty,
  onQtyChange,
  marketPrice,
  institutional = false,
  footerSlot,
  onAddToCart,
  className = '',
}: ProductPurchasePanelProps) {
  const priced = hasPrice(pricePerVial)
  const isAuto = purchaseType === 'autoship' && autoShipEligible
  const base = priced ? pricePerVial : 0
  const unit = isAuto ? Math.round(base * (1 - autoShipDiscount)) : base
  const total = unit * qty
  const savingsPct = Math.round(autoShipDiscount * 100)

  return (
    <div
      className={`rounded-[1.75rem] border border-border/60 bg-card p-6 shadow-[0_30px_70px_-45px_rgba(8,27,53,0.5)] ${className}`}
    >
      <h2 className="font-heading text-xl font-semibold text-foreground text-balance">{name}</h2>

      <div className="mt-4">
        {marketPrice != null && priced ? (
          <MarketComparison truPrice={unit} marketPrice={marketPrice} />
        ) : (
          <span className="font-heading text-2xl font-bold text-primary">
            {priced ? perVial(unit) : '—'}
          </span>
        )}
      </div>

      {institutional && <InstitutionalPricingNote className="mt-3" />}

      <div className="mt-5 flex flex-col gap-5">
        {strengths.length > 1 && (
          <StrengthSelector
            options={strengths}
            value={selectedStrength}
            onChange={onSelectStrength}
          />
        )}

        <div role="radiogroup" aria-label="Purchase type" className="flex flex-col gap-3">
          <PurchaseOption
            active={!isAuto}
            title="One-Time Purchase"
            description="A single delivery. No recurring shipments."
            price={priced ? perVial(base).replace(' / vial', '') : '—'}
            onClick={() => onPurchaseTypeChange('onetime')}
          />
          {autoShipEligible && (
            <PurchaseOption
              active={isAuto}
              accent
              badge="Best Value"
              title="TRU AutoShip"
              titleIcon={<Repeat className="h-3.5 w-3.5 text-accent" aria-hidden="true" />}
              description={`Save ${savingsPct}% on every delivery. Pause, skip or cancel anytime.`}
              price={priced ? formatUSD(Math.round(base * (1 - autoShipDiscount))) : '—'}
              onClick={() => onPurchaseTypeChange('autoship')}
            />
          )}
        </div>

        <QuantitySelector value={qty} onChange={onQtyChange} />
      </div>

      <div className="mt-5 border-t border-border/60 pt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {isAuto ? 'Per delivery' : 'Total'}
            </span>
            <span className="font-heading text-3xl font-bold text-primary">
              {priced ? formatUSD(total) : '—'}
            </span>
          </div>
          {isAuto && priced && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-primary">
              Save {savingsPct}%
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!priced}
          aria-disabled={!priced}
          onClick={() =>
            onAddToCart?.({ strengthId: selectedStrength, purchaseType, qty })
          }
          className={`btn-premium mt-4 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition-colors ${
            priced
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'cursor-not-allowed bg-secondary text-muted-foreground'
          }`}
        >
          {!priced ? (
            'Pricing unavailable'
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

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Each quantity unit represents one individual vial.
        </p>
      </div>

      {footerSlot && <div className="mt-5 border-t border-border/60 pt-5">{footerSlot}</div>}

      <p className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/60 px-4 py-3 text-center text-[11px] leading-relaxed text-muted-foreground">
        <FlaskConical className="h-3.5 w-3.5 flex-none text-accent" aria-hidden="true" />
        For laboratory and research use only. Not for human consumption.
      </p>
    </div>
  )
}

function PurchaseOption({
  active,
  accent,
  badge,
  title,
  titleIcon,
  description,
  price,
  onClick,
}: {
  active: boolean
  accent?: boolean
  badge?: string
  title: string
  titleIcon?: ReactNode
  description: string
  price: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`group relative rounded-2xl border p-4 text-left transition-all duration-300 ${
        active
          ? accent
            ? 'border-accent bg-accent/[0.06] shadow-[0_8px_24px_-16px_rgba(8,27,53,0.35)]'
            : 'border-primary bg-primary/[0.04] shadow-[0_8px_24px_-16px_rgba(8,27,53,0.35)]'
          : 'border-border bg-background hover:border-primary/40'
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
          {badge}
        </span>
      )}
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
            active ? (accent ? 'border-accent' : 'border-primary') : 'border-border'
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              active
                ? accent
                  ? 'scale-100 bg-accent'
                  : 'scale-100 bg-primary'
                : 'scale-0 bg-transparent'
            }`}
          />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-primary">
              {titleIcon}
              {title}
            </span>
            <span className="font-heading text-base font-bold text-primary">{price}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  )
}
