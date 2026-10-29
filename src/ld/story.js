/* ================= STORY (récit) ================= */
function hashStr(s){let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let x=seed||1;return()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296}}
var vowelStart=s=>/^[AEIOUYÉÈÊÂÎÔHaeiouyéèêâîôh]/.test(s.replace(/^(Pr|Sir|Maître|Dame|Dr) /,"X"));
function crimeTime(){const r=rng(hashStr(C.id+"t"));const h=21+Math.floor(r()*3),m=[0,5,10,15,20,25,30,35,40,45,50,55][Math.floor(r()*12)];return {fr:m?`${h} h ${String(m).padStart(2,"0")}`:`${h} h`,en:`${h>12?h-12:h}:${String(m).padStart(2,"0")} pm`}}
var DE=Object.assign({chair:["d'un fauteuil","an armchair"],bath:["de la baignoire","the bathtub"],trunk:["d'une malle","a trunk"],book:["d'un grimoire","a grimoire"],potion:["d'une potion","a potion"],
 shelf:["d'une bibliothèque","a bookcase"],cauldron:["d'un chaudron","a cauldron"],plant:["d'une mandragore","a mandrake"],desk:["d'un bureau","a desk"],gramo:["du gramophone","the gramophone"],
 candle:["d'un chandelier","a candelabra"],mirror:["d'un miroir","a mirror"]},typeof DE_X!=="undefined"?DE_X:{});
function nameHTML(p){return `<b class="sn" data-sp="${p}" role="button" tabindex="0" style="color:${inkCol(p)}">${pname(p)}</b>`}
/* predicate without subject */
function KW(k,v,t){return `<span class="kw kw-${k}" data-k="${k}" data-v="${v}" role="button" tabindex="0">${t}</span>`}
function KWr(v){return KW("room",v,rname(v))}
function pred(p,[k,v]){
  const f=M.people[p][1]==="f",Q=typeof v==="number"?nameHTML(v):"",qn=typeof v==="number"?pname(v):"";
  const que=typeof v==="number"&&vowelStart(qn)?"qu'":"que ";
  const O=(t,i)=>KW("obj",t,i===0?OBJN[t][0]:OBJN[t][1]);
  if(LANG==="en")switch(k){
    case "room":return `was in ${KWr(v)}`;case "notroom":return `was definitely not in ${KWr(v)}`;
    case "row":return `was standing somewhere in ${KW("row",v,"row "+ROWS[v])}`;case "col":return `was standing somewhere in ${KW("col",v,"column "+(v+1))}`;
    case "on":return {chair:`was sitting in ${O("chair",1)}`,trunk:`was sitting on ${O("trunk",1)}`,bath:`was in ${O("bath",1)}`,book:`was reading ${O("book",1)}`,potion:`was drinking ${O("potion",1)}`}[v]||(typeof ONX!=="undefined"&&ONX[v]?"was "+ONX[v][1].replace(OBJN[v][1],O(v,1)):`was on ${O(v,1)}`);
    case "adj":return `was standing right next to ${KW("obj",v,DE[v]?DE[v][1]:OBJN[v][1])}`;case "same":return `was in the same room as ${Q}`;
    case "south":return `was further south than ${Q}`;case "north":return `was further north than ${Q}`;case "east":return `was further east than ${Q}`;case "west":return `was further west than ${Q}`;
    case "alone":return `was alone in ${f?"her":"his"} room`;}
  switch(k){
    case "room":return `se trouvait dans ${KWr(v)}`;case "notroom":return `n'était pas dans ${KWr(v)}, c'est certain`;
    case "row":return `se tenait quelque part sur ${KW("row",v,"la rangée "+ROWS[v])}`;case "col":return `se tenait quelque part dans ${KW("col",v,"la colonne "+(v+1))}`;
    case "on":return {chair:`était ${f?"assise":"assis"} dans ${O("chair",0)}`,trunk:`était ${f?"assise":"assis"} sur ${O("trunk",0)}`,bath:`se prélassait dans ${O("bath",0)}`,book:`lisait ${O("book",0)}`,potion:`buvait ${O("potion",0)}`}[v]||(typeof ONX!=="undefined"&&ONX[v]?"était "+ONX[v][0][f?1:0].replace(OBJN[v][0],O(v,0)):`était sur ${O(v,0)}`);
    case "adj":return `se tenait juste à côté ${DE[v]?KW("obj",v,DE[v][0]):"de "+O(v,0)}`;case "same":return `était dans la même pièce ${que}${Q}`;
    case "south":return `se trouvait plus au sud ${que}${Q}`;case "north":return `se trouvait plus au nord ${que}${Q}`;
    case "east":return `se trouvait plus à l'est ${que}${Q}`;case "west":return `se trouvait plus à l'ouest ${que}${Q}`;
    case "alone":return `était ${f?"seule":"seul"} dans sa pièce`;}
}
var FLOUR={fr:[f=>`${f?"Elle":"Il"} avait l'air ${f?"préoccupée":"préoccupé"}.`,f=>`${f?"Elle":"Il"} fredonnait un vieil air de l'Académie.`,f=>`${f?"Elle":"Il"} affirme n'avoir rien entendu.`,f=>`${f?"Elle":"Il"} grignotait un biscuit au miel.`,f=>`${f?"Elle":"Il"} serrait fort sa baguette.`,f=>`${f?"Elle":"Il"} bâillait depuis un bon moment.`],
 en:[f=>`${f?"She":"He"} looked worried.`,f=>`${f?"She":"He"} was humming an old Academy tune.`,f=>`${f?"She":"He"} claims to have heard nothing.`,f=>`${f?"She":"He"} was nibbling a honey biscuit.`,f=>`${f?"She":"He"} was clutching ${f?"her":"his"} wand.`,f=>`${f?"She":"He"} had been yawning for a while.`]};
