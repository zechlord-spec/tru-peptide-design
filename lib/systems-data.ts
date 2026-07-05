// Local reference data for TRU Systems. This is the bundled data used by the
// local data source (lib/data/local) when no backend is configured. The shape
// is defined canonically in lib/data/types.ts and re-exported here for
// backward-compatible imports.
import type {
  System,
  SystemArticle,
  SystemCompound,
  SystemFaq,
  SystemOverviewPoint,
  SystemResearch,
} from '@/lib/data/types'

export type {
  System,
  SystemArticle,
  SystemCompound,
  SystemFaq,
  SystemOverviewPoint,
  SystemResearch,
}

export const SYSTEMS: System[] = [
  {
    slug: 'tru-glow',
    name: 'TRU GLOW',
    trademark: 'TRU GLOW™',
    category: 'Beauty & Skin',
    tagline: 'Radiance engineered from the cellular level',
    focusAreas: ['Beauty', 'Hair', 'Skin', 'Collagen', 'Cellular Rejuvenation'],
    image: '/systems/tru-glow.png',
    iconKey: 'Sparkles',
    overview:
      'TRU GLOW™ is a curated research collection centered on the biology of visibly healthy skin, hair, and connective tissue. It brings together the compounds most studied for supporting collagen synthesis, dermal repair, and the cellular turnover that underpins a lasting, natural radiance.',
    overviewPoints: [
      { title: 'Collagen Architecture', detail: 'Support for the structural proteins that keep skin firm and resilient.' },
      { title: 'Cellular Turnover', detail: 'Research into the renewal cycles that maintain a fresh, luminous complexion.' },
      { title: 'Antioxidant Defense', detail: 'Compounds studied for protecting skin against oxidative and environmental stress.' },
    ],
    research: [
      { title: 'Copper Peptides & Dermal Repair', detail: 'Peer-reviewed work examining GHK-Cu in wound healing and collagen density.' },
      { title: 'The Collagen Synthesis Cascade', detail: 'How signaling peptides influence fibroblast activity and extracellular matrix formation.' },
      { title: 'Follicular Health Pathways', detail: 'Emerging research on peptide signaling in hair follicle cycling.' },
    ],
    compounds: [
      { name: 'GHK-Cu', type: 'Copper peptide', price: '$89' },
      { name: 'BPC-157', type: 'Recovery peptide', price: '$109' },
      { name: 'Collagen Peptides', type: 'Structural support', price: '$69' },
    ],
    library: [
      { title: 'How Copper Peptides Support Skin', readTime: '6 min', category: 'Mechanism' },
      { title: 'Collagen Synthesis and Aging Skin', readTime: '7 min', category: 'Research' },
      { title: 'A Skin Vitality Protocol', readTime: '4 min', category: 'Protocol' },
    ],
    faqs: [
      { question: 'What is TRU GLOW™ designed to study?', answer: 'It organizes compounds researched for skin structure, hair health, and cellular rejuvenation into one educational collection.' },
      { question: 'Are these products for personal use?', answer: 'All TRU compounds are supplied strictly for laboratory and research purposes and are not intended for human consumption.' },
      { question: 'How is purity verified?', answer: 'Every compound is third-party tested for identity and purity, with certificates of analysis available.' },
    ],
    related: ['tru-longevity', 'tru-recover', 'tru-vital'],
  },
  {
    slug: 'tru-klow',
    name: 'TRU KLOW',
    trademark: 'TRU KLOW™',
    category: 'Weight Management',
    tagline: 'Metabolic balance, backed by science',
    focusAreas: ['Weight Management', 'Metabolic Health', 'Body Composition'],
    image: '/systems/tru-klow.png',
    iconKey: 'Scale',
    overview:
      'TRU KLOW™ focuses on the metabolic signaling that governs body composition. This collection gathers compounds studied for their roles in appetite regulation, energy partitioning, and the preservation of lean mass during metabolic change.',
    overviewPoints: [
      { title: 'Metabolic Signaling', detail: 'Research into how peptides modulate satiety and energy balance.' },
      { title: 'Body Recomposition', detail: 'Support for lean mass retention while optimizing fat metabolism.' },
      { title: 'Insulin Sensitivity', detail: 'Compounds examined for their influence on glucose regulation.' },
    ],
    research: [
      { title: 'GLP-1 & Appetite Regulation', detail: 'How incretin-based signaling influences satiety and intake.' },
      { title: 'Growth Hormone & Fat Metabolism', detail: 'Research on GH-axis compounds and lipolysis.' },
      { title: 'Lean Mass Preservation', detail: 'Studies on maintaining muscle during caloric change.' },
    ],
    compounds: [
      { name: 'Tesamorelin', type: 'GH-releasing factor', price: '$129' },
      { name: 'AOD-9604', type: 'Metabolic fragment', price: '$99' },
      { name: 'CJC-1295 / Ipamorelin', type: 'Peptide blend', price: '$149' },
    ],
    library: [
      { title: 'How Peptides Influence Appetite Signaling', readTime: '6 min', category: 'Mechanism' },
      { title: 'Insulin Sensitivity and Body Composition', readTime: '8 min', category: 'Research' },
      { title: 'Preserving Lean Mass During Fat Loss', readTime: '5 min', category: 'Protocol' },
    ],
    faqs: [
      { question: 'What does TRU KLOW™ study?', answer: 'It curates compounds researched for metabolic health, appetite signaling, and body composition.' },
      { question: 'Can I combine it with other systems?', answer: 'Many researchers pair metabolic compounds with performance or longevity protocols; consult the research library for context.' },
      { question: 'Is dosing information provided?', answer: 'We provide educational research context only, not dosing guidance for human use.' },
    ],
    related: ['tru-perform', 'tru-vital', 'tru-longevity'],
  },
  {
    slug: 'tru-perform',
    name: 'TRU PERFORM',
    trademark: 'TRU PERFORM™',
    category: 'Athletic Performance',
    tagline: 'Engineered for output and adaptation',
    focusAreas: ['Athletic Performance', 'Strength', 'Endurance', 'Recovery'],
    image: '/systems/tru-perform.png',
    iconKey: 'Dumbbell',
    overview:
      'TRU PERFORM™ centers on the physiology of athletic output — the interplay of muscular strength, oxygen delivery, and recovery velocity. This collection studies compounds that target the growth hormone axis, mitochondrial efficiency, and neuromuscular signaling.',
    overviewPoints: [
      { title: 'Strength & Power', detail: 'Research into GH-axis stimulation and muscular adaptation.' },
      { title: 'Endurance Capacity', detail: 'Support for oxygen utilization and mitochondrial output.' },
      { title: 'Recovery Velocity', detail: 'Compounds studied for accelerating training recovery.' },
    ],
    research: [
      { title: 'The Growth Hormone Axis in Athletes', detail: 'How GHRH analogs influence training adaptation.' },
      { title: 'Mitochondrial Efficiency & Endurance', detail: 'Research on cellular energy and stamina.' },
      { title: 'Peptides and Tissue Recovery', detail: 'Studies on soft-tissue repair after intense training.' },
    ],
    compounds: [
      { name: 'CJC-1295', type: 'GHRH analog', price: '$139' },
      { name: 'BPC-157', type: 'Recovery peptide', price: '$109' },
      { name: 'IGF-1 LR3', type: 'Growth factor', price: '$169' },
    ],
    library: [
      { title: 'The Growth Hormone Axis in Athletes', readTime: '7 min', category: 'Mechanism' },
      { title: 'Peptides and Training Adaptation', readTime: '6 min', category: 'Research' },
      { title: 'Structuring a Performance Protocol', readTime: '5 min', category: 'Protocol' },
    ],
    faqs: [
      { question: 'What is TRU PERFORM™ focused on?', answer: 'It curates compounds researched for strength, endurance, and recovery in athletic contexts.' },
      { question: 'Is this collection for competitive athletes?', answer: 'All materials are for research purposes only and are not intended for use in sport or human performance.' },
      { question: 'How do I learn about mechanisms?', answer: 'The research library breaks down each compound’s studied pathways in accessible language.' },
    ],
    related: ['tru-recover', 'tru-klow', 'tru-vital'],
  },
  {
    slug: 'tru-focus',
    name: 'TRU FOCUS',
    trademark: 'TRU FOCUS™',
    category: 'Brain Health',
    tagline: 'Clarity, memory, and neuroprotection',
    focusAreas: ['Brain Health', 'Memory', 'Concentration', 'Neuroprotection'],
    image: '/systems/tru-focus.png',
    iconKey: 'Brain',
    overview:
      'TRU FOCUS™ explores the biology of cognition — neurotransmitter balance, neuroplasticity, and cerebral blood flow. This collection studies compounds researched for supporting memory consolidation, sustained focus, and neuroprotection under mental load.',
    overviewPoints: [
      { title: 'Neuroplasticity', detail: 'Research into peptides that support synaptic adaptation and learning.' },
      { title: 'Memory Consolidation', detail: 'Support for the pathways involved in encoding and recall.' },
      { title: 'Neuroprotection', detail: 'Compounds studied for shielding neurons from oxidative stress.' },
    ],
    research: [
      { title: 'Peptides and Neuroplasticity', detail: 'How signaling peptides influence synaptic remodeling.' },
      { title: 'BDNF & Cognitive Resilience', detail: 'Research on neurotrophic support and brain health.' },
      { title: 'The Neurochemistry of Focus', detail: 'Studies on attention and neurotransmitter modulation.' },
    ],
    compounds: [
      { name: 'Semax', type: 'Nootropic peptide', price: '$119' },
      { name: 'Selank', type: 'Anxiolytic peptide', price: '$109' },
      { name: 'Dihexa', type: 'Cognitive peptide', price: '$189' },
    ],
    library: [
      { title: 'Peptides and Neuroplasticity', readTime: '7 min', category: 'Mechanism' },
      { title: 'Supporting Memory Consolidation', readTime: '6 min', category: 'Research' },
      { title: 'A Cognitive Performance Protocol', readTime: '5 min', category: 'Protocol' },
    ],
    faqs: [
      { question: 'What does TRU FOCUS™ study?', answer: 'It organizes compounds researched for memory, concentration, and neuroprotection.' },
      { question: 'Are nootropic peptides well studied?', answer: 'Several have substantial preclinical literature; the research library summarizes the current evidence.' },
      { question: 'Can these be used daily?', answer: 'All compounds are supplied for research only and are not intended for human use.' },
    ],
    related: ['tru-longevity', 'tru-rest', 'tru-vital'],
  },
  {
    slug: 'tru-vital',
    name: 'TRU VITAL',
    trademark: 'TRU VITAL™',
    category: 'Sexual & Hormonal Wellness',
    tagline: 'Vitality through hormonal balance',
    focusAreas: ['Sexual Wellness', 'Hormonal Health', 'Nitric Oxide', 'Vitality'],
    image: '/systems/tru-vital.png',
    iconKey: 'Flame',
    overview:
      'TRU VITAL™ integrates hormonal balance, vascular health, and central signaling. This collection studies compounds researched for supporting libido, endocrine rhythm, nitric oxide pathways, and the broad sense of vitality that comes from balanced physiology.',
    overviewPoints: [
      { title: 'Hormonal Signaling', detail: 'Research into compounds that support natural endocrine rhythms.' },
      { title: 'Vascular Health', detail: 'Support for nitric oxide pathways and circulation.' },
      { title: 'Libido & Arousal', detail: 'Compounds studied for central nervous system signaling.' },
    ],
    research: [
      { title: 'The Neuroscience of Arousal', detail: 'How melanocortin signaling influences desire.' },
      { title: 'Kisspeptin & the Endocrine Axis', detail: 'Research on hormonal regulation and vitality.' },
      { title: 'Nitric Oxide & Vascular Function', detail: 'Studies on circulation and performance.' },
    ],
    compounds: [
      { name: 'PT-141', type: 'Melanocortin peptide', price: '$119' },
      { name: 'Kisspeptin', type: 'Hormonal signaler', price: '$139' },
      { name: 'Gonadorelin', type: 'GnRH analog', price: '$129' },
    ],
    library: [
      { title: 'The Neuroscience of Arousal', readTime: '6 min', category: 'Mechanism' },
      { title: 'Hormonal Balance and Vitality', readTime: '7 min', category: 'Research' },
      { title: 'A Vitality Protocol', readTime: '5 min', category: 'Protocol' },
    ],
    faqs: [
      { question: 'What is TRU VITAL™ centered on?', answer: 'It curates compounds researched for sexual wellness, hormonal health, and vitality.' },
      { question: 'Does it support hormone production?', answer: 'Several compounds are studied for supporting natural hormonal signaling; see the research library.' },
      { question: 'Are these for human use?', answer: 'No — all compounds are supplied strictly for laboratory research.' },
    ],
    related: ['tru-longevity', 'tru-perform', 'tru-klow'],
  },
  {
    slug: 'tru-longevity',
    name: 'TRU LONGEVITY',
    trademark: 'TRU LONGEVITY™',
    category: 'Healthy Aging',
    tagline: 'The science of aging well',
    focusAreas: ['Healthy Aging', 'Cellular Health', 'Mitochondrial Function'],
    image: '/systems/tru-longevity.png',
    iconKey: 'Hourglass',
    overview:
      'TRU LONGEVITY™ centers on the hallmarks of aging — cellular senescence, mitochondrial decline, and telomere integrity. This collection gathers compounds studied for supporting cellular resilience, autophagy, and the systemic repair mechanisms that sustain vitality over time.',
    overviewPoints: [
      { title: 'Cellular Resilience', detail: 'Research into senescence and the maintenance of healthy cells.' },
      { title: 'Mitochondrial Function', detail: 'Support for the energy centers that decline with age.' },
      { title: 'Autophagy', detail: 'Compounds studied for the cellular cleanup that renews tissue.' },
    ],
    research: [
      { title: 'The Hallmarks of Aging', detail: 'A framework for understanding cellular decline.' },
      { title: 'Telomeres & Cellular Lifespan', detail: 'Research on Epitalon and telomerase activity.' },
      { title: 'NAD+ & Mitochondrial Health', detail: 'Studies on cellular energy and aging.' },
    ],
    compounds: [
      { name: 'Epitalon', type: 'Telomerase peptide', price: '$149' },
      { name: 'NAD+', type: 'Cellular cofactor', price: '$179' },
      { name: 'MOTS-c', type: 'Mitochondrial peptide', price: '$159' },
    ],
    library: [
      { title: 'The Hallmarks of Aging Explained', readTime: '9 min', category: 'Mechanism' },
      { title: 'Autophagy and Cellular Cleanup', readTime: '7 min', category: 'Research' },
      { title: 'A Foundational Longevity Protocol', readTime: '6 min', category: 'Protocol' },
    ],
    faqs: [
      { question: 'What does TRU LONGEVITY™ study?', answer: 'It curates compounds researched for cellular health, mitochondrial function, and healthy aging.' },
      { question: 'Is longevity research established?', answer: 'The field is rapidly evolving; the library summarizes current preclinical and clinical findings.' },
      { question: 'Can I stack these compounds?', answer: 'Many longevity researchers study combinations; educational context is provided in the library.' },
    ],
    related: ['tru-vital', 'tru-focus', 'tru-defense'],
  },
  {
    slug: 'tru-recover',
    name: 'TRU RECOVER',
    trademark: 'TRU RECOVER™',
    category: 'Injury Recovery',
    tagline: 'Repair, restore, regenerate',
    focusAreas: ['Injury Recovery', 'Inflammation', 'Tissue Repair'],
    image: '/systems/tru-recover.png',
    iconKey: 'HeartPulse',
    overview:
      'TRU RECOVER™ focuses on the biology of repair — the regeneration of tendons, ligaments, and muscle following stress or injury. This collection studies compounds researched for accelerating soft-tissue healing and modulating the inflammatory response.',
    overviewPoints: [
      { title: 'Tissue Repair', detail: 'Research into accelerated healing of connective tissue.' },
      { title: 'Inflammation Modulation', detail: 'Support for a balanced, resolving inflammatory response.' },
      { title: 'Angiogenesis', detail: 'Compounds studied for promoting healthy blood vessel formation.' },
    ],
    research: [
      { title: 'The Science of Soft-Tissue Repair', detail: 'How BPC-157 influences tendon and ligament healing.' },
      { title: 'TB-500 & Cellular Migration', detail: 'Research on regenerative signaling.' },
      { title: 'Resolving Inflammation', detail: 'Studies on the transition from injury to repair.' },
    ],
    compounds: [
      { name: 'BPC-157', type: 'Recovery peptide', price: '$109' },
      { name: 'TB-500', type: 'Regenerative peptide', price: '$139' },
      { name: 'GHK-Cu', type: 'Copper peptide', price: '$89' },
    ],
    library: [
      { title: 'The Science of Soft-Tissue Repair', readTime: '6 min', category: 'Mechanism' },
      { title: 'Inflammation Modulation and Healing', readTime: '7 min', category: 'Research' },
      { title: 'Building a Recovery Protocol', readTime: '5 min', category: 'Protocol' },
    ],
    faqs: [
      { question: 'What is TRU RECOVER™ for?', answer: 'It curates compounds researched for tissue repair, inflammation, and injury recovery.' },
      { question: 'Are these compounds fast-acting?', answer: 'Research timelines vary; the library summarizes what current studies suggest.' },
      { question: 'Can I pair it with TRU PERFORM™?', answer: 'Recovery and performance collections are frequently studied together.' },
    ],
    related: ['tru-perform', 'tru-glow', 'tru-defense'],
  },
  {
    slug: 'tru-rest',
    name: 'TRU REST',
    trademark: 'TRU REST™',
    category: 'Sleep & Stress',
    tagline: 'Deep rest, calm resilience',
    focusAreas: ['Sleep', 'Stress', 'Relaxation'],
    image: '/systems/tru-rest.png',
    iconKey: 'Moon',
    overview:
      'TRU REST™ addresses the foundations of restoration — deep sleep, HPA-axis balance, and a calm nervous system. This collection studies compounds researched for supporting sleep architecture and a resilient response to stress.',
    overviewPoints: [
      { title: 'Sleep Architecture', detail: 'Research into deep, restorative sleep phases.' },
      { title: 'Stress Regulation', detail: 'Support for a balanced HPA-axis and calm state.' },
      { title: 'Nervous System Balance', detail: 'Compounds studied for anxiolytic signaling.' },
    ],
    research: [
      { title: 'The Architecture of Deep Sleep', detail: 'How DSIP influences sleep phases.' },
      { title: 'Regulating the Stress Response', detail: 'Research on Selank and the HPA-axis.' },
      { title: 'Sleep & Cellular Repair', detail: 'Studies linking rest to systemic recovery.' },
    ],
    compounds: [
      { name: 'DSIP', type: 'Sleep peptide', price: '$99' },
      { name: 'Selank', type: 'Anxiolytic peptide', price: '$109' },
      { name: 'Epitalon', type: 'Telomerase peptide', price: '$149' },
    ],
    library: [
      { title: 'The Architecture of Deep Sleep', readTime: '6 min', category: 'Mechanism' },
      { title: 'Regulating the Stress Response', readTime: '7 min', category: 'Research' },
      { title: 'A Sleep & Stress Protocol', readTime: '5 min', category: 'Protocol' },
    ],
    faqs: [
      { question: 'What does TRU REST™ study?', answer: 'It curates compounds researched for sleep, stress regulation, and relaxation.' },
      { question: 'Does sleep affect other goals?', answer: 'Quality rest underpins recovery, cognition, and longevity — it is foundational.' },
      { question: 'Are these compounds sedating?', answer: 'Research effects vary; the library provides mechanistic context.' },
    ],
    related: ['tru-focus', 'tru-recover', 'tru-longevity'],
  },
  {
    slug: 'tru-defense',
    name: 'TRU DEFENSE',
    trademark: 'TRU DEFENSE™',
    category: 'Immune Support',
    tagline: 'Resilient, regulated immunity',
    focusAreas: ['Immune Support', 'Cellular Protection'],
    image: '/systems/tru-defense.png',
    iconKey: 'ShieldCheck',
    overview:
      'TRU DEFENSE™ studies the biology of immune resilience — the balance between defensive readiness and regulated response. This collection gathers compounds researched for supporting immune cell modulation, thymic function, and cellular protection.',
    overviewPoints: [
      { title: 'Immune Modulation', detail: 'Research into balanced immune cell activity.' },
      { title: 'Thymic Function', detail: 'Support for the gland central to immune maturation.' },
      { title: 'Cellular Protection', detail: 'Compounds studied for defending cells against challenge.' },
    ],
    research: [
      { title: 'How Peptides Modulate Immunity', detail: 'The role of thymosin in immune signaling.' },
      { title: 'Thymic Function and Aging', detail: 'Research on immune resilience over time.' },
      { title: 'Antimicrobial Peptides', detail: 'Studies on LL-37 and cellular defense.' },
    ],
    compounds: [
      { name: 'Thymosin Alpha-1', type: 'Immune peptide', price: '$139' },
      { name: 'Thymosin Beta-4', type: 'Regenerative peptide', price: '$129' },
      { name: 'LL-37', type: 'Antimicrobial peptide', price: '$119' },
    ],
    library: [
      { title: 'How Peptides Modulate Immunity', readTime: '7 min', category: 'Mechanism' },
      { title: 'Thymic Function and Aging', readTime: '6 min', category: 'Research' },
      { title: 'An Immune Support Protocol', readTime: '5 min', category: 'Protocol' },
    ],
    faqs: [
      { question: 'What is TRU DEFENSE™ focused on?', answer: 'It curates compounds researched for immune support and cellular protection.' },
      { question: 'Is immune modulation different from stimulation?', answer: 'Yes — the goal in research is balance, not simple activation. The library explains the distinction.' },
      { question: 'Are these compounds for illness?', answer: 'No — all compounds are supplied strictly for laboratory research.' },
    ],
    related: ['tru-longevity', 'tru-recover', 'tru-vital'],
  },
]

export function getSystem(slug: string) {
  return SYSTEMS.find((s) => s.slug === slug)
}
