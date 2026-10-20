
/* ================= NIGHT MODE: the lantern ================= */
var NIGHT={on:false,i:0,x:.5,y:.5,t0:0};
function nightDone(){try{return JSON.parse(localStorage.getItem("magicoku:night")||"{}")}catch(e){return {}}}
(function(){
  const _prep=prep;prep=function(){if(NIGHT.on){const k=ci,keep=DATA[k];DATA[k]=NIGHT_DATA[NIGHT.i];try{_prep()}finally{DATA[k]=keep}}else _prep()};
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);document.body.classList.toggle("night",NIGHT.on);
    if(NIGHT.on){const t=$("#caseTitle");if(t)t.textContent=`${TX(M.level)} · ${TX(M.title)}`}};
  /* fog layer inside the plan, under the player's marks */
  function fog(){const plan=$("#plan");if(!plan)return null;let f=plan.querySelector(".nfog");
    if(!NIGHT.on||S.solved){if(f)f.remove();return null}
    if(!f){f=document.createElement("div");f.className="nfog";const mk=$("#marks");plan.insertBefore(f,mk||null)}
    return f}
  function light(){const f=fog();if(!f)return;const plan=$("#plan"),w=plan.clientWidth,cell=w*.936/N;
    f.style.setProperty("--x",(NIGHT.x*100).toFixed(2)+"%");f.style.setProperty("--y",(NIGHT.y*100).toFixed(2)+"%");f.style.setProperty("--r",Math.round(cell*1.55)+"px")}
  const _rb=renderBoard;renderBoard=function(){_rb.apply(this,arguments);light();bind()};
  function bind(){const plan=$("#plan");if(!plan||plan._nb)return;plan._nb=true;
    const mv=e=>{if(!NIGHT.on)return;const r=plan.getBoundingClientRect();NIGHT.x=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));NIGHT.y=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));light()};
    plan.addEventListener("pointermove",mv);plan.addEventListener("pointerdown",mv)}
  /* in the dark, story keywords don't light up the map */
  if(typeof kwApply==="function"){const _ka=kwApply;kwApply=function(){_ka.apply(this,arguments);if(NIGHT.on)document.querySelectorAll("#marks .mk.kwhl").forEach(e=>e.classList.remove("kwhl","kw-room","kw-obj","kw-row","kw-col","kw-person"))}}
  /* start / end */
  window.startNight=function(j,fresh_){NIGHT.on=true;NIGHT.i=j;NIGHT.x=.5;NIGHT.y=.5;$("#home").hidden=true;openCase(ci);
    if(fresh_||S.solved){S=fresh();S.hlog=[];hist=[];save()}NIGHT.t0=Date.now();render();renderStatic();light()};
  function card(){let c=$("#nightCard");if(!c){c=document.createElement("div");c.id="nightCard";c.hidden=true;document.body.appendChild(c);
      c.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const a=b.dataset.a;c.hidden=true;
        if(a==="retry")startNight(NIGHT.i,true);else if(a==="next")startNight(Math.min(NIGHT_DATA.length-1,NIGHT.i+1));else if(a==="menu"){$("#home").hidden=false;show("pNight")}else if(a==="look"){}})}return c}
  function nightWin(){const id=C.id,d=nightDone(),t=Math.round(S.time||0),h=S.hints||0,prev=d[id];
    if(!prev||h<prev.h||(h===prev.h&&t<prev.t)){d[id]={t,h,at:Date.now()};try{localStorage.setItem("magicoku:night",JSON.stringify(d))}catch(e){}}
    const K=C.killer,c=card();
    c.innerHTML=`<div class="nin"><div class="neye">🏮 ${L("La lumière est faite !","Light has been shed!","진실이 밝혀졌어요!","真相が照らし出された！")}</div>
      <div class="npor">${ava(K,{angry:true})}</div><div class="nbig">${L(`C'est ${pname(K)} !`,`It's ${pname(K)}!`,`범인은 ${pname(K)}!`,`犯人は${pname(K)}だ！`)}</div>
      <p>⏱ <b>${fmtT(t)}</b> · 💡 ${NW(h,"h")}</p>
      <div class="nacts"><button class="pill" data-a="menu">${L("Menu des nuits","Night menu","밤 목록","夜の一覧")}</button><button class="pill" data-a="look">${L("Admirer ma grille","Admire my grid","내 격자 감상하기","自分のグリッドを眺める")}</button>${NIGHT.i<NIGHT_DATA.length-1?`<button class="pill red" data-a="next">${L("Nuit suivante","Next night","다음 밤","次の夜")}</button>`:""}</div></div>`;
    c.hidden=false;light();try{play("win")}catch(e){}}
  const _sr=showReveal;showReveal=function(){if(NIGHT.on){nightWin();return}return _sr.apply(this,arguments)};
  new MutationObserver(()=>{if(NIGHT.on&&!$("#home").hidden){NIGHT.on=false;const c=$("#nightCard");if(c)c.hidden=true;document.body.classList.remove("night");try{openCase(ci)}catch(e){}}}).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
  /* home button + panel */
  const after=$("#hRush")||$("#hPlay");if(after&&!$("#hNight")){const b=document.createElement("button");b.className="hb nightb";b.id="hNight";after.after(b)}
  const home=document.querySelector(".home-in");
  if(home&&!$("#pNight")){const p=document.createElement("div");p.className="home-panel";p.id="pNight";p.hidden=true;
    p.innerHTML=`<button class="hb small back top" data-back></button><h2 id="pNightT"></h2><p class="acc-note" id="nightNote"></p><div class="rtiles" id="ntiles"></div>`;home.appendChild(p)}
  const _show=show;show=function(panel){const n=$("#pNight");if(n)n.hidden=true;if(panel==="pNight"){_show("__none__");["hMain","pLevels","pOptions","pAccount","pRank","pRush"].forEach(id=>{const e=$("#"+id);if(e)e.hidden=true});if(n)n.hidden=false;renderNight()}else _show(panel)};
  function renderNight(){const b=$("#hNight");if(b)b.textContent="🏮 "+L("Mode nuit","Night mode","나이트 모드","ナイトモード");
    const p=$("#pNight");if(!p)return;$("#pNightT").textContent="🏮 "+L("Mode nuit","Night mode","나이트 모드","ナイトモード");
    p.querySelector("[data-back]").textContent=L("← Retour","← Back","← 뒤로","← 戻る");
    $("#nightNote").innerHTML=L("Toutes les bougies se sont éteintes. Le plan est plongé dans le noir : promène ta <b>lanterne</b> (ta souris, ou ton doigt sur téléphone) pour découvrir les pièces et les objets. Tes personnages et tes croix restent toujours visibles.",
      "Every candle has gone out. The map is plunged into darkness: move your <b>lantern</b> (your mouse, or your finger on a phone) to reveal rooms and objects. Your characters and crosses always stay visible.",
      "촛불이 모두 꺼졌어요. 지도가 어둠에 잠겼으니 <b>등불</b>(마우스, 휴대폰에서는 손가락)을 움직여 방과 물건을 찾아보세요. 배치한 인물과 X 표시는 항상 보여요.",
      "ロウソクがすべて消えてしまった。見取り図は真っ暗。<b>ランタン</b>（マウス、スマホでは指）を動かして部屋や家具を照らそう。置いた人物と✕はいつでも見えます。");
    const d=nightDone();
    $("#ntiles").innerHTML=NIGHT_DATA.map((c,j)=>{const x=d[c.id];return `<button class="rtile ntile${x?" done":""}" data-nj="${j}"><b>${j+1}</b><span class="rs">${x?"🏮":"🌑"}</span><small>${x?fmtT(x.t):`${c.rooms.length}×${c.rooms.length}`}</small></button>`}).join("")}
  document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
    if(t.id==="hNight"){e.stopPropagation();show("pNight");try{play("page")}catch(_){}}
    else if(t.dataset.nj!=null){e.stopPropagation();try{play("select")}catch(_){}startNight(+t.dataset.nj)}
    else if(t.closest("#pNight")&&t.hasAttribute("data-back")){e.stopPropagation();show("hMain")}},true);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);renderNight()};
  window.addEventListener("resize",light);
  renderNight();
})();
