export type ProductVariant = {
  catNo: string
  spec: string
}

export type Product = {
  slug: string
  name: string
  category: string
  compoundType: string
  goals: string[]
  systems: string[]
  image: string
  blurb: string
  variants: ProductVariant[]
  isNew?: boolean
}

// Category = high-level shelf label shown on the card
// compoundType = mechanistic classification used by the Compound Type filter
export const PRODUCTS: Product[] = [
  {
    slug: 'retatrutide',
    name: 'Retatrutide',
    category: 'Weight Management',
    compoundType: 'GLP-1 / Incretin',
    goals: ['Weight Management', 'Energy'],
    systems: ['TRU KLOW'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'A triple-agonist incretin mimetic studied for its effects on appetite regulation, energy expenditure, and metabolic balance.',
    isNew: true,
    variants: [
      { catNo: 'RT5', spec: '5mg × 10 vials' },
      { catNo: 'RT10', spec: '10mg × 10 vials' },
      { catNo: 'RT15', spec: '15mg × 10 vials' },
      { catNo: 'RT20', spec: '20mg × 10 vials' },
      { catNo: 'RT30', spec: '30mg × 10 vials' },
      { catNo: 'RT40', spec: '40mg × 10 vials' },
      { catNo: 'RT50', spec: '50mg × 10 vials' },
      { catNo: 'RT60', spec: '60mg × 10 vials' },
    ],
  },
  {
    slug: 'tirzepatide',
    name: 'Tirzepatide',
    category: 'Weight Management',
    compoundType: 'GLP-1 / Incretin',
    goals: ['Weight Management', 'Energy'],
    systems: ['TRU KLOW'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'A dual GIP/GLP-1 receptor agonist researched for satiety signaling, glucose handling, and body composition.',
    isNew: true,
    variants: [
      { catNo: 'TR5', spec: '5mg × 10 vials' },
      { catNo: 'TR10', spec: '10mg × 10 vials' },
      { catNo: 'TR15', spec: '15mg × 10 vials' },
      { catNo: 'TR20', spec: '20mg × 10 vials' },
      { catNo: 'TR30', spec: '30mg × 10 vials' },
      { catNo: 'TR40', spec: '40mg × 10 vials' },
      { catNo: 'TR50', spec: '50mg × 10 vials' },
      { catNo: 'TR60', spec: '60mg × 10 vials' },
      { catNo: 'TR80', spec: '80mg × 10 vials' },
      { catNo: 'TR100', spec: '100mg × 10 vials' },
    ],
  },
  {
    slug: 'semaglutide',
    name: 'Semaglutide',
    category: 'Weight Management',
    compoundType: 'GLP-1 / Incretin',
    goals: ['Weight Management', 'Energy'],
    systems: ['TRU KLOW'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'A GLP-1 receptor agonist studied for appetite modulation and metabolic regulation.',
    variants: [
      { catNo: 'SM10', spec: '10mg × 10 vials' },
      { catNo: 'SM20', spec: '20mg × 10 vials' },
      { catNo: 'SM30', spec: '30mg × 10 vials' },
    ],
  },
  {
    slug: 'cagrilintide',
    name: 'Cagrilintide',
    category: 'Weight Management',
    compoundType: 'GLP-1 / Incretin',
    goals: ['Weight Management'],
    systems: ['TRU KLOW'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'A long-acting amylin analog investigated for satiety and complementary metabolic signaling.',
    variants: [
      { catNo: 'CGL5', spec: '5mg × 10 vials' },
      { catNo: 'CGL10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'mots-c',
    name: 'MOTS-c',
    category: 'Metabolic',
    compoundType: 'Metabolic',
    goals: ['Weight Management', 'Performance', 'Energy'],
    systems: ['TRU KLOW', 'TRU PERFORM'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'A mitochondrial-derived peptide studied for its role in metabolic homeostasis and exercise capacity.',
    variants: [
      { catNo: 'MS10', spec: '10mg × 10 vials' },
      { catNo: 'MS15', spec: '15mg × 10 vials' },
      { catNo: 'MS20', spec: '20mg × 10 vials' },
      { catNo: 'MS40', spec: '40mg × 10 vials' },
    ],
  },
  {
    slug: '5-amino-1mq',
    name: '5-AMINO-1MQ',
    category: 'Metabolic',
    compoundType: 'Metabolic',
    goals: ['Weight Management', 'Energy'],
    systems: ['TRU KLOW'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'A small molecule NNMT inhibitor researched for its influence on cellular energy metabolism and fat cell activity.',
    variants: [
      { catNo: '5AM', spec: '5mg × 10 vials' },
      { catNo: '10AM', spec: '10mg × 10 vials' },
      { catNo: '50AM', spec: '50mg × 10 vials' },
    ],
  },
  {
    slug: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'Metabolic',
    compoundType: 'Growth Hormone Secretagogue',
    goals: ['Weight Management', 'Performance', 'Healthy Aging'],
    systems: ['TRU KLOW', 'TRU PERFORM'],
    image: '/catalog/vial-growth.png',
    blurb:
      'A growth-hormone-releasing hormone analog studied for visceral fat reduction and body composition.',
    variants: [
      { catNo: 'TSM5', spec: '5mg × 10 vials' },
      { catNo: 'TSM10', spec: '10mg × 10 vials' },
      { catNo: 'TSM20', spec: '20mg × 10 vials' },
    ],
  },
  {
    slug: 'l-carnitine',
    name: 'L-Carnitine',
    category: 'Metabolic',
    compoundType: 'Metabolic',
    goals: ['Weight Management', 'Energy', 'Performance'],
    systems: ['TRU KLOW'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'An amino acid derivative studied for fatty acid transport and cellular energy production.',
    variants: [{ catNo: 'LC1200', spec: '1200mg × 10 vials' }],
  },
  {
    slug: 'lipo-c',
    name: 'Lipo-C',
    category: 'Metabolic',
    compoundType: 'Metabolic',
    goals: ['Weight Management', 'Energy'],
    systems: ['TRU KLOW'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'A lipotropic blend researched in the context of fat metabolism and energy support.',
    variants: [{ catNo: 'Lipo-c', spec: '10ml × 10 vials' }],
  },
  {
    slug: 'mic-b12',
    name: 'MIC (Lipo-C with B12)',
    category: 'Metabolic',
    compoundType: 'Metabolic',
    goals: ['Weight Management', 'Energy'],
    systems: ['TRU KLOW'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'A methionine-inositol-choline complex with B12, studied for lipid metabolism and energy support.',
    variants: [{ catNo: 'MIC', spec: '10ml × 10 vials' }],
  },
  {
    slug: 'lemon-bottle',
    name: 'Lemon Bottle',
    category: 'Metabolic',
    compoundType: 'Cosmetic',
    goals: ['Weight Management', 'Beauty & Skin'],
    systems: ['TRU KLOW'],
    image: '/catalog/vial-cosmetic.png',
    blurb:
      'A lipolytic solution researched in the context of localized fat metabolism.',
    variants: [{ catNo: '柠檬水', spec: '10ml × 10 vials' }],
  },

  {
    slug: 'bpc-157',
    name: 'BPC-157',
    category: 'Recovery',
    compoundType: 'Healing & Repair',
    goals: ['Recovery', 'Performance'],
    systems: ['TRU RECOVER'],
    image: '/catalog/vial-repair.png',
    blurb:
      'A body-protection compound studied extensively for tissue repair, gut integrity, and recovery.',
    variants: [
      { catNo: 'BC5', spec: '5mg × 10 vials' },
      { catNo: 'BC10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'bpc-tb500-blend',
    name: 'BPC-157 + TB-500 Blend',
    category: 'Recovery',
    compoundType: 'Healing & Repair',
    goals: ['Recovery', 'Performance'],
    systems: ['TRU RECOVER'],
    image: '/catalog/vial-repair.png',
    blurb:
      'A combined healing blend researched for synergistic tissue repair and recovery support.',
    isNew: true,
    variants: [
      { catNo: 'BB10', spec: 'BPC 5mg + TB 5mg × 10 vials' },
      { catNo: 'BB20', spec: 'BPC 10mg + TB 10mg × 10 vials' },
    ],
  },
  {
    slug: 'tb-500',
    name: 'TB-500',
    category: 'Recovery',
    compoundType: 'Healing & Repair',
    goals: ['Recovery', 'Performance'],
    systems: ['TRU RECOVER'],
    image: '/catalog/vial-repair.png',
    blurb:
      'A synthetic fragment of thymosin beta-4 studied for cellular migration, flexibility, and tissue repair.',
    variants: [
      { catNo: 'BT5', spec: '5mg × 10 vials' },
      { catNo: 'BT10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'kpv',
    name: 'KPV',
    category: 'Recovery',
    compoundType: 'Healing & Repair',
    goals: ['Recovery', 'Immune Support'],
    systems: ['TRU RECOVER', 'TRU DEFENSE'],
    image: '/catalog/vial-repair.png',
    blurb:
      'A tripeptide fragment of alpha-MSH studied for its anti-inflammatory and repair-supporting properties.',
    variants: [
      { catNo: 'KPV5', spec: '5mg × 10 vials' },
      { catNo: 'KPV10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'igf-1-lr3',
    name: 'IGF-1 LR3',
    category: 'Performance',
    compoundType: 'Growth Factor',
    goals: ['Performance', 'Recovery'],
    systems: ['TRU PERFORM', 'TRU RECOVER'],
    image: '/catalog/vial-growth.png',
    blurb:
      'A long-acting insulin-like growth factor analog studied for cellular growth and recovery signaling.',
    variants: [{ catNo: 'IG1-1', spec: '1mg × 10 vials' }],
  },

  {
    slug: 'cjc-1295-dac',
    name: 'CJC-1295 with DAC',
    category: 'Performance',
    compoundType: 'Growth Hormone Secretagogue',
    goals: ['Performance', 'Recovery', 'Healthy Aging'],
    systems: ['TRU PERFORM'],
    image: '/catalog/vial-growth.png',
    blurb:
      'A GHRH analog with drug affinity complex studied for sustained growth hormone signaling.',
    variants: [
      { catNo: 'CD5', spec: '5mg × 10 vials' },
      { catNo: 'CD10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'cjc-1295-no-dac',
    name: 'CJC-1295 (without DAC)',
    category: 'Performance',
    compoundType: 'Growth Hormone Secretagogue',
    goals: ['Performance', 'Recovery'],
    systems: ['TRU PERFORM'],
    image: '/catalog/vial-growth.png',
    blurb:
      'A modified GHRH peptide (Mod GRF 1-29) researched for pulsatile growth hormone release.',
    variants: [
      { catNo: 'CND5', spec: '5mg × 10 vials' },
      { catNo: 'CND10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'cjc-ipamorelin-blend',
    name: 'CJC-1295 + Ipamorelin Blend',
    category: 'Performance',
    compoundType: 'Growth Hormone Secretagogue',
    goals: ['Performance', 'Recovery'],
    systems: ['TRU PERFORM'],
    image: '/catalog/vial-growth.png',
    blurb:
      'A synergistic GHRH + GHRP blend studied for amplified growth hormone signaling.',
    variants: [
      { catNo: 'CP10', spec: 'CJC 5mg + IPA 5mg × 10 vials' },
    ],
  },
  {
    slug: 'ipamorelin',
    name: 'Ipamorelin',
    category: 'Performance',
    compoundType: 'Growth Hormone Secretagogue',
    goals: ['Performance', 'Recovery'],
    systems: ['TRU PERFORM'],
    image: '/catalog/vial-growth.png',
    blurb:
      'A selective growth hormone secretagogue studied for its clean GH release profile.',
    variants: [
      { catNo: 'IP5', spec: '5mg × 10 vials' },
      { catNo: 'IP10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'sermorelin',
    name: 'Sermorelin Acetate',
    category: 'Performance',
    compoundType: 'Growth Hormone Secretagogue',
    goals: ['Performance', 'Healthy Aging', 'Recovery'],
    systems: ['TRU PERFORM'],
    image: '/catalog/vial-growth.png',
    blurb:
      'A GHRH analog studied for stimulating natural growth hormone production.',
    variants: [
      { catNo: 'SMO5', spec: '5mg × 10 vials' },
      { catNo: 'SMO10', spec: '10mg × 10 vials' },
    ],
  },

  {
    slug: 'epithalon',
    name: 'Epithalon',
    category: 'Longevity',
    compoundType: 'Longevity',
    goals: ['Longevity', 'Healthy Aging'],
    systems: ['TRU LONGEVITY'],
    image: '/catalog/vial-longevity.png',
    blurb:
      'A tetrapeptide studied for its influence on telomerase activity and cellular aging.',
    variants: [
      { catNo: 'ET10', spec: '10mg × 10 vials' },
      { catNo: 'ET50', spec: '50mg × 10 vials' },
    ],
  },
  {
    slug: 'nad-plus',
    name: 'NAD+',
    category: 'Longevity',
    compoundType: 'Longevity',
    goals: ['Longevity', 'Energy', 'Healthy Aging'],
    systems: ['TRU LONGEVITY', 'TRU VITAL'],
    image: '/catalog/vial-longevity.png',
    blurb:
      'A coenzyme central to cellular energy production and DNA repair, studied for healthy aging.',
    variants: [
      { catNo: 'NJ100', spec: '100mg × 10 vials' },
      { catNo: 'NJ500', spec: '500mg × 10 vials' },
      { catNo: 'NJ1000', spec: '1000mg × 10 vials' },
    ],
  },
  {
    slug: 'ss-31',
    name: 'SS-31 (Elamipretide)',
    category: 'Longevity',
    compoundType: 'Longevity',
    goals: ['Longevity', 'Healthy Aging', 'Energy'],
    systems: ['TRU LONGEVITY'],
    image: '/catalog/vial-longevity.png',
    blurb:
      'A mitochondria-targeting peptide studied for protecting and optimizing cellular energy machinery.',
    variants: [
      { catNo: '2S10', spec: '10mg × 10 vials' },
      { catNo: '2S50', spec: '50mg × 10 vials' },
    ],
  },
  {
    slug: 'foxo4-dri',
    name: 'FOXO4-DRI',
    category: 'Longevity',
    compoundType: 'Longevity',
    goals: ['Longevity', 'Healthy Aging'],
    systems: ['TRU LONGEVITY'],
    image: '/catalog/vial-longevity.png',
    blurb:
      'A senolytic peptide researched for its role in clearing senescent cells.',
    variants: [{ catNo: 'Fox10', spec: '10mg × 10 vials' }],
  },
  {
    slug: 'glutathione',
    name: 'Glutathione',
    category: 'Longevity',
    compoundType: 'Antioxidant',
    goals: ['Longevity', 'Beauty & Skin', 'Immune Support'],
    systems: ['TRU LONGEVITY', 'TRU GLOW'],
    image: '/catalog/vial-longevity.png',
    blurb:
      'The body\u2019s master antioxidant, studied for detoxification, skin brightness, and cellular protection.',
    variants: [
      { catNo: 'GTT600', spec: '600mg × 10 vials' },
      { catNo: 'GTT1500', spec: '1500mg × 10 vials' },
    ],
  },

  {
    slug: 'ghk-cu',
    name: 'GHK-Cu',
    category: 'Beauty & Skin',
    compoundType: 'Cosmetic',
    goals: ['Beauty & Skin', 'Healthy Aging'],
    systems: ['TRU GLOW'],
    image: '/catalog/vial-cosmetic.png',
    blurb:
      'A copper tripeptide studied for skin remodeling, collagen support, and regeneration.',
    variants: [
      { catNo: 'CU50', spec: '50mg × 10 vials' },
      { catNo: 'CU100', spec: '100mg × 10 vials' },
    ],
  },
  {
    slug: 'ahk-cu',
    name: 'AHK-Cu',
    category: 'Beauty & Skin',
    compoundType: 'Cosmetic',
    goals: ['Beauty & Skin'],
    systems: ['TRU GLOW'],
    image: '/catalog/vial-cosmetic.png',
    blurb:
      'A copper peptide studied for hair follicle support and scalp health.',
    variants: [
      { catNo: 'AU50', spec: '50mg × 10 vials' },
      { catNo: 'AU100', spec: '100mg × 10 vials' },
    ],
  },
  {
    slug: 'glow-blend',
    name: 'GLOW',
    category: 'Beauty & Skin',
    compoundType: 'Cosmetic',
    goals: ['Beauty & Skin', 'Recovery'],
    systems: ['TRU GLOW'],
    image: '/catalog/vial-cosmetic.png',
    blurb:
      'A signature beauty blend combining repair and regeneration peptides for skin radiance.',
    isNew: true,
    variants: [{ catNo: 'GLOW', spec: '70mg × 10 vials' }],
  },
  {
    slug: 'klow-blend',
    name: 'KLOW',
    category: 'Beauty & Skin',
    compoundType: 'Cosmetic',
    goals: ['Beauty & Skin', 'Recovery'],
    systems: ['TRU KLOW', 'TRU GLOW'],
    image: '/catalog/vial-cosmetic.png',
    blurb:
      'A premium blend formulated for skin, recovery, and regenerative support.',
    isNew: true,
    variants: [{ catNo: 'KLOW', spec: '80mg × 10 vials' }],
  },
  {
    slug: 'snap-8',
    name: 'Snap-8',
    category: 'Beauty & Skin',
    compoundType: 'Cosmetic',
    goals: ['Beauty & Skin'],
    systems: ['TRU GLOW'],
    image: '/catalog/vial-cosmetic.png',
    blurb:
      'An octapeptide studied topically for the appearance of expression lines.',
    variants: [{ catNo: 'snap810', spec: '10mg × 10 vials' }],
  },
  {
    slug: 'melanotan-2',
    name: 'Melanotan II',
    category: 'Beauty & Skin',
    compoundType: 'Cosmetic',
    goals: ['Beauty & Skin', 'Sexual Wellness'],
    systems: ['TRU GLOW'],
    image: '/catalog/vial-cosmetic.png',
    blurb:
      'A melanocortin analog studied for its effects on pigmentation and libido.',
    variants: [{ catNo: 'MT2', spec: '10mg × 10 vials' }],
  },

  {
    slug: 'selank',
    name: 'Selank',
    category: 'Cognitive Performance',
    compoundType: 'Nootropic',
    goals: ['Cognitive Performance', 'Sleep & Stress'],
    systems: ['TRU FOCUS', 'TRU REST'],
    image: '/catalog/vial-nootropic.png',
    blurb:
      'An anxiolytic peptide studied for calm focus, stress resilience, and cognitive support.',
    variants: [
      { catNo: 'SK5', spec: '5mg × 10 vials' },
      { catNo: 'SK10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'semax',
    name: 'Semax',
    category: 'Cognitive Performance',
    compoundType: 'Nootropic',
    goals: ['Cognitive Performance'],
    systems: ['TRU FOCUS'],
    image: '/catalog/vial-nootropic.png',
    blurb:
      'A neuropeptide studied for focus, memory, and neuroprotective signaling.',
    variants: [
      { catNo: 'SX5', spec: '5mg × 10 vials' },
      { catNo: 'SX10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'dsip',
    name: 'DSIP',
    category: 'Sleep & Stress',
    compoundType: 'Nootropic',
    goals: ['Sleep & Stress'],
    systems: ['TRU REST'],
    image: '/catalog/vial-nootropic.png',
    blurb:
      'Delta sleep-inducing peptide, studied for its influence on sleep architecture and stress.',
    variants: [
      { catNo: 'DS5', spec: '5mg × 10 vials' },
      { catNo: 'DS10', spec: '10mg × 10 vials' },
    ],
  },

  {
    slug: 'pt-141',
    name: 'PT-141 (Bremelanotide)',
    category: 'Sexual Wellness',
    compoundType: 'Hormonal & Sexual',
    goals: ['Sexual Wellness'],
    systems: ['TRU VITAL'],
    image: '/catalog/vial-hormonal.png',
    blurb:
      'A melanocortin receptor agonist studied for libido and sexual response.',
    variants: [{ catNo: 'P41', spec: '10mg × 10 vials' }],
  },
  {
    slug: 'kisspeptin-10',
    name: 'Kisspeptin-10',
    category: 'Hormonal Optimization',
    compoundType: 'Hormonal & Sexual',
    goals: ['Hormonal Optimization', 'Sexual Wellness'],
    systems: ['TRU VITAL'],
    image: '/catalog/vial-hormonal.png',
    blurb:
      'A hypothalamic peptide studied for its role in reproductive hormone signaling.',
    variants: [
      { catNo: 'KS5', spec: '5mg × 10 vials' },
      { catNo: 'KS10', spec: '10mg × 10 vials' },
    ],
  },

  {
    slug: 'thymosin-alpha-1',
    name: 'Thymosin Alpha-1',
    category: 'Immune Support',
    compoundType: 'Immune',
    goals: ['Immune Support', 'Healthy Aging'],
    systems: ['TRU DEFENSE'],
    image: '/catalog/vial-immune.png',
    blurb:
      'A thymic peptide studied for immune modulation and defense signaling.',
    variants: [
      { catNo: 'TA5', spec: '5mg × 10 vials' },
      { catNo: 'TA10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'thymalin',
    name: 'Thymalin / Thymulin',
    category: 'Immune Support',
    compoundType: 'Immune',
    goals: ['Immune Support', 'Longevity'],
    systems: ['TRU DEFENSE'],
    image: '/catalog/vial-immune.png',
    blurb:
      'A thymic peptide complex studied for immune restoration and healthy aging.',
    variants: [{ catNo: 'TY10', spec: '10mg × 10 vials' }],
  },
  {
    slug: 'vip',
    name: 'VIP',
    category: 'Immune Support',
    compoundType: 'Immune',
    goals: ['Immune Support', 'Cognitive Performance'],
    systems: ['TRU DEFENSE'],
    image: '/catalog/vial-immune.png',
    blurb:
      'Vasoactive intestinal peptide, studied for immune balance and inflammatory signaling.',
    variants: [
      { catNo: 'VP5', spec: '5mg × 10 vials' },
      { catNo: 'VP10', spec: '10mg × 10 vials' },
    ],
  },
  {
    slug: 'b12',
    name: 'Vitamin B12',
    category: 'Energy',
    compoundType: 'Metabolic',
    goals: ['Energy'],
    systems: ['TRU VITAL'],
    image: '/catalog/vial-metabolic.png',
    blurb:
      'An essential cofactor studied for energy metabolism and neurological support.',
    variants: [{ catNo: 'B12', spec: '10ml × 10 vials' }],
  },

  {
    slug: 'bacteriostatic-water',
    name: 'Bacteriostatic Water',
    category: 'Accessory',
    compoundType: 'Accessory',
    goals: [],
    systems: [],
    image: '/catalog/vial-accessory.png',
    blurb:
      'Sterile bacteriostatic water for reconstitution of lyophilized research compounds.',
    variants: [
      { catNo: 'BAC3', spec: '3ml × 10 vials' },
      { catNo: 'BAC10', spec: '10ml × 10 vials' },
    ],
  },
]

export const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()
export const COMPOUND_TYPES = Array.from(new Set(PRODUCTS.map((p) => p.compoundType))).sort()
export const GOAL_OPTIONS = Array.from(new Set(PRODUCTS.flatMap((p) => p.goals))).sort()
export const SYSTEM_OPTIONS = Array.from(new Set(PRODUCTS.flatMap((p) => p.systems))).sort()

// Customer-facing per-vial dose, parsed from the spec
// (e.g. "5mg × 10 vials" -> "5mg", "3ml × 10 vials" -> "3ml").
export function vialDose(spec: string): string {
  const m = spec.match(/^\s*([\d.]+\s*m[gl])/i)
  if (m) return m[1].replace(/\s+/g, '')
  return spec.split('×')[0].trim()
}

// Customer-facing single-vial label (e.g. "5mg vial"). No box language.
export function vialLabel(spec: string): string {
  return `${vialDose(spec)} vial`
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

// Related = same category (excluding self), topped up with products that share a goal or system.
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const scored = PRODUCTS.filter((p) => p.slug !== product.slug)
    .map((p) => {
      let score = 0
      if (p.category === product.category) score += 3
      score += p.goals.filter((g) => product.goals.includes(g)).length
      score += p.systems.filter((s) => product.systems.includes(s)).length
      return { p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((x) => x.p)
}
