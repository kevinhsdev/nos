/* =====================================================================
   LÓGICA (no projeto isso fica em js/script.js)
   ===================================================================== */
const $ = s => document.querySelector(s);
/* prompt do terminal — vem do config (CONFIG.picker.host) */
const HOST = (typeof CONFIG!=='undefined' && CONFIG.picker && CONFIG.picker.host) || 'nós@voce';
const fill = (sel, txt) => { const e=$(sel); if(e) e.innerHTML = txt.replace(/{nome}/g, CONFIG.nome); };
const allScenes = ['boot','picker','hello','timeline','mapa','counter','galleryScene','sonar','lua','girassol','reasons','lock','foto','turn','verses','letter','amada','breath','ask','final','roadmap','ingresso','evento','contrato','deploy','creditos'];
const hasPlaylist = (Array.isArray(CONFIG.playlist) && CONFIG.playlist.length>0) || !!CONFIG.musica;
const scenes = allScenes.filter(s => {
  if(s==='evento') return !!(CONFIG.evento && CONFIG.evento.ativo);
  if(s==='picker')  return hasPlaylist;          // sem música, pula a tela de escolha
  return true;
});
const noSkip = ['ask','boot','picker','lock','mapa','breath','deploy','creditos','ingresso'];
let idx = 0;

/* profundidade do mar por cena (0 = fundo escuro, 1 = superfície/luz) */
let seaDepth=0.12, seaTargetDepth=0.12;
function depthFor(name){
  const map={boot:0.10,picker:0.13,hello:0.16,timeline:0.22,mapa:0.28,counter:0.34,galleryScene:0.40,sonar:0.41,lua:0.43,girassol:0.46,reasons:0.50,lock:0.54,foto:0.60,turn:0.66,verses:0.70,letter:0.74,amada:0.80,breath:0.84,ask:0.95,final:1.0,roadmap:0.82,ingresso:0.815,evento:0.81,contrato:0.80,deploy:0.78,creditos:0.70};
  return (name in map) ? map[name] : 0.5;
}
function setSeaDepth(name){ seaTargetDepth=depthFor(name); }

/* CLIMA do fundo por cena: pesos [lua, ouro] (0 = mar normal). Volta sozinho nas outras cenas. */
const prefersReduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
let seaMoon=0, seaMoonT=0, seaGold=0, seaGoldT=0;
function moodFor(name){
  const m={ lua:[1,0], girassol:[0,1], reasons:[0,0.55], verses:[0.5,0], letter:[0.7,0], amada:[0.55,0],
            /* pós-superfície: o mundo fica dourado; créditos rolam sob a lua */
            final:[0,1], roadmap:[0,0.5], ingresso:[0,0.4], evento:[0,0.4], contrato:[0,0.35], deploy:[0,0.3], creditos:[0.6,0] };
  return m[name] || [0,0];
}
function setSeaMood(name){ const w=moodFor(name); seaMoonT=w[0]; seaGoldT=w[1]; if(prefersReduce){ seaMoon=seaMoonT; seaGold=seaGoldT; } }

function show(name){
  document.querySelectorAll('.scene').forEach(s=>s.classList.remove('active'));
  document.getElementById(name).classList.add('active');
  idx = scenes.indexOf(name);
  if(name==='picker') runPicker();
  if(name==='mapa') initMap();
  if(name==='sonar') initSonar();
  if(name==='girassol') bloomSunflower();
  if(name==='evento') startEvento();
  if(name==='reasons') runReasons();
  if(name==='counter') startCounter();
  if(name==='foto') initFoto();
  if(name==='letter') runLetter();
  if(name==='breath') runBreath();
  if(name==='verses') runVerses();
  if(name==='amada') runAmada();
  if(name==='roadmap') runRoadmap();
  if(name==='creditos') runCreditos();
  if(name==='lock') setTimeout(()=>{ const i=$('#lockInput'); if(i) i.focus(); }, 600);
  if(name==='deploy') runDeploy();
  setSeaDepth(name);
  setSeaMood(name);
  sceneFX(name);
  const jf=$('#journeyFill'); if(jf && scenes.length>1) jf.style.width=Math.round((Math.max(idx,0)/(scenes.length-1))*100)+'%';
  const sd=$('#sbDepth'); if(sd){ const m=Math.round((1-depthFor(name))*58); sd.textContent = m<=0 ? 'superfície 🌅' : 'prof. −'+m+'m'; }
}

/* transições-assinatura: anoitece na lua, amanhece no girassol, silencia no respiro */
function sceneFX(name){
  document.body.classList.toggle('hushed', name==='breath');
  if(prefersReduce || !window.gsap) return;
  const sw=$('#sweep'); if(!sw) return;
  if(name==='lua' || name==='girassol'){
    sw.className = (name==='lua') ? 'night' : 'dawn';
    gsap.killTweensOf(sw);
    gsap.fromTo(sw,{opacity:0},{opacity:.92,duration:.7,ease:'power1.in',
      onComplete(){ gsap.to(sw,{opacity:0,duration:2.1,ease:'power2.out'}); }});
  }
}
function nextScene(){ if(idx < scenes.length-1) show(scenes[idx+1]); }
document.querySelectorAll('.next').forEach(b=> b.addEventListener('click', ()=>{ blip(); nextScene(); }));
document.addEventListener('keydown', e=>{ if(e.key==='ArrowRight'){ if(idx>=0 && !noSkip.includes(scenes[idx])){ blip(); nextScene(); } } });

/* ---------- ÁUDIO sintetizado ---------- */
let actx=null, sfxOn=true;
function ac(){ if(!actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return actx; }
function tone(freq,dur,type,vol){
  const c=ac(); if(!c||!sfxOn) return;
  const o=c.createOscillator(), g=c.createGain();
  o.type=type||'sine'; o.frequency.value=freq; o.connect(g); g.connect(c.destination);
  const t=c.currentTime; g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(vol||0.05,t+0.006);
  g.gain.exponentialRampToValueAtTime(0.0001,t+(dur||0.08));
  o.start(t); o.stop(t+(dur||0.08)+0.03);
}
function blip(){ tone(620,0.05,'square',0.022); }
function key(){ tone(1150+Math.random()*350,0.018,'square',0.011); }
function unlockSfx(){ tone(523,0.1,'sine',0.045); setTimeout(()=>tone(784,0.2,'sine',0.05),95); }
function yaySfx(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,0.28,'triangle',0.05),i*75)); }
function buzz(p){ if(navigator.vibrate){ try{ navigator.vibrate(p); }catch(e){} } }
$('#sfx').addEventListener('click', ()=>{ sfxOn=!sfxOn; $('#sfx').classList.toggle('off',!sfxOn); if(sfxOn) blip(); });

/* ---------- foto com fallback ---------- */
function photoNode(src, emoji, label){
  const wrap=document.createElement('div'); wrap.className='tl-photo';
  const ph=`<div class="ph"><span class="emoji">${emoji||'📸'}</span><span class="lbl">${label||'sua foto aqui'}</span></div>`;
  if(!src){ wrap.innerHTML=ph; return wrap; }
  const img=document.createElement('img'); img.alt=label||'foto'; img.src=src;
  img.onerror=()=>{ wrap.innerHTML=ph; }; wrap.appendChild(img); return wrap;
}

/* ---------- BOOT ---------- */
const bootSeq = CONFIG.bootSeq;
let bootArmed=false, launched=false;
function runBoot(){
  const screen=$('#bootLines'); let i=0; const promptStr=HOST+':~$ ';
  function addLine(html){ const d=document.createElement('div'); d.className='bl'; d.innerHTML=html; screen.appendChild(d); requestAnimationFrame(()=>d.classList.add('show')); screen.scrollTop=screen.scrollHeight; return d; }
  function typeCmd(text, cb){
    const d=addLine('<span class="prompt">'+promptStr+'</span><span class="cmd"></span><span class="cur"></span>');
    const cmdEl=d.querySelector('.cmd'), cur=d.querySelector('.cur'); let c=0;
    (function t(){ if(c<text.length){ cmdEl.textContent+=text[c]; c++; key(); screen.scrollTop=screen.scrollHeight; setTimeout(t,40+Math.random()*45); } else { cur.remove(); cb&&cb(); } })();
  }
  (function step(){
    if(i>=bootSeq.length){ launchReady(); return; }
    const s=bootSeq[i]; i++;
    if(s.type==='cmd'){ typeCmd(s.text, ()=>setTimeout(step,360)); }
    else { addLine(s.html||'&nbsp;'); if(s.html) blip(); setTimeout(step, s.html?(120+Math.random()*70):70); }
  })();
}
function launchReady(){
  const s=$('#bootLines');
  const run=document.createElement('div'); run.className='bl'; run.style.marginTop='14px';
  run.innerHTML='<span class="prompt">'+HOST+':~$</span> <span class="run">./executar.sh</span> <span class="cur"></span>';
  s.appendChild(run); requestAnimationFrame(()=>run.classList.add('show'));
  const press=document.createElement('div'); press.className='bl press';
  press.innerHTML='pressione <kbd>enter</kbd> ou toque pra iniciar';
  s.appendChild(press); requestAnimationFrame(()=>press.classList.add('show'));
  s.scrollTop=s.scrollHeight; bootArmed=true;
}
function launch(){
  if(!bootArmed||launched) return; launched=true;
  ac(); yaySfx(); buzz(30);
  document.body.classList.add('launched'); updateStatus(); initSea(); preloadAssets();
  const b=$('#boot'); b.classList.add('powering');
  setTimeout(()=>{ show(scenes[1] || 'hello'); }, 720);
}
/* pré-carrega as fotos em segundo plano — as cenas abrem sem "piscar" */
function preloadAssets(){
  const urls=[];
  (CONFIG.timeline||[]).forEach(m=>{ if(m.foto) urls.push(m.foto); });
  (CONFIG.galeria||[]).forEach(g=>{ if(g.foto) urls.push(g.foto); });
  if(CONFIG.fotoMomento && CONFIG.fotoMomento.foto) urls.push(CONFIG.fotoMomento.foto);
  ((CONFIG.amada && CONFIG.amada.destaques)||[]).forEach(d=>{ if(d.foto) urls.push(d.foto); });
  ((CONFIG.amada && CONFIG.amada.mural)||[]).forEach(d=>{ if(d.foto) urls.push(d.foto); });
  urls.forEach(u=>{ try{ const im=new Image(); im.src=u; }catch(e){} });
}
$('#boot').addEventListener('click', launch);
document.addEventListener('keydown', e=>{ if(e.key==='Enter' && scenes[idx]==='boot'){ e.preventDefault(); launch(); } });

