/* =====================================================================
   KATEGORİ SAHNELERİ: her kategori (Dergi, Katalog, Broşür, Kapak, Afiş,
   Kartvizit, Menü, Sosyal medya) altı farklı hareketli galeride gezilir:
   01 Klasör       kapak klasörden dışarı çıkar
   02 Ayraç        yaylı yükselen ayraç kartlar, akan şeritler
   03 Yay          yay üzerinde dizilen kartlar, ortadaki öne çıkar
   04 Halka        kendi kendine dönen 3B kart halkası
   05 Spot         ortadaki kart büyür, yanlar geri çekilir
   06 Çember       fırlatılabilen 3B kart çemberi, çift dokunuşla yakınlaşır
   Kartlar gerçek şablonlara ve yeni tasarım sihirbazına bağlıdır.
   Döngüler yalnız bölüm ekrandayken çalışır; "Hareketi azalt" açıkken
   hiçbir şey kendiliğinden oynamaz, oklar ve noktalarla gezilir.
   ===================================================================== */
(function(){
'use strict';
const D=document,R=D.documentElement,$=id=>D.getElementById(id);
const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)')}catch(e){return{matches:false}}})();
const reduced=()=>(RM.matches&&R.dataset.motion!='on')||R.dataset.motion=='reduce';
const FINE=(()=>{try{return matchMedia('(hover: hover) and (pointer: fine)')}catch(e){return{matches:false}}})();
const homeOn=()=>{const h=$('home');return!!h&&!h.hidden};
const safe=(n,f)=>{try{return f()}catch(e){console.warn('kategori: '+n,e)}};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrap=(d,n)=>{d=((d%n)+n)%n;return d>=n/2?d-n:d};
const norm=a=>{a=((a+180)%360+360)%360-180;return a};

/* ---------- veriler ---------- */
const pal=n=>{try{if(typeof palBy=='function')return palBy(n)}catch(e){}return['','#f4f1ea','#111111','#e63946']};
const font=i=>{try{if(typeof STY!='undefined'&&STY[i])return STY[i].t}catch(e){}return'Inter'};
const kind=k=>{try{if(typeof KINDS!='undefined')return KINDS.find(x=>x[0]==k)}catch(e){}return null};
const SYN={
 dergi:[['KÜLTÜR\nSANAT','Sayı 03 · Bahar','Lavanta',0,'Kültür sanat dergisi'],['YOLCU','Seyahat ve keşif','Okyanus',9,'Seyahat dergisi'],['MEKÂN','Mimarlık ve iç mekân','Mono',7,'Mimarlık dergisi'],['SOFRA','Yemek kültürü','Şeftali',5,'Yemek dergisi'],['EVREN','Popüler bilim','Siber',4,'Bilim dergisi'],['RİTİM','Müzik ve sahne','Neon',3,'Müzik dergisi'],['DOKU','Kumaş ve zanaat','Çöl',2,'Zanaat dergisi']],
 katalog:[['MOBİLYA','Koleksiyon 2026','Çöl',7,'Mobilya kataloğu'],['SERAMİK','El yapımı ürünler','Toprak',5,'Seramik kataloğu'],['KOZMETİK','Doğal bakım','Nane',7,'Kozmetik kataloğu'],['DERİ','Çanta atölyesi','Çikolata',2,'Deri ürün kataloğu'],['BAHÇE','Bitki ve tohum','Orman',9,'Bahçe kataloğu'],['TEKSTİL','Ev tekstili','Kâğıt',0,'Tekstil kataloğu'],['IŞIK','Aydınlatma','Gece',4,'Aydınlatma kataloğu']],
 brosur:[['KLİNİK','Sağlık hizmetleri','Buz',1,'Klinik broşürü'],['AKADEMİ','Eğitim programları','Kobalt',9,'Eğitim broşürü'],['OTEL','Konaklama ve spa','Altın',2,'Otel broşürü'],['FESTİVAL','Etkinlik programı','Güneş',6,'Festival broşürü'],['YENİ\nPROJE','Gayrimenkul','Lacivert',1,'Proje broşürü'],['YOGA','Stüdyo dersleri','Nane',7,'Stüdyo broşürü'],['KAFE','Açılış haftası','Kâğıt',5,'Kafe broşürü']],
 kapak:[['KIŞ\nSAYISI','Dergi kapağı','Buz',0,'Kış sayısı kapağı'],['RAPOR\n2026','Yıllık rapor','Mono',1,'Rapor kapağı'],['DENİZ','Şiir kitabı','Okyanus',5,'Şiir kitabı kapağı'],['GECE','Single kapağı','Bordo',3,'Single kapağı'],['ATLAS','Gezi kitabı','Çöl',9,'Gezi kitabı kapağı'],['SES','Podcast kapağı','Lavanta',4,'Podcast kapağı'],['TOPRAK','Fotoğraf albümü','Toprak',2,'Albüm kapağı']],
 afis:[['SERGİ','Çağdaş sanat','Mürekkep',1,'Sergi afişi'],['MARATON','Şehir koşusu','Neon',8,'Koşu afişi'],['TİYATRO','Yeni oyun','Bordo',0,'Tiyatro afişi'],['CAZ','Açık hava gecesi','Lacivert',2,'Caz gecesi afişi'],['PAZAR','Yerel üretici','Limon',6,'Pazar afişi'],['SİNEMA','Yazlık gösterim','Güneş',3,'Sinema afişi'],['DANS','Atölye haftası','Pembe pop',6,'Dans afişi']],
 kartvizit:[['AYŞE\nYILMAZ','Mimar','Mono',7,'Mimar kartviziti'],['STÜDYO\nNOKTA','Tasarım ofisi','Gece',4,'Stüdyo kartviziti'],['DR. CAN','Diş hekimi','Buz',1,'Klinik kartviziti'],['ATÖLYE','Seramik','Toprak',5,'Atölye kartviziti'],['ŞEF EMRE','Özel aşçı','Kömür',3,'Şef kartviziti'],['BUTİK','Moda evi','Altın',2,'Butik kartviziti'],['HUKUK','Avukatlık bürosu','Lacivert',0,'Hukuk kartviziti']],
 menu:[['KAHVALTI','Serpme ve tabaklar','Şeftali',5,'Kahvaltı menüsü'],['MEZE','Akşam sofrası','Bordo',0,'Meze menüsü'],['PİZZA','Taş fırın','Mercan',3,'Pizza menüsü'],['KOKTEYL','Bar menüsü','Neon',4,'Kokteyl menüsü'],['TATLI','Pastane','Tatlı',6,'Pastane menüsü'],['VEGAN','Bitkisel mutfak','Zeytin',9,'Vegan menü'],['KAHVE','Demleme listesi','Çikolata',7,'Kahve menüsü']],
 sosyal:[['İNDİRİM','Hafta sonu kampanyası','Güneş',3,'Kampanya paylaşımı'],['YENİ\nÜRÜN','Lansman','Siber',4,'Lansman paylaşımı'],['ETKİNLİK','Duyuru','Lavanta',6,'Etkinlik duyurusu'],['ALINTI','Günün sözü','Kâğıt',0,'Alıntı paylaşımı'],['TARİF','Adım adım','Şeftali',5,'Tarif paylaşımı'],['ANKET','Story','Pembe pop',6,'Story anketi'],['ÇEKİLİŞ','Takipçilere','Mercan',8,'Çekiliş paylaşımı']]};
/* her kategoriye özel, uygulamada gerçekten bulunan özellikler */
const OWN={
 dergi:[['Akan metin','Yazı sayfadan sayfaya kendiliğinden taşar.'],['Flipbook','Dergiyi sayfa çevirerek okut.']],
 katalog:[['CSV’den katalog','Ürün listesinden sayfaları üret.'],['Toplu görsel','Onlarca ürünü tek seferde yerleştir.']],
 brosur:[['Çok sayfalı akış','Ön ve arka yüz aynı dosyada.'],['QR kod','Basılı broşürden web sayfasına.']],
 kapak:[['Otomatik tasarım','Görselinden kapak düzeni kurulur.'],['Yazı tipi eşleri','Başlık ve metin uyumlu seçilir.']],
 afis:[['Büyük boy','A0’a kadar, billboard dahil.'],['Kesim işaretleri','Matbaaya hazır taşma payı.']],
 kartvizit:[['600 dpi','İnce yazılar bile keskin basılır.'],['Ön ve arka','İki yüz, tek dosya.']],
 menu:[['Fiyat satırları','Noktalı fiyat listeleri hazır.'],['QR menü','Masadaki QR ile dijital menü.']],
 sosyal:[['PNG paketi','Tüm kareleri sırayla kaydet.'],['Story boyu','9:16, 4:5, kare ve yatay.']]};
const COMMON=[['CMYK PDF','Taşma payı ve kesim işaretleriyle.'],['Artboard','Tüm sayfalar tuvalde yan yana.'],['Cihazında','Hesap yok; çalışmaların tarayıcında.'],['Tek dosya yedek','Başka cihaza kolayca taşı.'],['İnteraktif yayın','Video, harita ve form göm.']];
const ORDER=['dergi','katalog','brosur','kapak','afis','kartvizit','menu','sosyal'];
const HUE={dergi:'#c2410c',katalog:'#8a5a2b',brosur:'#2563eb',kapak:'#7c3aed',afis:'#e11d48',kartvizit:'#334155',menu:'#b45309',sosyal:'#db2777'};

const item=(t,s,p,st,name,tpl)=>{const P=pal(p);return{t,s,p:P,f:font(st),name,tpl}};
const CAT={};
function buildCats(){ORDER.forEach(k=>{const K=kind(k);if(!K)return;const its=[];
 try{if(typeof TPLS!='undefined')TPLS.forEach((t,i)=>{if(t.k==k)its.push(item(t.t[0],(t.s||[''])[0],t.pal,t.st,t.name,i))})}catch(e){}
 (SYN[k]||[]).forEach(x=>{if(its.length<8)its.push(item(x[0],x[1],x[2],x[3],x[4],null))});
 const fm=K[4].map(f=>f[1]);
 CAT[k]={k,n:K[1],e:K[2],dpi:K[6],fm,items:its.slice(0,8),hue:HUE[k]||'#6c47ff',
  feats:[...(OWN[k]||[]),['Hazır boyutlar',fm.slice(0,3).join(' · ')],...COMMON]}})}

const go=(c,it)=>{try{if(it&&it.tpl!=null&&typeof tplGo=='function')return tplGo(it.tpl);if(typeof openWiz=='function')openWiz(c.k)}catch(e){console.warn('kategori: aç',e)}};
const cov=(it,cls)=>`<span class="kt-cv${cls?' '+cls:''}" style="--cb:${it.p[1]};--ct:${it.p[2]};--ca:${it.p[3]};--cf:'${it.f}'" aria-hidden="true"><u></u><b>${esc(it.t).replace(/\n/g,'<br>')}</b><em>${esc(it.s)}</em></span>`;

/* ---------- sürükleme yardımcısı: yatay sürükleme, dikey kaydırma serbest ---------- */
function drag(el,o){let id=null,x0=0,y0=0,lx=0,lt=0,on=false,moved=false,v=0;
 el.addEventListener('pointerdown',e=>{if(e.button)return;id=e.pointerId;x0=lx=e.clientX;y0=e.clientY;lt=performance.now();on=false;moved=false;v=0;o.down&&o.down(e)});
 el.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;const dx=e.clientX-x0,dy=e.clientY-y0;
  if(!on){if(Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy)){on=moved=true;try{el.setPointerCapture(id)}catch(x){}el.classList.add('kt-drag');o.start&&o.start(e)}else if(Math.abs(dy)>10){id=null;return}else return}
  const t=performance.now(),ddx=e.clientX-lx;v=ddx/Math.max(8,t-lt)*16;lx=e.clientX;lt=t;o.move&&o.move(ddx,dx,e)});
 const end=e=>{if(e.pointerId!==id)return;id=null;if(on){on=false;el.classList.remove('kt-drag');o.end&&o.end(v,e)}};
 el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
 /* sürüklemenin sonundaki tıklama bir karta "tık" sayılmasın */
 el.addEventListener('click',e=>{if(moved){moved=false;e.stopPropagation();e.preventDefault()}},true);
 return{dragging:()=>on}}

