# HANDOFF — Projeto "nós.exe" (site de pedido de namoro) — v2.8

> **Como usar num chat novo:** comece a conversa anexando **ESTE arquivo `.md` + o `nos-projeto.zip`**.
> O zip tem o código atual, funcional e testado. Este doc tem todo o contexto, as decisões e as regras
> que não podem ser quebradas. Leia a seção 5 (CONTRATO DO CONFIG) com atenção — é o que mais quebra o site.

**Status atual (último update):** projeto COMPLETO e validado.
Última ação (v2.8): **pino-SEGREDO no mapa + Dunamis confirmada (29/08) + FAST PASS no ingresso.**
- Ingresso da Dunamis comprado: **29/08/2026, São Paulo/SP (local exato a confirmar)**. Kevin também
  comprou o **FAST PASS** (entram 1h antes + veem a passagem de som).
- **A ideia central (o "gancho" que liga começo e fim):** no `mapa` (cena cedo) entra um **pino
  trancado** (`tipo:"segredo"`, coral + 🔒) que ela vê **sem saber o que é** ("???"). Lá no final, quando
  ela **revela o ingresso** (`revealIngresso()`), o site chama **`unlockDunamisPin()`** e o pino
  **destrava** (vira âmbar, popup revela "Conferência Dunamis · 29/08 · SP"). Estado guardado em
  `dunamisUnlocked` — se ela voltar ao mapa (←), já aparece destravado.
- **Config:** `CONFIG.mapa.pinos` ganhou 1 item `tipo:"segredo"` com sub-bloco `revelado:{nome,nota}`.
  `CONFIG.ingresso` teve `data`/`lugar` preenchidos e ganhou o campo **`bonus`** (texto do fast pass;
  `""` esconde). `CONFIG.dunamis.data` já era `2026-08-29T20:00:00`.
- **HTML:** +1 elemento `#ingBonus` dentro do ticket (`.t-bonus`). **CSS:** `.pin.segredo` (cadeado
  pulsante coral), `.pin.futuro.reveal` (brilho ao destravar), `.t-bonus` (selo âmbar do fast pass).
- **⚠️ ÚNICO item manual restante:** quando confirmar o **local exato** do evento, trocar a `coord` do
  pino-segredo em `CONFIG.mapa.pinos` (e, se quiser, o texto `lugar` em `CONFIG.ingresso`).
- Validado: `node --check` nos 2 arquivos + smoke jsdom (**26 cenas**) + asserts da mecânica nova → zero erros.

---

Ação anterior (v2.7): **+1 cena — `amada` ("você nunca vai estar sozinha"), antes do pedido.**
- `amada` entra **entre `letter` e `breath`**. Conceito (decidido com o Kevin): NÃO é "testemunhas"
  de contrato — é mostrar pra ela, logo antes do pedido, **o quanto ela é amada e que nunca vai estar
  sozinha**, e o pedido emenda nisso ("quero ser mais um nome nessa lista").
- Estrutura em **dois níveis** (pra 13 pessoas não cansarem):
  • `destaques[]` = card completo: foto + recado que **digita** (typewriter) + assinatura manuscrita +
    **áudio OPCIONAL** (player com barras; só aparece se o item tiver `audio`). Tem `🔒 carregar →`,
    clica → abre/digita. Hoje: Mãe, Pai, Vô, Ana Julia.
  • `mural[]` = recado curto que entra em **cascata** (grid 3 col). Foto opcional → sem foto mostra a
    **inicial** num círculo. Agrupado por `grupo` (escola/de fora/antigos). Hoje: Sara, Gean, Gabi, Emi,
    Sophia, Monique, Kauã, Luis, Pazete.
  • Fecha com `tally` ("{n} pessoas testemunham...: você é muito amada" — `{n}` é calculado) + `bridge`.
- Conteúdo 100% em **`CONFIG.amada`** (eyebrow,titulo,intro,muralLabel,abrir,aberto,destaques[],mural[],
  tally,bridge). Os **textos são EXEMPLO** (marcados `[exemplo]`/`[ex]`) — o Kevin troca pelos recados
  reais conforme as pessoas mandam (templates de WhatsApp já existem). As PALAVRAS são de cada pessoa.
- Lógica: build único (IIFE) + `runAmada()` (guarda `amadaShown`, cascata do mural + tally + bridge).
  Áudio dá **duck** na música (`duck()/restore()`) enquanto toca. Clima `amada:[0.55,0]` (lua suave),
  depth 0.80. NÃO está em `noSkip` (igual `letter`/`verses`).