/* ---------- barra de status ---------- */
function diasJuntos(){ return Math.max(0, Math.floor((Date.now()-new Date(CONFIG.contador.desde).getTime())/86400000)); }
function updateStatus(){ const d=diasJuntos(); const anos=Math.floor(d/365), meses=Math.floor((d%365)/30); $('#sbUptime').textContent='uptime '+(anos?anos+'a ':'')+meses+'m'; }

/* ---------- textos globais / marca ---------- */
(function(){
  const app = CONFIG.app || {};
  const t = (sel, txt) => { const e=$(sel); if(e && txt!=null) e.textContent = txt; };
  document.title = app.titulo || document.title;
  t('#sbProject', app.titulo);
  t('#sbBuild', app.build ? 'build '+app.build : 'build 1.0.0');
})();

/* ---------- hello ---------- */
fill('#helloEyebrow', CONFIG.helloEyebrow || '');
fill('#helloTitle', CONFIG.helloTitle);
fill('#helloText', CONFIG.helloText);

/* ---------- timeline ---------- */
fill('#tlEyebrow', CONFIG.timelineEyebrow || '');
let tli=0;
function renderTL(){
  const m=CONFIG.timeline[tli], card=$('#tlCard'); card.innerHTML='';
  card.appendChild(photoNode(m.foto,'🖼️','foto: '+(m.foto||'—')));
  const txt=document.createElement('div');
  txt.innerHTML=`<div class="tl-date">${m.data}</div><h2>${m.titulo}</h2><p class="lead" style="margin-top:8px">${m.texto}</p><p class="joke">${m.joke}</p>`;
  card.appendChild(txt);
  const pips=$('#tlPips'); pips.innerHTML='';
  CONFIG.timeline.forEach((_,k)=>{ const p=document.createElement('span'); p.className='pip'+(k===tli?' on':''); pips.appendChild(p); });
  $('#tlPrev').style.visibility=tli===0?'hidden':'visible';
  $('#tlNext').textContent=tli===CONFIG.timeline.length-1?'continuar →':'próximo →';
}
$('#tlPrev').addEventListener('click', ()=>{ if(tli>0){ blip(); tli--; renderTL(); } });
$('#tlNext').addEventListener('click', ()=>{ blip(); if(tli<CONFIG.timeline.length-1){ tli++; renderTL(); } else nextScene(); });
renderTL();

/* ---------- MAPA (Leaflet + OpenStreetMap) ---------- */
$('#mapEyebrow').textContent=CONFIG.mapa.eyebrow;
$('#mapTitle').textContent=CONFIG.mapa.titulo;
$('#mapLegend').textContent=CONFIG.mapa.legenda;
let mapInited=false, mapObj=null;
let eventoUnlocked=false, secretMarker=null, secretPinCfg=null;
function initMap(){
  if(typeof L==='undefined'){ const f=$('#mapFallback'); if(f){ f.style.display='block'; f.textContent=CONFIG.mapa.offline; } return; }
  if(mapInited){ if(mapObj) setTimeout(()=>mapObj.invalidateSize(),300); return; }
  mapInited=true;
  mapObj=L.map('map',{scrollWheelZoom:false,attributionControl:true}).setView(CONFIG.mapa.centro, CONFIG.mapa.zoom);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:'© OpenStreetMap · © CARTO', maxZoom:19
  }).addTo(mapObj);
  const icon=L.divIcon({className:'pin', html:'<span class="pin-dot"></span>', iconSize:[16,16], iconAnchor:[8,8]});
  const iconFut=L.divIcon({className:'pin futuro', html:'<span class="pin-dot"></span>', iconSize:[16,16], iconAnchor:[8,8]});
  const iconSeg=L.divIcon({className:'pin segredo', html:'<span class="pin-dot"><span class="pin-lock">🔒</span></span>', iconSize:[20,20], iconAnchor:[10,10]});
  const pts=[];
  CONFIG.mapa.pinos.forEach(p=>{
    let useIcon=icon;
    if(p.tipo==='futuro') useIcon=iconFut;
    if(p.tipo==='segredo') useIcon = eventoUnlocked ? iconFut : iconSeg;
    const mk=L.marker(p.coord,{icon:useIcon}).addTo(mapObj);
    if(p.tipo==='segredo'){
      secretMarker=mk; secretPinCfg=p;
      const shown = (eventoUnlocked && p.revelado) ? p.revelado : p;
      mk.bindPopup('<b>'+shown.nome+'</b><small>'+(shown.nota||'')+'</small>');
    } else {
      mk.bindPopup('<b>'+p.nome+'</b><small>'+(p.nota||'')+'</small>');
    }
    pts.push(p.coord);
  });
  if(pts.length>1){ try{ mapObj.fitBounds(pts,{padding:[40,40]}); }catch(e){} }
  setTimeout(()=>mapObj.invalidateSize(),300);
}
/* destrava o pino-segredo do mapa (chamado quando o ingresso é revelado no final) */
function unlockEventoPin(){
  eventoUnlocked=true;   // fica marcado: se ela voltar ao mapa, já aparece destravado
  if(!secretMarker || !secretPinCfg || typeof L==='undefined') return;
  const r=secretPinCfg.revelado || secretPinCfg;
  try{
    secretMarker.setIcon(L.divIcon({className:'pin futuro reveal', html:'<span class="pin-dot"></span>', iconSize:[16,16], iconAnchor:[8,8]}));
    if(secretMarker.setPopupContent) secretMarker.setPopupContent('<b>'+r.nome+'</b><small>'+(r.nota||'')+'</small>');
  }catch(e){}
}

/* ---------- galeria ---------- */
(function(){
  const gi = CONFIG.galeriaInfo || {};
  fill('#galEyebrow', gi.eyebrow || '');
  fill('#galTitle',   gi.titulo  || '');
  fill('#galText',    gi.texto   || '');
  fill('#galHint',    gi.dica    || '');
  const g=$('#gallery');
  CONFIG.galeria.forEach(item=>{
    const card=document.createElement('div'); card.className='polaroid';
    const inner=document.createElement('div'); inner.className='polaroid-inner';
    const front=document.createElement('div'); front.className='polaroid-face polaroid-front';
    const pimg=document.createElement('div'); pimg.className='pimg';
    const ph='<div class="ph"><span class="emoji">💞</span><span class="lbl">'+(item.foto||'sua foto aqui')+'</span></div>';
    if(item.foto){ const img=document.createElement('img'); img.src=item.foto; img.alt=item.label||''; img.onerror=()=>{ pimg.innerHTML=ph; }; pimg.appendChild(img); } else { pimg.innerHTML=ph; }
    const cap=document.createElement('div'); cap.className='pcap'; cap.textContent=item.label||'';
    front.appendChild(pimg); front.appendChild(cap);
    const exp=document.createElement('button'); exp.className='pexpand'; exp.type='button'; exp.textContent='⤢'; exp.setAttribute('aria-label','ver em tamanho grande');
    exp.addEventListener('click', ev=>{ ev.stopPropagation(); openLightbox(item); });
    front.appendChild(exp);
    const back=document.createElement('div'); back.className='polaroid-face polaroid-back';
    back.innerHTML='<span class="pcorner">↺</span><div class="pjoke">'+(item.verso||'💛')+'</div>';
    inner.appendChild(front); inner.appendChild(back); card.appendChild(inner);
    card.addEventListener('click', ()=>{ key(); card.classList.toggle('flipped'); });
    g.appendChild(card);
  });
})();

/* ---------- lightbox da galeria ---------- */
function openLightbox(item){
  const lb=$('#lightbox'); if(!lb) return;
  const img=$('#lbImg'), cap=$('#lbCap');
  img.onerror=()=>{ img.style.display='none'; }; img.style.display='block';
  img.src=item.foto||''; img.alt=item.label||'';
  cap.textContent=(item.label? item.label : '')+(item.verso? ' — '+item.verso : '');
  lb.classList.add('show'); lb.setAttribute('aria-hidden','false'); blip();
}
function closeLightbox(){ const lb=$('#lightbox'); if(!lb) return; lb.classList.remove('show'); lb.setAttribute('aria-hidden','true'); }
$('#lbClose').addEventListener('click', closeLightbox);
$('#lightbox').addEventListener('click', e=>{ if(e.target.id==='lightbox') closeLightbox(); });

