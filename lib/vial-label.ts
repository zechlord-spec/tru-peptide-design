// Deterministic, future-ready label metadata for the Tru Peptide vial system.
// All values derive from the product catalog number so the same product always
// renders an identical label (stable lot/expiry) without persisting anything.

export type VialLabelInfo = {
  /** Product name, e.g. "Retatrutide" */
  name: string
  /** Strength, e.g. "10mg" (parsed from spec) */
  strength: string
  /** SKU / catalog number (optional on the label) */
  sku?: string
  /** Batch / lot number, e.g. "TP-48213" */
  lot: string
  /** Expiration date, e.g. "03 / 2027" */
  exp: string
}

/** Pull a clean strength token like "10mg" from a spec string. */
export function parseStrength(spec: string | undefined): string {
  if (!spec) return ''
  const match = spec.match(/([\d.]+)\s*(mg|mcg|iu|g|ml)/i)
  if (match) return `${match[1]}${match[2].toLowerCase()}`
  // Fall back to the first whitespace-delimited token.
  return spec.split(/[\s/]+/)[0] ?? ''
}

/** Stable positive hash from a string (FNV-1a style). */
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/**
 * Derive consistent, professional-looking label metadata from a product's
 * catalog number and strength. Lot and expiry are deterministic so a given
 * SKU always shows the same values (future-ready fields).
 */
export function deriveVialLabel(input: {
  name: string
  catNo: string
  spec?: string
}): VialLabelInfo {
  const seed = hash(`${input.catNo}|${input.spec ?? ''}`)
  const lotNum = 10000 + (seed % 89999) // 5-digit lot
  // Expiry 2-3 years out, deterministic month.
  const month = (seed % 12) + 1
  const year = 2027 + (seed % 3)
  const exp = `${String(month).padStart(2, '0')} / ${year}`

  return {
    name: input.name,
    strength: parseStrength(input.spec),
    sku: input.catNo || undefined,
    lot: `TP-${lotNum}`,
    exp,
  }
}
