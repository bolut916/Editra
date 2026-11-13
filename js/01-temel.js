const $=id=>document.getElementById(id),cl=(v,a,b)=>Math.max(a,Math.min(b,+v||a)),esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const cap=n=>window.claude?window.claude.use(n).catch(()=>null):Promise.resolve(null);
const FC={'Sans':["Inter","Archivo","Space Grotesk","Work Sans","Montserrat","Manrope","DM Sans","Rubik","Libre Franklin","Poppins","Syne","Unbounded","Raleway","Josefin Sans","Nunito","Quicksand","Open Sans","Noto Sans","Karla","Bricolage Grotesque","Outfit","Sora","Plus Jakarta Sans","Figtree","Urbanist","Lexend","Epilogue","Red Hat Display","Chivo","Lato","Cabin","Helvetica Neue","Arial"],
'Serif':["Playfair Display","Bodoni Moda","Fraunces","Lora","Merriweather","Source Serif 4","Libre Baskerville","Cormorant Garamond","EB Garamond","Instrument Serif","DM Serif Display","Roboto Slab","Noto Serif","Crimson Pro","Spectral","Alegreya","Vollkorn","Cinzel","Libre Caslon Text","Old Standard TT","Yeseva One","Young Serif","Gloock","Georgia"],
'Display':["Abril Fatface","Bebas Neue","Anton","Oswald","Archivo Black","Alfa Slab One","Righteous","Staatliches","Bungee","Rubik Mono One","Shrikhand","Fjalla One","Big Shoulders Display","Monoton","Limelight","Black Ops One","Rozha One"],
'El yazısı':["Pacifico","Lobster","Dancing Script","Caveat","Permanent Marker","Special Elite"],
'Mono':["IBM Plex Mono","Space Mono","JetBrains Mono","DM Mono","VT323","Press Start 2P","Fira Code"]};
const PALSTR='Kâğıt:fff8ec,111111,ff4f5e;Gece:0e0e12,f1f1f4,7c5cff;Limon:f6ffd9,0b0b0b,4d7c0f;Şeftali:ffe8d6,3a1f1d,ff6b4a;Okyanus:06202b,e6f6ff,22d3ee;Orman:10261c,f1efe0,c6ff00;Mürekkep:f4f1ea,0a1a3a,e63946;Pembe pop:ffd6e8,2b0a3d,ff2e88;Çöl:efe0c8,3b2a1a,c8553d;Buz:eaf4ff,12263f,3b82f6;Altın:111111,f2eee6,d4af37;Lavanta:ede7ff,26104a,8b5cf6;Mercan:fff1ec,2d1b1b,ff5a5f;Lacivert:0b1b3a,f5efe0,ffb703;Zeytin:e9ecd9,2b3318,8a9a2b;Toprak:2a1d15,f2e3cf,e07a3f;Mono:ffffff,000000,000000;Ters mono:000000,ffffff,ffffff;Retro:f2e6c9,1d3557,e63946;Neon:0a0a0a,f5f5f5,39ff14;Tatlı:fff0f5,4a2040,ff85a2;Kömür:1f2023,e8e8ea,ff7a1a;Nane:e0f7ef,0d3b2e,10b981;Bordo:3b0d1a,f7e9e1,ff6b81;Güneş:ffd23f,1b1b1b,ee4266;Kobalt:e8ecff,0b1c8c,ff7849;Çikolata:f3e5d8,2b1810,b5651d;Siber:120458,f0f0ff,00f5d4';
const PALS=PALSTR.split(';').map(x=>{const[n,c]=x.split(':');return[n,...c.split(',').map(h=>'#'+h)]});
const TY={img:['▣','Görsel'],t:['H','Başlık'],s:['h','Alt başlık'],b:['¶','Paragraf'],m:['#','Künye'],q:['“','Alıntı'],r:['◼','Şekil']};
const W={img:3,t:2.2,s:.7,b:2,m:.3,q:1.3,r:0},MAXN=200;
const LOR=['Sayfayı görünmez bir sütun ve satır ağıyla bölmek; metni, görseli ve boşluğu aynı mantıkla hizalamak. Düzen tutarlı, okunaklı ve nesnel kalır. Dergi tasarımında bu ağ, ritim ve hiyerarşi kurmanın en güvenilir yoludur.','İyi bir dergi sayfası okuru bir yerden başka bir yere taşır: önce başlık, sonra görsel, ardından metin. Boşluklar bu yolculukta nefes aldırır ve vurguyu doğru yere koyar.','Tipografik kontrast; boyut, kalınlık ve aralıkla kurulur. Başlık ile gövde metni arasındaki fark ne kadar net olursa, sayfanın hiyerarşisi o kadar kolay okunur.','Görseller yalnızca süs değildir; sayfanın ağırlık merkezini belirler. Kırpma, ölçek ve konum, aynı fotoğrafın bambaşka bir hikâye anlatmasını sağlar.'];
const STY=[
{n:'Editoryal',t:'Playfair Display',b:'Source Serif 4',bg:'#f6f1e9',tx:'#1b1b1b',ac:'#b3261e'},
{n:'Swiss',t:'Inter',b:'Inter',bg:'#f1f0ec',tx:'#111111',ac:'#e30613'},
{n:'Moda',t:'Bodoni Moda',b:'Montserrat',bg:'#111111',tx:'#f2eee6',ac:'#d4af37'},
{n:'Brütalist',t:'Anton',b:'Space Mono',bg:'#e9e9e9',tx:'#000000',ac:'#ff3b00'},
{n:'Teknoloji',t:'Unbounded',b:'DM Sans',bg:'#0b0f1a',tx:'#e8ecff',ac:'#5b8cff'},
{n:'Klasik',t:'Cormorant Garamond',b:'EB Garamond',bg:'#fbf8f1',tx:'#2a2118',ac:'#8c5a2b'},
{n:'Pop',t:'Abril Fatface',b:'Poppins',bg:'#ffe9d6',tx:'#2b0a3d',ac:'#ff4d6d'},
{n:'Minimal',t:'Manrope',b:'Manrope',bg:'#ffffff',tx:'#222222',ac:'#888888'},
{n:'Spor',t:'Bebas Neue',b:'Oswald',bg:'#0d1b12',tx:'#f2f2f2',ac:'#c6ff00'},
{n:'Modern serif',t:'Fraunces',b:'Libre Franklin',bg:'#efe7dc',tx:'#20302a',ac:'#d9531e'}];
const PRE=[['Görsel + paragraf',{img:1,t:1,s:1,b:1,m:1,q:0}],['3 görsel · 2 paragraf · başlık',{img:3,t:1,s:1,b:2,m:1,q:0}],['Makale: 1 görsel · 4 paragraf',{img:1,t:1,s:1,b:4,m:1,q:1}],['Röportaj: 2 görsel · 3 paragraf · alıntı',{img:2,t:1,s:1,b:3,m:1,q:2}],['Galeri: 6 görsel',{img:6,t:1,s:0,b:1,m:1,q:0}]];
const FN=['Dengeli bölme','Başlık bantlı','Tam sayfa görsel','Bantlı tam sayfa','Dikey akış','Dikey akış · bantlı','Tam sayfa · dikey','Tam sayfa · dikey','Mozaik ızgara','Merkezde başlık','Basamak','Çerçeve','Şerit sütunlar','Dev görsel','Katalog ızgarası','Afiş merkez','Dönük kolaj','Dev tipografi','Eğik akış','Merkez kolaj','Gazete sütunları','Dikey omurga','Manşet kapak','Merkez kapak','Tipografik kapak','Kitap kapağı (açık)','Bantlı kapak'],SEEDS=400;
const FM=(w,h,l)=>[w/h,l,w,h];
const FD=[FM(210,297,'A4 dikey'),FM(210,280,'Dergi 3:4'),FM(420,297,'Çift sayfa'),FM(230,300,'Dergi kapağı'),FM(480,270,'Web 16:9')],FK=[FM(210,297,'A4 dikey'),FM(297,210,'A4 yatay'),FM(210,210,'Kare'),FM(148,210,'A5')],FB=[FM(420,594,'Afiş A2'),FM(610,914,'Poster 24×36 in'),FM(297,210,'Broşür yatay'),FM(85,55,'Kartvizit'),FM(100,210,'Menü dar'),FM(148,210,'Davetiye A5'),FM(841,1189,'A0 poster'),FM(300,100,'Billboard 3:1')],FS=[FM(108,135,'Instagram 4:5'),FM(108,192,'Story 9:16'),FM(200,200,'Kare')];
const MODES={
dergi:{n:'Dergi',f:[0,1,2,3,4,5,6,7,10,11,13,16,17,20,21],fmt:FD,cols:12,rows:16,mar:5,pre:PRE,st:[0,5,2,9]},
katalog:{n:'Katalog',f:[8,14,12,5,9,20],fmt:FK,cols:12,rows:16,mar:5,pre:[['6 ürün + açıklama',{img:6,t:1,s:0,b:6,m:1,q:0}],['4 ürün + özellik',{img:4,t:1,s:1,b:4,m:1,q:0}],['9 ürün ızgarası',{img:9,t:1,s:0,b:0,m:1,q:0}],['Kapak + 2 ürün',{img:3,t:1,s:1,b:2,m:1,q:0}]],st:[1,7,9,4]},
baski:{n:'Baskı işleri',f:[15,9,13,11,2,10,12,17,18,19],fmt:FB,cols:8,rows:12,mar:6,pre:[['Afiş: başlık + görsel',{img:1,t:1,s:1,b:0,m:2,q:0,r:1}],['Etkinlik posteri',{img:1,t:1,s:2,b:1,m:3,q:0,r:2}],['Kartvizit',{img:1,t:1,s:1,b:0,m:3,q:0}],['Menü',{img:2,t:1,s:3,b:4,m:1,q:0}]],st:[3,8,4,6]},
kapak:{n:'Kapak',f:[22,23,24,25,26,2,9,13,19],fmt:[FM(230,300,'Dergi kapağı'),FM(210,297,'Katalog kapağı'),FM(297,210,'Broşür kapağı yatay'),FM(420,297,'Kitap kapağı (açık)'),FM(200,200,'Albüm kapağı'),FM(240,320,'Dosya kapağı')],cols:12,rows:16,mar:4,pre:[['Dergi kapağı',{img:1,t:1,s:1,b:2,m:2,q:0,r:0}],['Katalog kapağı',{img:2,t:1,s:1,b:0,m:2,q:0,r:1}],['Kitap kapağı',{img:2,t:2,s:1,b:2,m:2,q:0,r:0}],['Albüm kapağı',{img:1,t:1,s:1,b:0,m:1,q:0,r:1}]],st:[0,2,3,6]},
sinirsiz:{n:'Sınırsız',f:Array.from({length:27},(_,i)=>i),fmt:[...FD,...FK.slice(1),...FB,...FS],cols:12,rows:16,mar:4,pre:[['Kolaj',{img:5,t:1,s:1,b:1,m:1,q:1,r:2}],['Şekilli afiş',{img:1,t:2,s:1,b:0,m:2,q:0,r:4}],['Tipografik poster',{img:0,t:3,s:2,b:1,m:2,q:1,r:3}],['Boş tuval',{img:0,t:1,s:0,b:0,m:0,q:0,r:0}]],st:[3,6,4,2]}};
const FL=()=>MODES[S.mode].f,TOT=()=>FL().length*4*SEEDS;
const S={grain:0,vig:0,mode:'dergi',mm:[210,297],auto:true,free:false,pc:null,imgPal:null,fmt:0.707,cols:12,rows:16,mar:5,gut:2,bg:'#f1f0ec',grid:false,af:true,st:1,sty:'',sp:[0,1,0,0],els:[],sel:null,n:0};
let IMGL=null;
function mk(type){const s=STY[S.st],pc=S.pc||[s.tx,s.ac],B={id:++S.n,type,on:true,pos:[1,1,1,1],op:100,rot:0,dx:0,dy:0,sb:0,sx:0,sy:0,scol:'#000000'};
 if(type=='img')return{...B,src:'',im:new Image(),fit:'cover',fx:50,fy:50,gray:0,con:100,bri:100,blend:'normal',rad:0,sep:0,sat:100,hue:0,blr:0,inv:0,duo:false,d1:'#1b1464',d2:'#ffd6e8'};
 if(type=='r')return{...B,shape:'rect',col:pc[1],rad:0};
 const nb=S.els.filter(e=>e.type=='b').length,d={t:['Dergi\nBaşlığı',14,800,.9,-.03,pc[0],s.t],s:['Alt başlık buraya',4,500,1.1,-.01,pc[1],s.b],b:[LOR[nb%4],1.9,400,1.4,0,pc[0],s.b],m:['Künye · Sayfa 01',1.7,500,1.3,.04,pc[0],'IBM Plex Mono'],q:['“Alıntı metni buraya gelir.”',3.4,500,1.15,-.01,pc[1],s.t]}[type];
 return{...B,txt:d[0],fs:d[1],fw:d[2],lh:d[3],ls:d[4],col:d[5],ff:d[6],tc:type=='m'?'upper':'none',it:type=='q',sw:0,sc:'#000000',gr:false,col2:'#ff4f9a',ga:90,ws:0,ind:0,cc:1,al:'left',va:'start',vert:false,bend:0,wr:false,wm:1}}
