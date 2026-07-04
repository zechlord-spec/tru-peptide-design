import sharp from 'sharp'

// Convert the uploaded Tru Peptide logo (navy artwork on a cream background)
// into a clean transparent-background PNG, preserving the exact artwork shapes
// while keying out the beige backdrop. Output is used as the master label asset.
const SRC = 'public/tru-peptide-logo.png'
const OUT = 'public/tru-peptide-logo-mark.png'

// Brand navy the kept pixels are recolored to (crisp, no beige fringing).
const NAVY = { r: 11, g: 27, b: 54 }

const img = sharp(SRC).ensureAlpha()
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

const out = Buffer.alloc(width * height * 4)
for (let i = 0; i < width * height; i++) {
  const s = i * channels
  const r = data[s]
  const g = data[s + 1]
  const b = data[s + 2]
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const darkness = 1 - lum
  // Ramp tuned so the light cream background AND the soft embossed drop-shadow
  // (mid-grey) both key out, leaving only the dark navy artwork opaque.
  let alpha = (darkness - 0.55) / 0.17
  alpha = Math.max(0, Math.min(1, alpha))
  const d = i * 4
  out[d] = NAVY.r
  out[d + 1] = NAVY.g
  out[d + 2] = NAVY.b
  out[d + 3] = Math.round(alpha * 255)
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .trim({ threshold: 10 })
  .png()
  .toFile(OUT)

const meta = await sharp(OUT).metadata()
console.log(`Wrote ${OUT} ${meta.width}x${meta.height}`)
