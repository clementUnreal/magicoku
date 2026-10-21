/* ================= full screen (Fullscreen API; on iPhone: add to home screen) ================= */
(function(){
  const d=document,el=d.documentElement;
  const isFs=()=>!!(d.fullscreenElement||d.webkitFullscreenElement);
  const can=()=>!!(el.requestFullscreen||el.webkitRequestFullscreen);
  const standalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
  let pref=false;try{pref=localStorage.getItem("magicoku:fullscreen")==="on"}catch(_){}
  function enter(){try{const p=(el.requestFullscreen||el.webkitRequestFullscreen).call(el,{navigationUI:"hide"});if(p&&p.catch)p.catch(()=>{})}catch(_){}}
  function exit(){try{(d.exitFullscreen||d.webkitExitFullscreen).call(d)}catch(_){}}
  function iosTip(){toast(L("Sur iPhone, le plein écran passe par l'écran d'accueil : touche Partager ⬆️ puis « Sur l'écran d'accueil », et lance Magicoku depuis son icône.",
    "On iPhone, full screen works from the home screen: tap Share ⬆️ then “Add to Home Screen”, and open Magicoku from its icon.",
    "아이폰에서는 홈 화면을 이용해야 전체 화면이 돼요. 공유 ⬆️ → ‘홈 화면에 추가’를 누른 뒤 아이콘으로 Magicoku를 열어 주세요.",
    "iPhoneでは、ホーム画面から全画面で遊べます。共有 ⬆️ →「ホーム画面に追加」をタップして、アイコンからMagicokuを開いてね。"))}
  function toggle(){if(standalone()&&!can()){toast(L("Magicoku est déjà en plein écran.","Magicoku is already full screen.","이미 전체 화면이에요.","すでに全画面です。"));return}
    if(!can()){iosTip();return}
    const want=!isFs();if(want){pref=true;try{localStorage.setItem("magicoku:fullscreen","on")}catch(_){}enter()}else exit()}
  /* remembered choice: browsers need a tap, so re-enter on the first tap */
  d.addEventListener("pointerdown",function once(e){if(pref&&can()&&!isFs()&&!(e.target.closest&&e.target.closest("#bFull,#oFull")))enter()},{capture:true});
  /* in-game button next to the sound button */
  const sb=$("#bSound");if(sb&&!$("#bFull")){const b=d.createElement("button");b.id="bFull";b.className=sb.className;sb.after(b);b.onclick=toggle}
  /* options row */
  const so=$("#oMusic")&&$("#oMusic").closest(".opt");
  if(so&&!$("#oFull")){so.insertAdjacentHTML("beforebegin",`<div class="opt"><span id="oFullL"></span><button class="tog" id="oFull"></button></div>`);$("#oFull").onclick=e=>{e.stopPropagation();toggle();setTimeout(paint,150)}}
  function paint(){const on=isFs()||standalone();const b=$("#bFull");
    if(b){b.textContent=isFs()?"🗗":"⛶";b.title=L(isFs()?"Quitter le plein écran":"Plein écran",isFs()?"Exit full screen":"Full screen",isFs()?"전체 화면 끝내기":"전체 화면",isFs()?"全画面を終了":"全画面");b.setAttribute("aria-label",b.title);b.hidden=standalone()&&!can()}
    const o=$("#oFull");if(o){o.setAttribute("aria-pressed",on);$("#oFullL").textContent=L("Plein écran","Full screen","전체 화면","全画面")}}
  const onch=()=>{if(!isFs()&&pref){pref=false;try{localStorage.setItem("magicoku:fullscreen","off")}catch(_){}}paint()};
  d.addEventListener("fullscreenchange",onch);d.addEventListener("webkitfullscreenchange",onch);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);paint()};
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);paint()};
  paint();
})();
