import type { Product } from './products-data'

export type Milestone = { year: string; event: string }
export type SafetyPoint = { title: string; detail: string }

type EduContent = {
  summary: (name: string) => string
  discovery: Milestone[]
  currentResearch: string[]
}

// Educational, compound-type-level narrative used across the Compound Library.
const EDU: Record<string, EduContent> = {
  'GLP-1 / Incretin': {
    summary: (name) =>
      `${name} is an incretin-class research peptide investigated for its role in the gut–brain signaling that regulates appetite, satiety, and glucose handling. It is among the most actively studied compounds in modern metabolic science and is supplied here strictly as a characterized reference material for laboratory investigation.`,
    discovery: [
      { year: '1980s', event: 'Glucagon-like peptide-1 (GLP-1) is identified as a product of the proglucagon gene with potent incretin activity.' },
      { year: '1990s', event: 'Researchers characterize GLP-1 receptor signaling in the pancreas, gut, and brain.' },
      { year: '2000s', event: 'Long-acting analogs are engineered to resist DPP-4 degradation and extend half-life.' },
      { year: '2010s–present', event: 'Dual and triple incretin agonists (GIP/GLP-1/glucagon) emerge as leading subjects of metabolic research.' },
    ],
    currentResearch: [
      'Comparative studies of mono-, dual-, and triple-receptor agonism on energy balance and body composition.',
      'Investigation of gastric emptying and post-prandial glucose dynamics in controlled models.',
      'Exploration of central appetite circuits and the durability of satiety signaling over sustained exposure.',
      'Emerging interest in cardiometabolic and inflammatory markers beyond weight endpoints.',
    ],
  },
  Metabolic: {
    summary: (name) =>
      `${name} is studied within cellular energy metabolism, where investigators examine substrate utilization, mitochondrial function, and lipid handling. It serves as a characterized reference material for probing how metabolic signaling shapes energy production and body composition.`,
    discovery: [
      { year: 'Early research', event: 'The compound is characterized within pathways governing cellular energy and substrate metabolism.' },
      { year: 'Expansion', event: 'Studies extend to mitochondrial biogenesis, fatty-acid oxidation, and insulin sensitivity.' },
      { year: 'Present', event: 'Interest grows in mitochondrial-derived and metabolic signaling peptides as research tools.' },
    ],
    currentResearch: [
      'Effects on mitochondrial respiration and cellular ATP production.',
      'Substrate selection between glucose and fatty acids under metabolic stress.',
      'Adipose signaling, lipolysis, and metabolic flexibility.',
      'Interactions with exercise capacity and energy expenditure.',
    ],
  },
  'Growth Hormone Secretagogue': {
    summary: (name) =>
      `${name} is a secretagogue studied for its ability to stimulate the body's own growth-hormone axis rather than introducing exogenous hormone. Research explores how pulsatile GH release influences recovery, body composition, and tissue maintenance via the GH/IGF-1 pathway.`,
    discovery: [
      { year: '1970s–80s', event: 'Growth-hormone-releasing hormone (GHRH) and its fragments are characterized.' },
      { year: '1990s', event: 'Synthetic GHRH analogs and ghrelin-mimetic secretagogues are developed.' },
      { year: '2000s', event: 'Modifications (e.g. DAC technology) are engineered to extend half-life and prolong GH stimulation.' },
      { year: 'Present', event: 'Secretagogues remain central to research on endogenous, pulsatile hormone signaling.' },
    ],
    currentResearch: [
      'Preservation of physiological, pulsatile GH secretion versus exogenous hormone.',
      'Downstream IGF-1 elevation and its role in tissue and recovery signaling.',
      'Effects on sleep architecture and nocturnal GH pulses.',
      'Body composition, lean mass, and age-related decline of the GH/IGF-1 axis.',
    ],
  },
  'Healing & Repair': {
    summary: (name) =>
      `${name} is studied within tissue repair and regenerative research, where investigators examine angiogenesis, cellular migration, and modulation of the healing cascade. It supports controlled study of soft-tissue, gut, and connective-tissue recovery.`,
    discovery: [
      { year: 'Discovery', event: 'The peptide is isolated or characterized from a protein associated with tissue protection.' },
      { year: 'Early studies', event: 'Research identifies roles in angiogenesis and cytoprotection in preclinical models.' },
      { year: 'Present', event: 'Widely studied as a reference material in soft-tissue and gastrointestinal repair research.' },
    ],
    currentResearch: [
      'Promotion of new blood-vessel formation at sites of tissue stress.',
      'Guidance of fibroblast and endothelial migration during repair.',
      'Modulation of repair-associated growth factors and inflammatory balance.',
      'Gut mucosal protection and barrier-function models.',
    ],
  },
  'Growth Factor': {
    summary: (name) =>
      `${name} is a growth-factor analog studied for its role in cellular proliferation, differentiation, and recovery signaling. Research explores how sustained growth-factor activity shapes muscle, connective tissue, and metabolic response.`,
    discovery: [
      { year: 'Discovery', event: 'The native growth factor is identified as a key regulator of cellular proliferation.' },
      { year: 'Engineering', event: 'Analogs are designed to extend half-life and receptor activity versus native factors.' },
      { year: 'Present', event: 'Used as a research reference material for proliferative and anabolic signaling studies.' },
    ],
    currentResearch: [
      'Activation of mTOR and protein-synthesis pathways.',
      'Muscle hyperplasia, recovery, and nutrient partitioning.',
      'Glucose uptake and metabolic effects of growth-factor signaling.',
      'Neuroprotective roles in neural-tissue models.',
    ],
  },
  Longevity: {
    summary: (name) =>
      `${name} is studied within longevity and cellular-aging research, where investigators examine telomere biology, mitochondrial integrity, and the clearance of senescent cells. It supports controlled study of the molecular hallmarks of aging.`,
    discovery: [
      { year: 'Early research', event: 'The peptide is characterized within studies of the pineal gland and biological rhythm.' },
      { year: 'Expansion', event: 'Research extends to telomerase activity and cellular-aging markers.' },
      { year: 'Present', event: 'Studied alongside the recognized hallmarks of aging as a research reference material.' },
    ],
    currentResearch: [
      'Influence on telomerase activity and telomere maintenance.',
      'Mitochondrial function and oxidative balance over time.',
      'Modulation of senescent-cell signaling pathways.',
      'Support of DNA repair and genomic stability.',
    ],
  },
  Antioxidant: {
    summary: (name) =>
      `${name} is studied for its antioxidant and detoxification roles, where research examines redox balance, cellular protection, and downstream effects on skin, immunity, and healthy aging.`,
    discovery: [
      { year: 'Discovery', event: 'The molecule is recognized as a central component of cellular redox defense.' },
      { year: 'Expansion', event: 'Research characterizes its role in detoxification and glutathione metabolism.' },
      { year: 'Present', event: 'Studied across dermatology, immunity, and oxidative-stress research.' },
    ],
    currentResearch: [
      'Neutralization of reactive oxygen species and oxidative stress.',
      'Maintenance of cellular glutathione and redox homeostasis.',
      'Hepatic and cellular detoxification pathways.',
      'Melanin pathways and dermal clarity research.',
    ],
  },
  Nootropic: {
    summary: (name) =>
      `${name} is studied within cognitive and neurological research, where investigators examine neuroplasticity, neurotransmitter modulation, and stress resilience. It supports controlled study of focus, memory, and neuroprotective signaling.`,
    discovery: [
      { year: 'Origins', event: 'The neuropeptide is characterized from studies of regulatory brain peptides.' },
      { year: 'Development', event: 'Analogs are studied for stability and central nervous system activity.' },
      { year: 'Present', event: 'Investigated as a research tool for cognition, mood, and neuroprotection.' },
    ],
    currentResearch: [
      'Influence on brain-derived neurotrophic factor (BDNF) and synaptic plasticity.',
      'Attention, recall, and learning in behavioral models.',
      'Anxiolytic and adaptogenic modulation of the stress response.',
      'Cellular defense in neural-injury models.',
    ],
  },
  'Hormonal & Sexual': {
    summary: (name) =>
      `${name} is studied within hormonal and sexual-wellness research, where investigators examine melanocortin and reproductive-hormone signaling in the central nervous system. It supports controlled study of libido, arousal, and endocrine rhythm.`,
    discovery: [
      { year: 'Discovery', event: 'The peptide is characterized within melanocortin or reproductive-hormone signaling.' },
      { year: 'Research', event: 'Studies map its central effects on arousal and hormone release.' },
      { year: 'Present', event: 'Used as a research reference material for neuroendocrine and desire pathways.' },
    ],
    currentResearch: [
      'Central melanocortin and hypothalamic signaling of arousal.',
      'Regulation of the reproductive hormone cascade (LH/FSH).',
      'Pulsatile signaling and endocrine rhythm.',
      'Neuropeptide effects on mood and bonding.',
    ],
  },
  Immune: {
    summary: (name) =>
      `${name} is studied within immunology, where investigators examine thymic function, immune modulation, and the balance between defense and inflammation. It supports controlled study of immune resilience and signaling.`,
    discovery: [
      { year: 'Discovery', event: 'The peptide is isolated from thymic tissue and linked to immune maturation.' },
      { year: 'Characterization', event: 'Research maps its effects on T-cell populations and cytokine balance.' },
      { year: 'Present', event: 'Studied as a reference material for immune-modulation and host-defense research.' },
    ],
    currentResearch: [
      'Balancing of T-cell populations and immune signaling.',
      'Restoration of thymic activity and immune-cell maturation.',
      'Tempering of pro- and anti-inflammatory cytokines.',
      'Support of innate and adaptive host defense.',
    ],
  },
  Cosmetic: {
    summary: (name) =>
      `${name} is studied within dermatological and cosmetic research, where investigators examine collagen synthesis, skin remodeling, and pigmentation pathways. It supports controlled study of dermal structure and appearance.`,
    discovery: [
      { year: 'Discovery', event: 'The peptide is identified for its role in skin remodeling and repair.' },
      { year: 'Research', event: 'Studies characterize collagen stimulation and antioxidant activity in dermal models.' },
      { year: 'Present', event: 'Widely studied as a reference material in cosmetic and regenerative dermatology.' },
    ],
    currentResearch: [
      'Upregulation of collagen and extracellular-matrix synthesis.',
      'Dermal repair, firmness, and wound-healing models.',
      'Pigmentation and skin-tone pathways.',
      'Protection of skin from oxidative stress.',
    ],
  },
  Accessory: {
    summary: (name) =>
      `${name} is a laboratory accessory used in the reconstitution and handling of lyophilized research compounds. It is characterized for sterility and consistency to support reliable preparation of research reference materials.`,
    discovery: [
      { year: 'Standardized', event: 'Bacteriostatic diluents are established as standard media for reconstituting lyophilized compounds.' },
      { year: 'Present', event: 'Used across research settings for reproducible, contamination-controlled preparation.' },
    ],
    currentResearch: [
      'Solubility and stability of reconstituted research compounds.',
      'Contamination control across multiple draws.',
      'Storage windows for prepared solutions.',
      'Reproducible sample preparation for research protocols.',
    ],
  },
}

const FALLBACK = EDU.Metabolic

export function getEduContent(product: Product): EduContent {
  return EDU[product.compoundType] ?? FALLBACK
}

// Safety information is intentionally consistent across the library: these are
// research reference materials, not therapeutics.
export function getSafetyInfo(product: Product): SafetyPoint[] {
  const points: SafetyPoint[] = [
    {
      title: 'Research use only',
      detail: `${product.name} is supplied strictly as a laboratory research reference material. It is not a drug, supplement, or food, and is not intended for human or veterinary use, consumption, or therapeutic application.`,
    },
    {
      title: 'Handling',
      detail: 'Handle with appropriate personal protective equipment in a controlled laboratory environment. Avoid inhalation, ingestion, and contact with skin or eyes.',
    },
    {
      title: 'Not clinically evaluated',
      detail: 'Statements describe areas of scientific investigation only. No claims of safety or efficacy in humans are made or implied, and the compound has not been evaluated by regulatory agencies for any use.',
    },
    {
      title: 'Qualified personnel',
      detail: 'Intended for use only by qualified researchers and institutions familiar with the proper handling of research reference materials.',
    },
  ]
  return points
}
