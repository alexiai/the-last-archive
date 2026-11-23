"""Extract free, local speech dynamics from the finished recordings."""
from pathlib import Path
import json, subprocess, math, struct, hashlib

root = Path(__file__).resolve().parents[2] / 'sceneplay'
audio = root / 'assets/audio'
manifest = json.loads((audio / 'manifest.json').read_text())
clips = {}
for key, clip in manifest.items():
    path = root / clip['file']
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path),
                                   '-f', 'f32le', '-ac', '1', '-ar', '24000', '-'])
    samples = struct.unpack('<' + 'f' * (len(raw) // 4), raw)
    rms = [math.sqrt(sum(x*x for x in samples[i:i+1000]) / len(samples[i:i+1000]))
           for i in range(0, len(samples), 1000)]
    peak = max(rms) or 1
    values = [round(max(0, min(1, (x/peak-.035)/.65))**.7, 3) for x in rms]
    clips[key] = {'duration': round(len(samples)/24000, 4),
                  'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                  'values': values}
(audio / 'motion.json').write_text(json.dumps({'sampleRate': 24, 'clips': clips},
                                             separators=(',', ':')))
print('Extracted dynamics from', len(clips), 'finished local recordings.')
