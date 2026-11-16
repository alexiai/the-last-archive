# THE LAST ARCHIVE

GitHub Pages deployment target: https://alexiai.github.io/the-last-archive/
The deployment workflow verifies the actual published artifact before reporting success. The game is entirely static: browser play requires no Python, backend, account or runtime API. Python remains an optional local-preview server.


A nine-chapter psychological investigation in English, built as a static game with HTML, CSS and JavaScript. The revised narrative and connected investigative fieldwork improvements are integrated on this review branch. Publication to main and GitHub Pages is now authorised; final narrative quality and independent playtime remain subject to player review.

Run `python3 -m http.server 8765`, then open `http://localhost:8765/`. No runtime packages, account, generation model or paid API are required. The journal, source register, interviews, examinations, evidence board and notes share the existing production interface.

Three editions remain playable. The original is at `editions/original/index.html` (`lastarchive.v2`); the approved Phase 1 build is frozen at `editions/phase1/index.html` (`lastarchive.revised.v1`). The active fieldwork build uses `lastarchive.fieldwork.v1`. An explicit continuation control copies compatible Phase 1 progress without overwriting its source. Already-completed investigations remain credited. Each edition has an explicit offline download within its own scope.

For a downloadable local-play build, run `python3 tools/package_playable.py`. Extract the resulting ZIP, then run `python3 START_GAME.py` (Windows: `START_WINDOWS.bat`). Free Python 3 is the only launcher requirement; the game has no runtime packages. Keep the launcher open and use the same browser address/port for existing local saves.

For development, use Node 22+, `npm ci`, an installed Chromium/Chrome and FFmpeg/Poppler (`pdftotext`). `CHROMIUM_PATH` overrides `/usr/bin/chromium`.

```
npm test
npm run test:browser
npm run test:production
npm run audit:assets
npm run build
```

The allowlisted build includes the active edition and both preserved previous editions. It excludes tests, private narrative plans, model weights and WAV masters. `edition.js` contains revised runtime narrative data; `edition_ui.js` integrates its journal, source navigation and decisions. The working engine, archive presentation, audio mixer, static assets and local production tools are reused.

Read [the spoiler-free Phase 1 report](docs/narrative-review/PHASE1_REPORT.md) for verified results, remaining gaps and the blind-playtesting plan. Do not infer playtime, acting quality or physical iPhone compatibility from automated checks.

Read [the spoiler-free fieldwork delivery report](docs/narrative-review/FIELDWORK_DELIVERY.md) for the playable scope, verification and local launch instructions. Private development documentation may contain spoilers; play from the allowlisted package.

The current review adds a connected source follow-up, a two-original comparison desk, a player-built chronology, retained message observations and useful phone search/navigation. Personal theories support groups, pinned accounts, competing copies and editable supporting/challenging/context roles. Existing fieldwork saves remain compatible. See [the spoiler-free continuation delivery](docs/narrative-review/CONTINUATION_DELIVERY.md).

When updating an earlier local download, close its launcher first, start the new folder at the same address, then use Sound / offline → Download this playable edition and reload if the older cached interface remains. The new settings identify FIELDWORK REVIEW 5. Do not clear browser storage to update.

The latest build expands the architectural-plan and CCTV timing examinations, preserves all nine chapters and decisions, and adds differentiated original record designs. Pages serves only the allowlisted runtime build; private development notes and tests are excluded.
