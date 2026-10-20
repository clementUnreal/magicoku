/* ================= ACCOUNT / PROGRESS ================= */
const ACC={mode:"none",uid:null,profile:null,db:null};
const LKEY="magicoku:account";
function locProfile(){try{return JSON.parse(localStorage.getItem(LKEY)||"null")}catch(e){return null}}
async function initAccount(){
  ACC.profile=locProfile();if(ACC.profile)ACC.mode="local";
  try{const user=await claude.use("user"),db=await claude.use("db");
    if(user&&db){const uid=await user.id();if(uid){ACC.db=db;ACC.uid=uid;ACC.mode="cloud";
      const snap=await db.doc("data/users/"+uid+"/profile").get();
      if(snap.exists){ACC.profile=snap.data();try{localStorage.setItem(LKEY,JSON.stringify(ACC.profile))}catch(e){}}
      else if(ACC.profile&&ACC.profile.pseudo){await saveProfile()} }}}catch(e){}
  if(ACC.profile&&ACC.profile.pseudo)syncRank();
  renderHome();
}
const rid=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2));
function syncRank(){const p=ACC.profile;if(!p||!p.pseudo)return;
  if(!p.pid||!p.ptok){p.pid=rid();p.ptok=rid();try{localStorage.setItem(LKEY,JSON.stringify(p))}catch(e){}}
  const send=()=>fetch("/api/leaderboard",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok,pseudo:p.pseudo,avatar:p.avatar||"",progress:p.progress||{}})});
  /* 403 = this id belongs to another key (account recovered twice, storage wiped…): start a fresh line instead of never saving again */
  send().then(r=>{if(r&&r.status===403){p.pid=rid();p.ptok=rid();try{localStorage.setItem(LKEY,JSON.stringify(p))}catch(e){}return send()}}).catch(()=>{})}
async function saveProfile(){
  syncRank();
  try{localStorage.setItem(LKEY,JSON.stringify(ACC.profile))}catch(e){}
  if(ACC.mode==="cloud"&&ACC.db){try{await ACC.db.doc("data/users/"+ACC.uid+"/profile").set(JSON.parse(JSON.stringify(ACC.profile)))}catch(e){toast(L("Sauvegarde en ligne impossible pour l'instant.","Couldn't save online right now."))}}
}
function recordWin(){
  const id=C.id,t=Math.round((Date.now()-(window._t0||Date.now()))/1000);
  if(!ACC.profile)return;
  ACC.profile.progress=ACC.profile.progress||{};const prev=ACC.profile.progress[id];
  const cur={solved:true,hints:S.hints||0,time:t,at:Date.now()};
  if(!prev||cur.hints<prev.hints||(cur.hints===prev.hints&&cur.time<prev.time))ACC.profile.progress[id]=cur;
  ACC.profile.games=(ACC.profile.games||0)+1;saveProfile();
}
(function(){const _r=showReveal;showReveal=function(){_r();recordWin()};
  const _o=openCase;openCase=function(i){_o(i);window._t0=Date.now()}})();
const fmt=s=>s>=3600?Math.floor(s/3600)+"h"+String(Math.floor(s%3600/60)).padStart(2,"0"):Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
/* ================= LEVELS / UNLOCK ================= */
function tierOf(i){const id=DATA[i].id;if(id[0]==="s"&&/^s\d+n\d+$/.test(id))return 2+parseInt(id.slice(1));return id==="facile"||id[0]==="f"?0:id==="moyen"||id[0]==="m"?1:2}
function lvlSolved(i){const id=DATA[i].id,p=ACC.profile;if(p&&p.progress&&p.progress[id]&&p.progress[id].solved)return true;try{return !!(JSON.parse(localStorage.getItem("crimes-mignons-wiz:"+id)||"{}").solved)}catch(e){return false}}
function unlocked(i){return i===0||lvlSolved(i-1)||lvlSolved(i)}
let lastSel=null;
function renderLvInfo(){const el=$("#lvinfo");if(!el||lastSel==null)return;const i=lastSel,m=META[DATA[i].id],c=DATA[i],pr=ACC.profile&&ACC.profile.progress&&ACC.profile.progress[c.id];
  el.innerHTML=`<div><b>${m.title[LI()]}</b><small>${m.level[LI()]} · ${c.rooms.length}×${c.rooms.length} · ${m.people.length-1} ${L("suspects","suspects")}${pr?` · ✓ ${fmt(pr.time)}`:""}</small></div><button class="hb big" id="lvGo">${lvlSolved(i)?L("Rejouer","Replay"):L("Enquêter","Investigate")}</button>`}
