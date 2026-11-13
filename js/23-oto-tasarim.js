/* =====================================================================
   OTOMATİK TASARIM MOTORU ("sanat yönetmeni")
   Görsel yüklenince sayfayı kendi başına tasarlar; kullanıcı sonra her şeyi değiştirebilir.

   1) Görsel analizi: baskın renkler, özne merkezi, düz zemin, sakin/kalabalık bölgeler
   2) Renk şemaları: görselden türetilir; her şemada metin/zemin kontrastı WCAG eşiklerini geçer
   3) Tipografi: elle seçilmiş yazı tipi çiftleri, baskı puntosuna göre ölçek, satır ritmi
   4) Düzen kalıpları: 12 sütunlu ızgaraya ve satır ritmine oturan parametrik kalıplar
   5) Denetçi: her aday ölçülür; çakışma, taşma, okunmayan renk, dar sütun, aşırı kırpma
      ya da büyük boşluk varsa aday reddedilir. Ekrana yalnızca denetimden geçen tasarım gelir.

   Ölçü birimi: sayfa genişliği = 100 birim (render ve draw ile aynı); yükseklik H = 100 / S.fmt.
   ===================================================================== */
(function(){
'use strict';
if(typeof S=='undefined'||typeof wrap!='function')return;

/* ---------------------------------------------------------------- renk */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const h2r=h=>{h=String(h||'#000').replace('#','');if(h.length==3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h.slice(0,6),16)||0;return[n>>16&255,n>>8&255,n&255]};
const r2h=p=>'#'+p.map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
const lin=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};
const lumR=p=>.2126*lin(p[0])+.7152*lin(p[1])+.0722*lin(p[2]);
const lumH=h=>lumR(h2r(h));
const contrast=(a,b)=>{const p=typeof a=='string'?lumH(a):lumR(a),q=typeof b=='string'?lumH(b):lumR(b);return(Math.max(p,q)+.05)/(Math.min(p,q)+.05)};
const mixR=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const mixH=(a,b,t)=>r2h(mixR(h2r(a),h2r(b),t));
function r2hsl([r,g,b]){r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2;let h=0,s=0;if(M!=m){const d=M-m;s=l>.5?d/(2-M-m):d/(M+m);h=M==r?(g-b)/d+(g<b?6:0):M==g?(b-r)/d+2:(r-g)/d+4;h/=6}return[h,s,l]}
function hsl2r([h,s,l]){if(!s)return[l*255,l*255,l*255];const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return[f(h+1/3)*255,f(h)*255,f(h-1/3)*255]}
const satR=p=>r2hsl(p)[1];
/* metin rengini tonunu koruyarak koyulaştır / açarak hedef kontrasta ulaştır */
function ensure(fg,bg,ratio){if(contrast(fg,bg)>=ratio)return fg;const hs=r2hsl(h2r(fg)),dark=lumH(bg)>.18;
 for(let i=1;i<=40;i++){const l=dark?hs[2]*(1-i/40):hs[2]+(1-hs[2])*i/40,c=r2h(hsl2r([hs[0],hs[1],l]));if(contrast(c,bg)>=ratio)return c}
 return dark?'#000000':'#ffffff'}
const bestInk=(bg,tintFrom)=>{const k=tintFrom?mixH(tintFrom,'#000000',.86):'#121212',w=tintFrom?mixH(tintFrom,'#ffffff',.9):'#f7f5f0';return contrast(k,bg)>=contrast(w,bg)?k:w};

/* ------------------------------------------------------- görsel analizi */
const ACACHE=new Map();
function analyze(im){const key=im&&im.src;if(!key)return null;if(ACACHE.has(key))return ACACHE.get(key);
 const iw=im.naturalWidth,ih=im.naturalHeight;if(!iw||!ih)return null;
 const a=iw/ih,GW=a>=1?96:Math.max(24,Math.round(96*a)),GH=a>=1?Math.max(24,Math.round(96/a)):96;
 const c=document.createElement('canvas');c.width=GW;c.height=GH;const g=c.getContext('2d',{willReadFrequently:true});
 let d;try{g.drawImage(im,0,0,GW,GH);d=g.getImageData(0,0,GW,GH).data}catch(e){return null}
 const N=GW*GH,P=new Array(N),L=new Float32Array(N);
 for(let i=0;i<N;i++){const p=[d[i*4],d[i*4+1],d[i*4+2]];P[i]=p;L[i]=lumR(p)}
 /* kenar haritası (Sobel) */
 const E=new Float32Array(N),at=(x,y)=>L[clamp(y,0,GH-1)*GW+clamp(x,0,GW-1)];
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const gx=at(x+1,y-1)+2*at(x+1,y)+at(x+1,y+1)-at(x-1,y-1)-2*at(x-1,y)-at(x-1,y+1),gy=at(x-1,y+1)+2*at(x,y+1)+at(x+1,y+1)-at(x-1,y-1)-2*at(x,y-1)-at(x+1,y-1);E[y*GW+x]=Math.min(1,Math.hypot(gx,gy))}
 /* çerçeve: düz zemin mi? */
 const bw=Math.max(2,Math.round(Math.min(GW,GH)*.05)),B=[];for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(x<bw||y<bw||x>=GW-bw||y>=GH-bw)B.push(P[y*GW+x]);
 const bm=[0,1,2].map(k=>B.reduce((s,p)=>s+p[k],0)/B.length),bsd=Math.sqrt(B.reduce((s,p)=>s+(p[0]-bm[0])**2+(p[1]-bm[1])**2+(p[2]-bm[2])**2,0)/B.length/3);
 const plain=bsd<14;
 /* özne merkezi: kenar yoğunluğu × zeminden uzaklık */
 let sx=0,sy=0,sw=0;for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const i=y*GW+x,p=P[i],dist=Math.min(1,Math.hypot(p[0]-bm[0],p[1]-bm[1],p[2]-bm[2])/120),w=E[i]*(plain?.3+dist:1)+(plain?dist*.4:0);sx+=x*w;sy+=y*w;sw+=w}
 const fx=sw?clamp(sx/sw/(GW-1)*100,10,90):50,fy=sw?clamp(sy/sw/(GH-1)*100,8,85):45;
 /* baskın renkler: k-ortalamalar */
 const smp=P.filter((_,i)=>i%3==0),K=6;let C=[0,.2,.4,.6,.8,.99].map(t=>{const s=[...smp].sort((p,q)=>lumR(p)-lumR(q));return s[Math.floor(t*(s.length-1))].slice()});let A=new Array(smp.length).fill(0);
 for(let it=0;it<9;it++){A=smp.map(p=>{let b=0,bd=1e9;C.forEach((c,k)=>{const dd=(p[0]-c[0])**2+(p[1]-c[1])**2+(p[2]-c[2])**2;if(dd<bd){bd=dd;b=k}});return b});
  C=C.map((c,k)=>{const M=smp.filter((_,i)=>A[i]==k);return M.length?[0,1,2].map(j=>M.reduce((s,p)=>s+p[j],0)/M.length):c})}
 const pal=C.map((c,k)=>({c,w:A.filter(x=>x==k).length/smp.length})).filter(x=>x.w>.01).sort((p,q)=>q.w-p.w);
 const byL=[...pal].sort((p,q)=>lumR(p.c)-lumR(q.c)),dark=byL[0].c,light=byL[byL.length-1].c;
 const vivid=[...pal].sort((p,q)=>{const sc=x=>satR(x.c)*(1-Math.abs(r2hsl(x.c)[2]-.5)*1.2)*Math.pow(x.w,.25);return sc(q)-sc(p)})[0].c;
 const meanL=L.reduce((s,v)=>s+v,0)/N,colorful=pal.reduce((s,x)=>s+satR(x.c)*x.w,0);
 /* ızgara istatistikleri (bindirme için sakin bölge arama) */
 const G=12,cell=[];for(let gy=0;gy<G;gy++)for(let gx=0;gx<G;gx++){let e=0,l=0,l2=0,r=0,gg=0,b=0,n=0;
  for(let y=Math.floor(gy*GH/G);y<Math.floor((gy+1)*GH/G);y++)for(let x=Math.floor(gx*GW/G);x<Math.floor((gx+1)*GW/G);x++){const i=y*GW+x;e+=E[i];l+=L[i];l2+=L[i]*L[i];r+=P[i][0];gg+=P[i][1];b+=P[i][2];n++}
  n=n||1;cell.push({e:e/n,l:l/n,sd:Math.sqrt(Math.max(0,l2/n-(l/n)**2)),c:[r/n,gg/n,b/n]})}
 const info={a,iw,ih,pal,dark,light,vivid,meanL,colorful,plain,bgc:r2h(bm),fx,fy,G,cell,mono:colorful<.08};
 ACACHE.set(key,info);return info}
