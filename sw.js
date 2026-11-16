/* Explicit complete-archive caching, scoped to this repository path. No save data is touched. */
const prefix='lastarchive-'+encodeURIComponent(self.registration.scope)+'-';
const metaName=prefix+'metadata';
const metaKey=new URL('__offline_status__',self.registration.scope).href;
let downloading=false;
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
async function state(){const r=await(await caches.open(metaName)).match(metaKey);if(!r)return null;const s=await r.json();const keys=await(await caches.open(prefix+s.version)).keys();return keys.length===s.files?s:null;}
function tell(client,data){try{client?.postMessage(data)}catch{}}
self.addEventListener('message',event=>{const client=event.source;
 if(event.data?.type==='STATUS')event.waitUntil(state().then(s=>tell(client,s?{type:'READY',...s}:{type:'EMPTY'})).catch(()=>tell(client,{type:'ERROR'})));
 if(event.data?.type==='DOWNLOAD')event.waitUntil((async()=>{if(downloading)return;downloading=true;let target=null;try{
  const response=await fetch(new URL('asset-manifest.json',self.registration.scope),{cache:'no-store'});if(!response.ok)throw Error('manifest');const manifest=await response.json();
  const existing=await state();if(existing?.version===manifest.version){tell(client,{type:'READY',...existing});return;}
  target=prefix+manifest.version;const cache=await caches.open(target);let done=0,bytes=0;
  for(const row of manifest.files){const url=new URL(row.url,self.registration.scope);if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))throw Error('scope');const res=await fetch(url,{cache:'no-store'});if(!res.ok)throw Error('download');const buffer=await res.arrayBuffer();if(buffer.byteLength!==row.bytes)throw Error('size');if(!self.crypto?.subtle)throw Error('verification');const digest=await crypto.subtle.digest('SHA-256',buffer);const hash=[...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');if(hash!==row.sha256)throw Error('checksum');const headers=new Headers(res.headers);headers.delete('Content-Encoding');headers.set('Content-Length',String(buffer.byteLength));await cache.put(url.href,new Response(buffer,{status:200,headers}));done++;bytes+=buffer.byteLength;tell(client,{type:'PROGRESS',done,total:manifest.files.length,bytes});}
  const s={version:manifest.version,bytes,files:done};await(await caches.open(metaName)).put(metaKey,new Response(JSON.stringify(s),{headers:{'Content-Type':'application/json'}}));
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(prefix)&&k!==metaName&&k!==target).map(k=>caches.delete(k)));tell(client,{type:'READY',...s});
 }catch{const current=await state().catch(()=>null);if(target&&target!==prefix+current?.version)await caches.delete(target).catch(()=>{});tell(client,current?{type:'UPDATE_FAILED',...current}:{type:'ERROR'});}finally{downloading=false;}})());
});
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET'||!request.url.startsWith(self.registration.scope)||request.url.startsWith(new URL('editions/',self.registration.scope).href))return;event.respondWith((async()=>{const s=await state().catch(()=>null);if(s){const cache=await caches.open(prefix+s.version);let response=await cache.match(request,{ignoreSearch:true});if(!response&&request.mode==='navigate')response=await cache.match(new URL('index.html',self.registration.scope).href);if(response){
  const range=request.headers.get('range');if(range&&response.status===200){const b=await response.arrayBuffer();const m=range.match(/^bytes=(\d+)-(\d*)$/);if(m){const start=Number(m[1]),end=Math.min(b.byteLength-1,m[2]?Number(m[2]):b.byteLength-1);if(start>b.byteLength-1||start>end)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${b.byteLength}`}});const headers=new Headers(response.headers);headers.set('Content-Range',`bytes ${start}-${end}/${b.byteLength}`);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');return new Response(b.slice(start,end+1),{status:206,headers});}}
  return response;}}
 return fetch(request);})());});
