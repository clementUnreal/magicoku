# Infinite mode pool (lv/inf/i1..iN), grouped in tiers of rising difficulty.  usage: python3 geninf.py <worker> <workers>
# Level N of a run is picked by tier (see INF_TIERS in src/ld/infinite.js, mirrored by TIERS below).
import json,os,sys,time
ARGS=sys.argv[1:];sys.argv=['x','0','1']
import genstory as G
from envrt import ENV_RT,ENVS
import gen2
# no testimony may say that the culprit stood in the victim's room (it gives the answer away and reads absurdly)
_pool=gen2.pool
def pool(case,sol,p,level):
    out=_pool(case,sol,p,level)
    if p==0:out=[(cl,w) for cl,w in out if cl[0]!="same"]
    else:out=[(cl,w) for cl,w in out if not(cl[0]=="same" and cl[1]==0)]
    return out
gen2.pool=pool
# (count, DIFF index, mechanic configs cycled through)
TIERS=[(15,0,[{},{},{"mech":{"dist":4}}]),
       (25,1,[{},{"mech":{"dist":4}},{"poison":1},{"mech":{"cnt":4}}]),
       (30,2,[{"mech":{"dist":4}},{"mech":{"cnt":4}},{"mech":{"mirror":4}},{"poison":1},{"nox":True}]),
       (35,3,[{"mech":{"dist":4}},{"mech":{"mirror":4}},{"mech":{"cnt":4},"poison":1},{"nox":True},{"mech":{"dist":4},"dark":True}]),
       (35,5,[{"mech":{"dist":4,"cnt":3}},{"mech":{"mirror":4},"poison":1},{"mech":{"cnt":4},"dark":True},{"mech":{"dist":4},"nox":True},{"poison":2}]),
       (40,7,[{"mech":{"dist":3,"mirror":3}},{"mech":{"cnt":4},"poison":2},{"mech":{"mirror":4},"dark":True},{"mech":{"dist":4},"poison":1,"nox":True},{"mech":{"dist":3,"cnt":3,"mirror":3},"dark":True}])]
def specs():
    out=[];i=0
    for t,(cnt,k,cfs) in enumerate(TIERS):
        for j in range(cnt):
            out.append((i,t,k,dict(cfs[j%len(cfs)]),ENVS[(i*7+t)%len(ENVS)]));i+=1
    return out
if __name__=="__main__":
    w,W=int(ARGS[0]),int(ARGS[1]);os.makedirs("lv/inf",exist_ok=True)
    for i,t,k,cf,env in specs():
        if i%W!=w:continue
        lid=f"i{i+1}";path=f"lv/inf/{lid}.json"
        if os.path.exists(path):continue
        G.genlv.RT=ENV_RT[env];n,R,minS,maxS,lv,nh=G.DIFF[k]
        st=time.time();r=None;seed=sum(map(ord,lid))*71+i
        while r is None:
            r=G.make(f"s1n{k+1}",cf,n,R,minS,maxS,lv,nh,seed,time.time()+400);seed+=1
        # safety: no "same room" testimony between the victim and the culprit
        K=r["killer"];bad=[c for c in r["clues"].get("0",[]) if c[0]=="same"]+[c for c in r["clues"].get(str(K),[]) if c[0]=="same" and c[1]==0]
        if bad:print(lid,"BAD",bad,flush=True);continue
        r["id"]=lid;r["env"]=env;r["tier"]=t;r["k"]=k
        json.dump(r,open(path,"w"));print(lid,"tier",t,env,cf,"ok",round(time.time()-st),"s",flush=True)
