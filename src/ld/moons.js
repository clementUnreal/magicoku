/* ================= Moons: 1 to 3 per level, a chapter opens with enough moons in the previous one =================
   score = active time + 60 s per hint, compared with the level's "par" (median of all players, /api/pars; fallback by grid size)
   3 moons: score <= par · 2 moons: score <= 2.5 × par · 1 moon: solved.
   The next chapter opens with MOONS.need moons in the previous chapter (out of 30), or when its 10 levels are all solved.
   Inside a chapter a level opens when one of the two previous levels is solved: one tough level can be skipped. */
var MOONS={need:18,pars:{}};
function moonIcon(cls){return `<svg class="moon${cls?" "+cls:""}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="8.6" cy="9" r="2.2" fill="#0000001c"/><circle cx="15.4" cy="14.6" r="2.9" fill="#0000001c"/><circle cx="14.6" cy="7.4" r="1.3" fill="#0000001c"/></svg>`}
(function(){
  try{MOONS.pars=JSON.parse(localStorage.getItem("magicoku:pars")||"{}")||{}}catch(_){}
  const prog=id=>ACC.profile&&ACC.profile.progress&&ACC.profile.progress[id];
  const isEx=i=>!!(DATA[i]&&DATA[i].expert);
  const idxN=t=>DATA.map((c,i)=>i).filter(i=>tierOf(i)===t&&!isEx(i));
  function par(i){const id=DATA[i].id,n=DATA[i].rooms.length,p=+MOONS.pars[id];return p>0?p:n*n*8}
  function moonsFor(i,rec){if(!rec||!rec.solved)return 0;const s=(rec.time||0)+60*(rec.hints||0),p=par(i);return s<=p?3:s<=2.5*p?2:1}
  function levelMoons(i){const pr=prog(DATA[i].id);if(pr&&pr.solved)return Math.max(pr.moons||0,moonsFor(i,pr));return lvlSolved(i)?1:0}
  function tierMoons(t){return idxN(t).reduce((a,i)=>a+levelMoons(i),0)}
  function tierMax(t){return idxN(t).length*3}
  function tierValid(t){const ix=idxN(t);return !!ix.length&&(tierMoons(t)>=MOONS.need||ix.every(lvlSolved))}
  function tierOpen(t){if(typeof isTester==="function"&&isTester())return true;if(t===0)return true;
    if(t===3)return !(typeof storyLocked==="function"&&storyLocked());
    if(DATA.some((c,i)=>tierOf(i)===t&&lvlSolved(i)))return true;return tierValid(t-1)}
  Object.assign(window,{levelMoons,tierMoons,tierMax,tierValid,tierOpen,moonsFor});
  /* freeze: a level never loses moons it already showed (pars move as more people play) */
  function freezeAll(){const p=ACC.profile;if(!p||!p.progress)return;let ch=false;
    for(const [id,pr] of Object.entries(p.progress)){const i=DATA.findIndex(c=>c.id===id);if(i<0||!pr||!pr.solved)continue;const m=Math.max(pr.moons||0,moonsFor(i,pr));if(m!==pr.moons){pr.moons=m;ch=true}}
    if(ch)try{localStorage.setItem(LKEY,JSON.stringify(p))}catch(_){}}
  fetch("/api/pars",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(d=>{if(d&&typeof d==="object"){MOONS.pars=d;try{localStorage.setItem("magicoku:pars",JSON.stringify(d))}catch(_){}}freezeAll();try{renderHome()}catch(_){}}).catch(()=>{freezeAll()});
  /* unlocking */
  const _unT=unlocked;
  unlocked=function(i){if(typeof isTester==="function"&&isTester())return true;if(i<0||i>=DATA.length)return false;if(lvlSolved(i))return true;if(i===DATA.findIndex(c=>/^s\d+n\d+$/.test(c.id))&&!storyLocked())return true;
    const t=tierOf(i);if(!tierOpen(t))return false;const ix=idxN(t);
    if(isEx(i))return !!ix.length&&lvlSolved(ix[ix.length-1]);
    const k=ix.indexOf(i);if(k<0)return _unT(i);return k===0||lvlSolved(ix[k-1])||(k>=2&&lvlSolved(ix[k-2]))};
  /* story mode: opens once the 3 Discovery chapters are validated (players who already started it keep it) */
  const _sl=storyLocked;storyLocked=function(){if(typeof isTester==="function"&&isTester())return false;if([0,1,2].every(tierValid))return false;return _sl()};
  window.discChDone=()=>[0,1,2].filter(tierValid).length;
  storyLockMsg=function(){return L(`Le mode histoire s'ouvre quand les 3 chapitres du mode Découverte sont validés (${discChDone()}/3). Un chapitre est validé avec ${MOONS.need} lunes sur 30.`,
    `Story mode opens once the 3 Discovery chapters are cleared (${discChDone()}/3). A chapter is cleared with ${MOONS.need} moons out of 30.`,
    `디스커버리 모드의 3개 장을 통과하면 스토리 모드가 열려요 (${discChDone()}/3). 한 장은 달 30개 중 ${MOONS.need}개를 모으면 통과예요.`,
    `ディスカバリーモードの3つの章をクリアするとストーリーモードが開きます（${discChDone()}/3）。章は月30個のうち${MOONS.need}個でクリアです。`)};
  /* recording: keep the best moons ever earned on a level (a replay changes nothing) */
  const _rw=recordWin;recordWin=function(){const id=C&&C.id,before=prog(id),bm=before?Math.max(before.moons||0,moonsFor(ci,before)):0;const out=_rw.apply(this,arguments);
    try{if(!(S&&S.replay)){const pr=prog(id);if(pr&&pr.solved){const m=Math.max(bm,moonsFor(ci,pr),moonsFor(ci,{solved:true,time:S.time||0,hints:S.hints||0}));if(pr.moons!==m){pr.moons=m;saveProfile()}}}}catch(_){}return out};
  /* end-of-case popup: the 3 stars become this game's moons + where the chapter stands */
  const special=()=>(typeof RUSH!=="undefined"&&RUSH.on)||(typeof NIGHT!=="undefined"&&NIGHT.on)||(typeof LIAR!=="undefined"&&LIAR.on)||(typeof DAILY!=="undefined"&&DAILY.on)||(typeof COOP!=="undefined"&&COOP.play);
  const _sr=showReveal;showReveal=function(){const out=_sr.apply(this,arguments);try{if(special())return out;const box=document.querySelector("#reveal .box");if(!box)return out;
      const m=moonsFor(ci,{solved:true,time:S.time||0,hints:S.hints||0}),st=box.querySelector(".rv-stars");
      if(st){st.classList.add("rv-moons");st.setAttribute("aria-label",m+"/3");st.innerHTML=[0,1,2].map(k=>`<span class="${k<m?"on":""}" style="animation-delay:${.25+k*.18}s">${moonIcon()}</span>`).join("")}
      const t=tierOf(ci);if(!isEx(ci)&&idxN(t).length){const have=tierMoons(t),mx=tierMax(t),ok=tierValid(t),nx=idxN(t+1).length&&tierOpen(t+1);
        let line;if(ok)line=nx?L("Chapitre validé : le suivant est ouvert !","Chapter cleared: the next one is open!","장 통과: 다음 장이 열렸어요!","章クリア：次の章が開きました！"):L("Chapitre validé !","Chapter cleared!","장 통과!","章クリア！");
        else{const n=MOONS.need-have;line=L(`Encore ${n} lune${n>1?"s":""} pour ouvrir le chapitre suivant`,`${n} more moon${n>1?"s":""} to open the next chapter`,`다음 장까지 달 ${n}개 남았어요`,`次の章まであと月${n}個`)}
        let el=box.querySelector(".mn-ch");if(!el){el=document.createElement("div");el.className="mn-ch";const pg=box.querySelector(".rv-prog");if(pg)pg.after(el);else if(st)st.after(el)}
        el.innerHTML=`${moonIcon("sm")}<b>${have}/${mx}</b><span>${line}</span>`;el.classList.toggle("ok",ok)}
      const nb=box.querySelector("#rvNext");if(nb&&ci+1<DATA.length&&!unlocked(ci+1)){nb.textContent=L("Voir les niveaux","See the levels","레벨 보기","レベルを見る")+" ›";
        nb.onclick=()=>{$("#reveal").hidden=true;$("#home").hidden=false;try{LVMODE=ci>=DATA.findIndex(c=>/^s\d+n\d+$/.test(c.id))?"story":"disc"}catch(_){}show("pLevels")}}}catch(_){}return out};
  /* level picker: moons on each card, chapter total in the header */
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{paintPicker()}catch(_){}};
  function paintPicker(){const v=$("#lvView");if(!v||v.hidden)return;
    v.querySelectorAll(".lvc[data-lv]").forEach(b=>{const i=+b.dataset.lv;if(isEx(i)||b.querySelector(".lvm"))return;const m=levelMoons(i);
      const s=document.createElement("span");s.className="lvm";s.setAttribute("aria-label",m+"/3");s.innerHTML=[0,1,2].map(k=>moonIcon(k<m?"on":"")).join("");const n=b.querySelector(".lvn");if(n)n.before(s);else b.appendChild(s)});
    const pr=v.querySelector(".lvprog");if(pr&&!v.querySelector(".lvmoons")){const any=v.querySelector(".lvc[data-lv]");if(!any)return;const t=tierOf(+any.dataset.lv),have=tierMoons(t),ok=tierValid(t);
      const d=document.createElement("div");d.className="lvmoons"+(ok?" ok":"");
      d.innerHTML=`${moonIcon("sm")}<b>${have} / ${tierMax(t)}</b><span>${ok?L("Chapitre validé ✓","Chapter cleared ✓","장 통과 ✓","章クリア ✓"):L(`${MOONS.need} lunes pour ouvrir le chapitre suivant`,`${MOONS.need} moons open the next chapter`,`달 ${MOONS.need}개면 다음 장이 열려요`,`月${MOONS.need}個で次の章へ`)}</span>`;pr.after(d)}}
  try{let q=0;new MutationObserver(()=>{if(q)return;q=1;requestAnimationFrame(()=>{q=0;try{paintPicker()}catch(_){}})}).observe($("#home"),{childList:true,subtree:true})}catch(_){}
  /* "next case" skips a level left behind: the first open unsolved level after the last solved one */
  window.nextOpen=function(list){const last=list.reduce((a,i,k)=>lvlSolved(i)?k:a,-1);return list.slice(last+1).find(i=>unlocked(i)&&!lvlSolved(i))??list.find(i=>unlocked(i)&&!lvlSolved(i))};
  nextDisc=function(){const d=discIdx().filter(i=>!isEx(i));return nextOpen(d)??discIdx()[0]};
  /* the picker's own "locked" messages */
  document.addEventListener("click",e=>{const v=$("#lvView");if(!v||v.hidden)return;const t=e.target.closest&&e.target.closest("[data-ch],[data-lv]");if(!t||!v.contains(t))return;
    if(t.dataset.ch!=null){const ch=+t.dataset.ch,ix=DATA.map((c,i)=>i).filter(i=>tierOf(i)===ch);if(ix.length&&!unlocked(ix[0])){e.stopPropagation();try{play("forbid")}catch(_){}
        toast(ch===3?storyLockMsg():L(`Il faut ${MOONS.need} lunes dans le chapitre précédent pour ouvrir celui-ci (ou le finir en entier).`,`You need ${MOONS.need} moons in the previous chapter to open this one (or finish it completely).`,`이 장을 열려면 이전 장에서 달 ${MOONS.need}개가 필요해요 (또는 모두 해결).`,`この章を開くには、前の章で月${MOONS.need}個が必要です（または全部クリア）。`))}}
    else if(t.dataset.lv!=null){const i=+t.dataset.lv;if(!unlocked(i)){e.stopPropagation();try{play("forbid")}catch(_){}
        toast(isEx(i)?L("Le niveau expert s'ouvre après le niveau 10.","The expert level opens after level 10.","전문가 레벨은 10레벨 후에 열려요.","エキスパートはレベル10のあとで開きます。")
          :L("Résous l'un des deux niveaux précédents pour ouvrir celui-ci.","Solve one of the two previous levels to open this one.","이전 두 레벨 중 하나를 해결하면 열려요.","前の2つのレベルのどちらかを解くと開きます。"))}}},true);
  const st=document.createElement("style");st.textContent=`.moon{width:1em;height:1em;display:inline-block;vertical-align:-.15em}
.rv-moons span{display:inline-flex}.rv-moons .moon{width:34px;height:34px;color:#d9cba8;filter:drop-shadow(0 2px 0 #fff8)}
.rv-moons span.on .moon{color:#f4cf5a;filter:drop-shadow(0 2px 0 #9a6a10) drop-shadow(0 0 8px #f6d36a)}
.mn-ch{display:flex;align-items:center;gap:6px;margin:8px 0 0;padding:7px 10px;border-radius:10px;background:rgba(58,31,61,.08);color:#4a2f5a;font:600 13px/1.3 var(--f-simple,system-ui)!important;text-align:left}
.mn-ch .moon{color:#e0b43c;font-size:17px;flex:0 0 auto}.mn-ch b{font-weight:800;color:#3a1f3d;white-space:nowrap}.mn-ch.ok{background:rgba(63,125,58,.12);color:#2f5f2b}
.lvm{display:flex;justify-content:center;gap:2px;font-size:15px;margin:2px 0}.lvc .lvm svg.moon{width:20px!important;height:20px!important;position:static!important;flex:0 0 auto}.lvm .moon{color:#cbbd9c;opacity:.55}.lvm .moon.on{color:#e9bd3f;opacity:1;filter:drop-shadow(0 1px 0 #8a5d10)}
.lvc.locked .lvm{display:none}
.lvmoons{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-top:6px;font:600 13px var(--f-simple,system-ui)!important;color:inherit;opacity:.95}
.lvmoons .moon{color:#e9bd3f;font-size:18px}.lvmoons b{font-weight:800}.lvmoons.ok span{color:#5aa65a}`;document.head.appendChild(st);
  freezeAll();try{renderHome()}catch(_){}
})();
