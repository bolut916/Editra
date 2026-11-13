/* ================= STÜDYO 11: mockup sahneleri, SVG içe aktarma, flipbook, otomatik sürüm ================= */
(function(){
const m11=(id,title,body,sub)=>{let p=document.getElementById(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)p.hidden=true});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))p.hidden=true})}
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>${title}</b><small>${sub||''}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b">${body}</div></div>`;p.hidden=false;return p};
const r3=n=>Math.round(n*1000)/1000;

/* ---------- otomatik sürüm: kayıt sırasında, son sürümden 10 dk geçtiyse ve içerik değiştiyse ---------- */
function autoVer(){if(!PROJ||!PROJ.pages)return;if(!PROJ.versions)PROJ.versions=[];const last=PROJ.versions[0];
 if(last&&Date.now()-last.t<10*60*1000)return;
 PROJ.pages[PROJ.cur].s=pageSnap();const cur=PROJ.pages.map(p=>JSON.parse(JSON.stringify(p.s)));
 if(last&&JSON.stringify(last.pages)==JSON.stringify(cur))return;
 if(!last&&PROJ.pages.every(p=>!p.s.els.length))return;
 PROJ.versions.unshift({t:Date.now(),label:'Otomatik',pages:cur});
 while(PROJ.versions.length>10){let k=-1;for(let i=PROJ.versions.length-1;i>=0;i--)if(PROJ.versions[i].label=='Otomatik'){k=i;break}PROJ.versions.splice(k<0?PROJ.versions.length-1:k,1)}
 try{rpr()}catch(e){}}
const sn0=saveNow;saveNow=async function(){try{autoVer()}catch(e){}return sn0.apply(this,arguments)};

/* ---------- sayfayı tuvale çiz (belirli sayfa) ---------- */
const PC={};
async function pageCanvas(i,W){const k=i+':'+W;let c=PC[k];if(c)return c;
 await eachPage(async()=>{await loadF();c=drawB(W,0,false)},[i]);return c}

