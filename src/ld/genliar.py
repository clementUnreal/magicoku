import json,os,random,time,sys
from genlv import layout,feasible
from gen import prep,rand_sol,pool,roomof,unary_ok,adj_types,valid_solution
UN=("room","notroom","on","adj","row","col")
def truth(case,cl,p,sol):
    k,v=cl;x=sol[p]
    if k in UN:return unary_ok(case,(k,v),*x)
    if k=="same":return roomof(case,x)==roomof(case,sol[v])
    if k=="south":return x[0]>sol[v][0]
    if k=="north":return x[0]<sol[v][0]
    if k=="east":return x[1]>sol[v][1]
    if k=="west":return x[1]<sol[v][1]
    if k=="alone":return sum(1 for y in sol if roomof(case,y)==roomof(case,x))==1
def count(case,clues,P,limit=2):
    """count placements (valid murder rule) where exactly one clue is false (and none with 0 false)."""
    n=case["n"];cells=case["cells"];flat=[(p,cl) for p in clues for cl in clues[p]]
    un={(p,i):set(x for x in cells if unary_ok(case,cl,*x)) for p in clues for i,cl in enumerate(clues[p]) if cl[0] in UN}
    rel=[(p,cl) for p,cl in flat if cl[0] not in UN]
    sols=[];sol=[None]*P;ur=set();uc=set()
    def rec(p,bad):
        if len(sols)>=limit:return
        if p==P:
            if not valid_solution(case,sol):return
            b=bad+sum(1 for q,cl in rel if not truth(case,cl,q,sol))
            if b<=1:sols.append((b,list(sol)))
            return
        for x in cells:
            if x[0] in ur or x[1] in uc:continue
            nb=bad+sum(1 for i,cl in enumerate(clues.get(p,[])) if cl[0] in UN and x not in un[(p,i)])
            if nb>1:continue
            sol[p]=x;ur.add(x[0]);uc.add(x[1]);rec(p+1,nb);ur.discard(x[0]);uc.discard(x[1])
    rec(0,0);return sols
def lie_for(case,sol,p,rng):
    x=sol[p];R=case["rooms"];o=case["_obj"];P=len(sol);opts=[]
    for Y in sorted(set("".join(R))):
        if Y!=roomof(case,x):opts.append((("room",Y),3))
    for t in ("chair","trunk","book","potion","bath"):
        if any(o[r][c]==t for r,c in case["cells"]) and o[x[0]][x[1]]!=t:opts.append((("on",t),3))
    alladj=set();[alladj.update(adj_types(case,r,c)) for r,c in case["cells"]]
    for t in alladj-adj_types(case,*x)-{"window"}:opts.append((("adj",t),2))
    for q in range(P):
        if q==p:continue
        if roomof(case,sol[q])!=roomof(case,x):opts.append((("same",q),2))
    items=[a for a,w in opts];ws=[w for a,w in opts]
    return rng.choices(items,ws)[0]
def make(lid,n,R,seed,deadline,LIAR=None):
    rng=random.Random(seed)
    while time.time()<deadline:
        rooms,objs,tmap=layout(n,R,rng)
        case=dict(id=lid,level=1,minSingles=0,rooms=rooms,objs=objs,windows=[]);prep(case)
        if not feasible(case,rng):continue
        P=n
        for attempt in range(25):
            sol=rand_sol(case,rng)
            liar=LIAR if LIAR else rng.randrange(1,P)
            clues={liar:[lie_for(case,sol,liar,rng)]}
            pools=[[(a,w) for a,w in pool(case,sol,p,1) if a[0]!="notroom"] for p in range(P)]
            for p in range(P):
                if p==liar:continue
                if p==0 and rng.random()<.5:continue
                it=[a for a,w in pools[p]];ws=[w for a,w in pools[p]];clues[p]=[rng.choices(it,ws)[0]]
            ok=False
            for step in range(12):
                s=count(case,clues,P)
                if len(s)==1 and s[0][0]==1 and s[0][1]==sol:ok=True;break
                if not s:break
                # add a true clue to a non-liar who has <2
                cand=[p for p in range(P) if p!=liar and len(clues.get(p,[]))<2]
                if not cand:break
                p=rng.choice(cand);it=[a for a,w in pools[p] if a not in clues.get(p,[])];ws=[w for a,w in pools[p] if a not in clues.get(p,[])]
                if not it:break
                clues.setdefault(p,[]).append(rng.choices(it,ws)[0])
            if not ok:continue
            # prune redundant true clues
            items=[(p,cl) for p in clues if p!=liar for cl in clues[p]];rng.shuffle(items)
            for p,cl in items:
                c2={k:[c for c in v if not(k==p and c==cl)] for k,v in clues.items()};c2={k:v for k,v in c2.items() if v}
                s=count(case,c2,P)
                if len(s)==1 and s[0][1]==sol:clues=c2
            if sum(1 for p in range(1,P) if p in clues)<P-2:continue
            vr=roomof(case,sol[0]);killer=[q for q in range(1,P) if roomof(case,sol[q])==vr][0]
            return dict(id=lid,rooms=rooms,objs=[list(o) for o in objs],windows=[],solution=sol,clues={str(k):[list(c) for c in v] for k,v in clues.items()},killer=killer,liar=liar,types=tmap)
    return None
if __name__=="__main__":
    LI=[3,1,4,2,5,3,2,4,1,5]
    SPEC=[(f"l{i+1}",n,R,LI[i]) for i,(n,R) in enumerate([(5,3),(5,4),(5,4),(5,4),(6,4),(6,4),(6,5),(6,5),(6,5),(6,5)])]
    for lid,n,R,lq in SPEC:
        path=f"lv/{lid}.json"
        if os.path.exists(path):continue
        t=time.time();r=None;seed=sum(map(ord,lid))*17
        while r is None:r=make(lid,n,R,seed,time.time()+240,lq);seed+=1
        json.dump(r,open(path,"w"));print(lid,"ok",round(time.time()-t),"s liar",r["liar"],"clues",sum(len(v) for v in r["clues"].values()),flush=True)
