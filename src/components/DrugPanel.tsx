import { useState } from 'react';
import type { Drug, DrugClass } from '../types';
import { drugsByClass } from '../data/drugs';

interface Props {
  onAdminister: (drug: Drug, dose: number) => void;
}

const CLASS_INFO: Record<DrugClass, { label: string; color: string }> = {
  agonista_adrenergico:   { label: 'Agonistas Adrenérgicos',   color: '#e67e22' },
  bloqueador_adrenergico: { label: 'Bloqueadores Adrenérgicos', color: '#95a5a6' },
  agonista_colinergico:   { label: 'Agonistas Colinérgicos',   color: '#27ae60' },
  bloqueador_colinergico: { label: 'Bloqueadores Colinérgicos', color: '#8e44ad' },
};

const CLASSES: DrugClass[] = [
  'agonista_adrenergico',
  'bloqueador_adrenergico',
  'agonista_colinergico',
  'bloqueador_colinergico',
];

export default function DrugPanel({ onAdminister }: Props) {
  const [activeClass, setActiveClass] = useState<DrugClass>('agonista_adrenergico');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [dose, setDose] = useState(0.5);

  const drugs = drugsByClass[activeClass];
  const info  = CLASS_INFO[activeClass];

  function handleClassChange(cls: DrugClass) {
    setActiveClass(cls);
    setSelectedDrug(null);
    setDose(0.5);
  }

  function handleSelectDrug(d: Drug) {
    setSelectedDrug(d);
    setDose(d.maxDose * 0.3);
  }

  function handleAdminister() {
    if (!selectedDrug) return;
    onAdminister(selectedDrug, dose);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <h2 style={{ color: '#7fdbff', fontSize: 13, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Medicamentos
      </h2>

      {/* Class tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {CLASSES.map(cls => {
          const ci = CLASS_INFO[cls];
          const active = activeClass === cls;
          return (
            <button
              key={cls}
              onClick={() => handleClassChange(cls)}
              style={{
                background: active ? `${ci.color}20` : '#111c2b',
                border: `1px solid ${active ? ci.color : '#1e2d3d'}`,
                borderLeft: `3px solid ${active ? ci.color : '#1e2d3d'}`,
                borderRadius: 6,
                padding: '7px 10px',
                color: active ? ci.color : '#6b7280',
                fontSize: 12,
                fontWeight: active ? 'bold' : 'normal',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              {ci.label}
            </button>
          );
        })}
      </div>

      {/* Drug list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
        {drugs.map(d => (
          <button
            key={d.id}
            onClick={() => handleSelectDrug(d)}
            style={{
              background: selectedDrug?.id === d.id ? `${info.color}20` : '#0d1821',
              border: `1px solid ${selectedDrug?.id === d.id ? info.color : '#1e2d3d'}`,
              borderRadius: 6, padding: '8px 10px',
              color: selectedDrug?.id === d.id ? info.color : '#c9d1d9',
              fontSize: 12, cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{d.name}</div>
            <div style={{ fontSize: 10, color: '#8b949e', marginTop: 2 }}>{d.subclass}</div>
            <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>
              {d.receptors.join(', ')}
            </div>
          </button>
        ))}
      </div>

      {/* Selected drug detail + dose */}
      {selectedDrug && (
        <div style={{ background: '#111c2b', borderRadius: 8, padding: 12, border: `1px solid ${info.color}44` }}>
          <div style={{ color: info.color, fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
            {selectedDrug.name}
          </div>
          <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 8, lineHeight: 1.5 }}>
            {selectedDrug.mechanism}
          </div>

          {/* Dose slider */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa', marginBottom: 4 }}>
              <span>Dose</span>
              <span style={{ color: info.color, fontWeight: 'bold' }}>
                {dose.toFixed(dose < 1 ? 2 : 1)} {selectedDrug.unit}
              </span>
            </div>
            <input
              type="range"
              min={selectedDrug.maxDose * 0.05}
              max={selectedDrug.maxDose}
              step={selectedDrug.maxDose / 100}
              value={dose}
              onChange={e => setDose(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: info.color }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#555' }}>
              <span>Min</span>
              <span>Max: {selectedDrug.maxDose} {selectedDrug.unit}</span>
            </div>
          </div>

          {/* Effect badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            <EffectBadge label="FC"       value={selectedDrug.effects.heartRate}        unit="%" />
            <EffectBadge label="PAS"      value={selectedDrug.effects.systolicBP}       unit="%" />
            <EffectBadge label="Brônquio" value={selectedDrug.effects.bronchialDiameter} unit="%" />
            <EffectBadge label="Pupila"   value={selectedDrug.effects.pupilDilation}    unit="%" />
            {selectedDrug.effects.sweating   >  0.2 && <EffectBadge label="Sudorese"   value={1}  unit="" positive />}
            {selectedDrug.effects.salivation >  0.2 && <EffectBadge label="Sialorréia" value={1}  unit="" positive />}
            {selectedDrug.effects.sweating   < -0.2 && <EffectBadge label="Anhidrose"  value={-1} unit="" />}
            {selectedDrug.effects.salivation < -0.2 && <EffectBadge label="Boca seca"  value={-1} unit="" />}
          </div>

          <button
            onClick={handleAdminister}
            style={{
              width: '100%', padding: '9px 0', borderRadius: 6,
              background: info.color, border: 'none',
              color: '#fff', fontSize: 13, fontWeight: 'bold', cursor: 'pointer',
              letterSpacing: '0.04em', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Administrar
          </button>
        </div>
      )}
    </div>
  );
}

function EffectBadge({ label, value, unit, positive }: {
  label: string; value: number; unit: string; positive?: boolean;
}) {
  const up    = value > 0 || positive;
  const color = up ? '#2ecc71' : '#e74c3c';
  const arrow = up ? '▲' : '▼';
  const display = unit ? `${arrow} ${Math.abs(value)}${unit}` : arrow;
  return (
    <span style={{
      background: `${color}18`, border: `1px solid ${color}55`,
      borderRadius: 4, padding: '2px 6px', fontSize: 10, color,
    }}>
      {label} {display}
    </span>
  );
}
