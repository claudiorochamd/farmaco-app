import { useState } from 'react';
import { useWindowWidth } from '../hooks/useWindowWidth';
import { drugs } from '../data/drugs';
import { interactions } from '../data/interactions';

const TOPICS = [
  { id: 'sna',       label: 'Visão Geral do SNA',         color: '#7fdbff' },
  { id: 'rec_a',     label: 'Receptores Adrenérgicos',     color: '#e67e22' },
  { id: 'rec_c',     label: 'Receptores Colinérgicos',     color: '#27ae60' },
  { id: 'agon_a',    label: 'Agonistas Adrenérgicos',      color: '#e67e22' },
  { id: 'bloq_a',    label: 'Bloqueadores Adrenérgicos',   color: '#95a5a6' },
  { id: 'agon_c',    label: 'Agonistas Colinérgicos',      color: '#27ae60' },
  { id: 'bloq_c',    label: 'Bloqueadores Colinérgicos',   color: '#8e44ad' },
  { id: 'inter',     label: 'Interações Medicamentosas',   color: '#f39c12' },
  { id: 'tabela',    label: 'Tabela Resumo',                color: '#c9d1d9' },
];

export default function LearningGuide() {
  const [active, setActive] = useState('sna');
  const width    = useWindowWidth();
  const isMobile = width < 700;
  const topic = TOPICS.find(t => t.id === active)!;

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, minHeight: 0, overflow: 'hidden' }}>

      {/* ── SIDEBAR (desktop) / SCROLL HORIZONTAL (mobile) ─── */}
      {isMobile ? (
        <div style={{
          display: 'flex', overflowX: 'auto', gap: 6,
          padding: '10px 12px', background: '#0d1117',
          borderBottom: '1px solid #21262d', flexShrink: 0,
        }}>
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              whiteSpace: 'nowrap', flexShrink: 0,
              background: active === t.id ? `${t.color}20` : '#111c2b',
              border: `1px solid ${active === t.id ? t.color : '#21262d'}`,
              borderRadius: 20, padding: '6px 12px',
              color: active === t.id ? t.color : '#6b7280',
              fontSize: 12, fontWeight: active === t.id ? 600 : 400,
              cursor: 'pointer',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      ) : (
        <nav style={{
          width: 220, flexShrink: 0, background: '#0d1117',
          borderRight: '1px solid #21262d',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto', padding: '12px 10px', gap: 4,
        }}>
          <p style={{ margin: '0 0 8px 6px', fontSize: 10, color: '#4d6a7a', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Tópicos
          </p>
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              background: active === t.id ? `${t.color}18` : 'transparent',
              border: `1px solid ${active === t.id ? t.color + '55' : 'transparent'}`,
              borderLeft: `3px solid ${active === t.id ? t.color : 'transparent'}`,
              borderRadius: 6, padding: '8px 10px',
              color: active === t.id ? t.color : '#6b7280',
              fontSize: 12, cursor: 'pointer', textAlign: 'left',
              fontWeight: active === t.id ? 600 : 400, transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          ))}
        </nav>
      )}

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: 'linear-gradient(180deg,#0d1117,#0a1018)',
        padding: isMobile ? '20px 16px' : '28px 36px',
      }}>
        <div style={{ maxWidth: 860 }}>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 10, color: topic.color, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Guia de Aprendizado
            </span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22, color: '#e6edf3', fontWeight: 700 }}>
              {topic.label}
            </h2>
          </div>

          {active === 'sna'    && <SnaSection />}
          {active === 'rec_a'  && <RecAdren />}
          {active === 'rec_c'  && <RecColin />}
          {active === 'agon_a' && <DrugSection cls="agonista_adrenergico" color="#e67e22" />}
          {active === 'bloq_a' && <DrugSection cls="bloqueador_adrenergico" color="#95a5a6" />}
          {active === 'agon_c' && <DrugSection cls="agonista_colinergico" color="#27ae60" />}
          {active === 'bloq_c' && <DrugSection cls="bloqueador_colinergico" color="#8e44ad" />}
          {active === 'inter'  && <InterSection />}
          {active === 'tabela' && <SummaryTable />}
        </div>
      </div>
    </div>
  );
}

