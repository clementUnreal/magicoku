const V="magicoku-v161";const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./fraunces.woff","./fraunces-italic.woff"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin===location.origin&&(u.pathname.startsWith("/api/")||u.pathname.endsWith("/news.json")||u.pathname.endsWith("/version.json")))return;
  if(r.mode==="navigate"){e.respondWith(fetch(r.url,{cache:"no-store",credentials:"same-origin"}).then(res=>{if(res&&res.ok)caches.open(V).then(c=>c.put("./index.html",res.clone()));return res}).catch(()=>caches.match("./index.html")));return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))caches.open(V).then(c=>c.put(r,res.clone()));return res}).catch(()=>hit);return hit||net}))}
});
