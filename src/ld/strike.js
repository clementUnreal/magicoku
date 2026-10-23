
/* ================= strike out a suspect's paragraph once they are placed ================= */
(function(){
  const css=document.createElement("style");
  css.textContent=`.recit p.can-strike{position:relative;padding-right:34px;cursor:pointer}
.recit p .stk{position:absolute;right:2px;top:3px;width:26px;height:26px;border-radius:50%;border:1.5px solid #b08a3e;background:#fff8e6;color:#7a5a1e;font:700 13px/1 system-ui,sans-serif;display:grid;place-items:center;cursor:pointer;padding:0;box-shadow:0 1px 3px rgba(80,50,10,.25);transition:transform .15s,background .15s}
.recit p .stk:hover{transform:scale(1.1);background:#ffeec2}
.recit p.struck{text-decoration:line-through;text-decoration-color:#8a6a3a;text-decoration-thickness:2px;opacity:.5}
.recit p.struck .stk{opacity:1;background:#e9dcc0}`;
  document.head.appendChild(css);
  const tip=on=>on?L("Ne plus barrer","Unstrike","줄 지우기 취소","取り消し線を外す"):L("Barrer ce texte","Strike out this text","이 글에 줄 긋기","この文に取り消し線を引く");
  function decorate(){
    const st=S.strike||(S.strike={});
    document.querySelectorAll(".recit p[data-p]").forEach(el=>{
      const p=+el.dataset.p,placed=!!(S.place&&S.place[p]);
      if(!placed&&st[p])delete st[p];
      const on=placed&&!!st[p];
      el.classList.toggle("can-strike",placed);el.classList.toggle("struck",on);
      let b=el.querySelector(".stk");
      if(placed){if(!b){b=document.createElement("button");b.type="button";b.className="stk";el.appendChild(b)}
        b.textContent=on?"↺":"✓";b.title=tip(on);b.setAttribute("aria-label",tip(on))}
      else if(b)b.remove();
    });
  }
  function toggle(p){S.strike=S.strike||{};if(S.strike[p])delete S.strike[p];else S.strike[p]=1;try{save()}catch(_){}decorate();try{play("select")}catch(_){}}
  const _rc=renderCards;renderCards=function(){const r=_rc.apply(this,arguments);try{decorate()}catch(_){}return r};
  /* tap the ✓ button, or tap the plain text of a placed suspect's paragraph */
  document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;
    const b=t.closest(".recit .stk");
    if(b){e.preventDefault();e.stopPropagation();toggle(+b.closest("p").dataset.p);return}
    if(t.matches&&t.matches(".recit p.can-strike")){toggle(+t.dataset.p)}},true);
  try{decorate()}catch(_){}
})();
