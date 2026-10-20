import json,re
from layouts import CASES
assets=json.load(open('../wiz/assets.json'))
out=[]
for c in CASES:
    d=json.load(open(f"out_{c['id']}.json"))[c['id']]
    out.append(dict(id=c['id'],rooms=c['rooms'],objs=[list(o) for o in c['objs']],windows=[],solution=d['solution'],clues=d['clues'],killer=d['killer']))
import os
from metagen import build as _mb
_base={o['id']:o for o in out};out=[];_extra={}
for tier,first in (("f","facile"),("m","moyen"),("d","difficile")):
    out.append(_base[first])
    for i in range(2,11):
        lid=f"{tier}{i}";p=f"lv/{lid}.json"
        if not os.path.exists(p):continue
        d=json.load(open(p));out.append(dict(id=lid,rooms=d['rooms'],objs=d['objs'],windows=[],solution=d['solution'],clues=d['clues'],killer=d['killer']))
        _extra[lid]=_mb(lid,d,i-2)
old=open('../mk/chunk_data_draw.js').read().split('\n')
helpers='\n'.join(old[65:107])  # LANG .. look
helpers=helpers.replace("if(WIN[r+\",\"+c])s.add(\"window\");","")
helpers=helpers.replace("OBJ[rr][cc]&&OBJ[rr][cc]!==OBJ[r][c])s.add","OBJ[rr][cc]&&OBJ[rr][cc]!==OBJ[r][c]&&room(rr,cc)===room(r,c))s.add")
assert "room(rr,cc)===room(r,c)" in helpers and "function face" in helpers and "const look" in helpers
_rush=[];_rmeta={}
import sys as _s2;_s2.path.insert(0,'../i18n')
from data import NAMES as _RN
for _i in range(1,11):
    _p=f"lv/u{_i}.json"
    if not os.path.exists(_p):continue
    _d=json.load(open(_p));_lid=f"u{_i}"
    _rush.append(dict(id=_lid,rooms=_d['rooms'],objs=_d['objs'],windows=[],solution=_d['solution'],clues=_d['clues'],killer=_d['killer']))
    _m=_mb(("f","m","d")[_i%3]+str(2+(_i%9)),_d,(_i*2)%9)
    _v=_m["people"][0];_f=_v[1]=="f";_vk,_vj=_RN[_v[0]]
    _ga="이" if (0xAC00<=ord(_vk[-1])<=0xD7A3 and (ord(_vk[-1])-0xAC00)%28) else "가"
    _m["level"]=["Défi chrono","Time trial","타임 챌린지","タイムチャレンジ"]
    _m["title"]=[f"Défi {_i}",f"Challenge {_i}",f"챌린지 {_i}",f"チャレンジ {_i}"]
    _m["story"]=[f"<b>{_v[0]}</b> vient de boire un poison lent ! Démasque le coupable en moins d'une minute pour obtenir l'antidote.",
      f"<b>{_v[0]}</b> has just drunk a slow poison! Unmask the culprit in under a minute to get the antidote.",
      f"<b>{_vk}</b>{_ga} 방금 천천히 퍼지는 독을 마셨다! 1분 안에 범인을 밝혀내 해독제를 손에 넣어라.",
      f"<b>{_vj}</b>が遅効性の毒を飲んでしまった！一分以内に犯人を暴いて、解毒剤を手に入れろ。"]
    _rmeta[_lid]=_m
