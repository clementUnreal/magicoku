/* ================= navigation: back buttons on top + system back gesture ================= */
(function(){
  document.querySelectorAll(".home-panel").forEach(p=>{const b=p.querySelector(":scope > [data-back]");if(b){b.classList.add("top");p.prepend(b)}});
  const vis=s=>{const e=$(s);return e&&!e.hidden};
  function atRoot(){if(vis("#verdict"))return false;if(document.querySelector(".modal:not([hidden])")||vis("#reveal")||vis("#tuto"))return false;
    if(!vis("#home"))return false;return vis("#hMain")}
  function doBack(){
    if(vis("#rushCard"))return;
    if(vis("#verdict"))return;
    const m=document.querySelector(".modal:not([hidden])");if(m){m.hidden=true;return}
    if(vis("#reveal")){$("#reveal").hidden=true;return}
    if(vis("#tuto")){endTuto();return}
    if(!vis("#home")){$("#home").hidden=false;show(typeof RUSH!=="undefined"&&RUSH.on?"pRush":"pLevels");try{play("page")}catch(e){}return}
    if(!vis("#hMain")){show("hMain");try{play("page")}catch(e){}}
  }
  let trapped=false,ignore=false,pend=false;
  function sync(){pend=false;const root=atRoot();
    if(!root&&!trapped){try{history.pushState({mk:1},"");trapped=true}catch(e){}}
    else if(root&&trapped){trapped=false;ignore=true;try{history.back()}catch(e){ignore=false}}}
  const later=()=>{if(!pend){pend=true;setTimeout(sync,60)}};
  window.addEventListener("popstate",()=>{if(ignore){ignore=false;return}trapped=false;doBack();later()});
  new MutationObserver(later).observe(document.body,{attributes:true,attributeFilter:["hidden"],subtree:true,childList:true});
  later();
})();
