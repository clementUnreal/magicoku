/* ================= "new version available" banner ================= (rev 2) */
var APP_BUILD="__BUILD__";
(function(){
  let shown=false;
  async function check(){if(shown||APP_BUILD.startsWith("__"))return;
    try{const r=await fetch("version.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)return;const v=await r.json();
      if(v&&v.b&&v.b!==APP_BUILD)show()}catch(_){}}
  function show(){shown=true;const b=document.createElement("button");b.id="updBar";
    b.innerHTML=`✨ <b>${L("Nouvelle version de Magicoku !","New version of Magicoku!","Magicoku 새 버전이 나왔어요!","Magicokuの新しいバージョン！")}</b> <span>${L("Touche ici pour mettre à jour","Tap here to update","눌러서 업데이트하기","タップして更新")}</span>`;
    b.onclick=async()=>{try{if(S)save()}catch(_){}b.textContent="…";
      /* hard refresh: drop the service worker and its cached copies (never the player's data), then reload from the network */
      try{if(navigator.serviceWorker&&navigator.serviceWorker.getRegistrations){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}}catch(_){}
      try{if(window.caches){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch(_){}
      location.replace(location.pathname+"?u="+Date.now())};
    document.body.appendChild(b);requestAnimationFrame(()=>b.classList.add("on"))}
  setTimeout(check,4000);setInterval(check,5*60*1000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)check()});
})();
