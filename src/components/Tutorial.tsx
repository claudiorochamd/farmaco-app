import { useState } from 'react';

interface Step {
  color: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tip?: string;
}

const STEPS: Step[] = [
  {
    color: '#2ecc71',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72">
        <rect width="72" height="72" rx="18" fill="rgba(46,204,113,0.12)"/>
        <path d="M8,36 L18,36 L22,18 L27,54 L32,36 L38,36 L42,24 L47,48 L52,36 L64,36"
          fill="none" stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32,26 C32,26 26,22 26,30 C26,35 32,40 36,44 C40,40 46,35 46,30 C46,22 40,26 36,32 C34,30 32,26 32,26Z"
          fill="#e74c3c" opacity="0.85"/>
      </svg>
    ),
    title: 'Bem-vindo ao Farmacologia Interativa',
    description: 'Simulador interativo de farmacologia do sistema nervoso autônomo. Administre fármacos, observe efeitos no boneco e teste seus conhecimentos em cenários clínicos reais.',
    tip: 'Este tutorial guia você pelas principais funcionalidades em menos de 2 minutos.',
  },
  {
    color: '#e67e22',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72">
        <rect width="72" height="72" rx="18" fill="rgba(230,126,34,0.12)"/>
        <rect x="14" y="18" width="44" height="10" rx="5" fill="#e67e22" opacity="0.8"/>
        <rect x="14" y="34" width="30" height="10" rx="5" fill="#e67e22" opacity="0.5"/>
        <rect x="14" y="50" width="38" height="10" rx="5" fill="#e67e22" opacity="0.35"/>
        <circle cx="56" cy="44" r="6" fill="#2ecc71"/>
        <path d="M52,44 L55,47 L60,41" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: 'Painel de Medicamentos',
    description: 'Escolha entre 5 categorias: Agonistas/Bloqueadores Adrenérgicos, Colinérgicos e Variedades (cigarro, café, cocaína). Ajuste a dose com o controle deslizante e clique em Administrar.',
    tip: 'Você pode empilhar múltiplos fármacos para observar interações medicamentosas!',
  },
  {
    color: '#3498db',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72">
        <rect width="72" height="72" rx="18" fill="rgba(52,152,219,0.12)"/>
        <ellipse cx="36" cy="22" rx="10" ry="12" fill="#3498db" opacity="0.7"/>
        <path d="M20,34 C20,34 18,40 18,52 L54,52 C54,40 52,34 52,34 Z" fill="#3498db" opacity="0.5"/>
        <ellipse cx="28" cy="42" rx="5" ry="7" fill="#e74c3c" opacity="0.8"/>
        <ellipse cx="44" cy="42" rx="5" ry="7" fill="#e74c3c" opacity="0.8"/>
        <circle cx="31" cy="22" r="2.5" fill="white" opacity="0.9"/>
        <circle cx="41" cy="22" r="2.5" fill="white" opacity="0.9"/>
        <circle cx="32" cy="22" r="1" fill="#111"/>
        <circle cx="42" cy="22" r="1" fill="#111"/>
      </svg>
    ),
    title: 'O Boneco',
    description: 'Observe mudanças visuais em tempo real: frequência cardíaca, pupilas, cor da pele, brônquios, sudorese, tremor e mais. O boneco pode entrar em cianose, febre ou até morrer por overdose.',
    tip: 'Clique no coração, nos pulmões ou nos olhos para ver os receptores daquele órgão!',
  },
  {
    color: '#00ff88',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72">
        <rect width="72" height="72" rx="18" fill="rgba(0,255,136,0.08)"/>
        <rect x="8" y="22" width="56" height="28" rx="6" fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.3)" strokeWidth="1"/>
        <path d="M10,36 L16,36 L19,26 L22,46 L25,36 L30,36 L33,30 L36,42 L39,36 L42,36"
          fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="44" y1="36" x2="62" y2="36" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
        <rect x="10" y="56" width="52" height="8" rx="4" fill="rgba(231,76,60,0.25)"/>
        <text x="36" y="62.5" textAnchor="middle" fontSize="7" fill="#e74c3c" fontFamily="monospace" fontWeight="bold">! TAQUICARDIA GRAVE</text>
      </svg>
    ),
    title: 'Sinais Vitais',
    description: 'ECG em tempo real, frequência cardíaca, pressão arterial, frequência respiratória, SpO2 e temperatura corporal. Alertas piscantes aparecem quando os parâmetros atingem valores críticos.',
    tip: 'A velocidade do ECG muda conforme a FC — rápido na taquicardia, lento na bradicardia.',
  },
  {
    color: '#9b59b6',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72">
        <rect width="72" height="72" rx="18" fill="rgba(155,89,182,0.12)"/>
        <path d="M10,44 C16,44 18,28 22,36 C26,44 28,20 32,32 C36,44 38,38 42,30 C46,22 48,40 52,36 C56,32 58,42 62,42"
          fill="none" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M10,48 C16,48 18,34 22,40 C26,46 28,28 32,38 C36,48 38,42 42,36 C46,30 48,44 52,40 C56,36 58,46 62,44"
          fill="none" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M10,52 C16,52 18,44 22,46 C26,48 28,40 32,44 C36,48 38,46 42,42 C46,38 48,48 52,46"
          fill="none" stroke="#9b59b6" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M10,38 C16,38 18,24 22,32 C26,40 28,18 32,28 C36,38 38,34 42,26"
          fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      </svg>
    ),
    title: 'Gráfico de Neurotransmissores',
    description: 'Dois gráficos em tempo real mostram como os fármacos alteram o equilíbrio dos neurotransmissores: Simpático (Noradrenalina + Adrenalina) e Parassimpático (Acetilcolina + Dopamina).',
    tip: 'A cocaína dispara NE e DA ao mesmo tempo. O chumbinho faz a ACh explodir.',
  },
  {
    color: '#e74c3c',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72">
        <rect width="72" height="72" rx="18" fill="rgba(231,76,60,0.12)"/>
        <circle cx="36" cy="32" r="16" fill="none" stroke="#e74c3c" strokeWidth="2.5" opacity="0.7"/>
        <path d="M36,20 L36,32 L44,32" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <rect x="14" y="52" width="44" height="12" rx="6" fill="#e74c3c" opacity="0.85"/>
        <text x="36" y="61" textAnchor="middle" fontSize="8.5" fill="white" fontFamily="sans-serif" fontWeight="bold">Iniciar Simulação</text>
      </svg>
    ),
    title: 'Cenários Clínicos',
    description: '7 cenários de emergência: choque anafilático, bradicardia, PCR, crise asmática e mais. Você tem 60 segundos para identificar e administrar o fármaco correto — ou Claudinho vem a óbito.',
    tip: 'Dicas aparecem a 40s, 25s e 10s. Ao salvar o paciente, faça o quiz para consolidar o aprendizado!',
  },
  {
    color: '#7fdbff',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72">
        <rect width="72" height="72" rx="18" fill="rgba(127,219,255,0.10)"/>
        <rect x="14" y="16" width="44" height="40" rx="6" fill="none" stroke="#7fdbff" strokeWidth="2" opacity="0.6"/>
        <path d="M14,28 L58,28" stroke="#7fdbff" strokeWidth="1.5" opacity="0.4"/>
        <rect x="20" y="34" width="24" height="3" rx="1.5" fill="#7fdbff" opacity="0.7"/>
        <rect x="20" y="41" width="18" height="3" rx="1.5" fill="#7fdbff" opacity="0.5"/>
        <rect x="20" y="48" width="20" height="3" rx="1.5" fill="#7fdbff" opacity="0.35"/>
        <circle cx="50" cy="48" r="7" fill="#27ae60"/>
        <path d="M46,48 L49,51 L54,44" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: 'Guia de Aprendizado',
    description: 'Consulte receptores, mecanismos de ação, uso clínico e efeitos colaterais de todos os fármacos — incluindo a transmissão sináptica e comparações entre classes.',
    tip: 'Clique em "Ver no boneco" em qualquer fármaco do guia para simular diretamente!',
  },
  {
    color: '#2ecc71',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72">
        <rect width="72" height="72" rx="18" fill="rgba(46,204,113,0.15)"/>
        <circle cx="36" cy="36" r="20" fill="none" stroke="#2ecc71" strokeWidth="2.5" opacity="0.6"/>
        <path d="M25,36 L32,43 L47,28" stroke="#2ecc71" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: 'Tudo pronto!',
    description: 'Você já conhece todas as funcionalidades. Explore livremente a simulação ou comece pelos Cenários Clínicos para treinar situações de emergência real.',
    tip: undefined,
  },
];