/* ---------- 1) Klasör ---------- */
const M={};
M.folder={title:'Klasör',hint:'Kartın üzerine gel ya da dokun',build(el,c){const sk=['ind','por','onx'];
 el.innerHTML='<div class="kf-row">'+c.items.slice(0,3).map((x,i)=>`<article class="kf kf-${sk[i]} kt-it" tabindex="0" style="--i:${i}" aria-label="${esc(x.name)}"><div class="kf-art">${cov(x)}</div><div class="kf-body"><i class="kf-tab" aria-hidden="true"></i><span class="kf-n">0${i+1}</span><button type="button" class="kf-go" data-go="${i}" aria-label="${esc(x.name)} ile başla">↗</button><h4>${esc(x.name)}</h4><p>${esc(c.n)} · ${esc(x.s)}</p></div></article>`).join('')+'</div>';
 const cards=[...el.querySelectorAll('.kf')];
 el.onclick=e=>{const b=e.target.closest('[data-go]');if(b){go(c,c.items[+b.dataset.go]);return}const k=e.target.closest('.kf');if(!k)return;
  if(FINE.matches){go(c,c.items[cards.indexOf(k)]);return}
  const was=k.classList.contains('on');cards.forEach(x=>x.classList.remove('on'));if(!was)k.classList.add('on');else go(c,c.items[cards.indexOf(k)])};
 el.onkeydown=e=>{const k=e.target.closest&&e.target.closest('.kf');if(k&&(e.key=='Enter'||e.key==' ')&&e.target===k){e.preventDefault();go(c,c.items[cards.indexOf(k)])}}}};

