import json,os,time
from genlv import make
SPEC=[(f"n{i+1}",n,R,2,5,0,False) for i,(n,R) in enumerate([(5,3),(5,4),(5,4),(6,4),(6,4),(6,5),(6,5),(6,5),(6,6),(6,6)])]
for sp in SPEC:
    lid=sp[0];path=f"lv/{lid}.json"
    if os.path.exists(path):continue
    t=time.time();r=None;seed=sum(map(ord,lid))*13
    while r is None:
        r=make(*sp,seed,time.time()+180);seed+=1
    json.dump(r,open(path,"w"));print(lid,"ok",round(time.time()-t),"s",flush=True)