- Assets novos são TODOS opcionais (placeholder se faltar): `assets/amada-{mae,pai,avo,ana}.jpg` e
  `assets/vozes/{mae,pai,ana}.mp3`. Mural não precisa de foto.
Validado: `node --check` nos 2 arquivos + smoke jsdom (**26 cenas**) → zero erros.

---

Última ação (v2.6): **+2 cenas — `verses` (versículos) e `ingresso` (Dunamis surpresa).**
- `verses` entra **entre `turn` e `letter`**: 3 cards revelando em cascata sobre uma linha-tempo
  (tempo → amor → espera). Conteúdo 100% em `CONFIG.versiculos` (`eyebrow,titulo,intro,itens[]`),
  cada item = `{ref,texto,nota[,fav,favTag]}`. O card com `fav:true` ganha destaque dourado
  ("o favorito dela" = **Colossenses 3.14**). Versículos em Almeida (domínio público). Lógica:
  `runVerses()` (guarda `versesShown`), clima de fundo `verses:[0.5,0]` (lua calma), depth 0.70.
- `ingresso` entra **entre `roadmap` e `dunamis`**: uma "passagem" lacrada (blur) que ela **revela**
  no clique (ou auto-revela em 2.6s como failsafe) → desembaça, carimba **CONFIRMADO** (verde terminal),
  solta confete e só então mostra o "continuar". Está em `noSkip` (seta não pula). Conteúdo em
  `CONFIG.ingresso` (evento/data/lugar/lugares + textos). `data`/`lugar` são **placeholders** —
  trocar quando confirmar (pode repetir `CONFIG.dunamis.data`). Lógica: `initIngresso()`/`revealIngresso()`.
- Removido: o canvas "Noite Estrelada" do preview NÃO foi portado (a pedido). O aceno ao Van Gogh
  já vive na cena `girassol`.
Validado: `node --check` nos 2 arquivos + smoke jsdom (**25 cenas**, dunamis ativo) → zero erros.


Última ação (v2.5): **PLAYLIST + tela de escolher música (terminal) + mini-player com controles.**
- Cena nova `picker` entre `boot` e `hello`, em **estilo terminal** (reusa `.terminal`/`.term-body`,
  com leve CRT): "lista" as faixas (`ls`) e abre um prompt `nós@kevin:~$ play <n>`. Letycia **digita o
  número** (ou clica/Enter na faixa) — o terminal ecoa, mostra `▸ tocando:`, faz `carregando … ok` e
  **salta direto pro "oi princesa"** (sem botão de continuar). Lógica em `runPicker()` (chamada no `show()`),
  com guarda `pickerInited`/`pickerDone`. `picker` está em `noSkip`. Textos 100% em `CONFIG.picker`
  (`host`, `lsCmd`, `intro` c/ `{n}`, `playCmd`, `tocando`, `carregando`, `invalida`).
- **Playlist**: quando a faixa **acaba** (`audio 'ended'`) pula sozinha pra próxima e dá a volta no fim
  (`CONFIG.playlistConfig.repetirTudo`). `CONFIG.playlist[] = {arquivo,titulo,artista}`, com **fallback**
  pra `CONFIG.musica` se a lista ficar vazia. A escolha dela é também o gesto que libera o áudio.
- **Mini-player** (`#nowplaying`, canto sup. esq.): clicar na barrinha **abre um painel** com
  ⏮ anterior / ❚❚ play-pause / ⏭ próxima + **barra de progresso clicável** (seek) e tempos. `prevTrack()`
  recomeça a faixa se passou de 3s, senão volta uma. A barrinha reflete a faixa atual.
Validado: `node --check` nos 2 arquivos + smoke jsdom (**23 cenas**, `dunamis` ativo) +
testes do picker (renderiza faixas, seleção toca + `.sel`, `ended` avança) e do player (painel abre,
botão pular troca a faixa) → zero erros.

Histórico: v2.4 implementou fundos por cena (`lua`/`girassol`/`reasons`/`letter`), pinos do mapa,
+3 skins, `dunamis` (gated), cena `sonar` 🦈 e removeu easter eggs de teclado.
v2.3 add `lua`/`girassol` + motivos em papel; v2.2 removeu RELÍQUIA e MAKING-OF.

---

## 1. O que é

