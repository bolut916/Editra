/* ================= STÜDYO 6: toplu içe aktarma, CSV katalog, bul-değiştir, şablonlarım ================= */
(function(){
const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function modal(id,title,body,sub){let p=$(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)p.hidden=true});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))p.hidden=true})}
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>${title}</b><small>${sub||''}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b">${body}</div></div>`;p.hidden=false;return p}
const dl=(name,txt,type)=>save(name,new Blob([txt],{type:type||'text/plain'}));
function insertPages(snaps,at){PROJ.pages[PROJ.cur].s=pageSnap();thumbNow();PROJ.pages.splice(at,0,...snaps.map(s=>({s,thumb:''})));enter(at)}
async function fillThumbs(){for(let k=0;k<10;k++){if(!PROJ.pages.some(p=>!p.thumb))break;await initThumbs()}strip(true)}
function freshSnap(els){const s=pageSnap();s.els=JSON.parse(JSON.stringify(els.map(e=>({...e,im:null}))));s.sel=null;return s}
function masters(){const out=[];COMPS().filter(c=>c.master).forEach(c=>compClones(c).forEach(n=>out.push(n)));return out}

/* ---------- 1) toplu görsel -> sayfalar ---------- */
function slots(N){const C=S.cols,R=S.rows,k=N<=1?1:N==2?2:N==3?3:N==4?2:N==6?3:N==8?4:N==9?3:Math.ceil(Math.sqrt(N)),rw=Math.ceil(N/k),A=[];
 for(let j=0;j<N;j++){const c=j%k,r=Math.floor(j/k),c0=1+Math.round(c*C/k),c1=1+Math.round((c+1)*C/k),r0=1+Math.round(r*R/rw),r1=1+Math.round((r+1)*R/rw);A.push([c0,r0,Math.max(1,c1-c0),Math.max(1,r1-r0)])}return A}
function bulk(){if(!PROJ)return;const p=modal('v4bulk','Toplu görsel → sayfalar',`<p>Birden çok fotoğraf seç; her sayfaya istediğin sayıda yerleşsin. Sayfalar şu anki sayfanın <b>arkasına</b> eklenir.</p>
 <label class="f"><span>Sayfa başına görsel</span><select id="v4bn">${[1,2,3,4,6,9].map(n=>`<option value="${n}">${n}</option>`).join('')}</select></label>
 <label class="f"><span>Yerleşim</span><select id="v4bf"><option value="cover">Kutuyu doldur (kırp)</option><option value="contain">Tamamı görünsün (sığdır)</option></select></label>
 <div class="row"><button class="b" id="v4bp">Görselleri seç…</button><span id="v4bi" class="mut">Henüz seçilmedi</span></div><input type="file" id="v4bfile" accept="image/*" multiple hidden>
 <div class="row"><button class="b pr" id="v4bgo" disabled>Sayfaları oluştur</button></div>`);
 let F=[];const inp=p.querySelector('#v4bfile'),go=p.querySelector('#v4bgo');
 p.querySelector('#v4bp').onclick=()=>inp.click();
 inp.onchange=()=>{F=[...inp.files].filter(f=>f.type.startsWith('image/')).sort((a,b)=>a.name.localeCompare(b.name,'tr',{numeric:true}));p.querySelector('#v4bi').textContent=F.length?F.length+' görsel (ada göre sıralı)':'Görsel bulunamadı';go.disabled=!F.length};
 go.onclick=async()=>{go.disabled=true;const N=+p.querySelector('#v4bn').value,fit=p.querySelector('#v4bf').value,sl=slots(N);toast('Görseller hazırlanıyor…');
  const L=await Promise.all(F.map(loadImg));const ok=L.filter(Boolean);if(!ok.length){go.disabled=false;return toast('Görsel okunamadı')}
  const snaps=[];for(let i=0;i<ok.length;i+=N){const els=[];ok.slice(i,i+N).forEach((o,j)=>{const e=mk('img');e.src=o.url;e.fit=fit;e.pos=sl[j];els.push(e)});masters().forEach(m=>els.push(m));snaps.push(freshSnap(els))}
  p.hidden=true;insertPages(snaps,PROJ.cur+1);hist();toast(snaps.length+' sayfa oluşturuldu · '+ok.length+' görsel');fillThumbs()}}

/* ---------- 2) CSV'den katalog ---------- */
function parseCSV(t){t=t.replace(/^﻿/,'');const first=t.split(/\r?\n/)[0]||'',d=[';','\t',','].map(c=>[c,first.split(c).length]).sort((a,b)=>b[1]-a[1])[0][0],rows=[];let row=[],f='',q=false;
 for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c=='"'){if(t[i+1]=='"'){f+='"';i++}else q=false}else f+=c}else if(c=='"')q=true;else if(c==d){row.push(f);f=''}else if(c=='\n'||c=='\r'){if(c=='\r'&&t[i+1]=='\n')i++;row.push(f);f='';rows.push(row);row=[]}else f+=c}
 if(f!==''||row.length){row.push(f);rows.push(row)}return rows.filter(r=>r.some(x=>x.trim()!==''))}
