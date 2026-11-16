# GitHub Pages publication

Publication is explicitly authorised in the current task. PR #3 targets main. The game uses relative assets, local browser saves and a service worker scoped to its repository path; no backend or Python process is needed for hosted play.

The main push workflow `.github/workflows/pages.yml` runs the full verification suite, builds the allowlisted static output, requests Pages configuration, uploads and deploys it, then runs `tools/check_live_static.py` against the actual deployment URL. This compares all active live asset checksums with the exact built manifest and checks preserved editions. A successful local build is not treated as a deployment.

If repository settings reject automatic Pages enablement, the owner must open Settings → Pages → Build and deployment → Source → GitHub Actions, then rerun the Publish static game workflow on main. Never claim the game is published before the live URL and browser checks pass.

Deployment target: https://alexiai.github.io/the-last-archive/

For browser verification after publication: `GAME_URL=https://alexiai.github.io/the-last-archive/ npm run test:live`. The new production puzzle suite also accepts GAME_URL for actual-live controls testing. Local test dependencies are development-only.

Local saves and hosted saves have different browser origins. Export a backup from the local edition and import it through Sound / offline on the hosted edition. Earlier original and Phase 1 editions retain their own namespaces and paths. Do not clear browser storage to update. If an earlier hosted offline build is cached, download the updated archive in Sound / offline and reload after Offline ready.

Private plans, tests, model weights and WAV masters are excluded from the Pages artifact. Both frozen earlier editions remain in the output and are cached separately. No custom domain, paid hosting or runtime external services are configured.
