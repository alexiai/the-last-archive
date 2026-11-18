"""Export projected source coordinates without rendering or copying private story data."""
from pathlib import Path
source=Path(__file__).with_name('render_world.py');exec(compile(source.read_text().split('regions={};points=')[0],str(source),'exec'))
points={'sofa':(1.7,.8,.7),'shelf':(1.4,3.1,1.05),'table':(.05,.1,.605),'phone':(2.1,-1,.6),'door':(-2.25,3.45,1.2)}
regions={}
for name,(pos,target,lens,version) in views.items():
 sofa.location=(1.7,.8,0) if version!='before' else(-.5,1.9,0);sofa.rotation_euler.z=-math.pi/2 if version!='before' else 0
 camera.location=pos;camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.lens=lens;bpy.context.view_layer.update();regions[name]={}
 for key,point in points.items():
  actual=tuple(sofa.location+Vector((0,0,.7))) if key=='sofa' else point;p=world_to_camera_view(scene,camera,Vector(actual));regions[name][key]=[round(p.x,4),round(1-p.y,4)]
(root/'casework/src/geometry.js').write_text('export const GEOMETRY = '+json.dumps(regions,indent=2)+';\n')
