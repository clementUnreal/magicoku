
/* ================= horizontal rows: drag with the mouse, swipe with the finger, wheel scrolls sideways ================= */
(function(){
  const css=document.createElement("style");
  css.textContent=`.hscroll{overflow-x:auto!important;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y;overscroll-behavior-x:contain;cursor:grab}
.hscroll.dragging{cursor:grabbing;user-select:none;scroll-behavior:auto}
.hscroll.dragging *{pointer-events:none}`;
  document.head.appendChild(css);
  const scrollsX=el=>{if(!(el instanceof Element))return false;const o=getComputedStyle(el).overflowX;return (o==="auto"||o==="scroll")&&el.scrollWidth>el.clientWidth+2};
  const rowOf=t=>{for(let el=t;el&&el!==document.body;el=el.parentElement)if(scrollsX(el))return el;return null};
  /* mouse drag (touch already scrolls natively) */
  let drag=null;
  document.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.button!==0)return;const r=rowOf(e.target);if(!r)return;
    r.classList.add("hscroll");drag={r,x:e.clientX,s:r.scrollLeft,moved:false}},true);
  document.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.x;
    if(!drag.moved&&Math.abs(dx)>5){drag.moved=true;drag.r.classList.add("dragging")}
    if(drag.moved){drag.r.scrollLeft=drag.s-dx;e.preventDefault()}},true);
  const end=()=>{if(!drag)return;const d=drag;drag=null;if(d.moved){d.r.classList.remove("dragging");
      /* swallow the click that follows a drag so no chip gets selected by accident */
      const stop=ev=>{ev.stopPropagation();ev.preventDefault()};document.addEventListener("click",stop,{capture:true,once:true});setTimeout(()=>document.removeEventListener("click",stop,true),50)}};
  document.addEventListener("pointerup",end,true);document.addEventListener("pointercancel",end,true);
  /* vertical mouse wheel scrolls a horizontal row sideways */
  document.addEventListener("wheel",e=>{if(e.ctrlKey||Math.abs(e.deltaY)<=Math.abs(e.deltaX))return;const r=rowOf(e.target);if(!r)return;
    const max=r.scrollWidth-r.clientWidth;if((e.deltaY<0&&r.scrollLeft<=0)||(e.deltaY>0&&r.scrollLeft>=max-1))return;
    r.scrollLeft+=e.deltaY;e.preventDefault()},{passive:false,capture:true});
  /* mark rows so the cursor shows they can be dragged */
  const mark=()=>document.querySelectorAll(".sh-tabs,.lvside,.rk-tabs,.rk-lvs,.chips,.h2-grid,.lvgrid").forEach(el=>el.classList.toggle("hscroll",scrollsX(el)));
  new MutationObserver(()=>{clearTimeout(mark.t);mark.t=setTimeout(mark,120)}).observe(document.body,{childList:true,subtree:true});
  window.addEventListener("resize",mark);setTimeout(mark,800);
})();