/* ---------- 2) Ayraç ---------- */
const wave=(j,h)=>{let d='';for(let x=0;x<=400;x+=10){const y=60+Math.sin(x/200*6.2832+j*.42)*(14+j*1.6)+Math.sin(x/100*6.2832+j)*3;d+=(x?'L':'M')+x+' '+y.toFixed(1)}return`<path d="${d}" style="--j:${j}"/>`};
M.mark={title:'Ayraç',hint:'Kartın üzerine gel ya da dokun',build(el,c){
 const L=[[`— ${c.n} boyutları°`,`${c.fm.slice(0,3).join(', ')}${c.fm.length>3?' ve dahası':''}.`,`${c.fm.length} boyut.`],
  ['— Baskı°',`${c.dpi} dpi önerilen çözünürlük, matbaaya hazır.`,`${c.dpi} dpi.`],
  ['— Otomatik°','Görsellerini yükle, düzeni Vybble kursun.','Tek tık.']];
 const hs=[c.items[0],c.items[1]||c.items[0],c.items[2]||c.items[0]].map(x=>x.p[3]);
 el.innerHTML='<div class="km-row">'+L.map((l,i)=>`<article class="km kt-it" tabindex="0" style="--i:${i};--h:${hs[i]}"><span class="km-tab" aria-hidden="true"></span><span class="km-lab">${esc(l[0])}</span><div class="km-art"><svg viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true"><g class="km-w">${[0,1,2,3,4,5,6,7,8,9,10,11].map(j=>wave(j)).join('')}</g></svg><p>${esc(l[1])}</p></div><b class="km-big">${esc(l[2])}</b><span class="km-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="km-tail" aria-hidden="true"></span></article>`).join('')+'</div>';
 const cards=[...el.querySelectorAll('.km')];
 el.onclick=e=>{const k=e.target.closest('.km');if(!k)return;if(FINE.matches){go(c,null);return}const was=k.classList.contains('on');cards.forEach(x=>x.classList.remove('on'));if(!was)k.classList.add('on');else go(c,null)};
 el.onkeydown=e=>{if((e.key=='Enter'||e.key==' ')&&e.target.classList&&e.target.classList.contains('km')){e.preventDefault();go(c,null)}};
 /* imleç sanat alanında gezinince şeritler hafifçe izler */
 cards.forEach(k=>k.addEventListener('pointermove',e=>{if(e.pointerType!='mouse'||reduced())return;const r=k.getBoundingClientRect();k.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));k.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3))}));
 cards.forEach(k=>k.addEventListener('pointerleave',()=>{k.style.removeProperty('--mx');k.style.removeProperty('--my')}))}};

