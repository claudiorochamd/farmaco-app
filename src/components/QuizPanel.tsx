import { useState } from 'react';
import type { QuizQuestion } from '../data/quiz';

interface Props {
  questions: QuizQuestion[];
  scenarioTitle: string;
  scenarioColor: string;
  onComplete: (score: number) => void;
}

export default function QuizPanel({ questions, scenarioTitle, scenarioColor, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showExp, setShowExp] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setShowExp(true);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  }

  function handleNext() {
    if (isLast) {
      onComplete(score + (selected === q.correctIndex ? 1 : 0));
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExp(false);
    }
  }

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ maxWidth: 520, width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: scenarioColor, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>
            Quiz — {scenarioTitle}
          </div>
          {/* Progresso */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i < current
                  ? (answers[i] === questions[i].correctIndex ? '#2ecc71' : '#e74c3c')
                  : i === current ? scenarioColor : '#21262d',
                transition: 'background 0.3s',
              }}/>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#4d6a7a' }}>
            Questão {current + 1} de {questions.length}
          </div>
        </div>

        {/* Pergunta */}
        <div style={{
          background: '#111c2b', border: `1px solid ${scenarioColor}44`,
          borderRadius: 12, padding: '20px 22px', marginBottom: 14,
        }}>
          <p style={{ margin: 0, fontSize: 14, color: '#e6edf3', lineHeight: 1.7, fontWeight: 500 }}>
            {q.question}
          </p>
        </div>

        {/* Opções */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {q.options.map((opt, idx) => {
            let bg = '#111c2b';
            let border = '#21262d';
            let textColor = '#c9d1d9';
            if (selected !== null) {
              if (idx === q.correctIndex) { bg = 'rgba(46,204,113,0.12)'; border = '#2ecc71'; textColor = '#2ecc71'; }
              else if (idx === selected) { bg = 'rgba(231,76,60,0.12)'; border = '#e74c3c'; textColor = '#e74c3c'; }
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                style={{
                  background: bg, border: `1px solid ${border}`,
                  borderRadius: 8, padding: '11px 14px',
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  cursor: selected !== null ? 'default' : 'pointer',
                  textAlign: 'left', transition: 'all 0.2s',
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: selected !== null && idx === q.correctIndex ? '#2ecc71'
                    : selected === idx ? '#e74c3c' : '#1e2d3d',
                  color: selected !== null && (idx === q.correctIndex || idx === selected) ? '#fff' : '#6b7280',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {optionLabels[idx]}
                </span>
                <span style={{ fontSize: 13, color: textColor, lineHeight: 1.5 }}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explicação */}
        {showExp && (
          <div style={{
            background: selected === q.correctIndex ? 'rgba(46,204,113,0.08)' : 'rgba(231,76,60,0.08)',
            border: `1px solid ${selected === q.correctIndex ? '#2ecc7133' : '#e74c3c33'}`,
            borderRadius: 8, padding: '12px 14px', marginBottom: 14,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: selected === q.correctIndex ? '#2ecc71' : '#e74c3c', marginBottom: 4 }}>
              {selected === q.correctIndex ? 'Correto!' : 'Incorreto'}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#c9d1d9', lineHeight: 1.7 }}>
              {q.explanation}
            </p>
          </div>
        )}

        {/* Botão avançar */}
        {selected !== null && (
          <button
            onClick={handleNext}
            style={{
              width: '100%', padding: '11px 0', borderRadius: 8,
              background: isLast ? `linear-gradient(135deg, ${scenarioColor}cc, ${scenarioColor})` : '#21262d',
              border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {isLast ? 'Ver resultado' : 'Próxima questão'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Tela de resultado do quiz ────────────────────────────────────────────────
export function QuizResult({
  score, total,
  onRetry, onBack,
}: { score: number; total: number; scenarioColor?: string; onRetry: () => void; onBack: () => void }) {
  const pct = Math.round((score / total) * 100);
  const msg = pct === 100 ? 'Excelente! Domínio completo!' : pct >= 66 ? 'Bom trabalho! Revise os pontos errados.' : 'Continue estudando — reveja o guia de aprendizado.';
  const color = pct === 100 ? '#2ecc71' : pct >= 66 ? '#f39c12' : '#e74c3c';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 52, fontWeight: 800, color, marginBottom: 4 }}>
          {score}/{total}
        </div>
        <div style={{ fontSize: 15, color: '#e6edf3', fontWeight: 600, marginBottom: 8 }}>{msg}</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 28 }}>
          {pct}% de aproveitamento no quiz
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onRetry} style={{ background: '#2ecc71', border: 'none', borderRadius: 8, padding: '10px 22px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Tentar novamente
          </button>
          <button onClick={onBack} style={{ background: 'none', border: '1px solid #30363d', borderRadius: 8, padding: '10px 22px', color: '#8b949e', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Próximo cenário
          </button>
        </div>
      </div>
    </div>
  );
}