/* görselin bir bölgesinin istatistiği; u,v,w,h görsel üzerinde 0..1 */
function region(info,u,v,w,h){const G=info.G,x0=clamp(Math.floor(u*G),0,G-1),y0=clamp(Math.floor(v*G),0,G-1),x1=clamp(Math.ceil((u+w)*G)-1,x0,G-1),y1=clamp(Math.ceil((v+h)*G)-1,y0,G-1);
 let e=0,l=0,sd=0,n=0,c=[0,0,0],lmin=1,lmax=0;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const q=info.cell[y*G+x];e+=q.e;l+=q.l;sd+=q.sd;c=c.map((v2,k)=>v2+q.c[k]);lmin=Math.min(lmin,q.l);lmax=Math.max(lmax,q.l);n++}
 return{e:e/n,l:l/n,sd:sd/n,c:c.map(v2=>v2/n),lmin,lmax}}
/* kutudaki bir dikdörtgenin görsel üzerindeki karşılığı (object-fit: cover + odak) */
function boxToImg(info,box,fx,fy,r){const[bx,by,bw,bh]=box,q=Math.max(bw/info.a,bh/1),dw=info.a*q,dh=q,ox=(bw-dw)*fx/100,oy=(bh-dh)*fy/100;
 return[(r[0]-bx-ox)/dw,(r[1]-by-oy)/dh,r[2]/dw,r[3]/dh]}

