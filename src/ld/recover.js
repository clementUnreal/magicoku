/* ================= recover progress saved under the same detective name (other browser / app) ================= */
(function(){
  let busy=false,doneFor="";
  async function pull(){const p=ACC.profile;if(!p||!p.pseudo||busy)return 0;const key=p.pseudo.trim().toLowerCase();if(doneFor===key)return 0;busy=true;
    try{const r=await fetch("/api/progress?pseudo="+encodeURIComponent(p.pseudo),{cache:"no-store"});if(!r.ok)return 0;const remote=await r.json();doneFor=key;
      p.progress=p.progress||{};let n=0;const ids=new Set(DATA.map(c=>c.id));
      for(const [lid,x] of Object.entries(remote||{})){if(!ids.has(lid))continue;const cur=p.progress[lid];
        if(!cur||!cur.solved){p.progress[lid]={solved:true,hints:x.h||0,time:x.t||0,attempts:x.a||1,at:Date.now()};n++}}
      /* older rows only know a count: those were the first cases of discovery mode, in order */
      const cnt=Math.min(+(remote&&remote._n)||0,DATA.length);
      if(cnt>Object.values(p.progress).filter(x=>x&&x.solved).length){let k=0;
        for(let i=0;i<DATA.length&&k<cnt;i++){const id=DATA[i].id;if(/^s\d+n\d+$/.test(id))continue;k++;const cur=p.progress[id];
          if(!cur||!cur.solved){p.progress[id]={solved:true,hints:0,time:0,attempts:1,at:Date.now()};n++}}}
      if(n){try{localStorage.setItem(LKEY,JSON.stringify(p))}catch(e){}if(ACC.mode==="cloud"&&ACC.db){try{await ACC.db.doc("data/users/"+ACC.uid+"/profile").set(JSON.parse(JSON.stringify(p)))}catch(e){}}
        toast(L(`Progression retrouvée : ${n} ${n>1?"enquêtes récupérées":"enquête récupérée"} !`,`Progress found: ${n} ${n>1?"cases":"case"} recovered!`,`진행 상황을 찾았어요: 사건 ${n}개를 되찾았어요!`,`進行状況が見つかりました：${n}件の事件を取り戻しました！`));
        try{renderHome()}catch(e){}}
      return n}catch(e){return 0}finally{busy=false}}
  const _sr=syncRank;syncRank=function(){const args=arguments;pull().finally(()=>_sr.apply(this,args))};
  window.recoverProgress=pull;
  setTimeout(()=>{pull().then(n=>{if(n)_sr()})},300);
})();
/* keep the account: ask the browser not to wipe our storage, and explain how to come back */
(function(){
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);
    const p=ACC.profile,n=$("#accNote");if(!n||(p&&p.pseudo))return;
    if(!n.querySelector(".back-hint"))n.insertAdjacentHTML("beforeend",`<br><b class="back-hint">${L("Tu as déjà joué ? Entre exactement le même nom de détective : ta progression sera récupérée automatiquement.","Played before? Enter exactly the same detective name: your progress will be recovered automatically.","전에 플레이한 적이 있나요? 같은 탐정 이름을 그대로 입력하면 진행 상황이 자동으로 복구돼요.","前に遊んだことがある？同じ探偵ネームを入力すれば、進行状況が自動で引き継がれます。")}</b>`)};
})();
/* "Recover my progress": list every detective of the current leaderboard and restore their levels one by one */
(function(){
  let rows=[];
  const esc=s=>String(s||"").replace(/[<>&"]/g,"");
  function list(q){const el=$("#lgList");if(!el)return;const f=String(q||"").trim().toLowerCase();
    const sh=rows.map((x,i)=>[x,i]).filter(([x])=>!f||String(x.pseudo).toLowerCase().includes(f));
    el.innerHTML=`<input id="lgQ" class="lgq" placeholder="${L("Cherche ton nom…","Search your name…","이름 검색…","名前を検索…")}" value="${esc(q)}">`+
      (sh.length?sh.map(([x,i])=>`<button class="lgrow" data-lg2="${i}"><img src="${POR[x.avatar]||POR[AVS[0]]}" alt=""><span><b>${esc(x.pseudo)}</b><br><small>${x.solved} ${L(x.solved>1?"enquêtes résolues":"enquête résolue",x.solved>1?"cases solved":"case solved","개 사건 해결","件解決")}</small></span><span>→</span></button>`).join("")
        :`<small>${L("Aucun détective trouvé.","No detective found.","탐정을 찾지 못했어요.","探偵が見つかりません。")}</small>`)}
  document.addEventListener("input",e=>{if(e.target.id==="lgQ"){const v=e.target.value;list(v);const n=$("#lgQ");if(n){n.focus();n.setSelectionRange(v.length,v.length)}}});
  document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("#lgBtn,[data-lg2]");if(!t)return;e.stopPropagation();e.preventDefault();
    if(t.id==="lgBtn"){$("#lgList").innerHTML=`<small>${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</small>`;
      try{const r=await fetch("/api/leaderboard",{cache:"no-store"});rows=(await r.json()).filter(x=>x&&x.pseudo&&x.solved>0)}catch(_){rows=[]}
      if(!rows.length){$("#lgList").innerHTML=`<small>${L("Impossible de charger la liste pour l'instant.","Couldn't load the list right now.","지금은 목록을 불러올 수 없어요.","いまはリストを読み込めません。")}</small>`;return}
      list("");return}
    const x=rows[+t.dataset.lg2];if(!x)return;
    if(!t.dataset.armed){document.querySelectorAll("[data-lg2]").forEach(b=>{delete b.dataset.armed;b.querySelector("span:last-child").textContent="→"});t.dataset.armed=1;t.querySelector("span:last-child").textContent=L("C'est moi ✓","That's me ✓","저예요 ✓","わたしです ✓");return}
    let remote={};try{const r=await fetch("/api/progress?pseudo="+encodeURIComponent(x.pseudo),{cache:"no-store"});if(r.ok)remote=await r.json()}catch(_){}
    const prog=Object.assign({},(ACC.profile&&ACC.profile.progress)||{}),ids=new Set(DATA.map(c=>c.id));let n=0;
    for(const [lid,v] of Object.entries(remote||{})){if(!ids.has(lid))continue;if(!prog[lid]||!prog[lid].solved){prog[lid]={solved:true,hints:v.h||0,time:v.t||0,attempts:v.a||1,at:Date.now()};n++}}
    const want=Math.min(Math.max(+x.solved||0,+(remote&&remote._n)||0),DATA.length);
    for(let i=0;i<DATA.length&&Object.values(prog).filter(v=>v&&v.solved).length<want;i++){const id=DATA[i].id;if(/^s\d+n\d+$/.test(id))continue;if(!prog[id]||!prog[id].solved){prog[id]={solved:true,hints:0,time:0,attempts:1,at:Date.now()};n++}}
    ACC.profile=Object.assign(ACC.profile||{games:0,created:Date.now()},{pseudo:x.pseudo,avatar:x.avatar||(ACC.profile&&ACC.profile.avatar)||AVS[0],progress:prog,legacy:true,pid:rid(),ptok:rid()});
    try{avSel=ACC.profile.avatar;nameDraft=null}catch(_){}
    await saveProfile();try{play("win")}catch(_){}
    toast(L(`Progression de ${x.pseudo} récupérée : ${n} ${n>1?"enquêtes débloquées":"enquête débloquée"} !`,`${x.pseudo}'s progress recovered: ${n} ${n>1?"cases":"case"} unlocked!`,`${x.pseudo}의 진행 상황을 되찾았어요: 사건 ${n}개!`,`${x.pseudo}の進行状況を取り戻しました：${n}件！`));
    $("#lgList").innerHTML="";renderHome()},true);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);const lg=$("#legacy");if(!lg)return;lg.hidden=location.protocol==="file:";
    $("#lgT").textContent=L("Ta progression a disparu (autre téléphone, données effacées) ? Retrouve ton nom de détective dans la liste pour la récupérer.","Lost your progress (other phone, data wiped)? Find your detective name in the list to get it back.","진행 상황이 사라졌나요(다른 휴대폰, 데이터 삭제)? 목록에서 탐정 이름을 찾아 되찾으세요.","進行状況が消えた（別のスマホ、データ削除）？リストから探偵名を探して取り戻そう。")};
  try{renderHome()}catch(e){}
})();
