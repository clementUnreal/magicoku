s=s.replace("Crimes <span class=\"drop\">Mignons</span>','Cute <span class=\"drop\">Crimes</span>')","Magic<span class=\"drop\">oku</span>','Magic<span class=\"drop\">oku</span>')")
s=s.replace('document.title=L("Crimes Mignons","Cute Crimes");','document.title="Magicoku";')
s=s.replace('<title>Crimes Mignons','<title>Magicoku',1)
s=s.replace('display=swap">','display=swap"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;700&family=EB+Garamond:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Caveat:wght@500;700&display=swap">',1)
s=s.replace('</style>',open('theme.css').read()+'</style>',1)
assert 'Magic<span' in s and '<title>Magicoku' in s
