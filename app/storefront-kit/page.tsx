'use client'

import { useState } from 'react'
import { VialImage } from '@/components/products/vial-image'
import {
  StandardProductCard,
  SpecialOrderProductCard,
  ProductPurchasePanel,
  StrengthSelector,
  QuantitySelector,
  SingleVialNote,
  BlendContents,
  CartLineItem,
  OrderDiscountMessage,
  BestDiscountSummary,
  MarketComparison,
  InstitutionalPricingNote,
  type PurchaseKind,
} from '@/components/storefront-kit'

// Illustrative preview values only — NOT catalog pricing. Real prices are
// supplied to these components as props from the app's pricing seam / backend.
const STRENGTHS = [
  { id: 'BPC5', label: '5 mg', sublabel: 'BPC5', pricePerVial: 59 },
  { id: 'BPC10', label: '10 mg', sublabel: 'BPC10', pricePerVial: 89 },
  { id: 'BPC15', label: '15 mg', sublabel: 'BPC15', pricePerVial: 119 },
]

export default function StorefrontKitPage() {
  const [strength, setStrength] = useState('BPC5')
  const [purchaseType, setPurchaseType] = useState<PurchaseKind>('onetime')
  const [panelQty, setPanelQty] = useState(1)
  const [demoQty, setDemoQty] = useState(2)

  const selectedPrice = STRENGTHS.find((s) => s.id === strength)?.pricePerVial

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <header className="max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Component Library
          </span>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance">
            Storefront Component Kit
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Isolated, additive component states for the TRU Peptide storefront. All prices shown
            here are illustrative preview values passed as props — never catalog pricing.
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-14">
          {/* Product cards */}
          <Section title="Product Cards" subtitle="Standard single-vial and special-order states">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <StandardProductCard
                name="BPC-157"
                strength="5 mg per vial"
                pricePerVial={59}
                autoShipEligible
                media={<VialImage name="BPC-157" catNo="BPC5" sizes="300px" />}
                onQuickView={() => {}}
                onAddToCart={() => {}}
              />
              <StandardProductCard
                name="TB-500"
                strength="5 mg per vial"
                media={<VialImage name="TB-500" catNo="TB5" sizes="300px" />}
                onQuickView={() => {}}
              />
              <SpecialOrderProductCard
                name="Thymosin Alpha-1"
                strength="10 mg per vial"
                pricePerVial={129}
                media={<VialImage name="Thymosin Alpha-1" catNo="TA10" sizes="300px" />}
                onViewDetails={() => {}}
              />
            </div>
          </Section>

          {/* Purchase panel */}
          <Section
            title="Product-Detail Purchase Panel"
            subtitle="Composes strength selector, purchase type, quantity, and pricing"
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <ProductPurchasePanel
                name="BPC-157"
                strengths={STRENGTHS}
                selectedStrength={strength}
                onSelectStrength={setStrength}
                pricePerVial={selectedPrice}
                purchaseType={purchaseType}
                onPurchaseTypeChange={setPurchaseType}
                autoShipEligible
                autoShipDiscount={0.15}
                qty={panelQty}
                onQtyChange={setPanelQty}
                marketPrice={79}
                institutional
              />
              <div className="flex flex-col gap-6">
                <SubBlock label="Strength selector">
                  <StrengthSelector options={STRENGTHS} value={strength} onChange={setStrength} />
                </SubBlock>
                <SubBlock label="Quantity selector">
                  <QuantitySelector value={demoQty} onChange={setDemoQty} />
                </SubBlock>
                <SubBlock label="Single-vial clarification">
                  <SingleVialNote />
                </SubBlock>
              </div>
            </div>
          </Section>

          {/* Blend */}
          <Section title="Blend Contents" subtitle="Co-formulated single vial — never a kit or pack">
            <div className="max-w-md">
              <BlendContents
                components={[
                  { name: 'BPC-157', strength: '5mg' },
                  { name: 'TB-500', strength: '5mg' },
                ]}
              />
            </div>
          </Section>

          {/* Cart line items */}
          <Section title="Cart Line Item" subtitle="Expressed strictly in individual vials">
            <div className="max-w-md divide-y divide-border rounded-2xl border border-border bg-card px-6">
              <CartLineItem
                name="BPC-157 + TB-500"
                detail="10mg total, 5mg + 5mg"
                qty={2}
                lineTotal={178}
                media={<VialImage name="BPC-157 + TB-500" catNo="BLEND10" sizes="80px" />}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onRemove={() => {}}
              />
              <CartLineItem
                name="Retatrutide"
                detail="5 mg"
                qty={1}
                lineTotal={149}
                purchaseType="autoship"
                frequency={30}
                media={<VialImage name="Retatrutide" catNo="RT5" sizes="80px" />}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onRemove={() => {}}
              />
            </div>
          </Section>

          {/* Discount messaging */}
          <Section title="Order Discount & Summary" subtitle="Restrained, non-gamified messaging">
            <div className="flex max-w-md flex-col gap-4">
              <OrderDiscountMessage percent={8} remaining={82} progress={0.6} />
              <OrderDiscountMessage percent={8} remaining={0} progress={1} />
              <div className="rounded-2xl border border-border bg-card p-5">
                <BestDiscountSummary percent={8} />
              </div>
            </div>
          </Section>

          {/* Pricing indicators */}
          <Section
            title="Pricing Indicators"
            subtitle="Market comparison (with suppressed state) and institutional pricing"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <SubBlock label="Market comparison">
                <MarketComparison truPrice={59} marketPrice={79} />
              </SubBlock>
              <SubBlock label="Market comparison — strikethrough enabled">
                <MarketComparison truPrice={59} marketPrice={79} strikethrough />
              </SubBlock>
              <SubBlock label="Market comparison — suppressed">
                <MarketComparison truPrice={59} />
              </SubBlock>
              <SubBlock label="Institutional account pricing">
                <InstitutionalPricingNote />
              </SubBlock>
            </div>
          </Section>
        </div>
      </div>
    </main>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-5 border-b border-border pb-3">
        <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function SubBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}
