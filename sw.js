var C="istanbul-v49";
var FILES=["./","index.html","manifest.json","icon-180.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  var u=new URL(e.request.url);if(e.request.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith(".html")){u.searchParams.set("_",Date.now())}
  e.respondWith(fetch(u.href,{cache:"no-store"}).then(function(r){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp)});return r})
    .catch(function(){return caches.match(e.request,{ignoreSearch:true}).then(function(m){return m||caches.match("index.html")})}));
});
