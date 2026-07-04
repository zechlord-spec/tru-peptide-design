import 'server-only'
import { generateObject } from 'ai'
import { z } from 'zod'

// Model served zero-config through the Vercel AI Gateway.
const RESEARCH_MODEL = 'openai/gpt-4o-mini'

const variantSchema = z.object({
  dose: z.string().describe('The vial dose exactly as provided, e.g. "5mg"'),
  marketLow: z.number().describe('Lowest normal US retail price per single vial in USD'),
  marketHigh: z.number().describe('Highest normal US retail price per single vial in USD'),
  marketAverage: z.number().describe('Average normal US retail price per single vial in USD'),
  marketMedian: z.number().describe('Median normal US retail price per single vial in USD'),
  numberOfSources: z
    .number()
    .int()
    .describe('How many distinct vendors/clinics informed this estimate'),
  confidence: z.number().min(0).max(1).describe('Confidence 0-1 in this estimate'),
})

const researchSchema = z.object({
  variants: z.array(variantSchema),
})

export type VariantMarketData = z.infer<typeof variantSchema>

export type ResearchRequest = {
  peptideName: string
  doses: string[] // e.g. ["5mg", "10mg", ...]
}

/**
 * Research current US retail per-vial pricing for one peptide across its doses.
 * Uses normal retail pricing only — ignores clearance, coupons, and bulk deals.
 * Returns null on failure so callers can fall back to prior/estimated data.
 */
export async function researchPeptidePricing(
  req: ResearchRequest,
): Promise<VariantMarketData[] | null> {
  try {
    const { object } = await generateObject({
      model: RESEARCH_MODEL,
      schema: researchSchema,
      prompt: buildPrompt(req),
    })
    return object.variants
  } catch (err) {
    console.log('[v0] market research failed for', req.peptideName, String(err))
    return null
  }
}

function buildPrompt(req: ResearchRequest): string {
  return [
    `You are a pricing analyst researching the current United States retail market for the research peptide "${req.peptideName}".`,
    `For EACH of the following vial doses, estimate the typical price per SINGLE vial sold to US customers by established peptide vendors and telehealth/wellness clinics: ${req.doses.join(', ')}.`,
    '',
    'Rules:',
    '- Use only NORMAL retail pricing.',
    '- IGNORE obvious clearance pricing, coupon/promo pricing, and bulk/wholesale discounts.',
    '- Prices are per single vial in USD (not per box or per pack).',
    '- Higher doses generally cost more than lower doses.',
    '- Provide lowest, highest, average, and median observed retail price per vial.',
    '- Provide how many distinct sources informed each estimate and a 0-1 confidence score.',
    '- Return one entry per requested dose, echoing the dose string exactly.',
  ].join('\n')
}
