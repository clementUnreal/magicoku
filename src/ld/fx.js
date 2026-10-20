/* ================= MENU FX: particles ================= */
(function(){
  const home=$("#home");const cv=document.createElement("canvas");cv.className="home-fx";home.prepend(cv);
  const ctx=cv.getContext("2d");let W=0,H=0,D=1,parts=[],stars=[],shoots=[],trail=[],t0=performance.now();
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size(){D=Math.min(2,devicePixelRatio||1);W=home.clientWidth;H=home.clientHeight;cv.width=W*D;cv.height=H*D;cv.style.width=W+"px";cv.style.height=H+"px";
    stars=Array.from({length:Math.round(W*H/5000)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+.3,p:Math.random()*6.28,s:.6+Math.random()*1.6}));
    parts=Array.from({length:Math.round(W*H/16000)+12},()=>newP(true))}
  function newP(any){return {x:Math.random()*W,y:any?Math.random()*H:H+10,r:Math.random()*2.2+.8,vy:-(.15+Math.random()*.45),vx:(Math.random()-.5)*.25,ph:Math.random()*6.28,
    hue:Math.random()<.75?"246,215,130":(Math.random()<.5?"200,180,255":"255,200,220"),life:1}}
  window.addEventListener("resize",size);
  home.addEventListener("pointermove",e=>{if(reduce)return;const r=home.getBoundingClientRect();for(let i=0;i<2;i++)trail.push({x:e.clientX-r.left,y:e.clientY-r.top,vx:(Math.random()-.5)*.8,vy:(Math.random()-.2)*.8,a:1,r:Math.random()*2+1})});
  function star4(x,y,s,a,col){ctx.save();ctx.translate(x,y);ctx.globalAlpha=a;ctx.fillStyle=`rgb(${col})`;ctx.beginPath();
    for(let i=0;i<8;i++){const ang=i*Math.PI/4,rr=i%2?s*.28:s;ctx.lineTo(Math.cos(ang)*rr,Math.sin(ang)*rr)}ctx.closePath();ctx.fill();ctx.restore()}
  function frame(now){requestAnimationFrame(frame);if(home.hidden)return;if(cv.width!==Math.round(home.clientWidth*D))size();
    const t=(now-t0)/1000;ctx.setTransform(D,0,0,D,0,0);ctx.clearRect(0,0,W,H);
    for(const s of stars){const a=.35+.65*Math.abs(Math.sin(t*s.s+s.p));ctx.globalAlpha=a*.9;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fill()}
    if(!reduce&&Math.random()<.004)shoots.push({x:Math.random()*W*.8,y:Math.random()*H*.35,vx:5+Math.random()*3,vy:2+Math.random()*1.5,l:1});
    for(const s of shoots){s.x+=s.vx;s.y+=s.vy;s.l-=.016;const g=ctx.createLinearGradient(s.x,s.y,s.x-s.vx*14,s.y-s.vy*14);g.addColorStop(0,`rgba(255,245,210,${s.l})`);g.addColorStop(1,"rgba(255,245,210,0)");
      ctx.globalAlpha=1;ctx.strokeStyle=g;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.vx*14,s.y-s.vy*14);ctx.stroke()}
    shoots=shoots.filter(s=>s.l>0);
    for(const p of parts){if(!reduce){p.y+=p.vy;p.x+=p.vx+Math.sin(t+p.ph)*.2}const tw=.5+.5*Math.sin(t*2.2+p.ph);
      ctx.globalAlpha=.25+.55*tw;const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);g.addColorStop(0,`rgba(${p.hue},.9)`);g.addColorStop(1,`rgba(${p.hue},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*4,0,6.28);ctx.fill();
      if(p.r>2.4)star4(p.x,p.y,p.r*2.2,.5*tw,p.hue);
      if(p.y<-20){Object.assign(p,newP(false))}}
    for(const q of trail){q.x+=q.vx;q.y+=q.vy;q.vy+=.02;q.a-=.025;star4(q.x,q.y,q.r*2,Math.max(0,q.a),"255,225,150")}
    trail=trail.filter(q=>q.a>0).slice(-120);ctx.globalAlpha=1}
  size();requestAnimationFrame(frame);
})();
/* ================= MENU MUSIC ================= */
const MUS={on:true,timer:null,step:0,next:0,started:false};
try{MUS.on=localStorage.getItem("magicoku:music")!=="off"}catch(e){}
const NOTE=n=>440*Math.pow(2,(n-69)/12);
// gentle waltz in A minor / F / C / G — music box melody + soft pads
const CHORDS=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]];
const MEL=[76,72,69,72, 74,72,69,65, 72,67,64,67, 71,74,79,74, 76,79,81,79, 77,74,72,69, 72,76,79,76, 74,71,67,71];
function pad(f,t0,dur,vol){const c=ac(),m=bus();if(!c||!m)return;const t=c.currentTime+t0;const o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain();
  o.type="sine";o2.type="triangle";o.frequency.value=f;o2.frequency.value=f*1.003;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.6);g.gain.linearRampToValueAtTime(vol*.7,t+dur*.7);g.gain.exponentialRampToValueAtTime(.0005,t+dur);
  const g2=c.createGain();g2.gain.value=.35;o.connect(g);o2.connect(g2).connect(g);g.connect(m);o.start(t);o2.start(t);o.stop(t+dur+.1);o2.stop(t+dur+.1)}
function musicTick(){const c=ac();if(!c||!MUS.on||$("#home").hidden||!SND.on){return}
  const beat=.42;while(MUS.next<c.currentTime+.6){const i=MUS.step,dt=Math.max(0,MUS.next-c.currentTime);
    const bar=Math.floor(i/4)%8;const ch=CHORDS[bar%4];
    if(i%4===0){ch.forEach(n=>pad(NOTE(n),dt,beat*4.2,.028));pad(NOTE(ch[0]-12),dt,beat*4.2,.03)}
    const mn=MEL[i%MEL.length];bell(NOTE(mn),dt,1.1,i%4===0?.07:.05);
    if(i%8===6)bell(NOTE(mn+12),dt+beat*.5,.8,.025);
    MUS.step++;MUS.next+=beat}}
function startMusic(){if(!MUS.on||!SND.on)return;const c=ac();if(!c)return;if(!MUS.timer){MUS.next=c.currentTime+.15;MUS.timer=setInterval(musicTick,120)}}
function stopMusic(){clearInterval(MUS.timer);MUS.timer=null}
document.addEventListener("pointerdown",()=>{if(!$("#home").hidden)startMusic()},true);
new MutationObserver(()=>{if($("#home").hidden)stopMusic();else if(SND.ctx)startMusic()}).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
function setMusic(on){MUS.on=on;try{localStorage.setItem("magicoku:music",on?"on":"off")}catch(e){}if(on)startMusic();else stopMusic();renderHome()}
document.addEventListener("click",e=>{const t=e.target.closest("button");if(t&&t.id==="oMusic")setMusic(!MUS.on)});
(function(){const _r=renderHome;renderHome=function(){_r();const b=$("#oMusic");if(b){b.setAttribute("aria-pressed",MUS.on);$("#oMusicL").textContent=L("Musique du menu","Menu music")}}})();
renderHome();
