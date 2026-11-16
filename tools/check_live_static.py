"""Verify the deployed Pages artifact over HTTPS; never substitute a local build for a live result."""
import argparse,hashlib,json,time,urllib.request,urllib.error,urllib.parse
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('url');p.add_argument('--expected',type=Path,default=Path('dist/asset-manifest.json'));a=p.parse_args();base=a.url.rstrip('/')+'/';expected=json.loads(a.expected.read_text())
def get(path):
 request=urllib.request.Request(urllib.parse.urljoin(base,path),headers={'User-Agent':'TheLastArchive-PublishedBuildCheck','Cache-Control':'no-cache'})
 with urllib.request.urlopen(request,timeout=30) as r:return r.read()
last=None
for attempt in range(40):
 try:
  manifest=json.loads(get('asset-manifest.json?published='+expected['version']))
  if manifest['version']!=expected['version']:raise ValueError('Pages has not yet served the expected build')
  for row in manifest['files']:
   if row['url'].startswith('/') or '..' in row['url'].split('/'):raise ValueError('Invalid published asset path')
   data=get(row['url']+'?published='+expected['version'])
   if len(data)!=row['bytes'] or hashlib.sha256(data).hexdigest()!=row['sha256']:raise ValueError('A live asset differs from the deployed manifest')
  for edition in ['original','phase1']:
   if b'<html' not in get('editions/'+edition+'/index.html'):raise ValueError('A preserved edition is missing')
  try:get('STORY_BIBLE.md')
  except urllib.error.HTTPError as e:
   if e.code not in [403,404]:raise
  else:raise ValueError('Private development material is exposed')
  print('Verified live Pages build:',base,'assets:',len(manifest['files']),'version:',manifest['version']);break
 except (urllib.error.URLError,TimeoutError,ValueError,KeyError) as error:
  last=error
  if attempt==39:raise SystemExit('Live Pages verification failed: '+str(last))
  time.sleep(5)
