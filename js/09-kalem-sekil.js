/* ================= STÜDYO 8: kalem (pen), düğüm düzenleme, şekiller, pathfinder, ölçü, silgi ================= */
(function(){
const NS='http://www.w3.org/2000/svg';
const {IC,TOOLS,svg,inField}=window.v4ui,CVW=$('cvw'),cvEl=$('cv'),setTool=t=>v4ui.setTool(t),useTool=t=>v4ui.useTool(t),stBar=()=>v4ui.stBar();
const fx=n=>+(+n).toFixed(3);
const D=(a,b,c,d)=>Math.hypot(c-a,d-b);
const ptr=ev=>{const r=$('cv').getBoundingClientRect();return[(ev.clientX-r.left)/r.width*100,(ev.clientY-r.top)/r.width*100]};
const pxu=()=>100/Math.max(50,$('cv').getBoundingClientRect().width);   /* 1 piksel kaç cqw */
const onPage=ev=>ev.target.closest&&ev.target.closest('.cvp');
const sw0=e=>e.sw2===0?0:(e.sw2||1);

/* ---------- düğüm modeli: [x,y, giren(dx,dy), çıkan(dx,dy)] — tutamaçlar düğüme göre bağıl ---------- */
const N=(x,y,ix=0,iy=0,ox=0,oy=0)=>[x,y,ix,iy,ox,oy];
const isL=(a,b)=>!(a[4]||a[5]||b[2]||b[3]);
const segD=(a,b)=>isL(a,b)?`L${fx(b[0])} ${fx(b[1])}`:`C${fx(a[0]+a[4])} ${fx(a[1]+a[5])} ${fx(b[0]+b[2])} ${fx(b[1]+b[3])} ${fx(b[0])} ${fx(b[1])}`;
function nodesD(nd,cl){if(!nd.length)return'';let d=`M${fx(nd[0][0])} ${fx(nd[0][1])}`;if(nd.length==1)return d+'l.01 0';for(let i=1;i<nd.length;i++)d+=segD(nd[i-1],nd[i]);if(cl)d+=segD(nd[nd.length-1],nd[0])+'Z';return d}
function bzp(a,b,t){const x0=a[0],y0=a[1],x1=a[0]+a[4],y1=a[1]+a[5],x2=b[0]+b[2],y2=b[1]+b[3],x3=b[0],y3=b[1],u=1-t;
 return[u*u*u*x0+3*u*u*t*x1+3*u*t*t*x2+t*t*t*x3,u*u*u*y0+3*u*u*t*y1+3*u*t*t*y2+t*t*t*y3]}
function bnd(nd,cl){let a=1e9,b=1e9,c=-1e9,d=-1e9;const add=(x,y)=>{if(x<a)a=x;if(x>c)c=x;if(y<b)b=y;if(y>d)d=y};const n=nd.length;
 for(let i=0;i<n;i++){add(nd[i][0],nd[i][1]);const j=i+1<n?i+1:(cl?0:-1);if(j<0)continue;const A=nd[i],B=nd[j];if(isL(A,B))continue;for(let k=1;k<16;k++){const p=bzp(A,B,k/16);add(p[0],p[1])}}return[a,b,c,d]}
function arrowD(e){const nd=e.nd;if(!nd||nd.length<2||e.cl||!(+e.ar))return'';const sw=sw0(e)||1,L=Math.max(sw*3.2,1.2),A=.5;
 const tip=(p,q)=>{const a=Math.atan2(p[1]-q[1],p[0]-q[0]);return[1,-1].map(s=>`M${fx(p[0]-L*Math.cos(a+s*A))} ${fx(p[1]-L*Math.sin(a+s*A))}L${fx(p[0])} ${fx(p[1])}`).join('')};
 const n=nd.length,l=nd[n-1],pl=nd[n-2];let d=tip(l,(l[2]||l[3])?[l[0]+l[2],l[1]+l[3]]:(pl[4]||pl[5])?[pl[0]+pl[4],pl[1]+pl[5]]:[pl[0],pl[1]]);
 if(+e.ar==2){const f=nd[0],nx=nd[1];d+=tip(f,(f[4]||f[5])?[f[0]+f[4],f[1]+f[5]]:(nx[2]||nx[3])?[nx[0]+nx[2],nx[1]+nx[3]]:[nx[0],nx[1]])}return d}
const od=window.v4dpath;
window.v4dpath=e=>e.dd?e.dd:e.nd?nodesD(e.nd,e.cl)+arrowD(e):od(e);
const dash=e=>{const w=sw0(e)||1;return e.dash=='d'?`${fx(w*3)} ${fx(w*2)}`:e.dash=='o'?`0.01 ${fx(w*2.2)}`:''};
const fillOf=e=>e.fon?(e.fl||e.col):'none';
window.v4dsvg=e=>{const w=sw0(e),da=dash(e);return `fill="${fillOf(e)}"${e.eo?' fill-rule="evenodd"':''} stroke="${w?e.col:'none'}" stroke-width="${w}" stroke-linecap="${e.cap||'round'}" stroke-linejoin="${e.jn||'round'}"${da?` stroke-dasharray="${da}"`:''}`};
window.v4drawHTML=(e,p,sl)=>{const v=e.vb||[1,1],shd=e.sx||e.sy||e.sb?`filter:drop-shadow(${e.sx}cqw ${e.sy}cqw ${e.sb}cqw ${rgba(e.scol,.55)});`:'';
 return `<div class="e${sl}" data-id="${e.id}" style="${p}pointer-events:none;${shd}"><svg viewBox="0 0 ${fx(v[0])} ${fx(v[1])}" preserveAspectRatio="none" style="width:100%;height:100%;display:block;overflow:visible;pointer-events:none"><path d="${v4dpath(e)}" ${v4dsvg(e)} style="pointer-events:visiblePainted"/></svg></div>`};
window.v4drawCv=(x,e,X,Y,w,h)=>{const v=e.vb||[1,1],sw=sw0(e);x.translate(X,Y);x.scale(w/v[0],h/v[1]);const P=new Path2D(v4dpath(e));
 if(e.fon){x.fillStyle=fillOf(e);x.fill(P,e.eo?'evenodd':'nonzero')}
 if(sw){x.strokeStyle=e.col;x.lineWidth=sw;x.lineCap=e.cap||'round';x.lineJoin=e.jn||'round';const da=dash(e);x.setLineDash(da?da.split(' ').map(Number):[]);x.stroke(P)}};

/* sayfa koordinatındaki düğümlerden öğenin geometrisini kur (döndürme sıfırlanır, görünüm aynı kalır) */
function setGeom(e,nd,cl){const sw=sw0(e),pad=sw/2+.2+((+e.ar)?Math.max((sw||1)*3.2,1.2):0),[a,b,c,d]=bnd(nd,cl),W=Math.max(.5,c-a+2*pad),H=Math.max(.5,d-b+2*pad),x0=a-pad,y0=b-pad;
 e.fr=[fx(x0),fx(y0),fx(W),fx(H)];e.vb=[fx(W),fx(H)];e.nd=nd.map(n=>[fx(n[0]-x0),fx(n[1]-y0),fx(n[2]),fx(n[3]),fx(n[4]),fx(n[5])]);e.cl=!!cl;e.pin=true;e.rot=0;e.dx=0;e.dy=0;delete e.dd}
function toPageNodes(e){const[X0,Y0,w,h]=e.fr,v=e.vb||[1,1],sx=w/v[0],sy=h/v[1],cx=X0+w/2,cy=Y0+h/2,r=(e.rot||0)*Math.PI/180,co=Math.cos(r),si=Math.sin(r),dx=e.dx||0,dy=e.dy||0;
 const P=(x,y)=>{const X=X0+x*sx-cx,Y=Y0+y*sy-cy;return[cx+X*co-Y*si+dx,cy+X*si+Y*co+dy]},V=(x,y)=>{const X=x*sx,Y=y*sy;return[X*co-Y*si,X*si+Y*co]};
 return e.nd.map(n=>{const p=P(n[0],n[1]),i=V(n[2],n[3]),o=V(n[4],n[5]);return[p[0],p[1],i[0],i[1],o[0],o[1]]})}
function addEl(e){e.z=topZ()+10;S.els.push(e);S.sel=e.id;MSEL.clear();render();list();ed();hist();stBar()}
function newPath(nd,cl,o){const e=mk('r');Object.assign(e,{shape:'draw',nm:'Yol',col:'#1a1a1a',sw2:.5,fl:'#ffd23f',fon:false},o||{});setGeom(e,nd,cl);addEl(e);return e}

/* ---------- ayarlar ---------- */
const PEN={col:'#1a1a1a',w:.5,fl:'#ffd23f',fon:false};
const SH={t:'star',n:5,ir:.45,rd:0,fl:'#ff5d73',col:'#1a1a1a',w:0};
let pen=null,NE=null;

/* ---------- KALEM ARACI ---------- */
function penDraw(){let s=$('pens');if(!pen){if(s)s.remove();return}
 if(!s||!s.isConnected){s=document.createElementNS(NS,'svg');s.id='pens';s.setAttribute('viewBox',`0 0 100 ${100/S.fmt}`);s.setAttribute('preserveAspectRatio','none');s.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:9999';$('cv').appendChild(s)}
 const nd=pen.nd,u=pxu();let d=nodesD(nd,false);if(pen.cur&&nd.length&&!pen.drag)d+=segD(nd[nd.length-1],[pen.cur[0],pen.cur[1],0,0,0,0]);
 let h=`<path d="${d}" fill="${PEN.fon?PEN.fl:'none'}" fill-opacity=".3" stroke="${PEN.col}" stroke-width="${PEN.w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const q=4*u;
 nd.forEach((n,i)=>{if(pen.drag&&pen.drag.n===n&&(n[4]||n[5])){h+=`<path d="M${fx(n[0]+n[2])} ${fx(n[1]+n[3])}L${fx(n[0]+n[4])} ${fx(n[1]+n[5])}" stroke="#7c5cff" stroke-width="${1.2*u}" fill="none"/><circle cx="${fx(n[0]+n[4])}" cy="${fx(n[1]+n[5])}" r="${3*u}" fill="#7c5cff"/><circle cx="${fx(n[0]+n[2])}" cy="${fx(n[1]+n[3])}" r="${3*u}" fill="#7c5cff"/>`}
  h+=`<rect x="${fx(n[0]-q)}" y="${fx(n[1]-q)}" width="${fx(2*q)}" height="${fx(2*q)}" fill="${i==0?'#7c5cff':'#fff'}" stroke="#7c5cff" stroke-width="${1.4*u}"/>`});
 s.innerHTML=h}
function penFinish(close,cancel){const P=pen;pen=null;penDraw();if(!P||cancel)return;const nd=P.nd;if(nd.length<2)return;
 newPath(nd,close,{col:PEN.col,sw2:PEN.w,fl:PEN.fl,fon:!!(close&&PEN.fon),nm:close?'Şekil':'Yol'})}
function snap45(a,p){const dx=p[0]-a[0],dy=p[1]-a[1],r=Math.hypot(dx,dy),an=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4;return[a[0]+r*Math.cos(an),a[1]+r*Math.sin(an)]}
CVW.addEventListener('pointerdown',ev=>{if(SDK.tool!='n'||ev.button>0||SDK.space||!PROJ||!onPage(ev))return;
 ev.preventDefault();ev.stopImmediatePropagation();let p=ptr(ev);if(!pen)pen={nd:[],cur:null,drag:null};const nd=pen.nd,u=pxu(),last=nd[nd.length-1];
 if(nd.length>=2&&D(p[0],p[1],nd[0][0],nd[0][1])<9*u){penFinish(true);return}
 if(last&&D(p[0],p[1],last[0],last[1])<3*u){penFinish(false);return}
 if(ev.shiftKey&&last)p=snap45(last,p);
 const n=N(p[0],p[1]);nd.push(n);pen.drag={id:ev.pointerId,n,p0:p};try{CVW.setPointerCapture(ev.pointerId)}catch(x){}penDraw()},true);
CVW.addEventListener('pointermove',ev=>{if(SDK.tool!='n'||!pen)return;const p=ptr(ev);
 if(pen.drag&&ev.pointerId==pen.drag.id){const n=pen.drag.n;let dx=p[0]-n[0],dy=p[1]-n[1];if(Math.hypot(dx,dy)>3*pxu()){if(ev.shiftKey){const q=snap45([0,0],[dx,dy]);dx=q[0];dy=q[1]}n[4]=dx;n[5]=dy;if(ev.altKey){n[2]=0;n[3]=0}else{n[2]=-dx;n[3]=-dy}}}
 else pen.cur=p;penDraw()});
const penUp=ev=>{if(pen&&pen.drag&&ev.pointerId==pen.drag.id){pen.drag=null;try{CVW.releasePointerCapture(ev.pointerId)}catch(x){}penDraw()}};
CVW.addEventListener('pointerup',penUp);CVW.addEventListener('pointercancel',penUp);
const penKey=ev=>{if(!pen||SDK.tool!='n')return false;
 if(ev.key=='Enter'||ev.key=='Escape'){penFinish(false,pen.nd.length<2);return true}
 if(ev.key=='Backspace'||ev.key=='Delete'||((ev.ctrlKey||ev.metaKey)&&!ev.shiftKey&&ev.key.toLowerCase()=='z')){pen.nd.pop();if(!pen.nd.length)pen=null;penDraw();return true}return false};

/* ---------- ŞEKİL KÜTÜPHANESİ ---------- */
function normPts(P){const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),a=Math.min(...xs),b=Math.min(...ys),w=Math.max(...xs)-a||1,h=Math.max(...ys)-b||1;return P.map(p=>[(p[0]-a)/w,(p[1]-b)/h])}
function roundPoly(P,t){const n=P.length;if(!Array.isArray(t)&&!(t>0))return P.map(p=>N(p[0],p[1]));const o=[];
 for(let i=0;i<n;i++){const U=P[(i+n-1)%n],V=P[i],W=P[(i+1)%n],tt=Array.isArray(t)?t[i]:t;if(!(tt>0)){o.push(N(V[0],V[1]));continue}
  const A=[V[0]+(U[0]-V[0])*tt,V[1]+(U[1]-V[1])*tt],B=[V[0]+(W[0]-V[0])*tt,V[1]+(W[1]-V[1])*tt],k=.55;
  o.push(N(A[0],A[1],0,0,(V[0]-A[0])*k,(V[1]-A[1])*k));o.push(N(B[0],B[1],(V[0]-B[0])*k,(V[1]-B[1])*k,0,0))}return o}
const ELL=(k=.5523)=>[N(.5,0,-k*.5,0,k*.5,0),N(1,.5,0,-k*.5,0,k*.5),N(.5,1,k*.5,0,-k*.5,0),N(0,.5,0,k*.5,0,-k*.5)];
const star=(n,ir)=>{const P=[];for(let i=0;i<2*n;i++){const r=(i%2?ir:1)*.5,a=-Math.PI/2+i*Math.PI/n;P.push([.5+r*Math.cos(a),.5+r*Math.sin(a)])}return normPts(P)};
const poly=n=>{const P=[];for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;P.push([.5+.5*Math.cos(a),.5+.5*Math.sin(a)])}return normPts(P)};
const SHAPES=[
 ['star','Yıldız',p=>roundPoly(star(p.n,p.ir),p.rd)],
 ['poly','Çokgen',p=>roundPoly(poly(Math.max(3,p.n)),p.rd)],
 ['burst','Patlama',p=>roundPoly(star(Math.max(8,p.n*3),.8),p.rd)],
 ['rrect','Yuvarlak dikdörtgen',p=>roundPoly([[0,0],[1,0],[1,1],[0,1]],Math.max(.04,p.rd||.2))],
 ['arrow','Ok',p=>roundPoly([[0,.32],[.58,.32],[.58,.05],[1,.5],[.58,.95],[.58,.68],[0,.68]],p.rd)],
 ['darrow','Çift ok',p=>roundPoly([[0,.5],[.22,.1],[.22,.33],[.78,.33],[.78,.1],[1,.5],[.78,.9],[.78,.67],[.22,.67],[.22,.9]],p.rd)],
 ['heart','Kalp',()=>[N(.5,.93,.4,-.31,-.4,-.31),N(.15,.18,-.15,.17,.13,-.14),N(.5,.28,-.05,-.18,.05,-.18),N(.85,.18,-.13,-.14,.15,.17)]],
 ['bubble','Konuşma balonu',p=>roundPoly([[0,0],[1,0],[1,.76],[.52,.76],[.3,1],[.34,.76],[0,.76]],[.16,.16,.16,0,0,0,.16])],
 ['ring','Halka',null],
 ['plus','Artı',p=>roundPoly([[.33,0],[.67,0],[.67,.33],[1,.33],[1,.67],[.67,.67],[.67,1],[.33,1],[.33,.67],[0,.67],[0,.33],[.33,.33]],p.rd)],
 ['diamond','Elmas',p=>roundPoly([[.5,0],[1,.5],[.5,1],[0,.5]],p.rd)],
 ['ribbon','Şerit',p=>roundPoly([[0,0],[1,0],[.9,.5],[1,1],[0,1],[.1,.5]],p.rd)],
 ['bolt','Yıldırım',p=>roundPoly([[.58,0],[.12,.56],[.45,.56],[.34,1],[.88,.4],[.54,.4]],p.rd)]
];
function shapeEl(t,x0,y0,W,H){const P={n:SH.n,ir:SH.ir,rd:SH.rd};const base={col:SH.col,sw2:SH.w,fl:SH.fl,fon:true,nm:(SHAPES.find(s=>s[0]==t)||[0,'Şekil'])[1]};
 if(t=='ring'){const e=mk('r');Object.assign(e,{shape:'draw',...base,eo:true,fr:[fx(x0),fx(y0),fx(W),fx(H)],vb:[fx(W),fx(H)],pin:true});
  const rx=W/2,ry=H/2,cx=W/2,cy=H/2,ix=rx*.58,iy=ry*.58,el=(a,b)=>`M${fx(cx-a)} ${fx(cy)}A${fx(a)} ${fx(b)} 0 1 0 ${fx(cx+a)} ${fx(cy)}A${fx(a)} ${fx(b)} 0 1 0 ${fx(cx-a)} ${fx(cy)}Z`;
  e.dd=el(rx,ry)+el(ix,iy);addEl(e);return e}
 const g=SHAPES.find(s=>s[0]==t)[2],nd=g(P).map(n=>[x0+n[0]*W,y0+n[1]*H,n[2]*W,n[3]*H,n[4]*W,n[5]*H]);return newPath(nd,true,base)}
let sd=null;
function shPrev(){let s=$('shs');if(!sd){if(s)s.remove();return}
 if(!s||!s.isConnected){s=document.createElementNS(NS,'svg');s.id='shs';s.setAttribute('viewBox',`0 0 100 ${100/S.fmt}`);s.setAttribute('preserveAspectRatio','none');s.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:9999';$('cv').appendChild(s)}
 const r=sd.r;s.innerHTML=`<rect x="${fx(r[0])}" y="${fx(r[1])}" width="${fx(r[2])}" height="${fx(r[3])}" fill="${SH.fl}" fill-opacity=".25" stroke="#7c5cff" stroke-width="${1.2*pxu()}" stroke-dasharray="${3*pxu()} ${3*pxu()}"/>`}
function shRect(a,b,ev){let x0=a[0],y0=a[1],w=b[0]-a[0],h=b[1]-a[1];if(ev.shiftKey){const m=Math.max(Math.abs(w),Math.abs(h));w=Math.sign(w||1)*m;h=Math.sign(h||1)*m}
 if(ev.altKey){x0-=w;y0-=h;w*=2;h*=2}if(w<0){x0+=w;w=-w}if(h<0){y0+=h;h=-h}return[x0,y0,w,h]}
CVW.addEventListener('pointerdown',ev=>{if(SDK.tool!='u'||ev.button>0||SDK.space||!PROJ||!onPage(ev))return;ev.preventDefault();ev.stopImmediatePropagation();
 const p=ptr(ev);sd={id:ev.pointerId,p0:p,r:[p[0],p[1],0,0]};try{CVW.setPointerCapture(ev.pointerId)}catch(x){}},true);
CVW.addEventListener('pointermove',ev=>{if(!sd||ev.pointerId!=sd.id)return;sd.r=shRect(sd.p0,ptr(ev),ev);shPrev()});
function shEnd(ev,cancel){if(!sd||ev.pointerId!=sd.id)return;const s=sd;sd=null;try{CVW.releasePointerCapture(ev.pointerId)}catch(x){}shPrev();if(cancel)return;
 let[x,y,w,h]=s.r;if(w<1.2||h<1.2){const wide=['arrow','darrow','bubble','ribbon'].includes(SH.t);w=wide?30:22;h=wide?w*.7:22;x=s.p0[0]-w/2;y=s.p0[1]-h/2}
 shapeEl(SH.t,x,y,w,h)}
CVW.addEventListener('pointerup',ev=>shEnd(ev,false));CVW.addEventListener('pointercancel',ev=>shEnd(ev,true));

/* ---------- ÖĞE → YOL ---------- */
function xf(nd,cx,cy,rot,dx,dy){const r=rot*Math.PI/180,co=Math.cos(r),si=Math.sin(r);return nd.map(n=>{const X=n[0]-cx,Y=n[1]-cy;return[cx+X*co-Y*si+dx,cy+X*si+Y*co+dy,n[2]*co-n[3]*si,n[2]*si+n[3]*co,n[4]*co-n[5]*si,n[4]*si+n[5]*co]})}
function toPath(e){if(!e||e.type!='r')return false;if(e.shape=='draw'){if(e.nd||e.dd)return false}
 const[X,Y,w,h]=geo(e,100),cx=X+w/2,cy=Y+h/2;let nd,cl=true,o={};
 if(e.shape=='circle')nd=ELL().map(n=>[X+n[0]*w,Y+n[1]*h,n[2]*w,n[3]*h,n[4]*w,n[5]*h]);
 else if(e.shape=='tri')nd=[[X+w/2,Y],[X+w,Y+h],[X,Y+h]].map(p=>N(p[0],p[1]));
 else if(e.shape=='line'){nd=[N(X,Y+h/2),N(X+w,Y+h/2)];cl=false;o={sw2:.6,fon:false}}
 else nd=roundPoly([[X,Y],[X+w,Y],[X+w,Y+h],[X,Y+h]],Math.min(.5,(e.rad||0)/100)).map(n=>n);
 nd=xf(nd,cx,cy,e.rot||0,e.dx||0,e.dy||0);
 Object.assign(e,{shape:'draw',nm:e.nm||'Yol',fl:e.col,fon:cl,sw2:0,cap:'round',jn:'round',...o});if(!cl)Object.assign(e,{col:e.col,sw2:o.sw2});
 delete e.rad;setGeom(e,nd,cl);return true}
function cmdToPath(){const L=selEls().filter(e=>e.type=='r'&&!(e.shape=='draw'));if(!L.length)return toast('Dikdörtgen, elips, üçgen ya da çizgi seç');L.forEach(toPath);render();list();ed();hist();toast('Yola çevrildi · artık düğümleri düzenlenebilir')}

/* ---------- DÜĞÜM DÜZENLEME ---------- */
function neEnter(id,node){const e=byId(id);if(!e||e.shape!='draw'||!e.nd)return toast('Düğüm düzenleme yalnızca kalem/şekil yollarında çalışır');
 S.sel=id;MSEL.clear();const nd=toPageNodes(e);if(e.rot||e.dx||e.dy||(e.vb&&(Math.abs(e.vb[0]-e.fr[2])>.01||Math.abs(e.vb[1]-e.fr[3])>.01)))setGeom(e,nd,e.cl);
 NE={id,sel:node==null?-1:node};setTool('a');render();list();ed();neDraw()}
function neExit(){NE=null;const s=$('nes');if(s)s.remove()}
function neEl(){if(!NE)return null;const e=byId(NE.id);if(!e||!e.nd||S.sel!=NE.id){neExit();return null}return e}
function neDraw(){const e=neEl();if(!e)return;let s=$('nes');
 if(!s||!s.isConnected){s=document.createElementNS(NS,'svg');s.id='nes';s.setAttribute('viewBox',`0 0 100 ${100/S.fmt}`);s.setAttribute('preserveAspectRatio','none');s.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:9998';$('cv').appendChild(s);s.addEventListener('pointerdown',neDown)}
 const nd=toPageNodes(e),u=pxu(),q=4.5*u,cl=e.cl,n=nd.length;let h='';
 for(let i=0;i<(cl?n:n-1);i++){const A=nd[i],B=nd[(i+1)%n];h+=`<path data-k="s" data-i="${i}" d="M${fx(A[0])} ${fx(A[1])}${segD(A,B)}" fill="none" stroke="transparent" stroke-width="${12*u}" style="pointer-events:stroke;cursor:copy"/>`}
 h+=`<path d="${nodesD(nd,cl)}" fill="none" stroke="#7c5cff" stroke-width="${1.2*u}" style="pointer-events:none"/>`;
 const sel=NE.sel;
 nd.forEach((p,i)=>{if(i==sel){[[2,3,'i'],[4,5,'o']].forEach(([a,b,k])=>{if(p[a]||p[b]){const hx=p[0]+p[a],hy=p[1]+p[b];h+=`<path d="M${fx(p[0])} ${fx(p[1])}L${fx(hx)} ${fx(hy)}" stroke="#7c5cff" stroke-width="${1*u}" fill="none"/><circle data-k="${k}" data-i="${i}" cx="${fx(hx)}" cy="${fx(hy)}" r="${3.6*u}" fill="#fff" stroke="#7c5cff" stroke-width="${1.4*u}" style="pointer-events:all;cursor:pointer"/>`}})}
  const sm=!!(p[2]||p[3]||p[4]||p[5]);
  h+=sm?`<circle data-k="n" data-i="${i}" cx="${fx(p[0])}" cy="${fx(p[1])}" r="${q}" fill="${i==sel?'#7c5cff':'#fff'}" stroke="#7c5cff" stroke-width="${1.6*u}" style="pointer-events:all;cursor:move"/>`
   :`<rect data-k="n" data-i="${i}" x="${fx(p[0]-q)}" y="${fx(p[1]-q)}" width="${fx(2*q)}" height="${fx(2*q)}" fill="${i==sel?'#7c5cff':'#fff'}" stroke="#7c5cff" stroke-width="${1.6*u}" style="pointer-events:all;cursor:move"/>`});
 s.innerHTML=h}
function neSmooth(nd,i,cl){const n=nd.length,a=nd[(i+n-1)%n],b=nd[(i+1)%n],p=nd[i];const pa=(!cl&&i==0)?p:a,pb=(!cl&&i==n-1)?p:b;let tx=pb[0]-pa[0],ty=pb[1]-pa[1];const L=Math.hypot(tx,ty)||1;tx/=L;ty/=L;
 const la=D(p[0],p[1],pa[0],pa[1])/3,lb=D(p[0],p[1],pb[0],pb[1])/3;p[2]=(!cl&&i==0)?0:-tx*la;p[3]=(!cl&&i==0)?0:-ty*la;p[4]=(!cl&&i==n-1)?0:tx*lb;p[5]=(!cl&&i==n-1)?0:ty*lb}
function neSplit(nd,i,pt,cl){const n=nd.length,A=nd[i],jj=(i+1)%n,B=nd[jj];let best=0,bd=1e9;const straight=isL(A,B);
 for(let k=1;k<40;k++){const t=k/40,p=straight?[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t]:bzp(A,B,t),d=D(p[0],p[1],pt[0],pt[1]);if(d<bd){bd=d;best=t}}
 const t=best;let nn;
 if(straight)nn=N(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t);
 else{const L=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k],P0=[A[0],A[1]],P1=[A[0]+A[4],A[1]+A[5]],P2=[B[0]+B[2],B[1]+B[3]],P3=[B[0],B[1]],Q0=L(P0,P1,t),Q1=L(P1,P2,t),Q2=L(P2,P3,t),R0=L(Q0,Q1,t),R1=L(Q1,Q2,t),S0=L(R0,R1,t);
  A[4]=Q0[0]-A[0];A[5]=Q0[1]-A[1];B[2]=Q2[0]-B[0];B[3]=Q2[1]-B[1];nn=N(S0[0],S0[1],R0[0]-S0[0],R0[1]-S0[1],R1[0]-S0[0],R1[1]-S0[1])}
 const at=i+1;nd.splice(at,0,nn);return at}
function neDown(ev){const t=ev.target;if(!t.dataset||!t.dataset.k)return;const e=neEl();if(!e)return;ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation&&ev.stopImmediatePropagation();
 const k=t.dataset.k,i=+t.dataset.i;let nd=toPageNodes(e),sel=i,mode=k,moved=false;
 if(k=='n'&&ev.altKey){const p=nd[i];if(p[2]||p[3]||p[4]||p[5]){p[2]=p[3]=p[4]=p[5]=0}else neSmooth(nd,i,e.cl);setGeom(e,nd,e.cl);NE.sel=i;render();hist();ed();neDraw();return}
 if(k=='s'){const p=ptr(ev);sel=neSplit(nd,i,p,e.cl);mode='n';moved=true;setGeom(e,nd,e.cl)}
 NE.sel=sel;const start=ptr(ev),orig=nd.map(n=>n.slice());
 const mv=m=>{const p=ptr(m),dx=p[0]-start[0],dy=p[1]-start[1];if(!moved&&Math.hypot(dx,dy)<2*pxu())return;moved=true;const cur=orig.map(n=>n.slice()),n=cur[sel];
  if(mode=='n'){n[0]+=dx;n[1]+=dy;if(m.shiftKey){const q=snap45([orig[sel][0],orig[sel][1]],[n[0],n[1]]);n[0]=q[0];n[1]=q[1]}}
  else{const ix=mode=='i'?2:4,iy=ix+1,ox=mode=='i'?4:2,oy=ox+1,hx=orig[sel][ix]+dx,hy=orig[sel][iy]+dy;n[ix]=hx;n[iy]=hy;
   const oo=orig[sel],col=Math.abs(oo[2]*oo[5]-oo[3]*oo[4])<.01*Math.hypot(oo[2],oo[3])*Math.hypot(oo[4],oo[5])+1e-6&&(oo[2]*oo[4]+oo[3]*oo[5])<0;
   if(!m.altKey&&(col||!(oo[ox]||oo[oy]))){const L=Math.hypot(oo[ox],oo[oy])||Math.hypot(hx,hy),M=Math.hypot(hx,hy)||1;n[ox]=-hx/M*L;n[oy]=-hy/M*L}}
  setGeom(e,cur,e.cl);render();neDraw()};
 const up=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);if(moved)hist();neDraw()};
 window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);
 if(moved&&k=='s'){render()}neDraw()}
function neDelete(){const e=neEl();if(!e||NE.sel<0)return false;const nd=toPageNodes(e);if(nd.length<=2){S.els=S.els.filter(x=>x!==e);S.sel=null;neExit();setTool('v');render();list();ed();hist();return true}
 nd.splice(NE.sel,1);NE.sel=Math.min(NE.sel,nd.length-1);setGeom(e,nd,e.cl);render();hist();neDraw();return true}
const neKey=ev=>{if(!NE)return false;const e=neEl();if(!e)return false;
 if(ev.key=='Escape'||ev.key=='Enter'){neExit();setTool('v');render();return true}
 if((ev.key=='Delete'||ev.key=='Backspace')&&NE.sel>=0){neDelete();return true}
 if(NE.sel>=0&&ev.key.startsWith('Arrow')&&!ev.ctrlKey&&!ev.metaKey){const st=ev.shiftKey?1:.1,nd=toPageNodes(e);nd[NE.sel][0]+=ev.key=='ArrowRight'?st:ev.key=='ArrowLeft'?-st:0;nd[NE.sel][1]+=ev.key=='ArrowDown'?st:ev.key=='ArrowUp'?-st:0;setGeom(e,nd,e.cl);render();hist();neDraw();return true}return false};
/* 'A' aracı: seç + düğümleri göster; boş yere tıklayınca bırak */
CVW.addEventListener('pointerdown',ev=>{if(SDK.tool!='a'||ev.button>0||SDK.space||!PROJ)return;if(ev.target.closest&&ev.target.closest('#nes')&&ev.target.dataset&&ev.target.dataset.k)return;
 const n=ev.target.closest&&ev.target.closest('.e');ev.preventDefault();ev.stopImmediatePropagation();
 if(n){const id=+n.dataset.id,o=byId(id);if(o&&o.shape=='draw'&&o.nd){if(!NE||NE.id!=id)neEnter(id);return}S.sel=id;MSEL.clear();neExit();render();list();ed();stBar();return}
 if(onPage(ev)){neExit();S.sel=null;MSEL.clear();render();list();ed();stBar()}},true);
let lt2={t:0,id:0};
window.addEventListener('pointerdown',ev=>{if(ev.button||SDK.tool!='v')return;const n=ev.target.closest&&ev.target.closest('#cv .e');if(!n)return;const id=+n.dataset.id,now=Date.now();if(lt2.id==id&&now-lt2.t<400){lt2.t=0;const o=byId(id);if(o&&o.shape=='draw'&&o.nd)setTimeout(()=>neEnter(id),30)}else lt2={t:now,id}},true);

/* araç değişimi ve render kancaları */
window.v4toolHook=t=>{if(pen&&t!='n')penFinish(false,pen.nd.length<2);if(NE&&t!='a')neExit();if(t!='o')mesClear();sd=null;shPrev()};
const render0=render;render=function(){const r=render0.apply(this,arguments);if(NE)neDraw();if(pen)penDraw();return r};

/* ---------- PATHFINDER (raster izleme ile; çokgen sonuç) ---------- */
let HC=null;
function elPath(e){const[X,Y,w,h]=geo(e,100),L=new Path2D(),P=new Path2D();
 if(e.shape=='draw'){const v=e.vb||[1,1];L.addPath(new Path2D(v4dpath({...e,ar:0})),new DOMMatrix().translate(e.fr[0],e.fr[1]).scale(w/v[0],h/v[1]))}
 else if(e.shape=='circle')L.ellipse(X+w/2,Y+h/2,w/2,h/2,0,0,Math.PI*2);
 else if(e.shape=='tri'){L.moveTo(X+w/2,Y);L.lineTo(X+w,Y+h);L.lineTo(X,Y+h);L.closePath()}
 else if(e.shape=='line')L.rect(X,Y+h/2-.3,w,.6);
 else{const rr=e.rad||0;if(rr>0&&L.roundRect)L.roundRect(X,Y,w,h,[{x:rr/100*w,y:rr/100*h}]);else L.rect(X,Y,w,h)}
 const cx=X+w/2,cy=Y+h/2;P.addPath(L,new DOMMatrix().translate(cx+(e.dx||0),cy+(e.dy||0)).rotate(e.rot||0).translate(-cx,-cy));return P}
function elBox(e){const[X,Y,w,h]=geo(e,100),cx=X+w/2,cy=Y+h/2,r=(e.rot||0)*Math.PI/180,co=Math.cos(r),si=Math.sin(r);let a=1e9,b=1e9,c=-1e9,d=-1e9;
 [[X,Y],[X+w,Y],[X+w,Y+h],[X,Y+h]].forEach(p=>{const x=cx+(p[0]-cx)*co-(p[1]-cy)*si+(e.dx||0),y=cy+(p[0]-cx)*si+(p[1]-cy)*co+(e.dy||0);a=Math.min(a,x);c=Math.max(c,x);b=Math.min(b,y);d=Math.max(d,y)});return[a,b,c,d]}
function dp(P,eps){if(P.length<4)return P;const n=P.length;const dist=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;if(!L)return Math.hypot(p[0]-a[0],p[1]-a[1]);let t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L;t=Math.max(0,Math.min(1,t));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)};
 const rec=(lo,hi,out)=>{let m=-1,md=0;for(let i=lo+1;i<hi;i++){const d=dist(P[i],P[lo],P[hi]);if(d>md){md=d;m=i}}if(md>eps){rec(lo,m,out);out.push(P[m]);rec(m,hi,out)}};
 let far=0,fd=0;for(let i=1;i<n;i++){const d=Math.hypot(P[i][0]-P[0][0],P[i][1]-P[0][1]);if(d>fd){fd=d;far=i}}
 const A=[],B=[];rec(0,far,A);const Q=P.slice(far).concat([P[0]]);const P2=P;
 const R=(arr,lo,hi,out)=>{let m=-1,md=0;for(let i=lo+1;i<hi;i++){const d=dist(arr[i],arr[lo],arr[hi]);if(d>md){md=d;m=i}}if(md>eps){R(arr,lo,m,out);out.push(arr[m]);R(arr,m,hi,out)}};
 R(Q,0,Q.length-1,B);return[P2[0],...A,P2[far],...B]}
function trace(img,w,h){const inside=new Uint8Array(w*h);for(let i=0;i<w*h;i++)inside[i]=img[i*4+3]>127?1:0;const W1=w+1,M=new Map();
 const add=(a,b)=>{const l=M.get(a);if(l)l.push(b);else M.set(a,[b])};
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!inside[y*w+x])continue;const tl=y*W1+x,tr=tl+1,bl=tl+W1,br=bl+1;
  if(y==0||!inside[(y-1)*w+x])add(tl,tr);if(x==w-1||!inside[y*w+x+1])add(tr,br);if(y==h-1||!inside[(y+1)*w+x])add(br,bl);if(x==0||!inside[y*w+x-1])add(bl,tl)}
 const loops=[];for(const[start]of M){while(M.get(start)&&M.get(start).length){let cur=start;const pts=[];do{const arr=M.get(cur);const nx=arr.pop();pts.push([cur%W1,Math.floor(cur/W1)]);cur=nx}while(cur!=start&&M.get(cur)&&M.get(cur).length>=0&&pts.length<4e6);loops.push(pts)}}
 return loops}
function pathfinder(op){const L=selEls().filter(e=>e.type=='r'&&!(e.shape=='draw'&&!e.fon&&!e.cl&&!e.dd));
 if(L.length<2)return toast('En az iki dolgulu şekil seç (açık çizgiler dahil edilmez)');L.sort((a,b)=>zOf(a)-zOf(b));
 let X0=1e9,Y0=1e9,X1=-1e9,Y1=-1e9;L.forEach(e=>{const b=elBox(e);X0=Math.min(X0,b[0]);Y0=Math.min(Y0,b[1]);X1=Math.max(X1,b[2]);Y1=Math.max(Y1,b[3])});
 X0-=.5;Y0-=.5;X1+=.5;Y1+=.5;const W=X1-X0,H=Y1-Y0,k=Math.min(2000/W,2000/H,60),cw=Math.max(8,Math.ceil(W*k)),ch=Math.max(8,Math.ceil(H*k));
 const c=document.createElement('canvas');c.width=cw;c.height=ch;const x=c.getContext('2d',{willReadFrequently:true});x.setTransform(k,0,0,k,-X0*k,-Y0*k);x.fillStyle='#000';
 L.forEach((e,i)=>{const P=elPath(e),rule=e.eo?'evenodd':'nonzero';x.globalCompositeOperation=i==0?'source-over':op=='u'?'source-over':op=='s'?'destination-out':op=='i'?'destination-in':'xor';x.fill(P,rule)});
 const img=x.getImageData(0,0,cw,ch).data,loops=trace(img,cw,ch);const eps=1.1;let dd='',cnt=0;
 loops.forEach(pts=>{let P=pts;const Q=[];for(let i=0;i<P.length;i++){const a=P[(i+P.length-1)%P.length],b=P[i],n=P[(i+1)%P.length];if((b[0]-a[0])*(n[1]-b[1])-(b[1]-a[1])*(n[0]-b[0])!==0)Q.push(b)}
  P=Q.length>=3?Q:P;P=dp(P,eps);if(P.length<3)return;let ar=0;for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];ar+=a[0]*b[1]-b[0]*a[1]}if(Math.abs(ar/2)<6)return;
  dd+='M'+P.map(p=>`${fx(p[0]/k+0)} ${fx(p[1]/k+0)}`).join('L')+'Z';cnt++});
 if(!cnt)return toast('Sonuç boş: şekiller kesişmiyor');
 const first=L[0],e=mk('r');Object.assign(e,{shape:'draw',nm:{u:'Birleşim',s:'Çıkarma',i:'Kesişim',x:'Dışlama'}[op],eo:true,fon:true,fl:first.shape=='draw'?(first.fl||first.col):first.col,col:first.col,sw2:0,dd,fr:[fx(X0),fx(Y0),fx(W),fx(H)],vb:[fx(W),fx(H)],pin:true,op:first.op});
 const top=Math.max(...L.map(zOf));S.els=S.els.filter(o=>!L.includes(o));e.z=top;S.els.push(e);S.sel=e.id;MSEL.clear();render();list();ed();hist();toast(({u:'Birleştirildi',s:'Öndeki şekil arkadakinden çıkarıldı',i:'Kesişim alındı',x:'Dışlama uygulandı'})[op]+' · çokgen yol')}

/* ---------- ÖLÇÜ ARACI ---------- */
let mes=null;
function mesClear(){mes=null;const s=$('mes');if(s)s.remove();const l=$('mesl');if(l)l.remove()}
const mmk=()=>S.mm[0]/100;
function mesDraw(){if(!mes)return;let s=$('mes');
 if(!s||!s.isConnected){s=document.createElementNS(NS,'svg');s.id='mes';s.setAttribute('viewBox',`0 0 100 ${100/S.fmt}`);s.setAttribute('preserveAspectRatio','none');s.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:9999';$('cv').appendChild(s)}
 let l=$('mesl');if(!l||!l.isConnected){l=document.createElement('div');l.id='mesl';l.style.cssText='position:absolute;z-index:10000;pointer-events:none;background:#7c5cff;color:#fff;font:600 12px/1.3 system-ui,sans-serif;padding:4px 8px;border-radius:7px;white-space:nowrap;transform:translate(-50%,-135%);box-shadow:0 4px 14px rgba(0,0,0,.3)';$('cv').appendChild(l)}
 const u=pxu();let h='',txt='',mx,my;
 if(mes.box){const b=mes.box;h=`<rect x="${fx(b[0])}" y="${fx(b[1])}" width="${fx(b[2]-b[0])}" height="${fx(b[3]-b[1])}" fill="#7c5cff" fill-opacity=".12" stroke="#7c5cff" stroke-width="${1.2*u}" stroke-dasharray="${4*u} ${3*u}"/>`;
  txt=`${fx((b[2]-b[0])*mmk()).toFixed(1)} × ${fx((b[3]-b[1])*mmk()).toFixed(1)} mm`;mx=(b[0]+b[2])/2;my=b[1]}
 else{const a=mes.a,b=mes.b,dx=(b[0]-a[0]),dy=(b[1]-a[1]),len=Math.hypot(dx,dy),an=Math.atan2(-dy,dx)*180/Math.PI;
  h=`<path d="M${fx(a[0])} ${fx(a[1])}L${fx(b[0])} ${fx(b[1])}" stroke="#7c5cff" stroke-width="${1.6*u}" fill="none"/><circle cx="${fx(a[0])}" cy="${fx(a[1])}" r="${3.4*u}" fill="#7c5cff"/><circle cx="${fx(b[0])}" cy="${fx(b[1])}" r="${3.4*u}" fill="#7c5cff"/><path d="M${fx(a[0])} ${fx(a[1])}L${fx(b[0])} ${fx(a[1])}L${fx(b[0])} ${fx(b[1])}" stroke="#7c5cff" stroke-opacity=".45" stroke-width="${1*u}" stroke-dasharray="${4*u} ${3*u}" fill="none"/>`;
  txt=`${(len*mmk()).toFixed(1)} mm · ${an.toFixed(1)}° · Δx ${(Math.abs(dx)*mmk()).toFixed(1)} · Δy ${(Math.abs(dy)*mmk()).toFixed(1)}`;mx=(a[0]+b[0])/2;my=(a[1]+b[1])/2}
 s.innerHTML=h;l.textContent=txt;l.style.left=mx+'cqw';l.style.top=my+'cqw'}
CVW.addEventListener('pointerdown',ev=>{if(SDK.tool!='o'||ev.button>0||SDK.space||!PROJ||!onPage(ev))return;ev.preventDefault();ev.stopImmediatePropagation();
 const p=ptr(ev);mes={a:p,b:p,id:ev.pointerId,n:ev.target.closest&&ev.target.closest('.e')};try{CVW.setPointerCapture(ev.pointerId)}catch(x){}mesDraw()},true);
CVW.addEventListener('pointermove',ev=>{if(SDK.tool!='o'||!mes||ev.pointerId!=mes.id||mes.fin)return;let p=ptr(ev);
 if(ev.shiftKey){const dx=p[0]-mes.a[0],dy=p[1]-mes.a[1],r=Math.hypot(dx,dy),an=Math.round(Math.atan2(dy,dx)/(Math.PI/12))*Math.PI/12;p=[mes.a[0]+r*Math.cos(an),mes.a[1]+r*Math.sin(an)]}
 mes.b=p;mes.box=null;mesDraw()});
const mesUp=ev=>{if(SDK.tool!='o'||!mes||ev.pointerId!=mes.id)return;try{CVW.releasePointerCapture(ev.pointerId)}catch(x){}mes.id=-1;
 if(D(mes.a[0],mes.a[1],mes.b[0],mes.b[1])<1.5*pxu()*2){const n=mes.n,o=n&&byId(+n.dataset.id);if(o){mes.box=elBox(o)}else{mesClear();return}}mesDraw()};
CVW.addEventListener('pointerup',mesUp);CVW.addEventListener('pointercancel',mesUp);
const mesKey=ev=>{if(SDK.tool=='o'&&mes&&ev.key=='Escape'){mesClear();return true}return false};
window.v4keyHook=ev=>{if(inField(ev))return false;if(penKey(ev)||neKey(ev)||mesKey(ev)){ev.preventDefault();ev.stopImmediatePropagation();return true}return false};

/* ---------- SİLGİ (çizim/yol nesnesi siler) ---------- */
let er=null;
function hitEl(e,x,y,tol){if(!HC)HC=document.createElement('canvas').getContext('2d');const P=elPath(e);HC.lineWidth=Math.max(sw0(e),tol);return(e.fon&&HC.isPointInPath(P,x,y,e.eo?'evenodd':'nonzero'))||HC.isPointInStroke(P,x,y)}
function erasePt(p){const tol=7*pxu();const hit=S.els.filter(e=>e.on&&e.type=='r'&&e.shape=='draw'&&!e.lock&&hitEl(e,p[0],p[1],tol));if(!hit.length)return;
 const top=hit.sort((a,b)=>zOf(b)-zOf(a))[0];S.els=S.els.filter(o=>o!==top);if(S.sel==top.id)S.sel=null;er.n++;render();list()}
CVW.addEventListener('pointerdown',ev=>{if(SDK.tool!='x'||ev.button>0||SDK.space||!PROJ||!onPage(ev))return;ev.preventDefault();ev.stopImmediatePropagation();er={id:ev.pointerId,n:0};try{CVW.setPointerCapture(ev.pointerId)}catch(x){}erasePt(ptr(ev))},true);
CVW.addEventListener('pointermove',ev=>{if(SDK.tool!='x'||!er||ev.pointerId!=er.id)return;erasePt(ptr(ev))});
const erUp=ev=>{if(!er||ev.pointerId!=er.id)return;const n=er.n;er=null;try{CVW.releasePointerCapture(ev.pointerId)}catch(x){}if(n){ed();hist();toast(n+' çizim silindi')}};
CVW.addEventListener('pointerup',erUp);CVW.addEventListener('pointercancel',erUp);

/* ---------- araç şeridi, çubuk ve komutlar ---------- */
const NEWT=[['n','Kalem · pen (bezier)','P','<path d="M12 3l7 9-7 9-7-9z"/><path d="M12 3v9"/><circle cx="12" cy="13" r="1.3"/>'],
 ['a','Düğüm seçimi · yol düzenle','A','<path d="M5 3l12 6-5.4 1.9L9.5 17z"/><rect x="14" y="14" width="6" height="6" rx="1"/>'],
 ['u','Şekil kütüphanesi','U','<path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 16.6 6.6 19.6l1.2-6L3.3 9.4l6.1-.8z"/>'],
 ['o','Ölçü aracı','O','<path d="M3 16l13-13 5 5L8 21z"/><path d="M7 12l2 2M10 9l1.5 1.5M13 6l2 2"/>'],
 ['x','Silgi · çizimleri sil','X','<path d="M8 20h12M4.5 14.5l8-8a2 2 0 013 0l3 3a2 2 0 010 3l-6 6H9z"/>']];
NEWT.forEach(([k,n,s,ic])=>{TOOLS.push([k,n,s]);IC[k]=svg(ic)});
(function(){const rail=$('rail')||document.querySelector('#rail');if(!rail)return;const z=rail.querySelector('[data-tool="z"]');
 const html=NEWT.map(([k,n,s])=>`<button class="rb" data-tool="${k}" title="${n} (${s})" aria-label="${n}" aria-pressed="false">${IC[k]}<kbd>${s}</kbd></button>`).join('');
 if(z)z.insertAdjacentHTML('afterend',html);else rail.insertAdjacentHTML('afterbegin',html)})();
const tc=(k,n,s,f)=>v4cmd(['Araçlar',n,[s],f]);
tc('n','Kalem (pen) aracı','P',()=>useTool('n'));tc('a','Düğüm seçim aracı','A',()=>useTool('a'));tc('u','Şekil kütüphanesi aracı','U',()=>useTool('u'));tc('o','Ölçü aracı','O',()=>useTool('o'));tc('x','Silgi aracı','X',()=>useTool('x'));
v4cmd(['Yol','Yola çevir (şekli düğümlere aç)',['Ctrl+Shift+O'],cmdToPath]);
v4cmd(['Yol','Düğümleri düzenle',[],()=>{const e=cur();if(e&&e.shape=='draw'&&e.nd)neEnter(e.id);else toast('Önce kalemle çizilmiş bir yol seç')}]);
v4cmd(['Yol','Yolu kapat / aç',[],()=>{const e=cur();if(!e||!e.nd)return toast('Önce kalemle çizilmiş bir yol seç');const nd=toPageNodes(e);setGeom(e,nd,!e.cl);if(e.cl&&!e.fon&&!sw0(e))e.sw2=.5;render();hist();ed()}]);
[['u','Birleştir (birleşim)'],['s','Çıkar (öndekini arkadakinden kes)'],['i','Kesiştir'],['x','Dışla']].forEach(([o,n])=>v4cmd(['Yol',n,[],()=>pathfinder(o)]));
const pe=window.v4extra,pc=window.v4cb;
window.v4extra=o=>(pe?pe(o):'')+(o.type=='r'&&o.shape=='draw'?`<input class="cbc" type="color" data-v8e="fl" value="${o.fl||o.col||'#000000'}" title="Dolgu rengi" aria-label="Dolgu rengi">`+(o.nd?`<button class="cbb wide" data-cbg="ne" title="Düğümleri düzenle (A)">Düğümler</button><button class="cbb wide" data-cbg="clp" title="Yolu kapat / aç">${o.cl?'Aç':'Kapat'}</button>`:''):o.type=='r'?`<button class="cbb wide" data-cbg="topath" title="Düğümlere aç (Ctrl+Shift+O)">Yola çevir</button>`:'');
window.v4multi=L=>L.filter(e=>e.type=='r').length>=2?`<button class="cbb wide" data-cbg="pfu" title="Birleştir">Birleştir</button><button class="cbb wide" data-cbg="pfs" title="Öndekini arkadakinden çıkar">Çıkar</button><button class="cbb wide" data-cbg="pfi" title="Kesişimi al">Kesiştir</button><button class="cbb wide" data-cbg="pfx" title="Dışla">Dışla</button>`:'';
window.v4cb=(g,t)=>{if(g=='ne'){const e=cur();if(e)neEnter(e.id);return true}if(g=='clp'){const e=cur();if(e&&e.nd){const nd=toPageNodes(e);setGeom(e,nd,!e.cl);if(e.cl&&!e.fon&&!sw0(e))e.sw2=.5;render();hist();ed();stBar()}return true}
 if(g=='topath'){cmdToPath();stBar();return true}if(g=='pfu'||g=='pfs'||g=='pfi'||g=='pfx'){pathfinder(g[2]);stBar();return true}return pc?pc(g,t):false};

/* araç çubuğu: yeni araçlar için */
const chip=(a,on,txt)=>`<button class="chip${on?' on':''}" ${a}>${txt}</button>`;
function barFor(t){
 if(t=='n')return `<span class="cbl">Kalem</span><input class="cbc" type="color" data-v8="pen.col" value="${PEN.col}" title="Çizgi rengi" aria-label="Çizgi rengi"><label class="cbr"><span>Kalınlık</span><input type="range" min="0" max="6" step=".05" value="${PEN.w}" data-v8="pen.w" aria-label="Çizgi kalınlığı"></label><label class="cbk"><input type="checkbox" data-v8="pen.fon" ${PEN.fon?'checked':''}> Dolgu (kapalı yol)</label><input class="cbc" type="color" data-v8="pen.fl" value="${PEN.fl}" title="Dolgu rengi" aria-label="Dolgu rengi"><span class="cbh">Tıkla: köşe · sürükle: eğri · ilk noktaya tıkla: kapat · Enter/çift tık: bitir · Shift: 45° · Alt: tutamacı kır · Backspace: son noktayı sil</span>`;
 if(t=='a')return `<span class="cbl">Düğüm seçimi</span><span class="cbh">Yola tıkla → düğümler görünür · düğüm/tutamaç sürükle · segmente tıkla: düğüm ekle · Alt+düğüm: köşe↔yumuşak · Delete: düğümü sil · Enter: bitir</span>`;
 if(t=='u')return `<span class="cbl">Şekil</span><select class="cbs1" data-v8s="1" aria-label="Şekil türü">${SHAPES.map(s=>`<option value="${s[0]}"${SH.t==s[0]?' selected':''}>${s[1]}</option>`).join('')}</select><input class="cbc" type="color" data-v8="sh.fl" value="${SH.fl}" title="Dolgu rengi" aria-label="Dolgu rengi"><input class="cbc" type="color" data-v8="sh.col" value="${SH.col}" title="Çizgi rengi" aria-label="Çizgi rengi"><label class="cbr"><span>Çizgi</span><input type="range" min="0" max="3" step=".05" value="${SH.w}" data-v8="sh.w" aria-label="Çizgi kalınlığı"></label><label class="cbr"><span>Uç sayısı</span><input type="range" min="3" max="16" step="1" value="${SH.n}" data-v8="sh.n" aria-label="Uç sayısı"></label><label class="cbr"><span>Yuvarlama</span><input type="range" min="0" max=".4" step=".01" value="${SH.rd}" data-v8="sh.rd" aria-label="Köşe yuvarlama"></label><label class="cbr"><span>İç oran</span><input type="range" min=".15" max=".85" step=".01" value="${SH.ir}" data-v8="sh.ir" aria-label="Yıldız iç oranı"></label><span class="cbh">Sürükle: boyutla çiz · Shift: kare · Alt: merkezden · tıkla: varsayılan boyut</span>`;
 if(t=='o')return `<span class="cbl">Ölçü</span><span class="cbh">Sürükle: mesafe + açı (mm) · bir öğeye tıkla: boyutu · Shift: 15° adım · Esc: temizle</span>`;
 if(t=='x')return `<span class="cbl">Silgi</span><span class="cbh">Fırça çizgilerinin ve yolların üzerinden sürükle, dokunduğun çizim silinir · Ctrl+Z geri alır</span>`;
 return''}
window.v4barFor=t=>t&&t.length==1&&'nauox'.includes(t)?barFor(t):null;
function setV8(path,v){const[g,k]=path.split('.'),O=g=='pen'?PEN:SH;O[k]=v;if(g=='pen'&&pen)penDraw()}
const cbar=$('cbar');
cbar.addEventListener('input',ev=>{const t=ev.target;if(t.dataset.v8){setV8(t.dataset.v8,t.type=='checkbox'?t.checked:t.type=='range'?+t.value:t.value);return}
 if(t.dataset.v8e){selEls().forEach(o=>{if(o.type=='r'&&o.shape=='draw'){o[t.dataset.v8e]=t.value;o.fon=true}});render()}});
cbar.addEventListener('change',ev=>{const t=ev.target;if(t.dataset.v8e){hist();ed()}});
cbar.addEventListener('change',ev=>{const t=ev.target;if(t.dataset.v8s){SH.t=t.value}});

/* kısayol rehberi için yardımcı: dışarıya aç */
window.v4path={toPath,pathfinder,setGeom,newPath,neEnter,toPageNodes,SHAPES,shapeEl,PEN,SH};
})();
