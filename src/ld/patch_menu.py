s=s.replace('if(!_seen)setTimeout(()=>tuto(0),600);','')
s=s.replace('<div class="hright">','<div class="hright"><button class="hbtn menu" id="bMenu">☰ Menu</button>',1)
s=s.replace('<div class="toast" id="toast"',open('menu.html').read()+'<div class="toast" id="toast"',1)
i=s.rindex('</script>');s=s[:i]+open('menu.js').read()+'\n'+open('fx.js').read()+'\n'+s[i:]
s=s.replace('</style>',open('menu.css').read()+'</style>',1)
s=s.replace('.modal{position:fixed;inset:0;z-index:60;','.modal{position:fixed;inset:0;z-index:90;',1)
assert 'id="home"' in s and 'initAccount()' in s
