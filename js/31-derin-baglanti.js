/* =====================================================================
   DERİN BAĞLANTI: rehber sayfalarından Vybble'ı doğrudan açar
   ?yeni=menu            → o türün yeni tasarım sihirbazı (KINDS anahtarı)
   ?sablon=restoran-menusu → o şablon (TPLS adının sade hali)
   Açılış ekranı atlanır, iş bitince adres temizlenir (yenileyince tekrar açılmaz).
   ===================================================================== */
(function(){
'use strict';
const D=document,$=id=>D.getElementById(id);
let q;try{q=new URLSearchParams(location.search)}catch(e){return}
const yeni=(q.get('yeni')||'').trim(),sab=(q.get('sablon')||'').trim();
if(!yeni&&!sab)return;
const slug=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[çğıöşüâî]/g,c=>({'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','â':'a','î':'i'}[c])).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const clean=()=>{try{const u=new URL(location.href);u.searchParams.delete('yeni');u.searchParams.delete('sablon');history.replaceState(history.state,'',u.pathname+(u.search||'')+u.hash)}catch(e){}};
const homeOn=()=>{const h=$('home');return!!h&&!h.hidden};
const run=()=>{try{
  if(sab&&typeof TPLS!='undefined'&&typeof tplGo=='function'){const i=TPLS.findIndex(t=>slug(t.name)===slug(sab));if(i>=0){tplGo(i);return true}}
  if(yeni&&typeof KINDS!='undefined'&&typeof openWiz=='function'&&KINDS.some(k=>k[0]===yeni)){openWiz(yeni);return true}
  if(sab&&typeof KINDS!='undefined'&&typeof openWiz=='function'){const k=KINDS.find(k=>slug(sab).startsWith(k[0]));if(k){openWiz(k[0]);return true}}
 }catch(e){console.warn('derin bağlantı',e)}return false};
let n=0;const tick=()=>{n++;
 try{if(typeof hideSplash=='function'&&$('splash'))hideSplash()}catch(e){}
 if(homeOn()&&!$('splash')){run();clean();return}
 if(n<80)setTimeout(tick,100);else{run();clean()}};
const start=()=>setTimeout(tick,60);
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',start);else start();
window.v4link={slug};
})();
