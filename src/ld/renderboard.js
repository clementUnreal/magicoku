const STAR="url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3E%3Cpath d=%27M10 2l1.6 6.4L18 10l-6.4 1.6L10 18l-1.6-6.4L2 10l6.4-1.6z%27 fill=%27%23000%27 fill-opacity=%27.13%27/%3E%3C/svg%3E')";
const PP=f=>(3.2+f*93.6).toFixed(3)+"%";
const isVoid=(r,c)=>r<0||c<0||r>=N||c>=N||C.rooms[r][c]===".";
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;r=Math.round(r*f);g=Math.round(g*f);b=Math.round(b*f);return `rgb(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)})`}
function floorCSS(k,r,c,pi){
  if(typeof themeFloor==="function"){const tf=themeFloor(k,r,c);if(tf)return tf}
  const [f1,f2]=(M.floors||FLOORS)[k]||["#ccc","#ddd"],d=shade(f1,.82),l=shade(f1,1.1);
  switch(pi%4){
    case 0:return `${STAR} center/34% no-repeat,${(r+c)%2?f2:f1}`;
    case 1:return `repeating-linear-gradient(90deg,${f1} 0 31%,${d} 31% 33.33%),${f1}`; // planks
    case 2:return `${STAR} center/26% no-repeat,conic-gradient(from 45deg at 50% 50%,${f2} 25%,${f1} 0 50%,${f2} 0 75%,${f1} 0) 0 0/100% 100%`; // diamonds
    default:return `conic-gradient(${f1} 25%,${l} 0 50%,${f1} 0 75%,${l} 0) 0 0/50% 50%`; // small checker
  }
}
const CORNER_T=new Set(["plant","cauldron","trunk","bath","gramo","candle","chair"]),WALL_T=new Set(["shelf","mirror","desk"]);
function sprHTML(o,r,c){
  const k=room(r,c),w=(rr,cc)=>isVoid(rr,cc)||room(rr,cc)!==k;
  const T=w(r-1,c),B=w(r+1,c),Lf=w(r,c-1),R=w(r,c+1);let at=[];
  if(CORNER_T.has(o)){
    if(T&&Lf)at=["t","l"];else if(T&&R)at=["t","r"];else if(B&&Lf)at=["b","l"];else if(B&&R)at=["b","r"];
    else if(T)at=["t"];else if(Lf)at=["l"];else if(R)at=["r"];else if(B)at=["b"];
  }else if(WALL_T.has(o)){
    if(T)at=["t"];else if(Lf)at=["l"];else if(R)at=["r"];else if(B)at=["b"];
  }
  const cls=at.length?at.map(x=>"at-"+x).join(" "):"center";
  const half=v=>(v?(isVoid(...v)?15:10)*N/9+3:4).toFixed(1)+"%";
  const pad=`padding:${half(T&&[r-1,c])} ${half(R&&[r,c+1])} ${half(B&&[r+1,c])} ${half(Lf&&[r,c-1])}`;
  const flip=o==="chair"&&at.includes("r")&&!at.includes("t")?" flip":"";
  return `<span class="obj o-${o} ${cls}${flip}" style="${pad}"><span class="spr"><img src="${SPR[o]}" alt="" draggable="false"></span></span>`;
}
function renderBoard(){
  const rooms=[...new Set(C.rooms.join(""))].filter(k=>k!==".");const pidx={};rooms.forEach((k,i)=>pidx[k]=(M.patterns&&M.patterns[k]!=null)?M.patterns[k]:i);
  let cells="",mk="",objs="";
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const k=room(r,c),o=OBJ[r][c];
    if(k==="."){cells+=`<div class="cell void"></div>`;mk+=`<div class="mk" data-r="${r}" data-c="${c}"></div>`;objs+=`<div class="oc"></div>`;continue}
    const cls=["cell"];if(blocked(r,c))cls.push("blocked");
    const wl=(rr,cc)=>isVoid(rr,cc)||room(rr,cc)!==k;
    const sh=[wl(r-1,c)?"inset 0 14px 12px -10px rgba(20,8,20,.45)":"",wl(r,c-1)?"inset 14px 0 12px -10px rgba(20,8,20,.32)":"",wl(r,c+1)?"inset -10px 0 10px -10px rgba(20,8,20,.25)":"",wl(r+1,c)?"inset 0 -10px 10px -10px rgba(20,8,20,.25)":"","inset 0 0 0 .6px rgba(30,15,20,.18)"].filter(Boolean).join(",");
    cells+=`<button class="${cls.join(" ")}" style="background:${floorCSS(k,r,c,pidx[k])};box-shadow:${sh}" data-r="${r}" data-c="${c}" aria-label="${posn(r,c)}, ${rname(k)}${o&&o!=="void"?", "+OBJN[o][LI()]:""}"></button>`;
    mk+=`<div class="mk" data-r="${r}" data-c="${c}"></div>`;
    objs+=`<div class="oc">${o&&o!=="void"?sprHTML(o,r,c):""}</div>`;
  }
  // ----- rugs
  let rugs="";(M.rugs||[]).forEach(([rr,cc,h,w],i)=>{const k=room(rr,cc),[f1]=(M.floors||FLOORS)[k]||["#999"];const x=cc*100+14,y=rr*100+14,W=w*100-28,H=h*100-28;
    const col=["#c9a24a","#7b5ea7","#3f7891","#b8283e"][i%4];
    rugs+=`<g><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="8" fill="${shade(f1,.86)}" opacity=".7"/><rect x="${x+7}" y="${y+7}" width="${W-14}" height="${H-14}" rx="5" fill="none" stroke="${shade(f1,1.18)}" stroke-width="2.5" opacity=".7"/></g>`});
  // ----- walls, posts and doors (SVG, 100 units per cell) -----
  const segs=[];// {x1,y1,x2,y2,outer,pair}
  for(let r=0;r<=N;r++)for(let c=0;c<N;c++){const a=isVoid(r-1,c)?null:room(r-1,c),b=isVoid(r,c)?null:room(r,c);if(a===b||(!a&&!b))continue;segs.push({x1:c*100,y1:r*100,x2:c*100+100,y2:r*100,outer:!a||!b,pair:a&&b?[a,b].sort().join(""):null})}
  for(let c=0;c<=N;c++)for(let r=0;r<N;r++){const a=isVoid(r,c-1)?null:room(r,c-1),b=isVoid(r,c)?null:room(r,c);if(a===b||(!a&&!b))continue;segs.push({x1:c*100,y1:r*100,x2:c*100,y2:r*100+100,outer:!a||!b,pair:a&&b?[a,b].sort().join(""):null})}
  // one door per pair of neighbouring rooms, on the middle shared segment
  const byPair={};segs.forEach(s=>{if(s.pair)(byPair[s.pair]=byPair[s.pair]||[]).push(s)});
  const labelRun={};
  [...new Set(C.rooms.join(""))].filter(k=>k!==".").forEach(k=>{let minr=N;for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(room(r,c)===k)minr=Math.min(minr,r);const cs=[];for(let c=0;c<N;c++)if(room(minr,c)===k)cs.push(c);labelRun[k]={r:minr,cs}});
  const underLabel=s=>{if(s.y1!==s.y2)return false;const r=s.y1/100,c=s.x1/100;return Object.values(labelRun).some(L=>L.r===r&&L.cs.includes(c))};
  const freeCell=(x,y)=>{const rr=Math.floor(y/100),cc=Math.floor(x/100);return !isVoid(rr,cc)&&!OBJ[rr][cc]};
  const segScore=s=>{const h=s.y1===s.y2;const a=h?freeCell(s.x1+50,s.y1-50):freeCell(s.x1-50,s.y1+50),b=h?freeCell(s.x1+50,s.y1+50):freeCell(s.x1+50,s.y1+50);return (underLabel(s)?-10:0)+(b?4:0)+(a?2:0)};
  const par={};const find=x=>par[x]===x?x:(par[x]=find(par[x]));[...new Set(C.rooms.join(""))].forEach(k=>par[k]=k);
  Object.entries(byPair).sort((p,q)=>q[1].length-p[1].length).forEach(([pair,list])=>{const a=pair[0],b=pair[1];if(find(a)===find(b))return;par[find(a)]=find(b);
    list.sort((p,q)=>p.x1-q.x1||p.y1-q.y1);const mid=(list.length-1)/2;const best=list.map((s,i)=>[segScore(s)-Math.abs(i-mid)*.6,s]).sort((p,q)=>q[0]-p[0])[0][1];best.door=true});
  const doorTop=new Set(segs.filter(s=>s.door&&s.y1===s.y2).map(s=>(s.y1/100)+","+(s.x1/100)));
  let wall="",door="";const pts={};
  const addPt=(x,y)=>{pts[x+","+y]=(pts[x+","+y]||0)+1};
  segs.forEach(s=>{
    addPt(s.x1,s.y1);addPt(s.x2,s.y2);
    if(s.door){const h=s.y1===s.y2,mx=(s.x1+s.x2)/2,my=(s.y1+s.y2)/2;
      const g=34,R=2*g,hx=h?mx-g:s.x1,hy=h?s.y1:my-g;
      const tdm=typeof themeDoor==="function"?themeDoor(h,mx,my,g,s):null;
      if(tdm)door+=tdm;else door+=`<rect x="${h?mx-g:s.x1-5}" y="${h?s.y1-5:my-g}" width="${h?2*g:10}" height="${h?10:2*g}" fill="#c9a46a" opacity=".9"/>`+
        (h?`<path d="M${hx} ${hy+R} A${R} ${R} 0 0 0 ${hx+R} ${hy}" fill="none" stroke="rgba(42,24,36,.45)" stroke-width="2.5" stroke-dasharray="5 5"/><path d="M${hx} ${hy}L${hx} ${hy+R}" stroke="#3b2418" stroke-width="9" stroke-linecap="round"/><path d="M${hx} ${hy}L${hx} ${hy+R}" stroke="#a87634" stroke-width="5" stroke-linecap="round"/>`
           :`<path d="M${hx+R} ${hy} A${R} ${R} 0 0 1 ${hx} ${hy+R}" fill="none" stroke="rgba(42,24,36,.45)" stroke-width="2.5" stroke-dasharray="5 5"/><path d="M${hx} ${hy}L${hx+R} ${hy}" stroke="#3b2418" stroke-width="9" stroke-linecap="round"/><path d="M${hx} ${hy}L${hx+R} ${hy}" stroke="#a87634" stroke-width="5" stroke-linecap="round"/>`);
      const h2=h;// wall stubs either side of the door
      wall+=h2?`<path d="M${s.x1} ${s.y1}H${mx-g}M${mx+g} ${s.y1}H${s.x2}" class="w${s.outer?" o":""}"/>`:`<path d="M${s.x1} ${s.y1}V${my-g}M${s.x1} ${my+g}V${s.y2}" class="w${s.outer?" o":""}"/>`;
      
    }else wall+=`<path d="M${s.x1} ${s.y1}L${s.x2} ${s.y2}" class="w${s.outer?" o":""}"/>`;
  });
  // posts at corners/junctions
  let posts="";
  const isCorner=(x,y)=>{const H=segs.some(s=>s.y1===s.y2&&s.y1===y&&(s.x1===x||s.x2===x)),V=segs.some(s=>s.x1===s.x2&&s.x1===x&&(s.y1===y||s.y2===y));return H&&V};
  Object.keys(pts).forEach(p=>{const [x,y]=p.split(",").map(Number);if(x%100||y%100)return;if(isCorner(x,y)){const q=N/9;const tp=typeof themePost==="function"?themePost(x,y,q):null;if(tp){posts+=tp;return}posts+=`<rect x="${x-19*q}" y="${y-19*q}" width="${38*q}" height="${38*q}" rx="${5*q}" class="post"/><rect x="${x-12*q}" y="${y-15*q}" width="${24*q}" height="${11*q}" rx="${3*q}" fill="#6d4c5f"/>`}});
  const K=N/9;
  wall=wall.replace(/class="w o"/g,`class="w o" stroke-width="${30*K}"`).replace(/class="w"/g,`class="w" stroke-width="${20*K}"`);
  posts=posts.replace(/(-?\d+(\.\d+)?)/g,m=>m);
  if(typeof themeWall==="function")wall=themeWall(wall,K);
  const svg=`<svg class="walls" viewBox="-20 -20 ${N*100+40} ${N*100+40}" aria-hidden="true">${wall}${posts}${door}</svg>`;
  let labels="";
  rooms.forEach(k=>{const L=labelRun[k];let best=[],cur=[];L.cs.forEach(c=>{if(doorTop.has(L.r+","+c)){cur=[]}else{cur.push(c);if(cur.length>best.length)best=cur.slice()}});if(!best.length)best=L.cs;
    const cx=(Math.min(...best)+Math.max(...best)+1)/2;
    labels+=`<span class="rlabel" data-room="${k}" style="left:${PP(cx/N)};top:${PP(L.r/N)}">${rname(k).replace(/^(le |la |les |l'|the )/i,"")}</span>`});
  let edge="";
  for(let c=0;c<N;c++)edge+=`<span class="edge top" style="left:${PP((c+.5)/N)}">${c+1}</span>`;
  for(let r=0;r<N;r++)edge+=`<span class="edge side" style="top:${PP((r+.5)/N)}">${ROWS[r]}</span>`;
  const g=`grid-template-columns:repeat(${N},1fr);grid-template-rows:repeat(${N},1fr)`;
  {const bd=$("#board");bd.className="board"+(typeof themeClass==="function"?" "+themeClass():"")}
  $("#board").innerHTML=`<div class="plan" id="plan" style="--wn:${N*100}"><div class="layer" id="grid" style="${g}">${cells}</div><svg class="rugs" viewBox="0 0 ${N*100} ${N*100}" preserveAspectRatio="none" aria-hidden="true">${rugs}</svg><div class="layer objs" style="${g}">${objs}</div>${svg}<div class="layer marks" id="marks" style="${g}">${mk}</div>${labels}${edge}<span class="tip" id="tip" hidden></span></div>`;
  bindPlan();renderMarks();setupSketch();
}
function cellFromPoint(x,y){const g=$("#grid").getBoundingClientRect();const fx=(x-g.left)/g.width,fy=(y-g.top)/g.height;
  if(fx<0||fy<0||fx>=1||fy>=1)return null;const r=Math.floor(fy*N),c=Math.floor(fx*N);return isVoid(r,c)?null:[r,c]}
function geo(){return null}
