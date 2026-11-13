/* ================= STÜDYO 4: yay yazı, metin sarma, fırça, paylaşılabilir önizleme ================= */
(function(){
const K=10,E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fx=n=>+(+n).toFixed(2);

/* ---------- yay (kavis) üzerinde yazı ---------- */
function bendG(e,w,h){const fs=e.fs,b=Math.max(-100,Math.min(100,+e.bend||0)),s=Math.max(.0001,Math.min(Math.abs(b)/100*w/2,w/2*.999)),R=(w*w/4+s*s)/(2*s),th=Math.asin(Math.min(1,(w/2)/R)),arch=b>0;
 return{s,R,th,arch,yc:arch?h/2+s/2+.3*fs:h/2-s/2+.3*fs,L:2*R*th}}
const bendText=e=>tcf(e,String(tk(e.txt)).replace(/\s*\n+\s*/g,' ').trim());
function arcHTML(e){const g0=geo(e,100),w=g0[2],h=g0[3],g=bendG(e,w,h),t=bendText(e),al=e.al,off=al=='left'?'0%':al=='right'?'100%':'50%',an=al=='left'?'start':al=='right'?'end':'middle',id='bp'+e.id,
 d=`M0 ${fx(g.yc)}A${fx(g.R)} ${fx(g.R)} 0 0 ${g.arch?1:0} ${fx(w)} ${fx(g.yc)}`;
 return `<svg viewBox="0 0 ${fx(w)} ${fx(h)}" style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none"><path id="${id}" d="${d}" fill="none"/><text font-size="${e.fs}" letter-spacing="${(e.ls||0)*e.fs}" word-spacing="${(e.ws||0)*e.fs}" fill="${e.col}"${e.sw?` stroke="${e.sc}" stroke-width="${e.sw}" stroke-linejoin="round" paint-order="stroke"`:''}><textPath href="#${id}" startOffset="${off}" text-anchor="${an}">${E(t)}</textPath></text></svg>`}
function arcDraw(x,e,X,Y,w,h,u){const g=bendG(e,w/u,h/u),t=bendText(e);if(!t)return;const fs=e.fs*u,ls=(e.ls||0)*fs,C=Array.from(t),Rp=g.R*u,Lp=g.L*u;
 x.textBaseline='alphabetic';x.font=fnt(e,fs);if('letterSpacing'in x)x.letterSpacing=ls+'px';if('wordSpacing'in x)x.wordSpacing=(e.ws||0)*fs+'px';
 const pos=[0];for(let i=1;i<=C.length;i++)pos.push(x.measureText(C.slice(0,i).join('')).width);
 const Wt=pos[C.length]-ls,s0=e.al=='left'?0:e.al=='right'?Lp-Wt:(Lp-Wt)/2,cx=X+w/2,cyC=Y+(g.arch?g.yc-g.s+g.R:g.yc+g.s-g.R)*u;
 if('letterSpacing'in x)x.letterSpacing='0px';x.textAlign='center';
 C.forEach((ch,i)=>{const d=s0+pos[i]+(pos[i+1]-pos[i]-ls)/2;if(d<0||d>Lp||ch==' ')return;const ph=-g.th+d/Rp,px=cx+Rp*Math.sin(ph),py=g.arch?cyC-Rp*Math.cos(ph):cyC+Rp*Math.cos(ph);
  x.save();x.translate(px,py);x.rotate(g.arch?ph:-ph);x.fillText(ch,0,0);if(e.sw)x.strokeText(ch,0,0);x.restore()})}

/* ---------- nesnelerin etrafında metin sarma ---------- */
function obstacles(e){const g=geo(e,100),ox=g[0]+(e.dx||0),oy=g[1]+(e.dy||0),m=e.wm==null?1:+e.wm,O=[];
 S.els.forEach(o=>{if(o===e||!o.on||(o.txt!==undefined&&!o.dcp)||o.shape=='draw'||zOf(o)<=zOf(e))return;const q=geo(o,100);let x0=q[0]+(o.dx||0),y0=q[1]+(o.dy||0),x1=x0+q[2],y1=y0+q[3];
  if(o.rot){const cx=(x0+x1)/2,cy=(y0+y1)/2,a=o.rot*Math.PI/180,c=Math.cos(a),s=Math.sin(a),P=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(([px,py])=>[cx+(px-cx)*c-(py-cy)*s,cy+(px-cx)*s+(py-cy)*c]);x0=Math.min(...P.map(p=>p[0]));x1=Math.max(...P.map(p=>p[0]));y0=Math.min(...P.map(p=>p[1]));y1=Math.max(...P.map(p=>p[1]))}
  O.push({x0:x0-ox-m,y0:y0-oy-m,x1:x1-ox+m,y1:y1-oy+m,c:o.type=='r'&&o.shape=='circle'})});
 return O}
function layout(e,w,h){SC.font=fnt(e,e.fs*K);SC.textBaseline='top';const fs=e.fs;
 if('letterSpacing'in SC)SC.letterSpacing=(e.ls||0)*fs*K+'px';if('wordSpacing'in SC)SC.wordSpacing=(e.ws||0)*fs*K+'px';
 const mw=t=>SC.measureText(t).width/K,lh=e.lh*fs,O=obstacles(e),paras=tcf(e,String(tk(e.txt))).split('\n'),lines=[];let y=0,guard=0;
 const free=(y0,y1)=>{let segs=[[0,w]];O.forEach(o=>{if(y1<=o.y0||y0>=o.y1)return;let a=o.x0,b=o.x1;
   if(o.c){const cy=(o.y0+o.y1)/2,ry=Math.max(.001,(o.y1-o.y0)/2),cx=(o.x0+o.x1)/2,rx=(o.x1-o.x0)/2,yy=Math.max(y0,Math.min(cy,y1)),t=Math.min(1,Math.abs(yy-cy)/ry),hf=rx*Math.sqrt(1-t*t);a=cx-hf;b=cx+hf}
   const N=[];segs.forEach(([s0,s1])=>{if(b<=s0||a>=s1){N.push([s0,s1]);return}if(a>s0)N.push([s0,a]);if(b<s1)N.push([b,s1])});segs=N});
  segs=segs.filter(s=>s[1]-s[0]>.01).sort((p,q)=>(q[1]-q[0])-(p[1]-p[0]));return segs[0]||null};
 for(const p of paras){if(!p.trim()){y+=lh;continue}const words=p.split(/ +/).filter((v,i)=>v!==''||i==0);let i=0,first=true;
  while(i<words.length&&guard++<600){const sg=free(y,y+lh);if(!sg||sg[1]-sg[0]<fs*3){y+=lh;continue}
   const ind=first?(e.ind||0)*fs:0,av=Math.max(fs,sg[1]-sg[0]-ind);let ln=words[i],j=i+1;
   while(j<words.length&&mw(ln+' '+words[j])<=av){ln+=' '+words[j];j++}
   const last=j>=words.length,tw=mw(ln);let x0=sg[0]+ind,jx=0;
   if(e.al=='center')x0+=(av-tw)/2;else if(e.al=='right')x0+=av-tw;else if(e.al=='justify'&&!last&&ln.includes(' '))jx=Math.max(0,(av-tw)/(ln.split(' ').length-1));
   lines.push({t:ln,x:x0,y,j:jx});y+=lh;i=j;first=false}}
 return{lines,bh:y,lh}}
function wrapHTML(e){const g=geo(e,100),L=layout(e,g[2],g[3]),ws=(e.ws||0)*e.fs;
 return `<div style="position:relative;width:100%;height:100%;text-indent:0">`+L.lines.map(l=>`<span style="position:absolute;left:${fx(l.x)}cqw;top:${fx(l.y)}cqw;white-space:pre${l.j?`;word-spacing:${fx(ws+l.j)}cqw`:''}">${E(l.t)}</span>`).join('')+`</div>`}
function wrapDraw(x,e,X,Y,w,h,u){const L=layout(e,w/u,h/u),fs=e.fs*u,ws=(e.ws||0)*e.fs;x.font=fnt(e,fs);x.textBaseline='top';x.textAlign='left';if('letterSpacing'in x)x.letterSpacing=(e.ls||0)*fs+'px';
 L.lines.forEach(l=>{if('wordSpacing'in x)x.wordSpacing=(ws+l.j)*u+'px';const tx=X+l.x*u,ty=Y+l.y*u+(L.lh*u-fs)/2;x.fillText(l.t,tx,ty);if(e.sw)x.strokeText(l.t,tx,ty)})}

window.v4bendG=bendG;window.v4layout=layout;
window.v4flat=e=>e.txt!==undefined&&((+e.bend&&!e.vert)||(e.wr&&!e.rot&&!e.vert&&!e.bend));
window.v4txt=e=>+e.bend?arcHTML(e):wrapHTML(e);
window.v4tdraw=(x,e,X,Y,w,h,u,fill,sh)=>{x.fillStyle=fill;x.strokeStyle=e.sc;x.lineWidth=(e.sw||0)*u;x.lineJoin='round';sh(e);if(+e.bend)arcDraw(x,e,X,Y,w,h,u);else wrapDraw(x,e,X,Y,w,h,u)};
window.v4over=e=>{if(+e.bend)return false;const g=geo(e,100);return layout(e,g[2],g[3]).bh>g[3]*1.04+.3};

/* ---------- fırça / karalama ---------- */
const BR={col:'#111111',w:.8};try{const s=JSON.parse(localStorage.getItem('ed_br')||'null');if(s){BR.col=s.col||BR.col;BR.w=+s.w||BR.w}}catch(x){}
const brSave=()=>{try{localStorage.setItem('ed_br',JSON.stringify(BR))}catch(x){}};
window.v4dpath=e=>{const P=e.pts||[];if(!P.length)return'';if(P.length==1)return`M${fx(P[0][0])} ${fx(P[0][1])}l.01 0`;let d=`M${fx(P[0][0])} ${fx(P[0][1])}`;if(P.length==2)return d+`L${fx(P[1][0])} ${fx(P[1][1])}`;
 for(let i=1;i<P.length-1;i++)d+=`Q${fx(P[i][0])} ${fx(P[i][1])} ${fx((P[i][0]+P[i+1][0])/2)} ${fx((P[i][1]+P[i+1][1])/2)}`;const l=P[P.length-1];return d+`L${fx(l[0])} ${fx(l[1])}`};
window.v4drawHTML=(e,p,sl)=>{const v=e.vb||[1,1];return `<div class="e${sl}" data-id="${e.id}" style="${p}pointer-events:none"><svg viewBox="0 0 ${fx(v[0])} ${fx(v[1])}" preserveAspectRatio="none" style="width:100%;height:100%;display:block;overflow:visible;pointer-events:none"><path d="${v4dpath(e)}" fill="none" stroke="${e.col}" stroke-width="${e.sw2||1}" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:stroke"/></svg></div>`};
window.v4drawCv=(x,e,X,Y,w,h)=>{const v=e.vb||[1,1];x.translate(X,Y);x.scale(w/v[0],h/v[1]);x.strokeStyle=e.col;x.lineWidth=e.sw2||1;x.lineCap='round';x.lineJoin='round';x.stroke(new Path2D(v4dpath(e)))};
window.v4bar=()=>`<span class="cbl">Renk</span><input class="cbc" type="color" data-br="col" value="${BR.col}" aria-label="Fırça rengi"><label class="cbr"><span>Kalınlık</span><input type="range" min=".1" max="5" step=".05" value="${BR.w}" data-br="w" aria-label="Fırça kalınlığı"></label><span class="cbh">Sürükleyerek çiz · Shift: düz çizgi · her çizgi ayrı bir öğedir, Ctrl+Z geri alır</span>`;
document.addEventListener('input',ev=>{const t=ev.target;if(!t.dataset||!t.dataset.br)return;if(t.dataset.br=='col')BR.col=t.value;else BR.w=+t.value;brSave()});
const CVW=$('cvw');let st=null;
const pt=ev=>{const r=$('cv').getBoundingClientRect();return[(ev.clientX-r.left)/r.width*100,(ev.clientY-r.top)/r.width*100]};
function brLive(){let s=$('brs');if(!s){s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.id='brs';s.setAttribute('viewBox',`0 0 100 ${100/S.fmt}`);s.setAttribute('preserveAspectRatio','none');s.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:9999';const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('fill','none');p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');s.appendChild(p);$('cv').appendChild(s)}
 const p=s.firstChild;p.setAttribute('stroke',BR.col);p.setAttribute('stroke-width',BR.w);p.setAttribute('d',v4dpath({pts:st.P}))}
CVW.addEventListener('pointerdown',ev=>{if(!window.SDK||SDK.tool!='p'||ev.button>0||SDK.space||st||!PROJ)return;if(!ev.target.closest||!ev.target.closest('.cvp'))return;
 ev.preventDefault();ev.stopImmediatePropagation();st={id:ev.pointerId,P:[pt(ev)]};try{CVW.setPointerCapture(ev.pointerId)}catch(x){}brLive()},true);
CVW.addEventListener('pointermove',ev=>{if(!st||ev.pointerId!=st.id)return;const p=pt(ev),l=st.P[st.P.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])<.12)return;st.P.push(p);brLive()});
function brEnd(ev,cancel){if(!st||ev.pointerId!=st.id)return;const s=st;st=null;try{CVW.releasePointerCapture(ev.pointerId)}catch(x){}const lv=$('brs');if(lv)lv.remove();if(cancel)return;
 let P=s.P;if(ev.shiftKey&&P.length>2)P=[P[0],P[P.length-1]];
 const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),pad=BR.w/2+.2,x0=Math.min(...xs)-pad,y0=Math.min(...ys)-pad,W=Math.max(.5,Math.max(...xs)-Math.min(...xs)+2*pad),Hh=Math.max(.5,Math.max(...ys)-Math.min(...ys)+2*pad);
 const e=mk('r');e.shape='draw';e.col=BR.col;e.sw2=BR.w;e.fr=[fx(x0),fx(y0),fx(W),fx(Hh)];e.vb=[fx(W),fx(Hh)];e.pts=P.map(p=>[fx(p[0]-x0),fx(p[1]-y0)]);e.pin=true;e.nm='Çizim';e.z=topZ()+10;
 S.els.push(e);S.sel=e.id;MSEL.clear();render();list();hist()}
