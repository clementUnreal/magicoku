
/* ===== Korean / Japanese story ===== */
var CJK={
 ko:{lead:t=>[`${t}, `,"같은 순간, ","그동안 ","그 시각, ","바로 그때, ","한편 ","동시에 ","정확히 같은 순간, "],
  fl:["걱정스러운 표정이었다.","아카데미의 옛 노래를 흥얼거리고 있었다.","아무 소리도 듣지 못했다고 말한다.","꿀 비스킷을 오물오물 먹고 있었다.","지팡이를 꼭 쥐고 있었다.","한참 전부터 하품을 하고 있었다."]},
 ja:{lead:t=>[`${t}、`,"同じ瞬間、","その間、","その時刻、","ちょうどその時、","一方、","同じ頃、","まさに同じ瞬間、"],
  fl:["心配そうな顔をしていた。","学院の古い歌を口ずさんでいた。","何も聞こえなかったと言っている。","はちみつビスケットをかじっていた。","杖をぎゅっと握りしめていた。","しばらく前からあくびをしていた。"]}};
function cjkTime(){const r=rng(hashStr(C.id+"t"));const h=21+Math.floor(r()*3),m=[0,5,10,15,20,25,30,35,40,45,50,55][Math.floor(r()*12)],h12=h-12;
  return LANG==="ko"?`밤 ${h12}시 ${m?m+"분":"정각"}`:`午後${h12}時${m?m+"分":"ちょうど"}`}
function particle(w,a,b){const c=w.charCodeAt(w.length-1);return (c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28)?a:b}
function predCJK(p,[k,v],second){
  const ko=LANG==="ko",Q=typeof v==="number"?nameHTML(v):"",qn=typeof v==="number"?pname(v):"",obj=t=>KW("obj",t,TX(OBJN[t])),rname=v=>KWr(v),R=v=>KW("row",v,ROWS[v]+(ko?"행":"行")),Co=v=>KW("col",v,(v+1)+(ko?"열":"列"));
  if(ko)switch(k){
    case "room":return `${rname(v)}에 있었다`;
    case "notroom":return second?`${rname(v)}에도 없었다`:`${rname(v)}에는 분명히 없었다`;
    case "row":return `${R(v)} 어딘가에 있었다`;case "col":return `${Co(v)} 어딘가에 있었다`;
    case "on":return {chair:`${obj("chair")}에 앉아 있었다`,trunk:`${obj("trunk")} 위에 앉아 있었다`,bath:`${obj("bath")}에서 느긋하게 쉬고 있었다`,book:`${obj("book")}를 읽고 있었다`,potion:`${obj("potion")}을 마시고 있었다`}[v]||(typeof ONX!=="undefined"&&ONX[v]?ONX[v][2].replace(TX(OBJN[v]),obj(v)):`${obj(v)} 위에 있었다`);
    case "adj":return second?`${obj(v)}${particle(TX(OBJN[v]),"과","와")}도 가까이 있었다`:`${obj(v)} 바로 옆에 있었다`;
    case "same":return `${Q}${particle(qn,"과","와")} 같은 방에 있었다`;
    case "south":return `${Q}보다 더 남쪽에 있었다`;case "north":return `${Q}보다 더 북쪽에 있었다`;
    case "east":return `${Q}보다 더 동쪽에 있었다`;case "west":return `${Q}보다 더 서쪽에 있었다`;
    case "alone":return "자기 방에 혼자 있었다";}
  switch(k){
    case "room":return `${rname(v)}にいた`;
    case "notroom":return second?`${rname(v)}にもいなかった`:`${rname(v)}には絶対にいなかった`;
    case "row":return `${R(v)}のどこかにいた`;case "col":return `${Co(v)}のどこかにいた`;
    case "on":return {chair:`${obj("chair")}に座っていた`,trunk:`${obj("trunk")}の上に座っていた`,bath:`${obj("bath")}でくつろいでいた`,book:`${obj("book")}を読んでいた`,potion:`${obj("potion")}を飲んでいた`}[v]||(typeof ONX!=="undefined"&&ONX[v]?ONX[v][3].replace(TX(OBJN[v]),obj(v)):`${obj(v)}の上にいた`);
    case "adj":return second?`${obj(v)}にも近かった`:`${obj(v)}のすぐそばにいた`;
    case "same":return `${Q}と同じ部屋にいた`;
    case "south":return `${Q}より南にいた`;case "north":return `${Q}より北にいた`;
    case "east":return `${Q}より東にいた`;case "west":return `${Q}より西にいた`;
    case "alone":return "自分の部屋に一人きりでいた";}
}
function storyCJK(){
  if(!CJK)return "";
  const ko=LANG==="ko",X=CJK[LANG],r=rng(hashStr(C.id+LANG)),T=cjkTime(),leads=X.lead(T),fl=X.fl.slice();
  for(let i=fl.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[fl[i],fl[j]]=[fl[j],fl[i]]}
  const order=[...M.people.keys()].filter(p=>p!==0).sort((a,b)=>M.people[a][0].localeCompare(M.people[b][0]));order.push(0);
  const end=ko?". ":"。",paras=[];let li=0,fi=0;
  paras.push(ko?`<p class="st-open">사건은 <b>${T}</b>에 일어났다. 수사로 밝혀진 사실은 다음과 같다.</p>`:`<p class="st-open">事件は<b>${T}</b>に起きた。捜査で明らかになったことは次のとおりだ。</p>`);
  for(const p of order){const cl=C.clues[p]||[],n=pname(p);
    if(!cl.length){if(p!==0)paras.push(`<p data-p="${p}">${ko?`그때 ${nameHTML(p)}${particle(n,"이","가")} 어디에 있었는지는 아무도 모른다.`:`その時${nameHTML(p)}がどこにいたのか、誰も知らない。`}</p>`);continue}
    const lead=p===0?(ko?"사건이 일어난 순간, ":"事件の瞬間、"):leads[li++%leads.length];
    const subj=ko?(p===0?"피해자 ":"")+nameHTML(p)+particle(n,"은","는"):(p===0?"被害者の":"")+nameHTML(p)+"は";
    let txt=lead+subj+(ko?" ":"")+predCJK(p,cl[0])+end;
    if(cl[1])txt+=(ko?"또한 ":"また、")+predCJK(p,cl[1],true)+end;
    if(p!==0&&r()<.55)txt+=fl[fi++%fl.length]+(ko?" ":"");
    paras.push(`<p data-p="${p}">${txt.trim()}</p>`);
  }
  paras.push(ko?`<p class="st-end">기억하세요: 행과 열마다 한 사람만 있을 수 있고, 범인은 피해자와 단둘이 있었습니다.</p>`:`<p class="st-end">ルール：各行・各列に一人だけ。そして犯人は、被害者と二人きりだった。</p>`);
  return paras.join("");
}
renderStatic();render();
