/* =====================================================================
   ZİYARETÇİ SAYACI (GoatCounter, çerezsiz)
   KOD boşken hiçbir şey yapmaz. Etkinleştirmek için: goatcounter.com'da ücretsiz
   hesap aç, hesap adını aşağıya yaz (ör. 'vybble'), gizlilik.html'deki sayaç
   bölümünü güncelle, sw.js sürümünü artır.
   - Dış betik yüklenmez: yalnız sayfa yolu, başlık, yönlendiren site ve ekran
     genişliği gönderilir. Çerez yok, kişisel veri yok.
   - Tarayıcıda "Do Not Track" ya da "Global Privacy Control" açıksa sayılmaz.
   - Yerel denemeler (localhost) sayılmaz.
   ===================================================================== */
(function(){
'use strict';
const KOD='';
if(!KOD||!/^[a-z0-9-]{2,40}$/.test(KOD))return;
try{if(navigator.doNotTrack==='1'||window.doNotTrack==='1'||navigator.globalPrivacyControl)return;if(/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname)||location.protocol==='file:')return}catch(e){return}
const gonder=(yol,baslik)=>{try{const q=new URLSearchParams({p:yol,t:baslik||document.title,r:document.referrer||'',s:String(screen.width||0),rnd:String(Math.random()).slice(2,9)});
 const u='https://'+KOD+'.goatcounter.com/count?'+q.toString();if(navigator.sendBeacon&&navigator.sendBeacon(u))return;const i=new Image();i.referrerPolicy='no-referrer-when-downgrade';i.src=u}catch(e){}};
const yol=()=>{let p=location.pathname.replace(/^\/Editra/,'')||'/';const l=window.v4i18n&&v4i18n.lang;return p+(l==='en'?'?lang=en':'')};
gonder(yol());
/* uygulama içi önemli an: editör ilk kez açıldığında bir kez say (hangi tasarımın açıldığı gönderilmez) */
let ed=false;const e=document.getElementById('edw');if(e)new MutationObserver(()=>{if(!ed&&!e.hidden){ed=true;gonder('/editor','Editör açıldı')}}).observe(e,{attributes:true,attributeFilter:['hidden']});
window.v4sayac={gonder};
})();
