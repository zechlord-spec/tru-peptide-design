'use client'

// Account facade — the recommended entry point for new account/order UI code.
//
// All data surfaced here is user-scoped and flows through the AccountClient
// boundary (`lib/client/account.ts`): reference mode persists to localStorage,
// http mode syncs with your backend. This hook narrows the store to the
// account domain so components stay decoupled from cart internals.

import { useMemo } from 'react'
import { useStore } from '@/lib/store'
import type { Account, CoaDownload, Order } from '@/lib/store-types'

export interface UseAccount {
  hydrated: boolean
  account: Account
  isSignedIn: boolean
  signIn: (name: string, email: string) => void
  signOut: () => void
  updateAccount: (patch: Partial<NonNullable<Account>>) => void
  // orders
  orders: Order[]
  placeOrder: (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order
  // favorites
  favorites: string[]
  toggleFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
  // saved for later
  saved: string[]
  toggleSaved: (slug: string) => void
  isSaved: (slug: string) => boolean
  // recently viewed
  recentlyViewed: string[]
  trackView: (slug: string) => void
  // COA downloads
  coaDownloads: CoaDownload[]
  logCoaDownload: (d: Omit<CoaDownload, 'downloadedAt'>) => void
}

export function useAccount(): UseAccount {
  const s = useStore()

  return useMemo(
    () => ({
      hydrated: s.hydrated,
      account: s.account,
      isSignedIn: Boolean(s.account),
      signIn: s.signIn,
      signOut: s.signOut,
      updateAccount: s.updateAccount,
      orders: s.orders,
      placeOrder: s.placeOrder,
      favorites: s.favorites,
      toggleFavorite: s.toggleFavorite,
      isFavorite: s.isFavorite,
      saved: s.saved,
      toggleSaved: s.toggleSaved,
      isSaved: s.isSaved,
      recentlyViewed: s.recentlyViewed,
      trackView: s.trackView,
      coaDownloads: s.coaDownloads,
      logCoaDownload: s.logCoaDownload,
    }),
    [s],
  )
}
