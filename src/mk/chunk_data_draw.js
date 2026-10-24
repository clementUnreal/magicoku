const DATA=__DATA__;
const WALK=new Set(["chair","bed","rug","bath"]);
const META={
 maison:{level:["Facile","Easy"],title:["La Petite Maison","The Little House"],
  story:["<b>Tante Odette</b> a été retrouvée raide comme un piquet, son tricot encore sur les genoux. Cinq personnes étaient passées pour le goûter.","<b>Aunt Odette</b> was found stiff as a board, her knitting still on her lap. Five people had dropped by for tea."],
  weapon:["avec l'aiguille à tricoter","with the knitting needle"],
  rooms:{S:["le Salon","the Living Room"],K:["la Cuisine","the Kitchen"],B:["la Salle de bain","the Bathroom"],C:["la Chambre","the Bedroom"],E:["l'Entrée","the Hallway"],T:["la Terrasse","the Terrace"]},
  people:[["Tante Odette","f","tante adorée","beloved aunt",["#f6d2b8","#e9e6f0","bun","glasses","#c9b6e8"]],
   ["Bastien","m","neveu","nephew",["#f3d0b4","#e3a24a","short","","#ffd59a"]],
   ["Lila","f","voisine","neighbour",["#a8714c","#1f1622","long","","#f7b3c7"]],
   ["M. Pommier","m","facteur","postman",["#e8b48f","#6b4a2b","short","stache","#a9d6f5"]],
   ["Rosa","f","cuisinière","cook",["#fbe0cc","#d2394f","bun","","#bfe3c0"]],
   ["Jules","m","jardinier","gardener",["#8c5a3c","#2b1d14","bald","","#ffe08a"]]]},
 boulangerie:{level:["Facile","Easy"],title:["La Boulangerie Mie-Dorée","The Golden Crumb Bakery"],
  story:["<b>Maître Brioche</b> ne fera plus jamais de croissants. On l'a retrouvé tout plat, à côté du pétrin.","<b>Master Brioche</b> will never bake another croissant. He was found flat as a crêpe, next to the kneading trough."],
  weapon:["avec le rouleau à pâtisserie","with the rolling pin"],
  rooms:{F:["le Fournil","the Bakehouse"],A:["le Bureau","the Office"],V:["la Boutique","the Shop"],C:["la Cuisine","the Kitchen"],R:["la Réserve","the Storeroom"]},
  people:[["Maître Brioche","m","boulanger","baker",["#f3d0b4","#f2f2f2","bald","stache","#ffd59a"]],
   ["Capucine","f","apprentie","apprentice",["#fbe0cc","#b4532a","long","","#f7b3c7"]],
   ["Gustave","m","livreur","delivery man",["#c98b5e","#2b1d14","short","","#a9d6f5"]],
   ["Mme Praline","f","cliente fidèle","regular customer",["#f1cdb0","#9a9aa8","bun","glasses","#c9b6e8"]],
   ["Noé","m","pâtissier","pastry chef",["#e8b48f","#3b2a3f","short","glasses","#bfe3c0"]],
   ["Suzon","f","caissière","cashier",["#8c5a3c","#1f1622","bob","","#ffe08a"]]]},
 chalet:{level:["Moyen","Medium"],title:["Le Chalet des Neiges","The Snowy Chalet"],
  story:["Une tempête bloque le chalet. Au matin, le <b>Baron Flocon</b> ne se réveille pas. Sept invités, une seule vérité.","A storm traps everyone in the chalet. In the morning, <b>Baron Flake</b> doesn't wake up. Seven guests, one truth."],
  weapon:["avec la raquette à neige","with the snowshoe"],
  rooms:{A:["la Chambre des enfants","the Kids' Room"],B:["la Salle de bain","the Bathroom"],C:["la Chambre d'amis","the Guest Room"],D:["le Salon","the Lounge"],E:["la Cuisine","the Kitchen"],F:["le Local à skis","the Ski Room"],G:["la Salle à manger","the Dining Room"],H:["le Sauna","the Sauna"]},
  people:[["Baron Flocon","m","propriétaire","owner",["#f6d2b8","#e9e6f0","short","stache","#a9d6f5"]],
   ["Edwige","f","monitrice de ski","ski instructor",["#e8b48f","#f2c14e","long","","#ffd59a"]],
   ["Marius","m","guide de montagne","mountain guide",["#c98b5e","#5a3d24","short","beard","#bfe3c0"]],
   ["Pénélope","f","chanteuse","singer",["#fbe0cc","#d2394f","long","","#f7b3c7"]],
   ["Igor","m","chef","chef",["#f3d0b4","#2b1d14","bald","stache","#ffe08a"]],
   ["Anouk","f","photographe","photographer",["#a8714c","#1f1622","bob","glasses","#c9b6e8"]],
   ["Félicien","m","notaire","notary",["#f1cdb0","#9a9aa8","short","glasses","#d6d0c4"]],
   ["Rose","f","nièce du Baron","the Baron's niece",["#fbe0cc","#e3a24a","bun","","#f9c6a8"]]]},
 villa:{level:["Difficile","Hard"],title:["La Villa des Roses","The Rose Villa"],
  story:["<b>Madame Rosalinde</b>, ancienne diva, a chanté sa dernière note. Huit personnes rôdaient dans la villa ce soir-là.","<b>Madame Rosalind</b>, a retired diva, has sung her final note. Eight people were wandering the villa that night."],
  weapon:["avec le trophée en cristal","with the crystal trophy"],
  rooms:{K:["la Cuisine","the Kitchen"],S:["la Salle de musique","the Music Room"],B:["la Salle de bain","the Bathroom"],P:["le Garde-manger","the Pantry"],O:["le Bureau","the Study"],D:["la Salle à manger","the Dining Room"],T:["la Véranda","the Veranda"],C:["la Chambre","the Bedroom"],L:["le Salon","the Lounge"]},
  people:[["Madame Rosalinde","f","diva retraitée","retired diva",["#fbe0cc","#7b2d4a","bun","","#f7b3c7"]],
   ["Archibald","m","majordome","butler",["#f3d0b4","#3b2a3f","short","stache","#d6d0c4"]],
   ["Violette","f","sa fille","her daughter",["#fbe0cc","#5a3d24","long","","#c9b6e8"]],
   ["Dr Lambert","m","médecin","doctor",["#e8b48f","#9a9aa8","bald","glasses","#a9d6f5"]],
   ["Jasmine","f","pianiste","pianist",["#a8714c","#1f1622","bob","","#ffe08a"]],
   ["Hector","m","avocat","lawyer",["#f1cdb0","#2b1d14","short","glasses","#bfe3c0"]],
   ["Camille","f","fleuriste","florist",["#f3d0b4","#e3a24a","bun","","#f9c6a8"]],
   ["Ulysse","m","chauffeur","driver",["#8c5a3c","#2b1d14","short","beard","#ffd59a"]],
   ["Margaux","f","cuisinière","cook",["#e8b48f","#b4532a","long","glasses","#e3f0b0"]]]}
};
const OBJN={plant:["une plante","a plant"],table:["une table","a table"],shelf:["une bibliothèque","a bookcase"],tv:["une télé","a TV"],counter:["un comptoir","a counter"],
 piano:["le piano","the piano"],oven:["le four","the oven"],bed:["un lit","a bed"],chair:["un fauteuil","an armchair"],rug:["un tapis","a rug"],bath:["la baignoire","the bathtub"],window:["une fenêtre","a window"]};
