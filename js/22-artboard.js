/* ================= ARTBOARD'LAR: tüm sayfalar çalışma alanında, sürükle · Alt+sürükle kopyala · sırayla dışa aktar ================= */
/* Etkin artboard canlı tuvaldir (#cv); diğerleri gerçek motorla çizilmiş önizlemelerdir, tıklayınca düzenlenebilir olur.
   Konumlar sayfa genişliği biriminde PROJ.pages[i].ab={x,y} olarak saklanır. Dizi sırası her zaman okuma sırasıdır
   (yukarıdan aşağı, soldan sağa); PDF, PNG ve SVG dışa aktarımı bu sırayla yapılır. */
(function(){
if(!window.v4ui||!document.getElementById('cvw'))return;
const ui=window.v4ui,GAP=.12,GAPY=.24,PW=1000;
const $$=id=>document.getElementById(id);
const W=()=>$$('cvw'),CV=()=>$$('cv'),CVP=()=>W().querySelector('.cvp');
const on=()=>typeof PROJ!='undefined'&&PROJ&&PROJ.pages&&PROJ.pages.length&&!$$('edw').hidden;
document.body.classList.add('abm');

/* ---------- konum yardımcıları ---------- */
const hU=()=>1/(S.fmt||1);
const ok=a=>a&&isFinite(a.x)&&isFinite(a.y)&&Math.abs(a.x)<1e4&&Math.abs(a.y)<1e4;
const r3=v=>Math.round(v*1000)/1000;
const hits=(a,b)=>a.x<b.x+1+GAP/2&&b.x<a.x+1+GAP/2&&a.y<b.y+hU()+GAPY/2&&b.y<a.y+hU()+GAPY/2;
function freeSpot(pos,self){const p={x:r3(pos.x),y:r3(pos.y)};
 for(let n=0;n<800;n++){const q=PROJ.pages.find(o=>o!==self&&ok(o.ab)&&hits(p,o.ab));if(!q)return p;p.x=r3(q.ab.x+1+GAP)}return p}
function ensure(){PROJ.pages.forEach((p,i)=>{if(ok(p.ab))return;const b=i?PROJ.pages[i-1].ab:null;p.ab=null;p.ab=freeSpot(ok(b)?{x:b.x+1+GAP,y:b.y}:{x:0,y:0},p)})}
/* okuma sırası: satır satır (y), satır içinde soldan sağa (x) */
function reading(arr){const L=arr.slice().sort((a,b)=>a.ab.y-b.ab.y||a.ab.x-b.ab.x),rows=[];const tol=hU()/2;
 L.forEach(p=>{const r=rows[rows.length-1];if(r&&p.ab.y-r.y0<tol)r.L.push(p);else rows.push({y0:p.ab.y,L:[p]})});
 return rows.flatMap(r=>r.L.sort((a,b)=>a.ab.x-b.ab.x))}
/* sayfa dizisi değişince yorum iğnelerini ve "sayfaya git" bağlantılarını yeni sıraya taşı */
function remap(prev,next){const mp=prev.map(p=>next.indexOf(p));
 (PROJ.comments||[]).forEach(c=>{if(mp[c.pg]>=0)c.pg=mp[c.pg]});
 PROJ.comments=(PROJ.comments||[]).filter(c=>c.pg>=0&&c.pg<next.length);
 const fix=els=>(els||[]).forEach(e=>{if(e.lk&&e.lk.t=='p'&&e.lk.n>=1){const j=mp[(e.lk.n|0)-1];if(j>=0)e.lk.n=j+1;else delete e.lk}});
 next.forEach(p=>fix(p.s&&p.s.els));fix(S.els)}
function reorder(){const prev=PROJ.pages.slice(),next=reading(prev);if(next.every((p,i)=>p===prev[i]))return false;
 const curP=prev[PROJ.cur];remap(prev,next);PROJ.pages=next;PROJ.cur=next.indexOf(curP);try{pgnum()}catch(x){}return true}

/* ---------- önizlemeler (gerçek çizim motoruyla) ---------- */
const PV=new WeakMap();let Q=[],pumping=0,ver=0;
const fresh=p=>{const v=p.s&&PV.get(p.s);return v&&v.k==S.fmt+'|'+S.mm};
function queue(){if(!on())return;PROJ.pages.forEach((p,i)=>{if(i!=PROJ.cur&&!fresh(p)&&!Q.includes(p))Q.push(p)});if(!pumping&&Q.length){pumping=1;requestAnimationFrame(pump)}}
function pump(){pumping=0;if(!on()){Q=[];return}
 const p=Q.shift();if(!p)return;const i=PROJ.pages.indexOf(p);
 if(i>=0&&i!=PROJ.cur&&!fresh(p)&&p.s){let url='',wait=null;const keep={};PGK.forEach(k=>keep[k]=S[k]);
  try{pageLoad(p.s);PGOV=i;const pend=S.els.filter(e=>e.type=='img'&&e.src&&e.im&&!e.im.complete).map(e=>e.im);if(pend.length)wait=pend;url=draw(PW).toDataURL('image/jpeg',.88)}catch(e){}
  finally{PGOV=null;PGK.forEach(k=>S[k]=keep[k])}
  if(url){if(!wait)PV.set(p.s,{k:S.fmt+'|'+S.mm,url});const im=document.querySelector(`#abh .abo[data-i="${i}"] img`);if(im)im.src=url;p._pv=url}
  if(wait){let n=wait.length;const go=()=>{if(--n<=0)queue()};wait.forEach(im=>{im.addEventListener('load',go,{once:true});im.addEventListener('error',go,{once:true})})}}
 if(Q.length){pumping=1;requestAnimationFrame(pump)}}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(on()){Q=[];PROJ.pages.forEach(p=>{if(p.s)PV.delete(p.s)});queue()}});

