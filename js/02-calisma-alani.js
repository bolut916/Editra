// ===== çalışma alanı: ayarlar, depolama, projeler, sayfalar, ana sayfa, sihirbaz
const DU={},IMC={},MEM=new Map();
const getIm=src=>IMC[src]||(IMC[src]=Object.assign(new Image(),{src}));
const d2b=d=>{const[h,b]=d.split(','),m=h.match(/:(.*?);/)[1],t=atob(b),u=new Uint8Array(t.length);for(let i=0;i<t.length;i++)u[i]=t.charCodeAt(i);return new Blob([u],{type:m})};
function loadImg(f){return new Promise(res=>{const r=new FileReader();r.onerror=()=>res(null);r.onload=()=>{const im=new Image();im.onerror=()=>res(null);im.onload=()=>{const k=Math.min(1,2400/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*k));c.height=Math.max(1,Math.round(im.naturalHeight*k));c.getContext('2d').drawImage(im,0,0,c.width,c.height);
 const du=c.toDataURL(f.type=='image/png'?'image/png':'image/jpeg',.86),url=URL.createObjectURL(d2b(du));DU[url]=du;const i2=getIm(url);(i2.decode?i2.decode().catch(()=>0):Promise.resolve()).then(()=>res({url}))};im.src=r.result};r.readAsDataURL(f)})}
const DB=(()=>{let p;const open=()=>p||(p=new Promise((res,rej)=>{try{const r=indexedDB.open('editra',1);r.onupgradeneeded=()=>{r.result.createObjectStore('p',{keyPath:'id'});r.result.createObjectStore('m',{keyPath:'id'})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}}));
 const run=async(st,mode,f)=>{const d=await open();return new Promise((res,rej)=>{const t=d.transaction(st,mode);let q;try{q=f(...st.map(n=>t.objectStore(n)))}catch(e){return rej(e)}t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)})};
 return{put:(r,m)=>run(['p','m'],'readwrite',(a,b)=>{a.put(r);return b.put(m)}),get:id=>run(['p'],'readonly',a=>a.get(id)),all:()=>run(['m'],'readonly',a=>a.getAll()),del:id=>run(['p','m'],'readwrite',(a,b)=>{a.delete(id);return b.delete(id)}),full:()=>run(['p'],'readonly',a=>a.getAll())}})();
let memWarned=0;const memW=()=>{if(!memWarned){memWarned=1;toast('Tarayıcı depolaması kapalı: çalışmalar bu oturumla sınırlı')}};
const dbPut=async(r,m)=>{try{await DB.put(r,m)}catch(e){MEM.set(r.id,[r,m]);memW()}},dbGet=async id=>{try{return await DB.get(id)}catch(e){return(MEM.get(id)||[])[0]}},dbAll=async()=>{try{return await DB.all()}catch(e){return[...MEM.values()].map(v=>v[1])}},dbDel=async id=>{try{await DB.del(id)}catch(e){MEM.delete(id)}};
let CFG={theme:'auto',autosave:true,splash:true,motion:false,dpi:300,grid:false,free:false,bot:true};try{Object.assign(CFG,JSON.parse(localStorage.getItem('editra.cfg')||'{}'))}catch(e){}
const cfgSave=()=>{try{localStorage.setItem('editra.cfg',JSON.stringify(CFG))}catch(e){}};
function applyCfg(){const r=document.documentElement;CFG.theme=='auto'?r.removeAttribute('data-theme'):r.setAttribute('data-theme',CFG.theme);r.dataset.motion=CFG.motion===true?'reduce':CFG.motion==='on'?'on':'';$('bot').style.display=CFG.bot?'':'none';const ic={auto:'🌓',light:'☀️',dark:'🌙'}[CFG.theme];$('th2').textContent=ic;$('th3').textContent=ic}
function cycleTheme(){CFG.theme={auto:'light',light:'dark',dark:'auto'}[CFG.theme];cfgSave();applyCfg();toast('Tema: '+{auto:'Otomatik',light:'Açık',dark:'Koyu'}[CFG.theme])}
// projeler
let PROJ=null;
const PGK=['els','bg','sp','grain','vig','st','pc','imgPal','sel'];
function pageSnap(){const o={};PGK.forEach(k=>o[k]=S[k]);o.els=S.els.map(e=>({...e,im:null}));return JSON.parse(JSON.stringify(o))}
function pageLoad(p){const o=JSON.parse(JSON.stringify(p));PGK.forEach(k=>{if(k in o)S[k]=o[k]});S.els.forEach(e=>{if(e.type=='img')e.im=e.src?getIm(e.src):new Image()})}
function place(sp){S.sp=sp;const o=lay(sp);S.els.forEach((e,i)=>{e.pos=o[i];e.on=true;const q=o[i].ex;e.rot=q[0];e.dx=q[1];e.dy=q[2];if('tsbmq'.includes(e.type=='img'||e.type=='r'?'-':e.type))e.vert=!!q[3];if(e.type=='b'){const f=e.pos[2]/S.cols;e.cc=e.txt.length<180?1:f>.8?3:f>.45?2:1}});fitAll()}
function pack(){PROJ.pages[PROJ.cur].s=pageSnap();const assets={},map={};let n=0;
 const mp=sn=>{const o=JSON.parse(JSON.stringify(sn));o.els.forEach(e=>{if(e.type=='img'&&e.src){const du=DU[e.src]||(e.src.startsWith('data:')?e.src:''),k=map[e.src]||(map[e.src]='a'+n++);assets[k]=du;e.src='@'+k}});return o};
 const pages=PROJ.pages.map(p=>({s:mp(p.s),thumb:p.thumb||''})),versions=(PROJ.versions||[]).map(v=>({t:v.t,label:v.label,pages:v.pages.map(mp)}));
 return{id:PROJ.id,name:PROJ.name,kind:PROJ.kind,mode:S.mode,mm:S.mm,dpi:PROJ.dpi,px:+$('px').value,cols:S.cols,rows:S.rows,mar:S.mar,gut:S.gut,cur:PROJ.cur,created:PROJ.created,updated:Date.now(),bleed:S.bleed||0,marks:!!S.marks,comments:PROJ.comments||[],brand:PROJ.brand||null,brand2:PROJ.brand2||null,spots:PROJ.spots||[],mdur:PROJ.mdur||null,ownFonts:(window.v4ownFontsPack?v4ownFontsPack():[]),components:PROJ.components||[],styles:PROJ.styles||[],guides:PROJ.guides||[],versions,pages,assets}}
