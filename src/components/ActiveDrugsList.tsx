import type { ActiveDrug } from '../types';

const CLASS_COLORS: Record<string, string> = {
  agonista_adrenergico:  '#e67e22',
  bloqueador_adrenergico:'#95a5a6',
  agonista_colinergico:  '#27ae60',
  bloqueador_colinergico:'#8e44ad',
};

interface Props {
  activeDrugs: ActiveDrug[];
  onRemove: (instanceId: string) => void;
  onClearAll: () => void;
}

export default function ActiveDrugsList({ activeDrugs, onRemove, onClearAll }: Props) {
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
          const pct = Math.round((ad.dose / ad.drug.maxDose) * 100);
          return (
            <div
              key={ad.instanceId}
              style={{
                background:`${color}14`, border:`1px solid ${color}55`,
                borderRadius:8, padding:'8px 12px',
                display:'flex', alignItems:'center', gap:10,
                minWidth:180,
              }}
            >
              <div style={{ flex:1 }}>
                <div style={{ color, fontWeight:'bold', fontSize:13 }}>{ad.drug.name}</div>
                <div style={{ color:'#6b7280', fontSize:10, marginTop:1 }}>
                  {ad.dose.toFixed(ad.dose < 1 ? 2 : 1)} {ad.drug.unit}
                  <span style={{ marginLeft:6, color:`${color}99` }}>({pct}% da dose máx.)</span>
                </div>
                {/* Dose bar */}
                <div style={{ marginTop:5, height:3, background:'#1a2535', borderRadius:2 }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:2 }}/>
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
    </div>
  );
}
