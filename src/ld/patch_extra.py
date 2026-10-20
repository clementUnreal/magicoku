s=s.replace('<div class="hright">','<div class="hright"><button class="hbtn" id="bRules"></button><button class="hbtn" id="bTuto"></button><button class="hbtn" id="bSound">🔊</button>',1)
s=s.replace('<div class="toast" id="toast"',open('extra.html').read()+'<div class="toast" id="toast"',1)
i=s.rindex('</script>');s=s[:i]+open('extra.js').read()+'\n'+s[i:]
s=s.replace('</style>',open('extra.css').read()+'</style>',1)
assert 'id="bRules"' in s and 'id="mRules"' in s