/* ---------- ortak: oklu, noktalı, sürüklenebilir dizi (Yay ve Spot) ---------- */
function slider(el,c,o){const N=c.items.length;let a=0,prev=new Array(N).fill(null),acc=0;
 el.innerHTML=`<div class="${o.cls}-sc">`+c.items.map((x,i)=>`<button type="button" class="${o.cls}-c kt-it" data-i="${i}" aria-label="${esc(x.name)}" style="--i:${i}">${cov(x)}${o.over?o.over(x):''}</button>`).join('')+`</div>
  <div class="${o.cls}-cap"><button type="button" class="kt-ar" data-d="-1" aria-label="Önceki"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6 8.5 12l6 6"/></svg></button><div class="${o.cls}-txt" aria-live="polite"><h4></h4><p></p></div><button type="button" class="kt-ar" data-d="1" aria-label="Sonraki"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6"/></svg></button></div>
  <div class="kt-dots" role="tablist" aria-label="Kartlar">${c.items.map((x,i)=>`<button type="button" role="tab" data-dot="${i}" aria-label="${i+1}. kart: ${esc(x.name)}"></button>`).join('')}</div>`;
 const cards=[...el.querySelectorAll(`.${o.cls}-c`)],dots=[...el.querySelectorAll('[data-dot]')],h4=el.querySelector(`.${o.cls}-txt h4`),p=el.querySelector(`.${o.cls}-txt p`),txt=h4.parentNode;
 const lay=()=>{const W=el.clientWidth;if(!W)return;cards.forEach((cd,i)=>{const d=wrap(i-a,N);
   if(prev[i]!=null&&Math.abs(d-prev[i])>N/2-.5){cd.style.transition='none';requestAnimationFrame(()=>requestAnimationFrame(()=>cd.style.transition=''))}prev[i]=d;
   o.place(cd,d,W,el);cd.classList.toggle('on',d===0);cd.setAttribute('aria-current',d===0?'true':'false');cd.tabIndex=d===0?0:-1});
  dots.forEach((b,i)=>{b.setAttribute('aria-selected',i===a?'true':'false');b.classList.toggle('on',i===a)})};
 const cap=()=>{const x=c.items[a];h4.textContent=x.name;p.textContent=c.n+' · '+x.s;if(!reduced()){txt.classList.remove('kt-capin');void txt.offsetWidth;txt.classList.add('kt-capin')}};
 const set=(i,user)=>{i=((i%N)+N)%N;if(i===a&&!user)return;const ch=i!==a;a=i;lay();if(ch)cap();if(user)o.touched&&o.touched()};
 el.onclick=e=>{const ar=e.target.closest('[data-d]');if(ar){set(a+ +ar.dataset.d,1);return}const dt=e.target.closest('[data-dot]');if(dt){set(+dt.dataset.dot,1);return}
  const go1=e.target.closest('[data-start]');if(go1){go(c,c.items[a]);return}
  const cd=e.target.closest(`.${o.cls}-c`);if(!cd)return;const i=+cd.dataset.i;if(i===a)go(c,c.items[a]);else set(i,1)};
 el.tabIndex=0;el.onkeydown=e=>{if(e.key=='ArrowLeft'){e.preventDefault();set(a-1,1)}else if(e.key=='ArrowRight'){e.preventDefault();set(a+1,1)}};
 drag(el,{start:()=>{acc=0},move:dd=>{acc+=dd;const step=clamp(el.clientWidth*.14,46,90);while(acc>step){acc-=step;set(a-1,1)}while(acc<-step){acc+=step;set(a+1,1)}}});
 cap();lay();return{lay,set,get:()=>a,N}}

