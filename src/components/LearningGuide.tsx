import { useState } from 'react';
import { useWindowWidth } from '../hooks/useWindowWidth';

const TOPICS = [
  { id: 'sna',    label: 'Visão Geral do SNA',         color: '#7fdbff' },
  { id: 'trans',  label: 'Neurotransmissão',            color: '#7fdbff' },
  { id: 'rec_a',  label: 'Receptores Adrenérgicos',     color: '#e67e22' },
  { id: 'rec_c',  label: 'Receptores Colinérgicos',     color: '#27ae60' },
  { id: 'agon_a', label: 'Agonistas Adrenérgicos',      color: '#e67e22' },
  { id: 'bloq_a', label: 'Bloqueadores Adrenérgicos',   color: '#95a5a6' },
  { id: 'agon_c', label: 'Agonistas Colinérgicos',      color: '#27ae60' },
  { id: 'bloq_c', label: 'Bloqueadores Colinérgicos',   color: '#8e44ad' },
  { id: 'inter',  label: 'Interações Medicamentosas',   color: '#f39c12' },
];

import { drugs } from '../data/drugs';
import { interactions } from '../data/interactions';

interface Props {
  onSimulateInteraction: (id1: string, id2: string) => void;
  onSimulateDrug: (id: string) => void;
}

export default function LearningGuide({ onSimulateInteraction, onSimulateDrug }: Props) {
  const [active, setActive] = useState('sna');
  const width    = useWindowWidth();
  const isMobile = width < 700;
  const topic    = TOPICS.find(t => t.id === active)!;

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, minHeight: 0, overflow: 'hidden' }}>

      {isMobile ? (
        <div style={{ display: 'flex', overflowX: 'auto', gap: 6, padding: '10px 12px', background: '#0d1117', borderBottom: '1px solid #21262d', flexShrink: 0 }}>
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              whiteSpace: 'nowrap', flexShrink: 0,
              background: active === t.id ? `${t.color}20` : '#111c2b',
              border: `1px solid ${active === t.id ? t.color : '#21262d'}`,
              borderRadius: 20, padding: '6px 12px',
              color: active === t.id ? t.color : '#6b7280',
              fontSize: 12, fontWeight: active === t.id ? 600 : 400, cursor: 'pointer',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      ) : (
        <nav style={{ width: 220, flexShrink: 0, background: '#0d1117', borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '12px 10px', gap: 4 }}>
          <p style={{ margin: '0 0 8px 6px', fontSize: 10, color: '#4d6a7a', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Tópicos</p>
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

      <div style={{ flex: 1, overflowY: 'auto', background: 'linear-gradient(180deg,#0d1117,#0a1018)', padding: isMobile ? '20px 16px' : '28px 36px' }}>
        <div style={{ maxWidth: 860 }}>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 10, color: topic.color, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Guia de Aprendizado</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 22, color: '#e6edf3', fontWeight: 700 }}>{topic.label}</h2>
          </div>
          {active === 'sna'    && <SnaSection />}
          {active === 'trans'  && <TransSection />}
          {active === 'rec_a'  && <RecAdren />}
          {active === 'rec_c'  && <RecColin />}
          {active === 'agon_a' && <AgonAdren onSimulate={onSimulateDrug} />}
          {active === 'bloq_a' && <BloqAdren onSimulate={onSimulateDrug} />}
          {active === 'agon_c' && <AgonColin onSimulate={onSimulateDrug} />}
          {active === 'bloq_c' && <BloqColin onSimulate={onSimulateDrug} />}
          {active === 'inter'  && <InterSection onSimulate={onSimulateInteraction} />}
        </div>
      </div>
    </div>
  );
}

