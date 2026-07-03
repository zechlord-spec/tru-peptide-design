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

/* ----------------------------- Types ----------------------------- */

export type PurchaseType = 'onetime' | 'autoship'

export type CartItem = {
  id: string // `${productSlug}:${catNo}:${purchaseType}:${frequency}`
  productSlug: string
  name: string
  catNo: string
  spec: string
  price: number // unit price already reflects AutoShip discount when applicable
  image: string
  qty: number
  purchaseType?: PurchaseType
  frequency?: number | null // delivery cadence in days (AutoShip only)
}

// AutoShip recurring-delivery discount (not a membership)
export const AUTOSHIP_DISCOUNT = 0.15

export type Address = {
  fullName: string
  email: string
  address: string
  apt: string
  city: string
  state: string
  zip: string
  country: string
}

export type Order = {
  id: string
  createdAt: number
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  address: Address
  cardLast4: string
  status: 'Processing' | 'Shipped' | 'Delivered'
}

export type Account = {
  name: string
  email: string
  org?: string
  phone?: string
} | null

export type CoaDownload = {
  slug: string
  catNo: string
  name: string
  spec: string
  downloadedAt: number
}

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

const KEYS = {
  cart: 'tru.cart',
  age: 'tru.age',
  orders: 'tru.orders',
  account: 'tru.account',
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

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(load<CartItem[]>(KEYS.cart, []))
    setAgeVerified(load<boolean>(KEYS.age, false))
    setOrders(load<Order[]>(KEYS.orders, []))
    setAccount(load<Account>(KEYS.account, null))
    setFavorites(load<string[]>(KEYS.favorites, []))
    setSaved(load<string[]>(KEYS.saved, []))
    setRecentlyViewed(load<string[]>(KEYS.recentlyViewed, []))
    setCoaDownloads(load<CoaDownload[]>(KEYS.coaDownloads, []))
    setHydrated(true)
  }, [])

  // Persist
  useEffect(() => {
    if (hydrated) save(KEYS.cart, items)
  }, [items, hydrated])
  useEffect(() => {
    if (hydrated) save(KEYS.orders, orders)
  }, [orders, hydrated])
  useEffect(() => {
    if (hydrated) save(KEYS.account, account)
  }, [account, hydrated])
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
    (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
      const order: Order = {
        ...o,
        id: `TRU-${Date.now().toString(36).toUpperCase()}`,
        createdAt: Date.now(),
        status: 'Processing',
      }
      setOrders((prev) => [order, ...prev])
      setItems([])
      return order
    },
    [],
  )

  const signIn = useCallback((name: string, email: string) => {
    setAccount((prev) => ({ ...prev, name, email }))
  }, [])

  const signOut = useCallback(() => setAccount(null), [])

  const updateAccount = useCallback((patch: Partial<NonNullable<Account>>) => {
    setAccount((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

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
