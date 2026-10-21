
/* ================= Discovery mode (chapters I-III) vs Story mode (chapters 1-10) ================= */
var LVMODE="disc";
/* story mode temporarily closed while it is being reworked — open only for the testers below */
var STORY_TESTERS=[]; /* nobody gets everything unlocked any more (admin codes stay with ADMIN_NAME) */
function isTester(){try{const p=ACC&&ACC.profile&&ACC.profile.pseudo;return !!(p&&STORY_TESTERS.includes(String(p).trim().toLowerCase()))}catch(e){return false}}
function storyLocked(){return false} /* story mode is open to everyone (levels unlock one by one) */
(function(){
  const FIRST_STORY=DATA.findIndex(c=>/^s\d+n\d+$/.test(c.id));
  const isStory=i=>FIRST_STORY>=0&&i>=FIRST_STORY;
  const _un=unlocked;unlocked=function(i){if(isTester())return true;if(i===FIRST_STORY)return true;return _un(i)};
  /* home buttons */
  const hp=$("#hPlay");
  if(hp&&!$("#hStory")){const b=document.createElement("button");b.className="hb big storyb";b.id="hStory";hp.after(b)}
  function labels(){const b=$("#hStory");if(b){b.classList.toggle("lockm",storyLocked());
      if(storyLocked())b.innerHTML=`🔒 ${L("Mode histoire","Story mode","스토리 모드","ストーリーモード")}<small>${L("Bientôt disponible","Coming soon","곧 공개돼요","近日公開")}</small>`;
      else b.textContent="📖 "+L("Mode histoire","Story mode","스토리 모드","ストーリーモード")}
    const p=$("#hPlay");if(p)p.textContent="🧭 "+L("Mode découverte","Discovery mode","디스커버리 모드","ディスカバリーモード")}
  /* levels panel: only show the chapters of the current mode */
  function filterTiers(){const secs=document.querySelectorAll("#lvls > section.tier");secs.forEach((s,t)=>{s.hidden=LVMODE==="story"?t<3:t>=3});
    const h=$("#pLevelsT");if(h)h.textContent=LVMODE==="story"?"📖 "+L("Mode histoire","Story mode","스토리 모드","ストーリーモード"):"🧭 "+L("Mode découverte","Discovery mode","디스커버리 모드","ディスカバリーモード")}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);labels();filterTiers()};
  window.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#hPlay,#hStory");if(!t)return;
    if(t.id==="hStory"&&storyLocked()){e.stopPropagation();try{play("forbid")}catch(_){}toast(L("Le mode histoire arrive bientôt : nous le peaufinons encore.","Story mode is coming soon: we're still polishing it.","스토리 모드는 곧 공개돼요. 아직 다듬는 중이에요.","ストーリーモードは近日公開。いま仕上げているところです。"));return}
    LVMODE=t.id==="hStory"?"story":"disc";if(t.id==="hStory"){e.stopPropagation();show("pLevels");try{play("page")}catch(_){}}},true);
  /* opening a level sets the mode, so "back" returns to the right list */
  const _oc=openCase;openCase=function(i){if(typeof i==="number"&&i>=0&&i<DATA.length&&!(typeof RUSH!=="undefined"&&RUSH.on)&&!(typeof NIGHT!=="undefined"&&NIGHT.on)&&!(typeof LIAR!=="undefined"&&LIAR.on))LVMODE=isStory(i)?"story":"disc";return _oc.apply(this,arguments)};
  try{renderHome()}catch(e){}
})();
