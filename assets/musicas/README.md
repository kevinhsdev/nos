# assets/musicas/

Coloque aqui os `.mp3` da trilha sonora, com **exatamente** os nomes de arquivo
listados em `js/config.js → CONFIG.playlist`.

Por padrão o config espera:

```
faixa-01.mp3
faixa-02.mp3
faixa-03.mp3
faixa-04.mp3
faixa-05.mp3
```

Pode ter quantas faixas quiser — é só editar a lista no config. A primeira é
escolhida por quem recebe, na tela de terminal; quando a faixa acaba, o player
pula sozinho para a próxima (e dá a volta na lista no fim).

Se a pasta estiver vazia, o site roda normalmente: a tela de escolher música
simplesmente não entra no fluxo.

> ⚠️ Estes arquivos são ignorados pelo git de propósito (veja `.gitignore`).
> Não suba música comercial para um repositório público.