Site interativo e pessoal pro **Kevin** pedir a **Letycia** oficialmente em namoro.
Conceito: começa **100% no mundo dev** (terminal preto "inicializando o projeto") e vai
**esquentando até virar romântico** no pedido. O contraste código-frio × afeto-quente é a graça.

- **Tom:** divertido/brincalhão, com virada sincera no fim. **Evitar brega/meloso** (o Kevin corta clichês).
- **Onde roda:** no **notebook do Kevin** (desktop-first; responsivo existe mas não é prioridade).
- **Navegação:** por **fases controladas por botão** (não scroll livre) + seta direita do teclado.
- **Voz do Kevin:** PT-BR casual. **Preservar a escrita dele** — não "corrigir" o estilo dele. Ele edita
  os textos sozinho no `config.js` e reenvia; **trate o arquivo dele como fonte da verdade** e aplique
  edições incrementais (não regenere do zero).

---

## 2. Stack e estrutura

Estático, **vanilla** (HTML/CSS/JS puro, sem build/framework). Google Fonts + Leaflet via CDN.
Funciona em `file://` (teste local) e no GitHub Pages.

```
nos-projeto/
├── index.html        # estrutura das cenas (<section class="scene">) + overlays. Quase não se mexe.
├── css/style.css     # estilos + design tokens (:root)
├── js/config.js      # 👈 TODO o conteúdo editável (textos, fotos, mapa, roadmap, créditos, etc.)
├── js/script.js      # toda a lógica (~622 linhas). NÃO precisa mexer pra mudar conteúdo.
├── assets/           # fotos e (futuramente) a música. Tem LEIA-ME.txt explicando os nomes.
├── README.md         # instruções pro Kevin (como editar, testar, publicar)
└── HANDOFF-nos-projeto.md  # este arquivo
```

**Regra de ouro arquitetural:** todo conteúdo editável vive em `config.js`. O Kevin muda texto/foto
sem nunca tocar em `script.js`. Se uma feature nova precisa de texto, esse texto entra no `config.js`.

---

## 3. Design (v2.1 — "obsidiana narrativa")

Tokens no `:root` do `style.css`. A paleta **conta a história**: começa fria/terminal e esquenta.

- `--void:#04050a` · `--bg:#0a0c12` · `--surface:#13161f` · `--line:#262d3c`
- `--term:#5af78e` (verde terminal, início frio)
- `--tide:#4fd6c2` (teal — **o mar dela**, cor-tema)
- `--amber:#f2b25c` (âmbar, aquece) · `--coral:#ff8aa0` (rosa, picos emocionais)
- `--ink:#f3eee7` (texto) · `--muted:#909bad` · `--code:#7fb0ff`

**Fontes:** JetBrains Mono (terminal/código) · Fraunces (serif emocional) · Space Grotesk (UI) ·
Caveat (manuscrita, bilhetes) · Inter (corpo).

**Fundo:** um **mar em canvas** com raios de luz volumétricos e partículas subindo. Ele **APROFUNDA
conforme a cena** (variável `depth` no script): escuro/fundo do mar no começo → superfície iluminada no
pedido. Não é imagem, é código.

---

## 4. Fluxo de cenas

Array `scenes` no `script.js` controla a ordem. Cada item tem um `id` que casa com uma
`<section id="...">` no HTML. Ordem atual:

`boot → picker → hello → timeline → mapa → counter → galleryScene → sonar → lua → girassol → reasons → lock → foto → turn → verses → letter → amada → breath → ask → final → roadmap → [dunamis] → contrato → deploy → creditos`

(v2.5: `picker` 🎵 entre `boot` e `hello` — só entra se houver `CONFIG.playlist`/`CONFIG.musica`.
v2.4: `sonar` 🦈 entre galleryScene e lua; `[dunamis]` só entra se `CONFIG.dunamis.ativo===true`.
Clima do fundo por cena via `moodFor`/`setSeaMood` no `initSea`: lua=noite, girassol=dourado, reasons=quente,
letter=índigo calmo; volta ao mar normal nas outras. v2.3 add `lua`/`girassol` + motivos em papel (`runReasons`).
Easter eggs de teclado removidos na v2.4. O antigo `reliquia` foi removido na v2.2.)

Navegação: botão "continuar" / seta direita avança. O `show(id)` é a função central que troca de cena
e ajusta a profundidade do mar.

---

## 5. ⚠️ CONTRATO DO CONFIG — NÃO QUEBRAR

