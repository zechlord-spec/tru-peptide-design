import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  FlaskConical,
  Microscope,
  FileCheck2,
  QrCode,
  ShieldCheck,
  Package,
  Snowflake,
  ClipboardCheck,
  ArrowUpRight,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Quality & Standards — Manufacturing, Testing & COAs | TRU PEPTIDE',
  description:
    'Explore how TRU PEPTIDE upholds research-grade quality: controlled manufacturing, HPLC purity testing, third-party certificates of analysis, batch verification, sterility, protective packaging, and cold-chain shipping.',
}

const STATS = [
  { value: '>99%', label: 'Verified purity' },
  { value: '100%', label: 'Batches tested' },
  { value: '3rd-party', label: 'Independent labs' },
  { value: 'Cold-chain', label: 'End-to-end handling' },
]

type Section = {
  id: string
  eyebrow: string
  title: string
  icon: typeof FlaskConical
  image: string
  body: string
  points: string[]
}

const SECTIONS: Section[] = [
  {
    id: 'manufacturing',
    eyebrow: 'Manufacturing Process',
    title: 'Synthesized in controlled, documented facilities',
    icon: FlaskConical,
    image: '/quality/manufacturing.png',
    body: 'Every compound is produced through solid-phase peptide synthesis in environmentally controlled facilities. Each step follows a documented, repeatable protocol so that identity and quality are consistent from one batch to the next.',
    points: [
      'Solid-phase peptide synthesis under controlled conditions',
      'Documented, repeatable standard operating procedures',
      'Environmental controls for temperature and humidity',
      'In-process checkpoints at every synthesis stage',
    ],
  },
  {
    id: 'purity-testing',
    eyebrow: 'Purity Testing',
    title: 'HPLC and mass spectrometry on every batch',
    icon: Microscope,
    image: '/quality/purity.png',
    body: 'Purity and identity are confirmed using high-performance liquid chromatography (HPLC) and mass spectrometry. No batch is released until it meets our research-grade purity threshold above 99%.',
    points: [
      'HPLC purity analysis above 99%',
      'Mass spectrometry identity confirmation',
      'Concentration and net-peptide content verification',
      'Documented acceptance criteria for release',
    ],
  },
  {
    id: 'third-party-coa',
    eyebrow: 'Third-Party COAs',
    title: 'Independently verified certificates of analysis',
    icon: FileCheck2,
    image: '/quality/coa.png',
    body: 'We partner with accredited independent laboratories to verify identity, purity, and concentration. Every batch ships with a publicly accessible certificate of analysis you can review before and after purchase.',
    points: [
      'Accredited third-party laboratory verification',
      'Publicly accessible certificate for each batch',
      'Chromatograms and spectra included',
      'No batch released without a passing COA',
    ],
  },
  {
    id: 'batch-verification',
    eyebrow: 'Batch Verification',
    title: 'Full traceability from synthesis to shipment',
    icon: QrCode,
    image: '/quality/batch.png',
    body: 'Each vial carries a unique batch identifier linked to its complete production and testing record. Scan the code to trace a compound back to its synthesis date, testing results, and certificate of analysis.',
    points: [
      'Unique batch identifier on every vial',
      'Scannable code linked to the batch record',
      'Complete synthesis-to-shipment audit trail',
      'Retained samples for every production lot',
    ],
  },
  {
    id: 'sterility',
    eyebrow: 'Sterility',
    title: 'Aseptic handling in laminar-flow environments',
    icon: ShieldCheck,
    image: '/quality/sterility.png',
    body: 'Filling and sealing take place in laminar-flow cleanroom environments to minimize contamination risk. Lyophilized compounds are sealed under controlled conditions to preserve stability and integrity.',
    points: [
      'Laminar-flow cleanroom filling',
      'Aseptic technique throughout handling',
      'Controlled lyophilization and sealing',
      'Tamper-evident vial closures',
    ],
  },
  {
    id: 'packaging',
    eyebrow: 'Packaging',
    title: 'Protective, tamper-evident, light-controlled',
    icon: Package,
    image: '/quality/packaging.png',
    body: 'Compounds are packaged in protective, light-controlled materials with tamper-evident seals. Every shipment is cushioned to protect fragile glass vials and preserve compound integrity in transit.',
    points: [
      'Light-controlled protective packaging',
      'Tamper-evident seals on every unit',
      'Cushioned inserts for fragile vials',
      'Discreet, secure outer packaging',
    ],
  },
  {
    id: 'shipping',
    eyebrow: 'Shipping',
    title: 'Temperature-controlled cold-chain delivery',
    icon: Snowflake,
    image: '/quality/shipping.png',
    body: 'Temperature-sensitive compounds ship with insulated packaging and gel ice packs to maintain the cold chain in transit. Expedited handling minimizes time in transit to preserve stability on arrival.',
    points: [
      'Insulated packaging with gel ice packs',
      'Cold-chain maintained end to end',
      'Expedited handling to reduce transit time',
      'Tracking on every shipment',
    ],
  },
  {
    id: 'research-standards',
    eyebrow: 'Research Standards',
    title: 'For laboratory and research use only',
    icon: ClipboardCheck,
    image: '/quality/standards.png',
    body: 'All products are intended strictly for laboratory research and are not for human or veterinary use. Our documentation and labeling standards are designed to support rigorous, reproducible scientific work.',
    points: [
      'Clearly labeled for research use only',
      'Reproducible documentation standards',
      'Not for human or veterinary use',
      'Consistent specifications across batches',
    ],
  },
]

export default function QualityPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-36 pb-20">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/quality/hero.png"
            alt="Modern research laboratory facility"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Quality &amp; Standards
          </span>
          <h1 className="mt-5 text-balance font-heading text-4xl font-bold text-primary-foreground md:text-6xl">
            Standards you can verify, not just trust
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
            From synthesis to your bench, every TRU PEPTIDE compound moves through a controlled,
            documented, and independently verified process. Here is exactly how.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-5 text-center backdrop-blur"
            >
              <div className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alternating sections */}
      <section className="px-4 py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-20 md:gap-28">
          {SECTIONS.map((section, index) => {
            const Icon = section.icon
            const reversed = index % 2 === 1
            return (
              <div
                key={section.id}
                id={section.id}
                className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div
                  className={`relative aspect-4/3 overflow-hidden rounded-3xl border border-border/60 shadow-[0_30px_60px_-32px_rgba(8,27,53,0.35)] ${
                    reversed ? 'lg:order-2' : ''
                  }`}
                >
                  <Image
                    src={section.image || '/placeholder.svg'}
                    alt={section.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={reversed ? 'lg:order-1' : ''}>
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    <Icon className="h-3.5 w-3.5" />
                    {section.eyebrow}
                  </span>
                  <h2 className="mt-5 text-balance font-heading text-3xl font-bold text-primary md:text-4xl">
                    {section.title}
                  </h2>
                  <p className="mt-5 text-pretty leading-relaxed text-foreground/70">
                    {section.body}
                  </p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 pb-28">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center md:px-16">
          <h2 className="text-balance font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Review the proof for yourself
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-primary-foreground/75">
            Every compound page links to its certificate of analysis and batch record. Explore the
            catalog and verify our standards firsthand.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="btn-premium inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Browse Compounds
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Explore the Science
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
