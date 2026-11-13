/* =====================================================================
   CANLI ARAYÜZ 2: ikinci hareket dalgası
   Her efekt ayrı korumalı blokta; "Hareketi azalt" açıkken sürekli/oynayan efektler durur.
   ===================================================================== */
(function(){
'use strict';
const D=document,R=D.documentElement,$=id=>D.getElementById(id);
const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)')}catch(e){return{matches:false}}})();
const reduced=()=>RM.matches||R.dataset.motion=='reduce';
const fine=()=>{try{return matchMedia('(hover: hover) and (pointer: fine)').matches}catch(e){return false}};
const homeOn=()=>{const h=$('home');return!!h&&!h.hidden};
const edOn=()=>{const e=$('edw');return!!e&&!e.hidden};
const safe=(n,f)=>{try{f()}catch(e){console.warn('canlı arayüz 2: '+n,e)}};
const replay=(el,cls)=>{if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)};
const P={};

/* 1) Ana sayfa giriş sahnesi: kaydırdıkça başlık hızlı, demo yavaş uzaklaşır (derinlik) */
safe('sahne',()=>{const hero=$('lph'),copy=D.querySelector('.lp-copy'),demo=$('lpdemo');if(!hero||!copy||!demo)return;let raf=0;
 const upd=()=>{raf=0;if(reduced()||!homeOn()){copy.style.translate='';copy.style.opacity='';demo.style.scale='';return}
  const h=hero.offsetHeight||1,y=Math.max(0,Math.min(1,scrollY/h));copy.style.translate=`0 ${(y*-70).toFixed(1)}px`;copy.style.opacity=(1-y*.85).toFixed(3);demo.style.scale=(1-y*.08).toFixed(4)};
 addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(upd)},{passive:true});upd();P.scene=upd});

/* 2) Harf çözme: menü bağlantıları üzerine gelince ve bölüm etiketleri görününce harfler karışıp yerine oturur */
safe('harf çözme',()=>{const G='ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789#*+';
 /* süreye dayalı (her cihazda 0,6 sn); ne olursa olsun sonunda metin aslına döner */
 const DUR=600,run=el=>{if(reduced()||el.dataset.scr=='1')return;const fin=el.dataset.orig||(el.dataset.orig=el.textContent),N=fin.length,t0=performance.now();el.dataset.scr='1';
  const done=()=>{el.textContent=fin;el.dataset.scr='0'},guard=setTimeout(done,DUR+400);
  const step=t=>{const k=(t-t0)/DUR;if(k>=1){clearTimeout(guard);done();return}let out='';for(let i=0;i<N;i++){const ch=fin[i];out+=ch==' '||k>i/N*.75+.2?ch:G[Math.random()*G.length|0]}el.textContent=out;requestAnimationFrame(step)};requestAnimationFrame(step)};
 D.querySelectorAll('#home .lpn a,#home .lp-foot nav a').forEach(a=>{a.setAttribute('aria-label',a.textContent);a.addEventListener('pointerenter',e=>{if(e.pointerType=='mouse')run(a)})});
 const ks=[...D.querySelectorAll('#home .lp-k')];ks.forEach(k=>k.setAttribute('aria-label',k.textContent));
 if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){run(en.target);io.unobserve(en.target)}}),{threshold:.6});ks.forEach(k=>io.observe(k))}
 P.scramble=run});

/* 3) Özellik kartları: 3D eğimle sırayla açılır */
safe('kart açılışı',()=>{D.querySelectorAll('#home .lp-grid,#home .lp-why,#home .lp-aig').forEach(g=>{[...g.children].forEach((c,i)=>{c.classList.add('cv-deal');c.style.setProperty('--di',i%8)})})});

