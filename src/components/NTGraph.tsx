import { useEffect, useRef } from 'react';
import type { NTLevels } from '../types';

interface Props { levels: NTLevels; }

const MAX_PTS  = 120;   // 120 pontos × ~0.5s = ~60s de histórico
const FREQ     = 30;    // armazena a cada 30 frames (~0.5s a 60fps)
const LERP     = 0.055; // velocidade de interpolação

const LINES = [
  { key: 'ne'  as keyof NTLevels, label: 'Noradrenalina', color: '#e67e22' },
  { key: 'ach' as keyof NTLevels, label: 'Acetilcolina',  color: '#2ecc71' },
  { key: 'da'  as keyof NTLevels, label: 'Dopamina',      color: '#9b59b6' },
  { key: 'epi' as keyof NTLevels, label: 'Adrenalina',    color: '#e74c3c' },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// Curva suave (catmull-rom → bezier)
function smoothPath(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[]) {
  if (pts.length < 2) return;
  const t = 0.35;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) * t;
    const cp1y = p1.y + (p2.y - p0.y) * t;
    const cp2x = p2.x - (p3.x - p1.x) * t;
    const cp2y = p2.y - (p3.y - p1.y) * t;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

export default function NTGraph({ levels }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const smoothRef   = useRef<NTLevels>({ ...levels });
  const historyRef  = useRef<NTLevels[]>(Array.from({ length: MAX_PTS }, () => ({ ...levels })));
  const levelsRef   = useRef(levels);
  const frameRef    = useRef(0);

  // Mantém levelsRef sempre atualizado
  useEffect(() => { levelsRef.current = levels; }, [levels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    function draw() {
      // Lerp suave em direção ao alvo
      const tgt = levelsRef.current;
      const s   = smoothRef.current;
      smoothRef.current = {
        ne:  lerp(s.ne,  tgt.ne,  LERP),
        ach: lerp(s.ach, tgt.ach, LERP),
        da:  lerp(s.da,  tgt.da,  LERP),
        epi: lerp(s.epi, tgt.epi, LERP),
      };

      // Adiciona ao histórico a cada FREQ frames
      frameRef.current++;
      if (frameRef.current % FREQ === 0) {
        historyRef.current.push({ ...smoothRef.current });
        if (historyRef.current.length > MAX_PTS) historyRef.current.shift();
      }

      const W  = canvas!.width;
      const H  = canvas!.height;
      const PL = 6, PR = 6, PT = 10, PB = 10;
      const pw = W - PL - PR;
      const ph = H - PT - PB;
      const hist = historyRef.current;
      const n    = hist.length;

      // ── Fundo ──────────────────────────────────────────────
      ctx.fillStyle = '#070c12';
      ctx.fillRect(0, 0, W, H);

      // ── Grade sutil ────────────────────────────────────────
      [25, 50, 75].forEach(pct => {
        const yg = PT + ph - (pct / 100) * ph;
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath(); ctx.moveTo(PL, yg); ctx.lineTo(PL + pw, yg); ctx.stroke();
      });
      ctx.setLineDash([]);

      // ── Linha de baseline (30%) ────────────────────────────
      const yBase = PT + ph - 0.3 * ph;
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PL, yBase); ctx.lineTo(PL + pw, yBase); ctx.stroke();

      // ── Linhas dos neurotransmissores ──────────────────────
      LINES.forEach(({ key, color }) => {
        const pts = hist.map((snap, i) => ({
          x: PL + (i / (MAX_PTS - 1)) * pw,
          y: PT + ph - (snap[key] / 100) * ph,
        }));

        // Preenchimento gradiente sob a linha
        const lastPt = pts[pts.length - 1];
        ctx.save();
        ctx.beginPath();
        smoothPath(ctx, pts);
        ctx.lineTo(lastPt.x, PT + ph);
        ctx.lineTo(PL, PT + ph);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, PT, 0, PT + ph);
        grad.addColorStop(0, color + '28');
        grad.addColorStop(1, color + '00');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();

        // Linha
        ctx.save();
        ctx.beginPath();
        smoothPath(ctx, pts);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.restore();

        // Ponto atual (end-of-line dot)
        const cur = smoothRef.current[key];
        const dotY = PT + ph - (cur / 100) * ph;
        ctx.beginPath();
        ctx.arc(PL + pw, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ── Máscara fade nas bordas ────────────────────────────
      const fadeL = ctx.createLinearGradient(PL, 0, PL + 28, 0);
      fadeL.addColorStop(0, '#070c12'); fadeL.addColorStop(1, 'rgba(7,12,18,0)');
      ctx.fillStyle = fadeL;
      ctx.fillRect(PL, PT, 28, ph);

      const fadeR = ctx.createLinearGradient(PL + pw - 12, 0, PL + pw, 0);
      fadeR.addColorStop(0, 'rgba(7,12,18,0)'); fadeR.addColorStop(1, '#070c12');
      ctx.fillStyle = fadeR;
      ctx.fillRect(PL + pw - 12, PT, 12, ph);

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Título */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#4d6a7a', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          Neurotransmissores
        </span>
        <span style={{ fontSize: 9, color: '#2a3a4a' }}>últimos 60s</span>
      </div>

      {/* Canvas */}
      <div style={{ background: '#070c12', borderRadius: 10, overflow: 'hidden', border: '1px solid #0f1d2a' }}>
        <canvas
          ref={canvasRef}
          width={700} height={130}
          style={{ display: 'block', width: '100%', height: 130 }}
        />
      </div>

      {/* Legenda */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
        {LINES.map(({ key, label, color }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 20, height: 2.5, borderRadius: 2,
              background: color, display: 'inline-block',
              boxShadow: `0 0 5px ${color}88`,
              flexShrink: 0,
            }}/>
            <span style={{ fontSize: 10, color: '#6e7681', flex: 1 }}>{label}</span>
            <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color }}>
              {Math.round(levels[key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
