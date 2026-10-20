
/* ================= Discovery mode (chapters I-III) vs Story mode (chapters 1-10) ================= */
var LVMODE="disc";
(function(){
  const FIRST_STORY=DATA.findIndex(c=>/^s\d+n\d+$/.test(c.id));
  const isStory=i=>FIRST_STORY>=0&&i>=FIRST_STORY;
  const _un=unlocked;unlocked=function(i){if(i===FIRST_STORY)return true;return _un(i)};
  /* home buttons */
  const hp=$("#hPlay");
  if(hp&&!$("#hStory")){const b=document.createElement("button");b.className="hb big storyb";b.id="hStory";hp.after(b)}
  function labels(){const b=$("#hStory");if(b)b.textContent="📖 "+L("Mode histoire","Story mode","스토리 모드","ストーリーモード");
    const p=$("#hPlay");if(p)p.textContent="🧭 "+L("Mode découverte","Discovery mode","디스커버리 모드","ディスカバリーモード")}
  /* levels panel: only show the chapters of the current mode */
  function filterTiers(){const secs=document.querySelectorAll("#lvls > section.tier");secs.forEach((s,t)=>{s.hidden=LVMODE==="story"?t<3:t>=3});
    const h=$("#pLevelsT");if(h)h.textContent=LVMODE==="story"?"📖 "+L("Mode histoire","Story mode","스토리 모드","ストーリーモード"):"🧭 "+L("Mode découverte","Discovery mode","디스커버리 모드","ディスカバリーモード")}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);labels();filterTiers()};
  window.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#hPlay,#hStory");if(!t)return;
    LVMODE=t.id==="hStory"?"story":"disc";if(t.id==="hStory"){e.stopPropagation();show("pLevels");try{play("page")}catch(_){}}},true);
  /* opening a level sets the mode, so "back" returns to the right list */
  const _oc=openCase;openCase=function(i){if(typeof i==="number"&&i>=0&&i<DATA.length&&!(typeof RUSH!=="undefined"&&RUSH.on)&&!(typeof NIGHT!=="undefined"&&NIGHT.on)&&!(typeof LIAR!=="undefined"&&LIAR.on))LVMODE=isStory(i)?"story":"disc";return _oc.apply(this,arguments)};
  try{renderHome()}catch(e){}
})();
