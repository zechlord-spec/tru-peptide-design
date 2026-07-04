import Image from 'next/image'
import { deriveVialLabel } from '@/lib/vial-label'

type VialImageProps = {
  name: string
  catNo: string
  spec?: string
  /** Show SKU line on the label. Default false to keep the label clean. */
  showSku?: boolean
  /** Render the label overlay. Set false for tiny thumbnails where text is illegible. */
  showText?: boolean
  /** Background treatment behind the vial. Defaults to the studio light tone. */
  className?: string
  priority?: boolean
  sizes?: string
}

/**
 * The single source of truth for every product vial across the site.
 *
 * A photorealistic blank vial master image (`/vial-blank.png`) is rendered once
 * and a frosted pharmaceutical label is composited on top: the official Tru
 * Peptide logo (`/tru-peptide-logo-mark.png`) plus dynamic product information.
 *
 * Because the logo is referenced as an asset, updating that single file makes
 * every vial across the site inherit the new branding automatically. The label
 * design is identical for every product; only the injected data changes.
 */
export function VialImage({
  name,
  catNo,
  spec,
  showSku = false,
  showText = true,
  className,
  priority = false,
  sizes = '(max-width: 768px) 50vw, 25vw',
}: VialImageProps) {
  const label = deriveVialLabel({ name, catNo, spec })

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-[#eef1f4] ${className ?? ''}`}
    >
      {/* Vial + label share one aspect-locked stage so the label always tracks
          the vial body regardless of the container size. Container-query units
          (cqw) keep every label element proportional at any render scale. */}
      <div
        className="relative h-full max-h-full"
        style={{ aspectRatio: '372 / 820', containerType: 'inline-size' }}
      >
        <Image
          src="/vial-blank.png"
          alt={`${name} vial`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain"
        />

        {/* Frosted pharmaceutical label, positioned on the vial body */}
        {showText ? (
        <div
          className="absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2cqw] border border-[#0a1f3c]/10 bg-white/92 shadow-[0_1cqw_3cqw_rgba(10,31,60,0.18)] backdrop-blur-[0.5px]"
          style={{ width: '74%' }}
        >
          {/* Navy accent bar */}
          <div className="h-[1.6cqw] w-full bg-[#0a1f3c]" />

          <div className="flex flex-col items-center px-[6cqw] py-[5cqw] text-center">
            {/* Official Tru Peptide logo — the master branding asset */}
            <div className="relative h-[13cqw] w-[70%]">
              <Image
                src="/tru-peptide-logo-mark.png"
                alt="Tru Peptide"
                fill
                sizes="200px"
                className="object-contain"
              />
            </div>

            {/* Hairline divider */}
            <div className="my-[3.2cqw] h-px w-[86%] bg-[#0a1f3c]/15" />

            {/* Product name */}
            <p className="max-w-full truncate text-[5.4cqw] font-semibold leading-tight tracking-tight text-[#0a1f3c]">
              {label.name}
            </p>

            {/* Strength */}
            {label.strength ? (
              <p className="mt-[1cqw] text-[4.2cqw] font-medium uppercase tracking-[0.12em] text-[#2563a4]">
                {label.strength}
              </p>
            ) : null}

            {/* Research-use descriptor */}
            <p className="mt-[2.4cqw] text-[2.9cqw] font-medium uppercase tracking-[0.16em] text-[#0a1f3c]/55">
              For Research Use Only
            </p>

            {/* Dynamic footer: lot + expiry (SKU optional) */}
            <div className="mt-[3.4cqw] flex w-full items-center justify-between gap-[2cqw] border-t border-[#0a1f3c]/12 pt-[2.6cqw] text-[2.7cqw] font-medium tracking-wide text-[#0a1f3c]/60">
              <span>LOT {label.lot}</span>
              <span>EXP {label.exp}</span>
            </div>
            {showSku && label.sku ? (
              <p className="mt-[1.4cqw] text-[2.5cqw] tracking-wide text-[#0a1f3c]/45">
                SKU {label.sku}
              </p>
            ) : null}
          </div>
        </div>
        ) : null}
      </div>
    </div>
  )
}
