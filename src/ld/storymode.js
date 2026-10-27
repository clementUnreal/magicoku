
/* ================= Discovery mode (chapters I-III) vs Story mode (chapters 1-10) ================= */
var LVMODE="disc";
/* story mode temporarily closed while it is being reworked — open only for the testers below */
var STORY_TESTERS=["clemonchichi"]; /* testers: everything unlocked (admin codes stay with ADMIN_NAME) */
function isTester(){try{const p=ACC&&ACC.profile&&ACC.profile.pseudo;return !!(p&&STORY_TESTERS.includes(String(p).trim().toLowerCase()))}catch(e){return false}}
/* story mode opens once every Discovery case is solved (players who already solved a story case keep it open) */
function discIdx(){return DATA.map((c,i)=>i).filter(i=>!/^s\d+n\d+$/.test(DATA[i].id))}
function discDone(){return discIdx().filter(i=>lvlSolved(i)).length}
function nextDisc(){const d=discIdx();return d.find(i=>unlocked(i)&&!lvlSolved(i))??d[0]}
function storyStarted(){try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^crimes-mignons-wiz:s\d+n\d+$/.test(k)){const v=JSON.parse(localStorage.getItem(k)||"null");if(v&&((v.time||0)>0||Object.keys(v.place||{}).length))return true}}}catch(_){}return false}
function storyLocked(){if(isTester())return false;const d=discIdx();if(discDone()>=d.length)return false;if(storyStarted())return false;return !DATA.some((c,i)=>/^s\d+n\d+$/.test(c.id)&&lvlSolved(i))}
function storyLockMsg(){const n=discDone(),t=discIdx().length;return L(`Le mode histoire s'ouvre quand tu as résolu les ${t} enquêtes du mode Découverte (${n}/${t}).`,`Story mode opens once you've solved the ${t} Discovery cases (${n}/${t}).`,`디스커버리 모드의 사건 ${t}개를 모두 풀면 스토리 모드가 열려요 (${n}/${t}).`,`ディスカバリーモードの事件${t}件をすべて解くと、ストーリーモードが開きます（${n}/${t}）。`)}
(function(){
  const FIRST_STORY=DATA.findIndex(c=>/^s\d+n\d+$/.test(c.id));
  const isStory=i=>FIRST_STORY>=0&&i>=FIRST_STORY;
  const _un=unlocked;unlocked=function(i){if(isTester())return true;if(i===FIRST_STORY)return true;return _un(i)};
  /* home buttons */
  const hp=$("#hPlay");
  if(hp&&!$("#hStory")){const b=document.createElement("button");b.className="hb big storyb";b.id="hStory";hp.after(b)}
  function labels(){const b=$("#hStory");if(b){b.classList.toggle("lockm",storyLocked());
      if(storyLocked())b.innerHTML=`🔒 ${L("Mode histoire","Story mode","스토리 모드","ストーリーモード")}<small>${L("Après le mode Découverte","After Discovery mode","디스커버리 모드 이후","ディスカバリーモードのあとで")} (${typeof discChDone==="function"?discChDone()+"/3":discDone()+"/"+discIdx().length})</small>`;
      else b.textContent="📖 "+L("Mode histoire","Story mode","스토리 모드","ストーリーモード")}
    const p=$("#hPlay");if(p)p.textContent="🧭 "+L("Mode découverte","Discovery mode","디스커버리 모드","ディスカバリーモード")}
  /* levels panel: only show the chapters of the current mode */
  function filterTiers(){const secs=document.querySelectorAll("#lvls > section.tier");secs.forEach((s,t)=>{s.hidden=LVMODE==="story"?t<3:t>=3});
    const h=$("#pLevelsT");if(h)h.textContent=LVMODE==="story"?"📖 "+L("Mode histoire","Story mode","스토리 모드","ストーリーモード"):"🧭 "+L("Mode découverte","Discovery mode","디스커버리 모드","ディスカバリーモード")}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);labels();filterTiers()};
  window.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#hPlay,#hStory");if(!t)return;
    if(t.id==="hStory"&&storyLocked()){e.stopPropagation();try{play("forbid")}catch(_){}toast("🔒 "+storyLockMsg());LVMODE="disc";show("pLevels");return}
    LVMODE=t.id==="hStory"?"story":"disc";if(t.id==="hStory"){e.stopPropagation();show("pLevels");try{play("page")}catch(_){}}},true);
  /* opening a level sets the mode, so "back" returns to the right list */
  const _oc=openCase;openCase=function(i){if(typeof i==="number"&&i>=0&&i<DATA.length&&!(typeof RUSH!=="undefined"&&RUSH.on)&&!(typeof NIGHT!=="undefined"&&NIGHT.on)&&!(typeof LIAR!=="undefined"&&LIAR.on))LVMODE=isStory(i)?"story":"disc";return _oc.apply(this,arguments)};
  try{renderHome()}catch(e){}
})();
