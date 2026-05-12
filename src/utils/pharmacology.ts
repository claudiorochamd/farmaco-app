import type { ActiveDrug, VitalSigns, BodyVisualState } from '../types';

const BASELINE_VITALS: VitalSigns = {
  heartRate: 70,
  systolicBP: 120,
  diastolicBP: 80,
  respiratoryRate: 15,
  spO2: 98,
};

export function calculateVitals(activeDrugs: ActiveDrug[]): VitalSigns {
  if (activeDrugs.length === 0) return { ...BASELINE_VITALS };

  let hrDelta = 0;
  let sbpDelta = 0;
  let dbpDelta = 0;
  let bronchialDelta = 0;

  for (const { drug, dose } of activeDrugs) {
    const f = dose / drug.maxDose;
    hrDelta += drug.effects.heartRate * f;
    sbpDelta += drug.effects.systolicBP * f;
    dbpDelta += drug.effects.diastolicBP * f;
    bronchialDelta += drug.effects.bronchialDiameter * f;
  }

  const hr = clamp(BASELINE_VITALS.heartRate * (1 + hrDelta / 100), 18, 260);
  const sbp = clamp(BASELINE_VITALS.systolicBP * (1 + sbpDelta / 100), 40, 300);
  const dbp = clamp(BASELINE_VITALS.diastolicBP * (1 + dbpDelta / 100), 20, 200);

  // RR partially correlates with HR
  const rr = clamp(BASELINE_VITALS.respiratoryRate * (1 + hrDelta / 300), 4, 45);

  // SpO2 drops with bronchoconstriction
  const bronchialFactor = 1 + bronchialDelta / 100;
  let spO2 = 98;
  if (bronchialFactor < 0.8) spO2 = 98 - (0.8 - bronchialFactor) * 50;
  if (bronchialFactor < 0.5) spO2 = 82 - (0.5 - bronchialFactor) * 60;
  spO2 = clamp(spO2, 65, 100);

  return { heartRate: hr, systolicBP: sbp, diastolicBP: dbp, respiratoryRate: rr, spO2 };
}

export function calculateBodyState(activeDrugs: ActiveDrug[]): BodyVisualState {
  if (activeDrugs.length === 0) {
    return {
      heartRateMultiplier: 1,
      skinVasodilation: 0,
      pupilNormalized: 0.5,
      bronchialNormalized: 1,
      sweating: 0,
      salivation: 0,
      lacrimation: 0,
      tremor: 0,
      giMotility: 1,
    };
  }

  let hrMult = 0;
  let skinVaso = 0;
  let pupilDelta = 0;
  let bronchial = 0;
  let sweat = 0;
  let saliva = 0;
  let lacri = 0;
  let tremor = 0;
  let giDelta = 0;

  for (const { drug, dose } of activeDrugs) {
    const f = dose / drug.maxDose;
    hrMult += drug.effects.heartRate * f;
    skinVaso += drug.effects.skinVasodilation * f;
    pupilDelta += drug.effects.pupilDilation * f;
    bronchial += drug.effects.bronchialDiameter * f;
    sweat += drug.effects.sweating * f;
    saliva += drug.effects.salivation * f;
    lacri += drug.effects.lacrimation * f;
    tremor += drug.effects.tremor * f;
    giDelta += drug.effects.giMotility * f;
  }

  return {
    heartRateMultiplier: clamp(1 + hrMult / 100, 0.25, 3.5),
    skinVasodilation: clamp(skinVaso / 100, -1, 1),
    pupilNormalized: clamp(0.5 + pupilDelta / 200, 0.05, 1),
    bronchialNormalized: clamp(1 + bronchial / 100, 0.25, 2),
    sweating: clamp(sweat, 0, 1),
    salivation: clamp(saliva, -1, 1),
    lacrimation: clamp(lacri, -1, 1),
    tremor: clamp(tremor, 0, 1),
    giMotility: clamp(1 + giDelta / 100, 0.1, 3),
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function vitalColor(value: number, normal: [number, number], warning: [number, number]): string {
  if (value >= normal[0] && value <= normal[1]) return '#2ecc71';
  if (value >= warning[0] && value <= warning[1]) return '#f39c12';
  return '#e74c3c';
}