CVW.addEventListener('pointerup',ev=>brEnd(ev,false));CVW.addEventListener('pointercancel',ev=>brEnd(ev,true));

/* ---------- paylaşılabilir önizleme (tek HTML dosyası) ---------- */
function viewer(name,imgs,ratio,links){const T=E(name);
 return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${T}</title><style>
*{box-sizing:border-box}html,body{height:100%;margin:0}body{background:#17171c;color:#eee;font:14px system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden}
#st{flex:1;min-height:0;display:grid;place-items:center;padding:16px;position:relative}#pg{position:relative;line-height:0}#st img{display:block;max-width:calc(100vw - 32px);max-height:calc(100vh - 110px);box-shadow:0 10px 40px rgba(0,0,0,.55);background:#fff;user-select:none;-webkit-user-drag:none}body.cm #st img{cursor:crosshair}
.pin{position:absolute;transform:translate(-50%,-50%);width:26px;height:26px;border-radius:50% 50% 50% 4px;background:#ffb020;color:#111;font:700 12px/26px system-ui;text-align:center;padding:0;border:2px solid #fff}
.nb{position:absolute;z-index:5;width:220px;background:#222;border:1px solid #555;border-radius:10px;padding:8px;line-height:1.3}.nb textarea{width:100%;background:#111;color:#eee;border:1px solid #444;border-radius:6px;padding:6px;font:inherit;resize:vertical}.nb div{display:flex;gap:6px;margin-top:6px}
#nlp{position:fixed;right:12px;top:12px;bottom:70px;width:280px;background:#101014f2;border:1px solid #444;border-radius:12px;padding:12px;overflow:auto;display:none;z-index:6}#nlp.on{display:block}.ni{padding:8px 0;border-bottom:1px solid #333;cursor:pointer;font-size:13px}.ni u{display:block;opacity:.6;font-size:11px;text-decoration:none}.nr{display:flex;gap:6px;margin-top:10px}
#bar{display:flex;align-items:center;justify-content:center;gap:10px;padding:10px;background:#101014}
button{background:#2a2a33;color:#eee;border:0;border-radius:8px;padding:8px 14px;font:inherit;cursor:pointer}button:hover{background:#3a3a46}button:disabled{opacity:.35;cursor:default}
#nm{opacity:.6;max-width:30vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#ct{min-width:70px;text-align:center}
#gd{position:fixed;inset:0;background:#17171cf2;overflow:auto;padding:20px;display:none;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;align-content:start}#gd.on{display:grid}
#gd img{width:100%;cursor:pointer;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.5);border:2px solid transparent}#gd img.on{border-color:#7c5cff}
#lks{position:absolute;inset:0}#lks a{position:absolute;display:block;cursor:pointer;border-radius:4px}#lks a:hover{outline:2px solid #7c5cff;background:#7c5cff22}body.cm #lks{pointer-events:none}#bk2{display:none}#bk2.on{display:inline-block}
</style></head><body><div id="st"><div id="pg"><img id="im" alt=""><div id="lks"></div><div id="pins"></div></div></div><div id="bar"><span id="nm">${T}</span><button id="pv" aria-label="Önceki">◀</button><span id="ct"></span><button id="nx" aria-label="Sonraki">▶</button><button id="bk2" title="Bağlantıdan geri dön (Backspace)">↩ Geri</button><button id="cm" title="Not ekle (N)">💬 Not</button><button id="nl" title="Notları göster">☰</button><button id="gb" title="Tüm sayfalar (G)">▦</button><button id="fb" title="Tam ekran (F)">⛶</button></div><div id="gd"></div>
<script>
var P=${JSON.stringify(imgs)},LK=${JSON.stringify(links||[]).replace(/</g,'\\u003c')},HS=[],i=0,im=document.getElementById('im'),ct=document.getElementById('ct'),gd=document.getElementById('gd');
function lk(){var b=document.getElementById('lks');b.innerHTML='';(LK[i]||[]).forEach(function(q){var a=document.createElement('a');a.style.cssText='left:'+q.x+'%;top:'+q.y+'%;width:'+q.w+'%;height:'+q.h+'%';a.title=q.t=='p'?'Sayfa '+q.n+'\\'e git':q.u;a.onclick=function(ev){ev.stopPropagation();if(q.t=='p'){HS.push(i);go(q.n-1);bkb()}else if(/^(https?:\\/\\/|mailto:)/i.test(q.u))window.open(q.u,'_blank','noopener')};b.appendChild(a)})}
function bkb(){document.getElementById('bk2').className=HS.length?'on':''}
function go(n){i=Math.max(0,Math.min(P.length-1,n));im.src=P[i];lk();ct.textContent=(i+1)+' / '+P.length;document.getElementById('pv').disabled=i==0;document.getElementById('nx').disabled=i==P.length-1;try{history.replaceState(null,'','#'+(i+1))}catch(e){}[].forEach.call(gd.children,function(c,k){c.className=k==i?'on':''})}
P.forEach(function(s,k){var t=new Image();t.src=s;t.onclick=function(){gd.className='';go(k)};gd.appendChild(t)});
document.getElementById('pv').onclick=function(){go(i-1)};document.getElementById('nx').onclick=function(){go(i+1)};document.getElementById('bk2').onclick=function(){if(HS.length){go(HS.pop());bkb()}};
document.getElementById('gb').onclick=function(){gd.classList.toggle('on')};
function fs(){var d=document.documentElement;if(document.fullscreenElement)document.exitFullscreen();else if(d.requestFullscreen)d.requestFullscreen()}document.getElementById('fb').onclick=fs;
document.addEventListener('keydown',function(e){if(e.target.tagName=='TEXTAREA')return;var k=e.key;if(k=='ArrowRight'||k=='PageDown'||k==' ')go(i+1);else if(k=='ArrowLeft'||k=='PageUp')go(i-1);else if(k=='Home')go(0);else if(k=='End')go(P.length-1);else if(k=='g'||k=='G')gd.classList.toggle('on');else if(k=='f'||k=='F')fs();else if(k=='n'||k=='N')tcm();else if(k=='Escape')gd.classList.remove('on');else if(k=='Backspace'&&HS.length){go(HS.pop());bkb()}});
var sx=null;document.getElementById('st').addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});document.getElementById('st').addEventListener('touchend',function(e){if(sx==null)return;var d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>40)go(i+(d<0?1:-1))});
im.onclick=function(e){if(cm){var r=im.getBoundingClientRect();edit(-1,(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);return}go(i+(e.clientX>innerWidth/2?1:-1))};

var KEY='edn:'+document.title+':'+P.length,N=[],cm=false,box=null,pins=document.getElementById('pins'),nlp=document.createElement('div');nlp.id='nlp';document.body.appendChild(nlp);
try{N=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){}
function sv(){try{localStorage.setItem(KEY,JSON.stringify(N))}catch(e){}}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function closeBox(){if(box){box.remove();box=null}}
function drawPins(){pins.innerHTML='';N.forEach(function(n,k){if(n.p!=i)return;var d=document.createElement('button');d.className='pin';d.textContent=k+1;d.style.left=n.x+'%';d.style.top=n.y+'%';d.title=n.t;d.onclick=function(e){e.stopPropagation();edit(k)};pins.appendChild(d)})}
function edit(k,x,y){closeBox();var n=k>=0?N[k]:{p:i,x:x,y:y,t:''};box=document.createElement('div');box.className='nb';box.style.left=Math.min(n.x,68)+'%';box.style.top=Math.min(n.y+3,78)+'%';
box.innerHTML='<textarea rows="3" placeholder="Notun..."></textarea><div><button class="s">Kaydet</button><button class="d">Sil</button></div>';var ta=box.querySelector('textarea');ta.value=n.t;box.onclick=function(e){e.stopPropagation()};
box.querySelector('.s').onclick=function(){var v=ta.value.trim();if(k<0){if(v)N.push({p:i,x:n.x,y:n.y,t:v})}else{if(v)N[k].t=v;else N.splice(k,1)}sv();closeBox();drawPins();lst()};
box.querySelector('.d').onclick=function(){if(k>=0)N.splice(k,1);sv();closeBox();drawPins();lst()};document.getElementById('pg').appendChild(box);ta.focus()}
function txt(){return N.map(function(n,k){return (k+1)+') Sayfa '+(n.p+1)+' (%'+Math.round(n.x)+', %'+Math.round(n.y)+'): '+n.t}).join('\\n')}
function lst(){nlp.innerHTML='<b>Notlar ('+N.length+')</b>'+(N.length?'':'<p>Not yok. Not düğmesine bas, sonra sayfaya tıkla.</p>')+N.map(function(n,k){return '<div class="ni" data-k="'+k+'"><u>Sayfa '+(n.p+1)+' · '+(k+1)+'</u>'+esc(n.t)+'</div>'}).join('')+'<div class="nr"><button id="nc">Kopyala</button><button id="nd">İndir</button></div>';
[].forEach.call(nlp.querySelectorAll('.ni'),function(d){d.onclick=function(){go(N[+d.dataset.k].p)}});
document.getElementById('nc').onclick=function(){var t=txt();if(navigator.clipboard)navigator.clipboard.writeText(t).catch(function(){});else{var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove()}this.textContent='Kopyalandı'};
document.getElementById('nd').onclick=function(){var b=new Blob([txt()],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='notlar.txt';a.click()}}
function tcm(){cm=!cm;document.body.classList.toggle('cm',cm);document.getElementById('cm').style.background=cm?'#ffb020':'';document.getElementById('cm').style.color=cm?'#111':'';closeBox()}
document.getElementById('cm').onclick=tcm;document.getElementById('nl').onclick=function(){nlp.classList.toggle('on');lst()};
var _go=go;go=function(n){_go(n);closeBox();drawPins()};lst();
go(Math.max(0,(parseInt(location.hash.slice(1))||1)-1));
<\/script></body></html>`}
async function share(){if(!PROJ)return;toast('Önizleme hazırlanıyor…');const imgs=[],lks=[];
 await eachPage(async()=>{await loadF();imgs.push(draw(1400).toDataURL('image/jpeg',.86));lks.push(window.v4links?v4links():[])});
 const nm=window.v4slug(PROJ.name||'proje')||'proje';
 await save(nm+'-onizleme.html',new Blob([viewer(PROJ.name||'Proje',imgs,S.fmt,lks)],{type:'text/html'}));toast('Önizleme dosyası indirildi ✓ · tek dosya, her yerde açılır')}
window.v4share=share;

/* ---------- komutlar, menü, çubuk ---------- */
v4cmd(['Dosya','Paylaşılabilir önizleme (HTML)',['Ctrl+Alt+H'],share]);
v4cmd(['Metin','Yazıyı yaya oturt / düzelt',[],()=>{const o=cur();if(!o||o.txt===undefined)return toast('Önce bir metin seç');if(+o.bend)o.bend=0;else{o.bend=40;o.al='center'}render();hist();ed()}]);
v4cmd(['Metin','Nesne etrafında sar (aç/kapat)',[],()=>{const o=cur();if(!o||o.txt===undefined)return toast('Önce bir metin seç');o.wr=!o.wr;render();hist();ed()}]);
const mm=$('mmenu');if(mm){const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML='<span>Paylaşılabilir önizleme (HTML)</span><kbd>Ctrl+Alt+H</kbd>';w.onclick=()=>{mm.hidden=true;share()};mm.appendChild(w)}
const pe=window.v4extra,pc=window.v4cb;
window.v4extra=o=>(pe?pe(o):'')+(o.txt!==undefined?`<button class="cbb wide${+o.bend?' on':''}" data-cbg="bend" title="Yazıyı yay üzerine yerleştir (ayar: Tüm ayarlar › Mizanpaj)">Yay</button><button class="cbb wide${o.wr?' on':''}" data-cbg="wrap" title="Üstteki nesnelerin etrafında sar">Sar</button>`:'');
window.v4cb=(g,t)=>{if(g=='bend'){selEls().forEach(o=>{if(o.txt!==undefined){if(+o.bend)o.bend=0;else{o.bend=40;o.al='center'}}});render();hist();ed();return true}if(g=='wrap'){selEls().forEach(o=>{if(o.txt!==undefined)o.wr=!o.wr});render();hist();ed();return true}return pc?pc(g,t):false};
})();

/* ================= STÜDYO 5: aynı boyut, görsel kırpma, metin zincirleme ================= */
(function(){
const K=10,cl2=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------- aynı genişlik / yükseklik / boyut ---------- */
function sameSize(m){const els=selEls().filter(e=>!e.lock&&e.on);if(els.length<2)return toast('En az 2 öğe seç (Shift+tıkla). Ölçü, en son seçtiğin öğeden alınır.');render();
 const bx=v3boxes(els.map(e=>e.id));if(bx.length<2)return;const ref=bx.find(b=>b.id==S.sel)||bx[0];
 bx.forEach(b=>{if(b.id==ref.id)return;const e=byId(b.id),w=m=='h'?b.w:ref.w,h=m=='w'?b.h:ref.h;e.fr=[+(b.x-(e.dx||0)).toFixed(2),+(b.y-(e.dy||0)).toFixed(2),+w.toFixed(2),+h.toFixed(2)]});
 render();hist();ed()}

/* ---------- görsel kırpma: çift tıkla, sürükle, tekerlekle yakınlaştır ---------- */
let CR=null;const cvEl=$('cv'),CVW=$('cvw');
function cropOn(id){const e=byId(id);if(!e||e.type!='img'||!e.src||e.lock)return;if(S.sel!=id)pick(id);CR={id};document.body.classList.add('cropping');toast('Kırpma: sürükle = kaydır · tekerlek = yakınlaştır · Esc = bitir')}
function cropOff(){if(!CR)return;CR=null;document.body.classList.remove('cropping');render();ed();hist()}
function cropApply(e){const n=cvEl.querySelector('.e[data-id="'+e.id+'"] img');if(n){n.style.objectPosition=e.fx+'% '+e.fy+'%';n.style.transformOrigin=e.fx+'% '+e.fy+'%';n.style.transform='scale('+(e.zm||1)+')'}}
let lt={id:0,t:0},pd=null;
cvEl.addEventListener('pointerdown',ev=>{if(ev.button||ev.shiftKey||ev.ctrlKey||ev.metaKey||(window.SDK&&SDK.tool!='v'))return;const n=ev.target.closest&&ev.target.closest('.e');
 if(CR){if(n&&+n.dataset.id==CR.id){const e=byId(CR.id);if(!e)return;ev.preventDefault();ev.stopImmediatePropagation();const r=n.getBoundingClientRect(),I=e.im,z=e.zm||1;let dw=r.width,dh=r.height;if(I&&I.naturalWidth&&e.fit!='fill'){const q=(e.fit=='cover'?Math.max:Math.min)(r.width/I.naturalWidth,r.height/I.naturalHeight);dw=I.naturalWidth*q;dh=I.naturalHeight*q}
   pd={x:ev.clientX,y:ev.clientY,fx:e.fx,fy:e.fy,rx:r.width-dw*z,ry:r.height-dh*z,id:ev.pointerId};try{cvEl.setPointerCapture(ev.pointerId)}catch(x){}}else cropOff();return}
 if(!n||n.classList.contains('tx')||n.classList.contains('ph'))return;const id=+n.dataset.id,now=Date.now();
 if(lt.id==id&&now-lt.t<350){lt={id:0,t:0};const e=byId(id);if(e&&e.type=='img'&&e.src){ev.preventDefault();ev.stopImmediatePropagation();setTimeout(()=>cropOn(id),0)}return}lt={id,t:now}},true);
cvEl.addEventListener('pointermove',ev=>{if(!pd||ev.pointerId!=pd.id||!CR)return;const e=byId(CR.id);if(!e)return;
 if(Math.abs(pd.rx)>.5)e.fx=+cl2(pd.fx+(ev.clientX-pd.x)/pd.rx*100,0,100).toFixed(1);if(Math.abs(pd.ry)>.5)e.fy=+cl2(pd.fy+(ev.clientY-pd.y)/pd.ry*100,0,100).toFixed(1);cropApply(e)});
const pe=ev=>{if(pd&&ev.pointerId==pd.id){pd=null;try{cvEl.releasePointerCapture(ev.pointerId)}catch(x){}const e=byId(CR&&CR.id);if(e){hist();ed()}}};cvEl.addEventListener('pointerup',pe);cvEl.addEventListener('pointercancel',pe);
CVW.addEventListener('wheel',ev=>{if(!CR)return;const e=byId(CR.id);if(!e)return;ev.preventDefault();ev.stopImmediatePropagation();e.zm=+cl2((e.zm||1)*(1-cl2(ev.deltaY,-40,40)*.004),1,6).toFixed(3);cropApply(e);clearTimeout(cropOn.t);cropOn.t=setTimeout(()=>{hist();ed()},300)},{capture:true,passive:false});
window.addEventListener('keydown',ev=>{if(CR&&(ev.key=='Escape'||ev.key=='Enter')){ev.preventDefault();ev.stopImmediatePropagation();cropOff()}},true);
window.addEventListener('keyup',ev=>{if(CR&&(ev.key=='Escape'||ev.key=='Enter'))cropOff()},true);

/* ---------- metin zincirleme ---------- */
let sig='',NOSYNC=0;
function chainFrames(){const T={},live=(typeof PGOV=='number'&&PGOV!=null)?PGOV:PROJ.cur;
 PROJ.pages.forEach((p,i)=>{const els=i==live?S.els:((p.s&&p.s.els)||[]);els.forEach(e=>{if(e.tg&&e.txt!==undefined)(T[e.tg]=T[e.tg]||[]).push({e,pg:i,g:geo(e,100)})})});
 Object.values(T).forEach(a=>a.sort((p,q)=>p.pg-q.pg||p.g[1]-q.g[1]||p.g[0]-q.g[0]));return T}
function flowFrame(story,o,e,g){const fs=e.fs,lh=e.lh*fs,w=g[2],cap=Math.max(1,Math.floor(g[3]/lh+1e-6));
 SC.font=fnt(e,fs*K);SC.textBaseline='top';if('letterSpacing'in SC)SC.letterSpacing=(e.ls||0)*fs*K+'px';if('wordSpacing'in SC)SC.wordSpacing=(e.ws||0)*fs*K+'px';
 const mw=t=>SC.measureText(tcf(e,t)).width/K;let i=o;while(i<story.length&&story[i]==' ')i++;if(o>0&&story[i]=='\n')i++;
 const start=i;let lines=0,end=story.length;
 outer:while(i<=story.length){let j=story.indexOf('\n',i);if(j<0)j=story.length;const para=story.slice(i,j);
  if(!para.trim()){if(i>=story.length)break;if(lines>=cap){end=i;break}lines++;if(j>=story.length){end=story.length;break}i=j+1;continue}
  const re=/\S+/g,words=[];let m;while((m=re.exec(para)))words.push([m.index+i,m[0]]);let k=0;
  while(k<words.length){if(lines>=cap){end=words[k][0];break outer}let ln=words[k][1],n=k+1;while(n<words.length&&mw(ln+' '+words[n][1])<=w){ln+=' '+words[n][1];n++}lines++;k=n}
  if(j>=story.length){end=story.length;break}i=j+1;if(lines>=cap&&i<story.length){end=j;break}}
 return{dt:story.slice(start,end).replace(/\s+$/,''),end,over:end<story.length}}
function chainSync(){if(!PROJ||NOSYNC)return;let any=false;for(const p of PROJ.pages){const els=p===PROJ.pages[PROJ.cur]?S.els:((p.s&&p.s.els)||[]);if(els.some(e=>e.tg)){any=true;break}}if(!any){sig='';return}
 const T=chainFrames(),ks=Object.keys(T),fo=document.fonts?document.fonts.status+document.fonts.size:'';
 const s=fo+ks.map(k=>T[k].map(f=>[f.pg,f.e.id,f.g.map(v=>v.toFixed(2)).join(','),f.e.fs,f.e.ff,f.e.fw,f.e.it,f.e.lh,f.e.ls,f.e.ws,f.e.tc].join('|')).join(';')+'#'+T[k][0].e.txt).join('@@');
 if(s===sig)return;sig=s;const chg=new Set();
 ks.forEach(k=>{const F=T[k],story=String(F[0].e.txt||'');let o=0;F.forEach((f,ix)=>{const e=f.e;e.nf=true;e.cc=1;const r=flowFrame(story,o,e,f.g);if(e.dt!==r.dt){e.dt=r.dt;if(f.pg!=PROJ.cur)chg.add(f.pg)}o=r.end;e.ov=ix==F.length-1&&r.over;e.hd=ix==0})});
 if(chg.size){chg.forEach(i=>{PROJ.pages[i].thumb=''});clearTimeout(chainSync.t);chainSync.t=setTimeout(()=>{try{initThumbs()}catch(x){}},500)}}
function chainNext(){const e=cur();if(!e||e.txt===undefined)return toast('Önce bir metin kutusu seç');if(e.vert||+e.bend||e.wr)return toast('Yay, sarma ya da dikey metin zincire eklenemez');if(e.lock)return;
 if(!e.tg)e.tg='t'+Date.now().toString(36)+(Math.random()*1e3|0);e.nf=true;e.cc=1;sig='';chainSync();
 const n=JSON.parse(JSON.stringify(e)),pg=PROJ.cur;PROJ.pages[pg].s=pageSnap();
 if(pg==PROJ.pages.length-1)addPage('blank');else goPage(pg+1);
 n.id=++S.n;n.txt='';delete n.dt;n.ov=false;n.hd=false;n.nm=((e.nm||'Metin').replace(/ \(devam\)$/,''))+' (devam)';n.z=topZ()+10;S.els.push(n);S.sel=n.id;MSEL.clear();sig='';render();list();ed();hist();
 toast('Zincire yeni kutu eklendi · metin ilk kutudan buraya akar')}
function chainBreak(){const e=cur();if(!e||!e.tg)return toast('Seçili kutu bir zincirde değil');const tg=e.tg,T=chainFrames();(T[tg]||[]).forEach(f=>{f.e.txt=f.e.dt!=null?f.e.dt:f.e.txt;delete f.e.tg;delete f.e.dt;delete f.e.ov;delete f.e.hd});sig='';render();list();ed();hist();toast('Zincir çözüldü · her kutu kendi metnini korudu')}
window.v4chainHead=e=>{if(!e||!e.tg)return null;const T=chainFrames()[e.tg];return T&&T[0]?{pg:T[0].pg,id:T[0].e.id}:null};
{const _r=render;render=function(){chainSync();return _r.apply(this,arguments)}}
{const _mp=mapPages;mapPages=function(){NOSYNC++;try{return _mp.apply(this,arguments)}finally{NOSYNC--;sig=''}}}
{let D=0;const _ps=pageSnap;pageSnap=function(){const o=_ps.apply(this,arguments);if(D){D++;if(D==3)o.els.forEach(e=>{if(e.tg){e.txt=e.dt!=null?e.dt:e.txt;delete e.tg;delete e.dt;delete e.ov;delete e.hd}})}return o};
 const _ap=addPage;addPage=function(k){if(k=='dup')D=1;try{return _ap.apply(this,arguments)}finally{D=0;sig=''}}}
{const _dup=dup;dup=function(){const n0=S.els.length;_dup.apply(this,arguments);if(S.els.length>n0){const n=S.els[S.els.length-1];if(n.tg){delete n.tg;delete n.dt;delete n.ov;delete n.hd}}}}
{const _ed=ed;ed=function(){const r=_ed.apply(this,arguments);const e=cur();if(e&&e.tg&&!e.hd){const ta=document.querySelector('#ed textarea[data-p="txt"]');if(ta){const l=ta.closest('label');const d=document.createElement('div');d.className='v4ch';d.innerHTML='<b>Zincirin devam kutusu</b><span>Metin ilk kutudan akar. Düzenlemek için ilk kutuya git.</span><button class="b" data-v4ch="head">İlk kutuya git</button>';(l||ta).replaceWith(d)}}return r}}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-v4ch="head"]');if(!b)return;const h=v4chainHead(cur());if(!h)return;if(h.pg!=PROJ.cur)goPage(h.pg);setTimeout(()=>{if(byId(h.id))pick(h.id)},50)});
{const _ve=window.v4edit;if(_ve)window.v4edit=function(id){const e=id?byId(id):cur();if(e&&e.tg&&!e.hd){const h=v4chainHead(e);if(h){toast('Zincirde metin ilk kutudan düzenlenir');if(h.pg!=PROJ.cur)goPage(h.pg);setTimeout(()=>{if(byId(h.id)){pick(h.id);_ve(h.id)}},60)}return}return _ve.apply(this,arguments)}}

/* ---------- komutlar, çubuk ---------- */
v4cmd(['Hizala','Aynı genişlik',['Alt+Shift+W'],()=>sameSize('w')]);
v4cmd(['Hizala','Aynı yükseklik',['Alt+Shift+Y'],()=>sameSize('h')]);
v4cmd(['Hizala','Aynı boyut',['Alt+Shift+Z'],()=>sameSize('wh')]);
v4cmd(['Metin','Metni zincirle (sonraki sayfaya devam kutusu)',['Ctrl+Alt+J'],chainNext]);
v4cmd(['Metin','Zinciri çöz',[],chainBreak]);
v4cmd(['Görsel','Kırp / yakınlaştır modu (çift tıkla)',[],()=>{const e=cur();if(e&&e.type=='img')cropOn(e.id);else toast('Önce bir görsel seç')}]);
const pe0=window.v4extra,pc0=window.v4cb;
window.v4extra=o=>(pe0?pe0(o):'')+(o.txt!==undefined&&o.type!='m'?(o.tg?`<button class="cbb wide on" data-cbg="chnext" title="Zincire yeni devam kutusu ekle">Zincir ➜</button><button class="cbb wide" data-cbg="chbrk" title="Zinciri çöz">Çöz</button>`:`<button class="cbb wide" data-cbg="chnext" title="Metin taşarsa sonraki sayfadaki kutuya devam etsin (Ctrl+Alt+J)">Zincirle</button>`):'')+(o.type=='img'&&o.src?`<button class="cbb wide" data-cbg="crop" title="Görseli kutu içinde kaydır ve yakınlaştır (çift tıkla)">Kırp</button>`:'');
window.v4cb=(g,t)=>{if(g=='sw'){sameSize('w');return true}if(g=='sh'){sameSize('h');return true}if(g=='chnext'){chainNext();return true}if(g=='chbrk'){chainBreak();return true}if(g=='crop'){const e=cur();if(e)cropOn(e.id);return true}return pc0?pc0(g,t):false};
window.v4same=sameSize;window.v4chainSync=chainSync;
})();
