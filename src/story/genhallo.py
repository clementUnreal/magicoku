# Halloween event: 10 expert levels with a GHOST.  usage: python3 genhallo.py [first] [last]
# Ghost rules (one suspect, never the victim nor the culprit):
#  - floats over furniture: may stand on any square (but still one person per row and per column, and never next to poison)
#  - goes through walls: "next to <object>" counts across walls for the ghost
#  - does not count in rooms: the victim's room holds the victim + the culprit (+ possibly the ghost)
# Layouts come from the 10 chapter expert levels (s{c}n11), with a brand new solution and testimonies.
import json,os,sys,random,time,itertools
sys.path.insert(0,'../ld');os.chdir('../ld')
import layouts
from envrt import NEW_WALK;layouts.WALK|=NEW_WALK
import gen;gen.WALK=layouts.WALK
from gen import prep,pool,roomof
WALK=layouts.WALK

def setup(case):
    prep(case);n=case["n"];o=case["_obj"]
    pz=[(r,c) for r in range(n) for c in range(n) if o[r][c]=="poison"]
    near=lambda x:any(max(abs(x[0]-a),abs(x[1]-b))<=1 for a,b in pz)
    case["gcells"]=[(r,c) for r in range(n) for c in range(n) if o[r][c]!="void" and o[r][c]!="poison" and not near((r,c))]
def g_adj(case,r,c):
    n=case["n"];o=case["_obj"];s=set()
    for a,b in((1,0),(-1,0),(0,1),(0,-1)):
        rr,cc=r+a,c+b
        if 0<=rr<n and 0<=cc<n and o[rr][cc] and o[rr][cc] not in("void","poison") and o[rr][cc]!=o[r][c]:s.add(o[rr][cc])
    return s
def un_ok(case,p,G,k,v,r,c):
    R=case["rooms"];o=case["_obj"]
    if k=="room":return R[r][c]==v
    if k=="notroom":return R[r][c]!=v
    if k=="on":return o[r][c]==v
    if k=="float":return o[r][c]==v
    if k=="adj":return v in (g_adj(case,r,c) if p==G else gen.adj_types(case,r,c))
    if k=="row":return r==v
    if k=="col":return c==v
    return True
UN=("room","notroom","on","float","adj","row","col")
def rel_ok(case,k,v,x,y):
    if k=="same":return roomof(case,x)==roomof(case,y)
    if k=="north":return x[0]<y[0]
    if k=="south":return x[0]>y[0]
    if k=="east":return x[1]>y[1]
    if k=="west":return x[1]<y[1]
    return True
def victim_ok(case,asg,G,K):
    vr=roomof(case,asg[0]);inr=[p for p in range(1,len(asg)) if p!=G and roomof(case,asg[p])==vr]
    return inr==[K]
def solve(case,clues,P,G,limit=2):
    cand=[[x for x in (case["gcells"] if p==G else case["cells"]) if all(un_ok(case,p,G,k,v,*x) for k,v in clues.get(p,[]) if k in UN)] for p in range(P)]
    rel=[(p,k,v) for p in range(P) for k,v in clues.get(p,[]) if k not in UN]
    order=sorted(range(P),key=lambda p:len(cand[p]))
    sols=[];asg=[None]*P;ur=set();uc=set()
    def ok():
        for p,k,v in rel:
            if asg[p] is None or asg[v] is None:continue
            if not rel_ok(case,k,v,asg[p],asg[v]):return False
        if asg[0] is not None:
            vr=roomof(case,asg[0])
            if sum(1 for q in range(1,P) if q!=G and asg[q] is not None and roomof(case,asg[q])==vr)>1:return False
        return True
    def rec(i):
        if len(sols)>=limit:return
        if i==P:
            vr=roomof(case,asg[0])
            if sum(1 for q in range(1,P) if q!=G and roomof(case,asg[q])==vr)==1:sols.append(list(asg))
            return
        p=order[i]
        for x in cand[p]:
            if x[0] in ur or x[1] in uc:continue
            asg[p]=x;ur.add(x[0]);uc.add(x[1])
            if ok():rec(i+1)
            ur.discard(x[0]);uc.discard(x[1]);asg[p]=None
    rec(0);return sols
def rand_sol(case,rng,P,G):
    n=case["n"];cells=set(case["cells"]);gcells=set(case["gcells"]);o=case["_obj"]
    for _ in range(200000):
        cols=list(range(n));rng.shuffle(cols);rows=list(range(n));rng.shuffle(rows)
        s=[(rows[i],cols[i]) for i in range(P)]
        if not all(x in cells for i,x in enumerate(s) if i!=G):continue
        if s[G] not in gcells or o[s[G][0]][s[G][1]] in (None,) or o[s[G][0]][s[G][1]] in WALK:continue  # the ghost floats over furniture
        vr=roomof(case,s[0]);inr=[p for p in range(1,P) if p!=G and roomof(case,s[p])==vr]
        if len(inr)!=1:continue
        return s,inr[0]
    return None,None
