import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductCatalog } from '@/components/products/product-catalog'
import { FlaskConical } from 'lucide-react'
import { getDataSource } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Product Catalog | TRU PEPTIDE',
  description:
    'Explore the full TRU PEPTIDE research catalog — premium research peptides organized by goal, TRU System, and compound type. For laboratory and research use only.',
}

export default async function ProductsPage() {
  const data = getDataSource()
  const products = await data.products.list()
  const compoundCount = products.length
  const variantCount = products.reduce((sum, p) => sum + p.variants.length, 0)

  return (
    <main id="top" className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-accent-foreground/80 backdrop-blur">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              Research Catalog
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-primary text-balance sm:text-5xl lg:text-6xl">
              The TRU PEPTIDE Compound Library
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
              A curated catalog of research-grade peptides and compounds, organized by goal, TRU System, and
              mechanism. Every product is third-party tested with a certificate of analysis available on request.
            </p>
            <div className="mt-8 flex items-center justify-center gap-5 sm:gap-8">
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">{compoundCount}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">Compounds</p>
              </div>
              <div className="h-10 w-px bg-border" aria-hidden="true" />
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">{variantCount}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">Specifications</p>
              </div>
              <div className="h-10 w-px bg-border" aria-hidden="true" />
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">100%</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">COA Verified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="pb-24">
        <ProductCatalog products={products} />
      </section>

      {/* Compliance note */}
      <section id="coa" className="border-t border-border bg-card/50 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-xl font-semibold text-primary">Certificates of Analysis</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
            Each batch is independently tested for identity, purity, and mass by accredited third-party laboratories.
            Certificates of analysis are available for every catalog number. All products are strictly for laboratory
            and research use only — not for human consumption, therapeutic, or veterinary use.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
