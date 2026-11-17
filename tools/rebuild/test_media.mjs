import fs from "node:fs";
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
for (const [id, clip] of Object.entries(manifest.clips)) {
  const file = new URL(clip.file, root);
  assert.ok(fs.existsSync(file), "local recording exists");
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
for (const p of C.puzzles)
  for (const id of p.sources)
    assert.ok(C.sources[id], "comparison source exists");
const total = [...required].reduce(
  (a, id) => a + fs.statSync(new URL("assets/world/" + id + ".jpg", root)).size,
  0,
);
console.log(
  `${checks} media/source checks passed; ${required.size} coherent views, ${(total / 1e6).toFixed(2)} MB images. Audio ${(Object.values(manifest.clips).reduce((a, c) => a + c.bytes, 0) / 1e6).toFixed(2)} MB.`,
);
