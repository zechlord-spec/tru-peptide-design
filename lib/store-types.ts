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
  /**
   * Optional real product photograph. Used by non-vial add-on accessories so the
   * cart/checkout thumbnails show the actual item instead of the vial template.
   * Undefined for peptides, which render via the shared VialImage template.
   */
  photo?: string
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

// What the client submits when placing an order. Money beyond the cart subtotal
// (shipping, tax) and identifiers/status are assigned by the backend, never the
// frontend — so the exported layer contains no checkout pricing logic.
export type OrderDraft = {
  items: CartItem[]
  subtotal: number
  address: Address
  deliveryMethod: string
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered'

export type Order = OrderDraft & {
  id: string
  createdAt: number
  status: OrderStatus
  shipping: number
  tax: number
  total: number
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
