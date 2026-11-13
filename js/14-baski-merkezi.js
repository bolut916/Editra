/* ================= STÜDYO 16: Baskı Merkezi (300 dpi, PDF/X hazırlık, özel renkler, taşma/kesim) ================= */
(function(){
const X=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MD=(id,title,sub,body)=>{let p=document.getElementById(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)p.hidden=true});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))p.hidden=true})}
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>${title}</b><small>${sub||''}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b">${body}</div></div>`;p.hidden=false;return p};
const CSS='<style>.v16s{display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid #8883}.v16s i{font-style:normal;min-width:18px;font-weight:700}.v16s.ok i{color:#1a8a3a}.v16s.no i{color:#c22}.v16s.wn i{color:#c60}.v16s small{display:block;opacity:.7}.v16r{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:5px 0}.v16r input[type=number]{width:62px}.v16sw{display:inline-block;width:16px;height:16px;border-radius:50%;border:1px solid #8886;vertical-align:middle}</style>';
const hex2=h=>{h=String(h||'').replace('#','');if(h.length==3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return(isNaN(n)||h.length!=6)?null:[n>>16&255,n>>8&255,n&255]};
const rgb2cmyk=(r,g,b)=>{const m=Math.max(r,g,b);if(m===0)return[0,0,0,100];return[Math.round((m-r)/m*100),Math.round((m-g)/m*100),Math.round((m-b)/m*100),Math.round((255-m)/255*100)]};
const SP=()=>{if(!PROJ)return[];PROJ.spots=Array.isArray(PROJ.spots)?PROJ.spots:[];return PROJ.spots};
const vivid=h=>{const c=hex2(h);if(!c)return false;const mx=Math.max(...c),mn=Math.min(...c);if(mx<200||(mx-mn)/mx<.85)return false;const[r,g,b]=c;const hue=(()=>{const d=mx-mn;let H=mx==r?((g-b)/d)%6:mx==g?(b-r)/d+2:(r-g)/d+4;return((H*60)+360)%360})();return hue>=75&&hue<=290};
async function scan(thr){const out={imgs:[],low:0,none:0,colors:new Map(),spotUse:{},text:0,pages:0,tooBig:0};await loadF();const mmW=S.mm[0];
 await eachPage(async i=>{out.pages++;S.els.forEach(e=>{if(!e.on)return;const nm=e.nm||(TY[e.type]?TY[e.type][1]:'Öğe');
  if(e.txt!==undefined)out.text++;
  [e.col,e.fl].forEach(v=>{if(typeof v=='string'&&/^#[0-9a-f]{6}$/i.test(v)){const k=v.toLowerCase();if(!out.colors.has(k))out.colors.set(k,{pg:i,id:e.id})}});
  if(e.spot){(out.spotUse[e.spot]=out.spotUse[e.spot]||[]).push(i+1)}
  if(e.type=='img'&&e.src&&e.im&&e.im.naturalWidth){const[x,y,w,h]=geo(e,100),iw=e.im.naturalWidth,ih=e.im.naturalHeight,wm=w/100*mmW,hm=h/100*mmW;const q=e.fit=='fill'?Math.max(wm/iw,hm/ih):(e.fit=='cover'?Math.max:Math.min)(wm/iw,hm/ih),dpi=Math.round(25.4/q);out.imgs.push({pg:i,id:e.id,nm,dpi,w:iw,h:ih});if(dpi<thr)out.low++}
  else if(e.type=='img'&&!e.src)out.none++})});return out}
async function openPrint(){if(!PROJ)return toast('Önce bir proje aç');let T=300;try{T=+localStorage.getItem('editra-dpi-thr')||300}catch(e){}
 const R=await scan(T),sp=SP(),b=S.bleed||0;
 const row=(k,t,d)=>`<div class="v16s ${k}"><i>${k=='ok'?'✓':k=='no'?'✗':'!'}</i><span><b>${t}</b><small>${d}</small></span></div>`;
 const viv=[...R.colors.keys()].filter(vivid);
 const rowsX=[
  b>=3?row('ok','Taşma payı (bleed)',b+' mm eklenecek'):row('no','Taşma payı (bleed)',b?b+' mm: matbaalar genelde en az 3 mm ister':'Yok: kesimde beyaz kenar riski'),
  S.marks?row('ok','Kesim işaretleri','PDF’e eklenecek'):row('wn','Kesim işaretleri','Kapalı: matbaa isterse aç'),
  R.low?row('wn',`Düşük çözünürlük (<${T} dpi)`,R.low+' görsel eşiğin altında'):R.imgs.length?row('ok',`Görsel çözünürlüğü (≥${T} dpi)`,R.imgs.length+' görselin hepsi yeterli'):row('ok','Görseller','Sayfalarda yerleştirilmiş görsel yok'),
  R.none?row('wn','Boş görsel kutuları',R.none+' kutuda görsel yok'):'',
  viv.length?row('wn','Canlı RGB renkler',viv.length+' renk (neon yeşil/mavi/camgöbeği tonları) CMYK baskıda daha mat çıkar'):row('ok','Renk gamutu','CMYK’da belirgin solacak canlı renk bulunmadı'),
  row('ok','CMYK PDF çıktısı','“CMYK PDF indir” DeviceCMYK, TrimBox ve BleedBox yazar'),
  row('ok','Saydamlık ve efektler','Sayfa görüntüye düzleştirilir (saydamlık sorunu olmaz)'),
  row('ok','Yazı tipleri','Yazılar görüntüye çevrilir: font gömme sorunu olmaz, ama PDF’te seçilebilir metin olmaz'),
  row('no','ICC profili / PDF/X sertifikası','Editra ICC profili gömmez ve OutputIntent yazmaz, bu yüzden dosya PDF/X-1a ya da X-4 olarak doğrulanamaz. Matbaan şart koşuyorsa PDF’i Acrobat Preflight ya da Ghostscript ile PDF/X’e dönüştür.')].join('');
 const lowRows=R.imgs.filter(x=>x.dpi<T).sort((a,c)=>a.dpi-c.dpi).slice(0,40).map(x=>`<div class="v16s wn"><i>!</i><span style="flex:1"><b>Sayfa ${x.pg+1}</b> · ${X(x.nm)} · ${x.dpi} dpi <small>${x.w}×${x.h} px kaynak</small></span><button class="b mini" data-go="${x.pg}:${x.id}">Git</button></div>`).join('');
 const spRows=sp.map((c,i)=>`<div class="v16r"><span class="v16sw" style="background:${X(c.hex)}"></span><b>${X(c.name)}</b><small>C${c.cmyk[0]} M${c.cmyk[1]} Y${c.cmyk[2]} K${c.cmyk[3]}${R.spotUse[c.name]?' · kullanıldığı sayfalar: '+[...new Set(R.spotUse[c.name])].join(', '):''}</small><button class="b mini" data-sa="${i}">Seçilene uygula</button><button class="b mini" data-sd="${i}">Sil</button></div>`).join('')||'<small class="mut">Henüz özel renk yok</small>';
 const p=MD('v16pr','Baskı Merkezi','Taşma, kesim, çözünürlük, renk ve PDF/X hazırlık kontrolleri',`<div class="v16r"><label>Çözünürlük eşiği <select id="v16t">${[150,200,300,600].map(v=>`<option${v==T?' selected':''}>${v}</option>`).join('')}</select> dpi</label><button class="b" id="v16b">3 mm taşma payı + kesim işaretleri aç</button><button class="b" id="v16c">CMYK PDF…</button><button class="b" id="v16k">Ayrıntılı baskı kontrolü</button></div>
  <h5>PDF/X hazırlık listesi</h5>${rowsX}
  ${lowRows?'<h5>Eşiğin altındaki görseller</h5>'+lowRows:''}
  <h5>Özel renkler (spot / Pantone benzeri)</h5><p class="mut">Pantone lisanslıdır; hazır liste yok. Matbaanın verdiği adı ve CMYK karşılığını kendin kaydet (örn. “PANTONE 186 C”). PDF’te CMYK karşılığı kullanılır, gerçek spot kanalı yazılmaz.</p>${spRows}
  <div class="v16r"><input type="text" id="v16n" placeholder="Renk adı" style="width:150px"><input type="color" id="v16h" value="#c8102e"><label>C<input type="number" id="v16c0" min="0" max="100"></label><label>M<input type="number" id="v16c1" min="0" max="100"></label><label>Y<input type="number" id="v16c2" min="0" max="100"></label><label>K<input type="number" id="v16c3" min="0" max="100"></label><button class="b" id="v16a">Kaydet</button></div>${CSS}`);
 const fill=()=>{const c=hex2(p.querySelector('#v16h').value);if(!c)return;const k=rgb2cmyk(...c);k.forEach((v,i)=>p.querySelector('#v16c'+i).value=v)};fill();p.querySelector('#v16h').oninput=fill;
 p.querySelector('#v16t').onchange=e=>{try{localStorage.setItem('editra-dpi-thr',e.target.value)}catch(x){}openPrint()};
 p.onclick=async e=>{const t=e.target;
  if(t.id=='v16b'){S.bleed=3;S.marks=true;try{const bl=$('bleed');if(bl)bl.value='3'}catch(x){}hist();toast('3 mm taşma payı ve kesim işaretleri açıldı');return openPrint()}
  if(t.id=='v16c'){p.hidden=true;if(window.v4out)v4out();return}
  if(t.id=='v16k'){p.hidden=true;if(window.v4pre)v4pre();return}
  if(t.id=='v16a'){const n=p.querySelector('#v16n').value.trim().slice(0,40),h=p.querySelector('#v16h').value,k=[0,1,2,3].map(i=>Math.max(0,Math.min(100,Math.round(+p.querySelector('#v16c'+i).value||0))));if(!n)return toast('Renk adı yaz');if(!hex2(h))return;const L=SP();if(L.some(x=>x.name===n))return toast('Bu adda bir özel renk zaten var');L.push({name:n,hex:h,cmyk:k});hist();return openPrint()}
  const d=t.closest('[data-sd]');if(d){SP().splice(+d.dataset.sd,1);hist();return openPrint()}
  const a=t.closest('[data-sa]');if(a){const c=SP()[+a.dataset.sa],L=selEls().filter(x=>!x.lock&&(x.txt!==undefined||x.type=='r'));if(!c)return;if(!L.length)return toast('Önce bir metin ya da şekil seç');L.forEach(x=>{x.col=c.hex;x.spot=c.name});render();hist();ed();p.hidden=true;return toast('Özel renk uygulandı: '+c.name)}
  const g=t.closest('[data-go]');if(g){const[pg,id]=g.dataset.go.split(':').map(Number);p.hidden=true;goPage(pg);setTimeout(()=>{if(byId(id)){S.sel=id;MSEL.clear();render();ed()}},80)}}}
window.v4print={open:openPrint,scan,rgb2cmyk,vivid};
v4cmd(['Dosya','Baskı Merkezi (300 dpi, PDF/X hazırlık, özel renkler)',['Ctrl+Alt+X'],openPrint]);
const mm=document.getElementById('mmenu');if(mm){const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML='<span>Baskı Merkezi</span><kbd>Ctrl+Alt+X</kbd>';w.onclick=()=>{mm.hidden=true;openPrint()};mm.appendChild(w)}
})();
