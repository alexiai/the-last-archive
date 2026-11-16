"""Original project-authored sound assets. No samples, commercial libraries or runtime synthesis."""
import argparse,json,subprocess
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy.signal import butter,sosfilt
parser=argparse.ArgumentParser();parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[2]);parser.add_argument('--masters',type=Path,required=True);args=parser.parse_args()
root=args.root;out=root/'assets/audio/sound';out.mkdir(parents=True,exist_ok=True);args.masters.mkdir(parents=True,exist_ok=True);rate=24000;rng=np.random.default_rng(419);records=[]
def tone(freq,dur,level=.2):
 t=np.arange(round(rate*dur))/rate;env=np.minimum(1,t/.015)*np.exp(-t/(dur*.32));return level*env*(np.sin(2*np.pi*freq*t)+.25*np.sin(2*np.pi*freq*2.003*t))
def write(name,a,bps='64k'):
 a=np.asarray(a,dtype=np.float32);peak=max(float(np.abs(a).max()),.01);a=a*.7/peak;wav=args.masters/(name+'.wav');sf.write(wav,a,rate,subtype='PCM_16');p=out/(name+'.mp3');subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-af','loudnorm=I=-23:TP=-3:LRA=10','-ac','1','-ar','24000','-c:a','libmp3lame','-b:a',bps,str(p)],check=True);records.append({'id':name,'file':p.relative_to(root).as_posix(),'duration':round(len(a)/rate,3),'bytes':p.stat().st_size,'source':'Original mathematical synthesis for this project; no third-party samples'})
for name,notes in [('notification',[660,880]),('discovery',[329.63,440,659.25]),('resolution',[440,349.23,293.66]),('pickup',[190,340]),('hangup',[340,190])]:
 a=np.zeros(rate);offset=0
 for f in notes:
  v=tone(f,.24,.15);a[offset:offset+len(v)]+=v;offset+=int(rate*.16)
 write(name,a[:offset+int(rate*.3)])
a=np.zeros(int(rate*2.8))
for start in [0,.32,1.45,1.77]:
 v=tone(523.25,.24,.15)+tone(659.25,.24,.08);at=round(start*rate);a[at:at+len(v)]+=v
write('ring',a)
t=np.arange(int(rate*1.2))/rate;n=sosfilt(butter(3,[400,2400],btype='bandpass',fs=rate,output='sos'),rng.normal(0,1,len(t)));a=n*np.exp(-t*12)*.2+np.sin(t*2*np.pi*59)*np.exp(-t*8)*.12;write('unease',a)
for name,dur in [('room',42),('night',47)]:
 t=np.arange(rate*dur)/rate;noise=rng.normal(0,.01,len(t));a=sosfilt(butter(3,800 if name=='night' else 380,fs=rate,output='sos'),noise);a+=.002*np.sin(t*2*np.pi*50)+.001*np.sin(t*2*np.pi*101)
 for at in rng.uniform(2,dur-2,15):
  v=tone(rng.uniform(1200,2200),.07,.007);i=int(at*rate);a[i:i+len(v)]+=v
 fade=np.minimum(1,np.minimum(t, dur-t)/2);write('ambient-'+name,a*fade,'48k')
for name,dur,bpm,notes in [('investigation',72,44,[146.83,220,174.61,155.56,138.59,196,164.81,220]),('pressure',64,58,[73.42,77.78,110,82.41,73.42,103.83,77.78,98])]:
 t=np.arange(rate*dur)/rate;a=.012*np.sin(2*np.pi*36.71*t)*(0.65+0.35*np.sin(2*np.pi*.07*t));step=60/bpm*2
 for k,at in enumerate(np.arange(1,dur-4,step)):
  f=notes[k%len(notes)];v=tone(f,3.8,.035);v+=tone(f*1.499,3.8,.008);i=int(at*rate);a[i:i+len(v)]+=v
 if name=='pressure':
  for at in np.arange(0,dur-.7,60/bpm):
   i=int(at*rate);v=tone(58,.55,.012);a[i:i+len(v)]+=v
 fade=np.minimum(1,np.minimum(t,dur-t)/3);write('music-'+name,a*fade,'64k')
morse={'O':'---','R':'.-.','C':'-.-.','H':'....','I':'..','D':'-..'};unit=.13;parts=[];pulses=[];cursor=.4;parts.append(np.zeros(round(rate*cursor)))
for index,letter in enumerate('ORCHID'):
 for j,c in enumerate(morse[letter]):
  d=unit*(1 if c=='.' else 3);tt=np.arange(round(rate*d))/rate;env=np.minimum(1,np.minimum(tt,d-tt)/.008);parts.append(.17*np.sin(2*np.pi*640*tt)*env);pulses.append({'letterGroup':index,'start':round(cursor,3),'end':round(cursor+d,3),'kind':'short' if c=='.' else 'long'});cursor+=d
  gap=unit if j<len(morse[letter])-1 else unit*3;parts.append(np.zeros(round(rate*gap)));cursor+=gap
parts.append(np.zeros(rate//2));write('signal',np.concatenate(parts));(root/'signal_trace.json').write_text(json.dumps(pulses,indent=2))
(root/'sound_manifest.json').write_text(json.dumps(records,indent=2));print('Original sound assets:',len(records),'bytes:',sum(r['bytes'] for r in records))
