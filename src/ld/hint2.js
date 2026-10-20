
/* ================= progressive, explained hints ================= */
function deduceR(known){known=known||{};const PL=Object.assign({},known,S.place);
  const P=M.people.length,cells=[];for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!blocked(r,c))cells.push([r,c]);
  const rm=x=>room(x[0],x[1]),K=x=>x[0]+","+x[1];
  const U=M.people.map((_,p)=>PL[p]?[PL[p]]:cells.filter(([r,c])=>(C.clues[p]||[]).every(cl=>unaryOk(cl,r,c))));
  let cand=U.map(a=>a.slice());const why=M.people.map(()=>new Map());
  const placedNow=new Set(Object.keys(PL).map(Number));
  const INV={south:"north",north:"south",east:"west",west:"east"};
  for(let it=0;it<60;it++){
    let ch=false;const set=(p,n,why_)=>{if(n.length!==cand[p].length){const keep=new Set(n.map(K));cand[p].forEach(x=>{const k=K(x);if(!keep.has(k)&&!why[p].has(k))why[p].set(k,why_)});cand[p]=n;ch=true}};
    for(let p=0;p<P;p++)if(cand[p].length===1){const [r,c]=cand[p][0];for(let q=0;q<P;q++)if(q!==p)set(q,cand[q].filter(x=>x[0]!==r&&x[1]!==c),{t:"line",q:p,r,c,placed:!!S.place[p],known:!S.place[p]&&!!known[p]})}
    for(let p=0;p<P;p++)for(const [k,v] of (C.clues[p]||[])){
      if(k==="same"){const rq=new Set(cand[v].map(rm));set(p,cand[p].filter(x=>rq.has(rm(x))),{t:"same",q:v});const rp=new Set(cand[p].map(rm));set(v,cand[v].filter(x=>rp.has(rm(x))),{t:"same",q:p})}
      if(INV[k]){const i=k==="south"||k==="north"?0:1;
        if(k==="south"||k==="east"){const lo=Math.min(...cand[v].map(x=>x[i]));set(p,cand[p].filter(x=>x[i]>lo),{t:k,q:v});const hi=Math.max(...cand[p].map(x=>x[i]));set(v,cand[v].filter(x=>x[i]<hi),{t:INV[k],q:p})}
        else{const hi=Math.max(...cand[v].map(x=>x[i]));set(p,cand[p].filter(x=>x[i]<hi),{t:k,q:v});const lo=Math.min(...cand[p].map(x=>x[i]));set(v,cand[v].filter(x=>x[i]>lo),{t:INV[k],q:p})}}
      if(k==="alone"){for(let q=0;q<P;q++)if(q!==p&&cand[q].length===1){const R=rm(cand[q][0]);set(p,cand[p].filter(x=>rm(x)!==R),{t:"alone",q})}
        if(cand[p].length===1){const R=rm(cand[p][0]);for(let q=0;q<P;q++)if(q!==p)set(q,cand[q].filter(x=>rm(x)!==R),{t:"alone2",q:p})}}
    }
    if(!ch){for(const i of [0,1])for(let j=0;j<N;j++){const ps=[...Array(P).keys()].filter(p=>cand[p].some(x=>x[i]===j));if(ps.length===1)set(ps[0],cand[ps[0]].filter(x=>x[i]===j),{t:"only",i,j})}
      if(cand[0].length===1){const R=rm(cand[0][0]);const inR=[...Array(P).keys()].filter(q=>q>0&&cand[q].length===1&&rm(cand[q][0])===R);
        if(inR.length)for(let q=1;q<P;q++){if(!inR.includes(q))set(q,cand[q].filter(x=>rm(x)!==R),{t:"killer"})}
        else{const can=[...Array(P).keys()].filter(q=>q>0&&cand[q].some(x=>rm(x)===R));if(can.length===1)set(can[0],cand[can[0]].filter(x=>rm(x)===R),{t:"killer"})}}}
    const found=[...Array(P).keys()].find(p=>!placedNow.has(p)&&cand[p].length===1);
    if(found!=null){const gr={};for(const [k,w] of why[found]){const g=JSON.stringify(w);(gr[g]=gr[g]||{w,cells:[]}).cells.push(k.split(",").map(Number))}
      return {p:found,cell:cand[found][0],U:U[found],groups:Object.values(gr)}}
    if(!ch)break;
  }
  return null;
}
/* ---- texts ---- */
function hb(p){return `<b style="color:${inkCol(p)}">${pname(p)}</b>`}
function hReason(p,w){const X=hb(p),Q=w.q!=null?hb(w.q):"",f=M.people[p][1]==="f",fq=w.q!=null&&M.people[w.q][1]==="f";
  const D={south:["plus au sud","further south","더 남쪽","より南"],north:["plus au nord","further north","더 북쪽","より北"],east:["plus à l'est","further east","더 동쪽","より東"],west:["plus à l'ouest","further west","더 서쪽","より西"]};
  const que=w.q!=null&&vowelStart(pname(w.q))?"qu'":"que ";
  switch(w.t){
    case "line":if(w.known)return L(`Tu sais déjà que ${Q} va en ${posn(w.r,w.c)} : sa rangée et sa colonne sont prises.`,`You already know ${Q} goes on ${posn(w.r,w.c)}: that row and column are taken.`,`${Q}${particle(pname(w.q),"이","가")} ${posn(w.r,w.c)}에 간다는 걸 이미 알고 있죠. 그래서 그 행과 열은 찼어요.`,`${Q}が${posn(w.r,w.c)}に入ることはもうわかっています。だから、その行と列はふさがっています。`);
      return w.placed?L(`${Q} est déjà en ${posn(w.r,w.c)} : sa rangée et sa colonne sont prises.`,`${Q} is already on ${posn(w.r,w.c)}: that row and column are taken.`,`${Q}${particle(pname(w.q),"이","가")} 이미 ${posn(w.r,w.c)}에 있어서, 그 행과 열은 찼어요.`,`${Q}はもう${posn(w.r,w.c)}にいるので、その行と列はふさがっています。`)
      :L(`${Q} ne peut être qu'en ${posn(w.r,w.c)} (relis son paragraphe) : sa rangée et sa colonne sont donc prises.`,`${Q} can only be on ${posn(w.r,w.c)} (reread their paragraph), so that row and column are taken.`,`${Q}${particle(pname(w.q),"은","는")} ${posn(w.r,w.c)}에만 있을 수 있어요(그 문단을 다시 읽어 보세요). 그래서 그 행과 열은 찼어요.`,`${Q}は${posn(w.r,w.c)}にしかいられません（その段落を読み直して）。だから、その行と列はふさがっています。`);
    case "same":return L(`${X} était dans la même pièce ${que}${Q}, qui ne peut pas se trouver dans ces pièces-là.`,`${X} was in the same room as ${Q}, who can't be in those rooms.`,`${X}${particle(pname(p),"은","는")} ${Q}${particle(pname(w.q),"과","와")} 같은 방에 있었는데, ${Q}${particle(pname(w.q),"은","는")} 그 방들에 있을 수 없어요.`,`${X}は${Q}と同じ部屋にいましたが、${Q}はそれらの部屋にはいられません。`);
    case "south":case "north":case "east":case "west":return L(`${X} se trouvait ${D[w.t][0]} ${que}${Q} : vu les cases où ${Q} peut encore être, celles-ci sont exclues.`,`${X} was ${D[w.t][1]} than ${Q}: given where ${Q} can still be, these squares are ruled out.`,`${X}${particle(pname(p),"은","는")} ${Q}보다 ${D[w.t][2]}에 있었어요. ${Q}${particle(pname(w.q),"이","가")} 있을 수 있는 칸을 생각하면, 이 칸들은 제외돼요.`,`${X}は${Q}${D[w.t][3]}にいました。${Q}がいられるマスを考えると、これらのマスは除外されます。`);
    case "alone":return L(`${X} était ${f?"seule":"seul"} dans sa pièce : impossible de partager la pièce de ${Q}.`,`${X} was alone in their room: they can't share ${Q}'s room.`,`${X}${particle(pname(p),"은","는")} 자기 방에 혼자 있었어요. ${Q}의 방에는 있을 수 없어요.`,`${X}は部屋に一人きりでした。${Q}の部屋にはいられません。`);
    case "alone2":return L(`${Q} était ${fq?"seule":"seul"} dans sa pièce : personne d'autre ne peut y être.`,`${Q} was alone in their room: nobody else can be there.`,`${Q}${particle(pname(w.q),"은","는")} 자기 방에 혼자 있었어요. 다른 사람은 그 방에 있을 수 없어요.`,`${Q}は部屋に一人きりでした。ほかの人はその部屋にいられません。`);
    case "only":{const ln=w.i===0?L(`la rangée ${ROWS[w.j]}`,`row ${ROWS[w.j]}`,`${ROWS[w.j]}행`,`${ROWS[w.j]}行`):L(`la colonne ${w.j+1}`,`column ${w.j+1}`,`${w.j+1}열`,`${w.j+1}列`);
      return L(`Il faut bien quelqu'un dans ${ln}, et ${X} est la seule personne qui peut encore y aller.`,`Someone has to be in ${ln}, and ${X} is the only person who can still go there.`,`${ln}에는 누군가 있어야 하는데, 아직 갈 수 있는 사람은 ${X}뿐이에요.`,`${ln}には誰かがいるはずで、まだ行けるのは${X}だけです。`)}
    case "killer":return L(`Règle du meurtrier : une seule personne était seule avec la victime dans sa pièce.`,`Murderer rule: exactly one person was alone with the victim in their room.`,`범인 규칙: 피해자와 같은 방에 단둘이 있던 사람은 딱 한 명이에요.`,`犯人のルール：被害者と同じ部屋で二人きりだったのは、ちょうど一人だけです。`);}
  return ""}