O `script.js` lê **1 bloco** que **DEVE existir no `config.js` no formato EXATO abaixo**.
Se o Kevin reenviar um `config.js` sem ele (ele costuma mandar só o conteúdo "de cima" e esquecer),
**o site quebra no load**. Nesse caso: **RE-ADICIONE o bloco** antes de entregar.

```js
creditos: {
  eyebrow, voltar, titulo, sub,
  linhas: [ { papel, nome }, ... ],
  fim
}
```

> ⚠️ Histórico: até a v2.1 existiam **3 blocos** críticos (`creditos`, `makingOf`, `reliquia`).
> Na **v2.2** o Kevin pediu pra remover relíquia e making-of, então **NÃO re-adicione** `makingOf`
> nem `reliquia` — eles foram tirados de propósito. Sobrou só o `creditos`.

O conteúdo atual do bloco `creditos` (na voz do Kevin, com agradecimento ao avô) já está
no `config.js` do zip — use como referência se precisar reconstruir.

**Procedimento quando o Kevin manda um config novo:**
1. Faça `diff` entre o config dele e o do projeto pra ver o que mudou de conteúdo.
2. Se faltar o bloco `creditos`, **anexe-o ao final** (antes do `};` de fechamento do objeto `CONFIG`).
3. Valide (seção 8) antes de entregar.

---

## 6. Funcionalidades (TODAS já implementadas e funcionando)

- **Boot terminal** full-screen verde-no-preto (`config.bootSeq`). Lança com Enter/clique.
- **Mar em canvas** com raios + partículas que aprofunda por cena (`depth`).
- **Som sintetizado** (Web Audio, sem arquivo) + **vibração** em momentos-chave. Botão pra mutar SFX.
- **Botão "não" que foge** (mouse + touch), com confete saindo da origem. Labels em `config.noLabels`.
- **Barra now-playing** (`config.nowPlaying`) com equalizer animado + barra de status com uptime.
- **Mapa Leaflet + OpenStreetMap** (tiles escuros, **sem API key**). Pinos em `config.mapa.pinos`.
  ⚠️ Coordenadas ainda são placeholder — o Kevin precisa trocar pelos lugares reais. **Precisa internet.**
- **Linha do tempo** + **galeria de "skins"** (fotos duotone que coloriram no hover) + **LIGHTBOX**
  (clica na foto → versão grande + legenda, setas ‹ ›, ESC fecha).
- **Senha / lock:** resposta correta = **"galega"** (apelido de família do Ceará, do avô falecido dela —
  detalhe sentimental forte; pessoa favorita dela). `config.senha`.
- **Easter eggs de teclado** (`config.easterEggs`): digite `bela`, `burton`, `monster`, `tubarao`,
  `adore` em qualquer tela → chuva de emoji + legenda.
- **Carta typewriter**, cena de **respiro** antes do pedido, **contrato** (assina + baixa PDF via
  print / .txt), cena de **deploy/changelog**.
- **CRÉDITOS** estilo filme rolando (`config.creditos`) depois do deploy.

> A partir da **v2.2**, o "Sim" leva direto ao fluxo final (final → roadmap → contrato → deploy → créditos).
> Não há mais gravação em `localStorage`, estado pós-pedido nem URLs especiais (`?teste`/`?reliquia`/`?reset`).
> O botão "↻ rodar de novo" na cena de deploy faz um **reboot real**: fade pra preto (cor `--void`) +
> `location.reload()`, voltando ao estado inicial limpo (tela preta do terminal). Isso evita ter que
> resetar manualmente o estado de todas as cenas (contador, assinatura, botão "não" deslocado etc.).

---

## 7. Contexto pessoal (a alma do site — preserve nos textos)

- **Ela:** Letycia. Apelido **"galega"** (família do Ceará, especialmente o **avô falecido** — pessoa
  favorita dela; usado na senha e nos créditos). Também "princesa".
- **Ele:** Kevin. Eng. de Software, dev Java (por isso o frame todo de terminal/código). É a "parte 1"
  do contrato.
- **História:** se conheceram na **igreja em 2024** → **1º AvivaAmatus em 05/out** (dia que tudo mudou,
  começaram a conversar) → tempo separados, ele **esperou** → **dez/2025** decidiram tentar pra valer →
  hoje, o pedido oficial.
