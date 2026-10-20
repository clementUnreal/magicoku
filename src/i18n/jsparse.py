import re
def skip_str(s,i):
    q=s[i];i+=1
    if q=='`':
        while True:
            c=s[i]
            if c=='\\':i+=2;continue
            if c=='`':return i+1
            if c=='$' and s[i+1]=='{':
                i=skip_expr(s,i+2,'}');i+=1;continue
            i+=1
    while s[i]!=q:
        if s[i]=='\\':i+=1
        i+=1
    return i+1
def skip_expr(s,i,end):
    # returns index of matching end char at depth 0
    depth=0
    while True:
        c=s[i]
        if c in '"\'`':i=skip_str(s,i);continue
        if c=='/' and s[i+1]=='/' :
            i=s.index('\n',i);continue
        if c=='/' and is_regex(s,i):
            i=skip_regex(s,i);continue
        if c in '([{':depth+=1
        elif c in ')]}':
            if depth==0:
                if c==end or end is None:return i
                return i
            depth-=1
        elif c==',' and depth==0 and end==',':return i
        i+=1
def is_regex(s,i):
    j=i-1
    while j>=0 and s[j] in ' \t\n':j-=1
    return j<0 or s[j] in '(,=:[!&|?{};+'
def skip_regex(s,i):
    i+=1;cls=False
    while True:
        c=s[i]
        if c=='\\':i+=2;continue
        if c=='[':cls=True
        elif c==']':cls=False
        elif c=='/' and not cls:break
        i+=1
    i+=1
    while s[i].isalpha():i+=1
    return i
def calls(s,name='L'):
    out=[]
    for m in re.finditer(r'(?<![\w$.])'+name+r'\(',s):
        st=m.end()
        args=[];i=st
        try:
            while True:
                j=skip_expr(s,i,',')
                args.append((i,j));
                if s[j]==')':break
                i=j+1
                if len(args)>6:break
        except Exception as e:
            continue
        out.append((m.start(),args,j))
    return out
