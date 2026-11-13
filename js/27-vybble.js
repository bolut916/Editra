/* =====================================================================
   VYBBLE: marka hareketleri
   - V logosu: ilk görünüşte çizilir ve zıplar, üzerine gelince kollar esner, tıklayınca jöle,
     ana sayfada ara ara kendiliğinden "titreşir"
   - Ana sahnede imlece ve kaydırmaya tepki veren dev V
   - Yapay zekâ kutusunda örnek isteklerin yazılıp silinmesi
   - Alt bilgide dalgalanan vybble yazısı
   Her efekt ayrı korumalı blokta; "Hareketi azalt" açıkken hepsi durur.
   ===================================================================== */
(function(){
'use strict';
const D=document,R=D.documentElement,$=id=>D.getElementById(id);
const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)')}catch(e){return{matches:false}}})();
const reduced=()=>RM.matches||R.dataset.motion=='reduce';
const homeOn=()=>{const h=$('home');return!!h&&!h.hidden};
const safe=(n,f)=>{try{f()}catch(e){console.warn('vybble: '+n,e)}};
const replay=(el,cls,ms)=>{if(!el)return;el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls);clearTimeout(el['_t'+cls]);el['_t'+cls]=setTimeout(()=>el.classList.remove(cls),ms)};
const P={};

/* 1) Logo: ilk görünüşte çizim + zıplama (bir kez), tıklayınca jöle, ana sayfada ara ara titreşim */
safe('logo',()=>{const intro=v=>{if(!v||v.dataset.vin)return;v.dataset.vin=1;if(reduced())return;replay(v,'v-in',1700)};
 const scan=()=>D.querySelectorAll('.vlogo').forEach(v=>{if(v.getClientRects().length)intro(v)});
 let pend=false;const soon=()=>{if(pend)return;pend=true;requestAnimationFrame(()=>{pend=false;scan()})};
 scan();new MutationObserver(soon).observe(D.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
 D.addEventListener('click',e=>{const l=e.target.closest&&e.target.closest('.logo,#sp-logo');if(!l||reduced())return;replay(l.querySelector('.vlogo'),'v-jelly',900)},true);
 setInterval(()=>{if(reduced()||D.hidden||!homeOn())return;const v=D.querySelector('#hlg .vlogo');if(v&&!v.classList.contains('v-in'))replay(v,'v-vibe',1100)},7000);
 P.logo={scan}});

/* 2) Ana sahnede dev V: imlece doğru hafifçe kayar, kaydırdıkça kolları açılır */
safe('dev V',()=>{const hero=$('lph');if(!hero)return;const w=D.createElement('div');w.className='vy-big';w.setAttribute('aria-hidden','true');
 w.innerHTML='<svg viewBox="0 0 64 64"><path class="va" d="M15 12.5 32 51.5"/><path class="vb" d="M49 12.5 32 51.5"/></svg>';hero.insertBefore(w,hero.firstChild);
 let tx=0,ty=0,x=0,y=0,raf=0;const tick=()=>{raf=0;if(reduced()||!homeOn()){w.style.translate='';return}x+=(tx-x)*.08;y+=(ty-y)*.08;const s=Math.min(1,scrollY/(hero.offsetHeight||1));
  w.style.translate=`${x.toFixed(1)}px ${(y+s*60).toFixed(1)}px`;w.style.setProperty('--spread',(s*14).toFixed(2)+'deg');if(Math.abs(tx-x)+Math.abs(ty-y)>.3)raf=requestAnimationFrame(tick)};
 hero.addEventListener('pointermove',e=>{if(e.pointerType!='mouse')return;const r=hero.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*-40;ty=((e.clientY-r.top)/r.height-.5)*-30;if(!raf)raf=requestAnimationFrame(tick)},{passive:true});
 addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(tick)},{passive:true});P.big=w});

/* 3) Yapay zekâ kutusu: örnek istekler harf harf yazılıp silinir (kullanıcı yazarken durur) */
safe('yazan kutu',()=>{const inp=$('bqi');if(!inp)return;const base=inp.getAttribute('placeholder')||'';inp.setAttribute('aria-label',inp.getAttribute('aria-label')||base);
 const L=['Lüks kahve kataloğu','Minimal mimarlık dergisi','Yaz festivali afişi','Premium restoran menüsü','Moda lookbook kapağı','Yıllık rapor, kurumsal'];
 let i=0,j=0,del=false,tm=0,on=false;
 const step=()=>{tm=0;if(!on)return;if(reduced()||D.activeElement===inp||inp.value||!homeOn()){inp.setAttribute('placeholder',base);tm=setTimeout(step,1200);return}
  const t=L[i];if(!del){j++;inp.setAttribute('placeholder','Ya da yaz: “'+t.slice(0,j)+'▍');if(j>=t.length){del=true;tm=setTimeout(step,1500);return}tm=setTimeout(step,55+Math.random()*50)}
  else{j--;inp.setAttribute('placeholder','Ya da yaz: “'+t.slice(0,j)+'▍');if(j<=0){del=false;i=(i+1)%L.length;tm=setTimeout(step,350);return}tm=setTimeout(step,28)}};
 const start=()=>{if(on)return;on=true;step()},stop=()=>{on=false;clearTimeout(tm);inp.setAttribute('placeholder',base)};
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{es[0].isIntersecting?start():stop()}).observe(inp);else start();
 inp.addEventListener('focus',()=>inp.setAttribute('placeholder',base));P.typer={stop,start}});

/* 4) Alt bilgi: vybble yazısı harf harf dalgalanır */
safe('alt bilgi',()=>{const done=b=>{if(!b||b.dataset.vw)return;b.dataset.vw=1;const t=b.textContent;b.setAttribute('aria-label',t);b.textContent='';[...t].forEach((c,i)=>{const s=D.createElement('i');s.className='vw';s.textContent=c;s.style.setProperty('--i',i);s.setAttribute('aria-hidden','true');b.appendChild(s)})};
 const go=()=>D.querySelectorAll('.lp-foot .logo b,#hlg b').forEach(done);go();setTimeout(go,300)});

window.v4vybble={reduced,parts:P};
})();
