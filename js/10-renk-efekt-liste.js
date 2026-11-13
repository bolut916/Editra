/* ================= STÜDYO 9: gradyan, ton/renk ayarları, karışım modları, katman bulanıklığı, buzlu cam, damlalık, arka plan silme ================= */
(function(){
const NS='http://www.w3.org/2000/svg';
const fx=n=>+(+n).toFixed(3);
const {IC,TOOLS,svg,inField}=window.v4ui,CVW=$('cvw');
const BLN=[['normal','Normal'],['multiply','Çarp'],['screen','Ekran'],['overlay','Bindir'],['darken','Koyulaştır'],['lighten','Açıklaştır'],['color-dodge','Renk soldur'],['color-burn','Renk yak'],['hard-light','Sert ışık'],['soft-light','Yumuşak ışık'],['difference','Fark'],['exclusion','Dışlama'],['hue','Ton'],['saturation','Doygunluk'],['color','Renk'],['luminosity','Parlaklık']];
window.v4BLN=BLN;
const isDraw=e=>e.type=='r'&&e.shape=='draw';
const DI={lvb:0,lvw:100,lvg:100,tmp:0,tnt:0,shd:0,hil:0,shp:0,post:0,lb:0,blend:'normal'};
const DR={gr:false,col2:'#7c5cff',col3:'#ffffff',gm:false,gp:50,gt:'lin',ga:90,bdb:0,lb:0,blend:'normal'};
const DT={lb:0,blend:'normal'};
function fillDef(e){if(!e)return;const d=e.type=='img'?DI:e.type=='r'?DR:DT;for(const k in d)if(e[k]===undefined)e[k]=d[k]}
const ed0=ed;ed=function(){fillDef(cur());return ed0.apply(this,arguments)};

/* ---------- gradyan dolgu (şekil ve yol) ---------- */
const base=e=>isDraw(e)?(e.fl||e.col):e.col;
const stops=e=>{const a=[[0,base(e)]];if(e.gm)a.push([Math.max(.01,Math.min(.99,(e.gp==null?50:e.gp)/100)),e.col3||'#ffffff']);a.push([1,e.col2||'#7c5cff']);return a};
window.v4gcss=e=>{if(!e.gr||e.type!='r'||isDraw(e))return'';const st=stops(e).map(s=>`${s[1]} ${fx(s[0]*100)}%`).join(',');
 return (e.gt=='rad')?`radial-gradient(circle farthest-corner at 50% 50%,${st})`:`linear-gradient(${+e.ga||0}deg,${st})`};
function geom(e,X,Y,w,h){const cx=X+w/2,cy=Y+h/2;if(e.gt=='rad')return{r:1,cx,cy,R:Math.hypot(w,h)/2};
 const a=(+e.ga||0)*Math.PI/180,dx=Math.sin(a),dy=-Math.cos(a),hf=(Math.abs(w*dx)+Math.abs(h*dy))/2;return{r:0,x1:cx-dx*hf,y1:cy-dy*hf,x2:cx+dx*hf,y2:cy+dy*hf}}
window.v4gcv=(x,e,X,Y,w,h)=>{if(!e.gr)return null;const g=geom(e,X,Y,w,h),G=g.r?x.createRadialGradient(g.cx,g.cy,0,g.cx,g.cy,g.R):x.createLinearGradient(g.x1,g.y1,g.x2,g.y2);stops(e).forEach(s=>G.addColorStop(s[0],s[1]));return G};
window.v4gdef=(e,id,X,Y,w,h)=>{const g=geom(e,X,Y,w,h),st=stops(e).map(s=>`<stop offset="${fx(s[0])}" stop-color="${s[1]}"/>`).join('');
 return g.r?`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${fx(g.cx)}" cy="${fx(g.cy)}" r="${fx(g.R)}">${st}</radialGradient>`:`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${fx(g.x1)}" y1="${fx(g.y1)}" x2="${fx(g.x2)}" y2="${fx(g.y2)}">${st}</linearGradient>`};
window.v4gsvg=(e,D,uid,X,Y,w,h)=>{if(!e.gr)return isDraw(e)?null:e.col;const id=uid();D.push(v4gdef(e,id,X,Y,w,h));return `url(#${id})`};

/* ---------- şekiller: çizim öğeleri (gradyan + katman bulanıklığı) ---------- */
const sw0=e=>e.sw2===0?0:(e.sw2||1);
const dashS=e=>{const w=sw0(e)||1;return e.dash=='d'?`${fx(w*3)} ${fx(w*2)}`:e.dash=='o'?`0.01 ${fx(w*2.2)}`:''};
const od=window.v4dsvg;
window.v4dsvg=(e,ov)=>{let a=od(e);if(ov)a=a.replace(/fill="[^"]*"/,`fill="${ov}"`);return a};
window.v4drawHTML=(e,p,sl)=>{const v=e.vb||[1,1],gid='gr'+e.id,gr=e.gr&&e.fon,flt=[+e.lb?`blur(${e.lb}cqw)`:'',e.sx||e.sy||e.sb?`drop-shadow(${e.sx}cqw ${e.sy}cqw ${e.sb}cqw ${rgba(e.scol,.55)})`:''].filter(Boolean).join(' ');
 return `<div class="e${sl}" data-id="${e.id}" style="${p}pointer-events:none;${flt?'filter:'+flt+';':''}"><svg viewBox="0 0 ${fx(v[0])} ${fx(v[1])}" preserveAspectRatio="none" style="width:100%;height:100%;display:block;overflow:visible;pointer-events:none">${gr?'<defs>'+v4gdef(e,gid,0,0,v[0],v[1])+'</defs>':''}<path d="${v4dpath(e)}" ${v4dsvg(e,gr?`url(#${gid})`:null)} style="pointer-events:visiblePainted"/></svg></div>`};
window.v4drawCv=(x,e,X,Y,w,h)=>{const v=e.vb||[1,1],sw=sw0(e);x.translate(X,Y);x.scale(w/v[0],h/v[1]);const P=new Path2D(v4dpath(e));
 if(e.fon){x.fillStyle=(e.gr&&v4gcv(x,e,0,0,v[0],v[1]))||(e.fl||e.col);x.fill(P,e.eo?'evenodd':'nonzero')}
 if(sw){x.strokeStyle=e.col;x.lineWidth=sw;x.lineCap=e.cap||'round';x.lineJoin=e.jn||'round';const da=dashS(e);x.setLineDash(da?da.split(' ').map(Number):[]);x.stroke(P)}};

/* ---------- katman efektleri: karışım modu, bulanıklık, buzlu cam ---------- */
window.v4fxp=e=>{let s='';if(e.type!='img'&&e.blend&&e.blend!='normal')s+=`mix-blend-mode:${e.blend};`;if(+e.lb&&!isDraw(e))s+=`filter:blur(${e.lb}cqw);`;return s};
window.v4glass=e=>+e.bdb&&e.type=='r'&&!isDraw(e)?`backdrop-filter:blur(${e.bdb}cqw);-webkit-backdrop-filter:blur(${e.bdb}cqw);`:'';
window.v4fxc=(x,e,u)=>{if(e.type!='img'){if(e.blend&&e.blend!='normal')x.globalCompositeOperation=e.blend;if(+e.lb)x.filter=`blur(${e.lb*u}px)`}};
window.v4glc=(x,e,X,Y,w,h,u)=>{const px=(+e.bdb||0)*u;if(!(px>0)||isDraw(e))return;x.save();x.beginPath();
 if(e.shape=='circle')x.ellipse(X+w/2,Y+h/2,w/2,h/2,0,0,7);else if(e.shape=='tri'){x.moveTo(X+w/2,Y);x.lineTo(X+w,Y+h);x.lineTo(X,Y+h);x.closePath()}else if(e.shape=='line')x.rect(X,Y+h/2-.3*u,w,.6*u);else{const r=(e.rad||0)/100*Math.min(w,h);if(r>0&&x.roundRect)x.roundRect(X,Y,w,h,r);else x.rect(X,Y,w,h)}
 x.clip();const m=x.getTransform();x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.filter=`blur(${px}px)`;x.drawImage(x.canvas,0,0);x.setTransform(m);x.restore()};

/* ---------- görsel ton ve renk (SVG filtre) ---------- */
const efOn=e=>e.type=='img'&&(e.lvb>0||(e.lvw!=null&&e.lvw<100)||(e.lvg&&e.lvg!=100)||e.tmp||e.tnt||e.shd||e.hil||e.shp>0||e.post>=2);
const tbl=f=>Array.from({length:17},(_,i)=>Math.max(0,Math.min(1,f(i/16))).toFixed(4)).join(' ');
const FN=(t,a)=>['R','G','B'].map(c=>`<feFunc${c} type="${t}" ${a}/>`).join('');
function efBody(e){let b='';const bp=(e.lvb||0)/100,wp=Math.max(bp+.05,(e.lvw==null?100:e.lvw)/100),g=Math.max(.2,(e.lvg||100)/100);
 if(bp>0||wp<1){const sl=1/(wp-bp);b+=`<feComponentTransfer>${FN('linear',`slope="${fx(sl)}" intercept="${fx(-bp*sl)}"`)}</feComponentTransfer>`}
 if(g!=1)b+=`<feComponentTransfer>${FN('gamma',`amplitude="1" exponent="${fx(1/g)}" offset="0"`)}</feComponentTransfer>`;
 const t=(e.tmp||0)/100,n=(e.tnt||0)/100;
 if(t||n){const r=(1+.25*t)*(1+.08*n),gg=1-.2*n,bb=(1-.25*t)*(1+.08*n);b+=`<feColorMatrix type="matrix" values="${fx(r)} 0 0 0 0 0 ${fx(gg)} 0 0 0 0 0 ${fx(bb)} 0 0 0 0 0 1 0"/>`}
 if(e.shd||e.hil){const a=(e.shd||0)/100*1.7,c=(e.hil||0)/100*1.7;b+=`<feComponentTransfer>${FN('table',`tableValues="${tbl(x=>x+a*x*(1-x)*(1-x)-c*x*x*(1-x))}"`)}</feComponentTransfer>`}
 if(e.post>=2){const n2=Math.round(e.post);b+=`<feComponentTransfer>${FN('discrete',`tableValues="${Array.from({length:n2},(_,k)=>(k/(n2-1)).toFixed(4)).join(' ')}"`)}</feComponentTransfer>`}
 if(e.shp>0){const a=e.shp/100*1.1;b+=`<feConvolveMatrix order="3" kernelMatrix="0 ${fx(-a)} 0 ${fx(-a)} ${fx(1+4*a)} ${fx(-a)} 0 ${fx(-a)} 0" divisor="1" bias="0" targetX="1" targetY="1" edgeMode="duplicate" preserveAlpha="true"/>`}
 return b}
function defs(){let s=document.getElementById('v4fxd');if(!s){s=document.createElementNS(NS,'svg');s.id='v4fxd';s.setAttribute('width','0');s.setAttribute('height','0');s.setAttribute('aria-hidden','true');s.style.cssText='position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';document.body.appendChild(s)}return s}
window.v4efl=e=>{if(!efOn(e))return'';const id='ef'+e.id,body=efBody(e),s=defs();let f=s.querySelector('#'+id);
 if(!f){f=document.createElementNS(NS,'filter');f.id=id;f.setAttribute('color-interpolation-filters','sRGB');f.setAttribute('x','0');f.setAttribute('y','0');f.setAttribute('width','1');f.setAttribute('height','1');s.appendChild(f)}
 if(f.dataset.sig!==body){f.innerHTML=body;f.dataset.sig=body}return ' url(#'+id+')'};
window.v4efdef=e=>efOn(e)?`<filter id="ef${e.id}" color-interpolation-filters="sRGB" x="0" y="0" width="1" height="1">${efBody(e)}</filter>`:'';

/* ---------- panel parçaları ---------- */
window.v4fxi=()=>`<details class="adv"><summary>🎚 Ton ve renk (gelişmiş)</summary><div class="bd">`+R('*','lvb','Siyah nokta %',0,60,1)+R('*','lvw','Beyaz nokta %',40,100,1)+R('*','lvg','Orta ton (gama) %',40,250,1)+R('*','tmp','Sıcaklık (soğuk ↔ sıcak)',-100,100,1)+R('*','tnt','Ton (yeşil ↔ eflatun)',-100,100,1)+R('*','shd','Gölgeleri aç',-100,100,1)+R('*','hil','Parlakları kurtar',-100,100,1)+R('*','shp','Netleştir',0,100,1)+R('*','post','Posterize (0 = kapalı)',0,8,1)+`<div class="row"><button class="b" data-v9="atone">✨ Otomatik ton</button><button class="b" data-v9="rmbg">✂ Arka planı sil</button></div></div></details>`;
window.v4fxr=e=>{const dr=isDraw(e);return `<div class="ck">`+Kc('*','gr','Gradyan dolgu')+`</div>`+(dr?'':O('*','gt','Gradyan türü',[['lin','Doğrusal'],['rad','Dairesel']]))+C('*','col2','Gradyan 2. renk')+R('*','ga','Gradyan açısı °',0,360,1)+`<div class="ck">`+Kc('*','gm','Orta renk ekle')+`</div>`+C('*','col3','Orta renk')+R('*','gp','Orta renk konumu %',5,95,1)
 +O('*','blend','Karışım modu',BLN)+R('*','lb','Katman bulanıklığı',0,4,.05)+(dr?'':R('*','bdb','Buzlu cam (arkayı bulanıklaştır)',0,4,.05))};
window.v4fxt=e=>O('*','blend','Karışım modu',BLN)+R('*','lb','Katman bulanıklığı',0,4,.05);
/* dr için gradyan türü yok: yol gradyanı doğrusal */

/* ---------- ön ayarlar ---------- */
Object.assign(FXI,{
 Film:{con:112,sat:85,sep:18,tmp:12,lvb:4,shd:20,hil:12,duo:false},
 Soğuk:{tmp:-45,tnt:-8,sat:106,duo:false},
 Sıcak:{tmp:45,sat:112,duo:false},
 Dramatik:{con:135,sat:90,shd:-25,hil:30,shp:40,duo:false},
 Mat:{con:88,bri:105,shd:35,hil:-10,lvb:6,sat:92,duo:false},
 'S/B kontrast':{gray:100,con:165,shp:30,duo:false}});
Object.assign(FXI.Temiz,{lvb:0,lvw:100,lvg:100,tmp:0,tnt:0,shd:0,hil:0,shp:0,post:0,lb:0});

/* ---------- otomatik ton ---------- */
function autoTone(e){if(!e||e.type!='img'||!e.im||!e.im.naturalWidth)return toast('Önce bir görsel yükle');
 const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(e.im,0,0,96,96);const d=g.getImageData(0,0,96,96).data,H=new Array(256).fill(0);let n=0,sum=0;
 for(let i=0;i<d.length;i+=4){if(d[i+3]<8)continue;const l=Math.round(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2]);H[l]++;n++;sum+=l}
 if(!n)return;let a=0,lo=0,hi=255;for(let i=0;i<256;i++){a+=H[i];if(a>=n*.005){lo=i;break}}a=0;for(let i=255;i>=0;i--){a+=H[i];if(a>=n*.005){hi=i;break}}
 if(hi-lo<30){lo=Math.min(lo,60);hi=Math.max(hi,200)}
 const bp=Math.min(60,Math.round(lo/2.55)),wp=Math.max(40,Math.round(hi/2.55));let m=(sum/n-lo)/Math.max(1,hi-lo);m=Math.max(.05,Math.min(.95,m));const gm=Math.max(.6,Math.min(1.8,Math.log(m)/Math.log(.5)));
 e.lvb=bp;e.lvw=wp;e.lvg=Math.round(gm*100);render();ed();hist();toast('Otomatik ton uygulandı · siyah '+bp+'% · beyaz '+wp+'% · gama '+e.lvg+'%')}

/* ---------- arka plan silme (renk tabanlı) ---------- */
function modal(id,title,body,sub){let p=$(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)p.hidden=true});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))p.hidden=true})}
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>${title}</b><small>${sub||''}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b">${body}</div></div>`;p.hidden=false;return p}
function rmCompute(src,W,H,o){const d=src.data,out=new ImageData(new Uint8ClampedArray(d),W,H),T=o.tol*2.2,[br,bg,bb]=o.col,N=W*H,dist=new Float32Array(N);
 for(let i=0;i<N;i++){const r=d[i*4]-br,g=d[i*4+1]-bg,b=d[i*4+2]-bb;dist[i]=Math.sqrt(r*r+g*g+b*b)}
 const A=new Float32Array(N).fill(255);
 if(o.mode=='glob'){for(let i=0;i<N;i++){const v=dist[i];A[i]=v<=T*.7?0:v>=T?255:(v-T*.7)/(T*.3)*255}}
 else{const reg=new Uint8Array(N),st=[];const push=i=>{if(!reg[i]&&dist[i]<=T){reg[i]=1;st.push(i)}};
  for(let x=0;x<W;x++){push(x);push((H-1)*W+x)}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1)}
  while(st.length){const i=st.pop(),x=i%W,y=(i-x)/W;if(x>0)push(i-1);if(x<W-1)push(i+1);if(y>0)push(i-W);if(y<H-1)push(i+W)}
  for(let i=0;i<N;i++)A[i]=reg[i]?0:255;
  /* kenarı yumuşat: 3x3 ortalama */
  const B=new Float32Array(N);for(let y=0;y<H;y++)for(let x=0;x<W;x++){let s=0,c=0;for(let dy=-1;dy<=1;dy++){const yy=y+dy;if(yy<0||yy>=H)continue;for(let dx=-1;dx<=1;dx++){const xx=x+dx;if(xx<0||xx>=W)continue;s+=A[yy*W+xx];c++}}B[y*W+x]=s/c}
  for(let i=0;i<N;i++)A[i]=A[i]==0?0:B[i]}
 for(let i=0;i<N;i++){out.data[i*4+3]=Math.round(Math.min(d[i*4+3],A[i]))}return out}
