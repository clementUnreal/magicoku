# Korean + Japanese. Operates on `s` (whole built HTML); runs last.
import sys as _sys, json as _json, re as _re
_sys.path.insert(0, '../i18n')
from jsparse import calls as _calls
from data import D as _D, NAMES as _NM, RULES_KO, RULES_JA, TUTO_KO, TUTO_JA
from calls import T as _CT
import importlib, calls as _cm; importlib.reload(_cm); _CT = _cm.T

def _rep(old, new, count=1):
    global s
    assert old in s, old[:120]
    s = s.replace(old, new, count)

# --- 0. plural / counter phrases rewritten as whole phrases (before generic L rewriting)
_rep('(${S.hints} ${L(S.hints>1?"indices utilisés":"indice utilisé",S.hints>1?"hints used":"hint used")})',
     '(${L(`${S.hints} ${S.hints>1?"indices utilisés":"indice utilisé"}`,`${S.hints} ${S.hints>1?"hints used":"hint used"}`,`힌트 ${S.hints}개 사용`,`ヒント${S.hints}回使用`)})')
_rep('${m.people.length-1} ${L("suspects","suspects")}',
     '${L(`${m.people.length-1} suspects`,`${m.people.length-1} suspects`,`용의자 ${m.people.length-1}명`,`容疑者${m.people.length-1}人`)}')
_rep('💡 ${r.hints} ${L(r.hints>1?"indices":"indice",r.hints>1?"hints":"hint")}', '💡 ${NW(r.hints,"h")}')
_rep('💡 ${x.hints} ${L(x.hints>1?"indices":"indice",x.hints>1?"hints":"hint")}', '💡 ${NW(x.hints,"h")}')
_rep('${L("Bonjour","Hello")}, ${p.pseudo.replace(/[<>&]/g,"")} !',
     '${(n=>L(`Bonjour, ${n} !`,`Hello, ${n}!`,`안녕하세요, ${n}님!`,`こんにちは、${n}さん！`))(p.pseudo.replace(/[<>&]/g,""))}')
_rep('${x.solved} ${L("enquêtes résolues","cases solved")}',
     '${L(`${x.solved} enquêtes résolues`,`${x.solved} cases solved`,`사건 ${x.solved}개 해결`,`${x.solved}件解決`)}')
_rep('`${S.attempts||0} ${L((S.attempts||0)>1?"tentatives":"tentative",(S.attempts||0)>1?"attempts":"attempt")}`', 'NW(S.attempts||0,"a")')
_rep('`💡 ${nh} ${L(nh>1?"indices":"indice",nh>1?"hints":"hint")}`', '"💡 "+NW(nh,"h")')
_rep('var hintTxt=n=>`${n} ${L(n>1?"indices":"indice",n>1?"hints":"hint")}`;', 'var hintTxt=n=>NW(n,"h");')
_rep('<b>${a}</b> ${L(a>1?"tentatives":"tentative",a>1?"attempts":"attempt")}', '${NW(`<b>${a}</b>`,"a",a)}')
_rep('<b>${S.hints||0}</b> ${L((S.hints||0)>1?"indices":"indice",(S.hints||0)>1?"hints":"hint")}', '${NW(`<b>${S.hints||0}</b>`,"h",S.hints||0)}')

# --- 1. generic L(fr,en) -> L(fr,en,ko,ja)
_en_list = _json.load(open('../i18n/lcalls.json'))
_map = {en: _CT[i] for i, en in enumerate(_en_list)}
_edits = []
for st, args, end in _calls(s):
    if len(args) != 2: continue
    en = s[args[1][0]:args[1][1]].strip()
    if en not in _map: raise SystemExit("untranslated L(): " + en[:100])
    ko, ja = _map[en]
    _edits.append((end, "," + ko + "," + ja))
for pos, txt in sorted(_edits, reverse=True):
    s = s[:pos] + txt + s[pos:]

