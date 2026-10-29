/* ================= Halloween event: "La nuit des fantômes" (10 expert levels with a ghost) + Halloween look ================= */
var HW={on:false,i:0};
var HW_END=Date.UTC(2026,10,9,22,59);      /* event levels: until Sunday 9 November 23:59 (Paris) */
var HW_THEME_END=Date.UTC(2026,10,3,22,59);/* Halloween look of the site: until Monday 3 November 23:59 (Paris) */
function hwOpen(){return typeof HW_DATA!=="undefined"&&HW_DATA.length&&Date.now()<=HW_END}
(function(){
  if(typeof HW_DATA==="undefined")return;
  const done=i=>{const id=HW_DATA[i].id,p=ACC.profile;if(p&&p.progress&&p.progress[id]&&p.progress[id].solved)return true;try{return !!(JSON.parse(localStorage.getItem("crimes-mignons-wiz:"+id)||"{}").solved)}catch(_){return false}};
  const nDone=()=>HW_DATA.filter((_,i)=>done(i)).length;
  const isOpen=i=>i===0||done(i)||done(i-1);
  const ghostName=()=>C&&C.ghost!=null?pname(C.ghost):"";
  /* ---------- swap the event level in while it is played (same trick as the daily puzzle) ---------- */
  const _prep=prep;prep=function(){if(HW.on){const k=ci,keep=DATA[k];DATA[k]=HW_DATA[HW.i];try{_prep()}finally{DATA[k]=keep}}else _prep()};
  window.startHW=function(i){if(!isOpen(i)){try{play("forbid")}catch(_){}toast(L("Résous d'abord l'enquête précédente.","Solve the previous case first.","먼저 이전 사건을 해결하세요.","先に前の事件を解いてね。"));return}
    HW.on=true;HW.i=i;document.body.classList.add("hw-play");$("#home").hidden=true;openCase(ci);render();renderStatic();try{renderTimer()}catch(_){}setTimeout(rulePop,600)};
  new MutationObserver(()=>{if(HW.on&&!$("#home").hidden){HW.on=false;document.body.classList.remove("hw-play");try{openCase(ci)}catch(e){}try{renderHome()}catch(_){}}}).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
  /* ---------- hints: the usual deduction engine doesn't know ghosts, so hints show a square directly ---------- */
  if(typeof deduceR==="function"){const _d=deduceR;deduceR=function(){if(HW.on)return null;return _d.apply(this,arguments)}}
  /* ---------- testimony: "floated over <furniture>" ---------- */
  function floatTxt(p,v){const o=OBJN[v]?TX(OBJN[v]):v;
    if(LANG==="fr"){const t=o.startsWith("un ")?"d'"+o:o.startsWith("une ")?"d'"+o:o.startsWith("le ")?"d'un "+o.slice(3):o.startsWith("la ")?"d'une "+o.slice(3):o.startsWith("les ")?"de "+o:o.startsWith("l'")?"de "+o:"de "+o;return `flottait au-dessus ${t} 👻`}
    if(LANG==="en")return `was floating above ${o.replace(/^the /,"a ")} 👻`;
    if(LANG==="ko")return `${o} 위에 떠 있었다 👻`;return `${o}の上に浮かんでいた 👻`}
  const _p=pred;pred=function(p,cl){if(cl&&cl[0]==="float")return floatTxt(p,cl[1]);return _p.apply(this,arguments)};
  if(typeof predCJK==="function"){const _pc=predCJK;predCJK=function(p,cl){if(cl&&cl[0]==="float")return floatTxt(p,cl[1]);return _pc.apply(this,arguments)}}
  const _ct=clueText;clueText=function(p,cl){if(cl&&cl[0]==="float")return `<b>${pname(p)}</b> ${floatTxt(p,cl[1])}.`;return _ct.apply(this,arguments)};
  if(typeof unaryOk==="function"){const _u=unaryOk;unaryOk=function(cl,r,c){if(cl&&cl[0]==="float")return OBJ[r][c]===cl[1];return _u.apply(this,arguments)}}
  /* ---------- the ghost rule card ---------- */
  function rules(){return `<ul class="hw-ru"><li>👻 ${L(`<b>${ghostName()}</b> est un fantôme : ${C&&M.people[C.ghost]&&M.people[C.ghost][1]==="f"?"elle":"il"} peut <b>flotter au-dessus des meubles</b> (bibliothèque, chaudron…).`,`<b>${ghostName()}</b> is a ghost and can <b>float over furniture</b> (bookcase, cauldron…).`,`<b>${ghostName()}</b>은(는) 유령이라 <b>가구 위에 떠 있을 수</b> 있어요(책장, 가마솥…).`,`<b>${ghostName()}</b>は幽霊なので、<b>家具の上に浮かぶ</b>ことができます（本棚、大釜…）。`)}</li>
      <li>🧱 ${L(`Il <b>traverse les murs</b> : pour lui, « à côté » compte aussi de l'autre côté d'un mur.`,`It <b>goes through walls</b>: for the ghost, “next to” also counts across a wall.`,`<b>벽을 통과해요</b>. 유령에게 ‘옆’은 벽 너머도 포함해요.`,`<b>壁をすり抜けます</b>。幽霊にとって「となり」は壁の向こうも含みます。`)}</li>
      <li>⚖️ ${L(`Il <b>ne compte pas</b> dans les pièces : il n'est jamais le coupable, et il peut se trouver dans la pièce de la victime en plus du coupable.`,`It <b>doesn't count</b> in rooms: it is never the culprit, and it may be in the victim's room as well as the culprit.`,`방 인원에 <b>포함되지 않아요</b>. 범인이 될 수 없고, 범인과 함께 피해자의 방에 있을 수도 있어요.`,`部屋の人数には<b>数えません</b>。犯人にはならず、犯人と一緒に被害者の部屋にいることもあります。`)}</li>
      <li>➕ ${L("Comme tout le monde, il reste <b>seul sur sa rangée et sa colonne</b>.","Like everyone, it stays <b>alone in its row and column</b>.","다른 사람처럼 <b>행과 열에는 혼자</b>예요.","ほかの人と同じく、<b>行と列には1人だけ</b>です。")}</li></ul>`}
  function rulePop(){if(!HW.on)return;let m=$("#hwRule");if(m)m.remove();m=document.createElement("div");m.id="hwRule";m.className="hw-ov";
    m.innerHTML=`<div class="hw-box"><div class="hw-pk">🎃</div><h2>${L("La nuit des fantômes","Night of the Ghosts","유령의 밤","幽霊の夜")}</h2>${rules()}<button class="hw-go">${L("C'est parti !","Let's go!","시작!","はじめよう！")}</button></div>`;
    document.body.appendChild(m);m.querySelector(".hw-go").onclick=()=>m.remove()}
  window.hwRules=rulePop;
  /* ---------- in-game: title, ghost look, reminder line ---------- */
  const _rs=renderStatic;renderStatic=function(){const r=_rs.apply(this,arguments);try{paintGame()}catch(_){}return r};
  const _r=render;render=function(){const r=_r.apply(this,arguments);try{paintGhost()}catch(_){}return r};
  function paintGame(){document.body.classList.toggle("hw-play",HW.on);if(!HW.on)return;
    const setT=()=>{const t=$("#g3T");if(t&&HW.on)t.innerHTML=`🎃 ${L("Halloween","Halloween","할로윈","ハロウィン")} · ${HW.i+1}/10<small>${TX(M.title)}</small>`};requestAnimationFrame(setT);setTimeout(setT,120);
    const t=$("#g3T");if(t)t.innerHTML=`🎃 ${L("Halloween","Halloween","할로윈","ハロウィン")} · ${HW.i+1}/10<small>${TX(M.title)}</small>`;
    const ct=$("#caseTitle");if(ct)ct.textContent=`🎃 ${TX(M.title)}`;
    const rec=document.querySelector(".recit");const end=document.querySelector(".recit .st-end");if(end&&!end.dataset.hw){end.dataset.hw=1;end.insertAdjacentHTML("beforeend"," "+L("(Le fantôme ne compte pas : il peut être là en plus.)","(The ghost doesn't count: it may be there too.)","(유령은 세지 않아요. 함께 있을 수도 있어요.)","（幽霊は数えません。一緒にいることもあります。）"))}
    if(rec&&!rec.querySelector(".hw-rem")){const d=document.createElement("p");d.className="hw-rem";d.innerHTML=`👻 <b>${ghostName()}</b> ${L("est un fantôme","is a ghost","은(는) 유령","は幽霊")} · <a href="#" data-hwr>${L("règles du fantôme","ghost rules","유령 규칙","幽霊のルール")}</a>`;rec.prepend(d)}}
  document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("[data-hwr]");if(a){e.preventDefault();rulePop()}});
  function paintGhost(){if(!HW.on||!C||C.ghost==null)return;const g=C.ghost;
    document.querySelectorAll(`.card[data-p="${g}"]`).forEach(c=>c.classList.add("hw-ghost"));
    document.querySelectorAll("#marks .mk.hw-g").forEach(e=>e.classList.remove("hw-g"));
    const x=S.place[g];if(x){const el=document.querySelector(`#marks .mk[data-r="${x[0]}"][data-c="${x[1]}"]`);if(el)el.classList.add("hw-g")}}
  /* ---------- end of case: next event case, no chapter progress / moons ---------- */
  const _sr=showReveal;showReveal=function(){const was=HW.on,i=HW.i;const out=_sr.apply(this,arguments);if(!was)return out;try{const box=document.querySelector("#reveal .box");if(!box)return out;
      box.querySelectorAll(".rv-prog,.mn-ch").forEach(e=>e.remove());const st=box.querySelector(".rv-moons");if(st)st.remove();
      const p=document.createElement("p");p.className="hw-win";p.innerHTML=`🎃 ${L(`Halloween : <b>${nDone()}/10</b> enquêtes résolues · +50 éclats de lune`,`Halloween: <b>${nDone()}/10</b> cases solved · +50 moon shards`,`할로윈: <b>${nDone()}/10</b> 사건 해결 · 달 조각 +50`,`ハロウィン：<b>${nDone()}/10</b>件解決・月のかけら+50`)}`;
      const ref=box.querySelector(".rv-rank");if(ref)ref.before(p);else box.appendChild(p);
      const nx=box.querySelector("#rvNext");if(nx){if(i+1<HW_DATA.length){nx.textContent=L("Enquête suivante","Next case","다음 사건","次の事件")+" ›";nx.onclick=()=>{$("#reveal").hidden=true;HW.i=i+1;openCase(ci);render();renderStatic();setTimeout(rulePop,400)}}else nx.remove()}}catch(_){}return out};
  /* ---------- home: event card + event panel ---------- */
  function card(){if(!hwOpen()){const c=$("#hwCard");if(c)c.remove();return}let c=$("#hwCard");const hero=$("#h2Hero");if(!hero)return;
    if(!c){c=document.createElement("button");c.id="hwCard";c.className="hw-card";hero.after(c);c.onclick=e=>{e.stopPropagation();show("pHallo");try{play("page")}catch(_){}}}
    const d=Math.max(0,Math.ceil((HW_END-Date.now())/864e5)),n=nDone();
    c.innerHTML=`<span class="hw-ci">🎃</span><span class="hw-ct"><b>${L("La nuit des fantômes","Night of the Ghosts","유령의 밤","幽霊の夜")}</b><small>${L("Événement Halloween · 10 enquêtes expert","Halloween event · 10 expert cases","할로윈 이벤트 · 전문가 사건 10개","ハロウィンイベント・エキスパート10件")}</small><small class="hw-cd">👻 ${n}/10 · ${L(`encore ${d} jour${d>1?"s":""}`,`${d} day${d>1?"s":""} left`,`${d}일 남음`,`残り${d}日`)}</small></span><span class="h2-chev">›</span>`}
  function panel(){let p=$("#pHallo");if(!p){p=document.createElement("div");p.id="pHallo";p.className="home-panel hw-panel";p.hidden=true;($("#hMain")||$("#home")).after(p);
      p.addEventListener("click",e=>{const b=e.target.closest("[data-hw]");if(b){e.stopPropagation();startHW(+b.dataset.hw);return}if(e.target.closest("[data-hwback]")){e.stopPropagation();show("hMain")}})}
    const n=nDone();
    p.innerHTML=`<button class="hb small" data-hwback>← ${L("Retour","Back","뒤로","戻る")}</button>
      <div class="hw-head"><div class="hw-pk">🎃</div><h2>${L("La nuit des fantômes","Night of the Ghosts","유령의 밤","幽霊の夜")}</h2>
      <p>${L("Cette nuit, un suspect erre en <b>fantôme</b> dans chaque lieu de Brumelune. Il flotte au-dessus des meubles, traverse les murs… et ne compte pas dans les pièces. 10 enquêtes <b>expert</b>, +50 éclats de lune chacune.","Tonight, one suspect roams each place of Brumelune as a <b>ghost</b>. It floats over furniture, goes through walls… and doesn't count in rooms. 10 <b>expert</b> cases, +50 moon shards each.","오늘 밤, 브뤼믈륀의 각 장소에서 용의자 한 명이 <b>유령</b>이 되어 떠돌아요. 가구 위를 떠다니고, 벽을 통과하며, 방 인원에 포함되지 않아요. <b>전문가</b> 사건 10개, 각각 달 조각 +50.","今夜、ブリュムリュヌの各所で容疑者の一人が<b>幽霊</b>になってさまよいます。家具の上を漂い、壁をすり抜け、部屋の人数には数えません。<b>エキスパート</b>10件、各+50かけら。")}</p>
      <div class="hw-prog"><b>${n}/10</b><i><em style="width:${n*10}%"></em></i><small>${L("jusqu'au dimanche 9 novembre","until Sunday 9 November","11월 9일(일)까지","11月9日（日）まで")}</small></div></div>
      <div class="hw-grid">${HW_DATA.map((d,i)=>{const ok=done(i),op=isOpen(i),m=META[d.id];return `<button class="hw-lv${ok?" done":""}${op?"":" locked"}" data-hw="${i}"><span class="hw-n">${ok?"✓":op?i+1:"🔒"}</span><b>${esc(TX(m.title).replace(/\s\d+$/,""))} ${i+1}</b><small>${d.rooms.length}×${d.rooms.length} · 👻 ${esc(m.people[d.ghost][0])}</small></button>`}).join("")}</div>`}
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const _show=show;show=function(pn){const p=$("#pHallo");if(p)p.hidden=true;
    if(pn==="pHallo"){_show("__none__");document.querySelectorAll("#home .home-panel,#hMain").forEach(e=>e.hidden=true);const v=$("#lvView");if(v)v.hidden=true;panel();$("#pHallo").hidden=false;try{$("#home").scrollTop=0}catch(_){}return}
    return _show.apply(this,arguments)};
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{card();const p=$("#pHallo");if(p&&!p.hidden)panel();theme()}catch(_){}};
  /* ---------- Halloween look until 3 November ---------- */
  function theme(){document.documentElement.classList.toggle("hw-theme",Date.now()<=HW_THEME_END)}
  theme();
  const st=document.createElement("style");st.textContent=`
.hw-card{display:flex;align-items:center;gap:12px;width:100%;margin:10px 0 0;padding:12px 14px;border-radius:18px;border:2px solid #f08a24;background:linear-gradient(135deg,#3b1a0a,#24102e 70%);color:#ffe2b8;text-align:left;cursor:pointer;box-shadow:0 0 18px rgba(240,138,36,.35),0 6px 16px #0006}
.hw-ci{font-size:38px;line-height:1;filter:drop-shadow(0 0 8px #f08a24)}.hw-ct{flex:1;display:flex;flex-direction:column;gap:2px}.hw-ct b{font:800 18px var(--f-magi,Georgia);color:#ffb35c}.hw-ct small{font:600 12.5px var(--f-simple,system-ui);color:#f3d6b0}.hw-cd{color:#ffcf8a!important}
.hw-panel{background:linear-gradient(#24102e,#170a1e)!important;border-color:#f08a24!important;color:#ffe2b8}
.hw-head{text-align:center;margin:6px 0 10px}.hw-head h2{margin:2px 0 6px;color:#ffb35c!important;font-size:24px}.hw-head p{font:500 14px/1.45 var(--f-simple,system-ui);color:#f3d6b0;margin:0 0 10px}
.hw-pk{font-size:44px;line-height:1;filter:drop-shadow(0 0 10px #f08a24)}
.hw-prog{color:#ffe2b8;display:flex;flex-wrap:wrap;align-items:center;gap:8px;justify-content:center;font:700 13px var(--f-simple,system-ui)}.hw-prog small{color:#f3d6b0;width:100%;text-align:center}.hw-prog i{width:120px;height:8px;border-radius:9px;background:#3a2046;overflow:hidden}.hw-prog em{display:block;height:100%;background:linear-gradient(90deg,#f08a24,#ffcf5c)}
.hw-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hw-lv{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px;border-radius:14px;border:1.5px solid #7a4a2a;background:#2e1638;color:#ffe2b8;text-align:left;cursor:pointer;position:relative}
.hw-lv b{font:800 14px var(--f-magi,Georgia);color:#ffcf8a}.hw-lv small{font:600 11.5px var(--f-simple,system-ui);color:#d9b8e6}
.hw-lv .hw-n{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#f08a24;color:#2a1534;font:800 12px var(--f-simple,system-ui)}
.hw-lv.done{border-color:#6cc276}.hw-lv.done .hw-n{background:#6cc276}.hw-lv.locked{opacity:.5}
.hw-ov{position:fixed;inset:0;z-index:96;background:rgba(10,4,14,.7);display:flex;align-items:center;justify-content:center;padding:16px}
.hw-box{width:min(440px,100%);max-height:calc(100dvh - 32px);overflow:auto;background:linear-gradient(#2a1234,#170a1e);border:2px solid #f08a24;border-radius:20px;padding:16px;color:#ffe2b8;text-align:center;box-shadow:0 0 30px rgba(240,138,36,.35)}
.hw-box h2{margin:4px 0 8px;color:#ffb35c}.hw-ru{text-align:left;margin:0 0 12px;padding:0 0 0 4px;list-style:none;display:flex;flex-direction:column;gap:8px;font:500 14px/1.4 var(--f-simple,system-ui)}
.hw-go{width:100%;min-height:50px;border:0;border-radius:999px;background:linear-gradient(#ffb35c,#f08a24);color:#2a1534;font:800 18px var(--f-simple,system-ui);cursor:pointer;box-shadow:0 4px 0 #9a4a10}
.hw-rem{margin:0 0 8px!important;padding:6px 10px;border-radius:10px;background:rgba(240,138,36,.14);font:600 13px var(--f-simple,system-ui)!important;font-style:normal!important}
.hw-rem a{color:#b4530f;text-decoration:underline}
.hw-win{margin:8px 0 0;padding:8px 10px;border-radius:10px;background:rgba(240,138,36,.15);color:#7a3a0a;font:700 13.5px var(--f-simple,system-ui)!important;text-align:center}
#g3T small{display:block;font:500 12px var(--f-simple,system-ui);opacity:.85}
.card.hw-ghost .cph,.card.hw-ghost img{opacity:.6;filter:drop-shadow(0 0 6px #b9e6ff) saturate(.6)}
.card.hw-ghost .nm::after,.card.hw-ghost span:last-child::after{content:" 👻"}
#marks .mk.hw-g .who{opacity:.72;filter:drop-shadow(0 0 6px #b9e6ff)}
/* Halloween look */
html.hw-theme .home-t::after,html.hw-theme .home-logo h1::after{content:" 🎃"}
html.hw-theme .h2-bar{border-top-color:#f08a24!important;box-shadow:0 -4px 18px rgba(240,138,36,.25)!important}
html.hw-theme .h2-hero{border-color:#f08a24!important;box-shadow:0 0 18px rgba(240,138,36,.3)!important}
.hw-bats{position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden}
.hw-bats span{position:absolute;font-size:22px;opacity:.55;animation:hwfly linear infinite}
@keyframes hwfly{0%{transform:translate(-10vw,0) rotate(-6deg)}50%{transform:translate(50vw,-4vh) rotate(6deg)}100%{transform:translate(110vw,2vh) rotate(-6deg)}}
html:not(.hw-theme) .hw-bats{display:none}
body.g3 .hw-bats{display:none}`;document.head.appendChild(st);
  /* a few bats flying over the menus */
  const bats=document.createElement("div");bats.className="hw-bats";bats.innerHTML=[["8%",28,0],["22%",36,9],["14%",44,19],["70%",40,5],["82%",52,14]].map(([t,d,dl])=>`<span style="top:${t};animation-duration:${d}s;animation-delay:-${dl}s">🦇</span>`).join("");document.body.appendChild(bats);
  try{renderHome()}catch(_){}
})();
