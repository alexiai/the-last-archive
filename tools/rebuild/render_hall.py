"""Render the completed north entrance from the shared, authoritative room model."""
from pathlib import Path
source=Path(__file__).with_name('render_world.py');exec(compile(source.read_text().split('regions={};points=')[0],str(source),'exec'))
name='hall-camera';pos,target,lens,version=views[name];camera.location=pos;camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.lens=lens;scene.cycles.samples=48
scene.render.filepath=str(out/(name+'.jpg'));bpy.ops.render.render(write_still=True)
