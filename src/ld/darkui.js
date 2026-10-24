
/* ================= night theme (menu: Mode clair / Mode nuit) =================
   The parchment surfaces are flipped to dark with an invert + hue-rotate filter (hues kept, lightness
   reversed); pictures inside them are flipped back so portraits, sprites and banners keep their colours. */
(function(){
  const K="magicoku:theme";
  const S_=`:is(.h2-hero,.h2-news,.home-panel,.recit,.tools .tb,.mbox,#hintBox,.box.rv2,.acc-box,#g3Clock)`;
  const R_=`img,video,canvas,.cph,.pimg,.sh-pv,.acc-ph,.polaroid .ph,.cos-por,.cos-chara,.board,.r3-fig,.g3-pan,.h2-art,.rk-av,.pf-av`;
  const css=document.createElement("style");
  css.textContent=`html.night ${S_}{filter:invert(.9) hue-rotate(180deg)}
html.night ${S_} :is(${R_}):not(:is(${R_}) *){filter:invert(1) hue-rotate(180deg) brightness(1.08)}
html.night body{color-scheme:dark}
.g3-theme button{min-height:40px;padding:0 12px;border-radius:999px;border:1.5px solid #c9a25a;background:transparent;font:700 13.5px var(--f-simple,system-ui)!important;color:inherit;cursor:pointer}
.g3-theme button.on{background:#5a2848;color:#fff;border-color:#5a2848}
.o-theme{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}`;
  document.head.appendChild(css);
  const get=()=>{try{return localStorage.getItem(K)==="night"?"night":"light"}catch(_){return "light"}};
  function apply(){document.documentElement.classList.toggle("night",get()==="night")}
  window.themeNow=get;
  window.setTheme=t=>{try{localStorage.setItem(K,t)}catch(_){}apply();try{paint()}catch(_){}};
  window.themeRow=()=>`<span class="g3-theme">${[["light","☀️",L("Clair","Light","라이트","ライト")],["night","🌙",L("Nuit","Night","나이트","ナイト")]].map(([k,i,t])=>`<button data-th="${k}" class="${get()===k?"on":""}">${i} ${t}</button>`).join(" ")}</span>`;
  /* home › Options: a row under the sound switch */
  function paint(){const pan=$("#pOptions");if(!pan)return;let r=$("#oTheme");
    if(!r){r=document.createElement("div");r.id="oTheme";r.className="o-theme";const s=$("#oSound"),row=s&&s.parentElement;if(row&&row.parentElement)row.parentElement.insertBefore(r,row.nextSibling);else pan.appendChild(r)}
    r.innerHTML=`<span>🌗 ${L("Affichage","Display","화면","表示")}</span>${themeRow()}`}
  document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-th]");if(!b)return;e.stopPropagation();setTheme(b.dataset.th);
    document.querySelectorAll("[data-th]").forEach(x=>x.classList.toggle("on",x.dataset.th===b.dataset.th))},true);
  apply();
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{paint()}catch(_){}};
})();
