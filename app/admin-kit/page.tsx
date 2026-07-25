'use client'

import { useState } from 'react'
import {
  SupplierComparisonCard,
  ImportReviewTable,
  ProductMatchDrawer,
  SpecialOrderControls,
  InventoryLotCard,
  PerVialEconomicsCard,
  DiscountMarginSimulator,
  InstitutionalAccountPanel,
  MarketEvidencePanel,
  ComparisonApprovalControls,
  ActionButton,
  type SpecialOrderConfig,
  type DiscountEligibility,
  type ImportReviewRow,
  type MarketEvidenceRow,
} from '@/components/admin-kit'

/* ------------------------------ Sample props ----------------------------- */
/* Illustrative internal values only — no live catalog or production pricing. */

const IMPORT_ROWS: ImportReviewRow[] = [
  {
    id: '1',
    supplierProduct: 'Retatrutide 5MG (NGX)',
    normalizedProduct: 'Retatrutide',
    strength: '5 mg',
    costPerKit: 640,
    costPerVial: 64,
    matchStatus: 'exact',
    existingProduct: 'Retatrutide 5mg',
    specialOrder: false,
    importStatus: 'pending',
    reviewNotes: 'Direct SKU alignment.',
  },
  {
    id: '2',
    supplierProduct: 'Reta 10 mg vial',
    normalizedProduct: 'Retatrutide',
    strength: '10 mg',
    costPerKit: 1120,
    costPerVial: 112,
    matchStatus: 'new-strength',
    existingProduct: 'Retatrutide (5mg only)',
    specialOrder: true,
    importStatus: 'pending',
    reviewNotes: 'New strength — special order.',
  },
  {
    id: '3',
    supplierProduct: 'Tirzep-Cagri Blend',
    normalizedProduct: 'Cagrilintide / Tirzepatide',
    strength: '5mg / 5mg',
    costPerKit: 980,
    costPerVial: 98,
    matchStatus: 'naming-conflict',
    specialOrder: true,
    importStatus: 'pending',
    reviewNotes: 'Naming collides with existing blend.',
  },
  {
    id: '4',
    supplierProduct: 'Survodutide 3 mg',
    normalizedProduct: 'Survodutide',
    strength: '3 mg',
    costPerKit: 720,
    costPerVial: 72,
    matchStatus: 'new-product',
    specialOrder: false,
    importStatus: 'approved',
  },
]

const EVIDENCE_ROWS: MarketEvidenceRow[] = [
  {
    id: 'e1',
    competitor: 'PeptideSource Co.',
    sourceUrl: 'https://example.com/listing-1',
    observedProduct: 'Retatrutide',
    strength: '5 mg',
    unitCount: 1,
    advertisedPrice: 219,
    shippingIncluded: true,
    subscriptionRequired: false,
    couponRequired: false,
    inStock: true,
    observationDate: 'Jul 18, 2026',
    evidenceReference: 'EV-2211',
    reviewStatus: 'verified',
  },
  {
    id: 'e2',
    competitor: 'ResearchChem Labs',
    sourceUrl: 'https://example.com/listing-2',
    observedProduct: 'Retatrutide',
    strength: '5 mg',
    unitCount: 1,
    advertisedPrice: 189,
    shippingIncluded: false,
    subscriptionRequired: true,
    couponRequired: true,
    inStock: true,
    observationDate: 'Jul 20, 2026',
    evidenceReference: 'EV-2214',
    reviewStatus: 'pending',
  },
  {
    id: 'e3',
    competitor: 'BioReagent Direct',
    sourceUrl: 'https://example.com/listing-3',
    observedProduct: 'Retatrutide',
    strength: '5 mg',
    unitCount: 1,
    advertisedPrice: 205,
    shippingIncluded: true,
    subscriptionRequired: false,
    couponRequired: false,
    inStock: false,
    observationDate: 'Jul 12, 2026',
    evidenceReference: 'EV-2208',
    reviewStatus: 'pending',
  },
]

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

