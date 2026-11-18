"""Validate and index the finished local film assets without re-encoding them."""
from pathlib import Path
import hashlib,json,subprocess
root=Path(__file__).resolve().parents[2];out=root/'casework/assets/films'
expected={'opening.mp4':(38,True),'hotel-camera.mp4':(9,False)}
files={}
for name,(duration,audio) in expected.items():
 p=out/name
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(p)]))
 assert abs(float(probe['format']['duration'])-duration)<.15,(name,'duration')
 assert any(s['codec_type']=='video' and s['codec_name']=='h264' for s in probe['streams'])
 assert any(s['codec_type']=='audio' for s in probe['streams'])==audio
 files[name]={'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'duration':float(probe['format']['duration']),'audio':audio}
for p in out.glob('*.jpg'):files[p.name]={'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
(out/'manifest.json').write_text(json.dumps({'opening':{'duration':38,'shots':[{'source':n,'seconds':s}for n,s in [('scene-wide',8),('scene-door',7),('scene-table',7),('scene-phone',7),('scene-reverse',9)]],'captionLanguage':'en','audio':'Original local synthesized score, rain texture and latch'},'surveillance':{'sampleSeconds':list(range(9)),'sourceStart':'00:24:56','audio':False,'clockCorrectionMinutes':-2},'files':files},indent=2))
print('Both local H.264 films validated; opening has original audio, surveillance has no audio track.')