function cornerCol(src,W,H){const d=src.data,pts=[[0,0],[W-1,0],[0,H-1],[W-1,H-1]];let r=0,g=0,b=0;pts.forEach(([x,y])=>{const i=(y*W+x)*4;r+=d[i];g+=d[i+1];b+=d[i+2]});return[Math.round(r/4),Math.round(g/4),Math.round(b/4)]}
function rmbgOpen(e){e=e||cur();if(!e||e.type!='img'||!e.im||!e.im.naturalWidth)return toast('Önce bir görsel yükle');
 const I=e.im,nw=I.naturalWidth,nh=I.naturalHeight,K=Math.min(1,2400/Math.max(nw,nh)),W=Math.round(nw*K),H=Math.round(nh*K),k2=Math.min(1,560/Math.max(W,H)),pw=Math.max(2,Math.round(W*k2)),ph=Math.max(2,Math.round(H*k2));
 const full=document.createElement('canvas');full.width=W;full.height=H;const fg=full.getContext('2d',{willReadFrequently:true});fg.drawImage(I,0,0,W,H);
 const prev=document.createElement('canvas');prev.width=pw;prev.height=ph;const pg=prev.getContext('2d',{willReadFrequently:true});pg.drawImage(I,0,0,pw,ph);const pd=pg.getImageData(0,0,pw,ph);
 const o={tol:28,mode:'edge',col:cornerCol(pd,pw,ph)};
 const m=modal('v9rm','✂ Arka planı sil','<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start"><div id="v9rmc" style="background:repeating-conic-gradient(#ccc 0 25%,#fff 0 50%) 0 0/16px 16px;border-radius:10px;overflow:hidden;line-height:0;max-width:100%"></div><div style="flex:1;min-width:220px;display:grid;gap:10px"><label class="f"><span>Tolerans</span><input type="range" id="v9tol" min="2" max="100" value="'+o.tol+'"></label><label class="f"><span>Yöntem</span><select id="v9mode"><option value="edge">Kenardan başla (nesneyi koru)</option><option value="glob">Tüm görselde bu rengi sil</option></select></label><label class="f"><span>Silinecek renk (görsele tıklayarak seç)</span><input type="color" id="v9col"></label><div class="row"><button class="b" id="v9ok">Uygula</button>'+(e.src0?'<button class="b" id="v9rst">Orijinale dön</button>':'')+'</div><small class="mut">Düz renkli arka planlarda en iyi sonucu verir. İşlem geri alınabilir (Ctrl+Z).</small></div></div>','renk tabanlı');
 const holder=m.querySelector('#v9rmc'),cv=document.createElement('canvas');cv.width=pw;cv.height=ph;cv.style.cssText='max-width:100%;height:auto;cursor:crosshair;display:block';holder.appendChild(cv);
 const hex=c=>'#'+c.map(v=>v.toString(16).padStart(2,'0')).join(''),par=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
 const colI=m.querySelector('#v9col');colI.value=hex(o.col);let t=0;
 const show=()=>{cv.getContext('2d').putImageData(rmCompute(pd,pw,ph,o),0,0)};show();
 const sched=()=>{clearTimeout(t);t=setTimeout(show,90)};
 m.querySelector('#v9tol').oninput=ev=>{o.tol=+ev.target.value;sched()};m.querySelector('#v9mode').onchange=ev=>{o.mode=ev.target.value;show()};colI.oninput=ev=>{o.col=par(ev.target.value);sched()};
 cv.onclick=ev=>{const r=cv.getBoundingClientRect(),x=Math.max(0,Math.min(pw-1,Math.floor((ev.clientX-r.left)/r.width*pw))),y=Math.max(0,Math.min(ph-1,Math.floor((ev.clientY-r.top)/r.height*ph))),i=(y*pw+x)*4;o.col=[pd.data[i],pd.data[i+1],pd.data[i+2]];colI.value=hex(o.col);show()};
 m.querySelector('#v9ok').onclick=async()=>{const full0=fg.getImageData(0,0,W,H),res=rmCompute(full0,W,H,o);fg.putImageData(res,0,0);const url=full.toDataURL('image/png');e.src0=e.src0||e.src;e.src=url;e.im=getIm(url);try{await e.im.decode()}catch(x){}m.hidden=true;render();list();ed();hist();toast('Arka plan silindi ✓')};
 const rs=m.querySelector('#v9rst');if(rs)rs.onclick=async()=>{e.src=e.src0;delete e.src0;e.im=getIm(e.src);try{await e.im.decode()}catch(x){}m.hidden=true;render();list();ed();hist();toast('Orijinal görsele dönüldü')}}

