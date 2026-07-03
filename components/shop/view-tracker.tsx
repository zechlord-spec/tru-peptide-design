'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export function ViewTracker({ slug }: { slug: string }) {
  const { trackView, hydrated } = useStore()
  useEffect(() => {
    if (hydrated) trackView(slug)
  }, [slug, hydrated, trackView])
  return null
}
