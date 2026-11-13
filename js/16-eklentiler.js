/* ================= STÜDYO 18: eklenti sistemi (izole kutuda çalışır) + Eklenti Pazarı ================= */
(function(){
const X=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MD=(id,title,sub,body)=>{let p=document.getElementById(id);if(!p){p=document.createElement('div');p.id=id;p.className='kpl v4o';document.body.appendChild(p);p.addEventListener('mousedown',e=>{if(e.target===p)closeP(p)});p.addEventListener('click',e=>{if(e.target.closest('[data-x]'))closeP(p)})}
 p.innerHTML=`<div class="kbox kwide v4f"><div class="kh"><b>${title}</b><small>${sub||''}</small><button class="cbb" data-x aria-label="Kapat">✕</button></div><div class="v4b">${body}</div></div>`;p.hidden=false;return p};
const closeP=p=>{p.hidden=true;if(p.id==='v18run'){const f=p.querySelector('iframe');if(f)f.srcdoc='<!doctype html>';CUR=null}};
const CSS='<style>.v18g{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;margin-top:8px}.v18c{border:1px solid #8885;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:6px}.v18c h5{margin:0;font-size:15px}.v18c p{margin:0;opacity:.8;font-size:13px;flex:1}.v18b{display:flex;gap:4px;flex-wrap:wrap}.v18b span{font-size:11px;border:1px solid #8886;border-radius:99px;padding:1px 8px;opacity:.85}.v18w textarea,.v18w input[type=text]{width:100%;box-sizing:border-box}.v18w label{display:block;margin:7px 0}.v18w pre{white-space:pre-wrap;background:#8881;border-radius:8px;padding:8px;font-size:12px;overflow:auto}</style>';

/* ===== saf kodlayıcılar (eklentilerin içine kopyalanır) ===== */
/* QR (bayt kipi, sürüm 1-40) ve barkod kodlayıcıları: saf fonksiyonlar */
function qrEncode(text,ecl){
 var ECC=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]];
 var BLK=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]];
 ecl=ecl|0;if(ecl<0||ecl>3)ecl=1;
 var bytes=Array.prototype.slice.call(new TextEncoder().encode(String(text)));
 function raw(v){var r=(16*v+128)*v+64;if(v>=2){var na=Math.floor(v/7)+2;r-=(25*na-10)*na-55;if(v>=7)r-=36}return r}
 function dcw(v){return Math.floor(raw(v)/8)-ECC[ecl][v]*BLK[ecl][v]}
 var ver=1;for(;ver<=40;ver++){var cc=ver<10?8:16;if(4+cc+bytes.length*8<=dcw(ver)*8)break}
 if(ver>40)throw new Error('Metin çok uzun');
 var bits=[];function put(val,len){for(var i=len-1;i>=0;i--)bits.push((val>>>i)&1)}
 put(4,4);put(bytes.length,ver<10?8:16);bytes.forEach(function(b){put(b,8)});
 var capBits=dcw(ver)*8;put(0,Math.min(4,capBits-bits.length));put(0,(8-bits.length%8)%8);
 for(var pad=0xEC;bits.length<capBits;pad^=0xEC^0x11)put(pad,8);
 var data=[];for(var i=0;i<bits.length;i+=8){var b=0;for(var j=0;j<8;j++)b=b<<1|bits[i+j];data.push(b)}
 /* Reed-Solomon */
 var EXP=[],LOG=[];(function(){var x=1;for(var i=0;i<255;i++){EXP[i]=x;LOG[x]=i;x<<=1;if(x&256)x^=0x11D}for(var i=255;i<512;i++)EXP[i]=EXP[i-255]})();
 function mul(a,b){return a&&b?EXP[LOG[a]+LOG[b]]:0}
 function gen(d){var r=[1];for(var i=0;i<d;i++){var n=r.concat([0]);for(var j=0;j<r.length;j++){n[j]^=0;n[j+1]^=mul(r[j],EXP[i])}r=n}return r}
 function rem(dat,d){var g=gen(d),res=[];for(var i=0;i<d;i++)res.push(0);dat.forEach(function(b){var f=b^res.shift();res.push(0);for(var i=0;i<d;i++)res[i]^=mul(g[i+1],f)});return res}
 var nb=BLK[ecl][ver],eb=ECC[ecl][ver],rawCw=Math.floor(raw(ver)/8),ns=nb-rawCw%nb,sl=Math.floor(rawCw/nb)-eb;
 var blocks=[],k=0;for(var i=0;i<nb;i++){var dd=data.slice(k,k+sl+(i<ns?0:1));k+=dd.length;var e=rem(dd,eb);if(i<ns)dd.push(0);blocks.push({d:dd,e:e,pad:i<ns})}
 var all=[];for(var i=0;i<blocks[blocks.length-1].d.length;i++)blocks.forEach(function(b,j){if(i!=sl||!b.pad)all.push(b.d[i])});
 for(var i=0;i<eb;i++)blocks.forEach(function(b){all.push(b.e[i])});
 /* matris */
 var size=ver*4+17,M=[],F=[];for(var y=0;y<size;y++){M.push(new Array(size).fill(false));F.push(new Array(size).fill(false))}
 function setF(x,y,d){M[y][x]=d;F[y][x]=true}
 for(var i=0;i<size;i++){setF(6,i,i%2==0);setF(i,6,i%2==0)}
 function finder(cx,cy){for(var dy=-4;dy<=4;dy++)for(var dx=-4;dx<=4;dx++){var d=Math.max(Math.abs(dx),Math.abs(dy)),x=cx+dx,y=cy+dy;if(x>=0&&x<size&&y>=0&&y<size)setF(x,y,d!=2&&d!=4)}}
 finder(3,3);finder(size-4,3);finder(3,size-4);
 var ap=[];if(ver>1){var na=Math.floor(ver/7)+2,step=ver==32?26:Math.ceil((ver*4+4)/(na*2-2))*2;ap=[6];for(var pos=size-7;ap.length<na;pos-=step)ap.splice(1,0,pos)}
 for(var i=0;i<ap.length;i++)for(var j=0;j<ap.length;j++){if((i==0&&j==0)||(i==0&&j==ap.length-1)||(i==ap.length-1&&j==0))continue;for(var dy=-2;dy<=2;dy++)for(var dx=-2;dx<=2;dx++)setF(ap[i]+dx,ap[j]+dy,Math.max(Math.abs(dx),Math.abs(dy))!=1)}
 function fmt(mask){var fb=[1,0,3,2][ecl],d=fb<<3|mask,r=d;for(var i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);var bits=((d<<10)|r)^0x5412;function g(i){return((bits>>>i)&1)!=0}
  for(var i=0;i<=5;i++)setF(8,i,g(i));setF(8,7,g(6));setF(8,8,g(7));setF(7,8,g(8));for(var i=9;i<15;i++)setF(14-i,8,g(i));
  for(var i=0;i<8;i++)setF(size-1-i,8,g(i));for(var i=8;i<15;i++)setF(8,size-15+i,g(i));setF(8,size-8,true)}
 fmt(0);
 if(ver>=7){var r=ver;for(var i=0;i<12;i++)r=(r<<1)^((r>>>11)*0x1F25);var vb=ver<<12|r;for(var i=0;i<18;i++){var bit=((vb>>>i)&1)!=0,a=size-11+i%3,b=Math.floor(i/3);setF(a,b,bit);setF(b,a,bit)}}
 var idx=0,tot=all.length*8;
 for(var right=size-1;right>=1;right-=2){if(right==6)right=5;for(var vert=0;vert<size;vert++)for(var j=0;j<2;j++){var x=right-j,up=((right+1)&2)==0,y=up?size-1-vert:vert;if(!F[y][x]&&idx<tot){M[y][x]=((all[idx>>>3]>>>(7-(idx&7)))&1)!=0;idx++}}}
 function mask(m){for(var y=0;y<size;y++)for(var x=0;x<size;x++){var inv;switch(m){case 0:inv=(x+y)%2==0;break;case 1:inv=y%2==0;break;case 2:inv=x%3==0;break;case 3:inv=(x+y)%3==0;break;case 4:inv=(Math.floor(x/3)+Math.floor(y/2))%2==0;break;case 5:inv=x*y%2+x*y%3==0;break;case 6:inv=(x*y%2+x*y%3)%2==0;break;default:inv=((x+y)%2+x*y%3)%2==0}if(inv&&!F[y][x])M[y][x]=!M[y][x]}}
 function pen(){var p=0,dark=0;function line(get){var run=1,prev=get(0),s=prev?'1':'0';for(var i=1;i<size;i++){var c=get(i);s+=c?'1':'0';if(c==prev)run++;else{if(run>=5)p+=3+run-5;run=1;prev=c}}if(run>=5)p+=3+run-5;var a=s.split('10111010000').length-1,b=s.split('00001011101').length-1;p+=(a+b)*40}
  for(var y=0;y<size;y++)line(function(i){return M[y][i]});for(var x=0;x<size;x++)line(function(i){return M[i][x]});
  for(var y=0;y<size-1;y++)for(var x=0;x<size-1;x++){var c=M[y][x];if(c==M[y][x+1]&&c==M[y+1][x]&&c==M[y+1][x+1])p+=3}
  for(var y=0;y<size;y++)for(var x=0;x<size;x++)if(M[y][x])dark++;var t=size*size,kk=Math.ceil(Math.abs(dark*20-t*10)/t)-1;p+=kk*10;return p}
 var best=0,bp=1e9;for(var m=0;m<8;m++){mask(m);fmt(m);var pp=pen();if(pp<bp){bp=pp;best=m}mask(m)}
 mask(best);fmt(best);return{size:size,version:ver,mask:best,get:function(x,y){return M[y][x]}}}
