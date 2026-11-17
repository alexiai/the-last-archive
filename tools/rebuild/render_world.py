"""Project-owned apartment: every photograph is rendered from one coherent scene. Blender 4.x, CPU."""
import bpy,math,json,sys,os
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
from pathlib import Path
root=Path(__file__).resolve().parents[2];out=root/'casework/assets/world';out.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.use_denoising=False;scene.render.resolution_x=1400;scene.render.resolution_y=900;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=90;scene.world.color=(.12,.14,.16)
scene.view_settings.view_transform='AgX'
def material(name,color,rough=.6,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;return m
wall=material('aged sage plaster',(.27,.31,.25));wood=material('walnut',(.15,.075,.035),.37);floor=material('oak planks',(.25,.15,.075),.46);teal=material('woven teal',(.075,.14,.125),.94);rust=material('faded ochre',(.32,.18,.10),.9);linen=material('linen',(.49,.44,.32));brass=material('aged bronze',(.35,.23,.085),.3,.78);black=material('black enamel',(.015,.02,.019),.3);paper=material('paper',(.65,.61,.45));glass=material('glass',(.28,.38,.35),.12);dark=material('shadow',(.025,.035,.03));red=material('old small stain',(.105,.025,.018),.9);marker=material('evidence marker',(.65,.50,.15));blue=material('night window',(.04,.10,.18));cream=material('warm ceramic',(.61,.57,.42),.25)
# Procedural materials are deterministic; no image service or external texture.
for mat,scale,strength in [(floor,4,.15),(teal,140,.16),(wall,7,.09),(wood,6,.12)]:
 nodes=mat.node_tree.nodes;links=mat.node_tree.links;n=nodes.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=scale;b=nodes.new('ShaderNodeBump');b.inputs['Strength'].default_value=strength;b.inputs['Distance'].default_value=.055;links.new(n.outputs['Fac'],b.inputs['Height']);links.new(b.outputs['Normal'],nodes.get('Principled BSDF').inputs['Normal'])
def cube(name,loc,dim,mat,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dim;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
 if bevel:mod=o.modifiers.new('soft edges','BEVEL');mod.width=bevel;mod.segments=3;o.modifiers.new('weighted normals','WEIGHTED_NORMAL')
 return o
def cyl(name,loc,radius,depth,mat):
 bpy.ops.mesh.primitive_cylinder_add(vertices=40,radius=radius,depth=depth,location=loc);o=bpy.context.object;o.name=name;o.data.materials.append(mat);be=o.modifiers.new('edge','BEVEL');be.width=.008;be.segments=2;return o
def text(body,loc,size,mat,rotation=(0,0,0)):
 bpy.ops.object.text_add(location=loc,rotation=rotation);o=bpy.context.object;o.data.body=body;o.data.size=size;o.data.materials.append(mat);o.data.align_x='CENTER';return o
# Floorboards, room walls and a real window opening.
for i in range(28):cube('floorboard',(i*.25-3.375,.25,-.055),(.245,6.5,.1),floor,.007)
for x1,x2 in [(-3.5,-2.85),(-1.65,3.5)]:cube('north wall',((x1+x2)/2,3.5,1.55),(x2-x1,.15,3.1),wall)
cube('door lintel',(-2.25,3.5,2.75),(1.2,.15,.7),wall);cube('east wall',(3.5,.25,1.55),(.15,6.5,3.1),wall)
for y1,y2 in [(-3,.2),(2.3,3.5)]:cube('west wall',(-3.5,(y1+y2)/2,1.55),(.15,y2-y1,3.1),wall)
cube('window below',(-3.5,1.25,.42),(.15,2.1,.84),wall);cube('window above',(-3.5,1.25,2.94),(.15,2.1,.32),wall)
for y in [.2,1.25,2.3]:cube('window frame',(-3.48,y,1.78),(.16,.055,1.95),wood,.01)
for z in [.84,1.78,2.73]:cube('window frame',(-3.48,1.25,z),(.16,2.15,.055),wood,.01)
cube('outside night',(-4,1.25,1.8),(.05,2.8,2.8),blue)
for z in [.18,.8]:
 for loc,dim in [((-.0,3.39,z),(7,.045,.08)),((3.39,.25,z),(.045,6.5,.08))]:cube('wall moulding',loc,dim,wood,.01)
cube('ceiling',(0,.25,3.16),(7,6.5,.12),cream)
# Hall behind the opening; same doorway in every view.
cube('hall floor',(-2.25,5.1,-.05),(1.5,3.2,.1),floor)
for ya,yb in [(3.5,3.6),(4.35,6.7)]:cube('hall west side',(-3.08,(ya+yb)/2,1.5),(.1,yb-ya,3),wall)
cube('stair connection floor',(-4.48,3.95,-.05),(2.8,.75,.1),floor)
for i in range(6):cube('stair tread',(-4.1-i*.26,3.95,.08+i*.08),(.26,.75,.16+i*.16),wood)

for ya,yb in [(3.5,3.6),(4.35,6.7)]:cube('hall side',(-1.42,(ya+yb)/2,1.5),(.1,yb-ya,3),wall)
cube('service corridor floor',(-.25,3.95,-.05),(2.4,.75,.1),floor);cube('service corridor back',(-.25,4.38,1.5),(2.4,.1,3),wall)
for x in [-2.86,-1.64]:cube('door casing',(x,3.40,1.2),(.10,.16,2.4),wood,.02)
cube('door casing',(-2.25,3.4,2.42),(1.3,.16,.12),wood,.02)
door=cube('service door',(-2.75,3.85,1.18),(.09,1.12,2.35),wood,.025);door.rotation_euler.z=-.18
cyl('brass latch',(-2.76,3.38,1.02),.045,.07,brass).rotation_euler.x=math.pi/2
# The apartment-facing opening is south of E1; this view sees only the north entrance.
for xa,xb in [(-3.08,-2.83),(-1.67,-1.42)]:cube('front entrance wall',((xa+xb)/2,6.75,1.5),(xb-xa,.12,3),wall)
cube('front entrance lintel',(-2.25,6.75,2.7),(1.16,.12,.6),wall)
cube('front entrance door',(-2.25,6.70,1.15),(1.12,.075,2.3),wood,.02)
for x in [-2.84,-1.66]:cube('front door frame',(x,6.61,1.18),(.07,.12,2.38),cream,.01)
cube('front door frame',(-2.25,6.61,2.38),(1.25,.12,.08),cream,.01)
cube('push plate',(-1.82,6.60,1.05),(.08,.025,.28),brass,.008)
cube('door lower panel',(-2.25,6.645,.55),(.84,.022,.70),dark,.02)
cube('door upper panel',(-2.25,6.645,1.55),(.84,.022,.70),dark,.02)
cube('hall ceiling',(-2.25,5.1,3.06),(1.72,3.35,.12),cream)
text('FRONT ENTRY',(-2.25,6.59,2.60),.10,cream,(math.pi/2,0,0))

# Shelf and recognizable heavy bookend.
for x in [.25,2.95]:cube('shelf upright',(x,3.24,1.35),(.08,.38,2.6),wood,.015)
for z in [.15,.85,1.55,2.25,2.6]:cube('shelf',(1.6,3.24,z),(2.8,.42,.065),wood,.012)
bookmats=[material('book'+str(i),c) for i,c in enumerate([(.27,.14,.08),(.12,.18,.15),(.42,.35,.22),(.21,.23,.19),(.38,.22,.13)])]
for row,z in enumerate([.2,.9,1.6,2.3]):
 for i in range(12):
  x=.4+i*.19
  if row==1 and 4<=i<=6:continue
  cube('book',(x,3.22,z+.22),(.13,.26,.42+(i%3)*.04),bookmats[(i+row)%5],.008)
bookend=[]
bookend.append(cube('bronze bookend base',(1.38,3.02,.91),(.34,.28,.045),brass,.015));bookend.append(cube('bronze bookend upright',(1.50,3.02,1.04),(.06,.25,.28),brass,.015));bpy.ops.mesh.primitive_torus_add(major_radius=.08,minor_radius=.022,location=(1.46,2.89,1.08),rotation=(math.pi/2,0,0));bpy.context.object.data.materials.append(brass);bookend.append(bpy.context.object)
# Sofa parent allows a real, reproducible change of arrangement.
sofa=bpy.data.objects.new('sofa arrangement',None);scene.collection.objects.link(sofa)
for loc,dim in [((0,0,.30),(2.25,.88,.34)),((0,.36,.69),(2.25,.2,.65)),((-1.04,0,.60),(.20,.88,.48)),((1.04,0,.60),(.20,.88,.48)),((-.5,-.04,.52),(.94,.62,.15)),((.5,-.04,.52),(.94,.62,.15))]:
 o=cube('sofa cushion',loc,dim,teal,.075);o.parent=sofa
for x in [-.85,.85]:
 for y in [-.25,.25]:o=cube('sofa foot',(x,y,.12),(.10,.10,.24),wood,.015);o.parent=sofa
pillow=cube('linen pillow',(.62,.16,.8),(.45,.16,.43),linen,.07);pillow.rotation_euler.y=.12;pillow.parent=sofa
# Table, rug, one glass, a phone, a chair and a warm practical lamp.
cube('rug',(-.2,.0,.018),(3.2,2.1,.025),linen,.03)
for x in [-.7,.7]:
 for y in [-.35,.35]:cube('table leg',(x,y,.27),(.07,.07,.52),wood,.01)
cube('coffee table',(0,0,.55),(1.75,.95,.10),wood,.06)
glassobj=cyl('drinking glass',(.3,.1,.71),.075,.23,glass);cyl('tea',(.3,.1,.67),.065,.12,material('tea',(.18,.085,.025),.15))
bpy.ops.mesh.primitive_torus_add(major_radius=.078,minor_radius=.004,location=(.05,.10,.605));dryring=bpy.context.object;dryring.name='dry glass ring';dryring.scale.z=.15;dryring.data.materials.append(material('dry ring',(.07,.045,.02),.95))
cube('folded personal paper',(-.4,-.05,.61),(.35,.24,.008),paper,.005)
chair=cube('chair seat',(-2,-.8,.43),(.75,.75,.3),rust,.1);cube('chair back',(-2,-.46,.85),(.75,.2,.8),rust,.09)
for x in [-2.28,-1.72]:
 for y in [-1.04,-.56]:cube('chair leg',(x,y,.15),(.07,.07,.3),wood,.01)
cube('phone side table',(2.1,-1,.53),(.65,.55,.08),wood,.03);cube('phone table pedestal',(2.1,-1,.25),(.15,.15,.5),wood,.02)
phone=cube('victim phone',(2.1,-1,.59),(.10,.20,.018),black,.012);phone.rotation_euler.z=-.16
cube('phone screen',(2.1,-1,.600),(.087,.177,.002),material('phone glass',(.035,.065,.06),.1),.008)
cyl('lamp base',(-2.7,2.4,.1),.22,.08,brass);cyl('lamp stand',(-2.7,2.4,.85),.018,1.5,brass)
bpy.ops.mesh.primitive_cone_add(vertices=48,radius1=.32,radius2=.18,depth=.45,location=(-2.7,2.4,1.65));bpy.context.object.data.materials.append(linen)
# A small clock and a paper notice. No arbitrary illegible generated lettering.
cube('wall clock',(.0,3.39,2.35),(.44,.055,.44),cream,.03)
text('12',(-.0,3.353,2.47),.065,black,(math.pi/2,0,0));cube('clock hand',(.0,3.34,2.35),(.012,.012,.14),black)
# Scene markers after removal, deliberately not a graphic body image.
markers=[]
for number,x,y in [('01',-.25,-.78),('02',.7,.65)]:
 o=cube('evidence marker '+number,(x,y,.09),(.16,.12,.17),marker,.01);markers.append(o);o=text(number,(x,y-.063,.07),.065,black,(math.pi/2,0,0));markers.append(o)
stain=cyl('small floor trace',(-.25,-.65,.035),.045,.002,red);markers.append(stain)
# Fixed lighting and camera definitions.
def area(name,loc,power,color,size,target):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.color=color;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();return o
windowlight=area('window daylight',(-3.1,1.1,2.4),520,(.62,.73,1),2.4,(0,0,.5));practical=area('practical lamp',(-2.7,2.35,1.55),115,(1,.62,.29),.45,(-1,1,0));fill=area('room bounce',(1,-2.4,2.7),120,(1,.84,.62),3,(0,1,.5))
area('hall practical',(-2.25,5.7,2.84),210,(1,.83,.57),1.0,(-2.25,6.6,.8))
bpy.ops.object.camera_add();camera=bpy.context.object;scene.camera=camera;camera.data.lens=28;camera.data.clip_end=100
views={
 'scene-wide':((2.75,-4.9,2.05),(-.25,.7,1.0),26,'scene'),
 'scene-reverse':((-3.0,-2.5,1.8),(1.3,1.1,.9),27,'scene'),
 'scene-table':((.9,-1.8,1.8),(.0,.0,.52),42,'scene'),
 'scene-shelf':((1.25,.8,1.35),(1.35,3.1,1.05),48,'scene'),
 'scene-phone':((2.2,-1.5,1.2),(2.1,-1,.58),60,'scene'),
 'scene-door':((-1.2,1.2,1.8),(-2.4,3.45,1.2),45,'scene'),
 'room-before':((2.75,-4.9,2.05),(-.25,.7,1.0),26,'before'),
 'room-prepared':((2.75,-4.9,2.05),(-.25,.7,1.0),26,'prepared'),
 'shelf-before':((1.25,.8,1.35),(1.35,3.1,1.05),48,'before'),
 'window-memory':((1.5,-1.6,1.65),(-3.4,1.3,1.5),37,'before'),
 'hall-camera':((-2.24,4.5,2.5),(-2.25,6.65,1.1),25,'prepared'),
 'opening-night':((2.75,-4.9,2.05),(-.25,.7,1.0),26,'night')}
regions={};points={'sofa':(1.7,.8,.7),'shelf':(1.4,3.1,1.05),'table':(.25,.1,.6),'phone':(2.1,-1,.6),'door':(-2.25,3.45,1.2),'chair':(-2,-.8,.6)}
for name,(pos,target,lens,version) in views.items():
 if '--only' in sys.argv and name!=sys.argv[sys.argv.index('--only')+1]:continue
 if '--quick' in sys.argv:scene.cycles.samples=16;scene.render.resolution_percentage=60
 sofa.location=(1.7,.8,0) if version!='before' else(-.5,1.9,0);sofa.rotation_euler.z=-math.pi/2 if version!='before' else 0
 for o in bookend:o.hide_render=version=='scene'
 for o in markers:o.hide_render=version!='scene'
 windowlight.data.energy=90 if version=='night' else 520;fill.data.energy=50 if version=='night' else 120
 camera.location=pos;camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.lens=lens;scene.render.filepath=str(out/(name+'.jpg'))
 bpy.context.view_layer.update();regions[name]={}
 for key,point in points.items():
  actual=tuple(sofa.location+Vector((0,0,.7))) if key=='sofa' else point;p=world_to_camera_view(scene,camera,Vector(actual));regions[name][key]=[round(p.x,4),round(1-p.y,4)]
 bpy.ops.render.render(write_still=True)
(root/'tools/rebuild/reference-map.json').write_text(json.dumps({'views':views,'regions':regions},indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(root/'tools/rebuild/apartment-reference.blend'))
print('Rendered coherent apartment views; reference metadata is development-only.')