function hintText(e){const X=hb(e.p),n=e.U?e.U.length:0;
  if(e.kind==="wrong")return L(`Attention : ${X} n'est pas à la bonne place (case en rouge). Relis son paragraphe et cherche ce qui ne colle pas.`,`Careful: ${X} isn't in the right place (red square). Reread their paragraph and look for what doesn't fit.`,`주의: ${X}${particle(pname(e.p),"은","는")} 올바른 자리에 있지 않아요(빨간 칸). 그 문단을 다시 읽고 맞지 않는 점을 찾아보세요.`,`注意：${X}は正しい場所にいません（赤いマス）。段落を読み直して、合わないところを探しましょう。`);
  if(e.kind==="remind")return L(`Tu as déjà trouvé où va ${X} : <b>${posn(...e.cell)}</b>. Place-le pour continuer !`.replace("Place-le",M.people[e.p][1]==="f"?"Place-la":"Place-le"),`You already know where ${X} goes: <b>${posn(...e.cell)}</b>. Place them to continue!`,`${X}의 자리는 이미 알아냈어요: <b>${posn(...e.cell)}</b>. 배치하고 계속하세요!`,`${X}の場所はもうわかっています：<b>${posn(...e.cell)}</b>。置いて先に進みましょう！`);
  if(e.kind==="reveal")return L(`Ici, la déduction est très fine. Pour t'aider à avancer : ${X} était en <b>${posn(...e.cell)}</b>.`,`The deduction is very subtle here. To help you move on: ${X} was on <b>${posn(...e.cell)}</b>.`,`여기서는 추리가 아주 까다로워요. 진행을 돕기 위해 알려 드리면, ${X}${particle(pname(e.p),"은","는")} <b>${posn(...e.cell)}</b>에 있었어요.`,`ここの推理はとても難しいです。先に進めるように：${X}は<b>${posn(...e.cell)}</b>にいました。`);
  if(e.stage===1){const solo=!e.groups.length;
    return L(`Intéresse-toi à ${X}. ${solo?"Son paragraphe, comparé aux objets du plan, suffit à trouver sa case.":"Croise son paragraphe avec les personnes déjà placées et les autres paragraphes : il ne lui reste qu'une seule case possible."}`,
      `Focus on ${X}. ${solo?"Their paragraph, compared with the objects on the map, is enough to find their square.":"Combine their paragraph with the people already placed and the other paragraphs: only one square is left for them."}`,
      `${X}에게 집중해 보세요. ${solo?"그 문단을 지도의 물건과 비교하기만 해도 자리를 찾을 수 있어요.":"그 문단을 이미 배치된 사람들, 다른 문단과 함께 따져 보면 가능한 칸은 하나뿐이에요."}`,
      `${X}に注目しましょう。${solo?"その段落を見取り図の家具とくらべるだけで、マスが見つかります。":"その段落を、もう置いた人やほかの段落と合わせて考えると、残るマスはひとつだけです。"}`)}
  if(e.stage===2){const m=e.groups.reduce((a,g)=>a+g.cells.length,0);
    return L(`D'après son paragraphe, ${X} peut être sur <b>${n}</b> cases (en jaune). Mais ${m>1?`<b>${m}</b> d'entre elles sont impossibles`:`<b>l'une</b> d'elles est impossible`} (en rouge) :`,
      `From their paragraph, ${X} could be on <b>${n}</b> squares (in yellow). But ${m>1?`<b>${m}</b> of them are impossible`:`<b>one</b> of them is impossible`} (in red):`,
      `문단에 따르면 ${X}${particle(pname(e.p),"은","는")} <b>${n}</b>칸(노란색)에 있을 수 있어요. 하지만 그중 <b>${m}</b>칸은 불가능해요(빨간색):`,
      `段落によると、${X}がいられるのは<b>${n}</b>マス（黄色）。でも、そのうち<b>${m}</b>マスはありえません（赤）：`)
      +`<ul>${e.groups.map(g=>`<li>${hReason(e.p,g.w)}</li>`).join("")}</ul>`}
  if(!e.groups.length)return L(`Dans son paragraphe, une seule case du plan correspond : <b>${posn(...e.cell)}</b>. À toi de placer ${X} !`,`Only one square on the map matches their paragraph: <b>${posn(...e.cell)}</b>. Your turn to place ${X}!`,`문단에 맞는 칸은 지도에서 <b>${posn(...e.cell)}</b> 하나뿐이에요. 이제 ${X}${particle(pname(e.p),"을","를")} 배치해 보세요!`,`段落に合うマスは<b>${posn(...e.cell)}</b>だけ。${X}を置いてみましょう！`);
  return L(`Il ne reste donc qu'une seule case pour ${X} : <b>${posn(...e.cell)}</b>. À toi de l'y placer !`,`So only one square is left for ${X}: <b>${posn(...e.cell)}</b>. Your turn to place them!`,`그러니 ${X}에게 남은 칸은 <b>${posn(...e.cell)}</b> 하나뿐이에요. 이제 직접 배치해 보세요!`,`だから${X}に残るマスは<b>${posn(...e.cell)}</b>だけ。自分で置いてみましょう！`)}
