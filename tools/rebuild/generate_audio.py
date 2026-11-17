"""Free, local Kokoro production. Finished MP3s only; models and WAV masters stay outside the game."""
import os
os.environ['ORT_DISABLE_TELEMETRY']='1';os.environ['OMP_NUM_THREADS']='4'
from pathlib import Path
import json,hashlib,subprocess,numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
root=Path(__file__).resolve().parents[2];out=root/'casework/assets/audio';out.mkdir(parents=True,exist_ok=True);masters=Path('/workspace/work/casework-masters');masters.mkdir(exist_ok=True)
jobs=json.loads((Path(__file__).parent/'audio-jobs.json').read_text());manifest_path=out/'manifest.json';manifest=json.loads(manifest_path.read_text()) if manifest_path.exists() else {'clips':{},'production':{'model':'Kokoro 82M / local CPU','language':'English','runtimeInference':False,'licences':'Apache-2.0 model / MIT kokoro-onnx'}}
model=Kokoro('/workspace/work/kokoro-models/kokoro-v1.0.onnx','/workspace/work/kokoro-models/voices-v1.0.bin');sr=24000
alphabet={'O':'---','R':'.-.','C':'-.-.','H':'....','I':'..','D':'-..'}
def sound(cue,length):
 a=np.zeros(int(round(length*sr)),np.float32)
 if cue=='clock':
  for base in np.arange(.35,length,2.4):
   for d in [0,.35,1.1]:
    start=int((base+d)*sr);t=np.arange(int(.065*sr))/sr;v=(np.sin(2*np.pi*1550*t)+.3*np.sin(2*np.pi*900*t))*np.exp(-70*t)*.13
    if start+len(v)<len(a):a[start:start+len(v)]+=v
 if cue=='lift':
  for offset,f in [(.8,990),(1.4,740)]:
   start=int(offset*sr);t=np.arange(int(1.4*sr))/sr;v=(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*f*2*t))*np.exp(-2.8*t)*.15;a[start:start+len(v)]+=v
 return a
for index,j in enumerate(jobs):
 digest=hashlib.sha256(json.dumps(j,sort_keys=True).encode()).hexdigest();file=out/(j['id']+'.mp3')
 if manifest['clips'].get(j['id'],{}).get('scriptHash')==digest and file.exists():continue
 parts=[np.zeros(int(.2*sr),np.float32)];segments=[];cursor=.2
 if j.get('morse'):
  unit=.16
  for letter in j['morse']:
   for pulse in alphabet[letter]:
    duration=unit*(3 if pulse=='-' else 1);t=np.arange(int(duration*sr))/sr;a=np.sin(2*np.pi*650*t)*.22;a[:240]*=np.linspace(0,1,240);a[-240:]*=np.linspace(1,0,240);parts += [a.astype(np.float32),np.zeros(int(unit*sr),np.float32)]
   parts.append(np.zeros(int(unit*2*sr),np.float32))
 else:
  for line in j['lines']:
   lang='en-gb' if line['voice'].startswith(('bf_','bm_')) else 'en-us';a,_=model.create(line['text'],voice=line['voice'],lang=lang,speed=.97);a=np.asarray(a,np.float32);segments.append({'start':round(cursor,3),'end':round(cursor+len(a)/sr,3),'speaker':line['who'],'text':line['text']});parts += [a,np.zeros(int(.3*sr),np.float32)];cursor+=len(a)/sr+.3
  if not j['lines']:parts.append(np.zeros(sr*8,np.float32))
 audio=np.concatenate(parts)
 if j.get('cue'):audio=audio*.82+sound(j['cue'],len(audio)/sr)
 audio=audio*.8/max(float(np.abs(audio).max()),.01);master=masters/(j['id']+'.wav');sf.write(master,audio,sr)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(master),'-codec:a','libmp3lame','-b:a','64k','-ar','24000',str(file)],check=True)
 manifest['clips'][j['id']]={'file':'assets/audio/'+file.name,'segments':segments,'cue':j.get('cue'),'morse':bool(j.get('morse')),'duration':round(len(audio)/sr,3),'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'scriptHash':digest};manifest_path.write_text(json.dumps(manifest,indent=2));print(f'{index+1}/{len(jobs)} finished',flush=True)
