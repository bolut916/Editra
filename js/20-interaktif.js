/* ===== İnteraktif yayınlar: video, Spotify, harita, 3D, GIF, Lottie, form, QR, web =====
   Öğe sayfada bir görsel olarak durur (kapak + QR). Basılı çıktıda QR kodlu kart,
   PDF/flipbook/önizlemede tıklanabilir bağlantı, "İnteraktif yayın (HTML)"
   dışa aktarımında canlı içerik olarak çalışır. Yüklenen dosyalar PROJ.media'da durur. */
(function(){
const X=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KD={
 video:{n:'Video',i:'▶',d:'YouTube ya da Vimeo bağlantısı, MP4/WebM bağlantısı ya da kendi video dosyan',ph:'https://youtu.be/…',ar:16/9,file:'video/mp4,video/webm,video/quicktime',max:15},
 spotify:{n:'Spotify',i:'♫',d:'Şarkı, albüm, çalma listesi ya da podcast bağlantısı',ph:'https://open.spotify.com/…',ar:3},
 maps:{n:'Google Haritalar',i:'⌖',d:'Adres ya da yer adı yaz (örn. “Galata Kulesi, İstanbul”)',ph:'Adres ya da yer adı',ar:4/3},
 model:{n:'3D model',i:'◳',d:'GLB/glTF bağlantısı ya da dosyası; okur döndürüp yakınlaştırır',ph:'https://…/model.glb',ar:1,file:'.glb,model/gltf-binary',max:15},
 gif:{n:'GIF / animasyon',i:'✦',d:'GIF ya da animasyonlu WebP; sayfada kendiliğinden oynar',ph:'https://…/animasyon.gif',ar:1,file:'image/gif,image/webp',max:8},
 lottie:{n:'Lottie',i:'◎',d:'Lottie JSON bağlantısı ya da dosyası; hafif vektör animasyon',ph:'https://…/animasyon.json',ar:1,file:'application/json,.json',max:3},
 form:{n:'Form',i:'✉',d:'E-posta adresini yaz: gönderimler e-postana gelir. Ya da Google Forms / Typeform bağlantısı',ph:'ornek@alanadi.com ya da https://forms.gle/…',ar:4/3},
 qr:{n:'QR kod',i:'▦',d:'Web adresi; basılı sayfadan dijitale köprü',ph:'https://…',ar:1},
 web:{n:'Web sayfası',i:'◰',d:'Herhangi bir https sayfası (bazı siteler gömülmeye izin vermez)',ph:'https://…',ar:4/3}};
const ORDER=['video','spotify','maps','model','gif','lottie','form','qr','web'];
const isHttps=u=>/^https:\/\/[^\s"'<>]+$/i.test(u),isHttp=u=>/^https?:\/\/[^\s"'<>]+$/i.test(u),isMail=u=>/^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(u);
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return''}};
const ytId=u=>{const m=u.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);return m&&m[1]};
const vmId=u=>{const m=u.match(/vimeo\.com\/(?:video\/)?(\d{5,})/i);return m&&m[1]};
const spId=u=>{const m=u.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]{10,})/i);return m&&{t:m[1].toLowerCase(),id:m[2]}};
const media=()=>{if(!PROJ.media||typeof PROJ.media!='object')PROJ.media={};return PROJ.media};
const mid=()=>'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);

/* ---------- kayıt: medya projeyle birlikte saklanır ---------- */
const _pack=window.pack,_unpack=window.unpack;
if(typeof _pack=='function')window.pack=function(){const r=_pack.apply(this,arguments);try{const M=(PROJ&&PROJ.media)||{},out={},walk=s=>((s&&s.els)||[]).forEach(e=>{const id=e.emb&&e.emb.media;if(id&&M[id])out[id]=M[id]});(r.pages||[]).forEach(p=>walk(p.s));(r.versions||[]).forEach(v=>(v.pages||[]).forEach(walk));r.media=out}catch(e){}return r};
if(typeof _unpack=='function')window.unpack=function(r){const o=_unpack.apply(this,arguments);try{PROJ.media=(r&&r.media&&typeof r.media=='object')?r.media:{}}catch(e){}return o};

