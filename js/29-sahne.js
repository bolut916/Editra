/* =====================================================================
   SAHNE ANAHTARLARI: her açma-kapama küçük bir dünya
   1) Gök (tema): V tepeleri üzerinde gündüz → gün batımı → gece; güneş aya dönüşerek kayar
   2) Neon (animasyonlar): top yuvarlanır, açılınca mürekkep sıçrar, mor ışık akar
   3) Lamba (asistan): açılınca sıcak ışık yayılır, ışınlar döner
   4) Lomboz (açılış animasyonu): oval pencerede dalgalar, sallanan tekne, gece ↔ gündüz
   Hepsi gerçek bir ayarı değiştirir. Ayrıca sitedeki tüm anahtarlara mürekkep sıçraması ve yaylı iniş.
   Erişilebilir: role=switch / aria-checked, klavye ile çalışır; "Hareketi azalt"ta anında değişir.
   ===================================================================== */
(function(){
'use strict';
const D=document,R=D.documentElement,$=id=>D.getElementById(id);
const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)')}catch(e){return{matches:false}}})();
const reduced=()=>(RM.matches&&R.dataset.motion!='on')||R.dataset.motion=='reduce';
const safe=(n,f)=>{try{f()}catch(e){console.warn('sahne: '+n,e)}};
const has=()=>typeof CFG!='undefined';
const replay=(el,cls,ms)=>{if(!el)return;el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls);clearTimeout(el['_'+cls]);el['_'+cls]=setTimeout(()=>el.classList.remove(cls),ms)};
const P={list:[]};

/* ---------- sahne işaretlemeleri ---------- */
const HILLS='<svg class="sc-hills" viewBox="0 0 88 40" preserveAspectRatio="none" aria-hidden="true"><path class="h2" d="M0 40V30L18 26 30 32 52 22 70 31 88 27V40Z"/><path class="h1" d="M0 40V33L12 29 22 34 40 19 58 34 70 30 88 35V40Z"/></svg>';
const SCN={
 sky:()=>`<span class="sc-sky d"></span><span class="sc-sky k"></span><span class="sc-sky n"></span><span class="sc-stars">${'<i></i>'.repeat(7)}</span><span class="sc-cloud c1"></span><span class="sc-cloud c2"></span>${HILLS}<span class="sc-orb"><i></i><i></i><i></i></span>`,
 neon:()=>'<span class="sc-trk"><span class="sc-flow"></span></span><span class="sc-knob"><i></i></span>',
 lamp:()=>'<span class="sc-halo"></span><span class="sc-plate"><span class="sc-key"><svg viewBox="0 0 24 24" aria-hidden="true"><g class="rays"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></g><circle cx="12" cy="12" r="4.2"/></svg></span></span>',
 port:()=>`<span class="sc-win"><span class="sc-pd"></span><span class="sc-pn"></span><span class="sc-sun"></span><span class="sc-moon"></span><span class="sc-pst">${'<i></i>'.repeat(5)}</span><svg class="sc-waves" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true"><path class="w2" d="M0 10q12-6 25 0t25 0 25 0 25 0 25 0 25 0 25 0 25 0V24H0Z"/><path class="w1" d="M0 14q12-6 25 0t25 0 25 0 25 0 25 0 25 0 25 0 25 0V24H0Z"/></svg><svg class="sc-boat" viewBox="0 0 20 16" aria-hidden="true"><path class="hull" d="M2 11h16l-3 4H5Z"/><path class="sail" d="M10 1v9H4Z"/><path class="sail2" d="M11 3v7h5Z"/></svg></span>`};

/* ---------- ortak bileşen ---------- */
function make(kind,o,deco){const b=D.createElement(deco?'span':'button');if(!deco)b.type='button';b.className='sct sct-'+kind;b.innerHTML=SCN[kind]();
 if(deco)b.setAttribute('aria-hidden','true');else{if(kind!='sky')b.setAttribute('role','switch');b.setAttribute('aria-label',o.label)}
 const sync=()=>{const v=o.get();if(kind=='sky'){b.dataset.s=v;if(!deco)b.setAttribute('aria-label',o.label+': '+o.name(v))}else{b.dataset.on=v?'1':'0';b.setAttribute('aria-checked',v?'true':'false')}};
 if(!deco)b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();o.toggle(b);sync();if(!reduced()){replay(b,'sc-land',700);if(o.fx)o.fx(b)}});
 sync();const it={b,sync,kind};P.list.push(it);return it}
