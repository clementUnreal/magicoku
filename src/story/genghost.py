# Chapter 11 (the ghost), 11 levels of rising difficulty.  usage: python3 genghost.py <worker> <workers>
# Same rules as the Halloween event (see genhallo.py): the ghost floats over furniture, goes through walls
# for "next to", never counts in rooms and is never the culprit.
import json,os,sys,time,random
ARGS=sys.argv[1:];sys.argv=['x']
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import genhallo as H
import genlv
from envrt import ENV_RT
genlv.RT=ENV_RT["fortress"]
# (n, rooms, how far the clue set is pruned: None = not at all, a number = stop at P+number clues, 0 = minimal)
SPEC=[(5,3,None),(5,4,None),(6,4,4),(6,5,3),(6,5,2),(7,6,2),(7,6,1),(7,7,0),(8,7,0),(8,8,0),(9,8,0)]
def make(k,seed,deadline):
    n,R,pr=SPEC[k];rng=random.Random(seed);lid=f"s11n{k+1}"
    while time.time()<deadline:
        rooms,objs,tmap=genlv.layout(n,R,rng)
        case={"id":lid,"rooms":rooms,"objs":[tuple(o) for o in objs],"windows":[]}
        H.setup(case);P=n
        if len(case["cells"])<n*2.2 or len(case["gcells"])<n*2.5:continue
        for attempt in range(30):
            G=rng.randrange(1,P);sol,K=H.rand_sol(case,rng,P,G)
            if sol is None or K==G:continue
            allc=[(p,cl) for p in range(P) for cl in H.cpool(case,sol,p,G,K)]
            rng.shuffle(allc)
            Wk=dict(H.W)
            if k<4:Wk.update(room=4,on=3.5,row=2,col=2)          # gentle: the clues that place people directly come first
            allc.sort(key=lambda t:-Wk[t[1][0]]*(0.6+0.4*rng.random()))
            clues={G:[("float",case["_obj"][sol[G][0]][sol[G][1]])]};uniq=False;t0=time.time()
            for p,cl in allc:
                if len(clues.get(p,[]))>=3 or cl in clues.get(p,[]):continue
                clues.setdefault(p,[]).append(cl)
                if len(H.solve(case,clues,P,G))==1:uniq=True;break
                if time.time()-t0>20:break
            if not uniq:continue
            if pr is not None:
                items=[(p,cl) for p in clues for cl in clues[p]];rng.shuffle(items)
                for p,cl in items:
                    if sum(len(v) for v in clues.values())<=P+pr and pr>0:break
                    if p==G and cl[0]=="float":continue
                    if len(clues[p])==1 and p!=0:continue
                    if time.time()-t0>90:break
                    c2={q:[x for x in v if not(q==p and x==cl)] for q,v in clues.items()};c2={q:v for q,v in c2.items() if v}
                    if len(H.solve(case,c2,P,G))==1:clues=c2
            for p in range(1,P):
                if p not in clues:
                    opts=[cl for cl in H.cpool(case,sol,p,G,K) if cl[0] in("notroom","adj","on")];rng.shuffle(opts)
                    if opts:clues[p]=[opts[0]]
            s=H.solve(case,clues,P,G)
            if not(len(s)==1 and [tuple(x) for x in s[0]]==[tuple(x) for x in sol]):continue
            r=dict(id=lid,rooms=rooms,objs=[list(o) for o in objs],windows=[],solution=[list(x) for x in sol],
                clues={str(p):[[a,list(b) if isinstance(b,tuple) else b] for a,b in clues[p]] for p in sorted(clues)},killer=K,ghost=G,types=tmap,env="fortress")
            if k==10:r["expert"]=True
            return r
    return None
if __name__=="__main__":
    w,W=int(ARGS[0]),int(ARGS[1]) if len(ARGS)>1 else 1
    for k in range(11):
        if k%W!=w:continue
        path=f"lv/s11n{k+1}.json"
        if os.path.exists(path):continue
        t=time.time();seed=4242+k*97;r=None
        while r is None:r=make(k,seed,time.time()+900);seed+=1
        json.dump(r,open(path,"w"));print(r["id"],"ok",round(time.time()-t),"s clues",sum(len(v) for v in r["clues"].values()),flush=True)
