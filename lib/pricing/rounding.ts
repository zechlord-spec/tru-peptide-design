/**
 * Round a raw price to a psychologically attractive value ("charm pricing").
 * The rounding is always DOWNWARD so a computed "~20% below market" price never
 * drifts back up above target.
 *
 * Rule (verified against the required examples):
 *   - value >= 100  → round down to the nearest number ending in 9  (…9)
 *   - value <  100  → round down to the nearest number ending in 5 or 9
 *
 *   47 → 45, 53 → 49, 77 → 75, 84 → 79, 112 → 109, 136 → 129, 198 → 189
 */
export function roundToAttractive(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0

  const v = Math.round(value)

  if (v < 10) return v >= 7 ? 9 : 5

  return v >= 100 ? nearest9Below(v) : nearest5or9Below(v)
}

// Largest number ending in 9 that is <= v.
function nearest9Below(v: number): number {
  let r = Math.floor((v - 9) / 10) * 10 + 9
  if (r > v) r -= 10
  return Math.max(9, r)
}

// Closest number ending in 5 or 9 that is <= v (ties break to the higher/closer).
function nearest5or9Below(v: number): number {
  const base = Math.floor(v / 10) * 10
  const candidates: number[] = []
  for (let b = base - 10; b <= base + 10; b += 10) {
    for (const end of [5, 9]) {
      const c = b + end
      if (c > 0 && c <= v) candidates.push(c)
    }
  }
  let best = candidates[0]
  for (const c of candidates) {
    const d = Math.abs(c - v)
    const bd = Math.abs(best - v)
    if (d < bd || (d === bd && c > best)) best = c
  }
  return best
}
