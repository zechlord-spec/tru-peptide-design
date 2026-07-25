'use client'

import { Minus, Plus } from 'lucide-react'

export type QuantitySelectorProps = {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  /** Field label. */
  label?: string
  /** Clarifying helper text shown under the control. */
  helperText?: string
  className?: string
}

/**
 * Accessible quantity stepper. Labeled in vials and clarifies that each unit is
 * a single individual vial (never a kit or pack).
 */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  label = 'Quantity (vials)',
  helperText = 'Each quantity unit represents one individual vial.',
  className = '',
}: QuantitySelectorProps) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <span
          id="quantity-selector-label"
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          {label}
        </span>
        <div
          className="flex items-center rounded-full border border-border"
          role="group"
          aria-labelledby="quantity-selector-label"
        >
          <button
            type="button"
            onClick={dec}
            disabled={value <= min}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            className="w-9 text-center text-sm font-semibold text-foreground"
            aria-live="polite"
          >
            {value}
          </span>
          <button
            type="button"
            onClick={inc}
            disabled={value >= max}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      {helperText && (
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}
