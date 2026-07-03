'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Check, Package } from 'lucide-react'
import { useStore } from '@/lib/store'
import { OrderDetail } from '@/components/shop/order-detail'

export function OrderConfirmation({ orderId }: { orderId: string }) {
  const { orders, hydrated, account } = useStore()
  const order = orders.find((o) => o.id === orderId)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (order) setShowConfetti(true)
  }, [order])

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your order…</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <Package className="h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t locate this order. It may have been placed on another device.
        </p>
        <Link
          href="/account"
          className="btn-premium mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          View your account
        </Link>
      </div>
    )
  }

  const estimated = new Date(order.createdAt + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <header className="flex flex-col items-center text-center">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-500 ${
            showConfetti ? 'scale-100' : 'scale-0'
          }`}
        >
          <Check className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Order Confirmed
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance">
          Thank you{account?.name ? `, ${account.name.split(' ')[0]}` : ''}.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
          Your order{' '}
          <span className="font-mono font-semibold text-foreground">{order.id}</span> has been
          received. A confirmation was sent to{' '}
          <span className="font-medium text-foreground">{order.address.email}</span>.
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-foreground">
          <Package className="h-4 w-4" />
          Estimated delivery by <span className="font-semibold">{estimated}</span>
        </div>
      </header>

      <div className="mt-10">
        <OrderDetail order={order} showTracker />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/account"
          className="btn-premium w-full rounded-full bg-primary px-8 py-3.5 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          View Order History
        </Link>
        <Link
          href="/products"
          className="w-full rounded-full border border-border px-8 py-3.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
