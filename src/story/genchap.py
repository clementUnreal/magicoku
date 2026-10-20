import json,os,sys,time
sys.path.insert(0,'../ld');os.chdir('../ld')
import layouts;from envrt import ENV_RT,NEW_WALK,ENVS
layouts.WALK|=NEW_WALK
import gen;gen.WALK|=NEW_WALK
import genlv
DIFF=[(5,3,3,6,0,False),(6,4,3,6,0,False),(6,5,2,4,0,False),(6,5,1,2,1,True),(7,6,1,2,1,True),(7,7,1,2,1,True),(7,7,1,2,1,True),(8,7,1,2,1,True),(8,8,0,1,1,True),(9,8,0,1,1,True)]
w,W=int(sys.argv[1]),int(sys.argv[2])
jobs=[(c,k) for k in range(10) for c in range(10)]
for j,(c,k) in enumerate(jobs):
    if j%W!=w:continue
    lid=f"s{c+1}n{k+1}";path=f"lv/{lid}.json"
    if os.path.exists(path):continue
    genlv.RT=ENV_RT[ENVS[c]]
    n,R,minS,maxS,lv,needH=DIFF[k];t=time.time();r=None;seed=sum(map(ord,lid))*31
    while r is None:
        r=genlv.make(lid,n,R,minS,maxS,lv,needH,seed,time.time()+400);seed+=1
    r["env"]=ENVS[c];json.dump(r,open(path,"w"));print(lid,"ok",round(time.time()-t),"s",flush=True)
