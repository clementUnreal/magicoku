
/* ================= pencil stroke on a suspect's paragraph once they are placed =================
   Placing a character draws a hand-drawn graphite line across each line of their paragraph,
   like an investigator ticking it off. Tapping the paragraph text toggles it by hand.
   Removing the character erases the stroke. */
(function(){
  const css=document.createElement("style");
  css.textContent=`.recit p[data-p]{position:relative}
.recit p.can-strike{cursor:pointer}
.recit p.struck{opacity:.62;transition:opacity .5s .15s}
.recit p .pc-svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:1}
.recit p .pc-svg path{fill:none;stroke:#4a4642;stroke-linecap:round;stroke-linejoin:round;opacity:.88}
.recit p .pc-svg path.pc-b{stroke:#6d6862;opacity:.45}
.recit p .pc-pen{position:absolute;width:30px;height:30px;margin:-27px 0 0 -3px;pointer-events:none;z-index:2;transform-origin:3px 27px;filter:drop-shadow(1px 2px 1.5px rgba(60,40,10,.35))}`;
  document.head.appendChild(css);
  const PEN=`<svg class="pc-pen" viewBox="0 0 30 30"><g transform="rotate(-38 15 15)"><rect x="12" y="-3" width="6" height="22" rx="1" fill="#f2c14e" stroke="#9a6b12" stroke-width=".8"/><rect x="12" y="-3" width="6" height="4" rx="1" fill="#e58b9a" stroke="#9a4b5a" stroke-width=".8"/><rect x="12" y="1" width="6" height="2" fill="#b9b9b9"/><path d="M12 19 L15 26 L18 19 Z" fill="#f3d9a8" stroke="#9a6b12" stroke-width=".8"/><path d="M14.2 23.2 L15 26 L15.8 23.2 Z" fill="#3b3836"/></g></svg>`;
  const reduce=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(_){return false}};
  let caseId=null,drawn=new Set();
  const isOn=p=>!!(S.place&&S.place[p])&&!(S.unstrike&&S.unstrike[p]);
  function seeded(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return((h>>>0)%1000)/1000}}
  /* one entry per visual line of text: {x0,x1,y} in paragraph coordinates */
  function lines(el){
    const r=document.createRange(),box=el.getBoundingClientRect(),out=[];
    const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement&&n.parentElement.closest(".pc-svg,.pc-pen")?NodeFilter.FILTER_REJECT:(n.textContent.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT)});
    let n;while((n=w.nextNode())){r.selectNodeContents(n);for(const q of r.getClientRects()){if(q.width<2)continue;
      const y=q.top+q.height*.56-box.top,L=out.find(o=>Math.abs(o.y-y)<q.height*.45);
      if(L){L.x0=Math.min(L.x0,q.left-box.left);L.x1=Math.max(L.x1,q.right-box.left)}else out.push({x0:q.left-box.left,x1:q.right-box.left,y})}}
    return out.sort((a,b)=>a.y-b.y);
  }
  function pathFor(L,rnd,k){
    const x0=L.x0-3-rnd()*3,x1=L.x1+2+rnd()*4,y0=L.y+(rnd()-.5)*2.4,y1=L.y+(rnd()-.5)*2.4,len=x1-x0;
    const c1=x0+len*(.3+rnd()*.1),c2=x0+len*(.65+rnd()*.1),w1=(rnd()-.5)*3.2,w2=(rnd()-.5)*3.2;
    return {d:`M${x0.toFixed(1)} ${y0.toFixed(1)} C${c1.toFixed(1)} ${(y0+w1).toFixed(1)} ${c2.toFixed(1)} ${(y1+w2).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`,
      d2:`M${(x0+4).toFixed(1)} ${(y0+1.1).toFixed(1)} C${c1.toFixed(1)} ${(y0+w1+1.4).toFixed(1)} ${c2.toFixed(1)} ${(y1+w2+.6).toFixed(1)} ${(x1-6-k).toFixed(1)} ${(y1+.9).toFixed(1)}`};
  }
  function clear(el){el.querySelectorAll(".pc-svg,.pc-pen").forEach(x=>x.remove());el.classList.remove("struck")}
  function draw(el,p,animate){
    clear(el);const ls=lines(el);if(!ls.length)return;
    const rnd=seeded((C&&C.id)+":"+p);
    const NS="http://www.w3.org/2000/svg",svg=document.createElementNS(NS,"svg");svg.setAttribute("class","pc-svg");
    const segs=ls.map((L,k)=>{const pd=pathFor(L,rnd,k);const a=document.createElementNS(NS,"path"),b=document.createElementNS(NS,"path");
      a.setAttribute("d",pd.d);a.setAttribute("stroke-width",(1.9+rnd()*.5).toFixed(2));b.setAttribute("d",pd.d2);b.setAttribute("class","pc-b");b.setAttribute("stroke-width","1.1");
      svg.appendChild(b);svg.appendChild(a);return [a,b]});
    el.appendChild(svg);el.classList.add("struck");
    if(!animate||reduce())return;
    const lens=segs.map(([a,b])=>[a.getTotalLength(),b.getTotalLength()]);
    segs.forEach(([a,b],i)=>{for(const [pa,l] of [[a,lens[i][0]],[b,lens[i][1]]]){pa.style.strokeDasharray=l;pa.style.strokeDashoffset=l}});
    el.classList.remove("struck");
    const holder=document.createElement("div");holder.innerHTML=PEN;const pen=holder.firstChild;pen.style.opacity="0";el.appendChild(pen);
    const durs=lens.map(([l])=>Math.max(230,Math.min(520,l*1.15)));let i=0,t0=null;
    function step(ts){if(!el.isConnected)return;if(t0==null)t0=ts;
      const [a,b]=segs[i],[la,lb]=lens[i],t=Math.min(1,(ts-t0)/durs[i]),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      a.style.strokeDashoffset=la*(1-e);b.style.strokeDashoffset=lb*(1-Math.min(1,e*1.08));
      const pt=a.getPointAtLength(la*e);pen.style.left=pt.x+"px";pen.style.top=pt.y+"px";pen.style.opacity="1";pen.style.transform=`rotate(${Math.sin(ts/38)*3}deg)`;
      if(t<1){requestAnimationFrame(step);return}
      i++;t0=null;if(i<segs.length){requestAnimationFrame(step);return}
      el.classList.add("struck");pen.animate([{opacity:1,transform:"translate(0,0)"},{opacity:0,transform:"translate(10px,-14px) rotate(12deg)"}],{duration:380,easing:"ease-out",fill:"forwards"}).onfinish=()=>pen.remove()}
    requestAnimationFrame(step);scratch(durs.reduce((a,b)=>a+b,0));
  }
  /* soft pencil-on-paper sound, only when sound is on */
  function scratch(ms){try{if(typeof SND==="undefined"||!SND.on)return;const AC=ac();if(!AC)return;const n=Math.floor(AC.sampleRate*ms/1000),buf=AC.createBuffer(1,n,AC.sampleRate),d=buf.getChannelData(0);
      for(let k=0;k<n;k++){const env=Math.min(1,k/(AC.sampleRate*.03))*Math.min(1,(n-k)/(AC.sampleRate*.06));d[k]=(Math.random()*2-1)*env*(.55+.45*Math.sin(k/AC.sampleRate*2*Math.PI*9))}
      const src=AC.createBufferSource();src.buffer=buf;const f=AC.createBiquadFilter();f.type="bandpass";f.frequency.value=3200;f.Q.value=.9;const g=AC.createGain();g.gain.value=.05;
      src.connect(f);f.connect(g);g.connect(AC.destination);src.start()}catch(_){}}
  function decorate(){
    if(!C)return;
    if(C.id!==caseId){caseId=C.id;drawn=new Set(Object.keys(S.place||{}).map(Number).filter(isOn))}
    S.unstrike=S.unstrike||{};
    document.querySelectorAll(".recit p[data-p]").forEach(el=>{
      const p=+el.dataset.p,placed=!!(S.place&&S.place[p]);
      if(!placed){delete S.unstrike[p];drawn.delete(p);el.classList.remove("can-strike");clear(el);return}
      el.classList.add("can-strike");
      if(!isOn(p)){drawn.delete(p);clear(el);return}
      const fresh=!drawn.has(p);drawn.add(p);
      if(fresh||!el.querySelector(".pc-svg"))draw(el,p,fresh);
    });
  }
  const _rc=renderCards;renderCards=function(){const r=_rc.apply(this,arguments);try{decorate()}catch(e){}return r};
  /* tap the plain text of a placed suspect's paragraph to strike / unstrike it by hand */
  document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;const el=t.closest(".recit p.can-strike");if(!el)return;
    if(t!==el&&t.closest("b.sn,.kw,a,button"))return;
    const p=+el.dataset.p;S.unstrike=S.unstrike||{};
    if(isOn(p)){S.unstrike[p]=1;drawn.delete(p);clear(el)}else{delete S.unstrike[p];drawn.add(p);draw(el,p,true)}
    try{save()}catch(_){}},true);
  /* reflow: redraw without animation */
  let rt=null;window.addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(()=>document.querySelectorAll(".recit p.can-strike").forEach(el=>{const p=+el.dataset.p;if(isOn(p))draw(el,p,false)}),150)});
  try{document.fonts&&document.fonts.ready.then(()=>{try{decorate()}catch(_){}})}catch(_){}
  try{decorate()}catch(_){}
})();
