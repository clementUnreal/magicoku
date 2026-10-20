
/* ================= story chapters: animated frame + ambient sound ================= */
var AMB={on:true,env:null,nodes:[],timers:[],out:null};
try{AMB.on=localStorage.getItem("magicoku:ambience")!=="off"}catch(e){}
(function(){
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* ---------- animated particles ---------- */
  const FX={
    forest:{n:14,cls:"fly",over:true},station:{n:6,cls:"steam"},bank:{n:12,cls:"glint"},alley:{n:6,cls:"lamp"},
    village:{n:28,cls:"snow",over:true},lake:{n:10,cls:"ripple"},stadium:{n:8,cls:"confetti",over:true},
    hospital:{n:10,cls:"bubble"},ministry:{n:5,cls:"memo",over:true},fortress:{n:5,cls:"fog",over:true}};
  function fx(){const bd=$("#board");if(!bd)return;bd.querySelectorAll(".thfx").forEach(e=>e.remove());
    const e=typeof themeEnv==="function"?themeEnv():null;if(!e||reduce||!FX[e])return;const f=FX[e];
    const lay=document.createElement("div");lay.className="thfx "+(f.over?"over":"under")+" fx-"+e;
    let h="";for(let i=0;i<f.n;i++){const x=Math.random()*100,y=Math.random()*100,d=(f.cls==="snow"?7:f.cls==="fog"?26:f.cls==="memo"?11:5)+Math.random()*6,dl=-Math.random()*d,s=.6+Math.random()*.8;
      h+=`<i class="p ${f.cls}" style="left:${x}%;top:${y}%;--d:${d}s;animation-delay:${dl}s;--s:${s}"></i>`}
    lay.innerHTML=h;bd.prepend(lay)}
  const _rb=renderBoard;renderBoard=function(){_rb.apply(this,arguments);fx();amb()};
  /* ---------- ambient sound (synthesised, no files) ---------- */
  let noiseBuf=null;
  function ctx(){if(!SND.on||!AMB.on)return null;return ac()}
  function noise(c){if(noiseBuf)return noiseBuf;const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);let last=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5}noiseBuf=b;return b}
  function out(c){if(!AMB.out){AMB.out=c.createGain();AMB.out.gain.value=0;AMB.out.connect(c.destination)}return AMB.out}
  function bed(c,type,freq,q,vol,lfoHz,lfoAmt){const s=c.createBufferSource();s.buffer=noise(c);s.loop=true;const f=c.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=c.createGain();g.gain.value=vol;
    s.connect(f).connect(g).connect(out(c));s.start();AMB.nodes.push(s);
    if(lfoHz){const o=c.createOscillator(),og=c.createGain();o.frequency.value=lfoHz;og.gain.value=lfoAmt;o.connect(og).connect(f.frequency);o.start();AMB.nodes.push(o)}
    return g}
  function tone(c,f0,f1,dur,vol,type="sine",t0=0){const t=c.currentTime+t0,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur*.8);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);g.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(g).connect(out(c));o.start(t);o.stop(t+dur+.05)}
  function burst(c,freq,dur,vol,t0=0,type="bandpass",q=1){const t=c.currentTime+t0,s=c.createBufferSource();s.buffer=noise(c);const f=c.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=c.createGain();
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+dur);s.connect(f).connect(g).connect(out(c));s.start(t,Math.random());s.stop(t+dur+.05)}
  function every(min,max,fn){const loop=()=>{const id=setTimeout(()=>{try{fn()}catch(e){}loop()},(min+Math.random()*(max-min))*1000);AMB.timers.push(id)};loop()}
  const R=(a,b)=>a+Math.random()*(b-a);
  const SCENE={
    forest(c){bed(c,"lowpass",500,.7,.5,.08,180);every(3,7,()=>{const f=R(2200,3600);tone(c,f,f*1.3,.12,.05);tone(c,f*1.1,f*1.45,.12,.04,"sine",.16)});every(9,16,()=>tone(c,420,380,.5,.04,"triangle"))},
    station(c){bed(c,"lowpass",160,.8,.7,.05,40);every(6,12,()=>{for(let i=0;i<4;i++)burst(c,900,.06,.12,i*.18+(i%2)*.05)});every(18,30,()=>{tone(c,880,860,1.4,.035,"square");tone(c,1110,1090,1.4,.03,"square")})},
    bank(c){bed(c,"lowpass",120,.7,.5,.03,20);every(2,5,()=>{const f=R(900,1500);tone(c,f,f*1.9,.18,.06)});every(7,13,()=>{tone(c,2600,2500,.25,.03,"triangle");tone(c,3300,3200,.2,.02,"triangle",.09)})},
    alley(c){bed(c,"bandpass",700,.6,.35,.3,250);bed(c,"lowpass",300,.7,.25);every(10,18,()=>tone(c,1320,1300,.9,.03,"triangle"));every(4,9,()=>burst(c,2500,.05,.05))},
    village(c){bed(c,"lowpass",420,.8,.4,.06,160);every(.2,.9,()=>burst(c,R(1800,4000),.03,.05,0,"highpass",.7));every(6,12,()=>{[0,.18,.37].forEach(t=>{const f=R(1600,2400);tone(c,f,f,1.2,.025,"sine",t)})})},
    lake(c){const g=bed(c,"lowpass",380,.8,.55,.15,220);every(3,6,()=>burst(c,R(500,900),.5,.12,0,"lowpass",.6));every(10,20,()=>{tone(c,180,140,.25,.08,"square");tone(c,170,130,.25,.07,"square",.3)})},
    stadium(c){bed(c,"bandpass",900,.5,.45,.1,300);every(8,15,()=>burst(c,1100,2.6,.3,0,"bandpass",.7));every(20,35,()=>{tone(c,2800,2900,.25,.05,"triangle");tone(c,2800,2900,.5,.05,"triangle",.32)})},
    hospital(c){bed(c,"lowpass",220,.7,.3);every(1,1,()=>burst(c,3000,.02,.04));every(8,14,()=>{for(let i=0;i<5;i++)tone(c,R(300,600),R(700,900),.08,.05,"sine",i*.07)})},
    ministry(c){bed(c,"lowpass",260,.7,.35);every(.15,.6,()=>{if(Math.random()<.35)burst(c,R(2000,3500),.025,.07)});every(15,25,()=>{tone(c,1046,1046,.8,.05,"sine");tone(c,1318,1318,1,.05,"sine",.25)})},
    fortress(c){bed(c,"bandpass",400,4,.7,.07,250);bed(c,"lowpass",100,.7,.4);every(4,9,()=>{const f=R(700,1200);tone(c,f,f*1.6,.15,.06)});every(12,22,()=>{for(let i=0;i<3;i++)burst(c,R(3000,5000),.07,.06,i*.09,"bandpass",4)})}};
  function stop(){AMB.timers.forEach(clearTimeout);AMB.timers=[];const c=SND.ctx;
    if(c&&AMB.out){const g=AMB.out,nodes=AMB.nodes;g.gain.cancelScheduledValues(c.currentTime);g.gain.setTargetAtTime(0,c.currentTime,.3);setTimeout(()=>{nodes.forEach(n=>{try{n.stop()}catch(e){}});try{g.disconnect()}catch(e){}},1500)}
    AMB.nodes=[];AMB.out=null;AMB.env=null}
  function amb(){const e=typeof themeEnv==="function"?themeEnv():null;const want=e&&$("#home").hidden&&!document.hidden?e:null;
    if(want===AMB.env)return;stop();if(!want)return;const c=ctx();if(!c)return;AMB.env=want;
    try{SCENE[want](c);out(c).gain.setTargetAtTime(.22,c.currentTime,1.2)}catch(err){stop()}}
  window.ambRefresh=amb;
  new MutationObserver(()=>amb()).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
  document.addEventListener("visibilitychange",()=>amb());
  document.addEventListener("pointerdown",()=>{if(!AMB.env)amb()},true);
  /* options: ambience toggle + react to sound toggle */
  const so=$("#oMusic")&&$("#oMusic").closest(".opt");
  if(so&&!$("#oAmb")){so.insertAdjacentHTML("afterend",`<div class="opt"><span id="oAmbL"></span><button class="tog" id="oAmb"></button></div>`)}
  document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("button");if(!t)return;
    if(t.id==="oAmb"){AMB.on=!AMB.on;try{localStorage.setItem("magicoku:ambience",AMB.on?"on":"off")}catch(_){}stop();renderHome()}
    if(t.id==="bSound"||t.id==="oSound")setTimeout(()=>{stop();amb()},50)});
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);const b=$("#oAmb");if(b){b.setAttribute("aria-pressed",AMB.on);$("#oAmbL").textContent=L("Ambiance des chapitres","Chapter ambience","장 분위기 사운드","章の環境音")}};
  try{renderHome()}catch(e){}
})();
