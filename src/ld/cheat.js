/* ================= detectives caught cheating: scores struck through + "(tricheur)" in every ranking ================= */
var CHEATERS=["mazvil"];
(function(){
  const isC=n=>CHEATERS.includes(String(n||"").trim().toLowerCase());
  const SEL=".rv-rk li,.li-rk li,ol.lr li,.rk-list li,.rk-r,.rk-pc,.dl-list li,.lr-list li";
  function deco(){document.querySelectorAll(SEL).forEach(row=>{if(row.dataset.ch)return;const b=row.querySelector("b");if(!b||!isC(b.textContent))return;row.dataset.ch="1";row.classList.add("cheat");
      const t=document.createElement("em");t.className="cheat-t";t.textContent="("+L("tricheur","cheater","부정행위","不正")+")";b.after(t);
      const n=row.querySelector(".p,.rk-n");if(n)n.textContent="—"})}
  try{let q=0;new MutationObserver(()=>{if(q)return;q=1;requestAnimationFrame(()=>{q=0;try{deco()}catch(_){}})}).observe(document.body,{childList:true,subtree:true})}catch(_){}
  const st=document.createElement("style");st.textContent=`.cheat{opacity:.62;filter:grayscale(.6)}
.cheat>b,.cheat .rk-t b,.cheat .s,.cheat .rk-s,.cheat .rk-ps,.cheat small,.cheat strong{text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:#b8283e}
.cheat .rk-t b{overflow:visible!important;text-overflow:clip!important;flex:none!important}.cheat .rk-t{flex-wrap:wrap}.cheat-t{margin:0 4px;font:italic 700 11.5px var(--f-simple,system-ui)!important;color:#b8283e!important;white-space:nowrap;text-decoration:none!important}`;document.head.appendChild(st);
})();
