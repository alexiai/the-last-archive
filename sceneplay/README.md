# Scene-led development edition

An in-world opening section for THE LAST ARCHIVE. Source, scene, sound and authored findings are separate modules. The previous casework folder and all its save keys remain intact.

The offline runtime is committed as game.js and indexed by game-build.json. Regenerate it with tools/sceneplay/bundle.mjs using the existing free esbuild development tool, then run the source/media/browser/delivery checks. The publisher checks source and runtime hashes before composing the isolated preview. See PLAYING.md and docs/sceneplay/VALIDATION.md for owner-safe instructions and limitations. Private full-campaign staging remains outside the build.
