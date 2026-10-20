/* ================= clearer rule about rooms ================= */
(function(){
  const R={
    fr:["Une pièce peut accueillir <b>plusieurs personnes</b> : deux, trois ou plus, aucun problème. Seules les rangées et les colonnes sont limitées.",
        "La pièce de la victime est spéciale : il n'y a qu'<b>une seule autre personne</b> avec elle. C'est le <b>meurtrier</b>. Les autres pièces peuvent très bien contenir deux personnes ou plus."],
    en:["A room can hold <b>several people</b>: two, three or more is fine. Only rows and columns are limited.",
        "The victim's room is special: there is <b>exactly one other person</b> in it. That's the <b>murderer</b>. Other rooms can perfectly well hold two people or more."],
    ko:["한 방에는 <b>여러 사람</b>이 있을 수 있습니다. 두 명, 세 명 이상도 괜찮습니다. 제한은 행과 열에만 있습니다.",
        "피해자의 방은 특별합니다. 그 방에는 피해자 말고 <b>단 한 사람</b>만 있습니다. 그 사람이 바로 <b>범인</b>입니다. 다른 방에는 두 명 이상이 있어도 전혀 문제없습니다."],
    ja:["ひとつの部屋には<b>何人いても</b>かまいません。二人でも三人以上でも大丈夫。制限があるのは行と列だけです。",
        "被害者の部屋だけは特別：被害者のほかには<b>ちょうど一人</b>しかいません。その人こそ<b>犯人</b>です。ほかの部屋には二人以上いてもまったく問題ありません。"]};
  for(const l in R){if(RULES[l]){RULES[l]=RULES[l].slice(0,-1).concat(R[l])}}
  const T={fr:"Plusieurs personnes peuvent partager une pièce. Mais dans la pièce de la victime, il n'y a <b>qu'une seule autre personne</b> : le meurtrier. Quand tout le monde est placé, appuie sur <b>Valider</b>. Bonne enquête !",
    en:"Several people can share a room. But in the victim's room there is <b>only one other person</b>: the murderer. Once everyone is placed, press <b>Check</b>. Happy sleuthing!",
    ko:"여러 사람이 한 방에 있을 수 있습니다. 하지만 피해자의 방에는 <b>다른 사람이 딱 한 명</b>만 있습니다. 바로 범인이죠. 모두 배치했다면 <b>확인</b>을 누르세요. 즐거운 추리 되세요!",
    ja:"複数の人が同じ部屋にいてもかまいません。でも被害者の部屋には、<b>ほかに一人だけ</b>。それが犯人です。全員を配置したら<b>答え合わせ</b>を押しましょう。名推理を！"};
  try{for(const l in T){const st=TUTO[l];if(st)st[st.length-1][2]=T[l]}}catch(e){}
  try{renderStatic()}catch(e){}
})();
