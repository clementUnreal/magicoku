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
#board .rlabel{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;box-sizing:border-box}
#board .plan .notes{inset:auto auto 4% 4%!important;max-width:92%;align-content:flex-end;overflow:hidden}
#board .plan .notes span{font-size:clamp(8px,calc(93.6cqw * 22 / var(--wn)),16px)!important;-webkit-text-stroke:2.5px #fff!important}
#marks .mk.obj .xm{transform:scale(.55);transform-origin:100% 0%;opacity:.88}
#marks .mk.obj .xm svg{opacity:.9}
html body.g3 #tHint.nohint small{display:none!important}`;document.head.appendChild(st);
  /* mark squares holding an object, so their cross / star is drawn small in the corner and the object stays visible */
  const _rm=renderMarks;renderMarks=function(){const r=_rm.apply(this,arguments);try{document.querySelectorAll("#marks .mk").forEach(el=>{const rr=+el.dataset.r,cc=+el.dataset.c;el.classList.toggle("obj",!!(OBJ&&OBJ[rr]&&OBJ[rr][cc]&&OBJ[rr][cc]!=="void"))})}catch(_){}return r};
})();
