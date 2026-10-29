/* ================= Endless mode: levels one after another, 3 lives, the difficulty keeps rising =================
   Pool: /inf.json (built from src/ld/lv/inf/i*.json, generator src/story/geninf.py), grouped in tiers of rising difficulty.
   Level n of a run is taken from the tier of n, at a random offset chosen when the run starts (no two runs alike).
   A wrong check or a hint costs a life; +1 life every 10 levels (max 3). Ranking: furthest level cleared, then total time (/api/inf). */
var INF={on:false,data:null,run:null};
(function(){
  const RK="magicoku:infRun",BK="magicoku:infBest",MK="magicoku:infMech",MAXL=3;
  const START=[1,6,13,23,35,50];                       /* first level of each tier */
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const acc=()=>ACC.profile&&ACC.profile.pseudo&&ACC.profile.pid&&ACC.profile.ptok?ACC.profile:null;
  const rd=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||"null");return v==null?d:v}catch(_){return d}};
  const wr=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
  const newId=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)).replace(/[^\w-]/g,"").slice(0,36);
  INF.run=rd(RK,null);
  const best=()=>rd(BK,null);
  const hearts=n=>"❤️".repeat(Math.max(0,n))+"🖤".repeat(Math.max(0,MAXL-n));
  const lvW=n=>L(`${n} ${n>1?"niveaux":"niveau"}`,`${n} ${n>1?"levels":"level"}`,`${n}레벨`,`${n}レベル`);
  /* ---------- pool ---------- */
  let loading=null;
  function load(){if(INF.data)return Promise.resolve(INF.data);if(loading)return loading;
    loading=fetch("/inf.json").then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{d.by={};d.levels.forEach(x=>d.by[x.id]=x);Object.assign(META,d.meta);INF.data=d;return d}).catch(e=>{loading=null;throw e});return loading}
  function tierOfN(n){let t=0;for(let i=0;i<START.length;i++)if(n>=START[i])t=i;return t}
  function levelFor(run,n){const T=INF.data.tiers,t=Math.min(tierOfN(n),T.length-1),list=T[t];return list[((run.off[t]||0)+n-START[t])%list.length]}
  /* ---------- swap the level in while it is played (same trick as the daily puzzle) ---------- */
  const _prep=prep;prep=function(){if(INF.on&&INF.data&&INF.run){const k=ci,keep=DATA[k];DATA[k]=INF.data.by[INF.run.lid];try{_prep()}finally{DATA[k]=keep}}else _prep()};
  function saveRun(){wr(RK,INF.run)}
  function newRun(){const T=INF.data.tiers;INF.run={id:newId(),n:1,lives:MAXL,t:0,off:T.map(l=>Math.floor(Math.random()*l.length)),at:Date.now()};INF.run.lid=levelFor(INF.run,1);saveRun();return INF.run}
  function nameLevel(){const r=INF.run,m=META[r.lid];if(!m)return;m.level=["Mode infini","Endless mode","무한 모드","エンドレスモード"]}
  function enter(){const r=INF.run;nameLevel();INF.on=true;document.body.classList.add("inf-play");$("#home").hidden=true;openCase(ci);
    if(S.run!==r.id+":"+r.n){S=fresh();S.hlog=[];S.run=r.id+":"+r.n;hist=[];save()}
    render();renderStatic();try{renderTimer()}catch(_){}
    /* the new rules pop up once the case's story has been read */
    const t0=Date.now(),id=r.id+":"+r.n,wait=()=>{if(!INF.on||!INF.run||INF.run.id+":"+INF.run.n!==id)return;const it=$("#g3IntroS");if(it&&!it.hidden&&Date.now()-t0<120000){setTimeout(wait,400);return}if(Date.now()-t0<1500){setTimeout(wait,300);return}mechNew()};setTimeout(wait,900)}
  window.startInf=function(fresh_){load().then(()=>{if(fresh_||!INF.run||INF.run.over||!INF.data.by[INF.run.lid])newRun();try{play("select")}catch(_){}enter()})
    .catch(()=>{try{play("forbid")}catch(_){}toast(L("Impossible de charger le mode infini : vérifie ta connexion.","Couldn't load endless mode: check your connection.","무한 모드를 불러올 수 없어요. 연결을 확인하세요.","エンドレスモードを読み込めません。接続を確認してね。"))})};
  new MutationObserver(()=>{if(INF.on&&!$("#home").hidden){INF.on=false;document.querySelectorAll("#g3IntroS,#infRule").forEach(e=>e.id==="infRule"?e.remove():e.hidden=true);document.body.classList.remove("inf-play");try{openCase(ci)}catch(e){}try{renderHome()}catch(_){}}}).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
  /* ---------- the level's special rules ---------- */
  const drop1=s=>s.replace(/^[^.。!！]*[.。!！]\s*/,"");
  const MI=()=>({
    dist:["🐾",MECH_INFO.dist[1],MECH_INFO.dist[2].map(drop1)],
    cnt:["📒",MECH_INFO.cnt[1],MECH_INFO.cnt[2].map(drop1)],
    mirror:["🪞",["Les reflets","Reflections","반사","鏡写し"],MECH_INFO.mirror[2].map(drop1)],
    poison:["🧪",MECH_INFO.poison[1],MECH_INFO.poison[2].map(drop1)],
    nox:["🚫",["Pas de croix","No crosses","X 표시 금지","✕禁止"],["Dans cette enquête, tu ne peux pas barrer de cases avec des croix. Tu peux seulement placer les suspects et écrire de petites notes (toucher rapide). À toi de tout garder en tête !","In this case you can't cross out squares. You can only place suspects and write small notes (quick tap). Keep everything in your head!","이 사건에서는 칸에 X 표시를 할 수 없어요. 용의자를 배치하거나 작은 메모(짧게 탭)만 적을 수 있어요. 모든 걸 머릿속에 기억하세요!","この事件ではマスに✕をつけられません。できるのは容疑者を置くことと、小さなメモ（短くタップ）だけ。全部頭の中で覚えておこう！"]],
    dark:["🏮",MECH_INFO.dark[1],["Le plan est plongé dans l'obscurité. Promène ta lanterne (souris, ou doigt sur téléphone) pour découvrir les pièces et les objets. Tes personnages et tes croix restent toujours visibles.","The map is plunged into darkness. Move your lantern (mouse, or finger on a phone) to reveal rooms and objects. Your characters and crosses always stay visible.","지도가 어둠에 잠겼어요. 등불(마우스, 휴대폰에서는 손가락)을 움직여 방과 물건을 찾아보세요. 배치한 인물과 X 표시는 항상 보여요.","見取り図が真っ暗に。ランタン（マウス、スマホでは指）を動かして部屋や家具を照らそう。置いた人物と✕はいつでも見えます。"]]});
  function mechs(){const d=INF.data&&INF.run&&INF.data.by[INF.run.lid];if(!d)return [];const out=new Set();
    for(const v of Object.values(d.clues))for(const c of v){if(c[0]==="dist")out.add("dist");if(c[0]==="cnt")out.add("cnt");if(/^(mirc|mird|mira|mid)$/.test(c[0]))out.add("mirror")}
    if(d.objs.some(o=>o[0]==="poison"))out.add("poison");if(d.nox)out.add("nox");if(d.dark)out.add("dark");return [...out]}
  function mechPop(list,isNew){if(!list.length)return;const I=MI();let m=$("#infRule");if(m)m.remove();m=document.createElement("div");m.id="infRule";m.className="modal";
    m.innerHTML=`<div class="mbox inf-box"><div class="inf-big">${list.map(k=>I[k][0]).join(" ")}</div><h2>${isNew?L("Nouvelle règle !","New rule!","새 규칙!","新しいルール！"):L("Règles de ce niveau","This level's rules","이 레벨의 규칙","このレベルのルール")}</h2>
      ${list.map(k=>`<div class="inf-rule"><b>${I[k][0]} ${TX(I[k][1])}</b><p>${TX(I[k][2])}</p></div>`).join("")}<button class="pill red" data-ir>${L("C'est compris !","Got it!","알겠어요!","わかった！")}</button></div>`;
    document.body.appendChild(m);m.hidden=false;m.addEventListener("click",e=>{if(e.target===m||e.target.closest("[data-ir]"))m.remove()})}
  function mechNew(){const seen=rd(MK,[]),fresh_=mechs().filter(k=>!seen.includes(k));if(!fresh_.length)return;wr(MK,seen.concat(fresh_));mechPop(fresh_,true)}
  document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("[data-infr]");if(a){e.preventDefault();mechPop(mechs(),false)}});
  /* ---------- in-game: title with the level number and the lives ---------- */
  function head(){const r=INF.run;return `♾️ ${L(`Niveau ${r.n}`,`Level ${r.n}`,`레벨 ${r.n}`,`レベル ${r.n}`)} <span class="inf-hp" aria-label="${r.lives}">${hearts(r.lives)}</span><small>${esc(TX(M.title))}</small>`}
  function paintGame(){document.body.classList.toggle("inf-play",INF.on);if(!INF.on||!INF.run)return;
    const setT=()=>{const t=$("#g3T");if(t&&INF.on)t.innerHTML=head()};setT();requestAnimationFrame(setT);setTimeout(setT,120);
    const ct=$("#caseTitle");if(ct)ct.textContent=`♾️ ${L("Mode infini","Endless mode","무한 모드","エンドレスモード")} · ${L(`Niveau ${INF.run.n}`,`Level ${INF.run.n}`,`레벨 ${INF.run.n}`,`レベル ${INF.run.n}`)} · ${TX(M.title)}`;
    const rec=document.querySelector(".recit");
    if(rec&&!rec.querySelector(".inf-rem")){const ms=mechs(),I=MI(),d=document.createElement("p");d.className="inf-rem";
      d.innerHTML=`<span>${hearts(INF.run.lives)}</span> ${ms.length?`· <a href="#" data-infr>${ms.map(k=>I[k][0]).join(" ")} ${L(ms.length>1?"règles de ce niveau":"règle de ce niveau",ms.length>1?"this level's rules":"this level's rule","이 레벨의 규칙","このレベルのルール")}</a>`:`· ${L("une erreur = une vie","one mistake = one life","실수 한 번 = 생명 하나","ミス1回＝ライフ1つ")}`}`;rec.prepend(d)}
    else if(rec){const s=rec.querySelector(".inf-rem span");if(s)s.textContent=hearts(INF.run.lives)}}
  const _rs=renderStatic;renderStatic=function(){const r=_rs.apply(this,arguments);try{paintGame()}catch(_){}return r};
  const _rd=render;render=function(){const r=_rd.apply(this,arguments);try{if(INF.on){const t=$("#g3T");if(t&&!t.querySelector(".inf-hp"))t.innerHTML=head();}}catch(_){}return r};
  /* ---------- lives: a wrong check or a hint costs one ---------- */
  function loseLife(why){const r=INF.run;if(!r||r.over)return;r.lives=Math.max(0,r.lives-1);saveRun();paintGame();
    const fx=document.createElement("div");fx.className="inf-break";fx.textContent="💔";document.body.appendChild(fx);setTimeout(()=>fx.remove(),1300);
    try{navigator.vibrate&&navigator.vibrate(120)}catch(_){}
    if(r.lives>0&&why!=="hint")setTimeout(()=>toast(r.lives>1?L(`Une vie en moins : il t'en reste ${r.lives}.`,`One life lost: ${r.lives} left.`,`생명 하나를 잃었어요. ${r.lives}개 남았어요.`,`ライフが1つ減った。残り${r.lives}。`):L("Une vie en moins : c'est ta dernière !","One life lost: it's your last one!","생명 하나를 잃었어요. 마지막 생명이에요!","ライフが1つ減った。最後のライフだ！")),900)}
  const _rv=runVerdict;runVerdict=function(ok,done){if(!INF.on||ok)return _rv.apply(this,arguments);
    loseLife("check");const dead=INF.run.lives<=0;return _rv.call(this,ok,()=>{if(dead)gameOver();else if(done)done()})};
  let armed=0;
  const _h=hint;hint=function(){if(!INF.on||S.solved)return _h.apply(this,arguments);const r=INF.run;
    if(r.lives<=1){try{play("forbid")}catch(_){}toast(L("Il te reste une seule vie : pas d'indice possible !","Only one life left: no hints!","생명이 하나뿐이라 힌트를 쓸 수 없어요!","ライフが残り1つなので、ヒントは使えません！"));return}
    if(Date.now()-armed>4000){armed=Date.now();toast(L("Un indice coûte une vie ❤️. Touche encore pour confirmer.","A hint costs a life ❤️. Tap again to confirm.","힌트는 생명 하나가 들어요 ❤️ 확인하려면 한 번 더 누르세요.","ヒントはライフ1つ ❤️ もう一度タップで確定。"));return}
    armed=0;const before=S.hints||0;const out=_h.apply(this,arguments);if((S.hints||0)>before)loseLife("hint");return out};
  /* ---------- end of a level ---------- */
  function modal(){let c=$("#infCard");if(!c){c=document.createElement("div");c.id="infCard";c.className="modal";document.body.appendChild(c);
      c.addEventListener("click",e=>{const b=e.target.closest("[data-ia]");if(!b)return;const a=b.dataset.ia;c.hidden=true;
        if(a==="next")enter();else if(a==="again")startInf(true);else{$("#home").hidden=false;show("pInf")}})}return c}
  function send(r,cleared){const p=acc();if(!p||!cleared)return Promise.resolve(null);
    return fetch("/api/inf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok,rid:r.id,n:cleared,t:Math.round(r.t)})})
      .then(x=>x.json().then(d=>({ok:x.ok,status:x.status,d}))).then(x=>{if(x.ok){if(INF.run&&INF.run.id===r.id){INF.run.sent=cleared;saveRun()}try{window.loadWallet&&loadWallet()}catch(_){}}return x}).catch(()=>null)}
  function resLine(x){if(!acc())return L("Crée ton compte pour entrer dans le classement\u00a0!","Create an account to join the ranking!","계정을 만들면 순위에 들어갈 수 있어요!","アカウントを作るとランキングに参加できます！");
    if(!x)return L("Résultat non envoyé (pas de connexion) : il partira au prochain niveau.","Result not sent (no connection): it will go with the next level.","결과를 보내지 못했어요(연결 없음). 다음 레벨에서 보낼게요.","結果を送れませんでした（接続なし）。次のレベルで送ります。");
    if(!x.ok)return "";const d=x.d;return `${d.rank?L(`Classement : <b>${d.rank===1?"1er":d.rank+"ᵉ"}</b> sur ${d.of}`,`Ranking: <b>#${d.rank}</b> of ${d.of}`,`순위: ${d.of}명 중 <b>${d.rank}위</b>`,`ランキング：${d.of}人中<b>${d.rank}位</b>`):""}${d.earned?` · <span class="inf-gain">+${d.earned} ${SHARD}</span>`:""}`}
  function levelWon(){const r=INF.run,K=C.killer,lt=Math.round(S.time||0);r.t+=lt;const cleared=r.n;r.n++;let bonus=false;
    if(cleared%10===0&&r.lives<MAXL){r.lives++;bonus=true}
    r.lid=levelFor(r,r.n);saveRun();
    const b=best();if(!b||cleared>b.n||(cleared===b.n&&r.t<b.t))wr(BK,{n:cleared,t:r.t,at:Date.now()});
    const c=modal(),rec=!b||cleared>b.n;
    c.innerHTML=`<div class="mbox inf-box inf-win"><div class="inf-big">✅</div><h2>${L(`Niveau ${cleared} résolu !`,`Level ${cleared} solved!`,`레벨 ${cleared} 해결!`,`レベル${cleared}クリア！`)}</h2>
      <div class="dw-who">${ava(K,{angry:true})}<span>${L(`C'était ${pname(K)} !`,`It was ${pname(K)}!`,`범인은 ${pname(K)}!`,`犯人は${pname(K)}だった！`)}</span></div>
      <div class="rv-stats"><div><b>${fmtT(lt)}</b><small>⏱ ${L("ce niveau","this level","이번 레벨","このレベル")}</small></div><div><b>${hearts(r.lives)}</b><small>${L("vies","lives","생명","ライフ")}</small></div><div><b>${fmtT(r.t)}</b><small>⏱ ${L("total","total","합계","合計")}</small></div></div>
      ${bonus?`<p class="inf-bonus">❤️ ${L("+1 vie : tu as passé un palier de 10 niveaux !","+1 life: you passed a 10-level milestone!","+1 생명: 10레벨 구간을 통과했어요!","ライフ+1：10レベルの節目を突破！")}</p>`:""}
      ${rec&&cleared>1?`<p class="inf-rec">🏆 ${L("Nouveau record personnel !","New personal best!","개인 최고 기록!","自己ベスト更新！")}</p>`:""}
      <p class="inf-res" id="infRes">${acc()?L("Envoi…","Sending…","보내는 중…","送信中…"):resLine(null)}</p>
      <div class="acts"><button class="pill" data-ia="menu">${L("Pause","Pause","일시 정지","一時停止")}</button><button class="pill red" data-ia="next">${L(`Niveau ${r.n}`,`Level ${r.n}`,`레벨 ${r.n}`,`レベル${r.n}`)} ›</button></div></div>`;
    c.hidden=false;try{play("win")}catch(_){}
    send(r,cleared).then(x=>{const el=$("#infRes");if(el&&acc())el.innerHTML=resLine(x)})}
  function gameOver(){const r=INF.run;if(!r)return;r.over=true;saveRun();const cleared=r.n-1,b=best(),c=modal();
    c.innerHTML=`<div class="mbox inf-box inf-over"><div class="inf-big">💔</div><h2>${L("Plus de vies !","Out of lives!","생명이 모두 떨어졌어요!","ライフがなくなった！")}</h2>
      <p class="inf-sum">${cleared?L(`Tu as résolu <b>${lvW(cleared)}</b> en ${fmtT(r.t)}.`,`You solved <b>${lvW(cleared)}</b> in ${fmtT(r.t)}.`,`${fmtT(r.t)} 동안 <b>${cleared}개 레벨</b>을 해결했어요.`,`${fmtT(r.t)}で<b>${cleared}レベル</b>をクリアしました。`):L("Aucun niveau résolu cette fois-ci. Courage !","No level solved this time. Keep going!","이번에는 레벨을 해결하지 못했어요. 힘내세요!","今回はクリアなし。がんばろう！")}</p>
      ${b?`<p class="inf-sum">🏆 ${L(`Ton record : ${lvW(b.n)}`,`Your best: ${lvW(b.n)}`,`내 최고 기록: ${b.n}레벨`,`自己ベスト：${b.n}レベル`)}</p>`:""}
      <div class="acts"><button class="pill" data-ia="menu">🏆 ${L("Classement","Ranking","순위","ランキング")}</button><button class="pill red" data-ia="again">${L("Rejouer","Play again","다시 하기","もう一度")} ›</button></div></div>`;
    c.hidden=false}
  const _sr=showReveal;showReveal=function(){if(INF.on){levelWon();return}return _sr.apply(this,arguments)};
  /* ---------- home: card + panel with the ranking ---------- */
  function card(){const grid=document.querySelector(".h2-grid");if(!grid)return;let b=$("#hInf");
    if(!b){b=document.createElement("button");b.id="hInf";b.className="h2-card c-inf";const d=$("#hPlay");if(d)d.after(b);else grid.appendChild(b);
      b.addEventListener("click",e=>{e.stopPropagation();try{play("page")}catch(_){}show("pInf")})}
    const r=INF.run,live=r&&!r.over,bb=best();
    b.innerHTML=`<span class="inf-ico">∞</span><span class="h2-ct"><b>${L("Mode infini","Endless mode","무한 모드","エンドレスモード")}</b><small>${live?L(`Partie en cours : niveau ${r.n}`,`Run in progress: level ${r.n}`,`진행 중: 레벨 ${r.n}`,`プレイ中：レベル${r.n}`)+" "+hearts(r.lives):bb?L(`Ton record : ${lvW(bb.n)}`,`Your best: ${lvW(bb.n)}`,`내 기록: ${bb.n}레벨`,`自己ベスト：${bb.n}レベル`):L("3 vies, jusqu'où iras-tu ?","3 lives: how far can you go?","생명 3개, 어디까지 갈 수 있을까요?","ライフ3つでどこまで行ける？")}</small></span><span class="h2-chev">›</span>`}
  let RANK=null,armedNew=0;
  function loadRank(){return fetch("/api/inf",{cache:"no-store"}).then(r=>r.json()).then(d=>{RANK=d;const p=$("#pInf");if(p&&!p.hidden)panel()}).catch(()=>{RANK=RANK||{rows:[],err:1};const p=$("#pInf");if(p&&!p.hidden)panel()})}
  function panel(){let p=$("#pInf");if(!p){p=document.createElement("div");p.id="pInf";p.className="home-panel inf-panel";p.hidden=true;($("#hMain")||$("#home")).after(p);
      p.addEventListener("click",e=>{const b=e.target.closest("[data-ip]");if(!b)return;e.stopPropagation();const a=b.dataset.ip;
        if(a==="back")show("hMain");else if(a==="play")startInf(false);
        else if(a==="new"){if(INF.run&&!INF.run.over&&Date.now()-armedNew>4000){armedNew=Date.now();toast(L("Ta partie en cours sera perdue. Touche encore pour recommencer.","Your current run will be lost. Tap again to restart.","진행 중인 게임이 사라져요. 다시 시작하려면 한 번 더 누르세요.","今のプレイは失われます。もう一度タップでやり直し。"));return}startInf(true)}})}
    const r=INF.run,live=r&&!r.over,bb=best(),me=(ACC.profile&&ACC.profile.pseudo||"").toLowerCase();
    const rows=RANK&&RANK.rows;
    p.innerHTML=`<button class="hb small" data-ip="back">← ${L("Retour","Back","뒤로","戻る")}</button>
      <div class="inf-head"><div class="inf-badge">∞</div><h2>${L("Mode infini","Endless mode","무한 모드","エンドレスモード")}</h2>
      <p>${L("Les enquêtes s'enchaînent sans fin et deviennent de plus en plus difficiles. Tu as <b>3 vies</b> : jusqu'où iras-tu\u00a0?","Cases follow one another endlessly, harder and harder. You have <b>3 lives</b>: how far can you go?","사건이 끝없이 이어지고 점점 어려워져요. <b>생명은 3개</b>, 어디까지 갈 수 있을까요?","事件が次々と続き、どんどん難しくなります。<b>ライフは3つ</b>。どこまで行けるかな？")}</p></div>
      ${live?`<div class="inf-run"><b>${L(`Partie en cours : niveau ${r.n}`,`Run in progress: level ${r.n}`,`진행 중: 레벨 ${r.n}`,`プレイ中：レベル${r.n}`)}</b><span>${hearts(r.lives)} · ⏱ ${fmtT(r.t)}</span></div>`:""}
      <button class="h2-go inf-go" data-ip="play"><span>${live?L("Reprendre","Resume","이어서 하기","つづける"):L("Jouer","Play","플레이","プレイ")}</span><span class="h2-chev">›</span></button>
      ${live?`<button class="inf-new" data-ip="new">${L("Nouvelle partie","New run","새 게임","新しくはじめる")}</button>`:""}
      <ul class="inf-rules">
        <li>❤️ ${L("Une erreur à la validation ou un indice coûte une vie. Plus de vies : la partie est finie.","A wrong check or a hint costs a life. No lives left: the run is over.","확인 실수나 힌트 하나에 생명 하나가 줄어요. 생명이 없으면 게임이 끝나요.","チェックのミスやヒントでライフが1つ減ります。ライフがなくなったら終了。")}</li>
        <li>✨ ${L("Tous les 10 niveaux, tu regagnes une vie (3 au maximum).","Every 10 levels, you get a life back (3 at most).","10레벨마다 생명 하나를 되찾아요(최대 3개).","10レベルごとにライフが1つ回復（最大3つ）。")}</li>
        <li>📈 ${L("Les grilles grandissent et de nouvelles règles apparaissent : empreintes, registre, reflets, poisons, obscurité…","Grids grow and new rules appear: footprints, register, reflections, poisons, darkness…","그리드가 커지고 새 규칙이 나타나요: 발자국, 출입 기록, 반사, 독약, 어둠…","グリッドが大きくなり、新しいルールが登場：足跡、記録、鏡写し、毒薬、暗闇…")}</li>
        <li>${SHARD} ${L("+20 éclats de lune chaque fois que ton record passe un nouveau palier de 5 niveaux.","+20 moon shards each time your best passes a new 5-level milestone.","내 기록이 5레벨 구간을 새로 넘을 때마다 달 조각 +20.","自己ベストが5レベルの節目を超えるたびに月のかけら+20。")}</li></ul>
      <h3 class="inf-rt">🏆 ${L("Le plus loin","Furthest","가장 멀리","最も遠くまで")}</h3>
      ${bb?`<p class="inf-me">${L(`Ton record : <b>${lvW(bb.n)}</b> en ${fmtT(bb.t)}`,`Your best: <b>${lvW(bb.n)}</b> in ${fmtT(bb.t)}`,`내 기록: ${fmtT(bb.t)} 동안 <b>${bb.n}레벨</b>`,`自己ベスト：${fmtT(bb.t)}で<b>${bb.n}レベル</b>`)}</p>`:""}
      ${!rows?`<p class="rk-msg">${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</p>`:!rows.length?`<p class="rk-msg">${RANK.err?L("Classement indisponible pour l'instant.","Ranking unavailable right now.","지금은 순위를 볼 수 없어요.","今はランキングを表示できません。"):L("Personne n'est encore classé. Sois le premier !","Nobody is ranked yet. Be the first!","아직 순위에 아무도 없어요. 첫 번째가 되어 보세요!","まだ誰もランクインしていません。一番乗りを目指そう！")}</p>`
        :`<ol class="rk-list">${rows.map((x,k)=>`<li class="rk-r${String(x.pseudo).toLowerCase()===me?" me":""}${x.cheat?" cheat":""}" data-prof="${esc(x.pseudo)}"><span class="rk-n">${["🥇","🥈","🥉"][k]||k+1}</span>${typeof cosAv==="function"?cosAv(x.avatar,x.cos,"",x.pseudo):""}<div class="rk-b"><div class="rk-t"><b>${esc(x.pseudo)}${x.cheat?` <small>(${L("tricheur","cheater","부정행위","不正")})</small>`:""}</b><strong>${lvW(x.n)}</strong></div>${typeof cosTitle==="function"?cosTitle(x.cos):""}<small>⏱ ${fmtT(x.t)}</small></div></li>`).join("")}</ol>`}
      ${acc()?"":`<p class="rk-msg">${L("Crée ton compte pour entrer dans le classement\u00a0!","Create an account to join the ranking!","계정을 만들면 순위에 들어갈 수 있어요!","アカウントを作るとランキングに参加できます！")}</p>`}`}
  const _show=show;show=function(pn){const p=$("#pInf");if(p)p.hidden=true;
    if(pn==="pInf"){_show("__none__");document.querySelectorAll("#home .home-panel,#hMain").forEach(e=>e.hidden=true);const v=$("#lvView");if(v)v.hidden=true;panel();$("#pInf").hidden=false;try{$("#home").scrollTop=0}catch(_){}loadRank();
      /* a level cleared offline: send the run's progress now */
      const r=INF.run;if(r&&acc()&&r.n-1>(r.sent||0))send(r,r.n-1);load().catch(()=>{});return}
    return _show.apply(this,arguments)};
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{card();const p=$("#pInf");if(p&&!p.hidden)panel()}catch(_){}};
  const st=document.createElement("style");st.textContent=`
.h2-card.c-inf{background:linear-gradient(135deg,#1f4a63,#122a3d)}
.h2-card.c-inf .inf-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);width:46px;height:46px;border-radius:12px;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,#2f6f93,#0f2536 75%);box-shadow:0 0 0 1.5px rgba(240,207,122,.7);color:#f0cf7a;font:700 34px/1 Georgia,serif;text-shadow:0 0 8px rgba(240,207,122,.6)}
.inf-panel .inf-head{text-align:center;margin:4px 0 10px}.inf-panel .inf-head h2{margin:2px 0 6px}.inf-panel .inf-head p{font:500 14px/1.45 var(--f-simple,system-ui);margin:0}
.inf-badge{width:58px;height:58px;margin:0 auto 4px;border-radius:16px;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,#2f6f93,#0f2536 75%);box-shadow:0 0 0 2px rgba(240,207,122,.8),0 4px 10px #0004;color:#f0cf7a;font:700 44px/1 Georgia,serif;text-shadow:0 0 8px rgba(240,207,122,.6)}
.inf-big{font-size:42px;line-height:1.1;text-align:center}
.inf-run{display:flex;flex-direction:column;align-items:center;gap:2px;margin:0 0 8px;padding:8px 10px;border-radius:12px;background:rgba(31,74,99,.1);border:1.5px solid #8bb7cf;font:600 14px var(--f-simple,system-ui)}
.inf-go{width:100%;margin:0 0 6px}
.inf-new{display:block;margin:0 auto 6px;min-height:40px;border:0;background:none;color:#6b1530;font:700 13.5px var(--f-simple,system-ui);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.inf-rules{margin:6px 0 12px;padding:10px 12px;list-style:none;display:flex;flex-direction:column;gap:6px;border-radius:12px;background:rgba(255,250,236,.85);border:1.5px solid #e2cfa4;text-align:left;font:500 13px/1.4 var(--f-simple,system-ui);color:#3a1f3d}
.inf-rt{margin:8px 0 6px;text-align:center}.inf-me{text-align:center;margin:0 0 8px;font:500 14px var(--f-simple,system-ui)}
.inf-panel .rk-r.cheat{opacity:.55;text-decoration:line-through}
body.inf-play #tHint .g3-sub{display:none!important}
body.inf-play #tHint::after{content:"−1 ❤️";display:block;font:600 10.5px/1.1 var(--f-simple,system-ui);opacity:.85;white-space:nowrap}
#g3T .inf-hp{font-size:.72em;letter-spacing:-1px;margin-left:4px;white-space:nowrap}
.inf-rem{margin:0 0 8px!important;padding:6px 10px;border-radius:10px;background:rgba(31,74,99,.1);font:600 13px var(--f-simple,system-ui)!important;font-style:normal!important}
.inf-rem a{color:#1f5a7a;text-decoration:underline}
.inf-box{text-align:center}.inf-box h2{margin:4px 0 8px}
.inf-rule{text-align:left;margin:0 0 10px;padding:8px 10px;border-radius:12px;background:#fffaf0;border:1.5px solid #e2cfa4}.inf-rule b{display:block;margin:0 0 3px}.inf-rule p{margin:0;font:500 14px/1.45 var(--f-simple,system-ui)}
.inf-bonus,.inf-rec{margin:8px 0 0;padding:6px 10px;border-radius:10px;background:rgba(214,171,79,.2);font:700 13.5px var(--f-simple,system-ui)}
.inf-res{min-height:1.3em;margin:8px 0 10px;font:500 13.5px var(--f-simple,system-ui)}.inf-gain{color:#1f5a7a;font-weight:800}
.inf-sum{font:500 15px/1.45 var(--f-simple,system-ui);margin:0 0 8px}
.inf-box .rv-stats b{white-space:nowrap}
.inf-break{position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);font-size:90px;z-index:120;pointer-events:none;animation:infBreak 1.2s ease-out forwards}
@keyframes infBreak{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}20%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}70%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-80%) scale(.9)}}`;
  document.head.appendChild(st);
  try{renderHome()}catch(_){}
})();
