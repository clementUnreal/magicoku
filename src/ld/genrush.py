import json,os,time,sys
from genlv import make
SPEC=[(f"u{i+1}",4,3,2,6,0,False) for i in range(5)]+[(f"u{i+6}",5,3 if i<2 else 4,2,5,0,False) for i in range(5)]
for sp in SPEC:
    lid=sp[0];path=f"lv/{lid}.json"
    if os.path.exists(path):continue
    t=time.time();r=None;seed=sum(map(ord,lid))*7
    while r is None:
        r=make(*sp,seed,time.time()+120);seed+=1
    json.dump(r,open(path,"w"));print(lid,"ok",round(time.time()-t),"s",r["rooms"],flush=True)