head="const DATA="+json.dumps(out,ensure_ascii=False,separators=(',',':'))+";\n"+open('meta.js').read()+"\nObject.assign(META,"+json.dumps(_extra,ensure_ascii=False)+");\nconst RUSH_DATA="+json.dumps(_rush,ensure_ascii=False,separators=(',',':'))+";\nObject.assign(META,"+json.dumps(_rmeta,ensure_ascii=False)+");\n"+helpers+"\n"
head+="const POR="+open('portraits.json').read()+";\n"
head+=r'''const KNIFE=`<svg class="knife" viewBox="0 0 40 40"><g transform="rotate(-30 20 20)"><rect x="17" y="2" width="6" height="20" rx="2.5" fill="#dfe3ee" stroke="#2c1a33" stroke-width="1.2"/><rect x="14.5" y="21" width="11" height="3.2" rx="1.5" fill="#2c1a33"/><rect x="17.6" y="24" width="4.8" height="11" rx="2" fill="#8a5a33"/><circle cx="20" cy="8" r="2" fill="#b8283e"/></g></svg>`;
function ava(p,o={}){const k=M.people[p][5];if(k)return `<img class="pimg" src="${POR[k]}" alt="" draggable="false" style="background:${look(p)[4]}">`+(o.angry?KNIFE:"");return face(look(p),o)+(o.angry&&false?KNIFE:"")}
'''
head+="const SPR="+json.dumps(assets["sprites"])+";\n"
clue=open('../mk/chunk_clue.js').read()
clue=clue.replace('case "on":return {chair:`${Nm} was sitting in an armchair.`,bed:`${Nm} was lying on a bed.`,rug:`${Nm} was standing on a rug.`,bath:`${Nm} was in the bathtub.`}[v];','case "on":return `${Nm} was ${ONTXT[v][1]}.`;')
clue=clue.replace('case "on":return {chair:`${Nm} était ${fem(p,"assis","assise")} dans un fauteuil.`,bed:`${Nm} était ${fem(p,"allongé","allongée")} sur un lit.`,rug:`${Nm} était debout sur un tapis.`,bath:`${Nm} était dans la baignoire.`}[v];','case "on":return `${Nm} était ${ONTXT[v][0][fem(p,0,1)]}.`;')
assert clue.count("ONTXT")==2
s=open('../mk/ui.html').read()
s=re.sub(r'face\(look\((\w+)\),',r'ava(\1,',s.replace('__CHUNK_DATA_DRAW__','@@HEAD@@'));s=s.replace('@@HEAD@@',head).replace('__CHUNK_CLUE__',clue).replace('__CHUNK_DEDUCE__',open('../mk/chunk_deduce.js').read())
a=s.index('function renderBoard(){');b=s.index('function renderMarks(){')
s=s[:a]+open('renderboard.js').read()+s[b:]
a=s.index('function cellFromPoint(x,y){const plan');b=s.index('function bindPlan(){')
s=s[:a]+s[b:]
# legend with sprites
a=s.index('  const ic=t=>');b=s.index('  $("#story").innerHTML')
s=s[:a]+'''  const ok=`<span class="walk">✓</span>`,no=`<span class="nowalk">✕</span>`;
  $("#legend").innerHTML=["chair","trunk","bath","book","potion","shelf","cauldron","plant","desk","candle","mirror","gramo"].map(t=>`<span><img src="${SPR[t]}" alt="">${WALK.has(t)?ok:no} ${OBJN[t][LI()].replace(/^(une |un |le |la |a |an |the )/,"")}</span>`).join("");
'''+s[b:]
# tooltip position

