
/* ================= THE LIAR: one statement is false ================= */
var LIAR={on:false,i:0};
function liarDone(){try{return JSON.parse(localStorage.getItem("magicoku:liar")||"{}")}catch(e){return {}}}
function liarStory(){
  const lg=LANG,f=p=>M.people[p][1]==="f",cjk=lg==="ko"||lg==="ja";
  const T=cjk?cjkTime():crimeTime()[lg];
  const P=k=>cjk?predCJK(k[0],k[1],k[2]):pred(k[0],k[1]).replace(/, c'est certain$/,"");
  const KO=t=>t.replace(/다$/,"다고");
  const order=[...M.people.keys()].filter(p=>p!==0).sort((a,b)=>M.people[a][0].localeCompare(M.people[b][0]));
  const out=[];
  out.push(`<p class="st-open">${L(`Le drame s'est produit à <b>${T}</b>. Chaque suspect a déclaré où il se trouvait à ce moment-là… mais <b>l'un d'eux ment</b>.`,
    `The crime happened at <b>${T}</b>. Each suspect said where they were at that moment… but <b>one of them is lying</b>.`,
    `사건은 <b>${T}</b>에 일어났다. 용의자들은 그때 자신이 어디에 있었는지 진술했다… 하지만 <b>그중 한 명은 거짓말을 하고 있다</b>.`,
    `事件は<b>${T}</b>に起きた。容疑者たちはその時どこにいたかを証言した……だが、<b>そのうち一人は嘘をついている</b>。`)}</p>`);
  for(const p of order){const cl=C.clues[p]||[],n=nameHTML(p),pn=pname(p),F=f(p);
    if(!cl.length){out.push(`<p data-p="${p}">${L(`${n} refuse de dire où ${F?"elle":"il"} se trouvait.`,`${n} refuses to say where ${F?"she":"he"} was.`,`${n}${particle(pn,"은","는")} 어디에 있었는지 말하지 않으려 한다.`,`${n}はどこにいたのか話そうとしない。`)}</p>`);continue}
    const a=P([p,cl[0]]);let t=L(`${n} affirme qu'${F?"elle":"il"} ${a}.`,`${n} claims ${F?"she":"he"} ${a}.`,`${n}${particle(pn,"은","는")} ${KO(a)} 주장한다.`,`${n}は「${a}」と証言している。`);
    if(cl[1]){const b=P([p,cl[1],true]);t+=(lg==="ja"?"":" ")+L(`${F?"Elle":"Il"} ajoute qu'${F?"elle":"il"} ${b}.`,`${F?"She":"He"} adds that ${F?"she":"he"} ${b}.`,`또한 ${KO(b)} 덧붙였다.`,`さらに「${b}」とも話している。`)}
    out.push(`<p data-p="${p}">${t}</p>`)}
  const vc=C.clues[0]||[];if(vc.length){const n=nameHTML(0),pn=pname(0),a=P([0,vc[0]]);
    out.push(`<p data-p="0">${L(`Les enquêteurs ont établi que la victime, ${n}, ${a}.`,`The investigators established that the victim, ${n}, ${a}.`,`수사 결과, 피해자 ${n}${particle(pn,"은","는")} ${a}.`,`捜査の結果、被害者の${n}は${a}ことがわかっている。`)}</p>`)}
  out.push(`<p class="st-end">${L("Rappel : une seule déclaration est fausse. Toutes les autres, ainsi que les constatations des enquêteurs, sont vraies.","Remember: exactly one statement is false. All the others, and the investigators' findings, are true.","기억하세요: 거짓 진술은 단 하나뿐입니다. 나머지 진술과 수사 결과는 모두 사실입니다.","ルール：偽りの証言はひとつだけ。ほかの証言と捜査の結果はすべて本当です。")}</p>`);
  return out.join("")}
