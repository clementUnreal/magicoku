
/* ================= rules v3: five short illustrated rules, explicit diagrams, full text in "details" ================= */
(function(){
  const S=24;
  /* mini board. o: rooms (strings), tok [[r,c,"v"|"s"]], hl (green cells), bad (red crosses), obj [[r,c,key]], focus (room letter to outline), size */
  function mini(n,o){o=o||{};const rooms=o.rooms||Array(n).fill("A".repeat(n)),W=n*S,col={A:"#ece0c2",B:"#d3e3c8",C:"#ddd0ee",D:"#f1d6cc"};let g="";
    for(let r=0;r<n;r++)for(let c=0;c<n;c++){const k=rooms[r][c];g+=`<rect x="${c*S}" y="${r*S}" width="${S}" height="${S}" fill="${col[k]}" stroke="#bda97f" stroke-width=".6"/>`}
    if(o.focus){for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(rooms[r][c]===o.focus)g+=`<rect x="${c*S}" y="${r*S}" width="${S}" height="${S}" fill="rgba(168,50,62,.10)"/>`}
    (o.hl||[]).forEach(([r,c])=>{g+=`<rect x="${c*S+2}" y="${r*S+2}" width="${S-4}" height="${S-4}" rx="4" fill="rgba(63,125,58,.30)" stroke="#3f7d3a" stroke-width="1.6"/>`});
    (o.obj||[]).forEach(([r,c,k])=>{const src=typeof SPR!=="undefined"&&SPR[k];if(src)g+=`<image href="${src}" x="${c*S}" y="${r*S}" width="${S}" height="${S}" preserveAspectRatio="xMidYMid meet"/>`});
    /* walls between rooms */
    for(let r=0;r<n;r++)for(let c=0;c<n;c++){if(c<n-1&&rooms[r][c]!==rooms[r][c+1])g+=`<path d="M${(c+1)*S} ${r*S}v${S}" stroke="#3b2418" stroke-width="3"/>`;if(r<n-1&&rooms[r][c]!==rooms[r+1][c])g+=`<path d="M${c*S} ${(r+1)*S}h${S}" stroke="#3b2418" stroke-width="3"/>`}
    /* thick outline around the room we talk about */
    if(o.focus){for(let r=0;r<n;r++)for(let c=0;c<n;c++){if(rooms[r][c]!==o.focus)continue;const out=(rr,cc)=>rr<0||cc<0||rr>=n||cc>=n||rooms[rr][cc]!==o.focus;
      if(out(r-1,c))g+=`<path d="M${c*S} ${r*S}h${S}" stroke="${o.fc||"#a8323e"}" stroke-width="4" stroke-linecap="square"/>`;if(out(r+1,c))g+=`<path d="M${c*S} ${(r+1)*S}h${S}" stroke="${o.fc||"#a8323e"}" stroke-width="4" stroke-linecap="square"/>`;
      if(out(r,c-1))g+=`<path d="M${c*S} ${r*S}v${S}" stroke="${o.fc||"#a8323e"}" stroke-width="4" stroke-linecap="square"/>`;if(out(r,c+1))g+=`<path d="M${(c+1)*S} ${r*S}v${S}" stroke="${o.fc||"#a8323e"}" stroke-width="4" stroke-linecap="square"/>`}}
    (o.tok||[]).forEach(([r,c,k])=>{const onObj=(o.obj||[]).some(q=>q[0]===r&&q[1]===c),cx=c*S+(onObj?S*.74:S/2),cy=r*S+(onObj?S*.28:S/2),R=S*(onObj?.24:.34);
      const f=k==="v"?"#55406b":"#2f6fb3",lt=k==="v"?"V":"S";g+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${f}" stroke="#fff" stroke-width="1.8"/><text x="${cx}" y="${cy+R*.42}" text-anchor="middle" font-size="${R*1.15}" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">${lt}</text>`});
    (o.bad||[]).forEach(([r,c])=>{g+=`<path d="M${c*S+5} ${r*S+5}l${S-10} ${S-10}M${c*S+S-5} ${r*S+5}l${-(S-10)} ${S-10}" stroke="#b8283e" stroke-width="3" stroke-linecap="round"/>`});
    const px=o.px||(o.three?68:84);return `<svg class="r3-svg" viewBox="-3 -3 ${W+6} ${W+6}" width="${px}" height="${px}" aria-hidden="true"><rect x="-1.5" y="-1.5" width="${W+3}" height="${W+3}" fill="none" stroke="#3b2418" stroke-width="3" rx="2"/>${g}</svg>`}
  const fig=(svg,ok,cap)=>`<figure>${svg}<figcaption class="r3-tag ${ok?"ok":"no"}">${ok?"✓":"✗"} ${cap}</figcaption></figure>`;
  const A=()=>L("Autorisé","Allowed","가능","OK"),N=()=>L("Interdit","Not allowed","불가","NG");
  const legend=()=>`<p class="r3-leg"><span class="r3-dot v">V</span>${L("victime","victim","피해자","被害者")}<span class="r3-dot s">S</span>${L("suspect","suspect","용의자","容疑者")}</p>`;
  function cards(){const R5=["AAAB","AAAB","AAAB","CCCB"];
    return [
      [L("Une personne par rangée et par colonne","One person per row and per column","행과 열마다 한 명","行と列に1人ずつ"),
       L("Jamais deux personnes sur la même ligne, ni dans la même colonne. Barre les cases qui deviennent impossibles.","Never two people on the same row or in the same column. Cross out squares that become impossible.","같은 행이나 같은 열에 두 사람이 있을 수 없어요. 불가능해진 칸에는 ✕를 표시하세요.","同じ行・同じ列に2人は入れません。ありえなくなったマスには✕をつけよう。"),
       fig(mini(3,{three:1,tok:[[0,0,"s"],[1,2,"s"]]}),1,A())+fig(mini(3,{three:1,tok:[[1,0,"s"],[1,2,"s"]],bad:[[1,2]]}),0,L("Même rangée","Same row","같은 행","同じ行"))+fig(mini(3,{three:1,tok:[[0,1,"s"],[2,1,"s"]],bad:[[2,1]]}),0,L("Même colonne","Same column","같은 열","同じ列"))],
      [L("Où peut-on se tenir ?","Where can people stand?","어디에 설 수 있나요?","どこに立てる？"),
       L("Sur le sol, ou sur un fauteuil, une malle, dans la baignoire… Jamais sur une bibliothèque, un chaudron ou un bureau : ces cases sont hachurées.","On the floor, or in an armchair, on a trunk, in the bath… Never on a bookcase, a cauldron or a desk: those squares are hatched.","바닥이나 의자·트렁크·욕조 위에는 설 수 있어요. 책장·가마솥·책상 위는 안 돼요(빗금 친 칸).","床や、ひじ掛けいす・トランク・浴槽の上はOK。本棚・大釜・机の上はダメ（斜線のマス）。"),
       fig(mini(1,{obj:[[0,0,"chair"]],tok:[[0,0,"s"]],px:84}),1,L("Fauteuil : autorisé","Armchair: allowed","의자: 가능","いす：OK"))+fig(mini(1,{obj:[[0,0,"shelf"]],tok:[[0,0,"s"]],bad:[[0,0]],px:84}),0,L("Bibliothèque : interdit","Bookcase: not allowed","책장: 불가","本棚：NG"))],
      [L("« À côté » = juste à côté, dans la même pièce","“Next to” = right beside, in the same room","‘옆’ = 바로 옆, 같은 방 안","「となり」＝すぐ横、同じ部屋の中"),
       L("Seulement les 4 cases qui touchent : en haut, en bas, à gauche, à droite.","Only the 4 touching squares: above, below, left, right.","맞닿은 4칸만: 위, 아래, 왼쪽, 오른쪽.","接する4マスだけ：上・下・左・右。"),
       fig(mini(3,{three:1,tok:[[1,1,"s"]],hl:[[0,1],[1,0],[1,2],[2,1]]}),1,A())+fig(mini(3,{three:1,tok:[[1,1,"s"]],bad:[[0,0],[0,2],[2,0],[2,2]]}),0,L("En diagonale","Diagonal","대각선","ななめ"))+fig(mini(3,{three:1,rooms:["AAB","AAB","AAB"],tok:[[1,1,"s"]],bad:[[1,2]]}),0,L("Derrière un mur","Behind a wall","벽 너머","壁の向こう"))],
      [L("Plusieurs personnes dans une même pièce","Several people in the same room","한 방에 여러 명","ひとつの部屋に何人でも"),
       L("Deux, trois personnes ou plus dans la même pièce : aucun problème. Seules les rangées et les colonnes sont limitées.","Two, three or more people in the same room is fine. Only rows and columns are limited.","같은 방에 두세 명 이상 있어도 괜찮아요. 제한은 행과 열뿐이에요.","同じ部屋に2人、3人以上いても大丈夫。制限は行と列だけ。"),
       fig(mini(3,{rooms:["AAB","AAB","AAB"],focus:"A",fc:"#3f7d3a",tok:[[0,0,"s"],[1,1,"s"]]}),1,L("2 dans la pièce","2 in the room","방에 2명","部屋に2人"))+fig(mini(3,{rooms:["AAA","AAA","BBB"],focus:"A",fc:"#3f7d3a",tok:[[0,0,"s"],[1,2,"s"]]}),1,L("Pièce partagée","Shared room","함께 쓰는 방","相部屋"))],
      [L("Exactement deux personnes dans la pièce de la victime","Exactly two people in the victim's room","피해자의 방에는 정확히 두 사람","被害者の部屋にはちょうど2人"),
       L("La victime et une seule autre personne : cette personne est le coupable. Les autres pièces n'ont pas cette limite.","The victim and exactly one other person: that person is the culprit. Other rooms have no such limit.","피해자와 다른 한 사람뿐: 그 사람이 범인이에요. 다른 방에는 이런 제한이 없어요.","被害者とほかに1人だけ：その人が犯人。ほかの部屋にこの制限はありません。"),
       fig(mini(4,{rooms:R5,focus:"A",tok:[[0,0,"v"],[1,2,"s"],[3,3,"s"]]}),1,L("Victime + 1","Victim + 1","피해자 + 1","被害者＋1"))+fig(mini(4,{rooms:R5,focus:"A",tok:[[0,0,"v"],[1,2,"s"],[2,1,"s"]],bad:[[2,1]]}),0,L("Victime + 2","Victim + 2","피해자 + 2","被害者＋2"))+legend()]
    ].map(([t,d,ex],i)=>`<li class="r3-card"><div class="r3-txt"><b><span class="r3-n">${i+1}</span><span>${t}</span></b><p>${d}</p></div><div class="r3-ex">${ex}</div></li>`).join("")}
  const css=document.createElement("style");css.textContent=`#rulesBody .r3{list-style:none;margin:0 0 12px;padding:0;display:flex;flex-direction:column;gap:10px}
.r3-card{display:flex;flex-direction:column;gap:8px;padding:10px 12px;border-radius:12px;background:rgba(255,250,236,.8);border:1.5px solid #e2cfa4;text-align:left}
.r3-txt b{display:flex;align-items:flex-start;gap:8px;font-size:16px;color:#3a1f3d;line-height:1.25}
.r3-n{flex:0 0 24px;height:24px;margin-top:1px;border-radius:50%;display:grid;place-items:center;background:#8e1f33;color:#fff;font:800 13px var(--f-simple,system-ui)!important}
.r3-txt p{margin:4px 0 0;font:500 14.5px/1.45 var(--f-simple,system-ui)!important;color:#4a3a30}
.r3-ex{display:flex;flex-wrap:wrap;gap:10px 6px;justify-content:center;align-items:flex-start}
.r3-ex figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:5px;max-width:110px;min-width:0}
.r3-ex figure:has(svg[width="68"]){max-width:78px}
.r3-ex figure:has(svg[width="68"]) .r3-tag{font-size:12px!important;padding:3px 6px}
.r3-svg{display:block}
.r3-tag{font:800 12.5px/1.2 var(--f-simple,system-ui)!important;padding:3px 8px;border-radius:999px;text-align:center}
.r3-tag.ok{color:#2f6a2b;background:#dff0da}.r3-tag.no{color:#9b1d33;background:#f8dde1}
.r3-leg{flex-basis:100%;margin:0;display:flex;justify-content:center;align-items:center;gap:6px;font:600 13px var(--f-simple,system-ui)!important;color:#4a3a30}
.r3-dot{width:20px;height:20px;border-radius:50%;display:inline-grid;place-items:center;color:#fff;font:800 11px var(--f-simple,system-ui)!important;margin-left:8px}
.r3-dot.v{background:#55406b}.r3-dot.s{background:#2f6fb3}
.r3-end{margin:0 0 12px;padding:10px 12px;border-radius:12px;background:#3a2457;color:#fbefc8;text-align:left}
.r3-end b{display:block;font-size:15px;margin-bottom:2px}
.r3-end p{margin:0;font:500 14px/1.4 var(--f-simple,system-ui)!important}
#rulesBody details.r3-more{margin-top:4px;border-top:1px dashed #c9a25a;padding-top:4px}
#rulesBody details.r3-more>summary{cursor:pointer;min-height:48px;display:flex;align-items:center;gap:8px;list-style:none;font:700 15px var(--f-simple,system-ui)!important;color:#6b1530}
#rulesBody details.r3-more>summary::-webkit-details-marker{display:none}
#rulesBody details.r3-more>summary::after{content:"›";margin-left:auto;font-size:24px;transition:transform .2s}
#rulesBody details.r3-more[open]>summary::after{transform:rotate(90deg)}
/* title + close button stay visible while scrolling */
#mRules .mbox{padding-top:0!important}
#mRules .r3-head{position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 -4px 8px;padding:10px 0 8px 4px;background:inherit;background-color:#f3e6c8;border-bottom:1px solid rgba(201,162,90,.6)}
#mRules .r3-head h2{margin:0}
#mRules .r3-head .mclose{position:static!important;width:48px;height:48px;flex:0 0 48px;display:grid;place-items:center;font-size:24px}`;
  document.head.appendChild(css);
  function paint(){const body=$("#rulesBody");if(!body)return;
    const box=body.closest(".mbox"),h=box&&box.querySelector("#mRulesT"),x=box&&box.querySelector(".mclose");
    if(box&&h&&x&&!box.querySelector(".r3-head")){const hd=document.createElement("div");hd.className="r3-head";box.insertBefore(hd,box.firstChild);hd.appendChild(h);hd.appendChild(x)}
    let list=body.querySelector(".r3"),end=body.querySelector(".r3-end"),more=body.querySelector("details.r3-more");
    if(!list){list=document.createElement("ol");list.className="r3";body.prepend(list)}
    if(!end){end=document.createElement("div");end.className="r3-end";list.after(end)}
    if(!more){more=document.createElement("details");more.className="r3-more";more.innerHTML="<summary></summary>";end.after(more);[...body.children].forEach(ch=>{if(ch!==list&&ch!==more&&ch!==end)more.appendChild(ch)})}
    list.innerHTML=cards();
    end.innerHTML=`<b>🔎 ${L("Terminer l'enquête","Finishing the case","사건 마무리","事件を終える")}</b><p>${L("Quand tout le monde est placé, appuie sur « Valider », puis désigne le coupable.","Once everyone is placed, press “Check”, then point out the culprit.","모두 배치했다면 ‘확인’을 누르고 범인을 지목하세요.","全員を置いたら「チェック」を押して、犯人を指名しよう。")}</p>`;
    more.querySelector("summary").textContent=L("Tous les détails et la liste des objets","All the details and the list of objects","자세한 규칙과 물건 목록","くわしいルールと物の一覧")}
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);try{paint()}catch(e){}};
  try{paint()}catch(e){}
})();
