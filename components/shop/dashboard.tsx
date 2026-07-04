'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VialImage } from '@/components/products/vial-image'
import {
  Package,
  Heart,
  Bookmark,
  FileText,
  Clock,
  Settings,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Download,
  Trash2,
  User,
} from 'lucide-react'
import { useStore, money, type CoaDownload } from '@/lib/store'
import { getProduct, type Product } from '@/lib/products-data'
import { useRetailSnapshot } from '@/lib/pricing/pricing-context'
import { retailRangeFrom } from '@/lib/pricing/format'
import { SignInForm } from '@/components/shop/sign-in-form'

type TabId = 'orders' | 'saved' | 'coa' | 'favorites' | 'recent' | 'settings'

const TABS: { id: TabId; label: string; icon: typeof Package }[] = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'saved', label: 'Saved Products', icon: Bookmark },
  { id: 'coa', label: 'COA Downloads', icon: FileText },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'recent', label: 'Recently Viewed', icon: Clock },
  { id: 'settings', label: 'Account Settings', icon: Settings },
]

export function Dashboard() {
  const store = useStore()
  const [tab, setTab] = useState<TabId>('orders')

  if (!store.hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!store.account) return <SignInForm onSignIn={store.signIn} />

  const { account, orders, favorites, saved, recentlyViewed, coaDownloads } = store
  const initial = account.name.charAt(0).toUpperCase()

  const counts: Record<TabId, number> = {
    orders: orders.length,
    saved: saved.length,
    coa: coaDownloads.length,
    favorites: favorites.length,
    recent: recentlyViewed.length,
    settings: 0,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="font-heading text-2xl font-bold">{initial}</span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Welcome back
            </p>
            <h1 className="font-heading text-3xl font-bold text-foreground">{account.name}</h1>
            <p className="text-sm text-muted-foreground">{account.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={store.signOut}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      {/* Stat strip */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Total spent" value={money(orders.reduce((n, o) => n + o.total, 0))} />
        <Stat label="Favorites" value={String(favorites.length)} />
        <Stat label="COA files" value={String(coaDownloads.length)} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar nav */}
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex flex-shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  <span className="flex-1 whitespace-nowrap">{t.label}</span>
                  {counts[t.id] > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        active ? 'bg-primary-foreground/20' : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {counts[t.id]}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Panel */}
        <div className="min-w-0">
          {tab === 'orders' && <OrdersPanel orders={orders} />}
          {tab === 'saved' && (
            <ProductGridPanel
              slugs={saved}
              emptyIcon={Bookmark}
              emptyTitle="No saved products"
              emptyText="Save compounds you want to revisit before ordering."
              onRemove={store.toggleSaved}
              removeLabel="Remove"
            />
          )}
          {tab === 'coa' && <CoaPanel downloads={coaDownloads} />}
          {tab === 'favorites' && (
            <ProductGridPanel
              slugs={favorites}
              emptyIcon={Heart}
              emptyTitle="No favorites yet"
              emptyText="Tap the heart on any compound to add it to your favorites."
              onRemove={store.toggleFavorite}
              removeLabel="Unfavorite"
            />
          )}
          {tab === 'recent' && (
            <ProductGridPanel
              slugs={recentlyViewed}
              emptyIcon={Clock}
              emptyTitle="Nothing viewed yet"
              emptyText="Compounds you view will show up here for quick access."
            />
          )}
          {tab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  )
}

/* --------------------------- Panels --------------------------- */

function OrdersPanel({ orders }: { orders: ReturnType<typeof useStore>['orders'] }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        text="When you place an order, it will appear here."
        cta={{ href: '/products', label: 'Start Shopping' }}
      />
    )
  }
  return (
    <div>
      <PanelHeading title="Orders" subtitle="Track and revisit your research orders" />
      <ul className="mt-5 space-y-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/order/${order.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                <Package className="h-5 w-5 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-foreground">{order.id}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                    {order.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  · {order.items.reduce((n, i) => n + i.qty, 0)} item(s)
                </p>
              </div>
              <span className="font-heading text-sm font-bold text-primary">{money(order.total)}</span>
              <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductGridPanel({
  slugs,
  emptyIcon,
  emptyTitle,
  emptyText,
  onRemove,
  removeLabel,
}: {
  slugs: string[]
  emptyIcon: typeof Heart
  emptyTitle: string
  emptyText: string
  onRemove?: (slug: string) => void
  removeLabel?: string
}) {
  const snapshot = useRetailSnapshot()
  const products = slugs
    .map((s) => getProduct(s))
    .filter((p): p is Product => Boolean(p))

  if (products.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        text={emptyText}
        cta={{ href: '/products', label: 'Browse Compounds' }}
      />
    )
  }

  const headingMap: Record<string, string> = {
    'No saved products': 'Saved Products',
    'No favorites yet': 'Favorites',
    'Nothing viewed yet': 'Recently Viewed',
  }

  return (
    <div>
      <PanelHeading
        title={headingMap[emptyTitle] ?? 'Products'}
        subtitle={`${products.length} compound${products.length > 1 ? 's' : ''}`}
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <div
            key={p.slug}
            className="group relative flex gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <Link
              href={`/products/${p.slug}`}
              className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary"
            >
              <VialImage
                name={p.name}
                catNo={p.variants[0]?.catNo ?? ''}
                sizes="80px"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {p.category}
              </p>
              <Link
                href={`/products/${p.slug}`}
                className="mt-0.5 block font-heading text-sm font-semibold leading-tight text-foreground transition-colors hover:text-primary"
              >
                {p.name}
              </Link>
              <p className="mt-1 font-heading text-sm font-bold text-primary">{retailRangeFrom(snapshot, p)}</p>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(p.slug)}
                aria-label={`${removeLabel} ${p.name}`}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CoaPanel({ downloads }: { downloads: CoaDownload[] }) {
  if (downloads.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No COA downloads"
        text="Certificates of Analysis you download will be listed here for quick re-access."
        cta={{ href: '/products', label: 'Browse Compounds' }}
      />
    )
  }
  return (
    <div>
      <PanelHeading title="COA Downloads" subtitle="Your certificate of analysis history" />
      <ul className="mt-5 space-y-3">
        {downloads.map((d) => (
          <li
            key={`${d.slug}:${d.catNo}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
              <FileText className="h-5 w-5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${d.slug}`}
                className="font-heading text-sm font-semibold text-foreground transition-colors hover:text-primary"
              >
                {d.name}
              </Link>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <span className="font-mono">{d.catNo}</span> · {d.spec} · Downloaded{' '}
                {new Date(d.downloadedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Link
              href={`/products/${d.slug}#coa`}
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Download className="h-3.5 w-3.5" />
              Re-download
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SettingsPanel() {
  const { account, updateAccount } = useStore()
  const [name, setName] = useState(account?.name ?? '')
  const [email, setEmail] = useState(account?.email ?? '')
  const [org, setOrg] = useState(account?.org ?? '')
  const [phone, setPhone] = useState(account?.phone ?? '')
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateAccount({ name: name.trim(), email: email.trim(), org: org.trim(), phone: phone.trim() })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div>
      <PanelHeading title="Account Settings" subtitle="Manage your profile and preferences" />
      <form onSubmit={handleSave} className="mt-5 space-y-5 rounded-3xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={name} onChange={setName} placeholder="Jane Researcher" />
          <Field label="Email" value={email} onChange={setEmail} placeholder="you@lab.com" type="email" />
          <Field label="Organization" value={org} onChange={setOrg} placeholder="Research institute" />
          <Field label="Phone" value={phone} onChange={setPhone} placeholder="(555) 000-0000" />
        </div>

        <div className="rounded-2xl bg-secondary/60 p-4">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              This is a demo account. Your details are stored locally on this device and are used to
              pre-fill checkout. No password is required.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="btn-premium rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

/* --------------------------- Bits --------------------------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 font-heading text-xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function PanelHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  text,
  cta,
}: {
  icon: typeof Heart
  title: string
  text: string
  cta: { href: string; label: string }
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">{text}</p>
      </div>
      <Link
        href={cta.href}
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {cta.label}
      </Link>
    </div>
  )
}