/* ---------- damlalık ---------- */
const EY={mode:'fill',snap:null,dirty:true,busy:false,lastP:null};
async function eyeSnap(){if(EY.busy)return;EY.busy=true;try{await loadF();const W=Math.max(400,Math.min(1600,Math.round($('cv').getBoundingClientRect().width))),c=drawB(W,0,false);EY.snap={x:c.getContext('2d',{willReadFrequently:true}),W:c.width,H:c.height};EY.dirty=false}catch(x){}finally{EY.busy=false}}
const ptr=ev=>{const r=$('cv').getBoundingClientRect();return[(ev.clientX-r.left)/r.width*100,(ev.clientY-r.top)/r.width*100]};
function eyeAt(p){const s=EY.snap;if(!s)return null;const X=Math.round(p[0]/100*s.W),Y=Math.round(p[1]/100*s.W);if(X<0||Y<0||X>=s.W||Y>=s.H)return null;const d=s.x.getImageData(X,Y,1,1).data;return '#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('')}
function eyeLabel(ev,hex){let l=$('eyel');if(!hex){if(l)l.remove();return}if(!l){l=document.createElement('div');l.id='eyel';l.style.cssText='position:fixed;z-index:10001;pointer-events:none;display:flex;align-items:center;gap:8px;background:#17171c;color:#fff;border-radius:99px;padding:5px 11px 5px 6px;font:600 12px system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.35)';document.body.appendChild(l)}
 l.innerHTML=`<i style="width:20px;height:20px;border-radius:50%;background:${hex};border:2px solid #fff;display:inline-block"></i>${hex.toUpperCase()}`;l.style.left=(ev.clientX+16)+'px';l.style.top=(ev.clientY+16)+'px'}
function eyeApply(hex){const L=selEls(),m=EY.mode;let msg=hex.toUpperCase();
 if(m=='bg'){S.bg=hex;render();ed();hist();msg+=' · sayfa zemini'}
 else if(m!='copy'&&L.length){L.forEach(o=>{if(m=='stroke'){if(isDraw(o))o.col=hex;else if(o.txt!==undefined){o.sc=hex;if(!o.sw)o.sw=.12}}else{if(isDraw(o)){o.fl=hex;o.fon=true}else if(o.type!='img')o.col=hex}});render();ed();hist();msg+=m=='stroke'?' · çizgi/kontur':' · dolgu/yazı'}
 else msg+=' · kopyalandı';
 try{navigator.clipboard.writeText(hex).catch(()=>{})}catch(x){}toast(msg)}
CVW.addEventListener('pointermove',async ev=>{if(SDK.tool!='e'||!ev.target.closest||!ev.target.closest('.cvp'))return;if(EY.dirty||!EY.snap)await eyeSnap();const h=eyeAt(ptr(ev));eyeLabel(ev,h)});
CVW.addEventListener('pointerleave',()=>eyeLabel(null,null));
CVW.addEventListener('pointerdown',async ev=>{if(SDK.tool!='e'||ev.button>0||SDK.space||!PROJ)return;if(!ev.target.closest||!ev.target.closest('.cvp'))return;ev.preventDefault();ev.stopImmediatePropagation();
 if(EY.dirty||!EY.snap)await eyeSnap();const h=eyeAt(ptr(ev));if(h)eyeApply(h)},true);
const render1=render;render=function(){EY.dirty=true;return render1.apply(this,arguments)};
const th0=window.v4toolHook;window.v4toolHook=t=>{if(t!='e')eyeLabel(null,null);if(t=='e')EY.dirty=true;if(th0)th0(t)};
const bf0=window.v4barFor;
window.v4barFor=t=>{if(t=='e'){const c=(m,n)=>`<button class="chip${EY.mode==m?' on':''}" data-v9e="${m}">${n}</button>`;return `<span class="cbl">Damlalık</span>`+c('fill','Dolgu / yazı rengi')+c('stroke','Çizgi / kontur')+c('bg','Sayfa zemini')+c('copy','Sadece kopyala')+`<span class="cbh">Tuvalde bir renge tıkla · hex kodu panoya da kopyalanır</span>`}return bf0?bf0(t):null};
$('cbar').addEventListener('click',ev=>{const b=ev.target.closest('[data-v9e]');if(!b)return;EY.mode=b.dataset.v9e;v4ui.stBar()});

/* ---------- araç şeridi, komutlar, düğmeler ---------- */
TOOLS.push(['e','Damlalık · renk seç','E']);IC.e=svg('<path d="M14 4l6 6-3 3-6-6zM12 8L4 16l-1 5 5-1 8-8"/>');
(function(){const rail=$('rail'),x=rail&&rail.querySelector('[data-tool="x"]');if(x)x.insertAdjacentHTML('afterend',`<button class="rb" data-tool="e" title="Damlalık · renk seç (E)" aria-label="Damlalık" aria-pressed="false">${IC.e}<kbd>E</kbd></button>`)})();
v4cmd(['Araçlar','Damlalık aracı',['E'],()=>v4ui.useTool('e')]);
v4cmd(['Görsel','Otomatik ton (seviyeleri düzelt)',[],()=>autoTone(cur())]);
v4cmd(['Görsel','Arka planı sil (renk tabanlı)',[],()=>rmbgOpen(cur())]);
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-v9]');if(!b)return;const k=b.dataset.v9;if(k=='atone')autoTone(cur());else if(k=='rmbg')rmbgOpen(cur())});
const pe=window.v4extra,pc=window.v4cb;
window.v4extra=o=>(pe?pe(o):'')+(o.type=='img'&&o.src?`<button class="cbb wide" data-cbg="atone" title="Seviyeleri otomatik düzelt">Otomatik ton</button><button class="cbb wide" data-cbg="rmbg" title="Düz arka planı sil">Arka plan sil</button>`:'');
window.v4cb=(g,t)=>{if(g=='atone'){autoTone(cur());return true}if(g=='rmbg'){rmbgOpen(cur());return true}return pc?pc(g,t):false};
window.v4fx={autoTone,rmbgOpen,rmCompute,efBody,fillDef};
})();

