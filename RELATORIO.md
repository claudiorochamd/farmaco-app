# Farmacologia Interativa — Relatório Completo de Funcionalidades

**Autor:** Cláudio Rocha  
**Instituição:** Universidade Federal de Pernambuco — UFPE  
**Curso:** Medicina · Turma 158 · 3º Período  
**Contato:** claudio.filho@ufpe.br  
**Acesso:** https://farmacologia-app.vercel.app  
**Repositório:** https://github.com/claudiorochamd/farmaco-app

---

## 1. Visão Geral

O **Farmacologia Interativa** é um simulador educacional web voltado ao ensino de farmacologia do sistema nervoso autônomo (SNA). Desenvolvido como ferramenta pedagógica para o curso de Medicina, o app permite que estudantes visualizem em tempo real os efeitos de fármacos adrenérgicos, colinérgicos, bloqueadores e substâncias de uso cotidiano sobre o organismo humano.

O simulador combina três pilares pedagógicos:
- **Visualização** — boneco animado com alterações visuais nos órgãos-alvo
- **Avaliação** — cenários clínicos cronometrados com quiz pós-cenário
- **Referência** — guia de aprendizado integrado com mecanismos, receptores e uso clínico

---

## 2. Stack Tecnológico

| Tecnologia | Versão | Função |
|---|---|---|
| React | 19 | Framework de interface com componentes reutilizáveis |
| TypeScript | 5.x | Tipagem estática e segurança no desenvolvimento |
| Vite | 8.x | Servidor de desenvolvimento e bundler de produção |
| Tailwind CSS | v4 | Estilização via plugin Vite (sem arquivo de configuração) |
| Vercel | — | Hospedagem com deploy contínuo |
| GitHub | — | Versionamento e histórico de mudanças |
| qrcode.react | — | Geração de QR code do PIX na tela "Sobre" |

---

## 3. Funcionalidades Detalhadas

### 3.1 Tela Introdutória

A tela inicial exibe:
- Nome e propósito do app
- 4 cards numerados explicando o funcionamento básico
- 4 classes farmacológicas disponíveis com os principais fármacos de cada
- Botão **"Começar a Simulação"** com efeito hover
- Logotipo da UFPE com créditos do autor (nome, turma, e-mail clicável)
- Card **"Apoie este Projeto"** com QR code do PIX

A preferência de acesso é registrada em `localStorage` para controle do tutorial.

---

### 3.2 Tutorial de Primeira Vez

Ao entrar no app pela primeira vez, um tutorial em 8 passos é exibido automaticamente:

1. Boas-vindas ao simulador
2. Painel de medicamentos
3. O boneco e seus órgãos interativos
4. Sinais vitais e ECG
5. Gráfico de neurotransmissores
6. Cenários clínicos
7. Guia de aprendizado
8. Conclusão e início da exploração

Cada passo contém: ícone SVG temático, título, descrição e dica em destaque. O usuário pode:
- Navegar com os botões **"Anterior"** e **"Próximo"**
- Clicar nos dots para ir diretamente a qualquer passo
- Clicar em **"Pular tutorial ×"** a qualquer momento

O tutorial não reaparece em visitas subsequentes (salvo em `localStorage` como `farmaco_tutorial_done`).

---

### 3.3 Navegação Principal

O app é organizado em 4 abas na barra de navegação superior:

| Aba | Conteúdo |
|---|---|
| **Simulação** | Painel de fármacos + Boneco + Sinais Vitais |
| **Cenários Clínicos** | 7 cenários + Histórico de Sessão |
| **Guia de Aprendizado** | 9 tópicos de farmacologia |
| **Sobre** | Informações do projeto e PIX |

O layout se adapta automaticamente a três breakpoints:
- **Mobile** (< 700px): abas Fármacos / Boneco / Sinais
- **Tablet** (700–1100px): painel lateral + conteúdo empilhado
- **Desktop** (> 1100px): 3 colunas — Fármacos | Boneco | Sinais Vitais

---

### 3.4 Painel de Medicamentos

Localizado na coluna esquerda da simulação. Organizado em 5 categorias:

