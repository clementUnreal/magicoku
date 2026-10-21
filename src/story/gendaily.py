# Pool of daily puzzles (dy1..dyN), medium difficulty, varied places and clue mechanics.
import json,os,sys,time
ARGS=sys.argv[1:];sys.argv=['x','0','1']
import genstory as G
from envrt import ENV_RT,ENVS
NPOOL=40
MECHS=[{},{"mech":{"dist":4}},{"mech":{"cnt":4}},{"mech":{"mirror":4}},{"poison":1},{"nox":True},{"mech":{"dist":3,"mirror":3}},{"mech":{"cnt":3},"poison":1}]
def spec(i):
    env=ENVS[i%len(ENVS)];cf=dict(MECHS[(i*3)%len(MECHS)]);k=3+(i%4)  # DIFF levels 4..7 (6x6/7x7, medium)
    return env,cf,k
if __name__=="__main__":
    w,W=int(ARGS[0]),int(ARGS[1])
    for i in range(NPOOL):
        if i%W!=w:continue
        lid=f"dy{i+1}";path=f"lv/{lid}.json"
        if os.path.exists(path):continue
        env,cf,k=spec(i);G.genlv.RT=ENV_RT[env];n,R,minS,maxS,lv,nh=G.DIFF[k]
        t=time.time();r=None;seed=sum(map(ord,lid))*53
        while r is None:
            r=G.make(f"s1n{k+1}",cf,n,R,minS,maxS,lv,nh,seed,time.time()+300);seed+=1
        r["id"]=lid;r["env"]=env
        json.dump(r,open(path,"w"));print(lid,env,cf,"ok",round(time.time()-t),"s",flush=True)
