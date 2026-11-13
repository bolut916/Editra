/* =====================================================================
   BÖLÜM SAHNELERİ: menüdeki altı bölümün her biri kendi hareketli
   galerisine dönüşür (kartlar yerinde dönüştürülür, içerik aynı kalır):
   Neden Vybble  → Klasör   kapak klasörden dışarı çıkar
   Özellikler    → Ayraç    yaylı yükselen ayraç kartlar, akan şeritler
   Yapay zekâ    → Halka    kendi kendine dönen 3B araç halkası
   Hareket       → Spot     ortadaki anahtar öne çıkar, yanlar geri çekilir
   İnteraktif    → Yay      yay üzerinde dizilen gömme türleri
   Çalışmalarım  → Çember   çalışmaların ve şablonların fırlatılabilen çemberi
   Döngüler yalnız ilgili bölüm ekrandayken çalışır. "Hareketi azalt"
   açıkken hiçbir şey kendiliğinden oynamaz; oklar, noktalar ve
   sürüklemeyle gezilir.
   ===================================================================== */
(function(){
'use strict';
const D=document,R=D.documentElement,$=id=>D.getElementById(id);
const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)')}catch(e){return{matches:false}}})();
const reduced=()=>(RM.matches&&R.dataset.motion!='on')||R.dataset.motion=='reduce';
const FINE=(()=>{try{return matchMedia('(hover: hover) and (pointer: fine)')}catch(e){return{matches:false}}})();
const homeOn=()=>{const h=$('home');return!!h&&!h.hidden};
const safe=(n,f)=>{try{return f()}catch(e){console.warn('sahneler: '+n,e)}};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrap=(d,n)=>{d=((d%n)+n)%n;return d>=n/2?d-n:d};
const norm=a=>((a+180)%360+360)%360-180;
const pal=n=>{try{if(typeof palBy=='function')return palBy(n)}catch(e){}return['','#f4f1ea','#111111','#e63946']};
const font=i=>{try{if(typeof STY!='undefined'&&STY[i])return STY[i].t}catch(e){}return'Inter'};
const cov=(t,s,P,f,cls)=>`<span class="kt-cv${cls?' '+cls:''}" style="--cb:${P[1]};--ct:${P[2]};--ca:${P[3]};--cf:'${f}'" aria-hidden="true"><u></u><b>${esc(t).replace(/\n/g,'<br>')}</b><em>${esc(s)}</em></span>`;
const strip=el=>{el.classList.remove('cv-deal','cv-beam','vt-focus','in');el.removeAttribute('data-rv');el.removeAttribute('data-tilt');el.style.removeProperty('--di')};
const ARL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6 8.5 12l6 6"/></svg>',ARR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6"/></svg>';
const P={};

/* ---------- yatay sürükleme (dikey kaydırma serbest kalır) ---------- */
function drag(el,o){let id=null,x0=0,y0=0,lx=0,lt=0,on=false,moved=false,v=0;
 el.addEventListener('pointerdown',e=>{if(e.button)return;if(e.target.closest&&e.target.closest('input,select,textarea,[contenteditable]'))return;id=e.pointerId;x0=lx=e.clientX;y0=e.clientY;lt=performance.now();on=false;moved=false;v=0});
 el.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;const dx=e.clientX-x0,dy=e.clientY-y0;
  if(!on){if(Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy)){on=moved=true;try{el.setPointerCapture(id)}catch(x){}el.classList.add('kt-drag');o.start&&o.start(e)}else if(Math.abs(dy)>10){id=null;return}else return}
  const t=performance.now(),ddx=e.clientX-lx;v=ddx/Math.max(8,t-lt)*16;lx=e.clientX;lt=t;o.move&&o.move(ddx,dx,e)});
 const end=e=>{if(e.pointerId!==id)return;id=null;if(on){on=false;el.classList.remove('kt-drag');o.end&&o.end(v,e)}};
 el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
 el.addEventListener('click',e=>{if(moved){moved=false;e.stopPropagation();e.preventDefault()}},true);
 return{dragging:()=>on}}

