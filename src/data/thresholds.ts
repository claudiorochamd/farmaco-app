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
    check: v => v.temperature > 41.5,
    cause: 'Falência de múltiplos órgãos por hipertermia maligna (T > 41,5°C)',
    avoidance: 'Interrompa os anticolinérgicos que causam anhidrose. A sudorese é o principal mecanismo de resfriamento corporal — bloqueá-la impede a termorregulação.',
  },
  {
    id: 'hypothermia_fatal',
    check: v => v.temperature < 33.5,
    cause: 'Parada cardíaca por hipotermia grave (T < 33,5°C)',
    avoidance: 'Reduza a dose dos fármacos colinérgicos que causam hipotermia por sudorese excessiva e permita a normalização da temperatura corporal.',
  },
];

export function getActiveCritical(v: VitalSigns): CriticalThreshold | null {
  return CRITICAL_THRESHOLDS.find(t => t.check(v)) ?? null;
}
