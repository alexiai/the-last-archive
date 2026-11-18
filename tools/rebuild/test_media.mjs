import fs from "node:fs";
import {RECORDINGS} from "../../casework/src/recordings.js";
import { createHash } from "node:crypto";
import path from "node:path";
import assert from "node:assert/strict";
import { CONTENT as C } from "../../casework/src/content.js";
const root = new URL("../../casework/", import.meta.url);
let checks = 0;
const required = new Set([
  "opening-night",
  "archive-room",
  "station-desk",
  "hotel-0",
  "hotel-4",
  "hotel-8",
]);
for (const scene of C.scenes || []) required.add(scene.image);
for (const s of Object.values(C.sources)) {
  if (s.image) required.add(s.image);
  assert.ok(
    s.title && typeof s.text === "string" && s.choices,
    "valid original source",
  );
  checks++;
}
const missing = [...required].filter(
  (id) => !fs.existsSync(new URL("assets/world/" + id + ".jpg", root)),
);
assert.deepEqual(missing, [], "unfinished location media");
const manifest = JSON.parse(
  fs.readFileSync(new URL("assets/audio/manifest.json", root)),
);
const waveforms=JSON.parse(fs.readFileSync(new URL('assets/audio/waveforms.json',root)));
for(const[id,data]of Object.entries(waveforms)){assert.equal(data.sha256,manifest.clips[id].sha256,'waveform measured from current finished audio');assert.ok(data.peaks.length>100&&data.peaks.every(v=>v>=0&&v<=1),'measured waveform envelope has valid samples');checks+=2;}
for(const[id,clip]of Object.entries(manifest.clips)){assert.equal(RECORDINGS[id]?.file,clip.file,'gesture-safe recording index matches finished assets');assert.equal(RECORDINGS[id]?.sha256,clip.sha256);checks+=2;}
const comparison=C.puzzles.find(p=>p.id==='alignment');comparison.answer.segments.forEach((v,i)=>{assert.deepEqual(C.audio.assembly.lines[i],C.audio['original-reel'].lines[Number(v)],'delivered passages agree with the authored original');checks++;});
for (const [id, clip] of Object.entries(manifest.clips)) {
  const file = new URL(clip.file, root);
  assert.ok(fs.existsSync(file), "local recording exists");
  assert.equal(
    createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
    clip.sha256,
    "recording matches reviewed manifest bytes",
  );
  checks++;
  assert.ok(
    clip.duration > 0 && clip.bytes > 100,
    "recording has actual audio",
  );
  checks += 2;
}
for (const id of Object.keys(C.audio))
  assert.ok(manifest.clips[id], "every recording has manifest");
for (const [id, t] of Object.entries(C.interviews)) {
  assert.ok(manifest.clips["talk." + id + ".open"]);
  for (const source of Object.keys(t.present))
    assert.ok(manifest.clips["talk." + id + ".e." + source]);
}
const spoken = (id, text) => {
  assert.equal(
    manifest.clips[id]?.segments.map((s) => s.text).join("\n"),
    text,
    "finished recording script matches the implemented transcript",
  );
  checks++;
};
for (const [id, a] of Object.entries(C.audio))
  if (a.lines.length) spoken(id, a.lines.map(([, t]) => t).join("\n"));
for (const [id, t] of Object.entries(C.interviews)) {
  spoken("talk." + id + ".open", t.opening);
  t.questions.forEach(([, text], i) => spoken("talk." + id + ".q" + i, text));
  for (const [source, text] of Object.entries(t.present))
    spoken("talk." + id + ".e." + source, text);
}
spoken("ending.julia", C.ending.response);
C.ending.questions.forEach(([, text], i) => spoken("ending.julia.q" + i, text));
for (const p of C.puzzles)
  for (const id of p.sources)
    assert.ok(C.sources[id], "comparison source exists");
const films=JSON.parse(fs.readFileSync(new URL('assets/films/manifest.json',root)));
for(const [name,info] of Object.entries(films.files)) {
 const bytes=fs.readFileSync(new URL('assets/films/'+name,root));
 assert.equal(bytes.length,info.bytes,'finished film bytes indexed');
 assert.equal(createHash('sha256').update(bytes).digest('hex'),info.sha256,'finished film hash');checks+=2;
}
assert.equal(films.opening.duration,38);assert.equal(films.opening.captionLanguage,'en');
assert.equal(films.files['hotel-camera.mp4'].audio,false);checks+=3;
for(let i=0;i<9;i++){assert.ok(fs.statSync(new URL('assets/surveillance/hotel-'+i+'.jpg',root)).size>10000);checks++;}
for(const shot of films.opening.shots){assert.ok(!['room-before','room-prepared','shelf-before','opening-night'].includes(shot.source),'opening uses only the same preserved room state');checks++;}
const total = [...required].reduce(
  (a, id) => a + fs.statSync(new URL("assets/world/" + id + ".jpg", root)).size,
  0,
);
console.log(
  `${checks} media/source checks passed; ${required.size} coherent views, ${(total / 1e6).toFixed(2)} MB images. Audio ${(Object.values(manifest.clips).reduce((a, c) => a + c.bytes, 0) / 1e6).toFixed(2)} MB.`,
);
