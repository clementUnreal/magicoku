
/* ================= home v3: compact header (avatar next to messages/settings) ================= */
(function(){
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{fix()}catch(_){}};
  function fix(){const w=$("#hWho"),home=$("#home");if(!w||!home)return;
    if(w.parentNode!==home){home.appendChild(w)}w.classList.add("h3-av");w.setAttribute("role","button");w.tabIndex=0;
    w.setAttribute("aria-label",L("Mon profil","My profile","내 프로필","プロフィール"));
    const bar=$("#h2Bar");w.hidden=!!(bar&&getComputedStyle(bar).display==="none")}
  const open=()=>{const b=$("#hAccount");if(b)b.click()};
  document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#hWho.h3-av")){e.stopPropagation();open()}},true);
  document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&document.activeElement&&document.activeElement.id==="hWho"){e.preventDefault();open()}});
  try{renderHome()}catch(_){}
})();