// ─── VISÃO GERAL ──────────────────────────────────────────────────────────────
function SnaSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <InfoBox color="#7fdbff">
        O Sistema Nervoso Autônomo (SNA) regula funções viscerais involuntárias. Divide-se em
        divisão <strong>simpática</strong> (luta ou fuga) e <strong>parassimpática</strong> (repouso e digestão).
        Ambas usam dois neurônios em série: pré-ganglionar e pós-ganglionar.
      </InfoBox>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <DivCard
          title="Divisão Simpática"
          color="#e67e22"
          items={[
            'Neurônios pré-ganglionares curtos',
            'Neurônios pós-ganglionares longos',
            'Neurotransmissor pós: Noradrenalina (NA)',
            'Receptores efetores: α e β adrenérgicos',
            'Resposta: "fight or flight"',
            'Gânglios paravertebrais e pré-vertebrais',
          ]}
        />
        <DivCard
          title="Divisão Parassimpática"
          color="#27ae60"
          items={[
            'Neurônios pré-ganglionares longos',
            'Neurônios pós-ganglionares curtos',
            'Neurotransmissor pós: Acetilcolina (ACh)',
            'Receptores efetores: muscarínicos (M)',
            'Resposta: "rest and digest"',
            'Nervos cranianos III, VII, IX, X e S2-S4',
          ]}
        />
      </div>

      <SectionTitle>Efeitos Comparativos</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#111c2b' }}>
            <Th>Órgão / Sistema</Th>
            <Th color="#e67e22">Simpático (receptor)</Th>
            <Th color="#27ae60">Parassimpático (receptor)</Th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Coração — FC',       '↑ FC, ↑ Contratilidade (β1)',     '↓ FC, ↓ Condução AV (M2)'],
            ['Vasos sanguíneos',   'Vasoconstrição (α1)',               'Vasodilatação (M3)'],
            ['Brônquios',          'Broncodilatação (β2)',               'Broncoconstrição, ↑ secreção (M3)'],
            ['Pupilas',            'Midríase — dilatação (α1)',         'Miose — constrição (M3)'],
            ['Trato GI',           '↓ Motilidade, contração esfíncter (α1, β2)', '↑ Motilidade, relaxamento esfíncter (M3)'],
            ['Bexiga',             'Relaxamento detrusor (β2)',         'Contração detrusor, micção (M3)'],
            ['Glândulas sudoríparas', 'Sudorese (M — inervação colinérgica simpática)', '—'],
            ['Glândulas salivares', '↓ Secreção espessa',              '↑ Secreção aquosa (M3)'],
            ['Fígado',             'Glicogenólise, gliconeogênese (β2)', '—'],
            ['Medula adrenal',     'Liberação de Adrenalina / NA (N)', '—'],
          ].map(([organ, symp, para], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#0d1117' : '#111820' }}>
              <Td bold>{organ}</Td>
              <Td color="#e67e22">{symp}</Td>
              <Td color="#27ae60">{para}</Td>
            </tr>
          ))}
        </tbody>
      </table>

      <Mnemonic color="#7fdbff" title="Regra geral">
        <p style={{ margin: '0 0 6px', fontSize: 12, color: '#c9d1d9', lineHeight: 1.7 }}>
          <strong>Simpático</strong> = luta, fuga, susto → coração acelerado, pupilas abertas, brônquios dilatados, GI inibido.
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#c9d1d9', lineHeight: 1.7 }}>
          <strong>Parassimpático</strong> = repouso, digestão → coração lento, pupilas fechadas, GI ativo, secreções aumentadas.
        </p>
      </Mnemonic>
    </div>
  );
}

