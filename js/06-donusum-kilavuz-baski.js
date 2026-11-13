/* ================= STÜDYO 2: serbest dönüşüm, akıllı kılavuzlar, yerinde yazma, cetvel ================= */
(function(){
const cvEl=$('cv'),CVW2=$('cvw');
const RAD=Math.PI/180;
const HM={nw:[-1,-1],n:[0,-1],ne:[1,-1],e:[1,0],se:[1,1],s:[0,1],sw:[-1,1],w:[-1,0]};
const r2=v=>Math.round(v*100)/100;
const pageH=()=>100/S.fmt;
const isTxt=e=>e&&e.txt!==undefined;

/* ---- seçim kutusu: 8 tutamaç + döndürme ---- */
sbox=function(){const e=cur();if(!e||!e.on||(window.SDK&&SDK.tool!='v'))return'';const[X,Y,w,h]=geo(e,100);
 const hs=e.lock?'':Object.keys(HM).map(k=>`<i class="th th-${k}" data-th="${k}"></i>`).join('')+'<i class="th th-rot" data-th="rot"></i>';
 return `<div class="sbox${e.lock?' locked':''}" style="left:${X+e.dx}%;top:${(Y+e.dy)*S.fmt}%;width:${w}%;height:${h*S.fmt}%;transform:rotate(${e.rot}deg)">${hs}</div>`};

/* ---- serbest boyutlandırma / döndürme ---- */
let TF=null;
cvEl.addEventListener('pointerdown',ev=>{const t=ev.target.closest&&ev.target.closest('[data-th]');if(!t)return;const e=cur();if(!e)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const[X,Y,w,h]=geo(e,100);TF={k:t.dataset.th,id:e.id,x0:ev.clientX,y0:ev.clientY,X:X+e.dx,Y:Y+e.dy,w,h,rot:e.rot||0,mv:0};cvEl.setPointerCapture(ev.pointerId)},true);
cvEl.addEventListener('pointermove',ev=>{if(!TF)return;const e=byId(TF.id);if(!e)return;const b=cvEl.getBoundingClientRect(),k=b.width/100;TF.mv=1;
 if(TF.k=='rot'){const cx=TF.X+TF.w/2,cy=TF.Y+TF.h/2,px=(ev.clientX-b.left)/k,py=(ev.clientY-b.top)/k;let a=Math.atan2(py-cy,px-cx)/RAD+90;a=((a+540)%360)-180;if(ev.shiftKey)a=Math.round(a/15)*15;e.rot=Math.round(a);render();return}
 const dx=(ev.clientX-TF.x0)/k,dy=(ev.clientY-TF.y0)/k,th=TF.rot*RAD,c=Math.cos(th),s=Math.sin(th),lx=dx*c+dy*s,ly=-dx*s+dy*c,[hx,hy]=HM[TF.k];
 let nw=TF.w,nh=TF.h;const ctr=ev.altKey;
 if(hx)nw=TF.w+hx*lx*(ctr?2:1);if(hy)nh=TF.h+hy*ly*(ctr?2:1);
 if(ev.shiftKey&&hx&&hy){const sc=Math.max(nw/TF.w,nh/TF.h);nw=TF.w*sc;nh=TF.h*sc}
 nw=Math.max(1.5,nw);nh=Math.max(.6,nh);
 let sx=ctr?0:hx*(nw-TF.w)/2,sy=ctr?0:hy*(nh-TF.h)/2;const wx=sx*c-sy*s,wy=sx*s+sy*c,cx=TF.X+TF.w/2+wx,cy=TF.Y+TF.h/2+wy;
 e.fr=[r2(cx-nw/2),r2(cy-nh/2),r2(nw),r2(nh)];e.dx=0;e.dy=0;if(e.type=='img'||isTxt(e)||e.type=='r'){}
 render()});
const endTF=()=>{if(!TF)return;const m=TF.mv;TF=null;if(m){if(S.af)fitAll();render();hist();ed()}};
cvEl.addEventListener('pointerup',endTF);cvEl.addEventListener('pointercancel',endTF);

/* ---- serbest konumlu öğeyi taşı + akıllı kılavuzlar ---- */
const GS=()=>Object.assign({eq:1,opt:1,gold:0,grid:0},(CFG&&CFG.gs)||{});
const PHI=.381966;
/* optik kenar payları: yazının sol/sağ yan boşluğu, yuvarlak şeklin taşması (görsel kenar = kutu kenarı ± pay) */
function optAdj(o){if(o.txt!==undefined&&!o.vert&&!(+o.bend)){const k=(o.fw>=700?1:.6)*.045*(+o.fs||0);return[(o.al||'left')=='left'||o.al=='justify'?k:0,o.al=='right'?k:0]}
 if(o.type=='r'&&(o.shape=='circle'||o.shape=='ellipse')){const[,,w]=geo(o,100);return[w*.012,w*.012]}return[0,0]}
function cands(skip){const g=GS(),H=pageH(),X=[0,50,100,S.mar,100-S.mar],Y=[0,H/2,H,S.mar,H-S.mar];
 S.els.forEach(o=>{if(!o.on||skip.has(o.id))return;const[x,y,w,h]=geo(o,100);const ox=x+o.dx,oy=y+o.dy,a=g.opt?optAdj(o):[0,0];X.push(ox+a[0],ox+w/2,ox+w-a[1]);Y.push(oy,oy+h/2,oy+h);if(g.opt&&(a[0]||a[1])){X.push(ox,ox+w)}});
 (PROJ.guides||[]).forEach(q=>(q.o=='v'?X:Y).push(q.p));
 if(g.gold){X.push(100*PHI,100*(1-PHI));Y.push(H*PHI,H*(1-PHI))}
 if(g.grid){const m=S.mar,gu=S.gut,cw=(100-2*m-(S.cols-1)*gu)/S.cols,rh=(H-2*m-(S.rows-1)*gu)/S.rows;for(let i=0;i<S.cols;i++){X.push(m+i*(cw+gu),m+i*(cw+gu)+cw)}for(let i=0;i<S.rows;i++){Y.push(m+i*(rh+gu),m+i*(rh+gu)+rh)}}
 return[X,Y]}
function snapAxis(edges,C,thr){let best=null;edges.forEach(ed=>C.forEach(c=>{const d=c-ed;if(Math.abs(d)<=thr&&(best==null||Math.abs(d)<Math.abs(best.d)))best={d,c}}));return best}
/* eşit boşluk: komşu iki nesnenin arasına ortala ya da aynı aralığı sürdür */
function eqSnap(M,skip,thr,axis){const H=pageH(),ax=axis=='x',m0=ax?M.x:M.y,ms=ax?M.w:M.h,o0=ax?M.y:M.x,os=ax?M.h:M.w,L=[];
 S.els.forEach(o=>{if(!o.on||skip.has(o.id))return;const[x,y,w,h]=geo(o,100),X=x+o.dx,Y=y+o.dy,a=ax?X:Y,as=ax?w:h,b=ax?Y:X,bs=ax?h:w;if(b+bs>o0+.01&&b<o0+os-.01)L.push({a,e:a+as,b,bs})});
 L.sort((p,q)=>p.a-q.a);let best=null;const tryT=(t,segs)=>{const d=t-m0;if(Math.abs(d)<=thr&&(!best||Math.abs(d)<Math.abs(best.d)))best={d,t,segs}};
 for(let i=0;i+1<L.length;i++){const A=L[i],B=L[i+1],gap=B.a-A.e;if(gap<=.2)continue;
  if(gap>=ms+.4){const t=(A.e+B.a-ms)/2,g=(gap-ms)/2;tryT(t,[[A.e,t,g],[t+ms,B.a,g]])}
  tryT(B.e+gap,[[A.e,B.a,gap],[B.e,B.e+gap,gap]]);tryT(A.a-gap-ms,[[A.a-gap,A.a,gap],[A.e,B.a,gap]].map(q=>[q[0],q[1],gap]))}
 return best?{d:best.d,segs:best.segs.map(q=>({a:q[0]+(best.d&&0),b:q[1],g:q[2]}))}:null}
function snapMove(e,ev){if(ev.ctrlKey||ev.metaKey||S.noSnap)return null;const b=cvEl.getBoundingClientRect(),thr=7/(b.width/100),g=GS();
 const ids=new Set(selIds());const[X,Y]=cands(ids);const[gx,gy,w,h]=geo(e,100);const x=gx+e.dx,y=gy+e.dy,a=g.opt?optAdj(e):[0,0];
 const bx=snapAxis([x+a[0],x+w/2,x+w-a[1]],X,thr),by=snapAxis([y,y+h/2,y+h],Y,thr);
 if(bx)e.dx=r2(e.dx+bx.d);if(by)e.dy=r2(e.dy+by.d);
 let ex=null,ey=null;
 if(g.eq){const M={x:gx+e.dx,y:gy+e.dy,w,h};if(!bx){ex=eqSnap(M,ids,thr,'x');if(ex){e.dx=r2(e.dx+ex.d);M.x+=ex.d}}if(!by){ey=eqSnap({x:M.x,y:M.y,w,h},ids,thr,'y');if(ey){e.dy=r2(e.dy+ey.d)}}}
 const r={x:bx&&bx.c,y:by&&by.c};if(ex||ey){const[fx2,fy2]=[gx+e.dx,gy+e.dy];r.eq=[];
  if(ex)ex.segs.forEach(q=>r.eq.push({ax:'x',a:q.a,b:q.b,g:q.g,at:fy2+h/2}));if(ey)ey.segs.forEach(q=>r.eq.push({ax:'y',a:q.a,b:q.b,g:q.g,at:fx2+w/2}))}
 return r}
function showGuides(g){cvEl.querySelectorAll('.sg').forEach(n=>n.remove());if(!g)return;
 if(g.x!=null)cvEl.insertAdjacentHTML('beforeend',`<i class="sg v" style="left:${g.x}cqw"></i>`);
 if(g.y!=null)cvEl.insertAdjacentHTML('beforeend',`<i class="sg h" style="top:${g.y}cqw"></i>`);
 (g.eq||[]).forEach(q=>{const mm=(q.g*S.mm[0]/100).toFixed(1).replace('.',',')+' mm';
  if(q.ax=='x')cvEl.insertAdjacentHTML('beforeend',`<i class="sg eq" style="left:${q.a}cqw;top:${q.at}cqw;width:${Math.max(0,q.b-q.a)}cqw;height:0"><b>${mm}</b></i>`);
  else cvEl.insertAdjacentHTML('beforeend',`<i class="sg eq y" style="left:${q.at}cqw;top:${q.a}cqw;height:${Math.max(0,q.b-q.a)}cqw;width:0"><b>${mm}</b></i>`)})}
/* fr öğesini kendimiz taşırız (ızgara taşıması fr'yi etkilemez) */
let MV=null;
cvEl.addEventListener('pointerdown',ev=>{if(ev.button||ev.shiftKey||ev.ctrlKey||ev.metaKey||(window.SDK&&SDK.tool!='v'))return;const n=ev.target.closest&&ev.target.closest('.e');if(!n)return;
 const id=+n.dataset.id,e=byId(id);if(!e||!e.fr||e.lock||e.gid||selIds().length>1)return;
 if(S.sel!=id)pick(id);ev.preventDefault();ev.stopImmediatePropagation();MV={id,x:ev.clientX,y:ev.clientY,d:[e.dx,e.dy],mv:0};cvEl.setPointerCapture(ev.pointerId)},true);
cvEl.addEventListener('pointermove',ev=>{
 if(MV){const e=byId(MV.id);if(!e)return;const b=cvEl.getBoundingClientRect(),k=b.width/100,dx=ev.clientX-MV.x,dy=ev.clientY-MV.y;if(Math.abs(dx)+Math.abs(dy)>3)MV.mv=1;if(!MV.mv)return;
  e.dx=r2(MV.d[0]+dx/k);e.dy=r2(MV.d[1]+dy/k);const g=snapMove(e,ev);render();showGuides(g);return}
 /* ızgarasız (serbest) taşıma: eski sürükleyici dx/dy'yi yazdıktan sonra yapıştır */
 if(typeof DR!=='undefined'&&DR&&DR.k=='mv'&&moved&&(S.free||ev.altKey)){const e=cur();if(e&&!e.fr&&selIds().length<=1&&!e.gid){const g=snapMove(e,ev);render();showGuides(g)}}});
const endMV=()=>{if(MV){const m=MV.mv;MV=null;showGuides(null);if(m){hist();ed()}}else showGuides(null)};
cvEl.addEventListener('pointerup',endMV);cvEl.addEventListener('pointercancel',endMV);

/* ---- ok tuşları: serbest öğelerde dx/dy ile it ---- */
window.addEventListener('keydown',ev=>{if(!/^Arrow/.test(ev.key)||ev.ctrlKey||ev.metaKey||ev.altKey)return;if(/INPUT|TEXTAREA|SELECT/.test((ev.target.tagName)||''))return;
 const L=selEls();if(!L.length||!L.some(o=>o.fr))return;ev.preventDefault();ev.stopImmediatePropagation();const st=ev.shiftKey?5:.5;
 L.forEach(o=>{o.dx=r2(o.dx+(ev.key=='ArrowLeft'?-st:ev.key=='ArrowRight'?st:0));o.dy=r2(o.dy+(ev.key=='ArrowUp'?-st:ev.key=='ArrowDown'?st:0))});render();clearTimeout(window.__nt);window.__nt=setTimeout(()=>hist(),300)},true);

/* ---- fr'yi ızgaraya oturt ---- */
window.v4snap=function(){selEls().forEach(e=>{if(!e.fr)return;const[x,y,w,h]=geo(e,100),b=cvEl.getBoundingClientRect(),m=S.mar,g=S.gut,cw=(100-2*m-(S.cols-1)*g)/S.cols,rh=(pageH()-2*m-(S.rows-1)*g)/S.rows,cx=x+e.dx,cy=y+e.dy;
 const c=cl(Math.round((cx-m)/(cw+g))+1,1,S.cols),r=cl(Math.round((cy-m)/(rh+g))+1,1,S.rows),cs=cl(Math.round((w+g)/(cw+g)),1,S.cols-c+1),rs=cl(Math.round((h+g)/(rh+g)),1,S.rows-r+1);
 e.pos=[c,r,cs,rs];delete e.fr;e.dx=0;e.dy=0});render();hist();ed();toast('Izgaraya oturtuldu')};
/* şablon uygulanınca serbest konumlar sıfırlanır (düzen yeniden kurulur) */
const _apply=apply;apply=function(){S.els.forEach(e=>{if(!e.pin&&!e.cid&&!e.ch)delete e.fr});return _apply.apply(this,arguments)};
const _place=place;place=function(){S.els.forEach(e=>{if(!e.pin&&!e.cid&&!e.ch)delete e.fr});return _place.apply(this,arguments)};

/* ---- yerinde metin düzenleme ---- */
let INL=null;
function inlDone(save){if(!INL)return;const{ta,e,old}=INL;INL=null;const v=ta.value;ta.remove();if(save!==false&&v!==old){e.txt=v;if(S.af)fitAll();render();list();ed();hist()}else render()}
window.v4edit=function(id){const e=id?byId(id):cur();if(!e||!isTxt(e)||e.lock)return;inlDone();if(e.id!=S.sel)pick(e.id);
 const n=cvEl.querySelector('.e[data-id="'+e.id+'"]');if(!n)return;const cvp=CVW2.querySelector('.cvp'),cs=getComputedStyle(n),r=n.getBoundingClientRect(),pr=cvp.getBoundingClientRect();
 const ow=n.offsetWidth,oh=n.offsetHeight,cx=r.left+r.width/2-pr.left,cy=r.top+r.height/2-pr.top,ta=document.createElement('textarea');ta.id='inl';ta.value=e.txt;ta.spellcheck=true;ta.lang='tr';
 ta.style.cssText=`position:absolute;left:${cx-ow/2}px;top:${cy-oh/2}px;width:${ow}px;height:${oh}px;transform:rotate(${e.rot||0}deg);font-style:${cs.fontStyle};font-weight:${cs.fontWeight};font-size:${cs.fontSize};line-height:${cs.lineHeight};font-family:${cs.fontFamily};letter-spacing:${cs.letterSpacing};word-spacing:${cs.wordSpacing};text-transform:${cs.textTransform};text-align:${cs.textAlign};color:${cs.color};background:${getComputedStyle(cvEl).backgroundColor};padding:0;margin:0;border:0;outline:2px solid var(--pr);resize:none;overflow:auto;z-index:40;box-sizing:border-box;white-space:pre-wrap`;
 cvp.appendChild(ta);n.style.visibility='hidden';INL={ta,e,old:e.txt};ta.focus();ta.select();
 ta.addEventListener('keydown',k=>{if(k.key=='Escape'){k.stopPropagation();k.preventDefault();inlDone(true)}else if(k.key=='Enter'&&(k.ctrlKey||k.metaKey)){k.preventDefault();inlDone(true)}});
 ta.addEventListener('blur',()=>setTimeout(()=>inlDone(true),0))};
cvEl.addEventListener('dblclick',ev=>{const n=ev.target.closest&&ev.target.closest('.e.tx');if(n&&(!window.SDK||SDK.tool=='v')){ev.preventDefault();v4edit(+n.dataset.id)}});
let lt={t:0,id:0};
cvEl.addEventListener('pointerdown',ev=>{if(ev.button||ev.shiftKey||(window.SDK&&SDK.tool!='v'))return;const n=ev.target.closest&&ev.target.closest('.e.tx');if(!n)return;const now=Date.now(),id=+n.dataset.id;if(lt.id==id&&now-lt.t<350){lt.t=0;setTimeout(()=>v4edit(id),30)}else lt={t:now,id}});
if(window.ResizeObserver)new ResizeObserver(()=>{if(INL)inlDone(true)}).observe(cvEl);

/* ---- cetvel ve elle kılavuz ---- */
const cvh=document.querySelector('.cvh'),cvp0=CVW2.querySelector('.cvp');
const rh=document.createElement('canvas'),rv=document.createElement('canvas'),rc=document.createElement('div');rh.id='rlh';rv.id='rlv';rc.id='rlc';cvh.append(rh,rv,rc);
const gl=document.createElement('div');gl.id='gl';cvp0.appendChild(gl);
function rulersOn(){return document.body.classList.contains('rulers')}
let rRaf=0;function rulers(){cancelAnimationFrame(rRaf);rRaf=requestAnimationFrame(rdraw)}
function rdraw(){glDraw();if(!rulersOn())return;const w=CVW2,wr=w.getBoundingClientRect(),cr=cvEl.getBoundingClientRect(),dpr=window.devicePixelRatio||1,T=20,
 st=getComputedStyle(document.documentElement),fg=st.getPropertyValue('--mu')||'#888',ln=st.getPropertyValue('--ln')||'#ccc';
 const ppm=cr.width/S.mm[0];const steps=[1,5,10,20,50,100,200,500];let maj=steps.find(s=>s*ppm>=54)||500,mnr=maj/(maj==1?5:maj==5?5:maj==10?5:maj==20?4:maj==50?5:5);
 const draw=(cv,len,off,vert)=>{cv.width=Math.round((vert?T:len)*dpr);cv.height=Math.round((vert?len:T)*dpr);cv.style.width=(vert?T:len)+'px';cv.style.height=(vert?len:T)+'px';const x=cv.getContext('2d');x.scale(dpr,dpr);x.fillStyle=getComputedStyle(document.body).getPropertyValue('--pn')||'#fff';x.fillRect(0,0,cv.width,cv.height);x.strokeStyle=fg;x.fillStyle=fg;x.lineWidth=1;x.font='9px system-ui';
  const mm0=Math.floor((-off/ppm)/mnr)*mnr,mm1=(len-off)/ppm;
  for(let m=mm0;m<=mm1;m+=mnr){const p=Math.round(off+m*ppm)+.5,isMaj=Math.abs(m/maj-Math.round(m/maj))<1e-6,l=isMaj?T:T*.35;x.beginPath();if(vert){x.moveTo(T-l,p);x.lineTo(T,p)}else{x.moveTo(p,T-l);x.lineTo(p,T)}x.stroke();
   if(isMaj){const t=String(Math.round(m*10)/10);if(vert){x.save();x.translate(2,p+3);x.rotate(-Math.PI/2);x.textAlign='right';x.fillText(t,0,8);x.restore()}else x.fillText(t,p+3,9)}}
  x.strokeStyle=ln;x.beginPath();if(vert){x.moveTo(T-.5,0);x.lineTo(T-.5,len)}else{x.moveTo(0,T-.5);x.lineTo(len,T-.5)}x.stroke()};
 draw(rh,w.clientWidth,cr.left-wr.left,false);draw(rv,w.clientHeight,cr.top-wr.top,true)}
function glDraw(){if(typeof PROJ==='undefined'||!PROJ){gl.innerHTML='';return}const k=cvEl.offsetWidth/100,ox=cvEl.offsetLeft,oy=cvEl.offsetTop;const G=PROJ.guides||[];if(document.body.classList.contains('noguides')){gl.innerHTML='';return}
 gl.innerHTML=G.map((g,i)=>g.o=='v'?`<i class="gd v" data-gi="${i}" style="left:${ox+g.p*k}px"></i>`:`<i class="gd h" data-gi="${i}" style="top:${oy+g.p*k}px"></i>`).join('')}
CVW2.addEventListener('scroll',rulers,{passive:true});
if(window.ResizeObserver){new ResizeObserver(rulers).observe(cvEl);new ResizeObserver(rulers).observe(CVW2)}
const _enter2=enter;enter=function(){const r=_enter2.apply(this,arguments);rulers();return r};
let GD=null;
function gpos(ev,o){const b=cvEl.getBoundingClientRect(),k=b.width/100;return o=='v'?r2((ev.clientX-b.left)/k):r2((ev.clientY-b.top)/k)}
function gStart(ev,o,idx){PROJ.guides=PROJ.guides||[];let i=idx;if(i==null){PROJ.guides.push({o,p:gpos(ev,o)});i=PROJ.guides.length-1}GD={o,i,ev0:ev};document.body.classList.add('gdrag');(ev.target.setPointerCapture&&ev.target.setPointerCapture(ev.pointerId))}
rh.addEventListener('pointerdown',ev=>{ev.preventDefault();gStart(ev,'h');rh.setPointerCapture(ev.pointerId)});
rv.addEventListener('pointerdown',ev=>{ev.preventDefault();gStart(ev,'v');rv.setPointerCapture(ev.pointerId)});
let lg={i:-1,t:0};gl.addEventListener('pointerdown',ev=>{const t=ev.target.closest('.gd');if(!t)return;ev.preventDefault();ev.stopPropagation();const gi=+t.dataset.gi,now=Date.now();if(lg.i==gi&&now-lg.t<400){PROJ.guides.splice(gi,1);lg={i:-1,t:0};glDraw();dirty();return}lg={i:gi,t:now};gStart(ev,t.classList.contains('v')?'v':'h',+t.dataset.gi);t.setPointerCapture(ev.pointerId)});
gl.addEventListener('dblclick',ev=>{const t=ev.target.closest('.gd');if(!t)return;PROJ.guides.splice(+t.dataset.gi,1);glDraw();dirty()});
window.addEventListener('pointermove',ev=>{if(!GD)return;const g=PROJ.guides[GD.i];if(!g)return;g.p=gpos(ev,GD.o);glDraw()},true);
const gEnd=ev=>{if(!GD)return;const g=PROJ.guides[GD.i],wr=CVW2.getBoundingClientRect();document.body.classList.remove('gdrag');
 const out=GD.o=='v'?ev.clientX<wr.left+2||ev.clientX>wr.right:ev.clientY<wr.top+2||ev.clientY>wr.bottom;
 if(g&&out)PROJ.guides.splice(GD.i,1);GD=null;glDraw();dirty()};
window.addEventListener('pointerup',gEnd,true);window.addEventListener('pointercancel',gEnd,true);
function togRulers(){const on=document.body.classList.toggle('rulers');try{localStorage.setItem('ed_rul',on?1:0)}catch(e){}setTimeout(()=>{window.stZoom&&0;rulers()},60);toast(on?'Cetveller açık · cetvelden sürükleyerek kılavuz çek':'Cetveller kapalı')}
function togGuides(){const on=document.body.classList.toggle('noguides');glDraw();toast(on?'Kılavuzlar gizli':'Kılavuzlar görünür')}
try{if(localStorage.getItem('ed_rul')==1)document.body.classList.add('rulers')}catch(e){}
v4cmd(['Görünüm','Cetvelleri aç/kapat',['Ctrl+R'],togRulers]);
v4cmd(['Görünüm','Kılavuzları gizle/göster',['Ctrl+;'],togGuides]);
v4cmd(['Görünüm','Tüm kılavuzları temizle',[],()=>{PROJ.guides=[];glDraw();dirty();toast('Kılavuzlar temizlendi')}]);
v4cmd(['Görünüm','Akıllı yapışmayı aç/kapat',[],()=>{S.noSnap=!S.noSnap;toast(S.noSnap?'Yapışma kapalı':'Yapışma açık')}]);
v4cmd(['Düzen','Serbest dönüşüm tutamaçları',['Shift+sürükle'],()=>{}]);
window.v4rul=togRulers;window.v4rdraw=rulers;
setTimeout(rulers,200);
})();

