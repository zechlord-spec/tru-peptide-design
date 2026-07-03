import { Target, Layers, Microscope, BookOpen, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { Reveal } from '@/components/animations/reveal'

const STEPS = [
  {
    icon: Target,
    title: 'Choose a TRU Goal',
    desc: 'Start with what you want to achieve — recovery, longevity, metabolic health, or performance.',
  },
  {
    icon: Layers,
    title: 'Explore a TRU System',
    desc: 'See curated compound systems engineered around your goal.',
  },
  {
    icon: Microscope,
    title: 'Learn the Science',
    desc: 'Understand the mechanisms, research, and evidence behind every compound.',
  },
  {
    icon: BookOpen,
    title: 'Browse Products',
    desc: 'Dive into our compound library with full transparency and documentation.',
  },
  {
    icon: ShoppingBag,
    title: 'Purchase with Confidence',
    desc: 'Buy individual products or complete systems, all third-party tested.',
  },
]

export function Journey() {
  return (
    <section id="goals" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Discover Your Goal
          </span>
          <h2 className="mt-4 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
            A guided path from question to protocol
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground/70">
            We educate first and sell second. Follow the journey designed to help you make informed,
            confident decisions.
          </p>
        </div>

        <ol className="mt-16 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 90}
              className="group relative flex flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(8,27,53,0.28)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="font-heading text-4xl font-bold text-muted-foreground/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">{step.desc}</p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-foreground/60">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          Individual products or complete systems — the choice is yours.
        </div>
      </div>
    </section>
  )
}
