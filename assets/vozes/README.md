# assets/vozes/

Áudios **opcionais** para os cards de destaque da cena `amada` — a pessoa toca
o card e ouve a voz de quem gravou o recado.

Aponte o caminho em `js/config.js`:

```js
amada: {
  destaques: [
    { nome: "...", audio: "assets/vozes/nome.mp3", /* ... */ }
  ]
}
```

Deixe `audio: ""` para esconder o player — só o texto aparece, e fica lindo
igual.

> ⚠️ Nunca publique a voz de alguém sem permissão dessa pessoa.
> Esta pasta é ignorada pelo git por padrão.
