WALK={"chair","bath","trunk","book","potion"}
def cells(spec):
    out=[]
    for t,pos in spec:
        for p in pos.split():
            r="ABCDEFGHI".index(p[0]);c=int(p[1:])-1;out.append((t,r,c,1,1))
    return out
CASES=[
 dict(id="facile",level=0,minSingles=2,
  rooms=["RRRPP","RRRPP","RRRRR","GGGGG","GGGGG"],
  objs=cells([("gramo","A1"),("chair","B1 C5"),("shelf","A4"),("desk","A5"),("plant","D1"),("potion","E3")]),windows=[]),
 dict(id="moyen",level=1,minSingles=1,
  rooms=["RRRCGGG","RRRCGGG","RRRCGGG","PPWWWBB","PPWWWBB","VVOOONN","VVOOONN"],
  objs=cells([("chair","A1 C1 G4 G6"),("shelf","A3 A4 C4"),("candle","C3 E6"),("book","B4"),("cauldron","A5 C6 G1"),("plant","A7 F1"),("potion","C7"),("gramo","D1"),("mirror","D2"),("desk","E1"),("bath","D7"),("trunk","F7")]),windows=[]),
 dict(id="difficile",level=1,minSingles=0,
  rooms=["GGGPPP...","GGGPPP...","GGGPPPPP.","GGGPPPPP.","GGCCCC...","GGCCCCRRR","LLLCCRRRR","LLLCCRRRR","LLLCCRRRR"],
  objs=cells([("plant","B1 F1"),("cauldron","A4 D7"),("potion","C5"),("trunk","F3"),("mirror","F5"),("shelf","G1 I1"),("chair","F9"),("gramo","I9")]),windows=[]),
]

for _c in CASES:
    for _r,row in enumerate(_c["rooms"]):
        for _k,ch in enumerate(row):
            if ch==".": _c["objs"].append(("void",_r,_k,1,1))
