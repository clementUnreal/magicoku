
/* ================= game screen v3 (phones): compact top bar, board first, tools, suspect strip, testimony panel =================
   Loop without big scrolling: read a testimony -> pick a suspect -> act on the board -> next testimony. Desktop is untouched. */
(function(){
  const mq=matchMedia("(max-width:760px)");
  const on=()=>mq.matches&&$("#home").hidden;
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const I={menu:'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',pause:'<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>',
    cross:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',erase:'<svg viewBox="0 0 24 24"><path d="M4 16l8-8 6 6-6 6H8z"/><path d="M8 20h12"/></svg>',
    undo:'<svg viewBox="0 0 24 24"><path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12h-2" transform="translate(0 -6)"/></svg>',
    zoomIn:'<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5"/></svg>',zoomOut:'<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M8 10.5h5"/></svg>',
    expand:'<svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5"/></svg>',collapse:'<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"/></svg>'};
  /* ---------- styles ---------- */
  const css=document.createElement("style");css.textContent=`
body.g3 .wrap>header,body.g3 #story,body.g3 .views,body.g3 .mbar.mb-train{display:none!important}
body.g3 .wrap{padding-top:0!important}
#g3Bar{display:none}
body.g3 #g3Bar{position:sticky;top:0;z-index:40;display:flex;align-items:center;gap:8px;margin:0 -12px 8px;padding:max(6px,env(safe-area-inset-top,0px)) 12px 6px;background:linear-gradient(#21163a,#1a1230);border-bottom:1.5px solid rgba(214,171,79,.45);box-shadow:0 6px 14px rgba(0,0,0,.35)}
#g3Bar button{flex:0 0 44px;width:44px;height:44px;border-radius:12px;border:1.5px solid rgba(214,171,79,.7);background:rgba(255,255,255,.05);color:var(--gold);display:grid;place-items:center;cursor:pointer;padding:0}
#g3Bar svg,.g3-ic svg,#g3Zoom svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
#g3Bar .g3-t{flex:1;min-width:0;font:800 15px/1.15 var(--f-magi)!important;color:#fbefc8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#g3Bar .g3-t small{display:block;font:600 12.5px var(--f-simple,system-ui)!important;color:#cfc3e6;overflow:hidden;text-overflow:ellipsis}
#g3Clock{flex:0 0 auto;min-height:36px;padding:0 10px;border-radius:999px;display:flex;align-items:center;gap:6px;background:#fbefc8;color:#3a1f3d;font:800 15px var(--f-simple,system-ui)!important;font-variant-numeric:tabular-nums;white-space:nowrap}
#g3Clock.warn{background:#c0392b;color:#fff}
#g3Clock.train small{font:700 12px var(--f-simple,system-ui)!important;opacity:.8}
/* board right under the bar, zoom & pan for big boards */
body.g3 .game{display:flex!important;flex-direction:column;gap:8px!important}
body.g3 .center{order:1}body.g3 .tools{order:2}body.g3 .suspects{order:3}
body.g3 .game>*{min-width:0;max-width:100%;width:100%;box-sizing:border-box;align-self:stretch}
body.g3 .cards,body.g3 .recit{min-width:0;max-width:100%;box-sizing:border-box}
body.g3 .g3-pan{position:relative;overflow:auto;-webkit-overflow-scrolling:touch;border-radius:14px;touch-action:pan-x pan-y}
body.g3.g3-zoom .g3-pan #board{width:165%!important;max-width:none!important}
#g3Zoom{position:absolute;z-index:6;right:8px;bottom:8px;width:44px;height:44px;border-radius:12px;border:1.5px solid var(--gold-deep,#9a7426);background:rgba(251,239,200,.92);color:#3a1f3d;display:none;place-items:center}
body.g3 #g3Zoom.can{display:grid}
body.g3.g3-zoom #g3Zoom{position:sticky;float:right;margin:-52px 8px 8px 0}
/* tools: icon + short label, never overflowing */
body.g3 .tools{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px!important}
body.g3 .tools .tb{min-height:56px!important;padding:5px 2px!important;gap:2px!important;text-transform:none!important;letter-spacing:0!important}
body.g3 .tools .tb .g3-lb{display:block;font:700 12px/1.1 var(--f-simple,system-ui)!important;white-space:nowrap}
body.g3 .tools .tb .g3-sub{display:block;font:600 10.5px/1.1 var(--f-simple,system-ui)!important;opacity:.8;white-space:nowrap}
body.g3 .tools .tb svg{width:22px;height:22px}
body.g3 .tools .tb>span:not(.g3-lb):not(.g3-sub):not(.fill):not(.g3-ic){display:none!important}
body.g3 #tValid.g3-off{opacity:.6;filter:grayscale(.4)}
/* suspect strip */
body.g3 .suspects h2{display:none!important}
body.g3 .chips{display:flex!important;gap:4px!important;overflow-x:auto;padding:4px 2px 6px;margin:0!important;scrollbar-width:none}
body.g3 .chips::-webkit-scrollbar{display:none}
body.g3 .chip2{flex:0 0 54px;min-height:64px}
body.g3 .chip2 .cph{width:46px!important;height:46px!important}
body.g3 .chip2 .cnm{font:700 11px var(--f-simple,system-ui)!important;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
body.g3 .chip2[aria-pressed="true"] .cph{box-shadow:0 0 0 3px #ffd77a,0 0 0 6px rgba(255,215,122,.35)!important;transform:translateY(-2px)}
body.g3 .chip2[aria-pressed="true"] .cnm{color:#ffd77a}
body.g3 .chip2.victim .cph{box-shadow:0 0 0 2.5px #c0392b!important}
body.g3 .chip2.victim .cvt{font:800 10px var(--f-simple,system-ui)!important;color:#ff9aa6}
/* testimony panel */
body.g3 .recit{max-height:var(--g3ph,40vh);overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;position:relative;scroll-behavior:smooth}
#g3PanelHead{display:none}
body.g3 #g3PanelHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:2px 0 4px}
#g3PanelHead b{font:800 14px var(--f-simple,system-ui)!important;letter-spacing:.06em;text-transform:uppercase;color:var(--gold-soft,#f3d98c)}
#g3PanelHead button{min-height:40px;min-width:44px;padding:0 12px;border-radius:999px;border:1.5px solid rgba(214,171,79,.7);background:rgba(255,255,255,.05);color:var(--gold);display:flex;align-items:center;gap:4px;font:700 13px var(--f-simple,system-ui)!important}
#g3PanelHead svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
body.g3.g3-full .suspects{position:fixed;inset:auto 0 0 0;z-index:60;max-height:88vh;background:#1a1230;padding:10px 12px max(12px,env(safe-area-inset-bottom,0px));border-radius:18px 18px 0 0;box-shadow:0 -12px 40px rgba(0,0,0,.6)}
body.g3.g3-full .recit{max-height:calc(88vh - 150px)}
/* menu / pause / intro sheets */
.g3-sheet .mbox{max-width:420px;text-align:left}
.g3-sheet h2{margin:0 0 10px;font-size:22px}
.g3-list{display:flex;flex-direction:column;gap:8px}
.g3-list>button,.g3-row{display:flex;align-items:center;gap:10px;width:100%;min-height:48px;padding:0 14px;border-radius:12px;border:1.5px solid #d8c08a;background:#fffaf0;color:#3a1f3d;font:700 15px var(--f-simple,system-ui)!important;text-align:left;cursor:pointer}
.g3-row{cursor:default;justify-content:space-between}
.g3-row .g3-lang{display:flex;gap:4px}
.g3-row .g3-lang button{min-width:40px;min-height:40px;border-radius:10px;border:1.5px solid #d8c08a;background:#fff;font:800 14px var(--f-simple,system-ui)!important}
.g3-row .g3-lang button.on{background:#3a1f3d;color:#fbefc8;border-color:#3a1f3d}
.g3-mstat{margin:-2px 0 10px;font:700 14px var(--f-simple,system-ui)!important;color:#6b5a48}
.g3-msec{margin:14px 0 6px;font:800 12px var(--f-simple,system-ui)!important;letter-spacing:.08em;text-transform:uppercase;color:#8a6d4a}
.g3-quick{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px}
.g3-quick button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:58px;border-radius:12px;border:1.5px solid #d8c08a;background:#fffaf0;color:#3a1f3d;font:700 12px var(--f-simple,system-ui)!important;cursor:pointer}
.g3-quick button span{font-size:20px;line-height:1}
.g3-mlang{display:flex;gap:6px;justify-content:center;margin:8px 0 2px}
.g3-mlang button{flex:1;max-width:64px;min-height:40px;border-radius:10px;border:1.5px solid #d8c08a;background:#fff;color:#3a1f3d;font:800 14px var(--f-simple,system-ui)!important}
.g3-mlang button.on{background:#3a1f3d;color:#fbefc8;border-color:#3a1f3d}
.g3-mhome{display:flex;width:100%;justify-content:center;margin-top:12px;min-height:48px}
.g3-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:4px 0 10px}
.g3-stats div{background:#fffaf0;border:1.5px solid #e2cfa4;border-radius:12px;padding:8px;text-align:center}
.g3-stats b{display:block;font:800 18px var(--f-simple,system-ui)!important;color:#3a1f3d}
.g3-stats small{font:600 12px var(--f-simple,system-ui)!important;color:#6b5a48}
.g3-story{font-size:17px;line-height:1.5;color:#3a1f3d;margin:0 0 14px}
.g3-go{width:100%;min-height:52px}`;
  document.head.appendChild(css);
  /* ---------- structure ---------- */
  function build(){const wrap=document.querySelector(".wrap");if(!wrap||$("#g3Bar"))return;
    const bar=document.createElement("div");bar.id="g3Bar";
    bar.innerHTML=`<button id="g3Menu" aria-label="Menu">${I.menu}</button><span class="g3-t" id="g3T"></span><span id="g3Clock"></span><button id="g3Pause">${I.pause}</button>`;
    wrap.prepend(bar);
    const b=$("#board");if(b&&!b.parentNode.classList.contains("g3-pan")){const pan=document.createElement("div");pan.className="g3-pan";b.parentNode.insertBefore(pan,b);pan.appendChild(b);
      const z=document.createElement("button");z.id="g3Zoom";pan.appendChild(z);z.onclick=()=>{document.body.classList.toggle("g3-zoom");paintZoom();try{play("select")}catch(_){}}}
    const sus=document.querySelector(".suspects"),cards=$("#cards");if(sus&&cards&&!$("#g3PanelHead")){const h=document.createElement("div");h.id="g3PanelHead";h.innerHTML=`<b></b><button id="g3Exp"></button>`;cards.before(h);$("#g3Exp").onclick=()=>{document.body.classList.toggle("g3-full");paintHead();sizePanel()}}
    $("#g3Menu").onclick=openMenu;$("#g3Pause").onclick=openPause;
    /* "Valider" while people are missing: say why */
    $("#tValid").addEventListener("click",e=>{if(!on()||!S||S.solved)return;const n=Object.keys(S.place||{}).length,P=M.people.length;
      if(n<P){e.stopImmediatePropagation();e.preventDefault();toast(L(`Place tous les personnages pour valider (${n}/${P}).`,`Place every character to check (${n}/${P}).`,`확인하려면 모든 인물을 배치하세요 (${n}/${P}).`,`チェックするには全員を置こう（${n}/${P}）。`))}},true)}
  function paintZoom(){const z=$("#g3Zoom");if(!z)return;const big=typeof N!=="undefined"&&N>=7;z.classList.toggle("can",big);if(!big)document.body.classList.remove("g3-zoom");
    const zi=document.body.classList.contains("g3-zoom");z.innerHTML=zi?I.zoomOut:I.zoomIn;z.setAttribute("aria-label",zi?L("Dézoomer","Zoom out","축소","縮小"):L("Zoomer sur le plateau","Zoom in","확대","拡大"))}
  function paintHead(){const h=$("#g3PanelHead");if(!h)return;const full=document.body.classList.contains("g3-full");
    h.querySelector("b").textContent=L("Témoignages","Testimonies","증언","証言");
    $("#g3Exp").innerHTML=(full?I.collapse:I.expand)+`<span>${full?L("Réduire","Collapse","접기","閉じる"):L("Agrandir","Expand","펼치기","広げる")}</span>`}
  function title(){if(!C)return "";let k=1;try{const t=tierOf(ci);k=DATA.filter((c,j)=>j<ci&&tierOf(j)===t).length+1;const ch=TX(CH_SHORT[t]).replace(/^Chapitre /,"Chap. ").replace(/^Chapter /,"Ch. ");
      if(typeof DAILY!=="undefined"&&DAILY.on)return L("Énigme du jour","Daily puzzle","오늘의 수수께끼","今日の謎");
      if(typeof COOP!=="undefined"&&COOP.play)return L("Multijoueur","Multiplayer","멀티플레이","マルチプレイ");
      return `${ch} · ${C.expert?"★":L(`Niv. ${k}`,`Lv. ${k}`,`레벨 ${k}`,`Lv.${k}`)}<small>${esc(TX(M.title))}</small>`}catch(_){return esc(TX(M.title))}}
  function clock(){const el=$("#g3Clock");if(!el||!S)return;
    if(typeof mechOf==="function"&&mechOf()==="train"&&!S.solved&&typeof trainLeftSec==="function"){const l=Math.max(0,trainLeftSec());el.className="train"+(l<=60?" warn":"");el.innerHTML=`<small>${L("Départ","Leaves","출발","発車")}</small> ${fmtT(l)}`}
    else{el.className="";el.textContent="⏱ "+fmtT(S.time||0)}}
  /* tools: icon + label (+ cost / progress) */
  function tools(){const X=$("#tX"),E=$("#tErase"),U=$("#tUndo"),H=$("#tHint"),V=$("#tValid");if(!X)return;
    const lab=(b,t,sub)=>{let l=b.querySelector(".g3-lb");if(!l){l=document.createElement("span");l.className="g3-lb";b.appendChild(l)}l.textContent=t;let s=b.querySelector(".g3-sub");if(sub){if(!s){s=document.createElement("span");s.className="g3-sub";b.appendChild(s)}s.textContent=sub}else if(s)s.remove()};
    lab(X,L("Barrer","Cross out","✕ 표시","✕をつける"));lab(E,L("Effacer","Erase","지우기","消す"));
    if(!U.querySelector(".g3-ic")){U.insertAdjacentHTML("afterbegin",`<span class="g3-ic">${I.undo}</span>`)}lab(U,L("Annuler","Undo","되돌리기","戻す"));
    const daily=typeof DAILY!=="undefined"&&DAILY.on,train=typeof mechOf==="function"&&mechOf()==="train";
    if(!H.querySelector(".g3-ic"))H.insertAdjacentHTML("afterbegin",`<span class="g3-ic" style="font-size:20px;line-height:1">💡</span>`);
    lab(H,L("Indice","Hint","힌트","ヒント"),train?"−30 s":daily?"+1 min":"");
    const n=S?Object.keys(S.place||{}).length:0,P=M?M.people.length:0;lab(V,L("Valider","Check","확인","チェック"),n<P?`${n}/${P}`:"");V.classList.toggle("g3-off",n<P);if(n<P&&!S.solved){V.disabled=false;V.setAttribute("aria-disabled","true")}else V.removeAttribute("aria-disabled")}
  /* panel height: board + tools + strip + panel fit in one screen when possible */
  function sizePanel(){if(!on())return;const bar=$("#g3Bar"),pan=document.querySelector(".g3-pan"),tl=document.querySelector(".tools"),ch=document.querySelector(".chips"),hd=$("#g3PanelHead");if(!pan||!tl||!ch)return;
    const used=(bar?bar.offsetHeight:52)+pan.offsetHeight+tl.offsetHeight+ch.offsetHeight+(hd?hd.offsetHeight:40)+44;
    const h=Math.max(170,window.innerHeight-used);document.documentElement.style.setProperty("--g3ph",h+"px")}
  /* follow the selected suspect in the panel */
  let fSel=null,fT=0;
  function fTarget(r,p){return Math.max(0,Math.min(r.scrollHeight-r.clientHeight,p.getBoundingClientRect().top-r.getBoundingClientRect().top+r.scrollTop-8))}
  function follow(){if(!on()||!S||S.sel==null){fSel=null;return}if(S.sel===fSel)return;fSel=S.sel;const sel=S.sel;clearTimeout(fT);
    const go=smooth=>{const r=document.querySelector(".recit"),p=r&&r.querySelector(`p[data-p="${sel}"]`);if(!r||!p||S.sel!==sel)return;const t=fTarget(r,p);
      if(smooth)r.scrollTo({top:t,behavior:"smooth"});else if(Math.abs(r.scrollTop-t)>4){r.style.scrollBehavior="auto";r.scrollTop=t;r.style.scrollBehavior=""}};
    requestAnimationFrame(()=>go(true));fT=setTimeout(()=>go(false),450)}
  /* ---------- sheets ---------- */
  function sheet(id,html){let m=$("#"+id);if(!m){m=document.createElement("div");m.id=id;m.className="modal g3-sheet";document.body.appendChild(m);m.addEventListener("click",e=>{if(e.target===m)close(m)})}
    m.innerHTML=`<div class="mbox"><button class="mclose" aria-label="✕">✕</button>${html}</div>`;m.querySelector(".mclose").onclick=()=>close(m);m.hidden=false;return m}
  const close=m=>{m.hidden=true;try{renderTimer()}catch(_){}};
  function stats(){return `<div class="g3-stats"><div><b>${fmtT(S.time||0)}</b><small>⏱ ${L("temps","time","시간","時間")}</small></div><div><b>${S.attempts||0}</b><small>🎯 ${L("tentatives","tries","시도","挑戦")}</small></div><div><b>${S.hints||0}</b><small>💡 ${L("indices","hints","힌트","ヒント")}</small></div></div>`}
  function openMenu(){const sk=typeof SK!=="undefined"&&SK.on;
    const full=$("#bFull")&&!$("#bFull").hidden,night=typeof themeNow==="function"&&themeNow()==="night";
    const m=sheet("g3MenuS",`<h2>${L("Menu","Menu","메뉴","メニュー")}</h2>
      <p class="g3-mstat">⏱ ${fmtT(S.time||0)} · 🎯 ${S.attempts||0} · 💡 ${S.hints||0}</p>
      <div class="g3-list">
      <button data-g="rules">📜 ${L("Règles","Rules","규칙","ルール")}</button>
</div>
      <p class="g3-msec">${L("Réglages","Settings","설정","設定")}</p>
      <div class="g3-quick">
        <button data-g="sound"><span>${SND.on?"🔊":"🔇"}</span>${L("Son","Sound","소리","音")}</button>
        <button data-g="theme"><span>${night?"🌙":"☀️"}</span>${night?L("Nuit","Night","나이트","ナイト"):L("Clair","Light","라이트","ライト")}</button>
        ${full?`<button data-g="full"><span>⛶</span>${L("Plein écran","Full screen","전체 화면","全画面")}</button>`:""}
        <button data-g="tuto"><span>❓</span>${L("Tutoriel","Tutorial","튜토리얼","チュートリアル")}</button>
      </div>
      <div class="g3-lang g3-mlang">${["fr","en","ko","ja"].map(l=>`<button data-lang="${l}" class="${LANG===l?"on":""}">${{fr:"FR",en:"EN",ko:"한",ja:"日"}[l]}</button>`).join("")}</div>
      <button data-g="home" class="pill g3-mhome">🏠 ${L("Retour à l'accueil","Back to home","홈으로","ホームへ")}</button>`);
    m.onclick=e=>{const t=e.target.closest("button");if(e.target===m){close(m);return}if(!t)return;const g=t.dataset.g,lg=t.dataset.lang;
      if(lg){$("#l"+lg.toUpperCase()).click();setTimeout(()=>{openMenu();refresh()},60);return}
      if(!g)return;if(g==="sound"||g==="theme"){if(g==="sound")setSound(!SND.on);else setTheme(themeNow()==="night"?"light":"night");openMenu();return}close(m);
      if(g==="story")intro(true);else if(g==="sketch"){(sk?$("#vPlan"):$("#vSketch")).click()}else if(g==="rules")$("#bRules").click();else if(g==="tuto")$("#bTuto").click();
      else if(g==="clear"){clearAll()}
      else if(g==="sound"){setSound(!SND.on)}else if(g==="full")$("#bFull").click();else if(g==="home")$("#bMenu").click()}}
  function openPause(){const m=sheet("g3PauseS",`<h2>⏸ ${L("Pause","Paused","일시 정지","一時停止")}</h2>${stats()}<p class="g3-story" style="font-size:15px">${L("Le chronomètre est arrêté.","The clock is stopped.","시계가 멈췄어요.","タイマーは止まっています。")}</p><div class="g3-list"><button data-g="go" class="pill red g3-go" style="justify-content:center">▶ ${L("Reprendre","Resume","계속하기","再開")}</button><button data-g="story">📖 ${L("Relire l'histoire","Read the story again","이야기 다시 읽기","物語を読み直す")}</button></div>`);
    m.querySelector(".mbox").addEventListener("click",e=>{const t=e.target.closest("button[data-g]");if(!t)return;close(m);if(t.dataset.g==="story")intro(true)})}
  function intro(again){if(!C)return;const m=sheet("g3IntroS",`<h2>${esc(TX(M.title))}</h2><p class="g3-story">${typeof renTxt==="function"?renTxt(TX(M.story)):TX(M.story)}</p>
      <button class="pill red g3-go" id="g3Go">${again?L("Reprendre l'enquête","Back to the case","수사 계속하기","捜査に戻る"):L("Commencer l'enquête","Start the case","수사 시작","捜査開始")} ›</button>`);
    $("#g3Go").onclick=()=>close(m)}
  /* clear the whole board (same as a long press on the eraser), with confirmation; "Annuler" brings it back */
  function clearAll(){if(!S||S.solved)return;const empty=!Object.keys(S.place||{}).length&&!Object.keys(S.xs||{}).length&&!Object.keys(S.notes||{}).length;
    if(empty){toast(L("Le plateau est déjà vide.","The board is already empty.","판이 이미 비어 있어요.","盤はもう空です。"));return}
    const m=sheet("g3ClearS",`<h2>🧹 ${L("Tout effacer ?","Clear everything?","모두 지울까요?","すべて消す？")}</h2><p class="g3-story" style="font-size:15px">${L("Les personnages, les croix et les notes seront retirés du plateau. Tu pourras revenir en arrière avec « Annuler ».","Characters, crosses and notes will be removed from the board. You can bring them back with “Undo”.","인물, ✕ 표시, 메모가 판에서 사라져요. ‘되돌리기’로 되살릴 수 있어요.","人物・✕・メモが盤から消えます。「戻す」で元に戻せます。")}</p>
      <div class="g3-list"><button data-g="yes" class="pill red g3-go" style="justify-content:center">${L("Tout effacer","Clear everything","모두 지우기","すべて消す")}</button><button data-g="no" style="justify-content:center">${L("Garder mon plateau","Keep my board","그대로 두기","そのままにする")}</button></div>`);
    m.querySelector(".mbox").addEventListener("click",e=>{const t=e.target.closest("button[data-g]");if(!t)return;close(m);if(t.dataset.g!=="yes")return;
      snap();S.place={};S.notes={};S.xs={};S.auto={};save();render();toast(L("Plateau effacé. « Annuler » pour revenir.","Board cleared. “Undo” to bring it back.","판을 지웠어요. ‘되돌리기’로 복구할 수 있어요.","盤を消しました。「戻す」で元に戻せます。"))})}
  /* first time the eraser is picked on a phone: explain the long press */
  document.addEventListener("click",e=>{if(!on()||!e.target.closest||!e.target.closest("#tErase"))return;let seen=null;try{seen=localStorage.getItem("magicoku:eraseTip")}catch(_){}if(seen)return;
    try{localStorage.setItem("magicoku:eraseTip","1")}catch(_){}setTimeout(()=>toast(L("Astuce : garde le doigt appuyé sur la gomme pour tout effacer d'un coup (ou ☰ › Tout effacer).","Tip: keep your finger on the eraser to clear everything at once (or ☰ › Clear the whole board).","팁: 지우개를 길게 누르면 한 번에 모두 지워져요(또는 ☰ › 판 전체 지우기).","ヒント：消しゴムを長押しすると全部消せます（または☰ › 盤をすべて消す）。")),250)},true);
  /* ---------- wiring ---------- */
  function refresh(){document.body.classList.toggle("g3",on());if(!on())return;build();const t=$("#g3T");if(t)t.innerHTML=title();
    const p=$("#g3Pause");if(p)p.setAttribute("aria-label",L("Pause","Pause","일시 정지","一時停止"));clock();tools();paintZoom();paintHead();requestAnimationFrame(sizePanel)}
  const _r=render;render=function(){const r=_r.apply(this,arguments);try{if(on()){tools();follow()}}catch(_){}return r};
  const _rs=renderStatic;renderStatic=function(){const r=_rs.apply(this,arguments);try{refresh()}catch(_){}return r};
  const _oc=openCase;openCase=function(i){const r=_oc.apply(this,arguments);document.body.classList.remove("g3-full","g3-zoom");
    try{refresh();if(on()&&S&&!S.solved&&(S.time||0)<3&&!(typeof COOP!=="undefined"&&COOP.play)&&!(typeof RUSH!=="undefined"&&RUSH.on)){const t0=Date.now(),id=C.id;const wait=()=>{if(!on()||C.id!==id)return;const mi=$("#mechIntro");if((mi&&!mi.hidden)||!$("#tuto").hidden){if(Date.now()-t0<120000)setTimeout(wait,400);return}intro(false)};setTimeout(wait,700)}}catch(_){}return r};
  setInterval(()=>{if(on())clock()},1000);
  mq.addEventListener?mq.addEventListener("change",refresh):mq.addListener(refresh);
  window.addEventListener("resize",()=>{clearTimeout(sizePanel.t);sizePanel.t=setTimeout(sizePanel,120)});
  new MutationObserver(()=>{try{refresh()}catch(_){}}).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
  try{refresh()}catch(_){}
})();
