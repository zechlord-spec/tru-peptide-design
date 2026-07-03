import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      'The education-first approach sold me. I finally understood what I was researching before I ever added anything to my cart.',
    name: 'Dr. Alan Reyes',
    role: 'Research Physician',
  },
  {
    quote:
      'Certificates of analysis for every batch, cold-chain shipping, and clear documentation. This is how it should be done.',
    name: 'Marcus Whitfield',
    role: 'Performance Coach',
  },
  {
    quote:
      'The TRU Systems made it effortless to align compounds with my recovery goals. Genuinely premium experience.',
    name: 'Sofia Lindgren',
    role: 'Longevity Enthusiast',
  },
]

export function Testimonials() {
  return (
    <section id="about" className="bg-primary px-4 py-24 text-primary-foreground">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Testimonials
        </span>
        <h2 className="mt-4 text-balance font-heading text-4xl font-bold md:text-5xl">
          Trusted by researchers and practitioners
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-3xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-7 backdrop-blur"
          >
            <div className="flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-5 flex-1 text-pretty leading-relaxed text-primary-foreground/85">
              {`"${t.quote}"`}
            </blockquote>
            <figcaption className="mt-6 border-t border-primary-foreground/10 pt-5">
              <p className="font-heading font-bold">{t.name}</p>
              <p className="text-sm text-primary-foreground/60">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