/* ---------- tek ortak döngü: yalnız ekrandaki sahneler ---------- */
const LOOPS=[],VIS=new Map();let raf=0,lt=0;
const loop=t=>{raf=0;const dt=lt?Math.min(64,t-lt):16;lt=t;if(D.hidden||!homeOn()){lt=0;return}let any=false;
 for(const o of LOOPS){if(!VIS.get(o.el))continue;const r=safe('döngü',()=>o.tick(t,dt));if(r)any=true}
 if(any)raf=requestAnimationFrame(loop);else lt=0};
const kick=()=>{if(!raf)raf=requestAnimationFrame(loop)};
const IO='IntersectionObserver' in window?new IntersectionObserver(es=>{es.forEach(en=>VIS.set(en.target,en.isIntersecting));kick()},{rootMargin:'80px 0px'}):null;
const addLoop=(el,tick,lay)=>{LOOPS.push({el,tick,lay});if(IO)IO.observe(el);else VIS.set(el,true);el.addEventListener('pointerdown',kick,{passive:true});el.addEventListener('pointerup',kick,{passive:true})};
const reveal=el=>{if(!IO){el.classList.add('in');return}const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.1});io.observe(el)};
const revealAll=(g,cards)=>{if(!IO)return;const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){cards.forEach((c,i)=>{c.style.setProperty('--di',Math.min(i,5));c.classList.add('in')});io.disconnect()}},{threshold:.05});io.observe(g)};
const LAYS=[];const onLay=(el,f)=>{LAYS.push(f);if('ResizeObserver' in window)new ResizeObserver(()=>safe('yerleşim',f)).observe(el);else addEventListener('resize',()=>safe('yerleşim',f))};

/* ---------- dizi (Yay ve Spot için): oklar, noktalar, sürükleme, klavye ---------- */
function rail(st,cards,o){const N=cards.length;let a=0,prev=new Array(N).fill(null),acc=0;
 const cap=D.createElement('div');cap.className='kt-cap';cap.innerHTML=`<button type="button" class="kt-ar" data-d="-1" aria-label="Önceki">${ARL}</button><div class="kt-txt" aria-live="polite"></div><button type="button" class="kt-ar" data-d="1" aria-label="Sonraki">${ARR}</button>`;
 const dots=D.createElement('div');dots.className='kt-dots';dots.setAttribute('role','tablist');dots.setAttribute('aria-label',o.label||'Kartlar');
 dots.innerHTML=cards.map((c,i)=>`<button type="button" role="tab" data-dot="${i}" aria-label="${i+1}. kart: ${esc(o.name(c))}"></button>`).join('');
 st.append(cap,dots);const txt=cap.querySelector('.kt-txt'),db=[...dots.children];
 const lay=()=>{const W=st.clientWidth;if(!W)return;cards.forEach((cd,i)=>{const d=wrap(i-a,N);
   if(prev[i]!=null&&Math.abs(d-prev[i])>N/2-.5){cd.style.transition='none';requestAnimationFrame(()=>requestAnimationFrame(()=>cd.style.transition=''))}prev[i]=d;
   o.place(cd,d,W);cd.classList.toggle('on',d===0);if(o.focus)o.focus(cd,d===0)});
  db.forEach((b,i)=>{b.setAttribute('aria-selected',i===a?'true':'false');b.classList.toggle('on',i===a)})};
 const capf=()=>{txt.innerHTML=o.cap(cards[a]);if(!reduced()){txt.classList.remove('kt-capin');void txt.offsetWidth;txt.classList.add('kt-capin')}};
 const set=i=>{i=((i%N)+N)%N;if(i===a)return;a=i;lay();capf()};
 cap.addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(b)set(a+ +b.dataset.d)});
 dots.addEventListener('click',e=>{const b=e.target.closest('[data-dot]');if(b)set(+b.dataset.dot)});
 /* yandaki karta dokunmak onu öne getirir (içindeki düğme çalışmaz) */
 st.addEventListener('click',e=>{const cd=e.target.closest&&e.target.closest('.'+o.cls);if(!cd||!cards.includes(cd))return;const i=cards.indexOf(cd);if(i!==a){e.preventDefault();e.stopPropagation();set(i)}else if(o.act)o.act(cd,e)},true);
 st.tabIndex=0;st.addEventListener('keydown',e=>{if(e.target!==st)return;if(e.key=='ArrowLeft'){e.preventDefault();set(a-1)}else if(e.key=='ArrowRight'){e.preventDefault();set(a+1)}});
 drag(st,{start:()=>{acc=0},move:dd=>{acc+=dd;const step=clamp(st.clientWidth*.14,46,90);while(acc>step){acc-=step;set(a-1)}while(acc<-step){acc+=step;set(a+1)}}});
 capf();onLay(st,lay);lay();return{lay,set,get:()=>a}}

