'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  Package,
  Users,
  FlaskConical,
  MessageSquareQuote,
  FileText,
  Layers,
  Target,
  BookOpen,
  BarChart3,
  DollarSign,
  Radar,
  CalendarClock,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OverviewSection } from './sections/overview'
import { InventorySection } from './sections/inventory'
import { OrdersSection } from './sections/orders'
import { ProductsSection } from './sections/products'
import { CustomersSection } from './sections/customers'
import { CoasSection } from './sections/coas'
import { TestimonialsSection } from './sections/testimonials'
import { BlogSection } from './sections/blog'
import { SystemsSection } from './sections/systems'
import { GoalsSection } from './sections/goals'
import { LibrarySection } from './sections/library'
import { AnalyticsSection } from './sections/analytics'
import { PricingDashboardSection } from './sections/pricing-dashboard'
import { MarketIntelligenceSection } from './sections/market-intelligence'
import { PricingReportsSection } from './sections/pricing-reports'

type NavItem = { id: string; label: string; icon: LucideIcon; group: string }

const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, group: 'General' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'General' },
  { id: 'pricing', label: 'Pricing Dashboard', icon: DollarSign, group: 'Pricing' },
  { id: 'market', label: 'Market Intelligence', icon: Radar, group: 'Pricing' },
  { id: 'pricing-reports', label: 'Scheduler & Reports', icon: CalendarClock, group: 'Pricing' },
  { id: 'pricing', label: 'Pricing Dashboard', icon: DollarSign, group: 'Pricing' },
  { id: 'market-intel', label: 'Market Intelligence', icon: Radar, group: 'Pricing' },
  { id: 'pricing-reports', label: 'Scheduler & Reports', icon: CalendarClock, group: 'Pricing' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, group: 'Commerce' },
  { id: 'inventory', label: 'Inventory', icon: Boxes, group: 'Commerce' },
  { id: 'products', label: 'Products', icon: Package, group: 'Commerce' },
  { id: 'customers', label: 'Customers', icon: Users, group: 'Commerce' },
  { id: 'coas', label: 'COAs', icon: FlaskConical, group: 'Commerce' },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, group: 'Content' },
  { id: 'blog', label: 'Blog', icon: FileText, group: 'Content' },
  { id: 'systems', label: 'TRU Systems', icon: Layers, group: 'Content' },
  { id: 'goals', label: 'Goals', icon: Target, group: 'Content' },
  { id: 'library', label: 'Compound Library', icon: BookOpen, group: 'Content' },
]

const GROUPS = ['General', 'Pricing', 'Commerce', 'Content']

export function AdminShell() {
  const [active, setActive] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)

  function go(id: string) {
    setActive(id)
    setMobileOpen(false)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  function renderSection() {
    switch (active) {
      case 'overview':
        return <OverviewSection onNavigate={go} />
      case 'analytics':
        return <AnalyticsSection />
      case 'pricing':
        return <PricingDashboardSection />
      case 'market':
        return <MarketIntelligenceSection />
      case 'pricing-reports':
        return <PricingReportsSection />
      case 'pricing':
        return <PricingDashboardSection />
      case 'market-intel':
        return <MarketIntelligenceSection />
      case 'pricing-reports':
        return <PricingReportsSection />
      case 'orders':
        return <OrdersSection />
      case 'inventory':
        return <InventorySection />
      case 'products':
        return <ProductsSection />
      case 'customers':
        return <CustomersSection />
      case 'coas':
        return <CoasSection />
      case 'testimonials':
        return <TestimonialsSection />
      case 'blog':
        return <BlogSection />
      case 'systems':
        return <SystemsSection />
      case 'goals':
        return <GoalsSection />
      case 'library':
        return <LibrarySection />
      default:
        return <OverviewSection onNavigate={go} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              TRU
            </span>
            <span className="font-heading text-sm font-semibold text-foreground">Admin Console</span>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to store
        </Link>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 top-[57px] z-20 w-64 shrink-0 overflow-y-auto border-r border-border bg-card px-3 py-5 transition-transform lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <nav className="space-y-6">
            {GROUPS.map((group) => (
              <div key={group}>
                <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </div>
                <div className="space-y-1">
                  {NAV.filter((n) => n.group === group).map((item) => {
                    const Icon = item.icon
                    const isActive = active === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => go(item.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-secondary',
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 top-[57px] z-10 bg-primary/20 lg:hidden"
          />
        )}

        {/* Main */}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{renderSection()}</main>
      </div>
    </div>
  )
}