/* ---------- yerleşim ---------- */
let L={bw:0,minX:0,minY:0,px:0,py:0},sig='',lastProj=null;
const hold=()=>{let h=$$('abh');if(!h||!h.isConnected){h=document.createElement('div');h.id='abh';CVP().insertBefore(h,CVP().firstChild)}return h};
function geo(){const A=PROJ.pages.map(p=>p.ab);return{minX:Math.min(...A.map(a=>a.x)),maxX:Math.max(...A.map(a=>a.x))+1,minY:Math.min(...A.map(a=>a.y)),maxY:Math.max(...A.map(a=>a.y))+hU()}}
function abLayout(){if(!on())return;ensure();const w=W(),cv=CV(),cvp=CVP();if(!w.clientWidth)return;
 const bw=parseFloat(cv.style.width)||cv.offsetWidth;if(!bw)return;const bh=bw/S.fmt,G=geo(),px=Math.round(w.clientWidth*.7),py=Math.round(w.clientHeight*.7);
 cvp.style.width=Math.round((G.maxX-G.minX)*bw+2*px)+'px';cvp.style.height=Math.round((G.maxY-G.minY)*bw+2*py)+'px';
 if(L.bw==bw&&lastProj===PROJ){const dx=(L.minX-G.minX)*bw,dy=(L.minY-G.minY)*bw;if(dx)w.scrollLeft+=dx;if(dy)w.scrollTop+=dy}
 L={bw,bh,minX:G.minX,minY:G.minY,px,py};lastProj=PROJ;
 const at=p=>[Math.round(px+(p.ab.x-G.minX)*bw),Math.round(py+(p.ab.y-G.minY)*bw)];
 const c=at(PROJ.pages[PROJ.cur]);cv.style.left=c[0]+'px';cv.style.top=c[1]+'px';
 const h=hold(),n=PROJ.pages.length,s2=PROJ.cur+':'+n+':'+ver;
 if(s2!==sig||h.childElementCount!=2*n){sig=s2;
  h.innerHTML=PROJ.pages.map((p,i)=>(i==PROJ.cur?'':`<div class="abo" data-i="${i}" role="button" tabindex="-1" aria-label="Artboard ${i+1}: düzenlemek için tıkla"><img alt="" draggable="false" src="${(p.s&&PV.get(p.s)||{}).url||p._pv||p.thumb||'data:,'}"></div>`)
   +`<div class="abt${i==PROJ.cur?' on':''}" data-i="${i}"><span class="abn" title="Sürükle: taşı · Alt+sürükle: kopyala · tıkla: düzenle"><span class="abw">Artboard </span>${i+1}</span><button type="button" data-aa="dup" title="Sağa kopyala" aria-label="Artboard ${i+1} kopyala">⧉</button><button type="button" data-aa="more" title="Diğer işlemler" aria-label="Artboard ${i+1} işlemleri">⋯</button></div>`).join('')
   +`<button type="button" class="abadd" data-aa="add" title="Artboard ekle" aria-label="Artboard ekle"><b>＋</b><small>Artboard</small></button>`}
 h.querySelectorAll('.abo').forEach(o=>{const p=PROJ.pages[+o.dataset.i];if(!p)return;const q=at(p);o.style.cssText=`left:${q[0]}px;top:${q[1]}px;width:${Math.round(bw)}px;height:${Math.round(bh)}px;background:${(p.s&&p.s.bg)||'#fff'}`});
 h.querySelectorAll('.abt').forEach(o=>{const p=PROJ.pages[+o.dataset.i];if(!p)return;const q=at(p);o.style.cssText=`left:${q[0]}px;top:${q[1]-30}px;width:${Math.round(bw)}px`;o.classList.toggle('sm',bw<96);o.classList.toggle('xs',bw<170)});document.body.classList.toggle('abtiny',bw<220&&PROJ.pages.length>0);
 const last=reading(PROJ.pages).pop(),lq=at(last),ad=h.querySelector('.abadd');
 if(ad)ad.style.cssText=`left:${Math.round(lq[0]+bw*(1+GAP))}px;top:${lq[1]}px;width:${Math.round(Math.max(72,Math.min(bw*.42,170)))}px;height:${Math.round(bh)}px`;
 queue()}
