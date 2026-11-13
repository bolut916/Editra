/* =====================================================================
   CANLI ARAYÜZ: hareket katmanı
   Her efekt ayrı bir korumalı blokta kurulur: biri hata verirse diğerleri ve uygulama çalışmaya devam eder.
   "Hareketi azalt" (sistem ya da Ayarlar) açıkken sürekli animasyonlar durur, geçişler anında olur.
   ===================================================================== */
(function(){
'use strict';
const D=document,R=D.documentElement,$=id=>D.getElementById(id);
const mq=q=>{try{return matchMedia(q)}catch(e){return{matches:false,addEventListener(){}}}};
const RM=mq('(prefers-reduced-motion: reduce)'),FINE=mq('(hover: hover) and (pointer: fine)');
const reduced=()=>(RM.matches&&R.dataset.motion!='on')||R.dataset.motion=='reduce';
const fine=()=>FINE.matches;
const homeOn=()=>{const h=$('home');return!!h&&!h.hidden};
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const safe=(n,f)=>{try{f()}catch(e){console.warn('canlı arayüz: '+n,e)}};
let lastPt={x:innerWidth/2,y:innerHeight/2};
addEventListener('pointerdown',e=>{lastPt={x:e.clientX,y:e.clientY}},{capture:true,passive:true});
const L={};

/* 1) Tema değişimi: tıklanan noktadan dairesel açılım */
safe('tema',()=>{const go=btn=>{if(typeof cycleTheme!='function')return;const r=btn&&btn.getBoundingClientRect(),x=r&&r.width?r.left+r.width/2:lastPt.x,y=r&&r.width?r.top+r.height/2:lastPt.y;
  R.style.setProperty('--vx',x+'px');R.style.setProperty('--vy',y+'px');
  if(!reduced()&&D.startViewTransition){try{D.startViewTransition(()=>cycleTheme());return}catch(e){}}cycleTheme()};
 ['th2','th3'].forEach(id=>{const b=$(id);if(b)b.onclick=e=>{e.preventDefault();go(b)}})});

/* 2) Ana sayfa ↔ editör: perde geçişi (görsel katman; asıl işlem beklemeden anında yapılır) */
safe('perde',()=>{let cur=null;const curtain=(x,y)=>{if(reduced())return;if(cur)cur.remove();const c=D.createElement('div');c.className='cv-cur';c.style.setProperty('--x',x+'px');c.style.setProperty('--y',y+'px');D.body.appendChild(c);cur=c;
  c.addEventListener('animationend',()=>{if(c===cur)cur=null;c.remove()},{once:true});setTimeout(()=>{if(c.isConnected)c.remove()},1600)};
 const wrapG=(name,from)=>{const f=window[name];if(typeof f!='function')return;window[name]=function(){const wasHome=homeOn();if(from=='home'?wasHome:!wasHome)curtain(lastPt.x,lastPt.y);return f.apply(this,arguments)}};
 wrapG('openEditor','home');wrapG('showHome','edit')});

/* 3) Düğmelere tıklama dalgası (düğmenin kendisine dokunmadan, üstte sabit bir katmanda) */
safe('dalga',()=>{const SEL='.lp-btn,.b,.pb,.cbb,.rb,.chip,.ib,.dtabs [role=tab],.pitem,.rfly button,.abadd,.adbox button';
 D.addEventListener('pointerdown',e=>{if(reduced()||e.button)return;const b=e.target.closest&&e.target.closest(SEL);if(!b||b.disabled)return;const r=b.getBoundingClientRect();if(r.width<8||r.height<8)return;
  const cs=getComputedStyle(b),w=D.createElement('span');w.className='cv-rip';w.style.cssText=`left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;border-radius:${cs.borderRadius}`;
  const d=Math.hypot(Math.max(e.clientX-r.left,r.right-e.clientX),Math.max(e.clientY-r.top,r.bottom-e.clientY))*2,i=D.createElement('i');i.style.cssText=`left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px;width:${d}px;height:${d}px`;
  const m=(cs.backgroundColor.match(/[\d.]+/g)||[255,255,255,0]).map(Number),lum=(.299*m[0]+.587*m[1]+.114*m[2])/255,alpha=m.length>3?m[3]:1;if(cs.backgroundImage!='none'||(alpha>.5&&lum<.5))w.classList.add('lt');
  w.appendChild(i);D.body.appendChild(w);setTimeout(()=>w.remove(),700)},{passive:true})});

/* 4) İmleç halkası (yalnız ana sayfa, fare ile): yumuşak takip, etkileşimli öğede büyür, CTA'da etiket */
safe('imleç',()=>{const ring=D.createElement('div'),dot=D.createElement('div'),lab=D.createElement('span');ring.className='cv-ring';dot.className='cv-dot';ring.appendChild(lab);ring.setAttribute('aria-hidden','true');dot.setAttribute('aria-hidden','true');D.body.append(ring,dot);
 let tx=-100,ty=-100,x=-100,y=-100,raf=0,act=false,shown=false;
 const tick=()=>{raf=0;x=lerp(x,tx,.2);y=lerp(y,ty,.2);ring.style.transform=`translate3d(${x}px,${y}px,0)`;if(Math.abs(x-tx)+Math.abs(y-ty)>.3)raf=requestAnimationFrame(tick)};
 const on=()=>fine()&&!reduced()&&homeOn();
 addEventListener('pointermove',e=>{if(e.pointerType!='mouse'||!on()){if(shown){ring.classList.remove('on');dot.classList.remove('on');shown=false}return}
  tx=e.clientX;ty=e.clientY;dot.style.transform=`translate3d(${tx}px,${ty}px,0)`;if(!shown){x=tx;y=ty;ring.classList.add('on');dot.classList.add('on');shown=true}
  const t=e.target.closest&&e.target.closest('a,button,label,input,select,textarea,[data-tilt],[data-cursor]'),a=!!t;
  if(a!==act){act=a;ring.classList.toggle('big',a)}const l=t&&(t.dataset.cursor||(t.matches('.lp-btn-p')?'Başla':''));lab.textContent=l||'';ring.classList.toggle('lab',!!l);
  if(!raf)raf=requestAnimationFrame(tick)},{passive:true});
 const hide=()=>{ring.classList.remove('on','big','lab','down');dot.classList.remove('on');shown=false;act=false};D.addEventListener('pointerleave',hide);
 {const h=$('home');if(h)new MutationObserver(()=>{if(!homeOn())hide()}).observe(h,{attributes:true,attributeFilter:['hidden']})}
 addEventListener('pointerdown',()=>{if(shown)ring.classList.add('down')},{passive:true});addEventListener('pointerup',()=>ring.classList.remove('down'),{passive:true})});

/* 5) Mıknatıs düğmeler (ana sayfa) */
safe('mıknatıs',()=>{const home=$('home');if(!home)return;const M=new Map();
 home.addEventListener('pointermove',e=>{if(e.pointerType!='mouse'||reduced())return;const b=e.target.closest&&e.target.closest('.lp-btn,.hh .b,.hh .ib,.lpn a');if(!b)return;
  const r=b.getBoundingClientRect(),dx=(e.clientX-(r.left+r.width/2))/r.width,dy=(e.clientY-(r.top+r.height/2))/r.height;b.style.setProperty('--mx',(dx*10).toFixed(2)+'px');b.style.setProperty('--my',(dy*8).toFixed(2)+'px');b.classList.add('cv-mag');M.set(b,1)},{passive:true});
 home.addEventListener('pointerout',e=>{const b=e.target.closest&&e.target.closest('.cv-mag');if(b&&!b.contains(e.relatedTarget)){b.style.setProperty('--mx','0px');b.style.setProperty('--my','0px')}},{passive:true})});

/* 6) Dev başlık: harf harf yükselme + imlece yakın harflerde dalga */
safe('başlık',()=>{const h=D.querySelector('.lp-h1');if(!h||h.dataset.cv)return;h.dataset.cv=1;{const cl=h.cloneNode(true);cl.querySelectorAll('br').forEach(x=>x.replaceWith(' '));h.setAttribute('aria-label',cl.textContent.replace(/\s+/g,' ').trim())}
 let k=0;const split=node=>{[...node.childNodes].forEach(n=>{if(n.nodeType==3){const f=D.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(D.createTextNode(' '));return}const wd=D.createElement('span');wd.className='cv-wd';wd.setAttribute('aria-hidden','true');[...w].forEach(ch=>{const s=D.createElement('span');s.className='cv-ch';s.textContent=ch;s.style.setProperty('--i',k++);wd.appendChild(s)});f.appendChild(wd)});n.replaceWith(f)}else if(n.nodeType==1&&n.tagName=='EM'){n.classList.add('cv-em');n.style.setProperty('--i',k++);n.setAttribute('aria-hidden','true')}else if(n.nodeType==1&&n.tagName!='BR')split(n)})};
 split(h);h.classList.add('cv-split');requestAnimationFrame(()=>requestAnimationFrame(()=>h.classList.add('cv-in')));
 const CH=[...h.querySelectorAll('.cv-ch,.cv-em')];let raf=0,px=0,py=0,inside=false;
 const wave=()=>{raf=0;CH.forEach(c=>{const r=c.getBoundingClientRect(),d=Math.hypot(px-(r.left+r.width/2),py-(r.top+r.height/2)),f=inside?Math.max(0,1-d/160):0;c.style.setProperty('--w',f.toFixed(3))})};
 h.addEventListener('pointermove',e=>{if(e.pointerType!='mouse'||reduced())return;px=e.clientX;py=e.clientY;inside=true;if(!raf)raf=requestAnimationFrame(wave)},{passive:true});
 h.addEventListener('pointerleave',()=>{inside=false;if(!raf)raf=requestAnimationFrame(wave)})});

