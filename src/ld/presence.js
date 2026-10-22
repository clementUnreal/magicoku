/* ================= presence: green dot for detectives playing right now ================= */
var PRES={map:{}};
function presOf(pseudo){const x=PRES.map[String(pseudo||"").trim().toLowerCase()];if(!x)return null;return x.ago<150?(x.p?"play":"on"):x.ago<3600?"recent":null}
function presDot(pseudo){const s=presOf(pseudo);return s==="play"||s==="on"?`<i class="pdot ${s}" title="${s==="play"?L("En pleine enquête","Investigating right now","지금 추리 중","捜査中"):L("En ligne","Online","접속 중","オンライン")}"></i>`:""}
function presText(pseudo){const k=String(pseudo||"").trim().toLowerCase(),x=PRES.map[k],s=presOf(pseudo);if(!x)return "";
  if(s==="play")return `<span class="ptxt on">🟢 ${L("En pleine enquête","Investigating right now","지금 추리 중","いま捜査中")}</span>`;
  if(s==="on")return `<span class="ptxt on">🟢 ${L("En ligne","Online","접속 중","オンライン")}</span>`;
  const m=Math.max(1,Math.round(x.ago/60));return `<span class="ptxt">${L(`Vu il y a ${m} min`,`Seen ${m} min ago`,`${m}분 전 접속`,`${m}分前にオンライン`)}</span>`}
(function(){
  async function pull(){try{const r=await fetch("/api/presence",{cache:"no-store"});if(r.ok){PRES.map=await r.json();paint()}}catch(_){}}
  async function ping(){const p=ACC.profile;if(!p||!p.pid||!p.ptok||document.hidden)return;
    try{await fetch("/api/ping",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok,playing:$("#home").hidden})})}catch(_){}}
  function paint(){/* dots on every avatar that carries a pseudo */
    document.querySelectorAll("[data-pres]").forEach(e=>{const d=presDot(e.dataset.pres);e.querySelectorAll(":scope>.pdot").forEach(x=>x.remove());if(d)e.insertAdjacentHTML("beforeend",d)});
    const n=Object.keys(PRES.map).filter(k=>presOf(k)==="on"||presOf(k)==="play").length,h=$("#pRankT");
    if(h){let b=$("#presCount");if(!b){b=document.createElement("div");b.id="presCount";h.after(b)}b.innerHTML=n?`<i class="pdot on"></i> ${L(`${n} ${n>1?"détectives en ligne":"détective en ligne"}`,`${n} ${n>1?"detectives":"detective"} online`,`탐정 ${n}명 접속 중`,`探偵${n}人がオンライン`)}`:""}}
  window.presPaint=paint;
  setTimeout(()=>{ping().then(pull)},2500);setInterval(ping,60000);setInterval(pull,30000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden){ping().then(pull)}});
  new MutationObserver(()=>setTimeout(ping,300)).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
})();
