'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Product } from '@/lib/products-data'
import {
  formatUSD,
  retailRangeFrom,
  retailUnitFrom,
  type RetailSnapshot,
} from './format'

const PricingContext = createContext<RetailSnapshot>({})

export function PricingProvider({
  snapshot,
  children,
}: {
  snapshot: RetailSnapshot
  children: ReactNode
}) {
  return <PricingContext.Provider value={snapshot}>{children}</PricingContext.Provider>
}

/** Per-vial retail price (number) for a catalog number. */
export function useRetailUnit(catNo: string): number {
  const snapshot = useContext(PricingContext)
  return retailUnitFrom(snapshot, catNo)
}

/** Formatted per-vial retail range across a product's variants. */
export function useRetailRange(product: Product): string {
  const snapshot = useContext(PricingContext)
  return retailRangeFrom(snapshot, product)
}

/** Access the full snapshot (e.g. to format several variants). */
export function useRetailSnapshot(): RetailSnapshot {
  return useContext(PricingContext)
}

export { formatUSD }