/* ---- state + UI ---- */
function hintNew(){
  S.hlog=S.hlog||[];
  for(const p in S.place){const [r,c]=S.place[p],[sr,sc]=C.solution[p];if(r!==sr||c!==sc)return {kind:"wrong",p:+p,cell:[r,c]}}
  const P=M.people.length,left=[...Array(P).keys()].filter(p=>!S.place[p]);if(!left.length)return null;
  const known={};S.hlog.forEach(h=>{if((h.kind==='reveal'||h.kind==='step'&&h.stage===3)&&!S.place[h.p])known[h.p]=h.cell});
  const last=S.hlog[S.hlog.length-1],d=deduceR(known);
  if(d){const cont=last&&last.kind==="step"&&last.p===d.p&&!S.place[d.p]&&last.stage<3;
    let stage=cont?last.stage+1:1;if(stage===2&&!d.groups.length)stage=3;
    return {kind:"step",p:d.p,stage,cell:d.cell,U:d.U,groups:d.groups}}
  const kn=new Set(S.hlog.filter(h=>(h.kind==='reveal'||h.kind==='step'&&h.stage===3)).map(h=>h.p));const p=left.find(q=>!kn.has(q));
  if(p==null){const q=left[0];return {kind:'remind',p:q,cell:C.solution[q]}}return {kind:"reveal",p,cell:C.solution[p]}}
