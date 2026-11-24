# Current edition — asset and production provenance

This record covers assets retained by the current scene-led edition. It replaces links into removed prototype folders. Historical references below identify records in Git history, not files needed by the current build. No model weights, voice masters, capture frames or production executables are distributed with the game.

## Original world, film and interface

`tools/sceneplay/apartment_source.py` is the canonical project-authored Blender apartment source, migrated without changing its geometry from `tools/rebuild/render_world.py` at commit `0e52d1b`. `export_world.py` exports the same named scene into `sceneplay/assets/models/apartment.glb`. Current lighting, additional set dressing, the original articulated supporting character, camera direction and interface are authored in `sceneplay/src/` and `sceneplay/styles/`.

The film and original room photographs are rendered from that shared world. `sceneplay/assets/films/manifest.json` retains the finished film hash, frame count, model hash and complete visual-source hashes. `sceneplay/assets/photos/regions.json` retains actual projected observation coordinates. The score, rain and other effects are synthesized locally from authored signals; no sampled music or effects were added for this edition.

The owner's reference images guide atmosphere, composition, materials and lighting. Their photographs, newspaper layouts, character likenesses, watermarks and logos are not imported as current game assets.

## Retained Iris portrait

The current file `sceneplay/assets/photos/iris.png` is unchanged from the project portrait tracked at `assets/portraits/iris.png` before this cleanup.

SHA-256: `b35111ceedc42820e837a24d552d14b3869e026c53209f94772d97af67ba8253`.

The surviving production brief is `ASSET_PROMPTS.md` at commit `0e52d1b`, section “Character portraits”. Its shared prefix reads:

> Editorial head-and-shoulders portrait photograph, soft directional window light from the left, neutral charcoal-grey seamless background (#2a2d30), desaturated colour grade, subtle film grain, 85mm lens, shallow depth of field, natural skin texture, relaxed neutral-to-serious expression, shoulders square to camera, no jewellery except as described, no text, no watermark.

The recorded Iris-specific brief reads:

> Woman, 27. Dark curly hair tied loosely back, olive skin, calm direct gaze with a trace of fatigue. Charcoal turtleneck.

The historical prompt's age is production history, not the current character biography. The current story and recordings establish Iris as thirty-four. The brief instructed that real people's photographs and celebrity likenesses should not be reused. This is the project's retained description; the surviving ledger does not identify an image provider, generation receipt or separate external-image licence. The cleanup preserves the file and record and does not invent new ownership or reuse terms.

## Finished English speech

The current authored casting in `sceneplay/src/story.js` uses official stock voice IDs `bf_alice`, `bm_daniel` and `bf_emma`. It does not use a cloned actor or voice from the owner's reference images. Output text, duration and file hashes are retained in `sceneplay/assets/audio/manifest.json`. `motion.json` indexes those recordings for amplitude-based mouth movement and recording display; it is not phoneme or performance capture.

The existing free local production pipeline uses Kokoro-82M v1.0 through `kokoro-onnx` and ONNX Runtime. Inputs are `kokoro-v1.0.onnx` and `voices-v1.0.bin`, sourced from the [kokoro-onnx model-files-v1.1 release](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.1). Runtime gameplay plays finished files and performs no inference.

| Component | Upstream terms | Retained notice |
| --- | --- | --- |
| Kokoro-82M v1.0 model and official voice tensors | Apache 2.0; [official model card](https://huggingface.co/hexgrad/Kokoro-82M), [voice list](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md) | [Apache 2.0](licenses/Kokoro-Apache-2.0.txt) |
| kokoro-onnx 0.6.1 | MIT; [source](https://github.com/thewh1teagle/kokoro-onnx) | [MIT](licenses/kokoro-onnx-MIT.txt) |
| ONNX Runtime | MIT; [source](https://github.com/microsoft/onnxruntime) | [MIT](licenses/ONNX-Runtime-MIT.txt) |
| espeakng-loader | MIT; [source](https://github.com/thewh1teagle/espeakng-loader) | [MIT](licenses/espeakng-loader-MIT.txt) |
| eSpeak NG phonemization library | GPL v3 or later; [source](https://github.com/espeak-ng/espeak-ng) | [GPL v3](licenses/eSpeak-NG-GPL-3.0.txt) |

The upstream Kokoro model card acknowledges Koniwa (CC BY 3.0) and SIWIS (CC BY 4.0) training material. These acknowledgements are retained here and in the shipped asset notice. Development libraries, weights and binaries are excluded from the static build. NumPy, SoundFile, Blender and FFmpeg are production tools; their executables are not redistributed with the game. Their use does not make them runtime requirements.

## Browser library and distribution boundary

Three.js 0.169 and its corresponding glTF/geometry helpers are retained locally under the [MIT notice](../../sceneplay/vendor/LICENSE). The committed browser bundle is indexed by `sceneplay/game-build.json`; the offline builder includes the finished runtime assets, `ASSET-LICENSES.md` and the Three.js licence. It excludes private narrative records and all production tooling.

The project owner retains the decision about the game's overall distribution licence. This record does not relicense the game or assert exclusive copyright in synthetic output. The current free-only production/account record is [FREE_PRODUCTION.md](FREE_PRODUCTION.md).
