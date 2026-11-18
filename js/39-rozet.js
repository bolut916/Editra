/* =====================================================================
   ROZET, İKON, ÇİZGİ VE ÇERÇEVE: "Öğe ekle" bölümünde ✦ Rozet & ikon
   - Rozetler: şekil + yazı, gruplanmış (yazısı düzenlenebilir): YENİ, %50, Şefin önerisi…
   - İkonlar: telefon, konum, saat, e-posta… paletteki renkte çizilmiş küçük görseller
   - Çizgi ve çerçeve: ayraç çizgileri, ince/kalın çerçeve (gruplanmış çizgiler)
   Hepsi serbest konumlu (fr) ve sayfanın ortasına seçili olarak gelir.
   ===================================================================== */
(function(){
'use strict';
const D=document,$=id=>D.getElementById(id);
const EN=!!(window.v4i18n&&v4i18n.lang==='en');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L=EN?{btn:'✦ Badges & icons',h:'Badges, icons and lines',tb:'Badges',ti:'Icons',tl:'Lines & frames',note:'Badges stay editable: double-tap the text to change it. Items are grouped; ungroup to move parts separately.',x:'Close',added:'Added ✓'}
 :{btn:'✦ Rozet & ikon',h:'Rozet, ikon ve çizgiler',tb:'Rozetler',ti:'İkonlar',tl:'Çizgi ve çerçeve',note:'Rozetlerin yazısı düzenlenebilir: yazıya çift dokun. Parçalar gruplu gelir; ayrı taşımak için grubu çöz.',x:'Kapat',added:'Eklendi ✓'};
/* [metin, biçim: circle|pill, boyut (sayfa genişliğinin %'si)] */
const BADGES=EN?[['NEW','circle',16],['50%\nOFF','circle',18],['SALE','pill',26],['CHEF’S\nCHOICE','circle',20],['FREE\nDELIVERY','pill',30],['LIMITED','pill',26],['HANDMADE','pill',28],['VEGAN','circle',15],['BEST\nSELLER','circle',19],['SPICY','pill',20]]
 :[['YENİ','circle',16],['%50\nİNDİRİM','circle',19],['İNDİRİM','pill',26],['ŞEFİN\nÖNERİSİ','circle',20],['ÜCRETSİZ\nKARGO','pill',30],['SINIRLI\nSAYIDA','pill',28],['EL YAPIMI','pill',28],['VEGAN','circle',15],['ÇOK\nSATAN','circle',18],['ACI','pill',16]];
/* 24×24 çizgi ikonlar */
const ICONS=[['tel',EN?'Phone':'Telefon','M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2'],
 ['pin',EN?'Location':'Konum','M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21zM12 12.5a3 3 0 100-6 3 3 0 000 6'],
 ['saat',EN?'Hours':'Saat','M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3.5 2'],
 ['mail',EN?'Email':'E-posta','M3 6h18v12H3zM3 7l9 6 9-6'],
 ['web',EN?'Website':'Web','M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3'],
 ['kamera','Instagram','M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4zM12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7M17 7.2v.1'],
 ['yildiz',EN?'Star':'Yıldız','M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'],
 ['kalp',EN?'Heart':'Kalp','M12 20s-7.5-4.6-9-9.3C2 7.4 4.3 5 7 5c2 0 3.3 1.2 5 3 1.7-1.8 3-3 5-3 2.7 0 5 2.4 4 5.7-1.5 4.7-9 9.3-9 9.3z'],
 ['tik',EN?'Check':'Onay','M4 12.5l5 5L20 6.5'],
 ['yaprak',EN?'Leaf':'Yaprak','M5 19C5 10 10 5 20 4c-1 10-6 15-15 15zM5 19c3-4 6-7 10-9'],
 ['fincan',EN?'Coffee':'Kahve','M4 9h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5zM17 10h1.5a2.5 2.5 0 010 5H17M8 3v3M12 3v3'],
 ['wifi','Wi-Fi','M2.5 9a14 14 0 0119 0M5.5 12.5a9.5 9.5 0 0113 0M8.5 16a5 5 0 017 0M12 19.5v.1'],
 ['kargo',EN?'Delivery':'Kargo','M2 7h11v9H2zM13 10h4l3 3v3h-7zM6 19a2 2 0 100-4 2 2 0 000 4M17 19a2 2 0 100-4 2 2 0 000 4'],
 ['indirim',EN?'Discount':'İndirim','M5 19L19 5M7.5 9.5a2 2 0 100-4 2 2 0 000 4M16.5 18.5a2 2 0 100-4 2 2 0 000 4'],
 ['ok',EN?'Arrow':'Ok','M4 12h15M13 6l6 6-6 6'],
 ['qr','QR','M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2zM16 16h2v2h-2z']];
const LINES=[['ince',EN?'Thin divider':'İnce ayraç'],['kalin',EN?'Thick divider':'Kalın ayraç'],['kisa',EN?'Short accent':'Kısa vurgu'],['cerceve',EN?'Thin frame':'İnce çerçeve'],['cerceve2',EN?'Bold frame':'Kalın çerçeve'],['kose',EN?'Corner marks':'Köşe işaretleri']];
const pal=()=>{try{const s=STY[S.st];const pc=S.pc||[s.tx,s.ac];return{tx:pc[0]||s.tx,ac:pc[1]||s.ac,bg:S.bg||s.bg}}catch(e){return{tx:'#111111',ac:'#e63946',bg:'#ffffff'}}};
const lum=h=>{const n=parseInt(String(h).slice(1),16);if(isNaN(n))return 1;const c=[n>>16,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const onCol=bg=>lum(bg)>.45?'#111111':'#ffffff';
const H=()=>100/(S.fmt||.707);
const zTop=()=>Math.max(0,...S.els.map(x=>x.z||0))+10;
const done=(els)=>{const g=els.length>1&&typeof nid=='function'?nid():null;els.forEach(e=>{if(g)e.gid=g;S.els.push(e)});S.sel=els[els.length-1].id;try{MSEL.clear();if(g)els.forEach(e=>{if(e.id!==S.sel)MSEL.add(e.id)})}catch(x){}
 render();try{list();ed()}catch(x){}hist();if(typeof dirty=='function')dirty();if(typeof toast=='function')toast(L.added)};
function badge(b){const [txt,form,size]=b,p=pal(),w=size,h=form=='circle'?size:Math.max(7,size*.34),x=(100-w)/2,y=(H()-h)/2,z=zTop();
 const r=mk('r');r.shape=form=='circle'?'circle':'rect';r.rad=form=='circle'?0:50;r.col=p.ac;r.fr=[+x.toFixed(2),+y.toFixed(2),w,+h.toFixed(2)];r.z=z;r.nm=EN?'Badge':'Rozet';r.pin=true;
 const t=mk('s');t.txt=txt;t.fw=800;t.ff='Inter';t.col=onCol(p.ac);t.al='center';t.va='center';t.tc='none';t.lh=.95;t.ls=.02;const lines=txt.split('\n'),ln=Math.max(...lines.map(s=>s.length));
 const pad=form=='circle'?w*.16:h*.18;t.fr=[+(x+pad).toFixed(2),+(y+pad*(form=='circle'?1.15:1)).toFixed(2),+(w-2*pad).toFixed(2),+(h-2*pad*(form=='circle'?1.15:1)).toFixed(2)];
 t.fs=+Math.max(.8,Math.min(t.fr[3]/lines.length/1.05,t.fr[2]/(ln*.62))).toFixed(2);t.lh=1;try{if(typeof fit=='function'){t.nf=false;fit(t)}}catch(x){}t.nf=true;
 /* yazı bloğunu şeklin tam ortasına oturt (ekranda ve çıktıda aynı) */const th=+(lines.length*t.lh*t.fs*1.04).toFixed(2);t.va='start';t.fr[1]=+(y+(h-th)/2).toFixed(2);t.fr[3]=th;t.z=z+1;t.pin=true;done([r,t])}
function iconPng(path,col,px){const c=D.createElement('canvas');c.width=c.height=px;const x=c.getContext('2d');x.scale(px/24,px/24);x.strokeStyle=col;x.lineWidth=1.8;x.lineCap='round';x.lineJoin='round';
 path.split(/(?=M)/).forEach(seg=>{try{x.stroke(new Path2D(seg))}catch(e){}});return c.toDataURL('image/png')}
function icon(ic){const p=pal(),url=iconPng(ic[2],p.ac,512),w=9,x=(100-w)/2,y=(H()-w)/2;const e=mk('img');e.src=url;e.im=getIm(url);e.fit='contain';e.fr=[+x.toFixed(2),+y.toFixed(2),w,w];e.z=zTop();e.nm=ic[1];e.pin=true;done([e])}
function line(k){const p=pal(),Hh=H(),z=zTop(),r=(fr,col,nm)=>{const e=mk('r');e.col=col;e.fr=fr.map(v=>+v.toFixed(2));e.z=z;e.nm=nm||(EN?'Line':'Çizgi');e.pin=true;return e};
 if(k=='ince')return done([r([10,Hh/2,80,.25],p.tx)]);if(k=='kalin')return done([r([10,Hh/2,80,1.1],p.ac)]);if(k=='kisa')return done([r([45,Hh/2,10,.9],p.ac)]);
 if(k=='cerceve'||k=='cerceve2'){const m=4,t=k=='cerceve'?.3:1.2,c=k=='cerceve'?p.tx:p.ac;return done([r([m,m,100-2*m,t],c),r([m,Hh-m-t,100-2*m,t],c),r([m,m,t,Hh-2*m],c),r([100-m-t,m,t,Hh-2*m],c)])}
 if(k=='kose'){const m=4,a=8,t=.35,c=p.tx;return done([[m,m,a,t],[m,m,t,a],[100-m-a,m,a,t],[100-m-t,m,t,a],[m,Hh-m-t,a,t],[m,Hh-m-a,t,a],[100-m-a,Hh-m-t,a,t],[100-m-t,Hh-m-a,t,a]].map(f=>r(f,c)))}}
let tab='b';
function close(){const m=$('vroz');if(m)m.remove()}
function open(){if(typeof PROJ=='undefined'||!PROJ||$('edw').hidden)return;close();const p=pal();
 const m=D.createElement('div');m.id='vroz';m.className='vroz';m.setAttribute('data-noi18n','');
 const body=()=>tab=='b'?`<div class="vroz-g">${BADGES.map((b,i)=>`<button type="button" class="vroz-b ${b[1]}" data-bi="${i}" style="--c:${p.ac};--t:${onCol(p.ac)}" aria-label="${esc(b[0].replace(/\n/g,' '))}"><span>${esc(b[0]).replace(/\n/g,'<br>')}</span></button>`).join('')}</div>`
  :tab=='i'?`<div class="vroz-g i">${ICONS.map((c,i)=>`<button type="button" class="vroz-i" data-ii="${i}" title="${esc(c[1])}" aria-label="${esc(c[1])}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${c[2]}"/></svg><small>${esc(c[1])}</small></button>`).join('')}</div>`
  :`<div class="vroz-g l">${LINES.map(l=>`<button type="button" class="vroz-l" data-li="${l[0]}"><i class="lp-${l[0]}"></i><small>${esc(l[1])}</small></button>`).join('')}</div>`;
 const draw=()=>{m.innerHTML=`<div class="vroz-bg" data-r="x"></div><div class="vroz-c" role="dialog" aria-modal="true" aria-labelledby="vroz-h"><button type="button" class="vroz-x" data-r="x" aria-label="${esc(L.x)}">✕</button><h3 id="vroz-h">${esc(L.h)}</h3>
  <div class="vroz-t" role="tablist">${[['b',L.tb],['i',L.ti],['l',L.tl]].map(([k,n])=>`<button type="button" role="tab" data-t="${k}" aria-selected="${tab==k}">${esc(n)}</button>`).join('')}</div>${body()}<p class="vroz-n">${esc(L.note)}</p></div>`};
 draw();D.body.appendChild(m);
 m.addEventListener('click',e=>{const b=e.target.closest('[data-r],[data-t],[data-bi],[data-ii],[data-li]');if(!b)return;
  if(b.dataset.r=='x'){close();return}if(b.dataset.t){tab=b.dataset.t;draw();return}
  try{if(b.dataset.bi!=null)badge(BADGES[+b.dataset.bi]);else if(b.dataset.ii!=null)icon(ICONS[+b.dataset.ii]);else if(b.dataset.li)line(b.dataset.li)}catch(x){console.warn('rozet',x)}close()});
 D.addEventListener('keydown',function k(e){if(e.key=='Escape'&&$('vroz')){e.stopPropagation();close();D.removeEventListener('keydown',k,true)}},true)}
/* "Öğe ekle" bölümüne düğme (panel yeniden çizildikçe korunur) */
const addBtn=()=>{const g=D.querySelector('#edw .addg');if(!g||g.querySelector('.vroz-add'))return;const b=D.createElement('button');b.type='button';b.className='b vroz-add';b.textContent=L.btn;b.setAttribute('data-noi18n','');b.onclick=open;g.appendChild(b)};
new MutationObserver(()=>addBtn()).observe(D.body,{childList:true,subtree:true});addBtn();
try{if(typeof v4cmd=='function')v4cmd([EN?'Insert':'Ekle',L.h,[],open])}catch(e){}
window.v4rozet={open,badge,icon,line,BADGES,ICONS};
})();
