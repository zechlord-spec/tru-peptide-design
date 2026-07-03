import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Journey } from '@/components/journey'
import { Systems } from '@/components/systems'
import { Science } from '@/components/science'
import { Products } from '@/components/products'
import { Quality } from '@/components/quality'
import { Testimonials } from '@/components/testimonials'
import { Newsletter } from '@/components/newsletter'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/animations/reveal'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Reveal>
          <Journey />
        </Reveal>
        <Reveal>
          <Systems />
        </Reveal>
        <Reveal>
          <Science />
        </Reveal>
        <Reveal>
          <Products />
        </Reveal>
        <Reveal>
          <Quality />
        </Reveal>
        <Reveal>
          <Testimonials />
        </Reveal>
        <Reveal variant="scale">
          <Newsletter />
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  )
}
