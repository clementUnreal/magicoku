
/* ================= Level selection screen (chapters sidebar + level cards with map thumbnails) ================= */
var LVV={ch:null,sel:null};
var CH_TAG={
 disc:[["Tes dix premières enquêtes à l'Académie.","Your first ten cases at the Academy.","아카데미에서의 첫 열 개의 사건.","アカデミーでの最初の十の事件。"],
  ["L'enquête se complique : plus de suspects, plus de pièces.","Things get trickier: more suspects, more rooms.","용의자도 방도 늘어나며 사건이 복잡해져요.","容疑者も部屋も増えて、事件はさらに複雑に。"],
  ["Les dix enquêtes les plus redoutables. Sans indice !","The ten toughest cases. No hints!","가장 어려운 열 개의 사건. 힌트 없이!","最も手ごわい十の事件。ヒントなし！"]],
 story:[["Dix enquêtes au cœur des bois enchantés.","Ten cases deep in the enchanted woods.","마법의 숲 한가운데서 펼쳐지는 열 개의 사건.","魔法の森の奥で起きる十の事件。"],
  ["Dix enquêtes entre les quais et la vapeur.","Ten cases between the platforms and the steam.","승강장과 증기 사이에서 펼쳐지는 열 개의 사건.","ホームと蒸気のあいだで起きる十の事件。"],
  ["Dix enquêtes sous des tonnes d'or.","Ten cases beneath tons of gold.","산더미 같은 금 아래에서 펼쳐지는 열 개의 사건.","山のような金貨の下で起きる十の事件。"],
  ["Dix enquêtes entre les échoppes enchantées.","Ten cases among the enchanted shops.","마법 가게들 사이에서 펼쳐지는 열 개의 사건.","魔法の店が並ぶ小路で起きる十の事件。"],
  ["Dix enquêtes sous la neige et les étoiles.","Ten cases under the snow and the stars.","눈과 별 아래에서 펼쳐지는 열 개의 사건.","雪と星の下で起きる十の事件。"],
  ["Dix enquêtes au bord des eaux profondes.","Ten cases on the edge of deep waters.","깊은 물가에서 펼쳐지는 열 개의 사건.","深い湖のほとりで起きる十の事件。"],
  ["Dix enquêtes dans la clameur des tribunes.","Ten cases amid the roar of the stands.","관중의 함성 속에서 펼쳐지는 열 개의 사건.","観客の歓声の中で起きる十の事件。"],
  ["Dix enquêtes entre potions et remèdes.","Ten cases among potions and remedies.","물약과 치료약 사이에서 펼쳐지는 열 개의 사건.","魔法薬と治療薬のあいだで起きる十の事件。"],
  ["Dix enquêtes dans les couloirs du pouvoir.","Ten cases in the corridors of power.","권력의 복도에서 펼쳐지는 열 개의 사건.","権力の廊下で起きる十の事件。"],
  ["Dix enquêtes au bout de la brume.","Ten cases at the end of the mist.","안개 끝에서 펼쳐지는 열 개의 사건.","霧の果てで起きる十の事件。"]]};