const cur=()=>S.els.find(e=>e.id==S.sel),T=o=>o=='*'?cur():o?S[o]:S;
const cnt=()=>{const c={};S.els.forEach(e=>c[e.type]=(c[e.type]||0)+1);return c};
function setCounts(c){Object.keys(TY).forEach(t=>{let L=S.els.filter(e=>e.type==t);while(L.length<(c[t]||0)){const e=mk(t);e.z=topZ()+10;S.els.push(e);L.push(e)}while(L.length>(c[t]||0)){const e=L.pop();S.els=S.els.filter(x=>x!=e)}});if(!cur())S.sel=S.els[0]&&S.els[0].id}
const rn=s=>{let a=s*2654435761>>>0;return(lo=0,hi=1)=>{a=(a+0x6D2B79F5)>>>0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return lo+((t^t>>>14)>>>0)/4294967296*(hi-lo)}};
const idx=i=>{const L=FL(),k=Math.floor(i/L.length);return[L[i%L.length],Math.floor(k/4)+1,k&1,(k>>1)&1]};
// düzen üreteci: herhangi bir öğe sayısı için özyinelemeli bölme
function gen(sp){const[f,seed,fx,fy]=sp,r=rn(seed*7+f),el=S.els,out=el.map(()=>[0,0,1,1]);if(!el.length)return out;
 const it=el.map((e,i)=>[r(),{i,t:e.type,w:W[e.type]}]).filter(a=>a[1].t!='r'&&!(el[a[1].i].cid||el[a[1].i].ch||el[a[1].i].pin)).sort((a,b)=>a[0]-b[0]).map(a=>a[1]);
 const pl=(L,x,y,w,h)=>{if(!L.length)return;if(L.length==1){out[L[0].i]=[x,y,w,h];return}
  const tw=L.reduce((s,a)=>s+a.w,0),tg=r(.3,.7)*tw;let k=1,cu=L[0].w;while(k<L.length-1&&cu<tg){cu+=L[k].w;k++}
  const q=Math.min(.82,Math.max(.18,cu/tw)),A=L.slice(0,k),B=L.slice(k),side=(w*S.fmt/h)*(f&4?.6:1.5)>1.2?r()>.15:r()<.15;
  if(side){pl(A,x,y,w*q,h);pl(B,x+w*q,y,w*(1-q),h)}else{pl(A,x,y,w,h*q);pl(B,x,y+h*q,w,h*(1-q))}};
 const ex=el.map(()=>[0,0,0,0]),im=it.filter(a=>a.t=='img'),ot=it.filter(a=>a.t!='img'),gr=(L,x,y,w,h)=>{const n=L.length;if(!n)return;const c=Math.max(1,Math.min(n,Math.round(Math.sqrt(n*w*S.fmt/h*r(.7,1.3))))),rw=Math.ceil(n/c);L.forEach((a,k)=>out[a.i]=[x+(k%c)*w/c,y+Math.floor(k/c)*h/rw,w/c,h/rw])};
 if(f>=8){
  if(f==8){const hh=ot.length?(im.length?r(.2,.34):1):0;pl(ot,0,0,1,hh);gr(im,0,hh,1,1-hh)}
  else if(f==9){const T=ot.filter(a=>a.t=='t'),X=ot.filter(a=>a.t!='t'),iy=im.length?.34:0,by=X.length?.3:0;pl(T,0,iy+.02,1,1-iy-by-.04);gr(im,0,0,1,iy);pl(X,0,1-by,1,by)}
  else if(f==10){const n=it.length,h=Math.max(.12,Math.min(.3,1.25/n)),w=r(.45,.6);it.forEach((a,k)=>{const t=n>1?k/(n-1):0;out[a.i]=[t*(1-w),t*(1-h),w,h]})}
  else if(f==11){const tp=im.length?.3:0,bt=im.length>1?.3:0,hf=Math.ceil(im.length/2);gr(im.slice(0,hf),0,0,1,tp);gr(im.slice(hf),0,.7,1,bt);pl(ot,0,tp+.02,1,1-tp-bt-.04)}
  else if(f==12){const nc=Math.max(2,Math.min(4,im.length||2)),C=Array.from({length:nc},()=>[]);[...im,...ot].forEach((a,k)=>C[k%nc].push(a));C.forEach((L,c)=>pl(L,c/nc,0,1/nc,1))}
  else if(f==13){const B=im[0];if(B){const L=r()<.5;out[B.i]=[L?0:.38,0,.62,1];pl(it.filter(a=>a!==B),L?.66:0,0,.34,1)}else pl(it,0,0,1,1)}
  else if(f==14){const hd=it.filter(a=>'tq'.includes(a.t)),cp=it.filter(a=>'smb'.includes(a.t)),n=im.length,hh=hd.length?.16:0,ex=cp.length>n?.12:0;pl(hd,0,0,1,hh);const y0=hh+.01,h0=1-hh-ex-.02,c=Math.max(1,Math.min(n||1,Math.round(Math.sqrt((n||1)*S.fmt*r(.6,1.2)*h0)))),ch=h0/(Math.ceil(n/c)||1);im.forEach((a,k)=>{const x=(k%c)/c,y=y0+Math.floor(k/c)*ch,p=cp[k];out[a.i]=[x,y,1/c,p?ch*.72:ch];if(p)out[p.i]=[x,y+ch*.74,1/c,ch*.26]});pl(cp.slice(n),0,1-ex,1,ex||1)}
  else if(f==15){const H=it.filter(a=>'ts'.includes(a.t)),B=ot.filter(a=>!'ts'.includes(a.t)),hh=H.length?r(.26,.38):0,bh=B.length?.18:0;pl(H,0,0,1,hh);gr(im,0,hh+.02,1,1-hh-bh-.04);pl(B,0,1-bh,1,bh)}
  else if(f==16){const n=im.length;im.forEach((a,k)=>{const t=n>1?k/(n-1):.5;out[a.i]=[.1+t*.4+r(-.05,.05),.08+(k%2)*.25+r(0,.1),r(.38,.55),r(.28,.4)];ex[a.i][0]=r(-9,9)});pl(ot,0,.62,1,.36)}
  else if(f==17){const T=ot.filter(a=>a.t=='t'),X=ot.filter(a=>a.t!='t');T.forEach((a,k)=>{out[a.i]=[0,k*.3,1,.34];ex[a.i][2]=-r(0,5)});gr(im,0,.38,.5,.6);pl(X,.52,.38,.48,.6)}
  else if(f==18){const n=it.length,h=Math.max(.12,Math.min(.3,1.25/n)),w=r(.45,.6),g=r(-12,12);it.forEach((a,k)=>{const t=n>1?k/(n-1):0;out[a.i]=[t*(1-w),t*(1-h),w,h];ex[a.i][0]=g})}
  else if(f==19){const c=[[.05,.05],[.52,.1],[.08,.55],[.5,.52]];im.forEach((a,k)=>{const q=c[k%4];out[a.i]=[q[0],q[1],.42,.38];ex[a.i][0]=r(-6,6)});pl(ot,.2,.4,.6,.2)}
  else if(f==20){const B=ot.filter(a=>a.t=='b'),X=ot.filter(a=>a.t!='b'),hh=X.length?.28:0;pl(X,0,0,1,hh);gr(im,0,hh,.3,1-hh);pl(B,.32,hh,.68,1-hh)}
  else if(f==21){const T=ot.filter(a=>a.t=='t');T.forEach(a=>{out[a.i]=[0,0,.2,1];ex[a.i][3]=1});gr(im,.24,0,.76,.6);pl(ot.filter(a=>a.t!='t'),.24,.62,.76,.38)}
  else if(f==22){const T=ot.filter(a=>a.t=='t'),M=ot.filter(a=>a.t=='m'),X=ot.filter(a=>a.t!='t'&&a.t!='m');if(im[0])out[im[0].i]=[0,0,1,1];im.slice(1).forEach((a,k)=>out[a.i]=[.72,.3+k*.2,.24,.18]);pl(T,0,0,1,.2);pl(M,0,.21,1,.04);pl(X,0,.55,.55,.42)}
  else if(f==23){if(im[0])out[im[0].i]=[.12,.16,.76,.64];im.slice(1).forEach((a,k)=>out[a.i]=[k%2?.62:.04,.7,.34,.26]);pl(ot.filter(a=>a.t=='t'),0,0,1,.2);pl(ot.filter(a=>a.t!='t'),0,.82,1,.16)}
  else if(f==24){pl(ot.filter(a=>a.t=='t'),0,.2,1,.45);pl(ot.filter(a=>a.t!='t'),0,.68,.6,.3);gr(im,.62,.68,.38,.3)}
  else if(f==25){const T=ot.filter(a=>a.t=='t'),X=ot.filter(a=>a.t!='t');T.forEach((a,k)=>{if(k==0){out[a.i]=[.45,0,.07,1];ex[a.i][3]=1}else out[a.i]=[.54,.62,.44,.2]});if(im[0])out[im[0].i]=[.52,0,.48,.6];im.slice(1).forEach((a,k)=>out[a.i]=[.02,.05+k*.2,.4,.18]);pl(X,.02,.4,.41,.55)}
  else{if(im[0])out[im[0].i]=[0,0,1,.72];im.slice(1).forEach((a,k)=>out[a.i]=[.02+k*.2,.52,.18,.2]);pl(ot.filter(a=>a.t=='t'),0,.74,1,.14);pl(ot.filter(a=>a.t!='t'),0,.89,1,.1)}
 }else{let rest=it,A=[0,0,1,1];const bl=(f&2)&&it.find(a=>a.t=='img');
 if(bl){out[bl.i]=[0,0,1,1];rest=it.filter(a=>a!==bl);A=[.05,.05,.9,.9]}
 else if(f&1){const H=it.filter(a=>'tsm'.includes(a.t));if(H.length&&H.length<it.length){const hh=r(.17,.27);pl(H,0,0,1,hh);rest=it.filter(a=>!H.includes(a));A=[0,hh+.02,1,.98-hh]}}
 if(rest.length)pl(rest,...A)}
 el.forEach((e,i)=>{if(e.type=='r'){{const sw=r(.25,.6),sh=r(.15,.4);out[i]=[r(0,1-sw),r(0,1-sh),sw,sh]}if(f>=16)ex[i][0]=r(-15,15)}});
 return out.map(([x,y,w,h],i)=>[fx?1-x-w:x,fy?1-y-h:y,w,h,ex[i][0]*(fx?-1:1),ex[i][1],ex[i][2],ex[i][3]])}
