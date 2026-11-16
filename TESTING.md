# Verification of the revised narrative edition

`npm test` runs the original 275 regression assertions against a temporary copy of the byte-identical preserved edition, then the revised engine/journal suite and Phase 1 data/state regressions. The new suite explicitly covers all 36 combinations of interview approach, listening/privacy, public correction and confrontation/referral. Every combination also replays all nine chapters without altering progress. The Phase 1 suite checks partial saves at every chapter boundary. This is a solution-aware automated traversal, not a blind playthrough.

`npm run test:browser` checks the revised build at 320, 390 and 1280 pixels in Chromium: journal/source views, every displayed investigation answer control, transcript-only closure, gesture-started playback, mute, notes and reloads. The additional Phase 1 suite uses real pointer/keyboard sequences at 375, 390, 430 and 1280 pixels to check record filters, media mappings, stable examination controls, replay, source return and persistence.

`npm run test:production` builds the packaged site and checks 63 finished recording hashes/decoding/timed captions, script-to-recording mapping, interrupted downloads, full checksum verification, failed-update preservation, media byte ranges, offline reload, cache eviction, service-worker registration denial and independent legacy/new saves.

`npm run audit:assets` checks active declared source assets. `npm run build` produces only allowlisted runtime files and all three playable editions. The original snapshot is independently checked against SHA-256 hashes recorded before rewriting.

`npm run test:webkit` is an optional local Linux WebKit check when Playwright and its system libraries are available. It is not physical iPhone Safari. Neither mobile viewport emulation nor a WebKit pass establishes iOS audio-session, storage-eviction, safe-area or touch behaviour on an actual device.

Current Phase 1 results and limitations are in docs/narrative-review/PHASE1_REPORT.md. The earlier integration report remains historical. PDF text regression checks require the free Poppler `pdftotext` tool; CI installs it alongside FFmpeg. Human acting/listening quality, literary impact and first-player playtime require human review. The blind protocol is docs/narrative-review/BLIND_PLAYTEST.md.

## Focused fieldwork slice

`npm test` also runs 36 fieldwork checks: authored proof validation and rejected shortcuts, source/position constraints, alternatives, malformed-save handling, retained findings, personal theory roles, compatible progress copying, original-board regression and the complete frozen Phase 1 SHA-256 snapshot. The existing nine-chapter/36-decision traversal now exercises the new campaign gate.

`npm run test:browser` adds 40 checks at 390 and 1280 pixels. Earlier campaign chapters are reached using solution-aware fixtures; the new sequence then uses actual photo positions or accessible inspection locations, document passage buttons, a deliberately unsupported account, a source request, citation cards, revision and a finding. It verifies reloads, source return, theory attachments, layouts and following-chapter progression. This is automated functional testing, not independent blind investigation or a measurement of playtime.

The packaged delivery suite has 24 checks, including offline fieldwork state, source assets and independent archived saves. The extracted ZIP was additionally launched using its actual Python launcher: recording/clipping, theory creation, offline reload, explicit continuation and unchanged Phase 1 save were verified. The launcher itself is a standard-library local HTTP server; native Windows/macOS launcher execution still requires human checking.

Full current totals: 275 legacy + 17 revised + 31 Phase 1 + 36 fieldwork logic/state checks; 138 revised + 68 Phase 1 + 40 fieldwork Chromium checks; 24 delivery checks; 26 optional Linux WebKit checks. Do not sum these as a measure of investigative depth. Exact counts are assertions/check groups, not unique player sessions.
