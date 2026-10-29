/* ================= SOUND ================= */
const SND={ctx:null,on:true};
try{SND.on=localStorage.getItem("magicoku:sound")!=="off"}catch(e){}
function ac(){if(!SND.on)return null;if(!SND.ctx){try{SND.ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(SND.ctx.state==="suspended")SND.ctx.resume();return SND.ctx}
let MASTER=null;
function bus(){const c=ac();if(!c)return null;if(!MASTER){const out=c.createGain();out.gain.value=.9;const lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=3800;
  const dl=c.createDelay();dl.delayTime.value=.13;const fb=c.createGain();fb.gain.value=.22;const wet=c.createGain();wet.gain.value=.25;
  out.connect(lp).connect(c.destination);out.connect(dl);dl.connect(fb).connect(dl);dl.connect(wet).connect(lp);MASTER=out}return MASTER}
// soft "music box" note: sine + quiet octave, soft attack, smooth decay
function bell(f,t0=0,dur=.35,vol=.12,slide=0){const c=ac(),m=bus();if(!c||!m)return;const t=c.currentTime+t0;
  [[1,1],[2,.18],[3,.05]].forEach(([h,a])=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.setValueAtTime(f*h,t);if(slide)o.frequency.exponentialRampToValueAtTime(f*h*slide,t+dur*.6);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*a,t+.012);g.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(g).connect(m);o.start(t);o.stop(t+dur+.05)})}
// little "bloop" (water drop / bubble)
function bloop(f,t0=0,vol=.11,up=1.9,dur=.16){const c=ac(),m=bus();if(!c||!m)return;const t=c.currentTime+t0,o=c.createOscillator(),g=c.createGain();
  o.type="sine";o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*up,t+dur*.7);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.0005,t+dur);
  o.connect(g).connect(m);o.start(t);o.stop(t+dur+.03)}
