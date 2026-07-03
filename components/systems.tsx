import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const SYSTEMS = [
  {
    name: 'Recovery System',
    goal: 'Tissue repair & sleep',
    image: '/system-recovery.png',
    compounds: '3 compounds',
    price: '$289',
  },
  {
    name: 'Metabolic System',
    goal: 'Body composition & energy',
    image: '/system-metabolic.png',
    compounds: '2 compounds',
    price: '$249',
  },
  {
    name: 'Vitality System',
    goal: 'Longevity & performance',
    image: '/system-vitality.png',
    compounds: '4 compounds',
    price: '$349',
  },
]

export function Systems() {
  return (
    <section id="systems" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Featured TRU Systems
            </span>
            <h2 className="mt-4 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
              Complete protocols, engineered by goal
            </h2>
          </div>
          <a
            href="#systems"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            View all systems
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SYSTEMS.map((sys) => (
            <article
              key={sys.name}
              className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.32)]"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-secondary">
                <Image
                  src={sys.image || '/placeholder.svg'}
                  alt={sys.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                  {sys.compounds}
                </span>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                  {sys.goal}
                </p>
                <div className="mt-2 flex items-baseline justify-between">
                  <h3 className="font-heading text-xl font-bold text-primary">{sys.name}</h3>
                  <span className="font-heading text-xl font-bold text-primary">{sys.price}</span>
                </div>
                <a
                  href="#products"
                  className="mt-5 flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
                >
                  Explore System
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
