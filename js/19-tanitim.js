/* ===== Tanıtım sayfası: Vybble motoruyla canlı demo, hareket, sayaçlar ===== */
(function(){
const home=$('home');if(!home||!$('lpdemo'))return;
const root=document.documentElement;
const RM=()=>root.dataset.motion==='reduce'||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const onHome=()=>!home.hidden;
root.classList.add('js-rv');

/* ---------- logo kopyaları ---------- */
try{const f=$('lpflg');if(f&&typeof ELOGO!=='undefined')f.innerHTML=ELOGO+'<b>vybble</b>'}catch(e){}

/* ---------- kaydırınca belirme ---------- */
const RV=[...home.querySelectorAll('[data-rv]')];
RV.forEach(el=>{const sib=[...el.parentElement.children].filter(x=>x.hasAttribute('data-rv'));el.style.setProperty('--d',(Math.min(sib.indexOf(el),8)*0.06).toFixed(2)+'s')});
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{rootMargin:'0px 0px -6% 0px',threshold:.06});
 RV.forEach(el=>io.observe(el));
}else RV.forEach(el=>el.classList.add('in'));

/* ---------- fare takibi: hero ışığı, kart parıltısı, eğim ---------- */
const hero=$('lph');
hero.addEventListener('pointermove',e=>{if(RM())return;const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-r.left).toFixed(0)+'px');hero.style.setProperty('--my',(e.clientY-r.top).toFixed(0)+'px')},{passive:true});
home.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('[data-glow]');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--x',(e.clientX-r.left).toFixed(0)+'px');c.style.setProperty('--y',(e.clientY-r.top).toFixed(0)+'px')},{passive:true});
home.querySelectorAll('[data-tilt]').forEach(el=>{const amp=el.id==='lpdemo'?3.5:7;
 el.addEventListener('pointermove',e=>{if(RM()||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1200px) rotateY(${(x*amp).toFixed(2)}deg) rotateX(${(-y*amp).toFixed(2)}deg)`},{passive:true});
 el.addEventListener('pointerleave',()=>{el.style.transform=''})});

/* ---------- parallax ---------- */
const PX=[...home.querySelectorAll('[data-px]')],mesh=home.querySelector('.lp-mesh');let tk=0;
function para(){tk=0;if(!onHome())return;const y=Math.min(window.scrollY,1400);
 if(RM()){PX.forEach(el=>el.style.transform='');if(mesh)mesh.style.transform='';return}
 PX.forEach(el=>el.style.transform=`translate3d(0,${(y*+el.dataset.px).toFixed(1)}px,0)`);
 if(mesh)mesh.style.transform=`translate3d(0,${(y*.22).toFixed(1)}px,0)`}
addEventListener('scroll',()=>{if(!tk)tk=requestAnimationFrame(para)},{passive:true});

/* ---------- gerçek sayılar ---------- */
const nTR=n=>Number(n).toLocaleString('tr-TR');
const STAT={};
try{STAT.lay=Math.max(...Object.values(MODES).map(m=>m.f.length))*4*SEEDS}catch(e){STAT.lay=0}
try{STAT.font=Object.values(FC).reduce((a,l)=>a+l.length,0)}catch(e){STAT.font=0}
try{STAT.tpl=TPLS.length}catch(e){STAT.tpl=0}
try{STAT.sty=STY.length+PALS.length}catch(e){STAT.sty=0}
STAT.fmt=['PNG','PDF','CMYK PDF','SVG','ZIP (boyutlar)','Flipbook HTML','Önizleme HTML','İnteraktif HTML','.vybble proje'].length;
home.querySelectorAll('[data-stat]').forEach(el=>{const v=STAT[el.dataset.stat];if(v)el.textContent=nTR(v)});
const cnt=[...home.querySelectorAll('[data-count]')];
function countUp(el){const v=STAT[el.dataset.count]||0;if(RM()||!v){el.textContent=nTR(v);return}const t0=performance.now(),D=1400;
 const f=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);el.textContent=nTR(Math.round(v*e));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
if('IntersectionObserver' in window){const io2=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){countUp(en.target);io2.unobserve(en.target)}}),{threshold:.4});cnt.forEach(el=>io2.observe(el))}else cnt.forEach(countUp);

/* ---------- interaktif örnek sayfadaki QR ---------- */
try{const q=home.querySelector('.lpm-qr');if(q&&window.qrcode){const qr=qrcode(0,'M');qr.addData(location.href.split('#')[0]);qr.make();q.style.backgroundImage=`url(${qr.createDataURL(4,0)})`}}catch(e){}

/* ---------- çalışma yoksa boş "Son çalışmalar" kutusunu gizle ---------- */
const bi=window.bakInfo;window.bakInfo=function(n){home.classList.toggle('noproj',!n);if(bi)return bi.apply(this,arguments)};

/* =====================================================================
   CANLI DEMO: Vybble’ın kendi düzen motoru (gen/place/draw) ile çizer.
   Editör durumu (S) her çizimden önce saklanır, sonra aynen geri konur.
   ===================================================================== */
const MD=[
 {k:'katalog',n:'Katalog',mode:'katalog',mm:[210,297],st:[7,1,9,5],c:{img:6,t:1,s:1,b:6,m:1},t:'Yaz Koleksiyonu',s:'Seramik · Cam · Keten',m:['Katalog · 2026'],b:['Kil kupa · 240 ₺','Cam sürahi · 420 ₺','Keten örtü · 680 ₺','Taş tabak · 310 ₺','Mum seti · 190 ₺','Vazo No.4 · 560 ₺']},
 {k:'dergi',n:'Dergi',mode:'dergi',mm:[230,300],st:[0,9,5,2],c:{img:2,t:1,s:1,b:2,m:1,q:1},t:'Şehrin Ritmi',s:'Mimarlık, tasarım ve kültür',m:['Sayı 12 · Mayıs'],q:'“İyi bir sayfa okuru bir yerden başka bir yere taşır.”'},
 {k:'kapak',n:'Kapak',mode:'kapak',mm:[230,300],st:[2,6,4,0],c:{img:1,t:1,s:1,b:0,m:2},t:'EDİTRA',s:'Tasarımın yeni sesi',m:['Sayı 07','Sonbahar 2026']},
 {k:'afis',n:'Afiş',mode:'baski',mm:[297,420],st:[3,8,4,6],c:{img:1,t:1,s:2,b:0,m:2,r:1},t:'Tasarım Haftası',s:['12–18 Mayıs','İstanbul'],m:['Ücretsiz giriş','vybble']}];
const D={i:0,st:MD[0].st[0],sp:null,title:'',custom:false,auto:true,pause:0,tick:0,front:0,busy:false};

/* yapay "ürün fotoğrafları": görsel yüklemeden de sayfalar dolu görünsün */
const ARTP=[['#f3e7da','#c9734a','#7a3b22'],['#e6eef0','#3d6b78','#1d3a44'],['#efe6f7','#8a5cd6','#3b1f6e'],['#f6efd8','#d7a531','#6b4e10'],['#e3efe2','#5f9a63','#24452a'],['#f7e1e4','#e0607a','#6e1d2e'],['#e9e9ee','#30303a','#0e0e14'],['#fde8cf','#ff7a3c','#7a2c06']];
let ART=[];
function makeArt(){ART=ARTP.map((p,i)=>{const c=document.createElement('canvas');c.width=480;c.height=600;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,0,600);g.addColorStop(0,p[0]);g.addColorStop(1,shade(p[0],-14));x.fillStyle=g;x.fillRect(0,0,480,600);
 x.fillStyle='rgba(0,0,0,.14)';x.beginPath();x.ellipse(240,500,150,26,0,0,7);x.fill();
 const k=i%4,rg=(cx,cy,r)=>{const q=x.createRadialGradient(cx-r*.35,cy-r*.4,r*.1,cx,cy,r);q.addColorStop(0,shade(p[1],28));q.addColorStop(.7,p[1]);q.addColorStop(1,p[2]);return q};
 if(k==0){x.fillStyle=rg(240,330,150);x.beginPath();x.arc(240,330,150,0,7);x.fill()}
 else if(k==1){x.fillStyle=rg(240,320,170);x.beginPath();x.moveTo(150,500);x.lineTo(150,260);x.bezierCurveTo(150,120,330,120,330,260);x.lineTo(330,500);x.closePath();x.fill()}
 else if(k==2){[[120,360,240,40],[140,320,200,40],[110,280,260,40],[150,240,180,40]].forEach((r,j)=>{x.fillStyle=j%2?p[1]:shade(p[1],-18);x.fillRect(...r)});x.fillStyle=p[2];x.fillRect(110,400,260,96)}
 else{x.fillStyle=rg(240,340,120);x.beginPath();x.moveTo(205,140);x.lineTo(275,140);x.lineTo(275,210);x.quadraticCurveTo(340,240,340,320);x.lineTo(340,480);x.quadraticCurveTo(340,500,320,500);x.lineTo(160,500);x.quadraticCurveTo(140,500,140,480);x.lineTo(140,320);x.quadraticCurveTo(140,240,205,210);x.closePath();x.fill()}
 return c.toDataURL('image/jpeg',.86)});
 return Promise.all(ART.map(u=>{const im=getIm(u);return im.decode?im.decode().catch(()=>0):0}))}
function shade(h,a){const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,v+a));return'#'+[f(n>>16),f(n>>8&255),f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('')}

/* demo sayfasını geçici olarak S üzerinde kur; fn(S) çalışır; S geri konur */
function withDemo(fn){const keep={};Object.keys(S).forEach(k=>keep[k]=S[k]);
 try{const m=MD[D.i],M=MODES[m.mode],mm=m.mm;
  Object.assign(S,{mode:m.mode,mm:mm.slice(),fmt:mm[0]/mm[1],cols:M.cols,rows:M.rows,mar:M.mar,gut:2,st:D.st,pc:null,imgPal:null,grain:0,vig:0,bg:STY[D.st].bg,els:[],sel:null,sp:[0,1,0,0],af:true,free:false,n:0});
  setCounts(m.c);fillDemo(m);
  if(!D.sp){const L=M.f;D.sp=[L[(Math.random()*L.length)|0],1+((Math.random()*SEEDS)|0),Math.random()<.5?1:0,0]}
  place(D.sp);return fn()}
 finally{Object.keys(S).forEach(k=>{if(!(k in keep))delete S[k]});Object.assign(S,keep)}}
function fillDemo(m){let ai=0;const arr=v=>Array.isArray(v)?v:[v],cnt={};
 S.els.forEach(e=>{const j=cnt[e.type]=(cnt[e.type]||0)+1,k=j-1;
  if(e.type=='img'){const u=ART[(ai++ + D.i*2)%ART.length];if(u){e.src=u;e.im=getIm(u)}}
  else if(e.type=='t')e.txt=(D.custom&&D.title?D.title:m.t).replace(/ /,k?' ':'\n');
  else if(e.type=='s'&&m.s)e.txt=arr(m.s)[k%arr(m.s).length];
  else if(e.type=='m'&&m.m)e.txt=arr(m.m)[k%arr(m.m).length];
  else if(e.type=='b'&&m.b)e.txt=m.b[k%m.b.length];
  else if(e.type=='q'&&m.q)e.txt=m.q})}

const st=$('lpdstage'),pg=$('lpdpage'),cv=[$('lpdc0'),$('lpdc1')];
function sizePage(){const m=MD[D.i],f=m.mm[0]/m.mm[1],r=st.getBoundingClientRect();if(!r.width)return null;
 const mh=r.height*.84,mw=r.width*.8;let w=Math.min(mw,mh*f),h=w/f;pg.style.width=w.toFixed(1)+'px';pg.style.height=h.toFixed(1)+'px';return[w,h]}
function paint(){if(!onHome()||!$('edw').hidden)return;const sz=sizePage();if(!sz)return;
 const dpr=Math.min(2,window.devicePixelRatio||1),W=Math.max(200,Math.min(1100,Math.round(sz[0]*dpr)));
 let src;try{src=withDemo(()=>draw(W))}catch(e){console.warn('demo',e);return}
 const nx=cv[1-D.front];nx.width=src.width;nx.height=src.height;nx.getContext('2d').drawImage(src,0,0);
 nx.style.opacity='1';cv[D.front].style.opacity='0';nx.style.zIndex='1';cv[D.front].style.zIndex='0';D.front=1-D.front}

/* kontroller */
const tabs=$('lpdtabs'),sw=$('lpdsw'),ti=$('lpdt'),live=$('lpdlive');
tabs.innerHTML=MD.map((m,i)=>`<button role="tab" data-i="${i}" aria-selected="${i==D.i}">${m.n}</button>`).join('');
sw.innerHTML=STY.map((s,i)=>`<button type="button" data-s="${i}" title="${esc(s.n)}" aria-label="Stil: ${esc(s.n)}" aria-pressed="${i==D.st}" style="background:linear-gradient(135deg,${s.bg} 0 50%,${s.ac} 50%)"></button>`).join('');
function syncUI(){tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',+b.dataset.i==D.i));sw.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.s==D.st));if(!D.custom)ti.value=MD[D.i].t}
function dMode(i,user){D.i=i;D.st=MD[i].st[0];D.sp=null;syncUI();paint();if(user)hold()}
function shuffle(user){const M=MODES[MD[D.i].mode],L=M.f;D.sp=[L[(Math.random()*L.length)|0],1+((Math.random()*SEEDS)|0),Math.random()<.5?1:0,Math.random()<.2?1:0];paint();if(user)hold()}
function hold(){D.pause=Date.now()+9000}
tabs.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)dMode(+b.dataset.i,true)});
sw.addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;D.st=+b.dataset.s;syncUI();paint();hold()});
let tiT=0;ti.addEventListener('input',()=>{D.custom=!!ti.value.trim();D.title=ti.value.trim();clearTimeout(tiT);tiT=setTimeout(paint,120);hold()});
ti.addEventListener('focus',hold);
$('lpdsh').onclick=()=>shuffle(true);
live.addEventListener('click',()=>{D.auto=!D.auto;live.classList.toggle('off',!D.auto);live.lastChild.textContent=D.auto?'Otomatik':'Duraklatıldı'});
$('lpdemo').addEventListener('pointerdown',e=>{if(e.target.closest('.lpd-stage'))hold()});

/* otomatik oynatma: yalnızca görünürken, hareket azaltılmamışken */
let vis=true;if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(st);
setInterval(()=>{if(!D.auto||!vis||RM()||document.hidden||!onHome()||!$('edw').hidden||Date.now()<D.pause||document.activeElement===ti)return;
 D.tick++;if(D.tick%5==0){dMode((D.i+1)%MD.length,false);return}
 if(D.tick%2==0){const L=MD[D.i].st;D.st=L[(L.indexOf(D.st)+1)%L.length];syncUI()}shuffle(false)},3400);
if('ResizeObserver' in window)new ResizeObserver(()=>{if(onHome())paint()}).observe(st);

/* demodan gerçek projeye */
function demoStart(){const m=MD[D.i],M=MODES[m.mode],mm=m.mm.slice(),dpi=(typeof CFG!=='undefined'&&CFG.dpi)||300,title=(D.custom&&D.title)||m.t;
 PROJ={id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:title,kind:m.k,dpi,created:Date.now(),pages:[],cur:0,components:[],styles:[]};
 Object.assign(S,{mode:m.mode,mm,fmt:mm[0]/mm[1],cols:M.cols,rows:M.rows,mar:M.mar,gut:2,st:D.st,pc:null,imgPal:null,grain:0,vig:0,bg:STY[D.st].bg,els:[],sel:null,sp:[0,1,0,0]});
 setCounts(m.c);fillDemo(m);place(D.sp||[M.f[0],1,0,0]);S.sel=null;PROJ.pages.push({s:pageSnap()});
 setPx(Math.min(12000,Math.max(1000,Math.round(Math.max(...mm)/25.4*dpi))));openEditor(0);saveNow();
 toast('Demo tasarımın projeye dönüştü ✓ Görsellere dokunup kendi fotoğraflarını yükle')}
$('lpdgo').onclick=demoStart;
const ig=$('lpintgo');if(ig)ig.onclick=()=>{demoStart();setTimeout(()=>{if(window.v5int)v5int.open()},400)};
const eg=$('lpendgo');if(eg)eg.onclick=()=>openWiz();

/* başlat: yazı tipleri ve görseller hazır olunca çiz */
ti.value=MD[0].t;
const fl=[];STY.forEach(s=>{fl.push(`700 20px "${s.t}"`,`400 20px "${s.b}"`)});fl.push('500 20px "IBM Plex Mono"');
makeArt().then(()=>{paint();return Promise.all(fl.map(f=>document.fonts.load(f).catch(()=>0)))}).then(()=>paint());
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>paint());
const sh0=window.showHome;if(typeof sh0==='function'){window.showHome=function(){const r=sh0.apply(this,arguments);setTimeout(paint,60);return r}}
window.lpDemo={paint,start:demoStart,state:D};
})();
