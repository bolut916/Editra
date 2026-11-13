/* ================= STÜDYO 19: Hareket Tasarımcısı (timeline, keyframe, ease, hareket bulanıklığı, morph) ================= */
(function(){
const X=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const EASE={linear:t=>t,in:t=>t*t*t,out:t=>1-Math.pow(1-t,3),inout:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,back:t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)},bounce:t=>{const n=7.5625,d=2.75;if(t<1/d)return n*t*t;if(t<2/d){t-=1.5/d;return n*t*t+.75}if(t<2.5/d){t-=2.25/d;return n*t*t+.9375}t-=2.625/d;return n*t*t+.984375}};
const ENAME={linear:'Doğrusal',in:'Ease in (yavaş başla)',out:'Ease out (yavaş bitir)',inout:'Ease in-out',back:'Geri tepme',bounce:'Zıplama'};
const KEYS=['dx','dy','sc','rot','op','bl','rad'];
const DEF={dx:0,dy:0,sc:1,rot:0,op:100,bl:0,rad:null};
const MO={t:0,play:false,el:null,sel:-1,fps:30,raf:0,W:560};
const dur=()=>Math.max(500,Math.min(60000,(PROJ&&PROJ.mdur)||4000));
const sortK=mo=>{mo.kf.sort((a,b)=>a.t-b.t);return mo};
function valAt(mo,t){const K=mo&&mo.kf;if(!K||!K.length)return null;if(t<=K[0].t)return K[0];const L=K[K.length-1];if(t>=L.t)return L;let i=0;while(i<K.length-2&&K[i+1].t<=t)i++;const a=K[i],b=K[i+1],u=(EASE[b.ease]||EASE.inout)((t-a.t)/Math.max(1,b.t-a.t)),o={};
 KEYS.forEach(k=>{const A=a[k],B=b[k];if(k==='rad'){o[k]=(A==null&&B==null)?null:(A==null?B:B==null?A:A+(B-A)*u);return}const x=A==null?DEF[k]:A,y=B==null?DEF[k]:B;o[k]=x+(y-x)*u});return o}
/* sahnede geçici olarak değer uygula, çiz, geri al */
function frame(t,W){const rest=[];
 S.els.forEach(e=>{if(!e.on||!e.mo||!e.mo.kf||!e.mo.kf.length)return;const v=valAt(e.mo,t);if(!v)return;const o={dx:e.dx,dy:e.dy,rot:e.rot,op:e.op,lb:e.lb,fr:e.fr,pin:e.pin,fs:e.fs,rad:e.rad,pos:e.pos};
  let bl=+v.bl||0;if(e.mo.mb){const p=valAt(e.mo,Math.max(0,t-33));if(p){const sp=Math.hypot((v.dx||0)-(p.dx||0),(v.dy||0)-(p.dy||0))+Math.abs((v.sc||1)-(p.sc||1))*20+Math.abs((v.rot||0)-(p.rot||0))*.15;bl+=Math.min(1.6,sp*1.4)}}
  e.dx=(e.dx||0)+(v.dx||0);e.dy=(e.dy||0)+(v.dy||0);e.rot=(e.rot||0)+(v.rot||0);e.op=(e.op==null?100:e.op)*(v.op==null?100:v.op)/100;if(bl>0)e.lb=(+e.lb||0)+bl;
  if(v.sc!=null&&Math.abs(v.sc-1)>1e-4){const g=geo(e,100),s=Math.max(0,v.sc),nw=g[2]*s,nh=g[3]*s;e.fr=[g[0]+g[2]/2-nw/2,g[1]+g[3]/2-nh/2,nw,nh];e.pin=true;if(e.txt!==undefined)e.fs=(e.fs||1)*s}
  if(v.rad!=null&&e.type=='r')e.rad=v.rad;
  rest.push(()=>{e.dx=o.dx;e.dy=o.dy;e.rot=o.rot;e.op=o.op;if(o.lb===undefined)delete e.lb;else e.lb=o.lb;if(o.fr===undefined)delete e.fr;else e.fr=o.fr;if(o.pin===undefined)delete e.pin;else e.pin=o.pin;e.fs=o.fs;if(o.rad===undefined)delete e.rad;else e.rad=o.rad;e.pos=o.pos})});
 try{return draw(W)}finally{rest.forEach(f=>f())}}
