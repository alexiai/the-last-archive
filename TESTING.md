# Test results (stage 8)

Automated checks, all passing at the time of writing:
- jsdom suites: 275 checks across 9 suites (apps, saves, puzzles, interviews, decisions, content integrity, case file rules, progression from a fresh save).
- Real browser (headless Chromium, mobile emulation): 72 checks across 2 suites at 320px, 390px and 1280px, including a full finale played through real clicks, board drag/pinch/tap with touch events, keyboard focus, Back navigation, blocked and full storage, corrupt saves, missing and installed assets served from a `/repo/` subdirectory.
- All 12 combinations of the three decisions were played to the ending, and each renders the matching epilogue lines.
- The progression test plays every interview by presenting evidence in both possible orders. (An earlier version of this test granted two final interview rewards directly; that shortcut was removed and the test now passes without it.)

Known limitations
- Not tested on real iOS Safari or any physical phone. Touch behaviour was tested with Chromium touch emulation.
- Not deployed to GitHub Pages; only a local subdirectory server was used.
- No human playtest: playtime is an estimate (see REQUIREMENTS.md).
- No real image or audio assets are installed (see ASSETS.md). Asset tests used throwaway fixtures in a copy.
- Speech playback depends on device voices.
