# GitHub Pages deployment

**Current instruction: do not merge or deploy.** The following steps are for a later approved release.

1. Run `npm test`, `npm run test:browser`, `npm run test:production`, `npm run audit:assets` and `python3 tools/build_site.py`.
2. Inspect `dist/`: only runtime HTML/CSS/JavaScript, real assets and `.nojekyll` belong here. Private story documentation and test suites must not be included.
3. In repository Settings → Pages, choose **GitHub Actions**. Only after explicit release approval and merging the approved release branch, the supplied workflow builds and publishes `dist/` on a push to main. It may also be run manually.
4. For manual hosting, upload the contents of `dist/` to the static hosting root. No compilation or backend is required.
5. Verify the live `/the-last-archive/` URL on desktop and mobile. Open Gallery and Contacts, collect evidence, write a note, reload and verify persistence.

All runtime references are relative. Local Chromium tests exercised `/repo/` and `/fixture/repo/` paths. The live GitHub Pages site and physical iOS Safari have not been tested.

Use an HTTP server for local saves and audio/image tests. Saves belong to the browser origin; progress on localhost will not automatically transfer to the deployed domain. The preserved edition at `editions/original/` uses the original `lastarchive.v2` saves. The frozen Phase 1 edition at `editions/phase1/` retains `lastarchive.revised.v1`. The active fieldwork edition uses `lastarchive.fieldwork.v1`; compatible Phase 1 progress can be explicitly copied/imported without changing the original save. Unrelated edition imports are rejected. Export each edition’s save before changing origin. Prepare offline access separately in each edition.

The source repository already contained private narrative documentation and tests. The deployment allowlist keeps these out of the published site; it does not remove their earlier repository history.

For review without deployment, `python3 tools/package_playable.py` creates an allowlisted playable ZIP with a local Python 3 launcher. The PR verification workflow uploads the same runtime folder as a three-day GitHub Actions artifact. This neither publishes a site nor invokes the Pages workflow. Public standard-runner verification and this small, short-lived artifact use the repository's existing free public Actions allocation; no paid runner, storage subscription or external runtime is added. Artifact availability expires, so download it for durable local use.

For a same-address review update, close the earlier local launcher, start the extracted updated folder, and refresh the verified archive from Sound / offline if the browser still shows cached older files. Wait for Offline ready and reload; FIELDWORK REVIEW 5 appears in the updated settings. Do not clear local storage. The optional actual-earlier-build upgrade test verifies this path.
