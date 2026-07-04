// Canonical tag taxonomy for the tag-based recommendation engine.
// Tags are the single mechanism that connects products to Tru Systems.
// Assign the right tags to a product and it automatically appears in every
// system whose tag rules include one of those tags — no hardcoded lists.

export const TAGS = [
  'Weight Management',
  'Muscle Growth',
  'Fat Loss',
  'Recovery',
  'Injury Repair',
  'Joint Health',
  'Longevity',
  'Anti-Aging',
  'Hormone Optimization',
  'Sleep',
  'Stress',
  'Cognitive Performance',
  'Focus',
  'Energy',
  'Immune Support',
  'Gut Health',
  'Skin & Hair',
  'Libido',
  'Sexual Wellness',
  "Women's Health",
  "Men's Health",
  'Metabolic Health',
  'Inflammation',
  'Healing',
  'Performance',
  'Endurance',
] as const

export type Tag = (typeof TAGS)[number]

export function isTag(value: string): value is Tag {
  return (TAGS as readonly string[]).includes(value)
}

// Default tags per product (keyed by product slug). These are the baseline
// assignments shipped in code; the admin panel can overlay additions/removals
// which are persisted in the database and merged on top of these defaults.
export const DEFAULT_PRODUCT_TAGS: Record<string, Tag[]> = {
  // Weight management / metabolic
  retatrutide: ['Weight Management', 'Fat Loss', 'Metabolic Health', 'Energy'],
  tirzepatide: ['Weight Management', 'Fat Loss', 'Metabolic Health', 'Energy'],
  semaglutide: ['Weight Management', 'Fat Loss', 'Metabolic Health'],
  cagrilintide: ['Weight Management', 'Fat Loss', 'Metabolic Health'],
  'mots-c': [
    'Weight Management',
    'Metabolic Health',
    'Energy',
    'Endurance',
    'Longevity',
    'Performance',
    'Cognitive Performance',
  ],
  '5-amino-1mq': ['Weight Management', 'Fat Loss', 'Metabolic Health', 'Energy'],
  tesamorelin: [
    'Weight Management',
    'Fat Loss',
    'Metabolic Health',
    'Performance',
    'Longevity',
    'Anti-Aging',
    'Hormone Optimization',
  ],
  'l-carnitine': ['Weight Management', 'Fat Loss', 'Energy', 'Endurance', 'Metabolic Health'],
  'lipo-c': ['Weight Management', 'Fat Loss', 'Energy', 'Metabolic Health'],
  'mic-b12': ['Weight Management', 'Fat Loss', 'Energy', 'Metabolic Health'],
  'lemon-bottle': ['Weight Management', 'Fat Loss', 'Skin & Hair'],

  // Recovery
  'bpc-157': ['Recovery', 'Injury Repair', 'Joint Health', 'Healing', 'Inflammation', 'Gut Health', 'Performance'],
  'bpc-tb500-blend': ['Recovery', 'Injury Repair', 'Joint Health', 'Healing', 'Inflammation', 'Performance'],
  'tb-500': ['Recovery', 'Injury Repair', 'Joint Health', 'Healing', 'Inflammation', 'Performance', 'Skin & Hair'],
  kpv: ['Recovery', 'Inflammation', 'Gut Health', 'Healing', 'Immune Support', 'Skin & Hair'],

  // Performance / GH axis
  'igf-1-lr3': ['Muscle Growth', 'Performance', 'Recovery', 'Endurance'],
  'cjc-1295-dac': [
    'Performance',
    'Muscle Growth',
    'Recovery',
    'Anti-Aging',
    'Hormone Optimization',
    'Longevity',
    'Metabolic Health',
    'Sleep',
  ],
  'cjc-1295-no-dac': [
    'Performance',
    'Muscle Growth',
    'Recovery',
    'Anti-Aging',
    'Hormone Optimization',
    'Longevity',
    'Metabolic Health',
  ],
  'cjc-ipamorelin-blend': [
    'Performance',
    'Muscle Growth',
    'Recovery',
    'Anti-Aging',
    'Hormone Optimization',
    'Longevity',
    'Metabolic Health',
    'Sleep',
  ],
  ipamorelin: [
    'Performance',
    'Muscle Growth',
    'Recovery',
    'Anti-Aging',
    'Hormone Optimization',
    'Longevity',
    'Metabolic Health',
    'Sleep',
  ],
  sermorelin: [
    'Performance',
    'Muscle Growth',
    'Recovery',
    'Anti-Aging',
    'Hormone Optimization',
    'Longevity',
    'Metabolic Health',
    'Sleep',
  ],

  // Longevity
  epithalon: ['Longevity', 'Anti-Aging', 'Sleep', 'Healing'],
  'nad-plus': [
    'Longevity',
    'Anti-Aging',
    'Energy',
    'Cognitive Performance',
    'Metabolic Health',
    'Recovery',
    'Performance',
  ],
  'ss-31': ['Longevity', 'Anti-Aging', 'Energy', 'Recovery', 'Cognitive Performance', 'Inflammation'],
  'foxo4-dri': ['Longevity', 'Anti-Aging'],
  glutathione: ['Longevity', 'Anti-Aging', 'Immune Support', 'Skin & Hair', 'Recovery', 'Inflammation', 'Energy'],

  // Beauty / skin
  'ghk-cu': [
    'Skin & Hair',
    'Anti-Aging',
    'Recovery',
    'Injury Repair',
    'Healing',
    'Longevity',
    'Inflammation',
    'Metabolic Health',
  ],
  'ahk-cu': ['Skin & Hair', 'Anti-Aging', 'Healing'],
  'glow-blend': ['Skin & Hair', 'Anti-Aging', 'Recovery', 'Healing'],
  'klow-blend': ['Skin & Hair', 'Anti-Aging', 'Recovery', 'Weight Management', 'Healing'],
  'snap-8': ['Skin & Hair', 'Anti-Aging'],
  'melanotan-2': ['Skin & Hair', 'Libido', 'Sexual Wellness'],

  // Cognitive
  selank: ['Cognitive Performance', 'Focus', 'Stress', 'Sleep', 'Immune Support'],
  semax: ['Cognitive Performance', 'Focus', 'Energy'],

  // Sleep / stress
  dsip: ['Sleep', 'Stress', 'Recovery', 'Cognitive Performance'],

  // Sexual / hormonal
  'pt-141': ['Libido', 'Sexual Wellness', "Men's Health", "Women's Health"],
  'kisspeptin-10': ['Hormone Optimization', 'Sexual Wellness', "Men's Health", "Women's Health", 'Libido'],

  // Immune
  'thymosin-alpha-1': ['Immune Support', 'Inflammation', 'Longevity', 'Recovery'],
  thymalin: ['Immune Support', 'Longevity', 'Anti-Aging'],
  vip: ['Immune Support', 'Inflammation', 'Cognitive Performance', 'Recovery'],

  // Energy
  b12: ['Energy', 'Metabolic Health'],

  // Accessory (intentionally untagged)
  'bacteriostatic-water': [],
}

