/* ===== v3: çoklu seçim, grup, hizalama, bileşen, ana sayfa, stiller, metin akışı, maske, şablonlar ===== */
const MSEL=new Set();var SAFE=0,SAFE_MM=5,PGOV=null,GD=null,TM=0;
const V3={};
const qa=s=>esc(s).replace(/"/g,'&quot;');
function nid(){let m=S.n||0;S.els.forEach(e=>{m=Math.max(m,e.id||0,e.gid||0)});if(PROJ)PROJ.pages.forEach(p=>p.s.els.forEach(e=>{m=Math.max(m,e.id||0,e.gid||0)}));return S.n=m+1}
const selIds=()=>{const a=[];if(S.sel!=null&&byId(S.sel))a.push(S.sel);MSEL.forEach(i=>{if(i!==S.sel&&byId(i))a.push(i)});return a};
const selEls=()=>selIds().map(byId);
const multi=()=>selIds().length>1;
const cloneEl=e=>{const n=JSON.parse(JSON.stringify({...e,im:null}));n.id=nid();if(n.type=='img')n.im=n.src?getIm(n.src):new Image();return n};
/* sayfa numarası belirteçleri */
function tk(t){if(typeof t!='string'||t.indexOf('{')<0)return t;const p=(PGOV!=null?PGOV:(PROJ?PROJ.cur:0))+1,n=PROJ?PROJ.pages.length:1;return t.replace(/\{sayfa\}/gi,p).replace(/\{toplam\}/gi,n).replace(/\{baslik\}/gi,()=>PROJ?PROJ.name||'':'').replace(/\{bolum\}/gi,()=>{const q=S.els.find(e=>e.on&&e.type=='t'&&e.txt&&String(e.txt).trim());return q?String(q.txt).split('\n')[0].trim():''})}
/* maskeler */
var MKC={};
function v3mp(n){if(!n)return null;if(MKC[n])return MKC[n];let P=null;
 if(n=='ell'){P=[];for(let i=0;i<72;i++){const t=i/72*Math.PI*2;P.push([50+50*Math.cos(t),50+50*Math.sin(t)])}}
 else if(n=='arch'){P=[[0,100]];for(let i=0;i<=36;i++){const t=Math.PI+i/36*Math.PI;P.push([50+50*Math.cos(t),50+50*Math.sin(t)])}P.push([100,100])}
 else if(n=='hex')P=[[25,0],[75,0],[100,50],[75,100],[25,100],[0,50]];
 else if(n=='dia')P=[[50,0],[100,50],[50,100],[0,50]];
 else if(n=='tri')P=[[50,0],[100,100],[0,100]];
 else if(n=='par')P=[[20,0],[100,0],[80,100],[0,100]];
 else if(n=='star'){P=[];for(let i=0;i<10;i++){const r=i%2?21:50,t=-Math.PI/2+i*Math.PI/5;P.push([50+r*Math.cos(t),50+r*Math.sin(t)])}}
 else if(n=='heart'){const R=[];for(let i=0;i<72;i++){const t=i/72*Math.PI*2;R.push([16*Math.pow(Math.sin(t),3),-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))])}const xs=R.map(p=>p[0]),ys=R.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);P=R.map(p=>[(p[0]-x0)/(x1-x0)*100,(p[1]-y0)/(y1-y0)*100])}
 else if(n=='cut')P=[[0,0],[85,0],[100,15],[100,100],[15,100],[0,85]];
 if(!P)return null;return MKC[n]={p:P,css:'polygon('+P.map(p=>p[0].toFixed(2)+'% '+p[1].toFixed(2)+'%').join(',')+')'}}
const V3M=[['','Yok'],['ell','Daire'],['arch','Kemer'],['hex','Altıgen'],['dia','Elmas'],['tri','Üçgen'],['par','Paralel'],['star','Yıldız'],['heart','Kalp'],['cut','Kesik köşe']];
function v3mc(e){const m=e.mask&&v3mp(e.mask);return m?'clip-path:'+m.css+';':''}
function v3on(e){return !!(e.mask&&v3mp(e.mask))}
function v3path(x,n,X,Y,w,h){const m=v3mp(n);x.beginPath();m.p.forEach((p,i)=>{const px=X+p[0]*w/100,py=Y+p[1]*h/100;i?x.lineTo(px,py):x.moveTo(px,py)});x.closePath()}
/* ---- seçim işaretleri ---- */
function markSel(){const cv=$('cv');if(!cv)return;cv.querySelectorAll('.e.ms').forEach(n=>n.classList.remove('ms'));MSEL.forEach(id=>{const n=cv.querySelector('.e[data-id="'+id+'"]');if(n)n.classList.add('ms')});
 document.querySelectorAll('#el .el').forEach(r=>{const id=+r.dataset.lid,x=byId(id);r.classList.toggle('ms',MSEL.has(id));r.classList.toggle('gp',!!(x&&x.gid));r.classList.toggle('cp',!!(x&&x.cid))});
 const c=$('v3cnt');if(c){const n=selIds().length;c.textContent=n>1?n+' öğe seçili':n==1?'1 öğe seçili':'Seçim yok'}}
