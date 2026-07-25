import { FlaskConical } from 'lucide-react'

export type BlendComponent = {
  /** Compound name, e.g. "BPC-157". */
  name: string
  /** Strength for this compound, e.g. "5mg". */
  strength: string
}

export type BlendContentsProps = {
  components: BlendComponent[]
  className?: string
}

/**
 * Blend contents block for co-formulated single vials. Deliberately avoids
 * "kit", "combination", "bundle", "multi-vial", and "pack" language — a blend
 * is always described as a single co-formulated vial.
 */
export function BlendContents({ components, className = '' }: BlendContentsProps) {
  if (components.length === 0) return null

  const parts = components.map((c) => `${c.name} ${c.strength}`)
  const list =
    parts.length === 1
      ? parts[0]
      : parts.length === 2
        ? `${parts[0]} and ${parts[1]}`
        : `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`

  return (
    <div
      className={`rounded-xl border border-border bg-card px-4 py-3.5 ${className}`}
      aria-label="Blend contents"
    >
      <div className="flex items-center gap-2">
        <FlaskConical className="h-4 w-4 flex-none text-accent" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Blend Contents
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        Single vial co-formulated with {list}.
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {components.map((c) => (
          <li
            key={`${c.name}-${c.strength}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
          >
            <span className="font-semibold text-foreground">{c.name}</span>
            <span className="text-muted-foreground">{c.strength}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
