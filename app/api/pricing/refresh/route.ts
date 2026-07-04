import { NextResponse } from 'next/server'
import {
  PRICING,
  buildPricingSnapshot,
  type VialPricing,
} from '@/lib/pricing/pricing-service'
import { PRICING_EPOCH } from '@/lib/pricing/market-sources'

/**
 * Scheduled market pricing refresh.
 *
 * Intended to run on a schedule (see vercel.json crons). It re-crawls the
 * market source feed for a fresh epoch, recomputes each SKU's marketAveragePrice
 * and retail price, and reports what moved. In production the recomputed snapshot
 * would be persisted (e.g. to the database / Edge Config) and become the app's
 * read path; here we return the diff so the operation is observable.
 */
export const dynamic = 'force-dynamic'

function currentEpoch(): number {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = now.getUTCMonth() + 1
  const d = now.getUTCDate()
  return y * 10000 + m * 100 + d
}

export async function GET() {
  const epoch = currentEpoch()
  const next = buildPricingSnapshot(epoch)

  const changes: {
    catNo: string
    previousRetail: number
    newRetail: number
    marketAveragePrice: number
    numberOfSources: number
    confidenceScore: number
  }[] = []

  for (const catNo of Object.keys(next)) {
    const before: VialPricing | undefined = PRICING[catNo]
    const after = next[catNo]
    if (!before || before.retailPrice !== after.retailPrice) {
      changes.push({
        catNo,
        previousRetail: before?.retailPrice ?? 0,
        newRetail: after.retailPrice,
        marketAveragePrice: after.marketAveragePrice,
        numberOfSources: after.numberOfSources,
        confidenceScore: after.confidenceScore,
      })
    }
  }

  return NextResponse.json({
    ok: true,
    refreshedAt: new Date().toISOString(),
    baselineEpoch: PRICING_EPOCH,
    crawlEpoch: epoch,
    skusEvaluated: Object.keys(next).length,
    priceChanges: changes.length,
    changes,
  })
}
