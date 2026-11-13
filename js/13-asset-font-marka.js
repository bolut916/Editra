/* ================= STÜDYO 15: Asset Manager (her projede), Font yönetimi, Marka Kiti++ ================= */
(function(){
const X=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MD=(id,title,sub,body)=>{let p=document.getElementById(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)p.hidden=true});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))p.hidden=true})}
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>${title}</b><small>${sub||''}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b">${body}</div></div>`;p.hidden=false;return p};
const CSSX='<style>.v15r{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:6px 0}.v15r small{opacity:.7}.v15g{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-top:8px}.v15c{border:1px solid #8885;border-radius:8px;padding:6px;text-align:center;cursor:pointer;font-size:12px;overflow:hidden}.v15c img{width:100%;height:64px;object-fit:contain;display:block;margin-bottom:4px;background:repeating-conic-gradient(#8881 0 25%,transparent 0 50%) 0 0/12px 12px}.v15c i{display:block;height:64px;margin-bottom:4px;border-radius:4px}.v15t{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.v15t button.on{outline:2px solid currentColor}.v15chip{display:inline-flex;gap:6px;align-items:center;padding:3px 8px;border:1px solid #8885;border-radius:99px;margin:2px;font-size:12px}.v15chip i{width:14px;height:14px;border-radius:50%;display:inline-block;border:1px solid #8886}.v15f textarea,.v15f input[type=text],.v15f input[type=number]{width:100%;box-sizing:border-box}.v15f label{display:block;margin:8px 0}.v15iss{display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid #8883}.v15iss b{min-width:64px}</style>';

/* ---------- kalıcı varlık deposu (IndexedDB, tüm projelerde ortak) ---------- */
let mem=[],dbp=null;
const idb=()=>dbp||(dbp=new Promise((res,rej)=>{try{const r=indexedDB.open('editra-assets',1);r.onupgradeneeded=()=>r.result.createObjectStore('a',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('blocked'))}catch(e){rej(e)}}));
const aAll=async()=>{try{const d=await idb();return await new Promise((res,rej)=>{const q=d.transaction('a').objectStore('a').getAll();q.onsuccess=()=>res(q.result||[]);q.onerror=()=>rej(q.error)})}catch(e){return mem.slice()}};
const aPut=async o=>{try{const d=await idb();await new Promise((res,rej)=>{const t=d.transaction('a','readwrite');t.objectStore('a').put(o);t.oncomplete=res;t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error)})}catch(e){mem=mem.filter(x=>x.id!==o.id);mem.push(o)}};
const aDel=async id=>{try{const d=await idb();await new Promise((res,rej)=>{const t=d.transaction('a','readwrite');t.objectStore('a').delete(id);t.oncomplete=res;t.onerror=()=>rej(t.error)})}catch(e){mem=mem.filter(x=>x.id!==id)}};
const uid=()=>'a'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const rdURL=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(f)});
const KINDS={logo:'Logo',font:'Font',color:'Renk',mockup:'Mockup',icon:'İkon'};
const OK_IMG=/^data:image\/(png|jpe?g|webp|gif|svg\+xml);/i;