/* ================= STÜDYO 10: listeler, büyük baş harf, tablo, temel çizgi ızgarası, tipografik düzeltme ================= */
(function(){
const fx=n=>+(+n).toFixed(3);
const txts=()=>selEls().filter(e=>e.txt!==undefined&&!(e.tg&&!e.hd));
const stBar=()=>v4ui.stBar();
function modal(id,title,body,sub){let p=$(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)p.hidden=true});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))p.hidden=true})}
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>${title}</b><small>${sub||''}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b">${body}</div></div>`;p.hidden=false;return p}

/* ---------- madde işaretli / numaralı liste ---------- */
function listify(kind){const L=txts();if(!L.length)return toast('Önce bir metin seç');
 L.forEach(e=>{const lines=String(e.txt).split('\n'),re=/^\s*(?:[•–\-\*]|\d+[\.\)])\s+/,body=lines.filter(l=>l.trim()),on=body.length&&body.every(l=>kind=='b'?/^\s*•\s/.test(l):/^\s*\d+\.\s/.test(l));let n=0;
  e.txt=lines.map(l=>{if(!l.trim())return l;const c=l.replace(re,'');if(on)return c;n++;return(kind=='b'?'• ':n+'. ')+c}).join('\n')});
 render();ed();hist();stBar();toast(kind=='b'?'Madde işaretleri değişti':'Numaralandırma değişti')}

