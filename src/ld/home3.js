
/* ================= home v3: compact header (avatar next to messages/settings) ================= */
(function(){
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{fix()}catch(_){}};
  function fix(){const w=$("#hWho"),home=$("#home");if(!w||!home)return;
    /* header: logo on the left, avatar + messages + settings grouped on the right, inside the same column */
    const logo=document.querySelector(".home-in.h2in .home-logo");let grp=$("#h3Acts");
    if(logo&&!grp){grp=document.createElement("div");grp.id="h3Acts";grp.className="h3-acts";logo.appendChild(grp)}
    if(grp){[w,$("#chatBtn"),$("#hOptions")].forEach(el=>{if(el&&el.parentNode!==grp)grp.appendChild(el)})}
    else if(w.parentNode!==home){home.appendChild(w)}
    w.classList.add("h3-av");w.setAttribute("role","button");w.tabIndex=0;
    w.setAttribute("aria-label",L("Mon profil","My profile","내 프로필","プロフィール"));
    const bar=$("#h2Bar"),main=$("#hMain");w.hidden=!!(bar&&getComputedStyle(bar).display==="none")||!!(main&&main.hidden)}
  const open=()=>{const b=$("#hAccount");if(b)b.click()};
  document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#hWho.h3-av")){e.stopPropagation();open()}},true);
  document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&document.activeElement&&document.activeElement.id==="hWho"){e.preventDefault();open()}});
  try{renderHome()}catch(_){}
})();

/* keep the page bottom padding equal to the real navigation height (safe area included) */
(function(){const set=()=>{const b=$("#h2Bar");if(!b)return;const h=b.getBoundingClientRect().height;if(h)document.documentElement.style.setProperty("--barh",Math.ceil(h)+"px")};
  try{new ResizeObserver(set).observe(document.body)}catch(_){}window.addEventListener("resize",set);window.addEventListener("orientationchange",()=>setTimeout(set,300));setTimeout(set,300);setTimeout(set,1500)})();
