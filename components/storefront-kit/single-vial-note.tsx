import { Package } from 'lucide-react'

export type SingleVialNoteProps = {
  /** Optional override for the primary clarification line. */
  text?: string
  className?: string
}

/**
 * Single-vial clarification block. Reinforces that pricing and quantities are
 * expressed per individual vial — never kits, packs, or bundles.
 */
export function SingleVialNote({
  text = 'Each quantity unit represents one individual vial.',
  className = '',
}: SingleVialNoteProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 ${className}`}
    >
      <Package className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-foreground">Sold as one individual vial</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
