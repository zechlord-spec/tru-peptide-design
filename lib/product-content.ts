import type { Product } from './products-data'

export type ResearchArea = { title: string; detail: string }
export type MechanismStep = { title: string; detail: string }
export type Reference = { authors: string; title: string; source: string; year: string }
export type Faq = { question: string; answer: string }

type TypeContent = {
  overview: (name: string) => string
  mechanism: MechanismStep[]
  researchAreas: ResearchArea[]
  references: Reference[]
}

// Whether a compound type ships as a lyophilized powder that needs reconstitution.
const LIQUID_TYPES = new Set(['Accessory'])
const PREMIXED_HINT = new Set(['Cosmetic'])

const TYPE_CONTENT: Record<string, TypeContent> = {
  'GLP-1 / Incretin': {
    overview: (name) =>
      `${name} belongs to the incretin mimetic class of research peptides, studied for its influence on the gut–brain axis that governs appetite, satiety, and glucose handling. Investigational literature has explored how sustained receptor engagement affects energy intake, gastric emptying, and metabolic set points. As a research reference material, ${name} is characterized for purity and identity so investigators can study these signaling pathways under controlled conditions.`,
    mechanism: [
      { title: 'Receptor engagement', detail: 'Binds incretin receptors (GLP-1 and, for dual/triple agonists, GIP and glucagon) expressed in the pancreas, gut, and central nervous system.' },
      { title: 'Satiety signaling', detail: 'Modulates hypothalamic appetite circuits, studied for reductions in food intake and prolonged satiety.' },
      { title: 'Glucose-dependent response', detail: 'Investigated for glucose-dependent insulinotropic activity, slowing gastric emptying and blunting post-prandial excursions.' },
      { title: 'Energy balance', detail: 'Explored for downstream effects on energy expenditure and body composition over sustained exposure.' },
    ],
    researchAreas: [
      { title: 'Appetite & satiety', detail: 'Central and peripheral regulation of hunger signaling.' },
      { title: 'Glycemic control', detail: 'Glucose-dependent insulin dynamics and insulin sensitivity.' },
      { title: 'Body composition', detail: 'Adiposity, lean mass retention, and metabolic set point.' },
      { title: 'Cardiometabolic markers', detail: 'Lipid profiles and inflammatory signaling in metabolic models.' },
    ],
    references: [
      { authors: 'Drucker DJ.', title: 'Mechanisms of action and therapeutic application of GLP-1', source: 'Cell Metabolism', year: '2018' },
      { authors: 'Nauck MA, Meier JJ.', title: 'Incretin hormones: their role in health and disease', source: 'Diabetes, Obesity and Metabolism', year: '2018' },
      { authors: 'Coskun T, et al.', title: 'Multi-receptor agonism in metabolic research', source: 'Molecular Metabolism', year: '2022' },
    ],
  },
  Metabolic: {
    overview: (name) =>
      `${name} is studied within cellular energy metabolism, where research focuses on how substrate utilization, mitochondrial function, and lipid handling shape body composition and vitality. Investigators use ${name} as a characterized reference material to probe metabolic signaling pathways and their role in energy production.`,
    mechanism: [
      { title: 'Metabolic signaling', detail: 'Interacts with pathways governing substrate selection between glucose and fatty acids.' },
      { title: 'Mitochondrial support', detail: 'Studied for influence on mitochondrial biogenesis and oxidative capacity.' },
      { title: 'Lipid handling', detail: 'Explored for roles in fatty-acid transport and lipolysis within adipose models.' },
      { title: 'Energy homeostasis', detail: 'Investigated for effects on cellular ATP production and systemic energy balance.' },
    ],
    researchAreas: [
      { title: 'Energy expenditure', detail: 'Cellular respiration and metabolic rate.' },
      { title: 'Fat metabolism', detail: 'Lipolysis, beta-oxidation, and adipose signaling.' },
      { title: 'Insulin sensitivity', detail: 'Glucose uptake and metabolic flexibility.' },
      { title: 'Exercise capacity', detail: 'Substrate utilization during physical stress.' },
    ],
    references: [
      { authors: 'Lee C, et al.', title: 'Mitochondrial-derived peptides in metabolic regulation', source: 'Cell Metabolism', year: '2015' },
      { authors: 'Kraus WE, et al.', title: 'Metabolic adaptation and energy balance', source: 'Nature Reviews Endocrinology', year: '2019' },
      { authors: 'Egan B, Zierath JR.', title: 'Exercise metabolism and molecular regulation', source: 'Cell Metabolism', year: '2013' },
    ],
  },
  'Growth Hormone Secretagogue': {
    overview: (name) =>
      `${name} is a secretagogue studied for its ability to stimulate the body\u2019s own growth hormone axis rather than introducing exogenous hormone. Research explores how pulsatile GH release influences recovery, body composition, and tissue maintenance. ${name} is supplied as a characterized reference material for controlled investigation of the GH/IGF-1 pathway.`,
    mechanism: [
      { title: 'GHRH / GHRP activity', detail: 'Engages growth-hormone-releasing hormone or ghrelin receptors on the pituitary.' },
      { title: 'Pulsatile release', detail: 'Studied for stimulating endogenous, pulsatile growth hormone secretion.' },
      { title: 'IGF-1 axis', detail: 'Downstream elevation of IGF-1 explored for tissue and recovery signaling.' },
      { title: 'Feedback preservation', detail: 'Investigated for maintaining physiological feedback loops of the GH axis.' },
    ],
    researchAreas: [
      { title: 'Body composition', detail: 'Lean mass, adiposity, and recovery.' },
      { title: 'Sleep architecture', detail: 'Deep sleep and nocturnal GH pulses.' },
      { title: 'Tissue repair', detail: 'Collagen turnover and connective tissue.' },
      { title: 'Healthy aging', detail: 'Age-related decline of the GH/IGF-1 axis.' },
    ],
    references: [
      { authors: 'Sigalos JT, Pastuszak AW.', title: 'The safety and efficacy of growth hormone secretagogues', source: 'Sexual Medicine Reviews', year: '2018' },
      { authors: 'Teichman SL, et al.', title: 'Prolonged stimulation of GH and IGF-1 secretion', source: 'JCEM', year: '2006' },
      { authors: 'Walker RF.', title: 'Sermorelin: a synthetic GHRH analog', source: 'Clinical Interventions in Aging', year: '2006' },
    ],
  },
  'Healing & Repair': {
    overview: (name) =>
      `${name} is studied within tissue repair and regenerative research, where investigators examine its role in angiogenesis, cellular migration, and modulation of the healing cascade. As a characterized reference material, ${name} supports controlled study of how signaling peptides influence recovery of soft tissue, gut lining, and connective structures.`,
    mechanism: [
      { title: 'Angiogenesis', detail: 'Studied for promoting new blood-vessel formation at sites of tissue stress.' },
      { title: 'Cell migration', detail: 'Explored for guiding fibroblast and endothelial migration during repair.' },
      { title: 'Growth factor modulation', detail: 'Investigated for upregulating repair-associated growth factor expression.' },
      { title: 'Inflammatory balance', detail: 'Studied for tempering excessive inflammatory signaling during healing.' },
    ],
    researchAreas: [
      { title: 'Soft-tissue repair', detail: 'Tendon, ligament, and muscle recovery.' },
      { title: 'Gut integrity', detail: 'Mucosal protection and barrier function.' },
      { title: 'Angiogenesis', detail: 'Vascular formation and perfusion.' },
      { title: 'Inflammation', detail: 'Cytokine modulation in injury models.' },
    ],
    references: [
      { authors: 'Sikiric P, et al.', title: 'Stable gastric pentadecapeptide BPC 157 and tissue healing', source: 'Current Pharmaceutical Design', year: '2018' },
      { authors: 'Goldstein AL, et al.', title: 'Thymosin beta-4 in tissue repair and regeneration', source: 'Annals NY Academy of Sciences', year: '2012' },
      { authors: 'Chang CH, et al.', title: 'Peptides and cellular migration in repair', source: 'Journal of Applied Physiology', year: '2011' },
    ],
  },
  'Growth Factor': {
    overview: (name) =>
      `${name} is a growth-factor analog studied for its role in cellular proliferation, differentiation, and recovery signaling. Research explores how sustained growth-factor activity shapes muscle, connective tissue, and metabolic response. ${name} is provided as a characterized reference material for controlled laboratory investigation.`,
    mechanism: [
      { title: 'Receptor binding', detail: 'Engages growth-factor receptors that trigger proliferative signaling cascades.' },
      { title: 'Extended half-life', detail: 'Modifications studied for prolonging systemic activity versus native factors.' },
      { title: 'Anabolic signaling', detail: 'Explored for activation of mTOR and protein-synthesis pathways.' },
      { title: 'Tissue growth', detail: 'Investigated for effects on cellular hyperplasia and recovery.' },
    ],
    researchAreas: [
      { title: 'Muscle growth', detail: 'Hyperplasia and protein synthesis.' },
      { title: 'Recovery', detail: 'Post-stress tissue regeneration.' },
      { title: 'Metabolic effects', detail: 'Glucose uptake and nutrient partitioning.' },
      { title: 'Neuroprotection', detail: 'Growth-factor signaling in neural tissue.' },
    ],
    references: [
      { authors: 'Philippou A, et al.', title: 'IGF-1 isoforms and muscle regeneration', source: 'In Vivo', year: '2007' },
      { authors: 'Adams GR.', title: 'Insulin-like growth factor in muscle physiology', source: 'Journal of Applied Physiology', year: '2002' },
      { authors: 'Clemmons DR.', title: 'Metabolic actions of IGF-1', source: 'Endocrinology & Metabolism Clinics', year: '2012' },
    ],
  },
  Longevity: {
    overview: (name) =>
      `${name} is studied within longevity and cellular-aging research, where investigators examine telomere biology, mitochondrial integrity, and the clearance of senescent cells. As a characterized reference material, ${name} supports controlled study of the molecular hallmarks of aging.`,
    mechanism: [
      { title: 'Cellular protection', detail: 'Studied for shielding cellular machinery from oxidative and age-related stress.' },
      { title: 'Telomere / mitochondria', detail: 'Explored for influence on telomerase activity or mitochondrial function.' },
      { title: 'Senescence signaling', detail: 'Investigated for modulating senescent-cell pathways.' },
      { title: 'DNA & repair', detail: 'Studied for supporting DNA repair and cellular resilience.' },
    ],
    researchAreas: [
      { title: 'Cellular aging', detail: 'Senescence and telomere maintenance.' },
      { title: 'Mitochondrial health', detail: 'Energy production and oxidative balance.' },
      { title: 'DNA repair', detail: 'Genomic stability over time.' },
      { title: 'Healthspan', detail: 'Systemic markers of biological aging.' },
    ],
    references: [
      { authors: 'López-Otín C, et al.', title: 'The hallmarks of aging', source: 'Cell', year: '2013' },
      { authors: 'Khavinson VK, et al.', title: 'Peptide regulation of aging', source: 'Biogerontology', year: '2011' },
      { authors: 'Szeto HH.', title: 'Mitochondria-targeted peptides', source: 'British Journal of Pharmacology', year: '2014' },
    ],
  },
  Antioxidant: {
    overview: (name) =>
      `${name} is studied for its antioxidant and detoxification roles, where research examines redox balance, cellular protection, and downstream effects on skin, immunity, and healthy aging. ${name} is characterized for identity and purity to support controlled laboratory study.`,
    mechanism: [
      { title: 'Free-radical scavenging', detail: 'Neutralizes reactive oxygen species that drive oxidative stress.' },
      { title: 'Redox regulation', detail: 'Studied for maintaining cellular glutathione and redox homeostasis.' },
      { title: 'Detoxification', detail: 'Explored for conjugating and clearing reactive compounds.' },
      { title: 'Cytoprotection', detail: 'Investigated for shielding cells from oxidative damage.' },
    ],
    researchAreas: [
      { title: 'Oxidative stress', detail: 'Reactive oxygen species and cellular damage.' },
      { title: 'Skin brightness', detail: 'Melanin pathways and dermal clarity.' },
      { title: 'Detox pathways', detail: 'Hepatic and cellular clearance.' },
      { title: 'Immune balance', detail: 'Redox status and immune signaling.' },
    ],
    references: [
      { authors: 'Pizzorno J.', title: 'Glutathione! The master antioxidant', source: 'Integrative Medicine', year: '2014' },
      { authors: 'Wu G, et al.', title: 'Glutathione metabolism and its implications', source: 'Journal of Nutrition', year: '2004' },
      { authors: 'Sonthalia S, et al.', title: 'Glutathione in dermatology', source: 'Indian Journal of Dermatology', year: '2016' },
    ],
  },
  Nootropic: {
    overview: (name) =>
      `${name} is studied within cognitive and neurological research, where investigators examine neuroplasticity, neurotransmitter modulation, and stress resilience. As a characterized reference material, ${name} supports controlled study of focus, memory, and neuroprotective signaling.`,
    mechanism: [
      { title: 'Neuromodulation', detail: 'Interacts with neurotransmitter and neuropeptide systems governing mood and focus.' },
      { title: 'BDNF signaling', detail: 'Studied for influence on brain-derived neurotrophic factor and plasticity.' },
      { title: 'Stress buffering', detail: 'Explored for modulating the stress response and anxiety circuits.' },
      { title: 'Neuroprotection', detail: 'Investigated for protective effects on neural tissue.' },
    ],
    researchAreas: [
      { title: 'Focus & memory', detail: 'Attention, recall, and learning.' },
      { title: 'Neuroplasticity', detail: 'Synaptic remodeling and BDNF.' },
      { title: 'Stress resilience', detail: 'Anxiolytic and adaptogenic signaling.' },
      { title: 'Neuroprotection', detail: 'Cellular defense in neural models.' },
    ],
    references: [
      { authors: 'Klusa V, et al.', title: 'Neuropeptides and cognitive function', source: 'Neuroscience Letters', year: '2010' },
      { authors: 'Kaplan AY, et al.', title: 'Semax and cognitive performance', source: 'Neuroscience & Behavioral Physiology', year: '2011' },
      { authors: 'Zozulia AA, et al.', title: 'Selank in anxiety research', source: 'Zhurnal Nevrologii', year: '2008' },
    ],
  },
  'Hormonal & Sexual': {
    overview: (name) =>
      `${name} is studied within hormonal and sexual-wellness research, where investigators examine melanocortin and reproductive-hormone signaling in the central nervous system. As a characterized reference material, ${name} supports controlled study of libido, arousal, and endocrine rhythm.`,
    mechanism: [
      { title: 'Central signaling', detail: 'Acts on melanocortin or hypothalamic receptors that govern arousal and hormone release.' },
      { title: 'Neuroendocrine axis', detail: 'Studied for influence on the reproductive hormone cascade.' },
      { title: 'Vasoactive response', detail: 'Explored for downstream effects on desire and physiological response.' },
      { title: 'Rhythm modulation', detail: 'Investigated for pulsatile signaling of the endocrine system.' },
    ],
    researchAreas: [
      { title: 'Libido & arousal', detail: 'Central desire and response pathways.' },
      { title: 'Hormone signaling', detail: 'LH/FSH and reproductive rhythm.' },
      { title: 'Endocrine balance', detail: 'Hypothalamic-pituitary axis.' },
      { title: 'Mood & bonding', detail: 'Neuropeptide effects on affect.' },
    ],
    references: [
      { authors: 'Molinoff PB, et al.', title: 'PT-141 and sexual function research', source: 'Annals NY Academy of Sciences', year: '2003' },
      { authors: 'Skorupskaite K, et al.', title: 'Kisspeptin and reproductive hormone regulation', source: 'Human Reproduction Update', year: '2014' },
      { authors: 'Pfaus JG.', title: 'Neurobiology of sexual desire', source: 'Journal of Sexual Medicine', year: '2009' },
    ],
  },
  Immune: {
    overview: (name) =>
      `${name} is studied within immunology, where investigators examine thymic function, immune modulation, and the balance between defense and inflammation. As a characterized reference material, ${name} supports controlled study of immune resilience and signaling.`,
    mechanism: [
      { title: 'Immune modulation', detail: 'Studied for balancing T-cell populations and immune signaling.' },
      { title: 'Thymic support', detail: 'Explored for restoring thymic activity and maturation of immune cells.' },
      { title: 'Cytokine balance', detail: 'Investigated for tempering pro- and anti-inflammatory cytokines.' },
      { title: 'Host defense', detail: 'Studied for supporting innate and adaptive immune responses.' },
    ],
    researchAreas: [
      { title: 'Immune resilience', detail: 'Defense against pathogens and stress.' },
      { title: 'Thymic function', detail: 'T-cell maturation and aging.' },
      { title: 'Inflammation', detail: 'Cytokine regulation and balance.' },
      { title: 'Recovery', detail: 'Immune support during repair.' },
    ],
    references: [
      { authors: 'Goldstein AL, et al.', title: 'Thymosin alpha-1 and immune modulation', source: 'Expert Opinion on Biological Therapy', year: '2009' },
      { authors: 'Garaci E, et al.', title: 'Thymosin alpha-1 in immune restoration', source: 'Annals NY Academy of Sciences', year: '2007' },
      { authors: 'Romani L, et al.', title: 'Thymic peptides in host defense', source: 'Blood', year: '2006' },
    ],
  },
  Cosmetic: {
    overview: (name) =>
      `${name} is studied within dermatological and cosmetic research, where investigators examine collagen synthesis, skin remodeling, and pigmentation pathways. As a characterized reference material, ${name} supports controlled study of dermal structure and appearance.`,
    mechanism: [
      { title: 'Collagen stimulation', detail: 'Studied for upregulating collagen and extracellular-matrix synthesis.' },
      { title: 'Skin remodeling', detail: 'Explored for supporting dermal repair and firmness.' },
      { title: 'Antioxidant activity', detail: 'Investigated for protecting skin from oxidative stress.' },
      { title: 'Signaling precision', detail: 'Targets specific dermal pathways governing appearance.' },
    ],
    researchAreas: [
      { title: 'Collagen synthesis', detail: 'Dermal structure and firmness.' },
      { title: 'Skin repair', detail: 'Wound healing and regeneration.' },
      { title: 'Pigmentation', detail: 'Melanin and tone research.' },
      { title: 'Anti-aging', detail: 'Fine lines and elasticity.' },
    ],
    references: [
      { authors: 'Pickart L, Margolina A.', title: 'Regenerative and protective actions of GHK-Cu', source: 'International Journal of Molecular Sciences', year: '2018' },
      { authors: 'Pickart L, et al.', title: 'The human tripeptide GHK and skin remodeling', source: 'BioMed Research International', year: '2015' },
      { authors: 'Schagen SK.', title: 'Cosmetic peptides in skincare', source: 'Cosmetics', year: '2017' },
    ],
  },
  Accessory: {
    overview: (name) =>
      `${name} is a laboratory accessory used in the reconstitution and handling of lyophilized research compounds. It is characterized for sterility and consistency to support reliable preparation of research reference materials.`,
    mechanism: [
      { title: 'Diluent function', detail: 'Provides a sterile medium for dissolving lyophilized peptide powder.' },
      { title: 'Bacteriostatic action', detail: 'Contains benzyl alcohol to inhibit microbial growth across multiple draws.' },
      { title: 'Stability support', detail: 'Maintains solution integrity over a defined storage window.' },
      { title: 'Consistency', detail: 'Standardized preparation for reproducible research.' },
    ],
    researchAreas: [
      { title: 'Reconstitution', detail: 'Preparation of lyophilized compounds.' },
      { title: 'Sterility', detail: 'Contamination control in the lab.' },
      { title: 'Storage', detail: 'Solution stability over time.' },
      { title: 'Handling', detail: 'Reproducible sample preparation.' },
    ],
    references: [
      { authors: 'USP.', title: 'Bacteriostatic Water for Injection monograph', source: 'United States Pharmacopeia', year: '2020' },
      { authors: 'Meyer BK, et al.', title: 'Antimicrobial preservatives in parenteral products', source: 'Journal of Pharmaceutical Sciences', year: '2007' },
      { authors: 'Trissel LA.', title: 'Handbook on Injectable Drugs', source: 'ASHP', year: '2018' },
    ],
  },
}

