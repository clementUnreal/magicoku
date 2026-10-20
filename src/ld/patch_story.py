i=s.rindex('</script>');s=s[:i]+open('story.js').read()+'\nrender();\n'+s[i:]
s=s.replace('</style>',open('story.css').read()+'</style>',1)
s=s.replace('suspects:["Suspects","Suspects"]','suspects:["Le récit","The story"]',1)
