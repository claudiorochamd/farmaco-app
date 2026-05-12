import type { BodyVisualState, VitalSigns } from '../types';

interface Props {
  bodyState: BodyVisualState;
  vitals: VitalSigns;
}

export default function Character({ bodyState, vitals }: Props) {
  const beatDuration   = Math.round(60000 / vitals.heartRate);
  const breathDuration = Math.round(60000 / vitals.respiratoryRate);

  // Estados de emergência
  const isTachycardia  = vitals.heartRate  > 150;
  const isBradycardia  = vitals.heartRate  < 40;
  const isHypertension = vitals.systolicBP > 180;
  const isHypoxia      = vitals.spO2       < 90;
  const isFever        = vitals.temperature > 38.4;
  const isHypothermia  = vitals.temperature < 35.0;
  const isEmergency    = isTachycardia || isBradycardia || isHypertension || isHypoxia || isFever;
  const isWarning      = !isEmergency && (vitals.heartRate > 100 || vitals.heartRate < 60 || vitals.temperature > 37.5);

  // Cor do anel de emergência
  const ringAnim = isEmergency ? 'emergencyRing 0.9s ease-in-out infinite'
    : isWarning  ? 'emergencyRingYellow 1.4s ease-in-out infinite'
    : 'none';

  const skinColor  = interpolateColor(bodyState.skinVasodilation);
  const vesselColor = bodyState.skinVasodilation > 0.2
    ? '#e74c3c' : bodyState.skinVasodilation < -0.2 ? '#7f8c8d' : '#c0392b';
  const vesselWidth = Math.max(0.8, 1.5 + bodyState.skinVasodilation * 2.5);

  const pupilR = Math.min(9.2, 2.5 + bodyState.pupilNormalized * 8);
  const irisR  = Math.min(9.5, 4   + bodyState.pupilNormalized * 2);

  const lungFill   = bodyState.bronchialNormalized > 1.1
    ? 'rgba(205,145,145,0.52)' : bodyState.bronchialNormalized < 0.85
    ? 'rgba(85,90,120,0.52)'   : 'rgba(178,112,112,0.48)';
  const lungStroke = bodyState.bronchialNormalized < 0.85 ? '#5d6d7e' : '#c0392b88';

  const beatAmp  = 1 + 0.18 * bodyState.heartRateMultiplier;
  const lungXScale = 0.95 + bodyState.bronchialNormalized * 0.055;
  const lungYScale = 0.93 + bodyState.bronchialNormalized * 0.07;

  const sweatOn  = bodyState.sweating  > 0.2;
  const tearOn   = bodyState.lacrimation > 0.3;
  const salivaOn = bodyState.salivation  > 0.3;
  const tremorOn = bodyState.tremor      > 0.3;
  const tremorDur = `${(0.11 + (1 - bodyState.tremor) * 0.08).toFixed(3)}s`;

  // Glow do coração escala com FC
  const heartGlow = isTachycardia
    ? `drop-shadow(0 0 8px rgba(231,76,60,0.9))`
    : isBradycardia
    ? `drop-shadow(0 0 5px rgba(52,152,219,0.7))`
    : `drop-shadow(0 0 ${3 + bodyState.heartRateMultiplier * 3}px rgba(231,76,60,${0.4 + bodyState.heartRateMultiplier * 0.15}))`;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
      borderRadius: 16, animation: ringAnim,
      padding: 6,
    }}>
      <style>{`
        @keyframes hb {
          0%,100%{ transform:scale(1); filter:${heartGlow}; }
          12%    { transform:scale(${beatAmp}); filter:${heartGlow}; }
          26%    { transform:scale(1.02); }
          40%    { transform:scale(${(beatAmp * 0.82).toFixed(3)}); }
          55%    { transform:scale(1); }
        }
        @keyframes br {
          0%,100%{ transform:scaleX(1) scaleY(1); opacity:.82; }
          50%    { transform:scaleX(${lungXScale.toFixed(3)}) scaleY(${lungYScale.toFixed(3)}); opacity:1; }
        }
        @keyframes sw { 0%{opacity:.85;transform:translateY(0);} 100%{opacity:0;transform:translateY(20px);} }
        @keyframes tf { 0%{opacity:.9;transform:translateY(0);}  100%{opacity:0;transform:translateY(16px);} }
        @keyframes sl { 0%{opacity:.8;transform:translateY(0);}  100%{opacity:0;transform:translateY(10px);} }
        @keyframes tr { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-2.5px);} 75%{transform:translateX(2.5px);} }

        .hg { transform-origin:148px 246px; animation:hb ${beatDuration}ms ease-in-out infinite; }
        .lg { transform-origin:150px 285px; animation:br ${breathDuration}ms ease-in-out infinite; }
        .s1{animation:sw 1.6s ease-in infinite;} .s2{animation:sw 1.6s ease-in .55s infinite;}
        .s3{animation:sw 1.6s ease-in 1.1s infinite;} .s4{animation:sw 1.6s ease-in .28s infinite;}
        .s5{animation:sw 1.6s ease-in .82s infinite;}
        .t1{animation:tf 1.3s ease-in infinite;} .t2{animation:tf 1.3s ease-in .6s infinite;}
        .v1{animation:sl 1.8s ease-in infinite;} .v2{animation:sl 1.8s ease-in .9s infinite;}
        @keyframes tr2 {
          0%,100%{transform:translateX(0) translateY(0);}
          20%{transform:translateX(-${Math.round(bodyState.tremor*5)}px) translateY(1px);}
          40%{transform:translateX(${Math.round(bodyState.tremor*4)}px) translateY(-1px);}
          60%{transform:translateX(-${Math.round(bodyState.tremor*3)}px) translateY(2px);}
          80%{transform:translateX(${Math.round(bodyState.tremor*5)}px) translateY(-2px);}
        }
        .hl{animation:${tremorOn?`tr2 ${tremorDur} linear infinite`:'none'};}
        .hr{animation:${tremorOn?`tr2 ${tremorDur} linear infinite`:'none'};animation-delay:.045s;}
        .s6{animation:sw 2.1s ease-in .35s infinite;}
        .s7{animation:sw 1.8s ease-in .7s infinite;}
      `}</style>

      <svg viewBox="0 0 300 582" style={{ width: '100%', maxWidth: 255, height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id="ss" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.28)"/>
            <stop offset="28%"  stopColor="rgba(0,0,0,0)"/>
            <stop offset="72%"  stopColor="rgba(0,0,0,0)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.32)"/>
          </linearGradient>
          <radialGradient id="tl" cx="42%" cy="18%" r="58%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.22)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <radialGradient id="hg2" cx="38%" cy="28%" r="72%">
            <stop offset="0%"   stopColor="#ff8484"/>
            <stop offset="100%" stopColor="#9b2335"/>
          </radialGradient>
          <filter id="gl" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="bs" x="-12%" y="-5%" width="124%" height="118%">
            <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="rgba(0,0,0,0.55)"/>
          </filter>
        </defs>

        {/* ── BASE SHADOW ─────────────────────────────── */}
        <g filter="url(#bs)" opacity="0.8">
          <ellipse cx="150" cy="78" rx="52" ry="64" fill={skinColor}/>
          <path d="M 75,163 C 55,170 46,200 46,278 C 46,358 65,415 94,426 L 206,426 C 235,415 254,358 254,278 C 254,200 245,170 225,163 Z" fill={skinColor}/>
        </g>

        {/* ── LEGS ─────────────────────────────────────── */}
        <path d="M 94,424 C 90,462 86,508 82,542 C 80,552 80,560 82,562 L 130,562 C 130,552 130,508 134,464 C 138,440 142,432 142,424 Z" fill={skinColor}/>
        <path d="M 158,424 C 158,432 162,440 166,464 C 170,508 170,552 170,562 L 218,562 C 220,560 220,552 218,542 C 214,508 210,462 206,424 Z" fill={skinColor}/>
        {/* Knee shadow */}
        <ellipse cx="108" cy="482" rx="16" ry="7" fill="rgba(0,0,0,0.06)"/>
        <ellipse cx="192" cy="482" rx="16" ry="7" fill="rgba(0,0,0,0.06)"/>
        {/* Feet */}
        <path d="M 80,562 C 68,562 58,566 56,572 C 54,577 58,580 70,580 L 130,580 C 136,580 138,576 136,571 C 134,565 128,562 126,562 Z" fill={skinColor}/>
        <path d="M 174,562 C 172,562 166,565 164,571 C 162,576 164,580 170,580 L 230,580 C 242,580 246,577 244,572 C 242,566 232,562 220,562 Z" fill={skinColor}/>

        {/* ── ARMS ─────────────────────────────────────── */}
        <path d="M 80,180 C 64,194 52,232 46,270 C 44,282 44,292 48,300 C 42,318 36,340 32,355 C 30,364 30,372 34,376 C 26,378 22,384 25,390 C 28,395 36,396 44,393 C 50,390 52,383 50,377 C 54,375 56,376 56,378" fill={skinColor}/>
        <path d="M 220,180 C 236,194 248,232 254,270 C 256,282 256,292 252,300 C 258,318 264,340 268,355 C 270,364 270,372 266,376 C 274,378 278,384 275,390 C 272,395 264,396 256,393 C 250,390 248,383 250,377 C 246,375 244,376 244,378" fill={skinColor}/>

        {/* ── TORSO ─────────────────────────────────────── */}
        <path d="M 75,163 C 55,170 46,200 46,278 C 46,358 65,415 94,426 L 206,426 C 235,415 254,358 254,278 C 254,200 245,170 225,163 Z" fill={skinColor}/>

        {/* ── NECK ──────────────────────────────────────── */}
        <path d="M 130,140 C 128,149 127,156 126,163 L 174,163 C 173,156 172,149 170,140 Z" fill={skinColor}/>

        {/* ── SIDE SHADING (3-D depth) ──────────────────── */}
        <path d="M 75,163 C 55,170 46,200 46,278 C 46,358 65,415 94,426 L 206,426 C 235,415 254,358 254,278 C 254,200 245,170 225,163 Z" fill="url(#ss)"/>
        <path d="M 130,140 C 128,149 127,156 126,163 L 174,163 C 173,156 172,149 170,140 Z" fill="url(#ss)" opacity="0.6"/>
        {/* Arm edge shading */}
        <path d="M 80,180 C 64,194 52,232 46,270 C 44,282 44,292 48,300 C 42,318 36,340 32,355 C 30,364 30,372 34,376"
              fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="15" strokeLinecap="round"/>
        <path d="M 220,180 C 236,194 248,232 254,270 C 256,282 256,292 252,300 C 258,318 264,340 268,355 C 270,364 270,372 266,376"
              fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="15" strokeLinecap="round"/>
        {/* Leg edge shading */}
        <path d="M 94,424 C 90,462 86,508 82,542 C 80,552 80,560 82,562"
              fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth="18" strokeLinecap="round"/>
        <path d="M 206,424 C 210,462 214,508 218,542 C 220,552 220,560 218,562"
              fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth="18" strokeLinecap="round"/>

        {/* ── TOP HIGHLIGHT ─────────────────────────────── */}
        <path d="M 75,163 C 55,170 46,200 46,278 C 46,358 65,415 94,426 L 206,426 C 235,415 254,358 254,278 C 254,200 245,170 225,163 Z" fill="url(#tl)"/>

        {/* ── CLAVICLES ─────────────────────────────────── */}
        <path d="M 126,163 C 118,159 106,157 97,162" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M 174,163 C 182,159 194,157 203,162" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2.2" strokeLinecap="round"/>

        {/* ── INNER TORSO PANEL ─────────────────────────── */}
        <path d="M 86,188 C 80,198 78,218 80,252 C 82,288 90,320 102,336 C 114,352 132,356 150,356 C 168,356 186,352 198,336 C 210,320 218,288 220,252 C 222,218 220,198 214,188 Z"
              fill="rgba(4,10,22,0.24)" stroke="rgba(100,160,255,0.07)" strokeWidth="1"/>

        {/* ── RIB CAGE ──────────────────────────────────── */}
        {Array.from({ length: 6 }, (_, i) => {
          const y = 208 + i * 22;
          const sp = i * 2;
          return (
            <g key={i} opacity={0.52 - i * 0.04}>
              <path d={`M 148,${y} C ${136 - sp},${y + 5} ${112 - sp},${y + 15} ${100 - sp},${y + 28}`}
                    fill="none" stroke="rgba(215,225,255,0.10)" strokeWidth="1.8" strokeLinecap="round"/>
              <path d={`M 152,${y} C ${164 + sp},${y + 5} ${188 + sp},${y + 15} ${200 + sp},${y + 28}`}
                    fill="none" stroke="rgba(215,225,255,0.10)" strokeWidth="1.8" strokeLinecap="round"/>
            </g>
          );
        })}
        <line x1="150" y1="198" x2="150" y2="344" stroke="rgba(215,225,255,0.07)" strokeWidth="2"/>

        {/* ── BLOOD VESSELS ─────────────────────────────── */}
        <path d="M 148,268 C 148,285 147,308 147,338 C 147,378 147,405 147,426"
              fill="none" stroke={vesselColor} strokeWidth={vesselWidth} opacity="0.65"/>
        <path d="M 89,200 C 75,214 63,250 51,298" fill="none" stroke={vesselColor} strokeWidth={Math.max(0.6, vesselWidth - 0.6)} opacity="0.55"/>
        <path d="M 211,200 C 225,214 237,250 249,298" fill="none" stroke={vesselColor} strokeWidth={Math.max(0.6, vesselWidth - 0.6)} opacity="0.55"/>
        <path d="M 145,162 L 140,138" fill="none" stroke={vesselColor} strokeWidth={Math.max(0.5, vesselWidth - 0.6)} opacity="0.6"/>
        <path d="M 155,162 L 160,138" fill="none" stroke="#2e86c1" strokeWidth={Math.max(0.5, vesselWidth - 0.7)} opacity="0.5"/>
        <path d="M 147,398 C 138,408 124,416 108,424" fill="none" stroke={vesselColor} strokeWidth={Math.max(0.5, vesselWidth - 0.5)} opacity="0.6"/>
        <path d="M 153,398 C 162,408 176,416 192,424" fill="none" stroke={vesselColor} strokeWidth={Math.max(0.5, vesselWidth - 0.5)} opacity="0.6"/>

        {/* ── LUNGS ─────────────────────────────────────── */}
        <g className="lg">
          <path d="M 112,222 C 92,220 82,237 80,259 C 78,281 80,307 90,323 C 98,336 110,340 120,334 C 130,326 134,308 134,283 C 134,259 128,226 112,222 Z"
                fill={lungFill} stroke={lungStroke} strokeWidth="1.3"/>
          <path d="M 96,238 C 88,245 86,259 90,270" fill="none" stroke="rgba(255,200,200,0.28)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 188,222 C 208,220 218,237 220,259 C 222,281 220,307 210,323 C 202,336 190,340 180,334 C 170,326 166,308 166,283 C 166,259 172,226 188,222 Z"
                fill={lungFill} stroke={lungStroke} strokeWidth="1.3"/>
          <path d="M 204,238 C 212,245 214,259 210,270" fill="none" stroke="rgba(255,200,200,0.28)" strokeWidth="2" strokeLinecap="round"/>
          {/* Trachea + bronchi */}
          <line x1="150" y1="196" x2="150" y2="225" stroke="rgba(210,200,190,0.38)" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M 150,225 C 146,234 136,240 120,240" fill="none" stroke="rgba(210,200,190,0.33)" strokeWidth="2.6" strokeLinecap="round"/>
          <path d="M 150,225 C 154,234 164,240 180,240" fill="none" stroke="rgba(210,200,190,0.33)" strokeWidth="2.6" strokeLinecap="round"/>
        </g>

        {/* ── HEART ─────────────────────────────────────── */}
        <g className="hg" filter="url(#gl)">
          <path d="M 148,270 C 148,270 118,253 118,234 C 118,218 130,213 138,218 C 142,221 146,227 148,234 C 150,227 154,221 158,218 C 166,213 178,218 178,234 C 178,253 148,270 148,270 Z"
                fill="url(#hg2)" stroke="#7b241c" strokeWidth="1.3"/>
          <path d="M 153,220 C 155,212 157,206 155,201 C 153,196 148,196 146,201 C 144,206 146,212 148,220"
                fill="none" stroke="#b03030" strokeWidth="3.2"/>
          <path d="M 132,233 C 128,227 126,235 129,241" fill="none" stroke="rgba(255,160,160,0.52)" strokeWidth="1.8" strokeLinecap="round"/>
        </g>

        {/* ── OUTLINES ──────────────────────────────────── */}
        <path d="M 75,163 C 55,170 46,200 46,278 C 46,358 65,415 94,426 L 206,426 C 235,415 254,358 254,278 C 254,200 245,170 225,163 Z"
              fill="none" stroke="rgba(0,0,0,0.32)" strokeWidth="1.5"/>
        <path d="M 80,180 C 64,194 52,232 46,270 C 44,282 44,292 48,300 C 42,318 36,340 32,355 C 30,364 30,372 34,376 C 26,378 22,384 25,390 C 28,395 36,396 44,393 C 50,390 52,383 50,377"
              fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>
        <path d="M 220,180 C 236,194 248,232 254,270 C 256,282 256,292 252,300 C 258,318 264,340 268,355 C 270,364 270,372 266,376 C 274,378 278,384 275,390 C 272,395 264,396 256,393 C 250,390 248,383 250,377"
              fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>
        <path d="M 130,140 C 128,149 127,156 126,163 L 174,163 C 173,156 172,149 170,140"
              fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.3"/>
        <path d="M 94,424 C 90,462 86,508 82,542 C 80,552 80,560 82,562 C 68,562 58,566 56,572 C 54,577 58,580 70,580 L 130,580 C 136,580 138,576 136,571 C 134,565 128,562 126,562 C 130,560 130,552 130,508 C 134,464 138,432 142,424"
              fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>
        <path d="M 158,424 C 162,432 166,464 170,508 C 170,552 170,560 170,562 C 172,562 180,565 184,571 C 186,576 184,580 170,580 L 230,580 C 242,580 246,577 244,572 C 242,566 232,562 220,562 C 220,560 220,552 218,542 C 214,508 210,462 206,424"
              fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>

        {/* ── HEAD ──────────────────────────────────────── */}
        <ellipse cx="150" cy="78" rx="52" ry="64" fill={skinColor}/>
        <ellipse cx="150" cy="78" rx="52" ry="64" fill="url(#ss)"/>
        <ellipse cx="150" cy="78" rx="52" ry="64" fill="url(#tl)"/>
        {/* Ears */}
        <path d="M 99,74 C 93,70 88,74 88,81 C 88,89 93,95 100,93 C 105,91 107,85 105,78" fill={skinColor} stroke="rgba(0,0,0,0.22)" strokeWidth="1.2"/>
        <path d="M 201,74 C 207,70 212,74 212,81 C 212,89 207,95 200,93 C 195,91 193,85 195,78" fill={skinColor} stroke="rgba(0,0,0,0.22)" strokeWidth="1.2"/>
        <ellipse cx="150" cy="78" rx="52" ry="64" fill="none" stroke="rgba(0,0,0,0.32)" strokeWidth="1.5"/>

        {/* Hair — straight, flat top, jet black */}
        {/* Top cap: flat rectangle + rounded top */}
        <path d="M 99,20 L 201,20 L 201,58 C 188,51 170,47 150,47 C 130,47 112,51 99,58 Z" fill="#0a0a0a"/>
        <ellipse cx="150" cy="20" rx="51" ry="7" fill="#0a0a0a"/>
        {/* Side strands falling straight down */}
        <path d="M 99,26 C 97,55 97,85 99,112 C 100,118 101,122 102,126"
              fill="none" stroke="#0a0a0a" strokeWidth="9" strokeLinecap="round"/>
        <path d="M 201,26 C 203,55 203,85 201,112 C 200,118 199,122 198,126"
              fill="none" stroke="#0a0a0a" strokeWidth="9" strokeLinecap="round"/>

        {/* Jaw definition */}
        <path d="M 108,112 C 114,130 132,141 150,143 C 168,141 186,130 192,112" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1.8"/>

        {/* ── FACE ──────────────────────────────────────── */}
        {/* Eye whites */}
        <ellipse cx="122" cy="73" rx="14" ry="10" fill="white" stroke="rgba(0,0,0,0.28)" strokeWidth="1"/>
        <ellipse cx="178" cy="73" rx="14" ry="10" fill="white" stroke="rgba(0,0,0,0.28)" strokeWidth="1"/>
        {/* Irises */}
        <circle cx="122" cy="73" r={irisR}  fill="#2c1a08"/>
        <circle cx="178" cy="73" r={irisR}  fill="#2c1a08"/>
        {/* Pupils */}
        <circle cx="122" cy="73" r={pupilR} fill="#0a0a0a"/>
        <circle cx="178" cy="73" r={pupilR} fill="#0a0a0a"/>
        {/* Highlights */}
        <circle cx="125" cy="70" r="1.9" fill="rgba(255,255,255,0.88)"/>
        <circle cx="181" cy="70" r="1.9" fill="rgba(255,255,255,0.88)"/>
        {/* Upper eyelid */}
        <path d="M 108,73 C 112,64 132,64 136,73" fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="1.3"/>
        <path d="M 164,73 C 168,64 188,64 192,73" fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="1.3"/>
        {/* Lower eyelid / under-eye */}
        <path d="M 108,73 C 112,79 132,80 136,73" fill={skinColor} stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" opacity="0.75"/>
        <path d="M 164,73 C 168,79 188,80 192,73" fill={skinColor} stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" opacity="0.75"/>
        {/* Eyebrows */}
        <path d="M 108,59 C 115,52 130,51 136,56" fill="none" stroke="#0a0a0a" strokeWidth="2.8" strokeLinecap="round"/>
        <path d="M 164,56 C 170,51 185,52 192,59" fill="none" stroke="#0a0a0a" strokeWidth="2.8" strokeLinecap="round"/>
        {/* Nose */}
        <path d="M 150,85 C 146,91 144,97 147,102 C 150,105 153,102 156,97 C 158,91 150,85 150,85" fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth="1.4"/>
        <path d="M 146,101 C 143,103 143,106 146,107 M 154,107 C 157,106 157,103 154,101" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" strokeLinecap="round"/>
        {/* Lips */}
        <path d="M 138,113 C 142,117 148,119 150,119 C 152,119 158,117 162,113" fill="none" stroke="rgba(150,70,70,0.65)" strokeWidth="1.8" strokeLinecap="round"/>

        {/* ── OVERLAYS DE EMERGÊNCIA ────────────────────── */}
        {isHypoxia && (
          <rect x="0" y="0" width="300" height="582"
            fill={`rgba(41,128,185,${Math.min(0.38,(90-vitals.spO2)/18)})`}
            style={{ pointerEvents:'none', transition:'fill 1s ease' }}/>
        )}
        {isFever && (
          <rect x="0" y="0" width="300" height="582"
            fill={`rgba(192,57,43,${Math.min(0.30,(vitals.temperature-38.4)/2.5)})`}
            style={{ pointerEvents:'none', transition:'fill 1s ease' }}/>
        )}
        {isHypothermia && (
          <rect x="0" y="0" width="300" height="582"
            fill={`rgba(52,152,219,${Math.min(0.28,(35-vitals.temperature)/2)})`}
            style={{ pointerEvents:'none', transition:'fill 1s ease' }}/>
        )}

        {/* ── SWEAT ─────────────────────────────────────── */}
        {sweatOn && <>
          <ellipse className="s1" cx="93"  cy="185" rx="2.4" ry="3.8" fill="#b3e5fc" opacity="0.85"/>
          <ellipse className="s2" cx="75"  cy="242" rx="2"   ry="3.4" fill="#b3e5fc" opacity="0.80"/>
          <ellipse className="s3" cx="207" cy="188" rx="2.4" ry="3.8" fill="#b3e5fc" opacity="0.85"/>
          <ellipse className="s4" cx="227" cy="246" rx="2"   ry="3.4" fill="#b3e5fc" opacity="0.80"/>
          <ellipse className="s5" cx="163" cy="83"  rx="1.9" ry="3"   fill="#b3e5fc" opacity="0.75"/>
          {bodyState.sweating > 0.6 && <>
            <ellipse className="s6" cx="108" cy="310" rx="2" ry="3.2" fill="#b3e5fc" opacity="0.75"/>
            <ellipse className="s7" cx="192" cy="315" rx="2" ry="3.2" fill="#b3e5fc" opacity="0.75"/>
          </>}
        </>}

        {/* ── TEARS ─────────────────────────────────────── */}
        {tearOn && <>
          <ellipse className="t1" cx="122" cy="86" rx="2.2" ry="3.2" fill="#90caf9" opacity="0.9"/>
          <ellipse className="t2" cx="178" cy="86" rx="2.2" ry="3.2" fill="#90caf9" opacity="0.9"/>
        </>}

        {/* ── SALIVA ────────────────────────────────────── */}
        {salivaOn && <>
          <ellipse className="v1" cx="145" cy="124" rx="1.8" ry="2.8" fill="#b2ebf2" opacity="0.85"/>
          <ellipse className="v2" cx="155" cy="124" rx="1.8" ry="2.8" fill="#b2ebf2" opacity="0.85"/>
        </>}

        {/* ── BRONCHIAL LABEL ───────────────────────────── */}
        {bodyState.bronchialNormalized < 0.72 && (
          <g>
            <rect x="86" y="344" width="128" height="18" rx="4" fill="rgba(231,76,60,0.18)" stroke="#e74c3c55" strokeWidth="1"/>
            <text x="150" y="357" textAnchor="middle" fontSize="11" fill="#e74c3c" fontWeight="bold">Broncoespasmo</text>
          </g>
        )}
        {bodyState.bronchialNormalized > 1.42 && (
          <g>
            <rect x="86" y="344" width="128" height="18" rx="4" fill="rgba(46,204,113,0.12)" stroke="#2ecc7155" strokeWidth="1"/>
            <text x="150" y="357" textAnchor="middle" fontSize="11" fill="#2ecc71" fontWeight="bold">Broncodilatação</text>
          </g>
        )}

        {/* Hands (tremorizing) */}
        <g className="hl">
          <path d="M 32,376 C 26,378 22,384 25,390 C 28,395 36,396 44,393 C 50,390 52,383 50,377 Z" fill={skinColor} stroke="rgba(0,0,0,0.28)" strokeWidth="1.2"/>
        </g>
        <g className="hr">
          <path d="M 268,376 C 274,378 278,384 275,390 C 272,395 264,396 256,393 C 250,390 248,383 250,377 Z" fill={skinColor} stroke="rgba(0,0,0,0.28)" strokeWidth="1.2"/>
        </g>
      </svg>

      {/* Status row */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 4 }}>
        {/* Temperatura */}
        <div style={{ fontSize: 11, color: '#8b949e', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>Temp:</span>
          <span style={{
            fontWeight: 'bold', fontFamily: 'monospace',
            color: isFever ? '#e74c3c' : isHypothermia ? '#3498db' : vitals.temperature > 37.5 ? '#f39c12' : '#2ecc71',
          }}>
            {vitals.temperature.toFixed(1)}°C
          </span>
          {isFever        && <span style={{ color: '#e74c3c', fontSize: 10 }}>FEBRE</span>}
          {isHypothermia  && <span style={{ color: '#3498db', fontSize: 10 }}>HIPOTERMIA</span>}
        </div>

        {/* Pupilas */}
        <div style={{ fontSize: 11, color: '#8b949e' }}>
          Pupilas:{' '}
          <span style={{
            fontWeight: 'bold',
            color: bodyState.pupilNormalized < 0.3 ? '#3498db'
                 : bodyState.pupilNormalized > 0.7 ? '#e74c3c'
                 : '#2ecc71',
          }}>
            {bodyState.pupilNormalized < 0.3 ? 'Miose' : bodyState.pupilNormalized > 0.7 ? 'Midríase' : 'Normal'}
          </span>
        </div>
      </div>
    </div>
  );
}

function interpolateColor(v: number): string {
  // Base dark skin: rgb(88, 52, 24)
  if (v > 0) {
    // vasodilation: warmer red-brown tone
    return `rgb(${Math.round(88 + 28 * v)},${Math.round(52 - 8 * v)},${Math.round(24 - 4 * v)})`;
  }
  const t = -v;
  // vasoconstriction: slightly cooler/ashen
  return `rgb(${Math.round(88 - 22 * t)},${Math.round(52 - 4 * t)},${Math.round(24 + 12 * t)})`;
}