const FALLBACK: TypeContent = TYPE_CONTENT.Metabolic

export function getTypeContent(product: Product): TypeContent {
  return TYPE_CONTENT[product.compoundType] ?? FALLBACK
}

export function getStorage(product: Product): { title: string; detail: string }[] {
  const isLiquid = LIQUID_TYPES.has(product.compoundType)
  if (isLiquid) {
    return [
      { title: 'Sealed vials', detail: 'Store at room temperature away from direct light until opened.' },
      { title: 'After opening', detail: 'Refrigerate at 2–8°C and use within the labeled window.' },
      { title: 'Protect from contamination', detail: 'Wipe the stopper with alcohol before each draw.' },
    ]
  }
  return [
    { title: 'Lyophilized (unopened)', detail: 'Stable at room temperature for short periods; store at -20°C for long-term stability.' },
    { title: 'After reconstitution', detail: 'Refrigerate at 2–8°C and use within 2–4 weeks depending on the compound.' },
    { title: 'Protect from light & heat', detail: 'Avoid repeated freeze–thaw cycles and prolonged light exposure.' },
    { title: 'Handling', detail: 'For laboratory research use only; handle with appropriate protective equipment.' },
  ]
}

export function getReconstitution(product: Product): { steps: string[]; note: string } | null {
  if (LIQUID_TYPES.has(product.compoundType)) return null
  if (PREMIXED_HINT.has(product.compoundType)) {
    // still lyophilized cosmetic peptides — treat like standard
  }
  return {
    steps: [
      'Allow both the peptide vial and bacteriostatic water to reach room temperature.',
      'Swab both rubber stoppers with an alcohol wipe.',
      'Draw the desired volume of bacteriostatic water into a sterile syringe.',
      'Inject the water slowly against the inside wall of the vial — never directly onto the powder.',
      'Swirl gently (do not shake) until the solution is fully clear.',
      'Label with the date and store refrigerated.',
    ],
    note: 'Reconstitution volume determines concentration. Use a peptide calculator to match your research protocol. Bacteriostatic water is sold separately as an accessory.',
  }
}

