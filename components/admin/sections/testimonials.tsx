'use client'

import { useState } from 'react'
import { Star, Check, X, MessageSquareQuote } from 'lucide-react'
import { TESTIMONIALS, type Testimonial } from '@/lib/admin-data'
import { SectionHeader, StatCard, StatusBadge, Chip } from '@/components/admin/ui'
import { MessageSquare, CheckCircle2 } from 'lucide-react'

const FILTERS = ['All', 'Published', 'Pending'] as const

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < rating ? 'h-4 w-4 fill-accent text-accent' : 'h-4 w-4 text-muted-foreground/40'}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(TESTIMONIALS)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  function setStatus(id: string, status: Testimonial['status']) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  const filtered = items.filter((t) => filter === 'All' || t.status === filter)
  const published = items.filter((t) => t.status === 'Published').length
  const pending = items.filter((t) => t.status === 'Pending').length

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Testimonials"
        description="Moderate customer reviews and control which appear on the storefront."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total reviews" value={items.length} icon={MessageSquare} />
        <StatCard label="Published" value={published} icon={CheckCircle2} />
        <StatCard label="Awaiting review" value={pending} icon={MessageSquareQuote} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((t) => (
          <div key={t.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-heading font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
              <StatusBadge status={t.status} />
            </div>
            <div className="mt-3">
              <Stars rating={t.rating} />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {'"'}
              {t.quote}
              {'"'}
            </p>
            <div className="mt-4 flex items-center gap-2">
              {t.status === 'Pending' ? (
                <button
                  type="button"
                  onClick={() => setStatus(t.id, 'Published')}
                  className="btn-premium inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStatus(t.id, 'Pending')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <X className="h-3.5 w-3.5" />
                  Unpublish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
