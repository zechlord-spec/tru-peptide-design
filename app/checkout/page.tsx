import Image from 'next/image'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Checkout } from '@/components/shop/checkout'

export const metadata = {
  title: 'Checkout — TRU PEPTIDE',
  description: 'Secure checkout for laboratory research compounds.',
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="TRU PEPTIDE home">
            <Image
              src="/tru-peptide-logo.png"
              alt="TRU PEPTIDE"
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
            />
            <span className="font-heading text-base font-bold tracking-tight text-primary">
              TRU PEPTIDE
            </span>
          </Link>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Secure Checkout
          </span>
        </div>
      </header>
      <Checkout />
    </main>
  )
}
