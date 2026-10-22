import json,re,random
TN={"salon":(["le Salon","the Parlour"],["#8d2130","#9d2b3b"]),"biblio":(["la Bibliothèque","the Library"],["#a68ccb","#b39bd5"]),
 "potions":(["la Salle des potions","the Potions Room"],["#4f9c9c","#5caaa9"]),"serre":(["la Serre","the Greenhouse"],["#8fae7c","#9dba8a"]),
 "bain":(["la Salle de bain","the Bathroom"],["#a8c2dc","#bad0e6"]),"musique":(["le Salon de musique","the Music Room"],["#6b4b9c","#7d5cae"]),
 "etude":(["le Cabinet d'étude","the Study"],["#9a7350","#ab8460"]),"dortoir":(["le Dortoir","the Dormitory"],["#c98f9a","#d6a0aa"]),
 "hall":(["le Grand hall","the Great Hall"],["#e8b06c","#efbe82"]),"grenier":(["le Grenier","the Attic"],["#8a6a4a","#9a7a58"]),
 "lune":(["la Salle de la Lune","the Moon Hall"],["#d9d2bd","#e6e0cc"]),"boudoir":(["le Boudoir","the Boudoir"],["#eaa98b","#f2bba0"])}
TITLES={"f":[("La Tour du Hibou","The Owl Tower"),("Le Petit Cloître","The Little Cloister"),("La Maison du Jardinier","The Gardener's Cottage"),("L'Aile des Élèves","The Students' Wing"),("Le Pavillon des Lucioles","The Firefly Pavilion"),("La Tour de l'Horloge","The Clock Tower"),("Le Moulin Enchanté","The Enchanted Mill"),("Les Appartements du Concierge","The Caretaker's Rooms"),("La Maison de Thé","The Tea House")],
 "m":[("Les Cuisines Hantées","The Haunted Kitchens"),("La Bibliothèque Interdite","The Forbidden Library"),("L'Observatoire","The Observatory"),("Les Dortoirs du Nord","The North Dormitories"),("L'Aile des Professeurs","The Teachers' Wing"),("La Volière","The Owlery"),("Le Musée des Sortilèges","The Spell Museum"),("Les Bains de Brume","The Mist Baths"),("Le Théâtre de Minuit","The Midnight Theatre")],
 "d":[("Les Cachots","The Dungeons"),("La Crypte des Fondateurs","The Founders' Crypt"),("Le Labyrinthe de Verre","The Glass Labyrinth"),("La Tour Effondrée","The Fallen Tower"),("Le Palais d'Hiver","The Winter Palace"),("Les Archives Secrètes","The Secret Archives"),("Le Bal des Spectres","The Ghosts' Ball"),("Le Cœur du Château","The Castle's Heart"),("La Nuit du Solstice","The Solstice Night")]}
TITLES['f'].append(("Le Grand Examen","The Great Exam"));TITLES['m'].append(("La Salle des Miroirs","The Hall of Mirrors"));TITLES['d'].append(("Le Cœur de Brumelune","The Heart of Brumelune"))
WEAP=[("avec une plume empoisonnée","with a poisoned quill"),("avec un sablier ensorcelé","with a cursed hourglass"),("avec une citrouille explosive","with an exploding pumpkin"),
 ("avec un balai détraqué","with a runaway broomstick"),("avec un grimoire très lourd","with a very heavy grimoire"),("avec une tasse de thé soporifique","with a sleeping-draught tea"),
 ("avec un hibou mal dressé","with a badly trained owl"),("avec une boule de cristal","with a crystal ball"),("avec un chaudron renversé","with an upturned cauldron"),
 ("avec un sort de Gel Éternel","with an Eternal Frost spell"),("avec une mandragore hurlante","with a shrieking mandrake"),("avec un chandelier en argent","with a silver candlestick"),
 ("avec une baguette trafiquée","with a tampered wand"),("avec un parchemin piégé","with a booby-trapped scroll"),("avec un gâteau à la potion","with a potion-laced cake")]
VICT=[["Pr Violette","f","doyenne de l'académie","dean of the academy",["#f6d2b8","#e9e6f0","bun","glasses","#e2d6f3"],"granny"],
 ["Dame Valentine","f","intendante","steward",["#8c5a3c","#e9e6f0","bun","glasses","#c9cfe6"],"valentine"],
 ["Maître Vitriol","m","maître des potions","potions master",["#f3d0b4","#1f1622","long","beard","#c8dccf"],"vitriol"]]
SUS=[["Ambroise","m","gardien des clés","keeper of keys",["#f1cdb0","#6b4a2b","short","stache","#cfe0c8"],"stache"],
 ["Basile","m","élève de 1re année","first-year student",["#f3d0b4","#c4622d","short","","#f6d9a8"],"ginger"],
 ["Capucine","f","préfète","prefect",["#a8714c","#1f1622","long","","#f2c6cf"],"witch"],
 ["Dahlia","f","jardinière des serres","greenhouse keeper",["#fbe0cc","#b4532a","bun","","#d3e6c2"],"redbun"],
 ["Elias","m","élève de 3e année","third-year student",["#8c5a3c","#2b1d14","short","","#f6e2a6"],"locs"],
 ["Flora","f","apprentie inventrice","apprentice inventor",["#fbe0cc","#b48ad6","bob","","#e6d6f3"],"flora"],
 ["Gaspard","m","garde-chasse","groundskeeper",["#f1cdb0","#3b2a1d","short","beard","#e8d6b8"],"gaspard"],
 ["Héloïse","f","astronome","astronomer",["#8c5a3c","#2a1a3f","bun","glasses","#d8cdef"],"heloise"]]
