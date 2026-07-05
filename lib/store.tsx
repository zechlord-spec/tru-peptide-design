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
  PurchaseType,
} from '@/lib/store-types'

/* ----------------------------- Types ----------------------------- */

// Re-exported for backward compatibility with existing consumers. The canonical
// definitions now live in `lib/store-types.ts` so they can be shared with the
// account backend boundary (`lib/client/account.ts`) without a circular import.
export type { Account, Address, CartItem, CoaDownload, Order, PurchaseType }

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
  // orders
  orders: Order[]
  placeOrder: (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order
  // account
  account: Account
  signIn: (name: string, email: string) => void
  signOut: () => void
  updateAccount: (patch: Partial<NonNullable<Account>>) => void
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

// Only genuinely device-local UI state is stored here. All user-scoped data
// (account, orders, favorites, saved, recently-viewed, COA downloads) is owned
// by the AccountClient boundary so a backend can take it over transparently.
const KEYS = {
  cart: 'tru.cart',
  age: 'tru.age',
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

  // Hydrate: cart + age from device-local storage; user data from AccountClient.
  useEffect(() => {
    setItems(load<CartItem[]>(KEYS.cart, []))
    setAgeVerified(load<boolean>(KEYS.age, false))
    let active = true
    account_client
      .load()
      .then((snapshot) => {
        if (!active) return
        setOrders(snapshot.orders)
        setAccount(snapshot.account)
        setFavorites(snapshot.favorites)
        setSaved(snapshot.saved)
        setRecentlyViewed(snapshot.recentlyViewed)
        setCoaDownloads(snapshot.coaDownloads)
      })
      .finally(() => {
        if (active) setHydrated(true)
      })
    return () => {
      active = false
    }
  }, [account_client])

  // Persist device-local UI state directly.
  useEffect(() => {
    if (hydrated) save(KEYS.cart, items)
  }, [items, hydrated])

  // Persist user-scoped collections through the AccountClient boundary
  // (reference impl writes localStorage; http impl syncs to the backend).
  useEffect(() => {
    if (hydrated) void account_client.setFavorites(favorites)
  }, [favorites, hydrated, account_client])
  useEffect(() => {
    if (hydrated) void account_client.setSaved(saved)
  }, [saved, hydrated, account_client])
  useEffect(() => {
    if (hydrated) void account_client.setRecentlyViewed(recentlyViewed)
  }, [recentlyViewed, hydrated, account_client])
  useEffect(() => {
    if (hydrated) void account_client.setCoaDownloads(coaDownloads)
  }, [coaDownloads, hydrated, account_client])

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
    (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
      // Optimistically build the order for instant UI, then delegate durable
      // creation to the AccountClient (reference: localStorage; http: backend).
      const order: Order = {
        ...o,
        id: `TRU-${Date.now().toString(36).toUpperCase()}`,
        createdAt: Date.now(),
        status: 'Processing',
      }
      setItems([])
      account_client
        .placeOrder(o)
        .then((created) => {
          // Reconcile with the authoritative record from the client/backend.
          setOrders((prev) => [created, ...prev.filter((x) => x.id !== order.id)])
        })
        .catch(() => {
          // Keep the optimistic order visible if the boundary is unavailable.
          setOrders((prev) => [order, ...prev])
        })
      setOrders((prev) => [order, ...prev])
      return order
    },
    [account_client],
  )

  const signIn = useCallback(
    (name: string, email: string) => {
      setAccount((prev) => ({ ...prev, name, email }))
      void account_client.signIn(name, email)
    },
    [account_client],
  )

  const signOut = useCallback(() => {
    setAccount(null)
    void account_client.signOut()
  }, [account_client])

  const updateAccount = useCallback(
    (patch: Partial<NonNullable<Account>>) => {
      setAccount((prev) => (prev ? { ...prev, ...patch } : prev))
      void account_client.updateProfile(patch)
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

export const SHIPPING_FLAT = 18
export const TAX_RATE = 0.0725

export function money(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