function hintCells(e){const o={cand:[],bad:[],ans:[],wrong:[]};if(!e)return o;
  if(e.kind==="wrong")o.wrong=[e.cell];else if(e.kind==="reveal"||e.kind==="remind")o.ans=[e.cell];
  else if(e.stage===1){}else if(e.stage===2){const bad=new Set();e.groups.forEach(g=>g.cells.forEach(x=>bad.add(x+"")));o.cand=e.U.filter(x=>!bad.has(x+""));o.bad=e.U.filter(x=>bad.has(x+""))}else o.ans=[e.cell];
  return o}
function hintApply(){document.querySelectorAll("#marks .mk.hc").forEach(el=>el.classList.remove("hc","hc-cand","hc-bad","hc-ans","hc-wrong"));
  document.querySelectorAll('.recit p.hhl').forEach(x=>x.classList.remove('hhl'));const e=S.hview!=null&&S.hlog?S.hlog[S.hview]:null;if(!e)return;const pp_=document.querySelector(`.recit p[data-p="${e.p}"]`);if(pp_)pp_.classList.add('hhl');const o=hintCells(e);
  for(const k in o)o[k].forEach(([r,c])=>{const el=document.querySelector(`#marks .mk[data-r="${r}"][data-c="${c}"]`);if(el)el.classList.add("hc","hc-"+k)})}
