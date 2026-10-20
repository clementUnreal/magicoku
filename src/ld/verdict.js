
/* ================= VERDICT: suspense + seal stamp ================= */
var SEAL_SVG=`<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="vwax" cx="42%" cy="36%" r="70%"><stop offset="0" stop-color="#e2576a"/><stop offset=".55" stop-color="#a81f36"/><stop offset="1" stop-color="#6d0f22"/></radialGradient></defs>
<path d="M100 8c9 0 13 8 21 10s16-3 22 3 3 15 8 21 13 7 15 15-4 13-3 21 8 13 5 21-11 9-15 15-2 15-9 19-15-1-22 3-11 13-19 13-14-8-21-10-16 3-22-3-3-15-8-21-13-7-15-15 4-13 3-21-8-13-5-21 11-9 15-15 2-15 9-19 15 1 22-3 11-13 19-13z" fill="url(#vwax)"/>
<circle cx="100" cy="100" r="62" fill="none" stroke="#f6c9a8" stroke-opacity=".55" stroke-width="3" stroke-dasharray="2 7"/>
<circle cx="100" cy="100" r="50" fill="none" stroke="#5a0b1b" stroke-opacity=".5" stroke-width="2"/>
<path d="M112 66a36 36 0 1 0 22 58a30 30 0 1 1-22-58z" fill="#f3d38c"/>
<path d="M78 78l3 7 7 3-7 3-3 7-3-7-7-3 7-3z M70 112l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#f3d38c"/></svg>`;
var verdictBusy=false;
function vSnd(kind){try{const c=ac();if(!c)return;
  if(kind==="tick"){bloop(1300,0,.05,.8,.05)}
  else if(kind==="roll"){for(let i=0;i<14;i++){const t=.95*(1-Math.pow(1-i/14,1.7));bloop(820+i*38,t,.03+i*.003,.85,.05)}}
  else if(kind==="stamp"){const m=bus(),t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(48,t+.25);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.55,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+.35);o.connect(g).connect(m);o.start(t);o.stop(t+.4);
    [N_.C5,N_.G5,N_.C6,N_.E6,N_.G6].forEach((f,i)=>bell(f,.08+i*.06,.9,.07))}
  else if(kind==="hmm"){bell(N_.G5,0,.4,.07,.92);bell(N_.E5,.18,.45,.07,.92);bell(N_.C5,.4,.7,.07,.9)}
}catch(e){}}
function vBurst(host){const cols=["#ffd77a","#fff3c4","#f2a7c3","#b9a4ff","#9fe3c7"];
  for(let i=0;i<34;i++){const s=document.createElement("i");s.className="vsp";const a=Math.random()*Math.PI*2,d=110+Math.random()*170;
    s.style.setProperty("--dx",Math.cos(a)*d+"px");s.style.setProperty("--dy",Math.sin(a)*d+"px");s.style.setProperty("--r",(Math.random()*540-270)+"deg");
    s.style.background=cols[i%cols.length];s.style.animationDelay=(Math.random()*.08)+"s";if(i%3===0)s.classList.add("star");host.appendChild(s)}}
function runVerdict(ok,done){
  verdictBusy=true;const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ov=$("#verdict");if(!ov){ov=document.createElement("div");ov.id="verdict";document.body.appendChild(ov)}
  ov.className="";ov.innerHTML=`<div class="vbox"><div class="vrays"></div><div class="vseal">${SEAL_SVG}<span class="vq">?</span></div>
    <div class="vtxt">${L("Vérification de ta déduction","Checking your deduction","추리를 확인하는 중","推理を確認中")}<span class="vdots"><b>.</b><b>.</b><b>.</b></span></div><div class="vfx"></div></div>`;
  ov.hidden=false;requestAnimationFrame(()=>ov.classList.add("on"));
  const plan=$("#plan");if(plan)plan.classList.add("vscan");
  const whos=[...document.querySelectorAll("#marks .who")];
  const T=reduce?500:1900;
  whos.forEach((w,i)=>setTimeout(()=>{w.classList.add("vping");vSnd("tick");setTimeout(()=>w.classList.remove("vping"),420)},(reduce?0:250)+i*((T-500)/Math.max(1,whos.length))));
  setTimeout(()=>vSnd("roll"),reduce?0:T-1050);
  setTimeout(()=>{
    if(plan)plan.classList.remove("vscan");
    const tx=ov.querySelector(".vtxt");
    if(ok){ov.classList.add("win");tx.innerHTML=`<b class="vbig">${L("Énigme résolue !","Mystery solved!","수수께끼 해결!","謎は解けた！")}</b>`;
      vSnd("stamp");document.body.classList.add("vshake");setTimeout(()=>document.body.classList.remove("vshake"),400);
      if(!reduce)vBurst(ov.querySelector(".vfx"));
      setTimeout(()=>{ov.classList.add("out");setTimeout(()=>{ov.hidden=true;verdictBusy=false;done()},380)},reduce?700:1500);
    }else{ov.classList.add("lose");tx.innerHTML=`<b class="vmid">${L("Hmm… quelque chose cloche.","Hmm… something's not right.","음… 뭔가 이상해요.","うーん……何かがおかしい。")}</b>`;
      vSnd("hmm");
      setTimeout(()=>{ov.classList.add("out");setTimeout(()=>{ov.hidden=true;verdictBusy=false;done()},380)},reduce?600:1150);
    }
  },T);
}
(function(){const el=$("#tValid"),orig=el.onclick;
  el.onclick=function(e){
    if(verdictBusy)return;
    const P=M.people.length;if(Object.keys(S.place).length<P||S.solved&&false)return orig.call(this,e);
    const ok=C.solution.every(([r,c],p)=>S.place[p]&&S.place[p][0]===r&&S.place[p][1]===c);
    const self=this;
    runVerdict(ok,()=>{window._vquiet=!ok;orig.call(self,e);window._vquiet=false});
  };
  const _t=toast;toast=function(m){if(window._vquiet&&/(Pas encore|Not yet|아직이에요|まだです)/.test(m)){$("#toast").textContent=m;$("#toast").classList.add("on");clearTimeout(tt);tt=setTimeout(()=>$("#toast").classList.remove("on"),3600);return}_t(m)};
})();