(function(){
  const _prep=prep;prep=function(){if(LIAR.on){const k=ci,keep=DATA[k];DATA[k]=LIAR_DATA[LIAR.i];try{_prep()}finally{DATA[k]=keep}}else _prep()};
  const _sh=storyHTML;storyHTML=function(){return LIAR.on?liarStory():_sh.apply(this,arguments)};
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);document.body.classList.toggle("liar",LIAR.on);
    if(LIAR.on){const t=$("#caseTitle");if(t)t.textContent=`${TX(M.level)} · ${TX(M.title)}`}};
  /* no hints: someone is lying */
  function paintHint(){const b=$("#tHint");if(!b||!LIAR.on)return;b.classList.add("nohint");b.disabled=true;
    b.innerHTML=`<span>🚫 ${L("Pas d'indice","No hints","힌트 없음","ヒントなし")}</span><small>${L("Quelqu'un ment…","Someone is lying…","누군가 거짓말을 해요…","誰かが嘘をついている……")}</small>`}
  const _r=render;render=function(){_r.apply(this,arguments);paintHint();if(LIAR.on&&S.solved)markLie()};
  const _h=hint;hint=function(){if(LIAR.on){toast(L("Pas d'indice ici : quelqu'un ment, à toi de le démasquer !","No hints here: someone is lying, it's up to you to unmask them!","여기서는 힌트를 쓸 수 없어요. 누군가 거짓말을 하고 있으니 직접 밝혀내세요!","ここではヒントは使えません。誰かが嘘をついている。自分で見抜こう！"));return}return _h.apply(this,arguments)};
  function markLie(){const el=document.querySelector(`.recit p[data-p="${C.liar}"]`);if(el)el.classList.add("lie")}
  window.startLiar=function(j,fresh_){LIAR.on=true;LIAR.i=j;$("#home").hidden=true;openCase(ci);if(fresh_||S.solved){S=fresh();S.hlog=[];hist=[];save()}render();renderStatic()};
  function card(){let c=$("#liarCard");if(!c){c=document.createElement("div");c.id="liarCard";c.hidden=true;document.body.appendChild(c);
      c.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const a=b.dataset.a;c.hidden=true;
        if(a==="next")startLiar(Math.min(LIAR_DATA.length-1,LIAR.i+1));else if(a==="menu"){$("#home").hidden=false;show("pLiar")}})}return c}
  function liarWin(){const id=C.id,d=liarDone(),t=Math.round(S.time||0),prev=d[id];
    if(!prev||t<prev.t){d[id]={t,at:Date.now()};try{localStorage.setItem("magicoku:liar",JSON.stringify(d))}catch(e){}}
    const K=C.killer,Lr=C.liar,c=card();markLie();
    const lieTxt=(document.querySelector(`.recit p[data-p="${Lr}"]`)||{}).textContent||"";
    c.innerHTML=`<div class="nin"><div class="neye">🤥 ${L("Menteur démasqué !","Liar unmasked!","거짓말쟁이를 찾았어요!","嘘つきを見抜いた！")}</div>
      <div class="lpair"><div><div class="npor">${ava(Lr)}</div><small>${L("Le menteur","The liar","거짓말쟁이","嘘つき")}</small><b>${pname(Lr)}</b></div><div><div class="npor kill">${ava(K,{angry:true})}</div><small>${L("Le coupable","The culprit","범인","犯人")}</small><b>${pname(K)}</b></div></div>
      <p class="lq">« ${lieTxt} »</p><p>⏱ <b>${fmtT(t)}</b> · 🎯 ${NW(Math.max(1,S.attempts||1),"a")}</p>
      <div class="nacts"><button class="pill" data-a="menu">${L("Menu des mensonges","Lies menu","거짓말 목록","嘘の一覧")}</button><button class="pill" data-a="look">${L("Admirer ma grille","Admire my grid","내 격자 감상하기","自分のグリッドを眺める")}</button>${LIAR.i<LIAR_DATA.length-1?`<button class="pill red" data-a="next">${L("Mensonge suivant","Next lie","다음 거짓말","次の嘘")}</button>`:""}</div></div>`;
    c.hidden=false;try{play("win")}catch(e){}}
  const _sr=showReveal;showReveal=function(){if(LIAR.on){liarWin();return}return _sr.apply(this,arguments)};
  new MutationObserver(()=>{if(LIAR.on&&!$("#home").hidden){LIAR.on=false;const c=$("#liarCard");if(c)c.hidden=true;document.body.classList.remove("liar");try{openCase(ci)}catch(e){}}}).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
  /* home button + panel */
  const after=$("#hNight")||$("#hRush")||$("#hPlay");if(after&&!$("#hLiar")){const b=document.createElement("button");b.className="hb liarb";b.id="hLiar";after.after(b)}
  const home=document.querySelector(".home-in");
  if(home&&!$("#pLiar")){const p=document.createElement("div");p.className="home-panel";p.id="pLiar";p.hidden=true;
    p.innerHTML=`<button class="hb small back top" data-back></button><h2 id="pLiarT"></h2><p class="acc-note" id="liarNote"></p><div class="rtiles" id="ltiles"></div>`;home.appendChild(p)}
  const _show=show;show=function(panel){const n=$("#pLiar");if(n)n.hidden=true;if(panel==="pLiar"){_show("__none__");["hMain","pLevels","pOptions","pAccount","pRank","pRush","pNight"].forEach(id=>{const e=$("#"+id);if(e)e.hidden=true});if(n)n.hidden=false;renderLiar()}else _show(panel)};
  function renderLiar(){const b=$("#hLiar");if(b)b.textContent="🤥 "+L("Le Menteur","The Liar","거짓말쟁이","嘘つき");
    const p=$("#pLiar");if(!p)return;$("#pLiarT").textContent="🤥 "+L("Le Menteur","The Liar","거짓말쟁이","嘘つき");
    p.querySelector("[data-back]").textContent=L("← Retour","← Back","← 뒤로","← 戻る");
    $("#liarNote").innerHTML=L("Dans ces enquêtes, <b>un suspect ment</b> : une seule de ses déclarations est fausse, toutes les autres sont vraies. Trouve la seule disposition où tout colle… sauf un mensonge. Pas d'indice !",
      "In these cases, <b>one suspect is lying</b>: exactly one statement is false, all the others are true. Find the only arrangement where everything fits… except one lie. No hints!",
      "이 사건들에서는 <b>용의자 한 명이 거짓말을 해요</b>. 진술 중 단 하나만 거짓이고 나머지는 모두 사실이에요. 거짓말 하나를 빼고 모든 것이 들어맞는 유일한 배치를 찾으세요. 힌트는 없어요!",
      "この事件では<b>容疑者の一人が嘘をついている</b>。偽りの証言はひとつだけで、ほかはすべて本当。嘘ひとつを除いてすべてが合う、ただひとつの配置を見つけよう。ヒントはなし！");
    const d=liarDone();
    $("#ltiles").innerHTML=LIAR_DATA.map((c,j)=>{const x=d[c.id];return `<button class="rtile ltile${x?" done":""}" data-lj="${j}"><b>${j+1}</b><span class="rs">${x?"🤥":"❔"}</span><small>${x?fmtT(x.t):`${c.rooms.length}×${c.rooms.length}`}</small></button>`}).join("")}
  document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
    if(t.id==="hLiar"){e.stopPropagation();show("pLiar");try{play("page")}catch(_){}}
    else if(t.dataset.lj!=null){e.stopPropagation();try{play("select")}catch(_){}startLiar(+t.dataset.lj)}
    else if(t.closest("#pLiar")&&t.hasAttribute("data-back")){e.stopPropagation();show("hMain")}},true);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);renderLiar()};
  renderLiar();
})();