/* ===== 1) Neden Vybble → Klasör ===== */
safe('klasör',()=>{const g=D.querySelector('#lp-neden .lp-why');if(!g)return;g.classList.add('kfx');
 const SK=['ind','por','onx','lim'],CV=[['IZGARA','Swiss grid motoru','Mürekkep',1],['BASKI','CMYK PDF','Güneş',3],['YAYIN','Çok sayfalı akış','Lavanta',0],['CİHAZ','Çevrimdışı çalışır','Gece',4]];
 const cards=[...g.children].filter(c=>c.tagName=='ARTICLE');
 cards.forEach((c,i)=>{c.classList.remove('cv-beam');c.classList.add('kf','kf-'+SK[i%4]);c.style.setProperty('--i',i%4);c.tabIndex=0;
  const v=CV[i%4],art=D.createElement('div');art.className='kf-art';art.setAttribute('aria-hidden','true');art.innerHTML=cov(v[0],v[1],pal(v[2]),font(v[3]));
  const body=D.createElement('div');body.className='kf-body';body.innerHTML='<i class="kf-tab" aria-hidden="true"></i><span class="kf-go" aria-hidden="true">↗</span>';
  while(c.firstChild)body.appendChild(c.firstChild);c.append(art,body)});
 g.addEventListener('click',e=>{if(FINE.matches)return;const k=e.target.closest('.kf');if(!k)return;const was=k.classList.contains('on');cards.forEach(x=>x.classList.remove('on'));if(!was)k.classList.add('on')});
 revealAll(g,cards);P.folder=cards});

/* ===== 2) Özellikler → Ayraç ===== */
const wave=j=>{let d='';for(let x=0;x<=400;x+=10){const y=60+Math.sin(x/200*6.2832+j*.42)*(14+j*1.6)+Math.sin(x/100*6.2832+j)*3;d+=(x?'L':'M')+x+' '+y.toFixed(1)}return`<path d="${d}"/>`};
const WAVES='<svg class="km-svg" viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true"><g class="km-w">'+[0,1,2,3,4,5,6,7,8,9,10].map(wave).join('')+'</g></svg>';
safe('ayraç',()=>{const g=D.querySelector('#lp-ozellik .lp-grid');if(!g)return;g.classList.add('kmx');
 const HUES=['#6c47ff','#ff5c9a','#22d3ee','#f97316','#22c55e','#eab308','#3b82f6','#e11d48','#14b8a6','#a855f7','#f43f5e','#84cc16'];
 const cards=[...g.children].filter(c=>c.tagName=='ARTICLE');
 cards.forEach((c,i)=>{c.classList.remove('cv-beam');c.classList.add('km');c.style.setProperty('--h',HUES[i%HUES.length]);c.tabIndex=0;
  const art=D.createElement('div');art.className='km-art';art.innerHTML=WAVES;const ico=c.querySelector('.lp-ico');if(ico)art.appendChild(ico);
  const tab=D.createElement('span');tab.className='km-tab';tab.setAttribute('aria-hidden','true');
  const tail=D.createElement('span');tail.className='km-tail';tail.setAttribute('aria-hidden','true');
  const dots=D.createElement('span');dots.className='km-dots';dots.setAttribute('aria-hidden','true');dots.innerHTML='<i></i><i></i><i></i>';
  c.insertBefore(art,c.firstChild);c.insertBefore(tab,c.firstChild);c.append(dots,tail);
  c.addEventListener('pointermove',e=>{if(e.pointerType!='mouse'||reduced())return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));c.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3))},{passive:true});
  c.addEventListener('pointerleave',()=>{c.style.removeProperty('--mx');c.style.removeProperty('--my')})});
 g.addEventListener('click',e=>{if(FINE.matches)return;const k=e.target.closest('.km');if(!k)return;const was=k.classList.contains('on');cards.forEach(x=>x.classList.remove('on'));if(!was)k.classList.add('on')});
 revealAll(g,cards);P.mark=cards});