/* 7) Etkileşimli nokta alanı (hero arka planı): imleçten kaçan noktalar, tıklayınca dalga */
safe('nokta alanı',()=>{const hero=$('lph');if(!hero)return;const c=D.createElement('canvas');c.className='cv-field';c.setAttribute('aria-hidden','true');hero.insertBefore(c,hero.firstChild);
 const g=c.getContext('2d');let W=0,H=0,dpr=1,P=[],raf=0,vis=true,mx=-999,my=-999,waves=[],col='108,71,255',lastMv=0;
 const size=()=>{const r=hero.getBoundingClientRect();dpr=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';
  const step=fine()?26:34;P=[];for(let y=step/2;y<H;y+=step)for(let x=step/2;x<W;x+=step)P.push({x,y,ox:x,oy:y,vx:0,vy:0});
  const pr=getComputedStyle(R).getPropertyValue('--pr').trim(),m=/^#([0-9a-f]{6})$/i.exec(pr);if(m){const n=parseInt(m[1],16);col=`${n>>16},${n>>8&255},${n&255}`}};
 /* noktalar 8 parlaklık kovasında toplu çizilir; hiçbir şey kıpırdamıyorsa döngü durur (pil dostu) */
 const NB=8,BK=Array.from({length:NB},()=>[]);let cost=0,frames=0;
 const frame=t=>{raf=0;if(!vis||reduced()||!homeOn())return;const t0=performance.now();g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);BK.forEach(b=>b.length=0);
  waves=waves.filter(w=>t-w.t<1400);let moving=waves.length>0;const idle=performance.now()-lastMv,pull=Math.max(0,Math.min(1,1-(idle-900)/900));if(pull>0&&mx>-900)moving=true;
  for(const p of P){let fx=(p.ox-p.x)*.06,fy=(p.oy-p.y)*.06;const dx=p.x-mx,dy=p.y-my;
   if(pull>0&&Math.abs(dx)<120&&Math.abs(dy)<120){const d=Math.hypot(dx,dy);if(d<120&&d>.1){const k=(1-d/120)*2.2*pull;fx+=dx/d*k;fy+=dy/d*k}}
   for(const w of waves){const age=(t-w.t)/1400,rad=age*Math.max(W,H)*.9,dd=Math.hypot(p.ox-w.x,p.oy-w.y),band=Math.exp(-((dd-rad)**2)/900)*(1-age);if(band>.01){fx+=(p.ox-w.x)/(dd||1)*band*3;fy+=(p.oy-w.y)/(dd||1)*band*3}}
   p.vx=(p.vx+fx)*.78;p.vy=(p.vy+fy)*.78;p.x+=p.vx;p.y+=p.vy;const off=Math.abs(p.x-p.ox)+Math.abs(p.y-p.oy);if(Math.abs(p.vx)+Math.abs(p.vy)>.02)moving=true;else if(off<.05){p.x=p.ox;p.y=p.oy;p.vx=p.vy=0}
   BK[Math.min(NB-1,Math.floor(Math.min(1,off/18)*NB))].push(p)}
  BK.forEach((L2,i)=>{if(!L2.length)return;const e=i/(NB-1),r=1.1+e*1.6;g.fillStyle=`rgba(${col},${(.16+e*.6).toFixed(3)})`;g.beginPath();for(const p of L2){g.moveTo(p.x+r,p.y);g.arc(p.x,p.y,r,0,6.283)}g.fill()});
  cost+=performance.now()-t0;frames++;if(moving)raf=requestAnimationFrame(frame)};
 const kick=()=>{if(!raf&&vis&&!reduced()&&homeOn())raf=requestAnimationFrame(frame)};
 hero.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;lastMv=performance.now();kick()},{passive:true});
 hero.addEventListener('pointerleave',()=>{mx=my=-999;kick()});
 hero.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect();waves.push({x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()});kick()},{passive:true});
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;kick()}).observe(hero);
 D.addEventListener('visibilitychange',()=>{vis=!D.hidden;kick()});
 if('ResizeObserver' in window)new ResizeObserver(()=>{size();kick()}).observe(hero);else addEventListener('resize',()=>{size();kick()});
 new MutationObserver(()=>{size();kick()}).observe(R,{attributes:true,attributeFilter:['data-theme','data-motion']});
 size();kick();L.field={kick,running:()=>!!raf,cost:()=>frames?cost/frames:0,frames:()=>frames}});

