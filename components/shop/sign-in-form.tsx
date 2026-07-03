'use client'

import { useState } from 'react'
import { User } from 'lucide-react'

export function SignInForm({ onSignIn }: { onSignIn: (name: string, email: string) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const valid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email)

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <User className="h-6 w-6 text-foreground" />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-bold text-foreground">Your Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          Sign in to view your orders, saved products, COA downloads, favorites, and more.
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
