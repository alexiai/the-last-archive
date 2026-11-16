"""Build a static, relative-path archive with a verified offline manifest and size budget."""
from pathlib import Path
import shutil,json,hashlib
ROOT=Path(__file__).resolve().parent.parent;OUT=ROOT/'dist'
RUNTIME=['index.html','style.css','art-direction.css','production.css','story.js','content_extra.js','story_expansion.js','engine.js','game.js','experience.js','art-direction.js','production.js','audio_director.js','audio_manifest.json','sound_manifest.json','signal_trace.json','sw.js','AUDIO_CREDITS.txt']
if OUT.exists():shutil.rmtree(OUT)
OUT.mkdir()
for name in RUNTIME:shutil.copy2(ROOT/name,OUT/name)
shutil.copytree(ROOT/'assets',OUT/'assets');(OUT/'.nojekyll').touch()
files=[]
for p in sorted(OUT.rglob('*')):
 if p.is_file():files.append({'url':p.relative_to(OUT).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
audio=sum(r['bytes'] for r in files if r['url'].startswith('assets/audio/'))
if audio>45_000_000:raise RuntimeError('Audio exceeds the agreed 45 MB review budget; review compression/scope before publishing.')
if any(r['bytes']>95_000_000 for r in files):raise RuntimeError('An asset exceeds the static hosting review limit.')
manifest={'version':hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest()[:20],'files':files,'totalBytes':sum(r['bytes'] for r in files),'audioBytes':audio}
(OUT/'asset-manifest.json').write_text(json.dumps(manifest,indent=2))
print(f"Static archive: {len(files)} files; {manifest['totalBytes']/1e6:.2f} MB total; {audio/1e6:.2f} MB audio. Models, WAV masters and private development files excluded.")
