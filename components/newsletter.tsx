import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function Newsletter() {
  return (
    <section id="contact" className="px-4 py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-16 md:px-16">
        <div className="pointer-events-none absolute -right-16 -top-16 hidden w-80 opacity-70 md:block">
          <div className="animate-float-medium">
            <Image src="/molecule-detail.png" alt="" width={400} height={400} className="h-auto w-full" />
          </div>
        </div>

        <div className="relative max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            The TRU Brief
          </span>
          <h2 className="mt-4 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
            Science, delivered to your inbox
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground/70">
            Join our newsletter for peptide research breakdowns, new compound launches, and
            evidence-based protocols. No hype, just science.
          </p>

          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-base text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <button
              type="submit"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              Subscribe
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
          <p className="mt-3 text-xs text-foreground/50">
            By subscribing you agree to our privacy policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
