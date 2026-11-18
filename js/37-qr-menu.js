/* =====================================================================
   QR MENÜ: tasarımdaki menüyü telefonda okunan bir web sayfasına çevirir.
   Sunucu yok: menü (başlıklar, ürün, fiyat, açıklama) sıkıştırılıp bağlantının
   # kısmına yazılır; menu.html bağlantıyı açınca menüyü çizer. Veri hiçbir
   sunucuya gönderilmez (# kısmı tarayıcıdan dışarı çıkmaz).
   Fiyat satırları "Ürün ........ 120 ₺" biçiminde okunur; altındaki satır açıklamadır.
   Fiyat değişirse yeni QR üretilmelidir (pencerede söylenir).
   ===================================================================== */
(function(){
'use strict';
const D=document,$=id=>D.getElementById(id);
const EN=!!(window.v4i18n&&v4i18n.lang==='en');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L=EN?{btn:'📱 QR menu page',cmd:'QR menu page (phone)',h:'QR menu page',p:(s,i)=>`Found ${s} section(s) and ${i} item(s) in this design. Scanning the QR opens a mobile menu page; nothing is uploaded to a server.`,none:'No price lines found. Write items like “Lentil soup ........ 6.50” and the line below as a description.',open:'Open page',copy:'Copy link',add:'Add QR to page',dl:'Download QR (PNG)',warn:'If you change prices, create a new QR and reprint it.',long:'The menu is long, so the QR code is dense: print it at least 4 × 4 cm.',copied:'Link copied ✓',added:'QR menu added to the page ✓',x:'Close',first:'Open a design first'}
 :{btn:'📱 QR menü sayfası',cmd:'QR menü sayfası (telefon)',h:'QR menü sayfası',p:(s,i)=>`Bu tasarımda ${s} bölüm ve ${i} ürün bulundu. QR okutulunca telefonda menü sayfası açılır; hiçbir şey sunucuya yüklenmez.`,none:'Fiyat satırı bulunamadı. Ürünleri “Mercimek çorbası ........ 120 ₺” gibi yaz, altındaki satır açıklama olsun.',open:'Sayfayı aç',copy:'Bağlantıyı kopyala',add:'QR’ı sayfaya ekle',dl:'QR’ı indir (PNG)',warn:'Fiyatları değiştirirsen yeni QR oluşturup yeniden bastır.',long:'Menü uzun olduğu için QR yoğun: en az 4 × 4 cm basmalısın.',copied:'Bağlantı kopyalandı ✓',added:'QR menü sayfaya eklendi ✓',x:'Kapat',first:'Önce bir tasarım aç'};
const PRICE=/^(.+?)\s*\.{2,}\s*(.+)$/;
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
/* tasarımdaki sayfalardan menü verisini çıkar */
function collect(){if(typeof PROJ=='undefined'||!PROJ)return null;try{PROJ.pages[PROJ.cur].s=pageSnap()}catch(e){}
 let name=clean(PROJ.name),sub='',note='',font='',col=null;const secs=[];
 PROJ.pages.forEach((pg,pi)=>{const els=(pg.s&&pg.s.els||[]).filter(e=>e.on!==false&&e.txt!==undefined);
  const tt=els.find(e=>e.type=='t'),ss=els.find(e=>e.type=='s'),bodies=els.filter(e=>e.type=='b');
  if(pi==0){if(tt)name=clean(tt.txt)||name;if(ss)sub=clean(ss.txt);if(tt&&tt.ff)font=tt.ff;const pc=pg.s.pc||null;col=[pg.s.bg||'#fbf8f1',(tt&&tt.col)||'#1f1a14',(ss&&ss.col)||(pc&&pc[2])||'#b3261e']}
  const items=[];bodies.forEach(b=>{let last=null;String(b.txt||'').split('\n').forEach(raw=>{const ln=clean(raw);if(!ln)return;const m=PRICE.exec(ln);
    if(m){last=[clean(m[1]),clean(m[2]),''];items.push(last)}else if(last&&!last[2]){last[2]=ln}else{last=[ln,'',''];items.push(last)}})});
  const priced=items.filter(x=>x[1]);
  if(priced.length){secs.push([pi==0&&!(tt&&secs.length==0&&PROJ.pages.length>1)?'':clean(tt?tt.txt:''),items])}
  else if(pi>0&&tt&&items.length)secs.push([clean(tt.txt),items]);
  const mm=els.find(e=>e.type=='m');if(mm&&!note&&!/^\{|sayfa|page/i.test(mm.txt))note=clean(mm.txt)});
 /* ilk sayfa hem kapak hem ürün sayfasıysa bölüm başlığı boş kalabilir */
 secs.forEach((s,i)=>{if(!s[0]&&secs.length>1)s[0]=i==0?(EN?'Menu':'Menü'):''});
 return{v:1,n:name.slice(0,80),s:sub.slice(0,160),c:col,f:/^[A-Za-z0-9 ]{2,40}$/.test(font)?font:'',S:secs.slice(0,40).map(s=>[s[0].slice(0,80),s[1].slice(0,80).map(x=>[x[0].slice(0,120),x[1].slice(0,30),x[2].slice(0,240)])]),m:note.slice(0,200)}}
const b64u=u8=>{let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
async function encode(d){const raw=new TextEncoder().encode(JSON.stringify(d));
 if(typeof CompressionStream!='undefined'){try{const cs=new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'));const z=new Uint8Array(await new Response(cs).arrayBuffer());if(z.length<raw.length)return'z'+b64u(z)}catch(e){}}
 return'j'+b64u(raw)}
const base=()=>{const u=new URL('menu.html',location.href);u.search='';u.hash='';return u.href};
async function build(){const d=collect();if(!d)return null;const code=await encode(d);return{d,url:base()+'#m='+code}}
function close(){const m=$('vqm');if(m)m.remove()}
async function open(){if(typeof PROJ=='undefined'||!PROJ||$('edw').hidden){if(typeof toast=='function')toast(L.first);return}
 const r=await build();if(!r)return;const items=r.d.S.reduce((n,s)=>n+s[1].filter(x=>x[1]).length,0);close();
 const m=D.createElement('div');m.id='vqm';m.className='vqm';m.setAttribute('data-noi18n','');
 m.innerHTML=`<div class="vqm-bg" data-q="x"></div><div class="vqm-c" role="dialog" aria-modal="true" aria-labelledby="vqm-h"><button type="button" class="vqm-x" data-q="x" aria-label="${esc(L.x)}">✕</button>
  <h3 id="vqm-h">${esc(L.h)}</h3><p class="vqm-p">${esc(items?L.p(r.d.S.length,items):L.none)}</p><div class="vqm-q"></div>
  <p class="vqm-w">${esc(L.warn)}${r.url.length>1200?' '+esc(L.long):''}</p>
  <div class="vqm-a"><button type="button" class="pb" data-q="add">${esc(L.add)}</button><a class="b" data-q="open" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(L.open)}</a><button type="button" class="b" data-q="copy">${esc(L.copy)}</button><button type="button" class="b" data-q="dl">${esc(L.dl)}</button></div></div>`;
 D.body.appendChild(m);let cv=null;try{cv=window.v5int&&v5int.qrCv?v5int.qrCv(r.url,560):null}catch(e){cv=null}
 if(cv){cv.className='vqm-cv';cv.setAttribute('role','img');cv.setAttribute('aria-label','QR');m.querySelector('.vqm-q').appendChild(cv)}
 m.addEventListener('click',async e=>{const b=e.target.closest('[data-q]');if(!b)return;const k=b.dataset.q;
  if(k=='x')close();
  else if(k=='copy'){try{await navigator.clipboard.writeText(r.url);toast(L.copied)}catch(x){prompt(L.copy,r.url)}}
  else if(k=='dl'&&cv){cv.toBlob(bl=>{if(bl&&typeof save=='function')save((window.v4slug?v4slug(r.d.n||'menu'):'menu')+'-qr.png',bl)},'image/png')}
  else if(k=='add'){try{const rr=v5int.resolve('qr',r.url);if(rr&&rr.emb){await v5int.place(rr.emb,EN?'QR menu':'QR menü');toast(L.added);close()}}catch(x){console.warn('qr menü',x)}}});
 D.addEventListener('keydown',function k(e){if(e.key=='Escape'&&$('vqm')){e.stopPropagation();close();D.removeEventListener('keydown',k,true)}},true);
 const f=m.querySelector('[data-q=add]');if(f)f.focus()}
/* dışa aktar menüsü ve komut paleti */
const xm=$('xmenu');if(xm&&!xm.querySelector('.vqm-b')){const b=D.createElement('button');b.type='button';b.className='b vqm-b';b.style.cssText='width:100%;margin-top:6px';b.textContent=L.btn;b.setAttribute('data-noi18n','');b.onclick=()=>{xm.hidden=true;open()};const vps=xm.querySelector('.vps');if(vps)xm.insertBefore(b,vps);else xm.appendChild(b)}
try{if(typeof v4cmd=='function')v4cmd([EN?'File':'Dosya',L.cmd,[],open])}catch(e){}
window.v4qrmenu={open,build,collect,encode};
})();