/* ---------- contador ---------- */
$('#counterEyebrow').textContent=CONFIG.contador.eyebrow;
$('#counterTitle').textContent=CONFIG.contador.titulo;
$('#counterLegend').textContent=CONFIG.contador.legenda;
let counterTimer=null;
function startCounter(){
  const grid=$('#counterGrid'); const desde=new Date(CONFIG.contador.desde);
  function tick(){
    let diff=Math.max(0, Date.now()-desde.getTime());
    const d=Math.floor(diff/86400000); diff-=d*86400000;
    const h=Math.floor(diff/3600000); diff-=h*3600000;
    const mi=Math.floor(diff/60000); diff-=mi*60000;
    const s=Math.floor(diff/1000);
    const cells=[[d,'dias'],[h,'horas'],[mi,'min'],[s,'seg']];
    grid.innerHTML=cells.map(c=>'<div class="counter-cell"><div class="counter-num">'+String(c[0]).padStart(2,'0')+'</div><div class="counter-lbl">'+c[1]+'</div></div>').join('');
  }
  tick(); if(counterTimer) clearInterval(counterTimer); counterTimer=setInterval(tick,1000);
}

/* ---------- LUA 🌙 ---------- */
fill('#luaEyebrow', CONFIG.lua.eyebrow);
fill('#luaTitle', CONFIG.lua.titulo);
fill('#luaText', CONFIG.lua.texto);
fill('#luaNota', CONFIG.lua.nota);
(function(){
  const moon=$('#moon'); if(!moon) return;
  [[38,30,24],[88,56,17],[58,98,28],[100,100,13],[28,86,15],[78,28,11]].forEach(c=>{
    const d=document.createElement('span'); d.className='crater';
    d.style.left=c[0]+'px'; d.style.top=c[1]+'px'; d.style.width=c[2]+'px'; d.style.height=c[2]+'px';
    moon.appendChild(d);
  });
})();

/* ---------- GIRASSOL 🌻 ---------- */
fill('#girassolEyebrow', CONFIG.girassol.eyebrow);
fill('#girassolTitle', CONFIG.girassol.titulo);
fill('#girassolText', CONFIG.girassol.texto);
fill('#girassolNota', CONFIG.girassol.nota);
(function(){
  const sf=$('#sunflower'), seeds=$('#seeds'); if(!sf||!seeds) return;
  function ring(n,base){ for(let i=0;i<n;i++){ const p=document.createElement('div'); p.className='petal';
    p.style.setProperty('--a',(360/n*i)+'deg'); p.style.transitionDelay=(base+i*20)+'ms'; sf.insertBefore(p,seeds); } }
  ring(16,120); ring(16,0);
  for(let i=0;i<64;i++){ const s=document.createElement('span'); s.className='seed';
    const a=Math.random()*6.28, r=Math.random()*34; s.style.left=(39+Math.cos(a)*r)+'px'; s.style.top=(39+Math.sin(a)*r)+'px'; seeds.appendChild(s); }
})();
let bloomed=false;
function bloomSunflower(){ if(bloomed) return; bloomed=true; const sf=$('#sunflower'); if(sf) sf.classList.add('bloomed'); }

/* ---------- motivos (escritos à mão, em papel) ---------- */
let reasonsDone=false;
function runReasons(){
  if(reasonsDone) return; reasonsDone=true;
  const mi = CONFIG.motivosInfo || {};
  fill('#reasonsEyebrow', mi.eyebrow || '');
  fill('#reasonsTitle',   mi.titulo  || '');
  const ul=$('#reasonsList'); ul.innerHTML='';
  const items=CONFIG.motivos.map(m=>{ const li=document.createElement('li');
    li.innerHTML='<span class="mk">✓</span><span>'+m+'</span>'; ul.appendChild(li); return li; });
  let i=0;
  setTimeout(function step(){
    if(i>=items.length){ const b=$('#reasonsNext'); b.style.opacity=1; b.style.pointerEvents='auto'; return; }
    items[i].classList.add('show'); blip(); i++; setTimeout(step,420);
  },350);
}

/* ---------- foto em tela cheia ---------- */
function initFoto(){
  $('#fotoSub').textContent=CONFIG.fotoMomento.sub;
  $('#fotoLegenda').textContent=CONFIG.fotoMomento.legenda;
  const el=$('#fotoFull'); const src=CONFIG.fotoMomento.foto;
  if(!src){ el.classList.add('noimg'); return; }
  const img=new Image();
  img.onload=()=>{ el.style.backgroundImage='url("'+src+'")'; el.classList.remove('noimg'); };
  img.onerror=()=>{ el.classList.add('noimg'); };
  img.src=src;
}

/* ---------- senha ---------- */
fill('#lockEyebrow', CONFIG.senha.eyebrow || '');
$('#lockQ').textContent=CONFIG.senha.pergunta;
$('#lockChallenge').textContent=CONFIG.senha.desafio;
$('#lockInput').placeholder=CONFIG.senha.placeholder||'...';
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
let lockTries=0;
function checkLock(){
  const val=norm($('#lockInput').value); if(!val) return;
  const ok=CONFIG.senha.aceitas.some(a=>val.includes(norm(a))); const msg=$('#lockMsg');
  if(ok){ unlockSfx(); buzz([20,40,30]); msg.className='lock-msg ok'; msg.textContent=CONFIG.senha.sucesso; $('#lockInput').disabled=true; $('#lockBtn').disabled=true; setTimeout(()=>nextScene(),1400); }
  else { lockTries++; tone(180,0.12,'sawtooth',0.04); buzz(15); msg.className='lock-msg err'; msg.textContent=lockTries>=2?CONFIG.senha.dica:CONFIG.senha.erro; }
}
$('#lockBtn').addEventListener('click', checkLock);
$('#lockInput').addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); checkLock(); } });

/* ---------- virada ---------- */
fill('#turnEyebrow', CONFIG.turnEyebrow || '');
fill('#turnTitle', CONFIG.turnTitle);
fill('#turnText', CONFIG.turnText);

/* ---------- cartinha ---------- */
$('#letterEyebrow').textContent=CONFIG.carta.eyebrow;
let letterDone=false;
function runLetter(){
  if(letterDone) return; letterDone=true;
  const body=$('#letterBody'); body.innerHTML=''; const paras=CONFIG.carta.paragrafos.slice(); let pi=0;
  (function typePara(){
    if(pi>=paras.length){ const b=$('#letterNext'); b.style.opacity=1; b.style.pointerEvents='auto'; return; }
    const p=document.createElement('p'); if(pi===0){ p.style.color='var(--coral)'; p.style.fontStyle='normal'; p.style.fontWeight='600'; } body.appendChild(p);
    const text=paras[pi]; let ci=0; const cur=document.createElement('span'); cur.className='tw-cursor';
    (function typeChar(){
      if(ci<text.length){ p.textContent=text.slice(0,ci+1); p.appendChild(cur); if(text[ci]!==' ') key(); ci++; setTimeout(typeChar,26+Math.random()*26); }
      else { p.textContent=text; pi++; setTimeout(typePara,430); }
    })();
  })();
}

/* ---------- respiro ---------- */
let breathDone=false;
function runBreath(){
  const b=$('#breathNext'); if(b && CONFIG.respiro && CONFIG.respiro.botao) b.textContent=CONFIG.respiro.botao;
  if(breathDone) return; breathDone=true; duck();
  $('#bLine1').textContent=CONFIG.respiro.linha1;
  $('#bLine2').textContent=CONFIG.respiro.linha2;
  const row=$('#breath .btn-row');
  setTimeout(()=>$('#bLine1').classList.add('show'), 400);
  setTimeout(()=>$('#bLine2').classList.add('show'), 2100);
  setTimeout(()=>{ row.classList.add('show'); restore(); }, 3600);
}

/* ---------- pedido ---------- */
fill('#commitLine', CONFIG.commitLine);
fill('#askTitle', CONFIG.askTitle);
fill('#askSub', CONFIG.askSub);
(function(){ const y=$('#yesBtn'); if(y && CONFIG.yesLabel) y.textContent=CONFIG.yesLabel; })();
const noBtn=$('#noBtn'); let noTries=0;
function dodge(){
  noTries++;
  if(noTries<CONFIG.noLabels.length) noBtn.textContent=CONFIG.noLabels[noTries];
  const yes=$('#yesBtn'); const scale=Math.max(.5,1-noTries*0.08);
  noBtn.style.transform=`scale(${scale})`;
  const pad=90;
  const x=Math.random()*(window.innerWidth-2*pad)-(window.innerWidth/2-pad);
  const y=Math.random()*(window.innerHeight-2*pad)-(window.innerHeight/2-pad);
  noBtn.style.position='fixed'; noBtn.style.left='50%'; noBtn.style.top='50%';
  noBtn.style.marginLeft=x+'px'; noBtn.style.marginTop=y+'px';
  yes.style.transform=`scale(${1+noTries*0.06})`; key();
}
['mouseover','pointerenter','touchstart','pointerdown','click'].forEach(ev=>{
  noBtn.addEventListener(ev, e=>{ e.preventDefault(); dodge(); }, {passive:false});
});
$('#yesBtn').addEventListener('click', ()=>{
  const r=$('#yesBtn').getBoundingClientRect();
  surfaceBreak(()=>{ show('final'); yaySfx(); buzz([40,30,80]); celebrate(r.left+r.width/2, r.top+r.height/2); });
});