function abCenter(){const w=W(),cv=CV();if(!w||!cv)return;const wr=w.getBoundingClientRect(),cr=cv.getBoundingClientRect();
 w.scrollLeft+=cr.left+cr.width/2-(wr.left+wr.width/2);w.scrollTop+=cr.top+cr.height/2-(wr.top+wr.height/2);ui.stMini()}
function abEnter(){if(!on())return;if(PEND){PROJ.pages.forEach((p,k)=>{if(PEND[k])p.ab=PEND[k]});PEND=null}
 const newProj=lastProj!==PROJ;if(newProj){SDK.zm=1;L={bw:0}}
 ensure();reorder();sig='';ui.stSize();
 const w=W(),wr=w.getBoundingClientRect(),cr=CV().getBoundingClientRect();
 if(newProj||cr.left<wr.left||cr.right>wr.right||cr.top<wr.top||cr.bottom>wr.bottom)abCenter();ui.stMini()}
function fitAll(){if(!on())return;ensure();const G=geo(),w=W(),f=ui.stFit();if(!f)return;
 const z=Math.max(.1,Math.min(1,(w.clientWidth-80)/((G.maxX-G.minX)*f),(w.clientHeight-80)/((G.maxY-G.minY)*f)));ui.stZoom(z);
 w.scrollLeft=L.px+(G.maxX-G.minX)*L.bw/2-w.clientWidth/2;w.scrollTop=L.py+(G.maxY-G.minY)*L.bw/2-w.clientHeight/2;ui.stMini()}
function abMini(m,k){m.querySelectorAll('.mab').forEach(x=>x.remove());if(!on()||!L.bw)return;
 PROJ.pages.forEach((p,i)=>{if(i==PROJ.cur)return;const d=document.createElement('i');d.className='mab';
  d.style.cssText=`left:${(L.px+(p.ab.x-L.minX)*L.bw)*k}px;top:${(L.py+(p.ab.y-L.minY)*L.bw)*k}px;width:${L.bw*k}px;height:${L.bh*k}px`;m.insertBefore(d,m.lastChild)})}
