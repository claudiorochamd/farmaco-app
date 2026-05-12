import type { ActiveDrug, VitalSigns, BodyVisualState, NTLevels } from '../types';

const BASELINE_VITALS: VitalSigns = {
  heartRate: 70,
  systolicBP: 120,
  diastolicBP: 80,
  respiratoryRate: 15,
  spO2: 98,
  temperature: 36.5,
};

/** Fator de decay farmacocinético: e^(-ln2 × elapsed / t½) */
export function decayFactor(administeredAt: number, halfLifeMinutes: number, now = Date.now()): number {
  const elapsedMin = (now - administeredAt) / 60000;
  return Math.exp(-Math.LN2 * elapsedMin / halfLifeMinutes);
}

export function calculateVitals(activeDrugs: ActiveDrug[], now = Date.now()): VitalSigns {
  if (activeDrugs.length === 0) return { ...BASELINE_VITALS };

  let hrDelta = 0;
  let sbpDelta = 0;
  let dbpDelta = 0;
  let bronchialDelta = 0;
  let sweatDelta = 0;

  for (const { drug, dose, administeredAt } of activeDrugs) {
    const decay = decayFactor(administeredAt, drug.halfLifeMinutes, now);
    const f = (dose / drug.maxDose) * decay;
    hrDelta       += drug.effects.heartRate        * f;
    sbpDelta      += drug.effects.systolicBP       * f;
    dbpDelta      += drug.effects.diastolicBP      * f;
    bronchialDelta+= drug.effects.bronchialDiameter* f;
    sweatDelta    += drug.effects.sweating         * f;
  }

  const hr  = clamp(BASELINE_VITALS.heartRate    * (1 + hrDelta  / 100), 18, 260);
  const sbp = clamp(BASELINE_VITALS.systolicBP   * (1 + sbpDelta / 100), 40, 300);
  const dbp = clamp(BASELINE_VITALS.diastolicBP  * (1 + dbpDelta / 100), 20, 200);
  const rr  = clamp(BASELINE_VITALS.respiratoryRate * (1 + hrDelta / 300), 4, 45);

  // SpO2 cai com broncoconstrição
  const bronchialFactor = 1 + bronchialDelta / 100;
  let spO2 = 98;
  if (bronchialFactor < 0.8) spO2 = 98 - (0.8 - bronchialFactor) * 50;
  if (bronchialFactor < 0.5) spO2 = 82 - (0.5 - bronchialFactor) * 60;
  spO2 = clamp(spO2, 65, 100);

  // Temperatura: anticolinérgicos bloqueiam sudorese → hipertermia
  // Colinérgicos aumentam sudorese → hipotermia leve
  let tempDelta = 0;
  if (sweatDelta < -0.3) tempDelta = (-sweatDelta - 0.3) * 2.5; // anhidrose → aquecimento
  if (sweatDelta >  0.3) tempDelta = -(sweatDelta - 0.3) * 1.2; // sudorese → resfriamento
  const temperature = clamp(36.5 + tempDelta, 34.0, 42.0);

  return { heartRate: hr, systolicBP: sbp, diastolicBP: dbp, respiratoryRate: rr, spO2, temperature };
}