/* ===== 3) Yapay zekâ → Halka ===== */
safe('halka',()=>{const g=D.querySelector('#lp-yz .lp-aig');if(!g)return;const cards=[...g.children].filter(c=>c.classList.contains('lp-ai'));const N=cards.length;if(N<3)return;const step=360/N;
 g.classList.add('khx','kt-st','kt-rv');g.setAttribute('role','group');g.setAttribute('aria-roledescription','döner galeri');g.setAttribute('aria-label','Yapay zekâ araçları: sürükleyip çevir ya da okları kullan');
 g.innerHTML='<div class="kh-sc"><div class="kh-ring"></div></div>';const ring=g.querySelector('.kh-ring');
 cards.forEach((c,i)=>{strip(c);c.classList.add('kh-c',['kh-w','kh-d','kh-a'][i%3]);c.dataset.i=i;ring.appendChild(c)});
 const cap=D.createElement('div');cap.className='kt-cap kh-cap';cap.innerHTML=`<button type="button" class="kt-ar" data-d="-1" aria-label="Önceki araç">${ARL}</button><div class="kt-txt" aria-live="polite"></div><button type="button" class="kt-ar" data-d="1" aria-label="Sonraki araç">${ARR}</button>`;
 g.appendChild(cap);const txt=cap.querySelector('.kt-txt');reveal(g);
 let spin=0,v=0,Rr=200,idle=0,tilt=-8,ttilt=-8,goal=null,front=-1;
 const lay=()=>{const W=g.clientWidth;if(!W)return;const w=clamp(W*.16,118,172);Rr=Math.max(N*w*1.1/(2*Math.PI),w*1.4);g.style.setProperty('--w',w+'px');cards.forEach((c,i)=>{c.style.transform=`rotateY(${i*step}deg) translateZ(${Rr.toFixed(1)}px)`});paint()};
 const paint=()=>{ring.style.transform=`translateZ(${(-Rr).toFixed(1)}px) rotateX(${tilt.toFixed(2)}deg) rotateY(${spin.toFixed(2)}deg)`;let best=0,bd=999;
  cards.forEach((c,i)=>{const r=Math.abs(norm(i*step+spin));if(r<bd){bd=r;best=i}c.style.opacity=r<=100?'1':(1-(r-100)/80*.7).toFixed(3)});
  if(best!==front){front=best;cards.forEach((c,i)=>c.classList.toggle('kh-front',i===best));const c=cards[best],q=s=>{const x=c.querySelector(s);return x?x.textContent:''},tg=c.querySelector('.lp-tag');
   txt.innerHTML=`<b>${esc(q('b'))}</b><small lang="en">${esc(q('small'))}</small><p>${esc(q('p'))}</p>${tg?`<em class="${esc(tg.className)}">${esc(tg.textContent)}</em>`:''}`;
   if(!reduced()){txt.classList.remove('kt-capin');void txt.offsetWidth;txt.classList.add('kt-capin')}}};
 const toFront=i=>{const tgt=-i*step;goal=spin+norm(tgt-spin);v=0;idle=performance.now();if(reduced()){spin=goal;goal=null;paint()}else kick()};
 const dg=drag(g,{start:()=>{v=0;goal=null},move:dd=>{spin+=dd*.3;paint()},end:vv=>{v=reduced()?0:clamp(vv*.3,-14,14);idle=performance.now()}});
 g.addEventListener('pointermove',e=>{if(e.pointerType!='mouse')return;const r=g.getBoundingClientRect();ttilt=-8+((e.clientY-r.top)/r.height-.5)*-8;kick()},{passive:true});
 g.addEventListener('pointerleave',()=>{ttilt=-8;kick()});
 cap.addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(b)toFront(front+ +b.dataset.d)});
 ring.addEventListener('click',e=>{const c=e.target.closest('.kh-c');if(c&&+c.dataset.i!==front)toFront(+c.dataset.i)});
 g.tabIndex=0;g.addEventListener('keydown',e=>{if(e.target!==g)return;if(e.key=='ArrowLeft'){e.preventDefault();toFront(front-1)}else if(e.key=='ArrowRight'){e.preventDefault();toFront(front+1)}});
 onLay(g,lay);lay();
 addLoop(g,(t,dt)=>{if(dg.dragging())return true;let m=false;
  if(goal!=null){const d=goal-spin;spin+=d*Math.min(1,.14*dt/16);if(Math.abs(d)<.05){spin=goal;goal=null}m=true}
  else if(Math.abs(v)>.02){spin+=v*dt/16;v*=Math.pow(.94,dt/16);m=true}else if(!reduced()&&t-idle>1600){spin-=6*dt/1000;m=true}
  if(Math.abs(ttilt-tilt)>.01){tilt+=(ttilt-tilt)*.08;m=true}if(m)paint();return m||!reduced()});
 P.ring={paint,toFront,state:()=>({spin,front})}});