const RES=new Set(['sayfa','toplam']),IMGH=/görsel|gorsel|resim|foto|image|img|photo|dosya/i;
function csvDemoPage(){const els=[],R=S.rows,C=S.cols,r0=Math.max(3,Math.round(R*.6)),im=mk('img');im.pos=[1,1,C,r0-1];els.push(im);
 const t=mk('t');t.txt='{Ad}';t.pos=[1,r0,C,2];t.fs=7;els.push(t);
 const f=mk('s');f.txt='{Fiyat}';f.pos=[1,r0+2,C,1];els.push(f);
 const b=mk('b');b.txt='{Açıklama}';b.pos=[1,r0+3,Math.max(1,Math.round(C*.7)),Math.max(1,R-(r0+3))];els.push(b);
 masters().forEach(m=>els.push(m));insertPages([freshSnap(els)],PROJ.cur+1);hist();toast('Örnek şablon sayfası eklendi · {Ad}, {Fiyat}, {Açıklama} yer tutucularını düzenleyebilirsin')}
function csvCat(){if(!PROJ)return;const p=modal('v4csv','CSV\'den katalog üret',`<p>Şu anki sayfa <b>şablon</b> olur. Metinlere <code>{Ad}</code>, <code>{Fiyat}</code> gibi CSV başlıklarını yaz; her kayıt için sayfa kopyalanır. Sayfada birden çok kayıt için <code>{Ad#2}</code>, <code>{Fiyat#3}</code> kullan.</p>
 <div class="row"><button class="b" id="v4cf">CSV dosyası seç…</button><button class="b" id="v4cd">Örnek CSV indir</button><button class="b" id="v4cs">Örnek şablon sayfası ekle</button></div><input type="file" id="v4cfile" accept=".csv,.txt,text/csv,text/plain" hidden>
 <label class="f"><span>ya da buraya yapıştır (ilk satır başlık)</span><textarea id="v4ct" rows="5" spellcheck="false" placeholder="Ad;Fiyat;Açıklama;Görsel"></textarea></label>
 <div class="row"><label class="f" style="flex:1"><span>Sayfa başına kayıt</span><select id="v4cn">${[1,2,3,4,6].map(n=>`<option>${n}</option>`).join('')}</select></label><label class="f" style="flex:1"><span>Görsel sütunu</span><select id="v4ci"><option value="-1">— yok —</option></select></label></div>
 <div class="row"><button class="b" id="v4cp">Görselleri seç…</button><span id="v4cm" class="mut">Görsel seçilmedi</span></div><input type="file" id="v4cimg" accept="image/*" multiple hidden>
 <div id="v4cinfo" class="mut"></div><div class="row"><button class="b pr" id="v4cg" disabled>Sayfaları üret</button></div>`);
 const $$=s=>p.querySelector(s);let rows=[],H=[],IM=[];
 const reparse=()=>{rows=parseCSV($$('#v4ct').value);H=rows[0]||[];const sel=$$('#v4ci');sel.innerHTML='<option value="-1">— yok —</option>'+H.map((h,i)=>`<option value="${i}">${E(h)}</option>`).join('');const ix=H.findIndex(h=>IMGH.test(h));sel.value=ix;
  $$('#v4cinfo').textContent=rows.length>1?`${rows.length-1} kayıt · sütunlar: ${H.map(h=>'{'+h.trim()+'}').join(' ')}`:'Henüz geçerli veri yok';$$('#v4cg').disabled=rows.length<2};
 $$('#v4cf').onclick=()=>$$('#v4cfile').click();
 $$('#v4cfile').onchange=async e=>{const f=e.target.files[0];if(!f)return;$$('#v4ct').value=await f.text();reparse()};$$('#v4ct').oninput=reparse;
 $$('#v4cd').onclick=()=>dl('ornek-katalog.csv','﻿Ad;Fiyat;Açıklama;Görsel\nSade Ceket;1.250 ₺;Pamuklu, düz kesim;ceket.jpg\nKeten Gömlek;890 ₺;Rahat kalıp, yazlık;gomlek.jpg\nDeri Çanta;2.400 ₺;El yapımı, hakiki deri;canta.jpg\n','text/csv');
 $$('#v4cs').onclick=()=>{p.hidden=true;csvDemoPage()};
 $$('#v4cp').onclick=()=>$$('#v4cimg').click();$$('#v4cimg').onchange=e=>{IM=[...e.target.files].filter(f=>f.type.startsWith('image/'));$$('#v4cm').textContent=IM.length?IM.length+' görsel seçildi (dosya adıyla eşleşir)':'Görsel seçilmedi'};
 $$('#v4cg').onclick=async()=>{const g=$$('#v4cg');g.disabled=true;try{const N=+$$('#v4cn').value,ic=+$$('#v4ci').value,data=rows.slice(1);PROJ.pages[PROJ.cur].s=pageSnap();const T=PROJ.pages[PROJ.cur].s;
  const keys={};H.forEach((h,i)=>{keys[h.trim().toLocaleLowerCase('tr')]=i});
  const hasPh=T.els.some(e=>typeof e.txt=='string'&&/\{[^{}]+\}/.test(e.txt)&&[...e.txt.matchAll(/\{([^{}#]+?)(?:#\d+)?\}/g)].some(m=>keys[m[1].trim().toLocaleLowerCase('tr')]!==undefined));
  if(!hasPh){g.disabled=false;return toast('Şablon sayfada CSV başlıklarına uyan {yer tutucu} yok. Örnek şablon sayfası ekleyebilirsin.')}
  const base=n=>String(n).toLowerCase().replace(/\.[a-z0-9]+$/,''),byName={};IM.forEach(f=>{byName[f.name.toLowerCase()]=f;byName[base(f.name)]=f});
  const fileFor=(r,gi)=>{if(!IM.length)return null;if(ic>=0){const v=String(r[ic]||'').trim().toLowerCase().split(/[\\/]/).pop();if(v){if(byName[v])return byName[v];if(byName[base(v)])return byName[base(v)]}}else if(IM.length>=data.length)return IM[gi]||null;return null};
  const cache=new Map(),getImg=async f=>{if(!f)return null;if(!cache.has(f))cache.set(f,loadImg(f));return cache.get(f)};
  const imgIdx=T.els.map((e,i)=>e.type=='img'?i:-1).filter(i=>i>=0),snaps=[];let miss=0;
  for(let i=0;i<data.length;i+=N){const chunk=data.slice(i,i+N),els=JSON.parse(JSON.stringify(T.els));
   els.forEach(e=>{if(typeof e.txt=='string'){e.txt=e.txt.replace(/\{([^{}#]+?)(?:#(\d+))?\}/g,(m0,k,s)=>{const kk=k.trim().toLocaleLowerCase('tr');if(RES.has(kk))return m0;const ci=keys[kk];if(ci===undefined)return m0;const r=chunk[(+s||1)-1];return r?String(r[ci]||'').trim():''});delete e.dt;delete e.tg}});
   for(let j=0;j<chunk.length;j++){const ix=imgIdx[j];if(ix===undefined)break;const f=fileFor(chunk[j],i+j),o=await getImg(f);if(o){els[ix].src=o.url}else{els[ix].src='';if(ic>=0||IM.length)miss++}}
   snaps.push(Object.assign({},T,{els,sel:null}))}
  p.hidden=true;toast(snaps.length+' sayfa üretiliyor…');const c0=PROJ.cur;insertPages(snaps.map(s=>JSON.parse(JSON.stringify(s))),c0+1);
  await eachPage(async pi=>{await loadF();if(S.af)fitAll();PROJ.pages[pi].s=pageSnap();PROJ.pages[pi].thumb=''},snaps.map((_,k)=>c0+1+k));hist();
  toast(snaps.length+' sayfa üretildi'+(miss?` · ${miss} görsel eşleşmedi`:''));fillThumbs()}catch(err){console.error(err);toast('Katalog üretilemedi: '+err.message);g.disabled=false}};
 reparse()}

/* ---------- 3) bul ve değiştir ---------- */
const FR={q:'',r:'',cs:false,ww:false};
function findAll(txt,q,cs,ww){if(!q)return[];const nrm=s=>cs?s:s.toLocaleLowerCase('tr'),h=nrm(txt),n=nrm(q),out=[],isW=c=>!!c&&/[\p{L}\p{N}_]/u.test(c);let i=0;
 while((i=h.indexOf(n,i))>=0){const j=i+n.length;if(!ww||(!isW(txt[i-1])&&!isW(txt[j])))out.push([i,j]);i=j>i?j:i+1}return out}
function frMatches(){const out=[];if(!PROJ||!FR.q)return out;PROJ.pages.forEach((p,i)=>{const els=i==PROJ.cur?S.els:((p.s&&p.s.els)||[]);els.forEach(e=>{if(typeof e.txt!='string')return;const m=findAll(e.txt,FR.q,FR.cs,FR.ww);if(m.length)out.push({pg:i,id:e.id,n:m.length})})});return out}
function frReplaceIn(txt,first){const m=findAll(txt,FR.q,FR.cs,FR.ww);if(!m.length)return{t:txt,n:0};const use=first?[m[0]]:m;let o='',p=0;use.forEach(([a,b])=>{o+=txt.slice(p,a)+FR.r;p=b});return{t:o+txt.slice(p),n:use.length}}
function find(){if(!PROJ)return;const p=modal('v4fr','Bul ve değiştir',`<label class="f"><span>Bul</span><input type="text" id="v4q" autocomplete="off" spellcheck="false"></label><label class="f"><span>Şununla değiştir</span><input type="text" id="v4r" autocomplete="off" spellcheck="false"></label>
 <div class="row"><label class="ck"><input type="checkbox" id="v4cs"> Büyük/küçük harf</label><label class="ck"><input type="checkbox" id="v4ww"> Tam kelime</label></div><div id="v4fi" class="mut"></div>
 <div class="row"><button class="b" id="v4fn">Sonrakini bul</button><button class="b" id="v4fo">Değiştir</button><button class="b pr" id="v4fa">Tümünü değiştir</button></div><p class="mut">Tümünü değiştir bütün sayfalarda uygulanır ve Ctrl+Z ile geri alınamaz.</p>`);
 const q=p.querySelector('#v4q'),r=p.querySelector('#v4r'),cs=p.querySelector('#v4cs'),ww=p.querySelector('#v4ww'),inf=p.querySelector('#v4fi');
 q.value=FR.q;r.value=FR.r;cs.checked=FR.cs;ww.checked=FR.ww;
 const sync=()=>{FR.q=q.value;FR.r=r.value;FR.cs=cs.checked;FR.ww=ww.checked;const m=frMatches(),tot=m.reduce((s,x)=>s+x.n,0);inf.textContent=FR.q?(tot?`${tot} eşleşme · ${new Set(m.map(x=>x.pg)).size} sayfada`:'Eşleşme yok'):'Aranacak metni yaz'};
 [q,r,cs,ww].forEach(x=>x.addEventListener('input',sync));
 const next=()=>{sync();const m=frMatches();if(!m.length)return toast('Eşleşme yok');const cp=PROJ.cur,cid=S.sel;let k=m.findIndex(x=>x.pg==cp&&x.id==cid);k=(k+1)%m.length;const t=m[k];if(t.pg!=PROJ.cur)goPage(t.pg);setTimeout(()=>{if(byId(t.id))pick(t.id)},40)};
 p.querySelector('#v4fn').onclick=next;
 p.querySelector('#v4fo').onclick=()=>{sync();const e=cur();if(e&&typeof e.txt=='string'&&!e.lock){const x=frReplaceIn(e.txt,true);if(x.n){e.txt=x.t;render();list();ed();hist()}}next()};
 p.querySelector('#v4fa').onclick=()=>{sync();if(!FR.q)return;let n=0;mapPages(()=>{S.els.forEach(e=>{if(typeof e.txt=='string'&&!e.lock){const x=frReplaceIn(e.txt,false);if(x.n){e.txt=x.t;n+=x.n}}})});hist();sync();toast(n?n+' yerde değiştirildi':'Eşleşme yok')};
 q.addEventListener('keydown',e=>{if(e.key=='Enter'){e.preventDefault();next()}});r.addEventListener('keydown',e=>{if(e.key=='Enter'){e.preventDefault();p.querySelector('#v4fo').click()}});
 sync();setTimeout(()=>{q.focus();q.select()},30)}

/* ---------- 4) şablonlarım ---------- */
const TK='ed_tpl';
const tplGet=()=>{try{const a=JSON.parse(localStorage.getItem(TK)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}};
const tplSet=a=>{try{localStorage.setItem(TK,JSON.stringify(a));return true}catch(e){return false}};
function tplSnap(){PROJ.pages[PROJ.cur].s=pageSnap();const s=JSON.parse(JSON.stringify(PROJ.pages[PROJ.cur].s));s.els.forEach(e=>{if(e.tg){if(e.dt!=null)e.txt=e.dt;delete e.tg;delete e.dt;delete e.ov;delete e.hd;delete e.cid;delete e.cix}});return s}
function remap(s){const m={},gm={};s.els.forEach(e=>{m[e.id]=1});s.els.forEach(e=>{e.id=nid();delete e.cid;delete e.cix;if(e.gid){gm[e.gid]=gm[e.gid]||nid();e.gid=gm[e.gid]}});s.sel=null;return s}
function tplCompat(t){return t.mm&&t.mm[0]==S.mm[0]&&t.mm[1]==S.mm[1]&&t.cols==S.cols&&t.rows==S.rows}
function tpl(){if(!PROJ)return;const L=tplGet(),
 body=`<div class="row"><input type="text" id="v4tn" placeholder="Şablon adı (örn. Ürün sayfası)" style="flex:1"><button class="b pr" id="v4ts">Bu sayfayı kaydet</button></div>
 <div class="row"><button class="b" id="v4ti">İçe aktar (.json)…</button><span class="mut">Şablonlar bu tarayıcıda saklanır. Başka cihaza taşımak için dışa aktar.</span></div><input type="file" id="v4tf" accept=".json,application/json" hidden>
 <div class="v4tg">${L.length?L.map((t,i)=>`<div class="v4tc${tplCompat(t)?'':' off'}"><div class="v4tt" style="aspect-ratio:${t.fmt||.707}">${t.thumb?`<img src="${t.thumb}" alt="">`:''}</div><b>${E(t.name)}</b><small>${t.mm[0]}×${t.mm[1]} mm${t.stripped?' · görselsiz':''}</small><div class="row"><button class="b" data-ta="${i}" ${tplCompat(t)?'':'disabled title="Bu projenin boyutu ve ızgarası farklı"'}>Ekle</button><button class="b" data-te="${i}">Dışa aktar</button><button class="b" data-td="${i}" aria-label="Sil">🗑</button></div></div>`).join(''):'<p class="mut">Henüz şablon yok. Güzel bir sayfa tasarla, adını yaz ve kaydet.</p>'}</div>`;
 const p=modal('v4tpl','Şablonlarım',body,L.length+' şablon');
 p.querySelector('#v4ts').onclick=()=>{const name=(p.querySelector('#v4tn').value||'').trim()||('Şablon '+(L.length+1));let s=tplSnap(),stripped=false;
  if(JSON.stringify(s).length>900000){s.els.forEach(e=>{if(e.type=='img'&&e.src){e.src=''}});stripped=true}
  let th='';try{th=draw(240).toDataURL('image/jpeg',.6)}catch(e){}
  const rec={id:'t'+Date.now().toString(36),name,mm:[...S.mm],cols:S.cols,rows:S.rows,mar:S.mar,gut:S.gut,fmt:S.fmt,s,thumb:th,stripped,created:Date.now()};
  if(!tplSet([...L,rec])){if(!stripped){s.els.forEach(e=>{if(e.type=='img')e.src=''});rec.stripped=true;if(tplSet([...L,rec])){toast('Depo dolu olduğu için görseller şablona eklenmedi');return tpl()}}return toast('Tarayıcı deposu dolu, şablon kaydedilemedi. Eski şablonları sil ya da dışa aktar.')}
  toast(stripped?'Şablon kaydedildi (büyük görseller dahil edilmedi)':'Şablon kaydedildi ✓');tpl()};
 p.querySelector('#v4ti').onclick=()=>p.querySelector('#v4tf').click();
 p.querySelector('#v4tf').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const o=JSON.parse(await f.text()),A=Array.isArray(o)?o:[o];let n=0;const cur2=tplGet();A.forEach(r=>{if(r&&r.s&&Array.isArray(r.s.els)&&r.mm){r.id='t'+Date.now().toString(36)+n++;cur2.push(r)}});if(!n)throw new Error('geçersiz');if(!tplSet(cur2))return toast('Depo dolu');toast(n+' şablon içe aktarıldı');tpl()}catch(err){toast('Şablon dosyası okunamadı')}};
 p.querySelector('.v4tg').onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.td!==undefined){const a=tplGet();a.splice(+d.td,1);tplSet(a);return tpl()}
  if(d.te!==undefined){const t=L[+d.te];return dl((window.v4slug(t.name)||'sablon')+'.editra-sablon.json',JSON.stringify(t),'application/json')}
  if(d.ta!==undefined){const t=L[+d.ta];if(!t||!tplCompat(t))return;p.hidden=true;const s=remap(JSON.parse(JSON.stringify(t.s)));s.els.forEach(e=>{if(e.type=='img'&&!e.src)e.src=''});insertPages([s],PROJ.cur+1);hist();toast('Şablon sayfası eklendi');fillThumbs()}}}

/* ---------- komutlar ve menü ---------- */
v4cmd(['Dosya','Toplu görsel → sayfalar',[],bulk]);
v4cmd(['Dosya','CSV\'den katalog üret',[],csvCat]);
v4cmd(['Düzenle','Bul ve değiştir',['Ctrl+F','Ctrl+H'],find]);
v4cmd(['Sayfa','Şablonlarım',['Ctrl+Alt+T'],tpl]);
const mm=$('mmenu');if(mm){const add=(t,k,f)=>{const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML=`<span>${t}</span><kbd>${k}</kbd>`;w.onclick=()=>{mm.hidden=true;f()};mm.appendChild(w)};
 add('Bul ve değiştir','Ctrl+F',find);add('Şablonlarım','Ctrl+Alt+T',tpl);add('Toplu görsel → sayfalar','',bulk);add('CSV\'den katalog','',csvCat)}
window.v4bulk=bulk;window.v4csv=csvCat;window.v4find=find;window.v4tpl=tpl;window.v4parseCSV=parseCSV;
})();

/* ================= STÜDYO 7: CMYK PDF, SVG, PNG zip, erişilebilirlik ================= */
(function(){
const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fx=n=>+(+n).toFixed(3);
const slug=()=>window.v4slug(PROJ&&PROJ.name)||'editra';
function modal(id,title,body,sub){let p=$(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)p.hidden=true});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))p.hidden=true})}
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>${title}</b><small>${sub||''}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b">${body}</div></div>`;p.hidden=false;return p}

/* ---------- CMYK PDF (basit dönüşüm, kendi PDF yazıcımız) ---------- */
async function deflate(u8){const cs=new CompressionStream('deflate'),w=cs.writable.getWriter();w.write(u8);w.close();return new Uint8Array(await new Response(cs.readable).arrayBuffer())}
function toCMYK(d){const o=new Uint8Array(d.length);for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],m=r>g?(r>b?r:b):(g>b?g:b);if(m===0){o[i+3]=255}else{o[i]=(m-r)/m*255+.5;o[i+1]=(m-g)/m*255+.5;o[i+2]=(m-b)/m*255+.5;o[i+3]=255-m}}return o}
async function cmykPDF(dpi){if(typeof CompressionStream=='undefined')return toast('Bu tarayıcı sıkıştırmayı desteklemiyor; güncel Chrome, Edge, Safari ya da Firefox kullan');
 const N=PROJ.pages.length,ex=(S.bleed||0)+(S.marks?6:0),pw=S.mm[0]+2*ex,ph=S.mm[1]+2*ex,pt=72/25.4,W=pw*pt,H=ph*pt,Wd=Math.round(S.mm[0]/25.4*dpi),enc=new TextEncoder(),parts=[],xref=[];let off=0;
 const w=x=>{const b=typeof x=='string'?enc.encode(x):x;parts.push(b);off+=b.length};
 w(new Uint8Array([0x25,0x50,0x44,0x46,0x2D,0x31,0x2E,0x34,0x0A,0x25,0xE2,0xE3,0xCF,0xD3,0x0A]));
 xref[1]=off;w(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
 xref[2]=off;w(`2 0 obj\n<< /Type /Pages /Count ${N} /Kids [${PROJ.pages.map((_,i)=>(3+3*i)+' 0 R').join(' ')}] >>\nendobj\n`);
 const f2=v=>(+v).toFixed(3);
 await eachPage(async i=>{toast(`CMYK · sayfa ${i+1}/${N} hazırlanıyor…`);await loadF();const c=drawB(Wd,S.bleed,S.marks),cx=c.getContext('2d'),id=cx.getImageData(0,0,c.width,c.height),cm=toCMYK(id.data),z=await deflate(cm);
  const pn=3+3*i,cn=4+3*i,im=5+3*i,sl=S.marks?6*pt:0,o=ex*pt;
  xref[pn]=off;w(`${pn} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${f2(W)} ${f2(H)}] /TrimBox [${f2(o)} ${f2(o)} ${f2(W-o)} ${f2(H-o)}] /BleedBox [${f2(sl)} ${f2(sl)} ${f2(W-sl)} ${f2(H-sl)}] /Resources << /XObject << /Im0 ${im} 0 R >> >> /Contents ${cn} 0 R >>\nendobj\n`);
  const cs=`q ${f2(W)} 0 0 ${f2(H)} 0 0 cm /Im0 Do Q\n`;xref[cn]=off;w(`${cn} 0 obj\n<< /Length ${cs.length} >>\nstream\n${cs}endstream\nendobj\n`);
  xref[im]=off;w(`${im} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${c.width} /Height ${c.height} /ColorSpace /DeviceCMYK /BitsPerComponent 8 /Filter /FlateDecode /Length ${z.length} >>\nstream\n`);w(z);w(`\nendstream\nendobj\n`);
  c.width=c.height=1});
 const total=3+3*N,xo=off;let x=`xref\n0 ${total}\n0000000000 65535 f \n`;for(let k=1;k<total;k++)x+=String(xref[k]).padStart(10,'0')+' 00000 n \n';
 w(x+`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xo}\n%%EOF\n`);
 await save(slug()+'-cmyk.pdf',new Blob(parts,{type:'application/pdf'}));toast('CMYK PDF indirildi ✓')}

/* ---------- ZIP yazıcı (sıkıştırmasız) ---------- */
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=t[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}})();
function makeZip(files){const enc=new TextEncoder(),L=[],C=[];let off=0;const d=new Date(),dt=((d.getFullYear()-1980)<<9|(d.getMonth()+1)<<5|d.getDate()),tm=(d.getHours()<<11|d.getMinutes()<<5|d.getSeconds()>>1);
 files.forEach(f=>{const nm=enc.encode(f.name),crc=CRC(f.data),h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,tm,true);h.setUint16(12,dt,true);h.setUint32(14,crc,true);h.setUint32(18,f.data.length,true);h.setUint32(22,f.data.length,true);h.setUint16(26,nm.length,true);h.setUint16(28,0,true);
  L.push(h.buffer,nm,f.data);const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,tm,true);c.setUint16(14,dt,true);c.setUint32(16,crc,true);c.setUint32(20,f.data.length,true);c.setUint32(24,f.data.length,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);C.push(c.buffer,nm);off+=30+nm.length+f.data.length});
 const cs=C.reduce((s,b)=>s+(b.byteLength||b.length),0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cs,true);e.setUint32(16,off,true);
 return new Blob([...L,...C,e.buffer],{type:'application/zip'})}
