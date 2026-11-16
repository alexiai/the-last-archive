# Phase 1 — critical fixes and investigation experience

16 November 2026 · Spoiler-free · Draft PR #3

**Phase 1 is implemented for review. Release is not approved. No merge or deployment.** This stage repairs existing systems and the timing of investigative confirmation. It does not claim that the game has reached the intended premium standard or 60–90+ minute target.

## Scope inspected before implementation

The starting point was PR #3 at `806ef8c`. The affected systems were the active narrative/source data (`edition.js`), journal/source integration (`edition_ui.js`), map/call controls (`game.js`), calendar/interview rendering (`experience.js`), forensic/social/settings controls (`production.js`), existing completion/save logic (`engine.js`), small-screen CSS, the asset audit and the regression suites. Eighteen affected PDFs were regenerated with the existing local document pipeline. No new artwork, character recording, music, framework, runtime dependency or investigation system was produced.

The original playable edition remains byte-for-byte preserved under `editions/original/`. Its save key remains separate. Existing revised-edition saves continue without a reset; newly required completion flags are derived from already completed work during normal validation. Current notes, choices, solved work and reading positions are retained.

## Changes and evidence

| Approved item | Implemented result | Verification |
|---|---|---|
| Movement panel | Canonical record-holder IDs match the underlying rows. Filters come from recovered data rather than invented empty person entries. Movement appears after its source is recovered, and the case timeline uses the same mapping. | Data/state tests; real filter controls at four widths. |
| Calendar | Weekday offset and month length are calculated from the declared year/month. Highlighted dates are derived from the actual appointments. The appointment list is preserved. | Calendar offset/date-set assertions and browser rendering. |
| Social/media mappings | Posts use explicit references to active gallery records. A compatible existing image was restored to the active register; no new art was generated. Later-source images retain their discovery gates. The asset audit now checks data references, recordings, attachments, documents and archive backgrounds. | All post images load and open in browser tests; 136 declared assets present, zero broken mappings. |
| Misleading feedback | Removed the inactive rapport indicator, unused unsettling-effect control and empty social private-message navigation. Call controls now describe linked recordings without falsely classifying them as voicemail. Contact wording no longer promises a discovery behaviour the data does not use. | Rendered-state assertions and browser checks. |
| Decoding answer exposure | Removed the target from the prerequisite source and its downloadable PDF. Pulse audio, equivalent visual trace and reference alphabet remain. Two distinct hints explain the method without supplying the target. | Source/PDF regression checks; existing answer validation and displayed-control tests. |
| Premature explanation | Reviewed the active source records, nine chapter journals, task wording and interview responses. Selected interpretive commentary appears as review notes after the corresponding deduction; confirmation scenes and recorded responses wait for relevant comparisons. The final worksheet asks questions instead of stating its claims. Accessible specimen descriptions supply observations rather than naming the matching sample. Primary records and qualified source limitations remain available. | Negative gate tests across the investigation; source-review timing tests; all-route completion; editorial/code inspection. Audience fairness remains unverified. |
| Replay | Completed chapters expose journal replay. Previously discussed interview responses can be reviewed independently of the active interview. Existing conversation histories remain available. Replay does not repeat effects, alter choices, move the current reading position or change completion. Earlier disclosures receive contextual acknowledgment in relevant later scenes. | All nine chapters replayed across all 36 decision combinations; real replay controls; interview-state assertions. |
| Mobile interaction | Forensic selections update their live controls instead of rebuilding the screen. Alignment, scroll, focus and selected-state announcements are retained. Older selection controls preserve context; keyboard focus follows a moved event during ordering. Small form text and journal attribution were adjusted within the existing design. | Actual pointer/keyboard sequences at 375, 390, 430 and 1280 pixels; draft reload tests. Physical iPhone behaviour remains unverified. |
| Open source | Derived results reopen their originating examination. Sources provide a return to their evidence record. Existing direct-source renderers remain in use. | Every collected evidence source resolves; originating-examination and real return-control checks. |

## Verification results