function lay(sp){const{cols,rows}=S;return gen(sp).map(([x,y,w,h,rt,dx,dy,vt])=>{const c=Math.min(Math.round(x*cols),cols-1),r=Math.min(Math.round(y*rows),rows-1),c2=Math.min(cols,Math.max(c+1,Math.round((x+w)*cols))),r2=Math.min(rows,Math.max(r+1,Math.round((y+h)*rows)));const a=[c+1,r+1,c2-c,r2-r];a.ex=[rt||0,dx||0,dy||0,vt||0];return a})}
const gp=e=>{let[c,r,cs,rs]=e.pos;c=cl(c,1,S.cols);r=cl(r,1,S.rows);return[c,r,cl(cs,1,S.cols-c+1),cl(rs,1,S.rows-r+1)]};
function geo(e,W){if(e.fr){const k=W/100;return[e.fr[0]*k,e.fr[1]*k,e.fr[2]*k,e.fr[3]*k]}const H=W/S.fmt,u=W/100,m=S.mar*u,g=S.gut*u,cw=(W-2*m-(S.cols-1)*g)/S.cols,rh=(H-2*m-(S.rows-1)*g)/S.rows,[c,r,cs,rs]=gp(e);return[m+(c-1)*(cw+g),m+(r-1)*(rh+g),cs*cw+(cs-1)*g,rs*rh+(rs-1)*g]}
const fnt=(e,px)=>`${e.it?'italic ':''}${e.fw} ${px}px "${e.ff}"`,SC=document.createElement('canvas').getContext('2d');
const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
const TT={upper:'uppercase',lower:'lowercase',cap:'capitalize'};
const tcf=(e,t)=>e.tc=='upper'?t.toLocaleUpperCase('tr-TR'):e.tc=='lower'?t.toLocaleLowerCase('tr-TR'):e.tc=='cap'?t.replace(/(^|\s)(\S)/g,(m,a,b)=>a+b.toLocaleUpperCase('tr-TR')):t;
const txfx=e=>(e.sx||e.sy||e.sb?`text-shadow:${e.sx}cqw ${e.sy}cqw ${e.sb}cqw ${rgba(e.scol,.55)};`:'')+(e.sw?`-webkit-text-stroke:${e.sw}cqw ${e.sc};`:'')+(e.gr?`background:linear-gradient(${e.ga}deg,${e.col},${e.col2});-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;`:'');
const bsh=e=>e.sx||e.sy||e.sb?`box-shadow:${e.sx}cqw ${e.sy}cqw ${e.sb}cqw ${rgba(e.scol,.5)};`:'';
const ifl=e=>`${e.duo?'grayscale(100%)':'grayscale('+e.gray+'%)'} contrast(${e.con}%) brightness(${e.bri}%) sepia(${e.sep}%) saturate(${e.sat}%) hue-rotate(${e.hue}deg) blur(${e.blr}cqw) invert(${e.inv}%)${window.v4efl?v4efl(e):''}`;
const GRN="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const fxo=()=>(S.grain?`<div class="fxo" style="background-image:${GRN};mix-blend-mode:overlay;opacity:${S.grain/100}"></div>`:'')+(S.vig?`<div class="fxo" style="background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,${S.vig/100}) 100%)"></div>`:'');
const noise=()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),q=g.createImageData(256,256);for(let i=0;i<q.data.length;i+=4){q.data[i]=q.data[i+1]=q.data[i+2]=Math.random()*255;q.data[i+3]=255}g.putImageData(q,0,0);return c};
const FXT={Neon:{sb:2.4,sx:0,sy:0,scol:'#39ff14',sw:0,gr:false},Gölge:{sb:1,sx:.5,sy:.8,scol:'#000000',sw:0,gr:false},Kontur:{sw:.14,sc:'#000000',sb:0,sx:0,sy:0,gr:false},Retro:{sb:0,sx:.7,sy:.7,scol:'#ff4f5e',sw:0,gr:false},Gradyan:{gr:true,col2:'#ff4f9a',ga:90,sb:0,sx:0,sy:0},Temiz:{sb:0,sx:0,sy:0,sw:0,gr:false}};
const FXI={Sepya:{sep:80,sat:110,gray:0,duo:false},Duoton:{duo:true},Soluk:{sat:60,con:85,bri:110,duo:false},Canlı:{sat:150,con:115,duo:false},Negatif:{inv:100},Gölge:{sb:2,sx:.6,sy:.9,scol:'#000000'},Temiz:{sep:0,sat:100,hue:0,blr:0,inv:0,duo:false,gray:0,con:100,bri:100,sb:0,sx:0,sy:0}};
function wrap(x,e,w,n){const cw=(w-(n-1)*S.gut*(x.u||1))/n,L=[],ind=(e.ind||0)*(x.fs||0);L.first=new Set();L.last=new Set();
 tk(e.tg&&e.dt!=null?e.dt:e.txt).split('\n').forEach(p=>{let ln='',fst=1;L.first.add(L.length);p.split(' ').forEach(wd=>{const t=ln?ln+' '+wd:wd;if(ln&&x.measureText(tcf(e,t)).width>cw-(fst?ind:0)){L.push(ln);fst=0;ln=wd}else ln=t});L.push(ln);L.last.add(L.length-1)});return L}
function fit(e){if(e.nf)return;let[,,w,h]=geo(e,100);if(e.vert)[w,h]=[h,w];SC.u=1;
 for(let f=e.type=='t'?60:'sq'.includes(e.type)?9:e.fs,lo='mb'.includes(e.type)?1.2:1;f>lo;f-=.5){e.fs=f;SC.font=fnt(e,f);SC.fs=f;if('wordSpacing'in SC)SC.wordSpacing=(e.ws||0)*f+'px';if('letterSpacing'in SC)SC.letterSpacing=e.ls*f+'px';const L=wrap(SC,e,w,e.cc);if(L.length*e.lh*f<=h*e.cc&&L.every(l=>SC.measureText(tcf(e,l)).width<=w/e.cc+.1))return}}
const fitAll=()=>{if(S.af)S.els.forEach(e=>{if('tsqmb'.includes(e.type=='img'||e.type=='r'?'-':e.type))fit(e)})};
const txe=()=>S.els.filter(e=>e.type!='img'&&e.type!='r'),loadF=()=>Promise.all(txe().map(e=>document.fonts.load(fnt(e,20),e.txt).catch(()=>0)));
function apply(sp){S.sp=sp;const o=lay(sp);S.els.forEach((e,i)=>{e.pos=o[i];e.on=true;const q=o[i].ex;e.rot=q[0];e.dx=q[1];e.dy=q[2];if('tsbmq'.includes(e.type=='img'||e.type=='r'?'-':e.type))e.vert=!!q[3];if(e.type=='b'){const f=e.pos[2]/S.cols;e.cc=e.txt.length<180?1:f>.8?3:f>.45?2:1}});fitAll();render();thumbs();hist();loadF().then(()=>{fitAll();render()})}
function sty(i){S.st=i;const s=STY[i];S.bg=s.bg;S.els.forEach(e=>{if(e.type=='img')return;e.ff=e.type=='t'||e.type=='q'?s.t:e.type=='m'?'IBM Plex Mono':s.b;e.col='sqr'.includes(e.type)?s.ac:s.tx});S.pc=null;fitAll();render();hist();loadF().then(()=>{fitAll();render()})}
// kontrol üreticiler
const R=(o,p,l,a,b,s,x='')=>`<label class="f"><span>${l}<output></output></span><input type="range" data-o="${o}" data-p="${p}" min="${a}" max="${b}" step="${s}" ${x}></label>`;
const O=(o,p,l,op,x='')=>`<label class="f"><span>${l}</span><select data-o="${o}" data-p="${p}" ${x}>${op.map(q=>{q=Array.isArray(q)?q:[q,q];return `<option value="${q[0]}">${q[1]}</option>`}).join('')}</select></label>`;
const C=(o,p,l)=>`<label class="f"><span>${l}</span><input type="color" data-o="${o}" data-p="${p}"></label>`;
const Kc=(o,p,l)=>`<label><input type="checkbox" data-o="${o}" data-p="${p}"> ${l}</label>`;
const PS=o=>`<div class="pos">`+['Sütun','Satır','Genişlik','Yükseklik'].map((n,i)=>`<label>${n}<input type="number" min="1" max="16" data-o="${o}" data-p="pos" data-i="${i}"></label>`).join('')+`</div>`;
const D=(t,b,open)=>`<details${open?' open':''}><summary>${t}</summary><div class="bd">${b}</div></details>`;
const FO=()=>`<label class="f"><span>Yazı tipi</span><select data-o="*" data-p="ff">${Object.entries(FC).map(([g,L])=>`<optgroup label="${g}">${L.map(f=>`<option style="font-family:'${f}'">${f}</option>`).join('')}</optgroup>`).join('')}</select></label>`;
const fo=q=>`<option value="${q[0]}" data-w="${q[2]}" data-h="${q[3]}">${q[1]}</option>`;
const PT=['Düzen','Öğeler','Tasarım'];
let P=`<div class="seg" id="pts" style="--n:3">${PT.map((n,i)=>`<button data-pt="${i}">${n}</button>`).join('')}<i class="pill"></i></div>`;
P+=`<div class="pt" data-p2="0"><label class="f"><span>Düzen türü</span><select id="modesel">${Object.keys(MODES).map(k=>`<option value="${k}">${MODES[k].n}</option>`).join('')}</select></label><label class="cta" for="file0"><b>📸 Görselini bırak</b><span>Yükle: en uygun düzen ve renkler kendiliğinden gelsin</span></label><input type="file" id="file0" accept="image/*" multiple hidden>`
 +D('✨ Öneriler',`<button class="b ai" id="ai">✨ İçeriğime göre öner</button><div id="sg"></div>`,true)+D('Düzen galerisi <small id="gc"></small>',`<div id="th"></div><div class="row"><button class="b" id="shuf">🎲 Karıştır</button><button class="b" id="sur">✨ Sürpriz</button></div>`,true)+`</div>`;
P+=`<div class="pt" data-p2="1" hidden>`+D('Öğe ekle',`<div class="addg">`+Object.keys(TY).map(t=>`<button class="b" data-add="${t}">${TY[t][0]} ${TY[t][1]}</button>`).join('')+`</div>`+O('','pre','Hazır kurgu',[['','Bir kurgu seç…']])+`<div class="v3bar" id="v3bar"><div class="v3h"><b>Hizala &amp; düzenle</b><small id="v3cnt" class="mut">Seçim yok</small></div><div class="v3r"><button class="b mini v3i" data-v3="al" data-v="l" title="Sola hizala" aria-label="Sola hizala"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2v12M5 4h9v3H5zM5 9h6v3H5z"/></svg></button><button class="b mini v3i" data-v3="al" data-v="ch" title="Yatay ortala" aria-label="Yatay ortala"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12M3 4h10v3H3zM5 9h6v3H5z"/></svg></button><button class="b mini v3i" data-v3="al" data-v="r" title="Sağa hizala" aria-label="Sağa hizala"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2v12M2 4h9v3H2zM5 9h6v3H5z"/></svg></button><button class="b mini v3i" data-v3="al" data-v="t" title="Üste hizala" aria-label="Üste hizala"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2h12M4 5v9h3V5zM9 5v6h3V5z"/></svg></button><button class="b mini v3i" data-v3="al" data-v="cv" title="Dikey ortala" aria-label="Dikey ortala"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12M4 3v10h3V3zM9 5v6h3V5z"/></svg></button><button class="b mini v3i" data-v3="al" data-v="b" title="Alta hizala" aria-label="Alta hizala"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14h12M4 2v9h3V2zM9 5v6h3V5z"/></svg></button><button class="b mini v3i" data-v3="ds" data-v="h" title="Yatay eşit dağıt" aria-label="Yatay eşit dağıt"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2v12M14 2v12M6 4h4v8H6z"/></svg></button><button class="b mini v3i" data-v3="ds" data-v="v" title="Dikey eşit dağıt" aria-label="Dikey eşit dağıt"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2h12M2 14h12M4 6h8v4H4z"/></svg></button></div><select id="v3to" class="wni v3s" aria-label="Hizalama hedefi"><option value="auto">Hedef: otomatik</option><option value="sel">Seçime göre</option><option value="page">Sayfaya göre</option><option value="mar">Kenar boşluğuna göre</option></select><div class="v3r w"><button class="b mini" id="v3tm" data-v3="tm" title="Dokunmatik: dokunduklarını seçime ekler">☑ Çoklu seç</button><button class="b mini" data-v3="gp" data-v="g" title="Ctrl+G">⛓ Grupla</button><button class="b mini" data-v3="gp" data-v="u" title="Ctrl+Shift+G">Çöz</button><button class="b mini" data-v3="mkc">◆ Bileşen yap</button><button class="b mini" data-v3="pno">＃ Sayfa no</button><button class="b mini" data-v3="pnoall" title="Tüm sayfalara numara ekle">＃ Tüm sayfalara</button><button class="b mini" id="v3safe" data-v3="safe">🛡 Güvenli alan</button></div><div class="v3r w v3nd" aria-label="Seçimi kaydır"><button class="b mini" data-v3="nd" data-v="l" aria-label="Sola kaydır">◀</button><button class="b mini" data-v3="nd" data-v="u" aria-label="Yukarı kaydır">▲</button><button class="b mini" data-v3="nd" data-v="d" aria-label="Aşağı kaydır">▼</button><button class="b mini" data-v3="nd" data-v="r" aria-label="Sağa kaydır">▶</button></div><p class="mut v3t">Shift/Ctrl+tıkla: çoklu seçim · Ctrl+A: tümü · Ctrl+G: grupla · Ok tuşları: seçimi kaydır</p></div><details class="v3d"><summary>◆ Bileşenler &amp; ana sayfa</summary><div class="bd"><div id="v3comps"></div></div></details><details class="v3d"><summary>Aa Metin stilleri</summary><div class="bd"><div id="v3styles"></div><small class="mut">Bir metni seçip “Seçili öğe” bölümünden stil kaydedebilirsin.</small></div></details><h3>Katmanlar <small class="mut">üstteki öndedir · sürükle, 🔒 kilitle, çift tıkla adlandır · Shift/Ctrl ile çoklu seç</small></h3><div class="row"><button class="b mini" id="lall">👁 Hepsini göster</button><button class="b mini" id="lunl">🔓 Kilitleri aç</button></div><div id="el"></div>`,true)+D('Seçili öğe',`<div class="bd" id="ed"></div>`,true)+`</div>`;
P+=`<div class="pt" data-p2="2" hidden>`+D('Renk paletleri',`<div id="pal" class="pal"></div>`+C('','bg','Arka plan rengi')+`<div class="ck">`+Kc('','auto','Görsel yüklenince otomatik tasarla')+`</div>`,true)
 +D('Sayfa efektleri',R('','grain','Film greni',0,100,1)+R('','vig','Vinyet',0,100,1))+D('Yazı stili',O('','sty','Font ve renk teması',[['','Bir stil seç…'],...STY.map((s,i)=>[i,s.n])])+`<div class="ck">`+Kc('','af','Başlığı alana otomatik sığdır')+`</div>`)
 +D('Sayfa boyutu ve grid',`<label class="f"><span>Format</span><select data-o="" data-p="fmt" data-n="1" data-rl="1">${fo([0.707,'A4 dikey',210,297])}</select></label><div class="pos" style="grid-template-columns:1fr 1fr"><label>En (mm)<input type="number" id="mw" min="20" max="5000"></label><label>Boy (mm)<input type="number" id="mh" min="20" max="5000"></label></div>`
 +R('','cols','Sütun sayısı',1,12,1,'data-rl="1"')+R('','rows','Satır sayısı',1,48,1,'data-rl="1"')+R('','mar','Kenar boşluğu',0,15,.5)+R('','gut','Oluk (gutter)',0,6,.25)+`<div class="ck">`+Kc('','grid','Grid çizgilerini göster')+`</div>`)+`</div>`;
