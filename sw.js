var C="istanbul-v67";
var FILES=["./","index.html","manifest.json","icon-180.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function fresh(c){return fetch("index.html?_="+Date.now(),{cache:"no-store"}).then(function(r){if(r&&r.ok){c.put("index.html",r.clone());c.put("./",r.clone())}return r})}
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  var u=new URL(e.request.url);
  if(u.pathname.endsWith("version.json")){e.respondWith(fetch(e.request,{cache:"no-store"}));return}
  if(e.request.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith(".html")){
    /* Ouverture instantanée : la page en cache s'affiche tout de suite ; la nouvelle version se télécharge en arrière-plan */
    e.respondWith(caches.open(C).then(function(c){return c.match("index.html").then(function(m){
      var net=fresh(c);
      if(m){e.waitUntil(net.catch(function(){}));return m}
      return net.catch(function(){return caches.match("index.html")})})}));
    return}
  e.respondWith(fetch(e.request).then(function(r){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp)});return r})
    .catch(function(){return caches.match(e.request,{ignoreSearch:true})}));
});