/* Code 128 (B alt kümesi, ASCII 32-126) */
function code128(text){
 var P='212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112'.split(' ');
 text=String(text);if(!text.length)throw new Error('Metin boş');
 var codes=[104],sum=104;for(var i=0;i<text.length;i++){var c=text.charCodeAt(i);if(c<32||c>126)throw new Error('Yalnızca ASCII 32-126 karakterleri');var v=c-32;codes.push(v);sum+=v*(i+1)}
 codes.push(sum%103);codes.push(106);
 var bars=[];codes.forEach(function(c){var s=P[c];for(var i=0;i<s.length;i++)bars.push(+s[i])});return bars}
/* EAN-13 (12 ya da 13 hane) */
function ean13(d){d=String(d).replace(/\D/g,'');if(d.length!=12&&d.length!=13)throw new Error('12 ya da 13 hane gerekli');
 var s=0;for(var i=0;i<12;i++)s+=(+d[i])*(i%2?3:1);var chk=(10-s%10)%10;if(d.length==13&&+d[12]!==chk)throw new Error('Kontrol hanesi hatalı (olması gereken '+chk+')');d=d.slice(0,12)+chk;
 var L=['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'],G=['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'],R=['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
 var PAR=['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'][+d[0]];
 var m='101';for(var i=0;i<6;i++)m+=(PAR[i]=='L'?L:G)[+d[i+1]];m+='01010';for(var i=7;i<13;i++)m+=R[+d[i]];m+='101';return{digits:d,modules:m}}



/* ===== izole kutunun içindeki API (eklenti bu nesneyi görür: window.editra) ===== */
function apiShim(){var pend={},n=0;function call(m,a){return new Promise(function(res,rej){var id=++n;pend[id]={res:res,rej:rej};parent.postMessage({editra:1,id:id,m:m,a:a===undefined?{}:a},'*')})}
 window.addEventListener('message',function(e){var d=e.data;if(!d||!d.editra||d.re==null)return;var p=pend[d.re];if(!p)return;delete pend[d.re];if(d.err)p.rej(new Error(d.err));else p.res(d.v)});
 window.editra={version:1,insertSVG:function(svg,o){return call('insertSVG',{svg:svg,o:o||{}})},insertImage:function(url,o){return call('insertImage',{url:url,o:o||{}})},insertText:function(t,o){return call('insertText',{text:t,o:o||{}})},insertFrame:function(o){return call('insertFrame',{o:o||{}})},batch:function(list){return call('batch',{list:list})},getContext:function(){return call('getContext')},getPageImage:function(w){return call('getPageImage',{w:w})},download:function(name,mime,data){return call('download',{name:name,mime:mime,data:data})},downloadZip:function(name,files){return call('downloadZip',{name:name,files:files})},toast:function(m){return call('toast',{m:m})},close:function(){return call('close')}};
 window.addEventListener('error',function(e){try{parent.postMessage({editra:1,id:0,m:'log',a:{m:String(e.message).slice(0,200)}},'*')}catch(x){}})}

/* ===== yerleşik eklentiler ===== */
function pQR(){var T=document.body;T.innerHTML='<label>Metin ya da bağlantı</label><textarea id="t" rows="3">https://</textarea><div class="r"><div><label>Hata düzeltme</label><select id="e"><option value="0">Düşük (L)</option><option value="1" selected>Orta (M)</option><option value="2">Yüksek (Q)</option><option value="3">En yüksek (H)</option></select></div><div><label>Kare rengi</label><input type="color" id="f" value="#111111"></div><div><label>Arka plan</label><input type="color" id="b" value="#ffffff"></div></div><label><input type="checkbox" id="tr"> Şeffaf arka plan</label><div class="prev" id="pv"></div><small id="inf"></small><div class="r" style="margin-top:8px"><button class="p" id="add">Sayfaya ekle</button><button id="dl">SVG indir</button></div>';
 function $(i){return document.getElementById(i)}
 function svg(){var q=qrEncode($('t').value,+$('e').value),Q=4,S=q.size+2*Q,d='';for(var y=0;y<q.size;y++){var x=0;while(x<q.size){if(q.get(x,y)){var s=x;while(x<q.size&&q.get(x,y))x++;d+='M'+(s+Q)+' '+(y+Q)+'h'+(x-s)+'v1h-'+(x-s)+'z'}else x++}}
  return{svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+S+' '+S+'" width="'+S*10+'" height="'+S*10+'" shape-rendering="crispEdges">'+($('tr').checked?'':'<rect width="'+S+'" height="'+S+'" fill="'+$('b').value+'"/>')+'<path fill="'+$('f').value+'" d="'+d+'"/></svg>',v:q.version}}
 var cur=null;function upd(){try{cur=svg();$('pv').innerHTML=cur.svg;$('inf').textContent='Sürüm '+cur.v+' · '+new TextEncoder().encode($('t').value).length+' bayt';$('add').disabled=$('dl').disabled=false}catch(e){cur=null;$('pv').textContent=e.message;$('add').disabled=$('dl').disabled=true}}
 ['t','e','f','b','tr'].forEach(function(i){$(i).addEventListener('input',upd);$(i).addEventListener('change',upd)});
 $('add').onclick=function(){if(cur)editra.insertSVG(cur.svg,{w:.3,name:'QR kod'}).then(function(){editra.toast('QR kod eklendi')},function(e){editra.toast(e.message)})};
 $('dl').onclick=function(){if(cur)editra.download('qr-kod.svg','image/svg+xml',cur.svg)};
 editra.getContext().then(function(c){var s=(c.selection||[]).filter(function(x){return x.text})[0];if(s){$('t').value=s.text.slice(0,500)}upd()},upd)}
function pBar(){var T=document.body;T.innerHTML='<div class="r"><div><label>Tür</label><select id="k"><option value="c">Code 128 (metin, sayı)</option><option value="e">EAN-13 (ürün barkodu)</option></select></div><div><label>Değer</label><input id="v" value="EDITRA-2026" style="width:100%"></div><div><label>Renk</label><input type="color" id="c" value="#111111"></div></div><label><input type="checkbox" id="x" checked> Altına değeri yaz</label><div class="prev" id="pv"></div><small id="inf"></small><div class="r" style="margin-top:8px"><button class="p" id="add">Sayfaya ekle</button><button id="dl">SVG indir</button></div>';
 function $(i){return document.getElementById(i)}
 function svg(){var col=$('c').value,Q=10,mods,txt,w;if($('k').value=='c'){var bars=code128($('v').value),m=[],dk=true;bars.forEach(function(b){for(var i=0;i<b;i++)m.push(dk?1:0);dk=!dk});mods=m;txt=$('v').value}else{var e=ean13($('v').value);mods=e.modules.split('').map(Number);txt=e.digits;$('v').title='Kontrol hanesi: '+e.digits[12]}
  w=mods.length+2*Q;var h=60,r='',x=0;while(x<mods.length){if(mods[x]){var s=x;while(x<mods.length&&mods[x])x++;r+='<rect x="'+(s+Q)+'" y="0" width="'+(x-s)+'" height="'+h+'" fill="'+col+'"/>'}else x++}
  var tx=$('x').checked?'<text x="'+w/2+'" y="'+(h+14)+'" font-family="Courier New,monospace" font-size="11" text-anchor="middle" fill="'+col+'" letter-spacing="1">'+txt.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</text>':'';
  var H=h+($('x').checked?20:4);return{svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+H+'" width="'+w*6+'" height="'+H*6+'" shape-rendering="crispEdges"><rect width="'+w+'" height="'+H+'" fill="#fff"/>'+r+tx+'</svg>',n:mods.length}}
 var cur=null;function upd(){try{cur=svg();$('pv').innerHTML=cur.svg;$('inf').textContent=cur.n+' modül';$('add').disabled=$('dl').disabled=false}catch(e){cur=null;$('pv').textContent=e.message;$('add').disabled=$('dl').disabled=true}}
 ['k','v','c','x'].forEach(function(i){$(i).addEventListener('input',upd);$(i).addEventListener('change',upd)});
 $('k').addEventListener('change',function(){$('v').value=$('k').value=='e'?'590123412345':'EDITRA-2026';upd()});
 $('add').onclick=function(){if(cur)editra.insertSVG(cur.svg,{w:.4,name:'Barkod'}).then(function(){editra.toast('Barkod eklendi')},function(e){editra.toast(e.message)})};
 $('dl').onclick=function(){if(cur)editra.download('barkod.svg','image/svg+xml',cur.svg)};upd()}
function pCal(){var T=document.body,now=new Date(),MN=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
 T.innerHTML='<div class="r"><div><label>Ay</label><select id="m">'+MN.map(function(n,i){return'<option value="'+i+'"'+(i==now.getMonth()?' selected':'')+'>'+n+'</option>'}).join('')+'</select></div><div><label>Yıl</label><input type="number" id="y" value="'+now.getFullYear()+'" min="1900" max="2200"></div><div><label>Stil</label><select id="s"><option value="m">Minimal</option><option value="b">Kutulu</option></select></div><div><label>Renk</label><input type="color" id="c" value="#111111"></div></div><label><input type="checkbox" id="w" checked> Hafta sonlarını soluk göster</label><label><input type="checkbox" id="n"> Hafta numaraları</label><div class="prev" id="pv"></div><div class="r"><button class="p" id="add">Sayfaya ekle</button><button id="dl">SVG indir</button></div>';
 function $(i){return document.getElementById(i)}
 function wk(d){var t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));var n=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-n);var y0=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-y0)/864e5+1)/7)}
 function svg(){var m=+$('m').value,y=+$('y').value,col=$('c').value,box=$('s').value=='b',dim=$('w').checked,wn=$('n').checked,off=wn?60:0,W=700+off,cw=100,ch=80,first=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate(),rows=Math.ceil((first+days)/7),H=170+rows*ch,F='font-family="Helvetica Neue,Helvetica,Arial,sans-serif"',o='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" '+F+'>';
  o+='<text x="0" y="60" font-size="54" font-weight="700" fill="'+col+'">'+MN[m]+' '+y+'</text>';
  ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].forEach(function(d,i){o+='<text x="'+(off+i*cw+cw/2)+'" y="130" font-size="20" text-anchor="middle" fill="'+col+'" opacity="'+(dim&&i>4?.45:.8)+'" letter-spacing="2">'+d.toUpperCase()+'</text>'});
  o+='<line x1="0" y1="146" x2="'+W+'" y2="146" stroke="'+col+'" stroke-width="2"/>';
  for(var d=1;d<=days;d++){var idx=first+d-1,r=Math.floor(idx/7),c=idx%7,x=off+c*cw,y0=146+r*ch;if(box)o+='<rect x="'+(x+2)+'" y="'+(y0+2)+'" width="'+(cw-4)+'" height="'+(ch-4)+'" fill="none" stroke="'+col+'" stroke-width="1" opacity=".35"/>';
   o+='<text x="'+(box?x+14:x+cw/2)+'" y="'+(y0+(box?34:50))+'" font-size="30" '+(box?'':'text-anchor="middle" ')+'fill="'+col+'" opacity="'+(dim&&c>4?.45:1)+'">'+d+'</text>';
   if(wn&&c==0)o+='<text x="0" y="'+(y0+50)+'" font-size="16" fill="'+col+'" opacity=".5">'+wk(new Date(y,m,d))+'</text>'}
  return o+'</svg>'}
 var cur='';function upd(){try{cur=svg();$('pv').innerHTML=cur}catch(e){cur=''}}
 ['m','y','s','c','w','n'].forEach(function(i){$(i).addEventListener('input',upd);$(i).addEventListener('change',upd)});
 $('add').onclick=function(){editra.insertSVG(cur,{w:.8,name:'Takvim'}).then(function(){editra.toast('Takvim eklendi')},function(e){editra.toast(e.message)})};
 $('dl').onclick=function(){editra.download('takvim.svg','image/svg+xml',cur)};upd()}