/* ================= HOME ================= */
const AVS=Object.keys(POR);
let avSel=null,nameDraft=null;
const RANK={rows:null,err:false};
async function loadRank(){RANK.err=false;try{const r=await fetch("/api/leaderboard",{cache:"no-store"});if(!r.ok)throw 0;RANK.rows=await r.json()}catch(e){RANK.err=true}renderHome()}
function renderRank(){const p=ACC.profile,me=p&&p.pid,esc=s=>String(s).replace(/[<>&"]/g,"");
  $("#pRankT").textContent=L("Classement des détectives","Detective leaderboard");
  $("#rankNote").textContent=p&&p.pseudo?L("Classé par enquêtes résolues, puis indices utilisés, puis temps total.","Ranked by cases solved, then hints used, then total time.")
    :L("Crée ton compte pour apparaître dans le classement !","Create your account to appear on the leaderboard!");
  const el=$("#rankList");
  if(RANK.err&&!RANK.rows){el.innerHTML=`<p class="rank-msg">${L("Classement indisponible pour l'instant.","Leaderboard unavailable right now.")}</p>`;return}
  if(!RANK.rows){el.innerHTML=`<p class="rank-msg">${L("Chargement…","Loading…")}</p>`;return}
  if(!RANK.rows.length){el.innerHTML=`<p class="rank-msg">${L("Aucun détective inscrit pour l'instant.","No detectives registered yet.")}</p>`;return}
  el.innerHTML=RANK.rows.map((r,i)=>`<li class="rank-row${r.id===me?" me":""}"><span class="pos">${["🥇","🥈","🥉"][i]||i+1}</span><img src="${POR[r.avatar]||POR[AVS[0]]}" alt=""><b>${esc(r.pseudo)}</b>
    <span class="sc"><strong>${r.solved} / ${DATA.length}</strong>${r.solved?`${fmt(r.time)} · 💡 ${r.hints} ${L(r.hints>1?"indices":"indice",r.hints>1?"hints":"hint")}`:""}</span></li>`).join("")}
document.addEventListener("input",e=>{if(e.target.id==="accName")nameDraft=e.target.value});
function show(panel){["hMain","pLevels","pOptions","pAccount","pRank"].forEach(id=>$("#"+id).hidden=id!==panel);renderHome()}
function renderHome(){
  const p=ACC.profile;
  $("#hSub").textContent=L("Les enquêtes de l'Académie de Brumelune","The Brumelune Academy mysteries");
  $("#hWho").innerHTML=p&&p.pseudo?`<img src="${POR[p.avatar]||POR[AVS[0]]}" alt="">${L("Bonjour","Hello")}, ${p.pseudo.replace(/[<>&]/g,"")} !`:"";
  $("#hPlay").textContent=L("Mode découverte","Discovery mode");$("#hRules").textContent=L("Règles","Rules");$("#hOptions").textContent=L("Options","Options");
  $("#hAccount").textContent=p&&p.pseudo?L("Mon compte","My account"):L("Créer mon compte","Create my account");
  $("#hRank").textContent=L("Classement","Leaderboard");renderRank();
  document.querySelectorAll("[data-back]").forEach(b=>b.textContent=L("← Retour","← Back"));
  // levels
  $("#pLevelsT").textContent=L("Choisis ton enquête","Choose your case");
  const TIERS=(typeof CHAPTERS!=="undefined"&&CHAPTERS)||[["Facile","Easy"],["Moyen","Medium"],["Difficile","Hard"]];
  $("#lvls").innerHTML=TIERS.map((tn,t)=>{const idx=DATA.map((c,i)=>i).filter(i=>tierOf(i)===t);const nd=idx.filter(lvlSolved).length;const open=unlocked(idx[0]);
    return `<section class="tier${open?"":" locked"}"><header><h3>${tn[LI()]}</h3><span>${open?`${nd} / ${idx.length}`:"🔒 "+L(`Termine « ${TX(TIERS[t-1])} » pour débloquer`,`Finish “${TX(TIERS[t-1])}” to unlock`)}</span></header>
    <div class="tiles">${idx.map((i,k)=>{const ok=lvlSolved(i),u=unlocked(i),pr=p&&p.progress&&p.progress[DATA[i].id];
      return `<button class="tile${ok?" done":""}${u?"":" lockd"}${u&&!ok?" next":""}" data-l="${i}" aria-label="${META[DATA[i].id].title[LI()]}"><b>${u?k+1:"🔒"}</b><i>${ok?(pr?fmt(pr.time):"✓"):u?"":""}</i></button>`}).join("")}</div></section>`}).join("")+
    (lastSel!=null?`<div class="lvinfo" id="lvinfo"></div>`:"");
  renderLvInfo();
  // options
  $("#pOptionsT").textContent=L("Options","Options");$("#oSoundL").textContent=L("Son","Sound");$("#oSound").setAttribute("aria-pressed",SND.on);$("#oSound").setAttribute("aria-label",L("Son","Sound"));
  $("#oLangL").textContent=L("Langue","Language");$("#oFR").setAttribute("aria-pressed",LANG==="fr");$("#oEN").setAttribute("aria-pressed",LANG==="en");
  $("#oTutoL").textContent=L("Tutoriel","Tutorial");$("#oTuto").textContent=L("Revoir","Replay");
  $("#oResetL").textContent=L("Progression","Progress");$("#oReset").textContent=L("Tout réinitialiser","Reset everything");
  // account
  $("#pAccountT").textContent=p&&p.pseudo?L("Mon compte","My account"):L("Créer mon compte","Create my account");
  $("#accNote").textContent=ACC.mode==="cloud"?L("Ton compte est lié à ton identité Claude : ta progression te suit sur tous tes appareils.","Your account is linked to your Claude sign-in: your progress follows you on all your devices.")
    :(typeof window.claude==="undefined"?L("Ton compte et ta progression sont enregistrés sur cet appareil.","Your account and progress are saved on this device."):L("Compte enregistré sur cet appareil. Ouvre le jeu connecté à Claude pour le retrouver partout.","Account saved on this device. Open the game signed in to Claude to have it everywhere."));
  $("#accNameL").textContent=L("Ton nom de détective","Your detective name");$("#accName").placeholder=L("Ex. : Inspectrice Lune","E.g. Inspector Moon");
  if(document.activeElement!==$("#accName"))$("#accName").value=nameDraft!=null?nameDraft:(p&&p.pseudo||"");
  if(avSel==null)avSel=p&&p.avatar||AVS[0];
  $("#accAvL").textContent=L("Ton portrait","Your portrait");
  $("#avs").innerHTML=AVS.map(k=>`<button class="av" data-av="${k}" aria-pressed="${k===avSel}"><img src="${POR[k]}" alt=""></button>`).join("");
  $("#accSave").textContent=p&&p.pseudo?L("Enregistrer","Save"):L("Créer mon compte","Create my account");
  const lg=$("#legacy");lg.hidden=!!(p&&p.legacy)||/netlify\.app$/.test(location.hostname)||location.protocol==="file:";
  $("#lgT").textContent=L("Tu jouais déjà sur l'ancienne adresse du jeu ? Retrouve ton nom pour récupérer tes niveaux.","Already played on the game's old address? Find your name to get your levels back.");
  $("#lgBtn").textContent=L("Récupérer ma progression","Recover my progress");
  const solved=p&&p.progress?Object.values(p.progress).filter(x=>x.solved).length:0;
  $("#accStats").innerHTML=p&&p.pseudo?`<div class="row"><span>${L("Enquêtes résolues","Cases solved")}</span><b>${solved} / ${DATA.length}</b></div>`+
    DATA.map(c=>{const x=p.progress&&p.progress[c.id];return `<div class="row"><span>${META[c.id].title[LI()]}</span><b>${x?`${fmt(x.time)} · 💡 ${x.hints} ${L(x.hints>1?"indices":"indice",x.hints>1?"hints":"hint")}`:"—"}</b></div>`}).join(""):"";
}
document.addEventListener("click",async e=>{const t=e.target.closest("button");if(!t)return;
  if(t.id==="hPlay")show("pLevels");else if(t.id==="hOptions")show("pOptions");else if(t.id==="hAccount")show("pAccount");else if(t.id==="hRank"){show("pRank");loadRank()}
  else if(t.id==="hRules"){openModal("#mRules")}
  else if(t.hasAttribute("data-back"))show("hMain");
  else if(t.classList.contains("tile")){const i=+t.dataset.l;if(!unlocked(i)){play("forbid");toast(L("Résous d'abord le niveau précédent.","Solve the previous level first."));return}lastSel=i;renderHome();play("select");$("#home").hidden=true;openCase(i);let seen=null;try{seen=localStorage.getItem("magicoku:tuto")}catch(_){}if(!seen)setTimeout(()=>tuto(0),400)}
  else if(t.id==="lvGo"){$("#home").hidden=true;openCase(lastSel);let seen=null;try{seen=localStorage.getItem("magicoku:tuto")}catch(_){}if(!seen)setTimeout(()=>tuto(0),400)}
  else if(t.id==="oSound"){setSound(!SND.on);renderHome()}
  else if(t.id==="oFR"||t.id==="oEN"){(t.id==="oFR"?$("#lFR"):$("#lEN")).click();renderHome()}
  else if(t.id==="oTuto"){$("#home").hidden=true;tuto(0)}
  else if(t.id==="oReset"){if(t.dataset.armed){delete t.dataset.armed;try{Object.keys(localStorage).filter(k=>k.startsWith("crimes-mignons")).forEach(k=>localStorage.removeItem(k))}catch(_){}
      if(ACC.profile){ACC.profile.progress={};ACC.profile.games=0;saveProfile()}openCase(ci);toast(L("Progression réinitialisée.","Progress reset."));renderHome()}
    else{t.dataset.armed=1;t.textContent=L("Sûr ? Touche encore","Sure? Tap again");setTimeout(()=>{delete t.dataset.armed;renderHome()},2500)}}
  else if(t.classList.contains("av")){avSel=t.dataset.av;play("select");renderHome()}
  else if(t.id==="lgBtn"){$("#lgList").innerHTML=`<small>${L("Chargement…","Loading…")}</small>`;try{const r=await fetch("/api/legacy",{cache:"no-store"});const rows=await r.json();
      $("#lgList").innerHTML=rows.length?rows.map((x,i)=>`<button class="lgrow" data-lg="${i}"><img src="${POR[x.avatar]||POR[AVS[0]]}" alt=""><span><b>${x.pseudo}</b><br><small>${x.solved} ${L("enquêtes résolues","cases solved")}</small></span><span>→</span></button>`).join(""):`<small>${L("Aucun joueur trouvé sur l'ancienne adresse.","No players found on the old address.")}</small>`;window._LG=rows}catch(e){$("#lgList").innerHTML=`<small>${L("Impossible de joindre l'ancienne adresse.","Couldn't reach the old address.")}</small>`}}
  else if(t.classList.contains("lgrow")){const x=window._LG[+t.dataset.lg];if(!x)return;
    if(!t.dataset.armed){document.querySelectorAll(".lgrow").forEach(b=>delete b.dataset.armed);t.dataset.armed=1;t.querySelector("span:last-child").textContent=L("C'est moi ✓","That's me ✓");return}
    const n=Math.min(x.solved,DATA.length),prog=Object.assign({},(ACC.profile&&ACC.profile.progress)||{});
    for(let i=0;i<n;i++){const id=DATA[i].id;if(!prog[id])prog[id]={solved:true,hints:i===0?x.hints:0,time:i===0?x.time:0,at:Date.now()};try{const k="crimes-mignons-wiz:"+id;const st=JSON.parse(localStorage.getItem(k)||"{}");st.solved=true;localStorage.setItem(k,JSON.stringify(st))}catch(_){}}
    ACC.profile=Object.assign(ACC.profile||{games:0,created:Date.now()},{pseudo:(ACC.profile&&ACC.profile.pseudo)||x.pseudo,avatar:(ACC.profile&&ACC.profile.avatar)||x.avatar||AVS[0],progress:prog,legacy:true});
    if(x.id&&/^[\w-]{8,64}$/.test(x.id)){ACC.profile.pid=x.id;ACC.profile.ptok=rid()}
    avSel=ACC.profile.avatar;nameDraft=null;await saveProfile();play("win");toast(L(`Progression récupérée : ${n} enquêtes débloquées !`,`Progress recovered: ${n} cases unlocked!`));renderHome()}
  else if(t.id==="accSave"){const n=$("#accName").value.trim();if(!n){toast(L("Choisis un nom de détective.","Pick a detective name."));$("#accName").focus();return}
    const isNew=!(ACC.profile&&ACC.profile.pseudo);ACC.profile=Object.assign(ACC.profile||{progress:{},games:0,created:Date.now()},{pseudo:n,avatar:avSel});
    nameDraft=null;await saveProfile();play("win");toast(isNew?L(`Bienvenue, ${n} !`,`Welcome, ${n}!`):L("Compte enregistré.","Account saved."));renderHome()}
  else if(t.id==="bMenu"){$("#home").hidden=false;show("hMain")}
});
/* tutorial should not auto-start over the menu */
$("#tuto").hidden=true;
renderHome();initAccount();
