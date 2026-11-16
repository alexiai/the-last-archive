# GitHub Pages deployment

1. Run `npm test`, `npm run audit:assets` and `python3 tools/build_site.py`.
2. Inspect `dist/`: only runtime HTML/CSS/JavaScript, real assets and `.nojekyll` belong here. Private story documentation and test suites must not be included.
3. In repository Settings → Pages, choose **GitHub Actions**. After reviewing and merging the UI branch, the supplied workflow builds and publishes `dist/` on a push to main. It may also be run manually.
4. For manual hosting, upload the contents of `dist/` to the static hosting root. No compilation or backend is required.
5. Verify the live `/the-last-archive/` URL on desktop and mobile. Open Gallery and Contacts, collect evidence, write a note, reload and verify persistence.

All runtime references are relative. Local Chromium tests exercised `/repo/` and `/fixture/repo/` paths. The live GitHub Pages site and physical iOS Safari have not been tested.

Use an HTTP server for local saves and audio/image tests. Saves belong to the browser origin; progress on localhost will not automatically transfer to the deployed domain. Existing v2 saves on the same deployed origin remain compatible.

The source repository already contained private narrative documentation and tests. The deployment allowlist keeps these out of the published site; it does not remove their earlier repository history.