function unpack(r){const urls={};for(const k in r.assets){const du=r.assets[k];if(!du)continue;const u=URL.createObjectURL(d2b(du));DU[u]=du;urls[k]=u;getIm(u)}
 const fx=sn=>sn.els.forEach(e=>{if(e.type=='img'&&typeof e.src=='string'&&e.src[0]=='@')e.src=urls[e.src.slice(1)]||''});r.pages.forEach(p=>fx(p.s));(r.versions||[]).forEach(v=>v.pages.forEach(fx));
 PROJ={id:r.id,name:r.name,kind:r.kind,dpi:r.dpi,created:r.created,pages:r.pages,cur:Math.min(r.cur||0,r.pages.length-1),comments:r.comments||[],brand:r.brand||null,brand2:(r.brand2&&typeof r.brand2=='object')?r.brand2:null,mdur:(+r.mdur>=500&&+r.mdur<=60000)?+r.mdur:null,spots:Array.isArray(r.spots)?r.spots.filter(c=>c&&typeof c.name=='string'&&/^#[0-9a-f]{6}$/i.test(c.hex)&&Array.isArray(c.cmyk)).slice(0,60):[],components:r.components||[],styles:r.styles||[],guides:r.guides||[],versions:r.versions||[]};BK=PROJ.brand;(r.ownFonts||[]).slice(0,8).forEach(f=>{try{window.v4ownFontLoad&&v4ownFontLoad(f)}catch(e){}});
 Object.assign(S,{mode:r.mode,mm:r.mm,fmt:r.mm[0]/r.mm[1],cols:r.cols,rows:r.rows,mar:r.mar,gut:r.gut,bleed:r.bleed||0,marks:!!r.marks});setPx(r.px||4000)}
const meta=r=>({id:r.id,name:r.name,kind:r.kind,n:r.pages.length,mm:r.mm,dpi:r.dpi,updated:r.updated,created:r.created,thumb:r.pages[0].thumb});
let svT=0,thT=0;
function thumbNow(){try{const u=draw(240).toDataURL('image/jpeg',.6);if(u)PROJ.pages[PROJ.cur].thumb=u}catch(e){}}
function dirty(){if(!PROJ||$('edw').hidden)return;clearTimeout(thT);thT=setTimeout(()=>{thumbNow();strip(true)},700);if(CFG.autosave){$('sv').textContent='● Kaydediliyor…';clearTimeout(svT);svT=setTimeout(saveNow,1300)}else $('sv').textContent='● Kaydedilmedi'}
async function saveNow(){if(!PROJ)return;thumbNow();const r=pack();await dbPut(r,meta(r));$('sv').textContent='✓ Kaydedildi '+new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}
function setPx(v){const sl=$('px');if(![...sl.options].some(o=>+o.value==v)){const o=document.createElement('option');o.value=v;o.textContent=(v/1000).toFixed(v%1000?1:0)+'K';sl.insertBefore(o,[...sl.options].find(q=>+q.value>v)||null)}sl.value=v}
async function eachPage(fn,idx){PROJ.pages[PROJ.cur].s=pageSnap();const s0=pageSnap();await Promise.all(PROJ.pages.flatMap(p=>p.s.els.filter(e=>e.type=='img'&&e.src).map(e=>{const im=getIm(e.src);return im.decode?im.decode().catch(()=>0):0})));
 try{for(const i of (idx||[...PROJ.pages.keys()])){pageLoad(PROJ.pages[i].s);PGOV=i;await fn(i)}}finally{PGOV=null;pageLoad(s0);render();list();ed()}}
async function initThumbs(){const miss=PROJ.pages.map((p,i)=>p.thumb?-1:i).filter(i=>i>=0);if(!miss.length)return;await eachPage(async i=>{await loadF();try{PROJ.pages[i].thumb=draw(240).toDataURL('image/jpeg',.6)}catch(e){}},miss.slice(0,20));strip(true)}
function dimLabel(){const px=+$('px').value;$('dim').textContent=`${S.mm[0]}×${S.mm[1]} mm · ${PROJ.dpi} dpi · en fazla ${px}px`}
function pgnum(){$('pgn').textContent=`Sayfa ${PROJ.cur+1} / ${PROJ.pages.length}`;$('pp').disabled=PROJ.cur==0;$('pn2').disabled=PROJ.cur==PROJ.pages.length-1;dimLabel()}
function strip(keep){const sl0=$('strip').scrollLeft;$('strip').innerHTML=PROJ.pages.map((p,i)=>`<div class="pgc${i==PROJ.cur?' on':''}" data-pg="${i}" style="--r:${S.fmt}"><div class="pgt">${p.thumb?`<img src="${p.thumb}" alt="">`:''}</div><span>${i+1}</span><div class="pga"><button data-pa="dup" title="Çoğalt">⧉</button><button data-pa="l" title="Sola taşı">◀</button><button data-pa="r" title="Sağa taşı">▶</button><button data-pa="del" title="Sil">🗑</button></div></div>`).join('')+`<button class="pgc add" data-pa="add"><b>＋</b><small>Sayfa</small></button>`;const sp=$('strip'),on=sp.querySelector('.on');if(keep)sp.scrollLeft=sl0;else if(on)sp.scrollLeft=on.offsetLeft-sp.clientWidth/2+on.offsetWidth/2}
function enter(i){PROJ.cur=i;pageLoad(PROJ.pages[i].s);HI=[];HP=-1;GS=0;GN=48;SUG=[];palRender();render();thumbs();list();ed();hist();strip();pgnum()}
function goPage(i){if(i<0||i>=PROJ.pages.length||i==PROJ.cur)return;PROJ.pages[PROJ.cur].s=pageSnap();thumbNow();enter(i)}
function addPage(kind){PROJ.pages[PROJ.cur].s=pageSnap();thumbNow();const at=PROJ.cur+1;
 if(kind=='dup')PROJ.pages.splice(at,0,{s:pageSnap(),thumb:PROJ.pages[PROJ.cur].thumb});
 else{const M=MODES[S.mode];S.els=[];S.sel=null;S.grain=0;S.vig=0;if(kind=='auto'){const i=PROJ.pages.length;setCounts(M.pre[i%M.pre.length][1]);place([FL()[(i*3+1)%FL().length],1+(i*37)%SEEDS,i&1,0])}PROJ.pages.splice(at,0,{s:pageSnap()})}
 enter(at);toast('Sayfa eklendi')}
function delPage(i){if(PROJ.pages.length<2)return toast('Son sayfa silinemez');PROJ.pages[PROJ.cur].s=pageSnap();const c=PROJ.cur;PROJ.pages.splice(i,1);enter(Math.max(0,Math.min(i<c?c-1:c,PROJ.pages.length-1)));toast('Sayfa silindi')}
function movePage(i,d){const j=i+d;if(j<0||j>=PROJ.pages.length)return;PROJ.pages[PROJ.cur].s=pageSnap();const c=PROJ.cur,[p]=PROJ.pages.splice(i,1);PROJ.pages.splice(j,0,p);enter(c==i?j:c==j?i:c)}
$('strip').onclick=e=>{const a=e.target.closest('[data-pa]'),c=e.target.closest('[data-pg]');
 if(a){e.stopPropagation();const k=a.dataset.pa,i=c?+c.dataset.pg:PROJ.cur;if(k=='add'){const m=$('pmenu');m.hidden=!m.hidden;return}if(k=='dup'){goPage(i);addPage('dup')}else if(k=='del')delPage(i);else movePage(i,k=='l'?-1:1);return}
 if(c)goPage(+c.dataset.pg)};
$('pmenu').onclick=e=>{const b=e.target.closest('[data-add2]');if(b){$('pmenu').hidden=true;addPage(b.dataset.add2)}};
$('pp').onclick=()=>goPage(PROJ.cur-1);$('pn2').onclick=()=>goPage(PROJ.cur+1);
$('modesel').onchange=e=>setMode(e.target.value,true);
// ana sayfa
function showHome(){$('bot').dataset.n='';$('home').hidden=false;$('edw').hidden=true;renderHome();window.scrollTo(0,0);dock()}
async function openHome(){if(PROJ&&!$('edw').hidden){await saveNow()}showHome()}
function openEditor(i){$('home').hidden=true;$('edw').hidden=false;$('pname').value=PROJ.name;setMode(S.mode,true);S.grid=CFG.grid;S.free=CFG.free;enter(i);$('sv').textContent='';window.scrollTo(0,0);initThumbs();PROJ.versions=PROJ.versions||[];PROJ.comments=PROJ.comments||[];PROJ.components=PROJ.components||[];BK=PROJ.brand||null;AN=null;RT='a';dock();rpr();if(!PROJ.versions.length&&S.els.length)verSave('Açılış')}
async function openProject(id){const r=await dbGet(id);if(!r)return toast('Çalışma bulunamadı');unpack(r);openEditor(PROJ.cur)}
$('hb').onclick=openHome;$('pname').oninput=e=>{PROJ.name=e.target.value||'Adsız';dirty()};
$('th2').onclick=$('th3').onclick=cycleTheme;
const KINDS=[
['dergi','Dergi','📰','dergi',[FM(210,297,'A4'),FM(230,300,'Dergi boyu'),FM(210,280,'Dergi 3:4'),FM(420,297,'A3 çift sayfa')],8,300],
['katalog','Katalog','🛍','katalog',[FM(210,297,'A4'),FM(297,210,'A4 yatay'),FM(210,210,'Kare'),FM(148,210,'A5')],12,300],
['brosur','Broşür','📄','baski',[FM(210,297,'A4'),FM(297,210,'A4 yatay'),FM(148,210,'A5'),FM(99,210,'DL 3 katlı')],2,300],
['kapak','Kapak','📕','kapak',[FM(230,300,'Dergi kapağı'),FM(210,297,'Katalog kapağı'),FM(420,297,'Kitap (açık)'),FM(200,200,'Albüm'),FM(240,320,'Dosya')],1,300],
['afis','Afiş / Poster','🖼','baski',[FM(297,420,'A3'),FM(420,594,'A2'),FM(610,914,'24×36 in'),FM(841,1189,'A0'),FM(300,100,'Billboard 3:1')],1,150],
['kartvizit','Kartvizit','💳','baski',[FM(85,55,'85×55'),FM(90,50,'90×50'),FM(85,54,'ISO 85×54')],2,600],
['menu','Menü','🍽','baski',[FM(100,210,'Dar menü'),FM(210,297,'A4'),FM(148,210,'A5')],2,300],
['sosyal','Sosyal medya','📱','sinirsiz',[FM(108,135,'Instagram 4:5'),FM(108,108,'Kare'),FM(108,192,'Story 9:16'),FM(192,108,'Yatay 16:9')],1,150],
['bos','Boş tuval','✨','sinirsiz',[FM(210,297,'A4'),FM(200,200,'Kare'),FM(297,210,'A4 yatay'),FM(420,594,'A2')],1,300]];
const DPIS=[[72,'Ekran'],[150,'Web / yüksek'],[300,'Baskı'],[600,'Ultra baskı']];
let WZ=null,PEND=null;
const newW=k=>{const K=KINDS[k];return{k,f:0,custom:false,cw:210,ch:297,unit:'mm',o:null,n:K[5],cover:['dergi','katalog'].includes(K[0]),dpi:K[6]==300?CFG.dpi:K[6],start:'auto',st:MODES[K[3]].st[0],name:'Adsız '+K[1].toLowerCase(),ne:0}};
function wmm(){if(WZ.custom){const f={mm:1,cm:10,in:25.4,px:25.4/96}[WZ.unit];return[Math.max(20,Math.round(WZ.cw*f)),Math.max(20,Math.round(WZ.ch*f))]}const b=KINDS[WZ.k][4][WZ.f];let[w,h]=[b[2],b[3]];if(WZ.o=='p'&&w>h)[w,h]=[h,w];if(WZ.o=='l'&&h>w)[w,h]=[h,w];return[w,h]}
const wpx=mm=>Math.min(12000,Math.max(1000,Math.round(Math.max(...mm)/25.4*WZ.dpi)));
function openWiz(k0){WZ=newW(typeof k0=='string'?Math.max(0,KINDS.findIndex(x=>x[0]==k0)):0);$('wiz').hidden=false;wzr()}
const closeWiz=()=>{$('wiz').hidden=true};
function wzs(){const mm=wmm(),px=Math.round(Math.max(...mm)/25.4*WZ.dpi),cap=px>12000,r=mm[0]/mm[1],K=KINDS[WZ.k];
 $('wsum').innerHTML=`<div class="wpw"><div class="wp" style="aspect-ratio:${r};${r>1?'width:100%':'height:100%'}"><i></i><i></i><i></i><em>${WZ.n>1?WZ.n+' sayfa':'1 sayfa'}</em></div></div>
 <dl><dt>Tür</dt><dd>${K[2]} ${K[1]}</dd><dt>Boyut</dt><dd>${mm[0]}×${mm[1]} mm<br><small>${(mm[0]/25.4).toFixed(1)}×${(mm[1]/25.4).toFixed(1)} in · oran ${r.toFixed(2)}</small></dd><dt>Sayfa</dt><dd>${WZ.n}${WZ.cover&&WZ.n>1?' · ilk sayfa kapak':''}</dd><dt>Çözünürlük</dt><dd>${WZ.dpi} dpi<br><small>${Math.round(mm[0]/25.4*WZ.dpi)}×${Math.round(mm[1]/25.4*WZ.dpi)} px${cap?' · cihaz sınırı 12000 px':''}</small></dd></dl>`}
function wzr(){const K=KINDS[WZ.k],mm=wmm();
 $('wiz').innerHTML=`<div class="wz-box"><div class="wz-h"><h2>Yeni tasarım</h2><button class="ib" id="wx" aria-label="Kapat">✕</button></div><div class="wz-b"><div class="wz-f">
 <section><h4><i>1</i> Ne tasarlıyorsun?</h4><div class="kinds">${KINDS.map((k,i)=>`<button class="kd${i==WZ.k?' on':''}" data-k="${i}"><b>${k[2]}</b>${k[1]}</button>`).join('')}</div></section>
 <section><h4><i>2</i> Boyut</h4><div class="kinds fm">${K[4].map((f,i)=>`<button class="kd${!WZ.custom&&i==WZ.f?' on':''}" data-f="${i}"><span class="mr"><u style="aspect-ratio:${f[0]}"></u></span>${f[1]}<small>${f[2]}×${f[3]} mm</small></button>`).join('')}<button class="kd${WZ.custom?' on':''}" data-cu="1"><span class="mr"><u style="aspect-ratio:1"></u></span>Özel<small>kendin yaz</small></button></div>
 ${WZ.custom?`<div class="cu"><input type="number" id="wcw" value="${WZ.cw}" min="1" aria-label="En"><b>×</b><input type="number" id="wch" value="${WZ.ch}" min="1" aria-label="Boy"><select id="wun">${['mm','cm','in','px'].map(u=>`<option${u==WZ.unit?' selected':''}>${u}</option>`).join('')}</select></div>`:`<div class="seg2"><button data-o="p"${WZ.o=='p'?' class="on"':''}>▯ Dikey</button><button data-o="l"${WZ.o=='l'?' class="on"':''}>▭ Yatay</button><button data-o=""${!WZ.o?' class="on"':''}>Varsayılan</button></div>`}</section>
 <section><h4><i>3</i> Sayfalar</h4><div class="stp"><button data-nn="-1" aria-label="Azalt">−</button><input type="number" id="wn" value="${WZ.n}" min="1" max="1000" aria-label="Sayfa sayısı"><button data-nn="1" aria-label="Artır">＋</button></div><div class="chips">${[1,2,4,8,12,16,24,32].map(n=>`<button class="chip${n==WZ.n?' on':''}" data-n="${n}">${n}</button>`).join('')}</div>
 <label class="sw2"><input type="checkbox" id="wcv"${WZ.cover?' checked':''}> İlk sayfa kapak olsun</label></section>
 <section><h4><i>4</i> Çözünürlük</h4><div class="kinds dp">${DPIS.map(d=>`<button class="kd${d[0]==WZ.dpi?' on':''}" data-dpi="${d[0]}"><b>${d[0]}</b>${d[1]}</button>`).join('')}</div></section>
 <section><h4><i>5</i> Başlangıç</h4><div class="seg2"><button data-start="auto"${WZ.start=='auto'?' class="on"':''}>✨ Hazır düzenle</button><button data-start="blank"${WZ.start=='blank'?' class="on"':''}>▢ Boş sayfa</button></div>
 <div class="chips sty">${STY.map((s,i)=>`<button class="chip${i==WZ.st?' on':''}" data-st="${i}" title="${s.n}"><span style="background:linear-gradient(90deg,${s.bg} 33%,${s.tx} 33% 66%,${s.ac} 66%)"></span>${s.n}</button>`).join('')}</div></section>
 <section><h4><i>6</i> Ad</h4><input id="wname" class="wni" value="${esc(WZ.name).replace(/"/g,'&quot;')}" maxlength="60"></section></div>
 <aside class="wz-s"><div id="wsum"></div><button class="pb big" id="wgo">Tasarıma başla →</button><small class="mut">Sonradan sayfa ekleyebilir, boyut dışındaki her şeyi değiştirebilirsin.</small></aside></div></div>`;wzs()}
$('wiz').addEventListener('click',e=>{const t=e.target;if(t.id=='wiz'||t.closest('#wx'))return closeWiz();if(t.closest('#wgo'))return wizGo();
 const g=a=>t.closest('['+a+']');let b;
 if(b=g('data-k')){const nm=WZ.ne?WZ.name:null;WZ=newW(+b.dataset.k);if(nm){WZ.name=nm;WZ.ne=1}}else if(b=g('data-f')){WZ.f=+b.dataset.f;WZ.custom=false}else if(b=g('data-cu')){WZ.custom=true;const m=wmm();WZ.cw=WZ.cw||m[0]}else if(b=g('data-o'))WZ.o=b.dataset.o||null;
 else if(b=g('data-nn'))WZ.n=cl(WZ.n+ +b.dataset.nn,1,1000);else if(b=g('data-n'))WZ.n=+b.dataset.n;else if(b=g('data-dpi'))WZ.dpi=+b.dataset.dpi;else if(b=g('data-start'))WZ.start=b.dataset.start;else if(b=g('data-st'))WZ.st=+b.dataset.st;else return;wzr()});
$('wiz').addEventListener('input',e=>{const t=e.target;if(t.id=='wname'){WZ.name=t.value;WZ.ne=1}else if(t.id=='wcw')WZ.cw=+t.value||1;else if(t.id=='wch')WZ.ch=+t.value||1;else if(t.id=='wn'){WZ.n=cl(Math.round(+t.value),1,1000)}else if(t.id=='wcv')WZ.cover=t.checked;else return;wzs()});
$('wiz').addEventListener('change',e=>{if(e.target.id=='wun'){WZ.unit=e.target.value;wzs()}});
function wizGo(){const K=KINDS[WZ.k],mm=wmm(),M=MODES[K[3]];
 PROJ={id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:(WZ.name||'Adsız').trim()||'Adsız',kind:K[0],dpi:WZ.dpi,created:Date.now(),pages:[],cur:0,components:[],styles:[]};
 Object.assign(S,{mode:K[3],mm,fmt:mm[0]/mm[1],cols:M.cols,rows:M.rows,mar:M.mar,gut:2,st:WZ.st,pc:null,imgPal:null,grain:0,vig:0,bg:STY[WZ.st].bg});
 for(let i=0;i<WZ.n;i++){S.els=[];S.sel=null;S.sp=[0,1,0,0];const cv=WZ.cover&&i==0&&WZ.n>1;
  if(WZ.start=='auto'){const mo=cv?MODES.kapak:M,pr=cv?MODES.kapak.pre[0]:mo.pre[i%mo.pre.length];setCounts(pr[1]);const L=mo.f;place([L[(i*3+1)%L.length],1+(i*37)%SEEDS,i&1,0])}
  PROJ.pages.push({s:pageSnap()})}
 setPx(wpx(mm));closeWiz();openEditor(0);saveNow();if(PEND){const f=PEND;PEND=null;files(f,null)}}
// ana sayfa içeriği
const fmtD=t=>new Date(t).toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
let HQ='',HS='u';
async function renderHome(){const all=await dbAll();let L=all.filter(m=>m.name.toLowerCase().includes(HQ.toLowerCase()));L.sort((a,b)=>HS=='n'?a.name.localeCompare(b.name,'tr'):HS=='c'?b.created-a.created:b.updated-a.updated);
 $('pgrid').innerHTML=L.length?L.map(m=>`<article class="pc" data-id="${m.id}"><button class="pth" data-open="${m.id}" style="--r:${m.mm[0]/m.mm[1]}">${m.thumb?`<img src="${m.thumb}" alt="">`:'<span>▦</span>'}</button><div class="pi"><b data-rn="${m.id}">${esc(m.name)}</b><small>${m.n} sayfa · ${m.mm[0]}×${m.mm[1]} mm · ${fmtD(m.updated)}</small></div><div class="pa"><button data-open="${m.id}">Aç</button><button data-pdup="${m.id}" title="Kopyala">⧉</button><button data-pren="${m.id}" title="Yeniden adlandır">✎</button><button data-pdel="${m.id}" title="Sil">🗑</button></div></article>`).join(''):`<div class="empty"><div id="eo"></div><b>${all.length?'Eşleşen çalışma yok':'Henüz çalışma yok'}</b><p>${all.length?'Başka bir şey ara.':'İlk tasarımını oluştur, otomatik kaydedilir.'}</p>${all.length?'':'<button class="pb" data-new="1">＋ Yeni tasarım</button>'}</div>`;
 if($('eo'))$('eo').innerHTML=ELOGO;
 try{const e=await navigator.storage.estimate();$('stor').textContent=`${all.length} çalışma · ${(e.usage/1048576).toFixed(1)} MB kullanıldı`}catch(x){$('stor').textContent=`${all.length} çalışma kayıtlı`}if(window.bakInfo)bakInfo(all.length)}
$('qs').innerHTML=KINDS.map(k=>`<button class="qc" data-q="${k[0]}"><b>${k[2]}</b><span>${k[1]}</span><small>${k[4][0][2]}×${k[4][0][3]} mm</small></button>`).join('');
$('qs').onclick=e=>{const b=e.target.closest('[data-q]');if(b)openWiz(b.dataset.q)};
$('hnew').onclick=$('hnew2').onclick=()=>openWiz();
$('himg').onchange=e=>{PEND=[...e.target.files];e.target.value='';if(PEND.length)openWiz('dergi')};
$('srch').oninput=e=>{HQ=e.target.value;renderHome()};$('srt').onchange=e=>{HS=e.target.value;renderHome()};
$('pgrid').onclick=async e=>{const t=e.target;let b;
 if(t.closest('[data-new]'))return openWiz();
 if(b=t.closest('[data-open]'))return openProject(b.dataset.open);
 if(b=t.closest('[data-pdup]')){const r=await dbGet(b.dataset.pdup);if(r){r.id='p'+Date.now().toString(36);r.name+=' (kopya)';r.created=r.updated=Date.now();await dbPut(r,meta(r));toast('Kopyalandı');renderHome()}return}
 if(b=t.closest('[data-pren]')){const id=b.dataset.pren,el=$('pgrid').querySelector(`[data-rn="${id}"]`),inp=document.createElement('input');inp.className='wni';inp.value=el.textContent;el.replaceWith(inp);inp.focus();inp.select();
  const ok=async()=>{const r=await dbGet(id);if(r&&inp.value.trim()){r.name=inp.value.trim();await dbPut(r,meta(r))}renderHome()};inp.onkeydown=ev=>{if(ev.key=='Enter')ok();if(ev.key=='Escape')renderHome()};inp.onblur=ok;return}
 if(b=t.closest('[data-pdel]')){if(b.dataset.sure){await dbDel(b.dataset.pdel);toast('Silindi');renderHome()}else{b.dataset.sure=1;b.textContent='Emin misin?';b.classList.add('danger');setTimeout(()=>{b.dataset.sure='';b.textContent='🗑';b.classList.remove('danger')},3000)}}};
$('hch').innerHTML=['Ne tasarlamalıyım?','Hangi boyutu seçmeliyim?','Dergi için fikir ver'].map(q=>`<button class="chip" data-hq="${q}">${q}</button>`).join('');
$('hch').onclick=e=>{const b=e.target.closest('[data-hq]');if(b){chat(1);ask(b.dataset.hq)}};
$('hass').onclick=()=>chat(1);
$('hart').innerHTML=ELOGO;
const TIPS=['Görselini yükle: düzen ve renk paleti otomatik gelir.','Alt tuşuyla serbest taşıma, ok tuşlarıyla ince ayar yap.','PDF çıktısı tüm sayfaları tek dosyada indirir.','Asistan, tasarımına bakıp “böyle yaparsan daha iyi olur” der.'];
$('tips').innerHTML=TIPS.map(t=>`<li>${t}</li>`).join('');
// ayarlar penceresi
function cfgr(){const sw=(k,l,sub)=>`<label class="srow"><span>${l}<small>${sub}</small></span><input type="checkbox" data-cfg="${k}"${CFG[k]?' checked':''}></label>`;
 $('cfgm').innerHTML=`<div class="wz-box cb"><div class="wz-h"><h2>Ayarlar</h2><button class="ib" id="cx2" aria-label="Kapat">✕</button></div><div class="cfb"><div class="srow"><span>Tema<small>Görünüm modu</small></span><div class="seg2">${[['auto','Otomatik'],['light','Açık'],['dark','Koyu']].map(t=>`<button data-th="${t[0]}"${CFG.theme==t[0]?' class="on"':''}>${t[1]}</button>`).join('')}</div></div>
 ${sw('autosave','Otomatik kaydet','Değişiklikler kendiliğinden saklanır')}${sw('splash','Açılış animasyonu','Vybble logosu ile başla')}<div class="srow"><span>Animasyonlar<small>${(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)?'Bilgisayarında hareket kapalı; “Her zaman açık” ile Vybble’da açabilirsin':'Sistem ayarına göre'}</small></span><div class="seg2">${[['auto','Sisteme göre'],['on','Her zaman açık'],['reduce','Azaltılmış']].map(([k,l])=>`<button data-mo="${k}"${(CFG.motion===true?'reduce':CFG.motion==='on'?'on':'auto')==k?' class="on"':''}>${l}</button>`).join('')}</div></div>${sw('bot','Asistan balonu','Sağ alttaki robotu göster')}${sw('grid','Grid çizgileri','Yeni açılan çalışmalarda göster')}${sw('free','Serbest taşıma','Öğeler gride oturmadan taşınsın')}
 <div class="srow"><span>Varsayılan çözünürlük<small>Yeni tasarımlarda</small></span><select id="cdpi">${DPIS.map(d=>`<option value="${d[0]}"${CFG.dpi==d[0]?' selected':''}>${d[0]} dpi · ${d[1]}</option>`).join('')}</select></div>
 <div class="srow"><span>Depolama<small>Tüm çalışmaları bu cihazdan sil</small></span><button class="b" id="cclr">Tümünü sil</button></div></div></div>`}
function openCfg(){cfgr();$('cfgm').hidden=false}
$('hset').onclick=$('set3').onclick=openCfg;
$('cfgm').addEventListener('click',async e=>{const t=e.target;if(t.id=='cfgm'||t.closest('#cx2'))return $('cfgm').hidden=true;
 const th=t.closest('[data-th]');if(th){CFG.theme=th.dataset.th;cfgSave();applyCfg();return cfgr()}
 const mo=t.closest('[data-mo]');if(mo){CFG.motion=mo.dataset.mo=='reduce'?true:mo.dataset.mo=='on'?'on':false;cfgSave();applyCfg();return cfgr()}
 if(t.id=='cclr'){if(t.dataset.s){for(const m of await dbAll())await dbDel(m.id);toast('Tüm çalışmalar silindi');$('cfgm').hidden=true;renderHome()}else{t.dataset.s=1;t.textContent='Emin misin?';t.classList.add('danger')}}});
$('cfgm').addEventListener('change',e=>{const t=e.target;if(t.dataset.cfg){CFG[t.dataset.cfg]=t.checked}else if(t.id=='cdpi')CFG.dpi=+t.value;else return;cfgSave();applyCfg()});
document.addEventListener('keydown',e=>{if(e.key=='Escape'){closeWiz();$('cfgm').hidden=true;$('pmenu').hidden=true}
 if(!$('edw').hidden&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){if(e.key=='PageDown'||(e.altKey&&e.key=='ArrowRight'))goPage(PROJ.cur+1);if(e.key=='PageUp'||(e.altKey&&e.key=='ArrowLeft'))goPage(PROJ.cur-1)}});
document.addEventListener('click',e=>{if(!e.target.closest('#pmenu,[data-pa="add"]'))$('pmenu').hidden=true});
window.addEventListener('beforeunload',()=>{if(PROJ&&!$('edw').hidden)saveNow()});
