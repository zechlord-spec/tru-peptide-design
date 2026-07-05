import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  FlaskConical,
  Microscope,
  Workflow,
  FileCheck2,
  Snowflake,
  Beaker,
  BookMarked,
  Target,
  Layers,
  ShieldCheck,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FaqAccordion } from '@/components/systems/faq-accordion'
import { PurchasePanel } from '@/components/products/purchase-panel'
import { VialImage } from '@/components/products/vial-image'
import { FavoriteButton } from '@/components/shop/favorite-button'
import { ViewTracker } from '@/components/shop/view-tracker'
import { CoaDownloadButton } from '@/components/shop/coa-download-button'
import { getDataSource } from '@/lib/data'
import { vialLabel } from '@/lib/data/format'
import { iconFor } from '@/lib/icons'
import { retailUnitFrom, retailRangeFrom, formatUSD } from '@/lib/pricing/format'
import {
  getTypeContent,
  getStorage,
  getReconstitution,
  getFaqs,
} from '@/lib/product-content'

export async function generateStaticParams() {
  const data = getDataSource()
  const products = await data.products.list()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = getDataSource()
  const product = await data.products.getBySlug(slug)
  if (!product) return { title: 'Compound Not Found | TRU PEPTIDE' }
  return {
    title: `${product.name} — ${product.category} | TRU PEPTIDE`,
    description: product.blurb,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getDataSource()
  const product = await data.products.getBySlug(slug)
  if (!product) notFound()

  const content = getTypeContent(product)
  const storage = getStorage(product)
  const reconstitution = getReconstitution(product)
  const faqs = getFaqs(product)
  const [related, allSystems, allGoals, pricing] = await Promise.all([
    data.products.getRelated(product.slug),
    data.systems.list(),
    data.goals.list(),
    data.pricing.getRetailSnapshot(),
  ])

  const relatedSystems = product.systems
    .map((name) => allSystems.find((s) => s.name === name))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
  const suggestedGoals = product.goals
    .map((name) => allGoals.find((g) => g.name === name))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0">
      <ViewTracker slug={product.slug} />
      <SiteHeader />

      {/* Hero */}
      <section className="px-4 pt-32 pb-16">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/products" className="inline-flex items-center gap-1.5 font-semibold transition-colors hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Compound Library
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: gallery + product information */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border/60 bg-secondary shadow-[0_40px_80px_-40px_rgba(8,27,53,0.4)]">
                <VialImage
                  name={product.name}
                  catNo={product.variants[0]?.catNo ?? ''}
                  spec={product.variants[0]?.spec}
                  showSku
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
                  <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
                  Research Only
                </span>
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  {product.isNew && (
                    <span className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
                      New
                    </span>
                  )}
                  <FavoriteButton slug={product.slug} />
                </div>
              </div>

              <div className="mt-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {product.category} • {product.compoundType}
                </span>
                <h1 className="mt-5 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  {product.blurb}
                </p>
              </div>

              {/* Key specifications */}
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4">
                {[
                  { label: 'Category', value: product.category },
                  { label: 'Compound Type', value: product.compoundType },
                  { label: 'Purity', value: '≥ 99% HPLC' },
                  { label: 'Options', value: `${product.variants.length} spec${product.variants.length > 1 ? 's' : ''}` },
                ].map((spec) => (
                  <div key={spec.label} className="bg-card px-4 py-4">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-primary">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              {/* COA + batch verification */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#coa"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
                >
                  <FileCheck2 className="h-4 w-4 text-accent" />
                  Certificate of Analysis
                </a>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-medium text-primary">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Batch verified
                </span>
              </div>

              {(product.goals.length > 0 || product.systems.length > 0) && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.goals.map((goal) => (
                    <span key={goal} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                      {goal}
                    </span>
                  ))}
                  {product.systems.map((system) => (
                    <span key={system} className="rounded-full border border-accent/40 px-3 py-1.5 text-xs font-medium text-accent-foreground/80">
                      {system}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: premium purchase card */}
            <PurchasePanel product={product} />
          </div>
        </div>
      </section>

      {/* Research overview */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Research Overview</span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
            Understanding {product.name}
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            {content.overview(product.name)}
          </p>
        </div>
      </section>

      {/* Mechanism of action */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <Workflow className="h-4 w-4" />
              Mechanism of Action
            </span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
              How it is studied to work
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.mechanism.map((step, i) => (
              <div key={step.title} className="relative rounded-3xl border border-border/60 bg-card p-6">
                <span className="font-heading text-2xl font-bold text-accent">0{i + 1}</span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-primary">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of scientific research */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-primary px-6 py-16 text-primary-foreground md:px-14">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <Microscope className="h-4 w-4" />
              Areas of Scientific Research
            </span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-bold md:text-4xl">
              Where investigators are looking
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.researchAreas.map((area) => (
              <div key={area.title} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6">
                <h3 className="font-heading text-lg font-semibold">{area.title}</h3>
                <p className="mt-2 leading-relaxed text-primary-foreground/70">{area.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product specifications */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Product Specifications</span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
            Catalog & pricing
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2 border-b border-border bg-secondary px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Cat. No.</span>
              <span>Vial</span>
              <span className="text-right">Per Vial (USD)</span>
            </div>
            <ul className="divide-y divide-border">
              {product.variants.map((v) => (
                <li key={v.catNo} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2 px-5 py-3.5 text-sm transition-colors hover:bg-secondary/50">
                  <span className="font-mono text-xs text-muted-foreground">{v.catNo}</span>
                  <span className="text-foreground">{vialLabel(v.spec)}</span>
                  <span className="text-right font-heading font-semibold text-primary">
                    {formatUSD(retailUnitFrom(pricing, v.catNo))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Storage & Reconstitution */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-2">
          {/* Storage */}
          <div className="rounded-3xl border border-border/60 bg-card p-8">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <Snowflake className="h-4 w-4" />
              Storage
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold text-primary">Keeping it stable</h2>
            <ul className="mt-6 space-y-4">
              {storage.map((s) => (
                <li key={s.title} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 flex-none rounded-full bg-accent" aria-hidden="true" />
                  <div>
                    <h3 className="font-heading text-base font-semibold text-primary">{s.title}</h3>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Reconstitution */}
          <div className="rounded-3xl border border-border/60 bg-card p-8">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <Beaker className="h-4 w-4" />
              Reconstitution
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold text-primary">Preparing the compound</h2>
            {reconstitution ? (
              <>
                <ol className="mt-6 space-y-3">
                  {reconstitution.steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <p className="leading-relaxed text-muted-foreground">{step}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 rounded-xl bg-secondary/70 p-4 text-sm leading-relaxed text-muted-foreground">
                  {reconstitution.note}
                </p>
              </>
            ) : (
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {product.name} is supplied as a ready-to-use solution and does not require reconstitution. Refrigerate after opening and follow the storage guidance.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* COA */}
      <section id="coa" className="scroll-mt-24 px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-8 rounded-[2rem] border border-border/60 bg-card p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                <FileCheck2 className="h-4 w-4" />
                Certificate of Analysis
              </span>
              <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary">
                Third-party verified purity
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Every lot of {product.name} is independently tested by HPLC and mass spectrometry to confirm identity and
                purity. Download the current Certificate of Analysis or request the report for a specific batch.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  HPLC ≥ 99% purity
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Mass-spec identity confirmed
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto">
              <CoaDownloadButton
                slug={product.slug}
                name={product.name}
                variant={{ catNo: product.variants[0].catNo, spec: vialLabel(product.variants[0].spec) }}
              />
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-7 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
              >
                Request batch report
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Frequently Asked Questions
            </span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
              {product.name}, explained
            </h2>
          </div>
          <div className="mt-10">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Scientific references */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <BookMarked className="h-4 w-4" />
            Scientific References
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
            Selected literature
          </h2>
          <ol className="mt-8 space-y-4">
            {content.references.map((ref, i) => (
              <li key={ref.title} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5">
                <span className="font-heading text-lg font-bold text-accent">{i + 1}.</span>
                <div>
                  <p className="font-medium text-primary">{ref.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {ref.authors} <span aria-hidden="true">•</span> <em>{ref.source}</em>, {ref.year}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
            References are provided for educational and research context only and do not constitute medical claims.
          </p>
        </div>
      </section>

      {/* Related compounds */}
      {related.length > 0 && (
        <section className="px-4 py-14">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                <FlaskConical className="h-4 w-4" />
                Related Compounds
              </span>
              <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
                Studied alongside {product.name}
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/products/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.28)]"
                >
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                        <VialImage
                          name={rel.name}
                          catNo={rel.variants[0]?.catNo ?? ''}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {rel.category}
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-semibold text-primary">{rel.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{rel.blurb}</p>
                    <div className="mt-4 flex items-center justify-between pt-2">
                      <span className="font-heading font-semibold text-primary">{retailRangeFrom(pricing, rel)}</span>
                      <ArrowUpRight className="h-5 w-5 text-primary transition-colors group-hover:text-accent" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related TRU Systems */}
      {relatedSystems.length > 0 && (
        <section className="px-4 py-14">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                <Layers className="h-4 w-4" />
                Related TRU Systems
              </span>
              <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
                Curated protocols featuring this compound
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {relatedSystems.map((sys) => {
                const SysIcon = iconFor(sys.iconKey)
                return (
                  <Link
                    key={sys.slug}
                    href={`/systems/${sys.slug}`}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.32)]"
                  >
                    <div className="relative aspect-video overflow-hidden bg-secondary">
                      <Image
                        src={sys.image || '/placeholder.svg'}
                        alt={`${sys.trademark} illustration`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                        <SysIcon className="h-3.5 w-3.5" />
                        {sys.category}
                      </span>
                      <h3 className="mt-3 font-heading text-xl font-bold text-primary">{sys.trademark}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sys.tagline}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Suggested Goals */}
      {suggestedGoals.length > 0 && (
        <section className="px-4 py-14 pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                <Target className="h-4 w-4" />
                Suggested Goals
              </span>
              <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
                Explore the goals it supports
              </h2>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              {suggestedGoals.map((goal) => {
                const GoalIcon = iconFor(goal.iconKey)
                return (
                  <Link
                    key={goal.slug}
                    href="/goals"
                    className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(8,27,53,0.3)]"
                  >
                    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-secondary text-accent">
                      <GoalIcon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary">{goal.name}</h3>
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        Discover goal
                        <ArrowUpRight className="h-4 w-4 transition-colors group-hover:text-accent" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}
