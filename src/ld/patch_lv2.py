# in-game header: no tabs, show tier + number
s=s.replace('$("#caseTitle").textContent=`${M.title[LI()]} (${N}×${N})`;','{const t=tierOf(ci),k=DATA.filter((c,i)=>i<ci&&tierOf(i)===t).length+1;$("#caseTitle").textContent=`${M.level[LI()]} ${k}/10 · ${M.title[LI()]}`;}',1)
s=s.replace('</style>','#tabs{display:none!important}\n</style>',1)
# next-level button only when unlocked (after solve it is)
