# Story chapters 12-20 (chapter 11, the ghost, comes from genghost.py).  usage: python3 genstory2.py <worker> <workers> [chapters...]
import json,os,sys,time,random
ARGS=sys.argv[1:];sys.argv=['x','0','1']
import genstory as G
from envrt import ENV_RT
import gen,gen2,genexpert2 as GX
# no testimony may say that the culprit stood in the victim's room (it gives the answer away)
def _nogive(f):
    def pool(case,sol,p,level):
        out=f(case,sol,p,level)
        if p==0:return [(cl,w) for cl,w in out if cl[0]!="same"]
        return [(cl,w) for cl,w in out if not(cl[0]=="same" and cl[1]==0)]
    return pool
gen.pool=_nogive(gen.pool);gen2.pool=gen.pool
# big grids: fewer full constructions per layout, so a layout that doesn't work is dropped sooner
_run=gen2.run
def _run2(case,minS,maxS,lv,needHarder,tries=400,seed=0):return _run(case,minS,maxS,lv,needHarder,tries=min(tries,14),seed=seed)
gen2.run=_run2;G.gen2.run=_run2
# chapter (1-based) -> environment, per-level configs (levels 1-10) and expert config (level 11)
ENV={12:"forest",13:"ministry",14:"village",15:"bank",16:"stadium",17:"hospital",18:"alley",19:"station",20:"lake"}
ONE={12:{"owl":4},13:{"diag":4},14:{"kiss":4},15:{"more":4},16:{"par":4},17:{"closer":4},18:{"lit":4},19:{"gap":4}}
MIX=[{"owl":4},{"diag":4,"par":3},{"kiss":4,"more":3},{"closer":4},{"lit":4},{"gap":4,"owl":3},{"diag":3,"kiss":3},{"more":3,"par":3},{"closer":3,"lit":3},{"owl":3,"gap":3,"diag":3}]
MIXX={"owl":3,"kiss":3,"more":3,"lit":3}
def cfg(c,k):
    m=ONE[c] if c<20 else (MIX[k] if k<10 else MIXX)
    cf={"mech":dict(m)}
    if "lit" in m:cf["candles"]=3 if k<5 else 4
    return cf
def add_candles(rooms,objs,k,rng):
    n=len(rooms);taken={(o[1]+a,o[2]+b) for o in objs for a in range(o[3]) for b in range(o[4])}
    free=[(r,c) for r in range(n) for c in range(n) if (r,c) not in taken];rng.shuffle(free);out=list(objs);cs=[]
    for x in free:
        if len(cs)>=k:break
        if all(max(abs(x[0]-a),abs(x[1]-b))>2 for a,b in cs):cs.append(x);out.append(("candle",x[0],x[1],1,1))
    return out
CANDLES=[0]
_layout=G.genlv.layout
def layout(n,R,rng):
    rooms,objs,tmap=_layout(n,R,rng)
    if CANDLES[0]:objs=add_candles(rooms,objs,CANDLES[0],rng)
    return rooms,objs,tmap
G.genlv.layout=layout
def ok_text(r):
    K=r["killer"];c0=r["clues"].get("0",[]);ck=r["clues"].get(str(K),[])
    return not any(c[0]=="same" for c in c0) and not any(c[0]=="same" and c[1]==0 for c in ck)
if __name__=="__main__":
    w,W=int(ARGS[0]),int(ARGS[1]);chs=[int(x) for x in ARGS[2:]] or list(range(12,21))
    jobs=[(c,k) for k in range(11) for c in chs]
    for j,(c,k) in enumerate(jobs):
        if j%W!=w:continue
        lid=f"s{c}n{k+1}";path=f"lv/{lid}.json"
        if os.path.exists(path):continue
        env=ENV[c];G.genlv.RT=ENV_RT[env];cf=cfg(c,k);CANDLES[0]=cf.get("candles",0)
        t=time.time();r=None;seed=sum(map(ord,lid))*41;tries=0
        while r is None or not ok_text(r):
            if k<10:
                n,R,minS,maxS,lv,nh=G.DIFF[k]
                if tries>=1:minS=0;maxS=max(maxS,2)
                if tries>=3:nh=False          # hard grids that keep failing: accept a slightly different start
                r=G.make(f"s1n{k+1}",cf,n,R,minS,maxS,lv,nh,seed,time.time()+240);tries+=1
            else:
                GX.DMIN=2 if tries<2 else 1;r=GX.make(lid,cf,seed,time.time()+900);tries+=1
            seed+=7
        r["id"]=lid;r["env"]=env
        if k==10:r["expert"]=True
        json.dump(r,open(path,"w"));print(lid,cf,"ok",round(time.time()-t),"s",flush=True)