function pIG(){var T=document.body;T.innerHTML='<div class="r"><button id="t1" class="p">Grid planlayıcı</button><button id="t2">Carousel böl</button></div><div id="b"></div>';function $(i){return document.getElementById(i)}
 function grid(){$('b').innerHTML='<div class="r"><div><label>Satır</label><input type="number" id="r" value="3" min="1" max="8"></div><div><label>Kare oranı</label><select id="a"><option value="1">1:1</option><option value="1.25" selected>4:5</option><option value="1.3333">3:4</option></select></div><div><label>Boşluk (%)</label><input type="number" id="g" value="1" min="0" max="6" step=".5"></div></div><label><input type="checkbox" id="n" checked> Kareleri numarala (1 = en yeni)</label><small>3 sütunluk profil gridi için boş görsel kutuları yerleştirir; sonra görsellerini kutulara bırakırsın.</small><div class="r" style="margin-top:8px"><button class="p" id="go">Sayfaya yerleştir</button></div>';
  $('go').onclick=function(){var R=+$('r').value,a=+$('a').value,g=+$('g').value/100,cw=(1-4*g)/3,ctx;editra.getContext().then(function(c){var ar=c.page.w_mm/c.page.h_mm;var h=cw*a*(c.page.w_mm/c.page.h_mm);var list=[];if(h*R+g*(R+1)>1.0001){h=(1-g*(R+1))/R}
    for(var i=0;i<R*3;i++){var r=Math.floor(i/3),k=i%3;list.push({k:'frame',o:{x:g+k*(cw+g),y:g+r*(h+g),w:cw,h:h,name:'Gönderi '+(i+1)}});if($('n').checked)list.push({k:'text',text:String(i+1),o:{x:g+k*(cw+g)+.01,y:g+r*(h+g)+.01,w:.08,h:.04,fs:2.5,col:'#ffffff',name:'No '+(i+1)}})}
    return editra.batch(list)}).then(function(){editra.toast('Grid yerleştirildi');editra.close()},function(e){editra.toast(e.message)})}}
 function car(){$('b').innerHTML='<div class="r"><div><label>Slayt sayısı</label><input type="number" id="n" value="3" min="2" max="10"></div><div><label>Slayt oranı</label><select id="a"><option value="1">1:1 (1080×1080)</option><option value="1.25" selected>4:5 (1080×1350)</option></select></div></div><small>Sayfan yan yana N slayt genişliğinde olmalı (örn. özel boyut 3240×1350 px oranında). Sayfa PNG olarak dilimlenir ve zip indirilir.</small><div class="r" style="margin-top:8px"><button class="p" id="go">Dilimle ve indir</button></div>';
  $('go').onclick=function(){var N=+$('n').value,a=+$('a').value,Wd=1080*N;editra.getPageImage(Wd).then(function(url){return new Promise(function(res,rej){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){rej(new Error('Sayfa görseli okunamadı'))};im.src=url})}).then(function(im){var files=[],sw=im.naturalWidth/N,H=Math.round(1080*a);for(var i=0;i<N;i++){var c=document.createElement('canvas');c.width=1080;c.height=H;c.getContext('2d').drawImage(im,i*sw,0,sw,im.naturalHeight,0,0,1080,H);files.push({name:'slayt-'+(i+1)+'.png',data:c.toDataURL('image/png')})}return editra.downloadZip('carousel.zip',files)}).then(function(){editra.toast('Carousel zip indirildi')},function(e){editra.toast(e.message)})}}
 $('t1').onclick=function(){$('t1').className='p';$('t2').className='';grid()};$('t2').onclick=function(){$('t2').className='p';$('t1').className='';car()};grid()}