#### Agonistas Adrenérgicos (8 fármacos)
Epinefrina, Norepinefrina, Dopamina, Dobutamina, Salbutamol, Fenilefrina, Isoproterenol, Clonidina

#### Bloqueadores Adrenérgicos (6 fármacos)
Propranolol, Metoprolol, Atenolol, Fentolamina, Prazosina, Labetalol

#### Agonistas Colinérgicos (6 fármacos)
Acetilcolina, Pilocarpina, Carbacol, Betanecol, Neostigmina, Fisostigmina

#### Bloqueadores Colinérgicos (4 fármacos)
Atropina, Escopolamina, Ipratrópio, Glicopirrolato

#### Variedades (5 substâncias)
Cigarro (nicotina), Café (cafeína), Energético, Chumbinho (aldicarb), Cocaína

**Total: 29 substâncias**

Para cada fármaco, o painel exibe:
- Nome e subclasse
- Receptores alvo
- Mecanismo de ação
- Controle deslizante de dose (5% a 100% da dose máxima)
- Badges de efeitos esperados (FC, PA, brônquio, pupila, TGI)
- Botão **"Administrar"**

Múltiplos fármacos podem ser administrados simultaneamente. Os efeitos são calculados aditivamente.

---

### 3.5 Boneco Interativo

O boneco é renderizado em SVG com anatomia visível. Todos os efeitos ocorrem em tempo real:

#### Efeitos visuais implementados

| Efeito | Mecanismo | Visual |
|---|---|---|
| Frequência cardíaca | β1 (↑) / M2 (↓) | Velocidade da animação do coração |
| Vasodilatação | M3/β2 | Pele avermelhada |
| Vasoconstrição | α1 | Pele pálida/acinzentada |
| Broncodilatação | β2 | Pulmões expandidos + label |
| Broncoespasmo | M3/α1 | Pulmões reduzidos + label |
| Midríase | α1 | Pupilas grandes |
| Miose | M3 | Pupilas pequenas |
| Sudorese | M (colinérgico simpático) | Gotas caindo |
| Sialorréia | M3 | Gotas na região bucal |
| Lacrimejamento | M3 | Gotas nos olhos |
| Tremor | β2 | Mãos tremendo |
| Cianose | SpO2 < 90% | Overlay azul no corpo |
| Febre | T > 38,4°C | Overlay vermelho |
| Hipotermia | T < 35°C | Overlay azul frio |

#### Animações técnicas
- Batimento cardíaco: CSS keyframes com amplitude e velocidade proporcionais à FC
- Coração: gradiente radial com glow que escala com a FC
- Pulmões: expansão sincronizada com a FR
- Pupilas: ClipPath SVG garante que sempre fiquem dentro do olho

#### Anatomia interativa
Clicar no **coração**, **pulmões** ou **olhos** abre um painel flutuante mostrando:
- Receptor(es) presente(s) naquele órgão
- Sistema (simpático/parassimpático)
- Efeito quando o receptor é ativado
- Fármacos que agem naquele órgão (com cor do sistema)

#### Estado de óbito
Quando o paciente morre (overdose ou cenário), os olhos se fecham com uma animação de pálpebra descendo.

---

### 3.6 Sinais Vitais em Tempo Real

Painel na coluna direita com atualização contínua:

| Parâmetro | Baseline | Faixa normal | Unidade |
|---|---|---|---|
| Frequência Cardíaca | 70 | 60–100 | bpm |
| Pressão Arterial | 120/80 | 90–140 / 60–90 | mmHg |
| Frequência Respiratória | 15 | 12–20 | rpm |
| SpO2 | 98 | ≥ 95 | % |
| Temperatura Corporal | 36,5 | 36,1–37,2 | °C |

Cada parâmetro tem um código de cor dinâmico:
- **Verde** — dentro da faixa normal
- **Amarelo/laranja** — zona de alerta
- **Vermelho** — crítico

**Alertas piscantes** aparecem para: taquicardia grave, bradicardia grave, hipertensão grave, hipotensão grave, hipoxemia, febre alta e hipotermia.

