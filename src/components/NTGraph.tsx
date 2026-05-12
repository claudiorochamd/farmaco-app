import { useEffect, useRef } from 'react';
import type { NTLevels } from '../types';

interface Props {
  levels: NTLevels;
}

const MAX_POINTS = 60;
const INTERVAL_MS = 2000;

const NT_LINES = [
  { key: 'ne'  as keyof NTLevels, label: 'Noradrenalina', color: '#e67e22' },
  { key: 'ach' as keyof NTLevels, label: 'Acetilcolina',  color: '#2ecc71' },
  { key: 'da'  as keyof NTLevels, label: 'Dopamina',      color: '#9b59b6' },
  { key: 'epi' as keyof NTLevels, label: 'Adrenalina',    color: '#e74c3c' },
];

export default function NTGraph({ levels }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<NTLevels[]>(
    Array(MAX_POINTS).fill(null).map(() => ({ ...levels }))
  );

  // Atualiza histórico a cada 2s
  useEffect(() => {
    const id = setInterval(() => {
      historyRef.current = [...historyRef.current.slice(-(MAX_POINTS - 1)), { ...levels }];
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [levels]);

  // Renderiza o canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    function draw() {
      const W = canvas!.width;
      const H = canvas!.height;
      const PAD = { top: 10, bottom: 24, left: 36, right: 10 };
      const plotW = W - PAD.left - PAD.right;
      const plotH = H - PAD.top  - PAD.bottom;

      ctx.fillStyle = '#0a0f14';
      ctx.fillRect(0, 0, W, H);

      // Grade
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      for (let y = 0; y <= 100; y += 25) {
        const yPx = PAD.top + plotH - (y / 100) * plotH;
        ctx.beginPath(); ctx.moveTo(PAD.left, yPx); ctx.lineTo(PAD.left + plotW, yPx); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '9px monospace';
        ctx.fillText(String(y), 2, yPx + 3);
      }

      // Linhas de neurotransmissores
      const history = historyRef.current;
      const pts = history.length;

      NT_LINES.forEach(({ key, color }) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = color;
        ctx.shadowBlur = 3;
        ctx.beginPath();
        history.forEach((snap, i) => {
          const x = PAD.left + (i / (MAX_POINTS - 1)) * plotW;
          const y = PAD.top + plotH - (snap[key] / 100) * plotH;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Valor atual à direita
        const last = history[pts - 1]?.[key] ?? 0;
        const yEnd = PAD.top + plotH - (last / 100) * plotH;
        ctx.fillStyle = color;
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`${Math.round(last)}`, PAD.left + plotW + 2, yEnd + 3);
      });

      // Linha do tempo (eixo X)
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD.left, PAD.top + plotH);
      ctx.lineTo(PAD.left + plotW, PAD.top + plotH);
      ctx.stroke();

      // Label eixo X
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '9px monospace';
      ctx.fillText(`−${(MAX_POINTS * INTERVAL_MS / 1000)}s`, PAD.left, H - 6);
      ctx.fillText('agora', PAD.left + plotW - 28, H - 6);

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 10, color: '#4d6a7a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
        Neurotransmissores — evolução temporal (%)
      </div>
      <div style={{ background: '#0a0f14', borderRadius: 8, border: '1px solid #1a2535', overflow: 'hidden' }}>
        <canvas ref={canvasRef} width={600} height={130} style={{ display: 'block', width: '100%', height: 130 }}/>
      </div>
      {/* Legenda */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        {NT_LINES.map(({ key, label, color }) => (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10 }}>
            <span style={{ width: 16, height: 2.5, background: color, borderRadius: 2, display: 'inline-block', boxShadow: `0 0 4px ${color}` }}/>
            <span style={{ color: '#8b949e' }}>{label}</span>
            <span style={{ color, fontWeight: 700, fontFamily: 'monospace' }}>
              {Math.round(levels[key])}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
