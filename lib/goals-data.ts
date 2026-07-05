// Local reference data for TRU Goals. This is the bundled data used by the
// local data source (lib/data/local) when no backend is configured. The shape
// is defined canonically in lib/data/types.ts and re-exported here for
// backward-compatible imports.
import type { Goal, GoalArticle, GoalProductRef, GoalSystemRef } from '@/lib/data/types'

export type { Goal, GoalArticle, GoalProductRef, GoalSystemRef }

export const GOALS: Goal[] = [
  {
    slug: 'weight-management',
    name: 'Weight Management',
    iconKey: 'Scale',
    tagline: 'Body composition & metabolic balance',
    summary:
      'Sustainable body composition is governed by metabolic signaling, appetite regulation, and insulin sensitivity. Research peptides in this category are studied for their roles in modulating satiety pathways, supporting lean mass retention, and optimizing how the body partitions energy.',
    systems: [
      { name: 'Metabolic System', focus: 'Body composition & energy', compounds: '2 compounds', price: '$249' },
      { name: 'Lean Recomposition System', focus: 'Fat loss & muscle retention', compounds: '3 compounds', price: '$319' },
    ],
    products: [
      { name: 'Tesamorelin', type: 'GH-releasing factor', price: '$129' },
      { name: 'AOD-9604', type: 'Metabolic fragment', price: '$99' },
      { name: 'CJC-1295 / Ipamorelin', type: 'Peptide blend', price: '$149' },
    ],
    articles: [
      { title: 'How Peptides Influence Appetite Signaling', readTime: '6 min', category: 'Mechanism' },
      { title: 'Insulin Sensitivity and Body Composition', readTime: '8 min', category: 'Research' },
      { title: 'Preserving Lean Mass During Fat Loss', readTime: '5 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'performance',
    name: 'Performance',
    iconKey: 'Zap',
    tagline: 'Strength, output & training capacity',
    summary:
      'Athletic performance depends on the interplay of muscular output, oxygen delivery, and recovery velocity. Compounds studied here target growth hormone axis stimulation, mitochondrial efficiency, and neuromuscular signaling to support training adaptation.',
    systems: [
      { name: 'Vitality System', focus: 'Longevity & performance', compounds: '4 compounds', price: '$349' },
      { name: 'Output System', focus: 'Strength & power', compounds: '3 compounds', price: '$299' },
    ],
    products: [
      { name: 'CJC-1295', type: 'GHRH analog', price: '$139' },
      { name: 'BPC-157', type: 'Recovery peptide', price: '$109' },
      { name: 'IGF-1 LR3', type: 'Growth factor', price: '$169' },
    ],
    articles: [
      { title: 'The Growth Hormone Axis in Athletes', readTime: '7 min', category: 'Mechanism' },
      { title: 'Peptides and Training Adaptation', readTime: '6 min', category: 'Research' },
      { title: 'Structuring a Performance Protocol', readTime: '5 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'recovery',
    name: 'Recovery',
    iconKey: 'HeartPulse',
    tagline: 'Tissue repair & regeneration',
    summary:
      'Recovery is where adaptation happens. This category focuses on compounds researched for accelerating soft-tissue repair, modulating inflammation, and supporting the regeneration of tendons, ligaments, and muscle following stress.',
    systems: [
      { name: 'Recovery System', focus: 'Tissue repair & sleep', compounds: '3 compounds', price: '$289' },
      { name: 'Joint & Tendon System', focus: 'Connective tissue', compounds: '2 compounds', price: '$219' },
    ],
    products: [
      { name: 'BPC-157', type: 'Recovery peptide', price: '$109' },
      { name: 'TB-500', type: 'Regenerative peptide', price: '$139' },
      { name: 'GHK-Cu', type: 'Copper peptide', price: '$89' },
    ],
    articles: [
      { title: 'The Science of Soft-Tissue Repair', readTime: '6 min', category: 'Mechanism' },
      { title: 'Inflammation Modulation and Healing', readTime: '7 min', category: 'Research' },
      { title: 'Building a Recovery Protocol', readTime: '5 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'longevity',
    name: 'Longevity',
    iconKey: 'Hourglass',
    tagline: 'Cellular health & lifespan',
    summary:
      'Longevity research centers on the hallmarks of aging — cellular senescence, mitochondrial decline, and telomere integrity. Compounds in this category are studied for supporting cellular resilience, autophagy, and systemic repair mechanisms.',
    systems: [
      { name: 'Vitality System', focus: 'Longevity & performance', compounds: '4 compounds', price: '$349' },
      { name: 'Cellular Renewal System', focus: 'Senescence & autophagy', compounds: '3 compounds', price: '$329' },
    ],
    products: [
      { name: 'Epitalon', type: 'Telomerase peptide', price: '$149' },
      { name: 'NAD+', type: 'Cellular cofactor', price: '$179' },
      { name: 'MOTS-c', type: 'Mitochondrial peptide', price: '$159' },
    ],
    articles: [
      { title: 'The Hallmarks of Aging Explained', readTime: '9 min', category: 'Mechanism' },
      { title: 'Autophagy and Cellular Cleanup', readTime: '7 min', category: 'Research' },
      { title: 'A Foundational Longevity Protocol', readTime: '6 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'cognitive-performance',
    name: 'Cognitive Performance',
    iconKey: 'Brain',
    tagline: 'Focus, memory & clarity',
    summary:
      'Cognitive function relies on neurotransmitter balance, neuroplasticity, and cerebral blood flow. This category explores compounds researched for supporting memory consolidation, focus, and neuroprotection under mental load.',
    systems: [
      { name: 'Clarity System', focus: 'Focus & neuroprotection', compounds: '3 compounds', price: '$279' },
      { name: 'Neural Support System', focus: 'Memory & plasticity', compounds: '2 compounds', price: '$229' },
    ],
    products: [
      { name: 'Semax', type: 'Nootropic peptide', price: '$119' },
      { name: 'Selank', type: 'Anxiolytic peptide', price: '$109' },
      { name: 'Dihexa', type: 'Cognitive peptide', price: '$189' },
    ],
    articles: [
      { title: 'Peptides and Neuroplasticity', readTime: '7 min', category: 'Mechanism' },
      { title: 'Supporting Memory Consolidation', readTime: '6 min', category: 'Research' },
      { title: 'A Cognitive Performance Protocol', readTime: '5 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'beauty-skin',
    name: 'Beauty & Skin',
    iconKey: 'Sparkles',
    tagline: 'Collagen, glow & skin health',
    summary:
      'Skin vitality is driven by collagen synthesis, cellular turnover, and antioxidant defense. Compounds here are studied for supporting dermal structure, wound healing, and the visible markers of healthy, resilient skin.',
    systems: [
      { name: 'Radiance System', focus: 'Collagen & glow', compounds: '2 compounds', price: '$239' },
      { name: 'Dermal Repair System', focus: 'Structure & healing', compounds: '3 compounds', price: '$289' },
    ],
    products: [
      { name: 'GHK-Cu', type: 'Copper peptide', price: '$89' },
      { name: 'BPC-157', type: 'Recovery peptide', price: '$109' },
      { name: 'Collagen Peptides', type: 'Structural support', price: '$69' },
    ],
    articles: [
      { title: 'How Copper Peptides Support Skin', readTime: '6 min', category: 'Mechanism' },
      { title: 'Collagen Synthesis and Aging Skin', readTime: '7 min', category: 'Research' },
      { title: 'A Skin Vitality Protocol', readTime: '4 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'sexual-wellness',
    name: 'Sexual Wellness',
    iconKey: 'Flame',
    tagline: 'Libido, vitality & function',
    summary:
      'Sexual wellness integrates hormonal balance, vascular health, and central nervous system signaling. This category examines compounds researched for supporting libido, arousal pathways, and overall vitality.',
    systems: [
      { name: 'Vitality System', focus: 'Longevity & performance', compounds: '4 compounds', price: '$349' },
      { name: 'Intimacy System', focus: 'Libido & function', compounds: '2 compounds', price: '$209' },
    ],
    products: [
      { name: 'PT-141', type: 'Melanocortin peptide', price: '$119' },
      { name: 'Kisspeptin', type: 'Hormonal signaler', price: '$139' },
      { name: 'Oxytocin', type: 'Neuropeptide', price: '$99' },
    ],
    articles: [
      { title: 'The Neuroscience of Arousal', readTime: '6 min', category: 'Mechanism' },
      { title: 'Hormonal Balance and Libido', readTime: '7 min', category: 'Research' },
      { title: 'A Sexual Wellness Protocol', readTime: '5 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'hormonal-optimization',
    name: 'Hormonal Optimization',
    iconKey: 'Activity',
    tagline: 'Endocrine balance & signaling',
    summary:
      'Hormones orchestrate nearly every physiological process. This category focuses on compounds studied for supporting the endocrine axis — stimulating natural hormone production, restoring signaling rhythms, and optimizing regulatory feedback loops.',
    systems: [
      { name: 'Endocrine System', focus: 'Hormone axis support', compounds: '3 compounds', price: '$309' },
      { name: 'Vitality System', focus: 'Longevity & performance', compounds: '4 compounds', price: '$349' },
    ],
    products: [
      { name: 'Gonadorelin', type: 'GnRH analog', price: '$129' },
      { name: 'Kisspeptin', type: 'Hormonal signaler', price: '$139' },
      { name: 'CJC-1295 / Ipamorelin', type: 'Peptide blend', price: '$149' },
    ],
    articles: [
      { title: 'Understanding the Endocrine Axis', readTime: '8 min', category: 'Mechanism' },
      { title: 'Restoring Natural Hormone Rhythms', readTime: '7 min', category: 'Research' },
      { title: 'A Hormonal Optimization Protocol', readTime: '6 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'healthy-aging',
    name: 'Healthy Aging',
    iconKey: 'Leaf',
    tagline: 'Vitality across the decades',
    summary:
      'Healthy aging is about maintaining function, resilience, and quality of life over time. This category blends compounds researched for supporting muscle preservation, cognitive maintenance, and systemic repair as the body matures.',
    systems: [
      { name: 'Cellular Renewal System', focus: 'Senescence & autophagy', compounds: '3 compounds', price: '$329' },
      { name: 'Vitality System', focus: 'Longevity & performance', compounds: '4 compounds', price: '$349' },
    ],
    products: [
      { name: 'MOTS-c', type: 'Mitochondrial peptide', price: '$159' },
      { name: 'Epitalon', type: 'Telomerase peptide', price: '$149' },
      { name: 'Thymosin Alpha-1', type: 'Immune peptide', price: '$139' },
    ],
    articles: [
      { title: 'Maintaining Muscle as You Age', readTime: '6 min', category: 'Mechanism' },
      { title: 'Systemic Repair and Resilience', readTime: '7 min', category: 'Research' },
      { title: 'A Healthy Aging Protocol', readTime: '6 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'immune-support',
    name: 'Immune Support',
    iconKey: 'ShieldCheck',
    tagline: 'Defense & resilience',
    summary:
      'A resilient immune system balances defensive readiness with regulated response. This category studies compounds for supporting immune cell modulation, thymic function, and the body’s ability to respond to challenge without chronic inflammation.',
    systems: [
      { name: 'Immune Defense System', focus: 'Modulation & resilience', compounds: '2 compounds', price: '$229' },
      { name: 'Recovery System', focus: 'Tissue repair & sleep', compounds: '3 compounds', price: '$289' },
    ],
    products: [
      { name: 'Thymosin Alpha-1', type: 'Immune peptide', price: '$139' },
      { name: 'Thymosin Beta-4', type: 'Regenerative peptide', price: '$129' },
      { name: 'LL-37', type: 'Antimicrobial peptide', price: '$119' },
    ],
    articles: [
      { title: 'How Peptides Modulate Immunity', readTime: '7 min', category: 'Mechanism' },
      { title: 'Thymic Function and Aging', readTime: '6 min', category: 'Research' },
      { title: 'An Immune Support Protocol', readTime: '5 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'energy',
    name: 'Energy',
    iconKey: 'BatteryCharging',
    tagline: 'Mitochondrial output & stamina',
    summary:
      'Cellular energy production is the foundation of vitality. This category explores compounds researched for supporting mitochondrial function, ATP production, and the metabolic efficiency that translates to sustained daily energy.',
    systems: [
      { name: 'Metabolic System', focus: 'Body composition & energy', compounds: '2 compounds', price: '$249' },
      { name: 'Cellular Renewal System', focus: 'Senescence & autophagy', compounds: '3 compounds', price: '$329' },
    ],
    products: [
      { name: 'MOTS-c', type: 'Mitochondrial peptide', price: '$159' },
      { name: 'NAD+', type: 'Cellular cofactor', price: '$179' },
      { name: '5-Amino-1MQ', type: 'Metabolic compound', price: '$129' },
    ],
    articles: [
      { title: 'Mitochondria and Cellular Energy', readTime: '7 min', category: 'Mechanism' },
      { title: 'NAD+ and Metabolic Efficiency', readTime: '6 min', category: 'Research' },
      { title: 'An Energy Optimization Protocol', readTime: '5 min', category: 'Protocol' },
    ],
  },
  {
    slug: 'sleep-stress',
    name: 'Sleep & Stress',
    iconKey: 'Moon',
    tagline: 'Rest, recovery & calm',
    summary:
      'Quality sleep and stress regulation underpin every other health goal. This category focuses on compounds studied for supporting deep restorative sleep, HPA-axis balance, and a calm, resilient nervous system.',
    systems: [
      { name: 'Recovery System', focus: 'Tissue repair & sleep', compounds: '3 compounds', price: '$289' },
      { name: 'Calm System', focus: 'Stress & relaxation', compounds: '2 compounds', price: '$199' },
    ],
    products: [
      { name: 'DSIP', type: 'Sleep peptide', price: '$99' },
      { name: 'Selank', type: 'Anxiolytic peptide', price: '$109' },
      { name: 'Epitalon', type: 'Telomerase peptide', price: '$149' },
    ],
    articles: [
      { title: 'The Architecture of Deep Sleep', readTime: '6 min', category: 'Mechanism' },
      { title: 'Regulating the Stress Response', readTime: '7 min', category: 'Research' },
      { title: 'A Sleep & Stress Protocol', readTime: '5 min', category: 'Protocol' },
    ],
  },
]
