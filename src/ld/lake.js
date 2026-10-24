
/* ================= the lake: mirror clues (chapter 6) shown as water squares on the map =================
   Purely visual (people can still stand there, the puzzle is unchanged):
   reflection through the centre -> the centre squares are water; across a diagonal -> that diagonal is water. */
(function(){
  const WAVE="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath d='M4 12q4-4 8 0t8 0M20 28q4-4 8 0t8 0' fill='none' stroke='%23e9f7ff' stroke-width='2.2' stroke-linecap='round' opacity='.75'/%3E%3C/svg%3E\")";
  const css=document.createElement("style");
  css.textContent=`#grid .cell.lake{background:${WAVE} center/62% no-repeat,radial-gradient(circle at 30% 25%,#8fd0ef,#4a9fd0 55%,#2f7fb0)!important;box-shadow:inset 0 0 0 2px rgba(233,247,255,.55),inset 0 -6px 10px -4px rgba(15,60,95,.45)!important}
#grid .cell.lake:nth-child(odd){background:${WAVE} 30% 60%/62% no-repeat,radial-gradient(circle at 70% 30%,#8fd0ef,#4a9fd0 55%,#2f7fb0)!important}`;
  document.head.appendChild(css);
  function kinds(){const s=new Set();if(!C||!C.clues)return s;for(const k in C.clues)(C.clues[k]||[]).forEach(cl=>{if(cl&&(cl[0]==="mirc"||cl[0]==="mird"||cl[0]==="mira"))s.add(cl[0])});return s}
  function cells(k){const out=new Set(),add=(r,c)=>out.add(r+","+c);
    if(k.has("mird"))for(let i=0;i<N;i++)add(i,i);
    if(k.has("mira"))for(let i=0;i<N;i++)add(i,N-1-i);
    if(k.has("mirc")){const m=(N-1)/2;if(N%2){add(m,m);if(N>=7){add(m-1,m);add(m+1,m);add(m,m-1);add(m,m+1)}}else{const a=N/2-1;add(a,a);add(a,a+1);add(a+1,a);add(a+1,a+1)}}
    return out}
  function draw(){const k=kinds();if(!k.size)return;cells(k).forEach(x=>{const [r,c]=x.split(",");const el=document.querySelector(`#grid .cell[data-r="${r}"][data-c="${c}"]`);if(el&&!el.classList.contains("void"))el.classList.add("lake")})}
  const _rb=renderBoard;renderBoard=function(){const r=_rb.apply(this,arguments);try{draw()}catch(_){}return r};
})();
