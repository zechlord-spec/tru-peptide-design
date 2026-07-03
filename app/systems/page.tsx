import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SYSTEMS } from '@/lib/systems-data'

export const metadata: Metadata = {
  title: 'TRU Systems — Curated Research Collections | TRU PEPTIDE',
  description:
    'Explore TRU Systems: curated educational collections of research compounds organized around goals like beauty, performance, longevity, recovery, and immunity.',
}

export default function SystemsHubPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="px-4 pt-36 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            The TRU Systems Hub
          </span>
          <h1 className="mt-5 text-balance font-heading text-4xl font-bold text-primary md:text-6xl">
            Curated collections, organized by goal
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Each TRU System is an educational collection built around a single research
            objective — pairing the most-studied compounds with the science that explains them.
          </p>
        </div>
      </section>

      {/* Systems grid */}
      <section className="px-4 pb-28">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((system) => {
            const Icon = system.icon
            return (
              <Link
                key={system.slug}
                href={`/systems/${system.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.32)]"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-secondary">
                  <Image
                    src={system.image || '/placeholder.svg'}
                    alt={`${system.trademark} illustration`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                    <Icon className="h-3.5 w-3.5 text-accent" />
                    {system.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-heading text-2xl font-bold text-primary">
                    {system.trademark}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {system.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {system.focusAreas.slice(0, 3).map((area) => (
                      <span
                        key={area}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                    Explore system
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