/* ===== 4) Hareket → Spot ===== */
safe('spot',()=>{const s=$('lp-hareket');const g=s&&s.querySelector('.vy-mgrid');if(!g)return;const cards=[...g.children].filter(c=>c.classList.contains('vy-mc'));if(cards.length<2)return;
 g.classList.add('ksx','kt-st','kt-rv');g.setAttribute('role','group');g.setAttribute('aria-roledescription','galeri');g.setAttribute('aria-label','Hareket anahtarları');
 cards.forEach(c=>{c.classList.remove('vy-rv','in');c.classList.add('ks-c')});reveal(g);
 const fz=c=>[...c.querySelectorAll('button,[tabindex],input,a[href]')];
 const r=rail(g,cards,{cls:'ks-c',label:'Anahtarlar',name:c=>(c.querySelector('b')||{}).textContent||'',
  cap:c=>`<b>${esc((c.querySelector('b')||{}).textContent||'')}</b>`,
  focus:(c,on)=>{fz(c).forEach(x=>{if(on){if(x.dataset.ti!=null){x.dataset.ti==''?x.removeAttribute('tabindex'):x.setAttribute('tabindex',x.dataset.ti);delete x.dataset.ti}}else if(x.dataset.ti==null){x.dataset.ti=x.getAttribute('tabindex')||'';x.setAttribute('tabindex','-1')}});c.setAttribute('aria-hidden',on?'false':'true')},
  place(c,d,W){const cw=clamp(W*.3,250,330),sw=cw*.74,gap=clamp(W*.012,6,12);let x=0;if(d){const k=Math.abs(d);x=Math.sign(d)*(cw/2+sw/2+gap+(k-1)*(sw*.86+gap))}
   c.style.width=cw+'px';c.style.transform=`translateX(-50%) translateX(${x.toFixed(1)}px) scale(${d?.74:1})`;const far=Math.abs(d)>2;c.style.zIndex=10-Math.abs(d);c.style.opacity=far?'0':'1';c.style.pointerEvents=far?'none':'';c.style.setProperty('--dim',d?'.5':'0')}});
 const fit=()=>{let h=0;cards.forEach(c=>{h=Math.max(h,c.offsetHeight)});if(h)g.style.setProperty('--ch',h+'px')};
 onLay(g,fit);fit();setTimeout(fit,500);try{D.fonts&&D.fonts.ready.then(fit)}catch(e){}
 P.spot=r});