async function pngZip(){const N=PROJ.pages.length,L=Math.min(+$('px').value||2480,4000),Wd=Math.round(S.fmt>=1?L:L*S.fmt),files=[];
 await eachPage(async i=>{toast(`PNG · sayfa ${i+1}/${N}…`);await loadF();const c=drawB(Wd,S.bleed,S.marks),b=await new Promise(r=>c.toBlob(r));if(!b)throw new Error('png');files.push({name:'sayfa-'+String(i+1).padStart(2,'0')+'.png',data:new Uint8Array(await b.arrayBuffer())});c.width=c.height=1});
 await save(slug()+'-sayfalar.zip',makeZip(files));toast(N+' sayfa zip olarak indirildi ✓')}

/* ---------- SVG (vektör şekil ve yazı; görseller gömülür) ---------- */
let UID=0;
function pageSVG(){const H=100/S.fmt,D=[],B=[],K=10,uid=()=>'u'+(++UID);
 zs().forEach(e=>{if(!e.on)return;const g=geo(e,100);let[X,Y,w,h]=g;X+=e.dx||0;Y+=e.dy||0;const tf=e.rot?` transform="rotate(${fx(e.rot)} ${fx(X+w/2)} ${fx(Y+h/2)})"`:'',op=e.op<100?` opacity="${fx(e.op/100)}"`:'';let fl='';
  if(e.sx||e.sy||e.sb){const id=uid();D.push(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="${fx(e.sx)}" dy="${fx(e.sy)}" stdDeviation="${fx((e.sb||0)/2)}" flood-color="${e.scol||'#000'}" flood-opacity=".55"/></filter>`);fl=` filter="url(#${id})"`}
  if(window.v4efdef&&e.type=='img'){const d=v4efdef(e);if(d)D.push(d)}
  const bm=(e.type!='img'&&e.blend&&e.blend!='normal'?`mix-blend-mode:${e.blend};`:'')+(+e.lb?`filter:blur(${fx(e.lb)}px);`:'');if(+e.lb&&!e.sx&&!e.sy&&!e.sb){const id=uid();D.push(`<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${fx(e.lb)}"/></filter>`);fl=` filter="url(#${id})"`}
  const G=(inner)=>B.push(`<g${tf}${op}${fl}${e.type!='img'&&e.blend&&e.blend!='normal'?` style="mix-blend-mode:${e.blend}"`:''}>${inner}</g>`);
  if(e.type=='r'){if(e.shape=='draw'){const v=e.vb||[1,1];G(`<g transform="translate(${fx(X)} ${fx(Y)}) scale(${fx(w/v[0])} ${fx(h/v[1])})"><path d="${v4dpath(e)}" ${v4dsvg(e,e.gr&&e.fon?v4gsvg(e,D,uid,0,0,v[0],v[1]):null)}/></g>`)}
   else if(e.shape=='circle')G(`<ellipse cx="${fx(X+w/2)}" cy="${fx(Y+h/2)}" rx="${fx(w/2)}" ry="${fx(h/2)}" fill="${v4gsvg(e,D,uid,X,Y,w,h)}"/>`);
   else if(e.shape=='tri')G(`<polygon points="${fx(X+w/2)},${fx(Y)} ${fx(X+w)},${fx(Y+h)} ${fx(X)},${fx(Y+h)}" fill="${v4gsvg(e,D,uid,X,Y,w,h)}"/>`);
   else if(e.shape=='line')G(`<rect x="${fx(X)}" y="${fx(Y+h/2-.3)}" width="${fx(w)}" height=".6" fill="${v4gsvg(e,D,uid,X,Y,w,h)}"/>`);
   else G(`<rect x="${fx(X)}" y="${fx(Y)}" width="${fx(w)}" height="${fx(h)}" rx="${fx((e.rad||0)/100*Math.min(w,h))}" fill="${v4gsvg(e,D,uid,X,Y,w,h)}"/>`);return}
  if(e.type=='img'){const I=e.im;if(!e.src||!I||!I.naturalWidth)return;const iw=I.naturalWidth,ih=I.naturalHeight;let dw=w,dh=h;if(e.fit!='fill'){const q=(e.fit=='cover'?Math.max:Math.min)(w/iw,h/ih);dw=iw*q;dh=ih*q}if(e.zm>1){dw*=e.zm;dh*=e.zm}
   const id=uid();D.push(`<clipPath id="${id}"><rect x="${fx(X)}" y="${fx(Y)}" width="${fx(w)}" height="${fx(h)}" rx="${fx((e.rad||0)/100*Math.min(w,h))}"/></clipPath>`);
   const st=`filter:${ifl(e)};${e.blend&&e.blend!='normal'?'mix-blend-mode:'+e.blend:''}`;
   G(`<g clip-path="url(#${id})"><image href="${e.src}" x="${fx(X+(w-dw)*e.fx/100)}" y="${fx(Y+(h-dh)*e.fy/100)}" width="${fx(dw)}" height="${fx(dh)}" preserveAspectRatio="none" style="${st}"/></g>`);return}
  /* metin */
  const fs=e.fs,lh=e.lh*fs;let fill=e.col;if(e.gr){const a=e.ga*Math.PI/180,id=uid(),dx=Math.sin(a)/2,dy=-Math.cos(a)/2;D.push(`<linearGradient id="${id}" x1="${fx(.5-dx)}" y1="${fx(.5-dy)}" x2="${fx(.5+dx)}" y2="${fx(.5+dy)}"><stop offset="0" stop-color="${e.col}"/><stop offset="1" stop-color="${e.col2}"/></linearGradient>`);fill=`url(#${id})`}
  const base=`font-family="${E(e.ff)}, Helvetica, Arial, sans-serif" font-size="${fx(fs)}" font-weight="${e.fw}" font-style="${e.it?'italic':'normal'}" fill="${fill}"${e.sw?` stroke="${e.sc}" stroke-width="${fx(e.sw)}" stroke-linejoin="round" paint-order="stroke"`:''} letter-spacing="${fx((e.ls||0)*fs)}"`;
  if(window.v4flat&&v4flat(e)&&+e.bend){const gg=v4bendG(e,w,h),t=tcf(e,String(tk(e.txt)).replace(/\s*\n+\s*/g,' ').trim()),id=uid(),al=e.al,off=al=='left'?'0%':al=='right'?'100%':'50%',an=al=='left'?'start':al=='right'?'end':'middle';
   D.push(`<path id="${id}" d="M${fx(X)} ${fx(Y+gg.yc)}A${fx(gg.R)} ${fx(gg.R)} 0 0 ${gg.arch?1:0} ${fx(X+w)} ${fx(Y+gg.yc)}"/>`);G(`<text ${base}><textPath href="#${id}" startOffset="${off}" text-anchor="${an}">${E(t)}</textPath></text>`);return}
  if(window.v4flat&&v4flat(e)){const LY=v4layout(e,w,h);G(LY.lines.map(l=>`<text ${base} x="${fx(X+l.x)}" y="${fx(Y+l.y+(lh-fs)/2+fs*.8)}"${l.j?` word-spacing="${fx((e.ws||0)*fs+l.j)}"`:''} xml:space="preserve">${E(l.t)}</text>`).join(''));return}
  SC.font=fnt(e,fs*K);SC.fs=fs*K;SC.u=K;SC.textBaseline='top';if('letterSpacing'in SC)SC.letterSpacing=(e.ls||0)*fs*K+'px';if('wordSpacing'in SC)SC.wordSpacing=(e.ws||0)*fs*K+'px';
  let ww=w,hh=h;if(e.vert)[ww,hh]=[h,w];const n=e.cc||1,gap=S.gut,cw=(ww-(n-1)*gap)/n,LL=wrap(SC,e,ww*K,n),per=Math.ceil(LL.length/n),bh=per*lh,oy=e.va=='center'?(hh-bh)/2:e.va=='end'?hh-bh:0,ind=(e.ind||0)*fs,mw=s=>SC.measureText(tcf(e,s)).width/K,out=[];
  LL.forEach((ln,i)=>{const t=tcf(e,ln),off=LL.first.has(i)?ind:0,av=cw-off,ty=oy+(i%per)*lh+(lh-fs)/2+fs*.8;let tx=Math.floor(i/per)*(cw+gap)+off,extra='';const tw=mw(ln);
   if(e.al=='justify'&&!LL.last.has(i)&&t.includes(' ')){const sm=t.split(' ').reduce((q,v)=>q+mw(v),0),gp=(av-sm)/(t.split(' ').length-1);extra=` word-spacing="${fx(gp-mw(' '))}"`}
   else if(e.al=='center')tx+=(av-tw)/2;else if(e.al=='right')tx+=av-tw;out.push(`<text ${base} x="${fx(tx)}" y="${fx(ty)}"${extra} xml:space="preserve">${E(t)}</text>`)});
  if(e.vert)G(`<g transform="translate(${fx(X)} ${fx(Y+h)}) rotate(-90)">${out.join('')}</g>`);else G(`<g transform="translate(${fx(X)} ${fx(Y)})">${out.join('')}</g>`)});
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${S.mm[0]}mm" height="${S.mm[1]}mm" viewBox="0 0 100 ${fx(H)}"><defs>${D.join('')}</defs><rect width="100" height="${fx(H)}" fill="${S.bg}"/>${B.join('')}</svg>`}
async function svgOut(all){await loadF();if(!all){await save(slug()+'-sayfa'+(PROJ.cur+1)+'.svg',new Blob([pageSVG()],{type:'image/svg+xml'}));return toast('SVG indirildi ✓ · yazılar yaklaşık konumlanır, fontlar yüklü olmalı')}
 const files=[],enc=new TextEncoder(),N=PROJ.pages.length;await eachPage(async i=>{toast(`SVG · sayfa ${i+1}/${N}…`);await loadF();files.push({name:'sayfa-'+String(i+1).padStart(2,'0')+'.svg',data:enc.encode(pageSVG())})});
 await save(slug()+'-svg.zip',makeZip(files));toast('SVG zip indirildi ✓')}

/* ---------- arayüz ---------- */
function outModal(){if(!PROJ)return;const p=modal('v4out','Gelişmiş dışa aktarma',`<div class="row"><button class="b" data-o="pz">Tüm sayfalar · PNG (zip)</button><button class="b" data-o="s1">Bu sayfa · SVG</button><button class="b" data-o="sa">Tüm sayfalar · SVG (zip)</button></div>
 <hr><label class="f"><span>CMYK PDF çözünürlüğü</span><select id="v4dpi"><option value="150">150 dpi (hızlı, küçük dosya)</option><option value="200" selected>200 dpi</option><option value="300">300 dpi (baskı kalitesi, büyük dosya)</option></select></label>
 <div class="row"><button class="b pr" data-o="cmyk">CMYK PDF indir</button></div>
 <p class="mut">CMYK dönüşümü basit bir RGB→CMYK formülüdür, ICC profili kullanmaz; renkler matbaa çıktısında farklı görünebilir. Taşma payı ve kesim işaretleri Baskı sekmesindeki ayara göre eklenir, TrimBox/BleedBox bilgisi PDF'e yazılır. SVG'de şekil ve yazılar vektördür, yazı konumu yaklaşıktır; filtre ve efektlerin hepsi taşınmaz.</p>`);
 p.onclick=async e=>{if(e.target.closest('[data-x]'))return;const b=e.target.closest('[data-o]');if(!b)return;const k=b.dataset.o;b.disabled=true;try{if(k=='pz')await pngZip();else if(k=='s1')await svgOut(false);else if(k=='sa')await svgOut(true);else if(k=='cmyk')await cmykPDF(+p.querySelector('#v4dpi').value)}catch(err){console.error(err);toast('Dışa aktarılamadı: '+(err&&err.message||err))}b.disabled=false}}
v4cmd(['Dosya','Gelişmiş dışa aktarma (CMYK PDF, SVG, PNG zip)',['Ctrl+Alt+E'],outModal]);
const mm=$('mmenu');if(mm){const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML='<span>CMYK PDF, SVG, PNG zip</span><kbd>Ctrl+Alt+E</kbd>';w.onclick=()=>{mm.hidden=true;outModal()};mm.appendChild(w)}
const xm=$('xmenu');if(xm){const b=document.createElement('button');b.type='button';b.className='b';b.style.cssText='width:100%;margin-top:6px';b.textContent='CMYK · SVG · zip…';b.onclick=()=>{xm.hidden=true;outModal()};xm.appendChild(b)}
window.v4out=outModal;window.v4cmyk=cmykPDF;window.v4svg=pageSVG;window.v4zip=makeZip;

/* ---------- erişilebilirlik ---------- */
const t=$('toast');if(t){t.setAttribute('role','status');t.setAttribute('aria-live','polite')}
function a11y(root){(root||document).querySelectorAll('button:not([aria-label]),[role=button]:not([aria-label])').forEach(b=>{if(b.textContent.trim().length>1&&/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(b.textContent))return;const l=b.title||b.dataset.tip;if(l)b.setAttribute('aria-label',l.replace(/\s*\(.*\)$/,''))});
 (root||document).querySelectorAll('input:not([aria-label]):not([type=file]),select:not([aria-label]),textarea:not([aria-label])').forEach(i=>{if(i.closest('label')&&i.closest('label').textContent.trim())return;const l=i.title||i.placeholder;if(l)i.setAttribute('aria-label',l)})}
let at=0;new MutationObserver(()=>{clearTimeout(at);at=setTimeout(()=>{a11y();document.querySelectorAll('.kpl.v4o:not([hidden]):not([data-a11y])').forEach(p=>{p.dataset.a11y=1;p.setAttribute('role','dialog');p.setAttribute('aria-modal','true');const h=p.querySelector('.kh b');if(h)p.setAttribute('aria-label',h.textContent);const f=p.querySelector('input[type=text],textarea,select')||p.querySelector('button.b');if(f)try{f.focus({preventScroll:true})}catch(x){}});document.querySelectorAll('.kpl.v4o[hidden][data-a]').forEach(p=>{delete p.dataset.a})},120)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
window.addEventListener('keydown',e=>{if(e.key!='Escape')return;const o=[...document.querySelectorAll('.kpl.v4o:not([hidden])')].pop();if(o){const ae=document.activeElement;if(ae&&ae.id=='inl')return;e.preventDefault();e.stopImmediatePropagation();o.hidden=true}},true);
a11y();
/* öğeler arası klavyeyle gezinme */
function stepSel(d){if(!PROJ)return;const L=zs().filter(e=>e.on&&!e.lock);if(!L.length)return toast('Seçilecek öğe yok');let i=L.findIndex(e=>e.id==S.sel);i=(i+d+L.length)%L.length;pick(L[i].id);const n=$('cv').querySelector('.e[data-id="'+L[i].id+'"]');if(n&&n.scrollIntoView)n.scrollIntoView({block:'nearest',inline:'nearest'})}
v4cmd(['Seç','Sonraki öğeyi seç',['Alt+.'],()=>stepSel(1)]);
v4cmd(['Seç','Önceki öğeyi seç',['Alt+,'],()=>stepSel(-1)]);
})();
