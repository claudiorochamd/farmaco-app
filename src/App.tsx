import { useState, useMemo, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
import ScenariosPanel from './components/ScenariosPanel';
import { drugs as allDrugs } from './data/drugs';
import type { Scenario } from './data/scenarios';
import { getActiveCritical, type CriticalThreshold } from './data/thresholds';
import NTGraph from './components/NTGraph';
import { calculateNTLevels } from './utils/pharmacology';
import { useWindowWidth } from './hooks/useWindowWidth';

let idCounter = 0;

type MobilePanel = 'farmacos' | 'boneco' | 'vitais';

export default function App() {
  const [started, setStarted]               = useState(false);
  const [mode, setMode]                     = useState<'sim' | 'cenarios' | 'guia' | 'sobre'>('sim');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [scenarioPhase, setScenarioPhase]   = useState<'none' | 'active' | 'solved' | 'dead'>('none');
  const [timeLeft, setTimeLeft]             = useState(60);

  // Estado crítico na simulação livre
  const [freeCritical, setFreeCritical]     = useState<'none' | 'warning' | 'dead'>('none');
  const [freeCriticalTime, setFreeCriticalTime] = useState(20);
  const [freeCriticalInfo, setFreeCriticalInfo] = useState<CriticalThreshold | null>(null);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('boneco');
  const [activeDrugs, setActiveDrugs] = useState<ActiveDrug[]>([]);
  const [isLight, setIsLight]         = useState(() => localStorage.getItem('theme') === 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  const width      = useWindowWidth();
  const isMobile   = width < 700;
  const isTablet   = width >= 700 && width < 1100;

  const vitals       = useMemo(() => calculateVitals(activeDrugs),                  [activeDrugs]);
  const bodyState    = useMemo(() => calculateBodyState(activeDrugs),               [activeDrugs]);
  const drugIds      = useMemo(() => [...new Set(activeDrugs.map(d => d.drug.id))], [activeDrugs]);
  const interactions = useMemo(() => getActiveInteractions(drugIds),                [drugIds]);
  const ntLevels     = useMemo(() => calculateNTLevels(activeDrugs),               [activeDrugs]);

  // Timer do cenário
  useEffect(() => {
    if (scenarioPhase !== 'active') return;
    if (timeLeft <= 0) { setScenarioPhase('dead'); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [scenarioPhase, timeLeft]);

  // Detecta fármaco correto
  useEffect(() => {
    if (scenarioPhase !== 'active' || !activeScenario) return;
    const correctIds = new Set(activeScenario.drugs.map(d => d.drugId));
    if (activeDrugs.some(ad => correctIds.has(ad.drug.id))) {
      setScenarioPhase('solved');
    }
  }, [activeDrugs, scenarioPhase, activeScenario]);

  // Detecção de estado crítico — roda sempre que há fármacos ativos
  useEffect(() => {
    // Não checar se já está morto (cenário ou livre)
    if (freeCritical === 'dead' || scenarioPhase === 'dead') return;

    // Sem fármacos → sem risco de overdose
    if (activeDrugs.length === 0) {
      if (freeCritical === 'warning') { setFreeCritical('none'); setFreeCriticalTime(20); }
      return;
    }

    // vitals usa sempre a baseline saudável + efeitos dos fármacos
    const critical = getActiveCritical(vitals);
    if (critical) {
      if (freeCritical === 'none') {
        setFreeCritical('warning');
        setFreeCriticalTime(20);
        setFreeCriticalInfo(critical);
      } else if (freeCritical === 'warning' && critical.id !== freeCriticalInfo?.id) {
        setFreeCriticalInfo(critical);
      }
    } else if (freeCritical === 'warning') {
      setFreeCritical('none');
      setFreeCriticalTime(20);
    }
  }, [vitals, activeDrugs.length, freeCritical, freeCriticalInfo?.id, scenarioPhase]);

  // Contador do estado crítico livre
  useEffect(() => {
    if (freeCritical !== 'warning') return;
    if (freeCriticalTime <= 0) { setFreeCritical('dead'); return; }
    const t = setTimeout(() => setFreeCriticalTime(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [freeCritical, freeCriticalTime]);

  // Vitals e bodyState exibidos (usa baseline quando fase ativa + sem fármacos)
  const displayVitals = (scenarioPhase !== 'none' && activeDrugs.length === 0 && activeScenario)
    ? activeScenario.baselineVitals
    : vitals;
  const displayBodyState = (scenarioPhase !== 'none' && activeDrugs.length === 0 && activeScenario)
    ? activeScenario.baselineBodyState
    : bodyState;

  if (!started) return <IntroScreen onStart={() => setStarted(true)} />;

  function handleAdminister(drug: Drug, dose: number) {
    setActiveDrugs(prev => [...prev, { instanceId: `${drug.id}-${++idCounter}`, drug, dose }]);
    setActiveScenario(null);
  }
  function handleRemove(id: string) {
    setActiveDrugs(prev => prev.filter(d => d.instanceId !== id));
  }
  function handleClearAll() { setActiveDrugs([]); }

  function handleSimulateScenario(scenario: Scenario) {
    setActiveDrugs([]);            // começa sem fármaco — sintomas são do baseline
    setActiveScenario(scenario);
    setScenarioPhase('active');
    setTimeLeft(60);
    setMode('sim');
    setMobilePanel('boneco');
  }

  function handleRestartScenario() {
    if (!activeScenario) return;
    setActiveDrugs([]);
    setScenarioPhase('active');
    setTimeLeft(60);
  }

  function handleExitScenario() {
    setActiveDrugs([]);
    setActiveScenario(null);
    setScenarioPhase('none');
    setTimeLeft(60);
    setMode('cenarios');
  }

  function handleSimulateDrug(id: string) {
    const d = allDrugs.find(drug => drug.id === id);
    if (!d) return;
    setActiveDrugs([{ instanceId: `${id}-sim`, drug: d, dose: d.maxDose * 0.6 }]);
    setMode('sim');
    setMobilePanel('boneco');
  }

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
  const isDead = scenarioPhase === 'dead' || freeCritical === 'dead';

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
        <Character bodyState={displayBodyState} vitals={displayVitals} isDead={isDead} />
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

      {/* Gráfico de neurotransmissores */}
      <div style={{ width: '100%', maxWidth: 420, padding: '0 4px', flexShrink: 0 }}>
        <NTGraph levels={ntLevels} />
      </div>
    </div>
  );

  return (
    <div style={{
      height: '100dvh',
      background: 'var(--bg)',
      color: 'var(--text-2)',
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

        {/* Status + toggle de tema */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {!isMobile && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#4d6a7a' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 6px #2ecc71', display: 'inline-block' }}/>
              Simulação ativa
            </span>
          )}
          <button
            onClick={() => setIsLight(l => !l)}
            title={isLight ? 'Modo escuro' : 'Modo claro'}
            style={{
              background: 'var(--bg-3, #111c2b)', border: '1px solid var(--border, #21262d)',
              borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
              color: 'var(--text-4, #6e7681)', fontSize: 13, lineHeight: 1,
              transition: 'all 0.2s',
            }}
          >
            {isLight ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* ── MODE TABS ──────────────────────────────────────── */}
      <div style={{
        background: '#0d1117', borderBottom: '1px solid #1e2d3d',
        display: 'flex', padding: `0 ${isMobile ? 12 : 24}px`, gap: 4, flexShrink: 0,
      }}>
        {([
          { id: 'sim',      label: 'Simulação' },
          { id: 'cenarios', label: 'Cenários Clínicos' },
          { id: 'guia',     label: 'Guia de Aprendizado' },
          { id: 'sobre',    label: 'Sobre' },
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
      {mode === 'cenarios' && <ScenariosPanel onSimulate={handleSimulateScenario} />}
      {mode === 'guia'     && <LearningGuide onSimulateInteraction={handleSimulateInteraction} onSimulateDrug={handleSimulateDrug} />}
      {mode === 'sobre'    && <SobreSection />}

      {/* ── BANNER DE CENÁRIO ──────────────────────────────── */}
      {mode === 'sim' && activeScenario && scenarioPhase !== 'dead' && (
        <div style={{
          background: scenarioPhase === 'solved' ? 'rgba(46,204,113,0.12)' : `${activeScenario.color}18`,
          borderBottom: `1px solid ${scenarioPhase === 'solved' ? '#2ecc71' : activeScenario.color}44`,
          padding: '8px 20px',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, flexWrap: 'wrap',
        }}>
          {scenarioPhase === 'solved' ? (
            <>
              <span style={{ fontSize: 13, color: '#2ecc71', fontWeight: 700 }}>Tratamento correto!</span>
              <span style={{ fontSize: 12, color: '#8b949e' }}>Paciente estabilizado — {activeScenario.title}</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 11, color: activeScenario.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Cenário Ativo
              </span>
              <span style={{ fontSize: 13, color: '#e6edf3', fontWeight: 600 }}>{activeScenario.title}</span>
              <span style={{ fontSize: 12, color: '#8b949e' }}>— Administre o fármaco correto</span>
              {/* Countdown */}
              <span style={{
                marginLeft: 8, fontFamily: 'monospace', fontWeight: 800, fontSize: 15,
                color: timeLeft <= 15 ? '#e74c3c' : timeLeft <= 30 ? '#f39c12' : '#e6edf3',
                animation: timeLeft <= 10 ? 'pulse 0.6s ease-in-out infinite' : 'none',
              }}>
                0:{String(timeLeft).padStart(2, '0')}
              </span>
            </>
          )}
          <button
            onClick={handleExitScenario}
            style={{ marginLeft: 'auto', background: 'none', border: `1px solid #30363d`, borderRadius: 5, padding: '3px 10px', color: '#6b7280', fontSize: 11, cursor: 'pointer' }}
          >
            Encerrar
          </button>
        </div>
      )}

      {/* ── BANNER DE ESTADO CRÍTICO LIVRE ────────────────── */}
      {mode === 'sim' && freeCritical === 'warning' && freeCriticalInfo && scenarioPhase !== 'dead' && (
        <div style={{
          background: 'rgba(231,76,60,0.14)', borderBottom: '2px solid #e74c3c',
          padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 12,
          flexShrink: 0, flexWrap: 'wrap',
          animation: 'pulse 0.8s ease-in-out infinite',
        }}>
          <span style={{ fontWeight: 800, color: '#e74c3c', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Estado Crítico
          </span>
          <span style={{ fontSize: 12, color: '#e6edf3', flex: 1 }}>
            {freeCriticalInfo.cause.split('(')[0].trim()}
          </span>
          <span style={{
            fontFamily: 'monospace', fontWeight: 800, fontSize: 16, color: '#e74c3c',
            animation: freeCriticalTime <= 10 ? 'pulse 0.5s ease-in-out infinite' : 'none',
          }}>
            {freeCriticalTime}s
          </span>
          <span style={{ fontSize: 11, color: '#8b949e' }}>para reverter</span>
        </div>
      )}

      {/* ── SIMULAÇÃO ──────────────────────────────────────── */}
      {mode === 'sim' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, position: 'relative' }}>

        {/* ── Tela de óbito — simulação livre ── */}
        {freeCritical === 'dead' && freeCriticalInfo && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.90)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}>
            <div style={{ textAlign: 'center', maxWidth: 460 }}>
              <svg width="200" height="40" viewBox="0 0 200 40" style={{ display: 'block', margin: '0 auto 20px' }}>
                <line x1="0" y1="20" x2="200" y2="20" stroke="#e74c3c" strokeWidth="2" opacity="0.7" strokeDasharray="4 4"/>
              </svg>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#e6edf3', marginBottom: 14, letterSpacing: '-0.01em' }}>
                Claudinho veio à óbito.
              </div>

              {/* Causa */}
              <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid #e74c3c44', borderRadius: 8, padding: '12px 16px', marginBottom: 14, textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: '#e74c3c', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>Causa do óbito</div>
                <div style={{ fontSize: 13, color: '#e6edf3', lineHeight: 1.6 }}>{freeCriticalInfo.cause}</div>
              </div>

              {/* Como evitar */}
              <div style={{ background: 'rgba(52,152,219,0.08)', border: '1px solid #3498db44', borderRadius: 8, padding: '12px 16px', marginBottom: 24, textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: '#3498db', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>Como teria evitado</div>
                <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.7 }}>{freeCriticalInfo.avoidance}</div>
              </div>

              <button
                onClick={() => { setActiveDrugs([]); setFreeCritical('none'); setFreeCriticalTime(20); setFreeCriticalInfo(null); }}
                style={{ background: '#2ecc71', border: 'none', borderRadius: 8, padding: '10px 28px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* ── Tela de óbito — cenário ── */}
        {isDead && activeScenario && scenarioPhase === 'dead' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.90)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}>
            <div style={{ textAlign: 'center', maxWidth: 400 }}>
              {/* Ícone de flatline ECG */}
              <svg width="200" height="40" viewBox="0 0 200 40" style={{ display: 'block', margin: '0 auto 20px' }}>
                <polyline points="0,20 60,20 65,20 70,20 75,20 80,5 85,35 90,20 130,20 200,20"
                  fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                <line x1="0" y1="20" x2="200" y2="20" stroke="#e74c3c" strokeWidth="2" opacity="0.7"
                  strokeDasharray="4 4"/>
              </svg>

              <div style={{ fontSize: 26, fontWeight: 800, color: '#e6edf3', marginBottom: 10, letterSpacing: '-0.01em' }}>
                Claudinho veio à óbito.
              </div>
              <div style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.7, marginBottom: 8 }}>
                O paciente não resistiu. O tempo esgotou antes do tratamento.
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 28 }}>
                O fármaco correto era:{' '}
                <strong style={{ color: activeScenario.color }}>
                  {activeScenario.drugNames.join(' + ')}
                </strong>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleRestartScenario}
                  style={{
                    background: '#2ecc71', border: 'none', borderRadius: 8,
                    padding: '10px 24px', color: '#fff', fontSize: 13,
                    fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Tentar novamente
                </button>
                <button
                  onClick={handleExitScenario}
                  style={{
                    background: 'none', border: '1px solid #30363d', borderRadius: 8,
                    padding: '10px 24px', color: '#8b949e', fontSize: 13,
                    fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Voltar aos cenários
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da simulação */}
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
                    <VitalSignsPanel vitals={displayVitals} />
                  </div>
                )}
              </div>

              {/* Active drugs — compact strip */}
              <div style={{
                background: 'var(--bg-2)', borderTop: '1px solid var(--border)',
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
                <aside style={{ background: 'var(--bg)', borderRight: '1px solid var(--border)', padding: '14px 12px', overflowY: 'auto' }}>
                  <DrugPanel onAdminister={handleAdminister} />
                </aside>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {CharacterCenter}
                  </div>
                  <div style={{ borderTop: '1px solid #21262d', padding: '14px', overflowY: 'auto', maxHeight: 320, background: '#0d1117' }}>
                    <VitalSignsPanel vitals={displayVitals} />
                  </div>
                </div>
              </main>
              <footer style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', padding: '12px 20px', flexShrink: 0, maxHeight: interactions.length > 0 ? 300 : 130, overflowY: 'auto' }}>
                <ActiveDrugsList activeDrugs={activeDrugs} onRemove={handleRemove} onClearAll={handleClearAll} />
                <InteractionAlert interactions={interactions} />
              </footer>
            </>
          )}

          {/* DESKTOP: 3 colunas */}
          {!isMobile && !isTablet && (
            <>
              <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '270px 1fr 290px', overflow: 'hidden', minHeight: 0 }}>
                <aside style={{ background: 'var(--bg)', borderRight: '1px solid var(--border)', padding: '16px 14px', overflowY: 'auto' }}>
                  <DrugPanel onAdminister={handleAdminister} />
                </aside>
                <section style={{ overflowY: 'auto' }}>
                  {CharacterCenter}
                </section>
                <aside style={{ background: 'var(--bg)', borderLeft: '1px solid var(--border)', padding: '16px 14px', overflowY: 'auto' }}>
                  <VitalSignsPanel vitals={displayVitals} />
                </aside>
              </main>
              <footer style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', padding: '14px 24px', flexShrink: 0, maxHeight: interactions.length > 0 ? 340 : 150, overflowY: 'auto' }}>
                <ActiveDrugsList activeDrugs={activeDrugs} onRemove={handleRemove} onClearAll={handleClearAll} />
                <InteractionAlert interactions={interactions} />
              </footer>
            </>
          )}
        </>
        </div>
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

function SobreSection() {
  const techs = [
    { name: 'React 19',        desc: 'Biblioteca JavaScript para construção de interfaces com componentes reutilizáveis.' },
    { name: 'TypeScript',      desc: 'Superset do JavaScript com tipagem estática, garantindo segurança durante o desenvolvimento.' },
    { name: 'Vite',            desc: 'Ferramenta de build moderna com servidor de desenvolvimento ultrarrápido.' },
    { name: 'Tailwind CSS v4', desc: 'Framework CSS utilitário, configurado diretamente via plugin Vite.' },
    { name: 'Vercel',          desc: 'Plataforma de hospedagem e deploy contínuo.' },
    { name: 'GitHub',          desc: 'Versionamento do código-fonte e controle de histórico de mudanças.' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', padding: '32px 24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 680, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Desenvolvido por */}
          <div style={{ background: '#111c2b', border: '1px solid #2ecc7133', borderRadius: 14, padding: '24px 22px' }}>
            <div style={{ fontSize: 11, color: '#2ecc71', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 10 }}>
              Desenvolvido por
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#e6edf3', marginBottom: 4 }}>Cláudio Rocha</div>
            <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 16, lineHeight: 1.7 }}>
              Estudante de Medicina · 3º Período · Turma 158<br/>
              Universidade Federal de Pernambuco — UFPE
            </div>
            <a href="mailto:claudio.filho@ufpe.br" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#2ecc7115', border: '1px solid #2ecc7144',
              borderRadius: 7, padding: '7px 14px',
              color: '#2ecc71', fontSize: 12, textDecoration: 'none', fontWeight: 500,
            }}>
              claudio.filho@ufpe.br
            </a>
          </div>

          {/* Apoie este projeto */}
          <div style={{ background: '#111c2b', border: '1px solid #f39c1233', borderRadius: 14, padding: '24px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#f39c12', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 10 }}>
              Apoie este projeto
            </div>
            <div style={{ background: 'white', borderRadius: 10, padding: 10, marginBottom: 12 }}>
              <QRCodeSVG value="13370451441" size={110} bgColor="#ffffff" fgColor="#0d1117" level="M"/>
            </div>
            <div style={{ fontSize: 11, color: '#8b949e' }}>Escaneie para contribuir via PIX</div>
          </div>

        </div>

        <div style={{ background: '#111c2b', border: '1px solid #7fdbff22', borderLeft: '3px solid #7fdbff55', borderRadius: 10, padding: '16px 20px' }}>
          <div style={{ color: '#7fdbff', fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Sobre o projeto</div>
          <p style={{ margin: 0, fontSize: 13, color: '#8b949e', lineHeight: 1.8 }}>
            Este simulador foi desenvolvido como ferramenta de apoio ao estudo da farmacologia do sistema nervoso autônomo,
            permitindo visualizar de forma interativa os efeitos de fármacos adrenérgicos e colinérgicos no organismo humano.
            Não substitui o estudo aprofundado nem deve ser utilizado para fins clínicos ou de prescrição médica.
          </p>
        </div>

        <div>
          <p style={{ margin: '0 0 12px', fontSize: 11, color: '#4d6a7a', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Tecnologias utilizadas
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {techs.map(t => (
              <div key={t.name} style={{ background: '#111c2b', border: '1px solid #21262d', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ color: '#e6edf3', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t.name}</div>
                <p style={{ margin: 0, fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
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
