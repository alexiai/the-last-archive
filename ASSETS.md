# Production asset update

Finished English recordings are now installed: 11 narrative clips and 76 interview responses. Twelve original procedural music/effect assets are included. All are local MP3s; runtime speech synthesis is no longer required. Exact records: audio_manifest.json and sound_manifest.json.

The build is approximately 12.42 MB, including 5.90 MB audio. No model weights or WAV masters ship. See PRODUCTION_STATUS.md, AUDIO_CREDITS.txt and ASSET_AUDIT.md for current provenance and limitations. The following earlier image-stage record is retained as history; any statement that audio is absent is superseded by this update.

# Local visual assets

Installed: **23 photographic images, seven character portrait images, one deliberately graphic anonymous mark**. All photographic assets were generated specifically from the repository's existing asset brief; no stock images or external runtime image URLs are used.

- `assets/photos/<id>.jpg`: 1200 × 640 JPEG, individually generated. The related image variant uses the original as its edit reference. Narrative timestamps remain HTML metadata.
- `assets/portraits/<id>.png`: 512 × 512 PNG. The same portrait file is reused in contacts, interviews and dossiers. The anonymous mark is a custom graphic, not a face.
- `assets/audio/<id>.mp3`: five recording slots remain unfilled. The game retains complete original transcripts and honestly labelled optional synthesized playback. No blank or substitute MP3 files are shipped.

Run `node audit_assets.js` to regenerate ASSET_AUDIT.md from real files and dimensions. ASSET_PROMPTS.md supplies the per-file production descriptions. The actual runtime visual payload is approximately 6 MB.

Gallery images support full-screen viewing where the browser provides it, pinch/zoom and drag inspection, and comparison of available related images. Contact and investigation views reuse portrait mappings; `j` maps to `julia.png`. Evidence IDs and source metadata are unchanged.

Missing images retain labelled fallbacks. Browser tests deliberately remove three files in a separate copy to verify recovery; the shipped files are real and complete. Map and UI symbols are intentional vector interface graphics, not substitute photographs.
