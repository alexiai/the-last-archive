# English audio study and expanded production proposal

**Status: approval requested. No game implementation changes.** The existing game, narrative, progression and deployment configuration remain unchanged. This branch contains a plan and spoiler-free voice auditions only.

## Listen first

All six clips speak this neutral English audition text. It is **not game dialogue**:

> I left a message yesterday. Please call me when you have a moment. I need to check something with you.

| Sample | Voice and language | Listen/download | Purpose |
|---|---|---|---|
| A | Kokoro `af_heart`, American English | [MP3](auditions/A-dry.mp3) · [WAV](auditions/A-dry.wav) | Dry voice comparison |
| B | Kokoro `af_bella`, American English | [MP3](auditions/B-dry.mp3) · [WAV](auditions/B-dry.wav) | Dry voice comparison |
| C | Kokoro `am_michael`, American English | [MP3](auditions/C-dry.mp3) · [WAV](auditions/C-dry.wav) | Dry voice comparison |
| D | Kokoro `bm_george`, British English | [MP3](auditions/D-dry.mp3) · [WAV](auditions/D-dry.wav) | Dry voice comparison |
| B / room | Same B performance | [MP3](auditions/B-room.mp3) · [WAV](auditions/B-room.wav) | Light, short room reflections; no telephone band-pass |
| C / telephone | Same C performance | [MP3](auditions/C-phone.mp3) · [WAV](auditions/C-phone.wav) | Telephone band-pass, mild saturation and low synthetic line noise |

[Open the standalone audition page](auditions.html) from a local checkout. GitHub displays HTML source rather than hosting that page; use each audio file's Raw/download action when reviewing on GitHub. Nothing has been published to Pages.

## What has actually been evaluated

- Kokoro 82M v1.0 ran locally on the CPU using `kokoro-onnx` 0.6.1. No paid API, key, voice account or external generation service was used.
- Four dry performances were generated in roughly four seconds each after initialization, for approximately six-to-seven seconds of speech per clip. This is a small local benchmark, not a hardware guarantee.
- The dry WAVs are mono 24 kHz PCM, normalized to approximately −1.7 dBFS peak with no clipped samples. MP3 review copies are mono 24 kHz / 96 kbps.
- Local Whisper tiny.en transcription reproduced the complete intended words for all six WAVs. That supports intelligibility, not emotional naturalness or forensic authenticity.
- All MP3 copies decode successfully and have the expected durations. Metadata and checksums are in `auditions/file-validation.json`.
- **A human listening assessment has not been performed. Naturalness, warmth, urgency and listening fatigue still need an ear-based audition.** No claim is made that the model can reliably perform fear, anger, whispers, interruptions or overlapping dialogue.

Kokoro is a practical candidate for development-time English dialogue generation. Its CPU speed and clear speech make a prototype feasible. Its short-utterance and expressive-performance limitations need to be judged before committing to the complete cast. Dry versions are included so filtering cannot conceal weak speech generation.

## Proposed production approach

Use consistent approved voices, short manually edited takes, pronunciation checks and scene-specific processing. Preserve unprocessed masters. Produce compressed local gameplay files and exact English subtitles. Do not ship the inference model or run TTS in the browser. Keep unidentified performances and their casting relationships out of spoiler-free review documents.

See [the full production plan](PLAN.md) and [licensing/provenance record](LICENSING.md).

## Reproduce the auditions

The generation recipe is development tooling, not part of the static game:

```sh
python3 -m venv work/tts-env
work/tts-env/bin/pip install kokoro-onnx==0.6.1 soundfile==0.14.0 scipy==1.18.1
work/tts-env/bin/python docs/production-proposal/audition_recipe.py --model-dir /path/to/local/kokoro-models --output-dir work/auditions
```

Run the final command with the virtual environment's Python. Download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the source links in LICENSING.md once during development. The model files are deliberately not committed. Python 3.12 was used for this study. The optional ASR audit also used faster-whisper 1.2.1 with Whisper tiny.en; an audio-decoder compatibility issue was bypassed by supplying resampled PCM directly to the recognizer.