s=s.replace('const ini=p=>pname(p).replace(/^(Dr|M\\.|Mme|Maître|Tante|Baron|Madame) /,"")[0];','const ini=p=>pname(p).replace(/^(Pr|Sir|Maître|Dr|Dame) /,"")[0];')
assert '(Pr|Sir|Maître|Dr|Dame)' in s
s=s.replace('<h1 id="h1"></h1><span class="case-title" id="caseTitle"></span>','<h1 id="h1"></h1><span class="case-title"><span data-t="school"></span> · <span id="caseTitle"></span></span>')
s=s.replace('const TXT={suspects:','const TXT={school:["Académie de Brumelune","Brumelune Academy"],suspects:')
s=s.replace("crimes-mignons3:","crimes-mignons-wiz:")
# CSS theme + board styles
css_old_a=s.index('.board{display:grid;');css_old_b=s.index('.status{')
s=s[:css_old_a]+'''.board{width:100%;max-width:700px;margin:0 auto;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.plan{position:relative;width:100%;aspect-ratio:1;touch-action:none}
.mapimg{position:absolute;inset:0;width:100%;height:100%;display:block;filter:saturate(.8) brightness(.9);pointer-events:none}
.layer{position:absolute;display:grid;inset:3.2%}
.cell{border:0;padding:0;margin:0;cursor:pointer;position:relative;min-width:0;min-height:0;box-shadow:inset 0 0 0 .7px rgba(40,20,20,.22)}\n.cell.void{background:transparent;box-shadow:none;cursor:default}\n.grid-shadow{}
.cell:focus-visible{outline:3px solid var(--sel);outline-offset:-4px;z-index:2}
.cell.blocked{cursor:default}
.obj{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
.obj .med{position:absolute;height:86%;aspect-ratio:1;max-width:86%;border-radius:50%;background:radial-gradient(circle,rgba(255,248,230,.95) 0 60%,rgba(255,240,210,.85) 100%);box-shadow:0 0 0 2px #b8913a,0 3px 8px rgba(0,0,0,.45)}
.cell.solid .obj .med{box-shadow:0 0 0 2px #8f2f3c,0 3px 8px rgba(0,0,0,.45)}
.obj img{position:relative;max-width:66%;max-height:66%;object-fit:contain;filter:drop-shadow(0 1px 0 rgba(0,0,0,.35))}
.marks{pointer-events:none}
.mk{position:relative;min-width:0;min-height:0}
.mk.hov{box-shadow:inset 0 0 0 3px var(--cherry)}
.mk.room{background:rgba(120,170,255,.2)}
.who{position:absolute;inset:-7%;z-index:5;animation:pop .25s ease-out;display:flex;align-items:center;justify-content:center}
.who .ph{position:relative;height:100%;aspect-ratio:1;max-width:100%;border-radius:12%;overflow:hidden;box-shadow:0 0 0 2.5px var(--wall),0 3px 0 2px rgba(42,24,48,.35)}
.who svg{width:100%;height:100%;display:block}
.who .ini{position:absolute;left:0;top:-8%;font:900 clamp(15px,3.4vw,26px)/1 var(--f-display);-webkit-text-stroke:3px #fff;paint-order:stroke fill;text-shadow:0 2px 0 rgba(0,0,0,.18)}
.mk.clash .who .ph{box-shadow:0 0 0 3px var(--cherry),0 0 10px 2px var(--cherry)}
.xm{position:absolute;inset:14%;display:flex;align-items:center;justify-content:center}
.xm svg{height:100%;aspect-ratio:1;max-width:100%;display:block;filter:drop-shadow(0 0 2px rgba(255,248,230,.9))}
.xm.auto{opacity:.85}
.xm.preview{opacity:.55}
.notes{position:absolute;inset:4%;display:flex;flex-wrap:wrap;align-content:flex-start;gap:1px 3px;z-index:3}
.notes span{font:900 clamp(11px,2.4vw,19px)/1 var(--f-display);-webkit-text-stroke:2.5px #fff;paint-order:stroke fill}
@property --a{syntax:"<angle>";inherits:false;initial-value:0deg}
.hold{position:absolute;inset:0;z-index:6;pointer-events:none;background:rgba(59,123,224,.0);animation:holdbg .5s linear forwards}
.hold::before{content:"";position:absolute;inset:0;padding:5px;border-radius:3px;background:conic-gradient(from -45deg,var(--sel) var(--a),rgba(59,123,224,.18) 0);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);animation:ring .5s linear forwards}
@keyframes ring{to{--a:360deg}}
@keyframes holdbg{to{background:rgba(59,123,224,.3)}}
.mk.flash{animation:flash 1.1s ease-out 2}
@keyframes flash{50%{box-shadow:inset 0 0 0 4px var(--gold)}}
@keyframes pop{from{transform:scale(.4)}to{transform:none}}
.rlabel{position:absolute;transform:translate(-50%,-50%);font:600 clamp(8px,1.6vw,13px)/1 var(--f-label);letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;
  background:#fbf2df;color:var(--wall);border:2px solid var(--wall);border-radius:999px;padding:2px 8px 3px;z-index:4;pointer-events:none;transition:background .15s,color .15s}
.rlabel.room{background:var(--sel);color:#fff;border-color:var(--sel)}
.edge{position:absolute;transform:translate(-50%,-50%);font:800 clamp(9px,1.6vw,13px)/1 var(--f-display);color:var(--soft);pointer-events:none;z-index:4}\n.edge.top{top:-2.6%}\n.edge.side{left:-2.4%}
.tip{position:absolute;transform:translate(-50%,-100%);background:var(--wall);color:#fff;font:800 11px var(--f-body);padding:2px 7px;border-radius:6px;pointer-events:none;z-index:7;white-space:nowrap}
'''+s[css_old_b:]
# remove old duplicated rules that now conflict (old .who/.mk etc. remain earlier? they were inside replaced block) 
s=s.replace(".legend svg{width:26px;height:26px;flex:0 0 auto;border-radius:4px;background:#f4e3d4}",".legend img{width:30px;height:30px;object-fit:contain;flex:0 0 auto}")
# palette
s=s.replace("--page:#f6e9ef; --paper:#fffafc; --ink:#2c1a33; --soft:#86708d; --line:#e6d2dd;","--page:#efe0c4; --paper:#fbf4e4; --ink:#2b1a33; --soft:#7d6672; --line:#dcc6a6;")
s=s.replace("--wall:#2a1830; --cherry:#d9334c; --cherry-soft:#fde1e6;","--wall:#3a2547; --cherry:#b8283e; --cherry-soft:#f6dcd2;")
s=s.replace("background-image:radial-gradient(circle at 1px 1px,rgba(44,26,51,.07) 1px,transparent 1.5px);background-size:18px 18px;","background-image:radial-gradient(ellipse at 20% 0%,rgba(255,250,235,.7),transparent 60%),radial-gradient(ellipse at 100% 100%,rgba(150,100,60,.18),transparent 55%);")
s=s.replace("<title>Crimes Mignons</title>","<title>Crimes Mignons</title>")
old_card='const cl=(C.clues[p]||[]).map(x=>`<div>${clueText(p,x).replace(/<b>[^<]*<\\/b>\\s*/,m=>m.replace(/<b>(.*)<\\/b>\\s*/,""))}</div>`)'
assert old_card in s
s=s.replace(old_card,'const cl=(C.clues[p]||[]).map(x=>`<div>${clueText(p,x).replace(/^<b>[^<]*<\\/b>/,LANG==="en"?fem(p,"He","She"):fem(p,"Il","Elle"))}</div>`)')
s=s.replace(".obj .med{position:absolute;height:86%;aspect-ratio:1;max-width:86%;",".obj .med{position:absolute;height:72%;aspect-ratio:1;max-width:72%;")
s=s.replace(".obj img{position:relative;max-width:66%;max-height:66%;",".obj img{position:relative;max-width:56%;max-height:56%;")
s=s.replace('$("#cards").innerHTML=M.people.map((pp,p)=>{','$("#cards").innerHTML=[...M.people.keys()].sort((a,b)=>(a===0)-(b===0)||pname(a).localeCompare(pname(b))).map(p=>{',1)
assert 'localeCompare' in s
s=s.replace('</style>','''.pimg{width:100%;height:100%;display:block;object-fit:cover;object-position:50% 0%}
.who .ph .pimg{transform:scale(1.12);transform-origin:50% 25%}
.reveal .big{position:relative;overflow:visible}
.reveal .big .pimg{border-radius:22px}
.knife{position:absolute;right:-34%;bottom:-4%;width:44%;height:44%;transform:rotate(18deg)}
.obj .med{display:none}
.obj{align-items:flex-end;padding-bottom:6%}
.obj .gs{position:absolute;bottom:8%;left:18%;right:18%;height:18%;border-radius:50%;background:radial-gradient(ellipse,rgba(20,8,24,.55),rgba(20,8,24,0) 70%)}
.obj img{position:relative;max-width:84%;max-height:84%;object-fit:contain;filter:drop-shadow(0 2px 0 rgba(20,8,24,.5)) drop-shadow(0 6px 5px rgba(20,8,24,.35))}
.obj.o-book img,.obj.o-potion img{max-width:58%;max-height:58%}
.obj.o-bath img,.obj.o-desk img,.obj.o-trunk img{max-width:92%}
.mapimg{filter:saturate(.62) brightness(.8) contrast(.92)}
.cell{box-shadow:inset 0 0 0 .6px rgba(255,244,220,.28)}
</style>''',1)
s=s.replace('</style>','''#grid{filter:drop-shadow(0 10px 14px rgba(40,20,20,.28))}
.walls{position:absolute;left:calc(3.2% - 93.6% * 20 / var(--wn));top:calc(3.2% - 93.6% * 20 / var(--wn));width:calc(93.6% * (1 + 40 / var(--wn)));height:calc(93.6% * (1 + 40 / var(--wn)));pointer-events:none;z-index:2;overflow:visible;filter:drop-shadow(0 3px 0 rgba(93,63,82,.9))}
.walls .w{stroke:#2a1824;stroke-linecap:square;fill:none}
.walls .post{fill:#2a1824}
.mapimg{display:none}
.board{padding:18px 0 0 14px}
</style>''',1)
s=s.replace('</style>','''.cell .obj{position:absolute;inset:0;display:flex;padding:2%;align-items:center;justify-content:center;pointer-events:none}
.cell .obj.at-t{align-items:flex-start}.cell .obj.at-b{align-items:flex-end}.cell .obj.at-l{justify-content:flex-start}.cell .obj.at-r{justify-content:flex-end}
.cell .obj .spr{position:relative;width:90%;height:90%;display:flex;align-items:flex-end;justify-content:center}
.cell .obj.at-t .spr{align-items:flex-start}
.cell .obj .spr img{position:relative;z-index:1;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;filter:drop-shadow(0 2px 0 rgba(20,8,24,.45))}
.cell .obj .spr::before{content:"";position:absolute;left:12%;right:12%;bottom:-2%;height:18%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(20,8,24,.5),rgba(20,8,24,0) 70%)}
.cell .obj.at-t .spr::before{bottom:auto;top:62%}
.cell .obj.o-book .spr{width:58%;height:58%;align-items:center}
.cell .obj.o-potion .spr{width:46%;height:52%}
.cell .obj.o-potion.center .spr::after{content:"";position:absolute;left:4%;right:4%;bottom:-10%;height:30%;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#d8d2cc 0 45%,#9d948e 60%,rgba(0,0,0,0) 72%)}
.cell .obj.o-shelf .spr,.cell .obj.o-desk .spr{width:98%;height:88%}
.cell .obj.o-bath .spr{width:98%;height:86%}
.cell .obj.o-mirror .spr{width:62%;height:86%}
.cell .obj.o-plant .spr,.cell .obj.o-candle .spr{width:80%;height:90%}
.cell .obj.flip img{transform:scaleX(-1)}
</style>''',1)
s=s.replace('</style>','''.rugs{position:absolute;inset:3.2%;width:93.6%;height:93.6%;pointer-events:none;z-index:1}
.objs{pointer-events:none;z-index:1}
.oc{position:relative;min-width:0;min-height:0}
.cell .obj,.oc .obj{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
.oc .obj.at-t{align-items:flex-start}.oc .obj.at-b{align-items:flex-end}.oc .obj.at-l{justify-content:flex-start}.oc .obj.at-r{justify-content:flex-end}
.oc .obj .spr{position:relative;width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center}
.oc .obj.at-t .spr{align-items:flex-start}
.oc .obj .spr img{position:relative;z-index:1;max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 2px 0 rgba(20,8,24,.45))}
.oc .obj .spr::before{content:"";position:absolute;left:12%;right:12%;bottom:-2%;height:18%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(20,8,24,.5),rgba(20,8,24,0) 70%)}
.oc .obj.at-t .spr::before{bottom:auto;top:62%}
.oc .obj.o-book .spr{width:62%;height:62%;align-items:center}
.oc .obj.o-potion .spr{width:52%;height:58%}
.oc .obj.o-potion.center .spr::after{content:"";position:absolute;left:4%;right:4%;bottom:-10%;height:30%;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#d8d2cc 0 45%,#9d948e 60%,rgba(0,0,0,0) 72%)}
.oc .obj.o-mirror .spr{width:70%}
.oc .obj.o-plant .spr,.oc .obj.o-candle .spr{width:88%}
.oc .obj.flip img{transform:scaleX(-1)}
.walls{z-index:2}.marks{z-index:3}
</style>''',1)
old_x='const XSVG=`<svg viewBox="0 0 10 10"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="#1b0f20" stroke-width="2.1" stroke-linecap="round"/></svg>`;'
assert old_x in s
s=s.replace(old_x,open('xsvg.txt').read().strip()).replace('</style>',open('xcss.css').read()+'</style>',1)
exec(open('patch_sk.py').read())
exec(open('patch_theme.py').read())
exec(open('patch_extra.py').read())
exec(open('patch_noauto.py').read())
exec(open('patch_menu.py').read())
exec(open('patch_lv2.py').read())
exec(open('patch_timer.py').read())
exec(open('patch_story.py').read())
exec(open('patch_i18n.py').read())
_i=s.rindex('</script>');s=s[:_i]+open('verdict.js').read()+open('kw.js').read()+open('news.js').read()+open('hint2.js').read()+open('nav.js').read()+open('rules2.js').read()+open('rush.js').read()+'\nrender();\n'+s[_i:]
s=s.replace('</style>',open('kw.css').read()+open('news.css').read()+open('hint2.css').read()+open('nav.css').read()+open('rush.css').read()+'</style>',1)
s=s.replace('</style>',open('verdict.css').read()+'</style>',1)
open('../crimes-mignons.html','w').write(s)
print(len(s)//1024,"KB")
