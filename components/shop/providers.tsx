'use client'

import type { ReactNode } from 'react'
import { StoreProvider } from '@/lib/store'
import { CartDrawer } from '@/components/shop/cart-drawer'
import { AgeGate } from '@/components/shop/age-gate'
import { PricingProvider } from '@/lib/pricing/pricing-context'
import type { RetailSnapshot } from '@/lib/pricing/format'

export function Providers({
  children,
  pricing,
}: {
  children: ReactNode
  pricing: RetailSnapshot
}) {
  return (
    <PricingProvider snapshot={pricing}>
      <StoreProvider>
        {children}
        <CartDrawer />
        <AgeGate />
      </StoreProvider>
    </PricingProvider>
  )
}