| Suite/check | Result | Practical limit |
|---|---|---|
| Preserved-edition regressions | 275 assertions passed | Covers the frozen earlier edition, not the new story's audience response. |
| Revised narrative/state suite | 17 checks passed | All 36 decision combinations reach closure and replay all nine chapters without state changes; traversal uses known answers. |
| Phase 1 data/state regressions | 31 checks passed | Includes source/PDF answer exposure, confirmation timing, mappings, inactive feedback, replay, source links, completed-save compatibility and partial reloads at all nine boundaries. |
| Existing Chromium interface suite | 138 checks passed | Known fixtures exercise displayed controls, media, layout, saves and import rejection. |
| Phase 1 Chromium interaction suite | 68 checks passed | Four widths; actual filtering, loaded social media, forensic pointer/keyboard state, ordering focus, replay, source return and reload. |
| Packaged delivery/offline suite | 20 checks passed | Includes checksummed download, interruption/update failure, offline reload/media, independent editions, and repaired calendar/movement/social/replay while offline. |
| Local Linux WebKit | 26 checks passed | Rendering, explicit playback and persistence; not physical iPhone Safari. |
| Asset audit | 136/136 present; zero broken mappings | Reference and existence checks, not artistic-quality certification. |
| Downloadable document extraction | 41/41 retained expected final text | Verifies complete extraction, not document-design polish. |
| Diff/snapshot checks | Clean whitespace check; preserved snapshot unchanged | No changes to the frozen previous edition. |

These are automated or programmatic tests, including solution-aware fixtures. They are not independent blind playtests. The explanatory-text review is editorial/code inspection. No human acting or emotional-impact result is claimed.

## Regressions and newly discovered issues

No unresolved progression, save, source-navigation or media regression was found in the covered paths. The added checks caught a further keyboard issue during implementation: repeated event-ordering actions could transfer focus to a different item after rebuilding. Focus now follows the moved item, with a repeated-key regression test.

The earlier tests missed several data-to-interface failures because they checked screen width, valid inputs and reachability rather than the actual displayed records. The new regressions check those outcomes explicitly. This does not prove that all possible interface or narrative defects have been eliminated.

Existing saves may already contain information heard before the new confirmation gates. That knowledge is not erased, and previously discussed responses remain reviewable. Required sources and all reasonable completion approaches remain available.

## What remains incomplete

- Deeper multi-source investigation, less obvious alternatives and stronger hypothesis construction remain the next stage. This pass improves information timing; it does not transform every short activity into a sophisticated deduction.
- Bespoke document design, more convincing forensic specimens, environmental/object artwork and broader visual refinement remain deferred.
- Wider narrative voice/pacing refinement remains. Recorded dialogue is unchanged and still exactly matched to its audio; selected confirmation responses were rescheduled rather than silently rewritten.
- Extensive voice direction, soundtrack development, new calls, attachments and other additional systems have not begun.
- Complete accessibility, physical-device and independent narrative/playtime validation remain outstanding.

## Human testing still required

1. Fresh clean-save sessions without coaching or internal solutions: clue discovery, hypothesis formation, confirmation timing, frustration and actual active duration.
2. Independent narrative feedback: distinct character voices, emotional development, fair retrospective understanding and satisfaction with closure.
3. Physical iPhone Safari and Android: touch, input zoom, safe areas, background/audio interruption, long-session saves, offline preparation, airplane-mode reload and storage pressure.
4. Keyboard/screen-reader sessions, especially comparisons, source return, replay and final-case controls.
5. Full listening/caption review on headphones and phone speakers. Technical decoding and alignment do not certify performance quality.

The previous blind-playtesting protocol remains applicable. Preserve the owner's first spoiler-sensitive playthrough; detailed case observations should stay private.

## Cost, packaging and stop boundary

All work uses the existing free/local pipeline. Only the changed PDFs were regenerated. Finished audio is unchanged at **11.30 MB**. The package containing both editions is approximately **30.47 MB**; no AI model or uncompressed voice master ships. Poppler is an additional free development verification tool for checking PDF text, not a runtime dependency. No paid API, subscription, external runtime service or recurring infrastructure dependency was introduced.

**Stop here for Phase 1 review.** Do not begin the larger artwork, deeper gameplay, broad narrative/audio or visual-polish stage without the next approval. Architectural and Phase 1 implementation approvals are not release approval. No merge or deployment, and no claim that 60–90+ minutes has been independently measured.
