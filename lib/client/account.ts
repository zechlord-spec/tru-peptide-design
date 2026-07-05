'use client'

// ---------------------------------------------------------------------------
// Account / user-data client boundary
// ---------------------------------------------------------------------------
//
// This is the seam a real backend plugs into for everything tied to a signed-in
// user: the session/profile, order history + order placement, and the user's
// personalization collections (favorites, saved-for-later, recently-viewed,
// COA download history).
//
// There are two implementations, selected at runtime:
//   • reference (default)  — persists to `localStorage`, so the exported
//                            frontend is fully interactive with NO backend.
//   • http (opt-in)        — talks to your backend when `NEXT_PUBLIC_API_URL`
//                            is set. See the documented REST shape below.
//
// IMPORTANT: This file contains NO authentication and NO payment logic. The
// reference `signIn` simply records a name/email locally, and `placeOrder`
// records an order object locally. A production backend is expected to enforce
// real auth, validation, inventory, and payment capture behind these same
// method signatures.
//
// Expected REST contract for the http adapter:
//   GET    /account                 → AccountSnapshot   (current session + user data; 200 with empty session if signed out)
//   POST   /account/session         → Account           (body: { name, email }) — sign in
//   DELETE /account/session         → 204               — sign out
//   PATCH  /account                 → Account           (body: Partial<Account>) — update profile
//   GET    /account/orders          → Order[]
//   POST   /account/orders          → Order             (body: OrderDraft) — place order (backend assigns id/status/total)
//   PUT    /account/favorites       → string[]          (body: string[] of product slugs)
//   PUT    /account/saved           → string[]          (body: string[] of product slugs)
//   PUT    /account/recently-viewed → string[]          (body: string[] of product slugs)
//   PUT    /account/coa-downloads   → CoaDownload[]      (body: CoaDownload[])
// ---------------------------------------------------------------------------

import type { Account, CoaDownload, Order } from '@/lib/store-types'

/** Everything the UI needs to render a user's account on load. */
export interface AccountSnapshot {
  account: Account
  orders: Order[]
  favorites: string[]
  saved: string[]
  recentlyViewed: string[]
  coaDownloads: CoaDownload[]
}

/** Draft passed to `placeOrder` — the client/backend assigns id, timestamp, status. */
export type OrderDraft = Omit<Order, 'id' | 'createdAt' | 'status'>

export interface AccountClient {
  /** Load the current session + all user-scoped collections. */
  load(): Promise<AccountSnapshot>
  /** Sign in (reference: records name/email; backend: real auth). */
  signIn(name: string, email: string): Promise<Account>
  /** Sign out and clear the session. */
  signOut(): Promise<void>
  /** Patch the signed-in user's profile. */
  updateProfile(patch: Partial<NonNullable<Account>>): Promise<Account>
  /** Place an order (reference: local record; backend: real fulfillment). */
  placeOrder(draft: OrderDraft): Promise<Order>
  /** Persist a personalization collection. */
  setFavorites(slugs: string[]): Promise<void>
  setSaved(slugs: string[]): Promise<void>
  setRecentlyViewed(slugs: string[]): Promise<void>
  setCoaDownloads(downloads: CoaDownload[]): Promise<void>
}

const EMPTY_SNAPSHOT: AccountSnapshot = {
  account: null,
  orders: [],
  favorites: [],
  saved: [],
  recentlyViewed: [],
  coaDownloads: [],
}

/* --------------------------- reference adapter --------------------------- */

const KEYS = {
  orders: 'tru.orders',
  account: 'tru.account',
  favorites: 'tru.favorites',
  saved: 'tru.saved',
  recentlyViewed: 'tru.recentlyViewed',
  coaDownloads: 'tru.coaDownloads',
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota/serialization errors */
  }
}

