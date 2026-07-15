/* =============================================================================
   nós.exe — ARQUIVO DE CONTEÚDO
   -----------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para tornar o projeto seu.
   Toda a lógica vive em js/script.js — não mexa lá a menos que queira mudar
   o comportamento das cenas.

   ⚠️  TUDO abaixo é conteúdo de DEMONSTRAÇÃO, com pessoas, datas, lugares e
       fotos FICTÍCIOS. Nada aqui é real. Troque por sua própria história.

   Convenções:
     • {nome}  → é substituído automaticamente por CONFIG.nome
     • {n}     → é substituído pela contagem do bloco (faixas, pessoas, etc.)
     • Campos com "" (string vazia) ou [] simplesmente somem da tela.
     • Toda imagem tem fallback: se o arquivo não existir, aparece um
       placeholder bonitinho no lugar — o site nunca quebra.
   ========================================================================== */

const CONFIG = {

  /* --- IDENTIDADE DO PROJETO ---------------------------------------------- */
  app: {
    titulo: "nós.exe",       // aparece na aba do navegador e na barra de status
    build: "1.0.0"           // só cosmético, aparece na barra de status
  },

  nome: "Nina",              // quem vai receber (exemplo fictício)
  apelido: "estrela",        // apelido carinhoso usado em algumas telas
  autor: "Léo",              // quem está fazendo (exemplo fictício)

  /* --- TRILHA SONORA ------------------------------------------------------- */
  // Fallback: usado apenas se a 'playlist' abaixo estiver vazia.
  musica: "assets/musicas/faixa-01.mp3",
  nowPlaying: { titulo: "Faixa de exemplo", artista: "Artista Exemplo" },

  // A pessoa escolhe a 1ª faixa na tela de terminal, e o player pula sozinho
  // para a próxima quando a música acaba. Coloque os .mp3 em assets/musicas/.
  // ⚠️ Não versione músicas com direitos autorais em repositório público.
  playlist: [
    { arquivo: "assets/musicas/faixa-01.mp3", titulo: "Faixa de exemplo 01", artista: "Artista Exemplo" },
    { arquivo: "assets/musicas/faixa-02.mp3", titulo: "Faixa de exemplo 02", artista: "Artista Exemplo" },
    { arquivo: "assets/musicas/faixa-03.mp3", titulo: "Faixa de exemplo 03", artista: "Artista Exemplo" },
    { arquivo: "assets/musicas/faixa-04.mp3", titulo: "Faixa de exemplo 04", artista: "Artista Exemplo" },
    { arquivo: "assets/musicas/faixa-05.mp3", titulo: "Faixa de exemplo 05", artista: "Artista Exemplo" }
  ],
  playlistConfig: { repetirTudo: true },   // true = a lista dá a volta, nunca fica em silêncio

  /* --- CENA 02 · TERMINAL DE ESCOLHA DA MÚSICA ----------------------------- */
  picker: {
    host: "nós@voce",                    // o "usuário" do prompt: voce@maquina
    lsCmd: "ls ./trilha-sonora",
    intro: "{n} faixas encontradas · escolhe uma e relaxa 🎵",
    playCmd: "play",                     // comando de seleção: play <número>
    tocando: "▸ tocando:",
    carregando: "carregando nós/inicio...",
    invalida: "faixa inválida. digita um número de 1 a {n}."
  },

  /* --- CENA 01 · BOOT (o terminal fake da abertura) ------------------------ */
  bootSeq: [
    { type: 'cmd', text: 'npm create nós@latest' },
    { type: 'out', html: '' },
    { type: 'out', html: '<span class="q">?</span> nome do projeto · <span class="hl">nós</span>' },
    { type: 'out', html: '<span class="q">?</span> template ······· <span class="hl">› romance (default)</span>' },
    { type: 'out', html: '<span class="q">?</span> inicializar git? <span class="hl">sim</span>' },
    { type: 'out', html: '' },
    { type: 'out', html: 'criando estrutura em <span class="hl">./nós</span> ...' },
    { type: 'out', html: '  <span class="ok">✔</span> src/historia.js' },
    { type: 'out', html: '  <span class="ok">✔</span> src/motivos.json     <span class="dim">(* entradas)</span>' },
    { type: 'out', html: '  <span class="ok">✔</span> src/versoes/         <span class="dim">(99+ versões)</span>' },
    { type: 'out', html: '  <span class="ok">✔</span> config/paciencia.lock' },
    { type: 'out', html: '' },
    { type: 'out', html: 'instalando dependências...' },
    { type: 'out', html: '  <span class="ok">added</span> 2 anos, <span class="ok">0</span> arrependimentos <span class="dim">in 1.8s</span>' },
    { type: 'out', html: '' },
    { type: 'out', html: 'compilando arquivos............ <span class="ok">feito</span>' },
    { type: 'out', html: 'resolvendo bug na main......... <span class="ok">resolvido</span>' },
    { type: 'out', html: 'gerando build de produção...... <span class="ok">✔</span>' },
    { type: 'out', html: '' },
    { type: 'out', html: '  <span class="arrow">➜</span>  Local:   <span class="link">https://nós.exe/inicio</span>' },
    { type: 'out', html: '  <span class="arrow">➜</span>  status:  <span class="ok">pronto pra rodar</span>' }
  ],

  /* --- CENA 03 · ABERTURA -------------------------------------------------- */
  helloEyebrow: "build 1.0.0 — compilado só pra você",
  helloTitle: "Oi, {nome}.",
  helloText: "Isso aqui não é um site — é um bilhete que aprendeu a rodar no navegador. Respira, deixa a música tocar e vem comigo até o final. Prometo que vale.",

  /* --- CENA 04 · LINHA DO TEMPO -------------------------------------------- */
  timelineEyebrow: "nosso.log — a história",
  timeline: [
    { data: "PRIMEIRO CAPÍTULO", titulo: "Onde tudo começou",  texto: "Descreva aqui o dia em que vocês se conheceram — o lugar, o clima, o detalhe bobo que ficou.", joke: "spoiler: ninguém fazia ideia do que vinha 👀", foto: "assets/momento-01.jpg" },
    { data: "O TEMPO NO MEIO",   titulo: "A parte devagar",    texto: "Nem toda história é uma linha reta. Conte a espera, os quase, as conversas que não acabavam.", joke: "commit rejeitado, branch mantida 🌱", foto: "assets/momento-02.jpg" },
    { data: "A VIRADA",          titulo: "Quando fez sentido", texto: "Aquele momento em que a ficha caiu. Você sabe qual é.", joke: "merge conflict resolvido ✅", foto: "assets/momento-03.jpg" },
    { data: "HOJE",              titulo: "E aqui estamos",     texto: "O agora — e por que ele é o melhor capítulo até agora.", joke: "só falta uma coisinha, né... 👀", foto: "assets/momento-04.jpg" }
  ],

  /* --- CENA 05 · MAPA ------------------------------------------------------
     Coordenadas [latitude, longitude]. Para pegar as suas:
     Google Maps → clique com o botão direito no ponto → copie os números.
     Os pontos abaixo são pontos turísticos públicos, só de exemplo.
       tipo:"futuro"  → pino âmbar (um lugar aonde vocês ainda vão)
       tipo:"segredo" → pino trancado 🔒 que só se revela na cena do ingresso
  -------------------------------------------------------------------------- */
  mapa: {
    eyebrow: "geo --nossos-lugares",
    titulo: "Os lugares que são nossos",
    legenda: "toca nos pinos pra reviver cada um.",
    centro: [-23.58, -46.64],
    zoom: 12,
    pinos: [
      { nome: "Onde a gente se conheceu", coord: [-23.5613, -46.6565], nota: "o começo de tudo — [exemplo]" },
      { nome: "Nosso primeiro encontro",  coord: [-23.5874, -46.6576], nota: "aquele café que virou três horas ☕ [exemplo]" },
      { nome: "O lugar de sempre",        coord: [-23.5475, -46.6361], nota: "onde a gente se vê hoje 💛 [exemplo]" },
      { nome: "A viagem (em breve)",      coord: [-23.9608, -46.3336], tipo: "futuro", nota: "ainda não fomos — mas vamos 🌊 [exemplo]" },
      {
        nome: "???",
        coord: [-23.5955, -46.6844],
        tipo: "segredo",
        nota: "🔒 tem um lugar aqui que você ainda vai descobrir… segura a curiosidade 👀",
        revelado: {
          nome: "A surpresa 🎟️",
          nota: "era ISSO que estava trancado. a gente vai. 🔓 [exemplo]"
        }
      }
    ],
    offline: "// mapa indisponível offline — abre com internet pra ver os pinos."
  },

  /* --- CENA 06 · CONTADOR -------------------------------------------------- */
  contador: {
    desde: "2024-03-15T00:00:00",        // data de início (formato ISO)
    eyebrow: "uptime do nosso sistema",
    titulo: "A gente tá nessa há",
    legenda: "E esse contador não para... nem vai parar."
  },

  /* --- CENA 07 · GALERIA (polaroids que viram no clique) ------------------- */
  galeriaInfo: {
    eyebrow: "suas_versões/ — e eu gosto de todas",
    titulo: "As mil versões de você",
    texto: "Cada foto é uma versão diferente da mesma pessoa favorita. Eu nunca sei qual vem amanhã — e é por isso que nunca fica chato.",
    dica: "toca nas fotos pra virar 👆"
  },
  galeria: [
    { foto: "assets/versao-01.jpg", label: "modo domingo 🛋️", verso: "[exemplo] o silêncio confortável — esse é o meu favorito" },
    { foto: "assets/versao-02.jpg", label: "modo festa 🎧",   verso: "[exemplo] a pessoa mais animada de qualquer lugar" },
    { foto: "assets/versao-03.jpg", label: "modo trabalho 💻", verso: "[exemplo] concentrada, e ainda assim impossível de ignorar" },
    { foto: "assets/versao-04.jpg", label: "modo viagem ✈️",  verso: "[exemplo] o mundo fica melhor quando você aponta pra ele" },
    { foto: "assets/versao-05.jpg", label: "modo risada 😂",   verso: "[exemplo] eu conto piada ruim só pra ver isso acontecer" },
    { foto: "assets/versao-06.jpg", label: "modo date 💛",     verso: "[exemplo] sem dúvida a mais bonita de todas" }
  ],

  /* --- CENA 08 · SONAR (varre o oceano e trava em você) -------------------- */
  sonar: {
    eyebrow: "sonar --scan --alvo=você",
    titulo: "procurei no oceano inteiro",
    sub: "Dentre todas as pessoas do mundo, meus olhos sempre procuram a mesma.",
    botao: "📡 escanear de novo",
    readout: [
      "&gt; iniciando varredura...",
      "&gt; profundidade: 500m · setor: nós/",
      "&gt; ignorando: 820 espécies",
      "&gt; 1 alvo encontrado ✓"
    ],
    alvo: "alvo: você",
    legenda: "de tudo que tem no mar, o sonar sempre para em você.",
    legendaSub: "distância: 1 km (ou menos)"
  },

  /* --- CENA 09 · A LUA ----------------------------------------------------- */
  lua: {
    eyebrow: "a lua/ 🌙",
    titulo: "A Lua",
    texto: "Ela é a única coisa forte o bastante pra puxar o mar inteiro — todo dia, sem falhar, nenhuma vez. Você faz exatamente isso comigo.",
    nota: "e mesmo nas fases mais escuras, ela continua ali. eu também."
  },

  /* --- CENA 10 · O GIRASSOL ------------------------------------------------ */
  girassol: {
    eyebrow: "girassol/ 🌻",
    titulo: "O Girassol",
    texto: "Ele passa o dia inteiro girando atrás do sol. Eu sou meio assim: viro pra onde você está, sem nem perceber que virei.",
    nota: "e não, não é escolha. é biologia."
  },

  /* --- CENA 11 · MOTIVOS (aparecem um a um, escritos à mão) ---------------- */
  motivosInfo: {
    eyebrow: "por_que_você.txt — escrito à mão",
    titulo: "uns motivos (não couberam todos)"
  },
  motivos: [
    "[exemplo] o jeito que você não para de falar — e eu nunca quero que pare",
    "[exemplo] ser, sem dúvida, a melhor companhia que existe",
    "[exemplo] a teimosia que você chama de 'ter razão'",
    "[exemplo] como você fica quando fala do que ama",
    "[exemplo] o silêncio confortável — o teste que quase ninguém passa"
  ],

  /* --- CENA 12 · SENHA (só quem sabe passa) --------------------------------
     'aceitas' é uma lista: qualquer uma das respostas destrava.
     A comparação ignora maiúsculas e acentos.
  -------------------------------------------------------------------------- */
  senha: {
    eyebrow: "acesso_restrito 🔒",
    pergunta: "Antes da última parte, preciso ter certeza que é você mesmo. 👀",
    desafio: "[exemplo] Qual é a flor que eu sempre te dou?",
    placeholder: "digite aqui...",
    aceitas: ["girassol", "girassóis"],
    dica: "dica: amarela, gira atrás do sol 🌻",
    erro: "hmmm, não foi essa não. tenta de novo 😏",
    sucesso: "é você mesmo 💛"
  },

  /* --- CENA 13 · FOTO EM TELA CHEIA ---------------------------------------- */
  fotoMomento: {
    foto: "assets/foto-destaque.jpg",
    sub: "meu frame favorito",
    legenda: "E no meio de tudo, é você."
  },

  /* --- CENA 14 · A VIRADA (fim das brincadeiras) --------------------------- */
  turnEyebrow: "fim das brincadeiras",
  turnTitle: "Brincadeiras à parte...",
  turnText: "A gente esperou, teve paciência, e hoje você é a melhor companhia da minha vida. Eu não quero mais isso sem nome — quero do jeito certo, oficial, com você sabendo o quanto eu tenho certeza.",

  /* --- CENA 15 · CITAÇÕES (opcional — deixe itens: [] pra pular) -----------
     Serve pra versículos, trechos de música, poemas, frases de filme...
  -------------------------------------------------------------------------- */
  versiculos: {
    eyebrow: "sobre esperar — e por quê",
    titulo: "Tem três frases que explicam melhor do que eu",
    intro: "Você sabe que eu não cito frase à toa. Mas essas três contam a nossa história: tempo, espera e amor.",
    itens: [
      { ref: "[exemplo] Fonte 1", texto: "Coloque aqui uma frase, um verso ou um trecho que tenha significado pra vocês dois.", nota: "por que essa importa." },
      { ref: "[exemplo] Fonte 2", fav: true, favTag: "o favorito dela", texto: "Uma segunda frase — essa é marcada como favorita e ganha destaque na tela.", nota: "a que ela sempre repete." },
      { ref: "[exemplo] Fonte 3", texto: "E uma terceira, pra fechar a ideia.", nota: "o fechamento." }
    ]
  },

  /* --- CENA 16 · A CARTA (digita sozinha, parágrafo por parágrafo) --------- */
  carta: {
    eyebrow: "carta.txt — escrevendo...",
    paragrafos: [
      "{nome},",
      "[exemplo] Eu podia listar motivo por motivo, mas você já viu que não ia ter espaço.",
      "[exemplo] A real é simples: eu gosto de tudo. Do jeito que você fala sem parar, da sua teimosia, das suas mil versões.",
      "[exemplo] Esperei, tive paciência, e faria tudo de novo — porque era por você.",
      "[exemplo] Então respira mais uma vez e lê a próxima tela com atenção. 💛"
    ]
  },

  /* --- CENA 17 · VOCÊ NÃO ESTÁ SOZINHA ------------------------------------
     Mostra quanta gente ama essa pessoa. Dois níveis:
       • destaques → card completo (foto + recado que digita + assinatura + áudio opcional)
       • mural     → recado curto. Sem foto = mostra a inicial num círculo.
     ⚠️ As palavras devem ser de cada pessoa. Colete os recados de verdade.
     ⚠️ Nunca publique fotos, vozes ou nomes de terceiros sem permissão.
  -------------------------------------------------------------------------- */
  amada: {
    eyebrow: "você nunca vai estar sozinha",
    titulo: "Antes de eu te perguntar uma coisa...",
    intro: "Para de respirar fundo um segundo. Antes do que eu vou te perguntar, eu preciso que você veja uma coisa: não sou só eu. Olha quanta gente caminha com você.",
    muralLabel: "e ainda tem essa torcida toda",
    abrir: "carregar →",
    aberto: "aberto 💛",
    destaques: [
      { nome: "Pessoa Exemplo", relacao: "melhor amiga · desde sempre", foto: "assets/pessoa-01.jpg",
        texto: "[exemplo — troque pelo recado REAL] Conheço ela desde sempre e nunca vi ela falar de alguém do jeito que ela fala de você. Mas cuida, que eu tô de olho 😌",
        audio: "", assinatura: "Pessoa Exemplo" }
    ],
    mural: [
      { nome: "Alê",   grupo: "escola",   foto: "", quote: "[exemplo] minha dupla de sala — vocês combinam demais 🥹" },
      { nome: "Bruno", grupo: "escola",   foto: "", quote: "[exemplo] tava na hora, hein! finalmente kkk" },
      { nome: "Cami",  grupo: "trabalho", foto: "", quote: "[exemplo] cuida dela, viu? 💛" },
      { nome: "Dani",  grupo: "trabalho", foto: "", quote: "[exemplo] vocês dois juntos é a coisa mais fofa" },
      { nome: "Edu",   grupo: "antigos",  foto: "", quote: "[exemplo] amigo de uma vida — você merece tudo" },
      { nome: "Fê",    grupo: "antigos",  foto: "", quote: "[exemplo] te conheço faz tempo e nunca te vi assim 💛" }
    ],
    tally: "{n} pessoas testemunham a mesma coisa: você é muito amada.",
    bridge: "Todas essas pessoas te amam. E agora eu quero ser mais um nome que nunca vai sair dessa lista. 💛"
  },

  /* --- CENA 18 · O RESPIRO ------------------------------------------------- */
  respiro: { linha1: "respira.", linha2: "tem uma pergunta chegando.", botao: "ok, tô pronta →" },

  /* --- CENA 19 · O PEDIDO -------------------------------------------------- */
  commitLine: "$ git commit -m \"se não for tarde demais\"",
  askTitle: "Quer namorar comigo?",
  askSub: "(aviso: o botão não foge... 👀)",
  yesLabel: "Sim 💛",
  // O botão "não" foge do cursor e troca de texto a cada tentativa:
  noLabels: ["não", "tem certeza?", "pensa de novo", "sério mesmo?", "o Sim é logo ali →", "não vou deixar kkk"],

  /* --- CENA 20 · O FINAL --------------------------------------------------- */
  finalBig: "<span class=\"grad\">FINALMENTE!</span> 🎉",
  finalHand: "valeu por esperar comigo, {nome} 💛",
  finalCommit: "// commit 1 de muitos. status: oficial e feliz demais.",

  /* --- CENA 21 · ROADMAP (planos como versões de software) ----------------- */
  roadmap: {
    eyebrow: "roadmap.md — próximas releases",
    titulo: "O que eu quero construir com você",
    itens: [
      { v: "v1.1", t: "[exemplo] as primeiras viagens", d: "ver o mar de verdade, não só no papel de parede." },
      { v: "v1.5", t: "[exemplo] mais shows juntos",     d: "ver todo mundo que a gente só ouviu no fone." },
      { v: "v2.0", t: "[exemplo] um lugar nosso",        d: "com espaço pras suas mil versões." },
      { v: "v3.0", t: "[exemplo] o resto",               d: "teus sonhos, os meus — a gente descobre o backlog juntos." }
    ],
    legenda: "backlog---------sem deadline..."
  },

  /* --- CENA 22 · O INGRESSO (a surpresa lacrada) ---------------------------
     Aparece como uma passagem selada que a pessoa revela no toque. Ao revelar,
     o pino 🔒 lá do mapa destrava sozinho. Deixe bonus:"" pra esconder a faixa.
  -------------------------------------------------------------------------- */
  ingresso: {
    eyebrow: "acesso liberado — surpresa",
    titulo: "Ah… e ainda tem isso aqui",
    sub: "Lembra do lugar que tava com cadeado no mapa?",
    kicker: "[exemplo] você + eu",
    evento: "SURPRESA",
    tagline: "[exemplo] o nome do show, da viagem ou do evento vai aqui",
    data: "31 · 12 · 2026",
    lugar: "Local a confirmar",
    admite: "admite 2",
    bonus: "[exemplo] BÔNUS · a gente entra 1h antes 🎶",
    carimbo: "CONFIRMADO",
    lacrado: "🔒 ainda lacrado — toca pra revelar",
    revelar: "revelar surpresa →",
    revelado: "Só se você quiser...",
    rodape: "você não sabia. mas a gente vai — juntos. 🎟️"
  },

  /* --- CENA 23 · CONTAGEM REGRESSIVA --------------------------------------
     Cena OPCIONAL: só entra no fluxo quando ativo: true.
  -------------------------------------------------------------------------- */
  evento: {
    ativo: true,
    data: "2026-12-31T20:00:00",          // data real do evento (ISO)
    eyebrow: "// próxima parada juntos",
    titulo: "Contagem pra nossa surpresa...",
    legenda: "falta só isso pra mais um capítulo nosso 🙌",
    esgotado: "é hoje! bora 🙌"
  },

  /* --- CENA 24 · CONTRATO (assina e baixa em PDF/TXT) ---------------------- */
  contrato: {
    eyebrow: "contrato_de_namoro.pdf",
    titulo: "Contrato de Namoro v1.0",
    intro: "Pelo presente instrumento, as partes abaixo firmam, em caráter oficial, o namoro:",
    parte1: "Léo",                        // parte 2 é sempre CONFIG.nome
    clausulas: [
      "[exemplo] Aturar (e amar) todas as versões: domingo, festa, viagem e o que vier.",
      "[exemplo] Direito garantido de falar sem parar, por tempo indeterminado.",
      "[exemplo] Ciúmes besta é permitido (e oficialmente considerado fofo).",
      "[exemplo] Apoiar os sonhos um do outro, sejam quais forem.",
      "[exemplo] Brigar de fome não conta como briga."
    ],
    botaoAssinar: "✍️ Assinar",
    jaAssinado: "assinado com amor 💛",
    botaoPdf: "⬇️ Baixar PDF",
    botaoTxt: "baixar .txt",
    rodape: "Vigência: pra sempre. Renovação automática, diária e inegociável."
  },

  /* --- CENA 25 · DEPLOY (o changelog do relacionamento) -------------------- */
  deploy: {
    eyebrow: "pós-assinatura",
    linhas: [
      '<span class="com">$ git add nós && git commit -m "oficial"</span>',
      '<span class="ok">1 relacionamento alterado, 0 dúvidas.</span>',
      '<span class="com">$ git push origin pra-sempre</span>',
      'enviando objetos: 100% <span class="ok">feito.</span>',
      'rodando testes................. <span class="ok">passou</span>',
      '<span class="ok">deploy: sucesso ✓</span>',
      '',
      '<span class="warn">CHANGELOG v1.1</span>',
      '+ status oficial habilitado',
      '+ ciúmes besta marcado como feature, não bug',
      '+ suporte vitalício a piadas ruins',
      '- removido: a parte de esperar',
      '',
      '<span class="ok">sistema rodando. status: oficial e feliz demais. 💛</span>'
    ]
  },

  /* --- CENA 26 · CRÉDITOS (rolam estilo filme) ----------------------------- */
  creditos: {
    eyebrow: "// rolando os créditos",
    voltar: "← voltar",
    titulo: "nós.exe",
    sub: "uma produção independente, sem orçamento, com todo o afeto",
    linhas: [
      { papel: "Direção",                 nome: "[exemplo] Léo" },
      { papel: "Estrela",                 nome: "[exemplo] Nina (a única)" },
      { papel: "Roteiro",                 nome: "[exemplo] 2 anos de história" },
      { papel: "Trilha sonora",           nome: "[exemplo] Playlist exclusiva" },
      { papel: "Locações",                nome: "[exemplo] a cidade inteira" },
      { papel: "Efeitos especiais",       nome: "[exemplo] piadas ruins" },
      { papel: "Agradecimento especial",  nome: "[exemplo] quem torceu desde o começo 💛" }
    ],
    fim: "feito à mão (a código), com amor, só pra você."
  }
};
