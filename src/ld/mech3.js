
/* ================= Story mode: chapter mechanic introduction ================= */
var MECH_INFO={
 dist:["🐾",["Les empreintes","Footprints","발자국","足跡"],["Dans la forêt, les empreintes trahissent les suspects. « À 3 pas de Basile » veut dire qu'il faut exactement 3 déplacements d'une case (haut, bas, gauche ou droite) pour aller de l'un à l'autre. Les diagonales ne comptent pas, mais on compte même à travers les murs.",
   "In the forest, footprints give the suspects away. “3 steps from Basile” means it takes exactly 3 one-square moves (up, down, left or right) to go from one to the other. Diagonals don't count, but you count even through walls.",
   "숲에서는 발자국이 용의자를 드러내요. ‘바질에게서 3걸음’은 한 칸씩(위, 아래, 왼쪽, 오른쪽) 정확히 3번 움직여야 서로에게 닿는다는 뜻이에요. 대각선은 세지 않지만, 벽을 지나도 세요.",
   "森では足跡が容疑者の居場所を教えてくれる。「バジルから3歩」とは、上下左右に1マスずつ、ちょうど3回動くと相手に届くということ。ななめは数えないけれど、壁ごしでも数えます。"]],
 train:["🚂",["Le train n'attend pas","The train won't wait","기차는 기다려 주지 않아요","汽車は待ってくれない"],["Le Brumeval Express va partir ! Résous l'enquête avant la fin du compte à rebours, sinon tu rates le train et tu dois tout recommencer. Chaque indice coûte 30 secondes. Le compte à rebours s'arrête quand tu quittes le jeu.",
   "The Brumeval Express is about to leave! Solve the case before the countdown ends, or you'll miss the train and have to start again. Each hint costs 30 seconds. The countdown stops when you leave the game.",
   "브뤼므발 특급이 곧 출발해요! 카운트다운이 끝나기 전에 사건을 해결하지 못하면 기차를 놓치고 처음부터 다시 해야 해요. 힌트 하나에 30초가 줄어요. 게임을 나가 있는 동안에는 카운트다운이 멈춰요.",
   "ブリュムヴァル急行がまもなく発車！カウントダウンが終わる前に事件を解かないと、汽車に乗り遅れて最初からやり直し。ヒント1回で30秒減ります。ゲームを離れている間、カウントダウンは止まります。"]],
 cnt:["📒",["Le registre","The register","출입 기록","出入りの記録"],["La banque note tout ce qui se passe. Le registre indique combien de personnes se trouvaient dans une pièce, victime comprise. « Vide » veut dire que personne n'y était !",
   "The bank writes everything down. The register says how many people were in a room, victim included. “Empty” means nobody was there!",
   "은행은 모든 것을 기록해요. 출입 기록은 한 방에 몇 명이 있었는지 알려 줘요(피해자 포함). ‘아무도 없었다’는 그 방이 비어 있었다는 뜻이에요!",
   "銀行はすべてを記録している。記録には、ある部屋に何人いたか（被害者も含む）が書かれている。「誰もいなかった」は、その部屋が空だったということ！"]],
 liar:["🤥",["Un marchand ment","A merchant is lying","상인 한 명이 거짓말을 해요","商人の一人が嘘をついている"],["Dans la ruelle, un seul témoignage est faux : tous les autres sont vrais. Trouve la seule disposition où tout colle… sauf ce mensonge. Pas d'indice dans ce chapitre !",
   "In the alley, exactly one statement is false: all the others are true. Find the only arrangement where everything fits… except that lie. No hints in this chapter!",
   "골목에서는 진술 하나만 거짓이고 나머지는 모두 사실이에요. 그 거짓말 하나만 빼고 모든 것이 들어맞는 유일한 배치를 찾으세요. 이 장에서는 힌트가 없어요!",
   "路地では、証言のうちひとつだけが嘘で、ほかはすべて本当。その嘘ひとつを除いてすべてが合う、ただひとつの配置を見つけよう。この章ではヒントなし！"]],
 frost:["❄️",["Le grand gel","The big freeze","대한파","大寒波"],["Au bout d'un moment, le froid gèle les cases une par une, du bord vers le centre. Une case gelée ne peut plus changer : si la bonne personne n'y est pas déjà, c'est perdu. Place vite les suspects dont tu es sûr ! Le gel n'avance que pendant que tu joues.",
   "After a while, the cold freezes the squares one by one, from the edge to the centre. A frozen square can't change any more: if the right person isn't already there, you lose. Quickly place the suspects you're sure about! The frost only advances while you play.",
   "시간이 지나면 추위가 가장자리부터 가운데로 칸을 하나씩 얼려요. 얼어붙은 칸은 더 이상 바뀌지 않아서, 올바른 사람이 그 칸에 없으면 실패예요. 확실한 용의자부터 빨리 배치하세요! 얼음은 플레이하는 동안에만 퍼져요.",
   "しばらくすると、寒さが外側から中心へマスを一つずつ凍らせていく。凍ったマスはもう変えられないので、正しい人がそこにいなければ失敗。確信のある容疑者から急いで置こう！凍結はプレイ中しか進みません。"]],
 mirror:["🪞",["Les reflets du lac","The lake's reflections","호수의 반사","湖の鏡写し"],["Le lac reflète tout. « Reflet par rapport au centre » : même distance du centre du plan, de l'autre côté. « Reflet par rapport à une diagonale » : de l'autre côté de cette diagonale, à la même distance (B3 et C2 sont des reflets par rapport à la grande diagonale). « Au milieu entre A et B » : A et B sont les reflets l'un de l'autre par rapport à cette personne.",
   "The lake reflects everything. “Reflection through the centre”: same distance from the centre of the map, on the other side. “Reflection across a diagonal”: on the other side of that diagonal, at the same distance (B3 and C2 are reflections across the long diagonal). “Halfway between A and B”: A and B are each other's reflection through that person.",
   "호수는 모든 것을 비춰요. ‘중심을 기준으로 반사’: 지도 중심에서 같은 거리, 반대편. ‘대각선을 기준으로 반사’: 그 대각선 반대편, 같은 거리(B3과 C2는 큰 대각선을 기준으로 반사된 자리예요). ‘A와 B 사이 한가운데’: A와 B가 그 사람을 기준으로 서로 반사된 자리에 있어요.",
   "湖はすべてを映す。「中心をはさんで鏡写し」：見取り図の中心から同じ距離の反対側。「対角線をはさんで鏡写し」：その対角線の反対側、同じ距離（B3とC2は長い対角線をはさんで鏡写し）。「AとBの真ん中」：AとBはその人をはさんで鏡写しの位置。"]],
 nox:["🏟️",["Le vacarme du stade","The roar of the stadium","경기장의 함성","競技場の大歓声"],["Dans le vacarme des tribunes, impossible de se concentrer : dans ce chapitre, tu ne peux pas barrer de cases avec des croix. Tu peux seulement placer les suspects et écrire de petites notes (toucher rapide). À toi de tout garder en tête !",
   "In the roar of the stands, it's impossible to concentrate: in this chapter you can't cross out squares. You can only place suspects and write small notes (quick tap). Keep everything in your head!",
   "관중석이 너무 시끄러워 집중할 수 없어요. 이 장에서는 칸에 X 표시를 할 수 없어요. 용의자를 배치하거나 작은 메모(짧게 탭)만 적을 수 있어요. 모든 걸 머릿속에 기억하세요!",
   "観客席の大歓声で集中できない！この章ではマスに✕をつけられません。できるのは容疑者を置くことと、小さなメモ（短くタップ）だけ。全部頭の中で覚えておこう！"]],
 poison:["☠️",["Les fioles de poison","The poison flasks","독약 병","毒薬のびん"],["Des fioles de poison traînent dans l'hospice. Personne ne peut se tenir sur une fiole, ni sur les 8 cases qui l'entourent (diagonales comprises), même de l'autre côté d'un mur.",
   "Poison flasks are lying around the hospice. Nobody can stand on a flask, or on the 8 squares around it (diagonals included), even on the other side of a wall.",
   "병원 여기저기에 독약 병이 놓여 있어요. 아무도 독약 병 위나, 그 주변 8칸(대각선 포함)에 있을 수 없어요. 벽 너머라도 마찬가지예요.",
   "病院のあちこちに毒薬のびんが置いてある。誰もびんの上や、そのまわり8マス（ななめも含む）にはいられない。壁の向こう側でも同じ。"]],
 dark:["🏮",["Dans le noir","In the dark","어둠 속에서","暗闇の中で"],["Une panne plonge le ministère dans l'obscurité. Promène ta lanterne (souris, ou doigt sur téléphone) pour découvrir les pièces et les objets. Tes personnages et tes croix restent toujours visibles.",
   "A power cut plunges the ministry into darkness. Move your lantern (mouse, or finger on a phone) to reveal rooms and objects. Your characters and crosses always stay visible.",
   "정전으로 부처가 어둠에 잠겼어요. 등불(마우스, 휴대폰에서는 손가락)을 움직여 방과 물건을 찾아보세요. 배치한 인물과 X 표시는 항상 보여요.",
   "停電で魔法省が真っ暗に。ランタン（マウス、スマホでは指）を動かして部屋や家具を照らそう。置いた人物と✕はいつでも見えます。"]],
 mix:["🏰",["Le grand final","The grand finale","대단원","グランドフィナーレ"],["La forteresse mélange toutes les épreuves : empreintes, registre, reflets, poisons, interdiction des croix… et parfois l'obscurité. Le rappel en bas du récit te dit lesquelles comptent dans chaque enquête.",
   "The fortress mixes every trial: footprints, register, reflections, poisons, no crosses… and sometimes darkness. The reminder at the bottom of the story tells you which ones apply to each case.",
   "요새에서는 모든 시험이 섞여 나와요. 발자국, 출입 기록, 반사, 독약, X 표시 금지… 그리고 가끔은 어둠까지. 이야기 맨 아래의 안내를 보면 사건마다 어떤 규칙이 적용되는지 알 수 있어요.",
   "要塞ではすべての試練が混ざっている。足跡、記録、鏡写し、毒薬、✕禁止……そして時には暗闇も。物語の下の案内を見れば、それぞれの事件でどれが使われているかわかります。"]]};
