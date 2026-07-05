import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getDataSource } from '@/lib/data'
import { iconFor } from '@/lib/icons'

const FEATURED = ['tru-glow', 'tru-perform', 'tru-longevity']

export async function Systems() {
  const data = getDataSource()
  const systems = await data.systems.list()
  const featured = FEATURED.map((slug) => systems.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  )

  return (
    <section id="systems" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Featured TRU Systems
            </span>
            <h2 className="mt-4 text-balance font-heading text-4xl font-bold text-primary md:text-5xl">
              Curated collections, engineered by goal
            </h2>
          </div>
          <Link
            href="/systems"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            View all systems
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {featured.map((sys) => {
            const Icon = iconFor(sys.iconKey)
            return (
              <Link
                key={sys.slug}
                href={`/systems/${sys.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.32)]"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-secondary">
                  <Image
                    src={sys.image || '/placeholder.svg'}
                    alt={`${sys.trademark} illustration`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                    <Icon className="h-3.5 w-3.5 text-accent" />
                    {sys.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-xl font-bold text-primary">{sys.trademark}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {sys.tagline}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                    Explore system
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
