/* ================= Rules as a full page (bottom bar), compact so it fits without scrolling ================= */
(function(){
  const home=$("#home");if(!home)return;
  function page(){let p=$("#pRulesP");if(!p){p=document.createElement("div");p.id="pRulesP";p.className="home-panel rp-page";p.hidden=true;
      const nav=$("#hMain");(nav&&nav.parentNode||home).insertBefore(p,nav?nav.nextSibling:null);
      p.addEventListener("click",e=>{const b=e.target.closest("[data-rp]");if(!b)return;if(b.dataset.rp==="more"){openModal("#mRules");const d=document.querySelector("#rulesBody details.r3-more");if(d)d.open=true}})}return p}
  /* short wording for the page; the drawings come from the rules sheet (#rulesBody) */
  const R=[
    [["Une personne par rangée et par colonne","One person per row and per column","행과 열마다 한 명","行と列に1人ずつ"],["Même à travers les murs : la rangée traverse toute la grille.","Even through walls: a row runs across the whole grid.","벽이 있어도 마찬가지: 행은 그리드 전체로 이어져요.","壁があっても同じ：行はグリッド全体につながります。"],[1,3]],
    [["Où peut-on se tenir ?","Where can people stand?","어디에 설 수 있나요?","どこに立てる？"],["Sol, fauteuil, malle, baignoire… Jamais sur une case hachurée (bibliothèque, chaudron, bureau).","Floor, armchair, trunk, bath… Never on a hatched square (bookcase, cauldron, desk).","바닥, 의자, 트렁크, 욕조… 빗금 친 칸(책장, 가마솥, 책상)에는 안 돼요.","床、いす、トランク、浴槽…斜線のマス（本棚・大釜・机）はダメ。"],[0,1]],
    [["« À côté » = les 4 cases qui touchent","“Next to” = the 4 touching squares","‘옆’ = 맞닿은 4칸","「となり」＝接する4マス"],["En haut, en bas, à gauche, à droite. Pas en diagonale, pas derrière un mur.","Up, down, left, right. Not diagonally, not behind a wall.","위, 아래, 왼쪽, 오른쪽. 대각선이나 벽 너머는 아니에요.","上下左右。ななめや壁の向こうはダメ。"],[1,2]],
    [["Plusieurs personnes par pièce : permis","Several people in a room: fine","한 방에 여러 명: 가능","1つの部屋に何人でもOK"],["Seules les rangées et les colonnes sont limitées.","Only rows and columns are limited.","제한은 행과 열뿐이에요.","制限は行と列だけ。"],[0]],
    [["Pièce de la victime : exactement 2 personnes","Victim's room: exactly 2 people","피해자의 방: 정확히 두 사람","被害者の部屋：ちょうど2人"],["La victime et une seule autre personne : c'est le coupable.","The victim and one other person: that's the culprit.","피해자와 다른 한 사람: 그 사람이 범인이에요.","被害者ともう1人：その人が犯人。"],[0,1]]];
  function render(){const p=page(),cards=[...document.querySelectorAll("#rulesBody .r3 .r3-card")];
    p.innerHTML=`<h2 class="rp-t">📜 ${L("Les règles","The rules","규칙","ルール")}</h2>
      <ol class="rp-list">${R.map(([t,d,fx],i)=>{const figs=cards[i]?[...cards[i].querySelectorAll(".r3-ex figure")]:[];
        return `<li class="rp-c"><span class="rp-n">${i+1}</span><div class="rp-tx"><b>${TX(t)}</b><p>${TX(d)}</p></div><div class="rp-fx">${fx.map(k=>figs[k]?figs[k].outerHTML:"").join("")}</div></li>`}).join("")}</ol>
      <div class="rp-end"><b>🔎 ${L("Pour finir","To finish","마무리","さいごに")}</b> ${L("Quand tout le monde est placé, appuie sur « Valider », puis désigne le coupable.","Once everyone is placed, press “Check”, then point out the culprit.","모두 배치했다면 ‘확인’을 누르고 범인을 지목하세요.","全員を置いたら「チェック」を押して、犯人を指さそう。")}</div>
      <button class="rp-more" data-rp="more">${L("Tous les détails et la liste des objets","All the details and the list of objects","자세한 규칙과 물건 목록","くわしいルールと物の一覧")} ›</button>`;
    p.querySelectorAll(".rp-fx .r3-tag").forEach(t=>{const ok=t.classList.contains("ok");t.textContent=ok?"✓":"✕";t.title=""})}
  const _show=show;show=function(pn){const p=page();p.hidden=true;try{document.querySelector(".home-in").classList.remove("rulesmode");document.querySelector(".home").classList.remove("rulesmode")}catch(_){}
    if(pn==="pRulesP"){_show("__none__");document.querySelectorAll("#home .home-panel,#hMain").forEach(e=>{if(e!==p)e.hidden=true});const v=$("#lvView");if(v)v.hidden=true;
      render();p.hidden=false;document.querySelector(".home-in").classList.add("rulesmode");document.querySelector(".home").classList.add("rulesmode");const bar=$("#h2Bar");if(bar)bar.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.id==="hRules"));try{$("#home").scrollTop=0}catch(_){}return}
    return _show.apply(this,arguments)};
  /* the bottom bar's "Rules" opens the page (in a case, the menu still opens the rules sheet) */
  document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#hRules");if(!b||!b.closest("#h2Bar"))return;e.stopPropagation();e.preventDefault();try{play("page")}catch(_){}show("pRulesP")},true);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);const p=$("#pRulesP");if(p&&!p.hidden)render()};
  const st=document.createElement("style");st.textContent=`
#pRulesP{padding:12px 12px 8px!important}
#pRulesP[hidden]{display:none!important}
#pRulesP .rp-t{margin:0 0 8px!important;text-align:center!important;font-size:21px!important;color:#8e1f33!important}
#pRulesP .rp-list{list-style:none!important;margin:0!important;padding:0!important;display:flex!important;flex-direction:column!important;gap:6px!important}
#pRulesP .rp-c{display:flex!important;align-items:center!important;gap:8px!important;padding:7px 8px!important;border-radius:12px!important;background:rgba(255,250,236,.85)!important;border:1.5px solid #e2cfa4!important;text-align:left!important}
#pRulesP .rp-n{flex:0 0 22px!important;height:22px!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:#8e1f33!important;color:#fff!important;font:800 12px var(--f-simple,system-ui)!important}
#pRulesP .rp-tx{flex:1 1 auto!important;min-width:0!important}
#pRulesP .rp-tx b{display:block!important;font:800 13px/1.2 var(--f-simple,system-ui)!important;color:#3a1f3d!important}
#pRulesP .rp-tx p{margin:2px 0 0!important;font:500 11.5px/1.3 var(--f-simple,system-ui)!important;color:#4a3a30!important}
#pRulesP .rp-fx{flex:0 0 auto!important;display:flex!important;gap:4px!important}
@media (max-height:800px){html body #home.rulesmode .home-in.rulesmode .home-logo,html body #home.rulesmode .home-in.rulesmode .home-who,html body #home.rulesmode .h2-gear,html body #home.rulesmode #chatBtn{display:none!important}
#pRulesP .rp-t{font-size:18px!important;margin-bottom:6px!important}#pRulesP .rp-c{padding:5px 7px!important}#pRulesP .rp-list{gap:5px!important}
#pRulesP .rp-fx .r3-svg{width:36px!important;height:36px!important}#pRulesP .rp-more{min-height:36px!important;margin-top:0!important}#pRulesP{padding:8px 10px 4px!important}#pRulesP .rp-end{padding:6px 8px!important;margin-top:5px!important;font-size:12px!important}}
#pRulesP .rp-fx figure{position:relative!important}
#pRulesP .rp-fx .r3-tag{position:absolute!important;top:-5px!important;right:-5px!important;width:18px!important;height:18px!important;max-width:none!important;padding:0!important;border-radius:50%!important;display:grid!important;place-items:center!important;font:900 11px var(--f-simple,system-ui)!important;color:#fff!important;background:#b8283e!important;box-shadow:0 0 0 2px #fffaf0!important}
#pRulesP .rp-fx .r3-tag.ok{background:#3f7d3a!important}
#pRulesP .rp-fx figure{margin:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:1px!important}
#pRulesP .rp-fx .r3-svg{width:40px!important;height:40px!important}
#pRulesP .rp-fx .r3-tagX{font:700 9px var(--f-simple,system-ui)!important;padding:0 4px!important;border-radius:5px!important;white-space:nowrap!important;max-width:62px!important;overflow:hidden!important;text-overflow:ellipsis!important}
#pRulesP .rp-end{margin-top:7px!important;padding:8px 10px!important;border-radius:12px!important;background:rgba(142,31,51,.08)!important;font:500 12.5px/1.35 var(--f-simple,system-ui)!important;color:#4a3a30!important}
#pRulesP .rp-end b{color:#6b1530!important}
#pRulesP .rp-more{display:block!important;margin:4px auto 0!important;min-height:44px!important;border:0!important;background:none!important;color:#6b1530!important;font:700 13.5px var(--f-simple,system-ui)!important;text-decoration:underline!important;text-underline-offset:3px!important;cursor:pointer!important}
@media (orientation:landscape) and (max-height:520px){#pRulesP{padding:6px 10px 4px!important}#pRulesP .rp-t{display:none!important}
#pRulesP .rp-list{display:grid!important;grid-template-columns:1fr 1fr!important;gap:5px!important}#pRulesP .rp-c{padding:4px 6px!important}
#pRulesP .rp-tx b{font-size:12px!important}#pRulesP .rp-tx p{font-size:11px!important}#pRulesP .rp-fx .r3-svg{width:34px!important;height:34px!important}
#pRulesP .rp-end{margin-top:5px!important;padding:5px 8px!important;font-size:11.5px!important}#pRulesP .rp-more{min-height:32px!important;margin:0 auto!important;font-size:12.5px!important}}
`;
  document.head.appendChild(st);
})();