// Short, benefit-first summaries shown on recommendation cards.
export const PRODUCT_BENEFIT: Record<string, string> = {
  retatrutide: 'Triple-agonist studied for appetite control and fat loss.',
  tirzepatide: 'Dual GIP/GLP-1 studied for satiety and body composition.',
  semaglutide: 'GLP-1 agonist studied for appetite and metabolic balance.',
  cagrilintide: 'Amylin analog studied for satiety and weight support.',
  'mots-c': 'Mitochondrial peptide studied for metabolism and endurance.',
  '5-amino-1mq': 'NNMT inhibitor studied for fat cell activity and energy.',
  tesamorelin: 'GH-releasing factor studied for visceral fat and lean mass.',
  'l-carnitine': 'Studied for fatty-acid transport and energy output.',
  'lipo-c': 'Lipotropic blend studied for fat metabolism and energy.',
  'mic-b12': 'Lipotropic + B12 blend studied for fat loss and energy.',
  'lemon-bottle': 'Lipolytic solution studied for localized fat reduction.',
  'bpc-157': 'Studied for soft-tissue repair, gut health, and recovery.',
  'bpc-tb500-blend': 'Dual repair blend studied for accelerated recovery.',
  'tb-500': 'Regenerative peptide studied for tissue repair and mobility.',
  kpv: 'Anti-inflammatory tripeptide studied for gut and immune balance.',
  'igf-1-lr3': 'Growth factor studied for muscle growth and recovery.',
  'cjc-1295-dac': 'Long-acting GHRH analog studied for GH support.',
  'cjc-1295-no-dac': 'GHRH analog studied for pulsatile GH release.',
  'cjc-ipamorelin-blend': 'GHRH + secretagogue blend studied for GH output.',
  ipamorelin: 'Selective secretagogue studied for clean GH release.',
  sermorelin: 'GHRH analog studied for natural GH rhythm and recovery.',
  epithalon: 'Telomerase peptide studied for cellular aging and sleep.',
  'nad-plus': 'Cellular cofactor studied for energy and healthy aging.',
  'ss-31': 'Mitochondrial peptide studied for energy and cellular repair.',
  'foxo4-dri': 'Senolytic peptide studied for clearing senescent cells.',
  glutathione: 'Master antioxidant studied for detox, skin, and immunity.',
  'ghk-cu': 'Copper peptide studied for collagen, skin, and repair.',
  'ahk-cu': 'Copper peptide studied for hair and skin vitality.',
  'glow-blend': 'Skin-focused blend studied for radiance and repair.',
  'klow-blend': 'Beauty + metabolic blend studied for skin and body.',
  'snap-8': 'Peptide studied for expression-line smoothing.',
  'melanotan-2': 'Melanocortin peptide studied for tanning and libido.',
  selank: 'Anxiolytic peptide studied for calm focus and stress.',
  semax: 'Nootropic peptide studied for focus and mental clarity.',
  dsip: 'Sleep peptide studied for deep, restorative rest.',
  'pt-141': 'Melanocortin peptide studied for libido and arousal.',
  'kisspeptin-10': 'Hormonal signaler studied for endocrine rhythm.',
  'thymosin-alpha-1': 'Thymic peptide studied for immune modulation.',
  thymalin: 'Thymic complex studied for immune restoration.',
  vip: 'Vasoactive peptide studied for immune and inflammatory balance.',
  b12: 'Essential cofactor studied for energy and neurological support.',
  'bacteriostatic-water': 'Sterile water for reconstituting research compounds.',
}

// Tag rules per Tru System (keyed by system slug). A product is included in a
// system when it shares AT LEAST ONE of the system's tags. Editable by admins.
export const DEFAULT_SYSTEM_TAGS: Record<string, Tag[]> = {
  'tru-klow': ['Weight Management', 'Fat Loss', 'Metabolic Health'],
  'tru-perform': ['Performance', 'Muscle Growth', 'Endurance'],
  'tru-recover': ['Recovery', 'Injury Repair', 'Inflammation', 'Healing', 'Joint Health'],
  'tru-longevity': ['Longevity', 'Anti-Aging'],
  'tru-glow': ['Skin & Hair', 'Anti-Aging'],
  'tru-focus': ['Cognitive Performance', 'Focus'],
  'tru-rest': ['Sleep', 'Stress'],
  'tru-vital': ['Sexual Wellness', 'Hormone Optimization', 'Libido'],
  'tru-defense': ['Immune Support'],
}
