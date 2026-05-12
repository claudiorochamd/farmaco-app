import { useEffect, useRef } from 'react';

interface Props {
  heartRate: number;
  spO2: number;
}

const ECG_WIDTH = 600;
const ECG_HEIGHT = 100;
const TRACE_COLOR = '#00ff88';

function ecgSample(phase: number): number {
  // phase 0..1 = one complete cardiac cycle
  const y = 0;
  if (phase < 0.08) return 0;
  // P wave
  if (phase < 0.18) {
    const t = (phase - 0.08) / 0.10;
    return 14 * Math.sin(Math.PI * t);
  }
  if (phase < 0.26) return 0;
  // Q
  if (phase < 0.29) {
    const t = (phase - 0.26) / 0.03;
    return -9 * t;
  }
  // R up
  if (phase < 0.32) {
    const t = (phase - 0.29) / 0.03;
    return -9 + 115 * t;
  }
  // R down
  if (phase < 0.36) {
    const t = (phase - 0.32) / 0.04;
    return 106 - 135 * t;
  }
  // S back to baseline
  if (phase < 0.39) {
    const t = (phase - 0.36) / 0.03;
    return -29 + 29 * t;
  }
  // ST
  if (phase < 0.48) return 0;
  // T wave
  if (phase < 0.70) {
    const t = (phase - 0.48) / 0.22;
    return 32 * Math.sin(Math.PI * t);
  }
  return y;
}

export default function EcgDisplay({ heartRate, spO2 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ xOffset: 0, lastTime: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    const pixelsPerSecond = 150;

    function draw(timestamp: number) {
      if (!stateRef.current.lastTime) stateRef.current.lastTime = timestamp;
      const delta = Math.min(timestamp - stateRef.current.lastTime, 50);
      stateRef.current.lastTime = timestamp;
      stateRef.current.xOffset += (pixelsPerSecond * delta) / 1000;

      const w = canvas!.width;
      const h = canvas!.height;
      const midY = h / 2 + 10;
      const cyclePx = (pixelsPerSecond * 60) / heartRate;

      ctx.fillStyle = '#0a0f14';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(0,255,136,0.07)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // ECG trace
      ctx.strokeStyle = TRACE_COLOR;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = TRACE_COLOR;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      let started = false;
      for (let px = 0; px < w; px++) {
        const globalX = px + stateRef.current.xOffset;
        const phase = (globalX % cyclePx) / cyclePx;
        const amplitude = ecgSample(phase);
        const py = midY - amplitude * 0.38;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Wipe leading edge
      const grad = ctx.createLinearGradient(w - 40, 0, w, 0);
      grad.addColorStop(0, 'rgba(10,15,20,0)');
      grad.addColorStop(1, 'rgba(10,15,20,1)');
      ctx.fillStyle = grad;
      ctx.fillRect(w - 40, 0, 40, h);

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [heartRate]);

  const hrColor = heartRate < 60 || heartRate > 100
    ? heartRate < 40 || heartRate > 150 ? '#e74c3c' : '#f39c12'
    : '#2ecc71';
  const spO2Color = spO2 < 90 ? '#e74c3c' : spO2 < 95 ? '#f39c12' : '#2ecc71';

  return (
    <div style={{ background: '#0a0f14', borderRadius: 8, overflow: 'hidden', border: '1px solid #1a2535', position: 'relative' }}>
      <canvas ref={canvasRef} width={ECG_WIDTH} height={ECG_HEIGHT} style={{ display: 'block', width: '100%', height: ECG_HEIGHT }}/>
      <div style={{ position: 'absolute', top: 6, right: 10, display: 'flex', gap: 16, fontSize: 12 }}>
        <span style={{ color: hrColor, fontFamily: 'monospace', fontWeight: 'bold' }}>
          FC  {Math.round(heartRate)} bpm
        </span>
        <span style={{ color: spO2Color, fontFamily: 'monospace', fontWeight: 'bold' }}>
          SpO₂ {spO2.toFixed(0)}%
        </span>
      </div>
      <div style={{ position: 'absolute', top: 6, left: 10, color: 'rgba(0,255,136,0.5)', fontSize: 10, fontFamily: 'monospace' }}>
        ECG II
      </div>
    </div>
  );
}
