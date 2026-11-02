import random,sys
sys.path.insert(0,'../ld');sys.path.insert(0,'../i18n')
import metagen as MG
from envrt import ENVS
from envtext import CH,SHORT,ROOMS,TITLES,TITLES2
from data import NAMES as _N, D as _D
PLACE={"forest":("la Forêt des Murmures","the Whispering Forest"),"station":("la Gare de Brumeval","Brumeval Station"),"bank":("la Banque des Profondeurs","the Bank of the Depths"),
 "alley":("la Ruelle des Marchands","Merchants' Lane"),"village":("le Village de Givrelune","the Village of Frostmoon"),"lake":("le Lac aux Sirènes","the Mermaids' Lake"),
 "stadium":("le Stade des Balais","the Broomstick Stadium"),"hospital":("l'Hospice des Sortilèges","the Spell Infirmary"),"ministry":("le Ministère des Enchantements","the Ministry of Enchantments"),
 "fortress":("la Forteresse des Brumes","the Fortress of Mists")}
# season 2 floor palettes (chapters 11-20), 8 colours each
PAL2=[["#4a5a6e","#3e5c5a","#5b4d6e","#6b6f7c","#2f4a55","#556b5e","#7a8aa0","#4d4459"],   # 11 haunted fortress
 ["#c27b3a","#a85a2e","#d1a050","#8c6b3c","#b8873f","#9c4f2a","#c9a46a","#7d5a32"],        # 12 autumn forest
 ["#e8e4dc","#3a3a44","#c9c2b4","#5a4f7a","#2f3d63","#b7b0a2","#8c2f3c","#d9d3c5"],        # 13 chessboard ministry
 ["#f2c6d2","#d9b8e8","#f3dfb0","#c7e0f2","#e8a8b8","#bfa2d6","#f6e9d0","#a9cfe0"],        # 14 frostmoon ball
 ["#2f7a5a","#c9a640","#1f5a4a","#a8893a","#3e8f6d","#d6bb63","#275247","#8c7a3c"],        # 15 emerald and gold bank
 ["#1f3a5a","#2f6d6a","#3a2f5a","#1f5a3a","#4a4f7a","#2a4a6e","#5a3a6e","#23505a"],        # 16 stadium by night
 ["#bfe3c8","#e6f2e2","#c9d8f0","#d8ecd0","#a9d8c0","#e9e0f2","#cfe8d8","#b8d0e0"],        # 17 herbal infirmary
 ["#3a2a5a","#5a3a2a","#2a3a5a","#6a4a2a","#4a2a4a","#2a4a4a","#5a4a6a","#6a3a3a"],        # 18 night market
 ["#7a2a2a","#8a5a3a","#6a3a3a","#a07a4a","#5a3a5a","#8a6a3a","#6a2a3a","#9a7a5a"],        # 19 train carriages
 ["#f6c7a8","#a8dce0","#f2d6e6","#c8e6c8","#ffe1a8","#b8d4f0","#e8c8e8","#9fd0c8"]]        # 20 lake at dawn
def build(lid,d,c,k):
    env=d.get("env") if c>=10 else ENVS[c];rng=random.Random(lid);n=len(d["rooms"])
    v=MG.VICT[(c+k)%3];people=[v]+MG.SUS[:n-1]
    R=ROOMS[env];rooms={kk:list(R[t][:4]) for kk,t in d["types"].items()};floors={kk:list(R[t][4:6]) for kk,t in d["types"].items()}
    if c>=10:  # season 2: same places, new colours (one palette per chapter, the same colour for the same kind of room)
        pal=PAL2[c-10];tl=sorted(R.keys())
        def li(h,f=1.08):
            n_=int(h[1:],16);r_,g_,b_=n_>>16,n_>>8&255,n_&255;return "#%02x%02x%02x"%(min(255,int(r_*f)),min(255,int(g_*f)),min(255,int(b_*f)))
        floors={kk:[pal[tl.index(t)%len(pal)],li(pal[tl.index(t)%len(pal)])] for kk,t in d["types"].items()}
    # big levels can use the same room type twice: the second one becomes its "annex", with its own name and a shifted floor colour
    seen={}
    for kk in sorted(d["types"]):
        t=d["types"][kk]
        if t in seen:
            fr,en,ko,ja=rooms[kk]
            de=("du "+fr[3:]) if fr.startswith("le ") else ("des "+fr[4:]) if fr.startswith("les ") else ("de "+fr)
            rooms[kk]=["l'Annexe "+de,en+" Annex" if not en.lower().startswith("the ") else "the "+en[4:]+" Annex",ko+" 별관",ja+"別館"]
            def sh(h,f=.86):
                n=int(h[1:],16);r,g,b=n>>16,n>>8&255,n&255;return "#%02x%02x%02x"%(min(255,int(r*f)),min(255,int(g*f)),min(255,int(b*f)))
            floors[kk]=[sh(x) for x in floors[kk]]
        seen[t]=kk
    rugs=[]
    for kk in sorted(d["types"]):
        cells=[(r,cc) for r in range(n) for cc in range(n) if d["rooms"][r][cc]==kk]
        if len(cells)<6 or rng.random()<.4:continue
        for (r,cc) in cells:
            blk=[(r+a,cc+b) for a in range(2) for b in range(2)]
            if all(0<=x<n and 0<=y<n and d["rooms"][x][y]==kk for x,y in blk):rugs.append([r,cc,2,2]);break
    pfr,pen=PLACE[env];cp=ENVS.index(env);pko=CH[cp][2].split(" · ")[1];pja=CH[cp][3].split("・",1)[1]
    si=(c*3+k)%len(MG.STORY);sf,se=MG.STORY[si];e="e" if v[1]=="f" else "";t=pfr
    a=("au "+t[3:]) if t.startswith("le ") else ("aux "+t[4:]) if t.startswith("les ") else "à "+t
    dd=("du "+t[3:]) if t.startswith("le ") else ("des "+t[4:]) if t.startswith("les ") else "de "+t
    vk,vj=_N[v[0]]
    story=[sf.format(v=v[0],e=e,k=['','','Deux','Trois','Quatre','Cinq','Six','Sept','Huit','Neuf'][n-1],t=t,a=a,d=dd),
      se.format(v=v[0],k=['','','Two','Three','Four','Five','Six','Seven','Eight','Nine'][n-1],t=pen),
      MG.STORY_KO[si].format(v=vk,ga="이" if MG._bat(vk) else "가",t=pko,k=MG.KNUM[n-1]),
      MG.STORY_JA[si].format(v=vj,t=pja,k=MG.JNUM[n-1])]
    w=MG.WEAP[(c*7+k*3)%len(MG.WEAP)];wk,wj=_D[w[1]]
    return {"env":env,"rtypes":dict(d["types"]),"level":list(SHORT[c]),"title":list(TITLES2[c-10][k] if c>=10 else TITLES[env][k]),"story":story,"weapon":[w[0],w[1],wk,wj],"rooms":rooms,"floors":floors,"rugs":rugs,"people":people,**({"th2":c+1} if c>=10 else {})}