# --- 2. core helpers
_rep('const L=(fr,en)=>LANG==="en"?en:fr;', 'const L=(fr,en,ko,ja)=>LANG==="fr"?fr:LANG==="en"?en:LANG==="ko"?(ko??en):(ja??en);')
_dd = {k: list(v) for k, v in _D.items()}
_helpers = ('const LI=()=>LANG==="fr"?0:1;\n'
  'var DD=' + _json.dumps(_dd, ensure_ascii=False) + ';\n'
  'var NAMES=' + _json.dumps({k: list(v) for k, v in _NM.items()}, ensure_ascii=False) + ';\n'
  'function TX(a){if(!a)return "";if(LANG==="fr")return a[0];if(LANG==="en")return a[1];const i=LANG==="ko"?2:3;if(a[i]!=null)return a[i];const d=DD[a[1]];return d?d[i-2]:a[1]}\n'
  'function pp(w,a,b){const c=String(w).charCodeAt(String(w).length-1);return w+((c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28)?a:b)}\n'
  'function NW(n,k,num){const v=num==null?+n:num;return k==="h"?L(`${n} ${v>1?"indices":"indice"}`,`${n} ${v>1?"hints":"hint"}`,`힌트 ${n}개`,`ヒント${n}回`):L(`${n} ${v>1?"tentatives":"tentative"}`,`${n} ${v>1?"attempts":"attempt"}`,`시도 ${n}회`,`挑戦${n}回`)}\n'
  'RULES.ko=' + _json.dumps(RULES_KO, ensure_ascii=False) + ';RULES.ja=' + _json.dumps(RULES_JA, ensure_ascii=False) + ';\n')
_rep('const LI=()=>LANG==="en"?1:0;', _helpers)
# language detection
_rep('try{LANG=localStorage.getItem("crimes-mignons:lang")||((navigator.language||"fr").toLowerCase().startsWith("fr")?"fr":"en")}catch(e){LANG=(navigator.language||"fr").toLowerCase().startsWith("fr")?"fr":"en"}',
     'const _nl=()=>{const l=(navigator.language||"fr").toLowerCase();return l.startsWith("fr")?"fr":l.startsWith("ko")?"ko":l.startsWith("ja")?"ja":"en"};try{LANG=localStorage.getItem("crimes-mignons:lang")||_nl()}catch(e){LANG=_nl()}')
# arrays indexed by LI()
_rep('const prole=p=>M.people[p][2+LI()];', 'const prole=p=>TX([M.people[p][2],M.people[p][3]]);')
def _lifix(s):
    while '[LI()]' in s:
        j=s.index('[LI()]');i=j
        while True:
            if s[i-1]==']':
                d=0;k=i-1
                while True:
                    if s[k]==']':d+=1
                    elif s[k]=='[':
                        d-=1
                        if d==0:break
                    k-=1
                i=k;continue
            k=i
            while k>0 and (s[k-1].isalnum() or s[k-1] in '_$'):k-=1
            if k==i:break
            i=k
            if s[i-1]=='.':i-=1;continue
            break
        s=s[:i]+'TX('+s[i:j]+')'+s[j+6:]
    return s
s=_lifix(s)
assert '[LI()]' not in s, s[s.index('[LI()]')-80:s.index('[LI()]')+10]
_rep('const pname=p=>M.people[p][0];', 'const pname=p=>{const n=M.people[p][0];return (LANG==="ko"||LANG==="ja")&&NAMES[n]?NAMES[n][LANG==="ko"?0:1]:n};')
_rep('const ini=p=>pname(p).replace(', 'const ini=p=>M.people[p][0].replace(')
s = s.replace('pname(a).localeCompare(pname(b))', 'M.people[a][0].localeCompare(M.people[b][0])')
_rep('if(LANG==="en")switch(k){', 'if(LANG!=="fr")switch(k){')  # clueText fallback to English
_rep('pname(p).replace(/^(Pr|Sir|Maître|Dame|Dr) /,"")', 'pname(p).replace(/^(Pr|Sir|Maître|Dame|Dr) /,"").replace(/ (교수|부인|선생)$/,"").replace(/(教授|夫人|先生)$/,"")')
# reveal sentence
_rep('<p>${LANG==="en"?`The ${prole(K)}',
     '<p>${LANG==="ko"?`${prole(K)} ${pp(pname(K),"은","는")} ${rm}에서 ${pp(pname(0),"과","와")} 단둘이 있었다. 범행 도구는 ${pp(TX(M.weapon),"이었다","였다")}.`:LANG==="ja"?`${prole(K)}の${pname(K)}は、${rm}で${pname(0)}と二人きりだった。凶器は${TX(M.weapon)}だった。`:LANG==="en"?`The ${prole(K)}')
