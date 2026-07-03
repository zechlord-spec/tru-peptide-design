import Image from 'next/image'
import { ShieldCheck, FlaskConical, FileCheck2, Snowflake } from 'lucide-react'

const PROMISES = [
  {
    icon: ShieldCheck,
    title: 'Uncompromising Purity',
    desc: 'Every compound is synthesized to research-grade standards and verified above 99% purity.',
  },
  {
    icon: FlaskConical,
    title: 'Rigorous Synthesis',
    desc: 'Manufactured in controlled facilities with documented, repeatable processes.',
  },
  {
    icon: FileCheck2,
    title: 'Full Documentation',
    desc: 'Certificates of analysis and batch records available for complete transparency.',
  },
  {
    icon: Snowflake,
    title: 'Cold-Chain Handling',
    desc: 'Temperature-controlled storage and shipping to preserve compound integrity.',
  },
]

export function Quality() {
  return (
    <section id="quality" className="px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Quality Promise
        </span>
        <h2 className="mt-4 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
          Standards you can verify, not just trust
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-4">
        {PROMISES.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 font-heading text-lg font-bold text-primary">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/65">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Third Party Testing */}
      <div className="mx-auto mt-24 max-w-7xl">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-border/60 bg-card lg:grid-cols-2">
          <div className="relative aspect-4/3 lg:aspect-auto lg:h-full lg:min-h-[26rem]">
            <Image
              src="/lab-testing.png"
              alt="Third-party laboratory testing"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 md:p-12">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Third-Party Testing
            </span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
              Independently verified, every single batch
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-foreground/70">
              We partner with accredited independent laboratories to test identity, purity, and
              concentration. No batch reaches you without a certificate of analysis you can review.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                'Mass spectrometry identity confirmation',
                'HPLC purity analysis on every batch',
                'Publicly accessible certificates of analysis',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
            <a
              href="#products"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              View Test Results
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
