
/* ================= CO-OP: "Enquête à plusieurs" =================
   A room (4-letter code) gathers 3+ detectives. Everybody presses "Ready", then the case starts.
   - Each detective only holds SOME of the testimonies (the others show who holds them).
   - Each detective wears a lens: 🗺️ Cartographer (sees rooms and walls, no objects)
     or 🔍 Inspector (sees objects, no rooms). Testimonies talk about both, so the team
     has to describe the map to each other, not just read clues aloud.
   - The board is shared (placements and crosses are synced), there is a room chat,
     and the team accuses the culprit together. */
var COOP={on:false,code:null,room:null,play:false,lvl:null,me:null,idx:-1,lens:null,last:null,busy:0,unread:0,seenMsgs:0,shownWin:0,timer:null};
(function(){
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const acc=()=>ACC.profile&&ACC.profile.pseudo&&ACC.profile.pid&&ACC.profile.ptok?ACC.profile:null;
  const meK=()=>String((acc()||{}).pseudo||"").trim().toLowerCase();
  const isAdm=()=>meK()==="clemonchichi";
  const LENS={rooms:{ic:"🗺️",n:["Cartographe","Cartographer","지도 제작자","地図係"],d:["Tu vois les pièces et les murs, mais aucun objet.","You see the rooms and walls, but no objects.","방과 벽은 보이지만 물건은 보이지 않아요.","部屋と壁は見えるけど、物は見えない。"]},
    objs:{ic:"🔍",n:["Inspecteur","Inspector","조사관","調査係"],d:["Tu vois les objets, mais ni les pièces ni les murs.","You see the objects, but neither rooms nor walls.","물건은 보이지만 방과 벽은 보이지 않아요.","物は見えるけど、部屋も壁も見えない。"]}};
  const lensOf=i=>i%2===0?"rooms":"objs";
  const T=a=>L(a[0],a[1],a[2],a[3]);
  /* ---------- styles ---------- */
  const css=document.createElement("style");
  css.textContent=`#coop{position:fixed;inset:0;z-index:92;background:rgba(10,6,24,.78);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:14px}
#coop[hidden]{display:none}
#coop .cp-box{width:min(96vw,500px);max-height:94vh;overflow:auto;background:linear-gradient(#fff9ec,#f3e2bd);border:2.5px solid #c9a25a;border-radius:20px;padding:18px 16px 16px;color:#3a1f3d;box-shadow:0 18px 50px rgba(0,0,0,.5);position:relative}
#coop h2{margin:0 0 4px;text-align:center;font:900 clamp(22px,6.4vw,28px)/1.1 "Cinzel",Georgia,serif;color:#6b1530}
#coop .cp-sub{text-align:center;margin:0 0 12px;font:400 14px/1.45 var(--f-body);color:#5a4636}
#coop .cp-x{position:absolute;top:10px;right:12px;border:0;background:none;font-size:22px;cursor:pointer;color:#6b1530}
#coop .cp-how{background:#fffaf0;border:1.5px solid #e2cfa4;border-radius:14px;padding:10px 12px;margin:0 0 12px;font:400 13.5px/1.5 var(--f-body);color:#4a3a30}
#coop .cp-how b{color:#6b1530}
#coop .cp-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center;margin:8px 0}
#coop .cp-in{font:800 22px/1 "Cinzel",Georgia,serif;letter-spacing:.25em;text-transform:uppercase;width:140px;text-align:center;padding:10px;border-radius:12px;border:2px solid #c9a25a;background:#fff}
#coop .cp-code{display:block;text-align:center;font:900 44px/1 "Cinzel",Georgia,serif;letter-spacing:.2em;color:#3a1f3d;margin:4px 0 2px}
#coop .cp-pl{list-style:none;margin:10px 0;padding:0;display:flex;flex-direction:column;gap:6px}
#coop .cp-pl li{display:flex;align-items:center;gap:10px;background:#fffaf0;border:1.5px solid #e2cfa4;border-radius:12px;padding:6px 10px}
#coop .cp-pl img{width:38px;height:38px;border-radius:50%;object-fit:cover;background:#efe2c4}
#coop .cp-pl b{flex:1;font:800 15px var(--f-body)}
#coop .cp-pl .rdy{font:700 13px var(--f-body);color:#3f7d3a}.cp-pl .nrd{font:700 13px var(--f-body);color:#9a7a5a}
#coop .cp-pl .off{opacity:.45}
#coop .cp-msg{text-align:center;min-height:1.2em;font:700 14px var(--f-body);color:#a8323e;margin:6px 0 0}
#coop .cp-need{text-align:center;font:400 13px var(--f-body);color:#7a5a1e;margin:6px 0}
#coopBar{position:sticky;top:0;z-index:30;display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:8px 10px;margin:0 0 8px;border-radius:14px;background:linear-gradient(#3a2457,#2a1a40);border:1.5px solid #c9a25a;color:#fbefc8;font:600 13px var(--f-body);box-shadow:0 4px 14px rgba(0,0,0,.35)}
#coopBar[hidden]{display:none}
#coopBar .cb-lens{background:#fbefc8;color:#3a1f3d;border-radius:999px;padding:3px 10px;font-weight:800;cursor:help}
#coopBar .cb-code{letter-spacing:.15em;font-weight:900}
#coopBar .cb-pl{display:flex;gap:4px;flex-wrap:wrap;flex:1}
#coopBar .cb-pl span{background:rgba(255,255,255,.12);border-radius:999px;padding:2px 8px;white-space:nowrap}
#coopBar .cb-pl span.off{opacity:.45}
#coopBar button{border:1.5px solid #c9a25a;background:#fbefc8;color:#3a1f3d;border-radius:999px;padding:4px 10px;font:800 13px var(--f-body);cursor:pointer;position:relative}
#coopBar button i{position:absolute;top:-6px;right:-6px;background:#c0392b;color:#fff;border-radius:999px;font:800 11px/1 var(--f-body);padding:3px 5px;font-style:normal}
#coopChat{position:fixed;right:12px;bottom:12px;z-index:93;width:min(92vw,340px);height:min(60vh,420px);display:flex;flex-direction:column;background:#fff9ec;border:2px solid #c9a25a;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.45);color:#3a1f3d;overflow:hidden}
#coopChat[hidden]{display:none}
#coopChat header{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#3a2457;color:#fbefc8;font:800 14px var(--f-body)}
#coopChat header button{border:0;background:none;color:#fbefc8;font-size:18px;cursor:pointer}
#coopChat .cc-list{flex:1;overflow:auto;padding:8px 10px;display:flex;flex-direction:column;gap:6px;font:400 14px/1.4 var(--f-body)}
#coopChat .cc-list p{margin:0;background:#fffaf0;border:1px solid #e9d9b6;border-radius:10px;padding:5px 8px}
#coopChat .cc-list p.me{background:#f3e6ff;border-color:#d9c3f0;align-self:flex-end}
#coopChat .cc-list b{color:#6b1530;margin-right:4px}
#coopChat form{display:flex;gap:6px;padding:8px;border-top:1px solid #e2cfa4}
#coopChat input{flex:1;min-width:0;padding:8px 10px;border-radius:10px;border:1.5px solid #c9a25a;font:400 14px var(--f-body)}
#coopChat form button{border:0;border-radius:10px;background:#8e1f33;color:#fff;font:800 14px var(--f-body);padding:0 12px;cursor:pointer}
body.coop-rooms #plan .oc{visibility:hidden}
body.coop-rooms #tip{display:none!important}
body.coop-objs #plan svg.walls,body.coop-objs #plan svg.rugs,body.coop-objs #plan .rlabel{display:none!important}
body.coop-objs #plan .cell:not(.void){background:#efe3c6!important;box-shadow:inset 0 0 0 .6px rgba(60,40,20,.18)!important}
body.coop-on #tHint{display:none!important}
.recit p.cp-lock{font-style:italic;color:#8a7a68!important;background:repeating-linear-gradient(135deg,rgba(201,162,90,.08) 0 8px,transparent 8px 16px);border-radius:8px}
.recit p.cp-mine{box-shadow:inset 3px 0 0 #c9a25a}
#coopWin .box{text-align:center}`;
  document.head.appendChild(css);
  /* ---------- network ---------- */
  async function call(action,extra){const p=acc();if(!p)return null;COOP.busy++;
    try{const r=await fetch("/api/coop",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({id:p.pid,token:p.ptok,action,code:COOP.code},extra||{}))});
      let d=null;try{d=await r.json()}catch(_){}return {ok:r.ok,status:r.status,d}}catch(_){return null}finally{COOP.busy--}}
  function remember(code){COOP.code=code;try{code?localStorage.setItem("magicoku:coop",code):localStorage.removeItem("magicoku:coop")}catch(_){}}
  function startPoll(){clearInterval(COOP.timer);COOP.timer=setInterval(poll,1500)}
  async function poll(){if(!COOP.code||COOP.busy||document.hidden)return;const r=await call("state",{v:COOP.room?COOP.room.ver:-1});
    if(!r)return;if(r.status===404||r.status===403){reset(L("La salle n'existe plus.","The room no longer exists.","방이 더 이상 없어요.","ルームはもうありません。"));return}
    if(r.ok&&r.d&&!r.d.same)apply(r.d)}
  function reset(msg){clearInterval(COOP.timer);remember(null);const wasPlay=COOP.play;COOP.room=null;COOP.play=false;COOP.on=false;COOP.lvl=null;try{window.applyCos&&window.applyCos()}catch(_){}
    document.body.classList.remove("coop-on","coop-rooms","coop-objs");const b=$("#coopBar");if(b)b.hidden=true;const c=$("#coopChat");if(c)c.hidden=true;
    if(wasPlay){try{openCase(ci)}catch(_){}}if(msg)toast(msg);try{renderHome()}catch(_){}}
  /* ---------- apply the server state ---------- */
  function apply(room){COOP.room=room;COOP.on=true;
    const me=room.players.find(p=>p.pseudo.toLowerCase()===meK());if(!me){reset(L("Tu as quitté la salle.","You left the room.","방을 나왔어요.","ルームを退出しました。"));return}
    const msgs=room.msgs||[];if(msgs.length>COOP.seenMsgs){const chat=$("#coopChat");if(chat&&!chat.hidden)COOP.seenMsgs=msgs.length;else COOP.unread=msgs.filter((m,i)=>i>=COOP.seenMsgs&&m.f.toLowerCase()!==meK()).length}
    if(room.status==="lobby"){if(COOP.play){COOP.play=false;try{window.applyCos&&window.applyCos()}catch(_){}document.body.classList.remove("coop-rooms","coop-objs");const b=$("#coopBar");if(b)b.hidden=true;$("#home").hidden=false;try{openCase(ci)}catch(_){}}
      const ov=$("#coop");if(ov&&!ov.hidden)renderLobby();}
    else{if(!COOP.play||COOP.lvl!==room.lvl)enterGame(room);else syncBoard(room);
      if(room.status==="won"&&COOP.shownWin!==room.ver&&!COOP.shownWin){COOP.shownWin=room.ver;showWin(room)}
      if(room.status==="play")COOP.shownWin=0}
    renderBar();renderChat()}
  function enterGame(room){const i=DATA.findIndex(c=>c.id===room.lvl);if(i<0){toast("?");return}
    const order=room.order||room.players.map(p=>p.pseudo);COOP.idx=Math.max(0,order.findIndex(n=>n.toLowerCase()===meK()));COOP.order=order;COOP.lens=lensOf(COOP.idx);
    COOP.play=true;try{window.applyCos&&window.applyCos()}catch(_){}COOP.lvl=room.lvl;$("#home").hidden=true;const ov=$("#coop");if(ov)ov.hidden=true;
    document.body.classList.add("coop-on");document.body.classList.toggle("coop-rooms",COOP.lens==="rooms");document.body.classList.toggle("coop-objs",COOP.lens==="objs");
    openCase(i);S=fresh();S.place=clone(room.place);S.xs=clone(room.xs);COOP.last=snapshot();render();
    setTimeout(()=>toast(`${LENS[COOP.lens].ic} ${T(LENS[COOP.lens].n)} : ${T(LENS[COOP.lens].d)}`),600)}
  const clone=o=>JSON.parse(JSON.stringify(o||{}));
  const snapshot=()=>({place:clone(S.place),xs:clone(S.xs)});
  function syncBoard(room){if(COOP.busy)return;const cur=JSON.stringify(snapshot()),srv=JSON.stringify({place:room.place||{},xs:room.xs||{}});
    COOP.last={place:clone(room.place),xs:clone(room.xs)};if(cur===srv)return;S.place=clone(room.place);S.xs=clone(room.xs);render()}
  /* ---------- local moves -> server ops (save() is called after every change) ---------- */
  const _save=save;save=function(){if(!COOP.play)return _save.apply(this,arguments);pushOps()};
  async function pushOps(){if(!COOP.play||!COOP.last)return;const a=COOP.last,ops=[];
    const keys=new Set([...Object.keys(a.place),...Object.keys(S.place)]);
    if(!Object.keys(S.place).length&&!Object.keys(S.xs).length&&(Object.keys(a.place).length||Object.keys(a.xs).length))ops.push({t:"clear"});
    else{for(const p of keys){const o=a.place[p],n=S.place[p];if(JSON.stringify(o)!==JSON.stringify(n))ops.push(n?{t:"p",p:+p,cell:n}:{t:"p",p:+p})}
      for(const k of new Set([...Object.keys(a.xs),...Object.keys(S.xs)]))if(!!a.xs[k]!==!!S.xs[k])ops.push({t:"x",k,on:!!S.xs[k]})}
    if(!ops.length)return;COOP.last=snapshot();const r=await call("ops",{ops});if(r&&r.ok&&r.d&&r.d.players){COOP.room=r.d;syncBoard(r.d);renderBar()}}
  /* ---------- testimonies: only yours are readable ---------- */
  const _rc=renderCards;renderCards=function(){const r=_rc.apply(this,arguments);if(COOP.play)try{lockParas()}catch(_){}return r};
  function holderOf(p){const ps=[...M.people.keys()].filter(q=>(C.clues[q]||[]).length),n=COOP.order.length,k=ps.indexOf(p);return k<0?-1:k%n}
  function lockParas(){document.querySelectorAll(".recit p[data-p]").forEach(el=>{const p=+el.dataset.p,h=holderOf(p);if(h<0)return;
    if(h===COOP.idx){el.classList.add("cp-mine");return}
    const who=COOP.order[h]||"?";el.className="cp-lock";el.removeAttribute("data-p");
    el.innerHTML=`🔒 ${L(`Le témoignage sur <b>${esc(pname(p))}</b> est entre les mains de <b>${esc(who)}</b>.`,`The testimony about <b>${esc(pname(p))}</b> is in <b>${esc(who)}</b>'s hands.`,`<b>${esc(pname(p))}</b>에 대한 증언은 <b>${esc(who)}</b>에게 있어요.`,`<b>${esc(pname(p))}</b>についての証言は<b>${esc(who)}</b>が持っている。`)}`})}
  /* no keyword highlighting (it would show the hidden layer), no hints */
  document.addEventListener("click",e=>{if(!COOP.play)return;if(e.target.closest&&e.target.closest(".recit .kw")){e.stopPropagation();e.preventDefault()}},true);
  if(typeof hint==="function"){const _h=hint;hint=function(){if(COOP.play){toast(L("Pas d'indice en équipe : parlez-vous !","No hints in a team: talk to each other!","팀 플레이에서는 힌트가 없어요. 서로 이야기하세요!","チームではヒントなし。話し合おう！"));return}return _h.apply(this,arguments)}}
  /* ---------- checking & accusing together ---------- */
  {const el=$("#tValid"),orig=el.onclick;el.onclick=function(e){if(!COOP.play)return orig.call(this,e);
    if(COOP.room&&COOP.room.status!=="play")return;
    if(Object.keys(S.place).length<M.people.length){toast(L("Placez tout le monde avant de valider.","Place everyone before checking.","확인하기 전에 모두를 배치하세요.","チェックする前に全員を置こう。"));return}
    const bad=C.solution.filter(([r,c],p)=>!(S.place[p]&&S.place[p][0]===r&&S.place[p][1]===c)).length;
    if(bad){call("miss");try{play("forbid")}catch(_){}toast(L(`Pas encore… ${bad} personne${bad>1?"s sont mal placées":" est mal placée"}.`,`Not yet… ${bad} ${bad>1?"people are":"person is"} misplaced.`,`아직이에요… ${bad}명이 잘못된 자리에 있어요.`,`まだです……${bad}人の位置がちがいます。`));return}
    const go=p=>{if(p===C.killer){call("won").then(r=>{if(r&&r.ok&&r.d&&r.d.players)apply(r.d)})}else{call("miss");try{play("forbid")}catch(_){}toast(L(`${pname(p)} est innocent·e… Qui était seul avec ${pname(0)} ?`,`${pname(p)} is innocent… Who was alone with ${pname(0)}?`,`${pname(p)}은(는) 결백해요… ${pname(0)}와(과) 단둘이 있던 사람은?`,`${pname(p)}は無実……${pname(0)}と2人きりだったのは？`))}};
    if(typeof accuseSheet==="function")accuseSheet(go);else go(C.killer)}}
  function showWin(room){const w=room.won||{},m=$("#reveal");
    m.innerHTML=`<div class="box rv2" role="dialog" aria-modal="true"><div class="rv-rib"><span>${L("Affaire résolue en équipe !","Case closed as a team!","팀으로 사건 해결!","チームで事件解決！")}</span></div>
      <div class="rv-por"><div class="rv-av">${ava(C.killer,{angry:true})}</div><div class="rv-stamp">${L("Coupable","Guilty","범인","犯人")}</div></div>
      <h2>${L(`C'est ${esc(pname(C.killer))} !`,`It's ${esc(pname(C.killer))}!`,`범인은 ${esc(pname(C.killer))}!`,`犯人は${esc(pname(C.killer))}だ！`)}</h2>
      <div class="rv-stats"><div><b>${fmtT(w.time||0)}</b><small>⏱ ${L("temps","time","시간","時間")}</small></div><div><b>${(w.attempts||0)+1}</b><small>🎯 ${(w.attempts||0)+1>1?L("tentatives","tries","시도","挑戦"):L("tentative","try","시도","挑戦")}</small></div><div><b>${room.players.length}</b><small>👥 ${L("détectives","detectives","탐정","探偵")}</small></div></div>
      <p class="rv-msg">${L(`Accusation portée par <b>${esc(w.by||"?")}</b>. Bravo à toute l'équipe : ${room.players.map(p=>esc(p.pseudo)).join(", ")} !`,`Accusation made by <b>${esc(w.by||"?")}</b>. Well done, team: ${room.players.map(p=>esc(p.pseudo)).join(", ")}!`,`<b>${esc(w.by||"?")}</b>이(가) 고발했어요. 모두 잘했어요: ${room.players.map(p=>esc(p.pseudo)).join(", ")}!`,`告発したのは<b>${esc(w.by||"?")}</b>。チームのみんな、お見事：${room.players.map(p=>esc(p.pseudo)).join("、")}！`)}</p>
      <div class="acts"><button class="pill" id="cwLeave">${L("Quitter","Leave","나가기","退出")}</button><button class="pill red" id="cwAgain">${L("Nouvelle enquête ensemble","New case together","함께 새 사건","いっしょに新しい事件")} ›</button></div></div>`;
    m.hidden=false;try{play("win")}catch(_){}
    m.querySelector("#cwAgain").onclick=async()=>{m.hidden=true;const r=await call("again");if(r&&r.ok&&r.d&&r.d.players){apply(r.d);openOverlay()}};
    m.querySelector("#cwLeave").onclick=()=>{m.hidden=true;leave()}}
  /* ---------- in-game bar + chat ---------- */
  function renderBar(){let b=$("#coopBar");if(!COOP.play||!COOP.room){if(b)b.hidden=true;return}
    if(!b){b=document.createElement("div");b.id="coopBar";const host=$("#board");host.parentNode.insertBefore(b,host)}
    const room=COOP.room,ln=LENS[COOP.lens];b.hidden=false;
    b.innerHTML=`<span>👥 <span class="cb-code">${esc(room.code)}</span></span><span class="cb-lens" title="${esc(T(ln.d))}">${ln.ic} ${esc(T(ln.n))}</span>
      <span class="cb-pl">${(COOP.order||[]).map((n,i)=>{const p=room.players.find(x=>x.pseudo===n);return `<span class="${p&&p.on?"":"off"}">${LENS[lensOf(i)].ic} ${esc(n)}</span>`}).join("")}</span>
      <button id="cbChat">💬${COOP.unread?`<i>${COOP.unread}</i>`:""}</button><button id="cbLeave">🚪</button>`}
  function renderChat(){const c=$("#coopChat");if(!c||c.hidden||!COOP.room)return;const l=c.querySelector(".cc-list"),msgs=COOP.room.msgs||[];
    l.innerHTML=msgs.map(m=>`<p class="${m.f.toLowerCase()===meK()?"me":""}"><b>${esc(m.f)}</b>${esc(m.t)}</p>`).join("")||`<p>${L("Écrivez-vous ici… ou parlez à voix haute !","Write to each other here… or talk out loud!","여기에서 대화하거나… 소리 내어 이야기하세요!","ここで話そう……声に出してもOK！")}</p>`;
    l.scrollTop=l.scrollHeight;COOP.seenMsgs=msgs.length;COOP.unread=0}
  function openChat(){let c=$("#coopChat");if(!c){c=document.createElement("div");c.id="coopChat";document.body.appendChild(c);
      c.innerHTML=`<header><span>💬 ${L("Discussion de l'équipe","Team chat","팀 대화","チームの会話")}</span><button aria-label="✕">✕</button></header><div class="cc-list"></div><form><input maxlength="240" autocomplete="off"><button>➤</button></form>`;
      c.querySelector("header button").onclick=()=>{c.hidden=true};
      c.querySelector("form").onsubmit=async e=>{e.preventDefault();const i=c.querySelector("input"),t=i.value.trim();if(!t)return;i.value="";const r=await call("say",{text:t});if(r&&r.ok&&r.d&&r.d.players)apply(r.d)}}
    c.hidden=false;renderChat();renderBar();setTimeout(()=>c.querySelector("input").focus(),50)}
  document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#cbChat,#cbLeave");if(!t)return;if(t.id==="cbChat")openChat();else leave()});
  async function leave(){await call("leave");reset(L("Tu as quitté l'enquête à plusieurs.","You left the team case.","팀 사건에서 나왔어요.","チームの事件から抜けました。"));$("#home").hidden=false;try{show("hMain")}catch(_){}}
  /* ---------- lobby overlay ---------- */
  function overlay(){let o=$("#coop");if(!o){o=document.createElement("div");o.id="coop";o.hidden=true;document.body.appendChild(o);
      o.addEventListener("click",e=>{if(e.target===o||e.target.closest(".cp-x"))o.hidden=true});o.addEventListener("click",onLobbyClick)}return o}
  function howTo(){return `<div class="cp-how">${L(
    `<b>Au moins 3 détectives.</b> Chacun ne reçoit qu'<b>une partie des témoignages</b>, et porte une loupe : 🗺️ <b>Cartographe</b> (voit les pièces, pas les objets) ou 🔍 <b>Inspecteur</b> (voit les objets, pas les pièces). Le plateau est partagé : décrivez-vous le plan, recoupez vos témoignages, puis désignez ensemble le coupable.`,
    `<b>At least 3 detectives.</b> Each one only gets <b>part of the testimonies</b> and wears a lens: 🗺️ <b>Cartographer</b> (sees rooms, not objects) or 🔍 <b>Inspector</b> (sees objects, not rooms). The board is shared: describe the map to each other, cross-check your testimonies, then accuse the culprit together.`,
    `<b>탐정 3명 이상.</b> 각자 <b>증언의 일부</b>만 받고 돋보기를 하나 써요: 🗺️ <b>지도 제작자</b>(방은 보이고 물건은 안 보임) 또는 🔍 <b>조사관</b>(물건은 보이고 방은 안 보임). 판은 함께 써요. 서로 지도를 설명하고 증언을 맞춰 본 뒤, 함께 범인을 지목하세요.`,
    `<b>探偵は3人以上。</b>それぞれ<b>証言の一部</b>だけを持ち、ルーペをひとつ使う：🗺️ <b>地図係</b>（部屋は見えるが物は見えない）か 🔍 <b>調査係</b>（物は見えるが部屋は見えない）。盤は共有。地図を説明し合い、証言を照らし合わせて、みんなで犯人を指名しよう。`)}</div>`}
  function openOverlay(){const o=overlay();o.hidden=false;if(COOP.room&&COOP.room.status!=="lobby"&&COOP.play){o.hidden=true;$("#home").hidden=true;return}renderLobby()}
  function renderLobby(msg){const o=overlay(),room=COOP.room;
    const head=`<button class="cp-x" aria-label="✕">✕</button><h2>👥 ${L("Multijoueur","Multiplayer","멀티플레이","マルチプレイ")}</h2>`;
    if(!acc()){o.innerHTML=`<div class="cp-box">${head}${howTo()}<p class="cp-sub">${L("Crée d'abord ton compte de détective pour jouer en équipe.","Create your detective account first to play as a team.","팀으로 플레이하려면 먼저 탐정 계정을 만드세요.","チームで遊ぶには、まず探偵アカウントを作ろう。")}</p></div>`;return}
    if(!room){o.innerHTML=`<div class="cp-box">${head}<p class="cp-sub">${L("Résolvez une enquête ensemble, chacun avec ses propres indices.","Solve a case together, each with your own clues.","각자의 단서로 함께 사건을 풀어요.","それぞれの手がかりで、いっしょに事件を解こう。")}</p>${howTo()}
      <div class="cp-row"><button class="pill red" id="cpCreate">✨ ${L("Créer une salle","Create a room","방 만들기","ルームを作る")}</button></div>
      <p class="cp-need">${L("ou rejoins tes amis avec leur code :","or join your friends with their code:","또는 친구의 코드로 참여하세요:","または友だちのコードで参加：")}</p>
      <div class="cp-row"><input class="cp-in" id="cpCode" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABCD"><button class="pill" id="cpJoin">${L("Rejoindre","Join","참여","参加")}</button></div><p class="cp-msg" id="cpMsg">${msg||""}</p></div>`;return}
    const me=room.players.find(p=>p.pseudo.toLowerCase()===meK())||{},n=room.players.length,allR=room.players.every(p=>p.ready);
    o.innerHTML=`<div class="cp-box">${head}<p class="cp-sub">${L("Donne ce code à tes coéquipiers :","Give this code to your teammates:","팀원에게 이 코드를 알려 주세요:","この コードを仲間に教えよう：")}</p><span class="cp-code">${esc(room.code)}</span>
      <ul class="cp-pl">${room.players.map((p,i)=>`<li class="${p.on?"":"off"}"><img src="${POR[p.avatar]||POR[AVS[0]]}" alt=""><b>${esc(p.pseudo)}${p.pseudo===room.host?" 👑":""}</b>${p.ready?`<span class="rdy">✓ ${L("Prêt","Ready","준비 완료","準備OK")}</span>`:`<span class="nrd">${L("en attente…","waiting…","대기 중…","待機中…")}</span>`}</li>`).join("")}</ul>
      <p class="cp-need">${n<3?L(`Encore ${3-n} détective${3-n>1?"s":""} au minimum pour commencer.`,`At least ${3-n} more detective${3-n>1?"s":""} needed to start.`,`시작하려면 탐정이 최소 ${3-n}명 더 필요해요.`,`始めるには最低あと${3-n}人必要です。`):allR?L("C'est parti !","Here we go!","시작해요!","はじめよう！"):L("L'enquête commence dès que tout le monde est prêt.","The case starts as soon as everyone is ready.","모두 준비되면 사건이 시작돼요.","全員の準備ができたら事件が始まります。")}</p>
      ${howTo()}
      <div class="cp-row"><button class="pill" id="cpLeave">${L("Quitter la salle","Leave the room","방 나가기","ルームを出る")}</button><button class="pill red" id="cpReady">${me.ready?L("Je ne suis plus prêt","Not ready any more","준비 취소","準備を取り消す"):L("Je suis prêt !","I'm ready!","준비 완료!","準備OK！")}</button>
      ${isAdm()&&n<3&&room.host.toLowerCase()===meK()?`<button class="pill" id="cpTest">🧪 ${L("Lancer (test)","Start (test)","시작(테스트)","開始（テスト）")}</button>`:""}</div><p class="cp-msg" id="cpMsg">${msg||""}</p></div>`}
  function pool(){return DATA.map((c,i)=>c).filter(c=>!/^s\d+n\d+$/.test(c.id)&&!/^(u|n|l|dy)\d/.test(c.id)&&c.liar==null&&!c.expert&&!c.dark&&!c.nox&&c.rooms.length>=6&&c.rooms.length<=8).map(c=>c.id)}
  async function onLobbyClick(e){const t=e.target.closest&&e.target.closest("button");if(!t)return;const msg=$("#cpMsg");
    if(t.id==="cpCreate"){const r=await call("create",{code:null,pool:pool()});if(r&&r.ok&&r.d&&r.d.code){remember(r.d.code);COOP.room=r.d;COOP.on=true;startPoll();renderLobby()}else if(msg)msg.textContent=L("Impossible de créer la salle (connexion ?).","Couldn't create the room (connection?).","방을 만들 수 없어요(연결?).","ルームを作れません（接続？）。");return}
    if(t.id==="cpJoin"){const code=($("#cpCode").value||"").trim().toUpperCase();if(code.length!==4){if(msg)msg.textContent=L("Le code fait 4 caractères.","The code is 4 characters long.","코드는 4글자예요.","コードは4文字です。");return}
      COOP.code=code;const r=await call("join");
      if(r&&r.ok&&r.d&&r.d.code){remember(code);COOP.room=r.d;COOP.on=true;startPoll();renderLobby();try{play("win")}catch(_){}}
      else{COOP.code=null;if(msg)msg.textContent=r&&r.status===404?L("Aucune salle avec ce code.","No room with that code.","그 코드의 방이 없어요.","そのコードのルームはありません。"):r&&r.d&&r.d.error==="started"?L("Cette enquête a déjà commencé.","That case has already started.","이 사건은 이미 시작됐어요.","この事件はもう始まっています。"):r&&r.d&&r.d.error==="full"?L("La salle est pleine (6 maximum).","The room is full (6 max).","방이 가득 찼어요(최대 6명).","ルームは満員です（最大6人）。"):L("Impossible de rejoindre (connexion ?).","Couldn't join (connection?).","참여할 수 없어요(연결?).","参加できません（接続？）。")}return}
    if(t.id==="cpReady"){const me=COOP.room.players.find(p=>p.pseudo.toLowerCase()===meK());const r=await call("ready",{ready:!(me&&me.ready)});if(r&&r.ok&&r.d&&r.d.players)apply(r.d);return}
    if(t.id==="cpTest"){const r=await call("ready",{ready:true,test:true});if(r&&r.ok&&r.d&&r.d.players)apply(r.d);return}
    if(t.id==="cpLeave"){await call("leave");reset();renderLobby();return}}
  /* ---------- home card ---------- */
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{homeCard()}catch(_){}};
  function homeCard(){const grid=document.querySelector(".h2-grid");if(!grid)return;let b=$("#hCoop");
    if(!b){b=document.createElement("button");b.id="hCoop";b.className="h2-card c-coop";grid.appendChild(b);grid.classList.remove("solo")}
    const im=typeof HOME_IMG!=="undefined"&&(HOME_IMG.liar||HOME_IMG.night);
    b.innerHTML=`${im?`<img src="${im}" alt="">`:""}<span class="h2-ct"><b>${L("Multijoueur","Multiplayer","멀티플레이","マルチプレイ")}</b><small>${COOP.play?L("Partie en cours","Game in progress","진행 중","進行中"):L("Dès 3 joueurs","From 3 players","3명부터","3人から")}</small></span><span class="h2-chev">›</span>`}
  document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#hCoop");if(!t)return;e.stopPropagation();try{play("page")}catch(_){}
    if(COOP.play&&COOP.room&&COOP.room.status!=="lobby"){$("#home").hidden=true;renderBar();return}openOverlay()},true);
  /* back to the menu during a game: the bar stays, the room stays */
  /* ---------- resume after a reload ---------- */
  setTimeout(async()=>{let code=null;try{code=localStorage.getItem("magicoku:coop")}catch(_){}if(!code||!acc())return;COOP.code=code;
    const r=await call("state",{v:-1});if(r&&r.ok&&r.d&&r.d.players){COOP.room=null;startPoll();apply(r.d)}else remember(null)},1800);
  try{renderHome()}catch(_){}
})();