// ─── RECEPTORES ADRENÉRGICOS ──────────────────────────────────────────────────
function RecAdren() {
  const recs = [
    {
      name: 'α1', color: '#e67e22',
      coupling: 'Gq → ↑ IP₃/DAG → ↑ Ca²⁺',
      location: 'Músculo liso vascular, íris (radial), bexiga (esfíncter), pele',
      effects: ['Vasoconstrição', 'Midríase', 'Contração esfíncter urinário', 'Contração músculo liso GI (esfíncter)'],
      agonists: ['Fenilefrina', 'Epinefrina', 'Norepinefrina'],
      antagonists: ['Prazosina', 'Fentolamina', 'Labetalol'],
    },
    {
      name: 'α2', color: '#d35400',
      coupling: 'Gi → ↓ AMPc',
      location: 'Pré-sináptico (autorreceptor), SNC, plaquetas, vasos',
      effects: ['Inibe liberação de NA (pré-sináptico)', 'Vasoconstrição (vascular)', 'Reduz tônus simpático central', 'Inibe agregação plaquetária'],
      agonists: ['Clonidina (central)', 'Metildopa'],
      antagonists: ['Ioimbina', 'Fentolamina'],
    },
    {
      name: 'β1', color: '#f39c12',
      coupling: 'Gs → ↑ AMPc → ↑ PKA',
      location: 'Coração, rins (aparelho justaglomerular)',
      effects: ['↑ Frequência cardíaca (cronotropia +)', '↑ Contratilidade (inotropia +)', '↑ Velocidade condução (dromocropia +)', '↑ Liberação de renina (rins)'],
      agonists: ['Dobutamina', 'Dopamina (dose média)', 'Epinefrina', 'Norepinefrina'],
      antagonists: ['Metoprolol', 'Atenolol', 'Propranolol'],
    },
    {
      name: 'β2', color: '#e67e22',
      coupling: 'Gs → ↑ AMPc',
      location: 'Músculo liso brônquico, vascular, uterino; músculo esquelético',
      effects: ['Broncodilatação', 'Vasodilatação (músculo esquelético, vasos)', 'Relaxamento uterino (tocolítico)', 'Tremor de extremidades', 'Hipocalemia (↑ captação K⁺)'],
      agonists: ['Salbutamol', 'Isoproterenol', 'Epinefrina'],
      antagonists: ['Propranolol (não-seletivo)', 'Butoxamina'],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InfoBox color="#e67e22">
        Os receptores adrenérgicos são ativados pelas catecolaminas endógenas (adrenalina e noradrenalina).
        São divididos em α e β, cada um com subtipos que possuem distribuição e funções distintas.
      </InfoBox>
      {recs.map(r => (
        <div key={r.name} style={{ background: '#111c2b', border: `1px solid ${r.color}44`, borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: r.color, fontFamily: 'monospace' }}>Receptor {r.name}</span>
            <span style={{ fontSize: 11, color: '#6b7280', background: '#0d1117', borderRadius: 4, padding: '3px 8px' }}>{r.coupling}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Label>Localização</Label>
              <p style={{ margin: 0, fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>{r.location}</p>
              <Label style={{ marginTop: 10 }}>Efeitos</Label>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {r.effects.map((e, i) => <li key={i} style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.8 }}>{e}</li>)}
              </ul>
            </div>
            <div>
              <Label>Agonistas</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {r.agonists.map(a => <Pill key={a} color={r.color}>{a}</Pill>)}
              </div>
              <Label>Antagonistas</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {r.antagonists.map(a => <Pill key={a} color="#95a5a6">{a}</Pill>)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── RECEPTORES COLINÉRGICOS ──────────────────────────────────────────────────
function RecColin() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InfoBox color="#27ae60">
        Os receptores colinérgicos são ativados pela acetilcolina (ACh). Dividem-se em
        <strong> muscarínicos</strong> (M1–M5, acoplados à proteína G) e <strong>nicotínicos</strong> (Nm e Nn, canais iônicos).
      </InfoBox>

      <SectionTitle>Muscarínicos</SectionTitle>
      {[
        {
          name: 'M1', color: '#27ae60',
          coupling: 'Gq → ↑ IP₃/DAG',
          location: 'SNC (hipocampo, córtex), gânglios, glândulas gástricas',
          effects: ['Funções cognitivas e de memória', 'Estimulação ganglionar', '↑ Secreção ácida gástrica'],
          drugs: ['Agonistas: Pilocarpina, Carbacol', 'Antagonistas: Atropina, Pirenzepina'],
        },
        {
          name: 'M2', color: '#1e8449',
          coupling: 'Gi → ↓ AMPc; abertura canais K⁺',
          location: 'Coração (nó SA, nó AV, átrios), musculatura lisa',
          effects: ['↓ Frequência cardíaca', '↓ Condução AV (bloqueio AV em excesso)', '↓ Contratilidade atrial'],
          drugs: ['Agonistas: ACh, Carbacol', 'Antagonistas: Atropina, Glicopirrolato'],
        },
        {
          name: 'M3', color: '#27ae60',
          coupling: 'Gq → ↑ IP₃/DAG → ↑ Ca²⁺',
          location: 'Músculo liso (brônquios, GI, bexiga, íris circular), glândulas exócrinas',
          effects: ['Broncoconstrição', 'Miose (constrição pupilar)', '↑ Motilidade GI', '↑ Secreções (saliva, lágrimas, suor, muco brônquico)', 'Contração detrusor (micção)'],
          drugs: ['Agonistas: Pilocarpina, Betanecol', 'Antagonistas: Atropina, Ipratrópio, Escopolamina'],
        },
      ].map(r => (
        <div key={r.name} style={{ background: '#111c2b', border: `1px solid ${r.color}44`, borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: r.color, fontFamily: 'monospace' }}>Receptor {r.name}</span>
            <span style={{ fontSize: 11, color: '#6b7280', background: '#0d1117', borderRadius: 4, padding: '3px 8px' }}>{r.coupling}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Label>Localização</Label>
              <p style={{ margin: 0, fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>{r.location}</p>
              <Label style={{ marginTop: 10 }}>Efeitos</Label>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {r.effects.map((e, i) => <li key={i} style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.8 }}>{e}</li>)}
              </ul>
            </div>
            <div>
              <Label>Fármacos relevantes</Label>
              {r.drugs.map((d, i) => (
                <p key={i} style={{ margin: '0 0 4px', fontSize: 12, color: '#8b949e' }}>{d}</p>
              ))}
            </div>
          </div>
        </div>
      ))}

      <SectionTitle>Nicotínicos</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: '#111c2b', border: '1px solid #27ae6044', borderRadius: 10, padding: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#27ae60' }}>Nn — Nicotínico Neuronal</span>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '8px 0 4px' }}>Canal iônico ligante-dependente (Na⁺/K⁺)</p>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '0 0 8px' }}><strong>Local:</strong> Gânglios autonômicos (simpáticos e parassimpáticos), medula adrenal</p>
          <p style={{ fontSize: 12, color: '#c9d1d9', margin: 0 }}>Estimulação ganglionar → transmissão autonômica; liberação de adrenalina/NA pela medula adrenal</p>
        </div>
        <div style={{ background: '#111c2b', border: '1px solid #27ae6044', borderRadius: 10, padding: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#27ae60' }}>Nm — Nicotínico Muscular</span>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '8px 0 4px' }}>Canal iônico ligante-dependente (Na⁺/K⁺)</p>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '0 0 8px' }}><strong>Local:</strong> Junção neuromuscular (placa motora)</p>
          <p style={{ fontSize: 12, color: '#c9d1d9', margin: 0 }}>Contração do músculo esquelético. Bloqueado por curarizantes (bloqueadores neuromusculares).</p>
        </div>
      </div>

      <Mnemonic color="#27ae60" title="Mnemônico SLUDGE — Síndrome Colinérgica">
        <ul style={{ margin: '0 0 10px', paddingLeft: 18 }}>
          {[
            <><strong>S</strong>alivação excessiva</>,
            <><strong>L</strong>acrimejamento</>,
            <><strong>U</strong>rinação involuntária</>,
            <><strong>D</strong>efecação / Diarreia</>,
            <><strong>G</strong>I — cólicas, náusea, vômito</>,
            <><strong>E</strong>mese (vômito)</>,
          ].map((item, i) => <li key={i} style={{ lineHeight: 1.9, fontSize: 12, color: '#c9d1d9' }}>{item}</li>)}
        </ul>
        <p style={{ margin: 0, fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>
          Causado por anticolinesterásicos (neostigmina, fisostigmina, organofosforados) ou agonistas
          muscarínicos em excesso. Antídoto: <strong style={{ color: '#27ae60' }}>Atropina</strong>.
        </p>
      </Mnemonic>
    </div>
  );
}

// ─── SEÇÃO DE FÁRMACOS (genérica) ────────────────────────────────────────────
function DrugSection({ cls, color }: { cls: string; color: string }) {
  const list = drugs.filter(d => d.class === cls);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {list.map(drug => (
        <div key={drug.id} style={{ background: '#111c2b', border: `1px solid ${color}33`, borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color }}>{drug.name}</span>
              {drug.genericName !== drug.name && (
                <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>({drug.genericName})</span>
              )}
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#6b7280' }}>{drug.subclass}</p>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {drug.receptors.map(r => (
                <span key={r} style={{ fontSize: 10, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 4, padding: '2px 7px', fontFamily: 'monospace' }}>{r}</span>
              ))}
            </div>
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>{drug.mechanism}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {[
              { label: 'FC', value: drug.effects.heartRate, unit: '%' },
              { label: 'PAS', value: drug.effects.systolicBP, unit: '%' },
              { label: 'Brônquio', value: drug.effects.bronchialDiameter, unit: '%' },
              { label: 'Pupila', value: drug.effects.pupilDilation, unit: '%' },
              { label: 'TGI', value: drug.effects.giMotility, unit: '%' },
            ].map(({ label, value, unit }) => (
              <div key={label} style={{ background: '#0d1117', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#4d6a7a', marginBottom: 2, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: value > 0 ? '#2ecc71' : value < 0 ? '#e74c3c' : '#6b7280' }}>
                  {value > 0 ? '+' : ''}{value}{unit}
                </div>
              </div>
            ))}
          </div>
          {(drug.effects.sweating > 0.3 || drug.effects.salivation > 0.3 || drug.effects.lacrimation > 0.3 || drug.effects.tremor > 0.3) && (
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {drug.effects.sweating   > 0.3 && <Tag color="#7fc8f8">Sudorese</Tag>}
              {drug.effects.salivation > 0.3 && <Tag color="#7fc8f8">Sialorréia</Tag>}
              {drug.effects.lacrimation> 0.3 && <Tag color="#7fc8f8">Lacrimejamento</Tag>}
              {drug.effects.tremor     > 0.3 && <Tag color="#e67e22">Tremor</Tag>}
              {drug.effects.sweating  < -0.3 && <Tag color="#f39c12">Anhidrose</Tag>}
              {drug.effects.salivation< -0.3 && <Tag color="#f39c12">Boca seca</Tag>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── INTERAÇÕES ───────────────────────────────────────────────────────────────
function InterSection() {
  const sevOrder = { danger: 0, warning: 1, info: 2 };
  const sorted = [...interactions].sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity]);
  const sevStyle = {
    danger:  { color: '#e74c3c', bg: 'rgba(231,76,60,0.08)',  border: '#e74c3c44', badge: 'Perigo' },
    warning: { color: '#f39c12', bg: 'rgba(243,156,18,0.08)', border: '#f39c1244', badge: 'Atenção' },
    info:    { color: '#3498db', bg: 'rgba(52,152,219,0.08)', border: '#3498db44', badge: 'Info' },
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <InfoBox color="#f39c12">
        Interações ocorrem quando dois fármacos alteram mutuamente seus efeitos farmacodinâmicos.
        Podem ser <strong>antagônicas</strong> (efeitos opostos), <strong>sinérgicas</strong> (efeitos somados) ou
        causar <strong>reversão de efeito</strong> (bloqueio seletivo de um receptor muda o perfil do outro).
      </InfoBox>
      {sorted.map((inter, i) => {
        const s = sevStyle[inter.severity];
        return (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: `${s.border}`, borderRadius: 4, padding: '2px 8px' }}>{s.badge}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: s.color }}>{inter.title}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              {inter.drugIds.map(id => {
                const d = drugs.find(drug => drug.id === id);
                return <Pill key={id} color={s.color}>{d?.name ?? id}</Pill>;
              })}
              <span style={{ fontSize: 12, color: '#6b7280', alignSelf: 'center' }}>+ interação</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#8b949e', lineHeight: 1.7 }}>{inter.description}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── TABELA RESUMO ────────────────────────────────────────────────────────────
function SummaryTable() {
  const CLASS_COLOR: Record<string, string> = {
    agonista_adrenergico:   '#e67e22',
    bloqueador_adrenergico: '#95a5a6',
    agonista_colinergico:   '#27ae60',
    bloqueador_colinergico: '#8e44ad',
  };
  const CLASS_LABEL: Record<string, string> = {
    agonista_adrenergico:   'Ag. Adrenérgico',
    bloqueador_adrenergico: 'Bloq. Adrenérgico',
    agonista_colinergico:   'Ag. Colinérgico',
    bloqueador_colinergico: 'Bloq. Colinérgico',
  };
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ background: '#111c2b' }}>
            <Th>Fármaco</Th>
            <Th>Classe</Th>
            <Th>Receptores</Th>
            <Th color="#2ecc71">FC</Th>
            <Th color="#e74c3c">PAS</Th>
            <Th color="#3498db">Brônquio</Th>
            <Th color="#f39c12">Pupila</Th>
            <Th>TGI</Th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((d, i) => {
            const color = CLASS_COLOR[d.class];
            const fmt = (v: number) => (
              <td style={{ padding: '7px 10px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 600, color: v > 0 ? '#2ecc71' : v < 0 ? '#e74c3c' : '#6b7280', background: i % 2 === 0 ? '#0d1117' : '#0e1622' }}>
                {v > 0 ? '+' : ''}{v}%
              </td>
            );
            return (
              <tr key={d.id}>
                <td style={{ padding: '7px 10px', color, fontWeight: 600, background: i % 2 === 0 ? '#0d1117' : '#0e1622', whiteSpace: 'nowrap' }}>{d.name}</td>
                <td style={{ padding: '7px 10px', background: i % 2 === 0 ? '#0d1117' : '#0e1622' }}>
                  <span style={{ fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap' }}>
                    {CLASS_LABEL[d.class]}
                  </span>
                </td>
                <td style={{ padding: '7px 10px', color: '#6b7280', background: i % 2 === 0 ? '#0d1117' : '#0e1622' }}>
                  {d.receptors.join(', ')}
                </td>
                {fmt(d.effects.heartRate)}
                {fmt(d.effects.systolicBP)}
                {fmt(d.effects.bronchialDiameter)}
                {fmt(d.effects.pupilDilation)}
                {fmt(d.effects.giMotility)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── COMPONENTES AUXILIARES ───────────────────────────────────────────────────
function InfoBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: `${color}0d`, border: `1px solid ${color}33`, borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#c9d1d9', lineHeight: 1.7 }}>
      {children}
    </div>
  );
}

function Mnemonic({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: `${color}0c`, border: `1px solid ${color}33`, borderLeft: `4px solid ${color}`, borderRadius: 8, padding: '14px 18px' }}>
      <div style={{ color, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function DivCard({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div style={{ background: '#111c2b', border: `1px solid ${color}33`, borderRadius: 10, padding: 16 }}>
      <div style={{ color, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {items.map((item, i) => <li key={i} style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.9 }}>{item}</li>)}
      </ul>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ margin: '8px 0 4px', fontSize: 14, color: '#7fdbff', fontWeight: 600, letterSpacing: '0.03em' }}>{children}</h3>;
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ margin: '0 0 4px', fontSize: 10, color: '#4d6a7a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, ...style }}>{children}</p>;
}

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 11, color, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 12, padding: '2px 8px' }}>
      {children}
    </span>
  );
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 10, color, background: `${color}15`, border: `1px solid ${color}44`, borderRadius: 4, padding: '2px 7px' }}>
      {children}
    </span>
  );
}

function Th({ children, color }: { children: React.ReactNode; color?: string }) {
  return <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 11, color: color ?? '#6b7280', fontWeight: 600, borderBottom: '1px solid #21262d', whiteSpace: 'nowrap' }}>{children}</th>;
}

function Td({ children, bold, color }: { children: React.ReactNode; bold?: boolean; color?: string }) {
  return <td style={{ padding: '8px 12px', fontSize: 12, color: color ?? '#c9d1d9', fontWeight: bold ? 600 : 400 }}>{children}</td>;
}
