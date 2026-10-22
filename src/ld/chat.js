
/* ================= Chat: global thread + private messages ================= */
var CHAT={view:"list",with:null,withName:null,msgs:[],sum:null,timer:null,blocked:[]};
(function(){
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const acc=()=>ACC.profile&&ACC.profile.pseudo&&ACC.profile.pid&&ACC.profile.ptok?ACC.profile:null;
  const me=()=>String((ACC.profile&&ACC.profile.pseudo)||"").trim().toLowerCase();
  const isAdmin=()=>me()==="clemonchichi";
  async function api(body){const p=acc();if(!p)return null;try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({id:p.pid,token:p.ptok},body))});return {ok:r.ok,status:r.status,d:await r.json().catch(()=>null)}}catch(_){return null}}
  const when=at=>{const d=new Date(at),n=new Date(),same=d.toDateString()===n.toDateString(),loc=LANG==="fr"?"fr-FR":LANG==="ko"?"ko-KR":LANG==="ja"?"ja-JP":"en-GB";
    return same?d.toLocaleTimeString(loc,{hour:"2-digit",minute:"2-digit"}):d.toLocaleDateString(loc,{day:"numeric",month:"short"})+" "+d.toLocaleTimeString(loc,{hour:"2-digit",minute:"2-digit"})};
  const av=(a,name)=>`<span class="cav ch-av" data-pres="${esc(name)}"><img src="${POR[a]||POR[AVS[0]]}" alt="">${typeof presDot==="function"?presDot(name):""}</span>`;
  /* ---------- badge on the home screen ---------- */
  function unread(){const s=CHAT.sum;if(!s)return 0;return (s.g||0)+s.convs.reduce((a,c)=>a+c.un,0)}
  function paintBadge(){const b=$("#chatBtn");if(!b)return;const n=unread();b.innerHTML=`💬${n?`<span class="nbadge">${n>99?"99+":n}</span>`:""}`;b.title=L("Messages","Messages","메시지","メッセージ")}
  async function refresh(){if(!acc())return;const r=await api({action:"summary"});if(r&&r.ok&&r.d&&Array.isArray(r.d.convs)){CHAT.sum=r.d;CHAT.blocked=r.d.blocked||[];paintBadge();if(!panel().hidden&&CHAT.view==="list")render()}}
  /* ---------- panel ---------- */
  function panel(){let p=$("#pChat");if(!p){p=document.createElement("div");p.className="home-panel beta-panel chat-panel";p.id="pChat";p.hidden=true;document.querySelector(".home-in").appendChild(p)}return p}
  function head(title,backTo){return `<div class="ch-head"><button class="sh-back" data-chback="${backTo}" aria-label="${L("Retour","Back","뒤로","戻る")}">←</button><h2>${title}</h2><span></span></div>`}
  function render(){const p=panel();
    if(!acc()){p.innerHTML=head(`💬 ${L("Messages","Messages","메시지","メッセージ")}`,"home")+`<p class="rk-msg">${L("Crée ton compte pour discuter avec les autres détectives.","Create an account to chat with the other detectives.","다른 탐정들과 이야기하려면 계정을 만드세요.","ほかの探偵と話すにはアカウントを作ってね。")}</p>`;return}
    if(CHAT.view==="list"){const s=CHAT.sum;
      const g=s&&s.gLast?`<small>${esc(s.gLast.f)} : ${esc(s.gLast.t)}</small>`:`<small>${L("Dis bonjour à tout le monde !","Say hi to everyone!","모두에게 인사해 보세요!","みんなにあいさつしよう！")}</small>`;
      p.innerHTML=head(`💬 ${L("Messages","Messages","메시지","メッセージ")}`,"home")+
        `<button class="ch-row ch-global" data-open=""><span class="ch-gic">🌍</span><span class="ch-rt"><b>${L("Fil global","Global thread","전체 채팅","全体チャット")}</b>${g}</span>${s&&s.g?`<span class="nbadge">${s.g}</span>`:""}</button>
        <div class="ch-sub">${L("Messages privés","Private messages","개인 메시지","個人メッセージ")}</div>`+
        (s&&s.convs.length?s.convs.map(c=>`<button class="ch-row" data-open="${esc(c.k)}" data-name="${esc(c.n)}">${av(c.av,c.n)}<span class="ch-rt"><b>${esc(c.n)}</b><small>${c.lastMe?L("Toi : ","You: ","나: ","自分："):""}${esc(c.last)}</small></span><span class="ch-when">${c.at?when(c.at):""}</span>${c.un?`<span class="nbadge">${c.un}</span>`:""}</button>`).join("")
          :`<p class="rk-msg">${L("Pour écrire à un détective, touche son nom dans le classement puis « Envoyer un message ».","To write to a detective, tap their name in the leaderboard, then “Send a message”.","탐정에게 메시지를 보내려면 순위표에서 이름을 누른 뒤 ‘메시지 보내기’를 누르세요.","探偵にメッセージを送るには、ランキングで名前をタップして「メッセージを送る」を押してね。")}</p>`);
      return}
    const title=CHAT.with?esc(CHAT.withName||CHAT.with):`🌍 ${L("Fil global","Global thread","전체 채팅","全体チャット")}`;
    const mine=me();
    const msgs=CHAT.msgs.map(m=>{const own=String(m.f).trim().toLowerCase()===mine;
      return `<div class="ch-msg${own?" own":""}">${own?"":av(m.av,m.f)}<div class="ch-bub">${own||CHAT.with?"":`<b data-prof="${esc(m.f)}">${esc(m.f)}</b>`}<p>${esc(m.t)}</p><small>${when(m.at)}${isAdmin()&&!CHAT.with?` · <button class="ch-del" data-del="${esc(m.i)}">${L("supprimer","delete","삭제","削除")}</button>`:""}</small></div></div>`}).join("")||`<p class="rk-msg">${L("Aucun message pour l'instant. Lance la conversation !","No messages yet. Start the conversation!","아직 메시지가 없어요. 먼저 말을 걸어 보세요!","まだメッセージはありません。話しかけてみよう！")}</p>`;
    const blocked=CHAT.with&&CHAT.blocked.includes(CHAT.with);
    p.innerHTML=head(title,"list")+
      (CHAT.with?`<div class="ch-tools"><button class="tlink" data-prof="${esc(CHAT.withName||CHAT.with)}">👤 ${L("Voir le profil","See profile","프로필 보기","プロフィールを見る")}</button><button class="tlink" data-block="${esc(CHAT.with)}">${blocked?L("Débloquer","Unblock","차단 해제","ブロック解除"):"🚫 "+L("Bloquer","Block","차단","ブロック")}</button></div>`:`<p class="ch-rule">${L("Reste gentil et respectueux : tout le monde peut lire le fil global.","Be kind and respectful: everyone can read the global thread.","친절하고 예의 바르게! 전체 채팅은 모두가 읽을 수 있어요.","やさしく、礼儀正しく。全体チャットはみんなが読めます。")}</p>`)+
      `<div class="ch-list" id="chList">${msgs}</div>
      <form class="ch-form" id="chForm"><input id="chIn" maxlength="300" autocomplete="off" placeholder="${L("Écris un message…","Write a message…","메시지를 입력하세요…","メッセージを入力…")}" ${blocked?"disabled":""}><button class="pill red" ${blocked?"disabled":""}>${L("Envoyer","Send","보내기","送信")}</button></form>`;
    const l=$("#chList");if(l)l.scrollTop=l.scrollHeight}
  async function openConv(k,name){CHAT.view="conv";CHAT.with=k||null;CHAT.withName=name||k;CHAT.msgs=[];render();await loadConv()}
  async function loadConv(){const r=await api({action:"list",with:CHAT.with||""});if(r&&r.ok){const l=$("#chList"),atBottom=!l||l.scrollHeight-l.scrollTop-l.clientHeight<60;
      const changed=JSON.stringify(r.d.msgs.map(m=>m.i))!==JSON.stringify(CHAT.msgs.map(m=>m.i));CHAT.msgs=r.d.msgs;CHAT.blocked=r.d.blocked||[];
      if(changed&&!panel().hidden&&CHAT.view==="conv"){const inp=$("#chIn"),val=inp?inp.value:"",foc=document.activeElement===inp;render();const i2=$("#chIn");if(i2){i2.value=val;if(foc)i2.focus()}if(!atBottom){const l2=$("#chList");if(l2)l2.scrollTop=l2.scrollHeight}}}}
  function openChat(){if(typeof show==="function")show("pChat")}
  window.openChatWith=(k,name)=>{openChat();openConv(String(k).trim().toLowerCase(),name)};
  /* show/hide with the other home panels */
  const _show=show;show=function(pn){const p=panel();
    if(pn==="pChat"){_show("__none__");["hMain","pLevels","pOptions","pAccount","pRank","pRush","pNight","pLiar","pDaily","pShop","pProfile"].forEach(id=>{const e=$("#"+id);if(e)e.hidden=true});
      p.hidden=false;document.querySelector(".home").classList.add("chatmode");if(CHAT.view==="list"){render();refresh()}else render();
      clearInterval(CHAT.timer);CHAT.timer=setInterval(()=>{if(p.hidden){clearInterval(CHAT.timer);return}CHAT.view==="conv"?loadConv():refresh()},5000)}
    else{p.hidden=true;document.querySelector(".home").classList.remove("chatmode");_show(pn)}};
  /* events */
  document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("button,[data-prof]");if(!t)return;
    if(t.id==="chatBtn"){e.stopPropagation();CHAT.view="list";openChat();try{play("page")}catch(_){}return}
    if(t.id==="pfMsg"){e.stopPropagation();const m=$("#mProf");if(m)m.hidden=true;openChatWith(t.dataset.to,t.dataset.name);return}
    if(!t.closest("#pChat"))return;
    if(t.dataset.chback){e.stopPropagation();if(t.dataset.chback==="list"){CHAT.view="list";render();refresh()}else show("hMain");return}
    if(t.dataset.open!=null){openConv(t.dataset.open,t.dataset.name);return}
    if(t.dataset.block){const r=await api({action:CHAT.blocked.includes(t.dataset.block)?"unblock":"block",who:t.dataset.block});if(r&&r.ok){CHAT.blocked=r.d.blocked;render()}return}
    if(t.dataset.del){if(!t.dataset.armed){t.dataset.armed=1;t.textContent=L("sûr ?","sure?","확실해요?","本当に？");return}await api({action:"delete",mid:t.dataset.del});loadConv();return}},true);
  document.addEventListener("submit",async e=>{if(e.target.id!=="chForm")return;e.preventDefault();const i=$("#chIn"),txt=i.value.trim();if(!txt)return;
    i.value="";const r=await api({action:"send",to:CHAT.with||"",text:txt});
    if(!r||!r.ok){i.value=txt;toast(r&&r.status===429?L("Doucement ! Attends un instant avant de renvoyer un message.","Slow down! Wait a moment before sending another message.","천천히! 잠시 후에 다시 보내세요.","ちょっと待って！少ししてから送ってね。"):L("Message non envoyé (connexion ?).","Message not sent (connection?).","메시지를 보내지 못했어요(연결?).","送信できませんでした（接続？）。"));return}
    try{play("select")}catch(_){}await loadConv();const l=$("#chList");if(l)l.scrollTop=l.scrollHeight;const i2=$("#chIn");if(i2)i2.focus()});
  /* home button + "send a message" in profiles */
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);if(!$("#chatBtn")){const g=document.querySelector(".h2-gear")||$("#hOptions");const b=document.createElement("button");b.id="chatBtn";b.className="h2-gear ch-btn";(document.querySelector(".home")).appendChild(b)}paintBadge()};
  new MutationObserver(()=>{const m=$("#mProf");if(!m||m.hidden)return;const box=m.querySelector(".pf-card");if(!box||box.querySelector("#pfMsg"))return;
    const name=(box.querySelector(".pf-id b")||{}).textContent||"";if(!name||name.trim().toLowerCase()===me()||!acc())return;
    box.insertAdjacentHTML("beforeend",`<button class="pill red" id="pfMsg" data-to="${esc(name)}" data-name="${esc(name)}">💬 ${L("Envoyer un message","Send a message","메시지 보내기","メッセージを送る")}</button>`)}).observe(document.body,{childList:true,subtree:true});
  setTimeout(refresh,3000);setInterval(()=>{if(!document.hidden)refresh()},45000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh()});
  try{renderHome()}catch(_){}
})();
