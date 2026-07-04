'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useStore } from '@/lib/store'

export function AgeGate() {
  const { hydrated, ageVerified, verifyAge } = useStore()
  const [declined, setDeclined] = useState(false)

  const show = hydrated && !ageVerified

  // Lock scroll while the gate is visible
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/70 px-4 backdrop-blur-md"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl">
        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          <Image
            src="/tru-peptide-icon.png"
            alt="TRU PEPTIDE"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />

          {declined ? (
            <>
              <h2
                id="age-gate-title"
                className="mt-6 font-heading text-2xl font-bold text-foreground text-balance"
              >
                Access Restricted
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                You must be 21 years or older to access this site. Please return when you meet the
                age requirement.
              </p>
              <button
                type="button"
                onClick={() => setDeclined(false)}
                className="mt-6 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Go back
              </button>
            </>
          ) : (
            <>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Age Verification
              </div>
              <h2
                id="age-gate-title"
                className="mt-4 font-heading text-2xl font-bold text-foreground text-balance"
              >
                Are you 21 or older?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                All products are sold strictly for laboratory and research use only. You must confirm
                you are of legal age to enter.
              </p>

              <div className="mt-7 flex w-full flex-col gap-3">
                <button
                  type="button"
                  onClick={verifyAge}
                  className="btn-premium w-full rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Yes, I am 21 or older
                </button>
                <button
                  type="button"
                  onClick={() => setDeclined(true)}
                  className="w-full rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  No, I am under 21
                </button>
              </div>

              <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
                By entering, you agree to our Terms of Service and acknowledge these products are not
                for human consumption.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
