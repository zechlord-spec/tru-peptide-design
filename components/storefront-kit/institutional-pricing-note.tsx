import { BadgeCheck } from 'lucide-react'

export type InstitutionalPricingNoteProps = {
  /** Optional override for the message text. */
  text?: string
  className?: string
}

/**
 * Subtle indicator shown for approved institutional accounts. Intentionally
 * free of tier names, points, or consumer-rewards language.
 */
export function InstitutionalPricingNote({
  text = 'Approved institutional account pricing applied.',
  className = '',
}: InstitutionalPricingNoteProps) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-lg bg-primary/[0.04] px-3 py-2 text-xs font-medium text-primary ${className}`}
    >
      <BadgeCheck className="h-4 w-4 flex-none text-accent" aria-hidden="true" />
      {text}
    </p>
  )
}
