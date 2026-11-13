/* ================= STÜDYO 13: akıllı kılavuz ayarları, altın oran araçları, sayfa/URL bağlantıları ================= */
(function(){
const m13=(id,title,body,sub)=>{let p=document.getElementById(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)p.hidden=true});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))p.hidden=true})}
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>${title}</b><small>${sub||''}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b">${body}</div></div>`;p.hidden=false;return p};
const PHI=.381966,r1=v=>Math.round(v*10)/10;
const gs=()=>Object.assign({eq:1,opt:1,gold:0,grid:0},CFG.gs||{});
const gset=(k,v)=>{CFG.gs=Object.assign(gs(),{[k]:v?1:0});cfgSave();gDraw()};
const H=()=>100/S.fmt;

/* ---------- altın oran kılavuz çizgileri ---------- */
function gDraw(){let n=document.getElementById('v13gr');if(!gs().gold||!PROJ||document.getElementById('edw').hidden){if(n)n.remove();return}
 const cv=document.getElementById('cv');if(!n||!n.isConnected){n=document.createElement('div');n.id='v13gr';cv.appendChild(n)}
 const a=PHI*100,b=(1-PHI)*100;n.innerHTML=[`<i style="left:${a}%;top:0;bottom:0;width:1px"></i>`,`<i style="left:${b}%;top:0;bottom:0;width:1px"></i>`,`<i style="top:${a}%;left:0;right:0;height:1px"></i>`,`<i style="top:${b}%;left:0;right:0;height:1px"></i>`].join('')}
const rd=render;render=function(){const r=rd.apply(this,arguments);gDraw();return r};

/* ---------- altın oran tipografi ölçeği ---------- */
function goldScale(){if(!PROJ)return;const T=S.els.filter(e=>e.on&&e.txt!==undefined&&!e.lock&&!e.vert);const sel=selEls().find(e=>e.type=='b'),base=(sel||T.find(e=>e.type=='b')||{}).fs;
 if(!base)return toast('Sayfada gövde metni yok: önce bir paragraf ekle ya da seç');
 let n=0;T.forEach(e=>{const k=e.type=='t'?6.854:e.type=='s'?2.618:e.type=='q'?2.618:0;if(k){e.fs=r1(base*k);n++}});
 if(!n)return toast('Ölçeklenecek başlık, alt başlık ya da alıntı yok');render();hist();ed();toast(`Altın oran ölçeği: gövde ${r1(base)} · alt başlık ${r1(base*2.618)} · başlık ${r1(base*6.854)}`)}
/* seçili öğeyi altın bölümün geniş (%61,8) ya da dar (%38,2) sütununa yerleştir */
function goldPlace(wide){const L=selEls().filter(e=>!e.lock);if(!L.length)return toast('Önce bir öğe seç');const m=S.mar,W=100-2*m,full=H()-2*m;
  L.forEach(e=>{const g=geo(e,100),block=e.type=='img'||e.type=='r';const ww=wide?W*(1-PHI):W*PHI,xx=wide?m:m+W*(1-PHI);e.fr=[r1(xx),block?r1(m):r1(g[1]+(e.dy||0)),r1(ww),block?r1(full):r1(g[3])];e.pin=true;e.dx=0;e.dy=0});
 render();hist();ed();toast(wide?'Geniş sütuna (%61,8) yerleştirildi':'Dar sütuna (%38,2) yerleştirildi')}
/* serbest öğelerin hepsini ızgaraya oturt */
function gridAll(){if(!PROJ)return;const ids=S.els.filter(e=>e.on&&e.fr&&!e.lock&&e.shape!='draw'&&!e.gid).map(e=>e.id);if(!ids.length)return toast('Izgaraya oturtulacak serbest öğe yok');
 MSEL.clear();ids.forEach(i=>MSEL.add(i));S.sel=ids[0];window.v4snap();toast(ids.length+' öğe ızgaraya oturtuldu')}

/* ---------- ayar penceresi ---------- */
function gsOpen(){const g=gs();const row=(k,t,d)=>`<label class="v13r"><input type="checkbox" data-g="${k}"${g[k]?' checked':''}><span><b>${t}</b><small>${d}</small></span></label>`;
 const p=m13('v13gs','Akıllı kılavuz ayarları',row('eq','Eşit boşluk','Sürüklerken komşu öğelerle aynı aralığı bulur, mm değerini gösterir.')+row('opt','Optik hizalama','Yazının yan boşluğunu ve yuvarlak şeklin taşmasını hesaba katar; göze doğru görünen kenara yapıştırır.')+row('gold','Altın oran çizgileri','%38,2 ve %61,8 çizgilerini gösterir ve öğeleri onlara yapıştırır.')+row('grid','Izgaraya yapış','Sürüklerken sütun ve satır kenarlarına yapışır.')
  +`<div class="row" style="margin-top:12px"><button class="b" data-a="scale">Altın oran tipografi ölçeği uygula</button><button class="b" data-a="wide">Seçileni geniş sütuna</button><button class="b" data-a="narrow">Seçileni dar sütuna</button><button class="b" data-a="grid">Tüm serbest öğeleri ızgaraya oturt</button></div><p class="mut">Sürüklerken Ctrl basılı tutarsan tüm yapışmalar geçici kapanır.</p>
  <style>.v13r{display:flex;gap:10px;align-items:flex-start;padding:7px 0}.v13r small{display:block;opacity:.7}</style>`,'Taşırken pembe çizgiler ve mm değerleri çıkar');
 p.onchange=e=>{const c=e.target.closest('[data-g]');if(c)gset(c.dataset.g,c.checked)};
 p.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;p.hidden=true;({scale:goldScale,wide:()=>goldPlace(true),narrow:()=>goldPlace(false),grid:gridAll})[b.dataset.a]()}}