/* ---------- 3) Yay ---------- */
M.arc={title:'Yay',hint:'Sürükle, karta dokun ya da okları kullan',build(el,c){
 const s=slider(el,c,{cls:'ka',place(cd,d,W){const cw=clamp(W*.2,84,138),Rr=clamp(W*.58,200,470),sp=clamp(34-W/40,18,26),th=d*sp,rad=th*Math.PI/180;
  const x=Math.sin(rad)*Rr,y=(1-Math.cos(rad))*Rr*.92,sc=d===0?1.32:.86,far=Math.abs(d)>3;
  cd.style.setProperty('--cw',cw+'px');cd.style.transform=`translate(-50%,0) translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${th.toFixed(2)}deg) scale(${sc})`;
  cd.style.opacity=far?'0':d===0?'1':(1-Math.abs(d)*.06).toFixed(2);cd.style.zIndex=20-Math.abs(d);cd.style.pointerEvents=far?'none':'';el.style.setProperty('--cw',cw+'px')}});
 el.querySelector('.ka-txt').insertAdjacentHTML('beforeend','<button type="button" class="kt-pill" data-start>Bununla başla</button>');return s}};

/* ---------- 5) Spot ---------- */
M.spot={title:'Spot',hint:'Fotoğrafa dokun, sürükle ya da noktaları kullan',build(el,c){let last=0,hover=false;
 const s=slider(el,c,{cls:'ks',over:x=>`<span class="ks-ov"><b>${esc(x.name)}</b><small>${esc(c.n)} · ${esc(x.s)}</small><span class="kt-pill" aria-hidden="true">Bununla başla →</span></span>`,
  touched:()=>{last=performance.now()},
  place(cd,d,W){const cw=clamp(W*.36,150,236),sw=cw*.74,gap=clamp(W*.012,4,10);let x=0;if(d){const sg=Math.sign(d),k=Math.abs(d);x=sg*(cw/2+sw/2+gap+(k-1)*(sw*.86+gap))}
   const far=Math.abs(d)>2;cd.style.setProperty('--cw',cw+'px');cd.style.transform=`translate(-50%,-50%) translateX(${x.toFixed(1)}px) scale(${d?.74:1})`;
   cd.style.zIndex=10-Math.abs(d);cd.style.opacity=far?'0':'1';cd.style.pointerEvents=far?'none':'';cd.style.setProperty('--dim',d?'.58':'0')}});
 el.addEventListener('pointerenter',e=>{if(e.pointerType=='mouse')hover=true});el.addEventListener('pointerleave',()=>{hover=false});
 s.tick=t=>{if(hover||reduced())return;if(!last)last=t;if(t-last>4800){last=t;s.set(s.get()+1)}};return s}};