const animated=()=>S.els.filter(e=>e.on&&e.mo&&e.mo.kf&&e.mo.kf.length);
const elName=e=>e.nm||(TY[e.type]?TY[e.type][1]:'Öğe')+(e.txt!==undefined?': '+String(e.txt).replace(/\s+/g,' ').slice(0,18):'');
const cur=()=>S.els.find(e=>e.id===MO.el&&e.on);
/* ---------- hazır hareketler ---------- */
const K=(t,p,ease)=>Object.assign({t,ease:ease||'inout'},DEF,p);
const PRE={
 belir:['Belir',t=>[K(t,{op:0}),K(t+800,{op:100},'out')]],
 kay:['Aşağıdan kay',t=>[K(t,{dy:9,op:0}),K(t+900,{dy:0,op:100},'out')]],
 yakin:['Yakınlaş',t=>[K(t,{sc:.6,op:0}),K(t+900,{sc:1,op:100},'back')]],
 blur:['Bulanıktan netleş',t=>[K(t,{bl:2.4,op:0}),K(t+900,{bl:0,op:100},'out')]],
 pop:['Pop',t=>[K(t,{sc:0,op:0}),K(t+450,{sc:1.15,op:100},'out'),K(t+700,{sc:1},'inout')]],
 suzul:['Süzül (döngü)',t=>[K(t,{}),K(t+1000,{dy:-2.2}),K(t+2000,{dy:0})]],
 salla:['Salla',t=>[K(t,{}),K(t+120,{rot:-4}),K(t+240,{rot:4}),K(t+360,{rot:-3}),K(t+480,{rot:2}),K(t+600,{rot:0})]],
 cik:['Sağa çık',t=>[K(t,{}),K(t+700,{dx:60,op:0},'in')]],
 morph:['Kare → Daire (morph)',t=>[K(t,{rad:0}),K(t+900,{rad:50},'inout')]]};
function presetApply(k){const e=cur();if(!e)return toast('Önce bir öğe seç');const d=dur();let t0=Math.round(MO.t);const kf=PRE[k][1](t0).filter(x=>x.t<=d||true);const maxT=Math.max(...kf.map(x=>x.t));if(maxT>d){PROJ.mdur=Math.min(60000,Math.ceil(maxT/500)*500)}
 if(k==='morph'&&e.type!=='r')return toast('Morph şekil (dikdörtgen) öğesi için: önce bir şekil seç');
 kf.forEach(x=>{if(x.rad==null&&k!=='morph')delete x.rad});e.mo={kf,mb:e.mo?e.mo.mb:0};MO.sel=-1;commit();draw2();toast(PRE[k][0]+' uygulandı')}
function crossMorph(){const L=selEls().filter(x=>x.on);if(L.length<2)return toast('Çapraz morph için iki öğe seç (Shift ile)');const[a,b]=L,t=Math.round(MO.t);
 a.mo={kf:[K(t,{op:100,sc:1}),K(t+900,{op:0,sc:.8},'inout')],mb:0};b.mo={kf:[K(t,{op:0,sc:1.2}),K(t+900,{op:100,sc:1},'inout')],mb:0};MO.el=a.id;commit();draw2();toast('Çapraz morph: A solarken B belirir')}
function commit(){render();try{ed()}catch(e){}hist();ui()}
/* ---------- arayüz ---------- */
function open(){if(!PROJ)return toast('Önce bir proje aç');if(!PROJ.mdur)PROJ.mdur=4000;stop();const s=selEls()[0];MO.el=(s&&s.on)?s.id:(animated()[0]||S.els.find(e=>e.on)||{}).id;MO.t=0;MO.sel=-1;
 let p=document.getElementById('v19mo');if(!p){p=document.createElement('div');p.id='v19mo';p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)close()});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))close()});p.addEventListener('click',onClick);p.addEventListener('input',onInput);p.addEventListener('change',onInput);p.addEventListener('pointerdown',onDown)}
 p.hidden=false;ui();draw2()}
