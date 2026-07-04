import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  Microscope,
  ShieldAlert,
  Thermometer,
  FileText,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PRODUCTS, getProduct, getRelatedProducts } from '@/lib/products-data'
import { getRetailSnapshot } from '@/lib/pricing/service'
import { retailRangeFrom } from '@/lib/pricing/format'
import { getTypeContent, getStorage } from '@/lib/product-content'
import { getEduContent, getSafetyInfo } from '@/lib/library-content'
import { SYSTEMS } from '@/lib/systems-data'
import { GOALS } from '@/lib/goals-data'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: 'Compound Not Found | TRU PEPTIDE' }
  return {
    title: `${product.name} — Compound Library | TRU PEPTIDE`,
    description: `The science behind ${product.name}: discovery history, mechanism of action, and current research. Research reference material only.`,
  }
}

const SECTIONS = [
  { id: 'summary', label: 'Executive Summary' },
  { id: 'discovery', label: 'Discovery History' },
  { id: 'mechanism', label: 'Mechanism' },
  { id: 'research-areas', label: 'Research Areas' },
  { id: 'current-research', label: 'Current Research' },
  { id: 'safety', label: 'Safety' },
  { id: 'storage', label: 'Storage' },
  { id: 'references', label: 'References' },
]

export default async function LibraryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const type = getTypeContent(product)
  const edu = getEduContent(product)
  const safety = getSafetyInfo(product)
  const storage = getStorage(product)
  const related = getRelatedProducts(product, 3)
  const pricing = await getRetailSnapshot()

  const relatedSystems = product.systems
    .map((name) => SYSTEMS.find((s) => s.name === name))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
  const suggestedGoals = product.goals
    .map((name) => GOALS.find((g) => g.name === name))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Breadcrumb + hero */}
      <section className="px-4 pt-32 pb-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Compound Library
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <BookOpen className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              {product.compoundType}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {product.category}
            </span>
          </div>
          <h1 className="mt-5 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {edu.summary(product.name)}
          </p>
        </div>
      </section>

      {/* Section nav */}
      <nav
        aria-label="Section navigation"
        className="sticky top-16 z-30 border-y border-border/60 bg-background/85 backdrop-blur"
      >
        <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 py-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4">
        {/* Executive Summary */}
        <section id="summary" className="scroll-mt-32 border-b border-border/50 py-14">
          <SectionHeading icon={Sparkles} eyebrow="Overview" title="Executive Summary" />
          <p className="mt-6 text-lg leading-relaxed text-foreground/90">{edu.summary(product.name)}</p>
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-primary">Research context:</strong> {product.name} is studied
              primarily within {product.goals.slice(0, 2).join(' and ').toLowerCase()} research. All
              information below is presented for educational and reference purposes only.
            </p>
          </div>
        </section>

        {/* Discovery History */}
        <section id="discovery" className="scroll-mt-32 border-b border-border/50 py-14">
          <SectionHeading icon={BookOpen} eyebrow="Origins" title="Discovery History" />
          <ol className="mt-8 space-y-6">
            {edu.discovery.map((m, i) => (
              <li key={i} className="relative flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  {i < edu.discovery.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
                  )}
                </div>
                <div className="pb-2">
                  <span className="font-heading text-sm font-bold uppercase tracking-wide text-accent">
                    {m.year}
                  </span>
                  <p className="mt-1 leading-relaxed text-foreground/90">{m.event}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Mechanism */}
        <section id="mechanism" className="scroll-mt-32 border-b border-border/50 py-14">
          <SectionHeading icon={FlaskConical} eyebrow="How it works" title="Mechanism of Action" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {type.mechanism.map((step, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_1px_2px_rgba(8,27,53,0.04)]"
              >
                <span className="font-heading text-2xl font-bold text-accent/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-heading text-lg font-semibold text-primary">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Research Areas */}
        <section id="research-areas" className="scroll-mt-32 border-b border-border/50 py-14">
          <SectionHeading
            icon={Microscope}
            eyebrow="Fields of study"
            title="Areas of Scientific Research"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {type.researchAreas.map((area, i) => (
              <div key={i} className="flex gap-4 rounded-2xl bg-secondary/60 p-5">
                <ChevronRight className="mt-0.5 h-5 w-5 flex-none text-accent" aria-hidden="true" />
                <div>
                  <h3 className="font-heading font-semibold text-primary">{area.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{area.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Research */}
        <section id="current-research" className="scroll-mt-32 border-b border-border/50 py-14">
          <SectionHeading icon={Sparkles} eyebrow="What's being studied now" title="Current Research" />
          <ul className="mt-8 space-y-3">
            {edu.currentResearch.map((item, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-[0_1px_2px_rgba(8,27,53,0.04)]"
              >
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <p className="leading-relaxed text-foreground/90">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Safety Information */}
        <section id="safety" className="scroll-mt-32 border-b border-border/50 py-14">
          <SectionHeading icon={ShieldAlert} eyebrow="Important" title="Safety Information" />
          <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <p className="text-sm font-semibold text-destructive">
              For laboratory research use only — not for human or veterinary use.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {safety.map((point, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card p-6">
                <h3 className="font-heading font-semibold text-primary">{point.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{point.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Storage */}
        <section id="storage" className="scroll-mt-32 border-b border-border/50 py-14">
          <SectionHeading icon={Thermometer} eyebrow="Handling" title="Storage" />
          <div className="mt-8 space-y-3">
            {storage.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl bg-secondary/60 p-5"
              >
                <Thermometer className="mt-0.5 h-5 w-5 flex-none text-accent" aria-hidden="true" />
                <div>
                  <h3 className="font-heading font-semibold text-primary">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* References */}
        <section id="references" className="scroll-mt-32 py-14">
          <SectionHeading icon={FileText} eyebrow="Sources" title="Scientific References" />
          <ol className="mt-8 space-y-4">
            {type.references.map((ref, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-heading text-sm font-bold text-accent">[{i + 1}]</span>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground">{ref.authors}</span> {ref.title}.{' '}
                  <em>{ref.source}</em>, {ref.year}.
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            References are provided for educational context and represent general areas of published
            literature on this class of compound.
          </p>
        </section>
      </div>

      {/* Suggested Goals */}
      {suggestedGoals.length > 0 && (
        <section className="border-t border-border/60 bg-secondary/40 px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-heading text-2xl font-bold text-primary">Suggested Goals</h2>
            <p className="mt-2 text-muted-foreground">Research objectives this compound is studied for.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {suggestedGoals.map((goal) => {
                const Icon = goal.icon
                return (
                  <Link
                    key={goal.slug}
                    href={`/goals`}
                    className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent"
                  >
                    <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                    {goal.name}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" aria-hidden="true" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related Systems */}
      {relatedSystems.length > 0 && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-heading text-2xl font-bold text-primary">Related TRU Systems</h2>
            <p className="mt-2 text-muted-foreground">
              Curated collections that feature {product.name}.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {relatedSystems.map((system) => {
                const Icon = system.icon
                return (
                  <Link
                    key={system.slug}
                    href={`/systems/${system.slug}`}
                    className="group flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(8,27,53,0.3)]"
                  >
                    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-bold text-primary">{system.trademark}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{system.tagline}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent" aria-hidden="true" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-border/60 bg-secondary/40 px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-primary">Related Compounds</h2>
                <p className="mt-2 text-muted-foreground">Explore the science of adjacent compounds.</p>
              </div>
              <Link
                href="/library"
                className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent sm:inline-flex"
              >
                All compounds
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/library/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.32)]"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-secondary">
                    <Image
                      src={p.image || '/placeholder.svg'}
                      alt={`${p.name} research vial`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-medium text-muted-foreground">{p.compoundType}</span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-primary">{p.name}</h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                      Read the science
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bridge to product */}
      <section className="px-4 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-3xl border border-border/60 bg-card p-10 text-center shadow-[0_1px_2px_rgba(8,27,53,0.04)] sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">
              Source {product.name} for your research
            </h2>
            <p className="mt-2 text-muted-foreground">
              Third-party tested reference material, from {retailRangeFrom(pricing, product)} per vial.
            </p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex flex-none items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View product
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>
  eyebrow: string
  title: string
}) {
  return (
    <div>
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 className="mt-3 font-heading text-3xl font-bold text-primary">{title}</h2>
    </div>
  )
}
