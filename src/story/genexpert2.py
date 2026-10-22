# Expert level 11, v2: much harder.
# - no "row", "col" or "room" clues (they give positions away);
# - the basic deduction solver must get stuck: at least MINT steps need a hypothesis
#   ("if X were here, it breaks"), one level deep, so it stays solvable by a human;
# - minimal clue set (every remaining clue is needed).
# Usage: python3 genexpert2.py worker nworkers [lids...]
import json,os,sys,time,random
ARGS=sys.argv[1:];sys.argv=['x','0','1']
import genstory as G
from envrt import ENV_RT,ENVS
import gen,gen2
import genliar
EXP=[{"mech":{"dist":4}},{},{"mech":{"cnt":4}},"liar",{},{"mech":{"mirror":4}},{"nox":True},{"poison":2},{},
     {"mech":{"dist":3,"cnt":3,"mirror":3},"poison":2,"dark":True,"nox":True}]
BAN=("row","col","room")
MINT=int(os.environ.get("MINT","4"))
DMIN=int(os.environ.get("DMIN","3"))
def full_ok(case,clues,cand,P):
    a=[next(iter(s)) for s in cand]
    if len(set(a))<P or len({x[0] for x in a})<P or len({x[1] for x in a})<P:return None
    if not gen.valid_solution(case,a) or not gen.check_full(case,clues,a):return None
    return a
def run_h(case,clues,P,init=None):
    try:gen.human(case,clues,P,1,init=init)
    except (ValueError,StopIteration):return [set()]*P
    return [set(s) for s in gen.LAST_CAND[0]]
def tsolve(case,clues,P,sol):
    """None if not uniquely solvable with 1-level hypotheses, else number of hypothesis steps."""
    cand=run_h(case,clues,P);trials=0
    while True:
        if any(not s for s in cand):return None
        if all(len(s)==1 for s in cand):
            a=full_ok(case,clues,cand,P);return trials if a==sol else None
        found=False
        for p in sorted(range(P),key=lambda q:len(cand[q])):
            if len(cand[p])<2:continue
            for x in sorted(cand[p]):
                init=[set(s) for s in cand];init[p]={x}
                c2=run_h(case,clues,P,init)
                contra=any(not s for s in c2)
                if not contra and all(len(s)==1 for s in c2):
                    a=full_ok(case,clues,c2,P)
                    if a is None:contra=True
                    elif a!=sol:return None
                if contra:
                    init=[set(s) for s in cand];init[p].discard(x);cand=run_h(case,clues,P,init);trials+=1;found=True;break
            if found:break
        if not found:return None
def deep(case,clues,P,cap=400):
    """Solve like a human: always take the shallowest contradiction. Returns number of hypotheses whose
    contradiction needs >=1 extra deduction round (the genuinely hard ones), or -1 if stuck."""
    cand=run_h(case,clues,P);d=0;steps=0
    while not all(len(s)==1 for s in cand):
        steps+=1
        if steps>cap:return -1
        best=None
        for p in range(P):
            if len(cand[p])<2:continue
            for x in sorted(cand[p]):
                init=[set(s) for s in cand];init[p]={x}
                c2=run_h(case,clues,P,init);rd=gen.LAST_ROUNDS[0] if all(c2) else 0
                if any(not s for s in c2) or (all(len(s)==1 for s in c2) and full_ok(case,clues,c2,P) is None):
                    if best is None or rd<best[0]:best=(rd,p,x)
                    if rd==0:break
            if best and best[0]==0:break
        if not best:return -1
        if best[0]>=1:d+=1
        init=[set(s) for s in cand];init[best[1]].discard(best[2]);cand=run_h(case,clues,P,init)
    return d
def tot(case,clues,P):
    c=run_h(case,clues,P);return sum(len(s) for s in c) if all(c) else 10**6
def build(case,sol,rng,mm):
    P=case["n"]
    pools={p:[(cl,w) for cl,w in gen.pool(case,sol,p,1) if cl[0] not in BAN] for p in range(P)}
    gp=gen.gpool(case,sol)
    if gp:pools[-1]=gp
    nm=lambda cl:sum(1 for v in cl.values() for c in v if c[0] in gen2.MECHK)
    clues={}
    for it in range(40):
        if tsolve(case,clues,P,sol) is not None:break
        cands=[(p,cl,w) for p in pools if len(clues.get(p,[]))<(3 if p<0 else 2) for cl,w in pools[p] if cl not in clues.get(p,[])]
        rng.shuffle(cands)
        if mm and nm(clues)<mm:cands.sort(key=lambda t:0 if t[1][0] in gen2.MECHK else 1)
        best=None
        for p,cl,w in cands[:35]:
            c2={k:list(v) for k,v in clues.items()};c2.setdefault(p,[]).append(cl)
            val=tot(case,c2,P)-(4 if (p not in clues and p>=0) else 0)-w-rng.random()*3
            if best is None or val<best[0]:best=(val,c2)
        if best is None:return None
        clues=best[1]
    else:return None
    if tsolve(case,clues,P,sol) is None:return None
    items=[(p,cl) for p in clues for cl in clues[p]];rng.shuffle(items)
    for p,cl in items:
        if mm and cl[0] in gen2.MECHK and nm(clues)<=mm:continue
        c2={k:[x for x in v if not(k==p and x==cl)] for k,v in clues.items()};c2={k:v for k,v in c2.items() if v}
        if tsolve(case,c2,P,sol) is not None:clues=c2
    t=tsolve(case,clues,P,sol)
    return (t,clues) if t is not None else None
