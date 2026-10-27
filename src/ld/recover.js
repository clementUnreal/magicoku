/* ================= account recovery with a personal code (codes are only visible to the admin) ================= */
var ADMIN_NAME="clemonchichi";
function isAdminUser(){const p=ACC&&ACC.profile;return !!(p&&p.pseudo&&String(p.pseudo).trim().toLowerCase()===ADMIN_NAME)}
/* keep the account: ask the browser not to wipe our storage */
(function(){try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}})();
(function(){
  const esc=s=>String(s||"").replace(/[<>&"]/g,"");
  let open=false,codes=null,codesErr="";
  function form(){const el=$("#lgList");if(!el)return;
    el.innerHTML=`<label class="lgl">${L("Ton nom de détective","Your detective name","탐정 이름","探偵ネーム")}<input id="lgName" class="lgq" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(ACC.profile&&ACC.profile.pseudo||"")}"></label>
      <label class="lgl">${L("Ton code de récupération","Your recovery code","복구 코드","復元コード")}<input id="lgCode" class="lgq code" maxlength="14" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC123"></label>
      <button class="hb small" id="lgGo">${L("Récupérer","Recover","되찾기","取り戻す")}</button><small id="lgMsg" class="lgmsg"></small>`}
  async function restore(){const name=$("#lgName").value.trim(),code=$("#lgCode").value.trim(),msg=$("#lgMsg");
    if(!name||![6,12].includes(code.replace(/\W/g,"").length)){msg.textContent=L("Entre ton nom et le code à 6 caractères.","Enter your name and the 6-character code.","이름과 6자리 코드를 입력하세요.","名前と6文字のコードを入力してね。");return}
    msg.textContent=L("Vérification…","Checking…","확인 중…","確認中…");
    const pid=rid(),ptok=rid();let r,d;
    try{r=await fetch("/api/restore",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pseudo:name,code,newId:pid})});d=await r.json()}catch(_){msg.textContent=L("Pas de connexion. Réessaie dans un instant.","No connection. Try again in a moment.","연결이 없어요. 잠시 후 다시 시도하세요.","接続できません。少ししてからもう一度。");return}
    if(!r.ok){try{play("forbid")}catch(_){}msg.textContent=r.status===404?L("Aucun détective à ce nom.","No detective with that name.","그 이름의 탐정이 없어요.","その名前の探偵はいません。"):L("Code incorrect. Demande ton code à l'administrateur du jeu.","Wrong code. Ask the game's admin for your code.","코드가 틀렸어요. 게임 관리자에게 코드를 물어보세요.","コードが違います。ゲームの管理者にコードを聞いてね。");return}
    const prog=Object.assign({},(ACC.profile&&ACC.profile.progress)||{}),ids=new Set(DATA.map(c=>c.id));let n=0;
    for(const [lid,v] of Object.entries(d.progress||{})){if(!ids.has(lid))continue;if(!prog[lid]||!prog[lid].solved){prog[lid]={solved:true,hints:v.h||0,time:v.t||0,attempts:v.a||1,at:Date.now()};n++}}
    const want=Math.min(+(d.progress&&d.progress._n)||0,DATA.length);
    for(let i=0;i<DATA.length&&Object.values(prog).filter(v=>v&&v.solved).length<want;i++){const id=DATA[i].id;if(/^s\d+n\d+$/.test(id))continue;if(!prog[id]||!prog[id].solved){prog[id]={solved:true,hints:0,time:0,attempts:1,at:Date.now()};n++}}
    ACC.profile=Object.assign(ACC.profile||{games:0,created:Date.now()},{pseudo:d.pseudo,avatar:d.avatar||(ACC.profile&&ACC.profile.avatar)||AVS[0],progress:prog,legacy:true,pid,ptok});
    try{avSel=ACC.profile.avatar;nameDraft=null}catch(_){}
    await saveProfile();try{play("win")}catch(_){}open=false;codes=null;
    toast(L(`Progression de ${d.pseudo} récupérée : ${n} ${n>1?"enquêtes débloquées":"enquête débloquée"} !`,`${d.pseudo}'s progress recovered: ${n} ${n>1?"cases":"case"} unlocked!`,`${d.pseudo}의 진행 상황을 되찾았어요: 사건 ${n}개!`,`${d.pseudo}の進行状況を取り戻しました：${n}件！`));
    renderHome()}
  async function loadCodes(){const p=ACC.profile;codes=null;codesErr=L("Chargement…","Loading…","불러오는 중…","読み込み中…");renderHome();
    try{const r=await fetch("/api/admin/codes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok})});
      if(r.ok){codes=await r.json();codesErr=""}else codesErr=L("Cet appareil n'est pas reconnu comme administrateur.","This device isn't recognised as admin.","이 기기는 관리자로 인식되지 않아요.","この端末は管理者として認識されていません。")}
    catch(_){codesErr=L("Pas de connexion.","No connection.","연결이 없어요.","接続できません。")}renderHome()}
  function adminBox(){let b=$("#admCodes");const lg=$("#legacy");if(!lg)return;
    if(!isAdminUser()){if(b)b.remove();return}
    if(!b){b=document.createElement("div");b.id="admCodes";b.className="legacy adm";lg.after(b)}
    const f=(b.querySelector("#admQ")||{}).value||"";
    const rows=(codes||[]).filter(x=>!f||String(x.pseudo).toLowerCase().includes(f.toLowerCase()));
    b.innerHTML=`<p><b>🔑 ${L("Codes de récupération (visible par toi seul)","Recovery codes (only you can see this)","복구 코드 (나만 볼 수 있어요)","復元コード（あなただけに表示）")}</b><br>${L("Donne son code à un joueur qui a perdu sa progression : il l'entre avec son nom dans « Récupérer ma progression ».","Give a player who lost their progress their code: they enter it with their name in “Recover my progress”.","진행 상황을 잃은 플레이어에게 코드를 알려 주세요. ‘진행 상황 되찾기’에서 이름과 함께 입력하면 돼요.","進行状況をなくしたプレイヤーにコードを教えてあげて。「進行状況を取り戻す」で名前と一緒に入力します。")}</p>
      ${codes?`<input id="admQ" class="lgq" placeholder="${L("Chercher un joueur…","Search a player…","플레이어 검색…","プレイヤーを検索…")}" value="${esc(f)}"><div class="admlist">${rows.map(x=>`<div class="admrow" data-sus="${x.sus||0}"><img src="${POR[x.avatar]||POR[AVS[0]]}" alt=""><span><b>${esc(x.pseudo)}</b><small>${x.solved} ${L(x.solved>1?"enquêtes":"enquête","cases","개 사건","件")}</small></span><code>${x.code}</code></div>`).join("")}</div>`
        :`<button class="hb small" id="admShow">${L("Afficher les codes","Show the codes","코드 보기","コードを表示")}</button>${codesErr?`<small class="lgmsg">${codesErr}</small>`:""}`}`;
    if(f){const q=b.querySelector("#admQ");q.focus();q.setSelectionRange(f.length,f.length)}}
  document.addEventListener("input",e=>{if(e.target.id==="admQ")adminBox()});
  document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#lgBtn,#lgGo,#admShow");if(!t)return;e.stopPropagation();e.preventDefault();
    if(t.id==="lgBtn"){open=!open;renderHome();if(open)setTimeout(()=>{const c=$("#lgName");if(c&&!c.value)c.focus();else if($("#lgCode"))$("#lgCode").focus()},50)}
    else if(t.id==="lgGo")restore();else if(t.id==="admShow")loadCodes()},true);
  document.addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.target.id==="lgCode"||e.target.id==="lgName"))restore()});
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);const lg=$("#legacy");if(!lg)return;lg.hidden=location.protocol==="file:";
    $("#lgT").textContent=L("Ta progression a disparu (autre téléphone, données effacées) ? Demande ton code de récupération à l'administrateur du jeu, puis entre-le ici avec ton nom de détective.","Lost your progress (other phone, data wiped)? Ask the game's admin for your recovery code, then enter it here with your detective name.","진행 상황이 사라졌나요(다른 휴대폰, 데이터 삭제)? 게임 관리자에게 복구 코드를 받은 뒤, 탐정 이름과 함께 여기에 입력하세요.","進行状況が消えた（別のスマホ、データ削除）？ゲームの管理者に復元コードをもらって、探偵ネームと一緒にここに入力してね。");
    const keep=open&&$("#lgName")?[$("#lgName").value,$("#lgCode").value,$("#lgMsg").textContent]:null;
    if(open&&!$("#lgName"))form();else if(!open)$("#lgList").innerHTML="";
    if(keep){$("#lgName").value=keep[0];$("#lgCode").value=keep[1];$("#lgMsg").textContent=keep[2]}
    adminBox()};
  try{renderHome()}catch(e){}
})();
/* one-shot admin request (22/10): clemonchichi gets 50 solved levels with Henya's average time/hints per level */
(function(){
  const FLAG="magicoku:seed50";
  async function run(){const p=ACC.profile;if(!p||String(p.pseudo||"").trim().toLowerCase()!=="clemonchichi")return;
    try{if(localStorage.getItem(FLAG))return}catch(_){return}
    let rows=null;try{const r=await fetch("/api/leaderboard",{cache:"no-store"});rows=await r.json()}catch(_){return}
    const h=(rows||[]).find(x=>String(x.pseudo).trim().toLowerCase()==="henya");if(!h||!h.solved)return;
    const avgT=h.time/h.solved,avgH=h.hints/h.solved;
    const ids=DATA.map(c=>c.id).slice(0,50);p.progress=p.progress||{};
    let hintsLeft=Math.round(avgH*50),tAcc=0;
    ids.forEach((id,k)=>{const f=0.75+0.5*((k*37)%11)/10,t=Math.max(20,Math.round(avgT*f));tAcc+=t;
      const hh=Math.round((k+1)*avgH)-Math.round(k*avgH);
      p.progress[id]={solved:true,time:t,hints:hh,attempts:1,at:Date.now()}});
    /* keep the exact average: adjust the last level so the total matches */
    const last=p.progress[ids[49]];last.time=Math.max(20,last.time+Math.round(avgT*50)-tAcc);
    try{localStorage.setItem(FLAG,"1")}catch(_){}
    await saveProfile();try{renderHome()}catch(_){}
    toast(`Compte mis à jour : 50 niveaux (moyenne d'Henya : ${fmt(Math.round(avgT))} et ${avgH.toFixed(1)} indice par niveau).`)}
  setTimeout(run,3500);
})();

/* one-shot admin request (23/10): clemonchichi's daily puzzle time of 2026-10-23 set to 02:05 */
(function(){const DATE="2026-10-23",T=125,K="magicoku:fix:daily:"+DATE;
  async function run(){const p=ACC.profile;if(!p||String(p.pseudo||"").trim().toLowerCase()!=="clemonchichi"||!p.pid||!p.ptok)return;
    try{if(localStorage.getItem(K))return}catch(_){}
    if(typeof parisDate==="function"&&parisDate()!==DATE)return;
    try{const r=await fetch("/api/daily",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok,date:DATE,admin:"settime",t:T})});
      if(!r.ok)return;try{localStorage.setItem(K,"1");localStorage.setItem("magicoku:daily:"+DATE,JSON.stringify({t:T,e:0,h:0}))}catch(_){}
      try{if(typeof BETA!=="undefined")BETA.daily=null}catch(_){}}catch(_){}}
  setTimeout(run,2500);setTimeout(run,9000);
})();
