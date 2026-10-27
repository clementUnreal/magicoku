/* ================= full screen (Fullscreen API; on iPhone: add to home screen) ================= */
(function(){
  const d=document,el=d.documentElement;
  const isFs=()=>!!(d.fullscreenElement||d.webkitFullscreenElement);
  const can=()=>!!(el.requestFullscreen||el.webkitRequestFullscreen);
  const standalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
  let pref=false;try{pref=localStorage.getItem("magicoku:fullscreen")==="on"}catch(_){}
  function enter(){try{const p=(el.requestFullscreen||el.webkitRequestFullscreen).call(el,{navigationUI:"hide"});if(p&&p.catch)p.catch(()=>{})}catch(_){}}
  function exit(){try{(d.exitFullscreen||d.webkitExitFullscreen).call(d)}catch(_){}}
  function iosTip(){let m=$("#iosFs");if(m)m.remove();m=d.createElement("div");m.className="modal";m.id="iosFs";
    m.innerHTML=`<div class="mbox" style="max-width:440px"><h2>⛶ ${L("Plein écran sur iPhone","Full screen on iPhone","아이폰에서 전체 화면","iPhoneで全画面")}</h2>
      <p style="font:500 15px/1.5 var(--f-simple,system-ui)">${L("Safari ne permet pas aux sites de passer en plein écran. Installe plutôt Magicoku sur ton écran d'accueil : il s'ouvrira alors sans barre Safari.","Safari doesn't let websites go full screen. Add Magicoku to your home screen instead: it will then open without Safari's bars.","사파리에서는 사이트가 전체 화면으로 바뀔 수 없어요. 대신 Magicoku를 홈 화면에 추가하면 사파리 막대 없이 열려요.","Safariではサイトを全画面にできません。代わりにMagicokuをホーム画面に追加すると、Safariのバーなしで開きます。")}</p>
      <ol style="font:500 15px/1.6 var(--f-simple,system-ui);padding-left:22px;margin:6px 0">
        <li>${L("Touche <b>Partager</b> ⬆️ en bas de Safari","Tap <b>Share</b> ⬆️ at the bottom of Safari","사파리 아래쪽의 <b>공유</b> ⬆️를 누르세요","Safari下部の<b>共有</b> ⬆️ をタップ")}</li>
        <li>${L("Choisis <b>Sur l'écran d'accueil</b>, puis <b>Ajouter</b>","Pick <b>Add to Home Screen</b>, then <b>Add</b>","<b>홈 화면에 추가</b>를 고른 뒤 <b>추가</b>를 누르세요","<b>ホーム画面に追加</b>を選んで<b>追加</b>")}</li>
        <li>${L("Lance Magicoku depuis sa nouvelle icône","Open Magicoku from its new icon","새 아이콘으로 Magicoku를 여세요","新しいアイコンからMagicokuを開く")}</li></ol>
      <div style="text-align:center;margin-top:12px"><button class="pill red" id="iosFsOk">OK</button></div></div>`;
    d.body.appendChild(m);m.hidden=false;m.addEventListener("click",e=>{if(e.target===m||e.target.id==="iosFsOk")m.remove()})}
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
    const o=$("#oFull");if(o){const row=o.closest(".opt");if(row)row.hidden=standalone()&&!can();o.setAttribute("aria-pressed",on);o.classList.toggle("ios",!can());$("#oFullL").textContent=L("Plein écran","Full screen","전체 화면","全画面")+(!can()?" (iPhone : "+L("écran d'accueil","home screen","홈 화면","ホーム画面")+")":"")}}
  const onch=()=>{if(!isFs()&&pref){pref=false;try{localStorage.setItem("magicoku:fullscreen","off")}catch(_){}}paint()};
  d.addEventListener("fullscreenchange",onch);d.addEventListener("webkitfullscreenchange",onch);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);paint()};
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);paint()};
  paint();
})();
