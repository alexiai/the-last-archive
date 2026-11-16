# THE LAST ARCHIVE

A nine-chapter psychological investigation in English, built as a static game with HTML, CSS and JavaScript. The revised narrative is integrated on this review branch. It is not approved for release, merged or deployed.

Run `python3 -m http.server 8765`, then open `http://localhost:8765/`. No runtime packages, account, generation model or paid API are required. The journal, source register, interviews, examinations, evidence board and notes share the existing production interface.

The previous playable version is preserved at `editions/original/index.html`, including its original assets and `lastarchive.v2` save. The revised edition uses `lastarchive.revised.v1`, begins a separate investigation and rejects foreign-edition backup imports. Restarting the revision does not erase the earlier save. Each edition has an explicit offline download within its own scope.

For development, use Node 22+, `npm ci`, an installed Chromium/Chrome and FFmpeg/Poppler (`pdftotext`). `CHROMIUM_PATH` overrides `/usr/bin/chromium`.

```
npm test
npm run test:browser
npm run test:production
npm run audit:assets
npm run build
```

The allowlisted build includes the active edition and the preserved previous edition. It excludes tests, private narrative plans, model weights and WAV masters. `edition.js` contains revised runtime narrative data; `edition_ui.js` integrates its journal, source navigation and decisions. The working engine, archive presentation, audio mixer, static assets and local production tools are reused.

Read [the spoiler-free Phase 1 report](docs/narrative-review/PHASE1_REPORT.md) for verified results, remaining gaps and the blind-playtesting plan. Do not infer playtime, acting quality or physical iPhone compatibility from automated checks.
