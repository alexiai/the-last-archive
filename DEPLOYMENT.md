# GitHub Pages deployment checklist

- [ ] Publish the contents of `last-archive/` only. Keep `_private/` (story notes and tests) out of the repository or the published branch.
- [ ] Files that must be present: `index.html`, `style.css`, `story.js`, `content_extra.js`, `engine.js`, `game.js`. The `assets/` folder is optional.
- [ ] No backend, API key, build step or external request is needed. All paths are relative (`assets/...`), so a project site at `https://<user>.github.io/<repo>/` works.
- [ ] Settings > Pages > deploy from branch, root of the folder that contains `index.html`.
- [ ] After deploying, open the live URL on a phone and a laptop: the lock screen should appear and tapping the notification should open Messages.
- [ ] Play to the first evidence save, reload, and confirm progress is kept.
- [ ] Open the Gallery and a contact: with no assets you should see tiles and initials; with assets installed you should see photographs and circular portraits.
- [ ] Run `node tools/audit_assets.js` before publishing and read `ASSET_AUDIT.md`.
- [ ] Open the browser developer console: the only expected failed requests are for asset files you have not added.
- [ ] Test on iOS Safari yourself. It has not been tested here.
Verified here: the project loads and plays correctly when served from a subdirectory (`/repo/`) over HTTP in Chromium. It has not been deployed to GitHub Pages itself.
