import random, json, sys, time, os
sys.argv_saved=sys.argv; sys.argv=['x','__none__']
import gen2
from gen import prep, human, check_full, roomof, valid_solution
sys.argv=sys.argv_saved
RT={ # type: objects (blocked, walkable)
 "salon":(["candle","plant","gramo"],["chair","chair"]),
 "biblio":(["shelf","shelf","candle"],["book","chair"]),
 "potions":(["cauldron","shelf"],["potion","potion"]),
 "serre":(["plant","plant"],["trunk"]),
 "bain":(["mirror","plant"],["bath"]),
 "musique":(["gramo","mirror"],["chair"]),
 "etude":(["desk","shelf","candle"],["book","chair"]),
 "dortoir":(["mirror","candle"],["trunk","chair"]),
 "hall":(["mirror","candle","plant"],["trunk"]),
 "grenier":(["shelf"],["trunk","trunk"]),
 "lune":(["candle","mirror"],["book"]),
 "boudoir":(["mirror","plant"],["chair","potion"]),
}
def bsp(n,R,rng):
    rects=[(0,0,n,n)]
    while len(rects)<R+2:
        cand=[x for x in rects if max(x[2],x[3])>=4]
        if not cand:break
        x=max(cand,key=lambda q:q[2]*q[3]+rng.random()*3);rects.remove(x)
        r,c,h,w=x
        if (w>h or (w==h and rng.random()<.5)) and w>=4:
            k=rng.randint(2,w-2);rects+= [(r,c,h,k),(r,c+k,h,w-k)]
        elif h>=4:
            k=rng.randint(2,h-2);rects+= [(r,c,k,w),(r+k,c,h-k,w)]
        else:
            k=rng.randint(2,w-2);rects+= [(r,c,h,k),(r,c+k,h,w-k)]
    g=[[None]*n for _ in range(n)]
    for i,(r,c,h,w) in enumerate(rects):
        for a in range(h):
            for b in range(w):g[r+a][c+b]=i
    ids=list(range(len(rects)))
    def adjpairs():
        s=set()
        for r in range(n):
            for c in range(n):
                for rr,cc in((r+1,c),(r,c+1)):
                    if rr<n and cc<n and g[r][c]!=g[rr][cc]:s.add(tuple(sorted((g[r][c],g[rr][cc]))))
        return list(s)
    while len(set(v for row in g for v in row))>R:
        pr=adjpairs();sizes={}
        for row in g:
            for v in row:sizes[v]=sizes.get(v,0)+1
        pr.sort(key=lambda p:sizes[p[0]]+sizes[p[1]]+rng.random()*4)
        a,b=pr[0]
        for r in range(n):
            for c in range(n):
                if g[r][c]==b:g[r][c]=a
    letters="ABCDEFGHJKLM";m={}
    rooms=["".join(letters[m.setdefault(v,len(m))] for v in row) for row in g]
    return rooms
def layout(n,R,rng):
    rooms=bsp(n,R,rng)
    keys=sorted(set("".join(rooms)))
    types=list(RT.keys());rng.shuffle(types)
    # prefer some room types
    tmap={k:types[i%len(types)] for i,k in enumerate(keys)}
    objs=[];taken=set()
    def isedge(r,c,k):
        return any(not(0<=r+a<n and 0<=c+b<n) or rooms[r+a][c+b]!=k for a,b in((1,0),(-1,0),(0,1),(0,-1)))
    for k in keys:
        cells=[(r,c) for r in range(n) for c in range(n) if rooms[r][c]==k];sz=len(cells)
        bl,wk=RT[tmap[k]]
        nb=max(1,round(sz*.2));nw=max(1 if sz>=3 else 0,round(sz*.12))
        edge=[x for x in cells if isedge(*x,k)];rng.shuffle(edge);inner=[x for x in cells if x not in edge];rng.shuffle(inner)
        order=edge+inner
        for i in range(nb):
            if not order:break
            x=order.pop(0);objs.append((rng.choice(bl),x[0],x[1],1,1))
        rest=[x for x in cells if all((o[1],o[2])!=x for o in objs)];rng.shuffle(rest)
        for i in range(nw):
            if not rest:break
            x=rest.pop();t=rng.choice(wk)
            if t=="bath" and any(o[0]=="bath" for o in objs):t="chair"
            objs.append((t,x[0],x[1],1,1))
    return rooms,objs,tmap
def feasible(case,rng):
    n=case["n"];cells=set(case["cells"])
    for _ in range(4000):
        cols=list(range(n));rng.shuffle(cols)
        s=[(r,cols[r]) for r in range(n)]
        if all(x in cells for x in s):
            rng.shuffle(s)
            if valid_solution(case,s):return True
    return False
def make(lid,n,R,minS,maxS,lv,needH,seed,deadline):
    rng=random.Random(seed)
    while time.time()<deadline:
        rooms,objs,tmap=layout(n,R,rng)
        case=dict(id=lid,level=lv,minSingles=minS,rooms=rooms,objs=objs,windows=[])
        prep(case)
        if not feasible(case,rng):continue
        b=gen2.run(case,minS,maxS,lv,needH,tries=60,seed=rng.randint(0,10**6))
        if not b:continue
        sc,sol,clues,fs=b
        vr=roomof(case,sol[0]);killer=[q for q in range(1,len(sol)) if roomof(case,sol[q])==vr][0]
        return dict(id=lid,rooms=rooms,objs=[list(o) for o in objs],windows=[],solution=sol,clues={str(k):[list(c) for c in v] for k,v in clues.items()},killer=killer,types=tmap,firstSingles=fs)
    return None
SPEC=[]
for i,(n,R) in enumerate([(5,3),(5,4),(6,4),(6,4),(6,5),(6,5),(6,5),(6,6),(6,6)]):
    SPEC.append((f"f{i+2}",n,R,3 if i<3 else 2,6 if i<3 else 3,0,False))
for i,(n,R) in enumerate([(6,5),(6,6),(7,6),(7,6),(7,7),(7,7),(7,7),(7,8),(7,8)]):
    SPEC.append((f"m{i+2}",n,R,1,2,1,True))
for i,(n,R) in enumerate([(7,7),(8,7),(8,8),(8,8),(8,8),(8,9),(9,8),(9,9),(9,9)]):
    SPEC.append((f"d{i+2}",n,R,0,1,1,True))
if __name__=="__main__":
    w,W=int(sys.argv[1]),int(sys.argv[2])
    for j,sp in enumerate(SPEC):
        if j%W!=w:continue
        lid=sp[0];path=f"lv/{lid}.json"
        if os.path.exists(path):continue
        t=time.time();r=None;seed=hash(lid)%10000
        while r is None:
            r=make(*sp,seed,time.time()+600);seed+=1
        json.dump(r,open(path,"w"));print(lid,"ok",round(time.time()-t),"s fs",r["firstSingles"],flush=True)
