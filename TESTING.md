# Verification of the playable review build

`npm test` runs 275 legacy, 17 revised, 31 Phase 1, 36 original-fieldwork, 45 continuation and 14 phone-source checks. The revised campaign suite covers all 36 decision combinations and all nine chapters. The continuation suite independently runs its finding through all 36 routes and verifies read-only replay, source/date consistency, PDF text, save cleaning, rejected shortcuts, malformed references and backward compatibility. These are solution-aware checks, not blind playtesting.

`npm run test:browser` runs 138 revised, 68 Phase 1, 40 original-fieldwork and 108 continuation checks. The continuation is exercised through actual source, message, attachment, desk, chronology, citation, hypothesis and board controls at 320, 390 and 1440 pixels. Earlier campaign chapters are reached using known fixtures. Coverage includes keyboard focus, stable controls, saved drafts, unsupported accounts, source return, phone search, recordings, role editing and subsequent campaign completion.

`npm run test:production` builds the packaged site and runs 28 delivery checks: 63 recording hashes/decoding/captions, script mappings, interrupted downloads, checksum-failed updates, media ranges, verified offline reload, current observations/theories/findings, phone search and attachments, denied storage/registration and independent archived saves. Run package generation after this suite; both processes intentionally rebuild `dist/` and must not mutate it concurrently.

`npm run audit:assets` reports 139/139 declared assets and zero broken mappings. `npm run build` excludes private plans, tests, model weights and WAV masters, while preserving the earlier editions. Frozen original and Phase 1 builds are checked against their SHA-256 snapshots.

`npm run test:webkit` is optional and needs a local Playwright WebKit installation. The current Linux WebKit run passed 48 checks, including the complete new reconstruction, source desk, message citations, roles, saves, phone attachment search, layouts and recorded playback. It is not physical iPhone Safari.

`PREVIOUS_BUILD=/path/to/extracted/earlier/fieldwork npm run test:upgrade` is an optional nine-check test against the actual earlier playable package. It verifies the earlier offline cache, a same-address update through the existing download control, preserved progress/notes/theories, new source access and a subsequent offline reload. It requires the real pre-continuation fieldwork package; it does not fabricate an older runtime.

The playable ZIP is additionally launched with its bundled standard-library Python server and tested as an extracted package. Native Windows/macOS launcher execution and physical iPhone touch/audio/storage behaviour remain human checks. Poppler (`pdftotext`), FFmpeg and Chromium are development tools only; CI installs the first two and uses Chrome. The game needs no runtime packages or AI model.

Independent first-player fairness, emotional impact, listening quality and 60–90+ minute duration remain unmeasured. Counts denote assertion/check groups, not minutes of play or proof of premium quality. The existing blind protocol is docs/narrative-review/BLIND_PLAYTEST.md.

## Architectural and timing publication checks

`npm test` additionally checks geometry, alternative valid frame positions, rejection of empty frames/false timing claims, source-version comparison, measured openings, ordered routes, draft/save compatibility, derived-source navigation and complete PDF wording for all five restyled records.

The new production browser suite exercises both expanded investigations through actual controls at 320, 390 and 1280 pixels, using the built allowlisted site under `/the-last-archive/`. It checks false hypotheses, ruler computation, both originals/overlay, frame retention, persistence, progression and responsive layouts. GAME_URL selects the deployed site for the same UI checks.

`npm run test:live` requires GAME_URL and verifies the actual Pages runtime, every active published asset checksum, repository-scoped storage/service worker, offline preparation/reload and preserved editions in an isolated browser. The Pages workflow also runs the standalone live checksum verifier after deployment. Physical iPhone and blind-player duration remain separate human checks.
