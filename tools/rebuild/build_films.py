"""Free, reproducible local editorial: canonical room photography + composed sound.
No stock film, runtime services, external music or generated story lettering.
"""
from pathlib import Path
import subprocess, tempfile, math, wave, struct
root=Path(__file__).resolve().parents[2];out=root/'casework/assets/films';out.mkdir(parents=True,exist_ok=True)
def run(args):
 result=subprocess.run(args,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
 if result.returncode:raise RuntimeError(result.stderr.decode()[-5000:])
shots=[('scene-wide',8,1.02,1.13),('scene-door',7,1.12,1.02),('scene-table',7,1.01,1.12),('scene-phone',7,1.12,1.02),('scene-reverse',9,1.04,1.01)]
with tempfile.TemporaryDirectory(prefix='archive-film-') as temp:
 temp=Path(temp);rate=24000;duration=sum(s[1] for s in shots)
 # A restrained original score: bowed-like harmonics, an uneven low pulse,
 # filtered deterministic rain and a quiet latch. No jumpscare spike.
 with wave.open(str(temp/'score.wav'),'wb') as w:
  w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate);seed=416;low=0.;block=bytearray()
  for n in range(rate*duration):
   t=n/rate;seed=(1664525*seed+1013904223)&0xffffffff;noise=(seed/2147483648-1);low=.96*low+.04*noise
   fade=min(1,t/3,(duration-t)/4);drone=0
   for j,f in enumerate([55,82.4069,110.21,146.832,164.814]):
    envelope=.55+.45*math.sin(t*.13+j)**2;drone+=.014*envelope*(math.sin(2*math.pi*f*t+.12*math.sin(t*.3))+ .22*math.sin(2*math.pi*f*2*t))
   pulse=.025*math.exp(-((t%3.1)/.24)**2)*math.sin(2*math.pi*46*t)
   rain=.15*low+.006*noise
   latch=.045*math.exp(-((t-22.1)/.04)**2)*noise
   left=(drone+pulse+rain+latch)*fade;right=(drone+pulse+.14*low-.005*noise+latch)*fade
   block.extend(struct.pack('<hh',int(max(-1,min(1,left))*32767),int(max(-1,min(1,right))*32767)))
   if len(block)>96000:w.writeframesraw(block);block.clear()
  w.writeframesraw(block)
 shotfiles=[]
 for i,(name,seconds,start,end) in enumerate(shots):
  clip=temp/f'shot-{i}.mp4';frames=seconds*24
  # High-resolution crop sampling before downscale avoids jitter in the drift.
  filt=f"scale=1920:-1,zoompan=z='{start}+(on/{frames})*({end}-{start})':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={frames}:s=1280x720:fps=24,eq=saturation=.73:contrast=1.06:brightness=-.035,vignette=PI/5,fade=t=in:st=0:d=0.75,fade=t=out:st={seconds-.7}:d=0.7,format=yuv420p"
  run(['ffmpeg','-y','-filter_threads','1','-threads','2','-i',str(root/f'casework/assets/world/{name}.jpg'),'-vf',filt,'-t',str(seconds),'-c:v','libx264','-threads','2','-preset','fast','-crf','25','-an',str(clip)]);shotfiles.append(clip)
 (temp/'shots.txt').write_text('\n'.join("file '"+str(p)+"'" for p in shotfiles))
 run(['ffmpeg','-y','-filter_threads','1','-f','concat','-safe','0','-i',str(temp/'shots.txt'),'-i',str(temp/'score.wav'),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','96k','-movflags','+faststart','-shortest',str(out/'opening.mp4')])
 run(['ffmpeg','-y','-filter_threads','1','-i',str(out/'opening.mp4'),'-ss','2','-frames:v','1',str(out/'opening-poster.jpg')])
 # A sampled recording remains a sampled recording; do not fabricate smooth
 # hidden activity between its one-second original samples.
 samples=root/'casework/assets/surveillance'
 if (samples/'hotel-8.jpg').exists():
  run(['ffmpeg','-y','-filter_threads','1','-framerate','1','-i',str(samples/'hotel-%d.jpg'),'-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2,fps=24,format=yuv420p','-c:v','libx264','-threads','2','-crf','24','-an','-movflags','+faststart',str(out/'hotel-camera.mp4')])
subprocess.run(['python3',str(root/'tools/rebuild/finish_film_manifest.py')],check=True)