/* ===== 5) İnteraktif → Yay ===== */
safe('yay',()=>{const ul=D.querySelector('#lp-int .lp-il');if(!ul)return;const cards=[...ul.children].filter(c=>c.tagName=='LI');if(cards.length<3)return;
 const C=[['#1b1464','#a5b4fc'],['#101010','#1ed760'],['#e6efe0','#ea4335'],['#0f172a','#22d3ee'],['#2b0a3d','#f9a8d4'],['#042f2e','#5eead4'],['#f4f4f8','#5b4bff'],['#ffffff','#111111'],['#111827','#60a5fa'],['#fff0f6','#ff4f9a']];
 const st=D.createElement('div');st.className='kax kt-st kt-rv';st.setAttribute('role','group');st.setAttribute('aria-roledescription','galeri');st.setAttribute('aria-label','İnteraktif öğeler: sürükle, dokun ya da okları kullan');
 ul.before(st);st.appendChild(ul);ul.classList.add('ka-sc');
 cards.forEach((c,i)=>{strip(c);c.classList.add('ka-c');c.style.setProperty('--kb',C[i%C.length][0]);c.style.setProperty('--kg',C[i%C.length][1])});reveal(st);
 const r=rail(st,cards,{cls:'ka-c',label:'İnteraktif öğeler',name:c=>(c.querySelector('b')||{}).textContent||'',
  cap:c=>`<b>${esc((c.querySelector('b')||{}).textContent||'')}</b><small>${esc((c.querySelector('small')||{}).textContent||'')}</small>`,
  focus:(c,on)=>c.setAttribute('aria-current',on?'true':'false'),
  place(c,d,W){const cw=clamp(W*.19,84,124),Rr=clamp(W*.58,200,440),sp=clamp(34-W/40,18,26),th=d*sp,rad=th*Math.PI/180;
   const x=Math.sin(rad)*Rr,y=(1-Math.cos(rad))*Rr*.92,far=Math.abs(d)>3;st.style.setProperty('--cw',cw+'px');
   c.style.transform=`translate(-50%,0) translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${th.toFixed(2)}deg) scale(${d===0?1.3:.86})`;
   c.style.opacity=far?'0':d===0?'1':(1-Math.abs(d)*.07).toFixed(2);c.style.zIndex=20-Math.abs(d);c.style.pointerEvents=far?'none':''}});
 P.arc=r});