/* QUEBRA DE SUPERFÍCIE 🌅 — a faixa de luz sobe pela tela e o mar "abre" pro final */
function surfaceBreak(done){
  const ov=$('#surface');
  if(!window.gsap || prefersReduce || !ov){ done(); return; }   // sem GSAP/offline: segue direto
  ov.classList.add('on');
  const band=ov.querySelector('.sf-band'), glow=ov.querySelector('.sf-glow');
  gsap.set(band,{yPercent:115,opacity:1}); gsap.set(glow,{opacity:0});
  riser(); buzz(20);
  gsap.timeline({onComplete(){ ov.classList.remove('on'); gsap.set([band,glow],{clearProps:'all'}); }})
    .to(band,{yPercent:-135,duration:1.05,ease:'power2.in'})
    .to(glow,{opacity:1,duration:.3,ease:'power1.out'},'-=0.42')
    .add(done,'-=0.26')
    .to(glow,{opacity:0,duration:1.5,ease:'power2.out'});
}
/* som de subida (sintetizado — sobe junto com a luz) */
function riser(){
  const c=ac(); if(!c||!sfxOn) return;
  try{
    const o=c.createOscillator(), g=c.createGain();
    o.type='sine'; o.connect(g); g.connect(c.destination);
    const t=c.currentTime;
    o.frequency.setValueAtTime(150,t);
    o.frequency.exponentialRampToValueAtTime(920,t+0.95);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(0.05,t+0.18);
    g.gain.exponentialRampToValueAtTime(0.0001,t+1.05);
    o.start(t); o.stop(t+1.1);
  }catch(e){}
}

/* ---------- final ---------- */
fill('#finalBig', CONFIG.finalBig);
fill('#finalHand', CONFIG.finalHand);
fill('#finalCommit', CONFIG.finalCommit);

/* ---------- roadmap ---------- */
$('#roadEyebrow').textContent=CONFIG.roadmap.eyebrow;
$('#roadTitle').textContent=CONFIG.roadmap.titulo;
$('#roadLegend').textContent=CONFIG.roadmap.legenda;
let roadmapDone=false;
function runRoadmap(){
  if(roadmapDone) return; roadmapDone=true;
  const wrap=$('#roadList'); wrap.innerHTML='';
  CONFIG.roadmap.itens.forEach((it,i)=>{
    const row=document.createElement('div'); row.className='rel';
    row.innerHTML='<div class="rel-v">'+it.v+'</div><div class="rel-body"><div class="rel-t">'+it.t+'</div><div class="rel-d">'+it.d+'</div></div>';
    wrap.appendChild(row); setTimeout(()=>{ row.classList.add('show'); blip(); }, 150*i+200);
  });
}

/* ---------- contrato ---------- */
$('#contratoEyebrow').textContent=CONFIG.contrato.eyebrow;
$('#contractTitle').textContent=CONFIG.contrato.titulo;
$('#contractIntro').textContent=CONFIG.contrato.intro;
$('#contractParts').innerHTML='<strong>'+CONFIG.contrato.parte1+'</strong> &amp; <strong>'+CONFIG.nome+'</strong>';
$('#contractFoot').textContent=CONFIG.contrato.rodape;
(function(){ const ul=$('#contractClauses'); CONFIG.contrato.clausulas.forEach(c=>{ const li=document.createElement('li'); li.textContent=c; ul.appendChild(li); }); })();
$('#signBtn').textContent=CONFIG.contrato.botaoAssinar;
$('#pdfBtn').textContent=CONFIG.contrato.botaoPdf;
$('#txtBtn').textContent=CONFIG.contrato.botaoTxt;
function dataHoje(){ const d=new Date(); return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear(); }
let signed=false;
$('#signBtn').addEventListener('click', ()=>{
  if(signed) return; signed=true;
  const box=$('#sigBox'); box.classList.add('signed');
  box.innerHTML='<span class="signature">'+CONFIG.nome+'</span><span class="sigdate">'+dataHoje()+'</span>';
  $('#signBtn').textContent=CONFIG.contrato.jaAssinado; $('#signBtn').disabled=true;
  $('#pdfBtn').style.display='inline-block'; $('#txtBtn').style.display='inline-block'; $('#deployBtn').style.display='inline-block';
  buildPrintDoc(); yaySfx(); buzz([30,40,60]);
  const r=$('#sigBox').getBoundingClientRect(); celebrate(r.left+r.width/2, r.top);
});
function buildPrintDoc(){
  const C=CONFIG.contrato; let cl=''; C.clausulas.forEach(c=>cl+='<li>'+c+'</li>');
  $('#printDoc').innerHTML=
    '<div class="pt">'+C.titulo+'</div>'+
    '<div class="ps">documento oficial · '+dataHoje()+'</div>'+
    '<div class="pi">'+C.intro+'</div>'+
    '<div class="pp">'+C.parte1+' &amp; '+CONFIG.nome+'</div>'+
    '<ul>'+cl+'</ul>'+
    '<div class="psign"><div class="psig"><div class="pname">'+C.parte1+'</div><div class="plbl">parte 1</div></div>'+
    '<div class="psig"><div class="pname">'+CONFIG.nome+'</div><div class="plbl">parte 2 · '+dataHoje()+'</div></div></div>'+
    '<div class="pfoot">'+C.rodape+'</div>';
}
$('#pdfBtn').addEventListener('click', ()=>{ window.print(); });
$('#txtBtn').addEventListener('click', ()=>{
  const C=CONFIG.contrato; let txt=C.titulo+'\n\n'+C.intro+'\n'+C.parte1+' & '+CONFIG.nome+'\n\n';
  C.clausulas.forEach(c=> txt+='- '+c+'\n');
  txt+='\nAssinado por: '+CONFIG.nome+' em '+dataHoje()+'\n'+C.rodape+'\n';
  const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='contrato-de-namoro.txt';
  document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500);
});
$('#deployBtn').addEventListener('click', ()=>{ blip(); show('deploy'); });

/* ---------- deploy / changelog ---------- */
$('#dpEyebrow').textContent=CONFIG.deploy.eyebrow;
let deployDone=false;
function runDeploy(){
  if(deployDone) return; deployDone=true;
  const body=$('#dpBody'); body.innerHTML=''; const L=CONFIG.deploy.linhas; let i=0;
  (function step(){
    if(i>=L.length){ const c=document.createElement('span'); c.className='cursor'; body.appendChild(c); return; }
    const div=document.createElement('div'); div.className='ln'; div.innerHTML=L[i]||'&nbsp;';
    body.appendChild(div); requestAnimationFrame(()=>div.classList.add('show'));
    if(L[i]) blip(); i++; setTimeout(step,480);
  })();
}
$('#restartBtn').addEventListener('click', ()=>{
  blip();
  const o=document.createElement('div');
  o.style.cssText='position:fixed;inset:0;background:var(--void);z-index:200;opacity:0;transition:opacity .42s ease';
  document.body.appendChild(o);
  requestAnimationFrame(()=>{ o.style.opacity='1'; });
  setTimeout(()=>{ try{ location.reload(); }catch(e){} }, 430);
});

/* ---------- créditos finais (rolagem estilo filme) ---------- */
$('#credEyebrow').textContent=CONFIG.creditos.eyebrow;
$('#credBack').textContent=CONFIG.creditos.voltar;
let creditsBuilt=false;
function buildCredits(){
  if(creditsBuilt) return; creditsBuilt=true;
  const C=CONFIG.creditos; let html='<div class="cred-title">'+C.titulo+'</div><div class="cred-sub">'+C.sub+'</div>';
  C.linhas.forEach(l=>{ html+='<div class="cred-row"><div class="cred-role">'+l.papel+'</div><div class="cred-name">'+l.nome+'</div></div>'; });
  html+='<div class="cred-fim">'+C.fim+'</div>';
  $('#credRoll').innerHTML=html;
}
function runCreditos(){
  buildCredits();
  const roll=$('#credRoll');
  roll.style.setProperty('--creddur', (CONFIG.creditos.linhas.length*3.4+16)+'s');
  roll.classList.remove('run'); void roll.offsetWidth; roll.classList.add('run'); // reinicia a rolagem
}
$('#credBack').addEventListener('click', ()=>{ blip(); show('deploy'); });
(function(){ const b=$('#toCreditsBtn'); if(b) b.addEventListener('click', ()=>{ blip(); show('creditos'); }); })();

/* ---------- música + PLAYLIST + mini-player ---------- */
const audio=$('#audio'); const player=$('#nowplaying'); let musicOn=false;
audio.loop=false;   // quem controla o avanço é a playlist, não o loop de 1 faixa

// monta a fila (com fallback pra 'musica' única)
const PLAYLIST = (Array.isArray(CONFIG.playlist) && CONFIG.playlist.length)
  ? CONFIG.playlist.slice()
  : (CONFIG.musica ? [{ arquivo:CONFIG.musica,
                        titulo:(CONFIG.nowPlaying&&CONFIG.nowPlaying.titulo)||'',
                        artista:(CONFIG.nowPlaying&&CONFIG.nowPlaying.artista)||'' }] : []);