/* ---------- büyük baş harf (drop cap): ayrı bir harf kutusu + metin sarma ---------- */
function dropcap(n){const e=txts()[0];if(!e)return toast('Önce bir paragraf seç');if(e.type=='t'||e.type=='m')return toast('Büyük baş harf paragraf ve alt başlık için uygundur');
 if(S.els.some(o=>o.dcp===e.id))return toast('Bu paragrafta zaten büyük baş harf var');
 const raw=String(e.txt),m=raw.match(/^(\s*)(\S)([\s\S]*)$/);if(!m)return toast('Metin boş');
 let first=m[2],rest=m[3];const g=geo(e,100),X=g[0]+(e.dx||0),Y=g[1]+(e.dy||0),lineH=e.fs*e.lh;
 const capP=.72,H=(n-1)*lineH+capP*e.fs,fs=H/capP,off=(lineH-capP*e.fs)/2-.2*fs+.04*fs;
 const d=mk('t');d.txt=first.toLocaleUpperCase('tr-TR');d.ff=e.ff;d.fw=800;d.col=S.pc&&S.pc[1]||e.col;d.fs=+fs.toFixed(2);d.lh=1;d.ls=0;d.al='left';d.va='start';d.cc=1;d.tc='none';d.fr=[fx(X),fx(Y+off),fx(fs*.78),fx(fs*1.0)];d.pin=true;d.nm='Büyük baş harf';d.dcp=e.id;d.z=topZ()+10;d.sx=0;d.sy=0;d.sb=0;
 e.txt=rest.replace(/^\s+/,'');e.wr=true;e.wm=Math.max(e.wm||0,.6);e.dcr=first;
 S.els.push(d);S.sel=d.id;MSEL.clear();render();list();ed();hist();stBar();toast(n+' satırlık büyük baş harf eklendi · metin harfin etrafından akar')}