export default function AdminKitPreviewPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [candidate, setCandidate] = useState<string | undefined>('cand-1')
  const [matchNotes, setMatchNotes] = useState('')

  const [special, setSpecial] = useState<SpecialOrderConfig>({
    specialOrder: true,
    fulfillmentDays: 10,
    autoShipEligible: false,
    standardStockMessaging: true,
    active: true,
    customerMessage: '',
  })

  const [maxDiscount, setMaxDiscount] = useState(0.12)
  const [eligibility, setEligibility] = useState<DiscountEligibility[]>([
    { id: 'autoship', label: 'AutoShip discount', enabled: true },
    { id: 'institutional', label: 'Institutional pricing', enabled: true },
    { id: 'volume', label: 'Volume / bulk discount', enabled: false },
  ])

  const [approvedDiscount, setApprovedDiscount] = useState(0.1)
  const [institutionNotes, setInstitutionNotes] = useState('')

  const [publicComparison, setPublicComparison] = useState(true)
  const [strikethrough, setStrikethrough] = useState(false)

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="border-b border-border pb-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-foreground">
            Internal · Admin component kit
          </span>
          <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">
            TRU Peptide admin components
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Additive, prop-driven components for supplier intake, inventory, pricing economics, and
            market-comparison governance. Values shown are illustrative — every component receives
            its data through props and performs no fetching or persistence.
          </p>
        </header>

        <Section
          title="1 · Supplier comparison card"
          description="Compare an incoming NeoGen X offer against the current preferred supplier."
        >
          <SupplierComparisonCard
            product="Retatrutide"
            strength="5 mg"
            existingSupplier="Apex Peptide Supply"
            existingCostPerVial={78}
            neogenKitCost={640}
            neogenCostPerVial={64}
            kitCashRequirement={640}
            currentRetail={189}
            preferredStatus="under-review"
          />
        </Section>

        <Section
          title="2 · NeoGen X import review table"
          description="Review normalized supplier lines and approve or reject each for import."
        >
          <ImportReviewTable rows={IMPORT_ROWS} />
        </Section>

        <Section
          title="3 · Product match review drawer"
          description="Resolve how an imported line maps to the internal catalog."
        >
          <ActionButton variant="primary" size="md" onClick={() => setDrawerOpen(true)}>
            Open match review drawer
          </ActionButton>
          <ProductMatchDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            supplierProduct="Reta 10 mg vial"
            normalizedProduct="Retatrutide"
            strength="10 mg"
            costPerKit={1120}
            costPerVial={112}
            matchStatus="new-strength"
            candidates={[
              { id: 'cand-1', name: 'Retatrutide', strength: '5 mg', confidence: 0.86 },
              { id: 'cand-2', name: 'Retatrutide (blend)', strength: '5mg / 5mg', confidence: 0.42 },
            ]}
            selectedCandidateId={candidate}
            onSelectCandidate={setCandidate}
            notes={matchNotes}
            onNotesChange={setMatchNotes}
          />
        </Section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section
            title="4 · Special-order controls"
            description="Configure special-order fulfillment and customer messaging."
          >
            <SpecialOrderControls
              value={special}
              onChange={(patch) => setSpecial((prev) => ({ ...prev, ...patch }))}
            />
          </Section>

          <Section
            title="5 · Inventory lot card"
            description="Track a received supplier lot from kits to sellable vials."
          >
            <InventoryLotCard
              supplier="NeoGen X"
              supplierLotNumber="NGX-4821"
              internalLotNumber="TRU-0142"
              kitsPurchased={5}
              physicalVialsReceived={50}
              damagedVials={2}
              quarantinedVials={3}
              sellableVials={45}
              vialsSold={28}
              vialsRemaining={17}
              receivedDate="Jun 30, 2026"
              expirationDate="Jun 30, 2028"
              coaReference="COA-NGX-4821"
              testingStatus="passed"
            />
          </Section>

          <Section
            title="6 · Per-vial economics card"
            description="Model effective cost per vial across sellable-yield scenarios."
          >
            <PerVialEconomicsCard
              supplierKitCost={640}
              kitQuantity={10}
              planningSellableVials={10}
              currentRetail={189}
            />
          </Section>

          <Section
            title="7 · Discount margin simulator"
            description="See retained gross margin at each discount tier."
          >
            <DiscountMarginSimulator
              retail={189}
              costPerVial={64}
              maxDiscount={maxDiscount}
              onMaxDiscountChange={setMaxDiscount}
              eligibility={eligibility}
              onToggleEligibility={(id, next) =>
                setEligibility((prev) =>
                  prev.map((e) => (e.id === id ? { ...e, enabled: next } : e)),
                )
              }
            />
          </Section>
        </div>

        <Section
          title="8 · Institutional account review"
          description="Verify an institutional applicant and set an approved discount."
        >
          <InstitutionalAccountPanel
            institutionName="Meridian Research Institute"
            institutionType="Academic laboratory"
            businessEmail="procurement@meridian.edu"
            businessIdentifier="EIN 47-1029384"
            authorizedPurchaser="Dr. L. Okafor"
            requestedDiscount={0.15}
            approvedDiscount={approvedDiscount}
            onApprovedDiscountChange={setApprovedDiscount}
            status="pending"
            expirationDate="Dec 31, 2026"
            notes={institutionNotes}
            onNotesChange={setInstitutionNotes}
          />
        </Section>

        <Section
          title="9 · Market-comparison evidence panel"
          description="Log observed competitor listings and mark valid comparables."
        >
          <MarketEvidencePanel rows={EVIDENCE_ROWS} />
        </Section>

        <Section
          title="10 · Comparison-price approval controls"
          description="Approve or suppress the public comparison. Strikethrough is off by default."
        >
          <ComparisonApprovalControls
            validComparableCount={2}
            averagePrice={212}
            medianPrice={212}
            lowestPrice={205}
            lastUpdated="Jul 20, 2026"
            freshnessStatus="fresh"
            publicComparisonEnabled={publicComparison}
            onTogglePublicComparison={setPublicComparison}
            strikethroughEnabled={strikethrough}
            onToggleStrikethrough={setStrikethrough}
          />
        </Section>
      </div>
    </main>
  )
}