def cpool(case,sol,p,G,K):
    out=[]
    if p==G:
        x=sol[p];o=case["_obj"]
        out.append(("float",o[x[0]][x[1]]))
        for t in g_adj(case,*x):out.append(("adj",t))
        out.append(("room",roomof(case,x)));out.append(("row",x[0]));out.append(("col",x[1]))
        for Y in sorted(set("".join(case["rooms"]))-{"."}):
            if Y!=roomof(case,x):out.append(("notroom",Y))
        for q in range(len(sol)):
            if q==p:continue
            if sol[q][0]<x[0]:out.append(("south",q))
            if sol[q][0]>x[0]:out.append(("north",q))
            if sol[q][1]<x[1]:out.append(("east",q))
            if sol[q][1]>x[1]:out.append(("west",q))
        return out
    for cl,w in pool(case,sol,p,2):
        k,v=cl
        if k not in("room","notroom","on","adj","row","col","same","north","south","east","west"):continue
        if k=="same" and (v==G or {p,v}=={0,K}):continue           # no "same room as the ghost", no giveaway
        if p in(0,K) and k=="room" and v==roomof(case,sol[0]):continue
        if k in("north","south","east","west") and v==G and False:continue
        out.append(cl)
    return out
W={"float":4,"adj":3,"on":2,"room":2,"notroom":2,"same":2,"north":1.5,"south":1.5,"east":1.5,"west":1.5,"row":.7,"col":.7}
def make(c,seed):
    base=json.load(open(f"lv/s{c}n11.json"))
    case={"id":f"hw{c}","rooms":base["rooms"],"objs":[tuple(o) for o in base["objs"]],"windows":[]}
    setup(case);n=case["n"];P=n;rng=random.Random(seed)
    for attempt in range(300):
        G=rng.randrange(1,P)
        sol,K=rand_sol(case,rng,P,G)
        if sol is None:continue
        if K==G:continue
        allc=[(p,cl) for p in range(P) for cl in cpool(case,sol,p,G,K)]
        rng.shuffle(allc);allc.sort(key=lambda t:-W[t[1][0]]*(0.6+0.4*rng.random()))
        clues={}
        # the ghost always says it floated over a piece of furniture (that is the show)
        clues[G]=[("float",case["_obj"][sol[G][0]][sol[G][1]])]
        t0=time.time();uniq=False
        for p,cl in allc:
            if len(clues.get(p,[]))>=3 or cl in clues.get(p,[]):continue
            clues.setdefault(p,[]).append(cl)
            if len(solve(case,clues,P,G))==1:uniq=True;break
            if time.time()-t0>25:break
        if not uniq:print('  attempt',attempt,'not unique',round(time.time()-t0,1),flush=True);continue
        print('  unique with',sum(len(v) for v in clues.values()),'clues in',round(time.time()-t0,1),'s',flush=True)
        # prune to an expert set: drop every clue that is not needed (keep the ghost's float and >=1 clue per suspect)
        items=[(p,cl) for p in clues for cl in clues[p]];rng.shuffle(items)
        for p,cl in items:
            if p==G and cl[0]=="float":continue
            if len(clues[p])==1 and p!=0:continue
            if time.time()-t0>120:break
            c2={q:[x for x in v if not(q==p and x==cl)] for q,v in clues.items()};c2={q:v for q,v in c2.items() if v}
            if len(solve(case,c2,P,G))==1:clues=c2
        for p in range(1,P):
            if p not in clues:
                opts=[cl for cl in cpool(case,sol,p,G,K) if cl[0] in("notroom","adj","on")];rng.shuffle(opts)
                if opts:clues[p]=[opts[0]]
        s=solve(case,clues,P,G)
        assert len(s)==1 and [tuple(x) for x in s[0]]==[tuple(x) for x in sol]
        nc=sum(len(v) for v in clues.values())
        return dict(id=f"hw{c}",rooms=base["rooms"],objs=[list(o) for o in base["objs"]],windows=[],solution=[list(x) for x in sol],
            clues={str(p):[[k,v] for k,v in clues[p]] for p in sorted(clues)},killer=K,ghost=G,types=base["types"],env=base["env"],expert=True,event="halloween",nclues=nc)
    return None
if __name__=="__main__":
    a=int(sys.argv[1]) if len(sys.argv)>1 else 1;b=int(sys.argv[2]) if len(sys.argv)>2 else 10
    for c in range(a,b+1):
        t=time.time();r=make(c,1000+c)
        if not r:print("hw%d FAILED"%c,flush=True);continue
        json.dump(r,open(f"lv/hw{c}.json","w"));print(f"hw{c} ok {round(time.time()-t)}s ghost={r['ghost']} killer={r['killer']} clues={r['nclues']}",flush=True)
