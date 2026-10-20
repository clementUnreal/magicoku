/* ================= story chapters + mode unlocks ================= */
var CHAPTERS=[["Chapitre I · Les premiers soupçons","Chapter I · First Suspicions","1장 · 첫 의심","第一章・最初の疑い"],
  ["Chapitre II · L'étau se resserre","Chapter II · The Net Tightens","2장 · 좁혀 오는 포위망","第二章・迫る包囲網"],
  ["Chapitre III · Au cœur des ténèbres","Chapter III · Into the Darkness","3장 · 어둠의 한가운데","第三章・闇の奥へ"]];
var CH_SHORT=[["Chapitre I","Chapter I","1장","第一章"],["Chapitre II","Chapter II","2장","第二章"],["Chapitre III","Chapter III","3장","第三章"]];
var UNLOCK={hRush:{lvl:10,name:["le Défi chrono","the Time trial","타임 챌린지","タイムチャレンジ"]},hNight:{lvl:20,name:["le Mode nuit","Night mode","나이트 모드","ナイトモード"]}};
(function(){
  DATA.forEach((c,i)=>{if(META[c.id])META[c.id].level=CH_SHORT[tierOf(i)]});
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);
    if(!(typeof RUSH!=="undefined"&&RUSH.on)&&!(typeof NIGHT!=="undefined"&&NIGHT.on)){const t=tierOf(ci),k=DATA.filter((c,i)=>i<ci&&tierOf(i)===t).length+1,el=$("#caseTitle");if(el)el.textContent=`${TX(M.level)} · ${k}/10 · ${TX(M.title)}`}};
  const isOpen=id=>lvlSolved(UNLOCK[id].lvl-1);
  function paintLocks(){for(const id in UNLOCK){const b=$("#"+id);if(!b)continue;const open=isOpen(id);b.classList.toggle("lockm",!open);
      if(!open){const base=b.textContent.replace(/^🔒\s*/,"").split("\n")[0];b.innerHTML=`🔒 ${base.replace(/^[^\s]+\s/,"")}<small>${L(`Termine le niveau ${UNLOCK[id].lvl} du mode histoire`,`Finish level ${UNLOCK[id].lvl} of story mode`,`스토리 모드 ${UNLOCK[id].lvl}레벨을 클리어하세요`,`ストーリーモードのレベル${UNLOCK[id].lvl}をクリアしよう`)}</small>`}}}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);paintLocks()};
  window.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#hRush,#hNight");if(!b)return;
    if(!isOpen(b.id)){e.stopPropagation();e.preventDefault();try{play("forbid")}catch(_){}const u=UNLOCK[b.id];
      toast(L(`Termine le niveau ${u.lvl} du mode histoire pour débloquer ${u.name[0]}.`,`Finish level ${u.lvl} of story mode to unlock ${u.name[1]}.`,`스토리 모드 ${u.lvl}레벨을 클리어하면 ${u.name[2]}가 열려요.`,`ストーリーモードのレベル${u.lvl}をクリアすると、${u.name[3]}が解放されます。`))}},true);
  try{renderHome();renderStatic()}catch(e){}
})();