/* ---------- 4) Halka ---------- */
M.ring={title:'Halka',hint:'Sürükleyip çevir',anim:true,build(el,c){const N=12,step=360/N;
 const cards=[];for(let i=0;i<N;i++){const x=c.items[i%c.items.length],f=c.feats[i%c.feats.length],ty=i%3;
  cards.push(ty==0?`<button type="button" class="kh-c kh-w" data-i="${i}" aria-label="${esc(x.name)}"><b>${esc(x.name)}</b><small>${esc(c.n)} · ${esc(x.s)}</small>${cov(x,'kh-mini')}</button>`
   :ty==1?`<button type="button" class="kh-c kh-d" data-i="${i}" aria-label="${esc(f[0])}"><p>${esc(f[1])}</p><span class="kh-who"><i>${esc(c.e)}</i><b>${esc(f[0])}</b><small>Vybble · ${esc(c.n)}</small></span></button>`
   :`<button type="button" class="kh-c kh-a" data-i="${i}" aria-label="${esc(f[0])}"><i class="kh-dot" aria-hidden="true"></i><b>${esc(f[0])}</b><small>${esc(f[1])}</small></button>`)}
 el.innerHTML=`<div class="kh-sc"><div class="kh-ring">${cards.join('')}</div></div>`;
 const ring=el.querySelector('.kh-ring'),cs=[...ring.children];let spin=0,v=0,last=0,Rr=200,idle=0,tilt=-8,ttilt=-8;
 const lay=()=>{const W=el.clientWidth;if(!W)return;const w=clamp(W*.17,84,132);Rr=N*w*1.1/(2*Math.PI);el.style.setProperty('--w',w+'px');cs.forEach((cd,i)=>{cd.style.transform=`rotateY(${i*step}deg) translateZ(${Rr.toFixed(1)}px)`});paint()};
 const paint=()=>{ring.style.transform=`translateZ(${(-Rr).toFixed(1)}px) rotateX(${tilt.toFixed(2)}deg) rotateY(${spin.toFixed(2)}deg)`;
  cs.forEach((cd,i)=>{const r=Math.abs(norm(i*step+spin));cd.style.opacity=r<=113?'1':(1-(r-113)/67*.62).toFixed(3);cd.classList.toggle('kh-front',r<step/2)})};
 const dg=drag(el,{start:()=>{v=0},move:dd=>{spin+=dd*.32;paint()},end:vv=>{v=reduced()?0:clamp(vv*.32,-14,14);idle=performance.now()}});
 el.addEventListener('pointermove',e=>{if(e.pointerType!='mouse')return;const r=el.getBoundingClientRect();ttilt=-8+((e.clientY-r.top)/r.height-.5)*-8},{passive:true});
 el.addEventListener('pointerleave',()=>{ttilt=-8});
 el.onclick=e=>{const cd=e.target.closest('.kh-c');if(!cd)return;const i=+cd.dataset.i;go(c,i%3==0?c.items[i%c.items.length]:null)};
 el.tabIndex=0;el.onkeydown=e=>{if(e.key=='ArrowLeft'){e.preventDefault();spin+=step;paint()}else if(e.key=='ArrowRight'){e.preventDefault();spin-=step;paint()}};
 lay();
 return{lay,tick:(t,dt)=>{if(dg.dragging())return true;let moving=false;
   if(Math.abs(v)>.02){spin+=v*dt/16;v*=Math.pow(.94,dt/16);moving=true}else if(!reduced()&&t-idle>1200){spin-=6*dt/1000;moving=true}
   if(Math.abs(ttilt-tilt)>.01){tilt+=(ttilt-tilt)*.08;moving=true}if(moving)paint();return moving}}}};