/* ------------------------------------------------------------ tipografi */
/* h: başlık, b: gövde, s: spot/alt başlık, q: alıntı, m: künye. ton etiketleri görsel karakterine göre seçimde kullanılır */
const PAIRS=[
 {id:'didone',n:'Bodoni · Montserrat',h:'Bodoni Moda',hw:700,hls:-.025,hlh:.9,b:'Montserrat',bw:400,blh:1.5,bfs:.94,s:'Montserrat',sw:600,q:'Bodoni Moda',qw:500,qi:1,m:'Montserrat',mw:600,mtc:'upper',mls:.14,tag:{mono:2,dark:1,lux:2}},
 {id:'playfair',n:'Playfair · Source Serif',h:'Playfair Display',hw:800,hls:-.02,hlh:.92,b:'Source Serif 4',bw:400,blh:1.42,bfs:1,s:'Source Serif 4',sw:600,q:'Playfair Display',qw:600,qi:1,m:'IBM Plex Mono',mw:500,mtc:'upper',mls:.06,tag:{warm:1,classic:2,mono:1}},
 {id:'fraunces',n:'Fraunces · Libre Franklin',h:'Fraunces',hw:700,hls:-.03,hlh:.95,b:'Libre Franklin',bw:400,blh:1.45,bfs:.95,s:'Libre Franklin',sw:600,q:'Fraunces',qw:500,qi:1,m:'Libre Franklin',mw:600,mtc:'upper',mls:.12,tag:{warm:2,food:2,colorful:1}},
 {id:'instrument',n:'Instrument Serif · Inter',h:'Instrument Serif',hw:400,hls:-.02,hlh:.92,b:'Inter',bw:400,blh:1.5,bfs:.9,s:'Inter',sw:500,q:'Instrument Serif',qw:400,qi:1,m:'Inter',mw:600,mtc:'upper',mls:.14,tag:{lux:2,cool:1,mono:1}},
 {id:'dmserif',n:'DM Serif · DM Sans',h:'DM Serif Display',hw:400,hls:-.015,hlh:.95,b:'DM Sans',bw:400,blh:1.5,bfs:.95,s:'DM Sans',sw:600,q:'DM Serif Display',qw:400,qi:1,m:'DM Mono',mw:500,mtc:'upper',mls:.06,tag:{warm:1,classic:1,colorful:1}},
 {id:'gloock',n:'Gloock · Figtree',h:'Gloock',hw:400,hls:-.02,hlh:.95,b:'Figtree',bw:400,blh:1.5,bfs:.95,s:'Figtree',sw:600,q:'Gloock',qw:400,qi:0,m:'Figtree',mw:700,mtc:'upper',mls:.14,tag:{dark:1,lux:1,classic:1}},
 {id:'cormorant',n:'Cormorant · EB Garamond',h:'Cormorant Garamond',hw:600,hls:-.01,hlh:.92,b:'EB Garamond',bw:400,blh:1.4,bfs:1.1,s:'EB Garamond',sw:500,q:'Cormorant Garamond',qw:500,qi:1,m:'EB Garamond',mw:500,mtc:'upper',mls:.16,tag:{classic:2,lux:1,warm:1}},
 {id:'youngserif',n:'Young Serif · Plus Jakarta',h:'Young Serif',hw:400,hls:-.02,hlh:.98,b:'Plus Jakarta Sans',bw:400,blh:1.5,bfs:.92,s:'Plus Jakarta Sans',sw:600,q:'Young Serif',qw:400,qi:0,m:'Plus Jakarta Sans',mw:700,mtc:'upper',mls:.12,tag:{food:2,warm:2,colorful:1}},
 {id:'swiss',n:'Inter · Inter',h:'Inter',hw:800,hls:-.045,hlh:.9,b:'Inter',bw:400,blh:1.5,bfs:.9,s:'Inter',sw:600,q:'Inter',qw:600,qi:0,m:'IBM Plex Mono',mw:500,mtc:'upper',mls:.04,tag:{cool:2,tech:2,mono:1}},
 {id:'grotesk',n:'Space Grotesk',h:'Space Grotesk',hw:700,hls:-.04,hlh:.92,b:'Space Grotesk',bw:400,blh:1.48,bfs:.92,s:'Space Grotesk',sw:600,q:'Space Grotesk',qw:500,qi:0,m:'Space Mono',mw:400,mtc:'upper',mls:.04,tag:{tech:2,cool:1,pop:1}},
 {id:'bricolage',n:'Bricolage Grotesque',h:'Bricolage Grotesque',hw:800,hls:-.04,hlh:.9,b:'Bricolage Grotesque',bw:400,blh:1.45,bfs:.95,s:'Bricolage Grotesque',sw:600,q:'Bricolage Grotesque',qw:600,qi:0,m:'DM Mono',mw:500,mtc:'upper',mls:.05,tag:{pop:2,colorful:2,warm:1}},
 {id:'syne',n:'Syne · Manrope',h:'Syne',hw:800,hls:-.03,hlh:.95,b:'Manrope',bw:400,blh:1.5,bfs:.93,s:'Manrope',sw:600,q:'Syne',qw:600,qi:0,m:'Manrope',mw:700,mtc:'upper',mls:.14,tag:{pop:2,colorful:1,tech:1}},
 {id:'unbounded',n:'Unbounded · DM Sans',h:'Unbounded',hw:700,hls:-.04,hlh:1,b:'DM Sans',bw:400,blh:1.5,bfs:.95,s:'DM Sans',sw:600,q:'Unbounded',qw:500,qi:0,m:'DM Mono',mw:500,mtc:'upper',mls:.06,tag:{tech:2,pop:2,colorful:1},hmax:.7},
 {id:'anton',n:'Anton · Inter',h:'Anton',hw:400,hls:0,hlh:.95,htc:'upper',b:'Inter',bw:400,blh:1.5,bfs:.9,s:'Inter',sw:700,q:'Anton',qw:400,qi:0,qtc:'upper',m:'Inter',mw:700,mtc:'upper',mls:.16,tag:{pop:2,dark:1,sport:2}},
 {id:'bebas',n:'Bebas Neue · Work Sans',h:'Bebas Neue',hw:400,hls:.01,hlh:.88,htc:'upper',b:'Work Sans',bw:400,blh:1.5,bfs:.92,s:'Work Sans',sw:600,q:'Bebas Neue',qw:400,qi:0,qtc:'upper',m:'Work Sans',mw:600,mtc:'upper',mls:.16,tag:{sport:2,pop:1,cool:1}},
 {id:'archivo',n:'Archivo Black · Archivo',h:'Archivo Black',hw:400,hls:-.03,hlh:.92,b:'Archivo',bw:400,blh:1.48,bfs:.93,s:'Archivo',sw:600,q:'Archivo',qw:600,qi:1,m:'Archivo',mw:600,mtc:'upper',mls:.12,tag:{pop:1,tech:1,sport:1}}
];
/* görsel karakterinden etiketler */
function moodOf(info){const t={};if(!info)return{mono:.5,classic:.5};const[h,s,l]=r2hsl(info.vivid);
 if(info.mono||info.colorful<.12)t.mono=1.5;if(info.meanL<.22)t.dark=1;if(info.colorful>.35)t.colorful=1,t.pop=.8;
 if((h<.12||h>.92)&&s>.25)t.warm=1,t.food=info.colorful>.25?.8:.3;if(h>.45&&h<.75&&s>.2)t.cool=1;
 if(info.plain)t.lux=.6,t.tech=.4;if(info.meanL>.7&&info.colorful<.2)t.lux=(t.lux||0)+.5;if(!Object.keys(t).length)t.classic=1;return t}
