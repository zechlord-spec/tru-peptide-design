// Client-safe presentation helpers for domain data.
//
// These are pure functions with no data-source or server dependencies, so both
// server and client components can import them regardless of where the catalog
// data came from. Re-exported here so UI code can pull display helpers from the
// data-layer namespace.

export { vialDose, vialLabel } from '@/lib/products-data'
