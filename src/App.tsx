import { useState, useMemo } from 'react';
import type { ActiveDrug, Drug } from './types';
import { calculateVitals, calculateBodyState } from './utils/pharmacology';
import { getActiveInteractions } from './data/interactions';
import Character from './components/Character';
import VitalSignsPanel from './components/VitalSigns';
import DrugPanel from './components/DrugPanel';
import ActiveDrugsList from './components/ActiveDrugsList';
import InteractionAlert from './components/InteractionAlert';
import IntroScreen from './components/IntroScreen';
import LearningGuide from './components/LearningGuide';
import { drugs as allDrugs } from './data/drugs';
import { useWindowWidth } from './hooks/useWindowWidth';

let idCounter = 0;

type MobilePanel = 'farmacos' | 'boneco' | 'vitais';

export default function App() {
  const [started, setStarted]         = useState(false);
  const [mode, setMode]               = useState<'sim' | 'guia'>('sim');
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('boneco');
  const [activeDrugs, setActiveDrugs] = useState<ActiveDrug[]>([]);

  const width      = useWindowWidth();
  const isMobile   = width < 700;
  const isTablet   = width >= 700 && width < 1100;

  const vitals       = useMemo(() => calculateVitals(activeDrugs),                  [activeDrugs]);
  const bodyState    = useMemo(() => calculateBodyState(activeDrugs),               [activeDrugs]);
  const drugIds      = useMemo(() => [...new Set(activeDrugs.map(d => d.drug.id))], [activeDrugs]);
  const interactions = useMemo(() => getActiveInteractions(drugIds),                [drugIds]);

  if (!started) return <IntroScreen onStart={() => setStarted(true)} />;

  function handleAdminister(drug: Drug, dose: number) {
    setActiveDrugs(prev => [...prev, { instanceId: `${drug.id}-${++idCounter}`, drug, dose }]);
  }
  function handleRemove(id: string) {
    setActiveDrugs(prev => prev.filter(d => d.instanceId !== id));
  }
  function handleClearAll() { setActiveDrugs([]); }

  function handleSimulateInteraction(id1: string, id2: string) {
    const d1 = allDrugs.find(d => d.id === id1);
    const d2 = allDrugs.find(d => d.id === id2);
    if (!d1 || !d2) return;
    setActiveDrugs([
      { instanceId: `${id1}-sim`, drug: d1, dose: d1.maxDose * 0.6 },
      { instanceId: `${id2}-sim`, drug: d2, dose: d2.maxDose * 0.6 },
    ]);
    setMode('sim');
    setMobilePanel('boneco');
  }

  // ── Reutilizável: centro com boneco ───────────────────────────────────────
  const CharacterCenter = (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: isMobile ? '14px 12px' : '20px 10px', gap: 8,
      background: 'linear-gradient(180deg, #0d1117 0%, #0a1220 100%)',
    }}>
      <div style={{
        background: '#111c2b', borderRadius: 14,
        border: '1px solid #1e2d3d', padding: '7px 14px',
        display: 'flex', gap: isMobile ? 12 : 20,
        fontSize: isMobile ? 10 : 11, color: '#6e7681',
        flexWrap: 'wrap', justifyContent: 'center', width: '100%',
      }}>
        <span style={{ color: bodyState.skinVasodilation > 0.2 ? '#e74c3c' : bodyState.skinVasodilation < -0.2 ? '#95a5a6' : '#2ecc71' }}>
          Pele: {bodyState.skinVasodilation > 0.2 ? 'Vasodilatação' : bodyState.skinVasodilation < -0.2 ? 'Vasoconstrição' : 'Normal'}
        </span>
        <span style={{ color: bodyState.bronchialNormalized > 1.15 ? '#2ecc71' : bodyState.bronchialNormalized < 0.85 ? '#e74c3c' : '#6e7681' }}>
          Brônquio: {bodyState.bronchialNormalized > 1.15 ? 'Dilatado' : bodyState.bronchialNormalized < 0.85 ? 'Constrito' : 'Normal'}
        </span>
        <span style={{ color: bodyState.giMotility > 1.2 ? '#2ecc71' : bodyState.giMotility < 0.8 ? '#f39c12' : '#6e7681' }}>
          TGI: {bodyState.giMotility > 1.2 ? 'Hipermotilidade' : bodyState.giMotility < 0.8 ? 'Hipomotilidade' : 'Normal'}
        </span>
      </div>

      <div style={{ width: '100%', maxWidth: 260, flexShrink: 0 }}>
        <Character bodyState={bodyState} vitals={vitals} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', maxWidth: 340, fontSize: 10 }}>
        {bodyState.sweating      >  0.3 && <Badge text="Sudorese"        color="#7fc8f8"/>}
        {bodyState.lacrimation   >  0.3 && <Badge text="Lacrimejamento"  color="#7fc8f8"/>}
        {bodyState.salivation    >  0.3 && <Badge text="Sialorréia"      color="#a8d8ea"/>}
        {bodyState.salivation    < -0.3 && <Badge text="Boca seca"       color="#f39c12"/>}
        {bodyState.sweating      < -0.3 && <Badge text="Anhidrose"       color="#f39c12"/>}
        {bodyState.tremor        >  0.3 && <Badge text="Tremor"          color="#e67e22"/>}
        {bodyState.pupilNormalized > 0.72 && <Badge text="Midríase"      color="#e74c3c"/>}
        {bodyState.pupilNormalized < 0.28 && <Badge text="Miose"         color="#3498db"/>}
      </div>
    </div>
  );

  return (
    <div style={{
      height: '100dvh',
      background: '#0d1117',
      color: '#c9d1d9',
      fontFamily: '"Inter","Segoe UI",system-ui,sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header style={{
        background: 'linear-gradient(90deg,#0d1117 0%,#111c2b 50%,#0d1117 100%)',
        borderBottom: '1px solid #1e2d3d',
        padding: isMobile ? '0 14px' : '0 28px',
        display: 'flex', alignItems: 'center',
        gap: isMobile ? 10 : 20,
        flexShrink: 0,
        height: isMobile ? 50 : 58,
        position: 'relative', overflow: 'hidden',
      }}>
        {!isMobile && (
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06, pointerEvents:'none' }}
               preserveAspectRatio="none" viewBox="0 0 1200 58">
            <polyline points="0,29 80,29 100,10 115,48 130,29 200,29 220,6 235,52 250,29 350,29 370,14 385,44 400,29 500,29 520,8 535,50 550,29 650,29 670,12 685,46 700,29 800,29 820,10 835,48 850,29 950,29 970,7 985,51 1000,29 1100,29 1120,11 1135,47 1150,29 1200,29"
              fill="none" stroke="#2ecc71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}

        {/* Logo UFPE */}
        <div style={{ height: isMobile ? 30 : 36, flexShrink: 0, background: '#fff', borderRadius: 7, padding: '3px 7px', display: 'flex', alignItems: 'center' }}>
          <img src="/ufpe.png" alt="UFPE" style={{ height: isMobile ? 22 : 26, objectFit: 'contain', display: 'block' }}/>
        </div>

        {/* Título */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: isMobile ? 13 : 16, fontWeight: 700, color: '#e6edf3', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
            Farmacologia Interativa
          </h1>
          {!isMobile && (
            <span style={{ fontSize: 10.5, color: '#4d6a7a', letterSpacing: '0.03em' }}>
              Sistema Nervoso Autônomo · Simulador
            </span>
          )}
        </div>

        {/* Pills — só desktop */}
        {!isMobile && (
          <>
            <div style={{ width: 1, height: 28, background: '#1e2d3d', flexShrink: 0 }}/>
            <div style={{ display: 'flex', gap: 6 }}>
              {([
                { label: 'Adrenérgico', color: '#e67e22', bg: '#e67e2218' },
                { label: 'Colinérgico', color: '#27ae60', bg: '#27ae6018' },
                { label: 'Bloqueadores', color: '#95a5a6', bg: '#95a5a614' },
              ] as const).map(item => (
                <span key={item.label} style={{ fontSize: 11, color: item.color, background: item.bg, border: `1px solid ${item.color}30`, borderRadius: 20, padding: '3px 10px' }}>
                  {item.label}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Status */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 6px #2ecc71', display: 'inline-block' }}/>
          {!isMobile && <span style={{ fontSize: 11, color: '#4d6a7a' }}>Simulação ativa</span>}
        </div>
      </header>

      {/* ── MODE TABS ──────────────────────────────────────── */}
      <div style={{
        background: '#0d1117', borderBottom: '1px solid #1e2d3d',
        display: 'flex', padding: `0 ${isMobile ? 12 : 24}px`, gap: 4, flexShrink: 0,
      }}>
        {([
          { id: 'sim',  label: 'Simulação' },
          { id: 'guia', label: 'Guia de Aprendizado' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setMode(tab.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: `${isMobile ? 8 : 10}px ${isMobile ? 12 : 16}px`,
            fontSize: isMobile ? 12 : 13,
            color: mode === tab.id ? '#e6edf3' : '#6b7280',
            fontWeight: mode === tab.id ? 600 : 400,
            borderBottom: `2px solid ${mode === tab.id ? '#2ecc71' : 'transparent'}`,
            marginBottom: -1, transition: 'all 0.15s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── GUIA ───────────────────────────────────────────── */}
      {mode === 'guia' && <LearningGuide onSimulateInteraction={handleSimulateInteraction} />}

      {/* ── SIMULAÇÃO ──────────────────────────────────────── */}
      {mode === 'sim' && (
        <>
          {/* MOBILE: painel único com abas */}
          {isMobile && (
            <>
              {/* Panel tabs */}
              <div style={{ display: 'flex', background: '#111820', borderBottom: '1px solid #1e2d3d', flexShrink: 0 }}>
                {([
                  { id: 'farmacos', label: 'Fármacos' },
                  { id: 'boneco',   label: 'Boneco'   },
                  { id: 'vitais',   label: 'Sinais'   },
                ] as const).map(p => (
                  <button key={p.id} onClick={() => setMobilePanel(p.id)} style={{
                    flex: 1, padding: '9px 4px', background: 'none', border: 'none',
                    borderBottom: `2px solid ${mobilePanel === p.id ? '#2ecc71' : 'transparent'}`,
                    color: mobilePanel === p.id ? '#e6edf3' : '#6b7280',
                    fontSize: 12, fontWeight: mobilePanel === p.id ? 600 : 400,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Panel content */}
              <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                {mobilePanel === 'farmacos' && (
                  <div style={{ padding: '14px 12px', height: '100%' }}>
                    <DrugPanel onAdminister={handleAdminister} />
                  </div>
                )}
                {mobilePanel === 'boneco' && CharacterCenter}
                {mobilePanel === 'vitais' && (
                  <div style={{ padding: '14px 12px' }}>
                    <VitalSignsPanel vitals={vitals} />
                  </div>
                )}
              </div>

              {/* Active drugs — compact strip */}
              <div style={{
                background: '#161b22', borderTop: '1px solid #21262d',
                padding: '10px 14px', flexShrink: 0,
                maxHeight: 130, overflowY: 'auto',
              }}>
                <ActiveDrugsList activeDrugs={activeDrugs} onRemove={handleRemove} onClearAll={handleClearAll} />
                <InteractionAlert interactions={interactions} />
              </div>
            </>
          )}

          {/* TABLET: 2 colunas */}
          {isTablet && (
            <>
              <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '220px 1fr', overflow: 'hidden', minHeight: 0 }}>
                <aside style={{ background: '#0d1117', borderRight: '1px solid #21262d', padding: '14px 12px', overflowY: 'auto' }}>
                  <DrugPanel onAdminister={handleAdminister} />
                </aside>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {CharacterCenter}
                  </div>
                  <div style={{ borderTop: '1px solid #21262d', padding: '14px', overflowY: 'auto', maxHeight: 320, background: '#0d1117' }}>
                    <VitalSignsPanel vitals={vitals} />
                  </div>
                </div>
              </main>
              <footer style={{ background: '#161b22', borderTop: '1px solid #21262d', padding: '12px 20px', flexShrink: 0, maxHeight: interactions.length > 0 ? 300 : 130, overflowY: 'auto' }}>
                <ActiveDrugsList activeDrugs={activeDrugs} onRemove={handleRemove} onClearAll={handleClearAll} />
                <InteractionAlert interactions={interactions} />
              </footer>
            </>
          )}

          {/* DESKTOP: 3 colunas */}
          {!isMobile && !isTablet && (
            <>
              <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '270px 1fr 290px', overflow: 'hidden', minHeight: 0 }}>
                <aside style={{ background: '#0d1117', borderRight: '1px solid #21262d', padding: '16px 14px', overflowY: 'auto' }}>
                  <DrugPanel onAdminister={handleAdminister} />
                </aside>
                <section style={{ overflowY: 'auto' }}>
                  {CharacterCenter}
                </section>
                <aside style={{ background: '#0d1117', borderLeft: '1px solid #21262d', padding: '16px 14px', overflowY: 'auto' }}>
                  <VitalSignsPanel vitals={vitals} />
                </aside>
              </main>
              <footer style={{ background: '#161b22', borderTop: '1px solid #21262d', padding: '14px 24px', flexShrink: 0, maxHeight: interactions.length > 0 ? 340 : 150, overflowY: 'auto' }}>
                <ActiveDrugsList activeDrugs={activeDrugs} onRemove={handleRemove} onClearAll={handleClearAll} />
                <InteractionAlert interactions={interactions} />
              </footer>
            </>
          )}
        </>
      )}

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #21262d; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #30363d; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.55;} }
      `}</style>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ background: `${color}18`, border: `1px solid ${color}55`, borderRadius: 4, padding: '3px 8px', fontSize: 10, color }}>
      {text}
    </span>
  );
}
