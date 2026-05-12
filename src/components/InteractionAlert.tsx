import type { DrugInteraction } from '../types';

interface Props {
  interactions: DrugInteraction[];
}

const SEV: Record<DrugInteraction['severity'], { bg: string; border: string; textColor: string; badge: string; label: string }> = {
  info:    { bg: 'rgba(52,152,219,0.08)',  border: '#3498db44', textColor: '#3498db', badge: 'i',  label: 'Info' },
  warning: { bg: 'rgba(243,156,18,0.10)', border: '#f39c1244', textColor: '#f39c12', badge: '!',  label: 'Atenção' },
  danger:  { bg: 'rgba(231,76,60,0.12)',  border: '#e74c3c55', textColor: '#e74c3c', badge: '!!', label: 'Perigo' },
};

export default function InteractionAlert({ interactions }: Props) {
  if (interactions.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ color: '#f39c12', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        ! Interações Medicamentosas Detectadas
      </div>
      {interactions.map((inter, i) => {
        const s = SEV[inter.severity];
        return (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: `${s.border}`,
                color: s.textColor, fontWeight: 'bold', fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {s.badge}
              </span>
              <span style={{ color: s.textColor, fontWeight: 'bold', fontSize: 13 }}>
                {inter.title}
              </span>
              <span style={{
                marginLeft: 'auto', fontSize: 10, padding: '2px 8px', borderRadius: 4,
                background: s.border, color: s.textColor,
              }}>
                {s.label}
              </span>
            </div>
            <p style={{ margin: 0, color: '#8b949e', fontSize: 12, lineHeight: 1.6 }}>
              {inter.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
