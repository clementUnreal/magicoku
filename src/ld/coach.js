
/* ================= guided tutorial ("coach"): the player must really do each gesture =================
   First launch: mandatory (no skip). From the menu: same steps, with a "Skip" link.
   Everything outside the expected target is blocked while a step waits for an action. */
(function(){
  const css=document.createElement("style");
  css.textContent=`#coach{position:fixed;left:50%;transform:translateX(-50%);width:min(460px,calc(100vw - 20px));z-index:140;box-sizing:border-box;
  background:linear-gradient(#fffaf0,#f6e6c4);border:2px solid #c9a25a;border-radius:18px;padding:14px 16px 12px;color:#3a1f3d;
  box-shadow:0 14px 40px rgba(0,0,0,.55),0 0 0 4px rgba(255,224,138,.25);animation:coachIn .3s cubic-bezier(.2,1.3,.4,1)}
#coach[hidden]{display:none}
@keyframes coachIn{from{opacity:0;transform:translate(-50%,10px) scale(.96)}to{opacity:1;transform:translateX(-50%)}}
#coach .co-n{font:800 11px var(--f-simple,system-ui)!important;letter-spacing:.08em;text-transform:uppercase;color:#a07a2c}
#coach h3{margin:2px 0 6px;font:900 19px/1.2 var(--f-magi,serif);color:#8e1f33}
#coach p{margin:0;font:500 15.5px/1.5 var(--f-simple,system-ui)!important}
#coach p b{color:#8e1f33}
#coach .co-acts{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}
#coach .co-go{min-height:44px;padding:0 20px;border:0;border-radius:999px;background:linear-gradient(#b8283e,#8a1a2c);color:#ffe6a6;font:800 15px var(--f-simple,system-ui)!important;box-shadow:0 3px 0 #5a1020;cursor:pointer}
#coach .co-skip{min-height:40px;border:0;background:none;color:#7a6650;text-decoration:underline;font:600 13px var(--f-simple,system-ui)!important;cursor:pointer}
#coach .co-warn{display:block;margin-top:8px;padding:8px 10px;border-radius:10px;background:#fdeaea;color:#8e1f33;font:700 14px/1.4 var(--f-simple,system-ui)!important;animation:coShake .4s}
#coach .co-warn:empty{display:none}
@keyframes coShake{20%{transform:translateX(-6px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}}
#coach .co-wait{display:inline-flex;align-items:center;gap:8px;font:700 13.5px var(--f-simple,system-ui)!important;color:#7a3f6a}
#coach .co-wait i{width:9px;height:9px;border-radius:50%;background:#c0392b;animation:coBlink 1s infinite}
@keyframes coBlink{50%{opacity:.25}}
.coach-hl{position:relative;z-index:2;outline:4px solid #ffd54a!important;outline-offset:3px;border-radius:14px;animation:coPulse 1.2s ease-in-out infinite}
@keyframes coPulse{50%{outline-color:#ff8a3d;box-shadow:0 0 0 10px rgba(255,213,74,.25)}}
#marks .mk.coach-cell{z-index:6}
#marks .mk.coach-cell::before{content:"";position:absolute;inset:4%;border-radius:12%;border:4px solid #ffd54a;box-shadow:0 0 0 4px rgba(255,138,61,.45),0 0 18px #ffd54a;animation:coPulse 1s ease-in-out infinite;pointer-events:none}
#marks .mk.coach-cell::after{content:"👆";position:absolute;left:50%;top:58%;font-size:min(9vw,40px);line-height:1;transform:translateX(-30%);animation:coPress 1.6s ease-in-out infinite;pointer-events:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.4))}
@keyframes coPress{0%,100%{transform:translate(-30%,0) scale(1)}25%{transform:translate(-30%,-14%) scale(.92)}35%,75%{transform:translate(-30%,-14%) scale(.92)}}
.co-demo{display:flex;align-items:center;justify-content:center;gap:10px;margin:8px 0 2px}
.co-demo .dc{position:relative;width:46px;height:46px;border-radius:10px;background:#efe2c4;border:2px solid #c9a25a}
.co-demo .dc::before{content:"";position:absolute;inset:6px;border-radius:50%;border:4px solid #8e1f33;border-right-color:transparent;border-bottom-color:transparent;animation:coRing 1.6s linear infinite}
@keyframes coRing{0%{transform:rotate(0);opacity:0}10%{opacity:1}60%{transform:rotate(360deg);opacity:1}61%,100%{opacity:0}}
.co-demo .df{font-size:30px;animation:coPress2 1.6s ease-in-out infinite}
@keyframes coPress2{0%,100%{transform:translateY(0)}20%,60%{transform:translateY(6px)}}
.co-demo small{font:700 13px var(--f-simple,system-ui)!important;color:#7a3f6a}`;
  document.head.appendChild(css);

  const K="magicoku:tuto";
  const done=()=>{try{return localStorage.getItem(K)==="done"}catch(_){return false}};
  const fem=p=>M.people[p][1]==="f";
  const nm=p=>`<b>${pname(p)}</b>`;
  const busy=()=>{const mi=$("#mechIntro");if(mi&&!mi.hidden)return true;if(!$("#home").hidden)return true;
    return [...document.querySelectorAll(".modal")].some(m=>!m.hidden&&m.id!=="coachDummy")};
  let st=null; // {steps,i,mandatory,p,cell,q,cell2,warn}
  let box=null,tick=null,pending=false;

  function firstDeduction(known){let d=null;try{d=deduceR(known||{})}catch(_){}
    if(d)return {p:d.p,cell:d.cell};
    const P=M.people.length,p=[...Array(P).keys()].find(x=>!S.place[x]&&!(known&&known[x]));return p==null?null:{p,cell:C.solution[p]}}
  const chip=p=>document.querySelector(`.chips [data-p="${p}"]`)||document.querySelector(`#cards [data-p="${p}"]`);
  const posTxt=c=>`<b>${posn(c[0],c[1])}</b>`;

  /* ---------- steps ---------- */
  function build(){const a=firstDeduction({});if(!a)return null;
    const s=[];
    s.push({title:L("Bienvenue, détective !","Welcome, detective!","환영해요, 탐정님!","ようこそ、探偵さん！"),
      text:L("Quelqu'un a été empoisonné. Pour résoudre l'enquête, tu vas placer <b>chaque personne</b> sur le plan, là où elle se trouvait, grâce aux témoignages.<br>Je te montre comment faire, pas à pas.",
        "Someone has been poisoned. To solve the case, you'll place <b>every person</b> on the map where they were, using the testimonies.<br>I'll show you how, step by step.",
        "누군가 독에 당했어요. 사건을 풀려면 증언을 보고 <b>모든 사람</b>을 그들이 있던 자리에 지도 위에 놓아야 해요.<br>한 단계씩 알려 줄게요.",
        "誰かが毒を盛られました。事件を解くには、証言をもとに<b>全員</b>を、いた場所に見取り図の上で置いていきます。<br>一歩ずつ教えますね。"),
      btn:L("C'est parti !","Let's go!","시작!","はじめよう！")});
    s.push({title:L("Choisis une personne","Pick a person","사람을 골라요","人物を選ぼう"),
      text:()=>L(`Chaque portrait rond est une personne de l'enquête.<br><b>Touche le portrait de ${pname(a.p)}</b> (il clignote).`,`Each round portrait is a person in the case.<br><b>Tap ${pname(a.p)}'s portrait</b> (it's flashing).`,`동그란 초상화 하나하나가 사건의 인물이에요.<br><b>${pname(a.p)}의 초상화를 누르세요</b>(깜빡이고 있어요).`,`丸い肖像は、それぞれ事件の人物です。<br><b>${pname(a.p)}の肖像をタップ</b>しよう（点滅しています）。`),
      target:()=>chip(a.p),allow:e=>e.target.closest&&e.target.closest(`[data-p="${a.p}"]`),
      ready:()=>S.sel===a.p,waitTxt:L("Touche le portrait…","Tap the portrait…","초상화를 누르세요…","肖像をタップ…")});
    const holdText=(p,c)=>L(`Le témoignage de ${pname(p)} est surligné. Grâce à lui, il ne reste qu'<b>une seule case possible</b> : ${posTxt(c)}, celle qui brille.<br>Pose ton doigt dessus et <b>garde-le appuyé</b> sans le lever, jusqu'à ce que le cercle soit plein.`,
      `${pname(p)}'s testimony is highlighted. Thanks to it, there's <b>only one possible square</b>: ${posTxt(c)}, the glowing one.<br>Put your finger on it and <b>keep holding</b> without lifting it, until the circle is full.`,
      `${pname(p)}의 증언이 강조되어 있어요. 이 증언 덕분에 <b>가능한 칸은 하나뿐</b>이에요: 빛나는 ${posTxt(c)}.<br>그 칸에 손가락을 대고 원이 다 찰 때까지 <b>떼지 말고 꾹 누르세요</b>.`,
      `${pname(p)}の証言が光っています。この証言から、<b>ありえるマスはひとつだけ</b>：光っている${posTxt(c)}です。<br>指を置いて、円がいっぱいになるまで<b>離さずに押し続けよう</b>。`);
    const demo=`<div class="co-demo" aria-hidden="true"><span class="dc"></span><span class="df">👆</span><small>${L("appui long","press and hold","길게 누르기","長押し")}</small></div>`;
    s.push({title:L("Garde le doigt appuyé !","Press and hold!","꾹 누르세요!","長押ししよう！"),text:()=>holdText(a.p,a.cell)+demo,
      cell:a.cell,hold:a.p,allow:e=>onCell(e,a.cell),ready:()=>placedAt(a.p,a.cell),waitTxt:L("Garde le doigt appuyé sur la case qui brille…","Hold your finger on the glowing square…","빛나는 칸을 꾹 누르세요…","光るマスを長押し…")});
    s.push({title:()=>L(`Bravo, ${pname(a.p)} est ${fem(a.p)?"placée":"placé"} !`,`Well done, ${pname(a.p)} is placed!`,`잘했어요, ${pname(a.p)}${particle(pname(a.p),"이","가")} 배치됐어요!`,`すごい！${pname(a.p)}を配置できました！`),
      text:L("Règle d'or : il n'y a qu'<b>une personne par rangée et par colonne</b>. Donc maintenant, plus personne d'autre ne peut être dans sa <b>rangée</b> ni dans sa <b>colonne</b>, d'un bout à l'autre de la grille, même de l'autre côté d'un mur. On va apprendre à barrer ces cases pour s'en souvenir.","Golden rule: there's only <b>one person per row and per column</b>. So now nobody else can be in their <b>row</b> or their <b>column</b>, from one edge of the grid to the other, even past a wall. Let's learn to cross those squares out so you remember.","황금 규칙: <b>행과 열마다 한 사람</b>만 있을 수 있어요. 그러니 이제 그 사람의 <b>행</b>과 <b>열</b>에는 다른 사람이 있을 수 없어요. 벽 너머까지 그리드 끝에서 끝까지예요. 기억하기 쉽게 그 칸들을 지우는 법을 배워 봐요.","大切なルール：<b>各行・各列に一人だけ</b>。だから、もうその人の<b>行</b>と<b>列</b>には、ほかの誰もいられません。壁の向こうも含めて、グリッドの端から端までです。忘れないように、そのマスに×をつける方法を覚えよう。"),
      btn:L("Suivant","Next","다음","次へ")});
    s.push({title:L("Barrer une case","Cross out a square","칸 지우기","マスに×をつける"),
      text:L("Quand tu es sûr que personne ne peut être sur une case, tu peux la barrer d'une croix.<br><b>Touche le bouton « Barrer » ✕</b> (il clignote).","When you're sure nobody can be on a square, you can cross it out.<br><b>Tap the “Cross out” ✕ button</b> (it's flashing).","어떤 칸에 아무도 있을 수 없다고 확신하면 ×로 지울 수 있어요.<br><b>‘지우기’ ✕ 버튼을 누르세요</b>(깜빡이고 있어요).","そのマスに誰もいられないと確信したら、×をつけられます。<br><b>「×」ボタンをタップ</b>しよう（点滅しています）。"),
      target:()=>$("#tX"),allow:e=>e.target.closest&&e.target.closest("#tX"),ready:()=>typeof tool!=="undefined"&&tool==="x",waitTxt:L("Touche « Barrer »…","Tap “Cross out”…","지우기를 누르세요…","×ボタンをタップ…")});
    s.push({title:L("Touche une case vide","Tap an empty square","빈 칸을 누르세요","空いているマスをタップ"),
      text:L("Maintenant, <b>touche une case vide</b> de sa rangée ou de sa colonne : une croix ✕ apparaît.<br>Astuce : en glissant le doigt, tu peux en barrer plusieurs d'un coup.","Now <b>tap an empty square</b> in their row or column: a cross ✕ appears.<br>Tip: slide your finger to cross out several at once.","이제 그 사람의 행이나 열에서 <b>빈 칸을 누르세요</b>. ✕ 표시가 생겨요.<br>팁: 손가락을 밀면 여러 칸을 한 번에 지울 수 있어요.","次に、その人の行か列の<b>空いているマスをタップ</b>しよう。×がつきます。<br>コツ：指をすべらせると、まとめて×をつけられます。"),
      target:()=>$("#plan"),allow:e=>e.target.closest&&e.target.closest("#plan"),ready:()=>Object.keys(S.xs||{}).length>st.xs0,waitTxt:L("Touche une case du plan…","Tap a square on the map…","지도의 칸을 누르세요…","マスをタップ…")});
    s.push({title:L("Parfait !","Perfect!","완벽해요!","完璧！"),
      text:L("Pour revenir au placement des personnes, <b>touche encore « Barrer » ✕</b> pour l'éteindre.<br>(Pour enlever une croix : « Barrer » allumé, retouche la croix. La <b>gomme</b> efface aussi.)","To go back to placing people, <b>tap “Cross out” ✕ again</b> to turn it off.<br>(To remove a cross: with “Cross out” on, tap the cross again. The <b>eraser</b> also clears it.)","다시 사람을 배치하려면 <b>✕ 버튼을 한 번 더 눌러</b> 끄세요.<br>(✕를 없애려면: 버튼이 켜진 상태에서 그 칸을 다시 누르세요. <b>지우개</b>로도 지울 수 있어요.)","人物の配置に戻るには、<b>×ボタンをもう一度タップ</b>してオフにしよう。<br>（×を消すには、ボタンがオンのままもう一度そのマスをタップ。<b>消しゴム</b>でも消せます。）"),
      target:()=>$("#tX"),allow:e=>e.target.closest&&e.target.closest("#tX,#plan"),ready:()=>typeof tool!=="undefined"&&tool!=="x",waitTxt:L("Touche « Barrer » pour l'éteindre…","Tap “Cross out” to turn it off…","✕ 버튼을 눌러 끄세요…","×ボタンをタップしてオフに…")});
    s.push({title:L("À toi de jouer !","Your turn!","이제 직접 해 봐요!","やってみよう！"),dyn:true,
      text:()=>L(`Place ${nm(st.q)} toi-même :<br>1. <b>Touche son portrait</b>.<br>2. <b>Garde le doigt appuyé</b> sur la case qui brille (${posTxt(st.cell2)}) jusqu'à ce que le cercle soit plein.`,
        `Place ${nm(st.q)} yourself:<br>1. <b>Tap their portrait</b>.<br>2. <b>Press and hold</b> the glowing square (${posTxt(st.cell2)}) until the circle is full.`,
        `${nm(st.q)}${particle(pname(st.q),"을","를")} 직접 배치해 보세요:<br>1. <b>초상화를 누르세요</b>.<br>2. 빛나는 칸(${posTxt(st.cell2)})을 원이 찰 때까지 <b>꾹 누르세요</b>.`,
        `${nm(st.q)}を自分で配置しよう：<br>1. <b>肖像をタップ</b>。<br>2. 光るマス（${posTxt(st.cell2)}）を、円がいっぱいになるまで<b>長押し</b>。`)+demo,
      target:()=>S.sel===st.q?null:chip(st.q),cell:"q",hold:"q",allow:e=>(e.target.closest&&e.target.closest(`[data-p="${st.q}"]`))||(S.sel===st.q&&onCell(e,st.cell2)),
      ready:()=>placedAt(st.q,st.cell2),waitTxt:L("Touche le portrait, puis garde le doigt appuyé…","Tap the portrait, then press and hold…","초상화를 누른 뒤 꾹 누르세요…","肖像をタップしてから長押し…")});
    s.push({title:L("Bloqué ? Demande un indice","Stuck? Ask for a hint","막혔나요? 힌트를 받아요","困ったらヒント"),
      text:L("Si tu ne sais plus quoi faire, le bouton <b>Indice</b> 💡 te montre où regarder, puis le raisonnement, puis la bonne case. Chaque indice ajoute un peu de temps.","If you're stuck, the <b>Hint</b> 💡 button shows you where to look, then the reasoning, then the right square. Each hint adds a little time.","막히면 <b>힌트</b> 💡 버튼이 볼 곳, 추론, 정답 칸을 차례로 알려 줘요. 힌트를 쓸 때마다 시간이 조금 늘어나요.","わからなくなったら、<b>ヒント</b> 💡 ボタンが、見るべき人、推理、正しいマスの順に教えてくれます。ヒントを使うたびに少し時間が加算されます。"),
      target:()=>$("#tHint"),btn:L("Suivant","Next","다음","次へ")});
    s.push({title:L("Trouver le coupable","Find the culprit","범인 찾기","犯人を見つけよう"),
      text:L("Place tout le monde de la même façon. Quand c'est fait, appuie sur <b>Valider</b> : tu désigneras le coupable, la seule personne restée <b>seule avec la victime</b> dans sa pièce.<br>Bonne enquête ! 🔎","Place everyone the same way. When you're done, press <b>Check</b>: you'll point to the culprit, the only person left <b>alone with the victim</b> in their room.<br>Happy sleuthing! 🔎","모두 같은 방법으로 배치하세요. 다 되면 <b>확인</b>을 눌러 범인을 지목해요. 범인은 방에서 <b>피해자와 단둘이</b> 있던 유일한 사람이에요.<br>즐거운 추리 되세요! 🔎","同じやり方で全員を配置しよう。終わったら<b>チェック</b>を押して犯人を指さします。犯人は、部屋で<b>被害者と二人きり</b>だった、ただ一人の人物です。<br>がんばって！🔎"),
      target:()=>$("#tValid"),btn:L("Terminer","Finish","끝내기","終わる")});
    return {steps:s,a};
  }
  function placedAt(p,c){const v=S.place&&S.place[p];return !!v&&v[0]===c[0]&&v[1]===c[1]}
  function onCell(e,c){if(!(e.target.closest&&e.target.closest("#plan")))return false;if(e.type!=="pointerdown")return true;const k=cellFromPoint(e.clientX,e.clientY);return !!k&&k[0]===c[0]&&k[1]===c[1]}

  /* ---------- UI ---------- */
  function ensureBox(){if(box)return box;box=document.createElement("div");box.id="coach";box.hidden=true;document.body.appendChild(box);
    box.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;e.stopPropagation();if(t.classList.contains("co-go"))next();else if(t.classList.contains("co-skip"))finish()});return box}
  const val=v=>typeof v==="function"?v():v;
  function paint(){if(!st)return;const s=st.steps[st.i];const b=ensureBox();
    b.innerHTML=`<span class="co-n">${L("Tutoriel","Tutorial","튜토리얼","チュートリアル")} · ${st.i+1}/${st.steps.length}</span><h3>${val(s.title)}</h3><p>${val(s.text)}</p><span class="co-warn">${st.warn||""}</span>
      <div class="co-acts">${s.btn?`<button class="co-go">${val(s.btn)}</button>`:`<span class="co-wait"><i></i>${val(s.waitTxt)||""}</span>`}${st.mandatory?"":`<button class="co-skip">${L("Passer le tutoriel","Skip the tutorial","튜토리얼 건너뛰기","チュートリアルをスキップ")}</button>`}</div>`;
    b.hidden=false;highlight();place()}
  function curCell(){const s=st&&st.steps[st.i];if(!s||!s.cell)return null;if(s.cell==="q")return S.sel===st.q?st.cell2:null;return s.cell}
  function highlight(){document.querySelectorAll(".coach-hl").forEach(x=>x.classList.remove("coach-hl"));document.querySelectorAll(".coach-cell").forEach(x=>x.classList.remove("coach-cell"));
    if(!st)return;const s=st.steps[st.i];const t=s.target&&s.target();if(t)t.classList.add("coach-hl");
    const c=curCell();if(c){const m=document.querySelector(`#marks .mk[data-r="${c[0]}"][data-c="${c[1]}"]`);if(m)m.classList.add("coach-cell")}}
  function focusEl(){const s=st.steps[st.i];const c=curCell();if(c)return document.querySelector(`#marks .mk[data-r="${c[0]}"][data-c="${c[1]}"]`)||$("#plan");return s.target&&s.target()}
  function place(){if(!box||box.hidden)return;const el=focusEl();let top=true;
    if(el){const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)el.scrollIntoView({block:"center",behavior:"smooth"});const mid=(r.top+r.bottom)/2;top=mid>innerHeight*.5}
    else top=false;
    if(!el){box.style.top="50%";box.style.bottom="auto";box.style.transform="translate(-50%,-50%)";return}
    box.style.transform="";if(top){box.style.top="max(10px,env(safe-area-inset-top,0px))";box.style.bottom="auto"}else{box.style.bottom="max(10px,env(safe-area-inset-bottom,0px))";box.style.top="auto"}}

  /* ---------- flow ---------- */
  function next(){if(!st)return;st.warn="";st.i++;
    if(st.i>=st.steps.length){finish();return}
    const s=st.steps[st.i];
    if(s.dyn){const known={};const b=firstDeduction(known);if(!b||b.p===st.a.p){finish();return}st.q=b.p;st.cell2=b.cell}
    if(st.i===5)st.xs0=Object.keys(S.xs||{}).length;
    try{play("page")}catch(_){}paint()}
  function finish(){const was=st;st=null;clearInterval(tick);tick=null;if(box)box.hidden=true;highlight();try{endTuto()}catch(_){try{localStorage.setItem(K,"done")}catch(__){}}
    if(was&&was.mandatory)toast(L("À toi de jouer ! Tu peux revoir le tutoriel dans le menu ☰.","Your turn! You can replay the tutorial from the ☰ menu.","이제 직접 해 보세요! 튜토리얼은 ☰ 메뉴에서 다시 볼 수 있어요.","さあ、やってみよう！チュートリアルは☰メニューからもう一度見られます。"))}
  function start(mandatory,now){if(st)return;if(busy()||!now&&!pending){pending=mandatory?2:1;return}
    const b=build();if(!b){try{endTuto()}catch(_){}return}
    if(S.sel!=null){S.sel=null;try{tool=null}catch(_){}render()}
    st={steps:b.steps,i:0,mandatory,a:b.a,warn:"",xs0:0};pending=0;paint();
    clearInterval(tick);tick=setInterval(()=>{if(!st)return;
      if(busy()){if(!st.paused){st.paused=true;if(box)box.hidden=true}return}
      if(st.paused){st.paused=false;paint()}
      const s=st.steps[st.i];
      if(s.ready&&s.ready()){next();return}
      highlight();place()},250)}
  /* waits for intro popups to close, then starts */
  let idle=0;setInterval(()=>{if(!pending||st){idle=0;return}if(busy()){idle=0;return}if(++idle>=4)start(pending===2,true)},400);

  /* block everything that isn't the expected gesture */
  const gate=e=>{if(!st||st.paused)return;if(box&&box.contains(e.target))return;const s=st.steps[st.i];
    if(s.btn||!s.allow||!s.allow(e)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      if(e.type==="pointerdown"&&s.hold!=null&&e.target.closest&&e.target.closest("#plan")){st.warn=L("Pas cette case : utilise celle qui brille ✨","Not that square: use the glowing one ✨","그 칸이 아니에요: 빛나는 칸을 쓰세요 ✨","そのマスじゃないよ：光っているマスを使おう ✨");paint()}}};
  ["pointerdown","click","mousedown","touchstart"].forEach(t=>document.addEventListener(t,gate,{capture:true,passive:false}));
  /* quick tap instead of a long press: remove the pencil note and explain */
  document.addEventListener("pointerup",e=>{if(!st)return;const s=st.steps[st.i];if(s.hold==null)return;const p=s.hold==="q"?st.q:s.hold,c=s.hold==="q"?st.cell2:s.cell;
    setTimeout(()=>{if(!st)return;const k=c[0]+","+c[1],a=S.notes&&S.notes[k];if(a&&a.includes(p)&&!placedAt(p,c)){a.splice(a.indexOf(p),1);if(!a.length)delete S.notes[k];save();render();
      st.warn=L("Trop rapide ! Ne lève pas ton doigt tout de suite : <b>garde-le appuyé</b> jusqu'à ce que le cercle soit plein (environ une seconde).","Too quick! Don't lift your finger right away: <b>keep it pressed</b> until the circle is full (about a second).","너무 빨라요! 손가락을 바로 떼지 말고 원이 찰 때까지 <b>계속 누르세요</b>(약 1초).","はやすぎ！すぐに指を離さないで、円がいっぱいになるまで<b>押し続けよう</b>（約1秒）。");try{play("forbid")}catch(_){}paint()}},40)},true);
  const _r=render;render=function(){const r=_r.apply(this,arguments);try{if(st)highlight()}catch(_){}return r};
  addEventListener("resize",()=>{try{if(st)place()}catch(_){}});

  /* the old overlay tutorial is replaced */
  tuto=function(){const mandatory=!done();pending=mandatory?2:1};
  window.coachActive=()=>!!st;
})();