const TOTAL = STEPS.length;

export default function Tutorial({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const isLast = step === TOTAL - 1;

  function finish() {
    localStorage.setItem('farmaco_tutorial_done', '1');
    onClose();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.80)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#111c2b',
        border: `1px solid ${s.color}44`,
        borderTop: `3px solid ${s.color}`,
        borderRadius: 16,
        padding: '32px 28px',
        maxWidth: 440, width: '100%',
        boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 40px ${s.color}18`,
        position: 'relative',
      }}>

        {/* Botão pular */}
        <button
          onClick={finish}
          style={{
            position: 'absolute', top: 14, right: 16,
            background: 'none', border: 'none',
            color: '#4d6a7a', fontSize: 11, cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          Pular tutorial ×
        </button>

        {/* Ícone */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          {s.icon}
        </div>

        {/* Título */}
        <h2 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 700, color: '#e6edf3', textAlign: 'center' }}>
          {s.title}
        </h2>

        {/* Descrição */}
        <p style={{ margin: '0 0 14px', fontSize: 13, color: '#8b949e', lineHeight: 1.75, textAlign: 'center' }}>
          {s.description}
        </p>

        {/* Dica */}
        {s.tip && (
          <div style={{
            background: `${s.color}10`, border: `1px solid ${s.color}33`,
            borderLeft: `3px solid ${s.color}`,
            borderRadius: 7, padding: '9px 12px', marginBottom: 20,
            fontSize: 12, color: '#c9d1d9', lineHeight: 1.6,
          }}>
            {s.tip}
          </div>
        )}
        {!s.tip && <div style={{ marginBottom: 20 }} />}

        {/* Dots de progresso */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 22 }}>
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 20 : 7,
                height: 7, borderRadius: 4,
                background: i === step ? s.color : i < step ? `${s.color}55` : '#21262d',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.25s',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Botões de navegação */}
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8,
                background: 'none', border: '1px solid #21262d',
                color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Anterior
            </button>
          )}
          <button
            onClick={isLast ? finish : () => setStep(s => s + 1)}
            style={{
              flex: 2, padding: '10px 0', borderRadius: 8,
              background: `linear-gradient(135deg, ${s.color}cc, ${s.color})`,
              border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: `0 4px 16px ${s.color}44`,
              transition: 'box-shadow 0.2s',
            }}
          >
            {isLast ? 'Começar a explorar!' : step === 0 ? 'Iniciar tutorial' : 'Próximo'}
          </button>
        </div>

      </div>
    </div>
  );
}
