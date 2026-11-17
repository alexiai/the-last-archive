"""Publish the stable main snapshot alongside the isolated development preview."""
import argparse,subprocess,tempfile,tarfile,io,shutil,json,hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[2]
p=argparse.ArgumentParser();p.add_argument('--output',required=True);p.add_argument('--main-ref',default='origin/main');a=p.parse_args();out=Path(a.output).resolve()
subprocess.run(['node',str(root/'tools/rebuild/test_engine.mjs')],cwd=root,check=True)
if out.exists():raise SystemExit('Preview output must be a new directory.')
with tempfile.TemporaryDirectory(prefix='archive-preview-') as tmp:
 tmp=Path(tmp);stable=tmp/'stable';stable.mkdir()
 data=subprocess.check_output(['git','archive',a.main_ref],cwd=root)
 with tarfile.open(fileobj=io.BytesIO(data)) as archive:archive.extractall(stable,filter='data')
 subprocess.run(['python3',str(stable/'tools/build_site.py')],cwd=stable,check=True)
 shutil.copytree(stable/'dist',out)
 subprocess.run(['python3',str(root/'tools/rebuild/build_casework.py'),'--output',str(tmp/'casework-build')],check=True)
 for dest in [out/'preview',out/'editions/casework-preview']:shutil.copytree(tmp/'casework-build',dest)
 # Only this production worker change is necessary: never substitute the stable
 # index for a preview navigation. Older installed workers already skip editions/.
 sw=out/'sw.js';text=sw.read_text();needle="request.url.startsWith(new URL('editions/',self.registration.scope).href)"
 if needle not in text:raise SystemExit('Stable worker changed; review preview isolation before deployment.')
 sw.write_text(text.replace(needle,needle+"||request.url.startsWith(new URL('preview/',self.registration.scope).href)"))
 manifest=json.loads((out/'asset-manifest.json').read_text())
 for row in manifest['files']:
  file=out/row['url']
  if row['url']=='sw.js':row['bytes']=file.stat().st_size;row['sha256']=hashlib.sha256(file.read_bytes()).hexdigest()
  elif file.read_bytes()!=(stable/'dist'/row['url']).read_bytes():raise SystemExit('Stable production asset changed: '+row['url'])
 manifest['version']=hashlib.sha256(json.dumps(manifest['files'],sort_keys=True).encode()).hexdigest()[:20]
 manifest['totalBytes']=sum(r['bytes'] for r in manifest['files'])
 (out/'asset-manifest.json').write_text(json.dumps(manifest,indent=2))
 (out/'preview-provenance.json').write_text(json.dumps({'stableCommit':subprocess.check_output(['git','rev-parse',a.main_ref],cwd=root,text=True).strip(),'previewCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'stableIndexSha256':hashlib.sha256((stable/'dist/index.html').read_bytes()).hexdigest(),'rootChanges':['sw.js: exclude preview/','asset-manifest.json: worker integrity metadata'],'previewPaths':['preview/','editions/casework-preview/']},indent=2))
 print('Stable production assets preserved byte-for-byte, except preview worker exclusion and its integrity metadata.')
 print('Isolated previews built:',out)
