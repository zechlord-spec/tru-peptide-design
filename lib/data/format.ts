// Client-safe presentation helpers for domain data.
//
// These are pure string transforms with no data-source or server dependencies,
// so both server and client components can import them without pulling in the
// reference data set. They are defined here (rather than re-exported from the
// bundled reference data file) so client bundles stay lean.

// Extract the dose portion of a variant spec (e.g. "5mg" from "5mg × 10 vials").
export function vialDose(spec: string): string {
  const m = spec.match(/^\s*([\d.]+\s*m[gl])/i)
  if (m) return m[1].replace(/\s+/g, '')
  return spec.split('×')[0].trim()
}

// Customer-facing single-vial label (e.g. "5mg vial"). No box language.
export function vialLabel(spec: string): string {
  return `${vialDose(spec)} vial`
}
