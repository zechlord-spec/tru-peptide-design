import { PRODUCTS, type Product } from './products-data'
import { SYSTEMS } from './systems-data'
import { GOALS } from './goals-data'

/* Deterministic pseudo-random so numbers are stable between renders. */
function seeded(seed: number) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function money(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

/* ----------------------------- Inventory ----------------------------- */

export type InventoryRow = {
  catNo: string
  product: string
  slug: string
  category: string
  spec: string
  price: number
  stock: number
  reorderPoint: number
  status: 'In stock' | 'Low stock' | 'Out of stock'
}

export const INVENTORY: InventoryRow[] = PRODUCTS.flatMap((p, pi) =>
  p.variants.map((v, vi) => {
    const stock = Math.floor(seeded(pi * 13 + vi * 7 + 1) * 320)
    const reorderPoint = 40
    const status: InventoryRow['status'] =
      stock === 0 ? 'Out of stock' : stock <= reorderPoint ? 'Low stock' : 'In stock'
    return {
      catNo: v.catNo,
      product: p.name,
      slug: p.slug,
      category: p.category,
      spec: v.spec,
      price: v.price,
      stock,
      reorderPoint,
      status,
    }
  }),
)

/* ----------------------------- Orders ----------------------------- */

export type AdminOrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Refunded'

export type AdminOrder = {
  id: string
  customer: string
  email: string
  date: string
  items: number
  total: number
  status: AdminOrderStatus
  payment: 'Paid' | 'Refunded'
}

const FIRST = ['Jane', 'Marcus', 'Priya', 'Diego', 'Lena', 'Omar', 'Sofia', 'Ethan', 'Amara', 'Noah', 'Yuki', 'Isla']
const LAST = ['Chen', 'Okafor', 'Patel', 'Rivera', 'Novak', 'Haddad', 'Rossi', 'Brooks', 'Bello', 'Kim', 'Tanaka', 'Reid']
const STATUSES: AdminOrderStatus[] = ['Processing', 'Shipped', 'Delivered', 'Delivered', 'Refunded']

export const ORDERS: AdminOrder[] = Array.from({ length: 48 }, (_, i) => {
  const fn = FIRST[Math.floor(seeded(i * 3 + 2) * FIRST.length)]
  const ln = LAST[Math.floor(seeded(i * 5 + 4) * LAST.length)]
  const items = 1 + Math.floor(seeded(i * 7 + 1) * 4)
  const total = 60 + Math.floor(seeded(i * 11 + 3) * 940)
  const daysAgo = Math.floor(seeded(i * 2 + 9) * 120)
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  const status = STATUSES[Math.floor(seeded(i * 17 + 6) * STATUSES.length)]
  return {
    id: `TRU-${(10248 + i).toString()}`,
    customer: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@lab.com`,
    date: d.toISOString(),
    items,
    total,
    status,
    payment: status === 'Refunded' ? 'Refunded' : 'Paid',
  }
}).sort((a, b) => +new Date(b.date) - +new Date(a.date))

/* ----------------------------- Customers ----------------------------- */

export type AdminCustomer = {
  id: string
  name: string
  email: string
  orders: number
  spent: number
  joined: string
  tier: 'New' | 'Returning' | 'Top'
}

export const CUSTOMERS: AdminCustomer[] = (() => {
  const map = new Map<string, AdminCustomer>()
  ORDERS.forEach((o, i) => {
    const existing = map.get(o.email)
    if (existing) {
      existing.orders += 1
      existing.spent += o.total
    } else {
      const d = new Date()
      d.setDate(d.getDate() - Math.floor(seeded(i * 4 + 8) * 400))
      map.set(o.email, {
        id: `CUS-${(2100 + i).toString()}`,
        name: o.customer,
        email: o.email,
        orders: 1,
        spent: o.total,
        joined: d.toISOString(),
        tier: 'New',
      })
    }
  })
  return Array.from(map.values())
    .map((c) => ({
      ...c,
      tier: c.spent > 1500 ? 'Top' : c.orders > 1 ? 'Returning' : 'New',
    }))
    .sort((a, b) => b.spent - a.spent)
})()

/* ----------------------------- COAs ----------------------------- */

export type CoaRecord = {
  catNo: string
  product: string
  slug: string
  batch: string
  purity: string
  testedOn: string
  lab: string
  status: 'Published' | 'Pending' | 'Expired'
}

const LABS = ['Janoshik Analytical', 'Colmaric Analyticals', 'MZ Biolabs']
export const COAS: CoaRecord[] = PRODUCTS.slice(0, 30).map((p, i) => {
  const purity = (97 + seeded(i * 6 + 1) * 2.9).toFixed(2)
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(seeded(i * 9 + 2) * 220))
  const status: CoaRecord['status'] =
    seeded(i * 12 + 3) > 0.85 ? 'Pending' : seeded(i * 8 + 5) > 0.92 ? 'Expired' : 'Published'
  return {
    catNo: p.variants[0].catNo,
    product: p.name,
    slug: p.slug,
    batch: `B${(240100 + i * 7).toString()}`,
    purity: `${purity}%`,
    testedOn: d.toISOString(),
    lab: LABS[Math.floor(seeded(i * 3 + 4) * LABS.length)],
    status,
  }
})

/* ----------------------------- Testimonials ----------------------------- */

export type Testimonial = {
  id: string
  name: string
  role: string
  rating: number
  quote: string
  status: 'Published' | 'Pending'
  date: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'T-01',
    name: 'Dr. Marcus Okafor',
    role: 'Research Director',
    rating: 5,
    quote:
      'The consistency between COAs and delivered material is the best I have seen from any supplier. Purity numbers hold up under our own HPLC verification.',
    status: 'Published',
    date: new Date(Date.now() - 6 * 864e5).toISOString(),
  },
  {
    id: 'T-02',
    name: 'Priya Patel, PhD',
    role: 'Biochemist',
    rating: 5,
    quote:
      'Cold-chain packaging arrived intact and documentation was immaculate. TRU has become our default for reference-grade peptides.',
    status: 'Published',
    date: new Date(Date.now() - 14 * 864e5).toISOString(),
  },
  {
    id: 'T-03',
    name: 'Lena Novak',
    role: 'Lab Manager',
    rating: 4,
    quote:
      'Turnaround on batch reports is quick and the team answers technical questions seriously. Would appreciate more bulk specs.',
    status: 'Pending',
    date: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: 'T-04',
    name: 'Diego Rivera',
    role: 'Independent Researcher',
    rating: 5,
    quote:
      'Third-party testing transparency is what sold me. Every lot is traceable and the library content is genuinely educational.',
    status: 'Pending',
    date: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
]

/* ----------------------------- Blog ----------------------------- */

export type BlogPost = {
  id: string
  title: string
  category: string
  author: string
  status: 'Published' | 'Draft' | 'Scheduled'
  date: string
  views: number
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'BP-01',
    title: 'Understanding GLP-1 Incretin Mimetics in Metabolic Research',
    category: 'Science',
    author: 'Dr. M. Okafor',
    status: 'Published',
    date: new Date(Date.now() - 5 * 864e5).toISOString(),
    views: 4820,
  },
  {
    id: 'BP-02',
    title: 'How We Validate Peptide Purity: A Look Inside Our QC Process',
    category: 'Quality',
    author: 'TRU Lab Team',
    status: 'Published',
    date: new Date(Date.now() - 12 * 864e5).toISOString(),
    views: 3120,
  },
  {
    id: 'BP-03',
    title: 'Reconstitution Best Practices for Lyophilized Peptides',
    category: 'Protocol',
    author: 'P. Patel, PhD',
    status: 'Published',
    date: new Date(Date.now() - 20 * 864e5).toISOString(),
    views: 6740,
  },
  {
    id: 'BP-04',
    title: 'The Research Behind Tissue-Repair Peptides',
    category: 'Science',
    author: 'Dr. M. Okafor',
    status: 'Draft',
    date: new Date().toISOString(),
    views: 0,
  },
  {
    id: 'BP-05',
    title: 'Cold-Chain Logistics: Protecting Peptide Integrity in Transit',
    category: 'Operations',
    author: 'TRU Lab Team',
    status: 'Scheduled',
    date: new Date(Date.now() + 3 * 864e5).toISOString(),
    views: 0,
  },
]

/* ----------------------------- Analytics ----------------------------- */

export const MONTHLY = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
].map((m, i) => ({
  month: m,
  revenue: 42000 + Math.floor(seeded(i * 3 + 1) * 60000),
  orders: 180 + Math.floor(seeded(i * 5 + 2) * 260),
}))

export const CATEGORY_BREAKDOWN = (() => {
  const counts = new Map<string, number>()
  PRODUCTS.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1))
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }))
})()

export const TOP_PRODUCTS = PRODUCTS.slice(0, 6).map((p, i) => ({
  name: p.name,
  units: 120 + Math.floor(seeded(i * 7 + 3) * 880),
  revenue: 4000 + Math.floor(seeded(i * 9 + 4) * 34000),
}))

export const TRAFFIC = [
  { source: 'Organic Search', value: 44 },
  { source: 'Direct', value: 26 },
  { source: 'Referral', value: 18 },
  { source: 'Social', value: 12 },
]

/* ----------------------------- KPIs ----------------------------- */

export const KPIS = (() => {
  const revenue = ORDERS.filter((o) => o.payment === 'Paid').reduce((s, o) => s + o.total, 0)
  const lowStock = INVENTORY.filter((r) => r.status !== 'In stock').length
  const pendingCoas = COAS.filter((c) => c.status === 'Pending').length
  return {
    revenue,
    orders: ORDERS.length,
    customers: CUSTOMERS.length,
    products: PRODUCTS.length,
    systems: SYSTEMS.length,
    goals: GOALS.length,
    lowStock,
    pendingCoas,
    aov: Math.round(revenue / ORDERS.length),
  }
})()

export { PRODUCTS, SYSTEMS, GOALS }
