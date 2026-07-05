'use client'

import { VialImage } from '@/components/products/vial-image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, Lock, Truck, Zap, AlertCircle } from 'lucide-react'
import { useStore, money, type Address } from '@/lib/store'
import { Spinner } from '@/components/animations/loaders'

type StepId = 'contact' | 'shipping' | 'delivery'

const DELIVERY = [
  {
    id: 'standard',
    label: 'Standard Research Shipping',
    desc: 'Discreet, temperature-controlled. 3–5 business days.',
    price: 18,
    icon: Truck,
  },
  {
    id: 'express',
    label: 'Express Cold-Chain',
    desc: 'Priority cold-chain. 1–2 business days.',
    price: 35,
    icon: Zap,
  },
] as const

export function Checkout() {
  const router = useRouter()
  const { items, subtotal, placeOrder, account } = useStore()

  const [current, setCurrent] = useState<StepId>('contact')
  const [completed, setCompleted] = useState<Record<StepId, boolean>>({
    contact: false,
    shipping: false,
    delivery: false,
  })

  const [contact, setContact] = useState({
    email: account?.email ?? '',
    fullName: account?.name ?? '',
  })
  const [addr, setAddr] = useState({
    address: '',
    apt: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  })
  const [delivery, setDelivery] = useState<(typeof DELIVERY)[number]['id']>('standard')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Indicative shipping estimate only — the backend computes the authoritative
  // shipping, tax and total at fulfillment.
  const shipping = DELIVERY.find((d) => d.id === delivery)?.price ?? 18
  const estimatedShipping = subtotal >= 500 ? 0 : shipping
  const selectedDelivery = DELIVERY.find((d) => d.id === delivery)

  function markDone(step: StepId, next?: StepId) {
    setCompleted((c) => ({ ...c, [step]: true }))
    if (next) setCurrent(next)
  }

  const contactValid = /\S+@\S+\.\S+/.test(contact.email) && contact.fullName.trim().length > 1
  const shippingValid = Boolean(
    addr.address.trim() && addr.city.trim() && addr.state.trim() && addr.zip.trim(),
  )
  const canPlace = contactValid && shippingValid

  async function handlePlaceOrder() {
    if (!canPlace) return
    setPlacing(true)
    setError(null)
    const fullAddress: Address = {
      fullName: contact.fullName,
      email: contact.email,
      address: addr.address,
      apt: addr.apt,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
    }
    try {
      // Hand the order draft to the backend, which owns fulfillment, payment
      // capture and final pricing, then returns the authoritative order.
      const order = await placeOrder({
        items,
        subtotal,
        address: fullAddress,
        deliveryMethod: selectedDelivery?.label ?? delivery,
      })
      router.push(`/order/${order.id}`)
    } catch {
      setPlacing(false)
      setError(
        'Checkout isn’t connected to an order backend yet. Connect one to complete your purchase.',
      )
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Your bag is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add research compounds to your bag before checking out.
        </p>
        <Link
          href="/products"
          className="btn-premium mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Browse Compounds
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_380px] lg:px-8">
      {/* Left: steps */}
      <div className="order-2 lg:order-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">Checkout</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Secure checkout
        </p>

        <div className="mt-8 space-y-4">
          {/* Contact */}
          <StepSection
            index={1}
            title="Contact"
            active={current === 'contact'}
            done={completed.contact}
            summary={`${contact.fullName} · ${contact.email}`}
            onEdit={() => setCurrent('contact')}
          >
            <div className="grid gap-4">
              <Field
                label="Full name"
                value={contact.fullName}
                onChange={(v) => setContact((c) => ({ ...c, fullName: v }))}
                placeholder="Jane Researcher"
                autoComplete="name"
              />
              <Field
                label="Email"
                type="email"
                value={contact.email}
                onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                placeholder="you@lab.com"
                autoComplete="email"
              />
            </div>
            <ContinueButton disabled={!contactValid} onClick={() => markDone('contact', 'shipping')} />
          </StepSection>

          {/* Shipping */}
          <StepSection
            index={2}
            title="Shipping Address"
            active={current === 'shipping'}
            done={completed.shipping}
            summary={`${addr.address}${addr.apt ? `, ${addr.apt}` : ''}, ${addr.city}, ${addr.state} ${addr.zip}`}
            onEdit={() => setCurrent('shipping')}
          >
            <div className="grid gap-4">
              <Field
                label="Street address"
                value={addr.address}
                onChange={(v) => setAddr((a) => ({ ...a, address: v }))}
                placeholder="123 Research Way"
                autoComplete="address-line1"
              />
              <Field
                label="Apartment, suite (optional)"
                value={addr.apt}
                onChange={(v) => setAddr((a) => ({ ...a, apt: v }))}
                placeholder="Suite 400"
                autoComplete="address-line2"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="City"
                  value={addr.city}
                  onChange={(v) => setAddr((a) => ({ ...a, city: v }))}
                  autoComplete="address-level2"
                />
                <Field
                  label="State"
                  value={addr.state}
                  onChange={(v) => setAddr((a) => ({ ...a, state: v }))}
                  autoComplete="address-level1"
                />
                <Field
                  label="ZIP"
                  value={addr.zip}
                  onChange={(v) => setAddr((a) => ({ ...a, zip: v }))}
                  autoComplete="postal-code"
                />
              </div>
            </div>
            <ContinueButton
              disabled={!shippingValid}
              onClick={() => markDone('shipping', 'delivery')}
            />
          </StepSection>

          {/* Delivery */}
          <StepSection
            index={3}
            title="Delivery Method"
            active={current === 'delivery'}
            done={completed.delivery}
            summary={
              DELIVERY.find((d) => d.id === delivery)?.label +
              ` · ${estimatedShipping === 0 ? 'Free' : money(estimatedShipping)}`
            }
            onEdit={() => setCurrent('delivery')}
          >
            <div className="grid gap-3">
              {DELIVERY.map((d) => {
                const Icon = d.icon
                const active = delivery === d.id
                const price = subtotal >= 500 && d.id === 'standard' ? 0 : d.price
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDelivery(d.id)}
                    aria-pressed={active}
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-colors ${
                      active
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/40'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-foreground">{d.label}</span>
                      <span className="block text-xs text-muted-foreground">{d.desc}</span>
                    </span>
                    <span className="font-heading text-sm font-semibold text-primary">
                      {price === 0 ? 'Free' : money(price)}
                    </span>
                  </button>
                )
              })}
            </div>
            <ContinueButton disabled={false} onClick={() => markDone('delivery')} />
          </StepSection>

          <p className="flex items-center gap-2 rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            <Lock className="h-3.5 w-3.5 flex-shrink-0" />
            Payment is collected securely by the store at fulfillment. No card details are entered
            or stored in this checkout.
          </p>
        </div>
      </div>

      {/* Right: summary */}
      <aside className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-24">
          <Link
            href="/products"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" /> Continue shopping
          </Link>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">Order Summary</h2>
            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <VialImage name={item.name} catNo={item.catNo} spec={item.spec} sizes="56px" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium leading-tight text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.spec}</p>
                    </div>
                    <span className="whitespace-nowrap text-sm font-semibold text-foreground">
                      {money(item.price * item.qty)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
              <Row label="Subtotal" value={money(subtotal)} />
              <Row
                label="Shipping (est.)"
                value={estimatedShipping === 0 ? 'Free' : money(estimatedShipping)}
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-heading text-base font-semibold text-foreground">
                Subtotal
              </span>
              <span className="font-heading text-xl font-bold text-primary">{money(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Shipping and tax are calculated and confirmed at fulfillment.
            </p>

            {error && (
              <p
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs leading-relaxed text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!canPlace || placing}
              className="btn-premium mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {placing ? (
                <>
                  <Spinner size={18} />
                  Placing order…
                </>
              ) : (
                'Place Order'
              )}
            </button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
              For laboratory and research use only. Not for human consumption.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}

/* ----------------------------- Sub-components ----------------------------- */

function StepSection({
  index,
  title,
  active,
  done,
  summary,
  onEdit,
  children,
}: {
  index: number
  title: string
  active: boolean
  done: boolean
  summary: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <section
      className={`rounded-3xl border bg-card transition-colors ${
        active ? 'border-primary/40' : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              done ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
            }`}
          >
            {done ? <Check className="h-4 w-4" /> : index}
          </span>
          <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
        </div>
        {done && !active && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Edit
          </button>
        )}
      </div>
      {active ? (
        <div className="px-6 pb-6">{children}</div>
      ) : done && summary ? (
        <div className="px-6 pb-5 pl-16 text-sm text-muted-foreground">{summary}</div>
      ) : null}
    </section>
  )
}

function ContinueButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-premium mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Continue
    </button>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  inputMode,
  icon,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  autoComplete?: string
  inputMode?: 'numeric' | 'text' | 'email'
  icon?: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        {icon && <span className="absolute right-4 top-1/2 -translate-y-1/2">{icon}</span>}
      </div>
    </label>
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
