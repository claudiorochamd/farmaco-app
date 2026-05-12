import { useState } from 'react';
import { scenarios, type Scenario } from '../data/scenarios';
import { useWindowWidth } from '../hooks/useWindowWidth';

const SEV_LABEL: Record<string, string> = {
  critical: 'Emergência',
  urgent:   'Urgência',
  moderate: 'Eletivo',
};

interface Props {
  onSimulate: (scenario: Scenario) => void;
}

export default function ScenariosPanel({ onSimulate }: Props) {
  const [selected, setSelected] = useState<Scenario | null>(null);
  const width    = useWindowWidth();
  const isMobile = width < 700;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', padding: isMobile ? '16px 12px' : '28px 28px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 10, color: '#e74c3c', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Simulação Clínica
          </span>
          <h2 style={{ margin: '4px 0 6px', fontSize: 22, color: '#e6edf3', fontWeight: 700 }}>
            Cenários Clínicos
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#6e7681', lineHeight: 1.6 }}>
            Selecione um cenário para ver o fármaco correto sendo administrado e observe as mudanças no boneco e nos sinais vitais.
          </p>
        </div>

        {/* Grid de cenários */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 28 }}>
          {scenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => setSelected(sc === selected ? null : sc)}
              style={{
                background: selected?.id === sc.id ? `${sc.color}18` : '#111c2b',
                border: `1px solid ${selected?.id === sc.id ? sc.color : '#21262d'}`,
                borderLeft: `4px solid ${sc.color}`,
                borderRadius: 10,
                padding: '16px 18px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: sc.color, fontWeight: 700, fontSize: 15 }}>{sc.title}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  background: `${sc.color}22`, color: sc.color, border: `1px solid ${sc.color}44`,
                }}>
                  {SEV_LABEL[sc.severity]}
                </span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>
                {sc.situation}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: '#6e7681' }}>Fármaco:</span>
                {sc.drugNames.map(n => (
                  <span key={n} style={{
                    fontSize: 11, fontWeight: 700, color: sc.color,
                    background: `${sc.color}18`, border: `1px solid ${sc.color}44`,
                    borderRadius: 4, padding: '2px 8px',
                  }}>
                    {n}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Detalhe do cenário selecionado */}
        {selected && (
          <div style={{
            background: `${selected.color}10`,
            border: `1px solid ${selected.color}44`,
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: selected.color, marginBottom: 14 }}>
              {selected.title}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 10, color: '#4d6a7a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 6 }}>
                  Justificativa farmacológica
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#c9d1d9', lineHeight: 1.7 }}>
                  {selected.rationale}
                </p>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#4d6a7a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 6 }}>
                  Efeitos esperados no boneco
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {selected.expectedEffects.map((e, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.8 }}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => onSimulate(selected)}
              style={{
                background: `linear-gradient(135deg, ${selected.color}cc, ${selected.color})`,
                border: 'none', borderRadius: 8,
                padding: '11px 32px',
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.02em',
                boxShadow: `0 4px 16px ${selected.color}44`,
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${selected.color}55`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${selected.color}44`;
              }}
            >
              Iniciar simulação
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
