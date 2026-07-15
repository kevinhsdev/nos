/* =============================================================================
   smoke test — carrega config + script num DOM real (jsdom) e percorre TODAS as
   cenas, com asserções por cena. Rode com:  npm test
   ========================================================================== */
const { JSDOM } = require('jsdom');
const fs = require('fs');

const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const html = read('index.html')
  .replace(/<script src="https:\/\/unpkg[^>]*><\/script>/,'')   // sem Leaflet no teste
  .replace(/<link[^>]*unpkg[^>]*>/,'')
  .replace(/<script src="js\/config.js"><\/script>/,'')
  .replace(/<script src="js\/script.js"><\/script>/,'');

const dom = new JSDOM(html, { url:'http://localhost/', pretendToBeVisual:true, runScripts:'outside-only' });
const { window } = dom;
const { document } = window;

/* neutraliza timers e APIs de mídia */
window.setTimeout = () => 0; window.setInterval = () => 0;
window.requestAnimationFrame = () => 0;
window.HTMLCanvasElement.prototype.getContext = () => ({
  clearRect(){},fillRect(){},beginPath(){},arc(){},fill(){},stroke(){},save(){},restore(){},
  translate(){},rotate(){},moveTo(){},lineTo(){},closePath(){},createLinearGradient:()=>({addColorStop(){}}),
  createRadialGradient:()=>({addColorStop(){}}),setTransform(){},scale(){},fillText(){},
});
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
window.URL.createObjectURL = () => 'blob:x';
window.AudioContext = function(){ return { createOscillator:()=>({connect(){},start(){},stop(){},frequency:{value:0},type:''}), createGain:()=>({connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},value:0}}), destination:{}, currentTime:0 }; };
window.navigator.vibrate = () => true;
window.matchMedia = window.matchMedia || (q => ({ matches:false, media:q, addListener(){}, removeListener(){} }));

const ctx = window;
const configSrc = read('js/config.js');
const scriptSrc = read('js/script.js');

const errors = [];
try {
  window.eval(configSrc + "\n;window.CONFIG=CONFIG;");
  window.eval(scriptSrc + "\n;window.__T={scenes,show,dodge,preloadAssets,surfaceBreak,sceneFX};");
} catch(e){ errors.push('LOAD: '+e.message); }

if(!errors.length){
  const T = window.__T; const scenes = T.scenes;
  const assert = (cond, msg) => { if(!cond) errors.push(msg); };

  for(const s of scenes){
    try { T.show(s); }
    catch(e){ errors.push(`show(${s}): ${e.message}`); continue; }
    const el = document.getElementById(s);
    assert(el && el.classList.contains('active'), `${s}: não ficou ativa`);

    /* asserções específicas */
    if(s==='hello')    assert(document.getElementById('helloTitle').textContent.length>0, 'hello: título vazio');
    if(s==='timeline') assert(document.querySelectorAll('#tlPips .pip').length===window.CONFIG.timeline.length, 'timeline: pips ≠ itens');
    if(s==='galleryScene') assert(document.querySelectorAll('#gallery .polaroid').length===window.CONFIG.galeria.length, 'galeria: polaroids ≠ itens');
    if(s==='lock')     assert(!!document.getElementById('lockInput'), 'lock: sem input');
    if(s==='amada'){
      assert(document.querySelectorAll('#amadaDestaques .am-card, #amadaDestaques > *').length>0, 'amada: destaques vazios');
    }
    if(s==='ask')      assert(document.getElementById('askTitle').textContent.trim().length>0, 'ask: pergunta ausente');
    if(s==='galleryScene') assert(document.getElementById('galTitle').textContent.trim().length>0, 'galeria: título não veio do config');
    if(s==='evento')   assert(document.getElementById('eventoGrid').children.length>=0, 'evento: grid ausente');
    if(s==='contrato') assert(document.querySelectorAll('#contractClauses li').length===window.CONFIG.contrato.clausulas.length, 'contrato: cláusulas ≠ config');
  }

  /* v3.0: jornada e stagger */
  T.show(scenes[scenes.length-1]);
  const w = document.getElementById('journeyFill').style.width;
  assert(w==='100%', 'journey: não chegou a 100% na última cena (got '+w+')');
  const firstInner = document.querySelector('#hello .scene-inner');
  assert(firstInner && firstInner.children[1].style.getPropertyValue('--i')!=='', 'stagger: --i não aplicado');
  assert(!!document.getElementById('vignette'), 'vignette ausente no DOM');


  /* v3.1: hush no respiro liga/desliga */
  T.show('breath');
  assert(document.body.classList.contains('hushed'), 'breath: hush não ligou');
  T.show('turn');
  assert(!document.body.classList.contains('hushed'), 'turn: hush não desligou');

  /* v3.1: quebra de superfície — fallback sem GSAP chama o done na hora */
  let broke=false;
  T.surfaceBreak(()=>{ broke=true; });
  assert(broke, 'surfaceBreak: fallback sem GSAP não executou o done');

  /* v3.1: profundímetro atualiza */
  T.show('hello');
  assert(/prof\. −\d+m/.test(document.getElementById('sbDepth').textContent), 'sbDepth: não mostra profundidade');
  T.show('final');
  assert(document.getElementById('sbDepth').textContent.includes('superfície'), 'sbDepth: final não mostra superfície');

  /* v3.1: cena do pedido fora do stagger/parallax (revert) */
  const css = read('css/style.css');
  assert(css.includes(':not(#breath):not(#ask)'), 'CSS: #ask não excluída do stagger');
  assert(css.includes(':not(#picker):not(#ask)'), 'CSS: #ask não excluída do parallax');
  assert(!css.includes('yesGlow'), 'CSS: pulso do Sim não foi removido');

  /* interações críticas */
  try { T.dodge(); } catch(e){ errors.push('dodge: '+e.message); }
  try { T.preloadAssets(); } catch(e){ errors.push('preload: '+e.message); }
}

if(errors.length){ console.error('FALHOU:\n- '+errors.join('\n- ')); process.exit(1); }
console.log('SMOKE OK — '+window.__T.scenes.length+' cenas percorridas sem erro.');
