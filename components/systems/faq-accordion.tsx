'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { SystemFaq } from '@/lib/data/types'

export function FaqAccordion({ faqs }: { faqs: SystemFaq[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-secondary/60"
              aria-expanded={isOpen}
            >
              <span className="font-heading text-lg font-semibold text-primary">
                {faq.question}
              </span>
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-secondary text-primary">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
