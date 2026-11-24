# THE LAST ARCHIVE

The current scene-led psychological detective game: an original animated arrival, an explorable apartment, physical observations, a carried phone and an authored investigative puzzle. This repository contains this edition only. The opening section is playable; the remaining campaign is still in development.

[Play the current preview](https://alexiai.github.io/the-last-archive/editions/sceneplay-preview/) · [Playing instructions](sceneplay/PLAYING.md) · [Validation and limits](docs/sceneplay/VALIDATION.md)

## Repository

- `sceneplay/` — game source, compiled offline runtime, finished assets and vendored Three.js licence.
- `tools/sceneplay/` — current build, production and verification tools.
- `docs/sceneplay/` — current production/provenance records, licences and private narrative authoring files. Private records are excluded from the playable build.
- `.github/workflows/` — verification and preview publishing for this edition.

Earlier editions, duplicated assets and their obsolete tooling have been removed from this branch. Git history retains the earlier commits. No history rewrite or save reset is required.

## Develop

Use Node.js 22.12 or newer, Python 3 and a local Chromium/Chrome installation for browser verification. Dependencies are development tools; playing requires no account, runtime AI or paid service.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:8098/sceneplay/`. After editing runtime source, regenerate the committed browser bundle:

```sh
npm run bundle
npm test
npm run build
```

The standalone offline build is written to `../the-last-archive-build`, outside this repository. Serve that directory over HTTP and run the browser checks:

```sh
python3 -m http.server 8099 --bind 127.0.0.1 --directory ../the-last-archive-build
SCENEPLAY_URL=http://127.0.0.1:8099/ CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
```

See [production instructions](tools/sceneplay/README.md) before changing the shared world, film, photographs or voices. Finished media is committed; frame captures, audio masters and voice weights are not shipped.

## Publishing

Development remains on `codex/casework-rebuild`; it is not merged into `main`. The existing approved publisher keeps stable production intact and serves this edition at `/preview/` and `/editions/sceneplay-preview/`. Both use the existing scene-led save key. Its fixed workflow filename and tiny `tools/rebuild/build_preview.py` entrypoint are retained solely for that publishing contract; neither contains an old game.

The preview publisher reads the stable production snapshot from Git into a temporary directory. Old production source/assets are not duplicated in this branch. [Publishing details](docs/sceneplay/DEPLOYMENT.md).
