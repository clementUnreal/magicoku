/* ================= Story season 2 (chapters 11-20): one new rule per chapter =================
   11 ghost (rules shared with the Halloween event, see halloween.js) · 12 owl flight (king distance) · 13 diagonals
   14 corner to corner · 15 the scales (more people in A than in B) · 16 even/odd columns · 17 closer to an object
   18 candlelight (the 8 squares around a candelabra are lit) · 19 rows/columns in between · 20 everything mixed */
MECH_IDS.push("ghost","owl","diag","kiss","more","par","closer","lit","gap","mix2");
(function(){
  const lit=(r,c)=>{if(!OBJ)return false;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const rr=r+a,cc=c+b;if(rr>=0&&rr<N&&cc>=0&&cc<N&&OBJ[rr][cc]==="candle")return true}return false};
  window.mechLit=lit;
  /* ---------- clue sentences (fr, en, ko, ja) ---------- */
  const de=(qn,Q)=>vowelStart(qn)?"d'"+Q:"de "+Q;
  const que=qn=>vowelStart(qn)?"qu'":"que ";
  const wa=n=>typeof particle==="function"?particle(n,"과","와"):"와";
  const OK=(t,i)=>KW("obj",t,i===0?(DE[t]?DE[t][0]:"de "+OBJN[t][0]):i===1?(DE[t]?DE[t][1]:OBJN[t][1]):TX(OBJN[t]));
  function predS2(p,[k,v]){
    const A=x=>nameHTML(x),an=x=>pname(x),f=M.people[p]&&M.people[p][1]==="f";
    if(k==="owl"){const [q,d]=v;return L(`se trouvait à <b>${d} ${d>1?"cases":"case"}</b> ${de(an(q),A(q))} à vol de chouette`,`was <b>${d} ${d>1?"squares":"square"}</b> from ${A(q)} as the owl flies`,`올빼미가 나는 거리로 ${A(q)}에게서 <b>${d}칸</b> 떨어져 있었다`,`フクロウの飛び方で${A(q)}から<b>${d}マス</b>のところにいた`)}
    if(k==="diag")return L(`était sur la même <b>diagonale</b> ${que(an(v))}${A(v)}`,`was on the same <b>diagonal</b> as ${A(v)}`,`${A(v)}${wa(an(v))} 같은 <b>대각선</b> 위에 있었다`,`${A(v)}と同じ<b>ななめの線</b>の上にいた`);
    if(k==="kiss")return L(`touchait ${A(v)} <b>par un coin</b>`,`was touching ${A(v)} <b>corner to corner</b>`,`${A(v)}${wa(an(v))} <b>모서리끼리</b> 맞닿아 있었다`,`${A(v)}と<b>角どうしで</b>接していた`);
    if(k==="lonely")return L(`ne touchait <b>personne</b>, pas même par un coin`,`wasn't touching <b>anyone</b>, not even corner to corner`,`<b>아무와도</b> 맞닿아 있지 않았다(모서리끼리도)`,`<b>誰とも</b>接していなかった（角どうしでも）`);
    if(k==="cpar")return L(`se tenait dans une colonne <b>${v?"paire":"impaire"}</b>`,`was in an <b>${v?"even":"odd"}</b>-numbered column`,`<b>${v?"짝수":"홀수"}</b> 번째 열에 있었다`,`<b>${v?"偶数":"奇数"}</b>番目の列にいた`);
    if(k==="cspar")return L(`avait un numéro de colonne <b>de même parité</b> que celui ${de(an(v),A(v))} (tous deux pairs ou tous deux impairs)`,`had a column number with the <b>same parity</b> as ${A(v)}'s (both even or both odd)`,`${A(v)}${wa(an(v))} <b>짝홀이 같은</b> 번호의 열에 있었다(둘 다 짝수이거나 둘 다 홀수)`,`${A(v)}と<b>偶奇が同じ</b>番号の列にいた（どちらも偶数か、どちらも奇数）`);
    if(k==="cdpar")return L(`avait un numéro de colonne <b>de parité différente</b> de celui ${de(an(v),A(v))} (l'un pair, l'autre impair)`,`had a column number with a <b>different parity</b> from ${A(v)}'s (one even, the other odd)`,`${A(v)}${wa(an(v))} <b>짝홀이 다른</b> 번호의 열에 있었다(하나는 짝수, 하나는 홀수)`,`${A(v)}と<b>偶奇が違う</b>番号の列にいた（一方が偶数、もう一方が奇数）`);
    if(k==="closer"){const [t,q]=v;return L(`se trouvait <b>plus près</b> ${OK(t,0)} ${que(an(q))}${A(q)}`,`was <b>closer</b> to ${OK(t,1)} than ${A(q)}`,`${A(q)}보다 ${OK(t,2)}에 <b>더 가까이</b> 있었다`,`${A(q)}よりも${OK(t,3)}の<b>近く</b>にいた`)}
    if(k==="lit")return L(`se tenait <b>dans la lumière</b> d'un chandelier`,`was standing <b>in the light</b> of a candelabra`,`촛대 <b>불빛 안에</b> 서 있었다`,`燭台の<b>光の中</b>に立っていた`);
    if(k==="shade")return L(`se tenait <b>dans l'ombre</b>, loin de tout chandelier`,`was standing <b>in the shadows</b>, away from every candelabra`,`모든 촛대에서 떨어진 <b>어둠 속</b>에 서 있었다`,`どの燭台からも離れた<b>暗がり</b>に立っていた`);
    if(k==="rgap"||k==="cgap"){const [q,n]=v,row=k==="rgap";
      if(n===0)return L(`était sur ${row?"une rangée":"une colonne"} <b>${row?"voisine":"voisine"}</b> de celle ${de(an(q),A(q))}`,`was in the ${row?"row":"column"} <b>right next to</b> ${A(q)}'s`,`${A(q)}의 <b>바로 옆 ${row?"행":"열"}</b>에 있었다`,`${A(q)}の<b>すぐ隣の${row?"行":"列"}</b>にいた`);
      return L(`avait exactement <b>${n} ${row?(n>1?"rangées":"rangée"):(n>1?"colonnes":"colonne")}</b> entre la sienne et celle ${de(an(q),A(q))}`,`had exactly <b>${n} ${row?(n>1?"rows":"row"):(n>1?"columns":"column")}</b> between ${f?"hers":"his"} and ${A(q)}'s`,`${A(q)}${wa(an(q))}의 사이에 정확히 <b>${n}개의 ${row?"행":"열"}</b>이 있었다`,`${A(q)}との間に、ちょうど<b>${n}${row?"行":"列"}</b>あった`)}
    return null}
  const _p=pred;pred=function(p,cl){return predS2(p,cl)||_p.apply(this,arguments)};
  if(typeof predCJK==="function"){const _pc=predCJK;predCJK=function(p,cl,second){return predS2(p,cl)||_pc.apply(this,arguments)}}
  if(typeof clueText==="function"){const _ct=clueText;clueText=function(p,cl){const s=cl&&predS2(p,cl);if(s)return `<b>${pname(p)}</b> ${s}.`;return _ct.apply(this,arguments)}}
  /* hints and highlights only need to know which squares fit the one-person clues */
  if(typeof unaryOk==="function"){const _u=unaryOk;unaryOk=function(cl,r,c){if(cl){if(cl[0]==="cpar")return (c+1)%2===(cl[1]?0:1);if(cl[0]==="lit")return lit(r,c);if(cl[0]==="shade")return !lit(r,c)}return _u.apply(this,arguments)}}
  /* ---------- the scales (more people in A than in B) + reminders at the end of the story ---------- */
  function moreLines(){const g=(C.clues&&C.clues["-1"])||[];
    return g.filter(cl=>cl[0]==="more").map(([k,[a,b]])=>`<p class="st-reg">⚖️ ${L(`Il y avait <b>plus de monde</b> dans ${KWr(a)} que dans ${KWr(b)} (victime comprise).`,`There were <b>more people</b> in ${KWr(a)} than in ${KWr(b)} (victim included).`,`${KWr(a)}에는 ${KWr(b)}보다 <b>사람이 더 많았다</b>(피해자 포함).`,`${KWr(a)}には${KWr(b)}より<b>多くの人</b>がいた（被害者も含む）。`)}</p>`).join("")}
  function reminder(){const set=new Set(Object.values(C.clues||{}).flat().map(x=>x[0]));const out=[];
    if(set.has("owl"))out.push(L("🦉 <b>À vol de chouette</b>, une case en diagonale compte comme un seul pas : on compte le plus grand écart, en rangées ou en colonnes. Les murs n'arrêtent pas la chouette.","🦉 <b>As the owl flies</b>, a diagonal square counts as one step: count the larger gap, in rows or in columns. Walls don't stop the owl.","🦉 <b>올빼미가 나는 거리</b>에서는 대각선 한 칸도 한 걸음이에요. 행 차이와 열 차이 중 큰 쪽을 세요. 벽은 올빼미를 막지 못해요.","🦉 <b>フクロウの飛び方</b>では、ななめの1マスも1歩。行の差と列の差の大きいほうを数えます。壁はフクロウを止めません。"));
    if(set.has("diag"))out.push(L("↗️ Deux personnes sont sur la même <b>diagonale</b> quand elles sont séparées d'autant de rangées que de colonnes, comme le fou aux échecs.","↗️ Two people are on the same <b>diagonal</b> when they are as many rows apart as columns, like a bishop in chess.","↗️ 행 차이와 열 차이가 같으면 같은 <b>대각선</b> 위에 있어요. 체스의 비숍처럼요.","↗️ 行の差と列の差が同じなら、同じ<b>ななめの線</b>の上。チェスのビショップと同じです。"));
    if(set.has("kiss")||set.has("lonely"))out.push(L("🤝 Deux personnes se touchent <b>par un coin</b> quand elles sont sur deux cases en diagonale l'une de l'autre, même à travers un mur.","🤝 Two people touch <b>corner to corner</b> when their squares are diagonal neighbours, even through a wall.","🤝 두 사람이 대각선으로 이웃한 칸에 있으면 <b>모서리끼리</b> 맞닿은 거예요. 벽이 있어도 마찬가지예요.","🤝 2人がななめ隣のマスにいれば<b>角どうしで</b>接しています。壁があっても同じです。"));
    if(set.has("more"))out.push(L("⚖️ La <b>balance</b> compte tout le monde, victime comprise. Une pièce vide compte zéro.","⚖️ The <b>scales</b> count everyone, victim included. An empty room counts as zero.","⚖️ <b>저울</b>은 피해자를 포함해 모두를 세요. 빈 방은 0명이에요.","⚖️ <b>天秤</b>は被害者も含めて全員を数えます。空の部屋は0人です。"));
    if(set.has("cpar")||set.has("cspar")||set.has("cdpar"))out.push(L("🎲 Les colonnes <b>paires</b> sont 2, 4, 6, 8 ; les <b>impaires</b> sont 1, 3, 5, 7, 9.","🎲 <b>Even</b> columns are 2, 4, 6, 8; <b>odd</b> ones are 1, 3, 5, 7, 9.","🎲 <b>짝수</b> 열은 2, 4, 6, 8이고 <b>홀수</b> 열은 1, 3, 5, 7, 9예요.","🎲 <b>偶数</b>の列は2・4・6・8、<b>奇数</b>の列は1・3・5・7・9です。"));
    if(set.has("closer"))out.push(L("📏 <b>Plus près</b> : on compte les pas jusqu'à l'objet le plus proche de ce type (haut, bas, gauche, droite, à travers les murs). Être dessus compte zéro pas.","📏 <b>Closer</b>: count the steps to the nearest object of that kind (up, down, left, right, through walls). Standing on it counts as zero steps.","📏 <b>더 가까이</b>: 그 종류의 가장 가까운 물건까지 걸음 수를 세요(위·아래·왼쪽·오른쪽, 벽을 지나도 돼요). 그 위에 있으면 0걸음이에요.","📏 <b>近く</b>：その種類のいちばん近い物まで歩数を数えます（上下左右、壁を通りぬけてOK）。上にいれば0歩です。"));
    if(set.has("lit")||set.has("shade"))out.push(L("🕯️ Un chandelier éclaire les <b>8 cases</b> qui l'entourent (diagonales comprises), même à travers un mur. Toutes les autres cases sont dans l'ombre.","🕯️ A candelabra lights up the <b>8 squares</b> around it (diagonals included), even through a wall. Every other square is in the shadows.","🕯️ 촛대는 주변 <b>8칸</b>(대각선 포함)을 밝혀요. 벽 너머도 마찬가지예요. 나머지 칸은 모두 어둠 속이에요.","🕯️ 燭台はまわりの<b>8マス</b>（ななめも含む）を照らします。壁の向こうも同じ。ほかのマスはすべて暗がりです。"));
    if(set.has("rgap")||set.has("cgap"))out.push(L("🔢 On compte les rangées (ou les colonnes) <b>entre</b> les deux personnes, sans compter les leurs.","🔢 Count the rows (or columns) <b>between</b> the two people, not their own.","🔢 두 사람 <b>사이</b>의 행(또는 열)을 세요. 두 사람이 있는 줄은 빼고요.","🔢 2人の<b>あいだ</b>の行（または列）を数えます。2人がいる行や列は数えません。"));
    return out.length?`<p class="st-mech">${out.join("<br>")}</p>`:""}
  const _sh=storyHTML;storyHTML=function(){let h=_sh.apply(this,arguments);if(!C||mechSpecial())return h;
    const extra=moreLines()+reminder();if(!extra)return h;const i=h.lastIndexOf('<p class="st-end">');return i<0?h+extra:h.slice(0,i)+extra+h.slice(i)};
  /* ---------- candlelight: the lit squares glow on the map ---------- */
  const hasLight=()=>!!C&&!mechSpecial()&&Object.values(C.clues||{}).flat().some(x=>x[0]==="lit"||x[0]==="shade");
  const _rm=renderMarks;renderMarks=function(){const r=_rm.apply(this,arguments);try{const on=hasLight();document.querySelectorAll("#marks .mk").forEach(el=>{el.classList.toggle("litc",on&&lit(+el.dataset.r,+el.dataset.c))})}catch(_){}return r};
  const st=document.createElement("style");st.textContent=`#marks .mk.litc{background:radial-gradient(circle at 50% 50%,rgba(255,226,140,.55),rgba(255,190,80,.28) 75%)!important;box-shadow:inset 0 0 0 2px rgba(255,190,70,.75),inset 0 0 12px rgba(255,200,90,.6)!important}`;document.head.appendChild(st);
})();
/* ---------- chapter rules (popup "Nouvelle règle" + button at the top of the story) ---------- */
Object.assign(MECH_INFO,{
 ghost:["👻",["Le fantôme","The ghost","유령","幽霊"],["Dans la forteresse, un suspect erre en fantôme. Il peut flotter au-dessus des meubles (bibliothèque, chaudron…), il traverse les murs (pour lui, « à côté » compte aussi de l'autre côté d'un mur) et il ne compte pas dans les pièces : il n'est jamais le coupable et peut se trouver dans la pièce de la victime en plus du coupable. Comme tout le monde, il reste seul sur sa rangée et sa colonne.",
   "In the fortress, one suspect roams as a ghost. It can float over furniture (bookcase, cauldron…), it goes through walls (for the ghost, “next to” also counts across a wall) and it doesn't count in rooms: it is never the culprit and may be in the victim's room as well as the culprit. Like everyone, it stays alone in its row and column.",
   "요새에서는 용의자 한 명이 유령이 되어 떠돌아요. 가구 위에 떠 있을 수 있고(책장, 가마솥…), 벽을 통과하며(유령에게 ‘옆’은 벽 너머도 포함해요), 방 인원에 포함되지 않아요. 범인이 될 수 없고, 범인과 함께 피해자의 방에 있을 수도 있어요. 다른 사람처럼 행과 열에는 혼자예요.",
   "要塞では容疑者の一人が幽霊になってさまよっています。家具の上に浮かぶことができ（本棚、大釜…）、壁をすり抜け（幽霊にとって「となり」は壁の向こうも含みます）、部屋の人数には数えません。犯人にはならず、犯人と一緒に被害者の部屋にいることもあります。ほかの人と同じく、行と列には1人だけです。"]],
 owl:["🦉",["Vol de chouette","As the owl flies","올빼미가 나는 거리","フクロウの飛び方"],["Les chouettes de la forêt ont tout vu. « À 2 cases à vol de chouette » : la chouette vole en ligne droite ou en diagonale, et une case en diagonale compte comme un seul pas. On compte donc le plus grand écart, en rangées ou en colonnes. Les murs n'arrêtent pas la chouette.",
   "The forest owls saw everything. “2 squares as the owl flies”: the owl flies straight or diagonally, and a diagonal square counts as a single step. So count the larger gap, in rows or in columns. Walls don't stop the owl.",
   "숲의 올빼미들이 모든 걸 봤어요. ‘올빼미가 나는 거리로 2칸’: 올빼미는 똑바로 또는 대각선으로 날고, 대각선 한 칸도 한 걸음이에요. 그러니 행 차이와 열 차이 중 큰 쪽을 세요. 벽은 올빼미를 막지 못해요.",
   "森のフクロウたちはすべてを見ていた。「フクロウの飛び方で2マス」：フクロウはまっすぐにも、ななめにも飛び、ななめの1マスも1歩と数えます。つまり、行の差と列の差の大きいほうを数えます。壁はフクロウを止めません。"]],
 diag:["↗️",["Les diagonales","Diagonals","대각선","ななめの線"],["Le sol du ministère est un immense échiquier. « Sur la même diagonale » : on peut aller de l'un à l'autre en ligne droite en diagonale, comme le fou aux échecs. Autrement dit, ils sont séparés d'autant de rangées que de colonnes. Les murs ne comptent pas.",
   "The ministry floor is a huge chessboard. “On the same diagonal”: you can go from one to the other in a straight diagonal line, like a bishop in chess. In other words, they are as many rows apart as columns. Walls don't count.",
   "마법부의 바닥은 거대한 체스판이에요. ‘같은 대각선 위’: 체스의 비숍처럼 대각선으로 곧게 가서 서로에게 닿을 수 있어요. 다시 말해 행 차이와 열 차이가 같아요. 벽은 상관없어요.",
   "魔法省の床は巨大なチェス盤。「同じななめの線の上」：チェスのビショップのように、ななめにまっすぐ進んで相手に届くということ。つまり、行の差と列の差が同じです。壁は関係ありません。"]],
 kiss:["🤝",["Coin à coin","Corner to corner","모서리끼리","角どうし"],["Au bal de Givrelune, on danse serré ! Comme il n'y a qu'une personne par rangée et par colonne, deux personnes ne peuvent se toucher que par un coin : sur deux cases en diagonale l'une de l'autre, même à travers un mur. « Ne touchait personne » veut dire qu'aucune des 4 cases en diagonale autour d'elle n'est occupée.",
   "At the Frostmoon ball, people dance close! Since there is only one person per row and per column, two people can only touch corner to corner: on two diagonally neighbouring squares, even through a wall. “Wasn't touching anyone” means none of the 4 diagonal squares around them is taken.",
   "서리달 무도회에서는 바짝 붙어 춤춰요! 행과 열마다 한 명뿐이라서 두 사람은 모서리끼리만 맞닿을 수 있어요. 대각선으로 이웃한 두 칸에 있으면 되고, 벽이 있어도 마찬가지예요. ‘아무와도 맞닿지 않았다’는 주변 대각선 4칸에 아무도 없다는 뜻이에요.",
   "霜月の舞踏会では、みんなぴったり寄り添って踊る！行と列に1人ずつなので、2人が接するのは角どうしだけ。ななめ隣のマスにいればOKで、壁があっても同じです。「誰とも接していなかった」は、まわりのななめ4マスに誰もいないということ。"]],
 more:["⚖️",["La balance","The scales","저울","天秤"],["La banque pèse tout, même les visiteurs ! « Il y avait plus de monde dans le Comptoir que dans la Crypte » : on compte toutes les personnes de chaque pièce, victime comprise, et la première en a strictement plus. Une pièce vide compte zéro.",
   "The bank weighs everything, even its visitors! “There were more people in the Counter than in the Crypt”: count everyone in each room, victim included, and the first has strictly more. An empty room counts as zero.",
   "은행은 모든 걸 저울에 달아요. 손님까지도요! ‘창구에 지하 납골당보다 사람이 더 많았다’: 각 방의 사람을 피해자까지 모두 세면, 앞의 방이 확실히 더 많아요. 빈 방은 0명이에요.",
   "銀行はなんでも量る、お客さんまで！「カウンターには納骨堂より多くの人がいた」：各部屋の人数を被害者も含めて数えると、前の部屋のほうがはっきり多いということ。空の部屋は0人です。"]],
 par:["🎲",["Pair ou impair","Even or odd","짝수 홀수","偶数・奇数"],["Au stade, chacun porte le numéro de sa colonne sur son maillot. Les colonnes paires sont 2, 4, 6, 8 ; les impaires sont 1, 3, 5, 7, 9. « Même parité » : les deux numéros sont pairs, ou les deux sont impairs. « Parité différente » : l'un est pair, l'autre impair.",
   "At the stadium, everyone wears their column number on their jersey. Even columns are 2, 4, 6, 8; odd ones are 1, 3, 5, 7, 9. “Same parity”: both numbers are even, or both are odd. “Different parity”: one is even, the other odd.",
   "경기장에서는 모두 자기 열 번호를 유니폼에 달고 있어요. 짝수 열은 2, 4, 6, 8이고 홀수 열은 1, 3, 5, 7, 9예요. ‘짝홀이 같다’: 두 번호가 둘 다 짝수이거나 둘 다 홀수예요. ‘짝홀이 다르다’: 하나는 짝수, 하나는 홀수예요.",
   "スタジアムでは、みんな自分の列の番号をユニフォームにつけている。偶数の列は2・4・6・8、奇数の列は1・3・5・7・9。「偶奇が同じ」：2つの番号がどちらも偶数か、どちらも奇数。「偶奇が違う」：一方が偶数、もう一方が奇数。"]],
 closer:["📏",["Plus près","Closer","더 가까이","近いのは"],["À l'hospice, chaque seconde compte : qui était le plus près des remèdes ? « Basile était plus près d'un lit que Flora » : on compte les pas jusqu'au lit le plus proche (haut, bas, gauche ou droite, à travers les murs), et Basile en a strictement moins que Flora. Être sur l'objet compte zéro pas.",
   "At the infirmary, every second counts: who was nearest the remedies? “Basile was closer to a bed than Flora”: count the steps to the nearest bed (up, down, left or right, through walls), and Basile needs strictly fewer than Flora. Standing on the object counts as zero steps.",
   "병원에서는 일 초가 아까워요. 누가 약에 가장 가까이 있었을까요? ‘바질은 플로라보다 침대에 더 가까이 있었다’: 가장 가까운 침대까지 걸음 수를 세면(위·아래·왼쪽·오른쪽, 벽을 지나도 돼요) 바질이 플로라보다 확실히 적어요. 물건 위에 있으면 0걸음이에요.",
   "療養院では一秒が大切。誰がいちばん薬の近くにいた？「バジルはフローラよりベッドの近くにいた」：いちばん近いベッドまでの歩数（上下左右、壁を通りぬけてOK）を数えると、バジルのほうがはっきり少ないということ。物の上にいれば0歩です。"]],
 lit:["🕯️",["Les chandeliers","Candlelight","촛대 불빛","燭台の光"],["Le marché de nuit n'est éclairé que par quelques chandeliers. Un chandelier éclaire les 8 cases qui l'entourent (diagonales comprises), même à travers un mur. « Dans la lumière » : sur une de ces cases. « Dans l'ombre » : sur aucune. Les cases éclairées brillent sur le plan.",
   "The night market is lit only by a few candelabras. A candelabra lights up the 8 squares around it (diagonals included), even through a wall. “In the light”: on one of those squares. “In the shadows”: on none of them. The lit squares glow on the map.",
   "야시장은 촛대 몇 개로만 밝혀져 있어요. 촛대는 주변 8칸(대각선 포함)을 밝히고, 벽 너머도 마찬가지예요. ‘불빛 안’: 그 칸 중 하나에 있어요. ‘어둠 속’: 그 어느 칸에도 없어요. 밝은 칸은 지도에서 빛나요.",
   "夜の市場は、いくつかの燭台だけで照らされている。燭台はまわりの8マス（ななめも含む）を照らし、壁の向こうも同じ。「光の中」：そのどれかのマスにいる。「暗がり」：どのマスにもいない。照らされたマスは見取り図の上で光ります。"]],
 gap:["🔢",["Entre les deux","In between","사이","あいだ"],["Dans le train, chacun a sa rangée de sièges. « Il y avait exactement 2 rangées entre la sienne et celle de Flora » : on compte les rangées (ou les colonnes) qui les séparent, sans compter les leurs. « Rangée voisine » : aucune rangée entre les deux.",
   "On the train, everyone has their own row of seats. “There were exactly 2 rows between theirs and Flora's”: count the rows (or columns) that separate them, not their own. “Neighbouring row”: no row in between.",
   "기차에서는 저마다 자기 좌석 줄이 있어요. ‘자기 줄과 플로라의 줄 사이에 정확히 2개의 행이 있었다’: 두 사람 사이에 있는 행(또는 열)을 세요. 두 사람이 있는 줄은 빼고요. ‘바로 옆 행’: 사이에 행이 하나도 없어요.",
   "列車では、それぞれ自分の座席の列がある。「自分の行とフローラの行の間に、ちょうど2行あった」：2人を隔てる行（または列）を数えます。2人がいる行は数えません。「すぐ隣の行」：間に1行もないということ。"]],
 mix2:["🌊",["Le grand mystère","The great mystery","거대한 수수께끼","大いなる謎"],["Le lac mélange toutes les règles de la saison : vol de chouette, diagonales, coins, balance, parité, plus près, chandeliers, rangées d'écart. Le rappel en bas du récit te dit lesquelles comptent dans chaque enquête.",
   "The lake mixes every rule of the season: owl flight, diagonals, corners, scales, parity, closer, candlelight, rows in between. The reminder at the bottom of the story tells you which ones apply to each case.",
   "호수에서는 이번 시즌의 모든 규칙이 섞여 나와요. 올빼미 거리, 대각선, 모서리, 저울, 짝홀, 더 가까이, 촛대 불빛, 사이의 행. 이야기 맨 아래의 안내를 보면 사건마다 어떤 규칙이 적용되는지 알 수 있어요.",
   "湖ではシーズンのすべてのルールが混ざっている。フクロウの飛び方、ななめの線、角どうし、天秤、偶数・奇数、近いのは、燭台の光、あいだの行。物語の下の案内を見れば、それぞれの事件でどれが使われているかわかります。"]]});
