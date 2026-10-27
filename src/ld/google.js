
/* ================= "Sign in with Google": link your detective to Google, find it back on any device ================= */
(function(){
  const CID="69203150966-curs9gdnm7bjvv0sbtg0lo6mtdn0cumf.apps.googleusercontent.com";
  const G={linked:null,loading:false,mode:"link",msg:"",ready:false,inited:false};
  const acc=()=>ACC.profile&&ACC.profile.pseudo&&ACC.profile.pid&&ACC.profile.ptok?ACC.profile:null;
  const css=document.createElement("style");
  css.textContent=`.acc-g{margin-top:14px;padding:12px;border-radius:14px;border:1.5px solid #e0c78f;background:#fffaf0;text-align:center}
.acc-g p{margin:0 0 8px;font:500 14px/1.45 var(--f-simple,system-ui)!important;color:#3a1f3d}
.acc-g b{color:#2f7a3d}.acc-g .gbtn{display:flex;justify-content:center;min-height:44px}
.acc-g .gmsg{display:block;margin-top:8px;font:600 13px var(--f-simple,system-ui)!important;color:#a8323e}.acc-g .gmsg:empty{display:none}
.acc-g .glink{margin-top:6px;border:0;background:none;color:#7a6650;text-decoration:underline;font:600 13px var(--f-simple,system-ui)!important;cursor:pointer;min-height:36px}`;
  document.head.appendChild(css);
  function loadGIS(){if(G.ready||document.getElementById("gisjs"))return;const s=document.createElement("script");s.id="gisjs";s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=()=>{G.ready=true;paint()};document.head.appendChild(s)}
  async function call(body){const r=await fetch("/api/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});let d={};try{d=await r.json()}catch(_){}return {ok:r.ok,status:r.status,d}}
  async function status(){const p=acc();if(!p||G.loading)return;G.loading=true;try{const r=await call({action:"status",id:p.pid,token:p.ptok});G.linked=r.ok?!!r.d.linked:null}catch(_){}G.loading=false;paint()}
  async function adopt(d){const pid=rid(),ptok=rid();
    const prog=Object.assign({},(ACC.profile&&ACC.profile.progress)||{}),ids=new Set(DATA.map(c=>c.id));
    for(const [lid,v] of Object.entries(d.progress||{})){if(!ids.has(lid))continue;if(!prog[lid]||!prog[lid].solved)prog[lid]={solved:true,hints:v.h||0,time:v.t||0,attempts:v.a||1,at:Date.now()}}
    const want=Math.min(+(d.progress&&d.progress._n)||0,DATA.length);
    for(let i=0;i<DATA.length&&Object.values(prog).filter(v=>v&&v.solved).length<want;i++){const id=DATA[i].id;if(/^s\d+n\d+$/.test(id))continue;if(!prog[id]||!prog[id].solved)prog[id]={solved:true,hints:0,time:0,attempts:1,at:Date.now()}}
    ACC.profile=Object.assign(ACC.profile||{games:0,created:Date.now()},{pseudo:d.pseudo,avatar:d.avatar||(ACC.profile&&ACC.profile.avatar)||AVS[0],progress:prog,legacy:true,pid,ptok});
    try{avSel=ACC.profile.avatar;nameDraft=null}catch(_){}
    return {pid,ptok}}
  async function onCred(resp){const cred=resp&&resp.credential;if(!cred)return;G.msg=L("Vérification…","Checking…","확인 중…","確認中…");paint();
    const p=acc();let r;
    try{
      if(G.mode==="link"&&p){r=await call({action:"link",credential:cred,id:p.pid,token:p.ptok});
        if(r.ok){G.linked=true;G.msg="";try{play("win")}catch(_){}toast(L("Compte lié à Google ! Tu pourras le retrouver sur n'importe quel appareil.","Account linked to Google! You can find it back on any device.","구글 계정과 연결했어요! 어느 기기에서든 되찾을 수 있어요.","Googleアカウントと連携しました！どの端末でも取り戻せます。"));paint();return}
        if(r.status===409){G.msg=L(`Ce compte Google est déjà lié au détective « ${r.d.pseudo} ».`,`This Google account is already linked to the detective “${r.d.pseudo}”.`,`이 구글 계정은 이미 탐정 ‘${r.d.pseudo}’에 연결되어 있어요.`,`このGoogleアカウントはすでに探偵「${r.d.pseudo}」と連携しています。`);G.other=r.d.pseudo;G.pending=cred;paint();return}}
      else{const nid=rid();r=await call({action:"login",credential:cred,newId:nid});
        if(r.ok){const {pid,ptok}=await adopt(r.d);await saveProfile();try{play("win")}catch(_){}G.linked=true;G.msg="";
          toast(L(`Bon retour, ${r.d.pseudo} ! Ta progression est récupérée.`,`Welcome back, ${r.d.pseudo}! Your progress is back.`,`다시 오신 걸 환영해요, ${r.d.pseudo}! 진행 상황을 되찾았어요.`,`おかえり、${r.d.pseudo}！進行状況を取り戻しました。`));setTimeout(()=>location.reload(),1200);return}
        if(r.status===404){G.msg=L("Aucun détective n'est lié à ce compte Google. Crée ton pseudo, puis lie-le à Google.","No detective is linked to this Google account. Create your name, then link it to Google.","이 구글 계정에 연결된 탐정이 없어요. 이름을 만든 뒤 구글과 연결하세요.","このGoogleアカウントと連携した探偵はいません。名前を作ってから連携してね。");paint();return}}
      G.msg=L("La connexion Google a échoué. Réessaie.","Google sign-in failed. Try again.","구글 로그인에 실패했어요. 다시 시도하세요.","Googleログインに失敗しました。もう一度試してね。")}
    catch(_){G.msg=L("Pas de connexion. Réessaie dans un instant.","No connection. Try again in a moment.","연결이 없어요. 잠시 후 다시 시도하세요.","接続できません。少ししてからもう一度。")}
    paint()}
  function button(el){if(!G.ready||!window.google||!google.accounts||!google.accounts.id)return;
    if(!G.inited){google.accounts.id.initialize({client_id:CID,callback:onCred,ux_mode:"popup",auto_select:false,cancel_on_tap_outside:true});G.inited=true}
    el.innerHTML="";google.accounts.id.renderButton(el,{theme:"outline",size:"large",shape:"pill",text:G.mode==="link"?"continue_with":"signin_with",locale:{fr:"fr",en:"en",ko:"ko",ja:"ja"}[LANG]||"fr",width:260})}
  function paint(){const pan=$("#pAccount");if(!pan||pan.hidden)return;let box=$("#accG");
    if(!box){box=document.createElement("div");box.id="accG";box.className="acc-g"}{const lg=$("#legacy"),del=$("#accDel");if(lg&&lg.parentNode===pan){if(lg.nextElementSibling!==box)lg.after(box)}else if(del&&del.parentNode===pan){if(del.previousElementSibling!==box)pan.insertBefore(box,del)}else if(box.parentNode!==pan)pan.appendChild(box)}
    const p=acc();loadGIS();
    if(p&&G.linked==null&&!G.loading)status();
    let txt;
    if(p&&G.linked){G.mode="login";txt=`<p>✓ <b>${L("Ton compte est lié à Google.","Your account is linked to Google.","구글 계정과 연결되어 있어요.","Googleアカウントと連携済みです。")}</b><br>${L("Sur un autre téléphone ou navigateur, appuie sur « Se connecter avec Google » pour retrouver ta progression.","On another phone or browser, tap “Sign in with Google” to get your progress back.","다른 휴대폰이나 브라우저에서 ‘Google로 로그인’을 누르면 진행 상황을 되찾을 수 있어요.","別のスマホやブラウザで「Googleでログイン」を押すと、進行状況を取り戻せます。")}</p><button class="glink" id="gUnlink">${L("Délier mon compte Google","Unlink my Google account","구글 연결 해제","Google連携を解除")}</button>`}
    else if(p){G.mode="link";txt=`<p>🔐 ${L("Lie ton détective à ton compte Google pour ne jamais perdre ta progression, même en changeant de téléphone.","Link your detective to your Google account so you never lose your progress, even on a new phone.","탐정을 구글 계정과 연결하면 휴대폰을 바꿔도 진행 상황을 잃지 않아요.","探偵をGoogleアカウントと連携すれば、スマホを変えても進行状況を失いません。")}</p><div class="gbtn" id="gBtn"></div>`
      +(G.other?`<button class="glink" id="gUseOther">${L(`Utiliser « ${esc(G.other)} » sur cet appareil`,`Use “${esc(G.other)}” on this device`,`이 기기에서 ‘${esc(G.other)}’ 사용`,`この端末で「${esc(G.other)}」を使う`)}</button>`:"")}
    else{G.mode="login";txt=`<p>${L("Tu as déjà joué sur un autre appareil ? Retrouve ton détective avec Google.","Already played on another device? Get your detective back with Google.","다른 기기에서 플레이한 적이 있나요? 구글로 탐정을 되찾으세요.","別の端末で遊んだことがある？Googleで探偵を取り戻そう。")}</p><div class="gbtn" id="gBtn"></div>`}
    box.innerHTML=txt+`<small class="gmsg">${G.msg||""}</small>`;
    const b=$("#gBtn");if(b)button(b)}
  const esc=s=>String(s||"").replace(/[<>&"]/g,"");
  document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("#gUnlink,#gUseOther");if(!t)return;e.stopPropagation();
    if(t.id==="gUnlink"){const p=acc();if(!p)return;if(!t.dataset.armed){t.dataset.armed=1;t.textContent=L("Vraiment délier ?","Really unlink?","정말 해제할까요?","本当に解除する？");return}
      try{const r=await call({action:"unlink",id:p.pid,token:p.ptok});if(r.ok)G.linked=false}catch(_){}paint();return}
    if(t.id==="gUseOther"&&G.pending){G.mode="login";const c=G.pending;G.pending=null;G.other=null;await onCred({credential:c})}},true);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{paint()}catch(_){}};
})();