def make(lid,cf,seed,deadline,n=9,R=9):
    rng=random.Random(seed);mm=3 if cf.get("mech") else 0;best=None
    while time.time()<deadline:
        rooms,objs,tmap=G.genlv.layout(n,R,rng)
        if cf.get("poison"):objs=G.add_poison(rooms,objs,cf["poison"],rng)
        case=dict(id=lid,level=1,minSingles=0,rooms=rooms,objs=objs,windows=[],mech=cf.get("mech",{}))
        gen.prep(case)
        if len(case["cells"])<n*2.2 or not G.genlv.feasible(case,rng):continue
        for k in range(4):
            if time.time()>deadline:break
            sol=gen.rand_sol(case,rng);b=build(case,sol,rng,mm)
            if not b:continue
            t,clues=b;nc=sum(len(v) for v in clues.values())
            if t<MINT:print(lid,"cand trials",t,"clues",nc,flush=True);continue
            d=deep(case,clues,case["n"]);print(lid,"cand trials",t,"deep",d,"clues",nc,flush=True)
            if d<DMIN:continue
            vr=gen.roomof(case,sol[0]);killer=[q for q in range(1,len(sol)) if gen.roomof(case,sol[q])==vr][0]
            r=dict(id=lid,rooms=rooms,objs=[list(o) for o in objs],windows=[],solution=sol,clues={str(k):[[c[0],list(c[1]) if isinstance(c[1],tuple) else c[1]] for c in v] for k,v in clues.items()},killer=killer,types=tmap,firstSingles=0,trials=t,deep=d)
            if cf.get("dark"):r["dark"]=True
            if cf.get("nox"):r["nox"]=True
            sc=d*5+t-nc
            if best is None or sc>best[0]:best=(sc,r)
            if d>=DMIN+3:return r
    return best[1] if best else None
def fast_count(case,clues,P,limit=2):
    """Same result as genliar.count, but relational clues are checked as soon as their people are placed."""
    cells=case["cells"];UN=genliar.UN
    un={(p,i):set(x for x in cells if gen.unary_ok(case,cl,*x)) for p in clues for i,cl in enumerate(clues[p]) if cl[0] in UN}
    rel=[(p,cl) for p in clues for cl in clues[p] if cl[0] not in UN]
    def who(p,cl):
        return {p,cl[1]} if cl[0] in("same","south","north","east","west") else set(range(P))
    deg={p:0 for p in range(P)}
    for p in clues:
        for cl in clues[p]:
            for q in ({p} if cl[0] in UN else who(p,cl)):deg[q]+=1
    order=sorted(range(P),key=lambda p:-deg[p]);pos={p:i for i,p in enumerate(order)}
    at={i:[] for i in range(P)}
    for p,cl in rel:at[max(pos[q] for q in who(p,cl))].append((p,cl))
    sols=[];sol=[None]*P;ur=set();uc=set()
    def rec(i,bad):
        if len(sols)>=limit:return
        if i==P:
            if gen.valid_solution(case,sol):sols.append((bad,list(sol)))
            return
        p=order[i]
        for x in cells:
            if x[0] in ur or x[1] in uc:continue
            nb=bad+sum(1 for j,cl in enumerate(clues.get(p,[])) if cl[0] in UN and x not in un[(p,j)])
            if nb>1:continue
            sol[p]=x;nb+=sum(1 for q,cl in at[i] if not genliar.truth(case,cl,q,sol))
            if nb>1:continue
            ur.add(x[0]);uc.add(x[1]);rec(i+1,nb);ur.discard(x[0]);uc.discard(x[1])
        sol[p]=None
    rec(0,0);return sols
genliar.count=fast_count
def make_liar(lid,seed,deadline):
    # bigger board, no row/col/room giveaways for the honest clues
    _pool=genliar.pool
    genliar.pool=lambda case,sol,p,lv:[(a,w) for a,w in _pool(case,sol,p,lv) if a[0] not in BAN]
    try:return genliar.make(lid,8,7,seed,deadline,None)
    finally:genliar.pool=_pool
if __name__=="__main__":
    w,W=int(ARGS[0]),int(ARGS[1]);lids=ARGS[2:] or [f"s{c+1}n11" for c in range(10)]
    for j,lid in enumerate(lids):
        if j%W!=w:continue
        path=f"lv/{lid}.json"
        if os.path.exists(path):continue
        c=int(lid[1:].split("n")[0])-1;G.genlv.RT=ENV_RT[ENVS[c]];cf=EXP[c];t=time.time();seed=sum(map(ord,lid))*313;r=None
        while r is None:
            r=make_liar(lid,seed,time.time()+900) if cf=="liar" else make(lid,cf,seed,time.time()+1500)
            seed+=11
        r["id"]=lid;r["env"]=ENVS[c];r["expert"]=True
        if cf=="liar":r["dark"]=True
        json.dump(r,open(path,"w"));print(lid,"OK trials",r.get("trials"),"deep",r.get("deep"),"clues",sum(len(v) for v in r["clues"].values()),round(time.time()-t),"s",flush=True)