function close(){stop();const p=document.getElementById('v19mo');if(p)p.hidden=true}
function stop(){MO.play=false;cancelAnimationFrame(MO.raf)}
const CSS='<style>.v19{display:grid;gap:10px}.v19r{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.v19r input[type=number]{width:74px}#v19cv{max-width:100%;border:1px solid #8885;border-radius:8px;background:repeating-conic-gradient(#8881 0 25%,transparent 0 50%) 0 0/14px 14px;display:block;margin:auto;max-height:30vh}.v19tl{position:relative;border:1px solid #8885;border-radius:8px;padding:6px 0 4px;user-select:none;touch-action:none}.v19rl{position:relative;height:22px;margin:0 8px 0 130px;border-bottom:1px solid #8884;cursor:ew-resize}.v19rl i{position:absolute;top:10px;width:1px;height:10px;background:#8888}.v19rl b{position:absolute;top:-1px;font-size:10px;font-weight:400;opacity:.7;transform:translateX(-50%)}.v19tr{display:flex;align-items:center;height:26px}.v19tr>span{width:130px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 8px;box-sizing:border-box;cursor:pointer}.v19tr.on>span{font-weight:700}.v19tk{position:relative;flex:1;height:26px;margin-right:8px;cursor:ew-resize}.v19tk em{position:absolute;top:7px;width:11px;height:11px;margin-left:-6px;background:#5b3df5;transform:rotate(45deg);border-radius:2px;cursor:grab}.v19tk em.sel{background:#f59e0b;outline:2px solid #fff6}.v19ph{position:absolute;top:0;bottom:0;width:2px;background:#e63946;margin-left:130px;pointer-events:none}.v19f label{display:flex;flex-direction:column;font-size:11px;opacity:.9}</style>';
function ui(){const p=document.getElementById('v19mo');if(!p)return;const e=cur(),D=dur(),A=animated(),rows=[...new Set([...A,...(e?[e]:[])].map(x=>x.id))].map(id=>S.els.find(x=>x.id===id)).filter(Boolean);
 const ticks=[];for(let t=0;t<=D;t+=D>12000?2000:D>5000?1000:500)ticks.push(t);
 const fv=(e&&valAt(e.mo,MO.t))||DEF,kf=e&&e.mo&&e.mo.kf[MO.sel],cv=kf||fv;const num=(k,l,st,mn,mx)=>`<label>${l}<input type="number" data-f="${k}" step="${st}" min="${mn}" max="${mx}" value="${cv[k]==null?'':+(+cv[k]).toFixed(2)}"></label>`;
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>Hareket tasarımcısı</b><small>Sayfadaki öğelere zaman çizelgesiyle hareket ver · WebM ya da PNG dizisi olarak dışa aktar</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b v19">
  <canvas id="v19cv" width="${MO.W}" height="${Math.round(MO.W/S.fmt)}"></canvas>
  <div class="v19r"><button class="b pr" data-a="play">${MO.play?'⏸ Durdur':'▶ Oynat'}</button><button class="b" data-a="rew">⏮</button><b id="v19t">${(MO.t/1000).toFixed(2)} / ${(D/1000).toFixed(1)} sn</b><label>Süre (sn) <input type="number" data-f="dur" min=".5" max="60" step=".5" value="${D/1000}"></label>
   <label>Öğe <select data-f="el">${S.els.filter(x=>x.on).map(x=>`<option value="${x.id}"${e&&e.id===x.id?' selected':''}>${X(elName(x))}</option>`).join('')}</select></label></div>
  <div class="v19tl" id="v19tl"><div class="v19rl" id="v19rl">${ticks.map(t=>`<i style="left:${t/D*100}%"></i><b style="left:${t/D*100}%">${t/1000}s</b>`).join('')}</div>
   ${rows.map(r=>`<div class="v19tr${e&&e.id===r.id?' on':''}"><span data-row="${r.id}" title="${X(elName(r))}">${X(elName(r))}</span><div class="v19tk" data-trk="${r.id}">${((r.mo&&r.mo.kf)||[]).map((k,i)=>`<em data-kf="${r.id}:${i}" class="${e&&e.id===r.id&&MO.sel===i?'sel':''}" style="left:${k.t/D*100}%" title="${(k.t/1000).toFixed(2)} sn"></em>`).join('')}</div></div>`).join('')||'<div class="mut" style="padding:8px 12px">Bir öğe seç, hazır bir hareket uygula ya da keyframe ekle.</div>'}
   <div class="v19ph" id="v19ph" style="left:calc((100% - 138px) * ${MO.t/D})"></div></div>
  ${e?`<div class="v19f"><div class="v19r">${num('dx','X kaydır','.5','-200','200')}${num('dy','Y kaydır','.5','-200','200')}${num('sc','Ölçek','.05','0','10')}${num('rot','Döndür °','1','-720','720')}${num('op','Saydamlık %','1','0','100')}${num('bl','Bulanıklık','.1','0','10')}${e.type==='r'?num('rad','Köşe (morph)','1','0','50'):''}
   <label>Yumuşatma<select data-f="ease">${Object.entries(ENAME).map(([k,v])=>`<option value="${k}"${(kf?kf.ease:'inout')===k?' selected':''}>${v}</option>`).join('')}</select></label></div>
   <div class="v19r"><button class="b pr" data-a="addkf">${kf?'Keyframe’i güncelle':'Bu ana keyframe ekle'}</button>${kf?'<button class="b" data-a="delkf">Keyframe sil</button>':''}<button class="b" data-a="clr">Öğenin hareketini temizle</button><label><input type="checkbox" data-f="mb"${e.mo&&e.mo.mb?' checked':''}> Hareket bulanıklığı</label></div></div>`:''}
  <div class="v19r"><b>Hazır:</b>${Object.entries(PRE).map(([k,v])=>`<button class="b" data-pre="${k}">${v[0]}</button>`).join('')}<button class="b" data-a="xmorph">Çapraz morph (2 öğe)</button></div>
  <div class="v19r"><b>Dışa aktar:</b><label>Genişlik <select data-f="w"><option>540</option><option selected>720</option><option>1080</option></select></label><label>FPS <select data-f="fps"><option>24</option><option selected>30</option><option>60</option></select></label><button class="b pr" data-a="webm">WebM kaydet</button><button class="b" data-a="png">PNG dizisi (zip)</button></div>
  <small class="mut">Gerçek yol (düğüm) morph’u yok: morph şekiller için köşe yuvarlama (kare↔daire), iki öğe için çapraz geçiş kullanılır. Hareket bulanıklığı yön bağımsız bir bulanıklıktır. WebM kaydı gerçek zamanlı alınır; kayıt bitene kadar sekmeyi açık tut.</small>${CSS}</div></div>`}
function draw2(){const p=document.getElementById('v19mo'),c=p&&p.querySelector('#v19cv');if(!c)return;try{const f=frame(MO.t,MO.W);c.width=f.width;c.height=f.height;c.getContext('2d').drawImage(f,0,0)}catch(e){}
 const th=p.querySelector('#v19t');if(th)th.textContent=(MO.t/1000).toFixed(2)+' / '+(dur()/1000).toFixed(1)+' sn';const ph=p.querySelector('#v19ph');if(ph)ph.style.left=`calc((100% - 138px) * ${MO.t/dur()})`}
function playTick(t0){if(!MO.play)return;const D=dur();MO.t=(performance.now()-t0)%D;draw2();MO.raf=requestAnimationFrame(()=>playTick(t0))}
function play(){if(MO.play){stop();ui();draw2();return}MO.play=true;const t0=performance.now()-MO.t;ui();playTick(t0)}
function addKf(){const e=cur();if(!e)return;const p=document.getElementById('v19mo'),g=k=>{const i=p.querySelector('[data-f="'+k+'"]');return i?i.value:''},o={t:Math.round(MO.t),ease:g('ease')||'inout'};
 KEYS.forEach(k=>{const v=g(k);o[k]=(v===''||v==null)?(k==='rad'?null:DEF[k]):+v});if(e.type!=='r')o.rad=null;
 e.mo=e.mo||{kf:[],mb:0};const same=e.mo.kf.findIndex(x=>Math.abs(x.t-o.t)<20);if(MO.sel>=0&&e.mo.kf[MO.sel]){Object.assign(e.mo.kf[MO.sel],o,{t:e.mo.kf[MO.sel].t})}else if(same>=0){e.mo.kf[same]=o;MO.sel=same}else{e.mo.kf.push(o);sortK(e.mo);MO.sel=e.mo.kf.indexOf(o)}commit();draw2()}
function onClick(ev){const t=ev.target;
 const a=t.closest('[data-a]');if(a){const k=a.dataset.a;if(k==='play')return play();if(k==='rew'){MO.t=0;ui();return draw2()}if(k==='addkf')return addKf();
  if(k==='delkf'){const e=cur();if(e&&e.mo&&MO.sel>=0){e.mo.kf.splice(MO.sel,1);if(!e.mo.kf.length)delete e.mo;MO.sel=-1;commit();draw2()}return}
  if(k==='clr'){const e=cur();if(e){delete e.mo;MO.sel=-1;commit();draw2()}return}if(k==='xmorph')return crossMorph();if(k==='webm')return exportWebM();if(k==='png')return exportPNG()}
 const pr=t.closest('[data-pre]');if(pr)return presetApply(pr.dataset.pre);
 const row=t.closest('[data-row]');if(row){MO.el=+row.dataset.row;MO.sel=-1;ui();draw2()}}
function onInput(ev){const f=ev.target.dataset&&ev.target.dataset.f;if(!f)return;const e=cur();
 if(f==='dur'){if(ev.type!=='change')return;PROJ.mdur=Math.max(.5,Math.min(60,+ev.target.value||4))*1000;hist();MO.t=Math.min(MO.t,dur());ui();return draw2()}
 if(f==='el'){if(ev.type!=='change')return;MO.el=+ev.target.value;MO.sel=-1;ui();return draw2()}
 if(f==='mb'){if(e&&e.mo){e.mo.mb=ev.target.checked?1:0;hist();draw2()}return}
 if(f==='w'||f==='fps'||f==='ease'){if(f==='fps')MO.fps=+ev.target.value;if(f==='ease'&&ev.type==='change'&&e&&e.mo&&MO.sel>=0){e.mo.kf[MO.sel].ease=ev.target.value;hist();draw2()}return}
 if(ev.type==='change'&&e&&e.mo&&MO.sel>=0&&KEYS.includes(f)){const k=e.mo.kf[MO.sel];k[f]=ev.target.value===''?(f==='rad'?null:DEF[f]):+ev.target.value;hist();draw2()}}
function onDown(ev){const p=document.getElementById('v19mo'),rl=p.querySelector('#v19rl'),tl=p.querySelector('#v19tl');if(!rl||!tl)return;const D=dur();
 const rect=()=>{const r=rl.getBoundingClientRect();return r};const toT=x=>{const r=rect();return Math.max(0,Math.min(D,(x-r.left)/r.width*D))};
 const em=ev.target.closest('[data-kf]');
 if(em){const[id,i]=em.dataset.kf.split(':').map(Number);MO.el=id;MO.sel=i;const e=cur();if(!e||!e.mo)return;const kf=e.mo.kf[i];MO.t=kf.t;ev.preventDefault();ui();draw2();
  const mv=m=>{const nt=Math.round(toT(m.clientX)/10)*10;kf.t=nt;MO.t=nt;const el=p.querySelector('[data-kf="'+id+':'+i+'"]');if(el)el.style.left=nt/D*100+'%';draw2()};
  const up=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);sortK(e.mo);MO.sel=e.mo.kf.indexOf(kf);hist();ui();draw2()};window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);return}
 if(ev.target.closest('#v19rl,.v19tk')&&!ev.target.closest('[data-row]')){stop();const mv=m=>{MO.t=Math.round(toT(m.clientX));draw2()};mv(ev);const up=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);ui();draw2()};window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up)}}
/* ---------- dışa aktarma ---------- */
let busy=false;
async function exportWebM(){if(busy)return;if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return toast('Bu tarayıcı video kaydını desteklemiyor: PNG dizisini kullan');const p=document.getElementById('v19mo'),W=+(p.querySelector('[data-f="w"]').value)||720,fps=+(p.querySelector('[data-f="fps"]').value)||30,D=dur();
 if(!animated().length)return toast('Önce en az bir öğeye hareket ver');busy=true;stop();
 try{await loadF();const c0=frame(0,W),cv=document.createElement('canvas');cv.width=c0.width;cv.height=c0.height;const x=cv.getContext('2d');x.drawImage(c0,0,0);const st=cv.captureStream(fps),mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));if(!mime)throw new Error('mime');
  const rec=new MediaRecorder(st,{mimeType:mime,videoBitsPerSecond:W>=1000?12e6:6e6}),ch=[];rec.ondataavailable=e=>{if(e.data&&e.data.size)ch.push(e.data)};const done=new Promise(r=>{rec.onstop=r});rec.start(200);
  const t0=performance.now();await new Promise(res=>{const step=()=>{const t=performance.now()-t0;if(t>=D){x.drawImage(frame(D,W),0,0);setTimeout(res,250);return}x.drawImage(frame(t,W),0,0);if(Math.floor(t/500)!==Math.floor((t-20)/500))toast('Kaydediliyor… '+Math.round(t/D*100)+'%');requestAnimationFrame(step)};step()});
  rec.stop();await done;const blob=new Blob(ch,{type:'video/webm'});if(!blob.size)throw new Error('boş');await save(window.v4slug(PROJ.name||'proje')+'-hareket.webm',blob);toast('WebM indirildi ✓')}catch(e){toast('Video kaydedilemedi: '+(e&&e.message||e)+' — PNG dizisini dene')}finally{busy=false;draw2()}}
async function exportPNG(){if(busy)return;const p=document.getElementById('v19mo'),W=+(p.querySelector('[data-f="w"]').value)||720,fps=+(p.querySelector('[data-f="fps"]').value)||30,D=dur();if(!animated().length)return toast('Önce en az bir öğeye hareket ver');
 busy=true;stop();try{await loadF();const N=Math.min(600,Math.max(2,Math.round(D/1000*fps))),files=[];for(let i=0;i<N;i++){const c=frame(i*D/N,W),b=await new Promise(r=>c.toBlob(r,'image/png'));files.push({name:'kare-'+String(i+1).padStart(4,'0')+'.png',data:new Uint8Array(await b.arrayBuffer())});if(i%10===0)toast(`Kare ${i+1}/${N}…`)}
  await save(window.v4slug(PROJ.name||'proje')+'-kareler.zip',window.v4zip(files));toast(N+' kare zip olarak indirildi ✓')}catch(e){toast('PNG dizisi üretilemedi')}finally{busy=false;draw2()}}
window.v4motion={open,valAt,frame,presetApply,PRE,EASE,exportWebM,exportPNG,dur};
v4cmd(['Hareket','Hareket tasarımcısı (timeline, keyframe)',['Ctrl+Alt+R'],open]);
const mm=document.getElementById('mmenu');if(mm){const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML='<span>Hareket tasarımcısı</span><kbd>Ctrl+Alt+R</kbd>';w.onclick=()=>{mm.hidden=true;open()};mm.appendChild(w)}
})();