var CH_ICON={disc:["book","cauldron","candle"],story:["tree","clock","gold","stall","snowman","anchor","broomrack","medcab","fountain","gargoyle"]};
(function(){
  const DIFF=[["Facile","Easy","쉬움","やさしい"],["Moyen","Medium","보통","ふつう"],["Difficile","Hard","어려움","むずかしい"],["Expert","Expert","전문가","エキスパート"]];
  const tiers=()=>LVMODE==="story"?[...Array(10).keys()].map(k=>k+3):[0,1,2];
  const idxOf=t=>DATA.map((c,i)=>i).filter(i=>tierOf(i)===t);
  const diffOf=(t,k)=>k>=10?3:t<3?t:(k<3?0:k<8?1:2);
  function chName(t){const full=TX(CHAPTERS[t]);const p=full.split(/ · |・/);return {num:p[0],name:p.slice(1).join(" · ")||full}}
  function thumb(i){const c=DATA[i],m=META[c.id],n=c.rooms.length,P=100/n,env=m&&m.env,TW=(env&&typeof TH_WALL!=="undefined"&&TH_WALL[env])||null;
    /* floors: same textures as the real board (story chapters), soft checker + light texture otherwise */
    const save=M;let cells="";try{M=m;
      for(let r=0;r<n;r++)for(let q=0;q<n;q++){const k=c.rooms[r][q];if(k==="."){cells+=`<i style="background:#1d1424"></i>`;continue}
        let bg=null;try{bg=typeof themeFloor==="function"?themeFloor(k,r,q):null}catch(_){}
        if(!bg){const f=((m.floors||FLOORS)[k]||["#ccc","#ddd"]),odd=(r+q)%2,b0=odd?f[1]:f[0];bg=`radial-gradient(circle at 30% 30%,${shade(b0,1.08)} 0 2px,transparent 2.5px),radial-gradient(circle at 72% 68%,${shade(b0,.9)} 0 1.5px,transparent 2px),${b0}`}
        cells+=`<i style="background:${bg}"></i>`}}finally{M=save}
    /* objects with a soft shadow */
    let objs="";(c.objs||[]).forEach(([t,r,q,h,w])=>{if(!SPR[t])return;h=h||1;w=w||1;
      objs+=`<img src="${SPR[t]}" alt="" style="left:${q*P+P*w*.04}%;top:${r*P+P*h*.0}%;width:${P*w*.92}%;height:${P*h*.94}%">`});
    /* walls: dark base + chapter-coloured top line, posts where walls meet */
    let w="";const pts=new Map();const pt=(x,y)=>{const key=x+","+y;pts.set(key,(pts.get(key)||0)+1)};
    for(let r=0;r<n;r++)for(let q=0;q<n;q++){const k=c.rooms[r][q];
      if(r+1<n&&c.rooms[r+1][q]!==k){w+=`M${q*P} ${(r+1)*P}h${P}`;pt(q,r+1);pt(q+1,r+1)}
      if(q+1<n&&c.rooms[r][q+1]!==k){w+=`M${(q+1)*P} ${r*P}v${P}`;pt(q+1,r);pt(q+1,r+1)}}
    const base=TW?TW.base:"#3a2430",over=TW?TW.over:"#8a6a52",sw=Math.max(2.2,9/n);
    let posts="";const sv=M;try{M=m;for(const [key,v] of pts){const [x,y]=key.split(",").map(Number);if(!(v>=2||x===0||y===0||x===n||y===n))continue;
      let tp=null;try{tp=typeof themePost==="function"?themePost(x*P,y*P,sw*.95/19):null}catch(_){}
      posts+=tp||`<rect x="${x*P-sw*.75}" y="${y*P-sw*.75}" width="${sw*1.5}" height="${sw*1.5}" rx="${sw*.35}" fill="${base}"/><rect x="${x*P-sw*.45}" y="${y*P-sw*.6}" width="${sw*.9}" height="${sw*.55}" rx="${sw*.2}" fill="${over}" opacity=".9"/>`}}finally{M=sv}
    const dash=TW&&TW.dash?TW.dash.split(" ").map(x=>(+x*P/55).toFixed(2)).join(" "):"",cap=TW?TW.cap:"round",ow=TW?Math.max(.3,TW.ow):.38;
    const svg=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${w}" stroke="#0007" stroke-width="${sw*1.25}" fill="none" transform="translate(0 ${sw*.35})"/><path d="${w}" stroke="${base}" stroke-width="${sw}" fill="none" stroke-linecap="square"/><path d="${w}" stroke="${over}" stroke-width="${sw*ow}" fill="none" stroke-linecap="${cap}"${dash?` stroke-dasharray="${dash}"`:""} opacity=".95"/>${posts}</svg>`;
    return `<span class="tb2${env?" e-"+env:""}" style="--n:${n};--wb:${base};--wo:${over}"><span class="tbg">${cells}</span>${svg}<span class="tbo">${objs}</span><span class="tbl"></span></span>`}
  function ensure(){let v=$("#lvView");if(v)return v;v=document.createElement("div");v.id="lvView";v.hidden=true;$("#home").appendChild(v);
    v.addEventListener("click",e=>{const t=e.target.closest("[data-ch],[data-lv],[data-act]");if(!t)return;
      if(t.dataset.ch!=null){const ch=+t.dataset.ch;if(!chOpen(ch)){try{play("forbid")}catch(_){}toast(L("Termine le chapitre précédent pour ouvrir celui-ci.","Finish the previous chapter to open this one.","이전 장을 끝내면 이 장이 열려요.","前の章をクリアすると、この章が解放されます。"));return}LVV.ch=ch;LVV.sel=null;try{play("page")}catch(_){}render();return}
      if(t.dataset.lv!=null){const i=+t.dataset.lv;if(!unlocked(i)){try{play("forbid")}catch(_){}toast(L("Résous d'abord le niveau précédent.","Solve the previous level first.","먼저 이전 레벨을 해결하세요.","先に前のレベルを解いてください。"));return}
        if(LVV.sel===i){go(i);return}LVV.sel=i;try{play("select")}catch(_){}render();return}
      if(t.dataset.act==="back"){show("hMain");try{play("page")}catch(_){}}
      if(t.dataset.act==="play"&&LVV.sel!=null)go(LVV.sel)});return v}
  function chOpen(t){const ix=idxOf(t);return ix.length&&unlocked(ix[0])}
  function go(i){$("#home").hidden=true;openCase(i);let seen=null;try{seen=localStorage.getItem("magicoku:tuto")}catch(_){}if(!seen)setTimeout(()=>tuto(0),400)}
  function pickDefaults(enter){const ts=tiers();if(LVV.ch==null||!ts.includes(LVV.ch)||(enter&&idxOf(LVV.ch).every(lvlSolved))){LVV.ch=ts.find(t=>chOpen(t)&&idxOf(t).some(i=>!lvlSolved(i)))??ts.filter(chOpen).pop()??ts[0];LVV.sel=null}
    const ix=idxOf(LVV.ch);if(LVV.sel==null||!ix.includes(LVV.sel)||(enter&&lvlSolved(LVV.sel)&&ix.some(i=>unlocked(i)&&!lvlSolved(i))))LVV.sel=ix.find(i=>unlocked(i)&&!lvlSolved(i))??null}
  function render(enter){const v=ensure();pickDefaults(enter);const ts=tiers(),mode=LVMODE==="story"?"story":"disc",t=LVV.ch,ix=idxOf(t),pos=ts.indexOf(t);
    const done=ix.filter(lvlSolved).length,cn=chName(t);
    const side=ts.map((tt,k)=>{const c=chName(tt),open=chOpen(tt),all=idxOf(tt).every(lvlSolved);return `<button class="lvch${tt===t?" on":""}${open?"":" locked"}" data-ch="${tt}"><span class="ci"><img src="${SPR[CH_ICON[mode][k]]}" alt=""></span><span class="ct"><b>${c.num.replace(/^(Chapitre|Chapter) /,"")}</b> · ${c.name}</span>${open?(all?`<span class="cs">✓</span>`:`<span class="cs">›</span>`):`<span class="cs">🔒</span>`}</button>`}).join("");
    const cards=ix.map((i,k)=>{const ex=k>=10,ok=lvlSolved(i),u=unlocked(i),d=diffOf(t,k),sz=DATA[i].rooms.length;
      return `<button class="lvc${ex?" expert":""}${ok?" done":""}${u?"":" locked"}${LVV.sel===i?" sel":""}" data-lv="${i}"><span class="lvh"><b>${k>=10?"★ "+L("Expert","Expert","전문가","エキスパート"):L("Niveau","Level","레벨","レベル")+" "+(k+1)}</b>${ok?`<i class="ok">✓</i>`:u?"":`<i class="lk">🔒</i>`}</span><span class="lvt">${thumb(i)}</span><span class="lvn">${TX(META[DATA[i].id].title)}</span><span class="lvs">${sz} × ${sz}</span><span class="lvd d${d}">${TX(DIFF[d])}</span>${LVV.sel===i?`<span class="lvp">${L("À jouer","Up next","플레이","プレイ")}</span>`:""}</button>`}).join("");
    const legend=mode==="story"?`<div class="lvleg"><span><i class="d0"></i>${L("Faciles 1–3","Easy 1–3","쉬움 1~3","やさしい 1〜3")}</span><span><i class="d1"></i>${L("Moyens 4–8","Medium 4–8","보통 4~8","ふつう 4〜8")}</span><span><i class="d2"></i>${L("Difficiles 9–10","Hard 9–10","어려움 9~10","むずかしい 9〜10")}</span><span><i class="d3"></i>${L("Expert 11","Expert 11","전문가 11","エキスパート 11")}</span></div>`:`<div class="lvleg"></div>`;
    const title=mode==="story"?"📖 "+L("Mode histoire","Story mode","스토리 모드","ストーリーモード"):"🧭 "+L("Mode découverte","Discovery mode","디스커버리 모드","ディスカバリーモード");
    const k=LVV.sel!=null?ix.indexOf(LVV.sel)+1:0;
    v.className="lvv lvv-"+mode+(mode==="story"?" env-"+(META[DATA[ix[0]].id].env||""):"");
    v.innerHTML=`<header class="lvtop"><h1>${title}</h1></header>
      <div class="lvbody"><aside class="lvside"><h2>${L("Chapitres","Chapters","장","章")}</h2>${side}</aside>
      <section class="lvmain"><div class="lvhead"><div><small>${mode==="story"?L("Histoire","Story","스토리","ストーリー"):L("Découverte","Discovery","디스커버리","ディスカバリー")} / ${cn.num}</small><h2>${cn.name}</h2><p>${TX(CH_TAG[mode][pos]||["","","",""])}</p></div>
        <div class="lvprog"><span><b>${done} / ${ix.length}</b> ${L("enquêtes résolues","cases solved","사건 해결","件解決")}</span><i><em style="width:${100*done/ix.length}%"></em></i></div></div>
        <div class="lvgrid">${cards}</div></section></div>
      <footer class="lvfoot"><button class="hb small" data-act="back">← ${L("Retour","Back","뒤로","戻る")}</button>${legend}<button class="hb big lvgo" data-act="play"${LVV.sel==null?" disabled":""}>${LVV.sel==null?(done===ix.length?L("Chapitre terminé ✓","Chapter complete ✓","장 완료 ✓","章クリア ✓"):"—"):(k>=11?L("Jouer le niveau expert ★","Play the expert level ★","전문가 레벨 플레이 ★","エキスパートをプレイ ★"):L(`Jouer le niveau ${k}`,`Play level ${k}`,`${k}레벨 플레이`,`レベル${k}をプレイ`))} ›</button></footer>`}
  window.renderLevelView=render;
  const _show=show;show=function(panel){const v=ensure();if(panel==="pLevels"){_show("__none__");["hMain","pLevels","pOptions","pAccount","pRank","pRush","pNight","pLiar"].forEach(id=>{const e=$("#"+id);if(e)e.hidden=true});
      v.hidden=false;document.querySelector(".home-in").classList.add("lvmode");render(true);$("#home").scrollTop=0;return}
    v.hidden=true;document.querySelector(".home-in").classList.remove("lvmode");_show(panel)};
  const _oc=openCase;openCase=function(i){const r=_oc.apply(this,arguments);if(typeof i==="number"&&i>=0&&i<DATA.length){LVV.ch=tierOf(i);LVV.sel=i}return r};
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);const v=$("#lvView");if(v&&!v.hidden)render()};
})();