function createReferenceClient(): AccountClient {
  return {
    async load() {
      return {
        account: read<Account>(KEYS.account, null),
        orders: read<Order[]>(KEYS.orders, []),
        favorites: read<string[]>(KEYS.favorites, []),
        saved: read<string[]>(KEYS.saved, []),
        recentlyViewed: read<string[]>(KEYS.recentlyViewed, []),
        coaDownloads: read<CoaDownload[]>(KEYS.coaDownloads, []),
      }
    },
    async signIn(name, email) {
      const prev = read<Account>(KEYS.account, null)
      const account: Account = { ...prev, name, email }
      write(KEYS.account, account)
      return account
    },
    async signOut() {
      write(KEYS.account, null)
    },
    async updateProfile(patch) {
      const prev = read<Account>(KEYS.account, null)
      const account: Account = prev ? { ...prev, ...patch } : prev
      write(KEYS.account, account)
      return account
    },
    async placeOrder(draft) {
      const order: Order = {
        ...draft,
        id: `TRU-${Date.now().toString(36).toUpperCase()}`,
        createdAt: Date.now(),
        status: 'Processing',
      }
      const orders = [order, ...read<Order[]>(KEYS.orders, [])]
      write(KEYS.orders, orders)
      return order
    },
    async setFavorites(slugs) {
      write(KEYS.favorites, slugs)
    },
    async setSaved(slugs) {
      write(KEYS.saved, slugs)
    },
    async setRecentlyViewed(slugs) {
      write(KEYS.recentlyViewed, slugs)
    },
    async setCoaDownloads(downloads) {
      write(KEYS.coaDownloads, downloads)
    },
  }
}

/* ------------------------------ http adapter ----------------------------- */

function createHttpClient(baseUrl: string): AccountClient {
  const url = (path: string) => `${baseUrl.replace(/\/$/, '')}${path}`
  const json = { 'content-type': 'application/json' }

  return {
    async load() {
      const res = await fetch(url('/account'), { credentials: 'include' })
      if (!res.ok) return EMPTY_SNAPSHOT
      return (await res.json()) as AccountSnapshot
    },
    async signIn(name, email) {
      const res = await fetch(url('/account/session'), {
        method: 'POST',
        headers: json,
        credentials: 'include',
        body: JSON.stringify({ name, email }),
      })
      if (!res.ok) throw new Error(`signIn failed: ${res.status}`)
      return (await res.json()) as Account
    },
    async signOut() {
      await fetch(url('/account/session'), { method: 'DELETE', credentials: 'include' })
    },
    async updateProfile(patch) {
      const res = await fetch(url('/account'), {
        method: 'PATCH',
        headers: json,
        credentials: 'include',
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error(`updateProfile failed: ${res.status}`)
      return (await res.json()) as Account
    },
    async placeOrder(draft) {
      const res = await fetch(url('/account/orders'), {
        method: 'POST',
        headers: json,
        credentials: 'include',
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error(`placeOrder failed: ${res.status}`)
      return (await res.json()) as Order
    },
    async setFavorites(slugs) {
      await fetch(url('/account/favorites'), {
        method: 'PUT',
        headers: json,
        credentials: 'include',
        body: JSON.stringify(slugs),
      })
    },
    async setSaved(slugs) {
      await fetch(url('/account/saved'), {
        method: 'PUT',
        headers: json,
        credentials: 'include',
        body: JSON.stringify(slugs),
      })
    },
    async setRecentlyViewed(slugs) {
      await fetch(url('/account/recently-viewed'), {
        method: 'PUT',
        headers: json,
        credentials: 'include',
        body: JSON.stringify(slugs),
      })
    },
    async setCoaDownloads(downloads) {
      await fetch(url('/account/coa-downloads'), {
        method: 'PUT',
        headers: json,
        credentials: 'include',
        body: JSON.stringify(downloads),
      })
    },
  }
}

let cached: AccountClient | null = null

/** Returns the active account client (http when `NEXT_PUBLIC_API_URL` is set, else reference). */
export function getAccountClient(): AccountClient {
  if (cached) return cached
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  cached = baseUrl ? createHttpClient(baseUrl) : createReferenceClient()
  return cached
}
