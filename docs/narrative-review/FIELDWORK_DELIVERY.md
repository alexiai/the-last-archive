# Investigative fieldwork review build — spoiler-free delivery

Status: implemented for play and review, not an approved release. No merge or deployment. This is one complete campaign investigation plus reusable tools, not all of Phase 2.

## What is playable

Original sources open in an enlarged inspection workspace. Keep a detail at its photo position, add a personal note, or retain a specific document passage. The observation notebook and theory board return directly to that source and position/passage. Zooming or opening a source grants no completed discovery.

One existing campaign comparison now requires observations from multiple sources, a tentative account, a requested corroborating record and a cited conclusion. Unsupported accounts can obtain the corroborating source, be challenged and be revised without a dead end. Optional hints and equivalent text inspection remain available. The finding participates in normal chapter progression and can be revisited afterwards.

The working theory board stores personal notes and evidence/observation attachments labelled supporting, challenging or context. Theory status is chosen by the player. Arbitrary text is never automatically graded. The established authored connection board remains available separately.

The presentation reuses existing artwork in contact sheets, source sheets and citation cards, with responsive desktop/mobile layouts. No voice regeneration, large art production or narrative rewrite was attempted.

## Preservation and costs

The active build has a separate save namespace. Frozen Phase 1 and original playable builds retain their own keys and assets. A compatible Phase 1 save can be copied/imported explicitly; the old save is not overwritten. Completed comparisons remain credited rather than forcing replay or inventing observations. For the complete discovery experience, start a new fieldwork investigation.

No paid service, API, model download, account or subscription is required. The launcher uses free Python 3 locally; no Python packages are needed. Existing local audio and artwork are unchanged. The active offline cache is approximately 18.1 MB, including 11.3 MB audio. The complete folder is approximately 61.1 MB because it also preserves both earlier builds; the compressed download is approximately 56.9 MB. Earlier editions are excluded from the active offline download and can be cached separately.

## Verified results

- 275 legacy, 17 revised, 31 Phase 1 and 36 fieldwork logic/state checks pass. Revised tests cover all nine chapters and 36 decision combinations, including replay without changing progression.
- 138 revised, 68 Phase 1 and 40 new fieldwork Chromium checks pass. The new sequence was exercised through real controls at desktop and mobile widths, including an unsupported account, revision, retained finding, reload, source return and subsequent progression.
- 24 packaged-delivery checks pass, including cached fieldwork modules/documents, saved observations/theories, offline reload, recordings and independent edition saves.
- 26 optional Linux WebKit checks pass. This does not establish physical iPhone Safari compatibility.
- Asset audit reports 137 declared assets present and no broken mappings. Both preserved editions are checked against their frozen hashes.
- The extracted playable package was independently launched with its bundled Python server. Source retention, personal theory creation, offline reload and actual continuation controls passed; the prior save remained byte-identical.

No regressions were found in the covered paths. These are solution-aware automated checks, not independent blind playtesting or an assertion that every possible interaction is flawless.

## Remaining limitations and human testing

The remaining campaign activities use their existing mechanics. A general player-built chronology, new CCTV/audio systems, broader examination redesign and bespoke artwork remain outside this slice. Photo observations elsewhere can be retained and attached, but only the redesigned sequence has new authored proof evaluation. Free-form theories are personal investigative tools, not machine-evaluated answers.

Independent first-time players must assess fairness, discoverability, emotional impact, actual duration and whether the new tools feel useful without prompting. Physical iPhone Safari still needs touch, keyboard, audio-session and storage testing. Native Windows/macOS launcher execution has not been exercised on those operating systems; the same Python server was verified on Linux. The 60–90+ minute target has not been measured or claimed.

## Play locally tonight

1. Download the playable ZIP (the PR verification artifact is named THE_LAST_ARCHIVE_PLAYABLE), then extract the entire archive. Do not use the source-code ZIP, which contains private development material.
2. Install free Python 3 if absent. Windows: double-click START_WINDOWS.bat. macOS/Linux: open a terminal in the extracted game folder and run `python3 START_GAME.py`.
3. The browser opens `http://127.0.0.1:8795/index.html`. Keep the launcher running. Do not open index.html as a file.
4. Start a new investigation for the full discovery sequence, or use the explicit Phase 1 continuation/import control. The expanded activity appears through normal campaign progression.
5. For offline use, select Download this playable edition under Sound / offline and wait for Offline ready. Keep the same browser address/port for local saves, and export backups before changing origins.

The PR remains a draft. Stop here for player review before broader Phase 2 work or release.
