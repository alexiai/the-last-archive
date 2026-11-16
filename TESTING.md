# Test report — 16 November 2026

## Verified

- `npm test`: all 275 original gameplay assertions pass across nine suites. Includes fresh-save progression through all nine chapters, all 17 puzzles, interview rewards and recovery, evidence reference integrity, malformed/blocked/full storage behavior, hint persistence, all 12 decision combinations and epilogue behavior.
- `npm run test:browser`: 72 existing Chromium checks and 53 new experience checks pass (125 browser checks total). They run against portable temporary HTTP servers. Browser coverage includes 320px and 390px touch emulation plus 1280px desktop, application rendering and overflow, touch target sizes, board drag/pinch/tap/selection, keyboard focus, browser Back, real image loading, missing-image recovery in an isolated copy, notebook reload persistence, reduced motion, evidence source navigation and undiscovered-content gating.
- The original finale browser suite plays the final interview and case-file interactions through UI controls, checks completion, and reloads the save. Earlier progression is automated; this is not a human playthrough.
- `node audit_assets.js`: 31/36 slots present: all 23 photographs and all eight portrait/mark slots; none undersized. Five recorded-audio slots remain missing and clearly labelled in the interface.
- `python3 tools/build_site.py`: only the runtime allowlist and real assets appear in dist/. No tests, private story documentation, development tools or Node dependencies are published.
- Original narrative data and core engine are byte-for-byte unchanged. Asset references and script/style paths work under a repository subdirectory.

## Reproduce

1. Install Node 22+ and Chromium. Set `CHROMIUM_PATH` if it is not `/usr/bin/chromium`.
2. Run `npm ci`, `npm test`, `npm run test:browser`, and `npm run audit:assets`.
3. Run `npm run build` to produce the static deployment folder. Serving the game itself needs no npm dependencies.

The browser runner creates an isolated missing-asset copy, starts a temporary local server and removes the copy afterward. It never deletes shipped assets. Existing browser-suite screenshots are temporary local artifacts and may contain late-game material; do not publish them as promotional screenshots.

## Still outstanding

Physical iOS Safari and Android testing; human investigation/playtime and puzzle-fairness review; actual recorded performances; live GitHub Pages verification after deployment. Chromium touch emulation does not establish real-device compatibility. Browser full-screen support varies; image zoom/drag remains available when full screen is unavailable.

## Art-direction revision

The full gameplay and browser suites were rerun after the composition changes. Added coverage includes board focus and Escape recovery, dialogue choices alongside transcripts, suppression of drawn fallbacks after real image loading, and document transitions out of the device layout. Screen rendering and overflow continue to be checked at 320px, 390px and 1280px. Reference captures at 1440px and 390px are in docs/previews/.