const syncAll=()=>P.list.forEach(x=>{try{x.sync()}catch(e){}});

/* mürekkep / kıvılcım parçacıkları */
function burst(host,opt){if(reduced())return;const r=host.getBoundingClientRect(),w=D.createElement('div');w.className='sc-burst'+(opt.cls?' '+opt.cls:'');w.setAttribute('aria-hidden','true');
 w.style.cssText=`left:${r.left+r.width*opt.x}px;top:${r.top+r.height*opt.y}px`;
 for(let i=0;i<(opt.n||10);i++){const s=D.createElement('i'),a=(opt.a0||0)+Math.random()*(opt.spread||6.283),d=(opt.d||22)+Math.random()*(opt.d||22);
  s.style.setProperty('--dx',(Math.cos(a)*d).toFixed(1)+'px');s.style.setProperty('--dy',(Math.sin(a)*d).toFixed(1)+'px');s.style.setProperty('--s',(.5+Math.random()*.9).toFixed(2));if(opt.col)s.style.background=opt.col[i%opt.col.length];w.appendChild(s)}
 D.body.appendChild(w);setTimeout(()=>w.remove(),900)}

/* ---------- ayarlara bağlantı ---------- */
const TH=['auto','light','dark'],TN={auto:'Otomatik (gün batımı)',light:'Açık (gündüz)',dark:'Koyu (gece)'},SV={auto:'dusk',light:'day',dark:'night'},NX={auto:'light',light:'dark',dark:'auto'};
/* tema: önce sahne dönüşür, sonra tıklanan noktadan dairesel açılımla tema değişir */
function themeGo(b){if(!has()||typeof cycleTheme!='function')return;const nx=NX[CFG.theme]||'light';b.dataset.s=SV[nx];
 const r=b.getBoundingClientRect();R.style.setProperty('--vx',(r.left+r.width/2)+'px');R.style.setProperty('--vy',(r.top+r.height/2)+'px');
 const run=()=>{if(!reduced()&&D.startViewTransition){try{D.startViewTransition(()=>cycleTheme());return}catch(e){}}cycleTheme()};
 if(reduced())run();else setTimeout(run,420)}
const motionOn=()=>has()&&!reduced();
const OPT={
 sky:{label:'Tema',get:()=>has()?SV[CFG.theme]||'dusk':'dusk',name:v=>({day:TN.light,dusk:TN.auto,night:TN.dark})[v],toggle:b=>themeGo(b)},
 neon:{label:'Animasyonlar',get:motionOn,toggle:()=>{if(!has())return;if(motionOn())CFG.motion=true;else CFG.motion=RM.matches?'on':false;try{cfgSave();applyCfg()}catch(e){}},
  fx:b=>{if(b.dataset.on=='1')burst(b,{x:.78,y:.5,n:14,d:18,col:['#b06bff','#ff5c9a','#5b4bff','#fff']});else burst(b,{x:.25,y:.5,n:9,d:14,cls:'ink'})}},
 lamp:{label:'Asistan balonu',get:()=>has()&&!!CFG.bot,toggle:()=>{if(!has())return;CFG.bot=!CFG.bot;try{cfgSave();applyCfg()}catch(e){}},fx:b=>{if(b.dataset.on=='1')burst(b,{x:.72,y:.5,n:10,d:16,col:['#ffd23f','#ffb347','#fff3b0']})}},
 port:{label:'Açılış animasyonu',get:()=>has()&&!!CFG.splash,toggle:()=>{if(!has())return;CFG.splash=!CFG.splash;try{cfgSave()}catch(e){}},fx:b=>{burst(b,{x:.5,y:.85,n:10,d:12,a0:Math.PI,spread:Math.PI,col:['#9fd4ff','#5aa8ff','#fff']})}}};

/* 1) Başlıktaki tema düğmesi gök sahnesi olur (applyCfg düğme yazısını silmesin diye sahne korunur) */
safe('başlık teması',()=>{const th=$('th2');if(!th)return;const it=make('sky',OPT.sky,true);it.b.classList.add('sct-mini');
 const mount=()=>{th.textContent='';th.appendChild(it.b);th.classList.add('sc-host');it.sync();th.setAttribute('aria-label','Tema: '+TN[(has()&&CFG.theme)||'auto'])};
 /* başlık düğmesinin kendi tıklaması sahneyi çalıştırır (çift tetiklenmesin) */
 th.onclick=e=>{e.preventDefault();themeGo(it.b);if(!reduced())replay(it.b,'sc-land',700)};
 const ap=window.applyCfg;if(typeof ap=='function')window.applyCfg=function(){if(it.b.parentNode)it.b.remove();const r=ap.apply(this,arguments);mount();syncAll();return r};
 mount();P.header=it});

