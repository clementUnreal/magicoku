/* ================= "new version available" banner ================= (rev 2) */
var APP_BUILD="__BUILD__";
(function(){
  let shown=false;
  async function check(){if(shown||APP_BUILD.startsWith("__"))return;
    let ok=false;
    try{const ctl=window.AbortController?new AbortController():null;const tm=setTimeout(()=>{try{ctl&&ctl.abort()}catch(_){}},10000);
      const r=await fetch("version.json?t="+Date.now(),{cache:"no-store",signal:ctl?ctl.signal:undefined});clearTimeout(tm);if(r.ok){ok=true;const v=await r.json();if(v&&v.b&&v.b!==APP_BUILD)show()}}catch(_){}
    if(ok){fails=0;off(false)}else if(++fails>=2)off(true)}
  /* the server cannot be reached: the game runs on the copy kept on the phone, which may be old */
  let fails=0;
  function off(on){let b=$("#offBar");if(!on){if(b)b.remove();return}if(b||shown)return;
    b=document.createElement("div");b.id="offBar";const net=navigator.onLine===false;
    b.innerHTML=`<span>📡 <b>${net?L("Pas de connexion internet","No internet connection","인터넷 연결 없음","インターネット接続なし"):L("Impossible de joindre le serveur","Can't reach the server","서버에 연결할 수 없어요","サーバーにつながりません")}</b><br><small>${L("Tu joues sur la version gardée sur ton téléphone, qui n'est peut-être pas la dernière. Tes scores ne sont pas envoyés pour l'instant.","You're playing the copy kept on your phone, which may not be the latest. Your scores aren't being sent for now.","휴대폰에 저장된 버전으로 플레이 중이라 최신 버전이 아닐 수 있어요. 지금은 점수가 전송되지 않아요.","端末に保存されたバージョンで遊んでいます。最新ではないかもしれません。今はスコアが送信されません。")}${net?"":"<br>"+L("Un bloqueur de pubs ou un « DNS privé » peut en être la cause.","An ad blocker or a “private DNS” may be the cause.","광고 차단기나 ‘개인 DNS’ 때문일 수 있어요.","広告ブロッカーや「プライベートDNS」が原因かもしれません。")}</small></span><button>${L("Réessayer","Retry","다시 시도","再試行")}</button>`;
    b.querySelector("button").onclick=()=>{b.remove();fails=1;check()};document.body.appendChild(b)}
  addEventListener("online",()=>check());
  function show(){shown=true;const b=document.createElement("button");b.id="updBar";
    b.innerHTML=`✨ <b>${L("Nouvelle version de Magicoku !","New version of Magicoku!","Magicoku 새 버전이 나왔어요!","Magicokuの新しいバージョン！")}</b> <span>${L("Touche ici pour mettre à jour","Tap here to update","눌러서 업데이트하기","タップして更新")}</span>`;
    b.onclick=async()=>{try{if(S)save()}catch(_){}b.textContent="…";
      /* hard refresh: drop the service worker and its cached copies (never the player's data), then reload from the network */
      try{if(navigator.serviceWorker&&navigator.serviceWorker.getRegistrations){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}}catch(_){}
      try{if(window.caches){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch(_){}
      location.replace(location.pathname+"?u="+Date.now())};
    document.body.appendChild(b);requestAnimationFrame(()=>b.classList.add("on"))}
  const st=document.createElement("style");st.textContent=`#offBar{position:fixed;left:8px;right:8px;top:max(8px,env(safe-area-inset-top,0px));z-index:100000;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:#3a1f3d;color:#fbefc8;border:1.5px solid #d6ab4f;box-shadow:0 8px 24px #0007;font:500 13px/1.35 var(--f-simple,system-ui)}
#offBar span{flex:1}#offBar small{opacity:.9}#offBar button{flex:none;min-height:40px;padding:0 12px;border-radius:999px;border:0;background:#f6d77c;color:#2a1534;font:800 13px var(--f-simple,system-ui);cursor:pointer}`;document.head.appendChild(st);
  setTimeout(check,4000);setInterval(check,5*60*1000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)check()});
})();
