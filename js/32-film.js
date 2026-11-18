/* =====================================================================
   TANITIM FİLMİ: ana sayfadaki sessiz video. Ekrana girince yüklenir ve
   oynar, çıkınca durur. Geniş ekranda yatay, telefonda dikey video.
   "Hareketi azalt" açıksa kendiliğinden oynamaz; düğmeyle oynatılır.
   ===================================================================== */
(function(){
'use strict';
const D=document,R=D.documentElement,$=id=>D.getElementById(id);
const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)')}catch(e){return{matches:false}}})();
const reduced=()=>(RM.matches&&R.dataset.motion!='on')||R.dataset.motion=='reduce';
const NARROW=(()=>{try{return matchMedia('(max-width: 760px)')}catch(e){return{matches:false}}})();
const homeOn=()=>{const h=$('home');return!!h&&!h.hidden};
const box=D.querySelector('#lp-film .lpf-v');if(!box)return;
const vw=box.querySelector('.lpf-w'),vt=box.querySelector('.lpf-t'),btn=box.querySelector('.lpf-b');
let vis=false,user=null;/* user: null=otomatik, true=oynat, false=durdur */
const cur=()=>NARROW.matches?vt:vw,other=()=>NARROW.matches?vw:vt;
const load=v=>{const s=v.querySelector('source');if(s&&!s.src&&s.dataset.src){s.src=s.dataset.src;v.load()}};
const label=()=>{const on=!cur().paused;box.classList.toggle('on',on);const t=window.v4i18n?v4i18n.t(on?'film.pause':'film.play'):(on?'Videoyu durdur':'Videoyu oynat');btn.setAttribute('aria-label',t);btn.title=t};
const sync=()=>{const v=cur(),o=other();try{o.pause()}catch(e){}
 const want=user===true||(user===null&&vis&&homeOn()&&!reduced()&&!D.hidden);
 if(want){load(v);const p=v.play();if(p&&p.catch)p.catch(()=>{});}else{try{v.pause()}catch(e){}}label()};
btn.addEventListener('click',()=>{const v=cur();user=v.paused;sync()});
[vw,vt].forEach(v=>{v.addEventListener('play',label);v.addEventListener('pause',label)});
if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(!vis&&user===true)user=null;sync()},{threshold:.35}).observe(box);else{vis=true}
try{NARROW.addEventListener('change',sync)}catch(e){}
D.addEventListener('visibilitychange',sync);
const h=$('home');if(h)new MutationObserver(sync).observe(h,{attributes:true,attributeFilter:['hidden']});
new MutationObserver(sync).observe(R,{attributes:true,attributeFilter:['data-motion']});
sync();window.v4film={sync,state:()=>({vis,user,playing:!cur().paused,src:cur().currentSrc})};
})();
