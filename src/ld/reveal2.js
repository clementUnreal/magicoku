
/* ================= "Case closed" popup v2 ================= */
(function(){
  const special=()=>(typeof RUSH!=="undefined"&&RUSH.on)||(typeof NIGHT!=="undefined"&&NIGHT.on)||(typeof LIAR!=="undefined"&&LIAR.on);
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const hintsW=n=>L(n>1?"indices":"indice",n>1?"hints":"hint","힌트","ヒント");
  const triesW=n=>L(n>1?"tentatives":"tentative",n>1?"tries":"try","시도","回挑戦");
  const place=n=>L(n===1?"1re":n+"ᵉ",n===1?"1st":n===2?"2nd":n===3?"3rd":n+"th",n+"위",n+"位");
  function isMe(r){const p=ACC.profile;if(!p||!p.pseudo)return false;return r.id===p.pid||String(r.pseudo||"").trim().toLowerCase()===String(p.pseudo).trim().toLowerCase()}
  function rankBlock(rows){
    if(!rows)return `<p class="rv-msg">${L("Classement indisponible hors ligne.","Ranking unavailable offline.","오프라인에서는 순위를 볼 수 없어요.","オフラインではランキングを表示できません。")}</p>`;
    if(!rows.length)return `<p class="rv-msg">🥇 ${L("Tu es le premier détective à résoudre cette enquête !","You're the first detective to solve this case!","이 사건을 처음으로 해결한 탐정이에요!","この事件を最初に解いた探偵です！")}</p>`;
    const mi=rows.findIndex(isMe),show=rows.slice(0,3);if(mi>=3)show.push(rows[mi]);
    const head=mi>=0?`<div class="rv-rk-me">${mi===0?"👑 ":""}${L(`Tu es <b>${place(mi+1)}</b> sur ${rows.length} détective${rows.length>1?"s":""}`,`You're <b>${place(mi+1)}</b> of ${rows.length} detective${rows.length>1?"s":""}`,`탐정 ${rows.length}명 중 <b>${place(mi+1)}</b>`,`探偵${rows.length}人中<b>${place(mi+1)}</b>`)}</div>`:"";
    return head+`<ol class="rv-rk">${show.map(r=>{const i=rows.indexOf(r);return `<li class="${isMe(r)?"me":""}"><span class="p">${["🥇","🥈","🥉"][i]||i+1}</span><img src="${POR[r.avatar]||POR[AVS[0]]}" alt=""><b>${esc(r.pseudo)}</b><span class="s">⏱ ${fmtT(r.time)}<i>💡 ${r.hints}</i></span></li>`}).join("")}</ol>`}
  const _sr=showReveal;showReveal=function(){
    const t=S.time||0,a=Math.max(1,S.attempts||1),h=S.hints||0;_sr.apply(this,arguments);
    if(special())return;const ov=$("#reveal"),old=ov&&ov.querySelector(".box");if(!old)return;
    const K=C.killer,story=old.querySelector("p");if(story)story.querySelectorAll("small,br").forEach(e=>e.remove());
    const stars=[true,h===0,a===1],ns=stars.filter(Boolean).length;
    const tr=tierOf(ci),idx=DATA.map((c,i)=>i).filter(i=>tierOf(i)===tr),k=idx.indexOf(ci)+1,done=idx.filter(lvlSolved).length;
    const badges=[h===0?`<span class="rv-bdg">✨ ${L("Sans indice","No hints","힌트 없이","ヒントなし")}</span>`:"",a===1?`<span class="rv-bdg">🎯 ${L("Du premier coup","First try","한 번에","一発で")}</span>`:""].join("");
    const hasNext=ci<DATA.length-1;
    old.className="box rv2";
    old.innerHTML=`<div class="rv-rays"></div><div class="rv-rib"><span>${L("Affaire résolue !","Case closed!","사건 해결!","事件解決！")}</span></div>
      <div class="rv-por"><div class="rv-av">${ava(K,{angry:true})}</div><div class="rv-stamp">${L("Coupable","Guilty","범인","犯人")}</div></div>
      <h2 id="rv">${L(`C'est ${pname(K)} !`,`It's ${pname(K)}!`,`범인은 ${pname(K)}!`,`犯人は${pname(K)}だ！`)}</h2>
      <div class="rv-stars" aria-label="${ns}/3">${stars.map((s,i)=>`<span class="${s?"on":""}" style="animation-delay:${.25+i*.18}s">★</span>`).join("")}</div>
      <div class="rv-file"><span class="rv-fi">📜</span><p>${story?story.innerHTML:""}</p></div>
      <div class="rv-stats"><div><b>${fmtT(t)}</b><small>⏱ ${L("temps","time","시간","時間")}</small></div><div><b>${a}</b><small>🎯 ${triesW(a)}</small></div><div><b>${h}</b><small>💡 ${hintsW(h)}</small></div></div>
      ${badges?`<div class="rv-bdgs">${badges}</div>`:""}
      <div class="rv-prog"><div class="rv-pt"><span>${esc(TX(CH_SHORT[tr]))} · ${L("Niveau","Level","레벨","レベル")} ${k}/10</span><b>${done}/${idx.length} ${L("résolues","solved","해결","解決")}</b></div><div class="rv-bar"><i style="width:${Math.round(100*done/idx.length)}%"></i></div></div>
      <div class="rv-rank"><h4>🏆 ${L("Classement de cette enquête","This case's ranking","이 사건의 순위","この事件のランキング")}</h4><div id="rvRk">${ACC.profile&&ACC.profile.pseudo?`<p class="rv-msg">${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</p>`:`<p class="rv-msg">${L("Crée ton compte pour te comparer aux autres détectives !","Create an account to compare with other detectives!","계정을 만들면 다른 탐정과 비교할 수 있어요!","アカウントを作ってほかの探偵と比べよう！")}</p>`}</div></div>
      <div class="acts"><button class="pill" id="rvClose">${L("Admirer ma grille","Admire my grid","내 격자 감상하기","自分のグリッドを眺める")}</button>${hasNext?`<button class="pill red" id="rvNext">${L("Enquête suivante","Next case","다음 사건","次の事件")} ›</button>`:""}</div>`;
    $("#rvClose").onclick=()=>ov.hidden=true;
    const nx=$("#rvNext");if(nx)nx.onclick=()=>{ov.hidden=true;openCase(ci+1)};
    try{$("#rvClose").focus({preventScroll:true})}catch(_){}
    old.scrollTop=0;
    if(ACC.profile&&ACC.profile.pseudo){const id=C.id;setTimeout(async()=>{const rows=await levelRank(id);const el=$("#rvRk");if(el&&C.id===id)el.innerHTML=rankBlock(rows)},900)}
  };
})();
