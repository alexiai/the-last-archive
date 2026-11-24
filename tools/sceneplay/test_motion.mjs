import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { waveformMarkup, clockText } from "../../sceneplay/src/recording.js";
const root = new URL("../../sceneplay/", import.meta.url);
// Resolve the browser's local import-map entry for this Node-only verification.
const officerSource = fs
  .readFileSync(new URL("src/officer.js", root), "utf8")
  .replace(
    'from "three"',
    `from ${JSON.stringify(new URL("vendor/three.module.js", root).href)}`,
  );
const { speechLevel } = await import(
  "data:text/javascript;base64," + Buffer.from(officerSource).toString("base64")
);
const motion = JSON.parse(
  fs.readFileSync(new URL("assets/audio/motion.json", root)),
);
const voices = JSON.parse(
  fs.readFileSync(new URL("assets/audio/manifest.json", root)),
);
assert.equal(motion.sampleRate, 24);
let checks = 1;
for (const [id, voice] of Object.entries(voices)) {
  const clip = motion.clips[id];
  assert.ok(clip && clip.duration > 0);
  assert.equal(
    crypto
      .createHash("sha256")
      .update(fs.readFileSync(new URL(voice.file, root)))
      .digest("hex"),
    clip.sha256,
  );
  assert.ok(clip.values.length >= Math.floor(clip.duration * 24));
  assert.ok(clip.values.every((v) => Number.isFinite(v) && v >= 0 && v <= 1));
  assert.equal(speechLevel(clip, 24, -1), 0);
  assert.equal(speechLevel(clip, 24, clip.duration + 0.1), 0);
  assert.ok(
    clip.values.some((v) => v > 0.5) && clip.values.some((v) => v < 0.05),
  );
  checks += 7;
}
const fixture = { duration: 1, values: [0, 1, 0] };
assert.equal(speechLevel(fixture, 2, 0.25), 0.5);
assert.equal(speechLevel(fixture, 2, 0.5), 1);
assert.equal(clockText(65.8), "1:05");
assert.equal(
  (waveformMarkup(motion.clips.iris).match(/<path /g) || []).length,
  192,
);
checks += 4;
console.log(
  `${checks} recorded-speech envelope, silence, interpolation and recording transport checks passed.`,
);
