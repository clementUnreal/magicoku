
/* ================= per-chapter visual identity (story mode): floors, walls, posts, doors, frame ================= */
var TH_FLOOR={
 forest:{clairiere:"grass",sousbois:"grass2",mare:"water",grotte:"stone",campement:"dirt",ronces:"grass2",cercle:"cobble",nid:"dirt"},
 station:{quai:"platform",attente:"tiles",guichet:"marble",consigne:"planks",buffet:"tiles",voies:"rails",hallg:"marble",souterrain:"stone"},
 bank:{comptoir:"marble",coffres:"stone",rails:"rails",chambreforte:"stone",directeur:"carpet",galerie:"dirt",change:"marble",crypte:"stone"},
 alley:{baguettes:"planks",librairie:"planks",apothic:"stone",menagerie:"planks",tailleur:"carpet",glacier:"tiles",farces:"tiles",ruelle:"cobble"},
 village:{taverne:"planks",confiserie:"tiles",poste:"planks",place:"snow",cabane:"planks",salonthe:"carpet",forge:"stone",pont:"snowplanks"},
 lake:{rive:"sand",ponton:"planks",hangar:"planks",ile:"grass",phare:"stone",cabanep:"planks",roseliere:"grass2",crique:"water"},
 stadium:{terrain:"turf",tribune:"planks",vestiaire:"tiles",tourcom:"planks",infirmerie:"tiles",reserve:"planks",loge:"carpet",tunnel:"stone"},
 hospital:{accueil:"marble",salle:"tiles",pharmacie:"tiles",serreh:"grass",chambre:"carpet",bloc:"tiles",laboh:"tiles",jardin:"grass"},
 ministry:{atrium:"marble",archives:"planks",audience:"carpet",ascenseurs:"marble",ministre:"carpet",secrets:"marble",courrier:"planks",cantine:"tiles"},
 fortress:{cour:"cobble",cachots:"stone",tourf:"stone",garde:"planks",chemin:"cobble",armurerie:"stone",chapelle:"marble",donjon:"stone"}};