function undrop(){const d=selEls().find(o=>o.dcp)||S.els.find(o=>o.dcp&&selEls().some(s=>s.id==o.dcp));if(!d)return toast('Büyük baş harf bulunamadı');
 const e=byId(d.dcp);if(e){e.txt=(e.dcr||d.txt)+e.txt;delete e.dcr;e.wr=false}S.els=S.els.filter(o=>o!==d);S.sel=e?e.id:null;render();list();ed();hist();stBar();toast('Büyük baş harf geri alındı')}

/* ---------- tablo ---------- */
function parseData(t){t=String(t||'').replace(/\r/g,'').trim();if(!t)return[];const sep=t.includes('\t')?'\t':(t.split('\n')[0].includes(';')?';':',');const rows=[];let row=[],cur='',q=false;
 for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c=='"'){if(t[i+1]=='"'){cur+='"';i++}else q=false}else cur+=c}else if(c=='"')q=true;else if(c==sep){row.push(cur);cur=''}else if(c=='\n'){row.push(cur);rows.push(row);row=[];cur=''}else cur+=c}
 row.push(cur);rows.push(row);return rows.filter(r=>r.some(v=>v.trim()))}
function buildTable(o){let data=o.data;const R=Math.max(1,o.rows),C=Math.max(1,o.cols);
 const grid=Array.from({length:R},(_,r)=>Array.from({length:C},(_,c)=>(data&&data[r]&&data[r][c]!==undefined?String(data[r][c]).trim():(o.head&&r==0?'Başlık '+(c+1):''))));
 const tx=(S.pc&&S.pc[0])||'#111111',bg=S.bg||'#ffffff',x0=S.mar,W=100-2*S.mar,fs=o.fs,pad=fs*.55,rh=fs*1.2+pad,y0=o.y,gid=nid(),cw=Array(C).fill(W/C),out=[];
 const num=c=>{const b=grid.slice(o.head?1:0).map(r=>r[c]).filter(Boolean);return b.length&&b.every(v=>/^[\d\s.,%₺$€+\-:]+$/.test(v))};
 let z=topZ();const push=e=>{e.gid=gid;e.pin=true;z+=10;e.z=z;out.push(e);S.els.push(e)};
 const rect=(x,y,w,h,col,op,nm)=>{const e=mk('r');e.shape='rect';e.col=col;e.op=op;e.rad=0;e.fr=[fx(x),fx(y),fx(w),fx(h)];e.nm=nm;push(e)};
 for(let r=0;r<R;r++){const y=y0+r*rh;
  if(o.head&&r==0)rect(x0,y,W,rh,tx,100,'Tablo başlık zemini');else if(o.zebra&&(r-(o.head?1:0))%2==1)rect(x0,y,W,rh,tx,7,'Tablo satır zemini')}
 for(let r=0;r<R;r++){const y=y0+r*rh;let x=x0;
  for(let c=0;c<C;c++){const e=mk('b');e.txt=grid[r][c];e.fs=fs;e.lh=1.15;e.ls=0;e.fw=o.head&&r==0?700:400;e.col=o.head&&r==0?bg:tx;e.al=num(c)&&!(o.head&&r==0&&false)?'right':'left';e.va='center';e.cc=1;e.ind=0;e.tc='none';
   e.fr=[fx(x+pad),fx(y),fx(cw[c]-2*pad),fx(rh)];e.nm='Hücre '+(r+1)+'-'+(c+1);push(e);x+=cw[c]}}
 if(o.rules)for(let r=0;r<=R;r++)if(o.rules=='all'||r==0||r==R||(o.rules=='head'&&r==1&&o.head))rect(x0,y0+r*rh-.06,W,.12,tx,o.rules=='all'&&r>0&&r<R?30:100,'Tablo çizgisi');
 S.sel=out.find(e=>e.txt!==undefined)&&out.find(e=>e.txt!==undefined).id;return out}