$('pn').innerHTML=P;
function ed(){const e=cur(),h=$('ed');if(!e){h.innerHTML='<p>Bir öğe ekle veya tuvalde seç.</p>';return}let a,m='',f='',v='';
 const dt=(t,b)=>b?`<details class="adv"><summary>${t}</summary><div class="bd">${b}</div></details>`:'',sh=`<div class="ck">`+Kc('*','on','Göster')+`</div>`,fxr=M=>`<div class="chips">`+Object.keys(M).map(k=>`<button class="chip" data-fx="${k}">${k}</button>`).join('')+`</div>`,
 shd=R('*','sb','Gölge / parıltı bulanıklığı',0,6,.1)+R('*','sx','Gölge yatay',-3,3,.1)+R('*','sy','Gölge dikey',-3,3,.1)+C('*','scol','Gölge rengi');
 if(e.type=='img'){a=`<input type="file" id="file" accept="image/*" multiple><div class="row"><button class="b" data-act="rm">Kaldır</button><button class="b" data-act="repl">🔁 Tüm projede değiştir</button></div><input type="file" id="replf" accept="image/*" hidden>`+O('*','fit','Yerleşim',[['cover','Kırp'],['contain','Sığdır'],['fill','Esnet']])+sh;
  f=fxr(FXI)+R('*','gray','Siyah-beyaz %',0,100,1)+R('*','con','Kontrast %',30,250,1)+R('*','bri','Parlaklık %',30,200,1)+R('*','sep','Sepya %',0,100,1)+R('*','sat','Doygunluk %',0,300,1)+R('*','hue','Renk tonu °',-180,180,1)+R('*','blr','Bulanıklık',0,4,.05)+R('*','inv','Negatif %',0,100,1)+`<div class="ck">`+Kc('*','duo','Duoton')+`</div>`+C('*','d1','Duoton koyu')+C('*','d2','Duoton açık')+O('*','blend','Karışım modu',window.v4BLN||['normal'])+R('*','lb','Katman bulanıklığı',0,4,.05)+(window.v4fxi?v4fxi():'')+shd;
  v=R('*','zm','Görsel yakınlaştırma (kırpma)',1,6,.01)+R('*','fx','Yatay odak %',0,100,1)+R('*','fy','Dikey odak %',0,100,1)+R('*','rad','Köşe yuvarlama %',0,50,1)}
 else if(e.type=='r'){const dr=e.shape=='draw';a=(dr?R('*','sw2','Çizgi kalınlığı (0 = çizgi yok)',0,8,.05)+C('*','col','Çizgi rengi')+O('*','dash','Çizgi stili',[['','Düz'],['d','Kesikli'],['o','Noktalı']])+O('*','cap','Uç biçimi',[['round','Yuvarlak'],['butt','Düz'],['square','Kare']])+O('*','jn','Köşe biçimi',[['round','Yuvarlak'],['miter','Sivri'],['bevel','Pahlı']])+O('*','ar','Ok ucu (açık yol)',[['','Yok'],['1','Bitiş'],['2','İki uç']])+`<div class="ck">`+Kc('*','fon','Dolgu')+`</div>`+C('*','fl','Dolgu rengi'):O('*','shape','Şekil',[['rect','Dikdörtgen'],['circle','Daire'],['tri','Üçgen'],['line','Çizgi']])+C('*','col','Renk'))+sh;f=(window.v4fxr?v4fxr(e):'')+shd;v=dr?'':R('*','rad','Köşe yuvarlama %',0,50,1)}
 else{a=`<label class="f"><span>Metin</span><textarea rows="${e.type=='b'?5:2}" data-o="*" data-p="txt"></textarea></label>`+FO()+R('*','fs','Boyut',.5,60,.1)+R('*','fw','Kalınlık',100,900,100)+C('*','col','Renk')+sh;
  m=O('*','al','Hizalama',[['left','Sola'],['center','Ortala'],['right','Sağa'],['justify','İki yana yasla']])+O('*','tc','Harf biçimi',[['none','Normal'],['upper','BÜYÜK HARF'],['lower','küçük harf'],['cap','İlk Harf Büyük']])+R('*','lh','Satır aralığı',.6,2.4,.05)+R('*','ls','Harf aralığı (em)',-.1,.5,.01)+R('*','ws','Kelime aralığı (em)',-.3,1,.01)+R('*','ind','İlk satır girintisi (em)',0,5,.1)+R('*','cc','Yazı sütunu',1,6,1)+O('*','va','Dikey hizalama',[['start','Üst'],['center','Orta'],['end','Alt']])+`<div class="ck">`+Kc('*','it','İtalik')+Kc('*','vert','Dikey')+`</div>`+R('*','bend','Yay / kavis (yazıyı eğri üzerine yerleştirir)',-100,100,1)+`<div class="ck">`+Kc('*','wr','Üstteki nesnelerin etrafında sar')+`</div>`+R('*','wm','Sarma boşluğu',0,8,.25);
  f=fxr(FXT)+R('*','sw','Kontur kalınlığı',0,1.5,.02)+C('*','sc','Kontur rengi')+shd+`<div class="ck">`+Kc('*','gr','Gradyan yazı')+`</div>`+C('*','col2','Gradyan 2. renk')+R('*','ga','Gradyan açısı °',0,360,1)+(window.v4fxt?v4fxt(e):'')}
 v+=R('*','op','Saydamlık %',0,100,1)+R('*','rot','Döndür °',-180,180,1)+R('*','dx','Yatay kaydır',-60,60,.5)+R('*','dy','Dikey kaydır',-60,60,.5)+'<h3>Grid konumu</h3>'+PS('*');
 h.innerHTML=a+dt('Mizanpaj',m)+dt('✨ Efektler',f)+dt('Gelişmiş',v)+`<div class="row"><button class="b" data-act="fwd" title="] tuşu">▲ Öne</button><button class="b" data-act="bwd" title="[ tuşu">▼ Arkaya</button><button class="b" data-act="front" title="Ctrl+]">⇈ En öne</button><button class="b" data-act="back" title="Ctrl+[">⇊ En arkaya</button></div><div class="row"><button class="b" data-act="dup">⧉ Çoğalt</button><button class="b" data-act="del">🗑 Sil</button></div>`;sync()}
function list(){const c={},nm={};S.els.forEach(e=>{c[e.type]=(c[e.type]||0)+1;nm[e.id]=e.nm||TY[e.type][1]+' '+c[e.type]});
 $('el').innerHTML=zs().reverse().map(e=>`<div class="el${e.id==S.sel?' on':''}${e.on?'':' off'}${e.lock?' lk':''}" draggable="true" data-sel="${e.id}" data-lid="${e.id}"><i class="grip">⋮⋮</i><b>${e.type=='img'&&e.src?`<img class="lth" src="${e.src}" alt="">`:TY[e.type][0]}</b><span class="ln">${esc(nm[e.id])}</span><button class="lb" data-lv="${e.id}" title="Göster / gizle" aria-label="Göster veya gizle">${e.on?'👁':'🚫'}</button><button class="lb" data-lk="${e.id}" title="Kilitle" aria-label="Kilitle">${e.lock?'🔒':'🔓'}</button><button class="lb" data-lu="${e.id}" title="Bir öne" aria-label="Öne al">▲</button><button class="lb" data-ld="${e.id}" title="Bir arkaya" aria-label="Arkaya al">▼</button><button class="x" data-del="${e.id}" aria-label="Sil">×</button></div>`).join('')||'<p class="mut">Henüz katman yok.</p>'}
const byId=id=>S.els.find(e=>e.id==id),reord=L=>{L.forEach((e,i)=>e.z=i*10)};
function lmove(id,d){const L=zs(),i=L.findIndex(e=>e.id==id);if(i<0)return;const j=d=='front'?L.length-1:d=='back'?0:Math.max(0,Math.min(L.length-1,i+d));if(j==i)return;const[x]=L.splice(i,1);L.splice(j,0,x);reord(L);render();list();hist()}
function lockfx(){S.els.forEach(e=>{if(!e.lock)return;const n=$('cv').querySelector('[data-id="'+e.id+'"]');if(n)n.style.pointerEvents='none'})}
let LDRAG=null;
$('el').addEventListener('click',e=>{const t=e.target;let b,x;
 if(b=t.closest('[data-lv]')){e.stopPropagation();x=byId(+b.dataset.lv);x.on=!x.on;render();list();ed();hist();return}
 if(b=t.closest('[data-lk]')){e.stopPropagation();x=byId(+b.dataset.lk);x.lock=!x.lock;render();list();hist();toast(x.lock?'Katman kilitlendi':'Kilit açıldı');return}
 if(b=t.closest('[data-lu]')){e.stopPropagation();lmove(+b.dataset.lu,1);return}
 if(b=t.closest('[data-ld]')){e.stopPropagation();lmove(+b.dataset.ld,-1);return}});
const lren=n=>{const row=n.closest('[data-lid]'),x=byId(+row.dataset.lid),inp=document.createElement('input');inp.className='wni lrn';inp.value=n.textContent;n.replaceWith(inp);inp.focus();inp.select();let done=0;
 const ok=()=>{if(done)return;done=1;x.nm=inp.value.trim()||null;list();hist()};inp.onkeydown=ev=>{ev.stopPropagation();if(ev.key=='Enter')ok();if(ev.key=='Escape'){done=1;list()}};inp.onblur=ok;inp.onclick=ev=>ev.stopPropagation()};$('el').addEventListener('dblclick',e=>{const n=e.target.closest('.ln');if(n)lren(n)});let LC=[0,0];
