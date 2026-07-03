import Image from 'next/image'
import { Check } from 'lucide-react'

const POINTS = [
  'Sourced and manufactured to pharmaceutical-grade specification',
  'Batch-level certificates of analysis available on every compound',
  'Protocols reviewed against current peer-reviewed research',
  'Guidance grounded in objective biomarkers, not marketing claims',
]

export function Approach() {
  return (
    <section id="approach" className="px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-[2rem] bg-card p-8 shadow-[0_40px_80px_-40px_rgba(8,27,53,0.5)]">
            <div className="animate-float-medium">
              <Image
                src="/molecule-detail.png"
                alt="A detailed rendering of a peptide molecular chain"
                width={700}
                height={700}
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-2 rounded-2xl bg-primary px-6 py-4 text-primary-foreground shadow-xl sm:right-6">
            <p className="font-heading text-2xl font-bold">100%</p>
            <p className="text-xs text-primary-foreground/70">Tested & traceable</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Our Approach
          </span>
          <h2 className="mt-4 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
            Trust is engineered, not claimed.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground/70">
            We hold every compound and protocol to a standard we would stake our own health on.
            Transparency and evidence are the foundation of everything we build.
          </p>

          <ul className="mt-9 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="leading-relaxed text-foreground/80">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
