const V="magicoku-v10";const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin===location.origin&&u.pathname.startsWith("/api/"))return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{caches.open(V).then(c=>c.put("./index.html",res.clone()));return res}).catch(()=>caches.match("./index.html")));return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))caches.open(V).then(c=>c.put(r,res.clone()));return res}).catch(()=>hit);return hit||net}))}
});
