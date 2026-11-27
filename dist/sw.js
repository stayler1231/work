'use strict';
const CACHE_NAME="colourway-assets-7bc512b5db88";
const STATIC_FILE=/\.(?:css|js|woff2?|avif|gif|ico|jpe?g|png|svg|webp)$/i;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const name of await caches.keys())if(name.startsWith('colourway-assets-')&&name!==CACHE_NAME)await caches.delete(name);
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin||!url.searchParams.has('v')||!STATIC_FILE.test(url.pathname))return;
  event.respondWith((async()=>{
    let cache;
    try{
      cache=await caches.open(CACHE_NAME);
      const cached=await cache.match(request);
      if(cached)return cached;
    }catch(_){return fetch(request);}
    const response=await fetch(request);
    if(response.ok)event.waitUntil(cache.put(request,response.clone()).catch(()=>{}));
    return response;
  })());
});