const repeatAll = !(CONFIG.playlistConfig && CONFIG.playlistConfig.repetirTudo===false);
let plOrder = PLAYLIST.map((_,i)=>i);   // ordem de reprodução (rotaciona na escolha)
let plPos = 0, musicStarted=false;

function curTrack(){ return PLAYLIST[plOrder[plPos]] || null; }
function setNP(t){ if(!t) return; $('#npTitle').textContent=t.titulo||''; $('#npArtist').textContent=t.artista||''; }
function setPlaying(on){ musicOn=on; player.classList.toggle('playing',on); const tg=$('#npToggle'); if(tg) tg.textContent=on?'❚❚':'▸'; }

function playTrack(){
  const t=curTrack(); if(!t) return;
  setNP(t); player.classList.add('show'); audio.src=t.arquivo;
  audio.play().then(()=>{ setPlaying(true); musicStarted=true; }).catch(()=>setPlaying(false));
}
function nextTrack(){
  if(!PLAYLIST.length) return;
  if(plPos < plOrder.length-1){ plPos++; }
  else { if(!repeatAll){ setPlaying(false); return; } plPos=0; }
  playTrack();
}
function prevTrack(){
  if(!PLAYLIST.length) return;
  if(audio.currentTime>3){ try{ audio.currentTime=0; }catch(e){} return; }  // recomeça a faixa
  plPos = plPos>0 ? plPos-1 : (repeatAll ? plOrder.length-1 : 0);
  playTrack();
}
// começa a playlist a partir da faixa escolhida (segue dali em diante, dando a volta)
function startPlaylistFrom(i){
  if(!PLAYLIST.length) return;
  const n=PLAYLIST.length;
  plOrder=Array.from({length:n},(_,k)=>(i+k)%n); plPos=0; playTrack();
}
audio.addEventListener('ended', nextTrack);

function duck(){ if(musicOn){ try{audio.volume=0.25;}catch(e){} } }
function restore(){ if(musicOn){ try{audio.volume=1;}catch(e){} } }
function toggleMusic(){
  if(!musicStarted){ startPlaylistFrom(0); return; }
  if(musicOn){ audio.pause(); setPlaying(false); }
  else { audio.play().then(()=>setPlaying(true)).catch(()=>{}); }
}

/* painel do mini-player: abre/fecha ao clicar na barrinha */
const npHead=$('#npHead');
function togglePanel(){ const open=player.classList.toggle('open'); if(npHead) npHead.setAttribute('aria-expanded', open?'true':'false'); blip(); }
if(npHead){
  npHead.addEventListener('click', togglePanel);
  npHead.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); togglePanel(); } });
}
(function(){
  const tg=$('#npToggle'), pv=$('#npPrev'), nx=$('#npNext');
  if(tg) tg.addEventListener('click', e=>{ e.stopPropagation(); toggleMusic(); });
  if(pv) pv.addEventListener('click', e=>{ e.stopPropagation(); blip(); prevTrack(); });
  if(nx) nx.addEventListener('click', e=>{ e.stopPropagation(); blip(); nextTrack(); });
})();

/* barra de progresso + seek */
function fmtT(s){ s=Math.max(0,Math.floor(s||0)); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
audio.addEventListener('timeupdate', ()=>{
  const d=audio.duration||0, c=audio.currentTime||0;
  const f=$('#npSeekFill'); if(f) f.style.width=(d?Math.min(100,(c/d)*100):0)+'%';
  const cur=$('#npCur'); if(cur) cur.textContent=fmtT(c);
  const dur=$('#npDur'); if(dur) dur.textContent=d?fmtT(d):'—:—';
});
(function(){
  const seek=$('#npSeek'); if(!seek) return;
  seek.addEventListener('click', e=>{
    if(!audio.duration) return;
    const r=seek.getBoundingClientRect();
    const pct=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));
    try{ audio.currentTime=pct*audio.duration; }catch(_e){}
  });
})();

/* ---------- PICKER terminal: ela "loga" escolhendo a 1ª música ---------- */
let pickerInited=false, pickerDone=false;
function runPicker(){
  if(pickerInited) return; pickerInited=true;
  const pk=CONFIG.picker||{};
  const host=HOST;
  const body=$('#pkBody'), titleEl=$('#pkTitle');
  if(titleEl) titleEl.textContent=host+': ~/trilha-sonora';
  if(!body) return;
  const reduce=prefersReduce, N=PLAYLIST.length;
  const tpl=s=>String(s||'').replace(/\{n\}/g, N);
  const line=(html,cls)=>{ const d=document.createElement('div'); d.className='ln'+(cls?' '+cls:''); d.innerHTML=html; body.appendChild(d); requestAnimationFrame(()=>d.classList.add('show')); body.scrollTop=body.scrollHeight; return d; };

  if(!N){ pickerDone=true; nextScene(); return; }   // sem playlist: pula direto

  function hot(i){ body.querySelectorAll('.pk-trk').forEach(r=>r.classList.toggle('hot', +r.dataset.i===i)); }
  function select(i){
    if(pickerDone) return; pickerDone=true; blip(); buzz(14);
    const t=PLAYLIST[i], il=body.querySelector('.pk-input');
    if(il){ il.classList.remove('pk-input'); il.innerHTML='<span class="prompt">'+host+':~$</span> '+(pk.playCmd||'play')+' '+(i+1); }
    body.querySelectorAll('.pk-trk').forEach(r=>{ r.style.cursor='default'; r.classList.toggle('sel', +r.dataset.i===i); });
    line('<span class="amber">'+(pk.tocando||'▸ tocando:')+'</span> '+(t.titulo||'')+' <span class="dim">— '+(t.artista||'')+'</span>');
    startPlaylistFrom(i);
    const load=line('<span class="dim">'+(pk.carregando||'carregando...')+'</span> ........ ');
    setTimeout(()=>{ load.innerHTML+='<span class="ok">ok</span>'; }, reduce?0:520);
    setTimeout(()=>{ nextScene(); }, reduce?80:1050);
  }

  // 1) cabeçalho (ls) + 2) lista de faixas + 3) prompt de seleção
  line('<span class="prompt">'+host+':~$</span> '+(pk.lsCmd||'ls ./trilha-sonora'));
  line('<span class="dim">'+tpl(pk.intro||'{n} faixas encontradas')+'</span>');
  const list=document.createElement('div'); list.className='pk-tracks'; body.appendChild(list);
  PLAYLIST.forEach((t,i)=>{
    const row=document.createElement('div'); row.className='pk-trk'; row.dataset.i=i; row.setAttribute('role','button'); row.tabIndex=0;
    row.innerHTML='<span class="pk-num">'+(i+1)+'</span><span class="pk-file"></span><span class="pk-who"></span>';
    row.querySelector('.pk-file').textContent=t.arquivo ? t.arquivo.split('/').pop() : ('faixa'+(i+1)+'.mp3');
    row.querySelector('.pk-who').textContent=t.artista||'';
    row.addEventListener('click', ()=>select(i));
    row.addEventListener('mouseenter', ()=>hot(i));
    row.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); select(i); } });
    list.appendChild(row);
    setTimeout(()=>row.classList.add('show'), reduce?0:(90*i));
  });
  setTimeout(()=>{
    const d=document.createElement('div'); d.className='ln pk-input show';
    d.innerHTML='<span class="prompt"><b>'+host+'</b>:~$ '+(pk.playCmd||'play')+' </span><input id="pkCmd" autocomplete="off" spellcheck="false" inputmode="numeric" aria-label="número da faixa"><span class="pk-cur"></span>';
    body.appendChild(d); body.scrollTop=body.scrollHeight;
    const inp=$('#pkCmd'); if(inp){ setTimeout(()=>{ try{inp.focus();}catch(e){} }, 60);
      inp.addEventListener('input', ()=>{ key(); const n=parseInt(inp.value,10); if(n>=1&&n<=N) hot(n-1); });
      inp.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); const n=parseInt(inp.value.trim(),10);
        if(n>=1&&n<=N){ select(n-1); } else { line('<span class="err">› '+tpl(pk.invalida||'faixa inválida. digita um número de 1 a {n}.')+'</span>'); inp.value=''; } } });
    }
  }, reduce?0:(90*N+220));
}

/* ---------- confete (estoura de uma origem) ---------- */
function celebrate(ox,oy){
  const cv=$('#confetti'); cv.style.display='block';
  const ctx=cv.getContext('2d'); cv.width=innerWidth; cv.height=innerHeight;
  const cx=(ox==null)?cv.width/2:ox, cy=(oy==null)?cv.height/3:oy;
  const colors=['#4fd6c2','#f2b25c','#ff8aa0','#7fb0ff','#f3eee7','#5af78e'];
  const parts=Array.from({length:190},()=>{
    const ang=-Math.PI/2+(Math.random()-0.5)*Math.PI*1.15, sp=5+Math.random()*11;
    return { x:cx,y:cy, r:4+Math.random()*7, c:colors[(Math.random()*colors.length)|0], vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp, a:Math.random()*6.28, va:-.2+Math.random()*.4 };
  });
  let t=0; const grav=0.16;
  (function loop(){
    ctx.clearRect(0,0,cv.width,cv.height);
    parts.forEach(p=>{ p.vy+=grav; p.x+=p.vx; p.y+=p.vy; p.a+=p.va; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillStyle=p.c; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6); ctx.restore(); });
    t++; if(t<300) requestAnimationFrame(loop); else cv.style.display='none';
  })();
}
window.addEventListener('resize',()=>{const cv=$('#confetti');cv.width=innerWidth;cv.height=innerHeight;});

