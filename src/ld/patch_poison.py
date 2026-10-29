# Store-friendly wording: nobody dies in Magicoku. The victim has been POISONED (magic potions),
# the player finds who poisoned them. Applied last on the assembled page, every replacement is checked.
import re as _rp

def _R(old, new, mn=1):
    global s
    n = s.count(old)
    assert n >= mn, ("patch_poison: not found", old[:80])
    s = s.replace(old, new)

def _X(pat, rep, mn=1):
    global s
    s, n = _rp.subn(pat, rep, s)
    assert n >= mn, ("patch_poison: regex not found", pat[:80])

# ---------- poison delivery instead of "weapons" (fr, en, ko, ja) ----------
_W = [
    (("avec une plume empoisonnée", "with a poisoned quill", "독 묻은 깃펜", "毒を塗った羽根ペン"),
     ("avec une plume à l'encre ensorcelée", "with a quill of bewitched ink", "마법 잉크를 묻힌 깃펜", "魔法のインクの羽根ペン")),
    (("avec une mandragore hurlante", "with a shrieking mandrake", "비명을 지르는 맨드레이크", "叫ぶマンドレイク"),
     ("avec une infusion de mandragore", "with a mandrake infusion", "맨드레이크 차", "マンドレイクの煎じ薬")),
    (("avec un balai détraqué", "with a runaway broomstick", "고장 난 빗자루", "暴れ箒"),
     ("avec des bonbons ensorcelés", "with bewitched sweets", "마법에 걸린 사탕", "魔法をかけたキャンディ")),
    (("avec un hibou mal dressé", "with a badly trained owl", "훈련이 덜 된 부엉이", "しつけの悪いフクロウ"),
     ("avec une lettre au parfum étrange", "with a strangely scented letter", "이상한 향이 나는 편지", "妙な香りのする手紙")),
    (("avec une baguette trafiquée", "with a tampered wand", "조작된 지팡이", "細工された杖"),
     ("avec un flacon de parfum trafiqué", "with a tampered perfume bottle", "조작된 향수병", "細工された香水瓶")),
    (("avec un sort de Gel Éternel", "with an Eternal Frost spell", "영원한 서리 주문", "永遠の霜の呪文"),
     ("avec une potion de Gel Éternel", "with an Eternal Frost potion", "영원한 서리 물약", "永遠の霜の魔法薬")),
    (("avec une boule de cristal", "with a crystal ball", "수정 구슬", "水晶玉"),
     ("avec une fiole de poudre de lune", "with a vial of moon dust", "달가루가 든 약병", "月の粉の小瓶")),
    (("avec un parchemin piégé", "with a booby-trapped scroll", "함정이 숨겨진 두루마리", "罠を仕掛けた巻物"),
     ("avec un parchemin à l'encre verdâtre", "with a scroll in greenish ink", "초록빛 잉크로 쓴 두루마리", "緑がかったインクの巻物")),
    (("avec un grimoire très lourd", "with a very heavy grimoire", "아주 무거운 마법서", "とても重い魔導書"),
     ("avec une soupe aux champignons douteux", "with a dubious mushroom soup", "수상한 버섯 수프", "怪しいキノコのスープ")),
    (("avec un chandelier en argent", "with a silver candlestick", "은촛대", "銀の燭台"),
     ("avec un chocolat chaud trafiqué", "with a tampered hot chocolate", "조작된 핫초코", "細工されたホットチョコレート")),
    (("avec le chandelier en argent", "with the silver candlestick"),
     ("avec le chocolat chaud trafiqué", "with the tampered hot chocolate")),
    (("avec une potion de Sommeil Éternel", "with a Draught of Eternal Sleep", "영원한 잠의 물약", "永遠の眠りの薬"),
     ("avec une potion de Sommeil Profond", "with a Draught of Deep Sleep", "깊은 잠의 물약", "深い眠りの薬")),
    (("avec le gramophone ensorcelé", "with the bewitched gramophone", "마법에 걸린 축음기", "呪われた蓄音機"),
     ("avec la tisane du soir", "with the evening herbal tea", "저녁 허브차", "夜のハーブティー")),
    (("avec un sablier ensorcelé", "with a cursed hourglass", "저주받은 모래시계", "呪われた砂時計"),
     ("avec un bonbon à la belladone", "with a belladonna sweet", "벨라돈나 사탕", "ベラドンナのキャンディ")),
    (("avec une citrouille explosive", "with an exploding pumpkin", "폭발하는 호박", "爆発するカボチャ"),
     ("avec une tarte à la citrouille trafiquée", "with a tampered pumpkin pie", "조작된 호박 파이", "細工されたカボチャパイ")),
    (("avec un chaudron renversé", "with an upturned cauldron", "뒤집힌 가마솥", "ひっくり返った大釜"),
     ("avec un bouillon de chaudron trafiqué", "with a tampered cauldron broth", "조작된 가마솥 수프", "細工された大釜のスープ")),
]
for _o, _n in _W:
    for _a, _b in zip(_o, _n):
        s = s.replace('"' + _a + '"', '"' + _b + '"')

# ---------- case intros: the victim is poisoned, never dead ----------
_FEM = ("Violette", "Valentine")
def _g(name, m, f):
    return f if any(x in name for x in _FEM) else m

