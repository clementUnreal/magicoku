/* ================= Display settings: interface size, text size, buttons, board, layout =================
   Every phone is different: players choose here how big things are and where the buttons go.
   Saved in magicoku:ui. Open from the in-game menu (Réglages › Affichage) or from Options on the home screen.
   - interface size: changes the page's viewport width (like the phone's own display zoom), so every screen reflows
   - text, buttons, board: CSS zoom on those parts only
   - layout: order of testimonies / board / buttons, in portrait and in landscape */
(function(){
  const K="magicoku:ui",DEF={scale:1,text:1,btn:1,board:1,tools:"after",land:"tbx"};
  let U=load();
  function load(){try{const o=JSON.parse(localStorage.getItem(K)||"{}");return Object.assign({},DEF,o&&typeof o==="object"?o:{})}catch(_){return Object.assign({},DEF)}}
  function save(){try{localStorage.setItem(K,JSON.stringify(U))}catch(_){}}
  const meta=document.querySelector('meta[name="viewport"]'),META0=meta?meta.content:"width=device-width,initial-scale=1,viewport-fit=cover";
  const touch=()=>{try{return matchMedia("(pointer:coarse)").matches}catch(_){return false}};
  /* interface size: lay the page out on a narrower (bigger UI) or wider (smaller UI) width, then the phone fits it to the screen */
  function applyScale(){if(!meta)return;const k=+U.scale||1;
    if(k===1||!touch()){if(meta.content!==META0)meta.content=META0;return}
    const vv=window.visualViewport,avail=vv?vv.width*vv.scale:window.innerWidth;if(!(avail>100))return;
    const W=Math.round(avail/k),c=`width=${W},initial-scale=${k.toFixed(3)},viewport-fit=cover`;if(meta.content!==c)meta.content=c}
  const st=document.createElement("style");st.id="uiPrefsCss";document.head.appendChild(st);
  /* landscape orders: t = testimonies, b = board, x = buttons */
  const LAND={tbx:[1,2,3],xbt:[3,2,1],txb:[1,3,2],bxt:[3,1,2]};
  function applyCss(){const t=+U.text||1,b=+U.btn||1,p=+U.board||1,L=LAND[U.land]||LAND.tbx,G="html body.g3";
    const cols=[];cols[L[0]-1]="minmax(0,1fr)";cols[L[1]-1]=`calc(var(--g3bs,300px)*${p})`;cols[L[2]-1]=`calc(70px*${b})`;
    st.textContent=[
      t!==1?`#cards .recit>*,#hintBox,.g3-story,#g3IntroS .g3-story,.chips .chip span,.g3-sheet .mbox p{zoom:${t}}`:"",
      b!==1?`${G}.g3l .tools .tb,${G} #g3Bar>button,${G} #g3Clock,${G} #g3PanelHead button{zoom:${b}}${G}:not(.g3l) .tools .tb{min-height:${Math.round(56*b)}px!important}${G}:not(.g3l) .tools .tb>svg,${G}:not(.g3l) .tools .tb>small{zoom:${Math.min(b,1.12)}}`:"",
      p!==1?`${G}:not(.g3l) .game>.center{width:${(p*100).toFixed(0)}%!important;margin-left:auto!important;margin-right:auto!important}`:"",
      U.tools==="before"?`${G}:not(.g3l) .game>.tools{order:0!important}`:"",
      U.tools==="bottom"?`${G}:not(.g3l) .game>.tools{order:4!important;margin-top:6px!important;position:sticky!important;bottom:max(4px,env(safe-area-inset-bottom,0px));z-index:6}${G}:not(.g3l) .game>.suspects{flex:1 1 auto!important}`:"",
      `${G}.g3l .game{grid-template-columns:${cols.join(" ")}!important}`,
      `${G}.g3l .game>.suspects{grid-column:${L[0]}!important}${G}.g3l .game>.center{grid-column:${L[1]}!important}${G}.g3l .tools{grid-column:${L[2]}!important}`,
      p!==1?`${G}.g3l .game>.center{width:calc(var(--g3bs,300px)*${p})!important;height:calc(var(--g3bs,300px)*${p})!important}${G}.g3l .tools{height:calc(var(--g3bs,300px)*${p})!important}`:""
    ].join("\n")}
  function apply(){applyScale();applyCss();try{window.dispatchEvent(new Event("resize"))}catch(_){}}
  window.uiApply=()=>{U=load();apply()};
  let rT=0;window.addEventListener("orientationchange",()=>{clearTimeout(rT);rT=setTimeout(applyScale,350)});
  if(window.visualViewport)visualViewport.addEventListener("resize",()=>{clearTimeout(rT);rT=setTimeout(applyScale,350)});
  applyScale();applyCss();

  /* ---------- the settings sheet ---------- */
  const css=document.createElement("style");css.textContent=`
#uiSheet{position:fixed;inset:0;z-index:140;display:flex;align-items:flex-end;justify-content:center;background:rgba(10,6,20,.25)}
#uiSheet[hidden]{display:none}
#uiSheet .ui-box{width:min(520px,100%);max-height:72%;overflow:auto;box-sizing:border-box;background:linear-gradient(#fffaf0,#f6e6c4);color:#3a1f3d;border:2px solid #c9a25a;border-bottom:0;border-radius:20px 20px 0 0;padding:14px 16px max(14px,env(safe-area-inset-bottom,0px));box-shadow:0 -10px 40px rgba(0,0,0,.45);font:500 15px var(--f-simple,system-ui)}
@media (orientation:landscape){#uiSheet{justify-content:flex-end;align-items:stretch}#uiSheet .ui-box{width:min(420px,60%);max-height:100%;border-radius:20px 0 0 20px;border:2px solid #c9a25a;border-right:0}}
#uiSheet h2{margin:0 0 2px;font:900 21px var(--f-magi,serif);color:#8e1f33;display:flex;align-items:center;gap:8px}
#uiSheet h2 button{margin-left:auto;width:40px;height:40px;border-radius:12px;border:1.5px solid #c9a25a;background:#fff;color:#3a1f3d;font-size:18px;cursor:pointer}
#uiSheet .ui-sub{margin:0 0 10px;font-size:13px;color:#7a6650}
#uiSheet .ui-sec{margin:14px 0 6px;font:800 12px var(--f-simple,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#8a5a2a}
#uiSheet .ui-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:4px 10px;margin:8px 0}
#uiSheet .ui-row label{font-weight:800}
#uiSheet .ui-row output{font-weight:800;color:#8e1f33;min-width:48px;text-align:right}
#uiSheet input[type=range]{grid-column:1/-1;width:100%;height:36px;accent-color:#8e1f33;margin:0}
#uiSheet .ui-seg{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:6px}
#uiSheet .ui-seg button{min-height:46px;border-radius:12px;border:1.5px solid #c9a25a;background:#fff;color:#3a1f3d;font:700 13px var(--f-simple,system-ui);cursor:pointer;padding:4px 6px;line-height:1.25}
#uiSheet .ui-seg button.on{background:#8e1f33;border-color:#8e1f33;color:#fff}
#uiSheet .ui-seg button i{display:block;font-style:normal;font-size:16px;letter-spacing:2px}
#uiSheet .ui-note{font-size:12.5px;color:#7a6650;margin:4px 0 0}
#uiSheet .ui-reset{width:100%;min-height:46px;margin-top:14px;border-radius:12px;border:1.5px dashed #c9a25a;background:transparent;color:#8e1f33;font:800 14px var(--f-simple,system-ui);cursor:pointer}`;
  document.head.appendChild(css);
  const pct=v=>Math.round(v*100)+" %";
  function slider(key,label,min,max,step){return `<div class="ui-row"><label for="ui_${key}">${label}</label><output id="uo_${key}">${pct(U[key])}</output>
    <input id="ui_${key}" type="range" min="${min}" max="${max}" step="${step}" value="${U[key]}" data-k="${key}"></div>`}
  const seg=(key,opts)=>`<div class="ui-seg">${opts.map(([v,t,ic])=>`<button data-k="${key}" data-v="${v}" class="${U[key]===v?"on":""}">${ic?`<i>${ic}</i>`:""}${t}</button>`).join("")}</div>`;
  function paint(){const m=$("#uiSheet");if(!m)return;
    m.innerHTML=`<div class="ui-box" role="dialog" aria-label="${L("Affichage","Display","화면","表示")}">
      <h2>🔠 ${L("Affichage","Display","화면","表示")}<button data-x="close" aria-label="✕">✕</button></h2>
      <p class="ui-sub">${L("Règle tout pour ton téléphone : tu vois le résultat en direct.","Adjust everything to your phone: you see the result live.","휴대폰에 맞게 조절하세요. 바로 결과가 보여요.","スマホに合わせて調整できます。結果はすぐに見えます。")}</p>
      <p class="ui-sec">${L("Tailles","Sizes","크기","サイズ")}</p>
      ${slider("scale",L("Taille de l'interface","Interface size","인터페이스 크기","画面全体の大きさ"),.8,1.3,.05)}
      ${touch()?"":`<p class="ui-note">${L("Sur ordinateur, utilise plutôt Ctrl + et Ctrl − (⌘ sur Mac).","On a computer, use Ctrl + and Ctrl − instead (⌘ on a Mac).","컴퓨터에서는 Ctrl + / Ctrl − 를 사용하세요 (Mac은 ⌘).","パソコンでは Ctrl + / Ctrl − を使ってください（Macは⌘）。")}</p>`}
      ${slider("text",L("Taille du texte","Text size","글자 크기","文字の大きさ"),.8,1.5,.05)}
      ${slider("btn",L("Taille des boutons","Button size","버튼 크기","ボタンの大きさ"),.8,1.4,.05)}
      ${slider("board",L("Taille du plateau","Board size","보드 크기","盤の大きさ"),.6,1,.05)}
      <p class="ui-sec">${L("Boutons d'action (téléphone droit)","Action buttons (phone upright)","동작 버튼 (세로 화면)","操作ボタン（縦画面）")}</p>
      ${seg("tools",[["before",L("Au-dessus du plateau","Above the board","보드 위","盤の上"),"⬆"],["after",L("Sous le plateau","Under the board","보드 아래","盤の下"),"⬇"],["bottom",L("En bas de l'écran","Bottom of the screen","화면 맨 아래","画面の一番下"),"⤓"]])}
      <p class="ui-sec">${L("Disposition (téléphone couché)","Layout (phone sideways)","배치 (가로 화면)","配置（横画面）")}</p>
      ${seg("land",[["tbx",L("Témoignages · plateau · boutons","Testimonies · board · buttons","증언 · 보드 · 버튼","証言・盤・ボタン"),"📜 ▦ ✋"],["xbt",L("Boutons · plateau · témoignages","Buttons · board · testimonies","버튼 · 보드 · 증언","ボタン・盤・証言"),"✋ ▦ 📜"],["txb",L("Témoignages · boutons · plateau","Testimonies · buttons · board","증언 · 버튼 · 보드","証言・ボタン・盤"),"📜 ✋ ▦"],["bxt",L("Plateau · boutons · témoignages","Board · buttons · testimonies","보드 · 버튼 · 증언","盤・ボタン・証言"),"▦ ✋ 📜"]])}
      <p class="ui-note">${L("Gaucher ? Mets les boutons du côté de ton pouce.","Left-handed? Put the buttons on your thumb's side.","왼손잡이라면 버튼을 엄지 쪽에 두세요.","左利きなら、ボタンを親指側に置けます。")}</p>
      <button class="ui-reset" data-x="reset">↺ ${L("Revenir aux réglages d'origine","Back to the default settings","기본 설정으로 되돌리기","初期設定に戻す")}</button></div>`}
  window.openUi=function(){let m=$("#uiSheet");if(!m){m=document.createElement("div");m.id="uiSheet";document.body.appendChild(m);
      m.addEventListener("click",e=>{if(e.target===m){m.hidden=true;return}const x=e.target.closest("[data-x]");if(x){if(x.dataset.x==="close")m.hidden=true;else{U=Object.assign({},DEF);save();apply();paint()}return}
        const b=e.target.closest("button[data-v]");if(!b)return;U[b.dataset.k]=b.dataset.v;save();apply();m.querySelectorAll(`button[data-k="${b.dataset.k}"]`).forEach(o=>o.classList.toggle("on",o===b));try{play&&play("tap")}catch(_){}});
      m.addEventListener("input",e=>{const r=e.target;if(!r.dataset||!r.dataset.k)return;U[r.dataset.k]=+r.value;const o=$("#uo_"+r.dataset.k);if(o)o.textContent=pct(+r.value);
        if(r.dataset.k==="scale"){clearTimeout(m._t);m._t=setTimeout(()=>{save();apply()},250)}else{save();applyCss();try{window.dispatchEvent(new Event("resize"))}catch(_){}}})}
    paint();m.hidden=false};
  /* home › Options: a row under the theme row */
  function homeRow(){const pan=$("#pOptions");if(!pan)return;let r=$("#oUi");
    if(!r){r=document.createElement("div");r.id="oUi";r.className="o-theme";const th=$("#oTheme");if(th&&th.parentElement)th.parentElement.insertBefore(r,th.nextSibling);else pan.appendChild(r)}
    r.innerHTML=`<span>🔠 ${L("Taille et disposition","Size and layout","크기와 배치","大きさと配置")}</span><span class="g3-theme"><button data-uiopen="1">${L("Régler","Adjust","조절","調整")}</button></span>`}
  document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("[data-uiopen]")){e.stopPropagation();openUi()}},true);
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{homeRow()}catch(_){}};
})();
