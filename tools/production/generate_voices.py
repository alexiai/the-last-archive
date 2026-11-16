import os
os.environ['ORT_DISABLE_TELEMETRY']='1'
import onnxruntime as ort
ort.disable_telemetry_events()
import json,time,subprocess,hashlib
from pathlib import Path
import numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt,resample_poly
from kokoro_onnx import Kokoro
import argparse
p=argparse.ArgumentParser();p.add_argument('--models',type=Path,required=True);p.add_argument('--jobs',type=Path,required=True);p.add_argument('--masters',type=Path,required=True);p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[2]);args=p.parse_args();root=args.root;masters=args.masters;masters.mkdir(parents=True,exist_ok=True)
jobs=json.loads(args.jobs.read_text());model=Kokoro(str(args.models/'kokoro-v1.0.onnx'),str(args.models/'voices-v1.0.bin'));sr=24000
manifest={'clips':{},'dialogue':{},'provenance':{'model':'Kokoro 82M v1.0','licence':'Apache-2.0','generation':'Local CPU, development time','language':'English','runtimeInference':False}}
rng=np.random.default_rng(143)
def band(a,lo,hi):return sosfilt(butter(4,[lo,hi],btype='bandpass',fs=sr,output='sos'),a).astype(np.float32)
def save(a,path):
 path.parent.mkdir(parents=True,exist_ok=True);a=np.asarray(a,dtype=np.float32);a=a*.82/max(float(np.abs(a).max()),1e-6);sf.write(masters/(path.stem+'.wav'),a,sr,subtype='PCM_16');subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(masters/(path.stem+'.wav')),'-af','loudnorm=I=-19:TP=-2:LRA=8','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','64k',str(path)],check=True)
 return {'file':path.relative_to(root).as_posix(),'duration':round(len(a)/sr,3),'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
for index,j in enumerate(jobs):
 parts=[np.zeros(int(sr*.18),dtype=np.float32)];segments=[];cursor=.18
 for line in j['lines']:
  if line.get('ambience'):
   dur=1.4 if 'rings' not in line['text'] else .7;t=np.arange(round(sr*dur))/sr
   a=(rng.normal(0,.015,len(t))+np.sin(t*2*np.pi*110)*.02).astype(np.float32)
  else:
   lang='en-gb' if line['voice'].startswith(('bf_','bm_')) else 'en-us';a,_=model.create(line['text'],voice=line['voice'],speed=line['speed'],lang=lang,sentence_pause=.27,clause_pause=.12);a=np.asarray(a,dtype=np.float32)
   if line.get('masked'):
    a=band(a,280,2450);t=np.arange(len(a))/sr;a=np.tanh(a*1.5)*(0.82+0.18*np.sin(2*np.pi*37*t));a=band(a,330,2700)
  a=a*.72/max(float(np.max(np.abs(a))),.01)
  segments.append({'start':round(cursor,3),'end':round(cursor+len(a)/sr,3),'speaker':line['who'],'text':line['text']})
  parts += [a,np.zeros(int(sr*.32),dtype=np.float32)];cursor+=len(a)/sr+.32
 a=np.concatenate(parts)
 if j['scene']=='phone':a=band(a,330,3400)+rng.normal(0,.001,len(a))
 elif j['scene']=='venue':
  t=np.arange(len(a))/sr;bg=(np.sin(t*2*np.pi*83)*.01+np.sin(t*2*np.pi*124.5)*.006)*(0.5+0.5*np.sin(2*np.pi*2*t));a=a+bg+rng.normal(0,.002,len(a))
 elif j['scene']=='room':
  d=int(sr*.058);b=a.copy();b[d:]+=a[:-d]*.09;a=b+rng.normal(0,.0007,len(a))
 result=save(a,root/j['path']);result['segments']=segments
 if j['kind']=='clip':manifest['clips'][j['id']]=result
 else:manifest['dialogue'].setdefault(j['actor'],{})[j['node']]=result
 (root/'audio_manifest.json').write_text(json.dumps(manifest,indent=2))
 print(f'{index+1}/{len(jobs)} complete',flush=True)
print('FINISHED',sum(v['bytes'] for v in manifest['clips'].values())+sum(v['bytes'] for nodes in manifest['dialogue'].values() for v in nodes.values()),flush=True)
