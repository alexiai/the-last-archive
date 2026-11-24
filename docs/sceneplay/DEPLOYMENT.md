# Current-edition publishing

The working tree contains the current scene-led edition only. Development stays on `codex/casework-rebuild`; no merge into `main` is part of this workflow.

The repository's existing GitHub Pages environment accepts the approved main-ref publishing workflow. Its fixed file is `.github/workflows/casework-preview.yml`, and that approved workflow checks out the development branch before invoking `tools/rebuild/build_preview.py`. Those two compatibility filenames remain necessary; the entrypoint delegates to `tools/sceneplay/publish_preview.py` and contains no earlier game/build implementation.

The publisher archives `origin/main` into a temporary directory and runs that snapshot's own build tool. It then adds only the current edition, built once from `sceneplay/`, at `/preview/` and `/editions/sceneplay-preview/`. No earlier preview edition is rebuilt or copied from this branch. Old source/runtime copies are recoverable from Git history rather than duplicated in current files.

Stable production assets are audited byte-for-byte. The only allowed stable-root adjustments are the established worker exclusion for `preview/` and its asset-manifest integrity metadata. This prevents an installed production worker from substituting its old index for the current preview. Both current aliases share `lastarchive.sceneplay.v1`; cache scopes remain separate. Publishing must not clear existing or unrelated browser save keys.

Use a checkout with Git history and `origin/main` available:

```sh
git fetch origin main
python3 tools/sceneplay/publish_preview.py --output ../the-last-archive-preview
COMBINED_BUILD=../the-last-archive-preview npm run test:isolation
```

Choose a new output directory. Preview provenance records the stable commit, current commit, root hash and active paths. The isolated publisher is stdlib Python plus Node; it needs no runtime dependency installation or generation service. The committed offline bundle is source/hash checked before publishing.

After pushing, verify the approved publisher, CI, hosted provenance, current asset hashes and actual controller/offline flow. Earlier Git commits remain available; this cleanup does not rewrite history or change the repository's default branch.