function tableUI(){if(!PROJ)return;const m=modal('v10tb','▦ Tablo ekle','<div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))"><label class="f"><span>Satır</span><input type="number" id="v10r" min="1" max="40" value="5"></label><label class="f"><span>Sütun</span><input type="number" id="v10c" min="1" max="10" value="3"></label><label class="f"><span>Yazı boyutu</span><input type="number" id="v10f" min="1" max="6" step=".1" value="2"></label><label class="f"><span>Üstten konum (sayfa genişliği %)</span><input type="number" id="v10y" min="0" max="140" step="1" value="30"></label><label class="f"><span>Çizgiler</span><select id="v10l"><option value="head">Başlık altı + dış</option><option value="all">Her satır altı</option><option value="">Yok</option></select></label><div class="ck"><label><input type="checkbox" id="v10h" checked> Başlık satırı</label><label><input type="checkbox" id="v10z"> Zebra</label></div></div><label class="f"><span>Veriyi yapıştır (Excel / Sheets / CSV — boş bırakırsan boş tablo gelir; satır ve sütun sayısı veriden alınır)</span><textarea id="v10d" rows="6" placeholder="Ürün\tFiyat\tStok\nKahve\t120\t14"></textarea></label><div class="row"><button class="b" id="v10ok">Tabloyu ekle</button></div><small class="mut">Her hücre ayrı bir metin kutusudur (çift tıkla düzenle); tüm tablo gruplanır ve birlikte taşınır.</small>','hücreler ayrı düzenlenir');
 m.querySelector('#v10ok').onclick=()=>{const q=s=>m.querySelector(s),data=parseData(q('#v10d').value);let R=+q('#v10r').value,C=+q('#v10c').value;if(data.length){R=data.length;C=Math.max(...data.map(r=>r.length))}
  R=Math.min(60,Math.max(1,R));C=Math.min(10,Math.max(1,C));buildTable({rows:R,cols:C,head:q('#v10h').checked,zebra:q('#v10z').checked,rules:q('#v10l').value,fs:+q('#v10f').value||2,y:(+q('#v10y').value||30),data:data.length?data:null});
  m.hidden=true;render();list();ed();hist();if(S.sel)pick(S.sel);toast('Tablo eklendi: '+R+'×'+C)}}