function v3ov(){const cv=$('cv');if(!cv)return;if(SAFE&&S.mm){const x=SAFE_MM/S.mm[0]*100,y=SAFE_MM/S.mm[1]*100;cv.insertAdjacentHTML('beforeend',`<div class="safeg" style="left:${x}%;right:${x}%;top:${y}%;bottom:${y}%"></div>`)}markSel()}
{const _render=render;render=function(){_render();v3ov()};
 const _list=list;list=function(){_list();markSel()};
 const _pick=pick;pick=function(id){MSEL.clear();_pick(id);const e=byId(id);if(e&&e.gid){S.els.forEach(x=>{if(x.gid===e.gid&&x.id!==id)MSEL.add(x.id)});markSel()}};
 V3.pick0=_pick;
 const _enter=enter;enter=function(i){MSEL.clear();_enter(i);compUI();styUI()};
 const _addPage=addPage;addPage=function(k){_addPage(k);if(k!='dup'){let n=0;COMPS().filter(c=>c.master).forEach(c=>{if(!S.els.some(e=>e.cid===c.id)){compClones(c).forEach(x=>S.els.push(x));n++}});if(n){render();list();hist()}}};
 /* otomatik yerleşim, sabitlenmiş öğelerin konumunu bozmasın */
 const pinned=e=>!!(e.cid||e.ch||e.pin),KP=['dx','dy','rot','vert','cc','on','fs'];
 const wrapLay=f=>function(sp){const sv=S.els.filter(pinned).map(e=>[e,JSON.parse(JSON.stringify(e.pos)),KP.map(k=>e[k])]);f(sp);sv.forEach(([e,p,v])=>{e.pos=p;KP.forEach((k,i)=>{e[k]=v[i]})})};
 const _apply=apply;apply=wrapLay(_apply);const _place=place;place=wrapLay(_place)}
/* ---- seçim: tuval ---- */
function togMS(id){if(id===S.sel){const r=[...MSEL];if(r.length){MSEL.delete(r[0]);V3.pick0(r[0]);markSel()}return}
 if(S.sel==null){V3.pick0(id);return}
 MSEL.has(id)?MSEL.delete(id):MSEL.add(id);render();list();ed()}
$('cv').addEventListener('pointerdown',e=>{const x=e.target.closest('.e');if(!x||e.target.closest('[data-hd]'))return;const id=+x.dataset.id;
 if(!(modK(e))){const g0=byId(id);if(g0&&g0.gid&&!(multi()&&selIds().includes(id)))pick(id)}
 if(modK(e)){e.stopImmediatePropagation();e.preventDefault();togMS(id);return}
 if(multi()&&selIds().includes(id)){e.stopImmediatePropagation();e.preventDefault();GD={id,x:e.clientX,y:e.clientY,m:0,s:selEls().filter(a=>!a.lock).map(a=>[a,a.dx||0,a.dy||0])};$('cv').setPointerCapture(e.pointerId)}},true);
$('cv').addEventListener('pointermove',e=>{if(!GD)return;const b=$('cv').getBoundingClientRect(),dx=e.clientX-GD.x,dy=e.clientY-GD.y;if(Math.abs(dx)+Math.abs(dy)>3)GD.m=1;if(!GD.m)return;const k=100/b.width;GD.s.forEach(([a,x0,y0])=>{a.dx=+(x0+dx*k).toFixed(2);a.dy=+(y0+dy*k).toFixed(2)});render()});
$('cv').addEventListener('pointerup',()=>{if(!GD)return;const g=GD;GD=null;if(g.m)hist();else pick(g.id)});
$('cv').addEventListener('pointercancel',()=>{GD=null});
/* ---- seçim: katman listesi ---- */
$('el').addEventListener('click',e=>{const r=e.target.closest('[data-lid]');if(!r||e.target.closest('button'))return;if(!(modK(e)))return;e.stopPropagation();e.preventDefault();const id=+r.dataset.lid;
 if(e.shiftKey&&S.sel!=null){const o=zs().reverse().map(x=>x.id),a=o.indexOf(S.sel),b=o.indexOf(id);if(a>=0&&b>=0){MSEL.clear();o.slice(Math.min(a,b),Math.max(a,b)+1).forEach(i=>{if(i!==S.sel)MSEL.add(i)});render();list();ed();return}}
 togMS(id)},true);
