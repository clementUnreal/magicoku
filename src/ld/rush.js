
/* ================= TIME TRIAL ("Défi chrono") ================= */
var RUSH={on:false,i:0,left:60,total:60,done:false,started:false,lastBeat:0,lastTick:61};
function rushBest(){try{return JSON.parse(localStorage.getItem("magicoku:rush")||"{}")}catch(e){return {}}}
function rushStars(left){return left>=30?3:left>=15?2:1}
(function(){
  /* --- load the rush case through the normal pipeline --- */
  const _prep=prep;prep=function(){if(RUSH.on){const k=ci,keep=DATA[k];DATA[k]=RUSH_DATA[RUSH.i];try{_prep()}finally{DATA[k]=keep}}else _prep()};
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);document.body.classList.toggle("rush",RUSH.on);
    if(RUSH.on){const t=$("#caseTitle");if(t)t.textContent=`${TX(M.level)} · ${TX(M.title)}`}};
  /* --- UI bits --- */
  function bar(){let b=$("#rushBar");const bd=$("#board");if(!bd)return null;
    if(!b){b=document.createElement("div");b.id="rushBar";b.innerHTML=`<div class="rc"><div class="wax"><span class="wick"></span><span class="flame"></span></div></div><div class="rt"></div>`;}
    if(b.nextElementSibling!==($("#hintBox")||bd))bd.parentNode.insertBefore(b,$("#hintBox")||bd);return b}
  function vig(){let v=$("#rushVig");if(!v){v=document.createElement("div");v.id="rushVig";document.body.appendChild(v)}return v}
  function fmtS(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
  function paint(){const b=bar(),v=vig();if(!RUSH.on){if(b)b.hidden=true;v.hidden=true;return}
    b.hidden=false;v.hidden=false;const f=Math.max(0,RUSH.left/RUSH.total);
    b.querySelector(".wax").style.width=(6+f*94)+"%";b.querySelector(".rt").textContent=fmtS(RUSH.left);
    b.classList.toggle("warn",RUSH.left<=20);b.classList.toggle("crit",RUSH.left<=10);
    v.style.setProperty("--d",(0.08+(1-f)*0.62).toFixed(3));v.classList.toggle("crit",RUSH.left<=10&&!RUSH.done)}
  function beat(){try{const c=ac();if(!c)return;bloop(70,0,.22,1.2,.16);bloop(62,.17,.16,1.15,.18)}catch(e){}}
  function tick(){try{bloop(1500,0,.05,.85,.05)}catch(e){}}
  let last=performance.now();
  setInterval(()=>{const now=performance.now(),dt=(now-last)/1000;last=now;if(!RUSH.on||RUSH.done||!RUSH.started)return;
    if(document.hidden||!$("#home").hidden||(typeof verdictBusy!=="undefined"&&verdictBusy)||document.querySelector(".modal:not([hidden])")||!$("#tuto").hidden)return;
    RUSH.left-=dt;
    const sec=Math.ceil(RUSH.left);
    if(RUSH.left<=20&&now-RUSH.lastBeat>(RUSH.left<=10?620:900)){RUSH.lastBeat=now;beat()}
    if(sec<=10&&sec<RUSH.lastTick){RUSH.lastTick=sec;tick()}
    if(RUSH.left<=0){RUSH.left=0;paint();rushLose();return}
    paint()},100);
  /* --- start / end --- */
  window.startRush=function(j){RUSH.official=!rushBest()[RUSH_DATA[j].id];RUSH.on=true;RUSH.i=j;RUSH.left=RUSH.total;RUSH.done=false;RUSH.started=false;RUSH.lastTick=61;RUSH.lastBeat=0;
    $("#home").hidden=true;openCase(ci);S=fresh();S.hlog=[];hist=[];save();render();renderStatic();paint();
    const c=card();c.className="rcard ready";c.innerHTML=`<div class="rin"><div class="rmode ${RUSH.official?"off":"prac"}">${RUSH.official?L("🏅 Tentative officielle","🏅 Official attempt","🏅 공식 도전","🏅 本番"):L("🎯 Entraînement","🎯 Practice","🎯 연습","🎯 練習")}</div><div class="rbig">${L("Prêt ?","Ready?","준비됐나요?","準備はいい？")}</div><p>${RUSH.official?L("Une seule chance : ce score sera ton score définitif. Si tu quittes en cours de route, le défi est perdu. Chaque indice coûte 10 secondes.","One chance only: this will be your final score. If you leave midway, the challenge is lost. Each hint costs 10 seconds.","기회는 한 번뿐! 이 점수가 최종 점수가 돼요. 도중에 나가면 챌린지는 실패로 처리돼요. 힌트 하나에 10초가 줄어요.","チャンスは一度だけ。このスコアが最終スコアになります。途中でやめると失敗になります。ヒントは一回につき10秒減ります。"):L("Ton score officiel est déjà enregistré. Cette partie ne le changera pas.","Your official score is already recorded. This run won't change it.","공식 점수는 이미 기록되었어요. 이번 판은 점수에 영향을 주지 않아요.","本番のスコアはもう記録されています。今回のプレイでは変わりません。")}</p><div class="rcount">3</div></div>`;c.hidden=false;
    let n=3;const go=()=>{try{bell(N_.C5+n*90,0,.25,.08)}catch(e){}c.querySelector(".rcount").textContent=n||L("Go !","Go!","시작!","スタート！");
      if(n===0){setTimeout(()=>{c.hidden=true;RUSH.started=true;last=performance.now();if(RUSH.official){const b=rushBest();b[C.id]={left:0,stars:0,lost:true,at:Date.now()};try{localStorage.setItem("magicoku:rush",JSON.stringify(b))}catch(e){}}},450);return}n--;setTimeout(go,700)};go()};
  function card(){let c=$("#rushCard");if(!c){c=document.createElement("div");c.id="rushCard";c.hidden=true;document.body.appendChild(c);
      c.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const a=b.dataset.a;
        if(a==="retry"){c.hidden=true;startRush(RUSH.i)}else if(a==="next"){c.hidden=true;startRush(Math.min(RUSH_DATA.length-1,RUSH.i+1))}
        else if(a==="menu"){c.hidden=true;$("#home").hidden=false;show("pRush")}})}return c}
  function endButtons(win){return `<div class="racts"><button class="pill" data-a="menu">${L("Menu des défis","Challenges","챌린지 목록","チャレンジ一覧")}</button><button class="pill" data-a="retry">${L("S'entraîner","Practice","연습하기","練習する")}</button>${win&&RUSH.i<RUSH_DATA.length-1?`<button class="pill red" data-a="next">${L("Défi suivant","Next challenge","다음 챌린지","次のチャレンジ")}</button>`:""}</div>`}
  window.rushOff=function(x){if(!x)return "";return `<p class="roff">🎯 ${L("Entraînement : ton score officiel reste","Practice: your official score stays","연습: 공식 점수는 그대로예요","練習：本番のスコアはそのまま")} ${x.lost?L("<b>échoué</b>","<b>failed</b>","<b>실패</b>","<b>失敗</b>"):`<b>${"★".repeat(x.stars)}</b> · ${fmtS(x.left)}`}</p>`};
  window.rushWin=function(){RUSH.done=true;paint();const used=Math.round(RUSH.total-RUSH.left),st=rushStars(RUSH.left),id=C.id;
    const best=rushBest(),prev=best[id];if(RUSH.official){best[id]={left:Math.round(RUSH.left*10)/10,stars:st,at:Date.now()};try{localStorage.setItem("magicoku:rush",JSON.stringify(best))}catch(e){}}const offTxt=RUSH.official?"":rushOff(prev);
    const K=C.killer,v=pname(0),fv=M.people[0][1]==="f";
    const c=card();c.className="rcard win";c.innerHTML=`<div class="rin"><div class="reye">🧪 ${L("Antidote trouvé !","Antidote found!","해독제를 찾았어요!","解毒剤を手に入れた！")}</div>
      <div class="rpor">${ava(0,{victim:true})}</div><div class="rbig">${L(`${v} est ${fv?"sauvée":"sauvé"} !`,`${v} is saved!`,`${pp(v,"이","가")} 살았어요!`,`${v}は助かった！`)}</div>
      <p>${L(`Le coupable était <b>${pname(K)}</b>.`,`The culprit was <b>${pname(K)}</b>.`,`범인은 <b>${pname(K)}</b>${particle(pname(K),"이었어요","였어요")}.`,`犯人は<b>${pname(K)}</b>だった。`)}</p>
      <div class="rstars">${[1,2,3].map(k=>`<span class="${k<=st?"on":""}">★</span>`).join("")}</div>
      <p class="rstat">⏱ ${L(`Temps restant : <b>${fmtS(RUSH.left)}</b>`,`Time left: <b>${fmtS(RUSH.left)}</b>`,`남은 시간: <b>${fmtS(RUSH.left)}</b>`,`残り時間：<b>${fmtS(RUSH.left)}</b>`)}</p>${offTxt}
      ${endButtons(true)}</div>`;c.hidden=false;try{play("win")}catch(e){}};
  window.rushLose=function(){RUSH.done=true;const K=C.killer,[kr,kc]=C.solution[K];
    const c=card();c.className="rcard lose";c.innerHTML=`<div class="rin"><div class="reye">🕯️ ${L("Trop tard…","Too late…","너무 늦었어요…","間に合わなかった……")}</div>
      <div class="rpor">${ava(K,{angry:true})}</div><div class="rbig">${L("Le poison a fait effet.","The poison took effect.","독이 퍼지고 말았어요.","毒が回ってしまった。")}</div>
      <p>${L(`Le coupable était <b>${pname(K)}</b>, en ${posn(kr,kc)}.`,`The culprit was <b>${pname(K)}</b>, on ${posn(kr,kc)}.`,`범인은 ${posn(kr,kc)}에 있던 <b>${pname(K)}</b>${particle(pname(K),"이었어요","였어요")}.`,`犯人は${posn(kr,kc)}にいた<b>${pname(K)}</b>だった。`)}</p>
      ${RUSH.official?"":rushOff(rushBest()[C.id])}${endButtons(false)}</div>`;c.hidden=false;try{bell(N_.E5,0,.6,.08,.8);bell(N_.C5,.3,.9,.08,.75);bell(N_.A4,.7,1.4,.08,.7)}catch(e){}};
  /* win hook (outermost wrapper) */
  const _sr=showReveal;showReveal=function(){if(RUSH.on){rushWin();return}return _sr.apply(this,arguments)};
  /* hint costs time */
  const _h=hint;hint=function(){if(RUSH.on){if(RUSH.done||!RUSH.started)return;RUSH.left=Math.max(0,RUSH.left-10);paint();if(RUSH.left<=0){const f=document.createElement("div");f.className="rpen";f.textContent="−10 s";const b=$("#rushBar");if(b){b.appendChild(f);setTimeout(()=>f.remove(),1200)}rushLose();return}
      const f=document.createElement("div");f.className="rpen";f.textContent="−10 s";const b=$("#rushBar");if(b){b.appendChild(f);setTimeout(()=>f.remove(),1200)}}
    return _h.apply(this,arguments)};
  /* leaving the game ends the run */
  new MutationObserver(()=>{if(RUSH.on&&!$("#home").hidden){RUSH.on=false;RUSH.started=false;const c=$("#rushCard");if(c)c.hidden=true;document.body.classList.remove("rush");paint();try{openCase(ci)}catch(e){}}}).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
  /* --- home: button + panel --- */
  const nav=$("#hMain"),play_=$("#hPlay");
  if(nav&&!$("#hRush")){const b=document.createElement("button");b.className="hb rushb";b.id="hRush";play_.after(b);}
  const home=document.querySelector(".home-in");
  if(home&&!$("#pRush")){const p=document.createElement("div");p.className="home-panel";p.id="pRush";p.hidden=true;
    p.innerHTML=`<button class="hb small back top" data-back></button><h2 id="pRushT"></h2><p class="acc-note" id="rushNote"></p><div class="rtiles" id="rtiles"></div>`;home.appendChild(p)}
  const _show=show;show=function(panel){const r=$("#pRush");if(r)r.hidden=panel!=="pRush";_show(panel==="pRush"?"__none__":panel);if(panel==="pRush"){["hMain","pLevels","pOptions","pAccount","pRank"].forEach(id=>{const e=$("#"+id);if(e)e.hidden=true});if(r)r.hidden=false;renderRush()}};
  function renderRush(){const b=$("#hRush");if(b)b.textContent="⏳ "+L("Défi chrono","Time trial","타임 챌린지","タイムチャレンジ");
    const p=$("#pRush");if(!p)return;$("#pRushT").textContent="⏳ "+L("Défi chrono","Time trial","타임 챌린지","タイムチャレンジ");
    p.querySelector("[data-back]").textContent=L("← Retour","← Back","← 뒤로","← 戻る");
    $("#rushNote").innerHTML=L("Une victime a bu un poison lent. Tu as <b>1 minute</b> pour démasquer le coupable et obtenir l'antidote. Chaque indice coûte 10 secondes. <b>Seule ta première tentative compte</b> : ensuite, tu peux rejouer pour t'entraîner.","A victim has drunk a slow poison. You have <b>1 minute</b> to unmask the culprit and get the antidote. Each hint costs 10 seconds. <b>Only your first attempt counts</b>: after that you can replay for practice.","피해자가 천천히 퍼지는 독을 마셨어요. <b>1분</b> 안에 범인을 밝혀 해독제를 구하세요. 힌트 하나에 10초가 줄어요. <b>첫 번째 도전만 기록돼요</b>. 그 뒤로는 연습으로 다시 할 수 있어요.","被害者が遅効性の毒を飲んでしまった。<b>一分</b>以内に犯人を暴いて解毒剤を手に入れよう。ヒントは一回につき10秒減ります。<b>記録されるのは最初の挑戦だけ</b>。そのあとは練習として何度でも遊べます。");
    const best=rushBest();
    $("#rtiles").innerHTML=RUSH_DATA.map((c,j)=>{const x=best[c.id];return `<button class="rtile${x?(x.lost?" lost":" done"):""}" data-rj="${j}"><b>${j+1}</b><span class="rs">${[1,2,3].map(k=>`<i class="${x&&k<=x.stars?"on":""}">★</i>`).join("")}</span><small>${x?(x.lost?L("échoué","failed","실패","失敗"):fmtS(x.left)):`${c.rooms.length}×${c.rooms.length}`}</small></button>`}).join("")}
  document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
    if(t.id==="hRush"){e.stopPropagation();show("pRush");try{play("page")}catch(_){}}
    else if(t.dataset.rj!=null){e.stopPropagation();try{play("select")}catch(_){}startRush(+t.dataset.rj)}
    else if(t.closest("#pRush")&&t.hasAttribute("data-back")){e.stopPropagation();show("hMain")}},true);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);renderRush()};
  renderRush();
})();