$('el').addEventListener('dragstart',e=>{const r=e.target.closest&&e.target.closest('[data-lid]');if(!r)return;LDRAG=+r.dataset.lid;e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain','layer')}catch(x){}r.classList.add('drag')});
$('el').addEventListener('dragover',e=>{if(LDRAG==null)return;e.preventDefault();const r=e.target.closest('[data-lid]');document.querySelectorAll('#el .dt,#el .db').forEach(n=>n.classList.remove('dt','db'));if(r&&+r.dataset.lid!=LDRAG){const b=r.getBoundingClientRect();r.classList.add(e.clientY<b.top+b.height/2?'dt':'db')}});
$('el').addEventListener('drop',e=>{if(LDRAG==null)return;e.preventDefault();const r=e.target.closest('[data-lid]');if(r&&+r.dataset.lid!=LDRAG){const b=r.getBoundingClientRect(),up=e.clientY<b.top+b.height/2,L=zs(),a=byId(LDRAG),t=byId(+r.dataset.lid);L.splice(L.indexOf(a),1);let k=L.indexOf(t);if(up)k+=1;L.splice(k,0,a);reord(L);render();hist()}LDRAG=null;list()});
$('el').addEventListener('dragend',()=>{LDRAG=null;list()});
$('el').addEventListener('mouseover',e=>{const r=e.target.closest('[data-lid]');document.querySelectorAll('#cv .hov').forEach(n=>n.classList.remove('hov'));if(r){const n=$('cv').querySelector('[data-id="'+r.dataset.lid+'"]');if(n)n.classList.add('hov')}});
$('el').addEventListener('mouseleave',()=>document.querySelectorAll('#cv .hov').forEach(n=>n.classList.remove('hov')));
document.addEventListener('click',e=>{if(e.target.id=='lall'){S.els.forEach(x=>x.on=true);render();list();ed();hist()}if(e.target.id=='lunl'){S.els.forEach(x=>x.lock=false);render();list();hist();toast('Tüm kilitler açıldı')}});
$('ed').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const k=b.dataset.act,m={fwd:1,bwd:-1,front:'front',back:'back'}[k];if(m!==undefined&&S.sel!=null){e.stopPropagation();lmove(S.sel,m)}});
document.addEventListener('keydown',e=>{if($('edw').hidden||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||S.sel==null)return;const x=byId(S.sel);if(!x)return;
 if(e.key==']'||e.key=='['){e.preventDefault();lmove(S.sel,(e.ctrlKey||e.metaKey)?(e.key==']'?'front':'back'):(e.key==']'?1:-1))}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()=='l'){e.preventDefault();x.lock=!x.lock;render();list();hist()}
 if((e.key=='Delete'||e.key=='Backspace')&&x.lock){e.stopImmediatePropagation();toast('Katman kilitli')}},true);
function sync(){document.querySelectorAll('#pn [data-p]').forEach(t=>{if(t===document.activeElement)return;const d=t.dataset,o=T(d.o);if(!o)return;const v=d.i!==undefined?o[d.p][+d.i]:o[d.p];if(t.type=='checkbox')t.checked=!!v;else t.value=v;const out=t.parentElement.querySelector('output');if(out)out.textContent=v})}
const zOf=e=>e.z!=null?e.z:({r:0,img:1}[e.type]??2)*1e6+e.id,zs=()=>[...S.els].sort((a,b)=>zOf(a)-zOf(b)),topZ=()=>Math.max(0,...S.els.map(zOf));
function render(){const cv=$('cv');cv.style.setProperty('--r',S.fmt);cv.style.background=S.bg;
 const g=`grid-template-columns:repeat(${S.cols},1fr);grid-template-rows:repeat(${S.rows},1fr);gap:${S.gut}cqw;padding:${S.mar}cqw`;let h=`<div class="g" style="${g}">`;
 zs().forEach(e=>{if(!e.on)return;const[c,r,cs,rs]=gp(e),p=(e.fr?`position:absolute;left:${e.fr[0]}cqw;top:${e.fr[1]}cqw;width:${e.fr[2]}cqw;height:${e.fr[3]}cqw;`:`grid-column:${c}/span ${cs};grid-row:${r}/span ${rs};`)+`opacity:${e.op/100};${window.v4fxp?v4fxp(e):''}transform:translate(${e.dx}cqw,${e.dy}cqw) rotate(${e.rot+(e.vert&&e.txt!==undefined?180:0)}deg);`,sl=(e.id==S.sel?' sel':'')+(e.ov?' ovf':'');
  if(e.type=='img')h+=e.src?`<div class="e${sl}" data-id="${e.id}" style="${p}${v3mc(e)}border-radius:${e.rad||0}%;${bsh(e)}${e.duo?'background:'+e.d2+';isolation:isolate;position:relative;':''}"><img src="${e.src}" alt="" style="object-fit:${e.fit};object-position:${e.fx}% ${e.fy}%;${e.zm>1?'transform-origin:'+e.fx+'% '+e.fy+'%;transform:scale('+e.zm+');':''}filter:${ifl(e)};mix-blend-mode:${e.duo?'multiply':e.blend}">${e.duo?'<div class="duo" style="background:'+e.d1+'"></div>':''}</div>`:`<div class="e ph${sl}" data-id="${e.id}" data-act="up" style="${p}${v3mc(e)}">Görsel yükle</div>`;
  else if(e.type=='r'&&e.shape=='draw')h+=v4drawHTML(e,p,sl);
  else if(e.type=='r')h+=`<div class="e${sl}" data-id="${e.id}" style="${p}${bsh(e)}background:${window.v4gcss&&v4gcss(e)||e.col};${window.v4glass?v4glass(e):''}border-radius:${e.shape=='circle'?'50%':e.rad+'%'};${e.shape=='tri'?'clip-path:polygon(50% 0,100% 100%,0 100%);':''}${e.shape=='line'?'align-self:center;height:.6cqw;':''}"></div>`;
  else h+=`<div class="e tx${sl}" data-id="${e.id}" style="${p}font-family:'${e.ff}',Helvetica,Arial,sans-serif;font-size:${e.fs}cqw;font-weight:${e.fw};font-style:${e.it?'italic':'normal'};line-height:${e.lh};letter-spacing:${e.ls}em;text-transform:${TT[e.tc]||'none'};word-spacing:${e.ws||0}em;text-indent:${e.ind||0}em;${txfx(e)}text-align:${e.al};color:${e.col};align-self:${e.va};column-count:${window.v4flat&&v4flat(e)?'auto':e.cc};${window.v4flat&&v4flat(e)?'height:'+(Math.round(geo(e,100)[3]*100)/100)+'cqw;':''}column-gap:${S.gut}cqw;${e.vert?'writing-mode:vertical-rl;':''}">${window.v4flat&&v4flat(e)?v4txt(e):esc(tk(e.tg&&e.dt!=null?e.dt:e.txt))}</div>`});
 cv.innerHTML=h+'</div>'+fxo()+heatHTML()+sbox()+pinsHTML()+(S.grid?`<div class="g ov" style="${g}">`+'<b></b>'.repeat(S.cols*S.rows)+'</div>':'');lockfx();sync();ui();heatPaint();rpSoon()}
// galeri ve öneriler
let GN=48,GS=0,SUG=[];
const th=(sp,x='')=>`<button class="th${JSON.stringify(sp)==JSON.stringify(S.sp)?' on':''}" ${x} data-sp="${sp.join(',')}" style="--r:${S.fmt}" title="${FN[sp[0]]}"><div style="grid-template-columns:repeat(${S.cols},1fr);grid-template-rows:repeat(${S.rows},1fr)">${lay(sp).map((p,j)=>`<i class="k${S.els[j].type}" style="grid-column:${p[0]}/span ${p[2]};grid-row:${p[1]}/span ${p[3]}"></i>`).join('')}</div></button>`;
function thumbs(){const t=$('th'),st=t.scrollTop;let a='';for(let i=0;i<GN;i++)a+=th(idx((GS+i)%TOT()));t.innerHTML=a;t.scrollTop=st;
 $('sg').innerHTML=SUG.map((s,i)=>`<div class="sgi">${th(s.sp,'data-s="'+i+'"')}<span><b>✨ Yapay zekâ önerisi · ${STY[s.style].n}</b><br>${esc(s.why)}</span></div>`).join('')}
function local(){const c=cnt(),p=FL(),w=['Başlığı öne çıkaran, nefes alan bir kurgu.','Görsel ve metin dengesini koruyan bir yerleşim.','Uzun metni sütunlara bölerek okunurluğu artıran düzen.','Cesur ve grafik bir dergi sayfası hissi.'];
 return w.map(why=>({fam:p[Math.random()*p.length|0],seed:1+Math.random()*(SEEDS-1)|0,fx:Math.random()<.5?1:0,fy:Math.random()<.5?1:0,style:Math.random()*STY.length|0,why}))}
$('ai').onclick=async()=>{const b=$('ai');b.disabled=true;b.textContent='✨ Düşünüyor…';let L=null;const sm=await cap('sample'),c=cnt();
 if(sm)try{L=await sm.json(`Sen bir dergi sanat yönetmenisin. Sayfada ${c.img||0} görsel, ${c.t||0} başlık, ${c.s||0} alt başlık, ${c.b||0} paragraf (toplam ${S.els.filter(e=>e.type=='b').reduce((a,e)=>a+e.txt.length,0)} karakter), ${c.q||0} alıntı var. Tür: ${MODES[S.mode].n}. Sayfa oranı ${S.fmt}. Düzen aileleri: ${FL().map(i=>i+'='+FN[i]).join(', ')} (tam sayfa görselliler ilk görseli arka plan yapar, bantlılar başlığı üst banda alır). Stiller: ${STY.map((s,i)=>i+'='+s.n).join(', ')}. Birbirinden farklı 4 öneri ver. Yalnızca JSON dizisi döndür: [{"fam":listedeki bir sayı,"seed":1-${SEEDS},"fx":0|1,"fy":0|1,"style":0-${STY.length-1},"why":"tek cümle Türkçe gerekçe"}]`,{modelTier:'quick',cache:false})}catch(e){L=null}
 if(!Array.isArray(L))L=local();
 SUG=L.slice(0,4).map(s=>({sp:[FL().includes(s.fam|0)?s.fam|0:FL()[0],cl(s.seed,1,SEEDS)|0,s.fx?1:0,s.fy?1:0],style:cl(s.style,0,STY.length-1)|0,why:String(s.why||'')}));
 b.disabled=false;b.textContent='✨ Yeni öneriler al';sty(SUG[0].style);apply(SUG[0].sp)};
// olaylar
function pick(id){S.sel=id;list();ed();render();showPt(1)}
function add(t){if(S.els.filter(e=>e.type==t&&e.shape!='draw').length>=MAXN)return;const e=mk(t);S.els.push(e);S.sel=e.id;apply(S.sp);list();ed()}
function del(id){S.els=S.els.filter(e=>e.id!=id);if(S.sel==id)S.sel=S.els[0]&&S.els[0].id;apply(S.sp);list();ed()}
$('pn').addEventListener('input',e=>{const t=e.target,d=t.dataset;if(!d.p)return;
 if(d.p=='sty'){if(t.value!=='')sty(+t.value);return}
 if(d.p=='pre'){if(t.value!==''){setCounts(MODES[S.mode].pre[+t.value][1]);apply(S.sp);list();ed()}return}
 const o=T(d.o);if(!o)return;const v=t.type=='checkbox'?t.checked:(t.type=='range'||t.type=='number'||d.n)?+t.value:t.value;
 if(d.i!==undefined)o[d.p][+d.i]=v;else o[d.p]=v;
 const out=t.parentElement.querySelector('output');if(out)out.textContent=v;
 if(d.p=='fmt'){const o2=t.selectedOptions[0];S.mm=[+o2.dataset.w,+o2.dataset.h]}
 if(d.rl)apply(S.sp);else{if(d.p=='af'&&v)fitAll();if(d.p=='txt')list();render()}});
async function files(F,first){F=F.filter(f=>f.type.startsWith('image/'));if(!F.length)return;toast('Görseller hazırlanıyor…');
 const L=(await Promise.all(F.map(loadImg))).filter(Boolean);if(!L.length)return toast('Görsel okunamadı');
 const tg=[...(first&&first.type=='img'?[first]:[]),...S.els.filter(x=>x.type=='img'&&!x.src&&x!==first)];let add=0,f0=null;
 L.forEach((o,i)=>{let x=tg[i];if(!x){x=mk('img');S.els.push(x);tg.push(x);add=1}x.src=o.url;x.im=getIm(o.url);S.sel=x.id;if(i==0)f0=x});
 if(add)apply(S.sp);else{render();hist()}list();ed();toast(L.length+' görsel eklendi');if(S.auto&&f0)setTimeout(()=>autoDesign(f0),0)}
