import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LibraryBrowser } from '@/components/library/library-browser'
import { getDataSource } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Compound Library — The Science of Peptides | TRU PEPTIDE',
  description:
    'The TRU PEPTIDE Compound Library is an educational hub covering the discovery, mechanism, and current research behind each peptide — for research reference use only.',
}

export default async function LibraryHubPage() {
  const data = getDataSource()
  const products = await data.products.list()

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="px-4 pt-36 pb-14">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            The Compound Library
          </span>
          <h1 className="mt-5 text-balance font-heading text-4xl font-bold text-primary md:text-6xl">
            The science behind every compound
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Your educational hub. Explore the discovery history, mechanism of action, and current
            research behind each peptide — presented objectively as reference material for the
            research community.
          </p>
        </div>
      </section>

      {/* Browser */}
      <section className="px-4 pb-28">
        <div className="mx-auto max-w-7xl">
          <LibraryBrowser products={products} />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