/* ---------- bağlantılar (sayfa → sayfa ya da web) ---------- */
const okUrl=u=>typeof u=='string'&&/^(https?:\/\/|mailto:)/i.test(u.trim());
window.v4links=function(){const L=[];S.els.forEach(e=>{if(!e.on||!e.lk)return;const g=geo(e,100),x=(g[0]+(e.dx||0)),y=(g[1]+(e.dy||0)),k=S.fmt;
  const q={x:+(x).toFixed(2),y:+(y*k).toFixed(2),w:+g[2].toFixed(2),h:+(g[3]*k).toFixed(2)};
  if(e.lk.t=='p'&&e.lk.n>=1&&e.lk.n<=PROJ.pages.length)L.push({...q,t:'p',n:e.lk.n|0});else if(e.lk.t=='u'&&okUrl(e.lk.u))L.push({...q,t:'u',u:e.lk.u.trim().slice(0,500)})});return L};
window.v4linksMM=function(off){const k=S.mm[0]/100;return window.v4links().length?S.els.filter(e=>e.on&&e.lk).map(e=>{const g=geo(e,100),lk=e.lk;if(!((lk.t=='p'&&lk.n>=1&&lk.n<=PROJ.pages.length)||(lk.t=='u'&&okUrl(lk.u))))return null;return{x:off+(g[0]+(e.dx||0))*k,y:off+(g[1]+(e.dy||0))*k,w:g[2]*k,h:g[3]*k,lk:lk.t=='p'?{t:'p',n:lk.n|0}:{t:'u',u:lk.u.trim()}}}).filter(Boolean):[]};
function lkOpen(){const L=selEls().filter(e=>!e.lock);if(!L.length)return toast('Önce bir öğe seç');const e0=L[0],lk=e0.lk||{},N=PROJ.pages.length;
 const p=m13('v13lk','Bağlantı',`<div class="v13r"><span><b>Seçili ${L.length} öğe tıklanınca nereye gitsin?</b><small>Önizleme, flipbook ve PDF dosyalarında çalışır. Sunumda “↩ Geri” ile döner.</small></span></div>
  <label class="v13r"><input type="radio" name="lt" value="n"${!lk.t?' checked':''}><span>Bağlantı yok</span></label>
  <label class="v13r"><input type="radio" name="lt" value="p"${lk.t=='p'?' checked':''}><span>Sayfaya git <select id="v13n">${Array.from({length:N},(_, i)=>`<option value="${i+1}"${lk.t=='p'&&lk.n==i+1?' selected':''}>Sayfa ${i+1}</option>`).join('')}</select></span></label>
  <label class="v13r"><input type="radio" name="lt" value="u"${lk.t=='u'?' checked':''}><span>Web adresi <input id="v13u" placeholder="https://…" style="min-width:240px" value="${lk.t=='u'?String(lk.u).replace(/"/g,'&quot;'):''}"></span></label>
  <div class="row" style="margin-top:10px"><button class="b pr" id="v13ok">Uygula</button></div><style>.v13r{display:flex;gap:10px;align-items:flex-start;padding:7px 0}.v13r small{display:block;opacity:.7}</style>`,'Sayfa 1 → Sayfa 18 → Sayfa 6 gibi etkileşimler');
 p.querySelector('#v13ok').onclick=()=>{const t=(p.querySelector('input[name=lt]:checked')||{}).value;let v=null;
  if(t=='p')v={t:'p',n:+p.querySelector('#v13n').value};else if(t=='u'){const u=p.querySelector('#v13u').value.trim();if(!okUrl(u))return toast('Adres http://, https:// ya da mailto: ile başlamalı');v={t:'u',u:u.slice(0,500)}}
  L.forEach(e=>{if(v)e.lk=v;else delete e.lk});p.hidden=true;render();hist();ed();try{stBar()}catch(x){}toast(v?(v.t=='p'?'Sayfa '+v.n+' bağlantısı eklendi':'Web bağlantısı eklendi'):'Bağlantı kaldırıldı')}}
const pe=window.v4extra,pc=window.v4cb;
window.v4extra=o=>(pe?pe(o):'')+`<button class="cbb wide${o.lk?' on':''}" data-cbg="lnk" title="Tıklanınca başka sayfaya ya da web adresine git">${o.lk?(o.lk.t=='p'?'→ Sayfa '+o.lk.n:'→ Web'):'Bağlantı'}</button>`;
window.v4cb=(g,t)=>{if(g=='lnk'){lkOpen();return true}return pc?pc(g,t):false};