window.abLayout=abLayout;window.abCenter=abCenter;window.abEnter=abEnter;window.abMini=abMini;

/* ---------- işlemler ---------- */
function save1(){PROJ.pages[PROJ.cur].s=pageSnap()}
function after(msg){ver++;reorder();sig='';abLayout();ui.stMini();try{dirty()}catch(x){}if(msg)toast(msg)}
function dupBoard(i,dir){if(!on())return;save1();const o=PROJ.pages[i];if(!o)return;const prev=PROJ.pages.slice();
 const n={s:JSON.parse(JSON.stringify(o.s)),thumb:o.thumb||''};const pv=PV.get(o.s);if(pv)PV.set(n.s,pv);else if(i==PROJ.cur)n._pv='';else n._pv=o._pv;
 n.ab=null;PROJ.pages.splice(i+1,0,n);if(PROJ.cur>i)PROJ.cur++;remap(prev,PROJ.pages);
 n.ab=freeSpot(dir=='d'?{x:o.ab.x,y:o.ab.y+hU()+GAPY}:{x:o.ab.x+1+GAP,y:o.ab.y},n);return n}
function addBoard(kind,from){if(!on())return;const last=from!=null?PROJ.pages[from]:reading(PROJ.pages).pop(),spot=freeSpot({x:last.ab.x+1+GAP,y:last.ab.y},null);
 if(kind=='dup'){const n=dupBoard(PROJ.cur,'r');n.ab=freeSpot(spot,n);after('Artboard kopyalandı');return}
 const li=PROJ.pages.indexOf(last);if(li!=PROJ.cur)goPage(li);addPage(kind);const p=PROJ.pages[PROJ.cur];p.ab=freeSpot(spot,p);after()}
function delBoard(i){if(!on())return;if(PROJ.pages.length<2)return toast('Son artboard silinemez');
 if(!confirm(`Artboard ${i+1} silinsin mi? Bu işlem geri alınamaz.`))return;save1();const prev=PROJ.pages.slice(),gone=prev[i],next=prev.filter(p=>p!==gone);
 (PROJ.comments||[]).forEach(c=>{if(c.pg==i)c.pg=-1});remap(prev,next);delPage(i)}
let PEND=null;
{const mv=window.movePage;if(typeof mv=='function')window.movePage=movePage=function(){if(on())PEND=PROJ.pages.map(p=>p.ab&&{...p.ab});return mv.apply(this,arguments)}}

/* ---------- sürükleme: etiketten taşı, Alt ile kopyala; önizlemeyi tıkla: düzenle ---------- */
let D=null;
function snap(p,self){const t=8/L.bw,xs=[],ys=[];PROJ.pages.forEach(o=>{if(o===self)return;xs.push(o.ab.x,o.ab.x+1+GAP,o.ab.x-1-GAP);ys.push(o.ab.y,o.ab.y+hU()+GAPY,o.ab.y-hU()-GAPY)});
 const near=(v,L2)=>{let b=v,d=t;L2.forEach(c=>{if(Math.abs(c-v)<d){d=Math.abs(c-v);b=c}});return b};return{x:r3(near(p.x,xs)),y:r3(near(p.y,ys))}}
CVP().addEventListener('pointerdown',ev=>{if(!on()||ev.button||SDK.space)return;const t=ev.target;if(t.closest('button'))return;
 const lb=t.closest('#abh .abt'),bo=t.closest('#abh .abo');if(!lb&&!(bo&&ev.pointerType!='touch'&&SDK.tool=='v'))return;
 const i=+(lb||bo).dataset.i;D={i,p:PROJ.pages[i],x:ev.clientX,y:ev.clientY,a0:{...PROJ.pages[i].ab},id:ev.pointerId,go:0,el:lb||bo,label:!!lb};
 if(lb){ev.preventDefault();try{lb.setPointerCapture(ev.pointerId)}catch(x){}}});
