const fs=require('fs');const s=fs.readFileSync('../crimes-mignons.html','utf8');
const d=s.slice(s.indexOf('const DATA=')+11);const DATA=JSON.parse(d.slice(0,d.indexOf(';\n')));
const ms=s.indexOf('const META=');const me=s.indexOf('const OBJN=',ms);const FLOORS_BASE={};let META;eval('META='+s.slice(ms+11,s.indexOf('};\n',ms)+1));
const ea=s.indexOf('Object.assign(META,');eval(s.slice(ea,s.indexOf(');\n',ea)+2));
const R="ABCDEFGHI";let k=0;
DATA.forEach((c,i)=>{if(!(c.id==="moyen"||c.id[0]==="m"))return;k++;const m=META[c.id];
 const rows=c.solution.map(([r,cc],p)=>[R[r]+(cc+1),m.people[p][0]]).sort((a,b)=>a[0].localeCompare(b[0]));
 console.log(`**Moyen ${k} · ${m.title[0]}** (${c.rooms.length}×${c.rooms.length}) — coupable : **${m.people[c.killer][0]}**`);
 console.log(rows.map(([pos,n])=>`${pos} ${n}`).join(" · "));console.log("")});