const FLOORS=[
 ["conic-gradient(#f2b8c6 25%,#fbe1e8 0 50%,#f2b8c6 0 75%,#fbe1e8 0)","50% 50%"],
 ["conic-gradient(from 45deg,#9fb6e4 25%,#c3d3f2 0 50%,#9fb6e4 0 75%,#c3d3f2 0)","50% 50%"],
 ["repeating-linear-gradient(90deg,#d7908c 0 31%,#c27b78 31% 33.3%)","auto"],
 ["conic-gradient(#d9c2ec 25%,#f4ecfa 0 50%,#d9c2ec 0 75%,#f4ecfa 0)","33.4% 33.4%"],
 ["linear-gradient(#e4a07c 0 0) 0 0/100% 2px no-repeat,linear-gradient(90deg,#e4a07c 0 0) 0 0/2px 100% no-repeat,#f7c9a8",""],
 ["repeating-linear-gradient(0deg,#b9dcc0 0 31%,#a3cdb0 31% 33.3%)","auto"],
 ["conic-gradient(#f6d77e 25%,#fdf0c4 0 50%,#f6d77e 0 75%,#fdf0c4 0)","50% 50%"],
 ["linear-gradient(#c7a6d9 0 0) 0 0/100% 2px no-repeat,linear-gradient(90deg,#c7a6d9 0 0) 0 0/2px 100% no-repeat,#e8d6f2",""],
 ["repeating-linear-gradient(90deg,#d8b48a 0 23%,#c9a074 23% 25%)","auto"]];
