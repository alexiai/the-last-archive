# Production review — English, spoiler-free

This branch implements the approved free-only expansion. It is not merged or deployed.

## Cost review

No paid API, commercial TTS service, subscription, account backend, rented GPU or recurring application service is required. Character speech was generated on the local CPU with Kokoro 82M v1.0. Only completed MP3s ship. Music, ambience and effects are original procedural synthesis, with no sample-library subscription or future royalty. The supplied reference images were used as visual inspiration, not copied assets. See AUDIO_CREDITS.txt and the retained upstream notices.

Local generation consumes CPU time, disk space and electricity; those are machine resource costs. Development dependencies and encoding tools are free software. No dependency downloads or model inference occur in the running game. Regenerating speech requires downloading free models into a development directory outside the repository. Do not add paid fallbacks.

Free hosting option: GitHub Pages for this public repository. GitHub documents a 1 GB published-site limit and a soft 100 GB/month bandwidth limit. Standard GitHub-hosted Actions runners are free for public repositories; larger runners can be billed and are not configured here. A private repository, custom domain, third-party host, extra cloud storage or unusually high traffic could introduce charges or service limits: retain the public repository, standard runner, included github.io address, and local/static distribution as the free alternatives. No custom domain, billed hosting or storage has been purchased or configured. Publishing remains explicitly deferred.

Sources: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits and https://docs.github.com/en/billing/concepts/product-billing/github-actions (reviewed 16 November 2026).

## Measured distribution

The allowlisted build currently contains 167 runtime files, approximately **12.42 MB** in decimal units. Finished audio occupies **5.90 MB**: 87 English voice recordings (~4.14 MB) and 12 original music, ambience and effect files (~1.76 MB). This is below the approved initial 25–45 MB audio estimate. Audio uses compressed MP3; character speech is mono 24 kHz at 64 kbit/s. Model weights, voice tensors, uncompressed WAV masters, development tools and private story documentation are excluded. Exact bytes and SHA-256 hashes are generated in dist/asset-manifest.json.

The expanded archive contains 24 investigation challenges, 27 conversations with 180 messages, 102 evidence entries, 11 narrative recordings and 76 recorded interview responses. Documents include actual downloadable PDFs/CSV. Seven additional challenges add record comparison, surveillance timing, alternate-light capture, ridge/tread comparison, route reconstruction and signal interpretation. All new forensic diagrams are explicitly synthetic schematic exercises. The short surveillance media is a labelled analyst timing reconstruction, not real or photorealistic CCTV.

## Compatibility and review limits

The existing lastarchive.v2 save key is retained. Validation migrates older saves and preserves completed original chapter checkpoints. New games require the expanded examinations and decisions. Puzzle drafts, per-subject notes and audio preferences persist. Save backup/import is available.

Audio begins after a user gesture, with independent voice/music/effects controls, transcripts, replay, reduced effects and foreground voice replacement. Full offline readiness is shown only after a verified archive download; interrupted updates preserve the previous archive and saves. Browser storage can still be evicted by the browser or operating system. Export saves for a portable backup.

Automated verification passes 275 gameplay, 125 browser/presentation and 52 production checks (452 total). All 146 audited media/document assets are present. Coverage is documented in TESTING.md. Human listening review, natural playtime measurement, physical iPhone/Safari testing and final visual polish are still release-review work. Automated decoding and speech recognition checks do not establish acting quality. No guaranteed 60–90 minute playtime is claimed.
