
/* ================= the accusation: name the culprit before the verdict =================
   Pressing "Check" with everyone placed opens a "Who is the culprit?" sheet with all the suspects.
   The case is solved only if the grid is right AND the accused is the killer
   (the only person alone with the victim). A wrong accusation counts as a failed try. */
(function(){
  const css=document.createElement("style");
  css.textContent=`#accuse{z-index:95}
#accuse .acc-box{width:min(94vw,460px);max-height:92vh;overflow:auto;background:linear-gradient(#fff9ec,#f6e6c4);border:2px solid #c9a25a;border-radius:20px;padding:20px 16px 16px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.45);color:#3a1f3d;animation:accIn .35s cubic-bezier(.2,1.4,.4,1)}
@keyframes accIn{from{transform:scale(.86) translateY(14px);opacity:0}to{transform:none;opacity:1}}
#accuse h2{margin:2px 0 4px;font:900 clamp(22px,6vw,28px)/1.1 var(--f-display);color:#8e1f33}
#accuse .acc-sub{margin:0 0 14px;font:400 14px/1.45 var(--f-body);color:#5a4636}
#accuse .acc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:10px;margin-bottom:14px}
#accuse .acc-p{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 6px 8px;border-radius:14px;border:2px solid #e2cfa4;background:#fffaf0;cursor:pointer;font:700 14px var(--f-body);color:#3a1f3d;transition:transform .15s,border-color .15s,box-shadow .15s}
#accuse .acc-p:hover{transform:translateY(-2px);border-color:#c9a25a}
#accuse .acc-p .acc-ph{width:64px;height:64px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:#efe2c4;box-shadow:inset 0 0 0 2px #fff}
#accuse .acc-p .acc-ph img,#accuse .acc-p .acc-ph svg{width:100%;height:100%;object-fit:cover}
#accuse .acc-p.on{border-color:#a8323e;background:#fdecea;box-shadow:0 0 0 3px rgba(168,50,62,.25);transform:translateY(-2px) rotate(-1deg)}
#accuse .acc-p.on::after{content:"☝️";position:absolute;top:-10px;right:-6px;font-size:22px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.25))}
#accuse .acc-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
#accuse .acc-go{min-width:180px}
#accuse .acc-go:disabled{opacity:.45;filter:grayscale(.5);cursor:not-allowed}
#accuse .acc-msg{min-height:1.2em;margin:10px 0 0;font:700 14px var(--f-body);color:#a8323e}
#accuse.shake .acc-box{animation:accShake .45s}
@keyframes accShake{20%{transform:translateX(-9px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(4px)}}`;
  document.head.appendChild(css);
  const special=()=>(typeof RUSH!=="undefined"&&RUSH.on)||(typeof NIGHT!=="undefined"&&NIGHT.on)||(typeof LIAR!=="undefined"&&LIAR.on);
  let pick=null,busy=false;
  function sheet(go){let ov=$("#accuse");if(!ov){ov=document.createElement("div");ov.id="accuse";ov.className="modal";document.body.appendChild(ov)}
    const sus=[...M.people.keys()].filter(p=>p!==0).sort((a,b)=>pname(a).localeCompare(pname(b)));pick=null;
    ov.innerHTML=`<div class="acc-box" role="dialog" aria-modal="true" aria-labelledby="accT">
      <h2 id="accT">🔎 ${L("Qui est le coupable ?","Who is the culprit?","범인은 누구일까요?","犯人は誰だ？")}</h2>
      <p class="acc-sub">${L(`Désigne la personne qui a fait le coup. Rappel : le coupable est <b>la seule personne seule dans une pièce avec ${pname(0)}</b>.`,`Point to the person who did it. Remember: the culprit is <b>the only person alone in a room with ${pname(0)}</b>.`,`범인을 지목하세요. 기억하세요: 범인은 <b>${pname(0)}와(과) 단둘이 같은 방에 있던 사람</b>이에요.`,`犯人を指さそう。思い出して：犯人は<b>${pname(0)}と2人きりで同じ部屋にいた人</b>だ。`)}</p>
      <div class="acc-grid">${sus.map(p=>`<button class="acc-p" data-acc="${p}"><span class="acc-ph">${ava(p)}</span><span>${pname(p)}</span></button>`).join("")}</div>
      <div class="acc-acts"><button class="pill" id="accBack">${L("Revenir au plan","Back to the map","지도로 돌아가기","マップに戻る")}</button><button class="pill red acc-go" id="accGo" disabled>⚖️ ${L("Accuser","Accuse","고발하기","告発する")}</button></div>
      <p class="acc-msg" id="accMsg"></p></div>`;
    ov.hidden=false;
    ov.onclick=e=>{const t=e.target;
      if(t===ov||t.closest("#accBack")){ov.hidden=true;return}
      const b=t.closest(".acc-p");if(b){pick=+b.dataset.acc;ov.querySelectorAll(".acc-p").forEach(x=>x.classList.toggle("on",x===b));$("#accGo").disabled=false;$("#accMsg").textContent="";try{play("select")}catch(_){}return}
      if(t.closest("#accGo")&&pick!=null){ov.hidden=true;go(pick)}};
  }
  window.accuseSheet=sheet;
  function wrongAccusation(p){
    S.attempts=(S.attempts||0)+1;try{save()}catch(_){}try{renderTimer()}catch(_){}
    const msg=L(`${pname(p)} n'a rien à se reprocher… Qui était seul avec ${pname(0)} ?`,`${pname(p)} is innocent… Who was alone with ${pname(0)}?`,`${pname(p)}은(는) 결백해요… ${pname(0)}와(과) 단둘이 있던 사람은 누구일까요?`,`${pname(p)}は無実だ……${pname(0)}と2人きりだったのは誰？`);
    if(typeof runVerdict==="function")runVerdict(false,()=>toast(msg));else toast(msg)}
  const el=$("#tValid"),orig=el.onclick;
  el.onclick=function(e){
    if(busy||(typeof verdictBusy!=="undefined"&&verdictBusy))return;
    const all=Object.keys(S.place).length>=M.people.length;
    if(!all||S.solved||special())return orig.call(this,e);
    const self=this,gridOk=C.solution.every(([r,c],p)=>S.place[p]&&S.place[p][0]===r&&S.place[p][1]===c);
    sheet(p=>{
      if(!gridOk)return orig.call(self,e);           /* misplaced people: the usual "something's wrong" verdict */
      if(p===C.killer)return orig.call(self,e);      /* right grid + right culprit: case closed */
      wrongAccusation(p);
    });
  };
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){const ov=$("#accuse");if(ov&&!ov.hidden)ov.hidden=true}});
})();
