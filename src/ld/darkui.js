
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
  /* Samsung Internet forces its own dark mode on every site when the phone is dark, and a site cannot turn it off:
     the parchment then turns brown. For those players the night theme is the default (dark cards stay clean),
     and a one-time tip explains how to switch the browser's dark mode off to see the real colours. */
  const samsungDark=()=>{try{return /SamsungBrowser/i.test(navigator.userAgent)&&matchMedia("(prefers-color-scheme: dark)").matches}catch(_){return false}};
  const get=()=>{try{const v=localStorage.getItem(K);if(v)return v==="night"?"night":"light";return samsungDark()?"night":"light"}catch(_){return "light"}};
  function tip(){try{if(!samsungDark()||localStorage.getItem("magicoku:samsungTip"))return;localStorage.setItem("magicoku:samsungTip","1")}catch(_){return}
    setTimeout(()=>{try{const m=document.createElement("div");m.className="modal";m.id="samsungTip";m.innerHTML=`<div class="mbox" style="max-width:420px"><h2>🌗 ${L("Mode sombre du téléphone","Phone dark mode","휴대폰 다크 모드","スマホのダークモード")}</h2><p style="font:500 15px/1.5 var(--f-simple,system-ui)">${L("Ton navigateur Samsung assombrit les sites. Pour voir les vraies couleurs du jeu, désactive « Mode sombre » dans le menu ☰ de Samsung Internet. Sinon, le mode 🌙 Nuit du jeu est activé.","Your Samsung browser darkens websites. To see the game's real colours, turn off “Dark mode” in Samsung Internet's ☰ menu. Otherwise, the game's 🌙 Night mode is on.","삼성 인터넷이 사이트를 어둡게 바꾸고 있어요. 게임의 원래 색을 보려면 삼성 인터넷 ☰ 메뉴에서 ‘다크 모드’를 끄세요. 그렇지 않으면 게임의 🌙 나이트 모드가 켜져 있어요.","Samsung Internetがサイトを暗く表示しています。ゲーム本来の色で見るには、Samsung Internetの☰メニューで「ダークモード」をオフにしてね。そのままなら、ゲームの🌙ナイトモードが使われます。")}</p><div style="text-align:center;margin-top:12px"><button class="pill red" id="samsungTipOk">OK</button></div></div>`;document.body.appendChild(m);m.hidden=false;m.addEventListener("click",e=>{if(e.target===m||e.target.id==="samsungTipOk")m.remove()})}catch(_){}},2500)}
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
  apply();tip();
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{paint()}catch(_){}};
})();

/* ================= phone held sideways outside a case: the portrait-sized screens are scaled down to fit =================
   (the case screen itself has its own 3-column layout: body.g3l) */
(function(){
  const css=document.createElement("style");
  css.textContent=`@media (orientation:landscape) and (max-height:540px){
  body:not(.g3l){zoom:var(--lz,.62)}
}`;
  document.head.appendChild(css);
  const mq=matchMedia("(orientation:landscape) and (max-height:540px)");
  function fit(){if(!mq.matches)return;const h=window.innerHeight;document.documentElement.style.setProperty("--lz",Math.max(.5,Math.min(.75,h/660)).toFixed(3))}
  fit();window.addEventListener("resize",fit);
})();
