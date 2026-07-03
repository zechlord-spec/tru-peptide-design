import Image from 'next/image'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Products', href: '/products' },
      { label: 'TRU Systems', href: '/systems' },
      { label: 'Goals', href: '/goals' },
      { label: 'Compound Library', href: '/library' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Science', href: '#science' },
      { label: 'Quality', href: '#quality' },
      { label: 'Third-Party Testing', href: '#testing' },
      { label: 'About', href: '#about' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
      { label: 'Disclaimer', href: '#disclaimer' },
      { label: 'Compliance', href: '#compliance' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="px-4 pb-10 pt-16">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-card p-10 md:p-14">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
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
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-foreground/60">
              Health. Science. Performance. A premium longevity and peptide research platform.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-primary">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/60 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-foreground/50">
            © {new Date().getFullYear()} TRU PEPTIDE. All rights reserved.
          </p>
          <p className="text-xs text-foreground/50">
            Products intended for research purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}
