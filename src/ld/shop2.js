/* ================= shop, Halloween 2026 drop: new ornaments (incl. the limited "Halloween night" one) ================= */
(function(){
  const I=typeof IC2!=="undefined"?IC2:{};
  const st=document.createElement("style");st.textContent=`
.cav.orn-vines img{box-shadow:0 0 0 3px #8fd18f,0 0 0 5px #2f6b3a,0 0 14px #9fe39f!important}
.cav.orn-vines::before{content:"🌿";left:-14%;top:-12%;transform:rotate(-30deg)}.cav.orn-vines::after{content:"🍃";right:-12%;bottom:-10%}
.cav.orn-crystal img{box-shadow:0 0 0 3px #d9ccff,0 0 0 5px #7a4fd6,0 0 18px #b39dff!important}
.cav.orn-crystal::before{content:"💎";left:-12%;bottom:-8%;animation:ornTw 2s ease-in-out infinite}.cav.orn-crystal::after{content:"🔮";right:-12%;top:-12%}
/* rotating rings drawn as an overlay (works on every portrait, whatever its own background) */
.cav.orn-aurora,.cav.orn-rainbow{padding:0!important;background:none!important;animation:none!important}
.cav.orn-aurora img,.cav.orn-rainbow img{animation:none!important;box-shadow:none!important}
.cav.orn-aurora::before,.cav.orn-rainbow::before{content:""!important;inset:-9%;border-radius:50%;animation:ornSpin 8s linear infinite;
 -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px));mask:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px))}
.cav.orn-rainbow::before{background:conic-gradient(#ff6b6b,#ffd93b,#6bdc6b,#4cc3ff,#a06bff,#ff6b6b)}
.cav.orn-aurora::before{background:conic-gradient(#3fe0b0,#4cc3ff,#8a6aff,#d36aff,#3fe0b0);filter:drop-shadow(0 0 6px #6ad8ff)}
.cav.orn-aurora::after{content:"✨";right:-12%;top:-12%;animation:ornTw 2.2s ease-in-out infinite}
.cav.orn-royal img{box-shadow:0 0 0 3px #f6d36a,0 0 0 6px #7a1630,0 0 0 8px #f6d36a,0 0 22px #f6d36a99!important}
.cav.orn-royal::before{content:"👑";left:50%;top:-34%;transform:translateX(-50%);font-size:calc(var(--s,44px)*.46)!important;filter:drop-shadow(0 2px 3px #0006)}
.cav.orn-royal::after{content:"✦";right:-6%;bottom:-4%;color:#f6d36a;text-shadow:0 0 6px #fff}
.cav.orn-hallo img{box-shadow:0 0 0 3px #f08a24,0 0 0 5px #3b1a4a,0 0 18px #ff8a3d!important}
.cav.orn-hallo::before{content:""!important;left:-22%;top:-20%;width:52%;height:52%;background:${I.hwghost?`url(${I.hwghost})`:"none"} center/contain no-repeat;animation:ornTw 3s ease-in-out infinite}
.cav.orn-hallo::after{content:""!important;right:-20%;bottom:-16%;width:54%;height:54%;background:${I.hwpumpkin?`url(${I.hwpumpkin})`:"none"} center/contain no-repeat;filter:drop-shadow(0 0 5px #ff8a3d)}
.sh-it.sh-lim{position:relative;border-color:#f08a24!important;box-shadow:0 0 14px rgba(240,138,36,.45)!important}
.sh-limt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:2px 8px;border-radius:999px;background:linear-gradient(#ffb347,#e8701a);color:#2a1206;font:800 10.5px var(--f-simple,system-ui);box-shadow:0 2px 6px #0006;z-index:3}`;
  document.head.appendChild(st);
})();
