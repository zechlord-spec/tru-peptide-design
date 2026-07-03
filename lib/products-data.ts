export type ProductVariant = {
  catNo: string
  spec: string
  price: number
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
      { catNo: 'RT5', spec: '5mg × 10 vials', price: 74 },
      { catNo: 'RT10', spec: '10mg × 10 vials', price: 117 },
      { catNo: 'RT15', spec: '15mg × 10 vials', price: 157 },
      { catNo: 'RT20', spec: '20mg × 10 vials', price: 171 },
      { catNo: 'RT30', spec: '30mg × 10 vials', price: 213 },
      { catNo: 'RT40', spec: '40mg × 10 vials', price: 260 },
      { catNo: 'RT50', spec: '50mg × 10 vials', price: 340 },
      { catNo: 'RT60', spec: '60mg × 10 vials', price: 471 },
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
      { catNo: 'TR5', spec: '5mg × 10 vials', price: 51 },
      { catNo: 'TR10', spec: '10mg × 10 vials', price: 71 },
      { catNo: 'TR15', spec: '15mg × 10 vials', price: 83 },
      { catNo: 'TR20', spec: '20mg × 10 vials', price: 109 },
      { catNo: 'TR30', spec: '30mg × 10 vials', price: 143 },
      { catNo: 'TR40', spec: '40mg × 10 vials', price: 183 },
      { catNo: 'TR50', spec: '50mg × 10 vials', price: 217 },
      { catNo: 'TR60', spec: '60mg × 10 vials', price: 251 },
      { catNo: 'TR80', spec: '80mg × 10 vials', price: 371 },
      { catNo: 'TR100', spec: '100mg × 10 vials', price: 390 },
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
      { catNo: 'SM10', spec: '10mg × 10 vials', price: 57 },
      { catNo: 'SM20', spec: '20mg × 10 vials', price: 86 },
      { catNo: 'SM30', spec: '30mg × 10 vials', price: 137 },
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
      { catNo: 'CGL5', spec: '5mg × 10 vials', price: 143 },
      { catNo: 'CGL10', spec: '10mg × 10 vials', price: 240 },
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
      { catNo: 'MS10', spec: '10mg × 10 vials', price: 86 },
      { catNo: 'MS15', spec: '15mg × 10 vials', price: 129 },
      { catNo: 'MS20', spec: '20mg × 10 vials', price: 149 },
      { catNo: 'MS40', spec: '40mg × 10 vials', price: 277 },
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
      { catNo: '5AM', spec: '5mg × 10 vials', price: 31 },
      { catNo: '10AM', spec: '10mg × 10 vials', price: 37 },
      { catNo: '50AM', spec: '50mg × 10 vials', price: 110 },
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
      { catNo: 'TSM5', spec: '5mg × 10 vials', price: 117 },
      { catNo: 'TSM10', spec: '10mg × 10 vials', price: 214 },
      { catNo: 'TSM20', spec: '20mg × 10 vials', price: 371 },
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
    variants: [{ catNo: 'LC1200', spec: '1200mg × 10 vials', price: 69 }],
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
    variants: [{ catNo: 'Lipo-c', spec: '10ml × 10 vials', price: 67 }],
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
    variants: [{ catNo: 'MIC', spec: '10ml × 10 vials', price: 120 }],
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
    variants: [{ catNo: '柠檬水', spec: '10ml × 10 vials', price: 67 }],
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
      { catNo: 'BC5', spec: '5mg × 10 vials', price: 46 },
      { catNo: 'BC10', spec: '10mg × 10 vials', price: 60 },
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
      { catNo: 'BB10', spec: 'BPC 5mg + TB 5mg × 10 vials', price: 109 },
      { catNo: 'BB20', spec: 'BPC 10mg + TB 10mg × 10 vials', price: 200 },
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
      { catNo: 'BT5', spec: '5mg × 10 vials', price: 100 },
      { catNo: 'BT10', spec: '10mg × 10 vials', price: 171 },
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
      { catNo: 'KPV5', spec: '5mg × 10 vials', price: 47 },
      { catNo: 'KPV10', spec: '10mg × 10 vials', price: 60 },
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
    variants: [{ catNo: 'IG1-1', spec: '1mg × 10 vials', price: 229 }],
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
      { catNo: 'CD5', spec: '5mg × 10 vials', price: 194 },
      { catNo: 'CD10', spec: '10mg × 10 vials', price: 248 },
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
      { catNo: 'CND5', spec: '5mg × 10 vials', price: 81 },
      { catNo: 'CND10', spec: '10mg × 10 vials', price: 136 },
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
      { catNo: 'CP10', spec: 'CJC 5mg + IPA 5mg × 10 vials', price: 101 },
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
      { catNo: 'IP5', spec: '5mg × 10 vials', price: 47 },
      { catNo: 'IP10', spec: '10mg × 10 vials', price: 66 },
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
      { catNo: 'SMO5', spec: '5mg × 10 vials', price: 89 },
      { catNo: 'SMO10', spec: '10mg × 10 vials', price: 146 },
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
      { catNo: 'ET10', spec: '10mg × 10 vials', price: 54 },
      { catNo: 'ET50', spec: '50mg × 10 vials', price: 159 },
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
      { catNo: 'NJ100', spec: '100mg × 10 vials', price: 43 },
      { catNo: 'NJ500', spec: '500mg × 10 vials', price: 51 },
      { catNo: 'NJ1000', spec: '1000mg × 10 vials', price: 70 },
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
      { catNo: '2S10', spec: '10mg × 10 vials', price: 96 },
      { catNo: '2S50', spec: '50mg × 10 vials', price: 349 },
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
    variants: [{ catNo: 'Fox10', spec: '10mg × 10 vials', price: 634 }],
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
      { catNo: 'GTT600', spec: '600mg × 10 vials', price: 31 },
      { catNo: 'GTT1500', spec: '1500mg × 10 vials', price: 117 },
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
      { catNo: 'CU50', spec: '50mg × 10 vials', price: 34 },
      { catNo: 'CU100', spec: '100mg × 10 vials', price: 37 },
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
      { catNo: 'AU50', spec: '50mg × 10 vials', price: 60 },
      { catNo: 'AU100', spec: '100mg × 10 vials', price: 90 },
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
    variants: [{ catNo: 'GLOW', spec: '70mg × 10 vials', price: 214 }],
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
    variants: [{ catNo: 'KLOW', spec: '80mg × 10 vials', price: 280 }],
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
    variants: [{ catNo: 'snap810', spec: '10mg × 10 vials', price: 46 }],
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
    variants: [{ catNo: 'MT2', spec: '10mg × 10 vials', price: 82 }],
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
      { catNo: 'SK5', spec: '5mg × 10 vials', price: 47 },
      { catNo: 'SK10', spec: '10mg × 10 vials', price: 66 },
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
      { catNo: 'SX5', spec: '5mg × 10 vials', price: 47 },
      { catNo: 'SX10', spec: '10mg × 10 vials', price: 66 },
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
      { catNo: 'DS5', spec: '5mg × 10 vials', price: 54 },
      { catNo: 'DS10', spec: '10mg × 10 vials', price: 90 },
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
    variants: [{ catNo: 'P41', spec: '10mg × 10 vials', price: 77 }],
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
      { catNo: 'KS5', spec: '5mg × 10 vials', price: 57 },
      { catNo: 'KS10', spec: '10mg × 10 vials', price: 89 },
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
      { catNo: 'TA5', spec: '5mg × 10 vials', price: 114 },
      { catNo: 'TA10', spec: '10mg × 10 vials', price: 186 },
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
    variants: [{ catNo: 'TY10', spec: '10mg × 10 vials', price: 77 }],
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
      { catNo: 'VP5', spec: '5mg × 10 vials', price: 89 },
      { catNo: 'VP10', spec: '10mg × 10 vials', price: 149 },
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
    variants: [{ catNo: 'B12', spec: '10ml × 10 vials', price: 48 }],
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
      { catNo: 'BAC3', spec: '3ml × 10 vials', price: 19 },
      { catNo: 'BAC10', spec: '10ml × 10 vials', price: 23 },
    ],
  },
]

export const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()
export const COMPOUND_TYPES = Array.from(new Set(PRODUCTS.map((p) => p.compoundType))).sort()
export const GOAL_OPTIONS = Array.from(new Set(PRODUCTS.flatMap((p) => p.goals))).sort()
export const SYSTEM_OPTIONS = Array.from(new Set(PRODUCTS.flatMap((p) => p.systems))).sort()

export function priceRange(p: Product): string {
  const prices = p.variants.map((v) => v.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? `$${min}` : `$${min} \u2013 $${max}`
}
