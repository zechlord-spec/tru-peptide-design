'use client'

// ---------------------------------------------------------------------------
// Account / order backend boundary
// ---------------------------------------------------------------------------
//
// This is the single seam a real backend plugs into for everything tied to a
// signed-in user: the session/profile and the order history + order placement.
//
// This is a FRONTEND-ONLY layer. It ships with NO backend, so the default
// adapter:
//   • returns an empty snapshot on read (signed out, no orders), and
//   • rejects writes (sign in, profile update, place order) with a clear
//     "not configured" error instead of faking a session, persisting a local
//     "database", or fabricating orders.
//
// When merged into the host application, provide a backend in one of two ways:
//   1. Set `NEXT_PUBLIC_API_URL` to enable the bundled HTTP adapter (REST
//      contract documented below), or
//   2. Replace `getAccountClient()` with your own `AccountClient`
//      implementation (e.g. server actions / SDK calls).
//
// There is intentionally NO authentication or payment logic here — the backend
// owns real auth, validation, inventory, shipping/tax, and payment capture
// behind these method signatures.
//
// Expected REST contract for the http adapter:
//   GET    /account         → AccountSnapshot  (session + orders; empty session if signed out)
//   POST   /account/session → Account          (body: { name, email }) — sign in
//   DELETE /account/session → 204              — sign out
//   PATCH  /account         → Account          (body: Partial<Account>) — update profile
//   POST   /account/orders  → Order            (body: OrderDraft) — backend assigns id/status/shipping/tax/total
// ---------------------------------------------------------------------------

import type { Account, Order, OrderDraft } from '@/lib/store-types'

export type { OrderDraft } from '@/lib/store-types'

/** Everything the UI needs to render a user's account on load. */
export interface AccountSnapshot {
  account: Account
  orders: Order[]
}

export interface AccountClient {
  /** Load the current session + order history. */
  load(): Promise<AccountSnapshot>
  /** Sign in (backend performs real auth). */
  signIn(name: string, email: string): Promise<Account>
  /** Sign out and clear the session. */
  signOut(): Promise<void>
  /** Patch the signed-in user's profile. */
  updateProfile(patch: Partial<NonNullable<Account>>): Promise<Account>
  /** Place an order — backend assigns id, status, shipping, tax and total. */
  placeOrder(draft: OrderDraft): Promise<Order>
}

const EMPTY_SNAPSHOT: AccountSnapshot = { account: null, orders: [] }

/* --------------------------- unconfigured adapter ------------------------ */
// Default when no backend is wired. Reads are empty; writes fail loudly so no
// fake session or order is ever created in the exported frontend.

const NOT_CONFIGURED =
  'No account backend configured. Set NEXT_PUBLIC_API_URL or provide a custom AccountClient.'

function createUnconfiguredClient(): AccountClient {
  return {
    async load() {
      return EMPTY_SNAPSHOT
    },
    async signIn() {
      throw new Error(NOT_CONFIGURED)
    },
    async signOut() {
      /* nothing to clear */
    },
    async updateProfile() {
      throw new Error(NOT_CONFIGURED)
    },
    async placeOrder() {
      throw new Error(NOT_CONFIGURED)
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
  }
}

let cached: AccountClient | null = null

/** Returns the active account client (http when `NEXT_PUBLIC_API_URL` is set, else unconfigured). */
export function getAccountClient(): AccountClient {
  if (cached) return cached
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  cached = baseUrl ? createHttpClient(baseUrl) : createUnconfiguredClient()
  return cached
}
