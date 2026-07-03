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

export type CartItem = {
  id: string // `${productSlug}:${catNo}`
  productSlug: string
  name: string
  catNo: string
  spec: string
  price: number
  image: string
  qty: number
}

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
} | null

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
}

const StoreContext = createContext<StoreState | null>(null)

const KEYS = {
  cart: 'tru.cart',
  age: 'tru.age',
  orders: 'tru.orders',
  account: 'tru.account',
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

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(load<CartItem[]>(KEYS.cart, []))
    setAgeVerified(load<boolean>(KEYS.age, false))
    setOrders(load<Order[]>(KEYS.orders, []))
    setAccount(load<Account>(KEYS.account, null))
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

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const id = `${item.productSlug}:${item.catNo}`
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
    setAccount({ name, email })
  }, [])

  const signOut = useCallback(() => setAccount(null), [])

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
