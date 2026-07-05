// ---------------------------------------------------------------------------
// Shared client-state types
// ---------------------------------------------------------------------------
// Framework-free type definitions shared by the cart/store UI layer
// (`lib/store.tsx`, `hooks/use-cart.ts`) and the account backend boundary
// (`lib/client/account.ts`). Kept in their own module so the store and the
// account client can both import them without a circular dependency.

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
