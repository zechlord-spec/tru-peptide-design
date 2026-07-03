'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'

const NAV = [
  { label: 'Products', href: '#products' },
  { label: 'TRU Systems', href: '#systems' },
  { label: 'Goals', href: '/goals' },
  { label: 'Compound Library', href: '#library' },
  { label: 'Quality', href: '#quality' },
  { label: 'Science', href: '#science' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div
        className={`w-full max-w-7xl rounded-3xl px-5 py-3 transition-all duration-500 ${
          scrolled
            ? 'bg-card/85 shadow-[0_8px_40px_-12px_rgba(8,27,53,0.25)] backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
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

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-card/60 text-primary transition-colors hover:bg-card"
            >
              <ShoppingCart className="h-4.5 w-4.5" strokeWidth={1.75} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </button>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-card/60 text-primary transition-colors hover:bg-card xl:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav
            className="mt-3 grid grid-cols-2 gap-1 border-t border-primary/10 pt-3 xl:hidden"
            aria-label="Mobile"
          >
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
