"""One canonical apartment for realtime play, cinematic cameras and source photographs."""
from pathlib import Path
source=Path(__file__).parents[1]/'rebuild/render_world.py'
exec(compile(source.read_text().split('regions={};points=')[0],str(source),'exec'))
sofa.location=(1.7,.8,0);sofa.rotation_euler.z=-math.pi/2
# Both states are included; the game selects scene/current vs photographed/past.
for o in bookend:o.hide_render=False
for o in markers:o.hide_render=False;o['scene_role']='marker'
for o in bookend:o['scene_role']='bookend'
for o in bpy.data.objects:
 if o.type in {'CAMERA','LIGHT'}:o.hide_viewport=True
# Convert fonts individually: converting a multi-selection can flatten empty
# parents, which would destroy the shared sofa transform used by photographs.
for o in list(scene.objects):
 if o.type=='FONT':
  bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
 if o.type in {'MESH','EMPTY'}:o.select_set(True)
output=root/'sceneplay/assets/models/apartment.glb'
bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',use_selection=True,export_cameras=False,export_lights=False,export_animations=False,export_apply=True,export_extras=True)
print('Realtime canonical apartment exported:',output)
