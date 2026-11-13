/* =====================================================================
   DOKUNMATİK HAREKET: telefon ve tablete özel animasyonlar
   - Telefonu eğince ana sahne derinlik kazanır (dev V, noktalar, renk bulutları, demo kartı, rozetler)
     iPhone izin ister: "Hareketi aç" düğmesi; Android'de kendiliğinden başlar
   - Dokunulan yerden renkli halkalar, başlığa dokununca harfler dalga gibi zıplar
   - Kaydırırken ekranın ortasındaki kart öne çıkar (fare üstü efektinin dokunmatik karşılığı)
   - Hızlı kaydırınca başlıklar ve şerit hafifçe esner, sonra yaylı geri gelir
   - Destekleyen telefonlarda önemli düğmelerde kısa titreşim
   Yalnız dokunmatik ekranda çalışır; bilgisayarda hiçbir şey değişmez. "Hareketi azalt" açıkken hepsi durur.
   ===================================================================== */
(function(){
'use strict';
const D=document,R=D.documentElement,$=id=>D.getElementById(id);
const mm=q=>{try{return matchMedia(q)}catch(e){return{matches:false}}};
const RM=mm('(prefers-reduced-motion: reduce)'),COARSE=mm('(pointer: coarse)');
const reduced=()=>(RM.matches&&R.dataset.motion!='on')||R.dataset.motion=='reduce';
const touch=()=>COARSE.matches||('ontouchstart' in window&&navigator.maxTouchPoints>0);
const homeOn=()=>{const h=$('home');return!!h&&!h.hidden};
const safe=(n,f)=>{try{f()}catch(e){console.warn('dokunmatik: '+n,e)}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const P={};
if(touch())R.classList.add('vt-touch');

/* 1) Eğim: telefonun açısına göre ana sahne katmanları farklı derinlikte kayar */
safe('eğim',()=>{const DO=window.DeviceOrientationEvent;if(!DO)return;const hero=$('lph');if(!hero)return;
 const L=()=>[
  [hero.querySelector('.vy-big svg'),28],[hero.querySelector('.cv-field'),10],[hero.querySelector('.lp-mesh'),18],
  ...[...hero.querySelectorAll('.lpd-float')].map((el,i)=>[el,14+i*6])];
 let tx=0,ty=0,x=0,y=0,raf=0,base=null,live=false,on=false;const demo=$('lpdemo');
 const paint=()=>{raf=0;if(reduced()||!homeOn()||!on){clear();return}x+=(tx-x)*.12;y+=(ty-y)*.12;
  for(const[el,k]of L())if(el)el.style.translate=`${(x*k).toFixed(1)}px ${(y*k).toFixed(1)}px`;
  if(demo){const a=Math.hypot(x,y)*7;demo.style.rotate=a>.05?`${(-y).toFixed(3)} ${x.toFixed(3)} 0 ${a.toFixed(2)}deg`:''}
  if(Math.abs(tx-x)+Math.abs(ty-y)>.002)raf=requestAnimationFrame(paint)};
 const clear=()=>{for(const[el]of L())if(el)el.style.translate='';if(demo)demo.style.rotate=''};
 const onOri=e=>{if(e.beta==null&&e.gamma==null)return;live=true;if(!on)return;if(!base)base={b:e.beta||0,g:e.gamma||0};
  /* yavaşça yeni duruşa uyum: telefonu nasıl tutarsan tut, o an "düz" kabul edilir */
  base.b+=((e.beta||0)-base.b)*.02;base.g+=((e.gamma||0)-base.g)*.02;
  tx=clamp(((e.gamma||0)-base.g)/25,-1,1);ty=clamp(((e.beta||0)-base.b)/25,-1,1);if(!raf)raf=requestAnimationFrame(paint)};
 const start=()=>{if(on)return;on=true;R.classList.add('vt-tilt');addEventListener('deviceorientation',onOri);btn.hidden=true;try{localStorage.setItem('vy-tilt','1')}catch(e){}};
 /* iPhone izin ister (yalnız dokunmayla); Android doğrudan çalışır */
 const btn=D.createElement('button');btn.type='button';btn.className='vt-tiltbtn';btn.hidden=true;btn.innerHTML='<span aria-hidden="true">📱</span> Hareketi aç';btn.title='Telefonu eğince sahne hareket etsin';
 const hin=hero.querySelector('.lp-copy .lp-proof')||hero.querySelector('.lp-copy');if(hin)hin.after(btn);
 btn.addEventListener('click',async()=>{try{if(typeof DO.requestPermission=='function'){const r=await DO.requestPermission();if(r!=='granted'){btn.hidden=true;return}}start()}catch(e){btn.hidden=true}});
 if(!touch()||reduced())return;
 if(typeof DO.requestPermission=='function'){addEventListener('deviceorientation',onOri);setTimeout(()=>{if(live)start();else btn.hidden=false},900)}
 else start();
 P.tilt={start,state:()=>({on,x,y,tx,ty}),btn}});

/* 2) Dokunulan yerden renkli halkalar (ana sayfa; yazı alanlarında değil) */
safe('halkalar',()=>{let n=0;D.addEventListener('pointerdown',e=>{if(e.pointerType!='touch'||reduced()||!homeOn())return;if(e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]'))return;if(n>=6)return;
  const w=D.createElement('div');w.className='vt-tap';w.setAttribute('aria-hidden','true');w.style.cssText=`left:${e.clientX}px;top:${e.clientY}px`;w.innerHTML='<i></i><i></i><i></i>';D.body.appendChild(w);n++;setTimeout(()=>{w.remove();n--},900)},{passive:true})});

/* 3) Başlığa dokununca harfler dokunulan noktadan dalga gibi zıplar */
safe('başlık zıplaması',()=>{const h=D.querySelector('.lp-h1');if(!h)return;h.addEventListener('pointerdown',e=>{if(e.pointerType!='touch'||reduced())return;
  h.querySelectorAll('.cv-ch,.cv-em').forEach(c=>{const r=c.getBoundingClientRect(),d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));if(!c.animate)return;
   c.animate([{translate:'0 0'},{translate:'0 -.28em'},{translate:'0 .04em'},{translate:'0 0'}],{duration:620,delay:Math.min(500,d*1.6),easing:'cubic-bezier(.3,1.4,.5,1)'})})},{passive:true})});

/* 4) Kaydırırken ekranın ortasındaki kart öne çıkar */
safe('kart odağı',()=>{if(!touch()||!('IntersectionObserver' in window))return;const cards=[...D.querySelectorAll('#home .lp-card,#home .lp-ai,#home .lp-il li')];if(!cards.length)return;
 const io=new IntersectionObserver(es=>es.forEach(en=>en.target.classList.toggle('vt-focus',en.isIntersecting&&!reduced())),{rootMargin:'-42% 0px -42% 0px',threshold:0});cards.forEach(c=>io.observe(c));P.focus=cards});

/* 5) Hızlı kaydırınca başlıklar ve şerit hafifçe esner, sonra yaylı geri gelir */
safe('esneme',()=>{if(!touch())return;let ly=scrollY,lt=performance.now(),v=0,cur=0,raf=0;
 const els=()=>[...D.querySelectorAll('#home .lp-sh h2,#home .lp-end h2,#home .lp-marq')];
 const tick=()=>{raf=0;const tgt=reduced()||!homeOn()?0:clamp(v*.18,-3.5,3.5);cur+=(tgt-cur)*.18;v*=.86;
  const s=Math.abs(cur)<.02?'':`${cur.toFixed(2)}deg`;els().forEach(el=>{el.style.setProperty('--vt-skew',s||'0deg');el.classList.toggle('vt-sk',!!s)});
  if(Math.abs(cur)>.02||Math.abs(v)>.05)raf=requestAnimationFrame(tick);else els().forEach(el=>{el.style.removeProperty('--vt-skew');el.classList.remove('vt-sk')})};
 addEventListener('scroll',()=>{const t=performance.now(),dt=Math.max(8,t-lt);v=(scrollY-ly)/dt*16;ly=scrollY;lt=t;if(!raf)raf=requestAnimationFrame(tick)},{passive:true});P.skew={get:()=>cur}});

/* 6) Titreşim: destekleyen telefonlarda önemli düğmelerde (iPhone tarayıcısı desteklemez) */
safe('titreşim',()=>{if(!touch()||typeof navigator.vibrate!='function')return;const SEL='.lp-btn-p,#wgo,#hnew2,.adbox .b.pr,.adbox [data-ad=next],#rail .rg,#xbtn,.vt-tiltbtn,.cv-top';
 D.addEventListener('pointerdown',e=>{if(e.pointerType!='touch')return;const b=e.target.closest&&e.target.closest(SEL);if(!b||b.disabled)return;try{navigator.vibrate(b.matches('.lp-btn-p,#wgo')?[8,30,8]:8)}catch(x){}},{passive:true})});

window.v4touch={reduced,touch,parts:P};
})();
