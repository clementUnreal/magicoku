let SK={on:false,pen:"#2b1a33",size:4,erase:false};
const skKey=()=>"crimes-mignons-sketch:"+C.id, thKey=()=>"crimes-mignons-theory:"+C.id;
function setupSketch(){
  const plan=$("#plan");if(!plan)return;
  plan.classList.toggle("sketch",SK.on);
  let cv=plan.querySelector("canvas.sk");
  if(!cv){cv=document.createElement("canvas");cv.className="sk";plan.appendChild(cv);bindSketch(cv)}
  sizeSketch(cv);
  $("#theory").value=(()=>{try{return localStorage.getItem(thKey())||""}catch(e){return ""}})();
  renderSketchUI();
}
function sizeSketch(cv){
  const r=cv.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);
  const w=Math.round(r.width*d),h=Math.round(r.height*d);if(!w||!h)return;
  if(cv.width===w&&cv.height===h&&cv._case===C.id)return;
  cv.width=w;cv.height=h;cv._case=C.id;const ctx=cv.getContext("2d");ctx.clearRect(0,0,w,h);
  let src=null;try{src=localStorage.getItem(skKey())}catch(e){}
  if(src){const im=new Image();im.onload=()=>ctx.drawImage(im,0,0,w,h);im.src=src}
}
function saveSketch(cv){try{localStorage.setItem(skKey(),cv.toDataURL("image/png"))}catch(e){}}
function bindSketch(cv){
  let last=null;
  const pt=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]};
  cv.addEventListener("pointerdown",e=>{if(!SK.on)return;e.preventDefault();e.stopPropagation();try{cv.setPointerCapture(e.pointerId)}catch(_){}last=pt(e);draw(last,last)});
  cv.addEventListener("pointermove",e=>{if(!SK.on||!last)return;e.stopPropagation();const p=pt(e);draw(last,p);last=p});
  const up=e=>{if(!last)return;e&&e.stopPropagation();last=null;saveSketch(cv)};
  cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  function draw(a,b){const ctx=cv.getContext("2d"),d=cv.width/cv.getBoundingClientRect().width;
    ctx.globalCompositeOperation=SK.erase?"destination-out":"source-over";ctx.strokeStyle=SK.pen;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.lineWidth=(SK.erase?22:SK.size)*d;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]+.01,b[1]);ctx.stroke()}
}
function renderSketchUI(){
  $("#vPlan").setAttribute("aria-pressed",!SK.on);$("#vSketch").setAttribute("aria-pressed",SK.on);
  $("#skBar").hidden=!SK.on;$("#theoryBox").hidden=!SK.on;
  document.querySelectorAll("#skBar .pen").forEach(b=>b.setAttribute("aria-pressed",!SK.erase&&b.dataset.c===SK.pen));
  $("#skErase").setAttribute("aria-pressed",SK.erase);
  const p=$("#plan");if(p)p.classList.toggle("sketch",SK.on);
}
function setSketch(on){SK.on=on;renderSketchUI();if(on){S.sel=null;tool=null;render()}}
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
  if(t.id==="vPlan")setSketch(false);else if(t.id==="vSketch")setSketch(true);
  else if(t.classList.contains("pen")){SK.pen=t.dataset.c;SK.erase=false;renderSketchUI()}
  else if(t.id==="skErase"){SK.erase=!SK.erase;renderSketchUI()}
  else if(t.id==="skClear"){if(t.dataset.armed){delete t.dataset.armed;t.textContent=L("Tout effacer","Clear all");const cv=$("#plan canvas.sk");cv.getContext("2d").clearRect(0,0,cv.width,cv.height);try{localStorage.removeItem(skKey())}catch(_){}}
    else{t.dataset.armed=1;t.textContent=L("Sûr ? Touche encore","Sure? Tap again");setTimeout(()=>{delete t.dataset.armed;t.textContent=L("Tout effacer","Clear all")},2500)}}
});
document.addEventListener("input",e=>{if(e.target.id==="theory"){try{localStorage.setItem(thKey(),e.target.value)}catch(_){}}});
window.addEventListener("resize",()=>{const cv=document.querySelector("#plan canvas.sk");if(cv){cv._case=null;sizeSketch(cv)}});
