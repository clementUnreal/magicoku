/* ---------- clue text ---------- */
function clueText(p,[k,v]){
  const Nm=`<b>${pname(p)}</b>`,Q=typeof v==="number"?pname(v):"";
  const o=OBJN[v]?OBJN[v][LI()]:"";
  if(LANG==="en")switch(k){
    case "room":return `${Nm} was in ${rname(v)}.`;case "notroom":return `${Nm} was not in ${rname(v)}.`;
    case "row":return `${Nm} was in row ${ROWS[v]}.`;case "col":return `${Nm} was in column ${v+1}.`;
    case "on":return {chair:`${Nm} was sitting in an armchair.`,bed:`${Nm} was lying on a bed.`,rug:`${Nm} was standing on a rug.`,bath:`${Nm} was in the bathtub.`}[v];
    case "adj":return `${Nm} was next to ${o}.`;case "same":return `${Nm} was in the same room as ${Q}.`;
    case "south":return `${Nm} was further south than ${Q}.`;case "north":return `${Nm} was further north than ${Q}.`;
    case "east":return `${Nm} was further east than ${Q}.`;case "west":return `${Nm} was further west than ${Q}.`;
    case "alone":return `${Nm} was alone in ${fem(p,"his","her")} room.`;}
  switch(k){
    case "room":return `${Nm} était dans ${rname(v)}.`;case "notroom":return `${Nm} n'était pas dans ${rname(v)}.`;
    case "row":return `${Nm} était sur la rangée ${ROWS[v]}.`;case "col":return `${Nm} était sur la colonne ${v+1}.`;
    case "on":return {chair:`${Nm} était ${fem(p,"assis","assise")} dans un fauteuil.`,bed:`${Nm} était ${fem(p,"allongé","allongée")} sur un lit.`,rug:`${Nm} était debout sur un tapis.`,bath:`${Nm} était dans la baignoire.`}[v];
    case "adj":return `${Nm} était à côté ${o.startsWith("le ")?"du "+o.slice(3):o.startsWith("la ")?"de la "+o.slice(3):"d'"+o}.`;
    case "same":return `${Nm} était dans la même pièce que ${Q}.`;
    case "south":return `${Nm} était plus au sud que ${Q}.`;case "north":return `${Nm} était plus au nord que ${Q}.`;
    case "east":return `${Nm} était plus à l'est que ${Q}.`;case "west":return `${Nm} était plus à l'ouest que ${Q}.`;
    case "alone":return `${Nm} était ${fem(p,"seul","seule")} dans sa pièce.`;}
}
