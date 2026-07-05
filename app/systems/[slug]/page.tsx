import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowUpRight,
  ArrowLeft,
  FlaskConical,
  BookOpen,
  Microscope,
  Check,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FaqAccordion } from '@/components/systems/faq-accordion'
import { SystemRecommendations } from '@/components/systems/system-recommendations'
import { getDataSource } from '@/lib/data'
import { iconFor } from '@/lib/icons'

// Recommendations read admin overrides from the database at request time.
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const data = getDataSource()
  const systems = await data.systems.list()
  return systems.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = getDataSource()
  const system = await data.systems.getBySlug(slug)
  if (!system) return { title: 'System Not Found | TRU PEPTIDE' }
  return {
    title: `${system.trademark} — ${system.category} | TRU PEPTIDE`,
    description: system.overview.slice(0, 155),
  }
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getDataSource()
  const system = await data.systems.getBySlug(slug)
  if (!system) notFound()

  const Icon = iconFor(system.iconKey)
  const allSystems = await data.systems.list()
  const related = system.related
    .map((s) => allSystems.find((sys) => sys.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="px-4 pt-32 pb-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/systems"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            All systems
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                <Icon className="h-4 w-4" />
                {system.category}
              </span>
              <h1 className="mt-6 text-balance font-heading text-5xl font-bold text-primary md:text-6xl">
                {system.trademark}
              </h1>
              <p className="mt-5 text-pretty text-xl leading-relaxed text-muted-foreground">
                {system.tagline}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {system.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-border/70 bg-card px-4 py-1.5 text-sm font-medium text-primary"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#compounds"
                  className="btn-premium inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground"
                >
                  View compounds
                </a>
                <a
                  href="#research"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
                >
                  Explore the science
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-[0_40px_80px_-40px_rgba(8,27,53,0.4)]">
                <Image
                  src={system.image || '/placeholder.svg'}
                  alt={`${system.trademark} illustration`}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Overview
              </span>
              <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
                What this system explores
              </h2>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                {system.overview}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-1">
              {system.overviewPoints.map((point) => (
                <div
                  key={point.title}
                  className="rounded-2xl border border-border/60 bg-card p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-secondary text-accent">
                      <Check className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary">
                        {point.title}
                      </h3>
                      <p className="mt-1.5 leading-relaxed text-muted-foreground">
                        {point.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Research */}
      <section id="research" className="px-4 py-16">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-primary px-6 py-16 text-primary-foreground md:px-14">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <Microscope className="h-4 w-4" />
              Scientific Research
            </span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-bold md:text-4xl">
              Grounded in peer-reviewed science
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {system.research.map((item, i) => (
              <div
                key={item.title}
                className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6"
              >
                <span className="font-heading text-2xl font-bold text-accent">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-primary-foreground/70">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Stacks + ranked products (tag-driven) */}
      <section id="compounds" className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                <FlaskConical className="h-4 w-4" />
                {system.trademark} Protocol
              </span>
              <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
                Build your regimen
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Every product tagged for {system.name} is included below, ranked by popularity and
                rating. Compare options and add what fits your goals.
              </p>
            </div>
          </div>
          <SystemRecommendations systemSlug={system.slug} systemName={system.name} />
        </div>
      </section>

      {/* Research Library */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                <BookOpen className="h-4 w-4" />
                Research Library
              </span>
              <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
                Learn the mechanisms
              </h2>
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {system.library.map((article) => (
              <a
                key={article.title}
                href="#"
                className="group flex flex-col justify-between rounded-3xl border border-border/60 bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.24)]"
              >
                <div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-accent">
                    {article.category}
                  </span>
                  <h3 className="mt-4 text-balance font-heading text-xl font-semibold text-primary">
                    {article.title}
                  </h3>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{article.readTime} read</span>
                  <ArrowUpRight className="h-5 w-5 text-primary transition-colors group-hover:text-accent" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Frequently Asked Questions
            </span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
              {system.trademark}, explained
            </h2>
          </div>
          <div className="mt-10">
            <FaqAccordion faqs={system.faqs} />
          </div>
        </div>
      </section>

      {/* Related Systems */}
      <section className="px-4 py-16 pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Related Systems
            </span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
              Continue exploring
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {related.map((rel) => {
              const RelIcon = iconFor(rel.iconKey)
              return (
                <Link
                  key={rel.slug}
                  href={`/systems/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.32)]"
                >
                  <div className="relative aspect-video overflow-hidden bg-secondary">
                    <Image
                      src={rel.image || '/placeholder.svg'}
                      alt={`${rel.trademark} illustration`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      <RelIcon className="h-3.5 w-3.5" />
                      {rel.category}
                    </span>
                    <h3 className="mt-3 font-heading text-xl font-bold text-primary">
                      {rel.trademark}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {rel.tagline}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