/* ================= STÜDYO 3: baskı kontrolü, sayfa genel bakışı, palet çıkarma ================= */
(function(){
const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ov(id,html){let p=$(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p||e.target.closest('[data-x]'))p.hidden=true})}p.innerHTML=html;p.hidden=false;return p}

/* ---------- baskı kontrolü ---------- */
function txtOver(e){if(!(e.txt||'').trim())return false;if(window.v4flat&&v4flat(e))return v4over(e);const K=10,g=geo(e,100),w=g[2]*K,h=g[3]*K,fs=e.fs*K,n=e.cc||1;SC.font=fnt(e,fs);SC.fs=fs;SC.u=K;SC.textBaseline='top';
 if('letterSpacing'in SC)SC.letterSpacing=(e.ls||0)*fs+'px';if('wordSpacing'in SC)SC.wordSpacing=(e.ws||0)*fs+'px';
 const ww=e.vert?h:w,hh=e.vert?w:h,L=wrap(SC,e,ww,n),per=Math.ceil(L.length/n);return per*e.lh*fs>hh*1.04+3}
async function precheck(){
 toast('Baskı kontrolü yapılıyor…');await loadF();const I=[];let imgs=0,txts=0;const mmW=S.mm[0],mmH=S.mm[1];
 const EM={};await eachPage(async i=>{const H=100/S.fmt,tm=3/mmW*100;
  S.els.forEach(e=>{if(!e.on)return;const nm=e.nm||(TY[e.type]?TY[e.type][1]:'Öğe'),[x0,y0,w,h]=geo(e,100),x=x0+(e.dx||0),y=y0+(e.dy||0),add=(sev,msg)=>I.push({pg:i,id:e.id,sev,msg:`${nm}: ${msg}`});
   if(e.type=='img'){imgs++;if(!e.src){EM[i]=(EM[i]||0)+1;}else if(e.im&&e.im.naturalWidth){const iw=e.im.naturalWidth,ih=e.im.naturalHeight,wm=w/100*mmW,hm=h/100*mmW;
     const q=e.fit=='fill'?Math.max(wm/iw,hm/ih):(e.fit=='cover'?Math.max:Math.min)(wm/iw,hm/ih),dpi=Math.round(25.4/q);
     if(dpi<100)add('e',`çözünürlük çok düşük (${dpi} dpi). Baskıda bulanık çıkar.`);else if(dpi<150)add('w',`çözünürlük düşük (${dpi} dpi). Baskı için 200+ dpi önerilir.`)}}
   if(e.txt!==undefined){txts++;if(!e.tg&&!(e.txt||'').trim())add('w','boş metin kutusu');else{if(e.ov)add('e','zincirin son kutusunda metin taşıyor, yeni bir devam kutusu ekle');else if(!e.tg&&txtOver(e))add(e.type=='m'?'w':'e','metin kutuya sığmıyor, taşıyor olabilir');
     const pt=e.fs/100*mmW*72/25.4;if(pt<6)add('w',`yazı çok küçük (${pt.toFixed(1)} pt)`);
     if(x<tm||y<tm||x+w>100-tm||y+h>H-tm)add('w','kesim kenarına 3 mm\'den yakın (güvenli alan dışı)')}}
   if(x<-.5||y<-.5||x+w>100.5||y+h>H+.5)I.push({pg:i,id:e.id,sev:S.bleed?'i':'w',msg:`${nm}: sayfa dışına taşıyor${S.bleed?' (taşma payı açık, kasıtlıysa sorun değil)':''}`})})});
 Object.keys(EM).forEach(k=>I.push({pg:+k,id:-1,sev:'w',msg:`${EM[k]} boş görsel kutusu var (görsel yüklenmedi)`}));I.sort((a,b)=>a.pg-b.pg);
 const nE=I.filter(x=>x.sev=='e').length,nW=I.filter(x=>x.sev=='w').length;
 const pl=PROJ.pages.length;
 const notes=[`${pl} sayfa · ${imgs} görsel · ${txts} metin kutusu denetlendi`,`Taşma payı: ${S.bleed?S.bleed+' mm':'yok (matbaa genelde 3 mm ister)'} · Kesim işaretleri: ${S.marks?'açık':'kapalı'}`,'PDF RGB renkte üretilir. Matbaa CMYK istiyorsa PDF\'i matbaanın profiline dönüştürmesini iste ya da bir PDF aracında çevir.'];
 const rows=I.length?I.map(x=>`<div class="pci ${x.sev}"><i></i><span class="pcp">Sayfa ${x.pg+1}</span><span class="pcm">${E(x.msg)}</span><button class="cbb wide" data-go="${x.pg}:${x.id}">Git</button></div>`).join(''):'<div class="pcok">✓ Sorun bulunamadı</div>';
 const p=ov('pchk',`<div class="kbox kwide"><div class="kh"><b>Baskı kontrolü</b><small>${nE?nE+' hata · ':''}${nW?nW+' uyarı':(nE?'':'temiz')}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="pcl">${rows}</div><div class="pcn">${notes.map(n=>'<p>'+E(n)+'</p>').join('')}</div></div>`);
 p.onclick=ev=>{const g=ev.target.closest('[data-go]');if(!g)return;const[pg,id]=g.dataset.go.split(':').map(Number);p.hidden=true;goPage(pg);setTimeout(()=>{if(byId(id))pick(id)},60)};
 return I}