v4cmd(['Görünüm','Akıllı kılavuz ayarları',['Ctrl+Alt+G'],gsOpen]);
v4cmd(['Görünüm','Altın oran çizgilerini aç/kapat',[],()=>{gset('gold',!gs().gold);toast(gs().gold?'Altın oran çizgileri açık':'Altın oran çizgileri kapalı')}]);
v4cmd(['Hizala','Altın oran tipografi ölçeği',[],goldScale]);
v4cmd(['Hizala','Seçileni altın oran geniş sütuna',[],()=>goldPlace(true)]);
v4cmd(['Hizala','Seçileni altın oran dar sütuna',[],()=>goldPlace(false)]);
v4cmd(['Hizala','Tüm serbest öğeleri ızgaraya oturt',[],gridAll]);
v4cmd(['Öğe','Bağlantı ekle (sayfa ya da web)',[],lkOpen]);
const mm=document.getElementById('mmenu');if(mm){[['Akıllı kılavuz ayarları',gsOpen]].forEach(([t,f])=>{const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML='<span>'+t+'</span><kbd>Ctrl+Alt+G</kbd>';w.onclick=()=>{mm.hidden=true;f()};mm.appendChild(w)})}
window.v4gs={gs,gset,goldScale,goldPlace,gridAll,gsOpen,lkOpen};
})();


/* ================= STÜDYO 14: sürüm karşılaştırma (görsel) ================= */
(function(){
const rd=i=>new Promise(r=>setTimeout(r,i));
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-vnm]');if(!b)return;const v=PROJ.versions[+b.dataset.vnm];if(!v)return;let n=null;try{n=window.prompt('Sürüm adı:',v.label)}catch(x){}if(n&&n.trim()){v.label=n.trim().slice(0,60);try{rpr()}catch(x){}toast('Sürüm adlandırıldı')}});
async function shot(pg,W){const s0=pageSnap();try{pageLoad(pg);await Promise.all(S.els.filter(e=>e.type=='img'&&e.src).map(e=>e.im&&e.im.decode?e.im.decode().catch(()=>0):0));await loadF();const c=draw(W);const o=document.createElement('canvas');o.width=c.width;o.height=c.height;o.getContext('2d').drawImage(c,0,0);return o}finally{pageLoad(s0)}}
function sig(a){return JSON.stringify((a.els||[]).map(e=>[e.id,e.type,e.on,e.txt,e.src&&e.src.length,e.fr,e.pos,e.col,e.fs,e.dx,e.dy]))+a.bg}
async function open(vi){const v=PROJ.versions[vi];if(!v)return;PROJ.pages[PROJ.cur].s=pageSnap();
 let p=document.getElementById('v14c');if(!p){p=document.createElement('div');p.id='v14c';p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)p.hidden=true});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))p.hidden=true})}
 const cur=PROJ.pages.map(x=>x.s),N=Math.max(v.pages.length,cur.length);
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>Sürüm karşılaştır</b><small>${String(v.label).replace(/</g,'&lt;')} ↔ şimdiki</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b"><div class="row"><button class="b pr" id="v14r">Bu sürümü geri yükle</button><span class="mut" id="v14i">Hazırlanıyor…</span></div><div id="v14g" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:10px"></div></div></div>`;p.hidden=false;
 p.querySelector('#v14r').onclick=()=>{if(confirm('Şimdiki hâl bu sürümle değiştirilsin mi? (Önce şimdiki hâl yeni bir sürüm olarak saklanır)')){verSave('Geri yüklemeden önce');verRestore(PROJ.versions.indexOf(v));p.hidden=true}};
 const g=p.querySelector('#v14g');let ch=0;
 for(let i=0;i<N&&i<24;i++){const a=v.pages[i],b=cur[i],same=a&&b&&sig(a)==sig(b);if(!same)ch++;
  const box=document.createElement('div');box.style.cssText='border:1px solid var(--bd,#8884);border-radius:8px;padding:8px';box.innerHTML=`<b>Sayfa ${i+1}</b> <small class="mut">${!a?'yeni sayfa':!b?'silinmiş':same?'değişmedi':'değişti'}</small><div style="display:flex;gap:6px;margin-top:6px"></div>`;g.appendChild(box);
  const row=box.lastChild;for(const [pg,t] of [[a,'Sürüm'],[b,'Şimdi']]){const f=document.createElement('figure');f.style.cssText='margin:0;flex:1;min-width:0;text-align:center';if(pg){try{const c=await shot(pg,260);c.style.cssText='width:100%;height:auto;display:block;border:1px solid #8884';f.appendChild(c)}catch(e){f.textContent='—'}}else f.innerHTML='<div class="mut" style="padding:30px 0">yok</div>';const cap=document.createElement('figcaption');cap.className='mut';cap.textContent=t;f.appendChild(cap);row.appendChild(f)}}
 p.querySelector('#v14i').textContent=ch?`${ch} sayfada fark var`:'Fark yok'}
window.v4vercmp=open;
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-vcmp]');if(b){e.preventDefault();open(+b.dataset.vcmp)}});
})();
