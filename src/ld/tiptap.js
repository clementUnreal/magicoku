/* ================= one-time notice everyone must read: tapping words in the testimonies ================= */
(function(){
  const K="magicoku:tipTapWords2";
  const seen=()=>{try{return localStorage.getItem(K)==="1"}catch(_){return true}};
  function show(){if(seen()||$("#tipTap"))return;
    if(document.querySelector("#coach:not([hidden]),.coach-on,#onb:not([hidden])"))return;
    const m=document.createElement("div");m.id="tipTap";m.className="tt-ov";
    m.innerHTML=`<div class="tt-box" role="dialog" aria-modal="true">
      <div class="tt-ic">👆</div>
      <h2>${L("Astuce importante","Important tip","중요한 팁","大切なヒント")}</h2>
      <p>${L("Dans les témoignages, <b>touche les mots en couleur</b> :","In the testimonies, <b>tap the coloured words</b>:","증언에서 <b>색깔 있는 단어를 눌러 보세요</b>:","証言の<b>色のついた言葉をタップ</b>してみよう：")}</p>
      <div class="tt-ex">${L('<span class="tt-p">Ambroise</span> se tenait à côté <span class="tt-o">du gramophone</span>.','<span class="tt-p">Ambroise</span> stood next to <span class="tt-o">the gramophone</span>.','<span class="tt-p">앙브루아즈</span>는 <span class="tt-o">축음기</span> 옆에 있었다.','<span class="tt-p">アンブロワーズ</span>は<span class="tt-o">蓄音機</span>のそばにいた。')}</div>
      <ul>
        <li><span class="tt-p">${L("Un personnage","A character","인물","人物")}</span> → ${L("il est <b>sélectionné</b> : touche ensuite une case pour le placer.","they are <b>selected</b>: then tap a square to place them.","그 인물이 <b>선택돼요</b>. 그다음 칸을 눌러 배치하세요.","その人が<b>選択</b>されます。次にマスをタップして置こう。")}</li>
        <li><span class="tt-o">${L("Un objet, une pièce, une rangée","An object, a room, a row","물건, 방, 행","物・部屋・行")}</span> → ${L("ses cases <b>s'allument sur le plan</b>. Touche encore pour éteindre.","its squares <b>light up on the map</b>. Tap again to turn them off.","해당 칸이 <b>지도에서 빛나요</b>. 다시 누르면 꺼져요.","そのマスが<b>マップで光ります</b>。もう一度タップで消えます。")}</li>
        <li>❌ ${L("Une croix posée sur un objet est dessinée en petit dans le coin, mais si tu ne retrouves plus un objet, <b>touche son nom dans le texte</b> : toutes ses cases s'allument, même sous les croix.","A cross on an object is drawn small in the corner, but if you lose track of an object, <b>tap its name in the text</b>: all its squares light up, even under crosses.","물건 위의 X는 모서리에 작게 그려져요. 물건이 안 보이면 <b>글에서 그 이름을 누르세요</b>. X 아래에 있어도 모든 칸이 빛나요.","物の上の✕は角に小さく描かれます。物が見えなくなったら、<b>文中の名前をタップ</b>しよう。✕の下でも全部のマスが光ります。")}</li>
      </ul>
      <button class="tt-go">${L("J'ai compris","Got it","알겠어요","わかった")}</button></div>`;
    document.body.appendChild(m);
    m.querySelector(".tt-go").onclick=()=>{try{localStorage.setItem(K,"1")}catch(_){}m.remove();try{play("select")}catch(_){}}}
  const special=()=>(typeof DAILY!=="undefined"&&DAILY.on)||(typeof COOP!=="undefined"&&COOP.play);
  const _oc=openCase;openCase=function(){const r=_oc.apply(this,arguments);if(!seen()&&!special())setTimeout(show,1200);return r};
  const st=document.createElement("style");st.textContent=`.tt-ov{position:fixed;inset:0;z-index:95;background:rgba(20,10,30,.6);display:flex;align-items:center;justify-content:center;padding:16px}
.tt-box{width:min(440px,100%);max-height:calc(100dvh - 32px);overflow:auto;background:linear-gradient(#fbf3df,#f1e3c2);border:2px solid #c9a25a;border-radius:20px;padding:16px 16px 14px;color:#3a1f3d;text-align:left;box-shadow:0 12px 34px #0007}
.tt-ic{font-size:34px;text-align:center;line-height:1}
.tt-box h2{margin:4px 0 8px;text-align:center;font-size:21px;color:#8e1f33}
.tt-box p{margin:0 0 8px;font:500 15px/1.4 var(--f-simple,system-ui)!important}
.tt-ex{margin:0 0 10px;padding:10px 12px;border-radius:12px;background:#fffaf0;border:1.5px dashed #c9a25a;font:italic 500 15px/1.5 var(--f-body,Georgia)!important}
.tt-p{color:#2f7d32;font-weight:800;font-style:normal}
.tt-o{color:#9a6a10;font-weight:800;font-style:normal;text-decoration:underline dotted;text-underline-offset:3px}
.tt-ex .tt-p{background:rgba(63,125,58,.16);border-radius:6px;padding:0 4px;box-shadow:0 0 0 2px rgba(63,125,58,.35)}
.tt-ex .tt-o{background:rgba(214,171,79,.22);border-radius:6px;padding:0 4px}
.tt-box ul{margin:0 0 12px;padding:0 0 0 18px;display:flex;flex-direction:column;gap:6px;font:500 14px/1.4 var(--f-simple,system-ui)!important}
.tt-go{display:block;width:100%;min-height:50px;border:0;border-radius:999px;background:linear-gradient(#b8304a,#8e1f33);color:#fff3d6;font-size:18px;font-weight:800;box-shadow:0 4px 0 #5e1222;cursor:pointer}`;
  document.head.appendChild(st);
})();