- **Coisas dela:** mar e **tubarões** (futura bióloga marinha), **dança** (ministério), **fotografia**,
  fala sem parar (recorrente nas piadas), **ciúmes "fofo"**, piada do **bíceps** dele. Curte **Harry
  Styles** ("Adore You" = a música), **Tim Burton**, **Monster High**, a **Bela** (A Bela e a Fera),
  **Charlie Brown Jr.**

Detalhes sentimentais entram **sutis**, embrulhados no frame técnico — nunca declarados de forma brega.

---

## 8. Pipeline de validação (rode SEMPRE antes de entregar)

1. `node --check js/config.js` e `node --check js/script.js` → sintaxe.
2. Confira que o bloco **`creditos`** existe e tem todas as subchaves da seção 5.
3. Confira que todo `id` de cena no array `scenes` tem uma `<section>` correspondente no HTML, e
   que o overlay `#lightbox` existe.
4. **Teste jsdom** (recomendado): carregar config+script num DOM falso e chamar `show()` em todas as
   cenas + abrir o lightbox. Deve dar **zero erros**. (jsdom já esteve instalado em
   `/home/claude`; o harness usado foi um `smoke.js` que injeta config/script inline com
   `runScripts:'dangerously'`, stub de canvas/áudio/timers, e navega por todas as cenas.)

Critério de pronto: node OK nos dois arquivos + bloco `creditos` completo + jsdom sem erros.

---

## 9. Pendências (o Kevin faz manualmente)

- **Músicas da playlist (NOVO v2.5):** colocar os `.mp3` em `assets/musicas/` com os nomes que estão
  em `config.playlist[].arquivo` (hoje: `adore-you.mp3`, `dona-do-pensamento.mp3`, `the-drug-in-me.mp3`,
  `nao-sei-viver.mp3`, `treat-you-better.mp3`). Pode adicionar/remover faixas livremente — a ORDEM da
  lista é a ordem de reprodução depois da escolha dela. Sem os arquivos, a tela de escolha aparece mas
  não toca som. (`assets/nossa-musica.mp3` segue como fallback se a playlist for esvaziada.)
- **Assets que faltam:** `assets/momento2.jpg` (foto do 1º AvivaAmatus).
- **Ingresso/Dunamis (v2.8 — QUASE fechado):** `CONFIG.ingresso.data` = `"29 · 08 · 2026"`,
  `lugar` = `"São Paulo/SP — em breve"`, `bonus` = FAST PASS. `CONFIG.dunamis.data` = `2026-08-29T20:00:00`.
  **Falta só 1 coisa:** quando confirmar o **local exato** do evento, trocar a `coord` do pino
  `tipo:"segredo"` em `CONFIG.mapa.pinos` (hoje num ponto central de SP) e, se quiser, refinar o texto
  `lugar` no `ingresso`. O pino já destrava sozinho ao revelar o ticket — não precisa mexer em lógica.
- **Coordenadas do mapa:** trocar os `[lat, lng]` placeholder em `config.mapa.pinos` pelos lugares reais
  (dica no comentário do próprio config: botão direito no Google Maps → "O que há aqui?").
- **Conferir** `config.contador.desde` (`"2024-10-05T00:00:00"`) — é a data que alimenta o "uptime".
- Havia uma `skin-foto1.jpg` extra ignorada; a usada é `skin-foto.jpg`.

---

## 10. Decisões já tomadas (NÃO refazer sem o Kevin pedir)

- **Removidos a pedido:** o dashboard "nós em números" e o terminal interativo (digitar comandos).
  Não readicione.