/* ===== 6) Çalışmalarım → Çember ===== */
safe('çember',()=>{const grid=$('pgrid'),proj=$('proj');if(!grid||!proj)return;
 const st=D.createElement('div');st.className='kcx kt-st kt-rv';st.setAttribute('role','group');st.setAttribute('aria-roledescription','döner galeri');st.setAttribute('aria-label','Çalışmaların ve şablonlar: fırlat, çift dokunuşla yakınlaş');
 st.innerHTML='<div class="kc-sc"><div class="kc-zoom"><div class="kc-ring"></div></div></div><div class="kc-cap" aria-live="polite"><b></b><small></small></div>';
 grid.before(st);reveal(st);
 const ring=st.querySelector('.kc-ring'),cb=st.querySelector('.kc-cap b'),cm=st.querySelector('.kc-cap small'),capEl=st.querySelector('.kc-cap');
 let items=[],cards=[],N=0,step=30,spin=0,v=0,Rr=180,idle=0,front=-1,zoom=false,tap=0,lz=0,sig='';
 const tpls=()=>{try{return typeof TPLS!='undefined'?TPLS:[]}catch(e){return[]}};
 const kname=k=>{try{const K=typeof KINDS!='undefined'&&KINDS.find(x=>x[0]==k);return K?K[1]:''}catch(e){return''}};
 const collect=()=>{const L=[...grid.querySelectorAll('.pc')].slice(0,24).map(pc=>{const im=pc.querySelector('.pth img'),b=pc.querySelector('.pi b'),sm=pc.querySelector('.pi small'),op=pc.querySelector('[data-open]');
   return{name:b?b.textContent:'Çalışma',sub:sm?sm.textContent:'',img:im?im.getAttribute('src'):'',open:()=>{if(op)op.click()},id:pc.dataset.id}});
  const T=tpls();let k=0;while(L.length<16&&T.length&&k<48){const i=k%T.length,t=T[i];L.push({name:t.name,sub:'Şablon · '+kname(t.k),tpl:i,t});k++}return L};
 const build=()=>{const L=collect(),s=L.map(x=>(x.id||'t'+x.tpl)+':'+x.name+':'+(x.img?x.img.length:0)).join('|');if(s===sig)return;sig=s;items=L;N=L.length;st.hidden=!N;if(!N)return;step=360/N;
  ring.innerHTML=items.map((x,i)=>{if(x.img)return`<button type="button" class="kc-c kc-p" data-i="${i}" aria-label="${esc(x.name)}"><img src="${esc(x.img)}" alt="" draggable="false"></button>`;
   if(x.t){const p=pal(x.t.pal);return`<button type="button" class="kc-c" data-i="${i}" aria-label="${esc(x.name)} şablonu" style="--cb:${p[1]};--ca:${p[3]};--ct:${p[2]}"><i class="kc-m"></i><i class="kc-b"></i></button>`}
   return`<button type="button" class="kc-c kc-e" data-i="${i}" aria-label="${esc(x.name)}"><i>▦</i></button>`}).join('');
  cards=[...ring.children];front=-1;lay()};
 const lay=()=>{const W=st.clientWidth;if(!W||!N)return;const w=clamp(W*.075,38,60),base=N*w*1.1/(2*Math.PI);Rr=clamp(W*.24,base,Math.max(base,250));st.style.setProperty('--w',w+'px');cards.forEach((c,i)=>c.style.setProperty('--t',`rotateY(${(i*step).toFixed(2)}deg) translateZ(${Rr.toFixed(1)}px)`));paint()};
 const paint=()=>{if(!N)return;ring.style.transform=`rotateX(-22deg) rotateZ(-8deg) rotateY(${spin.toFixed(2)}deg)`;let best=0,bd=999;
  cards.forEach((c,i)=>{const r=Math.abs(norm(i*step+spin));if(r<bd){bd=r;best=i}c.style.opacity=r<100?'1':(1-(r-100)/80*.5).toFixed(3)});
  if(best!==front){front=best;cards.forEach((c,i)=>c.classList.toggle('kc-front',i===best));const x=items[best];cb.textContent=x.name;cm.textContent=x.sub;
   if(!reduced()){capEl.classList.remove('kt-capin');void capEl.offsetWidth;capEl.classList.add('kt-capin')}}};
 const open=i=>{const x=items[i];if(!x)return;try{if(x.open)x.open();else if(x.tpl!=null&&typeof tplGo=='function')tplGo(x.tpl)}catch(e){console.warn('sahneler: aç',e)}};
 const dg=drag(st,{start:()=>{v=0},move:dd=>{spin+=dd*.42;paint()},end:vv=>{v=reduced()?0:clamp(vv*.42,-22,22);idle=performance.now()}});
 const zt=()=>{const t=performance.now();if(t-lz<450)return;lz=t;zoom=!zoom;st.classList.toggle('kc-zoomed',zoom)};
 st.addEventListener('dblclick',e=>{e.preventDefault();zt()});
 st.addEventListener('pointerup',e=>{if(e.pointerType=='mouse'||dg.dragging())return;const t=performance.now();if(t-tap<320){tap=0;zt()}else tap=t});
 st.addEventListener('click',e=>{const c=e.target.closest('.kc-c');if(!c||e.detail>1)return;const i=+c.dataset.i;
  if(i===front){clearTimeout(st._kc);st._kc=setTimeout(()=>{if(performance.now()-lz>500&&!(tap&&performance.now()-tap<330))open(i)},340)}
  else{spin=spin+norm(-i*step-spin);v=0;idle=performance.now();paint()}});
 st.tabIndex=0;st.addEventListener('keydown',e=>{if(e.target!==st)return;if(e.key=='ArrowLeft'){e.preventDefault();spin+=step;paint()}else if(e.key=='ArrowRight'){e.preventDefault();spin-=step;paint()}else if(e.key=='Enter'){e.preventDefault();open(front)}});
 let pend=0;new MutationObserver(()=>{clearTimeout(pend);pend=setTimeout(()=>safe('çember yenile',build),120)}).observe(grid,{childList:true,subtree:true});
 build();onLay(st,lay);
 addLoop(st,(t,dt)=>{if(!N)return false;if(dg.dragging())return true;
  if(Math.abs(v)>.02){spin+=v*dt/16;v*=Math.pow(.955,dt/16);paint();return true}
  if(!reduced()&&t-idle>1600){spin-=4*dt/1000;paint();return true}return false});
 P.loop={build,open,state:()=>({N,front,zoom})}});

/* döngüyü uyandıranlar */
D.addEventListener('visibilitychange',kick);
setInterval(()=>{if(!raf&&!reduced()&&homeOn()&&!D.hidden&&[...VIS.values()].some(Boolean))kick()},1500);
safe('ana sayfa',()=>{const h=$('home');if(h)new MutationObserver(()=>{if(!h.hidden)requestAnimationFrame(()=>{LAYS.forEach(f=>safe('yerleşim',f));kick()})}).observe(h,{attributes:true,attributeFilter:['hidden']})});

window.v4sahne={reduced,parts:P,kick};
})();
