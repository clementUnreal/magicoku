import sys,json
sys.path.insert(0,'.')
from jsparse import calls
s=open('../crimes-mignons.html').read()
a=s.index('<script');s2=s
res=[]
for st,args,end in calls(s):
    if len(args)!=2:print("ARGS",len(args),s[st:st+80]);continue
    fr=s[args[0][0]:args[0][1]].strip();en=s[args[1][0]:args[1][1]].strip()
    res.append(en)
u=list(dict.fromkeys(res))
json.dump(u,open('lcalls.json','w'),ensure_ascii=False,indent=0)
print(len(res),len(u))
