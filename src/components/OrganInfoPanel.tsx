type OrganKey = 'heart' | 'lungs' | 'eyes';

interface OrganReceptor {
  name: string;
  system: 'simpático' | 'parassimpático';
  effect: string;
  drugs: string[];
  drugColor: string;
}

interface OrganData {
  label: string;
  description: string;
  receptors: OrganReceptor[];
}

const ORGAN_DATA: Record<OrganKey, OrganData> = {
  heart: {
    label: 'Coração',
    description: 'O coração recebe inervação dupla. O simpático aumenta sua atividade; o parassimpático a reduz.',
    receptors: [
      {
        name: 'β1',
        system: 'simpático',
        effect: 'Cronotropismo +, Inotropismo +, Dromotropismo + (↑FC, ↑força, ↑condução)',
        drugs: ['Epinefrina', 'Norepinefrina', 'Dopamina', 'Dobutamina', 'Isoproterenol'],
        drugColor: '#e67e22',
      },
      {
        name: 'M2',
        system: 'parassimpático',
        effect: 'Cronotropismo −, Dromotropismo − (↓FC, ↓condução AV)',
        drugs: ['Acetilcolina', 'Pilocarpina', 'Carbacol', 'Chumbinho', 'Fisostigmina'],
        drugColor: '#27ae60',
      },
    ],
  },
  lungs: {
    label: 'Brônquios / Pulmões',
    description: 'A musculatura lisa brônquica é controlada pelo equilíbrio entre β2 (dilatação) e M3 (constrição).',
    receptors: [
      {
        name: 'β2',
        system: 'simpático',
        effect: 'Broncodilatação — relaxamento da musculatura lisa brônquica',
        drugs: ['Salbutamol', 'Isoproterenol', 'Epinefrina', 'Salmeterol'],
        drugColor: '#e67e22',
      },
      {
        name: 'M3',
        system: 'parassimpático',
        effect: 'Broncoconstrição + broncorreia (secreção brônquica aumentada)',
        drugs: ['Acetilcolina', 'Pilocarpina', 'Chumbinho', 'Fisostigmina', 'Carbacol'],
        drugColor: '#27ae60',
      },
    ],
  },
  eyes: {
    label: 'Pupilas / Olhos',
    description: 'A pupila tem dois músculos antagônicos com inervações opostas. O tamanho pupilar reflete o equilíbrio simpático-parassimpático.',
    receptors: [
      {
        name: 'α1',
        system: 'simpático',
        effect: 'Midríase — contração do músculo radial da íris (dilatação pupilar)',
        drugs: ['Fenilefrina', 'Epinefrina', 'Norepinefrina', 'Cocaína'],
        drugColor: '#e67e22',
      },
      {
        name: 'M3',
        system: 'parassimpático',
        effect: 'Miose — contração do músculo constritor da pupila + acomodação do cristalino',
        drugs: ['Pilocarpina', 'Carbacol', 'Chumbinho', 'Fisostigmina'],
        drugColor: '#27ae60',
      },
    ],
  },
};

interface Props {
  organ: OrganKey;
  onClose: () => void;
}

const SYS_COLOR = { 'simpático': '#e67e22', 'parassimpático': '#27ae60' };

export default function OrganInfoPanel({ organ, onClose }: Props) {
  const data = ORGAN_DATA[organ];

  return (
    <div style={{
      position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
      zIndex: 40, width: 'calc(100% - 16px)', maxWidth: 360,
      background: '#111c2b', border: '1px solid #1e2d3d',
      borderRadius: 12, padding: '14px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#e6edf3' }}>{data.label}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 2 }}>×</button>
      </div>
      <p style={{ margin: '0 0 12px', fontSize: 11, color: '#6e7681', lineHeight: 1.6 }}>{data.description}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.receptors.map(rec => (
          <div key={rec.name} style={{
            background: '#0d1117', borderRadius: 8, padding: '10px 12px',
            border: `1px solid ${SYS_COLOR[rec.system]}33`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: SYS_COLOR[rec.system] }}>{rec.name}</span>
              <span style={{ fontSize: 9, color: SYS_COLOR[rec.system], textTransform: 'uppercase', letterSpacing: '0.08em', background: `${SYS_COLOR[rec.system]}18`, borderRadius: 3, padding: '1px 5px' }}>{rec.system}</span>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: '#c9d1d9', lineHeight: 1.5 }}>{rec.effect}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {rec.drugs.map(d => (
                <span key={d} style={{ fontSize: 10, color: rec.drugColor, background: `${rec.drugColor}15`, border: `1px solid ${rec.drugColor}33`, borderRadius: 4, padding: '1px 6px' }}>{d}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { OrganKey };
