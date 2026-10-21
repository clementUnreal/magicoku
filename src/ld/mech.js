
/* ================= Story mode: one mechanic per chapter ================= */
var MECH_IDS=["dist","train","cnt","liar","frost","mirror","knight","poison","dark","mix"];
function storyChap(){const m=C&&/^s(\d+)n(\d+)$/.exec(C.id);return m?+m[1]:0}
function mechSpecial(){return (typeof RUSH!=="undefined"&&RUSH.on)||(typeof NIGHT!=="undefined"&&NIGHT.on)||(typeof LIAR!=="undefined"&&LIAR.on)}
function mechOf(){if(mechSpecial())return null;const c=storyChap();return c?MECH_IDS[c-1]:null}
function mechDark(){if(mechSpecial())return false;return mechOf()==="dark"||!!(C&&C.dark)}
function mechLiar(){return !mechSpecial()&&C&&C.liar!=null&&mechOf()==="liar"}
function nearPoison(r,c){if(!OBJ)return false;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const rr=r+a,cc=c+b;if(rr>=0&&rr<N&&cc>=0&&cc<N&&OBJ[rr][cc]==="poison")return true}return false}
function hasPoison(){if(!OBJ)return false;for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(OBJ[r][c]==="poison")return true;return false}
function mrel(k,v,x,y){
  if(k==="dist")return Math.abs(x[0]-y[0])+Math.abs(x[1]-y[1])===v[1];
  if(k==="knight"){const a=Math.abs(x[0]-y[0]),b=Math.abs(x[1]-y[1]);return (a===1&&b===2)||(a===2&&b===1)}
  if(k==="mirc")return y[0]===N-1-x[0]&&y[1]===N-1-x[1];
  if(k==="mird")return y[0]===x[1]&&y[1]===x[0];
  if(k==="mira")return y[0]===N-1-x[1]&&y[1]===N-1-x[0];
  return true}
