// Dynamic label metadata for the Tru Peptide vial template.
//
// The approved placeholder vial artwork is fixed; ONLY these fields are
// injected dynamically from the product catalog:
//   - name     (e.g. "BPC-157")
//   - strength (e.g. "5mg", parsed from the variant spec)
//   - sku      (optional catalog number)
// Everything else on the label ("99% PURITY", "RESEARCH USE ONLY", the footer
// band, the logo, layout, colors, typography) is constant across all products.

export type VialLabelInfo = {
  /** Product name, e.g. "BPC-157" */
  name: string
  /** Strength, e.g. "5mg" (parsed from spec) — may be empty */
  strength: string
  /** SKU / catalog number (optional on the label) */
  sku?: string
}

/** Pull a clean strength token like "10mg" from a spec string. */
export function parseStrength(spec: string | undefined): string {
  if (!spec) return ''
  const match = spec.match(/([\d.]+)\s*(mg|mcg|iu|g|ml)/i)
  if (match) return `${match[1]}${match[2].toLowerCase()}`
  // Fall back to the first whitespace/slash-delimited token.
  return spec.split(/[\s/]+/)[0] ?? ''
}

/** Map a product's catalog data to the dynamic fields shown on the vial label. */
export function deriveVialLabel(input: {
  name: string
  catNo: string
  spec?: string
}): VialLabelInfo {
  return {
    name: input.name,
    strength: parseStrength(input.spec),
    sku: input.catNo || undefined,
  }
}
