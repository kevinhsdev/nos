/* =====================================================================
   👉 CONTEÚDO EDITÁVEL (no projeto isso fica em js/config.js)
   ===================================================================== */
const CONFIG = {
  nome: "Letycia",
  apelido: "gatinha",
  musica: "assets/nossa-musica.mp3",

  // barrinha "now playing" (fallback, usada só se a 'playlist' abaixo estiver vazia)
  nowPlaying: { titulo: "Dona do meu pensamento", artista: "Charlie Brown Jr." },

  // --- PLAYLIST 🎵 ---------------------------------------------------------
  // Ela escolhe a 1ª música na tela de abertura; quando a faixa acaba, pula
  // sozinha pra próxima (e dá a volta no fim). Coloque os .mp3 em assets/musicas/
  // (sem base64). Se 'playlist' ficar vazia, o site usa 'musica' acima.
  playlist: [
    { arquivo:"assets/musicas/adore-you.mp3",           titulo:"Adore You",                 artista:"Harry Styles" },
    { arquivo:"assets/musicas/me-adora.mp3",            titulo:"Me Adora",                  artista:"Pitty" },
    { arquivo:"assets/musicas/all-of-me.mp3",           titulo:"All Of Me",                 artista:"Jhon Legend" },
    { arquivo:"assets/musicas/dona-do-pensamento.mp3",  titulo:"Dona do Meu Pensamento",    artista:"Charlie Brown Jr." },
    { arquivo:"assets/musicas/american-girls.mp3",      titulo:"American Girls",            artista:"Harry Styles" },
    { arquivo:"assets/musicas/perfect.mp3",             titulo:"Perfect",                   artista:"One Direction" },
    { arquivo:"assets/musicas/steal-my-girl.mp3",       titulo:"Steal My Girl",             artista:"One Direction" },
    { arquivo:"assets/musicas/monster.mp3",             titulo:"Monster",                   artista:"Shawn Mendes feat. Justin Bieber" },
    { arquivo:"assets/musicas/dandelions.mp3",          titulo:"Dandelions",                artista:"Ruth B." },
    { arquivo:"assets/musicas/those-eyes.mp3",          titulo:"Those Eyes",                artista:"New West" },
    { arquivo:"assets/musicas/fine-line.mp3",           titulo:"Fine Line",                 artista:"Harry Styles" },
    { arquivo:"assets/musicas/boo-york.mp3",            titulo:"Boo York, Boo York",        artista:"Monster High" },
    { arquivo:"assets/musicas/sunshine.mp3",            titulo:"Sunshine",                  artista:"Delacruz" },
    { arquivo:"assets/musicas/deserto.mp3",              titulo:"Deserto",                   artista:"Thaeme & Thiago" },
    { arquivo:"assets/musicas/boy-with-luv.mp3",        titulo:"Boy With Luv",              artista:"BTS feat. Halsey" },
    
    
  ],
  playlistConfig: { repetirTudo: true },   // true = nunca fica no silêncio (dá a volta na lista)

  // --- TELA DE ESCOLHER A MÚSICA (terminal, logo depois do boot) ---
  // Ela digita o número da faixa (ou clica) e o site já salta pro "oi princesa".
  picker: {
    host: "nós@kevin",                     // o "usuário" que aparece no prompt
    lsCmd: "ls ./trilha-sonora",
    intro: "{n} faixas encontradas · escolhe uma musica e relaxa 🎵",   // {n} = total
    playCmd: "play",                        // o comando de seleção: play <número>
    tocando: "▸ tocando:",
    carregando: "carregando nós/{faixa}...",
    invalida: "faixa inválida. digita um número de 1 a {n}."
  },

  bootSeq: [
    { type:'cmd', text:'npm create nós@latest' },
    { type:'out', html:'' },
    { type:'out', html:'<span class="q">?</span> nome do projeto · <span class="hl">letycia</span>' },
    { type:'out', html:'<span class="q">?</span> template ······· <span class="hl">› romance (default)</span>' },
    { type:'out', html:'<span class="q">?</span> inicializar git? <span class="hl">sim</span>' },
    { type:'out', html:'' },
    { type:'out', html:'criando estrutura em <span class="hl">./nós</span> ...' },
    { type:'out', html:'  <span class="ok">✔</span> src/historia.js' },
    { type:'out', html:'  <span class="ok">✔</span> src/motivos.json     <span class="dim">(* entradas)</span>' },
    { type:'out', html:'  <span class="ok">✔</span> src/skins/           <span class="dim">(99+ versões)</span>' },
    { type:'out', html:'  <span class="ok">✔</span> assets/tubarões/     🦈' },
    { type:'out', html:'  <span class="ok">✔</span> config/paciência.lock' },
    { type:'out', html:'' },
    { type:'out', html:'instalando dependências...' },
    { type:'out', html:'  <span class="ok">added</span> 2 anos, <span class="ok">0</span> arrays <span class="dim">in 1.8s</span>' },
    { type:'out', html:'' },
    { type:'out', html:'compilando arquivos............ <span class="ok">feito</span>' },
    { type:'out', html:'resolvendo bug na main......... <span class="ok">resolvido</span>' },
    { type:'out', html:'gerando build de produção......... <span class="ok">✔</span>' },
    { type:'out', html:'' },
    { type:'out', html:'  <span class="arrow">➜</span>  Local:   <span class="link">https://nós.exe/letycia</span>' },
    { type:'out', html:'  <span class="arrow">➜</span>  status:  <span class="ok">pronto pra rodar</span>' }
  ],

  helloTitle: "Oi, minha princesa.",
  helloText: "Eu sei, não é exatamente surpresa — e eu sei que demorei MUITO (pode reclamar depois, vai ser justo). Mas eu queria fazer isso do meu jeito. Então respira, para de falar por 30 segundos (sim, eu sei que é difícil pra você) e vê o projeto aí, que tive que gastar uns neurônios pra fazer...",

  contador: {
    desde: "2024-10-05T00:00:00",
    eyebrow: "uptime do nosso sistema",
    titulo: "A gente tá nessa há",
    legenda: "E esse contador não para... nem vai parar."
  },

  timeline: [
    { data:"2024 · NA IGREJA", titulo:"Onde a gente se conheceu", texto:"Acho que nem a gente sabe direito quando a gente se conheceu, mas com certeza, foi Deus que me apresentou você.", joke:"plot twist: Ia me enrolar durante 1 ano todo, pra finalmente ter algo", foto:"assets/momento1.jpg" },
    { data:"05 DE OUTUBRO · 1º AVIVAAMATUS", titulo:"O dia que tudo começou", texto:"A gente foi no Garagem, me pediu as fotos do culto e começamos a conversar no WhatsApp. Foi aí que eu me apaixonei por você — ou talvez antes, perdi a conta.", joke:"culpa da AvivaAmatus 🙏", foto:"assets/momento2.jpg" },
    { data:"O TEMPO NO MEIO", titulo:"Mesmo sendo muito insistente!", texto:"Não deu certo, mas não consegui te esquecer (nem se eu quisesse), e escolhi te esperar.", joke:"E esperaria muito mais...", foto:"assets/momento3.jpg" },
    { data:"DEZEMBRO / 2025", titulo:"Depois de MUITO tempo...", texto:"Mesmo com vários problemas, finalmente decidimos tentar", joke:"Se Deus me desse uma segunda chance naquele momento, eu faria tudo igual", foto:"assets/momento4.jpg" },
    { data:"HOJE", titulo:"E aqui estamos nós", texto:"Você faz qualquer momento ser incrível! E espero poder estar com você em todos eles...", joke:"Só falta uma coisinha né... 👀", foto:"assets/momento5.jpg" }
  ],

  // MAPA — ⚠️ AJUSTE as coordenadas [lat, lng] pros lugares REAIS de vocês
  // (dica: clica com o botão direito no Google Maps → "O que há aqui?" → copia os números)
  mapa: {
    eyebrow: "geo --nossos-lugares",
    titulo: "Os lugares que são nossos",
    legenda: "toca nos pinos pra reviver cada um.",
    centro: [-23.60, -46.60],
    zoom: 10,
    pinos: [
      { nome:"A igreja", coord:[-23.544155024074154, -46.356381389154954], nota:"onde a gente se conheceu — 2024 🙏" },
      { nome:"O Aquario", coord:[-23.593327842790167, -46.61405613333189], nota:"vimos os Sharks — 12/abr" },
      { nome:"Aonde a gente ta!", coord:[-23.5480, -46.6250], nota:"onde a gente se vê hoje 💛" },
      { nome:"O mar (em breve)", coord:[-23.9670, -46.3330], tipo:"futuro", nota:"teu lugar favorito — falta a gente ir 🦈" },
      // ⚠️ pinos de FUTURO (tipo:"futuro" = cor diferente). Troque as coords pelas reais:
      { nome:"Show do Harry Styles", coord:[-23.600978284480014, -46.720060862167294], tipo:"futuro", nota:"17/07 — nosso primeiro show juntos 🎤" },
      { nome:"nosso date em SP", coord:[-23.545740156662735, -46.63404133333358], nota:"a bebida falsa daquele bar bonitão..." },
      // 🔒 PINO-SEGREDO: aparece TRANCADO aqui e só destrava sozinho quando ela revela
      //    o ingresso lá no final. Quando confirmar o local exato do evento, troque a coord.
      {
        nome:"???",
        coord:[-23.5613, -46.6560],
        tipo:"segredo",
        nota:"🔒 tem um lugar aqui que você ainda vai descobrir… segura a curiosidade 👀",
        revelado:{
          nome:"Conferência Dunamis 🎟️",
          nota:"29 · 08 · 2026 · São Paulo/SP — era ISSO que estava trancado. a gente vai. 🔓"
        }
      }
    ],
    offline: "// mapa indisponível offline — abre com internet pra ver os pinos."
  },

  galeria: [
    { foto:"assets/skin-princesa.jpg", label:"modo princesinha 👑", verso:"Desde pequena, sempre foi uma princesa" },
    { foto:"assets/skin-rockeira.jpg", label:"modo vampira 🤘", verso:"Faz as maquiagens mais incriveis que eu já vi" },
    { foto:"assets/skin-cosplay.jpg",  label:"cosplay 🎨", verso:"a Draculaura aprovaria essa obra de arte" },
    { foto:"assets/skin-danca.jpg",    label:"ministério de dança 💃", verso:"impossível tirar os olhos" },
    { foto:"assets/skin-foto.jpg",     label:"a fotógrafa oficial 📸", verso:"Seus olhos são como câmeras que capturam a essência de cada momento" },
    { foto:"assets/skin-mar.jpg",      label:"futura bióloga marinha 🦈", verso:"tubarões > qualquer pessoa (eu aceito o 2º lugar)" },
    { foto:"assets/skin-pijama.jpg",   label:"modo pijama 🌙", verso:"fica em casa, limpa tudo, e ainda é a mais linda de pijama" },
    { foto:"assets/skin-show.jpg",     label:"modo show 🎤", verso:"Até que eu gostei do show desse mano..." },
    { foto:"assets/skin-date.jpg",     label:"modo date 💛", verso:"Sem duvidas a mais linda de todas" }
  ],

  motivos: [
    "o jeito que você NÃO para de falar (e eu nunca quero que pare)",
    "o ciúmes meio preocupante mas que eu acho muito fofo",
    "ser, sem dúvida, a melhor companhia que existe",
    "como você arrasa na dança e tira foto como ninguém",
    "você ser estudiosa e dedicada do jeito que tá se tornando",
    "sua paixão pelo mar e pelos tubarões 🦈 (minha futura bióloga marinha — ou psicologa, pedagoga, biomedica, ou sei lá o que você decidir: vou apoiar todas)",
    "e sim: eu sei que você só ta comigo pelo meu bíceps 💪"
  ],

  // CENA DA LUA 🌙 (a do colar dela)
  lua: {
    eyebrow: "a lua/ — o colar em G 🌙",
    titulo: "A Lua",
    texto: "Ela é a única coisa forte o bastante pra puxar o mar inteiro — todo dia, sem falhar, nenhuma uma vez. Você faz exatamente isso comigo. Não é à toa que ela vive no seu pescoço: vocês duas mandam na maré.",
    nota: "e mesmo nas fases mais escuras, ela continua ali. eu também."
  },

  // CENA DO GIRASSOL 🌻 (+ Van Gogh)
  girassol: {
    eyebrow: "girassol/ — e Van Gogh 🌻",
    titulo: "O Girassol",
    texto: "Ele passa o dia inteiro girando atrás do sol. O Van Gogh pintou um céu inteiro girando só pra expressar e caber o que sentia. Eu sou meio os dois: viro pra onde você está e nenhuma tela seria grande o bastante.",
    nota: "Apesar de eu sempre dizer que voce é o Sol, acho que você combina com os dois!"
  },

  // CENA SONAR/RADAR 🦈 (varre o oceano e trava em você)
  sonar: {
    eyebrow: "sonar --scan --alvo=você 🦈",
    titulo: "procurei no oceano inteiro",
    sub: "Como eu disse em uma festa junina... Dentre todas as pessoas no mundo, meus olhos sempre procuram você.",
    botao: "📡 escanear de novo",
    readout: [
      "&gt; iniciando varredura...",
      "&gt; profundidade: 500m · setor: nós/",
      "&gt; ignorando: 820 espécies",
      "&gt; 1 alvo encontrado ✓"
    ],
    alvo: "alvo: você 🦈",
    legenda: "de tudo que tem no mar, o sonar sempre para em você.",
    legendaSub: "distância: 1 km (ou menos)"
  },

  // CONTAGEM REGRESSIVA (ex.: tour da Dunamis) — ATIVA só quando 'ativo' = true e 'data' estiver certa
  dunamis: {
    ativo: true,                       // 👈 vira true quando confirmar que vão
    data: "2026-08-29T20:00:00",        // 👈 troque pela DATA REAL do evento
    eyebrow: "// próxima parada juntos",
    titulo: "contagem pra tour da Dunamis",
    legenda: "faltam só isso pra mais um capítulo nosso 🙌",
    esgotado: "é hoje! bora 🙌"
  },

  // FOTO em tela cheia (coloque assets/foto-destaque.jpg)
  fotoMomento: {
    foto: "assets/foto-destaque.jpg",
    sub: "meu frame favorito",
    legenda: "E no meio de tudo, é você."
  },

  senha: {
    pergunta: "Antes da última parte, preciso ter certeza que é você mesmo. 👀",
    desafio: "Qual o apelido que a sua família do Ceará, em especial o seu avô, sempre te deu?",
    placeholder: "digite aqui...",
    aceitas: ["galega"],
    dica: "dica: o apelido mais seu que existe (começa com \"G\") 💛",
    erro: "hmmm, não foi essa não. tenta de novo 😏",
    sucesso: "essa é a minha galega 💛"
  },

  turnTitle: "Brincadeiras à parte...",
  turnText: "Desde 2024 eu já sabia. A gente esperou, teve paciência, e hoje você é a melhor companhia da minha vida. Eu não quero mais isso sem nome — quero do jeito certo, oficial, com você sabendo o quanto eu tenho certeza.",

  versiculos: {
    eyebrow: "sobre esperar — e por quê",
    titulo: "Tem três que explicam melhor do que eu",
    intro: "Você sabe que eu não cito versículo à toa. Mas esses três contam a nossa história — tempo, espera e amor.",
    itens: [
      { ref:"Eclesiastes 3.1", texto:"Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.", nota:"tudo no tempo certo — até a gente." },
      { ref:"Colossenses 3.14", fav:true, favTag:"o favorito dela", texto:"E, sobre tudo isto, revesti-vos do amor, que é o vínculo da perfeição.", nota:"o amor que amarra todo o resto. esse é o nosso." },
      { ref:"Gênesis 29.20", texto:"Assim serviu Jacó sete anos por Raquel; e estes lhe pareceram como poucos dias, pelo muito que a amava.", nota:"Jacó esperou 7 anos por Raquel. eu esperaria de novo — quantos fossem." }
    ]
  },

  carta: {
    eyebrow: "carta.txt — escrevendo...",
    paragrafos: [
      "Letycia,",
      "Eu podia listar motivo por motivo, mas você já viu que não ia ter espaço.",
      "A real é simples: eu gosto de tudo. Do jeito que você fala sem parar, do ciúmes besta, das suas mil versões, da sua paixão pelo mar.",
      "Esperei, tive paciência, e faria tudo de novo — porque era por você.",
      "Então respira mais uma vez e lê a próxima tela com atenção. 💛"
    ]
  },

  // --- VOCÊ NUNCA VAI ESTAR SOZINHA (cena antes do pedido) ----------------
  // Mostra pra ela quanta gente a ama. Dois níveis:
  //  • destaques: card completo (foto + recado que digita + assinatura + ÁUDIO opcional)
  //  • mural: recado curto. foto é opcional (sem foto = mostra a inicial num círculo)
  // As PALAVRAS são de cada pessoa — colete e troque os textos [exemplo].
  // Tem áudio? aparece o player. Sem áudio? só o texto, e fica lindo igual.
  amada: {
    eyebrow: "você nunca vai estar sozinha",
    titulo: "Antes de eu te perguntar uma coisa...",
    intro: "Para de respirar fundo um segundo. Antes do que eu vou te perguntar, eu preciso que você veja uma coisa: não sou só eu que te ama. Olha quanta gente caminha com você.",
    muralLabel: "e ainda tem essa torcida toda",
    abrir: "carregar →",     // texto do botão quando o card está fechado
    aberto: "aberto 💛",     // texto quando já abriu
    destaques: [
      { nome:"Mãe", relacao:"mãe · desde o primeiro dia", foto:"assets/amada-mae.jpg",
        texto:"[exemplo — troque pelo recado REAL da mãe] Te ver feliz é tudo que eu sempre quis. E hoje eu vejo. Cuida bem dela por mim.",
        audio:"assets/vozes/mae.mp3", assinatura:"Mãe" },
      { nome:"Pai", relacao:"pai · o primeiro herói dela", foto:"assets/amada-pai.jpg",
        texto:"[exemplo — troque pelo recado REAL do pai] Minha menina cresceu. Eu confio nele, e isso não é pouca coisa.",
        audio:"assets/vozes/pai.mp3", assinatura:"Pai" },
      { nome:"Vô", relacao:"quem te chamou de galega primeiro", foto:"assets/amada-avo.jpg",
        texto:"[exemplo — homenagem, escreva com calma] Galega sempre foi a coisa mais preciosa dessa família.",
        audio:"", assinatura:"Vô" },
      { nome:"Ana Julia", relacao:"melhor amiga · 14 anos", foto:"assets/amada-ana.jpg",
        texto:"[exemplo — troque pelo recado REAL da Ana] Conheço ela desde sempre e nunca vi ela falar de alguém do jeito que ela fala de você. Mas cuida, que eu tô de olho 😌",
        audio:"assets/vozes/ana.mp3", assinatura:"Ana Julia" }
    ],
    mural: [
      { nome:"Sara",    grupo:"escola",  foto:"", quote:"[ex] minha dupla de sala — vocês combinam demais 🥹" },
      { nome:"Gean",    grupo:"escola",  foto:"", quote:"[ex] tava na hora, hein! finalmente kkk" },
      { nome:"Gabi",    grupo:"escola",  foto:"", quote:"[ex] cuida da minha amiga, viu? 💛" },
      { nome:"Emi",     grupo:"escola",  foto:"", quote:"[ex] vocês dois juntos é a coisa mais fofa" },
      { nome:"Sophia",  grupo:"de fora", foto:"", quote:"[ex] de longe dá pra ver o quanto ela te ama" },
      { nome:"Monique", grupo:"de fora", foto:"", quote:"[ex] felicidade total por vocês 🌻" },
      { nome:"Kauã",    grupo:"de fora", foto:"", quote:"[ex] parça, agora é oficial. sejam felizes!" },
      { nome:"Luis",    grupo:"antigos", foto:"", quote:"[ex] amiga de uma vida — você merece tudo" },
      { nome:"Pazete",  grupo:"antigos", foto:"", quote:"[ex] te conheço faz tempo e nunca te vi assim 💛" }
    ],
    tally: "{n} pessoas testemunham a mesma coisa: você é muito amada.",
    bridge: "Todas essas pessoas te amam. E agora eu quero ser mais um nome que nunca vai sair dessa lista. 💛"
  },

  respiro: { linha1:"respira.", linha2:"tem uma pergunta chegando." },

  commitLine: "$ git commit -m \"finalmente fazendo isso direito\"",
  askTitle: "Quer namorar comigo?",
  askSub: "(aviso: o botão \"não\" foge 👀)",
  noLabels: ["não","tem certeza?","e o bíceps? 💪","e os tubarões? 🦈","pensa de novo","sério mesmo?","eu sou só sua irritância favorita 😎","o Sim é logo ali →","não vou deixar kkk"],

  finalBig: "<span class=\"grad\">FINALMENTE!</span> 🎉",
  finalHand: "valeu por esperar comigo desde 2024, minha galega 💛",
  finalCommit: "// commit 1 de muitos. status: oficial e feliz demais.",

  // ROADMAP — planos futuros como versões
  roadmap: {
    eyebrow: "roadmap.md — próximas releases",
    titulo: "O que eu quero buildar com você",
    itens: [
      { v:"v1.1", t:"as primeiras viagens", d:"ver o mar de verdade com você, não só no papel de parede." },
      { v:"v1.5", t:"mais madrugadas conversando", d:"você falando sem parar, eu sem querer nunca que pare." },
      { v:"v2.0", t:"um lugar nosso", d:"com espaço pra tubarão de pelúcia e pra tuas mil skins." },
      { v:"v3.0", t:"o resto", d:"teus sonhos, os meus — a gente vai descobrindo o backlog juntos." }
    ],
    legenda: "backlog infinito. sem deadline, só certeza."
  },

  // INGRESSO surpresa (a Dunamis aparece como uma "passagem" lacrada que ela revela).
  // Os campos data/lugar são placeholders — troque quando confirmar (pode usar a mesma
  // data de CONFIG.dunamis.data). A cena entra no fluxo entre o roadmap e a contagem.
  ingresso: {
    eyebrow: "acesso liberado — surpresa",
    titulo: "Ah… e ainda tem isso aqui",
    sub: "Um detalhe que você não fazia ideia.",
    kicker: "conferência · você + eu",
    evento: "DUNAMIS",
    tagline: "o lugar onde tudo começa a fazer sentido",
    data: "29 · 08 · 2026",     // 👈 São Paulo/SP — data confirmada
    lugar: "São Paulo/SP — em breve",   // 👈 local exato a confirmar
    lugares: "fileira ∞",
    admite: "admite 2",
    // 🎟️ BÔNUS que você comprou (aparece destacado quando o ticket é revelado). Deixe "" pra esconder.
    bonus: "FAST PASS · entramos 1h antes — e ainda vemos a passagem de som 🎶",
    carimbo: "CONFIRMADO",
    lacrado: "🔒 ainda lacrado — toca pra revelar",
    revelar: "revelar surpresa →",
    revelado: "é isso mesmo 💛",
    rodape: "você não sabia. mas a gente vai — juntos. 🎟️"
  },

  contrato: {
    eyebrow: "contrato_de_namoro.pdf",
    titulo: "Contrato de Namoro v1.0",
    intro: "Pelo presente instrumento, as partes abaixo firmam, em caráter oficial, o namoro:",
    parte1: "Kevin",
    clausulas: [
      "Aturar (e amar) todas as skins: princesa, rockeira, cosplay e o que vier.",
      "Respeitar a paixão inegociável pelos tubarões 🦈.",
      "Direito garantido de falar sem parar, por tempo indeterminado.",
      "Ciúmes besta é permitido (e oficialmente considerado fofo).",
      "O bíceps é cláusula pétrea. 💪",
      "Apoiar os sonhos um do outro, seja bióloga marinha ou o que ela decidir."
    ],
    botaoAssinar: "✍️ Assinar",
    jaAssinado: "assinado com amor 💛",
    botaoPdf: "⬇️ Baixar PDF",
    botaoTxt: "baixar .txt",
    rodape: "Vigência: pra sempre. Renovação automática, diária e inegociável."
  },

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
      '+ apelido "minha galega" desbloqueado',
      '+ ciúmes besta marcado como feature, não bug',
      '+ suporte vitalício a tubarões 🦈',
      '+ easter eggs: digite o nome de algo que ela ama 👀',
      '- removido: a parte de esperar',
      '',
      '<span class="ok">sistema rodando. status: oficial e feliz demais. 💛</span>'
    ]
  },

  // CRÉDITOS finais (rolam estilo filme depois do deploy)
  creditos: {
    eyebrow: "// rolando os créditos",
    voltar: "← voltar",
    titulo: "nós.exe",
    sub: "uma produção independente, sem orçamento, com todo o afeto",
    linhas: [
      { papel:"Direção", nome:"Kevin" },
      { papel:"Estrela", nome:"Letycia (a única)" },
      { papel:"Roteiro", nome:"2 anos de história" },
      { papel:"Trilha sonora", nome:"Playlist exclusiva" },
      { papel:"Locações", nome:"Igreja · Aquário · Mirante de SP · Morumbi · Hospedagem Atual" },
      { papel:"Efeitos especiais", nome:"Bíceps 💪" },
      { papel:"Departamento de ciúmes", nome:"Letycia (trabalho impecável)" },
      { papel:"Consultoria marinha", nome:"Tubarões 🦈" },
      { papel:"Agradecimento especial", nome:"o seu avô 💛" }
    ],
    fim: "feito à mão (a código), com amor, só pra você."
  }
};