/* ---------- sayfa genel bakışı ---------- */
function overview(){if(!PROJ)return;PROJ.pages[PROJ.cur].s=pageSnap();try{thumbNow()}catch(e){}
 const n=PROJ.pages.length;
 const cards=PROJ.pages.map((p,i)=>`<div class="ovc${i==PROJ.cur?' on':''}" draggable="true" data-i="${i}"><div class="ovt" style="aspect-ratio:${S.fmt}">${p.thumb?`<img src="${p.thumb}" alt="" draggable="false">`:'<span>Önizleme yok</span>'}</div><div class="ovn"><b>${i+1}</b><span class="sp"></span><button data-ov="dup" data-i="${i}" title="Çoğalt">⧉</button><button data-ov="l" data-i="${i}" title="Sola taşı">◀</button><button data-ov="r" data-i="${i}" title="Sağa taşı">▶</button><button data-ov="del" data-i="${i}" title="Sil">🗑</button></div></div>`).join('');
 const p=ov('ovw',`<div class="kbox kwide ovbox"><div class="kh"><b>Tüm sayfalar</b><small>${n} sayfa · tıkla: git · sürükle: sırala</small><button class="cbb wide" data-ov="add">+ Boş sayfa</button><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="ovg">${cards}</div></div>`);
 let from=-1;
 p.ondragstart=e=>{const c=e.target.closest('.ovc');if(!c)return;from=+c.dataset.i;e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',String(from))}catch(x){}};
 p.ondragover=e=>{if(e.target.closest('.ovc'))e.preventDefault()};
 p.ondrop=e=>{const c=e.target.closest('.ovc');if(!c||from<0)return;e.preventDefault();const to=+c.dataset.i;if(to!=from){movePage(from,to-from);overview()}from=-1};
 p.onclick=e=>{const b=e.target.closest('[data-ov]');if(b){const i=+b.dataset.i,k=b.dataset.ov;if(k=='dup'){goPage(i);addPage('dup')}else if(k=='l')movePage(i,-1);else if(k=='r')movePage(i,1);else if(k=='del')delPage(i);else if(k=='add')addPage('blank');overview();return}
  const c=e.target.closest('.ovc');if(c){p.hidden=true;goPage(+c.dataset.i)}}}

/* ---------- görselden palet çıkarma ---------- */
function paletteOf(im,n){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');try{g.drawImage(im,0,0,64,64);const d=g.getImageData(0,0,64,64).data;
 const B=new Map();for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;const k=(d[i]>>4)<<8|(d[i+1]>>4)<<4|(d[i+2]>>4),o=B.get(k)||{n:0,r:0,g:0,b:0};o.n++;o.r+=d[i];o.g+=d[i+1];o.b+=d[i+2];B.set(k,o)}
 const A=[...B.values()].map(o=>{const r=o.r/o.n,gg=o.g/o.n,b=o.b/o.n,mx=Math.max(r,gg,b),mn=Math.min(r,gg,b),s=mx?(mx-mn)/mx:0;return{r,g:gg,b,w:o.n*(1+s*.9)}}).sort((a,b)=>b.w-a.w),out=[];
 for(const a of A){if(out.every(o=>Math.hypot(o.r-a.r,o.g-a.g,o.b-a.b)>58))out.push(a);if(out.length>=n)break}
 const hx=v=>Math.round(v).toString(16).padStart(2,'0');return out.map(o=>'#'+hx(o.r)+hx(o.g)+hx(o.b))}catch(e){return[]}}