/* 2) Ana sayfada "Hareket dili" bölümü: dört sahne anahtarı, her biri gerçek bir ayarı değiştirir */
safe('hareket dili',()=>{const before=$('lp-int');if(!before||$('lp-hareket'))return;const s=D.createElement('section');s.className='lp-sec vy-moves';s.id='lp-hareket';
 s.innerHTML='<div class="lp-sh vy-rv"><span class="lp-k">Hareket dili</span><h2>Her dokunuş <em>bir sahne.</em></h2><p>Vybble’da anahtarlar sadece açılıp kapanmaz; küçük bir dünya değişir. Bunlar süs değil: her biri gerçekten bir ayarı değiştirir.</p></div><div class="vy-mgrid"></div>';
 before.parentNode.insertBefore(s,before);const g=s.querySelector('.vy-mgrid');
 [['sky','Tema','Gündüz · gün batımı · gece','Güneş, V tepelerinin üzerinden aya dönüşerek kayar.'],['neon','Animasyonlar','Açık · kapalı','Top yuvarlanır, açılınca mürekkep sıçrar, mor ışık akar.'],['lamp','Asistan balonu','Göster · gizle','Açılınca sıcak bir ışık yayılır, ışınlar döner.'],['port','Açılış animasyonu','Açık · kapalı','Lombozdan bak: dalgalar akar, tekne sallanır, gece olur.']]
 .forEach(([k,t,sub,d],i)=>{const c=D.createElement('article');c.className='vy-mc vy-rv';c.style.setProperty('--i',i);const it=make(k,OPT[k]);
  c.innerHTML=`<div class="vy-mt"></div><b>${t}</b><small>${sub}</small><p>${d}</p>`;c.querySelector('.vy-mt').appendChild(it.b);g.appendChild(c)});
 const rv=[...s.querySelectorAll('.vy-rv')];if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.15});rv.forEach(x=>io.observe(x))}else rv.forEach(x=>x.classList.add('in'));
 const nav=D.querySelector('#home .lpn'),ref=nav&&nav.querySelector('a[href="#lp-int"]');if(ref&&!nav.querySelector('a[href="#lp-hareket"]')){const a=D.createElement('a');a.href='#lp-hareket';a.textContent='Hareket';ref.before(a)}
 P.section=s});

/* 3) Ayarlar başka yerden değişirse (Ayarlar penceresi vb.) sahneler kendini günceller */
safe('eşitleme',()=>{const cs=window.cfgSave;if(typeof cs=='function')window.cfgSave=function(){const r=cs.apply(this,arguments);setTimeout(syncAll,0);return r};
 new MutationObserver(syncAll).observe(R,{attributes:true,attributeFilter:['data-theme','data-motion']})});

/* 4) Sitedeki tüm anahtarlar: açılıp kapanınca mürekkep sıçrar, düğme yaylı iner */
safe('anahtarlar',()=>{D.addEventListener('change',e=>{const t=e.target;if(!t||t.type!='checkbox'||reduced())return;const r=t.getBoundingClientRect();if(!r.width)return;
 replay(t,'sw-land',500);burst(t,{x:t.checked?.75:.25,y:.5,n:8,d:10,col:t.checked?['#8b5cff','#ff5c9a','#5b4bff']:null,cls:t.checked?'':'ink'})})});

/* 5) Editör düğmeleri: açılıp kapanınca küçük bir "pop" */
safe('editör düğmeleri',()=>{const ed=$('edw');if(!ed)return;new MutationObserver(ms=>{if(reduced())return;ms.forEach(m=>{const t=m.target;if(t.matches&&t.matches('.top .ib,#mmenu .ib,#cbar .cbb')&&!t.closest('#rail'))replay(t,'ib-pop',450)})}).observe(ed,{subtree:true,attributes:true,attributeFilter:['aria-pressed']})});

window.v4scene={make,syncAll,reduced,parts:P};
})();