const N_={C5:523.25,D5:587.33,E5:659.25,G5:783.99,A5:880,C6:1046.5,D6:1174.66,E6:1318.5,G6:1567.98,A4:440,G4:392,E4:329.63,C4:261.63};
const SFX={
 place(){bloop(420,0,.10,1.6,.12);bell(N_.E5,.03,.4,.10);bell(N_.G5,.09,.45,.09);bell(N_.C6,.15,.6,.08)},
 cross(){bloop(900,0,.07,.7,.09);bloop(700,.06,.06,.7,.09)},
 uncross(){bloop(600,0,.06,1.4,.1)},
 note(){bell(N_.A5,0,.22,.06)},
 erase(){bloop(800,0,.06,.6,.14);bloop(500,.05,.05,.6,.14)},
 remove(){bell(N_.G5,0,.3,.07,.75)},
 hold(){bloop(300,0,.05,1.8,.45)},
 hint(){[N_.C6,N_.E6,N_.G6].forEach((f,i)=>bell(f,i*.07,.5,.06));bell(N_.C6*2,.24,.6,.04)},
 select(){bloop(560,0,.07,1.5,.1)},
 undo(){bloop(700,0,.07,.62,.13)},
 win(){[N_.C5,N_.E5,N_.G5,N_.C6,N_.E6,N_.G6].forEach((f,i)=>bell(f,i*.11,1.1,.09));bell(N_.C4,0,1.6,.07);bell(N_.G4,.33,1.4,.05)},
 fail(){bell(N_.E5,0,.35,.08,.94);bell(N_.C5,.16,.5,.08,.94)},
 forbid(){bloop(330,0,.07,.8,.14)},
 page(){bloop(520,0,.08,1.45,.13);bell(N_.G5,.05,.3,.04)},
 tap(){bloop(640,0,.05,1.3,.08)}
};
const play=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
/* hook into game functions */
(function(){
  const _place=placePerson;placePerson=function(p,r,c){
    const gone=Object.keys(S.notes||{}).filter(k=>S.notes[k].includes(p)&&k!==r+","+c);
    _place(p,r,c);if(!window._silent)play("place");
    if(gone.length)setTimeout(()=>{gone.forEach((k,i)=>{const [rr,cc]=k.split(",");const el=document.querySelector(`#marks .mk[data-r="${rr}"][data-c="${cc}"]`);if(!el)return;
      const sp=document.createElement("span");sp.className="poof";sp.textContent=ini(p);sp.style.color=inkCol(p);sp.style.animationDelay=(i*40)+"ms";el.appendChild(sp);setTimeout(()=>sp.remove(),900+i*40)});
      if(!window._silent)setTimeout(()=>play("note"),120)},30)};
  const _paint=applyPaint;applyPaint=function(r,c,mode){const k=r+","+c,had=!!S.xs[k];_paint(r,c,mode);if(had!==!!S.xs[k])play(S.xs[k]?"cross":"uncross")};
  const _erase=eraseCell;eraseCell=function(r,c){const ch=_erase(r,c);if(ch)play("erase");return ch};
  const _hint=hint;hint=function(){window._silent=true;try{_hint()}finally{window._silent=false}play("hint")};
  const _rev=showReveal;showReveal=function(){_rev();play("win")};
  const _toast=toast;toast=function(m){_toast(m);if(/Personne ne peut|Nobody can/.test(m))play("forbid");else if(/Pas encore|Not yet/.test(m))play("fail")};
  const _rm=removePerson;removePerson=function(p){_rm(p);if(!window._silent&&!window._placing)play("remove")};
  const _pp=placePerson;placePerson=function(p,r,c){window._placing=true;try{_pp(p,r,c)}finally{window._placing=false}};
})();
$("#tHint").onclick=()=>hint();
document.addEventListener("pointerdown",e=>{ac();
  if(e.target.closest("#cards .card"))play("select");
  if(e.target.closest("#tUndo"))play("undo");
  else if(e.target.closest(".tab,.lang button,.seg2 button,.hbtn,.pill,#tX,#tErase,#tValid,.pen,.skb"))play("tap");
},true);
/* notes sound: detect notes change after pointerup on plan */
let _nCount=0;const nCount=()=>Object.values(S.notes||{}).reduce((a,v)=>a+v.length,0);
document.addEventListener("pointerdown",()=>{_nCount=nCount()},true);
document.addEventListener("pointerup",()=>{setTimeout(()=>{if(nCount()!==_nCount)play("note")},0)},true);
/* hold start sound */
new MutationObserver(m=>{for(const x of m)for(const n of x.addedNodes)if(n.classList&&n.classList.contains("hold"))play("hold")}).observe(document.body,{childList:true,subtree:true});
function setSound(on){SND.on=on;try{localStorage.setItem("magicoku:sound",on?"on":"off")}catch(e){}$("#bSound").textContent=on?"🔊":"🔇";$("#bSound").setAttribute("aria-label",on?L("Couper le son","Mute"):L("Activer le son","Unmute"))}
/* ================= RULES MODAL ================= */
function openModal(id){document.querySelectorAll(".modal").forEach(m=>m.hidden=true);$(id).hidden=false;play("page")}
function closeModal(){document.querySelectorAll(".modal").forEach(m=>m.hidden=true)}
(function(){const rules=document.querySelector(".rules");if(rules)$("#rulesBody").appendChild(rules)})();
/* ================= TUTORIAL ================= */
const TUTO={fr:[
 [null,"Bienvenue à l'Académie !","Un crime a eu lieu. Ton but : retrouver <b>où se trouvait chaque personne</b>, puis découvrir le meurtrier. C'est comme un sudoku, mais avec des suspects."],
 [".suspects","Les suspects","Chaque carte donne un <b>indice</b> sur l'endroit où se trouvait la personne. La victime est en rouge."],
 ["#plan","Le plan","Le château est découpé en cases et en pièces. <b>Une seule personne par rangée et par colonne.</b>"],
 ["#plan","Les objets","On peut se tenir sur un fauteuil, une malle, dans la baignoire, ou lire un grimoire. Les cases <b>hachurées</b> sont interdites (étagère, chaudron, bureau…)."],
 [".suspects","Placer quelqu'un","Touche un suspect, puis <b>maintiens appuyé</b> sur une case : le cadre se remplit et la personne est posée. Sa rangée et sa colonne se barrent toutes seules."],
 ["#plan","Les notes","Un <b>appui court</b> écrit juste l'initiale du suspect au crayon : pratique pour noter les cases possibles."],
 ["#tX","Barrer et effacer","L'outil <b>X</b> barre une case (glisse le doigt pour en barrer plusieurs). La gomme efface. <b>Annuler</b> revient en arrière."],
 [".views","Le brouillon","Le mode <b>Brouillon</b> te donne le plan en noir et blanc pour griffonner tes théories, sans toucher à ta grille."],
 ["#tHint","Coincé ?","Le bouton <b>Indice</b> te donne une vraie déduction logique, jamais une réponse au hasard."],
 ["#tValid","Le meurtrier","Le meurtrier est la <b>seule personne seule dans une pièce avec la victime</b>. Quand tout le monde est placé, appuie sur <b>Valider</b>. Bonne enquête !"]],
en:[
 [null,"Welcome to the Academy!","A crime has happened. Your goal: find <b>where each person was</b>, then unmask the murderer. Like sudoku, but with suspects."],
 [".suspects","The suspects","Each card gives a <b>clue</b> about where the person was. The victim is in red."],
 ["#plan","The map","The castle is split into squares and rooms. <b>Only one person per row and per column.</b>"],
 ["#plan","Objects","You can sit in an armchair or on a trunk, be in the bathtub or read a grimoire. <b>Hatched</b> squares are off-limits (bookcase, cauldron, desk…)."],
 [".suspects","Placing someone","Tap a suspect, then <b>press and hold</b> a square: the frame fills and the person is placed. Their row and column are crossed out automatically."],
 ["#plan","Notes","A <b>short tap</b> just pencils the suspect's initial: handy for noting possible squares."],
 ["#tX","Cross out and erase","The <b>X</b> tool crosses out a square (drag to cross out several). The eraser clears. <b>Undo</b> goes back."],
 [".views","Scratchpad","<b>Scratchpad</b> mode shows the map in black and white so you can scribble theories without touching your grid."],
 ["#tHint","Stuck?","<b>Hint</b> gives you a real logical deduction, never a random answer."],
 ["#tValid","The murderer","The murderer is the <b>only person alone in a room with the victim</b>. Once everyone is placed, press <b>Check</b>. Happy sleuthing!"]]};
