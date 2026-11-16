# Audio study: licensing and provenance

Checked 16 November 2026. This records the upstream licences actually found; it is not a claim that all neural models or community voice packs have the same terms.

| Component | Upstream licence / source | Role and distribution boundary |
|---|---|---|
| Kokoro 82M v1.0 weights | Apache 2.0; [official model card](https://huggingface.co/hexgrad/Kokoro-82M), [official code licence](https://github.com/hexgrad/kokoro/blob/main/LICENSE) | Local development inference. Weights are not included in this branch or the static game. |
| Selected English voice tensors | Distributed in the same Apache-licensed official model repository; [voice list](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md) | Only `af_heart`, `af_bella`, `am_michael`, `bm_george` were used for these auditions. No additional community voice pack or custom voice clone was used. |
| ONNX model / voice conversion | [kokoro-onnx model-files-v1.1 release](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.1); upstream identifies model as Apache 2.0 | Actual input files: `kokoro-v1.0.onnx`, `voices-v1.0.bin`. Their SHA-256 hashes are recorded in the sample metadata. |
| kokoro-onnx 0.6.1 | MIT; [source](https://github.com/thewh1teagle/kokoro-onnx) | Development-only wrapper. Licence copy retained. |
| ONNX Runtime | MIT; [source](https://github.com/microsoft/onnxruntime/blob/main/LICENSE) | Development-only CPU inference. Telemetry was disabled in the recipe. No runtime browser dependency. |
| Phonemizer | GPL v3 or later; [source](https://github.com/bootphon/phonemizer) | Development-only text-to-phoneme tooling. Its binary/library is not bundled with the game. |
| eSpeak NG | GPL v3 or later; [source](https://github.com/espeak-ng/espeak-ng) | Development-only phonemization library, not a shipped character performance engine. |
| espeakng-loader | MIT loader; [source](https://github.com/thewh1teagle/espeakng-loader/blob/main/LICENSE) | Loader used during development; it loads the separately GPL-licensed eSpeak library. Neither is included in the static build. |
| NumPy, SciPy, SoundFile | NumPy package lists BSD/0BSD/MIT/Zlib/CC0 component terms; SciPy and SoundFile use BSD-family terms | Development-time array processing and file writing. No binary toolchain is shipped. |
| faster-whisper / Whisper | MIT upstream packages/model | Development-only intelligibility check, not part of generation or gameplay. |
| FFmpeg | Development executable; its compiled configuration determines LGPL/GPL obligations | Used only to encode MP3 review copies. No FFmpeg binary is redistributed. |
| Audition sentences, processing, synthetic line noise | Newly authored for this project | No sampled recording, third-party music, or third-party sound effect is present in the auditions. |

The upstream Kokoro model card acknowledges Koniwa (CC BY 3.0) and SIWIS (CC BY 4.0) training material. Retain the model card's acknowledgements in the final production provenance record. The voice list specifically labels relevant non-English training sources; these auditions use English voices only.

Copies of the primary software/model notices are in `licences/`. The original project owner retains the decision about the game's overall distribution licence; this study does not relicense the game or claim exclusive copyright in synthetic voices.

## Future music, effects and reference imagery

The proposal is to author music, ringing, notifications, ambience and transition effects specifically for this game. Keep a manifest for each asset: creator, source, licence, attribution, modifications, role and file hash. Any externally sourced asset must have an explicit compatible licence before it enters the game. Pinterest availability does not establish reuse rights. The supplied references are inspiration only; their photographs, articles, identities, logos and non-English text are not included in this study.
