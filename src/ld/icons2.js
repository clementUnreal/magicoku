/* ================= painted icons (Oct 2026 set): music covers, ornaments, renaming quill, bottom bar ================= */
(function(){
  if(typeof IC2==="undefined")return;
  /* music covers */
  if(typeof MU_IMG!=="undefined")Object.assign(MU_IMG,{waltz:IC2.violin,box:IC2.musicbox,lofi:IC2.headphones,fair:IC2.carousel,mystery:IC2.magnifier});
  /* ornaments: a painted ring around the portrait instead of emoji corners */
  const ring=(cls,img,pad)=>`.cav.${cls}{overflow:visible!important}.cav.${cls} img{box-shadow:none!important}
.cav.${cls}::before{content:none!important}
.cav.${cls} img{border-color:transparent!important;outline:0!important}
.cav.${cls}::after{content:""!important;position:absolute!important;inset:${pad}!important;left:${pad}!important;top:${pad}!important;right:${pad}!important;bottom:${pad}!important;width:auto!important;height:auto!important;background:url(${img}) center/contain no-repeat!important;animation:none!important;transform:none!important;pointer-events:none;z-index:2}`;
  const st=document.createElement("style");
  st.textContent=ring("orn-gold",IC2.frame,"-17%")+ring("orn-flowers",IC2.wreath,"-20%")+ring("orn-stars",IC2.starring,"-20%")+`
.h2-bar img.nb-ic{width:30px;height:30px;object-fit:contain;display:block;filter:drop-shadow(0 1px 1px #0008)}
.h2-bar button:not(.on) img.nb-ic{opacity:.82}
.sp-tile img.sp-q{width:62%!important;height:62%!important}
.sp-tile .cav.sp-av>img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;position:absolute!important;top:0!important;left:0!important;margin:0!important;border-radius:50%!important;object-fit:cover!important}
.h2-art img.sb{object-position:50% 50%!important}
.shop2 .sh-tab .sh-ti img{width:20px;height:20px;object-fit:contain}`;
  document.head.appendChild(st);
  /* bottom bar */
  const NAV={h2Home:"home",hRank:"trophy",h2Shop:"bag",hRules:"book",hAccount:"hood"};
  function bar(){for(const [id,k] of Object.entries(NAV)){const b=document.getElementById(id);if(!b||!b.closest("#h2Bar"))continue;
      const sv=b.querySelector("svg");if(sv){const i=document.createElement("img");i.className="nb-ic";i.alt="";i.src=IC2[k];sv.replaceWith(i)}}}
  /* story banner on the home hero (the Discovery picture stays while the story is locked) */
  function hero(){const im=document.querySelector("#h2Hero .h2-art img");if(!im||!IC2.storybanner)return;const locked=typeof storyLocked==="function"&&storyLocked();
    const want=locked?(typeof IMG!=="undefined"&&IMG.forest||im.src):IC2.storybanner;if(im.getAttribute("src")!==want)im.setAttribute("src",want);im.classList.toggle("sb",!locked)}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{bar();hero()}catch(_){}};
  /* shop: the renaming quill and the tab icons */
  const TAB={x:null,m:IC2.violin,o:IC2.frame,n:IC2.quillblue};
  function shop(){const p=document.getElementById("pShop");if(!p)return;
    if(typeof MK_IMG!=="undefined"&&MK_IMG.cross)p.querySelectorAll(".sp-tile>.sp-xsvg").forEach(e=>{const i=document.createElement("img");i.alt="";i.src=MK_IMG.cross;e.replaceWith(i)});
    p.querySelectorAll(".sh-quill .sp-e").forEach(e=>{const i=document.createElement("img");i.className="sp-q";i.alt="";i.src=IC2.quillblue;e.replaceWith(i)});
    p.querySelectorAll(".sh-tab[data-cat]").forEach(t=>{const src=TAB[t.dataset.cat],ti=t.querySelector(".sh-ti");if(src&&ti&&!ti.querySelector("img"))ti.innerHTML=`<img src="${src}" alt="">`})}
  try{let q=0;new MutationObserver(()=>{if(q)return;q=1;requestAnimationFrame(()=>{q=0;try{shop();bar()}catch(_){}})}).observe(document.getElementById("home")||document.body,{childList:true,subtree:true})}catch(_){}
  try{bar()}catch(_){}
})();
