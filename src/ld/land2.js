/* ================= landscape game: text far left, people in a compact 2-column strip next to the board ================= */
(function(){const P="html body.g3.g3l";const st=document.createElement("style");st.textContent=`
${P} #cards{flex-direction:row-reverse!important;align-items:stretch!important;gap:8px!important}
${P} #cards .chips{display:grid!important;grid-template-columns:repeat(2,52px)!important;grid-auto-rows:min-content!important;align-content:start!important;gap:3px!important;overflow-x:hidden!important;overflow-y:auto!important;flex:0 0 auto!important;width:auto!important;height:auto!important;max-height:none!important;min-height:0!important;padding:2px!important;margin:0!important}
${P} #cards .chips .card{width:52px!important;min-width:0!important;height:auto!important;min-height:0!important;margin:0!important;padding:1px 0!important;gap:1px!important}
${P} #cards .chips .cph{width:38px!important;height:38px!important;min-width:0!important}
${P} #cards .chips .card>span:not(.cph),${P} #cards .chips .card small,${P} #cards .chips .card b{font-size:10px!important;line-height:1.1!important;max-width:52px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
${P} #cards .recit{flex:1 1 auto!important;min-width:0!important;padding:8px 10px!important}
${P} #cards .recit p{font-size:14px!important;line-height:1.42!important;margin:0 0 6px!important}
${P} #cards .recit .st-rule{font-size:12.5px!important;padding:5px 10px!important}
${P} #g3PanelHead b{font-size:12px!important}`;document.head.appendChild(st)})();
/* ================= level picker on a phone held sideways: everything visible without scrolling ================= */
(function(){const P="html body #lvView";const st=document.createElement("style");st.textContent=`@media (orientation:landscape) and (max-height:520px){
${P} .lvtop{display:none!important}
${P}{padding-top:max(6px,env(safe-area-inset-top,0px))!important}
${P} .lvside{width:190px!important;flex:0 0 190px!important;gap:4px!important}
${P} .lvside h2{display:none!important}
${P} .lvside .lvch{min-height:40px!important;padding:3px 6px!important}
${P} .lvside .lvch .ci{width:26px!important;height:26px!important}${P} .lvside .lvch .ci img{max-height:26px!important}
${P} .lvside .lvch .ct{font-size:12px!important}
${P} .lvmain{padding:6px 10px!important;gap:5px!important;overflow-y:auto!important}
${P} .lvhead{display:flex!important;flex-wrap:wrap!important;align-items:baseline!important;gap:2px 12px!important}
${P} .lvhead small,${P} .lvhead p{display:none!important}
${P} .lvhead h2{font-size:16px!important}
${P} .lvprog{display:flex!important;align-items:center!important;gap:8px!important;margin:0!important;font-size:12.5px!important}
${P} .lvprog i{width:70px!important;flex:0 0 70px!important;height:6px!important;margin:0!important}
${P} .lvmoons{margin:0!important;font-size:12px!important}${P} .lvmoons span{display:none}
${P} .lvleg{display:none!important}
${P} .lvgrid{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:6px!important}
${P} .lvc{padding:4px 4px 5px!important;gap:2px!important;min-height:0!important;border-radius:10px!important}
${P} .lvc .lvh{font-size:10px!important;min-height:0!important;white-space:nowrap!important}${P} .lvc .lvh b{font-size:10px!important;letter-spacing:0!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}
${P} .lvc .lvh i{width:16px!important;height:16px!important;font-size:10px!important}
${P} .lvc .lvt{max-width:54px!important;margin:0 auto!important}
${P} .lvc .lvn,${P} .lvc .lvs,${P} .lvc .lvd,${P} .lvc .lvp{display:none!important}
${P} .lvc .lvm svg.moon{width:13px!important;height:13px!important}
${P} .lvfoot button{min-height:40px!important;font-size:15px!important}
}`;document.head.appendChild(st)})();
/* solved-level sheet, sideways: result + replay on the left, ranking on the right */
(function(){const st=document.createElement("style");st.textContent=`@media (orientation:landscape) and (max-height:520px){
#liSheet{align-items:center!important;padding:8px!important}
#liSheet .li-box{width:min(760px,100%)!important;max-height:calc(100dvh - 16px)!important;border-radius:18px!important;border-bottom:2px solid #c9a25a!important;padding:10px 14px!important;display:grid!important;grid-template-columns:1fr 1fr;column-gap:16px;align-content:start}
#liSheet .li-box>*{grid-column:1}
#liSheet .li-box h3,#liSheet .li-rkw{grid-column:2}
#liSheet .li-box h3{grid-row:1;align-self:start;margin-top:6px!important}
#liSheet .li-rkw{grid-row:2/span 7;overflow:auto;max-height:calc(100dvh - 80px)}
#liSheet .li-box h2{font-size:17px!important;margin:0 0 4px!important}
#liSheet .li-moons{margin:0 0 6px!important}#liSheet .li-moons .moon{width:24px!important;height:24px!important}
#liSheet .li-st{margin-bottom:8px!important}#liSheet .li-st b{font-size:16px!important}
#liSheet .li-go{min-height:46px!important;font-size:17px!important}
#liSheet .li-x{z-index:2}
}`;document.head.appendChild(st)})();
/* in-game menu, sideways: two columns so everything (home button included) is visible without scrolling */
(function(){const P="html body #g3MenuS";const st=document.createElement("style");st.textContent=`@media (orientation:landscape) and (max-height:520px){
${P} .mbox{width:min(760px,96vw)!important;max-width:none!important;max-height:calc(100dvh - 12px)!important;overflow:auto!important;display:grid!important;grid-template-columns:1fr 1.15fr;column-gap:16px;align-content:start;padding:10px 14px 12px!important}
${P} .mbox>*{grid-column:1;margin-top:0!important}
${P} .mbox>h2{margin:0 0 2px!important;font-size:20px!important}
${P} .g3-mstat{margin:0 0 6px!important}
${P} .g3-list{margin-bottom:8px!important}
${P} .g3-msec,${P} .g3-quick{grid-column:2!important}
${P} .g3-msec{grid-row:1!important;margin:4px 0 4px!important;align-self:end}
${P} .g3-quick{grid-row:2/span 4!important;grid-template-columns:repeat(3,1fr)!important;align-self:start}
${P} .g3-quick button{min-height:54px!important}
${P} .g3-lang{margin:0 0 8px!important}
${P} .g3-mhome{min-height:44px!important;margin:0!important}
}`;document.head.appendChild(st)})();
