/* ================= replay a solved case, just for fun: the recorded score never changes ================= */
(function(){
  const special=()=>(typeof RUSH!=="undefined"&&RUSH.on)||(typeof NIGHT!=="undefined"&&NIGHT.on)||(typeof LIAR!=="undefined"&&LIAR.on)||
    (typeof DAILY!=="undefined"&&DAILY.on)||(typeof COOP!=="undefined"&&COOP.play)||/^dy/.test(C&&C.id||"");
  const canReplay=()=>!!(S&&S.solved&&!special());
  const msg=()=>L("Partie rejouée pour le plaisir : ton score enregistré ne change pas.","Replayed just for fun: your recorded score doesn't change.","재미로 다시 하는 게임이에요. 기록된 점수는 바뀌지 않아요.","楽しむためのリプレイです。記録されたスコアは変わりません。");
  function replay(){if(!canReplay())return;S=fresh();S.hlog=[];S.replay=true;hist=[];tool=null;save();
    try{renderStatic()}catch(_){}try{renderBoard()}catch(_){}render();try{renderTimer()}catch(_){}try{play("select")}catch(_){}toast("🔄 "+msg())}
  window.replayCase=replay;
  /* a replay keeps the level counted as solved */
  const _ls=lvlSolved;lvlSolved=function(i){if(_ls(i))return true;try{return !!(JSON.parse(localStorage.getItem("crimes-mignons-wiz:"+DATA[i].id)||"{}").replay)}catch(e){return false}};
  /* a replay never touches the recorded score (nor shards, nor rankings) */
  const _rw=recordWin;recordWin=function(){if(S&&S.replay){const best=ACC.profile&&ACC.profile.progress&&ACC.profile.progress[C.id];
      const cur={solved:true,hints:S.hints||0,time:Math.round(S.time||0),attempts:Math.max(1,S.attempts||1),at:Date.now()};return {cur,best:best||cur,improved:false}}
    return _rw.apply(this,arguments)};
  /* the Check button becomes "Replay" on a solved case */
  function fixBtn(){try{const V=$("#tValid");if(V){const on=canReplay();V.classList.toggle("rp-on",on);
      if(on){const l=V.querySelector(".g3-lb");if(l)l.textContent=L("Rejouer","Replay","다시 하기","もう一度");const s=V.querySelector(".g3-sub");if(s)s.remove();V.classList.remove("g3-off")}}}catch(_){}}
  const _r=render;render=function(){const out=_r.apply(this,arguments);fixBtn();return out};
  const _rs=renderStatic;renderStatic=function(){const out=_rs.apply(this,arguments);fixBtn();return out};
  document.addEventListener("click",()=>setTimeout(fixBtn,0));
  document.addEventListener("click",e=>{const V=e.target.closest&&e.target.closest("#tValid");if(!V||!canReplay())return;e.preventDefault();e.stopPropagation();replay()},true);
  /* end-of-case popup: a replay says so, and offers to replay */
  const _sr=showReveal;showReveal=function(){const was=S&&S.replay;const out=_sr.apply(this,arguments);setTimeout(fixBtn,50);try{if(special())return out;const box=document.querySelector("#reveal .box");if(!box)return out;
      if(was){const st=box.querySelector(".rv-stats");const n=document.createElement("p");n.className="rp-note";n.textContent="🔄 "+msg();if(st)st.after(n);else box.appendChild(n)}
      const acts=box.querySelector(".acts");if(acts&&!box.querySelector(".rp-link")){const b=document.createElement("button");b.className="rp-link";b.textContent="🔄 "+L("Rejouer cette enquête","Replay this case","이 사건 다시 하기","この事件をもう一度");
        b.onclick=()=>{$("#reveal").hidden=true;replay()};acts.after(b)}}catch(_){}return out};
  const st=document.createElement("style");st.textContent=`body.g3 #tValid.rp-on{background:linear-gradient(#5b3a74,#3a1f3d)!important;color:#fbefc8!important}
.rp-note{margin:8px 0 0;padding:8px 10px;border-radius:10px;background:rgba(91,58,116,.1);color:#4a2f5a;font:600 13px/1.35 var(--f-simple,system-ui)!important;text-align:center}
.rp-link{display:block;margin:10px auto 0;min-height:44px;padding:0 14px;border:0;background:none;color:#6b1530;font:700 14.5px var(--f-simple,system-ui)!important;text-decoration:underline;text-underline-offset:3px;cursor:pointer}`;document.head.appendChild(st);
})();
