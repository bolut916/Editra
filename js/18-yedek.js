/* ===== Yedekleme: tüm çalışmaları tek dosyaya al, dosyadan geri yükle ===== */
(function(){
const LSK=k=>/^(ed_|editra)/.test(k)&&k!=='editra-lastbak';
const LAST='editra-lastbak';
const getLast=()=>{try{return+localStorage.getItem(LAST)||0}catch(e){return 0}};
const day=864e5;
async function allProjects(){try{return await DB.full()}catch(e){return[...MEM.values()].map(v=>v[0])}}

/* ana sayfadaki durum satırı: son yedek ne zaman alındı */
window.bakInfo=function(n){const el=$('bakst');if(!el)return;const t=getLast(),age=t?Math.floor((Date.now()-t)/day):-1;
 if(!n){el.textContent='Henüz çalışma yok.';el.className='bakst mut';return}
 if(t<=0){el.textContent='⚠ Hiç yedek alınmadı.';el.className='bakst warn';return}
 el.textContent='Son yedek: '+(age<1?'bugün':age==1?'dün':age+' gün önce');el.className='bakst'+(age>=7?' warn':' mut')};

async function backup(){const b=$('hbak');b.disabled=true;
 try{if(PROJ&&!$('edw').hidden)await saveNow();
  const projects=await allProjects();if(!projects.length){toast('Yedeklenecek çalışma yok');return}
  let assets=[];try{if(window.v4assets)assets=await v4assets.all()}catch(e){}
  const ls={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(LSK(k))ls[k]=localStorage.getItem(k)}}catch(e){}
  const d=new Date(),ds=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  const data={type:'editra-backup',v:1,t:Date.now(),projects,assets,ls};
  await save('editra-yedek-'+ds+'.json',new Blob([JSON.stringify(data)],{type:'application/json'}));
  try{localStorage.setItem(LAST,String(Date.now()))}catch(e){}
  toast(projects.length+' çalışma yedeklendi ✓');bakInfo(projects.length)}
 catch(e){toast('Yedek alınamadı: '+(e&&e.message||e))}
 finally{b.disabled=false}}

const okProj=r=>r&&typeof r.id=='string'&&typeof r.name=='string'&&Array.isArray(r.pages)&&r.pages.length&&Array.isArray(r.mm);
async function restore(d){
 if(!d||d.type!=='editra-backup'||!Array.isArray(d.projects))return toast('Bu bir Editra yedek dosyası değil');
 let add=0,upd=0,same=0,bad=0;
 for(const r of d.projects){if(!okProj(r)){bad++;continue}
  const ex=await dbGet(r.id);
  if(!ex){await dbPut(r,meta(r));add++}
  else if((ex.updated||0)<(r.updated||0)){await dbPut(r,meta(r));upd++}
  else same++}
 if(Array.isArray(d.assets)&&window.v4assets){try{const have=new Set((await v4assets.all()).map(a=>a.id));for(const a of d.assets)if(a&&typeof a.id=='string'&&!have.has(a.id))await v4assets.put(a);await v4assets.loadOwn()}catch(e){}}
 if(d.ls&&typeof d.ls=='object'){try{for(const k in d.ls)if(LSK(k)&&typeof d.ls[k]=='string'&&localStorage.getItem(k)==null)localStorage.setItem(k,d.ls[k])}catch(e){}}
 const p=[];if(add)p.push(add+' yeni');if(upd)p.push(upd+' güncellendi');if(same)p.push(same+' zaten vardı');if(bad)p.push(bad+' okunamadı');
 toast('Geri yükleme bitti: '+(p.join(', ')||'değişiklik yok'));renderHome()}

async function readJSON(f){try{return JSON.parse(await f.text())}catch(e){return null}}
$('hbak').onclick=backup;
$('hres').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const d=await readJSON(f);if(!d)return toast('Dosya okunamadı');restore(d)};
/* tek proje kutusuna yanlışlıkla yedek dosyası seçilirse onu da geri yükle */
const prev=$('himp').onchange;
$('himp').onchange=async e=>{const f=e.target.files[0];if(!f)return;const d=await readJSON(f);if(d&&d.type==='editra-backup'){e.target.value='';return restore(d)}return prev&&prev.call($('himp'),e)};

/* tarayıcıdan, depoyu kendiliğinden silmemesini iste (iOS/Safari bunu dikkate alabilir) */
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persisted().then(p=>{if(!p)navigator.storage.persist().catch(()=>{})}).catch(()=>{})}catch(e){}
window.editraBackup={backup,restore};
})();
