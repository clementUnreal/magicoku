
/* ================= Story mode: timed mechanics — the train (station) and the frost (village) ================= */
(function(){
  const P=()=>M.people.length;
  /* ---------- budgets (seconds of active play) ---------- */
  const trainBudget=()=>120+50*N;
  const trainLeft=()=>trainBudget()-(S.time||0)-30*(S.hints||0);
  window.trainLeftSec=trainLeft;
  const frostStart=()=>90+15*N,frostEnd=()=>150+80*N;
  let order=null,orderId=null;
  function frostOrder(){if(orderId===C.id&&order)return order;const out=[];
    for(let k=0;k<Math.ceil(N/2);k++){const a=k,b=N-1-k,ring=[];
      if(a===b)ring.push([a,a]);else{for(let c=a;c<b;c++)ring.push([a,c]);for(let r=a;r<b;r++)ring.push([r,b]);for(let c=b;c>a;c--)ring.push([b,c]);for(let r=b;r>a;r--)ring.push([r,a])}
      out.push(...ring)}
    order=out;orderId=C.id;return out}
  const frostDt=()=>(frostEnd()-frostStart())/(N*N);
  function frozenCount(){const t=S.time||0;if(t<frostStart())return 0;return Math.min(N*N,Math.floor((t-frostStart())/frostDt())+1)}
  function frozenSet(){const n=frozenCount(),o=frostOrder(),s=new Set();for(let i=0;i<n;i++)s.add(o[i]+"");return s}
  function isFrozen(r,c){return mechOf()==="frost"&&!S.solved&&frozenSet().has(r+","+c)}
  /* ---------- lose overlay ---------- */
  function lose(kind){if(S.lost)return;S.lost=kind;save();try{play("forbid")}catch(_){}showLose()}
  function showLose(){let m=$("#mechLose");if(!m){m=document.createElement("div");m.id="mechLose";m.className="modal mlose";document.body.appendChild(m);
      m.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
        if(b.dataset.a==="retry"){m.hidden=true;const keepH=0;S=fresh();S.hlog=[];hist=[];save();render();renderBoard();try{renderTimer()}catch(_){}}
        else if(b.dataset.a==="home"){m.hidden=true;$("#home").hidden=false;try{show("pLevels")}catch(_){}}})}
    const train=S.lost==="train";
    m.innerHTML=`<div class="mbox mlbox ${train?"ml-train":"ml-frost"}"><div class="mlic">${train?"🚂💨":"❄️"}</div>
      <h2>${train?L("Le train est parti sans toi !","The train left without you!","기차가 너 없이 떠났어요!","汽車は君を置いて行ってしまった！"):L("Givrelune est pris par les glaces !","Givrelune is frozen solid!","지브르륀이 꽁꽁 얼어붙었어요!","ジヴルリュヌが凍りついた！")}</h2>
      <p>${train?L("Le Brumeval Express n'attend personne. Reprends l'enquête depuis le début et sois plus rapide !","The Brumeval Express waits for no one. Start the case again and be quicker!","브뤼므발 특급은 아무도 기다려 주지 않아요. 처음부터 다시 조사해서 더 빨리 풀어 보세요!","ブリュムヴァル急行は誰も待ってくれない。最初から捜査し直して、もっと速く解こう！")
        :L("Le froid a gelé une case importante avant que tout le monde soit à sa place. Une fois gelée, une case ne peut plus changer.","The cold froze an important square before everyone was in place. Once frozen, a square can no longer change.","모두가 제자리에 가기 전에 추위가 중요한 칸을 얼려 버렸어요. 한번 얼어붙은 칸은 바꿀 수 없어요.","全員が正しい位置につく前に、寒さが大事なマスを凍らせてしまった。凍ったマスはもう変えられない。")}</p>
      <div class="acts"><button class="pill" data-a="home">${L("Choisir un niveau","Choose a level","레벨 선택","レベルを選ぶ")}</button><button class="pill red" data-a="retry">${L("Réessayer","Try again","다시 하기","もう一度")}</button></div></div>`;
    m.hidden=false}
  /* ---------- banner above the board ---------- */
  function banner(){let b=$("#mechBar");const bd=$("#board"),m=mechOf();
    if(!bd||(m!=="train"&&m!=="frost")){if(b)b.remove();return}
    if(!b){b=document.createElement("div");b.id="mechBar";bd.parentNode.insertBefore(b,bd)}
    if(m==="train"){const left=trainLeft(),pct=Math.max(0,Math.min(100,100*left/trainBudget()));
      b.className="mbar mb-train"+(S.solved?" ok":left<=60?" hot":"");
      b.innerHTML=S.solved?`<span class="mbi">🚂</span><span>${L(`Train attrapé avec <b>${fmtT(Math.max(0,left))}</b> d'avance !`,`Train caught with <b>${fmtT(Math.max(0,left))}</b> to spare!`,`<b>${fmtT(Math.max(0,left))}</b> 남기고 기차를 탔어요!`,`<b>${fmtT(Math.max(0,left))}</b>残して汽車に間に合った！`)}</span>`
        :`<span class="mbi">🚂</span><div class="mbt"><span>${L("Le Brumeval Express part dans","The Brumeval Express leaves in","브뤼므발 특급 출발까지","ブリュムヴァル急行の発車まで")} <b class="mbclock">${fmtT(Math.max(0,left))}</b></span><div class="mbg"><i style="width:${pct}%"></i></div><small>${L("Chaque indice coûte 30 secondes.","Each hint costs 30 seconds.","힌트 하나에 30초가 줄어요.","ヒント1回で30秒減ります。")}</small></div>`}
    else{const n=frozenCount(),tot=N*N,t=S.time||0,next=n>=tot?0:frostStart()+n*frostDt()-t;
      b.className="mbar mb-frost"+(S.solved?" ok":n>0?" cold":"");
      b.innerHTML=S.solved?`<span class="mbi">🔥</span><span>${L("Tout le monde est au chaud : enquête résolue avant le grand gel !","Everyone is warm: case solved before the big freeze!","모두 따뜻해요. 대한파 전에 사건을 해결했어요!","みんなぬくぬく。大寒波の前に事件解決！")}</span>`
        :`<span class="mbi">❄️</span><div class="mbt"><span>${n?L(`<b>${n}</b> ${n>1?"cases gelées":"case gelée"} sur ${tot}. Prochaine dans <b class="mbclock">${fmtT(next)}</b>`,`<b>${n}</b> of ${tot} squares frozen. Next in <b class="mbclock">${fmtT(next)}</b>`,`${tot}칸 중 <b>${n}</b>칸이 얼었어요. 다음까지 <b class="mbclock">${fmtT(next)}</b>`,`${tot}マス中<b>${n}</b>マスが凍結。次まで<b class="mbclock">${fmtT(next)}</b>`)
          :L(`Le froid arrive dans <b class="mbclock">${fmtT(frostStart()-t)}</b> : il gèlera les cases du bord vers le centre.`,`The cold arrives in <b class="mbclock">${fmtT(frostStart()-t)}</b>: it will freeze squares from the edge to the centre.`,`<b class="mbclock">${fmtT(frostStart()-t)}</b> 뒤에 추위가 와요. 가장자리부터 가운데로 칸이 얼어요.`,`<b class="mbclock">${fmtT(frostStart()-t)}</b>後に寒さが来る。外側から中心へマスが凍っていく。`)}</span>
          <small>${L("Une case gelée ne change plus : si quelqu'un y manque ou s'y trompe, c'est perdu.","A frozen square can't change any more: if someone is missing or wrong there, you lose.","얼어붙은 칸은 더 이상 바뀌지 않아요. 그 칸에 있어야 할 사람이 없거나 틀리면 실패예요.","凍ったマスはもう変わらない。いるべき人がいない、または間違っていたら失敗。")}</small></div>`}}
  function paintFrost(){document.querySelectorAll("#marks .mk.frz,#marks .mk.frzw").forEach(e=>e.classList.remove("frz","frzw"));
    if(mechOf()!=="frost"||S.solved)return;const fs=frozenSet(),n=fs.size,o=frostOrder(),t=S.time||0;
    fs.forEach(k=>{const [r,c]=k.split(",");const el=document.querySelector(`#marks .mk[data-r="${r}"][data-c="${c}"]`);if(el)el.classList.add("frz")});
    const nx=o[n];if(nx&&frostStart()+n*frostDt()-t<=8){const el=document.querySelector(`#marks .mk[data-r="${nx[0]}"][data-c="${nx[1]}"]`);if(el)el.classList.add("frzw")}}
  function check(){if(!S||S.solved||S.lost||!$("#home").hidden)return;const m=mechOf();
    if(m==="train"&&trainLeft()<=0)lose("train");
    if(m==="frost"){const fs=frozenSet();if(!fs.size)return;
      for(let p=0;p<P();p++){const [r,c]=C.solution[p],k=r+","+c,pl=S.place[p];if(fs.has(k)&&!(pl&&pl[0]===r&&pl[1]===c)){lose("frost");return}}
      for(const p in S.place){const [r,c]=S.place[p],[sr,sc]=C.solution[p];if(fs.has(r+","+c)&&(r!==sr||c!==sc)){lose("frost");return}}}}
  /* frozen squares can't be changed */
  const nope=()=>{try{play("forbid")}catch(_){}toast(L("Cette case est gelée : plus rien n'y bouge.","This square is frozen: nothing moves there any more.","이 칸은 얼어붙었어요. 더 이상 바꿀 수 없어요.","このマスは凍っている。もう何も動かせない。"))};
  const _pp=placePerson;placePerson=function(p,r,c){if(isFrozen(r,c)||(S.place[p]&&isFrozen(...S.place[p]))){nope();return}return _pp.apply(this,arguments)};
  const _rp=removePerson;removePerson=function(p){if(S.place[p]&&isFrozen(...S.place[p])){nope();return}return _rp.apply(this,arguments)};
  if(typeof eraseCell==="function"){const _ec=eraseCell;eraseCell=function(r,c){if(isFrozen(r,c)&&whoAt(r,c)!=null){nope();return false}return _ec.apply(this,arguments)}}
  /* hooks */
  const _r=render;render=function(){_r.apply(this,arguments);banner();paintFrost()};
  const _rm=renderMarks;renderMarks=function(){_rm.apply(this,arguments);paintFrost()};
  const _oc=openCase;openCase=function(){const r=_oc.apply(this,arguments);const m=$("#mechLose");if(m)m.hidden=true;
    if(S&&S.lost&&!S.solved&&mechOf())setTimeout(showLose,300);return r};
  let lastN=-1,warned=0;
  setInterval(()=>{if(!S||!C||!$("#home").hidden)return;const m=mechOf();if(m!=="train"&&m!=="frost")return;
    banner();if(m==="frost"){const n=frozenCount();if(n!==lastN){lastN=n;paintFrost();if(n>0&&!S.solved)try{bloop(2400,0,.08,.6,.05)}catch(_){}}else paintFrost()}
    if(m==="train"&&!S.solved){const l=trainLeft();if((l===60||l===10)&&warned!==l){warned=l;try{bell(N_.E5,0,.5,.08);bell(N_.C5,.25,.7,.08)}catch(_){}}}
    check()},1000);
})();
