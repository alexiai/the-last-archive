# Casework development edition: spoiler-free validation

This is a separate playable development edition, not an approved release candidate. The published main game and earlier save namespaces are unchanged. This edition begins a new investigation under `lastarchive.casework.v1`.

## Implemented experience

A detective assignment and voiced briefing lead into an original room. Scene photographs share a single procedural 3D reference. The victim’s phone opens as a separate device with personal conversations, photographs, contact details, call records, voicemail, mail attachments, notes, appointments, saved pages, social posts and recordings. Appropriate material becomes available through discoveries.

The authored nine-chapter route includes source inspection, retained observations, same-angle photograph comparisons, chronological reconstruction, calibrated surveillance stills, forensic comparison, a real audible Morse slate, an indexed mechanism, original-document comparisons, circulation reasoning, background-sound comparison, evidence-based conversations, a supported case, a final confrontation and a staged aftermath. Optional text equivalents and hints remain available. Surveillance stills are labelled as stills.

A working casebook supports notes, personal theories, supporting/contradicting/context evidence, original-source links and a player-maintained chronology. Personal free text is never automatically evaluated as proof. Final private-material decisions produce distinct authored aftermaths while preserving factual closure.

## Verified by automated checks

- 208 authored-logic checks: all nine chapters, required-source availability, incorrect interpretations, marked-image scope, text alternatives, camera-frame requirements, sound-source inspection, save reconstruction, unsupported imports and preservation of earlier saves.
- 59 complete-campaign UI checks: fresh opening to final record, reload after every comparison, all three final decisions, optional final questions, each aftermath and replaying the opening without resetting progress, and an explicitly confirmed fresh start. This is an authored-solution regression, not a blind playthrough.
- Five additional visual-inspection checks use actual image marking under magnification and scrolling, then complete the first finding without a text-location substitute.
- 43 Chromium desktop/mobile interaction checks: phone navigation, messages, calendar, source retention, personal notes, theory roles, focus-independent persistence and layout overflow.
- 18 Linux WebKit desktop/mobile checks: phone search, forensic magnification/input focus, calendar, chronology/source attachments and reloads. Linux WebKit is not a physical iPhone.
- 481 media/source checks: source references, all 18 original views, recording bytes/hashes and correspondence between finished recording scripts and implemented transcripts.
- All 51 finished recordings decode in Chromium; explicit in-game briefing playback starts.
- Static web installation, offline reload, saved phone context and cached recordings verified in Chromium.
- The self-contained review copy completes the authored campaign without network asset requests. CI also opens the self-contained HTML as a local file in an unmanaged browser.
- Existing edition logic and its GitHub verification workflow pass independently.

## Manual inspection

The chronology, physical location/camera relationship, source-release chain, independent records, clue prerequisites and distinction between contact, time and attribution received a manual consistency pass. The final pass corrected an incomplete surveillance view, reconciled the circulation drawing with the rendered camera direction, removed a suggested route from an original plan and stopped event cards appearing in already-solved order. This is author-side inspection and does not establish independent player fairness.

## Still unverified

Independent first-time completion time, difficulty, emotional impact, red-herring effectiveness and sustained atmosphere need blind human playtesting. The 2–4 hour target remains unmeasured. Full listening review is still needed for voice performance, pronunciation and mix. Physical iPhone Safari, Android devices and screen-reader use require testing. The isolated preview is live at https://alexiai.github.io/the-last-archive/preview/; the root game remains unchanged. The primary and fallback preview URLs were exercised in Chromium and Linux WebKit. No development game code was merged into main; main contains a narrowly scoped preview-publishing workflow because the Pages environment only permits that ref. Physical-device Safari audio is not certified: the Linux WebKit runner cannot create its media temporary file.

The self-contained desktop review build is about 25 MB because finished media are embedded. The normal static build is about 18.8 MB; spoken recordings are about 5.4 MB. Neither includes voice models, WAV masters or production environments. Production uses free local tools; no paid APIs, runtime AI, subscriptions or new recurring services were introduced.

## Blind-playtesting gate

Use a clean save and visible controls only. Testers should not read source code, this edition’s private foundation, puzzle fixtures or walkthroughs. Record actual active play time, source discoveries, unsupported assumptions, hint use, bottlenecks and the clarity of the first objective. Include desktop and physical mobile sessions. Verify factual closure and the aftermath under each decision. Resolve observed confusion and fairness failures before release; do not infer a playtime target from test execution or content counts.

## Preview development continuation

An optional indexed-recording comparison uses original and delivered recordings, measured amplitude displays, real seeking and clickable transcript positions. It requires inspected sources and an authored bounded interpretation, then retains exact source spans and unlocks a follow-up conversation. Existing completed saves can play it without losing closure. An existing document comparison now uses independently inspectable original records; historical proofs remain valid and can be upgraded on replay.

11 additional checks cover actual audio playback/seek, incorrect interpretations, source retention, follow-up and earlier completed-save preservation. A separate old-service-worker test reproduces and fixes the production navigation-cache conflict, verifies the fallback URL, preserves the production save and shares the preview save between aliases. Offline tests cover normal/suffix byte ranges and invalid-range responses.

The opening now presents tangible assignment materials; phone messages, attachments and appointments reopen at their native source. Phone search/calendar context survives reload. Reduced-motion preferences remain respected. These are author-side functional and layout checks, not a blind assessment of cinematic quality or emotional impact.

## Cinematic and surveillance continuation

A 38-second H.264 opening is integrated before the existing briefing, with an original synthesized score, environmental texture, camera drift and coherent canonical room views. It is an editorial sequence from original renders, not live-action or a fully animated cutscene. Inline playback, pause, mute, equivalent transcript, skip/read controls and reduced-motion behaviour are implemented. No essential evidence is exclusive to the film. Replay opening in Settings preserves campaign progress.

The existing hotel investigation now includes nine original one-second samples from the same 3D environment, a silent sampled video, playback, one-second stepping, accessible descriptions and exact sample retention/reopening. No interpolated action, fake camera audio or fabricated corruption is claimed. Recorder metadata is kept distinct from corrected chronology. The timing comparison requires the central crossing; unrelated marked pixels do not establish it, while equivalent text inspection remains available. Older completed proofs remain valid. A contradictory visual-description timestamp was corrected, and the calibration source no longer supplies the crossing timestamp before inspection.

The physical investigation wall displays actual retained observations and personal theories, with supporting, contradicting and context strings. Pins can be arranged with pointer/touch or keyboard/nudge controls. Position data is saved without altering evidence, personal notes, authored findings or progression. Opening an attached source reopens its original, including the exact retained surveillance sample. Personal theory statuses remain explicitly self-assessed.

46 new functional checks cover real film and surveillance playback, caption timing, mute/pause, transcript/read alternatives, reduced motion, mobile controls, original-frame retention/reopening, saved wall positions and earlier completed saves. Offline checks now include byte ranges from both films. Finished media are indexed by hash; both films were checked with ffprobe for H.264 compatibility, duration and intended audio tracks. Physical iPhone playback and subjective cinematic quality still require human testing. No watermark or third-party artwork from owner references is distributed.

Seven additional checks install the actual preceding preview (commit 1f3131f), retain observations and notes, activate the new worker, use the update notice and verify the new wall plus actual film playback after an offline reload. This is a real upgrade exercise, not only a fresh-install test.
