export type DrugClass =
  | 'agonista_adrenergico'
  | 'bloqueador_adrenergico'
  | 'agonista_colinergico'
  | 'bloqueador_colinergico'
  | 'variedades';

export interface NTLevels {
  ne:  number;
  ach: number;
  da:  number;
  epi: number;
}

export interface DrugEffects {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  pupilDilation: number;
  bronchialDiameter: number;
  skinVasodilation: number;
  sweating: number;
  salivation: number;
  lacrimation: number;
  tremor: number;
  giMotility: number;
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  class: DrugClass;
  subclass: string;
  receptors: string[];
  mechanism: string;
  effects: DrugEffects;
  maxDose: number;
  unit: string;
  color: string;
  halfLifeMinutes: number; // meia-vida em minutos
}

export interface ActiveDrug {
  instanceId: string;
  drug: Drug;
  dose: number;
  administeredAt: number; // timestamp Date.now()
}

export interface VitalSigns {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  respiratoryRate: number;
  spO2: number;
  temperature: number;
}

export interface BodyVisualState {
  heartRateMultiplier: number;
  skinVasodilation: number;
  pupilNormalized: number;
  bronchialNormalized: number;
  sweating: number;
  salivation: number;
  lacrimation: number;
  tremor: number;
  giMotility: number;
}

export interface DrugInteraction {
  drugIds: [string, string];
  severity: 'info' | 'warning' | 'danger';
  title: string;
  description: string;
}