const TXT={tag:["Place les suspects. Démasque le coupable.","Place the suspects. Unmask the culprit."],
 marker:["Feutre","Marker"],pencil:["Crayon","Pencil"],undo:["Retour","Undo"],hint:["Indice","Hint"],reset:["Recommencer","Restart"],file:["Le dossier","Case file"],rules:["Les règles","The rules"]};
const RULES={fr:["Une seule personne par <b>rangée</b> et par <b>colonne</b>.","On peut se tenir sur un fauteuil, un lit, un tapis ou dans la baignoire. <b>Jamais</b> sur une table, une plante, une bibliothèque, un comptoir, une télé, le four ou le piano.","« À côté » veut dire sur une case voisine : gauche, droite, haut ou bas, même de l'autre côté d'un mur. « À côté d'une fenêtre » : sur une case contre une fenêtre.","Le meurtrier est la <b>seule personne seule dans une pièce avec la victime</b>."],
 en:["Only one person per <b>row</b> and per <b>column</b>.","You can stand on an armchair, a bed, a rug or in the bathtub. <b>Never</b> on a table, a plant, a bookcase, a counter, a TV, the oven or the piano.","“Next to” means a neighbouring square: left, right, up or down, even through a wall. “Next to a window”: on a square against a window.","The murderer is the <b>only person alone in a room with the victim</b>."]};
