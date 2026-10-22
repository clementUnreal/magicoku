
/* ================= BETA (tester only): daily puzzle, moon shards, shop, cosmetics, profile ================= */
var DAILY={on:false,i:0,date:null};
var BETA={w:null,daily:null,dailyY:null,tab:"today",shopCat:"x",prof:null};
function betaOn(){return typeof isTester==="function"&&isTester()}
function shopOn(){return true}
function dailyOn(){return true} /* daily puzzle open to everyone */ /* shop, cosmetics and profile are open to everyone; the daily puzzle stays in beta */
function parisDate(d){return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Paris",year:"numeric",month:"2-digit",day:"2-digit"}).format(d||new Date())}
function dailyIndex(date){const t=Date.UTC(+date.slice(0,4),+date.slice(5,7)-1,+date.slice(8,10)),t0=Date.UTC(2026,0,1);return ((Math.round((t-t0)/864e5))%DAILY_DATA.length+DAILY_DATA.length)%DAILY_DATA.length}
var SHOP_ITEMS={
 x:[["x:none",0,"✕",["Croix classique","Classic cross","기본 X","いつもの✕"]],["x:star",60,"★",["Étoile","Star","별","星"]],["x:moon",60,"☾",["Lune","Moon","달","月"]],["x:heart",60,"♥",["Cœur","Heart","하트","ハート"]],["x:skull",90,"☠",["Crâne","Skull","해골","ドクロ"]],["x:paw",90,"🐾",["Patte de chat","Cat paw","고양이 발","ネコの足あと"]],["x:spark",120,"✨",["Étincelle","Sparkle","반짝임","キラキラ"]]],
 m:[["m:none",0,"🎻",["Valse de l'Académie","Academy waltz","아카데미 왈츠","アカデミーのワルツ"]],["m:box",80,"🎁",["Boîte à musique","Music box","오르골","オルゴール"]],["m:lofi",120,"🌙",["Lo-fi du soir","Evening lo-fi","저녁 로파이","夜のローファイ"]],["m:fair",120,"🎠",["Fête foraine","Funfair","놀이공원","移動遊園地"]],["m:mystery",150,"🕯️",["Mystère","Mystery","미스터리","ミステリー"]]],
 c:[["c:none",0,"🙂",["Mon portrait","My portrait","내 초상화","自分の肖像"]],["c:fox",200,"@fox",["Renarde inventrice","Inventor fox","발명가 여우","発明家のキツネ"]],["c:cat",200,"@cat",["Chat sorcier","Wizard cat","마법사 고양이","魔法使いのネコ"]],["c:snowowl",200,"@snowowl",["Chouette des neiges","Snowy owl","흰올빼미","シロフクロウ"]],["c:toad",250,"@toad",["Professeur Crapaud","Professor Toad","두꺼비 교수","ガマ教授"]],["c:dragon",350,"@dragon",["Petite dragonne","Little dragon","꼬마 용","小さなドラゴン"]],["c:pochacco",999,"@pochacco",["Pochacco","Pochacco","포차코","ポチャッコ"]],["c:mandrake",150,"plant",["Mandragore","Mandrake","맨드레이크","マンドラゴラ"]],["c:snowman",150,"snowman",["Bonhomme de neige","Snowman","눈사람","雪だるま"]],["c:cauldron",120,"cauldron",["Chaudron","Cauldron","가마솥","大鍋"]],["c:gargoyle",200,"gargoyle",["Gargouille","Gargoyle","가고일","ガーゴイル"]],["c:owl",200,"cage",["Hibou","Owl","부엉이","フクロウ"]],["c:statue",250,"statue",["Statue du Ministre","Minister's statue","장관의 조각상","大臣の像"]]],
 o:[["o:none",0,"⭕",["Sans ornement","No ornament","장식 없음","飾りなし"]],["o:gold",100,"",["Cadre doré","Golden frame","황금 테두리","金の額縁"]],["o:flowers",120,"",["Couronne de fleurs","Flower crown","꽃 화관","花かんむり"]],["o:stars",150,"",["Pluie d'étoiles","Shower of stars","별의 비","星の雨"]],["o:frost",150,"",["Givre","Frost","서리","霜"]],["o:flames",200,"",["Flammes","Flames","불꽃","炎"]],["o:rainbow",300,"",["Arc-en-ciel","Rainbow","무지개","虹"]]],
 t:[["t:none",0,"",["Sans titre","No title","칭호 없음","称号なし"]],["t:apprenti",40,"",["Apprenti détective","Apprentice detective","견습 탐정","見習い探偵"]],["t:limier",80,"",["Fin limier","Sharp sleuth","날카로운 탐정","名探偵の卵"]],["t:plume",80,"",["Plume de corbeau","Raven quill","까마귀 깃펜","カラスの羽ペン"]],["t:lune",150,"",["Œil de lune","Moon eye","달의 눈","月の瞳"]],["t:maitre",250,"",["Maître des énigmes","Master of riddles","수수께끼의 달인","謎解きの達人"]],["t:legende",500,"",["Légende de Brumelune","Legend of Brumelune","브뤼므륀의 전설","ブリュムリュヌの伝説"]]],
 n:[["n:rename",100,"✒️",["Plume de renommage","Renaming quill","이름 바꾸기 깃펜","名前変更の羽ペン"]]]};
const SHOP_CATS=[["x","✕",["Croix","Crosses","X 표시","✕"]],["m","🎵",["Musique","Music","음악","音楽"]],["c","🧙",["Personnages","Characters","캐릭터","キャラクター"]],["o","💫",["Ornements","Ornaments","장식","飾り"]],["t","🏷️",["Titres","Titles","칭호","称号"]],["n","✒️",["Noms","Names","이름","名前"]]];
function shopItem(id){for(const k in SHOP_ITEMS)for(const it of SHOP_ITEMS[k])if(it[0]===id)return it;return null}
function titleBan(id,cls){const k=id.slice(2),src=typeof TT_IMG!=="undefined"&&TT_IMG[k];const it=shopItem(id);if(!it)return "";return src?`<img class="cos-ban ${cls||""}" src="${src}" alt="${TX(it[3])}" title="${TX(it[3])}">`:`<small class="cos-title">${TX(it[3])}</small>`}
function cosTitle(cos){if(!shopOn()||!cos||!cos.title)return "";return titleBan(cos.title)}
function charaSrc(it){return it[2].startsWith("@")?(typeof CH_IMG!=="undefined"?CH_IMG[it[2].slice(1)]:""):SPR[it[2]]}
function cosAv(avatar,cos,cls){const it=shopOn()&&cos&&cos.chara&&shopItem(cos.chara);const img=it?`<img class="${it[2].startsWith("@")?"cos-por":"cos-chara"}" src="${charaSrc(it)}" alt="">`:`<img src="${POR[avatar]||POR[AVS[0]]}" alt="">`;
  return `<span class="cav ${cls||""} ${shopOn()&&cos&&cos.orn?"orn-"+cos.orn.slice(2):""}">${img}</span>`}
function myCos(){const w=BETA.w;return w?{title:w.eq.t||null,orn:w.eq.o||null,chara:w.eq.c||null}:null}
const SHARD="🌙",shards=n=>`<b class="shards">${n} ${SHARD}</b>`;
(function(){
  const esc=s=>String(s==null?"":s).replace(/[<>&"]/g,"");
  const acc=()=>ACC.profile&&ACC.profile.pseudo&&ACC.profile.pid&&ACC.profile.ptok?ACC.profile:null;
  async function api(path,body){const r=await fetch(path,body?{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}:{cache:"no-store"});let d=null;try{d=await r.json()}catch(_){}return {ok:r.ok,status:r.status,d}}
  /* ---------- wallet + cosmetics ---------- */
  async function loadWallet(){const p=acc();if(!p||!shopOn())return;const r=await api("/api/shop",{id:p.pid,token:p.ptok,action:"get"}).catch(()=>null);if(r&&r.ok){BETA.lock=false;BETA.w=r.d;applyCos();try{localStorage.setItem("magicoku:wallet",JSON.stringify(r.d))}catch(_){}}else if(r&&r.status===423){BETA.lock=true;BETA.w=null;try{localStorage.removeItem("magicoku:wallet")}catch(_){}applyCos()}}
  try{BETA.w=JSON.parse(localStorage.getItem("magicoku:wallet")||"null")}catch(_){}
  function applyCos(){const on=shopOn(),w=BETA.w,eq=on&&w?w.eq:{};
    document.body.className=document.body.className.replace(/\bxs-\S+/g,"").trim();if(eq.x)document.body.classList.add("xs-"+eq.x.slice(2));
    for(const k in RENAME)delete RENAME[k];if(on&&w&&w.names)Object.assign(RENAME,w.names);
    MUS.style=eq.m?eq.m.slice(2):"waltz"}
  /* ---------- music styles ---------- */
  const NOTE_=n=>440*Math.pow(2,(n-69)/12);
  const STY={
    box:{beat:.5,ch:[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],mel:[81,76,72,76,79,77,74,72,76,72,69,72,74,71,67,71],pad:0,oct:12},
    lofi:{beat:.6,ch:[[50,53,57,60],[55,59,62,65],[48,52,55,59],[45,48,52,55]],mel:[69,0,67,64,0,62,64,0,65,0,64,60,0,62,0,0],pad:.03,oct:0,bass:true},
    fair:{beat:.28,ch:[[48,52,55],[53,57,60],[55,59,62],[48,52,55]],mel:[72,76,79,76,72,76,79,84,77,81,84,81,79,74,71,74],pad:.018,oct:0,bass:true,oom:true},
    mystery:{beat:.62,ch:[[45,48,52],[44,48,51],[41,45,48],[40,44,47]],mel:[69,0,72,71,0,68,0,0,65,0,69,68,0,64,0,0],pad:.032,oct:-12}};
  const _mt=musicTick;musicTick=function(){const st=STY[MUS.style];if(!st)return _mt.apply(this,arguments);
    const c=ac();if(!c||!MUS.on||$("#home").hidden||!SND.on)return;
    while(MUS.next<c.currentTime+.6){const i=MUS.step,dt=Math.max(0,MUS.next-c.currentTime),bar=Math.floor(i/4)%4,ch=st.ch[bar];
      if(i%4===0&&st.pad){ch.forEach(n=>pad(NOTE_(n),dt,st.beat*4.2,st.pad))}
      if(st.bass&&i%2===0)bloop(NOTE_(ch[0]-12+(st.oom&&i%4===2?7:0)),dt,.06,1,.22);
      if(st.oom&&i%2===1)bell(NOTE_(ch[1]+12),dt,.25,.025);
      const mn=st.mel[i%st.mel.length];if(mn)bell(NOTE_(mn+st.oct),dt,st===STY.box?1.4:.9,i%4===0?.06:.045);
      MUS.step++;MUS.next+=st.beat}};
  if(MUS.timer){stopMusic();startMusic()}
  /* ---------- daily mode ---------- */
  const _prep=prep;prep=function(){if(DAILY.on){const k=ci,keep=DATA[k];DATA[k]=DAILY_DATA[DAILY.i];try{_prep()}finally{DATA[k]=keep}}else _prep()};
  const longDate=d=>{try{return new Date(d+"T12:00:00").toLocaleDateString(LANG==="fr"?"fr-FR":LANG==="ko"?"ko-KR":LANG==="ja"?"ja-JP":"en-GB",{day:"numeric",month:"long"})}catch(_){return d}};
  const _rs=renderStatic;renderStatic=function(){_rs.apply(this,arguments);document.body.classList.toggle("daily",DAILY.on);
    if(DAILY.on){const t=$("#caseTitle");if(t)t.textContent=`🗓️ ${L("Énigme du jour","Daily puzzle","오늘의 수수께끼","今日の謎")} · ${longDate(DAILY.date)} · ${TX(M.title)}`}};
  window.startDaily=function(){{let done=null;try{done=localStorage.getItem("magicoku:daily:"+parisDate())}catch(_){}if(done){try{play("forbid")}catch(_){}toast(L("Tu as déjà joué ton essai du jour.","You’ve already played today’s try.","오늘의 도전은 이미 끝났어요.","今日の挑戦はもう終わりです。"));return}}DAILY.on=true;DAILY.date=parisDate();DAILY.i=dailyIndex(DAILY.date);$("#home").hidden=true;openCase(ci);
    if(S.date!==DAILY.date){S=fresh();S.hlog=[];S.date=DAILY.date;hist=[];save()}render();renderStatic();try{renderTimer()}catch(_){}};
  new MutationObserver(()=>{if(DAILY.on&&!$("#home").hidden){DAILY.on=false;const c=$("#dailyCard");if(c)c.hidden=true;document.body.classList.remove("daily");try{openCase(ci)}catch(e){}}}).observe($("#home"),{attributes:true,attributeFilter:["hidden"]});
  function dcard(){let c=$("#dailyCard");if(!c){c=document.createElement("div");c.id="dailyCard";c.className="modal";c.hidden=true;document.body.appendChild(c);
      c.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const a=b.dataset.a;c.hidden=true;
        if(a==="board"){$("#home").hidden=false;show("pDaily")}else if(a==="shop"){$("#home").hidden=false;show("pShop")}})}return c}
  async function dailyWin(){const t=Math.round(S.time||0),e=Math.max(0,(S.attempts||1)-1),h=S.hints||0,date=DAILY.date,K=C.killer,c=dcard(),p=acc();
    const prev=(()=>{try{return JSON.parse(localStorage.getItem("magicoku:daily:"+date)||"null")}catch(_){return null}})();
    c.innerHTML=`<div class="mbox dwin"><div class="dw-ic">🗓️</div><h2>${L("Énigme du jour résolue !","Daily puzzle solved!","오늘의 수수께끼 해결!","今日の謎を解いた！")}</h2>
      <div class="dw-who">${ava(K,{angry:true})}<span>${L(`C'est ${pname(K)} !`,`It's ${pname(K)}!`,`범인은 ${pname(K)}!`,`犯人は${pname(K)}だ！`)}</span></div>
      <div class="rv-stats"><div><b>${fmtT(t)}</b><small>⏱ ${L("temps","time","시간","時間")}</small></div><div><b>${e}</b><small>❌ ${L(e>1?"erreurs":"erreur",e>1?"errors":"error","오답","ミス")}</small></div><div><b>${h}</b><small>💡 ${L(h>1?"indices":"indice",h>1?"hints":"hint","힌트","ヒント")}</small></div></div>
      <p class="dw-score">${L("Score","Score","점수","スコア")} : <b>${fmtT(t+30*e+60*h)}</b> <small>(${L("temps + 30 s par erreur + 1 min par indice","time + 30 s per error + 1 min per hint","시간 + 오답당 30초 + 힌트당 1분","時間＋ミス1回30秒＋ヒント1回1分")})</small></p>
      <div id="dwRes" class="dw-res">${p?L("Envoi du résultat…","Sending your result…","결과를 보내는 중…","結果を送信中…"):L("Crée ton compte pour entrer dans le classement du jour et gagner des éclats de lune !","Create an account to join the daily ranking and earn moon shards!","계정을 만들면 오늘의 순위에 들어가고 달 조각을 받을 수 있어요!","アカウントを作ると今日のランキングに参加して月のかけらがもらえます！")}</div>
      <div class="acts"><button class="pill" data-a="shop">🛍️ ${L("Boutique","Shop","상점","ショップ")}</button><button class="pill red" data-a="board">🏆 ${L("Classement du jour","Today's ranking","오늘의 순위","今日のランキング")}</button></div></div>`;
    c.hidden=false;try{play("win")}catch(_){}
    if(!p)return;
    const r=await api("/api/daily",{id:p.pid,token:p.ptok,date,t,e,h}).catch(()=>null),el=$("#dwRes");if(!el)return;
    if(!r||!r.ok){el.textContent=r&&r.status===409?L("Une nouvelle énigme est déjà sortie : ce résultat ne compte plus.","A new puzzle is already out: this result no longer counts.","새 수수께끼가 이미 나왔어요. 이 결과는 반영되지 않아요.","新しい謎がもう出ています。この結果はカウントされません。"):L("Résultat non envoyé (pas de connexion).","Result not sent (no connection).","결과를 보내지 못했어요(연결 없음).","結果を送れませんでした（接続なし）。");return}
    if(r.d.already){el.innerHTML=L("Tu avais déjà résolu l'énigme d'aujourd'hui : seule ta première résolution compte.","You had already solved today's puzzle: only your first solve counts.","오늘의 수수께끼는 이미 풀었어요. 첫 번째 결과만 반영돼요.","今日の謎はもう解いています。最初の結果だけがカウントされます。");return}
    try{localStorage.setItem("magicoku:daily:"+date,JSON.stringify({t,e,h,rank:r.d.rank}))}catch(_){}
    el.innerHTML=`<div class="dw-rank">${L(`Tu es <b>${r.d.rank===1?"1er":r.d.rank+"ᵉ"}</b> sur ${r.d.of} pour l'instant`,`You're <b>#${r.d.rank}</b> of ${r.d.of} so far`,`현재 ${r.d.of}명 중 <b>${r.d.rank}위</b>`,`現在${r.d.of}人中<b>${r.d.rank}位</b>`)}</div><div class="dw-gain">+${shards(r.d.earned)}</div><small>${L(`Total : ${r.d.coins} ${SHARD}`,`Total: ${r.d.coins} ${SHARD}`,`합계: ${r.d.coins} ${SHARD}`,`合計：${r.d.coins} ${SHARD}`)}</small>`;
    loadWallet()}
  const _sr=showReveal;showReveal=function(){if(DAILY.on){dailyWin();return}
    const special=(typeof RUSH!=="undefined"&&RUSH.on)||(typeof NIGHT!=="undefined"&&NIGHT.on)||(typeof LIAR!=="undefined"&&LIAR.on);
    const pr=ACC.profile&&ACC.profile.progress&&ACC.profile.progress[C.id],first=!special&&!!acc()&&!(pr&&pr.solved);
    const out=_sr.apply(this,arguments);
    if(first&&shopOn()){const box=document.querySelector("#reveal .box");const st=box&&box.querySelector(".rv-stars");
      if(st)st.insertAdjacentHTML("afterend",`<div class="rv-shards">+10 ${SHARD} <small>${L("éclats de lune gagnés","moon shards earned","달 조각 획득","月のかけら獲得")}</small></div>`);
      setTimeout(()=>loadWallet().then(()=>{try{renderHome()}catch(_){}}),2500)}
    return out};
  /* ---------- panels ---------- */
  const home=document.querySelector(".home-in");
  function panel(id){let p=$("#"+id);if(!p){p=document.createElement("div");p.className="home-panel beta-panel";p.id=id;p.hidden=true;home.appendChild(p)}return p}
  const MY=["pDaily","pShop","pProfile"];
  const _show=show;show=function(pn){MY.forEach(id=>{const e=$("#"+id);if(e)e.hidden=true});document.querySelector(".home-in").classList.toggle("shopmode",pn==="pShop");document.querySelector(".home").classList.toggle("shopmode",pn==="pShop");
    if(MY.includes(pn)){_show("__none__");["hMain","pLevels","pOptions","pAccount","pRank","pRush","pNight","pLiar"].forEach(id=>{const e=$("#"+id);if(e)e.hidden=true});
      const p=panel(pn);p.hidden=false;if(pn==="pDaily")renderDaily(true);else if(pn==="pShop")renderShop();else renderProfile();
      const bar=$("#h2Bar");if(bar)bar.querySelectorAll("button").forEach(b=>b.classList.toggle("on",(pn==="pProfile"&&b.id==="hAccount")||(pn==="pShop"&&b.id==="h2Shop")));
      try{document.querySelector(".home").scrollTo(0,0)}catch(_){}}else _show(pn)};
  const back=()=>`<button class="hb small back top" data-bk>${L("← Retour","← Back","← 뒤로","← 戻る")}</button>`;
  const beta=()=>`<span class="beta-tag">BÊTA · ${L("visible par toi seul","only you can see this","나만 볼 수 있어요","自分だけに表示")}</span>`;
  function untilNext(){const now=new Date(),p=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Paris",hour:"2-digit",minute:"2-digit",hour12:false}).format(now).split(":").map(Number);const m=24*60-(p[0]*60+p[1]);return `${Math.floor(m/60)} h ${String(m%60).padStart(2,"0")}`}
  function rowsHTML(rows){if(!rows)return `<p class="rk-msg">${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</p>`;
    if(!rows.length)return `<p class="rk-msg">${L("Personne n'a encore résolu cette énigme. Sois le premier !","Nobody has solved this puzzle yet. Be the first!","아직 아무도 풀지 못했어요. 첫 번째가 되어 보세요!","まだ誰も解いていません。一番乗りを目指そう！")}</p>`;
    const me=(ACC.profile&&ACC.profile.pseudo||"").toLowerCase();
    return `<ol class="rk-list">${rows.map((r,k)=>`<li class="rk-r${r.pseudo.toLowerCase()===me?" me":""}" data-prof="${esc(r.pseudo)}"><span class="rk-n">${["🥇","🥈","🥉"][k]||k+1}</span>${cosAv(r.avatar,r.cos)}<div class="rk-b"><div class="rk-t"><b>${esc(r.pseudo)}</b><strong>${fmtT(r.s)}</strong></div>${cosTitle(r.cos)}<small>⏱ ${fmtT(r.t)} · ❌ ${r.e} · 💡 ${r.h}</small></div></li>`).join("")}</ol>`}
  async function renderDaily(fetch_){const p=panel("pDaily"),date=parisDate(),i=dailyIndex(date),lv=DAILY_DATA[i],m=META[lv.id];
    let mine=null;try{mine=JSON.parse(localStorage.getItem("magicoku:daily:"+date)||"null")}catch(_){}
    if(!mine&&BETA.daily&&BETA.daily.date===date&&ACC.profile&&ACC.profile.pseudo){const r=BETA.daily.rows.find(x=>x.pseudo.toLowerCase()===ACC.profile.pseudo.toLowerCase());if(r)mine={t:r.t,e:r.e,h:r.h}}
    let started=false;try{const st=JSON.parse(localStorage.getItem("crimes-mignons-wiz:"+lv.id)||"null");started=!!(st&&st.date===date&&!st.solved&&(st.time||Object.keys(st.place||{}).length))}catch(_){}
    const kinds=new Set(Object.values(lv.clues).flat().map(c=>c[0]));if(lv.objs.some(o=>o[0]==="poison"))kinds.add("poison");if(lv.nox)kinds.add("nox");
    const R={dist:"🐾",cnt:"📒",mirc:"🪞",mird:"🪞",mira:"🪞",mid:"🪞",poison:"☠️",nox:"🚫"};const icons=[...new Set([...kinds].map(k=>R[k]).filter(Boolean))].join(" ");
    const y=parisDate(new Date(Date.now()-864e5)),rows=BETA.tab==="today"?(BETA.daily&&BETA.daily.date===date?BETA.daily.rows:null):(BETA.dailyY?BETA.dailyY.rows:null);
    p.innerHTML=back()+`<h2>🗓️ ${L("Énigme du jour","Daily puzzle","오늘의 수수께끼","今日の謎")}</h2>
      <div class="dl-hero"><div><b>${esc(TX(m.title))}</b><small>${longDate(date)} · ${lv.rooms.length}×${lv.rooms.length}${icons?` · ${icons}`:""}</small>
      <small>${L(`Nouvelle énigme dans ${untilNext()}`,`New puzzle in ${untilNext()}`,`새 수수께끼까지 ${untilNext()}`,`次の謎まで${untilNext()}`)}</small></div></div>
      ${mine?`<div class="rk-me"><div class="rk-mep"><small>${L("Ton score","Your score","내 점수","スコア")}</small><b>${fmtT(mine.t+30*mine.e+60*mine.h)}</b></div><div class="rk-mei"><b>${L("Énigme résolue !","Puzzle solved!","해결 완료!","解決！")}</b><small>⏱ ${fmtT(mine.t)} · ❌ ${mine.e} · 💡 ${mine.h}</small></div></div>`:""}
      ${mine?`<div class="dl-done">✅ ${L("Tu as déjà joué ton essai du jour. Reviens demain pour une nouvelle énigme !","You’ve already played today’s try. Come back tomorrow for a new puzzle!","오늘의 도전은 이미 끝났어요. 내일 새 수수께끼로 다시 만나요!","今日の挑戦はもう終わり。明日の新しい謎でまた会おう！")}</div>`:`<button class="h2-go dl-go" id="dlPlay"><span>${started?L("Reprendre","Resume","이어서 하기","続ける"):L("Jouer","Play","플레이","プレイ")}</span><span class="h2-chev">›</span></button>`}
      <p class="dl-rules">${L("Une seule énigme par jour, la même pour tout le monde, et <b>un seul essai</b> : impossible de rejouer. Score = temps + 30 s par erreur + 1 min par indice.","One puzzle a day, the same for everyone, and <b>a single try</b>: no replays. Score = time + 30 s per error + 1 min per hint.","하루에 한 문제, 모두에게 같은 문제이고 <b>도전은 한 번뿐</b>이에요. 다시 할 수 없어요. 점수 = 시간 + 오답당 30초 + 힌트당 1분.","1日1問、全員同じ問題で、<b>挑戦は1回だけ</b>。やり直しはできません。スコア＝時間＋ミス1回30秒＋ヒント1回1分。")}<br>
      ${SHARD} ${L("+20 en la résolvant, +10 sans erreur, +10 sans indice. Le meilleur score de la journée gagne <b>+100</b>, versés le lendemain.","+20 for solving, +10 with no errors, +10 with no hints. The best score of the day wins <b>+100</b>, paid the next day.","해결 +20, 오답 없이 +10, 힌트 없이 +10. 그날 최고 점수는 <b>+100</b>(다음 날 지급).","解くと+20、ミスなし+10、ヒントなし+10。その日の最高スコアには<b>+100</b>（翌日に付与）。")}</p>
      <div class="rk-tabs"><button data-dt="today" class="${BETA.tab==="today"?"on":""}">${L("Aujourd'hui","Today","오늘","今日")}</button><button data-dt="y" class="${BETA.tab!=="today"?"on":""}">${L("Hier","Yesterday","어제","昨日")}</button></div>
      <div id="dlRows">${rowsHTML(rows)}</div>`;
    if(fetch_){api("/api/daily?date="+date).then(r=>{if(r.ok){BETA.daily=r.d;if(!panel("pDaily").hidden)renderDaily(false)}}).catch(()=>{});
      api("/api/daily?date="+y).then(r=>{if(r.ok){BETA.dailyY=r.d;if(BETA.tab!=="today"&&!panel("pDaily").hidden)$("#dlRows").innerHTML=rowsHTML(r.d.rows)}}).catch(()=>{})}}
  /* ---------- shop ---------- */
  const SPARK=`data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M44 8 C48 34 52 40 78 46 C52 52 48 58 44 86 C40 58 36 52 10 46 C36 40 40 34 44 8Z" fill="#f2c443" stroke="#3a1f3d" stroke-width="5" stroke-linejoin="round"/><path d="M44 22 C46 38 48 42 62 46 C48 48 46 52 44 62Z" fill="#ffe8a0"/><path d="M78 10 C79 20 81 22 90 23 C81 24 79 26 78 36 C77 26 75 24 66 23 C75 22 77 20 78 10Z" fill="#f2c443" stroke="#3a1f3d" stroke-width="4" stroke-linejoin="round"/></svg>')}`;
  const MKI=k=>k==="spark"?SPARK:(typeof MK_IMG!=="undefined"&&MK_IMG[k])||"";
  (function(){const st=document.createElement("style");st.textContent=["star","moon","heart","skull","paw","spark"].map(k=>`body.xs-${k} #marks .xm::after{content:"";display:block;width:118%;height:118%;background:url(${MKI(k)}) center/contain no-repeat}`).join("\n");document.head.appendChild(st)})();
  const SUB={x:["Ta signature sur le plateau","Your signature on the board","판 위의 나만의 표시","盤上のきみのしるし"],m:["L'ambiance de l'Académie","The Academy's atmosphere","아카데미의 분위기","アカデミーの雰囲気"],c:["Ton visage dans le classement","Your face on the leaderboard","순위표 속 나의 얼굴","ランキングでのきみの顔"],
    o:["Pour briller autour de ton portrait","To shine around your portrait","초상화를 빛내는 장식","肖像のまわりを輝かせよう"],t:["Ta signature magique","Your magical signature","나만의 마법 서명","きみの魔法のサイン"],n:["Rebaptise les suspects","Rename the suspects","용의자 이름 바꾸기","容疑者に名前をつけ直そう"]};
  function preview(cat,it){const me=ACC.profile||{};
    if(cat==="x")return `<span class="sp-tile">${it[0]==="x:none"?`<span class="sp-xsvg">${XSVG}</span>`:`<img src="${MKI(it[0].slice(2))}" alt="">`}</span>`;
    if(cat==="c")return `<span class="sp-tile">${it[0]==="c:none"?cosAv(me.avatar,null,"sp-av"):`<img class="sp-big" src="${charaSrc(it)}" alt="">`}</span>`;
    if(cat==="o")return `<span class="sp-tile"><span class="cav sp-av ${it[0]==="o:none"?"":"orn-"+it[0].slice(2)}"><img src="${POR[me.avatar]||POR[AVS[0]]}" alt=""></span></span>`;
    if(cat==="t")return `<span class="sp-tile"><span class="sp-t">${it[0]==="t:none"?"—":TX(it[3])}</span></span>`;
    if(cat==="m"){const k=it[0]==="m:none"?"waltz":it[0].slice(2);return `<span class="sp-tile">${typeof MU_IMG!=="undefined"&&MU_IMG[k]?`<img src="${MU_IMG[k]}" alt="">`:`<span class="sp-e">${it[2]}</span>`}<button class="mu-play${PV.k===it[0]?" on":""}" data-play="${it[0]}" aria-label="${L("Écouter","Listen","듣기","聴く")}">${PV.k===it[0]?"■":"▶"}</button></span>`}
    return `<span class="sp-tile"><span class="sp-e">${it[2]}</span></span>`}
  const CAT_IC={x:`<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>`,m:"🎵",c:"🧙",o:"💫",t:"🏷️",n:"✒️"};
  const TDESC={"t:apprenti":["Les premiers indices.","The first clues.","첫 번째 단서들.","はじめての手がかり。"],"t:limier":["Rien ne t'échappe.","Nothing escapes you.","아무것도 놓치지 않아요.","何ひとつ見逃さない。"],
    "t:plume":["L'instinct et la discrétion.","Instinct and discretion.","직감과 신중함.","直感と慎重さ。"],"t:lune":["Voir au-delà des apparences.","Seeing beyond appearances.","겉모습 너머를 보는 눈.","見た目の奥を見抜く。"],
    "t:maitre":["Chaque détail compte.","Every detail counts.","모든 디테일이 중요해요.","細部こそが大切。"],"t:legende":["Un nom qui traverse les âges.","A name that spans the ages.","시대를 넘어 전해지는 이름.","時代を超えて語り継がれる名。"]};
  function titlesTab(w){const me=ACC.profile||{},owned=new Set(w?w.owned:[]),eq=w?w.eq:{},cur=eq.t;
    const prev=`<div class="tt-prev"><small>${L("Aperçu du profil","Profile preview","프로필 미리보기","プロフィールのプレビュー")}</small><div class="tt-pin">${cosAv(me.avatar,myCos(),"tt-av")}<div class="tt-pid"><b>${String(me.pseudo||"").replace(/[<>&"]/g,"")}</b>${cur?titleBan(cur,"big"):`<i>${L("Aucun titre","No title","칭호 없음","称号なし")}</i>`}</div></div></div>`;
    const cards=SHOP_ITEMS.t.filter(it=>it[0]!=="t:none").map(it=>{const own=owned.has(it[0]),on=cur===it[0],poor=w&&w.coins<it[1];
      const btn=on?`<span class="sh-btn on">✓ ${L("Équipé","Equipped","장착 중","装備中")}</span>`:own?`<button class="sh-btn eq" data-eq="${it[0]}">${L("Équiper","Equip","장착","装備")}</button>`:`<button class="sh-btn buy${poor?" poor":""}" data-buy="${it[0]}">🌙 ${it[1]}</button>`;
      return `<div class="sh-it tt-it${on?" on":""}">${titleBan(it[0],"card")}${LANG!=="fr"?`<b class="tt-name">${TX(it[3])}</b>`:""}<p class="tt-d">${TX(TDESC[it[0]]||["","","",""])}</p>${btn}</div>`}).join("");
    return prev+`<div class="sh-grid tt-grid">${cards}</div>`+(cur?`<button class="tt-rm" data-eq="t:none">🗑️ ${L("Retirer mon titre","Remove my title","칭호 해제","称号を外す")}</button>`:"")}
  var PV={k:null,t:null,prev:null,on:null};
  function stopPreview(){if(!PV.k)return;clearTimeout(PV.t);stopMusic();MUS.style=PV.prev;MUS.on=PV.on;PV.k=null;if(MUS.on)startMusic()}
  function playPreview(id){const was=PV.k;stopPreview();if(was===id){renderShop();return}
    if(!SND.on){toast(L("Active le son pour écouter un extrait.","Turn the sound on to listen to a sample.","샘플을 들으려면 소리를 켜세요.","試聴するにはサウンドをオンにしてね。"));return}
    PV.prev=MUS.style;PV.on=MUS.on;PV.k=id;stopMusic();MUS.style=id==="m:none"?"waltz":id.slice(2);MUS.on=true;MUS.step=0;startMusic();
    PV.t=setTimeout(()=>{stopPreview();if(!panel("pShop").hidden)renderShop()},9000);renderShop()}
  function renderShop(){const p=panel("pShop"),w=BETA.w,cat=BETA.shopCat,me=acc();p.classList.add("shop2");
    const head=`<div class="sh-head"><button class="sh-back" data-bk aria-label="${L("Retour","Back","뒤로","戻る")}">←</button><div class="sh-title"><h2><i>✦</i>${L("Boutique","Shop","상점","ショップ")}<i>✦</i></h2><small>${L("Personnalise ton enquête","Customise your investigation","나만의 추리 꾸미기","捜査をカスタマイズ")}</small></div><div class="sh-coins">🌙 <b>${w?w.coins:"…"}</b></div></div>`;
    if(!me){p.innerHTML=head+`<p class="rk-msg">${L("Crée ton compte pour utiliser la boutique.","Create an account to use the shop.","상점을 이용하려면 계정을 만드세요.","ショップを使うにはアカウントを作ってね。")}</p>`;return}
    if(BETA.lock){p.innerHTML=head+`<p class="rk-msg">${L("Tes éclats et tes objets sont liés à un autre appareil. Demande ton code de récupération à l'administrateur du jeu, puis entre-le dans Profil › « Récupérer ma progression ».","Your shards and items are tied to another device. Ask the game's admin for your recovery code, then enter it in Profile › “Recover my progress”.","달 조각과 아이템이 다른 기기에 연결되어 있어요. 관리자에게 복구 코드를 받아 프로필 › ‘진행 상황 되찾기’에 입력하세요.","かけらとアイテムは別の端末にひもづいています。管理者から復元コードをもらい、プロフィール › 「進行状況を取り戻す」に入力してね。")}</p>`;return}
    const owned=new Set(w?w.owned:[]),eq=w?w.eq:{};
    p.innerHTML=head+`<div class="sh-tabs">${SHOP_CATS.map(([k,ic,n])=>`<button class="sh-tab${k===cat?" on":""}" data-cat="${k}"><span class="sh-ti">${CAT_IC[k]}</span>${k==="x"?L("Marqueurs","Markers","표시","マーカー"):TX(n)}</button>`).join("")}</div>
      <div class="sh-sub"><i></i><span>✦ ${TX(SUB[cat])} ✦</span><i></i></div>
      ${cat==="t"?titlesTab(w):""}<div class="sh-grid"${cat==="t"?" hidden":""}>${SHOP_ITEMS[cat].map(it=>{const isNone=it[0].endsWith(":none"),own=isNone||owned.has(it[0]),on=isNone?!eq[cat]:eq[cat]===it[0],poor=w&&w.coins<it[1];
        const btn=cat==="n"?(own?`<button class="sh-btn eq" data-ren>${L("Renommer","Rename","이름 바꾸기","名前を変える")}</button>`:`<button class="sh-btn buy${poor?" poor":""}" data-buy="${it[0]}">🔒 ${it[1]} 🌙</button>`)
          :on?`<span class="sh-btn on">✓ ${L("Équipé","Equipped","장착 중","装備中")}</span>`:own?`<button class="sh-btn eq" data-eq="${it[0]}">${L("Équiper","Equip","장착","装備")}</button>`:`<button class="sh-btn buy${poor?" poor":""}" data-buy="${it[0]}">🔒 ${it[1]} 🌙</button>`;
        return `<div class="sh-it${on&&cat!=="n"?" on":""}"><div class="sh-pv">${preview(cat,it)}</div><b>${TX(it[3])}</b>${btn}</div>`}).join("")}</div>
      ${cat==="n"&&owned.has("n:rename")?renEditor():""}<p class="sh-msg" id="shMsg"></p>
      <div class="sh-foot">✦ ${L("Gagne des éclats en résolvant des enquêtes.","Earn shards by solving cases.","사건을 해결하면 달 조각을 받아요.","事件を解くとかけらがもらえます。")} ✦ ${String(me.pseudo).toLowerCase()==="clemonchichi"?`<button class="sh-grant" id="shGrant">+500 (test)</button>`:""}</div>`}
  function baseNames(){const s=new Set();Object.values(META).forEach(m=>(m.people||[]).forEach(pp=>s.add(pp[0])));return [...s].filter(Boolean).sort()}
  function renEditor(){const w=BETA.w||{names:{}};return `<div class="sh-ren"><p>${L("Donne de nouveaux noms aux personnages (laisse vide pour garder l'original). Ces noms ne changent que pour toi.","Give the characters new names (leave empty to keep the original). These names only change for you.","캐릭터에게 새 이름을 지어 주세요(비워 두면 원래 이름). 나에게만 바뀌어요.","キャラクターに新しい名前をつけよう（空欄なら元の名前）。自分にだけ反映されます。")}</p>
    ${baseNames().map(n=>`<label><span>${esc(n)}</span><input data-rn="${esc(n)}" maxlength="16" value="${esc((w.names||{})[n]||"")}" placeholder="${esc(n)}"></label>`).join("")}<button class="pill red" id="shRenSave">${L("Enregistrer les noms","Save the names","이름 저장","名前を保存")}</button></div>`}
  async function shopAct(body){const p=acc();if(!p)return;const r=await api("/api/shop",Object.assign({id:p.pid,token:p.ptok},body)).catch(()=>null);const msg=$("#shMsg");
    if(r&&r.ok){BETA.w=r.d;applyCos();try{localStorage.setItem("magicoku:wallet",JSON.stringify(r.d))}catch(_){}try{play("win")}catch(_){}renderShop();renderHome();return true}
    if(msg)msg.textContent=r&&r.status===402?L("Pas assez d'éclats de lune !","Not enough moon shards!","달 조각이 부족해요!","月のかけらが足りない！"):r&&r.status===423?L("Ces éclats appartiennent à un autre appareil. Demande ton code de récupération à l'administrateur pour les retrouver ici.","These shards belong to another device. Ask the admin for your recovery code to get them here.","이 달 조각은 다른 기기에 속해 있어요. 관리자에게 복구 코드를 받아 이곳에서 되찾으세요.","このかけらは別の端末のものです。管理者に復元コードをもらって、ここで取り戻してね。"):L("Impossible pour l'instant (connexion ?).","Not possible right now (connection?).","지금은 할 수 없어요(연결?).","今はできません（接続？）。");try{play("forbid")}catch(_){}return false}
  /* ---------- profile ---------- */
  function card(d,mine){const cos=d.cos||{};
    return `<div class="pf-card"><div class="pf-top">${cosAv(d.avatar,cos,"pf-av")}<div class="pf-id"><b>${esc(d.pseudo)}</b>${cosTitle(cos)||(mine?`<small class="cos-title none">${L("Aucun titre","No title","칭호 없음","称号なし")}</small>`:"")}</div></div>
      <div class="pf-stats"><div><b>${d.solved||0}</b><small>${L("enquêtes résolues","cases solved","해결한 사건","解決した事件")}</small></div><div><b>${fmt(d.time||0)}</b><small>${L("temps total","total time","총 시간","合計時間")}</small></div><div><b>${d.hints||0}</b><small>💡 ${L("indices","hints","힌트","ヒント")}</small></div>
      <div><b>${d.played||0}</b><small>🗓️ ${L("énigmes du jour","daily puzzles","오늘의 수수께끼","今日の謎")}</small></div><div><b>${d.wins||0}</b><small>🥇 ${L("victoires du jour","daily wins","일일 1위","デイリー1位")}</small></div>${mine?`<div><b>${BETA.w?BETA.w.coins:"…"}</b><small>${SHARD} ${L("éclats de lune","moon shards","달 조각","月のかけら")}</small></div>`:""}</div></div>`}
  function renderProfile(){const p=panel("pProfile"),me=ACC.profile;
    if(!me||!me.pseudo){show("pAccount");return}
    const solved=Object.values(me.progress||{}).filter(x=>x.solved);
    const d={pseudo:me.pseudo,avatar:me.avatar,solved:solved.length,time:solved.reduce((a,x)=>a+(x.time||0),0),hints:solved.reduce((a,x)=>a+(x.hints||0),0),played:BETA.w?BETA.w.played:0,wins:BETA.w?BETA.w.wins:0,cos:myCos()};
    p.innerHTML=back()+`<h2>👤 ${L("Mon profil","My profile","내 프로필","プロフィール")}</h2>${card(d,true)}
      <div class="pf-acts">${dailyOn()?`<button class="pill red" id="pfDaily">🗓️ ${L("Énigme du jour","Daily puzzle","오늘의 수수께끼","今日の謎")}</button>`:""}<button class="pill" id="pfEdit">✏️ ${L("Modifier mon compte","Edit my account","계정 수정","アカウント編集")}</button></div>`}
  async function openProfile(pseudo){let m=$("#mProf");if(!m){m=document.createElement("div");m.id="mProf";m.className="modal";document.body.appendChild(m);m.addEventListener("click",e=>{if(e.target===m||e.target.closest(".mclose"))m.hidden=true})}
    m.innerHTML=`<div class="mbox pf-box"><button class="mclose" aria-label="✕">✕</button><p class="rk-msg">${L("Chargement…","Loading…","불러오는 중…","読み込み中…")}</p></div>`;m.hidden=false;
    const r=await api("/api/profile?pseudo="+encodeURIComponent(pseudo)).catch(()=>null);
    m.querySelector(".mbox").innerHTML=`<button class="mclose" aria-label="✕">✕</button>`+(r&&r.ok?card(r.d,false):`<p class="rk-msg">${L("Profil introuvable.","Profile not found.","프로필을 찾을 수 없어요.","プロフィールが見つかりません。")}</p>`)}
  /* mouse wheel scrolls the tab row sideways when it overflows */
  document.addEventListener("wheel",e=>{const t=e.target.closest&&e.target.closest(".sh-tabs");if(!t||t.scrollWidth<=t.clientWidth||Math.abs(e.deltaY)<Math.abs(e.deltaX))return;t.scrollLeft+=e.deltaY;e.preventDefault()},{passive:false});
  /* ---------- events ---------- */
  document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("button,[data-prof]");if(!t)return;
    if(t.id==="h2Daily"){e.stopPropagation();show("pDaily");try{play("page")}catch(_){}return}
    if(t.id==="h2Shop"){e.stopPropagation();show("pShop");try{play("page")}catch(_){}loadWallet().then(()=>{if(!panel("pShop").hidden)renderShop()});return}
    if(t.id==="hAccount"&&shopOn()&&ACC.profile&&ACC.profile.pseudo){e.stopPropagation();show("pProfile");loadWallet().then(()=>{if(!panel("pProfile").hidden)renderProfile()});return}
    if(!t.closest(".beta-panel")&&!t.closest("#rk2")&&!t.closest("#mProf"))return;
    if(t.dataset.prof!=null&&shopOn()){openProfile(t.dataset.prof);return}
    if(t.hasAttribute("data-bk")){e.stopPropagation();stopPreview();show("hMain");return}
    if(t.id==="dlPlay"){startDaily();return}
    if(t.dataset.dt){BETA.tab=t.dataset.dt==="today"?"today":"y";renderDaily(false);return}
    if(t.dataset.play){playPreview(t.dataset.play);return}
    if(t.dataset.cat){stopPreview();BETA.shopCat=t.dataset.cat;renderShop();return}
    if(t.dataset.buy){const it=shopItem(t.dataset.buy);if(BETA.w&&BETA.w.coins<it[1]){try{play("forbid")}catch(_){}const m=$("#shMsg");if(m)m.textContent=L(`Il te manque ${it[1]-BETA.w.coins} 🌙 pour cet objet.`,`You need ${it[1]-BETA.w.coins} more 🌙 for this item.`,`이 아이템을 사려면 🌙 ${it[1]-BETA.w.coins}개가 더 필요해요.`,`このアイテムにはあと🌙${it[1]-BETA.w.coins}個必要です。`);return}if(t.dataset.armed){shopAct({action:"buy",item:it[0]})}else{t.dataset.armed=1;t.classList.add("ask");t.textContent=L(`Acheter pour ${it[1]} 🌙 ?`,`Buy for ${it[1]} 🌙?`,`🌙 ${it[1]}개로 구매?`,`🌙${it[1]}で買う？`)}return}
    if(t.dataset.eq){shopAct({action:"equip",item:t.dataset.eq,slot:t.dataset.eq.split(":")[0]});return}
    if(t.hasAttribute("data-ren")){const ed=document.querySelector(".sh-ren");if(ed)ed.scrollIntoView({behavior:"smooth"});return}
    if(t.id==="shRenSave"){const names={};document.querySelectorAll("[data-rn]").forEach(i=>{if(i.value.trim())names[i.dataset.rn]=i.value.trim()});if(await shopAct({action:"names",names})){const m=$("#shMsg");if(m)m.textContent=L("Noms enregistrés !","Names saved!","이름을 저장했어요!","名前を保存しました！")}return}
    if(t.id==="shGrant"){shopAct({action:"grant",n:500});return}
    if(t.id==="pfShop"){show("pShop");return}if(t.id==="pfDaily"){show("pDaily");return}if(t.id==="pfEdit"){show("pAccount");return}
  },true);
  /* home: daily card (beta) + greeting cosmetics */
  const BAG=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12.5H6.2zM9 8V6.5a3 3 0 0 1 6 0V8"/></svg>`;
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);const on=shopOn(),dOn=dailyOn();let c=$("#h2Daily");
    const bar=$("#h2Bar");let sb=$("#h2Shop");
    if(bar){if(on&&!sb){sb=document.createElement("button");sb.id="h2Shop";const rk=$("#hRank");(rk&&rk.parentNode===bar?rk:bar.lastChild).after(sb)}
      if(!on&&sb)sb.remove();if(sb)sb.innerHTML=BAG+`<span>${L("Boutique","Shop","상점","ショップ")}</span>`;bar.classList.toggle("five",on)}
    if(!dOn){if(c)c.remove()}
    const sec=$("#h2Sec");if(dOn&&!c&&sec){c=document.createElement("button");c.id="h2Daily";c.className="h2-daily";sec.before(c)}
    if(c){const date=parisDate();let mine=null;try{mine=JSON.parse(localStorage.getItem("magicoku:daily:"+date)||"null")}catch(_){}
      c.innerHTML=`<span class="hd-ic">🗓️</span><span class="hd-t"><b>${L("Énigme du jour","Daily puzzle","오늘의 수수께끼","今日の謎")}</b><small>${mine?L(`Résolue · score ${fmtT(mine.t+30*mine.e+60*mine.h)}`,`Solved · score ${fmtT(mine.t+30*mine.e+60*mine.h)}`,`해결 · 점수 ${fmtT(mine.t+30*mine.e+60*mine.h)}`,`解決・スコア ${fmtT(mine.t+30*mine.e+60*mine.h)}`):L("Une nouvelle énigme t'attend : affronte les autres détectives !","A new puzzle awaits: take on the other detectives!","새 수수께끼가 기다려요. 다른 탐정들과 겨뤄 보세요!","新しい謎が待っている。ほかの探偵と勝負だ！")}</small></span><span class="hd-w">${BETA.w?shards(BETA.w.coins):""}</span><span class="h2-chev">›</span>`}
    const w=$("#hWho img");const me=ACC.profile;if(w&&me&&myCos()&&(myCos().chara||myCos().orn)){w.outerHTML=cosAv(me.avatar,myCos(),"hw-av")}
    const ttl=$("#hWho .cos-title");if(!ttl&&myCos()&&myCos().title){const b=$("#hWho b");if(b)b.insertAdjacentHTML("afterend",cosTitle(myCos()))}};
  applyCos();setTimeout(()=>{loadWallet().then(()=>{try{renderHome()}catch(_){}})},1500);
  try{renderHome()}catch(e){}
})();
