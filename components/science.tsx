import { FlaskConical, ShieldCheck, Activity, Microscope } from 'lucide-react'

const PILLARS = [
  {
    icon: Microscope,
    title: 'Research First',
    body: 'Every compound begins in peer-reviewed literature and ends in rigorous, reproducible protocols.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Purity',
    body: 'Independent third-party assays confirm identity and potency before anything ships.',
  },
  {
    icon: Activity,
    title: 'Performance Data',
    body: 'Objective biomarkers and outcomes guide every recommendation we make.',
  },
  {
    icon: FlaskConical,
    title: 'Clinical Precision',
    body: 'Dosing and sequencing engineered with the exacting standards of modern medicine.',
  },
]

export function Science() {
  return (
    <section id="science" className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            The Standard
          </span>
          <h2 className="mt-4 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
            Built like a medical technology company.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground/70">
            Not a supplement brand. TRU PEPTIDE applies the discipline of clinical science to
            longevity — transparent, measured, and relentlessly rigorous.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="group rounded-3xl bg-card p-7 shadow-[0_20px_50px_-30px_rgba(8,27,53,0.4)] transition-transform duration-500 hover:-translate-y-1.5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-colors duration-500 group-hover:bg-accent group-hover:text-accent-foreground">
                <pillar.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold text-primary">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
