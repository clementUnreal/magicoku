import random, json, sys
from layouts import *
def prep(case):
    R=case["rooms"];n=len(R)
    obj=[[None]*n for _ in range(n)]
    for t,r,c,h,w in case["objs"]:
        for a in range(h):
            for b in range(w):
                assert obj[r+a][c+b] is None,(case["id"],r+a,c+b)
                assert R[r+a][c+b]==R[r][c],(case["id"],"obj spans rooms",t,r,c)
                obj[r+a][c+b]=t
    win=set((r,c) for r,c,s in case["windows"])
    case["_obj"]=obj;case["_win"]=win;case["n"]=n
    case["cells"]=[(r,c) for r in range(n) for c in range(n) if obj[r][c] is None or obj[r][c] in WALK]
def adj_types(case,r,c):
    n=case["n"];o=case["_obj"];s=set()
    for a,b in((1,0),(-1,0),(0,1),(0,-1)):
        rr,cc=r+a,c+b
        if 0<=rr<n and 0<=cc<n and o[rr][cc] and o[rr][cc]!='void' and o[rr][cc]!=o[r][c] and case['rooms'][rr][cc]==case['rooms'][r][c]: s.add(o[rr][cc])
    if (r,c) in case["_win"]: s.add("window")
    return s
def unary_ok(case,cl,r,c):
    k,v=cl;R=case["rooms"];o=case["_obj"]
    if k=="room":return R[r][c]==v
    if k=="notroom":return R[r][c]!=v
    if k=="on":return o[r][c]==v
    if k=="floor":return o[r][c] is None
    if k=="adj":return v in adj_types(case,r,c)
    if k=="row":return r==v
    if k=="col":return c==v
    return True
def roomof(case,x):return case["rooms"][x[0]][x[1]]
def human(case,clues,P,level,retc=False):
    n=case["n"]
    cand=[set(x for x in case["cells"] if all(unary_ok(case,cl,*x) for cl in clues.get(p,[]))) for p in range(P)]
    first_singles=sum(1 for s in cand if len(s)==1)
    while True:
        if any(not s for s in cand):return (False,first_singles,999) if retc else (False,first_singles)
        ch=False
        placed=[p for p in range(P) if len(cand[p])==1]
        for p in placed:
            r,c=next(iter(cand[p]))
            for q in range(P):
                if q!=p:
                    ns={x for x in cand[q] if x[0]!=r and x[1]!=c}
                    if ns!=cand[q]:cand[q]=ns;ch=True
        for p in range(P):
            for k,v in clues.get(p,[]):
                if k=="same":
                    rq={roomof(case,x) for x in cand[v]};ns={x for x in cand[p] if roomof(case,x) in rq}
                    if ns!=cand[p]:cand[p]=ns;ch=True
                    rp={roomof(case,x) for x in cand[p]};ns={x for x in cand[v] if roomof(case,x) in rp}
                    if ns!=cand[v]:cand[v]=ns;ch=True
                elif k in("south","north","east","west"):
                    idx=0 if k in("south","north") else 1
                    if k in("south","east"):
                        lo=min(x[idx] for x in cand[v]);ns={x for x in cand[p] if x[idx]>lo}
                        if ns!=cand[p]:cand[p]=ns;ch=True
                        hi=max(x[idx] for x in cand[p]);ns={x for x in cand[v] if x[idx]<hi}
                        if ns!=cand[v]:cand[v]=ns;ch=True
                    else:
                        hi=max(x[idx] for x in cand[v]);ns={x for x in cand[p] if x[idx]<hi}
                        if ns!=cand[p]:cand[p]=ns;ch=True
                        lo=min(x[idx] for x in cand[p]);ns={x for x in cand[v] if x[idx]>lo}
                        if ns!=cand[v]:cand[v]=ns;ch=True
                elif k=="alone":
                    for q in range(P):
                        if q==p:continue
                        if len(cand[q])==1:
                            rm=roomof(case,next(iter(cand[q])));ns={x for x in cand[p] if roomof(case,x)!=rm}
                            if ns!=cand[p]:cand[p]=ns;ch=True
                    if len(cand[p])==1:
                        rm=roomof(case,next(iter(cand[p])))
                        for q in range(P):
                            if q==p:continue
                            ns={x for x in cand[q] if roomof(case,x)!=rm}
                            if ns!=cand[q]:cand[q]=ns;ch=True
        if ch:continue
        if level>=1:
            # hidden singles rows / cols
            for idx in (0,1):
                for i in range(n):
                    ps=[p for p in range(P) if any(x[idx]==i for x in cand[p])]
                    if len(ps)==1:
                        p=ps[0];ns={x for x in cand[p] if x[idx]==i}
                        if ns!=cand[p]:cand[p]=ns;ch=True
            # murder rule: victim 0 room has exactly 2 people
            if len(cand[0])==1:
                rm=roomof(case,next(iter(cand[0])))
                inroom=[q for q in range(1,P) if len(cand[q])==1 and roomof(case,next(iter(cand[q])))==rm]
                if inroom:
                    for q in range(1,P):
                        if q in inroom:continue
                        ns={x for x in cand[q] if roomof(case,x)!=rm}
                        if ns!=cand[q]:cand[q]=ns;ch=True
                else:
                    can=[q for q in range(1,P) if any(roomof(case,x)==rm for x in cand[q])]
                    if len(can)==1:
                        q=can[0];ns={x for x in cand[q] if roomof(case,x)==rm}
                        if ns!=cand[q]:cand[q]=ns;ch=True
            if level>=2:
                # killer-room exclusion: if victim's room candidates... skip
                pass
        if not ch:break
    ok=all(len(s)==1 for s in cand) and len({next(iter(s)) for s in cand})==P
    if retc: return ok,first_singles,sum(len(s) for s in cand)
    return ok,first_singles