let LANG="fr";
try{LANG=localStorage.getItem("crimes-mignons:lang")||((navigator.language||"fr").toLowerCase().startsWith("fr")?"fr":"en")}catch(e){LANG=(navigator.language||"fr").toLowerCase().startsWith("fr")?"fr":"en"}
const L=(fr,en)=>LANG==="en"?en:fr;
const LI=()=>LANG==="en"?1:0;
const $=s=>document.querySelector(s);
const ROWS="ABCDEFGHI";
/* ---------- case helpers ---------- */
let ci=0,C,M,N,OBJ,WIN,S,hist=[];
function prep(){
  C=DATA[ci];M=META[C.id];N=C.rooms.length;
  OBJ=[...Array(N)].map(()=>Array(N).fill(null));
  C.objs.forEach(([t,r,c,h,w])=>{for(let a=0;a<h;a++)for(let b=0;b<w;b++)OBJ[r+a][c+b]=t});
  WIN={};C.windows.forEach(([r,c,s])=>WIN[r+","+c]=s);
}
const room=(r,c)=>C.rooms[r][c];
const rname=k=>M.rooms[k][LI()];
const pname=p=>M.people[p][0];
const prole=p=>M.people[p][2+LI()];
const fem=(p,m,f)=>M.people[p][1]==="f"?f:m;
const blocked=(r,c)=>OBJ[r][c]&&!WALK.has(OBJ[r][c]);
const posn=(r,c)=>ROWS[r]+(c+1);
function adjTypes(r,c){const s=new Set();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const rr=r+a,cc=c+b;if(rr>=0&&rr<N&&cc>=0&&cc<N&&OBJ[rr][cc]&&OBJ[rr][cc]!==OBJ[r][c])s.add(OBJ[rr][cc])});if(WIN[r+","+c])s.add("window");return s}
function face(look,{victim=false,angry=false}={}){
  const [skin,hair,style,extra,bg]=look;let h="",back="";
  if(style==="long")back=`<path d="M7.5 23a12.5 12.5 0 0125 0v14h-5V24h-15v13h-5z" fill="${hair}"/>`;
  if(style==="bob")back=`<path d="M7.5 24a12.5 12.5 0 0125 0v7h-25z" fill="${hair}"/>`;
  if(["short","long","bob"].includes(style))h=`<path d="M8.6 22a11.4 11.4 0 0122.8 0c-2.5-4.2-7-6-11.4-6s-8.9 1.8-11.4 6z" fill="${hair}"/>`;
  if(style==="bun")h=`<circle cx="20" cy="8.5" r="4.6" fill="${hair}"/><path d="M8.6 22a11.4 11.4 0 0122.8 0c-2.5-4-7-5.5-11.4-5.5s-8.9 1.5-11.4 5.5z" fill="${hair}"/>`;
  if(style==="bald")h=`<path d="M8.8 24c0-3 .7-5 1.8-6M31.2 24c0-3-.7-5-1.8-6" stroke="${hair}" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  const eyes=victim?`<path d="M14.4 22.6q1.6 1.4 3.2 0M22.4 22.6q1.6 1.4 3.2 0" stroke="#2c1a33" stroke-width="1.3" fill="none" stroke-linecap="round"/>`
    :`<circle cx="16" cy="23" r="1.5" fill="#2c1a33"/><circle cx="24" cy="23" r="1.5" fill="#2c1a33"/><circle cx="16.5" cy="22.5" r=".5" fill="#fff"/><circle cx="24.5" cy="22.5" r=".5" fill="#fff"/>`;
  const brows=angry?`<path d="M13.5 19.2l4.5 1.8M26.5 19.2l-4.5 1.8" stroke="#2c1a33" stroke-width="1.6" stroke-linecap="round"/>`:"";
  const mouth=victim?`<ellipse cx="20" cy="28.6" rx="1.6" ry="1.2" fill="#2c1a33"/>`:angry?`<path d="M17.6 29.2q2.4 -1.6 4.8 0" stroke="#2c1a33" stroke-width="1.3" fill="none" stroke-linecap="round"/>`:`<path d="M17.6 27.6q2.4 2.2 4.8 0" stroke="#2c1a33" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  const grey=["#e9e6f0","#9a9aa8","#f2f2f2"].includes(hair);
  const stache=extra==="stache"?`<path d="M15.5 27.2q2.2-2.4 4.5-.6 2.3-1.8 4.5.6-2.3.4-4.5-.4-2.2.8-4.5.4z" fill="${grey?"#8f8a9a":hair}"/>`:"";
  const beard=extra==="beard"?`<path d="M10 26c1 7 5 10 10 10s9-3 10-10c-2 3-5 4-10 4s-8-1-10-4z" fill="${hair}"/>`:"";
  const glasses=extra==="glasses"?`<circle cx="16" cy="23" r="3.3" fill="none" stroke="#2c1a33" stroke-width="1"/><circle cx="24" cy="23" r="3.3" fill="none" stroke="#2c1a33" stroke-width="1"/><path d="M19.3 23h1.4" stroke="#2c1a33"/>`:"";
  const halo=victim?`<circle cx="31" cy="9" r="2.2" fill="#7fd98a" stroke="#2c1a33" stroke-width=".7"/><circle cx="34.5" cy="5" r="1.4" fill="#7fd98a" stroke="#2c1a33" stroke-width=".6"/><circle cx="28" cy="5" r="1" fill="#7fd98a"/>`:"";
  const knife=angry?`<g transform="translate(29 22)"><rect x="2" y="0" width="3" height="2.4" rx=".6" fill="#8a5a33"/><path d="M2.3 2.4h2.4v2.6c2.4 1 3.6 2.8 3.6 5 0 3-2.2 5-4.8 5S-1.3 13-1.3 10c0-2.2 1.2-4 3.6-5z" fill="#5fd36a" stroke="#2c1a33" stroke-width=".7"/></g>`:"";
  return `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" fill="${bg}"/>${back}<path d="M5 40c1-7 7-10 15-10s14 3 15 10z" fill="${grey?"#7b5ea7":"#ffffff"}" opacity=".85"/><circle cx="20" cy="22.5" r="11" fill="${skin}"/>${h}<ellipse cx="13.6" cy="26.4" rx="2" ry="1.3" fill="#f27c94" opacity=".55"/><ellipse cx="26.4" cy="26.4" rx="2" ry="1.3" fill="#f27c94" opacity=".55"/>${eyes}${brows}${mouth}${beard}${stache}${glasses}${halo}${knife}</svg>`;
}
const look=p=>M.people[p][4];
/* ---------- furniture drawing (1 cell = 100 units) ---------- */
function drawObj(t,r,c,h,w){
  const x=c*100,y=r*100,W=w*100,H=h*100;
  switch(t){
   case "chair":return `<g transform="translate(${x} ${y})"><rect x="16" y="22" width="68" height="64" rx="18" fill="#c8b48e" opacity=".5" transform="translate(4 6)"/><rect x="18" y="14" width="64" height="30" rx="14" fill="#f7ecd0" stroke="#8a7350" stroke-width="3"/><rect x="14" y="34" width="18" height="48" rx="9" fill="#f7ecd0" stroke="#8a7350" stroke-width="3"/><rect x="68" y="34" width="18" height="48" rx="9" fill="#f7ecd0" stroke="#8a7350" stroke-width="3"/><rect x="30" y="40" width="40" height="42" rx="8" fill="#fbf3dd" stroke="#8a7350" stroke-width="3"/></g>`;
   case "bed":{const v=h>w;return `<g transform="translate(${x} ${y})"><rect x="8" y="8" width="${W-16}" height="${H-16}" rx="10" fill="#fdf3ee" stroke="#8a5a5a" stroke-width="3"/>`+
     (v?`<rect x="18" y="16" width="${W-36}" height="34" rx="10" fill="#fff" stroke="#c9a4a4" stroke-width="3"/><path d="M8 ${H*.36}h${W-16}v${H*.64-18}a10 10 0 01-10 10h${-(W-36)}a10 10 0 01-10-10z" fill="#e88a9a" stroke="#8a5a5a" stroke-width="3"/><path d="M8 ${H*.36+14}h${W-16}" stroke="#f8c3cc" stroke-width="6"/>`
       :`<rect x="16" y="18" width="34" height="${H-36}" rx="10" fill="#fff" stroke="#c9a4a4" stroke-width="3"/><path d="M${W*.36} 8h${W*.64-18}a10 10 0 0110 10v${H-36}a10 10 0 01-10 10h${-(W*.64-18)}z" fill="#e88a9a" stroke="#8a5a5a" stroke-width="3"/><path d="M${W*.36+14} 8v${H-16}" stroke="#f8c3cc" stroke-width="6"/>`)+`</g>`}
   case "rug":return `<g transform="translate(${x} ${y})" opacity=".9"><rect x="7" y="7" width="${W-14}" height="${H-14}" rx="16" fill="#e7b7d9" stroke="#9a5a8a" stroke-width="3"/><rect x="18" y="18" width="${W-36}" height="${H-36}" rx="10" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="7 6"/><circle cx="${W/2}" cy="${H/2}" r="${Math.min(W,H)/7}" fill="#f6dcef"/></g>`;
   case "bath":return `<g transform="translate(${x} ${y})"><rect x="8" y="12" width="${W-16}" height="${H-24}" rx="34" fill="#fff" stroke="#6b8aa8" stroke-width="3.5"/><rect x="20" y="24" width="${W-40}" height="${H-48}" rx="24" fill="#a8d8f0"/><circle cx="${W-38}" cy="${H/2}" r="7" fill="#c9cfd6" stroke="#6b8aa8" stroke-width="2"/><circle cx="40" cy="38" r="6" fill="#fff" opacity=".8"/><circle cx="54" cy="46" r="4" fill="#fff" opacity=".8"/></g>`;
   case "table":return `<g transform="translate(${x} ${y})"><rect x="12" y="14" width="${W-24}" height="${H-30}" rx="5" fill="#a9524d" stroke="#5e2a2a" stroke-width="3"/><rect x="12" y="${H-22}" width="${W-24}" height="8" fill="#7d3633"/><rect x="18" y="${H-16}" width="9" height="12" fill="#5e2a2a"/><rect x="${W-27}" y="${H-16}" width="9" height="12" fill="#5e2a2a"/>`+
     (W>100?`<ellipse cx="${W*.3}" cy="${(H-16)/2}" rx="18" ry="11" fill="#f4f4f4" stroke="#b9b9b9" stroke-width="2"/><path d="M${W*.7-6} ${(H-16)/2-14}h12l-3 12h-6zM${W*.7} ${(H-16)/2-2}v10" stroke="#5e2a2a" stroke-width="2" fill="#c45b7a"/>`:`<circle cx="${W/2+12}" cy="${(H-16)/2-2}" r="8" fill="#f4f4f4" stroke="#b9b9b9" stroke-width="2"/>`)+`</g>`;
   case "counter":return `<g transform="translate(${x} ${y})"><rect x="6" y="8" width="${W-12}" height="${H-16}" rx="4" fill="#a9524d" stroke="#5e2a2a" stroke-width="3"/><rect x="6" y="8" width="${W-12}" height="14" fill="#c46a63"/>${W>100?`<circle cx="${W-40}" cy="${H/2+6}" r="14" fill="#cfd6dc" stroke="#7d8b98" stroke-width="3"/>`:""}</g>`;
   case "plant":return `<g transform="translate(${x} ${y})"><ellipse cx="50" cy="80" rx="28" ry="9" fill="#000" opacity=".15"/><path d="M30 56h40l-6 28H36z" fill="#c45b6a" stroke="#6e2a35" stroke-width="3"/><path d="M50 58c-8-10-22-14-30-12 6 6 18 10 30 12zM50 58c8-10 22-14 30-12-6 6-18 10-30 12zM50 58c-4-14-2-30 4-40 2 12 0 28-4 40zM50 58c-10-6-16-20-14-32 6 8 12 20 14 32zM50 58c10-6 16-20 14-32-6 8-12 20-14 32z" fill="#8fcf8a" stroke="#2f6b49" stroke-width="2.5" stroke-linejoin="round"/></g>`;
   case "shelf":{let b="";const bw=W-28;for(let i=0;i<Math.floor(bw/11);i++){const cols=["#f3e2c7","#d06a6a","#f3e2c7","#e7c37a","#f3e2c7","#8f5a8a"];b+=`<rect x="${14+i*11}" y="${22+(i%3)*3}" width="9" height="${H/2-30-(i%3)*3}" fill="${cols[i%6]}"/><rect x="${14+i*11}" y="${H/2+8}" width="9" height="${H/2-30}" fill="${cols[(i+3)%6]}"/>`}
     return `<g transform="translate(${x} ${y})"><rect x="8" y="10" width="${W-16}" height="${H-20}" rx="4" fill="#6e2a3e" stroke="#3a1420" stroke-width="3"/><rect x="13" y="16" width="${W-26}" height="${H/2-20}" fill="#4a1a2a"/><rect x="13" y="${H/2+2}" width="${W-26}" height="${H/2-20}" fill="#4a1a2a"/>${b}</g>`}
   case "tv":return `<g transform="translate(${x} ${y})"><rect x="12" y="14" width="76" height="56" rx="8" fill="#a3a8c4" stroke="#3e3a5a" stroke-width="3"/><rect x="20" y="20" width="60" height="42" rx="4" fill="#e6ebf5"/><path d="M48 32v16a4 4 0 11-2-3.5V30l10 3v4z" fill="#3e3a5a"/><rect x="20" y="72" width="60" height="14" rx="4" fill="#7b7fa0" stroke="#3e3a5a" stroke-width="3"/></g>`;
   case "piano":return `<g transform="translate(${x} ${y})"><rect x="8" y="10" width="${W-16}" height="${H-20}" rx="10" fill="#2a2430" stroke="#000" stroke-width="3"/><rect x="16" y="${H-40}" width="${W-32}" height="22" fill="#fff"/>${[...Array(Math.floor((W-32)/14))].map((_,i)=>i%7===2||i%7===6?"":`<rect x="${24+i*14}" y="${H-40}" width="7" height="13" fill="#000"/>`).join("")}<circle cx="${W/2}" cy="34" r="9" fill="#d9334c"/></g>`;
   case "oven":return `<g transform="translate(${x} ${y})"><rect x="8" y="8" width="${W-16}" height="${H-16}" rx="12" fill="#c98c6a" stroke="#6e3b25" stroke-width="3"/><path d="M${W/2-40} ${H-20}v-30a40 26 0 0180 0v30z" fill="#3a1d12"/><path d="M${W/2-28} ${H-22}c4-12 12-8 14-18 4 8 10 6 12 16 4-6 8-4 10 2z" fill="#f59a2a"/></g>`;
  }
  return "";
}
function drawWindow(r,c,s){const x=c*100,y=r*100;const g=(X,Y,w,h)=>`<rect x="${X}" y="${Y}" width="${w}" height="${h}" rx="7" fill="#f0b6c8" stroke="${"#2a1830"}" stroke-width="3"/><rect x="${X+(w>h?10:5)}" y="${Y+(w>h?5:10)}" width="${w>h?w-20:h>w?w-10:0}" height="${w>h?h-10:h-20}" rx="3" fill="#fff"/>`;
  if(s==="t")return g(x+18,y-15,64,16);if(s==="b")return g(x+18,y+99,64,16);if(s==="l")return g(x-15,y+18,16,64);return g(x+99,y+18,16,64)}