#### Cálculo da temperatura
A temperatura é derivada do efeito de sudorese dos fármacos ativos:
- Anticolinérgicos (bloqueiam M3) → anhidrose → hipertermia
- Colinérgicos → sudorese excessiva → hipotermia

---

### 3.7 ECG em Tempo Real

Display de ECG no painel de sinais vitais com:
- Traçado P-QRS-T desenhado em canvas com `requestAnimationFrame`
- Velocidade de rolagem proporcional à FC atual
- Fundo preto com traçado verde com efeito de glow
- Exibe: `FC [valor] bpm` e `SpO2 [valor]%` com cores dinâmicas
- Grade sutil e fade nas bordas

---

### 3.8 Gráfico de Neurotransmissores

Dois gráficos separados posicionados no painel central, abaixo do boneco:

**Gráfico 1 — Sistema Simpático:**
- Noradrenalina (laranja) + Adrenalina (vermelho)

**Gráfico 2 — Sistema Parassimpático:**
- Acetilcolina (verde) + Dopamina (roxo)

#### Características técnicas
- Curvas Bezier (catmull-rom) para linhas fluídas
- Interpolação linear por frame (`lerp`) para transições suaves
- Histórico de 60 segundos (120 pontos × 0,5s)
- Preenchimento gradiente semitransparente sob cada linha
- Ponto brilhante (dot) no extremo direito de cada linha
- Fade nas bordas esquerda e direita
- Linha de baseline em 30% como referência
- Grade sutil em 25%, 50%, 75%
- Legenda com valores numéricos ao vivo
- Atualiza a cada 30 frames (~0,5s)

#### Mapeamento fármaco → neurotransmissor
Cada fármaco tem contribuições definidas para NE, ACh, DA e Epi. Exemplos:
- Cocaína: ↑↑ NE + ↑↑ DA (inibe NET e DAT)
- Chumbinho: ↑↑↑ ACh (inibe AChE irreversivelmente)
- Cigarro: ↑ NE + ↑ ACh + ↑ DA (efeito nicotínico)
- Atropina: ↓↓ ACh (bloqueio muscarínico)

---

### 3.9 Interações Medicamentosas

16 interações medicamentosas catalogadas e detectadas automaticamente. Quando dois fármacos com interação conhecida estão na corrente sanguínea, um painel de alerta aparece na barra inferior com:

- Nível de gravidade: **Info** / **Atenção** / **Perigo**
- Título da interação
- Fármacos envolvidos (pills coloridas)
- Descrição farmacológica da interação

#### Exemplos de interações catalogadas
- Epinefrina + Propranolol → hipertensão grave (β bloqueado → α predomina)
- Epinefrina + Fentolamina → reversão da epinefrina (α bloqueado → β predomina)
- Neostigmina + Atropina → antagonismo clínico (uso em reversão de bloqueio neuromuscular)
- Salbutamol + Propranolol → broncoespasmo grave em asmáticos
- Cocaína + Epinefrina → estimulação cardíaca somada e risco de arritmia

---

### 3.10 Sistema de Morte por Parâmetros Críticos

#### Limiares individuais (7)
| Limiar | Condição | Causa de óbito |
|---|---|---|
| Taquicardia fatal | FC > 240 bpm | Fibrilação ventricular |
| Bradicardia fatal | FC < 18 bpm | Assistolia |
| Hipotensão fatal | PAS < 40 mmHg | Choque irreversível |
| Hipertensão fatal | PAS > 260 mmHg | Hemorragia cerebral |
| Hipóxia fatal | SpO2 < 68% | Falência respiratória |
| Hipertermia fatal | T > 41,0°C | Falência de múltiplos órgãos |
| Hipotermia fatal | T < 34,8°C | Parada cardíaca |

#### Limiares combinados — síndromes (4)
| Síndrome | Condição combinada |
|---|---|
| Síndrome colinérgica grave | FC < 40 bpm **+** SpO2 < 87% |
| Colapso cardiovascular misto | FC < 45 bpm **+** PAS < 62 mmHg |
| Crise adrenérgica combinada | FC > 160 bpm **+** PAS > 180 mmHg |
| Overdose de cocaína | FC > 150 **+** PAS > 170 **+** T > 38,8°C |

