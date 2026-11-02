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
  const st=document.createElement("style");st.textContent=[
    L2(11,"radial-gradient(circle at 20% 15%,rgba(143,214,200,.18),transparent 45%),radial-gradient(circle at 85% 90%,rgba(143,214,200,.14),transparent 40%),linear-gradient(#16222b,#0e171d)","","#1b2a33","#8fd6c8","#cdeee6"),
    L2(12,"radial-gradient(circle at 10% 12%,#c2662a 0 5%,transparent 5.5%),radial-gradient(circle at 90% 10%,#e0a050 0 4%,transparent 4.5%),radial-gradient(circle at 92% 88%,#a8481e 0 5%,transparent 5.5%),radial-gradient(circle at 6% 90%,#d1873a 0 4%,transparent 4.5%),linear-gradient(#4a2a12,#341c0b)","","#fbe6c4","#7a4216","#6a3410"),
    L2(13,"conic-gradient(#e8e4dc 25%,#26262e 0 50%,#e8e4dc 0 75%,#26262e 0) 0 0/36px 36px","","#141418","#d8c58a","#f3ead0"),
    L2(14,"radial-gradient(circle at 50% 0%,rgba(246,211,106,.35),transparent 55%),linear-gradient(#5a2e48,#3a1c30)","","#fff3f7","#c97a98","#7a2e50"),
    L2(15,"linear-gradient(90deg,#c9a640 0 2px,transparent 2px) 0 0/40px 40px,linear-gradient(#c9a640 0 2px,transparent 2px) 0 0/40px 40px,#173a2c","","#12241c","#e6c45a","#f6e2a0"),
    L2(16,"radial-gradient(circle at 15% 0%,rgba(106,216,255,.35),transparent 40%),radial-gradient(circle at 85% 0%,rgba(106,216,255,.3),transparent 40%),linear-gradient(#0b1424,#060b14)","","#0b1424","#6ad8ff","#c8f1ff"),
    L2(17,"radial-gradient(circle at 12% 15%,#9fd8b0 0 6%,transparent 6.5%),radial-gradient(circle at 88% 85%,#9fd8b0 0 6%,transparent 6.5%),linear-gradient(#e6f4ea,#cfe8d8)","","#ffffff","#2f5a4a","#2f5a4a"),
    L2(18,"radial-gradient(circle at 12% 20%,rgba(255,184,74,.35),transparent 18%),radial-gradient(circle at 85% 70%,rgba(255,184,74,.3),transparent 18%),linear-gradient(#1f1430,#120a1c)","","#2a1a3a","#ffb84a","#ffe2b0"),
    L2(19,"repeating-linear-gradient(90deg,#4a1e16 0 22px,#3a160f 22px 24px),#3a160f","","#f6e6c8","#d9b26a","#5a2a1a"),
    L2(20,"radial-gradient(circle at 50% 110%,rgba(255,200,150,.7),transparent 55%),linear-gradient(#a8d4f0,#f6d6c8)","","#fffaf0","#3a5a7a","#3a5a7a"),
    "html body .board.th.th2 .edge{color:#f6ecd2;text-shadow:0 1px 2px #000a}html body .board.th.th2-17 .edge,html body .board.th.th2-20 .edge,html body .board.th.th2-13 .edge{color:#3a2a2a;text-shadow:0 1px 0 #fff8}",
    "html body .board.th.th2-13 .edge{background:rgba(255,255,255,.75);border-radius:6px}"].join("\n");
  document.head.appendChild(st);
})();
