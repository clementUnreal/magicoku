import random, json, sys
from gen import *
def construct(case,sol,rng,lv):
    P=case["n"];pools=[pool(case,sol,p,max(lv,0)) for p in range(P)]
    clues={}
    for it in range(3*P):
        ok,fs,rem=human(case,clues,P,lv,True)
        if ok: break
        best=None
        cands=[]
        for p in range(P):
            if len(clues.get(p,[]))>=2:continue
            for cl,w in pools[p]:
                if cl in clues.get(p,[]):continue
                cands.append((p,cl,w))
        rng.shuffle(cands)
        for p,cl,w in cands[:60]:
            c2={k:list(v) for k,v in clues.items()};c2.setdefault(p,[]).append(cl)
            ok2,fs2,rem2=human(case,c2,P,lv,True)
            # prefer persons without clue, weighted
            val=rem2-(0 if p in clues else 3)-w*0.5-rng.random()
            if best is None or val<best[0]:best=(val,c2)
        if best is None: return None
        clues=best[1]
    ok,fs=human(case,clues,P,lv)
    if not ok:return None
    # prune
    items=[(p,cl) for p in clues for cl in clues[p]];rng.shuffle(items)
    for p,cl in items:
        c2={k:[x for x in v if not(k==p and x==cl)] for k,v in clues.items()}
        c2={k:v for k,v in c2.items() if v}
        if human(case,c2,P,lv)[0]:clues=c2
    return clues
def run(case,minS,maxS,lv,needHarder,tries=400,seed=0):
    prep(case);rng=random.Random(seed);P=case["n"];best=None
    for t in range(tries):
        sol=rand_sol(case,rng)
        clues=construct(case,sol,rng,lv)
        if not clues:continue
        ok,fs=human(case,clues,P,lv)
        if not(minS<=fs<=maxS):continue
        if needHarder and human(case,clues,P,lv-1)[0]:continue
        # give every suspect at least one clue, without making it easier than intended
        for p in range(P):
            if p in clues:continue
            opts=[cl for cl,w in pool(case,sol,p,max(lv,1)) if cl[0] in("room","adj","on","same","notroom")]
            rng.shuffle(opts);opts.sort(key=lambda cl:{"notroom":0,"adj":1,"same":1,"room":2,"on":2}[cl[0]] if needHarder else 0)
            for cl in opts:
                c2=dict(clues);c2[p]=[cl]
                ok2,fs2=human(case,c2,P,lv)
                if ok2 and minS<=fs2<=maxS and not(needHarder and human(case,c2,P,lv-1)[0]):clues=c2;fs=fs2;break
        assert check_full(case,clues,sol)
        nc=sum(len(v) for v in clues.values())
        # prefer every suspect having a clue roughly, few doubles
        missing=sum(1 for p in range(P) if p not in clues)
        sc=nc+missing*0.5
        if best is None or sc<best[0]:best=(sc,sol,clues,fs)
        if best and t>60:break
    return best
cfg={"facile":(2,5,0,False),"moyen":(1,2,1,True),"difficile":(0,1,1,True)}
out={}
for case in CASES:
    if sys.argv[1:] and case["id"] not in sys.argv[1:]:continue
    minS,maxS,lv,nh=cfg[case["id"]]
    b=run(case,minS,maxS,lv,nh)
    if not b:print(case["id"],"FAILED");continue
    sc,sol,clues,fs=b
    vr=roomof(case,sol[0]);killer=[q for q in range(1,len(sol)) if roomof(case,sol[q])==vr][0]
    print(case["id"],"clues",sum(len(v) for v in clues.values()),"firstSingles",fs,"killer",killer,sol,clues,flush=True)
    out[case["id"]]=dict(solution=sol,clues={str(k):[list(c) for c in v] for k,v in clues.items()},killer=killer,firstSingles=fs)
json.dump(out,open("out_"+"_".join(sys.argv[1:] or ["all"])+".json","w"))
