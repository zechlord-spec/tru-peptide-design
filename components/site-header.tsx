'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const NAV = [
  { label: 'Science', href: '#science' },
  { label: 'Protocols', href: '#protocols' },
  { label: 'Approach', href: '#approach' },
  { label: 'Research', href: '#research' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? 'bg-card/80 shadow-[0_8px_40px_-12px_rgba(8,27,53,0.25)] backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label="TRU PEPTIDE home">
          <Image
            src="/tru-peptide-logo.png"
            alt="TRU PEPTIDE"
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
          />
          <span className="font-heading text-lg font-bold tracking-tight text-primary">
            TRU PEPTIDE
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#protocols"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
        >
          Get Started
        </a>
      </div>
    </header>
  )
}
