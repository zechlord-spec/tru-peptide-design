// Internal admin component kit for the TRU Peptide dashboard.
//
// These components are additive and prop-driven: they contain no data
// fetching, Supabase queries, or API handlers. All values are supplied by the
// caller so they can drop into the existing admin surface unchanged.

export * from './format'
export * from './primitives'
export * from './match-status'

export { SupplierComparisonCard } from './supplier-comparison-card'
export type {
  SupplierComparisonCardProps,
  PreferredSupplierStatus,
} from './supplier-comparison-card'

export { ImportReviewTable } from './import-review-table'
export type { ImportReviewTableProps, ImportReviewRow, ImportStatus } from './import-review-table'

export { ProductMatchDrawer } from './product-match-drawer'
export type { ProductMatchDrawerProps, MatchCandidate } from './product-match-drawer'

export { SpecialOrderControls } from './special-order-controls'
export type { SpecialOrderControlsProps, SpecialOrderConfig } from './special-order-controls'

export { InventoryLotCard } from './inventory-lot-card'
export type { InventoryLotCardProps, TestingStatus } from './inventory-lot-card'

export { PerVialEconomicsCard } from './per-vial-economics-card'
export type { PerVialEconomicsCardProps } from './per-vial-economics-card'

export { DiscountMarginSimulator } from './discount-margin-simulator'
export type { DiscountMarginSimulatorProps, DiscountEligibility } from './discount-margin-simulator'

export { InstitutionalAccountPanel } from './institutional-account-panel'
export type {
  InstitutionalAccountPanelProps,
  InstitutionStatus,
} from './institutional-account-panel'

export { MarketEvidencePanel } from './market-evidence-panel'
export type {
  MarketEvidencePanelProps,
  MarketEvidenceRow,
  EvidenceReviewStatus,
} from './market-evidence-panel'

export { ComparisonApprovalControls } from './comparison-approval-controls'
export type {
  ComparisonApprovalControlsProps,
  FreshnessStatus,
} from './comparison-approval-controls'
