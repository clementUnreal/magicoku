/* ================= What's new ================= */
var NEWS=[],NEWS_KEY="magicoku:newsSeen";
function newsSeen(){try{const v=localStorage.getItem(NEWS_KEY);return v==null?null:+v}catch(e){return 0}}
function newsMax(){return NEWS.reduce((m,n)=>Math.max(m,n.id),0)}
function newsUnseen(){const s=newsSeen()||0;return NEWS.filter(n=>n.id>s).length}
function newsTxt(n){return n[LANG]||n.en||n.fr}
function renderNewsBadges(){const u=newsUnseen();
  const hb=$("#hNews");if(hb){hb.innerHTML=`✨ ${L("Nouveautés","What's new","새로운 소식","お知らせ")}${u?`<span class="nbadge">${u}</span>`:""}`;hb.hidden=!NEWS.length}
  const gb=$("#bNews");if(gb){gb.innerHTML=`✨${u?`<span class="ndot"></span>`:""}`;gb.title=L("Nouveautés","What's new","새로운 소식","お知らせ");gb.hidden=!NEWS.length}}
function openNews(){const s=newsSeen()||0;const loc=LANG==="fr"?"fr-FR":LANG==="ko"?"ko-KR":LANG==="ja"?"ja-JP":"en-GB";
  $("#mNewsT").textContent="✨ "+L("Nouveautés","What's new","새로운 소식","お知らせ");
  $("#newsBody").innerHTML=NEWS.slice().sort((a,b)=>b.id-a.id).map(n=>{const t=newsTxt(n);let d="";try{d=new Date(n.date+"T12:00:00").toLocaleDateString(loc,{day:"numeric",month:"long"})}catch(e){}
    return `<article class="news${n.id>s?" fresh":""}"><div class="nic">${n.icon||"✨"}</div><div><h3>${t.t}${n.id>s?`<span class="ntag">${L("Nouveau","New","NEW","NEW")}</span>`:""}</h3><p>${t.d}</p><small>${d}</small></div></article>`}).join("");
  openModal("#mNews");try{localStorage.setItem(NEWS_KEY,String(newsMax()))}catch(e){}renderNewsBadges()}
function newsPeek(){const u=newsUnseen();if(!u)return;const el=document.createElement("button");el.className="npeek";
  el.innerHTML=`✨ <b>${u}</b> ${L(u>1?"nouveautés dans le jeu !":"nouveauté dans le jeu !",u>1?"new things in the game!":"new thing in the game!","가지 새로운 소식!","件のお知らせ！")}`;
  if(LANG==="ko")el.innerHTML=`✨ 새로운 소식 <b>${u}</b>개!`;
  el.onclick=()=>{el.remove();openNews()};document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add("on"));
  setTimeout(()=>{el.classList.remove("on");setTimeout(()=>el.remove(),500)},7000)}
(function(){
  const nav=$("#hMain");if(nav&&!$("#hNews")){const b=document.createElement("button");b.className="hb";b.id="hNews";b.hidden=true;nav.appendChild(b);b.onclick=e=>{e.stopPropagation();openNews()}}
  const tb=$("#bTuto");if(tb&&!$("#bNews")){const b=document.createElement("button");b.className="hbtn nbtn";b.id="bNews";b.hidden=true;tb.after(b);b.onclick=()=>openNews()}
  if(!$("#mNews")){const m=document.createElement("div");m.className="modal";m.id="mNews";m.hidden=true;m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");
    m.innerHTML=`<div class="mbox"><button class="mclose" aria-label="✕">✕</button><h2 id="mNewsT"></h2><div id="newsBody"></div></div>`;document.body.appendChild(m);
    m.addEventListener("click",e=>{if(e.target===m||e.target.closest(".mclose"))m.hidden=true})}
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);renderNewsBadges()};
  if(typeof renderHome==="function"){const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);renderNewsBadges()}}
  fetch("news.json?v="+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.json():[]).then(list=>{NEWS=Array.isArray(list)?list:[];
    if(newsSeen()==null){let returning=false;try{for(let i=0;i<localStorage.length;i++){if(/^crimes-mignons-wiz:/.test(localStorage.key(i))){returning=true;break}}}catch(e){}
      try{localStorage.setItem(NEWS_KEY,String(returning?Math.max(0,newsMax()-4):newsMax()))}catch(e){}}
    renderNewsBadges();setTimeout(newsPeek,1600)}).catch(()=>{});
})();
