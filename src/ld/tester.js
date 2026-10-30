/* ================= home: call for Android testers (Play Store closed test) + 200 moon shards once the app is opened from the Play Store ================= */
(function(){
  const GIFT="tester1",K="magicoku:gift:"+GIFT,KX="magicoku:testerHide",KA="magicoku:twa",MAIL="magicoku@gmail.com";
  const get=k=>{try{return localStorage.getItem(k)}catch(_){return null}},set=(k,v)=>{try{localStorage.setItem(k,v)}catch(_){}};
  /* opened by the Android app (Trusted Web Activity installed from the Play Store) */
  try{if(/^android-app:\/\/app\.dev\.workers\.scorclem\.magicoku\.twa/.test(document.referrer||""))set(KA,"1")}catch(_){}
  const inApp=()=>get(KA)==="1",ios=/iPhone|iPad|iPod/i.test(navigator.userAgent||"");
  const acc=()=>{const p=ACC.profile;return p&&p.pseudo&&p.pid&&p.ptok?p:null};
  let busy=false,msg="";
  function card(){let c=$("#tsCard");if(!c){const hero=$("#h2Hero");if(!hero)return null;c=document.createElement("section");c.id="tsCard";hero.before(c);
      c.addEventListener("click",e=>{const b=e.target.closest("[data-ts]");if(!b)return;e.stopPropagation();const a=b.dataset.ts;if(a==="get")claim();else if(a==="hide"){set(KX,"1");paint()}})}return c}
  async function claim(){const p=acc();if(busy)return;if(!p){msg=L("Crée d'abord ton détective pour recevoir le cadeau.","Create your detective first to get the gift.","선물을 받으려면 먼저 탐정을 만드세요.","プレゼントを受け取るには、まず探偵を作ってね。");paint();return}
    busy=true;msg="";paint();let r=null;
    try{const res=await fetch("/api/shop",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.pid,token:p.ptok,action:"gift",gift:GIFT})});r={ok:res.ok,status:res.status,d:await res.json().catch(()=>null)}}catch(_){}
    busy=false;
    if(r&&r.ok){set(K,"1");try{play("win")}catch(_){}toast(r.d&&r.d.already?L("Tu as déjà reçu ce cadeau.","You already got this gift.","이미 받은 선물이에요.","このプレゼントはもう受け取っています。"):L("🎁 +200 éclats de lune ! Merci d'être testeur.","🎁 +200 moon shards! Thanks for testing.","🎁 달 조각 +200개! 테스트해 줘서 고마워요.","🎁 月のかけら+200！テストありがとう。"));
      try{if(typeof loadWallet==="function")await loadWallet()}catch(_){}try{renderHome()}catch(_){}}
    else if(r&&r.status===423)msg=L("Ce compte est lié à un autre appareil : récupère-le avec ton code pour recevoir le cadeau.","This account is linked to another device: recover it with your code to get the gift.","이 계정은 다른 기기에 연결되어 있어요. 코드로 복구하면 선물을 받을 수 있어요.","このアカウントは別の端末に紐づいています。コードで復元するとプレゼントを受け取れます。");
    else msg=L("Impossible de joindre le serveur. Réessaie dans un instant.","Couldn't reach the server. Try again in a moment.","서버에 연결할 수 없어요. 잠시 후 다시 시도하세요.","サーバーにつながりません。少ししてからもう一度試してね。");
    paint()}
  function paint(){const c=card();if(!c)return;const got=get(K)==="1",app=inApp();
    if(get(KX)==="1"||(!app&&ios)||(app&&got&&get(KX)==="1")){c.hidden=true;return}c.hidden=false;c.className="ty-card ts-card"+(got?" got":"");
    const x=`<button class="ty-x" data-ts="hide" aria-label="${L("Masquer","Hide","숨기기","隠す")}">✕</button>`;
    if(app){c.innerHTML=(got?x:"")+`<h3>📱 ${L("Merci d'être testeur !","Thanks for being a tester!","테스터가 되어 줘서 고마워요!","テスターになってくれてありがとう！")}</h3>
      <p>${L("Tu joues avec l'application du Play Store : c'est exactement ce qui aide Magicoku à sortir pour tout le monde. Garde-la installée et ouvre-la de temps en temps pendant 14 jours.","You're playing with the Play Store app: that's exactly what helps Magicoku launch for everyone. Keep it installed and open it now and then for 14 days.","Play 스토어 앱으로 플레이하고 있어요. 이게 바로 Magicoku 출시에 도움이 돼요. 14일 동안 앱을 지우지 말고 가끔 열어 주세요.","Playストアのアプリで遊んでくれています。これがMagicokuのリリースに一番役立ちます。14日間アンインストールせず、ときどき開いてね。")}</p>
      ${got?`<div class="ty-done">✓ ${L("200 éclats de lune récupérés","200 moon shards collected","달 조각 200개 받음","月のかけら200個 受け取り済み")}</div>`
        :`<button class="ty-go" data-ts="get"${busy?" disabled":""}>${busy?L("Un instant…","One moment…","잠시만요…","少々お待ちください…"):"🎁 "+L("Récupérer mes 200 éclats","Collect my 200 shards","달 조각 200개 받기","200個を受け取る")}</button>`}${msg?`<p class="ty-msg">${msg}</p>`:""}`;return}
    const subj=encodeURIComponent(L("Testeur Magicoku Android","Magicoku Android tester","Magicoku 안드로이드 테스터","Magicoku Androidテスター")),body=encodeURIComponent(L("Mon adresse Gmail : ","My Gmail address: ","내 Gmail 주소: ","私のGmailアドレス："));
    c.innerHTML=x+`<h3>📱 ${L("Aide Magicoku à sortir sur le Play Store !","Help Magicoku launch on the Play Store!","Magicoku의 Play 스토어 출시를 도와주세요!","MagicokuのPlayストア公開を手伝って！")}</h3>
      <p>${L("Tu as un téléphone Android ? Pour sortir l'application, Google demande des testeurs pendant 14 jours.","Do you have an Android phone? To release the app, Google needs testers for 14 days.","안드로이드 휴대폰이 있나요? 앱을 출시하려면 구글이 14일 동안 테스터를 요구해요.","Androidのスマホを持っていますか？アプリを公開するには、Googleが14日間のテスターを求めています。")}</p>
      <ol class="ts-steps"><li>${L(`Envoie ton adresse Gmail à <b>${MAIL}</b> (ou en message privé dans le chat).`,`Send your Gmail address to <b>${MAIL}</b> (or as a private message in the chat).`,`Gmail 주소를 <b>${MAIL}</b>로 보내 주세요(채팅 개인 메시지도 돼요).`,`Gmailアドレスを<b>${MAIL}</b>に送ってね（チャットの個別メッセージでもOK）。`)}</li>
        <li>${L("Tu reçois un lien : appuie sur « Devenir testeur », puis installe Magicoku depuis le Play Store.","You get a link: tap “Become a tester”, then install Magicoku from the Play Store.","링크를 받으면 ‘테스터 되기’를 누르고 Play 스토어에서 Magicoku를 설치하세요.","届いたリンクで「テスターになる」をタップし、PlayストアからMagicokuをインストール。")}</li>
        <li>${L("Ouvre le jeu dans l'application : <b>200 éclats de lune</b> t'y attendent 🎁","Open the game in the app: <b>200 moon shards</b> are waiting for you there 🎁","앱에서 게임을 열면 <b>달 조각 200개</b>가 기다리고 있어요 🎁","アプリでゲームを開くと<b>月のかけら200個</b>が待っています🎁")}</li></ol>
      <a class="ty-go ts-mail" href="mailto:${MAIL}?subject=${subj}&body=${body}">✉️ ${L("Envoyer mon adresse","Send my address","주소 보내기","アドレスを送る")}</a>
      <small class="ty-sig">— Clem</small>`}
  const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);try{if(!busy)paint()}catch(_){}};
  const st=document.createElement("style");st.textContent=`.ts-card{border-color:#5aa36a!important;background:linear-gradient(#f2f7e6,#dfeccb)!important}
.ts-steps{margin:2px 0 10px;padding-left:20px;font:500 14px/1.45 var(--f-simple,system-ui);color:#4a3a30}.ts-steps li{margin:0 0 4px}
.ts-mail{display:flex!important;align-items:center;justify-content:center;text-decoration:none;background:linear-gradient(#4f9a5f,#2f6b3a)!important;box-shadow:0 4px 0 #1f4a27!important}`;document.head.appendChild(st);
  try{paint()}catch(_){}
})();
