import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Science } from '@/components/science'
import { Protocols } from '@/components/protocols'
import { Approach } from '@/components/approach'
import { CTA } from '@/components/cta'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Science />
        <Protocols />
        <Approach />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  )
}