window.addEventListener('pointermove',ev=>{if(!D||ev.pointerId!=D.id)return;const dx=ev.clientX-D.x,dy=ev.clientY-D.y;
 if(!D.go){if(Math.abs(dx)+Math.abs(dy)<5)return;D.go=1;document.body.classList.add('abdrag');
  if(ev.altKey){const n=dupBoard(D.i,'r');n.ab={...D.a0};D.p=n;D.copy=1;ver++;sig=''}
  if(!D.label){try{D.el.setPointerCapture(ev.pointerId)}catch(x){}}}
 ev.preventDefault();document.body.classList.toggle('abcopy',!!D.copy);
 D.p.ab=snap({x:D.a0.x+dx/L.bw,y:D.a0.y+dy/L.bw},D.p);abLayout()});
const end=ev=>{if(!D||ev.pointerId!=D.id)return;const d=D;D=null;document.body.classList.remove('abdrag','abcopy');
 if(!d.go){if(d.label&&ev.type=='pointerup'){const i=PROJ.pages.indexOf(d.p);if(i!=PROJ.cur)goPage(i)}return}
 d.moved=1;d.p.ab=freeSpot(d.p.ab,d.p);after(d.copy?'Artboard kopyalandı':'');D0=Date.now()};
window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
let D0=0;
CVP().addEventListener('click',ev=>{if(!on())return;const t=ev.target;
 const a=t.closest('#abh [data-aa]');if(a){ev.stopPropagation();const lb=a.closest('.abt'),i=lb?+lb.dataset.i:-1;
  if(a.dataset.aa=='dup'){dupBoard(i,'r');after('Artboard kopyalandı')}else if(a.dataset.aa=='more')menu(a,i);else if(a.dataset.aa=='add')menu(a,-1);return}
 const bo=t.closest('#abh .abo');if(!bo||Date.now()-D0<350||SDK.tool=='z'||SDK.space)return;goPage(+bo.dataset.i)});
CVP().addEventListener('contextmenu',ev=>{const x=ev.target.closest('#abh .abt,#abh .abo');if(!x||!on())return;ev.preventDefault();menu(x,+x.dataset.i)});

/* ---------- artboard menüsü (araç menüsüyle aynı görünüm) ---------- */
let fly=null;const close=()=>{if(fly){fly.remove();fly=null}};
function menu(anchor,i){close();fly=document.createElement('div');fly.className='rfly abfly';fly.setAttribute('role','menu');
 const it=(k,t,s)=>`<button type="button" role="menuitem" data-m="${k}"><span>${t}</span>${s?`<kbd>${s}</kbd>`:''}</button>`;
 fly.innerHTML=i<0?`<div class="rfh">Artboard ekle</div>`+it('blank','Boş artboard')+it('auto','Hazır düzenli artboard')+it('dupc','Etkin artboard\'un kopyası')
  :`<div class="rfh">Artboard ${i+1}</div>`+(i!=PROJ.cur?it('edit','Düzenle'):'')+it('r','Sağa kopyala','Ctrl+Shift+D')+it('d','Aşağı kopyala')+it('fit','Tümünü göster','Shift+0')+it('del','Sil');
 document.body.appendChild(fly);const r=anchor.getBoundingClientRect(),Wd=fly.offsetWidth,H=fly.offsetHeight;
 fly.style.left=Math.max(8,Math.min(r.left,innerWidth-Wd-8))+'px';fly.style.top=(r.bottom+6+H<innerHeight?r.bottom+6:Math.max(8,r.top-H-6))+'px';
 fly.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const m=b.dataset.m;close();
  if(m=='blank'||m=='auto')addBoard(m);else if(m=='dupc')addBoard('dup');else if(m=='edit')goPage(i);else if(m=='r'||m=='d'){dupBoard(i,m);after('Artboard kopyalandı')}else if(m=='fit')fitAll();else if(m=='del')delBoard(i)});
 const f=fly.querySelector('button');if(f)f.focus({preventScroll:true})}