/* 4) Ana düğmeye tıklayınca renkli parçacık patlaması */
safe('patlama',()=>{D.addEventListener('pointerdown',e=>{if(reduced()||e.button)return;const b=e.target.closest&&e.target.closest('#home .lp-btn-p');if(!b)return;
  const w=D.createElement('div');w.className='cv-burst';w.style.cssText=`left:${e.clientX}px;top:${e.clientY}px`;w.setAttribute('aria-hidden','true');
  for(let i=0;i<22;i++){const s=D.createElement('i'),a=Math.random()*6.283,d=40+Math.random()*90;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d-20+'px');s.style.setProperty('--r',(Math.random()*540-270|0)+'deg');s.style.setProperty('--h',[258,330,24,48,172][i%5]);if(i%3==0)s.className='sq';w.appendChild(s)}
  D.body.appendChild(w);setTimeout(()=>w.remove(),1100)},{passive:true})});

/* 5) Başa dön düğmesi: ilerleme halkası ile */
safe('başa dön',()=>{const b=D.createElement('button');b.type='button';b.className='cv-top';b.setAttribute('aria-label','Sayfanın başına dön');b.title='Başa dön';
 b.innerHTML='<svg viewBox="0 0 44 44" aria-hidden="true"><circle class="bg" cx="22" cy="22" r="19"/><circle class="fg" cx="22" cy="22" r="19"/><path d="M22 29V15M16 21l6-6 6 6"/></svg>';D.body.appendChild(b);
 const fg=b.querySelector('.fg'),L=2*Math.PI*19;fg.style.strokeDasharray=L;let raf=0;
 const upd=()=>{raf=0;const max=D.documentElement.scrollHeight-innerHeight,y=max>0?scrollY/max:0;fg.style.strokeDashoffset=(L*(1-y)).toFixed(1);b.classList.toggle('on',homeOn()&&scrollY>innerHeight*.9)};
 addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(upd)},{passive:true});
 b.addEventListener('click',()=>scrollTo({top:0,behavior:reduced()?'auto':'smooth'}));
 const h=$('home');if(h)new MutationObserver(upd).observe(h,{attributes:true,attributeFilter:['hidden']});upd();P.top=b});

