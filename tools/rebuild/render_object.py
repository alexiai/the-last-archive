"""Reuse the apartment's exact bronze mesh for the examination image."""
from pathlib import Path
source=Path(__file__).with_name('render_world.py');exec(compile(source.read_text().split('regions={};points=')[0],str(source),'exec'))
for o in list(bpy.context.scene.objects):
 if o not in bookend and o.type not in ['LIGHT','CAMERA']:o.hide_render=True
scene.cycles.samples=32
cube('examination surface',(1.4,3,.855),(1.5,1.2,.04),material('examination cloth',(.16,.20,.17),.9))
st=cyl('blood-bearing edge',(1.33,2.94,.936),.05,.001,red);st.scale.y=.6
cube('applied custody label',(1.36,2.95,.94),(.11,.045,.004),paper,.002)
text('0416',(1.355,2.95,.944),.013,black)
camera.location=(1.0,2.24,1.55);camera.rotation_euler=(Vector((1.4,3.0,1.02))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.lens=55
scene.render.filepath=str(out/'recovered-object.jpg');bpy.ops.render.render(write_still=True)
