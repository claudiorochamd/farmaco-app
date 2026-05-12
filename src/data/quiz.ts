export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const SCENARIO_QUIZZES: Record<string, QuizQuestion[]> = {
  anafilaxia: [
    {
      question: 'Por que a epinefrina é o fármaco de escolha no choque anafilático?',
      options: [
        'Porque bloqueia diretamente os receptores H1 da histamina',
        'Porque age como antagonista fisiológico da histamina via β2 (broncodilatação) e α1 (vasoconstrição)',
        'Porque inibe a degranulação dos mastócitos antes da liberação de histamina',
        'Porque possui ação exclusivamente broncodilatadora',
      ],
      correctIndex: 1,
      explanation:
        'A epinefrina não bloqueia a histamina — ela antagoniza seus efeitos por ação oposta nos mesmos órgãos: β2 reverte o broncoespasmo e α1 reverte a vasodilatação, restaurando a PA. Por isso é chamada de antagonista fisiológico.',
    },
    {
      question: 'Qual receptor da epinefrina é responsável pela broncodilatação no choque anafilático?',
      options: ['α1', 'α2', 'β1', 'β2'],
      correctIndex: 3,
      explanation:
        'Os receptores β2 estão presentes no músculo liso brônquico. Sua ativação eleva o AMPc intracelular → relaxamento da musculatura brônquica → broncodilatação.',
    },
    {
      question: 'Por que a norepinefrina é contraindicada no choque anafilático?',
      options: [
        'Causa taquicardia excessiva pelo β1',
        'Não possui ação β2 significativa para reverter o broncoespasmo',
        'Possui efeito antihistamínico inverso',
        'É rapidamente degradada pela MAO antes de agir',
      ],
      correctIndex: 1,
      explanation:
        'A norepinefrina tem ação predominante em α1 e β1, com efeito β2 desprezível. Portanto, não reverte o broncoespasmo — componente crítico do choque anafilático. A epinefrina é superior justamente pela combinação α1 + β1 + β2.',
    },
  ],

  bradicardia: [
    {
      question: 'Qual receptor a atropina bloqueia para aumentar a frequência cardíaca?',
      options: ['β1 cardíaco', 'α1 vascular', 'M2 no nó SA e AV', 'Nn ganglionar'],
      correctIndex: 2,
      explanation:
        'O receptor M2 é o receptor muscarínico cardíaco. Sua ativação pela acetilcolina (tônus vagal) reduz a FC. A atropina o bloqueia → remove o "freio vagal" → FC aumenta. Esse efeito é chamado de cronotropismo positivo indireto.',
    },
    {
      question: 'Além de aumentar a FC, quais outros efeitos colaterais a atropina causa pelo bloqueio de receptores M3?',
      options: [
        'Miose e broncoconstrição',
        'Boca seca, retenção urinária e midríase',
        'Bradicardia reflexa e hipotensão',
        'Sialorreia e lacrimejamento',
      ],
      correctIndex: 1,
      explanation:
        'M3 é o receptor das glândulas exócrinas, músculo detrusor da bexiga e músculo constritor da pupila. Bloqueando M3: secreções diminuem (boca seca), detrusor relaxa (retenção urinária) e a pupila dilata (midríase).',
    },
    {
      question: 'Em qual situação a atropina não é indicada para bradicardia?',
      options: [
        'Bradicardia sinusal por tônus vagal excessivo',
        'Bradicardia por intoxicação colinérgica',
        'Bloqueio AV de segundo grau tipo Mobitz II ou bloqueio AV total',
        'Bradicardia assintomática em atletas',
      ],
      correctIndex: 2,
      explanation:
        'No bloqueio AV infranodal (Mobitz II e BAVT), a atropina pode paradoxalmente piorar a bradicardia ao aumentar a taxa sinusal sem conseguir conduzir através do bloqueio. Nesses casos, é preferível o marca-passo ou isoproterenol.',
    },
  ],

  hipertensao: [
    {
      question: 'Por que o labetalol é vantajoso na crise hipertensiva comparado ao propranolol isolado?',
      options: [
        'Porque tem início de ação mais rápido que qualquer outro anti-hipertensivo',
        'Porque bloqueia α1 e β simultaneamente — reduz PA sem causar taquicardia reflexa',
        'Porque é o único beta-bloqueador que atravessa a barreira hematoencefálica',
        'Porque possui atividade simpaticomimética intrínseca que protege o coração',
      ],
      correctIndex: 1,
      explanation:
        'O propranolol isolado bloqueia β sem bloquear α1 — a vasoconstrição α1 periférica persiste ou piora. O labetalol bloqueia ambos: α1 → vasodilatação (↓PA) e β → ↓FC e ↓débito, sem a taquicardia reflexa que vem com vasodilatadores puros.',
    },
    {
      question: 'Por que beta-bloqueadores isolados não são a primeira escolha em emergências hipertensivas com componente vascular?',
      options: [
        'Porque aumentam a frequência cardíaca paradoxalmente',
        'Porque sem o bloqueio α1, a vasoconstrição periférica pode se intensificar',
        'Porque são contraindicados em qualquer emergência cardiovascular',
        'Porque causam hipoglicemia grave em emergências',
      ],
      correctIndex: 1,
      explanation:
        'Ao bloquear apenas β sem bloquear α1, a noradrenalina endógena fica livre para agir nos receptores α1 vasculares, mantendo ou aumentando a resistência vascular periférica. A PA pode não cair — e em alguns casos até subir.',
    },
    {
      question: 'O labetalol pode causar broncoespasmo. Qual receptor é responsável por isso?',
      options: [
        'α1 brônquico ativado pelo labetalol',
        'M3 brônquico estimulado indiretamente',
        'β2 brônquico bloqueado pelo labetalol, que normalmente mantém os brônquios dilatados',
        'β1 cardíaco que modula reflexamente o tônus brônquico',
      ],
      correctIndex: 2,
      explanation:
        'Os receptores β2 nos brônquios, quando ativados, promovem broncodilatação e são o alvo do salbutamol. O labetalol, por ser não-seletivo para β, também bloqueia esses receptores → broncoconstrição. Por isso é contraindicado em asmáticos.',
    },
  ],

  asma: [
    {
      question: 'O salbutamol é classificado como agonista β2 seletivo. Qual vantagem clínica isso representa?',
      options: [
        'Provoca broncodilatação mais intensa que agonistas não-seletivos',
        'Não causa nenhum efeito cardiovascular em nenhuma dose',
        'Menor risco de taquicardia em comparação a agonistas β não-seletivos como o isoproterenol',
        'Pode ser usado em qualquer paciente sem contraindicações',
      ],
      correctIndex: 2,
      explanation:
        'A seletividade β2 reduz a estimulação β1 cardíaca. Porém, em doses altas ou com superdosagem, ainda ocorre taquicardia — o coração possui receptores β2 também. A diferença é quantitativa, não absoluta.',
    },
    {
      question: 'Além do broncoespasmo, qual alteração eletrolítica o salbutamol pode causar?',
      options: [
        'Hipernatremia por retenção renal',
        'Hipocalemia por entrada de K⁺ no músculo esquelético via β2',
        'Hipercalcemia por mobilização óssea',
        'Hipermagnesemia por inibição da excreção renal',
      ],
      correctIndex: 1,
      explanation:
        'A ativação de β2 no músculo esquelético estimula a Na⁺/K⁺-ATPase → K⁺ entra na célula → hipocalemia. Em altas doses (abuso de salbutamol), isso pode causar fraqueza muscular e arritmias.',
    },
    {
      question: 'Por que o propranolol é absolutamente contraindicado em pacientes asmáticos?',
      options: [
        'Porque causa vasodilatação pulmonar que piora a hipóxia',
        'Porque bloqueia β2 nos brônquios, antagonizando a broncodilatação basal e precipitando broncoespasmo grave',
        'Porque aumenta a produção de muco pelas glândulas brônquicas',
        'Porque reduz a frequência cardíaca a níveis perigosos em asmáticos',
      ],
      correctIndex: 1,
      explanation:
        'O tônus β2 basal nos brônquios mantém a dilatação. O propranolol, ao bloquear β2, remove esse tônus → broncoconstrição. Em asmáticos, isso pode desencadear uma crise grave e fatal. Use β1-seletivos (metoprolol, atenolol) se necessário.',
    },
  ],

  sepse: [
    {
      question: 'Por que a norepinefrina é a droga vasopressora de primeira linha no choque séptico?',
      options: [
        'Porque sua ação β1 aumenta o débito cardíaco, compensando a vasodilatação',
        'Porque sua potente ação α1 reverte a vasodilatação sistêmica e restaura a pressão de perfusão',
        'Porque não causa nenhum efeito adverso em pacientes críticos',
        'Porque sua ação β2 melhora a oxigenação tissular',
      ],
      correctIndex: 1,
      explanation:
        'No choque séptico, a vasodilatação sistêmica por mediadores inflamatórios reduz drasticamente a resistência vascular periférica (RVP). A norepinefrina, via α1, contrai a musculatura lisa vascular, restaurando a RVP e a PA de perfusão de órgãos nobres.',
    },
    {
      question: 'A dopamina pode ser usada no choque séptico, mas a norepinefrina é preferida. Por quê?',
      options: [
        'A dopamina é mais cara e de difícil acesso',
        'A dopamina causa mais arritmias e tem efeito pressor menos previsível que a norepinefrina',
        'A dopamina não possui ação vasopressora em nenhuma dose',
        'A norepinefrina tem efeito β2 protetor que a dopamina não tem',
      ],
      correctIndex: 1,
      explanation:
        'Estudos clínicos mostraram que a dopamina está associada a maior incidência de arritmias atriais no choque séptico. Além disso, seu efeito é dose-dependente e menos previsível. As diretrizes atuais (Surviving Sepsis Campaign) recomendam norepinefrina como primeira escolha.',
    },
    {
      question: 'A norepinefrina em dose elevada pode causar necrose de extremidades. Qual receptor é responsável?',
      options: [
        'β1 — causa isquemia por excesso de demanda cardíaca',
        'α1 — vasoconstrição excessiva nas artérias periféricas → isquemia distal',
        'β2 — vasoconstrição paradoxal nas artérias musculares',
        'M2 — bradicardia que reduz a perfusão distal',
      ],
      correctIndex: 1,
      explanation:
        'A vasoconstrição α1 excessiva pode comprometer a perfusão de extremidades, causando isquemia e necrose. Esse risco é maior em artérias de pequeno calibre (dedos, nariz). Por isso, doses altas de norepinefrina exigem monitoração rigorosa da perfusão periférica.',
    },
  ],

  organofosforado: [
    {
      question: 'O que é a síndrome SLUDGE e qual sistema está hiperestimulado?',
      options: [
        'Síndrome adrenérgica: Sudorese, Lipólise, Urticária, Dispneia, Gliconeogênese, Excitação',
        'Síndrome muscarínica: Salivação, Lacrimejamento, Urinação, Defecação, distúrbios GI, Emese',
        'Síndrome nicotínica: Espasmos, Letargia, Úlceras, Dispneia, Gases, Edema',
        'Síndrome dopaminérgica: Sedação, Lentidão, Urgência miccional, Disfagia, Ganho de peso, Euforia',
      ],
      correctIndex: 1,
      explanation:
        'SLUDGE é o acrônimo dos efeitos muscarínicos por acúmulo de acetilcolina. Ocorre quando a acetilcolinesterase é inibida (organofosforados, carbamatos como o chumbinho), acumulando ACh nas sinapses muscarínicas e causando hiperestimulação parassimpática.',
    },
    {
      question: 'Por que a atropina é o antídoto da intoxicação por organofosforado?',
      options: [
        'Inativa diretamente o organofosforado no plasma por hidrólise',
        'Reativa a acetilcolinesterase inibida, restaurando a degradação da ACh',
        'Bloqueia competitivamente os receptores muscarínicos, revertendo os efeitos da ACh acumulada',
        'Estimula a eliminação renal do organofosforado',
      ],
      correctIndex: 2,
      explanation:
        'A atropina não elimina o tóxico nem reativa a enzima — ela antagoniza os receptores muscarínicos, impedindo que a ACh acumulada cause seus efeitos. É antagonismo competitivo. A pralidoxima (oxima) é usada junto para reativar a AChE antes que o ligante envelheça.',
    },
    {
      question: 'Qual a diferença entre o mecanismo da fisostigmina (usada para simular a intoxicação) e do chumbinho (aldicarb)?',
      options: [
        'A fisostigmina atua em receptores α; o aldicarb atua em receptores β',
        'A fisostigmina inibe a AChE reversivelmente (carbamato); o aldicarb inibe irreversivelmente',
        'O aldicarb só age na periferia; a fisostigmina só no SNC',
        'São quimicamente idênticos, diferindo apenas na dose letal',
      ],
      correctIndex: 1,
      explanation:
        'Ambos são carbamatos inibidores de AChE, mas o aldicarb (chumbinho) tem ligação mais estável e duradoura com a enzima — considerada "irreversível" em termos clínicos. A fisostigmina tem ligação mais fraca e se dissocia espontaneamente em horas. Isso explica por que o chumbinho é muito mais letal.',
    },
  ],

  pcr: [
    {
      question: 'Por que a epinefrina é o único fármaco vasoativo recomendado no protocolo de RCP/ACLS?',
      options: [
        'Porque causa bradicardia reflexa que protege o miocárdio do estresse',
        'Porque sua ação β1 restaura o automatismo cardíaco e α1 aumenta a pressão de perfusão coronariana e cerebral durante as compressões',
        'Porque inibe diretamente a fibrilação ventricular por ação antiarrítmica',
        'Porque é o único fármaco que atravessa a barreira hematoencefálica rapidamente',
      ],
      correctIndex: 1,
      explanation:
        'Na PCR, o coração está em assistolia ou fibrilação. A epinefrina não "choca" o coração — ela aumenta a pressão de perfusão coronariana (via α1) durante as compressões, facilitando que o próximo choque do desfibrilador seja eficaz. O β1 também aumenta o automatismo do nó SA.',
    },
    {
      question: 'Na PCR, qual efeito da epinefrina é mais importante para restaurar a circulação espontânea?',
      options: [
        'Broncodilatação via β2, melhorando a oxigenação',
        'Vasoconstrição periférica via α1, aumentando a pressão de perfusão coronariana e cerebral',
        'Cronotropismo positivo via β1, aumentando a FC do coração parado',
        'Inotropismo negativo via β3, protegendo o miocárdio isquêmico',
      ],
      correctIndex: 1,
      explanation:
        'O objetivo da epinefrina na PCR é aumentar a pressão diastólica aórtica (pressão de perfusão coronariana) durante as compressões. Com mais sangue chegando ao miocárdio, a probabilidade de retorno à circulação espontânea após a desfibrilação aumenta. O β1 é secundário — de pouco vale aumentar o automatismo de um coração sem perfusão.',
    },
    {
      question: 'As pupilas fixas e dilatadas na PCR indicam qual mecanismo farmacológico/fisiológico?',
      options: [
        'Ativação parassimpática excessiva causando midríase paradoxal',
        'Ausência de perfusão cerebral → perda do tônus parassimpático → midríase por predomínio simpático basal',
        'Efeito direto da adrenalina endógena liberada pelo córtex adrenal',
        'Compressão bilateral do nervo oculomotor pela hipóxia cerebral',
      ],
      correctIndex: 1,
      explanation:
        'Normalmente, o tônus parassimpático (nervo oculomotor → M3 → M. constritor) mantém as pupilas em tamanho médio. Sem perfusão cerebral, esse sinal parassimpático cessa → o tônus simpático basal (α1 → M. radial) predomina → midríase. É um sinal clínico de parada circulatória prolongada.',
    },
  ],
};