/* ---- klavye ---- */
document.addEventListener('keydown',e=>{if($('edw').hidden||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const m=e.ctrlKey||e.metaKey,k=e.key.toLowerCase();
 if(m&&k=='g'){e.preventDefault();e.stopImmediatePropagation();e.shiftKey?V3.gp('u'):V3.gp('g');return}
 if(m&&k=='a'){e.preventDefault();e.stopImmediatePropagation();if(S.sel==null&&S.els[0])S.sel=S.els[0].id;S.els.forEach(x=>{if(x.id!==S.sel&&x.on&&!x.lock)MSEL.add(x.id)});render();list();ed();return}
 if(e.key=='Escape'&&MSEL.size){MSEL.clear();render();list();return}
 if(!multi())return;
 if(e.key=='Delete'||e.key=='Backspace'){e.preventDefault();e.stopImmediatePropagation();const ids=selIds();S.els=S.els.filter(x=>!ids.includes(x.id));MSEL.clear();S.sel=S.els[0]&&S.els[0].id;render();list();ed();hist();return}
 if(m&&k=='d'){e.preventDefault();e.stopImmediatePropagation();const idm={},gm={},N=selEls().map(o=>{const n=cloneEl(o);idm[o.id]=n.id;n.dx=+((n.dx||0)+2).toFixed(2);n.dy=+((n.dy||0)+2).toFixed(2);n.z=topZ()+10;delete n.cid;delete n.cix;if(o.gid){gm[o.gid]=gm[o.gid]||nid();n.gid=gm[o.gid]}S.els.push(n);return n});MSEL.clear();S.sel=N[0].id;N.slice(1).forEach(n=>MSEL.add(n.id));render();list();ed();hist();return}
 const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
 if(d){e.preventDefault();e.stopImmediatePropagation();const st=e.shiftKey?2:.5;selEls().forEach(o=>{if(o.lock)return;o.dx=+((o.dx||0)+d[0]*st).toFixed(2);o.dy=+((o.dy||0)+d[1]*st).toFixed(2)});render();hist()}},true);
/* ---- hizala / dağıt ---- */
function v3boxes(ids){const cv=$('cv'),b=cv.getBoundingClientRect(),k=100/b.width;return ids.map(id=>{const n=cv.querySelector('.e[data-id="'+id+'"]');if(!n)return null;const r=n.getBoundingClientRect();return{id,x:(r.left-b.left)*k,y:(r.top-b.top)*k,w:r.width*k,h:r.height*k}}).filter(Boolean)}
V3.al=v=>{const els=selEls().filter(e=>!e.lock&&e.on);if(!els.length)return toast('Önce bir öğe seç');render();const bx=v3boxes(els.map(e=>e.id));if(!bx.length)return;
 const cb=$('cv').getBoundingClientRect(),H=cb.height*100/cb.width;let mode=$('v3to').value;if(mode=='auto')mode=els.length>1?'sel':'mar';if(mode=='sel'&&els.length<2)mode='mar';
 const T=mode=='sel'?{x0:Math.min(...bx.map(b=>b.x)),y0:Math.min(...bx.map(b=>b.y)),x1:Math.max(...bx.map(b=>b.x+b.w)),y1:Math.max(...bx.map(b=>b.y+b.h))}:mode=='page'?{x0:0,y0:0,x1:100,y1:H}:{x0:S.mar,y0:S.mar,x1:100-S.mar,y1:H-S.mar};
 bx.forEach(b=>{const e=byId(b.id);let dx=0,dy=0;if(v=='l')dx=T.x0-b.x;else if(v=='ch')dx=(T.x0+T.x1)/2-(b.x+b.w/2);else if(v=='r')dx=T.x1-(b.x+b.w);else if(v=='t')dy=T.y0-b.y;else if(v=='cv')dy=(T.y0+T.y1)/2-(b.y+b.h/2);else if(v=='b')dy=T.y1-(b.y+b.h);e.dx=+((e.dx||0)+dx).toFixed(2);e.dy=+((e.dy||0)+dy).toFixed(2)});render();hist()};
V3.ds=v=>{const els=selEls().filter(e=>!e.lock&&e.on);if(els.length<3)return toast('Eşit dağıtmak için en az 3 öğe seç');render();const bx=v3boxes(els.map(e=>e.id));if(bx.length<3)return;const H=v=='h',key=H?'x':'y',sz=H?'w':'h';bx.sort((a,b)=>a[key]-b[key]);
 const f=bx[0],l=bx[bx.length-1],span=l[key]+l[sz]-f[key],sum=bx.reduce((s,b)=>s+b[sz],0),gap=(span-sum)/(bx.length-1);let pos=f[key]+f[sz]+gap;
 for(let i=1;i<bx.length-1;i++){const b=bx[i],e=byId(b.id),d=pos-b[key];if(H)e.dx=+((e.dx||0)+d).toFixed(2);else e.dy=+((e.dy||0)+d).toFixed(2);pos+=b[sz]+gap}render();hist()};
/* ---- grup ---- */
V3.gp=v=>{const els=selEls();if(v=='g'){if(els.length<2)return toast('Gruplamak için en az 2 öğe seç');const g=nid();els.forEach(e=>e.gid=g);render();list();hist();toast('Gruplandı')}
 else{const gs=new Set(els.map(e=>e.gid).filter(Boolean));if(!gs.size)return toast('Seçimde grup yok');S.els.forEach(e=>{if(gs.has(e.gid))delete e.gid});render();list();hist();toast('Grup çözüldü')}};
V3.safe=()=>{SAFE=SAFE?0:1;const b=$('v3safe');if(b)b.classList.toggle('on',!!SAFE);render()};
/* ---- bileşenler ---- */
const CEXC=new Set(['id','fr','pos','dx','dy','txt','src','im','on','z','cid','cix','gid','nm','lock','sel','ch','rot','pin','sty','nf']);
function COMPS(){if(!PROJ)return[];PROJ.components=PROJ.components||[];PROJ.components.forEach((c,i)=>{if(!c.els&&c.el){c.els=[c.el];delete c.el}if(!c.id)c.id='c'+Date.now().toString(36)+i});return PROJ.components}
function saveCompFrom(els,name,master){const L=COMPS(),id='c'+Date.now().toString(36)+L.length,comp={id,name:name||('Bileşen '+(L.length+1)),master:!!master,els:els.map((e,i)=>{const o=JSON.parse(JSON.stringify({...e,im:null}));if(o.type=='img')o.src='';delete o.id;delete o.gid;delete o.sel;o.cix=i;o.cid=id;return o})};L.push(comp);
 els.forEach((e,i)=>{e.cid=id;e.cix=i});if(els.length>1&&!(els[0].gid&&els.every(e=>e.gid===els[0].gid))){const g=nid();els.forEach(e=>{e.gid=g})}return comp}
function compClones(c){const g=c.els.length>1?nid():null,z0=topZ();return c.els.map((o,i)=>{const n=JSON.parse(JSON.stringify(o));n.id=nid();n.on=true;n.z=z0+10*(i+1);n.cid=c.id;n.cix=i;if(g)n.gid=g;else delete n.gid;if(n.type=='img'){n.src='';n.im=new Image()}return n})}
function compSync(c){mapPages(()=>{S.els.forEach(e=>{if(e.cid!==c.id)return;const m=c.els[e.cix];if(!m||m.type!==e.type)return;for(const k in m){if(!CEXC.has(k))e[k]=JSON.parse(JSON.stringify(m[k]))}})})}
function compUI(){const c=$('v3comps');if(!c)return;const L=COMPS();c.innerHTML=L.length?L.map((x,i)=>`<div class="v3c"><input class="wni v3n" data-v3n="c${i}" value="${qa(x.name)}" aria-label="Bileşen adı"><div class="v3b"><button class="b mini" data-v3="cins" data-v="${i}" title="Bu sayfaya ekle">＋ Ekle</button><button class="b mini" data-v3="call" data-v="${i}" title="Tüm sayfalara yerleştir">▤ Tüm sayfalar</button><button class="b mini${x.master?' on':''}" data-v3="cmas" data-v="${i}" title="Yeni sayfalara otomatik eklensin (ana sayfa)">${x.master?'★':'☆'} Ana sayfa</button><button class="b mini danger" data-v3="cdel" data-v="${i}" aria-label="Sil">✕</button></div></div>`).join(''):'<p class="mut">Henüz bileşen yok. Öğeleri seçip “◆ Bileşen yap”a bas.</p>'}
V3.mkc=()=>{const els=selEls();if(!els.length)return toast('Önce öğe seç');const c=saveCompFrom(els);render();list();ed();hist();compUI();if(typeof rpr=='function')try{rpr()}catch(e){}toast('Bileşen kaydedildi: '+c.name)};
V3.cins=i=>{const c=COMPS()[+i];if(!c)return;const N=compClones(c);N.forEach(n=>S.els.push(n));MSEL.clear();S.sel=N[0].id;N.slice(1).forEach(n=>MSEL.add(n.id));render();list();ed();thumbs();hist()};
V3.call=(i,b,e,skip)=>{const c=COMPS()[+i];if(!c)return;mapPages(pi=>{if(skip&&pi==0)return;if(!S.els.some(x=>x.cid===c.id))compClones(c).forEach(n=>S.els.push(n))});compUI();toast('Tüm sayfalara yerleştirildi')};
V3.cmas=i=>{const c=COMPS()[+i];if(!c)return;c.master=!c.master;compUI();toast(c.master?'Yeni sayfalara otomatik eklenecek':'Ana sayfadan çıkarıldı')};
V3.cdel=i=>{const L=COMPS(),c=L[+i];if(!c)return;L.splice(+i,1);mapPages(()=>{S.els.forEach(e=>{if(e.cid===c.id){delete e.cid;delete e.cix}})});compUI();if(typeof rpr=='function')try{rpr()}catch(e){}};
V3.cupd=()=>{const els=selEls().filter(e=>e.cid);if(!els.length)return toast('Bileşen örneği seç');const cs=new Set();els.forEach(e=>{const c=COMPS().find(x=>x.id===e.cid);if(!c||!c.els[e.cix])return;const o=JSON.parse(JSON.stringify({...e,im:null}));if(o.type=='img')o.src='';['id','gid','sel','z'].forEach(k=>delete o[k]);o.cix=e.cix;o.cid=c.id;c.els[e.cix]=o;cs.add(c)});cs.forEach(compSync);compUI();toast('Bileşen güncellendi, tüm örnekler eşitlendi')};
V3.cunl=()=>{selEls().forEach(e=>{delete e.cid;delete e.cix});render();list();ed();hist()};
function pnoEl(){const e=mk('m');e.id=nid();e.txt='{sayfa} / {toplam}';e.al='right';e.tc='none';e.fs=1.6;e.va='end';e.pos=[Math.max(1,S.cols-2),S.rows,3,1];return e}
V3.pno=()=>{const e=pnoEl();S.els.push(e);MSEL.clear();S.sel=e.id;render();list();ed();hist();toast('Sayfa numarası eklendi')};
V3.pnoall=()=>{const e=pnoEl();S.els.push(e);const c=saveCompFrom([e],'Sayfa numarası',true);render();list();hist();V3.call(COMPS().indexOf(c))};
/* ---- metin stilleri ---- */
const SKEYS=['ff','fw','lh','ls','col','tc','it','al','ws','ind','cc','va','sw','sc','sb','sx','sy','scol','gr','col2','ga'];
function STYLES(){if(!PROJ)return[];PROJ.styles=PROJ.styles||[];return PROJ.styles}
const styOf=e=>{const p={};SKEYS.forEach(k=>{if(e[k]!==undefined)p[k]=e[k]});return p};
function styUI(){const c=$('v3styles');if(!c)return;const L=STYLES();c.innerHTML=L.length?L.map((x,i)=>`<div class="v3c"><input class="wni v3n" data-v3n="s${i}" value="${qa(x.name)}" aria-label="Stil adı"><div class="v3b"><button class="b mini" data-v3="sapp" data-v="${i}">Uygula</button><button class="b mini" data-v3="supd" data-v="${i}" title="Seçili metnin görünümüyle güncelle, tüm sayfalara yay">⟳ Güncelle</button><button class="b mini danger" data-v3="sdel" data-v="${i}" aria-label="Sil">✕</button></div></div>`).join(''):'<p class="mut">Henüz stil yok. Bir metni seçip aşağıdan kaydet.</p>'}
V3.smk=()=>{const e=selEls().find(x=>x.txt!==undefined);if(!e)return toast('Önce bir metin seç');const L=STYLES(),s={id:'s'+Date.now().toString(36)+L.length,name:'Stil '+(L.length+1),p:styOf(e)};L.push(s);e.sty=s.id;styUI();ed();hist();toast('Stil kaydedildi')};
V3.sapp=i=>{const s=STYLES()[+i];if(!s)return;const t=selEls().filter(x=>x.txt!==undefined);if(!t.length)return toast('Önce metin seç');t.forEach(x=>{Object.assign(x,JSON.parse(JSON.stringify(s.p)));x.sty=s.id});fitAll();render();list();ed();hist()};
V3.supd=i=>{const s=STYLES()[+i];const e=selEls().find(x=>x.txt!==undefined);if(!s||!e)return toast('Güncellemek için bir metin seç');s.p=styOf(e);mapPages(()=>{S.els.forEach(x=>{if(x.sty===s.id)Object.assign(x,JSON.parse(JSON.stringify(s.p)))});fitAll()});toast('Stil tüm sayfalara yayıldı')};
V3.sdel=i=>{const L=STYLES(),s=L[+i];if(!s)return;L.splice(+i,1);S.els.forEach(e=>{if(e.sty===s.id)delete e.sty});styUI()};
/* ---- görsel maskesi ---- */
V3.mask=v=>{selEls().filter(e=>e.type=='img').forEach(e=>{if(v)e.mask=v;else delete e.mask});render();ed();hist()};
/* ---- metin akışı ---- */
function v3fits(e,t){const o=e.txt;e.txt=t;let r=false;try{let[,,w,h]=geo(e,100);if(e.vert)[w,h]=[h,w];SC.u=1;const f=e.fs;SC.font=fnt(e,f);SC.fs=f;if('wordSpacing'in SC)SC.wordSpacing=(e.ws||0)*f+'px';if('letterSpacing'in SC)SC.letterSpacing=e.ls*f+'px';const L=wrap(SC,e,w,e.cc);r=L.length*e.lh*f<=h*e.cc+.01&&L.every(l=>SC.measureText(tcf(e,l)).width<=w/e.cc+.1)}finally{e.txt=o}return r}
function v3split(e,t){const W=t.split(' ');if(W.length<2||v3fits(e,t))return[t,''];let lo=1,hi=W.length-1;while(lo<hi){const m=(lo+hi+1)>>1;v3fits(e,W.slice(0,m).join(' '))?lo=m:hi=m-1}return[W.slice(0,lo).join(' '),W.slice(lo).join(' ')]}
function v3blank(idx){const s=JSON.parse(JSON.stringify(PROJ.pages[idx].s));s.els=[];s.sel=null;PROJ.pages.splice(idx+1,0,{s,thumb:''})}
V3.flow=async()=>{const e0=cur();if(!e0||!'bq'.includes(e0.type)||e0.txt===undefined)return toast('Önce bir paragraf seç');
 await loadF();if(!e0.ch){e0.ch=nid();if(e0.type=='b'&&e0.fs<1.8)e0.fs=1.9}e0.nf=1;const ch=e0.ch,tpl=JSON.parse(JSON.stringify({...e0,im:null}));
 PROJ.pages[PROJ.cur].s=pageSnap();const cur0=PROJ.cur,loc=[];
 PROJ.pages.forEach((p,pi)=>{const x=p.s.els.find(a=>a.ch===ch&&a.txt!==undefined);if(x)loc.push([pi,x.id])});loc.sort((a,b)=>a[0]-b[0]);
 let rest=loc.map(([pi,id])=>PROJ.pages[pi].s.els.find(a=>a.id==id).txt).join(' ').replace(/\s+$/,''),k=0,last=loc[0][0];const fresh=[];
 for(let g=0;g<80;g++){let pi,id;
  if(k<loc.length){[pi,id]=loc[k]}
  else{pi=last+1;v3blank(last);fresh.push(pi);pageLoad(PROJ.pages[pi].s);const n=cloneEl(tpl);n.ch=ch;n.txt='';n.nf=1;S.els.push(n);id=n.id;PROJ.pages[pi].s=pageSnap();loc.push([pi,id])}
  pageLoad(PROJ.pages[pi].s);const e=S.els.find(a=>a.id==id);const r=v3split(e,rest);e.txt=r[0];rest=r[1];PROJ.pages[pi].s=pageSnap();PROJ.pages[pi].thumb='';last=pi;k++;if(!rest)break}
 const gone=[];for(;k<loc.length;k++){const[pi,id]=loc[k];const p=PROJ.pages[pi].s;p.els=p.els.filter(a=>a.id!=id);PROJ.pages[pi].thumb='';if(pi>loc[0][0]&&p.els.every(a=>a.cid))gone.push(pi)}
 let c0=cur0;if(gone.length&&PROJ.pages.length>gone.length){gone.sort((a,b)=>b-a).forEach(pi=>{PROJ.pages.splice(pi,1);if(pi<c0)c0--;else if(pi==c0)c0=-1});if(c0<0)c0=loc[0][0]}
 fresh.forEach(pi=>{pageLoad(PROJ.pages[pi].s);COMPS().filter(c=>c.master).forEach(c=>{if(!S.els.some(e=>e.cid===c.id))compClones(c).forEach(n=>S.els.push(n))});PROJ.pages[pi].s=pageSnap()});
 enter(Math.min(c0,PROJ.pages.length-1));initThumbs();toast(rest?'Metin sığmadı, sayfa sınırı doldu':(fresh.length?fresh.length+' yeni sayfa eklendi · ':'')+'Metin sayfalara akıtıldı')};
V3.fcut=()=>{const e=cur();if(!e)return;delete e.ch;delete e.nf;render();list();ed();hist()};
/* ---- ek panel (seçili öğe) ---- */
{const _ed=ed;ed=function(){_ed();const e=cur(),h=$('ed');if(!e||!h)return;let x='';
 if(e.type=='img')x+=`<div class="v3x"><b>Maske</b><div class="chips">${V3M.map(m=>`<button class="chip${(e.mask||'')==m[0]?' on':''}" data-v3="mask" data-v="${m[0]}">${m[1]}</button>`).join('')}</div></div>`;
 if(e.txt!==undefined){const L=STYLES();x+=`<div class="v3x"><b>Metin stili</b><div class="chips">${L.map((s,i)=>`<button class="chip${e.sty===s.id?' on':''}" data-v3="sapp" data-v="${i}">${esc(s.name)}</button>`).join('')}<button class="chip" data-v3="smk">＋ Kaydet</button></div><small class="mut">Sayfa numarası için metne <code>{sayfa}</code> ve <code>{toplam}</code> yaz.</small></div>`}
 if('bq'.includes(e.type)&&e.txt!==undefined)x+=`<div class="v3x"><b>Metin akışı</b><div class="chips"><button class="chip" data-v3="flow">⤵ Taşan metni sonraki sayfalara akıt</button>${e.ch?'<button class="chip" data-v3="fcut">Akışı kes</button>':''}</div>${e.ch?'<small class="mut">Bu kutu bir akış zincirinin parçası; metni değiştirince yeniden akıt.</small>':''}</div>`;
 if(e.cid)x+=`<div class="v3x"><b>Bileşen</b><div class="chips"><button class="chip" data-v3="cupd">⟳ Bileşeni güncelle</button><button class="chip" data-v3="cunl">Bağlantıyı kes</button></div></div>`;
 if(x)h.insertAdjacentHTML('beforeend',x)}}
/* ---- olaylar ---- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-v3]');if(!b)return;e.stopPropagation();const f=V3[b.dataset.v3];if(f)f(b.dataset.v,b,e)},true);
document.addEventListener('change',e=>{const n=e.target.closest('[data-v3n]');if(!n)return;const k=n.dataset.v3n,L=k[0]=='c'?COMPS():STYLES(),o=L[+k.slice(1)];if(o){o.name=n.value.trim()||o.name;if(k[0]!='c')ed()}});
/* ---- şablonlar ---- */
const palBy=n=>PALS.find(p=>p[0]==n)||PALS[0];
const TPLS=[
{name:'Lüks kahve kataloğu',k:'katalog',n:6,st:5,pal:'Çikolata',cover:1,t:['KAHVE\nKATALOĞU','Tek menşe çekirdekler','Demleme rehberi','Mevsimin seçkisi','Atölye ve eğitim','Sipariş'],s:['Seçili çekirdekler · 2026'],m:'Katalog · {n}',pno:1},
{name:'Moda dergisi',k:'dergi',n:8,st:2,pal:'Altın',cover:1,t:['MODA\nEDİTÖRÜ','Sonbahar siluetleri','Sokak stili','Röportaj','Kumaşın dili','Atölyeden notlar'],s:['Sayı 07 · Sonbahar'],m:'Moda · Sayfa {n}',pno:1},
{name:'Mimari portfolyo',k:'katalog',f:1,n:6,st:7,pal:'Mono',cover:1,t:['PORTFOLYO\n2026','Konut projeleri','Kamusal alan','Restorasyon','Maket çalışmaları','İletişim'],s:['Mimarlık · Seçili işler'],m:'Portfolyo · {n}',pno:1},
{name:'Spor dergisi',k:'dergi',n:6,st:8,pal:'Neon',cover:1,t:['SAHA\nHAFTASI','Maçın hikâyesi','Antrenman günlüğü','Oyuncu profili','İstatistikler'],s:['Haftalık spor dergisi'],m:'Spor · {n}',pno:1},
{name:'Teknoloji broşürü',k:'brosur',n:2,st:4,pal:'Siber',t:['GELECEĞİ\nİNŞA ET','Özellikler'],s:['Yeni nesil platform'],m:'Broşür · {n}'},
{name:'Konser afişi',k:'afis',n:1,st:3,pal:'Güneş',t:['CANLI\nKONSER'],s:['12 Aralık · 21:00 · Sahne İstanbul'],m:'Biletler biletix.com'},
{name:'Film festivali afişi',k:'afis',n:1,st:0,pal:'Bordo',t:['FESTİVAL\n2026'],s:['Kısa film gösterimleri · Ücretsiz giriş'],m:'15–22 Mayıs'},
{name:'Menü tarzı katalog',k:'katalog',n:6,st:5,pal:'Retro',cover:1,t:['MENÜ\nKATALOĞU','Başlangıçlar','Ana yemekler','Tatlılar','İçecekler','Rezervasyon'],s:['Mevsim menüsü · 2026','Şefin seçkisi','Günün önerisi'],b:['Mercimek çorbası ........ 120 ₺\nTereyağlı, limon ve kırmızı biberle.\nHumus ........ 140 ₺\nNohut, tahin ve zeytinyağı.','Izgara köfte ........ 320 ₺\nKözlenmiş biber ve pilavla.\nFırın levrek ........ 410 ₺\nMevsim yeşillikleriyle.','Fıstıklı baklava ........ 180 ₺\nAntep fıstığı, kaymak eşliğinde.\nSütlaç ........ 110 ₺\nFırında, tarçınlı.','Türk kahvesi ........ 70 ₺\nLokum ile.\nTaze limonata ........ 90 ₺\nNaneli, ev yapımı.'],m:'Menü · {n}',pno:1},
{name:'Restoran menüsü',k:'menu',n:2,st:5,pal:'Zeytin',t:['MENÜ','TATLILAR'],s:['Günün tabağı'],m:'Afiyet olsun'},
{name:'Kartvizit',k:'kartvizit',n:2,st:7,pal:'Kâğıt',t:['AD SOYAD','İLETİŞİM'],s:['Grafik tasarımcı'],m:'ornek@posta.com'},
{name:'Instagram paylaşımı',k:'sosyal',n:3,st:6,pal:'Pembe pop',t:['YENİ\nKOLEKSİYON','BİLDİRİM','ÖNE ÇIKAN'],s:['Bu hafta keşfet'],m:'@hesapadi'},
{name:'Dergi kapağı',k:'kapak',n:1,st:0,pal:'Mürekkep',t:['EDİTÖRÜN\nSEÇKİSİ'],s:['Sayı 12 · Kış'],m:'www.ornek.com'},
{name:'Albüm kapağı',k:'kapak',f:3,n:1,st:4,pal:'Neon',t:['GECE\nYOLCUSU'],s:['Yeni albüm'],m:'2026'},
{name:'Kitap kapağı',k:'kapak',f:2,n:1,st:5,pal:'Retro',t:['SESSİZ\nŞEHİR'],s:['Bir roman'],m:'Yazar Adı'}];
function tplGo(i){const t=TPLS[i];if(!t)return;const ki=KINDS.findIndex(k=>k[0]==t.k);if(ki<0)return;
 WZ=newW(ki);WZ.n=t.n;WZ.name=t.name;WZ.ne=1;WZ.st=t.st;WZ.f=t.f||0;WZ.o=null;WZ.custom=false;WZ.start='auto';WZ.cover=!!t.cover&&t.n>1;wizGo();
 const p=palBy(t.pal);
 mapPages(pi=>{palQ(p[1],p[2],p[3]);const T=t.t[pi%t.t.length],Sx=(t.s||[])[pi%((t.s||['']).length)];let bi=0;S.els.forEach(e=>{if(e.type=='t')e.txt=T;else if(e.type=='s'&&Sx)e.txt=Sx;else if(e.type=='b'&&t.b)e.txt=t.b[(pi+bi++)%t.b.length];else if(e.type=='m'&&t.m)e.txt=t.m.replace('{n}',pi+1)});fitAll()});
 if(t.pno&&t.n>1){const e=pnoEl();const c=saveCompFrom([e],'Sayfa numarası',true);V3.call(COMPS().indexOf(c),null,null,true)}
 toast('Şablon hazır: '+t.name)}
function tplRender(){const c=$('tpls');if(!c)return;c.innerHTML=TPLS.map((t,i)=>{const p=palBy(t.pal),s=STY[t.st],K=KINDS.find(k=>k[0]==t.k);return`<button class="tpl" data-tpl="${i}" style="--tb:${p[1]};--tt:${p[2]};--ta:${p[3]};--tf:'${s.t}'"><i class="tp"><u></u><b>${esc(t.t[0].split('\n')[0])}</b><em></em></i><span>${esc(t.name)}</span><small>${K?K[1]:''} · ${t.n} sayfa</small></button>`}).join('')}
tplRender();
$('tpls').addEventListener('click',e=>{const b=e.target.closest('[data-tpl]');if(b)tplGo(+b.dataset.tpl)});

/* ---- dokunmatik + PWA ---- */
function modK(e){return !!(e.shiftKey||e.ctrlKey||e.metaKey||TM)}
V3.tm=()=>{TM=TM?0:1;const b=$('v3tm');if(b)b.classList.toggle('on',!!TM);toast(TM?'Çoklu seçim açık: dokunduğun öğeler seçime eklenir':'Çoklu seçim kapalı')};
V3.nd=v=>{const els=selEls().filter(e=>!e.lock);if(!els.length)return toast('Önce öğe seç');const d={l:[-1,0],r:[1,0],u:[0,-1],d:[0,1]}[v];els.forEach(o=>{o.dx=+((o.dx||0)+d[0]*.5).toFixed(2);o.dy=+((o.dy||0)+d[1]*.5).toFixed(2)});render();hist()};
var DEFI=null;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform=='MacIntel'&&navigator.maxTouchPoints>1),isApp=()=>(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
function instUI(){const c=$('inst');if(!c)return;if(isApp()){c.hidden=true;return}const p=$('insp'),b=$('instb');
 if(DEFI){c.hidden=false;p.textContent='Editra’yı telefonuna veya bilgisayarına uygulama gibi kur. Çevrimdışı da açılır.';b.hidden=false}
 else if(isIOS){c.hidden=false;p.innerHTML='Safari’de <b>Paylaş</b> düğmesine, sonra <b>Ana Ekrana Ekle</b>’ye dokun. Editra uygulama gibi açılır.';b.hidden=true}
 else c.hidden=true}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();DEFI=e;instUI()});
addEventListener('appinstalled',()=>{DEFI=null;instUI();toast('Editra kuruldu')});
$('instb').onclick=async()=>{if(!DEFI)return;DEFI.prompt();try{await DEFI.userChoice}catch(e){}DEFI=null;instUI()};
instUI();
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})});
