
/* ================= rules v3: five short illustrated rules (allowed / not allowed), full text in "details" ================= */
(function(){
  /* mini board: n x n, rooms = array of strings (same letter = same room), t = tokens [r,c,kind], x = crossed cells, hl = highlighted cells */
  function mini(n,rooms,t,o){o=o||{};const S=22,W=n*S,col={A:"#e9dcbc",B:"#cfe0c4",C:"#d9cdea",D:"#f0d2c8"};let g="";
    for(let r=0;r<n;r++)for(let c=0;c<n;c++){const k=rooms?rooms[r][c]:"A";g+=`<rect x="${c*S}" y="${r*S}" width="${S}" height="${S}" fill="${col[k]||"#e9dcbc"}" stroke="#b9a37a" stroke-width=".6"/>`}
    (o.hl||[]).forEach(([r,c])=>{g+=`<rect x="${c*S+1.5}" y="${r*S+1.5}" width="${S-3}" height="${S-3}" rx="3" fill="rgba(63,125,58,.28)" stroke="#3f7d3a" stroke-width="1.4"/>`});
    (o.obj||[]).forEach(([r,c,k])=>{g+=k==="chair"?`<g transform="translate(${c*S+4} ${r*S+4})"><rect x="2" y="1" width="10" height="9" rx="2" fill="#a8323e"/><rect x="0" y="7" width="14" height="6" rx="2" fill="#7d1e35"/></g>`
      :`<g transform="translate(${c*S+3} ${r*S+2})"><rect width="16" height="18" rx="1.5" fill="#6b4a2a"/><rect x="2" y="2" width="3" height="6" fill="#c0392b"/><rect x="6" y="2" width="3" height="6" fill="#2f7d6d"/><rect x="10" y="2" width="3" height="6" fill="#d6ab4f"/><rect x="2" y="10" width="12" height="1.5" fill="#3b2418"/></g>`});
    if(rooms){for(let r=0;r<n;r++)for(let c=0;c<n;c++){if(c<n-1&&rooms[r][c]!==rooms[r][c+1])g+=`<path d="M${(c+1)*S} ${r*S}v${S}" stroke="#3b2418" stroke-width="2.6"/>`;if(r<n-1&&rooms[r][c]!==rooms[r+1][c])g+=`<path d="M${c*S} ${(r+1)*S}h${S}" stroke="#3b2418" stroke-width="2.6"/>`}}
    t.forEach(([r,c,k])=>{const on=(o.obj||[]).some(q=>q[0]===r&&q[1]===c),cx=c*S+(on?S*.72:S/2),cy=r*S+(on?S*.3:S/2),f=k==="v"?"#7a6a8e":k==="k"?"#a8323e":"#3a6ea8";g+=`<circle cx="${cx}" cy="${cy}" r="${S*(on?.24:.32)}" fill="${f}" stroke="#fff" stroke-width="1.6"/>`+(k==="v"?`<text x="${cx}" y="${cy+3.5}" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">✝</text>`:k==="k"?`<text x="${cx}" y="${cy+3.5}" text-anchor="middle" font-size="9" fill="#fff" font-weight="800">?</text>`:"")});
    (o.bad||[]).forEach(([r,c])=>{g+=`<path d="M${c*S+5} ${r*S+5}l${S-10} ${S-10}M${c*S+S-5} ${r*S+5}l${-(S-10)} ${S-10}" stroke="#b8283e" stroke-width="2.6" stroke-linecap="round"/>`});
    return `<svg class="r3-svg" viewBox="-2 -2 ${W+4} ${W+4}" width="${W+4}" height="${W+4}" aria-hidden="true"><rect x="-1" y="-1" width="${W+2}" height="${W+2}" fill="none" stroke="#3b2418" stroke-width="2.4" rx="2"/>${g}</svg>`}
  const OK=()=>`<span class="r3-tag ok">✓ ${L("Autorisé","Allowed","가능","OK")}</span>`,NO=()=>`<span class="r3-tag no">✗ ${L("Interdit","Not allowed","불가","NG")}</span>`;
  function cards(){const R3=["AAA","AAA","AAA"];
    return [
      [L("Une personne par rangée et par colonne","One person per row and per column","행과 열마다 한 명","行と列に1人ずつ"),
       L("Jamais deux personnes sur la même ligne, ni dans la même colonne. Barre les cases qui deviennent impossibles.","Never two people on the same row or in the same column. Cross out squares that become impossible.","같은 행이나 같은 열에 두 사람이 있을 수 없어요. 불가능해진 칸에는 ✕를 표시하세요.","同じ行・同じ列に2人は入れません。ありえなくなったマスには✕をつけよう。"),
       mini(3,R3,[[0,0,"p"],[1,2,"p"]]),mini(3,R3,[[1,0,"p"],[1,2,"p"]],{bad:[[1,2]]})],
      [L("Où peut-on se tenir ?","Where can people stand?","어디에 설 수 있나요?","どこに立てる？"),
       L("Sur le sol, ou assis sur un fauteuil, une malle, dans la baignoire… Jamais sur une bibliothèque, un chaudron ou un bureau : ces cases sont hachurées.","On the floor, or sitting in an armchair, on a trunk, in the bath… Never on a bookcase, a cauldron or a desk: those squares are hatched.","바닥이나 의자·트렁크·욕조 위에는 설 수 있어요. 책장·가마솥·책상 위는 안 돼요(빗금 친 칸).","床や、ひじ掛けいす・トランク・浴槽の上はOK。本棚・大釜・机の上はダメ（斜線のマス）。"),
       mini(3,null,[[1,1,"p"]],{obj:[[1,1,"chair"]]}),mini(3,null,[[1,1,"p"]],{obj:[[1,1,"shelf"]],bad:[[1,1]]})],
      [L("« À côté » = juste à côté, dans la même pièce","“Next to” = right beside, in the same room","‘옆’ = 바로 옆, 같은 방 안","「となり」＝すぐ横、同じ部屋の中"),
       L("Les 4 cases qui touchent (haut, bas, gauche, droite), pas en diagonale, et sans mur entre les deux.","The 4 touching squares (up, down, left, right), not diagonal, and with no wall in between.","맞닿은 4칸(위·아래·왼쪽·오른쪽)이에요. 대각선은 아니고, 벽이 사이에 있으면 안 돼요.","接する4マス（上下左右）。ななめは×、間に壁があっても×。"),
       mini(3,R3,[[1,1,"p"]],{hl:[[0,1],[1,0],[1,2],[2,1]]}),mini(3,["AAB","AAB","AAB"],[[1,1,"p"]],{bad:[[0,0],[1,2],[2,2]]})],
      [L("Une pièce peut accueillir plusieurs personnes","A room can hold several people","한 방에 여러 명이 있을 수 있어요","ひとつの部屋に何人いてもOK"),
       L("Deux, trois personnes ou plus dans la même pièce : aucun problème. Seules les rangées et les colonnes sont limitées.","Two, three or more people in the same room is fine. Only rows and columns are limited.","같은 방에 두세 명 이상 있어도 괜찮아요. 제한은 행과 열뿐이에요.","同じ部屋に2人、3人以上いても大丈夫。制限は行と列だけ。"),
       mini(3,["AAB","AAB","CCB"],[[0,0,"p"],[1,1,"p"],[2,2,"p"]]),""],
      [L("Le coupable est seul avec la victime","The culprit is alone with the victim","범인은 피해자와 단둘이 있어요","犯人は被害者と2人きり"),
       L("Dans la pièce de la victime, il y a exactement une autre personne : c'est le coupable. Quand tout le monde est placé, valide et désigne-le.","In the victim's room there is exactly one other person: the culprit. Once everyone is placed, check and point them out.","피해자의 방에는 딱 한 명이 더 있어요. 그 사람이 범인! 모두 배치하면 확인을 누르고 범인을 지목하세요.","被害者の部屋には、ほかにちょうど1人。それが犯人！全員を置いたらチェックして指名しよう。"),
       mini(3,["AAB","AAB","CCB"],[[0,0,"v"],[1,1,"k"],[2,2,"p"]]),mini(3,["AAB","AAB","CCB"],[[0,0,"v"],[1,1,"k"],[0,1,"p"]],{bad:[[0,1]]})]
    ].map(([t,d,a,b],i)=>`<li class="r3-card"><div class="r3-txt"><b><span class="r3-n">${i+1}</span>${t}</b><p>${d}</p></div><div class="r3-ex"><figure>${a}${OK()}</figure>${b?`<figure>${b}${NO()}</figure>`:""}</div></li>`).join("")}
  const css=document.createElement("style");css.textContent=`#rulesBody .r3{list-style:none;margin:0 0 12px;padding:0;display:flex;flex-direction:column;gap:10px}
.r3-card{display:flex;flex-direction:column;gap:8px;padding:10px 12px;border-radius:12px;background:rgba(255,250,236,.75);border:1.5px solid #e2cfa4;text-align:left}
.r3-txt b{display:flex;align-items:center;gap:8px;font-size:16px;color:#3a1f3d;line-height:1.25}
.r3-n{flex:0 0 24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#8e1f33;color:#fff;font:800 13px var(--f-simple,system-ui)!important}
.r3-txt p{margin:4px 0 0;font:500 14.5px/1.45 var(--f-simple,system-ui)!important;color:#4a3a30}
.r3-ex{display:flex;gap:14px;justify-content:center}
.r3-ex figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:4px}
.r3-svg{display:block;width:76px;height:76px}
.r3-tag{font:800 13px var(--f-simple,system-ui)!important;padding:2px 8px;border-radius:999px}
.r3-tag.ok{color:#2f6a2b;background:#dff0da}.r3-tag.no{color:#9b1d33;background:#f8dde1}
#rulesBody details.r3-more{margin-top:4px;border-top:1px dashed #c9a25a;padding-top:8px}
#rulesBody details.r3-more>summary{cursor:pointer;min-height:44px;display:flex;align-items:center;font:700 15px var(--f-simple,system-ui)!important;color:#6b1530}`;
  document.head.appendChild(css);
  function paint(){const body=$("#rulesBody");if(!body)return;let list=body.querySelector(".r3"),more=body.querySelector("details.r3-more");
    if(!list){list=document.createElement("ol");list.className="r3";body.prepend(list)}
    if(!more){more=document.createElement("details");more.className="r3-more";more.innerHTML="<summary></summary>";list.after(more);[...body.children].forEach(ch=>{if(ch!==list&&ch!==more)more.appendChild(ch)})}
    list.innerHTML=cards();more.querySelector("summary").textContent=L("Tous les détails et la liste des objets","All the details and the list of objects","자세한 규칙과 물건 목록","くわしいルールと物の一覧")}
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);try{paint()}catch(e){}};
  try{paint()}catch(e){}
})();
