/* =====================================================================
   LOGODAN BAŞLA: ana sayfada "🎨 Logomdan başla"
   Logo seçilir → ne tasarlanacağı seçilir (sihirbaz) → tasarım açılınca var olan
   marka kiti (03: brandKit/brandApply) logodan renk ve yazı tipini çıkarıp tüm
   sayfalara uygular; logo ilk sayfanın köşesine yerleşir.
   ===================================================================== */
(function(){
'use strict';
const D=document,$=id=>D.getElementById(id);
const EN=!!(window.v4i18n&&v4i18n.lang==='en');
const L=EN?{btn:'🎨 Start from my logo',tip:'Colours and fonts come from your logo',pick:'Logo received · now choose what to design',done:'Brand applied from your logo ✓'}:{btn:'🎨 Logomdan başla',tip:'Renkler ve yazı tipleri logondan gelsin',pick:'Logo alındı · şimdi ne tasarlayacağını seç',done:'Logondan marka uygulandı ✓'};
let logo=null;
const cta=D.querySelector('#home .lp-cta');
if(cta&&!$('hlogo')){const lb=D.createElement('label');lb.className='lp-btn lp-logo';lb.htmlFor='hlogof';lb.textContent=L.btn;lb.title=L.tip;lb.setAttribute('data-noi18n','');
 const inp=D.createElement('input');inp.type='file';inp.id='hlogof';inp.accept='image/*';inp.hidden=true;lb.id='hlogo';cta.append(lb,inp);
 inp.addEventListener('change',()=>{const f=inp.files&&inp.files[0];inp.value='';if(!f||!/^image\//.test(f.type))return;logo=f;try{openWiz('katalog')}catch(e){}if(typeof toast=='function')toast(L.pick)})}
/* sihirbaz bitince markayı uygula */
const w0=window.wizGo;
if(typeof w0=='function'){window.wizGo=function(){const r=w0.apply(this,arguments);if(logo){const f=logo;logo=null;setTimeout(()=>apply(f),900)}return r}}
/* sihirbaz kapatılırsa bekleyen logoyu unut */
const wz=$('wiz');if(wz)new MutationObserver(()=>{if(wz.hidden&&logo&&($('edw')||{}).hidden)setTimeout(()=>{if(($('edw')||{}).hidden)logo=null},400)}).observe(wz,{attributes:true,attributeFilter:['hidden']});
/* logo kalıcı olsun: blob adresi yerine dosyanın kendisi (data URL) */
const asData=f=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(String(fr.result));fr.onerror=()=>r(null);fr.readAsDataURL(f)});
async function apply(f){try{if(typeof brandKit!='function'||typeof brandApply!='function')return;await brandKit(f);if(typeof BK=='undefined'||!BK)return;brandApply();
  /* logoyu ilk sayfanın sol üstüne koy */
  /* sayfa küçük resimleri üretilirken sayfa geçici olarak değişir; bitmesini bekle */
  const idle=async()=>{for(let k=0;k<100;k++){const busy=(typeof PGOV!='undefined'&&PGOV!==null)||PROJ.pages.some(p=>!p.thumb);if(!busy)break;await new Promise(r=>setTimeout(r,60))}await new Promise(r=>setTimeout(r,120))};
  await idle();const url=(await asData(f))||BK.logo;if(url&&typeof mk=='function'&&typeof goPage=='function'){goPage(0);const im=getIm(url);if(im.decode)await im.decode().catch(()=>0);const ar=(im.naturalWidth||1)/(im.naturalHeight||1);const w=Math.min(18,11*Math.sqrt(ar)),h=w/ar;
   const e=mk('img');e.src=url;e.im=im;e.fit='contain';/* yazıyla en az çakışan köşe */const H=100/S.fmt,mg=4,cands=[[mg,mg],[100-mg-w,mg],[mg,H-mg-h],[100-mg-w,H-mg-h]];render();const cvr=document.getElementById('cv').getBoundingClientRect(),u=100/(cvr.width||1),R=[];
   /* yazının kutusu değil, gerçekten yazı olan alan */document.querySelectorAll('#cv .e.tx').forEach(n=>{const rg=document.createRange();rg.selectNodeContents(n);[...rg.getClientRects()].forEach(q=>{if(q.width>1)R.push([3,[(q.left-cvr.left)*u,(q.top-cvr.top)*u,q.width*u,q.height*u]])})});
   S.els.filter(x=>x.type=='img'&&x.on!==false).forEach(x=>{try{R.push([1,geo(x,100)])}catch(z){}});
   const ov=([x,y])=>R.reduce((t,[k,[a,b,c,d]])=>t+k*Math.max(0,Math.min(x+w,a+c)-Math.max(x,a))*Math.max(0,Math.min(y+h,b+d)-Math.max(y,b)),0);let best=cands[0],bo=1e9;cands.forEach(c=>{const q=ov(c);if(q<bo-1e-6){bo=q;best=c}});
   e.fr=[+best[0].toFixed(2),+best[1].toFixed(2),+w.toFixed(2),+h.toFixed(2)];e.pin=true;e.nm='Logo';e.z=Math.max(0,...S.els.map(x=>x.z||0))+20;S.els.push(e);try{PROJ.pages[PROJ.cur].s=pageSnap()}catch(x){}render();hist();if(typeof saveNow=='function')saveNow()}
  if(typeof toast=='function')setTimeout(()=>toast(L.done),300)}catch(e){console.warn('logodan',e)}}
window.v4logodan={apply};
})();
