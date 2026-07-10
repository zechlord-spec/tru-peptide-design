// ---------------------------------------------------------------------------
// Recommended add-on products (research support accessories)
// ---------------------------------------------------------------------------
// Data-driven catalog of "commonly paired" research support items surfaced as
// upsells in the cart, checkout, and on product pages. These are intentionally
// kept separate from the main peptide catalog (`lib/products-data.ts`) so they
// never appear in the primary product grid, filters, systems, or goals.
//
// Pricing is NOT stored here. Like every other product in the store, an add-on's
// retail price is owned by the backend and resolved at render time from the
// pricing snapshot seam (keyed by `catNo`). Until a backend supplies prices the
// UI shows a neutral placeholder and disables the add button — no fabricated
// values ship.

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

// Where an add-on is eligible to appear. A single item can be paired in several
// contexts. The `autoship` context is used when the current order contains
// recurring (AutoShip) items.
export type AddOnContext = 'cart' | 'checkout' | 'autoship' | 'product'

export type AddOnProduct = {
  id: string
  /** Marketing name shown on the card. */
  name: string
  /** URL-safe identifier (reserved for a future dedicated add-on route). */
  slug: string
  /** Pricing + cart key. Resolved against the retail snapshot seam. */
  catNo: string
  /** Pack/size descriptor, e.g. "30ml vial" or "Box of 100". */
  spec: string
  /**
   * Optional real product photograph for accessories that are not glass vials.
   * When omitted, the shared VialImage template renders the item as a labeled
   * research vial (correct for bacteriostatic fluids). When present it is shown
   * as-is on the studio backdrop.
   */
  image?: string
  /** Short, compliant, neutral description. */
  shortDescription: string
  /** Optional badge label, e.g. "Commonly Paired". */
  badge?: string
  /** Discriminator so a backend can return mixed product/add-on payloads. */
  isAddOnProduct: true
  /** Lower sorts first within a context. */
  addOnPriority: number
  /** Contexts in which this add-on may be recommended. */
  addOnContext: AddOnContext[]
  /** Inactive items are never shown (soft delete / seasonal). */
  isActive: boolean
  inventoryStatus: InventoryStatus
}

export const ADD_ONS: AddOnProduct[] = [
  {
    id: 'addon-bacteriostatic-water',
    name: 'Bacteriostatic Water',
    slug: 'bacteriostatic-water',
    catNo: 'BAC30',
    spec: '30ml vial',
    shortDescription: 'Commonly paired research support item for reconstitution workflows.',
    badge: 'Commonly Paired',
    isAddOnProduct: true,
    addOnPriority: 1,
    addOnContext: ['cart', 'checkout', 'autoship', 'product'],
    isActive: true,
    inventoryStatus: 'in_stock',
  },
  {
    id: 'addon-alcohol-prep-pads',
    name: 'Alcohol Prep Pads',
    slug: 'alcohol-prep-pads',
    catNo: 'PREP100',
    spec: 'Box of 100',
    image: '/catalog/addon-alcohol-prep-pads.png',
    shortDescription: 'Research support accessory to complete your setup.',
    badge: 'Commonly Paired',
    isAddOnProduct: true,
    addOnPriority: 2,
    addOnContext: ['cart', 'checkout', 'autoship', 'product'],
    isActive: true,
    inventoryStatus: 'in_stock',
  },
  {
    id: 'addon-vial-storage-case',
    name: 'Vial Storage Case',
    slug: 'vial-storage-case',
    catNo: 'CASE12',
    spec: 'Holds 12 vials',
    image: '/catalog/addon-vial-storage-case.png',
    shortDescription: 'Organize and protect your research vials.',
    isAddOnProduct: true,
    addOnPriority: 3,
    addOnContext: ['cart', 'checkout', 'product'],
    isActive: true,
    inventoryStatus: 'in_stock',
  },
  {
    id: 'addon-bacteriostatic-saline',
    name: 'Sodium Chloride 0.9%',
    slug: 'sodium-chloride-09',
    catNo: 'NACL30',
    spec: '30ml vial',
    shortDescription: 'Commonly paired research support fluid.',
    isAddOnProduct: true,
    addOnPriority: 4,
    addOnContext: ['cart', 'checkout', 'autoship'],
    isActive: true,
    inventoryStatus: 'in_stock',
  },
]

// Resolve the add-ons to recommend for a given context. Applies the active +
// inventory + context filters, removes items already in the cart (by catNo),
// sorts by priority, and caps the result. Returns [] when nothing qualifies so
// callers can hide the section entirely (no empty box).
export function getAddOns(opts: {
  context: AddOnContext
  excludeCatNos?: string[]
  limit?: number
}): AddOnProduct[] {
  const exclude = new Set(opts.excludeCatNos ?? [])
  return ADD_ONS.filter(
    (a) =>
      a.isActive &&
      a.inventoryStatus !== 'out_of_stock' &&
      a.addOnContext.includes(opts.context) &&
      !exclude.has(a.catNo),
  )
    .sort((a, b) => a.addOnPriority - b.addOnPriority)
    .slice(0, opts.limit ?? 3)
}
