'use client'

import { Heart } from 'lucide-react'
import { useStore } from '@/lib/store'

export function FavoriteButton({
  slug,
  className = '',
  size = 'md',
}: {
  slug: string
  className?: string
  size?: 'sm' | 'md'
}) {
  const { isFavorite, toggleFavorite, hydrated } = useStore()
  const active = hydrated && isFavorite(slug)
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(slug)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      className={`flex ${dim} items-center justify-center rounded-full border backdrop-blur-sm transition-all ${
        active
          ? 'border-accent/50 bg-accent/15 text-accent'
          : 'border-border bg-card/80 text-muted-foreground hover:text-foreground'
      } ${className}`}
    >
      <Heart className={icon} fill={active ? 'currentColor' : 'none'} strokeWidth={2} />
    </button>
  )
}
