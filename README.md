# THE LAST ARCHIVE

A mobile-first, nine-chapter psychological investigation built with HTML, CSS and vanilla JavaScript. Explore a recovered phone, collect evidence, question subjects and reconstruct the available records.

## Play locally

Run `python3 -m http.server 8765` from this directory, then open `http://localhost:8765/`. No runtime packages, server API, account or paid service is required. Progress and notes save in this browser using the existing `lastarchive.v2` key.

## Development

Requires Node 22 or newer for the test dependencies. Run `npm ci`, then `npm test` (275 checks) and `npm run audit:assets`. The browser suites use an installed Chromium (`CHROMIUM_PATH` overrides `/usr/bin/chromium`) and create their own local servers; see TESTING.md.

- `story.js`, `content_extra.js`: preserved narrative data.
- `engine.js`: preserved save validation, progression and gameplay rules.
- `game.js`: original application renderers and interaction handlers.
- `experience.js`: visual presentation, image inspection, dossiers and collected-record timeline; delegates validation to the existing engine.
- `style.css`: shared design system and responsive layouts.
- `assets/`: 23 real local photographs, seven character portraits and one anonymous graphic mark.

## Deployment

Run `npm run build` (or `python3 tools/build_site.py`) and publish **only `dist/`**. Its allowlist excludes private development documentation and solution-bearing tests. The included GitHub Actions workflow publishes this folder when merged to main, provided Pages is configured to use GitHub Actions. See DEPLOYMENT.md.

Recorded audio is not installed. The five original transcripts remain complete, with clearly labelled optional synthesized speech. See ASSETS.md and TESTING.md for production limitations.