function pAnim(){var T=document.body;T.innerHTML='<label>SVG kodu (yapıştır) ya da dosya seç</label><textarea id="s" rows="4" placeholder="&lt;svg ...&gt;"></textarea><div class="r"><div><input type="file" id="f" accept=".svg,image/svg+xml"></div><div><label>Hareket</label><select id="a"><option value="draw">Çizgi çizilsin</option><option value="fade">Belirme</option><option value="pulse">Nabız</option><option value="spin">Dönme</option><option value="bounce">Zıplama</option><option value="float">Süzülme</option></select></div><div><label>Süre (sn)</label><input type="number" id="d" value="3" min=".5" max="20" step=".5"></div><div><label>Kademe (sn)</label><input type="number" id="g" value=".15" min="0" max="2" step=".05"></div></div><label><input type="checkbox" id="l" checked> Sonsuz döngü</label><div class="prev" id="pv">Önizleme burada</div><small id="inf"></small><div class="r" style="margin-top:8px"><button id="pr" class="p">Önizle</button><button id="dl">Animasyonlu SVG indir</button><button id="add">İlk kareyi sayfaya ekle</button></div>';
 function $(i){return document.getElementById(i)}
 $('f').onchange=function(){var f=$('f').files[0];if(!f)return;var r=new FileReader();r.onload=function(){$('s').value=String(r.result).slice(0,1500000)};r.readAsText(f)};
 function clean(svgText){var doc=new DOMParser().parseFromString(svgText,'image/svg+xml'),root=doc.documentElement;if(!root||root.nodeName.toLowerCase()!=='svg'||doc.querySelector('parsererror'))throw new Error('Geçerli bir SVG değil');
  Array.prototype.slice.call(root.querySelectorAll('script,foreignObject,iframe,object,embed')).forEach(function(n){n.remove()});
  Array.prototype.slice.call(root.querySelectorAll('*')).concat([root]).forEach(function(n){Array.prototype.slice.call(n.attributes).forEach(function(a){if(/^on/i.test(a.name)||(/href/i.test(a.name)&&!/^#/.test(a.value)&&!/^data:image\//i.test(a.value)))n.removeAttribute(a.name)})});return root}
 function build(){var root=clean($('s').value.trim()),kind=$('a').value,dur=+$('d').value||3,gap=+$('g').value||0,loop=$('l').checked?'infinite':'1',els=Array.prototype.slice.call(root.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse,text,g > g'));if(!els.length)els=Array.prototype.slice.call(root.children).filter(function(n){return n.nodeName!=='defs'&&n.nodeName!=='style'});
  var css={draw:'@keyframes ea{0%{stroke-dashoffset:1;fill-opacity:0}60%{stroke-dashoffset:0;fill-opacity:0}100%{stroke-dashoffset:0;fill-opacity:1}}.ea{stroke-dasharray:1;stroke-dashoffset:1}',fade:'@keyframes ea{0%{opacity:0}40%,100%{opacity:1}}.ea{opacity:0}',pulse:'@keyframes ea{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}.ea{transform-box:fill-box;transform-origin:center}',spin:'@keyframes ea{to{transform:rotate(360deg)}}.ea{transform-box:fill-box;transform-origin:center}',bounce:'@keyframes ea{0%,100%{transform:translateY(0)}30%{transform:translateY(-12%)}50%{transform:translateY(0)}65%{transform:translateY(-5%)}}.ea{transform-box:fill-box;transform-origin:center}',float:'@keyframes ea{0%,100%{transform:translateY(0)}50%{transform:translateY(-6%)}}.ea{transform-box:fill-box;transform-origin:center}'}[kind];
  els.forEach(function(n,i){n.setAttribute('class',((n.getAttribute('class')||'')+' ea').trim());if(kind=='draw'){n.setAttribute('pathLength','1');if(!n.getAttribute('stroke')||n.getAttribute('stroke')=='none'){n.setAttribute('stroke',n.getAttribute('fill')&&n.getAttribute('fill')!='none'?n.getAttribute('fill'):'#111')}}n.setAttribute('style',(n.getAttribute('style')||'')+';animation:ea '+dur+'s ease-in-out '+(i*gap).toFixed(2)+'s '+loop+' both')});
  var st=root.ownerDocument.createElementNS('http://www.w3.org/2000/svg','style');st.textContent=css+'@media (prefers-reduced-motion:reduce){.ea{animation:none!important}}';root.insertBefore(st,root.firstChild);if(!root.getAttribute('xmlns'))root.setAttribute('xmlns','http://www.w3.org/2000/svg');
  return{anim:new XMLSerializer().serializeToString(root),n:els.length}}
 function still(){var root=clean($('s').value.trim());if(!root.getAttribute('xmlns'))root.setAttribute('xmlns','http://www.w3.org/2000/svg');return new XMLSerializer().serializeToString(root)}
 var cur=null;function run(f){try{cur=build();f&&f(cur)}catch(e){cur=null;editra.toast(e.message)}}
 $('pr').onclick=function(){run(function(c){$('pv').innerHTML=c.anim;$('inf').textContent=c.n+' öğe hareketlendi'})};
 $('dl').onclick=function(){run(function(c){editra.download('animasyon.svg','image/svg+xml',c.anim)})};
 $('add').onclick=function(){try{editra.insertSVG(still(),{w:.5,name:'SVG (ilk kare)'}).then(function(){editra.toast('Eklendi (sayfada hareketsiz, animasyon indirilen dosyada)')},function(e){editra.toast(e.message)})}catch(e){editra.toast(e.message)}}}
const BUILTIN=[
 {id:'qr',name:'QR Kod Üretici',desc:'Metin ya da bağlantıdan QR kod üretir (sürüm 1-40, 4 hata düzeltme düzeyi). Vektör olarak sayfaya ekler.',author:'Editra',needs:['insert','read','download'],main:pQR,deps:[qrEncode]},
 {id:'barcode',name:'Barkod',desc:'Code 128 ve EAN-13 barkod üretir; EAN-13 kontrol hanesini doğrular.',author:'Editra',needs:['insert','download'],main:pBar,deps:[code128,ean13]},
 {id:'calendar',name:'Takvim',desc:'Türkçe, pazartesi başlangıçlı aylık takvim çizer; hafta numarası ve kutulu stil seçenekleri.',author:'Editra',needs:['insert','download'],main:pCal,deps:[]},
 {id:'instagram',name:'Instagram Grid',desc:'Profil gridi için boş görsel kutuları yerleştirir; geniş sayfayı carousel slaytlarına bölüp zip indirir.',author:'Editra',needs:['insert','read','download'],main:pIG,deps:[]},
 {id:'svganim',name:'SVG Animatör',desc:'Yapıştırdığın SVG’ye çizgi çizme, belirme, nabız, dönme, zıplama gibi hareketler ekler; animasyonlu SVG indirir.',author:'Editra',needs:['insert','download'],main:pAnim,deps:[]}];
const NEEDS={insert:'Sayfaya öğe ekler',read:'Seçili metni ve sayfa görselini okur',download:'Dosya indirir'};
const BASECSS=':root{color-scheme:light dark}body{font:14px system-ui,Segoe UI,Helvetica,Arial,sans-serif;margin:12px;color:CanvasText;background:Canvas}input,select,textarea,button{font:inherit;color:inherit;background:Field;border:1px solid #8886;border-radius:8px;padding:6px 8px;box-sizing:border-box;max-width:100%}textarea{width:100%}button{cursor:pointer}button.p{background:#5b3df5;color:#fff;border-color:transparent}button:disabled{opacity:.5;cursor:default}label{display:block;margin:8px 0 3px;font-size:12px;opacity:.75}.r{display:flex;gap:8px;flex-wrap:wrap;align-items:end}.r>div{flex:1;min-width:110px}.prev{background:repeating-conic-gradient(#8882 0 25%,transparent 0 50%) 0 0/14px 14px;border-radius:10px;padding:10px;text-align:center;margin:10px 0;overflow:auto}.prev svg{max-width:100%;max-height:260px;height:auto}small{opacity:.7}';
const CSP="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:";
function frameDoc(pl){const head='<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="'+CSP+'"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+BASECSS+'</style><scr'+'ipt>('+apiShim.toString()+')()</scr'+'ipt>';
 if(pl.builtin){const deps=pl.deps.map(f=>'var '+f.name+'='+f.toString()+';').join('\n');return'<!doctype html><html><head>'+head+'</head><body><scr'+'ipt>'+deps+'\n('+pl.main.toString()+')()</scr'+'ipt></body></html>'}
 return'<!doctype html><html><head>'+head+'</head><body>'+String(pl.code||'')+'</body></html>'}

/* ===== depo ===== */
const store={async list(){try{return((await window.v4assets.all()).filter(a=>a.kind==='plugin'&&typeof a.data==='string')).map(a=>({id:a.id,name:a.name,desc:a.desc||'',author:a.author||'Bilinmiyor',needs:Array.isArray(a.needs)?a.needs:[],code:a.data,t:a.t}))}catch(e){return[]}},
 async add(o){const a={id:'pl'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),kind:'plugin',name:String(o.name).slice(0,60),desc:String(o.desc||'').slice(0,240),author:String(o.author||'').slice(0,40),needs:(o.needs||[]).filter(n=>NEEDS[n]),data:String(o.code).slice(0,300000),t:Date.now()};await window.v4assets.put(a);return a},
 async del(id){await window.v4assets.del(id)}};

/* ===== ana bilgisayar tarafı (host) ===== */
let CUR=null,callLog=[];
const clamp=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):d};
const Hh=()=>100/S.fmt;
const okCol=c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c);
const b64=s=>'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(s)));
function svgAspect(s){let m=/viewBox\s*=\s*["']\s*[-\d.eE]+[\s,]+[-\d.eE]+[\s,]+([\d.eE]+)[\s,]+([\d.eE]+)/i.exec(s);if(!m){const w=/<svg[^>]*\swidth\s*=\s*["']([\d.]+)/i.exec(s),h=/<svg[^>]*\sheight\s*=\s*["']([\d.]+)/i.exec(s);if(w&&h)m=[0,w[1],h[1]]}const a=m?(+m[2])/(+m[1]):1;return isFinite(a)&&a>0?a:1}
function imgAspect(url){return new Promise(r=>{const i=new Image();i.onload=()=>r((i.naturalHeight||1)/(i.naturalWidth||1));i.onerror=()=>r(1);i.src=url})}
function frameOf(o,asp,defW){const H=Hh();let w=clamp(o.w,.01,1,defW)*100,h=o.h!=null?clamp(o.h,.01,1,.2)*H:w*asp;if(h>H){h=H;w=o.h!=null?w:h/asp}
 let x=o.x!=null?clamp(o.x,0,1,0)*100:(100-w)/2,y=o.y!=null?clamp(o.y,0,1,0)*H:(H-h)/2;return[+x.toFixed(2),+y.toFixed(2),+w.toFixed(2),+h.toFixed(2)]}
async function addEl(spec,pl){const o=spec.o||{};let e;
 if(spec.k==='svg'){const s=String(spec.svg||'').trim();if(!/^(<\?xml[^>]*>\s*)?<svg[\s>]/i.test(s))throw new Error('Geçerli bir SVG değil');if(s.length>2e6)throw new Error('SVG çok büyük (en fazla 2 MB)');
  const clean=s.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi,'');const url=b64(clean);e=mk('img');e.src=url;e.im=getIm(url);e.fit='contain';e.fr=frameOf(o,svgAspect(clean),.5)}
 else if(spec.k==='image'){const u=String(spec.url||'');if(!/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(u))throw new Error('Yalnızca base64 PNG, JPEG, WebP ya da GIF');if(u.length>1.2e7)throw new Error('Görsel çok büyük');e=mk('img');e.src=u;e.im=getIm(u);e.fit=o.fit=='cover'?'cover':'contain';e.fr=frameOf(o,await imgAspect(u),.5)}
 else if(spec.k==='frame'){e=mk('img');e.src='';e.im=new Image();e.fit='cover';e.fr=frameOf(o,1,.3)}
 else if(spec.k==='text'){const t=String(spec.text==null?'':spec.text).slice(0,5000);e=mk('b');e.txt=t;e.fs=clamp(o.fs,.5,30,2.2);if(okCol(o.col))e.col=o.col;e.fr=frameOf({x:o.x!=null?o.x:.1,y:o.y!=null?o.y:.1,w:o.w!=null?o.w:.6,h:o.h!=null?o.h:.1},1,.6)}
 else throw new Error('Bilinmeyen öğe türü');
 e.pin=true;e.dx=0;e.dy=0;e.nm=String(o.name||pl&&pl.name||'Eklenti').slice(0,40);e.plg=pl?pl.id:undefined;return e}
function finish(els){els.forEach(e=>S.els.push(e));const l=els[els.length-1];if(l){S.sel=l.id;MSEL.clear()}render();list();ed();hist()}
const METHODS={
 async insertSVG(a,pl){if(!pl.needs.includes('insert'))throw new Error('Bu eklenti sayfaya öğe ekleme iznine sahip değil');const e=await addEl({k:'svg',svg:a.svg,o:a.o},pl);finish([e]);return{id:e.id}},
 async insertImage(a,pl){if(!pl.needs.includes('insert'))throw new Error('Ekleme izni yok');const e=await addEl({k:'image',url:a.url,o:a.o},pl);finish([e]);return{id:e.id}},
 async insertText(a,pl){if(!pl.needs.includes('insert'))throw new Error('Ekleme izni yok');const e=await addEl({k:'text',text:a.text,o:a.o},pl);finish([e]);return{id:e.id}},
 async insertFrame(a,pl){if(!pl.needs.includes('insert'))throw new Error('Ekleme izni yok');const e=await addEl({k:'frame',o:a.o},pl);finish([e]);return{id:e.id}},
 async batch(a,pl){if(!pl.needs.includes('insert'))throw new Error('Ekleme izni yok');const L=Array.isArray(a.list)?a.list.slice(0,80):[];const els=[];for(const it of L)els.push(await addEl({k:it.k,svg:it.svg,url:it.url,text:it.text,o:it.o},pl));finish(els);return{n:els.length}},
 async getContext(a,pl){if(!PROJ)throw new Error('Proje açık değil');const c={project:PROJ.name,page:{w_mm:S.mm[0],h_mm:S.mm[1],bg:S.bg,index:PROJ.cur+1,count:PROJ.pages.length},selection:[]};if(pl.needs.includes('read'))c.selection=selEls().slice(0,20).map(e=>({type:e.type,text:e.txt!==undefined?String(e.txt).slice(0,5000):null}));return c},
 async getPageImage(a,pl){if(!pl.needs.includes('read'))throw new Error('Sayfa görselini okuma izni yok');await loadF();const w=Math.round(clamp(a.w,200,8000,1080));return draw(w).toDataURL('image/png')},
 async download(a,pl){if(!pl.needs.includes('download'))throw new Error('Dosya indirme izni yok');const name=String(a.name||'dosya').replace(/[^\w.\-çğıöşüÇĞİÖŞÜ ]/g,'_').slice(0,80),mime=String(a.mime||'text/plain');const OKM=['image/svg+xml','image/png','image/jpeg','text/plain','text/csv','application/json'];if(!OKM.includes(mime))throw new Error('İzin verilmeyen dosya türü');
  let blob;const d=String(a.data==null?'':a.data);if(d.length>3e7)throw new Error('Dosya çok büyük');if(/^data:[^;]+;base64,/.test(d)){const bin=atob(d.split(',')[1]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);blob=new Blob([u],{type:mime})}else blob=new Blob([d],{type:mime+';charset=utf-8'});await save(name,blob);return{ok:1}},
 async downloadZip(a,pl){if(!pl.needs.includes('download'))throw new Error('Dosya indirme izni yok');const name=String(a.name||'dosya.zip').replace(/[^\w.\-]/g,'_').slice(0,80),F=Array.isArray(a.files)?a.files.slice(0,40):[],files=[];for(const f of F){const n=String(f.name||'dosya').replace(/[^\w.\-]/g,'_').slice(0,60),d=String(f.data||'');const m=/^data:image\/png;base64,(.*)$/.exec(d);if(!m)throw new Error('Zip yalnızca PNG içerir');const bin=atob(m[1]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);files.push({name:n,data:u})}await save(name,window.v4zip(files));return{ok:1}},
 async toast(a){toast(String(a.m||'').slice(0,140));return 1},
 async close(){const p=document.getElementById('v18run');if(p)closeP(p);return 1}};
window.addEventListener('message',async ev=>{const d=ev.data;if(!d||d.editra!==1||!CUR||ev.source!==CUR.win)return;const pl=CUR.pl;
 if(d.m==='log'){try{console.warn('[eklenti '+pl.name+']',d.a&&d.a.m)}catch(e){}return}
 const now=Date.now();callLog=callLog.filter(t=>now-t<60000);callLog.push(now);const reply=o=>{try{ev.source.postMessage(Object.assign({editra:1,re:d.id},o),'*')}catch(e){}};
 if(callLog.length>300)return reply({err:'Çok fazla istek: dakikada en fazla 300'});
 const fn=Object.prototype.hasOwnProperty.call(METHODS,d.m)?METHODS[d.m]:null;if(!fn)return reply({err:'Bilinmeyen yöntem: '+String(d.m).slice(0,40)});
 try{reply({v:await fn(d.a&&typeof d.a==='object'?d.a:{},pl)})}catch(e){reply({err:String(e&&e.message||e).slice(0,200)})}});

/* ===== arayüz ===== */
function runPl(pl){if(!PROJ)return toast('Önce bir proje aç');
 const p=MD('v18run',X(pl.name),'Eklenti izole bir kutuda çalışır: projenin geri kalanına ve internete erişemez','<iframe id="v18f" title="'+X(pl.name)+'" sandbox="allow-scripts" style="width:100%;height:min(70vh,560px);border:1px solid #8884;border-radius:10px;background:#fff"></iframe>');
 const f=p.querySelector('#v18f');CUR={pl,win:null};f.srcdoc=frameDoc(pl);CUR.win=f.contentWindow;f.addEventListener('load',()=>{if(CUR&&CUR.pl===pl)CUR.win=f.contentWindow})}
async function openMarket(){const cust=await store.list();
 const card=(pl,own)=>`<div class="v18c"><h5>${X(pl.name)}</h5><p>${X(pl.desc)}</p><div class="v18b">${pl.needs.map(n=>`<span>${X(NEEDS[n]||n)}</span>`).join('')||'<span>İzin istemez</span>'}</div><small class="mut">${X(pl.author)}${own?' · senin eklentin':' · yerleşik'}</small><div class="v18b"><button class="b pr" data-run="${X(pl.id)}">Aç</button>${own?`<button class="b" data-del="${X(pl.id)}">Kaldır</button>`:''}</div></div>`;
 const p=MD('v18mk','Eklenti Pazarı','Editra’ya özellik ekleyen küçük araçlar',`<div class="v18w"><h5>Yerleşik eklentiler</h5><div class="v18g">${BUILTIN.map(b=>card(b,false)).join('')}</div>
  <h5 style="margin-top:14px">Kendi eklentilerin</h5><div class="v18g">${cust.map(c=>card(c,true)).join('')||'<small class="mut">Henüz eklenti yüklemedin.</small>'}</div>
  <details style="margin-top:14px"><summary><b>Eklenti yaz / yükle</b></summary>
   <p class="mut">Eklenti, tek bir HTML parçasıdır (içinde kendi &lt;script&gt; ve &lt;style&gt; etiketleri olabilir). Kod, <b>sandbox</b>’lı bir kutuda çalışır ve ağ erişimi yoktur (CSP). Dışarıdan kütüphane yükleyemez, her şeyi satır içi yazmalısın. Projeyle yalnızca aşağıdaki <code>editra</code> nesnesi üzerinden konuşur; her yöntem Promise döner. İzin vermediğin işlemler reddedilir.</p>
   <pre>editra.insertSVG(svg, {x,y,w,h,name})   // x,y,w,h: sayfaya göre 0–1
editra.insertImage(dataUrl, {...})       // base64 png/jpg/webp/gif
editra.insertText(metin, {x,y,w,fs,col})
editra.insertFrame({x,y,w,h})            // boş görsel kutusu
editra.batch([{k:'svg'|'text'|'frame'|'image', ...}])
editra.getContext()    // {project,page,selection[]}  (izin: read)
editra.getPageImage(px)  // PNG dataURL (izin: read)
editra.download(ad, mime, veri) / editra.downloadZip(ad, [{name,data}])
editra.toast(msg) / editra.close()</pre>
   <label>Ad <input type="text" id="v18n" maxlength="60" placeholder="Eklentimin adı"></label><label>Açıklama <input type="text" id="v18d" maxlength="240"></label><label>Yazar <input type="text" id="v18a" maxlength="40"></label>
   <div class="v18b" id="v18p">${Object.entries(NEEDS).map(([k,v])=>`<label><input type="checkbox" value="${k}"${k==='insert'?' checked':''}> ${X(v)}</label>`).join('')}</div>
   <label>HTML + betik</label><textarea id="v18c" rows="8" placeholder="&lt;button id=b&gt;Merhaba ekle&lt;/button&gt;&lt;script&gt;b.onclick=()=&gt;editra.insertText('Merhaba',{x:.1,y:.1})&lt;/script&gt;"></textarea>
   <div class="v18b" style="margin-top:6px"><button class="b pr" id="v18add">Yükle</button><label class="b" for="v18file" style="margin:0">.html dosyasından</label><input type="file" id="v18file" accept=".html,text/html" hidden></div>
   <p class="mut">Not: Herkese açık bir eklenti kayıt sunucusu henüz yok; eklentiler bu tarayıcıda saklanır. Başkasından aldığın eklentinin kodunu çalıştırmadan önce oku.</p></details></div>${CSS}`);
 p.onclick=async e=>{const r=e.target.closest('[data-run]'),d=e.target.closest('[data-del]');
  if(r){const id=r.dataset.run,pl=BUILTIN.find(b=>b.id===id);if(pl)return runPl({...pl,builtin:true});const c=cust.find(x=>x.id===id);if(c)return runPl(c)}
  if(d){await store.del(d.dataset.del);return openMarket()}
  if(e.target.id==='v18add'){const name=p.querySelector('#v18n').value.trim(),code=p.querySelector('#v18c').value;if(!name||!code.trim())return toast('Ad ve kod gerekli');if(code.length>3e5)return toast('Kod çok büyük');
   const needs=[...p.querySelectorAll('#v18p input:checked')].map(i=>i.value);await store.add({name,desc:p.querySelector('#v18d').value,author:p.querySelector('#v18a').value,needs,code});toast('Eklenti yüklendi');openMarket()}};
 p.querySelector('#v18file').onchange=ev=>{const f=ev.target.files[0];if(!f)return;if(f.size>3e5)return toast('Dosya çok büyük');const r=new FileReader();r.onload=()=>{p.querySelector('#v18c').value=String(r.result);if(!p.querySelector('#v18n').value)p.querySelector('#v18n').value=f.name.replace(/\.html?$/i,'')};r.readAsText(f)}}
window.v4plug={open:openMarket,run:id=>{const pl=BUILTIN.find(b=>b.id===id);if(pl)runPl({...pl,builtin:true})},BUILTIN,store,frameDoc,METHODS,qrEncode,code128,ean13};
v4cmd(['Eklenti','Eklenti Pazarı',['Ctrl+Alt+Z'],openMarket]);
BUILTIN.forEach(b=>v4cmd(['Eklenti',b.name,[],()=>runPl({...b,builtin:true})]));
const mm=document.getElementById('mmenu');if(mm){const w=document.createElement('button');w.type='button';w.className='pitem wide';w.innerHTML='<span>Eklenti Pazarı</span><kbd>Ctrl+Alt+Z</kbd>';w.onclick=()=>{mm.hidden=true;openMarket()};mm.appendChild(w)}
})();
