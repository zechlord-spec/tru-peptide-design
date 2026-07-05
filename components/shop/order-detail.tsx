'use client'

import { VialImage } from '@/components/products/vial-image'
import { money, type Order } from '@/lib/store'

const STATUS_STEPS: Order['status'][] = ['Processing', 'Shipped', 'Delivered']

export function OrderDetail({ order, showTracker = false }: { order: Order; showTracker?: boolean }) {
  const activeIndex = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Items */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">
            {order.items.reduce((n, i) => n + i.qty, 0)} item(s)
          </h2>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
            {order.status}
          </span>
        </div>

        {showTracker && (
          <div className="mt-5 flex items-center gap-2">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-1 flex-col gap-1.5">
                <div
                  className={`h-1.5 rounded-full ${i <= activeIndex ? 'bg-accent' : 'bg-border'}`}
                />
                <span
                  className={`text-[11px] font-medium ${
                    i <= activeIndex ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        )}

        <ul className="mt-5 divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                <VialImage name={item.name} catNo={item.catNo} spec={item.spec} sizes="64px" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.spec} · Qty {item.qty}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{item.catNo}</p>
                </div>
                <span className="whitespace-nowrap text-sm font-semibold text-foreground">
                  {money(item.price * item.qty)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary + shipping */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">Payment Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={money(order.subtotal)} />
            <Row
              label="Shipping"
              value={order.shipping === 0 ? 'Free' : money(order.shipping)}
            />
            <Row label="Tax" value={money(order.tax)} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading text-sm font-semibold text-foreground">Total</span>
            <span className="font-heading text-lg font-bold text-primary">{money(order.total)}</span>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">Shipping To</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-muted-foreground">
            <span className="block font-medium text-foreground">{order.address.fullName}</span>
            {order.address.address}
            {order.address.apt ? `, ${order.address.apt}` : ''}
            <br />
            {order.address.city}, {order.address.state} {order.address.zip}
            <br />
            {order.address.country}
          </address>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
