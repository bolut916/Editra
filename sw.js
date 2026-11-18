/* Vybble servis çalışanı: uygulama kabuğunu önbelleğe alır, çevrimdışı açılmasını sağlar */
const V='vybble-v45',FONTS='vybble-fonts',SHELL=['./','index.html','style.css','js/00-dil.js','js/01-temel.js','js/02-calisma-alani.js','js/03-ai-yonetmen.js','js/04-v3-duzen.js','js/05-studyo-arayuz.js','js/06-donusum-kilavuz-baski.js','js/07-yazi-firca-zincir.js','js/08-iceaktar-disaaktar.js','js/09-kalem-sekil.js','js/10-renk-efekt-liste.js','js/11-mockup-svg-flipbook.js','js/12-kilavuz-baglanti-surum.js','js/13-asset-font-marka.js','js/14-baski-merkezi.js','js/15-dergi-kutuphane-portfoy.js','js/16-eklentiler.js','js/17-hareket.js','js/18-yedek.js','js/19-tanitim.js','js/20-interaktif.js','js/21-calisma-duzeni.js','js/22-artboard.js','js/23-oto-tasarim.js','js/24-oto-motor.js','js/25-canli.js','js/26-canli2.js','js/27-vybble.js','js/28-dokunmatik.js','js/29-sahne.js','js/30-sahneler.js','js/31-derin-baglanti.js','js/32-film.js','js/33-sayac.js','js/34-metin-oneri.js','js/35-paylas.js','js/36-tur.js','js/37-qr-menu.js','js/38-logodan.js','js/39-rozet.js','js/99-baslat.js','qrcode.min.js','jspdf.umd.min.js','manifest.webmanifest','favicon.svg','menu.html','ornekler.html','gizlilik.html','kosullar.html','yasal.css','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==FONTS&&x!==SHARE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Android "Paylaş → Vybble": paylaşılan görselleri kısa süreliğine sakla, uygulamayı aç */
const SHARE='vybble-paylas';
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='POST')return;const u=new URL(r.url);if(u.origin!==location.origin||!u.pathname.endsWith('/paylas'))return;
 e.respondWith((async()=>{let n=0;try{const fd=await r.formData();const fs=fd.getAll('gorsel').filter(f=>f&&typeof f!=='string'&&/^image\//.test(f.type)).slice(0,20);const c=await caches.open(SHARE);
  for(const k of await c.keys())await c.delete(k);
  await Promise.all(fs.map((f,i)=>c.put(new Request('./__paylas/'+i),new Response(f,{headers:{'content-type':f.type,'x-ad':encodeURIComponent(f.name||('gorsel-'+(i+1)))}}))));n=fs.length}catch(x){}
  return Response.redirect('./?paylas='+n,303)})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'||u.hostname==='api.fontshare.com'||u.hostname==='cdn.fontshare.com'){
  e.respondWith(caches.open(FONTS).then(async c=>{const m=await c.match(r);const f=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}).catch(()=>m);return m||f}));return}
 if(u.origin===location.origin){
  /* önce ağ: güncellemeler hemen görünsün; çevrimdışıysa önbellekten ver */
  e.respondWith(fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(x=>{if(x&&x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):undefined))))}});
