/* ================= level 11 (expert) in every chapter ================= */
(function(){
  const isEx=i=>i>=0&&i<DATA.length&&!!DATA[i].expert;
  /* the expert level opens after level 10; the next chapter does not wait for it */
  const _un=unlocked;unlocked=function(i){if(_un.apply(this,arguments))return true;if(i>1&&isEx(i-1))return lvlSolved(i-2);return false};
  /* first time a player sees the expert levels: one gentle note */
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);document.querySelectorAll(".lvc.expert").forEach(b=>b.title=L("Niveau expert : plus grand, moins d'indices, beaucoup plus de réflexion.","Expert level: bigger, fewer clues, much more thinking.","전문가 레벨: 더 크고, 단서는 적고, 훨씬 더 많은 추리가 필요해요.","エキスパートレベル：より大きく、手がかりは少なく、もっと考える必要があります。"))};
  const _oc=openCase;openCase=function(i){const r=_oc.apply(this,arguments);if(isEx(i)&&!(typeof RUSH!=="undefined"&&RUSH.on)){let seen=null;try{seen=localStorage.getItem("magicoku:expertSeen")}catch(_){}
      if(!seen){try{localStorage.setItem("magicoku:expertSeen","1")}catch(_){}setTimeout(()=>toast(L("★ Niveau expert : un plateau plus grand, très peu d'indices et aucun suspect évident. Prends ton temps !","★ Expert level: a bigger board, very few clues and no obvious suspect. Take your time!","★ 전문가 레벨: 더 큰 판, 아주 적은 단서, 뻔한 용의자는 없어요. 천천히 생각하세요!","★ エキスパートレベル：盤面は大きく、手がかりはわずか、わかりやすい容疑者はいません。じっくり考えよう！")),900)}}return r};
})();
