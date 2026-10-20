s=s.replace('<div class="board" id="board"></div>',open('sketch.html').read()+'<div class="board" id="board"></div>',1)
s=s.replace('<p class="status" id="status"></p>','<p class="status" id="status"></p><div class="theory" id="theoryBox" hidden><label for="theory" data-t="theory"></label><textarea id="theory"></textarea></div>',1)
s=s.replace('const TXT={school:','const TXT={vplan:["Plan","Map"],vsketch:["Brouillon","Scratchpad"],skerase:["Gomme","Eraser"],skclear:["Tout effacer","Clear all"],theory:["Mes théories","My theories"],theoryPh:["Ex. : Elias est forcément dans la serre…","E.g. Elias must be in the greenhouse…"],school:',1)
old='document.querySelectorAll("[data-t]").forEach(el=>el.textContent=TXT[el.dataset.t][LI()]);'
assert old in s
s=s.replace(old,'document.querySelectorAll("[data-t]").forEach(el=>{el.textContent=TXT[el.dataset.t][LI()]});const ta=document.getElementById("theory");if(ta)ta.placeholder=TXT.theoryPh[LI()];',1)
s=s.replace('function geo(){return null}','function geo(){return null}\n'+open('sketch.js').read(),1)
s=s.replace('</style>',open('sketch.css').read()+'</style>',1)
old2='${OBJN[t][LI()].replace(/^(une |un |le |la |a |an |the )/,"")}</span>`).join("");'
assert old2 in s
s=s.replace(old2,old2[:-1]+'+`<span><span class="hatch"></span>${L("case hachurée = on ne peut pas s\'y tenir","hatched square = nobody can stand there")}</span>`;',1)