var LEADS={fr:t=>[`À ${t}, `,"Au même instant, ","Pendant ce temps, ","À cette heure-là, ","Au même moment, ","De son côté, ","Dans le même temps, ","Exactement au même moment, "],
 en:t=>[`At ${t}, `,"At that same instant, ","Meanwhile, ","At that time, ","At the same moment, ","For their part, ","In the meantime, ","At exactly the same moment, "]};
function also(a,t){
  if(LANG==="en"){
    if(/^was definitely not /.test(t))return t.replace(/^was definitely not (.*)$/,"was not $1 either");
    if(/^was standing right next to /.test(t)&&/^was standing/.test(a))return t.replace(/^was standing right next to /,"was also close to ");
    return t.replace(/^(was) /,"$1 also ");
  }
  if(/^n'était pas /.test(t))return t.replace(/^n'était pas (.*), c'est certain$/,"n'était pas non plus $1");
  const v1=a.split(" ").slice(0,2).join(" "),v2=t.split(" ").slice(0,2).join(" ");
  if(v1===v2){
    if(/^se tenait juste à côté /.test(t))t=t.replace(/^se tenait juste à côté /,"était tout près ");
    else if(/^se tenait /.test(t))t=t.replace(/^se tenait /,"était ");
    else if(/^se trouvait /.test(t))t=t.replace(/^se trouvait /,"était ");
    else if(/^était /.test(t))t=t.replace(/^était /,"se trouvait ");
  }
  if(/^se (\S+) /.test(t))return t.replace(/^se (\S+) /,"se $1 aussi ");
  return t.replace(/^(\S+) /,"$1 aussi ");
}
var cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function storyHTML(){
  if(!FLOUR||!LEADS||!DE)return "";
  const r=rng(hashStr(C.id+LANG)),T=crimeTime()[LANG],leads=LEADS[LANG](T),fl=FLOUR[LANG].slice();
  for(let i=fl.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[fl[i],fl[j]]=[fl[j],fl[i]]}
  const order=[...M.people.keys()].filter(p=>p!==0).sort((a,b)=>pname(a).localeCompare(pname(b)));order.push(0);
  const paras=[];let li=0,fi=0;
  paras.push(L(`<p class="st-open">Le drame s'est produit à <b>${T}</b> précises. Voici ce que l'enquête a pu établir.</p>`,`<p class="st-open">The crime happened at exactly <b>${T}</b>. Here is what the investigation was able to establish.</p>`));
  for(const p of order){const f=M.people[p][1]==="f",cl=C.clues[p]||[];
    if(!cl.length){if(p!==0)paras.push(`<p data-p="${p}">${L(`Personne ne sait où se trouvait ${nameHTML(p)} à ce moment-là.`,`Nobody knows where ${nameHTML(p)} was at that moment.`)}</p>`);continue}
    const subj=p===0?L(`la victime, ${nameHTML(p)},`,`the victim, ${nameHTML(p)},`):nameHTML(p);
    const lead=p===0?L("Au moment du drame, ","At the moment of the crime, "):leads[li++%leads.length];
    let txt=lead+subj+" "+pred(p,cl[0])+".";
    if(cl[1])txt+=" "+L(f?"Elle":"Il",f?"She":"He")+" "+also(pred(p,cl[0]),pred(p,cl[1]))+".";
    if(p!==0&&r()<.55)txt+=" "+fl[fi++%fl.length](f);
    txt=txt.replace(/^(<[^>]+>)?(.)/,(m,tag,ch)=>(tag||"")+ch.toUpperCase());
    paras.push(`<p data-p="${p}">${cap(txt)}</p>`);
  }
  paras.push(L(`<p class="st-end">Rappel : une seule personne par rangée et par colonne, et le coupable était seul avec la victime.</p>`,`<p class="st-end">Remember: one person per row and per column, and the culprit was alone with the victim.</p>`));
  return paras.join("");
}
function renderCards(){
  const order=[...M.people.keys()].sort((a,b)=>(a===0)-(b===0)||pname(a).localeCompare(pname(b)));
  $("#cards").innerHTML=`<div class="chips">${order.map(p=>`<button class="card chip2${p===0?" victim":""}${S.place[p]?" placed":""}" aria-pressed="${S.sel===p}" data-p="${p}" aria-label="${pname(p)}, ${prole(p)}"><span class="cph">${ava(p,{victim:p===0})}</span><span class="cnm">${pname(p).replace(/^(Pr|Sir|Maître|Dame|Dr) /,"")}</span>${p===0?`<span class="cvt">${L("victime","victim")}</span>`:""}</button>`).join("")}</div>
    <article class="recit">${storyHTML()}</article>`;
  $("#cards").querySelectorAll(".chip2").forEach(el=>el.onclick=()=>{const p=+el.dataset.p;S.sel=S.sel===p?null:p;if(S.sel!=null)tool=null;save();render();
    if(S.sel!=null&&!document.body.classList.contains("g3")&&matchMedia("(max-width:980px)").matches)$("#board").scrollIntoView({behavior:"smooth",block:"start"})});
  document.querySelectorAll(".recit p[data-p]").forEach(el=>el.classList.toggle("hl",S.sel!=null&&+el.dataset.p===S.sel));
}
/* no more "choose a suspect or a tool" line */
(function(){const _rt=renderTools;renderTools=function(){_rt();const st=$("#status");if(st){st.innerHTML="";st.hidden=true}}})();
