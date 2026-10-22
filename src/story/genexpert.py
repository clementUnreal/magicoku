# Expert level 11 for every chapter (discovery f11/m11/d11 + story s{c}n11).
# Several candidates per level; keep the hardest (most deduction rounds, fewest clues, no immediate single).
import json,os,sys,time,random
ARGS=sys.argv[1:];sys.argv=['x','0','1']
import genstory as G
from envrt import ENV_RT,ENVS
import gen
EXP_STORY=[{"mech":{"dist":4}},None,{"mech":{"cnt":4}},"liar",None,{"mech":{"mirror":4}},{"nox":True},{"poison":2},None,
           {"mech":{"dist":3,"cnt":3,"mirror":3},"poison":2,"dark":True,"nox":True}]
DISC={"f11":(7,7),"m11":(8,8),"d11":(9,9)}
def score(case,r):
    P=len(r["solution"]);cl={int(k):[(c[0],tuple(c[1]) if isinstance(c[1],list) else c[1]) for c in v] for k,v in r["clues"].items()}
    ok,fs=gen.human(case,cl,P,1);rounds=gen.LAST_ROUNDS[0]
    nclues=sum(len(v) for v in cl.values())
    return rounds*3-nclues-fs*10,rounds,nclues,fs
def one(lid,seed,deadline):
    if lid in DISC:
        n,R=DISC[lid];G.genlv.RT=G.genlv.__dict__.get("RT0",G.genlv.RT)
        r=G.genlv.make(lid,n,R,0,0,1,True,seed,deadline)
        if r:case=dict(id=lid,level=1,minSingles=0,rooms=r["rooms"],objs=[tuple(o) for o in r["objs"]],windows=[],mech={})
        return r,(case if r else None)
    c=int(lid[1:].split("n")[0])-1;G.genlv.RT=ENV_RT[ENVS[c]];cf=EXP_STORY[c]
    if cf=="liar":
        r=G.genliar.make(lid,6,6,seed,deadline,None)
        if r:r["dark"]=True
        return r,None
    cf=dict(cf or {});n,R=9,9
    r=G.make(lid,cf,n,R,0,0,1,True,seed,deadline)
    if not r:return None,None
    case=dict(id=lid,level=1,minSingles=0,rooms=r["rooms"],objs=[tuple(o) for o in r["objs"]],windows=[],mech=cf.get("mech",{}))
    gen.prep(case);return r,case
if __name__=="__main__":
    w,W=int(ARGS[0]),int(ARGS[1]);K=int(ARGS[2]) if len(ARGS)>2 else 3
    G.genlv.RT0=dict(G.genlv.RT)
    lids=["f11","m11","d11"]+[f"s{c+1}n11" for c in range(10)]
    for j,lid in enumerate(lids):
        if j%W!=w:continue
        path=f"lv/{lid}.json"
        if os.path.exists(path):continue
        t=time.time();best=None;seed=sum(map(ord,lid))*101;got=0
        while got<K and time.time()-t<1500:
            r,case=one(lid,seed,time.time()+500);seed+=7
            if not r:continue
            got+=1
            if case is None:sc=(0,0,0,0)
            else:
                gen.prep(case);sc=score(case,r)
            print(lid,"candidate",got,"score",sc,flush=True)
            if best is None or sc[0]>best[0][0]:best=(sc,r)
        if not best:print(lid,"FAILED",flush=True);continue
        r=best[1];r["id"]=lid
        if lid.startswith("s"):r["env"]=ENVS[int(lid[1:].split("n")[0])-1]
        r["expert"]=True;json.dump(r,open(path,"w"));print(lid,"ok",best[0],round(time.time()-t),"s",flush=True)
