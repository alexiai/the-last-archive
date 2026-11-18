# Scene-led edition: original production and licences

The apartment is a shared project-owned Blender reference, exported once as glTF for the real-time world. The source photographs and moving-camera film are rendered from that same scene. The footage uses genuine perspective camera movement, a moving door and an animated staged character; it is not a still-image zoom sequence. Finished assets ship; production scripts and capture frames do not.

Original surfaces, additional room details, character geometry, camera direction, sound synthesis and interface graphics are authored in the sceneplay sources. Owner-supplied images guide the low-key light, aged materials, close observation and restrained colour palette. No watermarked stock image or third-party character from those references is redistributed.

The preserved Iris portrait is a project asset from the earlier edition; see its provenance records. It is used consistently in the room. Finished English voices are made locally using Kokoro ONNX, with no runtime inference or paid TTS. Kokoro-82M is Apache-2.0, kokoro-onnx is MIT. No model weights ship.

Three.js 0.169 is vendored locally under its MIT licence (vendor/LICENSE). There is no CDN or remote runtime dependency. glTF loading helpers are from the same version. The game requires WebGL 2, which current iPhone Safari and desktop browsers support. Physical-device performance remains a test requirement.

The original cinematic score, rain, latch, room clock and footstep sounds are locally synthesized. FFmpeg and Blender are offline production tools, not requirements for playing. All runtime files are static and use relative paths.
