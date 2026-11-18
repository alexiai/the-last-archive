# Isolated browser preview

Primary: https://alexiai.github.io/the-last-archive/preview/

Fallback for an older installed root worker: https://alexiai.github.io/the-last-archive/editions/casework-preview/

Dev pushes dispatch a publisher on main because the existing Pages environment permits only main. That infrastructure-only workflow checks out codex/casework-rebuild, builds the stable main snapshot and adds the development edition under two directories. It checks every stable manifest file for byte equality; only the root worker preview exclusion and its integrity metadata change. preview-provenance.json records both commits. Development game code is not merged into main.

Both preview paths use lastarchive.casework.v1. Production and archived editions keep their existing save keys. Worker caches are scoped by path. Updates offer a save-and-reload notice. Cache installation follows the opening render; audio supports cached byte ranges.

Automatic verification no longer uploads duplicate downloadable archives. Manual verification can still produce a self-contained desktop review copy. Existing review artifacts are left intact and retain their original expiry dates. No new hosting, runtime API or paid production dependency is used.