var MREL={dist:1,knight:1,mirc:1,mird:1,mira:1};
(function(){
  /* ---------- clue sentences ---------- */
  const de=(qn,Q)=>vowelStart(qn)?"d'"+Q:"de "+Q;
  const corner=()=>"A"+N;
  function predNew(p,[k,v],second){
    const lg=LANG,A=x=>nameHTML(x),an=x=>pname(x);
    if(k==="dist"){const [q,d]=v;return L(`se tenait à exactement <b>${d} pas</b> ${de(an(q),A(q))}, d'après ses empreintes`,`was standing exactly <b>${d} steps</b> from ${A(q)}, according to the footprints`,`발자국을 보면 ${A(q)}에게서 정확히 <b>${d}걸음</b> 떨어진 곳에 있었다`,`足跡によると、${A(q)}からちょうど<b>${d}歩</b>離れたところにいた`)}
    if(k==="knight")return L(`était à un seul <b>crochet de balai</b> ${de(an(v),A(v))} (2 cases tout droit, puis 1 sur le côté)`,`was a single <b>broom hook</b> away from ${A(v)} (2 squares straight, then 1 to the side)`,`${A(v)}에게서 <b>빗자루 꺾기</b> 한 번 거리에 있었다(직진 2칸, 옆으로 1칸)`,`${A(v)}から<b>ほうきターン</b>1回の位置にいた（まっすぐ2マス、横に1マス）`);
    if(k==="mirc")return L(`était le <b>reflet</b> ${de(an(v),A(v))} par rapport au centre du lac`,`was ${A(v)}'s <b>reflection</b> through the centre of the lake`,`호수 한가운데를 기준으로 ${A(v)}의 <b>반사된 자리</b>에 있었다`,`湖の中心をはさんで${A(v)}と<b>鏡写し</b>の位置にいた`);
    if(k==="mird")return L(`était le <b>reflet</b> ${de(an(v),A(v))} par rapport à la grande diagonale (de A1 au coin opposé)`,`was ${A(v)}'s <b>reflection</b> across the long diagonal (from A1 to the opposite corner)`,`A1에서 반대쪽 구석까지 이어진 대각선을 기준으로 ${A(v)}의 <b>반사된 자리</b>에 있었다`,`A1から反対の角まで続く対角線をはさんで${A(v)}と<b>鏡写し</b>の位置にいた`);
    if(k==="mira")return L(`était le <b>reflet</b> ${de(an(v),A(v))} par rapport à l'autre diagonale (de ${corner()} au coin opposé)`,`was ${A(v)}'s <b>reflection</b> across the other diagonal (from ${corner()} to the opposite corner)`,`${corner()}에서 반대쪽 구석까지 이어진 대각선을 기준으로 ${A(v)}의 <b>반사된 자리</b>에 있었다`,`${corner()}から反対の角まで続く対角線をはさんで${A(v)}と<b>鏡写し</b>の位置にいた`);
    if(k==="mid"){const [a,b]=v;return L(`se tenait exactement <b>au milieu</b> entre ${A(a)} et ${A(b)}`,`was standing exactly <b>halfway</b> between ${A(a)} and ${A(b)}`,`${A(a)}${particle(an(a),"과","와")} ${A(b)} 사이 정확히 <b>한가운데</b>에 있었다`,`${A(a)}と${A(b)}のちょうど<b>真ん中</b>にいた`)}
    return null}
  const _p=pred;pred=function(p,cl){return predNew(p,cl)||_p.apply(this,arguments)};
  if(typeof predCJK==="function"){const _pc=predCJK;predCJK=function(p,cl,second){return predNew(p,cl,second)||_pc.apply(this,arguments)}}
  /* register lines (room counts) + chapter reminder */
  function regLines(){const g=(C.clues&&C.clues["-1"])||[];const bank=mechOf()==="cnt";
    return g.filter(cl=>cl[0]==="cnt").map(([k,[Y,n]])=>{const R=KWr(Y);
      const fr=n===0?`${R} était vide`:`il y avait exactement <b>${n}</b> ${n>1?"personnes":"personne"} dans ${R}`;
      return `<p class="st-reg">📒 ${L(`D'après le registre ${bank?"de la banque":"des allées et venues"}, ${fr} à ce moment-là${n>0?" (victime comprise)":""}.`,
        `According to the ${bank?"bank's register":"register of comings and goings"}, ${n===0?`${R} was empty`:`there ${n>1?"were":"was"} exactly <b>${n}</b> ${n>1?"people":"person"} in ${R}`} at that moment${n>0?" (victim included)":""}.`,
        `${bank?"은행":"출입"} 기록에 따르면 그 시각 ${R}에는 ${n===0?"아무도 없었다":`피해자를 포함해 정확히 <b>${n}명</b>이 있었다`}.`,
        `${bank?"銀行の":"出入りの"}記録によると、その時${R}には${n===0?"誰もいなかった":`被害者を含めてちょうど<b>${n}人</b>がいた`}。`)}</p>`}).join("")}
  function reminder(){const m=mechOf(),set=new Set();if(!m)return "";
    const cl=Object.values(C.clues||{}).flat();cl.forEach(x=>set.add(x[0]));if(hasPoison())set.add("poison");
    const out=[];
    if(set.has("dist"))out.push(L("Un <b>pas</b> = une case vers le haut, le bas, la gauche ou la droite (jamais en diagonale), même à travers les murs.","One <b>step</b> = one square up, down, left or right (never diagonally), even through walls.","<b>한 걸음</b> = 위, 아래, 왼쪽, 오른쪽으로 한 칸(대각선은 안 돼요). 벽을 지나도 세어요.","<b>1歩</b>＝上下左右に1マス（ななめは不可）。壁ごしでも数えます。"));
    if(set.has("knight"))out.push(L("Un <b>crochet de balai</b> = 2 cases tout droit puis 1 sur le côté, comme le cavalier aux échecs.","A <b>broom hook</b> = 2 squares straight then 1 to the side, like a knight in chess.","<b>빗자루 꺾기</b> = 직진 2칸 후 옆으로 1칸, 체스의 나이트처럼 움직여요.","<b>ほうきターン</b>＝まっすぐ2マス進んで横に1マス。チェスのナイトと同じです。"));
    if(set.has("mirc")||set.has("mird")||set.has("mira")||set.has("mid"))out.push(L("Un <b>reflet</b> se trouve à la même distance de l'autre côté du centre ou de la diagonale.","A <b>reflection</b> sits the same distance away on the other side of the centre or of the diagonal.","<b>반사된 자리</b>는 중심이나 대각선 반대편, 같은 거리에 있어요.","<b>鏡写し</b>の位置は、中心や対角線の反対側、同じ距離のところです。"));
    if(set.has("poison"))out.push(L("☠️ Personne ne peut se tenir sur une <b>fiole de poison</b> ni sur les 8 cases autour (diagonales comprises).","☠️ Nobody can stand on a <b>poison flask</b> or on the 8 squares around it (diagonals included).","☠️ <b>독약 병</b> 위나 그 주변 8칸(대각선 포함)에는 아무도 있을 수 없어요.","☠️ <b>毒薬のびん</b>の上と、そのまわり8マス（ななめも含む）には誰もいられません。"));
    if(set.has("cnt"))out.push(L("Le <b>registre</b> compte tout le monde, victime comprise.","The <b>register</b> counts everyone, victim included.","<b>기록</b>은 피해자를 포함해 모든 사람을 세요.","<b>記録</b>は被害者も含めて全員を数えます。"));
    return out.length?`<p class="st-mech">${out.join("<br>")}</p>`:""}
  const _sh=storyHTML;storyHTML=function(){
    if(mechLiar()&&typeof liarStory==="function")return liarStory();
    let h=_sh.apply(this,arguments);if(!mechOf())return h;
    const extra=regLines()+reminder();if(!extra)return h;
    const i=h.lastIndexOf('<p class="st-end">');return i<0?h+extra:h.slice(0,i)+extra+h.slice(i)};
  /* liar chapter: no hints */
  const _h=hint;hint=function(){if(mechLiar()){toast(L("Pas d'indice ici : un marchand ment, à toi de le démasquer !","No hints here: a merchant is lying, it's up to you to unmask them!","여기서는 힌트를 쓸 수 없어요. 상인 한 명이 거짓말을 하니 직접 밝혀내세요!","ここではヒントは使えません。商人の一人が嘘をついている。自分で見抜こう！"));return}return _h.apply(this,arguments)};
  const _r=render;render=function(){_r.apply(this,arguments);const b=$("#tHint");if(!b||mechSpecial())return;
    if(mechLiar()){b.classList.add("nohint");b.disabled=true;b.innerHTML=`<span>🚫 ${L("Pas d'indice","No hints","힌트 없음","ヒントなし")}</span><small>${L("Quelqu'un ment…","Someone is lying…","누군가 거짓말을 해요…","誰かが嘘をついている……")}</small>`;
      if(S.solved){const el=document.querySelector(`.recit p[data-p="${C.liar}"]`);if(el)el.classList.add("lie")}}};
  /* poison: green halo on flasks */
  const _rb=renderBoard;renderBoard=function(){_rb.apply(this,arguments);document.body.classList.toggle("mech-poison",!mechSpecial()&&hasPoison());
    document.body.classList.toggle("liar",mechLiar()||(typeof LIAR!=="undefined"&&LIAR.on))};
})();