#### Fluxo de morte (simulação livre)
1. Limiar cruzado → banner vermelho pulsante com causa e contador regressivo de **20 segundos**
2. Se vitais retornam ao normal: aviso desaparece — paciente salvo
3. Se contador chega a 0: olhos fecham → overlay de óbito com:
   - **Causa do óbito** (card vermelho)
   - **Como teria evitado** (card azul com instrução farmacológica)
   - Botão **"Tentar novamente"**

A verificação de parâmetros críticos ocorre mesmo durante cenários clínicos, permitindo que overdoses durante o cenário também causem óbito.

---

### 3.11 Cenários Clínicos

7 cenários clínicos disponíveis na aba "Cenários Clínicos":

| Cenário | Fármaco correto | Gravidade |
|---|---|---|
| Choque Anafilático | Epinefrina (85%) | Emergência |
| Bradicardia Sintomática | Atropina (75%) | Emergência |
| Crise Hipertensiva | Labetalol (80%) | Urgência |
| Crise Asmática | Salbutamol (85%) | Urgência |
| Choque Séptico | Norepinefrina (90%) | Emergência |
| Intoxicação por Organofosforado | Fisostigmina (80%) | Emergência |
| Parada Cardiorrespiratória | Epinefrina (100%) | Emergência |

#### Funcionamento
1. Ao iniciar, o boneco exibe **os sintomas do paciente doente** (FC, PA, SpO2, temperatura, pupilas e efeitos do baseline do cenário)
2. Um **contador regressivo de 60 segundos** começa
3. Administrar o fármaco correto: contador para, banner fica verde "Tratamento correto!"
4. Expirar o tempo: olhos fecham + tela de óbito com fármaco correto revelado

#### Dicas progressivas (scaffolding pedagógico)
Três dicas aparecem progressivamente:
- **40s restantes**: observação clínica geral do quadro
- **25s restantes**: indica o mecanismo e a classe do receptor envolvido
- **10s restantes**: nomeia diretamente o fármaco correto

As dicas aparecem em amarelo no banner do cenário e substituem umas às outras.

#### Após o cenário
Botões **"Fazer quiz"** (se resolvido) ou **"Testar meu conhecimento"** (se óbito) aparecem para acessar o quiz pós-cenário.

---

### 3.12 Quiz Pós-Cenário

Após cada cenário (vencido ou perdido), o aluno pode fazer um quiz com 3 perguntas de múltipla escolha:

- **21 questões no total** (3 por cenário), elaboradas com base nos PDFs das aulas
- 4 opções por pergunta (A, B, C, D)
- Feedback imediato: verde (correto), vermelho (errado) + explicação farmacológica detalhada
- Barra de progresso visual por questão
- Resultado final com percentual e mensagem motivacional:
  - 100%: "Excelente! Domínio completo!"
  - ≥ 66%: "Bom trabalho! Revise os pontos errados."
  - < 66%: "Continue estudando — reveja o guia de aprendizado."
- Score salvo no Histórico de Sessão

---

### 3.13 Histórico de Sessão

Registra automaticamente cada cenário concluído em `localStorage`. Acessível na aba "Histórico de Sessão" dentro de Cenários Clínicos.

**Dados registrados por sessão:**
- Nome e cor do cenário
- Resultado (resolvido / óbito)
- Tempo utilizado (em segundos)
- Número de tentativas
- Fármacos errados tentados antes do correto
- Nota do quiz (0–3) quando realizado
- Timestamp

**Resumo agregado no topo:**
- Total de cenários realizados
- Total resolvidos
- Média do quiz

Capacidade máxima: 50 registros (mais antigos são descartados automaticamente). Botão de **"Limpar histórico"** disponível.

---

### 3.14 Guia de Aprendizado

9 tópicos de referência farmacológica organizados em sidebar (desktop) ou scroll horizontal de abas (mobile):

