'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getAccountClient } from '@/lib/client/account'
import type {
  Account,
  Address,
  CartItem,
  CoaDownload,
  Order,
  OrderDraft,
  PurchaseType,
} from '@/lib/store-types'

/* ----------------------------- Types ----------------------------- */

// Re-exported for backward compatibility with existing consumers. The canonical
// definitions now live in `lib/store-types.ts` so they can be shared with the
// account backend boundary (`lib/client/account.ts`) without a circular import.
export type { Account, Address, CartItem, CoaDownload, Order, OrderDraft, PurchaseType }

// AutoShip recurring-delivery discount (not a membership)
export const AUTOSHIP_DISCOUNT = 0.15

type StoreState = {
  hydrated: boolean
  // cart
  items: CartItem[]
  cartOpen: boolean
  count: number
  subtotal: number
  setCartOpen: (open: boolean) => void
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  // age
  ageVerified: boolean
  verifyAge: () => void
  // orders (backend-owned via the account seam)
  orders: Order[]
  placeOrder: (draft: OrderDraft) => Promise<Order>
  // account (backend-owned via the account seam)
  account: Account
  signIn: (name: string, email: string) => Promise<void>
  signOut: () => void
  updateAccount: (patch: Partial<NonNullable<Account>>) => Promise<void>
  // favorites (wishlist)
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

const StoreContext = createContext<StoreState | null>(null)

// Device-local UI + personalization state lives here in localStorage: the cart,
// age gate, and the shopper's personalization collections (favorites, saved,
// recently-viewed, COA download history). These are intentionally client-only
// and do not require a backend. Only the session/profile and order history are
// backend-owned — those go through the AccountClient boundary.
const KEYS = {
  cart: 'tru.cart',
  age: 'tru.age',
  favorites: 'tru.favorites',
  saved: 'tru.saved',
  recentlyViewed: 'tru.recentlyViewed',
  coaDownloads: 'tru.coaDownloads',
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [ageVerified, setAgeVerified] = useState(true) // avoid SSR flash; corrected on hydrate
  const [orders, setOrders] = useState<Order[]>([])
  const [account, setAccount] = useState<Account>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [saved, setSaved] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [coaDownloads, setCoaDownloads] = useState<CoaDownload[]>([])

  const account_client = useMemo(() => getAccountClient(), [])

  // Hydrate: cart, age and personalization from device-local storage; the
  // session/profile + order history from the AccountClient boundary.
  useEffect(() => {
    setItems(load<CartItem[]>(KEYS.cart, []))
    setAgeVerified(load<boolean>(KEYS.age, false))
    setFavorites(load<string[]>(KEYS.favorites, []))
    setSaved(load<string[]>(KEYS.saved, []))
    setRecentlyViewed(load<string[]>(KEYS.recentlyViewed, []))
    setCoaDownloads(load<CoaDownload[]>(KEYS.coaDownloads, []))
    let active = true
    account_client
      .load()
      .then((snapshot) => {
        if (!active) return
        setOrders(snapshot.orders)
        setAccount(snapshot.account)
      })
      .catch(() => {
        /* no backend configured — stay signed out with no orders */
      })
      .finally(() => {
        if (active) setHydrated(true)
      })
    return () => {
      active = false
    }
  }, [account_client])

  // Persist device-local UI + personalization state directly to localStorage.
  useEffect(() => {
    if (hydrated) save(KEYS.cart, items)
  }, [items, hydrated])
  useEffect(() => {
    if (hydrated) save(KEYS.favorites, favorites)
  }, [favorites, hydrated])
  useEffect(() => {
    if (hydrated) save(KEYS.saved, saved)
  }, [saved, hydrated])
  useEffect(() => {
    if (hydrated) save(KEYS.recentlyViewed, recentlyViewed)
  }, [recentlyViewed, hydrated])
  useEffect(() => {
    if (hydrated) save(KEYS.coaDownloads, coaDownloads)
  }, [coaDownloads, hydrated])

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const type = item.purchaseType ?? 'onetime'
    const id = `${item.productSlug}:${item.catNo}:${type}:${item.frequency ?? 0}`
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + item.qty } : i))
      }
      return [...prev, { ...item, id }]
    })
    setCartOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const verifyAge = useCallback(() => {
    setAgeVerified(true)
    save(KEYS.age, true)
  }, [])

  const placeOrder = useCallback(
    async (draft: OrderDraft) => {
      // The backend owns fulfillment: it assigns the id, status, shipping, tax
      // and total, and returns the authoritative order. We never fabricate one.
      const created = await account_client.placeOrder(draft)
      setOrders((prev) => [created, ...prev])
      setItems([])
      return created
    },
    [account_client],
  )

  const signIn = useCallback(
    async (name: string, email: string) => {
      // The backend performs real auth and returns the session profile.
      const account = await account_client.signIn(name, email)
      setAccount(account)
    },
    [account_client],
  )

  const signOut = useCallback(() => {
    setAccount(null)
    void account_client.signOut()
  }, [account_client])

  const updateAccount = useCallback(
    async (patch: Partial<NonNullable<Account>>) => {
      const account = await account_client.updateProfile(patch)
      setAccount(account)
    },
    [account_client],
  )

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev],
    )
  }, [])
  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites])

  const toggleSaved = useCallback((slug: string) => {
    setSaved((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev],
    )
  }, [])
  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved])

  const trackView = useCallback((slug: string) => {
    setRecentlyViewed((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 12))
  }, [])

  const logCoaDownload = useCallback((d: Omit<CoaDownload, 'downloadedAt'>) => {
    setCoaDownloads((prev) => {
      const filtered = prev.filter((x) => !(x.slug === d.slug && x.catNo === d.catNo))
      return [{ ...d, downloadedAt: Date.now() }, ...filtered].slice(0, 50)
    })
  }, [])

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.price * i.qty, 0),
    [items],
  )

  const value: StoreState = {
    hydrated,
    items,
    cartOpen,
    count,
    subtotal,
    setCartOpen,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    ageVerified,
    verifyAge,
    orders,
    placeOrder,
    account,
    signIn,
    signOut,
    updateAccount,
    favorites,
    toggleFavorite,
    isFavorite,
    saved,
    toggleSaved,
    isSaved,
    recentlyViewed,
    trackView,
    coaDownloads,
    logCoaDownload,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

/* ----------------------------- Helpers ----------------------------- */

// NOTE: shipping and tax are computed by the backend at fulfillment, not here.
// The frontend never fabricates checkout pricing.

export function money(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