def valid_solution(case,sol):
    R=case["rooms"];vr=roomof(case,sol[0])
    return sum(1 for x in sol if roomof(case,x)==vr)==2
def check_full(case,clues,sol):
    # verify all clues true in sol
    for p,cls in clues.items():
        for k,v in cls:
            x=sol[p]
            if k in("room","notroom","on","floor","adj","row","col"):
                if not unary_ok(case,(k,v),*x):return False
            elif k=="same":
                if roomof(case,x)!=roomof(case,sol[v]):return False
            elif k=="south" and not x[0]>sol[v][0]:return False
            elif k=="north" and not x[0]<sol[v][0]:return False
            elif k=="east" and not x[1]>sol[v][1]:return False
            elif k=="west" and not x[1]<sol[v][1]:return False
            elif k=="alone" and sum(1 for y in sol if roomof(case,y)==roomof(case,x))!=1:return False
    return True
def rand_sol(case,rng):
    n=case["n"];cells=set(case["cells"])
    while True:
        cols=list(range(n));rng.shuffle(cols)
        s=[(r,cols[r]) for r in range(n)]
        if all(x in cells for x in s):
            rng.shuffle(s)
            if valid_solution(case,s):return s
def pool(case,sol,p,level):
    x=sol[p];R=case["rooms"];o=case["_obj"];out=[]
    out.append((("room",roomof(case,x)),3))
    if o[x[0]][x[1]] in WALK: out.append((("on",o[x[0]][x[1]]),4))
    for t in adj_types(case,*x): out.append((("adj",t),3))
    if level>=1:
        out.append((("row",x[0]),1));out.append((("col",x[1]),1))
        for Y in set("".join(R))-{"."}:
            if Y!=roomof(case,x):out.append((("notroom",Y),.3))
    for q in range(len(sol)):
        if q==p:continue
        if roomof(case,sol[q])==roomof(case,x):out.append((("same",q),3))
        if level>=1:
            if sol[q][0]<x[0]:out.append((("south",q),1))
            if sol[q][0]>x[0]:out.append((("north",q),1))
            if sol[q][1]<x[1]:out.append((("east",q),1))
            if sol[q][1]>x[1]:out.append((("west",q),1))
    if sum(1 for y in sol if roomof(case,y)==roomof(case,x))==1:out.append((("alone",None),2))
    return out
def build(case,seed,tries=3000):
    prep(case);rng=random.Random(seed);P=case["n"];lv=case["level"]
    best=None
    for t in range(tries):
        sol=rand_sol(case,rng)
        pools=[pool(case,sol,p,lv) for p in range(P)]
        clues={}
        for p in range(P):
            if p==0 and rng.random()<0.4: continue
            items=[a for a,w in pools[p]];ws=[w for a,w in pools[p]]
            clues[p]=[rng.choices(items,ws)[0]]
        ok,fs=human(case,clues,P,lv)
        if not ok: continue
        if lv==0 and fs<case["minSingles"]: continue
        if lv>=1:
            if human(case,clues,P,0)[0]: continue
            if fs>case["minSingles"]: continue
        assert check_full(case,clues,sol)
        nclues=sum(len(v) for v in clues.values())
        sc=nclues
        if best is None or sc<best[0]: best=(sc,sol,clues,fs)
        if t>200 and best: break
    return best
if __name__=="__main__":
    out={}
    for case in CASES:
        if sys.argv[1:] and case["id"] not in sys.argv[1:]:continue
        b=None;seed=0
        while b is None and seed<20:
            b=build(case,seed);seed+=1
        sc,sol,clues,fs=b
        vr=roomof(case,sol[0]);killer=[q for q in range(1,len(sol)) if roomof(case,sol[q])==vr][0]
        print(case["id"],"clues",sc,"firstSingles",fs,"killer",killer,sol,clues)
        out[case["id"]]=dict(solution=sol,clues={str(k):[list(c) for c in v] for k,v in clues.items()},killer=killer)
    json.dump(out,open("out_"+"_".join(sys.argv[1:] or ["all"])+".json","w"))