// ─── VISÃO GERAL DO SNA ──────────────────────────────────────────────────────
function SnaSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <InfoBox color="#7fdbff">
        O SNA regula funções viscerais involuntárias. É organizado em 2 neurônios em série:
        neurônio <strong>pré-ganglionar</strong> (dentro do SNC) e neurônio <strong>pós-ganglionar</strong> (fora do SNC, no gânglio autonômico),
        sob controle do hipotálamo e sistema límbico.
      </InfoBox>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <DivCard title="Divisão Simpática" color="#e67e22" items={[
          'Fibras pré-ganglionares: origem toracolombares (T1–T12, L1–L3) — CURTAS',
          'Fibras pós-ganglionares: gânglios para-/pré-vertebrais — LONGAS',
          'Neurotransmissor pré: Acetilcolina (receptores Nn)',
          'Neurotransmissor pós: Noradrenalina (receptores α e β)',
          'Exceção: glândulas salivares, sudoríparas, lacrimais e medula suprarrenal — o pós-ganglionar libera ACh',
          'Resposta: "fight or flight" — luta ou fuga',
        ]}/>
        <DivCard title="Divisão Parassimpática" color="#27ae60" items={[
          'Fibras pré-ganglionares: origem craniossacral (nervos III, VII, IX, X e S2–S4) — LONGAS',
          'Fibras pós-ganglionares: gânglios próximos ao órgão efetor — CURTAS',
          'Neurotransmissor pré e pós: Acetilcolina',
          'Receptores efetores: muscarínicos (M1–M5)',
          'Resposta: "rest and digest" — repouso e digestão',
        ]}/>
      </div>

      <Note>Simpático e parassimpático normalmente se opõem, mas há casos em que se somam: ejaculação (simpático) + ereção (parassimpático). A secreção salivar fica mais densa no simpático e mais líquida no parassimpático.</Note>

      <SectionTitle>Sistema Entérico</SectionTitle>
      <InfoBox color="#7fdbff">
        Organizado pelos plexos <strong>mioentérico</strong> (de Auerbach) e <strong>submucoso</strong> (de Meissner). Possui vários neurotransmissores e pode funcionar de forma autônoma, regulando a motilidade e secreção do TGI.
      </InfoBox>

      <SectionTitle>Efeitos Comparativos</SectionTitle>
      <div style={{ overflowX: 'auto' }}>
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
              ['Coração — FC',          '↑ FC, ↑ contratilidade, ↑ condução (β1)',       '↓ FC, ↓ condução AV (M2)'],
              ['Vasos sanguíneos',       'Vasoconstrição (α1) / Vasodilatação músculo (β2)', 'Vasodilatação via NO (M3)'],
              ['Brônquios',             'Broncodilatação (β2)',                             'Broncoconstrição, ↑ secreção (M3)'],
              ['Pupilas',               'Midríase — M. radial (α1)',                       'Miose — M. constritor (M3)'],
              ['Trato GI — motilidade', '↓ peristaltismo, contração esfíncteres (α1, β2)', '↑ peristaltismo, relaxamento esfíncteres (M3)'],
              ['Bexiga urinária',       'Relaxamento detrusor (β2), contração esfíncter (α1)', 'Contração detrusor (M3), relaxamento esfíncter (M2)'],
              ['Glândulas exócrinas',  '↓ secreção (α1)',                                  '↑ secreção salivar, lacrimal, suor, brônquica (M3)'],
              ['Fígado',               'Glicogenólise + gliconeogênese (β2)',              '—'],
              ['Pâncreas',             'Inibe insulina (α2), estimula glucagon (β2)',      '—'],
              ['Rins',                 'Libera renina (β1)',                               '—'],
              ['Medula suprarrenal',   'Libera Adrenalina / Noradrenalina (Nn)',           '—'],
            ].map(([organ, symp, para], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#0d1117' : '#111820' }}>
                <Td bold>{organ}</Td>
                <Td color="#e67e22">{symp}</Td>
                <Td color="#27ae60">{para}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── NEUROTRANSMISSÃO ────────────────────────────────────────────────────────
function TransSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionTitle>Neurotransmissão Adrenérgica</SectionTitle>
      <InfoBox color="#e67e22">
        <strong>Síntese das catecolaminas:</strong><br/>
        Tirosina → <em>(Tirosina hidroxilase — etapa limitante)</em> → L-DOPA → <em>(DOPA descarboxilase)</em> → Dopamina → <em>(VMAT, para vesícula)</em><br/>
        Dopamina → <em>(Dopamina β-hidroxilase)</em> → Norepinefrina → liberada por exocitose (Ca²⁺)<br/>
        Norepinefrina → <em>(PNMT, na medula suprarrenal)</em> → Epinefrina<br/><br/>
        <strong>Recaptação:</strong> NET (transportador de norepinefrina) recapta NE da fenda para o terminal axonal.<br/>
        <strong>Metabolismo:</strong> NE e Epi → COMT + MAO-A · Dopamina → COMT + MAO-B
      </InfoBox>

      <SectionTitle>Fármacos que interferem na transmissão adrenérgica</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { drug: 'Reserpina',        action: 'Inibe VMAT → esgota pool de reserva de NE. Causa depressão central (afeta todas as monoaminas, incluindo serotonina).' },
          { drug: 'Cocaína / Anfetamina', action: 'Inibem NET → mais NE na fenda sináptica. Anfetaminas também estimulam liberação de catecolaminas e inibem MAO.' },
          { drug: 'α-metiltirosina',  action: 'Inibe Tirosina hidroxilase → bloqueia síntese de NE.' },
          { drug: 'Inibidores da MAO',action: 'Maior disponibilidade de NE, dopamina e serotonina.' },
        ].map(({ drug, action }) => (
          <div key={drug} style={{ background: '#111c2b', border: '1px solid #e67e2233', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ color: '#e67e22', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{drug}</div>
            <p style={{ margin: 0, fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>{action}</p>
          </div>
        ))}
      </div>

      <SectionTitle>Neurotransmissão Colinérgica</SectionTitle>
      <InfoBox color="#27ae60">
        <strong>Síntese:</strong> AcCoA + Colina → <em>(Colina acetiltransferase)</em> → ACh → <em>(VAchT)</em> → vesícula → exocitose (Ca²⁺)<br/><br/>
        <strong>Degradação:</strong><br/>
        • <em>Acetilcolinesterase (AChE)</em> — na fenda sináptica, ataca o grupamento éster<br/>
        • <em>Butirilcolinesterase (BuChE)</em> — fora da fenda, degrada qualquer éster<br/>
        → Colina + Acetato. A colina é recaptada e sofre "síntese de novo".
      </InfoBox>

      <SectionTitle>Fármacos que interferem na transmissão colinérgica</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { drug: 'Hemicolínio',         action: 'Inibe captação neuronal de colina → bloqueia síntese de ACh.' },
          { drug: 'Vesamicol',           action: 'Inibe VAchT → impede armazenamento de ACh nas vesículas.' },
          { drug: 'Toxina Botulínica',   action: 'Inibe o complexo de proteínas que promove a exocitose das vesículas de ACh.' },
          { drug: 'Anticolinesterásicos',action: 'Inibem a AChE → aumentam a quantidade de ACh disponível na fenda sináptica.' },
        ].map(({ drug, action }) => (
          <div key={drug} style={{ background: '#111c2b', border: '1px solid #27ae6033', borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ color: '#27ae60', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{drug}</div>
            <p style={{ margin: 0, fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>{action}</p>
          </div>
        ))}
      </div>

      <Note>Síndrome de Eaton Lambert: doença autoimune que destrói o complexo de proteínas que libera ACh (análoga à toxina botulínica). Síndrome de Sjögren: secura ocular e na boca por processo autoimune de destruição glandular.</Note>
      <Note>Miastenia gravis: destruição progressiva dos receptores nicotínicos Nm (autoimune), gerando fraqueza muscular, paralisia diafragmática e morte.</Note>
    </div>
  );
}

// ─── RECEPTORES ADRENÉRGICOS ──────────────────────────────────────────────────
function RecAdren() {
  const recs = [
    {
      name: 'α1', color: '#e67e22',
      coupling: 'Gq → ↑ IP₃/DAG → ↑ Ca²⁺',
      potencia: 'NE > Epi >> ISO',
      location: 'Músculo liso vascular (α1B), próstata (α1A), aorta/coronárias (α1D), íris (M. radial), esfíncter bexiga',
      effects: ['Vasoconstrição', 'Broncoconstrição', 'Midríase (contração M. radial)', 'Contração esfíncteres TGI e bexiga', 'Contração musculatura uterina', 'Ejaculação (vias seminais e próstata)', 'Glicogenólise hepática'],
      agonists: ['Fenilefrina', 'Epinefrina', 'Norepinefrina', 'Midodrina'],
      antagonists: ['Prazosina', 'Fentolamina', 'Fenoxibenzamina', 'Labetalol'],
    },
    {
      name: 'α2', color: '#d35400',
      coupling: 'Gi → ↓ AMPc',
      potencia: 'Epi ≥ NE >> ISO',
      location: 'Pré-sináptico (autorreceptor) — terminal adrenérgico; também pós-sináptico em vasos e pâncreas',
      effects: ['↓ liberação de NE (pré-sináptico — "freio" simpático)', 'Vasoconstrição (quando pós-sináptico)', 'Inibição liberação de insulina (pós-sináptico)', 'Estimula agregação plaquetária'],
      agonists: ['Clonidina (central)', 'Brimonidina', 'Apraclonidina', 'MetilDOPA'],
      antagonists: ['Ioimbina', 'Fentolamina'],
    },
    {
      name: 'β1', color: '#f39c12',
      coupling: 'Gs → ↑ AMPc → ↑ PKA',
      potencia: 'ISO > Epi = NE',
      location: 'Coração (nó SA, nó AV, miocárdio) + rins (aparelho justaglomerular)',
      effects: ['↑ Frequência cardíaca (cronotropismo +)', '↑ Força de contração (inotropismo +)', '↑ Velocidade de condução (dromotropismo +)', '↑ Liberação de renina → ↑ angiotensina II → ↑ aldosterona'],
      agonists: ['Dobutamina (seletivo)', 'Isoproterenol', 'Epinefrina', 'Norepinefrina'],
      antagonists: ['Metoprolol (seletivo)', 'Atenolol (seletivo)', 'Bisoprolol (seletivo)', 'Propranolol (não seletivo)'],
    },
    {
      name: 'β2', color: '#e67e22',
      coupling: 'Gs → ↑ AMPc',
      potencia: 'ISO > Epi > NE  (Epi: vasodilatação em doses baixas; α1 em doses altas)',
      location: 'Músculo liso brônquico, vascular, uterino, TGI, bexiga; músculo esquelético; mastócitos',
      effects: ['Broncodilatação', 'Vasodilatação (músculo esquelético e coronárias)', 'Relaxamento uterino (tocolítico)', 'Relaxamento esfíncteres TGI e bexiga', 'Gliconeogênese hepática', 'Inibe liberação de histamina dos mastócitos', '↑ Liberação de insulina', 'Tremor de extremidades (músculo esquelético)'],
      agonists: ['Salbutamol (seletivo)', 'Salmeterol (longa ação)', 'Terbutalina', 'Isoproterenol', 'Efedrina'],
      antagonists: ['Propranolol (não seletivo)', 'Butoxamina (seletivo)'],
    },
    {
      name: 'β3', color: '#e67e22',
      coupling: 'Gs → ↑ AMPc',
      potencia: 'ISO > NE > Epi',
      location: 'Tecido adiposo, bexiga urinária (M. detrusor), tecido cardíaco',
      effects: ['Lipólise e termogênese (tecido adiposo)', 'Relaxamento M. detrusor da bexiga (↓ incontinência urinária)', 'Inotropismo negativo cardíaco'],
      agonists: ['Mirabegron (seletivo β3, incontinência urinária)'],
      antagonists: ['—'],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InfoBox color="#e67e22">
        Receptores adrenérgicos são ativados pelas catecolaminas endógenas (adrenalina e noradrenalina).
        Dividem-se em α (α1 e α2) e β (β1, β2 e β3). Cada subtipo possui distribuição tecidual,
        acoplamento a proteína G e perfil farmacológico distintos.
      </InfoBox>
      {recs.map(r => (
        <div key={r.name} style={{ background: '#111c2b', border: `1px solid ${r.color}44`, borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: r.color, fontFamily: 'monospace' }}>Receptor {r.name}</span>
            <span style={{ fontSize: 11, color: '#6b7280', background: '#0d1117', borderRadius: 4, padding: '3px 8px' }}>{r.coupling}</span>
            <span style={{ fontSize: 11, color: r.color, background: `${r.color}15`, borderRadius: 4, padding: '3px 8px' }}>Potência: {r.potencia}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Label>Localização</Label>
              <p style={{ margin: '0 0 10px', fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>{r.location}</p>
              <Label>Efeitos principais</Label>
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
        Receptores colinérgicos são ativados pela acetilcolina. Dividem-se em <strong>muscarínicos</strong> (M1–M5, metabotrópicos, acoplados à proteína G)
        e <strong>nicotínicos</strong> (Nm e Nn, ionotrópicos — canais de Na⁺/K⁺).
      </InfoBox>

      <SectionTitle>Receptores Muscarínicos</SectionTitle>
      {[
        {
          name: 'M1', coupling: 'Gq → ↑ IP₃/DAG → ↑ Ca²⁺',
          location: 'SNC (córtex cerebral, hipocampo, núcleo estriado), gânglios autonômicos, glândulas salivares e gástricas',
          effects: ['Estimulação do SNC', 'Secreção salivar e gástrica (↑ HCl)', 'Despolarização ganglionar'],
          drugs: ['Agonistas: Pilocarpina, Carbacol, ACh', 'Antagonistas: Atropina, Pirenzepina (seletivo M1 → ↓ HCl)'],
        },
        {
          name: 'M2', coupling: 'Gi → ↓ AMPc + abertura de canais K⁺',
          location: 'Coração (nó SA, nó AV, átrios), esfíncter bexiga urinária; também pré-sináptico',
          effects: ['↓ Frequência cardíaca (cronotropismo negativo)', '↓ Velocidade de condução AV (dromotropismo negativo)', '↓ Força contráctil atrial (inotropismo negativo atrial)', 'Relaxamento esfíncter da bexiga urinária'],
          drugs: ['Agonistas: ACh, Carbacol', 'Antagonistas: Atropina, Glicopirrolato, Solifenacina, Tolterodina'],
        },
        {
          name: 'M3', coupling: 'Gq → ↑ IP₃/DAG → ↑ Ca²⁺',
          location: 'Músculo liso (brônquios, bexiga [detrusor], endotélio vascular, TGI, útero), glândulas exócrinas, íris (M. constritor)',
          effects: ['Broncoconstrição + broncorreia', 'Contração M. detrusor (micção) — estímulo miccional e fecal', 'Vasodilatação mediada por NO (produção endotelial)', 'Sudorese (glândulas sudoríparas)', 'Sialorréia (glândulas salivares)', 'Lacrimejamento', 'Miose (contração M. constritor da pupila)', 'Acomodação do cristalino', '↑ Motilidade TGI (peristalse)'],
          drugs: ['Agonistas: Pilocarpina, Betanecol (seletivo M3), Carbacol', 'Antagonistas: Atropina, Ipratrópio (brônquios), Tiotrópio, Tropicamida (midriático)'],
        },
        {
          name: 'M4 e M5', coupling: 'M4: Gi · M5: Gq',
          location: 'SNC predominantemente',
          effects: ['M4: inibição de neurônios no SNC (Gi)', 'M5: modulação da via dopaminérgica mesolímbica'],
          drugs: ['Sem aplicação clínica relevante atualmente'],
        },
      ].map(r => (
        <div key={r.name} style={{ background: '#111c2b', border: '1px solid #27ae6044', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#27ae60', fontFamily: 'monospace' }}>Receptor {r.name}</span>
            <span style={{ fontSize: 11, color: '#6b7280', background: '#0d1117', borderRadius: 4, padding: '3px 8px' }}>{r.coupling}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Label>Localização</Label>
              <p style={{ margin: '0 0 10px', fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>{r.location}</p>
              <Label>Efeitos</Label>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {r.effects.map((e, i) => <li key={i} style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.8 }}>{e}</li>)}
              </ul>
            </div>
            <div>
              <Label>Fármacos</Label>
              {r.drugs.map((d, i) => <p key={i} style={{ margin: '0 0 6px', fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}>{d}</p>)}
            </div>
          </div>
        </div>
      ))}

      <SectionTitle>Receptores Nicotínicos</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: '#111c2b', border: '1px solid #27ae6044', borderRadius: 10, padding: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#27ae60' }}>Nn — Nicotínico Neuronal</span>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '8px 0 4px' }}>Canal iônico de Na⁺/K⁺ (ionotrópico)</p>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '0 0 8px' }}><strong>Local:</strong> Gânglios autonômicos, região medular das glândulas suprarrenais, SNC</p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.8 }}>Estimulação do neurônio pós-ganglionar</li>
            <li style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.8 }}>Liberação de catecolaminas pela medula suprarrenal</li>
          </ul>
        </div>
        <div style={{ background: '#111c2b', border: '1px solid #27ae6044', borderRadius: 10, padding: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#27ae60' }}>Nm — Nicotínico Muscular</span>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '8px 0 4px' }}>Canal iônico de Na⁺/K⁺ (ionotrópico)</p>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '0 0 8px' }}><strong>Local:</strong> Junção neuromuscular (placa motora)</p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.8 }}>Despolarização da placa motora → contração muscular</li>
            <li style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.8 }}>Bloqueado por curarizantes (bloqueadores neuromusculares)</li>
          </ul>
        </div>
      </div>

      <Mnemonic color="#27ae60" title="Mnemônico SLUDGE — Síndrome Colinérgica (excesso muscarínico)">
        <ul style={{ margin: '0 0 10px', paddingLeft: 18 }}>
          {[
            <><strong>S</strong>alivação excessiva (sialorréia)</>,
            <><strong>L</strong>acrimejamento</>,
            <><strong>U</strong>rinação involuntária</>,
            <><strong>D</strong>efecação / Diarreia</>,
            <><strong>G</strong>I — cólicas, náuseas, vômito, hipermotilidade</>,
            <><strong>E</strong>mese (vômito)</>,
          ].map((item, i) => <li key={i} style={{ lineHeight: 1.9, fontSize: 12, color: '#c9d1d9' }}>{item}</li>)}
        </ul>
        <p style={{ margin: '0 0 6px', fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>
          + Broncoconstrição, bradicardia, miose, hipotensão.<br/>
          <strong>Causas:</strong> organofosforados, anticolinesterásicos, agonistas muscarínicos em excesso, aldicarb (chumbinho).<br/>
          <strong>Antídoto:</strong> <span style={{ color: '#27ae60' }}>Atropina</span> + Pralidoxima (regenerador enzimático para organofosforados).
        </p>
      </Mnemonic>
    </div>
  );
}

// ─── AGONISTAS ADRENÉRGICOS ───────────────────────────────────────────────────
function AgonAdren({ onSimulate }: { onSimulate: (id: string) => void }) {
  const items = [
    { drugId: 'epinefrina', name: 'Epinefrina (Adrenalina)', rec: 'α1, α2, β1, β2', sub: 'Catecolamina endógena não seletiva',
      mec: 'Agonista direto de todos os receptores adrenérgicos.',
      uso: 'PCR, choque anafilático (antagonista fisiológico da histamina), prolongação de anestesia local (vasoconstrição).',
      ec: 'Hipertensão arterial, taquicardia, necrose de extremidades (não usar em nariz, dedos — vasoconstrição isquêmica).', color: '#e67e22' },
    { drugId: 'norepinefrina', name: 'Norepinefrina (Noradrenalina)', rec: 'α1, α2, β1', sub: 'Catecolamina endógena α/β1',
      mec: 'Agonista α1, α2 e β1; sem ação β2 significativa.',
      uso: 'Choque séptico (↑ PA, ↓ vasodilatação) e cardiogênico (menor risco de arritmias). Contraindicada no choque anafilático (sem β2).',
      ec: 'Hipertensão sistólica e diastólica, necrose de pele e mucosas, bradicardia reflexa (compensada pelo β1).', color: '#e67e22' },
    { drugId: 'dopamina', name: 'Dopamina', rec: 'D1–D5, β1, α1', sub: 'Catecolamina dose-dependente',
      mec: 'D1/D2 em baixas doses (vasodilatação renal); β1 em doses médias; α1 em altas doses (vasoconstrição).',
      uso: 'Choque, insuficiência cardíaca, hipotensão refratária.',
      ec: 'Náusea, vômitos, taquicardia, angina, hipertensão.', color: '#e67e22' },
    { drugId: 'dobutamina', name: 'Dobutamina', rec: 'β1 (seletivo)', sub: 'Agonista β1 sintético',
      mec: 'Agonista seletivo β1; inotrópico positivo com menor cronotropismo.',
      uso: 'Choque cardiogênico, insuficiência cardíaca congestiva (última escolha para ↑ débito cardíaco).',
      ec: 'Agitação, taquicardia, tremores, hiperglicemia, hipopotassemia.', color: '#e67e22' },
    { drugId: 'isoproterenol', name: 'Isoproterenol (Isoprelanila)', rec: 'β1, β2', sub: 'Agonista β não seletivo',
      mec: 'Agonista β1 + β2, sem ação α.',
      uso: 'Bradicardia, bloqueio de ramo, arritmias. Contraindicado na asma (apesar de broncodilatação, causa isquemia cardíaca) e na IC aguda.',
      ec: 'Taquicardia, agitação, nervosismo, hiperglicemia, hipopotassemia, hipotensão periférica.', color: '#e67e22' },
    { drugId: 'salbutamol', name: 'Salbutamol (Albuterol / Aerolin)', rec: 'β2 (seletivo)', sub: 'Agonista β2 — curta ação (4–6h)',
      mec: 'Agonista β2 seletivo; início de ação: 5–8 min.',
      uso: 'Broncoespasmo, asma (broncodilatação), tocolítico (parto prematuro).',
      ec: 'Taquicardia (receptores β2 no coração), tremor, hipocalemia (influxo K⁺ muscular), hiperglicemia.', color: '#e67e22' },
    { name: 'Salmeterol', rec: 'β2 (seletivo)', sub: 'Agonista β2 — longa ação (>12h)',
      mec: 'Broncodilatador de longa duração.',
      uso: 'Manutenção da asma e DPOC.', ec: 'Semelhante ao salbutamol, porém menos pronunciados.', color: '#e67e22' },
    { drugId: 'fenilefrina', name: 'Fenilefrina', rec: 'α1 (seletivo)', sub: 'Agonista α1 sintético',
      mec: 'Vasoconstritor; midriático que não causa cicloplegia.',
      uso: 'Descongestionante nasal, taquicardia supraventricular, midríase, priapismo (vasoconstrição).',
      ec: 'Bradicardia reflexa, hipertensão, anosmia (uso nasal prolongado).', color: '#e67e22' },
    { drugId: 'clonidina', name: 'Clonidina', rec: 'α2 (central)', sub: 'Agonista α2 — anti-hipertensivo central',
      mec: 'Estimula α2 central → ↓ tônus simpático → ↓ PA.',
      uso: 'Hipertensão arterial, pré-anestésico, analgésico.',
      ec: 'Sedação, boca seca, hipotensão ortostática, tontura, disfunção sexual.', color: '#e67e22' },
    { name: 'Efedrina', rec: 'α, β e SNC', sub: 'Agonista misto (direta + indireta)',
      mec: 'Ação direta em α e β + libera NE e inibe sua recaptação.',
      uso: 'Broncodilatação (asma), descongestionante nasal.',
      ec: 'Hipertensão, taquicardia, IAM, midríase, insônia, ansiedade.', color: '#e67e22' },
    { name: 'Mirabegron', rec: 'β3 (seletivo)', sub: 'Agonista β3',
      mec: 'Relaxa o M. detrusor da bexiga via β3.',
      uso: 'Bexiga hiperativa, incontinência urinária.',
      ec: 'Hipertensão, taquicardia.', color: '#e67e22' },
  ];
  return <DrugList items={items} onSimulate={onSimulate} />;
}

// ─── BLOQUEADORES ADRENÉRGICOS ────────────────────────────────────────────────
function BloqAdren({ onSimulate }: { onSimulate: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <SectionTitle>Bloqueadores α-Adrenérgicos</SectionTitle>
      <InfoBox color="#95a5a6">
        Bloqueiam receptores α, favorecendo vasodilatação e ↓ resistência vascular periférica.
        Efeitos adversos comuns: hipotensão ortostática, taquicardia reflexa, congestão nasal, ejaculação retrógrada.
      </InfoBox>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { drugId: undefined, name: 'Fenoxibenzamina', rec: 'α1 + α2', type: 'Não seletivo — IRREVERSÍVEL',
            uso: 'Feocromocitoma (↓ PA por inibição da vasoconstrição).',
            ec: 'Taquicardia reflexa, hipotensão postural, congestão nasal.' },
          { drugId: 'fentolamina', name: 'Fentolamina', rec: 'α1 + α2', type: 'Não seletivo — REVERSÍVEL',
            uso: 'Feocromocitoma, disfunção erétil.',
            ec: 'Compartilha com fenoxibenzamina.' },
          { drugId: 'prazosina', name: 'Prazosina', rec: 'α1 (todos subtipos)', type: 'α1 seletivo',
            uso: 'HAS, Hiperplasia Prostática Benigna (HPB).',
            ec: 'Síncope na 1ª dose, taquicardia reflexa, hipotensão ortostática.' },
          { drugId: undefined, name: 'Terazosina', rec: 'α1', type: 'α1 seletivo',
            uso: 'HPB + HAS. Não urosseletiva.',
            ec: 'Semelhante à prazosina.' },
          { drugId: undefined, name: 'Doxazosina', rec: 'α1', type: 'α1 seletivo (análogo da prazosina)',
            uso: 'HPB + HAS.',
            ec: 'Semelhante à prazosina.' },
          { drugId: undefined, name: 'Tansulosina', rec: 'α1A (próstata)', type: 'α1A seletivo — urosseletivo',
            uso: 'HPB. Menos efeitos cardiovasculares.', ec: '—' },
          { drugId: undefined, name: 'Silodosina', rec: 'α1A (próstata)', type: 'α1A seletivo — urosseletivo',
            uso: 'HPB. Menos efeitos cardiovasculares que a tansulosina.', ec: '—' },
        ].map(({ drugId, name, rec, type, uso, ec }) => (
          <div key={name} style={{ background: '#111c2b', border: '1px solid #95a5a644', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ color: '#95a5a6', fontWeight: 700, fontSize: 13 }}>{name}</div>
            <div style={{ color: '#6b7280', fontSize: 11, margin: '2px 0 6px' }}>{type} · {rec}</div>
            <p style={{ margin: '0 0 2px', fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}>
              <strong style={{ color: '#2ecc71' }}>Uso:</strong> {uso}
            </p>
            <p style={{ margin: ec === '—' ? 0 : '0 0 8px', fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}>
              <strong style={{ color: '#e74c3c' }}>Efeitos colaterais:</strong> {ec}
            </p>
            {drugId && (
              <button onClick={() => onSimulate(drugId)} style={{ marginTop: 6, background: '#95a5a618', border: '1px solid #95a5a644', borderRadius: 5, padding: '4px 10px', color: '#95a5a6', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                Ver no boneco
              </button>
            )}
          </div>
        ))}
      </div>
      <Mnemonic color="#95a5a6" title="Mnemônico — α1 seletivos">
        <p style={{ margin: 0, fontSize: 13, color: '#c9d1d9', letterSpacing: '0.05em' }}>
          <strong>Pra</strong>zosina · <strong>Tera</strong>zosina · <strong>Doxa</strong>zosina · <strong>Al</strong>fuzosina · <strong>Tan</strong>sulosina · <strong>Silo</strong>dosina
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6b7280' }}>→ PraTeraDoxa AlTanSilo</p>
      </Mnemonic>

      <SectionTitle>Bloqueadores β-Adrenérgicos (Beta-bloqueadores)</SectionTitle>
      <InfoBox color="#95a5a6">
        Usos: HAS, insuficiência cardíaca, angina pectoris, arritmias, glaucoma, enxaqueca (propranolol), tremores, ansiedade somática.<br/>
        Contraindicações: asma / DPOC (broncoconstrição), síndrome de Raynaud, diabetes (mascara hipoglicemia, retarda recuperação), bloqueio AV de 2º/3º grau.<br/>
        ASI = <em>Atividade Simpaticomimética Intrínseca</em>: agonismo parcial → menor bradicardia em repouso.
      </InfoBox>

      {[
        {
          gen: '1ª Geração — β não seletivos (β1 + β2)', color: '#95a5a6',
          drugs: [
            { drugId: 'propranolol', name: 'Propranolol', detail: 'Protótipo. Lipofílico, atravessa BHE → trata enxaqueca, tremores, ansiedade. Efeito estabilizador de membrana. Sem ASI.' },
            { name: 'Pindolol', detail: 'Possui ASI em β2. Mantém estímulo basal → menos bradicardia e débito cardíaco não reduzido em repouso.' },
            { name: 'Nadolol', detail: 'Anti-hipertensivo, baixa lipossolubilidade, excreção renal. HAS + angina pectoris. Profilaxia da hemorragia varicosa esofágica (com propranolol).' },
            { name: 'Timolol', detail: 'Hipotensor ocular (glaucoma de ângulo aberto). Também usado na HAS e ICC.' },
          ],
        },
        {
          gen: '2ª Geração — β1 seletivos / Cardioseletivos', color: '#3498db',
          drugs: [
            { drugId: 'atenolol', name: 'Atenolol', detail: 'Protótipo dos cardioseletivos. Sem ASI. HAS, doença coronariana, arritmias, angina, pós-infarto.' },
            { drugId: 'metoprolol', name: 'Metoprolol', detail: 'Sem ASI. HAS, taquicardia, ICC crônica, angina, pós-infarto.' },
            { name: 'Esmolol', detail: 'Início rápido, curta duração. Emergências: controle de arritmias e HAS pós-operatória grave.' },
            { name: 'Acebutolol', detail: 'Possui ASI. HAS, arritmias, infarto agudo do miocárdio.' },
            { name: 'Bisoprolol', detail: 'Altamente seletivo β1. HAS + ICC moderada a grave. Metabolismo renal e hepático.' },
          ],
        },
        {
          gen: '3ª Geração β não seletivos — com ações adicionais', color: '#e67e22',
          drugs: [
            { drugId: 'labetalol', name: 'Labetalol', detail: 'Bloqueia α1 + β1 + β2 (ASI β2). Vasodilatação + ↓ broncoconstrição. HAS leve a moderada, HAS do parto, emergências hipertensivas. Não usar em asmáticos.' },
            { name: 'Carvedilol', detail: 'Bloqueia α1 + β (sem ASI). Antioxidante. ICC crônica (↓ mortalidade). Efeitos colaterais: broncoconstrição, bradicardia, hipoglicemia.' },
            { name: 'Bucindolol', detail: 'Fraca ação α1 + ASI em β1. Menor bradicardia. ICC.' },
            { name: 'Carteolol', detail: 'ASI em β2. Hipotensor ocular, produz óxido nítrico.' },
          ],
        },
        {
          gen: '3ª Geração β1 seletivos — com ações adicionais', color: '#2ecc71',
          drugs: [
            { name: 'Betaxolol', detail: 'Sem ASI, bloqueia Ca²⁺. Glaucoma de ângulo aberto, HAS, angina. Mais seguro em asmáticos (cardioseletivo).' },
            { name: 'Celiprolol', detail: 'ASI em β2 → broncodilatação. Vasodilatação via óxido nítrico. Antiarrítmico, HAS, angina.' },
            { name: 'Nebivolol', detail: 'Vasodilatação via óxido nítrico. Antioxidante. HAS, proteção cardíaca pós-falência ventricular.' },
          ],
        },
      ].map(({ gen, color, drugs }) => (
        <div key={gen} style={{ background: '#111c2b', border: `1px solid ${color}33`, borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ color, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>{gen}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {drugs.map(({ name, detail, drugId }: { name: string; detail: string; drugId?: string }) => (
              <div key={name} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120, flexShrink: 0 }}>
                  <span style={{ color, fontWeight: 700, fontSize: 12 }}>{name}</span>
                  {drugId && (
                    <button onClick={() => onSimulate(drugId)} style={{ background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 4, padding: '2px 6px', color, fontSize: 10, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Ver no boneco
                    </button>
                  )}
                </div>
                <span style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.6, flex: 1 }}>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── AGONISTAS COLINÉRGICOS ───────────────────────────────────────────────────
function AgonColin({ onSimulate }: { onSimulate: (id: string) => void }) {
  const items = [
    { name: 'Acetilcolina (ACh)', rec: 'M1–M5, Nm, Nn', sub: 'Agonista endógeno — ação direta',
      mec: 'Neurotransmissor colinérgico endógeno. Não utilizada clinicamente — rapidamente degradada pelas enzimas plasmáticas.',
      uso: 'Uso experimental e diagnóstico.', ec: 'Síndrome colinérgica completa (SLUDGE + bradicardia + broncoconstrição).', color: '#27ae60', bhe: '—' },
    { drugId: 'betanecol', name: 'Betanecol', rec: 'M1, M2, M3', sub: 'Éster de colina — ação direta',
      mec: 'Agonista muscarínico, especialmente M3. Estimula peristalse TGI e contração detrusor.',
      uso: 'Atonia intestinal (íleo paralítico pós-operatório), retenção urinária. Não atravessa BHE.',
      ec: 'Diarreia, cólicas, náuseas.', color: '#27ae60', bhe: 'Não atravessa BHE' },
    { drugId: 'carbacol', name: 'Carbacol', rec: 'M + N', sub: 'Éster de colina — resistente à AChE',
      mec: 'Resistente à acetilcolinesterase. Pode estimular receptores nicotínicos.',
      uso: 'Glaucoma (reduz PIO + miose), cirurgia de catarata, esvaziamento vesical. Não atravessa BHE.',
      ec: 'Bradicardia, hipotensão, sudorese, sialorreia.', color: '#27ae60', bhe: 'Não atravessa BHE' },
    { drugId: 'pilocarpina', name: 'Pilocarpina', rec: 'M1, M2, M3', sub: 'Alcaloide natural — ação direta',
      mec: 'Agonista muscarínico. Contrai M. ciliar → drenagem humor aquoso. Amina terciária.',
      uso: 'Glaucoma (↓ pressão intraocular), xerostomia (boca seca), síndrome de Sjögren.',
      ec: 'Náuseas, sudorese, vômitos, diarreia, broncoconstrição, incontinência urinária.', color: '#27ae60', bhe: 'Atravessa BHE' },
    { name: 'Muscarina', rec: 'M1–M5', sub: 'Alcaloide natural — ação direta',
      mec: 'Agonista muscarínico. Imita a síndrome colinérgica. Única amina quaternária que atravessa BHE.',
      uso: 'Sem uso clínico — presente em cogumelos venenosos.', ec: 'Síndrome colinérgica completa.', color: '#27ae60', bhe: 'Atravessa BHE (único amônio quaternário)' },
    { drugId: 'neostigmina', name: 'Neostigmina', rec: 'AChE (indireto)', sub: 'Anticolinesterásico — carbamato reversível',
      mec: 'Inibe AChE reversivelmente → ↑ ACh. Não atravessa BHE.',
      uso: 'Reversão de bloqueio neuromuscular (anestesias), miastenia gravis.',
      ec: 'SLUDGE, broncoespasmo, bradicardia.', color: '#27ae60', bhe: 'Não atravessa BHE' },
    { drugId: 'fisostigmina', name: 'Fisostigmina (Eserina)', rec: 'AChE (indireto)', sub: 'Anticolinesterásico — carbamato reversível',
      mec: 'Inibe AChE reversivelmente. Atravessa BHE — efeitos centrais.',
      uso: 'Intoxicação por atropina (antídoto), glaucoma.',
      ec: 'SLUDGE + efeitos centrais (convulsão em overdose).', color: '#27ae60', bhe: 'Atravessa BHE' },
    { name: 'Edrofônio', rec: 'AChE (indireto)', sub: 'Anticolinesterásico reversível — curta duração',
      mec: 'Inibe AChE por 2–10 minutos. Não atravessa BHE.',
      uso: 'Diagnóstico de miastenia gravis (teste do edrofônio).',
      ec: 'Bradicardia transitória, fasciculações.', color: '#27ae60', bhe: 'Não atravessa BHE' },
    { name: 'Piridostigmina', rec: 'AChE (indireto)', sub: 'Anticolinesterásico — carbamato reversível',
      mec: 'Inibe AChE. Não atravessa BHE.',
      uso: 'Miastenia gravis (tratamento de longo prazo).',
      ec: 'SLUDGE (menos intenso que neostigmina).', color: '#27ae60', bhe: 'Não atravessa BHE' },
    { name: 'Rivastigmina', rec: 'AChE (indireto)', sub: 'Anticolinesterásico — Alzheimer',
      mec: 'Inibe AChE e BuChE. Atravessa BHE.',
      uso: 'Doença de Alzheimer (↑ ACh no SNC → melhora cognitiva).',
      ec: 'Náuseas, vômitos, diarreia.', color: '#27ae60', bhe: 'Atravessa BHE' },
    { name: 'Donepezil', rec: 'AChE (indireto)', sub: 'Anticolinesterásico — Alzheimer',
      mec: 'Inibe AChE seletivamente no SNC. Atravessa BHE.',
      uso: 'Doença de Alzheimer.', ec: 'Náuseas, diarreia, insônia.', color: '#27ae60', bhe: 'Atravessa BHE' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <InfoBox color="#27ae60">
        Agonistas colinérgicos de <strong>ação direta</strong>: ativam receptores M e/ou N. Ação <strong>indireta</strong>: inibem a AChE → ↑ ACh disponível.
        Aminas <strong>quaternárias</strong> geralmente não atravessam BHE (exceção: muscarina). Aminas <strong>terciárias</strong> atravessam BHE.
      </InfoBox>
      {items.map(drug => (
        <div key={drug.name} style={{ background: '#111c2b', border: `1px solid ${drug.color}33`, borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
            <div>
              <span style={{ color: drug.color, fontWeight: 700, fontSize: 14 }}>{drug.name}</span>
              <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>{drug.sub}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Pill color={drug.color}>{drug.rec}</Pill>
              <Pill color={(drug.bhe ?? '').startsWith('Não') ? '#e74c3c' : (drug.bhe ?? '') === '—' ? '#6b7280' : '#2ecc71'}>
                {drug.bhe ?? '—'}
              </Pill>
            </div>
          </div>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}><strong style={{ color: '#c9d1d9' }}>Mecanismo:</strong> {drug.mec}</p>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}><strong style={{ color: '#2ecc71' }}>Uso clínico:</strong> {drug.uso}</p>
          <p style={{ margin: (drug as any).drugId ? '0 0 10px' : 0, fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}><strong style={{ color: '#e74c3c' }}>Efeitos colaterais:</strong> {drug.ec}</p>
          {(drug as any).drugId && (
            <button onClick={() => onSimulate((drug as any).drugId)} style={{ background: '#27ae6018', border: '1px solid #27ae6044', borderRadius: 5, padding: '5px 12px', color: '#27ae60', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              Ver no boneco
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── BLOQUEADORES COLINÉRGICOS ────────────────────────────────────────────────
function BloqColin({ onSimulate }: { onSimulate: (id: string) => void }) {
  const items = [
    { drugId: 'atropina', name: 'Atropina', rec: 'M1, M2, M3', sub: 'Alcaloide natural — antagonista direto',
      mec: 'Antagonismo competitivo em todos os receptores muscarínicos. Atravessa BHE.',
      uso: 'Bradicardia sinusal, midríase (diagnóstico), antídoto da crise colinérgica (organofosforados, aldicarb).',
      ec: 'Taquicardia, boca seca (xerostomia), retenção urinária, constipação, midríase, hipertermia (↓ sudorese), agitação (SNC).', color: '#8e44ad', bhe: 'Atravessa BHE' },
    { drugId: 'escopolamina', name: 'Escopolamina (Hioscina)', rec: 'M1, M2, M3', sub: 'Alcaloide — efeito sedativo central',
      mec: 'Antagonista muscarínico. Atravessa BHE → amnesia e sedação. Buscopan = hioscina levogiro.',
      uso: 'Cinetose (náuseas/vômitos — M1), dismenorreia, cólicas abdominais (↓ motilidade TGI).',
      ec: 'Sonolência, amnesia, boca seca, visão embaçada, retenção urinária.', color: '#8e44ad', bhe: 'Atravessa BHE' },
    { drugId: 'glicopirrolato', name: 'Glicopirrolato', rec: 'M1, M2, M3', sub: 'Amônio quaternário — sem efeito central',
      mec: 'Antagonista muscarínico. Não atravessa BHE — sem efeitos no SNC.',
      uso: 'Espasmos do TGI, reverter bradicardia (intraoperatória), adjuvante com neostigmina.',
      ec: 'Boca seca, taquicardia, constipação, retenção urinária.', color: '#8e44ad', bhe: 'Não atravessa BHE' },
    { drugId: 'ipratropio', name: 'Ipratrópio', rec: 'M1, M2, M3', sub: 'Amônio quaternário — uso inalatório',
      mec: 'Antagonista M3 local nos brônquios. Pouca absorção sistêmica. Inibe broncorreia e broncoconstrição.',
      uso: 'Asma, bronquite crônica, enfisema, DPOC.',
      ec: 'Boca seca, congestão nasal (mínimos efeitos sistêmicos).', color: '#8e44ad', bhe: 'Não atravessa BHE' },
    { name: 'Tiotrópio', rec: 'M1, M2, M3', sub: 'Amônio quaternário — longa ação',
      mec: 'Broncodilatador de longa ação: 5–6 dias de duração.',
      uso: 'DPOC (manutenção).', ec: 'Boca seca.', color: '#8e44ad', bhe: 'Não atravessa BHE' },
    { name: 'Pirenzepina', rec: 'M1 (seletivo)', sub: 'Amina terciária — antipéptico',
      mec: 'Bloqueia M1 gástrico → inibe liberação de HCl.',
      uso: 'Úlcera péptica, gastrite hiperácida.', ec: 'Boca seca, visão embaçada (menos que atropina).', color: '#8e44ad', bhe: 'Atravessa BHE (em menor grau)' },
    { name: 'Tropicamida', rec: 'M3 (olho)', sub: 'Amina terciária — midriático',
      mec: 'Bloqueia M3 → midríase + cicloplegia (paralisia do M. ciliar). Curta duração.',
      uso: 'Exame de fundo de olho, refração.', ec: 'Midríase, cicloplegia, visão turva temporária.', color: '#8e44ad', bhe: 'Atravessa BHE' },
    { name: 'Ciclopentolato', rec: 'M3 (olho)', sub: 'Amina terciária — midriático',
      mec: 'Semelhante à tropicamida — midríase + cicloplegia.',
      uso: 'Exame de fundo de olho em crianças.', ec: 'Midríase, cicloplegia.', color: '#8e44ad', bhe: 'Atravessa BHE' },
    { name: 'Oxibutinina', rec: 'M1, M3', sub: 'Amina terciária — antiespasmódico',
      mec: 'Antiespasmódico do M. detrusor. Atravessa BHE.',
      uso: 'Bexiga hiperativa, incontinência urinária.', ec: 'Xerostomia, visão embaçada, constipação, confusão mental (BHE).', color: '#8e44ad', bhe: 'Atravessa BHE' },
    { name: 'Tolterodina', rec: 'M2, M3', sub: 'Amina terciária — incontinência',
      mec: 'Antiespasmódico vesical.',
      uso: 'Bexiga hiperativa.', ec: 'Xerostomia, visão embaçada, constipação.', color: '#8e44ad', bhe: 'Atravessa BHE' },
    { name: 'Tróspio', rec: 'M3', sub: 'Amônio quaternário — incontinência segura',
      mec: 'Antiespasmódico vesical. Não atravessa BHE → ideal para pacientes com Alzheimer.',
      uso: 'Bexiga hiperativa em pacientes com declínio cognitivo.',
      ec: 'Xerostomia, visão embaçada, constipação.', color: '#8e44ad', bhe: 'Não atravessa BHE' },
    { name: 'Benztropina', rec: 'M (SNC)', sub: 'Amina terciária — antiparkinsoniano',
      mec: 'Bloqueia receptores muscarínicos no SNC, reduzindo hiperatividade colinérgica na via nigroestriatal.',
      uso: 'Doença de Parkinson (tremor = exacerbação colinérgica por ↓ dopamina).',
      ec: 'Boca seca, constipação, retenção urinária, confusão.', color: '#8e44ad', bhe: 'Atravessa BHE' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <InfoBox color="#8e44ad">
        Bloqueadores colinérgicos (antimuscarínicos) <strong>reduzem efeitos parassimpáticos</strong> e exacerbam efeitos simpáticos.
        Efeitos gerais: taquicardia, broncodilatação, midríase, cicloplegia, ↓ secreções, retenção urinária, ↓ motilidade TGI, sonolência.
        Aminas terciárias atravessam BHE. Aminas quaternárias não atravessam (exceto muscarina).
      </InfoBox>
      {items.map(drug => (
        <div key={drug.name} style={{ background: '#111c2b', border: `1px solid ${drug.color}33`, borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
            <div>
              <span style={{ color: drug.color, fontWeight: 700, fontSize: 14 }}>{drug.name}</span>
              <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>{drug.sub}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Pill color={drug.color}>{drug.rec}</Pill>
              <Pill color={drug.bhe.startsWith('Não') ? '#e74c3c' : '#2ecc71'}>{drug.bhe}</Pill>
            </div>
          </div>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}><strong style={{ color: '#c9d1d9' }}>Mecanismo:</strong> {drug.mec}</p>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}><strong style={{ color: '#2ecc71' }}>Uso clínico:</strong> {drug.uso}</p>
          <p style={{ margin: (drug as any).drugId ? '0 0 10px' : 0, fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}><strong style={{ color: '#e74c3c' }}>Efeitos colaterais:</strong> {drug.ec}</p>
          {(drug as any).drugId && (
            <button onClick={() => onSimulate((drug as any).drugId)} style={{ background: '#8e44ad18', border: '1px solid #8e44ad44', borderRadius: 5, padding: '5px 12px', color: '#8e44ad', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              Ver no boneco
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── INTERAÇÕES ───────────────────────────────────────────────────────────────
function InterSection({ onSimulate }: { onSimulate: (id1: string, id2: string) => void }) {
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
        Interações farmacodinâmicas ocorrem quando dois fármacos alteram mutuamente seus efeitos nos receptores.
        Podem ser <strong>antagônicas</strong>, <strong>sinérgicas</strong> ou causar <strong>reversão de efeito</strong>.
        Toque em <strong>Simular no boneco</strong> para visualizar a interação em tempo real.
      </InfoBox>
      {sorted.map((inter, i) => {
        const s = sevStyle[inter.severity];
        const d1 = drugs.find(d => d.id === inter.drugIds[0]);
        const d2 = drugs.find(d => d.id === inter.drugIds[1]);
        return (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: `${s.border}`, borderRadius: 4, padding: '2px 8px' }}>{s.badge}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: s.color }}>{inter.title}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Pill color={s.color}>{d1?.name ?? inter.drugIds[0]}</Pill>
              <span style={{ color: '#4d6a7a', fontSize: 12 }}>+</span>
              <Pill color={s.color}>{d2?.name ?? inter.drugIds[1]}</Pill>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: '#8b949e', lineHeight: 1.7 }}>{inter.description}</p>
            <button
              onClick={() => onSimulate(inter.drugIds[0], inter.drugIds[1])}
              style={{
                background: `${s.color}18`,
                border: `1px solid ${s.color}66`,
                borderRadius: 6,
                padding: '7px 14px',
                color: s.color,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${s.color}30`)}
              onMouseLeave={e => (e.currentTarget.style.background = `${s.color}18`)}
            >
              Simular no boneco
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── DRUG LIST HELPER ─────────────────────────────────────────────────────────
function DrugList({ items, onSimulate }: {
  items: Array<{ name: string; rec: string; sub: string; mec: string; uso: string; ec: string; color: string; bhe?: string; drugId?: string }>;
  onSimulate?: (id: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map(drug => (
        <div key={drug.name} style={{ background: '#111c2b', border: `1px solid ${drug.color}33`, borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
            <div>
              <span style={{ color: drug.color, fontWeight: 700, fontSize: 14 }}>{drug.name}</span>
              <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>{drug.sub}</span>
            </div>
            <Pill color={drug.color}>{drug.rec}</Pill>
          </div>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}><strong style={{ color: '#c9d1d9' }}>Mecanismo:</strong> {drug.mec}</p>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}><strong style={{ color: '#2ecc71' }}>Uso clínico:</strong> {drug.uso}</p>
          <p style={{ margin: drug.drugId && onSimulate ? '0 0 10px' : 0, fontSize: 12, color: '#8b949e', lineHeight: 1.5 }}><strong style={{ color: '#e74c3c' }}>Efeitos colaterais:</strong> {drug.ec}</p>
          {drug.drugId && onSimulate && (
            <button
              onClick={() => onSimulate(drug.drugId!)}
              style={{ background: `${drug.color}18`, border: `1px solid ${drug.color}44`, borderRadius: 5, padding: '5px 12px', color: drug.color, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
            >
              Ver no boneco
            </button>
          )}
        </div>
      ))}
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

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(127,219,255,0.06)', border: '1px solid #7fdbff22', borderLeft: '3px solid #7fdbff55', borderRadius: 6, padding: '10px 14px', fontSize: 12, color: '#8b949e', lineHeight: 1.7 }}>
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
    <span style={{ fontSize: 11, color, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 12, padding: '2px 8px', whiteSpace: 'nowrap' }}>
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
