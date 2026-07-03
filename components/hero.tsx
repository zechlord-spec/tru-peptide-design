import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-36 md:pt-44">
      {/* Floating molecular artwork */}
      <div className="pointer-events-none absolute -right-24 top-28 hidden w-[44rem] max-w-[56vw] opacity-90 lg:block">
        <div className="animate-float-slow">
          <Image
            src="/molecule-hero.png"
            alt=""
            width={900}
            height={900}
            priority
            className="h-auto w-full drop-shadow-[0_40px_80px_rgba(8,27,53,0.25)]"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-2xl animate-fade-up">
          <Image
            src="/tru-peptide-logo.png"
            alt="TRU PEPTIDE"
            width={72}
            height={72}
            priority
            className="h-16 w-16 object-contain"
          />

          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Educate first. Elevate always.
          </span>

          <h1 className="mt-6 text-balance font-heading text-5xl font-bold leading-[1.02] text-primary sm:text-6xl md:text-7xl">
            Health. Science. Performance.
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-foreground/75">
            Premium research compounds supported by scientific education, third-party testing, and a
            goal-based discovery experience.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#goals"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              Discover Your Goal
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-card/50 px-7 py-3.5 text-base font-semibold text-primary transition-colors duration-300 hover:bg-card"
            >
              Browse Products
            </a>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6">
            {[
              { value: '99.9%', label: 'Purity verified' },
              { value: '100%', label: '3rd party tested' },
              { value: '40+', label: 'Research compounds' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-heading text-3xl font-bold text-primary">{stat.value}</dt>
                <dd className="mt-1 text-sm text-foreground/60">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