# fr
_X(r"a été retrouvé(e?) immobile, une drôle d'odeur", r"a été retrouvé\1 empoisonné\1, une drôle d'odeur")
_X(r"(<b>([^<]*)</b>) ne bougeait plus\.", lambda m: m.group(1) + " venait d'être " + _g(m.group(2), "empoisonné", "empoisonnée") + ".")
_X(r"s'est effondré(e?) sans un bruit\.", r"s'est effondré\1 sans un bruit, empoisonné\1.")
_X(r"On a retrouvé (<b>[^<]*</b>) endormi(e?) pour toujours,", r"On a retrouvé \1 plongé\2 dans un sommeil empoisonné,")
_X(r"a été retrouvé(e?) sans vie", r"a été retrouvé\1 empoisonné\1")
# en
_R("was found motionless,", "was found poisoned,")
_R("was no longer moving.", "had just been poisoned.")
_R("collapsed without a sound.", "collapsed without a sound, poisoned.")
_R("was found asleep forever,", "was found in a poisoned sleep,")
_R("was found lifeless.", "was found poisoned.")
# ko
_R("꼼짝도 하지 않은 채 발견되었다.", "독에 중독된 채 발견되었다.")
_R("더 이상 움직이지 않았다.", "독에 당해 쓰러져 있었다.")
_R("더 이상 움직이지 않는다.", "독에 당해 쓰러져 있다.", 0)
_R("소리 없이 쓰러졌다.", "독에 당해 소리 없이 쓰러졌다.")
_R("영원한 잠에 빠진 모습으로 발견되었다.", "독 때문에 깊은 잠에 빠진 모습으로 발견되었다.")
_R("숨진 채 발견되었다.", "독에 중독된 채 발견되었다.")
# ja
_R("が動かなくなっているのが見つかった。", "が毒を盛られて倒れているのが見つかった。")
_R("はもう動かなかった。", "は毒を盛られて倒れていた。")
_R("が音もなく倒れた。", "が毒を盛られ、音もなく倒れた。")
_R("永遠の眠りについているのが見つかった。", "毒で深い眠りに落ちているのが見つかった。")
_R("が息絶えているのが見つかった。", "が毒を盛られて倒れているのが見つかった。")

# the three tutorial cases
_R("a été retrouvée endormie pour toujours, son thé", "a été retrouvée empoisonnée, son thé")
_R("가 영원한 잠에 빠진 채 발견되었다.", "가 독에 중독된 채 발견되었다.")
_R("ne fera plus jamais l'inventaire des chandeliers.", "a été empoisonnée en faisant l'inventaire des chandeliers.")
_R("will never count the candlesticks again.", "was poisoned while counting the candlesticks.")
_R("집사 <b>발랑틴 부인</b>은 이제 다시는 촛대를 세지 못할 것이다.", "집사 <b>발랑틴 부인</b>이 촛대를 세다가 독에 당했다.")
_R("執事の<b>ヴァランティーヌ夫人</b>が燭台を数えることは、もう二度とない。", "執事の<b>ヴァランティーヌ夫人</b>が、燭台を数えている最中に毒を盛られた。")
_R("mais lui ne bouge plus.", "mais lui vient de s'effondrer, empoisonné.")
_R("but he no longer moves.", "but he has just collapsed, poisoned.")
_R("でも、先生はもう動かない。", "でも、先生は毒を盛られて倒れている。")

# ---------- end-of-case reveal ----------
_R("The crime was committed ${M.weapon[1]}.", "${pname(0)} was poisoned ${M.weapon[1]}.")
_R("Le crime a été commis ${M.weapon[0]}.", "${pname(0)} a été ${fem(0,\"empoisonné\",\"empoisonnée\")} ${M.weapon[0]}.")
_R("범행 도구는 ${pp(TX(M.weapon),\"이었다\",\"였다\")}.", "독이 숨겨져 있던 것은 ${pp(TX(M.weapon),\"이었다\",\"였다\")}.")
_R("凶器は${TX(M.weapon)}だった。", "毒が仕込まれていたのは${TX(M.weapon)}だった。")

# ---------- rules, tutorial, narration: "murderer" / "crime" -> culprit / poisoning ----------
_R("Un crime a eu lieu.", "Quelqu'un a été empoisonné.")
_R("A crime has happened.", "Someone has been poisoned.")
_R("Le drame s'est produit à", "L'empoisonnement a eu lieu à")
_R("Au moment du drame, ", "Au moment de l'empoisonnement, ")
_R("At the moment of the crime, ", "At the moment of the poisoning, ")
_R("The crime happened at", "The poisoning happened at")
_R("Règle du meurtrier", "Règle du coupable")
_R("Murderer rule", "Culprit rule")
_R("meurtrier", "coupable")
_R("Meurtrier", "Coupable", 0)
_R("murderer", "culprit")
_R("Murderer", "Culprit", 0)

# ---------- robustness (applied here, after i18n): a clue type without text must not break render ----------
_R('clueText(S.sel,x).replace', 'String(clueText(S.sel,x)||"").replace')

# ---------- Halloween event: the ghost may float over furniture (only while the ghost is the selected person) ----------
_R('const blocked=(r,c)=>OBJ[r][c]&&!WALK.has(OBJ[r][c]);', 'var blocked=(r,c)=>OBJ[r][c]&&!WALK.has(OBJ[r][c])&&!(typeof HW!=="undefined"&&HW.on&&C&&C.ghost!=null&&S&&S.sel===C.ghost&&OBJ[r][c]!=="void"&&OBJ[r][c]!=="poison");')

# ---------- French elision on the reveal: "L'élève de 1re année était seul…" (not "Le élève") ----------
_R('${fem(K,"Le","La")} ${prole(K)} était', '${(r=>/^[aeiouyhàâéèêëîïôûœ]/i.test(r)?"L\'"+r:fem(K,"Le","La")+" "+r)(prole(K))} était')
