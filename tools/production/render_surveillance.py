"""Original fictional surveillance animation using a project-owned location photograph.
Renders actual changing video frames; this is authored game media, not real surveillance footage.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageEnhance,ImageFilter
import math,subprocess,numpy as np
root=Path(__file__).resolve().parents[2];out=root/'assets/video/security-export.mp4';out.parent.mkdir(parents=True,exist_ok=True)
base=Image.open(root/'assets/photos/P11.jpg').convert('RGB').resize((640,360));base=ImageEnhance.Color(base).enhance(.12);base=ImageEnhance.Brightness(base).enhance(.52)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',14)
process=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','640x360','-framerate','24','-i','-','-an','-c:v','libx264','-preset','fast','-crf','29','-profile:v','baseline','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],stdin=subprocess.PIPE)
rng=np.random.default_rng(241)
for frame in range(216):
 t=frame/24;im=base.copy();layer=Image.new('RGBA',im.size);d=ImageDraw.Draw(layer)
 if 1.2<t<7.6:
  f=(t-1.2)/6.4;x=80+f*480;y=355-f*50;h=168-f*52;head=(x,y-h);stride=math.sin(t*7)*h*.1
  d.ellipse((x-8,y-3,x+19,y+4),fill=(0,0,0,85));d.ellipse((head[0]-h*.065,head[1],head[0]+h*.065,head[1]+h*.14),fill=(47,44,39,255))
  d.polygon([(x-h*.11,y-h*.83),(x+h*.1,y-h*.82),(x+h*.13,y-h*.37),(x-h*.13,y-h*.38)],fill=(63,61,58,255))
  d.line([(x-h*.08,y-h*.4),(x+stride,y-h*.03)],fill=(24,25,24,255),width=max(3,int(h*.075)))
  d.line([(x+h*.08,y-h*.4),(x-stride,y)],fill=(25,26,25,255),width=max(3,int(h*.075)))
  d.line([(x-h*.1,y-h*.76),(x-stride*.7-h*.14,y-h*.4)],fill=(56,54,51,255),width=max(3,int(h*.07)))
  d.line([(x+h*.1,y-h*.76),(x+stride*.7+h*.12,y-h*.42)],fill=(61,59,56,255),width=max(3,int(h*.07)))
 im=Image.alpha_composite(im.convert('RGBA'),layer.filter(ImageFilter.GaussianBlur(.75))).convert('RGB')
 a=np.asarray(im).astype(np.float32);a+=rng.normal(0,2.8,a.shape);a[::3]*=.96;im=Image.fromarray(np.clip(a,0,255).astype('uint8'));d=ImageDraw.Draw(im)
 d.text((16,16),f'CAM 02 / LOBBY   00:25:{int(t):02d}',font=font,fill=(215,220,205));d.text((16,326),'EXPORT / VIDEO ONLY',font=font,fill=(200,208,190))
 process.stdin.write(im.tobytes())
process.stdin.close();assert process.wait()==0
print('Rendered original surveillance extract:',out.stat().st_size,'bytes')
