"""Measured RMS envelopes from finished recordings, not decorative sound graphics."""
from pathlib import Path
import json,subprocess,array,math,hashlib
root=Path(__file__).resolve().parents[2];audio=root/'casework/assets/audio';manifest=json.loads((audio/'manifest.json').read_text());result={}
for key,clip in manifest['clips'].items():
 if key.startswith(('talk.','ending.')):continue
 file=root/'casework'/clip['file'];data=subprocess.check_output(['ffmpeg','-v','error','-i',str(file),'-f','f32le','-ac','1','-ar','8000','-']);samples=array.array('f');samples.frombytes(data)
 count=240;step=max(1,math.ceil(len(samples)/count));peaks=[]
 for i in range(0,len(samples),step):
  block=samples[i:i+step];peaks.append(math.sqrt(sum(x*x for x in block)/max(1,len(block))))
 top=max(peaks,default=1) or 1
 result[key]={'duration':clip['duration'],'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'peaks':[round(x/top,3) for x in peaks]}
(audio/'waveforms.json').write_text(json.dumps(result,separators=(',',':')));print('Measured waveform envelopes:',len(result))
index={key:{k:clip[k] for k in ['file','duration','segments','sha256']} for key,clip in manifest['clips'].items()}
for clip in index.values():
 for segment in clip['segments']:segment.pop('text',None)
(root/'casework/src/recordings.js').write_text('export const RECORDINGS = '+json.dumps(index,separators=(',',':'))+';\n')
