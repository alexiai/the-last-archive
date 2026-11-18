"""Encode genuine animated 3D frames and locally produced original audio."""
from pathlib import Path
import argparse,json,hashlib,math,subprocess,wave,struct
import numpy as np,soundfile as sf
root=Path(__file__).resolve().parents[2];p=argparse.ArgumentParser();p.add_argument('--frames',default='/workspace/work/sceneplay-final-frames');a=p.parse_args();frames=Path(a.frames);out=root/'sceneplay/assets/films';out.mkdir(parents=True,exist_ok=True)
count=44*24
source=json.loads((frames/'frame-source.json').read_text())
world_sha=hashlib.sha256((root/'sceneplay/src/world.js').read_bytes()).hexdigest()
if source['worldSha256']!=world_sha:raise SystemExit('The rendered world does not match the current live-world source.')
files=[frames/f'frame-{i:05d}.jpg'for i in range(count)]
if not all(f.exists()and f.stat().st_size>1000 for f in files):raise SystemExit('The actual animated render is incomplete.')
def dimensions(file):
 data=file.read_bytes();pos=2
 while pos<len(data):
  if data[pos]!=255:pos+=1;continue
  marker=data[pos+1];pos+=2
  if marker in [216,217]:continue
  n=int.from_bytes(data[pos:pos+2],'big')
  if marker in [192,193,194]:return(int.from_bytes(data[pos+5:pos+7],'big'),int.from_bytes(data[pos+3:pos+5],'big'))
  pos+=n
sizes={dimensions(f)for f in files}
if sizes!={(1280,720)}:raise SystemExit('Mixed render dimensions: '+str(sizes))
unique=len({hashlib.sha256(f.read_bytes()).hexdigest()for f in files});assert unique>count*.95,'The animated sequence must contain original motion, not held still images.'
sr=24000;length=44;t=np.arange(length*sr,dtype=np.float64)/sr;rng=np.random.default_rng(416);noise=rng.uniform(-1,1,len(t));low=np.zeros(len(t));last=0
for i,n in enumerate(noise):last=last*.94+n*.06;low[i]=last
score=np.zeros(len(t))
for index,f in enumerate([55,82.4069,110.18,146.83]):score+=.011*(.6+.4*np.sin(t*.12+index)**2)*(np.sin(2*np.pi*f*t+.12*np.sin(t*.3))+.2*np.sin(2*np.pi*f*2*t))
score+=low*.12+noise*.003
score+=.012*np.exp(-((t%3.2)/.2)**2)*np.sin(2*np.pi*46*t)
# The audible creak follows the opening door in the rendered scene.
score+=.022*np.sin(2*np.pi*(90*t+2*np.sin(t*2)))*np.exp(-((t-15)/1.8)**2)
score*=np.minimum(np.minimum(t/2,(length-t)/2),1)
audio=np.stack([score+low*.01,score-low*.01],axis=1)
manifest=json.loads((root/'sceneplay/assets/audio/manifest.json').read_text());starts=[3,15,25,31]
for i,start in enumerate(starts):
 voice,rate=sf.read('/workspace/work/sceneplay-masters/intro-'+str(i)+'.wav');assert rate==sr
 offset=round(start*sr);size=min(len(voice),len(audio)-offset);audio[offset:offset+size]+=(voice[:size]*.89)[:,None]
audio*=.95/max(1,float(np.abs(audio).max()));master=Path('/workspace/work/sceneplay-masters/arrival-mix.wav');sf.write(master,audio,sr)
subprocess.run(['ffmpeg','-v','error','-y','-framerate','24','-i',str(frames/'frame-%05d.jpg'),'-i',str(master),'-c:v','libx264','-threads','4','-preset','slow','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-t','44',str(out/'arrival.mp4')],check=True)
# Poster is an original rendered frame, not a replacement for the animation.
import shutil
shutil.copy2(files[72],out/'poster.jpg')
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(out/'arrival.mp4')]))
info={'duration':44,'fps':24,'frames':count,'distinctFrames':unique,'dimensions':[1280,720],'production':'Original animated 3D cameras, character and door; shared live scene geometry','geometrySha256':hashlib.sha256((root/'sceneplay/assets/models/apartment.glb').read_bytes()).hexdigest(),'worldSourceSha256':world_sha,'renderSources':source.get('renderSources',[{'worldSha256':world_sha,'firstFrame':0,'lastFrame':count-1}]),'fileSha256':hashlib.sha256((out/'arrival.mp4').read_bytes()).hexdigest(),'bytes':(out/'arrival.mp4').stat().st_size,'audio':'Original local score and English voiced dialogue','videoCodec':next(s['codec_name']for s in probe['streams']if s['codec_type']=='video')}
(out/'manifest.json').write_text(json.dumps(info,indent=2));print(json.dumps(info,indent=2))
