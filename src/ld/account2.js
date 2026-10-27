
/* ================= account deletion (in-app, required by Google Play) + admin view of reported messages ================= */
(function(){
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const acc=()=>ACC.profile&&ACC.profile.pseudo&&ACC.profile.pid&&ACC.profile.ptok?ACC.profile:null;
  const css=document.createElement("style");css.textContent=`.acc-del{margin-top:14px;padding-top:12px;border-top:1px dashed rgba(201,162,90,.6);text-align:center}
.acc-del button{min-height:44px;padding:0 16px;border-radius:999px;border:1.5px solid #c0392b;background:transparent;color:#ff9aa6;font:700 14px var(--f-simple,system-ui)!important;cursor:pointer}
#accDelM input{width:100%;box-sizing:border-box;min-height:46px;background:#fff;color:#2e1d33;color-scheme:light;margin:8px 0 12px;padding:0 12px;border-radius:12px;border:1.5px solid #c9a25a;font:600 16px var(--f-simple,system-ui)!important}
#accDelM .g3-story{font:500 15px/1.45 var(--f-simple,system-ui)!important;color:#3a1f3d}
.rep-list{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.rep-it{background:#fffaf0;border:1.5px solid #e2cfa4;border-radius:12px;padding:8px 10px;text-align:left;font:500 13.5px/1.4 var(--f-simple,system-ui)!important;color:#3a1f3d}
.rep-it b{color:#8e1f33}.rep-it .acts{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.rep-it button{min-height:36px;padding:0 10px;border-radius:999px;border:1.5px solid #c9a25a;background:#fff;font:700 12.5px var(--f-simple,system-ui)!important;cursor:pointer}`;
  document.head.appendChild(css);
  /* ---------- delete my account ---------- */
  function paintDel(){const pan=$("#pAccount");if(!pan)return;let d=$("#accDel");
    if(!acc()){if(d)d.remove();return}
    if(!d){d=document.createElement("div");d.id="accDel";d.className="acc-del"}if(pan.lastElementChild!==d)pan.appendChild(d);
    d.innerHTML=`<button id="accDelBtn">🗑️ ${L("Supprimer mon compte","Delete my account","계정 삭제","アカウントを削除")}</button>`}
  function openDel(){const p=acc();if(!p)return;let m=$("#accDelM");if(!m){m=document.createElement("div");m.id="accDelM";m.className="modal g3-sheet";document.body.appendChild(m);m.addEventListener("click",e=>{if(e.target===m)m.hidden=true})}
    m.innerHTML=`<div class="mbox"><button class="mclose" aria-label="✕">✕</button><h2>🗑️ ${L("Supprimer mon compte ?","Delete my account?","계정을 삭제할까요?","アカウントを削除しますか？")}</h2>
      <p class="g3-story">${L("Ton pseudo, ta progression, tes éclats de lune, tes objets de la boutique, tes messages et tes scores du jour seront définitivement effacés. C'est irréversible.","Your name, progress, moon shards, shop items, messages and daily scores will be permanently erased. This can't be undone.","닉네임, 진행 상황, 달 조각, 상점 아이템, 메시지, 오늘의 점수가 영구히 삭제돼요. 되돌릴 수 없어요.","名前・進行状況・月のかけら・ショップのアイテム・メッセージ・今日のスコアが完全に消去されます。元に戻せません。")}</p>
      <label class="g3-story">${L(`Pour confirmer, écris ton pseudo : <b>${esc(p.pseudo)}</b>`,`To confirm, type your name: <b>${esc(p.pseudo)}</b>`,`확인을 위해 닉네임을 입력하세요: <b>${esc(p.pseudo)}</b>`,`確認のため名前を入力：<b>${esc(p.pseudo)}</b>`)}<input id="accDelIn" autocomplete="off" autocapitalize="off" spellcheck="false"></label>
      <div class="g3-list"><button class="pill red g3-go" id="accDelGo" style="justify-content:center">${L("Supprimer définitivement","Delete permanently","영구 삭제","完全に削除")}</button><button id="accDelNo" style="justify-content:center">${L("Annuler","Cancel","취소","キャンセル")}</button></div><p class="cp-msg" id="accDelMsg" style="color:#a8323e;font-weight:700"></p></div>`;
    m.hidden=false;m.querySelector(".mclose").onclick=()=>m.hidden=true;$("#accDelNo").onclick=()=>m.hidden=true;
    $("#accDelGo").onclick=async()=>{const v=$("#accDelIn").value.trim();if(v.toLowerCase()!==String(p.pseudo).trim().toLowerCase()){$("#accDelMsg").textContent=L("Le pseudo ne correspond pas.","The name doesn't match.","닉네임이 일치하지 않아요.","名前が一致しません。");return}
      $("#accDelMsg").textContent=L("Suppression…","Deleting…","삭제 중…","削除中…");
      let r=null;try{r=await fetch("/api/account",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok,action:"delete",confirm:v})})}catch(_){}
      if(!r||!r.ok){$("#accDelMsg").textContent=L("Impossible pour l'instant (connexion ?). Réessaie.","Not possible right now (connection?). Try again.","지금은 할 수 없어요(연결?). 다시 시도하세요.","今はできません（接続？）。もう一度。");return}
      try{Object.keys(localStorage).filter(k=>/^(magicoku:|crimes-mignons)/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(_){}
      m.hidden=true;toast(L("Ton compte a été supprimé.","Your account has been deleted.","계정이 삭제되었어요.","アカウントを削除しました。"));setTimeout(()=>location.reload(),1200)}}
  document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#accDelBtn")){e.stopPropagation();openDel()}},true);
  /* ---------- admin: reported messages ---------- */
  let reps=null;
  async function loadReps(action,extra){const p=acc();if(!p)return;try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({id:p.pid,token:p.ptok,action:action||"reports"},extra||{}))});if(r.ok)reps=(await r.json()).reports}catch(_){}paintReps()}
  function paintReps(){const box=$("#admCodes");if(!box||typeof isAdminUser!=="function"||!isAdminUser())return;let w=$("#admReps");
    if(!w){w=document.createElement("div");w.id="admReps";box.appendChild(w)}
    w.innerHTML=`<p style="margin-top:12px"><b>🚩 ${L("Messages signalés","Reported messages","신고된 메시지","通報されたメッセージ")}</b></p>`+(reps==null?`<button class="hb small" id="admRepLoad">${L("Afficher les signalements","Show reports","신고 보기","通報を表示")}</button>`:
      reps.length?`<div class="rep-list">${reps.map(r=>`<div class="rep-it"><b>${esc(r.who)}</b> · ${new Date(r.at).toLocaleString()} · ${r.where==="dm"?L("message privé","private message","개인 메시지","個人メッセージ"):L("fil global","global thread","전체 대화","全体チャット")}<br>« ${esc(r.t)} »<br><small>${L("signalé par","reported by","신고자","通報者")} ${esc(r.by)}</small>
        <div class="acts">${r.where!=="dm"&&r.mid?`<button data-repdel="${esc(r.mid)}" data-rid="${esc(r.i)}">${L("Supprimer le message","Delete the message","메시지 삭제","メッセージを削除")}</button>`:""}<button data-repok="${esc(r.i)}">${L("Classer","Dismiss","처리 완료","対応済み")}</button></div></div>`).join("")}</div>`:`<p class="rk-msg">${L("Aucun signalement.","No reports.","신고가 없어요.","通報はありません。")}</p>`)}
  document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("#admRepLoad,[data-repok],[data-repdel]");if(!t)return;e.stopPropagation();
    if(t.id==="admRepLoad"){loadReps();return}
    if(t.dataset.repdel){const p=acc();try{await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok,action:"delete",mid:t.dataset.repdel})})}catch(_){}loadReps("dismiss",{rid:t.dataset.rid});return}
    if(t.dataset.repok){loadReps("dismiss",{rid:t.dataset.repok})}},true);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{paintDel();paintReps()}catch(_){}};
  try{paintDel()}catch(_){}
})();

/* the detective name is permanent once the account exists (wallet, Google link, chat and rankings are keyed on it) */
(function(){const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{const p=ACC.profile,inp=$("#accName");if(!inp)return;let n=$("#accNameLock");
  if(p&&p.pseudo){if(!n){n=document.createElement("small");n.id="accNameLock";n.className="acc-lock";inp.after(n)}n.textContent="🔒 "+L("Ton nom de détective est définitif : il ne peut plus être changé.","Your detective name is permanent: it can no longer be changed.","탐정 이름은 고정이에요. 더 이상 바꿀 수 없어요.","探偵ネームは確定です。もう変更できません。")}
  else if(n)n.remove()}catch(_){}}
  const st=document.createElement("style");st.textContent="#accName.locked{opacity:.75;background:#efe6d2;cursor:not-allowed}.acc-lock{display:block;margin:4px 2px 0;font:600 12.5px var(--f-simple,system-ui);color:#6b4a3a}";document.head.appendChild(st)})();
