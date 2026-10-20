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
