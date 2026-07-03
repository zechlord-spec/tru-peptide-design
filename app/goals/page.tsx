import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { GoalDiscovery } from '@/components/goals/goal-discovery'

export const metadata: Metadata = {
  title: 'Goal Discovery | TRU PEPTIDE',
  description:
    'Begin your TRU journey by selecting what you want to accomplish. A luxury wellness assessment matching your goals to systems, products, and science.',
}

export default function GoalsPage() {
  return (
    <main id="top" className="min-h-screen bg-background">
      <SiteHeader />

      {/* Intro */}
      <section className="px-4 pb-16 pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-[0_1px_2px_rgba(8,27,53,0.04)]">
            TRU Goal Discovery
          </span>
          <h1 className="mt-6 text-balance font-heading text-4xl font-bold leading-[1.05] text-primary md:text-6xl">
            Your assessment begins with a single question
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-foreground/70">
            Tell us what you want to achieve. We&apos;ll guide you to the science, systems, and
            compounds researched to support your goal — education first, always.
          </p>
        </div>
      </section>

      <GoalDiscovery />
      <SiteFooter />
    </main>
  )
}