/* ---------- girdiyi çözümle ---------- */
function resolve(k,v,file){v=(v||'').trim();
 if(file){const d=KD[k];if(!d.file)return{err:'Bu tür dosya kabul etmez'};return{emb:{k,media:file.id,mime:file.type,fname:file.name}}}
 if(!v)return{err:'Bir bağlantı ya da adres yaz'+(KD[k].file?' veya dosya seç':'')};
 if(k=='video'){const y=ytId(v);if(y)return{emb:{k,src:`https://www.youtube-nocookie.com/embed/${y}?rel=0&playsinline=1`,open:`https://youtu.be/${y}`,prov:'YouTube'}};
  const m=vmId(v);if(m)return{emb:{k,src:`https://player.vimeo.com/video/${m}`,open:`https://vimeo.com/${m}`,prov:'Vimeo'}};
  if(isHttps(v)&&/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(v))return{emb:{k,src:v,open:v,file:1,prov:host(v)}};
  return{err:'YouTube, Vimeo ya da https ile başlayan bir MP4/WebM bağlantısı gerekli'}}
 if(k=='spotify'){const s=spId(v);if(s)return{emb:{k,src:`https://open.spotify.com/embed/${s.t}/${s.id}`,open:`https://open.spotify.com/${s.t}/${s.id}`,prov:'Spotify',sp:s.t}};return{err:'open.spotify.com ile başlayan bir şarkı, albüm, çalma listesi ya da podcast bağlantısı gerekli'}}
 if(k=='maps'){if(v.length>200)return{err:'Adres çok uzun'};if(isHttps(v)&&/google\.[a-z.]+\/maps\/embed/i.test(v))return{emb:{k,src:v,open:v,prov:'Google Haritalar'}};
  const q=encodeURIComponent(v);return{emb:{k,src:`https://www.google.com/maps?q=${q}&output=embed`,open:`https://www.google.com/maps/search/?api=1&query=${q}`,prov:'Google Haritalar',addr:v}}}
 if(k=='model'){if(isHttps(v)&&/\.(glb|gltf)(\?|#|$)/i.test(v))return{emb:{k,src:v,open:v,prov:host(v)}};return{err:'https ile başlayan .glb ya da .gltf bağlantısı gerekli'}}
 if(k=='gif'){if(isHttps(v)&&/\.(gif|webp|png|apng)(\?|#|$)/i.test(v))return{emb:{k,src:v,open:v,prov:host(v)}};return{err:'https ile başlayan .gif ya da .webp bağlantısı gerekli'}}
 if(k=='lottie'){if(isHttps(v)&&/\.(json|lottie)(\?|#|$)/i.test(v))return{emb:{k,src:v,open:v,prov:host(v)}};return{err:'https ile başlayan .json ya da .lottie bağlantısı gerekli'}}
 if(k=='form'){if(isMail(v))return{emb:{k,mail:v,open:'mailto:'+v,prov:v}};if(isHttps(v))return{emb:{k,src:v,open:v,prov:host(v)}};return{err:'Geçerli bir e-posta adresi ya da https bağlantısı gerekli'}}
 if(k=='qr'){if(isHttp(v)||/^(mailto:|tel:)/i.test(v))return{emb:{k,open:v,prov:host(v)||v}};return{err:'http(s)://, mailto: ya da tel: ile başlayan bir adres gerekli'}}
 if(k=='web'){if(isHttps(v))return{emb:{k,src:v,open:v,prov:host(v)}};return{err:'https ile başlayan bir bağlantı gerekli'}}
 return{err:'Bilinmeyen tür'}}

/* ---------- baskı kartı (kapak) + QR ---------- */
const asc=s=>String(s).replace(/[^\x00-\x7F]/g,c=>encodeURIComponent(c));
function qrCv(text,px){const q=qrcode(0,'M');q.addData(asc(text));q.make();const n=q.getModuleCount(),m=3,cell=Math.max(1,Math.floor(px/(n+2*m))),S2=cell*(n+2*m),c=document.createElement('canvas');c.width=c.height=S2;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,S2,S2);x.fillStyle='#111';for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))x.fillRect((k+m)*cell,(r+m)*cell,cell,cell);return c}
const PAL={video:['#1b1464','#6c47ff','#fff'],spotify:['#101010','#1f1f1f','#1ed760'],maps:['#e6efe0','#cfe0c6','#ea4335'],model:['#0f172a','#334155','#22d3ee'],gif:['#2b0a3d','#7c3aed','#f9a8d4'],lottie:['#042f2e','#0f766e','#5eead4'],form:['#f4f4f8','#e4e4ee','#5b4bff'],qr:['#ffffff','#ffffff','#111111'],web:['#111827','#1f2937','#60a5fa']};
function icon(x,k,cx,cy,r,col){x.save();x.lineWidth=r*.12;x.strokeStyle=col;x.fillStyle=col;x.lineCap='round';x.lineJoin='round';
 if(k=='video'){x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.fillStyle=PAL.video[0];x.beginPath();x.moveTo(cx-r*.3,cy-r*.42);x.lineTo(cx+r*.5,cy);x.lineTo(cx-r*.3,cy+r*.42);x.closePath();x.fill()}
 else if(k=='spotify'){x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.strokeStyle='#101010';[[.55,.06],[.42,.0],[.3,-.06]].forEach(([w,o],i)=>{x.lineWidth=r*(.13-i*.02);x.beginPath();x.moveTo(cx-r*w,cy-r*(.28-i*.28)+r*o);x.quadraticCurveTo(cx,cy-r*(.42-i*.28),cx+r*w,cy-r*(.2-i*.28)+r*o);x.stroke()})}
 else if(k=='maps'){x.beginPath();x.moveTo(cx,cy+r);x.bezierCurveTo(cx-r*.15,cy+r*.5,cx-r*.75,cy+r*.05,cx-r*.75,cy-r*.3);x.arc(cx,cy-r*.3,r*.75,Math.PI,0);x.bezierCurveTo(cx+r*.75,cy+r*.05,cx+r*.15,cy+r*.5,cx,cy+r);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(cx,cy-r*.3,r*.3,0,7);x.fill()}
 else if(k=='model'){const a=r*.85,h=a*.5;x.beginPath();x.moveTo(cx,cy-a);x.lineTo(cx+a,cy-h);x.lineTo(cx+a,cy+h);x.lineTo(cx,cy+a);x.lineTo(cx-a,cy+h);x.lineTo(cx-a,cy-h);x.closePath();x.stroke();x.beginPath();x.moveTo(cx-a,cy-h);x.lineTo(cx,cy);x.lineTo(cx+a,cy-h);x.moveTo(cx,cy);x.lineTo(cx,cy+a);x.stroke()}
 else if(k=='gif'){x.font=`800 ${r*.95}px Inter,Arial,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('GIF',cx,cy)}
 else if(k=='lottie'){x.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*.28:r;x.lineTo(cx+Math.cos(a-Math.PI/2)*rr,cy+Math.sin(a-Math.PI/2)*rr)}x.closePath();x.fill()}
 else if(k=='form'){x.strokeStyle=col;const w=r*1.5,h=r*1.7;x.beginPath();x.roundRect?x.roundRect(cx-w/2,cy-h/2,w,h,r*.15):x.rect(cx-w/2,cy-h/2,w,h);x.stroke();[-.45,-.1,.25].forEach(o=>{x.beginPath();x.moveTo(cx-w*.3,cy+h*o);x.lineTo(cx+w*.3,cy+h*o);x.stroke()});x.fillRect(cx-w*.3,cy+h*.36,w*.32,h*.1)}
 else{x.beginPath();x.arc(cx,cy,r,0,7);x.stroke();x.beginPath();x.ellipse(cx,cy,r*.45,r,0,0,7);x.stroke();x.beginPath();x.moveTo(cx-r,cy);x.lineTo(cx+r,cy);x.stroke()}
 x.restore()}
function loadImgURL(u){return new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src=u})}
async function poster(emb,label){const k=emb.k,ar=KD[k].ar,W=1000,H=Math.round(W/ar),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),P=PAL[k],dark=!['maps','form','qr'].includes(k),fg=dark?'#ffffff':'#141414',u=Math.min(W,H)/100;
 const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,P[0]);g.addColorStop(1,P[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
 if(k=='maps'){x.strokeStyle='#ffffff';x.lineWidth=u*3;[[0,.7,1,.3],[.2,0,.75,1],[0,.25,1,.45]].forEach(([a,b,c2,d])=>{x.beginPath();x.moveTo(a*W,b*H);x.lineTo(c2*W,d*H);x.stroke()})}
 let frame=null;if(k=='gif'&&emb.media&&media()[emb.media])frame=await loadImgURL(media()[emb.media].d);
 if(frame){const q=Math.max(W/frame.width,H/frame.height);x.drawImage(frame,(W-frame.width*q)/2,(H-frame.height*q)/2,frame.width*q,frame.height*q);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,W,H)}
 if(k=='qr'){const s=Math.min(W,H)*.78,q=qrCv(emb.open,s);x.imageSmoothingEnabled=false;x.drawImage(q,(W-s)/2,(H-s)/2-u*5,s,s);x.fillStyle='#141414';x.font=`700 ${u*5.2}px Inter,Arial,sans-serif`;x.textAlign='center';x.fillText((label||emb.prov||'').slice(0,40),W/2,H-u*4);return c.toDataURL('image/png')}
 const hasQr=!!emb.open&&!/^mailto:/i.test(emb.open)||(k=='form'&&emb.mail),qs=hasQr?Math.min(W,H)*.3:0;
 icon(x,k,W/2,H*.42,Math.min(W,H)*.16,P[2]);
 x.fillStyle=fg;x.textAlign='left';x.textBaseline='alphabetic';const pad=u*6;
 x.font=`800 ${u*6.4}px Inter,Arial,sans-serif`;x.fillText(fit(x,label||KD[k].n,W-pad*2-qs-u*3),pad,H-pad-u*6.6);
 x.globalAlpha=.75;x.font=`600 ${u*4.2}px Inter,Arial,sans-serif`;x.fillText(fit(x,(emb.prov||emb.fname||'')+(hasQr?' · QR ile aç':' · İnteraktif yayında oynar'),W-pad*2-qs-u*3),pad,H-pad);x.globalAlpha=1;
 if(hasQr){const q=qrCv(k=='form'&&emb.mail?'mailto:'+emb.mail:emb.open,qs);x.imageSmoothingEnabled=false;x.fillStyle='#fff';x.fillRect(W-pad-qs,H-pad-qs,qs,qs);x.drawImage(q,W-pad-qs,H-pad-qs,qs,qs)}
 return c.toDataURL('image/png')}
function fit(x,t,w){t=String(t);if(x.measureText(t).width<=w)return t;while(t.length>1&&x.measureText(t+'…').width>w)t=t.slice(0,-1);return t+'…'}

/* ---------- sayfaya ekle / güncelle ---------- */
async function place(emb,label,edit){const png=await poster(emb,label),im=getIm(png);if(im.decode)await im.decode().catch(()=>0);
 emb.label=label||'';
 if(edit){edit.src=png;edit.im=im;const old=edit.emb;edit.emb=emb;edit.nm=KD[emb.k].n;if(emb.open&&!/^mailto:/i.test(emb.open)||emb.mail)edit.lk={t:'u',u:emb.mail?'mailto:'+emb.mail:emb.open};else if(edit.lk&&old&&edit.lk.u===old.open)delete edit.lk;
  const ar=KD[emb.k].ar,g=edit.fr;if(g&&old&&old.k!==emb.k)g[3]=+(g[2]/ar).toFixed(2)}
 else{const H=100/S.fmt,ar=KD[emb.k].ar;let w=emb.k=='qr'?26:emb.k=='spotify'?72:56,h=w/ar;if(h>H*.7){h=H*.7;w=h*ar}
  const e=mk('img');e.src=png;e.im=im;e.fit='cover';e.fr=[+((100-w)/2).toFixed(2),+((H-h)/2).toFixed(2),+w.toFixed(2),+h.toFixed(2)];e.pin=true;e.emb=emb;e.nm=KD[emb.k].n;e.z=topZ()+10;
  if(emb.mail)e.lk={t:'u',u:'mailto:'+emb.mail};else if(emb.open)e.lk={t:'u',u:emb.open};S.els.push(e);S.sel=e.id;edit=e}
 try{MSEL.clear()}catch(x){}render();list();ed();hist();if(typeof dirty=='function')dirty();return edit}

/* ---------- pencere ---------- */
let P0=null,KIND=null,EDIT=null,FILE=null;
function modal(){if(P0)return P0;P0=document.createElement('div');P0.id='v5int';P0.className='kpl v4o';P0.hidden=true;
 P0.innerHTML='<div class="kbox kwide v4f" role="dialog" aria-modal="true" aria-labelledby="v5h"><div class="kh"><b id="v5h">İnteraktif öğe</b><small>Video, müzik, harita, 3D, form, QR</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b" id="v5b"></div></div>';
 document.body.appendChild(P0);
 P0.addEventListener('mousedown',e=>{if(e.target===P0)close()});
 P0.addEventListener('click',onClick);P0.addEventListener('change',onChange);
 document.addEventListener('keydown',e=>{if(e.key=='Escape'&&P0&&!P0.hidden){e.stopPropagation();close()}},true);return P0}
function close(){if(P0)P0.hidden=true;FILE=null}
function open(){if(!PROJ||$('edw').hidden)return toast('Önce bir proje aç');const c=cur();EDIT=c&&c.emb?c:null;KIND=EDIT?EDIT.emb.k:null;FILE=null;modal().hidden=false;draw5();setTimeout(()=>{const i=$('v5u');if(i)i.focus()},50)}
function draw5(){const b=$('v5b');
 if(!KIND){const here=S.els.filter(e=>e.emb);
  b.innerHTML=`<p>Sayfana canlı içerik ekle. Basılı çıktıda <b>QR kodlu bir kart</b>, PDF ve flipbook'ta <b>tıklanabilir bağlantı</b>, “İnteraktif yayın (HTML)” dışa aktarımında <b>canlı içerik</b> olur.</p>
  <div class="v5k">${ORDER.map(k=>`<button type="button" class="v5c" data-k="${k}"><i>${KD[k].i}</i><b>${KD[k].n}</b><small>${X(KD[k].d)}</small></button>`).join('')}</div>
  ${here.length?`<hr><p><b>Bu sayfadaki interaktif öğeler</b></p><div class="row">${here.map(e=>`<button type="button" class="b" data-ed="${e.id}">${KD[e.emb.k].i} ${X(e.emb.label||KD[e.emb.k].n)} ✎</button>`).join('')}</div>`:''}
  <div class="row"><button type="button" class="b pr" data-exp>⬇ İnteraktif yayın (HTML) indir</button></div>`;return}
 const d=KD[KIND],e=EDIT&&EDIT.emb&&EDIT.emb.k==KIND?EDIT.emb:null,val=e?(e.addr||e.mail||(e.media?'':e.open)||''):'';
 b.innerHTML=`<div class="row"><button type="button" class="b" data-back>← Türler</button><b class="v5t">${d.i} ${d.n}</b></div>
  <p class="mut">${X(d.d)}</p>
  <label class="f"><span>${KIND=='maps'?'Adres ya da yer adı':KIND=='form'?'E-posta adresi ya da form bağlantısı':'Bağlantı'}</span><input type="text" id="v5u" value="${X(val)}" placeholder="${X(d.ph)}" autocomplete="off" spellcheck="false"></label>
  ${d.file?`<div class="row"><label class="b" for="v5file">📁 Dosya seç</label><input type="file" id="v5file" accept="${d.file}" hidden><small class="mut" id="v5fn">${e&&e.media?'Yüklü: '+X(e.fname||'dosya'):'En fazla '+d.max+' MB · dosya projeyle birlikte saklanır'}</small></div>`:''}
  <label class="f"><span>Etiket (isteğe bağlı)</span><input type="text" id="v5t" maxlength="40" value="${X(e?e.label:'')}" placeholder="Örn. ${KIND=='video'?'Tanıtım filmi':KIND=='spotify'?'Çalma listemiz':KIND=='maps'?'Mağazamız':KIND=='form'?'Sipariş formu':d.n}"></label>
  <p class="v5err" id="v5e" role="alert"></p>
  <div class="row"><button type="button" class="b pr" data-ok>${EDIT?'Güncelle':'Sayfaya ekle'}</button>${EDIT?'<button type="button" class="b" data-del>Öğeyi sil</button>':''}</div>
  <p class="mut">İpucu: öğeyi sayfada sürükleyip boyutlandırabilirsin. Düzenlemek için öğeyi seçip bu pencereyi yeniden aç ya da öğeye çift tıkla.</p>`}
async function onClick(ev){const t=ev.target;if(t.closest('[data-x]'))return close();let b;
 if(b=t.closest('[data-k]')){KIND=b.dataset.k;if(EDIT&&EDIT.emb.k!==KIND){/* tür değiştiriliyor */}FILE=null;draw5();const i=$('v5u');if(i)i.focus();return}
 if(t.closest('[data-back]')){KIND=null;FILE=null;draw5();return}
 if(b=t.closest('[data-ed]')){const e=S.els.find(z=>z.id==+b.dataset.ed);if(e){S.sel=e.id;try{MSEL.clear()}catch(x){}render();ed();EDIT=e;KIND=e.emb.k;draw5()}return}
 if(t.closest('[data-exp]')){close();return exportHTML()}
 if(t.closest('[data-del]')&&EDIT){S.els=S.els.filter(z=>z!==EDIT);S.sel=null;EDIT=null;render();list();ed();hist();if(typeof dirty=='function')dirty();close();return toast('İnteraktif öğe silindi')}
 if(b=t.closest('[data-ok]')){const er=$('v5e');er.textContent='';b.disabled=true;
  try{let fileRef=null;if(FILE){const id=mid();media()[id]={t:FILE.type,d:FILE.data,n:FILE.name};fileRef={id,type:FILE.type,name:FILE.name}}
   else if(EDIT&&EDIT.emb.k==KIND&&EDIT.emb.media&&!$('v5u').value.trim())fileRef={id:EDIT.emb.media,type:EDIT.emb.mime,name:EDIT.emb.fname};
   const r=resolve(KIND,$('v5u').value,fileRef);if(r.err){er.textContent=r.err;return}
   const was=!!EDIT;await place(r.emb,$('v5t').value.trim().slice(0,40),EDIT);close();toast(was?'İnteraktif öğe güncellendi ✓':KD[KIND].n+' sayfaya eklendi ✓ · Dışa aktar → İnteraktif yayın (HTML)')}
  catch(x){er.textContent='Eklenemedi: '+(x&&x.message||x)}finally{b.disabled=false}}}
function onChange(ev){const t=ev.target;if(t.id!=='v5file')return;const f=t.files&&t.files[0];t.value='';if(!f)return;const d=KD[KIND],fn=$('v5fn'),er=$('v5e');er.textContent='';
 if(f.size>d.max*1048576){er.textContent=`Dosya çok büyük (${(f.size/1048576).toFixed(1)} MB). En fazla ${d.max} MB.`;return}
 const okType=KIND=='model'?/\.glb$/i.test(f.name):KIND=='lottie'?/\.json$/i.test(f.name)||/json/.test(f.type):KIND=='gif'?/^image\/(gif|webp)$/.test(f.type):/^video\//.test(f.type);
 if(!okType){er.textContent='Bu dosya türü desteklenmiyor';return}
 const rd=new FileReader();rd.onload=()=>{let data=String(rd.result);if(KIND=='model')data=data.replace(/^data:[^;,]*/,'data:model/gltf-binary');if(KIND=='lottie'){try{JSON.parse(atob(data.split(',')[1]))}catch(x){er.textContent='Geçerli bir Lottie JSON dosyası değil';return}data=data.replace(/^data:[^;,]*/,'data:application/json')}
  FILE={name:f.name.slice(0,80),type:KIND=='model'?'model/gltf-binary':KIND=='lottie'?'application/json':f.type,data};fn.textContent='Seçildi: '+f.name+' · '+(f.size/1048576).toFixed(1)+' MB';const u=$('v5u');if(u)u.value=''};
 rd.onerror=()=>{er.textContent='Dosya okunamadı'};rd.readAsDataURL(f)}

/* ---------- İnteraktif yayın (HTML) ---------- */
function pageData(){const k=S.fmt,E=[],L=[],M=media(),okU=u=>typeof u=='string'&&/^(https?:\/\/|mailto:|tel:)/i.test(u.trim());
 S.els.forEach(e=>{if(!e.on)return;const g=geo(e,100),q={x:+(g[0]+(e.dx||0)).toFixed(3),y:+((g[1]+(e.dy||0))*k).toFixed(3),w:+g[2].toFixed(3),h:+(g[3]*k).toFixed(3)};
  if(e.emb){const m=e.emb,o={...q,k:m.k,label:m.label||KD[m.k].n,open:m.open||'',src:m.src||'',mail:m.mail||'',file:m.file?1:0,ar:KD[m.k].ar};if(m.media&&M[m.media]){o.media=m.media;o.mime=M[m.media].t}E.push(o);return}
  if(e.lk){if(e.lk.t=='p'&&e.lk.n>=1&&e.lk.n<=PROJ.pages.length)L.push({...q,t:'p',n:e.lk.n|0});else if(e.lk.t=='u'&&okU(e.lk.u))L.push({...q,t:'u',u:e.lk.u.trim().slice(0,500)})}});return{E,L}}
async function exportHTML(){if(!PROJ||$('edw').hidden)return toast('Önce bir proje aç');toast('İnteraktif yayın hazırlanıyor…');const pages=[],used={},M=media();
 try{await eachPage(async()=>{await loadF();const d=pageData();d.E.forEach(o=>{if(o.media)used[o.media]=M[o.media].d});pages.push({img:draw(1400).toDataURL('image/jpeg',.86),e:d.E,l:d.L})})}
 catch(x){return toast('Hazırlanamadı: '+(x&&x.message||x))}
 const T=String(PROJ.name||'Yayın'),J=o=>JSON.stringify(o).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 const html=VIEW.replace(/__T__/g,()=>X(T)).replace('__P__',()=>J(pages)).replace('__M__',()=>J(used)).replace('__N__',()=>J(T));
 await save((window.v4slug?v4slug(T):'yayin')+'-interaktif.html',new Blob([html],{type:'text/html'}));
 const n=pages.reduce((a,p)=>a+p.e.length,0);toast(`İnteraktif yayın indirildi ✓ · ${pages.length} sayfa, ${n} canlı öğe`)}

const VIEW=`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>__T__</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#111115;color:#f2f2f5;font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
header{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:12px;padding:10px 16px;padding-top:max(10px,env(safe-area-inset-top));background:rgba(17,17,21,.86);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.08)}
header b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:16px}header span{opacity:.6;font-size:13px;white-space:nowrap}
main{max-width:980px;margin:0 auto;padding:18px 12px 40px;display:grid;gap:20px}
.pg{position:relative;background:#fff;box-shadow:0 24px 60px -24px #000;scroll-margin-top:64px;overflow:hidden}
.pg>img{display:block;width:100%;height:auto}
.hs{position:absolute;display:block;border-radius:3px}.hs:hover,.hs:focus-visible{outline:2px solid rgba(124,92,255,.8)}
.em{position:absolute;padding:0;margin:0;border:0;background:none;display:grid;place-items:center;cursor:pointer;color:#fff;font:inherit}
.em:focus-visible{outline:3px solid #7c5cff;outline-offset:2px}
.em .pl{display:inline-flex;align-items:center;gap:7px;max-width:92%;padding:8px 13px;border-radius:999px;background:rgba(17,17,17,.82);color:#fff;font:600 13px system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:transform .2s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.em:hover .pl{transform:scale(1.06)}
.em.live{cursor:default;overflow:hidden}.em.live>img,.em.live>lottie-player{width:100%;height:100%;object-fit:cover;display:block}
#lb{position:fixed;inset:0;z-index:10;background:rgba(0,0,0,.88);display:none;align-items:center;justify-content:center;flex-direction:column;gap:12px;padding:56px 14px 18px}
#lb.on{display:flex}
#lbx{position:absolute;top:max(10px,env(safe-area-inset-top));right:12px;width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#111;font-size:20px;cursor:pointer}
#lbc{width:min(1000px,100%);display:flex;justify-content:center}
#lbc>iframe,#lbc>video,#lbc>model-viewer{width:100%;max-height:calc(100vh - 140px);border:0;border-radius:12px;background:#000;display:block}
#lbc>model-viewer{background:#f3f3f6}
#lbm{font-size:14px;opacity:.8;text-align:center}#lbm a{color:#c4b5fd}
form.fm{width:min(460px,100%);background:#fff;color:#141414;border-radius:16px;padding:22px;display:grid;gap:10px}
form.fm h3{margin:0 0 4px;font-size:20px}form.fm label{display:grid;gap:4px;font-size:13px;font-weight:600}
form.fm input,form.fm textarea{font:inherit;padding:10px 12px;border:1px solid #d4d4dc;border-radius:10px;width:100%}
form.fm button{font:inherit;font-weight:700;padding:12px;border:0;border-radius:10px;background:#5b4bff;color:#fff;cursor:pointer}
footer{opacity:.5;text-align:center;font-size:12px;padding:6px 16px 28px}
</style></head><body>
<header><b>__T__</b><span id="pc"></span></header><main id="m"></main>
<div id="lb" role="dialog" aria-modal="true" aria-label="İçerik"><button id="lbx" aria-label="Kapat">✕</button><div id="lbc"></div><div id="lbm"></div></div>
<footer>Vybble ile hazırlandı · Canlı öğeler için internet bağlantısı gerekir</footer>
<script>
var P=__P__,M=__M__,N=__N__;
var LOT="https://cdn.jsdelivr.net/npm/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js",MV="https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
var IC={video:"▶",spotify:"♫",maps:"⌖",model:"◳",gif:"✦",lottie:"◎",form:"✉",qr:"▦",web:"◰"},ACT={video:"Oynat",spotify:"Dinle",maps:"Haritayı aç",model:"3D'yi aç",form:"Formu aç",web:"Aç",qr:"Aç"};
function el(t,a,c){var e=document.createElement(t);if(a)for(var k in a)e.setAttribute(k,a[k]);if(c!=null)e.textContent=c;return e}
function pos(e,q){e.style.left=q.x+"%";e.style.top=q.y+"%";e.style.width=q.w+"%";e.style.height=q.h+"%"}
var loaded={};function need(src,mod){if(loaded[src])return;loaded[src]=1;var s=el("script",{src:src});if(mod)s.type="module";document.head.appendChild(s)}
function srcOf(o){return o.media&&M[o.media]?M[o.media]:o.src}
function safe(u){return typeof u=="string"&&/^(https:\\/\\/|data:(image|video|model|application\\/json))/i.test(u)}
var m=document.getElementById("m"),lb=document.getElementById("lb"),lbc=document.getElementById("lbc"),lbm=document.getElementById("lbm");
P.forEach(function(p,i){var d=el("section",{"class":"pg",id:"s"+(i+1),"aria-label":"Sayfa "+(i+1)});var im=el("img",{src:p.img,alt:"Sayfa "+(i+1),loading:i>1?"lazy":"eager"});d.appendChild(im);
 (p.l||[]).forEach(function(q){var a=el("a",{"class":"hs",href:q.t=="p"?"#s"+q.n:q.u,title:q.t=="p"?"Sayfa "+q.n:q.u});if(q.t!="p"){a.target="_blank";a.rel="noopener"}pos(a,q);d.appendChild(a)});
 (p.e||[]).forEach(function(o){var s=srcOf(o);
  if(o.k=="gif"&&safe(s)){var b=el("div",{"class":"em live"});b.appendChild(el("img",{src:s,alt:o.label}));pos(b,o);d.appendChild(b);return}
  if(o.k=="lottie"&&safe(s)){need(LOT);var b2=el("div",{"class":"em live"});var lp=el("lottie-player",{src:s,autoplay:"",loop:"",background:"transparent"});b2.appendChild(lp);pos(b2,o);d.appendChild(b2);return}
  if(o.k=="qr"){var a=el("a",{"class":"em",href:o.open,target:"_blank",rel:"noopener","aria-label":o.label});pos(a,o);d.appendChild(a);return}
  var bt=el("button",{"class":"em",type:"button","aria-label":(ACT[o.k]||"Aç")+": "+o.label});bt.appendChild(el("span",{"class":"pl"},(IC[o.k]||"▶")+" "+(ACT[o.k]||"Aç")));pos(bt,o);bt.onclick=function(){show(o)};d.appendChild(bt)});
 m.appendChild(d)});
function show(o){lbc.textContent="";lbm.textContent="";var s=srcOf(o),ar=o.ar||16/9;
 if(o.k=="video"&&(o.media||o.file)){if(!safe(s))return;var v=el("video",{src:s,controls:"",autoplay:"",playsinline:""});v.style.aspectRatio=ar;lbc.appendChild(v)}
 else if(o.k=="model"){if(!safe(s))return;need(MV,1);var mv=el("model-viewer",{src:s,"camera-controls":"","auto-rotate":"",ar:"","touch-action":"pan-y",alt:o.label});mv.style.aspectRatio="1";mv.style.maxWidth="min(700px,100%)";lbc.appendChild(mv)}
 else if(o.k=="form"&&o.mail){var f=el("form",{"class":"fm"});f.appendChild(el("h3",null,o.label));[["ad","Ad Soyad","text"],["eposta","E-posta","email"],["tel","Telefon","tel"]].forEach(function(r){var l=el("label",null,r[1]);var i=el("input",{name:r[0],type:r[2]});if(r[0]!="tel")i.required=true;l.appendChild(i);f.appendChild(l)});var lm=el("label",null,"Mesaj");lm.appendChild(el("textarea",{name:"mesaj",rows:"4"}));f.appendChild(lm);f.appendChild(el("button",{type:"submit"},"Gönder"));
  f.onsubmit=function(ev){ev.preventDefault();var fd=new FormData(f),b="";fd.forEach(function(v,k){b+=k+": "+v+"\\n"});location.href="mailto:"+encodeURIComponent(o.mail).replace(/%40/g,"@")+"?subject="+encodeURIComponent(N+" · "+o.label)+"&body="+encodeURIComponent(b)};lbc.appendChild(f);lbm.textContent="Gönder'e basınca e-posta uygulaman açılır."}
 else{if(!/^https:\\/\\//i.test(s))return;var src=s;if(o.k=="video")src+=(s.indexOf("?")>0?"&":"?")+"autoplay=1";var fr=el("iframe",{src:src,title:o.label,allow:"autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write",allowfullscreen:"",loading:"lazy",referrerpolicy:"strict-origin-when-cross-origin"});
  if(o.k=="web"||(o.k=="form"&&!o.mail))fr.setAttribute("sandbox","allow-scripts allow-same-origin allow-popups allow-forms allow-presentation");
  fr.style.aspectRatio=o.k=="spotify"?"auto":String(ar);if(o.k=="spotify"){fr.style.height="352px";fr.style.maxWidth="640px"}if(o.k=="form"||o.k=="web"){fr.style.aspectRatio="auto";fr.style.height="calc(100vh - 160px)"}lbc.appendChild(fr)}
 if(o.open&&/^https:\\/\\//i.test(o.open)){var a=el("a",{href:o.open,target:"_blank",rel:"noopener"},"Yeni sekmede aç ↗");lbm.appendChild(document.createTextNode((lbm.textContent?lbm.textContent+" · ":"")));lbm.appendChild(a)}
 lb.classList.add("on");document.getElementById("lbx").focus()}
function hide(){lb.classList.remove("on");lbc.textContent="";lbm.textContent=""}
document.getElementById("lbx").onclick=hide;lb.addEventListener("click",function(e){if(e.target===lb)hide()});document.addEventListener("keydown",function(e){if(e.key=="Escape")hide()});
var pc=document.getElementById("pc");function upd(){var y=window.scrollY+innerHeight/3,n=1;document.querySelectorAll(".pg").forEach(function(s,i){if(s.offsetTop<=y)n=i+1});pc.textContent=n+" / "+P.length}addEventListener("scroll",upd,{passive:true});upd();
<\/script></body></html>`;

/* ---------- menüler, komutlar, çift tık ---------- */
try{v4cmd(['Ekle','İnteraktif öğe (video, Spotify, harita, 3D, form, QR)',[],open]);v4cmd(['Dosya','İnteraktif yayın (HTML) indir',[],exportHTML])}catch(e){}
const mm=$('mmenu');if(mm){const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML='<span>İnteraktif öğe ekle (video, harita, 3D, QR…)</span>';w.onclick=()=>{mm.hidden=true;open()};mm.insertBefore(w,mm.querySelector('.pitem.wide')||null)}
const xm=$('xmenu');if(xm){const b=document.createElement('button');b.type='button';b.className='b';b.style.cssText='width:100%;margin-top:6px';b.textContent='İnteraktif yayın (HTML)';b.onclick=()=>{xm.hidden=true;exportHTML()};xm.appendChild(b)}
const cvEl=$('cv');if(cvEl)cvEl.addEventListener('dblclick',e=>{const x=e.target.closest&&e.target.closest('[data-id]');if(!x)return;const el=S.els.find(z=>z.id==+x.dataset.id);if(el&&el.emb){e.stopPropagation();e.preventDefault();S.sel=el.id;open()}},true);
window.v5int={open,exportHTML,resolve,KD};
})();
