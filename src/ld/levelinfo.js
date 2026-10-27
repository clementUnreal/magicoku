/* ================= level picker: a solved level opens a sheet (my result, the level's ranking, replay) ================= */
(function(){
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const prog=id=>ACC.profile&&ACC.profile.progress&&ACC.profile.progress[id];
  const place=n=>L(n===1?"1er":n+"ᵉ",n===1?"1st":n===2?"2nd":n===3?"3rd":n+"th",n+"위",n+"位");
  function isMe(r){const p=ACC.profile;if(!p||!p.pseudo)return false;return r.id===p.pid||String(r.pseudo||"").trim().toLowerCase()===String(p.pseudo).trim().toLowerCase()}
  function label(i){const t=tierOf(i),ix=DATA.map((c,j)=>j).filter(j=>tierOf(j)===t),k=ix.indexOf(i);
    return (DATA[i].expert?"★ "+L("Expert","Expert","전문가","エキスパート"):L("Niveau","Level","레벨","レベル")+" "+(k+1))+" · "+TX(META[DATA[i].id].title)}
  function rankHTML(rows){
    if(!rows)return `<p class="li-msg">${L("Classement indisponible hors ligne.","Ranking unavailable offline.","오프라인에서는 순위를 볼 수 없어요.","オフラインではランキングを表示できません。")}</p>`;
    if(!rows.length)return `<p class="li-msg">${L("Personne n'est encore classé sur cette enquête.","Nobody is ranked on this case yet.","아직 이 사건의 순위가 없어요.","この事件のランキングはまだありません。")}</p>`;
    const mi=rows.findIndex(isMe),show=rows.slice(0,5);if(mi>=5)show.push(rows[mi]);
    return (mi>=0?`<p class="li-me">${mi===0?"👑 ":""}${L(`Tu es <b>${place(mi+1)}</b> sur ${rows.length} détective${rows.length>1?"s":""}`,`You're <b>${place(mi+1)}</b> of ${rows.length} detective${rows.length>1?"s":""}`,`탐정 ${rows.length}명 중 <b>${place(mi+1)}</b>`,`探偵${rows.length}人中 <b>${place(mi+1)}</b>`)}</p>`:"")+
      `<ol class="li-rk">${show.map(r=>{const i=rows.indexOf(r);return `<li class="${isMe(r)?"me":""}"><span class="p">${["🥇","🥈","🥉"][i]||i+1}</span><img src="${POR[r.avatar]||POR[AVS[0]]}" alt=""><b>${esc(r.pseudo)}</b><span class="s">⏱ ${fmtT(r.time)} · 💡 ${r.hints}</span></li>`}).join("")}</ol>`}
  function sheet(){let m=$("#liSheet");if(m)return m;m=document.createElement("div");m.id="liSheet";m.hidden=true;document.body.appendChild(m);
    m.addEventListener("click",e=>{if(e.target===m||e.target.closest("[data-li=close]")){m.hidden=true;return}
      const b=e.target.closest("[data-li]");if(!b)return;const i=+m.dataset.i;
      if(b.dataset.li==="replay"||b.dataset.li==="view"){m.hidden=true;$("#home").hidden=true;openCase(i);if(b.dataset.li==="replay"&&typeof replayCase==="function")setTimeout(()=>replayCase(),60)}});
    return m}
  async function openSheet(i){const m=sheet(),id=DATA[i].id,pr=prog(id)||{},mo=typeof levelMoons==="function"?levelMoons(i):0;m.dataset.i=i;
    const moons=typeof moonIcon==="function"&&!DATA[i].expert?`<div class="li-moons">${[0,1,2].map(k=>moonIcon(k<mo?"on":"")).join("")}</div>`:"";
    m.innerHTML=`<div class="li-box" role="dialog" aria-modal="true"><button class="li-x" data-li="close" aria-label="${L("Fermer","Close","닫기","閉じる")}">✕</button>
      <small class="li-k">✓ ${L("Enquête résolue","Case solved","해결한 사건","解決済み")}</small><h2>${esc(label(i))}</h2>${moons}
      <div class="li-st"><div><b>${pr.time!=null?fmtT(pr.time):"—"}</b><small>⏱ ${L("temps","time","시간","時間")}</small></div><div><b>${pr.attempts||"—"}</b><small>🎯 ${L("tentatives","tries","시도","回挑戦")}</small></div><div><b>${pr.hints!=null?pr.hints:"—"}</b><small>💡 ${L("indices","hints","힌트","ヒント")}</small></div></div>
      <h3>🏆 ${L("Classement de cette enquête","This case's ranking","이 사건의 순위","この事件のランキング")}</h3><div class="li-rkw"><p class="li-msg">${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</p></div>
      <button class="li-go" data-li="replay">🔄 ${L("Rejouer","Replay","다시 하기","もう一度")}</button>
      <p class="li-note">${L("Pour le plaisir : ton score enregistré ne changera pas.","Just for fun: your recorded score won't change.","재미로 하는 거예요. 기록된 점수는 바뀌지 않아요.","楽しむためのプレイです。記録されたスコアは変わりません。")}</p>
      <button class="li-view" data-li="view">${L("Revoir ma grille résolue","See my solved grid","해결한 격자 보기","解いたグリッドを見る")}</button></div>`;
    m.hidden=false;try{play("select")}catch(_){}
    const rows=typeof levelRank==="function"?await levelRank(id):null;if(!m.hidden&&+m.dataset.i===i){const w=m.querySelector(".li-rkw");if(w)w.innerHTML=rankHTML(rows)}}
  window.openLevelSheet=openSheet;
  /* tapping a solved card, or "play" on a solved selection, opens the sheet */
  document.addEventListener("click",e=>{const v=$("#lvView");if(!v||v.hidden)return;const t=e.target.closest&&e.target.closest(".lvc[data-lv],[data-act=play]");if(!t||!v.contains(t))return;
    const i=t.dataset.lv!=null?+t.dataset.lv:LVV.sel;if(i==null||!lvlSolved(i))return;e.stopPropagation();LVV.sel=i;openSheet(i);try{renderLevelView()}catch(_){}},true);
  /* the footer button says "Replay" on a solved selection */
  function foot(){const v=$("#lvView");if(!v||v.hidden)return;const b=v.querySelector("[data-act=play]");if(!b||LVV.sel==null)return;
    if(lvlSolved(LVV.sel)){const txt="🔄 "+L("Rejouer · voir les scores","Replay · see scores","다시 하기 · 점수 보기","もう一度・スコアを見る");if(b.textContent!==txt)b.textContent=txt}}
  try{let q=0;new MutationObserver(()=>{if(q)return;q=1;requestAnimationFrame(()=>{q=0;try{foot()}catch(_){}})}).observe($("#home"),{childList:true,subtree:true})}catch(_){}
  const st=document.createElement("style");st.textContent=`#liSheet{position:fixed;inset:0;z-index:80;background:rgba(20,10,30,.55);display:flex;align-items:flex-end;justify-content:center;padding:0}
#liSheet[hidden]{display:none}
.li-box{position:relative;width:min(520px,100%);max-height:92vh;overflow:auto;background:linear-gradient(#fbf3df,#f1e3c2);border:2px solid #c9a25a;border-bottom:0;border-radius:20px 20px 0 0;padding:18px 16px calc(16px + env(safe-area-inset-bottom));text-align:center;color:#3a1f3d;box-shadow:0 -10px 30px #0006}
.li-x{position:absolute;top:8px;right:8px;width:44px;height:44px;border:0;background:none;font-size:22px;color:#3a1f3d;cursor:pointer}
.li-k{display:block;font:700 12.5px var(--f-simple,system-ui)!important;color:#3f7d3a;letter-spacing:.02em}
.li-box h2{margin:2px 44px 6px;font-size:21px;line-height:1.2;color:#8e1f33}
.li-moons{display:flex;justify-content:center;gap:6px;margin:2px 0 10px}.li-moons .moon{width:30px;height:30px;color:#d9cba8}.li-moons .moon.on{color:#f0c64a;filter:drop-shadow(0 2px 0 #9a6a10)}
.li-st{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.li-st div{background:#fffaf0;border:1.5px solid #e2cfa4;border-radius:12px;padding:8px 4px}
.li-st b{display:block;font-size:19px}.li-st small{font:600 12px var(--f-simple,system-ui)!important;color:#6b4a3a}
.li-box h3{margin:4px 0 6px;font-size:16px;color:#6b1530}
.li-msg{margin:6px 0;font:italic 500 13.5px var(--f-simple,system-ui)!important;color:#6b4a3a}
.li-me{margin:0 0 6px;font:600 14px var(--f-simple,system-ui)!important}
.li-rk{list-style:none;margin:0 0 12px;padding:0;display:flex;flex-direction:column;gap:5px;text-align:left}
.li-rk li{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:10px;background:#fffaf0;border:1px solid #ead9b3}
.li-rk li.me{background:#fbe7b2;border-color:#d4a53c}.li-rk .p{width:26px;text-align:center;font-weight:800}
.li-rk img{width:30px;height:30px;border-radius:50%;object-fit:cover;background:#ead9b3}.li-rk b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14.5px}
.li-rk .s{font:600 12.5px var(--f-simple,system-ui)!important;color:#6b4a3a;white-space:nowrap}
.li-go{display:block;width:100%;min-height:54px;border:0;border-radius:999px;background:linear-gradient(#b8304a,#8e1f33);color:#fff3d6;font-size:19px;font-weight:800;box-shadow:0 4px 0 #5e1222;cursor:pointer}
.li-note{margin:6px 0 4px;font:500 12.5px var(--f-simple,system-ui)!important;color:#6b4a3a}
.li-view{display:block;margin:2px auto 0;min-height:44px;border:0;background:none;color:#6b1530;font:700 14px var(--f-simple,system-ui)!important;text-decoration:underline;text-underline-offset:3px;cursor:pointer}`;document.head.appendChild(st);
})();
