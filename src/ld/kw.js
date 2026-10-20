/* ================= clickable keywords in the story -> highlight on the map ================= */
var KWSEL=null;
function kwCells(k,v){const out=[];for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  if(k==="room"&&C.rooms[r][c]===v||k==="row"&&r===+v||k==="col"&&c===+v||k==="obj"&&OBJ[r][c]===v||k==="person"&&S.place[v]&&S.place[v][0]===r&&S.place[v][1]===c)out.push([r,c])}return out}
function kwApply(){document.querySelectorAll("#marks .mk.kwhl").forEach(e=>e.classList.remove("kwhl","kw-room","kw-obj","kw-row","kw-col","kw-person"));
  document.querySelectorAll(".recit .kw.on,.recit .sn.on").forEach(e=>e.classList.remove("on"));
  if(!KWSEL)return;const [k,v]=KWSEL;
  kwCells(k,v).forEach(([r,c])=>{const el=document.querySelector(`#marks .mk[data-r="${r}"][data-c="${c}"]`);if(el)el.classList.add("kwhl","kw-"+k)});
  const sel=k==="person"?`.recit .sn[data-sp="${v}"]`:`.recit .kw[data-k="${k}"][data-v="${v}"]`;document.querySelectorAll(sel).forEach(e=>e.classList.add("on"))}
(function(){const _rm=renderMarks;renderMarks=function(){_rm.apply(this,arguments);kwApply()};
  const _rc=renderCards;renderCards=function(){_rc.apply(this,arguments);kwApply()};
  const _oc=openCase;openCase=function(i){KWSEL=null;return _oc.apply(this,arguments)};
  function act(t){const kw=t.closest(".recit .kw"),sn=t.closest(".recit .sn");if(!kw&&!sn)return false;
    let key=kw?[kw.dataset.k,kw.dataset.v]:["person",+sn.dataset.sp];
    if(sn){const p=+sn.dataset.sp;S.sel=p;tool=null}
    KWSEL=KWSEL&&KWSEL[0]===key[0]&&String(KWSEL[1])===String(key[1])&&!sn?null:key;
    try{play("select")}catch(e){}
    if(sn){save();render()}else kwApply();
    if(KWSEL&&matchMedia("(max-width:980px)").matches){const pl=$("#plan");if(pl){const r=pl.getBoundingClientRect();if(r.bottom<60||r.top>innerHeight-120)pl.scrollIntoView({behavior:"smooth",block:"center"})}}
    return true}
  document.addEventListener("click",e=>{if(act(e.target)){e.stopPropagation()}},true);
  document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&act(e.target))e.preventDefault()});
})();
try{TUTO.fr[1][2]+=" Touche un <b>mot souligné</b> (pièce, objet, rangée) pour le voir s'illuminer sur le plan.";TUTO.en[1][2]+=" Tap an <b>underlined word</b> (room, object, row) to light it up on the map.";
TUTO.ko[1][2]+=" <b>밑줄 친 단어</b>(방, 물건, 행)를 탭하면 지도에서 빛나요.";TUTO.ja[1][2]+="<b>下線の言葉</b>（部屋・家具・行）をタップすると、見取り図で光ります。"}catch(e){}