/* ---------- SONAR / RADAR 🦈 ---------- */
fill('#sonarEyebrow', CONFIG.sonar.eyebrow);
fill('#sonarTitle', CONFIG.sonar.titulo);
fill('#sonarSub', CONFIG.sonar.sub);
$('#sonarBtn').textContent = CONFIG.sonar.botao;
$('#sonarTag').textContent = CONFIG.sonar.alvo;
$('#sonarCap').innerHTML = CONFIG.sonar.legenda + '<small>'+CONFIG.sonar.legendaSub+'</small>';
let sonarStarted=false;
function initSonar(){
  if(sonarStarted) return; sonarStarted=true;
  const cv=$('#sonarCanvas'); if(!cv) return;
  const ctx=cv.getContext('2d'); const reduce=prefersReduce;
  const target=$('#sonarTarget');
  const N=cv.width, C=N/2, R=C-16;
  const tAng=-Math.PI*0.32, tDist=R*0.6;
  const decoys=Array.from({length:7},()=>({ang:Math.random()*6.2832,dist:R*(0.25+Math.random()*0.7),lit:0}));
  let sweep=-Math.PI/2, found=false, scanning=true, scanStart=Date.now();
  (function place(){ const tx=C+Math.cos(tAng)*tDist, ty=C+Math.sin(tAng)*tDist; target.style.left=(tx/N*100)+'%'; target.style.top=(ty/N*100)+'%'; })();
  function typeReadout(){ const el=$('#sonarReadout'); el.innerHTML=''; let i=0;
    (function step(){ if(i>=CONFIG.sonar.readout.length) return; const d=document.createElement('div'); d.innerHTML=CONFIG.sonar.readout[i]; el.appendChild(d); i++; setTimeout(step,420); })(); }
  function reveal(){ $('#sonarCap').classList.add('on'); }
  function ring(r){ ctx.beginPath(); ctx.arc(C,C,r,0,6.2832); ctx.strokeStyle='rgba(79,214,194,.18)'; ctx.lineWidth=1; ctx.stroke(); }
  function draw(){
    ctx.clearRect(0,0,N,N);
    const g=ctx.createRadialGradient(C,C,0,C,C,R); g.addColorStop(0,'rgba(79,214,194,.06)'); g.addColorStop(1,'rgba(4,5,10,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(C,C,R,0,6.2832); ctx.fill();
    [0.32,0.6,0.85,1].forEach(f=>ring(R*f));
    ctx.strokeStyle='rgba(79,214,194,.12)'; ctx.beginPath(); ctx.moveTo(C-R,C); ctx.lineTo(C+R,C); ctx.moveTo(C,C-R); ctx.lineTo(C,C+R); ctx.stroke();
    ctx.beginPath(); ctx.arc(C,C,R,0,6.2832); ctx.strokeStyle='rgba(79,214,194,.4)'; ctx.lineWidth=1.5; ctx.stroke();
    const lg=ctx.createRadialGradient(C,C,0,C,C,R); lg.addColorStop(0,'rgba(79,214,194,.30)'); lg.addColorStop(1,'rgba(79,214,194,0)');
    ctx.save(); ctx.beginPath(); ctx.moveTo(C,C); ctx.arc(C,C,R,sweep-0.55,sweep); ctx.closePath(); ctx.fillStyle=lg; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(C,C); ctx.lineTo(C+Math.cos(sweep)*R,C+Math.sin(sweep)*R); ctx.strokeStyle='rgba(122,247,180,.8)'; ctx.lineWidth=2; ctx.stroke();
    decoys.forEach(d=>{ let da=Math.abs(((sweep-d.ang+Math.PI*3)%6.2832)-Math.PI); if(da<0.12)d.lit=1; else d.lit*=0.94;
      if(d.lit>0.02){ const x=C+Math.cos(d.ang)*d.dist,y=C+Math.sin(d.ang)*d.dist; ctx.beginPath(); ctx.arc(x,y,2.5,0,6.2832); ctx.fillStyle='rgba(144,155,173,'+(d.lit*0.7)+')'; ctx.fill(); } });
    let ta=Math.abs(((sweep-tAng+Math.PI*3)%6.2832)-Math.PI);
    if(ta<0.12 && scanning && Date.now()-scanStart>900) found=true;
    if(found){ const x=C+Math.cos(tAng)*tDist,y=C+Math.sin(tAng)*tDist; ctx.beginPath(); ctx.arc(x,y,6,0,6.2832); ctx.fillStyle='rgba(79,214,194,.9)'; ctx.fill();
      ctx.beginPath(); ctx.arc(x,y,11,0,6.2832); ctx.strokeStyle='rgba(79,214,194,.5)'; ctx.lineWidth=1.5; ctx.stroke(); target.classList.add('on');
      if(scanning){ scanning=false; reveal(); } }
    if(!reduce){ sweep+=0.045; requestAnimationFrame(draw); }
  }
  function scan(){ found=false; scanning=true; scanStart=Date.now(); target.classList.remove('on'); $('#sonarCap').classList.remove('on'); typeReadout(); if(reduce){ found=true; target.classList.add('on'); reveal(); draw(); } }
  $('#sonarBtn').addEventListener('click', ()=>{ blip(); scan(); });
  if(reduce){ scan(); draw(); } else { typeReadout(); draw(); }
}

/* ---------- VERSÍCULOS (tempo · amor · espera) ---------- */
(function(){
  const V=CONFIG.versiculos; if(!V) return;
  $('#versesEyebrow').textContent=V.eyebrow;
  $('#versesTitle').textContent=V.titulo;
  $('#versesIntro').textContent=V.intro;
  const wrap=$('#vstack'); if(!wrap) return;
  (V.itens||[]).forEach(v=>{
    const c=document.createElement('div'); c.className='vcard'+(v.fav?' fav':'');
    c.innerHTML='<div class="vref">'+v.ref+(v.fav?'<span class="vfav-tag">'+(v.favTag||'o favorito dela')+'</span>':'')+'</div>'+
      '<p class="vtext">\u201C'+v.texto+'\u201D</p>'+
      '<p class="vnote">'+v.nota+'</p>';
    wrap.appendChild(c);
  });
})();
let versesShown=false;
function runVerses(){
  if(versesShown) return; versesShown=true;
  document.querySelectorAll('#vstack .vcard').forEach((c,i)=> setTimeout(()=>{ c.classList.add('show'); blip(); }, 260+i*620));
}

/* ---------- VOCÊ NUNCA VAI ESTAR SOZINHA (amada) ---------- */
(function(){
  const A=CONFIG.amada; if(!A) return;
  const set=(sel,txt)=>{ const e=$(sel); if(e) e.textContent=txt; };
  set('#amadaEyebrow', A.eyebrow); set('#amadaTitle', A.titulo); set('#amadaIntro', A.intro);
  set('#amadaMuralLabel', A.muralLabel||'');
  const total=((A.destaques&&A.destaques.length)||0)+((A.mural&&A.mural.length)||0);
  set('#amadaTally', (A.tally||'').replace('{n}', total));
  set('#amadaBridge', A.bridge||'');

  // --- destaques: cards completos (foto + recado que digita + assinatura + áudio opcional) ---
  const dWrap=$('#amadaDestaques');
  (A.destaques||[]).forEach(w=>{
    const card=document.createElement('div'); card.className='am-card';
    const head=document.createElement('button'); head.className='am-head'; head.type='button';
    head.setAttribute('aria-expanded','false');
    head.innerHTML='<span class="am-seal">🔒</span>'+
      '<span class="am-meta"><span class="am-tag">'+w.relacao+'</span>'+
      '<span class="am-name">'+w.nome+'</span></span>'+
      '<span class="am-cta">'+(A.abrir||'abrir →')+'</span>';
    const body=document.createElement('div'); body.className='am-body';
    const inner=document.createElement('div'); inner.className='am-inner';
    const photo=document.createElement('div'); photo.className='am-photo';
    const ph='<div class="am-ph">🫶</div>';
    if(w.foto){ const img=document.createElement('img'); img.src=w.foto; img.alt=w.nome; img.onerror=()=>{ photo.innerHTML=ph; }; photo.appendChild(img); }
    else { photo.innerHTML=ph; }
    const col=document.createElement('div'); col.className='am-col';
    const txt=document.createElement('p'); txt.className='am-text'; col.appendChild(txt);
    if(w.audio){
      const box=document.createElement('div'); box.className='am-audio';
      const pb=document.createElement('button'); pb.className='am-play'; pb.type='button'; pb.textContent='▶';
      pb.setAttribute('aria-label','ouvir o áudio de '+w.nome);
      const bars=document.createElement('div'); bars.className='am-bars'; bars.innerHTML='<span></span>'.repeat(12);
      const tEl=document.createElement('span'); tEl.className='am-time'; tEl.textContent='0:00';
      box.appendChild(pb); box.appendChild(bars); box.appendChild(tEl);
      const au=new Audio(w.audio); let tmr=null, secs=0;
      const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
      const stop=()=>{ box.classList.remove('playing'); pb.textContent='▶'; clearInterval(tmr); tmr=null; restore(); };
      pb.addEventListener('click', ev=>{ ev.stopPropagation();
        if(box.classList.contains('playing')){ au.pause(); stop(); return; }
        box.classList.add('playing'); pb.textContent='❚❚'; duck(); au.play().catch(()=>{}); secs=0;
        tmr=setInterval(()=>{ secs+=1; tEl.textContent=fmt(au.duration&&!isNaN(au.duration)?au.currentTime:secs); if(!au.duration&&secs>=9) stop(); }, 1000);
      });
      au.addEventListener('ended', stop);
      col.appendChild(box);
    }
    const foot=document.createElement('div'); foot.className='am-foot';
    foot.innerHTML='<span class="am-sign">'+(w.assinatura||w.nome)+'</span><span class="am-withlove">com amor</span>';
    inner.appendChild(photo); inner.appendChild(col); inner.appendChild(foot);
    body.appendChild(inner); card.appendChild(head); card.appendChild(body); dWrap.appendChild(card);

    let opened=false;
    function typeOut(el,text,done){
      el.textContent=''; const cur=document.createElement('span'); cur.className='tw-cursor'; el.appendChild(cur); let ci=0;
      (function st(){ if(ci<text.length){ el.textContent=text.slice(0,ci+1); el.appendChild(cur); if(text[ci]!==' ') key(); ci++; setTimeout(st,18+Math.random()*22); } else { el.textContent=text; if(done) done(); } })();
    }
    head.addEventListener('click', ()=>{
      if(opened){ card.classList.remove('open','revealed'); head.setAttribute('aria-expanded','false'); head.querySelector('.am-cta').textContent=A.abrir||'abrir →'; head.querySelector('.am-seal').textContent='🔒'; opened=false; return; }
      opened=true; blip(); card.classList.add('open'); head.setAttribute('aria-expanded','true');
      head.querySelector('.am-cta').textContent=A.aberto||'aberto 💛'; head.querySelector('.am-seal').textContent='💛';
      typeOut(txt, w.texto, ()=>card.classList.add('revealed'));
    });
  });

  // --- mural: recados curtos (foto opcional -> inicial no círculo) ---
  const mWrap=$('#amadaMural');
  (A.mural||[]).forEach(m=>{
    const c=document.createElement('div'); c.className='m-card';
    const av=document.createElement('div'); av.className='m-avatar';
    if(m.foto){ const img=document.createElement('img'); img.src=m.foto; img.alt=m.nome; img.onerror=()=>{ img.remove(); av.textContent=(m.nome||'?').charAt(0); }; av.appendChild(img); }
    else { av.textContent=(m.nome||'?').charAt(0); }
    const b=document.createElement('div'); b.className='m-body';
    b.innerHTML='<div class="m-name">'+m.nome+'</div><div class="m-tag">'+(m.grupo||'')+'</div><div class="m-quote">'+m.quote+'</div>';
    c.appendChild(av); c.appendChild(b); mWrap.appendChild(c);
  });
})();
let amadaShown=false;
function runAmada(){
  if(amadaShown) return; amadaShown=true;
  const cards=document.querySelectorAll('#amadaMural .m-card');
  cards.forEach((c,i)=> setTimeout(()=>{ c.classList.add('show'); blip(); }, 240+i*130));
  const after=240+cards.length*130+300;
  const tally=$('#amadaTally'); if(tally) setTimeout(()=>tally.classList.add('show'), after);
  const bridge=$('#amadaBridge'); if(bridge) setTimeout(()=>bridge.classList.add('show'), after+520);
}

/* ---------- INGRESSO surpresa (Evento lacrada que ela revela) ---------- */
(function(){
  const I=CONFIG.ingresso; if(!I) return;
  $('#ingEyebrow').textContent=I.eyebrow; $('#ingTitle').textContent=I.titulo; $('#ingSub').textContent=I.sub;
  $('#ingKicker').textContent=I.kicker; $('#ingEvent').textContent=I.evento; $('#ingTagline').textContent=I.tagline;
  $('#ingDate').textContent=I.data; $('#ingPlace').textContent=I.lugar; $('#ingSeats').textContent=I.lugares;
  $('#ingAdmit').textContent=I.admite; $('#ingStamp').textContent=I.carimbo; $('#ingLock').textContent=I.lacrado;
  $('#ingFoot').textContent=I.rodape; $('#ingReveal').textContent=I.revelar;
  const bEl=$('#ingBonus');
  if(bEl){ if(I.bonus){ bEl.textContent=I.bonus; } else { bEl.style.display='none'; } }
})();
/* O ingresso só se revela no toque — de propósito. A surpresa é dela. */
let ingRevealed=false, ingTimer=null;
function revealIngresso(){
  if(ingRevealed) return; ingRevealed=true;
  if(ingTimer){ clearTimeout(ingTimer); ingTimer=null; }
  const card=$('#ticketCard'); if(!card) return;
  card.classList.remove('locked'); card.classList.add('revealed');
  $('#ingLock').textContent='';
  setTimeout(()=>{ const s=$('#ingStamp'); if(s) s.classList.add('show'); }, 460);
  setTimeout(()=>{ const b=$('#ingBonus'); if(b) b.classList.add('show'); }, 620);
  setTimeout(()=>{ const f=$('#ingFoot'); if(f) f.classList.add('show'); }, 760);
  const rb=$('#ingReveal'); if(rb){ rb.textContent=CONFIG.ingresso.revelado; rb.disabled=true; rb.style.opacity=.7; }
  const nx=$('#ingNext'); if(nx){ nx.style.opacity=1; nx.style.pointerEvents='auto'; }
  yaySfx(); buzz([30,40,60]);
  if(typeof unlockEventoPin==='function') unlockEventoPin();   // destrava o pino-segredo no mapa
  const r=card.getBoundingClientRect(); celebrate(r.left+r.width/2, r.top+r.height/2);
}
(function(){
  const rb=$('#ingReveal'); if(rb) rb.addEventListener('click', ()=>{ blip(); revealIngresso(); });
  const card=$('#ticketCard'); if(card) card.addEventListener('click', revealIngresso);
})();

/* ---------- EVENTO: contagem regressiva (config.evento) ---------- */
fill('#eventoEyebrow', CONFIG.evento.eyebrow);
fill('#eventoTitle', CONFIG.evento.titulo);
fill('#eventoLegend', CONFIG.evento.legenda);
let eventoTimer=null;
function startEvento(){
  const grid=$('#eventoGrid'); if(!grid) return;
  const alvo=new Date(CONFIG.evento.data).getTime();
  function tick(){
    let diff=alvo-Date.now();
    if(isNaN(alvo) || diff<=0){ grid.innerHTML=''; $('#eventoLegend').textContent=CONFIG.evento.esgotado; if(eventoTimer){ clearInterval(eventoTimer); eventoTimer=null; } return; }
    const d=Math.floor(diff/86400000); diff-=d*86400000;
    const h=Math.floor(diff/3600000); diff-=h*3600000;
    const mi=Math.floor(diff/60000); diff-=mi*60000;
    const s=Math.floor(diff/1000);
    const cells=[[d,'dias'],[h,'horas'],[mi,'min'],[s,'seg']];
    grid.innerHTML=cells.map(c=>'<div class="counter-cell"><div class="counter-num">'+String(c[0]).padStart(2,'0')+'</div><div class="counter-lbl">'+c[1]+'</div></div>').join('');
  }
  tick(); if(eventoTimer) clearInterval(eventoTimer); eventoTimer=setInterval(tick,1000);
}

/* ---------- ESC fecha o lightbox ---------- */
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ closeLightbox(); }
});

