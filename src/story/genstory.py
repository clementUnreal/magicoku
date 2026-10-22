# Story levels with one mechanic per chapter.  usage: python3 genstory.py <worker> <workers> [chapters...]
import json,os,sys,time,random
sys.path.insert(0,'../ld');os.chdir('../ld')
import layouts;from envrt import ENV_RT,NEW_WALK,ENVS
layouts.WALK|=NEW_WALK
import gen;gen.WALK|=NEW_WALK
import genlv,gen2,genliar
DIFF=[(5,3,3,6,0,False),(6,4,3,6,0,False),(6,5,2,4,0,False),(6,5,1,2,1,True),(7,6,1,2,1,True),(7,7,1,2,1,True),(7,7,1,2,1,True),(8,7,1,2,1,True),(8,8,0,1,1,True),(9,8,0,1,1,True)]
LIARSZ=[(5,3),(5,4),(5,4),(6,4),(6,4),(6,5),(6,5),(6,5),(6,5),(6,6)]
MM=[1,1,1,2,2,2,2,2,3,3,3]
# chapter index -> per-level config: mech weights, poison count, dark flag
def cfg(c,k):
    if c==0:return {"mech":{"dist":4}}
    if c==2:return {"mech":{"cnt":4}}
    if c==5:return {"mech":{"mirror":4}}
    if c==6:return {"nox":True}
    if c==7:return {"poison":1 if k<4 else 2}
    if c==9:return [{"mech":{"dist":4}},{"mech":{"cnt":4}},{"mech":{"mirror":4}},{"mech":{"dist":4,"cnt":3},"nox":True},{"mech":{"dist":4},"poison":1},
                    {"mech":{"cnt":4},"dark":True},{"mech":{"mirror":4}},{"mech":{"dist":4},"poison":2,"nox":True},
                    {"mech":{"mirror":3,"cnt":3},"dark":True},{"mech":{"dist":3,"cnt":3,"mirror":3},"poison":2,"dark":True}][k]
    return None
def add_poison(rooms,objs,np_,rng):
    n=len(rooms);taken={(o[1],o[2]) for o in objs};free=[(r,c) for r in range(n) for c in range(n) if (r,c) not in taken]
    rng.shuffle(free);out=list(objs);pz=[]
    for x in free:
        if len(pz)>=np_:break
        if all(max(abs(x[0]-a),abs(x[1]-b))>2 for a,b in pz):pz.append(x);out.append(("poison",x[0],x[1],1,1))
    return out
def make(lid,cf,n,R,minS,maxS,lv,needH,seed,deadline):
    rng=random.Random(seed)
    if cf.get("mech"):minS=min(minS,1)
    while time.time()<deadline:
        rooms,objs,tmap=genlv.layout(n,R,rng)
        if cf.get("poison"):objs=add_poison(rooms,objs,cf["poison"],rng)
        case=dict(id=lid,level=lv,minSingles=minS,rooms=rooms,objs=objs,windows=[],mech=cf.get("mech",{}),mechMin=(min(2,MM[int(lid.split("n")[1])-1]) if set(cf.get("mech",{}))=={"cnt"} else MM[int(lid.split("n")[1])-1]) if cf.get("mech") else 0)
        gen.prep(case)
        if len(case["cells"])<n*2.2 or not genlv.feasible(case,rng):continue
        b=gen2.run(case,minS,maxS,lv,needH,tries=60,seed=rng.randint(0,10**6))
        if not b:continue
        sc,sol,clues,fs=b
        vr=gen.roomof(case,sol[0]);killer=[q for q in range(1,len(sol)) if gen.roomof(case,sol[q])==vr][0]
        r=dict(id=lid,rooms=rooms,objs=[list(o) for o in objs],windows=[],solution=sol,clues={str(k):[[c[0],list(c[1]) if isinstance(c[1],tuple) else c[1]] for c in v] for k,v in clues.items()},killer=killer,types=tmap,firstSingles=fs)
        if cf.get("dark"):r["dark"]=True
        if cf.get("nox"):r["nox"]=True
        return r
    return None
if __name__=="__main__":
    w,W=int(sys.argv[1]),int(sys.argv[2]);chs=[int(x) for x in sys.argv[3:]] or [0,2,3,5,6,7,9]
    jobs=[(c,k) for k in range(10) for c in chs]
    for j,(c,k) in enumerate(jobs):
        if j%W!=w:continue
        lid=f"s{c+1}n{k+1}";path=f"lv/{lid}.json"
        if os.path.exists(path):continue
        genlv.RT=ENV_RT[ENVS[c]];t=time.time();r=None;seed=sum(map(ord,lid))*37
        while r is None:
            if c==3:
                n,R=LIARSZ[k];r=genliar.make(lid,n,R,seed,time.time()+300,None)
            else:
                n,R,minS,maxS,lv,needH=DIFF[k];r=make(lid,cfg(c,k),n,R,minS,maxS,lv,needH,seed,time.time()+400)
            seed+=1
        r["env"]=ENVS[c];json.dump(r,open(path,"w"));print(lid,"ok",round(time.time()-t),"s",flush=True)
