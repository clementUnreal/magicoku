/* ================= story chapters + mode unlocks ================= */
var CHAPTERS=[["Chapitre I · Les premiers soupçons","Chapter I · First Suspicions","1장 · 첫 의심","第一章・最初の疑い"],
  ["Chapitre II · L'étau se resserre","Chapter II · The Net Tightens","2장 · 좁혀 오는 포위망","第二章・迫る包囲網"],
  ["Chapitre III · Au cœur des ténèbres","Chapter III · Into the Darkness","3장 · 어둠의 한가운데","第三章・闇の奥へ"]];
var CH_SHORT=[["Chapitre I","Chapter I","1장","第一章"],["Chapitre II","Chapter II","2장","第二章"],["Chapitre III","Chapter III","3장","第三章"]];
var UNLOCK={hRush:{lvl:10,name:["le Défi chrono","the Time trial","타임 챌린지","タイムチャレンジ"]},hNight:{lvl:20,name:["le Mode nuit","Night mode","나이트 모드","ナイトモード"]},hLiar:{lvl:30,name:["le Menteur","the Liar","거짓말쟁이 모드","嘘つきモード"]}};
(function(){
  if(typeof STORY_CH!=="undefined"){CHAPTERS=CHAPTERS.concat(STORY_CH);CH_SHORT=CH_SHORT.concat(STORY_SHORT)}
  DATA.forEach((c,i)=>{if(META[c.id])META[c.id].level=CH_SHORT[tierOf(i)]});
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);
    if(!(typeof RUSH!=="undefined"&&RUSH.on)&&!(typeof NIGHT!=="undefined"&&NIGHT.on)){const t=tierOf(ci),k=DATA.filter((c,i)=>i<ci&&tierOf(i)===t).length+1,el=$("#caseTitle");if(el){let g="";if(t<3){const gi=DATA.filter((c,i)=>i<ci&&tierOf(i)<3).length+1,gn=DATA.filter((c,i)=>tierOf(i)<3).length;g=` (${L("enquête","case","사건","事件")} ${gi}/${gn})`}el.textContent=`${TX(M.level)} · ${C.expert?"★ "+L("Expert","Expert","전문가","エキスパート"):L("Niveau","Level","레벨","レベル")+" "+k+"/10"}${C.expert?"":g} · ${TX(M.title)}`}}};
  const isOpen=id=>(typeof isTester==="function"&&isTester())||lvlSolved(UNLOCK[id].lvl-1);
  function paintLocks(){for(const id in UNLOCK){const b=$("#"+id);if(!b)continue;const open=isOpen(id);b.classList.toggle("lockm",!open);
      if(!open){const base=b.textContent.replace(/^🔒\s*/,"").split("\n")[0];b.innerHTML=`🔒 ${base.replace(/^[^\s]+\s/,"")}<small>${L(`Termine le niveau ${UNLOCK[id].lvl} du mode découverte`,`Finish level ${UNLOCK[id].lvl} of discovery mode`,`디스커버리 모드 ${UNLOCK[id].lvl}레벨을 클리어하세요`,`ディスカバリーモードのレベル${UNLOCK[id].lvl}をクリアしよう`)}</small>`}}}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);paintLocks()};
  window.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#hRush,#hNight,#hLiar");if(!b)return;
    if(!isOpen(b.id)){e.stopPropagation();e.preventDefault();try{play("forbid")}catch(_){}const u=UNLOCK[b.id];
      toast(L(`Termine le niveau ${u.lvl} du mode découverte pour débloquer ${u.name[0]}.`,`Finish level ${u.lvl} of discovery mode to unlock ${u.name[1]}.`,`디스커버리 모드 ${u.lvl}레벨을 클리어하면 ${u.name[2]}가 열려요.`,`ディスカバリーモードのレベル${u.lvl}をクリアすると、${u.name[3]}が解放されます。`))}},true);
  try{renderHome();renderStatic()}catch(e){}
})();

/* chapter III: no hints */
(function(){
  const noHint=()=>!(typeof RUSH!=="undefined"&&RUSH.on)&&!(typeof NIGHT!=="undefined"&&NIGHT.on)&&!(typeof HW!=="undefined"&&HW.on)&&!(typeof DAILY!=="undefined"&&DAILY.on)&&!(typeof LIAR!=="undefined"&&LIAR.on)&&tierOf(ci)===2;
  function paintHint(){const b=$("#tHint");if(!b)return;const off=noHint();b.classList.toggle("nohint",off);b.disabled=off;
    if(off)b.innerHTML=`<span>🚫 ${L("Pas d'indice","No hints","힌트 없음","ヒントなし")}</span><small>${L("Chapitre III : à toi de jouer !","Chapter III: you're on your own!","3장: 혼자 힘으로!","第三章：自分の力で！")}</small>`;
    else if(b.querySelector("small"))b.innerHTML=`<span data-t="hint">${TX(TXT.hint)}</span>`}
  const _r=render;render=function(){_r.apply(this,arguments);paintHint()};
  const _h=hint;hint=function(){if(noHint()){toast(L("Pas d'indice dans le chapitre III : c'est à toi de jouer !","No hints in chapter III: it's all up to you!","3장에서는 힌트를 쓸 수 없어요. 혼자 힘으로 풀어 보세요!","第三章ではヒントは使えません。自分の力で解こう！"));return}return _h.apply(this,arguments)};
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);const hs=document.querySelectorAll("#lvls .tier header h3");if(hs[2]&&!hs[2].querySelector(".nh"))hs[2].insertAdjacentHTML("beforeend",`<span class="nh">🚫💡 ${L("sans indice","no hints","힌트 없음","ヒントなし")}</span>`)};
  try{render()}catch(e){}
})();