window.v4extra=o=>o.type=='img'&&o.src?'<button class="cbb wide" data-cbg="palx" title="Görselin baskın renklerini çıkar">Palet çıkar</button>':'';
window.v4cb=(g,t)=>{if(g!='palx')return false;const o=cur();if(!o||!o.im||!o.im.naturalWidth){toast('Görsel yüklenmedi');return true}
 const P=paletteOf(o.im,6);if(!P.length){toast('Palet çıkarılamadı');return true}
 let pp=$('palx');if(pp)pp.remove();pp=document.createElement('div');pp.id='palx';const r=t.getBoundingClientRect();pp.style.cssText=`left:${Math.min(r.left,innerWidth-290)}px;top:${r.bottom+8}px`;
 const row=(lab,k)=>`<div class="pxr"><span>${lab}</span>${P.map(c=>`<button class="pxs" data-k="${k}" data-c="${c}" title="${c}" style="background:${c}"></button>`).join('')}</div>`;
 pp.innerHTML=row('Arka plan','bg')+row('Tüm yazılar','tx')+row('Şekiller','sh')+'<small>Rengin kodunu görmek için üzerine gel.</small>';document.body.appendChild(pp);
 pp.onclick=ev=>{const b=ev.target.closest('.pxs');if(!b)return;const c=b.dataset.c,k=b.dataset.k;if(k=='bg')S.bg=c;else S.els.forEach(e=>{if(k=='tx'&&e.txt!==undefined)e.col=c;if(k=='sh'&&e.type=='r')e.col=c});render();hist();ed()};
 setTimeout(()=>document.addEventListener('pointerdown',function f(e){if(!e.target.closest('#palx')){pp.remove();document.removeEventListener('pointerdown',f,true)}},true),0);return true};

/* ---------- komutlar ve menü ---------- */
v4cmd(['Dosya','Baskı kontrolü',['Ctrl+Alt+K'],precheck]);
v4cmd(['Sayfa','Sayfa genel bakışı',['Ctrl+Alt+O'],overview]);
const mm=$('mmenu');if(mm){const add=(t,k,f)=>{const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML=`<span>${t}</span><kbd>${k}</kbd>`;w.onclick=()=>{mm.hidden=true;f()};mm.appendChild(w)};
 add('Baskı kontrolü','Ctrl+Alt+K',precheck);add('Tüm sayfalar (genel bakış)','Ctrl+Alt+O',overview);if(window.v4rul)add('Cetveller ve kılavuzlar','Ctrl+R',window.v4rul)}
window.v4pre=precheck;window.v4ov=overview;
})();

window.v4slug=s=>String(s||'').replace(/[çÇ]/g,'c').replace(/[ğĞ]/g,'g').replace(/[ıİ]/g,'i').replace(/[öÖ]/g,'o').replace(/[şŞ]/g,'s').replace(/[üÜ]/g,'u').replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'-');