function rankPairs(info){const md=moodOf(info);return PAIRS.map(p=>({p,s:Object.keys(md).reduce((a,k)=>a+(p.tag[k]||0)*md[k],0)})).sort((a,b)=>b.s-a.s).map(x=>x.p)}

/* baskı puntosu -> birim: pt = fs/100 * mm * 2.835 */
const pt2u=pt=>pt*100/(S.mm[0]*2.835);
function bodyPt(k){const w=S.mm[0],h=S.mm[1],sh=Math.min(w,h);return Math.max(7,clamp(sh*.045,8.2,16)*(k||1))}

/* ölçüm: render ve draw ile aynı satır kırma (wrap) mantığı, 10x ölçekte */
const KM=10;
function setFont(e,fs){SC.font=fnt(e,fs*KM);SC.fs=fs*KM;SC.u=KM;if('letterSpacing'in SC)SC.letterSpacing=(e.ls||0)*fs*KM+'px';if('wordSpacing'in SC)SC.wordSpacing=(e.ws||0)*fs*KM+'px'}
function meas(e,w,fs,cc){cc=cc||1;setFont(e,fs);const L=wrap(SC,e,w*KM,cc),colw=(w-(cc-1)*S.gut)/cc;let mw=0,bad=false,words=0;
 L.forEach(l=>{const x=SC.measureText(tcf(e,l)).width/KM;if(x>mw)mw=x;if(x>colw+.02)bad=true;words+=l?l.split(' ').length:0});
 const per=Math.ceil(L.length/cc);return{n:L.length,per,h:per*e.lh*fs,mw:Math.min(mw,w),bad,L}}
