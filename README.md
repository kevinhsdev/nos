<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=200&color=gradient&customColorList=6,11,20&text=n%C3%B3s.exe%20v2&fontColor=fff&fontSize=38&fontAlignY=35&desc=Um%20pedido%20de%20namoro%20que%20roda%20no%20seu%20navegador&descAlignY=55&descSize=16"/>

<img src="https://skillicons.dev/icons?i=html,css,javascript,git,github,vscode" />

[![Status](https://img.shields.io/badge/status-pronto%20pra%20rodar-93c572?style=for-the-badge)]()
[![Cenas](https://img.shields.io/badge/cenas-26-f2b25c?style=for-the-badge)]()
[![Build](https://img.shields.io/badge/build-nenhum-fd5e53?style=for-the-badge)]()

<br/>

> 26 cenas, feito à mão em **HTML, CSS e JavaScript puro**.
> Sem framework, sem build, sem backend.
> São Paulo — 2026

</div>

---

<p align="center">
  <img alt="sem dependências" src="https://img.shields.io/badge/dependências-0-4fd6c2?style=flat-square">
  <img alt="vanilla js" src="https://img.shields.io/badge/vanilla-JS-f2b25c?style=flat-square">
  <img alt="licença MIT" src="https://img.shields.io/badge/licença-MIT-f3eee7?style=flat-square">
  <img alt="GitHub Pages" src="https://img.shields.io/badge/deploy-GitHub%20Pages-4fd6c2?style=flat-square">
</p>

---

## O que é isso

Um site de uma página só que conta uma história do começo ao fim e termina numa pergunta.

O visual inicial de terminal/dev é só o sotaque de quem escreveu. O conteúdo é totalmente de quem vai receber.

> **Tudo neste repositório é conteúdo de demonstração fictício.** Nomes, datas, lugares, fotos e mensagens são exemplos. A ideia é que você troque tudo por sua própria história — em um único arquivo.

## Rodando

Não tem build. Não tem `npm install` obrigatório. É só servir a pasta:

```bash
git clone https://github.com/SEU-USUARIO/nos-exe.git
cd nos-exe

# qualquer servidor estático serve
python3 -m http.server 8080
# → http://localhost:8080
```

> Abrir o `index.html` com dois cliques quase funciona, mas o navegador bloqueia alguns recursos em `file://`. Use um servidor local.

### Publicando no GitHub Pages

1. Suba o repositório.
2. **Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`**.
3. Pronto. O arquivo `.nojekyll` já está aí para o Pages não engolir nada.

## Personalizando

Você vai mexer em **um arquivo**: [`js/config.js`](js/config.js).

Ele é o único lugar com texto, fotos, datas e coordenadas. O `js/script.js` só lê o config e desenha. Está inteiro comentado, cena por cena, na ordem em que aparecem.

```js
const CONFIG = {
  nome: "Nina",                  // quem recebe
  autor: "Léo",                  // quem faz
  helloTitle: "Oi, {nome}.",     // {nome} vira CONFIG.nome automaticamente
  // ...
};
```

Três regras que valem para o config inteiro:

| Regra | O que acontece |
|---|---|
| Campo vazio (`""` ou `[]`) | A parte da tela some sozinha. Nada quebra. |
| `{nome}` no texto | É trocado por `CONFIG.nome`. |
| Foto que não existe | Aparece um placeholder no lugar. O site nunca quebra. |

### Modo ensaio

Testar a cena 22 sem assistir às 21 anteriores toda vez:

```
http://localhost:8080/?cena=ask
http://localhost:8080/?cena=lua
http://localhost:8080/?cena=contrato
```

Qualquer nome da lista de cenas abaixo funciona.

## As 26 cenas

| # | Cena | O que acontece |
|---|---|---|
| 01 | `boot` | Terminal falso digitando sozinho. `enter` inicia. |
| 02 | `picker` | Terminal CRT verde: ela escolhe a música que abre tudo. |
| 03 | `hello` | A abertura. |
| 04 | `timeline` | A história em cartões, com foto por capítulo. |
| 05 | `mapa` | Mapa real (Leaflet + OpenStreetMap) com os lugares de vocês. Tem um pino 🔒 que só destrava depois. |
| 06 | `counter` | Contador ao vivo desde a data de início. |
| 07 | `galleryScene` | Polaroids que viram no clique, com tilt 3D. |
| 08 | `sonar` | Radar varre o oceano e trava em uma pessoa só. |
| 09 | `lua` | O céu anoitece na transição. Estrelas no fundo. |
| 10 | `girassol` | O céu amanhece. Pétalas caindo. |
| 11 | `reasons` | Motivos escritos à mão, aparecendo um a um. |
| 12 | `lock` | Uma pergunta que só ela sabe responder. |
| 13 | `foto` | Uma foto em tela cheia. Sem texto sobrando. |
| 14 | `turn` | Texto para introduzir o final. |
| 15 | `verses` | Citações que explicam melhor do que você. |
| 16 | `letter` | A carta, digitando sozinha. |
| 17 | `amada` | Recados de quem ama essa pessoa — antes de você perguntar. |
| 18 | `breath` | Tela de tensão, duas linhas de texto. |
| 19 | `ask` | **Pergunta final.** O "não" foge. |
| 20 | `final` | Confetes. |
| 21 | `roadmap` | Planos futuros como versões de software. |
| 22 | `ingresso` | Uma surpresa lacrada. Ao revelar, destrava o pino 🔒 do mapa. |
| 23 | `evento` | Contagem regressiva pro que vem. *(opcional)* |
| 24 | `contrato` | Contrato de namoro, assinável, com download em PDF e TXT. |
| 25 | `deploy` | `git push origin pra-sempre` + changelog. |
| 26 | `creditos` | Créditos rolando estilo filme. |

## Estrutura

```
nos-exe/
├── index.html              # todas as 26 cenas, uma <section> cada
├── css/
│   └── style.css           # design system + cenas (~620 linhas)
├── js/
│   ├── config.js           # 👈 TODO o conteúdo. É só aqui que você mexe.
│   └── script.js           # motor: navegação, canvas, áudio, mapa
├── assets/
│   ├── musicas/            # seus .mp3 (não versionados)
│   ├── vozes/              # áudios opcionais dos recados
│   └── *.jpg               # placeholders — troque pelas suas fotos
├── tests/
│   └── smoke.js            # percorre as 26 cenas num DOM real
├── .nojekyll               # GitHub Pages: serve tudo cru
└── LICENSE                 # MIT (o código; a história é sua)
```

## Como funciona por dentro

**Navegação.** Um array de cenas, um índice, uma função `show(nome)`. Cenas condicionais (`evento`, `picker`) são filtradas na inicialização — se não tem playlist, a tela de escolher música nem existe.

**O mar.** Um `<canvas>` de tela cheia com raios de luz, plâncton subindo e uma variável `seaDepth` que cada cena empurra pra cima. Todas as cenas interpolam suavemente entre si — ninguém troca de cor no talo. O medidor de profundidade na barra de status lê a mesma variável (`prof. −58m` → `superfície 🌅`).

**Climas.** Cada cena declara um peso `[lua, ouro]`. `lua` traz noite e estrelas; `ouro` traz o pôr do sol e as pétalas. Depois do pedido, o mundo inteiro fica dourado e não volta mais.

**Áudio.** Efeitos sonoros são sintetizados na hora com a Web Audio API — nenhum arquivo de som no repositório. A trilha é sua, e fica de fora do git.

**Degradação.** Sem internet, o mapa vira uma mensagem e o resto roda. Sem GSAP, as transições viram cortes secos e o resto roda. `prefers-reduced-motion` desliga parallax, tilt e todas as animações contínuas.

## Testes

```bash
npm install    # só o jsdom, só pra testar
npm test
```

O smoke test carrega o `config.js` e o `script.js` num DOM real, percorre as 26 cenas, e verifica coisas como: os pips da timeline batem com o número de capítulos, as cláusulas do contrato batem com o config, a barra de jornada chega a 100% na última cena, o medidor de profundidade chega à superfície, e o botão "não" consegue fugir sem explodir.

```
SMOKE OK — 26 cenas percorridas sem erro.
```

## Compatibilidade

Chrome, Firefox, Safari e Edge atuais, no desktop e no celular. Foi feito primeiro pra tela de celular — é onde a pessoa vai abrir.

## Antes de publicar o seu

- **Não versione fotos, áudios ou mensagens de outras pessoas sem permissão.** O `.gitignore` já ignora `assets/musicas/*` e `assets/vozes/*` por padrão.
- **Um repositório público é público.** Se a sua versão tem nomes, endereços e datas reais, deixe o repositório privado até o dia — ou use um repo privado com Pages (Pro) e um link que só ela recebe.
- **Música tem dono.** Não suba `.mp3` comercial pra um repositório público.

## Licença

[MIT](LICENSE) para o código.

A história, as fotos e as palavras são suas — e devem ser. Pegue o esqueleto, jogue fora o meu conteúdo, e escreva o seu. É esse o ponto.

<p align="center"><sub>feito à mão (a código)</sub></p>
