import { cn } from '@/lib/utils'

/** Elegant ringed spinner with a soft pulsing halo. */
export function Spinner({
  size = 28,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-full border-2 border-accent/25" />
      <span className="animate-spin-smooth absolute inset-0 rounded-full border-2 border-transparent border-t-accent" />
    </span>
  )
}

/** Centered loading state with brand-styled label. */
export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 animate-soft-fade">
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute h-14 w-14 rounded-full bg-accent/20 [animation:pulse-ring_1.8s_ease-out_infinite]" />
        <Spinner size={40} />
      </span>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/60">{label}</p>
    </div>
  )
}

/** Shimmering placeholder block. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

/** Product/card skeleton used in route-level loading fallbacks. */
export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-4">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  )
}

/** Grid of card skeletons. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
