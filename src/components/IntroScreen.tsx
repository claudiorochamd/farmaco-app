import { useWindowWidth } from '../hooks/useWindowWidth';

interface Props {
  onStart: () => void;
}

const FEATURES = [
  {
    title: 'Administre fármacos',
    desc: 'Selecione o medicamento, ajuste a dose com o slider e clique em Administrar para inserir na corrente sanguínea.',
  },
  {
    title: 'Observe o corpo reagir',
    desc: 'O boneco muda visualmente em tempo real: frequência cardíaca, dilatação pupilar, vasodilatação, sudorese, broncoespasmo e mais.',
  },
  {
    title: 'Monitore os sinais vitais',
    desc: 'Acompanhe FC, pressão arterial, frequência respiratória e SpO2 com alertas de valores críticos e ECG animado.',
  },
  {
    title: 'Interações medicamentosas',
    desc: 'Combine dois ou mais fármacos e veja automaticamente os alertas de interação com explicação farmacológica.',
  },
];

const CLASSES = [
  { label: 'Agonistas Adrenérgicos',    color: '#e67e22', desc: 'Epinefrina, Norepinefrina, Dopamina, Dobutamina, Salbutamol...' },
  { label: 'Bloqueadores Adrenérgicos', color: '#95a5a6', desc: 'Propranolol, Metoprolol, Fentolamina, Labetalol...' },
  { label: 'Agonistas Colinérgicos',    color: '#27ae60', desc: 'Acetilcolina, Pilocarpina, Neostigmina, Fisostigmina...' },
  { label: 'Bloqueadores Colinérgicos', color: '#8e44ad', desc: 'Atropina, Escopolamina, Ipratrópio, Glicopirrolato...' },
];

export default function IntroScreen({ onStart }: Props) {
  const width    = useWindowWidth();
  const isMobile = width < 640;
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      color: '#c9d1d9',
      fontFamily: '"Inter","Segoe UI",system-ui,sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(30,45,61,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,61,0.35) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}/>

      {/* Glow blobs */}
      <div style={{ position:'absolute', top:'10%', left:'15%', width:320, height:320, borderRadius:'50%', background:'rgba(46,204,113,0.04)', filter:'blur(80px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'15%', right:'12%', width:280, height:280, borderRadius:'50%', background:'rgba(230,126,34,0.05)', filter:'blur(80px)', pointerEvents:'none' }}/>

      {/* Card */}
      <div style={{
        position: 'relative',
        background: '#161b22',
        border: '1px solid #21262d',
        borderRadius: isMobile ? 12 : 16,
        padding: isMobile ? '24px 18px' : '40px 48px',
        maxWidth: 800,
        width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <svg width="120" height="28" viewBox="0 0 120 28" style={{ display: 'block', margin: '0 auto 16px' }}>
            <polyline
              points="0,14 18,14 24,4 30,24 36,14 48,14 54,2 60,26 66,14 78,14 84,8 90,20 96,14 120,14"
              fill="none" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          <h1 style={{
            margin: '0 0 8px',
            fontSize: 28,
            fontWeight: 700,
            color: '#e6edf3',
            letterSpacing: '-0.02em',
          }}>
            Farmacologia Interativa
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: '#6e7681' }}>
            Simulador de efeitos farmacológicos do sistema nervoso autônomo
          </p>
        </div>

        {/* Feature grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 10,
          marginBottom: 24,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: '#0d1117',
              border: '1px solid #21262d',
              borderRadius: 10,
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#21262d',
                  color: '#2ecc71',
                  fontSize: 11, fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <span style={{ color: '#e6edf3', fontWeight: 600, fontSize: 13 }}>{f.title}</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Drug classes */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            margin: '0 0 10px',
            fontSize: 11,
            color: '#6e7681',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}>
            Classes farmacológicas disponíveis
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8 }}>
            {CLASSES.map((c, i) => (
              <div key={i} style={{
                background: '#0d1117',
                border: `1px solid ${c.color}33`,
                borderLeft: `3px solid ${c.color}`,
                borderRadius: 8,
                padding: '10px 12px',
              }}>
                <div style={{ color: c.color, fontWeight: 600, fontSize: 12, marginBottom: 2 }}>{c.label}</div>
                <div style={{ color: '#6e7681', fontSize: 11 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <button
            onClick={onStart}
            style={{
              padding: '13px 48px',
              background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 20px rgba(46,204,113,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,204,113,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(46,204,113,0.35)';
            }}
          >
            Começar a Simulação
          </button>
        </div>

        {/* Credits */}
        <div style={{
          borderTop: '1px solid #21262d',
          paddingTop: 20,
          display: 'flex',
          alignItems: isMobile ? 'center' : 'center',
          justifyContent: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 16,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <img
              src="/ufpe.png"
              alt="UFPE"
              style={{ height: 40, objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: '#8b949e' }}>
              Desenvolvido por{' '}
              <span style={{ color: '#e6edf3', fontWeight: 600 }}>Cláudio Rocha</span>
            </p>
            <p style={{ margin: 0, fontSize: 12, color: '#6e7681' }}>
              Estudante de Medicina &mdash; Turma 158 &mdash; Universidade Federal de Pernambuco
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
