
/* ================= leaderboard v2: podium, "your place", progress bars, per-case tab ================= */
(function(){
  const panel=$("#pRank");if(!panel)return;
  const box=document.createElement("div");box.id="rk2";$("#rankList").before(box);panel.classList.add("rk2p");
  const RK={tab:"all",ch:null,lv:null,rows:null,loading:false};
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const av=a=>POR[a]||POR[AVS[0]];const cav=(r,c)=>typeof cosAv==="function"?cosAv(r.avatar,r.cos,c,r.pseudo):`<img src="${av(r.avatar)}" alt="">`;const ttl=r=>typeof cosTitle==="function"?cosTitle(r.cos):"";const dp=r=>typeof shopOn==="function"&&shopOn()?` data-prof="${esc(r.pseudo)}"`:"";
  const isMe=r=>{const p=ACC.profile;if(!p||!p.pseudo)return false;return r.id===p.pid||String(r.pseudo||"").trim().toLowerCase()===String(p.pseudo).trim().toLowerCase()};
  const place=n=>L(n===1?"1re":n+"ᵉ",n===1?"1st":n===2?"2nd":n===3?"3rd":n+"th",n+"위",n+"位");
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
    return `<div class="rk-me"><div class="rk-mep"><small>${L("Ta place","Your place","내 순위","あなたの順位")}</small><b>${place(i+1)}</b></div><div class="rk-mei"><b>${L(`sur ${rows.length} détectives`,`out of ${rows.length} detectives`,`탐정 ${rows.length}명 중`,`探偵${rows.length}人中`)}</b><small>${next}</small></div></div>`}
  function row(r,n){const pc=Math.max(2,Math.round(100*r.solved/tot()));
    return `<li class="rk-r${isMe(r)?" me":""}"${dp(r)}><span class="rk-n">${n}</span>${cav(r,"")}<div class="rk-b"><div class="rk-t"><b>${esc(r.pseudo)}</b><strong>${cases(r.solved)}</strong></div>${ttl(r)}
      <div class="rk-bar"><i style="width:${pc}%"></i></div><small>⏱ ${fmt(r.time)} · 💡 ${hints(r.hints)}</small></div></li>`}
  function general(){const rows=RANK.rows;
    if(RANK.err&&!rows)return `<p class="rk-msg">${L("Classement indisponible pour l'instant.","Leaderboard unavailable right now.","지금은 순위를 볼 수 없어요.","いまはランキングを表示できません。")}</p>`;
    if(!rows)return `<p class="rk-msg">${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</p>`;
    if(!rows.length)return `<p class="rk-msg">${L("Aucun détective inscrit pour l'instant.","No detectives registered yet.","아직 등록된 탐정이 없어요.","まだ探偵がいません。")}</p>`+mine(rows);
    return podium(rows)+mine(rows)+(rows.length>3?`<ol class="rk-list">${rows.slice(3).map((r,k)=>row(r,k+4)).join("")}</ol>`:"")+
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
        <p class="rk-note">${L("Classé par indices utilisés, puis par temps.","Ranked by hints used, then time.","힌트 사용 수, 그다음 시간 순이에요.","ヒントの数、次に時間で順位が決まります。")}</p>`}
    return grp+`<div class="rk-lvs">${lv}</div>`+res}
  function draw(){
    box.innerHTML=`<div class="rk-tabs"><button data-rktab="all" class="${RK.tab==="all"?"on":""}">🏆 ${L("Général","Overall","전체","総合")}</button><button data-rktab="lv" class="${RK.tab==="lv"?"on":""}">🔍 ${L("Par enquête","By case","사건별","事件別")}</button></div>
      <div class="rk-body">${RK.tab==="all"?general():perCase()}</div>`;
    if(RK.tab==="lv"&&RK.lv!=null&&RK.rows==null&&!RK.loading&&tierOf(RK.lv)===RK.ch)loadLv()}
  box.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
    if(t.dataset.rktab){RK.tab=t.dataset.rktab;try{play("select")}catch(_){}draw();return}
    if(t.dataset.rkch!=null){RK.ch=+t.dataset.rkch;const f=idxOf(RK.ch);RK.lv=f[0];RK.rows=null;RK.loading=false;draw();return}
    if(t.dataset.rklv!=null){RK.lv=+t.dataset.rklv;RK.rows=null;RK.loading=false;draw();return}
    if(t.id==="rkAcc"){show("pAccount")}});
  renderRank=function(){const h=$("#pRankT");if(h)h.innerHTML=`<span class="rk-tro">🏆</span>${L("Classement","Leaderboard","순위","ランキング")}`;draw()};
  try{renderRank()}catch(e){}
})();
