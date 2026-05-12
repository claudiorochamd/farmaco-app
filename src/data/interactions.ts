import type { DrugInteraction } from '../types';

export const interactions: DrugInteraction[] = [
  {
    drugIds: ['epinefrina', 'propranolol'],
    severity: 'danger',
    title: 'Reversão dos efeitos β — Hipertensão Grave',
    description:
      'Propranolol bloqueia os receptores β, deixando os efeitos α da epinefrina sem oposição. Resultado: vasoconstrição intensa, hipertensão severa e bradicardia reflexa. Risco de emergência hipertensiva.',
  },
  {
    drugIds: ['epinefrina', 'fentolamina'],
    severity: 'warning',
    title: 'Reversão da Epinefrina (efeito α bloqueado)',
    description:
      'Fentolamina bloqueia receptores α, deixando os efeitos β da epinefrina dominantes. Resultado: vasodilatação + taquicardia. Usado clinicamente para diagnóstico de feocromocitoma.',
  },
  {
    drugIds: ['neostigmina', 'atropina'],
    severity: 'info',
    title: 'Antagonismo Muscarínico Clínico',
    description:
      'Combinação usada para reverter bloqueio neuromuscular: neostigmina reativa AChE (efeito nicotínico desejado) enquanto atropina bloqueia os efeitos muscarínicos indesejados (bradicardia, secreções).',
  },
  {
    drugIds: ['fisostigmina', 'atropina'],
    severity: 'info',
    title: 'Antagonismo Direto (antídoto)',
    description:
      'Atropina é o antídoto para intoxicação por fisostigmina/anticolinesterásicos. Bloqueia competitivamente os receptores muscarínicos hiperestimulados.',
  },
  {
    drugIds: ['salbutamol', 'propranolol'],
    severity: 'danger',
    title: 'Bloqueio da Broncodilatação — Risco em Asmáticos',
    description:
      'Propranolol bloqueia β2, antagonizando o efeito broncodilatador do salbutamol. Pode precipitar broncoespasmo grave em pacientes asmáticos ou com DPOC.',
  },
  {
    drugIds: ['salbutamol', 'metoprolol'],
    severity: 'warning',
    title: 'Redução Parcial da Broncodilatação',
    description:
      'Metoprolol (β1 seletivo) antagoniza parcialmente o salbutamol em altas doses. Menos perigoso que propranolol, mas deve ser monitorado.',
  },
  {
    drugIds: ['epinefrina', 'dopamina'],
    severity: 'warning',
    title: 'Estimulação Cardíaca Aditiva',
    description:
      'Duas catecolaminas em conjunto podem causar taquicardia severa e risco aumentado de arritmias ventriculares. Monitorar FC e ritmo cardíaco rigorosamente.',
  },
  {
    drugIds: ['dopamina', 'dobutamina'],
    severity: 'warning',
    title: 'Estimulação β1 Aditiva',
    description:
      'Associação comum em UTI para suporte hemodinâmico, mas pode causar taquicardia excessiva. Monitorar FC continuamente.',
  },
  {
    drugIds: ['acetilcolina', 'atropina'],
    severity: 'info',
    title: 'Antagonismo Competitivo Direto',
    description:
      'Atropina bloqueia competitivamente os receptores muscarínicos ativados pela acetilcolina. Efeito final depende das doses relativas.',
  },
  {
    drugIds: ['pilocarpina', 'atropina'],
    severity: 'info',
    title: 'Antagonismo Competitivo',
    description:
      'Efeitos mutuamente antagônicos. Clinicamente: atropina reverte intoxicação por pilocarpina e vice-versa. Usado em oftalmologia para reversão de miose.',
  },
  {
    drugIds: ['acetilcolina', 'neostigmina'],
    severity: 'warning',
    title: 'Crise Colinérgica — Efeitos Cumulativos',
    description:
      'Combinação perigosa: neostigmina impede a degradação da ACh, potencializando e prolongando seus efeitos. Pode causar crise colinérgica com bradicardia grave, broncoespasmo e secreções excessivas.',
  },
  {
    drugIds: ['pilocarpina', 'neostigmina'],
    severity: 'warning',
    title: 'Hiperestimulação Muscarínica',
    description:
      'Efeitos muscarínicos aditivos. Risco de crise colinérgica: bradicardia, broncoespasmo, miose intensa, hipersalivação e diarreia.',
  },
  {
    drugIds: ['clonidina', 'propranolol'],
    severity: 'danger',
    title: 'Bradicardia e Hipotensão Severa',
    description:
      'Sinergismo: ambos reduzem FC e PA por mecanismos complementares. Risco de bradicardia sintomática e colapso cardiovascular.',
  },
  {
    drugIds: ['norepinefrina', 'fentolamina'],
    severity: 'warning',
    title: 'Reversão dos Efeitos Pressores',
    description:
      'Fentolamina bloqueia α1/α2 da norepinefrina, abolindo seu efeito vasoconstritor. Resulta em hipotensão e taquicardia reflexa.',
  },
  {
    drugIds: ['fenilefrina', 'propranolol'],
    severity: 'warning',
    title: 'Hipertensão sem Compensação β',
    description:
      'Propranolol bloqueia a taquicardia reflexa compensatória da fenilefrina, podendo resultar em hipertensão com bradicardia (resposta de Bezold-Jarisch amplificada).',
  },
  {
    drugIds: ['atropina', 'escopolamina'],
    severity: 'warning',
    title: 'Efeitos Antimuscarínicos Cumulativos',
    description:
      'Dois antimuscarínicos juntos: risco de síndrome anticolinérgica severa — taquicardia, hipertermia, retenção urinária, confusão mental e midríase intensa.',
  },
];

export function getActiveInteractions(drugIds: string[]): DrugInteraction[] {
  return interactions.filter(
    i =>
      drugIds.includes(i.drugIds[0]) && drugIds.includes(i.drugIds[1])
  );
}