function themeEnv(){return M&&M.env&&!(typeof RUSH!=="undefined"&&RUSH.on)&&!(typeof NIGHT!=="undefined"&&NIGHT.on)&&!(typeof LIAR!=="undefined"&&LIAR.on)?M.env:null}
function themeClass(){const e=themeEnv();return e?"th th-"+e:""}
function themeFloor(k,r,c){const e=themeEnv();if(!e||!M.rtypes)return null;const st=((typeof TH_FLOOR!=="undefined"&&TH_FLOOR&&TH_FLOOR[e])||{})[M.rtypes[k]];if(!st)return null;
  const [f1,f2]=(M.floors||FLOORS)[k]||["#ccc","#ddd"],d=shade(f1,.84),dd=shade(f1,.7),l=shade(f1,1.12),odd=(r+c)%2;
  const seed=((r*7+c*13)%5)/5;
  switch(st){
    case "grass":return `radial-gradient(circle at ${20+seed*40}% ${30+seed*20}%,${dd} 0 3%,transparent 3.5%),radial-gradient(circle at ${70-seed*30}% 70%,${d} 0 4%,transparent 4.5%),radial-gradient(circle at 55% 25%,${l} 0 3%,transparent 3.5%),${odd?f2:f1}`;
    case "grass2":return `radial-gradient(ellipse 18% 10% at ${30+seed*30}% 60%,${dd} 0 60%,transparent 62%),radial-gradient(circle at 75% 25%,${l} 0 3%,transparent 3.5%),${odd?f1:shade(f1,.94)}`;
    case "water":return `radial-gradient(ellipse 30% 7% at 30% 30%,${l} 0 55%,transparent 60%),radial-gradient(ellipse 26% 6% at 70% 72%,${l} 0 55%,transparent 60%),linear-gradient(${f2},${f1})`;
    case "dirt":case "sand":return `radial-gradient(circle at ${25+seed*30}% 35%,${d} 0 3%,transparent 3.5%),radial-gradient(circle at 70% ${60+seed*20}%,${dd} 0 2.5%,transparent 3%),radial-gradient(circle at 40% 80%,${l} 0 3%,transparent 3.5%),${odd?f2:f1}`;
    case "stone":return `linear-gradient(90deg,${dd} 0 2%,transparent 2% 98%,${dd} 98%) 0 0/100% 100%,linear-gradient(${dd} 0 2%,transparent 2% 98%,${dd} 98%) 0 0/100% 100%,linear-gradient(135deg,${l},${odd?f1:d})`;
    case "cobble":return `radial-gradient(circle at 27% 27%,${l} 0 18%,${dd} 19% 22%,transparent 23%) 0 0/100% 100%,radial-gradient(circle at 73% 30%,${f2} 0 17%,${dd} 18% 21%,transparent 22%),radial-gradient(circle at 30% 74%,${f2} 0 17%,${dd} 18% 21%,transparent 22%),radial-gradient(circle at 74% 74%,${l} 0 18%,${dd} 19% 22%,transparent 23%),${d}`;
    case "planks":return `repeating-linear-gradient(0deg,${f1} 0 30%,${dd} 30% 33.33%),${f1}`;
    case "snowplanks":return `radial-gradient(circle at 30% 30%,#fff 0 5%,transparent 6%),repeating-linear-gradient(90deg,${f1} 0 30%,${dd} 30% 33.33%)`;
    case "tiles":return `conic-gradient(${f1} 25%,${l} 0 50%,${f1} 0 75%,${l} 0) 0 0/50% 50%,${f1}`;
    case "marble":return `linear-gradient(${120+seed*40}deg,transparent 40%,${l} 42%,transparent 46%,transparent 70%,rgba(255,255,255,.18) 71%,transparent 73%),linear-gradient(90deg,${d} 0 1.5%,transparent 1.5%),linear-gradient(${d} 0 1.5%,transparent 1.5%),${odd?f2:f1}`;
    case "carpet":return `linear-gradient(90deg,transparent 8%,${l} 8% 10%,transparent 10% 90%,${l} 90% 92%,transparent 92%),${f1}`;
    case "snow":return `radial-gradient(circle at ${20+seed*50}% 30%,#cfe0ee 0 4%,transparent 4.5%),radial-gradient(circle at 70% 70%,#dbe8f3 0 5%,transparent 5.5%),radial-gradient(circle at 35% 75%,#fff 0 3%,transparent 3.5%),${odd?"#f3f8fc":"#eaf2f8"}`;
    case "turf":return `${c%2?shade(f1,1.08):f1}`;
    case "rails":return `linear-gradient(90deg,transparent 24%,#8b8f9a 24% 29%,transparent 29% 71%,#8b8f9a 71% 76%,transparent 76%),repeating-linear-gradient(0deg,#7a5a3a 0 14%,transparent 14% 50%),${f1}`;
    case "platform":return `linear-gradient(90deg,${d} 0 2%,transparent 2%),linear-gradient(${d} 0 2%,transparent 2%),${odd?f2:f1}`;
  }return null}
/* walls: a base stroke + a texture overlay, per chapter */
var TH_WALL={
 forest:{base:"#2f5428",over:"#6aa857",dash:"0 17",ow:.62,cap:"round"},
 station:{base:"#6e2e24",over:"#b65a44",dash:"16 5",ow:.55,cap:"butt"},
 bank:{base:"#2e2b38",over:"#d9a840",dash:"",ow:.16,cap:"butt"},
 alley:{base:"#4a3220",over:"#a0703f",dash:"24 9",ow:.42,cap:"butt"},
 village:{base:"#5a3e26",over:"#f6fbff",dash:"28 7",ow:.5,cap:"round"},
 lake:{base:"#5a4028",over:"#a8743f",dash:"9 6",ow:.5,cap:"butt"},
 stadium:{base:"#2a1824",over:"#d6404f",dash:"14 14",ow:.62,cap:"butt",fill:"#f5f5f5"},
 hospital:{base:"#5f7d8a",over:"#e8f2f6",dash:"",ow:.55,cap:"round"},
 ministry:{base:"#163a2e",over:"#d9a840",dash:"",ow:.2,cap:"butt"},
 fortress:{base:"#3b3f4c",over:"#7a7f93",dash:"20 4",ow:.62,cap:"butt"}};
