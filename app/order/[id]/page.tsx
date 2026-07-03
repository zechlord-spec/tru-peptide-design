import Image from 'next/image'
import Link from 'next/link'
import { OrderConfirmation } from '@/components/shop/order-confirmation'

export const metadata = {
  title: 'Order Confirmed — TRU PEPTIDE',
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
        </div>
      </header>
      <OrderConfirmation orderId={id} />
    </main>
  )
}
