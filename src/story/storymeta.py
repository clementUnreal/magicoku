import random,sys
sys.path.insert(0,'../ld');sys.path.insert(0,'../i18n')
import metagen as MG
from envrt import ENVS
from envtext import CH,SHORT,ROOMS,TITLES
from data import NAMES as _N, D as _D
PLACE={"forest":("la Forêt des Murmures","the Whispering Forest"),"station":("la Gare de Brumeval","Brumeval Station"),"bank":("la Banque des Profondeurs","the Bank of the Depths"),
 "alley":("la Ruelle des Marchands","Merchants' Lane"),"village":("le Village de Givrelune","the Village of Frostmoon"),"lake":("le Lac aux Sirènes","the Mermaids' Lake"),
 "stadium":("le Stade des Balais","the Broomstick Stadium"),"hospital":("l'Hospice des Sortilèges","the Spell Infirmary"),"ministry":("le Ministère des Enchantements","the Ministry of Enchantments"),
 "fortress":("la Forteresse des Brumes","the Fortress of Mists")}
def build(lid,d,c,k):
    env=ENVS[c];rng=random.Random(lid);n=len(d["rooms"])
    v=MG.VICT[(c+k)%3];people=[v]+MG.SUS[:n-1]
    R=ROOMS[env];rooms={kk:list(R[t][:4]) for kk,t in d["types"].items()};floors={kk:list(R[t][4:6]) for kk,t in d["types"].items()}
    rugs=[]
    for kk in sorted(d["types"]):
        cells=[(r,cc) for r in range(n) for cc in range(n) if d["rooms"][r][cc]==kk]
        if len(cells)<6 or rng.random()<.4:continue
        for (r,cc) in cells:
            blk=[(r+a,cc+b) for a in range(2) for b in range(2)]
            if all(0<=x<n and 0<=y<n and d["rooms"][x][y]==kk for x,y in blk):rugs.append([r,cc,2,2]);break
    pfr,pen=PLACE[env];pko=CH[c][2].split(" · ")[1];pja=CH[c][3].split("・",1)[1]
    si=(c*3+k)%len(MG.STORY);sf,se=MG.STORY[si];e="e" if v[1]=="f" else "";t=pfr
    a=("au "+t[3:]) if t.startswith("le ") else ("aux "+t[4:]) if t.startswith("les ") else "à "+t
    dd=("du "+t[3:]) if t.startswith("le ") else ("des "+t[4:]) if t.startswith("les ") else "de "+t
    vk,vj=_N[v[0]]
    story=[sf.format(v=v[0],e=e,k=['','','Deux','Trois','Quatre','Cinq','Six','Sept','Huit','Neuf'][n-1],t=t,a=a,d=dd),
      se.format(v=v[0],k=['','','Two','Three','Four','Five','Six','Seven','Eight','Nine'][n-1],t=pen),
      MG.STORY_KO[si].format(v=vk,ga="이" if MG._bat(vk) else "가",t=pko,k=MG.KNUM[n-1]),
      MG.STORY_JA[si].format(v=vj,t=pja,k=MG.JNUM[n-1])]
    w=MG.WEAP[(c*7+k*3)%len(MG.WEAP)];wk,wj=_D[w[1]]
    return {"env":env,"rtypes":dict(d["types"]),"level":list(SHORT[c]),"title":list(TITLES[env][k]),"story":story,"weapon":[w[0],w[1],wk,wj],"rooms":rooms,"floors":floors,"rugs":rugs,"people":people}