function themeWall(wall,K){const e=themeEnv();if(!e)return wall;const t=typeof TH_WALL!=="undefined"&&TH_WALL?TH_WALL[e]:null;if(!t)return wall;
  let base=wall.replace(/class="w( o)?"/g,(m,o)=>`class="w${o||""}" style="stroke:${t.base}"`);
  if(t.fill)base=base.replace(/style="stroke:[^"]+"/g,`style="stroke:${t.base}"`);
  const over=wall.replace(/class="w( o)?" stroke-width="([\d.]+)"/g,(m,o,w)=>`class="w2" stroke-width="${(+w*t.ow).toFixed(1)}" style="stroke:${t.fill&&false?t.fill:t.over};stroke-linecap:${t.cap}${t.dash?`;stroke-dasharray:${t.dash.split(" ").map(x=>(+x*K*1.1).toFixed(1)).join(" ")}`:""}"`);
  const fill=t.fill?wall.replace(/class="w( o)?" stroke-width="([\d.]+)"/g,(m,o,w)=>`class="w2" stroke-width="${(+w*.72).toFixed(1)}" style="stroke:${t.fill};stroke-linecap:butt"`):"";
  return base+fill+over}
/* corner posts */
function themePost(x,y,q){const e=themeEnv();if(!e)return null;const s=19*q;
  switch(e){
    case "forest":return `<circle cx="${x}" cy="${y}" r="${s*1.25}" fill="#2f5428"/><circle cx="${x-s*.3}" cy="${y-s*.35}" r="${s*.75}" fill="#5f9a4e"/><circle cx="${x+s*.35}" cy="${y-s*.1}" r="${s*.6}" fill="#6aa857"/><circle cx="${x-s*.4}" cy="${y-s*.55}" r="${s*.22}" fill="#8cc874"/>`;
    case "station":return `<rect x="${x-s}" y="${y-s}" width="${2*s}" height="${2*s}" rx="${3*q}" fill="#3b3550"/><circle cx="${x}" cy="${y}" r="${s*.45}" fill="#ffe08a"/>`;
    case "bank":return `<rect x="${x-s}" y="${y-s}" width="${2*s}" height="${2*s}" rx="${3*q}" fill="#2e2b38"/><circle cx="${x}" cy="${y}" r="${s*.55}" fill="#d9a840" stroke="#7a5a1a" stroke-width="${2*q}"/>`;
    case "alley":return `<rect x="${x-s}" y="${y-s}" width="${2*s}" height="${2*s}" rx="${2*q}" fill="#4a3220"/><rect x="${x-s*.45}" y="${y-s*.45}" width="${s*.9}" height="${s*.9}" rx="${2*q}" fill="#ffd65a" opacity=".9"/>`;
    case "village":return `<rect x="${x-s}" y="${y-s}" width="${2*s}" height="${2*s}" rx="${4*q}" fill="#5a3e26"/><ellipse cx="${x}" cy="${y-s*.55}" rx="${s*1.1}" ry="${s*.6}" fill="#f6fbff"/>`;
    case "lake":return `<circle cx="${x}" cy="${y}" r="${s*1.05}" fill="#5a4028"/><circle cx="${x}" cy="${y}" r="${s*.65}" fill="#a8743f"/><circle cx="${x}" cy="${y}" r="${s*.3}" fill="#5a4028"/>`;
    case "stadium":return `<rect x="${x-s*.35}" y="${y-s*1.3}" width="${s*.7}" height="${s*2.3}" fill="#f5f5f5" stroke="#2a1824" stroke-width="${3*q}"/><path d="M${x+s*.35} ${y-s*1.3}L${x+s*1.6} ${y-s*.9}L${x+s*.35} ${y-s*.5}Z" fill="#d6404f" stroke="#2a1824" stroke-width="${2*q}"/>`;
    case "hospital":return `<circle cx="${x}" cy="${y}" r="${s}" fill="#5f7d8a"/><circle cx="${x}" cy="${y}" r="${s*.7}" fill="#e8f2f6"/><path d="M${x-s*.35} ${y}H${x+s*.35}M${x} ${y-s*.35}V${y+s*.35}" stroke="#d6404f" stroke-width="${4*q}"/>`;
    case "ministry":return `<rect x="${x-s}" y="${y-s}" width="${2*s}" height="${2*s}" fill="#163a2e"/><rect x="${x-s*.55}" y="${y-s*.55}" width="${s*1.1}" height="${s*1.1}" fill="#d9a840" transform="rotate(45 ${x} ${y})"/>`;
    case "fortress":return `<rect x="${x-s*1.15}" y="${y-s*1.15}" width="${2.3*s}" height="${2.3*s}" fill="#3b3f4c"/><rect x="${x-s*1.15}" y="${y-s*1.6}" width="${s*.7}" height="${s*.6}" fill="#3b3f4c"/><rect x="${x+s*.45}" y="${y-s*1.6}" width="${s*.7}" height="${s*.6}" fill="#3b3f4c"/><rect x="${x-s*.6}" y="${y-s*.6}" width="${s*1.2}" height="${s*1.2}" fill="#7a7f93"/>`;
  }return null}
