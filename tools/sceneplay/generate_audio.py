"""Free local voices for the scene-led edition; the existing edition is untouched."""
import os
os.environ['OMP_NUM_THREADS']='4';os.environ['ORT_DISABLE_TELEMETRY']='1'
from pathlib import Path
import json,hashlib,subprocess,numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
root=Path(__file__).resolve().parents[2];out=root/'sceneplay/assets/audio';masters=Path('/workspace/work/sceneplay-masters');masters.mkdir(exist_ok=True);out.mkdir(parents=True,exist_ok=True)
model=Kokoro('/workspace/work/kokoro-models/kokoro-v1.0.onnx','/workspace/work/kokoro-models/voices-v1.0.bin');jobs=json.loads(Path(__file__).with_name('audio-jobs.json').read_text());manifest={}
old=json.loads((out/'manifest.json').read_text()) if (out/'manifest.json').exists() else {}
for j in jobs:
 digest=hashlib.sha256(json.dumps(j,sort_keys=True).encode()).hexdigest();file=out/(j['id']+'.mp3')
 if old.get(j['id'],{}).get('scriptHash')==digest and file.exists():manifest[j['id']]=old[j['id']];continue
 a,sr=model.create(j['text'],voice=j['voice'],lang='en-gb',speed=.96);a=np.r_[np.zeros(int(sr*.12)),a,np.zeros(int(sr*.18))];a=a*.72/max(.01,float(np.abs(a).max()));sf.write(masters/(j['id']+'.wav'),a,sr)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(masters/(j['id']+'.wav')),'-c:a','libmp3lame','-b:a','80k',str(file)],check=True)
 manifest[j['id']]={'file':'assets/audio/'+file.name,'text':j['text'],'speaker':j['who'],'duration':round(len(a)/sr,3),'scriptHash':digest,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()};(out/'manifest.json').write_text(json.dumps(manifest,indent=2));print(j['id'],manifest[j['id']]['duration'],flush=True)
(out/'manifest.json').write_text(json.dumps(manifest,indent=2))
