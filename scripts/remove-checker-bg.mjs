import sharp from 'sharp'

// The image generator baked a grey checkerboard as a fake "transparent"
// background. This removes it via a flood fill from the borders that only
// eats connected NEUTRAL-GREY pixels (r≈g≈b), so the subtly blue-tinted glass
// subject and its edges are preserved. Outputs a true transparent PNG, trimmed.
const [, , SRC, OUT] = process.argv
if (!SRC || !OUT) {
  console.error('usage: node remove-checker-bg.mjs <src> <out>')
  process.exit(1)
}

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: w, height: h, channels: c } = info

const isNeutral = (i) => {
  const r = data[i * c]
  const g = data[i * c + 1]
  const b = data[i * c + 2]
  const spread = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))
  return spread <= 14 // checkerboard greys are perfectly neutral
}

const bg = new Uint8Array(w * h) // 1 = background
const stack = []
for (let x = 0; x < w; x++) {
  stack.push(x, x + (h - 1) * w)
}
for (let y = 0; y < h; y++) {
  stack.push(y * w, w - 1 + y * w)
}
while (stack.length) {
  const i = stack.pop()
  if (bg[i]) continue
  if (!isNeutral(i)) continue
  bg[i] = 1
  const x = i % w
  const y = (i / w) | 0
  if (x > 0) stack.push(i - 1)
  if (x < w - 1) stack.push(i + 1)
  if (y > 0) stack.push(i - w)
  if (y < h - 1) stack.push(i + w)
}

const out = Buffer.alloc(w * h * 4)
for (let i = 0; i < w * h; i++) {
  out[i * 4] = data[i * c]
  out[i * 4 + 1] = data[i * c + 1]
  out[i * 4 + 2] = data[i * c + 2]
  out[i * 4 + 3] = bg[i] ? 0 : 255
}

// Feather the alpha edge by 1px to avoid a hard aliased cutout.
await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .trim({ threshold: 10 })
  .png()
  .toFile(OUT)

const meta = await sharp(OUT).metadata()
console.log(`Wrote ${OUT} ${meta.width}x${meta.height}`)