export function calculateBodyState(activeDrugs: ActiveDrug[], now = Date.now()): BodyVisualState {
  if (activeDrugs.length === 0) {
    return {
      heartRateMultiplier: 1, skinVasodilation: 0, pupilNormalized: 0.5,
      bronchialNormalized: 1, sweating: 0, salivation: 0,
      lacrimation: 0, tremor: 0, giMotility: 1,
    };
  }

  let hrMult = 0, skinVaso = 0, pupilDelta = 0, bronchial = 0;
  let sweat = 0, saliva = 0, lacri = 0, tremor = 0, giDelta = 0;

  for (const { drug, dose, administeredAt } of activeDrugs) {
    const decay = decayFactor(administeredAt, drug.halfLifeMinutes, now);
    const f = (dose / drug.maxDose) * decay;
    hrMult     += drug.effects.heartRate        * f;
    skinVaso   += drug.effects.skinVasodilation * f;
    pupilDelta += drug.effects.pupilDilation    * f;
    bronchial  += drug.effects.bronchialDiameter* f;
    sweat      += drug.effects.sweating         * f;
    saliva     += drug.effects.salivation       * f;
    lacri      += drug.effects.lacrimation      * f;
    tremor     += drug.effects.tremor           * f;
    giDelta    += drug.effects.giMotility       * f;
  }

  return {
    heartRateMultiplier: clamp(1 + hrMult / 100, 0.25, 3.5),
    skinVasodilation:    clamp(skinVaso / 100, -1, 1),
    pupilNormalized:     clamp(0.5 + pupilDelta / 200, 0.05, 1),
    bronchialNormalized: clamp(1 + bronchial / 100, 0.25, 2),
    sweating:            clamp(sweat,  0, 1),
    salivation:          clamp(saliva, -1, 1),
    lacrimation:         clamp(lacri,  -1, 1),
    tremor:              clamp(tremor,  0, 1),
    giMotility:          clamp(1 + giDelta / 100, 0.1, 3),
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

// ─── Neurotransmissores ───────────────────────────────────────────────────────
const NT_BASELINE: NTLevels = { ne: 30, ach: 30, da: 15, epi: 8 };

const NT_MAP: Record<string, Partial<NTLevels>> = {
  epinefrina:     { ne: 20, epi: 55 },
  norepinefrina:  { ne: 62, epi: 8  },
  dopamina:       { da: 60, ne: 18  },
  dobutamina:     { ne: 22 },
  salbutamol:     { ne: 10 },
  isoproterenol:  { ne: 18 },
  fenilefrina:    { ne: 28 },
  clonidina:      { ne: -28 },
  propranolol:    { ne: -14 },
  metoprolol:     { ne: -12 },
  atenolol:       { ne: -10 },
  fentolamina:    { ne: -18 },
  prazosina:      { ne: -15 },
  labetalol:      { ne: -20 },
  acetilcolina:   { ach: 62 },
  pilocarpina:    { ach: 48 },
  carbacol:       { ach: 52 },
  betanecol:      { ach: 32 },
  neostigmina:    { ach: 42 },
  fisostigmina:   { ach: 46 },
  atropina:       { ach: -42 },
  escopolamina:   { ach: -32 },
  glicopirrolato: { ach: -36 },
  ipratropio:     { ach: -14 },
  // Variedades
  cigarro:        { ne: 20, ach: 14, da: 12 },
  cafe:           { ne: 12, da: 5   },
  energetico:     { ne: 28, da: 8   },
  chumbinho:      { ach: 75 },
  cocaina:        { ne: 52, da: 46  },
};

export function calculateNTLevels(activeDrugs: ActiveDrug[], now = Date.now()): NTLevels {
  if (activeDrugs.length === 0) return { ...NT_BASELINE };
  let { ne, ach, da, epi } = NT_BASELINE;
  for (const { drug, dose, administeredAt } of activeDrugs) {
    const decay = decayFactor(administeredAt, drug.halfLifeMinutes, now);
    const f = (dose / drug.maxDose) * decay;
    const m = NT_MAP[drug.id];
    if (m) {
      ne  += (m.ne  ?? 0) * f;
      ach += (m.ach ?? 0) * f;
      da  += (m.da  ?? 0) * f;
      epi += (m.epi ?? 0) * f;
    } else {
      if (drug.class === 'agonista_adrenergico')   ne  += 15 * f;
      if (drug.class === 'bloqueador_adrenergico')  ne  -= 10 * f;
      if (drug.class === 'agonista_colinergico')    ach += 30 * f;
      if (drug.class === 'bloqueador_colinergico')  ach -= 25 * f;
    }
  }
  return {
    ne:  clamp(ne,  0, 100),
    ach: clamp(ach, 0, 100),
    da:  clamp(da,  0, 100),
    epi: clamp(epi, 0, 100),
  };
}

export function tempColor(t: number): string {
  if (t >= 36.1 && t <= 37.2) return '#2ecc71';
  if (t >= 37.3 && t <= 38.4) return '#f39c12';
  if (t >= 35.0 && t < 36.1)  return '#3498db';
  if (t < 35.0) return '#2980b9';
  return '#e74c3c'; // ≥ 38.5
}
