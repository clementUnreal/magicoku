
/* ================= new home screen: story hero + 2×2 modes + bottom bar ================= */
(function(){
  const home=$("#home"),nav=$("#hMain");if(!home||!nav||$("#h2Hero"))return;
  const IMG=typeof HOME_IMG!=="undefined"?HOME_IMG:{};
  const ic={
    book:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 5.5c3.2-1.3 6.4-1.1 9.5 1 3.1-2.1 6.3-2.3 9.5-1v13c-3.2-1.3-6.4-1.1-9.5 1-3.1-2.1-6.3-2.3-9.5-1z" fill="currentColor"/><path d="M12 6.5v13" stroke="#f3e6c8" stroke-width="1.4"/></svg>`,
    home:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5M5.5 10v10h4.5v-6h4v6h4.5V10"/></svg>`,
    trophy:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5.5a4 4 0 0 1-8 0zM8 6H4.5a3.5 3.5 0 0 0 3.8 4.5M16 6h3.5a3.5 3.5 0 0 1-3.8 4.5M12 13.5V17M8.5 20.5h7M9.5 17h5v3.5h-5z"/></svg>`,
    rules:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 5.5c3.2-1.3 6.4-1.1 9.5 1 3.1-2.1 6.3-2.3 9.5-1v13c-3.2-1.3-6.4-1.1-9.5 1-3.1-2.1-6.3-2.3-9.5-1zM12 6.5v13"/></svg>`,
    user:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3.2"/><path d="M6.2 18.4c1.5-2.4 3.4-3.4 5.8-3.4s4.3 1 5.8 3.4"/></svg>`,
    gear:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" stroke-width="4" stroke-dasharray="3.1 2.4"/><circle cx="12" cy="12" r="5.2"/><circle cx="12" cy="12" r="2.2"/></svg>`};
  /* ---------- build ---------- */
  const hero=document.createElement("section");hero.className="h2-hero";hero.id="h2Hero";
  hero.innerHTML=`<div class="h2-art">${IMG.forest?`<img src="${IMG.forest}" alt="">`:""}</div>
    <div class="h2-body"><h2 class="h2-t"><span class="h2-bk">${ic.book}</span><span id="h2T"></span></h2><div class="h2-ch" id="h2Ch"></div><div class="h2-lv" id="h2Lv"></div>
    <button class="h2-go" id="h2Go"><span class="h2-gi">${ic.book}</span><span id="h2GoT"></span><span class="h2-chev">›</span></button></div>`;
  const sec=document.createElement("div");sec.className="h2-sec";sec.id="h2Sec";
  const grid=document.createElement("div");grid.className="h2-grid";
  nav.prepend(hero);hero.after(sec);sec.after(grid);
  const st=$("#hStory");if(st){st.className="h2-link";$("#h2Go").after(st)}
  const CARDS=[["hPlay","disc"],["hRush","rush"],["hNight","night"],["hLiar","liar"]];
  for(const [id,k] of CARDS){const b=$("#"+id);if(b){b.className="h2-card c-"+k;grid.appendChild(b)}}
  /* Chrono / Nuit / Menteur modes: temporarily disabled on the main menu */
  const MODES_OFF=["hRush","hNight","hLiar"];
  MODES_OFF.forEach(id=>{const b=$("#"+id);if(b)b.style.display="none"});grid.classList.add("solo");
  const nw=$("#hNews");if(nw){nw.className="h2-news";grid.after(nw)}
  const bar=document.createElement("nav");bar.className="h2-bar";bar.id="h2Bar";
  bar.innerHTML=`<button id="h2Home" class="on">${ic.home}<span></span></button>`;home.appendChild(bar);
  const BAR=[["hRank",ic.trophy],["hRules",ic.rules],["hAccount",ic.user]];
  for(const [id] of BAR){const b=$("#"+id);if(b){b.className="";bar.appendChild(b)}}
  const op=$("#hOptions");if(op){op.className="h2-gear";home.appendChild(op)}
  nav.classList.add("h2");document.querySelector(".home-in").classList.add("h2in");
  /* ---------- story progress ---------- */
  const SIDX=DATA.map((c,i)=>/^s\d+n\d+$/.test(c.id)&&!c.expert?i:-1).filter(i=>i>=0);
  function current(){if(!SIDX.length)return null;const nx=SIDX.find(i=>unlocked(i)&&!lvlSolved(i));
    if(nx!=null)return {i:nx,done:false,fresh:!SIDX.some(lvlSolved)};return {i:SIDX[SIDX.length-1],done:SIDX.every(lvlSolved)}}
  function go(i){lastSel=i;try{LVMODE="story"}catch(_){}try{play("select")}catch(_){}home.hidden=true;openCase(i);
    let seen=null;try{seen=localStorage.getItem("magicoku:tuto")}catch(_){}if(!seen)setTimeout(()=>tuto(0),400)}
  /* ---------- paint ---------- */
  const SUB={disc:["À ton rythme","At your own pace","나만의 속도로","自分のペースで"],rush:["Contre la montre","Against the clock","시간과의 승부","時間との勝負"],
    night:["Enquêtes nocturnes","Cases by night","한밤의 사건","夜の事件"],liar:["Démêle le vrai du faux","Sort truth from lies","진실과 거짓을 가려내요","真実と嘘を見抜こう"]};
  const NAME={disc:["Mode<br>découverte","Discovery<br>mode","디스커버리<br>모드","ディスカバリー<br>モード"],rush:["Défi chrono","Time trial","타임 챌린지","タイムチャレンジ"],
    night:["Mode nuit","Night mode","나이트 모드","ナイトモード"],liar:["Le Menteur","The Liar","거짓말쟁이","嘘つき"]};
  const T=a=>L(a[0],a[1],a[2],a[3]);
  function paint(){
    const p=ACC.profile,esc=s=>String(s).replace(/[<>&"]/g,"");
    const w=$("#hWho");if(w)w.innerHTML=(p&&p.pseudo?`<img src="${POR[p.avatar]||POR[AVS[0]]}" alt=""><span><b>${L("Bonjour","Hello","안녕하세요","こんにちは")}, ${esc(p.pseudo)} !</b>`
        :`<span><b>${L("Bienvenue, jeune détective !","Welcome, young detective!","어서 오세요, 꼬마 탐정님!","ようこそ、見習い探偵さん！")}</b>`)+`<small>${L("Une nouvelle énigme t'attend.","A new mystery awaits you.","새로운 수수께끼가 기다리고 있어요.","新しい謎が待っています。")}</small></span>`;
    $("#h2T").textContent=L("Mode histoire","Story mode","스토리 모드","ストーリーモード");
    const cur=current(),locked=typeof storyLocked==="function"&&storyLocked();
    if(cur){const t=tierOf(cur.i),k=DATA.filter((c,j)=>j<cur.i&&tierOf(j)===t).length+1,full=TX(CHAPTERS[t]),parts=full.split(/\s*[·・]\s*/);
      $("#h2Ch").textContent=parts.length>1?parts.slice(1).join(" · "):full;
      $("#h2Lv").innerHTML=`<i></i><span>${TX(CH_SHORT[t])} · ${L("Niveau","Level","레벨","レベル")} ${k} / 10</span><i></i>`;
      $("#h2GoT").textContent=locked?L("Bientôt","Soon","곧 공개","近日公開"):cur.done?L("Rejouer","Replay","다시 하기","もう一度"):cur.fresh?L("Commencer","Start","시작하기","はじめる"):L("Continuer","Continue","계속하기","つづける");
      if(cur.done)$("#h2Lv").innerHTML=`<i></i><span>✨ ${L("Toutes les enquêtes sont résolues !","Every case is solved!","모든 사건을 해결했어요!","すべての事件を解決！")}</span><i></i>`}
    hero.classList.toggle("lockm",!!locked);
    const s=$("#hStory");if(s)s.innerHTML=`${L("Choisir un niveau","Choose a level","레벨 선택","レベルを選ぶ")} <b>›</b>`;
    sec.innerHTML=`<i></i><span>${L("Une autre façon de jouer","Other ways to play","다른 방식으로 플레이하기","ほかの遊び方")}</span><i></i>`;
    for(const [id,k] of CARDS){const b=$("#"+id);if(!b)continue;const lk=b.classList.contains("lockm"),u=typeof UNLOCK!=="undefined"&&UNLOCK[id];
      if(MODES_OFF.includes(id)){b.style.display="none";continue}
      b.innerHTML=`${IMG[k]?`<img src="${IMG[k]}" alt="">`:""}<span class="h2-ct"><b>${T(NAME[k])}</b>${lk&&u?`<small class="lk">🔒 ${L(`Niveau ${u.lvl} de Découverte`,`Discovery level ${u.lvl}`,`디스커버리 ${u.lvl}레벨 필요`,`ディスカバリーLv.${u.lvl}で解放`)}</small>`:`<small>${T(SUB[k])}</small>`}</span><span class="h2-chev">›</span>`}
    const lb=[["h2Home",["Accueil","Home","홈","ホーム"]],["hRank",["Classement","Leaderboard","랭킹","ランキング"]],["hRules",["Règles","Rules","규칙","ルール"]],["hAccount",["Profil","Profile","프로필","プロフィール"]]];
    lb.forEach(([id,a],n)=>{const b=$("#"+id);if(!b)return;b.innerHTML=(n?BAR[n-1][1]:ic.home)+`<span>${T(a)}</span>`});
    if(op){op.innerHTML=ic.gear;op.setAttribute("aria-label",L("Options","Options","설정","設定"))}
  }
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{paint()}catch(e){}};
  const _nb=renderNewsBadges;renderNewsBadges=function(){_nb.apply(this,arguments);const b=$("#hNews");if(!b)return;const u=newsUnseen();
    b.innerHTML=`<span class="h2-bell">🔔</span><span class="h2-nt">${L("Nouveautés","What's new","새로운 소식","お知らせ")}</span>${u?`<span class="nbadge">${u}</span>`:""}<span class="h2-chev">›</span>`};
  /* active tab + hide the bar on the full-screen level view */
  const _show=show;show=function(panel){_show.apply(this,arguments);const map={hMain:"h2Home",pRank:"hRank",pAccount:"hAccount"};
    bar.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.id===map[panel]));home.classList.toggle("h2lv",panel==="pLevels")};
  document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#h2Go,#h2Home");if(!t)return;
    if(t.id==="h2Home"){show("hMain");try{play("page")}catch(_){}return}
    if(typeof storyLocked==="function"&&storyLocked()){$("#hStory")&&$("#hStory").click();return}
    const c=current();if(c)go(c.i)});
  try{renderHome();renderNewsBadges()}catch(e){}
})();
