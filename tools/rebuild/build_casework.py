"""Static allowlist build. Never includes models, private narrative or production sources."""
from pathlib import Path
import shutil,json,hashlib,argparse,subprocess
root=Path(__file__).resolve().parents[2];src=root/'casework'
p=argparse.ArgumentParser();p.add_argument('--output',default='/workspace/work/tonight/casework-build');p.add_argument('--allow-incomplete',action='store_true');args=p.parse_args();
if not args.allow_incomplete:subprocess.run(['node',str(root/'tools/rebuild/test_media.mjs')],check=True)
out=Path(args.output).resolve()
if out==root or root in out.parents:raise SystemExit('Build output must be outside the source repository.')
if out.exists():
 marker=out/'offline-manifest.json'
 try:owned=marker.exists() and json.loads(marker.read_text()).get('edition')=='casework-1'
 except (ValueError,OSError):owned=False
 if any(out.iterdir()) and not owned:raise SystemExit('Refusing to replace an existing directory that is not a casework build.')
 shutil.rmtree(out)
out.mkdir(parents=True)
for name in ['index.html','ASSET-LICENSES.md']:
 shutil.copy2(src/name,out/name)
for name,exts in [('src',{'.js'}),('styles',{'.css'}),('assets',{'.jpg','.png','.svg','.mp3','.mp4','.json'})]:
 for file in (src/name).rglob('*'):
  if file.is_file() and file.suffix in exts:
   target=out/file.relative_to(src);target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(file,target)
index=(out/'index.html').read_text();index=index.replace('</body>',"<script>if('serviceWorker' in navigator){let controlled=!!navigator.serviceWorker.controller&&navigator.serviceWorker.controller.scriptURL===new URL('sw.js',location.href).href;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(controlled)window.dispatchEvent(new Event('preview-updated'));controlled=true;});window.addEventListener('load',()=>setTimeout(()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}),1500));}</script></body>");(out/'index.html').write_text(index)
files=sorted('./'+str(f.relative_to(out)) for f in out.rglob('*') if f.is_file());digest=hashlib.sha256(''.join(hashlib.sha256((out/f[2:]).read_bytes()).hexdigest() for f in files).encode()).hexdigest()[:16]
(out/'offline-manifest.json').write_text(json.dumps({'edition':'casework-1','hash':digest,'files':files},indent=2))
(out/'sw.js').write_text("""const SCOPE='lastarchive-casework-'+encodeURIComponent(self.registration.scope)+'-';const CACHE=SCOPE+'"""+digest+"""';
self.addEventListener('install',event=>event.waitUntil((async()=>{const m=await(await fetch(new URL('offline-manifest.json',self.registration.scope))).json();const cache=await caches.open(CACHE);await cache.addAll(m.files.map(f=>new URL(f,self.registration.scope).href));await cache.add(new URL('offline-manifest.json',self.registration.scope).href);self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(SCOPE)&&name!==CACHE)await caches.delete(name);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||!event.request.url.startsWith(self.registration.scope))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(event.request)||(event.request.mode==='navigate'?await cache.match(new URL('index.html',self.registration.scope).href):null);if(cached){const range=event.request.headers.get('range');if(range&&cached.status===200){const bytes=await cached.arrayBuffer(),m=range.match(/^bytes=([0-9]*)-([0-9]*)$/);if(m&&(m[1]||m[2])){const length=bytes.byteLength;const start=m[1]?Number(m[1]):Math.max(0,length-Number(m[2]));const end=m[1]?(m[2]?Math.min(length-1,Number(m[2])):length-1):length-1;if(start>=length||end<start||(!m[1]&&Number(m[2])===0))return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+length}});const headers=new Headers(cached.headers);headers.delete('Content-Encoding');headers.set('Content-Range','bytes '+start+'-'+end+'/'+length);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');return new Response(bytes.slice(start,end+1),{status:206,headers});}}return cached;}try{return await fetch(event.request)}catch{return new Response('This source is not available offline.',{status:503,headers:{'Content-Type':'text/plain'}})}})())});
""")
print(json.dumps({'output':str(out),'assets':len(files),'bytes':sum(f.stat().st_size for f in out.rglob('*') if f.is_file()),'hash':digest}))
