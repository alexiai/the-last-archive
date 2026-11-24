# Current-edition production tools

The playable game uses finished local media. These tools rebuild the current edition; none requires an earlier edition's working tree.

## Build and verify

From the repository root, use `npm ci`, `npm run bundle`, `npm test` and `npm run build`. The standalone build contains only the compiled game, finished assets, offline worker and licence notices. Use a local Chrome/Chromium binary for `npm run test:browser`; set `SCENEPLAY_URL` to the served build and `CHROMIUM_PATH` if needed.

`test_isolation.cjs` needs `COMBINED_BUILD` pointing to a fresh composed-preview directory. [Publishing](../../docs/sceneplay/DEPLOYMENT.md) explains the stable-main boundary and required Git history.

## Shared scene, film and photographs

`apartment_source.py` is the canonical Blender geometry/material source. `export_world.py` exports the current glTF with stable object roles. `sceneplay/src/world.js` adds the shared live scene and cinematic cameras; `officer.js` defines the original animated character.

```sh
blender -b --python tools/sceneplay/export_world.py
npm run dev
FRAME_DIR=/path/outside/repo/frames node tools/sceneplay/capture.mjs
python tools/sceneplay/encode_film.py --frames /path/outside/repo/frames
npm run bundle
npm test
```

Capture expects the repository server on port 8098; override `CAPTURE_URL` and `CHROMIUM_PATH` when necessary. Frames must stay outside this repository. The capture records the complete visual recipe; the encoder rejects incomplete frames or changed world sources. Changing the world, character or shared geometry requires a new coherent render. Do not combine shots from different recipes.

The encoder uses FFmpeg, NumPy and SoundFile. Its original score is generated locally and mixed with the four original introduction WAV masters. Masters default to `/workspace/work/sceneplay-masters`; set `LAST_ARCHIVE_MASTERS` for another location. Raw masters, frames and generated Blender backups are not game dependencies and are not committed.

## Finished speech

`export_audio.mjs` derives the current voice jobs from the authored story. `generate_audio.py` uses the optional local Kokoro ONNX environment, NumPy, SoundFile and FFmpeg. Set `KOKORO_MODEL`, `KOKORO_VOICES` and `LAST_ARCHIVE_MASTERS` to local files/directories; existing workspace defaults remain supported. Model weights are obtained separately under their licences and stay outside the repository. No paid API is used.

After deliberately changing a line, regenerate its finished MP3 and manifest, then run `extract_motion.py` so the speech envelopes and waveform match the recording. Re-render affected film shots as one complete, indexed visual production and run the integrity checks. Finished speech text and source hashes are checked against the actual game story.

Keep the current asset provenance and upstream notices in `docs/sceneplay/` and `sceneplay/ASSET-LICENSES.md` when replacing an asset.
