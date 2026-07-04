import Image from 'next/image'
import { deriveVialLabel } from '@/lib/vial-label'

type VialImageProps = {
  name: string
  catNo: string
  spec?: string
  /** Show the SKU line on the label. Default false to match the approved design. */
  showSku?: boolean
  /** Render the dynamic label text. Set false for tiny thumbnails where text is illegible. */
  showText?: boolean
  /**
   * Real product photograph. When supplied, it is displayed exactly as-is and
   * the dynamic template overlay is skipped. This is the swap point for future
   * studio photography — set a per-product photo (or replace the shared
   * `/vial-template.png` asset) and nothing else in the app has to change.
   */
  photo?: string
  className?: string
  priority?: boolean
  sizes?: string
}

/** Approved placeholder vial artwork (blue cap, clear glass, blank white label). */
const VIAL_TEMPLATE = '/vial-template.png'
/** Tru Peptide brand blue used for the strength badge and the footer band. */
const BRAND_BLUE = '#0b338f'

/**
 * The single source of truth for every product vial across the storefront.
 *
 * It renders the approved placeholder vial photograph (`/vial-template.png`)
 * and composites the official Tru Peptide label on top. The label design —
 * logo, "99% PURITY", "RESEARCH USE ONLY", "NOT FOR HUMAN CONSUMPTION" and the
 * "FOR RESEARCH PURPOSES ONLY" footer band — is identical for every product.
 * Only three fields are dynamic and pulled from the catalog: product name,
 * strength, and (optionally) SKU.
 *
 * Future studio photography drops in via the `photo` prop or by replacing the
 * shared template asset — the product catalog and pages never need to change.
 */
export function VialImage({
  name,
  catNo,
  spec,
  showSku = false,
  showText = true,
  photo,
  className,
  priority = false,
  sizes = '(max-width: 768px) 50vw, 25vw',
}: VialImageProps) {
  const label = deriveVialLabel({ name, catNo, spec })

  // Future real product photography: show exactly as provided, no overlay.
  if (photo) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-[#eef1f4] ${className ?? ''}`}
      >
        <Image
          src={photo}
          alt={`${name} vial`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain"
        />
      </div>
    )
  }

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-[#eef1f4] ${className ?? ''}`}
    >
      {/* The stage matches the template's intrinsic aspect ratio so the overlaid
          label always tracks the printed label position at any render size. */}
      <div className="relative h-full max-h-full" style={{ aspectRatio: '300 / 880' }}>
        <Image
          src={VIAL_TEMPLATE}
          alt={`${name} research vial`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain"
        />

        {/* Dynamic label — sits exactly over (and fully covers) the placeholder's
            printed label. Container-query units keep every element proportional. */}
        <div
          className="absolute overflow-hidden rounded-[4cqw] shadow-[0_0.6cqw_2cqw_rgba(6,20,60,0.12)]"
          style={{
            left: '6%',
            width: '88%',
            top: '35.2%',
            height: '45.3%',
            containerType: 'inline-size',
            background:
              'linear-gradient(90deg,#e4e7ec 0%,#f6f8fa 13%,#fbfcfd 50%,#f6f8fa 87%,#e4e7ec 100%)',
          }}
        >
          <div className="flex h-full flex-col items-center">
            <div className="flex flex-1 flex-col items-center px-[7cqw] pt-[7cqw] text-center">
              {/* Official Tru Peptide logo (exact approved brand mark) */}
              <div className="relative h-[15cqw] w-[62%]">
                <Image
                  src="/tru-peptide-label-logo.png"
                  alt="Tru Peptide"
                  fill
                  sizes="200px"
                  className="object-contain"
                />
              </div>

              {showText ? (
                <>
                  {/* Dynamic: product name */}
                  <p className="mt-[6cqw] text-[13cqw] font-extrabold uppercase leading-[1.02] tracking-tight text-[#0b0b0d]">
                    {label.name}
                  </p>

                  {/* Dynamic: strength badge */}
                  {label.strength ? (
                    <span
                      className="mt-[4cqw] inline-block rounded-[1.6cqw] px-[7cqw] py-[1.8cqw] text-[8.5cqw] font-bold uppercase leading-none text-white"
                      style={{ backgroundColor: BRAND_BLUE }}
                    >
                      {label.strength}
                    </span>
                  ) : null}

                  {/* Constant descriptors */}
                  <p className="mt-[5cqw] text-[7cqw] font-semibold uppercase tracking-[0.05em] text-[#2b2b30]">
                    99% Purity
                  </p>
                  <p className="mt-[2.2cqw] text-[6cqw] font-medium uppercase tracking-[0.04em] text-[#33333a]">
                    Research Use Only
                  </p>
                  <p className="mt-[1.4cqw] text-[5.3cqw] font-medium uppercase tracking-[0.03em] text-[#33333a]">
                    Not For Human Consumption
                  </p>

                  {/* Optional dynamic SKU */}
                  {showSku && label.sku ? (
                    <p className="mt-[2cqw] text-[4.6cqw] font-medium uppercase tracking-[0.08em] text-[#6a6a70]">
                      SKU {label.sku}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>

            {/* Constant blue footer band */}
            <div
              className="mt-auto w-full whitespace-nowrap py-[3.4cqw] text-center text-[4.4cqw] font-semibold uppercase leading-none tracking-[0.1em] text-white"
              style={{ backgroundColor: BRAND_BLUE }}
            >
              For Research Purposes Only
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
