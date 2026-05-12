export type Severity = 'critical' | 'urgent' | 'moderate';

export interface ScenarioDrug {
  drugId: string;
  dosePercent: number; // 0 a 1
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
  },
  {
    id: 'asma',
    title: 'Crise Asmática',
    severity: 'urgent',
    color: '#27ae60',
    situation:
      'Paciente com dispneia grave, sibilos difusos e uso de musculatura acessória. SpO2 de 88%. Crise de broncoespasmo agudo com resposta inflamatória.',
    drugNames: ['Salbutamol'],
    drugs: [{ drugId: 'salbutamol', dosePercent: 0.85 }],
    rationale:
      'O salbutamol é agonista β2 seletivo com início de ação em 5–8 min. Promove broncodilatação ao relaxar a musculatura lisa brônquica, revertendo o broncoespasmo.',
    expectedEffects: [
      'Broncodilatação intensa',
      '↑ SpO2',
      '↑ leve da frequência cardíaca',
      'Tremor nas extremidades',
      'Leve hipocalemia',
    ],
  },
  {
    id: 'sepse',
    title: 'Choque Séptico',
    severity: 'critical',
    color: '#9b59b6',
    situation:
      'Paciente séptico com vasodilatação sistêmica refratária, PA 70/40 mmHg, extremidades frias e mottling cutâneo. Não responde à reposição volêmica.',
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
      '↓ SpO2 (broncoespasmo)',
    ],
  },
];
