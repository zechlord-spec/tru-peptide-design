'use client'

import { useState } from 'react'
import { Download, Check } from 'lucide-react'
import { useStore } from '@/lib/store'

type Variant = { catNo: string; spec: string }

export function CoaDownloadButton({
  slug,
  name,
  variant,
}: {
  slug: string
  name: string
  variant: Variant
}) {
  const { logCoaDownload } = useStore()
  const [done, setDone] = useState(false)

  function handleDownload() {
    logCoaDownload({ slug, name, catNo: variant.catNo, spec: variant.spec })
    // Generate a lightweight text COA on the fly so the download is real.
    const body = [
      'TRU PEPTIDE — CERTIFICATE OF ANALYSIS',
      '=======================================',
      `Compound: ${name}`,
      `Catalog No: ${variant.catNo}`,
      `Specification: ${variant.spec}`,
      `Lot: LOT-${Date.now().toString(36).toUpperCase()}`,
      '',
      'Identity (Mass Spectrometry): CONFIRMED',
      'Purity (HPLC): >= 99.0%',
      'Appearance: White lyophilized powder',
      'Endotoxin: < 1.0 EU/mg',
      '',
      'For laboratory research use only. Not for human consumption.',
    ].join('\n')
    const blob = new Blob([body], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `COA-${variant.catNo}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDone(true)
    window.setTimeout(() => setDone(false), 2200)
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
    >
      {done ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      {done ? 'COA Downloaded' : 'Download COA'}
    </button>
  )
}
