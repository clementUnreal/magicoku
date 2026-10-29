/* ================= play screen, phone held upright: the map stays locked at the top, only the testimonies scroll =================
   + room names never wider than their room, notes kept inside their square, markers made small on squares with an object */
(function(){
  const st=document.createElement("style");st.textContent=`
html body.g3:not(.g3l){height:100dvh;overflow:hidden!important}
html:has(body.g3:not(.g3l)){overflow:hidden!important;height:100%}
html body.g3:not(.g3l) .wrap{padding-bottom:0!important}
html body.g3:not(.g3l) .wrap{height:100dvh!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;box-sizing:border-box}
html body.g3:not(.g3l) #g3Bar{flex:none}
html body.g3:not(.g3l) .game{flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}
html body.g3:not(.g3l) .game>.center,html body.g3:not(.g3l) .game>.tools{flex:none!important}
html body.g3:not(.g3l) .game>.suspects{flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;margin-bottom:0!important}
html body.g3:not(.g3l) #cards{flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important}
html body.g3:not(.g3l) #cards .chips{flex:none!important}
html body.g3:not(.g3l) #cards .recit{flex:1 1 auto!important;min-height:80px!important;max-height:none!important;overflow-y:auto!important;overscroll-behavior:contain}
#board .rlabel{overflow:hidden;white-space:normal!important;line-height:1.05!important;text-align:center;box-sizing:border-box;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;padding-top:1px!important;padding-bottom:1px!important;word-break:normal;overflow-wrap:normal;text-overflow:ellipsis}
#board .rlabel.rc{background:var(--rc)!important;border-color:var(--rcd)!important;color:#1f1428!important}
#plan .rtint{position:absolute;inset:0;display:grid;z-index:1;pointer-events:none}
#plan .rtint i{display:block}
#rbub{position:fixed;z-index:50;transform:translate(-50%,-100%);padding:5px 10px;border-radius:999px;background:var(--rc,#fffaf0);border:2px solid #4a3550;color:#1f1428;font:800 13px var(--f-simple,system-ui);white-space:nowrap;pointer-events:none;box-shadow:0 4px 12px #0006;animation:rbub .15s ease-out}
@keyframes rbub{from{opacity:0;transform:translate(-50%,-80%)}}
#board .plan .notes{inset:auto auto 4% 4%!important;max-width:92%;align-content:flex-end;overflow:hidden}
#board .plan .notes span{font-size:clamp(8px,calc(93.6cqw * 22 / var(--wn)),16px)!important;-webkit-text-stroke:2.5px #fff!important}
#marks .mk.obj .xm{transform:scale(.55);transform-origin:100% 0%;opacity:.88}
#marks .mk.obj .xm svg{opacity:.9}
html body.g3 #tHint.nohint small{display:none!important}`;document.head.appendChild(st);
  /* every room gets its own colour: a light tint on its floor and the same colour on its name tag */
  const PAL=["#ffd27a","#9fd3ff","#ffa8c5","#b8f0a0","#d6b8ff","#ffb37a","#8ff0e0","#f5f09a","#c8c8ff","#ffc2a8","#a8ffcf","#e0b8a0"];
  function tint(){const plan=$("#plan"),g=$("#grid");if(!plan||!g||!C)return;let t=plan.querySelector(".rtint");if(t)t.remove();
    const R=C.rooms,ks=[...new Set(R.join("").split(""))].filter(k=>k!==".").sort(),col={};ks.forEach((k,i)=>col[k]=PAL[i%PAL.length]);
    t=document.createElement("div");t.className="rtint";t.style.cssText=g.style.cssText+";position:absolute";t.style.left=g.style.left;t.style.top=g.style.top;t.style.width=g.style.width;t.style.height=g.style.height;
    const gs=getComputedStyle(g);t.style.inset="";["left","top","width","height"].forEach(p=>t.style[p]=gs[p]);t.style.gridTemplateColumns=`repeat(${N},1fr)`;t.style.gridTemplateRows=`repeat(${N},1fr)`;
    let h="";for(let r=0;r<N;r++)for(let c=0;c<N;c++){const k=R[r][c];h+=k==="."?"<i></i>":`<i style="background:${col[k]};opacity:.26"></i>`}t.innerHTML=h;g.after(t);
    plan.querySelectorAll(".rlabel[data-room]").forEach(l=>{const c=col[l.dataset.room];if(!c)return;l.classList.add("rc");l.style.setProperty("--rc",c);l.style.setProperty("--rcd","#4a3550")})}
  const _rb=renderBoard;renderBoard=function(){const r=_rb.apply(this,arguments);try{tint()}catch(_){}return r};
  /* tap a square with nobody selected (and no tool): a bubble shows the room's full name */
  let bubT=null;
  document.addEventListener("pointerdown",e=>{const plan=$("#plan");if(!plan||!plan.contains(e.target)||!C)return;if(S&&S.sel!=null||tool)return;
    const cell=typeof cellFromPoint==="function"?cellFromPoint(e.clientX,e.clientY):null;if(!cell)return;const k=C.rooms[cell[0]][cell[1]];if(!k||k===".")return;
    let b=document.getElementById("rbub");if(!b){b=document.createElement("span");b.id="rbub";b.className="rbub";document.body.appendChild(b)}
    const lab=plan.querySelector(`.rlabel[data-room="${k}"]`);b.textContent=rname(k).replace(/^./,m=>m.toUpperCase());
    b.style.setProperty("--rc",lab?lab.style.getPropertyValue("--rc"):"#fffaf0");b.style.animation="none";void b.offsetWidth;b.style.animation="";
    const bd=($("#board")||plan).getBoundingClientRect(),bw=b.offsetWidth,bh=b.offsetHeight;
    b.style.left=Math.max(bd.left+bw/2+4,Math.min(bd.right-bw/2-4,e.clientX))+"px";b.style.top=Math.max(bd.top+bh+6,e.clientY-10)+"px";
    clearTimeout(bubT);bubT=setTimeout(()=>{const x=document.getElementById("rbub");if(x)x.remove()},1600)},true);
  /* a highlighted word switches off as soon as you tap anything else */
  document.addEventListener("pointerdown",e=>{if(typeof KWSEL==="undefined"||!KWSEL)return;if(e.target.closest&&e.target.closest(".recit .kw,.recit .sn"))return;KWSEL=null;try{kwApply()}catch(_){}},true);
  /* mark squares holding an object, so their cross / star is drawn small in the corner and the object stays visible */
  const _rm=renderMarks;renderMarks=function(){const r=_rm.apply(this,arguments);try{document.querySelectorAll("#marks .mk").forEach(el=>{const rr=+el.dataset.r,cc=+el.dataset.c;el.classList.toggle("obj",!!(OBJ&&OBJ[rr]&&OBJ[rr][cc]&&OBJ[rr][cc]!=="void"))})}catch(_){}return r};
})();
