/* ================= admin only: inspect a detective's records (suspiciously fast solves) ================= */
(function(){
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const isAdm=()=>typeof isAdminUser==="function"&&isAdminUser();
  const fmt=s=>{s=Math.round(s||0);const m=Math.floor(s/60),x=s%60;return m?`${m} min ${String(x).padStart(2,"0")}`:`${x} s`};
  const when=t=>{if(!t)return "—";try{return new Date(t).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}catch(_){return "—"}};
  const title=k=>{try{const m=META[k];return m?TX(m.title):k}catch(_){return k}};
  function modal(){let m=$("#admInsp");if(!m){m=document.createElement("div");m.id="admInsp";document.body.appendChild(m);m.addEventListener("click",e=>{if(e.target===m||e.target.closest("[data-x]"))m.remove()})}return m}
  async function inspect(pseudo){const p=ACC.profile,m=modal();m.innerHTML=`<div class="ai-box"><button class="ai-x" data-x>✕</button><h2>🔍 ${esc(pseudo)}</h2><p>Chargement…</p></div>`;
    let d=null;try{const r=await fetch("/api/admin/inspect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok,pseudo})});d=r.ok?await r.json():null}catch(_){}
    if(!d){m.querySelector("p").textContent="Impossible de charger (appareil non administrateur ou pas de connexion).";return}
    const L_=d.levels||[],n=L_.length,cmp=L_.filter(x=>x.med),fast=cmp.filter(x=>x.s<=x.med*.25),record=cmp.filter(x=>x.min!=null&&x.s<x.min),
      nohint=L_.filter(x=>!x.h).length,first=L_.filter(x=>x.a<=1).length,avg=n?L_.reduce((a,x)=>a+x.t,0)/n:0,
      ratio=cmp.length?cmp.map(x=>x.s/x.med).sort((a,b)=>a-b)[Math.floor(cmp.length/2)]:null;
    /* bursts: levels that reached the server in the same minute */
    const byMin={};L_.forEach(x=>{if(x.first){const k=Math.floor(x.first/60000);byMin[k]=(byMin[k]||0)+1}});const burst=Math.max(0,...Object.values(byMin));
    const flags=[];
    if(fast.length)flags.push(`⚡ <b>${fast.length}</b> niveau${fast.length>1?"x":""} résolu${fast.length>1?"s":""} en moins d'un quart du temps médian des autres joueurs`);
    if(record.length)flags.push(`🏆 <b>${record.length}</b> record${record.length>1?"s":""} absolu${record.length>1?"s":""} (plus rapide que tout le monde)`);
    if(ratio!=null&&ratio<.5)flags.push(`📉 en général <b>${Math.round(ratio*100)} %</b> du temps médian des autres`);
    if(n>=10&&nohint===n&&first===n)flags.push(`🎯 jamais un indice ni une erreur sur <b>${n}</b> niveaux`);
    if(burst>=5)flags.push(`📦 jusqu'à <b>${burst}</b> niveaux arrivés sur le serveur dans la même minute (peut aussi venir d'une synchronisation après un jeu hors ligne)`);
    const bots=L_.filter(x=>x.bot>=2),nTel=L_.filter(x=>x.tel).length;
    if(bots.length)flags.unshift(`🤖 <b>${bots.length}</b> partie${bots.length>1?"s":""} jouée${bots.length>1?"s":""} comme une IA qui pilote le navigateur`);
    const rows=L_.map(x=>{const r=x.med?x.s/x.med:null,cls=r!=null&&r<=.25?"bad":r!=null&&r<=.5?"warn":"";
      return `<tr class="${cls}"><td>${esc(title(x.k))}<small>${esc(x.k)}</small></td><td>${fmt(x.t)}</td><td>${x.h}</td><td>${x.a}</td><td>${x.med?fmt(x.med):"—"}<small>${x.n} j.</small></td><td>${r!=null?Math.round(r*100)+" %":"—"}</td><td>${when(x.first)}</td></tr>${x.why&&x.why.length?`<tr class="${x.bot>=2?"bad":"warn"} ai-why"><td colspan="7">🤖 ${x.why.map(esc).join(" · ")}${x.tel?` <small>(${x.tel.d==="m"?"souris":"tactile"}, ${x.tel.n} clics, ${x.tel.x} croix, temps réel ${fmt(x.tel.wall)})</small>`:""}</td></tr>`:""}`}).join("");
    const lg=(d.log||[]).filter(x=>x.why==="levels").slice(0,12).map(x=>`<li>${when(x.at)} · +${x.n} éclats (${Math.round(x.n/10)} niveau${x.n>10?"x":""})</li>`).join("");
    m.innerHTML=`<div class="ai-box"><button class="ai-x" data-x>✕</button><h2>🔍 ${esc(d.pseudo)}</h2>
      <div class="ai-sum"><span><b>${n}</b> niveaux</span><span><b>${fmt(avg)}</b> en moyenne</span><span><b>${nohint}</b> sans indice</span><span><b>${first}</b> du 1er coup</span><span><b>${d.rows.length}</b> appareil${d.rows.length>1?"s":""}</span></div>
      <div class="ai-flags">${flags.length?flags.map(f=>`<p>${f}</p>`).join(""):"<p>✅ Rien d'anormal dans les temps enregistrés.</p>"}</div>
      <p class="ai-note">Score = temps actif + 1 min par indice, comparé aux autres joueurs du même niveau. Les dates d'arrivée et la façon de jouer (🤖) ne sont enregistrées que depuis le 27 octobre : ${nTel} partie${nTel>1?"s":""} analysée${nTel>1?"s":""}.</p>
      ${lg?`<h3>Éclats gagnés en résolvant (derniers envois)</h3><ul class="ai-log">${lg}</ul>`:""}
      <div class="ai-tw"><table><thead><tr><th>Niveau</th><th>Temps</th><th>💡</th><th>🎯</th><th>Médiane</th><th>%</th><th>Arrivé</th></tr></thead><tbody>${rows}</tbody></table></div></div>`}
  /* a 🔍 button on each player of the admin codes list */
  function deco(){if(!isAdm())return;document.querySelectorAll("#admCodes .admrow").forEach(r=>{if(r.querySelector(".ai-go"))return;const n=r.querySelector("b");if(!n)return;
      const sus=+(r.dataset.sus||0);const b=document.createElement("button");b.className="ai-go"+(sus?" sus":"");b.textContent=sus?"🤖 "+sus:"🔍";b.title="Inspecter";b.onclick=e=>{e.stopPropagation();inspect(n.textContent)};r.appendChild(b)})}
  try{let q=0;new MutationObserver(()=>{if(q)return;q=1;requestAnimationFrame(()=>{q=0;try{deco()}catch(_){}})}).observe(document.body,{childList:true,subtree:true})}catch(_){}
  window.admInspect=inspect;
  const st=document.createElement("style");st.textContent=`#admInsp{position:fixed;inset:0;z-index:99;background:rgba(20,10,30,.6);display:flex;align-items:center;justify-content:center;padding:10px}
.ai-box{position:relative;width:min(760px,100%);max-height:calc(100dvh - 20px);overflow:auto;background:#fbf3df;border:2px solid #c9a25a;border-radius:16px;padding:14px;color:#3a1f3d;font:500 13px/1.4 var(--f-simple,system-ui)}
.ai-box h2{margin:0 40px 8px 0;color:#8e1f33}.ai-box h3{margin:10px 0 4px;font-size:14px}
.ai-x{position:absolute;top:6px;right:6px;width:40px;height:40px;border:0;background:none;font-size:20px;cursor:pointer}
.ai-sum{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.ai-sum span{background:#fffaf0;border:1px solid #e2cfa4;border-radius:8px;padding:4px 8px}
.ai-flags p{margin:0 0 4px;padding:6px 8px;border-radius:8px;background:rgba(184,40,62,.08)}
.ai-note{font-size:11.5px;color:#6b4a3a;margin:6px 0}
.ai-log{margin:0;padding-left:18px}
.ai-tw{overflow:auto;margin-top:8px}.ai-box table{border-collapse:collapse;width:100%;font-size:12px}
.ai-box th,.ai-box td{padding:4px 6px;border-bottom:1px solid #ead9b3;text-align:left;white-space:nowrap}
.ai-box td small{display:block;color:#8a7060;font-size:10px}
.ai-box tr.bad{background:rgba(184,40,62,.14)}.ai-box tr.warn{background:rgba(214,171,79,.18)}
.ai-go.sus{background:#b8283e;color:#fff;border-color:#8e1f33;font-weight:800}.ai-box tr.ai-why td{white-space:normal;font-size:11.5px}
.ai-go{margin-left:6px;min-width:36px;min-height:36px;border:1px solid #c9a25a;border-radius:8px;background:#fffaf0;cursor:pointer}`;document.head.appendChild(st);
})();