/* ---------- 6) Çember ---------- */
M.loop={title:'Çember',hint:'Fırlat, çift dokunuşla yakınlaş',anim:true,build(el,c){const N=24,step=360/N;
 const cs=[];for(let i=0;i<N;i++){const x=c.items[i%c.items.length],v=(i/c.items.length|0);
  cs.push(`<button type="button" class="kc-c" data-i="${i}" aria-label="${esc(x.name)}" style="--cb:${x.p[v==1?2:1]};--ca:${x.p[3]};--ct:${x.p[v==1?1:2]}"><i class="kc-m"></i><i class="kc-b"></i></button>`)}
 el.innerHTML=`<div class="kc-sc"><div class="kc-zoom"><div class="kc-ring">${cs.join('')}</div></div></div><div class="kc-cap" aria-live="polite"><b></b><small></small></div>`;
 const sc=el.querySelector('.kc-zoom'),ring=el.querySelector('.kc-ring'),cards=[...ring.children],cb=el.querySelector('.kc-cap b'),cm=el.querySelector('.kc-cap small'),capEl=el.querySelector('.kc-cap');
 let spin=0,v=0,Rr=180,idle=0,front=-1,zoom=false,tap=0;
 const lay=()=>{const W=el.clientWidth;if(!W)return;const w=clamp(W*.075,30,52);Rr=Math.max(N*w*1.08/(2*Math.PI),W*.3);el.style.setProperty('--w',w+'px');cards.forEach((cd,i)=>{cd.style.setProperty('--t',`rotateY(${i*step}deg) translateZ(${Rr.toFixed(1)}px)`)});paint()};
 const paint=()=>{ring.style.transform=`rotateX(-24deg) rotateZ(-9deg) rotateY(${spin.toFixed(2)}deg)`;let best=0,bd=999;
  cards.forEach((cd,i)=>{const r=Math.abs(norm(i*step+spin));if(r<bd){bd=r;best=i}cd.style.opacity=r<100?'1':(1-(r-100)/80*.5).toFixed(3)});
  if(best!==front){front=best;cards.forEach((cd,i)=>cd.classList.toggle('kc-front',i===best));const x=c.items[best%c.items.length];cb.textContent=x.name;cm.textContent=c.n+' · '+x.s;
   if(!reduced()){capEl.classList.remove('kt-capin');void capEl.offsetWidth;capEl.classList.add('kt-capin')}}};
 const dg=drag(el,{start:()=>{v=0},move:dd=>{spin+=dd*.42;paint()},end:vv=>{v=reduced()?0:clamp(vv*.42,-22,22);idle=performance.now()}});
 let lz=0;const zoomTap=()=>tap&&performance.now()-tap<330;const zt=()=>{const t=performance.now();if(t-lz<450)return;lz=t;zoom=!zoom;el.classList.toggle('kc-zoomed',zoom)};
 el.addEventListener('dblclick',e=>{e.preventDefault();zt()});
 el.addEventListener('pointerup',e=>{if(e.pointerType=='mouse'||dg.dragging())return;const t=performance.now();if(t-tap<320){tap=0;zt()}else tap=t});
 el.onclick=e=>{const cd=e.target.closest('.kc-c');if(!cd||e.detail>1)return;const i=+cd.dataset.i;
  if(i===front){clearTimeout(el._kc);el._kc=setTimeout(()=>{if(performance.now()-lz>500&&!zoomTap())go(c,c.items[i%c.items.length])},340)}
  else{const tgt=-i*step;spin=spin+norm(tgt-spin);v=0;idle=performance.now();paint()}};
 el.tabIndex=0;el.onkeydown=e=>{if(e.key=='ArrowLeft'){e.preventDefault();spin+=step;paint()}else if(e.key=='ArrowRight'){e.preventDefault();spin-=step;paint()}else if(e.key=='Enter'&&e.target===el){go(c,c.items[front%c.items.length])}};
 lay();
 return{lay,tick:(t,dt)=>{if(dg.dragging())return true;
   if(Math.abs(v)>.02){spin+=v*dt/16;v*=Math.pow(.955,dt/16);paint();return true}
   if(!reduced()&&t-idle>1600){spin-=4*dt/1000;paint();return true}return false}}}};

