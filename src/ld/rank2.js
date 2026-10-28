
/* ================= leaderboard v2: podium, "your place", progress bars, per-case tab ================= */
(function(){
  const panel=$("#pRank");if(!panel)return;
  const box=document.createElement("div");box.id="rk2";$("#rankList").before(box);panel.classList.add("rk2p");
  const RK={tab:"all",ch:null,lv:null,rows:null,loading:false};
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const av=a=>POR[a]||POR[AVS[0]];const cav=(r,c)=>typeof cosAv==="function"?cosAv(r.avatar,r.cos,c,r.pseudo):`<img src="${av(r.avatar)}" alt="">`;const ttl=r=>typeof cosTitle==="function"?cosTitle(r.cos):"";const dp=r=>typeof shopOn==="function"&&shopOn()?` data-prof="${esc(r.pseudo)}"`:"";
  const isMe=r=>{const p=ACC.profile;if(!p||!p.pseudo)return false;return r.id===p.pid||String(r.pseudo||"").trim().toLowerCase()===String(p.pseudo).trim().toLowerCase()};
  const place=n=>L(n===1?"1er":n+"ᵉ",n===1?"1st":n===2?"2nd":n===3?"3rd":n+"th",n+"위",n+"位");
  const cases=n=>L(`${n} ${n>1?"enquêtes":"enquête"}`,`${n} ${n>1?"cases":"case"}`,`사건 ${n}개`,`${n}件`);
  const hints=n=>L(`${n} ${n>1?"indices":"indice"}`,`${n} ${n>1?"hints":"hint"}`,`힌트 ${n}개`,`ヒント${n}回`);
  const tot=()=>DATA.length;
  function podium(rows){const top=rows.slice(0,3);if(!top.length)return "";const order=[top[1],top[0],top[2]];
    return `<div class="rk-pod">${order.map((r,j)=>{if(!r)return `<div class="rk-pc empty"></div>`;const n=rows.indexOf(r)+1;
      return `<div class="rk-pc p${n}${isMe(r)?" me":""}"${dp(r)}><div class="rk-pa">${n===1?`<span class="rk-crown">👑</span>`:""}${cav(r,"rk-pcav")}<span class="rk-md">${["🥇","🥈","🥉"][n-1]}</span></div>
        <b class="rk-pn">${esc(r.pseudo)}</b>${ttl(r)}<small>${cases(r.solved)}</small><span class="rk-ps">⏱ ${fmt(r.time)}<br>💡 ${hints(r.hints)}</span><div class="rk-ped"><span>${n}</span></div></div>`}).join("")}</div>`}
  function mine(rows){const p=ACC.profile;
    if(!p||!p.pseudo)return `<div class="rk-me none"><span>🕵️</span><div><b>${L("Tu n'es pas encore classé","You're not ranked yet","아직 순위에 없어요","まだランキングに載っていません")}</b><small>${L("Crée ton compte pour entrer dans le classement !","Create your account to join the leaderboard!","계정을 만들면 순위에 들어가요!","アカウントを作ってランキングに参加しよう！")}</small></div><button class="rk-cta" id="rkAcc">${L("Créer","Create","만들기","作成")}</button></div>`;
    const i=rows.findIndex(isMe);
    if(i<0)return `<div class="rk-me none"><span>🔎</span><div><b>${L("Résous une enquête pour apparaître ici !","Solve a case to show up here!","사건을 하나 해결하면 여기에 나와요!","事件を一つ解決するとここに表示されます！")}</b></div></div>`;
    const me=rows[i];let next="";
    if(i===0)next=L("Tu es en tête du classement ! 👑","You're top of the leaderboard! 👑","1위예요! 👑","ランキング1位です！👑");
    else{const a=rows[i-1],d=a.solved-me.solved;
      next=d>0?L(`Encore <b>${cases(d)}</b> pour dépasser <b>${esc(a.pseudo)}</b>`,`<b>${cases(d)}</b> more to overtake <b>${esc(a.pseudo)}</b>`,`<b>${esc(a.pseudo)}</b>님을 앞지르려면 <b>${cases(d)}</b> 더`,`<b>${esc(a.pseudo)}</b>さんを抜くまであと<b>${cases(d)}</b>`)
        :L(`À égalité avec <b>${esc(a.pseudo)}</b> : utilise moins d'indices pour passer devant`,`Tied with <b>${esc(a.pseudo)}</b>: use fewer hints to get ahead`,`<b>${esc(a.pseudo)}</b>님과 동점: 힌트를 덜 쓰면 앞설 수 있어요`,`<b>${esc(a.pseudo)}</b>さんと同点：ヒントを減らせば上に行けます`)}
    return `<div class="rk-me2"><b>${L(`Ta place : ${place(i+1)} sur ${rows.length}`,`Your place: ${place(i+1)} of ${rows.length}`,`내 순위: ${rows.length}명 중 ${place(i+1)}`,`あなたの順位：${rows.length}人中${place(i+1)}`)}</b><small>${next}</small></div>`}
  function row(r,n){const pc=Math.max(2,Math.round(100*r.solved/tot()));
    return `<li class="rk-r${isMe(r)?" me":""}"${dp(r)}><span class="rk-n">${n}</span>${cav(r,"")}<div class="rk-b"><div class="rk-t"><b>${esc(r.pseudo)}</b><strong>${cases(r.solved)}</strong></div>${ttl(r)}
      <small>⏱ ${fmt(r.time)} · 💡 ${hints(r.hints)}</small></div></li>`}
  /* average time per solved case (min. 5 cases to be ranked) */
  const MINC=5;
  /* fair speed ranking: each case compared with how long the other detectives took on that same case (server: spd = median ratio) */
  function averages(){const rows=RANK.rows;
    if(!rows)return `<p class="rk-msg">${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</p>`;
    const V=r=>r.spd>0?Math.round(100/r.spd):0;
    const all=rows.filter(r=>r.solved>0).map(r=>Object.assign({},r,{v:V(r),ah:r.hints/r.solved}));
    const ok=all.filter(r=>(r.nc||0)>=MINC&&r.v>0).sort((a,b)=>(a.cheat||0)-(b.cheat||0)||b.v-a.v||a.ah-b.ah),wait=all.filter(r=>!((r.nc||0)>=MINC&&r.v>0)).sort((a,b)=>(b.nc||0)-(a.nc||0));
    const line=(r,n)=>`<li class="rk-r${isMe(r)?" me":""}"${dp(r)}><span class="rk-n">${n?(["🥇","🥈","🥉"][n-1]||n):"·"}</span>${cav(r,"")}<div class="rk-b"><div class="rk-t"><b>${esc(r.pseudo)}</b><strong>${r.v?"⚡ "+r.v:"—"}</strong></div>${ttl(r)}
      <small>${r.v?(r.v===100?L("Vitesse habituelle","Usual speed","보통 속도","ふつうの速さ"):r.v>100?L(`${r.v-100} % plus rapide que d'habitude`,`${r.v-100}% faster than usual`,`평소보다 ${r.v-100}% 빠름`,`いつもより${r.v-100}%速い`):L(`${100-r.v} % plus lent que d'habitude`,`${100-r.v}% slower than usual`,`평소보다 ${100-r.v}% 느림`,`いつもより${100-r.v}%遅い`))+" · ":""}${cases(r.solved)}</small></div></li>`;
    const mi=ok.findIndex(isMe);
    return `<p class="rk-rule">${L(`<b>Vitesse</b> : chaque enquête est comparée au temps que les autres détectives ont mis <b>sur la même enquête</b> (un indice compte 1 min). <b>100</b> = la vitesse habituelle, plus c'est haut, plus tu es rapide. Peu importe le nombre d'enquêtes ou leur difficulté. Classé à partir de ${MINC} enquêtes comparées.`,
      `<b>Speed</b>: every case is compared with the time the other detectives took <b>on that same case</b> (a hint counts as 1 min). <b>100</b> = usual speed, higher is faster. The number of cases and their difficulty don't matter. Ranked from ${MINC} compared cases.`,
      `<b>속도</b>: 각 사건을 다른 탐정들이 <b>같은 사건</b>에 걸린 시간과 비교해요(힌트 1개 = 1분). <b>100</b>이 보통 속도이고, 높을수록 빨라요. 사건 수나 난이도는 상관없어요. 비교된 사건이 ${MINC}개 이상이면 순위에 올라요.`,
      `<b>スピード</b>：各事件を、ほかの探偵が<b>同じ事件</b>にかかった時間と比べます（ヒント1回＝1分）。<b>100</b>がふつうの速さで、高いほど速い。事件の数や難しさは関係ありません。比較できた事件が${MINC}件以上でランクイン。`)}</p>`+
      (mi>=0?`<div class="rk-me"><div class="rk-mep"><small>${L("Ta place","Your place","내 순위","あなたの順位")}</small><b>${place(mi+1)}</b></div><div class="rk-mei"><b>⚡ ${ok[mi].v}</b><small>${mi?L(`${ok[mi-1].v-ok[mi].v} points derrière <b>${esc(ok[mi-1].pseudo)}</b>`,`${ok[mi-1].v-ok[mi].v} points behind <b>${esc(ok[mi-1].pseudo)}</b>`,`<b>${esc(ok[mi-1].pseudo)}</b>님보다 ${ok[mi-1].v-ok[mi].v}점 뒤`,`<b>${esc(ok[mi-1].pseudo)}</b>さんより${ok[mi-1].v-ok[mi].v}ポイント下`):L("Le détective le plus rapide ! ⚡","The fastest detective! ⚡","가장 빠른 탐정! ⚡","いちばん速い探偵！⚡")}</small></div></div>`:"")+
      (ok.length?`<ol class="rk-list">${ok.map((r,k)=>line(r,r.cheat?0:k+1)).join("")}</ol>`:`<p class="rk-msg">${L("Personne n'a encore assez d'enquêtes comparées.","Nobody has enough compared cases yet.","아직 조건을 채운 사람이 없어요.","まだ条件を満たした人はいません。")}</p>`)+
      (wait.length?`<div class="ch-sub">${L(`Pas encore classés (moins de ${MINC} enquêtes comparées)`,`Not ranked yet (fewer than ${MINC} compared cases)`,`아직 순위 없음(비교된 사건 ${MINC}개 미만)`,`まだ順位なし（比較できた事件が${MINC}件未満）`)}</div><ol class="rk-list">${wait.map(r=>line(r,0)).join("")}</ol>`:"")}
  function general(){const rows=RANK.rows;
    if(RANK.err&&!rows)return `<p class="rk-msg">${L("Classement indisponible pour l'instant.","Leaderboard unavailable right now.","지금은 순위를 볼 수 없어요.","いまはランキングを表示できません。")}</p>`;
    if(!rows)return `<p class="rk-msg">${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</p>`;
    if(!rows.length)return `<p class="rk-msg">${L("Aucun détective inscrit pour l'instant.","No detectives registered yet.","아직 등록된 탐정이 없어요.","まだ探偵がいません。")}</p>`+mine(rows);
    return `<p class="rk-rule">${L("Classement : le plus d'enquêtes résolues, puis le moins d'indices, puis le temps total le plus court.","Ranking: most cases solved, then fewest hints, then shortest total time.","순위: 해결한 사건 수, 그다음 힌트 수, 그다음 총 시간.","順位：解決した事件の数、次にヒントの少なさ、次に合計時間。")}</p>`+mine(rows)+podium(rows)+(rows.length>3?`<ol class="rk-list">${rows.slice(3).map((r,k)=>row(r,k+4)).join("")}</ol>`:"")+
      `<details class="rk-how"><summary>${L("Comment le classement est-il calculé ?","How is the ranking worked out?","순위는 어떻게 정해지나요?","順位の決まり方は？")}</summary><ol>
       <li>${L("Le plus d'enquêtes résolues passe devant.","Most cases solved comes first.","해결한 사건이 많을수록 위예요.","解決した事件が多いほど上位。")}</li>
       <li>${L("À égalité : le moins d'indices utilisés.","If tied: fewest hints used.","동점이면 힌트를 적게 쓴 사람이 위예요.","同点ならヒントが少ない方が上位。")}</li>
       <li>${L("Puis : le temps total le plus court.","Then: shortest total time.","그다음은 총 시간이 짧은 사람이에요.","その次は合計時間が短い方。")}</li></ol></details>`}
  /* ---------- per-case tab ---------- */
  const tiersAll=()=>{const s=new Set();DATA.forEach((c,i)=>s.add(tierOf(i)));return [...s].sort((a,b)=>a-b)};
  const idxOf=t=>DATA.map((c,i)=>i).filter(i=>tierOf(i)===t);
  async function loadLv(){const i=RK.lv;RK.rows=null;RK.loading=true;draw();const rows=await levelRank(DATA[i].id);if(RK.lv!==i)return;RK.rows=rows;RK.loading=false;draw()}
  function perCase(){if(RK.ch==null){const t=typeof ci==="number"?tierOf(ci):0;RK.ch=t;RK.lv=ci}
    const ts=tiersAll(),chip=t=>`<button class="rk-chip${t===RK.ch?" on":""}" data-rkch="${t}">${esc(TX(CH_SHORT[t]))}</button>`;
    const grp=`<div class="rk-chg"><small>${L("Découverte","Discovery","디스커버리","ディスカバリー")}</small><div class="rk-chips">${ts.filter(t=>t<3).map(chip).join("")}</div>
      <small>${L("Histoire","Story","스토리","ストーリー")}</small><div class="rk-chips">${ts.filter(t=>t>=3).map(chip).join("")}</div></div>`;
    const lv=idxOf(RK.ch).map((i,k)=>`<button class="rk-lv${i===RK.lv?" on":""}${lvlSolved(i)?" ok":""}" data-rklv="${i}">${k+1}</button>`).join("");
    let res="";
    if(RK.lv==null||tierOf(RK.lv)!==RK.ch)res=`<p class="rk-msg">${L("Choisis une enquête ci-dessus.","Pick a case above.","위에서 사건을 고르세요.","上で事件を選んでね。")}</p>`;
    else{const m=META[DATA[RK.lv].id];res=`<h3 class="rk-ct">${esc(TX(m.title))}</h3>`;
      if(RK.loading)res+=`<p class="rk-msg">${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</p>`;
      else if(!RK.rows)res+=`<p class="rk-msg">${L("Classement indisponible hors ligne.","Ranking unavailable offline.","오프라인에서는 순위를 볼 수 없어요.","オフラインではランキングを表示できません。")}</p>`;
      else if(!RK.rows.length)res+=`<p class="rk-msg">${L("Personne n'a encore résolu cette enquête. Sois le premier !","Nobody has solved this case yet. Be the first!","아직 아무도 이 사건을 풀지 못했어요. 첫 번째가 되어 보세요!","まだ誰も解いていません。一番乗りを目指そう！")}</p>`;
      else res+=`<ol class="rk-list lv">${RK.rows.map((r,k)=>`<li class="rk-r${isMe(r)?" me":""}"><span class="rk-n">${["🥇","🥈","🥉"][k]||k+1}</span><img src="${av(r.avatar)}" alt=""><div class="rk-b"><div class="rk-t"><b>${esc(r.pseudo)}</b><strong>⏱ ${fmtT(r.time)}</strong></div><small>💡 ${hints(r.hints)} · 🎯 ${L(`${r.attempts} ${r.attempts>1?"tentatives":"tentative"}`,`${r.attempts} ${r.attempts>1?"attempts":"attempt"}`,`${r.attempts}번 시도`,`${r.attempts}回挑戦`)}</small></div></li>`).join("")}</ol>
        `}
    return `<p class="rk-rule">${L("Pour chaque enquête : le moins d'indices d'abord, puis le temps le plus court.","For each case: fewest hints first, then shortest time.","사건별: 힌트가 적은 순, 그다음 시간이 짧은 순.","事件ごと：ヒントが少ない順、次に時間が短い順。")}</p>`+grp+`<div class="rk-lvs">${lv}</div>`+res}
  function draw(){
    box.innerHTML=`<div class="rk-tabs"><button data-rktab="all" class="${RK.tab==="all"?"on":""}">🏆 ${L("Général","Overall","전체","総合")}</button><button data-rktab="avg" class="${RK.tab==="avg"?"on":""}">⚡ ${L("Vitesse","Speed","속도","スピード")}</button><button data-rktab="lv" class="${RK.tab==="lv"?"on":""}">🔍 ${L("Par enquête","By case","사건별","事件別")}</button></div>
      <div class="rk-body">${RK.tab==="all"?general():RK.tab==="avg"?averages():perCase()}</div>`;
    if(RK.tab==="lv"&&RK.lv!=null&&RK.rows==null&&!RK.loading&&tierOf(RK.lv)===RK.ch)loadLv()}
  box.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
    if(t.dataset.rktab){RK.tab=t.dataset.rktab;try{play("select")}catch(_){}draw();return}
    if(t.dataset.rkch!=null){RK.ch=+t.dataset.rkch;const f=idxOf(RK.ch);RK.lv=f[0];RK.rows=null;RK.loading=false;draw();return}
    if(t.dataset.rklv!=null){RK.lv=+t.dataset.rklv;RK.rows=null;RK.loading=false;draw();return}
    if(t.id==="rkAcc"){show("pAccount")}});
  renderRank=function(){const h=$("#pRankT");if(h)h.innerHTML=`<span class="rk-tro">🏆</span>${L("Classement","Leaderboard","순위","ランキング")}`;draw()};
  try{renderRank()}catch(e){}
})();
