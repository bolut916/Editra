/* =====================================================================
   İLK AÇILIŞ REHBERİ: 3 adımlık, atlanabilir kısa tur
   Yalnız ilk kez gelen ve henüz çalışması olmayan kişiye, bir kez gösterilir.
   Alt bilgideki "Nasıl çalışır?" bağlantısıyla yeniden açılır.
   Otomatik tarayıcılarda (navigator.webdriver) kendiliğinden açılmaz.
   ===================================================================== */
(function(){
'use strict';
const D=document,R=D.documentElement,$=id=>D.getElementById(id);
const EN=!!(window.v4i18n&&v4i18n.lang==='en');
const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)')}catch(e){return{matches:false}}})();
const reduced=()=>(RM.matches&&R.dataset.motion!='on')||R.dataset.motion=='reduce';
const KEY='vy-tur';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STEPS=EN?[
 {i:'📸',h:'Upload a photo',p:'Start with a product shot, a dish or any image. You can also pick one of 46 templates.'},
 {i:'✨',h:'The layout builds itself',p:'Vybble places the headline, text and colours for you. Don’t like it? Tap “Layout” or “🎲 Another” for a new one, then edit anything by hand.'},
 {i:'🖨️',h:'Print or share',p:'Download a print-ready PDF, or send it straight to WhatsApp, Mail or iCloud. Your designs stay on your device.'}]
:[
 {i:'📸',h:'Fotoğrafını yükle',p:'Bir ürün fotoğrafı, bir tabak ya da herhangi bir görselle başla. İstersen 46 hazır şablondan birini de seçebilirsin.'},
 {i:'✨',h:'Düzen kendiliğinden gelir',p:'Başlığı, yazıyı ve renkleri Vybble yerleştirir. Beğenmezsen “Düzen” ya da “🎲 Başka”ya dokun; sonra her şeyi elle değiştir.'},
 {i:'🖨️',h:'Bas ya da paylaş',p:'Matbaaya hazır PDF indir ya da doğrudan WhatsApp, Mail veya iCloud’a gönder. Çalışmaların cihazında kalır.'}];
const L=EN?{next:'Next',back:'Back',skip:'Skip',go:'Try it now',tpl:'Browse templates',how:'How it works',lab:'Quick tour',x:'Close'}:{next:'İleri',back:'Geri',skip:'Atla',go:'Hemen dene',tpl:'Şablonlara bak',how:'Nasıl çalışır?',lab:'Kısa tanıtım',x:'Kapat'};
let el=null,i=0,lastFocus=null;
const seen=()=>{try{return!!localStorage.getItem(KEY)}catch(e){return true}};
const mark=()=>{try{localStorage.setItem(KEY,String(Date.now()))}catch(e){}};
function close(){if(!el)return;mark();const e=el;el=null;D.removeEventListener('keydown',key,true);if(reduced()){e.remove()}else{e.classList.add('out');setTimeout(()=>e.remove(),260)}try{lastFocus&&lastFocus.focus&&lastFocus.focus()}catch(x){}}
function draw(){const s=STEPS[i],last=i==STEPS.length-1;
 el.querySelector('.tur-st').innerHTML=`<div class="tur-ic" aria-hidden="true">${s.i}</div><h2 id="tur-h">${esc(s.h)}</h2><p>${esc(s.p)}</p>`;
 el.querySelectorAll('.tur-dots i').forEach((d,k)=>d.classList.toggle('on',k==i));
 el.querySelector('.tur-n').textContent=(i+1)+' / '+STEPS.length;
 el.querySelector('[data-t=back]').hidden=i==0;el.querySelector('[data-t=next]').hidden=last;el.querySelector('.tur-end').hidden=!last;
 if(!reduced()){const st=el.querySelector('.tur-st');st.classList.remove('in');void st.offsetWidth;st.classList.add('in')}
 const f=last?el.querySelector('[data-t=go]'):el.querySelector('[data-t=next]');if(f)f.focus()}
function key(e){if(!el)return;if(e.key=='Escape'){e.preventDefault();e.stopPropagation();close()}else if(e.key=='ArrowRight'&&i<STEPS.length-1){i++;draw()}else if(e.key=='ArrowLeft'&&i>0){i--;draw()}
 else if(e.key=='Tab'){const f=[...el.querySelectorAll('button:not([hidden])')].filter(b=>b.offsetParent);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&D.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&D.activeElement===z){e.preventDefault();a.focus()}}}
function open(){if(el)return;i=0;lastFocus=D.activeElement;el=D.createElement('div');el.className='tur';el.setAttribute('data-noi18n','');
 el.innerHTML=`<div class="tur-bg" data-t="x"></div><div class="tur-c" role="dialog" aria-modal="true" aria-labelledby="tur-h" aria-label="${esc(L.lab)}">
  <button type="button" class="tur-x" data-t="x" aria-label="${esc(L.x)}">✕</button><span class="tur-n"></span>
  <div class="tur-st"></div><div class="tur-dots" aria-hidden="true">${STEPS.map(()=>'<i></i>').join('')}</div>
  <div class="tur-a"><button type="button" class="b" data-t="back">${esc(L.back)}</button><button type="button" class="b tur-sk" data-t="x">${esc(L.skip)}</button><button type="button" class="pb" data-t="next">${esc(L.next)} →</button>
  <span class="tur-end"><button type="button" class="b" data-t="tpl">${esc(L.tpl)}</button><button type="button" class="pb" data-t="go">${esc(L.go)} →</button></span></div></div>`;
 D.body.appendChild(el);el.addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;const t=b.dataset.t;
  if(t=='x')close();else if(t=='next'){i=Math.min(STEPS.length-1,i+1);draw()}else if(t=='back'){i=Math.max(0,i-1);draw()}
  else if(t=='go'){close();try{if(typeof openWiz=='function')openWiz('dergi')}catch(x){}}
  else if(t=='tpl'){close();const tp=$('tpls');if(tp)tp.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'})}});
 /* telefonda kaydırarak geç */
 let x0=null;const c=el.querySelector('.tur-c');c.addEventListener('pointerdown',e=>{x0=e.clientX},{passive:true});c.addEventListener('pointerup',e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)<50)return;if(dx<0&&i<STEPS.length-1){i++;draw()}else if(dx>0&&i>0){i--;draw()}},{passive:true});
 D.addEventListener('keydown',key,true);draw()}
/* "Nasıl çalışır?" bağlantısı */
const nav=D.querySelector('.lp-foot nav');if(nav&&!nav.querySelector('.tur-l')){const a=D.createElement('a');a.href='#';a.className='tur-l';a.textContent=L.how;a.setAttribute('data-noi18n','');a.addEventListener('click',e=>{e.preventDefault();open()});nav.insertBefore(a,nav.firstChild)}
/* kendiliğinden göster: ilk ziyaret, çalışma yok, açılış ekranı kapandıktan sonra */
const auto=()=>{try{if(seen()||navigator.webdriver)return;const h=$('home');if(!h||h.hidden||$('splash'))return;if(!h.classList.contains('noproj'))return;if(!$('wiz')||!$('wiz').hidden)return;open()}catch(e){}};
let tries=0;const wait=()=>{if(seen())return;if($('splash')&&tries++<40)return setTimeout(wait,250);setTimeout(auto,900)};
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',wait);else wait();
window.v4tur={open,close};
})();
