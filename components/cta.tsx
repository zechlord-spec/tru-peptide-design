import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section id="research" className="px-4 py-16 md:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-center text-primary-foreground shadow-[0_50px_100px_-40px_rgba(8,27,53,0.8)] md:px-16 md:py-24">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-balance font-heading text-4xl font-bold leading-tight md:text-5xl">
            Begin your longevity protocol.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-primary-foreground/70">
            Join a platform built for people who take their health as seriously as the science
            behind it.
          </p>

          <form className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="cta-email" className="sr-only">
              Email address
            </label>
            <input
              id="cta-email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-3.5 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              Request Access
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
          <p className="mt-4 text-xs text-primary-foreground/50">
            For research purposes. No spam — unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
