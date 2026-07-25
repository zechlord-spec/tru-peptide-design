'use client'

import { useId } from 'react'
import { Clock, Eye } from 'lucide-react'
import { AdminCard, Toggle, StatusBadge } from './primitives'

export type SpecialOrderConfig = {
  specialOrder: boolean
  fulfillmentDays: number
  autoShipEligible: boolean
  /** Whether standard in-stock messaging is shown. Forced off for special orders. */
  standardStockMessaging: boolean
  active: boolean
  customerMessage: string
}

export type SpecialOrderControlsProps = {
  value: SpecialOrderConfig
  onChange?: (patch: Partial<SpecialOrderConfig>) => void
  className?: string
}

/**
 * Special-order configuration controls for a single product. When special
 * order is enabled, standard-stock messaging is automatically suppressed and
 * a fulfillment expectation is surfaced to customers.
 */
export function SpecialOrderControls({
  value,
  onChange,
  className = '',
}: SpecialOrderControlsProps) {
  const daysId = useId()
  const msgId = useId()
  const stockMessagingOn = value.specialOrder ? false : value.standardStockMessaging

  return (
    <AdminCard
      className={className}
      icon={<Clock className="h-4 w-4" aria-hidden="true" />}
      title="Special-order controls"
      actions={
        <StatusBadge tone={value.active ? 'positive' : 'neutral'}>
          {value.active ? 'Active' : 'Inactive'}
        </StatusBadge>
      }
    >
      <div className="space-y-4">
        <Toggle
          checked={value.specialOrder}
          onChange={(next) => onChange?.({ specialOrder: next })}
          label="Special order"
          description="Sourced per order rather than sold from held stock."
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2.5">
          <label
            htmlFor={daysId}
            className="text-sm font-medium text-foreground"
          >
            Estimated fulfillment
          </label>
          <div className="flex items-center gap-2">
            <input
              id={daysId}
              type="number"
              min={0}
              inputMode="numeric"
              value={value.fulfillmentDays}
              onChange={(e) => onChange?.({ fulfillmentDays: Number(e.target.value) })}
              className="w-20 rounded-lg border border-input bg-background px-2.5 py-1.5 text-right text-sm tabular-nums text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <span className="text-sm text-muted-foreground">business days</span>
          </div>
        </div>

        <Toggle
          checked={value.autoShipEligible}
          onChange={(next) => onChange?.({ autoShipEligible: next })}
          label="AutoShip eligibility"
          description="Allow recurring AutoShip enrollment for this product."
        />

        <Toggle
          checked={stockMessagingOn}
          disabled={value.specialOrder}
          onChange={(next) => onChange?.({ standardStockMessaging: next })}
          label="Standard-stock messaging"
          description={
            value.specialOrder
              ? 'Disabled automatically while special order is enabled.'
              : 'Show in-stock / ready-to-ship messaging.'
          }
        />

        <Toggle
          checked={value.active}
          onChange={(next) => onChange?.({ active: next })}
          label="Product activation"
          description="Controls whether the product is visible in the storefront."
        />

        <div>
          <label
            htmlFor={msgId}
            className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Customer-facing fulfillment message
          </label>
          <textarea
            id={msgId}
            rows={2}
            value={value.customerMessage}
            onChange={(e) => onChange?.({ customerMessage: e.target.value })}
            placeholder="e.g. Made to order — ships in 7–10 business days."
            className="mt-1 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-dashed border-border px-3 py-2">
            <Eye className="mt-0.5 h-3.5 w-3.5 flex-none text-accent" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Storefront preview: </span>
              {value.customerMessage?.trim()
                ? value.customerMessage
                : value.specialOrder
                  ? `Made to order — ships in ~${value.fulfillmentDays} business days.`
                  : 'In stock — ready to ship.'}
            </p>
          </div>
        </div>
      </div>
    </AdminCard>
  )
}
