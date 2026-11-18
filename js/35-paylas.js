/* =====================================================================
   PAYLAŞ: dosyaları indirmek yerine telefonun paylaşım menüsüyle gönder
   - Ana sayfa: "📤 Yedeği gönder" → iCloud Drive, Google Drive, WhatsApp, Mail…
   - Editör › Dışa aktar: "📤 Gönder" bölümü → sayfa çevirmeli dergi, önizleme, PNG, PDF
   - Ana sayfada yedek hatırlatması (7 günü geçince ya da hiç yedek yoksa, günde bir kez)
   Mevcut dışa aktarma kodu değişmez: global save() bir kerelik "gönder" moduna alınır.
   Paylaşım desteklenmiyorsa (çoğu bilgisayar) dosya her zamanki gibi iner.
   ===================================================================== */
(function(){
'use strict';
const D=document,$=id=>D.getElementById(id);
const EN=!!(window.v4i18n&&v4i18n.lang==='en');
const T=EN?{bak:'📤 Send backup',bakT:'Save your backup to iCloud Drive, Google Drive or WhatsApp',sendH:'📤 Send',flip:'Page-flip magazine',prev:'Preview page',png:'This page · PNG',pdf:'All pages · PDF',ready:'File ready',go:'📤 Send',dl:'Download instead',rem:n=>n<0?'You have never backed up your designs. If Safari data is cleared, they are lost.':`Your last backup was ${n} days ago.`,remB:'Back up now',later:'Later',sent:'Sent ✓',no:'Sharing is not available here; the file was downloaded.',x:'Close'}
 :{bak:'📤 Yedeği gönder',bakT:'Yedeği iCloud Drive, Google Drive ya da WhatsApp’a kaydet',sendH:'📤 Gönder',flip:'Sayfa çevirmeli dergi',prev:'Önizleme sayfası',png:'Bu sayfa · PNG',pdf:'Tüm sayfalar · PDF',ready:'Dosya hazır',go:'📤 Gönder',dl:'Bunun yerine indir',rem:n=>n<0?'Çalışmalarını hiç yedeklemedin. Safari verisi silinirse kaybolurlar.':`Son yedeğin ${n} gün önceydi.`,remB:'Şimdi yedekle',later:'Sonra',sent:'Gönderildi ✓',no:'Bu cihazda paylaşım yok; dosya indirildi.',x:'Kapat'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MIME={json:'application/json',html:'text/html',png:'image/png',pdf:'application/pdf',zip:'application/zip',svg:'image/svg+xml',jpg:'image/jpeg'};
const fileOf=(n,b)=>{const ext=(n.split('.').pop()||'').toLowerCase();/* iOS bazı türleri tanımaz; JSON'u düz metin gibi değil dosya olarak versin */return new File([b],n,{type:b.type||MIME[ext]||'application/octet-stream'})};
const canFiles=f=>{try{return!!(navigator.share&&navigator.canShare&&navigator.canShare({files:[f]}))}catch(e){return false}};
const real=window.save;
let mode=null,lastFile=null;/* mode: {resolve} = bir sonraki save() paylaşılacak */
const plainDl=(n,b)=>real?real(n,b):null;
async function shareFile(f){try{await navigator.share({files:[f],title:f.name});if(typeof toast=='function')toast(T.sent);return true}catch(e){if(e&&e.name==='AbortError')return true;if(e&&e.name==='NotAllowedError'){sheet(f);return true}return false}}
/* tarayıcı kullanıcı dokunuşunu "unuttuysa" (uzun hazırlıklarda olur), tek dokunuşluk gönder penceresi */
function sheet(f){let s=$('vpsh');if(s)s.remove();s=D.createElement('div');s.id='vpsh';s.className='vpsh';s.setAttribute('role','dialog');s.setAttribute('aria-label',T.ready);s.setAttribute('data-noi18n','');
 s.innerHTML=`<div class="vpsh-b"><b>${esc(T.ready)}</b><small>${esc(f.name)} · ${(f.size/1048576).toFixed(1)} MB</small><button type="button" class="vpsh-go">${esc(T.go)}</button><button type="button" class="vpsh-dl">${esc(T.dl)}</button><button type="button" class="vpsh-x" aria-label="${esc(T.x)}">✕</button></div>`;
 D.body.appendChild(s);s.querySelector('.vpsh-go').onclick=async()=>{const ok=await shareFile(f);if(ok)s.remove()};s.querySelector('.vpsh-dl').onclick=()=>{plainDl(f.name,f);s.remove()};s.querySelector('.vpsh-x').onclick=()=>s.remove();s.querySelector('.vpsh-go').focus()}
if(typeof real=='function'){window.save=async function(n,b){if(!mode)return real.apply(this,arguments);const m=mode;mode=null;const f=fileOf(n,b);lastFile=f;
  if(canFiles(f)){const ok=await shareFile(f);if(!ok)await real(n,b)}else{await real(n,b);if(typeof toast=='function')setTimeout(()=>toast(T.no),400)}m.resolve&&m.resolve(true)};
 try{save=window.save}catch(e){}}
/* bir eylemi "gönder" modunda çalıştır */
const viaShare=fn=>new Promise(res=>{mode={resolve:res};let r;try{r=fn()}catch(e){mode=null;res(false);return}Promise.resolve(r).catch(()=>{}).then(()=>setTimeout(()=>{if(mode){mode=null;res(false)}},60000))});
window.v4paylas={viaShare,sheet,canShare:()=>!!navigator.share,last:()=>lastFile};

/* ---- ana sayfa: yedeği gönder ---- */
const hb=$('hbak');
if(hb&&!$('hbaks')){const b=D.createElement('button');b.type='button';b.className='pb';b.id='hbaks';b.textContent=T.bak;b.title=T.bakT;b.setAttribute('data-noi18n','');
 b.addEventListener('click',()=>viaShare(()=>hb.click()));
 const row=hb.closest('.bakr')||hb.parentNode;row.insertBefore(b,row.firstChild);if(!navigator.share)b.hidden=true}

/* ---- editör › dışa aktar: gönder bölümü ---- */
const xm=$('xmenu');
if(xm&&!xm.querySelector('.vps')){const w=D.createElement('div');w.className='vps';w.setAttribute('data-noi18n','');
 w.innerHTML=`<label class="pl">${esc(T.sendH)}</label><div class="vps-g"><button type="button" class="b" data-vp="flip">${esc(T.flip)}</button><button type="button" class="b" data-vp="prev">${esc(T.prev)}</button><button type="button" class="b" data-vp="png">${esc(T.png)}</button><button type="button" class="b" data-vp="pdf">${esc(T.pdf)}</button></div>`;
 xm.appendChild(w);if(!navigator.share)w.hidden=true;
 w.addEventListener('click',e=>{const b=e.target.closest('[data-vp]');if(!b)return;xm.hidden=true;const k=b.dataset.vp;
  viaShare(()=>{if(k=='flip'&&window.v4flipbook)return v4flipbook();if(k=='prev'&&window.v4preview)return v4preview();if(k=='png'&&typeof exp=='function'){exp.one=1;return exp('png')}if(k=='pdf'&&typeof exp=='function')return exp('pdf')})})}

/* ---- yedek hatırlatması ---- */
const DAY=864e5,LAST='editra-lastbak',ASK='vy-bak-ask';
const showRem=async()=>{try{const h=$('home');if(!h||h.hidden||$('vprem'))return;let n=0;try{n=(await DB.full()).length}catch(e){n=D.querySelectorAll('#pgrid .pc').length}if(!n)return;
 const last=+localStorage.getItem(LAST)||0,age=last?Math.floor((Date.now()-last)/DAY):-1;if(age>=0&&age<7)return;
 const asked=+localStorage.getItem(ASK)||0;if(Date.now()-asked<DAY)return;
 const box=D.createElement('div');box.id='vprem';box.className='vprem';box.setAttribute('role','status');box.setAttribute('data-noi18n','');
 box.innerHTML=`<span aria-hidden="true">💾</span><p>${esc(T.rem(age))}</p><button type="button" class="pb vprem-go">${esc(T.remB)}</button><button type="button" class="b vprem-no">${esc(T.later)}</button>`;
 const card=$('stor')&&$('stor').closest('.card');const anchor=$('proj')||card;if(!anchor)return;anchor.parentNode.insertBefore(box,anchor);
 const done=()=>{try{localStorage.setItem(ASK,String(Date.now()))}catch(e){}box.remove()};
 box.querySelector('.vprem-go').onclick=()=>{done();if(navigator.share&&hb)viaShare(()=>hb.click());else if(hb)hb.click()};box.querySelector('.vprem-no').onclick=done}catch(e){}};
setTimeout(showRem,1800);const h=$('home');if(h)new MutationObserver(()=>{if(!h.hidden)setTimeout(showRem,900)}).observe(h,{attributes:true,attributeFilter:['hidden']});
})();
