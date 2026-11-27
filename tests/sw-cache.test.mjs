import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

test('service worker caches versioned assets and leaves pages and video on the network', async () => {
  const handlers={};
  const cached=new Map();
  let networkCalls=0;
  const storage={
    match: async request=>cached.get(request.url),
    put: async (request,response)=>{cached.set(request.url,response);}
  };
  const self={location:{origin:'https://colourway.example'},addEventListener:(name,callback)=>{handlers[name]=callback;},skipWaiting:()=>{},clients:{claim:async()=>{}}};
  runInNewContext(readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8'),{
    self,URL,caches:{open:async()=>storage,keys:async()=>[]},
    fetch:async()=>{networkCalls++;return new Response('asset');}
  });
  async function request(url){
    const pending=[];
    let response;
    handlers.fetch({request:new Request(url),respondWith:value=>{response=value;},waitUntil:value=>pending.push(value)});
    if(response)await response;
    await Promise.all(pending);
    return Boolean(response);
  }
  const asset='https://colourway.example/assets/exhibition.webp?v=123';
  assert.equal(await request(asset),true);
  assert.equal(await request(asset),true);
  assert.equal(networkCalls,1);
  assert.equal(await request('https://colourway.example/projects.html'),false);
  assert.equal(await request('https://colourway.example/assets/production-video.mp4?v=123'),false);
});