/* level select: the new chapters show their rule under their blurb too */
(function(){try{if(typeof CH_TAG==="undefined")return;CH_TAG.story.forEach((a,i)=>{if(i<10)return;const m=MECH_INFO[MECH_IDS[i]];if(!m)return;
  const lab=["Règle","Rule","규칙","ルール"];for(let j=0;j<4;j++)a[j]=a[j]+" "+m[0]+" "+lab[j]+(j===0?" : ":": ")+m[1][j]+"."})}catch(e){}})();
/* painted pictures for the season-2 rules (shown big in the "New rule" popup) */
(function(){if(typeof IC2==="undefined"||typeof mechIntro!=="function")return;
  const IMG={ghost:IC2.mi_ghost,owl:IC2.mi_owl,diag:IC2.mi_diag,kiss:IC2.mi_kiss,more:IC2.mi_more,par:IC2.mi_par,closer:IC2.mi_closer,gap:IC2.mi_gap,mix2:IC2.mi_mix2,lit:IC2.mi_lit};
  const _mi=mechIntro;mechIntro=function(){const r=_mi.apply(this,arguments);try{const el=$("#mechIntro"),src=IMG[mechOf()];if(el&&!el.hidden&&src){const ic=el.querySelector(".miic");if(ic&&!ic.querySelector("img"))ic.innerHTML=`<img class="mi-pic" src="${src}" alt="">`}}catch(_){}return r};
  const st=document.createElement("style");st.textContent=`.miic img.mi-pic{display:block;width:min(240px,70vw);height:auto;margin:0 auto 4px;border-radius:18px;filter:drop-shadow(0 6px 12px #0006)}`;document.head.appendChild(st)})();
