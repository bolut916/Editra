/* ================= STÜDYO: yeni arayüz (araç şeridi, bağlamsal çubuk, tek panel, Adobe kısayolları) ================= */
var SDK={tool:'v',zm:1,space:false,dtab:1,force:0,clip:null,tt:'t',fm:0,hide:false,prev:false};
(function(){
const svg=(d,w)=>`<svg viewBox="0 0 24 24" width="${w||20}" height="${w||20}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC={
 v:svg('<path d="M5 3l14 7-6.2 2.2L10.5 19z"/>'),
 t:svg('<path d="M5 6V5h14v1M12 5v14M9 19h6"/>'),
 m:svg('<rect x="4" y="6" width="16" height="12" rx="1.5"/>'),
 l:svg('<ellipse cx="12" cy="12" rx="8" ry="6"/>'),
 b:svg('<path d="M5 19L19 5"/>'),
 i:svg('<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M4 17l5-5 4 4 3-3 4 4"/>'),
 h:svg('<path d="M8 13V6.5a1.5 1.5 0 013 0V12m0-6.5a1.5 1.5 0 013 0V12m0-4.5a1.5 1.5 0 013 0V15a6 6 0 01-6 6h-.5a6 6 0 01-5-2.7L4.5 14a1.5 1.5 0 012.4-1.7L8 13.5"/>'),
 p:svg('<path d="M4 20c3-1 4-3 5-5l8-9 3 3-9 8c-2 1-4 2-7 3z"/><path d="M14 8l3 3"/>'),
 z:svg('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M8.5 11h5M11 8.5v5"/>'),
 pg:svg('<rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M12 9v6M9 12h6"/>'),
 k:svg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>'),
 pn:svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>'),
 al:{l:svg('<path d="M4 3v18M8 7h12v4H8zM8 14h7v4H8z"/>',16),ch:svg('<path d="M12 3v18M5 7h14v4H5zM8 14h8v4H8z"/>',16),r:svg('<path d="M20 3v18M4 7h12v4H4zM9 14h7v4H9z"/>',16),t:svg('<path d="M3 4h18M7 8v12h4V8zM14 8v7h4V8z"/>',16),cv:svg('<path d="M3 12h18M7 5h4v14H7zM14 8h4v8h-4z"/>',16),b:svg('<path d="M3 20h18M7 4v12h4V4zM14 9v7h4V9z"/>',16)}
};
const TOOLS=[['v','Seç','V'],['t','Metin','T'],['m','Dikdörtgen','M'],['l','Elips','L'],['b','Çizgi','\\'],['i','Görsel yerleştir','I'],['p','Fırça · karalama','B'],['z','Yakınlaştır','Z']];
const TT=[['t','Başlık'],['s','Alt başlık'],['b','Paragraf'],['m','Künye'],['q','Alıntı']];
const inField=e=>/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||'')||(e.target&&e.target.isContentEditable);
const q=s=>document.querySelector(s);

/* ---------- komut kayıt defteri: kısayollar, palet ve kılavuz tek kaynaktan ---------- */
const hasSel=()=>selEls().length>0;
const need=f=>()=>{if(!hasSel())return toast('Önce bir öğe seç');f()};
function setTool(t){if(window.v4toolHook)v4toolHook(t);SDK.tool=t;document.body.dataset.tool=t;document.querySelectorAll('#rail [data-tool]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tool==t));stBar()}
function stFile(){let f=$('stf');if(!f){f=document.createElement('input');f.type='file';f.id='stf';f.accept='image/*';f.multiple=true;f.hidden=true;f.onchange=()=>{files([...f.files]);f.value=''};document.body.appendChild(f)}f.click()}
function useTool(t){if(t=='i'){setTool('v');stFile();return}setTool(t)}
function nudgeZ(d,x,y){stZoom(SDK.zm*(d>0?1.25:.8),x,y)}
function stOpacity(n){const L=selEls();if(!L.length)return;L.forEach(o=>o.op=n==0?100:n*10);render();hist();ed()}
function stCopy(cut){const L=selEls();if(!L.length)return toast('Önce bir öğe seç');SDK.clip=L.map(o=>JSON.parse(JSON.stringify({...o,im:null})));toast(cut?'Kesildi':'Kopyalandı');if(cut)stDel()}
function stDel(){const ids=selIds();if(!ids.length)return;S.els=S.els.filter(x=>!ids.includes(x.id));MSEL.clear();S.sel=S.els[0]&&S.els[0].id;render();list();ed();hist()}
function stPaste(inPlace){if(!SDK.clip||!SDK.clip.length)return toast('Panoda öğe yok');const gm={},N=SDK.clip.map(o=>{const n=JSON.parse(JSON.stringify(o));n.id=nid();if(n.type=='img')n.im=n.src?getIm(n.src):new Image();n.dx=+((n.dx||0)+(inPlace?0:2)).toFixed(2);n.dy=+((n.dy||0)+(inPlace?0:2)).toFixed(2);n.z=topZ()+10;delete n.cid;delete n.cix;if(o.gid){gm[o.gid]=gm[o.gid]||nid();n.gid=gm[o.gid]}return n});
 S.els.push(...N);MSEL.clear();N.forEach((n,i)=>{if(i)MSEL.add(n.id)});S.sel=N[0].id;render();list();ed();hist();toast(N.length>1?N.length+' öğe yapıştırıldı':'Yapıştırıldı')}
function stDup(){const L=selEls();if(!L.length)return toast('Önce bir öğe seç');const keep=SDK.clip;SDK.clip=L.map(o=>JSON.parse(JSON.stringify({...o,im:null})));stPaste(false);SDK.clip=keep}
function stSelAll(){if(S.sel==null&&S.els[0])S.sel=S.els[0].id;S.els.forEach(x=>{if(x.id!==S.sel&&x.on&&!x.lock)MSEL.add(x.id)});render();list();ed()}
function stDesel(){MSEL.clear();S.sel=null;render();list();ed()}
function stLock(v){selEls().forEach(o=>o.lock=v);render();list();hist();ed()}
function stHide(v){selEls().forEach(o=>o.on=!v);render();list();hist();ed()}
function stShowAll(){S.els.forEach(o=>o.on=true);render();list();hist()}
function stOrder(m){const e=cur();if(!e)return toast('Önce bir öğe seç');lmove(e.id,m)}
function stGrid(){S.grid=!S.grid;const g=$('gr');if(g)g.setAttribute('aria-pressed',S.grid);render();toast(S.grid?'Grid açık':'Grid kapalı')}
function stTogglePanels(){SDK.hide=!SDK.hide;document.body.classList.toggle('nopanel',SDK.hide)}
function stPreview(on){SDK.prev=on==null?!SDK.prev:on;document.body.classList.toggle('prev',SDK.prev);if(SDK.prev)toast('Önizleme · çıkmak için Esc ya da F')}
function stGo(i){goPage(cl(i,0,PROJ.pages.length-1))}
const CMD=[
 // [grup, ad, kısayol(lar), işlev, global?]
 ['Dosya','Kaydet',['Ctrl+S'],()=>saveNow().then(()=>toast('Kaydedildi')),1],
 ['Dosya','Sürüm olarak kaydet',['Ctrl+Shift+S'],()=>{verSave();toast('Sürüm kaydedildi')},1],
 ['Dosya','PNG olarak indir',['Ctrl+E'],()=>exp('png'),1],
 ['Dosya','PDF olarak indir',['Ctrl+P'],()=>exp('pdf'),1],
 ['Dosya','Ana sayfaya dön',[],()=>$('hb').click(),1],
 ['Dosya','Yeni boş sayfa',['Ctrl+Alt+N'],()=>addPage('blank')],
 ['Dosya','Yeni düzenli sayfa',['Ctrl+Alt+Shift+N'],()=>addPage('auto')],
 ['Dosya','Sayfanın kopyasını ekle',[],()=>addPage('dup')],
 ['Düzenle','Geri al',['Ctrl+Z'],()=>undo(-1)],
 ['Düzenle','Yinele',['Ctrl+Shift+Z','Ctrl+Y'],()=>undo(1)],
 ['Düzenle','Kes',['Ctrl+X'],()=>stCopy(true)],
 ['Düzenle','Kopyala',['Ctrl+C'],()=>stCopy(false)],
 ['Düzenle','Yapıştır',['Ctrl+V'],()=>stPaste(false)],
 ['Düzenle','Yerinde yapıştır',['Ctrl+Shift+V'],()=>stPaste(true)],
 ['Düzenle','Çoğalt',['Ctrl+J'],stDup],
 ['Düzenle','Sil',['Delete','Backspace'],()=>stDel()],
 ['Düzenle','Hepsini seç',['Ctrl+A'],stSelAll],
 ['Düzenle','Seçimi kaldır',['Ctrl+Shift+A','Escape'],stDesel],
 ['Düzenle','Metni düzenle',['Enter'],()=>{const e=cur();if(!e||e.txt===undefined)return;if(window.v4edit)return v4edit();stTab(1,1);setTimeout(()=>{const t=document.querySelector('#ed textarea');if(t){t.focus();t.select()}},30)}],
 ['Düzenle','Tüm ayarları aç (Dönüştür)',['Ctrl+T'],need(()=>stTab(1,1))],
 ['Düzenle','Görsel yerleştir…',['Ctrl+D'],stFile],
 ['Düzenle','Opaklık %10 … %100',['1–9, 0'],()=>toast('1 → %10 … 9 → %90 · 0 → %100')],
 ['Düzenle','Taşı (ızgara adımı)',['← ↑ → ↓'],()=>{}],
 ['Düzenle','Büyüt/küçült (ızgara)',['Shift+ok'],()=>{}],
 ['Düzenle','Yakından taşı (serbest)',['Alt+sürükle'],()=>{}],
 ['Düzenle','Çoklu seç',['Shift+tıkla'],()=>{}],
 ['Düzenle','Sonraki öğeyi seç',['Ctrl+Alt+]'],()=>stSibling(1)],
 ['Düzenle','Önceki öğeyi seç',['Ctrl+Alt+['],()=>stSibling(-1)],
 ['Düzenle','Grupla',['Ctrl+G'],()=>V3.gp('g')],
 ['Düzenle','Gruptan çıkar',['Ctrl+Shift+G'],()=>V3.gp('u')],
 ['Sırala','Bir öne',['Ctrl+]',']'],need(()=>stOrder(1))],
 ['Sırala','Bir arkaya',['Ctrl+[','['],need(()=>stOrder(-1))],
 ['Sırala','En öne',['Ctrl+Shift+]'],need(()=>stOrder('front'))],
 ['Sırala','En arkaya',['Ctrl+Shift+['],need(()=>stOrder('back'))],
 ['Sırala','Kilitle',['Ctrl+2'],need(()=>stLock(true))],
 ['Sırala','Kilidi aç',['Ctrl+Alt+2'],need(()=>stLock(false))],
 ['Sırala','Gizle',['Ctrl+3'],need(()=>stHide(true))],
 ['Sırala','Hepsini göster',['Ctrl+Alt+3'],stShowAll],
 ['Hizala','Sola',['Alt+Shift+L'],()=>V3.al('l')],['Hizala','Yatay ortala',['Alt+Shift+C'],()=>V3.al('ch')],['Hizala','Sağa',['Alt+Shift+R'],()=>V3.al('r')],
 ['Hizala','Üste',['Alt+Shift+T'],()=>V3.al('t')],['Hizala','Dikey ortala',['Alt+Shift+M'],()=>V3.al('cv')],['Hizala','Alta',['Alt+Shift+B'],()=>V3.al('b')],
 ['Hizala','Yatay eşit dağıt',['Alt+Shift+H'],()=>V3.ds('h')],['Hizala','Dikey eşit dağıt',['Alt+Shift+V'],()=>V3.ds('v')],
 ['Araçlar','Seçim aracı',['V'],()=>useTool('v')],
 ['Araçlar','Metin aracı',['T'],()=>useTool('t')],
 ['Araçlar','Dikdörtgen aracı',['M'],()=>useTool('m')],
 ['Araçlar','Elips aracı',['L'],()=>useTool('l')],
 ['Araçlar','Çizgi aracı',['\\'],()=>useTool('b')],
 ['Araçlar','Görsel yerleştir',['I'],()=>useTool('i')],
 ['Görünüm','Gezin: Space basılı tut + sürükle',['Space'],()=>toast('Space tuşunu basılı tutup sürükleyerek gezin')],
 ['Araçlar','Fırça (karalama) aracı',['B'],()=>useTool('p')],
 ['Araçlar','Yakınlaştırma aracı',['Z'],()=>useTool('z')],
 ['Görünüm','Yakınlaştır',['Ctrl+=','Ctrl+Plus'],()=>nudgeZ(1)],
 ['Görünüm','Uzaklaştır',['Ctrl+-'],()=>nudgeZ(-1)],
 ['Görünüm','Sayfaya sığdır',['Ctrl+0'],()=>stZoom(1)],
 ['Görünüm','Gerçek boyut',['Ctrl+1'],()=>stActual()],
 ['Görünüm','Yakınlaştır (tekerlek)',['Ctrl+tekerlek','Alt+tekerlek'],()=>{}],
 ['Görünüm','Grid çizgilerini aç/kapat',["Ctrl+'"],stGrid],
 ['Görünüm','Panelleri gizle/göster',['Tab'],stTogglePanels],
 ['Görünüm','Yan paneli gizle/göster',['Ctrl+\\'],()=>stToggle('dk-off','dk')],
 ['Görünüm','Sayfa şeridini gizle/göster',['Ctrl+Alt+P'],()=>stToggle('st-off','st')],
 ['Görünüm','Mini haritayı aç/kapat',['Ctrl+Shift+M'],stMiniToggle],
 ['Görünüm','Seçime yakınlaştır',['Shift+2'],stZoomSel],
 ['Görünüm','Çalışma alanını ortala',['Shift+1'],stCenter],
 ['Görünüm','Çalışma alanında gez',['Space+sürükle','← ↑ → ↓ (seçim yokken)','Shift+tekerlek'],()=>{}],
 ['Görünüm','Tam ekran önizleme',['F'],()=>stPreview()],
 ['Sayfa','Sonraki sayfa',['PageDown','Alt+→'],()=>stGo(PROJ.cur+1)],
 ['Sayfa','Önceki sayfa',['PageUp','Alt+←'],()=>stGo(PROJ.cur-1)],
 ['Sayfa','İlk sayfa',['Home'],()=>stGo(0)],
 ['Sayfa','Son sayfa',['End'],()=>stGo(1e9)],
 ['Yardım','Komut paleti',['Ctrl+K'],()=>stPalette(),1],
 ['Yardım','Kısayol kılavuzu',['?','F1','Ctrl+Alt+Shift+K'],()=>stKeys(),1]
];
/* ---------- tuş eşleştirme ---------- */
const NAME={Delete:'delete',Backspace:'backspace',Escape:'escape',Tab:'tab',Enter:'enter',Space:' ',PageDown:'pagedown',PageUp:'pageup',Home:'home',End:'end',F1:'f1',Plus:'+','→':'arrowright','←':'arrowleft'};
const CODE={'[':'BracketLeft',']':'BracketRight','\\':'Backslash','=':'Equal','-':'Minus',"'":'Quote'};
function kparse(s){const p=s.split('+');let key=p.pop();if(key===''&&s.endsWith('++')){key='+';p.pop()}return{ctrl:p.includes('Ctrl'),shift:p.includes('Shift'),alt:p.includes('Alt'),key:NAME[key]||key.toLowerCase(),raw:key}}
const KM=[];CMD.forEach((c,i)=>c[2].forEach(k=>{if(/^[0-9]–|tekerlek|tıkla|sürükle|ok$|^← /.test(k))return;KM.push({...kparse(k),i})}));
window.v4cmd=c=>{const i=CMD.push(c)-1;c[2].forEach(k=>{if(/^[0-9]–|tekerlek|tıkla|sürükle|ok$|^← /.test(k))return;KM.push({...kparse(k),i})})};
function kok(e,k){const m=e.ctrlKey||e.metaKey;if(k.ctrl!==m||k.alt!==e.altKey)return false;
 if(!(k.key=='+'||k.key=='?')&&k.shift!==e.shiftKey)return false;
 if(CODE[k.raw])return e.code==CODE[k.raw]||(!e.shiftKey&&e.key==k.raw);
 if(k.key=='+')return e.key=='+'||(e.code=='Equal'&&e.shiftKey);
 if(k.key=='?')return e.key=='?'||(e.code=='Slash'&&e.shiftKey);
 if(/^[a-z]$/.test(k.key))return e.key.toLowerCase()==k.key||e.code=='Key'+k.key.toUpperCase();
 if(/^[0-9]$/.test(k.key))return e.key==k.key||e.code=='Digit'+k.key;
 return e.key.toLowerCase()==k.key}
function stKey(e){
 if($('edw').hidden)return;
 if(window.v4keyHook&&v4keyHook(e))return;
 if(document.querySelector('.mdl:not([hidden])')&&!(e.target&&e.target.closest&&e.target.closest('#kpl')))return;
 const kp=$('kpl');if(kp&&!kp.hidden){if(e.key=='Escape'){e.preventDefault();e.stopImmediatePropagation();stPalClose()}return}
 const ks=$('kcs');if(ks&&!ks.hidden){if(e.key=='Escape'||e.key=='?'||e.key=='F1'){e.preventDefault();e.stopImmediatePropagation();ks.hidden=true}return}
 if(e.key==' '&&!inField(e)&&!(e.target.closest&&e.target.closest('.kpl,.mdl,.pop,.rfly,.chat,#home'))&&!$('edw').hidden){e.preventDefault();if(e.target.tagName=='BUTTON')e.target.blur();if(!SDK.space){SDK.space=true;document.body.classList.add('spc')}return}
 const fld=inField(e);
 if(!fld&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!hasSel()&&/^Arrow/.test(e.key)){e.preventDefault();e.stopImmediatePropagation();const s=e.shiftKey?300:80;stPanRel(e.key=='ArrowLeft'?-s:e.key=='ArrowRight'?s:0,e.key=='ArrowUp'?-s:e.key=='ArrowDown'?s:0);return}
 if(!fld&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.shiftKey&&/^[0-9]$/.test(e.key)&&hasSel()){e.preventDefault();e.stopImmediatePropagation();stOpacity(+e.key);return}
 if(e.key=='Escape'&&SDK.prev){e.preventDefault();e.stopImmediatePropagation();stPreview(false);return}
 for(const k of KM){const c=CMD[k.i];
  if(!kok(e,k))continue;
  if(fld&&!c[4])continue; // yazı alanlarında yalnızca genel komutlar
  if(c[1]=='Sil'&&!hasSel())continue;
  if((c[1]=='Seçimi kaldır')&&k.key=='escape'&&S.sel==null&&!MSEL.size)continue;
  if(c[1]=='Metni düzenle'&&(!cur()||cur().txt===undefined))continue;
  if(c[1]=='Sil'&&k.key=='backspace'&&fld)continue;
  if(k.key=='enter'&&/BUTTON|^A$/.test(e.target.tagName))continue;
  if(k.key=='tab'&&e.target!==document.body)continue;
  e.preventDefault();e.stopImmediatePropagation();c[3]();return}
}
window.addEventListener('keydown',stKey,true);
window.addEventListener('keyup',e=>{if(e.key==' '&&SDK.space){e.preventDefault();SDK.space=false;document.body.classList.remove('spc')}},true);
window.addEventListener('blur',()=>{if(SDK.space){SDK.space=false;document.body.classList.remove('spc')}});

/* ---------- yakınlaştırma / kaydırma ---------- */
function stFit(){const w=$('cvw');if(!w||!w.clientWidth)return 0;const aw=w.clientWidth-64,ah=w.clientHeight-64;return Math.max(80,Math.min(aw,ah*S.fmt))}
function stSize(){const f=stFit();if(!f)return;const w=$('cvw');w.style.setProperty('--px',Math.round(w.clientWidth*.7)+'px');w.style.setProperty('--py',Math.round(w.clientHeight*.7)+'px');$('cv').style.width=Math.round(f*SDK.zm)+'px';if(window.abLayout)abLayout();stZl();stMini()}
function stCenter(){if(window.abCenter)return abCenter();const w=$('cvw');w.scrollLeft=(w.scrollWidth-w.clientWidth)/2;w.scrollTop=(w.scrollHeight-w.clientHeight)/2;stMini()}
function stZl(){const b=$('zlab');if(b)b.textContent=Math.round(SDK.zm*100)+'%'}
function stZoom(z,cx,cy){z=Math.max(.1,Math.min(8,+z||1));const w=$('cvw'),cv=$('cv'),r0=cv.getBoundingClientRect(),wr=w.getBoundingClientRect();
 const px=cx==null?wr.left+wr.width/2:cx,py=cy==null?wr.top+wr.height/2:cy,fx=(px-r0.left)/r0.width,fy=(py-r0.top)/r0.height;
 SDK.zm=z;stSize();const r1=cv.getBoundingClientRect();w.scrollLeft+=r1.left+fx*r1.width-px;w.scrollTop+=r1.top+fy*r1.height-py;if(cx==null&&Math.abs(z-1)<.001)stCenter();stMini()}
function stZoomSel(){const e=cur();if(!e)return toast('Önce bir öğe seç');const n=$('cv').querySelector('.e[data-id="'+e.id+'"]');if(!n)return;const w=$('cvw'),wr=w.getBoundingClientRect(),r=n.getBoundingClientRect();
 stZoom(SDK.zm*Math.min(wr.width*.7/r.width,wr.height*.7/r.height,6));const r2=n.getBoundingClientRect();w.scrollLeft+=r2.left+r2.width/2-(wr.left+wr.width/2);w.scrollTop+=r2.top+r2.height/2-(wr.top+wr.height/2);stMini()}
let miniRaf=0;
function stMini(){cancelAnimationFrame(miniRaf);miniRaf=requestAnimationFrame(()=>{const m=$('mini'),w=$('cvw'),cv=$('cv');if(!m||m.hidden||!w||!w.scrollWidth)return;const k=m.clientWidth/w.scrollWidth;m.style.height=Math.max(40,w.scrollHeight*k)+'px';
 const pg=m.firstChild,vw=m.lastChild,cr=cv.getBoundingClientRect(),wr=w.getBoundingClientRect();
 pg.style.cssText=`left:${(cr.left-wr.left+w.scrollLeft)*k}px;top:${(cr.top-wr.top+w.scrollTop)*k}px;width:${cr.width*k}px;height:${cr.height*k}px`;
 vw.style.cssText=`left:${w.scrollLeft*k}px;top:${w.scrollTop*k}px;width:${w.clientWidth*k}px;height:${w.clientHeight*k}px`;if(window.abMini)abMini(m,k)})}
function stPrefGet(k,d){try{const v=localStorage.getItem('ed_'+k);return v===null?d:v}catch(e){return d}}
function stPrefSet(k,v){try{localStorage.setItem('ed_'+k,v)}catch(e){}}
function stToggle(cls,key){const on=document.body.classList.toggle(cls);stPrefSet(key,on?1:0);const b=$('dkt');if(b)b.setAttribute('aria-pressed',!document.body.classList.contains('dk-off'));setTimeout(stSize,30);return on}
function stMiniToggle(){const m=$('mini');m.hidden=!m.hidden;stPrefSet('mini',m.hidden?0:1);stMini()}
function stPanRel(dx,dy){const w=$('cvw');w.scrollBy({left:dx,top:dy})}
function stSibling(d){const L=S.els.filter(x=>x.on&&!x.lock);if(!L.length)return;const i=L.findIndex(x=>x.id==S.sel);const n=L[(i+d+L.length)%L.length];MSEL.clear();pick(n.id)}
function stActual(){const f=stFit();if(!f)return;const px=(S.mm?S.mm[0]:210)*96/25.4;stZoom(px/f)}
window.stZoom=stZoom;
const CVW=$('cvw');
CVW.addEventListener('scroll',()=>stMini(),{passive:true});
CVW.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey||e.altKey){e.preventDefault();stZoom(SDK.zm*Math.exp(-Math.max(-30,Math.min(30,e.deltaY))*.009),e.clientX,e.clientY)}},{passive:false});
let pinch=null;
CVW.addEventListener('touchstart',e=>{if(e.touches.length==2){const a=e.touches[0],b=e.touches[1];pinch={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),z:SDK.zm}}},{passive:true});
CVW.addEventListener('touchmove',e=>{if(pinch&&e.touches.length==2){e.preventDefault();const a=e.touches[0],b=e.touches[1];stZoom(pinch.z*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/pinch.d,(a.clientX+b.clientX)/2,(a.clientY+b.clientY)/2)}},{passive:false});
CVW.addEventListener('touchend',e=>{if(e.touches.length<2)pinch=null},{passive:true});
if(window.ResizeObserver)new ResizeObserver(()=>stSize()).observe(CVW);else addEventListener('resize',stSize);
/* sayfa biçimi değişince sığdırmayı yenile */
const _render=render;render=function(){const r=_render.apply(this,arguments);if(SDK.fm!==S.fmt){SDK.fm=S.fmt;stSize()}return r};

/* ---------- fare: el, yakınlaştırma, çizerek oluşturma ---------- */
function stCell(ev){const r=$('cv').getBoundingClientRect(),W=100,H=100/S.fmt,x=(ev.clientX-r.left)/r.width*W,y=(ev.clientY-r.top)/r.width*W,m=S.mar,g=S.gut,cw=(W-2*m-(S.cols-1)*g)/S.cols,rh=(H-2*m-(S.rows-1)*g)/S.rows;
 return[cl(Math.floor((x-m+g/2)/(cw+g))+1,1,S.cols),cl(Math.floor((y-m+g/2)/(rh+g))+1,1,S.rows)]}
function stMake(type,pos,shape){
 if(S.els.filter(e=>e.type==type&&e.shape!='draw').length>=MAXN)return toast('Bu türden en fazla '+MAXN+' öğe olabilir');
 const e=mk(type);if(shape)e.shape=shape;e.pos=pos;e.z=topZ()+10;S.els.push(e);S.sel=e.id;MSEL.clear();
 if(S.af&&'tsqmb'.includes(type))fit(e);render();list();ed();hist();loadF().then(()=>{if(S.af&&'tsqmb'.includes(type))fit(e);render()});return e}
function stDefault(tool,c,r){let cs,rs;if(tool=='t'){cs=Math.max(1,Math.round(S.cols*.45));rs=Math.max(1,Math.round(S.rows*.16))}else if(tool=='b'){cs=Math.max(1,Math.round(S.cols*.4));rs=1}else{cs=Math.max(1,Math.round(S.cols*.34));rs=Math.max(1,Math.round(S.rows*.24))}
 return[cl(c,1,S.cols-cs+1),cl(r,1,S.rows-rs+1),cs,rs]}
function stCreate(tool,pos){
 if(tool=='t'){const e=stMake(SDK.tt,pos);setTimeout(()=>{if(window.v4edit)return v4edit();stTab(1,1);const t=document.querySelector('#ed textarea');if(t){t.focus();t.select()}},40)}
 else stMake('r',pos,tool=='m'?'rect':tool=='l'?'circle':'line');
 setTool('v')}
let drag=null;
CVW.addEventListener('pointerdown',e=>{
 const t=SDK.tool;
 const pan=t=='h'||SDK.space||e.button==1;
 if(pan&&e.button<=1){e.preventDefault();e.stopImmediatePropagation();drag={k:'pan',x:e.clientX,y:e.clientY,l:CVW.scrollLeft,tp:CVW.scrollTop};CVW.setPointerCapture(e.pointerId);CVW.classList.add('panning');return}
 if(t=='z'){e.preventDefault();e.stopImmediatePropagation();nudgeZ(e.altKey?-1:1,e.clientX,e.clientY);return}
 if('tmlb'.includes(t)&&t!='v'&&e.target.closest('#cv')){
  e.preventDefault();e.stopImmediatePropagation();const c0=stCell(e);drag={k:'make',t,c0,c1:c0,id:e.pointerId};CVW.setPointerCapture(e.pointerId);
  const b=document.createElement('div');b.className='rband';b.id='rband';$('cv').appendChild(b);stBand();return}
},true);
function stBand(){const b=$('rband');if(!b||!drag)return;const{c0,c1}=drag,W=100,H=100/S.fmt,m=S.mar,g=S.gut,cw=(W-2*m-(S.cols-1)*g)/S.cols,rh=(H-2*m-(S.rows-1)*g)/S.rows,
 a=Math.min(c0[0],c1[0]),bb=Math.min(c0[1],c1[1]),w=Math.abs(c0[0]-c1[0])+1,h=Math.abs(c0[1]-c1[1])+1;
 b.style.cssText=`left:${(m+(a-1)*(cw+g))}cqw;top:${(m+(bb-1)*(rh+g))}cqw;width:${w*cw+(w-1)*g}cqw;height:${h*rh+(h-1)*g}cqw`}
CVW.addEventListener('pointermove',e=>{if(!drag)return;
 if(drag.k=='pan'){CVW.scrollLeft=drag.l-(e.clientX-drag.x);CVW.scrollTop=drag.tp-(e.clientY-drag.y)}
 else if(drag.k=='make'){drag.c1=stCell(e);stBand()}});
function endDrag(e){if(!drag)return;const d=drag;drag=null;CVW.classList.remove('panning');try{CVW.releasePointerCapture(e.pointerId)}catch(x){}
 if(d.k=='make'){const b=$('rband');if(b)b.remove();const same=d.c0[0]==d.c1[0]&&d.c0[1]==d.c1[1];
  const pos=same?stDefault(d.t,d.c0[0],d.c0[1]):[Math.min(d.c0[0],d.c1[0]),Math.min(d.c0[1],d.c1[1]),Math.abs(d.c0[0]-d.c1[0])+1,Math.abs(d.c0[1]-d.c1[1])+1];
  if(d.t=='b'&&!same&&pos[3]>1&&pos[2]>1){/* çizgi: yatay ya da dikey olsun */if(pos[2]>=pos[3])pos[3]=1;else pos[2]=1}
  stCreate(d.t,pos)}}
CVW.addEventListener('pointerup',endDrag);CVW.addEventListener('pointercancel',endDrag);

/* ---------- kabuk: üst çubuk, araç şeridi, tek panel ---------- */
function stShell(){
 const edw=$('edw'),app=edw.querySelector('.app'),stage=edw.querySelector('.stage'),top=edw.querySelector('header.top'),tools=top.querySelector('.tools');
 /* araç şeridi */
 const rail=document.createElement('aside');rail.id='rail';rail.setAttribute('aria-label','Araçlar');
 rail.innerHTML=TOOLS.map(([k,n,s])=>`<button class="rb" data-tool="${k}" title="${n} (${s})" aria-label="${n}" aria-pressed="${k=='v'}">${IC[k]}<kbd>${s}</kbd></button>`).join('')
  +'<i class="rsp"></i>'
  +`<button class="rb" data-rc="pg" title="Yeni sayfa (Ctrl+Alt+N)" aria-label="Yeni sayfa">${IC.pg}</button>`
  +`<button class="rb" data-rc="k" title="Komut paleti (Ctrl+K)" aria-label="Komut paleti">${IC.k}</button>`
  +`<button class="rb rdk" data-rc="pn" title="Paneli aç/kapat" aria-label="Panel">${IC.pn}</button>`;
 app.insertBefore(rail,stage);
 rail.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tool)return useTool(b.dataset.tool);
  if(b.dataset.rc=='pg')addPage('blank');else if(b.dataset.rc=='k')stPalette();else document.body.classList.toggle('dk-open')});
 /* sağ panel */
 const dk=document.createElement('aside');dk.id='dockp';
 dk.innerHTML=`<div class="dtabs" id="dtabs" role="tablist">${[['Düzen',0],['Öğe',1],['Stil',2],['Asistan',3]].map(([n,i])=>`<button role="tab" data-dt="${i}" aria-selected="${i==1}">${n}</button>`).join('')}<button class="dclose" data-dc aria-label="Paneli kapat">✕</button></div>`;
 dk.appendChild($('pn'));dk.appendChild($('rp'));app.appendChild(dk);
 dk.querySelector('#dtabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.dc!==undefined)return document.body.classList.remove('dk-open');stTab(+b.dataset.dt)});
 /* çalışma alanı sarmalayıcı + mini harita */
 const h=document.createElement('div');h.className='cvh';const cvw=$('cvw'),dz=cvw.querySelector('.dz');cvw.parentNode.insertBefore(h,cvw);h.appendChild(cvw);if(dz)h.appendChild(dz);const cvp=document.createElement('div');cvp.className='cvp';cvw.insertBefore(cvp,$('cv'));cvp.appendChild($('cv'));
 const mini=document.createElement('div');mini.id='mini';mini.title='Mini harita · tıkla ya da sürükle';mini.innerHTML='<i class="mpg"></i><i class="mvw"></i>';h.appendChild(mini);mini.hidden=stPrefGet('mini',1)==0;
 const mv=e=>{const k=mini.clientWidth/cvw.scrollWidth,r=mini.getBoundingClientRect();cvw.scrollLeft=(e.clientX-r.left)/k-cvw.clientWidth/2;cvw.scrollTop=(e.clientY-r.top)/k-cvw.clientHeight/2};
 let md=0;mini.addEventListener('pointerdown',e=>{md=1;mini.setPointerCapture(e.pointerId);mv(e)});mini.addEventListener('pointermove',e=>{if(md)mv(e)});mini.addEventListener('pointerup',()=>md=0);
 /* bağlamsal çubuk */
 const cb=document.createElement('div');cb.id='cbar';stage.insertBefore(cb,stage.firstChild);
 cb.addEventListener('input',e=>stCb(e,false));cb.addEventListener('change',e=>stCb(e,true));cb.addEventListener('click',stCbClick);
 /* üst çubuk: sade */
 const ids=['sn','gr','hm','cm','th3','set3'],more=document.createElement('div'),pm=document.createElement('div');
 more.className='pop';more.id='mmenu';more.hidden=true;
 ids.forEach(id=>{const b=$(id);if(!b)return;const w=document.createElement('button');w.type='button';w.className='pitem';const lab=document.createElement('span');lab.textContent=b.title.replace(/\s*\(.*\)/,'');b.classList.add('pi-i');w.appendChild(b);w.appendChild(lab);w.addEventListener('click',ev=>{if(ev.target!==b)b.click();more.hidden=true});more.appendChild(w)});
 const mi=(t,k,f)=>{const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML=`<span>${t}</span><kbd>${k}</kbd>`;w.onclick=()=>{more.hidden=true;f()};more.appendChild(w)};
 mi('Komut paleti','Ctrl+K',()=>stPalette());mi('Mini harita','Ctrl+Shift+M',stMiniToggle);mi('Sayfa şeridini gizle','Ctrl+Alt+P',()=>stToggle('st-off','st'));mi('Kısayol kılavuzu','?',()=>stKeys());mi('Tam ekran önizleme','F',()=>stPreview());mi('Panelleri gizle','Tab',stTogglePanels);
 pm.className='pop';pm.id='xmenu';pm.hidden=true;
 pm.innerHTML='<label class="pl">Çözünürlük</label>';pm.appendChild($('px'));
 const pr=document.createElement('div');pr.className='prow';pr.appendChild($('png'));pr.appendChild($('pdf'));pm.appendChild(pr);
 pm.insertAdjacentHTML('beforeend','<small class="mut">PNG: Ctrl+E · PDF: Ctrl+P</small>');
 const zoom=document.createElement('div');zoom.className='zoom';zoom.innerHTML='<button class="ib sm" data-z="-" aria-label="Uzaklaştır" title="Uzaklaştır (Ctrl+-)">−</button><button class="zl" id="zlab" title="Sayfaya sığdır (Ctrl+0)">100%</button><button class="ib sm" data-z="+" aria-label="Yakınlaştır" title="Yakınlaştır (Ctrl+=)">+</button>';
 zoom.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.id=='zlab')stZoom(1);else nudgeZ(b.dataset.z=='+'?1:-1)};
 const mbtn=document.createElement('button');mbtn.className='ib';mbtn.id='mbtn';mbtn.title='Daha fazla';mbtn.setAttribute('aria-label','Daha fazla');mbtn.textContent='⋯';
 const xbtn=document.createElement('button');xbtn.className='pb';xbtn.id='xbtn';xbtn.textContent='Dışa aktar';xbtn.setAttribute('aria-haspopup','true');
 const dkt=document.createElement('button');dkt.className='ib';dkt.id='dkt';dkt.title='Yan paneli gizle/göster (Ctrl+\\)';dkt.setAttribute('aria-label','Yan panel');dkt.innerHTML=IC.pn;dkt.onclick=()=>stToggle('dk-off','dk');
 if(stPrefGet('dk',innerWidth<1200?1:0)==1)document.body.classList.add('dk-off');if(stPrefGet('st',0)==1)document.body.classList.add('st-off');dkt.setAttribute('aria-pressed',!document.body.classList.contains('dk-off'));
 tools.append(zoom,dkt,wrap(mbtn,more),wrap(xbtn,pm));
 mbtn.onclick=e=>{e.stopPropagation();pm.hidden=true;more.hidden=!more.hidden};xbtn.onclick=e=>{e.stopPropagation();more.hidden=true;pm.hidden=!pm.hidden};
 document.addEventListener('click',e=>{if(!e.target.closest('.pw')){more.hidden=true;pm.hidden=true}});
 tools.insertBefore($('un'),zoom);tools.insertBefore($('re'),zoom);
}
function wrap(btn,pop){const w=document.createElement('div');w.className='pw';w.append(btn,pop);return w}

/* ---------- sağ panel sekmeleri ---------- */
function stTab(i,open){SDK.dtab=i;document.querySelectorAll('#dtabs [data-dt]').forEach(b=>b.setAttribute('aria-selected',+b.dataset.dt==i));
 $('pn').hidden=i==3;$('rp').hidden=i!=3;if(i<3){SDK.force=1;showPt(i);SDK.force=0}
 if(open&&innerWidth<900)document.body.classList.add('dk-open')}
const _showPt=showPt;showPt=function(i){_showPt(i);if(SDK.dtab==3&&!SDK.force)return;SDK.dtab=i;document.querySelectorAll('#dtabs [data-dt]').forEach(b=>b.setAttribute('aria-selected',+b.dataset.dt==i));$('pn').hidden=false;$('rp').hidden=true};
window.stTab=stTab;

/* ---------- bağlamsal çubuk ---------- */
const FONTS=()=>Object.entries(FC).map(([g,L])=>`<optgroup label="${g}">${L.map(f=>`<option style="font-family:'${f}'">${f}</option>`).join('')}</optgroup>`).join('');
const ib=(a,t,ic,on)=>`<button class="cbb" ${a} title="${t}" aria-label="${t}" aria-pressed="${!!on}">${ic}</button>`;
let barRaf=0;
function stBar(){cancelAnimationFrame(barRaf);barRaf=requestAnimationFrame(stBar2)}
function stBar2(){const b=$('cbar');if(!b||typeof S=='undefined'||!PROJ)return;const ae=document.activeElement;if(ae&&b.contains(ae)&&/INPUT|SELECT/.test(ae.tagName))return;
 if(window.v4barFor){const x=v4barFor(SDK.tool);if(x!=null){b.innerHTML=x;return}}
 let h='';
 if(SDK.tool=='t'){h=`<span class="cbl">Yazı türü</span>`+TT.map(([k,n])=>`<button class="chip${SDK.tt==k?' on':''}" data-tt="${k}">${n}</button>`).join('')+`<span class="cbh">Tuvalde tıkla ya da sürükleyerek alan çiz</span>`}
 else if(SDK.tool=='m'||SDK.tool=='l'||SDK.tool=='b'){h=`<span class="cbh">Tuvalde tıkla ya da sürükleyerek çiz · ızgaraya oturur</span>`}
 else if(SDK.tool=='p'&&window.v4bar){h=v4bar()}
 else if(SDK.tool=='h'){h=`<span class="cbh">Sürükleyerek kaydır · Space tuşu geçici El aracıdır</span>`}
 else if(SDK.tool=='z'){h=`<span class="cbh">Tıkla: yakınlaştır · Alt+tıkla: uzaklaştır</span>`}
 else{
  const L=selEls(),e=cur();
  if(!L.length){h=`<span class="cbt">Sayfa ${PROJ.cur+1} / ${PROJ.pages.length}</span><span class="cbh">Bir öğeye tıkla ya da soldan araç seç (T metin · M dikdörtgen · I görsel)</span><span class="cbs"></span>`
   +ib('data-cbg="grid"','Grid (Ctrl+\')',svg('<path d="M4 4h16v16H4zM4 12h16M12 4v16"/>',17),S.grid)+ib('data-cbg="pal"','Komutlar (Ctrl+K)',svg('<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>',17))}
  else if(L.length>1){h=`<span class="cbt">${L.length} öğe seçili</span>`+['l','ch','r','t','cv','b'].map(v=>`<button class="cbb" data-al="${v}" title="Hizala">${IC.al[v]}</button>`).join('')+`<button class="cbb wide" data-cbg="sw" title="Aynı genişlik (Alt+Shift+W)">Aynı gen.</button><button class="cbb wide" data-cbg="sh" title="Aynı yükseklik (Alt+Shift+Y)">Aynı yük.</button>${window.v4multi?v4multi(L):''}<span class="cbs"></span>`
   +ib('data-cbg="grp"','Grupla (Ctrl+G)',svg('<rect x="4" y="4" width="9" height="9"/><rect x="11" y="11" width="9" height="9"/>',17))+ib('data-cbg="dup"','Çoğalt (Ctrl+J)',svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',17))+ib('data-cbg="del"','Sil (Delete)',svg('<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',17))}
  else{
   const o=L[0],tx=o.txt!==undefined;
   h=`<span class="cbt">${esc(o.nm||TY[o.type][1])}</span>`;
   if(tx){h+=`<select class="cbs1" data-cb="ff" aria-label="Yazı tipi">${FONTS()}</select><input class="cbn" type="number" data-cb="fs" min=".5" max="80" step=".5" aria-label="Boyut" title="Boyut"><select class="cbs2" data-cb="fw" aria-label="Kalınlık">${[[300,'İnce'],[400,'Normal'],[500,'Orta'],[700,'Kalın'],[900,'Siyah']].map(a=>`<option value="${a[0]}">${a[1]}</option>`).join('')}</select><input class="cbc" type="color" data-cb="col" aria-label="Renk" title="Renk">`
    +['left','center','right','justify'].map((a,i)=>`<button class="cbb${o.al==a?' on':''}" data-cal="${a}" title="Hizalama" aria-pressed="${o.al==a}">${svg(['<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>','<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>','<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>','<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>'][i],16)}</button>`).join('')}
   else if(o.type=='img'){h+=`<select class="cbs2" data-cb="fit" aria-label="Yerleşim"><option value="cover">Kırp</option><option value="contain">Sığdır</option><option value="fill">Esnet</option></select><button class="cbb wide" data-cbg="repl">Görseli değiştir</button><label class="cbk"><input type="checkbox" data-cbk="gray"> Siyah-beyaz</label>`}
   else{h+=`<input class="cbc" type="color" data-cb="col" aria-label="Renk" title="Renk">`+(o.shape=='draw'?`<label class="cbr" title="Çizgi kalınlığı (0 = yok)"><span>Kalınlık</span><input type="range" min="0" max="8" step=".05" data-cb="sw2" aria-label="Kalınlık"></label>`:`<select class="cbs2" data-cb="shape" aria-label="Şekil"><option value="rect">Dikdörtgen</option><option value="circle">Daire</option><option value="tri">Üçgen</option><option value="line">Çizgi</option></select>`)}
   h+=`<label class="cbr" title="Saydamlık"><span>Opaklık</span><input type="range" min="0" max="100" data-cb="op" aria-label="Saydamlık"></label><span class="cbs"></span>`
    +ib('data-cbg="fwd"','Öne (Ctrl+])',svg('<path d="M12 19V6M7 11l5-5 5 5"/>',17))+ib('data-cbg="bwd"','Arkaya (Ctrl+[)',svg('<path d="M12 5v13M7 13l5 5 5-5"/>',17))
    +ib('data-cbg="lock"','Kilitle (Ctrl+2)',svg('<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 016 0v3"/>',17),o.lock)
    +ib('data-cbg="dup"','Çoğalt (Ctrl+J)',svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',17))
    +ib('data-cbg="del"','Sil (Delete)',svg('<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',17))
    +(o.fr&&o.shape!='draw'?`<button class="cbb wide" data-cbg="snapgrid" title="Serbest konumu ızgaraya oturt">Izgaraya oturt</button>`:'')+(window.v4extra?v4extra(o):'')+`<button class="cbb wide" data-cbg="all">Tüm ayarlar</button>`}}
 b.innerHTML=h;
 const o=selEls().length==1?cur():null;
 if(o&&SDK.tool=='v'){b.querySelectorAll('[data-cb]').forEach(i=>{const k=i.dataset.cb;let v=o[k];if(v===undefined)v=k=='op'?100:'';i.value=v});const g=b.querySelector('[data-cbk=gray]');if(g)g.checked=(o.gray||0)>=100;
  const fws=b.querySelector('[data-cb=fw]');if(fws&&![...fws.options].some(x=>x.value==o.fw)){const op=document.createElement('option');op.value=o.fw;op.textContent='Ağırlık '+o.fw;fws.appendChild(op);fws.value=o.fw}
  const ffs=b.querySelector('[data-cb=ff]');if(ffs&&![...ffs.options].some(x=>x.value==o.ff)){const op=document.createElement('option');op.textContent=o.ff;ffs.insertBefore(op,ffs.firstChild);ffs.value=o.ff}}
}
function stCb(ev,commit){const t=ev.target,k=t.dataset.cb,kk=t.dataset.cbk;if(!k&&!kk)return;const L=selEls();if(!L.length)return;
 L.forEach(o=>{
  if(kk=='gray'){if(o.type=='img')o.gray=t.checked?100:0;return}
  let v=t.type=='range'||t.type=='number'?+t.value:t.value;if(k=='fw')v=+v;
  const isT=o.txt!==undefined;
  if(['ff','fs','fw'].includes(k)&&!isT)return;if(['fit'].includes(k)&&o.type!='img')return;if(k=='shape'&&o.type!='r')return;if(k=='col'&&o.type=='img')return;
  o[k]=v;if(k=='fs'&&S.af&&isT){}
 });
 if(k=='ff')loadF().then(()=>render());render();if(commit){hist();ed();list()}}
function stCbClick(ev){const t=ev.target.closest('button,.chip');if(!t)return;const d=t.dataset;
 if(d.tt){SDK.tt=d.tt;return stBar2()}
 if(d.al){V3.al(d.al);return}
 if(d.cal){selEls().forEach(o=>{if(o.txt!==undefined)o.al=d.cal});render();hist();ed();return stBar2()}
 const g=d.cbg;if(!g)return;
 if(g=='grid')stGrid();else if(g=='pal')stPalette();else if(g=='grp')V3.gp('g');else if(g=='dup')stDup();else if(g=='del')stDel();
 else if(g=='fwd')stOrder(1);else if(g=='bwd')stOrder(-1);else if(g=='lock'){const o=cur();stLock(!o.lock)}
 else if(g=='all')stTab(1,1);else if(g=='snapgrid'&&window.v4snap)v4snap();else if(window.v4cb&&v4cb(g,t))return;else if(g=='repl'){stFile2()}
 stBar()}
function stFile2(){let f=$('stf2');if(!f){f=document.createElement('input');f.type='file';f.id='stf2';f.accept='image/*';f.hidden=true;f.onchange=()=>{files([...f.files],cur());f.value=''};document.body.appendChild(f)}f.click()}
const _ed=ed;ed=function(){const r=_ed.apply(this,arguments);stBar();return r};
const _hist=hist;hist=function(){const r=_hist.apply(this,arguments);stBar();return r};
const _undo=undo;undo=function(){const r=_undo.apply(this,arguments);stBar();return r};

/* ---------- komut paleti ---------- */
function stPalette(){let p=$('kpl');if(!p){p=document.createElement('div');p.id='kpl';p.className='kpl';p.innerHTML='<div class="kbox" role="dialog" aria-label="Komut paleti"><input id="kpi" placeholder="Bir komut yaz… (örn. grupla, sığdır, PDF)" autocomplete="off" aria-label="Komut ara"><div id="kpr" role="listbox"></div></div>';document.body.appendChild(p);
  p.addEventListener('mousedown',e=>{if(e.target===p)stPalClose()});
  $('kpi').addEventListener('input',()=>stPalList());
  $('kpi').addEventListener('keydown',e=>{const L=[...document.querySelectorAll('#kpr .kit')];let i=L.findIndex(x=>x.classList.contains('on'));
   if(e.key=='ArrowDown'||e.key=='ArrowUp'){e.preventDefault();if(!L.length)return;L[i]&&L[i].classList.remove('on');i=(i+(e.key=='ArrowDown'?1:-1)+L.length)%L.length;L[i].classList.add('on');L[i].scrollIntoView({block:'nearest'})}
   else if(e.key=='Enter'){e.preventDefault();if(L[i])stPalRun(+L[i].dataset.i)}});
  $('kpr').addEventListener('click',e=>{const it=e.target.closest('.kit');if(it)stPalRun(+it.dataset.i)})}
 p.hidden=false;$('kpi').value='';stPalList();setTimeout(()=>$('kpi').focus(),10)}
function stPalClose(){const p=$('kpl');if(p)p.hidden=true}
const norm=s=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i');
const PAL_X=[];
function stPalList(){const v=norm($('kpi').value.trim());let items=CMD.map((c,i)=>({i,g:c[0],n:c[1],k:c[2].filter(x=>!/tekerlek|tıkla|sürükle/.test(x))[0]||'',f:c[3]})).filter(c=>c.f&&!/^(Taşı|Büyüt|Yakından|Çoklu|Opaklık)/.test(c.n));
 if(v)items=items.filter(c=>norm(c.g+' '+c.n).includes(v));
 const pages=(PROJ&&PROJ.pages||[]).map((p,i)=>({i:1000+i,g:'Sayfa',n:'Sayfa '+(i+1)+'\'e git',k:'',f:()=>stGo(i)})).filter(c=>v&&norm(c.n).includes(v));
 items=items.concat(pages);PAL_X.length=0;items.forEach(c=>PAL_X[c.i]=c);
 $('kpr').innerHTML=items.slice(0,40).map((c,j)=>`<div class="kit${j==0?' on':''}" role="option" data-i="${c.i}"><span class="kg">${c.g}</span><span class="kn">${c.n}</span>${c.k?`<kbd>${c.k}</kbd>`:''}</div>`).join('')||'<div class="kem">Eşleşen komut yok</div>'}
function stPalRun(i){stPalClose();const c=i>=1000?PAL_X[i]:CMD[i];const f=c.f||c[3];setTimeout(()=>f(),20)}

/* ---------- kısayol kılavuzu ---------- */
function stKeys(){let p=$('kcs');if(!p){p=document.createElement('div');p.id='kcs';p.className='kpl kcs';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p||e.target.closest('[data-x]'))p.hidden=true})}
 const G={};CMD.forEach(c=>{if(!c[2].length)return;(G[c[0]]=G[c[0]]||[]).push(c)});
 p.innerHTML='<div class="kbox kwide" role="dialog" aria-label="Kısayollar"><div class="kh"><b>Klavye kısayolları</b><small>Photoshop · Illustrator · InDesign alışkanlıklarıyla uyumlu. Mac\'te Ctrl yerine ⌘ de çalışır.</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="kgrid">'
  +Object.entries(G).map(([g,L])=>`<section><h4>${g}</h4>${L.map(c=>`<div class="kr"><span>${c[1]}</span><span>${c[2].map(k=>`<kbd>${k.replace('Plus','+')}</kbd>`).join(' ')}</span></div>`).join('')}</section>`).join('')
  +'<section><h4>Fare</h4><div class="kr"><span>Kaydır</span><span><kbd>Space</kbd> + sürükle</span></div><div class="kr"><span>Yakınlaştır</span><span><kbd>Ctrl</kbd> + tekerlek</span></div><div class="kr"><span>Serbest taşıma</span><span><kbd>Alt</kbd> basılı</span></div><div class="kr"><span>Alan çizerek ekle</span><span>T · M · L · \\ sonra sürükle</span></div></section></div></div>';
 p.hidden=false}
window.stKeys=stKeys;window.stPalette=stPalette;

/* ---------- başlat ---------- */
stShell();
document.addEventListener('click',e=>{const g=e.target.closest('[data-cbg]');if(g&&g.closest('#cbar'))return});
document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('#cv .e'))setTimeout(stBar,0)});
setTool('v');stTab(1);
window.v4ui={setTool:t=>setTool(t),useTool:t=>useTool(t),stBar:()=>stBar(),IC,TOOLS,svg,inField,stSize:()=>stSize(),stZoom:(z,x,y)=>stZoom(z,x,y),stFit:()=>stFit(),stMini:()=>stMini()};
const _enter=enter;enter=function(){const r=_enter.apply(this,arguments);SDK.fm=0;if(window.abEnter)abEnter();else{SDK.zm=1;stSize();stCenter()}stBar();return r};
const _openEditor=openEditor;openEditor=function(){const r=_openEditor.apply(this,arguments);document.body.classList.add('ined');setTimeout(()=>{stSize();stCenter();stBar()},30);return r};
const _showHome=showHome;showHome=function(){document.body.classList.remove('ined','prev','dk-open');return _showHome.apply(this,arguments)};
})();
