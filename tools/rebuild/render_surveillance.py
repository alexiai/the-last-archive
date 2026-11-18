"""Original fixed-camera sample sequence; same hotel geometry and person as the retained still.
No facial identification, no simulated missing interval, no camera audio. Each sample is authored
at a source second and retained independently. Keep the existing evidentiary frame 4 unchanged.
"""
from pathlib import Path
import re
source=Path(__file__).with_name('render_locations.py')
code=source.read_text().split("for name in ['archive-room'")[0]
code=re.sub(r"^render\(s,.*$",'',code,flags=re.M)
code=code.replace('for o in figure:o.hide_render=True','')
exec(compile(code,str(source),'exec'))
s.cycles.samples=20;s.render.resolution_percentage=65
out=root/'casework/assets/surveillance';out.mkdir(parents=True,exist_ok=True)
bpy.ops.object.camera_add(location=(-1.8,-1.5,2.8));camera=bpy.context.object;camera.rotation_euler=(Vector((.3,4,1.1))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.lens=23;s.camera=camera
original={o:o.location.copy() for o in figure}
positions={1:(1.35,5.0),2:(.95,4.6),3:(.52,4.2),4:(.1,3.8),5:(-.35,3.9),6:(-.80,4),7:(-1.4,4)}
for second in range(9):
 for o in figure:
  o.hide_render=second not in positions
  if second in positions:
   x,y=positions[second];o.location=original[o]+Vector((x-.1,y-3.8,0))
 s.render.filepath=str(out/f'hotel-{second}.jpg');bpy.ops.render.render(write_still=True)
print('Nine fixed-camera source samples rendered. Source clock 00:24:56–00:25:04.')