function mechIntro(force){const m=mechOf();if(!m||!MECH_INFO[m])return;const c=storyChap(),key="magicoku:mechSeen:"+c+(m==="nox"?"x":"");
  let seen=null;try{seen=localStorage.getItem(key)}catch(_){}if(seen&&!force)return;try{localStorage.setItem(key,"1")}catch(_){}
  const [ic,t,d]=MECH_INFO[m];let el=$("#mechIntro");
  if(!el){el=document.createElement("div");el.id="mechIntro";el.className="modal";document.body.appendChild(el);el.addEventListener("click",e=>{if(e.target===el||e.target.closest("[data-mi]"))el.hidden=true})}
  el.innerHTML=`<div class="mbox mibox"><div class="miic">${ic}</div><small class="mich">${TX(CH_SHORT[tierOf(ci)])} · ${L("Nouvelle règle","New rule","새 규칙","新しいルール")}</small><h2>${TX(t)}</h2><p>${TX(d)}</p><button class="pill red" data-mi>${L("C'est compris !","Got it!","알겠어요!","わかった！")}</button></div>`;
  el.hidden=false}
(function(){
  const _oc=openCase;openCase=function(){const r=_oc.apply(this,arguments);setTimeout(()=>{if($("#home").hidden&&$("#tuto").hidden)mechIntro(false)},450);return r};
  /* chapter rule button in the story */
  document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest(".mech-help")){e.preventDefault();mechIntro(true)}});
  const _sh=storyHTML;storyHTML=function(){const h=_sh.apply(this,arguments),m=mechOf();if(!m||!MECH_INFO[m])return h;
    const b=`<p class="st-rule"><button class="mech-help">${MECH_INFO[m][0]} ${L("Règle du chapitre : ","Chapter rule: ","이 장의 규칙: ","この章のルール：")}<b>${TX(MECH_INFO[m][1])}</b></button></p>`;
    return b+h};
})();
/* level select: show each chapter's rule under its blurb */
(function(){try{if(typeof CH_TAG==="undefined")return;CH_TAG.story.forEach((a,i)=>{const m=MECH_INFO[MECH_IDS[i]];if(!m)return;
  const lab=["Règle","Rule","규칙","ルール"];for(let j=0;j<4;j++)a[j]=a[j]+" "+m[0]+" "+lab[j]+(j===0?" : ":j===1?": ":": ")+m[1][j]+"."})}catch(e){}})();
