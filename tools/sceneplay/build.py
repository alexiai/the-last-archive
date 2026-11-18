"""Ship only the scene-led game and finished local assets. No voice weights or production tools."""
from pathlib import Path
import json,hashlib,shutil,subprocess,argparse
root=Path(__file__).resolve().parents[2];src=root/'sceneplay'
p=argparse.ArgumentParser();p.add_argument('--output',required=True);a=p.parse_args();out=Path(a.output).resolve()
if out==root or root in out.parents:raise SystemExit('Build output must be outside the repository.')
subprocess.run(['node',str(root/'tools/sceneplay/test_logic.mjs')],check=True)
subprocess.run(['node',str(root/'tools/sceneplay/test_media.mjs')],check=True)
if not (src/'assets/films/arrival.mp4').exists():raise SystemExit('The original animated introduction has not been produced.')
if out.exists():
 try:owned=json.loads((out/'offline-manifest.json').read_text()).get('edition')=='sceneplay-1'
 except (OSError,ValueError):owned=False
 if any(out.iterdir()) and not owned:raise SystemExit('Refusing to overwrite an unrelated directory.')
 shutil.rmtree(out)
out.mkdir(parents=True)
for name in ['index.html','ASSET-LICENSES.md']:shutil.copy2(src/name,out/name)
for folder,allowed in [('styles',{'.css'}),('vendor',set()),('assets',{'.jpg','.png','.mp3','.mp4','.glb','.json'})]:
 for f in (src/folder).rglob('*'):
  if f.is_file() and (f.suffix in allowed or f.name=='LICENSE'):
   target=out/f.relative_to(src);target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,target)
record=json.loads((src/'game-build.json').read_text())
for name,sha in record['sources'].items():
 if hashlib.sha256((src/name).read_bytes()).hexdigest()!=sha:raise SystemExit('Rebuild the scene-led game bundle: '+name)
if hashlib.sha256((src/'game.js').read_bytes()).hexdigest()!=record['bundleSha256']:raise SystemExit('Game bundle integrity mismatch.')
shutil.copy2(src/'game.js',out/'game.js')
index=out/'index.html';text=index.read_text();import re
text=re.sub(r'<script type="importmap">.*?</script>','',text)
text=text.replace('<script type="module" src="src/app.js"></script>','<script defer src="game.js"></script>');index.write_text(text)
# Render immediately; install the offline edition after the initial page load.
registration="""<script>if('serviceWorker'in navigator){let controlled=!!navigator.serviceWorker.controller&&navigator.serviceWorker.controller.scriptURL===new URL('sw.js',location.href).href;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(controlled)window.dispatchEvent(new Event('sceneplay-updated'));controlled=true;});let attempts=0;const register=()=>navigator.serviceWorker.register('./sw.js').catch(()=>{if(++attempts<3)setTimeout(register,3000)});const begin=()=>setTimeout(register,1500);if(document.readyState==='complete')begin();else window.addEventListener('load',begin,{once:true});window.addEventListener('online',()=>{attempts=0;register()});}</script>"""
index=out/'index.html';index.write_text(index.read_text().replace('</body>',registration+'</body>'))
files=sorted('./'+str(f.relative_to(out))for f in out.rglob('*')if f.is_file());digest=hashlib.sha256(''.join(hashlib.sha256((out/f[2:]).read_bytes()).hexdigest()for f in files).encode()).hexdigest()[:16]
(out/'offline-manifest.json').write_text(json.dumps({'edition':'sceneplay-1','hash':digest,'files':files},indent=2))
# Keep the existing range-capable offline pipeline, with a separate namespace.
worker="""const PREFIX='lastarchive-sceneplay-'+encodeURIComponent(self.registration.scope)+'-';const CACHE=PREFIX+'HASH';
self.addEventListener('install',e=>e.waitUntil((async()=>{const m=await(await fetch(new URL('offline-manifest.json',self.registration.scope))).json();const c=await caches.open(CACHE);await c.addAll(m.files.map(f=>new URL(f,self.registration.scope).href));await c.add(new URL('offline-manifest.json',self.registration.scope).href);self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||!event.request.url.startsWith(self.registration.scope))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(event.request)||(event.request.mode==='navigate'?await cache.match(new URL('index.html',self.registration.scope).href):null);if(cached){const range=event.request.headers.get('range');if(range&&cached.status===200){const bytes=await cached.arrayBuffer(),m=range.match(/^bytes=([0-9]*)-([0-9]*)$/);if(m&&(m[1]||m[2])){const length=bytes.byteLength,start=m[1]?Number(m[1]):Math.max(0,length-Number(m[2])),end=m[1]?(m[2]?Math.min(length-1,Number(m[2])):length-1):length-1;if(start>=length||end<start||(!m[1]&&Number(m[2])===0))return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+length}});const headers=new Headers(cached.headers);headers.delete('Content-Encoding');headers.set('Content-Range','bytes '+start+'-'+end+'/'+length);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');return new Response(bytes.slice(start,end+1),{status:206,headers})}}return cached}try{return await fetch(event.request)}catch{return new Response('This source is not available offline.',{status:503,headers:{'Content-Type':'text/plain'}})}})())});
"""
(out/'sw.js').write_text(worker.replace('HASH',digest));print(json.dumps({'edition':'sceneplay-1','files':len(files),'bytes':sum(f.stat().st_size for f in out.rglob('*')if f.is_file()),'hash':digest,'output':str(out)}))