# tutorial
_rep('let tStep=0;', 'TUTO.ko=' + _json.dumps(TUTO_KO, ensure_ascii=False) + ';TUTO.ja=' + _json.dumps(TUTO_JA, ensure_ascii=False) + ';\n'
  'TUTO.fr[1][1]="Le récit";TUTO.fr[1][2]="Le récit indique <b>où se trouvait chaque personne</b>. Touche un portrait pour surligner son paragraphe. La victime est en rouge.";'
  'TUTO.en[1][1]="The story";TUTO.en[1][2]="The story tells you <b>where each person was</b>. Tap a portrait to highlight their paragraph. The victim is in red.";\nlet tStep=0;')
# language buttons (header + options)
_rep('<button id="lFR">FR</button><button id="lEN">EN</button>', '<button id="lFR">FR</button><button id="lEN">EN</button><button id="lKO">한</button><button id="lJA">日</button>')
_rep('<button id="oFR">Français</button><button id="oEN">English</button>', '<button id="oFR">Français</button><button id="oEN">English</button><button id="oKO">한국어</button><button id="oJA">日本語</button>')
_rep('$("#lFR").setAttribute("aria-pressed",LANG==="fr");$("#lEN").setAttribute("aria-pressed",LANG==="en");',
     '["fr","en","ko","ja"].forEach(l=>$("#l"+l.toUpperCase()).setAttribute("aria-pressed",LANG===l));document.documentElement.lang=LANG;{const b=$("#bMenu");if(b)b.textContent="☰ "+L("Menu","Menu","메뉴","メニュー")}')
_rep('$("#oFR").setAttribute("aria-pressed",LANG==="fr");$("#oEN").setAttribute("aria-pressed",LANG==="en");',
     '["fr","en","ko","ja"].forEach(l=>$("#o"+l.toUpperCase()).setAttribute("aria-pressed",LANG===l));')
_rep('$("#lEN").onclick=()=>{LANG="en";try{localStorage.setItem("crimes-mignons:lang","en")}catch(e){}renderStatic();renderBoard();render()};',
     '$("#lEN").onclick=()=>{LANG="en";try{localStorage.setItem("crimes-mignons:lang","en")}catch(e){}renderStatic();renderBoard();render()};\n'
     '["ko","ja"].forEach(l=>{$("#l"+l.toUpperCase()).onclick=()=>{LANG=l;try{localStorage.setItem("crimes-mignons:lang",l)}catch(e){}renderStatic();renderBoard();render()}});')
_rep('else if(t.id==="oFR"||t.id==="oEN"){(t.id==="oFR"?$("#lFR"):$("#lEN")).click();renderHome()}',
     'else if(/^o(FR|EN|KO|JA)$/.test(t.id)){$("#l"+t.id.slice(1)).click();renderHome()}')
# CJK story
_rep('function storyHTML(){\n  if(!FLOUR||!LEADS||!DE)return "";','function storyHTML(){\n  if(LANG==="ko"||LANG==="ja")return storyCJK();\n  if(!FLOUR||!LEADS||!DE)return "";')
_i = s.rindex('</script>')
s = s[:_i] + open('../i18n/story_cjk.js').read() + s[_i:]
s = s.replace('</style>', '.lang2{flex-wrap:wrap}\n:lang(ko) .recit,:lang(ja) .recit{font-size:16px;line-height:1.7;word-break:keep-all}\n</style>', 1)
