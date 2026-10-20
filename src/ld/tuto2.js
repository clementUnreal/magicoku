
/* ================= clearer "press and hold to place" teaching ================= */
(function(){
  const HOLD={
    fr:["Placer : garde le doigt appuyé !","Touche le portrait d'un personnage, puis <b>garde le doigt appuyé</b> sur une case du plan (une demi-seconde) jusqu'à ce que le cercle se remplisse. Un simple toucher ne place personne : il écrit seulement une petite note.<br><b>À toi d'essayer :</b> maintiens ton doigt sur une case."],
    en:["To place: press and hold!","Tap a character's portrait, then <b>press and hold</b> a square on the map (half a second) until the circle fills up. A quick tap doesn't place anyone: it only writes a small note.<br><b>Your turn:</b> hold your finger on a square."],
    ko:["배치하기: 길게 누르세요!","인물의 초상화를 탭한 다음, 지도의 칸을 <b>길게 누르세요</b>(0.5초). 원이 다 채워지면 배치돼요. 짧게 탭하면 배치되지 않고 작은 메모만 적혀요.<br><b>직접 해 보세요:</b> 칸 하나를 길게 눌러 보세요."],
    ja:["配置するには：長押し！","人物の肖像をタップしてから、見取り図のマスを<b>長押し</b>（0.5秒）して、円がいっぱいになるまで待とう。短くタップしただけでは配置されず、小さなメモが書かれるだけです。<br><b>やってみよう：</b>マスを長押ししてみて。"]};
  const NOTE={fr:"Un <b>toucher rapide</b> sur une case écrit seulement la lettre du personnage en petit, comme une note au crayon : pratique pour noter les cases possibles. Pour vraiment le placer, il faut <b>garder le doigt appuyé</b>.",
    en:"A <b>quick tap</b> on a square only writes the character's letter in small, like a pencil note: handy for marking possible squares. To really place them, <b>press and hold</b>.",
    ko:"칸을 <b>짧게 탭하면</b> 인물의 머리글자만 작게 적혀요. 연필 메모처럼 가능한 칸을 표시할 때 편리해요. 정말로 배치하려면 <b>길게 누르세요</b>.",
    ja:"マスを<b>短くタップ</b>すると、人物の頭文字が小さくメモされるだけ。候補のマスに印をつけるのに便利です。本当に配置するには<b>長押し</b>しよう。"};
  const DEMO=`<span class="hdemo" aria-hidden="true"><span class="hcell"><span class="hring"></span><span class="hppl">🧙</span></span><span class="hfinger">👆</span></span>`;
  try{for(const l of ["fr","en","ko","ja"]){const st=TUTO[l];if(!st||!st[4])continue;st[4][0]="#plan";st[4][1]=HOLD[l][0];st[4][2]=DEMO+HOLD[l][1];if(st[5])st[5][2]=NOTE[l]}}catch(e){}
  /* step 4 is interactive: the map is usable and placing someone validates the step */
  let waiting=false;
  const _t=tuto;tuto=function(i){_t.apply(this,arguments);const ov=$("#tuto");waiting=i===4&&$("#home").hidden;
    ov.classList.toggle("pass",waiting);
    if(waiting&&innerWidth<=980){setTimeout(()=>{const pl=$("#plan");if(!pl||tStep!==4)return;pl.scrollIntoView({block:"start"});setTimeout(()=>{const r=pl.getBoundingClientRect(),hole=$("#tutoHole"),box=$("#tutoBox"),p=6;
      hole.style.cssText=`left:${r.left-p}px;top:${r.top-p}px;width:${r.width+2*p}px;height:${r.height+2*p}px`;const bw=Math.min(380,innerWidth-16);box.style.cssText=`left:${(innerWidth-bw)/2}px;top:auto;bottom:10px;width:${bw}px`},120)},420)}
    if(waiting&&S&&S.sel==null){const P=M.people.length;const free=[...Array(P).keys()].find(p=>!S.place[p]&&p!==0)??[...Array(P).keys()].find(p=>!S.place[p]);if(free!=null){S.sel=free;render()}}};
  const _e=endTuto;endTuto=function(){waiting=false;$("#tuto").classList.remove("pass");return _e.apply(this,arguments)};
  const _pp=placePerson;placePerson=function(p,r,c){const out=_pp.apply(this,arguments);try{localStorage.setItem("magicoku:placedOnce","1")}catch(e){}
    if(waiting){waiting=false;const x=$("#tutoX");if(x)x.insertAdjacentHTML("beforeend",`<span class="hbravo">✨ ${L("Bravo ! C'est exactement comme ça.","Well done! That's exactly it.","잘했어요! 바로 그렇게 하면 돼요.","すばらしい！まさにその調子。")}</span>`);setTimeout(()=>{if(tStep===4&&!$("#tuto").hidden)tuto(5)},1400)}
    return out};
  /* in-game nudge: quick taps that only write notes, by someone who never placed anyone */
  let taps=0,shown=0;
  const notes=()=>Object.values(S&&S.notes||{}).reduce((a,v)=>a+v.length,0);let before=0;
  document.addEventListener("pointerdown",e=>{if(e.target.closest&&e.target.closest("#plan"))before=notes()},true);
  document.addEventListener("pointerup",e=>{if(!(e.target.closest&&e.target.closest("#plan")))return;setTimeout(()=>{
    let placed=false;try{placed=!!localStorage.getItem("magicoku:placedOnce")}catch(_){}
    if(placed||S.sel==null||!$("#tuto").hidden)return;if(notes()>before){taps++;if(taps>=2&&shown<3){taps=0;shown++;
      toast(L(`Astuce : pour placer ${pname(S.sel)}, garde le doigt appuyé sur la case jusqu'à ce que le cercle se remplisse.`,`Tip: to place ${pname(S.sel)}, press and hold the square until the circle fills up.`,`팁: ${pname(S.sel)}${particle(pname(S.sel),"을","를")} 배치하려면 원이 채워질 때까지 칸을 길게 누르세요.`,`ヒント：${pname(S.sel)}を配置するには、円がいっぱいになるまでマスを長押ししよう。`))}}},30)},true);
  /* a reminder under the selected portrait */
  const _r=render;render=function(){_r.apply(this,arguments);let placed=false;try{placed=!!localStorage.getItem("magicoku:placedOnce")}catch(_){}
    let b=$("#holdHint");const bd=$("#board");if(!bd)return;
    if(placed||S.sel==null||S.place[S.sel]){if(b)b.remove();return}
    if(!b){b=document.createElement("div");b.id="holdHint";bd.parentNode.insertBefore(b,bd)}
    b.innerHTML=`${DEMO}<span>${L(`<b>Garde le doigt appuyé</b> sur une case pour placer ${pname(S.sel)}.`,`<b>Press and hold</b> a square to place ${pname(S.sel)}.`,`칸을 <b>길게 눌러</b> ${pname(S.sel)}${particle(pname(S.sel),"을","를")} 배치하세요.`,`マスを<b>長押し</b>して${pname(S.sel)}を配置しよう。`)}</span>`};
})();
