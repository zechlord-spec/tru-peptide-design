'use client'

import type { ReactNode, ButtonHTMLAttributes } from 'react'

/* --------------------------------- Card ---------------------------------- */

export function AdminCard({
  title,
  subtitle,
  icon,
  actions,
  children,
  className = '',
}: {
  title?: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-start gap-2.5">
            {icon ? <span className="mt-0.5 text-accent">{icon}</span> : null}
            <div>
              {title ? (
                <h3 className="font-heading text-sm font-semibold leading-tight text-foreground">
                  {title}
                </h3>
              ) : null}
              {subtitle ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
          </div>
          {actions ? <div className="flex flex-shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  )
}

/* ------------------------------ Section label ---------------------------- */

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </span>
  )
}

/* ------------------------------- Field rows ------------------------------ */

export function FieldGrid({
  columns = 2,
  children,
  className = '',
}: {
  columns?: 1 | 2 | 3 | 4
  children: ReactNode
  className?: string
}) {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }[columns]
  return <dl className={`grid gap-x-4 gap-y-3 ${cols} ${className}`}>{children}</dl>
}

export function Field({
  label,
  value,
  emphasis = false,
  tone,
}: {
  label: ReactNode
  value: ReactNode
  emphasis?: boolean
  tone?: 'positive' | 'caution' | 'negative'
}) {
  const toneClass =
    tone === 'positive'
      ? 'text-primary'
      : tone === 'negative'
        ? 'text-destructive'
        : tone === 'caution'
          ? 'text-accent-foreground'
          : 'text-foreground'
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd
        className={`mt-0.5 truncate ${emphasis ? 'font-heading text-base font-semibold' : 'text-sm'} ${toneClass}`}
        title={typeof value === 'string' ? value : undefined}
      >
        {value}
      </dd>
    </div>
  )
}

/* ------------------------------ Status badge ----------------------------- */

export type StatusTone = 'neutral' | 'positive' | 'caution' | 'negative' | 'info'

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: 'border-border bg-secondary text-muted-foreground',
  positive: 'border-primary/30 bg-primary/10 text-primary',
  caution: 'border-accent/50 bg-accent/15 text-accent-foreground',
  negative: 'border-destructive/30 bg-destructive/10 text-destructive',
  info: 'border-border bg-muted/40 text-foreground',
}

export function StatusBadge({
  tone = 'neutral',
  icon,
  children,
}: {
  tone?: StatusTone
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${TONE_CLASSES[tone]}`}
    >
      {icon}
      {children}
    </span>
  )
}

/* -------------------------------- Button --------------------------------- */

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent',
  outline: 'border border-border bg-transparent text-foreground hover:bg-secondary',
  danger:
    'border border-destructive/30 bg-transparent text-destructive hover:bg-destructive/10',
  ghost: 'border border-transparent bg-transparent text-muted-foreground hover:text-foreground',
}

export function ActionButton({
  variant = 'outline',
  size = 'sm',
  icon,
  children,
  className = '',
  ...rest
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeClass = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${sizeClass} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

/* ------------------------------ Data table ------------------------------- */

export function DataTable({
  caption,
  head,
  children,
  className = '',
}: {
  caption?: ReactNode
  head: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-border">{head}</tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  )
}

export function Th({
  children,
  numeric = false,
  className = '',
}: {
  children: ReactNode
  numeric?: boolean
  className?: string
}) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground ${
        numeric ? 'text-right' : 'text-left'
      } ${className}`}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  numeric = false,
  className = '',
}: {
  children: ReactNode
  numeric?: boolean
  className?: string
}) {
  return (
    <td
      className={`px-3 py-2.5 align-middle text-sm text-foreground ${
        numeric ? 'text-right tabular-nums' : ''
      } ${className}`}
    >
      {children}
    </td>
  )
}

/* -------------------------------- Toggle --------------------------------- */

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean
  onChange?: (next: boolean) => void
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}) {
  return (
    <label className={`flex items-start gap-3 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-0.5 h-5 w-9 flex-shrink-0 rounded-full border transition-colors ${
          checked ? 'border-primary bg-primary' : 'border-border bg-secondary'
        } disabled:cursor-not-allowed`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-card shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  )
}

/* ------------------------------ Notes field ------------------------------ */

export function NotesField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  id: string
  label: ReactNode
  value?: string
  onChange?: (next: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </div>
  )
}