function renderHintBox(){let box=$("#hintBox");const bd=$("#board");if(!bd)return;
  if(!box){box=document.createElement("div");box.id="hintBox";bd.parentNode.insertBefore(box,bd);
    box.addEventListener("click",ev=>{const ch=ev.target.closest("[data-hv]");if(ch){const i=+ch.dataset.hv;S.hview=S.hview===i?null:i;save();renderHintBox();hintApply();play("select");return}
      if(ev.target.closest(".hbx")){S.hview=null;save();renderHintBox();hintApply()}})}
  const log=S.hlog||[];box.hidden=!log.length;if(!log.length)return;
  const e=S.hview!=null?log[S.hview]:null;
  box.innerHTML=`<div class="hbh"><span class="hbt">💡 ${L("Indices","Hints","힌트","ヒント")}</span><div class="hchips">${log.map((x,i)=>`<button class="hch${S.hview===i?" on":""}" data-hv="${i}" aria-label="${L("Indice","Hint","힌트","ヒント")} ${i+1}">${i+1}</button>`).join("")}</div>${e?`<button class="hbx" aria-label="✕">✕</button>`:""}</div>`+
    (e?`<div class="hbb">${e.kind==="step"?`<div class="hstage">${[1,2,3].map(s=>`<i class="${s<=e.stage?"on":""}"></i>`).join("")}<span>${L(["","Piste","Raisonnement","Conclusion"][e.stage],["","Lead","Reasoning","Conclusion"][e.stage],["","실마리","추론","결론"][e.stage],["","糸口","推理","結論"][e.stage])}</span></div>`:""}${hintText(e)}</div>`:"")}
hint=function(){
  const e=hintNew();
  if(!e){toast(L("Tout le monde est placé : appuie sur Valider !","Everyone is placed: press Check!","모두 배치했어요. ‘확인’을 누르세요!","全員を配置しました。「答え合わせ」を押してください！"));return}
  S.hlog=S.hlog||[];S.hlog.push(e);S.hview=S.hlog.length-1;S.hints=(S.hints||0)+1;save();
  renderHintBox();hintApply();try{play("hint")}catch(_){}
  if(typeof renderTimer==="function")renderTimer();
  const box=$("#hintBox");if(box&&matchMedia("(max-width:980px)").matches){const r=box.getBoundingClientRect();if(r.top>innerHeight-80||r.bottom<0)box.scrollIntoView({behavior:"smooth",block:"nearest"})}
};
(function(){const _rm=renderMarks;renderMarks=function(){_rm.apply(this,arguments);hintApply()};
  const _r=render;render=function(){_r.apply(this,arguments);renderHintBox();hintApply()};
  try{TUTO.fr[8][2]="Le bouton <b>Indice</b> te guide pas à pas : d'abord la personne à regarder, puis le raisonnement, et enfin la bonne case. Tu peux relire tes indices à tout moment.";
    TUTO.en[8][2]="<b>Hint</b> guides you step by step: first who to look at, then the reasoning, and finally the right square. You can reread your hints at any time.";
    TUTO.ko[8][2]="<b>힌트</b>는 단계별로 안내해요. 먼저 살펴볼 사람, 다음은 추론, 마지막으로 정답 칸. 사용한 힌트는 언제든 다시 볼 수 있어요.";
    TUTO.ja[8][2]="<b>ヒント</b>は一歩ずつ導きます。まず注目する人物、次に推理、最後に正しいマス。使ったヒントはいつでも読み返せます。"}catch(_){}
})();
