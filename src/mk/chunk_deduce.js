/* ---------- logical hint ---------- */
function unaryOk([k,v],r,c){
  if(k==="room")return room(r,c)===v;if(k==="notroom")return room(r,c)!==v;if(k==="on")return OBJ[r][c]===v;
  if(k==="adj")return adjTypes(r,c).has(v);if(k==="row")return r===v;if(k==="col")return c===v;return true}
function deduce(){
  const P=M.people.length,cells=[];for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!blocked(r,c))cells.push([r,c]);
  const rm=x=>room(x[0],x[1]);
  let cand=M.people.map((_,p)=>S.place[p]?[S.place[p]]:cells.filter(([r,c])=>(C.clues[p]||[]).every(cl=>unaryOk(cl,r,c))));
  const placedNow=new Set(Object.keys(S.place).map(Number));
  for(let it=0;it<60;it++){
    let ch=false;const set=(p,n)=>{if(n.length!==cand[p].length){cand[p]=n;ch=true}};
    for(let p=0;p<P;p++)if(cand[p].length===1){const [r,c]=cand[p][0];for(let q=0;q<P;q++)if(q!==p)set(q,cand[q].filter(x=>x[0]!==r&&x[1]!==c))}
    for(let p=0;p<P;p++)for(const [k,v] of (C.clues[p]||[])){
      if(k==="same"){const rq=new Set(cand[v].map(rm));set(p,cand[p].filter(x=>rq.has(rm(x))));const rp=new Set(cand[p].map(rm));set(v,cand[v].filter(x=>rp.has(rm(x))))}
      if(["south","north","east","west"].includes(k)){const i=k==="south"||k==="north"?0:1;
        if(k==="south"||k==="east"){const lo=Math.min(...cand[v].map(x=>x[i]));set(p,cand[p].filter(x=>x[i]>lo));const hi=Math.max(...cand[p].map(x=>x[i]));set(v,cand[v].filter(x=>x[i]<hi))}
        else{const hi=Math.max(...cand[v].map(x=>x[i]));set(p,cand[p].filter(x=>x[i]<hi));const lo=Math.min(...cand[p].map(x=>x[i]));set(v,cand[v].filter(x=>x[i]>lo))}}
      if(k==="alone"){for(let q=0;q<P;q++)if(q!==p&&cand[q].length===1){const R=rm(cand[q][0]);set(p,cand[p].filter(x=>rm(x)!==R))}
        if(cand[p].length===1){const R=rm(cand[p][0]);for(let q=0;q<P;q++)if(q!==p)set(q,cand[q].filter(x=>rm(x)!==R))}}
    }
    if(!ch){for(const i of [0,1])for(let j=0;j<N;j++){const ps=[...Array(P).keys()].filter(p=>cand[p].some(x=>x[i]===j));if(ps.length===1)set(ps[0],cand[ps[0]].filter(x=>x[i]===j))}
      if(cand[0].length===1){const R=rm(cand[0][0]);const inR=[...Array(P).keys()].filter(q=>q>0&&cand[q].length===1&&rm(cand[q][0])===R);
        if(inR.length)for(let q=1;q<P;q++){if(!inR.includes(q))set(q,cand[q].filter(x=>rm(x)!==R))}
        else{const can=[...Array(P).keys()].filter(q=>q>0&&cand[q].some(x=>rm(x)===R));if(can.length===1)set(can[0],cand[can[0]].filter(x=>rm(x)===R))}}}
    const found=[...Array(P).keys()].find(p=>!placedNow.has(p)&&cand[p].length===1);
    if(found!=null)return {p:found,cell:cand[found][0]};
    if(!ch)break;
  }
  return null;
}
