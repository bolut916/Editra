/* =====================================================================
   OTOMATİK TASARIM MOTORU 2/2: renk şemaları, düzen kalıpları, denetçi, arama, arayüz
   Kütüphane: js/23-oto-tasarim.js (window.v4adLib)
   ===================================================================== */
(function(){
'use strict';
const X=window.v4adLib;if(!X||typeof S=='undefined')return;
const{h2r,r2h,contrast,ensure,mixH,lumH,analyze,region,boxToImg,PAIRS,rankPairs,meas,pt2u,bodyPt,clamp,bestInk,longestWord,txtOf}=X;

/* ---------------------------------------------------------- rastgele */
const rng=seed=>{let a=(seed*2654435761)>>>0||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const hashStr=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};

/* ------------------------------------------------------ renk şemaları */
/* bg: sayfa, tx: gövde ve başlık, ac: vurgu (alt başlık, alıntı), mu: künye */
function schemes(info){const L=[],add=(id,n,bg,tx,ac,extra)=>{
  tx=ensure(tx,bg,7);ac=ensure(ac,bg,4.5);if(contrast(ac,tx)<1.25)ac=ensure(mixH(ac,lumH(bg)>.4?'#000000':'#ffffff',.25),bg,4.5);
  const mu=ensure(mixH(tx,bg,.28),bg,4.6);if(contrast(tx,bg)<7||contrast(ac,bg)<4.5||contrast(mu,bg)<4.5)return;
  L.push({id,n,bg,tx,ac,mu,dark:lumH(bg)<.2,...(extra||{})})};
 if(!info){add('kagit','Kâğıt','#f6f2ea','#171513','#b3261e');add('gece','Gece','#101012','#f1eee8','#ff6a3d');add('mono','Mono','#ffffff','#111111','#111111');return L}
 const dk=r2h(info.dark),lt=r2h(info.light),vv=r2h(info.vivid);
 if(info.plain){const bg=info.bgc;add('zemin','Görselin zemini',bg,bestInk(bg,dk),vv,{seam:1})}
 add('kagit','Kâğıt',mixH(lt,'#ffffff',.82),mixH(dk,'#000000',.78),vv);
 add('gece','Gece',mixH(dk,'#000000',.72),mixH(lt,'#ffffff',.86),vv);
 const dom=r2h(info.pal[0].c);if(lumH(dom)>.08&&lumH(dom)<.85){const bg=mixH(dom,lumH(dom)>.4?'#ffffff':'#000000',.35);add('ton','Görselin tonu',bg,bestInk(bg,dk),vv)}
 const vl=lumH(vv);if(info.colorful>.15&&vl>.04&&vl<.6){const bg=vv;add('renkli','Cesur renk',bg,bestInk(bg),bestInk(bg)==='#121212'||lumH(bestInk(bg))<.2?mixH(bg,'#000000',.62):mixH(bg,'#ffffff',.7))}
 add('mono','Mono',info.meanL<.3?'#0d0d0d':'#fbfaf7',info.meanL<.3?'#f3f1ec':'#111111',vv);
 add('krem','Krem',mixH('#f3ead9',lt,.15),'#1d1a16',vv);
 const seen=new Set();return L.filter(s=>{const k=s.bg+s.tx;if(seen.has(k))return false;seen.add(k);return true})}

/* --------------------------------------------- görsel işlemleri (efekt) */
const TREAT={
 dogal:{n:'Doğal',p:{gray:0,sep:0,sat:100,con:100,bri:100,hue:0,blr:0,inv:0,duo:false}},
 sb:{n:'Siyah-beyaz',p:{gray:100,sep:0,sat:100,con:112,bri:100,hue:0,blr:0,inv:0,duo:false}},
 sicak:{n:'Sıcak film',p:{gray:0,sep:22,sat:108,con:104,bri:102,hue:0,blr:0,inv:0,duo:false}},
 canli:{n:'Canlı',p:{gray:0,sep:0,sat:128,con:108,bri:100,hue:0,blr:0,inv:0,duo:false}},
 duo:{n:'Duoton',duo:1,p:{gray:0,sep:0,sat:100,con:105,bri:100,hue:0,blr:0,inv:0,duo:true}}};

/* ------------------------------------------------------- bağlam */
const SPECIAL=e=>e.cid||e.ch||e.fn||e.tg||e.emb||e.lock||e.shape=='draw'||e.gid;
const isDec=e=>e.type=='r'&&!e.adx&&!e.lock&&!e.gid&&!e.cid&&!e.ch&&!e.fn&&!e.emb;
function collect(){const M={img:[],t:[],s:[],b:[],q:[],m:[],dec:[]},obs=[];
 S.els.forEach(e=>{if(e.adx||!e.on)return;if(isDec(e))M.dec.push(e);else if(!SPECIAL(e)&&M[e.type])M[e.type].push(e);else obs.push(e)});
 /* fazladan başlıklar alt başlık gibi davranır */
 if(M.t.length>1){M.s=[...M.t.slice(1),...M.s];M.t=M.t.slice(0,1)}
 return{M,obs}}
function ctxFor(pair,M,ks){const H=100/S.fmt,short=Math.min(100,H),m=clamp(short*.068,3.6,9),g=clamp(short*.024,1.3,3.2),cw=(100-2*m-11*g)/12,
 bfs=pt2u(bodyPt(ks))*pair.bfs,bl=bfs*pair.blh;
 return{H,m,g,cw,bfs,bl,pair,M,ks:ks||1,X:c=>m+c*(cw+g),Wc:n=>n*cw+(n-1)*g,imgs:M.img.map(e=>({e,info:e.src&&e.im&&e.im.complete?analyze(e.im):null}))}}

/* metin stili (ölçümden önce kopyaya uygulanır) */
function styleFor(e,role,C,sc){const p=C.pair,b=C.bfs,o={sw:0,gr:false,sb:0,sx:0,sy:0,ws:0,ind:0,cc:1,va:'start',vert:false,bend:0,wr:false,op:100,rot:0,dx:0,dy:0,al:'left',it:false,tc:'none'};
 if(role=='t')Object.assign(o,{ff:p.h,fw:p.hw,lh:p.hlh,ls:p.hls,tc:p.htc||'none',col:sc.tx,fs:b*6});
 else if(role=='s')Object.assign(o,{ff:p.s,fw:p.sw,lh:1.18,ls:-.005,col:sc.ac,fs:b*2.05});
 else if(role=='b')Object.assign(o,{ff:p.b,fw:p.bw,lh:p.blh,ls:0,col:sc.tx,fs:b});
 else if(role=='q')Object.assign(o,{ff:p.q,fw:p.qw,lh:1.1,ls:-.01,it:!!p.qi,tc:p.qtc||'none',col:sc.ac,fs:b*2.5});
 else if(role=='m')Object.assign(o,{ff:p.m,fw:p.mw,lh:1.3,ls:p.mls,tc:p.mtc||'upper',col:sc.mu,fs:b*.8});
 return Object.assign({...e},o)}

/* ------------------------------------------------- yerleşim yardımcıları */
/* satır yüksekliği 1'den küçükse harfler kutudan taşar (Ş, Ğ, ç); üst ve alt mürekkep payı */
const inkTop=o=>X.inkPad(o)[0],inkBot=o=>X.inkPad(o)[1];
/* Plan: T = metin öğeleri {id → {o (stilli kopya), r:[x,y,w,h], role, k (ölçüm)}}, I = görseller, D = süsler */
function newPlan(C,sc,lay){return{C,sc,lay,T:new Map(),I:new Map(),D:[],ov:new Map(),al:'left'}}
function putText(P,e,role,x,y,w,o){const C=P.C;const s=styleFor(e,role,C,P.sc);if(o&&o.al)s.al=o.al;if(o&&o.fs)s.fs=o.fs;if(o&&o.cc)s.cc=o.cc;
 let k=meas(s,w*.97,s.fs,s.cc);const lim={s:[4,1.45],q:[6,1.6]}[role];if(lim&&!(o&&o.fs)){while((k.bad||k.n>lim[0])&&s.fs>C.bfs*lim[1]+.001){s.fs=Math.max(C.bfs*lim[1],s.fs-C.bfs*.15);k=meas(s,w*.97,s.fs,s.cc)}}if(k.bad)return-1;const it=inkTop(s);P.T.set(e.id,{o:s,r:[x,y+it,w,k.h],role,k});return it+k.h+inkBot(s)}
/* başlık: verilen alana sığan en büyük punto (ikili arama) */
function putTitle(P,e,x,y,w,maxH,o){const C=P.C,s=styleFor(e,'t',C,P.sc);if(o&&o.al)s.al=o.al;
 let lo=C.bfs*2.6,hi=Math.min((o&&o.max)||40,w*(C.pair.hmax||1)*.5,maxH/s.lh),best=null;if(hi<lo)return-1;
 if(longestWord(s,lo)>w*.97)return-1;
 for(let i=0;i<14;i++){const f=(lo+hi)/2;s.fs=f;const k=meas(s,w*.97,f,1);if(!k.bad&&k.h+inkTop(s)+inkBot(s)<=maxH&&k.n<=4){best=f;lo=f}else hi=f}
 if(!best)return-1;const f=Math.floor(best*4)/4;s.fs=f;const k=meas(s,w*.97,f,1),it=inkTop(s);P.T.set(e.id,{o:s,r:[x,y+it,w,k.h],role:'t',k});return it+k.h+inkBot(s)}
/* paragrafları ve alıntıları sütunlara akıt (öğeler bölünmez) */
function flow(P,list,cols){const C=P.C;let ci=0,y=cols.length?cols[0][1]:0,first=true;
 for(const it of list){const role=it.type=='q'?'q':'b';let done=false;
  while(ci<cols.length&&!done){const[cx,cy,cw2,ch]=cols[ci];if(first)y=cy;const pad=role=='q'&&!first?C.bl*.8:0;
   const h=putText(P,it,role,cx,y+pad,cw2);if(h<0)return false;
   if(y+pad+h<=cy+ch+.01){done=true;y+=pad+h+(role=='q'?C.bl*1.2:C.bl*.85);first=false}else{P.T.delete(it.id);ci++;first=true}}
  if(!done)return false}
 return true}
/* sütun sayısı: satır başına 32–75 karakter */
function colsFor(C,w){const cpl=k=>((w-(k-1)*C.g)/k)/(C.bfs*.5);let best=1;for(let k=1;k<=4;k++){const c=cpl(k);if(c>=32&&c<=78){best=k;break}if(c>78)best=k+1}return clamp(best,1,4)}
/* künye satırı: 1 künye solda; 2 künye aynı satırda sol + sağ; daha fazlası alt alta */
function metaRow(P,list,x,y,w,al){const C=P.C;if(!list.length)return 0;
 if(list.length==2&&al!='center'){const hw=(w-C.g)/2,a=putText(P,list[0],'m',x,y,hw),b=putText(P,list[1],'m',x+hw+C.g,y,hw,{al:'right'});if(a>=0&&b>=0&&P.T.get(list[0].id).k.n==1&&P.T.get(list[1].id).k.n==1)return Math.max(a,b);list.forEach(e=>P.T.delete(e.id))}
 const gp=Math.max(C.bl*.3,C.g*.6);let yy=y;for(const e of list){const h=putText(P,e,'m',x,yy,w,{al});if(h<0)return-1;yy+=h+gp}return yy-y-gp}
function metaShift(P,list,dy){list.forEach(e=>{const t=P.T.get(e.id);if(t)t.r[1]+=dy})}
/* metin yığını: künye, başlık, alt başlık, gövde akışı (+künye altta) */
function textStack(P,R,o){const keys=new Set(P.T.keys()),nD=P.D.length,base=o.tmax||.42;
 for(const tm of[base,Math.max(base,.52),Math.max(base,.64)]){if(!stack1(P,R,{...o,tmax:tm}))return false;
  const used=[...P.T.entries()].filter(([id,t])=>!keys.has(id)&&t.role!='m').map(([,t])=>inkRect(t)),top=Math.min(...used.map(r=>r[1])),bot=Math.max(...used.map(r=>r[1]+r[3])),fill=used.length?(bot-top)/R[3]:1;
  if(fill>.72||!P.C.M.t[0]||o.va=='spread')return true;[...P.T.keys()].forEach(id=>{if(!keys.has(id))P.T.delete(id)});P.D.length=nD}
 return stack1(P,R,o)}
function stack1(P,R,o){const C=P.C,M=C.M,[x,y0,w,h]=R,al=o.al||'left';let y=y0;const bottom=y0+h;
 const metas=M.m,metaBot=o.meta=='bottom'&&metas.length>0;
 if(metas.length&&o.meta=='top'){const mh=metaRow(P,metas,x,y,w,al);if(mh<0)return false;y+=mh+C.bl*1.1}
 if(o.rule){P.D.push({k:'rule',r:[al=='center'?x+w/2-6:x,y,12,.35],col:P.sc.ac});y+=.35+C.bl*.9}
 if(M.t[0]){const tw=w*(o.tw||1),th=putTitle(P,M.t[0],al=='center'?x+(w-tw)/2:x,y,tw,h*(o.tmax||.42),{al});if(th<0)return false;y+=th+C.bl*.95}
 for(const s of M.s){const sw=Math.min(w,Math.max(C.bfs*30,w*(o.sw||.85)));const sh=putText(P,s,'s',al=='center'?x+(w-sw)/2:x,y,sw,{al});if(sh<0)return false;y+=sh+C.bl*.9}
 let metaH=0;if(metaBot){const mh=metaRow(P,metas,x,0,w,al);if(mh<0)return false;metaH=mh;metaShift(P,metas,bottom-mh)}
 const body=[...M.b,...M.q];const bh=bottom-(metaBot?metaH+C.bl*1.2:0)-y-C.bl*.3;
 if(body.length){if(bh<C.bl*3)return false;const k=o.cols||colsFor(C,w),cwk=(w-(k-1)*C.g)/k;
  const cols=Array.from({length:k},(_,i)=>[x+i*(cwk+C.g),y+C.bl*.3,cwk,bh]);if(!flow(P,body,cols))return false}
 /* dikey hizalama: alta yasla ya da yay */
 if(o.va&&o.va!='top'){const used=[...P.T.values()].filter(t=>inR(t.r,R)).reduce((a,t)=>Math.max(a,t.r[1]+t.r[3]),y0),gap=bottom-used-(metaBot?0:0);
  if(gap>C.bl&&o.va=='bottom'){P.T.forEach((t,id)=>{if(inR(t.r,R)&&!(metaBot&&metas.some(e=>e.id==id)))t.r[1]+=gap})}
  else if(gap>C.bl&&o.va=='center'){P.T.forEach((t,id)=>{if(inR(t.r,R)&&!(metaBot&&metas.some(e=>e.id==id)))t.r[1]+=gap/2})}
  else if(gap>C.bl&&o.va=='spread'){const lim=P.T.get(M.t[0]&&M.t[0].id);const split=lim?lim.r[1]+lim.r[3]:y0;P.T.forEach((t,id)=>{if(inR(t.r,R)&&t.r[1]>split+.01&&!(metaBot&&metas.some(e=>e.id==id)))t.r[1]+=gap})}}
 return true}
const inR=(r,R)=>r[0]>=R[0]-.01&&r[0]<=R[0]+R[2]+.01&&r[1]>=R[1]-.01&&r[1]<=R[1]+R[3]+.01;
/* görseller: bir alanda satırlara yerleştir (galeri / şerit) */
function imgRows(P,list,R,cols){const C=P.C;if(!list.length)return true;const[x,y,w,h]=R,n=list.length,c=cols||Math.min(n,n<=2?n:n<=4?2:3),rows=Math.ceil(n/c),ch=(h-(rows-1)*C.g)/rows;if(ch<C.bl*3)return false;
 list.forEach((im,i)=>{const r=Math.floor(i/c),inRow=Math.min(c,n-r*c),cw2=(w-(inRow-1)*C.g)/inRow,k=i-r*c;P.I.set(im.e.id,{r:[x+k*(cw2+C.g),y+r*(ch+C.g),cw2,ch],info:im.info})});return true}
function imgStack(P,list,R){const C=P.C;if(!list.length)return true;const[x,y,w,h]=R,asp=list.map(i=>i.info?i.info.a:1.3),tot=asp.reduce((s,a)=>s+w/a,0)+(list.length-1)*C.g,k=Math.min(1,(h-(list.length-1)*C.g)/(tot-(list.length-1)*C.g));let yy=y;
 list.forEach((im,i)=>{const hh=Math.max(C.bl*3,w/asp[i]*k);P.I.set(im.e.id,{r:[x,yy,w,hh],info:im.info});yy+=hh+C.g});return yy-C.g<=y+h+.01}

/* ------------------------------------------------------- düzen kalıpları */
/* Her kalıp parametreli; her parametre birleşimi ayrı bir düzendir. */
const LAYOUTS=[];
const reg=(id,n,need,vars,fn)=>vars.forEach(v=>LAYOUTS.push({id:id+':'+Object.values(v).join('-'),arch:id,n,need,v,fn}));
const prod=(o)=>Object.entries(o).reduce((acc,[k,vs])=>acc.flatMap(a=>vs.map(v=>({...a,[k]:v}))),[{}]);

/* A · Üstte görsel (+ altında küçük görsel şeridi), altta metin */
reg('ust','Üstte görsel',n=>n>=1,prod({b:[1,0],hf:[.6,.5,.42],meta:['top','bottom'],va:['top','spread'],tw:[1,.72]}),(P,v)=>{const C=P.C,{m,g,H}=C,I=C.imgs;
 const W0=v.b?100:100-2*m,x0=v.b?0:m,y0=v.b?0:m,hero=I[0],a=hero.info?hero.info.a:1.4;let ih=clamp(W0/a,H*.3,H*v.hf);P.I.set(hero.e.id,{r:[x0,y0,W0,ih],info:hero.info,bleed:v.b});
 let y=y0+ih+g;const ex=I.slice(1);if(ex.length){const sh=clamp((100-2*m-(ex.length-1)*g)/ex.length/1.3,H*.1,H*.2);if(!imgRows(P,ex,[m,y,100-2*m,sh],ex.length))return false;y+=sh+g}
 y=Math.max(y+C.bl*.6,m);return textStack(P,[m,y,100-2*m,H-m-y],{meta:v.meta,va:v.va,tw:v.tw,rule:v.meta=='top'})});
/* B · Altta görsel, üstte metin */
reg('alt','Altta görsel',n=>n==1,prod({b:[1,0],hf:[.55,.45],meta:['top'],tw:[1,.8],rule:[0,1]}),(P,v)=>{const C=P.C,{m,g,H}=C,hero=C.imgs[0],a=hero.info?hero.info.a:1.4,W0=v.b?100:100-2*m,x0=v.b?0:m;
 const ih=clamp(W0/a,H*.3,H*v.hf),iy=v.b?H-ih:H-m-ih;P.I.set(hero.e.id,{r:[x0,iy,W0,ih],info:hero.info,bleed:v.b});return textStack(P,[m,m,100-2*m,iy-m-g*1.2],{meta:v.meta,tw:v.tw,rule:v.rule,va:'top'})});
/* C · Yanda görsel (tam boy ya da kenar boşluklu); birden çok görsel yan sütunda dikey şerit olur */
reg('yan','Yanda görsel',n=>n>=1&&n<=4,prod({side:['l','r'],span:[7,6,5],b:[1,0],meta:['top','bottom'],va:['top','bottom','spread']}),(P,v)=>{const C=P.C,{m,g,H,X,Wc}=C,I=C.imgs;
 const sp=v.span,left=v.side=='l';let ix=left?X(0):X(12-sp),iw=Wc(sp),iy=m,ih=H-2*m;if(v.b){if(left){iw+=ix;ix=0}else iw=100-ix;iy=0;ih=H}
 if(I.length==1)P.I.set(I[0].e.id,{r:[ix,iy,iw,ih],info:I[0].info,bleed:v.b});else if(!imgStack(P,I,[ix,iy,iw,ih]))return false;
 const tx=left?X(sp):X(0),tw=Wc(12-sp);return textStack(P,[tx,m,tw,H-2*m],{meta:v.meta,va:v.va,cols:1,tmax:.36})});
/* D · Başlık üstte, görsel ortada, gövde altta */
reg('cerceve','Başlık · görsel · metin',n=>n>=1&&n<=3,prod({hf:[.42,.34],meta:['top','bottom'],al:['left','center'],tw:[1,.75]}),(P,v)=>{const C=P.C,{m,g,H}=C,M=C.M,I=C.imgs;let y=m;
 if(v.meta=='top'&&M.m.length){const h=metaRow(P,M.m,m,y,100-2*m,v.al);if(h<0)return false;y+=h+C.bl}
 if(M.t[0]){const tw=(100-2*m)*v.tw,h=putTitle(P,M.t[0],v.al=='center'?(100-tw)/2:m,y,tw,H*.22,{al:v.al});if(h<0)return false;y+=h+C.bl*.9}
 for(const s of M.s){const h=putText(P,s,'s',m,y,100-2*m,{al:v.al});if(h<0)return false;y+=h+C.bl*.8}
 y+=C.bl*.4;const ih=H*v.hf;if(!imgRows(P,I,[m,y,100-2*m,ih],I.length))return false;y+=ih+g*1.2;
 const sub={...C,M:{...M,t:[],s:[],m:v.meta=='bottom'?M.m:[]}};const P2={...P,C:sub};return textStack(P2,[m,y,100-2*m,H-m-y],{meta:v.meta=='bottom'?'bottom':'none',al:v.al})});
/* E · Dev başlık üstte, altta görsel ve metin yan yana */
reg('dev','Dev başlık',n=>n>=1&&n<=2,prod({side:['l','r'],span:[7,8],meta:['top','bottom']}),(P,v)=>{const C=P.C,{m,g,H,X,Wc}=C,M=C.M,I=C.imgs;let y=m;
 if(v.meta=='top'&&M.m.length){const h=metaRow(P,M.m,m,y,100-2*m,'left');if(h<0)return false;y+=h+C.bl}
 if(M.t[0]){const h=putTitle(P,M.t[0],m,y,100-2*m,H*.3,{max:60});if(h<0)return false;y+=h+C.bl*1.1}
 const left=v.side=='l',ix=left?X(0):X(12-v.span),iw=Wc(v.span),ih=H-m-y;if(ih<H*.3)return false;
 if(!imgStack(P,I,[ix,y,iw,ih]))return false;const sub={...C,M:{...M,t:[],m:v.meta=='bottom'?M.m:[]}};return textStack({...P,C:sub},[left?X(v.span):X(0),y,Wc(12-v.span),ih],{meta:v.meta=='bottom'?'bottom':'none',cols:1,va:'top'})});
/* F · Kapak: tam sayfa görsel; metin sakin bölgede ya da okunurluk kartında */
reg('kapak','Tam sayfa kapak',n=>n==1,prod({zone:['ust','alt','sol','sag'],card:[0,1],al:['left','center']}),(P,v)=>{const C=P.C,{m,g,H}=C,M=C.M,im=C.imgs[0];if(!im.info)return false;
 const nTxt=M.b.length+M.q.length;if(nTxt>2&&!v.card)return false;P.I.set(im.e.id,{r:[0,0,100,H],info:im.info,bleed:1});
 const Z={ust:[m,m,100-2*m,H*.42],alt:[m,H*.5,100-2*m,H*.5-m],sol:[m,m,(100-2*m)*.55,H-2*m],sag:[m+(100-2*m)*.45,m,(100-2*m)*.55,H-2*m]}[v.zone];
 if(v.al=='center'&&(v.zone=='sol'||v.zone=='sag'))return false;
 const pad=v.card?C.g*1.2:0,R=[Z[0]+pad,Z[1]+pad,Z[2]-2*pad,Z[3]-2*pad];if(!textStack(P,R,{meta:'top',al:v.al,va:v.zone=='alt'?'bottom':'top',tmax:.5}))return false;
 const rs=[...P.T.values()].map(t=>inkRect(t)),bx=[Math.min(...rs.map(r=>r[0]))-pad,Math.min(...rs.map(r=>r[1]))-pad,0,0];bx[2]=Math.max(...rs.map(r=>r[0]+r[2]))+pad-bx[0];bx[3]=Math.max(...rs.map(r=>r[1]+r[3]))+pad-bx[1];
 if(v.card){P.D.push({k:'card',r:bx,col:P.sc.bg,op:94})}else P.T.forEach(t=>P.ov.set(t,im.e.id));return true});
/* G · Galeri: başlık, düzenli görsel ızgarası, altında metin (görsel başına açıklama varsa altına yazılır) */
reg('galeri','Galeri ızgarası',n=>n>=2,prod({c:[2,3,4],hf:[.62,.5,.72],meta:['top','bottom'],al:['left','center']}),(P,v)=>{const C=P.C,{m,g,H}=C,M=C.M,I=C.imgs;let y=m;
 if(I.length<v.c)return false;if(v.meta=='top'&&M.m.length){const h=metaRow(P,M.m,m,y,100-2*m,v.al);if(h<0)return false;y+=h+C.bl}
 if(M.t[0]){const h=putTitle(P,M.t[0],v.al=='center'?m+(100-2*m)*.1:m,y,(100-2*m)*(v.al=='center'?.8:1),H*.18,{al:v.al});if(h<0)return false;y+=h+C.bl*.9}
 for(const s of M.s){const h=putText(P,s,'s',m,y,100-2*m,{al:v.al});if(h<0)return false;y+=h+C.bl*.8}
 const caps=M.b.length==I.length&&I.length>=3,gh=H*v.hf;
 if(caps){const n=I.length,c=v.c,rows=Math.ceil(n/c),cw2=(100-2*m-(c-1)*g)/c;const capH=Math.max(...M.b.map(b=>{const s=styleFor(b,'b',C,P.sc);s.fs=C.bfs*.92;return meas(s,cw2*.97,s.fs,1).h}))+C.bl*.4;
  const rh=(H-m-y-(rows-1)*g-(v.meta=='bottom'?C.bl*2.4:0))/rows,ih=rh-capH;if(ih<C.bl*4)return false;
  for(let i=0;i<n;i++){const r=Math.floor(i/c),k=i%c,xx=m+k*(cw2+g),yy=y+r*(rh+g);P.I.set(I[i].e.id,{r:[xx,yy,cw2,ih],info:I[i].info});if(putText(P,M.b[i],'b',xx,yy+ih+C.bl*.4,cw2,{fs:C.bfs*.92})<0)return false}
  if(M.q.length)return false;if(v.meta=='bottom'&&M.m.length){const h=metaRow(P,M.m,m,0,100-2*m,v.al);if(h<0)return false;metaShift(P,M.m,H-m-h)}return true}
 if(!imgRows(P,I,[m,y,100-2*m,gh],v.c))return false;y+=gh+g*1.2;const sub={...C,M:{...M,t:[],s:[],m:v.meta=='bottom'?M.m:[]}};return textStack({...P,C:sub},[m,y,100-2*m,H-m-y],{meta:v.meta=='bottom'?'bottom':'none',al:v.al})});
/* G2 · Yan galeri: görsel ızgarası bir yanda, metin sütunu diğer yanda (yatay sayfalar ve çok görsel için) */
reg('galeriyan','Yan galeri',n=>n>=2,prod({side:['l','r'],span:[8,7,6],c:[2,3],meta:['top','bottom'],va:['top','spread']}),(P,v)=>{const C=P.C,{m,H,X,Wc}=C,I=C.imgs,left=v.side=='l';
 if(I.length<v.c)return false;const ix=left?X(0):X(12-v.span);if(!imgRows(P,I,[ix,m,Wc(v.span),H-2*m],v.c))return false;
 return textStack(P,[left?X(v.span):X(0),m,Wc(12-v.span),H-2*m],{meta:v.meta,va:v.va,cols:1,tmax:.4})});
/* H · Görselsiz tipografik sayfa */
reg('tipo','Tipografik',n=>n==0,prod({al:['left','center'],tw:[1,.8],meta:['top','bottom'],va:['top','spread','center']}),(P,v)=>{const C=P.C,{m,H}=C;return textStack(P,[m,m,100-2*m,H-2*m],{meta:v.meta,al:v.al,tw:v.tw,va:v.va,tmax:.5,rule:v.al=='left'})});

/* ------------------------------------------------------------- denetçi */
/* Gerçek yazı alanı: satır yüksekliği 1'den küçükse harfler kutudan taşar (Ş, Ğ, ç), payı ekle */
function inkRect(t){const o=t.o,k=t.k,[x,y,w]=t.r,top=inkTop(o),bot=inkBot(o),mw=o.cc>1?w:Math.min(w,k.mw),
 rx=o.al=='center'?x+(w-mw)/2:o.al=='right'?x+w-mw:x;return[rx,y-top,mw,k.h+top+bot]}
const hit=(a,b,pad)=>a[0]<b[0]+b[2]+pad&&b[0]<a[0]+a[2]+pad&&a[1]<b[1]+b[3]+pad&&b[1]<a[1]+a[3]+pad;
const area=r=>Math.max(0,r[2])*Math.max(0,r[3]);
function validate(P){const C=P.C,{m,g,H,bfs}=C,sc=P.sc,why=[],T=[...P.T.entries()],I=[...P.I.entries()];
 const fail=s=>{why.push(s);return{ok:false,why}};
 /* yerleştirilmemiş öğe kalmasın */
 const M=C.M,want=[...M.t,...M.s,...M.b,...M.q,...M.m];for(const e of want)if(!P.T.has(e.id))return fail('yerleşmeyen metin: '+e.type);
 for(const im of C.imgs)if(!P.I.has(im.e.id))return fail('yerleşmeyen görsel');
 /* metin: sığma, satır sayıları, punto, ölçü */
 for(const[id,t]of T){const o=t.o,k=meas(o,t.r[2],o.fs,o.cc);if(k.bad)return fail('satır taşması '+t.role);if(k.h>t.r[3]+.02)return fail('kutudan taşma '+t.role);
  if(t.role=='t'&&k.n>(txtOf(o).length>40?5:4))return fail('başlık çok satır');if(t.role=='s'&&k.n>5)return fail('alt başlık çok satır');
  if(t.role=='m'&&k.n>1)return fail('künye tek satır değil');if(t.role=='q'&&k.n>7)return fail('alıntı çok uzun');
  if(t.role=='b'){if(o.fs<pt2u(6.95)-.001)return fail('gövde puntosu küçük');const ch=txtOf(o).length,cpl=ch/Math.max(1,k.n);if(k.n>=3&&(cpl<24||cpl>88))return fail('satır uzunluğu '+Math.round(cpl))}
  if(!P.ov.has(t)){const need=t.role=='b'||t.role=='m'?4.5:3;const bg=P.cardOf&&P.cardOf.get(t)||sc.bg;if(contrast(o.col,bg)<need)return fail('kontrast '+t.role)}}
 /* hiyerarşi */
 const rf=r=>T.filter(([,t])=>t.role==r).map(([,t])=>t.o.fs),tf=rf('t')[0],sf=Math.max(0,...rf('s')),bf=Math.max(0,...rf('b')),qf=Math.max(0,...rf('q'));
 if(tf&&sf&&tf<sf*1.45)return fail('başlık/alt başlık oranı');if(tf&&bf&&tf<bf*2.4)return fail('başlık/gövde oranı');if(sf&&bf&&sf<bf*1.25)return fail('alt başlık/gövde oranı');if(qf&&bf&&qf<bf*1.4)return fail('alıntı/gövde oranı');
 /* sayfa sınırı */
 const IR=T.map(([id,t])=>({id,t,r:inkRect(t)}));
 for(const a of IR){const r=a.r,lim=m*.72;if(r[0]<lim-.01||r[1]<m*.55-.01||r[0]+r[2]>100-lim+.01||r[1]+r[3]>H-m*.55+.01)return fail('kenar boşluğuna taşma '+a.t.role)}
 for(const[id,q]of I){const r=q.r,eL=r[0]<=.01||r[0]>=m*.85,eT=r[1]<=.01||r[1]>=m*.85,eR=r[0]+r[2]>=99.99||r[0]+r[2]<=100-m*.85,eB=r[1]+r[3]>=H-.01||r[1]+r[3]<=H-m*.85;
  if(r[0]<-.01||r[1]<-.01||r[0]+r[2]>100.01||r[1]+r[3]>H+.01)return fail('görsel sayfa dışı');if(!(eL&&eT&&eR&&eB))return fail('görsel kenarı yarım taşma');
  if(area(r)<100*H*(C.imgs.length>=6?.022:.035))return fail('görsel çok küçük');
  if(q.info){const ba=r[2]/r[3],vis=Math.min(ba/q.info.a,q.info.a/ba);if(vis<(q.bleed&&C.imgs.length==1?.4:.5))return fail('aşırı kırpma '+vis.toFixed(2))}}
 /* çakışmalar */
 for(let i=0;i<IR.length;i++)for(let j=i+1;j<IR.length;j++)if(hit(IR[i].r,IR[j].r,g*.45))return fail('metin çakışması '+IR[i].t.role+'/'+IR[j].t.role);
 for(let i=0;i<I.length;i++)for(let j=i+1;j<I.length;j++)if(hit(I[i][1].r,I[j][1].r,g*.6-.01))return fail('görsel çakışması');
 const obsR=C.obs?C.obs.map(boxOf):[];for(const o of obsR)for(const[,q]of I)if(hit(o,q.r,g*.3))return fail('sabit öğe görselle çakışıyor');
 for(const a of IR){for(const o of obsR)if(hit(a.r,o,g*.3))return fail('sabit öğeyle çakışma');
  for(const[id,q]of I){if(!hit(a.r,q.r,g*.5))continue;
   if(P.ov.has(a.t)&&q.info){const u=boxToImg(q.info,q.r,q.info.fx,q.info.fy,a.r),R=region(q.info,clamp(u[0],0,1),clamp(u[1],0,1),clamp(u[2],0,1),clamp(u[3],0,1)),bg=r2h(R.c),need=a.t.role=='b'||a.t.role=='m'?4.5:3.2;
    const worst=lumH(a.t.o.col)>.4?r2h([R.lmax*255,R.lmax*255,R.lmax*255]):r2h([R.lmin*255,R.lmin*255,R.lmin*255]);
    if(contrast(a.t.o.col,bg)<need||R.e>(a.t.role=='t'?.2:.13)||contrast(a.t.o.col,worst)<2)return fail('görsel üstünde okunmuyor '+a.t.role);continue}
   if(P.D.some(d=>d.k=='card'&&a.r[0]>=d.r[0]-.01&&a.r[1]>=d.r[1]-.01&&a.r[0]+a.r[2]<=d.r[0]+d.r[2]+.01&&a.r[1]+a.r[3]<=d.r[1]+d.r[3]+.01))continue;
   return fail('metin görselin üstünde '+a.t.role)}}
 for(const d of P.D)if(d.k=='rule'){for(const a of IR)if(hit(d.r,a.r,g*.15))return fail('çizgi metne değiyor');for(const[,q]of I)if(hit(d.r,q.r,0))return fail('çizgi görselde')}
 /* büyük boşluk: içerik alanında uzun boş yatay şerit kalmasın */
 const all=[...IR.filter(a=>a.t.role!='m'&&a.r[3]>=C.bl*1.4).map(a=>a.r),...I.map(([,q])=>q.r),...P.D.filter(d=>d.k=='card').map(d=>d.r)],N=48,occ=new Array(N).fill(0),y0=m,y1=H-m;
 all.forEach(r=>{for(let k=0;k<N;k++){const a=y0+(y1-y0)*k/N,b=y0+(y1-y0)*(k+1)/N;if(r[1]<b&&r[1]+r[3]>a)occ[k]=1}});
 const sparse=M.b.length+M.q.length==0&&C.imgs.length<=1,gapMax=sparse?.46:.2,halfMax=sparse?.66:.42;
 let run=0,best=0;occ.forEach(o=>{run=o?0:run+1;best=Math.max(best,run)});if(best/N>gapMax)return fail('büyük boşluk '+Math.round(best/N*100)+'%');
 /* yarım sayfalık boşluk: sol ya da sağ yarıda uzun boş dikey alan */
 for(const half of[[0,50],[50,100]]){const o2=new Array(N).fill(0);all.forEach(r=>{if(r[0]<half[1]&&r[0]+r[2]>half[0])for(let k=0;k<N;k++){const a=y0+(y1-y0)*k/N,b=y0+(y1-y0)*(k+1)/N;if(r[1]<b&&r[1]+r[3]>a)o2[k]=1}});let r2=0,b2=0;o2.forEach(o=>{r2=o?0:r2+1;b2=Math.max(b2,r2)});if(b2/N>halfMax)return fail('yarı sayfada boşluk')}
 return{ok:true,why,score:score(P,IR,I,Math.min(.2,best/N*(sparse?.4:1)))}}
function score(P,IR,I,gapFr){const C=P.C,{H,bfs}=C,pa=100*H;let s=0;
 const imA=I.reduce((a,[,q])=>a+area(q.r),0)/pa,nb=C.M.b.length+C.M.q.length,target=C.imgs.length?(nb>=3?.38:.52):0;
 if(C.imgs.length)s+=26*(1-Math.min(1,Math.abs(imA-target)/target));
 const vis=I.map(([,q])=>q.info?Math.min(q.r[2]/q.r[3]/q.info.a,q.info.a/(q.r[2]/q.r[3])):1);s+=14*(vis.length?vis.reduce((a,b)=>a+b,0)/vis.length:1);
 const B=IR.filter(a=>a.t.role=='b');if(B.length){const cpl=B.reduce((a,b)=>a+txtOf(b.t.o).length/Math.max(1,b.t.k.n),0)/B.length;s+=14*(1-Math.min(1,Math.abs(cpl-55)/55))}else s+=10;
 const t=IR.find(a=>a.t.role=='t');if(t)s+=12*Math.min(1,t.t.o.fs/(bfs*7));
 const rs=[...IR.map(a=>a.r),...I.map(([,q])=>q.r)];let cx=0,cy=0,w=0;rs.forEach(r=>{const a=area(r);cx+=(r[0]+r[2]/2)*a;cy+=(r[1]+r[3]/2)*a;w+=a});if(w){cx/=w;cy/=w;s+=10*(1-Math.min(1,Math.hypot((cx-50)/50,(cy-H/2)/(H/2))))}
 s+=10*(1-gapFr/.2);const edges=new Set(rs.map(r=>Math.round(r[0]*2)));s+=8*(1-Math.min(1,Math.max(0,edges.size-2)/8));
 return Math.round(s*10)/10}

/* --------------------------------------------------------------- arama */
const SESS=new Map();let busy=0;
function sigOf(M){return JSON.stringify([S.fmt,S.mm,(M.dec||[]).map(e=>e.id+':'+(e.shape||'')),...['img','t','s','b','q','m'].map(k=>M[k].map(e=>k=='img'?(e.src||'').slice(-24):txtOf(e).length+':'+e.id))])}
async function prep(M){await Promise.all(M.img.map(e=>e.src&&e.im&&!e.im.complete?new Promise(r=>{e.im.addEventListener('load',r,{once:true});e.im.addEventListener('error',r,{once:true});setTimeout(r,4000)}):0))}
async function fontsFor(pairs){const fam=new Set();pairs.forEach(p=>['h','b','s','q','m'].forEach(k=>fam.add(p[k+'w']?`${p[k+'w']} 20px "${p[k]}"`:`20px "${p[k]}"`)));pairs.forEach(p=>{if(p.qi)fam.add(`italic ${p.qw} 20px "${p.q}"`)});
 await Promise.all([...fam].map(f=>document.fonts.load(f,'ÇĞİÖŞÜçğıöşü Aa').catch(()=>0)))}
const tick=()=>new Promise(r=>setTimeout(r,0));
/* bir sayfa için adayları üret: en iyi çiftler × şemalar × düzenler */
async function search(o){o=o||{};const{M,obs}=collect(),n=M.img.length,key=sigOf(M);await prep(M);
 const hero=M.img[0]&&M.img[0].src&&M.img[0].im.complete?analyze(M.img[0].im):null,pairs=rankPairs(hero),SC=schemes(hero),seed=o.seed!=null?o.seed:(hashStr(key)+(o.salt||0));
 const R=rng(seed),lays=LAYOUTS.filter(L=>L.need(n)),P0=pairs.slice(0,o.pairs||5);await fontsFor(P0);
 const sess={key,M,hero,pairs,SC,lays,res:[],tried:0,seed};let t0=performance.now();
 const scOrder=SC.slice().sort((a,b)=>(b.seam?3:0)-(a.seam?3:0));
 for(const ks of[1,.9,.8]){for(const pair of P0){for(const L of lays){const sc=scOrder[Math.floor(R()*Math.min(3,scOrder.length))]||scOrder[0];sess.tried++;const P=build(L,pair,sc,M,obs,ks);if(P){P.score+=R()*3-(1-ks)*20;sess.res.push(P)}
   if(performance.now()-t0>40){await tick();t0=performance.now()}}}if(sess.res.length)break}
 sess.res.sort((a,b)=>b.score-a.score);SESS.set(key,sess);return sess}

/* ------------------------------------------------------------- uygulama */
function applyPlan(P,treat,quiet){const C=P.C,sc=P.sc,M=C.M;
 S.els=S.els.filter(e=>!e.adx);
 S.bg=sc.bg;S.pc=[sc.tx,sc.ac];S.imgPal=[sc.bg,sc.tx,sc.ac];S.mar=+C.m.toFixed(2);S.gut=+C.g.toFixed(2);S.grain=0;S.vig=0;
 let z=0;const base=1e6;
 P.I.forEach((q,id)=>{const e=S.els.find(x=>x.id==id);if(!e)return;const tr=TREAT[treat||'dogal']||TREAT.dogal;
  Object.assign(e,{fr:q.r.map(v=>+v.toFixed(2)),pin:true,ad:1,fit:'cover',fx:q.info?Math.round(q.info.fx):50,fy:q.info?Math.round(q.info.fy):50,rot:0,dx:0,dy:0,rad:0,zm:1,op:100,on:true,blend:'normal',sb:0,sx:0,sy:0,lb:0,z:base+(++z)},tr.p);
  if(tr.duo){e.d1=sc.dark?sc.bg:sc.tx;e.d2=sc.dark?sc.ac:sc.bg}});
 (P.Dc||new Map()).forEach((d,id)=>{const e=S.els.find(x=>x.id==id);if(!e)return;if(!e._adp)e._adp=[e.pin?1:0,e.fr?1:0];
  Object.assign(e,{fr:d.r.map(v=>+v.toFixed(2)),dx:0,dy:0,pin:true,ad:1,on:true,z:d.bg?base*.5+(++z):base*1.7+(++z)});if(d.bg)e.rot=0});
 P.D.forEach(d=>{const e=mk('r');Object.assign(e,{shape:'rect',col:d.col,op:d.op||100,rad:0,fr:d.r.map(v=>+v.toFixed(2)),pin:true,adx:1,nm:d.k=='card'?'Okunurluk kartı':'Vurgu çizgisi',z:base*1.5+(++z)});S.els.push(e)});
 P.T.forEach((t,id)=>{const e=S.els.find(x=>x.id==id);if(!e)return;const o=t.o,keep=['ff','fw','fs','lh','ls','tc','it','col','al','va','cc','sw','gr','sb','sx','sy','ws','ind','vert','bend','wr','op','rot','dx','dy'];
  keep.forEach(k=>{if(k in o)e[k]=o[k]});e.fs=+o.fs.toFixed(3);e.fr=t.r.map(v=>+v.toFixed(2));e.fr[3]=+(t.r[3]+Math.min(.6,o.fs*.06)).toFixed(2);e.pin=true;e.ad=1;e.on=true;e.z=base*2+(++z);
  if(P.ov.has(t))e.col=o.col});
 S.sel=null;if(quiet)return;if(typeof MSEL!='undefined')MSEL.clear();render();list();ed();hist();try{palRender()}catch(x){}}
/* bindirme metinleri için renk: sakin bölgede açık ya da koyu mürekkep */
function overlayInk(P){P.ov.forEach((imgId,t)=>{const q=P.I.get(imgId);if(!q||!q.info)return;const r=inkRect(t),u=boxToImg(q.info,q.r,q.info.fx,q.info.fy,r),R=region(q.info,clamp(u[0],0,1),clamp(u[1],0,1),clamp(u[2],0,1),clamp(u[3],0,1)),bg=r2h(R.c);
 const w=t.role=='s'||t.role=='q'?mixH(P.sc.ac,'#ffffff',.6):'#ffffff',k=t.role=='s'||t.role=='q'?mixH(P.sc.ac,'#000000',.5):'#111111';t.o.col=contrast(w,bg)>=contrast(k,bg)?w:k})}
/* bir öğenin sayfadaki gerçek kutusu (konum + kaydırma + dönüş) */
function aabb(x,y,w,h,rot){const a=(rot||0)*Math.PI/180,c=Math.abs(Math.cos(a)),s2=Math.abs(Math.sin(a)),W2=w*c+h*s2,H2=w*s2+h*c;return[x+w/2-W2/2,y+h/2-H2/2,W2,H2]}
function boxOf(e){const g0=geo(e,100);return aabb(g0[0]+(e.dx||0),g0[1]+(e.dy||0),g0[2],g0[3],e.rot)}
/* kullanıcının eklediği şekiller tasarımın parçası: boş, ızgaraya hizalı bir yere konur (gerekirse küçültülür).
   Sayfanın yarısından büyük şekil arka plandır; o zaman yazılar o şeklin rengi üzerinde de okunmalıdır. */
function placeDecor(P){const C=P.C,{m,g,H,X,Wc,bl}=C,list=C.M.dec||[];P.Dc=new Map();if(!list.length)return true;
 const occ=[...[...P.T.values()].map(inkRect),...[...P.I.values()].map(q=>q.r),...P.D.map(d=>d.r),...(C.obs||[]).map(boxOf)],free=r=>!occ.some(o=>hit(r,o,g*.6));
 const txt=[...P.T.values()].map(inkRect),lefts=new Set(txt.map(r=>Math.round(r[0]*3)));
 const big=list.filter(e=>{const b=boxOf(e);return b[2]*b[3]>=100*H*.5}),small=list.filter(e=>!big.includes(e)).sort((a,b)=>{const p=boxOf(a),q=boxOf(b);return q[2]*q[3]-p[2]*p[3]});
 for(const e of big){if((e.op??100)>=40&&/^#[0-9a-f]{6}$/i.test(e.col||'')){for(const t of P.T.values()){if(P.ov.has(t))continue;const need=t.role=='b'||t.role=='m'?4.5:3;if(contrast(t.o.col,e.col)<need)return false}}P.Dc.set(e.id,{r:[0,0,100,H],bg:1})}
 for(const e of small){const g0=geo(e,100),w0=Math.max(.5,g0[2]),h0=Math.max(.3,g0[3]),asp=w0/h0,c0=[g0[0]+(e.dx||0)+w0/2,g0[1]+(e.dy||0)+h0/2],base=clamp(w0,4,34);let best=null;
  for(const k of[1,.85,.7,.55,.42]){const w=base*k,h=w/asp;if(w<3.5&&h<3.5)break;const bx=aabb(0,0,w,h,e.rot),ox=(bx[2]-w)/2,oy=(bx[3]-h)/2;
   const xs=[];for(let c=0;c<12;c++){xs.push(X(c));xs.push(X(c)+Wc(1)-bx[2])}
   for(const ax of xs)for(let ay=m*.6;ay+bx[3]<=H-m*.6;ay+=bl/2){const r=[ax,ay,bx[2],bx[3]];if(r[0]<m*.72||r[0]+r[2]>100-m*.72||!free(r))continue;
    const cx=ax+r[2]/2,cy=ay+r[3]/2,near=txt.length?Math.min(...txt.map(t=>Math.hypot(Math.max(0,t[0]-(ax+r[2]),ax-(t[0]+t[2])),Math.max(0,t[1]-(ay+r[3]),ay-(t[1]+t[3]))))):0,
     sc=(lefts.has(Math.round(ax*3))?3:0)-near*.12-Math.hypot(cx-c0[0],cy-c0[1])*.04+k*4;if(!best||sc>best.sc)best={sc,r:[ax+ox,ay+oy,w,h],bb:r}}
   if(best)break}
  if(!best)return false;occ.push(best.bb);P.Dc.set(e.id,{r:best.r,bb:best.bb})}
 return true}
/* kapak kalıbında bindirme renkleri denetimden önce belirlenmeli */
const DIAG={};function diag(k){DIAG[k]=(DIAG[k]||0)+1}
function build(L,pair,sc,M,obs,ks){const C=ctxFor(pair,M,ks);C.obs=obs;const P=newPlan(C,sc,L);let ok=false;try{ok=L.fn(P,L.v)}catch(e){console.warn('düzen',L.id,e);diag('hata:'+(e&&e.message));ok=false}if(!ok){diag('kalıp sığmadı:'+L.arch);return null}
 if(P.ov.size)overlayInk(P);const card=P.D.find(d=>d.k=='card');if(card){P.cardOf=new Map();P.T.forEach(t=>P.cardOf.set(t,card.col))}
 const v=validate(P);if(!v.ok){P.why=v.why;diag(String(v.why[0]).replace(/[\d.%]+$/,'').trim());return null}if(!placeDecor(P)){diag('şekil sığmadı');return null}P.score=v.score;return P}

/* ------------------------------------------------------ dışa açık API */
const AD={sess:null,idx:0,treat:'dogal',shown:new Set()};
async function designPage(o){if(busy)return null;busy=1;try{
  const{M}=collect();if(!M.img.length&&!M.t.length&&!M.b.length)return null;
  const sess=await search(o);AD.sess=sess;AD.idx=0;AD.shown=new Set();
  if(!sess.res.length)return null;const P=sess.res[0];AD.treat=P.C.imgs.some(i=>i.info&&i.info.mono)?'sb':'dogal';applyPlan(P,AD.treat);AD.shown.add(P.lay.id+P.C.pair.id+P.sc.id);ui();return P}
 finally{busy=0}}
function cur(){return AD.sess&&AD.sess.res[AD.idx]}
async function vary(dim){if(busy)return;const s=AD.sess;if(!s||!sigOk(s))return designPage().then(ui);const P=cur();if(!P)return;busy=1;try{
 let next=null;const{M,obs}=collect();
 if(!dim){for(let i=1;i<s.res.length;i++){const j=(AD.idx+i)%s.res.length,Q=s.res[j];if(Q.lay.arch!=P.lay.arch||Q.C.pair.id!=P.C.pair.id){next=Q;AD.idx=j;break}}if(!next){AD.idx=(AD.idx+1)%s.res.length;next=s.res[AD.idx]}}
 else if(dim=='lay'){const L=s.lays.filter(L=>L.id!=P.lay.id),st=hashStr(P.lay.id)%L.length;let any=null;for(let i=0;i<L.length&&!next;i++){const Q=build(L[(st+i*7)%L.length],P.C.pair,P.sc,M,obs,P.C.ks);if(Q&&Q.lay.arch!=P.lay.arch)next=Q;else if(Q&&!any)any=Q}if(!next)next=any;}
 else if(dim=='color'){const k=s.SC.findIndex(x=>x.id==P.sc.id);for(let i=1;i<=s.SC.length&&!next;i++){const sc=s.SC[(k+i)%s.SC.length];next=build(P.lay,P.C.pair,sc,M,obs,P.C.ks)}}
 else if(dim=='font'){const k=PAIRS.findIndex(x=>x.id==P.C.pair.id);for(let i=1;i<=PAIRS.length&&!next;i++){const pr=PAIRS[(k+i)%PAIRS.length];await fontsFor([pr]);next=build(P.lay,pr,P.sc,M,obs,P.C.ks);
   if(!next){const sib=s.lays.filter(L=>L.arch==P.lay.arch);for(const L of sib){next=build(L,pr,P.sc,M,obs,P.C.ks);if(next)break}}}}
 else if(dim=='fx'){const K=Object.keys(TREAT),k=K.indexOf(AD.treat);AD.treat=K[(k+1)%K.length];applyPlan(P,AD.treat);ui();toast('Görsel efekti: '+TREAT[AD.treat].n);return}
 if(!next){toast('Bu yönde başka geçerli varyasyon yok');return}
 if(dim){s.res.splice(AD.idx+1,0,next);AD.idx++}applyPlan(next,AD.treat);ui()}finally{busy=0}}
function sigOk(s){const{M}=collect();return s.key==sigOf(M)}
/* tüm artboardlar: aynı yazı çifti ve şema türü, sayfadan sayfaya değişen düzen */
async function designAll(){if(typeof PROJ=='undefined'||!PROJ||busy)return;const cur0=cur();toast('Tüm artboardlar tasarlanıyor…');
 PROJ.pages[PROJ.cur].s=pageSnap();const ref=cur0||await designPage();if(!ref){toast('Önce bu sayfada bir tasarım oluşturulamadı');return}
 const pair=ref.C.pair,scId=ref.sc.id,used=[ref.lay.arch];let done=0,skip=0;busy=1;
 try{await fontsFor([pair]);const N=PROJ.pages.length,me=PROJ.cur;
  await eachPage(async i=>{if(i==me)return;const{M,obs}=collect();if(!M.img.length&&!M.t.length){skip++;return}await prep(M);
   const hero=M.img[0]&&M.img[0].im&&M.img[0].im.complete?analyze(M.img[0].im):null,SC=schemes(hero),sc=SC.find(x=>x.id==scId)||SC[0],lays=LAYOUTS.filter(L=>L.need(M.img.length));
   let best=null;for(const L of lays){const Q=build(L,pair,sc,M,obs);if(Q){Q.score-=used.slice(-2).includes(L.arch)?15:0;if(!best||Q.score>best.score)best=Q}}
   if(!best){skip++;return}used.push(best.lay.arch);applyPlan(best,AD.treat,1);PROJ.pages[i].s=pageSnap();PROJ.pages[i].thumb='';done++;toast(`Artboard ${i+1}/${N} tasarlandı`);await tick()});
 }finally{busy=0}
 if(window.abLayout)abLayout();try{dirty()}catch(x){}toast(`✨ ${done+1} artboard tasarlandı`+(skip?` · ${skip} sayfa atlandı`:''))}

/* --------------------------------------------------------------- arayüz */
function count(){const s=AD.sess;if(!s)return 0;const k=s.res.length/Math.max(1,s.tried);return Math.round(s.lays.length*PAIRS.length*s.SC.length*Object.keys(TREAT).length*k)}
function ui(){const b=document.getElementById('adbox');if(!b)return;const P=cur(),s=AD.sess;
 b.querySelector('.adinf').textContent=P?`${P.lay.n} · ${P.C.pair.n} · ${P.sc.n} · ${TREAT[AD.treat].n}`:'Görsel yükle ya da “Tasarla”ya bas';
 b.querySelector('.adcnt').textContent=s&&s.res.length?`≈ ${count().toLocaleString('tr-TR')} geçerli varyasyon`:''}
function mount(){const cta=document.querySelector('#pn .cta');if(!cta||document.getElementById('adbox'))return;const d=document.createElement('div');d.id='adbox';d.className='adbox';
 d.innerHTML=`<div class="adh"><b>✨ Otomatik tasarım</b><small class="adcnt"></small></div><p class="adinf mut"></p>
 <div class="adr"><button class="b pr" data-ad="go">Tasarla</button><button class="b" data-ad="next" title="Başka bir varyasyon">🎲 Başka</button></div>
 <div class="adc"><button class="chip" data-ad="lay">Düzen</button><button class="chip" data-ad="color">Renk</button><button class="chip" data-ad="font">Yazı tipi</button><button class="chip" data-ad="fx">Görsel efekti</button></div>
 <button class="b adall" data-ad="all">Tüm artboardlara uygula</button>
 <p class="mut adn">Her tasarım otomatik denetimden geçer: çakışma, taşma, okunmayan renk ve aşırı kırpma olmaz. Sonra her şeyi elle değiştirebilirsin.</p>`;
 cta.after(d);d.addEventListener('click',async e=>{const x=e.target.closest('[data-ad]');if(!x)return;const k=x.dataset.ad;x.disabled=true;
  try{if(k=='go'){const P=await designPage({salt:Date.now()%997});toast(P?'✨ Tasarım hazır':'Bu kadar metin ve görsel bu sayfa boyutuna okunaklı sığmıyor. Bir kısmını yeni artboarda taşı ya da metni kısalt.')}else if(k=='next')await vary();else if(k=='all')await designAll();else await vary(k)}
  catch(err){console.error(err);toast('Tasarlanamadı')}finally{x.disabled=false;ui()}});ui()}
mount();

/* görsel yüklenince eski otomatik düzen yerine bu motor çalışsın */
window.autoDesign=autoDesign=async function(){if(busy)return;try{const P=await designPage();toast(P?`✨ Tasarım hazır · ${P.lay.n}. “🎲 Başka” ile varyasyonları gez`:'Bu kadar metin ve görsel bu sayfa boyutuna okunaklı sığmıyor. Bir kısmını yeni artboarda taşı ya da metni kısalt; mevcut düzen korundu.')}catch(e){console.error(e);toast('Otomatik tasarım çalışmadı')}}
/* eski düzen galerisi kullanılırsa motorun sabitlediği öğeler serbest kalsın */
{const ap=window.apply;if(typeof ap=='function')window.apply=apply=function(){if(S.els.some(e=>e.ad||e.adx)){S.els=S.els.filter(e=>!e.adx);S.els.forEach(e=>{if(!e.ad)return;delete e.ad;if(e._adp){e.pin=!!e._adp[0];if(!e._adp[1])delete e.fr;delete e._adp}else if(e.shape!='draw'){e.pin=false;delete e.fr}})}return ap.apply(this,arguments)}}
if(window.v4cmd){v4cmd(['Tasarım','Otomatik tasarla',['Ctrl+Alt+A'],()=>designPage({salt:Date.now()%997})]);v4cmd(['Tasarım','Başka bir varyasyon',['Ctrl+Alt+R'],()=>vary()]);v4cmd(['Tasarım','Tüm artboardlara otomatik tasarım',[],designAll])}

window.v4ad={DIAG,designPage,vary,designAll,search,build,validate,LAYOUTS,schemes,TREAT,collect,applyPlan,state:AD,inkRect,count};
})();
