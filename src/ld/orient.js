/* ================= option: turn the screen to landscape (Screen Orientation API; Android / installed app) ================= */
(function(){
  const d=document,el=d.documentElement,K="magicoku:landscape";
  const isFs=()=>!!(d.fullscreenElement||d.webkitFullscreenElement);
  const standalone=()=>matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches||navigator.standalone===true;
  const can=()=>!!(screen.orientation&&typeof screen.orientation.lock==="function");
  let on=false;try{on=localStorage.getItem(K)==="on"}catch(_){}
  const save=()=>{try{localStorage.setItem(K,on?"on":"off")}catch(_){}};
  async function lock(){if(!can())return false;try{if(!standalone()&&!isFs()){const f=el.requestFullscreen||el.webkitRequestFullscreen;if(f)await f.call(el,{navigationUI:"hide"})}await screen.orientation.lock("landscape");return true}catch(_){return false}}
  function unlock(){try{screen.orientation.unlock()}catch(_){}}
  window.orientOn=()=>on;
  window.toggleOrient=async function(){
    if(!can()){toast(L("Ton téléphone ne permet pas de tourner l'écran depuis le jeu : tourne-le simplement (rotation automatique activée).","Your phone doesn't let the game turn the screen: just turn it (with auto-rotate on).","이 휴대폰에서는 게임이 화면을 돌릴 수 없어요. 자동 회전을 켜고 휴대폰을 돌려 주세요.","この端末ではゲームから画面を回転できません。自動回転をオンにして端末を回してね。"));return}
    on=!on;save();
    if(on){const ok=await lock();if(!ok){on=false;save();toast(L("Impossible de tourner l'écran ici. Essaie depuis l'application installée.","Couldn't turn the screen here. Try from the installed app.","여기서는 화면을 돌릴 수 없어요. 설치된 앱에서 해 보세요.","ここでは画面を回転できません。インストールしたアプリで試してね。"))}
      else toast("↻ "+L("Mode paysage activé.","Landscape mode on.","가로 모드 켜짐","横向きモード オン"))}
    else{unlock();toast("↻ "+L("Rotation automatique rétablie.","Auto-rotate restored.","자동 회전으로 돌아왔어요.","自動回転に戻しました。"))}
    paint()};
  window.orientTile=()=>`<button data-g="orient" class="q-or${on?" on":""}"><span>${on?"📱":"🔄"}</span>${on?L("Portrait","Portrait","세로","縦向き"):L("Paysage","Landscape","가로","横向き")}</button>`;
  /* remembered choice: the installed app can lock at once, a browser needs a tap (full screen) */
  if(on){if(standalone())lock();d.addEventListener("pointerdown",function once(e){if(on&&!(e.target.closest&&e.target.closest("#oOrient,[data-g=orient]"))){lock();d.removeEventListener("pointerdown",once,true)}},true)}
  /* leaving full screen in a browser drops the lock: the option goes back off */
  const onfs=()=>{if(on&&!standalone()&&!isFs()){on=false;save();paint()}};d.addEventListener("fullscreenchange",onfs);d.addEventListener("webkitfullscreenchange",onfs);
  /* options panel row */
  const so=$("#oFull")&&$("#oFull").closest(".opt");
  if(so&&!$("#oOrient")){so.insertAdjacentHTML("afterend",`<div class="opt"><span id="oOrientL"></span><button class="tog" id="oOrient"></button></div>`);$("#oOrient").onclick=e=>{e.stopPropagation();toggleOrient()}}
  function paint(){const o=$("#oOrient");if(!o)return;o.setAttribute("aria-pressed",on);const l=$("#oOrientL");if(l)l.textContent=L("Écran en paysage","Landscape screen","가로 화면","横向き画面")}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);paint()};
  paint();
})();
(function(){const st=document.createElement("style");st.textContent=`.g3-quick{grid-template-columns:repeat(auto-fit,minmax(54px,1fr))!important}.g3-quick button{font-size:11.5px!important;padding:4px 2px}`;document.head.appendChild(st)})();
