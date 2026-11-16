# Revised narrative integration — spoiler-free review

**Status: integrated for review; release approval remains pending. No merge or deployment.** Architectural approval has not been treated as approval of the finished experience. This report deliberately omits identities, secrets, revelations, evidence answers and the ending.

The subsequent [Phase 1 report](PHASE1_REPORT.md) records the critical fixes and current verification. The results below describe the initial integration stage.

## What is integrated

All nine chapters now use the revised narrative, including journal scenes, interviews, source documents, recordings, examinations, deductions, choices and aftermath. The active build loads one revised narrative dataset. The old story expansions are not mixed into the revised runtime.

The rewrite develops relationships through ordinary personal exchanges as well as investigative material. Suspicion and emotional investment are allowed to coexist. Later discoveries revisit earlier sources; changes of interpretation are tied to available records rather than unsupported late exposition. The final act includes space for reaction, choices and aftermath. These are implemented editorial intentions, not independently validated claims of literary excellence.

The existing archive interface, examination tools, evidence board, audio mixer, production scripts, original soundscape and compatible visual assets are retained. There are 15 investigation activities, 41 downloadable source PDFs and 63 newly generated spoken assets (five recordings and 58 interview responses). No artificial duration gate or countdown has been added.

## Narrative consistency and investigative consequences

The private authoring records retain a chronology, character knowledge matrix and clue/revelation map. The integration review reconciled the revised runtime with those records: source custody, dated communications, the distinction between a recording and its delivery, access to records, character knowledge and the sequence of discoveries. One opening-scene custody contradiction was corrected. Technical or clinical evidence states its limits; it does not manufacture certainty beyond the source.

Investigative results unlock records and deductions. Required comparisons draw on sources available at that point. The player must submit interpretations, selections, matches or ordered events; the presence of a screen alone does not count as completion. The evidence board includes a required connection, and journal scenes are part of progression rather than optional text that can silently be bypassed.

Choices affect conversational approach, privacy boundaries, the route through the final discussion and the form of the public response. Essential factual closure remains accessible through alternative approaches. The complete 36-choice combination space passes solution-aware traversal, including transcript-only and referral routes without mandatory interview completion. This establishes reachable closure, not equal dramatic strength across all branches.

Red-herring resolutions, retrospective meaning and the emotional credibility of reactions were reviewed editorially. They still require independent reader/player judgment. No automated test can establish that a reversal is surprising, a relationship believable or an ending memorable.

## Previous edition and saves

The previous playable production version is preserved under `editions/original/` with its original media and documents. SHA-256 comparison verifies that snapshot against the files captured before rewriting.

The previous edition retains `lastarchive.v2`. The revision uses `lastarchive.revised.v1` and starts a new investigation. Cross-edition imports are rejected without overwriting current progress. This is intentional separation rather than an attempt to translate deductions between incompatible stories. Browser checks confirm that both editions keep their own progress on the same origin. Each has its own offline preparation scope. Backups remain advisable before moving between origins or clearing browser storage.

## Verified results

| Check | Result | What it establishes |
|---|---|---|
| Preserved-edition regression suite | 275 assertions passed | Existing edition behavior remains covered independently |
| Revised narrative suite | 16 checks passed | All 36 decision combinations, progression gates, invalid/correct inputs, scene completion, source-note validation, edition separation and snapshot integrity |
| Chromium interface suite | 138 checks passed | Views at 320, 390 and 1280 pixels; displayed answer controls for every activity; transcripts, playback gesture, mute, PDFs, save/reload and foreign-save rejection |
| Packaged delivery suite | 17 checks passed | All 63 voices match hashes and scripts, decode and have bounded caption timing; verified offline download, interrupted download, failed update preservation, byte-range media, offline reload, cache eviction and registration-denial fallback |
| Optional Linux WebKit suite | 26 checks passed | Mobile/desktop viewport layout, transcript/referral completion, explicit media playback and AudioContext start, save/reload, no uncaught exceptions |
| Active asset audit | 135/135 present | No missing declared active assets |
| PDF extraction review | 41/41 passed | Downloadable documents contain their expected text through the end |
| Static build | 336 packaged files | Both editions included; models, WAV masters, tests and private development plans excluded |

These traversals use known answers and are **not blind playthroughs**. Linux WebKit is **not physical iPhone Safari**. Media decoding and script alignment do not establish natural delivery or comfortable listening balance. The browser suite covers fit and functioning controls, not a full accessibility certification.

## Size and cost

Measured packaged sizes use decimal MB:

- Revised audio: **11.30 MB**, comprising approximately 9.54 MB of speech and 1.76 MB of original music/effects.
- Both editions together: **30.46 MB**; the preserved edition accounts for approximately 12.44 MB.
- No generation models or uncompressed masters ship with the game.

Character speech was generated locally with the free Kokoro toolchain. Music/effects use the existing original procedural production assets. Credits and upstream license records remain in the project; no paid content, commercial TTS service, runtime inference, subscription or recurring external dependency was introduced. Existing compatible art is retained with its recorded provenance; the supplied reference pictures were not treated as permission to redistribute third-party images.

Local processing consumes CPU time, disk space and electricity. Hosting is optional: local/static hosting needs no application backend. Public-repository GitHub Pages and standard public Actions runners are the free hosted option within their published limits. A custom domain, paid runner or paid hosting plan is unnecessary and has not been configured. Free hosting is subject to provider limits; no deployment has been performed.

## Remaining gaps before release

1. **Independent narrative and blind gameplay review.** Emotional investment, fair discovery, retrospective surprise, red-herring satisfaction and the final act need fresh players. The author/developer has read the solutions and cannot supply this evidence.
2. **Actual first-playthrough time.** The 60–90+ minute target is unverified. No duration has been inferred from word count, asset count or test execution. Record active reading/listening, reasoning, breaks and interface friction separately.
3. **Physical devices.** Test iPhone Safari and Android Chrome with touch controls, audio interruptions/backgrounding, offline preparation, airplane-mode reload, device storage pressure and safe areas. Quota exhaustion and long-term browser eviction are not certified by the current checks.
4. **Human listening and caption review.** Listen to every generated line for pronunciation, performance, pacing, speaker distinction and clipping; review caption synchronization perceptually. Synthetic speech may need direction and regeneration after that review.
5. **Presentation and accessibility pass.** Some comparisons and surveillance reconstructions remain schematic. They function as investigative tools, but premium visual quality needs human judgment. Test keyboard-only navigation, assistive technology, long sessions and readability on actual devices.

The narrative text and its runtime integration are complete for this review stage. There is no known required route blocked in automated coverage. That is not a claim that the game is ready to release or that another text revision will be unnecessary after playtesting. If the story fails the independent review, improve its causal and emotional substance before generating further media.

## Blind-playtesting plan and release gate

Use the [blind-playtesting protocol](BLIND_PLAYTEST.md): three to five fresh volunteer players, clean saves, no solutions or previous edition, no coaching, multiple choice routes, desktop and physical mobile sessions. Keep detailed case observations private and report only spoiler-free findings to the owner.

Before proposing release, resolve any progression blocker, unsupported mandatory inference, continuity contradiction, inaccessible essential evidence, accidental spoiler or device failure. Establish actual playtime and credible evidence that the characters, pacing and conclusion work. Present those results separately for explicit release approval. **Do not merge or deploy this review branch.**
