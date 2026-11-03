/* ================= storage guard =================
   The browser gives the game ~5 MB. Drawings on the map (one PNG per case) could fill it up; after that nothing could be saved any more:
   the player id was lost at every launch ("your shards belong to another device") and the tutorial came back every game.
   Now: drawings are capped and dropped first when space runs out, every write is retried after making room,
   and a write that still fails is kept in memory so the current session behaves normally. */
(function(){
  let LS;try{LS=window.localStorage}catch(_){return}
  if(!LS)return;
  const P=Storage.prototype,set0=P.setItem,get0=P.getItem,rm0=P.removeItem,MEM=new Map();
  const SK="crimes-mignons-sketch:",TH="crimes-mignons-theory:",MAXSK=6;
  const keys=()=>{const a=[];try{for(let i=0;i<LS.length;i++)a.push(LS.key(i))}catch(_){}return a};
  const solved=id=>{try{return /"solved":true/.test(get0.call(LS,"crimes-mignons-wiz:"+id)||"")}catch(_){return false}};
  function purge(level){
    const ks=keys();let freed=0;
    const drop=k=>{try{const v=get0.call(LS,k);rm0.call(LS,k);freed+=(v||"").length}catch(_){}};
    // 1. drawings of solved cases, then every drawing but the newest ones (all of them if that is still not enough)
    ks.filter(k=>k&&k.startsWith(SK)&&solved(k.slice(SK.length))).forEach(drop);
    if(level>0){const sk=keys().filter(k=>k&&k.startsWith(SK));let order=[];try{order=JSON.parse(get0.call(LS,"magicoku:skorder")||"[]")}catch(_){}
      sk.sort((a,b)=>order.indexOf(a)-order.indexOf(b));sk.slice(0,level>1?sk.length:Math.max(0,sk.length-MAXSK)).forEach(drop)}
    // 2. notes of solved cases, old daily-puzzle states
    if(level>1){ks.filter(k=>k&&k.startsWith(TH)&&solved(k.slice(TH.length))).forEach(drop);
      const today=new Date().toISOString().slice(0,10);ks.filter(k=>k&&k.startsWith("magicoku:daily:")&&k.slice(15)<today).forEach(drop)}
    return freed}
  P.setItem=function(k,v){
    if(this!==LS)return set0.call(this,k,v);
    k=String(k);v=String(v);
    if(k.startsWith(SK)){try{let o=JSON.parse(get0.call(LS,"magicoku:skorder")||"[]");o=o.filter(x=>x!==k);o.push(k);
      const extra=o.length-MAXSK;if(extra>0){o.slice(0,extra).forEach(x=>{try{rm0.call(LS,x)}catch(_){}});o=o.slice(extra)}set0.call(LS,"magicoku:skorder",JSON.stringify(o))}catch(_){}}
    for(let level=0;level<3;level++){
      try{set0.call(LS,k,v);MEM.delete(k);return}catch(e){if(level===2||k.startsWith(SK))break;purge(level+1)}}
    MEM.set(k,v)};   // still no room: keep it for this session
  P.getItem=function(k){if(this===LS&&MEM.has(String(k)))return MEM.get(String(k));return get0.call(this,k)};
  P.removeItem=function(k){if(this===LS)MEM.delete(String(k));return rm0.call(this,k)};
  // on launch: tidy up if the storage is getting full
  try{let n=0;keys().forEach(k=>{n+=(k||"").length+((get0.call(LS,k)||"").length)});if(n>2500000)purge(n>4000000?2:1);else purge(0)}catch(_){}
})();
