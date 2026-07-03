'use client'

import type { ReactNode } from 'react'
import { StoreProvider } from '@/lib/store'
import { CartDrawer } from '@/components/shop/cart-drawer'
import { AgeGate } from '@/components/shop/age-gate'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <CartDrawer />
      <AgeGate />
    </StoreProvider>
  )
}
