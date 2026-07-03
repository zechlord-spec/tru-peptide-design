'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Motion style for the reveal. */
  variant?: 'up' | 'fade' | 'scale' | 'left' | 'right'
  /** Delay in ms before the reveal animates once in view. */
  delay?: number
  /** Render as a different element (e.g. 'li', 'section'). */
  as?: ElementType
  className?: string
  /** Only animate the first time it enters the viewport. Defaults to true. */
  once?: boolean
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  as,
  className = '',
  once = true,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Guard for reduced motion / unsupported environments.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
