'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Package, User, LogOut, ChevronRight, ShoppingBag } from 'lucide-react'
import { useStore, money } from '@/lib/store'

export function Account() {
  const { account, signIn, signOut, orders, hydrated } = useStore()

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!account) return <SignInForm onSignIn={signIn} />

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Profile header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="font-heading text-lg font-bold">
              {account.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">{account.name}</h1>
            <p className="text-sm text-muted-foreground">{account.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Orders" value={String(orders.length)} />
        <Stat
          label="Total spent"
          value={money(orders.reduce((n, o) => n + o.total, 0))}
        />
        <Stat
          label="Items ordered"
          value={String(
            orders.reduce((n, o) => n + o.items.reduce((m, i) => m + i.qty, 0), 0),
          )}
        />
      </div>

      {/* Order history */}
      <section className="mt-12">
        <h2 className="font-heading text-lg font-semibold text-foreground">Order History</h2>

        {orders.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-heading text-base font-semibold text-foreground">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                When you place an order, it will appear here.
              </p>
            </div>
            <Link
              href="/products"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/order/${order.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Package className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {order.id}
                      </span>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      · {order.items.reduce((n, i) => n + i.qty, 0)} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-heading text-sm font-bold text-primary">
                      {money(order.total)}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-heading text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function SignInForm({ onSignIn }: { onSignIn: (name: string, email: string) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const valid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email)

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <User className="h-6 w-6 text-foreground" />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-bold text-foreground">Your Account</h1>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          Sign in to view your order history and manage your research orders.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) onSignIn(name.trim(), email.trim())
        }}
        className="mt-8 space-y-4 rounded-3xl border border-border bg-card p-6"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Researcher"
            autoComplete="name"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@lab.com"
            autoComplete="email"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>
        <button
          type="submit"
          disabled={!valid}
          className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          Demo account — no password required. Your data stays on this device.
        </p>
      </form>
    </div>
  )
}