/* doors */
function themeDoor(h,mx,my,g,s){const e=themeEnv();if(!e)return null;const x=h?mx-g:s.x1,y=h?s.y1:my-g;
  const span=(fn)=>{let o="";for(let i=0;i<3;i++){const t=(i+.5)/3;o+=fn(h?mx-g+2*g*t:s.x1,h?s.y1:my-g+2*g*t,i)}return o};
  const sill=(col)=>`<rect x="${h?mx-g:s.x1-6}" y="${h?s.y1-6:my-g}" width="${h?2*g:12}" height="${h?12:2*g}" fill="${col}"/>`;
  switch(e){
    case "forest":return span((cx,cy,i)=>`<ellipse cx="${cx}" cy="${cy}" rx="${h?9:7}" ry="${h?7:9}" fill="#a9a3b8" stroke="#4a4458" stroke-width="2.5"/>`);
    case "lake":return sill("#7a5a3a")+span((cx,cy)=>h?`<rect x="${cx-8}" y="${cy-14}" width="16" height="28" rx="2" fill="#c48a52" stroke="#5a4028" stroke-width="2.5"/>`:`<rect x="${cx-14}" y="${cy-8}" width="28" height="16" rx="2" fill="#c48a52" stroke="#5a4028" stroke-width="2.5"/>`);
    case "station":return sill("#c9c6d0")+(h?`<rect x="${mx-g}" y="${s.y1-5}" width="${g*.8}" height="10" fill="#8b8f9a" stroke="#3b3550" stroke-width="2.5"/><rect x="${mx+g*.2}" y="${s.y1-5}" width="${g*.8}" height="10" fill="#8b8f9a" stroke="#3b3550" stroke-width="2.5"/>`:`<rect x="${s.x1-5}" y="${my-g}" width="10" height="${g*.8}" fill="#8b8f9a" stroke="#3b3550" stroke-width="2.5"/><rect x="${s.x1-5}" y="${my+g*.2}" width="10" height="${g*.8}" fill="#8b8f9a" stroke="#3b3550" stroke-width="2.5"/>`);
    case "bank":return sill("#d9a840")+`<circle cx="${h?mx-g:s.x1}" cy="${h?s.y1:my-g}" r="11" fill="#d9a840" stroke="#2e2b38" stroke-width="3"/><circle cx="${h?mx+g:s.x1}" cy="${h?s.y1:my+g}" r="11" fill="#d9a840" stroke="#2e2b38" stroke-width="3"/>`;
    case "stadium":return h?`<rect x="${mx-g}" y="${s.y1-6}" width="${2*g}" height="12" fill="#f5f5f5" stroke="#2a1824" stroke-width="2.5"/><path d="M${mx-g+8} ${s.y1}H${mx+g-8}" stroke="#d6404f" stroke-width="6" stroke-dasharray="10 8"/>`:`<rect x="${s.x1-6}" y="${my-g}" width="12" height="${2*g}" fill="#f5f5f5" stroke="#2a1824" stroke-width="2.5"/><path d="M${s.x1} ${my-g+8}V${my+g-8}" stroke="#d6404f" stroke-width="6" stroke-dasharray="10 8"/>`;
    case "hospital":return sill("#e8f2f6")+(h?`<path d="M${mx-g} ${s.y1}l${g*.8} ${g*.5}M${mx+g} ${s.y1}l${-g*.8} ${g*.5}" stroke="#5f7d8a" stroke-width="6" stroke-linecap="round"/>`:`<path d="M${s.x1} ${my-g}l${g*.5} ${g*.8}M${s.x1} ${my+g}l${g*.5} ${-g*.8}" stroke="#5f7d8a" stroke-width="6" stroke-linecap="round"/>`);
    case "ministry":return sill("#d9a840")+(h?`<path d="M${mx} ${s.y1-8}V${s.y1+8}" stroke="#163a2e" stroke-width="4"/>`:`<path d="M${s.x1-8} ${my}H${s.x1+8}" stroke="#163a2e" stroke-width="4"/>`);
    case "fortress":{let o=h?`<rect x="${mx-g}" y="${s.y1-8}" width="${2*g}" height="16" fill="none" stroke="#2a2438" stroke-width="3"/>`:`<rect x="${s.x1-8}" y="${my-g}" width="16" height="${2*g}" fill="none" stroke="#2a2438" stroke-width="3"/>`;
      for(let i=1;i<6;i++){const t=-g+2*g*i/6;o+=h?`<path d="M${mx+t} ${s.y1-8}V${s.y1+8}" stroke="#7a7f93" stroke-width="3"/>`:`<path d="M${s.x1-8} ${my+t}H${s.x1+8}" stroke="#7a7f93" stroke-width="3"/>`}return o}
    case "village":return sill("#f6fbff")+(h?`<path d="M${x} ${y}L${x} ${y+2*g}" stroke="#3b2418" stroke-width="9" stroke-linecap="round"/><path d="M${x} ${y}L${x} ${y+2*g}" stroke="#a87634" stroke-width="5" stroke-linecap="round"/>`:`<path d="M${x} ${y}L${x+2*g} ${y}" stroke="#3b2418" stroke-width="9" stroke-linecap="round"/><path d="M${x} ${y}L${x+2*g} ${y}" stroke="#a87634" stroke-width="5" stroke-linecap="round"/>`);
    case "alley":return sill("#8a7356")+(h?`<path d="M${x} ${y}L${x} ${y+2*g}" stroke="#3b2418" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${y}L${x} ${y+2*g}" stroke="#7a4a2a" stroke-width="6" stroke-linecap="round"/>`:`<path d="M${x} ${y}L${x+2*g} ${y}" stroke="#3b2418" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${y}L${x+2*g} ${y}" stroke="#7a4a2a" stroke-width="6" stroke-linecap="round"/>`);
  }return null}
