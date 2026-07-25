'use client'

import { perVial, hasPrice } from './format'

export type StrengthOption = {
  /** Stable id / catalog number used as the value. */
  id: string
  /** Primary label, e.g. "5 mg". */
  label: string
  /** Optional secondary line, e.g. a catalog number. */
  sublabel?: string
  /** Optional per-vial price shown on the option. */
  pricePerVial?: number
}

export type StrengthSelectorProps = {
  options: StrengthOption[]
  value: string
  onChange: (id: string) => void
  /** Group label. */
  label?: string
  className?: string
}

/** Accessible strength / vial-size selector rendered as a radio group. */
export function StrengthSelector({
  options,
  value,
  onChange,
  label = 'Strength',
  className = '',
}: StrengthSelectorProps) {
  return (
    <div className={className}>
      <span
        id="strength-selector-label"
        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
      >
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby="strength-selector-label"
        className="mt-2.5 grid gap-2 sm:grid-cols-2"
      >
        {options.map((opt) => {
          const active = opt.id === value
          const priced = hasPrice(opt.pricePerVial)
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.id)}
              className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all duration-300 ${
                active
                  ? 'border-primary bg-primary/5 text-primary shadow-[0_1px_2px_rgba(8,27,53,0.06)]'
                  : 'border-border bg-background text-foreground hover:border-primary/40'
              }`}
            >
              <span className="flex flex-col">
                <span className="font-medium">{opt.label}</span>
                {opt.sublabel && (
                  <span className="font-mono text-[10px] text-muted-foreground">{opt.sublabel}</span>
                )}
              </span>
              <span className="font-heading text-sm font-semibold">
                {priced ? perVial(opt.pricePerVial).replace(' / vial', '') : '—'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
