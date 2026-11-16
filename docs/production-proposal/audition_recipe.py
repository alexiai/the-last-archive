import os
os.environ['ORT_DISABLE_TELEMETRY']='1'
import onnxruntime as ort
ort.disable_telemetry_events()
import numpy as np,soundfile as sf,time,json,hashlib
from kokoro_onnx import Kokoro
from scipy.signal import butter,sosfilt
from pathlib import Path
import argparse
parser=argparse.ArgumentParser(description='Generate spoiler-free English Kokoro auditions locally.')
parser.add_argument('--model-dir',type=Path,required=True)
parser.add_argument('--output-dir',type=Path,required=True)
args=parser.parse_args()
out=args.output_dir;root=args.model_dir
out.mkdir(parents=True,exist_ok=True)
start=time.time();model=Kokoro(str(root/'kokoro-v1.0.onnx'),str(root/'voices-v1.0.bin'))
text="I left a message yesterday. Please call me when you have a moment. I need to check something with you."
voices=[('A','af_heart','en-us',.97),('B','af_bella','en-us',.96),('C','am_michael','en-us',.96),('D','bm_george','en-gb',.97)]
meta=[]
for label,voice,lang,speed in voices:
 t=time.time();a,sr=model.create(text,voice=voice,speed=speed,lang=lang,sentence_pause=.32,clause_pause=.14)
 a=np.asarray(a,dtype=np.float32);peak=float(np.max(np.abs(a)));a=a*(.82/max(peak,1e-6));a=np.concatenate([np.zeros(round(sr*.18)),a,np.zeros(round(sr*.35))]).astype(np.float32)
 filename=f'{label}-dry.wav';sf.write(out/filename,a,sr,subtype='PCM_16');meta.append(dict(sample=label,voice=voice,language=lang,speed=speed,text=text,file=filename,sampleRate=sr,duration=round(len(a)/sr,2),peakDB=round(20*np.log10(np.max(np.abs(a))+1e-12),2),clippedSamples=int((np.abs(a)>=.999).sum()),generationSeconds=round(time.time()-t,2)))
 print(label,meta[-1],flush=True)
 if label=='C':
  phone=sosfilt(butter(4,[330,3400],btype='bandpass',fs=sr,output='sos'),a);rng=np.random.default_rng(108);phone=np.tanh(phone*1.6)*.6+ rng.normal(0,.002,len(a));phone=phone.astype(np.float32);sf.write(out/'C-phone.wav',phone,sr,subtype='PCM_16')
 if label=='B':
  # Dry voice with light room reflections: a distinct scene, not the telephone band-pass.
  room=a.copy();
  for delay,gain in [(0.047,.13),(.092,.07),(.143,.035)]:
   n=round(delay*sr);room[n:]+=a[:-n]*gain
  room=room*.86;sf.write(out/'B-room.wav',room,sr,subtype='PCM_16')
meta.append({'totalGenerationSeconds':round(time.time()-start,2),'modelSHA256':hashlib.sha256((root/'kokoro-v1.0.onnx').read_bytes()).hexdigest(),'voicesSHA256':hashlib.sha256((root/'voices-v1.0.bin').read_bytes()).hexdigest()})
(out/'sample-metadata.json').write_text(json.dumps(meta,indent=2,default=lambda x: x.item() if isinstance(x,np.generic) else str(x)))