/* ---------- FUNDO: oceano em movimento (raios de luz + partículas) ---------- */
let seaStarted=false;
function initSea(){
  if(seaStarted) return; seaStarted=true;
  const cv=$('#seaCanvas'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W,H,DPR,beamSprite,beams=[],parts=[],stars=[],petals=[],raf=null;

  // sprite de um raio: macio nas laterais, some pra baixo
  function buildBeam(){
    const w=160,h=1000,s=document.createElement('canvas'); s.width=w; s.height=h;
    const c=s.getContext('2d');
    const gx=c.createLinearGradient(0,0,w,0);
    gx.addColorStop(0,'rgba(255,255,255,0)');
    gx.addColorStop(.5,'rgba(205,230,255,1)');
    gx.addColorStop(1,'rgba(255,255,255,0)');
    c.fillStyle=gx; c.fillRect(0,0,w,h);
    const gy=c.createLinearGradient(0,0,0,h);
    gy.addColorStop(0,'rgba(0,0,0,1)');
    gy.addColorStop(.12,'rgba(0,0,0,1)');
    gy.addColorStop(1,'rgba(0,0,0,0)');
    c.globalCompositeOperation='destination-in'; c.fillStyle=gy; c.fillRect(0,0,w,h);
    return s;
  }
  function setup(){
    DPR=Math.min(2, window.devicePixelRatio||1);
    W=cv.clientWidth||window.innerWidth; H=cv.clientHeight||window.innerHeight;
    cv.width=Math.floor(W*DPR); cv.height=Math.floor(H*DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    beamSprite=buildBeam();
    const n = W<700?4:6;
    beams=Array.from({length:n},(_,i)=>{
      const x = W*(0.10+ (0.82/(n-1))*i) + (Math.random()*50-25);
      return { x, angle:(x/W-0.34)*0.55, w:80+Math.random()*130, len:H*(1.1+Math.random()*0.25),
               a:0.05+Math.random()*0.06, sway:0.12+Math.random()*0.30, phase:Math.random()*6.28, drift:10+Math.random()*22 };
    });
    parts=Array.from({length: W<700?34:60},()=>({
      x:Math.random()*W, y:Math.random()*H, r:0.5+Math.random()*1.9,
      vy:-(2+Math.random()*7)/100, vx:(Math.random()*2-1)/100,
      a:0.12+Math.random()*0.45, tw:Math.random()*6.28, tws:0.4+Math.random()*1.1 }));
    // clima: estrelas (lua) e pétalas (ouro) — coords normalizadas (0..1)
    stars=Array.from({length:70},()=>({x:Math.random(),y:Math.random()*0.72,r:0.4+Math.random()*1.5,ph:Math.random()*6.28}));
    petals=Array.from({length:18},()=>({x:Math.random(),y:Math.random(),r:5+Math.random()*7,rot:Math.random()*6.28,vr:-.02+Math.random()*.04,vy:.0008+Math.random()*.0014,vx:-.0004+Math.random()*.0008}));
  }
  function frame(t){
    const time=t/1000;
    seaDepth += (seaTargetDepth - seaDepth)*0.02;
    seaMoon += (seaMoonT - seaMoon)*0.04;
    seaGold += (seaGoldT - seaGold)*0.04;
    const dep=seaDepth;
    ctx.clearRect(0,0,W,H);
    // escurece quando estamos no fundo (contraste maior = subida legível)
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='rgba(2,4,10,'+(0.65*(1-dep)).toFixed(3)+')'; ctx.fillRect(0,0,W,H);
    // brilho da superfície (mais forte conforme sobe)
    const top=ctx.createLinearGradient(0,0,0,H*0.7);
    top.addColorStop(0,'rgba(86,148,196,'+(0.04+dep*0.30).toFixed(3)+')');
    top.addColorStop(1,'rgba(86,148,196,0)');
    ctx.fillStyle=top; ctx.fillRect(0,0,W,H);
    // raios de luz (mais intensos rumo à superfície)
    ctx.globalCompositeOperation='lighter';
    const beamK=0.25+dep*1.5;
    for(const b of beams){
      const swayX=Math.sin(time*b.sway+b.phase)*b.drift;
      ctx.save();
      ctx.translate(b.x+swayX,-50); ctx.rotate(b.angle);
      ctx.globalAlpha=b.a*beamK*(0.7+0.3*Math.sin(time*b.sway*0.8+b.phase));
      ctx.drawImage(beamSprite,-b.w/2,0,b.w,b.len);
      ctx.restore();
    }
    // partículas (plâncton subindo)
    for(const p of parts){
      p.y+=p.vy; p.x+=p.vx; p.tw+=0.02*p.tws;
      if(p.y<-6){ p.y=H+6; p.x=Math.random()*W; }
      if(p.x<-6)p.x=W+6; if(p.x>W+6)p.x=-6;
      ctx.globalAlpha=p.a*(0.45+0.55*Math.sin(p.tw));
      ctx.fillStyle='rgba(200,225,255,1)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.2832); ctx.fill();
    }
    ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';

    // ---- CLIMA da cena: noite enluarada (lua) / dourado com pétalas (girassol) ----
    if(seaMoon>0.01){
      const mg=ctx.createLinearGradient(0,0,0,H);
      mg.addColorStop(0,'rgba(18,26,60,'+(0.62*seaMoon).toFixed(3)+')');
      mg.addColorStop(1,'rgba(6,9,20,'+(0.5*seaMoon).toFixed(3)+')');
      ctx.fillStyle=mg; ctx.fillRect(0,0,W,H);
      const halo=ctx.createRadialGradient(W*0.5,H*0.16,0,W*0.5,H*0.16,H*0.55);
      halo.addColorStop(0,'rgba(190,214,235,'+(0.14*seaMoon).toFixed(3)+')'); halo.addColorStop(1,'rgba(190,214,235,0)');
      ctx.fillStyle=halo; ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='lighter';
      for(const s of stars){ ctx.globalAlpha=(0.35+0.55*Math.abs(Math.sin(time*1.5+s.ph)))*seaMoon;
        ctx.fillStyle='rgba(224,236,248,1)'; ctx.beginPath(); ctx.arc(s.x*W,s.y*H,s.r,0,6.2832); ctx.fill(); }
      ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';
    }
    if(seaGold>0.01){
      const gg=ctx.createLinearGradient(0,0,0,H);
      gg.addColorStop(0,'rgba(60,46,18,'+(0.5*seaGold).toFixed(3)+')');
      gg.addColorStop(1,'rgba(22,15,6,'+(0.5*seaGold).toFixed(3)+')');
      ctx.fillStyle=gg; ctx.fillRect(0,0,W,H);
      const warm=ctx.createRadialGradient(W*0.5,H*0.86,0,W*0.5,H*0.86,H*0.72);
      warm.addColorStop(0,'rgba(247,201,72,'+(0.16*seaGold).toFixed(3)+')'); warm.addColorStop(1,'rgba(247,201,72,0)');
      ctx.fillStyle=warm; ctx.fillRect(0,0,W,H);
      for(const p of petals){ p.rot+=p.vr; p.y+=p.vy; p.x+=p.vx; if(p.y>1.05){ p.y=-0.05; p.x=Math.random(); }
        ctx.save(); ctx.globalAlpha=0.5*seaGold; ctx.translate(p.x*W,p.y*H); ctx.rotate(p.rot);
        ctx.fillStyle='#f2b25c'; ctx.beginPath(); ctx.ellipse(0,0,p.r,p.r*0.42,0,0,6.2832); ctx.fill(); ctx.restore(); }
      ctx.globalAlpha=1;
    }
    if(!reduce) raf=requestAnimationFrame(frame);
  }
  setup();
  if(reduce) frame(0); else raf=requestAnimationFrame(frame);
  let rz; window.addEventListener('resize', ()=>{ clearTimeout(rz); rz=setTimeout(setup,200); });
}

/* ---------- v3.0: entradas encadeadas, parallax e tilt ---------- */
/* stagger: cada filho direto da cena ganha um índice --i usado no delay do CSS */
(function(){
  document.querySelectorAll('.scene .scene-inner').forEach(inner=>{
    Array.from(inner.children).forEach((c,i)=> c.style.setProperty('--i', Math.min(i,6)));
  });
})();

/* parallax sutil do conteúdo seguindo o mouse (desktop; respeita reduced-motion) */
(function(){
  if(prefersReduce) return;
  if(!(window.matchMedia && window.matchMedia('(pointer:fine)').matches)) return;
  const stage=$('#stage'); if(!stage) return;
  let tx=0,ty=0,cx=0,cy=0,raf=null;
  function tick(){
    cx+=(tx-cx)*0.08; cy+=(ty-cy)*0.08;
    stage.style.setProperty('--px',cx.toFixed(4));
    stage.style.setProperty('--py',cy.toFixed(4));
    if(Math.abs(tx-cx)>0.001||Math.abs(ty-cy)>0.001) raf=requestAnimationFrame(tick); else raf=null;
  }
  window.addEventListener('mousemove', e=>{
    tx=(e.clientX/window.innerWidth-0.5); ty=(e.clientY/window.innerHeight-0.5);
    if(!raf) raf=requestAnimationFrame(tick);
  }, {passive:true});
})();

/* tilt 3D dos polaroids no hover (some ao virar/clicar) */
(function(){
  if(prefersReduce) return;
  const g=$('#gallery'); if(!g) return;
  g.addEventListener('pointermove', e=>{
    const card=e.target.closest('.polaroid');
    if(!card || card.classList.contains('flipped')) return;
    const r=card.getBoundingClientRect();
    const rx=((e.clientY-r.top)/r.height-0.5)*-8;
    const ry=((e.clientX-r.left)/r.width-0.5)*10;
    card.style.transform='perspective(950px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) translateY(-4px)';
  }, {passive:true});
  ['pointerout','pointerleave'].forEach(ev=> g.addEventListener(ev, e=>{
    const card=e.target.closest('.polaroid'); if(card) card.style.transform='';
  }, {passive:true}));
  g.addEventListener('click', e=>{
    const card=e.target.closest('.polaroid'); if(card) card.style.transform='';
  });
})();

/* ---------- start (+ MODO ENSAIO: abre com ?cena=nome pra pular direto) ----------
   ex.: index.html?cena=ask · ?cena=lua · ?cena=contrato
   Só pra você testar — sem o parâmetro, o site roda normal do boot. */
(function(){
  let alvo=null;
  try{ alvo=new URLSearchParams(location.search).get('cena'); }catch(e){}
  if(alvo && scenes.includes(alvo) && alvo!=='boot'){
    launched=true; bootArmed=true;
    document.body.classList.add('launched');
    updateStatus(); initSea(); preloadAssets();
    show(alvo);
    try{ console.log('[nós.exe] modo ensaio · cena: '+alvo+'\ncenas: '+scenes.join(' · ')); }catch(e){}
    return;
  }
  runBoot();
})();
