import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUÇÕES PARA CONFIGURAR O FORMSPREE:
// 1. Acesse https://formspree.io e crie uma conta com rhuansoliveira2828@gmail.com
// 2. Clique em "New Form" → copie o Form ID (ex: "xzbqeabc")
// 3. Substitua 'SEU_FORM_ID' abaixo pelo ID real
// As respostas chegam no seu email automaticamente.
// ─────────────────────────────────────────────────────────────────────────────
const FORMSPREE_ID = 'xoqgknpb'; // ← substitua pelo seu Form ID

interface Props {
  onClose: () => void;
}

export default function FeedbackForm({ onClose }: Props) {
  const [rating, setRating]       = useState(0);
  const [helps, setHelps]         = useState(0);
  const [feature, setFeature]     = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [status, setStatus]       = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || helps === 0) return;
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          avaliacao_geral: rating,
          ajudou_aprendizado: helps,
          melhor_funcionalidade: feature,
          sugestao: suggestion || '(sem sugestão)',
          origem: 'Farmacologia Interativa — farmacologia-app.vercel.app',
        }),
      });
      if (res.ok) setStatus('sent');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  const stars = [1, 2, 3, 4, 5];
  const FEATURES = [
    'Boneco interativo',
    'Cenários clínicos',
    'Quiz pós-cenário',
    'Guia de aprendizado',
    'Gráfico de neurotransmissores',
    'Farmacocinética (meia-vida)',
    'Interações medicamentosas',
    'Variedades (cigarro, café, cocaína…)',
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#111c2b', border: '1px solid #2ecc7133', borderTop: '3px solid #2ecc71',
        borderRadius: 16, padding: '28px 26px', maxWidth: 420, width: '100%',
        position: 'relative', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:16, background:'none', border:'none', color:'#4d6a7a', cursor:'pointer', fontSize:18 }}>×</button>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#2ecc71', marginBottom: 8 }}>Obrigado pelo feedback!</div>
            <p style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.7, marginBottom: 20 }}>
              Suas respostas foram enviadas anonimamente e serão usadas para melhorar o app como projeto de iniciação científica.
            </p>
            <button onClick={onClose} style={{ background: '#2ecc71', border: 'none', borderRadius: 8, padding: '10px 28px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ fontSize: 11, color: '#2ecc71', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>
              Avaliação Anônima
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#e6edf3' }}>
              Como foi sua experiência?
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: 11, color: '#4d6a7a' }}>
              Suas respostas são completamente anônimas e ajudam o projeto de IC.
            </p>

            {/* Avaliação geral */}
            <Label>Como você avalia o app no geral?</Label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {stars.map(s => (
                <button key={s} type="button" onClick={() => setRating(s)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 20,
                    background: s <= rating ? 'rgba(46,204,113,0.18)' : '#0d1117',
                    outline: s <= rating ? '1px solid #2ecc7155' : '1px solid #21262d',
                    transition: 'all 0.15s',
                  }}>
                  {s <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>

            {/* Ajudou no aprendizado */}
            <Label>O app facilitou seu entendimento de farmacologia?</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 18 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setHelps(n)}
                  style={{
                    padding: '7px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: helps === n ? '#2ecc7130' : '#0d1117',
                    outline: helps === n ? '1px solid #2ecc71' : '1px solid #21262d',
                    color: helps === n ? '#2ecc71' : '#6b7280',
                    fontSize: 12, fontWeight: helps === n ? 700 : 400, transition: 'all 0.15s',
                  }}>
                  {n === 1 ? 'Nada' : n === 2 ? 'Pouco' : n === 3 ? 'Médio' : n === 4 ? 'Muito' : 'Total'}
                </button>
              ))}
            </div>

            {/* Melhor funcionalidade */}
            <Label>Qual funcionalidade você mais gostou? (opcional)</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {FEATURES.map(f => (
                <button key={f} type="button" onClick={() => setFeature(prev => prev === f ? '' : f)}
                  style={{
                    padding: '5px 10px', borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: 11,
                    background: feature === f ? 'rgba(127,219,255,0.15)' : '#0d1117',
                    outline: feature === f ? '1px solid #7fdbff55' : '1px solid #21262d',
                    color: feature === f ? '#7fdbff' : '#6b7280',
                    transition: 'all 0.15s',
                  }}>
                  {f}
                </button>
              ))}
            </div>

            {/* Sugestão livre */}
            <Label>Sugestão ou comentário livre (opcional)</Label>
            <textarea
              value={suggestion}
              onChange={e => setSuggestion(e.target.value)}
              placeholder="O que poderia ser melhorado?"
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                background: '#0d1117', border: '1px solid #21262d',
                color: '#c9d1d9', fontSize: 12, resize: 'vertical',
                fontFamily: 'inherit', outline: 'none', marginBottom: 20,
                boxSizing: 'border-box',
              }}
            />

            <button
              type="submit"
              disabled={rating === 0 || helps === 0 || status === 'sending'}
              style={{
                width: '100%', padding: '11px 0', borderRadius: 8,
                background: rating > 0 && helps > 0 ? 'linear-gradient(135deg,#27ae60,#2ecc71)' : '#1a2535',
                border: 'none', color: rating > 0 && helps > 0 ? '#fff' : '#4d6a7a',
                fontSize: 13, fontWeight: 700, cursor: rating > 0 && helps > 0 ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              {status === 'sending' ? 'Enviando…' : 'Enviar feedback anônimo'}
            </button>

            {status === 'error' && (
              <p style={{ color: '#e74c3c', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
                Erro ao enviar. Verifique a conexão ou tente novamente.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 8, fontWeight: 500 }}>{children}</div>;
}
