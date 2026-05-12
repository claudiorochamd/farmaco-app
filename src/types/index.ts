export type DrugClass =
  | 'agonista_adrenergico'
  | 'bloqueador_adrenergico'
  | 'agonista_colinergico'
  | 'bloqueador_colinergico'
  | 'variedades';

export interface NTLevels {
  ne:  number; // Noradrenalina  0–100
  ach: number; // Acetilcolina   0–100
  da:  number; // Dopamina       0–100
  epi: number; // Adrenalina     0–100
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
}

export interface ActiveDrug {
  instanceId: string;
  drug: Drug;
  dose: number;
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
