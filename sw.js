/* Editra servis çalışanı: uygulama kabuğunu önbelleğe alır, çevrimdışı açılmasını sağlar */
const V='editra-v14',FONTS='editra-fonts',SHELL=['./','index.html','style.css','js/01-temel.js','js/02-calisma-alani.js','js/03-ai-yonetmen.js','js/04-v3-duzen.js','js/05-studyo-arayuz.js','js/06-donusum-kilavuz-baski.js','js/07-yazi-firca-zincir.js','js/08-iceaktar-disaaktar.js','js/09-kalem-sekil.js','js/10-renk-efekt-liste.js','js/11-mockup-svg-flipbook.js','js/12-kilavuz-baglanti-surum.js','js/13-asset-font-marka.js','js/14-baski-merkezi.js','js/15-dergi-kutuphane-portfoy.js','js/16-eklentiler.js','js/17-hareket.js','js/99-baslat.js','jspdf.umd.min.js','manifest.webmanifest','favicon.svg','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==FONTS).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
  e.respondWith(caches.open(FONTS).then(async c=>{const m=await c.match(r);const f=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}).catch(()=>m);return m||f}));return}
 if(u.origin===location.origin){
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>{const f=fetch(r).then(x=>{if(x&&x.ok)caches.open(V).then(c=>c.put(r,x.clone()));return x}).catch(()=>m||(r.mode==='navigate'?caches.match('index.html'):undefined));return m||f}))}});
