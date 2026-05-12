import { useState, useEffect } from 'react';
import type { ActiveDrug } from '../types';
import { decayFactor } from '../utils/pharmacology';

const CLASS_COLORS: Record<string, string> = {
  agonista_adrenergico:  '#e67e22',
  bloqueador_adrenergico:'#95a5a6',
  agonista_colinergico:  '#27ae60',
  bloqueador_colinergico:'#8e44ad',
  variedades:            '#e8c07d',
};

interface Props {
  activeDrugs: ActiveDrug[];
  onRemove: (instanceId: string) => void;
  onClearAll: () => void;
}

function formatHalfLife(min: number): string {
  if (min < 1)  return `${Math.round(min * 60)}s`;
  if (min < 60) return `${min % 1 === 0 ? min : min.toFixed(1)} min`;
  const h = min / 60;
  return `${h % 1 === 0 ? h : h.toFixed(1)}h`;
}

export default function ActiveDrugsList({ activeDrugs, onRemove, onClearAll }: Props) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (activeDrugs.length === 0) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [activeDrugs.length]);

  if (activeDrugs.length === 0) {
    return (
      <div style={{
        background:'#0d1117', border:'1px dashed #1e2d3d',
        borderRadius:8, padding:'14px 20px',
        color:'#4b5563', fontSize:12, textAlign:'center',
      }}>
        Nenhum medicamento na corrente sanguínea
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ color:'#7fdbff', fontSize:12, fontWeight:'bold', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          Corrente Sanguínea
        </span>
        <button
          onClick={onClearAll}
          style={{
            background:'rgba(231,76,60,0.12)', border:'1px solid #e74c3c55',
            borderRadius:4, padding:'3px 10px', color:'#e74c3c',
            fontSize:11, cursor:'pointer',
          }}
        >
          Limpar tudo
        </button>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {activeDrugs.map(ad => {
          const color = CLASS_COLORS[ad.drug.class] ?? '#aaa';
          const dosePct = Math.round((ad.dose / ad.drug.maxDose) * 100);
          const decay   = decayFactor(ad.administeredAt, ad.drug.halfLifeMinutes);
          const remaining = Math.round(decay * 100);
          const isAlmostGone = remaining < 20;
          const hl = ad.drug.halfLifeMinutes;

          return (
            <div
              key={ad.instanceId}
              style={{
                background:`${color}14`, border:`1px solid ${color}${isAlmostGone ? '33' : '55'}`,
                borderRadius:8, padding:'8px 12px',
                display:'flex', alignItems:'center', gap:10,
                minWidth:200, opacity: isAlmostGone ? 0.7 : 1,
                transition: 'opacity 0.5s',
              }}
            >
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ color, fontWeight:'bold', fontSize:13 }}>{ad.drug.name}</div>
                  <div style={{ fontSize:10, color: isAlmostGone ? '#e74c3c' : `${color}99`, fontFamily:'monospace' }}>
                    {remaining}% {isAlmostGone ? '↓' : ''}
                  </div>
                </div>
                <div style={{ color:'#6b7280', fontSize:10, marginTop:1 }}>
                  {ad.dose.toFixed(ad.dose < 1 ? 2 : 1)} {ad.drug.unit}
                  <span style={{ marginLeft:6 }}>· t½ {formatHalfLife(hl)}</span>
                </div>

                {/* Barra de concentração farmacocinética */}
                <div style={{ marginTop:5, height:4, background:'#1a2535', borderRadius:2, overflow:'hidden' }}>
                  <div style={{
                    width:`${remaining}%`, height:'100%',
                    background: remaining < 20 ? '#e74c3c' : remaining < 50 ? '#f39c12' : color,
                    borderRadius:2, transition:'width 1s linear, background 0.5s',
                  }}/>
                </div>

                {/* Barra de dose administrada (fina, abaixo) */}
                <div style={{ marginTop:2, height:2, background:'#1a2535', borderRadius:2 }}>
                  <div style={{ width:`${dosePct}%`, height:'100%', background:`${color}55`, borderRadius:2 }}/>
                </div>
              </div>
              <button
                onClick={() => onRemove(ad.instanceId)}
                style={{
                  background:'none', border:'none', color:'#4b5563',
                  cursor:'pointer', fontSize:16, lineHeight:1, padding:2,
                  borderRadius:4, transition:'color 0.15s',
                }}
                title="Remover"
                onMouseEnter={e => (e.currentTarget.style.color = '#e74c3c')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      {/* Legenda */}
      <div style={{ fontSize:10, color:'#2a3a4a', textAlign:'right' }}>
        Barra: concentração plasmática atual (decay por meia-vida)
      </div>
    </div>
  );
}