document.addEventListener('pointerdown',e=>{if(fly&&!e.target.closest('.abfly'))close()},true);
document.addEventListener('keydown',e=>{if(fly&&e.key=='Escape'){e.preventDefault();e.stopImmediatePropagation();close()}},true);
addEventListener('resize',close);

/* ---------- komutlar ---------- */
if(window.v4cmd){
 v4cmd(['Görünüm','Tüm artboardları göster',['Shift+0'],fitAll]);
 v4cmd(['Artboard','Artboard\'u sağa kopyala',['Ctrl+Shift+D'],()=>{dupBoard(PROJ.cur,'r');after('Artboard kopyalandı')}]);
 v4cmd(['Artboard','Artboard\'u aşağı kopyala',[],()=>{dupBoard(PROJ.cur,'d');after('Artboard kopyalandı')}]);
 v4cmd(['Artboard','Boş artboard ekle',[],()=>addBoard('blank')]);
 v4cmd(['Artboard','Artboard\'u sil',[],()=>delBoard(PROJ.cur)]);
}

/* ---------- kayıt: konumlar projeyle birlikte saklanır ---------- */
{const pk=window.pack;if(typeof pk=='function')window.pack=pack=function(){const r=pk.apply(this,arguments);try{r.pages.forEach((q,i)=>{const p=PROJ.pages[i];if(p&&ok(p.ab))q.ab={x:r3(p.ab.x),y:r3(p.ab.y)}})}catch(x){}return r}}

/* ---------- dışa aktarma: tüm artboardlar sırayla ---------- */
async function pngAll(){const bt=$$('png');if(bt){bt.disabled=true;bt.classList.add('busy')}
 const N=PROJ.pages.length,slug=(window.v4slug?v4slug(PROJ.name).toLowerCase():(PROJ.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))||'vybble';let Lp=+$$('px').value,done=0;
 try{while(!done&&Lp>=1000){const files=[];try{const Wd=Math.round(S.fmt>=1?Lp:Lp*S.fmt);
   await eachPage(async i=>{toast(`Artboard ${i+1}/${N} hazırlanıyor…`);await loadF();const c=drawB(Wd,S.bleed,S.marks),b=await new Promise(r=>c.toBlob(r));c.width=c.height=1;if(!b)throw new Error('png');
    files.push({name:`${slug}-${String(i+1).padStart(2,'0')}.png`,data:new Uint8Array(await b.arrayBuffer())})});
   await save(slug+'-artboardlar.zip',window.v4zip(files));done=1;toast(`${N} artboard sırayla kaydedildi ✓ (zip)`)}catch(e){Lp=Math.round(Lp/1.5)}}
  if(!done)toast('İndirilemedi')}finally{if(bt){bt.disabled=false;bt.classList.remove('busy')}}}
{const ex=window.exp;if(typeof ex=='function'&&window.v4zip)window.exp=exp=function(kind){if(kind=='png'&&on()&&PROJ.pages.length>1&&!exp.one)return pngAll();exp.one=0;return ex.apply(this,arguments)}}
{const xm=$$('xmenu');if(xm){const n=document.createElement('p');n.className='mut abxn';n.textContent='Birden çok artboard varsa hepsi soldan sağa, yukarıdan aşağı sırayla kaydedilir: PDF tek dosya, PNG zip.';
 const b=document.createElement('button');b.type='button';b.className='b';b.style.cssText='width:100%;margin-top:6px';b.textContent='Yalnız bu artboard · PNG';b.onclick=()=>{xm.hidden=true;exp.one=1;exp('png')};
 const pr=xm.querySelector('.prow');if(pr)pr.after(n,b);else xm.append(n,b)}}

window.v4ab={fitAll,dupBoard:(i,d)=>{dupBoard(i,d);after()},addBoard,reading:()=>reading(PROJ.pages)};
})();