1. **Visão Geral do SNA** — tabela comparativa de efeitos simpáticos vs parassimpáticos para todos os órgãos
2. **Neurotransmissão** — síntese das catecolaminas (Tirosina → NE → Epi), degradação, síntese da ACh e fármacos que interferem (reserpina, toxina botulínica, etc.)
3. **Receptores Adrenérgicos** — α1 (com subtipos α1A, α1B, α1D), α2, β1, β2, β3; acoplamento G, potência dos agonistas, localização e efeitos
4. **Receptores Colinérgicos** — M1 a M5 com localização, efeito e vias de sinalização; Nm e Nn; mnemônico SLUDGE
5. **Agonistas Adrenérgicos** — 11 fármacos com mecanismo, uso clínico e efeitos colaterais
6. **Bloqueadores Adrenérgicos** — α-bloqueadores (com mnemônico PraTeraDoxa AlTanSilo) e β-bloqueadores por geração (1ª, 2ª, 3ª), com ASI
7. **Agonistas Colinérgicos** — 11 fármacos com BHE (atravessa/não atravessa), mecanismo e uso clínico
8. **Bloqueadores Colinérgicos** — 12 fármacos com indicações, BHE e efeitos
9. **Interações Medicamentosas** — todas as 16 interações ordenadas por gravidade

Cada fármaco nas seções 5–8 tem botão **"Ver no boneco"** que administra o fármaco diretamente na simulação, trocando automaticamente para a aba Simulação.

---

### 3.15 Modo Claro/Escuro

