'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  delta?: number
  hint?: string
}) {
  const positive = (delta ?? 0) >= 0
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-3 font-heading text-2xl font-semibold text-foreground">{value}</div>
      {(delta !== undefined || hint) && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          {delta !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium',
                positive ? 'text-emerald-600' : 'text-destructive',
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {Math.abs(delta)}%
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  )
}

export function Toolbar({
  search,
  onSearch,
  placeholder = 'Search…',
  children,
}: {
  search: string
  onSearch: (v: string) => void
  placeholder?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
        />
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  'In stock': 'bg-emerald-500/12 text-emerald-700',
  'Low stock': 'bg-amber-500/15 text-amber-700',
  'Out of stock': 'bg-destructive/12 text-destructive',
  Processing: 'bg-amber-500/15 text-amber-700',
  Shipped: 'bg-sky-500/12 text-sky-700',
  Delivered: 'bg-emerald-500/12 text-emerald-700',
  Refunded: 'bg-muted text-muted-foreground',
  Paid: 'bg-emerald-500/12 text-emerald-700',
  Published: 'bg-emerald-500/12 text-emerald-700',
  Pending: 'bg-amber-500/15 text-amber-700',
  Draft: 'bg-muted text-muted-foreground',
  Scheduled: 'bg-sky-500/12 text-sky-700',
  Expired: 'bg-destructive/12 text-destructive',
  VIP: 'bg-accent/20 text-accent-foreground',
  Returning: 'bg-sky-500/12 text-sky-700',
  New: 'bg-secondary text-secondary-foreground',
  Active: 'bg-emerald-500/12 text-emerald-700',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        STATUS_STYLES[status] ?? 'bg-secondary text-secondary-foreground',
      )}
    >
      {status}
    </span>
  )
}

export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
      </div>
    </div>
  )
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        'whitespace-nowrap border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('whitespace-nowrap px-4 py-3.5 text-foreground', className)}>{children}</td>}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:border-primary/40',
      )}
    >
      {children}
    </button>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-14 text-center text-sm text-muted-foreground">{message}</div>
  )
}