- **Removidos na v2.2 (a pedido):** o **MODO RELÍQUIA** e o easter egg **MAKING-OF** ("ficou estranho e
  não tão funcional"). Não readicione `reliquia` nem `makingOf` sem o Kevin pedir.
- **Workflow preferido:** features novas → primeiro um **preview HTML único, self-contained** pra ele
  aprovar → só depois portar pra estrutura multi-arquivo.
- **Edições incrementais** sobre o arquivo que ele enviar — não regenerar o projeto do zero.
- Paleta v2 (obsidiana/teal) foi a escolhida sobre a v1 (roxo/romântico-dev).

---

## 13. v2.4 — ✅ FEITO (referência) + o que ainda é MANUAL do Kevin

> Tudo abaixo (A–F) foi **implementado na v2.4**. Ficaram só estes itens manuais (precisam de você):
> 1. **Coordenadas reais dos pinos** do mapa — principalmente o **Show do Harry** (hoje placeholder).
>    Edite `CONFIG.mapa.pinos[].coord` (Google Maps → botão direito → "O que há aqui?").
> 2. **Contagem da Dunamis**: quando confirmar, ponha `CONFIG.dunamis.ativo = true` e a **data real**
>    em `CONFIG.dunamis.data` (a cena só aparece no fluxo quando `ativo` é true).
> 3. **Fotos novas**: jogar `assets/skin-pijama.jpg`, `assets/skin-show.jpg`, `assets/skin-date.jpg`
>    (sem elas, aparece o placeholder bonito). E os antigos pendentes: `assets/momento2.jpg`, `assets/nossa-musica.mp3`.
>
> Spec original (mantida só como referência do que foi pedido):

**A) Fundos que MUDAM por cena (e depois VOLTAM ao normal).**
Hoje o fundo é o mar em canvas que só "afunda" por cena (`depthFor`). O Kevin quer que **algumas cenas
troquem o clima do fundo** e depois volte ao mar normal nas demais:
- `lua` 🌙 → **noite**: céu índigo, **estrelinhas piscando**, **luz noturna**/glow lunar. (Caprichar MAIS aqui.)
- `girassol` 🌻 → **fundo dourado com pétalas caindo** (bem parecido com o protótipo).
- `reasons` (motivos) → também muda o fundo (sugestão: dourado/quente suave).
- `letter` (carta) → também muda (sugestão: clima de lua/índigo calmo).
- Todas as OUTRAS cenas → fundo normal (mar atual). Ao sair dessas, o clima volta sozinho.
- **Referência pronta:** o IIFE "fundo vivo" do protótipo **`preview-site-completo.html`** já tem o sistema
  de **pesos [mar, lua, ouro]** com lerp suave, estrelas (lua), pétalas + glow (ouro), raios (mar).
  Portar esse sistema pro site real e mapear os pesos por cena (ex.: lua=[0,1,0], girassol=[0,0,1],
  reasons=[0,.2,.8], letter=[.1,.7,.2], resto=[1,0,0]). Pode rodar como camada/2º canvas sobre o mar
  atual OU estender o mar atual pra blendar cor+partículas conforme o peso. Manter `prefers-reduced-motion`.

**B) Pinos no MAPA (`CONFIG.mapa.pinos`).** Adicionar pontos reais + de futuro:
- **Show do Harry Styles — 17/07** (pino de "futuro", estilo/cor diferente fica legal).
- Igreja onde se conheceram, **1º AvivaAmatus**, lugares de **date**.
- ⚠️ Kevin precisa fornecer as **coordenadas reais** (Google Maps → botão direito → "O que há aqui?").

**C) +3 FOTOS na GALERIA (`CONFIG.galeria`).** Acrescentar três versões/skins novas:
- **pijama**, **show**, **date**. Definir `label` + `verso` (piada) de cada, nomes de arquivo
  (ex.: `assets/skin-pijama.jpg`, `assets/skin-show.jpg`, `assets/skin-date.jpg`) e atualizar `assets/LEIA-ME.txt`.

**D) CONTAGEM REGRESSIVA — possível TOUR DA DUNAMIS** (NÃO confirmado ainda).
- Se rolar, criar um countdown regressivo até a data do evento (parecido com o contador, mas pra frente).
- **Aguardar Kevin confirmar a data** antes de fixar.
- Obs.: a contagem pro show do Harry foi **descartada** (ela só vê o site DEPOIS de 17/07).

**E) Cena RADAR / SONAR de tubarão** (ideia já aprovada — "pra depois").
- **Referência:** `preview-ideias.html`, **ideia 01** — radar em canvas que faz a varredura, acende
  blips-isca e **trava no alvo "você 🦈"** + legenda. Tema do mar dela (futura bióloga marinha).
- Portar como cena nova (provável posição: perto da galeria/lua, no "mundo dela"), com config própria
  (eyebrow/titulo/sub/botao/alvo/legenda/readout) — tudo em `config.js`.

**F) Limpeza combinada:** **remover os easter eggs de teclado** (`config.easterEggs` + lógica) — o Kevin
disse que não ficou funcional e não vão usar.

> Ordem sugerida por esforço: C (fotos) e B (pinos) são rápidos/config → F (limpar eggs) → A (fundos,
> reaproveitando o protótipo) → E (sonar) → D (countdown, só com a data confirmada).