let tStep=0;
function tuto(i){tStep=i;const steps=TUTO[LANG],st=steps[i];if(!st){endTuto();return}
  const ov=$("#tuto");ov.hidden=false;const hole=$("#tutoHole"),box=$("#tutoBox");
  $("#tutoT").innerHTML=st[1];$("#tutoX").innerHTML=st[2];$("#tutoN").textContent=`${i+1} / ${steps.length}`;
  $("#tutoPrev").disabled=i===0;$("#tutoNext").textContent=i===steps.length-1?L("C'est parti !","Let's go!"):L("Suivant","Next");
  const el=st[0]?document.querySelector(st[0]):null;
  const place=()=>{if(el){const r=el.getBoundingClientRect(),p=8;hole.style.cssText=`left:${r.left-p}px;top:${r.top-p}px;width:${r.width+2*p}px;height:${r.height+2*p}px`;hole.hidden=false;
      const bw=Math.min(340,innerWidth-24);let x=r.right+16,y=Math.max(12,r.top);
      if(x+bw>innerWidth-12){x=Math.max(12,Math.min(innerWidth-bw-12,r.left));y=r.bottom+14;if(y+200>innerHeight)y=Math.max(12,r.top-214)}
      box.style.cssText=`left:${x}px;top:${Math.min(y,innerHeight-230)}px;width:${bw}px`}
    else{hole.hidden=true;const bw=Math.min(380,innerWidth-24);box.style.cssText=`left:${(innerWidth-bw)/2}px;top:${innerHeight/2-120}px;width:${bw}px`}};
  if(el){const r=el.getBoundingClientRect();if((r.top<0||r.bottom>innerHeight)&&!document.body.classList.contains("g3"))el.scrollIntoView({block:r.height>innerHeight*.7?"start":"center"});setTimeout(place,350)}else place();
  play("page");
}
function endTuto(){$("#tuto").hidden=true;try{localStorage.setItem("magicoku:tuto","done")}catch(e){}}
window.addEventListener("resize",()=>{if(!$("#tuto").hidden)tuto(tStep)});
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
  if(t.id==="bRules")openModal("#mRules");else if(t.id==="bTuto"){closeModal();tuto(0)}else if(t.id==="bSound")setSound(!SND.on);
  else if(t.classList.contains("mclose"))closeModal();else if(t.id==="tutoNext")tuto(tStep+1);else if(t.id==="tutoPrev")tuto(Math.max(0,tStep-1));else if(t.id==="tutoSkip")endTuto()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();if(!$("#tuto").hidden)endTuto()}});
function extraTexts(){$("#bRules").textContent=L("📜 Règles","📜 Rules");$("#bTuto").textContent=L("❓ Tutoriel","❓ Tutorial");$("#mRulesT").textContent=L("Les règles","The rules");$("#tutoSkip").textContent=L("Passer","Skip");$("#tutoPrev").textContent=L("Retour","Back");setSound(SND.on)}
extraTexts();
const _rs=renderStatic;renderStatic=function(){_rs();extraTexts()};
let _seen=null;try{_seen=localStorage.getItem("magicoku:tuto")}catch(e){}
if(!_seen)setTimeout(()=>tuto(0),600);