/* 6) Panel sekmeleri: içerik, sekmenin yönüne göre kayarak gelir */
safe('panel kayması',()=>{const tabs=$('dtabs');if(!tabs)return;let last=+(tabs.querySelector('[aria-selected=true]')||{dataset:{dt:1}}).dataset.dt;
 new MutationObserver(()=>{const a=tabs.querySelector('[aria-selected=true]');if(!a)return;const i=+a.dataset.dt;if(i===last)return;const dir=i>last?1:-1;last=i;if(reduced())return;
  const box=i==3?$('rp'):$('pn');if(!box||!box.animate)return;box.animate([{opacity:0,transform:`translateX(${dir*22}px)`},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.85,.2,1)'})}).observe(tabs,{subtree:true,attributes:true,attributeFilter:['aria-selected']})});

/* 7) Seçim: yeni bir öğe seçilince seçim kutusu "pop" yapar; bağlam çubuğu sırayla belirir */
safe('seçim',()=>{if(typeof render!='function')return;const r0=window.render;let lastSel=null,lastBar='';
 window.render=function(){const out=r0.apply(this,arguments);try{if(typeof S!='undefined'&&S.sel!==lastSel){lastSel=S.sel;if(S.sel!=null&&!reduced()){const sb=D.querySelector('#cv .sbox');if(sb)replay(sb,'cv-pop')}}}catch(e){}return out};
 const cb=$('cbar');if(cb)new MutationObserver(()=>{const k=(typeof S!='undefined'?S.sel:'')+'|'+(typeof SDK!='undefined'?SDK.tool:'')+'|'+cb.childElementCount;if(k===lastBar)return;lastBar=k;if(reduced())return;
  [...cb.children].slice(0,14).forEach((c,i)=>{if(c.animate)c.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:260,delay:i*22,easing:'cubic-bezier(.2,.85,.2,1)',fill:'backwards'})})}).observe(cb,{childList:true})});

/* 8) Yakınlaştırma yüzdesi sayarak değişir */
safe('yakınlaştırma',()=>{const z=$('zlab');if(!z)return;let busy=false,cur=parseInt(z.textContent)||100,raf=0;
 new MutationObserver(()=>{if(busy)return;const tgt=parseInt(z.textContent);if(!isFinite(tgt)||tgt===cur)return;if(reduced()){cur=tgt;return}const from=cur,t0=performance.now();cancelAnimationFrame(raf);
  const step=t=>{const k=Math.min(1,(t-t0)/260),e=1-Math.pow(1-k,3),v=Math.round(from+(tgt-from)*e);busy=true;z.textContent=v+'%';busy=false;cur=v;if(k<1)raf=requestAnimationFrame(step);else{cur=tgt;busy=true;z.textContent=tgt+'%';busy=false}};raf=requestAnimationFrame(step)}).observe(z,{childList:true,characterData:true,subtree:true})});

/* 9) Kaydedildi: tik işareti çizilir */
safe('kaydedildi',()=>{const sv=$('sv');if(!sv)return;let was='';new MutationObserver(()=>{const t=sv.textContent||'';const ok=t.startsWith('✓');if(ok&&!was.startsWith('✓')&&!reduced())replay(sv,'cv-saved');was=t}).observe(sv,{childList:true,characterData:true,subtree:true})});

/* 10) Geri al / yinele: simge döner */
safe('geri al',()=>{[['un',-1],['re',1]].forEach(([id,d])=>{const b=$(id);if(!b)return;b.addEventListener('click',()=>{if(!reduced())replay(b,d<0?'cv-spinl':'cv-spinr')})})});

/* 11) Yeni artboard belirir (ekleme, kopyalama) */
safe('artboard girişi',()=>{const seen=new WeakSet();let ready=false;const cvp=D.querySelector('#cvw .cvp');if(!cvp)return;
 const scan=()=>{if(typeof PROJ=='undefined'||!PROJ||!PROJ.pages)return;const h=$('abh');if(!h)return;
  PROJ.pages.forEach((p,i)=>{if(seen.has(p))return;seen.add(p);if(!ready||reduced())return;const o=h.querySelector(`.abo[data-i="${i}"]`)||(i==PROJ.cur?$('cv'):null),t=h.querySelector(`.abt[data-i="${i}"]`);
   [o,t].forEach(x=>{if(x&&x.animate)x.animate([{opacity:0,transform:'translateY(18px) scale(.94)'},{opacity:1,transform:'none'}],{duration:480,easing:'cubic-bezier(.3,1.35,.45,1)'})})})};
 new MutationObserver(()=>requestAnimationFrame(scan)).observe(cvp,{childList:true,subtree:true});
 const ed=$('edw');if(ed)new MutationObserver(()=>{if(!ed.hidden){ready=false;requestAnimationFrame(()=>{scan();ready=true})}}).observe(ed,{attributes:true,attributeFilter:['hidden']});
 setTimeout(()=>{scan();ready=true},400)});

/* 12) Bildirim: süreyi gösteren çubuk her bildirimde yeniden başlar */
safe('bildirim',()=>{const t0=window.toast;if(typeof t0!='function')return;window.toast=function(){const r=t0.apply(this,arguments);if(!reduced())replay($('toast'),'cv-tb');return r}});

/* 13) Asistan düğmesi ve sohbet penceresi */
safe('asistan',()=>{const c=$('chat');if(!c)return;new MutationObserver(()=>{if(!c.hidden&&!reduced()&&c.animate)c.animate([{opacity:0,transform:'translateY(16px) scale(.96)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.3,1.3,.45,1)',transformOrigin:'bottom right'})}).observe(c,{attributes:true,attributeFilter:['hidden']})});

window.v4live2={reduced,parts:P};
})();
