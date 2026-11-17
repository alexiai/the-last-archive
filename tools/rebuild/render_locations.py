"""Original supporting locations. Offline Blender CPU; no remote assets."""
import bpy,math
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[2];out=root/'casework/assets/world'
def mat(name,c):
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);return m
def box(name,p,d,m):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=name;o.dimensions=d;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);return o
def label(s,p,size,m,rot=(math.pi/2,0,0)):
 bpy.ops.object.text_add(location=p,rotation=rot);o=bpy.context.object;o.data.body=s;o.data.size=size;o.data.materials.append(m)
def light(p,power,target):
 bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.data.energy=power;o.data.size=4;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
def setup():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=False;s.render.resolution_x=1400;s.render.resolution_y=900;s.render.resolution_percentage=100;s.render.image_settings.file_format='JPEG';s.render.image_settings.quality=90;s.world.color=(.13,.16,.14);return s
def render(s,name,pos,target,lens=35):
 bpy.ops.object.camera_add(location=pos);c=bpy.context.object;c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();c.data.lens=lens;s.camera=c;s.render.filepath=str(out/(name+'.jpg'));bpy.ops.render.render(write_still=True)
s=setup();wall=mat('hotel cream',(.43,.44,.36));dark=mat('hotel door walnut',(.09,.065,.04));floor=mat('slate',(.15,.19,.18));metal=mat('brushed brass',(.4,.32,.16));white=mat('ivory',(.8,.8,.65));human=mat('indistinct coat',(.035,.05,.05))
box('corridor floor',(0,3,-.08),(4,10,.15),floor);box('left wall',(-2,3,1.6),(.12,10,3.2),wall);box('right wall',(2,3,1.6),(.12,10,3.2),wall);box('end',(0,8,1.6),(4,.12,3.2),wall);box('ceiling',(0,3,3.25),(4,10,.1),wall)
for y in [0,3,6]:
 box('guest door',(1.92,y,1.1),(.08,1.1,2.2),dark);box('door handle',(1.85,y-.4,1),(.1,.14,.04),metal)
box('listening room door',(-1.93,4,1.15),(.08,1.25,2.3),dark)
label('AURELIA',(0,7.91,2.3),.25,metal);label('PRIVATE LISTENING',(0,7.9,1.9),.11,dark)
light((0,1,3),320,(0,1,0));light((0,6,3),350,(0,6,0))
render(s,'hotel-0',(-1.8,-1.5,2.8),(.3,4,1.1),23)
figure=[]
figure.append(box('coat silhouette',(.1,3.8,1),(.43,.26,.9),human));bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,radius=.14,location=(.1,3.8,1.58));bpy.context.object.data.materials.append(human);figure.append(bpy.context.object)
for x in [-.02,.22]:figure.append(box('leg',(x,3.8,.33),(.12,.15,.65),human))
render(s,'hotel-4',(-1.8,-1.5,2.8),(.3,4,1.1),23)
for o in figure:o.hide_render=True
render(s,'hotel-8',(-1.8,-1.5,2.8),(.3,4,1.1),23)
for name in ['archive-room','station-desk']:
 s=setup();green=mat('paint',(.16,.23,.19));wood=mat('table',(.20,.10,.045));paper=mat('paper',(.7,.67,.52));black=mat('equipment',(.025,.035,.029))
 box('floor',(0,0,-.1),(8,7,.2),wood);box('wall',(0,3,1.7),(8,.15,3.4),green);box('work table',(0,0,.85),(3.5,1.7,.12),wood)
 for x in [-1.5,1.5]:
  for y in [-.6,.6]:box('table leg',(x,y,.4),(.12,.12,.8),black)
 for i in range(5):box('original record',(-.8+i*.35,.1,.93+i*.002),(.55,.7,.01),paper)
 if name=='archive-room':
  for x in [-2.5,-1.5,-.5,.5,1.5,2.5]:
   for z in [.5,1.3,2.1]:box('archive box',(x,2.5,z),(.85,.7,.6),paper)
  box('reel deck',(.8,.2,1.02),(.9,.5,.15),black)
 else:
  box('interview chair',(0,1.5,.5),(.8,.7,.2),green);box('chair back',(0,1.85,1),(.8,.1,1),green)
 light((-2,-1,3),500,(0,0,0));light((2,1,3),250,(0,1,0));render(s,name,(2.7,-4.8,2.5),(0,.6,1),32)
