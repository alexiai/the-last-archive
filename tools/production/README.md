# Local production tools

These tools are development-only and are excluded from dist. Use Python 3.11+, kokoro-onnx 0.6.1, ONNX Runtime CPU, NumPy, SciPy, SoundFile and FFmpeg for voices. Supply official Kokoro v1.0 ONNX weights and voices-v1.0.bin in a directory outside the repository. Never commit the model files or WAV masters. Upstream licences and input hashes are retained in docs/production-proposal.

From the project root:

```
node tools/production/export_jobs.cjs /tmp/archive-production
python tools/production/generate_voices.py --models /path/to/models --jobs /tmp/archive-production/audio-jobs.json --masters /tmp/archive-masters
python tools/production/render_documents.py --data /tmp/archive-production/archive-docs.json
```

The exported job file is solution-bearing development material; keep it out of previews and distribution. The soundscape generator provides --help for local output paths; the surveillance generator uses the project root. PDFs use ReportLab, animation uses Pillow/NumPy/FFmpeg, and soundscapes use NumPy/SciPy/SoundFile/FFmpeg. No paid service is invoked. Listening review is required before release; synthetic output and automated ASR are not actor direction or a quality guarantee.