/* ---------- kendi fontların ---------- */
const OWN='Kendi fontların';
const sane=n=>String(n||'Font').replace(/\.(ttf|otf|woff2?)$/i,'').replace(/[^\p{L}\p{N} _-]/gu,'').trim().slice(0,40)||'Font';
async function regFont(a){if(!a||a.kind!=='font'||!OK_FONT(a.data))return false;const fam=a.fam||a.name;
 try{if(![...document.fonts].some(f=>f.family.replace(/["']/g,'')===fam)){const ff=new FontFace(fam,`url(${a.data})`);await ff.load();document.fonts.add(ff)}
  FC[OWN]=FC[OWN]||[];if(!FC[OWN].includes(fam))FC[OWN].push(fam);OWNC[fam]=a.data;return true}catch(e){return false}}
const OK_FONT=d=>/^data:(font\/|application\/(font|x-font|octet-stream|vnd\.ms-opentype)|application\/font)/i.test(d||'')||/^data:;base64,/i.test(d||'');
async function loadOwn(){const L=(await aAll()).filter(a=>a.kind==='font');for(const a of L)await regFont(a);return L.length}
const OWNC={};
window.v4ownFontsPack=()=>{if(!PROJ)return[];const used=new Set();try{PROJ.pages[PROJ.cur].s=pageSnap()}catch(e){}PROJ.pages.forEach(p=>((p.s&&p.s.els)||[]).forEach(e=>{if(e.ff)used.add(e.ff)}));return[...used].filter(f=>OWNC[f]).map(f=>({fam:f,data:OWNC[f]}))};
window.v4ownFontLoad=async o=>{if(!o||typeof o.fam!=='string'||!OK_FONT(o.data))return;const a={id:uid(),kind:'font',name:o.fam,fam:o.fam,data:o.data,t:Date.now()};if(await regFont(a)){const all=await aAll();if(!all.some(x=>x.kind==='font'&&(x.fam||x.name)===o.fam))await aPut(a)}};
window.v4assets={all:aAll,put:aPut,del:aDel,regFont,loadOwn,KINDS};

/* ---------- asset manager penceresi ---------- */
let tab='logo';
function place(a){if(!PROJ)return toast('Önce bir proje aç');
 if(a.kind==='color'){const L=selEls();if(!L.length){try{navigator.clipboard&&navigator.clipboard.writeText(a.data)}catch(e){}return toast('Öğe seçili değil: '+a.data+' panoya kopyalandı')}
  L.forEach(e=>{if(e.lock)return;if(e.txt!==undefined||e.type=='r')e.col=a.data});render();hist();ed();return toast('Renk uygulandı: '+a.name)}
 if(a.kind==='font'){const L=selEls().filter(e=>e.txt!==undefined&&!e.lock);if(!L.length)return toast('Fontu uygulamak için önce bir metin seç');regFont(a).then(ok=>{if(!ok)return toast('Font yüklenemedi');L.forEach(e=>{e.ff=a.fam||a.name});render();hist();ed();toast('Font uygulandı: '+(a.fam||a.name))});return}
 if(!OK_IMG.test(a.data||''))return toast('Bu varlık geçerli bir görsel değil');
 const im=new Image();im.onload=()=>{const H=100/S.fmt,asp=(im.naturalHeight||1)/(im.naturalWidth||1),w=a.kind==='logo'?28:a.kind==='icon'?14:60;let h=w*asp;if(h>H*.8){h=H*.8;}const ww=h/asp;
  const e=mk('img');e.src=a.data;e.im=getIm(a.data);e.fit='contain';e.fr=[+((100-ww)/2).toFixed(2),+((H-h)/2).toFixed(2),+ww.toFixed(2),+h.toFixed(2)];e.pin=true;e.nm=a.name;S.els.push(e);S.sel=e.id;MSEL.clear();render();list();ed();hist();toast(a.name+' sayfaya eklendi')};
 im.onerror=()=>toast('Görsel okunamadı');im.src=a.data}
async function openAssets(t){if(t&&KINDS[t])tab=t;const all=await aAll(),L=all.filter(a=>a.kind===tab).sort((a,b)=>(b.t||0)-(a.t||0));
 const card=a=>a.kind==='color'?`<div class="v15c" data-use="${a.id}" title="Sayfadaki seçili öğeye uygula"><i style="background:${X(a.data)}"></i>${X(a.name)}<br><small>${X(a.data)}</small><br><button class="b mini" data-del="${a.id}">Sil</button></div>`
  :a.kind==='font'?`<div class="v15c" data-use="${a.id}" title="Seçili metne uygula"><span style="font-family:'${X(a.fam||a.name)}';font-size:22px;display:block;height:64px;line-height:64px">Ağğ Şşİı</span>${X(a.name)}<br><button class="b mini" data-del="${a.id}">Sil</button></div>`
  :`<div class="v15c" data-use="${a.id}" title="Sayfaya ekle"><img src="${OK_IMG.test(a.data||'')?X(a.data):''}" alt="${X(a.name)}">${X(a.name)}<br><button class="b mini" data-del="${a.id}">Sil</button></div>`;
 const add=tab==='color'?`<input type="color" id="v15col" value="#e63946"><input type="text" id="v15cn" placeholder="Renk adı" style="width:140px"><button class="b" id="v15ca">Rengi kaydet</button>`
  :`<label class="b" for="v15fi">＋ ${KINDS[tab]} yükle</label><input type="file" id="v15fi" hidden multiple accept="${tab==='font'?'.ttf,.otf,.woff,.woff2':tab==='icon'?'image/svg+xml,image/png':'image/*'}">`;
 const p=MD('v15as','Asset Manager','Tüm projelerinde otomatik erişilir (bu tarayıcıda saklanır)',`<div class="v15t">${Object.entries(KINDS).map(([k,v])=>`<button class="b${k===tab?' on pr':''}" data-tab="${k}">${v} <small>${all.filter(a=>a.kind===k).length}</small></button>`).join('')}</div><div class="v15r">${add}</div><div class="v15g">${L.map(card).join('')||'<p class="mut">Henüz '+KINDS[tab].toLowerCase()+' yok.</p>'}</div>${CSSX}`);
 p.onclick=async e=>{const t=e.target.closest('[data-tab]');if(t){tab=t.dataset.tab;return openAssets()}
  const d=e.target.closest('[data-del]');if(d){e.stopPropagation();await aDel(d.dataset.del);return openAssets()}
  const u=e.target.closest('[data-use]');if(u){const a=(await aAll()).find(x=>x.id===u.dataset.use);if(a){p.hidden=true;place(a)}return}
  if(e.target.id==='v15ca'){const c=p.querySelector('#v15col').value,n=p.querySelector('#v15cn').value.trim().slice(0,40)||c;await aPut({id:uid(),kind:'color',name:n,data:c,t:Date.now()});return openAssets()}};
 const fi=p.querySelector('#v15fi');if(fi)fi.onchange=async()=>{let bad=0;for(const f of [...fi.files]){try{if(f.size>8e6){bad++;continue}
   let data=await rdURL(f);
   if(tab==='font'){if(!/\.(ttf|otf|woff2?)$/i.test(f.name)){bad++;continue}data=data.replace(/^data:[^;,]*/,'data:font/'+(f.name.split('.').pop().toLowerCase()));const a={id:uid(),kind:'font',name:sane(f.name),fam:null,data,t:Date.now()};a.fam=a.name;const ex=[].concat(...Object.values(FC)).includes(a.fam);if(ex)a.fam=a.name+' (kendi)';if(!await regFont(a)){bad++;continue}await aPut(a)}
   else{if(!OK_IMG.test(data)){bad++;continue}await aPut({id:uid(),kind:tab,name:sane(f.name),data,t:Date.now()})}}catch(x){bad++}}
  if(bad)toast(bad+' dosya eklenemedi (desteklenmeyen tür ya da 8 MB üstü)');openAssets()}}
window.v4assets.open=openAssets;

/* ---------- font yönetimi ---------- */
const GRP={'Geometrik sans':['Montserrat','Poppins','Outfit','Urbanist','Lexend','Sora','Figtree','Plus Jakarta Sans','DM Sans','Josefin Sans','Raleway','Quicksand'],
 'Grotesk sans':['Inter','Archivo','Work Sans','Libre Franklin','Rubik','Manrope','Karla','Chivo','Space Grotesk','Epilogue','Bricolage Grotesque','Helvetica Neue','Arial','Red Hat Display'],
 'Hümanist sans':['Open Sans','Noto Sans','Lato','Cabin','Nunito'],
 'Didone / yüksek kontrast':['Playfair Display','Bodoni Moda','DM Serif Display','Gloock','Yeseva One','Abril Fatface','Rozha One','Old Standard TT'],
 'Klasik serif':['EB Garamond','Cormorant Garamond','Crimson Pro','Libre Baskerville','Spectral','Alegreya','Lora','Libre Caslon Text','Source Serif 4','Merriweather','Vollkorn','Noto Serif','Georgia','Fraunces','Instrument Serif','Young Serif','Cinzel'],
 'Slab': ['Roboto Slab','Alfa Slab One'],
 'Dar başlık':['Bebas Neue','Anton','Oswald','Fjalla One','Staatliches','Big Shoulders Display'],
 'Kalın başlık':['Archivo Black','Bungee','Rubik Mono One','Righteous','Unbounded','Syne','Shrikhand','Limelight','Monoton','Black Ops One'],
 'El yazısı':['Pacifico','Lobster','Dancing Script','Caveat','Permanent Marker','Special Elite'],
 'Mono':['IBM Plex Mono','Space Mono','JetBrains Mono','DM Mono','VT323','Press Start 2P','Fira Code']};
const PAIRS={'Geometrik sans':['Lora','Playfair Display','Source Serif 4','Fraunces'],'Grotesk sans':['Playfair Display','Instrument Serif','Libre Baskerville','Fraunces'],'Hümanist sans':['Merriweather','Lora','Playfair Display'],
 'Didone / yüksek kontrast':['Inter','Work Sans','Montserrat','DM Sans'],'Klasik serif':['Inter','Work Sans','Manrope','DM Sans','Montserrat'],'Slab':['Open Sans','Inter','Lato'],
 'Dar başlık':['Inter','Lora','Open Sans','Source Serif 4'],'Kalın başlık':['Inter','Work Sans','Lora','DM Sans'],'El yazısı':['Montserrat','Lora','Inter'],'Mono':['Inter','Space Grotesk','Work Sans']};
const SYS=['Helvetica Neue','Arial','Georgia'];
const grpOf=f=>Object.keys(GRP).find(g=>GRP[g].includes(f))||null;
function licOf(f,own){if(own)return{k:'own',t:'Sen yükledin: lisans sorumluluğu sende. Ticari baskıda kullanmadan önce font dosyasının lisansını doğrula.'};
 if(SYS.includes(f))return{k:'sys',t:'Sistem fontu (telifli). Editra yazıyı görüntüye çevirerek dışa aktarır, font dosyası PDF’e gömülmez; yine de matbaaya verilecek işte kullanımın lisansını doğrula.'};
 if([].concat(...Object.values(FC)).includes(f))return{k:'ofl',t:'Google Fonts: açık lisans (SIL Open Font License ya da Apache 2.0). Ticari baskı, PDF’e gömme ve dağıtım serbest; fontu tek başına satamazsın.'};
 return{k:'?',t:'Lisans bilgisi bilinmiyor.'}}
const TR='ğĞıİşŞçÇöÖüÜ';
async function trCheck(f){try{await document.fonts.load(`40px "${f}"`,TR)}catch(e){}
 const c=document.createElement('canvas').getContext('2d'),miss=[];for(const ch of TR){c.font=`40px "${f}", monospace`;const a=c.measureText(ch).width;c.font=`40px "${f}", serif`;const b=c.measureText(ch).width;if(Math.abs(a-b)>.01)miss.push(ch)}
 if(miss.length===TR.length)return{ok:null,miss};return{ok:miss.length===0,miss}}
async function openFont(fam){const own=((FC[OWN]||[]).includes(fam)),T=selEls().filter(e=>e.txt!==undefined);fam=fam||(T[0]&&T[0].ff)||'Inter';
 const g=grpOf(fam)||(own?null:null),lic=licOf(fam,own),sim=g?GRP[g].filter(x=>x!==fam).slice(0,8):[],pr=g?(PAIRS[g]||[]).filter(x=>x!==fam):['Inter','Lora'];
 const tr=await trCheck(fam);
 const trT=tr.ok===null?'<b style="color:#c60">Doğrulanamadı</b> — font henüz yüklenmemiş olabilir (internet ya da dosya gerekir).':tr.ok?'<b style="color:#1a8a3a">✓ Türkçe karakterlerin hepsi var</b> (ğ Ğ ı İ ş Ş ç Ç ö Ö ü Ü).':`<b style="color:#c22">✗ Eksik karakter: ${X(tr.miss.join(' '))}</b> — bu karakterler başka fontla görünür.`;
 const chip=f=>`<button class="b mini" data-ff="${X(f)}" style="font-family:'${X(f)}'">${X(f)}</button>`;
 const note=own&&(PROJ&&0)?'':'';
 const p=MD('v15fo','Font bilgisi',X(fam),`<div class="v15f"><div style="font-family:'${X(fam)}';font-size:30px;line-height:1.2;margin:4px 0 10px">Dergi Atölyesi ğüşiöç ĞÜŞİÖÇ<br><span style="font-size:16px">Hızlı kahverengi tilki tembel köpeğin üstünden atladı.</span></div>
  <div class="v15iss"><b>Türkçe</b><span>${trT}</span></div>
  <div class="v15iss"><b>Lisans</b><span>${X(lic.t)}</span></div>
  <div class="v15iss"><b>Tür</b><span>${X(g||'Belirsiz (kendi fontun)')}</span></div>
  <div class="v15iss"><b>Benzer</b><span>${sim.map(chip).join(' ')||'—'}</span></div>
  <div class="v15iss"><b>Eşleşme</b><span>${pr.map(chip).join(' ')}<br><small class="mut">Başlık için bu font, gövde için eşleşme (ya da tersi) iyi çalışır.</small></span></div>
  <p class="mut">Bir fonta tıklarsan seçili metinlere uygulanır${T.length?'':' (şu an metin seçili değil: önce bir metin seç)'}.</p></div>${CSSX}`);
 p.onclick=e=>{const b=e.target.closest('[data-ff]');if(!b)return;const f=b.dataset.ff,L=selEls().filter(x=>x.txt!==undefined&&!x.lock);if(!L.length)return toast('Önce bir metin seç');
  document.fonts.load(`20px "${f}"`).catch(()=>0).then(()=>{L.forEach(x=>{x.ff=f});render();hist();ed();toast('Font: '+f);openFont(f)})}}
window.v4font={open:openFont,trCheck,licOf,grpOf,GRP,PAIRS};

/* ---------- Marka Kiti++ ---------- */
const B2=()=>{if(!PROJ)return null;return PROJ.brand2=Object.assign({tone:'',ban:'',hf:'',bf:'',forb:[],noEmoji:0,maxChars:0,tag:'',gap:3,extra:''},PROJ.brand2||{})};
const hx2rgb=h=>{h=String(h||'').replace('#','');if(h.length==3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return isNaN(n)||h.length!=6?null:[n>>16&255,n>>8&255,n&255]};
const cdist=(a,b)=>{const A=hx2rgb(a),B=hx2rgb(b);return A&&B?Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]):999};
async function audit(){const b=B2();if(!b)return[];const I=[],FB2={};await loadF();const ban=b.ban.split(/[,\n]/).map(s=>s.trim().toLowerCase()).filter(Boolean),mm=S.mm[0];let tagFound=!b.tag,H=100/S.fmt;
 await eachPage(async i=>{H=100/S.fmt;const add=(sev,e,msg)=>I.push({pg:i,id:e?e.id:-1,sev,msg:(e?(e.nm||(TY[e.type]?TY[e.type][1]:'Öğe'))+': ':'')+msg});
  const on=S.els.filter(e=>e.on);
  b.forb.forEach(fc=>{[['bg',S.bg]].forEach(([k,v])=>{if(v&&cdist(v,fc)<36)add('e',null,`sayfa arka planı yasaklı renge (${fc}) çok yakın`)});
   on.forEach(e=>{[e.col,e.fl,e.scol&&e.sb?e.scol:null].forEach(v=>{if(typeof v=='string'&&v[0]=='#'&&cdist(v,fc)<36)add('e',e,`yasaklı renk kullanıyor (${fc})`)})})});
  on.forEach(e=>{if(e.txt===undefined)return;const t=String(e.txt||''),tl=t.toLowerCase();
   if(b.hf||b.bf){const okf=[...new Set([b.hf,b.bf].filter(Boolean))];if(!okf.includes(e.ff)){(FB2[i]=FB2[i]||{e,f:{}}).f[e.ff]=(FB2[i].f[e.ff]||0)+1;FB2[i].n=(FB2[i].n||0)+1;FB2[i].okf=okf}}
   ban.forEach(w=>{if(tl.includes(w))add('w',e,`marka dilinde yasaklı sözcük: “${w}”`)});
   if(b.noEmoji&&/\p{Extended_Pictographic}/u.test(t))add('w',e,'emoji kullanımı marka kurallarında kapalı');
   if(b.maxChars>0&&t.length>b.maxChars&&e.type!='b')add('w',e,`${t.length} karakter (sosyal medya sınırı ${b.maxChars})`);
   if(b.tag&&tl.includes(b.tag.toLowerCase()))tagFound=true});
  const R=on.filter(e=>e.type!='r'||e.fr||e.shape).map(e=>{const g=geo(e,100);return{e,x:g[0]+(e.dx||0),y:g[1]+(e.dy||0),w:g[2],h:g[3]}}).filter(r=>r.w>0&&r.h>0&&!(r.w>=99&&r.h>=H*.98)).slice(0,70);
  const gmm=b.gap/mm*100;
  if(gmm>0)for(let a=0;a<R.length;a++)for(let c=a+1;c<R.length;c++){const A=R[a],C=R[c];if(A.e.type=='r'||C.e.type=='r')continue;
   const dx=Math.max(C.x-(A.x+A.w),A.x-(C.x+C.w),0),dy=Math.max(C.y-(A.y+A.h),A.y-(C.y+C.h),0);
   if(dx===0&&dy===0)continue;const d=Math.hypot(dx,dy);if(d<gmm-.05)add('w',A.e,`“${C.e.nm||(TY[C.e.type]?TY[C.e.type][1]:'öğe')}” ile aralık ${(d/100*mm).toFixed(1)} mm (en az ${b.gap} mm)`)}
  R.forEach(r=>{if(r.e.txt===undefined)return;const lim=gmm,m=Math.min(r.x,r.y,100-(r.x+r.w),H-(r.y+r.h));if(m>=0&&m<lim-.05)add('w',r.e,`sayfa kenarına ${(m/100*mm).toFixed(1)} mm yakın (en az ${b.gap} mm)`)})});
 Object.keys(FB2).forEach(k=>{const o=FB2[k];I.push({pg:+k,id:o.e.id,sev:'w',msg:`${o.n} metin kutusu font sistemi dışında: ${Object.entries(o.f).map(([f,c])=>f+' ×'+c).join(', ')}. İzinli: ${o.okf.join(', ')}`})});
 if(!tagFound)I.push({pg:0,id:-1,sev:'w',msg:`Zorunlu etiket “${b.tag}” hiçbir yerde geçmiyor`});
 I.sort((a,b2)=>a.pg-b2.pg);return I}
function openBrand(){const b=B2();if(!b)return toast('Önce bir proje aç');const fs=(sel)=>{const o=['<option value="">(serbest)</option>'];Object.entries(FC).forEach(([g,L])=>{o.push(`<optgroup label="${X(g)}">${L.map(f=>`<option${f===sel?' selected':''}>${X(f)}</option>`).join('')}</optgroup>`)});return o.join('')};
 const chips=()=>b.forb.map((c,i)=>`<span class="v15chip"><i style="background:${X(c)}"></i>${X(c)}<button class="cbb" data-rm="${i}" aria-label="Kaldır">✕</button></span>`).join('')||'<small class="mut">Yasaklı renk yok</small>';
 const p=MD('v15br','Marka Kiti++','Marka dili, font sistemi, yasaklı renkler, sosyal medya ve boşluk kuralları',`<div class="v15f">
  <label>Marka tonu (kısa tarif)<textarea id="b-tone" rows="2" placeholder="Örn. samimi, kısa cümleli, iddialı ama kibar">${X(b.tone)}</textarea></label>
  <label>Yasaklı sözcükler (virgülle)<input type="text" id="b-ban" value="${X(b.ban)}" placeholder="ucuz, bedava, kampanya"></label>
  <div class="v15r"><label>Başlık fontu<select id="b-hf">${fs(b.hf)}</select></label><label>Gövde fontu<select id="b-bf">${fs(b.bf)}</select></label></div>
  <div><b>Kullanılmayacak renkler</b><div id="b-chips">${chips()}</div><div class="v15r"><input type="color" id="b-fc" value="#00ff00"><button class="b" id="b-fa">Yasaklıya ekle</button></div></div>
  <div class="v15r"><label><input type="checkbox" id="b-em"${b.noEmoji?' checked':''}> Emoji kullanma</label><label>Metin sınırı (karakter, 0 = yok) <input type="number" id="b-mc" min="0" max="5000" value="${+b.maxChars||0}" style="width:90px"></label><label>Zorunlu etiket <input type="text" id="b-tag" value="${X(b.tag)}" placeholder="#editra" style="width:130px"></label></div>
  <label>Minimum boşluk (mm): öğeler arası ve metnin sayfa kenarına uzaklığı <input type="number" id="b-gap" min="0" max="30" step=".5" value="${+b.gap||0}" style="width:90px"></label>
  <label>Sosyal medya ve diğer kurallar (serbest not)<textarea id="b-ex" rows="2" placeholder="Örn. Instagram: logo sağ altta, story’de üst 14% boş">${X(b.extra)}</textarea></label>
  <div class="row"><button class="b pr" id="b-save">Kaydet</button><button class="b" id="b-aud">Tasarımı denetle</button></div><div id="b-res"></div></div>${CSSX}`);
 const read=()=>{b.tone=p.querySelector('#b-tone').value.slice(0,400);b.ban=p.querySelector('#b-ban').value.slice(0,400);b.hf=p.querySelector('#b-hf').value;b.bf=p.querySelector('#b-bf').value;b.noEmoji=p.querySelector('#b-em').checked?1:0;b.maxChars=Math.max(0,Math.min(5000,+p.querySelector('#b-mc').value||0));b.tag=p.querySelector('#b-tag').value.trim().slice(0,40);b.gap=Math.max(0,Math.min(30,+p.querySelector('#b-gap').value||0));b.extra=p.querySelector('#b-ex').value.slice(0,600)};
 p.onclick=async e=>{const t=e.target;
  if(t.id==='b-fa'){const c=p.querySelector('#b-fc').value;if(!b.forb.includes(c))b.forb.push(c);p.querySelector('#b-chips').innerHTML=chips();return}
  const rm=t.closest&&t.closest('[data-rm]');if(rm){b.forb.splice(+rm.dataset.rm,1);p.querySelector('#b-chips').innerHTML=chips();return}
  if(t.id==='b-save'){read();try{hist()}catch(x){}toast('Marka kitı kaydedildi');return}
  if(t.id==='b-aud'){read();const R=p.querySelector('#b-res');R.innerHTML='<p class="mut">Denetleniyor…</p>';let I;try{I=await audit()}catch(x){R.innerHTML='<p>Denetim çalışmadı</p>';return}
   R.innerHTML=(I.length?I.map(x=>`<div class="v15iss"><b>Sayfa ${x.pg+1}</b><span style="flex:1">${X(x.msg)}</span><button class="b mini" data-go="${x.pg}:${x.id}">Git</button></div>`).join(''):'<p><b style="color:#1a8a3a">✓ Marka kurallarına aykırı bir şey bulunamadı</b></p>');return}
  const g=t.closest&&t.closest('[data-go]');if(g){const[pg,id]=g.dataset.go.split(':').map(Number);p.hidden=true;goPage(pg);setTimeout(()=>{if(id>0&&byId(id)){S.sel=id;MSEL.clear();render();ed()}},80)}}}
window.v4brand={open:openBrand,audit,B2};

/* ---------- komutlar ---------- */
v4cmd(['Varlık','Asset Manager (logo, font, renk, mockup, ikon)',['Ctrl+Alt+A'],()=>openAssets()]);
v4cmd(['Metin','Font bilgisi: benzer, eşleşme, lisans, Türkçe',['Ctrl+Alt+F'],()=>openFont()]);
v4cmd(['Varlık','Marka Kiti++',['Ctrl+Alt+M'],openBrand]);
v4cmd(['Varlık','Marka kurallarına göre denetle',[],async()=>{openBrand();setTimeout(()=>{const b=document.getElementById('b-aud');if(b)b.click()},50)}]);
const mm=document.getElementById('mmenu');if(mm){[['Asset Manager',openAssets,'Ctrl+Alt+A'],['Marka Kiti++',openBrand,'Ctrl+Alt+M'],['Font bilgisi',()=>openFont(),'Ctrl+Alt+F']].forEach(([t,f,k])=>{const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML='<span>'+t+'</span><kbd>'+k+'</kbd>';w.onclick=()=>{mm.hidden=true;f()};mm.appendChild(w)})}
loadOwn().catch(()=>0);
})();
