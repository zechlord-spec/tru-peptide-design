// TRU Peptide storefront kit — isolated, prop-driven, additive components.
//
// Every component here matches the existing TRU visual identity and is safe to
// port into pages individually. None of them fetch data, embed prices, or make
// medical/dosing claims — all values arrive through props.

export { StandardProductCard, type StandardProductCardProps } from './standard-product-card'
export {
  SpecialOrderProductCard,
  type SpecialOrderProductCardProps,
} from './special-order-product-card'
export {
  ProductPurchasePanel,
  type ProductPurchasePanelProps,
  type PurchaseKind,
} from './purchase-panel'
export { StrengthSelector, type StrengthOption, type StrengthSelectorProps } from './strength-selector'
export { QuantitySelector, type QuantitySelectorProps } from './quantity-selector'
export { SingleVialNote, type SingleVialNoteProps } from './single-vial-note'
export { BlendContents, type BlendComponent, type BlendContentsProps } from './blend-contents'
export { CartLineItem, type CartLineItemProps } from './cart-line-item'
export {
  OrderDiscountMessage,
  type OrderDiscountMessageProps,
  BestDiscountSummary,
  type BestDiscountSummaryProps,
} from './order-discount'
export { MarketComparison, type MarketComparisonProps } from './market-comparison'
export {
  InstitutionalPricingNote,
  type InstitutionalPricingNoteProps,
} from './institutional-pricing-note'
export { perVial, hasPrice, formatUSD } from './format'