/* ---------- temel çizgi ızgarası ---------- */
const BG={on:false,mm:5};
function bgDraw(){let n=$('v10bg');if(!BG.on||!PROJ){if(n)n.remove();return}const cv=$('cv');if(!n||!n.isConnected){n=document.createElement('div');n.id='v10bg';cv.appendChild(n)}const st=BG.mm/(S.mm[0]/100);
 n.style.cssText=`position:absolute;left:0;right:0;top:${S.mar}cqw;bottom:0;pointer-events:none;z-index:9990;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(${fx(st)}cqw - 1px),rgba(255,64,160,.5) calc(${fx(st)}cqw - 1px),rgba(255,64,160,.5) ${fx(st)}cqw)`}
function bgToggle(){BG.on=!BG.on;bgDraw();toast(BG.on?'Temel çizgi ızgarası açık · '+BG.mm+' mm':'Temel çizgi ızgarası kapalı')}
function bgSet(mm){BG.mm=mm;BG.on=true;bgDraw();toast('Temel çizgi aralığı '+mm+' mm')}
function bgSnap(){const L=txts();if(!L.length)return toast('Önce metin seç');const st=BG.mm/(S.mm[0]/100);
 L.forEach(e=>{const lineH=e.fs*e.lh,k=Math.max(1,Math.round(lineH/st));e.lh=+Math.max(.6,Math.min(2.4,k*st/e.fs)).toFixed(3);const g=geo(e,100),top=g[1]+(e.dy||0),tgt=S.mar+Math.round((top-S.mar)/st)*st;e.dy=+((e.dy||0)+tgt-top).toFixed(2)});
 BG.on=true;render();ed();hist();toast('Satırlar '+BG.mm+' mm temel çizgiye oturtuldu')}
const r2=render;render=function(){const r=r2.apply(this,arguments);bgDraw();return r};

/* ---------- tipografik düzeltme ---------- */
function typo(s){const keep=[];s=s.replace(/\S+:\/\/\S+/g,u=>{keep.push(u);return '\u0001'+(keep.length-1)+'\u0002'});
 s=s.replace(/(^|[\s(\[{—–])"/g,'$1“').replace(/"/g,'”').replace(/(^|[\s(\[{])'/g,'$1‘').replace(/'/g,'’').replace(/\.{3}/g,'…').replace(/(\s)-{1,2}(\s)/g,'$1–$2').replace(/[ \t]{2,}/g,' ').replace(/ +([,.;:!?…])/g,'$1').replace(/([,;])(?=[A-Za-zÇĞİÖŞÜçğıöşü])/g,'$1 ').replace(/[ \t]+$/gm,'');
 return s.replace(/\u0001(\d+)\u0002/g,(m,i)=>keep[+i])}
function typoFix(){let L=txts();const all=!L.length;if(all)L=S.els.filter(e=>e.txt!==undefined&&!(e.tg&&!e.hd));let n=0;L.forEach(e=>{const t=typo(String(e.txt));if(t!==e.txt){e.txt=t;n++}});if(!n)return toast('Düzeltilecek bir şey bulunmadı');render();ed();hist();toast(n+' metin düzeltildi'+(all?' (sayfadaki tüm metinler)':''))}

/* ---------- komutlar, düğmeler ---------- */
v4cmd(['Metin','Madde işaretli liste',['Ctrl+Shift+8'],()=>listify('b')]);
v4cmd(['Metin','Numaralı liste',['Ctrl+Shift+7'],()=>listify('n')]);
[2,3,4,5].forEach(n=>v4cmd(['Metin',`Büyük baş harf (${n} satır)`,[],()=>dropcap(n)]));
v4cmd(['Metin','Büyük baş harfi kaldır',[],undrop]);
v4cmd(['Metin','Tipografik düzelt (tırnak, tire, …)',[],typoFix]);
v4cmd(['Sayfa','Tablo ekle…',['Ctrl+Alt+Y'],tableUI]);
v4cmd(['Görünüm','Temel çizgi ızgarasını aç/kapat',['Ctrl+Alt+B'],bgToggle]);
[4,5,6,8].forEach(n=>v4cmd(['Görünüm',`Temel çizgi aralığı: ${n} mm`,[],()=>bgSet(n)]));
v4cmd(['Metin','Satırları temel çizgiye oturt',[],bgSnap]);
const pe=window.v4extra,pc=window.v4cb;
window.v4extra=o=>(pe?pe(o):'')+(o.txt!==undefined&&o.type!='m'&&o.type!='t'?`<button class="cbb wide" data-cbg="lsb" title="Madde işaretli liste (Ctrl+Shift+8)">• Liste</button><button class="cbb wide" data-cbg="lsn" title="Numaralı liste (Ctrl+Shift+7)">1. Liste</button>`+(o.dcp?`<button class="cbb wide" data-cbg="dcx" title="Büyük baş harfi kaldır">Harfi geri al</button>`:`<button class="cbb wide" data-cbg="dcp" title="İlk harfi büyüt (3 satır)">Büyük harf</button>`):o.dcp?`<button class="cbb wide" data-cbg="dcx" title="Büyük baş harfi kaldır">Harfi geri al</button>`:'')+(o.txt!==undefined?`<button class="cbb wide" data-cbg="bgs" title="Satırları temel çizgi ızgarasına oturt">Temel çizgi</button>`:'');
window.v4cb=(g,t)=>{if(g=='lsb'){listify('b');return true}if(g=='lsn'){listify('n');return true}if(g=='dcp'){dropcap(3);return true}if(g=='dcx'){undrop();return true}if(g=='bgs'){bgSnap();return true}return pc?pc(g,t):false};
window.v4typo={listify,dropcap,undrop,buildTable,parseData,typo,typoFix,bgSnap,BG,bgToggle};
})();
