'use client'

import { useState } from 'react'
import type { Goal } from '@/lib/data/types'
import { iconFor } from '@/lib/icons'
import { Layers, FlaskConical, BookOpen, ArrowUpRight, ArrowLeft, Check } from 'lucide-react'

export function GoalDiscovery({ goals }: { goals: Goal[] }) {
  const [selected, setSelected] = useState<Goal | null>(null)

  return (
    <section className="px-4 pb-28">
      <div className="mx-auto max-w-7xl">
        {selected ? (
          <GoalDetail goal={selected} onBack={() => setSelected(null)} />
        ) : (
          <GoalGrid goals={goals} onSelect={setSelected} />
        )}
      </div>
    </section>
  )
}

function GoalGrid({ goals, onSelect }: { goals: Goal[]; onSelect: (g: Goal) => void }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-8 bg-accent/40" />
        Step One
        <span className="h-px w-8 bg-accent/40" />
      </div>
      <h2 className="mx-auto max-w-2xl text-balance text-center font-heading text-3xl font-bold text-primary md:text-4xl">
        What are you trying to accomplish?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-pretty text-center text-base leading-relaxed text-foreground/65">
        Select a goal to reveal the science, curated systems, and compounds researched to support it.
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const GoalIcon = iconFor(goal.iconKey)
          return (
          <button
            key={goal.slug}
            type="button"
            onClick={() => onSelect(goal)}
            className="group flex flex-col items-start rounded-3xl border border-border/60 bg-card p-7 text-left shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_30px_60px_-28px_rgba(8,27,53,0.3)]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <GoalIcon className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <h3 className="mt-6 font-heading text-xl font-bold text-primary">{goal.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{goal.tagline}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              Explore goal
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </button>
          )
        })}
      </div>
    </div>
  )
}

function GoalDetail({ goal, onBack }: { goal: Goal; onBack: () => void }) {
  const GoalIcon = iconFor(goal.iconKey)
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        All goals
      </button>

      {/* Overview */}
      <div className="mt-8 grid gap-8 rounded-[2rem] border border-border/60 bg-card p-8 shadow-[0_1px_2px_rgba(8,27,53,0.04)] md:grid-cols-[auto_1fr] md:p-12">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
          <GoalIcon className="h-9 w-9" strokeWidth={1.5} />
        </span>
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {goal.tagline}
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-primary md:text-4xl">
            {goal.name}
          </h2>
          <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-foreground/70">
            {goal.summary}
          </p>
        </div>
      </div>

      {/* Suggested Systems */}
      <div className="mt-14">
        <SectionHeading icon={Layers} label="Suggested TRU Systems" />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {goal.systems.map((sys) => (
            <article
              key={sys.name}
              className="group flex items-center justify-between gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(8,27,53,0.28)]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                  {sys.compounds}
                </p>
                <h4 className="mt-1.5 font-heading text-lg font-bold text-primary">{sys.name}</h4>
                <p className="mt-1 text-sm text-foreground/60">{sys.focus}</p>
              </div>
              <div className="text-right">
                <span className="font-heading text-lg font-bold text-primary">{sys.price}</span>
                <span className="mt-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Suggested Products */}
      <div className="mt-14">
        <SectionHeading icon={FlaskConical} label="Suggested Products" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {goal.products.map((product) => (
            <article
              key={product.name}
              className="group rounded-3xl border border-border/60 bg-card p-6 shadow-[0_1px_2px_rgba(8,27,53,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(8,27,53,0.28)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                {product.type}
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <h4 className="font-heading text-lg font-bold text-primary">{product.name}</h4>
                <span className="font-heading text-lg font-bold text-primary">{product.price}</span>
              </div>
              <button
                type="button"
                className="btn-premium mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                View Product
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Scientific Articles */}
      <div className="mt-14">
        <SectionHeading icon={BookOpen} label="Scientific Articles" />
        <div className="mt-6 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(8,27,53,0.04)]">
          {goal.articles.map((article, i) => (
            <a
              key={article.title}
              href="#"
              className={`group flex items-center justify-between gap-4 px-7 py-6 transition-colors hover:bg-muted/50 ${
                i !== 0 ? 'border-t border-border/60' : ''
              }`}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                  {article.category} · {article.readTime}
                </span>
                <h4 className="mt-1.5 font-heading text-lg font-semibold text-primary">
                  {article.title}
                </h4>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Reassurance */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-foreground/60">
        {['Third-party tested', 'Research-grade purity', 'Full documentation'].map((item) => (
          <span key={item} className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-accent" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: typeof Layers
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h3 className="font-heading text-2xl font-bold text-primary">{label}</h3>
    </div>
  )
}
