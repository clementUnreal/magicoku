/* ================= TIMER + ATTEMPTS + LEVEL COMPARISON ================= */
const fmtT=s=>{s=Math.max(0,Math.round(s||0));return s>=3600?Math.floor(s/3600)+":"+String(Math.floor(s%3600/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0"):String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
function timerActive(){return S&&!S.solved&&$("#home").hidden&&$("#reveal").hidden&&$("#tuto").hidden&&!document.hidden&&document.querySelectorAll(".modal:not([hidden])").length===0}
function renderTimer(){const el=$("#tmr");if(!el||!S)return;const on=timerActive();
  el.className="tmr"+(S.solved?" done":on?"":" paused");
  $("#tmrT").textContent=fmtT(S.time||0);
  $("#tmrA").textContent=`${S.attempts||0} ${L((S.attempts||0)>1?"tentatives":"tentative",(S.attempts||0)>1?"attempts":"attempt")}`;
  let hEl=$("#tmrH");if(!hEl){hEl=document.createElement("span");hEl.className="h";hEl.id="tmrH";$("#tmrA").after(hEl)}
  const nh=S.hints||0;hEl.textContent=`💡 ${nh} ${L(nh>1?"indices":"indice",nh>1?"hints":"hint")}`;hEl.classList.toggle("used",nh>0);
  $("#tmrP").hidden=on||S.solved;}
var hintTxt=n=>`${n} ${L(n>1?"indices":"indice",n>1?"hints":"hint")}`;
let _tick=0;
setInterval(()=>{if(!S)return;if(timerActive()){S.time=(S.time||0)+1;if(++_tick%5===0)save()}renderTimer()},1000);
document.addEventListener("visibilitychange",()=>{if(S)save();renderTimer()});
/* attempts: count each real check */
(function(){const el=$("#tValid"),orig=el.onclick;el.onclick=function(e){const P=M.people.length;if(Object.keys(S.place).length>=P){S.attempts=(S.attempts||0)+1;save()}const r=orig&&orig.call(this,e);renderTimer();return r}})();
/* reset clears timer too (fresh() has no time) ; opening a solved case to replay starts over */
(function(){const _o=openCase;openCase=function(i){_o(i);if(S.solved&&!S.replay){} renderTimer()}})();
/* record: active time + attempts */
recordWin=function(){
  const id=C.id;if(!ACC.profile)return;
  ACC.profile.progress=ACC.profile.progress||{};const prev=ACC.profile.progress[id];
  const cur={solved:true,hints:S.hints||0,time:Math.round(S.time||0),attempts:Math.max(1,S.attempts||1),at:Date.now()};
  const better=!prev||!prev.solved||cur.hints<prev.hints||(cur.hints===prev.hints&&(cur.time<prev.time||(cur.time===prev.time&&cur.attempts<(prev.attempts||99))));
  if(better)ACC.profile.progress[id]=cur;
  ACC.profile.games=(ACC.profile.games||0)+1;saveProfile();
  return {cur,best:ACC.profile.progress[id],improved:better};
};
/* reveal: show my stats + level ranking */
async function levelRank(id){try{const r=await fetch("/api/level?id="+encodeURIComponent(id),{cache:"no-store"});if(!r.ok)throw 0;return await r.json()}catch(e){return null}}
function rankHTML(rows,meId){if(!rows)return `<p class="lr-msg">${L("Classement indisponible hors ligne.","Ranking unavailable offline.")}</p>`;
  if(!rows.length)return `<p class="lr-msg">${L("Tu es le premier détective à résoudre cette enquête !","You're the first detective to solve this case!")}</p>`;
  const esc=s=>String(s).replace(/[<>&"]/g,"");const meIdx=rows.findIndex(r=>r.id===meId);
  const show=rows.slice(0,5);if(meIdx>=5)show.push(rows[meIdx]);
  return `<ol class="lr">${show.map(r=>{const i=rows.indexOf(r);return `<li class="${r.id===meId?"me":""}"><span class="p">${["🥇","🥈","🥉"][i]||i+1}</span><img src="${POR[r.avatar]||POR[AVS[0]]}" alt=""><b>${esc(r.pseudo)}</b><span class="s">⏱ ${fmtT(r.time)} · 🎯 ${r.attempts} · 💡 ${hintTxt(r.hints)}</span></li>`}).join("")}</ol>`+
    (meIdx>=0?`<p class="lr-me">${L(`Tu es ${meIdx+1}${meIdx===0?"er":"e"} sur ${rows.length} détective${rows.length>1?"s":""}`,`You're #${meIdx+1} of ${rows.length} detective${rows.length>1?"s":""}`)}</p>`:"")}
(function(){const _sr=showReveal;showReveal=function(){const t=S.time||0,a=Math.max(1,S.attempts||1);_sr();
  const box=$("#reveal .box p");if(!box)return;
  const block=document.createElement("div");block.className="lvstats";
  block.innerHTML=`<div class="mystat"><span>⏱ <b>${fmtT(t)}</b></span><span>🎯 <b>${a}</b> ${L(a>1?"tentatives":"tentative",a>1?"attempts":"attempt")}</span><span>💡 <b>${S.hints||0}</b> ${L((S.hints||0)>1?"indices":"indice",(S.hints||0)>1?"hints":"hint")}</span></div>`+
    (ACC.profile&&ACC.profile.pseudo?`<h4>${L("Classement de cette enquête","This case's ranking")}</h4><div id="lrBox"><p class="lr-msg">${L("Chargement…","Loading…")}</p></div>`:`<p class="lr-msg">${L("Crée ton compte pour te comparer aux autres détectives !","Create an account to compare with other detectives!")}</p>`);
  box.after(block);
  if(ACC.profile&&ACC.profile.pseudo){const id=C.id,me=ACC.profile.pid;setTimeout(async()=>{const rows=await levelRank(id);const el=$("#lrBox");if(el)el.innerHTML=rankHTML(rows,me)},900)}
}})();
/* leaderboard panel: per-level tab */
(function(){const _rr=renderRank;renderRank=function(){_rr();const panel=$("#pRank");if(!panel)return;
  let sel=$("#lrSel");if(!sel){const w=document.createElement("div");w.className="lrsel";w.innerHTML=`<select id="lrSel"></select><div id="lrLvl"></div>`;$("#rankList").after(w);sel=$("#lrSel");
    sel.onchange=async()=>{const v=sel.value;$("#lrLvl").innerHTML=v?`<p class="lr-msg">${L("Chargement…","Loading…")}</p>`:"";if(v)$("#lrLvl").innerHTML=rankHTML(await levelRank(v),ACC.profile&&ACC.profile.pid)}}
  const cur=sel.value;sel.innerHTML=`<option value="">${L("— Voir le classement d'une enquête —","— See a case's ranking —")}</option>`+DATA.map((c,i)=>`<option value="${c.id}">${META[c.id].level[LI()]} ${DATA.filter((d,j)=>j<i&&tierOf(j)===tierOf(i)).length+1} · ${META[c.id].title[LI()]}</option>`).join("");sel.value=cur;
}})();
renderTimer();
