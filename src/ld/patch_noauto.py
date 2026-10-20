old="  for(let i=0;i<N;i++){for(const [rr,cc] of [[r,i],[i,c]]){if(rr===r&&cc===c)continue;if(blocked(rr,cc))continue;const k=rr+\",\"+cc;(S.auto[k]=S.auto[k]||[]);if(!S.auto[k].includes(p))S.auto[k].push(p)}}\n"
assert old in s;s=s.replace(old,"")
for a,b in [("Quand tu places quelqu'un, des X remplissent sa rangée et sa colonne.","À toi de barrer les cases qui deviennent impossibles."),
            ("When you place someone, X's fill their row and column.","It's up to you to cross out the squares that become impossible."),
            ("Sa rangée et sa colonne se barrent toutes seules.","Pense ensuite à barrer toi-même sa rangée et sa colonne avec l'outil X."),
            ("Their row and column are crossed out automatically.","Then remember to cross out their row and column yourself with the X tool.")]:
    assert a in s;s=s.replace(a,b)
s=s.replace("</style>",".mk.clash .who .ph{box-shadow:inset 0 0 0 2px #2a1824,0 2px 4px rgba(0,0,0,.35)!important}\n</style>",1)
s=s.replace('function load(){try{const s=JSON.parse(localStorage.getItem(key())||"null");if(s&&s.place){s.auto=s.auto||{};return s}}','function load(){try{const s=JSON.parse(localStorage.getItem(key())||"null");if(s&&s.place){s.auto={};return s}}',1)