$('pn').addEventListener('change',e=>{if(e.target.id=='file')files([...e.target.files],cur());else if(e.target.id=='replf')replaceAll(e.target.files[0]);else hist()});
$('pn').addEventListener('click',e=>{const t=e.target,pt=t.closest('[data-pt]');if(pt)return showPt(+pt.dataset.pt);const fx=t.closest('[data-fx]');if(fx){Object.assign(cur(),(cur().type=='img'?FXI:FXT)[fx.dataset.fx]);render();ed();hist();return}const pl2=t.closest('[data-pal]');if(pl2){const q=pl2.dataset.pal=='i'?[0,...S.imgPal]:PALS[+pl2.dataset.pal];return pal(q[1],q[2],q[3])}const a=t.closest('[data-add]');if(a)return add(a.dataset.add);
 const d=t.closest('[data-del]');if(d)return del(+d.dataset.del);
 const s=t.closest('[data-sel]');if(s){const id=+s.dataset.sel,now=Date.now();if(t.closest('.ln')&&LC[0]==id&&now-LC[1]<450){LC=[0,0];const n=$('el').querySelector('[data-lid="'+id+'"] .ln');if(n)return lren(n)}LC=[id,now];return pick(id)}
 const a2=t.dataset.act;if(a2=='del')return del(S.sel);if(a2=='dup')return dup();if(a2=='repl'){$('replf').click();return}if(a2=='rm'){const c=cur();c.src='';c.im=new Image();list();render();return}
 const b=t.closest('.th');if(b){if(b.dataset.s!==undefined&&!SUG[+b.dataset.s].keep)sty(SUG[+b.dataset.s].style);apply(b.dataset.sp.split(',').map(Number))}});
