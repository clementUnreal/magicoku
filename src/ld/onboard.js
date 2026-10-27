
/* ================= first launch: create your detective (mandatory), then optionally link Google ================= */
(function(){
  const css=document.createElement("style");
  css.textContent=`#onb{position:fixed;inset:0;z-index:130;display:flex;align-items:center;justify-content:center;padding:max(12px,env(safe-area-inset-top,0px)) 12px max(12px,env(safe-area-inset-bottom,0px));background:radial-gradient(ellipse at 50% 0%,#3a2560,#130d24 70%);overflow:auto}
#onb[hidden]{display:none}
#onb .ob{width:min(480px,100%);max-height:100%;overflow:auto;box-sizing:border-box;background:linear-gradient(#fffaf0,#f6e6c4);border:2px solid #c9a25a;border-radius:20px;padding:20px 18px 16px;color:#3a1f3d;box-shadow:0 18px 50px rgba(0,0,0,.6);text-align:center}
#onb .ob-logo{font:900 30px var(--f-magi,serif);color:#8e1f33;margin:0}
#onb .ob-sub{margin:4px 0 14px;font:500 15px/1.45 var(--f-simple,system-ui)!important}
#onb label{display:block;text-align:left;font:800 14px var(--f-simple,system-ui)!important;margin:10px 0 6px}
#onb input{width:100%;box-sizing:border-box;min-height:48px;padding:0 14px;border-radius:12px;border:1.5px solid #c9a25a;background:#fff;color:#2e1d33;color-scheme:light;font:600 17px var(--f-simple,system-ui)!important}
#onb .ob-av{display:grid;grid-template-columns:repeat(auto-fill,minmax(54px,1fr));gap:8px}
#onb .ob-av button{aspect-ratio:1;border-radius:50%;border:3px solid transparent;padding:0;overflow:hidden;background:#efe2c4;cursor:pointer}
#onb .ob-av button.on{border-color:#8e1f33;box-shadow:0 0 0 3px rgba(142,31,51,.25)}
#onb .ob-av img{width:100%;height:100%;object-fit:cover;display:block}
#onb .ob-go{width:100%;min-height:52px;margin-top:16px;border:0;border-radius:999px;background:linear-gradient(#b8283e,#8a1a2c);color:#ffe6a6;font:800 17px var(--f-simple,system-ui)!important;box-shadow:0 4px 0 #5a1020;cursor:pointer}
#onb .ob-go[disabled]{opacity:.6}
#onb .ob-err{display:block;min-height:1.2em;margin-top:8px;font:700 14px/1.4 var(--f-simple,system-ui)!important;color:#a8323e}
#onb .ob-link{margin-top:12px;border:0;background:none;color:#5a2848;text-decoration:underline;font:700 14px var(--f-simple,system-ui)!important;cursor:pointer;min-height:40px}
#onb .ob-g{display:flex;justify-content:center;min-height:46px;margin:12px 0 4px}
#onb .ob-sep{margin:14px 0 4px;font:600 13px var(--f-simple,system-ui)!important;color:#7a6650}
#onb .ob-big{font-size:44px;line-height:1;margin:2px 0 6px}`;
  document.head.appendChild(css);
  const esc=s=>String(s||"").replace(/[<>&"]/g,"");
  const has=()=>!!(ACC.profile&&ACC.profile.pseudo);
  let el=null,stage="create",av=null;
  function root(){if(!el){el=document.createElement("div");el.id="onb";el.hidden=true;document.body.appendChild(el);
      el.addEventListener("click",onClick);el.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="onbName")create()})}return el}
  function paintCreate(){if(av==null)av=AVS[Math.floor(Math.random()*AVS.length)];
    root().innerHTML=`<div class="ob"><p class="ob-logo">Magicoku</p>
      <p class="ob-sub">${L("Bienvenue à l'Académie de Brumelune ! Crée ton détective pour commencer : ta progression, tes éclats de lune et ta place au classement seront enregistrés.","Welcome to Brumelune Academy! Create your detective to begin: your progress, moon shards and leaderboard spot will be saved.","브뤼므륀 아카데미에 오신 걸 환영해요! 탐정을 만들어 시작하세요. 진행 상황, 달 조각, 순위가 저장돼요.","ブリュムリュヌ・アカデミーへようこそ！探偵を作って始めよう。進行状況・月のかけら・ランキングが保存されます。")}</p>
      <label for="onbName">${L("Ton nom de détective","Your detective name","탐정 이름","探偵ネーム")}</label>
      <input id="onbName" maxlength="20" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="${L("Ex. : Inspectrice Lune","E.g. Inspector Moon","예: 달빛 탐정","例：月の探偵")}">
      <label>${L("Ton portrait","Your portrait","초상화","肖像")}</label>
      <div class="ob-av">${AVS.map(k=>`<button data-av="${k}" class="${k===av?"on":""}" aria-label="${k}"><img src="${POR[k]}" alt=""></button>`).join("")}</div>
      <button class="ob-go" id="onbGo">${L("Créer mon détective","Create my detective","탐정 만들기","探偵を作る")}</button>
      <span class="ob-err" id="onbErr"></span>
      <button class="ob-link" id="onbHave">${L("J'ai déjà un compte","I already have an account","이미 계정이 있어요","すでにアカウントがある")}</button></div>`;
    setTimeout(()=>{const i=$("#onbName");if(i)i.focus()},150)}
  function paintLogin(){root().innerHTML=`<div class="ob"><div class="ob-big">🔑</div><p class="ob-logo" style="font-size:24px">${L("Retrouver mon détective","Find my detective","내 탐정 되찾기","探偵を取り戻す")}</p>
      <p class="ob-sub">${L("Si tu as lié ton détective à Google, connecte-toi :","If you linked your detective to Google, sign in:","탐정을 구글과 연결했다면 로그인하세요:","Googleと連携していれば、ログインしよう：")}</p>
      <div class="ob-g" id="onbG"></div><span class="ob-err" id="onbGMsg"></span>
      <p class="ob-sep">${L("Sinon, demande ton code de récupération à l'administrateur du jeu (pseudo clemonchichi) et entre-le dans Profil › Récupérer ma progression.","Otherwise, ask the game's admin (clemonchichi) for your recovery code and enter it in Profile › Recover my progress.","아니면 게임 관리자(clemonchichi)에게 복구 코드를 받아 프로필 › 진행 상황 되찾기에 입력하세요.","それ以外は、管理者（clemonchichi）に復元コードをもらい、プロフィール › 進行状況を取り戻す に入力してね。")}</p>
      <button class="ob-link" id="onbCode">${L("J'ai un code de récupération","I have a recovery code","복구 코드가 있어요","復元コードがある")}</button><br>
      <button class="ob-link" id="onbBack">← ${L("Créer un nouveau détective","Create a new detective","새 탐정 만들기","新しい探偵を作る")}</button></div>`;
    if(window.GG)GG.render($("#onbG"),"login")}
  function paintLink(){root().innerHTML=`<div class="ob"><div class="ob-big">🔐</div><p class="ob-logo" style="font-size:24px">${L(`Bienvenue, ${esc(ACC.profile.pseudo)} !`,`Welcome, ${esc(ACC.profile.pseudo)}!`,`환영해요, ${esc(ACC.profile.pseudo)}!`,`ようこそ、${esc(ACC.profile.pseudo)}！`)}</p>
      <p class="ob-sub">${L("Pour ne jamais perdre ta progression (nouveau téléphone, appli supprimée…), tu peux lier ton détective à ton compte Google. C'est facultatif : nous ne gardons ni ton e-mail ni ton nom.","So you never lose your progress (new phone, app deleted…), you can link your detective to your Google account. It's optional: we don't keep your email or name.","진행 상황을 절대 잃지 않도록(새 휴대폰, 앱 삭제 등) 탐정을 구글 계정과 연결할 수 있어요. 선택 사항이며, 이메일이나 이름은 저장하지 않아요.","進行状況を失わないように（機種変更、アプリ削除など）、探偵をGoogleアカウントと連携できます。任意です。メールアドレスや名前は保存しません。")}</p>
      <div class="ob-g" id="onbG"></div><span class="ob-err" id="onbGMsg"></span>
      <button class="ob-link" id="onbLater">${L("Plus tard (possible dans Profil › Modifier mon compte)","Later (available in Profile › Edit my account)","나중에 (프로필 › 계정 수정에서 가능)","あとで（プロフィール › アカウント編集 からできます）")}</button></div>`;
    if(window.GG)GG.render($("#onbG"),"link",()=>close())}
  function paint(){if(stage==="create")paintCreate();else if(stage==="login")paintLogin();else paintLink()}
  function open(s){stage=s;paint();root().hidden=false}
  function close(){if(el)el.hidden=true;stage="done";try{renderHome()}catch(_){}}
  async function create(){const i=$("#onbName"),err=$("#onbErr"),btn=$("#onbGo");const n=(i.value||"").trim().replace(/\s+/g," ");
    if(n.length<2){err.textContent=L("Choisis un nom d'au moins 2 lettres.","Pick a name with at least 2 letters.","2글자 이상으로 지어 주세요.","2文字以上の名前にしてね。");i.focus();return}
    if(/clemonchichi/i.test(n)){err.textContent=L("Ce nom est réservé.","This name is reserved.","예약된 이름이에요.","この名前は予約されています。");return}
    btn.disabled=true;err.textContent="";
    let taken=false;try{const r=await fetch("/api/namecheck?pseudo="+encodeURIComponent(n));if(r.ok)taken=!!(await r.json()).taken}catch(_){}
    if(taken){btn.disabled=false;err.innerHTML=L(`« ${esc(n)} » est déjà pris. Choisis-en un autre, ou touche « J'ai déjà un compte » si c'est le tien.`,`“${esc(n)}” is already taken. Pick another one, or tap “I already have an account” if it's yours.`,`‘${esc(n)}’은(는) 이미 사용 중이에요. 다른 이름을 고르거나, 내 이름이면 ‘이미 계정이 있어요’를 누르세요.`,`「${esc(n)}」はすでに使われています。別の名前にするか、自分のものなら「すでにアカウントがある」をタップしてね。`);return}
    ACC.profile=Object.assign(ACC.profile||{progress:{},games:0,created:Date.now()},{pseudo:n,avatar:av});
    try{avSel=av;nameDraft=null}catch(_){}
    await saveProfile();try{play("win")}catch(_){}
    open("link")}
  function onClick(e){const t=e.target.closest("button");if(!t)return;
    if(t.dataset.av){av=t.dataset.av;el.querySelectorAll("[data-av]").forEach(b=>b.classList.toggle("on",b===t));try{play("select")}catch(_){}return}
    if(t.id==="onbGo"){create();return}
    if(t.id==="onbHave"){open("login");return}
    if(t.id==="onbBack"){open("create");return}
    if(t.id==="onbLater"){close();return}
    if(t.id==="onbCode"){close();stage="code";try{show("pAccount")}catch(_){}
      setTimeout(()=>{const lg=$("#legacy");if(lg){lg.scrollIntoView({block:"center"});const b=lg.querySelector("button");if(b)b.click()}},300);
      const w=setInterval(()=>{if(has()){clearInterval(w);return}if($("#pAccount")&&$("#pAccount").hidden){clearInterval(w);open("create")}},800)}}
  /* show at start-up, and whenever someone ends up without a detective */
  function check(){if(has()||(el&&!el.hidden)||stage==="code")return;open("create")}
  setTimeout(check,700);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{if(!has()&&stage!=="code"&&stage!=="done")check()}catch(_){}};
})();
