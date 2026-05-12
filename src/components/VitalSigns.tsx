import type { VitalSigns } from '../types';
import { vitalColor } from '../utils/pharmacology';
import EcgDisplay from './EcgDisplay';

interface Props {
  vitals: VitalSigns;
}

export default function VitalSignsPanel({ vitals }: Props) {
  const hrColor   = vitalColor(vitals.heartRate,       [60, 100], [40, 150]);
  const sbpColor  = vitalColor(vitals.systolicBP,      [90, 140], [70, 180]);
  const dbpColor  = vitalColor(vitals.diastolicBP,     [60, 90],  [50, 110]);
  const rrColor   = vitalColor(vitals.respiratoryRate, [12, 20],  [8, 30]);
  const spO2Color = vitalColor(vitals.spO2,            [95, 100], [90, 95]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h2 style={{ color: '#7fdbff', fontSize: 13, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Sinais Vitais
      </h2>

      <EcgDisplay heartRate={vitals.heartRate} spO2={vitals.spO2} />

      <VitalCard
        label="Frequência Cardíaca"
        abbr="FC"
        value={Math.round(vitals.heartRate)}
        unit="bpm"
        color={hrColor}
        normal="60–100"
        bar={{ value: vitals.heartRate, min: 0, max: 250 }}
      />

      {/* Pressão Arterial */}
      <div style={{ background: '#111c2b', borderRadius: 8, padding: '10px 12px', border: `1px solid ${sbpColor}44` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: sbpColor, fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold' }}>PA</span>
            <span style={{ color: '#aaa', fontSize: 11 }}>Pressão Arterial</span>
          </span>
          <span style={{ color: '#555', fontSize: 10 }}>Normal: 90–140 / 60–90</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ color: sbpColor, fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace' }}>
            {Math.round(vitals.systolicBP)}
          </span>
          <span style={{ color: '#555', fontSize: 18 }}>/</span>
          <span style={{ color: dbpColor, fontSize: 20, fontFamily: 'monospace' }}>
            {Math.round(vitals.diastolicBP)}
          </span>
          <span style={{ color: '#666', fontSize: 12, marginLeft: 4 }}>mmHg</span>
        </div>
        <div style={{ marginTop: 6, height: 4, background: '#1a2535', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${(vitals.systolicBP / 300) * 100}%`,
            height: '100%', background: sbpColor, borderRadius: 2, transition: 'width 0.5s ease',
          }}/>
        </div>
      </div>

      <VitalCard
        label="Frequência Respiratória"
        abbr="FR"
        value={Math.round(vitals.respiratoryRate)}
        unit="rpm"
        color={rrColor}
        normal="12–20"
        bar={{ value: vitals.respiratoryRate, min: 0, max: 50 }}
      />

      <VitalCard
        label="Saturação O2"
        abbr="SpO2"
        value={vitals.spO2.toFixed(1)}
        unit="%"
        color={spO2Color}
        normal="≥95"
        bar={{ value: vitals.spO2, min: 60, max: 100 }}
      />

      {vitals.heartRate  > 150 && <Alert text="TAQUICARDIA GRAVE" />}
      {vitals.heartRate  < 40  && <Alert text="BRADICARDIA GRAVE" />}
      {vitals.systolicBP > 180 && <Alert text="HIPERTENSÃO GRAVE" />}
      {vitals.systolicBP < 70  && <Alert text="HIPOTENSÃO GRAVE" />}
      {vitals.spO2       < 90  && <Alert text="HIPOXEMIA" />}
    </div>
  );
}

function VitalCard({ label, abbr, value, unit, color, normal, bar }: {
  label: string; abbr: string; value: string | number; unit: string;
  color: string; normal: string; bar: { value: number; min: number; max: number };
}) {
  const pct = Math.min(100, Math.max(0, ((bar.value - bar.min) / (bar.max - bar.min)) * 100));
  return (
    <div style={{ background: '#111c2b', borderRadius: 8, padding: '10px 12px', border: `1px solid ${color}44` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color, fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold' }}>{abbr}</span>
          <span style={{ color: '#aaa', fontSize: 11 }}>{label}</span>
        </span>
        <span style={{ color: '#555', fontSize: 10 }}>Normal: {normal}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ color, fontSize: 26, fontWeight: 'bold', fontFamily: 'monospace', transition: 'color 0.5s' }}>
          {value}
        </span>
        <span style={{ color: '#666', fontSize: 12 }}>{unit}</span>
      </div>
      <div style={{ marginTop: 6, height: 4, background: '#1a2535', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.5s ease' }}/>
      </div>
    </div>
  );
}

function Alert({ text }: { text: string }) {
  return (
    <div style={{
      background: 'rgba(231,76,60,0.12)', border: '1px solid #e74c3c',
      borderRadius: 6, padding: '6px 12px', color: '#e74c3c', fontSize: 12,
      fontWeight: 'bold', textAlign: 'center', letterSpacing: '0.05em',
      animation: 'pulse 1s ease-in-out infinite',
    }}>
      ! {text}
    </div>
  );
}
