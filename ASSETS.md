# Visual and audio assets: accurate inventory

**Status: no real images or audio files are installed.** The environment that built this project has no image or audio generation, so nothing was generated and no placeholder files were created to look like assets. The game is fully playable without them: every image slot has a working fallback.

| Kind | Expected files | Actual files present | Fallback when missing |
|---|---|---|---|
| Portraits (`assets/portraits/<id>.png`) | 8 | 0 | Circular initials avatar |
| Photographs (`assets/photos/<id>.jpg`) | 23 | 0 | 5 original photos: drawn placeholder; 18 added photos: labelled "Photo not installed" tile |
| Audio (`assets/audio/<id>.mp3`) | 5 | 0 | Browser speech synthesis (a synthesized voice, not a recording) plus a full transcript |

The full per-file list, with real dimensions once files exist, is in `ASSET_AUDIT.md`. Regenerate it any time with `node tools/audit_assets.js`.

## How to install the real assets
1. Generate or commission the files using `ASSET_PROMPTS.md` (exact filenames, sizes, prompts, shared style, character reference descriptions, negative prompts).
2. Put them at exactly these paths: `assets/portraits/<id>.png` (256x256 or larger, square) and `assets/photos/<id>.jpg` (1200x640 or larger, 15:8). Optional recordings: `assets/audio/<id>.mp3`.
3. Run `node tools/audit_assets.js`. It reports actual files, missing files, real pixel dimensions, files that are too small, and where each asset is used.
4. No code changes are needed. Paths are relative, so they work from a GitHub Pages project subdirectory.

## What the game does with them
Photographs are shown with `object-fit: cover` inside a fixed 15:8 frame, with alt text; zoom stays clipped inside the frame. Portraits are clipped to circles with `object-fit: cover` and alt text "Portrait of <name>". A missing file is removed silently and the fallback underneath stays visible. Metadata (time, place, file name) is always rendered by the game in HTML, so it must not be baked into images. No puzzle depends on an image being present.

## Pipeline test (not an asset)
During testing, throwaway flat-colour fixtures of the correct sizes were placed in a *copy* of the project, served from a `/repo/` subdirectory, to prove that real files load, are cropped and clipped correctly, and that deliberately missing files fall back cleanly. Those fixtures are not part of this project.

## Audio
The five clips in the Audio app are **synthesized speech with transcripts**, not recordings. If `assets/audio/<id>.mp3` exists the app plays it with standard controls; otherwise it shows an honest note and offers synthesized playback. On devices without speech synthesis the transcript is shown.
