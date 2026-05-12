import type { VitalSigns, BodyVisualState } from '../types';

export type Severity = 'critical' | 'urgent' | 'moderate';

export interface ScenarioDrug {
  drugId: string;
  dosePercent: number;
}

export interface ScenarioHint {
  atTimeLeft: number; // aparece quando timeLeft ≤ este valor
  text: string;
}

export interface Scenario {
  id: string;
  title: string;
  situation: string;
  rationale: string;
  drugs: ScenarioDrug[];
  drugNames: string[];
  color: string;
  severity: Severity;
  expectedEffects: string[];
  baselineVitals: VitalSigns;
  baselineBodyState: BodyVisualState;
  hints: ScenarioHint[];
}

export const scenarios: Scenario[] = [
  {
    id: 'anafilaxia',
    title: 'Choque Anafilático',
    severity: 'critical',
    color: '#e74c3c',
    situation:
      'Paciente desenvolve reação alérgica grave após picada de abelha. Apresenta broncoespasmo, hipotensão severa, urticária generalizada e angioedema. SpO2 em queda.',
    drugNames: ['Epinefrina'],
    drugs: [{ drugId: 'epinefrina', dosePercent: 0.85 }],
    rationale:
      'A epinefrina é o tratamento de primeira linha. Age como antagonista fisiológico da histamina: β2 promove broncodilatação, α1 reverte a vasodilatação e ↑PA, β1 aumenta FC e contratilidade.',
    expectedEffects: [
      '↑↑ Frequência cardíaca',
      '↑ Pressão arterial',
      'Broncodilatação intensa',
      'Vasoconstrição periférica (pele pálida)',
      'Midríase',
      'Tremor',
    ],
    baselineVitals: {
      heartRate: 130, systolicBP: 72, diastolicBP: 38,
      respiratoryRate: 28, spO2: 84, temperature: 37.2,
    },
    baselineBodyState: {
      heartRateMultiplier: 1.86, skinVasodilation: 0.65,
      pupilNormalized: 0.5, bronchialNormalized: 0.42,
      sweating: 0.4, salivation: 0.1, lacrimation: 0.1,
      tremor: 0.2, giMotility: 1.0,
    },
    hints: [
      { atTimeLeft: 40, text: 'Observe a SpO2 e a PA — o que está acontecendo com o paciente?' },
      { atTimeLeft: 25, text: 'Broncoespasmo + hipotensão simultâneos sugerem uma reação anafilática. Qual fármaco é o antagonista fisiológico da histamina?' },
      { atTimeLeft: 10, text: 'Administre Epinefrina — ela atua em α1 (↑PA), β1 (↑FC) e β2 (broncodilatação) ao mesmo tempo.' },
    ],
  },
  {
    id: 'bradicardia',
    title: 'Bradicardia Sintomática',
    severity: 'critical',
    color: '#3498db',
    situation:
      'Paciente com FC de 32 bpm, tontura, hipotensão e síncope iminente. ECG mostra bradicardia sinusal grave sem bloqueio AV identificado.',
    drugNames: ['Atropina'],
    drugs: [{ drugId: 'atropina', dosePercent: 0.75 }],
    rationale:
      'A atropina bloqueia receptores M2 cardíacos, removendo o tônus vagal parassimpático que freia o coração. Resultado: ↑FC por cronotropismo positivo.',
    expectedEffects: [
      '↑↑ Frequência cardíaca',
      'Midríase',
      'Boca seca (xerostomia)',
      'Anhidrose (temperatura ↑)',
      'Broncodilatação leve',
    ],
    baselineVitals: {
      heartRate: 32, systolicBP: 80, diastolicBP: 52,
      respiratoryRate: 14, spO2: 93, temperature: 36.5,
    },
    baselineBodyState: {
      heartRateMultiplier: 0.46, skinVasodilation: -0.2,
      pupilNormalized: 0.5, bronchialNormalized: 1.0,
      sweating: 0.1, salivation: 0, lacrimation: 0,
      tremor: 0, giMotility: 1.0,
    },
    hints: [
      { atTimeLeft: 40, text: 'FC muito baixa — qual sistema está freando o coração em excesso?' },
      { atTimeLeft: 25, text: 'O tônus parassimpático excessivo (vagal) está causando a bradicardia. Qual receptor muscarínico no coração precisa ser bloqueado?' },
      { atTimeLeft: 10, text: 'Administre Atropina — bloqueia o receptor M2 e remove o freio vagal sobre o nó SA.' },
    ],
  },
  {
    id: 'hipertensao',
    title: 'Crise Hipertensiva',
    severity: 'urgent',
    color: '#e67e22',
    situation:
      'Paciente com PA 210/130 mmHg, cefaleia intensa em "trovão", epistaxe e risco iminente de AVC hemorrágico. Necessita redução rápida da pressão.',
    drugNames: ['Labetalol'],
    drugs: [{ drugId: 'labetalol', dosePercent: 0.80 }],
    rationale:
      'O labetalol bloqueia α1 (vasodilatação → ↓RVP) e β (↓FC, ↓contratilidade) simultaneamente, reduzindo a PA sem causar taquicardia reflexa — ideal em emergências hipertensivas.',
    expectedEffects: [
      '↓↓ Pressão arterial',
      '↓ Frequência cardíaca',
      'Vasodilatação periférica',
      'Leve broncoconstrição (evitar em asmáticos)',
    ],
    baselineVitals: {
      heartRate: 98, systolicBP: 210, diastolicBP: 130,
      respiratoryRate: 18, spO2: 97, temperature: 37.0,
    },
    baselineBodyState: {
      heartRateMultiplier: 1.4, skinVasodilation: -0.35,
      pupilNormalized: 0.55, bronchialNormalized: 1.0,
      sweating: 0.2, salivation: 0, lacrimation: 0,
      tremor: 0.1, giMotility: 1.0,
    },
    hints: [
      { atTimeLeft: 40, text: 'PA extremamente elevada — risco iminente de AVC. Qual sistema está excessivamente ativado?' },
      { atTimeLeft: 25, text: 'Crise hipertensiva requer redução rápida e controlada da PA. Evite beta-bloqueadores isolados — procure um bloqueador α + β.' },
      { atTimeLeft: 10, text: 'Administre Labetalol — bloqueia α1 (vasodilatação) e β simultaneamente, reduzindo PA sem taquicardia reflexa.' },
    ],
  },
  {
    id: 'asma',
    title: 'Crise Asmática',
    severity: 'urgent',
    color: '#27ae60',
    situation:
      'Paciente com dispneia grave, sibilos difusos e uso de musculatura acessória. SpO2 de 82%. Crise de broncoespasmo agudo com resposta inflamatória.',
    drugNames: ['Salbutamol'],
    drugs: [{ drugId: 'salbutamol', dosePercent: 0.85 }],
    rationale:
      'O salbutamol é agonista β2 seletivo com início de ação em 5–8 min. Promove broncodilatação ao relaxar a musculatura lisa brônquica, revertendo o broncoespasmo.',
    expectedEffects: [
      'Broncodilatação intensa',
      '↑ SpO2',
      '↑ leve da frequência cardíaca',
      'Tremor nas extremidades',
    ],
    baselineVitals: {
      heartRate: 115, systolicBP: 128, diastolicBP: 82,
      respiratoryRate: 30, spO2: 82, temperature: 37.3,
    },
    baselineBodyState: {
      heartRateMultiplier: 1.64, skinVasodilation: 0,
      pupilNormalized: 0.5, bronchialNormalized: 0.28,
      sweating: 0.5, salivation: 0, lacrimation: 0.1,
      tremor: 0.2, giMotility: 1.0,
    },
    hints: [
      { atTimeLeft: 40, text: 'SpO2 baixa e brônquios constrictos — há broncoespasmo ativo. Qual classe de receptor o reverte?' },
      { atTimeLeft: 25, text: 'Receptor β2 nos brônquios promove broncodilatação. Procure um agonista β2 seletivo de curta ação.' },
      { atTimeLeft: 10, text: 'Administre Salbutamol — agonista β2 com início de ação em 5–8 minutos e mínimo efeito cardíaco.' },
    ],
  },
  {
    id: 'sepse',
    title: 'Choque Séptico',
    severity: 'critical',
    color: '#9b59b6',
    situation:
      'Paciente séptico com vasodilatação sistêmica refratária, PA 68/38 mmHg, extremidades frias e mottling cutâneo. Não responde à reposição volêmica.',
    drugNames: ['Norepinefrina'],
    drugs: [{ drugId: 'norepinefrina', dosePercent: 0.90 }],
    rationale:
      'A norepinefrina é a droga vasopressora de primeira linha no choque séptico. Sua potente ação α1 reverte a vasodilatação periférica, aumentando a RVP e restaurando a PA de perfusão.',
    expectedEffects: [
      '↑↑ Pressão arterial',
      'Vasoconstrição periférica intensa',
      'Bradicardia reflexa',
      'Pele pálida/fria',
    ],
    baselineVitals: {
      heartRate: 128, systolicBP: 68, diastolicBP: 38,
      respiratoryRate: 24, spO2: 91, temperature: 39.2,
    },
    baselineBodyState: {
      heartRateMultiplier: 1.83, skinVasodilation: 0.55,
      pupilNormalized: 0.5, bronchialNormalized: 0.85,
      sweating: 0.65, salivation: 0, lacrimation: 0,
      tremor: 0.1, giMotility: 0.7,
    },
    hints: [
      { atTimeLeft: 40, text: 'Paciente em choque — PA colapsada por vasodilatação sistêmica. Qual sistema precisa ser estimulado para contrair os vasos?' },
      { atTimeLeft: 25, text: 'No choque séptico, o receptor α1 vascular está sub-estimulado. Procure um vasopressor com potente ação α1.' },
      { atTimeLeft: 10, text: 'Administre Norepinefrina — primeira linha no choque séptico pela sua potente ação α1 vasoconstritora.' },
    ],
  },
  {
    id: 'organofosforado',
    title: 'Intoxicação por Organofosforado',
    severity: 'critical',
    color: '#f39c12',
    situation:
      'Trabalhador rural com exposição acidental a agrotóxico (organofosforado). Apresenta síndrome SLUDGE completa: sialorreia, lacrimejamento, broncoespasmo, bradicardia e miose.',
    drugNames: ['Fisostigmina'],
    drugs: [{ drugId: 'fisostigmina', dosePercent: 0.80 }],
    rationale:
      'A fisostigmina inibe a acetilcolinesterase, simulando a intoxicação por organofosforado: acúmulo de ACh nas sinapses → hiperestimulação muscarínica generalizada (síndrome SLUDGE). O antídoto é a atropina.',
    expectedEffects: [
      '↓↓ Frequência cardíaca',
      'Broncoespasmo e broncorreia',
      'Miose intensa',
      'Sudorese profusa',
      'Sialorreia e lacrimejamento',
      '↓ SpO2',
    ],
    baselineVitals: {
      heartRate: 35, systolicBP: 78, diastolicBP: 52,
      respiratoryRate: 28, spO2: 79, temperature: 35.8,
    },
    baselineBodyState: {
      heartRateMultiplier: 0.5, skinVasodilation: 0.4,
      pupilNormalized: 0.05, bronchialNormalized: 0.30,
      sweating: 1.0, salivation: 1.0, lacrimation: 0.9,
      tremor: 0.3, giMotility: 2.5,
    },
    hints: [
      { atTimeLeft: 40, text: 'Síndrome SLUDGE presente: sialorreia, lacrimejamento, miose, broncoespasmo, bradicardia. Qual neurotransmissor está em excesso?' },
      { atTimeLeft: 25, text: 'Acetilcolina acumulada nas sinapses muscarínicas. Qual fármaco bloqueia esses receptores e reverte todos esses efeitos?' },
      { atTimeLeft: 10, text: 'Administre Atropina — bloqueia receptores M2 (↑FC) e M3 (broncodilatação, ↓secreções). É o antídoto padrão da crise colinérgica.' },
    ],
  },
  {
    id: 'pcr',
    title: 'Parada Cardiorrespiratória',
    severity: 'critical',
    color: '#c0392b',
    situation:
      'Paciente colapsa subitamente em assistolia. Sem pulso, sem respiração espontânea, sem resposta a estímulos. Pupilas fixas e dilatadas. RCP em andamento.',
    drugNames: ['Epinefrina'],
    drugs: [{ drugId: 'epinefrina', dosePercent: 1.0 }],
    rationale:
      'A epinefrina é o único fármaco vasoativo recomendado no protocolo ACLS/RCP. A ação β1 restaura o automatismo e a contratilidade cardíaca. A ação α1 promove vasoconstrição periférica intensa, aumentando a pressão de perfusão coronariana e cerebral durante as compressões.',
    expectedEffects: [
      '↑↑ Frequência cardíaca (retorno ao ritmo sinusal)',
      '↑↑ Pressão arterial',
      '↑ SpO2',
      'Vasoconstrição periférica intensa',
      'Midríase',
      'Tremor',
    ],
    baselineVitals: {
      heartRate: 10, systolicBP: 45, diastolicBP: 20,
      respiratoryRate: 4, spO2: 62, temperature: 35.5,
    },
    baselineBodyState: {
      heartRateMultiplier: 0.14, skinVasodilation: -0.6,
      pupilNormalized: 0.75, bronchialNormalized: 0.9,
      sweating: 0, salivation: 0, lacrimation: 0,
      tremor: 0, giMotility: 0.5,
    },
    hints: [
      { atTimeLeft: 40, text: 'FC quase zero — assistolia. O coração precisa de estimulação adrenérgica urgente para retomar o automatismo.' },
      { atTimeLeft: 25, text: 'Protocolo ACLS: qual é o único fármaco vasoativo recomendado na PCR? Pense em α1 (perfusão coronariana) + β1 (automatismo).' },
      { atTimeLeft: 10, text: 'Administre Epinefrina — dose máxima. É o único vasoativo do protocolo de RCP: aumenta a pressão de perfusão coronariana durante as compressões.' },
    ],
  },
];