/* ================= MOCKUP ================= */
const SW=1600,SH=1200;
function shade(h,a){const m=/^#?([0-9a-f]{6})$/i.exec(h||'');if(!m)return h;const n=parseInt(m[1],16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a>=0?v+(255-v)*a:v*(1+a))));return'#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function rrp(x,X,Y,W,H,r){r=Math.min(r,W/2,H/2);x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.closePath()}
function fitR(iw,ih,mw,mh){const k=Math.min(mw/iw,mh/ih);return[iw*k,ih*k]}
function floorShadow(x,cx,cy,w,h,a){x.save();x.translate(cx,cy);x.scale(1,h/w);const g=x.createRadialGradient(0,0,0,0,0,w);g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,w,0,7);x.fill();x.restore()}
function bgFill(x,bg){const g=x.createRadialGradient(SW/2,SH*.42,80,SW/2,SH/2,SW*.75);g.addColorStop(0,shade(bg,.18));g.addColorStop(1,shade(bg,-.16));x.fillStyle=g;x.fillRect(0,0,SW,SH)}
function gloss(x,X,Y,W,H,a){const g=x.createLinearGradient(X,Y,X+W,Y+H);g.addColorStop(0,'rgba(255,255,255,'+a+')');g.addColorStop(.45,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,'+a*.5+')');x.fillStyle=g;x.fillRect(X,Y,W,H)}
const MK={
 kitap(x,im,bg){const[bw,bh]=fitR(im.width,im.height,700,900),sp=Math.round(bw*.085),X0=(SW-bw-sp)/2,Y0=(SH-bh)/2,N=Math.ceil(bw/2),tilt=.06;
  floorShadow(x,SW/2+30,Y0+bh+36,bw*.85,50,.38);
  /* sayfa bloğu */
  x.fillStyle='#efe9da';x.beginPath();x.moveTo(X0+sp+bw-6,Y0+bh*tilt/2+8);x.lineTo(X0+sp+bw+16,Y0+bh*tilt/2+14);x.lineTo(X0+sp+bw+16,Y0+bh-bh*tilt/2-2);x.lineTo(X0+sp+bw-6,Y0+bh-bh*tilt/2+4);x.fill();
  x.strokeStyle='rgba(0,0,0,.12)';x.lineWidth=1;for(let i=1;i<7;i++){const xx=X0+sp+bw-6+i*2.4;x.beginPath();x.moveTo(xx,Y0+bh*tilt/2+10);x.lineTo(xx,Y0+bh-bh*tilt/2);x.stroke()}
  /* sırt */
  const hs=t=>bh*(1-tilt*t);
  x.drawImage(im,0,0,Math.max(2,im.width*.02),im.height,X0,Y0,sp,bh);
  const gs=x.createLinearGradient(X0,0,X0+sp,0);gs.addColorStop(0,'rgba(0,0,0,.55)');gs.addColorStop(.5,'rgba(0,0,0,.28)');gs.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=gs;x.fillRect(X0,Y0,sp,bh);
  /* kapak şeritlerle, hafif perspektif */
  for(let i=0;i<N;i++){const t=i/N,h=hs(t),dx=X0+sp+i*(bw/N),sx=i*im.width/N;x.drawImage(im,sx,0,im.width/N+1,im.height,dx,Y0+(bh-h)/2,bw/N+1.2,h)}
  /* menteşe oluğu + parlama */
  const hg=x.createLinearGradient(X0+sp,0,X0+sp+bw*.12,0);hg.addColorStop(0,'rgba(0,0,0,.35)');hg.addColorStop(.18,'rgba(255,255,255,.18)');hg.addColorStop(.4,'rgba(0,0,0,.0)');x.fillStyle=hg;x.fillRect(X0+sp,Y0+bh*tilt*.1,bw*.12,bh*(1-tilt*.2));
  const sh=x.createLinearGradient(X0+sp,Y0,X0+sp+bw,Y0+bh);sh.addColorStop(0,'rgba(255,255,255,.0)');sh.addColorStop(.5,'rgba(255,255,255,.12)');sh.addColorStop(1,'rgba(0,0,0,.18)');x.save();x.beginPath();x.moveTo(X0+sp,Y0);x.lineTo(X0+sp+bw,Y0+bh*tilt/2);x.lineTo(X0+sp+bw,Y0+bh-bh*tilt/2);x.lineTo(X0+sp,Y0+bh);x.closePath();x.clip();x.fillStyle=sh;x.fillRect(X0,Y0,bw+sp,bh);x.restore()},
 dergi(x,im,bg){const[w,h]=fitR(im.width,im.height,760,980);
  [[-1,.28,22,34],[1,.5,10,18]].forEach(([s,a,dx,dy],i)=>{x.save();x.translate(SW/2+dx*2,SH/2+dy);x.rotate((s>0?1:-1)*(.09+i*.04));x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=30;x.shadowOffsetY=10;x.fillStyle='#f4f4f4';x.fillRect(-w/2,-h/2,w,h);x.restore()});
  x.save();x.translate(SW/2,SH/2);x.rotate(-.065);x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=48;x.shadowOffsetY=22;x.fillStyle='#fff';x.fillRect(-w/2,-h/2,w,h);x.shadowColor='transparent';x.drawImage(im,-w/2,-h/2,w,h);gloss(x,-w/2,-h/2,w,h,.22);
  const g=x.createLinearGradient(-w/2,0,-w/2+w*.06,0);g.addColorStop(0,'rgba(0,0,0,.28)');g.addColorStop(.3,'rgba(255,255,255,.14)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(-w/2,-h/2,w*.06,h);x.strokeStyle='rgba(0,0,0,.18)';x.strokeRect(-w/2+.5,-h/2+.5,w-1,h-1);x.restore()},
 poster(x,im,bg){const[iw,ih]=fitR(im.width,im.height,640,860),mat=70,fr=26,W=iw+2*(mat+fr),H=ih+2*(mat+fr),X=(SW-W)/2,Y=(SH-H)/2-10;
  x.fillStyle='rgba(0,0,0,.08)';x.fillRect(0,SH-170,SW,170);
  x.save();x.shadowColor='rgba(0,0,0,.42)';x.shadowBlur=50;x.shadowOffsetX=18;x.shadowOffsetY=26;x.fillStyle='#1b1b1b';x.fillRect(X,Y,W,H);x.restore();
  x.fillStyle='#1b1b1b';x.fillRect(X,Y,W,H);const hl=x.createLinearGradient(X,Y,X+W,Y+H);hl.addColorStop(0,'rgba(255,255,255,.2)');hl.addColorStop(.5,'rgba(255,255,255,0)');hl.addColorStop(1,'rgba(255,255,255,.08)');x.fillStyle=hl;x.fillRect(X,Y,W,H);
  x.fillStyle='#faf8f3';x.fillRect(X+fr,Y+fr,W-2*fr,H-2*fr);x.save();x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=14;x.shadowOffsetY=3;x.fillStyle='#fff';x.fillRect(X+fr+mat,Y+fr+mat,iw,ih);x.restore();x.drawImage(im,X+fr+mat,Y+fr+mat,iw,ih);
  const ig=x.createLinearGradient(X+fr,Y+fr,X+fr,Y+fr+14);ig.addColorStop(0,'rgba(0,0,0,.18)');ig.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=ig;x.fillRect(X+fr,Y+fr,W-2*fr,14)},
 telefon(x,im,bg){const ph=1020,pw=ph*.485,X=(SW-pw)/2,Y=(SH-ph)/2,b=18,sx=X+b,sy=Y+b,sw=pw-2*b,sh=ph-2*b;
  floorShadow(x,SW/2+20,Y+ph+30,pw*1.1,34,.4);
  x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=60;x.shadowOffsetY=30;rrp(x,X,Y,pw,ph,pw*.14);x.fillStyle='#14141a';x.fill();x.restore();
  rrp(x,X,Y,pw,ph,pw*.14);x.lineWidth=3;x.strokeStyle='#4a4a55';x.stroke();
  x.save();rrp(x,sx,sy,sw,sh,pw*.115);x.clip();x.fillStyle='#fff';x.fillRect(sx,sy,sw,sh);const k=sw/im.width,dw=im.width*k,dh=im.height*k;x.drawImage(im,sx+(sw-dw)/2,sy,dw,dh);gloss(x,sx,sy,sw,sh,.14);x.restore();
  rrp(x,SW/2-pw*.16,sy+12,pw*.32,pw*.075,pw*.04);x.fillStyle='#0a0a0e';x.fill();
  x.fillStyle='rgba(255,255,255,.55)';rrp(x,SW/2-pw*.16,sy+sh-16,pw*.32,6,3);x.fill()},
 kartvizit(x,im,bg){const[w,h]=fitR(im.width,im.height,560,560);
  const card=(cx,cy,a,fill)=>{x.save();x.translate(cx,cy);x.rotate(a);x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=36;x.shadowOffsetY=18;x.fillStyle='#fff';x.fillRect(-w/2,-h/2,w,h);x.shadowColor='transparent';if(fill)x.drawImage(im,-w/2,-h/2,w,h);else{x.fillStyle=shade(bg,-.55);x.fillRect(-w/2,-h/2,w,h);x.fillStyle='rgba(255,255,255,.9)';x.font='700 '+Math.round(h*.09)+'px sans-serif';x.textAlign='center';x.fillText((PROJ&&PROJ.name||'').slice(0,22),0,h*.03)}gloss(x,-w/2,-h/2,w,h,.2);x.restore()};
  card(SW/2+120,SH/2-70,.2,false);card(SW/2+10,SH/2-10,.08,true);card(SW/2-150,SH/2+90,-.14,true)},
 ekran(x,im,bg){const sw=1180,sh=740,X=(SW-sw)/2,Y=170,b=26;
  floorShadow(x,SW/2,Y+sh+b+250,520,30,.35);
  const nk=x.createLinearGradient(0,0,SW,0);nk.addColorStop(0,'#9a9aa3');nk.addColorStop(.5,'#d8d8de');nk.addColorStop(1,'#9a9aa3');
  x.fillStyle=nk;x.beginPath();x.moveTo(SW/2-60,Y+sh+b);x.lineTo(SW/2+60,Y+sh+b);x.lineTo(SW/2+90,Y+sh+b+210);x.lineTo(SW/2-90,Y+sh+b+210);x.fill();
  x.beginPath();x.ellipse(SW/2,Y+sh+b+215,230,22,0,0,7);x.fill();
  x.save();x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=40;x.shadowOffsetY=20;rrp(x,X-b,Y-b,sw+2*b,sh+2*b,26);x.fillStyle='#18181c';x.fill();x.restore();
  x.fillStyle='#fff';x.fillRect(X,Y,sw,sh);const[dw,dh]=fitR(im.width,im.height,sw-60,sh-40);x.save();x.shadowColor='rgba(0,0,0,.25)';x.shadowBlur=18;x.drawImage(im,X+(sw-dw)/2,Y+(sh-dh)/2,dw,dh);x.restore();
  gloss(x,X,Y,sw,sh,.1)},
 masa(x,im,bg){/* ahşap masa üstünden: kartvizit + kahve + kalem */
  for(let i=0;i<9;i++){const y=i*SH/9,g=x.createLinearGradient(0,y,0,y+SH/9);const b=i%2?'#8a5a36':'#966239';g.addColorStop(0,shade(b,.05));g.addColorStop(1,shade(b,-.12));x.fillStyle=g;x.fillRect(0,y,SW,SH/9+1)}
  x.strokeStyle='rgba(60,30,10,.35)';x.lineWidth=2;for(let i=1;i<9;i++){x.beginPath();x.moveTo(0,i*SH/9);x.lineTo(SW,i*SH/9);x.stroke()}
  x.strokeStyle='rgba(60,30,10,.12)';x.lineWidth=1;for(let i=0;i<70;i++){const y=(i*53)%SH,w=200+(i*97)%500,x0=(i*211)%SW;x.beginPath();x.moveTo(x0,y);x.lineTo(x0+w,y+((i%5)-2));x.stroke()}
  const vg=x.createRadialGradient(SW/2,SH/2,SH*.2,SW/2,SH/2,SW*.7);vg.addColorStop(0,'rgba(255,230,190,.16)');vg.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=vg;x.fillRect(0,0,SW,SH);
  const[w,h]=fitR(im.width,im.height,620,620);
  /* kahve fincanı (yukarıdan) */
  x.save();x.translate(SW*.8,SH*.26);x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=30;x.shadowOffsetX=18;x.shadowOffsetY=22;x.fillStyle='#f4f1ea';x.beginPath();x.arc(0,0,120,0,7);x.fill();x.shadowColor='transparent';x.fillStyle='#e0dacb';x.beginPath();x.arc(0,0,92,0,7);x.fill();const cg=x.createRadialGradient(-20,-20,5,0,0,84);cg.addColorStop(0,'#6b4226');cg.addColorStop(1,'#2e190c');x.fillStyle=cg;x.beginPath();x.arc(0,0,80,0,7);x.fill();x.fillStyle='#f4f1ea';x.beginPath();x.ellipse(135,0,34,24,0,0,7);x.fill();x.restore();
  /* kalem */
  x.save();x.translate(SW*.2,SH*.78);x.rotate(-.5);x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=14;x.shadowOffsetX=8;x.shadowOffsetY=12;rrp(x,-210,-9,420,18,9);x.fillStyle='#1f2430';x.fill();x.shadowColor='transparent';x.fillStyle='#c9ccd4';x.fillRect(-210,-9,26,18);x.fillStyle='#d4af37';x.fillRect(150,-9,6,18);x.restore();
  /* kartlar */
  const card=(cx,cy,a,fill)=>{x.save();x.translate(cx,cy);x.rotate(a);x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=30;x.shadowOffsetX=10;x.shadowOffsetY=18;x.fillStyle='#fbfaf6';x.fillRect(-w/2,-h/2,w,h);x.shadowColor='transparent';if(fill)x.drawImage(im,-w/2,-h/2,w,h);gloss(x,-w/2,-h/2,w,h,.12);x.restore()};
  card(SW*.46,SH*.56,.1,false);card(SW*.48,SH*.5,-.1,true)},
 duvar(x,im,bg){/* duvarda çerçeve + ışık */
  const wall=shade(bg,.12),g=x.createLinearGradient(0,0,0,SH);g.addColorStop(0,shade(wall,.08));g.addColorStop(1,shade(wall,-.1));x.fillStyle=g;x.fillRect(0,0,SW,SH);
  x.globalAlpha=.05;for(let i=0;i<2500;i++){x.fillStyle=i%2?'#000':'#fff';x.fillRect((i*7919)%SW,(i*104729)%SH,2,2)}x.globalAlpha=1;
  const fl=SH*.84;x.fillStyle=shade(bg,-.25);x.fillRect(0,fl,SW,SH-fl);x.fillStyle=shade(bg,.3);x.fillRect(0,fl-26,SW,26);x.fillStyle='rgba(0,0,0,.16)';x.fillRect(0,fl,SW,10);
  const[iw,ih]=fitR(im.width,im.height,620,640),mat=46,fr=18,W=iw+2*(mat+fr),H=ih+2*(mat+fr),X=(SW-W)/2,Y=(fl-26-H)/2+14;
  const lg=x.createRadialGradient(SW/2,Y-120,40,SW/2,Y+H/2,SW*.6);lg.addColorStop(0,'rgba(255,244,214,.55)');lg.addColorStop(1,'rgba(255,244,214,0)');x.fillStyle=lg;x.fillRect(0,0,SW,SH);
  x.save();x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=44;x.shadowOffsetX=14;x.shadowOffsetY=24;x.fillStyle='#17171a';x.fillRect(X,Y,W,H);x.restore();
  x.fillStyle='#17171a';x.fillRect(X,Y,W,H);x.fillStyle='#f6f3ec';x.fillRect(X+fr,Y+fr,W-2*fr,H-2*fr);x.save();x.shadowColor='rgba(0,0,0,.3)';x.shadowBlur=10;x.shadowOffsetY=2;x.fillStyle='#fff';x.fillRect(X+fr+mat,Y+fr+mat,iw,ih);x.restore();x.drawImage(im,X+fr+mat,Y+fr+mat,iw,ih);
  x.fillStyle='rgba(0,0,0,.18)';x.fillRect(X+fr,Y+fr,W-2*fr,8);
  /* saksı */
  x.fillStyle='#b5651d';x.beginPath();x.moveTo(SW*.84,fl);x.lineTo(SW*.84+90,fl);x.lineTo(SW*.84+76,fl-110);x.lineTo(SW*.84+14,fl-110);x.fill();x.fillStyle='#2f7d4f';for(let i=0;i<7;i++){x.beginPath();x.ellipse(SW*.84+45+(i-3)*20,fl-190-(i%3)*34,16,70,(i-3)*.22,0,7);x.fill()}},
 billboard(x,im,bg){/* dış mekân billboard */
  const sk=x.createLinearGradient(0,0,0,SH*.75);sk.addColorStop(0,'#6fb1f2');sk.addColorStop(1,'#eaf4ff');x.fillStyle=sk;x.fillRect(0,0,SW,SH);
  x.fillStyle='rgba(255,255,255,.75)';[[250,150,150],[1200,110,120],[800,210,90]].forEach(([cx,cy,r])=>{for(let i=0;i<5;i++){x.beginPath();x.arc(cx+i*r*.5,cy+(i%2)*14,r*.45,0,7);x.fill()}});
  const gy=SH*.78;x.fillStyle='#b9c6d6';for(let i=0;i<16;i++){const bw=70+(i*37)%60,bh=120+(i*83)%190;x.fillRect(i*104,gy-bh,bw,bh)}
  x.fillStyle='#4d8f4d';x.fillRect(0,gy,SW,SH-gy);const rg=x.createLinearGradient(0,gy,0,SH);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=rg;x.fillRect(0,gy,SW,SH-gy);
  const BW=1180,BH=560,X=(SW-BW)/2,Y=170;
  x.fillStyle='#5b5b63';x.fillRect(SW/2-210,Y+BH,32,gy-Y-BH+20);x.fillRect(SW/2+178,Y+BH,32,gy-Y-BH+20);
  x.fillStyle='#43434a';x.fillRect(SW/2-290,Y+BH-6,580,22);
  x.save();x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=36;x.shadowOffsetY=22;x.fillStyle='#2a2a30';x.fillRect(X-18,Y-18,BW+36,BH+36);x.restore();
  x.fillStyle='#fff';x.fillRect(X,Y,BW,BH);const[dw,dh]=fitR(im.width,im.height,BW-40,BH-30);x.drawImage(im,X+(BW-dw)/2,Y+(BH-dh)/2,dw,dh);
  const lt=x.createLinearGradient(0,Y,0,Y+BH);lt.addColorStop(0,'rgba(255,255,255,.18)');lt.addColorStop(.5,'rgba(255,255,255,0)');lt.addColorStop(1,'rgba(0,0,0,.14)');x.fillStyle=lt;x.fillRect(X,Y,BW,BH);
  for(let i=0;i<4;i++){const lx=X+130+i*300;x.fillStyle='#222';x.fillRect(lx,Y-40,70,14);x.fillRect(lx+30,Y-28,10,14);const lg=x.createLinearGradient(lx+35,Y-26,lx+35,Y+170);lg.addColorStop(0,'rgba(255,248,220,.35)');lg.addColorStop(1,'rgba(255,248,220,0)');x.fillStyle=lg;x.beginPath();x.moveTo(lx+20,Y-26);x.lineTo(lx+50,Y-26);x.lineTo(lx+120,Y+170);x.lineTo(lx-50,Y+170);x.fill()}}
};
const MKN=[['kitap','📘 Kitap'],['dergi','📰 Dergi'],['poster','🖼 Çerçeveli poster'],['telefon','📱 Telefon'],['kartvizit','💳 Kartvizit'],['ekran','🖥 Ekran'],['masa','🪵 Masa üstü'],['duvar','🧱 Duvar'],['billboard','🏙 Billboard']];
const MST={k:'kitap',p:0,bg:'#d9d6cf'};
async function mockRender(){const p=document.getElementById('v11mk');if(!p)return;const cv=p.querySelector('#v11c'),x=cv.getContext('2d');cv.width=SW;cv.height=SH;
 const im=await pageCanvas(MST.p,1100);bgFill(x,MST.bg);MK[MST.k](x,im,MST.bg)}
async function mockupOpen(){if(!PROJ)return;PROJ.pages[PROJ.cur].s=pageSnap();MST.p=PROJ.cur;
 const body=`<div class="v11r"><div class="chips" id="v11k">${MKN.map(([k,n])=>`<button class="chip${k==MST.k?' on':''}" data-v11k="${k}" type="button">${n}</button>`).join('')}</div>
 <div class="v11o"><label>Sayfa <select id="v11p">${PROJ.pages.map((_,i)=>`<option value="${i}"${i==MST.p?' selected':''}>${i+1}</option>`).join('')}</select></label>
 <label>Arka plan <input type="color" id="v11b" value="${MST.bg}"></label>
 ${['#d9d6cf','#f2ede4','#222831','#c9d6e2','#e8c9c9','#cfe0cf'].map(c=>`<button type="button" class="v11s" data-v11s="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div>
 <canvas id="v11c" width="${SW}" height="${SH}" style="width:100%;height:auto;border-radius:10px;background:#ddd"></canvas>
 <div class="v11o"><button class="pb" id="v11d" type="button">PNG olarak indir</button><button class="b" id="v11z" type="button" title="Seçili sayfayı tüm sahnelerde (masa, duvar, telefon, billboard…) tek tıkla üret">Tüm sahneler · zip</button><small class="mut">Sayfa canlı çizilir; değiştirip yeniden aç.</small></div></div>
 <style>.v11o{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:8px 0}.v11s{width:26px;height:26px;border-radius:50%;border:2px solid rgba(128,128,128,.4);cursor:pointer}.v11r .chips{display:flex;gap:6px;flex-wrap:wrap}.v11r .chip.on{outline:2px solid var(--ac,#e6007e)}</style>`;
 const p=m11('v11mk','Mockup sahnesi',body,'Tasarımını gerçek bir üründe göster · Behance / sunum için');
 p.onclick=async e=>{const k=e.target.closest('[data-v11k]'),s=e.target.closest('[data-v11s]');if(k){MST.k=k.dataset.v11k;p.querySelectorAll('[data-v11k]').forEach(b=>b.classList.toggle('on',b===k));await mockRender()}
  if(s){MST.bg=s.dataset.v11s;p.querySelector('#v11b').value=MST.bg;await mockRender()}
  if(e.target.id=='v11z'){e.target.disabled=true;const k0=MST.k,files=[];try{const im=await pageCanvas(MST.p,1100);for(const[k]of MKN){toast('Sahne: '+k+'…');const c=document.createElement('canvas');c.width=SW;c.height=SH;const x=c.getContext('2d');bgFill(x,MST.bg);MK[k](x,im,MST.bg);const bl=await new Promise(r=>c.toBlob(r,'image/png'));files.push({name:'mockup-'+k+'.png',data:new Uint8Array(await bl.arrayBuffer())})}await save(window.v4slug(PROJ.name||'proje')+'-mockup-seti.zip',window.v4zip(files));toast(files.length+' sahne zip olarak indirildi ✓')}catch(x){toast('Mockup seti üretilemedi')}finally{e.target.disabled=false;MST.k=k0}return}
  if(e.target.id=='v11d'){p.querySelector('#v11c').toBlob(b=>save(window.v4slug(PROJ.name||'proje')+'-mockup-'+MST.k+'.png',b),'image/png');toast('Mockup indirildi ✓')}};
 p.querySelector('#v11p').onchange=async e=>{MST.p=+e.target.value;await mockRender()};
 p.querySelector('#v11b').oninput=async e=>{MST.bg=e.target.value;await mockRender()};
 toast('Sahne hazırlanıyor…');await mockRender()}

/* ================= SVG İÇE AKTAR ================= */
function pp(d){const s=String(d||''),n=s.length;let i=0;const out=[];
 const ws=()=>{while(i<n&&/[\s,]/.test(s[i]))i++};
 const num=()=>{ws();const m=/^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(s.slice(i,i+40));if(!m)return NaN;i+=m[0].length;return +m[0]};
 const flag=()=>{ws();const c=s[i++];return c=='1'?1:0};
 let cmd='',cx=0,cy=0,sx=0,sy=0,qx=0,qy=0,pc='',lx=0,ly=0;
 while(true){ws();if(i>=n)break;const c=s[i];if(/[A-Za-z]/.test(c)){cmd=c;i++}else if(!cmd)break;
  const rel=cmd==cmd.toLowerCase(),C=cmd.toUpperCase();
  if(C=='Z'){out.push(['Z']);cx=sx;cy=sy;pc='Z';continue}
  let a,b,c2,d2,e2,f2,g;
  if(C=='M'){a=num();b=num();if(isNaN(a)||isNaN(b))break;if(rel){a+=cx;b+=cy}out.push(['M',a,b]);cx=sx=a;cy=sy=b;cmd=rel?'l':'L';pc='M';continue}
  if(C=='L'){a=num();b=num();if(isNaN(a)||isNaN(b))break;if(rel){a+=cx;b+=cy}out.push(['L',a,b]);cx=a;cy=b;pc='L';continue}
  if(C=='H'){a=num();if(isNaN(a))break;if(rel)a+=cx;out.push(['L',a,cy]);cx=a;pc='L';continue}
  if(C=='V'){a=num();if(isNaN(a))break;if(rel)a+=cy;out.push(['L',cx,a]);cy=a;pc='L';continue}
  if(C=='C'){a=num();b=num();c2=num();d2=num();e2=num();f2=num();if([a,b,c2,d2,e2,f2].some(isNaN))break;if(rel){a+=cx;b+=cy;c2+=cx;d2+=cy;e2+=cx;f2+=cy}out.push(['C',a,b,c2,d2,e2,f2]);lx=c2;ly=d2;cx=e2;cy=f2;pc='C';continue}
  if(C=='S'){c2=num();d2=num();e2=num();f2=num();if([c2,d2,e2,f2].some(isNaN))break;if(rel){c2+=cx;d2+=cy;e2+=cx;f2+=cy}const x1=pc=='C'?2*cx-lx:cx,y1=pc=='C'?2*cy-ly:cy;out.push(['C',x1,y1,c2,d2,e2,f2]);lx=c2;ly=d2;cx=e2;cy=f2;pc='C';continue}
  if(C=='Q'||C=='T'){let x1,y1;if(C=='Q'){x1=num();y1=num();if(isNaN(x1)||isNaN(y1))break;if(rel){x1+=cx;y1+=cy}}else{x1=pc=='Q'?2*cx-qx:cx;y1=pc=='Q'?2*cy-qy:cy}
   e2=num();f2=num();if(isNaN(e2)||isNaN(f2))break;if(rel){e2+=cx;f2+=cy}
   out.push(['C',cx+2/3*(x1-cx),cy+2/3*(y1-cy),e2+2/3*(x1-e2),f2+2/3*(y1-f2),e2,f2]);qx=x1;qy=y1;cx=e2;cy=f2;pc='Q';continue}
  if(C=='A'){const rx=num(),ry=num(),ph=num(),fa=flag(),fs=flag();e2=num();f2=num();if([rx,ry,ph,e2,f2].some(isNaN))break;if(rel){e2+=cx;f2+=cy}
   arc(cx,cy,rx,ry,ph,fa,fs,e2,f2).forEach(q=>out.push(q));cx=e2;cy=f2;pc='A';continue}
  break}
 return out}
function arc(x1,y1,rx,ry,phi,fa,fs,x2,y2){if(!rx||!ry||(x1==x2&&y1==y2))return[['L',x2,y2]];rx=Math.abs(rx);ry=Math.abs(ry);const P=phi*Math.PI/180,co=Math.cos(P),si=Math.sin(P),dx=(x1-x2)/2,dy=(y1-y2)/2,xp=co*dx+si*dy,yp=-si*dx+co*dy;
 const lam=xp*xp/(rx*rx)+yp*yp/(ry*ry);if(lam>1){const s=Math.sqrt(lam);rx*=s;ry*=s}
 const sg=fa==fs?-1:1,nu=rx*rx*ry*ry-rx*rx*yp*yp-ry*ry*xp*xp,de=rx*rx*yp*yp+ry*ry*xp*xp,k=sg*Math.sqrt(Math.max(0,nu/de)),cxp=k*rx*yp/ry,cyp=-k*ry*xp/rx,cx=co*cxp-si*cyp+(x1+x2)/2,cy=si*cxp+co*cyp+(y1+y2)/2;
 const ang=(ux,uy,vx,vy)=>{const a=Math.atan2(ux*vy-uy*vx,ux*vx+uy*vy);return a};
 const t1=ang(1,0,(xp-cxp)/rx,(yp-cyp)/ry);let dt=ang((xp-cxp)/rx,(yp-cyp)/ry,(-xp-cxp)/rx,(-yp-cyp)/ry);if(!fs&&dt>0)dt-=2*Math.PI;if(fs&&dt<0)dt+=2*Math.PI;
 const n=Math.max(1,Math.ceil(Math.abs(dt)/(Math.PI/2)-1e-9)),de2=dt/n,t=4/3*Math.tan(de2/4),out=[];
 const M=(X,Y)=>[cx+co*rx*X-si*ry*Y,cy+si*rx*X+co*ry*Y];
 for(let i=0;i<n;i++){const a1=t1+i*de2,a2=a1+de2,c1=M(Math.cos(a1)-t*Math.sin(a1),Math.sin(a1)+t*Math.cos(a1)),c2=M(Math.cos(a2)+t*Math.sin(a2),Math.sin(a2)-t*Math.cos(a2)),e=i==n-1?[x2,y2]:M(Math.cos(a2),Math.sin(a2));out.push(['C',c1[0],c1[1],c2[0],c2[1],e[0],e[1]])}
 return out}
const KAP=.5522847498;
function shapeSegs(el){const t=el.tagName.toLowerCase(),g=a=>parseFloat(el.getAttribute(a))||0;
 if(t=='path')return pp(el.getAttribute('d'));
 if(t=='rect'){const x=g('x'),y=g('y'),w=g('width'),h=g('height');if(w<=0||h<=0)return[];let rx=el.getAttribute('rx'),ry=el.getAttribute('ry');rx=rx==null?(ry==null?0:parseFloat(ry)):parseFloat(rx);ry=ry==null?rx:parseFloat(ry);rx=Math.min(rx||0,w/2);ry=Math.min(ry||0,h/2);
  if(!rx||!ry)return[['M',x,y],['L',x+w,y],['L',x+w,y+h],['L',x,y+h],['Z']];const kx=rx*KAP,ky=ry*KAP;
  return[['M',x+rx,y],['L',x+w-rx,y],['C',x+w-rx+kx,y,x+w,y+ry-ky,x+w,y+ry],['L',x+w,y+h-ry],['C',x+w,y+h-ry+ky,x+w-rx+kx,y+h,x+w-rx,y+h],['L',x+rx,y+h],['C',x+rx-kx,y+h,x,y+h-ry+ky,x,y+h-ry],['L',x,y+ry],['C',x,y+ry-ky,x+rx-kx,y,x+rx,y],['Z']]}
 if(t=='circle'||t=='ellipse'){const cx=g('cx'),cy=g('cy'),rx=t=='circle'?g('r'):g('rx'),ry=t=='circle'?g('r'):g('ry');if(rx<=0||ry<=0)return[];const kx=rx*KAP,ky=ry*KAP;
  return[['M',cx+rx,cy],['C',cx+rx,cy+ky,cx+kx,cy+ry,cx,cy+ry],['C',cx-kx,cy+ry,cx-rx,cy+ky,cx-rx,cy],['C',cx-rx,cy-ky,cx-kx,cy-ry,cx,cy-ry],['C',cx+kx,cy-ry,cx+rx,cy-ky,cx+rx,cy],['Z']]}
 if(t=='line')return[['M',g('x1'),g('y1')],['L',g('x2'),g('y2')]];
 if(t=='polyline'||t=='polygon'){const v=(el.getAttribute('points')||'').trim().split(/[\s,]+/).map(Number).filter(n=>!isNaN(n));const o=[];for(let i=0;i+1<v.length;i+=2)o.push([i?'L':'M',v[i],v[i+1]]);if(t=='polygon'&&o.length)o.push(['Z']);return o}
 return[]}
function rgb2hex(c){const m=/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?\s*\)/.exec(c||'');if(!m)return null;const h=v=>Math.round(+v).toString(16).padStart(2,'0');let a=1;if(m[4]!=null)a=m[4].endsWith('%')?parseFloat(m[4])/100:+m[4];return{hex:'#'+h(m[1])+h(m[2])+h(m[3]),a}}
function paint(el,root,prop){let v=getComputedStyle(el)[prop];if(!v||v=='none')return null;const u=/url\(["']?#([^"')]+)["']?\)/.exec(v);
 if(u){const gd=root.querySelector('[id="'+u[1].replace(/"/g,'')+'"]');const st=gd&&gd.querySelector('stop');if(!st)return{hex:'#888888',a:1,grad:true};const c=rgb2hex(getComputedStyle(st).stopColor);return c?{...c,grad:true}:{hex:'#888888',a:1,grad:true}}
 return rgb2hex(v)}
function svgImport(txt){if(!PROJ)return;
 let doc;try{doc=new DOMParser().parseFromString(txt,'image/svg+xml')}catch(e){return toast('SVG okunamadı')}
 const src=doc.documentElement;if(!src||src.tagName.toLowerCase()!='svg'||doc.querySelector('parsererror'))return toast('Geçerli bir SVG dosyası değil');
 src.querySelectorAll('script,foreignObject,iframe,object,embed,audio,video').forEach(n=>n.remove());
 src.querySelectorAll('*').forEach(n=>{[...n.attributes].forEach(a=>{if(/^on/i.test(a.name)||/javascript:/i.test(a.value))n.removeAttribute(a.name)})});
 src.querySelectorAll('style').forEach(n=>{n.textContent=n.textContent.replace(/@import[^;]*;?/g,'').replace(/url\(\s*["']?(?:https?:|\/\/|data:text)[^)]*\)/gi,'none')});
 const host=document.createElement('div');host.style.cssText='position:absolute;left:-99999px;top:0;pointer-events:none';
 const root=document.importNode(src,true);host.appendChild(root);document.body.appendChild(host);
 try{
  let vx=0,vy=0,vw=0,vh=0;const vbA=root.getAttribute('viewBox');
  if(vbA){const q=vbA.trim().split(/[\s,]+/).map(Number);if(q.length==4&&q[2]>0&&q[3]>0)[vx,vy,vw,vh]=q}
  if(!vw){vw=parseFloat(root.getAttribute('width'))||0;vh=parseFloat(root.getAttribute('height'))||0}
  if(!vw||!vh){try{const b=root.getBBox();vx=b.x;vy=b.y;vw=b.width;vh=b.height}catch(e){}}
  if(!(vw>0&&vh>0)){return toast('SVG boyutu bulunamadı')}
  root.setAttribute('width',vw);root.setAttribute('height',vh);root.setAttribute('viewBox',`${vx} ${vy} ${vw} ${vh}`);
  const pgH=100/S.fmt,k=Math.min(80/vw,.8*pgH/vh),ox=(100-vw*k)/2,oy=(pgH-vh*k)/2;
  const rc=root.getScreenCTM(),inv=rc?rc.inverse():null;
  const items=[];let skipT=0,skipI=0,skipG=0;
  root.querySelectorAll('text,tspan').forEach(()=>{skipT++});root.querySelectorAll('image').forEach(()=>{skipI++});
  root.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon').forEach(el=>{
   if(el.closest('defs,clipPath,mask,symbol,marker,pattern,linearGradient,radialGradient'))return;
   const cs=getComputedStyle(el);if(cs.display=='none'||cs.visibility=='hidden')return;
   let segs=shapeSegs(el);if(!segs.length)return;
   let M=[1,0,0,1,0,0];if(inv&&el.getScreenCTM){const c=el.getScreenCTM();if(c){const m=inv.multiply(c);M=[m.a,m.b,m.c,m.d,m.e,m.f]}}
   const T=(X,Y)=>{const a=M[0]*X+M[2]*Y+M[4],b=M[1]*X+M[3]*Y+M[5];return[(a-vx)*k+ox,(b-vy)*k+oy]};
   const out=segs.map(s=>{if(s[0]=='Z')return['Z'];const r=[s[0]];for(let i=1;i<s.length;i+=2){const p=T(s[i],s[i+1]);r.push(p[0],p[1])}return r});
   const fl=el.tagName.toLowerCase()=='line'?null:paint(el,root,'fill'),st=paint(el,root,'stroke'),sc=Math.sqrt(Math.abs(M[0]*M[3]-M[1]*M[2]))||1;
   let sw=st?(parseFloat(cs.strokeWidth)||1)*sc*k:0;const op=Math.max(0,Math.min(1,parseFloat(cs.opacity)||0));if(op===0)return;
   const fo=parseFloat(cs.fillOpacity),so=parseFloat(cs.strokeOpacity);let a=op*(fl?(isNaN(fo)?1:fo)*fl.a:1);if(!fl&&st)a=op*(isNaN(so)?1:so)*st.a;
   if(!fl&&!st)return;
   if(fl&&fl.grad)skipG++;
   items.push({d:out,fl:fl&&fl.hex,st:st&&st.hex,sw,eo:cs.fillRule=='evenodd',op:Math.round(Math.max(1,Math.min(100,a*100))),cap:cs.strokeLinecap,jn:cs.strokeLinejoin,dash:cs.strokeDasharray&&cs.strokeDasharray!='none'?'d':'',nm:el.tagName.toLowerCase()})});
  if(!items.length)return toast('SVG içinde aktarılabilir şekil bulunamadı'+(skipT?' (metinler desteklenmez, önce yola çevir)':''));
  /* çok fazla parça: aynı stildekileri tek bileşik yola birleştir */
  let list=items,merged=false;
  if(items.length>120){const g=new Map();items.forEach(it=>{const key=[it.fl,it.st,r3(it.sw),it.eo,it.op,it.cap,it.jn,it.dash].join('|');const o=g.get(key);if(o)o.d=o.d.concat(it.d);else g.set(key,{...it,d:it.d.slice(),nm:'grup'})});list=[...g.values()];merged=true}
  const room=Math.max(0,200-S.els.length);if(list.length>room)return toast('Çok fazla parça ('+list.length+'): sayfada '+room+' öğelik yer var');
  const gid=list.length>1?nid():null;const made=[];
  list.forEach((it,idx)=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;it.d.forEach(s=>{for(let i=1;i<s.length;i+=2){x0=Math.min(x0,s[i]);x1=Math.max(x1,s[i]);y0=Math.min(y0,s[i+1]);y1=Math.max(y1,s[i+1])}});
   if(!isFinite(x0))return;const pad=it.sw/2+.15,X=x0-pad,Y=y0-pad,W=Math.max(.3,x1-x0+2*pad),H=Math.max(.3,y1-y0+2*pad);
   const dd=it.d.map(s=>s[0]=='Z'?'Z':s[0]+s.slice(1).map((v,i)=>r3(v-(i%2?Y:X))).join(' ')).join('');
   const e=mk('r');Object.assign(e,{shape:'draw',nm:'SVG '+it.nm,col:it.st||it.fl||'#000000',sw2:it.st?Math.max(.02,r3(it.sw)):0,fl:it.fl||'#000000',fon:!!it.fl,eo:it.eo,dd,fr:[r3(X),r3(Y),r3(W),r3(H)],vb:[r3(W),r3(H)],pin:true,op:it.op});
   if(it.st){e.cap=it.cap=='butt'||it.cap=='square'?it.cap:'round';e.jn=it.jn=='miter'||it.jn=='bevel'?it.jn:'round';if(it.dash)e.dash='d'}
   if(gid)e.gid=gid;e.z=topZ()+10+idx;S.els.push(e);made.push(e)});
  if(!made.length)return toast('SVG içinde aktarılabilir şekil bulunamadı');
  S.sel=made[made.length-1].id;MSEL.clear();if(gid)made.forEach(e=>MSEL.add(e.id));
  render();list2();ed();hist();sbar();
  const notes=[];if(skipT)notes.push(skipT+' metin atlandı');if(skipI)notes.push(skipI+' görsel atlandı');if(skipG)notes.push('degradeler düz renge çevrildi');if(merged)notes.push('parçalar birleştirildi');
  toast('SVG aktarıldı · '+made.length+' yol'+(notes.length?' ('+notes.join(', ')+')':''))
 }finally{host.remove()}}
function list2(){try{list()}catch(e){}}
function sbar(){try{stBar()}catch(e){}}
let fin=null;function svgPick(){if(!PROJ||document.getElementById('edw').hidden)return toast('Önce bir tasarım aç');
 if(!fin){fin=document.createElement('input');fin.type='file';fin.accept='.svg,image/svg+xml';fin.id='v11svg';fin.hidden=true;document.body.appendChild(fin);
  fin.onchange=async()=>{const f=fin.files[0];fin.value='';if(!f)return;if(f.size>6e6)return toast('SVG çok büyük (6 MB üstü)');svgImport(await f.text())}}
 fin.click()}

/* ================= FLIPBOOK ================= */
const FB=`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>__T__</title><style>
*{box-sizing:border-box;margin:0}html,body{height:100%}body{background:radial-gradient(ellipse at 50% 40%,#3a3a44,#15151a);font-family:system-ui,sans-serif;color:#eee;overflow:hidden;user-select:none;-webkit-user-select:none}
h1{position:fixed;top:12px;left:0;right:0;text-align:center;font-size:14px;font-weight:600;letter-spacing:.04em;opacity:.8}
#st{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;perspective:2600px;padding-top:20px}
#bk{position:relative;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.5,0,.2,1)}
.sh{position:absolute;left:50%;top:0;transform-origin:left center;transform-style:preserve-3d;transition:transform .95s cubic-bezier(.45,.05,.25,1)}
.sh.f{transform:rotateY(-180deg)}
.fc{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:#fff;overflow:hidden}
.fc img{width:100%;height:100%;display:block;object-fit:cover;pointer-events:none}
.fc.bk{transform:rotateY(180deg)}.fc::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.28),rgba(0,0,0,0) 9%)}
.fc.bk::after{background:linear-gradient(270deg,rgba(0,0,0,.28),rgba(0,0,0,0) 9%)}
.bl{background:#f4f1ea}.hl{position:absolute;display:block;cursor:pointer}.hl:hover{outline:2px solid #7c5cffcc}
#bk::before{content:"";position:absolute;left:0;right:0;bottom:-26px;height:30px;background:radial-gradient(ellipse at center,rgba(0,0,0,.5),transparent 70%)}
#ct{position:fixed;bottom:14px;left:0;right:0;display:flex;justify-content:center;gap:10px;align-items:center;font-size:13px}
button{background:#ffffff1f;color:#fff;border:1px solid #ffffff30;border-radius:999px;padding:8px 16px;font-size:14px;cursor:pointer}button:hover{background:#ffffff38}button:disabled{opacity:.35;cursor:default}
</style></head><body><h1>__T__</h1><div id="st"><div id="bk"></div></div><div id="ct"><button id="pv" aria-label="Önceki">‹</button><span id="cn"></span><button id="nx" aria-label="Sonraki">›</button><button id="fs" aria-label="Tam ekran">⛶</button></div>
<script>
var P=__P__,LK=__L__,R=__R__,bk=document.getElementById("bk"),N=Math.ceil(P.length/2),f=0,sh=[],W=0,H=0;
function build(){bk.innerHTML="";sh=[];for(var k=0;k<N;k++){var s=document.createElement("div");s.className="sh";var a=P[2*k],b=P[2*k+1];
 s.innerHTML='<div class="fc"><img alt="" src="'+a+'"></div><div class="fc bk'+(b?'':' bl')+'">'+(b?'<img alt="" src="'+b+'">':'')+'</div>';bk.appendChild(s);sh.push(s);hot(s.children[0],2*k);if(b)hot(s.children[1],2*k+1)}}
function hot(fc,pi){(LK[pi]||[]).forEach(function(q){var a=document.createElement("a");a.className="hl";a.style.cssText="left:"+q.x+"%;top:"+q.y+"%;width:"+q.w+"%;height:"+q.h+"%";a.title=q.t=="p"?"Sayfa "+q.n:q.u;a.onclick=function(ev){ev.stopPropagation();if(q.t=="p"){var n=q.n-1;f=n%2==0?Math.floor(n/2):Math.floor(n/2)+1;f=Math.max(0,Math.min(N,f));upd()}else if(/^(https?:\\/\\/|mailto:)/i.test(q.u))window.open(q.u,"_blank","noopener")};fc.appendChild(a)})}
function size(){var vw=innerWidth,vh=innerHeight;W=Math.min((vw-30)/2,(vh-110)*R);H=W/R;bk.style.width=2*W+"px";bk.style.height=H+"px";sh.forEach(function(s){s.style.width=W+"px";s.style.height=H+"px"});upd()}
function upd(){sh.forEach(function(s,k){var fl=k<f;s.classList.toggle("f",fl);s.style.zIndex=fl?k+1:N-k});
 bk.style.transform=f==0?"translateX("+(-W/2)+"px)":f==N?"translateX("+(W/2)+"px)":"translateX(0)";
 var l=f==0?"Kapak":(2*f)+(2*f+1<=P.length?" – "+(2*f+1):""),t=P.length;document.getElementById("cn").textContent=f==0?"Kapak · "+t+" sayfa":f==N&&P.length%2==1?"Son sayfa":l+" / "+t;
 document.getElementById("pv").disabled=f==0;document.getElementById("nx").disabled=f==N}
function go(d){f=Math.max(0,Math.min(N,f+d));upd()}
document.getElementById("pv").onclick=function(){go(-1)};document.getElementById("nx").onclick=function(){go(1)};
document.getElementById("fs").onclick=function(){var e=document.documentElement;if(document.fullscreenElement)document.exitFullscreen();else if(e.requestFullscreen)e.requestFullscreen()};
document.addEventListener("keydown",function(e){if(e.key=="ArrowRight"||e.key==" ")go(1);if(e.key=="ArrowLeft")go(-1);if(e.key=="Home"){f=0;upd()}if(e.key=="End"){f=N;upd()}});
bk.addEventListener("click",function(e){var r=bk.getBoundingClientRect();if(e.clientX>r.left+r.width/2)go(1);else go(-1)});
var tx=null;addEventListener("touchstart",function(e){tx=e.touches[0].clientX},{passive:true});addEventListener("touchend",function(e){if(tx==null)return;var d=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(d)>40)go(d<0?1:-1)});
addEventListener("resize",size);build();size();
<\/script></body></html>`;
async function flipbook(){if(!PROJ)return;toast('Flipbook hazırlanıyor…');const imgs=[];
 const lks=[];await eachPage(async()=>{await loadF();imgs.push(draw(1000).toDataURL('image/jpeg',.84));lks.push(window.v4links?v4links():[])});
 const html=FB.replace(/__T__/g,String(PROJ.name||'Proje').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]).replace(/\$/g,'$$$$')).replace('__P__',JSON.stringify(imgs).replace(/</g,'\\u003c')).replace('__L__',()=>JSON.stringify(lks).replace(/</g,'\\u003c')).replace('__R__',String(S.fmt));
 await save(window.v4slug(PROJ.name||'proje')+'-flipbook.html',new Blob([html],{type:'text/html'}));toast('Flipbook indirildi ✓ · tek dosya, sayfa çevirme animasyonlu')}

/* ---------- komutlar + menü ---------- */
v4cmd(['Dosya','Mockup sahnesi (kitap, dergi, poster, telefon…)',[],mockupOpen]);
v4cmd(['Dosya','Flipbook (sayfa çevirmeli HTML) indir',[],flipbook]);
v4cmd(['Dosya','SVG dosyası içe aktar',['Ctrl+Alt+V'],svgPick]);
v4cmd(['Dosya','Sürümü şimdi kaydet',[],()=>verSave('Elle kaydedildi')]);
const mm=document.getElementById('mmenu');if(mm){[['Mockup sahnesi',mockupOpen],['Flipbook (sayfa çevirmeli HTML)',flipbook],['SVG dosyası içe aktar',svgPick]].forEach(([t,f])=>{const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML='<span>'+t+'</span>';w.onclick=()=>{mm.hidden=true;f()};mm.appendChild(w)})}
window.v4j={mockupOpen,svgImport,flipbook,svgPick,autoVer,MK,pp};
})();
