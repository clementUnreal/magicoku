/* ================= Season 2 (chapters 11-20): same places, a new look per chapter =================
   Floors come recoloured from the level data (storymeta PAL2, M.th2 = chapter number); here: wall colours, corner posts,
   floor textures for some rooms, frame and labels. */
(function(){
  const ch=()=>M&&M.th2&&themeEnv()?M.th2:0;
  const W={11:{base:"#1b2a33",over:"#8fd6c8",dash:"6 10",ow:.45,cap:"round"},12:{base:"#4a2a12",over:"#e0a050",dash:"3 14",ow:.6,cap:"round"},
    13:{base:"#141418",over:"#d8c58a",dash:"",ow:.22,cap:"butt"},14:{base:"#6b3b55",over:"#f6d36a",dash:"18 6",ow:.35,cap:"round"},
    15:{base:"#12241c",over:"#e6c45a",dash:"",ow:.2,cap:"butt"},16:{base:"#0b1424",over:"#6ad8ff",dash:"14 8",ow:.4,cap:"butt"},
    17:{base:"#2f5a4a",over:"#e2f6ea",dash:"",ow:.5,cap:"round"},18:{base:"#1a1020",over:"#ffb84a",dash:"4 9",ow:.5,cap:"round"},
    19:{base:"#2a1410",over:"#d9b26a",dash:"22 5",ow:.32,cap:"butt"},20:{base:"#3a5a7a",over:"#fff0d0",dash:"10 6",ow:.5,cap:"round"}};
  /* floor textures that change with the new look (room type -> texture), the others keep the place's own */
  const F={13:"tiles",14:{taverne:"carpet",poste:"carpet",cabane:"carpet",forge:"marble",place:"marble",pont:"carpet"},
    19:{quai:"planks",attente:"carpet",guichet:"carpet",consigne:"planks",buffet:"carpet",voies:"planks",hallg:"planks",souterrain:"carpet"},
    17:{salle:"tiles",chambre:"carpet",bloc:"tiles"},15:{rails:"marble",galerie:"marble",crypte:"marble"}};
  const _tc=themeClass;themeClass=function(){const c=_tc.apply(this,arguments),n=ch();return n?c+" th2 th2-"+n:c};
  const _tw=themeWall;themeWall=function(wall,K){const n=ch(),e=themeEnv();if(!n||!W[n]||typeof TH_WALL==="undefined")return _tw.apply(this,arguments);
    const keep=TH_WALL[e];TH_WALL[e]=W[n];try{return _tw.apply(this,arguments)}finally{TH_WALL[e]=keep}};
  const _tf=themeFloor;themeFloor=function(k,r,c){const n=ch(),e=themeEnv();const f=n&&F[n];if(!f||!M.rtypes||typeof TH_FLOOR==="undefined")return _tf.apply(this,arguments);
    const t=M.rtypes[k],st=typeof f==="string"?f:f[t];if(!st)return _tf.apply(this,arguments);
    const keep=TH_FLOOR[e];TH_FLOOR[e]=Object.assign({},keep,{[t]:st});try{return _tf.apply(this,arguments)}finally{TH_FLOOR[e]=keep}};
  const _tp=themePost;themePost=function(x,y,q){const n=ch();if(!n||!W[n])return _tp.apply(this,arguments);const s=19*q,w=W[n];
    return `<circle cx="${x}" cy="${y}" r="${s*1.05}" fill="${w.base}"/><circle cx="${x}" cy="${y}" r="${s*.5}" fill="${w.over}"/><circle cx="${x-s*.15}" cy="${y-s*.18}" r="${s*.16}" fill="#fff" opacity=".55"/>`};
  const L2=(n,bg,fr,lb,lbb,lbc)=>`html body .board.th.th2-${n}{background:${bg}!important}html body .board.th.th2-${n} .rlabel{background:${lb}!important;border-color:${lbb}!important;color:${lbc}!important}`;

  /* ---------- decorated frame per chapter: a motif along the outer rim + painted objects in the corners ---------- */
  const U=(w,h,b)=>`url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' width='${w}' height='${h}'>${b}</svg>`)}")`;
  const leaf=(x,y,r,c,k=1)=>`<path transform='translate(${x} ${y}) rotate(${r}) scale(${k})' d='M0-9L2.6-3.6 8-5.4 5.4 0 9 3.6 2.7 2.7 1.8 9 0 5.4-1.8 9-2.7 2.7-9 3.6-5.4 0-8-5.4-2.6-3.6Z' fill='${c}' stroke='#5a2a0c' stroke-width='.6'/>`;
  const web=(fl)=>U(70,70,`<g transform='${fl}' stroke='#d9e8f0' stroke-opacity='.75' fill='none' stroke-width='1'><path d='M0 0L70 8M0 0L60 34M0 0L34 60M0 0L8 70'/><path d='M14 2Q11 9 12 12Q9 11 2 14M28 3Q22 16 24 24Q16 22 3 28M44 5Q34 24 37 37Q24 34 5 44M60 7Q47 32 50 50Q32 47 7 60'/></g><circle cx='54' cy='40' r='3' fill='#1a1220' transform='${fl}'/>`);
  const lantern=(x)=>`<path d='M${x} 0V7' stroke='#5a2a0c' stroke-width='1'/><circle cx='${x}' cy='14' r='11' fill='#ffb84a' opacity='.25'/><ellipse cx='${x}' cy='14' rx='6' ry='7.5' fill='#d8323a' stroke='#6a1018' stroke-width='.8'/><path d='M${x-6} 14H${x+6}M${x} 6.5V21.5' stroke='#ffcf7a' stroke-width='.7' opacity='.8'/><rect x='${x-2.5}' y='5' width='5' height='2.5' fill='#e0a040'/><path d='M${x} 22V26' stroke='#e0a040' stroke-width='1.2'/>`;
  const bulb=(x,y,c)=>`<circle cx='${x}' cy='${y}' r='6' fill='${c}' opacity='.28'/><circle cx='${x}' cy='${y}' r='2.6' fill='#fff'/>`;
  const vine=`<path d='M0 9Q15 1 30 9T60 9' fill='none' stroke='#3f7a3a' stroke-width='2'/>`+leaf(10,5,30,'#5aa04a',.7)+leaf(42,13,200,'#6ab85a',.7)+`<circle cx='25' cy='7' r='3' fill='#f4a6c8' stroke='#b0507a' stroke-width='.6'/><circle cx='25' cy='7' r='1' fill='#ffe08a'/><circle cx='54' cy='11' r='2.4' fill='#fff' stroke='#c9a0d0' stroke-width='.6'/>`;
  const S=t=>typeof SPR!=="undefined"&&SPR[t]?`url("${SPR[t]}")`:"none";
  /* n: [rim tile top/bottom (w,h,svg), rim tile sides, corner sprites [tl,tr,bl,br] (null = none)] */
  const DECO={
    11:{corners:[web(""),web("translate(70 0) scale(-1 1)"),web("translate(0 70) scale(1 -1)"),null],cs:70,spr:[null,null,null,null]},
    12:{top:[64,16,leaf(12,8,20,"#e0702a")+leaf(36,8,-30,"#c2452a",.8)+leaf(54,9,60,"#f0a040",.75)],side:[16,64,leaf(8,12,40,"#d1873a")+leaf(8,36,-20,"#a8481e",.85)+leaf(8,54,80,"#e0a050",.7)],spr:["s_redtree","s_ashroom","s_pumpkin",null]},
    13:{top:[24,12,`<rect width='12' height='12' fill='#e8e4dc'/><rect x='12' width='12' height='12' fill='#2c2c34'/>`],side:[12,24,`<rect width='12' height='12' fill='#2c2c34'/><rect y='12' width='12' height='12' fill='#e8e4dc'/>`],spr:["s_rook","s_knight","s_bishop",null]},
    14:{top:[48,16,`<path d='M0 0H48V3Q24 20 0 3Z' fill='#8a1830'/><path d='M0 3Q24 20 48 3' fill='none' stroke='#f6d36a' stroke-width='1.5'/><circle cx='24' cy='13' r='2' fill='#f6d36a'/>`],side:[14,40,`<rect width='14' height='40' fill='#7a1428'/><path d='M4 0V40M10 0V40' stroke='#5a0c1c' stroke-width='2'/>`],spr:["s_lustre","s_harp","s_cakes",null]},
    15:{spr:["s_escales","s_ingots","s_coins",null]},
    16:{top:[30,14,bulb(15,7,"#6ad8ff")],side:[14,30,bulb(7,15,"#6ad8ff")],spr:["s_spot","s_spot","s_trophy",null]},
    17:{top:[60,18,vine],side:[18,60,`<g transform='translate(18 0) rotate(90)'>${vine}</g>`],spr:["s_herbs","s_jars","s_alembic",null]},
    18:{top:[44,28,lantern(22)],side:[16,48,`<path d='M8 0V48' stroke='#5a2a0c' stroke-width='1'/><ellipse cx='8' cy='24' rx='5' ry='6' fill='#d8323a' stroke='#6a1018' stroke-width='.7'/><circle cx='8' cy='24' r='9' fill='#ffb84a' opacity='.22'/>`],spr:["s_lantern","s_lantern","s_spice",null]},
    19:{top:[56,16,`<path d='M18 2H38' stroke='#8a5a2a' stroke-width='2'/><path d='M28 2V6' stroke='#8a5a2a' stroke-width='1.5'/>`+bulb(28,10,"#ffd27a")],spr:["s_oillamp","s_oillamp","s_vtrunk",null]},
    20:{top:[64,18,`<path d='M0 12Q8 8 16 12T32 12T48 12T64 12' fill='none' stroke='#fff' stroke-opacity='.7' stroke-width='1.2'/><ellipse cx='20' cy='9' rx='7' ry='4' fill='#5aa05a' stroke='#2f6a3a' stroke-width='.6'/><circle cx='22' cy='7' r='2' fill='#f4a6c8'/><path d='M50 16V3M53 16V6' stroke='#5f8a3a' stroke-width='1.4'/><rect x='49' y='2' width='2.5' height='5' rx='1.2' fill='#8a5a3a'/>`],side:[18,64,`<path d='M6 0Q2 8 6 16T6 32T6 48T6 64' fill='none' stroke='#fff' stroke-opacity='.7' stroke-width='1.2'/><ellipse cx='10' cy='36' rx='4' ry='6' fill='#5aa05a' stroke='#2f6a3a' stroke-width='.6'/><circle cx='9' cy='34' r='1.8' fill='#f4a6c8'/>`],spr:["s_swan","s_lily","s_fboat",null]}};
  const D=[];
  for(const n in DECO){const d=DECO[n],bg=[],cs=d.cs||36;
    const pos=["left 2px top 2px","right 2px top 2px","left 2px bottom 2px","right 2px bottom 2px"];
    (d.corners||[]).forEach((u,i)=>{if(u)bg.push(`${u} ${pos[i]}/${cs}px ${cs}px no-repeat`)});
    (d.spr||[]).forEach((t,i)=>{if(t)bg.push(`${S(t)} ${pos[i]}/34px 34px no-repeat`)});
    if(d.top){const [w,h,b]=d.top,u=U(w,h,b);bg.push(`${u} left 0 top 0/${w}px ${h}px repeat-x`,`${u} left 0 bottom 0/${w}px ${h}px repeat-x`)}
    if(d.side){const [w,h,b]=d.side,u=U(w,h,b);bg.push(`${u} left 0 top 0/${w}px ${h}px repeat-y`,`${u} right 0 top 0/${w}px ${h}px repeat-y`)}
    D.push(`html body .board.th.th2-${n}{position:relative}html body .board.th.th2-${n}>.plan{position:relative;z-index:1}html body .board.th.th2-${n}::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:0;background:${bg.join(",")}}`)}
  const st=document.createElement("style");st.textContent=[...D,
    L2(11,"radial-gradient(circle at 20% 15%,rgba(143,214,200,.18),transparent 45%),radial-gradient(circle at 85% 90%,rgba(143,214,200,.14),transparent 40%),linear-gradient(#16222b,#0e171d)","","#1b2a33","#8fd6c8","#cdeee6"),
    L2(12,"radial-gradient(circle at 10% 12%,#c2662a 0 5%,transparent 5.5%),radial-gradient(circle at 90% 10%,#e0a050 0 4%,transparent 4.5%),radial-gradient(circle at 92% 88%,#a8481e 0 5%,transparent 5.5%),radial-gradient(circle at 6% 90%,#d1873a 0 4%,transparent 4.5%),linear-gradient(#4a2a12,#341c0b)","","#fbe6c4","#7a4216","#6a3410"),
    L2(13,"linear-gradient(#24242c,#16161c)","","#141418","#d8c58a","#f3ead0"),
    L2(14,"radial-gradient(circle at 50% 0%,rgba(246,211,106,.35),transparent 55%),linear-gradient(#5a2e48,#3a1c30)","","#fff3f7","#c97a98","#7a2e50"),
    L2(15,"linear-gradient(90deg,#c9a640 0 2px,transparent 2px) 0 0/40px 40px,linear-gradient(#c9a640 0 2px,transparent 2px) 0 0/40px 40px,#173a2c","","#12241c","#e6c45a","#f6e2a0"),
    L2(16,"radial-gradient(circle at 15% 0%,rgba(106,216,255,.35),transparent 40%),radial-gradient(circle at 85% 0%,rgba(106,216,255,.3),transparent 40%),linear-gradient(#0b1424,#060b14)","","#0b1424","#6ad8ff","#c8f1ff"),
    L2(17,"radial-gradient(circle at 12% 15%,#9fd8b0 0 6%,transparent 6.5%),radial-gradient(circle at 88% 85%,#9fd8b0 0 6%,transparent 6.5%),linear-gradient(#e6f4ea,#cfe8d8)","","#ffffff","#2f5a4a","#2f5a4a"),
    L2(18,"radial-gradient(circle at 12% 20%,rgba(255,184,74,.35),transparent 18%),radial-gradient(circle at 85% 70%,rgba(255,184,74,.3),transparent 18%),linear-gradient(#1f1430,#120a1c)","","#2a1a3a","#ffb84a","#ffe2b0"),
    L2(19,"repeating-linear-gradient(90deg,#4a1e16 0 22px,#3a160f 22px 24px),#3a160f","","#f6e6c8","#d9b26a","#5a2a1a"),
    L2(20,"radial-gradient(circle at 50% 110%,rgba(255,200,150,.7),transparent 55%),linear-gradient(#a8d4f0,#f6d6c8)","","#fffaf0","#3a5a7a","#3a5a7a"),
    "html body .board.th.th2 .edge{color:#f6ecd2;text-shadow:0 1px 2px #000a}html body .board.th.th2-17 .edge,html body .board.th.th2-20 .edge{color:#3a2a2a;text-shadow:0 1px 0 #fff8}"].join("\n");
  document.head.appendChild(st);
})();
