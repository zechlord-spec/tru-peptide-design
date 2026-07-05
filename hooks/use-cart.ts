'use client'

// Cart facade — the recommended entry point for new cart UI code.
//
// The cart is intentionally pure, device-local UI state (no backend): it lives
// in `StoreProvider` and persists to localStorage. This hook narrows the store
// surface to just the cart so components don't reach into unrelated account
// state.

import { useMemo } from 'react'
import { useStore } from '@/lib/store'
import type { CartItem } from '@/lib/store-types'

export interface UseCart {
  hydrated: boolean
  items: CartItem[]
  count: number
  subtotal: number
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
}

export function useCart(): UseCart {
  const {
    hydrated,
    items,
    count,
    subtotal,
    cartOpen,
    setCartOpen,
    addItem,
    removeItem,
    updateQty,
    clearCart,
  } = useStore()

  return useMemo(
    () => ({
      hydrated,
      items,
      count,
      subtotal,
      cartOpen,
      setCartOpen,
      addItem,
      removeItem,
      updateQty,
      clearCart,
    }),
    [hydrated, items, count, subtotal, cartOpen, setCartOpen, addItem, removeItem, updateQty, clearCart],
  )
}