$('cv').addEventListener('click',e=>{if(moved)return;const x=e.target.closest('.e');if(x&&x.dataset.act=='up'){pick(+x.dataset.id);$('file').click()}});
$('shuf').onclick=()=>{GS=Math.random()*TOT()|0;GN=48;thumbs();$('th').scrollTop=0};
$('th').addEventListener('scroll',()=>{const t=$('th');if(t.scrollTop+t.clientHeight>t.scrollHeight-60){GN+=24;thumbs()}});
// dışa aktarma
function draw(Wd){const H=Math.round(Wd/S.fmt),c=document.createElement('canvas');c.width=Wd;c.height=H;const x=c.getContext('2d'),u=Wd/100;x.fillStyle=S.bg;x.fillRect(0,0,Wd,H);
 const rr=(X,Y,w,h,r)=>{x.beginPath();if(r>0&&x.roundRect)x.roundRect(X,Y,w,h,r);else x.rect(X,Y,w,h)},sh=e=>{if(e.sx||e.sy||e.sb){x.shadowColor=rgba(e.scol,.55);x.shadowBlur=e.sb*u;x.shadowOffsetX=e.sx*u;x.shadowOffsetY=e.sy*u}};
 zs().forEach(e=>{if(!e.on)return;let[X,Y,w,h]=geo(e,Wd);X+=e.dx*u;Y+=e.dy*u;x.save();x.globalAlpha=e.op/100;
  if(e.rot){x.translate(X+w/2,Y+h/2);x.rotate(e.rot*Math.PI/180);x.translate(-(X+w/2),-(Y+h/2))}
  if(window.v4fxc)v4fxc(x,e,u);
  if(e.type=='r'&&e.shape=='draw'){sh(e);v4drawCv(x,e,X,Y,w,h)}
  else if(e.type=='r'){if(e.bdb&&window.v4glc)v4glc(x,e,X,Y,w,h,u);sh(e);x.fillStyle=(window.v4gcv&&v4gcv(x,e,X,Y,w,h))||e.col;if(e.shape=='circle'){x.beginPath();x.ellipse(X+w/2,Y+h/2,w/2,h/2,0,0,7);x.fill()}else if(e.shape=='tri'){x.beginPath();x.moveTo(X+w/2,Y);x.lineTo(X+w,Y+h);x.lineTo(X,Y+h);x.fill()}else if(e.shape=='line')x.fillRect(X,Y+h/2-.3*u,w,.6*u);else{rr(X,Y,w,h,e.rad/100*Math.min(w,h));x.fill()}}
  else if(e.type=='img'){const I=e.im;if(I.complete&&I.naturalWidth){const rad=(e.rad||0)/100*Math.min(w,h);if(e.sx||e.sy||e.sb){x.save();sh(e);x.fillStyle=e.duo?e.d2:'#000';(v3on(e)?v3path(x,e.mask,X,Y,w,h):rr(X,Y,w,h,rad));x.fill();x.restore()}
   (v3on(e)?v3path(x,e.mask,X,Y,w,h):rr(X,Y,w,h,rad));x.clip();if(e.duo){x.fillStyle=e.d2;x.fillRect(X,Y,w,h)}
   x.filter=`${e.duo?'grayscale(100%)':'grayscale('+e.gray+'%)'} contrast(${e.con}%) brightness(${e.bri}%) sepia(${e.sep}%) saturate(${e.sat}%) hue-rotate(${e.hue}deg) blur(${e.blr*u}px) invert(${e.inv}%)${window.v4efl?v4efl(e):''}${e.lb?` blur(${e.lb*u}px)`:''}`;
   x.globalCompositeOperation=e.duo?'multiply':e.blend!='normal'?e.blend:'source-over';
   const iw=I.naturalWidth,ih=I.naturalHeight;let dw=w,dh=h;if(e.fit!='fill'){const q=(e.fit=='cover'?Math.max:Math.min)(w/iw,h/ih);dw=iw*q;dh=ih*q}if(e.zm>1){dw*=e.zm;dh*=e.zm}x.drawImage(I,X+(w-dw)*e.fx/100,Y+(h-dh)*e.fy/100,dw,dh);
   if(e.duo){x.filter='none';x.globalCompositeOperation='lighten';x.fillStyle=e.d1;x.fillRect(X,Y,w,h)}}}
  else{const fs=e.fs*u;x.font=fnt(e,fs);x.textBaseline='top';x.fs=fs;x.u=u;if('letterSpacing'in x)x.letterSpacing=e.ls*fs+'px';if('wordSpacing'in x)x.wordSpacing=(e.ws||0)*fs+'px';
   let fill=e.col;if(e.gr){const a=e.ga*Math.PI/180,dx=Math.sin(a),dy=-Math.cos(a),hf=(Math.abs(w*dx)+Math.abs(h*dy))/2,cx=X+w/2,cy=Y+h/2;fill=x.createLinearGradient(cx-dx*hf,cy-dy*hf,cx+dx*hf,cy+dy*hf);fill.addColorStop(0,e.col);fill.addColorStop(1,e.col2)}
   if(window.v4flat&&v4flat(e)){v4tdraw(x,e,X,Y,w,h,u,fill,sh);x.restore();return}
   if(e.vert){x.translate(X,Y+h);x.rotate(-Math.PI/2);X=0;Y=0;[w,h]=[h,w]}
   const n=e.cc,gap=S.gut*u,cw=(w-(n-1)*gap)/n,L=wrap(x,e,w,n),lh=e.lh*fs,per=Math.ceil(L.length/n),bh=per*lh,oy=e.va=='center'?(h-bh)/2:e.va=='end'?h-bh:0,ind=(e.ind||0)*fs;
   sh(e);x.fillStyle=fill;x.strokeStyle=e.sc;x.lineWidth=(e.sw||0)*u;x.lineJoin='round';
   L.forEach((ln,i)=>{const t=tcf(e,ln),off=L.first.has(i)?ind:0,av=cw-off,ty=Y+oy+(i%per)*lh+(lh-fs)/2;let tx=X+Math.floor(i/per)*(cw+gap)+off;const tw=x.measureText(t).width;
    if(e.al=='justify'&&!L.last.has(i)&&t.includes(' ')){const ws=t.split(' '),sm=ws.reduce((q,v)=>q+x.measureText(v).width,0),g=(av-sm)/(ws.length-1);ws.forEach(v=>{x.fillText(v,tx,ty);if(e.sw)x.strokeText(v,tx,ty);tx+=x.measureText(v).width+g})}
    else{if(e.al=='center')tx+=(av-tw)/2;else if(e.al=='right')tx+=av-tw;x.fillText(t,tx,ty);if(e.sw)x.strokeText(t,tx,ty)}})}
  x.restore()});
 if(S.grain){x.save();x.globalCompositeOperation='overlay';x.globalAlpha=S.grain/100;const k=Wd/900;x.scale(k,k);x.fillStyle=x.createPattern(noise(),'repeat');x.fillRect(0,0,Wd/k,H/k);x.restore()}
 if(S.vig){x.save();x.translate(Wd/2,H/2);x.scale(1,H/Wd);const R2=Wd*.7071,g=x.createRadialGradient(0,0,R2*.5,0,0,R2);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${S.vig/100})`);x.fillStyle=g;x.fillRect(-Wd/2,-Wd/2/(H/Wd),Wd,Wd/(H/Wd));x.restore()}
 return c}
async function save(n,b){const dl=await cap('downloads');if(dl)try{await dl.save({filename:n,data:b})}catch(e){}else{const a=document.createElement('a'),u=URL.createObjectURL(b);a.href=u;a.download=n;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},5000)}}
async function exp(kind){const bt=$(kind);bt.disabled=true;bt.classList.add('busy');
 let L=+$('px').value,done=0;const slug=(window.v4slug?v4slug(PROJ.name).toLowerCase():(PROJ.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))||'vybble';
 while(!done&&L>=1000){try{const Wd=Math.round(S.fmt>=1?L:L*S.fmt);
  if(kind=='png'){toast('Sayfa hazırlanıyor…');await loadF();const c=drawB(Wd,S.bleed,S.marks),b=await new Promise(r=>c.toBlob(r));if(!b)throw 0;await save(slug+'-sayfa'+(PROJ.cur+1)+'.png',b)}
  else{const ex2=(S.bleed||0)+(S.marks?6:0),pw=S.mm[0]+2*ex2,ph=S.mm[1]+2*ex2,N=PROJ.pages.length;let doc;
   await eachPage(async i=>{toast(`Sayfa ${i+1}/${N} hazırlanıyor…`);await loadF();const im=drawB(Wd,S.bleed,S.marks).toDataURL('image/jpeg',.92);if(!doc)doc=new window.jspdf.jsPDF({orientation:pw>ph?'l':'p',unit:'mm',format:[pw,ph],compress:true});else doc.addPage([pw,ph],pw>ph?'l':'p');doc.addImage(im,'JPEG',0,0,pw,ph);(window.v4linksMM?v4linksMM(ex2):[]).forEach(q=>{try{doc.link(q.x,q.y,q.w,q.h,q.lk.t=='p'?{pageNumber:q.lk.n}:{url:q.lk.u})}catch(x){}})});
   await save(slug+'.pdf',new Blob([doc.output('arraybuffer')],{type:'application/pdf'}))}
  done=1;toast(L<+$('px').value?`Cihaz sınırı: ${L}px ile indirildi`:`Hazır ✓ ${Wd}px`)}catch(e){L=Math.round(L/1.5)}}
 if(!done)toast('İndirilemedi');bt.disabled=false;bt.classList.remove('busy')}
$('png').onclick=()=>exp('png');$('pdf').onclick=()=>exp('pdf');
let HI=[],HP=-1,moved=0,DR=null;
const ser=()=>JSON.stringify({...S,els:S.els.map(e=>({...e,im:null}))});
function hist(){const x=ser();if(HI[HP]===x)return;HI=HI.slice(0,HP+1);HI.push(x);if(HI.length>60)HI.shift();HP=HI.length-1;ui();dirty()}
function undo(d){const i=HP+d;if(i<0||i>=HI.length)return;HP=i;Object.assign(S,JSON.parse(HI[i]));S.els.forEach(e=>{if(e.type=='img'){e.im=e.src?getIm(e.src):new Image()}});render();thumbs();list();ed();toast(d<0?'Geri alındı':'Yinelendi')}
function ui(){$('un').disabled=HP<=0;$('re').disabled=HP>=HI.length-1;$('gr').setAttribute('aria-pressed',S.grid);$('sn').setAttribute('aria-pressed',S.free);const a=$('mw'),b=$('mh');if(a&&a!==document.activeElement)a.value=S.mm[0];if(b&&b!==document.activeElement)b.value=S.mm[1];const bt=$('bot');if(bt)bt.dataset.n=review().length||''}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),1800)}
function showPt(i){$('pts').style.setProperty('--i',i);document.querySelectorAll('#pts button').forEach((b,k)=>b.setAttribute('aria-selected',k==i));document.querySelectorAll('.pt').forEach((p,k)=>p.hidden=k!=i)}
function sbox(){const e=cur();if(!e||!e.on)return'';const[X,Y,w,h]=geo(e,100);return `<div class="sbox" style="left:${X+e.dx}%;top:${(Y+e.dy)*S.fmt}%;width:${w}%;height:${h*S.fmt}%;transform:rotate(${e.rot}deg)"><i class="hd" data-hd></i></div>`}
function dup(){const e=cur();if(!e)return;const n={...e,id:++S.n,pos:[...e.pos]};if(e.type=='img'){n.im=new Image();if(n.src)n.im.src=n.src}n.z=topZ()+10;n.pos[0]=Math.min(S.cols,n.pos[0]+1);n.pos[1]=Math.min(S.rows,n.pos[1]+1);S.els.push(n);S.sel=n.id;render();list();ed();thumbs();hist();toast('Çoğaltıldı')}
function setMode(k,keep){S.mode=k;const M=MODES[k];if(!keep){S.cols=M.cols;S.rows=M.rows;S.fmt=M.fmt[0][0];S.mm=[M.fmt[0][2],M.fmt[0][3]];S.mar=M.mar;S.pc=null;S.imgPal=null}
 document.querySelector('#pn select[data-p="fmt"]').innerHTML=(keep?[FM(S.mm[0],S.mm[1],'Proje boyutu'),...M.fmt]:M.fmt).map(fo).join('');
 document.querySelector('#pn select[data-p="pre"]').innerHTML='<option value="">Bir kurgu seç…</option>'+M.pre.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join('');
 document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.m==k));$('tabs').style.setProperty('--i',Object.keys(MODES).indexOf(k));if($('modesel'))$('modesel').value=k;
 GS=0;GN=48;SUG=[];palRender();$('gc').textContent=TOT()+'+ varyasyon';if(keep){thumbs();return}
 setCounts(M.pre[0][1]);sty(M.st[0]);apply(idx(0));list();ed();showPt(0)}
$('tabs').onclick=e=>{const b=e.target.closest('[data-m]');if(b&&b.dataset.m!=S.mode)setMode(b.dataset.m)};
$('un').onclick=()=>undo(-1);$('re').onclick=()=>undo(1);$('gr').onclick=()=>{S.grid=!S.grid;render()};
$('sur').onclick=()=>{S.vi=0;apply([Math.random()*FN.length|0,1+Math.random()*(SEEDS-1)|0,Math.random()<.5?1:0,Math.random()<.5?1:0]);toast('Sürpriz düzen')};
// sürükle-bırak: taşı, boyutlandır, dosya bırak
const cv=$('cv');
cv.addEventListener('pointerdown',e=>{const h=e.target.closest('[data-hd]'),x=e.target.closest('.e');if(!h&&!x)return;const id=h?S.sel:+x.dataset.id;if(id!=S.sel)pick(id);const el=cur();moved=0;DR={k:h?'rs':'mv',x:e.clientX,y:e.clientY,p:[...el.pos],d0:[el.dx,el.dy]};cv.setPointerCapture(e.pointerId);e.preventDefault()});
cv.addEventListener('pointermove',e=>{if(!DR)return;const el=cur(),b=cv.getBoundingClientRect(),dx=e.clientX-DR.x,dy=e.clientY-DR.y;if(Math.abs(dx)+Math.abs(dy)>4)moved=1;if(!moved)return;
 if(DR.k=='mv'&&(S.free||e.altKey)){el.dx=+(DR.d0[0]+dx/(b.width/100)).toFixed(2);el.dy=+(DR.d0[1]+dy/(b.width/100)).toFixed(2);render();return}
 const dc=Math.round(dx/(b.width/S.cols)),dr=Math.round(dy/(b.height/S.rows));let[c,r,cs,rs]=DR.p;
 if(DR.k=='mv'){c=cl(c+dc,1,S.cols-cs+1);r=cl(r+dr,1,S.rows-rs+1)}else{cs=cl(cs+dc,1,S.cols-c+1);rs=cl(rs+dr,1,S.rows-r+1)}
 if(el.pos.join()!=[c,r,cs,rs].join()){el.pos=[c,r,cs,rs];if(DR.k=='rs')fitAll();render()}});
const endDr=()=>{if(DR&&moved)hist();DR=null};cv.addEventListener('pointerup',endDr);cv.addEventListener('pointercancel',endDr);
const CVW=$('cvw');['dragenter','dragover'].forEach(n=>CVW.addEventListener(n,e=>{e.preventDefault();CVW.classList.add('dz-on')}));
['dragleave','drop'].forEach(n=>CVW.addEventListener(n,e=>{e.preventDefault();CVW.classList.remove('dz-on')}));
CVW.addEventListener('drop',e=>{const x=document.elementFromPoint(e.clientX,e.clientY),el=x&&x.closest&&x.closest('.e');files([...e.dataTransfer.files],el?S.els.find(a=>a.id==+el.dataset.id):null)});
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const el=cur(),m=e.metaKey||e.ctrlKey;
 if(m&&e.key=='z'){e.preventDefault();undo(e.shiftKey?1:-1);return}if(m&&e.key=='y'){undo(1);return}if(!el)return;
 if(m&&e.key=='d'){e.preventDefault();dup();return}
 if(e.key=='Delete'||e.key=='Backspace'){e.preventDefault();del(el.id);return}
 const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
 if(d){e.preventDefault();let[c,r,cs,rs]=el.pos;if(e.shiftKey){cs=cl(cs+d[0],1,S.cols-c+1);rs=cl(rs+d[1],1,S.rows-r+1)}else{c=cl(c+d[0],1,S.cols-cs+1);r=cl(r+d[1],1,S.rows-rs+1)}el.pos=[c,r,cs,rs];render();hist()}});
function pal(bg,tx,ac){S.bg=bg;S.pc=[tx,ac];S.els.forEach(e=>{if(e.type=='img')return;e.col='sqr'.includes(e.type)?ac:tx});fitAll();render();hist()}
function palRender(){const sw=(i,n,a)=>`<button class="sw" data-pal="${i}" title="${n}" style="background:linear-gradient(90deg,${a[0]} 33%,${a[1]} 33% 66%,${a[2]} 66%)"></button>`;
 $('pal').innerHTML=(S.imgPal?sw('i','Görselden',S.imgPal):'')+PALS.map((p,i)=>sw(i,p[0],p.slice(1))).join('')}
function autoDesign(x){const im=x.im,a=im.naturalWidth/im.naturalHeight,c=document.createElement('canvas');c.width=c.height=24;const g=c.getContext('2d'),px=[];
 try{g.drawImage(im,0,0,24,24);const d=g.getImageData(0,0,24,24).data;for(let i=0;i<d.length;i+=4)px.push([d[i],d[i+1],d[i+2]])}catch(e){return}
 const lu=p=>.299*p[0]+.587*p[1]+.114*p[2],sa=p=>{const m=Math.max(...p),n=Math.min(...p);return m?(m-n)/m:0},sc=p=>sa(p)*(1-Math.abs(lu(p)-140)/160),so=[...px].sort((p,q)=>lu(p)-lu(q)),k=Math.max(1,Math.floor(px.length*.15)),
 av=L=>L[0].map((_,i)=>L.reduce((s,p)=>s+p[i],0)/L.length),dk=av(so.slice(0,k)),lt=av(so.slice(-k)),ac=[...px].sort((p,q)=>sc(q)-sc(p))[0],mid=lu(av(px)),
 mx=(p,q,t)=>p.map((v,i)=>v+(q[i]-v)*t),hx=p=>'#'+p.map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''),dark=mid<105,
 bg=dark?mx(dk,[0,0,0],.55):mx(lt,[255,255,255],.75),tx=dark?mx(lt,[255,255,255],.8):mx(dk,[0,0,0],.7);
 S.imgPal=[bg,tx,ac].map(hx);S.pc=null;
 const fam=a>1.25?[1,2,3,11,14,5]:a<.8?[0,6,13,4,12,21]:[9,8,15,16,3,19];let F=fam.filter(f=>FL().includes(f));if(!F.length)F=FL();
 const w=['Görselinin oranına en uygun yerleşim.','Renkler görselden çıkarıldı, okunurluk korundu.','Görseli öne çıkaran daha cesur bir kurgu.','Başlık ve görseli dengeleyen alternatif.'];
 SUG=w.map((why,i)=>({sp:[F[i%F.length],1+Math.random()*(SEEDS-1)|0,i&1,0],style:S.st,why,keep:1}));
 pal(...S.imgPal);apply(SUG[0].sp);palRender();toast('✨ Görselden palet ve en uygun düzen hazır')}
$('file0').onchange=e=>{files([...e.target.files],null);e.target.value=''};
$('sn').onclick=()=>{S.free=!S.free;ui();toast(S.free?'Serbest taşıma açık':'Gride oturtma açık')};
['mw','mh'].forEach(id=>$(id).addEventListener('input',()=>{const w=+$('mw').value,h=+$('mh').value;if(w>=20&&h>=20){S.mm=[w,h];S.fmt=w/h;apply(S.sp)}}));
const hexL=h=>{const n=parseInt(h.slice(1),16),f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(n>>16)+.7152*f(n>>8&255)+.0722*f(n&255)},cr=(a,b)=>{const p=hexL(a),q=hexL(b);return(Math.max(p,q)+.05)/(Math.min(p,q)+.05)},ptz=e=>e.fs/100*S.mm[0]*2.835;
function review(){const T=S.els.filter(e=>e.txt!==undefined&&e.on),R=[],tt=T.find(e=>e.type=='t'),bd=T.filter(e=>e.type=='b'),imgs=S.els.filter(e=>e.type=='img'&&e.on),cover=imgs.some(i=>i.src&&i.pos[2]*i.pos[3]>S.cols*S.rows*.55),lowc=cover?[]:T.filter(e=>/^#[0-9a-f]{6}$/i.test(e.col)&&cr(e.col,S.bg)<3.2);
 if(lowc.length)R.push(['Bazı metinlerin arka planla kontrastı düşük, okunmaları zor. Daha koyu ya da daha açık bir renk kullanırsan çok daha iyi olur.',[['Kontrastı düzelt',()=>{lowc.forEach(e=>e.col=cr('#111111',S.bg)>cr('#ffffff',S.bg)?'#111111':'#ffffff');render();hist()}]]]);
 if(tt&&bd[0]&&tt.fs<bd[0].fs*3)R.push(['Başlık gövde metne göre fazla küçük. Boyutunu 3-4 katına çıkarırsan hiyerarşi netleşir.',[['Başlığı büyüt',()=>{S.af=false;tt.fs=Math.min(60,bd[0].fs*5);render();hist()}]]]);
 const fl=[...new Set(T.map(e=>e.ff))];if(fl.length>3)R.push([`${fl.length} farklı font kullanıyorsun. İki ya da üç font daha tutarlı ve profesyonel durur.`,[['Fontları sadeleştir',()=>{const h=tt?tt.ff:fl[0],b=bd[0]?bd[0].ff:fl[0];T.forEach(e=>e.ff=e.type=='t'||e.type=='q'?h:b);fitAll();render();hist()}]]]);
 const sm=bd.filter(e=>ptz(e)<8);if(sm.length)R.push([`Paragraf yazısı basılı için küçük (yaklaşık ${Math.round(ptz(sm[0]))} pt). 9 pt ve üzeri çok daha rahat okunur.`,[['9 pt yap',()=>{sm.forEach(e=>e.fs=+(9/2.835/S.mm[0]*100).toFixed(2));render();hist()}]]]);
 const wide=bd.find(e=>(100-2*S.mar)*gp(e)[2]/S.cols/e.cc/(e.fs*.5)>80);if(wide)R.push(['Bir paragrafta satırlar çok uzun (80+ karakter). Metni sütunlara bölersen okumak çok kolaylaşır.',[['Sütun ekle',()=>{wide.cc=Math.min(4,wide.cc+1);render();hist()}]]]);
 if(S.mar<3)R.push(['Kenar boşluğu çok az. Baskıda kesim payı için en az %4 boşluk bırakmak güvenli olur.',[['Boşluğu artır',()=>{S.mar=4;apply(S.sp)}]]]);
 if(!imgs.some(e=>e.src))R.push(['Henüz görsel yok. Bir fotoğraf eklersen tasarım canlanır, renkleri de ondan çıkarırım.',[['Görsel yükle',()=>$('file0').click()]]]);
 if(imgs.some(e=>e.src&&e.im.naturalWidth&&e.im.naturalWidth<(S.mm[0]/25.4*300)*(e.pos[2]/S.cols)*.7))R.push(['Bir görselin çözünürlüğü 300 dpi baskı için düşük kalıyor. Daha büyük bir dosya kullanırsan baskı net çıkar.',[]]);
 return R}
const MS=$('msgs');
function acts(d,A){(A||[]).forEach(a=>{const b=document.createElement('button');b.className='b mini';b.textContent=a[0];b.onclick=()=>{a[1]();b.disabled=true;toast('Uygulandı ✓')};d.appendChild(b)})}
function bot(t,A,dl=450){const d=document.createElement('div');d.className='m bot typ';d.textContent='•••';MS.appendChild(d);MS.scrollTop=MS.scrollHeight;setTimeout(()=>{d.classList.remove('typ');d.textContent=t;acts(d,A);MS.scrollTop=MS.scrollHeight},dl)}
function me(t){const d=document.createElement('div');d.className='m me';d.textContent=t;MS.appendChild(d);MS.scrollTop=MS.scrollHeight}
function evaluate(){const R=review();if(!R.length){bot('Tasarımın dengeli görünüyor 👏 Bir adım daha: hafif film greni ve vinyet ekleyerek derinlik katabilirsin.',[['Gren + vinyet ekle',()=>{S.grain=18;S.vig=25;render();hist()}]]);return}bot(`${R.length} öneri buldum:`);R.slice(0,4).forEach((r,i)=>setTimeout(()=>bot(r[0],r[1]),500+i*900))}
const pick1=a=>a[Math.random()*a.length|0],ST=(n,f)=>()=>{sty(n);f&&f()};
function localAsk(q){q=q.toLowerCase();if(aiCmd(q))return;
 if(/boyut|format|ölçü|kaç sayfa|çözünürlük|dpi/.test(q))return bot('Kısa rehber: dergi ve katalog için A4 (210×297 mm) ve 300 dpi; afiş için A3-A2 ve 150 dpi yeterli; kartvizit 85×55 mm ve 600 dpi; sosyal medya için 108×135 mm (4:5) ve 150 dpi iyi çalışır. Sihirbaz bunları senin için seçili getirir.',[['Sihirbazı aç',()=>{chat(0);openWiz()}]]);
 if(/fikir|ne tasarla|ilham|başla/.test(q)){const k=pick1([['dergi','Üç görselli, iki paragraflı bir dergi röportajı'],['katalog','Dokuz ürünlük sade bir ürün kataloğu'],['kapak','Tipografik bir dergi kapağı'],['afis','Etkinlik için cesur renkli bir afiş']]);return bot(`Bir fikir: ${k[1]}. İstersen sihirbazı bu türle açayım.`,[['Başlat',()=>{chat(0);openWiz(k[0])}]])}

 if(/modern|minimal|sade|temiz/.test(q))return bot('Daha modern ve sade bir görünüm için Minimal stil, geniş kenar boşluğu ve ince fontlar iyi olur.',[['Uygula',()=>{sty(7);S.mar=Math.max(S.mar,7);apply(S.sp)}]]);
 if(/okun|oku|rahat/.test(q))return bot('Okunurluk için paragrafı 9-10 pt yapıp sütunlara bölersen, satır aralığını 1.5 civarı tutarsan çok daha iyi olur.',[['Okunurluğu artır',()=>{S.els.filter(e=>e.type=='b').forEach(e=>{e.fs=Math.max(e.fs,+(9.5/2.835/S.mm[0]*100).toFixed(2));e.lh=1.5;e.cc=Math.max(e.cc,2)});render();hist()}]]);
 if(/renk|palet|canlı|soluk/.test(q)){const p=pick1(PALS);return bot(`“${p[0]}” paletini deneyebilirsin; zıtlığı güçlü ve baskıda net duruyor.`,[['Paleti uygula',()=>pal(p[1],p[2],p[3])]])}
 if(/font|yazı tipi|tipografi/.test(q)){const k=pick1([[0,'Playfair Display + Source Serif, klasik dergi havası verir'],[2,'Bodoni Moda + Montserrat, moda dergisi şıklığı katar'],[4,'Unbounded + DM Sans, teknolojik ve cesur durur'],[9,'Fraunces + Libre Franklin, sıcak ve modern bir karışım']]);return bot(`${k[1]}. Böyle yaparsan daha iyi olur.`,[['Stili uygula',()=>sty(k[0])]])}
 if(/efekt|derin|sinema|gren|retro|nostalji/.test(q))return bot('Hafif film greni, vinyet ve başlığa yumuşak bir gölge eklersen sayfa çok daha derin ve sinematik durur.',[['Efektleri ekle',()=>{S.grain=22;S.vig=28;const t=S.els.find(e=>e.type=='t');if(t)Object.assign(t,FXT['Gölge']);render();ed();hist()}]]);
 if(/kapak/.test(q))return bot('Kapak ekranına geçelim: manşet, merkez ve tipografik kapak düzenleri hazır. Dergi, katalog, broşür ve kitap kapağı formatlarını seçebilirsin.',[['Kapak ekranını aç',()=>setMode('kapak')]]);
 if(/cesur|dikkat|çarpıcı|büyük/.test(q))return bot('Çarpıcı bir görünüm için başlığı çok büyütüp Brütalist stile geçmek ve bir renk şeridi eklemek iyi olur.',[['Uygula',()=>{sty(3);const t=S.els.find(e=>e.type=='t');if(t){S.af=false;t.fs=Math.min(60,t.fs*1.4)}add('r')}]]);
 if(/şık|lüks|zarif|klasik/.test(q))return bot('Şık bir görünüm için Moda stili, bol boşluk ve ince bir altın vurgu rengi iyi çalışır.',[['Uygula',ST(2,()=>{S.mar=Math.max(S.mar,7);apply(S.sp)})]]);
 evaluate()}
async function ask(q){me(q);const sm=await cap('sample');if(!sm)return localAsk(q);
 try{const st=JSON.stringify({tur:MODES[S.mode].n,mm:S.mm,bg:S.bg,ogeler:S.els.map(e=>({tip:e.type,ff:e.ff,fs:e.fs,col:e.col,uz:e.txt?e.txt.length:undefined})),sorunlar:review().map(r=>r[0])});
  const r=await sm.json(`Sen Vybble tasarım asistanısın. Samimi, kısa Türkçe konuş; "böyle yaparsan daha iyi olur" tarzında somut öneri ver. Tasarım durumu: ${st}. Kullanıcı: "${q}". Düzen aileleri: ${FL().map(i=>i+'='+FN[i]).join(', ')}. Yalnızca JSON döndür: {"reply":"...","actions":[{"do":"palette","i":0-${PALS.length-1}},{"do":"style","i":0-${STY.length-1}},{"do":"layout","fam":listedeki sayı,"seed":1-400,"fx":0|1,"fy":0|1},{"do":"set","type":"t|s|b|m|q","prop":"fs|fw|lh|ls|col","value":sayı veya #rrggbb},{"do":"page","grain":0-100,"vig":0-100}]} en fazla 3 eylem.`,{modelTier:'quick',cache:false});
  const A=(r.actions||[]).slice(0,3).map(a=>[({palette:'Paleti uygula',style:'Stili uygula',layout:'Düzeni uygula',set:'Ayarı uygula',page:'Efekti uygula'})[a.do]||'Uygula',()=>run(a)]);bot(String(r.reply||'Şunu deneyebilirsin:'),A)}catch(e){localAsk(q)}}
function run(a){if(a.do=='palette'){const p=PALS[a.i|0];if(p)pal(p[1],p[2],p[3])}else if(a.do=='style')sty(cl(a.i,0,STY.length-1)|0);else if(a.do=='layout')apply([FL().includes(a.fam|0)?a.fam|0:FL()[0],cl(a.seed,1,SEEDS)|0,a.fx?1:0,a.fy?1:0]);
 else if(a.do=='page'){S.grain=cl(a.grain||0,0,100);S.vig=cl(a.vig||0,0,100);render();hist()}
 else if(a.do=='set'&&['fs','fw','lh','ls','col'].includes(a.prop)){const v=a.prop=='col'?(/^#[0-9a-f]{6}$/i.test(a.value)?a.value:null):+a.value;if(v===null||v!==v)return;S.els.filter(e=>e.type==a.type&&e.txt!==undefined).forEach(e=>{e[a.prop]=v});render();ed();hist()}}
const CHIPS=[['🔍 Değerlendir',evaluate],['✨ Daha modern',()=>localAsk('modern')],['👓 Daha okunur',()=>localAsk('okunur')],['🎨 Renk öner',()=>localAsk('renk')],['🔤 Font öner',()=>localAsk('font')],['🎞 Efekt öner',()=>localAsk('efekt')],['📕 Kapak yap',()=>localAsk('kapak')]];
$('chips').innerHTML=CHIPS.map((c,i)=>`<button class="chip" data-c="${i}">${c[0]}</button>`).join('');
$('chips').onclick=e=>{const b=e.target.closest('[data-c]');if(b){me(CHIPS[+b.dataset.c][0]);CHIPS[+b.dataset.c][1]()}};
let greeted=0;function chat(o){if(DOCK)o=1;$('chat').hidden=!o;$('bot').hidden=o||DOCK;if(o&&!greeted){greeted=1;bot('Merhaba, ben Vybble Asistan 👋 Tasarımına bakıp “şunu böyle yaparsan daha iyi olur” diye öneriler veririm. Aşağıdan seçebilir ya da bana yazabilirsin.');setTimeout(evaluate,900)}}
$('bot').onclick=()=>chat(1);$('cx').onclick=()=>chat(0);
$('cf').onsubmit=e=>{e.preventDefault();const v=$('ci').value.trim();if(v){$('ci').value='';ask(v)}};
/* Vybble logosu: yalnız V. İki kol ayrı (sol mor, sağ pembe-turuncu), uçları yuvarlak; kollar köşe noktasından esneyebilir.
   Renk geçişleri tek bir ortak tanımda (her zaman görünür), böylece gizlenen bir kopya diğerlerini etkilemez. */
const ELOGO=`<svg class="elogo vlogo" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><g class="vv"><path class="va" d="M15 12.5 32 51.5"/><path class="vb" d="M49 12.5 32 51.5"/><path class="vs" d="M17.6 17.6 23.6 31.4"/></g></svg>`;
(function(){if(document.getElementById('vdefs'))return;const d=document.createElement('div');d.id='vdefs';d.setAttribute('aria-hidden','true');d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
 d.innerHTML='<svg width="0" height="0" focusable="false"><defs><linearGradient id="vgA" gradientUnits="userSpaceOnUse" x1="15" y1="12" x2="32" y2="52"><stop offset="0" stop-color="#a98bff"/><stop offset="1" stop-color="#5b4bff"/></linearGradient><linearGradient id="vgB" gradientUnits="userSpaceOnUse" x1="49" y1="12" x2="32" y2="52"><stop offset="0" stop-color="#ffb347"/><stop offset=".55" stop-color="#ff5c9a"/><stop offset="1" stop-color="#ff3d7f"/></linearGradient></defs></svg>';
 document.body.insertBefore(d,document.body.firstChild)})();
$('lg').innerHTML=ELOGO+'<b>vybble</b>';$('hlg').innerHTML=ELOGO+'<b>vybble</b>';$('sp-logo').innerHTML=ELOGO;
function hideSplash(){const sp=$('splash');if(!sp||sp.classList.contains('out'))return;sp.classList.add('out');setTimeout(()=>sp.remove(),700)}
$('go').onclick=hideSplash;setTimeout(hideSplash,3200);