/* 8) Kaydırma: ilerleme çubuğu + hıza göre hızlanan kayan şerit + kelime kelime açılan bölüm başlıkları */
safe('kaydırma',()=>{const bar=D.createElement('div');bar.className='cv-prog';bar.setAttribute('aria-hidden','true');D.body.appendChild(bar);
 const mq2=D.querySelector('.lp-marq>div');let ly=scrollY,lt=performance.now(),v=0,raf=0;
 const upd=()=>{raf=0;const max=D.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${homeOn()&&max>0?clamp(scrollY/max,0,1):0})`;
  if(mq2&&mq2.getAnimations&&!reduced()){const rate=1+Math.min(5,v*.012);mq2.getAnimations().forEach(a=>{a.playbackRate=lerp(a.playbackRate||1,rate,.25)});if(v>.5){v*=.9;raf=requestAnimationFrame(upd)}}};
 addEventListener('scroll',()=>{const t=performance.now(),dy=Math.abs(scrollY-ly);v=Math.max(v*.6,dy/Math.max(1,t-lt)*16);ly=scrollY;lt=t;if(!raf)raf=requestAnimationFrame(upd)},{passive:true});upd();
 const hs=[...D.querySelectorAll('#home .lp-sh h2,#home .lp-end h2')];hs.forEach(h=>{if(h.dataset.cv)return;h.dataset.cv=1;let k=0;const walk=n=>[...n.childNodes].forEach(x=>{if(x.nodeType==1&&x.tagName=='EM'){const o=D.createElement('span');o.className='cv-w';x.replaceWith(o);const i=D.createElement('span');i.style.setProperty('--i',k++);i.appendChild(x);o.appendChild(i);return}if(x.nodeType==3){const f=D.createDocumentFragment();x.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(D.createTextNode(w));return}const o=D.createElement('span');o.className='cv-w';const i=D.createElement('span');i.textContent=w;i.style.setProperty('--i',k++);o.appendChild(i);f.appendChild(o)});x.replaceWith(f)}else if(x.nodeType==1)walk(x)});walk(h);h.classList.add('cv-words')});
 if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('cv-in');io.unobserve(en.target)}}),{threshold:.3});hs.forEach(h=>io.observe(h))}else hs.forEach(h=>h.classList.add('cv-in'))});

/* 9) Kayan göstergeler: araç şeridi ve panel sekmeleri (seçili olana yaylı kayar) */
safe('göstergeler',()=>{const mk=(host,sel,cls)=>{if(!host)return null;const ind=D.createElement('i');ind.className='cv-ind '+cls;ind.setAttribute('aria-hidden','true');host.insertBefore(ind,host.firstChild);if(getComputedStyle(host).position=='static')host.style.position='relative';
  let first=true;const place=()=>{const a=host.querySelector(sel);if(!a||!a.offsetParent){ind.style.opacity=0;return}const hr=host.getBoundingClientRect(),r=a.getBoundingClientRect();
   ind.style.width=r.width+'px';ind.style.height=r.height+'px';ind.style.transform=`translate(${r.left-hr.left+host.scrollLeft}px,${r.top-hr.top+host.scrollTop}px)`;ind.style.opacity=1;
   if(first){ind.style.transition='none';ind.offsetWidth;ind.style.transition='';first=false;host.classList.add('cv-has-ind')}};
  new MutationObserver(()=>requestAnimationFrame(place)).observe(host,{subtree:true,attributes:true,attributeFilter:['aria-pressed','aria-selected']});
  if('ResizeObserver' in window)new ResizeObserver(()=>place()).observe(host);addEventListener('resize',place);setTimeout(place,60);return place};
 L.rail=mk(D.querySelector('#rail .rgs'),'.rg[aria-pressed=true]','cv-ind-rail');
 L.tabs=mk($('dtabs'),'[role=tab][aria-selected=true]','cv-ind-tab');
 const ob=new MutationObserver(()=>{if(!$('edw').hidden){L.rail&&L.rail();L.tabs&&L.tabs()}});ob.observe($('edw'),{attributes:true,attributeFilter:['hidden']});
 D.body.addEventListener('transitionend',e=>{if(e.target&&e.target.id=='dockp'){L.tabs&&L.tabs()}})});

/* 10) Artboard değişince çerçeve parlar */
safe('artboard',()=>{const g=window.goPage;if(typeof g!='function')return;window.goPage=function(){const before=typeof PROJ!='undefined'&&PROJ?PROJ.cur:-1,r=g.apply(this,arguments);
  if(!reduced()&&typeof PROJ!='undefined'&&PROJ&&PROJ.cur!=before){const cv=$('cv');if(cv){cv.classList.remove('cv-pulse');void cv.offsetWidth;cv.classList.add('cv-pulse')}}return r}});

/* 11) Otomatik tasarım: öğeler eski yerlerinden yenilerine akar (FLIP), yeni gelenler süzülür */
safe('akış',()=>{let snap=null;window.v4morph={before(){snap=null;if(reduced())return;const cv=$('cv');if(!cv)return;snap=new Map();cv.querySelectorAll('.e[data-id]').forEach(n=>snap.set(n.dataset.id,n.getBoundingClientRect()))},
 after(){const S0=snap;snap=null;if(!S0||reduced())return;const cv=$('cv');if(!cv)return;let i=0;
  cv.querySelectorAll('.e[data-id]').forEach(n=>{const L2=n.getBoundingClientRect();if(!L2.width||!L2.height)return;const F=S0.get(n.dataset.id),base=getComputedStyle(n).transform,fin=base=='none'?'':base,k=i++;
   if(!n.animate)return;
   if(F&&F.width&&F.height){const dx=(F.left+F.width/2)-(L2.left+L2.width/2),dy=(F.top+F.height/2)-(L2.top+L2.height/2),sx=F.width/L2.width,sy=F.height/L2.height;if(Math.abs(dx)+Math.abs(dy)<1&&Math.abs(sx-1)+Math.abs(sy-1)<.01)return;
    n.animate([{transform:`translate(${dx}px,${dy}px) scale(${sx},${sy}) ${fin}`},{transform:fin||'none'}],{duration:620,delay:Math.min(k*18,180),easing:'cubic-bezier(.2,.85,.2,1)',fill:'backwards'})}
   else n.animate([{opacity:0,transform:`translateY(14px) scale(.96) ${fin}`},{opacity:n.style.opacity||1,transform:fin||'none'}],{duration:520,delay:120+Math.min(k*24,260),easing:'cubic-bezier(.2,.85,.2,1)',fill:'backwards'})})}}});

/* 12) "Tasarla" düğmesi: denenen aday sayısı canlı akar, bitince kıvılcım */
safe('tasarla',()=>{const box=$('adbox');if(!box)return;let raf=0,btn=null,base='';
 const spark=b=>{if(reduced()||!b)return;const r=b.getBoundingClientRect(),w=D.createElement('div');w.className='cv-spark';w.style.cssText=`left:${r.left+r.width/2}px;top:${r.top+r.height/2}px`;
  for(let i=0;i<14;i++){const s=D.createElement('i'),a=i/14*6.283+Math.random()*.4,d=36+Math.random()*34;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');s.style.setProperty('--h',(250+Math.random()*90|0));w.appendChild(s)}
  D.body.appendChild(w);setTimeout(()=>w.remove(),900)};
 const tick=()=>{raf=0;if(!btn)return;if(!btn.disabled){btn.textContent=base;btn.classList.remove('cv-busy');const ok=/hazır/.test(($('toast')||{}).textContent||'');if(ok)spark(btn);btn=null;return}
  const n=window.v4adTried||0;btn.textContent=n?`Tasarlanıyor · ${n.toLocaleString('tr-TR')} aday`:'Tasarlanıyor…';raf=requestAnimationFrame(tick)};
 box.addEventListener('click',e=>{const b=e.target.closest('[data-ad]');if(!b||!['go','next','lay','font','color','all'].includes(b.dataset.ad))return;window.v4adTried=0;btn=b;base=b.textContent;b.classList.add('cv-busy');setTimeout(()=>{if(!raf)raf=requestAnimationFrame(tick)},0)},true)});

/* 13) Açılış ekranı: harf harf beliren logo yazısı */
safe('açılış',()=>{const h=D.querySelector('#splash h1');if(!h||h.dataset.cv)return;h.dataset.cv=1;const t=h.textContent;h.setAttribute('aria-label',t);h.textContent='';
 [...t].forEach((ch,i)=>{const s=D.createElement('span');s.className='cv-sp';s.textContent=ch;s.style.setProperty('--i',i);s.setAttribute('aria-hidden','true');h.appendChild(s)})});

/* 14) Kartlar: ana sayfa kartlarında dönen ışık kenarı için sınıf (CSS ile) */
safe('kartlar',()=>{D.querySelectorAll('#home .lp-card,#home .lp-ai').forEach(c=>c.classList.add('cv-beam'))});

/* 15) Hareketi azalt açılırsa sürekli animasyonları anında durdur */
safe('azalt',()=>{const stop=()=>{if(reduced())D.querySelectorAll('.cv-rip,.cv-spark,.cv-cur').forEach(x=>x.remove())};RM.addEventListener&&RM.addEventListener('change',stop);new MutationObserver(stop).observe(R,{attributes:true,attributeFilter:['data-motion']})});

window.v4live={reduced,parts:L};
})();
