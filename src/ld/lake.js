
/* ================= the lake: mirror clues (chapter 6) are drawn as real water on the map =================
   Purely visual (nobody is blocked, the puzzle is unchanged): a pond on the centre of the map for
   "reflection through the centre of the lake", a stream along the diagonal for diagonal reflections. */
(function(){
  const css=document.createElement("style");
  css.textContent=`.lakes{position:absolute;inset:3.2%;width:93.6%;height:93.6%;pointer-events:none;z-index:1}.plan.sketch .lakes{filter:grayscale(1) contrast(.85) brightness(1.12)}body.coop-objs #plan svg.lakes{display:none!important}.lakes .lake-w{animation:lakeShim 6s ease-in-out infinite}@keyframes lakeShim{50%{opacity:.75}}`;
  document.head.appendChild(css);
  function kinds(){const s=new Set();if(!C||!C.clues)return s;for(const k in C.clues)(C.clues[k]||[]).forEach(cl=>{if(cl&&(cl[0]==="mirc"||cl[0]==="mird"||cl[0]==="mira"))s.add(cl[0])});return s}
  function blob(cx,cy,R,seed){let d="";const n=14;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,rr=R*(1+.09*Math.sin(a*3+seed)+.05*Math.cos(a*5+seed*2));const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;d+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)}return d+"Z"}
  function band(x1,y1,x2,y2,w){const L=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/L,uy=(y2-y1)/L,nx=-uy,ny=ux,n=24,A=[],B=[];
    for(let i=0;i<=n;i++){const t=i/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t,taper=Math.min(1,Math.min(t,1-t)*6+.35),o=w/2*taper*(1+.12*Math.sin(t*17)),o2=w/2*taper*(1+.12*Math.cos(t*13));
      A.push([x+nx*o,y+ny*o]);B.push([x-nx*o2,y-ny*o2])}
    return "M"+A.map(p=>p.map(v=>v.toFixed(1)).join(" ")).join("L")+"L"+B.reverse().map(p=>p.map(v=>v.toFixed(1)).join(" ")).join("L")+"Z"}
  function water(d,id){return `<path d="${d}" fill="url(#lkG${id})" opacity=".78" class="lake-w"/><path d="${d}" fill="none" stroke="#f3fbff" stroke-width="7" opacity=".8"/><path d="${d}" fill="none" stroke="#1d5f86" stroke-width="2" opacity=".5" transform="translate(0 3)"/>`}
  function ripples(cx,cy,R){let s="";[.35,.6].forEach((f,i)=>s+=`<ellipse cx="${cx}" cy="${cy}" rx="${R*f}" ry="${R*f*.55}" fill="none" stroke="#fff" stroke-width="3" opacity="${.45-i*.15}"/>`);return s+`<path d="M${cx-R*.55} ${cy+R*.3}q${R*.12} -${R*.1} ${R*.24} 0t${R*.24} 0" fill="none" stroke="#fff" stroke-width="3" opacity=".4" stroke-linecap="round"/>`}
  function draw(){const k=kinds();if(!k.size)return;const rg=document.querySelector("#board .rugs");if(!rg)return;const W=N*100,c=W/2;
    let out=`<defs><radialGradient id="lkG0" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#6fbfe6"/><stop offset=".65" stop-color="#2f7fb0"/><stop offset="1" stop-color="#1f5f8c"/></radialGradient><linearGradient id="lkG1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f7fb0"/><stop offset=".5" stop-color="#5fb0dc"/><stop offset="1" stop-color="#2f7fb0"/></linearGradient></defs>`;
    if(k.has("mird"))out+=water(band(12,12,W-12,W-12,92),1);
    if(k.has("mira"))out+=water(band(W-12,12,12,W-12,92),1);
    if(k.has("mirc")){const R=Math.round(W*.16);out+=water(blob(c,c,R,N),0)+ripples(c,c,R)}
    rg.insertAdjacentHTML("afterend",`<svg class="lakes" viewBox="0 0 ${W} ${W}" preserveAspectRatio="none" aria-hidden="true">${out}</svg>`)}
  const _rb=renderBoard;renderBoard=function(){const r=_rb.apply(this,arguments);try{draw()}catch(_){}return r};
})();