/* ---------- bölüm ---------- */
const MODES6=['folder','mark','arc','ring','spot','loop'];
const P={stages:[],cat:null};
safe('bölüm',()=>{buildCats();if(!Object.keys(CAT).length)return;const more=$('lpmore')||D.querySelector('#home .lp-more');if(!more||$('lp-kat'))return;
 const s=D.createElement('section');s.className='lp-sec kt';s.id='lp-kat';s.setAttribute('aria-label','Kategori sahneleri');
 let cur='dergi';try{const v=localStorage.getItem('vy-kat');if(CAT[v])cur=v}catch(e){}
 s.innerHTML=`<div class="lp-sh kt-rv"><span class="lp-k">Kategoriler</span><h2>Her tür için <em>altı sahne.</em></h2><p>Bir kategori seç; şablonlarını altı farklı hareketle gez. Kartlara dokun, sürükle ya da oklarla geç. Beğendiğine dokununca tasarım hemen açılır.</p></div>
  <div class="kt-cats kt-rv" role="tablist" aria-label="Kategori seç">${ORDER.filter(k=>CAT[k]).map(k=>`<button type="button" role="tab" class="kt-cat" data-k="${k}" aria-selected="${k==cur}" style="--h:${CAT[k].hue}"><span aria-hidden="true">${CAT[k].e}</span>${esc(CAT[k].n)}</button>`).join('')}<i class="kt-ink" aria-hidden="true"></i></div>
  <div class="kt-grid">${MODES6.map((m,i)=>`<figure class="kt-demo kt-rv" style="--i:${i}"><figcaption><span class="kt-no">0${i+1}</span><b>${M[m].title}</b><small>${M[m].hint}</small></figcaption><div class="kt-st kt-${m}" data-m="${m}" role="group" aria-roledescription="galeri" aria-label="${M[m].title} galerisi"></div></figure>`).join('')}</div>`;
 more.insertBefore(s,more.firstChild);
 const stEls=[...s.querySelectorAll('.kt-st')],chips=[...s.querySelectorAll('.kt-cat')],ink=s.querySelector('.kt-ink'),bar=s.querySelector('.kt-cats');
 const vis=new Map();
 const build=k=>{const c=CAT[k];P.cat=k;s.style.setProperty('--kh',c.hue);P.stages=stEls.map(el=>{const m=el.dataset.m;el.classList.remove('kc-zoomed');const o=safe(M[m].title,()=>M[m].build(el,c))||{};o.el=el;o.m=m;return o})};
 const moveInk=()=>{const a=chips.find(b=>b.getAttribute('aria-selected')=='true');if(!a||!ink)return;ink.style.width=a.offsetWidth+'px';ink.style.transform=`translateX(${a.offsetLeft}px)`;ink.style.background=CAT[a.dataset.k].hue};
 let swapping=0;
 const pick=(k,focus)=>{if(!CAT[k]||k===P.cat)return;chips.forEach(b=>{const on=b.dataset.k==k;b.setAttribute('aria-selected',on?'true':'false');b.tabIndex=on?0:-1;if(on&&focus)b.focus()});try{localStorage.setItem('vy-kat',k)}catch(e){}moveInk();
  const a=chips.find(b=>b.dataset.k==k);if(a&&bar.scrollWidth>bar.clientWidth){const l=a.offsetLeft-(bar.clientWidth-a.offsetWidth)/2;try{bar.scrollTo({left:l,behavior:reduced()?'auto':'smooth'})}catch(e){bar.scrollLeft=l}}
  if(reduced()){build(k);return}clearTimeout(swapping);s.classList.add('kt-out');swapping=setTimeout(()=>{build(k);s.classList.remove('kt-out');s.classList.remove('kt-in');void s.offsetWidth;s.classList.add('kt-in');setTimeout(()=>s.classList.remove('kt-in'),900);kick()},230)};
 bar.addEventListener('click',e=>{const b=e.target.closest('.kt-cat');if(b)pick(b.dataset.k)});
 bar.addEventListener('keydown',e=>{const i=chips.findIndex(b=>b.dataset.k==P.cat);if(e.key=='ArrowRight'||e.key=='ArrowLeft'){e.preventDefault();const n=chips[(i+(e.key=='ArrowRight'?1:-1)+chips.length)%chips.length];pick(n.dataset.k,true)}});
 chips.forEach(b=>{b.tabIndex=b.dataset.k==cur?0:-1});
 build(cur);
 /* boyut değişince yeniden yerleşim */
 if('ResizeObserver' in window){const ro=new ResizeObserver(es=>{es.forEach(en=>{const o=P.stages.find(x=>x.el===en.target);if(o&&o.lay)o.lay()});moveInk()});stEls.forEach(el=>ro.observe(el));ro.observe(bar)}
 else addEventListener('resize',()=>{P.stages.forEach(o=>o.lay&&o.lay());moveInk()});
 /* görünür olma: belirme ve döngü */
 const rv=[...s.querySelectorAll('.kt-rv')];
 if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12});rv.forEach(x=>io.observe(x));
  const io2=new IntersectionObserver(es=>{es.forEach(en=>vis.set(en.target,en.isIntersecting));kick()},{rootMargin:'80px 0px'});stEls.forEach(x=>io2.observe(x))}
 else{rv.forEach(x=>x.classList.add('in'));stEls.forEach(x=>vis.set(x,true))}
 /* tek ortak döngü: yalnız ekrandaki sahneler, ana sayfa açıkken */
 let raf=0,lt=0;const loop=t=>{raf=0;const dt=lt?Math.min(64,t-lt):16;lt=t;if(D.hidden||!homeOn()){lt=0;return}let any=false;
  P.stages.forEach(o=>{if(!o.tick||!vis.get(o.el))return;const r=safe('döngü',()=>o.tick(t,dt));if(r!==false)any=true});
  if(any)raf=requestAnimationFrame(loop);else lt=0};
 const kick=()=>{if(!raf)raf=requestAnimationFrame(loop)};
 s.addEventListener('pointerdown',kick,{passive:true});s.addEventListener('pointerup',kick,{passive:true});
 D.addEventListener('visibilitychange',kick);setInterval(()=>{if(!raf&&!reduced()&&homeOn()&&!D.hidden&&[...vis.values()].some(Boolean))kick()},1500);
 const h=$('home');if(h)new MutationObserver(()=>{if(!h.hidden){requestAnimationFrame(()=>{P.stages.forEach(o=>o.lay&&o.lay());moveInk();kick()})}}).observe(h,{attributes:true,attributeFilter:['hidden']});
 requestAnimationFrame(moveInk);setTimeout(moveInk,600);
 /* menüye bağlantı */
 const nav=D.querySelector('#home .lpn'),ref=nav&&nav.querySelector('a[href="#lp-neden"]');if(ref&&!nav.querySelector('a[href="#lp-kat"]')){const a=D.createElement('a');a.href='#lp-kat';a.textContent='Kategoriler';a.setAttribute('aria-label','Kategoriler');ref.before(a);a.addEventListener('pointerenter',e=>{try{if(e.pointerType=='mouse'&&window.v4live2&&v4live2.parts.scramble)v4live2.parts.scramble(a)}catch(x){}})}
 P.pick=pick;P.kick=kick;P.section=s});

window.v4kat={reduced,parts:P,cats:CAT,modes:MODES6};
})();
