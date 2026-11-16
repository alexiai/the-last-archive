# THE LAST ARCHIVE

A mobile-first, nine-chapter psychological investigation built with HTML, CSS and vanilla JavaScript. Explore a recovered phone, collect evidence, question subjects and reconstruct the available records.

## Play locally

Run `python3 -m http.server 8765` from this directory, then open `http://localhost:8765/`. No runtime packages, server API, account or paid service is required. Progress and notes save in this browser using the existing `lastarchive.v2` key.

## Development

Requires Node 22 or newer for the test dependencies. Run `npm ci`, then `npm test` (275 checks) and `npm run audit:assets`. The browser suites use an installed Chromium (`CHROMIUM_PATH` overrides `/usr/bin/chromium`) and create their own local servers; see TESTING.md.

- `story.js`, `content_extra.js`: original narrative data; `story_expansion.js`: additive English production material.
- `engine.js`: validated, backward-compatible saves and progression.
- `game.js`: original application renderers and interaction handlers.
- `experience.js`: visual presentation, image inspection, dossiers and collected-record timeline; delegates validation to the existing engine.
- `style.css`: original shared component foundations.
- `art-direction.js`, `art-direction.css`: archive-desk composition, distinct media surfaces, cinematic chapter presentation and board focus. See ART_DIRECTION.md and docs/previews/README.md.
- `assets/`: 23 real local photographs, seven character portraits and one anonymous graphic mark.

## Deployment

Run `npm run build` (or `python3 tools/build_site.py`) and publish **only `dist/`**. Its allowlist excludes private development documentation and solution-bearing tests. The included GitHub Actions workflow publishes this folder only after checks pass on main, provided Pages is configured to use GitHub Actions. See DEPLOYMENT.md.

The expanded production branch includes finished local Kokoro recordings, original music/effects, downloadable documents, examinations and opt-in verified offline storage. No AI model ships. See PRODUCTION_STATUS.md for costs, measured size and review limitations. Nothing on this branch has been merged or deployed.
