/* ================= home: thank-you message to the testers + one-time gift of 300 moon shards (server: shop action "gift") ================= */
(function(){
  const GIFT="thanks1",K="magicoku:gift:"+GIFT,KX="magicoku:giftHide:"+GIFT;
  const get=k=>{try{return localStorage.getItem(k)}catch(_){return null}},set=(k,v)=>{try{localStorage.setItem(k,v)}catch(_){}};
  const acc=()=>{const p=ACC.profile;return p&&p.pseudo&&p.pid&&p.ptok?p:null};
  let busy=false,msg="";
  function card(){let c=$("#tyCard");if(!c){const hero=$("#h2Hero");if(!hero)return null;c=document.createElement("section");c.id="tyCard";hero.before(c);
      c.addEventListener("click",e=>{const b=e.target.closest("[data-ty]");if(!b)return;e.stopPropagation();if(b.dataset.ty==="get")claim();else if(b.dataset.ty==="hide"){set(KX,"1");paint()}})}return c}
  async function claim(){const p=acc();if(busy)return;if(!p){msg=L("Crée d'abord ton détective pour recevoir le cadeau.","Create your detective first to get the gift.","선물을 받으려면 먼저 탐정을 만드세요.","プレゼントを受け取るには、まず探偵を作ってね。");paint();return}
    busy=true;msg="";paint();let r=null;
    try{const res=await fetch("/api/shop",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok,action:"gift",gift:GIFT})});r={ok:res.ok,status:res.status,d:await res.json().catch(()=>null)}}catch(_){}
    busy=false;
    if(r&&r.ok){set(K,"1");try{play("win")}catch(_){}toast(r.d&&r.d.already?L("Tu as déjà reçu ce cadeau.","You already got this gift.","이미 받은 선물이에요.","このプレゼントはもう受け取っています。"):L("🎁 +300 éclats de lune ! Va faire un tour à la boutique.","🎁 +300 moon shards! Have a look in the shop.","🎁 달 조각 +300개! 상점을 둘러보세요.","🎁 月のかけら+300！ショップをのぞいてみてね。"));
      try{if(typeof loadWallet==="function")await loadWallet()}catch(_){}try{renderHome()}catch(_){}}
    else if(r&&r.status===423)msg=L("Ce compte est lié à un autre appareil : récupère-le avec ton code pour recevoir le cadeau.","This account is linked to another device: recover it with your code to get the gift.","이 계정은 다른 기기에 연결되어 있어요. 코드로 복구하면 선물을 받을 수 있어요.","このアカウントは別の端末に紐づいています。コードで復元するとプレゼントを受け取れます。");
    else msg=L("Impossible de joindre le serveur. Réessaie dans un instant.","Couldn't reach the server. Try again in a moment.","서버에 연결할 수 없어요. 잠시 후 다시 시도하세요.","サーバーにつながりません。少ししてからもう一度試してね。");
    paint()}
  function paint(){const c=card();if(!c)return;const got=get(K)==="1";if(got&&get(KX)==="1"){c.hidden=true;return}c.hidden=false;
    c.className="ty-card"+(got?" got":"");
    c.innerHTML=`${got?`<button class="ty-x" data-ty="hide" aria-label="${L("Masquer","Hide","숨기기","隠す")}">✕</button>`:""}
      <h3>💌 ${L("Merci de tester Magicoku !","Thanks for testing Magicoku!","Magicoku를 테스트해 줘서 고마워요!","Magicokuのテストをありがとう！")}</h3>
      <p>${L("Merci à tous d'essayer mon jeu ! Si vous pouvez ouvrir l'application de temps en temps, même pour un seul niveau, ça m'aide énormément : c'est ce qui permet à Google de valider le jeu.",
        "Thank you all for trying my game! If you can open the app from time to time, even for a single level, it helps me a lot: that's what lets Google approve the game.",
        "제 게임을 해 줘서 모두 고마워요! 가끔 앱을 열어 레벨 하나만 해도 정말 큰 도움이 돼요. 그래야 구글이 게임을 승인해 줘요.",
        "ゲームを遊んでくれてありがとう！ときどきアプリを開いて、1レベルだけでも遊んでくれると本当に助かります。それでGoogleがゲームを承認してくれるんです。")}</p>
      <p>${L("Une remarque, un bug ? Envoyez-moi un message privé.","A comment, a bug? Send me a private message.","의견이나 버그가 있나요? 개인 메시지로 보내 주세요.","気づいたことやバグがあれば、個別メッセージで送ってね。")}</p>
      <p>${L("Pour vous remercier, voici <b>300 éclats de lune</b> pour vous offrir des petits trucs dans la boutique 🎁","As a thank-you, here are <b>300 moon shards</b> to treat yourself in the shop 🎁","고마운 마음으로 상점에서 쓸 <b>달 조각 300개</b>를 드려요 🎁","お礼に、ショップで使える<b>月のかけら300個</b>をプレゼント🎁")}</p>
      <small class="ty-sig">— Clem</small>
      ${got?`<div class="ty-done">✓ ${L("300 éclats de lune récupérés","300 moon shards collected","달 조각 300개 받음","月のかけら300個 受け取り済み")}</div>`
        :`<button class="ty-go" data-ty="get"${busy?" disabled":""}>${busy?L("Un instant…","One moment…","잠시만요…","少々お待ちください…"):"🎁 "+L("Récupérer mes 300 éclats","Collect my 300 shards","달 조각 300개 받기","300個を受け取る")}</button>`}
      ${msg?`<p class="ty-msg">${msg}</p>`:""}`}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{if(!busy)paint()}catch(_){}};
  const st=document.createElement("style");st.textContent=`.ty-card{position:relative;margin:0 0 12px;padding:14px 16px;border-radius:18px;background:linear-gradient(#fbf1d8,#f0deb6);border:2px solid #d4a53c;color:#3a1f3d;text-align:left;box-shadow:0 6px 18px #0004}
.ty-card[hidden]{display:none}
.ty-card h3{margin:0 30px 6px 0;font-size:18px;color:#8e1f33}
.ty-card p{margin:0 0 6px;font:500 14px/1.45 var(--f-simple,system-ui)!important;color:#4a3a30}
.ty-sig{display:block;margin:2px 0 8px;font:italic 600 13px var(--f-simple,system-ui)!important;color:#6b4a3a;text-align:right}
.ty-go{display:block;width:100%;min-height:50px;border:0;border-radius:999px;background:linear-gradient(#b8304a,#8e1f33);color:#fff3d6;font-size:17px;font-weight:800;box-shadow:0 4px 0 #5e1222;cursor:pointer}
.ty-go[disabled]{opacity:.7}
.ty-done{padding:10px;border-radius:12px;background:rgba(63,125,58,.14);color:#2f5f2b;font:700 14px var(--f-simple,system-ui)!important;text-align:center}
.ty-msg{margin:8px 0 0!important;color:#8e1f33!important;font-weight:600!important}
.ty-x{position:absolute;top:6px;right:6px;width:40px;height:40px;border:0;background:none;font-size:18px;color:#6b4a3a;cursor:pointer}`;document.head.appendChild(st);
  try{paint()}catch(_){}
})();
