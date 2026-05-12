import type { VitalSigns } from '../types';

export interface CriticalThreshold {
  id: string;
  check: (v: VitalSigns) => boolean;
  cause: string;
  avoidance: string;
}

export const CRITICAL_THRESHOLDS: CriticalThreshold[] = [
  {
    id: 'tachy_fatal',
    check: v => v.heartRate > 240,
    cause: 'Fibrilação ventricular por taquicardia extrema (FC > 240 bpm)',
    avoidance: 'Administre um beta-bloqueador (propranolol ou metoprolol) para reduzir a frequência cardíaca antes de atingir o limiar crítico.',
  },
  {
    id: 'brady_fatal',
    check: v => v.heartRate < 18,
    cause: 'Assistolia por bradicardia extrema (FC < 18 bpm)',
    avoidance: 'Administre atropina para bloquear o tônus vagal excessivo e restaurar a frequência cardíaca.',
  },
  {
    id: 'hypotension_fatal',
    check: v => v.systolicBP < 40,
    cause: 'Choque cardiogênico irreversível por hipotensão grave (PAS < 40 mmHg)',
    avoidance: 'Administre vasopressores como norepinefrina ou dopamina para restaurar a resistência vascular periférica e a pressão de perfusão.',
  },
  {
    id: 'hypertension_fatal',
    check: v => v.systolicBP > 260,
    cause: 'Hemorragia cerebral por crise hipertensiva extrema (PAS > 260 mmHg)',
    avoidance: 'Administre labetalol ou clonidina progressivamente para reduzir a pressão arterial sem provocar hipotensão brusca.',
  },
  {
    id: 'hypoxia_fatal',
    check: v => v.spO2 < 68,
    cause: 'Hipóxia cerebral irreversível por insuficiência respiratória grave (SpO2 < 68%)',
    avoidance: 'Administre salbutamol ou ipratrópio para reverter o broncoespasmo e restaurar a ventilação adequada.',
  },
  {
    id: 'hyperthermia_fatal',
    check: v => v.temperature > 41.0,
    cause: 'Falência de múltiplos órgãos por hipertermia maligna (T > 41,0°C)',
    avoidance: 'Interrompa os anticolinérgicos que causam anhidrose. A sudorese é o principal mecanismo de resfriamento corporal — bloqueá-la impede a termorregulação.',
  },
  {
    id: 'hypothermia_fatal',
    check: v => v.temperature < 34.8,
    cause: 'Parada cardíaca por hipotermia grave (T < 34,8°C)',
    avoidance: 'Reduza a dose dos fármacos colinérgicos que causam hipotermia por sudorese excessiva e permita a normalização da temperatura corporal.',
  },

  // ─── Limiares Combinados — síndromes ───────────────────────────────────────
  {
    id: 'cholinergic_crisis',
    check: v => v.heartRate < 40 && v.spO2 < 87,
    cause: 'Síndrome colinérgica grave — colapso cardiorrespiratório combinado (FC < 40 bpm + SpO2 < 87%)',
    avoidance: 'Administre atropina imediatamente: bloqueia receptores M2 (reverte a bradicardia) e M3 (alivia o broncoespasmo, restaurando a SpO2). É o antídoto padrão da crise colinérgica e da intoxicação por organofosforados.',
  },
  {
    id: 'cardiovascular_collapse',
    check: v => v.heartRate < 45 && v.systolicBP < 62,
    cause: 'Colapso cardiovascular misto — bradicardia grave associada à hipotensão severa (FC < 45 bpm + PAS < 62 mmHg)',
    avoidance: 'A associação de bradicardizantes e vasodilatadores é perigosa. Administre atropina para corrigir a FC e vasopressores (norepinefrina ou dopamina) para restaurar a PA de perfusão.',
  },
  {
    id: 'adrenergic_storm',
    check: v => v.heartRate > 160 && v.systolicBP > 180,
    cause: 'Crise adrenérgica — estimulação simpática extrema com alto risco de infarto do miocárdio e AVC hemorrágico (FC > 160 bpm + PAS > 180 mmHg)',
    avoidance: 'Reduza ou remova os agonistas adrenérgicos. Administre labetalol para bloquear α1 e β simultaneamente, controlando FC e PA sem causar hipotensão brusca.',
  },
  {
    id: 'cocaine_overdose',
    check: v => v.heartRate > 150 && v.systolicBP > 170 && v.temperature > 38.8,
    cause: 'Overdose de cocaína — tríade letal: taquicardia, hipertensão e hipertermia simultâneas (FC > 150 + PAS > 170 + T > 38,8°C)',
    avoidance: 'A cocaína inibe NET e DAT, acumulando noradrenalina e dopamina na fenda sináptica. Remova a cocaína administrada. Administre labetalol para controlar FC e PA simultaneamente. Evite beta-bloqueadores isolados — sem o bloqueio α1, a vasoconstrição periférica piora.',
  },
];

export function getActiveCritical(v: VitalSigns): CriticalThreshold | null {
  return CRITICAL_THRESHOLDS.find(t => t.check(v)) ?? null;
}
