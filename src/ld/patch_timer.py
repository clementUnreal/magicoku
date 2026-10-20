s=s.replace('<div class="views">','<div class="views"><div class="tmr" id="tmr" aria-live="off"><span class="t" id="tmrT">00:00</span><span class="a" id="tmrA"></span><span class="pz" id="tmrP" hidden>⏸</span></div>',1)
i=s.rindex('</script>');s=s[:i]+open('timer.js').read()+'\n'+s[i:]
s=s.replace('</style>',open('timer.css').read()+'</style>',1)
assert 'id="tmr"' in s
