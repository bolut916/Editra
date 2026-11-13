/* ================= ÇALIŞMA DÜZENİ: boşa tıklayınca seçimi bırak, gruplu araç şeridi ================= */
(function(){
const rail=document.getElementById('rail');if(!rail||!window.v4ui)return;
const ui=window.v4ui;

/* ---------- 1) Çalışma alanında boş bir yere tıklayınca seçim boşa düşsün ---------- */
/* Seç aracındayken öğe dışındaki her yer (sayfanın boş kısmı ya da gri çalışma alanı) seçimi kaldırır.
   Sürükleme, kaydırma ve iki parmakla yakınlaştırma seçimi bozmaz. */
const SKIP='.e,[data-hd],[data-th],.th,.th-rot,#nes,.gd,#mini,#rlh,#rlv,#rlc,.rband,.pin,textarea,input,select,button,a';
const act=new Set();let dn=null;
function canDesel(ev){
 if(ev.button||ev.shiftKey||ev.ctrlKey||ev.metaKey||ev.altKey)return false;
 if(typeof PROJ=='undefined'||!PROJ||typeof SDK=='undefined'||SDK.tool!='v'||SDK.space||SDK.prev)return false;
 const t=ev.target;if(!t||!t.closest||!t.closest('#edw .cvh'))return false;
 if(t.closest(SKIP))return false;
 if(document.body.classList.contains('cropping'))return false;
 const cm=document.getElementById('cm');if(cm&&cm.getAttribute('aria-pressed')=='true')return false;
 return true}
window.addEventListener('pointerdown',ev=>{act.add(ev.pointerId);if(act.size>1){dn=null;return}dn=canDesel(ev)?{x:ev.clientX,y:ev.clientY,id:ev.pointerId}:null},true);
const up=ev=>{act.delete(ev.pointerId);const d=dn;if(!d||ev.pointerId!=d.id)return;dn=null;
 if(ev.type=='pointercancel'||Math.abs(ev.clientX-d.x)+Math.abs(ev.clientY-d.y)>6)return;
 if(S.sel==null&&!(typeof MSEL!='undefined'&&MSEL.size))return;
 setTimeout(desel,0)};
window.addEventListener('pointerup',up,true);window.addEventListener('pointercancel',up,true);
function desel(){if(typeof MSEL!='undefined')MSEL.clear();S.sel=null;render();list();ed();try{ui.stBar()}catch(x){}}
window.v4desel=desel;

/* ---------- 2) Gruplu araç şeridi ---------- */
/* Her grup tek düğme: son kullanılan aracı gösterir. Sağ tık, basılı tutma ya da köşedeki üçgen grubu açar. */
const GROUPS=[
 {id:'sec',n:'Seçim araçları',t:['v','a']},
 {id:'yaz',n:'Metin',t:['t']},
 {id:'sek',n:'Şekil araçları',t:['m','l','b','u'],shapes:1},
 {id:'ciz',n:'Çizim araçları',t:['n','p','x']},
 {id:'gor',n:'Görsel',t:['i']},
 {id:'olc',n:'Renk ve ölçü',t:['e','o']},
 {id:'gez',n:'Gezinme',t:['h','z']}
];
/* mevcut düğmelerden ad, simge ve kısayolu topla (yeni eklenen araçlar da kaybolmasın) */
const INFO={};
rail.querySelectorAll('button[data-tool]').forEach(b=>{const k=b.dataset.tool,kb=b.querySelector('kbd'),sv=b.querySelector('svg');
 INFO[k]={n:b.getAttribute('aria-label')||k,ti:(b.title||'').replace(/\s*\([^)]*\)\s*$/,''),s:kb?kb.textContent:'',ic:sv?sv.outerHTML:''}});
GROUPS.forEach(g=>g.t=g.t.filter(k=>INFO[k]));
const known=new Set(GROUPS.flatMap(g=>g.t));
Object.keys(INFO).forEach(k=>{if(!known.has(k))GROUPS.push({id:'x'+k,n:INFO[k].n,t:[k]})});
const LIVE=GROUPS.filter(g=>g.t.length);
const pref=(k,v)=>{try{if(v===undefined)return localStorage.getItem('ed-grp-'+k);localStorage.setItem('ed-grp-'+k,v)}catch(x){}return null};
LIVE.forEach(g=>{const p=pref(g.id);g.cur=p&&g.t.includes(p)?p:g.t[0]});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=k=>{const i=INFO[k];return i.ti||i.n};

/* eski tek tek düğmeleri kaldır, grupları şeridin başına koy */
rail.querySelectorAll('button[data-tool]').forEach(b=>b.remove());
const box=document.createElement('div');box.className='rgs';box.setAttribute('role','toolbar');box.setAttribute('aria-label','Araç grupları');
box.innerHTML=LIVE.map((g,i)=>(i&&(i==1||i==4||i==6)?'<i class="rsep" aria-hidden="true"></i>':'')+
 `<button class="rb rg" type="button" data-grp="${g.id}" data-tool="${g.cur}" aria-pressed="false"${g.t.length>1||g.shapes?' aria-haspopup="menu"':''}></button>`).join('');
rail.insertBefore(box,rail.firstChild);
function paint(){const t=SDK.tool;LIVE.forEach(g=>{const b=box.querySelector(`[data-grp="${g.id}"]`);if(!b)return;
 if(g.t.includes(t)&&g.cur!=t){g.cur=t;pref(g.id,t)}
 const i=INFO[g.cur],many=g.t.length>1||g.shapes;
 b.dataset.tool=g.cur;b.setAttribute('aria-pressed',g.t.includes(t));
 b.setAttribute('aria-label',(many?g.n+': ':'')+i.n);
 b.title=label(g.cur)+(i.s?' ('+i.s+')':'')+(many?' · sağ tık ya da basılı tut: diğer araçlar':'');
 b.innerHTML=i.ic+(i.s?`<kbd>${esc(i.s)}</kbd>`:'')+(many?'<i class="rgc" aria-hidden="true"></i>':'')})}
paint();
new MutationObserver(paint).observe(document.body,{attributes:true,attributeFilter:['data-tool']});

/* şekil kütüphanesi simgeleri */
const P=window.v4path;
function shapeIcon(id){if(!P||!P.SHAPES)return'';const s=P.SHAPES.find(x=>x[0]==id);if(!s)return'';
 const S0=v=>(2+v*20).toFixed(2),svgW=d=>`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="${d}" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill-rule="evenodd"/></svg>`;
 if(id=='ring')return svgW('M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0ZM6.2 12a5.8 5.8 0 1 0 11.6 0a5.8 5.8 0 1 0 -11.6 0Z');
 let nd;try{nd=s[2]({n:5,ir:.45,rd:0})}catch(x){return''}if(!nd||!nd.length)return'';
 let d=`M${S0(nd[0][0])} ${S0(nd[0][1])}`;
 for(let i=1;i<=nd.length;i++){const a=nd[i-1],b=nd[i%nd.length];
  d+=`C${S0(a[0]+(a[4]||0))} ${S0(a[1]+(a[5]||0))} ${S0(b[0]+(b[2]||0))} ${S0(b[1]+(b[3]||0))} ${S0(b[0])} ${S0(b[1])}`}
 return svgW(d+'Z')}

/* açılır grup menüsü */
let fly=null,flyG=null,flyBtn=null;
function closeFly(){if(!fly)return;fly.remove();fly=null;flyG=null;if(flyBtn){flyBtn.setAttribute('aria-expanded','false');flyBtn=null}}
function openFly(b,focus){const g=LIVE.find(x=>x.id==b.dataset.grp);if(!g)return;if(flyG==g){closeFly();return}closeFly();
 if(g.t.length<2&&!g.shapes)return;
 fly=document.createElement('div');fly.className='rfly';fly.setAttribute('role','menu');fly.setAttribute('aria-label',g.n);flyG=g;flyBtn=b;b.setAttribute('aria-expanded','true');
 let h=`<div class="rfh">${esc(g.n)}</div>`+g.t.map(k=>{const i=INFO[k];return `<button type="button" role="menuitemradio" aria-checked="${SDK.tool==k}" data-ft="${k}">${i.ic}<span>${esc(label(k))}</span>${i.s?`<kbd>${esc(i.s)}</kbd>`:''}</button>`}).join('');
 if(g.shapes&&P&&P.SHAPES&&g.t.includes('u')){const on=SDK.tool=='u'&&P.SH?P.SH.t:null;
  h+=`<div class="rfh">Şekil kütüphanesi</div><div class="rfs">`+P.SHAPES.map(s=>`<button type="button" role="menuitemradio" aria-checked="${on==s[0]}" data-fs="${s[0]}" title="${esc(s[1])}" aria-label="${esc(s[1])}">${shapeIcon(s[0])}<small>${esc(s[1])}</small></button>`).join('')+'</div>'}
 fly.innerHTML=h;document.body.appendChild(fly);
 const r=b.getBoundingClientRect(),W=fly.offsetWidth,H=fly.offsetHeight,vw=innerWidth,vh=innerHeight,row=getComputedStyle(rail).flexDirection=='row';
 if(row){fly.style.left=Math.max(8,Math.min(r.left,vw-W-8))+'px';fly.style.top=Math.max(8,r.top-H-8)+'px'}
 else{fly.style.left=Math.min(r.right+8,vw-W-8)+'px';fly.style.top=Math.max(8,Math.min(r.top-6,vh-H-8))+'px'}
 fly.addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;
  if(x.dataset.fs){if(P&&P.SH)P.SH.t=x.dataset.fs;closeFly();ui.useTool('u');try{ui.stBar()}catch(z){}return}
  if(x.dataset.ft){closeFly();ui.useTool(x.dataset.ft)}});
 fly.addEventListener('keydown',e=>{const L=[...fly.querySelectorAll('button')],i=L.indexOf(document.activeElement);
  if(e.key=='ArrowDown'||e.key=='ArrowRight'){e.preventDefault();(L[i+1]||L[0]).focus()}
  else if(e.key=='ArrowUp'||e.key=='ArrowLeft'){e.preventDefault();(L[i-1]||L[L.length-1]).focus()}
  else if(e.key=='Escape'||e.key=='Tab'){e.preventDefault();e.stopPropagation();const bb=flyBtn;closeFly();if(bb)bb.focus()}});
 if(focus){const f=fly.querySelector('[aria-checked=true]')||fly.querySelector('button');if(f)f.focus()}}
