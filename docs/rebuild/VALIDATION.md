# Casework development edition: spoiler-free validation

This is a separate playable development edition, not an approved release candidate. The published main game and earlier save namespaces are unchanged. This edition begins a new investigation under `lastarchive.casework.v1`.

## Implemented experience

A detective assignment and voiced briefing lead into an original room. Scene photographs share a single procedural 3D reference. The victim’s phone opens as a separate device with personal conversations, photographs, contact details, call records, voicemail, mail attachments, notes, appointments, saved pages, social posts and recordings. Appropriate material becomes available through discoveries.

The authored nine-chapter route includes source inspection, retained observations, same-angle photograph comparisons, chronological reconstruction, calibrated surveillance stills, forensic comparison, a real audible Morse slate, an indexed mechanism, original-document comparisons, circulation reasoning, background-sound comparison, evidence-based conversations, a supported case, a final confrontation and a staged aftermath. Optional text equivalents and hints remain available. Surveillance stills are labelled as stills.

A working casebook supports notes, personal theories, supporting/contradicting/context evidence, original-source links and a player-maintained chronology. Personal free text is never automatically evaluated as proof. Final private-material decisions produce distinct authored aftermaths while preserving factual closure.

## Verified by automated checks

- 180 authored-logic checks: all nine chapters, required-source availability, incorrect interpretations, marked-image scope, text alternatives, camera-frame requirements, sound-source inspection, save reconstruction, unsupported imports and preservation of earlier saves.
- 57 complete-campaign UI checks: fresh opening to final record, reload after every comparison, all three final decisions, optional final questions, each aftermath and replaying the opening without resetting progress, and an explicitly confirmed fresh start. This is an authored-solution regression, not a blind playthrough.
- Five additional visual-inspection checks use actual image marking under magnification and scrolling, then complete the first finding without a text-location substitute.
- 32 Chromium desktop/mobile interaction checks: phone navigation, messages, calendar, source retention, personal notes, theory roles, focus-independent persistence and layout overflow.
- 18 Linux WebKit desktop/mobile checks: phone search, forensic magnification/input focus, calendar, chronology/source attachments and reloads. Linux WebKit is not a physical iPhone.
- 317 media/source checks: source references, all 18 original views, recording bytes/hashes and correspondence between finished recording scripts and implemented transcripts.
- All 49 new recordings decode in Chromium; explicit in-game briefing playback starts.
- Static web installation, offline reload, saved phone context and cached recordings verified in Chromium.
- The self-contained review copy completes the authored campaign without network asset requests. CI also opens the self-contained HTML as a local file in an unmanaged browser.
- Existing edition logic and its GitHub verification workflow pass independently.

## Manual inspection

The chronology, physical location/camera relationship, source-release chain, independent records, clue prerequisites and distinction between contact, time and attribution received a manual consistency pass. The final pass corrected an incomplete surveillance view, reconciled the circulation drawing with the rendered camera direction, removed a suggested route from an original plan and stopped event cards appearing in already-solved order. This is author-side inspection and does not establish independent player fairness.

## Still unverified

Independent first-time completion time, difficulty, emotional impact, red-herring effectiveness and sustained atmosphere need blind human playtesting. The 2–4 hour target remains unmeasured. Full listening review is still needed for voice performance, pronunciation and mix. Physical iPhone Safari, Android devices and screen-reader use require testing. The rebuilt game has not been deployed to the published GitHub Pages site or verified there. No merge or production deployment has occurred.

The self-contained desktop review build is about 18.8 MB because finished media are embedded. The normal static build is about 13.9 MB; spoken recordings are about 5 MB. Neither includes voice models, WAV masters or production environments. Production uses free local tools; no paid APIs, runtime AI, subscriptions or new recurring services were introduced.

## Blind-playtesting gate

Use a clean save and visible controls only. Testers should not read source code, this edition’s private foundation, puzzle fixtures or walkthroughs. Record actual active play time, source discoveries, unsupported assumptions, hint use, bottlenecks and the clarity of the first objective. Include desktop and physical mobile sessions. Verify factual closure and the aftermath under each decision. Resolve observed confusion and fairness failures before release; do not infer a playtime target from test execution or content counts.
