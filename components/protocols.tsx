import { ArrowUpRight } from 'lucide-react'

const PROTOCOLS = [
  {
    tag: 'Recovery',
    name: 'Regenerate',
    body: 'Tissue repair and recovery protocols designed to accelerate healing and resilience.',
    metric: 'BPC · TB-500',
  },
  {
    tag: 'Longevity',
    name: 'Extend',
    body: 'Cellular longevity support targeting metabolic efficiency and healthy aging.',
    metric: 'NAD+ · Epitalon',
  },
  {
    tag: 'Performance',
    name: 'Optimize',
    body: 'Lean mass, energy, and output protocols for peak physical performance.',
    metric: 'GH Secretagogues',
  },
]

export function Protocols() {
  return (
    <section id="protocols" className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Protocols
            </span>
            <h2 className="mt-4 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
              Precision protocols for every goal.
            </h2>
          </div>
          <p className="max-w-sm text-pretty leading-relaxed text-foreground/65">
            Each protocol is structured around measurable outcomes — chosen and sequenced with
            scientific intent.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PROTOCOLS.map((protocol) => (
            <article
              key={protocol.name}
              className="group relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-[0_30px_60px_-35px_rgba(8,27,53,0.7)] transition-transform duration-500 hover:-translate-y-1.5"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />
              <div className="relative">
                <span className="inline-flex rounded-full border border-primary-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/70">
                  {protocol.tag}
                </span>
                <h3 className="mt-6 font-heading text-3xl font-bold">{protocol.name}</h3>
                <p className="mt-4 leading-relaxed text-primary-foreground/70">{protocol.body}</p>
              </div>
              <div className="relative mt-8 flex items-center justify-between border-t border-primary-foreground/15 pt-5">
                <span className="text-sm font-medium text-accent">{protocol.metric}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors duration-500 group-hover:bg-accent group-hover:text-accent-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