const txtOf=e=>String(tk(e.tg&&e.dt!=null?e.dt:e.txt)||'');
/* en uzun kelime bu genişliğe sığar mı (tek kelimelik taşmalar) */
function longestWord(e,fs){setFont(e,fs);return Math.max(0,...txtOf(e).split(/\s+/).filter(Boolean).map(w=>SC.measureText(tcf(e,w)).width/KM))}

/* yazı tipinin gerçek ölçüleri: harf uzanımı (Ç, Ğ, g, y) ve yazı tipi kutusu; satır kutusunun üstüne/altına taşan pay */
const INKC=new Map();
function fontInk(e){const k=fnt(e,100);if(INKC.has(k))return INKC.get(k);SC.font=k;if('letterSpacing'in SC)SC.letterSpacing='0px';const t=SC.measureText(tcf(e,'ÇĞİÖŞÜÂÉ gjpyqş|'));
 const v={fA:t.fontBoundingBoxAscent||80,fD:t.fontBoundingBoxDescent||22,aA:t.actualBoundingBoxAscent||80,aD:t.actualBoundingBoxDescent||22};if(document.fonts.check(k))INKC.set(k,v);return v}
function inkPad(o){const f=fontInk(o),k=o.fs/100,lb=o.lh*o.fs,fA=f.fA*k,fD=f.fD*k,half=(lb-(fA+fD))/2,base=half+fA,pad=o.fs*.03;
 return[Math.max(0,-half,f.aA*k-base)+pad,Math.max(0,-half,f.aD*k-(lb-base))+pad]}
window.v4adLib={inkPad,h2r,r2h,contrast,ensure,mixH,lumH,analyze,region,boxToImg,PAIRS,rankPairs,moodOf,meas,pt2u,bodyPt,clamp,bestInk,longestWord,txtOf};
})();