export function getFaqs(product: Product): Faq[] {
  const base: Faq[] = [
    {
      question: `What is ${product.name} used for?`,
      answer: `${product.name} is supplied strictly as a research reference material for in-vitro and laboratory study. It is characterized for purity and identity and is not intended for human consumption or therapeutic use.`,
    },
    {
      question: 'How do I verify purity?',
      answer: 'Every batch is third-party tested by HPLC and mass spectrometry. A Certificate of Analysis (COA) is available for each lot from the COA section on this page.',
    },
    {
      question: 'How is it supplied?',
      answer: `${product.name} is sold by the individual vial in ${product.variants.length} vial size${product.variants.length > 1 ? 's' : ''}. See the specifications table above for catalog numbers and per-vial pricing.`,
    },
  ]
  if (!LIQUID_TYPES.has(product.compoundType)) {
    base.push({
      question: 'How should it be reconstituted?',
      answer: 'This compound ships lyophilized. Reconstitute with bacteriostatic water following the steps in the Reconstitution section, then store refrigerated.',
    })
  }
  base.push({
    question: 'How is it shipped and stored?',
    answer: 'Compounds ship in protective packaging. Follow the storage guidance on this page — most lyophilized peptides are best kept at -20°C long-term and refrigerated after reconstitution.',
  })
  return base
}