Toggle ☀️/🌙 no canto do header. Alterna entre tema escuro (padrão médico, fundo #0d1117) e tema claro (fundo #f0f4f8). A preferência é salva em `localStorage` e aplicada via CSS custom properties (`--bg`, `--border`, `--text-*`).

---

### 3.16 Anatomia Interativa

No boneco da simulação, clicar nos órgãos abre um painel flutuante:

- **Coração**: receptores β1 (simpático) e M2 (parassimpático)
- **Pulmões**: receptores β2 (broncodilatação) e M3 (broncoconstrição)
- **Olhos/Pupilas**: receptores α1 (midríase) e M3 (miose)

Para cada receptor, o painel exibe: nome, sistema, efeito e fármacos que agem naquele receptor (com cores distintas para simpático/parassimpático).

---

### 3.17 Aba "Sobre este Projeto"

Informações do projeto acessíveis pela barra de navegação:

- **Desenvolvido por:** Cláudio Rocha — Medicina, 3º Período, Turma 158, UFPE
- **Contato:** claudio.filho@ufpe.br (link mailto clicável)
- **Apoie este Projeto:** QR code gerado automaticamente para a chave PIX
- **Sobre o projeto:** descrição e objetivo educacional
- **Tecnologias utilizadas:** React 19, TypeScript, Vite, Tailwind CSS v4, Vercel, GitHub

---

## 4. Parâmetros Farmacológicos

### 4.1 Cálculo de Sinais Vitais

Os sinais vitais são calculados a partir da soma dos efeitos de todos os fármacos ativos:

```
FC  = 70  × (1 + Σ(heartRate × doseFactor) / 100)   [clamp: 18–260 bpm]
PAS = 120 × (1 + Σ(systolicBP × doseFactor) / 100)  [clamp: 40–300 mmHg]
PAD = 80  × (1 + Σ(diastolicBP × doseFactor) / 100) [clamp: 20–200 mmHg]
FR  = 15  × (1 + Σ(heartRate × doseFactor) / 300)   [clamp: 4–45 rpm]
SpO2 = f(bronchialFactor)                             [clamp: 65–100%]
T°  = 36,5 + f(sweatDelta)                           [clamp: 34,0–42,0°C]
```

onde `doseFactor = dose / maxDose` (0 a 1).

### 4.2 Efeitos no Corpo Visual

O estado do corpo é calculado de forma análoga, com clamps:

| Campo | Mínimo | Máximo | Unidade |
|---|---|---|---|
| heartRateMultiplier | 0,25 | 3,5 | adimensional |
| skinVasodilation | -1 | 1 | adimensional |
| pupilNormalized | 0,05 | 1 | adimensional |
| bronchialNormalized | 0,25 | 2,0 | adimensional |
| sweating | 0 | 1 | adimensional |

---

## 5. Aspectos Pedagógicos

### 5.1 Baseado em Evidências de Aprendizado

O app implementa princípios consolidados da pedagogia médica:

- **Aprendizado baseado em problemas (PBL)**: os cenários clínicos simulam situações reais de emergência
- **Scaffolding**: dicas progressivas que diminuem de apoio à medida que o tempo passa
- **Feedback imediato**: o quiz mostra o acerto/erro com explicação na mesma tela
- **Visualização espacial**: conexão visual entre receptor → órgão → efeito clínico
- **Repetição espaçada**: o histórico de sessão permite identificar cenários que precisam de revisão

### 5.2 Cobertura de Conteúdo

O app cobre os seguintes tópicos do currículo de farmacologia:

- Fisiologia do SNA (simpático e parassimpático)
- Neurotransmissão adrenérgica (síntese de catecolaminas, COMT, MAO)
- Neurotransmissão colinérgica (AChE, BuChE, VAchT)
- Receptores adrenérgicos (α1, α2, β1, β2, β3) com subtipos e vias de sinalização
- Receptores colinérgicos (M1–M5, Nm, Nn)
- Agonistas e bloqueadores adrenérgicos (endógenos e sintéticos)
- Agonistas e bloqueadores colinérgicos (diretos e indiretos)
- Anticolinesterásicos reversíveis e irreversíveis
- Interações farmacodinâmicas clínicas
- Toxicologia: síndromes colinérgica, adrenérgica e overdose

### 5.3 Possibilidades de Uso em Aula

- **Demonstração pelo professor**: projetar em tela e simular fármacos ao vivo
- **Atividade individual**: alunos simulam cenários e fazem o quiz
- **Avaliação formativa**: histórico de sessão pode ser analisado pelo professor
- **Revisão pré-prova**: guia de aprendizado como referência rápida

---

## 6. Considerações Técnicas

### 6.1 Persistência de Dados

| Dado | Armazenamento | Duração |
|---|---|---|
| Tutorial concluído | `localStorage` | Permanente |
| Histórico de sessão | `localStorage` | Permanente (máx. 50 registros) |
| Preferência de tema | `localStorage` | Permanente |

Nenhum dado é enviado a servidores externos. Toda a lógica roda no navegador do usuário.

### 6.2 Compatibilidade

- Navegadores modernos: Chrome, Firefox, Safari, Edge (versões recentes)
- Dispositivos: desktop, tablet, smartphone
- Sistema: qualquer OS com navegador moderno
- Instalável como PWA (Progressive Web App) adicionando ao homescreen

### 6.3 Performance

- Bundle final: ~403 KB (gzip: ~116 KB)
- Tempo de carregamento inicial: < 2s em conexão 4G
- Animações via `requestAnimationFrame` para suavidade (60fps)
- Cálculos farmacológicos via `useMemo` para evitar recomputação

---

## 7. Limitações e Trabalhos Futuros

### 7.1 Limitações Atuais

- Os efeitos farmacológicos são simplificados (lineares em relação à dose) — não modelam curvas dose-resposta, tolerância ou farmacocinética completa
- A temperatura é derivada indiretamente da sudorese, não de um modelo térmico completo
- Não há modelagem de efeitos centrais (SNC) além dos já descritos
- Os valores de maxDose são didáticos, não necessariamente terapêuticos reais

### 7.2 Desenvolvimentos Futuros Planejados

- Modo de apresentação (fullscreen sem barras laterais)
- ECG com padrões patológicos específicos (fibrilação, bloqueio AV)
- Sons clínicos (beep do monitor proporcional à FC)
- Calculadora de dose por peso (mcg/kg/min)
- Exportação do histórico de sessão como PDF
- Questionário de validação pedagógica integrado (formulário)
- Versão offline completa (service worker)

---

## 8. Acesso e Reprodução

O código-fonte completo está disponível publicamente em:
**https://github.com/claudiorochamd/farmaco-app**

O app está hospedado gratuitamente em:
**https://farmacologia-app.vercel.app**

Não é necessário cadastro, login ou instalação. Basta acessar pelo navegador.

---

*Relatório gerado em maio de 2026.*  
*Farmacologia Interativa — Cláudio Rocha — UFPE — Turma 158*