STORY=[("<b>{v}</b> a été retrouvé{e} immobile, une drôle d'odeur de soufre dans l'air. {k} personnes rôdaient dans {t} ce soir-là.","<b>{v}</b> was found motionless, a strange smell of sulphur in the air. {k} people were prowling {t} that evening."),
 ("En pleine nuit, <b>{v}</b> s'est effondré{e} sans un bruit. {k} suspects étaient encore éveillés dans {t}.","Late at night, <b>{v}</b> collapsed without a sound. {k} suspects were still awake in {t}."),
 ("On a retrouvé <b>{v}</b> endormi{e} pour toujours, un parchemin à moitié brûlé à la main. {k} personnes avaient accès {a}.","<b>{v}</b> was found asleep forever, a half-burnt scroll in hand. {k} people had access to {t}."),
 ("Les hiboux se sont tus d'un coup : <b>{v}</b> ne bougeait plus. {k} habitants {d} sont suspects.","The owls fell silent at once: <b>{v}</b> was no longer moving. {k} residents of {t} are suspects.")]

import sys as _s;_s.path.insert(0,'../i18n')
from data import D as _D,NAMES as _N
def _bat(w):
    c=ord(w[-1]);return 0xAC00<=c<=0xD7A3 and (c-0xAC00)%28!=0
STORY_KO=["<b>{v}</b>{ga} 꼼짝도 하지 않은 채 발견되었다. 공기 중에는 묘한 유황 냄새가 감돌았다. 그날 밤 {t}에서는 {k}이 서성이고 있었다.",
 "깊은 밤, <b>{v}</b>{ga} 소리 없이 쓰러졌다. {t}에는 용의자 {k}이 아직 깨어 있었다.",
 "<b>{v}</b>{ga} 반쯤 탄 양피지를 손에 쥔 채 영원한 잠에 빠진 모습으로 발견되었다. {t}에 드나들 수 있었던 사람은 {k}이다.",
 "부엉이들이 갑자기 조용해졌다. <b>{v}</b>{ga} 더 이상 움직이지 않았다. {t}의 주민 {k}이 용의자다."]
STORY_JA=["<b>{v}</b>が動かなくなっているのが見つかった。あたりには奇妙な硫黄のにおいが漂っていた。その夜、{t}には{k}人がうろついていた。",
 "真夜中、<b>{v}</b>が音もなく倒れた。{t}では、まだ{k}人の容疑者が起きていた。",
 "<b>{v}</b>が、半分焼けた羊皮紙を手にしたまま、永遠の眠りについているのが見つかった。{t}に出入りできたのは{k}人だ。",
 "フクロウたちが急に静まり返った。<b>{v}</b>はもう動かなかった。{t}の住人{k}人が容疑者だ。"]
KNUM=['','','두 명','세 명','네 명','다섯 명','여섯 명','일곱 명','여덟 명','아홉 명']
JNUM=['','','二','三','四','五','六','七','八','九']
def low(t):return t[0].lower()+t[1:] if not t.startswith("L'") else "l'"+t[2:]
def build(lid,d,idx):
    tier=lid[0];rng=random.Random(lid)
    v=VICT[{"f":0,"m":1,"d":2}[tier] if idx%3==0 else (idx+{"f":0,"m":1,"d":2}[tier])%3]
    n=len(d["rooms"]);people=[v]+SUS[:n-1]
    tfr,ten=TITLES[tier][idx];w=WEAP[(idx*3+{"f":0,"m":5,"d":10}[tier])%len(WEAP)];sf,se=STORY[(idx+len(tier))%len(STORY)]
    e="e" if v[1]=="f" else ""
    rooms={k:TN[t][0] for k,t in d["types"].items()};floors={k:TN[t][1] for k,t in d["types"].items()}
    # rugs: one in each room with a free 2x? block, decor only
    occ={(o[1],o[2]) for o in d["objs"]};rugs=[]
    for k in sorted(d["types"]):
        cells=[(r,c) for r in range(n) for c in range(n) if d["rooms"][r][c]==k]
        if len(cells)<6 or rng.random()<.4:continue
        for (r,c) in cells:
            blk=[(r+a,c+b) for a in range(2) for b in range(2)]
            if all(0<=x<n and 0<=y<n and d["rooms"][x][y]==k for x,y in blk):rugs.append([r,c,2,2]);break
    meta={"level":[{"f":"Facile","m":"Moyen","d":"Difficile"}[tier],{"f":"Easy","m":"Medium","d":"Hard"}[tier]],"title":[tfr,ten],
      "story":[sf.format(v=v[0],e=e,k=['','','Deux','Trois','Quatre','Cinq','Six','Sept','Huit','Neuf'][n-1],t=low(tfr),a=("au "+low(tfr)[3:]) if low(tfr).startswith("le ") else ("aux "+low(tfr)[4:]) if low(tfr).startswith("les ") else "à "+low(tfr),d=("du "+low(tfr)[3:]) if low(tfr).startswith("le ") else ("des "+low(tfr)[4:]) if low(tfr).startswith("les ") else "de "+low(tfr)),se.format(v=v[0],k=['','','Two','Three','Four','Five','Six','Seven','Eight','Nine'][n-1],t="the "+ten[4:] if ten.startswith("The ") else ten)],
      "weapon":list(w),"rooms":rooms,"floors":floors,"rugs":rugs,"people":people}
    si=(idx+len(tier))%len(STORY);vk,vj=_N[v[0]];tk,tj=_D[ten]
    meta["story"]+= [STORY_KO[si].format(v=vk,ga="이" if _bat(vk) else "가",t=tk,k=KNUM[n-1]),STORY_JA[si].format(v=vj,t=tj,k=JNUM[n-1])]
    return meta