document.addEventListener('pointerdown',e=>{if(fly&&!e.target.closest('.rfly')&&!e.target.closest('.rg'))closeFly()},true);
addEventListener('resize',closeFly);document.addEventListener('scroll',closeFly,true);
document.addEventListener('keydown',e=>{if(fly&&e.key=='Escape'){e.preventDefault();e.stopImmediatePropagation();const bb=flyBtn;closeFly();if(bb)bb.focus()}},true);

/* basılı tutma, sağ tık, köşe üçgeni */
let lp=null,ate=0;
box.addEventListener('pointerdown',e=>{const b=e.target.closest('.rg');if(!b||e.button)return;ate=0;clearTimeout(lp&&lp.t);
 lp={x:e.clientX,y:e.clientY,t:setTimeout(()=>{ate=1;lp=null;openFly(b);if(navigator.vibrate)try{navigator.vibrate(8)}catch(x){}},430)}});
const lpEnd=()=>{if(lp){clearTimeout(lp.t);lp=null}};
box.addEventListener('pointermove',e=>{if(lp&&Math.abs(e.clientX-lp.x)+Math.abs(e.clientY-lp.y)>8)lpEnd()});
box.addEventListener('pointerup',lpEnd);box.addEventListener('pointercancel',lpEnd);box.addEventListener('pointerleave',lpEnd);
box.addEventListener('contextmenu',e=>{const b=e.target.closest('.rg');if(!b)return;e.preventDefault();lpEnd();if(!ate)openFly(b);ate=1});
/* yakalama aşamasında: araç düğmesinin olağan tıklamasından önce karar ver */
rail.addEventListener('click',e=>{const b=e.target.closest('.rg');if(!b)return;
 if(ate){ate=0;e.preventDefault();e.stopImmediatePropagation();return}
 const r=b.getBoundingClientRect(),corner=e.clientX>r.right-15&&e.clientY>r.bottom-15&&e.detail>0,g=LIVE.find(x=>x.id==b.dataset.grp);
 if(corner&&g&&(g.t.length>1||g.shapes)){e.preventDefault();e.stopImmediatePropagation();openFly(b);return}
 closeFly()},true);
box.addEventListener('keydown',e=>{const b=e.target.closest('.rg');if(!b)return;
 if(e.key=='ArrowDown'&&e.altKey||e.key=='ContextMenu'||(e.key=='F10'&&e.shiftKey)){e.preventDefault();openFly(b,true)}});

window.v4groups={GROUPS:LIVE,open:id=>{const b=box.querySelector(`[data-grp="${id}"]`);if(b)openFly(b,true)},close:closeFly};
})();
