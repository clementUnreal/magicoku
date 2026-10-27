/* ================= anti-bot check: how a case was played (silent; read by the admin inspector) =================
   An AI agent driving the browser clicks without moving the mouse (no move, or one single jump to the target), often right in the middle of the target,
   never crosses out nor corrects, keeps a mechanical rhythm, and its side panel shrinks the page. */
(function(){
  let T=null,lastMove=0,moves=0,lastW=innerWidth,lastH=innerHeight;
  const inGame=()=>{const h=$("#home");return !!(h&&h.hidden&&S&&!S.solved)};
  function fresh(){T={t0:Date.now(),n:0,mouse:0,tele:0,cen:0,ut:0,rs:0,u:0,pl:[],hid:0,hs:0,hAt:0}}
  const _oc=openCase;openCase=function(){const r=_oc.apply(this,arguments);fresh();return r};
  document.addEventListener("pointermove",e=>{if(e.pointerType==="mouse"){lastMove=performance.now();moves++}},{passive:true,capture:true});
  document.addEventListener("pointerdown",e=>{if(!T||!inGame())return;const tg=e.target.closest&&e.target.closest("#marks .mk,#plan,.card,.tb,.recit .kw,.recit .sn");if(!tg)return;
    T.n++;if(!e.isTrusted)T.ut++;
    if(e.pointerType==="mouse"){T.mouse++;if(moves<3)T.tele++;moves=0;
      const r=tg.getBoundingClientRect();if(r.width>8&&r.height>8){const dx=Math.abs(e.clientX-(r.left+r.width/2))/r.width,dy=Math.abs(e.clientY-(r.top+r.height/2))/r.height;if(dx<.04&&dy<.04)T.cen++}}
    if(tg.id==="tUndo"||tg.id==="tErase")T.u++},{capture:true});
  addEventListener("resize",()=>{if(T&&inGame()&&Math.abs(innerWidth-lastW)>=80&&Math.abs(innerHeight-lastH)<40)T.rs++;lastW=innerWidth;lastH=innerHeight});
  document.addEventListener("visibilitychange",()=>{if(!T||!inGame())return;if(document.hidden){T.hid++;T.hAt=Date.now()}else if(T.hAt){T.hs+=Date.now()-T.hAt;T.hAt=0}});
  const _pp=placePerson;placePerson=function(){const r=_pp.apply(this,arguments);if(T&&inGame())T.pl.push(Date.now());return r};
  window.botSummary=function(){if(!T)return null;const pl=T.pl,iv=[];for(let i=1;i<pl.length;i++)iv.push(pl[i]-pl[i-1]);
    const mean=iv.length?iv.reduce((a,b)=>a+b,0)/iv.length:0,sd=iv.length?Math.sqrt(iv.reduce((a,b)=>a+(b-mean)**2,0)/iv.length):0;
    return {d:T.mouse>T.n/2?"m":"t",n:T.n,tp:T.mouse?Math.round(100*T.tele/T.mouse):0,cc:T.mouse?Math.round(100*T.cen/T.mouse):0,ut:T.ut,wd:navigator.webdriver?1:0,rs:T.rs,
      x:Object.keys((S&&S.xs)||{}).length,u:T.u,np:pl.length,cv:mean?Math.round(100*sd/mean):-1,f:pl.length?Math.round((pl[0]-T.t0)/1000):-1,
      wall:Math.round((Date.now()-T.t0)/1000),hid:T.hid,hs:Math.round(T.hs/1000)}};
  /* attach the summary to the recorded result (first solve only: a replay records nothing) */
  const _rw=recordWin;recordWin=function(){const tel=!(S&&S.replay)?botSummary():null;const xs=tel?tel.x:0;const out=_rw.apply(this,arguments);
    try{const pr=ACC.profile&&ACC.profile.progress&&ACC.profile.progress[C.id];if(tel&&pr&&out&&out.improved){pr.tel=tel;try{localStorage.setItem(LKEY,JSON.stringify(ACC.profile))}catch(_){}syncRank()}}catch(_){}return out};
  /* crosses are removed from S at the end of some cases: count them as they are placed */
  const _r=render;render=function(){const out=_r.apply(this,arguments);try{if(T&&inGame()){const n=Object.keys(S.xs||{}).length;T.xmax=Math.max(T.xmax||0,n)}}catch(_){}return out};
  const _bs=window.botSummary;window.botSummary=function(){const s=_bs();if(s&&T)s.x=Math.max(s.x,T.xmax||0);return s};
})();
