import { useState } from 'react';
import { loadHistory, clearHistory, type SessionRecord } from '../data/sessionHistory';

export default function SessionHistory() {
  const [records, setRecords] = useState<SessionRecord[]>(loadHistory);

  function handleClear() {
    clearHistory();
    setRecords([]);
  }

  if (records.length === 0) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center', color: '#4d6a7a', fontSize: 13 }}>
        Nenhum cenário concluído ainda.
        <br/>Complete um cenário clínico para ver seu histórico aqui.
      </div>
    );
  }

  const totalSolved = records.filter(r => r.outcome === 'solved').length;
  const avgQuiz     = records.filter(r => r.quizScore !== null);
  const avgScore    = avgQuiz.length > 0
    ? (avgQuiz.reduce((s, r) => s + (r.quizScore ?? 0), 0) / avgQuiz.length).toFixed(1)
    : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0' }}>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { label: 'Cenários',   value: records.length.toString(),  color: '#7fdbff' },
          { label: 'Resolvidos', value: totalSolved.toString(),      color: '#2ecc71' },
          { label: 'Quiz médio', value: `${avgScore}/3`,             color: '#f39c12' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#111c2b', border: `1px solid ${color}33`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'monospace' }}>{value}</div>
            <div style={{ fontSize: 10, color: '#6e7681', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {records.map(r => (
          <div key={r.id} style={{
            background: '#111c2b', border: `1px solid ${r.scenarioColor}33`,
            borderLeft: `3px solid ${r.scenarioColor}`,
            borderRadius: 8, padding: '10px 14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ color: r.scenarioColor, fontWeight: 700, fontSize: 13 }}>{r.scenarioTitle}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: r.outcome === 'solved' ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                color: r.outcome === 'solved' ? '#2ecc71' : '#e74c3c',
              }}>
                {r.outcome === 'solved' ? 'Resolvido' : 'Óbito'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Stat label="Tempo" value={`${r.timeUsed}s`} />
              <Stat label="Tentativas" value={String(r.attempts)} />
              {r.quizScore !== null && <Stat label="Quiz" value={`${r.quizScore}/3`} color={r.quizScore === 3 ? '#2ecc71' : r.quizScore >= 2 ? '#f39c12' : '#e74c3c'} />}
              {r.wrongDrugs.length > 0 && (
                <div style={{ fontSize: 10, color: '#6e7681' }}>
                  Erros: <span style={{ color: '#e74c3c' }}>{r.wrongDrugs.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleClear}
        style={{ alignSelf: 'center', background: 'none', border: '1px solid #30363d', borderRadius: 6, padding: '6px 16px', color: '#6b7280', fontSize: 11, cursor: 'pointer' }}
      >
        Limpar histórico
      </button>
    </div>
  );
}

function Stat({ label, value, color = '#8b949e' }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ fontSize: 10, color: '#4d6a7a' }}>
      {label}: <span style={{ color, fontWeight: 600, fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}
