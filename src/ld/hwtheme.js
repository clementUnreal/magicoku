/* ================= Halloween look for the whole app (until HW_THEME_END): night sky, moon, haunted academy, fog, cobwebs, ghosts, pumpkin buttons ================= */
(function(){
  const on=()=>typeof HW_THEME_END!=="undefined"&&Date.now()<=HW_THEME_END;
  if(!on())return;
  const svg=s=>"url(\"data:image/svg+xml,"+encodeURIComponent(s)+"\")";
  /* haunted academy, dead trees and graves along the bottom of the screen */
  const SKY=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 130" preserveAspectRatio="xMidYMax slice"><g fill="#0b0612">
<path d="M0 130V104c20-6 40-8 60-5s38 2 55-4 40-7 62-2 44 4 66-2 48-6 70-1 50 6 87 0V130z"/>
<path d="M150 104V58h8V40l9-22 9 22v18h6V48l6-16 6 16v10h20V36l11-26 11 26v22h6V44l7-18 7 18v60z"/>
<path d="M206 36l11-26 11 26zM163 40l4-10 4 10zM231 44l3-8 3 8z" fill="#170b22"/>
<path d="M30 104c2-14 1-26-4-38l3-1c4 9 6 18 6 27 3-9 8-16 14-21l2 2c-7 7-11 16-12 27l-1 4zM26 74c-5-4-11-6-17-6v-3c7 0 13 2 18 6zM38 84c4-6 9-9 15-10l1 3c-6 1-10 4-13 9z"/>
<path d="M352 104c1-16-1-30-7-42l3-1c4 8 6 16 7 25 3-8 8-15 15-19l2 2c-8 6-12 15-13 26l-1 9zM346 70c-6-5-13-7-20-6l-1-3c8-1 15 1 22 6zM364 66l6-12 3 1-6 12z"/>
<path d="M92 104v-12c0-5 4-8 8-8s8 3 8 8v12zM118 104v-9c0-4 3-6 6-6s6 2 6 6v9zM292 104v-11c0-5 4-7 7-7s7 2 7 7v11z"/>
<path d="M98 94h4v-4h3v4h4v3h-4v6h-3v-6h-4z" fill="#1d1028"/></g>
<g fill="#ffb347"><rect x="160" y="64" width="4" height="7" rx="2"/><rect x="172" y="74" width="4" height="7" rx="2"/><rect x="214" y="44" width="5" height="8" rx="2.5"/><rect x="214" y="62" width="5" height="8" rx="2.5" opacity=".6"/><rect x="236" y="56" width="4" height="7" rx="2"/><rect x="192" y="68" width="4" height="7" rx="2" opacity=".7"/></g>
<g><ellipse cx="72" cy="103" rx="6" ry="5" fill="#e8741c"/><path d="M71 98h2v-3h-2z" fill="#3b5a1a"/><path d="M69 102l1.5-1.5 1.5 1.5zM73 102l1.5-1.5 1.5 1.5zM69 105h7l-1 1h-5z" fill="#ffd27a"/>
<ellipse cx="318" cy="103" rx="7" ry="5.5" fill="#e8741c"/><path d="M317 97.5h2v-3h-2z" fill="#3b5a1a"/><path d="M314 102l1.5-1.5 1.5 1.5zM319 102l1.5-1.5 1.5 1.5zM314 105h8l-1 1.2h-6z" fill="#ffd27a"/></g></svg>`;
  const WEB=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.1">
<path d="M0 0L100 38M0 0L80 80M0 0L38 100M0 0L100 8M0 0L8 100"/>
<path d="M22 0q4 6 1 9 5-2 8 4 0 5 4 8-3 3-1 7-6 0-9 4-3-5-9-4 2-4-1-7 4-3 3-8 4-6 4-13z" transform="scale(.9)"/>
<path d="M44 0q2 12 4 17 8 1 12 9-4 8-2 15-11 3-15 13-7-7-17-6-2-9-10-12 3-9 0-15 8-4 10-12 9-1 18 4"/>
<path d="M70 0q2 18 8 26 7 6 14 9-5 14-4 22-14 4-20 18-11-8-26-6-3 13-12 22-8-10-21-12 4-12 1-22 13-5 16-18 12-1 26 6"/></g>
<path d="M46 52v18" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/><g transform="translate(46 74)"><ellipse rx="4" ry="5" fill="#1a0f22"/><circle cy="-5" r="2.6" fill="#1a0f22"/><path d="M-3-2l-5-3M-3 1l-6 0M-3 3l-5 4M3-2l5-3M3 1l6 0M3 3l5 4" stroke="#1a0f22" stroke-width="1.1"/><circle cx="-1" cy="-5.4" r=".6" fill="#ff8a2a"/><circle cx="1" cy="-5.4" r=".6" fill="#ff8a2a"/></g></svg>`;
  const GHOST=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 70"><path d="M30 2C15 2 6 14 6 30v34l7-6 6 6 6-6 5 6 5-6 6 6 6-6 7 6V30C54 14 45 2 30 2z" fill="#f4f0ff" fill-opacity=".9"/><ellipse cx="22" cy="28" rx="4" ry="6" fill="#2a1840"/><ellipse cx="38" cy="28" rx="4" ry="6" fill="#2a1840"/><ellipse cx="30" cy="42" rx="4" ry="5" fill="#2a1840"/></svg>`;
  /* bunting across the top: orange, black and purple flags with bats and pumpkin faces */
  const FL=(()=>{let o="",n=11;for(let i=0;i<n;i++){const x=8+i*35.5,y=4+16*Math.sin(Math.PI*(i+.5)/n),c=["#f08a24","#1a0f22","#6a2c8a"][i%3];
    o+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((i-(n-1)/2)*-2.2).toFixed(1)})"><path d="M0 0h26l-13 26z" fill="${c}" stroke="#00000055" stroke-width=".8"/>`;
    if(i%3===0)o+=`<path d="M7 7l2.5 2 1.5-2.5 1.5 2.5 1.5-2.5 1.5 2.5 2.5-2-1.5 4-3-1.5-1 2-1-2-3 1.5z" fill="#1a0f22"/>`;
    else if(i%3===1)o+=`<path d="M9 6l2.5 2.5 2.5-2.5zM14.5 6l2.5 2.5 2.5-2.5zM9.5 11h8l-1.5 2h-5z" fill="#ffb347" transform="translate(-1 0)"/>`;
    else o+=`<path d="M8 8c2-2 4-2 5 0 1-2 3-2 5 0-1 1-2 3-5 4-3-1-4-3-5-4z" fill="#f4f0ff" opacity=".85"/>`;o+=`</g>`}
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" preserveAspectRatio="none"><path d="M0 2Q200 40 400 2" fill="none" stroke="#3a2418" stroke-width="1.6"/>${o}</svg>`})();
  const PUMP=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 48"><g><path d="M30 10q2-8 7-9l1 2q-4 2-5 8z" fill="#3b5a1a"/><ellipse cx="30" cy="30" rx="22" ry="17" fill="#e8741c"/><path d="M22 14q-6 16 0 33M38 14q6 16 0 33M30 13v34" stroke="#b24a0c" stroke-width="1.5" fill="none" opacity=".7"/><path d="M19 25l5-5 5 5zM31 25l5-5 5 5zM18 33q12 9 24 0l-3 4-3-2-3 3-3-3-3 3-3-2z" fill="#ffd27a"/></g>
<g transform="translate(52 14) scale(.72)"><path d="M30 10q2-8 7-9l1 2q-4 2-5 8z" fill="#3b5a1a"/><ellipse cx="30" cy="30" rx="22" ry="17" fill="#f08a24"/><path d="M22 14q-6 16 0 33M38 14q6 16 0 33M30 13v34" stroke="#b24a0c" stroke-width="1.5" fill="none" opacity=".7"/><path d="M20 27q3-4 6 0zM34 27q3-4 6 0zM20 34q10 6 20 0q-10 3-20 0z" fill="#ffd27a"/></g>
<g transform="translate(86 22) scale(.55)"><path d="M30 10q2-8 7-9l1 2q-4 2-5 8z" fill="#3b5a1a"/><ellipse cx="30" cy="30" rx="22" ry="17" fill="#e8741c"/><path d="M22 14q-6 16 0 33M38 14q6 16 0 33" stroke="#b24a0c" stroke-width="1.5" fill="none" opacity=".7"/></g></svg>`;
  const I2=typeof IC2!=="undefined"?IC2:{},IMG_BG=I2.hwbg,IMG_GH=I2.hwghost,IMG_PK=I2.hwpumpkin;
  const st=document.createElement("style");st.id="hwThemeCss";
  st.textContent=`
html.hw-theme{--hw-o:#f08a24;--hw-o2:#ffb347;--hw-p:#2a1238;--hw-g:#9be36a}
/* night sky with a big moon, a warm glow on the horizon */
html.hw-theme body,html.hw-theme #home{background:${IMG_BG?`url(${IMG_BG}) center calc(100% - 58px)/cover no-repeat,`:""}#2f1535!important;background-attachment:fixed!important}
html.hw-theme #home::after{content:"";position:fixed;left:-30%;right:-30%;bottom:0;height:42vh;pointer-events:none;z-index:0;
 background:radial-gradient(ellipse 40% 30% at 30% 85%,rgba(190,170,230,.22),transparent 70%),radial-gradient(ellipse 45% 25% at 75% 92%,rgba(190,170,230,.18),transparent 70%);animation:hwFog 26s ease-in-out infinite alternate}
@keyframes hwFog{from{transform:translateX(-6%)}to{transform:translateX(6%)}}
html.hw-theme .home-in{position:relative;z-index:1}
/* cobwebs in the top corners */
html.hw-theme .hw-web{position:absolute;top:-28px;width:96px;height:96px;background:${svg(WEB)} 0 0/contain no-repeat;pointer-events:none;z-index:76;opacity:.8}
html.hw-theme .hw-web.l{left:-16px}html.hw-theme .hw-web.r{right:-16px;transform:scaleX(-1)}
html.hw-theme .hw-web .sp{position:absolute;left:43px;top:0;width:8px;height:74px;animation:hwSpider 6s ease-in-out infinite}
@keyframes hwSpider{0%,100%{transform:translateY(0)}50%{transform:translateY(14px)}}
html:not(.hw-theme) .hw-web,html:not(.hw-theme) .hw-ghosts{display:none}
body.g3 .hw-web{display:none}
/* drifting ghosts */
.hw-ghosts{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
body:has(#home[hidden]) .hw-ghosts,body:has(#home[hidden]) .hw-web,body:has(#home[hidden]) .hw-garl{display:none}
.hw-ghosts i{position:absolute;width:56px;height:56px;background:${IMG_GH?`url(${IMG_GH})`:svg(GHOST)} center/contain no-repeat;filter:drop-shadow(0 0 10px rgba(220,200,255,.45));opacity:.0;animation:hwGhost 18s ease-in-out infinite}
@keyframes hwGhost{0%{opacity:0;transform:translate(0,0) rotate(-6deg)}15%{opacity:.55}50%{transform:translate(22vw,-10vh) rotate(6deg);opacity:.45}85%{opacity:.5}100%{opacity:0;transform:translate(40vw,-22vh) rotate(-4deg)}}
body.g3 .hw-ghosts{display:none}
/* logo */
html.hw-theme .home-logo h1,html.hw-theme .home-t{color:#ffb347!important;text-shadow:0 0 12px rgba(240,138,36,.75),0 2px 0 #4a1a05!important}
/* cards: aged parchment with a pumpkin glow */
html.hw-theme .h2-hero,html.hw-theme .h2-news,html.hw-theme .ty-card{background:linear-gradient(#f6e6c6,#e5c48f)!important;border-color:#e0802c!important;box-shadow:0 0 0 1px #6b2a10,0 0 22px rgba(240,138,36,.35),0 8px 20px #0007!important}
html.hw-theme .h2-hero{position:relative}
html.hw-theme .h2-hero::after{content:"";position:absolute;right:-2px;top:-2px;width:64px;height:64px;background:${svg(WEB.replace(/#fff/g,"#5a2a10"))} 0 0/contain no-repeat;transform:scaleX(-1);pointer-events:none;opacity:.55;z-index:3}
html.hw-theme .h2-card{border-color:#e0802c!important;box-shadow:0 0 14px rgba(240,138,36,.25),0 6px 14px #0006!important}
html.hw-theme .h2-card.c-disc{background:linear-gradient(135deg,#5a1a3e,#2a0f22)!important}
html.hw-theme .h2-card.c-inf{background:linear-gradient(135deg,#1d3d3a,#0e1f22)!important}
html.hw-theme .h2-sec span{color:#ffb347!important}
/* main buttons: pumpkin */
html.hw-theme .h2-go,html.hw-theme .pill.red,html.hw-theme .hw-go{background:linear-gradient(#ffa64d,#e8701a 55%,#b24a0c)!important;color:#2a1206!important;border-color:#ffd27a!important;box-shadow:0 4px 0 #6b2a05,0 0 16px rgba(255,140,40,.45)!important;text-shadow:0 1px 0 rgba(255,220,160,.6)!important}
html.hw-theme .h2-go .h2-chev,html.hw-theme .h2-go svg{color:#2a1206!important;fill:currentColor}
/* bottom bar */
html.hw-theme .h2-bar{background:linear-gradient(#1c0f26,#0b0610)!important;border-top:2px solid #e0802c!important;box-shadow:0 -4px 22px rgba(240,138,36,.3)!important}
html.hw-theme .h2-bar button.on{background:radial-gradient(circle at 50% 40%,rgba(255,150,50,.4),transparent 70%)!important;color:#ffb347!important}
html.hw-theme .h2-bar button span{color:#f3d6b0}
/* game screen */
html.hw-theme body.g3{background:radial-gradient(ellipse 80% 40% at 50% 100%,rgba(190,170,230,.14),transparent 70%),linear-gradient(#0a0612,#1d0c26 55%,#2a1012)!important}
html.hw-theme body.g3 #g3Bar{border-bottom-color:#e0802c!important;box-shadow:0 2px 14px rgba(240,138,36,.25)}
html.hw-theme body.g3 #g3Clock{background:linear-gradient(#ffd08a,#ffa64d)!important;color:#2a1206!important}
html.hw-theme body.g3 .recit{background:linear-gradient(#f6e6c6,#e8cc9a)!important}

/* bunting on top of the home screen */
html.hw-theme .hw-garl{position:absolute;left:-12px;right:-12px;top:-18px;height:46px;background:${svg(FL)} center top/100% 100% no-repeat;pointer-events:none;z-index:75;filter:drop-shadow(0 3px 3px #0007)}
html:not(.hw-theme) .hw-garl{display:none}
html.hw-theme .home-in{padding-top:28px!important}
/* jack-o'-lanterns sitting on the main card */
html.hw-theme .h2-hero::before{content:"";position:absolute;right:6px;bottom:4px;width:78px;height:44px;background:${IMG_PK?`url(${IMG_PK}) right bottom/44px no-repeat,url(${IMG_PK}) left 6px bottom/30px no-repeat`:svg(PUMP)+" 0 0/contain no-repeat"};z-index:4;pointer-events:none;filter:drop-shadow(0 0 8px rgba(255,140,40,.6))}
/* the main picture at night */
html.hw-theme .h2-art{position:relative}
html.hw-theme .h2-art::after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(40,10,70,.45),rgba(240,120,30,.25));mix-blend-mode:multiply;pointer-events:none}
html.hw-theme .h2-t,html.hw-theme .h2-hero h2{color:#8a2e05!important}
html.hw-theme .h2-daily{border-color:#e0802c!important;box-shadow:0 0 16px rgba(240,138,36,.3)!important}
/* game: glowing board */
html.hw-theme body.g3 #board::before{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 3px #e0802c,inset 0 0 26px rgba(240,138,36,.55);pointer-events:none;z-index:8}
html.hw-theme body.g3 #g3PanelHead b{color:#ffb347!important}
html.hw-theme body.g3 #board::after{content:"";position:absolute;right:0;top:0;width:46px;height:46px;background:${svg(WEB.replace(/#fff/g,"#5a2a10"))} 0 0/contain no-repeat;transform:scaleX(-1);pointer-events:none;opacity:.6;z-index:9}

html.hw-theme .home-t::after,html.hw-theme .home-logo h1::after{content:""!important;display:inline-block;width:1.05em;height:1.05em;margin-left:.25em;vertical-align:-.12em;background:${IMG_PK?`url(${IMG_PK})`:"none"} center/contain no-repeat}
`;
  document.head.appendChild(st);
  const s2=document.createElement("style");s2.textContent=`.hw-ci.hw-pk-img{width:48px;height:48px;flex:0 0 48px;font-size:0;background:${IMG_PK?`url(${IMG_PK})`:"none"} center/contain no-repeat}`;document.head.appendChild(s2);
  const hin=document.querySelector(".home-in")||document.body,ga=document.createElement("div");ga.className="hw-garl";hin.prepend(ga);
  const web=document.createElement("div");web.innerHTML=`<div class="hw-web l"></div><div class="hw-web r"></div>`;[...web.children].reverse().forEach(e=>hin.prepend(e));
  const gh=document.createElement("div");gh.className="hw-ghosts";(document.getElementById("home")||document.body).prepend(gh);gh.innerHTML=[["6%","62%",0],["58%","74%",7],["30%","48%",12]].map(([l,t,d])=>`<i style="left:${l};top:${t};animation-delay:-${d}s"></i>`).join("");
})();
