# Verification of the revised narrative edition

`npm test` runs the original 275 regression assertions against a temporary copy of the byte-identical preserved edition, then the revised engine/journal suite. The new suite explicitly covers all 36 combinations of interview approach, listening/privacy, public correction and confrontation/referral. This is a solution-aware automated traversal, not a blind playthrough.

`npm run test:browser` checks the revised build at 320, 390 and 1280 pixels in Chromium: journal/source views, every displayed investigation answer control, transcript-only closure, gesture-started playback, mute, notes and reloads.

`npm run test:production` builds the packaged site and checks 63 finished recording hashes/decoding/timed captions, script-to-recording mapping, interrupted downloads, full checksum verification, failed-update preservation, media byte ranges, offline reload, cache eviction, service-worker registration denial and independent legacy/new saves.

`npm run audit:assets` checks active declared source assets. `npm run build` produces only allowlisted runtime files and both playable editions. The original snapshot is independently checked against SHA-256 hashes recorded before rewriting.

`npm run test:webkit` is an optional local Linux WebKit check when Playwright and its system libraries are available. It is not physical iPhone Safari. Neither mobile viewport emulation nor a WebKit pass establishes iOS audio-session, storage-eviction, safe-area or touch behaviour on an actual device.

Current numerical results and explicit limitations are recorded in docs/narrative-review/INTEGRATION_REPORT.md. Human acting/listening quality, literary impact and first-player playtime require human review. The blind protocol is docs/narrative-review/BLIND_PLAYTEST.md.
